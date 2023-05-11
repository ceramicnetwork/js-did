import type { JWE } from 'did-jwt'
import type { RPCClient, RPCConnection, RPCRequest, RPCResponse } from 'rpc-utils'
import type { GeneralJWS } from '@didtools/codecs'

export type { DagJWS, GeneralJWS, JWSSignature } from '@didtools/codecs'

export type CreateJWSParams = {
  payload: string | Record<string, any>
  protected?: Record<string, any>
  revocable?: boolean
  did: string
}

export type DecryptJWEParams = {
  jwe: JWE
  did?: string
}

export type AuthParams = {
  paths: Array<string>
  nonce: string
  aud?: string
}

export type DIDProviderMethods = {
  did_authenticate: { params: AuthParams; result: GeneralJWS }
  did_createJWS: { params: CreateJWSParams; result: { jws: GeneralJWS } }
  did_decryptJWE: { params: DecryptJWEParams; result: { cleartext: string } }
}
export type DIDMethodName = keyof DIDProviderMethods

export type DIDRequest<K extends DIDMethodName = DIDMethodName> = RPCRequest<DIDProviderMethods, K>
export type DIDResponse<K extends DIDMethodName = DIDMethodName> = RPCResponse<
  DIDProviderMethods,
  K
>

export type DIDProvider = RPCConnection<DIDProviderMethods>
export type DIDProviderClient = RPCClient<DIDProviderMethods>
export type DIDProviderOrClient = DIDProvider | DIDProviderClient
