import { fromOriginal, prepareCanonicalization } from '../../canons/eip712.js'
import { BytesTape } from '../../bytes-tape.js'
import * as uint8arrays from 'uint8arrays'
import { CanonicalizationKind } from '../../canonicalization.js'

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

test('Encode eip712 message', () => {
  // @ts-ignore
  const node = fromOriginal(testData)

  expect(node._sig.length).toEqual(268)
  expect(node.attachment instanceof Uint8Array).toBeTruthy()
})

test('Canonicalize ipld eip712 object', () => {
  // @ts-ignore
  const node = fromOriginal(testData)
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
