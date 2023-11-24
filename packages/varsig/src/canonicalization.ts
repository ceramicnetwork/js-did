import { MAGIC } from './magic.js'
import { BytesTape } from './bytes-tape.js'
import * as uint8arrays from 'uint8arrays'
import { UnreacheableCaseError } from './unreachable-case-error.js'
import { Eip712 } from './canons/eip712.js'
import { HashingAlgo } from './hashing.js'
import { keccak_256 } from '@noble/hashes/sha3'
import type { SigningKind } from './signing.js'

export enum CanonicalizationKind {
  EIP712 = MAGIC.EIP712,
  EIP191 = MAGIC.EIP191
}

type IpldNode = Record<string, any>

type CanonicalizationEIP191 = {
  kind: CanonicalizationKind.EIP191
  (message: string): Uint8Array
}

type CanonicalizationEIP712 = {
  kind: CanonicalizationKind.EIP712
  (message: any): Uint8Array
  original(node: IpldNode, signature: Uint8Array, recoveryBit: number | undefined): any
}

export type CanonicalizationAlgo = CanonicalizationEIP191 | CanonicalizationEIP712

export class CanonicalizationDecoder {
  constructor(private readonly tape: BytesTape) {}

  static read(tape: BytesTape, hashing: HashingAlgo, sigKind: SigningKind): CanonicalizationAlgo {
    return new CanonicalizationDecoder(tape).read(hashing, sigKind)
  }

  read(hashing: HashingAlgo, sigKind: SigningKind): CanonicalizationAlgo {
    const sigil = this.tape.readVarint<CanonicalizationKind>()
    switch (sigil) {
      case CanonicalizationKind.EIP712:
        return Eip712.prepareCanonicalization(this.tape, hashing, sigKind)
      case CanonicalizationKind.EIP191: {
        if (hashing !== HashingAlgo.KECCAK256) throw new Error(`EIP191 mandates use of KECCAK 256`)
        const fn: CanonicalizationEIP191 = (message: string) => {
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
