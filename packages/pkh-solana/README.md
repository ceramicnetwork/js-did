# Solana AuthMethod and Verifier
Implements support to authenticate, authorize and verify with Solana accounts as a did:pkh with SIWS(X) and CACAO. 
Primarly used with `did-session` and `@didtools/cacao`. 

## Installation

```
npm install --save @didtools/pkh-solana
```

## Auth Usage

To Auth in web based env, use any injected Solana provider that implements the standard wallet/provider interface with `SolanaWebAuth`.

```js
// Web Auth Usage
import { SolanaWebAuth, getAccountIdByNetwork } from '@didtools/pkh-solana'
// ...

const solProvider = // import/get your Solana provider (ie: window.phantom.solana)
const address = await solProvider.connect()
const accountId = getAccountIdByNetwork('mainnet', address.publicKey.toString())

const authMethod = await SolanaWebAuth.getAuthMethod(solProvider, accountId)
```

To Auth in a Node based env, use any standard Solana provider interface with `SolanaNodeAuth`

```js
// Node Auth Usage
import { SolanaNodeAuth, getAccountIdByNetwork } from '@didtools/pkh-solana'
// ...

const solProvider = // import/get your Solana provider (ie: window.phantom.solana)
const address = await solProvider.connect()
const accountId = getAccountIdByNetwork('mainnet', address.publicKey.toString())
const appName = 'MyNodeApp'

const authMethod = await SolanaWebAuth.getAuthMethod(solProvider, accountId, appName)
```

To use with did-session and reference did-session docs for more details.

```js
const client = new ComposeClient({ceramic, definition})
const resources = client.resources

const session = await DIDSession.authorize(authMethod, { resources })
client.setDID(session.did)
```

## Configuration

AuthMethod creators consume a standard Solana provider and an AccountId. AccountID follows the 
CAIP10 standard. The helper methods `getAccountIdByNetwork` and `getAccountId` are provided, but you can also create an AccountID
using the CAIP library directly. 

```js
import { AccountId } from 'caip'
import { getAccountIdByNetwork, getAccountId } from '@didtools/pkh-solana'
import { Connection, clusterApiUrl } from "@solana/web3.js"

// Using network string
const accountId = getAccountIdByNetwork('mainnet', address)

// With CAIP
const ethMainnetChainId = '1'
const chainNameSpace = 'eip155'
const chainId = `${chainNameSpace}:${ethMainnetChainId}`
const accountIdCAIP = new AccountId({ address, chainId })

// Using Solana Connection to query connect network/chain
const connection = new Connection(solanaWeb3.clusterApiUrl("mainnet-beta"))
const accountIdByConnection = await getAccountIdSolana(connection, address)

// accountId = accountIdCAIP = accountIdByConnection
```

The `SolanaNodeAuth` additionally consumes an application name. The 'SolanaWebAuth' method uses your 
application domain name by default.

```js
import { SolanaNodeAuth } from '@didtools/pkh-solana'

const appName = 'MyNodeApp'
const authMethod = SolanaNodeAuth.getAuthMethod(solProvider, accountId, appName)
```

## Verifier Usage

Verifiers are needed to verify different did:pkh signed payloads using CACAO. Libraries that need them will
consume a verifiers map allowing your to register the verifiers you want to support. 

```js
import { Cacao } from '@didtools/cacao'
import { getSolanaVerifier } from '@didtools/pkh-solana'
import { DID } from 'dids'

const verifiers = {
	...getSolanaVerifier()
}

// Directly with cacao
Cacao.verify(cacao, { verifiers, ...opts})

// With DIDS, reference DIDS for more details
const dids = //configured dids instance
await dids.verifyJWS(jws, { capability, verifiers, ...opts})
```

## License

Apache-2.0 OR MIT
