import { MAGIC } from '../magic.js'
import { SigningAlgo } from '../signing.js'
import { ed25519 } from '@noble/curves/ed25519'
import type { BytesTape } from '../bytes-tape.js'

const SIGIL = MAGIC.ED25519

// @ts-ignore
function prepareVerifier(tape: BytesTape): SigningAlgo {
  return {
    kind: SIGIL,
    // eslint-disable-next-line @typescript-eslint/require-await
    verify: async (input, signature, verificationKey): Promise<boolean> => {
      return ed25519.verify(signature, input, verificationKey)
    },
  }
}

function readSignature(tape: BytesTape): Uint8Array {
  return tape.read(64)
}

export const ED25519 = { SIGIL, prepareVerifier, readSignature }
