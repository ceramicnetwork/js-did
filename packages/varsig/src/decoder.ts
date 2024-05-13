import { MAGIC } from './magic.js'
import type { BytesTape } from './bytes-tape.js'
import { SigningDecoder, type SigningAlgo } from './signing.js'
import { HashingDecoder, type HashingAlgo } from './hashing.js'
import { CanonicalizationDecoder, type CanonicalizationAlgo } from './canonicalization.js'

export type Varsig = {
  signing: SigningAlgo
  hashing: HashingAlgo
  canonicalization: CanonicalizationAlgo
  signature: Uint8Array
}

export class Decoder {
  #tape: BytesTape

  constructor(tape: BytesTape) {
    this.#tape = tape
  }

  read(): Varsig {
    this.readVarsigSigil()
    const signingDecoder = new SigningDecoder(this.#tape)
    const signing = signingDecoder.read()
    const hashing = HashingDecoder.read(this.#tape)
    const canonicalization = new CanonicalizationDecoder(this.#tape).read(hashing, signing.kind)
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
    if (sigil !== MAGIC.VARSIG) throw new Error(`Not a varsig`)
    return sigil
  }
}
