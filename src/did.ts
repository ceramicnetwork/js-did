import type { JWE } from 'did-jwt'
import { Resolver } from 'did-resolver'
import type {
  DIDResolutionOptions,
  DIDResolutionResult,
  Resolvable,
  ResolverOptions,
  ResolverRegistry,
} from 'did-resolver'
import { RPCClient } from 'rpc-utils'

import { createDagJWS, createDIDJWS, decryptDagJWE, decryptDIDJWE } from './providable'
import type {
  Authenticated,
  AuthenticateOptions,
  AuthenticateParamsOptions,
  CreateJWSOptions,
  DagJWSResult,
  DecryptJWEOptions,
  Providable,
} from './providable'
import { createDagJWE, createDIDJWE, resolveDID, verifyDIDJWS } from './resolvable'
import type { CreateJWEOptions, VerifyJWSResult } from './resolvable'
import type { DagJWS, DIDProviderClient, DIDProviderOrClient } from './types'
import { base64urlToJSON, randomString } from './utils'

type AuthenticateResponse = AuthenticateParamsOptions & {
  did: string
  exp: number
  nonce: string
}

function isResolver(resolver: Resolver | ResolverRegistry): resolver is Resolver {
  return 'registry' in resolver && 'cache' in resolver
}

export type DIDCommonOptions = {
  resolver?: Resolver | ResolverRegistry
  resolverOptions?: ResolverOptions
}

export type DIDOptions = DIDCommonOptions & { provider?: DIDProviderOrClient }

export type AuthDIDParams = DIDCommonOptions &
  AuthenticateParamsOptions & { provider: DIDProviderOrClient }

/**
 * Interact with DIDs.
 */
export class DID implements Providable, Resolvable {
  _client?: DIDProviderClient
  _id?: string

  resolver!: Resolver

  constructor({ provider, resolver = {}, resolverOptions }: DIDOptions = {}) {
    if (provider != null) {
      this.setProvider(provider)
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
  get id(): string | undefined {
    return this._id
  }

  get providerClient(): DIDProviderClient {
    if (this._client == null) {
      throw new Error('Provider client is not defined')
    }
    return this._client
  }

  /**
   * Set the DID provider of this instance.
   * Only callable if provider not already set.
   *
   * @param provider    The DIDProvider to use
   */
  setProvider(provider: DIDProviderOrClient): void {
    const client = provider instanceof RPCClient ? provider : new RPCClient(provider)
    if (this._client == null) {
      this._client = client
    } else if (this._client.connection !== client.connection) {
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
    this.resolver = isResolver(resolver) ? resolver : new Resolver(resolver, resolverOptions)
  }

  /**
   * Authenticate the user.
   */
  async authenticate({ provider, paths = [], aud }: AuthenticateOptions = {}): Promise<string> {
    if (provider != null) {
      this.setProvider(provider)
    }
    const nonce = randomString()
    const jws = await this.providerClient.request('did_authenticate', { nonce, aud, paths })
    const { kid } = await this.verifyJWS(jws)
    const payload = base64urlToJSON(jws.payload) as AuthenticateResponse
    if (!kid.includes(payload.did)) throw new Error('Invalid authentication response, kid mismatch')
    if (payload.nonce !== nonce) throw new Error('Invalid authentication response, wrong nonce')
    if (payload.aud !== aud) throw new Error('Invalid authentication response, wrong aud')
    if (payload.exp < Date.now() / 1000) throw new Error('Invalid authenctiation response, expired')
    this._id = payload.did
    return this._id
  }

  async toAuthenticated(options: AuthenticateOptions = {}): Promise<AuthDID> {
    if (this instanceof AuthDID) {
      return this
    }

    const params = { ...options, resolver: this.resolver }
    if (params.provider == null) {
      params.provider = this.providerClient
    }
    return await AuthDID.create(params as AuthDIDParams)
  }

  /**
   * Create a JWS encoded signature over the given payload.
   * Will be signed by the currently authenticated DID.
   *
   * @param payload             The payload to sign
   * @param options             Optional parameters
   */
  async createJWS<T = any>(payload: T, options: CreateJWSOptions = {}): Promise<DagJWS> {
    const auth = await this.toAuthenticated()
    return await createDIDJWS(auth, payload, options)
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
    const auth = await this.toAuthenticated()
    return await createDagJWS(auth, payload, options)
  }

  /**
   * Verify a JWS. Uses the 'kid' in the header as the way to resolve
   * the author public key.
   *
   * @param jws                 The JWS to verify
   * @returns                   Information about the signed JWS
   */
  async verifyJWS(jws: string | DagJWS): Promise<VerifyJWSResult> {
    return await verifyDIDJWS(this.resolver, jws)
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
    return await createDIDJWE(this.resolver, cleartext, recipients, options)
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
    return await createDagJWE(this.resolver, cleartext, recipients, options)
  }

  /**
   * Try to decrypt the given JWE with the currently authenticated user.
   *
   * @param jwe                 The JWE to decrypt
   * @param options             Optional parameters
   */
  async decryptJWE(jwe: JWE, options: DecryptJWEOptions = {}): Promise<Uint8Array> {
    const auth = await this.toAuthenticated()
    return await decryptDIDJWE(auth, jwe, options)
  }

  /**
   * Try to decrypt the given DagJWE with the currently authenticated user.
   *
   * @param jwe                 The JWE to decrypt
   * @param options             Optional parameters
   * @returns                   An ipld object
   */
  async decryptDagJWE(jwe: JWE): Promise<Record<string, any>> {
    const auth = await this.toAuthenticated()
    return await decryptDagJWE(auth, jwe)
  }

  /**
   * Resolve the DID Document of the given DID.
   *
   * @param didUrl              The DID to resolve
   */
  async resolve(didUrl: string, options?: DIDResolutionOptions): Promise<DIDResolutionResult> {
    return await resolveDID(this.resolver, didUrl, options)
  }
}

export class AuthDID extends DID implements Authenticated {
  static async create(params: AuthDIDParams): Promise<AuthDID> {
    const did = new AuthDID(params)
    await did.authenticate(params)
    return did
  }

  get authenticated(): true {
    if (this._id == null) {
      throw new Error('AuthDID is not authenticated, was it created using AuthDID.create()?')
    }
    return true
  }

  get id(): string {
    if (this._id == null) {
      throw new Error('AuthDID is not authenticated, was it created using AuthDID.create()?')
    }
    return this._id
  }
}
