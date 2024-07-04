# pkh-tezos

## Tezos AuthMethod and Verifier
Implements support to authenticate, authorize and verify with Tezos accounts as a did:pkh with SIWE(X) and CACAO.
Primarly used with `did-session` and `@didtools/cacao`.

## Installation

```
npm install --save @didtools/pkh-tezos
```

## Auth Usage

To Auth in web based env, use any injected web3 provider that implements the standard interface with `TezosWebAuth`.

```ts
// Web Auth Usage
import { TezosWebAuth, getAccountId, verifyTezosSignature} from '@didtools/pkh-tezos'
// ...

let activeAccount = await tzProvider.getActiveAccount()
if (!activeAccount) {
	const permissions = await tzProvider.requestPermissions()
	let activeAccount = permissions
}
const address = await activeAccount.address
const accountId = await getAccountId(tzProvider, address)
const authMethod = await TezosWebAuth.getAuthMethod(tzProvider, accountId, publicKey)
```

To use with did-session and reference did-session docs for more details.

```js
const session = await DIDSession.authorize(authMethod, { resources: ['ceramic://*'] })
```

## Configuration

AuthMethod creators consume a standard Tezos provider and an AccountId. AccountID follows the
CAIP10 standard. The helper methods `getAccountIdByNetwork` and `getAccountId` are provided, but you can also create an AccountID
using the CAIP library directly.

```js
import { AccountId } from 'caip'
import { getAccountIdByNetwork, getAccountId } from '@didtools/pkh-tezos'

// Using network string
const accountId = getAccountIdByNetwork('mainnet', address)

// With CAIP
const tezosMainnetChainId = 'NetXdQprcVkpaWU'
const chainNameSpace = 'tezos'
const chainId = `${chainNameSpace}:${tezosMainnetChainId}`
const accountIdCAIP = new AccountId({ address, chainId })
```

## Verifier Usage

Verifiers are needed to verify different did:pkh signed payloads using CACAO. Libraries that need them will
consume a verifiers map allowing your to register the verifiers you want to support.

```ts
import { Cacao } from '@didtools/cacao'
import { getTezosVerifier } from '@didtools/pkh-tezos'
import { DID } from 'dids'

const verifiers = {
	...getTezosVerifier()
}

// Directly with cacao
Cacao.verify(cacao, { verifiers, ...opts})

// With DIDS, reference DIDS for more details
const dids = //configured dids instance
await dids.verifyJWS(jws, { capability, verifiers, ...opts})
```

## Index

### Namespaces

- [TezosWebAuth](namespaces/TezosWebAuth/index.md)

## Type Aliases

### SupportedProvider

> **SupportedProvider**: `object`

#### Type declaration

##### getActiveAccount()

> **getActiveAccount**: () => `Promise`\<`object`\>

###### Returns

`Promise`\<`object`\>

###### network

> **network**: `object`

###### network.type

> **type**: `TezosNetwork`

###### publicKey

> **publicKey**: `string`

##### requestSignPayload()

> **requestSignPayload**: (`opts`) => `Promise`\<`object`\>

###### Parameters

• **opts**

• **opts.payload**: `string`

• **opts.signingType**: `string`

###### Returns

`Promise`\<`object`\>

###### signature

> **signature**: `string`

## Variables

### CHAIN\_NAMESPACE

> `const` **CHAIN\_NAMESPACE**: `"tezos"` = `'tezos'`

***

### TEZOS\_DEVNET\_CHAIN\_REF

> `const` **TEZOS\_DEVNET\_CHAIN\_REF**: `"NetXm8tYqnMWky1"` = `'NetXm8tYqnMWky1'`

***

### TEZOS\_MAINNET\_CHAIN\_REF

> `const` **TEZOS\_MAINNET\_CHAIN\_REF**: `"NetXdQprcVkpaWU"` = `'NetXdQprcVkpaWU'`

***

### VERSION

> `const` **VERSION**: `"1"` = `'1'`

***

### chainIdMap

> `const` **chainIdMap**: `object`

#### Type declaration

##### devnet

> **devnet**: `string` = `TEZOS_DEVNET_CHAIN_REF`

##### mainnet

> **mainnet**: `string` = `TEZOS_MAINNET_CHAIN_REF`

## Functions

### assertSupportedConnection()

> **assertSupportedConnection**(`tzProvider`): `asserts tzProvider is SupportedProvider`

#### Parameters

• **tzProvider**: `any`

#### Returns

`asserts tzProvider is SupportedProvider`

***

### assertSupportedProvider()

> **assertSupportedProvider**(`tzProvider`): `asserts tzProvider is SupportedProvider`

#### Parameters

• **tzProvider**: `any`

#### Returns

`asserts tzProvider is SupportedProvider`

***

### getAccountId()

> **getAccountId**(`tzProvider`, `address`): `Promise`\<`AccountId`\>

#### Parameters

• **tzProvider**: `any`

• **address**: `string`

#### Returns

`Promise`\<`AccountId`\>

***

### getAccountIdByNetwork()

> **getAccountIdByNetwork**(`network`, `address`): `AccountId`

#### Parameters

• **network**: `TezosNetwork`

• **address**: `string`

#### Returns

`AccountId`

***

### getPkhfromPk()

> **getPkhfromPk**(`publicKey`): `string`

#### Parameters

• **publicKey**: `string`

#### Returns

`string`

***

### getPublicKey()

> **getPublicKey**(`tzProvider`): `Promise`\<`string`\>

#### Parameters

• **tzProvider**: `any`

#### Returns

`Promise`\<`string`\>

***

### getTezosVerifier()

> **getTezosVerifier**(): `Verifiers`

#### Returns

`Verifiers`

***

### requestChainId()

> **requestChainId**(`tzProvider`): `Promise`\<`string`\>

#### Parameters

• **tzProvider**: `any`

#### Returns

`Promise`\<`string`\>

***

### verifySignature()

> **verifySignature**(`payload`, `publicKey`, `signature`): `boolean`

#### Parameters

• **payload**: `string`

• **publicKey**: `string`

• **signature**: `string`

#### Returns

`boolean`

***

### verifyTezosSignature()

> **verifyTezosSignature**(`cacao`, `options`): `void`

#### Parameters

• **cacao**: `Cacao`

• **options**: `VerifyOptions`

#### Returns

`void`
