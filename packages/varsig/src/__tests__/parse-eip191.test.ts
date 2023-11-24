import { test } from '@jest/globals'
import * as varintes from 'varintes'
import { secp256k1 } from '@noble/curves/secp256k1'
import * as uint8arrays from 'uint8arrays'
import { privateKeyToAccount } from 'viem/accounts'
import { BytesTape } from '../bytes-tape.js'
import { CanonicalizationKind } from '../canonicalization.js'
import { Decoder } from '../decoder.js'
import { hex } from './hex.util.js'

test('validate eip191', async () => {
  const account = privateKeyToAccount(
    '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'
  )
  const verificationKey = uint8arrays.fromString(account.publicKey.slice(2), 'base16')
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
  expect(await decoder.signing.verify(input, decoder.signature, verificationKey)).toBeTruthy()
  expect(await decoder.signing.verify(input, decoder.signature, account.address)).toBeTruthy()
})

test('validate eip191, no recovery bit', async () => {
  const account = privateKeyToAccount(
    '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'
  )
  const verificationKey = uint8arrays.fromString(account.publicKey.slice(2), 'base16')
  const stringSignature = await account.signMessage({ message: 'Hello World' })
  const signatureBytes = uint8arrays.fromString(
    stringSignature.toLowerCase().replace(/^0x/, ''),
    'hex'
  )
  const varsig = uint8arrays.concat([
    hex(0x34),
    varintes.encode(0xe7)[0],
    [0x00],
    varintes.encode(0x1b)[0],
    varintes.encode(CanonicalizationKind.EIP191)[0],
    signatureBytes.subarray(0, 64),
  ])
  // const a = decode(varsig)
  const decoder = new Decoder(new BytesTape(varsig)).read()

  const input = decoder.canonicalization('Hello World')
  expect(decoder.signing.verify(input, decoder.signature, verificationKey)).toBeTruthy()
})
