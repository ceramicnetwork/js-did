---
title: "Upgrading DID Session"
---

## Upgrading from `did-session@0.x.x` to `did-session@1.x.x` 

AuthProviders change to AuthMethod interfaces. Similarly you can import the auth libraries you need. How you configure and manage 
these AuthMethods may differ, but each will return an AuthMethod function to be used with did-session.

```js
// Before with v0.x.x
//...
import { EthereumAuthProvider } from '@ceramicnetwork/blockchain-utils-linking'
 
const ethProvider = // import/get your web3 eth provider
const addresses = await ethProvider.request({ method: 'eth_requestAccounts' })
const authProvider = new EthereumAuthProvider(ethProvider, addresses[0])
const session = new DIDSession({ authProvider })
const did = await session.authorize()

// Now did-session@1.0.0
...
import { EthereumWebAuth, getAccountId } from '@didtools/pkh-ethereum'
 
const ethProvider = // import/get your web3 eth provider
const addresses = await ethProvider.request({ method: 'eth_requestAccounts' })
const accountId = await getAccountId(ethProvider, addresses[0])
const authMethod = await EthereumWebAuth.getAuthMethod(ethProvider, accountId)
const session = await DIDSession.authorize(authMethod, { resources: [...]})
const did = session.did
```

# Upgrading From `@glazed/did-session` to `did-session`

`authorize` changes to a static method which returns a did-session instance and `getDID()` becomes a `did` getter. For example:

```js
// Before @glazed/did-session
const session = new DIDSession({ authProvider })
const did = await session.authorize()

// Now did-session
const session = await DIDSession.authorize(authProvider, { resources: [...]})
const did = session.did
```

Requesting resources are required now when authorizing, before wildcard (access all) was the default. You can continue to use
wildcard by passing the following * below. Wildcard is typically only used with `@glazed` libraries and/or tile documents and
it is best to switch over when possible, as the wildcard option may be * deprecated in the future. When using with
composites/models you should request the minimum needed resources instead.

```js
const session = await DIDSession.authorize(authProvider, { resources: [`ceramic://*`]})
const did = session.did
```
