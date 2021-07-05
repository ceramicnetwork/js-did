import { DID } from '../did'

const VERSION_0_VANILLA = {
  didResolutionMetadata: {
    contentType: 'application/did+json',
  },
  didDocument: {
    id: 'did:3:kjzl6cwe1jw14acsxto0wvxwl62usq32y4ncfonzdmg5i5jorjcs2haniuabvzl',
    verificationMethod: [
      {
        id: 'did:3:kjzl6cwe1jw14acsxto0wvxwl62usq32y4ncfonzdmg5i5jorjcs2haniuabvzl#9t28iZFbczNR2xZ',
        type: 'X25519KeyAgreementKey2019',
        controller: 'did:3:kjzl6cwe1jw14acsxto0wvxwl62usq32y4ncfonzdmg5i5jorjcs2haniuabvzl',
        publicKeyBase58: 'thXhSaHPhtJNZaG2pJBYrQ8VChNzYhsFjqa7ALqhfBo',
      },
      {
        id: 'did:3:kjzl6cwe1jw14acsxto0wvxwl62usq32y4ncfonzdmg5i5jorjcs2haniuabvzl#dkbnB3Dd1z5wByn',
        type: 'EcdsaSecp256k1Signature2019',
        controller: 'did:3:kjzl6cwe1jw14acsxto0wvxwl62usq32y4ncfonzdmg5i5jorjcs2haniuabvzl',
        publicKeyBase58: 'fuNBAnTyH62WECeXuDbgnEck7SQZy5i4rFHRKgJxii84',
      },
    ],
    authentication: [
      {
        id: 'did:3:kjzl6cwe1jw14acsxto0wvxwl62usq32y4ncfonzdmg5i5jorjcs2haniuabvzl#dkbnB3Dd1z5wByn',
        type: 'EcdsaSecp256k1Signature2019',
        controller: 'did:3:kjzl6cwe1jw14acsxto0wvxwl62usq32y4ncfonzdmg5i5jorjcs2haniuabvzl',
        publicKeyBase58: 'fuNBAnTyH62WECeXuDbgnEck7SQZy5i4rFHRKgJxii84',
      },
    ],
    keyAgreement: [
      {
        id: 'did:3:kjzl6cwe1jw14acsxto0wvxwl62usq32y4ncfonzdmg5i5jorjcs2haniuabvzl#9t28iZFbczNR2xZ',
        type: 'X25519KeyAgreementKey2019',
        controller: 'did:3:kjzl6cwe1jw14acsxto0wvxwl62usq32y4ncfonzdmg5i5jorjcs2haniuabvzl',
        publicKeyBase58: 'thXhSaHPhtJNZaG2pJBYrQ8VChNzYhsFjqa7ALqhfBo',
      },
    ],
  },
  didDocumentMetadata: {
    versionId: '0',
  },
}

