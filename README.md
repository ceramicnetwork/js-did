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
const alice = new DID({ provider: wallet.getDidProvider() })

// Authenticate with the provider
await alice.authenticate()

// Read the DID string - this will throw an error if the DID instance is not authenticated
const aliceDID = alice.DID

// Create a JWS - this will throw an error if the DID instance is not authenticated
// CIDs and Buffers will be encoded to string
const jws = await alice.createJWS({ hello: 'world', link: new CID(...), data: Buffer.from('12ed', 'hex') })
```

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
  protected?: Record<string, any>
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

#### did.DID

> Accessing this property will throw an error if the instance is not authenticated

**Returns** `string`

#### did.setProvider()

**Arguments**

1. `provider: DIDProvider`

**Returns** `void`

#### did.authenticate()

**Arguments**

1. `options?: AuthenticateOptions`

**Returns** `Promise<string>`

#### did.createJWS()

> The instance needs to be authenticated before calling this method

**Arguments**

1. `payload: Record<string, any>`
1. `options?: CreateJWSOptions` to specify the `protected` header

**Returns** `Promise<string>`

#### did.resolve()

**Arguments**

1. `didUrl: string`

**Returns** `Promise<DIDDocument>`

## License

MIT
