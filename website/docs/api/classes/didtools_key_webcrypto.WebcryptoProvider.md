---
id: "didtools_key_webcrypto.WebcryptoProvider"
title: "Class: WebcryptoProvider"
custom_edit_url: null
---

[@didtools/key-webcrypto](../modules/didtools_key_webcrypto.md).WebcryptoProvider

## Implements

- `DIDProvider`

## Constructors

### constructor

• **new WebcryptoProvider**(`keyPair`): [`WebcryptoProvider`](didtools_key_webcrypto.WebcryptoProvider.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `keyPair` | `CryptoKeyPair` |

#### Returns

[`WebcryptoProvider`](didtools_key_webcrypto.WebcryptoProvider.md)

## Properties

### \_handle

• **\_handle**: `SendRequestFunc`<`DIDProviderMethods`\>

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
