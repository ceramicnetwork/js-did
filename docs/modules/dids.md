# Module: dids

A simple library to interact with DIDs that conform to the DID-provider interface.

## Installation

```sh
npm install dids
```

## Classes

- [DID](../classes/dids.DID.md)

## Type Aliases

### AuthParams

Ƭ **AuthParams**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `aud?` | `string` |
| `nonce` | `string` |
| `paths` | `string`[] |

___

### AuthenticateOptions

Ƭ **AuthenticateOptions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `aud?` | `string` |
| `paths?` | `string`[] |
| `provider?` | [`DIDProvider`](dids.md#didprovider) |

___

### AuthenticateParams

Ƭ **AuthenticateParams**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `aud?` | `string` |
| `nonce` | `string` |
| `paths?` | `string`[] |

___

### AuthenticateResponse

Ƭ **AuthenticateResponse**: [`AuthenticateParams`](dids.md#authenticateparams) & { `did`: `string` ; `exp`: `number`  }

___

### CreateJWEOptions

Ƭ **CreateJWEOptions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `aad?` | `Uint8Array` |
| `protectedHeader?` | `Record`<`string`, `any`\> |

___

### CreateJWSOptions

Ƭ **CreateJWSOptions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `did?` | `string` |
| `linkedBlock?` | `string` |
| `protected?` | `Record`<`string`, `any`\> |

___

### CreateJWSParams

Ƭ **CreateJWSParams**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `did` | `string` |
| `payload` | `string` \| `Record`<`string`, `any`\> |
| `protected?` | `Record`<`string`, `any`\> |
| `revocable?` | `boolean` |

___

### DIDMethodName

Ƭ **DIDMethodName**: keyof [`DIDProviderMethods`](dids.md#didprovidermethods)

___

### DIDOptions

Ƭ **DIDOptions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `capability?` | `Cacao` |
| `parent?` | `string` |
| `provider?` | [`DIDProvider`](dids.md#didprovider) |
| `resolver?` | `Resolver` \| `ResolverRegistry` |
| `resolverOptions?` | `ResolverOptions` |

___

### DIDProvider

Ƭ **DIDProvider**: `RPCConnection`<[`DIDProviderMethods`](dids.md#didprovidermethods)\>

___

### DIDProviderClient

Ƭ **DIDProviderClient**: `RPCClient`<[`DIDProviderMethods`](dids.md#didprovidermethods)\>

___

### DIDProviderMethods

Ƭ **DIDProviderMethods**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `did_authenticate` | { `params`: [`AuthParams`](dids.md#authparams) ; `result`: [`GeneralJWS`](dids.md#generaljws)  } |
| `did_authenticate.params` | [`AuthParams`](dids.md#authparams) |
| `did_authenticate.result` | [`GeneralJWS`](dids.md#generaljws) |
| `did_createJWS` | { `params`: [`CreateJWSParams`](dids.md#createjwsparams) ; `result`: { `jws`: [`GeneralJWS`](dids.md#generaljws)  }  } |
| `did_createJWS.params` | [`CreateJWSParams`](dids.md#createjwsparams) |
| `did_createJWS.result` | { `jws`: [`GeneralJWS`](dids.md#generaljws)  } |
| `did_createJWS.result.jws` | [`GeneralJWS`](dids.md#generaljws) |
| `did_decryptJWE` | { `params`: [`DecryptJWEParams`](dids.md#decryptjweparams) ; `result`: { `cleartext`: `string`  }  } |
| `did_decryptJWE.params` | [`DecryptJWEParams`](dids.md#decryptjweparams) |
| `did_decryptJWE.result` | { `cleartext`: `string`  } |
| `did_decryptJWE.result.cleartext` | `string` |

___

### DIDProviderOrClient

Ƭ **DIDProviderOrClient**: [`DIDProvider`](dids.md#didprovider) \| [`DIDProviderClient`](dids.md#didproviderclient)

___

### DIDRequest

Ƭ **DIDRequest**<`K`\>: `RPCRequest`<[`DIDProviderMethods`](dids.md#didprovidermethods), `K`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends [`DIDMethodName`](dids.md#didmethodname) = [`DIDMethodName`](dids.md#didmethodname) |

___

### DIDResponse

Ƭ **DIDResponse**<`K`\>: `RPCResponse`<[`DIDProviderMethods`](dids.md#didprovidermethods), `K`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends [`DIDMethodName`](dids.md#didmethodname) = [`DIDMethodName`](dids.md#didmethodname) |

___

### DagJWS

Ƭ **DagJWS**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `link?` | `CID` |
| `payload` | `string` |
| `signatures` | [`JWSSignature`](dids.md#jwssignature)[] |

___

### DagJWSResult

Ƭ **DagJWSResult**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `cacaoBlock?` | `Uint8Array` |
| `jws` | [`DagJWS`](dids.md#dagjws) |
| `linkedBlock` | `Uint8Array` |

___

### DecryptJWEOptions

Ƭ **DecryptJWEOptions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `did?` | `string` |

___

### DecryptJWEParams

Ƭ **DecryptJWEParams**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `did?` | `string` |
| `jwe` | `JWE` |

___

### DecryptJWEResult

Ƭ **DecryptJWEResult**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `cleartext` | `string` |

___

### GeneralJWS

Ƭ **GeneralJWS**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `payload` | `string` |
| `signatures` | [`JWSSignature`](dids.md#jwssignature)[] |

___

### JWSSignature

Ƭ **JWSSignature**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `protected` | `string` |
| `signature` | `string` |

___

### VerifyJWSOptions

Ƭ **VerifyJWSOptions**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `atTime?` | `Date` | JS timestamp when the signature was allegedly made. `undefined` means _now_. |
| `capability?` | `Cacao` | Cacao OCAP to verify the JWS with. |
| `disableTimecheck?` | `boolean` | If true, timestamp checking is disabled. |
| `issuer?` | `string` | DID that issued the signature. |
| `revocationPhaseOutSecs?` | `number` | Number of seconds that a revoked key stays valid for after it was revoked |

___

### VerifyJWSResult

Ƭ **VerifyJWSResult**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `didResolutionResult` | `DIDResolutionResult` |
| `kid` | `string` |
| `payload?` | `Record`<`string`, `any`\> |
