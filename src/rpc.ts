export type RPCID = string | number | null

export interface RPCRequest<T = any> {
  jsonrpc: '2.0'
  method: string
  id?: RPCID
  params?: T | undefined
}

export interface RPCErrorObject<T = any> {
  code: number
  message?: string | undefined
  data?: T
}

export interface RPCResponse<T = any, E = any> {
  jsonrpc: '2.0'
  id?: RPCID
  result?: T
  error?: RPCErrorObject<E>
}

export interface RPCProvider {
  send<P = any, R = any, E = any>(
    request: RPCRequest<P>,
  ): Promise<RPCResponse<R, E>>
}
