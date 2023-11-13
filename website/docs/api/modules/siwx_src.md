---
id: "siwx_src"
title: "Module: siwx/src"
custom_edit_url: null
---

## Classes

- [SignedSiwxMessage](../classes/siwx_src.SignedSiwxMessage.md)
- [SiwxMessage](../classes/siwx_src.SiwxMessage.md)

## Interfaces

- [ISignedSiwxMessage](../interfaces/siwx_src.ISignedSiwxMessage.md)
- [SiwxMessageFields](../interfaces/siwx_src.SiwxMessageFields.md)

## References

### fromString

Renames and re-exports [__type](../classes/siwx_src.SiwxMessage.md#__type)

___

### fromStringSafe

Renames and re-exports [__type](../classes/siwx_src.SiwxMessage.md#__type)

## Type Aliases

### AddressString

Ƭ **AddressString**: `Opaque`\<`string`, ``"address"``\>

___

### ChainIdString

Ƭ **ChainIdString**: `Opaque`\<`string`, ``"chain-id"``\>

___

### DateTimeString

Ƭ **DateTimeString**: `Opaque`\<`string`, ``"date-time"``\>

___

### DomainString

Ƭ **DomainString**: `Opaque`\<`string`, ``"domain"``\>

Custom SIWE domain. `dnsauthority` that can not be empty.

___

### NetworkString

Ƭ **NetworkString**: `Opaque`\<`string`, ``"network"``\>

___

### NonEmptyString

Ƭ **NonEmptyString**: `Opaque`\<`string`, ``"non-empty"``\>

___

### NonceString

Ƭ **NonceString**: `Opaque`\<`string`, ``"nonce"``\>

___

### Signature

Ƭ **Signature**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `bytes` | `Uint8Array` |
| `kind` | `string` |

___

### URIString

Ƭ **URIString**: `Opaque`\<`string`, ``"URI"``\>

___

### VersionString

Ƭ **VersionString**: `Opaque`\<``"1"``, ``"version"``\>

## Functions

### toString

▸ **toString**(`message`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | [`SiwxMessage`](../classes/siwx_src.SiwxMessage.md) |

#### Returns

`string`
