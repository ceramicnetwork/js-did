# Typical Usage Pattern

A typical pattern is to store a serialized session in local storage and load on use if available. Then
check that a session is still valid before making writes.

**Warning:** LocalStorage is used for illustrative purposes here and may not be best for your app, as
there is a number of known issues with storing secret material in browser storage. The session string
allows anyone with access to that string to make writes for that user for the time and resources that
session is valid for. How that session string is stored and managed is the responsibility of the application.

```ts
import { DIDSession } from 'did-session'
import { EthereumAuthProvider } from '@ceramicnetwork/blockchain-utils-linking'

const ethProvider = // import/get your web3 eth provider
const addresses = await ethProvider.enable()
const authProvider = new EthereumAuthProvider(ethProvider, addresses[0])

const loadSession = async(authProvider: EthereumAuthProvider):Promise<DIDSession> => {
  const sessionStr = localStorage.getItem('didsession')
  let session

  if (sessionStr) {
    session = await DIDSession.fromSession(sessionStr)
  }

  if (!session || (session.hasSession && session.isExpired)) {
    session = await DIDSession.authorize(authProvider, { resources: [...]})
    localStorage.setItem('didsession', session.serialize())
  }

  return session
}

const session = await loadSession(authProvider)
const ceramic = new CeramicClient()
ceramic.did = session.did

// pass ceramic instance where needed, ie glaze
// ...

// before ceramic writes, check if session is still valid, if expired, create new
if (session.isExpired) {
  const session = loadSession(authProvider)
  ceramic.did = session.did
}

// continue to write
```
