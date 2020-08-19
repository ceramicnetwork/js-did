import { DIDCache, DIDDocument, DIDResolver, Resolver } from 'did-resolver'
import { RPCClient, RPCConnection } from 'rpc-utils'

import { DagJson, encodeDagJson } from './dag-json'

export type { DIDDocument } from 'did-resolver'

export type DIDProvider = RPCConnection

export type ResolverRegistry = Record<string, DIDResolver>

export interface AuthenticateOptions {
  provider?: DIDProvider
}

interface AuthenticateResult {
  did: string
}

export interface CreateJWSOptions {
  protected?: Record<string, any>
}

interface CreateJWSParams extends CreateJWSOptions {
  did: string
  payload: DagJson
}

interface CreateJWSResult {
  jws: string // base64-encoded
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
  _did?: string
  _resolver!: Resolver

  constructor({ provider, resolver = {} }: DIDOptions = {}) {
    if (provider != null) {
      this._client = new RPCClient(provider)
    }
    this.setResolver(resolver)
  }

  get authenticated(): boolean {
    return this._did != null
  }

  get DID(): string {
    if (this._did == null) {
      throw new Error('DID is not authenticated')
    }
    return this._did
  }

  setProvider(provider: DIDProvider): void {
    if (this._client == null) {
      this._client = new RPCClient(provider)
    } else if (this._client.connection !== provider) {
      throw new Error('A different provider is already set')
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
    this._did = did
    return did
  }

  async createJWS(payload: DagJson, options: CreateJWSOptions = {}): Promise<string> {
    if (this._client == null) {
      throw new Error('No provider available')
    }
    if (this._did == null) {
      throw new Error('DID is not authenticated')
    }
    const { jws } = await this._client.request<CreateJWSParams, CreateJWSResult>('did_createJWS', {
      ...options,
      did: this._did,
      payload: encodeDagJson(payload),
    })
    return jws
  }

  async resolve(didUrl: string): Promise<DIDDocument> {
    return await this._resolver.resolve(didUrl)
  }
}
