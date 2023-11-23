import type { BytesTape } from './bytes-tape.js'
import { SigningAlgo } from '../signing.js'

import { secp256k1 } from '@noble/curves/secp256k1'
import * as uint8arrays from 'uint8arrays'
import { keccak_256 } from '@noble/hashes/sha3'




const SIGIL = 0xe7

function prepareVerifier(tape: ByteTape): SigningAlgo {
  const recoveryBit = tape.read(1)[0]
  if (recoveryBit && !(recoveryBit === 27 || recoveryBit === 28)) {
    throw new Error(`Wrong recovery bit`)
  }
  return {
    kind: SIGIL,
    recoveryBit: recoveryBit || undefined,
    verify: async (input, signature, verificationKey) => {
      let k1Sig = secp256k1.Signature.fromCompact(signature)
      if (recoveryBit) {
        k1Sig = k1Sig.addRecoveryBit(recoveryBit - 27)
        const recoveredKey = k1Sig.recoverPublicKey(input).toRawBytes(false)
        // compare recoveredKey with verificationKey
        if (verificationKey instanceof Uint8Array) {
          return uint8arrays.equals(recoveredKey, verificationKey)
        }
        // convert recoveredKey to eth address and compare
        else if (typeof verificationKey === 'string') {
          const recoveredAddress = `0x${uint8arrays.toString(
            keccak_256(recoveredKey.slice(1)) , 'base16'
          ).slice(-40)}`
          return recoveredAddress === verificationKey.toLowerCase()
        }
      } else {
        return secp256k1.verify(signature, input, verificationKey)
      }
    }
  }
}

function readSignature(tape: BytesTape): Uint8Array {
  return tape.read(64)
}


export const Secp256k1 = { SIGIL, prepareVerifier, readSignature }
