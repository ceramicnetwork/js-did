# pkh-solana

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

## Index

### Namespaces

- [SolanaNodeAuth](namespaces/SolanaNodeAuth/index.md)
- [SolanaWebAuth](namespaces/SolanaWebAuth/index.md)

## Type Aliases

### SupportedConnection

> **SupportedConnection**: `object`

#### Type declaration

##### getGenesisHash()

> **getGenesisHash**: () => `Promise`\<`string`\>

###### Returns

`Promise`\<`string`\>

***

### SupportedProvider

> **SupportedProvider**: `object`

#### Type declaration

##### signMessage()

> **signMessage**: (`message`, `type`) => `Promise`\<`object`\>

###### Parameters

• **message**: `Uint8Array`

• **type**: `string`

###### Returns

`Promise`\<`object`\>

###### signature

> **signature**: `Uint8Array`

## Variables

### CHAIN\_NAMESPACE

> `const` **CHAIN\_NAMESPACE**: `"solana"` = `'solana'`

***

### SOLANA\_DEVNET\_CHAIN\_REF

> `const` **SOLANA\_DEVNET\_CHAIN\_REF**: `"EtWTRABZaYq6iMfeYKouRu166VU2xqa1"` = `'EtWTRABZaYq6iMfeYKouRu166VU2xqa1'`

***

### SOLANA\_MAINNET\_CHAIN\_REF

> `const` **SOLANA\_MAINNET\_CHAIN\_REF**: `"5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp"` = `'5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp'`

***

### SOLANA\_TESTNET\_CHAIN\_REF

> `const` **SOLANA\_TESTNET\_CHAIN\_REF**: `"4uhcVJyU9pJkvQyS88uRDiswHXSCkY3z"` = `'4uhcVJyU9pJkvQyS88uRDiswHXSCkY3z'`

***

### VERSION

> `const` **VERSION**: `"1"` = `'1'`

***

### chainIdMap

> `const` **chainIdMap**: `object`

#### Type declaration

##### devnet

> **devnet**: `string` = `SOLANA_DEVNET_CHAIN_REF`

##### mainnet

> **mainnet**: `string` = `SOLANA_MAINNET_CHAIN_REF`

##### testnet

> **testnet**: `string` = `SOLANA_TESTNET_CHAIN_REF`

## Functions

### assertSupportedConnection()

> **assertSupportedConnection**(`solConnection`): `asserts solConnection is SupportedConnection`

#### Parameters

• **solConnection**: `any`

#### Returns

`asserts solConnection is SupportedConnection`

***

### assertSupportedProvider()

> **assertSupportedProvider**(`solProvider`): `asserts solProvider is SupportedProvider`

#### Parameters

• **solProvider**: `any`

#### Returns

`asserts solProvider is SupportedProvider`

***

### getAccountId()

> **getAccountId**(`solConnection`, `address`): `Promise`\<`AccountId`\>

Helper function to get an accountId (CAIP10) for an Solana account by Solana Connection interface, Connection must implement 'getGenesisHash()'

#### Parameters

• **solConnection**: `any`

• **address**: `string`

#### Returns

`Promise`\<`AccountId`\>

***

### getAccountIdByNetwork()

> **getAccountIdByNetwork**(`network`, `address`): `AccountId`

Helper function to get an accountId (CAIP10) for an Solana account by network string 'mainet' | 'testnet' | 'devenet'

#### Parameters

• **network**: `SolanaNetwork`

• **address**: `string`

#### Returns

`AccountId`

***

### getSolanaVerifier()

> **getSolanaVerifier**(): `Verifiers`

Get a configured CACAO SolanaVerifier map for Solana accounts

#### Returns

`Verifiers`

***

### requestChainId()

> **requestChainId**(`solConnection`): `Promise`\<`string`\>

#### Parameters

• **solConnection**: `any`

#### Returns

`Promise`\<`string`\>

***

### verifySolanaSignature()

> **verifySolanaSignature**(`cacao`, `options`): `void`

#### Parameters

• **cacao**: `Cacao`

• **options**: `VerifyOptions`

#### Returns

`void`
