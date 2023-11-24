import { MAGIC } from './magic.js'
import type { BytesTape } from './bytes-tape.js'
import { UnreacheableCaseError } from './unreachable-case-error.js'

export enum HashingAlgo {
  SHA2_256 = MAGIC.SHA2_256,
  SHA2_512 = MAGIC.SHA2_512,
  KECCAK256 = MAGIC.KECCAK_256,
}

export class HashingDecoder {
  constructor(private readonly tape: BytesTape) {}

  static read(tape: BytesTape) {
    return new HashingDecoder(tape).read()
  }

  read(): HashingAlgo {
    const hashingSigil = this.tape.readVarint<HashingAlgo>()
    switch (hashingSigil) {
      case HashingAlgo.SHA2_512:
        return HashingAlgo.SHA2_512
      case HashingAlgo.SHA2_256:
        return HashingAlgo.SHA2_256
      case HashingAlgo.KECCAK256:
        return HashingAlgo.KECCAK256
      default:
        throw new UnreacheableCaseError(hashingSigil, 'hashing algo')
    }
  }
}
