# Authorization

Authorize and use DIDs where needed. At the moment, only Ethereum accounts
are supported with the EthereumAuthProvider. Additional accounts will be supported in the future.

```ts
import { DIDSession } from 'did-session'
import { EthereumAuthProvider } from '@ceramicnetwork/blockchain-utils-linking'

const ethProvider = // import/get your web3 eth provider
const addresses = await ethProvider.enable()
const authProvider = new EthereumAuthProvider(ethProvider, addresses[0])

const session = await DIDSession.authorize(authProvider, { resources: [...]})

// Uses DIDs in ceramic & glaze libraries, ie
const ceramic = new CeramicClient()
ceramic.did = session.did

// pass ceramic instance where needed

```

Additional helper functions are available to help you manage a session lifecycle and the user experience.

```ts
// Check if authorized or created from existing session string
didsession.hasSession

// Check if session expired
didsession.isExpired

// Get resources session is authorized for
didsession.authorizations

// Check number of seconds till expiration, may want to re auth user at a time before expiration
didsession.expiresInSecs
```
