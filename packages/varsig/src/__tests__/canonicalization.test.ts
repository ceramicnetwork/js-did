import { expect, test } from '@jest/globals'
import { BytesTape } from '../bytes-tape.js'
import { CanonicalizationDecoder, CanonicalizationKind } from '../canonicalization.js'
import { concat, toString } from 'uint8arrays'
import { encode } from 'varintes/encode'

test('EIP712', () => {
  const bytes = concat([encode(0xe712)[0]])
  const tape = new BytesTape(bytes)
  const result = CanonicalizationDecoder.read(tape)
  expect(result.kind).toEqual(CanonicalizationKind.EIP191)
  // const canonicalized = toString(result('Hello'), 'hex')
  // expect(canonicalized).toEqual('19457468657265756d205369676e6564204d6573736167653a0a3548656c6c6f')
})

test('EIP191', () => {
  const bytes = concat([encode(0xe191)[0]])
  const tape = new BytesTape(bytes)
  const result = CanonicalizationDecoder.read(tape)
  expect(result.kind).toEqual(CanonicalizationKind.EIP191)
  const canonicalized = toString(result('Hello'), 'hex')
  expect(canonicalized).toEqual('19457468657265756d205369676e6564204d6573736167653a0a3548656c6c6f')
})
