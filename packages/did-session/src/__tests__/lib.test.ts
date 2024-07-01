/**
 * @jest-environment ceramic
 */
import type { CeramicApi } from '@ceramicnetwork/common'
import { TileDocument } from '@ceramicnetwork/stream-tile'
import { Wallet } from '@ethersproject/wallet'
import { fromString, toString } from 'uint8arrays'
import { DIDSession, createDIDKey, createDIDCacao } from '../index.js'
import { jest } from '@jest/globals'
import { SiweMessage, Cacao, AuthMethod } from '@didtools/cacao'
import { Model, ModelDefinition } from '@ceramicnetwork/stream-model'
import { ModelInstanceDocument } from '@ceramicnetwork/stream-model-instance'
import { SolanaNodeAuth, getAccountIdByNetwork } from '@didtools/pkh-solana'
import { AccountId } from 'caip'
import { ed25519 } from '@noble/curves/ed25519'
import { Ed25519Provider } from 'key-did-provider-ed25519'
import { DID } from 'dids'
import { getResolver } from 'key-did-resolver'
import { createEthereumAuthMethod } from './create-ethereum-auth-method.js'

const getModelDef = (name: string): ModelDefinition => ({
  version: '1.0',
  name: name,
  accountRelation: { type: 'list' },
  schema: {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    type: 'object',
    additionalProperties: false,
    properties: {
      myData: {
        type: 'integer',
        maximum: 10000,
        minimum: 0,
      },
    },
    required: ['myData'],
  },
})

const CONTENT0 = { myData: 0 }
const CONTENT1 = { myData: 1 }

const MODEL_DEFINITION = getModelDef('MyModel')

const bytes32 = [
  64, 168, 135, 95, 204, 113, 52, 90, 66, 192, 219, 241, 34, 128, 184, 176, 36, 249, 191, 223, 108,
  240, 6, 119, 226, 7, 81, 210, 31, 128, 182, 139,
]

const testResources = [
  '`ceramic://*?model=k2t6wyfsu4pfz0fnidk6tz3gak7tr8n5w34ah1c31w5vq98b62hir1pnn3j2ty',
  '`ceramic://*?model=k2t6wyfsu4pgz0ftx664veuaf2qib95zj8je2x7pf89v6g5p7xa7n9eo45g64a',
]

declare global {
  const ceramic: CeramicApi
}

