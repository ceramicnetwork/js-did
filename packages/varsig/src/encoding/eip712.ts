import * as varintes from 'varintes'
import * as uint8arrays from 'uint8arrays'

type IpldEip712Type = Record<string, string>

interface Eip712Domain {
  name: string,
  version: string,
  chainId: number,
  verifyingContract: string
}

interface IpldEip712Meta {
  types: Record<string, IpldEip712Type>
  primary: string
  domain: Eip712Domain
}

type IpldEip712Message = Record<string, any>


interface Eip712TypeField {
  name: string,
  type: string
}

type Eip712Types = Record<string, Eip712TypeField[]>

interface Eip712 {
  types: Eip712Types
  domain: Eip712Domain
  primaryType: string
  message: Record<string, any>
}

type CompressedType = [string, string][]
type CompressedTypes = Record<string, compressType>


type Canonicalizer = (node: any) => Uint8Array;

interface CanonicalizerSetup {
  remainder: Uint8Array,
  canonicalizer: Canonicalizer
}

export const CODEC = 0xe712 // TODO encode as varint

export function setupCanonicalizer(varsigReminder: Uint8Array): CanonicalizerSetup {
  const [metadataLength, read] = varintes.decode(varsigReminder)
  const metadataBytes = metadataLengthRemainder.subarray(read, read + metadataLength)
  const metadata = JSON.parse(uint8arrays.toString(metadataBytes))

  return {
    remainder: varsigReminder.subarray(read + metadataLength)
    canonicalizer: parameterizeCanonicalizer(metadata)
  }
}

function parameterizeCanonicalizer({ types, primary, domain }: IpldEip712Meta): Canonicalizer {
  const decompressTypes = decompressTypes(types)
  const domain = domain
  const primaryType = primary
  return (node) => {
    // TODO
  }
}

export function fromEip712({ types, domain, primaryType, message }: Eip712): ({ node: IpldEip712, params: Uint8Array }) {
  const metadata = JSON.serialize({ types: compressTypes(types), primary: primaryType, domain })
  const metadataBytes = uint8arrays.fromString(metadata)
  const metadataLength = varintes.encode(metadataBytes.length)
  return {
    node: messageToIpld(message)
    params: uint8arrays.concat([metadataLength, metadataBytes])
  }
}

function messageToIpld(message: Record<string, any>, types: Eip712Types, selected: string): IpldEip712Message {
  const node = {}
  for (const [key, value] of Object.entries(message)) {
    const type = types[selected].find(({ name }) => name === key
    if (!type) throw new Error(`Type for ${key} not found`)
    if (type.startsWith('bytes')) {
      node[key] = uint8arrays.fromString(value.slice(2), 'base16')
    // check if first characther is upper case
    } else if (type[0] === type[0].toUpperCase()) {
      node[key] = messageToIpld(value, types, type)
    } else {
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
];

function compressTypes(types: Eip712Types): CompressedTypes {
  const compressed = {}
  for (const [key, value] of Object.entries(types)) {
    if (key === 'EIP712Domain') continue
    compressed[key] = value.map(({ name, type }) => [name, type])
  }
  return compressed
}

function decompressTypes(compressed: CompressedTypes): Eip712Types {
  const types = { EIP712Domain: EIP712_DOMAIN }
  for (const [key, value] of Object.entries(compressed)) {
    types[key] = value.map(([name, type]) => ({ name, type }))
  }
  return types
}

