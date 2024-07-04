/**
 * Manages user account DIDs in web based environments.
 *
 * ## Purpose
 *
 * Manages, creates and authorizes a DID session key for a user. Returns an authenticated DIDs instance
 * to be used in other Ceramic libraries. Supports did:pkh for blockchain accounts with Sign-In with
 * Ethereum and CACAO for authorization.
 *
 * ## Installation
 *
 * ```sh
 * npm install did-session
 * ```
 *
 * ## Usage
 *
 * Authorize and use DIDs where needed. Import the AuthMethod you need, Ethereum accounts used here for example.
 *
 * ```js
 * import { DIDSession } from 'did-session'
 * import { EthereumWebAuth, getAccountId } from '@didtools/pkh-ethereum'
 *
 * const ethProvider = // import/get your web3 eth provider
 * const addresses = await ethProvider.request({ method: 'eth_requestAccounts' })
 * const accountId = await getAccountId(ethProvider, addresses[0])
 * const authMethod = await EthereumWebAuth.getAuthMethod(ethprovider, accountId)
 *
 * const session = await DIDSession.get(accountId, authMethod, { resources: [...]})
 *
 * // Uses DIDs in ceramic & glaze libraries, ie
 * const ceramic = new CeramicClient()
 * ceramic.did = session.did
 *
 * // pass ceramic instance where needed
 *
 * ```
 *
 * Additional helper functions are available to help you manage a session lifecycle and the user experience.
 *
 * ```js
 * // Check if authorized or created from existing session string
 * didsession.hasSession
 *
 * // Check if session expired
 * didsession.isExpired
 *
 * // Get resources session is authorized for
 * didsession.authorizations
 *
 * // Check number of seconds till expiration, may want to re auth user at a time before expiration
 * didsession.expiresInSecs
 * ```
 *
 * ## Configuration
 *
 * The resources your app needs to write access to must be passed during authorization. Resources are an array
 * of Model Stream Ids or Streams Ids. Typically you will just pass resources from `@composedb` libraries as
 * you will already manage your Composites and Models there. For example:
 *
 * ```js
 * import { ComposeClient } from '@composedb/client'
 *
 * //... Reference above and `@composedb` docs for additional configuration here
 *
 * const client = new ComposeClient({ceramic, definition})
 * const resources = client.resources
 * const session = await DIDSession.get(accountId, authMethod, { resources })
 * client.setDID(session.did)
 * ```
 *
 * By default a session will expire in 1 week. You can change this time by passing the `expiresInSecs` option to
 * indicate how many seconds from the current time you want this session to expire.
 *
 * ```js
 * const oneDay = 60 * 60 * 24
 * const session = await DIDSession.get(accountId, authMethod, { resources: [...], expiresInSecs: oneDay })
 * ```
 *
 * A domain/app name is used when making requests, by default in a browser based environment the library will use
 * the domain name of your app. If you are using the library in a non web based environment you will need to pass
 * the `domain` option otherwise an error will thrown.
 *
 * ```js
 * const session = await DIDSession.get(accountId, authMethod, { resources: [...], domain: 'YourAppName' })
 * ```
 *
 * ## Upgrading from `@glazed/did-session` to `did-session`
 *
 * `authorize` changes to a static method which returns a did-session instance and `getDID()` becomes a `did` getter. For example:
 *
 * ```js
 * // Before @glazed/did-session
 * const session = new DIDSession({ authProvider })
 * const did = await session.authorize()
 *
 * // Now did-session
 * const session = await DIDSession.get(accountId, authMethod, { resources: [...]})
 * const did = session.did
 * ```
 *
 * ## Upgrading from `did-session@0.x.x` to `did-session@1.x.x`
 *
 * AuthProviders change to AuthMethod interfaces. Similarly you can import the auth libraries you need. How you configure and manage
 * these AuthMethods may differ, but each will return an AuthMethod function to be used with did-session.
 *
 * ```js
 * // Before with v0.x.x
 * ...
 * import { EthereumAuthProvider } from '@ceramicnetwork/blockchain-utils-linking'
 *
 * const ethProvider = // import/get your web3 eth provider
 * const addresses = await ethProvider.request({ method: 'eth_requestAccounts' })
 * const authProvider = new EthereumAuthProvider(ethProvider, addresses[0])
 * const session = new DIDSession({ authProvider })
 * const did = await session.authorize()
 *
 * // Now did-session@1.0.0
 * ...
 * import { EthereumWebAuth, getAccountId } from '@didtools/pkh-ethereum'
 *
 * const ethProvider = // import/get your web3 eth provider
 * const addresses = await ethProvider.request({ method: 'eth_requestAccounts' })
 * const accountId = await getAccountId(ethProvider, addresses[0])
 * const authMethod = await EthereumWebAuth.getAuthMethod(ethProvider, accountId)
 * const session = await DIDSession.get(accountId, authMethod, { resources: [...]})
 * const did = session.did
 * ```
 *
 * @module did-session
 */

