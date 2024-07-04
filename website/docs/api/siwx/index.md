# siwx

## Index

### Classes

- [SignedSiwxMessage](classes/SignedSiwxMessage.md)
- [SiwxMessage](classes/SiwxMessage.md)

## References

### fromString

Re-exports [fromString](classes/SiwxMessage.md#fromstring)

***

### fromStringSafe

Re-exports [fromStringSafe](classes/SiwxMessage.md#fromstringsafe)

## Interfaces

### ISignedSiwxMessage

#### Properties

##### message

> `readonly` **message**: [`SiwxMessage`](classes/SiwxMessage.md)

***

##### signature

> `readonly` **signature**: [`Signature`](index.md#signature-1)

***

### SiwxMessageFields

Parameters for SiwxMessage constructor.

#### Properties

##### address

> `readonly` **address**: `string`

***

##### chainId

> `readonly` **chainId**: `string` \| `number`

***

##### domain

> `readonly` **domain**: `string`

***

##### expirationTime?

> `readonly` `optional` **expirationTime**: `string`

***

##### issuedAt

> `readonly` **issuedAt**: `string`

***

##### network

> `readonly` **network**: `string`

***

##### nonce

> `readonly` **nonce**: `string` \| `number`

***

##### notBefore?

> `readonly` `optional` **notBefore**: `string`

***

##### requestId?

> `readonly` `optional` **requestId**: `string`

***

##### resources?

> `readonly` `optional` **resources**: `string`[]

***

##### statement?

> `readonly` `optional` **statement**: `string`

***

##### uri

> `readonly` **uri**: `string`

***

##### version?

> `readonly` `optional` **version**: `string` \| `number`

## Type Aliases

### AddressString

> **AddressString**: `Opaque`\<`string`, `"address"`\>

***

### ChainIdString

> **ChainIdString**: `Opaque`\<`string`, `"chain-id"`\>

***

### DateTimeString

> **DateTimeString**: `Opaque`\<`string`, `"date-time"`\>

***

### DomainString

> **DomainString**: `Opaque`\<`string`, `"domain"`\>

Custom SIWE domain. `dnsauthority` that can not be empty.

***

### NetworkString

> **NetworkString**: `Opaque`\<`string`, `"network"`\>

***

### NonEmptyString

> **NonEmptyString**: `Opaque`\<`string`, `"non-empty"`\>

***

### NonceString

> **NonceString**: `Opaque`\<`string`, `"nonce"`\>

***

### Signature

> **Signature**: `object`

#### Type declaration

##### bytes

> **bytes**: `Uint8Array`

##### kind

> **kind**: `string`

***

### URIString

> **URIString**: `Opaque`\<`string`, `"URI"`\>

***

### VersionString

> **VersionString**: `Opaque`\<`"1"`, `"version"`\>

## Functions

### toString()

> **toString**(`message`): `string`

#### Parameters

• **message**: [`SiwxMessage`](classes/SiwxMessage.md)

#### Returns

`string`
