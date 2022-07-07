# Module: dids/src

## Classes

- [DID](../classes/dids_src.DID.md)

## Interfaces

- [AuthenticateOptions](../interfaces/dids_src.AuthenticateOptions.md)
- [AuthenticateParams](../interfaces/dids_src.AuthenticateParams.md)
- [AuthenticateResponse](../interfaces/dids_src.AuthenticateResponse.md)
- [CreateJWEOptions](../interfaces/dids_src.CreateJWEOptions.md)
- [CreateJWSOptions](../interfaces/dids_src.CreateJWSOptions.md)
- [DIDOptions](../interfaces/dids_src.DIDOptions.md)
- [DagJWSResult](../interfaces/dids_src.DagJWSResult.md)
- [DecryptJWEOptions](../interfaces/dids_src.DecryptJWEOptions.md)
- [DecryptJWEResult](../interfaces/dids_src.DecryptJWEResult.md)
- [VerifyJWSOptions](../interfaces/dids_src.VerifyJWSOptions.md)
- [VerifyJWSResult](../interfaces/dids_src.VerifyJWSResult.md)

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

Ƭ **DIDMethodName**: keyof [`DIDProviderMethods`](dids_src.md#didprovidermethods)

___

### DIDProvider

Ƭ **DIDProvider**: `RPCConnection`<[`DIDProviderMethods`](dids_src.md#didprovidermethods)\>

___

### DIDProviderClient

Ƭ **DIDProviderClient**: `RPCClient`<[`DIDProviderMethods`](dids_src.md#didprovidermethods)\>

___

### DIDProviderMethods

Ƭ **DIDProviderMethods**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `did_authenticate` | { `params`: [`AuthParams`](dids_src.md#authparams) ; `result`: [`GeneralJWS`](dids_src.md#generaljws)  } |
| `did_authenticate.params` | [`AuthParams`](dids_src.md#authparams) |
| `did_authenticate.result` | [`GeneralJWS`](dids_src.md#generaljws) |
| `did_createJWS` | { `params`: [`CreateJWSParams`](dids_src.md#createjwsparams) ; `result`: { `jws`: [`GeneralJWS`](dids_src.md#generaljws)  }  } |
| `did_createJWS.params` | [`CreateJWSParams`](dids_src.md#createjwsparams) |
| `did_createJWS.result` | { `jws`: [`GeneralJWS`](dids_src.md#generaljws)  } |
| `did_createJWS.result.jws` | [`GeneralJWS`](dids_src.md#generaljws) |
| `did_decryptJWE` | { `params`: [`DecryptJWEParams`](dids_src.md#decryptjweparams) ; `result`: { `cleartext`: `string`  }  } |
| `did_decryptJWE.params` | [`DecryptJWEParams`](dids_src.md#decryptjweparams) |
| `did_decryptJWE.result` | { `cleartext`: `string`  } |
| `did_decryptJWE.result.cleartext` | `string` |

___

### DIDProviderOrClient

Ƭ **DIDProviderOrClient**: [`DIDProvider`](dids_src.md#didprovider) \| [`DIDProviderClient`](dids_src.md#didproviderclient)

___

### DIDRequest

Ƭ **DIDRequest**<`K`\>: `RPCRequest`<[`DIDProviderMethods`](dids_src.md#didprovidermethods), `K`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends [`DIDMethodName`](dids_src.md#didmethodname) = [`DIDMethodName`](dids_src.md#didmethodname) |

___

### DIDResponse

Ƭ **DIDResponse**<`K`\>: `RPCResponse`<[`DIDProviderMethods`](dids_src.md#didprovidermethods), `K`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends [`DIDMethodName`](dids_src.md#didmethodname) = [`DIDMethodName`](dids_src.md#didmethodname) |

___

### DagJWS

Ƭ **DagJWS**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `link?` | `CID` |
| `payload` | `string` |
| `signatures` | [`JWSSignature`](dids_src.md#jwssignature)[] |

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
| `signatures` | [`JWSSignature`](dids_src.md#jwssignature)[] |

___

### JWSSignature

Ƭ **JWSSignature**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `protected` | `string` |
| `signature` | `string` |
