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

## Additional Usage Notes

See the [dids developer site](https://did.js.org/) for more details about how to use this package.

## Contributing
We are happy to accept small and large contributions.

## License
Apache-2.0 OR MIT
