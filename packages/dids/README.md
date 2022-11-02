# DID

A simple library to interact with DIDs that conform to the DID-provider interface.

## Installation

```sh
npm install dids
```

## Usage

### Authentication with the provider

```js
import { DID } from 'dids'
import { Ed25519Provider } from 'key-did-provider-ed25519'
import * as KeyResolver from 'key-did-resolver'

const seed = // 32 bytes of entropy, Uint8Array
const provider = new Ed25519Provider(seed)
const did = new DID({ provider, resolver: KeyResolver.getResolver() })

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
const jwsCid = await ipfs.dag.put(jws, { storeCodec: 'dag-jose', hashAlg: 'sha2-256' })

// put the payload into the ipfs dag
const block = await ipfs.block.put(linkedBlock, { format: 'dag-cbor' })

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
const jweCid = await ipfs.dag.put(jwe, { storeCodec: 'dag-jose', hashAlg: 'sha2-256' })

// get the jwe from the dag and decrypt it
const dagJWE = await ipfs.dag.get(jweCid)
console.log(await did.decryptDagJWE(dagJWE))
// output:
// > { some: 'data' }
```

### Resolving DIDs

```js
import { DID } from 'dids'
import KeyResolver from 'key-did-resolver'

// See https://github.com/decentralized-identity/did-resolver
const did = new DID({ resolver: KeyResolver.getResolver() })

// Resolve a DID document
await did.resolve('did:key:...')
```

### Creating a DID with attached CACAO

Using CACAO OCAPs to create a Key DID that can sign on behalf of a PKH DID.

```js
import { DID } from 'dids'
import { Ed25519Provider } from 'key-did-provider-ed25519'
import KeyResolver from 'key-did-resolver'
import { Cacao, SiweMessage } from '@didtools/cacao'

const seed = // 32 bytes of entropy, Uint8Array
const provider = new Ed25519Provider(seed)

const siwe = new SiweMessage("...");
const cacao = Cacao.fromSiweMessage(siwe);

// Add capability to existing DID instance
const did = new DID({ provider, resolver: KeyResolver.getResolver() })
const didWithCap = did.withCapability(cacao)

// Add capability to new DID instance
const didWithCap2 = new DID({provider, resolver: KeyResolver.getResolver(), capability: cacao})
```

## Security Considerations

### Usage in anchored event streams or log based data structures

There is an option to allow keys attached to DIDs to continue making updates to streams after revocation for a certain grace period. This is done to avoid incorrectly rejecting valid signatures as being performed with a revoked key when in fact the key was valid at the time of the signature. This can happen due to the implementation details of how a protocol determines when a DID issues a signature as well as how a protocol determines when an authentication key for a DID is revoked. Since we cannot trust the system clock time on the client's machine when performing a signature or key revocation, periodic "anchor" updates are made on a blockchain to get a timestamp before which we know the write must have happened. Consider the following scenario:

1. Commit for an update is made to Node A
2. Node B's key revocation commit is anchored before node A's update
3. Node A later tries to anchor the commit made earlier

In this case, an external outlook might lead you to believe Node A's commit is invalid because the key had been revoked when it was made, but that's not actually true as in this case the commit was in fact made earlier in real world time, it just wasn't assigned a timestamp by the anchoring system until after. For this reason, a grace period is provided for updates created by revoked keys to still be verified successfully.

Specifically, the `verifyJWS` function in `dids` uses `options.revocationPhaseOutSecs` as the seconds representing the grace period within which signatures authored by a given key that otherwise appears to be revoked will still be considered valid.

While this approach helps solve the problem of incorrectly rejecting valid updates, it also implies that an attacker could potentially author signatures from a stolen key and commit updates to streams using that stolen key. Even if the original owner revoked the compromised key, the attacker has a grace period within which they can continue to make new commits. The best practice to mitigate this is to rotate keys associated to DIDs on a regular basis to make it less likely to have a compromised key associated with the DID.

The `revocationPhaseOutSecs` value, therefore, should be set with this consideration in mind to a reasonable value. It either allows for a better UX for the owner and allows for a small window of attack for an attacker, or it does not allow for an attack window but can potentially mark certain commits as invalid due to latency in commits occuring.

## Additional Usage Notes

See the [dids developer site](https://did.js.org/) for more details about how to use this package.

## Contributing
We are happy to accept small and large contributions.

## License
Apache-2.0 OR MIT
