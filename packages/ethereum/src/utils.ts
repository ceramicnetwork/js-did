/* eslint-disable  @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument */
// TODO types

export function safeSend(provider: any, method: string, params?: Array<any>): Promise<any> {
  if (params == null) {
    params = []
  }

  if (provider.request) {
    return provider.request({ method, params }).then(
      (response: any) => response,
      (error: any) => {
        throw error
      }
    )
  } else if (provider.sendAsync || provider.send) {
    const sendFunc = (provider.sendAsync ? provider.sendAsync : provider.send).bind(provider)
    const request = encodeRpcMessage(method, params)
    return new Promise((resolve, reject) => {
      sendFunc(request, (error: any, response: any) => {
        if (error) reject(error)

        if (response.error) {
          const error = new Error(response.error.message)
          ;(<any>error).code = response.error.code
          ;(<any>error).data = response.error.data
          reject(error)
        }

        resolve(response.result)
      })
    })
  } else {
    throw new Error(
      `Unsupported provider; provider must implement one of the following methods: send, sendAsync, request`
    )
  }
}

export function encodeRpcMessage(method: string, params?: any): any {
  return {
    jsonrpc: '2.0',
    id: 1,
    method,
    params,
  }
}