import { Ed25519Provider } from 'key-did-provider-ed25519'
import { WebcryptoProvider, generateP256KeyPair } from '@didtools/key-webcrypto'
import KeyDidResolver from 'key-did-resolver'
import { randomBytes } from '@stablelib/random'
import { DID } from 'dids'
import { AccountId } from 'caip'
import type { Cacao, AuthMethod, AuthMethodOpts } from '@didtools/cacao'
import * as u8a from 'uint8arrays'
import { SessionStore } from './sessionStore.js'

export type SessionParams = {
  keySeed?: Uint8Array
  cacao: Cacao
  did: DID
}

type SessionObj = {
  sessionKeySeed: string
  cacao: Cacao
}

interface AuthOpts {
  domain?: string
  statement?: string
  version?: string
  nonce?: string
  requestId?: string
  expirationTime?: string
  resources?: Array<string>
  expiresInSecs?: number
}

export async function createDIDKey(seed?: Uint8Array): Promise<DID> {
  const didProvider = new Ed25519Provider(seed || randomBytes(32))
  const didKey = new DID({
    provider: didProvider,
    resolver: KeyDidResolver.getResolver(),
  })
  await didKey.authenticate()
  return didKey
}

export async function createDIDCacao(didKey: DID, cacao: Cacao): Promise<DID> {
  const didWithCap = didKey.withCapability(cacao)
  await didWithCap.authenticate()
  return didWithCap
}

export function getAccountIdByDID(did: string): AccountId {
  return new AccountId(did.slice(8))
}

function JSONToBase64url(object: Record<string, any>): string {
  return u8a.toString(u8a.fromString(JSON.stringify(object)), 'base64url')
}

function base64urlToJSON(s: string): Record<string, any> {
  return JSON.parse(u8a.toString(u8a.fromString(s, 'base64url'))) as Record<string, any>
}

function bytesToBase64(b: Uint8Array): string {
  return u8a.toString(b, 'base64pad')
}

function base64ToBytes(s: string): Uint8Array {
  return u8a.fromString(s, 'base64pad')
}

export function cacaoContainsResources(cacao: Cacao, resources: Array<string>): boolean {
  return resources.every((res) => cacao.p.resources?.includes(res))
}

function isExpired(expTime?: string): boolean {
  if (!expTime) return false
  return Date.parse(expTime) < Date.now()
}

/**
 * DID Session
 *
 * ```sh
 * import { DIDSession } from 'did-session'
 * ```
 */
export class DIDSession {
  #did: DID
  #keySeed: Uint8Array | undefined
  #cacao: Cacao

  constructor(params: SessionParams) {
    this.#keySeed = params.keySeed
    this.#cacao = params.cacao
    this.#did = params.did // Remove did init param if/when async didKey authorize is removed
  }

  /**
   * Request authorization for session
   */
  static async authorize(authMethod: AuthMethod, authOpts: AuthOpts = {}): Promise<DIDSession> {
    if (!authOpts.resources || authOpts.resources.length === 0)
      throw new Error('Required: resource argument option when authorizing')

    const authMethodOpts: AuthMethodOpts = authOpts
    const keySeed = randomBytes(32)
    const didKey = await createDIDKey(keySeed)
    authMethodOpts.uri = didKey.id

    if (authOpts.expiresInSecs) {
      const exp = new Date(Date.now() + authOpts.expiresInSecs * 1000)
      authMethodOpts.expirationTime = exp.toISOString()
    }

    const cacao = await authMethod(authOpts)
    const did = await createDIDCacao(didKey, cacao)
    return new DIDSession({ cacao, keySeed, did })
  }

  static async initDID(didKey: DID, cacao: Cacao): Promise<DID> {
    const didWithCap = didKey.withCapability(cacao)
    await didWithCap.authenticate()
    return didWithCap
  }

