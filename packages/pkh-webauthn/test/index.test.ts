// Low-level imports
import {
  decodeAuthenticatorData,
  decodeAttestationObject,
  verify,
  recoverPublicKey,
  storePublicKey,
  selectPublicKey,
  createCredential
} from '../src/utils'
import { MockAuthenticator } from './mock-authenticator'
import { hexToBytes } from '@noble/curves/abstract/utils'
import { p256 } from '@noble/curves/p256'
import * as u8a from 'uint8arrays'

// High-level imports
import { DIDSession } from 'did-session'
import { WebauthnAuth } from '../src/index'
import { Cacao } from '@didtools/cacao'
import { encodeDIDFromPub } from '@didtools/key-webcrypto'

const toHex = (b: Uint8Array) => u8a.toString(b, 'hex')

// Stub navigator.credentials for nodeJS
// @ts-ignore
globalThis.navigator.credentials = new MockAuthenticator()

describe('@didtools/key-passkey', () => {
  const wSession: WebauthnAuth.AuthenticatorSession = WebauthnAuth.createSession()
  let pk: Uint8Array

  beforeAll(async () => {
    const res = await WebauthnAuth.createCredential(wSession, { name: 'rob' })
    pk = res.publicKey
  })

  it('decodes public key', () => {
    // @ts-ignore
    const authenticator = globalThis.navigator.credentials as MockAuthenticator
    // @ts-ignore
    expect(u8a.toString(pk, 'hex')).toEqual(u8a.toString(authenticator.credentials[0].pk, 'hex'))
  })

  it('authenticates and verifies', async () => {
    const authMethod = await WebauthnAuth.getAuthMethod(wSession)
    const session = await DIDSession.authorize(authMethod, { resources: ['ceramic://nil'] })
    const { cacao } = session
    const { p, s } = cacao
    expect(p.iss).toEqual(encodeDIDFromPub(pk))
    expect(s.t).toEqual('webauthn:p256')
    // TODO: Should we leave buffers as Uint8Array to save space?
    expect(typeof s.s).toEqual('string')
    expect(typeof s.aad?.authData).toEqual('string')
    expect(typeof s.aad?.clientDataJSON).toEqual('string')
    const did = session.did
    const jws = await did.createJWS({ hello: 'world' })
    const verifiers = { ...WebauthnAuth.getVerifier() }
    await Cacao.verify(session.cacao, { verifiers })
  })
})

