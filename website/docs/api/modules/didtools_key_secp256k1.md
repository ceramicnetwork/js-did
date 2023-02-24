---
id: "didtools_key_secp256k1"
title: "Module: @didtools/key-secp256k1"
custom_edit_url: null
---

# secp256k1 Key Did Provider
This is a DID Provider which implements [EIP2844](https://eips.ethereum.org/EIPS/eip-2844) for `did:key:` using secp256k1.

## Installation

```
npm install --save @didtools/key-secp256k1
```

## Usage

```js
import { Secp256k1Provider } from '@didtools/key-secp256k1'
import KeyResolver from 'key-did-resolver'
import { DID } from 'dids'

const seed = new Uint8Array(...) //  32 bytes with high entropy
const provider = new Secp256k1Provider(seed)
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

- [Secp256k1Provider](../classes/didtools_key_secp256k1.Secp256k1Provider.md)

## Functions

### encodeDIDFromPriv

▸ **encodeDIDFromPriv**(`secretKey`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `secretKey` | `Uint8Array` |

#### Returns

`string`

___

### encodeDIDFromPub

▸ **encodeDIDFromPub**(`publicKey`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `publicKey` | `Uint8Array` |

#### Returns

`string`
