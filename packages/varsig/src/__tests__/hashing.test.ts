import { expect, test } from '@jest/globals'
import { hex } from './hex.util.js'
import { HashingAlgo, HashingDecoder } from '../hashing.js'
import { BytesTape } from '../bytes-tape.js'

test('SHA2_256', () => {
  const tape = new BytesTape(hex(0x12))
  const result = HashingDecoder.read(tape)
  expect(result).toEqual(HashingAlgo.SHA2_256)
})

test('SHA2_512', () => {
  const tape = new BytesTape(hex(0x13))
  const result = HashingDecoder.read(tape)
  expect(result).toEqual(HashingAlgo.SHA2_512)
})

test('KECCAK256', () => {
  const tape = new BytesTape(hex(0x1b))
  const result = HashingDecoder.read(tape)
  expect(result).toEqual(HashingAlgo.KECCAK256)
})
