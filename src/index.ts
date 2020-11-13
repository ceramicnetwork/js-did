import { DIDCache, DIDDocument, DIDResolver, Resolver } from 'did-resolver'
import { RPCClient, RPCConnection } from 'rpc-utils'
import { createJWE, JWE, verifyJWS, resolveX25519Encrypters } from 'did-jwt'
import { encodePayload, prepareCleartext, decodeCleartext } from 'dag-jose-utils'
import {
  DagJWS,
  toDagJWS,
  fromDagJWS,
  encodeBase64,
  base64urlToJSON,
  decodeBase64,
  encodeBase64Url,
} from './utils'

export type { DIDDocument } from 'did-resolver'
export type { DagJWS, JWSSignature } from './utils'
export type DIDProvider = RPCConnection
export type ResolverRegistry = Record<string, DIDResolver>

export interface AuthenticateOptions {
  provider?: DIDProvider
}

export interface AuthenticateResult {
  did: string
}

export interface CreateJWSOptions {
  did?: string
  protected?: Record<string, any>
  linkedBlock?: string
}

export interface CreateJWSParams extends CreateJWSOptions {
  payload: any
}

export interface CreateJWSResult {
  jws: string // base64-encoded
}

export interface VerifyJWSResult {
  kid: string
}

export interface CreateJWEOptions {
  protectedHeader?: Record<string, any>
  aad?: Uint8Array
}

export interface DecryptJWEOptions {
  did?: string
}

export interface DecryptJWEParams extends DecryptJWEOptions {
  jwe: JWE
}

export interface DecryptJWEResult {
  cleartext: string // base64-encoded
}

export interface DagJWSResult {
  jws: DagJWS
  linkedBlock: Uint8Array
}

export interface ResolverOptions {
  registry?: ResolverRegistry
  cache?: DIDCache | boolean
}

export interface DIDOptions {
  provider?: DIDProvider
  resolver?: Resolver | ResolverOptions
}

/**
 * Interact with DIDs.
 */
export class DID {
  private _client?: RPCClient
  private _id?: string
  private _resolver!: Resolver

  constructor({ provider, resolver = {} }: DIDOptions = {}) {
    if (provider != null) {
      this._client = new RPCClient(provider)
    }
    this.setResolver(resolver)
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
   */
  setResolver(resolver: Resolver | ResolverOptions): void {
    this._resolver =
      resolver instanceof Resolver ? resolver : new Resolver(resolver.registry, resolver.cache)
  }

  /**
   * Authenticate the user.
   */
  async authenticate({ provider }: AuthenticateOptions = {}): Promise<string> {
    if (provider != null) {
      this.setProvider(provider)
    }
    if (this._client == null) {
      throw new Error('No provider available')
    }
    const { did } = await this._client.request<void, AuthenticateResult>('did_authenticate')
    this._id = did
    return did
  }

  /**
   * Create a JWS encoded signature over the given payload.
   * Will be signed by the currently authenticated DID.
   *
   * @param payload             The payload to sign
   * @param options             Optional parameters
   */
  async createJWS<T = any>(payload: T, options: CreateJWSOptions = {}): Promise<string> {
    if (this._client == null) throw new Error('No provider available')
    if (this._id == null) throw new Error('DID is not authenticated')
    if (!options.did) options.did = this._id
    const { jws } = await this._client.request<CreateJWSParams, CreateJWSResult>('did_createJWS', {
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
    const compactJws = await this.createJWS(payloadCid, options)
    const jws = toDagJWS(compactJws, cid)
    return { jws, linkedBlock }
  }

  /**
   * Verify a JWS. Uses the 'kid' in the header as the way to resolve
   * the author public key.
   *
   * @param jws                 The JWS to verify
   * @returns                   Information about the signed JWS
   */
  async verifyJWS(jws: string | DagJWS): Promise<VerifyJWSResult> {
    if (typeof jws !== 'string') jws = fromDagJWS(jws)
    const kid = base64urlToJSON(jws.split('.')[0]).kid as string
    if (!kid) throw new Error('No "kid" found in jws')
    const { publicKey } = await this.resolve(kid)
    // verifyJWS will throw an error if the signature is invalid
    verifyJWS(jws, publicKey)
    // In the future, returned obj will need to contain
    // more metadata about the key that signed the jws.
    return { kid }
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
    if (!options.did) options.did = this._id
    const { cleartext } = await this._client.request<DecryptJWEParams, DecryptJWEResult>(
      'did_decryptJWE',
      { ...options, jwe }
    )
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
  async resolve(didUrl: string): Promise<DIDDocument> {
    return await this._resolver.resolve(didUrl)
  }
}
