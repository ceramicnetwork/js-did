import {
  SiwTezosMessage,
  Cacao,
  VerifyOptions,
  verifyTimeChecks,
  assertSigned,
  Verifiers,
} from '@didtools/cacao'
import { AccountId } from 'caip'
import * as u8a from 'uint8arrays'
import { hash } from '@stablelib/blake2b'
import { verify } from '@stablelib/ed25519'

// EDPK
const TZ1Prefix = new Uint8Array([6, 161, 159])
const TZ1Length = 20
const EDPKPrefix = new Uint8Array([13, 15, 37, 217])
const EDSIGPrefix = new Uint8Array([9, 245, 205, 134, 18])

export function getTezosVerifier(): Verifiers {
  return {
    // eslint-disable-next-line @typescript-eslint/require-await
    'tezos:ed25519': async (cacao: Cacao, opts: VerifyOptions): Promise<void> => {
      verifyTezosSignature(cacao, opts)
    },
  }
}

export function getPkhfromPk(publicKey: string): string {
  const pkPrefix = publicKey.substring(0, 4)
  if (pkPrefix !== 'edpk')
    throw new Error('Tezos Signature type not supported, only type tezos:ed25519')
  const decoded = b58cdecode(publicKey, EDPKPrefix)
  const hashed = hash(decoded, TZ1Length)
  const result = b58cencode(hashed, TZ1Prefix)
  return result
}

function verifyEdSignature(
  decodedSig: Uint8Array,
  bytesHash: Uint8Array,
  decodedPublicKey: Uint8Array
) {
  try {
    return verify(decodedPublicKey, bytesHash, decodedSig)
  } catch (e) {
    return false
  }
}

function b58cdecode(enc: string, prefixArg: Uint8Array): Uint8Array {
  return u8a.fromString(enc, 'base58btc').slice(prefixArg.length)
}

function b58cencode(value: Uint8Array, prefix: Uint8Array) {
  const n = new Uint8Array(prefix.length + value.length)
  n.set(prefix)
  n.set(value, prefix.length)
  return u8a.toString(n, 'base58btc')
}

export function verifySignature(payload: string, publicKey: string, signature: string): boolean {
  const pkPrefix = publicKey.substring(0, 4)
  const sigPrefix = signature.startsWith('sig') ? signature.substr(0, 3) : signature.substr(0, 5)

  if (pkPrefix !== 'edpk' || sigPrefix !== 'edsk')
    throw new Error('Tezos Signature type not supported, only type tezos:ed25519')

  const decodedPublicKey = b58cdecode(publicKey, EDPKPrefix)
  const decodedSig = b58cdecode(signature, EDSIGPrefix)
  const bytesHash = hash(u8a.fromString(payload, 'base16'), 32)
  return verifyEdSignature(decodedSig, bytesHash, decodedPublicKey)
}

export function verifyTezosSignature(cacao: Cacao, options: VerifyOptions) {
  assertSigned(cacao)
  verifyTimeChecks(cacao, options)

  const msg = SiwTezosMessage.fromCacao(cacao)
  let signature = cacao.s.s

  const publicKey = signature.slice(99)
  signature = signature.slice(0, 99)

  const issuerAddress = AccountId.parse(cacao.p.iss.replace('did:pkh:', '')).address

  if (issuerAddress !== getPkhfromPk(publicKey)) {
    throw new Error(`address does not belong to publicKey`)
  }

  const payload = msg.signMessage()

  if (!verifySignature(payload, publicKey, signature)) {
    throw new Error(`Signature does not belong to issuer`)
  }
}
