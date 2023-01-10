import { AccountId } from 'caip'
import { randomString } from '@stablelib/random'
import { Cacao, SiwStacksMessage, AuthMethod, AuthMethodOpts } from '@didtools/cacao'

export const VERSION = '1'
export const CHAIN_NAMESPACE = 'stacks'

export const chainIdMap = {
  mainnet: '1',
  testnet: '2147483648',
}

type StacksNetwork = 'mainnet' | 'testnet'

export namespace StacksWebAuth {
  /**
   * Get a configured authMethod for an Ethereum account in a web based environment
   */
  // eslint-disable-next-line @typescript-eslint/require-await
  export async function getAuthMethod(
    stacksProvider: any,
    account: AccountId
  ): Promise<AuthMethod> {
    if (typeof window === 'undefined')
      throw new Error('Web Auth method requires browser environment')
    const domain = (window as Window).location.hostname

    return async (opts: AuthMethodOpts): Promise<Cacao> => {
      opts.domain = domain
      return createCACAO(opts, stacksProvider, account)
    }
  }
}

export interface SignatureData {
  signature: string
  publicKey: string
}

export type SupportedProvider = {
  signatureRequest: (payload: string) => Promise<SignatureData>
}

export function assertSupportedProvider(
  stacksProvider: any
): asserts stacksProvider is SupportedProvider {
  const p = stacksProvider as SupportedProvider
  if (p.signatureRequest === null || p.signatureRequest === undefined) {
    throw new Error(`Unsupported provider; provider must implement signatureRequest`)
  }
}

async function sign(stacksProvider: any, message: string) {
  assertSupportedProvider(stacksProvider)
  const { signature } = await stacksProvider.signatureRequest(message)
  return signature
}

async function createCACAO(
  opts: AuthMethodOpts,
  stacksProvider: any,
  account: AccountId
): Promise<Cacao> {
  const now = new Date()
  const oneWeekLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

  const siwStacksMessage = new SiwStacksMessage({
    domain: opts.domain,
    address: account.address,
    statement: opts.statement ?? 'Give this application access to some of your data on Ceramic',
    uri: opts.uri,
    version: VERSION,
    nonce: opts.nonce ?? randomString(10),
    issuedAt: now.toISOString(),
    expirationTime: opts.expirationTime ?? oneWeekLater.toISOString(),
    chainId: account.chainId.reference,
    resources: opts.resources,
  })

  const signData = siwStacksMessage.signMessage()
  const signature = await sign(stacksProvider, signData)
  siwStacksMessage.signature = signature
  return Cacao.fromSiwStacksMessage(siwStacksMessage)
}

/**
 * Helper function to get an accountId (CAIP10) for an Stacks account by Stacks Provider interface, Connection must implement 'TODO()'
 */
// TODO remove ts-ignore
// @ts-ignore
export async function getAccountId(stacksProvider: any, address: string): Promise<AccountId> {
  // TODO hardcoded for now, update once https://github.com/hirosystems/stacks-wallet-web/issues/2991 is resolved
  const stacksChainId = chainIdMap['mainnet']
  const chainId = `${CHAIN_NAMESPACE}:${stacksChainId}`
  return new AccountId({ address, chainId })
}

/**
 * Helper function to get an accountId (CAIP10) for an Stacks account by network string 'mainet' | 'testnet'
 */
export function getAccountIdByNetwork(network: StacksNetwork, address: string): AccountId {
  const chainId = `${CHAIN_NAMESPACE}:${chainIdMap[network]}`
  return new AccountId({ address, chainId })
}
