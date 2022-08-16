# Using With ComposeDB Client

[ComposeDB](https://composedb.js.org) is a set of TypeScript libraries and tools to interact with the [Dataverse](https://blog.ceramic.network/into-the-dataverse/) using the [Ceramic network](https://ceramic.network/).

First, you should start with creating your instance of `ComposeClient` from `@composedb/client` package, passing it the
url to the ceramic node you want to use and the runtime composite definition of the composite you want to use in your App.

```ts
import { ComposeClient } from '@composedb/client'
import { definition } from './__generated__/definition.js'

const compose = new ComposeClient({ ceramic: 'http://localhost:7007', definition })
```

Next, you can create a DID Session, passing it the resources from your client instance. The resources are a list of model
stream IDs from your runtime composite definition:

```ts
import { DIDSession } from 'did-session'
import { EthereumAuthProvider } from '@ceramicnetwork/blockchain-utils-linking'

const ethProvider = // import/get your web3 eth provider
const addresses = await ethProvider.enable()
const authProvider = new EthereumAuthProvider(ethProvider, addresses[0])

const loadSession = async(authProvider: EthereumAuthProvider, resources: Array<string>):Promise<DIDSession> => {
  return await DIDSession.authorize(authProvider, { resources: resources})
}

const session = await loadSession(authProvider, compose.resources)
```

Next, you can assign the authorized did from your session to your client. 

```ts
compose.setDID(session.did)

// use the compose instance to make queries in ComposeDB graph
```

Before you start making mutations with the client instance, you should make sure that the session is not expired
```ts
// before compose mutations, check if session is still valid, if expired, create new
if (session.isExpired) {
  const session = loadSession(authProvider)
  compose.setDID(session.did)
}

// continue to make mutations
```

A typical pattern is to store a serialized session in local storage and load on use if available.

**Warning:** LocalStorage is used for illustrative purposes here and may not be best for your app, as
there is a number of known issues with storing secret material in browser storage. The session string
allows anyone with access to that string to make writes for that user for the time and resources that
session is valid for. How that session string is stored and managed is the responsibility of the application.

```ts
// An updated version of loadSession(...)
const loadSession = async(authProvider: EthereumAuthProvider, resources: Array<string>):Promise<DIDSession> => {
  let session
  // get a serialized session from local storage
  const sessionStr = localStorage.getItem('didsession')

  if (sessionStr) {
    session = await DIDSession.fromSession(sessionStr)
  }

  if (!session || (session.hasSession && session.isExpired)) {
    session = await DIDSession.authorize(authProvider, { resources: resources})
    // store the serialized session in local storage
    localStorage.setItem('didsession', session.serialize())
  }

  return session
}
```

