import { decode } from 'cborg'
import { p256 } from '@noble/curves/p256'
import * as u8a from 'uint8arrays'
const { crypto, localStorage } = globalThis

const RelayingPartyName = 'Ceramic Network'

export interface SimpleCreateCredentialOpts {
  /** Defaults to website host */
  rpname?: PublicKeyCredentialCreationOptions['rp']['name'],

  // User facing identifiers (Shown on device/selection screens)
  /** username / email */
  name?: PublicKeyCredentialCreationOptions['user']['name'],
  /** Human-friendly identifier for credential, usually shown in system popups */
  displayName?: PublicKeyCredentialCreationOptions['user']['displayName']
}

export function populateCreateOpts (opts: SimpleCreateCredentialOpts): CredentialCreationOptions {
  return {
    publicKey: {
      challenge: randomBytes(32), // Otherwise issued by server
      rp: {
        id: globalThis.location.hostname, // Must be set to current hostname
        name: opts.rpname || RelayingPartyName // A known constant.
      },
      user: {
        id: randomBytes(32), // Server issued arbitrary bytes
        name: opts.name || 'ceramic', // username or email
        displayName: opts.displayName || opts.displayName || 'Ceramic', // display name
      },
      pubKeyCredParams: [
        { type: 'public-key', alg: -7 }, // ECDSA (secp256r1) with SHA-256
      ],
      authenticatorSelection: {
        requireResidentKey: true, // Deprecated (superseded by `residentKey`), some webauthn v1 impl still use it.
        residentKey: 'required', // Require private key to be created on authenticator/ secure storage
        userVerification: 'required', // Require user to push button/input pin sign requests
      }
    }
  }
}

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
    const recovered = recoverPublicKey(
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
function randomBytes (n: number) {
  const b = new Uint8Array(n)
  crypto.getRandomValues(b)
  return b
}

export function decodeAttestationObject (attestationObject: Uint8Array|ArrayBuffer) {
  // TODO: AttestationObject is not same as authData; AObject is a CBOR containing a copy of AuthData
  if (attestationObject instanceof ArrayBuffer) attestationObject = new Uint8Array(attestationObject)
  if (!(attestationObject instanceof Uint8Array)) throw new Error('Uint8ArrayExpected')
  return decode(attestationObject)
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
  let cose
  try {
    cose = decode(authData.slice(o - 1), { useMaps: true }) as Map<number, number|Uint8Array>
  } catch (err) {
    // https://github.com/rvagg/cborg/issues/92
    cose = decodeCOSE(authData.slice(o))
    console.log(u8a.toString(authData.slice(o), 'hex'))
    debugger
  }

  // Section 'COSE Key Type Parameters'
  // https://www.iana.org/assignments/cose/cose.xhtml
  if (cose.get(1) !== 2) throw new Error('Expected COSE object type to be a EC Coordinate pair')
  if (cose.get(3) !== -7) throw new Error('Expected ES256 Algorithm')
  const x = cose.get(-2)
  const y = cose.get(-3)

  if (!(x instanceof Uint8Array) || !(y instanceof Uint8Array)) throw new Error('Expected X and Y coordinate to be buffers')
  const publicKey = new Uint8Array(33)
  publicKey[0] = 1 + (y[y.length -1] & 1)
  publicKey.set(x, 1)

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
 * Normalize authenticatorData across browsers/runtimes
 * different runtimes implement different parts of spec.
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
 * Normalize ArrayBuffer|Uint8Array => Uint8Array or throw
 */
function assertU8 (o: Uint8Array | ArrayBuffer) : Uint8Array {
  if (o instanceof ArrayBuffer) return new Uint8Array(o)
  if (o instanceof Uint8Array) return o
  throw new Error('Expected Uint8Array')
}

/**
 * Tiny partial CBOR decoder that supports COSE_key numerical keys
 * https://www.iana.org/assignments/cose/cose.xhtml
 * Section 'COSE Key Type Parameters'
 */
function decodeCOSE (buf: Uint8Array) {
  if (!(buf instanceof Uint8Array)) throw new Error('Uint8ArrayExpected')
  const view = new DataView(buf.buffer)
  let o = 0
  const readByte = (): number => buf[o++]
  const readU8 = (): number => view.getUint8(o++)
  const readU16 = () => { 
    const n = view.getUint16(o)
    o+= 2
    return n
  }
  const readU32 = () => { 
    const n = view.getUint32(o)
    o += 4
    return n
  }
  const readU64 = () => { 
    const n = view.getBigUint64(o)
    o += 8
    return n
  }
  const readLength = (l:number) => l < 24 ? l : [readU8, readU16, readU32, readU64][l - 24]()
  const readMap = (l: number) => {
    const map = {} // @ts-ignore
    for (let i = 0; i < l; i++) map[readItem()] = readItem()
    return map
  } // @ts-ignore
  const readBuffer = l => buf.slice(o, o += l)
  function readItem () {
    const b = readByte()
    const l = readLength(b & 0x1f)
    switch (b >> 5) {
      case 0: return l // Uint
      case 1: return typeof l === 'bigint' ? -(l +1n) : -(l + 1) // Negative integer
      case 2: return readBuffer(l) // binstr
      case 5: return readMap(l as number)
      default: throw new Error('UnsupportedType' + (b >> 5))
    }
  }
  return readItem()
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
