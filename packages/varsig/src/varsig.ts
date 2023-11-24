import { Decoder } from './decoder.js'
import { BytesTape } from './bytes-tape.js'
import { CanonicalizationKind } from './canonicalization.js'
import { klona } from 'klona'

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
  const tape = new BytesTape(node._sig)
  // @ts-ignore
  const { canonicalization, signing, signature } = new Decoder(tape).read()

  const toCanonicalize = klona(node)
  // @ts-ignore
  delete toCanonicalize._sig
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const signatureInput = canonicalization(toCanonicalize)

  // @ts-ignore
  return signing.verify(signatureInput, signature, verificationKey)
}

// eslint-disable-next-line @typescript-eslint/require-await
export async function toOriginal(node: VarsigNode): Promise<Decoded> {
  if (!node._sig || node._sig.length === 0) throw new Error(`No signature passed`)
  const { canonicalization, signing, signature } = new Decoder(new BytesTape(node._sig)).read()
  const clone = klona(node)
  // @ts-ignore
  delete clone._sig
  if (canonicalization.kind !== CanonicalizationKind.EIP712)
    throw new Error(`Supported just for EIP712`)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return canonicalization.original(clone, signature, signing.recoveryBit)
}
