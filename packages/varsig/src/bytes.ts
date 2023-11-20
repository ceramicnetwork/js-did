import * as varintes from 'varintes'

type VarsigBytes = {
  encoding: number
  hashing: number
  signing: number
  signature: Uint8Array
}

const VARSIG_SIGIL = 0x34
const VARSIG_SIGIL_BYTES = new Uint8Array([VARSIG_SIGIL])

export function fromBytes(bytes: Uint8Array): VarsigBytes {
  const [sigil, sigilRead] = varintes.decode(bytes)
  if (sigil !== VARSIG_SIGIL) throw new Error(`Wrong sigil`)
  const sigilRemainder = bytes.subarray(sigilRead)
  const [encoding, encodingRead] = varintes.decode(sigilRemainder)
  const encodingRemainder = bytes.subarray(encodingRead)
  const [hashing, hashingRead] = varintes.decode(encodingRemainder)
  const hashingRemainder = sigilRemainder.subarray(hashingRead)
  const [signing, signingRead] = varintes.decode(hashingRemainder)
  const signature = hashingRemainder.subarray(signingRead)
  return {
    encoding: encoding,
    hashing: hashing,
    signing: signing,
    signature: signature,
  }
}

export function toBytes(varsig: VarsigBytes): Uint8Array {
  const encodingLen = varintes.encodingLength(varsig.encoding)
  const hashingLen = varintes.encodingLength(varsig.hashing)
  const signingLen = varintes.encodingLength(varsig.signing)
  const result = new Uint8Array(
    1 + encodingLen + hashingLen + signingLen + varsig.signature.byteLength
  )
  result.set(VARSIG_SIGIL_BYTES, 0)
  varintes.encode(varsig.encoding, result, 1)
  varintes.encode(varsig.hashing, result, 1 + encodingLen)
  varintes.encode(varsig.signing, result, 1 + encodingLen + hashingLen)
  result.set(varsig.signature, 1 + encodingLen + hashingLen + signingLen)
  return result
}
