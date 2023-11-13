---
id: "didtools_key_webcrypto"
title: "Module: @didtools/key-webcrypto"
custom_edit_url: null
---

# Webcrypto Key Did Provider
This is a DID Provider which implements [EIP2844](https://eips.ethereum.org/EIPS/eip-2844) for `did:key:` using webcrypto with non-extractable keys.

## Installation

```
npm install --save @didtools/key-webcrypto
```

## Usage

```js
import { CryptoKeyProvider, generateP256KeyPair } from '@didtools/key-webcrypto'
import KeyResolver from 'key-did-resolver'
import { DID } from 'dids'

const keyPair = generateP256KeyPair()
const provider = new WebcryptoProvider(keypair)
const did = new DID({ provider, resolver: KeyResolver.getResolver() })
await did.authenticate()

// log the DID
console.log(did.id)

// create JWS
const { jws, linkedBlock } = await did.createDagJWS({ hello: 'world' })

// verify JWS
await did.verifyJWS(jws)
```

## Classes

- [WebcryptoProvider](../classes/didtools_key_webcrypto.WebcryptoProvider.md)

## Functions

### ecPointCompress

▸ **ecPointCompress**(`x`, `y`): `Uint8Array`

compress a public key with points x,y expressed as UintArrays
source: https://stackoverflow.com/questions/17171542/algorithm-for-elliptic-curve-point-compression

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `x` | `Uint8Array` | x point of public key |
| `y` | `Uint8Array` | y point of public key |

#### Returns

`Uint8Array`

compressed form of public key as Uint8Array

___

### encodeDIDFromPub

▸ **encodeDIDFromPub**(`publicKey`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `publicKey` | `Uint8Array` |

#### Returns

`string`

___

### generateP256KeyPair

▸ **generateP256KeyPair**(): `Promise`\<`CryptoKeyPair`\>

#### Returns

`Promise`\<`CryptoKeyPair`\>

___

### getPublicKey

▸ **getPublicKey**(`«destructured»`): `Promise`\<`Uint8Array`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `CryptoKeyPair` |

#### Returns

`Promise`\<`Uint8Array`\>
