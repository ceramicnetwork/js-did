import {
    SiwSuiMessage,
    Cacao,
    VerifyOptions,
    verifyTimeChecks,
    assertSigned,
    Verifiers,
  } from '@didtools/cacao'
  import { AccountId } from 'caip'
  import nacl from 'tweetnacl';
  import { fromString as u8aFromString } from 'uint8arrays/from-string'
  
  /**
   *  Get a configured CACAO SuiVerifier map for Sui accounts
   */
  export function getSuiVerifier(): Verifiers {
    return {
      // eslint-disable-next-line @typescript-eslint/require-await
      'sui:ed25519': async (cacao: Cacao, opts: VerifyOptions): Promise<void> => {
        verifySuiSignature(cacao, opts)
      },
    }
  }
  
  export function verifySuiSignature(cacao: Cacao, options: VerifyOptions) {
    assertSigned(cacao)
    verifyTimeChecks(cacao, options)
  
    const msg = SiwSuiMessage.fromCacao(cacao)
    const sig = cacao.s.s
  
    const messageU8 = msg.signMessage()
    const sigU8 = u8aFromString(sig, 'base64')
    const issAddress = AccountId.parse(cacao.p.iss.replace('did:pkh:', '')).address
    const pubKeyU8 = u8aFromString(issAddress, 'base64')
  
    if (!nacl.sign.detached.verify(messageU8, sigU8, pubKeyU8)) {
      throw new Error(`Signature does not belong to issuer`)
    }
  }