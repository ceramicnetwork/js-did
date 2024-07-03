import { webcrypto } from 'node:crypto'

import {
  createDID,
  generatePrivateKey,
  getAuthenticatedDID,
} from '../src'

globalThis.crypto = webcrypto

describe('createDID()', () => {
  test('creates a DID with no provider by default', async () => {
    const did = createDID()
    await expect(async () => {
      await did.authenticate()
    }).rejects.toThrow('No provider available')
  })

  test('creates a DID with a provider when a seed is provided', async () => {
    const did = createDID(new Uint8Array(32))
    expect(did.authenticated).toBe(false)
    await did.authenticate()
    expect(did.authenticated).toBe(true)
  })
})

test('generatePrivateKey() generates a random 32-bytes key', () => {
  const key1 = generatePrivateKey()
  const key2 = generatePrivateKey()
  expect(key1.toString()).not.toBe(key2.toString())
})

test('getAuthenticatedDID() returns an authenticated DID instance for the given seed', async () => {
  const [did1, did2, did3] = await Promise.all([
    getAuthenticatedDID(new Uint8Array(32)),
    getAuthenticatedDID(new Uint8Array(32)),
    getAuthenticatedDID(generatePrivateKey()),
  ])
  expect(did1.authenticated).toBe(true)
  expect(did2.id).toBe(did1.id)
  expect(did3.id).not.toBe(did1.id)
})
