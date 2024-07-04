# Class: Multidid

## Constructors

### new Multidid()

> **new Multidid**(`code`, `id`, `url`): [`Multidid`](Multidid.md)

#### Parameters

• **code**: `number`

DID Method Codec

• **id**: `Uint8Array`

DID method id

• **url**: `Uint8Array`

DID Method url portion

#### Returns

[`Multidid`](Multidid.md)

## Methods

### inspect()

> **inspect**(): `InspectObject`

Get the multidid by parts, res.methodCode, res.methodIdBytes, res.urlBytes

#### Returns

`InspectObject`

***

### toBytes()

> **toBytes**(): `Uint8Array`

Encode multidid to bytes

#### Returns

`Uint8Array`

***

### toMultibase()

> **toMultibase**(`base`): `string`

Encode multidid as multibase string, defaults to base58btc, multibase prefix string

#### Parameters

• **base**: `SupportedBase` = `'base58btc'`

#### Returns

`string`

***

### toString()

> **toString**(): `string`

DID string from multidid

#### Returns

`string`

***

### fromBytes()

> `static` **fromBytes**(`bytes`): [`Multidid`](Multidid.md)

Decoded a multidid from its binary representation

#### Parameters

• **bytes**: `Uint8Array`

#### Returns

[`Multidid`](Multidid.md)

***

### fromMultibase()

> `static` **fromMultibase**(`multidid`): [`Multidid`](Multidid.md)

Decode multibase multidid string into instance, expects multibase prefix

#### Parameters

• **multidid**: `string`

#### Returns

[`Multidid`](Multidid.md)

***

### fromString()

> `static` **fromString**(`did`): [`Multidid`](Multidid.md)

Decode multidid instance from a did string

#### Parameters

• **did**: `string`

#### Returns

[`Multidid`](Multidid.md)
