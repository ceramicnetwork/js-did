import { decode, decodeFirst } from 'cborg'
import { p256 } from '@noble/curves/p256'
import * as u8a from 'uint8arrays'
import varint from 'varint'

// Type definition for return type of credentials.get() seems to be incomplete.
// The actual returned object props varies depending on input parameters.
export interface CredentialSignResponse extends Credential {
  response: {
    clientDataJSON: Uint8Array,
    authenticatorData: Uint8Array,
    signature: Uint8Array
  }
}

export async function authenticatorSign (challenge: Uint8Array, credentialId?: Uint8Array|string): Promise<{
  signature: Uint8Array,
  recovered: [Uint8Array, Uint8Array],
  credential: CredentialSignResponse
}> {
    const allowCredentials: Array<PublicKeyCredentialDescriptor> = []
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
    }) as CredentialSignResponse|null
    if (!credential) throw new Error('AbortedByUser')
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

export interface AttestationObject {
  fmt: string,
  attStmt: any,
  authData: Uint8Array
}
export function decodeAttestationObject (attestationObject: Uint8Array|ArrayBuffer) {
  return decode(assertU8(attestationObject)) as AttestationObject
}

/**
 * Extracts PublicKey from AuthenticatorData as received from hardware key.
 *
 * See box `CREDENTIAL PUBLIC KEY` in picture:
 * https://w3c.github.io/webauthn/images/fido-attestation-structures.svg
 * @param {Uint8Array|ArrayBuffer} authData Use getAuthenticatorData(response).
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
  const [cose, _] = decodeFirst(authData.slice(o), { useMaps: true }) as [Map<number,any>, Uint8Array|null]
  // KTY = 1
  if (cose.get(1) !== 2) throw new Error('Expected COSE key-type to be a EC Coordinate pair')
  // ALG = 3
  if (cose.get(3) !== -7) throw new Error('Expected ES256 Algorithm')
  // X = -2, Y = -3
  const [x, y] = [cose.get(-2), cose.get(-3)]
  if (!(x instanceof Uint8Array) || !(y instanceof Uint8Array)) throw new Error('Expected X and Y coordinate to be buffers')

  // Compress publicKey
  const publicKey = new Uint8Array(x.length + 1)
  publicKey[0] = 2 + (y[y.length - 1] & 1)
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
 * Normalize authenticatorData across browsers/runtimes.
 */
export function getAuthenticatorData (response: any): Uint8Array {
  // Only on Chrome
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  if (typeof response.getAuthenticatorData === 'function') return assertU8(response.getAuthenticatorData())

  // Sometimes missing in Mozilla
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if (response.authenticatorData) return assertU8(response.authenticatorData)

  // Worst case scenario, decode attestationObject
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if (response.attestationObject) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
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
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if (!(o instanceof Uint8Array) && o?.buffer) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
    return new Uint8Array(o.buffer, o.byteOffset, o.byteLength)
  }

  throw new Error('Expected Uint8Array')
}

/**
 * Recovers both recovery bit 0|1 candidates from
 * an authenticator produced signature.
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

export function decodePubFromDID(did: string): Uint8Array{
  const multicodecPubKey: Uint8Array = u8a.fromString(did.replace('did:key:z', ''), 'base58btc')
  const keyType = varint.decode(multicodecPubKey)
  if (keyType !== 0x1200) throw new Error('Expected p256 public key')
  return multicodecPubKey.slice(varint.decode.bytes)
}

export function encodeDIDFromPub(publicKey: Uint8Array): string {
  const CODE = new Uint8Array(varint.encode(0x1200)) // p-256 multicodec
  const bytes = u8a.concat([CODE, publicKey])
  return `did:key:z${u8a.toString(bytes, 'base58btc')}`
}
