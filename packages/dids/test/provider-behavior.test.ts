/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { jest } from '@jest/globals'
import { randomBytes } from '@stablelib/random'
import { generateKeyPairFromSeed } from '@stablelib/x25519'
import { Cacao, CacaoBlock, SiweMessage } from '@didtools/cacao'
import { decodeCleartext, encodePayload, prepareCleartext } from 'dag-jose-utils'
import { decryptJWE, JWE, x25519Decrypter } from 'did-jwt'
import { DIDDocument, ResolverRegistry } from 'did-resolver'
import { Wallet } from 'ethers'
import * as u8a from 'uint8arrays'
import type { DIDProvider } from '../src/types.js'

jest.unstable_mockModule('../src/random-string.util.js', () => {
  return {
    randomString: () => 'rWCXyH1otp5/F78tycckgg',
  }
})

global.Date.now = jest.fn(() => 1606236374000)

const MOCK_AUTH_JWS = {
  payload:
    'eyJkaWQiOiJkaWQ6a2V5Ono2TWtvQ0hZWExIQVdIUFBWTUJTZTluUWN0ZVRtblkzMkdkQlFNWXAxM2NkYWNEVSIsImV4cCI6MTYwNjIzNjM3NCwibm9uY2UiOiJyV0NYeUgxb3RwNS9GNzh0eWNja2dnIn0',
  signatures: [
    {
      protected:
        'eyJhbGciOiJFZERTQSIsImtpZCI6ImRpZDprZXk6ejZNa29DSFlYTEhBV0hQUFZNQlNlOW5RY3RlVG1uWTMyR2RCUU1ZcDEzY2RhY0RVI3o2TWtvQ0hZWExIQVdIUFBWTUJTZTluUWN0ZVRtblkzMkdkQlFNWXAxM2NkYWNEVSJ9',
      signature:
        'iNsGriqC2s-TXBPbOR5C5djZc2iKV47wuPC2f2aXlX64uB-DX1dFFFgfrogFcwd2WR5R46ya-0Hu3wZbKqUTDg',
    },
  ],
}
const MOCK_NONCE = 'rWCXyH1otp5/F78tycckgg'
const MOCK_DID = 'did:key:z6MkoCHYXLHAWHPPVMBSe9nQcteTmnY32GdBQMYp13cdacDU'
const MOCK_RESOLVER_RESULT = {
  didResolutionMetadata: {},
  didDocumentMetadata: {},
  didDocument: {
    '@context': 'https://w3id.org/did/v1',
    id: 'did:key:z6MkoCHYXLHAWHPPVMBSe9nQcteTmnY32GdBQMYp13cdacDU',
    verificationMethod: [
      {
        id: 'did:key:z6MkoCHYXLHAWHPPVMBSe9nQcteTmnY32GdBQMYp13cdacDU#z6MkoCHYXLHAWHPPVMBSe9nQcteTmnY32GdBQMYp13cdacDU',
        type: 'Ed25519VerificationKey2018',
        controller: 'did:key:z6MkoCHYXLHAWHPPVMBSe9nQcteTmnY32GdBQMYp13cdacDU',
        publicKeyBase58: '9k2Vw62jAjtvNrLjxapZmo6TxDGBcPNpiLdtAmecfPS6',
      },
    ],
    authentication: [
      'did:key:z6MkoCHYXLHAWHPPVMBSe9nQcteTmnY32GdBQMYp13cdacDU#z6MkoCHYXLHAWHPPVMBSe9nQcteTmnY32GdBQMYp13cdacDU',
    ],
    assertionMethod: [
      'did:key:z6MkoCHYXLHAWHPPVMBSe9nQcteTmnY32GdBQMYp13cdacDU#z6MkoCHYXLHAWHPPVMBSe9nQcteTmnY32GdBQMYp13cdacDU',
    ],
    capabilityDelegation: [
      'did:key:z6MkoCHYXLHAWHPPVMBSe9nQcteTmnY32GdBQMYp13cdacDU#z6MkoCHYXLHAWHPPVMBSe9nQcteTmnY32GdBQMYp13cdacDU',
    ],
    capabilityInvocation: [
      'did:key:z6MkoCHYXLHAWHPPVMBSe9nQcteTmnY32GdBQMYp13cdacDU#z6MkoCHYXLHAWHPPVMBSe9nQcteTmnY32GdBQMYp13cdacDU',
    ],
    keyAgreement: [
      {
        id: 'did:key:z6MkoCHYXLHAWHPPVMBSe9nQcteTmnY32GdBQMYp13cdacDU#z6LSpCEVAwDkybHxQM2X6bfhjZA7ac7DVSX3PA6GYqGjue3b',
        type: 'X25519KeyAgreementKey2019',
        controller: 'did:key:z6MkoCHYXLHAWHPPVMBSe9nQcteTmnY32GdBQMYp13cdacDU',
        publicKeyBase58: 'DX4KedQtt8aDJxekZx9kQxwdjTa6nqLtWBNb4NdDCGGq',
      },
    ],
  },
}
const MOCK_RESOLVER_REGISTRY: ResolverRegistry = {
  key: () => Promise.resolve(MOCK_RESOLVER_RESULT),
}

