import {
  SiwStacksMessage,
  Cacao,
  VerifyOptions,
  verifyTimeChecks,
  assertSigned,
  Verifiers,
} from '@didtools/cacao'
import { AccountId } from 'caip'
import { verifyMessageSignatureRsv, hashMessage } from '@stacks/encryption'
import {
  publicKeyFromSignatureRsv,
  createMessageSignature,
  getAddressFromPublicKey,
} from '@stacks/transactions'
import { bytesToHex } from '@stacks/common'

export function getStacksVerifier(): Verifiers {
  return {
    // eslint-disable-next-line @typescript-eslint/require-await
    'stacks:secp256k1': async (cacao: Cacao, opts: VerifyOptions): Promise<void> => {
      verifyStacksSignature(cacao, opts)
    },
  }
}

export function verifyStacksSignature(cacao: Cacao, options: VerifyOptions) {
  assertSigned(cacao)
  verifyTimeChecks(cacao, options)

  const msg = SiwStacksMessage.fromCacao(cacao)
  let signature = cacao.s.s
  const message = msg.signMessage()

  const recoveredPublicKey = publicKeyFromSignatureRsv(
    bytesToHex(hashMessage(message)),
    createMessageSignature(signature)
  )
  const recoveredAddress = getAddressFromPublicKey(recoveredPublicKey)

  const issuerAddress = AccountId.parse(cacao.p.iss.replace('did:pkh:', '')).address
  if (issuerAddress !== recoveredAddress) {
    throw new Error(`address does not belong to publicKey`)
  }

  if (!verifyMessageSignatureRsv({ message, publicKey: recoveredPublicKey, signature })) {
    throw new Error(`Signature does not belong to issuer`)
  }
}
