import { ResolverOptions, DIDResolutionResult, ResolverRegistry, Resolver } from 'did-resolver'
import { createJWE, JWE, verifyJWS, resolveX25519Encrypters } from 'did-jwt'
import { encodePayload, prepareCleartext, decodeCleartext } from 'dag-jose-utils'
import { RPCClient } from 'rpc-utils'
import { CID } from 'multiformats/cid'
import { CacaoBlock, Cacao } from 'ceramic-cacao'
import type { DagJWS, DIDProvider, DIDProviderClient } from './types.js'
import {
  fromDagJWS,
  encodeBase64,
  base64urlToJSON,
  decodeBase64,
  encodeBase64Url,
  randomString,
  didWithTime,
  extractControllers,
} from './utils.js'

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

  /**
   * If true, timestamp checking is disabled.
   */
  disableTimecheck?: boolean

  /**
   * DID that issued the signature.
   */
  issuer?: string

  /**
   * Cacao OCAP to verify the JWS with.
   */
  capability?: Cacao

  /**
   * Number of seconds that a revoked key stays valid for after it was revoked
   */
  revocationPhaseOutSecs?: number
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
  cacaoBlock?: Uint8Array
}

export interface DIDOptions {
  provider?: DIDProvider
  resolver?: Resolver | ResolverRegistry
  resolverOptions?: ResolverOptions
  capability?: Cacao
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
  private _capability?: Cacao

  constructor({ provider, resolver = {}, resolverOptions, capability }: DIDOptions = {}) {
    if (provider != null) {
      this._client = new RPCClient(provider)
    }
    if (capability) {
      this._capability = capability
    }
    this.setResolver(resolver, resolverOptions)
  }

  /**
   * Check if the DID has a capability attached
   */
  get capability(): Cacao {
    if (!this._capability) {
      throw new Error('DID has no capability attached')
    }
    return this._capability
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
   * Attach a capability to the DID instance
   * @param cap The capability to attach
   * @returns A new DID instance with the capability attached
   */
  withCapability(cap: Cacao): DID {
    return new DID({
      provider: this._client?.connection,
      resolver: this._resolver,
      capability: cap,
    })
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
    if (this._capability) {
      const cacaoBlock = await CacaoBlock.fromCacao(this._capability)
      const capCID = CID.asCID(cacaoBlock.cid)
      if (!capCID) {
        throw new Error(
          `Capability CID of the JWS cannot be set to the capability payload cid as they are incompatible`
        )
      }
      options.protected = options.protected || {}
      options.protected.cap = `ipfs://${capCID?.toString()}`
    }
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

    const compatibleCID = CID.asCID(cid)
    if (!compatibleCID) {
      throw new Error(
        'CID of the JWS cannot be set to the encoded payload cid as they are incompatible'
      )
    }
    jws.link = compatibleCID

    if (this._capability) {
      const cacaoBlock = await CacaoBlock.fromCacao(this._capability)
      return { jws, linkedBlock, cacaoBlock: cacaoBlock.bytes }
    }
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
    const timecheckEnabled = !options.disableTimecheck
    if (timecheckEnabled) {
      const nextUpdate = didResolutionResult.didDocumentMetadata?.nextUpdate
      if (nextUpdate) {
        // This version of the DID document has been revoked. Check if the JWS
        // was signed before the revocation happened.
        const phaseOutMS = options.revocationPhaseOutSecs
          ? options.revocationPhaseOutSecs * 1000
          : 0
        const revocationTime = new Date(nextUpdate).valueOf() + phaseOutMS
        const isEarlier = options.atTime && options.atTime < revocationTime
        const isLater = !isEarlier
        if (isLater) {
          // Do not allow using a key _after_ it is being revoked
          throw new Error(`invalid_jws: signature authored with a revoked DID version: ${kid}`)
        }
      }
      // Key used before `updated` date
      const updated = didResolutionResult.didDocumentMetadata?.updated
      if (updated && options.atTime && options.atTime < new Date(updated).valueOf()) {
        throw new Error(`invalid_jws: signature authored before creation of DID version: ${kid}`)
      }
    }

    const signerDid = didResolutionResult.didDocument?.id
    if (
      options.issuer &&
      options.issuer === options.capability?.p.iss &&
      signerDid === options.capability.p.aud
    ) {
      Cacao.verify(options.capability, {
        atTime: options.atTime,
      })
    } else if (options.issuer && options.issuer !== signerDid) {
      const issuerUrl = didWithTime(options.issuer, options.atTime)
      const issuerResolution = await this.resolve(issuerUrl)
      const controllerProperty = issuerResolution.didDocument?.controller
      const controllers = extractControllers(controllerProperty)

      if (
        options.capability?.s &&
        options.capability.p.aud === signerDid &&
        controllers.includes(options.capability.p.iss)
      ) {
        Cacao.verify(options.capability, {
          atTime: options.atTime,
        })
      } else {
        const signerIsController = signerDid ? controllers.includes(signerDid) : false
        if (!signerIsController) {
          throw new Error(`invalid_jws: not a valid verificationMethod for issuer: ${kid}`)
        }
      }
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
    const preparedCleartext = await prepareCleartext(cleartext)
    return this.createJWE(preparedCleartext, recipients, options)
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
