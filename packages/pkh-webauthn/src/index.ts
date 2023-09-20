import * as dagCbor from '@ipld/dag-cbor'
import * as Block from 'multiformats/block'
import { sha256 as hasher } from 'multiformats/hashes/sha2' // Hashing workaround
import {
  selectPublicKey,
  storePublicKey,
  getAuthenticatorData,
  decodeAuthenticatorData,
  authenticatorSign,
  verify,
  assertU8,
  randomBytes
} from './utils'
import { encodeDIDFromPub } from '@didtools/key-webcrypto'
import {
  AuthMethod,
  AuthMethodOpts,
  Cacao,
  CacaoBlock,
  Payload,
  VerifyOptions
} from '@didtools/cacao'
import varint from 'varint'
import * as u8a from 'uint8arrays'
import { encode, decode } from 'cborg'

class LocalStorageKeySelector implements WebauthnAuth.KeySelector {
  async seen (_: string, pk: Uint8Array) { storePublicKey(pk) }

  async select (_: string, pk0: Uint8Array, pk1: Uint8Array) {
    return selectPublicKey(pk0, pk1)
  }
}

// Workaround for CacaoBlock.fromCacao(): https://github.com/multiformats/js-multiformats/issues/259
const blockFromCacao = (cacao: Cacao): Promise<CacaoBlock> => {
  return Block.encode<Cacao, number, number>({
    value: cacao,
    codec: dagCbor,
    hasher: {
      ...hasher,
      // monkeypatch Buffer to Uint8Array conversion
      digest: (bytes: any) => hasher.digest(assertU8(bytes))
    }
  })
}


// auth-method.ts

/**
 * A simple approach to create a discoverable
 * credential with sane defaults.
 * @param {string} name username|email|user-alias
 * @param {string} displayName Human friendly identifier of credential, shown in OS-popups.
 * @param {string} rpname (RelayingPartyName) name of the app.
 * @returns {CredentialCreationOptions} An options object that can be passed to credentials.create(opts)
 */
export function simpleCreateOpts (
  name: string = 'pkh-webauthn',
  displayName: string =  'Ceramic Auth Provider',
  rpname: string = globalThis.location.hostname
): CredentialCreationOptions {
  return {
    publicKey: {
      challenge: randomBytes(32), // Otherwise issued by server
      rp: {
        id: globalThis.location.hostname, // Must be set to current hostname
        name: rpname // A known constant.
      },
      user: {
        id: randomBytes(32), // Server issued arbitrary bytes
        name,
        displayName
      },
      pubKeyCredParams: [
        { type: 'public-key', alg: -7 }, // ECDSA (secp256r1) with SHA-256
      ],
      authenticatorSelection: {
        requireResidentKey: true, // Deprecated (superseded by `residentKey`), some webauthn v1 impl still use it.
        residentKey: 'required', // Require private key to be created on authenticator/ secure storage
        userVerification: 'required', // Require user to push button/input pin sign requests
      }
    }
  }
}

export async function createCredential (session: WebauthnAuth.AuthenticatorSession, opts: CredentialCreationOptions): Promise<WebauthnAuth.CreateCredentialResult> {
  const credentials = globalThis.navigator.credentials
  if (!opts) throw new Error('Expected options: CredentialCreationOptions')
  // https://developer.mozilla.org/en-US/docs/Web/API/CredentialsContainer/create
  const credential = await credentials.create(opts) as any
  if (!credential) throw new Error('Empty Credential Response')

  const authenticatorData = getAuthenticatorData(credential.response)
  const { publicKey } = decodeAuthenticatorData(authenticatorData)
  for (const selector of session.selectors) {
    if (typeof selector.seen === 'function') selector.seen(credential.id, publicKey)
  }

  return {
    publicKey,
    did: encodeDIDFromPub(publicKey),
    credential
  }
}

/**
 * Asks user to sign a random challenge
 * returns either pk0 or pk1 given correct credential is presented
 */
export async function probeAuthenticator(pk0: Uint8Array, pk1: Uint8Array) {
  const res = await authenticatorSign(randomBytes(32))
  for (const candidate of res.recovered) {
    if (!u8a.compare(candidate, pk0)) return pk0
    if (!u8a.compare(candidate, pk1)) return pk1
  }
  throw new Error('DifferentCredentialSelected')
}


export namespace WebauthnAuth {
  export async function createDID(lable: string): Promise<string> {
    const credentials = globalThis.navigator.credentials
    const credential = await credentials.create(simpleCreateOpts(lable, lable))
    if (!credential) throw new Error('Empty Credential Response')

    const authenticatorData = getAuthenticatorData(credential.response)
    const { publicKey } = decodeAuthenticatorData(authenticatorData)
    return encodeDIDFromPub(publicKey)

  }
  export interface CreateCredentialResult {
    publicKey: Uint8Array,
    credential: PublicKeyCredential,
    did: string
  }
  export interface KeySelector {
    seen?: (credentialId: string, pk: Uint8Array) => Promise<void>
    select: (credentialId: string, pk0: Uint8Array, pk1: Uint8Array) => Promise<Uint8Array|null>
  }
  export interface AuthenticatorSession {
    credentialId?: string // Set if PasskeyProvider was initialized in non-discoverable mode
    publicKey?: Uint8Array // source for did
    selectors: KeySelector[]
  }

