import { test } from '@jest/globals'
import * as varintes from 'varintes'
import { CANONICALIZATION, HASHING, SIGNING } from '../src/at0.js'
import { secp256k1 } from '@noble/curves/secp256k1'
import { sha256 } from '@noble/hashes/sha256'
import { keccak_256 } from '@noble/hashes/sha3'
import * as uint8arrays from 'uint8arrays'
import { privateKeyToAccount } from 'viem/accounts'
import { Tape } from 'codeco/linear'

class UnreacheableCaseError extends Error {
  constructor(variant: never) {
    super(`Unreacheable case: ${String(variant)}`)
  }
}

class BytesTape implements Tape<Uint8Array> {
  position: number

  constructor(readonly input: Uint8Array) {
    this.position = 0
  }

  read(n: number): Uint8Array {
    const result = this.input.subarray(this.position, this.position + n)
    this.position += n
    return result
  }

  readVarint<T extends number = number>(): T {
    const bytes = this.read(10)
    const [n, bytesRead] = varintes.decode(bytes)
    this.position -= 10 - bytesRead
    return n as T
  }

  get isEOF(): boolean {
    return this.position >= this.input.byteLength
  }
}

type Signing = {
  kind: SIGNING.SECP256K1
  recoveryBit: undefined | 27 | 28
}

type Hashing = {
  kind: HASHING.KECCAK256
}

class SigningDecoder {
  constructor(private readonly tape: BytesTape) {}

  static read(tape: BytesTape): Signing {
    return new SigningDecoder(tape).read()
  }

  read(): Signing {
    const signingSigil = this.tape.readVarint<SIGNING>()
    switch (signingSigil) {
      case SIGNING.SECP256K1: {
        const recoveryBit = this.tape.readVarint()
        if (!(recoveryBit === 27 || recoveryBit === 28)) {
          throw new Error(`Wrong recovery bit`)
        }
        return {
          kind: SIGNING.SECP256K1,
          recoveryBit: recoveryBit || undefined,
        }
      }
      case SIGNING.RSA:
        throw new Error(`Not implemented: signingSigil: RSA`)
      default:
        throw new UnreacheableCaseError(signingSigil)
    }
  }
}

class HashingDecoder {
  constructor(private readonly tape: BytesTape) {}

  static read(tape: BytesTape) {
    return new HashingDecoder(tape).read()
  }

  read(): Hashing {
    const hashingSigil = this.tape.readVarint<HASHING>()
    switch (hashingSigil) {
      case HASHING.SHA2_512:
        throw new Error(`Not implemented: hashingSigil: SHA2_512`)
      case HASHING.SHA2_256:
        throw new Error(`Not implemented: hashingSigil: SHA2_256`)
      case HASHING.KECCAK256:
        return {
          kind: HASHING.KECCAK256,
        }
      default:
        throw new UnreacheableCaseError(hashingSigil)
    }
  }
}

class CanonicalizationDecoder {
  constructor(private readonly tape: BytesTape) {}

  read(signing: Signing, hashing: Hashing) {
    const sigil = this.tape.readVarint<CANONICALIZATION>()
    switch (sigil) {
      case CANONICALIZATION.EIP712:
        throw new Error(`Not implemented: readCanonicalization: EIP712`)
      case CANONICALIZATION.EIP191: {
        const signatureLen = signing.recoveryBit ? 65 : 64
        const signature = this.tape.read(signatureLen)
        const signingInput = (message: Uint8Array) => {
          const m = uint8arrays.toString(message)
          return keccak_256(
            uint8arrays.fromString(`\x19Ethereum Signed Message:\n` + String(m.length) + m)
          )
        }
        return {
          signing: SIGNING.SECP256K1,
          recoveryBit: signing.recoveryBit,
          signature: signature,
          signingInput: signingInput,
        }
      }
      default:
        throw new UnreacheableCaseError(sigil)
    }
  }
}

class Decoder {
  #tape: BytesTape

  constructor(tape: BytesTape) {
    this.#tape = tape
  }

  decode() {
    this.readVarsigSigil()
    const signing = SigningDecoder.read(this.#tape)
    const hashing = HashingDecoder.read(this.#tape)
    return new CanonicalizationDecoder(this.#tape).read(signing, hashing)
  }

  readVarsigSigil() {
    const sigil = this.#tape.readVarint()
    if (sigil !== 0x34) throw new Error(`Not a varsig`)
    return sigil
  }

  readSigningSigil() {
    const sigil = this.#tape.readVarint()
    return sigil as SIGNING
  }
}

function eip191canonicalization(message: string) {
  return uint8arrays.fromString(message)
}

function hex(...numbers: Array<number>): Uint8Array {
  return new Uint8Array(numbers)
}

test('validate eip191', async () => {
  const account = privateKeyToAccount(
    '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'
  )
  console.log('pub', account.publicKey)
  const stringSignature = await account.signMessage({ message: 'Hello World' })
  const signatureBytes = uint8arrays.fromString(
    stringSignature.toLowerCase().replace(/^0x/, ''),
    'hex'
  )
  const varsig = uint8arrays.concat([
    hex(0x34),
    varintes.encode(0xe7)[0],
    signatureBytes.subarray(64),
    varintes.encode(0x1b)[0],
    varintes.encode(CANONICALIZATION.EIP191)[0],
    signatureBytes.subarray(0, 64),
  ])
  // const a = decode(varsig)
  const a = new Decoder(new BytesTape(varsig)).decode()
  const input = a.signingInput(eip191canonicalization('Hello World'))
  let sig = secp256k1.Signature.fromCompact(a.signature)
  if (a.recoveryBit) {
    sig = sig.addRecoveryBit(a.recoveryBit - 27)
  }
  console.log(sig.recoverPublicKey(input).toHex(false))
})
