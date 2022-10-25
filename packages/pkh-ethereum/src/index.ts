/**
 * # Ethereum AuthMethod and Verifier
 * Implements support to authenticate, authorize and verify with Ethereum accounts as a did:pkh with SIWE(X) and CACAO. 
 * Primarly used with `did-session` and `@didtools/cacao`. 
 * 
 * ## Installation
 * 
 * ```
 * npm install --save @didtools/pkh-ethereum
 * ```
 * 
 * ## Auth Usage
 * 
 * To Auth in web based env, use any injected web3 provider that implements the standard interface with `EthereumWebAuth`.
 * 
 * ```ts
 * // Web Auth Usage
 * import { EthereumWebAuth, getAccountId } from '@didtools/pkh-ethereum'
 * // ...
 * 
 * const ethProvider = // import/get your web3 eth provider
 * const addresses = await ethProvider.enable()
 * const accountId = await getAccountId(ethProvider, addresses[0])
 * 
 * const authMethod = EthereumWebAuth.getAuthMethod(ethProvider, accountId)
 * ```
 * 
 * To Auth in a Node based env, use any standard web3 provider interface with `EthereumNodeAuth`
 * 
 * 
 * ```ts
 * // Node Auth Usage
 * import { EthereumNodeAuth, getAccountId } from '@didtools/pkh-ethereum'
 * // ...
 * 
 * const ethProvider = // import/get your web3 eth provider
 * const addresses = await ethProvider.enable()
 * const accountId = await getAccountId(ethProvider, addresses[0])
 * const appName = 'MyNodeApp'
 * 
 * const authMethod = EthereumNodeAuth.getAuthMethod(ethProvider, accountId, appName)
 * ```
 * 
 * To use with did-session and reference did-session docs for more details.
 * 
 * ```ts
 * const client = new ComposeClient({ceramic, definition})
 * const resources = client.resources
 * 
 * const session = await DIDSession.authorize(authMethod, { resources })
 * client.setDID(session.did)
 * ```
 *
 * ## Configuration
 *
 * AuthMethod creators consume a standard Ethereum provider and an AccountId. AccountID follows the 
 * CAIP10 standard. The helper method `getAccountID` is provided, but you can also create an AccountID
 * using the CAIP library directly. 
 *
 * ```ts
 * import { AccountId } from 'caip'
 * import { getAccountId } from '@didtools/pkh-ethereum'
 *
 * const accountId = await getAccountId(ethProvider, addresses[0])
 * 
 * const ethMainnetChainId = '1'
 * const chainNameSpace = 'eip155'
 * const chainId = `${chainNameSpace}:${ethMainnetChainId}`
 * const accountIdCAIP = new AccountId({ address, chainId })
 * 
 * // accountId = accountIdCAIP
 * ```
 *
 * The `EthereumNodeAuth` additionally consumes an application name. The 'EthereumWebAuth' method uses your 
 * application domain name by default.
 * 
 * ```ts
 * import { EthereumNodeAuth  } from '@didtools/pkh-ethereum'

 * const appName = 'MyNodeApp'
 * const authMethod = EthereumNodeAuth.getAuthMethod(ethProvider, accountId, appName)
 * ```
 * 
 * ## Verifier Usage
 * 
 * Verifiers are needed to verify different did:pkh signed payloads using CACAO. Libraries that need them will
 * consume a verifiers map allowing your to register the verifiers you want to support. 
 * 
 * ```ts
 * import { Cacao } from '@didtools/cacao'
 * import { getEIP191Verifier } from '@didtools/pkh-ethereum'
 * import { DID } from 'dids'
 * 
 * const verifiers = {
 * 	...getEIP191Verifier()
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
 * @module pkh-ethereum
 */

export * from './authmethod.js'
export * from './verifier.js'
export * from './utils.js'
