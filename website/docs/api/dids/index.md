# dids

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

## Index

### Classes

- [DID](classes/DID.md)

## Type Aliases

### AuthParams

> **AuthParams**: `object`

#### Type declaration

##### aud?

> `optional` **aud**: `string`

##### nonce

> **nonce**: `string`

##### paths

> **paths**: `string`[]

***

### AuthenticateOptions

> **AuthenticateOptions**: `object`

#### Type declaration

##### aud?

> `optional` **aud**: `string`

##### paths?

> `optional` **paths**: `string`[]

##### provider?

> `optional` **provider**: [`DIDProvider`](index.md#didprovider)

***

### AuthenticateParams

> **AuthenticateParams**: `object`

#### Type declaration

##### aud?

> `optional` **aud**: `string`

##### nonce

> **nonce**: `string`

##### paths?

> `optional` **paths**: `string`[]

***

### AuthenticateResponse

> **AuthenticateResponse**: [`AuthenticateParams`](index.md#authenticateparams) & `object`

#### Type declaration

##### did

> **did**: `string`

##### exp

> **exp**: `number`

***

### CreateJWEOptions

> **CreateJWEOptions**: `object`

#### Type declaration

##### aad?

> `optional` **aad**: `Uint8Array`

##### protectedHeader?

> `optional` **protectedHeader**: `Record`\<`string`, `any`\>

***

### CreateJWSOptions

> **CreateJWSOptions**: `object`

#### Type declaration

##### did?

> `optional` **did**: `string`

##### linkedBlock?

> `optional` **linkedBlock**: `string`

##### protected?

> `optional` **protected**: `Record`\<`string`, `any`\>

***

### CreateJWSParams

> **CreateJWSParams**: `object`

#### Type declaration

##### did

> **did**: `string`

##### payload

> **payload**: `string` \| `Record`\<`string`, `any`\>

##### protected?

> `optional` **protected**: `Record`\<`string`, `any`\>

##### revocable?

> `optional` **revocable**: `boolean`

***

### DIDMethodName

> **DIDMethodName**: keyof [`DIDProviderMethods`](index.md#didprovidermethods)

***

### DIDOptions

> **DIDOptions**: `object`

#### Type declaration

##### capability?

> `optional` **capability**: `Cacao`

##### parent?

> `optional` **parent**: `string`

##### provider?

> `optional` **provider**: [`DIDProvider`](index.md#didprovider)

##### resolver?

> `optional` **resolver**: `Resolver` \| `ResolverRegistry`

##### resolverOptions?

> `optional` **resolverOptions**: `ResolverOptions`

***

### DIDProvider

> **DIDProvider**: `RPCConnection`\<[`DIDProviderMethods`](index.md#didprovidermethods)\>

***

### DIDProviderClient

> **DIDProviderClient**: `RPCClient`\<[`DIDProviderMethods`](index.md#didprovidermethods)\>

***

### DIDProviderMethods

> **DIDProviderMethods**: `object`

#### Type declaration

##### did\_authenticate

> **did\_authenticate**: `object`

##### did\_authenticate.params

> **params**: [`AuthParams`](index.md#authparams)

##### did\_authenticate.result

> **result**: [`GeneralJWS`](index.md#generaljws)

##### did\_createJWS

> **did\_createJWS**: `object`

##### did\_createJWS.params

> **params**: [`CreateJWSParams`](index.md#createjwsparams)

##### did\_createJWS.result

> **result**: `object`

##### did\_createJWS.result.jws

> **jws**: [`GeneralJWS`](index.md#generaljws)

##### did\_decryptJWE

> **did\_decryptJWE**: `object`

##### did\_decryptJWE.params

> **params**: [`DecryptJWEParams`](index.md#decryptjweparams)

##### did\_decryptJWE.result

> **result**: `object`

##### did\_decryptJWE.result.cleartext

> **cleartext**: `string`

***

### DIDProviderOrClient

> **DIDProviderOrClient**: [`DIDProvider`](index.md#didprovider) \| [`DIDProviderClient`](index.md#didproviderclient)

***

### DIDRequest\<K\>

> **DIDRequest**\<`K`\>: `RPCRequest`\<[`DIDProviderMethods`](index.md#didprovidermethods), `K`\>

#### Type Parameters

• **K** *extends* [`DIDMethodName`](index.md#didmethodname) = [`DIDMethodName`](index.md#didmethodname)

***

### DIDResponse\<K\>

> **DIDResponse**\<`K`\>: `RPCResponse`\<[`DIDProviderMethods`](index.md#didprovidermethods), `K`\>

#### Type Parameters

• **K** *extends* [`DIDMethodName`](index.md#didmethodname) = [`DIDMethodName`](index.md#didmethodname)

***

### DagJWS

> **DagJWS**: `object`

#### Type declaration

##### link?

> `optional` **link**: `CID`

##### payload

> **payload**: `string`

##### signatures

> **signatures**: [`JWSSignature`](index.md#jwssignature)[]

***

### DagJWSResult

> **DagJWSResult**: `object`

#### Type declaration

##### cacaoBlock?

> `optional` **cacaoBlock**: `Uint8Array`

##### jws

> **jws**: [`DagJWS`](index.md#dagjws)

##### linkedBlock

> **linkedBlock**: `Uint8Array`

***

### DecryptJWEOptions

> **DecryptJWEOptions**: `object`

#### Type declaration

##### did?

> `optional` **did**: `string`

***

### DecryptJWEParams

> **DecryptJWEParams**: `object`

#### Type declaration

##### did?

> `optional` **did**: `string`

##### jwe

> **jwe**: `JWE`

***

### DecryptJWEResult

> **DecryptJWEResult**: `object`

#### Type declaration

##### cleartext

> **cleartext**: `string`

***

### GeneralJWS

> **GeneralJWS**: `object`

#### Type declaration

##### payload

> **payload**: `string`

##### signatures

> **signatures**: [`JWSSignature`](index.md#jwssignature)[]

***

### JWSSignature

> **JWSSignature**: `object`

#### Type declaration

##### protected

> **protected**: `string`

##### signature

> **signature**: `string`

***

### VerifyJWSOptions

> **VerifyJWSOptions**: `object`

#### Type declaration

##### atTime?

> `optional` **atTime**: `Date`

JS timestamp when the signature was allegedly made. `undefined` means _now_.

##### capability?

> `optional` **capability**: `Cacao`

Cacao OCAP to verify the JWS with.

##### disableTimecheck?

> `optional` **disableTimecheck**: `boolean`

If true, timestamp checking is disabled.

##### issuer?

> `optional` **issuer**: `string`

DID that issued the signature.

##### revocationPhaseOutSecs?

> `optional` **revocationPhaseOutSecs**: `number`

Number of seconds that a revoked key stays valid for after it was revoked

##### verifiers?

> `optional` **verifiers**: `Verifiers`

verifiers - object of supported verification methods to verify given cacao

***

### VerifyJWSResult

> **VerifyJWSResult**: `object`

#### Type declaration

##### didResolutionResult

> **didResolutionResult**: `DIDResolutionResult`

##### kid

> **kid**: `string`

##### payload?

> `optional` **payload**: `Record`\<`string`, `any`\>

## Variables

### DagJWS

> `const` **DagJWS**: `SparseCodec`

***

### GeneralJWS

> `const` **GeneralJWS**: `ExactCodec`

***

### JWSSignature

> `const` **JWSSignature**: `ExactCodec`
