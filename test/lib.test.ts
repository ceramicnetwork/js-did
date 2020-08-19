/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { DIDDocument, Resolver } from 'did-resolver'

import { DID, DIDProvider } from '../src'

describe('DID class', () => {
  describe('provider behavior', () => {
    const defaultOptions = { provider: { send: jest.fn() } as DIDProvider }

    test('`authenticated` property', () => {
      const did = new DID(defaultOptions)
      expect(did.authenticated).toBe(false)
    })

    test('`DID` property', () => {
      const did = new DID(defaultOptions)
      expect(() => did.DID).toThrow('DID is not authenticated')
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
              result: { did: '1234' },
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
        expect(did.DID).toBe('1234')
      })

      test('uses the provider given in options', async () => {
        const provider = {
          send: jest.fn((req) => {
            return Promise.resolve({
              jsonrpc: '2.0',
              id: req.id,
              result: { did: '1234' },
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
        expect(did.DID).toBe('1234')
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
              result = { did: '1234' }
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
          foo: Buffer.from('foo'),
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
            did: '1234',
            payload: {
              foo: {
                '/': {
                  base64: data.foo.toString('base64'),
                },
              },
            },
          },
        })
      })

      test('throws an error if there is no provider', async () => {
        const did = new DID()
        await expect(did.createJWS({})).rejects.toThrow('No provider available')
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
