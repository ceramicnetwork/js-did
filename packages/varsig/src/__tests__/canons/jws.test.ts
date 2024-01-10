import { fromOriginal, prepareCanonicalization } from '../../canons/jws.js'
import { BytesTape } from '../../bytes-tape.js'
import * as uint8arrays from 'uint8arrays'
import { CanonicalizationKind } from '../../canonicalization.js'

//const testJws = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1MTYyMzkwMjIsIm5hbWUiOiJKb2huIERvZSIsInN1YiI6IjEyMzQ1Njc4OTAifQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
const testJws = 'eyJhbGciOiAiRVMyNTYifQ.eyJpYXQiOjE1MTYyMzkwMjIsIm5hbWUiOiJKb2huIERvZSIsInN1YiI6IjEyMzQ1Njc4OTAifQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

const expectedHashInput = uint8arrays.fromString(
  testJws.slice(0, testJws.lastIndexOf('.'))
)

test('Encode eip712 message', () => {
  // @ts-ignore
  const node = fromOriginal(testJws)

  expect(node._sig.length).toEqual(56)
  delete node._sig
  expect(node).toEqual({
    sub: '1234567890',
    name: 'John Doe',
    iat: 1516239022
})
})

test('Canonicalize ipld eip712 object', () => {
  // @ts-ignore
  const node = fromOriginal(testJws)
  const tape = new BytesTape(node._sig)
  tape.readVarint() // skip sigil
  const keyType = tape.readVarint() // skip key type
  const hashType = tape.readVarint() // skip hash type
  tape.readVarint() // skip canonicalizer codec
  const can = prepareCanonicalization(tape, hashType, keyType)
  expect(can.kind).toEqual(CanonicalizationKind.JWS)
  expect(tape.remainder.length).toEqual(32)
  // @ts-ignore
  delete node._sig
  const sigInput = can(node)
  expect(sigInput).toEqual(expectedHashInput)
})
