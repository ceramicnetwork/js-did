# PKH DID Method Resolver
[![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://lbesson.mit-license.org/)
[![](https://img.shields.io/badge/Chat%20on-Discord-orange.svg?style=flat)](https://discord.gg/6VRZpGP)
[![npm](https://img.shields.io/npm/dt/pkh-did-resolver.svg)](https://www.npmjs.com/package/pkh-did-resolver)
[![npm](https://img.shields.io/npm/v/pkh-did-resolver.svg)](https://www.npmjs.com/package/pkh-did-resolver)

This package contains did:pkh method resolver implementation. Please refer to the [specification](https://github.com/w3c-ccg/did-pkh/blob/main/did-pkh-method-draft.md) for details about how this DID method works.

## Usage
This package is used as a plugin to the [`did-resolver`](https://github.com/decentralized-identity/did-resolver) library, which is the primary interface for resolving DIDs.

### Installation
```
$ npm install pkh-did-resolver
```

### Resolving a PKH DID

```js
import { Resolver } from 'did-resolver'
import { getResolver } from 'pkh-did-resolver'

const pkhResolver = getResolver()
const resolver = new Resolver(pkhResolver)

const didResolutionResult = await resolver.resolve('did:pkh:eip155:1:0xab16a96d359ec26a11e2c2b3d8f8b8942d5bfcdb')
```

Result:
```js
{
  "didDocument": {
    "assertionMethod": [
      "did:pkh:eip155:1:0xab16a96d359ec26a11e2c2b3d8f8b8942d5bfcdb#blockchainAccountId",
    ],
    "authentication": [
      "did:pkh:eip155:1:0xab16a96d359ec26a11e2c2b3d8f8b8942d5bfcdb#blockchainAccountId",
    ],
    "id": "did:pkh:eip155:1:0xab16a96d359ec26a11e2c2b3d8f8b8942d5bfcdb",
    "verificationMethod": [{
      "blockchainAccountId": "eip155:1:0xab16a96d359ec26a11e2c2b3d8f8b8942d5bfcdb",
      "controller": "did:pkh:eip155:1:0xab16a96d359ec26a11e2c2b3d8f8b8942d5bfcdb",
      "id": "did:pkh:eip155:1:0xab16a96d359ec26a11e2c2b3d8f8b8942d5bfcdb#blockchainAccountId",
      "type": "EcdsaSecp256k1RecoveryMethod2020",
    }],
  },
  "didDocumentMetadata": {},
  "didResolutionMetadata": {
    "contentType": "application/did+json",
  },
}
```

## Additional Usage Notes
See the [dids developer site](https://did.js.org/) for more details about how to use this package.

## Contributing
We are happy to accept small and large contributions

## License
Apache-2.0 OR MIT
