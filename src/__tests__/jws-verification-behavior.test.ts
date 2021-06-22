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

test('vanilla version 0', async () => {
  const did = new DID()
  did.resolve = () => Promise.resolve(VERSION_0_VANILLA)
  // using: kid = did:3:kjzl6cwe1jw14acsxto0wvxwl62usq32y4ncfonzdmg5i5jorjcs2haniuabvzl?version-id=0#dkbnB3Dd1z5wByn
  const jws =
    'eyJraWQiOiJkaWQ6MzpranpsNmN3ZTFqdzE0YWNzeHRvMHd2eHdsNjJ1c3EzMnk0bmNmb256ZG1nNWk1am9yamNzMmhhbml1YWJ2emw_dmVyc2lvbi1pZD0wI2RrYm5CM0RkMXo1d0J5biIsImFsZyI6IkVTMjU2SyJ9.eyJoZWxsbyI6IndvcmxkIn0._FMNUc83qOfNEyOUvpQs09CX12MbLEa90BIqa6qLw96VT2pec26gdlin5ozJ4veVgLbRrUBFCUUP2iLn6JtPhQ'
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
  // using: kid = did:3:kjzl6cwe1jw14acsxto0wvxwl62usq32y4ncfonzdmg5i5jorjcs2haniuabvzl?version-id=0#dkbnB3Dd1z5wByn
  const jws =
    'eyJraWQiOiJkaWQ6MzpranpsNmN3ZTFqdzE0YWNzeHRvMHd2eHdsNjJ1c3EzMnk0bmNmb256ZG1nNWk1am9yamNzMmhhbml1YWJ2emw_dmVyc2lvbi1pZD0wI2RrYm5CM0RkMXo1d0J5biIsImFsZyI6IkVTMjU2SyJ9.eyJoZWxsbyI6IndvcmxkIn0._FMNUc83qOfNEyOUvpQs09CX12MbLEa90BIqa6qLw96VT2pec26gdlin5ozJ4veVgLbRrUBFCUUP2iLn6JtPhQ'
  await expect(did.verifyJWS(jws)).rejects.toThrow(/JWS was signed with a revoked DID version/)
})

describe('atTime', () => {
  const did = new DID()
  did.resolve = (didUrl) => {
    const isVersion0 = /version-id=0/.exec(didUrl)
    if (isVersion0) {
      return Promise.resolve(VERSION_0_ROTATED)
    } else {
      return Promise.resolve(VERSION_NEXT)
    }
  }

  const jws =
    'eyJraWQiOiJkaWQ6MzpranpsNmN3ZTFqdzE0YWNzeHRvMHd2eHdsNjJ1c3EzMnk0bmNmb256ZG1nNWk1am9yamNzMmhhbml1YWJ2emw_dmVyc2lvbi1pZD0wI2RrYm5CM0RkMXo1d0J5biIsImFsZyI6IkVTMjU2SyJ9.eyJoZWxsbyI6IndvcmxkIn0._FMNUc83qOfNEyOUvpQs09CX12MbLEa90BIqa6qLw96VT2pec26gdlin5ozJ4veVgLbRrUBFCUUP2iLn6JtPhQ'

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
})
