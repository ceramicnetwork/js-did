import { test } from '@jest/globals'
import * as varintes from 'varintes'
import { secp256k1 } from '@noble/curves/secp256k1'
import * as uint8arrays from 'uint8arrays'
import { privateKeyToAccount } from 'viem/accounts'
import { BytesTape } from '../src/bytes-tape.js'
import { CanonicalizationKind } from '../src/canonicalization.js'
import { Decoder } from '../src/decoder.js'
import { hex } from '../src/__tests__/hex.util.js'

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
    varintes.encode(CanonicalizationKind.EIP191)[0],
    signatureBytes.subarray(0, 64),
  ])
  // const a = decode(varsig)
  const decoder = new Decoder(new BytesTape(varsig)).read()
  const input = decoder.canonicalization('Hello World')
  let signature = secp256k1.Signature.fromCompact(decoder.signature)
  if (decoder.signing.recoveryBit) {
    signature = signature.addRecoveryBit(decoder.signing.recoveryBit - 27)
  }
  console.log(signature.recoverPublicKey(input).toHex(false))
})
