import dagCBOR from 'ipld-dag-cbor'
import CID from 'cids'
import multihashes from 'multihashes'
import * as u8a from 'uint8arrays'

const DAG_CBOR_CODE = 113
const ID_MULTIHASH = 0
const B64 = 'base64pad'
const B58 = 'base58btc'

export interface EncodedPayload {
  cid: CID
  linkedBlock: Uint8Array
}

export async function encodePayload(payload: Record<string, any>): Promise<EncodedPayload> {
  const block = dagCBOR.util.serialize(payload)
  return {
    cid: await dagCBOR.util.cid(block),
    linkedBlock: block,
  }
}

export function encodeCleartext(cleartext: Record<string, any>): CID {
  const block = dagCBOR.util.serialize(cleartext)
  const idMultiHash = multihashes.encode(block, ID_MULTIHASH)
  return new CID(1, DAG_CBOR_CODE, idMultiHash)
}

export function decodeCleartext(bytes: Uint8Array): Record<string, any> {
  const cid = new CID(bytes)
  CID.validateCID(cid)
  if (cid.code !== DAG_CBOR_CODE) throw new Error('Cleartext codec must be dag-cbor')
  const { code, digest } = multihashes.decode(cid.multihash)
  if (code !== ID_MULTIHASH) throw new Error('Cleartext must be identity multihash')
  return dagCBOR.util.deserialize(digest)
}

export function encodeBase64(bytes: Uint8Array): string {
  return u8a.toString(bytes, B64)
}

export function decodeBase64(s: string): Uint8Array {
  return u8a.fromString(s, B64)
}

export function decodeBase58(s: string): Uint8Array {
  return u8a.fromString(s, B58)
}

interface JWSSignature {
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
