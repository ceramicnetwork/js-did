import * as u8a from 'uint8arrays'
import { verifyJWS, createJWE, x25519Encrypter } from 'did-jwt'
import { randomBytes } from '@stablelib/random'
import { KeyPair, generateKeyPairFromSeed, convertPublicKeyToX25519 } from '@stablelib/ed25519'
import type { GeneralJWS } from 'dids'

import { encodeDID, Ed25519Provider } from '../src/index.js'

const b64urlToObj = (s: string): Record<string, any> =>
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  JSON.parse(u8a.toString(u8a.fromString(s, 'base64url')))

describe('key-did-provider-ed25519', () => {
  let provider: Ed25519Provider
  let did: string
  let kp: KeyPair

  beforeAll(() => {
    const seed = randomBytes(32)
    kp = generateKeyPairFromSeed(seed)
    provider = new Ed25519Provider(seed)
    did = encodeDID(kp.publicKey)
  })

  it('encodeDID', () => {
    const pubkey = u8a.fromString(
      'd713cb7f8624d8648496e01010f2bd72f0dcbbdecdb7036f38c20475f5f429bf',
      'base16'
    )
    expect(encodeDID(pubkey)).toMatchSnapshot()
  })

  it('has isDidProvider property', () => {
    expect(provider.isDidProvider).toEqual(true)
  })

  it('authenticates correctly', async () => {
    const nonce = 'adfberg'
    const aud = 'https://my.app'
    const paths = ['a', 'b']
    const resp = await provider.send({
      jsonrpc: '2.0',
      id: 0,
      method: 'did_authenticate',
      params: { nonce, aud, paths },
    })
    const jws = resp?.result as GeneralJWS
    const payload = b64urlToObj(jws.payload)
    const header = b64urlToObj(jws.signatures[0].protected)
    expect(payload.aud).toEqual(aud)
    expect(payload.nonce).toEqual(nonce)
    expect(payload.paths).toEqual(paths)
    expect(payload.did).toEqual(did)
    expect(payload.exp).toBeGreaterThan(Date.now() / 1000)
    expect(header.kid).toEqual(expect.stringContaining(did))
    expect(header.alg).toEqual('EdDSA')
  })

  it('signs JWS properly', async () => {
    const payload = { foo: 'bar' }
    const prot = { bar: 'baz' }
    const res = await provider.send({
      jsonrpc: '2.0',
      id: 0,
      method: 'did_createJWS',
      params: { payload, protected: prot, did },
    })
    const pubkey = {
      id: '',
      type: '',
      controller: '',
      publicKeyBase64: u8a.toString(kp.publicKey, 'base64pad'),
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
    const gjws = res?.result?.jws as GeneralJWS
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const jws = [gjws.signatures[0].protected, gjws.payload, gjws.signatures[0].signature].join('.')
    expect(verifyJWS(jws, pubkey)).toEqual(pubkey)
  })

  it('decrypts JWE properly', async () => {
    const encrypter = x25519Encrypter(convertPublicKeyToX25519(kp.publicKey))
    const cleartext = randomBytes(123)
    const jwe = await createJWE(cleartext, [encrypter])
    const res = await provider.send({
      jsonrpc: '2.0',
      id: 0,
      method: 'did_decryptJWE',
      params: { jwe },
    })
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(res?.result?.cleartext as string).toEqual(u8a.toString(cleartext, 'base64pad'))
  })

  it('thows if fails to decrypt JWE', async () => {
    const encrypter = x25519Encrypter(randomBytes(32))
    const cleartext = randomBytes(123)
    const jwe = await createJWE(cleartext, [encrypter])
    const res = await provider.send({
      jsonrpc: '2.0',
      id: 0,
      method: 'did_decryptJWE',
      params: { jwe },
    })
    expect(res).toEqual({
      jsonrpc: '2.0',
      id: 0,
      error: {
        data: undefined,
        code: -32000,
        message: 'failure: Failed to decrypt',
      },
    })
  })
})
