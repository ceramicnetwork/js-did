---
id: "siwx_src.SiwxMessage"
title: "Class: SiwxMessage"
custom_edit_url: null
---

[siwx/src](../modules/siwx_src.md).SiwxMessage

Parameters for SiwxMessage constructor.

## Implements

- [`SiwxMessageFields`](../interfaces/siwx_src.SiwxMessageFields.md)

## Constructors

### constructor

• **new SiwxMessage**(`fields`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `fields` | [`SiwxMessageFields`](../interfaces/siwx_src.SiwxMessageFields.md) |

## Properties

### address

• `Readonly` **address**: `string` & `WithOpaque`\<``"address"``\>

#### Implementation of

[SiwxMessageFields](../interfaces/siwx_src.SiwxMessageFields.md).[address](../interfaces/siwx_src.SiwxMessageFields.md#address)

___

### chainId

• `Readonly` **chainId**: `string` & `WithOpaque`\<``"chain-id"``\>

#### Implementation of

[SiwxMessageFields](../interfaces/siwx_src.SiwxMessageFields.md).[chainId](../interfaces/siwx_src.SiwxMessageFields.md#chainid)

___

### domain

• `Readonly` **domain**: `string` & `WithOpaque`\<``"domain"``\>

#### Implementation of

[SiwxMessageFields](../interfaces/siwx_src.SiwxMessageFields.md).[domain](../interfaces/siwx_src.SiwxMessageFields.md#domain)

___

### expirationTime

• `Optional` `Readonly` **expirationTime**: `string` & `WithOpaque`\<``"date-time"``\>

#### Implementation of

[SiwxMessageFields](../interfaces/siwx_src.SiwxMessageFields.md).[expirationTime](../interfaces/siwx_src.SiwxMessageFields.md#expirationtime)

___

### issuedAt

• `Readonly` **issuedAt**: `string` & `WithOpaque`\<``"date-time"``\>

#### Implementation of

[SiwxMessageFields](../interfaces/siwx_src.SiwxMessageFields.md).[issuedAt](../interfaces/siwx_src.SiwxMessageFields.md#issuedat)

___

### network

• `Readonly` **network**: `string` & `WithOpaque`\<``"network"``\>

#### Implementation of

[SiwxMessageFields](../interfaces/siwx_src.SiwxMessageFields.md).[network](../interfaces/siwx_src.SiwxMessageFields.md#network)

___

### nonce

• `Readonly` **nonce**: `string` & `WithOpaque`\<``"nonce"``\>

#### Implementation of

[SiwxMessageFields](../interfaces/siwx_src.SiwxMessageFields.md).[nonce](../interfaces/siwx_src.SiwxMessageFields.md#nonce)

___

### notBefore

• `Optional` `Readonly` **notBefore**: `string` & `WithOpaque`\<``"date-time"``\>

#### Implementation of

[SiwxMessageFields](../interfaces/siwx_src.SiwxMessageFields.md).[notBefore](../interfaces/siwx_src.SiwxMessageFields.md#notbefore)

___

### requestId

• `Optional` `Readonly` **requestId**: `string` & `WithOpaque`\<``"non-empty"``\>

#### Implementation of

[SiwxMessageFields](../interfaces/siwx_src.SiwxMessageFields.md).[requestId](../interfaces/siwx_src.SiwxMessageFields.md#requestid)

___

### resources

• `Optional` `Readonly` **resources**: `string` & `WithOpaque`\<``"URI"``\>[]

#### Implementation of

[SiwxMessageFields](../interfaces/siwx_src.SiwxMessageFields.md).[resources](../interfaces/siwx_src.SiwxMessageFields.md#resources)

___

### statement

• `Optional` `Readonly` **statement**: `string` & `WithOpaque`\<``"non-empty"``\>

#### Implementation of

[SiwxMessageFields](../interfaces/siwx_src.SiwxMessageFields.md).[statement](../interfaces/siwx_src.SiwxMessageFields.md#statement)

___

### uri

• `Readonly` **uri**: `string` & `WithOpaque`\<``"URI"``\>

#### Implementation of

[SiwxMessageFields](../interfaces/siwx_src.SiwxMessageFields.md).[uri](../interfaces/siwx_src.SiwxMessageFields.md#uri)

___

### version

• `Readonly` **version**: ``"1"`` & `WithOpaque`\<``"version"``\>

#### Implementation of

[SiwxMessageFields](../interfaces/siwx_src.SiwxMessageFields.md).[version](../interfaces/siwx_src.SiwxMessageFields.md#version)

___

### fromString

▪ `Static` **fromString**: (`input`: `string`) => [`SiwxMessage`](siwx_src.SiwxMessage.md) = `fromString`

#### Type declaration

▸ (`input`): [`SiwxMessage`](siwx_src.SiwxMessage.md)

Parse SIWx message string.

##### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `string` |

##### Returns

[`SiwxMessage`](siwx_src.SiwxMessage.md)

**`Throws`**

If invalid string passed.

___

### fromStringSafe

▪ `Static` **fromStringSafe**: (`input`: `string`) => `Maybe`\<[`SiwxMessage`](siwx_src.SiwxMessage.md)\> = `fromStringSafe`

#### Type declaration

▸ (`input`): `Maybe`\<[`SiwxMessage`](siwx_src.SiwxMessage.md)\>

Parse SIWx message string. Return `Maybe`, thus do not throw.

##### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `string` |

##### Returns

`Maybe`\<[`SiwxMessage`](siwx_src.SiwxMessage.md)\>

## Methods

### toString

▸ **toString**(): `string`

#### Returns

`string`
