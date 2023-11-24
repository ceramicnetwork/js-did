import type { BytesTape } from '../bytes-tape.js'
import type { HashingAlgo } from '../hashing.js'
import * as varintes from 'varintes'
import * as uint8arrays from 'uint8arrays'
import { hashTypedData, Hex, TypedDataDomain } from 'viem'
import type { CanonicalizationAlgo } from '../canonicalization.js'
import type { SigningKind } from '../signing.js'

interface Eip712Domain {
  name: string
  version: string
  chainId: number
  verifyingContract: string
}

type IpldNode = Record<string, any>

interface Eip712TypeField {
  name: string
  type: string
}

type Eip712Types = Record<string, Array<Eip712TypeField>>

interface SignatureComponents {
  r: string
  s: string
  v: number
}

interface Eip712 {
  types: Eip712Types
  domain: Eip712Domain
  primaryType: string
  message?: Record<string, any>
  signature?: string | SignatureComponents
}

export type CompressedType = Array<[string, string]>
export type CompressedTypes = Record<string, CompressedType>
export type CompressedDomain = [string, string, number, Hex]

const SUPPORTED_KEY_TYPES = [
  0xe7, // secp256k1
  // 0x1271, // eip1271 contract signature
]
const SUPPORTED_HASH_TYPE = 0x1b // keccak256

const SIGIL = 0xe712

export function prepareCanonicalization(
  tape: BytesTape,
  hashType: HashingAlgo,
  keyType: SigningKind
): CanonicalizationAlgo {
  if (hashType !== SUPPORTED_HASH_TYPE) throw new Error(`Unsupported hash type: ${hashType}`)
  if (!SUPPORTED_KEY_TYPES.includes(keyType)) throw new Error(`Unsupported key type: ${keyType}`)
  const metadataLength = tape.readVarint()
  const metadataBytes = tape.read(metadataLength)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const [types, primaryType, domain] = JSON.parse(uint8arrays.toString(metadataBytes))
  const metadata = {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    types: decompressTypes(types),
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    primaryType: primaryType,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    domain: decompressDomain(domain),
  }
  const canonicalization = (node: IpldNode) => {
    const message = ipldNodeToMessage(node)
    // @ts-ignore
    const hexHash = hashTypedData({ ...metadata, message })
    return uint8arrays.fromString(hexHash.slice(2), 'base16')
  }
  const original = (node: IpldNode, signature: Uint8Array, recoveryBit: number) => {
    const message = ipldNodeToMessage(node)

    const sigBytes = uint8arrays.concat([signature, [recoveryBit]])
    const sigHex = `0x${uint8arrays.toString(sigBytes, 'base16')}`
    return { ...metadata, message, signature: sigHex }
  }
  canonicalization.kind = SIGIL
  canonicalization.original = original
  return canonicalization
}

export const Eip712 = { SIGIL, prepareCanonicalization }

// function parameterizeCanonicalizer({ types, primaryType, domain }: Eip712): Canonicalize {
//   return (node: IpldNode) => {
//     const message = ipldNodeToMessage(node)
//     // @ts-ignore
//     const hexHash = hashTypedData({ types, primaryType, domain, message })
//     return {
//       digest: uint8arrays.fromString(hexHash.slice(2), 'base16'),
//       decoded: { types, primaryType, domain, message },
//     }
//   }
// }

function ipldNodeToMessage(node: IpldNode): Record<string, any> {
  const message = {}
  for (const [key, value] of Object.entries(node)) {
    if (value instanceof Uint8Array) {
      // @ts-ignore
      message[key] = `0x${uint8arrays.toString(value, 'base16')}`
    } else if (typeof value === 'object') {
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      message[key] = ipldNodeToMessage(value)
    } else {
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      message[key] = value
    }
  }
  return message
}

function extractSignature(signature: string | SignatureComponents) {
  if (typeof signature === 'string') {
    const recoveryBit = uint8arrays.fromString(signature.slice(-2), 'hex')
    const signatureBytes = uint8arrays.fromString(signature.slice(2, -2), 'base16')
    return { recoveryBit: recoveryBit, bytes: signatureBytes }
  } else {
    const recoveryBit = new Uint8Array([signature.v])
    const signatureBytes = uint8arrays.fromString(
      signature.r.slice(2) + signature.s.slice(2),
      'base16'
    )
    return { recoveryBit: recoveryBit, bytes: signatureBytes }
  }
}

