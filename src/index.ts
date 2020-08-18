import { DIDCache, DIDDocument, DIDResolver, Resolver } from 'did-resolver'
import { RPCClient, RPCConnection } from 'rpc-utils'

import { DagJson, encodeDagJson } from './dag-json'

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

export type { DIDDocument } from 'did-resolver'

export type DIDProvider = RPCConnection

export type ResolverRegistry = Record<string, DIDResolver>

export interface ResolverOptions {
  registry?: ResolverRegistry
  cache?: DIDCache | boolean
}

export interface DIDOptions {
  provider: DIDProvider
  resolver?: Resolver | ResolverOptions
}

export class DID {
  protected _client: RPCClient
  protected _did: string | undefined
  protected _resolver: Resolver

  constructor({ provider, resolver = {} }: DIDOptions) {
    this._client = new RPCClient(provider)
    this._resolver =
      resolver instanceof Resolver ? resolver : new Resolver(resolver.registry, resolver.cache)
  }

  public get authenticated(): boolean {
    return this._did != null
  }

  public get DID(): string {
    if (this._did == null) {
      throw new Error('DID is not authenticated')
    }
    return this._did
  }

  public async authenticate(): Promise<string> {
    const { did } = await this._client.request<void, AuthenticateResult>('did_authenticate')
    this._did = did
    return did
  }

  public async createJWS(payload: DagJson, options: CreateJWSOptions = {}): Promise<string> {
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

  public async resolve(didUrl: string): Promise<DIDDocument> {
    return await this._resolver.resolve(didUrl)
  }
}
