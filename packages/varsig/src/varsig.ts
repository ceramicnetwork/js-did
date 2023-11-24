import { Decoder } from './decoder'
import { CanonicalizationKind } from './canonicalization'

export { Eip712 } from './canons/eip712'

interface VarsigNode {
  _sig: Uint8Array
  [key: string]: any
}

type EthAddress = `0x${string}`
type PublicKey = Uint8Array

type Decoded = any

export async function verify(
  node: VarsigNode,
  verificationKey: PublicKey | EthAddress
): Promise<boolean> {
  // @ts-ignore
  const { canonicalization, signing, signature } = new Decoder(node._sig).read()

  // @ts-ignore
  delete node._sig
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const signatureInput = canonicalization(node)

  // @ts-ignore
  return signing.verify(signatureInput, signature, verificationKey)
}

// eslint-disable-next-line @typescript-eslint/require-await
export async function toOriginal(node: VarsigNode): Promise<Decoded> {
  // @ts-ignore
  const { canonicalization, signing, signature } = new Decoder(node._sig).read()
  // @ts-ignore
  delete node._sig
  if (canonicalization.kind !== CanonicalizationKind.EIP712)
    throw new Error(`Supported just for EIP712`)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return canonicalization.original(node, signature, signing.recoveryBit)
}
