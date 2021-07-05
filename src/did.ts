import { ResolverOptions, DIDResolutionResult, ResolverRegistry, Resolver } from 'did-resolver'
import { createJWE, JWE, verifyJWS, resolveX25519Encrypters } from 'did-jwt'
import { encodePayload, prepareCleartext, decodeCleartext } from 'dag-jose-utils'
import { RPCClient } from 'rpc-utils'

import type { DagJWS, DIDProvider, DIDProviderClient } from './types'
import {
  fromDagJWS,
  encodeBase64,
  base64urlToJSON,
  decodeBase64,
  encodeBase64Url,
  randomString,
} from './utils'

export interface AuthenticateOptions {
  provider?: DIDProvider
  aud?: string
  paths?: Array<string>
}

export interface AuthenticateParams {
  nonce: string
  aud?: string
  paths?: Array<string>
}

export interface AuthenticateResponse extends AuthenticateParams {
  did: string
  exp: number
}

export interface CreateJWSOptions {
  did?: string
  protected?: Record<string, any>
  linkedBlock?: string
}

export interface VerifyJWSOptions {
  /**
   * JS timestamp when the signature was allegedly made. `undefined` means _now_.
   */
  atTime?: number
}

export interface VerifyJWSResult {
  kid: string
  payload?: Record<string, any>
  didResolutionResult: DIDResolutionResult
}

export interface CreateJWEOptions {
  protectedHeader?: Record<string, any>
  aad?: Uint8Array
}

export interface DecryptJWEOptions {
  did?: string
}

export interface DecryptJWEResult {
  cleartext: string // base64-encoded
}

export interface DagJWSResult {
  jws: DagJWS
  linkedBlock: Uint8Array
}

export interface DIDOptions {
  provider?: DIDProvider
  resolver?: Resolver | ResolverRegistry
  resolverOptions?: ResolverOptions
}

function isResolver(resolver: Resolver | ResolverRegistry): resolver is Resolver {
  return 'registry' in resolver && 'cache' in resolver
}

/**
 * Interact with DIDs.
 */
export class DID {
  private _client?: DIDProviderClient
  private _id?: string
  private _resolver!: Resolver

  constructor({ provider, resolver = {}, resolverOptions }: DIDOptions = {}) {
    if (provider != null) {
      this._client = new RPCClient(provider)
    }
    this.setResolver(resolver, resolverOptions)
  }

  /**
   * Check if user is authenticated.
   */
  get authenticated(): boolean {
    return this._id != null
  }

  /**
   * Get the DID identifier of the user.
   */
  get id(): string {
    if (this._id == null) {
      throw new Error('DID is not authenticated')
    }
    return this._id
  }

  /**
   * Set the DID provider of this instance.
   * Only callable if provider not already set.
   *
   * @param provider    The DIDProvider to use
   */
  setProvider(provider: DIDProvider): void {
    if (this._client == null) {
      this._client = new RPCClient(provider)
    } else if (this._client.connection !== provider) {
      throw new Error(
        'A different provider is already set, create a new DID instance to use another provider'
      )
    }
  }

  /**
   * Set the DID-resolver user by this instance
   *
   * @param resolver            Either a Resolver instance or an object with specific resolvers
   * @param resolverOptions     Options to use for the created resolver. Will be ignored if a Resolver instance is passed
   */
  setResolver(resolver: Resolver | ResolverRegistry, resolverOptions?: ResolverOptions): void {
    this._resolver = isResolver(resolver) ? resolver : new Resolver(resolver, resolverOptions)
  }

  /**
   * Authenticate the user.
   */
  async authenticate({ provider, paths = [], aud }: AuthenticateOptions = {}): Promise<string> {
    if (provider != null) {
      this.setProvider(provider)
    }
    if (this._client == null) {
      throw new Error('No provider available')
    }
    const nonce = randomString()
    const jws = await this._client.request('did_authenticate', {
      nonce,
      aud,
      paths,
    })
    const { kid } = await this.verifyJWS(jws)
    const payload = base64urlToJSON(jws.payload) as AuthenticateResponse
    if (!kid.includes(payload.did)) throw new Error('Invalid authencation response, kid mismatch')
    if (payload.nonce !== nonce) throw new Error('Invalid authencation response, wrong nonce')
    if (payload.aud !== aud) throw new Error('Invalid authencation response, wrong aud')
    if (payload.exp < Date.now() / 1000) throw new Error('Invalid authencation response, expired')
    this._id = payload.did
    return this._id
  }

  /**
   * Create a JWS encoded signature over the given payload.
   * Will be signed by the currently authenticated DID.
   *
   * @param payload             The payload to sign
   * @param options             Optional parameters
   */
  async createJWS<T = any>(payload: T, options: CreateJWSOptions = {}): Promise<DagJWS> {
    if (this._client == null) throw new Error('No provider available')
    if (this._id == null) throw new Error('DID is not authenticated')
    const { jws } = await this._client.request('did_createJWS', {
      did: this._id,
      ...options,
      payload,
    })
    return jws
  }

