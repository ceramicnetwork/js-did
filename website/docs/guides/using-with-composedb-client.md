# Using With ComposeDB Client

[ComposeDB](https://composedb.js.org) is a set of TypeScript libraries and tools to interact with the [Dataverse](https://blog.ceramic.network/into-the-dataverse/) using the [Ceramic network](https://ceramic.network/).

First, you should start with creating your instance of `ComposeClient` from `@composedb/client` package, passing it the
url to the ceramic node you want to use and the runtime composite definition of the composite you want to use in your App.

```js
import { ComposeClient } from '@composedb/client'
import { definition } from './__generated__/definition.js'

const compose = new ComposeClient({ ceramic: 'http://localhost:7007', definition })
```

Next, you can create a DID Session, passing it the resources from your client instance. The resources are a list of model
stream IDs from your runtime composite definition:

```js
import { DIDSession } from 'did-session'
import type { AuthMethod } from '@didtools/cacao'
import { EthereumWebAuth, getAccountId } from '@didtools/pkh-ethereum'

const ethProvider = // import/get your web3 eth provider
const addresses = await ethProvider).request({ method: 'eth_requestAccounts' })
const accountId = await getAccountId(ethProvider, addresses[0])
const authMethod = await EthereumWebAuth.getAuthMethod(ethProvider, accountId)

const loadSession = async(authMethod: AuthMethod, resources: Array<string>):Promise<DIDSession> => {
  return DIDSession.authorize(authMethod, { resources })
}

const session = await loadSession(authMethod, compose.resources)
```

Next, you can assign the authorized did from your session to your client. 

```js
compose.setDID(session.did)

// use the compose instance to make queries in ComposeDB graph
```

Before you start making mutations with the client instance, you should make sure that the session is not expired
```js
// before compose mutations, check if session is still valid, if expired, create new
if (session.isExpired) {
  const session = loadSession(authMethod)
  compose.setDID(session.did)
}

// continue to make mutations
```

A typical pattern is to store a serialized session in local storage and load on use if available.

:::caution Warning
LocalStorage is used for illustrative purposes here and may not be best for your app, as
there is a number of known issues with storing secret material in browser storage. The session string
allows anyone with access to that string to make writes for that user for the time and resources that
session is valid for. How that session string is stored and managed is the responsibility of the application.
:::

```js
// An updated version of loadSession(...)
const loadSession = async(authMethod: AuthMethod, resources: Array<string>):Promise<DIDSession> => {
  const sessionStr = localStorage.getItem('didsession')
  let session

  if (sessionStr) {
    session = await DIDSession.fromSession(sessionStr)
  }

  if (!session || (session.hasSession && session.isExpired)) {
    session = await DIDSession.authorize(authMethod, { resources })
    localStorage.setItem('didsession', session.serialize())
  }

  return session
}
```
