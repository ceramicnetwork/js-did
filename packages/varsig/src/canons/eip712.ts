import type { BytesTape } from '../bytes-tape.js'
import type { HashingAlgo } from '../hashing.js'
import * as varintes from 'varintes'
import * as uint8arrays from 'uint8arrays'
import { hashTypedData, Hex, TypedDataDomain } from 'viem'
import type { CanonicalizationAlgo } from '../canonicalization.js'
import type { SigningKind } from '../signing.js'
import stringify from 'fast-json-stable-stringify'

interface Eip712Domain {
  name: string
  version: string
  chainId: number
  verifyingContract: string
}

type IpldNode = Record<string, any>
type IpldNodeSigned = IpldNode & { _sig: Uint8Array }

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

export interface Eip712 {
  types: Eip712Types
  domain: Eip712Domain
  primaryType: string
  message?: Record<string, any>
  signature?: string | SignatureComponents
}

export type CompressedType = Array<[string, string]>
export type CompressedTypes = Record<string, CompressedType>
export type CompressedDomain = [string, string, number, Hex]

const COMPRESSED_TO_SOLIDITY: Record<string, string> = {
  u: 'uint',
  u8: 'uint8',
  u16: 'uint16',
  u24: 'uint24',
  u32: 'uint32',
  u40: 'uint40',
  u48: 'uint48',
  u56: 'uint56',
  u64: 'uint64',
  u72: 'uint72',
  u80: 'uint80',
  u88: 'uint88',
  u96: 'uint96',
  u104: 'uint104',
  u112: 'uint112',
  u120: 'uint120',
  u128: 'uint128',
  u136: 'uint136',
  u144: 'uint144',
  u152: 'uint152',
  u160: 'uint160',
  u168: 'uint168',
  u176: 'uint176',
  u184: 'uint184',
  u192: 'uint192',
  u200: 'uint200',
  u208: 'uint208',
  u216: 'uint216',
  u224: 'uint224',
  u232: 'uint232',
  u240: 'uint240',
  u248: 'uint248',
  u256: 'uint256',
  i: 'int',
  i8: 'int8',
  i16: 'int16',
  i24: 'int24',
  i32: 'int32',
  i40: 'int40',
  i48: 'int48',
  i56: 'int56',
  i64: 'int64',
  i72: 'int72',
  i80: 'int80',
  i88: 'int88',
  i96: 'int96',
  i104: 'int104',
  i112: 'int112',
  i120: 'int120',
  i128: 'int128',
  i136: 'int136',
  i144: 'int144',
  i152: 'int152',
  i160: 'int160',
  i168: 'int168',
  i176: 'int176',
  i184: 'int184',
  i192: 'int192',
  i200: 'int200',
  i208: 'int208',
  i216: 'int216',
  i224: 'int224',
  i232: 'int232',
  i240: 'int240',
  i248: 'int248',
  i256: 'int256',
  b: 'bytes',
  b1: 'bytes1',
  b2: 'bytes2',
  b3: 'bytes3',
  b4: 'bytes4',
  b5: 'bytes5',
  b6: 'bytes6',
  b7: 'bytes7',
  b8: 'bytes8',
  b9: 'bytes9',
  b10: 'bytes10',
  b11: 'bytes11',
  b12: 'bytes12',
  b13: 'bytes13',
  b14: 'bytes14',
  b15: 'bytes15',
  b16: 'bytes16',
  b17: 'bytes17',
  b18: 'bytes18',
  b19: 'bytes19',
  b20: 'bytes20',
  b21: 'bytes21',
  b22: 'bytes22',
  b23: 'bytes23',
  b24: 'bytes24',
  b25: 'bytes25',
  b26: 'bytes26',
  b27: 'bytes27',
  b28: 'bytes28',
  b29: 'bytes29',
  b30: 'bytes30',
  b31: 'bytes31',
  b32: 'bytes32',
  s: 'string',
  a: 'address',
  o: 'bool',
}
const SOLIDITY_TO_COMPRESSED = Object.fromEntries(
  Object.entries(COMPRESSED_TO_SOLIDITY).map(([k, v]) => {
    return [v, k]
  })
)

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
  const original = (node: IpldNode, signature: Uint8Array, recoveryBit: number | undefined) => {
    const message = ipldNodeToMessage(node)

    const sigBytes = recoveryBit ? uint8arrays.concat([signature, [recoveryBit]]) : signature
    const sigHex = `0x${uint8arrays.toString(sigBytes, 'base16')}`
    return { ...metadata, message, signature: sigHex }
  }
  canonicalization.kind = SIGIL
  canonicalization.original = original
  return canonicalization
}

export const Eip712 = { SIGIL, prepareCanonicalization, fromOriginal }

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

export function fromOriginal({
  types,
  domain,
  primaryType,
  message,
  signature,
}: Eip712): IpldNodeSigned {
  const metadata = stringify([compressTypes(types), primaryType, compressDomain(domain)])
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
  return node as IpldNodeSigned
}

function messageToIpld(
  message: Record<string, any>,
  types: Eip712Types,
  primaryType: string
): IpldNode {
  const node = {}
  for (const [key, value] of Object.entries(message)) {
    const type = types[primaryType].find(({ name }) => name === key)?.type
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
  return node as IpldNode
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
  const compressed: CompressedTypes = {}
  for (const [key, value] of Object.entries(types)) {
    if (key === 'EIP712Domain') continue
    compressed[key] = value.map(({ name, type }) => [name, SOLIDITY_TO_COMPRESSED[type] || type])
  }
  return compressed
}

export function decompressTypes(compressed: CompressedTypes): Eip712Types {
  const types: Eip712Types = { EIP712Domain: EIP712_DOMAIN }
  for (const [key, value] of Object.entries(compressed)) {
    types[key] = value.map(([name, type]) => {
      const decompressed = COMPRESSED_TO_SOLIDITY[type] || type
      return {
        name,
        type: decompressed,
      }
    })
  }
  return types
}

export type Signer = { publicKey: Uint8Array } | { address: Hex }
