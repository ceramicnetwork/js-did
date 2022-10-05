import { verifyMessage } from '@ethersproject/wallet'
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

export function verifyEIP191Signature(cacao: Cacao, options: VerifyOptions) {
  assertSigned(cacao)
  verifyTimeChecks(cacao, options)

  const recoveredAddress = verifyMessage(
    SiweMessage.fromCacao(cacao).toMessage(),
    cacao.s.s
  ).toLowerCase()
  const recoveredAddresses = [recoveredAddress]

  if (Date.parse(cacao.p.iat) <= LEGACY_CHAIN_ID_REORG_DATE) {
    const legacyChainIdRecoveredAddress = verifyMessage(
      asLegacyChainIdString(SiweMessage.fromCacao(cacao), 'Ethereum'),
      cacao.s.s
    ).toLowerCase()
    recoveredAddresses.push(legacyChainIdRecoveredAddress)
  }

  const issuerAddress = AccountId.parse(cacao.p.iss.replace('did:pkh:', '')).address.toLowerCase()
  if (!recoveredAddresses.includes(issuerAddress)) {
    throw new Error(`Signature does not belong to issuer`)
  }
}
