import { MAGIC } from './magic.js'
import type { BytesTape } from './bytes-tape.js'
import { UnreacheableCaseError } from './unreachable-case-error.js'
import { sha256 } from '@noble/hashes/sha256'
import { sha512 } from '@noble/hashes/sha512'
import { keccak_256 } from '@noble/hashes/sha3'

export enum HashingKind {
  SHA2_256 = MAGIC.SHA2_256,
  SHA2_512 = MAGIC.SHA2_512,
  KECCAK256 = MAGIC.KECCAK_256,
}

export type HashFn = (
  input: Uint8Array
) => Uint8Array

export type HashingAlgo = {
  kind: HashingKind
  digest: HashFn
}

export function hashingAlgoByKind(kind: HashingKind): HashingAlgo {
  switch (kind) {
    case HashingKind.SHA2_512:
      return {
        kind: HashingKind.SHA2_512,
        digest: sha512
      }
    case HashingKind.SHA2_256:
      return {
        kind: HashingKind.SHA2_256,
        digest: sha256
      }
    case HashingKind.KECCAK256:
      return {
        kind: HashingKind.KECCAK256,
        digest: keccak_256
      }
    default:
      throw new UnreacheableCaseError(kind, 'hashing algo')
  }
}

export class HashingDecoder {
  constructor(private readonly tape: BytesTape) {}

  static read(tape: BytesTape) {
    return new HashingDecoder(tape).read()
  }

  read(): HashingAlgo {
    const hashingSigil = this.tape.readVarint<HashingKind>()
    return hashingAlgoByKind(hashingSigil)
    // switch (hashingSigil) {
    //   case HashingKind.SHA2_512:
    //     return {
    //       kind: HashingKind.SHA2_512,
    //       digest: sha512
    //     }
    //   case HashingKind.SHA2_256:
    //     return {
    //       kind: HashingKind.SHA2_256,
    //       digest: sha256
    //     }
    //   case HashingKind.KECCAK256:
    //     return {
    //       kind: HashingKind.KECCAK256,
    //       digest: keccak_256
    //     }
    //   default:
    //     throw new UnreacheableCaseError(hashingSigil, 'hashing algo')
    // }
  }
}
