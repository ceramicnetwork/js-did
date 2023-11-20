import { fromEip712, setupCanonicalizer } from '../../src/encoding/eip712.ts'
import * as uint8arrays from 'uint8arrays'

const testData = {
      "types": {
        "EIP712Domain": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "version",
            "type": "string"
          },
          {
            "name": "chainId",
            "type": "uint256"
          },
          {
            "name": "verifyingContract",
            "type": "address"
          }
        ],
        "Person": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "wallet",
            "type": "address"
          }
        ],
        "Mail": [
          {
            "name": "from",
            "type": "Person"
          },
          {
            "name": "to",
            "type": "Person"
          },
          {
            "name": "contents",
            "type": "string"
          },
          {
            "name": "attachment",
            "type": "bytes"
          }
        ]
      },
      "primaryType": "Mail",
      "domain": {
        "name": "Ether Mail",
        "version": "1",
        "chainId": 1,
        "verifyingContract": "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC"
      },
      "message": {
        "from": {
          "name": "Cow",
          "wallet": "0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826"
        },
        "to": {
          "name": "Bob",
          "wallet": "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB"
        },
        "contents": "Hello, Bob!",
        "attachment": "0xababababababababababa83459873459873459873498575986734359"
      }
    }

test('Encode eip712 message', async () => {
  const enc = fromEip712(testData)

  expect(enc.params.length).toEqual(196)
  expect(enc.node.attachment instanceof Uint8Array).toBeTruthy()
})

test('Canonicalize ipld eip712 object', async () => {
  const enc = fromEip712(testData)
  const res1 = setupCanonicalizer(enc.params)
  expect(res1.remainder.length).toEqual(0)
  expect(res1.params).toEqual({ types: testData.types, primaryType: testData.primaryType, domain: testData.domain })

  const testRemainder = new Uint8Array([1, 2, 3])
  const res2 = setupCanonicalizer(
    uint8arrays.concat([enc.params, testRemainder])
  )
  expect(res2.remainder.length).toEqual(testRemainder.length)
  expect(res2.remainder).toEqual(testRemainder)
  expect(res2.params).toEqual({ types: testData.types, primaryType: testData.primaryType, domain: testData.domain })
})
