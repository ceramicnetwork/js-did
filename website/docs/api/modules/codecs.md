---
id: "codecs"
title: "Module: codecs"
custom_edit_url: null
---

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

Ƭ **Cacao**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `h` | [`CacaoHeader`](codecs.md#cacaoheader-1) |
| `p` | [`CacaoPayload`](codecs.md#cacaopayload-1) |
| `s?` | [`CacaoSignature`](codecs.md#cacaosignature-1) |

___

### CacaoHeader

Ƭ **CacaoHeader**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `t` | ``"eip4361"`` \| ``"caip122"`` |

___

### CacaoPayload

Ƭ **CacaoPayload**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `aud` | `string` |
| `domain` | `string` |
| `exp?` | `string` |
| `iat` | `string` |
| `iss` | `string` |
| `nbf?` | `string` |
| `nonce` | `string` |
| `requestId?` | `string` |
| `resources?` | `string`[] |
| `statement?` | `string` |
| `version` | `string` |

___

### CacaoSignature

Ƭ **CacaoSignature**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `m?` | [`SignatureMeta`](codecs.md#signaturemeta) |
| `s` | `string` |
| `t` | ``"eip191"`` \| ``"eip1271"`` \| ``"solana:ed25519"`` \| ``"tezos:ed25519"`` \| ``"stacks:secp256k1"`` \| ``"webauthn:p256"`` |

___

### DIDString

Ƭ **DIDString**: `Opaque`<`string`, ``"DIDString"``\>

___

### DagJWS

Ƭ **DagJWS**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `link?` | `CID` |
| `payload` | `string` |
| `signatures` | [`JWSSignature`](codecs.md#jwssignature-1)[] |

___

### GeneralJWS

Ƭ **GeneralJWS**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `payload` | `string` |
| `signatures` | [`JWSSignature`](codecs.md#jwssignature-1)[] |

___

### JWSSignature

Ƭ **JWSSignature**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `protected` | `string` |
| `signature` | `string` |

___

### SignatureMeta

Ƭ **SignatureMeta**: `any`

___

### SignedCacao

Ƭ **SignedCacao**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `h` | [`CacaoHeader`](codecs.md#cacaoheader-1) |
| `p` | [`CacaoPayload`](codecs.md#cacaopayload-1) |
| `s` | [`CacaoSignature`](codecs.md#cacaosignature-1) |

## Variables

### Cacao

• `Const` **Cacao**: `SparseCodec`<{ `h`: `ExactCodec`<`TypeCodec`<{ `t`: `KeyOfCodec`<{ `caip122`: ``null`` = null; `eip4361`: ``null`` = null }\>  }\>\> = CacaoHeader; `p`: `SparseCodec`<{ `aud`: `TrivialCodec`<`string`\> = string; `domain`: `TrivialCodec`<`string`\> = string; `exp`: `OptionalCodec`<`TrivialCodec`<`string`\>\> ; `iat`: `TrivialCodec`<`string`\> = string; `iss`: `TrivialCodec`<`string`\> = string; `nbf`: `OptionalCodec`<`TrivialCodec`<`string`\>\> ; `nonce`: `TrivialCodec`<`string`\> = string; `requestId`: `OptionalCodec`<`TrivialCodec`<`string`\>\> ; `resources`: `OptionalCodec`<`Codec`<`string`[], `string`[], `unknown`\> & {}\> ; `statement`: `OptionalCodec`<`TrivialCodec`<`string`\>\> ; `version`: `TrivialCodec`<`string`\> = string }\> = CacaoPayload; `s`: `OptionalCodec`<`ExactCodec`<`TypeCodec`<{ `s`: `TrivialCodec`<`string`\> = string; `t`: `KeyOfCodec`<{ `eip1271`: ``null`` = null; `eip191`: ``null`` = null; `solana:ed25519`: ``null`` = null; `stacks:secp256k1`: ``null`` = null; `tezos:ed25519`: ``null`` = null }\>  }\>\>\>  }\>

___

### CacaoHeader

• `Const` **CacaoHeader**: `ExactCodec`<`TypeCodec`<{ `t`: `KeyOfCodec`<{ `caip122`: ``null`` = null; `eip4361`: ``null`` = null }\>  }\>\>

___

### CacaoPayload

• `Const` **CacaoPayload**: `SparseCodec`<{ `aud`: `TrivialCodec`<`string`\> = string; `domain`: `TrivialCodec`<`string`\> = string; `exp`: `OptionalCodec`<`TrivialCodec`<`string`\>\> ; `iat`: `TrivialCodec`<`string`\> = string; `iss`: `TrivialCodec`<`string`\> = string; `nbf`: `OptionalCodec`<`TrivialCodec`<`string`\>\> ; `nonce`: `TrivialCodec`<`string`\> = string; `requestId`: `OptionalCodec`<`TrivialCodec`<`string`\>\> ; `resources`: `OptionalCodec`<`Codec`<`string`[], `string`[], `unknown`\> & {}\> ; `statement`: `OptionalCodec`<`TrivialCodec`<`string`\>\> ; `version`: `TrivialCodec`<`string`\> = string }\>

___

### CacaoSignature

• `Const` **CacaoSignature**: `ExactCodec`<`TypeCodec`<{ `s`: `TrivialCodec`<`string`\> = string; `t`: `KeyOfCodec`<{ `eip1271`: ``null`` = null; `eip191`: ``null`` = null; `solana:ed25519`: ``null`` = null; `stacks:secp256k1`: ``null`` = null; `tezos:ed25519`: ``null`` = null }\>  }\>\>

___

### DagJWS

• `Const` **DagJWS**: `SparseCodec`<{ `link`: `OptionalCodec`<`Type`<`CID`<`unknown`, `number`, `number`, `Version`\>, `string`, `string`\>\> ; `payload`: `TrivialCodec`<`string`\> = string; `signatures`: `Codec`<`MapIn`<{ `protected`: `TrivialCodec`<`string`\> = string; `signature`: `TrivialCodec`<`string`\> = string }, `$TypeOf`\>[], `MapIn`<{ `protected`: `TrivialCodec`<`string`\> = string; `signature`: `TrivialCodec`<`string`\> = string }, `$OutputOf`\>[], `unknown`\> & {}  }\>

___

### GeneralJWS

• `Const` **GeneralJWS**: `ExactCodec`<`TypeCodec`<{ `payload`: `TrivialCodec`<`string`\> = string; `signatures`: `Codec`<`MapIn`<{ `protected`: `TrivialCodec`<`string`\> = string; `signature`: `TrivialCodec`<`string`\> = string }, `$TypeOf`\>[], `MapIn`<{ `protected`: `TrivialCodec`<`string`\> = string; `signature`: `TrivialCodec`<`string`\> = string }, `$OutputOf`\>[], `unknown`\> & {}  }\>\>

___

### JWSSignature

• `Const` **JWSSignature**: `ExactCodec`<`TypeCodec`<{ `protected`: `TrivialCodec`<`string`\> = string; `signature`: `TrivialCodec`<`string`\> = string }\>\>

___

### SignedCacao

• `Const` **SignedCacao**: `ExactCodec`<`TypeCodec`<{ `h`: `ExactCodec`<`TypeCodec`<{ `t`: `KeyOfCodec`<{ `caip122`: ``null`` = null; `eip4361`: ``null`` = null }\>  }\>\> = CacaoHeader; `p`: `SparseCodec`<{ `aud`: `TrivialCodec`<`string`\> = string; `domain`: `TrivialCodec`<`string`\> = string; `exp`: `OptionalCodec`<`TrivialCodec`<`string`\>\> ; `iat`: `TrivialCodec`<`string`\> = string; `iss`: `TrivialCodec`<`string`\> = string; `nbf`: `OptionalCodec`<`TrivialCodec`<`string`\>\> ; `nonce`: `TrivialCodec`<`string`\> = string; `requestId`: `OptionalCodec`<`TrivialCodec`<`string`\>\> ; `resources`: `OptionalCodec`<`Codec`<`string`[], `string`[], `unknown`\> & {}\> ; `statement`: `OptionalCodec`<`TrivialCodec`<`string`\>\> ; `version`: `TrivialCodec`<`string`\> = string }\> = CacaoPayload; `s`: `ExactCodec`<`TypeCodec`<{ `s`: `TrivialCodec`<`string`\> = string; `t`: `KeyOfCodec`<{ `eip1271`: ``null`` = null; `eip191`: ``null`` = null; `solana:ed25519`: ``null`` = null; `stacks:secp256k1`: ``null`` = null; `tezos:ed25519`: ``null`` = null }\>  }\>\> = CacaoSignature }\>\>

___

### cid

• `Const` **cid**: `Type`<`CID`<`unknown`, `number`, `number`, `Version`\>, `CID`<`unknown`, `number`, `number`, `Version`\>, `unknown`\>

Passthrough codeco codec for CID.

___

### cidAsString

• `Const` **cidAsString**: `Type`<`CID`<`unknown`, `number`, `number`, `Version`\>, `string`, `string`\>

codeco codec for CID encoded as string.

___

### didString

• `Const` **didString**: `RefinementCodec`<`TrivialCodec`<`string`\>, `string` & `WithOpaque`<``"DIDString"``\>\>

codeco codec for a vanilla DID string, i.e. `did:method:id`.

___

### uint8ArrayAsBase64

• `Const` **uint8ArrayAsBase64**: `Type`<`Uint8Array`, `string`, `string`\>

codeco codec for Uint8Array as base64-encoded string.

___

### uint8ArrayAsBase64pad

• `Const` **uint8ArrayAsBase64pad**: `Type`<`Uint8Array`, `string`, `string`\>

codeco codec for Uint8Array as base64pad-encoded string.

___

### uint8ArrayAsBase64url

• `Const` **uint8ArrayAsBase64url**: `Type`<`Uint8Array`, `string`, `string`\>

codeco codec for Uint8Array as base64url-encoded string.

___

### uint8array

• `Const` **uint8array**: `TrivialCodec`<`Uint8Array`\>

codeco codec for JS `Uint8Array`.

## Functions

### asDIDString

▸ **asDIDString**(`input`): [`DIDString`](codecs.md#didstring)

Type cast `input` as `DIDString`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `string` |

#### Returns

[`DIDString`](codecs.md#didstring)

___

### createUint8ArrayAsString

▸ **createUint8ArrayAsString**(`encoding`): `Type`<`Uint8Array`, `string`, `string`\>

Factory for codeco codec for Uint8Array as encoded string.

#### Parameters

| Name | Type |
| :------ | :------ |
| `encoding` | `SupportedEncodings` |

#### Returns

`Type`<`Uint8Array`, `string`, `string`\>

___

### isDIDString

▸ **isDIDString**(`input`): input is string & WithOpaque<"DIDString"\>

Verify if `input` is DID string, i.e. conforms to `did:method:id` format.

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `string` |

#### Returns

input is string & WithOpaque<"DIDString"\>

___

### isUint8Array

▸ **isUint8Array**(`input`): input is Uint8Array

Check if the input is a JS `Uint8Array`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `unknown` |

#### Returns

input is Uint8Array
