import { DID } from '../did'

// Using authSecret: `sha256.hash(uint8arrays.fromString(`HELLOWORLD`));

const VERSION_0_VANILLA = {
  didResolutionMetadata: {
    contentType: 'application/did+json',
  },
  didDocument: {
    id: 'did:3:kjzl6cwe1jw146yuapa8cizijrc49janatf1g6dns5rzxef09zqee7zzzq90ftr',
    verificationMethod: [
      {
        id: 'did:3:kjzl6cwe1jw146yuapa8cizijrc49janatf1g6dns5rzxef09zqee7zzzq90ftr#AdUB2e27TjdFwth',
        type: 'X25519KeyAgreementKey2019',
        controller: 'did:3:kjzl6cwe1jw146yuapa8cizijrc49janatf1g6dns5rzxef09zqee7zzzq90ftr',
        publicKeyBase58: '6wbGfRTmgTcnjTEHq6Wdg3AX2W8NKZTKJ3vLd166Ya7w',
      },
      {
        id: 'did:3:kjzl6cwe1jw146yuapa8cizijrc49janatf1g6dns5rzxef09zqee7zzzq90ftr#vwgkzudRSEdS2dW',
        type: 'EcdsaSecp256k1Signature2019',
        controller: 'did:3:kjzl6cwe1jw146yuapa8cizijrc49janatf1g6dns5rzxef09zqee7zzzq90ftr',
        publicKeyBase58: '2BQp6zUiYQCEFP7Aaph6vm9vYNXAndNu9q59q86ZWDYmn',
      },
    ],
    authentication: [
      {
        id: 'did:3:kjzl6cwe1jw146yuapa8cizijrc49janatf1g6dns5rzxef09zqee7zzzq90ftr#vwgkzudRSEdS2dW',
        type: 'EcdsaSecp256k1Signature2019',
        controller: 'did:3:kjzl6cwe1jw146yuapa8cizijrc49janatf1g6dns5rzxef09zqee7zzzq90ftr',
        publicKeyBase58: '2BQp6zUiYQCEFP7Aaph6vm9vYNXAndNu9q59q86ZWDYmn',
      },
    ],
    keyAgreement: [
      {
        id: 'did:3:kjzl6cwe1jw146yuapa8cizijrc49janatf1g6dns5rzxef09zqee7zzzq90ftr#AdUB2e27TjdFwth',
        type: 'X25519KeyAgreementKey2019',
        controller: 'did:3:kjzl6cwe1jw146yuapa8cizijrc49janatf1g6dns5rzxef09zqee7zzzq90ftr',
        publicKeyBase58: '6wbGfRTmgTcnjTEHq6Wdg3AX2W8NKZTKJ3vLd166Ya7w',
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
    id: 'did:3:kjzl6cwe1jw146yuapa8cizijrc49janatf1g6dns5rzxef09zqee7zzzq90ftr',
    verificationMethod: [
      {
        id: 'did:3:kjzl6cwe1jw146yuapa8cizijrc49janatf1g6dns5rzxef09zqee7zzzq90ftr#AdUB2e27TjdFwth',
        type: 'X25519KeyAgreementKey2019',
        controller: 'did:3:kjzl6cwe1jw146yuapa8cizijrc49janatf1g6dns5rzxef09zqee7zzzq90ftr',
        publicKeyBase58: '6wbGfRTmgTcnjTEHq6Wdg3AX2W8NKZTKJ3vLd166Ya7w',
      },
      {
        id: 'did:3:kjzl6cwe1jw146yuapa8cizijrc49janatf1g6dns5rzxef09zqee7zzzq90ftr#vwgkzudRSEdS2dW',
        type: 'EcdsaSecp256k1Signature2019',
        controller: 'did:3:kjzl6cwe1jw146yuapa8cizijrc49janatf1g6dns5rzxef09zqee7zzzq90ftr',
        publicKeyBase58: '2BQp6zUiYQCEFP7Aaph6vm9vYNXAndNu9q59q86ZWDYmn',
      },
    ],
    authentication: [
      {
        id: 'did:3:kjzl6cwe1jw146yuapa8cizijrc49janatf1g6dns5rzxef09zqee7zzzq90ftr#vwgkzudRSEdS2dW',
        type: 'EcdsaSecp256k1Signature2019',
        controller: 'did:3:kjzl6cwe1jw146yuapa8cizijrc49janatf1g6dns5rzxef09zqee7zzzq90ftr',
        publicKeyBase58: '2BQp6zUiYQCEFP7Aaph6vm9vYNXAndNu9q59q86ZWDYmn',
      },
    ],
    keyAgreement: [
      {
        id: 'did:3:kjzl6cwe1jw146yuapa8cizijrc49janatf1g6dns5rzxef09zqee7zzzq90ftr#AdUB2e27TjdFwth',
        type: 'X25519KeyAgreementKey2019',
        controller: 'did:3:kjzl6cwe1jw146yuapa8cizijrc49janatf1g6dns5rzxef09zqee7zzzq90ftr',
        publicKeyBase58: '6wbGfRTmgTcnjTEHq6Wdg3AX2W8NKZTKJ3vLd166Ya7w',
      },
    ],
  },
  didDocumentMetadata: {
    nextUpdate: '2021-07-07T07:32:28Z',
    versionId: '0',
    nextVersionId: 'bafyreicveiixaitvrpocrgljdjw7ed3syp7b6evxcz4yzwwqaxnbn7tq2a',
  },
}

const VERSION_NEXT = {
  didResolutionMetadata: {
    contentType: 'application/did+json',
  },
  didDocument: {
    id: 'did:3:kjzl6cwe1jw146yuapa8cizijrc49janatf1g6dns5rzxef09zqee7zzzq90ftr',
    verificationMethod: [
      {
        id: 'did:3:kjzl6cwe1jw146yuapa8cizijrc49janatf1g6dns5rzxef09zqee7zzzq90ftr#Yu1U6tjUoVTM9tX',
        type: 'EcdsaSecp256k1Signature2019',
        controller: 'did:3:kjzl6cwe1jw146yuapa8cizijrc49janatf1g6dns5rzxef09zqee7zzzq90ftr',
        publicKeyBase58: 'oJn8JX1LJKBmo4xy8bwRJjtAfbqm6zrUYB8wBTpL8g2o',
      },
      {
        id: 'did:3:kjzl6cwe1jw146yuapa8cizijrc49janatf1g6dns5rzxef09zqee7zzzq90ftr#MuzBPi9UD4cdq5q',
        type: 'X25519KeyAgreementKey2019',
        controller: 'did:3:kjzl6cwe1jw146yuapa8cizijrc49janatf1g6dns5rzxef09zqee7zzzq90ftr',
        publicKeyBase58: '45ii3puWe41GYUVbAw2KQjxAwcrRokjqJQzTykR5vTK5',
      },
    ],
    authentication: [
      {
        id: 'did:3:kjzl6cwe1jw146yuapa8cizijrc49janatf1g6dns5rzxef09zqee7zzzq90ftr#Yu1U6tjUoVTM9tX',
        type: 'EcdsaSecp256k1Signature2019',
        controller: 'did:3:kjzl6cwe1jw146yuapa8cizijrc49janatf1g6dns5rzxef09zqee7zzzq90ftr',
        publicKeyBase58: 'oJn8JX1LJKBmo4xy8bwRJjtAfbqm6zrUYB8wBTpL8g2o',
      },
    ],
    keyAgreement: [
      {
        id: 'did:3:kjzl6cwe1jw146yuapa8cizijrc49janatf1g6dns5rzxef09zqee7zzzq90ftr#MuzBPi9UD4cdq5q',
        type: 'X25519KeyAgreementKey2019',
        controller: 'did:3:kjzl6cwe1jw146yuapa8cizijrc49janatf1g6dns5rzxef09zqee7zzzq90ftr',
        publicKeyBase58: '45ii3puWe41GYUVbAw2KQjxAwcrRokjqJQzTykR5vTK5',
      },
    ],
  },
  didDocumentMetadata: {
    updated: '2021-07-07T07:32:28Z',
    versionId: 'bafyreicveiixaitvrpocrgljdjw7ed3syp7b6evxcz4yzwwqaxnbn7tq2a',
  },
}

// using: kid = did:3:kjzl6cwe1jw146yuapa8cizijrc49janatf1g6dns5rzxef09zqee7zzzq90ftr?version-id=0#vwgkzudRSEdS2dW
const jws =
  'eyJraWQiOiJkaWQ6MzpranpsNmN3ZTFqdzE0Nnl1YXBhOGNpemlqcmM0OWphbmF0ZjFnNmRuczVyenhlZjA5enFlZTd6enpxOTBmdHI_dmVyc2lvbi1pZD0wI3Z3Z2t6dWRSU0VkUzJkVyIsImFsZyI6IkVTMjU2SyJ9.eyJoZWxsbyI6IndvcmxkIn0.wLQ9QTfXRJe4stVzgOb6rXh6l913vycklrWoppcUkI888-B4o7jqlSxsQDBpEfDLqSr52A8wjV9TQmKqZ_qOHw'

test('vanilla version 0', async () => {
  const did = new DID()
  did.resolve = () => Promise.resolve(VERSION_0_VANILLA)
  const { kid } = await did.verifyJWS(jws)
  expect(kid).toEqual(
    'did:3:kjzl6cwe1jw146yuapa8cizijrc49janatf1g6dns5rzxef09zqee7zzzq90ftr?version-id=0#vwgkzudRSEdS2dW'
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
    const afterRotation = new Date('2021-07-07T07:40:28Z').valueOf()
    await expect(did.verifyJWS(jws, { atTime: afterRotation })).rejects.toThrow(
      /JWS was signed with a revoked DID version/
    )
  })

  test('before DID version available', async () => {
    did.resolve = () => Promise.resolve(VERSION_NEXT)
    const beforeCreated = new Date('2021-07-01T00:00:00Z').valueOf()
    // Have lost keys for the old DID, so here is a new one.
    const jws =
      'eyJraWQiOiJkaWQ6MzpranpsNmN3ZTFqdzE0OXJ1cnFuaTRyMDY0YWh0MmFwbmJpZnJjMjlnaGZxam05bndkcGl6Nml4cmNuNnI0YXA_dmVyc2lvbi1pZD1iYWZ5cmVpZnRuNDJ6aHI3a2ZtdW9jYmthZXRlY2JrcG03anUyeHJlYXJlZmNsMnVhbGpmZWNnYjIycSNMV2RRZTVKQ0RGcGF5MUIiLCJhbGciOiJFUzI1NksifQ.eyJoZWxsbyI6IndvcmxkIn0.zXK7AKLADudA5UPBi4rgo1X3ZhMRT3wuWjZDfIwQ2VmB-Q7ZczXk8xJI-Wgv0K_YdDYmi5KslO9ObKCbe0fBmw'
    await expect(did.verifyJWS(jws, { atTime: beforeCreated })).rejects.toThrow(/not-yet created/)
  })
  test('before DID available for v0', async () => {
    const beforeCreation = new Date('2021-06-01T08:51:40Z').valueOf()
    const { kid } = await did.verifyJWS(jws, { atTime: beforeCreation })
    expect(kid).toMatchSnapshot()
  })
})
