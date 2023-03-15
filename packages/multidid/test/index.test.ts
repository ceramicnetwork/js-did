import { Multidid } from '../src/index.js'

describe('@didtools/multidid', () => {

  it('did string roundtrip did:key, no url portion', () => {
    const didString = "did:key:z6MkiTBz1ymuepAQ4HEHYSF1H8quG5GLVVQR3djdX3mDooWp"
    const mdid = Multidid.fromDIDString(didString)
    expect(mdid.toDIDString()).toEqual(didString)
  })

  it('did string roundtrip did:key, with url portion', () => {
    const didString = "did:key:z6MkiTBz1ymuepAQ4HEHYSF1H8quG5GLVVQR3djdX3mDooWp#z6MkiTBz1ymuepAQ4HEHYSF1H8quG5GLVVQR3djdX3mDooWp"
    const mdid = Multidid.fromDIDString(didString)
    expect(mdid.toDIDString()).toEqual(didString)
  })

  it('did string roundtrip did:*, no url portion', () => {
    const didString = "did:example:123456"
    const mdid = Multidid.fromDIDString(didString)
    expect(mdid.toDIDString()).toEqual(didString)
  })

  it('did string roundtrip did:*, with url portion', () => {
    const didString = "did:example:123456?versionId=1"
    const mdid = Multidid.fromDIDString(didString)
    expect(mdid.toDIDString()).toEqual(didString)
  })

  it('spefication did:* vector 1', () => {
    const didString = "did:example:123456"
    const hexMD = 'f9d1a550e6578616d706c653a313233343536'
    const mdid1 = Multidid.fromString(hexMD)
    const mdid2 = Multidid.fromDIDString(didString)
    expect(mdid1.toString('base16')).toEqual(hexMD)
    expect(mdid1.toDIDString()).toEqual(didString)
    expect(mdid2.toString('base16')).toEqual(hexMD)
    expect(mdid2.toDIDString()).toEqual(didString)
    expect(mdid1.toString('base58btc')).toEqual(mdid2.toString('base58btc'))
  })

  it('spefication did:* vector 2', () => {
    const didString = "did:example:123456?versionId=1"
    const hexMD = 'f9d1a551a6578616d706c653a3132333435363f76657273696f6e49643d31'
    const mdid1 = Multidid.fromString(hexMD)
    const mdid2 = Multidid.fromDIDString(didString)
    expect(mdid1.toString('base16')).toEqual(hexMD)
    expect(mdid1.toDIDString()).toEqual(didString)
    expect(mdid2.toString('base16')).toEqual(hexMD)
    expect(mdid2.toDIDString()).toEqual(didString)
    expect(mdid1.toString('base58btc')).toEqual(mdid2.toString('base58btc'))
  })

  it('spefication did:key vector 1', () => {
    const didString = "did:key:z6MkiTBz1ymuepAQ4HEHYSF1H8quG5GLVVQR3djdX3mDooWp"
    const hexMD = 'f9d1aed013b6a27bcceb6a42d62a3a8d02a6f0d73653215771de243a63ac048a18b59da2900'
    const mdid1 = Multidid.fromString(hexMD)
    const mdid2 = Multidid.fromDIDString(didString)
    expect(mdid1.toString('base16')).toEqual(hexMD)
    expect(mdid1.toDIDString()).toEqual(didString)
    expect(mdid2.toString('base16')).toEqual(hexMD)
    expect(mdid2.toDIDString()).toEqual(didString)
    expect(mdid1.toString('base58btc')).toEqual(mdid2.toString('base58btc'))
  })

  it('spefication did:key vector 2', () => {
    const didString = "did:key:z6MkiTBz1ymuepAQ4HEHYSF1H8quG5GLVVQR3djdX3mDooWp#z6MkiTBz1ymuepAQ4HEHYSF1H8quG5GLVVQR3djdX3mDooWp"
    const hexMD = 'f9d1aed013b6a27bcceb6a42d62a3a8d02a6f0d73653215771de243a63ac048a18b59da2931237a364d6b6954427a31796d75657041513448454859534631483871754735474c5656515233646a6458336d446f6f5770'
    const mdid1 = Multidid.fromString(hexMD)
    const mdid2 = Multidid.fromDIDString(didString)
    expect(mdid1.toString('base16')).toEqual(hexMD)
    expect(mdid1.toDIDString()).toEqual(didString)
    expect(mdid2.toString('base16')).toEqual(hexMD)
    expect(mdid2.toDIDString()).toEqual(didString)
    expect(mdid1.toString('base58btc')).toEqual(mdid2.toString('base58btc'))
  })

  it('spefication did:key vector 3', () => {
    const didString = "did:key:zQ3shokFTS3brHcDQrn82RUDfCZESWL1ZdCEJwekUDPQiYBme"
    const hexMD = 'f9d1ae70103874c15c7fda20e539c6e5ba573c139884c351188799f5458b4b41f7924f235cd00'
    const mdid1 = Multidid.fromString(hexMD)
    const mdid2 = Multidid.fromDIDString(didString)
    expect(mdid1.toString('base16')).toEqual(hexMD)
    expect(mdid1.toDIDString()).toEqual(didString)
    expect(mdid2.toString('base16')).toEqual(hexMD)
    expect(mdid2.toDIDString()).toEqual(didString)
    expect(mdid1.toString('base58btc')).toEqual(mdid2.toString('base58btc'))
  })
})