describe('did-session', () => {
  let authMethod: AuthMethod
  let account: AccountId
  jest.setTimeout(20000)
  let model: Model

  beforeAll(async () => {
    const seed = new Uint8Array(32)
    const did = new DID({
      resolver: getResolver(),
      provider: new Ed25519Provider(seed),
    })
    ceramic.did = did
    const authResult = await createEthereumAuthMethod()
    authMethod = authResult.authMethod
    account = authResult.account
    model = await Model.create(ceramic, MODEL_DEFINITION)
  })

  const wallet = Wallet.fromMnemonic(
    'despair voyage estate pizza main slice acquire mesh polar short desk lyrics',
  )
  const address = wallet.address

  describe('DIDSession.get', () => {
    afterEach(async () => {
      // make sure each test starts with a clean slate
      await DIDSession.remove(account)
    })

    test('get and create/update streams from persisted session', async () => {
      const authMock = jest.fn(authMethod)
      const resources = [`ceramic://*`]
      expect(await DIDSession.hasSessionFor(account, resources)).toBeFalsy()

      await DIDSession.get(account, authMock, {
        resources,
      })
      // auth was used
      expect(authMock).toHaveBeenCalledTimes(1)
      expect(await DIDSession.hasSessionFor(account, resources)).toBeTruthy()

      const session = await DIDSession.get(account, authMethod, {
        resources,
      })
      // indicates that we loaded auth from session storage
      expect(authMock).toHaveBeenCalledTimes(1)

      ceramic.did = session.did
      const doc = await TileDocument.create(
        ceramic,
        { foo: 'bar' },
        {},
        {
          anchor: false,
          publish: false,
        },
      )
      expect(doc.content).toEqual({ foo: 'bar' })

      await doc.update({ foo: 'boo' })
      expect(doc.content).toEqual({ foo: 'boo' })
    })

    test('Properly removes persisted sessions', async () => {
      await DIDSession.get(account, authMethod, {
        resources: testResources,
      })

      expect(await DIDSession.hasSessionFor(account, testResources)).toBeTruthy()

      await DIDSession.remove(account)

      expect(await DIDSession.hasSessionFor(account, testResources)).toBeFalsy()
    })

    test('isAuthorized/isExpired, with valid session and resources', async () => {
      const session = await DIDSession.get(account, authMethod, {
        resources: testResources,
      })
      // Any session authorized and valid, true
      expect(session.isAuthorized()).toBe(true)
      expect(session.isExpired).toBe(false)
      // Authorized for given resources, true
      expect(session.isAuthorized(testResources)).toBe(true)
      // Authorized for wildcard resource, false
      expect(session.isAuthorized([`ceramic://*`])).toBe(false)
    })

    test('Creates a new session if persisted one is expired', async () => {
      let session = await DIDSession.get(account, authMethod, {
        resources: testResources,
        expiresInSecs: -1,
      })

      expect(session.isExpired).toBeTruthy()
      expect(await DIDSession.hasSessionFor(account, testResources)).toBeFalsy()

      session = await DIDSession.get(account, authMethod, {
        resources: testResources,
      })

      expect(session.isExpired).toBeFalsy()
      expect(await DIDSession.hasSessionFor(account, testResources)).toBeTruthy()
    })

    test('pass expiresInSecs option for custom time, override default 1 day', async () => {
      const oneWeek = 60 * 60 * 24 * 7
      const session = await DIDSession.get(account, authMethod, {
        resources: testResources,
        expiresInSecs: oneWeek,
      })
      expect(session.expireInSecs > oneWeek - 5 && session.expireInSecs <= oneWeek).toBe(true)
    })

    test('throws if resources not given', async () => {
      await expect(DIDSession.get(account, authMethod, {})).rejects.toThrow(/Required:/)
      await expect(DIDSession.get(account, authMethod, { resources: [] })).rejects.toThrow(
        /Required:/,
      )
    })
  })

  describe('DIDSession.authorize', () => {
    test('authorize, with streamid resources', async () => {
      const streamId = `ceramic://z6MkhZCWzHtPFmpNupVPuHA6svtpKKY9RUpgf9uohnhFMNvj`
      const session = await DIDSession.authorize(authMethod, {
        resources: [streamId],
      })
      const did = session.did
      expect(did.capability.p.resources!.includes(streamId)).toBe(true)
    })

    test('authorize and create/update streams', async () => {
      const session = await DIDSession.authorize(authMethod, {
        resources: [`ceramic://*`],
      })
      ceramic.did = session.did
      const doc = await TileDocument.create(
        ceramic,
        { foo: 'bar' },
        {},
        {
          anchor: false,
          publish: false,
        },
      )
      expect(doc.content).toEqual({ foo: 'bar' })

      await doc.update({ foo: 'boo' })
      expect(doc.content).toEqual({ foo: 'boo' })
    })

    test('authorize and create/update streams from serialized session', async () => {
      const session = await DIDSession.authorize(authMethod, {
        resources: [`ceramic://*`],
      })
      const sessionStr = session.serialize()
      const session2 = await DIDSession.fromSession(sessionStr)
      ceramic.did = session2.did
      const doc = await TileDocument.create(
        ceramic,
        { foo: 'bar' },
        {},
        {
          anchor: false,
          publish: false,
        },
      )
      expect(doc.content).toEqual({ foo: 'bar' })

      await doc.update({ foo: 'boo' })
      expect(doc.content).toEqual({ foo: 'boo' })
    })

    test('can create and update model instance stream', async () => {
      const session = await DIDSession.authorize(authMethod, {
        resources: [`ceramic://*?model=${model.id.toString()}`],
      })
      ceramic.did = session.did

      const doc = await ModelInstanceDocument.create(ceramic, CONTENT0, {
        model: model.id,
      })

      expect(doc.content).toEqual(CONTENT0)
      expect(doc.metadata.model.toString()).toEqual(model.id.toString())

      await doc.replace(CONTENT1)
      expect(doc.content).toEqual(CONTENT1)
    })

    test('pass expiresInSecs option for custom time, override default 1 day', async () => {
      const oneWeek = 60 * 60 * 24 * 7
      const session = await DIDSession.authorize(authMethod, {
        resources: testResources,
        expiresInSecs: oneWeek,
      })
      expect(session.expireInSecs > oneWeek - 5 && session.expireInSecs <= oneWeek).toBe(true)
    })

    test('throws if resources not given', async () => {
      await expect(DIDSession.authorize(authMethod, {})).rejects.toThrow(/Required:/)
      await expect(DIDSession.authorize(authMethod, { resources: [] })).rejects.toThrow(/Required:/)
    })

    describe('Manage session state', () => {
      test('serializes', async () => {
        const msg = new SiweMessage({
          domain: 'service.org',
          address: address,
          statement: 'I accept the ServiceOrg Terms of Service: https://service.org/tos',
          uri: 'did:key:z6MkrBdNdwUPnXDVD1DCxedzVVBpaGi8aSmoXFAeKNgtAer8',
          version: '1',
          nonce: '32891757',
          issuedAt: '2021-09-30T16:25:24.000Z',
          chainId: '1',
          resources: testResources,
        })

        const signature = await wallet.signMessage(msg.toMessage())
        msg.signature = signature
        const cacao = Cacao.fromSiweMessage(msg)

        const keySeed = new Uint8Array(bytes32)
        const didKey = await createDIDKey(keySeed)
        const did = await createDIDCacao(didKey, cacao)

        const session = new DIDSession({ cacao, keySeed, did })
        const sessionStr = session.serialize()
        expect(sessionStr).toMatchSnapshot()
      })

      test('roundtrip serialization, fromSession', async () => {
        const session = await DIDSession.authorize(authMethod, {
          resources: [`ceramic://*`],
        })
        const sessionStr = session.serialize()
        const session2 = await DIDSession.fromSession(sessionStr)
        const sessionStr2 = session2.serialize()
        expect(sessionStr).toEqual(sessionStr2)
      })
    })
  })

  describe('Expiration properties', () => {
    test('isAuthorized/isExpired, with expired session', async () => {
      // Expired 5 min ago
      const msg = new SiweMessage({
        domain: 'service.org',
        address: address,
        statement: 'I accept the ServiceOrg Terms of Service: https://service.org/tos',
        uri: 'did:key:z6MkrBdNdwUPnXDVD1DCxedzVVBpaGi8aSmoXFAeKNgtAer8',
        version: '1',
        nonce: '32891757',
        issuedAt: '2021-09-30T16:25:24.000Z',
        expirationTime: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        chainId: '1',
        resources: testResources,
      })

      const signature = await wallet.signMessage(msg.toMessage())
      msg.signature = signature
      const cacao = Cacao.fromSiweMessage(msg)

      const keySeed = new Uint8Array(bytes32)
      const didKey = await createDIDKey(keySeed)
      const did = await createDIDCacao(didKey, cacao)

      const session = new DIDSession({ cacao, keySeed, did })
      expect(session.isExpired).toBe(true)
      expect(session.isAuthorized()).toBe(false)
    })

    test('expiresInSecs, when session valid', async () => {
      // Expires in 5 mins
      const msg = new SiweMessage({
        domain: 'service.org',
        address: address,
        statement: 'I accept the ServiceOrg Terms of Service: https://service.org/tos',
        uri: 'did:key:z6MkrBdNdwUPnXDVD1DCxedzVVBpaGi8aSmoXFAeKNgtAer8',
        version: '1',
        nonce: '32891757',
        issuedAt: '2021-09-30T16:25:24.000Z',
        expirationTime: new Date(Date.now() + 1000 * 60 * 5).toISOString(),
        chainId: '1',
        resources: testResources,
      })

      const signature = await wallet.signMessage(msg.toMessage())
      msg.signature = signature
      const cacao = Cacao.fromSiweMessage(msg)

      const keySeed = new Uint8Array(bytes32)
      const didKey = await createDIDKey(keySeed)
      const did = await createDIDCacao(didKey, cacao)

      const session = new DIDSession({ cacao, keySeed, did })

      // 5 sec buffer
      expect(session.expireInSecs).toBeGreaterThan(60 * 5 - 5)
      expect(session.expireInSecs).toBeLessThan(60 * 5 + 5)
    })

    test('expiresInSecs, when session expired', async () => {
      // Expired 5 min ago
      const msg = new SiweMessage({
        domain: 'service.org',
        address: address,
        statement: 'I accept the ServiceOrg Terms of Service: https://service.org/tos',
        uri: 'did:key:z6MkrBdNdwUPnXDVD1DCxedzVVBpaGi8aSmoXFAeKNgtAer8',
        version: '1',
        nonce: '32891757',
        issuedAt: '2021-09-30T16:25:24.000Z',
        expirationTime: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        chainId: '1',
        resources: testResources,
      })

      const signature = await wallet.signMessage(msg.toMessage())
      msg.signature = signature
      const cacao = Cacao.fromSiweMessage(msg)

      const keySeed = new Uint8Array(bytes32)
      const didKey = await createDIDKey(keySeed)
      const did = await createDIDCacao(didKey, cacao)

      const session = new DIDSession({ cacao, keySeed, did })

      expect(session.expireInSecs).toEqual(0)
    })
  })
})

