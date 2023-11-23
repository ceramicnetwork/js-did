import { test, describe, expect, jest, beforeEach } from '@jest/globals'
import { concat } from 'uint8arrays/concat'
import { SigningDecoder, SigningKind } from '../signing.js'
import { BytesTape } from '../bytes-tape.js'
import * as varintes from 'varintes'
import { hex } from './hex.util.js'
import { randomBytes } from 'node:crypto'

describe('secp265k1', () => {
  describe('recovery bit off', () => {
    const bytes = concat([varintes.encode(SigningKind.SECP256K1)[0], hex(0x00)])
    const tape = new BytesTape(bytes)

    beforeEach(() => {
      tape.position = 0
    })

    test('read', () => {
      const decoder = new SigningDecoder(tape)
      const result = decoder.read()
      expect(result.kind).toEqual(SigningKind.SECP256K1)
      expect(result.recoveryBit).toEqual(undefined)
    })
    test('readSignature', () => {
      const decoder = new SigningDecoder(tape)
      const result = decoder.read()
      const readSpy = jest.spyOn(tape, 'read')
      const mockSignature = randomBytes(64)
      readSpy.mockImplementation(() => {
        return mockSignature
      })
      const signature = decoder.readSignature(result)
      expect(signature).toEqual(mockSignature)
      expect(readSpy).toHaveBeenCalledWith(64)
    })
  })

  describe('recovery bit on', () => {
    const bytes = concat([varintes.encode(SigningKind.SECP256K1)[0], hex(27)])
    const tape = new BytesTape(bytes)

    beforeEach(() => {
      tape.position = 0
    })

    test('read', () => {
      const decoder = new SigningDecoder(tape)
      const result = decoder.read()
      expect(result.kind).toEqual(SigningKind.SECP256K1)
    })
    test('readSignature', () => {
      const decoder = new SigningDecoder(tape)
      const result = decoder.read()
      const readSpy = jest.spyOn(tape, 'read')
      const mockSignature = randomBytes(64)
      readSpy.mockImplementation(() => {
        return mockSignature
      })
      const signature = decoder.readSignature(result)
      expect(signature).toEqual(mockSignature)
      expect(readSpy).toHaveBeenCalledWith(64)
    })
  })
})
