
interface VarsigNode {
  _sig: Uint8Array
  [key: string]: any
}

type EthAddress = `0x${string}`
type PublicKey = Uint8Array

type Decoded = any

interface VerificationResult {
  valid: boolean
  decoded: Decoded
}

export async function verify (
  node: VarsigNode,
  verificationKey: PublicKey | EthAddress
): VerificationResult {
  const { canoncalize, signing, signature } = (new Decoder(node._sig)).read()

  delete node._sig
  const { digest, decoded } = canoncalize(node)

  return {
    decoded,
    valid: await signing.verify(signature, verificationKey, digest)
  }
}
