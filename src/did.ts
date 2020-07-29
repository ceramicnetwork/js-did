import { RPCClient, RPCConnection } from 'rpc-utils'

import { DagJson, encodeDagJson } from './dag-json'

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
  protected _client: RPCClient
  protected _did: string | undefined

  constructor(connection: RPCConnection) {
    this._client = new RPCClient(connection)
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
    const { did } = await this._client.request<void, AuthenticateResult>(
      'did_authenticate'
    )
    this._did = did
    return did
  }

  public async createJWS(
    payload: DagJson,
    options: CreateJWSOptions = {}
  ): Promise<string> {
    if (this._did == null) {
      throw new Error('DID is not authenticated')
    }
    const { jws } = await this._client.request<
      CreateJWSParams,
      CreateJWSResult
    >('did_createJWS', { ...options, payload: encodeDagJson(payload) })
    return jws
  }
}
