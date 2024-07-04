---
id: "key_did"
title: "Module: key-did"
custom_edit_url: null
---

# Key DID

Utility functions for `did:key` DIDs.

## Installation

```sh
npm install @didtools/key-did
```

## Usage

### Create a DID with an optional seed

```js
import { createDID } from '@didtools/key-did'

const seed = // 32 bytes of entropy, Uint8Array
const did = createDID(seed)

// Authenticate with the provider
await did.authenticate()
```

### Generate a random private key and create an authenticated DID

```js
import { generatePrivateKey, getAuthenticatedDID } from '@didtools/key-did'

const randomKey = generatePrivateKey()
const did = await getAuthenticatedDID(randomKey)
```

## Functions

### createDID

▸ **createDID**(`seed?`): `DID`

#### Parameters

| Name | Type |
| :------ | :------ |
| `seed?` | `Uint8Array` |

#### Returns

`DID`

___

### generatePrivateKey

▸ **generatePrivateKey**(): `Uint8Array`

#### Returns

`Uint8Array`

___

### getAuthenticatedDID

▸ **getAuthenticatedDID**(`seed`): `Promise`<`DID`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `seed` | `Uint8Array` |

#### Returns

`Promise`<`DID`\>
