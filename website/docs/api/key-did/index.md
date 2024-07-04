# key-did

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

### createDID()

> **createDID**(`seed`?): `DID`

#### Parameters

• **seed?**: `Uint8Array`

#### Returns

`DID`

***

### generatePrivateKey()

> **generatePrivateKey**(): `Uint8Array`

#### Returns

`Uint8Array`

***

### getAuthenticatedDID()

> **getAuthenticatedDID**(`seed`): `Promise`\<`DID`\>

#### Parameters

• **seed**: `Uint8Array`

#### Returns

`Promise`\<`DID`\>
