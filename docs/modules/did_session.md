# Module: did-session

Manages user account and DID in web based environments.

## Purpose

Manages, creates and authorizes a DID session key for a user. Returns an authenticated DIDs instance
to be used in other Ceramic libraries. Supports did:pkh for blockchain accounts with Sign-In with
Ethereum and CACAO for authorization.

## Installation

```sh
npm install @glazed/did-session
```

## Usage

Create an instance, authorize and use DIDs where needed. At the moment, only Ethereum accounts
are supported with the EthereumAuthProvider. Additional accounts will be supported in the future.

```ts
import { DIDSession } from '@glazed/did-session'
import { EthereumAuthProvider } from '@ceramicnetwork/blockchain-utils-linking'

const ethProvider = // import/get your web3 eth provider
const addresses = await ethProvider.enable()
const authProvider = new EthereumAuthProvider(ethProvider, addresses[0])

const session = new DIDSession({ authProvider })
const did = await session.authorize()

// Uses DIDs in ceramic & glaze libraries, ie
const ceramic = new CeramicClient()
ceramic.did = did

// pass ceramic instance where needed

```

You can serialize a session to store for later and then re-initialize. Currently sessions are valid
for 1 day by default.

```ts
// Create session as above, store for later
const session = new DIDSession({ authProvider })
const did = await session.authorize()
const sessionString = session.serialize()

// write/save session string where you want (ie localstorage)
// ...

// Later re initialize session
const session2 = DIDSession.fromSession(authProvider, sessionString)
const ceramic = new CeramicClient()
ceramic.did = session2.getDID()
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

### Typical usage pattern

A typical pattern is to store a serialized session in local storage and load on use if available. Then
check that a session is still valid before making writes.

```ts
import { DIDSession } from '@glazed/did-session'
import { EthereumAuthProvider } from '@ceramicnetwork/blockchain-utils-linking'

const ethProvider = // import/get your web3 eth provider
const addresses = await ethProvider.enable()
const authProvider = new EthereumAuthProvider(ethProvider, addresses[0])

const loadSession = async(authProvider: EthereumAuthProvider):Promise<DIDSession> => {
 const sessionStr = localStorage.getItem('didsession')
 let session

 if (sessionStr) {
   session = await DIDSession.fromSession(sessionStr, authProvider)
 }

 if (!session || (session.hasSession && session.isExpired)) {
   session = new DIDSession({ authProvider })
   session.authorize()
   localStorage.setItem('didsession', session.serialize())
 }

 return session
}

const session = await loadSession(authProvider)
const ceramic = new CeramicClient()
ceramic.did = session.getDID()

// pass ceramic instance where needed, ie glaze
// ...

// before ceramic writes, check if session is still valid, if expired, create new
if (session.isExpired) {
  const session = loadSession(authProvider)
  ceramic.did = session.getDID()
}

// continue to write
```

## Classes

- [DIDSession](../classes/did_session.DIDSession.md)

## Type Aliases

### SessionParams

Ƭ **SessionParams**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `authProvider` | `EthereumAuthProvider` | An authProvider for the chain you wish to support, only ETH supported at moment |
| `cacao?` | `Cacao` | - |
| `keySeed?` | `Uint8Array` | - |
| `resources?` | `string`[] | - |

## Functions

### createDIDKey

▸ **createDIDKey**(`seed?`): `Promise`<`DID`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `seed?` | `Uint8Array` |

#### Returns

`Promise`<`DID`\>
