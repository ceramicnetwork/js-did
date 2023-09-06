import { p256 } from '@noble/curves/p256'
import * as u8a from 'uint8arrays'
import { encode } from 'cborg'

/**
 * Dummy webauthn/fido2 Mock device that uses
 * p256/ES256(-7).
 * Produces structurally correct and verifiale credentials/signatures for unit tests.
 */
export class MockAuthenticator {
  credentials: any[] = []

  async create (opts: CredentialCreationOptions) {
    const secret = p256.utils.randomPrivateKey()
    const pk = p256.getPublicKey(secret)
    const rawId = u8a.concat([pk.slice(1, 14), u8a.fromString('STUB', 'utf8')])
    const id = u8a.toString(rawId, 'base64url')
    const userHandle = hash(opts.publicKey?.user?.id || p256.CURVE.randomBytes(32))
    this.credentials.push({ secret, pk, id, rawId, userHandle }) // save for later
    const authData = mkAuthData(pk)
    const attestationObject = bufToU8(encode({ fmt: 'none', attStmt: {}, authData }))
    const challenge = u8a.toString(opts.publicKey?.challenge as Uint8Array, 'base64url')
    const rawCDJ = {
      type: 'webauthn.create',
      origin: opts.publicKey?.rp?.id,
      challenge,
      crossOrigin: false
    }
    const clientDataJSON = u8a.fromString(JSON.stringify(rawCDJ))
    const out: PublicKeyCredential = {
      authenticatorAttachment: "cross-platform",
      id,
      rawId,
      response: {
        attestationObject,
        clientDataJSON,
        userHandle,
        getPublicKey: () => pk,
        getPublicKeyAlgorithm: () => -7,
        getTransports: () => ['nfc', 'usb'],
        getAuthenticatorData: () => authData
      } as AuthenticatorAttestationResponse,
      type: 'public-key',
      getClientExtensionResults: () => ({})
    }
    // console.log('MockAuthenticator#create()', out)
    return out
  }

  async get (opts) {
    const { secret, id, rawId, userHandle } = this.credentials[0] // pick first
    const challenge = u8a.toString(opts.publicKey.challenge as Uint8Array, 'base64url')
    const rawCDJ = {
      type: 'webauthn.get',
      origin: opts.publicKey?.rp?.id,
      challenge,
      crossOrigin: false
    }
    const clientDataJSON = u8a.fromString(JSON.stringify(rawCDJ))
    // This authenticatorData dosen't matter really but don't try to decode it.
    const authenticatorData = u8a.fromString('f689f6b7489197aacf01172f02a82e0715f72aff70d5f758b9b0f7d3999978d20500000004')
    const msgHash = hash(u8a.concat([authenticatorData, hash(clientDataJSON)]))
    const signature = p256.sign(msgHash, secret).toDERRawBytes()
    const out: PublicKeyCredential = {
      authenticatorAttachment: 'cross-platform',
      id,
      rawId,
      response: {
        authenticatorData,
        clientDataJSON,
        signature,
        userHandle
      } as AuthenticatorAssertionResponse,
      type: 'public-key',
      getClientExtensionResults: () => ({})
    }
    // console.log('MockAuthenticator#get()', out)
    return out
  }
}

// cbor decoders in @didtools/* codebase do not support numerical keys,
// assuming that the encode does not either.
// The offset in authenticator data is static,
// so we use a live sample and inject the test-key to satisfy utils.js#decodeAuthenticatorData().
function mkAuthData (pk) {
  const authDataCreate = 'f689f6b7489197aacf01172f02a82e0715f72aff70d5f758b9b0f7d3999978d2c5000000020000000000000000000000000000000000309face7743395482aefb4e1a67134641cdea3529c5752594090f26252e2198e4a0c547a4b0bd2fa346500e47cdf9c58f6a50102032620012158209face7743395482aefb4e1a671aafbf1566cc099f7647db230952bc169f43f9c2258203462f7968f7824f955570f3453280452948cccf132f03f369a2e834546649a78a16b6372656450726f7465637402'
  // const _pk = '029face7743395482aefb4e1a671aafbf1566cc099f7647db230952bc169f43f9c'
  // const _x = '9face7743395482aefb4e1a671aafbf1566cc099f7647db230952bc169f43f9c'
  // const _y = '3462f7968f7824f955570f3453280452948cccf132f03f369a2e834546649a78'
  const buffer = u8a.fromString(authDataCreate, 'hex')
  const point = p256.ProjectivePoint.fromHex(u8a.toString(pk, 'hex'))
  const uncompressed = point.toRawBytes(false)
  const offsetX = 113
  const offsetY = 148
  const x = uncompressed.slice(1, 33)
  const y = uncompressed.slice(33)
  buffer.set(x, offsetX)
  buffer.set(y, offsetY)
  return buffer
}

// node:Buffer to Uint8Array
function bufToU8(b) {
  if (b instanceof Uint8Array || b instanceof ArrayBuffer) return b // no conversion needed
  return new Uint8Array(b.buffer.slice(b.offset, b.offset + b.length))
}
function hash (m) { return p256.CURVE.hash(m) }
