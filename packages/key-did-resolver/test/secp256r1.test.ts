// @ts-nocheck
// Brent Shambaugh <brent.shambaugh@gmail.com>. 2021.

import varint from 'varint'
import { base58btc } from 'multiformats/bases/base58'
import * as mapper from '../src/secp256r1.js'
import * as u8a from 'uint8arrays'

describe('Secp256r1 mapper', () => {
  it('successfully resolves the document from did:key from raw public key', async () => {
    const id =
      'zruuPojWkzGPb8sVc42f2YxcTXKUTpAUbdrzVovaTBmGGNyK6cGFaA4Kp7SSLKecrxYz8Sc9d77Rss7rayYt1oFCaNJ'

    const multiformatPubKey = base58btc.decode(id)
    varint.decode(multiformatPubKey) // decode is changing param multiformatPubKey as well
    const pubKeyBytes = multiformatPubKey.slice(varint.decode.bytes)
    const doc = await mapper.keyToDidDoc(pubKeyBytes, id)
    expect(doc).toMatchSnapshot()
  })

  it('successfully resolves the document from did:key from raw public key #2', async () => {
    const id =
      'zrusAFgBbf84b8mBz8Cmy8UoFWKV52EaeRnK86vnLo4Z5QoRypE6hXVPN2urevZMAMtcTaCDFLWBaE1Q3jmdb1FHgve'

    const multiformatPubKey = base58btc.decode(id)
    varint.decode(multiformatPubKey) // decode is changing param multiformatPubKey as well
    const pubKeyBytes = multiformatPubKey.slice(varint.decode.bytes)
    const doc = await mapper.keyToDidDoc(pubKeyBytes, id)
    expect(doc).toMatchSnapshot()
  })

  it('successfully resolves the document from did:key from raw public key #3', async () => {
    const id =
      'zrurwcJZss4ruepVNu1H3xmSirvNbzgBk9qrCktB6kaewXnJAhYWwtP3bxACqBpzjZdN7TyHNzzGGSSH5qvZsSDir9z'

    const multiformatPubKey = base58btc.decode(id)
    varint.decode(multiformatPubKey) // decode is changing param multiformatPubKey as well
    const pubKeyBytes = multiformatPubKey.slice(varint.decode.bytes)
    const doc = await mapper.keyToDidDoc(pubKeyBytes, id)
    expect(doc).toMatchSnapshot()
  })

  it('successfully resolves the document from did:key from compressed public key', async () => {
    const id = 'zDnaeUKTWUXc1HDpGfKbEK31nKLN19yX5aunFd7VK1CUMeyJu'

    const multiformatPubKey = base58btc.decode(id)
    varint.decode(multiformatPubKey) // decode is changing param multiformatPubKey as well
    const pubKeyBytes = multiformatPubKey.slice(varint.decode.bytes)
    const doc = await mapper.keyToDidDoc(pubKeyBytes, id)
    expect(doc).toMatchSnapshot()
  })

  it('successfully resolves the document from did:key from compressed public key #2', async () => {
    const id = 'zDnaerx9CtbPJ1q36T5Ln5wYt3MQYeGRG5ehnPAmxcf5mDZpv'

    const multiformatPubKey = base58btc.decode(id)
    varint.decode(multiformatPubKey) // decode is changing param multiformatPubKey as well
    const pubKeyBytes = multiformatPubKey.slice(varint.decode.bytes)
    const doc = await mapper.keyToDidDoc(pubKeyBytes, id)
    expect(doc).toMatchSnapshot()
  })

  it('successfully resolves the document from did:key from compressed public key #3', async () => {
    const id = 'zDnaerDaTF5BXEavCrfRZEk316dpbLsfPDZ3WJ5hRTPFU2169'

    const multiformatPubKey = base58btc.decode(id)
    varint.decode(multiformatPubKey) // decode is changing param multiformatPubKey as well
    const pubKeyBytes = multiformatPubKey.slice(varint.decode.bytes)
    const doc = await mapper.keyToDidDoc(pubKeyBytes, id)
    expect(doc).toMatchSnapshot()
  })

  it('successfully resolves the document from did:key from uncompressed public key', async () => {
    const id =
      'z4oJ8emo5e6mGPCUS5wncFZXAyuVzGRyJZvoduwq7FrdZYPd1LZQbDKsp1YAMX8x14zBwy3yHMSpfecJCMDeRFUgFqYsY'

    const multiformatPubKey = base58btc.decode(id)
    varint.decode(multiformatPubKey) // decode is changing param multiformatPubKey as well
    const pubKeyBytes = multiformatPubKey.slice(varint.decode.bytes)
    const doc = await mapper.keyToDidDoc(pubKeyBytes, id)
    expect(doc).toMatchSnapshot()
  })
})

//**** end of tests

// Function for test. Eliminate this when key-did-resolver is written.

function pubKeyHexToUint8Array(publicKeyHex: string) {
  if (publicKeyHex == null) {
    throw new TypeError('input cannot be null or undefined.')
  }
  if (publicKeyHex.length % 2 == 0) {
    return u8a.fromString(publicKeyHex, 'base16')
  } else {
    return u8a.fromString('0' + publicKeyHex, 'base16')
  }
}
