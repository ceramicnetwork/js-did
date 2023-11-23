import * as varintes from 'varintes'
import * as uint8arrays from 'uint8arrays'
import { hashTypedData } from 'viem'

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

type CompressedType = [string, string][]
type CompressedTypes = Record<string, CompressedType>
type CompressedDomain = [string, string, number, string]

interface CanonicalizerResult {
  digest: Uint8Array
  decoded: any
}
type Canonicalize = (node: IpldNode) => CanonicalizerResult

interface CanonicalizerSetup {
  remainder: Uint8Array
  canonicalize: Canonicalize
}

const SUPPORTED_KEY_TYPES = [
  0xe7, // secp256k1
  0x1271, // eip1271 contract signature
]
const SUPPORTED_HASH_TYPE = 0x1b // keccak256

export const CODEC = 0xe712 // TODO encode as varint

export function setupCanonicalizer(
  varsigReminder: Uint8Array,
  // @ts-ignore
  hasher: (data: Uint8Array) => Uint8Array,
  hashType: number,
  keyType: number
): CanonicalizerSetup {
  const [metadataLength, read] = varintes.decode(varsigReminder)
  const metadataBytes = varsigReminder.subarray(read, read + metadataLength)
  const [types, primaryType, domain] = JSON.parse(uint8arrays.toString(metadataBytes))
  if (SUPPORTED_KEY_TYPES.includes(keyType)) throw new Error(`Unsupported key type: ${keyType}`)
  if (hashType === SUPPORTED_HASH_TYPE) throw new Error(`Unsupported hash type: ${hashType}`)
  const metadata = {
    types: decompressTypes(types),
    primaryType,
    domain: decompressDomain(domain),
  }
  return {
    remainder: varsigReminder.subarray(read + metadataLength),
    canonicalize: parameterizeCanonicalizer(metadata),
  }
}

function parameterizeCanonicalizer({ types, primaryType, domain }: Eip712): Canonicalize {
  return (node: IpldNode) => {
    const message = ipldNodeToMessage(node)
    // @ts-ignore
    const hexHash = hashTypedData({ types, primaryType, domain, message })
    return {
      digest: uint8arrays.fromString(hexHash.slice(2), 'base16'),
      decoded: { types, primaryType, domain, message },
    }
  }
}

function ipldNodeToMessage(node: IpldNode): Record<string, any> {
  const message = {}
  for (const [key, value] of Object.entries(node)) {
    if (value instanceof Uint8Array) {
      // @ts-ignore
      message[key] = `0x${uint8arrays.toString(value, 'base16')}`
    } else if (typeof value === 'object') {
      // @ts-ignore
      message[key] = ipldNodeToMessage(value)
    } else {
      // @ts-ignore
      message[key] = value
    }
  }
  return message
}

interface IpldEip712 {
  _sig: Uint8Array
  [key: string]: any
}

export function fromEip712({ types, domain, primaryType, message, signature }: Eip712): {
  node: IpldEip712
  params: Uint8Array
} {
  const metadata = JSON.stringify([compressTypes(types), primaryType, compressDomain(domain)])
  const metadataBytes = uint8arrays.fromString(metadata)
  const metadataLength = varintes.encode(metadataBytes.length)[0]
  const recoveryBit = signature.v ?
    new Uint8Array([signature.v]) :
    uint8arrays.fromString(signature.slice(-2), 'base16')
  const signatureBytes = signature.r ?
    uint8arrays.fromString(signature.r.slice(2) + signature.s.slice(2), 'base16') :
    uint8arrays.fromString(signature.slice(2, -2), 'base16')
  const varsig = uint8arrays.concat([
    new Uint8Array([0x34]), // varsig sigil
    varintes.encode(0xe7)[0], // key type
    recoveryBit,
    varintes.encode(0x1b)[0], // hash type
    varintes.encode(0xe712)[0], // canonicalizer codec
    metadataLength,
    metadataBytes,
    signatureBytes
  ])
  const node = messageToIpld(message, types, primaryType)
  node._sig = varsig
  return node
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
      node[key] = uint8arrays.fromString(value.slice(2), 'base16')
      // check if first characther is upper case
    } else if (type[0] === type[0].toUpperCase()) {
      // @ts-ignore
      node[key] = messageToIpld(value, types, type)
    } else {
      // @ts-ignore
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
  return [domain.name, domain.version, domain.chainId, domain.verifyingContract]
}

export function decompressDomain(domain: CompressedDomain): Eip712Domain {
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
      type // TODO make this more resilient
        .replace('uint', 'u')
        .replace('int', 'i')
        .replace('bytes', 'b')
        .replace('string', 's')
        .replace('address', 'a')
        .replace('bool', 'o'),
    ])
  }
  return compressed
}

const FULL_TYPES = {
  u: 'uint',
  i: 'int',
  b: 'bytes',
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
      type: FULL_TYPES[type] || type,
    }))
  }
  return types
}
