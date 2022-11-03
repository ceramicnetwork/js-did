# Module: pkh-ethereum

# Ethereum AuthMethod and Verifier
Implements support to authenticate, authorize and verify with Ethereum accounts as a did:pkh with SIWE(X) and CACAO. 
Primarly used with `did-session` and `@didtools/cacao`. 

## Installation

```
npm install --save @didtools/pkh-ethereum
```

## Auth Usage

To Auth in web based env, use any injected web3 provider that implements the standard interface with `EthereumWebAuth`.

```js
// Web Auth Usage
import { EthereumWebAuth, getAccountId } from '@didtools/pkh-ethereum'
// ...

const ethProvider = // import/get your web3 eth provider
const addresses = await ethProvider.request({ method: 'eth_requestAccounts' })
const accountId = await getAccountId(ethProvider, addresses[0])

const authMethod = await EthereumWebAuth.getAuthMethod(ethProvider, accountId)
```

To Auth in a Node based env, use any standard web3 provider interface with `EthereumNodeAuth`

```js
// Node Auth Usage
import { EthereumNodeAuth, getAccountId } from '@didtools/pkh-ethereum'
// ...

const ethProvider = // import/get your web3 eth provider
const addresses = await ethProvider.request({ method: 'eth_requestAccounts' })
const accountId = await getAccountId(ethProvider, addresses[0])
const appName = 'MyNodeApp'

const authMethod = await EthereumNodeAuth.getAuthMethod(ethProvider, accountId, appName)
```

To use with did-session and reference did-session docs for more details.

```js
const client = new ComposeClient({ceramic, definition})
const resources = client.resources

const session = await DIDSession.authorize(authMethod, { resources })
client.setDID(session.did)
```

## Configuration

AuthMethod creators consume a standard Ethereum provider and an AccountId. AccountID follows the 
CAIP10 standard. The helper method `getAccountID` is provided, but you can also create an AccountID
using the CAIP library directly. 

```js
import { AccountId } from 'caip'
import { getAccountId } from '@didtools/pkh-ethereum'

const accountId = await getAccountId(ethProvider, addresses[0])

const ethMainnetChainId = '1'
const chainNameSpace = 'eip155'
const chainId = `${chainNameSpace}:${ethMainnetChainId}`
const accountIdCAIP = new AccountId({ address, chainId })

// accountId = accountIdCAIP
```

The `EthereumNodeAuth` additionally consumes an application name. The 'EthereumWebAuth' method uses your 
application domain name by default.

```js
import { EthereumNodeAuth  } from '@didtools/pkh-ethereum'

const appName = 'MyNodeApp'
const authMethod = EthereumNodeAuth.getAuthMethod(ethProvider, accountId, appName)
```

## Verifier Usage

Verifiers are needed to verify different did:pkh signed payloads using CACAO. Libraries that need them will
consume a verifiers map allowing your to register the verifiers you want to support. 

```js
import { Cacao } from '@didtools/cacao'
import { getEIP191Verifier } from '@didtools/pkh-ethereum'
import { DID } from 'dids'

const verifiers = {
	...getEIP191Verifier()
}

// Directly with cacao
Cacao.verify(cacao, { verifiers, ...opts})

// With DIDS, reference DIDS for more details
const dids = //configured dids instance
await dids.verifyJWS(jws, { capability, verifiers, ...opts})
```

## Namespaces

- [EthereumNodeAuth](pkh_ethereum.EthereumNodeAuth.md)
- [EthereumWebAuth](pkh_ethereum.EthereumWebAuth.md)

## Variables

### CHAIN\_NAMESPACE

• `Const` **CHAIN\_NAMESPACE**: ``"eip155"``

CAIP2 for ethereum, used in CAIP10 (acountId)

___

### LEGACY\_CHAIN\_ID\_REORG\_DATE

• `Const` **LEGACY\_CHAIN\_ID\_REORG\_DATE**: `number`

___

### VERSION

• `Const` **VERSION**: ``"1"``

SIWX Version

## Functions

### encodeRpcMessage

▸ **encodeRpcMessage**(`method`, `params?`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `method` | `string` |
| `params?` | `any` |

#### Returns

`any`

___

### getAccountId

▸ **getAccountId**(`ethProvider`, `address`): `Promise`<`AccountId`\>

Helper function to get an accountId (CAIP10) for an Ethereum account, uses ethProvider to get chainId/network

#### Parameters

| Name | Type |
| :------ | :------ |
| `ethProvider` | `any` |
| `address` | `string` |

#### Returns

`Promise`<`AccountId`\>

___

### getEIP191Verifier

▸ **getEIP191Verifier**(): `Verifiers`

Get a configured CACAO EIP191Verifier map for Ethereum EOA accounts

#### Returns

`Verifiers`

___

### safeSend

▸ **safeSend**(`provider`, `method`, `params?`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `provider` | `any` |
| `method` | `string` |
| `params?` | `any`[] |

#### Returns

`Promise`<`any`\>

___

### verifyEIP191Signature

▸ **verifyEIP191Signature**(`cacao`, `options`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `cacao` | `Cacao` |
| `options` | `VerifyOptions` |

#### Returns

`void`
