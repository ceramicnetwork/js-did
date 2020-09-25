import dagCBOR from 'ipld-dag-cbor'
import CID from 'cids'
import multihashes from 'multihashes'
import * as u8a from 'uint8arrays'

const DAG_CBOR_CODE = 113
const ID_MULTIHASH = 0
const ENC_BLOCK_SIZE = 24
const PAD_FIRST_BYTE = 128
const B64 = 'base64pad'
const B58 = 'base58btc'
const B64_URL = 'base64url'

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

export function pad(b: Uint8Array, blockSize = ENC_BLOCK_SIZE): Uint8Array {
  // pads with 1 followed by 0s
  const padLen = blockSize - (b.length % blockSize)
  return u8a.concat([b, new Uint8Array([PAD_FIRST_BYTE]), new Uint8Array(padLen - 1)])
}

export function unpad(b: Uint8Array): Uint8Array {
  const i = b.lastIndexOf(PAD_FIRST_BYTE)
  if (i === -1 || i + 1 === b.length) {
    // This cleartext is not padded, just return it
    return b
  }
  return b.slice(0, i)
}

export function encodeIdentityCID(cleartext: Record<string, any>): CID {
  const block = dagCBOR.util.serialize(cleartext)
  const idMultiHash = multihashes.encode(block, ID_MULTIHASH)
  return new CID(1, DAG_CBOR_CODE, idMultiHash)
}

export function decodeIdentityCID(bytes: Uint8Array): Record<string, any> {
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

export function encodeBase64Url(bytes: Uint8Array): string {
  return u8a.toString(bytes, B64_URL)
}

export function decodeBase64(s: string): Uint8Array {
  return u8a.fromString(s, B64)
}

export function decodeBase58(s: string): Uint8Array {
  return u8a.fromString(s, B58)
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
