import { fromEip712, setupCanonicalizer } from '../../src/encoding/eip712.ts'
import { BytesTape } from '../../src/bytes-tape.ts'
import * as uint8arrays from 'uint8arrays'
import { createWalletClient, custom } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'

const walletClient = createWalletClient({
  account: privateKeyToAccount('0x9727992a9c7d4e4b7c3b2d8d3c4b5b2e9d6e9c0a3a0e0d0c0b0a090807060504'),
  transport: custom({ request: async () => {}})
})

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
  },
  "signature": "0x0c095239e4d3d2cc0b7aa28110f42abcdefe47656bbde7048244471e701331ec3f94adfe7959b0ed0efec533d511f9e1e11b3e47242d82341870dc31fbc2146d1b"
}
const expectedHash = uint8arrays.fromString('703012a88c79c0ae106c7e0bd144d39d63304df1815e6d11b19189aff3dce0c4', 'base16')


test('Encode eip712 message', async () => {
  const node = fromEip712(testData)

  expect(node._sig.length).toEqual(268)
  expect(node.attachment instanceof Uint8Array).toBeTruthy()
  console.log(node)
})


test('Canonicalize ipld eip712 object', async () => {
  const node = fromEip712(testData)
  const tape = new BytesTape(node._sig)
  tape.readVarint() // skip sigil
  tape.readVarint() // skip key type
  tape.read(1) // skip recovery bit
  tape.readVarint() // skip hash type
  tape.readVarint() // skip canonicalizer codec
  const can1 = setupCanonicalizer(tape.remainder)
  expect(can1.remainder.length).toEqual(64)
  delete node._sig
  delete testData.signature
  const res1 = can1.canonicalize(node)
  expect(res1.decoded).toEqual(testData)
  expect(res1.digest).toEqual(expectedHash)
})

test('Generate test vectors', async () => {
  const signature = await walletClient.signTypedData(testData)
  console.log('sig', signature)
})
