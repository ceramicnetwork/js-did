import dagCBOR from 'ipld-dag-cbor'
import base64url from 'base64url'

interface EncodedPayload {
  cid: string
  linkedBlock: string
}

export async function encodePayload(payload: Record<string, any>): Promise<EncodedPayload> {
  const block = dagCBOR.util.serialize(payload)
  return {
    cid: base64url.encode(Buffer.from((await dagCBOR.util.cid(block)).bytes)),
    linkedBlock: base64url.encode(block),
  }
}
