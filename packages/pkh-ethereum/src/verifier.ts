import {
  SiweMessage,
  asLegacyChainIdString,
  Cacao,
  VerifyOptions,
  verifyTimeChecks,
  assertSigned,
  Verifiers,
} from '@didtools/cacao'
import { AccountId } from 'caip'
import { bytesToHex, concatBytes, hexToBytes, utf8ToBytes } from '@noble/hashes/utils'
import { keccak_256 } from '@noble/hashes/sha3'
import { secp256k1 } from '@noble/curves/secp256k1'

/**
 *  Get a configured CACAO EIP191Verifier map for Ethereum EOA accounts
 */
export function getEIP191Verifier(): Verifiers {
  return {
    // eslint-disable-next-line @typescript-eslint/require-await
    eip191: async (cacao: Cacao, opts: VerifyOptions): Promise<void> => {
      verifyEIP191Signature(cacao, opts)
    },
  }
}

// CACAOs issued after that day must be of new format
export const LEGACY_CHAIN_ID_REORG_DATE = new Date('2022-09-20').valueOf()

const MESSAGE_PREFIX = '\x19Ethereum Signed Message:\n'

function verifyMessage(message: Uint8Array | string, signature: string): string {
  const effectiveMessage = typeof message === 'string' ? utf8ToBytes(message) : message
  const digest = keccak_256(
    concatBytes(utf8ToBytes(MESSAGE_PREFIX), utf8ToBytes(String(message.length)), effectiveMessage),
  )
  const signatureBytes = hexToBytes(signature.replace(/^0x/, ''))
  let v = signatureBytes[64]
  if (v === 0 || v === 1) v += 27

  const publicKey = secp256k1.Signature.fromCompact(signatureBytes.slice(0, 64))
    .addRecoveryBit(v - 27)
    .recoverPublicKey(digest)
    .toRawBytes(false)
  const recoveredAddress = keccak_256(publicKey.subarray(1)).subarray(-20)
  return `0x${bytesToHex(recoveredAddress)}`
}

export function verifyEIP191Signature(cacao: Cacao, options: VerifyOptions) {
  assertSigned(cacao)
  verifyTimeChecks(cacao, options)

  const recoveredAddress = verifyMessage(SiweMessage.fromCacao(cacao).toMessage(), cacao.s.s)
  const recoveredAddresses = [recoveredAddress]

  if (Date.parse(cacao.p.iat) <= LEGACY_CHAIN_ID_REORG_DATE) {
    const legacyChainIdRecoveredAddress = verifyMessage(
      asLegacyChainIdString(SiweMessage.fromCacao(cacao), 'Ethereum'),
      cacao.s.s,
    )
    recoveredAddresses.push(legacyChainIdRecoveredAddress)
  }

  const issuerAddress = AccountId.parse(cacao.p.iss.replace('did:pkh:', '')).address.toLowerCase()
  if (!recoveredAddresses.includes(issuerAddress)) {
    throw new Error(`Signature does not belong to issuer`)
  }
}
