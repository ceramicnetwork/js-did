import * as fs from 'node:fs'
import { pipeline } from 'node:stream/promises'
import { CARFactory, type CAR } from 'cartonne'
import { fromOriginal, Signer } from '../canons/eip712.js'
import type { CID } from 'multiformats/cid'
import { privateKeyToAccount } from 'viem/accounts'

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
    EIP712Domain: [
      { name: 'name', type: 'string' },
      { name: 'version', type: 'string' },
      { name: 'chainId', type: 'uint256' },
      { name: 'verifyingContract', type: 'address' },
    ],
  },
  signature: {
    v: 27,
    r: '0x65f777899dddd381d138eb0e1350071a6bcb6430a3a58c1c232eaf5db4292af7',
    s: '0x7f225138ccfc901f85d4dc88bd199de57f13fc144272ba75b5459a2a14629b1e',
  },
}

const ACCOUNT = privateKeyToAccount(
  '0x9727992a9c7d4e4b7c3b2d8d3c4b5b2e9d6e9c0a3a0e0d0c0b0a090807060504',
)

function putEntry(car: CAR, eip712: any, node: any, signer: Signer, error?: string): CID {
  const entry: Record<string, any> = {
    valid: !error,
    original: eip712 ? car.put(eip712) : null,
    node: node ? car.put(node) : null,
    signer: signer,
  }
  if (error) entry['error'] = error
  return car.put(entry)
}

async function main() {
  const car = new CARFactory().build()
  const entries = []
  // @ts-expect-error
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  entries.push(putEntry(car, TEST_DATA, fromOriginal(TEST_DATA), { publicKey: ACCOUNT.publicKey }))
  entries.push(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    putEntry(car, EAS_DATA, fromOriginal(EAS_DATA), {
      address: '0x3e95B8E249c4536FE1db2E4ce5476010767C0A05',
    }),
  )
  // invalid stuff
  const invalidData1 = {
    ...TEST_DATA,
    signature:
      '0x0c095239e4d3d2cc0b7aa28110f42abcdefe47656bbde7048244471e701331ec3f94adfe7959b0ed0efec533d511f9e1e1187623487682341870dc31fbc2146d1b',
  }
  entries.push(
    putEntry(
      car,
      invalidData1,
      // @ts-expect-error
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      fromOriginal(invalidData1),
      {
        address: '0x7821B4697401EdC27aB2719FF4d7a6A7737D28C3',
      },
      'Invalid signature',
    ),
  )

  // @ts-expect-error
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call
  const invalidNode1 = fromOriginal(TEST_DATA)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
  invalidNode1._sig.set([0xec], 1)
  entries.push(
    putEntry(
      car,
      null,
      invalidNode1,
      {
        address: '0x7821B4697401EdC27aB2719FF4d7a6A7737D28C3',
      },
      'Unsupported key type',
    ),
  )
  // @ts-expect-error
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call
  const invalidNode2 = fromOriginal(TEST_DATA)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
  invalidNode2._sig.set([0x00], 2)
  entries.push(
    putEntry(
      car,
      null,
      invalidNode2,
      {
        address: '0x7821B4697401EdC27aB2719FF4d7a6A7737D28C3',
      },
      'Missing recovery bit',
    ),
  )
  // @ts-expect-error
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call
  const invalidNode3 = fromOriginal(TEST_DATA)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
  invalidNode3._sig.set([0x12], 3)
  entries.push(
    putEntry(
      car,
      null,
      invalidNode3,
      {
        address: '0x7821B4697401EdC27aB2719FF4d7a6A7737D28C3',
      },
      'Unsupported hash type',
    ),
  )

  car.put(
    {
      canonicalization: 'eip712',
      signature: 'secp256k1',
      hash: 'keccak256',
      entries,
    },
    { isRoot: true },
  )

  const carFilepath = new URL('./__vectors__/eip712-secp256k1.car', import.meta.url)
  await pipeline(car, fs.createWriteStream(carFilepath))
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
