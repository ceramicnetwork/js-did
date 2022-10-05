# Class: Ed25519Provider

[key-did-provider-ed25519](../modules/key_did_provider_ed25519.md).Ed25519Provider

## Implements

- `DIDProvider`

## Constructors

### constructor

• **new Ed25519Provider**(`seed`)

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
