# ed25519 key did provider
This is a DID Provider which implements [EIP2844](https://eips.ethereum.org/EIPS/eip-2844) for `did:key:` using ed25519. It also supports decryption using x25519.

## Installation

```
npm install --save key-did-provider-ed25519
```

## Usage

```js
import { Ed25519Provider } from 'key-did-provider-ed25519'
import KeyResolver from 'key-did-resolver'
import { DID } from 'dids'

const seed = new Uint8Array(...) //  32 bytes with high entropy
const provider = new Ed25519Provider(seed)
const did = new DID({ provider, resolver: KeyResolver.getResolver() })
await did.authenticate()

// log the DID
console.log(did.id)

// create JWS
const { jws, linkedBlock } = await did.createDagJWS({ hello: 'world' })

// verify JWS
await did.verifyJWS(jws)

// create JWE
const jwe = await did.createDagJWE({ very: 'secret' }, [did.id])

// decrypt JWE
const decrypted = await did.decryptDagJWE(jwe)
```

## License

Apache-2.0 OR MIT
