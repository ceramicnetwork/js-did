# Authorization

Authorize and then use DIDs where needed. At the moment, Ethereum and Solana accounts
are supported. Reference the chain/network specific libraries for more info on how to
use each. Additional accounts will be supported in the future. 

Authorize with an Ethereum account using [@didtools/pkh-ethereum](./api/modules/pkh_ethereum.md):

```js
import { DIDSession } from 'did-session'
import { EthereumWebAuth, getAccountId } from '@didtools/pkh-ethereum'

const ethProvider = // import/get your web3 eth provider
const addresses = await ethProvider.request({ method: 'eth_requestAccounts' })
const accountId = await getAccountId(ethProvider, addresses[0])
const authMethod = await EthereumWebAuth.getAuthMethod(ethprovider, accountId)

const session = await DIDSession.authorize(authMethod, { resources: [...]})
```

Authorize with a Solana account using [@didtools/pkh-solana](./api/modules/pkh_solana.md):

```js
import { DIDSession } from 'did-session'
import { SolanaWebAuth, getAccountIdByNetwork } from '@didtools/pkh-solana'

const solProvider = // import/get your Solana provider (ie: window.phantom.solana)
const address = await solProvider.connect()
const accountId = getAccountIdByNetwork('mainnet', address.publicKey.toString())
const authMethod = await SolanaWebAuth.getAuthMethod(solProvider, accountId)

const session = await DIDSession.authorize(authMethod, { resources: [...]})
```

With your session, use DIDs in composedb, ceramic & glaze libraries:

```js
const ceramic = new CeramicClient()
ceramic.did = session.did
```
