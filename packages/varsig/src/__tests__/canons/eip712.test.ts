import { fromEip712, prepareCanonicalization } from '../../canons/eip712.js'
import { BytesTape } from '../../bytes-tape.js'
import * as uint8arrays from 'uint8arrays'
import { privateKeyToAccount } from 'viem/accounts'
import * as fs from 'node:fs'
import { pipeline } from 'node:stream/promises'
import { CARFactory, type CAR } from 'cartonne'
import { CanonicalizationKind } from '../../canonicalization.js'

const account = privateKeyToAccount(
  '0x9727992a9c7d4e4b7c3b2d8d3c4b5b2e9d6e9c0a3a0e0d0c0b0a090807060504'
)

const testData = {
  types: {
    EIP712Domain: [
      { name: 'name', type: 'string' },
      { name: 'version', type: 'string' },
      { name: 'chainId', type: 'uint256' },
      { name: 'verifyingContract', type: 'address' },
    ],
    Person: [
      { name: 'name', type: 'string' },
      { name: 'wallet', type: 'address' },
    ],
    Mail: [
      { name: 'from', type: 'Person' },
      { name: 'to', type: 'Person' },
      { name: 'contents', type: 'string' },
      { name: 'attachment', type: 'bytes' },
    ],
  },
  primaryType: 'Mail',
  domain: {
    name: 'Ether Mail',
    version: '1',
    chainId: 1,
    verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
  },
  message: {
    from: {
      name: 'Cow',
      wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
    },
    to: {
      name: 'Bob',
      wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
    },
    contents: 'Hello, Bob!',
    attachment: '0xababababababababababa83459873459873459873498575986734359',
  },
  signature:
    '0x0c095239e4d3d2cc0b7aa28110f42abcdefe47656bbde7048244471e701331ec3f94adfe7959b0ed0efec533d511f9e1e11b3e47242d82341870dc31fbc2146d1b',
} as const

const expectedHash = uint8arrays.fromString(
  '703012a88c79c0ae106c7e0bd144d39d63304df1815e6d11b19189aff3dce0c4',
  'base16'
)

const easData = {
  domain: {
    name: 'EAS Attestation',
    version: '0.26',
    chainId: 1,
    verifyingContract: '0xA1207F3BBa224E2c9c3c6D5aF63D0eb1582Ce587',
  },
  primaryType: 'Attest',
  message: {
    schema: '0xc59265615401143689cbfe73046a922c975c99d97e4c248070435b1104b2dea7',
    recipient: '0x17640d0D8C93bF710b6Ee4208997BB727B5B7bc2',
    refUID: '0x0000000000000000000000000000000000000000000000000000000000000000',
    data: '0x0000000000000000000000000000000000000000000000000000000000000001',
    time: 1699288761,
    revocable: true,
    expirationTime: 0,
    version: 1,
  },
  types: {
    Attest: [
      { name: 'version', type: 'uint16' },
      { name: 'schema', type: 'bytes32' },
      { name: 'recipient', type: 'address' },
      { name: 'time', type: 'uint64' },
      { name: 'expirationTime', type: 'uint64' },
      { name: 'revocable', type: 'bool' },
      { name: 'refUID', type: 'bytes32' },
      { name: 'data', type: 'bytes' },
    ],
  },
  signature: {
    v: 27,
    r: '0x65f777899dddd381d138eb0e1350071a6bcb6430a3a58c1c232eaf5db4292af7',
    s: '0x7f225138ccfc901f85d4dc88bd199de57f13fc144272ba75b5459a2a14629b1e',
  },
}

test('Encode eip712 message', () => {
  // @ts-ignore
  const node = fromEip712(testData)

  expect(node._sig.length).toEqual(268)
  expect(node.attachment instanceof Uint8Array).toBeTruthy()
})

test('Canonicalize ipld eip712 object', () => {
  // @ts-ignore
  const node = fromEip712(testData)
  const tape = new BytesTape(node._sig)
  tape.readVarint() // skip sigil
  tape.readVarint() // skip key type
  tape.read(1) // skip recovery bit
  tape.readVarint() // skip hash type
  tape.readVarint() // skip canonicalizer codec
  const can = prepareCanonicalization(tape, 0x1b, 0xe7)
  if (can.kind !== CanonicalizationKind.EIP712) throw new Error(`Nope`)
  expect(tape.remainder.length).toEqual(64)
  // @ts-ignore
  delete node._sig
  const sigInput = can(node)
  expect(sigInput).toEqual(expectedHash)
})

test.skip('Generate test vectors', async () => {
  // @ts-ignore
  const signature = await account.signTypedData(testData)
  console.log('sig', signature)

  function putEntry(car: CAR, eip712: any, node: any, error?: string) {
    const entry: Record<string, any> = {
      valid: !error,
      data: eip712 ? car.put(eip712) : null,
      node: node ? car.put(node) : null,
    }
    if (error) entry.error = error
    return car.put(entry)
  }

  const car = new CARFactory().build()
  const entries = []
  // @ts-ignore
  entries.push(putEntry(car, testData, fromEip712(testData)))
  // @ts-ignore
  entries.push(putEntry(car, easData, fromEip712(easData)))
  // invalid stuff
  const invalidData1 = {
    ...testData,
    signature:
      '0x0c095239e4d3d2cc0b7aa28110f42abcdefe47656bbde7048244471e701331ec3f94adfe7959b0ed0efec533d511f9e1e1187623487682341870dc31fbc2146d1b',
  }
  // @ts-ignore
  entries.push(putEntry(car, invalidData1, fromEip712(invalidData1), 'Invalid signature'))

  // @ts-ignore
  const invalidNode1 = fromEip712(testData)
  invalidNode1._sig.set([0xec], 1)
  entries.push(putEntry(car, null, invalidNode1, 'Unsupported key type'))
  // @ts-ignore
  const invalidNode2 = fromEip712(testData)
  invalidNode2._sig.set([0x00], 2)
  entries.push(putEntry(car, null, invalidNode2, 'Missing recovery bit'))
  // @ts-ignore
  const invalidNode3 = fromEip712(testData)
  invalidNode3._sig.set([0x12], 3)
  entries.push(putEntry(car, null, invalidNode3, 'Unsupported hash type'))

  car.put(
    {
      canonicalization: 'eip712',
      signature: 'secp256k1',
      hash: 'keccak256',
      entries,
    },
    { isRoot: true }
  )

  await pipeline(car, fs.createWriteStream('./eip712-secp256k1.car'))
})