const VERSION_0_ROTATED = {
  didResolutionMetadata: {
    contentType: 'application/did+json',
  },
  didDocument: {
    id: 'did:3:kjzl6cwe1jw14acsxto0wvxwl62usq32y4ncfonzdmg5i5jorjcs2haniuabvzl',
    verificationMethod: [
      {
        id: 'did:3:kjzl6cwe1jw14acsxto0wvxwl62usq32y4ncfonzdmg5i5jorjcs2haniuabvzl#9t28iZFbczNR2xZ',
        type: 'X25519KeyAgreementKey2019',
        controller: 'did:3:kjzl6cwe1jw14acsxto0wvxwl62usq32y4ncfonzdmg5i5jorjcs2haniuabvzl',
        publicKeyBase58: 'thXhSaHPhtJNZaG2pJBYrQ8VChNzYhsFjqa7ALqhfBo',
      },
      {
        id: 'did:3:kjzl6cwe1jw14acsxto0wvxwl62usq32y4ncfonzdmg5i5jorjcs2haniuabvzl#dkbnB3Dd1z5wByn',
        type: 'EcdsaSecp256k1Signature2019',
        controller: 'did:3:kjzl6cwe1jw14acsxto0wvxwl62usq32y4ncfonzdmg5i5jorjcs2haniuabvzl',
        publicKeyBase58: 'fuNBAnTyH62WECeXuDbgnEck7SQZy5i4rFHRKgJxii84',
      },
    ],
    authentication: [
      {
        id: 'did:3:kjzl6cwe1jw14acsxto0wvxwl62usq32y4ncfonzdmg5i5jorjcs2haniuabvzl#dkbnB3Dd1z5wByn',
        type: 'EcdsaSecp256k1Signature2019',
        controller: 'did:3:kjzl6cwe1jw14acsxto0wvxwl62usq32y4ncfonzdmg5i5jorjcs2haniuabvzl',
        publicKeyBase58: 'fuNBAnTyH62WECeXuDbgnEck7SQZy5i4rFHRKgJxii84',
      },
    ],
    keyAgreement: [
      {
        id: 'did:3:kjzl6cwe1jw14acsxto0wvxwl62usq32y4ncfonzdmg5i5jorjcs2haniuabvzl#9t28iZFbczNR2xZ',
        type: 'X25519KeyAgreementKey2019',
        controller: 'did:3:kjzl6cwe1jw14acsxto0wvxwl62usq32y4ncfonzdmg5i5jorjcs2haniuabvzl',
        publicKeyBase58: 'thXhSaHPhtJNZaG2pJBYrQ8VChNzYhsFjqa7ALqhfBo',
      },
    ],
  },
  didDocumentMetadata: {
    created: '2021-06-21T08:51:40Z',
    nextUpdate: '2021-06-21T08:51:40Z',
    versionId: '0',
    nextVersionId: 'bafyreihoahs3ge57ud5kmvs76k2dhuu46fhpilo4r7lol6fuaxh7sxk5nm',
  },
}

const MIDDLE_DID = {
  didResolutionMetadata: {
    contentType: 'application/did+json',
  },
  didDocument: {
    id: 'did:3:kjzl6cwe1jw149rurqni4r064aht2apnbifrc29ghfqjm9nwdpiz6ixrcn6r4ap',
    verificationMethod: [
      {
        id: 'did:3:kjzl6cwe1jw149rurqni4r064aht2apnbifrc29ghfqjm9nwdpiz6ixrcn6r4ap#LWdQe5JCDFpay1B',
        type: 'EcdsaSecp256k1Signature2019',
        controller: 'did:3:kjzl6cwe1jw149rurqni4r064aht2apnbifrc29ghfqjm9nwdpiz6ixrcn6r4ap',
        publicKeyBase58: 'zozMio2pBH2q3yQtsGeXsrAmShHqAnU6UiKVtsahNV9T',
      },
      {
        id: 'did:3:kjzl6cwe1jw149rurqni4r064aht2apnbifrc29ghfqjm9nwdpiz6ixrcn6r4ap#cEQ4HAqRoZDyY9d',
        type: 'X25519KeyAgreementKey2019',
        controller: 'did:3:kjzl6cwe1jw149rurqni4r064aht2apnbifrc29ghfqjm9nwdpiz6ixrcn6r4ap',
        publicKeyBase58: '4uW4Zmu4zsQXmV2iKzJf8e4yWMLrY14FBJT9wLuhGANs',
      },
    ],
    authentication: [
      {
        id: 'did:3:kjzl6cwe1jw149rurqni4r064aht2apnbifrc29ghfqjm9nwdpiz6ixrcn6r4ap#LWdQe5JCDFpay1B',
        type: 'EcdsaSecp256k1Signature2019',
        controller: 'did:3:kjzl6cwe1jw149rurqni4r064aht2apnbifrc29ghfqjm9nwdpiz6ixrcn6r4ap',
        publicKeyBase58: 'zozMio2pBH2q3yQtsGeXsrAmShHqAnU6UiKVtsahNV9T',
      },
    ],
    keyAgreement: [
      {
        id: 'did:3:kjzl6cwe1jw149rurqni4r064aht2apnbifrc29ghfqjm9nwdpiz6ixrcn6r4ap#cEQ4HAqRoZDyY9d',
        type: 'X25519KeyAgreementKey2019',
        controller: 'did:3:kjzl6cwe1jw149rurqni4r064aht2apnbifrc29ghfqjm9nwdpiz6ixrcn6r4ap',
        publicKeyBase58: '4uW4Zmu4zsQXmV2iKzJf8e4yWMLrY14FBJT9wLuhGANs',
      },
    ],
  },
  didDocumentMetadata: {
    created: '2021-07-05T10:26:44Z',
    updated: '2021-07-05T10:26:44Z',
    versionId: 'bafyreiftn42zhr7kfmuocbkaetecbkpm7ju2xrearefcl2ualjfecgb22q',
  },
}

