# DID

A simple library to interact with DIDs that conform to the DID-provider interface.

## Installation

```sh
npm install dids
```

## API
[API documentation](https://ceramicnetwork.github.io/js-did/classes/did.html)

## Examples

### Authentication with the provider

```js
import { DID } from 'dids'
import IdentityWallet from 'identity-wallet'

// See https://github.com/3box/identity-wallet-js
const wallet = new IdentityWallet(...)
const did = new DID({ provider: wallet.getDidProvider() })

// Authenticate with the provider
await did.authenticate()

// Read the DID string - this will throw an error if the DID instance is not authenticated
const aliceDID = did.id

// Create a JWS - this will throw an error if the DID instance is not authenticated
const jws = await did.createJWS({ hello: 'world' })
```

### Use DagJWS with IPFS

The DagJWS functionality of the DID library can be used in conjunction with IPFS.

```js
const payload = { some: 'data' }

// sign the payload as dag-jose
const { jws, linkedBlock } = await did.createDagJWS(payload)

// put the JWS into the ipfs dag
const jwsCid = await ipfs.dag.put(jws, { format: 'dag-jose', hashAlg: 'sha2-256' })

// put the payload into the ipfs dag
const block = await ipfs.block.put(linkedBlock, { cid: jws.link })

// get the value of the payload using the payload cid
console.log((await ipfs.dag.get(jws.link)).value)
// output:
// > { some: 'data' }

// alternatively get it using the ipld path from the JWS cid
console.log((await ipfs.dag.get(jwsCid, { path: '/link' })).value)
// output:
// > { some: 'data' }

// get the jws from the dag
console.log((await ipfs.dag.get(jwsCid)).value)
// output:
// > {
// >   payload: 'AXESINDmZIeFXbbpBQWH1bXt7F2Ysg03pRcvzsvSc7vMNurc',
// >   signatures: [
// >     {
// >       protected: 'eyJraWQiOiJkaWQ6Mzp1bmRlZmluZWQ_dmVyc2lvbj0wI3NpZ25pbmciLCJhbGciOiJFUzI1NksifQ',
// >       signature: 'pNz3i10YMlv-BiVfqBbHvHQp5NH3x4TAHQ5oqSmNBUx1DH_MONa_VBZSP2o9r9epDdbRRBLQjrIeigdDWoXrBQ'
// >     }
// >   ],
// >   link: CID(bafyreigq4zsipbk5w3uqkbmh2w2633c5tcza2n5fc4x45s6soo54ynxk3q)
// > }
```

As can be observed above the `createDagJWS` method takes the payload, encodes it using `dag-cbor` and computes it's CID. It then uses this CID as the payload of the JWS that is then signed. The JWS that was just created can be put into ipfs using the `dag-jose` codec. Returned is also the encoded block of the payload. This can be put into ipfs using `ipfs.block.put`. Alternatively `ipfs.dag.put(payload)` would have the same effect.

### Use DagJWE with IPFS

The DagJWE functionality allows us to encrypt IPLD data to one or multiple DIDs. The resulting JWE object can then be put into ipfs using the [dag-jose](https://github.com/ceramicnetwork/js-dag-jose) codec. A user that is authenticated can at a later point decrypt this object.

```js
const cleartext = { some: 'data', coolLink: new CID('bafyqacnbmrqxgzdgdeaui') }

// encrypt the cleartext object
const jwe = await did.createDagJWE(cleartext, ['did:3:bafy89h4f9...', 'did:key:za234...'])

// put the JWE into the ipfs dag
const jweCid = await ipfs.dag.put(jwe, { format: 'dag-jose', hashAlg: 'sha2-256' })


// get the jwe from the dag and decrypt it
const dagJWE = await ipfs.dag.get(jweCid)
console.log(await did.decryptDagJWE(dagJWE))
// output:
// > { some: 'data' }
```

### Resolving DIDs

```js
import { DID } from 'dids'
import KeyResolver from '@ceramicnetwork/key-did-resolver'

// See https://github.com/decentralized-identity/did-resolver
const did = new DID({ resolver: KeyResolver.getResolver() })

// Resolve a DID document
await did.resolve('did:test:...')
```

## License

MIT
