import { test } from '@jest/globals'
import * as varintes from 'varintes'
import { secp256k1 } from '@noble/curves/secp256k1'
import * as uint8arrays from 'uint8arrays'
import { privateKeyToAccount } from 'viem/accounts'
import { BytesTape } from '../src/bytes-tape.js'
import { SigningAlgo, SigningDecoder } from '../src/signing.js'
import { HashingAlgo, HashingDecoder } from '../src/hashing.js'
import {
  CanonicalizationAlgo,
  CanonicalizationDecoder,
  CanonicalizationKind,
} from '../src/canonicalization.js'
import { fromEip712A } from '../src/encoding/eip712'

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

const expectedHash = uint8arrays.fromString(
  '703012a88c79c0ae106c7e0bd144d39d63304df1815e6d11b19189aff3dce0c4',
  'base16'
)

type DecodedVarsig = {
  signing: SigningAlgo
  hashing: HashingAlgo
  canonicalization: CanonicalizationAlgo
  signature: Uint8Array
}

class Decoder {
  #tape: BytesTape

  constructor(tape: BytesTape) {
    this.#tape = tape
  }

  read(): DecodedVarsig {
    this.readVarsigSigil()
    const signingDecoder = new SigningDecoder(this.#tape)
    const signing = signingDecoder.read()
    const hashing = HashingDecoder.read(this.#tape)
    const canonicalization = new CanonicalizationDecoder(this.#tape).read(hashing)
    const signature = signingDecoder.readSignature(signing)
    return {
      signing: signing,
      hashing: hashing,
      canonicalization: canonicalization,
      signature: signature,
    }
  }

  readVarsigSigil() {
    const sigil = this.#tape.readVarint()
    if (sigil !== 0x34) throw new Error(`Not a varsig`)
    return sigil
  }
}

function hex(...numbers: Array<number>): Uint8Array {
  return new Uint8Array(numbers)
}

test('712 flow', async () => {
  const account = privateKeyToAccount(
    '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'
  )
  console.log('pub.0', account.publicKey)
  const stringSignature = await account.signTypedData({
    domain: { ...testData.domain, chainId: 1n },
    types: testData.types,
    primaryType: testData.primaryType,
    message: testData.message,
  })
  const signatureBytes = uint8arrays.fromString(
    stringSignature.toLowerCase().replace(/^0x/, ''),
    'hex'
  )
  const a = fromEip712A({
    // @ts-ignore
    types: testData.types,
    domain: testData.domain,
    primaryType: testData.primaryType,
    message: testData.message,
  })
  const varsig = uint8arrays.concat([
    hex(0x34),
    varintes.encode(0xe7)[0],
    signatureBytes.subarray(64),
    varintes.encode(0x1b)[0],
    varintes.encode(CanonicalizationKind.EIP712)[0],
    a.params,
    signatureBytes.subarray(0, 64),
  ])
  const decoder = new Decoder(new BytesTape(varsig)).read()
  if (decoder.canonicalization.kind !== CanonicalizationKind.EIP712) throw new Error(`Not 712`)
  const input = decoder.canonicalization(testData.message)
  let signature = secp256k1.Signature.fromCompact(decoder.signature)
  if (decoder.signing.recoveryBit) {
    signature = signature.addRecoveryBit(decoder.signing.recoveryBit - 27)
  }
  console.log('pub.1', signature.recoverPublicKey(input).toHex(false))
})