const VERSION_NEXT = {
  didResolutionMetadata: {
    contentType: 'application/did+json',
  },
  didDocument: {
    id: 'did:3:kjzl6cwe1jw1477tvctsul381s0u678qzcgb9cerv7zhkj0bu86fffouzy0ty2h',
    verificationMethod: [
      {
        id: 'did:3:kjzl6cwe1jw1477tvctsul381s0u678qzcgb9cerv7zhkj0bu86fffouzy0ty2h#og5wzYzKbo4nGuv',
        type: 'EcdsaSecp256k1Signature2019',
        controller: 'did:3:kjzl6cwe1jw1477tvctsul381s0u678qzcgb9cerv7zhkj0bu86fffouzy0ty2h',
        publicKeyBase58: '238Pd991McdsFdsMgS9LVHwXk5wvgVFdZ24oC2G7wZo4C',
      },
      {
        id: 'did:3:kjzl6cwe1jw1477tvctsul381s0u678qzcgb9cerv7zhkj0bu86fffouzy0ty2h#jUDpVbfg1xiBEQG',
        type: 'X25519KeyAgreementKey2019',
        controller: 'did:3:kjzl6cwe1jw1477tvctsul381s0u678qzcgb9cerv7zhkj0bu86fffouzy0ty2h',
        publicKeyBase58: 'FybNucu9qrK9fzm5TYMuPPGcdPs4T8J4wWszBZKBTrdW',
      },
    ],
    authentication: [
      {
        id: 'did:3:kjzl6cwe1jw1477tvctsul381s0u678qzcgb9cerv7zhkj0bu86fffouzy0ty2h#og5wzYzKbo4nGuv',
        type: 'EcdsaSecp256k1Signature2019',
        controller: 'did:3:kjzl6cwe1jw1477tvctsul381s0u678qzcgb9cerv7zhkj0bu86fffouzy0ty2h',
        publicKeyBase58: '238Pd991McdsFdsMgS9LVHwXk5wvgVFdZ24oC2G7wZo4C',
      },
    ],
    keyAgreement: [
      {
        id: 'did:3:kjzl6cwe1jw1477tvctsul381s0u678qzcgb9cerv7zhkj0bu86fffouzy0ty2h#jUDpVbfg1xiBEQG',
        type: 'X25519KeyAgreementKey2019',
        controller: 'did:3:kjzl6cwe1jw1477tvctsul381s0u678qzcgb9cerv7zhkj0bu86fffouzy0ty2h',
        publicKeyBase58: 'FybNucu9qrK9fzm5TYMuPPGcdPs4T8J4wWszBZKBTrdW',
      },
    ],
  },
  didDocumentMetadata: {
    created: '2021-06-21T10:24:46Z',
    updated: '2021-06-21T10:24:46Z',
    versionId: 'bafyreifmt2dvaluxiqqqj2v256cgyenhqns75ffec74tswo6y2q4xfvhji',
  },
}

