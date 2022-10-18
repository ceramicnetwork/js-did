---
id: "pkh_did_resolver"
title: "Module: pkh-did-resolver"
custom_edit_url: null
---

# PKH DID method resolver

This package contains did:pkh method resolver implementation. Please refer to the [specification](https://github.com/spruceid/ssi/blob/main/did-pkh/did-pkh-method-draft.md) for details about how this DID method works.

## Usage
This package is used as a plugin to the [`did-resolver`](https://github.com/decentralized-identity/did-resolver) library, which is the primary interface for resolving DIDs.

See the [ceramic developer site](https://developers.ceramic.network/) for more details about how to use this package.

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

## Functions

### getResolver

▸ **getResolver**(): `ResolverRegistry`

#### Returns

`ResolverRegistry`
