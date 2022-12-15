## Tezos AuthMethod and Verifier
Implements support to authenticate, authorize and verify with Tezos accounts as a did:pkh with SIWE(X) and CACAO. 
Primarly used with `did-session` and `@didtools/cacao`. 

## Installation

```
npm install --save @didtools/pkh-tezos
```

## Auth Usage

To Auth in web based env, use any injected web3 provider that implements the standard interface with `TezosWebAuth`.

```ts
// Web Auth Usage
import { TezosWebAuth, getAccountId, verifyTezosSignature} from '@didtools/pkh-tezos'
// ...

let activeAccount = await tzProvider.getActiveAccount()
if (!activeAccount) {
	const permissions = await tzProvider.requestPermissions()
	let activeAccount = permissions
}
const address = await activeAccount.address
const accountId = await getAccountId(tzProvider, address)
const authMethod = await TezosWebAuth.getAuthMethod(tzProvider, accountId)
```

To Auth in a Node based env, use any standard web3 provider interface with `TezosNodeAuth`

```ts
const session = await DIDSession.authorize(authMethod, { resources: ['ceramic://*'] })
```

```js
// Node Auth Usage
import { TezosNodeAuth, getAccountId } from '@didtools/pkh-tezos'
// ...

let activeAccount = await tzProvider.getActiveAccount()
if (!activeAccount) {
	const permissions = await tzProvider.requestPermissions()
	let activeAccount = permissions
}
const address = await activeAccount.address
const accountId = await getAccountId(tzProvider, address)
const authMethod = await TezosNodeAuth.getAuthMethod(tzProvider, accountId)
```

To use with did-session and reference did-session docs for more details.

```js
const session = await DIDSession.authorize(authMethod, { resources: ['ceramic://*'] })
```

## Configuration

AuthMethod creators consume a standard Tezos provider and an AccountId. The helper method `getAccountID` is provided.

```ts
import { getAccountId } from '@didtools/pkh-tezos'

const accountId = await getAccountId(tzProvider, address)
```

The `TezosNodeAuth` additionally consumes an application name. The 'TezosWebAuth' method uses your 
application domain name by default.

```ts
import { TezosNodeAuth } from '@didtools/pkh-tezos'

const authMethod = await TezosNodeAuth.getAuthMethod(tzProvider, accountId)
```

## Verifier Usage

Verifiers are needed to verify different did:pkh signed payloads using CACAO. Libraries that need them will
consume a verifiers map allowing your to register the verifiers you want to support. 

```ts
import { Cacao } from '@didtools/cacao'
import { getTezosVerifier } from '@didtools/pkh-tezos'
import { DID } from 'dids'

const verifiers = {
	...getTezosVerifier()
}

// Directly with cacao
Cacao.verify(cacao, { verifiers, ...opts})

// With DIDS, reference DIDS for more details
const dids = //configured dids instance
await dids.verifyJWS(jws, { capability, verifiers, ...opts})
```

## License

Apache-2.0 OR MIT
