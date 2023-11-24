import { test } from '@jest/globals'
import { privateKeyToAccount } from 'viem/accounts'
import { BytesTape } from '../bytes-tape.js'
import { CanonicalizationKind } from '../canonicalization.js'
import { fromOriginal } from '../canons/eip712'
import { Decoder } from '../decoder.js'

const testData = {
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
  primaryType: 'Mail' as const,
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
} as const

test('712 flow', async () => {
  const account = privateKeyToAccount(
    '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'
  )
  const stringSignature = await account.signTypedData({
    domain: { ...testData.domain, chainId: 1n },
    types: testData.types,
    primaryType: testData.primaryType,
    message: testData.message,
  })
  const node = fromOriginal({
    // @ts-ignore
    types: testData.types,
    domain: testData.domain,
    primaryType: testData.primaryType,
    message: testData.message,
    signature: stringSignature,
  })
  const varsig = node._sig
  const decoder = new Decoder(new BytesTape(varsig)).read()
  if (decoder.canonicalization.kind !== CanonicalizationKind.EIP712) throw new Error(`Not 712`)
  const input = decoder.canonicalization(testData.message)
  expect(await decoder.signing.verify(input, decoder.signature, account.address)).toBeTruthy()
})