  /**
   * Create an IPFS compatibe DagJWS encoded signature over the given payload.
   * Will be signed by the currently authenticated DID.
   *
   * @param payload             The payload to sign, may include ipld links
   * @param options             Optional parameters
   */
  async createDagJWS(
    payload: Record<string, any>,
    options: CreateJWSOptions = {}
  ): Promise<DagJWSResult> {
    const { cid, linkedBlock } = await encodePayload(payload)
    const payloadCid = encodeBase64Url(cid.bytes)
    Object.assign(options, { linkedBlock: encodeBase64(linkedBlock) })
    const jws = await this.createJWS(payloadCid, options)
    jws.link = cid
    return { jws, linkedBlock }
  }

  /**
   * Verify a JWS. Uses the 'kid' in the header as the way to resolve
   * the author public key.
   *
   * @param jws                 The JWS to verify
   * @param options             Optional arguments for verification
   * @returns                   Information about the signed JWS
   */
  async verifyJWS(jws: string | DagJWS, options: VerifyJWSOptions = {}): Promise<VerifyJWSResult> {
    if (typeof jws !== 'string') jws = fromDagJWS(jws)
    const kid = base64urlToJSON(jws.split('.')[0]).kid as string
    if (!kid) throw new Error('No "kid" found in jws')
    const didResolutionResult = await this.resolve(kid)
    const nextUpdate = didResolutionResult.didDocumentMetadata?.nextUpdate
    if (nextUpdate) {
      // This version of the DID document has been revoked. Check if the JWS
      // was signed before it the revocation happened.
      const isEarlier = options.atTime && options.atTime < new Date(nextUpdate).valueOf()
      const isLater = !isEarlier
      if (isLater) {
        // Do not allow using a key _after_ it is being revoked
        throw new Error(`JWS was signed with a revoked DID version: ${kid}`)
      }
    }
    // Key used before `created` date
    const created = didResolutionResult.didDocumentMetadata?.created
    const versionId = didResolutionResult.didDocumentMetadata?.versionId
    const notV0 = versionId !== '0'
    if (notV0 && created && options.atTime && options.atTime < new Date(created).valueOf()) {
      throw new Error(`JWS was signed with a not-yet created DID version: ${kid}`)
    }
    const publicKeys = didResolutionResult.didDocument?.verificationMethod || []
    // verifyJWS will throw an error if the signature is invalid
    verifyJWS(jws, publicKeys)
    let payload
    try {
      payload = base64urlToJSON(jws.split('.')[1])
    } catch (e) {
      // If an error is thrown it means that the payload is a CID.
    }
    return { kid, payload, didResolutionResult }
  }

  /**
   * Create a JWE encrypted to the given recipients.
   *
   * @param cleartext           The cleartext to be encrypted
   * @param recipients          An array of DIDs
   * @param options             Optional parameters
   */
  async createJWE(
    cleartext: Uint8Array,
    recipients: Array<string>,
    options: CreateJWEOptions = {}
  ): Promise<JWE> {
    const encrypters = await resolveX25519Encrypters(recipients, this._resolver)
    return createJWE(cleartext, encrypters, options.protectedHeader, options.aad)
  }

  /**
   * Create an IPFS compatibe DagJWE encrypted to the given recipients.
   *
   * @param cleartext           The cleartext to be encrypted, may include ipld links
   * @param recipients          An array of DIDs
   * @param options             Optional parameters
   */
  async createDagJWE(
    cleartext: Record<string, any>,
    recipients: Array<string>,
    options: CreateJWEOptions = {}
  ): Promise<JWE> {
    return this.createJWE(prepareCleartext(cleartext), recipients, options)
  }

  /**
   * Try to decrypt the given JWE with the currently authenticated user.
   *
   * @param jwe                 The JWE to decrypt
   * @param options             Optional parameters
   */
  async decryptJWE(jwe: JWE, options: DecryptJWEOptions = {}): Promise<Uint8Array> {
    if (this._client == null) throw new Error('No provider available')
    if (this._id == null) throw new Error('DID is not authenticated')
    const { cleartext } = await this._client.request('did_decryptJWE', {
      did: this._id,
      ...options,
      jwe,
    })
    return decodeBase64(cleartext)
  }

  /**
   * Try to decrypt the given DagJWE with the currently authenticated user.
   *
   * @param jwe                 The JWE to decrypt
   * @param options             Optional parameters
   * @returns                   An ipld object
   */
  async decryptDagJWE(jwe: JWE): Promise<Record<string, any>> {
    const bytes = await this.decryptJWE(jwe)
    return decodeCleartext(bytes)
  }

  /**
   * Resolve the DID Document of the given DID.
   *
   * @param didUrl              The DID to resolve
   */
  async resolve(didUrl: string): Promise<DIDResolutionResult> {
    const result = await this._resolver.resolve(didUrl)
    if (result.didResolutionMetadata.error) {
      const { error, message } = result.didResolutionMetadata
      const maybeMessage = message ? `, ${message as string}` : ''
      throw new Error(`Failed to resolve ${didUrl}: ${error}${maybeMessage}`)
    }
    return result
  }
}
