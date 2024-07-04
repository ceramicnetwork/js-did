# codecs

Common codecs for DID packages.

## Purpose

Codecs for encoding, decoding and validating types used by the DID packages.

## Installation

```sh
npm install @didtools/codecs
```

## Usage

Validate a string is a valid DID:

```js
import { didString } from '@didtools/codecs'
import { isRight, validate } from 'codeco'

const result = validate(didString, 'did:key:...')
const isValid = isRight(result)
```

Encode and decode a Uint8Array as base64-encoded string:

```js
import { uint8ArrayAsBase64 } from '@didtools/codecs'
import { decode } from 'codeco'

const bytes = new Uint8Array(...)
const encoded = uint8ArrayAsBase64.encode(bytes)
const decoded = decode(uint8ArrayAsBase64, encoded)
```

## Type Aliases

### Cacao

> **Cacao**: `object`

#### Type declaration

##### h

> **h**: [`CacaoHeader`](index.md#cacaoheader)

##### p

> **p**: [`CacaoPayload`](index.md#cacaopayload)

##### s?

> `optional` **s**: [`CacaoSignature`](index.md#cacaosignature)

***

### CacaoHeader

> **CacaoHeader**: `object`

#### Type declaration

##### t

> **t**: `"eip4361"` \| `"caip122"`

***

### CacaoPayload

> **CacaoPayload**: `object`

#### Type declaration

##### aud

> **aud**: `string`

##### domain

> **domain**: `string`

##### exp?

> `optional` **exp**: `string`

##### iat

> **iat**: `string`

##### iss

> **iss**: `string`

##### nbf?

> `optional` **nbf**: `string`

##### nonce

> **nonce**: `string`

##### requestId?

> `optional` **requestId**: `string`

##### resources?

> `optional` **resources**: `string`[]

##### statement?

> `optional` **statement**: `string`

##### version

> **version**: `string`

***

### CacaoSignature

> **CacaoSignature**: `object`

#### Type declaration

##### m?

> `optional` **m**: [`SignatureMeta`](index.md#signaturemeta)

##### s

> **s**: `string`

##### t

> **t**: `"eip191"` \| `"eip1271"` \| `"solana:ed25519"` \| `"tezos:ed25519"` \| `"stacks:secp256k1"` \| `"webauthn:p256"`

***

### DIDString

> **DIDString**: `Opaque`\<`string`, `"DIDString"`\>

***

### DagJWS

> **DagJWS**: `object`

#### Type declaration

##### link?

> `optional` **link**: `CID`

##### payload

> **payload**: `string`

##### signatures

> **signatures**: [`JWSSignature`](index.md#jwssignature)[]

***

### GeneralJWS

> **GeneralJWS**: `object`

#### Type declaration

##### payload

> **payload**: `string`

##### signatures

> **signatures**: [`JWSSignature`](index.md#jwssignature)[]

***

### JWSSignature

> **JWSSignature**: `object`

#### Type declaration

##### protected

> **protected**: `string`

##### signature

> **signature**: `string`

***

### SignatureMeta

> **SignatureMeta**: `any`

***

### SignedCacao

> **SignedCacao**: `object`

#### Type declaration

##### h

> **h**: [`CacaoHeader`](index.md#cacaoheader)

##### p

> **p**: [`CacaoPayload`](index.md#cacaopayload)

##### s

> **s**: [`CacaoSignature`](index.md#cacaosignature)

## Variables

### Cacao

> `const` **Cacao**: `SparseCodec`\<`object`\>

#### Type declaration

##### h

> **h**: `ExactCodec`\<`TypeCodec`\<`object`\>\> = `CacaoHeader`

##### p

> **p**: `SparseCodec`\<`object`\> = `CacaoPayload`

###### Type declaration

###### aud

> **aud**: `TrivialCodec`\<`string`\> = `string`

###### domain

> **domain**: `TrivialCodec`\<`string`\> = `string`

###### exp

> **exp**: `OptionalCodec`\<`TrivialCodec`\<`string`\>\>

###### iat

> **iat**: `TrivialCodec`\<`string`\> = `string`

###### iss

> **iss**: `TrivialCodec`\<`string`\> = `string`

###### nbf

> **nbf**: `OptionalCodec`\<`TrivialCodec`\<`string`\>\>

###### nonce

> **nonce**: `TrivialCodec`\<`string`\> = `string`

###### requestId

> **requestId**: `OptionalCodec`\<`TrivialCodec`\<`string`\>\>

###### resources

> **resources**: `OptionalCodec`\<`Codec`\<`string`[], `string`[], `unknown`\> & `object`\>

###### statement

> **statement**: `OptionalCodec`\<`TrivialCodec`\<`string`\>\>

###### version

> **version**: `TrivialCodec`\<`string`\> = `string`

##### s

> **s**: `OptionalCodec`\<`ExactCodec`\<`TypeCodec`\<`object`\>\>\>

***

### CacaoHeader

> `const` **CacaoHeader**: `ExactCodec`\<`TypeCodec`\<`object`\>\>

***

### CacaoPayload

> `const` **CacaoPayload**: `SparseCodec`\<`object`\>

#### Type declaration

##### aud

> **aud**: `TrivialCodec`\<`string`\> = `string`

##### domain

> **domain**: `TrivialCodec`\<`string`\> = `string`

##### exp

> **exp**: `OptionalCodec`\<`TrivialCodec`\<`string`\>\>

##### iat

> **iat**: `TrivialCodec`\<`string`\> = `string`

##### iss

> **iss**: `TrivialCodec`\<`string`\> = `string`

##### nbf

> **nbf**: `OptionalCodec`\<`TrivialCodec`\<`string`\>\>

##### nonce

> **nonce**: `TrivialCodec`\<`string`\> = `string`

##### requestId

> **requestId**: `OptionalCodec`\<`TrivialCodec`\<`string`\>\>

##### resources

> **resources**: `OptionalCodec`\<`Codec`\<`string`[], `string`[], `unknown`\> & `object`\>

##### statement

> **statement**: `OptionalCodec`\<`TrivialCodec`\<`string`\>\>

##### version

> **version**: `TrivialCodec`\<`string`\> = `string`

***

### CacaoSignature

> `const` **CacaoSignature**: `ExactCodec`\<`TypeCodec`\<`object`\>\>

***

### DagJWS

> `const` **DagJWS**: `SparseCodec`\<`object`\>

#### Type declaration

##### link

> **link**: `OptionalCodec`\<`Type`\<`CID`\<`unknown`, `number`, `number`, `Version`\>, `string`, `string`\>\>

##### payload

> **payload**: `TrivialCodec`\<`string`\> = `string`

##### signatures

> **signatures**: `Codec`\<`MapIn`\<`object`, `$TypeOf`\>[], `MapIn`\<`object`, `$OutputOf`\>[], `unknown`\> & `object`

***

### GeneralJWS

> `const` **GeneralJWS**: `ExactCodec`\<`TypeCodec`\<`object`\>\>

***

### JWSSignature

> `const` **JWSSignature**: `ExactCodec`\<`TypeCodec`\<`object`\>\>

***

### SignedCacao

> `const` **SignedCacao**: `ExactCodec`\<`TypeCodec`\<`object`\>\>

***

### cid

> `const` **cid**: `Type`\<`CID`\<`unknown`, `number`, `number`, `Version`\>, `CID`\<`unknown`, `number`, `number`, `Version`\>, `unknown`\>

Passthrough codeco codec for CID.

***

### cidAsString

> `const` **cidAsString**: `Type`\<`CID`\<`unknown`, `number`, `number`, `Version`\>, `string`, `string`\>

codeco codec for CID encoded as string.

***

### didString

> `const` **didString**: `RefinementCodec`\<`TrivialCodec`\<`string`\>, `string` & `WithOpaque`\<`"DIDString"`\>\>

codeco codec for a vanilla DID string, i.e. `did:method:id`.

***

### uint8ArrayAsBase64

> `const` **uint8ArrayAsBase64**: `Type`\<`Uint8Array`, `string`, `string`\>

codeco codec for Uint8Array as base64-encoded string.

***

### uint8ArrayAsBase64pad

> `const` **uint8ArrayAsBase64pad**: `Type`\<`Uint8Array`, `string`, `string`\>

codeco codec for Uint8Array as base64pad-encoded string.

***

### uint8ArrayAsBase64url

> `const` **uint8ArrayAsBase64url**: `Type`\<`Uint8Array`, `string`, `string`\>

codeco codec for Uint8Array as base64url-encoded string.

***

### uint8array

> `const` **uint8array**: `TrivialCodec`\<`Uint8Array`\>

codeco codec for JS `Uint8Array`.

## Functions

### asDIDString()

> **asDIDString**(`input`): [`DIDString`](index.md#didstring)

Type cast `input` as `DIDString`.

#### Parameters

• **input**: `string`

#### Returns

[`DIDString`](index.md#didstring)

***

### createUint8ArrayAsString()

> **createUint8ArrayAsString**(`encoding`): `Type`\<`Uint8Array`, `string`, `string`\>

Factory for codeco codec for Uint8Array as encoded string.

#### Parameters

• **encoding**: `SupportedEncodings`

#### Returns

`Type`\<`Uint8Array`, `string`, `string`\>

***

### isDIDString()

> **isDIDString**(`input`): `input is string & WithOpaque<"DIDString">`

Verify if `input` is DID string, i.e. conforms to `did:method:id` format.

#### Parameters

• **input**: `string`

#### Returns

`input is string & WithOpaque<"DIDString">`

***

### isUint8Array()

> **isUint8Array**(`input`): `input is Uint8Array`

Check if the input is a JS `Uint8Array`.

#### Parameters

• **input**: `unknown`

#### Returns

`input is Uint8Array`
