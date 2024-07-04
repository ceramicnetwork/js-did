---
id: "didtools_multidid.Multidid"
title: "Class: Multidid"
custom_edit_url: null
---

[@didtools/multidid](../modules/didtools_multidid.md).Multidid

## Constructors

### constructor

• **new Multidid**(`code`, `id`, `url`): [`Multidid`](didtools_multidid.Multidid.md)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `code` | `number` | DID Method Codec |
| `id` | `Uint8Array` | DID method id |
| `url` | `Uint8Array` | DID Method url portion |

#### Returns

[`Multidid`](didtools_multidid.Multidid.md)

## Methods

### inspect

▸ **inspect**(): `InspectObject`

Get the multidid by parts, res.methodCode, res.methodIdBytes, res.urlBytes

#### Returns

`InspectObject`

___

### toBytes

▸ **toBytes**(): `Uint8Array`

Encode multidid to bytes

#### Returns

`Uint8Array`

___

### toMultibase

▸ **toMultibase**(`base?`): `string`

Encode multidid as multibase string, defaults to base58btc, multibase prefix string

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `base` | `SupportedBase` | `'base58btc'` |

#### Returns

`string`

___

### toString

▸ **toString**(): `string`

DID string from multidid

#### Returns

`string`

___

### fromBytes

▸ **fromBytes**(`bytes`): [`Multidid`](didtools_multidid.Multidid.md)

Decoded a multidid from its binary representation

#### Parameters

| Name | Type |
| :------ | :------ |
| `bytes` | `Uint8Array` |

#### Returns

[`Multidid`](didtools_multidid.Multidid.md)

___

### fromMultibase

▸ **fromMultibase**(`multidid`): [`Multidid`](didtools_multidid.Multidid.md)

Decode multibase multidid string into instance, expects multibase prefix

#### Parameters

| Name | Type |
| :------ | :------ |
| `multidid` | `string` |

#### Returns

[`Multidid`](didtools_multidid.Multidid.md)

___

### fromString

▸ **fromString**(`did`): [`Multidid`](didtools_multidid.Multidid.md)

Decode multidid instance from a did string

#### Parameters

| Name | Type |
| :------ | :------ |
| `did` | `string` |

#### Returns

[`Multidid`](didtools_multidid.Multidid.md)
