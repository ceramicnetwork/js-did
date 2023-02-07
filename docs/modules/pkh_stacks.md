# Module: pkh-stacks

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

- [StacksWebAuth](pkh_stacks.StacksWebAuth.md)

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
| `cacao` | `Cacao` |
| `options` | `VerifyOptions` |

#### Returns

`void`