const solanaSecretKey = fromString(
  '92e08e39aee87d53fe263913bf9df6615c1c909860a1d3ad57bd0e6e2e507161ecbf1e2d9da80d3ae09de54ce71cbff723e291e7a4b133ce10993be5edfaca50',
  'hex',
)

function createSolanaAuthMethod(key?: Uint8Array): Promise<AuthMethod> {
  const walletKey = key ?? solanaSecretKey
  const address = toString(ed25519.getPublicKey(walletKey.subarray(0, 32)), 'base58btc')

  const solProvider = {
    signMessage: (data: Uint8Array): Promise<{ signature: Uint8Array }> => {
      return Promise.resolve({ signature: ed25519.sign(data, walletKey.subarray(0, 32)) })
    },
  }

  const accountId = getAccountIdByNetwork('mainnet', address)

  return SolanaNodeAuth.getAuthMethod(solProvider, accountId, 'testapp')
}

describe('did-session Solana Authmethod', () => {
  let authMethod: AuthMethod
  jest.setTimeout(20000)
  let model: Model

  beforeAll(async () => {
    const seed = new Uint8Array(32)
    const did = new DID({
      resolver: getResolver(),
      provider: new Ed25519Provider(seed),
    })
    ceramic.did = did
    authMethod = await createSolanaAuthMethod()
    model = await Model.create(ceramic, MODEL_DEFINITION)
  })

  test('authorize, with streamid resources', async () => {
    const streamId = `ceramic://z6MkhZCWzHtPFmpNupVPuHA6svtpKKY9RUpgf9uohnhFMNvj`
    const session = await DIDSession.authorize(authMethod, {
      resources: [streamId],
    })
    const did = session.did
    expect(did.capability.p.resources!.includes(streamId)).toBe(true)
  })

  test('authorize and create/update streams', async () => {
    const session = await DIDSession.authorize(authMethod, {
      resources: [`ceramic://*`],
    })
    ceramic.did = session.did
    const doc = await TileDocument.create(
      ceramic,
      { foo: 'bar' },
      {},
      {
        anchor: false,
        publish: false,
      },
    )
    expect(doc.content).toEqual({ foo: 'bar' })

    await doc.update({ foo: 'boo' })
    expect(doc.content).toEqual({ foo: 'boo' })
  })

  test('authorize and create/update streams from serialized session', async () => {
    const session = await DIDSession.authorize(authMethod, {
      resources: [`ceramic://*`],
    })
    const sessionStr = session.serialize()
    const session2 = await DIDSession.fromSession(sessionStr)
    ceramic.did = session2.did
    const doc = await TileDocument.create(
      ceramic,
      { foo: 'bar' },
      {},
      {
        anchor: false,
        publish: false,
      },
    )
    expect(doc.content).toEqual({ foo: 'bar' })

    await doc.update({ foo: 'boo' })
    expect(doc.content).toEqual({ foo: 'boo' })
  })

  test('can create and update model instance stream', async () => {
    const session = await DIDSession.authorize(authMethod, {
      resources: [`ceramic://*?model=${model.id.toString()}`],
    })
    ceramic.did = session.did

    const doc = await ModelInstanceDocument.create(ceramic, CONTENT0, {
      model: model.id,
    })

    expect(doc.content).toEqual(CONTENT0)
    expect(doc.metadata.model.toString()).toEqual(model.id.toString())

    await doc.replace(CONTENT1)
    expect(doc.content).toEqual(CONTENT1)
  })
})
