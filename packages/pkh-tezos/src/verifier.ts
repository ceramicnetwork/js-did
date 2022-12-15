import { verifySignature, getPkhfromPk } from '@taquito/utils'
import {
  SiwTezosMessage,
  Cacao,
  VerifyOptions,
  verifyTimeChecks,
  assertSigned,
  Verifiers,
} from '@didtools/cacao'
import { AccountId } from 'caip'

export function getTezosVerifier(): Verifiers {
  return {
    // eslint-disable-next-line @typescript-eslint/require-await
    'tezos:ed25519': async (cacao: Cacao, opts: VerifyOptions): Promise<void> => {
      await verifyTezosSignature(cacao, opts)
    },
  }
}

export async function verifyTezosSignature(cacao: Cacao, options: VerifyOptions) {
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