  /**
   * Get a session for the given accountId, if one exists, otherwise creates a new one.
   */
  static async get(
    account: AccountId,
    authMethod: AuthMethod,
    authOpts: AuthOpts = {},
  ): Promise<DIDSession> {
    if (!authOpts.resources || authOpts.resources.length === 0)
      throw new Error('Required: resource argument option when authorizing')
    const store = await SessionStore.create()
    const result = (await store.get(account)) || {}
    let { cacao, keypair } = result as { cacao: Cacao; keypair: CryptoKeyPair }
    if (
      cacao &&
      keypair &&
      cacaoContainsResources(cacao, authOpts.resources) &&
      !isExpired(cacao.p.exp)
    ) {
      const provider = new WebcryptoProvider(keypair)
      const did = new DID({ provider, resolver: KeyDidResolver.getResolver(), capability: cacao })
      await did.authenticate()
      const session = new DIDSession({ cacao, did })
      return session
    }
    // create a new DID instance using the WebcryptoProvider
    keypair = await generateP256KeyPair()
    const provider = new WebcryptoProvider(keypair)
    const didKey = new DID({ provider, resolver: KeyDidResolver.getResolver() })
    await didKey.authenticate()
    const authMethodOpts: AuthMethodOpts = authOpts
    authMethodOpts.uri = didKey.id
    if (authOpts.expiresInSecs) {
      const exp = new Date(Date.now() + authOpts.expiresInSecs * 1000)
      authMethodOpts.expirationTime = exp.toISOString()
    }

    cacao = await authMethod(authMethodOpts)
    const did = await createDIDCacao(didKey, cacao)
    await store.set(account, { cacao, keypair })
    store.close()
    return new DIDSession({ cacao, did })
  }

  /**
   * Removes a session from storage for a given account (if created using `DIDSession.get`)
   */
  static async remove(account: AccountId): Promise<void> {
    const store = await SessionStore.create()
    await store.remove(account)
    store.close()
  }

  /**
   * Check if there is an active session for a given account.
   */
  static async hasSessionFor(account: AccountId, resources: Array<string>): Promise<boolean> {
    const store = await SessionStore.create()
    const { cacao } = (await store.get(account)) || ({} as { cacao: Cacao })
    store.close()
    return cacao && cacaoContainsResources(cacao, resources) && !isExpired(cacao.p.exp)
  }

  /**
   * Get DID instance, if authorized
   */
  get did(): DID {
    return this.#did
  }

  /**
   * Serialize session into string, can store and initalize the same session again while valid
   */
  serialize(): string {
    if (!this.#keySeed) throw new Error('Secure sessions cannot be serialized')
    const session = {
      sessionKeySeed: bytesToBase64(this.#keySeed),
      cacao: this.#cacao,
    }
    return JSONToBase64url(session)
  }

  /**
   * Initialize a session from a serialized session string
   */
  static async fromSession(session: string): Promise<DIDSession> {
    const { sessionKeySeed, cacao } = base64urlToJSON(session) as SessionObj
    const keySeed = base64ToBytes(sessionKeySeed)
    const didKey = await createDIDKey(keySeed)
    const did = await DIDSession.initDID(didKey, cacao)
    return new DIDSession({ cacao, keySeed, did })
  }

  get hasSession(): boolean {
    return !!this.#cacao && !!this.#did
  }

  /**
   * Determine if a session is expired or not
   */
  get isExpired(): boolean {
    return isExpired(this.#cacao.p.exp)
  }

  /**
   * Number of seconds until a session expires
   */
  get expireInSecs(): number {
    const expTime = this.#cacao.p.exp
    if (!expTime) throw new Error('Session does not expire') // Removed in future
    const timeDiff = Date.parse(expTime) - Date.now()
    return timeDiff < 0 ? 0 : timeDiff / 1000
  }

  /**
   * Get the list of resources a session is authorized for
   */
  get authorizations(): Array<string> {
    return this.#cacao?.p.resources ?? []
  }

  /**
   * Get the session CACAO
   */
  get cacao(): Cacao {
    return this.#cacao
  }

  /**
   * Determine if session is available and optionally if authorized for given resources
   */
  isAuthorized(resources?: Array<string>): boolean {
    if (!this.hasSession || this.isExpired) return false
    if (!resources) return true
    return resources.every((val) => this.authorizations.includes(val))
  }

  /** DID string associated to the session instance. session.id == session.getDID().parent */
  get id(): string {
    return this.#did.parent
  }
}
