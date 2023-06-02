/**
 * # Webcrypto Key Did Provider
 * This is a DID Provider which implements [EIP2844](https://eips.ethereum.org/EIPS/eip-2844) for `did:key:` using webcrypto with non-extractable keys.
 *
 * ## Installation
 *
 * ```
 * npm install --save @didtools/key-webcrypto
 * ```
 *
 * ## Usage
 *
 * ```js
 * import { CryptoKeyProvider, generateP256KeyPair } from '@didtools/key-webcrypto'
 * import KeyResolver from 'key-did-resolver'
 * import { DID } from 'dids'
 *
 * const keyPair = generateP256KeyPair()
 * const provider = new WebcryptoProvider(keypair)
 * const did = new DID({ provider, resolver: KeyResolver.getResolver() })
 * await did.authenticate()
 *
 * // log the DID
 * console.log(did.id)
 *
 * // create JWS
 * const { jws, linkedBlock } = await did.createDagJWS({ hello: 'world' })
 *
 * // verify JWS
 * await did.verifyJWS(jws)
 * ```
 *
 * @module @didtools/key-webcrypto
 */

import type {
  AuthParams,
  CreateJWSParams,
  DIDMethodName,
  DIDProviderMethods,
  DIDProvider,
  GeneralJWS,
} from 'dids'
import stringify from 'fast-json-stable-stringify'
import { RPCError, createHandler } from 'rpc-utils'
import type { HandlerMethods, RPCRequest, RPCResponse, SendRequestFunc } from 'rpc-utils'
import * as u8a from 'uint8arrays'
import varint from 'varint'

function toStableObject(obj: Record<string, any>): Record<string, any> {
  return JSON.parse(stringify(obj)) as Record<string, any>
}

/**
 *  compress a public key with points x,y expressed as UintArrays
 * source: https://stackoverflow.com/questions/17171542/algorithm-for-elliptic-curve-point-compression
 *
 *  @param {Uint8Array}  x  x point of public key
 *  @param {Uint8Array}  y  y point of public key
 *  @return {Uint8Array} compressed form of public key as Uint8Array
 */
export function ecPointCompress(x: Uint8Array, y: Uint8Array): Uint8Array {
  const out = new Uint8Array(x.length + 1)

  out[0] = 2 + (y[y.length - 1] & 1)
  out.set(x, 1)

  return out
}

// export the raw public key from the CryptoKeyPair using the webcrypto api
export async function getPublicKey({ publicKey }: CryptoKeyPair): Promise<Uint8Array> {
  const rawKey = await window.crypto.subtle.exportKey('raw', publicKey)
  // convert raw key with x,y to a compressed key
  const compressedKey = ecPointCompress(
    new Uint8Array(rawKey.slice(1, 33)),
    new Uint8Array(rawKey.slice(33, 65))
  )
  return compressedKey
}

export function encodeDIDFromPub(publicKey: Uint8Array): string {
  const CODE = varint.encode(0x1200) // p-256 multicodec
  const bytes = u8a.concat([CODE, publicKey])
  return `did:key:z${u8a.toString(bytes, 'base58btc')}`
}

// A method that generates a new key using webcrypto, p-256, extractable false.
export async function generateP256KeyPair(): Promise<CryptoKeyPair> {
  const { privateKey, publicKey } = await window.crypto.subtle.generateKey(
    {
      name: 'ECDSA',
      namedCurve: 'P-256',
    },
    false, // not extractable
    ['sign']
  )
  return { privateKey, publicKey }
}

function toGeneralJWS(jws: string): GeneralJWS {
  const [protectedHeader, payload, signature] = jws.split('.')
  return {
    payload,
    signatures: [{ protected: protectedHeader, signature }],
  }
}

interface Context {
  keyPair: CryptoKeyPair
}

function jsonToBase64Url(obj: any): string {
  return u8a.toString(u8a.fromString(JSON.stringify(obj)), 'base64url')
}

const sign = async (
  payload: Record<string, any> | string,
  did: string,
  cryptoKeyPair: CryptoKeyPair,
  protectedHeader: Record<string, any> = {}
) => {
  const kid = `${did}#${did.split(':')[2]}`
  const header = toStableObject(Object.assign(protectedHeader, { kid, alg: 'ES256' }))
  const encodedHeader = jsonToBase64Url(header)

  const actualPayload =
    typeof payload === 'string' ? payload : jsonToBase64Url(toStableObject(payload))
  const data = `${encodedHeader}.${actualPayload}`
  const signature = await window.crypto.subtle.sign(
    {
      name: 'ECDSA',
      hash: 'SHA-256',
    },
    cryptoKeyPair.privateKey,
    u8a.fromString(data)
  )
  const encodedSignature = u8a.toString(new Uint8Array(signature), 'base64url')
  return `${data}.${encodedSignature}`
}

const didMethods: HandlerMethods<Context, DIDProviderMethods> = {
  did_authenticate: async ({ keyPair }: Context, params: AuthParams) => {
    const did = encodeDIDFromPub(await getPublicKey(keyPair))
    const response = await sign(
      {
        did,
        aud: params.aud,
        nonce: params.nonce,
        paths: params.paths,
        exp: Math.floor(Date.now() / 1000) + 600, // expires 10 min from now
      },
      did,
      keyPair
    )
    return toGeneralJWS(response)
  },
  did_createJWS: async ({ keyPair }: Context, params: CreateJWSParams & { did: string }) => {
    const did = encodeDIDFromPub(await getPublicKey(keyPair))
    const requestDid = params.did.split('#')[0]
    if (requestDid !== did) throw new RPCError(4100, `Unknown DID: ${did}`)
    const jws = await sign(params.payload, did, keyPair, params.protected)
    return { jws: toGeneralJWS(jws) }
  },
  // eslint-disable-next-line @typescript-eslint/require-await
  did_decryptJWE: async () => {
    throw new RPCError(4100, 'Decryption not supported')
  },
}

export class WebcryptoProvider implements DIDProvider {
  _handle: SendRequestFunc<DIDProviderMethods>

  constructor(keyPair: CryptoKeyPair) {
    const handler = createHandler<Context, DIDProviderMethods>(didMethods)
    this._handle = async (msg) => await handler({ keyPair }, msg)
  }

  get isDidProvider(): boolean {
    return true
  }

  async send<Name extends DIDMethodName>(
    msg: RPCRequest<DIDProviderMethods, Name>
  ): Promise<RPCResponse<DIDProviderMethods, Name> | null> {
    return await this._handle(msg)
  }
}