// using: kid = did:3:kjzl6cwe1jw14acsxto0wvxwl62usq32y4ncfonzdmg5i5jorjcs2haniuabvzl?version-id=0#dkbnB3Dd1z5wByn
const jws =
  'eyJraWQiOiJkaWQ6MzpranpsNmN3ZTFqdzE0YWNzeHRvMHd2eHdsNjJ1c3EzMnk0bmNmb256ZG1nNWk1am9yamNzMmhhbml1YWJ2emw_dmVyc2lvbi1pZD0wI2RrYm5CM0RkMXo1d0J5biIsImFsZyI6IkVTMjU2SyJ9.eyJoZWxsbyI6IndvcmxkIn0._FMNUc83qOfNEyOUvpQs09CX12MbLEa90BIqa6qLw96VT2pec26gdlin5ozJ4veVgLbRrUBFCUUP2iLn6JtPhQ'

test('vanilla version 0', async () => {
  const did = new DID()
  did.resolve = () => Promise.resolve(VERSION_0_VANILLA)
  const { kid } = await did.verifyJWS(jws)
  expect(kid).toEqual(
    'did:3:kjzl6cwe1jw14acsxto0wvxwl62usq32y4ncfonzdmg5i5jorjcs2haniuabvzl?version-id=0#dkbnB3Dd1z5wByn'
  )
})

test('rotated key', async () => {
  const did = new DID()
  did.resolve = (didUrl) => {
    const isVersion0 = /version-id=0/.exec(didUrl)
    if (isVersion0) {
      return Promise.resolve(VERSION_0_ROTATED)
    } else {
      return Promise.resolve(VERSION_NEXT)
    }
  }
  await expect(did.verifyJWS(jws)).rejects.toThrow(/JWS was signed with a revoked DID version/)
})

describe('atTime', () => {
  const did = new DID()
  const fauxResolve = (didUrl: string) => {
    const isVersion0 = /version-id=0/.exec(didUrl)
    if (isVersion0) {
      return Promise.resolve(VERSION_0_ROTATED)
    } else {
      return Promise.resolve(VERSION_NEXT)
    }
  }
  beforeEach(() => {
    did.resolve = fauxResolve
  })

  test('ok before rotation', async () => {
    const beforeRotation = new Date('2021-06-21T08:20:46Z').valueOf()
    const { kid } = await did.verifyJWS(jws, { atTime: beforeRotation })
    expect(kid).toMatchSnapshot()
  })
  test('fail after rotation', async () => {
    const afterRotation = new Date('2021-06-22T10:20:46Z').valueOf()
    await expect(did.verifyJWS(jws, { atTime: afterRotation })).rejects.toThrow(
      /JWS was signed with a revoked DID version/
    )
  })

  test('before DID created', async () => {
    did.resolve = () => Promise.resolve(MIDDLE_DID)
    const beforeCreated = new Date('2021-07-01T00:00:00Z').valueOf()
    const jws =
      'eyJraWQiOiJkaWQ6MzpranpsNmN3ZTFqdzE0OXJ1cnFuaTRyMDY0YWh0MmFwbmJpZnJjMjlnaGZxam05bndkcGl6Nml4cmNuNnI0YXA_dmVyc2lvbi1pZD1iYWZ5cmVpZnRuNDJ6aHI3a2ZtdW9jYmthZXRlY2JrcG03anUyeHJlYXJlZmNsMnVhbGpmZWNnYjIycSNMV2RRZTVKQ0RGcGF5MUIiLCJhbGciOiJFUzI1NksifQ.eyJoZWxsbyI6IndvcmxkIn0.zXK7AKLADudA5UPBi4rgo1X3ZhMRT3wuWjZDfIwQ2VmB-Q7ZczXk8xJI-Wgv0K_YdDYmi5KslO9ObKCbe0fBmw'
    await expect(did.verifyJWS(jws, { atTime: beforeCreated })).rejects.toThrow(/not-yet created/)
  })
  test('before DID created for v0', async () => {
    const beforeCreation = new Date('2021-06-01T08:51:40Z').valueOf()
    const { kid } = await did.verifyJWS(jws, { atTime: beforeCreation })
    expect(kid).toMatchSnapshot()
  })
})
