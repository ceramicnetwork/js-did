import { expect, test } from '@jest/globals'
import { BytesTape } from '../bytes-tape.js'
import { CanonicalizationDecoder, CanonicalizationKind } from '../canonicalization.js'
import { concat, toString } from 'uint8arrays'
import { encode } from 'varintes/encode'
import { HashingAlgo } from '../hashing.js'
import { SigningKind } from '../signing.js'
import { fromOriginal } from '../canons/eip712.js'

const TEST_DATA = {
  types: {
    EIP712Domain: [
      {
        name: 'name',
        type: 'string',
      },
      {
        name: 'version',
        type: 'string',
      },
      {
        name: 'chainId',
        type: 'uint256',
      },
      {
        name: 'verifyingContract',
        type: 'address',
      },
    ],
    Person: [
      {
        name: 'name',
        type: 'string',
      },
      {
        name: 'wallet',
        type: 'address',
      },
    ],
    Mail: [
      {
        name: 'from',
        type: 'Person',
      },
      {
        name: 'to',
        type: 'Person',
      },
      {
        name: 'contents',
        type: 'string',
      },
      {
        name: 'attachment',
        type: 'bytes',
      },
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

test('EIP712', () => {
  const node = fromOriginal({
    // @ts-ignore
    types: TEST_DATA.types,
    domain: TEST_DATA.domain,
    primaryType: TEST_DATA.primaryType,
    message: TEST_DATA.message,
    signature: TEST_DATA.signature,
  })
  const tape = new BytesTape(node._sig)
  tape.readVarint() // skip varsig sigil
  tape.readVarint() // skip key sigil
  tape.read(1)
  tape.readVarint() // skip hash sigil
  const canonicalization = CanonicalizationDecoder.read(
    tape,
    HashingAlgo.KECCAK256,
    SigningKind.SECP256K1
  )
  expect(canonicalization.kind).toEqual(CanonicalizationKind.EIP712)
  if (canonicalization.kind !== CanonicalizationKind.EIP712) throw new Error()
  const input = toString(canonicalization(TEST_DATA.message), 'hex')
  expect(input).toEqual('703012a88c79c0ae106c7e0bd144d39d63304df1815e6d11b19189aff3dce0c4')
})

test('EIP191', () => {
  const bytes = concat([encode(0xe191)[0]])
  const tape = new BytesTape(bytes)
  const result = CanonicalizationDecoder.read(tape, HashingAlgo.KECCAK256, SigningKind.SECP256K1)
  expect(result.kind).toEqual(CanonicalizationKind.EIP191)
  const canonicalized = toString(result('Hello'), 'hex')
  expect(canonicalized).toEqual('aa744ba2ca576ec62ca0045eca00ad3917fdf7ffa34fbbae50828a5a69c1580e')
})
