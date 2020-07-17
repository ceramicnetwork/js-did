import { DagJson, encodeDagJson } from './dag-json'
import { RPCProvider } from './rpc'

interface AuthenticateResult {
  did: string
}

export interface CreateJWSOptions {
  protected?: Record<string, any>
  pubKeyId?: string
}

interface CreateJWSParams extends CreateJWSOptions {
  payload: DagJson
}

interface CreateJWSResult {
  jws: string // base64-encoded
}

export class DID {
  protected _did: string | undefined
  protected _provider: RPCProvider
  protected _reqId = 0

  constructor(provider: RPCProvider) {
    this._provider = provider
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

  protected async _send<P, R>(method: string, params?: P): Promise<R> {
    const res = await this._provider.send<P, R>({
      jsonrpc: '2.0',
      id: `did${this._reqId++}`,
      method,
      params,
    })
    if (res.error != null) {
      throw new Error(res.error.message ?? 'RPC error')
    }
    return res.result as R
  }

  public async authenticate(): Promise<string> {
    const { did } = await this._send<void, AuthenticateResult>(
      'did_authenticate',
    )
    this._did = did
    return did
  }

  public async createJWS(
    payload: DagJson,
    options: CreateJWSOptions = {},
  ): Promise<string> {
    if (this._did == null) {
      throw new Error('DID is not authenticated')
    }
    const { jws } = await this._send<CreateJWSParams, CreateJWSResult>(
      'did_createJWS',
      { ...options, payload: encodeDagJson(payload) },
    )
    return jws
  }
}
