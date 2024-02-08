import { MAGIC } from './magic.js'
import type { BytesTape } from './bytes-tape.js'
import { UnreacheableCaseError } from './unreachable-case-error.js'
import { Secp256k1 } from './signing/secp256k1.js'
import { P256 } from './signing/p256.js'
import { ED25519 } from './signing/ed25519.js'

type EthAddress = `0x${string}`
type PublicKey = Uint8Array
type VerificationKey = PublicKey | EthAddress

export enum SigningKind {
  RSA = MAGIC.RSA,
  SECP256K1 = MAGIC.SECP256K1,
  P256 = MAGIC.ES256,
  ED25519 = MAGIC.ED25519,
}

export type SigningAlgo = {
  kind: SigningKind
  recoveryBit?: number
  verify: VerifySignatureFn
}

export type VerifySignatureFn = (
  input: Uint8Array,
  signature: Uint8Array,
  verificationKey: VerificationKey,
) => Promise<boolean>

export class SigningDecoder {
  constructor(private readonly tape: BytesTape) {}

  static read(tape: BytesTape): SigningAlgo {
    return new SigningDecoder(tape).read()
  }

  read(): SigningAlgo {
    const signingSigil = this.tape.readVarint<SigningKind>()
    switch (signingSigil) {
      case SigningKind.SECP256K1:
        return Secp256k1.prepareVerifier(this.tape)
      case SigningKind.P256:
        return P256.prepareVerifier(this.tape)
      case SigningKind.ED25519:
        return ED25519.prepareVerifier(this.tape)
      case SigningKind.RSA:
        throw new Error(`Not implemented: signingSigil: RSA`)
      default:
        throw new UnreacheableCaseError(signingSigil, 'signing kind')
    }
  }

  readSignature(signing: SigningAlgo): Uint8Array {
    switch (signing.kind) {
      case SigningKind.SECP256K1:
        return Secp256k1.readSignature(this.tape)
      case SigningKind.P256:
        return P256.readSignature(this.tape)
      case SigningKind.ED25519:
        return ED25519.readSignature(this.tape)
      case SigningKind.RSA: {
        throw new Error(`Not supported: RSA`)
      }
      default:
        throw new UnreacheableCaseError(signing.kind, 'signing kind')
    }
  }
}
