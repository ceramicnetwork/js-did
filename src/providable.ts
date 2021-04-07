import { encodePayload, decodeCleartext } from 'dag-jose-utils'
import type { JWE } from 'did-jwt'

import type { DagJWS, DIDProviderClient, DIDProviderOrClient } from './types'
import { encodeBase64, decodeBase64, encodeBase64Url } from './utils'

export type AuthenticateParamsOptions = {
  aud?: string
  paths?: Array<string>
}

export type AuthenticateOptions = AuthenticateParamsOptions & { provider?: DIDProviderOrClient }

export type Providable = {
  authenticated: boolean
  id?: string
  providerClient: DIDProviderClient
  toAuthenticated: (options?: AuthenticateOptions) => Promise<Authenticated>
}

export type Authenticated = Providable & { authenticated: true; id: string }

export type CreateJWSOptions = {
  did?: string
  protected?: Record<string, any>
  linkedBlock?: string
}

export type DagJWSResult = {
  jws: DagJWS
  linkedBlock: Uint8Array
}

export type DecryptJWEOptions = {
  did?: string
}

export async function ensureAuthenticated(
  providable: Providable,
  options?: AuthenticateOptions
): Promise<Authenticated> {
  return providable.authenticated
    ? (providable as Authenticated)
    : await providable.toAuthenticated(options)
}

export async function createDIDJWS<T = any>(
  auth: Authenticated,
  payload: T,
  options: CreateJWSOptions = {}
): Promise<DagJWS> {
  const { jws } = await auth.providerClient.request('did_createJWS', {
    did: auth.id,
    ...options,
    payload,
  })
  return jws
}

export async function createDagJWS(
  auth: Authenticated,
  payload: Record<string, any>,
  options: CreateJWSOptions = {}
): Promise<DagJWSResult> {
  const { cid, linkedBlock } = await encodePayload(payload)
  const payloadCid = encodeBase64Url(cid.bytes)
  Object.assign(options, { linkedBlock: encodeBase64(linkedBlock) })
  const jws = await createDIDJWS(auth, payloadCid, options)
  jws.link = cid
  return { jws, linkedBlock }
}

export async function decryptDIDJWE(
  auth: Authenticated,
  jwe: JWE,
  options: DecryptJWEOptions = {}
): Promise<Uint8Array> {
  if (!options.did) options.did = auth.id
  const { cleartext } = await auth.providerClient.request('did_decryptJWE', { ...options, jwe })
  return decodeBase64(cleartext)
}

export async function decryptDagJWE(auth: Authenticated, jwe: JWE): Promise<Record<string, any>> {
  const bytes = await decryptDIDJWE(auth, jwe)
  return decodeCleartext(bytes)
}