describe('@didtools/key-passkey: R&D Sanity Checks', () => {

  // Data Extracted from: https://heavy-mint.surge.sh/
  test('Extract public key from AuthenticatorData', () => {
    /* UNUSED! chromium: toHex(window.createRes.response.getPublicKey()) */
    // const cder = '3059301306072a8648ce3d020106082a8648ce3d03010703420004b27c142c5f4cb610f715b03034d20be6009e60d8c96031fc72678387db2aa78e51eca9d3104b5a3a15805e8208f52349b11630943fee4ee6fe5fe21072ca9c1e'
    /* chromium: toHex(new Uint8Array(window.createRes.response.attestationObject)) */
    const chex = 'a363666d74646e6f6e656761747453746d74a068617574684461746158c4f689f6b7489197aacf01172f02a82e0715f72aff70d5f758b9b0f7d3999978d24500000004000000000000000000000000000000000040ab2767e20a0e6f33731c1849d5422b2295d655f051d889b0dc3ec16ca691231459c61fbf349fd5f65fe21b502be3b57dabf4c6a411c61778700c3691966a7a24a5010203262001215820b27c142c5f4cb610f715b03034d20be6009e60d8c96031fc72678387db2aa78e22582051eca9d3104b5a3a15805e8208f52349b11630943fee4ee6fe5fe21072ca9c1e'
    const atObj = hexToBytes(chex)
    const ao = decodeAttestationObject(atObj)
    const { publicKey } = decodeAuthenticatorData(ao.authData)
    expect(toHex(publicKey)).toEqual('02b27c142c5f4cb610f715b03034d20be6009e60d8c96031fc72678387db2aa78e')
  })

  test('Verify', () => {
    // Create Response
    // const credentialID = 'uL55YZaNagzepg8iz4URraORix3tPNT8m5yQZjwP1DqY_b4Q5lCdVGrhli3vrnnn'
    // CredentialID as hex: 'b8be7961968d6a0cdea60f22cf8511ada3918b1ded3cd4fc9b9c90663c0fd43a98fdbe10e6509d546ae1962defae79e7'

    // const attestationObject = 'a363666d74646e6f6e656761747453746d74a068617574684461746158c249960de5880e8c687434170f6476605b8fe4aeb9a28632c7995cf3ba831d9763c500000003000000000000000000000000000000000030b8be7961968d6a0cdea60f22cf8511ada3918b1ded3cd4fc9b9c90663c0fd43a98fdbe10e6509d546ae1962defae79e7a5010203262001215820b8be7961968d6a0cdea60f22cfa915f5de34fab1847d1c2b2e0814b3e1fa15d6225820fcbf3b689071e6a42e02bc5f0f82da28eec7cf1bae7c69f9dde03dc5aeda366ea16b6372656450726f7465637402'
    const authData = '49960de5880e8c687434170f6476605b8fe4aeb9a28632c7995cf3ba831d9763c500000003000000000000000000000000000000000030b8be7961968d6a0cdea60f22cf8511ada3918b1ded3cd4fc9b9c90663c0fd43a98fdbe10e6509d546ae1962defae79e7a5010203262001215820b8be7961968d6a0cdea60f22cfa915f5de34fab1847d1c2b2e0814b3e1fa15d6225820fcbf3b689071e6a42e02bc5f0f82da28eec7cf1bae7c69f9dde03dc5aeda366ea16b6372656450726f7465637402'

    const { publicKey } = decodeAuthenticatorData(hexToBytes(authData))

    // Sign Response
    // const hash = '000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f' // Input
    const authData2 = '49960de5880e8c687434170f6476605b8fe4aeb9a28632c7995cf3ba831d97630500000005'
    const sig = '3044022006b2c838abf114f97e3e57d0d2d0124d1e3f8089d707294bde2fa60c8ae0650002204723780cdd0c405147975aed229e84b7e4d47a8bb8aaa07407b1f842ba16fae1'

    const clientDataJSON = '7b2274797065223a22776562617574686e2e676574222c226368616c6c656e6765223a2241414543417751464267634943516f4c4441304f4478415245684d554652595847426b6147787764486838222c226f726967696e223a22687474703a2f2f6c6f63616c686f73743a38303030222c2263726f73734f726967696e223a66616c73657d'

    // expect(Buffer.from(JSON.parse(Buffer.from(hexToBytes(clientDataJSON)).toString()).challenge, 'base64url').hexSlice()).toEqual(hash)
    // Verify
    const clientDataHash = p256.CURVE.hash(hexToBytes(clientDataJSON))
    const msg = u8a.concat([hexToBytes(authData2), clientDataHash])
    const msgHash = p256.CURVE.hash(msg)
    const valid = p256.verify(sig, msgHash, publicKey)
    expect(valid).toEqual(true)
  })

  test('PublicKey Recovery; Expect key to equal one of the recovered keys', () => {
    const authData = '49960de5880e8c687434170f6476605b8fe4aeb9a28632c7995cf3ba831d9763c500000003000000000000000000000000000000000030b8be7961968d6a0cdea60f22cf8511ada3918b1ded3cd4fc9b9c90663c0fd43a98fdbe10e6509d546ae1962defae79e7a5010203262001215820b8be7961968d6a0cdea60f22cfa915f5de34fab1847d1c2b2e0814b3e1fa15d6225820fcbf3b689071e6a42e02bc5f0f82da28eec7cf1bae7c69f9dde03dc5aeda366ea16b6372656450726f7465637402'
    const { publicKey } = decodeAuthenticatorData(hexToBytes(authData))
    storePublicKey(publicKey)
    const clientDataJSON = '7b2274797065223a22776562617574686e2e676574222c226368616c6c656e6765223a2241414543417751464267634943516f4c4441304f4478415245684d554652595847426b6147787764486838222c226f726967696e223a22687474703a2f2f6c6f63616c686f73743a38303030222c2263726f73734f726967696e223a66616c73657d'
    const authData2 = '49960de5880e8c687434170f6476605b8fe4aeb9a28632c7995cf3ba831d97630500000005'
    const sig = '3044022006b2c838abf114f97e3e57d0d2d0124d1e3f8089d707294bde2fa60c8ae0650002204723780cdd0c405147975aed229e84b7e4d47a8bb8aaa07407b1f842ba16fae1'

    const keys = recoverPublicKey(hexToBytes(sig), hexToBytes(authData2), hexToBytes(clientDataJSON))
    const recoveredKey = selectPublicKey(keys[0], keys[1])
    if (!recoveredKey) throw new Error('Select Failed')
    expect(toHex(recoveredKey)).toEqual(toHex(publicKey))
  })
})

