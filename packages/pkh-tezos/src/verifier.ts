import { verifySignature } from '@taquito/utils'
import {
  SiwTezosMessage,
  Cacao,
  VerifyOptions,
  verifyTimeChecks,
  assertSigned,
  Verifiers
} from '@didtools/cacao'
import { AccountId } from 'caip'

export function getTezosVerifier(): Verifiers {
  return {
    // eslint-disable-next-line @typescript-eslint/require-await
    'tezos:ed25519': async (cacao: Cacao, opts: VerifyOptions): Promise<void> => {
      await verifyTezosSignature(cacao, opts)
    }
  }
}

export async function verifyTezosSignature(cacao: Cacao, options: VerifyOptions) {
  assertSigned(cacao)
  verifyTimeChecks(cacao, options)

  const msg = SiwTezosMessage.fromCacao(cacao)
  const signature = cacao.s.s
  const issuerAddress = AccountId.parse(cacao.p.iss.replace('did:pkh:', '')).address

  const payload = msg.signMessage()

  const publicKey = await publicKeyFinder(issuerAddress)

  if (!verifySignature(payload, publicKey, signature)) {
    throw new Error(`Signature does not belong to issuer`)
  }
}

async function publicKeyFinder(address: string): Promise<string> {
  const response = await fetch(`https://api.tzstats.com/explorer/account/${address}`)
  const json = await response.json()
  const result = json.pubkey
  if (result == null) {
    throw new Error("public key not found")
  }
  return result
}
