import { MAGIC } from '../magic.js'
import { SigningAlgo } from '../signing.js'
import { p256 } from '@noble/curves/p256'
import type { BytesTape } from '../bytes-tape.js'

const SIGIL = MAGIC.ES256

function prepareVerifier(_: BytesTape): SigningAlgo {
  return {
    kind: SIGIL,
    // eslint-disable-next-line @typescript-eslint/require-await
    verify: async (input, signature, verificationKey): Promise<boolean> => {
      return p256.verify(signature, input, verificationKey)
    },
  }
}

function readSignature(tape: BytesTape): Uint8Array {
  return tape.read(64)
}

export const P256 = { SIGIL, prepareVerifier, readSignature }
