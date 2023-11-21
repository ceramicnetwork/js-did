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
const expectedHash = uint8arrays.fromString('703012a88c79c0ae106c7e0bd144d39d63304df1815e6d11b19189aff3dce0c4', 'base16')


test('Encode eip712 message', async () => {
  const enc = fromEip712(testData)

  expect(enc.params.length).toEqual(196)
  expect(enc.node.attachment instanceof Uint8Array).toBeTruthy()
  console.log(enc.node)
})

test('Canonicalize ipld eip712 object', async () => {
  const enc = fromEip712(testData)
  const can1 = setupCanonicalizer(enc.params)
  expect(can1.remainder.length).toEqual(0)
  const res1 = can1.canonicalize(enc.node)
  expect(res1.decoded).toEqual(testData)
  expect(res1.digest).toEqual(expectedHash)

  // extra remainder should not affect parsing
  const testRemainder = new Uint8Array([1, 2, 3])
  const can2 = setupCanonicalizer(
    uint8arrays.concat([enc.params, testRemainder])
  )
  expect(can2.remainder.length).toEqual(testRemainder.length)
  expect(can2.remainder).toEqual(testRemainder)
  const res2 = can2.canonicalize(enc.node)
  expect(res2.decoded).toEqual(testData)
  expect(res2.digest).toEqual(expectedHash)
})
