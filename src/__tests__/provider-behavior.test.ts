/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { DIDDocument, ResolverRegistry } from 'did-resolver'
import * as u8a from 'uint8arrays'
import { randomBytes } from '@stablelib/random'
import { generateKeyPairFromSeed } from '@stablelib/x25519'
import { x25519Decrypter, decryptJWE, JWE } from 'did-jwt'
import { encodePayload, prepareCleartext, decodeCleartext } from 'dag-jose-utils'
import crypto from 'crypto'

import * as utils from '../utils'
// @ts-ignore
utils.randomString = () => 'rWCXyH1otp5/F78tycckgg'
const { encodeBase64, encodeBase64Url } = utils

global.Date.now = jest.fn(() => 1606236374000)
global.crypto = crypto.webcrypto

import { DID } from '../did'
import { DIDProvider } from '../types'

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

test('`setProvider` method', () => {
  const provider1 = {} as DIDProvider
  const provider2 = {} as DIDProvider

  const did = new DID()
  expect((did as any)._client).not.toBeDefined()

  did.setProvider(provider1)
  expect((did as any)._client.connection).toBe(provider1)

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const client = (did as any)._client
  did.setProvider(provider1)
  expect((did as any)._client).toBe(client)

  expect(() => did.setProvider(provider2)).toThrow('A different provider is already set')
})

describe('`authenticate` method', () => {
  test('uses the provider attached to the instance', async () => {
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
    // @ts-expect-error
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

    // @ts-ignore
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
    const did = new DID({ resolver: resolverRegistry })
    const jws =
      'eyJraWQiOiJkaWQ6MzpiYWdjcWNlcmFza3hxeng0N2l2b2tqcW9md295dXliMjN0aWFlcGRyYXpxNXJsem4yaHg3a215YWN6d29hP3ZlcnNpb24taWQ9MCNrV01YTU1xazVXc290UW0iLCJhbGciOiJFUzI1NksifQ.AXESIHhRlyKdyLsRUpRdpY4jSPfiee7e0GzCynNtDoeYWLUB.h7bHmTaBGza_QlFRI9LBfgB3Nw0m7hLzwMm4nLvcR3n9sHKRoCrY0soWnDbmuG7jfVgx4rYkjJohDuMNgbTpEQ'
    expect(await did.verifyJWS(jws)).toEqual({
      didResolutionResult: THREE_ID_RESOLVER_RESULT,
      kid: 'did:3:bagcqceraskxqzx47ivokjqofwoyuyb23tiaepdrazq5rlzn2hx7kmyaczwoa?version-id=0#kWMXMMqk5WsotQm',
    })
  })

  test('correctly verifies DagJWS', async () => {
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
    const recipient = 'did:test:asdf'
    const secretKey = randomBytes(32)
    const registry = createRegistry({ [recipient]: secretKey })
    const did = new DID({ resolver: registry })
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
    const did = new DID({ resolver: registry })
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
    ;(did as any)._id = 'did:3:1234'

    const jwe = { foo: 'bar' } as unknown as JWE
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

describe('`decryptDagJWE` method', () => {
  test('throws an error if there is no provider', async () => {
    const did = new DID()
    await expect(did.createJWS({})).rejects.toThrow('No provider available')
  })

  test('uses the provider attached to the instance', async () => {
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
    ;(did as any)._id = 'did:3:1234'

    const jwe = { foo: 'bar' } as unknown as JWE
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
