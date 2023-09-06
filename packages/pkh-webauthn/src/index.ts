import * as dagCbor from '@ipld/dag-cbor'
import * as Block from 'multiformats/block'
import { sha256 as hasher } from 'multiformats/hashes/sha2' // Hashing workaround
import {
  populateCreateOpts,
  selectPublicKey,
  storePublicKey,
  getAuthenticatorData,
  decodeAuthenticatorData,
  authenticatorSign,
  verify
} from './utils'
import type { SimpleCreateCredentialOpts } from './utils'
import { encodeDIDFromPub } from '@didtools/key-webcrypto'
import {
  AuthMethod,
  AuthMethodOpts,
  Cacao,
  CacaoBlock,
  VerifyOptions
} from '@didtools/cacao'
import varint from 'varint'
import * as u8a from 'uint8arrays'

class LocalStorageKeySelector implements WebauthnAuth.KeySelector {
  seen (_: string, pk: Uint8Array) { storePublicKey(pk) }

  select (_: string, pk0: Uint8Array, pk1: Uint8Array): Uint8Array|null {
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
      digest (bytes: any) { // monkeypatch Buffer to Uint8Array conversion
        if (!(bytes instanceof Uint8Array) && bytes?.buffer) bytes = new Uint8Array(bytes.buffer, bytes.byteOffset, bytes.byteLength)
          return hasher.digest(bytes)
      }
    }
  })
}

export namespace WebauthnAuth {
  export type AdditionalAuthenticatorData = {
    authData: string,
    clientDataJSON: string
  }

  export interface CreateCredentialResult {
    publicKey: Uint8Array,
    credential: PublicKeyCredential,
    did: string
  }
  export interface KeySelector {
    seen: (credentialId: string, pk: Uint8Array) => void
    select: (credentialId: string, pk0: Uint8Array, pk1: Uint8Array) => Uint8Array|null
  }
  export interface AuthenticatorSession {
    credentialId?: string // Set if PasskeyProvider was initialized in non-discoverable mode
    publicKey?: Uint8Array // source for did
    selectors: KeySelector[]
  }

  export function createSession (publicKey?: Uint8Array): AuthenticatorSession {
    return {
      publicKey,
      selectors: [new LocalStorageKeySelector()]
    }
  }

  // auth-method.ts
  export async function createCredential (session: AuthenticatorSession, opts: SimpleCreateCredentialOpts): Promise<CreateCredentialResult> {
    const credentials = globalThis.navigator.credentials
    const credential = await credentials.create(populateCreateOpts(opts)) as any
    if (!credential) throw new Error('Empty Credential Response')

    const authenticatorData = getAuthenticatorData(credential.response)
    const { publicKey } = decodeAuthenticatorData(authenticatorData)
    for (const selector of session.selectors) selector.seen(credential.id, publicKey)

    return {
      publicKey,
      did: encodeDIDFromPub(publicKey),
      credential
    }
  }

  export async function getAuthMethod (session: AuthenticatorSession): Promise<AuthMethod> {
    return async (opts: AuthMethodOpts): Promise<Cacao> => {
      return createCacao(opts, session)
    }
  }

  async function createCacao (opts: AuthMethodOpts, session: AuthenticatorSession) {
    const now = Date.now()
    // The public key is not known at pre-sign time.
    // so we sign a "challenge"-block without Issuer attribute
    const challenge: Cacao = Object.freeze({
      h: {
        t: 'caip122'
      },
      p: {
        domain: globalThis.location.hostname,
        aud: '' + globalThis.location,
        iss: '',
        version: 1,
        nonce: globalThis.crypto.randomUUID(),
        resources: [],
        exp: new Date(now + 7 * 86400000).toISOString(), // 1 week
        nbf: new Date(now).toISOString(),
        iat: new Date(now).toISOString(),
        ...opts
      }
    })

    const block = await blockFromCacao(challenge) // await CacaoBlock.fromCacao(challenge) when issue resolved
    // perform sign
    const { credential, recovered } = await authenticatorSign(block.cid.bytes)

    // @ts-ignore - credential.response does exist.
    const { response } = credential
    const { clientDataJSON, signature } = response
    const authenticatorData = getAuthenticatorData(response)
    const aad: AdditionalAuthenticatorData = {
      authData: u8a.toString(authenticatorData, 'base64url'),
      clientDataJSON:  u8a.toString(clientDataJSON, 'base64url')
    }

    let pk
    for (const selector of session.selectors) {
      if (pk = await selector.select(credential.id, ...recovered)) break
    }
    if (!pk) throw new Error('PublicKeySelectionFailed')

    // Insert iss + aad after signature
    return {
      ...challenge,
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
    const aad = cacao.s.aad as AdditionalAuthenticatorData
    const authData = u8a.fromString(aad.authData, 'base64url')
    const clientDataJSON = u8a.fromString(aad.clientDataJSON, 'base64url')

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

    const challenge = { ...cacao, p: { ...cacao.p, iss: '' } }
    delete challenge.s
    const block = await blockFromCacao(challenge) // await CacaoBlock.fromCacao(challenge)
    if (u8a.compare(expectedHash, block.cid.bytes) !== 0) throw new Error('MessageMismatch')
  }
}
