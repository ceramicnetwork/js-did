import {
  SiwsMessage,
  Cacao,
  VerifyOptions,
  verifyTimeChecks,
  assertSigned,
  Verifiers,
} from '@didtools/cacao'
import { AccountId } from 'caip'
import { verify } from '@stablelib/ed25519'
import { fromString as u8aFromString } from 'uint8arrays/from-string'

/**
 *  Get a configured CACAO SolanaVerifier map for Solana accounts
 */
export function getSolanaVerifier(): Verifiers {
  return {
    // eslint-disable-next-line @typescript-eslint/require-await
    'solana:ed25519': async (cacao: Cacao, opts: VerifyOptions): Promise<void> => {
      verifySolanaSignature(cacao, opts)
    },
  }
}

export function verifySolanaSignature(cacao: Cacao, options: VerifyOptions) {
  assertSigned(cacao)
  verifyTimeChecks(cacao, options)

  const msg = SiwsMessage.fromCacao(cacao)
  const sig = cacao.s.s

  const messageU8 = msg.signMessage()
  const sigU8 = u8aFromString(sig, 'base58btc')
  const issAddress = AccountId.parse(cacao.p.iss.replace('did:pkh:', '')).address
  const pubKeyU8 = u8aFromString(issAddress, 'base58btc')

  if (!verify(pubKeyU8, messageU8, sigU8)) {
    throw new Error(`Signature does not belong to issuer`)
  }
}
