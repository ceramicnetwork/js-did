# Class: Secp256k1Provider

[@didtools/key-secp256k1](../modules/didtools_key_secp256k1.md).Secp256k1Provider

## Implements

- `DIDProvider`

## Constructors

### constructor

• **new Secp256k1Provider**(`seed`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `seed` | `Uint8Array` |

## Properties

### \_handle

• **\_handle**: `SendRequestFunc`<`DIDProviderMethods`, []\>

## Accessors

### isDidProvider

• `get` **isDidProvider**(): `boolean`

#### Returns

`boolean`

## Methods

### send

▸ **send**<`Name`\>(`msg`): `Promise`<``null`` \| `RPCResponse`<`DIDProviderMethods`, `Name`\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Name` | extends keyof `DIDProviderMethods` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `msg` | `RPCRequest`<`DIDProviderMethods`, `Name`\> |

#### Returns

`Promise`<``null`` \| `RPCResponse`<`DIDProviderMethods`, `Name`\>\>

#### Implementation of

DIDProvider.send
