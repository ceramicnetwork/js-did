import { MAGIC } from '../magic.js'
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
  ES256: { default: MAGIC.ES256 },
  EdDSA: { ed448: MAGIC.ED448, ed25519: MAGIC.ED25519, default: MAGIC.ED25519 },
  ES256K: { default: MAGIC.SECP256K1 },
}
const HASH_BY_KEY_TYPE: Record<number, number> = {
  [MAGIC.ES256]: MAGIC.SHA2_256,
  [MAGIC.SECP256K1]: MAGIC.SHA2_256,
  [MAGIC.ED25519]: MAGIC.SHA2_256,
  [MAGIC.ED448]: MAGIC.SHAKE_256,
}

const toB64u = (bytes: Uint8Array) => uint8arrays.toString(bytes, 'base64url')
const fromB64u = (b64u: string) => uint8arrays.fromString(b64u, 'base64url')

const SIGIL = MAGIC.JOSE // jose

export const JWS = { SIGIL, prepareCanonicalization, fromOriginal }

export function prepareCanonicalization(
  tape: BytesTape,
  hashing: HashingAlgo,
  keyType: SigningKind,
): CanonicalizationAlgo {
  const protectedLength = tape.readVarint()
  const protectedBytes = tape.read(protectedLength)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const protected1 = JSON.parse(uint8arrays.toString(protectedBytes))

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const keyTypeFromProtected = findKeyType(protected1)
  if (keyType !== keyTypeFromProtected)
    throw new Error(`Key type missmatch: ${keyType}, ${keyTypeFromProtected}`)
  if (hashing.kind !== HASH_BY_KEY_TYPE[keyType])
    throw new Error(`Hash type missmatch: ${hashing.kind}, ${HASH_BY_KEY_TYPE[keyType]}`)

  const can = (node: IpldNode) => {
    // encode node using dag-json from multiformats
    const payloadB64u = toB64u(encode(node))
    const protectedB64u = toB64u(protectedBytes)
    const input = uint8arrays.fromString(`${protectedB64u}.${payloadB64u}`)
    if (keyType === MAGIC.ED25519) {
      // ed25519 includes hashing as part of the signature validation, so we need to skip it here
      return input
    }
    return hashing.digest(input)
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
  const node = decode<Record<string, any>>(fromB64u(payloadB64u))
  if (toB64u(encode(node)) !== payloadB64u) {
    throw new Error(
      `Invalid JOSE payload: Varsig only supports JSON with ordered keys, got "${JSON.stringify(
        node,
      )}"`,
    )
  }
  const protectedBytes = fromB64u(protectedB64u)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const protected1 = JSON.parse(uint8arrays.toString(protectedBytes))
  const protectedLength = varintes.encode(protectedBytes.length)[0]
  const signature = fromB64u(signatureB64u)

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const keyType = findKeyType(protected1)
  const hashType = HASH_BY_KEY_TYPE[keyType]

  // TODO - this doesn't currently support RSA signatures
  const varsig = uint8arrays.concat([
    new Uint8Array([MAGIC.VARSIG]), // varsig sigil
    varintes.encode(keyType)[0], // key type
    ...(keyType === MAGIC.SECP256K1 ? [new Uint8Array([0])] : []), // recovery bit not included (only for secp256k1)
    varintes.encode(hashType)[0], // hash type
    varintes.encode(SIGIL)[0], // canonicalizer codec
    protectedLength,
    protectedBytes,
    signature,
  ])
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return { ...node, _sig: varsig }
}

interface ProtectedHeader {
  alg: string
  crv?: string
}

function findKeyType({ alg, crv }: ProtectedHeader): number {
  if (!alg) throw new Error(`Missing alg in protected header`)
  const keyType = KEY_TYPE_BY_ALG_CRV[alg]?.[crv || 'default']
  if (!keyType) throw new Error(`Unsupported alg: ${alg}, or crv: ${String(crv)}`)
  return keyType
}
