
interface VarsigNode {
  _sig: Uint8Array
  [key: string]: any
}

type EthAddress = `0x${string}`
type PublicKey = Uint8Array

type Decoded = any

export async function verify (
  node: VarsigNode,
  verificationKey: PublicKey | EthAddress
): Promise<boolean> {
  const { canonicalization, signing, signature } = (new Decoder(node._sig)).read()

  delete node._sig
  const signatureInput = canonicalization.canonicalization(node)

  return signing.verify(signatureInput, signature, verificationKey)
  }
}

export async function toOriginal (node: VarsigNode): Promise<Decoded> {
  const { canonicalization, signing, signature } = (new Decoder(node._sig)).read()
  delete node._sig
  return canonicalization.original(node, signature, signing.recoveryBig)
}
