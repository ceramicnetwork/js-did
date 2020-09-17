import dagCBOR from 'ipld-dag-cbor'
import CID from 'cids'
import base64url from 'base64url'

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

export function u8aToBase64(bytes: Uint8Array): string {
  return base64url.encode(Buffer.from(bytes))
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