export function fromEip712({ types, domain, primaryType, message, signature }: Eip712): IpldNode {
  const metadata = JSON.stringify([compressTypes(types), primaryType, compressDomain(domain)])
  const metadataBytes = uint8arrays.fromString(metadata)
  const metadataLength = varintes.encode(metadataBytes.length)[0]
  if (!signature) throw new Error(`No signature passed`)
  const extracted = extractSignature(signature)
  const recoveryBit = extracted.recoveryBit
  const signatureBytes = extracted.bytes
  const varsig = uint8arrays.concat([
    new Uint8Array([0x34]), // varsig sigil
    varintes.encode(0xe7)[0], // key type
    recoveryBit,
    varintes.encode(0x1b)[0], // hash type
    varintes.encode(0xe712)[0], // canonicalizer codec
    metadataLength,
    metadataBytes,
    signatureBytes,
  ])
  if (!message) throw new Error(`Message is required`)
  const node = messageToIpld(message, types, primaryType)
  node._sig = varsig
  return node
}

export function fromEip712A({ types, domain, primaryType, message }: Omit<Eip712, 'signature'>): {
  params: Uint8Array
} {
  const metadata = JSON.stringify([compressTypes(types), primaryType, compressDomain(domain)])
  const metadataBytes = uint8arrays.fromString(metadata)
  const metadataLength = varintes.encode(metadataBytes.length)[0]
  const varsig = uint8arrays.concat([
    // new Uint8Array([0x34]), // varsig sigil
    // varintes.encode(0xe7)[0], // key type
    // varintes.encode(0x1b)[0], // hash type
    // varintes.encode(0xe712)[0], // canonicalizer codec
    metadataLength,
    metadataBytes,
  ])
  if (!message) throw new Error(`No message passsed`)
  const node = messageToIpld(message, types, primaryType)
  node._sig = varsig
  return {
    params: varsig,
  }
}

function messageToIpld(
  message: Record<string, any>,
  types: Eip712Types,
  selected: string
): IpldNode {
  const node = {}
  for (const [key, value] of Object.entries(message)) {
    // @ts-ignore
    const type = types[selected].find(({ name }) => name === key).type
    if (!type) throw new Error(`Type for ${key} not found`)
    if (type.startsWith('bytes')) {
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
      node[key] = uint8arrays.fromString(value.slice(2), 'base16')
      // check if first characther is upper case
    } else if (type[0] === type[0].toUpperCase()) {
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      node[key] = messageToIpld(value, types, type)
    } else {
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      node[key] = value
    }
  }
  return node
}

const EIP712_DOMAIN = [
  { name: 'name', type: 'string' },
  { name: 'version', type: 'string' },
  { name: 'chainId', type: 'uint256' },
  { name: 'verifyingContract', type: 'address' },
]

function compressDomain(domain: Eip712Domain): CompressedDomain {
  return [domain.name, domain.version, domain.chainId, domain.verifyingContract as Hex]
}

export function decompressDomain(domain: CompressedDomain): TypedDataDomain {
  return {
    name: domain[0],
    version: domain[1],
    chainId: domain[2],
    verifyingContract: domain[3],
  }
}

function compressTypes(types: Eip712Types): CompressedTypes {
  const compressed = {}
  for (const [key, value] of Object.entries(types)) {
    if (key === 'EIP712Domain') continue
    // @ts-ignore
    compressed[key] = value.map(({ name, type }) => [
      name,
      type
        .replace(/^uint(\d{1,3})$/, 'u$1')
        .replace(/^int(\d{1,3})$/, 'i$1')
        .replace(/^bytes(\d{0,2})$/, 'b$1')
        .replace(/^string$/, 's')
        .replace(/^address$/, 'a')
        .replace(/^bool$/, 'o'),
    ])
  }
  return compressed
}

const FULL_TYPES = {
  u: 'uint',
  u16: 'uint16',
  u64: 'uint64',
  i: 'int',
  b: 'bytes',
  b32: 'bytes32',
  s: 'string',
  a: 'address',
  o: 'bool',
}

export function decompressTypes(compressed: CompressedTypes): Eip712Types {
  const types = { EIP712Domain: EIP712_DOMAIN }
  for (const [key, value] of Object.entries(compressed)) {
    // @ts-ignore
    types[key] = value.map(([name, type]) => ({
      name,
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      type: FULL_TYPES[type] || type,
    }))
  }
  return types
}
