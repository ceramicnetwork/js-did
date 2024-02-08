import { fromOriginal, prepareCanonicalization } from '../../canons/jws.js'
import { BytesTape } from '../../bytes-tape.js'
import * as uint8arrays from 'uint8arrays'
import { CanonicalizationKind } from '../../canonicalization.js'
import { HashingDecoder } from '../../hashing.js'
import { MAGIC } from '../../magic.js'

//const testJws = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1MTYyMzkwMjIsIm5hbWUiOiJKb2huIERvZSIsInN1YiI6IjEyMzQ1Njc4OTAifQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
const testJws = 'eyJhbGciOiAiRVMyNTYifQ.eyJpYXQiOjE1MTYyMzkwMjIsIm5hbWUiOiJKb2huIERvZSIsInN1YiI6IjEyMzQ1Njc4OTAifQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'


const expectedHashInput = uint8arrays.fromString(
  testJws.slice(0, testJws.lastIndexOf('.'))
)

test('Encode jws message', () => {
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

test('Encode jws with unordered fields fails', () => {
  const unorderedJws = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
  expect(() => fromOriginal(unorderedJws)).toThrowError(/Invalid JOSE payload: Varsig only supports JSON with ordered keys, got/)
})

test('Canonicalize ipld jws object', () => {
  // @ts-ignore
  const node = fromOriginal(testJws)
  const tape = new BytesTape(node._sig)
  tape.readVarint() // skip sigil
  const keyType = tape.readVarint() // skip key type
  const hashing = HashingDecoder.read(tape) // read hash type
  // const hashType = tape.readVarint() // skip hash type
  expect(keyType).toEqual(MAGIC.ES256)
  expect(hashing.kind).toEqual(MAGIC.SHA2_256)
  tape.readVarint() // skip canonicalizer codec
  const can = prepareCanonicalization(tape, hashing, keyType)
  expect(can.kind).toEqual(CanonicalizationKind.JWS)
  expect(tape.remainder.length).toEqual(32)
  // @ts-ignore
  delete node._sig
  const sigInput = can(node)
  expect(sigInput).toEqual(hashing.digest(expectedHashInput))
})
