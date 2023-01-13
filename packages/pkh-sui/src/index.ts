/**
 * # Sui AuthMethod and Verifier
 * Implements support to authenticate, authorize and verify with Sui accounts as a did:pkh with SIWS(X) and CACAO.
 * Primarly used with `did-session` and `@didtools/cacao`.
 *
 * ## Installation
 *
 * ```
 * npm install --save @didtools/pkh-solana
 * ```
 *
 * ## Auth Usage
 *
 * To Auth in web based env, use any injected Sui provider that implements the sui wallet standards interface with `SuiWebAuth`. see https://github.com/MystenLabs/sui/tree/main/sdk/wallet-adapter/wallet-standard and https://github.com/suiet/wallet-kit 
 *
 * ```js
 * // Web Auth Usage
 * import { SuiWebAuth, getAccountIdByNetwork } from '@didtools/pkh-sui'
 * // ...
 *
 * const suiProvider = // import/get your Solana provider (ie: window.phantom.solana)
 * const address = await suiProvider.connect().address
 * const accountId = getAccountIdByNetwork('mainnet', address.publicKey.toString())
 *
 * const authMethod = await SolanaWebAuth.getAuthMethod(solProvider, accountId)
 * ```
 *
 * To Auth in a Node based env, use any standard Solana provider interface with `SolanaNodeAuth`
 *
 *
 * ```js
 * // Node Auth Usage
 * import { SolanaNodeAuth, getAccountIdByNetwork } from '@didtools/pkh-solana'
 * // ...
 *
 * const solProvider = // import/get your Solana provider (ie: window.phantom.solana)
 * const address = await solProvider.connect()
 * const accountId = getAccountIdByNetwork('mainnet', address.publicKey.toString())
 * const appName = 'MyNodeApp'
 *
 * const authMethod = await SuiWebAuth.getAuthMethod(suiProvider, accountId, appName)
 * ```
 *
 * To use with did-session and reference did-session docs for more details.
 *
 * ```js
 * const client = new ComposeClient({ceramic, definition})
 * const resources = client.resources
 *
 * const session = await DIDSession.authorize(authMethod, { resources })
 * client.setDID(session.did)
 * ```
 *
 * ## Configuration
 *
 * AuthMethod creators consume a standard Sui provider and an AccountId. AccountID follows the
 * CAIP10 standard. The helper methods `getAccountIdByNetwork` and `getAccountId` are provided, but you can also create an AccountID
 * using the CAIP library directly.
 *
 * ```js
 * import { AccountId } from 'caip'
 * import { getAccountIdByNetwork, getAccountId } from '@didtools/pkh-sui'
 *
 * // Using network string
 * const accountId = getAccountIdByNetwork('mainnet', address)
 *
 * // With CAIP
 * const suiMainnetChainId = 'mainnet'
 * const chainNameSpace = 'sui'
 * const chainId = `${chainNameSpace}:${ethMainnetChainId}`
 * const accountIdCAIP = new AccountId({ address, chainId })
 *
 * // Using Solana Connection to query connect network/chain
 * const connection = new Connection(solanaWeb3.clusterApiUrl("mainnet-beta"))
 * const accountIdByConnection = await getAccountIdSolana(connection, address)
 *
 * // accountId = accountIdCAIP = accountIdByConnection
 * ```
 *
 *
 * ## Verifier Usage
 *
 * Verifiers are needed to verify different did:pkh signed payloads using CACAO. Libraries that need them will
 * consume a verifiers map allowing your to register the verifiers you want to support.
 *
 * ```js
 * import { Cacao } from '@didtools/cacao'
 * import { getSuiVerifier } from '@didtools/pkh-sui'
 * import { DID } from 'dids'
 *
 * const verifiers = {
 * 	...getSuierifier()
 * }
 *
 * // Directly with cacao
 * Cacao.verify(cacao, { verifiers, ...opts})
 *
 * // With DIDS, reference DIDS for more details
 * const dids = //configured dids instance
 * await dids.verifyJWS(jws, { capability, verifiers, ...opts})
 * ```
 *
 * @module pkh-sui
 */

export * from './authmethod.js'
export * from './verifier.js'