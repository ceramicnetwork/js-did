# key-secp256k1

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

## Index

### Classes

- [Secp256k1Provider](classes/Secp256k1Provider.md)

## Functions

### encodeDIDFromPriv()

> **encodeDIDFromPriv**(`secretKey`): `string`

#### Parameters

• **secretKey**: `Uint8Array`

#### Returns

`string`

***

### encodeDIDFromPub()

> **encodeDIDFromPub**(`publicKey`): `string`

#### Parameters

• **publicKey**: `Uint8Array`

#### Returns

`string`
