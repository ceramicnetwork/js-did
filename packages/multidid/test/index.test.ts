import { Multidid } from '../src/index.js'

describe('@didtools/multidid', () => {

  it('did string roundtrip did:key, no url portion', () => {
    const didString = "did:key:z6MkiTBz1ymuepAQ4HEHYSF1H8quG5GLVVQR3djdX3mDooWp"
    const mdid = Multidid.fromString(didString)
    expect(mdid.toString()).toEqual(didString)
  })

  it('did string roundtrip did:key, with url portion', () => {
    const didString = "did:key:z6MkiTBz1ymuepAQ4HEHYSF1H8quG5GLVVQR3djdX3mDooWp#z6MkiTBz1ymuepAQ4HEHYSF1H8quG5GLVVQR3djdX3mDooWp"
    const mdid = Multidid.fromString(didString)
    expect(mdid.toString()).toEqual(didString)
  })

  it('did string roundtrip did:*, no url portion', () => {
    const didString = "did:example:123456"
    const mdid = Multidid.fromString(didString)
    expect(mdid.toString()).toEqual(didString)
  })

  it('did string roundtrip did:*, with url portion', () => {
    const didString = "did:example:123456?versionId=1"
    const mdid = Multidid.fromString(didString)
    expect(mdid.toString()).toEqual(didString)
  })

  it('spefication did:* vector 1', () => {
    const didString = "did:example:123456"
    const hexMD = 'f9d1a550e6578616d706c653a313233343536'
    const mdid1 = Multidid.fromMultibase(hexMD)
    const mdid2 = Multidid.fromString(didString)
    expect(mdid1.toMultibase('base16')).toEqual(hexMD)
    expect(mdid1.toString()).toEqual(didString)
    expect(mdid2.toMultibase('base16')).toEqual(hexMD)
    expect(mdid2.toString()).toEqual(didString)
    expect(mdid1.toMultibase('base58btc')).toEqual(mdid2.toMultibase('base58btc'))
  })

  it('spefication did:* vector 2', () => {
    const didString = "did:example:123456?versionId=1"
    const hexMD = 'f9d1a551a6578616d706c653a3132333435363f76657273696f6e49643d31'
    const mdid1 = Multidid.fromMultibase(hexMD)
    const mdid2 = Multidid.fromString(didString)
    expect(mdid1.toMultibase('base16')).toEqual(hexMD)
    expect(mdid1.toString()).toEqual(didString)
    expect(mdid2.toMultibase('base16')).toEqual(hexMD)
    expect(mdid2.toString()).toEqual(didString)
    expect(mdid1.toMultibase('base58btc')).toEqual(mdid2.toMultibase('base58btc'))
  })

  it('spefication did:key vector 1', () => {
    const didString = "did:key:z6MkiTBz1ymuepAQ4HEHYSF1H8quG5GLVVQR3djdX3mDooWp"
    const hexMD = 'f9d1aed013b6a27bcceb6a42d62a3a8d02a6f0d73653215771de243a63ac048a18b59da2900'
    const mdid1 = Multidid.fromMultibase(hexMD)
    const mdid2 = Multidid.fromString(didString)
    expect(mdid1.toMultibase('base16')).toEqual(hexMD)
    expect(mdid1.toString()).toEqual(didString)
    expect(mdid2.toMultibase('base16')).toEqual(hexMD)
    expect(mdid2.toString()).toEqual(didString)
    expect(mdid1.toMultibase('base58btc')).toEqual(mdid2.toMultibase('base58btc'))
  })

  it('spefication did:key vector 2', () => {
    const didString = "did:key:z6MkiTBz1ymuepAQ4HEHYSF1H8quG5GLVVQR3djdX3mDooWp#z6MkiTBz1ymuepAQ4HEHYSF1H8quG5GLVVQR3djdX3mDooWp"
    const hexMD = 'f9d1aed013b6a27bcceb6a42d62a3a8d02a6f0d73653215771de243a63ac048a18b59da2931237a364d6b6954427a31796d75657041513448454859534631483871754735474c5656515233646a6458336d446f6f5770'
    const mdid1 = Multidid.fromMultibase(hexMD)
    const mdid2 = Multidid.fromString(didString)
    expect(mdid1.toMultibase('base16')).toEqual(hexMD)
    expect(mdid1.toString()).toEqual(didString)
    expect(mdid2.toMultibase('base16')).toEqual(hexMD)
    expect(mdid2.toString()).toEqual(didString)
    expect(mdid1.toMultibase('base58btc')).toEqual(mdid2.toMultibase('base58btc'))
  })

  it('spefication did:key vector 3', () => {
    const didString = "did:key:zQ3shokFTS3brHcDQrn82RUDfCZESWL1ZdCEJwekUDPQiYBme"
    const hexMD = 'f9d1ae70103874c15c7fda20e539c6e5ba573c139884c351188799f5458b4b41f7924f235cd00'
    const mdid1 = Multidid.fromMultibase(hexMD)
    const mdid2 = Multidid.fromString(didString)
    expect(mdid1.toMultibase('base16')).toEqual(hexMD)
    expect(mdid1.toString()).toEqual(didString)
    expect(mdid2.toMultibase('base16')).toEqual(hexMD)
    expect(mdid2.toString()).toEqual(didString)
    expect(mdid1.toMultibase('base58btc')).toEqual(mdid2.toMultibase('base58btc'))
  })

  //RSA test vectors https://w3c-ccg.github.io/did-method-key/#rsa-2048
  it('spefication did:key RSA 2048-bit', () => {
    const didString = "did:key:z4MXj1wBzi9jUstyPMS4jQqB6KdJaiatPkAtVtGc6bQEQEEsKTic4G7Rou3iBf9vPmT5dbkm9qsZsuVNjq8HCuW1w24nhBFGkRE4cd2Uf2tfrB3N7h4mnyPp1BF3ZttHTYv3DLUPi1zMdkULiow3M1GfXkoC6DoxDUm1jmN6GBj22SjVsr6dxezRVQc7aj9TxE7JLbMH1wh5X3kA58H3DFW8rnYMakFGbca5CB2Jf6CnGQZmL7o5uJAdTwXfy2iiiyPxXEGerMhHwhjTA1mKYobyk2CpeEcmvynADfNZ5MBvcCS7m3XkFCMNUYBS9NQ3fze6vMSUPsNa6GVYmKx2x6JrdEjCk3qRMMmyjnjCMfR4pXbRMZa3i"
    const mdid = Multidid.fromString(didString)
    expect(mdid.toString()).toEqual(didString)
    expect(mdid.inspect().methodIdBytes.byteLength).toEqual(270)
  })

  it('spefication did:key RSA 4096-bit', () => {
    const didString = "did:key:zgghBUVkqmWS8e1ioRVp2WN9Vw6x4NvnE9PGAyQsPqM3fnfPf8EdauiRVfBTcVDyzhqM5FFC7ekAvuV1cJHawtfgB9wDcru1hPDobk3hqyedijhgWmsYfJCmodkiiFnjNWATE7PvqTyoCjcmrc8yMRXmFPnoASyT5beUd4YZxTE9VfgmavcPy3BSouNmASMQ8xUXeiRwjb7xBaVTiDRjkmyPD7NYZdXuS93gFhyDFr5b3XLg7Rfj9nHEqtHDa7NmAX7iwDAbMUFEfiDEf9hrqZmpAYJracAjTTR8Cvn6mnDXMLwayNG8dcsXFodxok2qksYF4D8ffUxMRmyyQVQhhhmdSi4YaMPqTnC1J6HTG9Yfb98yGSVaWi4TApUhLXFow2ZvB6vqckCNhjCRL2R4MDUSk71qzxWHgezKyDeyThJgdxydrn1osqH94oSeA346eipkJvKqYREXBKwgB5VL6WF4qAK6sVZxJp2dQBfCPVZ4EbsBQaJXaVK7cNcWG8tZBFWZ79gG9Cu6C4u8yjBS8Ux6dCcJPUTLtixQu4z2n5dCsVSNdnP1EEs8ZerZo5pBgc68w4Yuf9KL3xVxPnAB1nRCBfs9cMU6oL1EdyHbqrTfnjE8HpY164akBqe92LFVsk8RusaGsVPrMekT8emTq5y8v8CabuZg5rDs3f9NPEtogjyx49wiub1FecM5B7QqEcZSYiKHgF4mfkteT2"
    const mdid = Multidid.fromString(didString)
    expect(mdid.toString()).toEqual(didString)
    expect(mdid.inspect().methodIdBytes.byteLength).toEqual(526)
  })
})