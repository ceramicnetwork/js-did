---
id: "pkh_tezos"
title: "Module: pkh-tezos"
custom_edit_url: null
---

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

## Namespaces

- [TezosWebAuth](../namespaces/pkh_tezos.TezosWebAuth.md)

## Type Aliases

### SupportedProvider

Ƭ **SupportedProvider**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `getActiveAccount` | () => `Promise`<{ `network`: { `type`: `TezosNetwork`  } ; `publicKey`: `string`  }\> |
| `requestSignPayload` | (`opts`: { `payload`: `string` ; `signingType`: `string`  }) => `Promise`<{ `signature`: `string`  }\> |

## Variables

### CHAIN\_NAMESPACE

• `Const` **CHAIN\_NAMESPACE**: ``"tezos"``

___

### TEZOS\_DEVNET\_CHAIN\_REF

• `Const` **TEZOS\_DEVNET\_CHAIN\_REF**: ``"NetXm8tYqnMWky1"``

___

### TEZOS\_MAINNET\_CHAIN\_REF

• `Const` **TEZOS\_MAINNET\_CHAIN\_REF**: ``"NetXdQprcVkpaWU"``

___

### VERSION

• `Const` **VERSION**: ``"1"``

___

### chainIdMap

• `Const` **chainIdMap**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `devnet` | `string` |
| `mainnet` | `string` |

## Functions

### assertSupportedConnection

▸ **assertSupportedConnection**(`tzProvider`): asserts tzProvider is SupportedProvider

#### Parameters

| Name | Type |
| :------ | :------ |
| `tzProvider` | `any` |

#### Returns

asserts tzProvider is SupportedProvider

___

### assertSupportedProvider

▸ **assertSupportedProvider**(`tzProvider`): asserts tzProvider is SupportedProvider

#### Parameters

| Name | Type |
| :------ | :------ |
| `tzProvider` | `any` |

#### Returns

asserts tzProvider is SupportedProvider

___

### getAccountId

▸ **getAccountId**(`tzProvider`, `address`): `Promise`<`AccountId`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `tzProvider` | `any` |
| `address` | `string` |

#### Returns

`Promise`<`AccountId`\>

___

### getAccountIdByNetwork

▸ **getAccountIdByNetwork**(`network`, `address`): `AccountId`

#### Parameters

| Name | Type |
| :------ | :------ |
| `network` | `TezosNetwork` |
| `address` | `string` |

#### Returns

`AccountId`

___

### getPkhfromPk

▸ **getPkhfromPk**(`publicKey`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `publicKey` | `string` |

#### Returns

`string`

___

### getPublicKey

▸ **getPublicKey**(`tzProvider`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `tzProvider` | `any` |

#### Returns

`Promise`<`string`\>

___

### getTezosVerifier

▸ **getTezosVerifier**(): `Verifiers`

#### Returns

`Verifiers`

___

### requestChainId

▸ **requestChainId**(`tzProvider`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `tzProvider` | `any` |

#### Returns

`Promise`<`string`\>

___

### verifySignature

▸ **verifySignature**(`payload`, `publicKey`, `signature`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | `string` |
| `publicKey` | `string` |
| `signature` | `string` |

#### Returns

`boolean`

___

### verifyTezosSignature

▸ **verifyTezosSignature**(`cacao`, `options`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `cacao` | `MapIn`<`RequiredProps`<{ `h`: `ExactCodec`<`TypeCodec`<{ `t`: `KeyOfCodec`<{ `caip122`: ``null`` ; `eip4361`: ``null``  }\>  }\>\> ; `p`: `SparseCodec`<{ `aud`: `TrivialCodec`<`string`\> ; `domain`: `TrivialCodec`<`string`\> ; `exp`: `OptionalCodec`<`TrivialCodec`<`string`\>\> ; `iat`: `TrivialCodec`<`string`\> ; `iss`: `TrivialCodec`<`string`\> ; `nbf`: `OptionalCodec`<`TrivialCodec`<`string`\>\> ; `nonce`: `TrivialCodec`<`string`\> ; `requestId`: `OptionalCodec`<`TrivialCodec`<`string`\>\> ; `resources`: `OptionalCodec`<`Codec`<`string`[], `string`[], `unknown`\> & { `item`: `TrivialCodec`<`string`\>  }\> ; `statement`: `OptionalCodec`<`TrivialCodec`<`string`\>\> ; `version`: `TrivialCodec`<`string`\>  }\> ; `s`: `OptionalCodec`<`ExactCodec`<`TypeCodec`<{ `s`: `TrivialCodec`<`string`\> ; `t`: `KeyOfCodec`<{ `eip1271`: ``null`` ; `eip191`: ``null`` ; `solana:ed25519`: ``null`` ; `stacks:secp256k1`: ``null`` ; `tezos:ed25519`: ``null``  }\>  }\>\>\>  }\>, `$TypeOf`\> & `MapIn`<`OptionalProps`<{ `h`: `ExactCodec`<`TypeCodec`<{ `t`: `KeyOfCodec`<{ `caip122`: ``null`` ; `eip4361`: ``null``  }\>  }\>\> ; `p`: `SparseCodec`<{ `aud`: `TrivialCodec`<`string`\> ; `domain`: `TrivialCodec`<`string`\> ; `exp`: `OptionalCodec`<`TrivialCodec`<`string`\>\> ; `iat`: `TrivialCodec`<`string`\> ; `iss`: `TrivialCodec`<`string`\> ; `nbf`: `OptionalCodec`<`TrivialCodec`<`string`\>\> ; `nonce`: `TrivialCodec`<`string`\> ; `requestId`: `OptionalCodec`<`TrivialCodec`<`string`\>\> ; `resources`: `OptionalCodec`<`Codec`<`string`[], `string`[], `unknown`\> & { `item`: `TrivialCodec`<`string`\>  }\> ; `statement`: `OptionalCodec`<`TrivialCodec`<`string`\>\> ; `version`: `TrivialCodec`<`string`\>  }\> ; `s`: `OptionalCodec`<`ExactCodec`<`TypeCodec`<{ `s`: `TrivialCodec`<`string`\> ; `t`: `KeyOfCodec`<{ `eip1271`: ``null`` ; `eip191`: ``null`` ; `solana:ed25519`: ``null`` ; `stacks:secp256k1`: ``null`` ; `tezos:ed25519`: ``null``  }\>  }\>\>\>  }\>, `$TypeOf`\> |
| `options` | `VerifyOptions` |

#### Returns

`void`
