
interface VarsigNode {
  _sig: Uint8Array
  [key: string]: any
}

type EthAddress = `0x${string}`
type PublicKey = Uint8Array

type Decoded = any

export function verify (node: VarsigNode, verificationKey: PublicKey | EthAddress): Decoded {

}
