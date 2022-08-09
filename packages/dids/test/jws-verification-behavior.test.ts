import { jest } from '@jest/globals'
import { DID } from '../src/did.js'

const VERSION_0_VANILLA = {
  didResolutionMetadata: {
    contentType: 'application/did+json',
  },
  didDocument: {
    id: 'did:3:kjzl6cwe1jw14ah8wjy8grgzl52sl18sbyirgi9bqy9yzu28kbxvjmhip99r14k',
    verificationMethod: [
      {
        id: 'did:3:kjzl6cwe1jw14ah8wjy8grgzl52sl18sbyirgi9bqy9yzu28kbxvjmhip99r14k#7wYNHm3nGoNA3Kv',
        type: 'EcdsaSecp256k1Signature2019',
        controller: 'did:3:kjzl6cwe1jw14ah8wjy8grgzl52sl18sbyirgi9bqy9yzu28kbxvjmhip99r14k',
        publicKeyBase58: '2BS946XE3ZGDEsFSq5G3ndodLnAz2TZu1SN1FUw8EwZUC',
      },
      {
        id: 'did:3:kjzl6cwe1jw14ah8wjy8grgzl52sl18sbyirgi9bqy9yzu28kbxvjmhip99r14k#ATBW8KGCmgnXaKR',
        type: 'X25519KeyAgreementKey2019',
        controller: 'did:3:kjzl6cwe1jw14ah8wjy8grgzl52sl18sbyirgi9bqy9yzu28kbxvjmhip99r14k',
        publicKeyBase58: 'HZCZPM7PzCGow5WxopEKeQaKNGQgsZH2d9baiK3FpCYf',
      },
    ],
    authentication: [
      {
        id: 'did:3:kjzl6cwe1jw14ah8wjy8grgzl52sl18sbyirgi9bqy9yzu28kbxvjmhip99r14k#7wYNHm3nGoNA3Kv',
        type: 'EcdsaSecp256k1Signature2019',
        controller: 'did:3:kjzl6cwe1jw14ah8wjy8grgzl52sl18sbyirgi9bqy9yzu28kbxvjmhip99r14k',
        publicKeyBase58: '2BS946XE3ZGDEsFSq5G3ndodLnAz2TZu1SN1FUw8EwZUC',
      },
    ],
    keyAgreement: [
      {
        id: 'did:3:kjzl6cwe1jw14ah8wjy8grgzl52sl18sbyirgi9bqy9yzu28kbxvjmhip99r14k#ATBW8KGCmgnXaKR',
        type: 'X25519KeyAgreementKey2019',
        controller: 'did:3:kjzl6cwe1jw14ah8wjy8grgzl52sl18sbyirgi9bqy9yzu28kbxvjmhip99r14k',
        publicKeyBase58: 'HZCZPM7PzCGow5WxopEKeQaKNGQgsZH2d9baiK3FpCYf',
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
    id: 'did:3:kjzl6cwe1jw14ah8wjy8grgzl52sl18sbyirgi9bqy9yzu28kbxvjmhip99r14k',
    verificationMethod: [
      {
        id: 'did:3:kjzl6cwe1jw14ah8wjy8grgzl52sl18sbyirgi9bqy9yzu28kbxvjmhip99r14k#7wYNHm3nGoNA3Kv',
        type: 'EcdsaSecp256k1Signature2019',
        controller: 'did:3:kjzl6cwe1jw14ah8wjy8grgzl52sl18sbyirgi9bqy9yzu28kbxvjmhip99r14k',
        publicKeyBase58: '2BS946XE3ZGDEsFSq5G3ndodLnAz2TZu1SN1FUw8EwZUC',
      },
      {
        id: 'did:3:kjzl6cwe1jw14ah8wjy8grgzl52sl18sbyirgi9bqy9yzu28kbxvjmhip99r14k#ATBW8KGCmgnXaKR',
        type: 'X25519KeyAgreementKey2019',
        controller: 'did:3:kjzl6cwe1jw14ah8wjy8grgzl52sl18sbyirgi9bqy9yzu28kbxvjmhip99r14k',
        publicKeyBase58: 'HZCZPM7PzCGow5WxopEKeQaKNGQgsZH2d9baiK3FpCYf',
      },
    ],
    authentication: [
      {
        id: 'did:3:kjzl6cwe1jw14ah8wjy8grgzl52sl18sbyirgi9bqy9yzu28kbxvjmhip99r14k#7wYNHm3nGoNA3Kv',
        type: 'EcdsaSecp256k1Signature2019',
        controller: 'did:3:kjzl6cwe1jw14ah8wjy8grgzl52sl18sbyirgi9bqy9yzu28kbxvjmhip99r14k',
        publicKeyBase58: '2BS946XE3ZGDEsFSq5G3ndodLnAz2TZu1SN1FUw8EwZUC',
      },
    ],
    keyAgreement: [
      {
        id: 'did:3:kjzl6cwe1jw14ah8wjy8grgzl52sl18sbyirgi9bqy9yzu28kbxvjmhip99r14k#ATBW8KGCmgnXaKR',
        type: 'X25519KeyAgreementKey2019',
        controller: 'did:3:kjzl6cwe1jw14ah8wjy8grgzl52sl18sbyirgi9bqy9yzu28kbxvjmhip99r14k',
        publicKeyBase58: 'HZCZPM7PzCGow5WxopEKeQaKNGQgsZH2d9baiK3FpCYf',
      },
    ],
  },
  didDocumentMetadata: {
    nextUpdate: '2021-07-07T08:12:19Z',
    versionId: '0',
    nextVersionId: 'bafyreiebh2rwia4qq5v43dqlnofkczsvoghdxymahv4p5lkp5ivr5kgatm',
  },
}

const VERSION_NEXT = {
  didResolutionMetadata: {
    contentType: 'application/did+json',
  },
  didDocument: {
    id: 'did:3:kjzl6cwe1jw14ah8wjy8grgzl52sl18sbyirgi9bqy9yzu28kbxvjmhip99r14k',
    verificationMethod: [
      {
        id: 'did:3:kjzl6cwe1jw14ah8wjy8grgzl52sl18sbyirgi9bqy9yzu28kbxvjmhip99r14k#C26y2DZeJ9EMYsF',
        type: 'EcdsaSecp256k1Signature2019',
        controller: 'did:3:kjzl6cwe1jw14ah8wjy8grgzl52sl18sbyirgi9bqy9yzu28kbxvjmhip99r14k',
        publicKeyBase58: 'vTcTTxzsSsAiqTb9EH7tC13gG1Dfkdya36TmLxU7951X',
      },
      {
        id: 'did:3:kjzl6cwe1jw14ah8wjy8grgzl52sl18sbyirgi9bqy9yzu28kbxvjmhip99r14k#sfecbasdBzBfhcb',
        type: 'X25519KeyAgreementKey2019',
        controller: 'did:3:kjzl6cwe1jw14ah8wjy8grgzl52sl18sbyirgi9bqy9yzu28kbxvjmhip99r14k',
        publicKeyBase58: 'H1s1bgxnxZPdhF2ZXqACwi3QxPCsZGVVjcsC8jLexKqq',
      },
    ],
    authentication: [
      {
        id: 'did:3:kjzl6cwe1jw14ah8wjy8grgzl52sl18sbyirgi9bqy9yzu28kbxvjmhip99r14k#C26y2DZeJ9EMYsF',
        type: 'EcdsaSecp256k1Signature2019',
        controller: 'did:3:kjzl6cwe1jw14ah8wjy8grgzl52sl18sbyirgi9bqy9yzu28kbxvjmhip99r14k',
        publicKeyBase58: 'vTcTTxzsSsAiqTb9EH7tC13gG1Dfkdya36TmLxU7951X',
      },
    ],
    keyAgreement: [
      {
        id: 'did:3:kjzl6cwe1jw14ah8wjy8grgzl52sl18sbyirgi9bqy9yzu28kbxvjmhip99r14k#sfecbasdBzBfhcb',
        type: 'X25519KeyAgreementKey2019',
        controller: 'did:3:kjzl6cwe1jw14ah8wjy8grgzl52sl18sbyirgi9bqy9yzu28kbxvjmhip99r14k',
        publicKeyBase58: 'H1s1bgxnxZPdhF2ZXqACwi3QxPCsZGVVjcsC8jLexKqq',
      },
    ],
  },
  didDocumentMetadata: {
    updated: '2021-07-07T08:12:19Z',
    versionId: 'bafyreiebh2rwia4qq5v43dqlnofkczsvoghdxymahv4p5lkp5ivr5kgatm',
  },
}

const COMPOSITE_ISSUER_EMPTY = {
  didResolutionMetadata: {
    contentType: 'application/did+json',
  },
  didDocument: {
    id: 'did:composite:foo',
    controller: [],
  },
  didDocumentMetadata: {},
}

// v0: did:3:kjzl6cwe1jw14ah8wjy8grgzl52sl18sbyirgi9bqy9yzu28kbxvjmhip99r14k?version-id=0#7wYNHm3nGoNA3Kv
const jwsV0 =
  'eyJraWQiOiJkaWQ6MzpranpsNmN3ZTFqdzE0YWg4d2p5OGdyZ3psNTJzbDE4c2J5aXJnaTlicXk5eXp1MjhrYnh2am1oaXA5OXIxNGs_dmVyc2lvbi1pZD0wIzd3WU5IbTNuR29OQTNLdiIsImFsZyI6IkVTMjU2SyJ9.eyJoZWxsbyI6IndvcmxkIn0.cHVXU7QW2pvBJpVIBCLhnkCQ0k4Up3cNRqiyeryRbPOSrZdAoQmWy1OfzNFzgY90nol26KJxHWnknSyu5sY__Q'
// vNext: did:3:kjzl6cwe1jw14ah8wjy8grgzl52sl18sbyirgi9bqy9yzu28kbxvjmhip99r14k?version-id=bafyreiebh2rwia4qq5v43dqlnofkczsvoghdxymahv4p5lkp5ivr5kgatm#C26y2DZeJ9EMYsF
const jwsVNext =
  'eyJraWQiOiJkaWQ6MzpranpsNmN3ZTFqdzE0YWg4d2p5OGdyZ3psNTJzbDE4c2J5aXJnaTlicXk5eXp1MjhrYnh2am1oaXA5OXIxNGs_dmVyc2lvbi1pZD1iYWZ5cmVpZWJoMnJ3aWE0cXE1djQzZHFsbm9ma2N6c3ZvZ2hkeHltYWh2NHA1bGtwNWl2cjVrZ2F0bSNDMjZ5MkRaZUo5RU1Zc0YiLCJhbGciOiJFUzI1NksifQ.eyJoZWxsbyI6IndvcmxkIn0.GRKdQMwbGw5t8Q_8asCV88jofZhJaPZlLs82-E_DvNLwfRBR8_Sbt_GwHPqdghA9oSN3XrTsI9KlKjwf8G6sew'

test('vanilla version 0', async () => {
  const did = new DID()
  did.resolve = () => Promise.resolve(VERSION_0_VANILLA)
  const { kid } = await did.verifyJWS(jwsV0)
  expect(kid).toEqual(
    'did:3:kjzl6cwe1jw14ah8wjy8grgzl52sl18sbyirgi9bqy9yzu28kbxvjmhip99r14k?version-id=0#7wYNHm3nGoNA3Kv'
  )
})

describe('rotatedKey', () => {
  const did = new DID()
  did.resolve = (didUrl) => {
    const isVersion0 = /version-id=0/.exec(didUrl)
    if (isVersion0) {
      return Promise.resolve(VERSION_0_ROTATED)
    } else {
      return Promise.resolve(VERSION_NEXT)
    }
  }

  test('throw', async () => {
    await expect(did.verifyJWS(jwsV0)).rejects.toThrow(
      /invalid_jws: signature authored with a revoked DID version/
    )
  })

  test('pass if timecheck disabled', async () => {
    await expect(did.verifyJWS(jwsV0, { disableTimecheck: true })).resolves.toBeTruthy()
  })
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

  const beforeRotation = new Date('2021-07-07T08:00:19Z')
  const afterRotation = new Date('2021-07-07T08:40:19Z')
  const timeKeysRotatedInSec = Math.floor(
    new Date(VERSION_0_ROTATED.didDocumentMetadata.nextUpdate).valueOf() / 1000
  )

  test('ok before rotation', async () => {
    const { kid } = await did.verifyJWS(jwsV0, { atTime: beforeRotation })
    expect(kid).toMatchSnapshot()
  })
  test('fail after rotation', async () => {
    await expect(did.verifyJWS(jwsV0, { atTime: afterRotation })).rejects.toThrow(
      /invalid_jws: signature authored with a revoked DID version/
    )
  })
  test('ok after rotation if timecheck disabled', async () => {
    await expect(
      did.verifyJWS(jwsV0, { atTime: afterRotation, disableTimecheck: true })
    ).resolves.toBeTruthy()
  })
  test('ok after rotation if within revocation phase out period', async () => {
    // values in s
    const revocationPhaseOutSecs = 10
    const afterRotationBeforePhaseOut = timeKeysRotatedInSec + revocationPhaseOutSecs - 1

    await expect(
      did.verifyJWS(jwsV0, {
        atTime: new Date(afterRotationBeforePhaseOut * 1000),
        revocationPhaseOutSecs,
      })
    ).resolves.toBeTruthy()
  })
  test('fail after rotation if not within revocation phase out period', async () => {
    // values in s
    const revocationPhaseOutSecs = 10
    const afterRotationAfterPhaseOut = timeKeysRotatedInSec + revocationPhaseOutSecs

    await expect(
      did.verifyJWS(jwsV0, {
        atTime: new Date(afterRotationAfterPhaseOut * 1000),
        revocationPhaseOutSecs,
      })
    ).rejects.toThrow(/invalid_jws: signature authored with a revoked DID version/)
  })

  test('before DID version available', async () => {
    did.resolve = () => Promise.resolve(VERSION_NEXT)
    await expect(did.verifyJWS(jwsVNext, { atTime: beforeRotation })).rejects.toThrow(
      /invalid_jws: signature authored before creation/
    )
  })
  test('before DID version available if timecheck disabled', async () => {
    did.resolve = () => Promise.resolve(VERSION_NEXT)
    // Have lost keys for the old DID, so here is a new one.
    await expect(
      did.verifyJWS(jwsVNext, { atTime: beforeRotation, disableTimecheck: true })
    ).resolves.toBeTruthy()
  })
  test('before DID available for v0', async () => {
    const { kid } = await did.verifyJWS(jwsV0, { atTime: beforeRotation })
    expect(kid).toMatchSnapshot()
  })
})

describe('issuer', () => {
  const SIGNER_DID = VERSION_0_VANILLA.didDocument.id
  const did = new DID()

  beforeEach(() => {
    did.resolve = jest.fn((didUrl: string) => {
      if (didUrl === COMPOSITE_ISSUER_EMPTY.didDocument.id) {
        return Promise.resolve(COMPOSITE_ISSUER_EMPTY)
      }
      return Promise.resolve(VERSION_0_VANILLA)
    })
  })

  test('same as signer', async () => {
    const { kid } = await did.verifyJWS(jwsV0, { issuer: SIGNER_DID })
    expect(kid).toMatchSnapshot()
  })
  test('includes signer as controller', async () => {
    const fauxResolve = jest.fn((didUrl: string) => {
      if (didUrl === COMPOSITE_ISSUER_EMPTY.didDocument.id) {
        const included = {
          ...COMPOSITE_ISSUER_EMPTY,
          didDocument: {
            ...COMPOSITE_ISSUER_EMPTY.didDocument,
            controller: [SIGNER_DID],
          },
        }
        return Promise.resolve(included)
      }
      return Promise.resolve(VERSION_0_VANILLA)
    })
    did.resolve = fauxResolve
    const issuer = COMPOSITE_ISSUER_EMPTY.didDocument.id
    const { kid } = await did.verifyJWS(jwsV0, { issuer: issuer })
    expect(kid).toMatchSnapshot()
    expect(fauxResolve).toBeCalledWith(issuer)
  })
  test('does not include signer as controller', async () => {
    const issuer = COMPOSITE_ISSUER_EMPTY.didDocument.id
    await expect(did.verifyJWS(jwsV0, { issuer: issuer })).rejects.toThrow(
      /invalid_jws: not a valid verificationMethod for issuer/
    )
  })
})
