import { randomBytes } from 'node:crypto'
import { describe, test, expect } from '@jest/globals'
import { validate, isRight, type Right } from 'codeco'
import { CID } from 'multiformats/cid'
import { create } from 'multiformats/hashes/digest'

import { cidAsString } from '../src/ipld.js'

/**
 * Create random DAG-CBOR CID.
 */
export function randomCID(): CID {
  // 113 is DAG-CBOR codec identifier
  return CID.create(1, 113, create(0x12, new Uint8Array(randomBytes(32))))
}

describe('cidAsString', () => {
  const cid = randomCID()
  test('decode: ok', () => {
    const result = validate(cidAsString, cid.toString())
    expect(isRight(result)).toEqual(true)
    expect((result as Right<CID>).right).toEqual(cid)
  })
  test('decode: not ok', () => {
    const result = validate(cidAsString, 'garbage')
    expect(isRight(result)).toEqual(false)
  })
  test('encode', () => {
    const result = cidAsString.encode(cid)
    expect(result).toEqual(cid.toString())
  })
})
