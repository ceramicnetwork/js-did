import type { JWE } from 'did-jwt'
import { Resolver } from 'did-resolver'
import type { ResolverOptions, DIDResolutionResult, ResolverRegistry } from 'did-resolver'
import { RPCClient } from 'rpc-utils'
import type { RPCConnection } from 'rpc-utils'

import { createDagJWS, createDIDJWS, decryptDagJWE, decryptDIDJWE } from './authenticated'
import type {
  Authenticated,
  CreateJWSOptions,
  DagJWSResult,
  DecryptJWEOptions,
} from './authenticated'
import { createDagJWE, createDIDJWE, resolveDID, verifyDIDJWS } from './resolvable'
import type { CreateJWEOptions, Resolvable, VerifyJWSResult } from './resolvable'
import { base64urlToJSON, randomString } from './utils'
import type { DagJWS } from './utils'

export type DIDProvider = RPCConnection

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
  _client?: RPCClient
  _id?: string
  _resolver?: Resolver

  constructor({ provider, resolver, resolverOptions }: DIDOptions = {}) {
    if (provider != null) {
      this._client = new RPCClient(provider)
    }
    if (resolver != null) {
      this.setResolver(resolver, resolverOptions)
    }
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

  get providerClient(): RPCClient {
    if (this._client == null) {
      throw new Error('Provider client is not defined')
    }
    return this._client
  }

  get resolver(): Resolver {
    if (this._resolver == null) {
      throw new Error('Resolver is not defined')
    }
    return this._resolver
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

  asResolvable(): Resolvable {
    if (this._resolver == null) {
      throw new Error('Resolver is not defined')
    }
    return this as Resolvable
  }

  /**
   * Authenticate the user.
   */
  async authenticate({ provider, paths, aud }: AuthenticateOptions = {}): Promise<string> {
    if (provider != null) {
      this.setProvider(provider)
    }
    if (this._client == null) {
      throw new Error('No provider available')
    }
    const nonce = randomString()
    const jws = await this._client.request<AuthenticateParams, DagJWS>('did_authenticate', {
      nonce,
      aud,
      paths,
    })
    const { kid } = await this.verifyJWS(jws)
    const payload = base64urlToJSON(jws.payload) as AuthenticateResponse
    if (!kid.includes(payload.did)) throw new Error('Invalid authentication response, kid mismatch')
    if (payload.nonce !== nonce) throw new Error('Invalid authentication response, wrong nonce')
    if (payload.aud !== aud) throw new Error('Invalid authentication response, wrong aud')
    if (payload.exp < Date.now() / 1000) throw new Error('Invalid authenctiation response, expired')
    this._id = payload.did
    return this._id
  }

  async toAuthenticated(options: AuthenticateOptions = {}): Promise<Authenticated> {
    if (!this.authenticated) {
      await this.authenticate(options)
    }
    return this as Authenticated
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
    return await verifyDIDJWS(this.asResolvable(), jws)
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
    return await createDIDJWE(this.asResolvable(), cleartext, recipients, options)
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
    return await createDagJWE(this.asResolvable(), cleartext, recipients, options)
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
  async resolve(didUrl: string): Promise<DIDResolutionResult> {
    return await resolveDID(this.asResolvable(), didUrl)
  }
}
