import { decode } from 'cborg'
import { p256 } from '@noble/curves/p256'
import * as u8a from 'uint8arrays'
import { decodeCOSE } from './cose'
import { ecPointCompress } from '@didtools/key-webcrypto'
import varint from 'varint'


const { localStorage } = globalThis

export async function authenticatorSign (challenge: Uint8Array, credentialId?: Uint8Array|string): Promise<{
  signature: Uint8Array,
  recovered: [Uint8Array, Uint8Array],
  credential: Credential
}> {
    const allowCredentials:PublicKeyCredentialDescriptor[] = []
    if (credentialId) {
      if (typeof credentialId === 'string') credentialId = u8a.fromString(credentialId, 'base64url')
      allowCredentials.push({ type: 'public-key', id: credentialId })
    }
    const credential = await globalThis.navigator.credentials.get({
      publicKey: {
        rpId: globalThis.location.hostname,
        challenge,
        allowCredentials,
        timeout: 240000,
        // @ts-ignore
        attestation: 'direct' // https://developer.mozilla.org/en-US/docs/Web/API/CredentialsContainer/get#publickey_object_structure
      }
    })
    if (!credential) throw new Error('AbortedByUser')
    // @ts-ignore - credential.response does exist.
    const { response } = credential
    const { clientDataJSON, signature } = response
    const authenticatorData = getAuthenticatorData(response)
    const recovered = recoverPublicKeys(
      signature,
      authenticatorData,
      clientDataJSON
    )
    return { signature, recovered, credential }
}

export function verify (
  signature: Uint8Array,
  publicKey: Uint8Array,
  authData: Uint8Array,
  clientDataJSON: Uint8Array
) {
  const clientDataHash = p256.CURVE.hash(clientDataJSON)
  const msg = u8a.concat([authData, clientDataHash])
  const hashBase = p256.CURVE.hash(msg)
  return p256.verify(signature, hashBase, publicKey)
}

// --- tools.js
export function randomBytes (n: number) {
  return p256.CURVE.randomBytes(n)
}

export function decodeAttestationObject (attestationObject: Uint8Array|ArrayBuffer) {
  return decode(assertU8(attestationObject))
}

/**
 * Extracts PublicKey from AuthenticatorData as received from hardware key.
 *
 * See box `CREDENTIAL PUBLIC KEY` in picture:
 * https://w3c.github.io/webauthn/images/fido-attestation-structures.svg
 * @param {Uint8Array|ArrayBuffer} attestationObject As given by credentials.create().response.attestationObject
 */
export function decodeAuthenticatorData (authData: Uint8Array) {
  authData = assertU8(authData)
  // https://w3c.github.io/webauthn/#sctn-authenticator-data
  if (authData.length < 37) throw new Error('AuthenticatorDataTooShort')
  let o = 0
  const rpidHash = authData.slice(o, o += 32) // SHA-256 hash of rp.id

  const flags = authData[o++]
  // console.debug(`Flags: 0b` + flags.toString(2).padStart(8, '0'))
  if (!(flags & (1 << 6))) throw new Error('AuthenticatorData has no Key')

  const view = new DataView(authData.buffer)
  const signCounter = view.getUint32(o); o += 4

  // https://w3c.github.io/webauthn/#sctn-attested-credential-data
  const aaguid = authData.slice(o, o += 16)
  const clen = view.getUint16(o); o += 2
  const credentialId = authData.slice(o, o += clen)

  // https://datatracker.ietf.org/doc/html/rfc9052#section-7

  // Bug in cborg.decode() prevents next-line: https://github.com/rvagg/cborg/issues/92
  // const cose = decode(authData.slice(o - 1), { useMaps: true }) as Map<number, number|Uint8Array>

  // Using local CBOR/COSE implementation until resolved:
  const cose = decodeCOSE(authData.slice(o))
  if (cose['kty'] !== 2) throw new Error('Expected COSE key-type to be a EC Coordinate pair')
  if (cose['alg'] !== -7) throw new Error('Expected ES256 Algorithm')
  const { x, y } = cose
  if (!(x instanceof Uint8Array) || !(y instanceof Uint8Array)) throw new Error('Expected X and Y coordinate to be buffers')

  // Compress publicKey
  const publicKey = ecPointCompress(x, y)
  return {
    rpidHash,
    flags,
    signCounter,
    aaguid,
    credentialId,
    publicKey,
    cose
  }
}

