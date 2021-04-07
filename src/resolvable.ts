import { prepareCleartext } from 'dag-jose-utils'
import { createJWE, verifyJWS, resolveX25519Encrypters } from 'did-jwt'
import type { JWE } from 'did-jwt'
import type { DIDResolutionOptions, DIDResolutionResult, Resolvable } from 'did-resolver'

import type { DagJWS } from './types'
import { fromDagJWS, base64urlToJSON } from './utils'

export type VerifyJWSResult = {
  kid: string
  payload?: Record<string, any>
  didResolutionResult: DIDResolutionResult
}

export type CreateJWEOptions = {
  protectedHeader?: Record<string, any>
  aad?: Uint8Array
}

export async function resolveDID(
  resolvable: Resolvable,
  didUrl: string,
  options?: DIDResolutionOptions
): Promise<DIDResolutionResult> {
  const result = await resolvable.resolve(didUrl, options)
  if (result.didResolutionMetadata.error) {
    const { error, message } = result.didResolutionMetadata
    const maybeMessage = message ? `, ${message as string}` : ''
    throw new Error(`Failed to resolve ${didUrl}: ${error}${maybeMessage}`)
  }
  return result
}

export async function verifyDIDJWS(
  resolvable: Resolvable,
  jws: string | DagJWS
): Promise<VerifyJWSResult> {
  if (typeof jws !== 'string') jws = fromDagJWS(jws)
  const kid = base64urlToJSON(jws.split('.')[0]).kid as string
  if (!kid) throw new Error('No "kid" found in jws')
  const didResolutionResult = await resolveDID(resolvable, kid)
  const publicKeys = didResolutionResult.didDocument?.verificationMethod || []
  // verifyJWS will throw an error if the signature is invalid
  verifyJWS(jws, publicKeys)
  let payload
  try {
    payload = base64urlToJSON(jws.split('.')[1])
  } catch (e) {
    // If an error is thrown it means that the payload is a CID.
  }
  return { kid, payload, didResolutionResult }
}

export async function createDIDJWE(
  resolvable: Resolvable,
  cleartext: Uint8Array,
  recipients: Array<string>,
  options: CreateJWEOptions = {}
): Promise<JWE> {
  const encrypters = await resolveX25519Encrypters(recipients, resolvable)
  return createJWE(cleartext, encrypters, options.protectedHeader, options.aad)
}

export async function createDagJWE(
  resolvable: Resolvable,
  cleartext: Record<string, any>,
  recipients: Array<string>,
  options: CreateJWEOptions = {}
): Promise<JWE> {
  return createDIDJWE(resolvable, prepareCleartext(cleartext), recipients, options)
}
