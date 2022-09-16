
import { Cacao, SiweMessage, AuthMethod, AuthMethodOpts } from 'ceramic-cacao'
import { randomString } from '@stablelib/random'
import { AccountId } from 'caip'
import { safeSend } from './utils.js'

const VERSION = '1'

export namespace EthereumWebAuth {
  export async function getAuthMethod(ethProvider: any, account: AccountId): Promise<AuthMethod> {

    if (typeof window !== 'undefined') throw new Error('Web Auth method requires browser environment')
    const domain = (window as Window).location.hostname

    return async (opts: AuthMethodOpts): Promise<Cacao> => {
      opts.domain = domain
      return createCACAO(opts, ethProvider, account)
    } 
  }
}

export namespace EthereumNodeAuth {
  export async function getAuthMethod(ethProvider: any, account: AccountId, appName: string): Promise<AuthMethod> {
    const domain = appName

    return async (opts: AuthMethodOpts): Promise<Cacao> => {
      opts.domain = domain
      return createCACAO(opts, ethProvider, account)
    } 
  }
}

async function createCACAO  (opts: AuthMethodOpts, ethProvider: any, account: AccountId): Promise<Cacao> {
  const now = new Date()
  const oneDayLater = new Date(now.getTime() + 24 * 60 * 60 * 1000)

  const siweMessage = new SiweMessage({
    domain: opts.domain,
    address: account.address,
    statement: opts.statement ?? 'Give this application access to some of your data on Ceramic',
    uri: opts.uri,
    version: VERSION,
    nonce: opts.nonce ?? randomString(10),
    issuedAt: now.toISOString(),
    expirationTime: opts.expirationTime ?? oneDayLater.toISOString(),
    chainId: account.chainId.reference,
    resources: opts.resources
  })
  const signature = await safeSend(ethProvider, 'personal_sign', [
    siweMessage.signMessage(),
    account.address,
  ])
  siweMessage.signature = signature
  return  Cacao.fromSiweMessage(siweMessage)
}

//TODO caip10 helpers
// export async function getAccount(ethProvider: provider): Promise<CAIP10> {
  // get chain id from provider
  // get address from provider
  // return caip10
// }
