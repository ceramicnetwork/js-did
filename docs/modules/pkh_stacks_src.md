# Module: pkh-stacks/src

## Namespaces

- [StacksWebAuth](pkh_stacks_src.StacksWebAuth.md)

## Interfaces

- [SignatureData](../interfaces/pkh_stacks_src.SignatureData.md)

## Type Aliases

### SupportedProvider

Ƭ **SupportedProvider**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `signatureRequest` | (`payload`: `string`) => `Promise`<[`SignatureData`](../interfaces/pkh_stacks_src.SignatureData.md)\> |

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
