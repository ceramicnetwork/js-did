import { DIDCache, DIDDocument, DIDResolver, Resolver } from 'did-resolver'
import { RPCClient, RPCConnection } from 'rpc-utils'
import { x25519Encrypter, createJWE, JWE } from 'did-jwt'

import {
  DagJWS,
  toDagJWS,
  encodePayload,
  encodeIdentityCID,
  decodeIdentityCID,
  pad,
  unpad,
  encodeBase64,
  decodeBase64,
  decodeBase58,
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
    const payloadCid = encodeBase64(cid.bytes)
    Object.assign(options, { linkedBlock: encodeBase64(linkedBlock) })
    const compactJws = await this.createJWS(payloadCid, options)
    const jws = toDagJWS(compactJws, cid)
    return { jws, linkedBlock }
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
    const encrypters = await Promise.all(
      recipients.map(async (did) => {
        const didDoc = await this.resolve(did)
        try {
          const b58Key = didDoc.keyAgreement?.find((key) => {
            if (typeof key === 'string') {
              throw new Error(`String key ids not supported for now: ${did}`)
            }
            return key.type === 'X25519KeyAgreementKey2019'
          }) as { publicKeyBase58: string } // a little hacky, revisit once DID-core spec is finalized
          return x25519Encrypter(decodeBase58(b58Key.publicKeyBase58))
        } catch (e) {
          throw new Error(`Could not find x25519 key for ${did}: ${e as string}`)
        }
      })
    )
    return createJWE(pad(cleartext), encrypters, options.protectedHeader, options.aad)
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
    const { bytes } = encodeIdentityCID(cleartext)
    return this.createJWE(bytes, recipients, options)
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
    return unpad(decodeBase64(cleartext))
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
    return decodeIdentityCID(bytes)
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
