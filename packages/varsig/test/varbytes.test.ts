import { test, expect } from '@jest/globals'
import * as varintes from 'varintes'
import * as varbytes from '../src/varbytes.js'
import { randomBytes } from '@stablelib/random'
import { concat } from 'uint8arrays'

test('single-byte len', () => {
  const input = new Uint8Array([20])
  const [encoded] = varbytes.encode(input)
  expect(encoded).toEqual(new Uint8Array([1, 20]))
  const [decoded] = varbytes.decode(encoded)
  expect(decoded).toEqual(input)
})

test('multi-byte len', () => {
  const input = randomBytes(256)
  const [encoded] = varbytes.encode(input)
  const [len] = varintes.encode(input.byteLength)
  expect(encoded).toEqual(concat([len, input]))
  const [decoded] = varbytes.decode(encoded)
  expect(decoded).toEqual(input)
})

test('with remainder', () => {
  const input = randomBytes(256)
  const [encoded] = varbytes.encode(input)
  const full = concat([encoded, randomBytes(256)])
  const [len] = varintes.encode(input.byteLength)
  expect(encoded).toEqual(concat([len, input]))
  const [decoded] = varbytes.decode(full)
  expect(decoded).toEqual(input)
})
