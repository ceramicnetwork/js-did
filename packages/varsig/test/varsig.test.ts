import { test } from '@jest/globals'
import {toBytes} from "../src/bytes";

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
  console.log('a', new Uint8Array(a))
})
