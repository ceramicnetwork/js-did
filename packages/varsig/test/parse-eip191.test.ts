import { test } from '@jest/globals'
import * as varintes from 'varintes'
import { CANONICALIZATION, SIGNING } from '../src/at0.js'
import { secp256k1 } from '@noble/curves/secp256k1'
import { keccak_256 } from '@noble/hashes/sha3'
import * as uint8arrays from 'uint8arrays'
import { privateKeyToAccount } from 'viem/accounts'
import { BytesTape } from '../src/bytes-tape.js'
import { SigningAlgo, SigningDecoder } from '../src/signing.js'
import { HashingAlgo, HashingDecoder } from '../src/hashing.js'

class UnreacheableCaseError extends Error {
  constructor(variant: never) {
    super(`Unreacheable case: ${String(variant)}`)
  }
}

class CanonicalizationDecoder {
  constructor(private readonly tape: BytesTape) {}

  read(signing: SigningAlgo, hashing: HashingAlgo) {
    const sigil = this.tape.readVarint<CANONICALIZATION>()
    switch (sigil) {
      case CANONICALIZATION.EIP712:
        throw new Error(`Not implemented: readCanonicalization: EIP712`)
      case CANONICALIZATION.EIP191: {
        const signingInput = (message: Uint8Array) => {
          const m = uint8arrays.toString(message)
          return keccak_256(
            uint8arrays.fromString(`\x19Ethereum Signed Message:\n` + String(m.length) + m)
          )
        }
        return {
          signing: SIGNING.SECP256K1,
          recoveryBit: signing.recoveryBit,
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

  read() {
    this.readVarsigSigil()
    const signingDecoder = new SigningDecoder(this.#tape)
    const signing = signingDecoder.read()
    const hashing = HashingDecoder.read(this.#tape)
    const canon = new CanonicalizationDecoder(this.#tape).read(signing, hashing)
    const signature = signingDecoder.readSignature(signing)
    return {
      ...canon,
      signature: signature,
    }
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
  const a = new Decoder(new BytesTape(varsig)).read()
  const input = a.signingInput(eip191canonicalization('Hello World'))
  let sig = secp256k1.Signature.fromCompact(a.signature)
  if (a.recoveryBit) {
    sig = sig.addRecoveryBit(a.recoveryBit - 27)
  }
  console.log(sig.recoverPublicKey(input).toHex(false))
})
