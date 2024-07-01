import { Wallet as EthereumWallet } from '@ethersproject/wallet'
import { AccountId } from 'caip'
import { EthereumNodeAuth } from '@didtools/pkh-ethereum'
import type { AuthMethod } from '@didtools/cacao'
import { EventEmitter } from 'node:events'
import { fromString, toString } from 'uint8arrays'

export class EthereumProvider extends EventEmitter {
  wallet: EthereumWallet

  constructor(wallet: EthereumWallet) {
    super()
    this.wallet = wallet
  }

  send(
    request: { method: string; params: Array<any> },
    callback: (err: Error | null | undefined, res?: any) => void,
  ): void {
    if (request.method === 'eth_chainId') {
      callback(null, { result: '1' })
    } else if (request.method === 'personal_sign') {
      let message = request.params[0] as string
      if (message.startsWith('0x')) {
        message = toString(fromString(message.slice(2), 'base16'), 'utf8')
      }
      callback(null, { result: this.wallet.signMessage(message) })
    } else {
      callback(new Error(`Unsupported method: ${request.method}`))
    }
  }
}

export type AuthAndAccount = {
  authMethod: AuthMethod
  account: AccountId
}

export async function createEthereumAuthMethod(mnemonic?: string): Promise<AuthAndAccount> {
  const wallet = mnemonic ? EthereumWallet.fromMnemonic(mnemonic) : EthereumWallet.createRandom()
  const provider = new EthereumProvider(wallet)
  const accountId = new AccountId({
    address: wallet.address.toLowerCase(),
    chainId: { namespace: 'eip155', reference: '1' },
  })
  return {
    account: accountId,
    authMethod: await EthereumNodeAuth.getAuthMethod(provider, accountId, 'testapp'),
  }
}
