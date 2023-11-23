import type { BytesTape } from './bytes-tape.js'
import { SigningDecoder } from './signing.js'
import { HashingDecoder } from './hashing.js'
import { CanonicalizationDecoder } from './canonicalization.js'

export class Decoder {
  #tape: BytesTape

  constructor(tape: BytesTape) {
    this.#tape = tape
  }

  read() {
    this.readVarsigSigil()
    const signingDecoder = new SigningDecoder(this.#tape)
    const signing = signingDecoder.read()
    const hashing = HashingDecoder.read(this.#tape)
    const canonicalization = new CanonicalizationDecoder(this.#tape).read(hashing)
    const signature = signingDecoder.readSignature(signing)
    return {
      signing: signing,
      hashing: hashing,
      canonicalization: canonicalization,
      signature: signature,
    }
  }

  readVarsigSigil() {
    const sigil = this.#tape.readVarint()
    if (sigil !== 0x34) throw new Error(`Not a varsig`)
    return sigil
  }
}
