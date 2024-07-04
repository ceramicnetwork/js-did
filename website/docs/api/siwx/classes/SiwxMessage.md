# Class: SiwxMessage

Parameters for SiwxMessage constructor.

## Implements

- [`SiwxMessageFields`](../index.md#siwxmessagefields)

## Constructors

### new SiwxMessage()

> **new SiwxMessage**(`fields`): [`SiwxMessage`](SiwxMessage.md)

#### Parameters

• **fields**: [`SiwxMessageFields`](../index.md#siwxmessagefields)

#### Returns

[`SiwxMessage`](SiwxMessage.md)

## Properties

### address

> `readonly` **address**: `string` & `WithOpaque`\<`"address"`\>

#### Implementation of

[`SiwxMessageFields`](../index.md#siwxmessagefields).[`address`](../index.md#address)

***

### chainId

> `readonly` **chainId**: `string` & `WithOpaque`\<`"chain-id"`\>

#### Implementation of

[`SiwxMessageFields`](../index.md#siwxmessagefields).[`chainId`](../index.md#chainid)

***

### domain

> `readonly` **domain**: `string` & `WithOpaque`\<`"domain"`\>

#### Implementation of

[`SiwxMessageFields`](../index.md#siwxmessagefields).[`domain`](../index.md#domain)

***

### expirationTime?

> `readonly` `optional` **expirationTime**: `string` & `WithOpaque`\<`"date-time"`\>

#### Implementation of

[`SiwxMessageFields`](../index.md#siwxmessagefields).[`expirationTime`](../index.md#expirationtime)

***

### issuedAt

> `readonly` **issuedAt**: `string` & `WithOpaque`\<`"date-time"`\>

#### Implementation of

[`SiwxMessageFields`](../index.md#siwxmessagefields).[`issuedAt`](../index.md#issuedat)

***

### network

> `readonly` **network**: `string` & `WithOpaque`\<`"network"`\>

#### Implementation of

[`SiwxMessageFields`](../index.md#siwxmessagefields).[`network`](../index.md#network)

***

### nonce

> `readonly` **nonce**: `string` & `WithOpaque`\<`"nonce"`\>

#### Implementation of

[`SiwxMessageFields`](../index.md#siwxmessagefields).[`nonce`](../index.md#nonce)

***

### notBefore?

> `readonly` `optional` **notBefore**: `string` & `WithOpaque`\<`"date-time"`\>

#### Implementation of

[`SiwxMessageFields`](../index.md#siwxmessagefields).[`notBefore`](../index.md#notbefore)

***

### requestId?

> `readonly` `optional` **requestId**: `string` & `WithOpaque`\<`"non-empty"`\>

#### Implementation of

[`SiwxMessageFields`](../index.md#siwxmessagefields).[`requestId`](../index.md#requestid)

***

### resources?

> `readonly` `optional` **resources**: `string` & `WithOpaque`\<`"URI"`\>[]

#### Implementation of

[`SiwxMessageFields`](../index.md#siwxmessagefields).[`resources`](../index.md#resources)

***

### statement?

> `readonly` `optional` **statement**: `string` & `WithOpaque`\<`"non-empty"`\>

#### Implementation of

[`SiwxMessageFields`](../index.md#siwxmessagefields).[`statement`](../index.md#statement)

***

### uri

> `readonly` **uri**: `string` & `WithOpaque`\<`"URI"`\>

#### Implementation of

[`SiwxMessageFields`](../index.md#siwxmessagefields).[`uri`](../index.md#uri)

***

### version

> `readonly` **version**: `"1"` & `WithOpaque`\<`"version"`\>

#### Implementation of

[`SiwxMessageFields`](../index.md#siwxmessagefields).[`version`](../index.md#version)

***

### fromString()

> `static` **fromString**: (`input`) => [`SiwxMessage`](SiwxMessage.md)

Parse SIWx message string.

#### Throws

If invalid string passed.

#### Parameters

• **input**: `string`

#### Returns

[`SiwxMessage`](SiwxMessage.md)

***

### fromStringSafe()

> `static` **fromStringSafe**: (`input`) => `Maybe`\<[`SiwxMessage`](SiwxMessage.md)\>

Parse SIWx message string. Return `Maybe`, thus do not throw.

#### Parameters

• **input**: `string`

#### Returns

`Maybe`\<[`SiwxMessage`](SiwxMessage.md)\>

## Methods

### toString()

> **toString**(): `string`

Returns a string representation of an object.

#### Returns

`string`
