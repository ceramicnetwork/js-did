import { BytesTape } from './bytes-tape.js'
import { UnreacheableCaseError } from './unreachable-case-error.js'

export enum HashingAlgo {
  SHA2_256 = 0x12,
  SHA2_512 = 0x13,
  KECCAK256 = 0x1b,
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
        throw new Error(`Not implemented: hashingSigil: SHA2_512`)
      case HashingAlgo.SHA2_256:
        throw new Error(`Not implemented: hashingSigil: SHA2_256`)
      case HashingAlgo.KECCAK256:
        return HashingAlgo.KECCAK256
      default:
        throw new UnreacheableCaseError(hashingSigil, 'hashing algo')
    }
  }
}
