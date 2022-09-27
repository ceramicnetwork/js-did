# Authorization

Authorize and use DIDs where needed. At the moment, only Ethereum accounts
are supported with the EthereumAuthProvider. Additional accounts will be supported in the future.

```ts
import { DIDSession } from 'did-session'
import { EthereumWebAuth, getAccountId } from '@didtools/pkh-ethereum'

const ethProvider = // import/get your web3 eth provider
const addresses = await ethProvider.enable()
const accountId = await getAccountId(ethProvider, addresses[0])
const authMethod = await EthereumWebAuth.getAuthMethod(ethprovider, accountId)

const session = await DIDSession.authorize(authMethod, { resources: [...]})

// Uses DIDs in ceramic & glaze libraries, ie
const ceramic = new CeramicClient()
ceramic.did = session.did
```