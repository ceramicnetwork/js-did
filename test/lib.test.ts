/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { DIDDocument, Resolver } from 'did-resolver'
import * as u8a from 'uint8arrays'
import { randomBytes } from '@stablelib/random'
import { generateKeyPairFromSeed } from '@stablelib/x25519'
import { x25519Decrypter, decryptJWE } from 'did-jwt'
import CID from 'cids'

import { DID, DIDProvider } from '../src'
import { encodePayload, encodeCleartext, decodeCleartext, encodeBase64 } from '../src/utils'

describe('DID class', () => {
  describe('provider behavior', () => {
    const defaultOptions = { provider: { send: jest.fn() } as DIDProvider }

    test('`authenticated` property', () => {
      const did = new DID(defaultOptions)
      expect(did.authenticated).toBe(false)
    })

    test('`id` property', () => {
      const did = new DID(defaultOptions)
      expect(() => did.id).toThrow('DID is not authenticated')
    })

    test('RPC calls throw an error if the response payload is an error', async () => {
      const provider1 = {
        send: jest.fn((req) => {
          return Promise.resolve({
            jsonrpc: '2.0',
            id: req.id,
            error: { code: 401, message: 'Unauthorized' },
          })
        }),
      } as DIDProvider
      const did1 = new DID({ provider: provider1 })
      await expect(() => did1.authenticate()).rejects.toThrow('Unauthorized')

      const provider2 = {
        send: jest.fn((req) => {
          return Promise.resolve({
            jsonrpc: '2.0',
            id: req.id,
            error: { code: 401 },
          })
        }),
      } as DIDProvider
      const did2 = new DID({ provider: provider2 })
      await expect(() => did2.authenticate()).rejects.toThrow('Application error')
    })

    test('`setProvider` method', () => {
      const provider1 = {} as DIDProvider
      const provider2 = {} as DIDProvider

      const did = new DID()
      expect(did._client).not.toBeDefined()

      did.setProvider(provider1)
      expect(did._client.connection).toBe(provider1)

      const client = did._client
      did.setProvider(provider1)
      expect(did._client).toBe(client)

      expect(() => did.setProvider(provider2)).toThrow('A different provider is already set')
    })

    describe('`authenticate` method', () => {
      test('uses the provider attached to the instance', async () => {
        const provider = {
          send: jest.fn((req) => {
            return Promise.resolve({
              jsonrpc: '2.0',
              id: req.id,
              result: { did: 'did:3:1234' },
            })
          }),
        } as DIDProvider
        const did = new DID({ provider })

        await did.authenticate()
        expect(provider.send).toHaveBeenCalledTimes(1)
        expect(provider.send).toHaveBeenCalledWith({
          jsonrpc: '2.0',
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          id: expect.any(String),
          method: 'did_authenticate',
          params: undefined,
        })
        expect(did.authenticated).toBe(true)
        expect(did.id).toBe('did:3:1234')
      })

      test('uses the provider given in options', async () => {
        const provider = {
          send: jest.fn((req) => {
            return Promise.resolve({
              jsonrpc: '2.0',
              id: req.id,
              result: { did: 'did:3:1234' },
            })
          }),
        } as DIDProvider
        const did = new DID()

        await did.authenticate({ provider })
        expect(provider.send).toHaveBeenCalledTimes(1)
        expect(provider.send).toHaveBeenCalledWith({
          jsonrpc: '2.0',
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          id: expect.any(String),
          method: 'did_authenticate',
          params: undefined,
        })
        expect(did.authenticated).toBe(true)
        expect(did.id).toBe('did:3:1234')
      })

      test('throws an error if there is no provider', async () => {
        const did = new DID()
        await expect(did.authenticate()).rejects.toThrow('No provider available')
      })
    })

    describe('`createJWS` method', () => {
      test('uses the provider attached to the instance', async () => {
        let authCalled = false
        const provider = {
          send: jest.fn((req: { id: string }) => {
            let result
            if (authCalled) {
              result = { jws: '5678' }
            } else {
              authCalled = true
              result = { did: 'did:3:1234' }
            }
            return Promise.resolve({
              jsonrpc: '2.0',
              id: req.id,
              result,
            })
          }),
        } as DIDProvider
        const did = new DID({ provider })

        await expect(did.createJWS({})).rejects.toThrow('DID is not authenticated')
        await did.authenticate()

        const data = {
          foo: 'bar',
        }
        const jws = await did.createJWS(data)
        expect(jws).toBe('5678')
        expect(provider.send).toHaveBeenCalledTimes(2)
        // @ts-expect-error
        expect(provider.send.mock.calls[1][0]).toEqual({
          jsonrpc: '2.0',
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          id: expect.any(String),
          method: 'did_createJWS',
          params: {
            did: 'did:3:1234',
            payload: {
              foo: 'bar',
            },
          },
        })
      })

      test('throws an error if there is no provider', async () => {
        const did = new DID()
        await expect(did.createJWS({})).rejects.toThrow('No provider available')
      })
    })

    describe('`createDagJWS method`', () => {
      test('throws an error if there is no provider', async () => {
        const did = new DID()
        await expect(did.createJWS({})).rejects.toThrow('No provider available')
      })

      test('creates a DagJWS correctly', async () => {
        let authCalled = false
        const provider = {
          send: jest.fn((req: { id: string }) => {
            let result
            if (authCalled) {
              result = { jws: '5678.234.4324' }
            } else {
              authCalled = true
              result = { did: 'did:3:1234' }
            }
            return Promise.resolve({
              jsonrpc: '2.0',
              id: req.id,
              result,
            })
          }),
        } as DIDProvider
        const did = new DID({ provider })

        await expect(did.createDagJWS({})).rejects.toThrow('DID is not authenticated')
        await did.authenticate()

        const data = {
          foo: Buffer.from('foo'),
        }
        const res = await did.createDagJWS(data)
        const encPayload = await encodePayload(data)
        expect(res).toEqual({
          jws: {
            link: encPayload.cid,
            payload: '234',
            signatures: [{ protected: '5678', signature: '4324' }],
          },
          linkedBlock: encPayload.linkedBlock,
        })

        // @ts-ignore
        expect(provider.send.mock.calls[1][0]).toEqual({
          jsonrpc: '2.0',
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          id: expect.any(String),
          method: 'did_createJWS',
          params: {
            did: 'did:3:1234',
            payload: encodeBase64(encPayload.cid.bytes),
            linkedBlock: encodeBase64(encPayload.linkedBlock),
          },
        })
      })
    })

    const createRegistry = (didMap) => ({
      test: async (did) => {
        const pk = generateKeyPairFromSeed(didMap[did]).publicKey
        return {
          keyAgreement: [{
            type: 'X25519KeyAgreementKey2019',
            publicKeyBase58: u8a.toString(pk, 'base58btc')
          }]
        } as DIDDocument
      }
    })
    describe('`createJWE method`', () => {
      test('correctly encrypts, one recipient', async () => {
        const recipient = 'did:test:asdf'
        const secretKey = randomBytes(32)
        const registry = createRegistry({ [recipient]: secretKey })
        const did = new DID({ resolver: { registry } })
        const cleartext = u8a.fromString('such secret')
        const jwe = await did.createJWE(cleartext, [recipient])

        const decrypter = x25519Decrypter(secretKey)
        expect(await decryptJWE(jwe, decrypter)).toEqual(cleartext)
      })

      test('correctly encrypts, two recipients', async () => {
        const recipient1 = 'did:test:asdf'
        const secretKey1 = randomBytes(32)
        const recipient2 = 'did:test:lalal'
        const secretKey2 = randomBytes(32)
        const registry = createRegistry({ [recipient1]: secretKey1, [recipient2]: secretKey2 })
        const did = new DID({ resolver: { registry } })
        const cleartext = u8a.fromString('such secret')
        const jwe = await did.createJWE(cleartext, [recipient1, recipient2])

        const decrypter1 = x25519Decrypter(secretKey1)
        const decrypter2 = x25519Decrypter(secretKey2)
        expect(await decryptJWE(jwe, decrypter1)).toEqual(cleartext)
        expect(await decryptJWE(jwe, decrypter2)).toEqual(cleartext)
      })
    })

    describe('`createDagJWE method`', () => {
      test('correctly formats dagJWE cleartext', async () => {
        const recipient = 'did:test:asdf'
        const secretKey = randomBytes(32)
        const registry = createRegistry({ [recipient]: secretKey })
        const did = new DID({ resolver: { registry } })
        const cleartext = { very: 'cool', dag: 'object' }
        const jwe = await did.createDagJWE(cleartext, [recipient])

        const decrypter = x25519Decrypter(secretKey)
        const data = await decryptJWE(jwe, decrypter)
        expect(decodeCleartext(data)).toEqual(cleartext)
      })
    })

    describe('`decryptJWE method`', () => {
      test('throws an error if there is no provider', async () => {
        const did = new DID()
        await expect(did.createJWS({})).rejects.toThrow('No provider available')
      })

      test('uses the provider attached to the instance', async () => {
        const provider = {
          send: jest.fn((req: { id: string }) => {
            return Promise.resolve({
              jsonrpc: '2.0',
              id: req.id,
              result: { cleartext: u8a.toString(u8a.fromString('abcde'), 'base64pad') },
            })
          }),
        } as DIDProvider
        const did = new DID({ provider })
        did._id = 'did:3:1234'

        const jwe = { foo: 'bar' }
        const cleartext = await did.decryptJWE(jwe)
        expect(cleartext).toEqual(u8a.fromString('abcde'))
        expect(provider.send).toHaveBeenCalledTimes(1)
        // @ts-expect-error
        expect(provider.send.mock.calls[0][0]).toEqual({
          jsonrpc: '2.0',
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          id: expect.any(String),
          method: 'did_decryptJWE',
          params: {
            did: 'did:3:1234',
            jwe,
          },
        })
      })
    })

    describe('`decryptDagJWE method`', () => {
      test('throws an error if there is no provider', async () => {
        const did = new DID()
        await expect(did.createJWS({})).rejects.toThrow('No provider available')
      })

      test('uses the provider attached to the instance', async () => {
        const clearObj = { asdf: 432 }
        const cleartext = encodeBase64(encodeCleartext(clearObj).bytes)
        const provider = {
          send: jest.fn((req: { id: string }) => {
            return Promise.resolve({
              jsonrpc: '2.0',
              id: req.id,
              result: { cleartext },
            })
          }),
        } as DIDProvider
        const did = new DID({ provider })
        did._id = 'did:3:1234'

        const jwe = { foo: 'bar' }
        const decrypted = await did.decryptDagJWE(jwe)
        expect(decrypted).toEqual(clearObj)
        expect(provider.send).toHaveBeenCalledTimes(1)
        // @ts-expect-error
        expect(provider.send.mock.calls[0][0]).toEqual({
          jsonrpc: '2.0',
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          id: expect.any(String),
          method: 'did_decryptJWE',
          params: {
            did: 'did:3:1234',
            jwe,
          },
        })
      })
    })
  })

  describe('resolver behavior', () => {
    test('uses the given Resolver instance', () => {
      const resolver = new Resolver()
      const did = new DID({ resolver })
      expect(did._resolver).toBe(resolver)
    })

    test('uses the given Resolver config', async () => {
      const doc = {} as DIDDocument
      const registry = {
        test: jest.fn(() => Promise.resolve(doc)),
      }
      const did = new DID({ resolver: { registry } })
      expect(did._resolver).toBeInstanceOf(Resolver)
      await expect(did.resolve('did:test:test')).resolves.toBe(doc)
    })

    test('creates a Resolver instance when none is provided', () => {
      const did = new DID()
      expect(did._resolver).toBeInstanceOf(Resolver)
    })

    test('setProvider method', () => {
      const did = new DID()
      const resolver = did._resolver
      did.setResolver({})
      expect(did._resolver).toBeInstanceOf(Resolver)
      expect(did._resolver).not.toBe(resolver)
    })
  })
})