const defaultOptions = { provider: { send: jest.fn() } as DIDProvider }

test('`authenticated` property', async () => {
  const { DID } = await import('../src/did.js')
  const did = new DID(defaultOptions)
  expect(did.authenticated).toBe(false)
})

test('`id` property', async () => {
  const { DID } = await import('../src/did.js')
  const did = new DID(defaultOptions)
  expect(() => did.id).toThrow('DID is not authenticated')
})

test('`parent` property', async () => {
  const { DID } = await import('../src/did.js')
  const did = new DID(defaultOptions)
  expect(() => did.parent).toThrow('DID has no parent DID')
  expect(did.hasParent).toBe(false)
  const parent = 'did:pkh:eip155:1:0xh...'
  const didWParent = new DID(Object.assign(defaultOptions, { parent }))
  expect(didWParent.parent).toBe(parent)
  expect(didWParent.hasParent).toBe(true)
})

test('RPC calls throw an error if the response payload is an error', async () => {
  const { DID } = await import('../src/did.js')
  const provider1 = {
    send: jest.fn((req: { id: number }) => {
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
    send: jest.fn((req: { id: number }) => {
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

test('`setProvider` method', async () => {
  const { DID } = await import('../src/did.js')
  const provider1 = {} as DIDProvider
  const provider2 = {} as DIDProvider

  const did = new DID()
  expect(did._client).not.toBeDefined()

  did.setProvider(provider1)
  expect(did._client.connection).toBe(provider1)

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const client = did._client
  did.setProvider(provider1)
  expect(did._client).toBe(client)

  expect(() => did.setProvider(provider2)).toThrow('A different provider is already set')
})

describe('`authenticate` method', () => {
  test('uses the provider attached to the instance', async () => {
    const { DID } = await import('../src/did.js')
    const provider = {
      send: jest.fn((req: { id: number }) => {
        return Promise.resolve({
          jsonrpc: '2.0',
          id: req.id,
          result: MOCK_AUTH_JWS,
        })
      }),
    } as DIDProvider
    const did = new DID({ provider, resolver: MOCK_RESOLVER_REGISTRY })

    await did.authenticate()
    expect(provider.send).toHaveBeenCalledTimes(1)
    expect(provider.send).toHaveBeenCalledWith({
      jsonrpc: '2.0',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      id: expect.any(String),
      method: 'did_authenticate',
      params: {
        aud: undefined,
        nonce: MOCK_NONCE,
        paths: [],
      },
    })
    expect(did.authenticated).toBe(true)
    expect(did.id).toBe(MOCK_DID)
  })

  test('uses the provider given in options', async () => {
    const { DID } = await import('../src/did.js')
    const provider = {
      send: jest.fn((req: { id: number }) => {
        return Promise.resolve({
          jsonrpc: '2.0',
          id: req.id,
          result: MOCK_AUTH_JWS,
        })
      }),
    } as DIDProvider
    const did = new DID({ resolver: MOCK_RESOLVER_REGISTRY })

    await did.authenticate({ provider })
    expect(provider.send).toHaveBeenCalledTimes(1)
    expect(provider.send).toHaveBeenCalledWith({
      jsonrpc: '2.0',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      id: expect.any(String),
      method: 'did_authenticate',
      params: {
        aud: undefined,
        nonce: MOCK_NONCE,
        paths: [],
      },
    })
    expect(did.authenticated).toBe(true)
    expect(did.id).toBe(MOCK_DID)
  })

  test('throws an error if there is no provider', async () => {
    const { DID } = await import('../src/did.js')
    const did = new DID()
    await expect(did.authenticate()).rejects.toThrow('No provider available')
  })
})

describe('`createJWS` method', () => {
  test('uses the provider attached to the instance', async () => {
    const { DID } = await import('../src/did.js')
    let authCalled = false
    const provider = {
      send: jest.fn((req: { id: string }) => {
        let result
        if (authCalled) {
          result = { jws: '5678' }
        } else {
          authCalled = true
          result = MOCK_AUTH_JWS
        }
        return Promise.resolve({
          jsonrpc: '2.0',
          id: req.id,
          result,
        })
      }),
    } as DIDProvider
    const did = new DID({ provider, resolver: MOCK_RESOLVER_REGISTRY })

    await expect(did.createJWS({})).rejects.toThrow('DID is not authenticated')
    await did.authenticate()

    const data = {
      foo: 'bar',
    }
    const jws = await did.createJWS(data)
    expect(jws).toBe('5678')
    expect(provider.send).toHaveBeenCalledTimes(2)
    // @ts-expect-error mock
    expect(provider.send.mock.calls[1][0]).toEqual({
      jsonrpc: '2.0',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      id: expect.any(String),
      method: 'did_createJWS',
      params: {
        did: MOCK_DID,
        payload: {
          foo: 'bar',
        },
      },
    })
  })

  test('throws an error if there is no provider', async () => {
    const { DID } = await import('../src/did.js')
    const did = new DID()
    await expect(did.createJWS({})).rejects.toThrow('No provider available')
  })
})

describe('`createDagJWS method`', () => {
  test('throws an error if there is no provider', async () => {
    const { DID } = await import('../src/did.js')
    const did = new DID()
    await expect(did.createJWS({})).rejects.toThrow('No provider available')
  })

  test('creates a DagJWS with capability correctly', async () => {
    const { DID } = await import('../src/did.js')
    let authCalled = false
    const provider = {
      send: jest.fn((req: { id: string }) => {
        let result
        if (authCalled) {
          result = {
            jws: {
              payload: 'AXESIF0YCN-uia9HZG8dCzmQ-c3SooWwZ_k01MzQXUgERz_s',
              signatures: [
                {
                  protected:
                    'eyJhbGciOiJFZERTQSIsImNhcCI6ImlwZnM6Ly9iYWZ5cmVpY2szajZ2d2E3bTJ5dWgzb3VuY3ZkM2x1cTRtMzNlc3Q3NWU0dWQ3emx1azZza2V4eXN6NCIsImtpZCI6ImRpZDprZXk6ejZNa3JCZE5kd1VQblhEVkQxREN4ZWR6VlZCcGFHaThhU21vWEZBZUtOZ3RBZXI4I3o2TWtyQmROZHdVUG5YRFZEMURDeGVkelZWQnBhR2k4YVNtb1hGQWVLTmd0QWVyOCJ9',
                  signature:
                    'GpxlcwZ8ouPVV4rYVxc5fka6-9rq4iVKwRLejh7IdVoa50gqP8wn01ivlv4PlpITNJUBELKqSZhUaWnG9wg5Dg',
                },
              ],
            },
          }
        } else {
          authCalled = true
          result = {
            payload:
              'eyJkaWQiOiJkaWQ6a2V5Ono2TWtyQmROZHdVUG5YRFZEMURDeGVkelZWQnBhR2k4YVNtb1hGQWVLTmd0QWVyOCIsImV4cCI6MTYwNjIzNjk3NCwibm9uY2UiOiJyV0NYeUgxb3RwNS9GNzh0eWNja2dnIiwicGF0aHMiOltdfQ',
            signatures: [
              {
                protected:
                  'eyJhbGciOiJFZERTQSIsImtpZCI6ImRpZDprZXk6ejZNa3JCZE5kd1VQblhEVkQxREN4ZWR6VlZCcGFHaThhU21vWEZBZUtOZ3RBZXI4I3o2TWtyQmROZHdVUG5YRFZEMURDeGVkelZWQnBhR2k4YVNtb1hGQWVLTmd0QWVyOCJ9',
                signature:
                  'uGjLPvi5hAFXuBp6jSDcAdQcRfgHEuD7cSH6XqyiYMGP3xBw45O_cIfeUcP0u8w57AJk9Mgg2aiL9sTC1ERiCw',
              },
            ],
          }
        }
        return Promise.resolve({
          jsonrpc: '2.0',
          id: req.id,
          result,
        })
      }),
    } as DIDProvider
    const resolver: ResolverRegistry = {
      key: () =>
        Promise.resolve({
          didResolutionMetadata: {
            contentType: 'application/did+json',
          },
          didDocument: {
            id: 'did:key:z6MkrBdNdwUPnXDVD1DCxedzVVBpaGi8aSmoXFAeKNgtAer8',
            verificationMethod: [
              {
                id: 'did:key:z6MkrBdNdwUPnXDVD1DCxedzVVBpaGi8aSmoXFAeKNgtAer8#z6MkrBdNdwUPnXDVD1DCxedzVVBpaGi8aSmoXFAeKNgtAer8',
                type: 'Ed25519VerificationKey2018',
                controller: 'did:key:z6MkrBdNdwUPnXDVD1DCxedzVVBpaGi8aSmoXFAeKNgtAer8',
                publicKeyBase58: 'CjNL3hDxSyj26WNWH5g9ePdpkhSHAZXSqEFiV6isFS4k',
              },
            ],
            authentication: [
              'did:key:z6MkrBdNdwUPnXDVD1DCxedzVVBpaGi8aSmoXFAeKNgtAer8#z6MkrBdNdwUPnXDVD1DCxedzVVBpaGi8aSmoXFAeKNgtAer8',
            ],
          },
          didDocumentMetadata: {},
        }),
    }

    const wallet = new Wallet('0x01104074416bab5b755dd6cd1fb177db7e981335e18b935b1d887d5640015e4c')
    const siwe = new SiweMessage({
      domain: 'service.org',
      address: wallet.address,
      statement: 'I accept the ServiceOrg Terms of Service: https://service.org/tos',
      uri: 'did:key:z6MkrBdNdwUPnXDVD1DCxedzVVBpaGi8aSmoXFAeKNgtAer8',
      version: '1',
      nonce: '32891757',
      issuedAt: '2021-09-30T16:25:24.000Z',
      notBefore: '2021-09-30T16:25:24.000Z',
      expirationTime: '2021-10-30T16:25:24.000Z',
      chainId: '1',
      resources: [
        'ipfs://Qme7ss3ARVgxv6rXqVPiikMJ8u2NLgmgszg13pYrDKEoiu',
        'https://example.com/my-web2-claim.json',
      ],
    })

    siwe.signature = await wallet.signMessage(siwe.toMessage())

    const cacao = Cacao.fromSiweMessage(siwe)
    const cacaoBlock = await CacaoBlock.fromCacao(cacao)
    const did = new DID({ provider, resolver, capability: cacao })
    await did.authenticate()

    const data = {
      foo: Buffer.from('foo'),
    }

    const res = await did.createDagJWS(data)
    const encPayload = await encodePayload(data)

    expect(did.parent).toBe(`did:pkh:eip155:1:${wallet.address}`)
    expect(did.hasParent).toBe(true)
    expect(did.hasCapability).toBe(true)

    // Valid capability
    await expect(
      did.verifyJWS(res.jws, {
        issuer: `did:pkh:eip155:1:${wallet.address}`,
        capability: cacao,
        atTime: new Date('2021-10-30T16:25:24.000Z'),
      })
    ).resolves.not.toThrowError()

    // Expired
    await expect(
      did.verifyJWS(res.jws, {
        issuer: `did:pkh:eip155:1:${wallet.address}`,
        capability: cacao,
        atTime: new Date('2023-10-30T16:25:24.000Z'),
      })
    ).rejects.toThrowError()

    // Valid: Expiration not checked
    await expect(
      did.verifyJWS(res.jws, {
        issuer: `did:pkh:eip155:1:${wallet.address}`,
        capability: cacao,
        disableTimecheck: true,
        atTime: new Date('2023-10-30T16:25:24.000Z'),
      })
    ).resolves.not.toThrowError()

    expect(res).toEqual({
      jws: {
        link: encPayload.cid,
        payload: 'AXESIF0YCN-uia9HZG8dCzmQ-c3SooWwZ_k01MzQXUgERz_s',
        signatures: [
          {
            protected:
              'eyJhbGciOiJFZERTQSIsImNhcCI6ImlwZnM6Ly9iYWZ5cmVpY2szajZ2d2E3bTJ5dWgzb3VuY3ZkM2x1cTRtMzNlc3Q3NWU0dWQ3emx1azZza2V4eXN6NCIsImtpZCI6ImRpZDprZXk6ejZNa3JCZE5kd1VQblhEVkQxREN4ZWR6VlZCcGFHaThhU21vWEZBZUtOZ3RBZXI4I3o2TWtyQmROZHdVUG5YRFZEMURDeGVkelZWQnBhR2k4YVNtb1hGQWVLTmd0QWVyOCJ9',
            signature:
              'GpxlcwZ8ouPVV4rYVxc5fka6-9rq4iVKwRLejh7IdVoa50gqP8wn01ivlv4PlpITNJUBELKqSZhUaWnG9wg5Dg',
          },
        ],
      },
      linkedBlock: encPayload.linkedBlock,
      cacaoBlock: cacaoBlock.bytes,
    })
  })

  test('create a JWW/DagJWS throws when using expired capability', async () => {
    const { DID } = await import('../src/did.js')
    const provider = {
      send: jest.fn((req: { id: string }) => {
        const result = {
          payload:
            'eyJkaWQiOiJkaWQ6a2V5Ono2TWtyQmROZHdVUG5YRFZEMURDeGVkelZWQnBhR2k4YVNtb1hGQWVLTmd0QWVyOCIsImV4cCI6MTYwNjIzNjk3NCwibm9uY2UiOiJyV0NYeUgxb3RwNS9GNzh0eWNja2dnIiwicGF0aHMiOltdfQ',
          signatures: [
            {
              protected:
                'eyJhbGciOiJFZERTQSIsImtpZCI6ImRpZDprZXk6ejZNa3JCZE5kd1VQblhEVkQxREN4ZWR6VlZCcGFHaThhU21vWEZBZUtOZ3RBZXI4I3o2TWtyQmROZHdVUG5YRFZEMURDeGVkelZWQnBhR2k4YVNtb1hGQWVLTmd0QWVyOCJ9',
              signature:
                'uGjLPvi5hAFXuBp6jSDcAdQcRfgHEuD7cSH6XqyiYMGP3xBw45O_cIfeUcP0u8w57AJk9Mgg2aiL9sTC1ERiCw',
            },
          ],
        }
        // }
        return Promise.resolve({
          jsonrpc: '2.0',
          id: req.id,
          result,
        })
      }),
    } as DIDProvider
    const resolver: ResolverRegistry = {
      key: () =>
        Promise.resolve({
          didResolutionMetadata: {
            contentType: 'application/did+json',
          },
          didDocument: {
            id: 'did:key:z6MkrBdNdwUPnXDVD1DCxedzVVBpaGi8aSmoXFAeKNgtAer8',
            verificationMethod: [
              {
                id: 'did:key:z6MkrBdNdwUPnXDVD1DCxedzVVBpaGi8aSmoXFAeKNgtAer8#z6MkrBdNdwUPnXDVD1DCxedzVVBpaGi8aSmoXFAeKNgtAer8',
                type: 'Ed25519VerificationKey2018',
                controller: 'did:key:z6MkrBdNdwUPnXDVD1DCxedzVVBpaGi8aSmoXFAeKNgtAer8',
                publicKeyBase58: 'CjNL3hDxSyj26WNWH5g9ePdpkhSHAZXSqEFiV6isFS4k',
              },
            ],
            authentication: [
              'did:key:z6MkrBdNdwUPnXDVD1DCxedzVVBpaGi8aSmoXFAeKNgtAer8#z6MkrBdNdwUPnXDVD1DCxedzVVBpaGi8aSmoXFAeKNgtAer8',
            ],
          },
          didDocumentMetadata: {},
        }),
    }

    const wallet = new Wallet('0x01104074416bab5b755dd6cd1fb177db7e981335e18b935b1d887d5640015e4c')
    const siwe = new SiweMessage({
      domain: 'service.org',
      address: wallet.address,
      statement: 'I accept the ServiceOrg Terms of Service: https://service.org/tos',
      uri: 'did:key:z6MkrBdNdwUPnXDVD1DCxedzVVBpaGi8aSmoXFAeKNgtAer8',
      version: '1',
      nonce: '32891757',
      issuedAt: '20218-09-30T16:25:24.000Z',
      notBefore: '2018-09-30T16:25:24.000Z',
      expirationTime: '2019-09-30T16:25:24.000Z',
      chainId: '1',
      resources: [
        'ipfs://Qme7ss3ARVgxv6rXqVPiikMJ8u2NLgmgszg13pYrDKEoiu',
        'https://example.com/my-web2-claim.json',
      ],
    })

    siwe.signature = await wallet.signMessage(siwe.toMessage())

    const cacao = Cacao.fromSiweMessage(siwe)
    const did = new DID({ provider, resolver, capability: cacao })
    await did.authenticate()

    const data = {
      foo: Buffer.from('foo'),
    }

    await expect(did.createDagJWS(data)).rejects.toThrowError(/Capability is expired/)
    await expect(did.createJWS(data)).rejects.toThrowError(/Capability is expired/)
  })

  test('creates a DagJWS correctly', async () => {
    const { DID } = await import('../src/did.js')
    const { encodeBase64Url, encodeBase64 } = await import('../src/utils.js')
    let authCalled = false
    const provider = {
      send: jest.fn((req: { id: string }) => {
        let result
        if (authCalled) {
          result = {
            jws: { payload: '234', signatures: [{ protected: '5678', signature: '4324' }] },
          }
        } else {
          authCalled = true
          result = MOCK_AUTH_JWS
        }
        return Promise.resolve({
          jsonrpc: '2.0',
          id: req.id,
          result,
        })
      }),
    } as DIDProvider
    const did = new DID({ provider, resolver: MOCK_RESOLVER_REGISTRY })

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

    // @ts-expect-error mock
    expect(provider.send.mock.calls[1][0]).toEqual({
      jsonrpc: '2.0',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      id: expect.any(String),
      method: 'did_createJWS',
      params: {
        did: MOCK_DID,
        payload: encodeBase64Url(encPayload.cid.bytes),
        linkedBlock: encodeBase64(encPayload.linkedBlock),
      },
    })
  })
})

describe('`verifyJWS method`', () => {
  const THREE_ID_RESOLVER_RESULT = {
    didResolutionMetadata: {},
    didDocumentMetadata: {},
    didDocument: {
      '@context': 'https://w3id.org/did/v1',
      id: 'did:3:bagcqceraskxqzx47ivokjqofwoyuyb23tiaepdrazq5rlzn2hx7kmyaczwoa',
      verificationMethod: [
        {
          controller: 'did:3:bagcqceraskxqzx47ivokjqofwoyuyb23tiaepdrazq5rlzn2hx7kmyaczwoa',
          id: 'did:3:bagcqceraskxqzx47ivokjqofwoyuyb23tiaepdrazq5rlzn2hx7kmyaczwoa#7Xd9rh1vWBaxQsF',
          publicKeyHex: '0368e92e4d7284f4f0414f023019fe19532b7da0115edeed2fe183199d79a78b7e',
          type: 'Secp256k1VerificationKey2018',
        },
      ],
      authentication: [
        {
          controller: 'did:3:bagcqceraskxqzx47ivokjqofwoyuyb23tiaepdrazq5rlzn2hx7kmyaczwoa',
          id: 'did:3:bagcqceraskxqzx47ivokjqofwoyuyb23tiaepdrazq5rlzn2hx7kmyaczwoa#7Xd9rh1vWBaxQsF',
          publicKeyHex: '0368e92e4d7284f4f0414f023019fe19532b7da0115edeed2fe183199d79a78b7e',
          type: 'Secp256k1VerificationKey2018',
        },
      ],
    },
  }
  const resolverRegistry: ResolverRegistry = {
    ...MOCK_RESOLVER_REGISTRY,
    '3': () => Promise.resolve(THREE_ID_RESOLVER_RESULT),
  }
  test('correctly verifies jws string', async () => {
    const { DID } = await import('../src/did.js')
    const did = new DID({ resolver: resolverRegistry })
    const jws =
      'eyJraWQiOiJkaWQ6MzpiYWdjcWNlcmFza3hxeng0N2l2b2tqcW9md295dXliMjN0aWFlcGRyYXpxNXJsem4yaHg3a215YWN6d29hP3ZlcnNpb24taWQ9MCNrV01YTU1xazVXc290UW0iLCJhbGciOiJFUzI1NksifQ.AXESIHhRlyKdyLsRUpRdpY4jSPfiee7e0GzCynNtDoeYWLUB.h7bHmTaBGza_QlFRI9LBfgB3Nw0m7hLzwMm4nLvcR3n9sHKRoCrY0soWnDbmuG7jfVgx4rYkjJohDuMNgbTpEQ'
    expect(await did.verifyJWS(jws)).toEqual({
      didResolutionResult: THREE_ID_RESOLVER_RESULT,
      kid: 'did:3:bagcqceraskxqzx47ivokjqofwoyuyb23tiaepdrazq5rlzn2hx7kmyaczwoa?version-id=0#kWMXMMqk5WsotQm',
    })
  })

  test('correctly verifies DagJWS', async () => {
    const { DID } = await import('../src/did.js')
    const did = new DID({ resolver: resolverRegistry })
    const jws = {
      payload: 'AXESIHhRlyKdyLsRUpRdpY4jSPfiee7e0GzCynNtDoeYWLUB',
      signatures: [
        {
          protected:
            'eyJraWQiOiJkaWQ6MzpiYWdjcWNlcmFza3hxeng0N2l2b2tqcW9md295dXliMjN0aWFlcGRyYXpxNXJsem4yaHg3a215YWN6d29hP3ZlcnNpb24taWQ9MCNrV01YTU1xazVXc290UW0iLCJhbGciOiJFUzI1NksifQ',
          signature:
            'h7bHmTaBGza_QlFRI9LBfgB3Nw0m7hLzwMm4nLvcR3n9sHKRoCrY0soWnDbmuG7jfVgx4rYkjJohDuMNgbTpEQ',
        },
      ],
    }
    expect(await did.verifyJWS(jws)).toEqual({
      didResolutionResult: THREE_ID_RESOLVER_RESULT,
      kid: 'did:3:bagcqceraskxqzx47ivokjqofwoyuyb23tiaepdrazq5rlzn2hx7kmyaczwoa?version-id=0#kWMXMMqk5WsotQm',
    })
  })

  test('correctly verifies jws auth JWS', async () => {
    const { DID } = await import('../src/did.js')
    const did = new DID({ resolver: resolverRegistry })
    expect(await did.verifyJWS(MOCK_AUTH_JWS)).toEqual({
      didResolutionResult: MOCK_RESOLVER_RESULT,
      kid: 'did:key:z6MkoCHYXLHAWHPPVMBSe9nQcteTmnY32GdBQMYp13cdacDU#z6MkoCHYXLHAWHPPVMBSe9nQcteTmnY32GdBQMYp13cdacDU',
      payload: {
        did: 'did:key:z6MkoCHYXLHAWHPPVMBSe9nQcteTmnY32GdBQMYp13cdacDU',
        exp: 1606236374,
        nonce: 'rWCXyH1otp5/F78tycckgg',
      },
    })
  })
})

const createRegistry = (didMap: Record<string, Uint8Array>): ResolverRegistry => ({
  // eslint-disable-next-line @typescript-eslint/require-await
  test: async (did: string) => {
    const pk = generateKeyPairFromSeed(didMap[did]).publicKey
    return {
      didResolutionMetadata: {},
      didDocumentMetadata: {},
      didDocument: {
        keyAgreement: [
          {
            id: u8a.toString(pk, 'base58btc'),
            type: 'X25519KeyAgreementKey2019',
            publicKeyBase58: u8a.toString(pk, 'base58btc'),
          },
        ],
      } as DIDDocument,
    }
  },
})

describe('`createJWE method`', () => {
  beforeAll(() => {
    jest.resetAllMocks()
  })
  test('correctly encrypts, one recipient', async () => {
    const { DID } = await import('../src/did.js')
    const recipient = 'did:test:asdf'
    const secretKey = randomBytes(32)
    const registry = createRegistry({ [recipient]: secretKey })
    const did = new DID({ resolver: registry })
    const cleartext = u8a.fromString('such secret')
    const jwe = await did.createJWE(cleartext, [recipient])

    const decrypter = x25519Decrypter(secretKey)
    expect(u8a.equals(await decryptJWE(jwe, decrypter), cleartext)).toBe(true)
  })

  test('correctly encrypts, two recipients', async () => {
    const { DID } = await import('../src/did.js')
    const recipient1 = 'did:test:asdf'
    const secretKey1 = randomBytes(32)
    const recipient2 = 'did:test:lalal'
    const secretKey2 = randomBytes(32)
    const registry = createRegistry({ [recipient1]: secretKey1, [recipient2]: secretKey2 })
    const did = new DID({ resolver: registry })
    const cleartext = u8a.fromString('such secret')
    const jwe = await did.createJWE(cleartext, [recipient1, recipient2])

    const decrypter1 = x25519Decrypter(secretKey1)
    const decrypter2 = x25519Decrypter(secretKey2)
    expect(u8a.equals(await decryptJWE(jwe, decrypter1), cleartext)).toBe(true)
    expect(u8a.equals(await decryptJWE(jwe, decrypter2), cleartext)).toBe(true)
  })
})

describe('`createDagJWE method`', () => {
  test('correctly formats dagJWE cleartext', async () => {
    const { DID } = await import('../src/did.js')
    const recipient = 'did:test:asdf'
    const secretKey = randomBytes(32)
    const registry = createRegistry({ [recipient]: secretKey })
    const did = new DID({ resolver: registry })
    const cleartext = { very: 'cool', dag: 'object' }
    const jwe = await did.createDagJWE(cleartext, [recipient])

    const decrypter = x25519Decrypter(secretKey)
    const data = await decryptJWE(jwe, decrypter)
    expect(decodeCleartext(data)).toEqual(cleartext)
  })
})

describe('`decryptJWE method`', () => {
  test('throws an error if there is no provider', async () => {
    const { DID } = await import('../src/did.js')
    const did = new DID()
    await expect(did.createJWS({})).rejects.toThrow('No provider available')
  })

  test('uses the provider attached to the instance', async () => {
    const { DID } = await import('../src/did.js')
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

    const jwe = { foo: 'bar' } as unknown as JWE
    const cleartext = await did.decryptJWE(jwe)
    expect(u8a.equals(cleartext, u8a.fromString('abcde'))).toBe(true)
    expect(provider.send).toHaveBeenCalledTimes(1)
    // @ts-expect-error mock
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

describe('`decryptDagJWE` method', () => {
  test('throws an error if there is no provider', async () => {
    const { DID } = await import('../src/did.js')
    const did = new DID()
    await expect(did.createJWS({})).rejects.toThrow('No provider available')
  })

  test('uses the provider attached to the instance', async () => {
    const { DID } = await import('../src/did.js')
    const { encodeBase64 } = await import('../src/utils.js')
    const clearObj = { asdf: 432 }
    const preparedCleartext = await prepareCleartext(clearObj)
    const cleartext = encodeBase64(preparedCleartext)
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

    const jwe = { foo: 'bar' } as unknown as JWE
    const decrypted = await did.decryptDagJWE(jwe)
    expect(decrypted).toEqual(clearObj)
    expect(provider.send).toHaveBeenCalledTimes(1)
    // @ts-expect-error mock
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
