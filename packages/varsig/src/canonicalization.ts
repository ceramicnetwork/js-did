import { BytesTape } from './bytes-tape.js'
import { SigningAlgo } from './signing.js'
import { HashingAlgo } from './hashing.js'
import * as uint8arrays from 'uint8arrays'
import { keccak_256 } from '@noble/hashes/sha3'
import { UnreacheableCaseError } from './unreachable-case-error.js'

export enum CanonicalizationKind {
  EIP712 = 0xe712,
  EIP191 = 0xe191,
}

type CanonicalizationEIP191 = {
  kind: CanonicalizationKind
  (message: string): Uint8Array
}

type Canonicalization = CanonicalizationEIP191

export class CanonicalizationDecoder {
  constructor(private readonly tape: BytesTape) {}

  read(signing: SigningAlgo, hashing: HashingAlgo): Canonicalization {
    const sigil = this.tape.readVarint<CanonicalizationKind>()
    switch (sigil) {
      case CanonicalizationKind.EIP712:
        throw new Error(`Not implemented: readCanonicalization: EIP712`)
      case CanonicalizationKind.EIP191: {
        const signingInput = (message: string) => {
          return keccak_256(
            uint8arrays.fromString(
              `\x19Ethereum Signed Message:\n` + String(message.length) + message
            )
          )
        }
        signingInput.kind = CanonicalizationKind.EIP191
        return signingInput
      }
      default:
        throw new UnreacheableCaseError(sigil, 'canonicalization kind')
    }
  }
}
