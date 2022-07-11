# Module: dids

A simple library to interact with DIDs that conform to the DID-provider interface.

## Installation

```sh
npm install dids
```

## Classes

- [DID](../classes/dids.DID.md)

## Interfaces

- [AuthenticateOptions](../interfaces/dids.AuthenticateOptions.md)
- [AuthenticateParams](../interfaces/dids.AuthenticateParams.md)
- [AuthenticateResponse](../interfaces/dids.AuthenticateResponse.md)
- [CreateJWEOptions](../interfaces/dids.CreateJWEOptions.md)
- [CreateJWSOptions](../interfaces/dids.CreateJWSOptions.md)
- [DIDOptions](../interfaces/dids.DIDOptions.md)
- [DagJWSResult](../interfaces/dids.DagJWSResult.md)
- [DecryptJWEOptions](../interfaces/dids.DecryptJWEOptions.md)
- [DecryptJWEResult](../interfaces/dids.DecryptJWEResult.md)
- [VerifyJWSOptions](../interfaces/dids.VerifyJWSOptions.md)
- [VerifyJWSResult](../interfaces/dids.VerifyJWSResult.md)

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

### DecryptJWEParams

Ƭ **DecryptJWEParams**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `did?` | `string` |
| `jwe` | `JWE` |

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
