// Brent Shambaugh <brent.shambaugh@gmail.com>. 2021.

import varint from 'varint'
import { base58btc } from 'multiformats/bases/base58'
import * as mapper from '../src/secp384r1.js'

describe('Secp384r1 mapper', () => {
  it('Secp384r1 mapper successfully resolves the document from did:key from raw public key', async () => {
    const id =
      'zFwfeyrSyWdksRYykTGGtagWazFB5zS4CjQcxDMQSNmCTQB5QMqokx2VJz4vBB2hN1nUrYDTuYq3kd1BM5cUCfFD4awiNuzEBuoy6rZZTMCsZsdvWkDXY6832qcAnzE7YGw43KU'

    const multiformatPubKey = base58btc.decode(id)
    varint.decode(multiformatPubKey) // decode is changing param multiformatPubKey as well
    const pubKeyBytes = multiformatPubKey.slice(varint.decode.bytes)
    const doc = await mapper.keyToDidDoc(pubKeyBytes, id)
    expect(doc).toMatchSnapshot()
  })

  it('Secp384r1 mapper successfully resolves the document from did:key from raw public key #2', async () => {
    const id =
      'zFwepbBSaPFjt5T1zWptHaXugLNxHYABfJrDoAZRYxKjNkpdfrniF3pvYQAXwxVB7afhmsgzYtSCzTVZQ3F5SPHzP5PuHgtBGNYucZTSrnA7yTTDr7WGQZaTTkJWfiH47jW5ahU'

    const multiformatPubKey = base58btc.decode(id)
    varint.decode(multiformatPubKey) // decode is changing param multiformatPubKey as well
    const pubKeyBytes = multiformatPubKey.slice(varint.decode.bytes)
    const doc = await mapper.keyToDidDoc(pubKeyBytes, id)
    expect(doc).toMatchSnapshot()
  })

  it('Secp384r1 mapper successfully resolves the document from did:key from raw public key #3', async () => {
    const id =
      'zFwfwzpxzCAUjJK6X7cLDFjxbp6G3iJy6AcntWLBu5SxJeGBjge7jVkmARyUqkJideMFofkhGF94wLopAmuqCH1JQ3fbzxmrBwKK52qF5w429kUJk5NdR8BJwDxpeWryV4oAH27'

    const multiformatPubKey = base58btc.decode(id)
    varint.decode(multiformatPubKey) // decode is changing param multiformatPubKey as well
    const pubKeyBytes = multiformatPubKey.slice(varint.decode.bytes)
    const doc = await mapper.keyToDidDoc(pubKeyBytes, id)
    expect(doc).toMatchSnapshot()
  })

  it('Secp384r1 mapper successfully resolves the document from did:key from compressed public key', async () => {
    const id = 'z82Lm1MpAkeJcix9K8TMiLd5NMAhnwkjjCBeWHXyu3U4oT2MVJJKXkcVBgjGhnLBn2Kaau9'

    const multiformatPubKey = base58btc.decode(id)
    varint.decode(multiformatPubKey) // decode is changing param multiformatPubKey as well
    const pubKeyBytes = multiformatPubKey.slice(varint.decode.bytes)
    const doc = await mapper.keyToDidDoc(pubKeyBytes, id)
    expect(doc).toMatchSnapshot()
  })

  it('Secp384r1 mapper successfully resolves the document from did:key from compressed public key #2', async () => {
    const id = 'z82LkvCwHNreneWpsgPEbV3gu1C6NFJEBg4srfJ5gdxEsMGRJUz2sG9FE42shbn2xkZJh54'

    const multiformatPubKey = base58btc.decode(id)
    varint.decode(multiformatPubKey) // decode is changing param multiformatPubKey as well
    const pubKeyBytes = multiformatPubKey.slice(varint.decode.bytes)
    const doc = await mapper.keyToDidDoc(pubKeyBytes, id)
    expect(doc).toMatchSnapshot()
  })

  it('Secp384r1 mapper successfully resolves the document from did:key from compressed public key #3', async () => {
    const id = 'z82Lm2BuneDPATu4BSWzhZwuandHAwY4DJrv3gAbo8RvG6yBTLJx6AhgoSmKy8XSK4HaPvA'

    const multiformatPubKey = base58btc.decode(id)
    varint.decode(multiformatPubKey) // decode is changing param multiformatPubKey as well
    const pubKeyBytes = multiformatPubKey.slice(varint.decode.bytes)
    const doc = await mapper.keyToDidDoc(pubKeyBytes, id)
    expect(doc).toMatchSnapshot()
  })

  // testing the key from the did:key from the uncompressed public key
  it('successfully resolves the document from did', async () => {
    const id =
      'z28xDr9xiQCrXbooH2aC3eMVv74QKvxBgP1DHCMBWz6CvTHmdt4rtsH9JSHGsyPzdQpfMBJSSAHFh1zTjiyLhKchrMnNfBVEtCziwX2yy3YiQY9t6WcVUpSdVHaxeRz5x6JYoGGPJ'

    const multiformatPubKey = base58btc.decode(id)
    varint.decode(multiformatPubKey) // decode is changing param multiformatPubKey as well
    const pubKeyBytes = multiformatPubKey.slice(varint.decode.bytes)
    const doc = await mapper.keyToDidDoc(pubKeyBytes, id)
    expect(doc).toMatchSnapshot()
  })

  // testing the key from the did:key from the uncompressed public key
  it('successfully resolves the document from did', async () => {
    const id =
      'z28xDrNf4RYwmuLQmfFBWWwiaxZtqyfME8BGUHemrsKUn6ShdzCLZWq2ZhmmSpVK2rtSLoeA1CJjrwGjZ64yCjJ9odVTYDdAMSu2LsTL1c5ehyQdkatFonfv3d7VNCByDrqntBoVz'

    const multiformatPubKey = base58btc.decode(id)
    varint.decode(multiformatPubKey) // decode is changing param multiformatPubKey as well
    const pubKeyBytes = multiformatPubKey.slice(varint.decode.bytes)
    const doc = await mapper.keyToDidDoc(pubKeyBytes, id)
    expect(doc).toMatchSnapshot()
  })
})

//**** end of tests
