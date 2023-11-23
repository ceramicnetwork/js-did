import type { BytesTape } from './bytes-tape.js'
import { UnreacheableCaseError } from './unreachable-case-error.js'

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
        const recoveryBit = this.tape.readVarint()
        if (recoveryBit && !(recoveryBit === 27 || recoveryBit === 28)) {
          throw new Error(`Wrong recovery bit`)
        }
        return {
          kind: SigningKind.SECP256K1,
          verify: async (input, signature, verificationKey) => {
            let k1Sig = secp256k1.Signature.fromCompact(decoder.signature)
            if (recoveryBit) {
              k1Sig = k1Sig.addRecoveryBit(recoveryBit - 27)
            }
            const recoveredKey = k1Sig.recoverPublicKey(input)
            // compare recoveredKey with verificationKey
            if (verificationKey instanceof Uint8Array) {
              return recoveredKey.toBytes().equals(verificationKey)
            }
            else if (typeof verificationKey === 'string') {
              // convert recoveredKey to eth address
              const recoveredAddress = '0x' + recoveredKey.toBytes().slice(-20).toString('hex')
              return recoveredAddress === verificationKey
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
        if (signing.recoveryBit) {
          return this.tape.read(65)
        } else {
          return this.tape.read(64)
        }
      }
      default:
        throw new UnreacheableCaseError(signing.kind, 'signing kind')
    }
  }
}