  /**
   * Creates a new session that remembers seen credentials
   * @param {KeySelector?} selector An object implemeting the KeySelector interface.
   * @param {string?} credentialId Optionally specify which credential to use for all operations if known ahead of time.
   */
  export function createSession (selector?: KeySelector, credentialId?: string): AuthenticatorSession {
    const selectors: Array<KeySelector> = [new LocalStorageKeySelector()]
    if (selector) selectors.push(selector)
    return { credentialId, selectors }
  }

  export async function getAuthMethod (session: AuthenticatorSession): Promise<AuthMethod> {
    return async (opts: AuthMethodOpts): Promise<Cacao> => {
      return createCacao(opts, session)
    }
  }

  async function createCacao (opts: AuthMethodOpts, session: AuthenticatorSession): Promise<Cacao> {
    const now = new Date()
    // The public key is not known at pre-sign time.
    // so we sign a "challenge"-block without Issuer attribute
    const challenge: Cacao = {
      h: {
        t: 'caip122'
      },
      p: {
        domain: globalThis.location.hostname,
        aud: opts.uri || globalThis.location.toString(),
        version: '1',
        nonce: opts.nonce || u8a.toString(randomBytes(8), 'base64url'),
        resources: opts.resources,
        exp: opts.expirationTime || new Date(now.getTime() + 7 * 86400000).toISOString(), // 1 week
        nbf: opts.notBefore || now.toISOString(),
        iat: opts.issuedAt || now.toISOString()
      } as Payload // squelch missing p.iss
    }

    const block = await blockFromCacao(challenge) // await CacaoBlock.fromCacao(challenge) when issue resolved
    // perform sign
    const { credential, recovered } = await authenticatorSign(block.cid.bytes)

    // @ts-ignore - credential.response does exist.
    const { response } = credential
    const { clientDataJSON, signature } = response
    const authData = getAuthenticatorData(response)
    const aad = assertU8(encode({ authData, clientDataJSON }))

    let pk: any
    for (const selector of session.selectors) {
      if (typeof selector.select !== 'function') continue
      if (pk = await selector.select(credential.id, ...recovered)) break
    }
    if (!pk) throw new Error('PublicKeySelectionFailed')
    if (!recovered.find(c => !u8a.compare(c, pk))) throw new Error('UnrelatedPublickey')

    // Insert iss + aad after signature
    return {
      h: challenge.h,
      p: {
        ...challenge.p,
        iss: encodeDIDFromPub(pk),
      },
      s: {
        t: 'webauthn:p256',
        s: u8a.toString(signature, 'base64url'),
        aad
      }
    }
  }

  // verifier.ts
  export function getVerifier () {
    return { 'webauthn:p256': verifyCacao }
  }

  /**
   * 1. Recreates cacao-challenge and message hash
   * 2. Verifies Signature of clientDataJSON
   * 3. Unpacks clientDataJSON and assert embedded hash against message hash
   */
  async function verifyCacao (cacao: Cacao, _: VerifyOptions): Promise<void> {
    if (!cacao.s?.aad) throw new Error('AdditionalAuthenticatorData missing')
    const { authData, clientDataJSON } = decode(cacao.s.aad)

    if (!cacao.s.s) throw new Error('Signature missing')
    const signature = u8a.fromString(cacao.s.s, 'base64url')

    if (!cacao.p?.iss) throw new Error('Issuer missing')
    const bIss = u8a.fromString(cacao.p.iss.slice('did:key:z'.length), 'base58btc')
    if (varint.decode(bIss) !== 0x1200) throw new Error('expected PublicKey to belong to curve p256')
    const publicKey = bIss.slice(varint.decode.bytes)

    // Verify clientData authencity
    const valid = verify(signature, publicKey, authData, clientDataJSON)
    if (!valid) throw new Error('InvalidMessage')

    // Verify clientDataJSON.challenge equals message hash
    const clientData = JSON.parse(u8a.toString(clientDataJSON, 'utf8'))
    if (clientData.type !== 'webauthn.get') throw new Error('Invalid clientDataJSON.type')
    const expectedHash = u8a.fromString(clientData.challenge, 'base64url')

    const challenge = { ...cacao, p: { ...cacao.p } } // deep-clone
    delete challenge.s // remove signature
    // @ts-ignore
    delete challenge.p.iss // remove issuer
    const block = await blockFromCacao(challenge) // await CacaoBlock.fromCacao(challenge)

    // Compare reproduced challenge-hash to signed hash
    if (u8a.compare(expectedHash, block.cid.bytes) !== 0) throw new Error('MessageMismatch')
  }
}
