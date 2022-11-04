---
id: "did_session"
title: "Module: did-session"
custom_edit_url: null
---

Manages user account DIDs in web based environments.

## Purpose

Manages, creates and authorizes a DID session key for a user. Returns an authenticated DIDs instance
to be used in other Ceramic libraries. Supports did:pkh for blockchain accounts with Sign-In with
Ethereum and CACAO for authorization.

## Installation

```sh
npm install did-session
```

## Usage

Authorize and use DIDs where needed. Import the AuthMethod you need, Ethereum accounts used here for example.

```js
import { DIDSession } from 'did-session'
import { EthereumWebAuth, getAccountId } from '@didtools/pkh-ethereum'

const ethProvider = // import/get your web3 eth provider
const addresses = await ethProvider.request({ method: 'eth_requestAccounts' })
const accountId = await getAccountId(ethProvider, addresses[0])
const authMethod = await EthereumWebAuth.getAuthMethod(ethprovider, accountId)

const session = await DIDSession.authorize(authMethod, { resources: [...]})

// Uses DIDs in ceramic & glaze libraries, ie
const ceramic = new CeramicClient()
ceramic.did = session.did

// pass ceramic instance where needed

```

You can serialize a session to store for later and then re-initialize. Currently sessions are valid
for 1 day by default.

```js
// Create session as above, store for later
const session = await DIDSession.authorize(authMethod, { resources: [...]})
const sessionString = session.serialize()

// write/save session string where you want (ie localstorage)
// ...

// Later re initialize session
const session2 = await DIDSession.fromSession(sessionString)
const ceramic = new CeramicClient()
ceramic.did = session2.did
```

Additional helper functions are available to help you manage a session lifecycle and the user experience.

```ss
// Check if authorized or created from existing session string
didsession.hasSession

// Check if session expired
didsession.isExpired

// Get resources session is authorized for
didsession.authorizations

// Check number of seconds till expiration, may want to re auth user at a time before expiration
didsession.expiresInSecs
```

## Configuration

The resources your app needs to write access to must be passed during authorization. Resources are an array
of Model Stream Ids or Streams Ids. Typically you will just pass resources from `@composedb` libraries as
you will already manage your Composites and Models there. For example:

```js
import { ComposeClient } from '@composedb/client'

//... Reference above and `@composedb` docs for additional configuration here

const client = new ComposeClient({ceramic, definition})
const resources = client.resources
const session = await DIDSession.authorize(authMethod, { resources })
client.setDID(session.did)
```

By default a session will expire in 1 day. You can change this time by passing the `expiresInSecs` option to
indicate how many seconds from the current time you want this session to expire.

```js
const oneWeek = 60 * 60 * 24 * 7
const session = await DIDSession.authorize(authMethod, { resources: [...], expiresInSecs: oneWeek })
```

A domain/app name is used when making requests, by default in a browser based environment the library will use
the domain name of your app. If you are using the library in a non web based environment you will need to pass
the `domain` option otherwise an error will thrown.

```js
const session = await DIDSession.authorize(authMethod, { resources: [...], domain: 'YourAppName' })
```

## Typical usage pattern

A typical pattern is to store a serialized session in local storage and load on use if available. Then
check that a session is still valid before making writes.

**Warning:** LocalStorage is used for illustrative purposes here and may not be best for your app, as
there is a number of known issues with storing secret material in browser storage. The session string
allows anyone with access to that string to make writes for that user for the time and resources that
session is valid for. How that session string is stored and managed is the responsibility of the application.

```js
import { DIDSession } from 'did-session'
import type { AuthMethod } from '@didtools/cacao'
import { EthereumWebAuth, getAccountId } from '@didtools/pkh-ethereum'

const ethProvider = // import/get your web3 eth provider
const addresses = await ethProvider.request({ method: 'eth_requestAccounts' })
const accountId = await getAccountId(ethProvider, addresses[0])
const authMethod = await EthereumWebAuth.getAuthMethod(ethProvider, accountId)

const loadSession = async (authMethod) => {
  const sessionStr = localStorage.getItem('didsession')
  let session

  if (sessionStr) {
    session = await DIDSession.fromSession(sessionStr)
  }

  if (!session || (session.hasSession && session.isExpired)) {
    session = await DIDSession.authorize(authMethod, { resources: [...]})
    localStorage.setItem('didsession', session.serialize())
  }

  return session
}

const session = await loadSession(authMethod)
const ceramic = new CeramicClient()
ceramic.did = session.did

// pass ceramic instance where needed, ie glaze
// ...

// before ceramic writes, check if session is still valid, if expired, create new
if (session.isExpired) {
  const session = loadSession(authMethod)
  ceramic.did = session.did
}

// continue to write
```

## Upgrading from `@glazed/did-session` to `did-session`

`authorize` changes to a static method which returns a did-session instance and `getDID()` becomes a `did` getter. For example:

```js
// Before @glazed/did-session
const session = new DIDSession({ authProvider })
const did = await session.authorize()

// Now did-session
const session = await DIDSession.authorize(authMethod, { resources: [...]})
const did = session.did
```

Requesting resources are required now when authorizing, before wildcard (access all) was the default. You can continue to use
wildcard by passing the following * below. Wildcard is typically only used with `@glazed` libraries and/or tile documents and
it is best to switch over when possible, as the wildcard option may be * deprecated in the future. When using with
composites/models you should request the minimum needed resources instead.

```js
const session = await DIDSession.authorize(authMethod, { resources: [`ceramic://*`]})
const did = session.did
```

## Upgrading from `did-session@0.x.x` to `did-session@1.x.x`

AuthProviders change to AuthMethod interfaces. Similarly you can import the auth libraries you need. How you configure and manage
these AuthMethods may differ, but each will return an AuthMethod function to be used with did-session.

```js
// Before with v0.x.x
...
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

## Classes

- [DIDSession](../classes/did_session.DIDSession.md)

## Type Aliases

### SessionParams

Ƭ **SessionParams**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `cacao` | `Cacao` |
| `did` | `DID` |
| `keySeed` | `Uint8Array` |

## Functions

### createDIDCacao

▸ **createDIDCacao**(`didKey`, `cacao`): `Promise`<`DID`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `didKey` | `DID` |
| `cacao` | `Cacao` |

#### Returns

`Promise`<`DID`\>

___

### createDIDKey

▸ **createDIDKey**(`seed?`): `Promise`<`DID`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `seed?` | `Uint8Array` |

#### Returns

`Promise`<`DID`\>
