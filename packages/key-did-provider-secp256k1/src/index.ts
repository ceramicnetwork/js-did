/**
 * # secp256k1 Key Did Provider
 * This is a DID Provider which implements [EIP2844](https://eips.ethereum.org/EIPS/eip-2844) for `did:key:` using secp256k1.
 *
 * ## Installation
 *
 * ```
 * npm install --save @didtools/key-secp256k1
 * ```
 *
 * ## Usage
 *
 * ```js
 * import { Secp256k1Provider } from '@didtools/key-secp256k1'
 * import KeyResolver from 'key-did-resolver'
 * import { DID } from 'dids'
 *
 * const seed = new Uint8Array(...) //  32 bytes with high entropy
 * const provider = new Secp256k1Provider(seed)
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
 * @module @didtools/key-secp256k1
 */

import { createJWS, ES256KSigner } from 'did-jwt'
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
import elliptic from 'elliptic'
const EC = elliptic.ec
const ec = new EC('secp256k1')

function toStableObject(obj: Record<string, any>): Record<string, any> {
  return JSON.parse(stringify(obj)) as Record<string, any>
}

export function encodeDIDFromPub(publicKey: Uint8Array): string {
  const bytes = new Uint8Array(publicKey.length + 2)
  bytes[0] = 0xe7 // secp256k1 multicodec
  // The multicodec is encoded as a varint so we need to add this.
  // See js-multicodec for a general implementation
  bytes[1] = 0x01
  bytes.set(publicKey, 2)
  return `did:key:z${u8a.toString(bytes, 'base58btc')}`
}

export function encodeDIDFromPriv(secretKey: Uint8Array): string {
  const pubBytes = ec.keyFromPrivate(secretKey).getPublic(true, 'array')
  return encodeDIDFromPub(Uint8Array.from(pubBytes))
}

function toGeneralJWS(jws: string): GeneralJWS {
  const [protectedHeader, payload, signature] = jws.split('.')
  return {
    payload,
    signatures: [{ protected: protectedHeader, signature }],
  }
}

interface Context {
  did: string
  secretKey: Uint8Array
}

const sign = async (
  payload: Record<string, any> | string,
  did: string,
  secretKey: Uint8Array,
  protectedHeader: Record<string, any> = {}
) => {
  const kid = `${did}#${did.split(':')[2]}`
  const signer = ES256KSigner(secretKey)
  const header = toStableObject(Object.assign(protectedHeader, { kid, alg: 'ES256K' }))

  return createJWS(typeof payload === 'string' ? payload : toStableObject(payload), signer, header)
}

const didMethods: HandlerMethods<Context, DIDProviderMethods> = {
  did_authenticate: async ({ did, secretKey }, params: AuthParams) => {
    const response = await sign(
      {
        did,
        aud: params.aud,
        nonce: params.nonce,
        paths: params.paths,
        exp: Math.floor(Date.now() / 1000) + 600, // expires 10 min from now
      },
      did,
      secretKey
    )
    return toGeneralJWS(response)
  },
  did_createJWS: async ({ did, secretKey }, params: CreateJWSParams & { did: string }) => {
    const requestDid = params.did.split('#')[0]
    if (requestDid !== did) throw new RPCError(4100, `Unknown DID: ${did}`)
    const jws = await sign(params.payload, did, secretKey, params.protected)
    return { jws: toGeneralJWS(jws) }
  },
  // eslint-disable-next-line @typescript-eslint/require-await
  did_decryptJWE: async () => {
    throw new RPCError(4100, 'Decryption not supported')
  },
}

export class Secp256k1Provider implements DIDProvider {
  _handle: SendRequestFunc<DIDProviderMethods>

  constructor(seed: Uint8Array) {
    const did = encodeDIDFromPriv(seed)
    const handler = createHandler<Context, DIDProviderMethods>(didMethods)
    this._handle = async (msg) => await handler({ did, secretKey: seed }, msg)
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
