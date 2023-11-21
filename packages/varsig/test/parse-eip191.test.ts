import { test } from '@jest/globals'
import * as varintes from 'varintes'
import { CANONICALIZATION, HASHING, SIGNING } from '../src/at0.js'
import { secp256k1 } from '@noble/curves/secp256k1'
import { sha256 } from '@noble/hashes/sha256'
import { keccak_256 } from '@noble/hashes/sha3'
import * as uint8arrays from 'uint8arrays'
import { privateKeyToAccount } from 'viem/accounts'
import { validate } from 'typedoc/dist/lib/utils/validation'

class UnreacheableCaseError extends Error {
  constructor(variant: never) {
    super(`Unreacheable case: ${String(variant)}`)
  }
}

function decode(input: Uint8Array) {
  const [sigil, sigilRead] = varintes.decode(input)
  if (sigil !== 0x34) throw new Error(`Not a varsig`)
  const sigilRemainder = input.subarray(sigilRead)
  const [signingVarint, signingVarintRead] = varintes.decode(sigilRemainder)
  const signingVarintRemainder = sigilRemainder.subarray(signingVarintRead)
  const signingSigil = signingVarint as SIGNING
  switch (signingSigil) {
    case SIGNING.SECP256K1: {
      const [recoveryBit, recoveryBitRead] = varintes.decode(signingVarintRemainder)
      if (!(recoveryBit === 27 || recoveryBit === 28)) {
        throw new Error(`Wrong recovery bit`)
      }
      const recoveryBitRemainder = signingVarintRemainder.subarray(recoveryBitRead)
      const [hashingVarint, hashingVarintRead] = varintes.decode(recoveryBitRemainder)
      const hashingVarintRemainder = recoveryBitRemainder.subarray(hashingVarintRead)
      const hashingSigil = hashingVarint as HASHING
      switch (hashingSigil) {
        case HASHING.KECCAK256: {
          const [canonicalizationKind, canonicalizationKindRead] =
            varintes.decode(hashingVarintRemainder)
          const canonicalizationSigil = canonicalizationKind as CANONICALIZATION
          switch (canonicalizationSigil) {
            case CANONICALIZATION.EIP191: {
              if (recoveryBit > 0) {
                const canonicalizationRemainder =
                  hashingVarintRemainder.subarray(canonicalizationKindRead)
                const signature = canonicalizationRemainder.subarray(0, 65)
                const signingInput = (message: Uint8Array) => {
                  const m = uint8arrays.toString(message)
                  return keccak_256(
                    uint8arrays.fromString(`\x19Ethereum Signed Message:\n` + String(m.length) + m)
                  )
                }
                // address
                return {
                  signing: SIGNING.SECP256K1,
                  recoveryBit: recoveryBit,
                  signature: signature,
                  signingInput: signingInput,
                }
              } else {
                // public key
                const signature = hashingVarintRemainder.subarray(0, 64)
                const signingInput = (message: Uint8Array) => {
                  const m = uint8arrays.toString(message)
                  return keccak_256(
                    uint8arrays.fromString(`\x19Ethereum Signed Message:\n` + String(m.length) + m)
                  )
                }
                // address
                return {
                  signing: SIGNING.SECP256K1,
                  signature: signature,
                  signingInput: signingInput,
                }
              }
            }
            case CANONICALIZATION.EIP712:
              throw new Error(`Not implemented: 712`)
            default:
              throw new UnreacheableCaseError(canonicalizationSigil)
          }
        }
        case HASHING.SHA2_256:
          throw new Error(`Not implemented: HASHING.SHA2_256`)
        case HASHING.SHA2_512:
          throw new Error(`Not implemented: HASHING.SHA2_512`)
        default:
          throw new UnreacheableCaseError(hashingSigil)
      }
    }
    case SIGNING.RSA:
      throw new Error(`Not implemented: HASHING.RSA`)
    default:
      throw new UnreacheableCaseError(signingSigil)
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
  const a = decode(varsig)
  const input = a.signingInput(eip191canonicalization('Hello World'))
  let sig = secp256k1.Signature.fromCompact(a.signature)
  if (a.recoveryBit) {
    sig = sig.addRecoveryBit(a.recoveryBit - 27)
  }
  console.log(sig.recoverPublicKey(input).toHex(false))
})
