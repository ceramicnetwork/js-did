import { CanonicalizationAlgo } from '../canonicalization.js'
import { BytesTape } from '../bytes-tape.js'
import { HashingAlgo } from '../hashing'
import { SigningKind } from '../signing'
import * as varintes from 'varintes'
import * as uint8arrays from 'uint8arrays'
import { encode, decode } from '@ipld/dag-json'

type IpldNode = Record<string, any>
type IpldNodeSigned = IpldNode & { _sig: Uint8Array }

const KEY_TYPE_BY_ALG_CRV: Record<string, Record<string, number>> = {
  ES256: { default: 0x1200 },
  EdDSA: { ed448: 0x1203, ed25519: 0xec, default: 0xec },
  ES256K: { default: 0xe7 },
}
const HASH_BY_KEY_TYPE: Record<number, number> = {
  0x1200: 0x12,
  0xe7: 0x12,
  0xec: 0x12,
  0x1203: 0x19,
}

const toB64u = (bytes: Uint8Array) => uint8arrays.toString(bytes, 'base64url')
const fromB64u = (b64u: string) => uint8arrays.fromString(b64u, 'base64url')


const SIGIL = 0x7053 // jose

export const JWS = { SIGIL, prepareCanonicalization, fromOriginal }

export function prepareCanonicalization(
  tape: BytesTape,
  hashType: HashingAlgo,
  keyType: SigningKind
): CanonicalizationAlgo {
  const protectedLength = tape.readVarint()
  const protectedBytes = tape.read(protectedLength)
  const protected1 = JSON.parse(uint8arrays.toString(protectedBytes))

  const keyTypeFromProtected = findKeyType(protected1)
  if (keyType !== keyTypeFromProtected) throw new Error(`Key type missmatch: ${keyType}, ${keyTypeFromProtected}`)
  if (hashType !== HASH_BY_KEY_TYPE[keyType]) throw new Error(`Hash type missmatch: ${hashType}, ${HASH_BY_KEY_TYPE[keyType]}`)

  const can = (node: IpldNode) => {
    // encode node using dag-json from multiformats
    const payloadB64u = toB64u(uint8arrays.fromString(JSON.stringify(encode(node))))
    const protectedB64u = toB64u(protectedBytes)
    return uint8arrays.fromString(`${protectedB64u}.${payloadB64u}`)
  }
  can.kind = SIGIL
  can.original = (node: IpldNode, signature: Uint8Array) => {
    const payloadB64u = toB64u(encode(node))
    const protectedB64u = toB64u(protectedBytes)
    const signatureB64u = toB64u(signature)
    return `${protectedB64u}.${payloadB64u}.${signatureB64u}`
  }
  return can
}

export function fromOriginal(jws: string): IpldNodeSigned {
  const [protectedB64u, payloadB64u, signatureB64u] = jws.split('.')
  const node = decode(fromB64u(payloadB64u)) as IpldNode
  const protectedBytes = fromB64u(protectedB64u)
  const protected1 = JSON.parse(uint8arrays.toString(protectedBytes))
  const protectedLength = varintes.encode(protectedBytes.length)[0]
  const signature = fromB64u(signatureB64u)

  const keyType = findKeyType(protected1)
  const hashType = HASH_BY_KEY_TYPE[keyType]

  // TODO - this doesn't currently support RSA signatures
  const varsig = uint8arrays.concat([
    new Uint8Array([0x34]), // varsig sigil
    varintes.encode(keyType)[0], // key type
    varintes.encode(hashType)[0], // hash type
    varintes.encode(SIGIL)[0], // canonicalizer codec
    protectedLength,
    protectedBytes,
    signature,
  ])
  return { ...node, _sig: varsig }
}

interface ProtectedHeader {
  alg: string
  crv?: string
}

function findKeyType({ alg, crv }: ProtectedHeader): number {
  if (!alg) throw new Error(`Missing alg in protected header`)
  const keyType = KEY_TYPE_BY_ALG_CRV[alg][crv || 'default']
  if (!keyType) throw new Error(`Unsupported alg: ${alg}, or crv: ${crv}`)
  return keyType
}
