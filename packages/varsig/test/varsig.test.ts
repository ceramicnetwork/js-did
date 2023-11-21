import { test } from '@jest/globals'
import { toBytes } from '../src/bytes.js'
import { ENCODING, HASHING, SIGNING, Varsig } from '../src/varsig.js'
import * as uint8arrays from 'uint8arrays'
import { Ed25519Provider } from 'key-did-provider-ed25519'
import KeyResolver from 'key-did-resolver'
import { DID, GeneralJWS } from 'dids'
import { randomBytes } from '@stablelib/random'

test('rsa', async () => {
  const key = await crypto.subtle.generateKey(
    {
      name: 'RSASSA-PKCS1-v1_5',
      modulusLength: 4096,
      publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
      hash: 'SHA-256',
    },
    true,
    ['sign', 'verify']
  )
  const a = await crypto.subtle.sign(
    {
      name: 'RSASSA-PKCS1-v1_5',
    },
    key.privateKey,
    new Uint8Array([1, 2, 3])
  )
  console.log('verif', await crypto.subtle.verify({ name: 'RSASSA-PKCS1-v1_5'}, key.publicKey, a, new Uint8Array([1, 2, 3])))
  const signatureBytes = new Uint8Array(a)
  const b = toIPLD({
    payload: {},
    encoding: ENCODING.IDENTITY,
    hashing: HASHING.SHA2_256,
    signing: SIGNING.RSA,
    signature: signatureBytes,
  })
  // console.log('b', b)
})

function toIPLD(input: Varsig) {
  return {
    ...input.payload,
    _signature: toBytes({
      encoding: input.encoding,
      hashing: input.hashing,
      signing: input.signing,
      signature: input.signature,
    }),
  }
}

function jwsToIPLD(jws: GeneralJWS) {
  const payload = JSON.parse(uint8arrays.toString(uint8arrays.fromString(jws.payload, 'base64url')))
  console.log('payload', payload)
  const signature0 = jws.signatures[0]
  const protectedHeader = JSON.parse(
    uint8arrays.toString(uint8arrays.fromString(signature0.protected, 'base64url'))
  )
  console.log('protected', protectedHeader)
}

test('jwt-to-ipld', async () => {
  const seed = randomBytes(32)
  const provider = new Ed25519Provider(seed)
  const did = new DID({ provider, resolver: KeyResolver.getResolver() })
  await did.authenticate()
  const jws = await did.createJWS({ hello: 'world' })
  console.log('jws', jws)
  jwsToIPLD(jws)
  console.log('dagjws', await did.createDagJWS({ hello: 'world' }))
})
