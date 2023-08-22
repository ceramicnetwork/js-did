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
import { blake2b } from '@noble/hashes/blake2b'
import { sha256 } from '@noble/hashes/sha256'
import { ed25519 } from '@noble/curves/ed25519'
import { secp256k1 } from '@noble/curves/secp256k1'
import { p256 } from '@noble/curves/p256'

// SECP256K1
const TZ2Prefix = new Uint8Array([6, 161, 161]);
const SPPKPrefix = new Uint8Array([3, 254, 226, 86]);
const SPSIGPrefix = new Uint8Array([13, 115, 101, 19, 63]);

// P256
const TZ3Prefix = new Uint8Array([6, 161, 164]);
const P2PKPrefix = new Uint8Array([3, 178, 139, 127]);
const P2SIGPrefix = new Uint8Array([54, 240, 44, 52]);

// ED
const TZ1Prefix = new Uint8Array([6, 161, 159])
const TZ1Length = 20
const EDPKPrefix = new Uint8Array([13, 15, 37, 217])
const EDSIGPrefix = new Uint8Array([9, 245, 205, 134, 18])
const SIGPrefix = new Uint8Array([4, 130, 43])
const Base58CheckSumLength = 4

export function getTezosVerifier(): Verifiers {
  return {
    // eslint-disable-next-line @typescript-eslint/require-await
    'tezos:ed25519': async (cacao: Cacao, opts: VerifyOptions): Promise<void> => {
      verifyTezosSignature(cacao, opts)
    },
    'tezos:secp256k1': async (cacao: Cacao, opts: VerifyOptions): Promise<void> => {
      verifyTezosSignature(cacao, opts)
    },
    'tezos:p256': async (cacao: Cacao, opts: VerifyOptions): Promise<void> => {
      verifyTezosSignature(cacao, opts)
    },
  }
}


function getPkhfromPk(publicKey: string): string {
  const pkPrefix = publicKey.substring(0, 4);
  let prefix;
  let hashFn;

  switch (pkPrefix) {
    case 'edpk':
      prefix = TZ1Prefix;
      hashFn = blake2b;
      break;
    case 'sppk':
      prefix = TZ2Prefix;
      hashFn = blake2b;
      break;
    case 'p2pk':
      prefix = TZ3Prefix;
      hashFn = blake2b;
      break;
    default:
      throw new Error('Unsupported Tezos key type');
  }
  const decoded = b58cdecode(publicKey, getPrefix(pkPrefix, 'pk'));
  const hashed = hashFn(decoded, { dkLen: 20 });
  const result = b58cencode(hashed, prefix);
  return result;
}

function getPrefix(type: string, kind: 'pk' | 'sig') {
  switch (kind) {
    case 'pk':
      switch (type) {
        case 'edpk': return EDPKPrefix;
        case 'sppk': return SPPKPrefix;
        case 'p2pk': return P2PKPrefix;
      }
      break;
    case 'sig':
      switch (type) {
        case 'edsig': case 'sig': return EDSIGPrefix;
        case 'spsig': return SPSIGPrefix;
        case 'p2sig': return P2SIGPrefix;
      }
      break;
  }
  throw new Error('Unsupported Tezos type or kind');
}


function verifyEdSignature(
  decodedSig: Uint8Array,
  bytesHash: Uint8Array,
  decodedPublicKey: Uint8Array
) {
  try {
    return ed25519.verify(decodedSig, bytesHash, decodedPublicKey)
  } catch (e) {
    return false
  }
}

function verifySecp256k1Signature(decodedSig: Uint8Array, bytesHash: Uint8Array, decodedPublicKey: Uint8Array): boolean {
  try {
    return secp256k1.verify(decodedSig, bytesHash, decodedPublicKey);
  } catch (e) {
    return false;
  }
}

function verifyP256Signature(decodedSig: Uint8Array, bytesHash: Uint8Array, decodedPublicKey: Uint8Array): boolean {
  try {
    return p256.verify(decodedSig, bytesHash, decodedPublicKey);
  } catch (e) {
    return false;
  }
}

//bs58btc decoding, bs58check - checksum
function b58cdecode(enc: string, prefixArg: Uint8Array): Uint8Array {
  const u8akey = u8a.fromString(enc, 'base58btc')
  return u8akey.slice(prefixArg.length, u8akey.length - Base58CheckSumLength)
}

//bs58check encoding, bs58btc + checksum
function b58cencode(value: Uint8Array, prefix: Uint8Array) {
  const n = new Uint8Array(prefix.length + value.length)
  n.set(prefix)
  n.set(value, prefix.length)
  const checksum = getCheckSum(n)
  const nc = new Uint8Array(n.length + 4)
  nc.set(n)
  nc.set(checksum, prefix.length + value.length)
  return u8a.toString(nc, 'base58btc')
}

function getCheckSum(u8a: Uint8Array): Uint8Array {
  const hashed = sha256(sha256(u8a))
  return hashed.slice(0, 4)
}


function verifySignature(payload: string, publicKey: string, signature: string): boolean {
  const pkPrefix = publicKey.substring(0, 4);
  const sigPrefix = signature.startsWith('sig') ? signature.substr(0, 3) : signature.substr(0, 5);

  const decodedPublicKey = b58cdecode(publicKey, getPrefix(pkPrefix, 'pk'));
  const decodedSig = b58cdecode(signature, getPrefix(sigPrefix, 'sig'));
  const bytesHash = blake2b(u8a.fromString(payload, 'base16'), { dkLen: 32 });

  switch (pkPrefix) {
    case 'edpk':
      return verifyEdSignature(decodedSig, bytesHash, decodedPublicKey);
    case 'sppk':
      return verifySecp256k1Signature(decodedSig, bytesHash, decodedPublicKey);
    case 'p2pk':
      return verifyP256Signature(decodedSig, bytesHash, decodedPublicKey);
  }

  throw new Error('Tezos Signature type not supported');
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
