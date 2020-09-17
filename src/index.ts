import { DIDCache, DIDDocument, DIDResolver, Resolver } from 'did-resolver'
import { RPCClient, RPCConnection } from 'rpc-utils'

import { DagJWS, encodePayload, toDagJWS, u8aToBase64 } from './utils'

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

export class DID {
  _client?: RPCClient
  _id?: string
  _resolver!: Resolver

  constructor({ provider, resolver = {} }: DIDOptions = {}) {
    if (provider != null) {
      this._client = new RPCClient(provider)
    }
    this.setResolver(resolver)
  }

  get authenticated(): boolean {
    return this._id != null
  }

  get id(): string {
    if (this._id == null) {
      throw new Error('DID is not authenticated')
    }
    return this._id
  }

  setProvider(provider: DIDProvider): void {
    if (this._client == null) {
      this._client = new RPCClient(provider)
    } else if (this._client.connection !== provider) {
      throw new Error(
        'A different provider is already set, create a new DID instance to use another provider'
      )
    }
  }

  setResolver(resolver: Resolver | ResolverOptions): void {
    this._resolver =
      resolver instanceof Resolver ? resolver : new Resolver(resolver.registry, resolver.cache)
  }

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

  async createJWS<T = any>(payload: T, options: CreateJWSOptions = {}): Promise<string> {
    if (this._client == null) {
      throw new Error('No provider available')
    }
    if (this._id == null) {
      throw new Error('DID is not authenticated')
    }
    if (!options.did) options.did = this._id
    const { jws } = await this._client.request<CreateJWSParams, CreateJWSResult>('did_createJWS', {
      ...options,
      payload,
    })
    return jws
  }

  async createDagJWS(
    payload: Record<string, any>,
    options: CreateJWSOptions = {}
  ): Promise<DagJWSResult> {
    const { cid, linkedBlock } = await encodePayload(payload)
    const payloadCid = u8aToBase64(cid.bytes)
    Object.assign(options, { linkedBlock: u8aToBase64(linkedBlock) })
    const compactJws = await this.createJWS(payloadCid, options)
    const jws = toDagJWS(compactJws, cid)
    return { jws, linkedBlock }
  }

  async resolve(didUrl: string): Promise<DIDDocument> {
    return await this._resolver.resolve(didUrl)
  }
}
