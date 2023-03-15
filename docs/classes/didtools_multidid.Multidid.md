# Class: Multidid

[@didtools/multidid](../modules/didtools_multidid.md).Multidid

## Constructors

### constructor

• **new Multidid**(`code`, `id`, `url`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `code` | `number` | DID Method Codec |
| `id` | `Uint8Array` | DID method id |
| `url` | `Uint8Array` | DID Method url portion |

## Accessors

### bytes

• `get` **bytes**(): `Uint8Array`

Get the multidid bytes

#### Returns

`Uint8Array`

___

### methodCode

• `get` **methodCode**(): `number`

Get the multidid method code

#### Returns

`number`

___

### methodIdBytes

• `get` **methodIdBytes**(): `Uint8Array`

Get the multidid method id bytes

#### Returns

`Uint8Array`

___

### urlBytes

• `get` **urlBytes**(): `Uint8Array`

Get the multidid url portion bytes

#### Returns

`Uint8Array`

## Methods

### encode

▸ **encode**(): `Uint8Array`

Encode multidid to bytes

#### Returns

`Uint8Array`

___

### toDIDString

▸ **toDIDString**(): `string`

DID string from multidid

#### Returns

`string`

___

### toString

▸ **toString**(`base?`): `string`

Encode multidid as string, defaults to base58btc, multibase prefix string

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `base` | `SupportedBase` | `'base58btc'` |

#### Returns

`string`

___

### decode

▸ `Static` **decode**(`bytes`): [`Multidid`](didtools_multidid.Multidid.md)

Decoded a multidid from its binary representation

#### Parameters

| Name | Type |
| :------ | :------ |
| `bytes` | `Uint8Array` |

#### Returns

[`Multidid`](didtools_multidid.Multidid.md)

___

### fromDIDString

▸ `Static` **fromDIDString**(`did`): [`Multidid`](didtools_multidid.Multidid.md)

Decode multidid instance from a did string

#### Parameters

| Name | Type |
| :------ | :------ |
| `did` | `string` |

#### Returns

[`Multidid`](didtools_multidid.Multidid.md)

___

### fromString

▸ `Static` **fromString**(`multidid`): [`Multidid`](didtools_multidid.Multidid.md)

Decode multidid string into instance, expect multibase prefix string

#### Parameters

| Name | Type |
| :------ | :------ |
| `multidid` | `string` |

#### Returns

[`Multidid`](didtools_multidid.Multidid.md)
