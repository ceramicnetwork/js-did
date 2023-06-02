# Webcrypto Key Did Provider
This is a DID Provider which implements [EIP2844](https://eips.ethereum.org/EIPS/eip-2844) for `did:key:` using webcrypto with non-extractable keys. Currently P-256 is supported.


## Installation

```
npm install --save @didtools/key-webcrypto
```

## Usage

```js
import { WebcryptoProvider } from '@didtools/key-webcrypto'
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

## License

Apache-2.0 OR MIT
