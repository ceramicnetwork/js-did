import { BytesTape } from './bytes-tape.js'
import * as uint8arrays from 'uint8arrays'
import { UnreacheableCaseError } from './unreachable-case-error.js'
import { hashTypedData } from 'viem'
import { CompressedDomain, decompressDomain, decompressTypes } from './encoding/eip712.js'
import { HashingAlgo } from './hashing.js'
import { keccak_256 } from '@noble/hashes/sha3'

export enum CanonicalizationKind {
  EIP712 = 0xe712,
  EIP191 = 0xe191,
}

type CanonicalizationEIP191 = {
  kind: CanonicalizationKind.EIP191
  (message: string): Uint8Array
}

type SignatureInput = Uint8Array
type CanonicalizationEIP712 = {
  kind: CanonicalizationKind.EIP712
  (message: any): SignatureInput
}

export type CanonicalizationAlgo = CanonicalizationEIP191 | CanonicalizationEIP712

export class CanonicalizationDecoder {
  constructor(private readonly tape: BytesTape) {}

  static read(tape: BytesTape, hashing: HashingAlgo) {
    return new CanonicalizationDecoder(tape).read(hashing)
  }

  read(hashing: HashingAlgo): CanonicalizationAlgo {
    const sigil = this.tape.readVarint<CanonicalizationKind>()
    switch (sigil) {
      case CanonicalizationKind.EIP712: {
        if (hashing !== HashingAlgo.KECCAK256) throw new Error(`EIP712 mandates use of KECCAK 256`)
        const metadataLength = this.tape.readVarint()
        const metadataBytes = this.tape.read(metadataLength)
        const metadata = JSON.parse(uint8arrays.toString(metadataBytes))
        const [types, primaryType, domain] = metadata
        const fn = (message: any) => {
          const decoded = {
            domain: decompressDomain(domain as CompressedDomain),
            message: message,
            primaryType: primaryType,
            types: decompressTypes(types),
          }
          const digestHex = hashTypedData(decoded)
          return uint8arrays.fromString(digestHex.toLowerCase().replace(/^0x/, ''), 'hex')
        }
        fn.kind = CanonicalizationKind.EIP712
        return fn
      }
      case CanonicalizationKind.EIP191: {
        if (hashing !== HashingAlgo.KECCAK256) throw new Error(`EIP191 mandates use of KECCAK 256`)
        const fn = (message: string) => {
          return keccak_256(
            uint8arrays.fromString(
              `\x19Ethereum Signed Message:\n` + String(message.length) + message
            )
          )
        }
        fn.kind = CanonicalizationKind.EIP191
        return fn
      }
      default:
        throw new UnreacheableCaseError(sigil, 'canonicalization kind')
    }
  }
}
