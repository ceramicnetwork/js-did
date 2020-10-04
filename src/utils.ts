import CID from 'cids'
import * as u8a from 'uint8arrays'

const B64 = 'base64pad'
const B64_URL = 'base64url'

export function encodeBase64(bytes: Uint8Array): string {
  return u8a.toString(bytes, B64)
}

export function encodeBase64Url(bytes: Uint8Array): string {
  return u8a.toString(bytes, B64_URL)
}

export function decodeBase64(s: string): Uint8Array {
  return u8a.fromString(s, B64)
}

export interface JWSSignature {
  protected: string
  signature: string
}

export interface DagJWS {
  payload: string
  signatures: Array<JWSSignature>
  link: CID
}

export function toDagJWS(jws: string, cid: CID): DagJWS {
  const [protectedHeader, payload, signature] = jws.split('.')
  return {
    payload,
    signatures: [{ protected: protectedHeader, signature }],
    link: cid,
  }
}
