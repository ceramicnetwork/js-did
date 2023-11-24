import * as fs from 'node:fs'
import { pipeline } from 'node:stream/promises'
import { CARFactory, type CAR } from 'cartonne'
import { fromEip712 } from '../canons/eip712.js'
import type { CID } from 'multiformats/cid'

const TEST_DATA = {
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

const EAS_DATA = {
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

function putEntry(car: CAR, eip712: any, node: any, error?: string): CID {
  const entry: Record<string, any> = {
    valid: error ? false : true,
    data: eip712 ? car.put(eip712) : null,
    node: node ? car.put(node) : null,
  }
  if (error) entry['error'] = error
  return car.put(entry)
}

async function main() {
  const car = new CARFactory().build()
  const entries = []
  // @ts-expect-error
  entries.push(putEntry(car, TEST_DATA, fromEip712(TEST_DATA)))
  entries.push(putEntry(car, EAS_DATA, fromEip712(EAS_DATA)))
  // invalid stuff
  const invalidData1 = {
    ...TEST_DATA,
    signature:
      '0x0c095239e4d3d2cc0b7aa28110f42abcdefe47656bbde7048244471e701331ec3f94adfe7959b0ed0efec533d511f9e1e1187623487682341870dc31fbc2146d1b',
  }
  // @ts-expect-error
  entries.push(putEntry(car, invalidData1, fromEip712(invalidData1), 'Invalid signature'))

  // @ts-expect-error
  const invalidNode1 = fromEip712(TEST_DATA)
  invalidNode1._sig.set([0xec], 1)
  entries.push(putEntry(car, null, invalidNode1, 'Unsupported key type'))
  // @ts-expect-error
  const invalidNode2 = fromEip712(TEST_DATA)
  invalidNode2._sig.set([0x00], 2)
  entries.push(putEntry(car, null, invalidNode2, 'Missing recovery bit'))
  // @ts-expect-error
  const invalidNode3 = fromEip712(TEST_DATA)
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
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
