# Module: pkh-sui

## Sui AuthMethod and Verifier
Implements support to authenticate, authorize and verify with Sui accounts as a did:pkh with SIWE(X) and CACAO. 
Primarly used with `did-session` and `@didtools/cacao`. 

 ## Installation
 
```
npm install --save @didtools/pkh-solana
```

## Auth Usage

To Auth in web based env, use any injected Sui provider that implements the sui wallet standards interface with `SuiWebAuth`. see https://github.com/MystenLabs/sui/tree/main/sdk/wallet-adapter/wallet-standard and https://github.com/suiet/wallet-kit 

```js
// Web Auth Usage
import { SuiWebAuth, getAccountIdByNetwork } from '@didtools/pkh-sui'
// ...

const suiProvider = // import/get your Solana provider (ie: window.phantom.solana)
const address = await suiProvider.connect().address
const accountId = getAccountIdByNetwork('mainnet', address.publicKey.toString())

const authMethod = await SuiWebAuth.getAuthMethod(suiProvider, accountId)
```

## Configuration

AuthMethod creators consume a standard Sui provider and an AccountId. AccountID follows the
CAIP10 standard. The helper methods `getAccountIdByNetwork` and `getAccountId` are provided, but you can also create an AccountID
using the CAIP library directly.

```js
import { AccountId } from 'caip'
import { getAccountIdByNetwork, getAccountId } from '@didtools/pkh-sui'

// Using network string
const accountId = getAccountIdByNetwork('mainnet', address)

// With CAIP
const suiMainnetChainId = 'mainnet'
const chainNameSpace = 'sui'
const chainId = `${chainNameSpace}:${ethMainnetChainId}`
const accountIdCAIP = new AccountId({ address, chainId })

// Using Solana Connection to query connect network/chain
const connection = new Connection(solanaWeb3.clusterApiUrl("mainnet-beta"))
const accountIdByConnection = await getAccountIdSolana(connection, address)

// accountId = accountIdCAIP = accountIdByConnection
```


## Verifier Usage

Verifiers are needed to verify different did:pkh signed payloads using CACAO. Libraries that need them will
consume a verifiers map allowing your to register the verifiers you want to support.

```js
import { Cacao } from '@didtools/cacao'
import { getSuiVerifier } from '@didtools/pkh-sui'
import { DID } from 'dids'

const verifiers = {
...getSuierifier()
}

// Directly with cacao
Cacao.verify(cacao, { verifiers, ...opts})

// With DIDS, reference DIDS for more details
const dids = //configured dids instance
await dids.verifyJWS(jws, { capability, verifiers, ...opts})
```

## Namespaces

- [SuiWebAuth](pkh_sui.SuiWebAuth.md)

## Type Aliases

### SupportedProvider

Ƭ **SupportedProvider**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `signMessage` | (`message`: `Uint8Array`, `type`: `string`) => `Promise`<{ `signature`: `Uint8Array`  }\> |

## Variables

### CHAIN\_NAMESPACE

• `Const` **CHAIN\_NAMESPACE**: ``"sui"``

___

### SUI\_DEVNET\_CHAIN\_REF

• `Const` **SUI\_DEVNET\_CHAIN\_REF**: ``"devnet"``

___

### SUI\_TESTNET\_CHAIN\_REF

• `Const` **SUI\_TESTNET\_CHAIN\_REF**: ``"testnet"``

___

### SUI\_MAINNET\_CHAIN\_REF

• `Const` **SUI\_MAINNET\_CHAIN\_REF**: ``"mainnet"``

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
| `testnet` | `string` |
| `mainnet` | `string` |

## Functions

### assertSupportedConnection

▸ **assertSupportedConnection**(`suiProvider`): asserts suiProvider is SupportedProvider

#### Parameters

| Name | Type |
| :------ | :------ |
| `suiProvider` | `any` |

#### Returns

asserts suiProvider is SupportedProvider

___

### assertSupportedProvider

▸ **assertSupportedProvider**(`suiProvider`): asserts suiProvider is SupportedProvider

#### Parameters

| Name | Type |
| :------ | :------ |
| `suiProvider` | `any` |

#### Returns

asserts suiProvider is SupportedProvider

___

### getAccountId

▸ **getAccountId**(`suiProvider`, `address`): `Promise`<`AccountId`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `suiProvider` | `any` |
| `address` | `string` |

#### Returns

`Promise`<`AccountId`\>

___

### getAccountIdByNetwork

▸ **getAccountIdByNetwork**(`network`, `address`): `AccountId`

Helper function to get an accountId (CAIP10) for an Sui account by network string 'mainet' | 'testnet' | 'devenet'

#### Parameters

| Name | Type |
| :------ | :------ |
| `network` | `SuiNetwork` |
| `address` | `string` |

#### Returns

`AccountId`

___

### getSuiVerifier

▸ **getSuiVerifier**(): `Verifiers`

Get a configured CACAO SuiVerifier map for Sui accounts

#### Returns

`Verifiers`

___

### requestChainId

▸ **requestChainId**(`suiConnection`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `suiConnection` | `any` |

#### Returns

`Promise`<`string`\>

___

### verifySuiSignature

▸ **verifySuiSignature**(`cacao`, `options`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `cacao` | `Cacao` |
| `options` | `VerifyOptions` |

#### Returns

`void`