/**
 * Normalizes authenticatorData across browsers/runtimes.
 */
export function getAuthenticatorData (response: any) {
  if (response.getAuthenticatorData === 'function') return response.getAuthenticatorData() // only on Chrome
  if (response.authenticatorData) return response.authenticatorData // Sometimes not available on FF
  if (response.attestationObject) { // Worst case scenario, decode attestationObject
    const { authData } = decode(assertU8(response.attestationObject))
    return assertU8(authData)
  }
  throw new Error('Failed to recover authenticator data from credential response') // Give up
}

/**
 * Normalize ArrayBuffer|Uint8Array|node:Buffer => Uint8Array or throw
 */
export function assertU8 (o: any) : Uint8Array {
  if (o instanceof ArrayBuffer) return new Uint8Array(o)
  if (o instanceof Uint8Array) return o
  // node:Buffer to Uint8Array
  if (!(o instanceof Uint8Array) && o?.buffer) {
    return new Uint8Array(o.buffer, o.byteOffset, o.byteLength)
  }
  throw new Error('Expected Uint8Array')
}

/**
 * Recovers both recovery bit 0|1 candidates from
 * an webauthn signature.
 * @param signature Authenticator generated signature
 * @param authenticatorData Authenticator Data
 * @param clientDataJSON Authenticator generated clientDataJSON - watch out for https://goo.gl/yabPex
 * @returns Recovered tuple of pk0 and pk1
 */
export function recoverPublicKeys (
  signature: Uint8Array,
  authenticatorData: Uint8Array,
  clientDataJSON: Uint8Array
  // credentialId?: Uint8Array // Yubikey v5 USB-A contains a public key hint.
) : [Uint8Array, Uint8Array] {
  const hash = (b: string|Uint8Array) => p256.CURVE.hash(b)
  const msg = u8a.concat([authenticatorData, hash(clientDataJSON)])
  const msgHash = hash(msg)
  signature = assertU8(signature) // normalize to u8
  return [0, 1].map(rBit => p256.Signature.fromDER(signature)
    .addRecoveryBit(rBit)
    .recoverPublicKey(msgHash)
    .toRawBytes(true)
  ) as [Uint8Array, Uint8Array]
}

export const KNOWN_KEYSTORE = 'knownKeys'
export function storePublicKey (pk: Uint8Array) {
  const hex = u8a.toString(pk, 'hex')
  const knownKeys = JSON.parse(localStorage.getItem(KNOWN_KEYSTORE) || '[]')
  if (!knownKeys.includes(hex)) {
    knownKeys.push(hex)
    localStorage.setItem(KNOWN_KEYSTORE, JSON.stringify(knownKeys))
  }
}

export function selectPublicKey (pk0: Uint8Array, pk1: Uint8Array): Uint8Array|null {
  const knownKeys = JSON.parse(localStorage.getItem(KNOWN_KEYSTORE) || '[]')
  for (const key of knownKeys) {
    if (key === u8a.toString(pk0, 'hex')) return pk0
    if (key === u8a.toString(pk1, 'hex')) return pk1
  }
  return null
}

export function decodePubFromDID(did: string): Uint8Array{
  const multicodecPubKey: Uint8Array = u8a.fromString(did.replace('did:key:z', ''), 'base58btc')
  const keyType = varint.decode(multicodecPubKey)
  return multicodecPubKey.slice(varint.decode.bytes)
}

export function encodeDIDFromPub(publicKey: Uint8Array): string {
  const CODE = varint.encode(0x1200) // p-256 multicodec
  const bytes = u8a.concat([CODE, publicKey])
  return `did:key:z${u8a.toString(bytes, 'base58btc')}`
}