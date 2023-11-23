import type { BytesTape } from './bytes-tape.js'
import { UnreacheableCaseError } from './unreachable-case-error.js'
import { secp256k1 } from '@noble/curves/secp256k1'
import * as uint8arrays from 'uint8arrays'
import { keccak_256 } from '@noble/hashes/sha3'

type EthAddress = `0x${string}`
type PublicKey = Uint8Array
type VerificationKey = PublicKey | EthAddress

export enum SigningKind {
  RSA = 0x1205,
  SECP256K1 = 0xe7,
}

export type SigningSecp256k1 = {
  kind: SigningKind.SECP256K1
  verify: VerifySignatureFn
}

export type VerifySignatureFn = (
  input: Uint8Array,
  signature: Uint8Array,
  verificationKey: VerificationKey
) => Promise<boolean>

export type SigningAlgo = SigningSecp256k1

export class SigningDecoder {
  constructor(private readonly tape: BytesTape) {}

  static read(tape: BytesTape): SigningAlgo {
    return new SigningDecoder(tape).read()
  }

  read(): SigningAlgo {
    const signingSigil = this.tape.readVarint<SigningKind>()
    switch (signingSigil) {
      case SigningKind.SECP256K1: {
        const recoveryBit = this.tape.read(1)[0]
        if (recoveryBit && !(recoveryBit === 27 || recoveryBit === 28)) {
          throw new Error(`Wrong recovery bit`)
        }
        return {
          kind: SigningKind.SECP256K1,
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
      case SigningKind.RSA:
        throw new Error(`Not implemented: signingSigil: RSA`)
      default:
        throw new UnreacheableCaseError(signingSigil, 'signing kind')
    }
  }

  readSignature(signing: SigningAlgo): Uint8Array {
    switch (signing.kind) {
      case SigningKind.SECP256K1: {
        return this.tape.read(64)
      }
      default:
        throw new UnreacheableCaseError(signing.kind, 'signing kind')
    }
  }
}
