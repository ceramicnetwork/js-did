# DID

A simple library to interact with DIDs that conform to the DID-provider interface.

## Installation

```sh
npm install dids
```

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

### Resolving DIDs

```js
import { DID } from 'dids'

// See https://github.com/decentralized-identity/did-resolver
const registry = { test: myTestResolver }
const did = new DID({ resolver: { registry } })

// Resolve a DID document
await did.resolve('did:test:...')
```

## Interfaces and types

### DIDDocument

The DID document interface, as defined in the [DID resolver library](https://github.com/decentralized-identity/did-resolver).

### DIDProvider

The DID provider interface, an alias for [`RPCConnection`](https://github.com/ceramicnetwork/js-rpc-utils#rpcconnection).

### AuthenticateOptions

```ts
interface AuthenticateOptions {
  provider?: DIDProvider
}
```

### CreateJWSOptions

```ts
interface CreateJWSOptions {
  did?: string
  protected?: Record<string, any>
}
```

### DagJWSResult

```ts
interface DagJWSResult {
  jws: string // base64-encoded
  linkedBlock: string // base64-encoded
}
```


### ResolverRegistry

A record of DID methods to resolvers, as defined in the [DID resolver library](https://github.com/decentralized-identity/did-resolver).

```ts
export type ResolverRegistry = Record<string, DIDResolver>
```

### ResolverOptions

Options used to create a `Resolver` instance, as defined in the [DID resolver library](https://github.com/decentralized-identity/did-resolver).

```ts
export interface ResolverOptions {
  registry?: ResolverRegistry
  cache?: DIDCache | boolean
}
```

### DIDOptions

```ts
export interface DIDOptions {
  provider?: DIDProvider
  resolver?: Resolver | ResolverOptions
}
```

## API

### DID class

#### constructor

**Arguments**

1. `options?: DIDOptions`

#### did.authenticated

**Returns** `boolean`

#### did.id

> Accessing this property will throw an error if the instance is not authenticated

**Returns** `string`

#### did.setProvider()

> Calling this method will throw an error if a different provider is already set

**Arguments**

1. `provider: DIDProvider`

**Returns** `void`

#### did.setResolver()

**Arguments**

1. `resolver: Resolver | ResolverOptions`

**Returns** `void`

#### did.authenticate()

> Calling this method with a provider will throw an error if a different provider is already set

**Arguments**

1. `options?: AuthenticateOptions`

**Returns** `Promise<string>`

#### did.createJWS()

> The instance needs to be authenticated before calling this method

**Arguments**

1. `payload: Record<string, any>`
1. `options?: CreateJWSOptions` to specify the `protected` header

**Returns** `Promise<string>`

#### did.createDagJWS()
Creates a JWS that is compatible with [dag-jose](https://github.com/ceramicnetwork/js-dag-jose).

> The instance needs to be authenticated before calling this method

**Arguments**

1. `payload: Record<string, any>`
1. `options?: CreateJWSOptions` to specify the `protected` header, and did with keyFragment

**Returns** `Promise<DagJWSResult>`

#### did.resolve()

**Arguments**

1. `didUrl: string`

**Returns** `Promise<DIDDocument>`

## License

MIT
