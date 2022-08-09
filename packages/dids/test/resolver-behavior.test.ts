/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { jest } from '@jest/globals'
import { DIDResolutionResult, Resolver } from 'did-resolver'
import { DID } from '../src/did.js'

global.Date.now = jest.fn(() => 1606236374000)

test('uses the given Resolver instance', () => {
  const resolver = new Resolver()
  const did = new DID({ resolver })
  expect((did as any)._resolver).toBe(resolver)
})

test('uses the given Resolver config', async () => {
  const res = {
    didDocument: {},
    didResolutionMetadata: {},
  } as DIDResolutionResult
  const registry = {
    test: jest.fn(() => Promise.resolve(res)),
  }
  const did = new DID({ resolver: registry })
  expect((did as any)._resolver).toBeInstanceOf(Resolver)
  await expect(did.resolve('did:test:test')).resolves.toBe(res)
})

test('creates a Resolver instance when none is provided', () => {
  const did = new DID()
  expect((did as any)._resolver).toBeInstanceOf(Resolver)
})

test('setProvider method', () => {
  const did = new DID()
  const resolver = (did as any)._resolver as Resolver
  did.setResolver({})
  expect((did as any)._resolver).toBeInstanceOf(Resolver)
  expect((did as any)._resolver).not.toBe(resolver)
})
