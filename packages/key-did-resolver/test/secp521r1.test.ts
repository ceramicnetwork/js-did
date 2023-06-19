// Brent Shambaugh <brent.shambaugh@gmail.com>. 2021.

import varint from 'varint'
import { base58btc } from 'multiformats/bases/base58'
import * as mapper from '../src/secp521r1.js'

describe('Secp521r1 mapper', () => {
  // testing the key from the did:key from the compressed public key
  it('successfully resolves the document from did', async () => {
    const id =
      'z2J9gcGdb2nEyMDmzQYv2QZQcM1vXktvy1Pw4MduSWxGabLZ9XESSWLQgbuPhwnXN7zP7HpTzWqrMTzaY5zWe6hpzJ2jnw4f'
    const multiformatPubKey = base58btc.decode(id)
    varint.decode(multiformatPubKey) // decode is changing param multiformatPubKey as well
    const pubKeyBytes = multiformatPubKey.slice(varint.decode.bytes)
    const doc = await mapper.keyToDidDoc(pubKeyBytes, id)
    expect(doc).toMatchSnapshot()
  })

  // testing the key from the did:key from the compressed public key
  it('successfully resolves the document from did', async () => {
    const id =
      'z2J9gaYxrKVpdoG9A4gRnmpnRCcxU6agDtFVVBVdn1JedouoZN7SzcyREXXzWgt3gGiwpoHq7K68X4m32D8HgzG8wv3sY5j7'
    const multiformatPubKey = base58btc.decode(id)
    varint.decode(multiformatPubKey) // decode is changing param multiformatPubKey as well
    const pubKeyBytes = multiformatPubKey.slice(varint.decode.bytes)
    const doc = await mapper.keyToDidDoc(pubKeyBytes, id)
    expect(doc).toMatchSnapshot()
  })

  // testing the key from the did:key from the compressed public key
  it('successfully resolves the document from did', async () => {
    const id =
      'z2J9gaYaTUV4Ps5GYNNMm4nAyj4pGxd3Nh2zyeFjpEy631ZJ3dYfTDZ68GAhYbNuTn2eMAhKd6hhbzfxLn66vrQ6992jCSxX'
    const multiformatPubKey = base58btc.decode(id)
    varint.decode(multiformatPubKey) // decode is changing param multiformatPubKey as well
    const pubKeyBytes = multiformatPubKey.slice(varint.decode.bytes)
    const doc = await mapper.keyToDidDoc(pubKeyBytes, id)
    expect(doc).toMatchSnapshot()
  })

  // testing the key from the did:key from the compressed public key
  it('successfully resolves the document from did', async () => {
    const id =
      'z2J9gcGTLNfNooB4Mvx7qeEBccSWARJ3y1xjwbMH9A7ra6oq71rD1daVSVm2YmjUZRWJms18QTZXTnhaH5ihiKiVaG52cuAs'
    const multiformatPubKey = base58btc.decode(id)
    varint.decode(multiformatPubKey) // decode is changing param multiformatPubKey as well
    const pubKeyBytes = multiformatPubKey.slice(varint.decode.bytes)
    const doc = await mapper.keyToDidDoc(pubKeyBytes, id)
    expect(doc).toMatchSnapshot()
  })

  // testing the key from the did:key from the compressed public key
  it('successfully resolves the document from did', async () => {
    const id =
      'z2J9gaZDkUkcV4j5nMPp4dzks3vygMwKRSZWg9j7HNYcR5JLRu361LN6TwrBK3r19VisFYUZEGEXhqqffAprjgmVtCwfCUB1'
    const multiformatPubKey = base58btc.decode(id)
    varint.decode(multiformatPubKey) // decode is changing param multiformatPubKey as well
    const pubKeyBytes = multiformatPubKey.slice(varint.decode.bytes)
    const doc = await mapper.keyToDidDoc(pubKeyBytes, id)
    expect(doc).toMatchSnapshot()
  })

  // testing the key from the did:key from the compressed public key
  it('successfully resolves the document from did', async () => {
    const id =
      'z2J9gaYd3MzVdZSQDj1zqsxv2tLD5Np3oD7G5F5dHbsF7Sbf1ovGkRfFcaUZMSSDKheREWxapez3vzVwkRYvrSMt4PM4Am1z'
    const multiformatPubKey = base58btc.decode(id)
    varint.decode(multiformatPubKey) // decode is changing param multiformatPubKey as well
    const pubKeyBytes = multiformatPubKey.slice(varint.decode.bytes)
    const doc = await mapper.keyToDidDoc(pubKeyBytes, id)
    expect(doc).toMatchSnapshot()
  })

  // testing the key from the did:key from the compressed public key
  it('successfully resolves the document from did', async () => {
    const id =
      'z2J9gaYhkf4Ax2QA65KkcrSxr8JDSxUBwzFq3jmq5iBroY2tE7s1uohXVqEvALPxbvdzbWWQTtHvTprUdbNFha3HawyPcD9P'

    const multiformatPubKey = base58btc.decode(id)
    varint.decode(multiformatPubKey) // decode is changing param multiformatPubKey as well
    const pubKeyBytes = multiformatPubKey.slice(varint.decode.bytes)
    const doc = await mapper.keyToDidDoc(pubKeyBytes, id)
    expect(doc).toMatchSnapshot()
  })

  // testing the key from the did:key from the compressed public key
  it('successfully resolves the document from did', async () => {
    const id =
      'z2J9gcGdbo8riFqfRzgo3gjJyFcbNJm75hrnpDrZTNqQQxgNVBTtKndBiKxzGXrAbyw5W88VDbR1B1FvRQNTnSezghqnJ7p6'

    const multiformatPubKey = base58btc.decode(id)
    varint.decode(multiformatPubKey) // decode is changing param multiformatPubKey as well
    const pubKeyBytes = multiformatPubKey.slice(varint.decode.bytes)
    const doc = await mapper.keyToDidDoc(pubKeyBytes, id)
    expect(doc).toMatchSnapshot()
  })

  // testing the key from the did:key from the compressed public key
  it('successfully resolves the document from did', async () => {
    const id =
      'z2J9gcGTjd3NaNifwmaNZN27xioMAzHHCDBmkuQ552hm9kWrzhUepDCSAhiuRYBj1sSXR1LBxgqh6vasYzc8JhC12FpaNDhT'

    const multiformatPubKey = base58btc.decode(id)
    varint.decode(multiformatPubKey) // decode is changing param multiformatPubKey as well
    const pubKeyBytes = multiformatPubKey.slice(varint.decode.bytes)
    const doc = await mapper.keyToDidDoc(pubKeyBytes, id)
    expect(doc).toMatchSnapshot()
  })
})

//**** end of tests
