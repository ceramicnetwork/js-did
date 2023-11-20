import { test } from '@jest/globals'
import { toBytes } from '../src/bytes.js'
import { ENCODING, HASHING, SIGNING, Varsig } from '../src/varsig.js'
import * as uint8arrays from 'uint8arrays'

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
  const signatureBytes = new Uint8Array(a)
  const b = toIPLD({
    payload: {},
    encoding: ENCODING.IDENTITY,
    hashing: HASHING.SHA2_256,
    signing: SIGNING.RSA,
    signature: signatureBytes,
  })
  console.log('b', b)
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
