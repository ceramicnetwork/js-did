import { describe, expect, test } from '@jest/globals'
import { decode } from 'codeco'
import { equals } from 'uint8arrays'

import {
  createUint8ArrayAsString,
  isUint8Array,
  uint8ArrayAsBase64,
  uint8ArrayAsBase64pad,
  uint8ArrayAsBase64url,
} from '../src/binary.js'

describe('createUint8ArrayAsString', () => {
  const bytes = new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7])

  test('creates a valid codec', () => {
    const codec = createUint8ArrayAsString('base64')
    const encoded = codec.encode(bytes)
    expect(equals(decode(uint8ArrayAsBase64, encoded), bytes)).toBe(true)
  })

  test('throws on invalid encoding', () => {
    // @ts-expect-error
    const codec = createUint8ArrayAsString('foo')
    expect(() => {
      codec.encode(bytes)
    }).toThrow('Unsupported encoding "foo"')
  })

  test('uint8ArrayAsBase64', () => {
    const encoded = uint8ArrayAsBase64.encode(bytes)
    expect(typeof encoded).toBe('string')
    expect(equals(decode(uint8ArrayAsBase64, encoded), bytes)).toBe(true)
  })

  test('uint8ArrayAsBase64pad', () => {
    const encoded = uint8ArrayAsBase64pad.encode(bytes)
    expect(typeof encoded).toBe('string')
    expect(equals(decode(uint8ArrayAsBase64pad, encoded), bytes)).toBe(true)
  })

  test('uint8ArrayAsBase64url', () => {
    const encoded = uint8ArrayAsBase64url.encode(bytes)
    expect(typeof encoded).toBe('string')
    expect(equals(decode(uint8ArrayAsBase64url, encoded), bytes)).toBe(true)
  })
})

describe('isUint8Array', () => {
  test('ok', () => {
    expect(isUint8Array(new Uint8Array())).toBe(true)
  })

  test('not ok', () => {
    expect(isUint8Array(undefined)).toBe(false)
    expect(isUint8Array('')).toBe(false)
    expect(isUint8Array([])).toBe(false)
  })
})
