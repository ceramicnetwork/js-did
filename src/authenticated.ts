import { encodePayload, decodeCleartext } from 'dag-jose-utils'
import type { JWE } from 'did-jwt'
import type { RPCClient } from 'rpc-utils'

import { encodeBase64, decodeBase64, encodeBase64Url } from './utils'
import type { DagJWS } from './utils'

export interface Authenticated {
  id: string
  providerClient: RPCClient
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
  jws: DagJWS
}

export interface DagJWSResult {
  jws: DagJWS
  linkedBlock: Uint8Array
}

export interface DecryptJWEOptions {
  did?: string
}

export interface DecryptJWEParams extends DecryptJWEOptions {
  jwe: JWE
}

export interface DecryptJWEResult {
  cleartext: string // base64-encoded
}

export async function createDIDJWS<T = any>(
  auth: Authenticated,
  payload: T,
  options: CreateJWSOptions = {}
): Promise<DagJWS> {
  if (!options.did) options.did = auth.id
  const { jws } = await auth.providerClient.request<CreateJWSParams, CreateJWSResult>(
    'did_createJWS',
    { ...options, payload }
  )
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
  const { cleartext } = await auth.providerClient.request<DecryptJWEParams, DecryptJWEResult>(
    'did_decryptJWE',
    { ...options, jwe }
  )
  return decodeBase64(cleartext)
}

export async function decryptDagJWE(auth: Authenticated, jwe: JWE): Promise<Record<string, any>> {
  const bytes = await decryptDIDJWE(auth, jwe)
  return decodeCleartext(bytes)
}
