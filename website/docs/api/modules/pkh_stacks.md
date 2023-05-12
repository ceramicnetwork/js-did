---
id: "pkh_stacks"
title: "Module: pkh-stacks"
custom_edit_url: null
---

## Stacks AuthMethod and Verifier

Implements support to authenticate, authorize and verify with Stacks accounts as a did:pkh with SIWE(X) and CACAO.
Primarly used with `did-session` and `@didtools/cacao`.

## Installation

```
npm install --save @didtools/pkh-stacks
```

## Auth Usage

To Auth in web based env, use any injected web3 provider that implements the standard interface with `StacksWebAuth`.

```ts
// Web Auth Usage
import { StacksWebAuth, getAccountIdByNetwork, verifyStacksSignature } from '@didtools/pkh-stacks'
import { AppConfig, UserSession } from '@stacks/connect'

// ...
const stacksProvider = window.StacksProvider
const appConfig = new AppConfig(['store_write'])
const userSession = new UserSession({ appConfig })

const userData = userSession.loadUserData()
const address = user.profile.stxAddress.mainnet

const accountId = await getAccountIdByNetwork('mainnet', address)
const authMethod = await StacksWebAuth.getAuthMethod(stacksProvider, accountId, publicKey)
```

To use with did-session and reference did-session docs for more details.

```js
const session = await DIDSession.authorize(authMethod, { resources: ['ceramic://*'] })
```

## Configuration

AuthMethod creators consume a standard Stacks provider and an AccountId. AccountID follows the CAIP10 standard. The helper method `getAccountIdByNetwork` id provided, but you can also create an AccountID using the CAIP library directly.

```js
import { AccountId } from 'caip'
import { getAccountIdByNetwork } from '@didtools/pkh-stacks'
// Using network string
const accountId = getAccountIdByNetwork('mainnet', address)
// With CAIP
const stacksMainnetChainId = '1'
const chainNameSpace = 'stacks'
const chainId = `${chainNameSpace}:${stacksMainnetChainId}`
const accountIdCAIP = new AccountId({ address, chainId })
```

## Verifier Usage

Verifiers are needed to verify different did:pkh signed payloads using CACAO. Libraries that need them will
consume a verifiers map allowing your to register the verifiers you want to support.

```ts
import { Cacao } from '@didtools/cacao'
import { getStacksVerifier } from '@didtools/pkh-stacks'
import { DID } from 'dids'
const verifiers = {
  ...getStacksVerifier(),
}
// Directly with cacao
Cacao.verify(cacao, { verifiers, ...opts })
// With DIDS, reference DIDS for more details
const dids = //configured dids instance
  await dids.verifyJWS(jws, { capability, verifiers, ...opts })
```

## Namespaces

- [StacksWebAuth](../namespaces/pkh_stacks.StacksWebAuth.md)

## Interfaces

- [SignatureData](../interfaces/pkh_stacks.SignatureData.md)

## Type Aliases

### SupportedProvider

Ƭ **SupportedProvider**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `signatureRequest` | (`payload`: `string`) => `Promise`<[`SignatureData`](../interfaces/pkh_stacks.SignatureData.md)\> |

## Variables

### CHAIN\_NAMESPACE

• `Const` **CHAIN\_NAMESPACE**: ``"stacks"``

___

### VERSION

• `Const` **VERSION**: ``"1"``

___

### chainIdMap

• `Const` **chainIdMap**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `mainnet` | `string` |
| `testnet` | `string` |

## Functions

### assertSupportedProvider

▸ **assertSupportedProvider**(`stacksProvider`): asserts stacksProvider is SupportedProvider

#### Parameters

| Name | Type |
| :------ | :------ |
| `stacksProvider` | `any` |

#### Returns

asserts stacksProvider is SupportedProvider

___

### getAccountIdByNetwork

▸ **getAccountIdByNetwork**(`network`, `address`): `AccountId`

Helper function to get an accountId (CAIP10) for an Stacks account by network string 'mainet' | 'testnet'

#### Parameters

| Name | Type |
| :------ | :------ |
| `network` | `StacksNetwork` |
| `address` | `string` |

#### Returns

`AccountId`

___

### getStacksVerifier

▸ **getStacksVerifier**(): `Verifiers`

#### Returns

`Verifiers`

___

### verifyStacksSignature

▸ **verifyStacksSignature**(`cacao`, `options`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `cacao` | `MapIn`<`RequiredProps`<{ `h`: `ExactCodec`<`TypeCodec`<{ `t`: `KeyOfCodec`<{ `caip122`: ``null`` ; `eip4361`: ``null``  }\>  }\>\> ; `p`: `SparseCodec`<{ `aud`: `TrivialCodec`<`string`\> ; `domain`: `TrivialCodec`<`string`\> ; `exp`: `OptionalCodec`<`TrivialCodec`<`string`\>\> ; `iat`: `TrivialCodec`<`string`\> ; `iss`: `TrivialCodec`<`string`\> ; `nbf`: `OptionalCodec`<`TrivialCodec`<`string`\>\> ; `nonce`: `TrivialCodec`<`string`\> ; `requestId`: `OptionalCodec`<`TrivialCodec`<`string`\>\> ; `resources`: `OptionalCodec`<`Codec`<`string`[], `string`[], `unknown`\> & { `item`: `TrivialCodec`<`string`\>  }\> ; `statement`: `OptionalCodec`<`TrivialCodec`<`string`\>\> ; `version`: `TrivialCodec`<`string`\>  }\> ; `s`: `OptionalCodec`<`ExactCodec`<`TypeCodec`<{ `s`: `TrivialCodec`<`string`\> ; `t`: `KeyOfCodec`<{ `eip1271`: ``null`` ; `eip191`: ``null`` ; `solana:ed25519`: ``null`` ; `stacks:secp256k1`: ``null`` ; `tezos:ed25519`: ``null``  }\>  }\>\>\>  }\>, `$TypeOf`\> & `MapIn`<`OptionalProps`<{ `h`: `ExactCodec`<`TypeCodec`<{ `t`: `KeyOfCodec`<{ `caip122`: ``null`` ; `eip4361`: ``null``  }\>  }\>\> ; `p`: `SparseCodec`<{ `aud`: `TrivialCodec`<`string`\> ; `domain`: `TrivialCodec`<`string`\> ; `exp`: `OptionalCodec`<`TrivialCodec`<`string`\>\> ; `iat`: `TrivialCodec`<`string`\> ; `iss`: `TrivialCodec`<`string`\> ; `nbf`: `OptionalCodec`<`TrivialCodec`<`string`\>\> ; `nonce`: `TrivialCodec`<`string`\> ; `requestId`: `OptionalCodec`<`TrivialCodec`<`string`\>\> ; `resources`: `OptionalCodec`<`Codec`<`string`[], `string`[], `unknown`\> & { `item`: `TrivialCodec`<`string`\>  }\> ; `statement`: `OptionalCodec`<`TrivialCodec`<`string`\>\> ; `version`: `TrivialCodec`<`string`\>  }\> ; `s`: `OptionalCodec`<`ExactCodec`<`TypeCodec`<{ `s`: `TrivialCodec`<`string`\> ; `t`: `KeyOfCodec`<{ `eip1271`: ``null`` ; `eip191`: ``null`` ; `solana:ed25519`: ``null`` ; `stacks:secp256k1`: ``null`` ; `tezos:ed25519`: ``null``  }\>  }\>\>\>  }\>, `$TypeOf`\> |
| `options` | `VerifyOptions` |

#### Returns

`void`
