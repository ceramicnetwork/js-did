---
id: "dids.DID"
title: "Class: DID"
custom_edit_url: null
---

[dids](../modules/dids.md).DID

Interact with DIDs.

## Constructors

### constructor

• **new DID**(`«destructured»?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`DIDOptions`](../modules/dids.md#didoptions) |

## Accessors

### authenticated

• `get` **authenticated**(): `boolean`

Check if user is authenticated.

#### Returns

`boolean`

___

### capability

• `get` **capability**(): `MapIn`<`RequiredProps`<{ `h`: `ExactCodec`<`TypeCodec`<{ `t`: `KeyOfCodec`<{ `caip122`: ``null`` ; `eip4361`: ``null``  }\>  }\>\> ; `p`: `SparseCodec`<{ `aud`: `TrivialCodec`<`string`\> ; `domain`: `TrivialCodec`<`string`\> ; `exp`: `OptionalCodec`<`TrivialCodec`<`string`\>\> ; `iat`: `TrivialCodec`<`string`\> ; `iss`: `TrivialCodec`<`string`\> ; `nbf`: `OptionalCodec`<`TrivialCodec`<`string`\>\> ; `nonce`: `TrivialCodec`<`string`\> ; `requestId`: `OptionalCodec`<`TrivialCodec`<`string`\>\> ; `resources`: `OptionalCodec`<`Codec`<`string`[], `string`[], `unknown`\> & { `item`: `TrivialCodec`<`string`\>  }\> ; `statement`: `OptionalCodec`<`TrivialCodec`<`string`\>\> ; `version`: `TrivialCodec`<`string`\>  }\> ; `s`: `OptionalCodec`<`ExactCodec`<`TypeCodec`<{ `s`: `TrivialCodec`<`string`\> ; `t`: `KeyOfCodec`<{ `eip1271`: ``null`` ; `eip191`: ``null`` ; `solana:ed25519`: ``null`` ; `stacks:secp256k1`: ``null`` ; `tezos:ed25519`: ``null``  }\>  }\>\>\>  }\>, `$TypeOf`\> & `MapIn`<`OptionalProps`<{ `h`: `ExactCodec`<`TypeCodec`<{ `t`: `KeyOfCodec`<{ `caip122`: ``null`` ; `eip4361`: ``null``  }\>  }\>\> ; `p`: `SparseCodec`<{ `aud`: `TrivialCodec`<`string`\> ; `domain`: `TrivialCodec`<`string`\> ; `exp`: `OptionalCodec`<`TrivialCodec`<`string`\>\> ; `iat`: `TrivialCodec`<`string`\> ; `iss`: `TrivialCodec`<`string`\> ; `nbf`: `OptionalCodec`<`TrivialCodec`<`string`\>\> ; `nonce`: `TrivialCodec`<`string`\> ; `requestId`: `OptionalCodec`<`TrivialCodec`<`string`\>\> ; `resources`: `OptionalCodec`<`Codec`<`string`[], `string`[], `unknown`\> & { `item`: `TrivialCodec`<`string`\>  }\> ; `statement`: `OptionalCodec`<`TrivialCodec`<`string`\>\> ; `version`: `TrivialCodec`<`string`\>  }\> ; `s`: `OptionalCodec`<`ExactCodec`<`TypeCodec`<{ `s`: `TrivialCodec`<`string`\> ; `t`: `KeyOfCodec`<{ `eip1271`: ``null`` ; `eip191`: ``null`` ; `solana:ed25519`: ``null`` ; `stacks:secp256k1`: ``null`` ; `tezos:ed25519`: ``null``  }\>  }\>\>\>  }\>, `$TypeOf`\>

Get attached capability

#### Returns

`MapIn`<`RequiredProps`<{ `h`: `ExactCodec`<`TypeCodec`<{ `t`: `KeyOfCodec`<{ `caip122`: ``null`` ; `eip4361`: ``null``  }\>  }\>\> ; `p`: `SparseCodec`<{ `aud`: `TrivialCodec`<`string`\> ; `domain`: `TrivialCodec`<`string`\> ; `exp`: `OptionalCodec`<`TrivialCodec`<`string`\>\> ; `iat`: `TrivialCodec`<`string`\> ; `iss`: `TrivialCodec`<`string`\> ; `nbf`: `OptionalCodec`<`TrivialCodec`<`string`\>\> ; `nonce`: `TrivialCodec`<`string`\> ; `requestId`: `OptionalCodec`<`TrivialCodec`<`string`\>\> ; `resources`: `OptionalCodec`<`Codec`<`string`[], `string`[], `unknown`\> & { `item`: `TrivialCodec`<`string`\>  }\> ; `statement`: `OptionalCodec`<`TrivialCodec`<`string`\>\> ; `version`: `TrivialCodec`<`string`\>  }\> ; `s`: `OptionalCodec`<`ExactCodec`<`TypeCodec`<{ `s`: `TrivialCodec`<`string`\> ; `t`: `KeyOfCodec`<{ `eip1271`: ``null`` ; `eip191`: ``null`` ; `solana:ed25519`: ``null`` ; `stacks:secp256k1`: ``null`` ; `tezos:ed25519`: ``null``  }\>  }\>\>\>  }\>, `$TypeOf`\> & `MapIn`<`OptionalProps`<{ `h`: `ExactCodec`<`TypeCodec`<{ `t`: `KeyOfCodec`<{ `caip122`: ``null`` ; `eip4361`: ``null``  }\>  }\>\> ; `p`: `SparseCodec`<{ `aud`: `TrivialCodec`<`string`\> ; `domain`: `TrivialCodec`<`string`\> ; `exp`: `OptionalCodec`<`TrivialCodec`<`string`\>\> ; `iat`: `TrivialCodec`<`string`\> ; `iss`: `TrivialCodec`<`string`\> ; `nbf`: `OptionalCodec`<`TrivialCodec`<`string`\>\> ; `nonce`: `TrivialCodec`<`string`\> ; `requestId`: `OptionalCodec`<`TrivialCodec`<`string`\>\> ; `resources`: `OptionalCodec`<`Codec`<`string`[], `string`[], `unknown`\> & { `item`: `TrivialCodec`<`string`\>  }\> ; `statement`: `OptionalCodec`<`TrivialCodec`<`string`\>\> ; `version`: `TrivialCodec`<`string`\>  }\> ; `s`: `OptionalCodec`<`ExactCodec`<`TypeCodec`<{ `s`: `TrivialCodec`<`string`\> ; `t`: `KeyOfCodec`<{ `eip1271`: ``null`` ; `eip191`: ``null`` ; `solana:ed25519`: ``null`` ; `stacks:secp256k1`: ``null`` ; `tezos:ed25519`: ``null``  }\>  }\>\>\>  }\>, `$TypeOf`\>

___

### hasCapability

• `get` **hasCapability**(): `boolean`

Check if the DID has a capability attached

#### Returns

`boolean`

___

### hasParent

• `get` **hasParent**(): `boolean`

Check if DID has parent DID

#### Returns

`boolean`

___

### id

• `get` **id**(): `string`

Get the DID identifier of the user.

#### Returns

`string`

___

### parent

• `get` **parent**(): `string`

Get parent DID, parent DID is the capability issuer

#### Returns

`string`

## Methods

### authenticate

▸ **authenticate**(`«destructured»?`): `Promise`<`string`\>

Authenticate the user.

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`AuthenticateOptions`](../modules/dids.md#authenticateoptions) |

#### Returns

`Promise`<`string`\>

___

### createDagJWE

▸ **createDagJWE**(`cleartext`, `recipients`, `options?`): `Promise`<`JWE`\>

Create an IPFS compatibe DagJWE encrypted to the given recipients.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cleartext` | `Record`<`string`, `any`\> | The cleartext to be encrypted, may include ipld links |
| `recipients` | `string`[] | An array of DIDs |
| `options` | [`CreateJWEOptions`](../modules/dids.md#createjweoptions) | Optional parameters |

#### Returns

`Promise`<`JWE`\>

___

### createDagJWS

▸ **createDagJWS**(`payload`, `options?`): `Promise`<[`DagJWSResult`](../modules/dids.md#dagjwsresult)\>

Create an IPFS compatibe DagJWS encoded signature over the given payload.
Will be signed by the currently authenticated DID.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | `Record`<`string`, `any`\> | The payload to sign, may include ipld links |
| `options` | [`CreateJWSOptions`](../modules/dids.md#createjwsoptions) | Optional parameters |

#### Returns

`Promise`<[`DagJWSResult`](../modules/dids.md#dagjwsresult)\>

___

### createJWE

▸ **createJWE**(`cleartext`, `recipients`, `options?`): `Promise`<`JWE`\>

Create a JWE encrypted to the given recipients.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cleartext` | `Uint8Array` | The cleartext to be encrypted |
| `recipients` | `string`[] | An array of DIDs |
| `options` | [`CreateJWEOptions`](../modules/dids.md#createjweoptions) | Optional parameters |

#### Returns

`Promise`<`JWE`\>

___

### createJWS

▸ **createJWS**<`T`\>(`payload`, `options?`): `Promise`<`MapIn`<`RequiredProps`<{ `link`: `OptionalCodec`<`Type`<`CID`<`unknown`, `number`, `number`, `Version`\>, `string`, `string`\>\> ; `payload`: `TrivialCodec`<`string`\> ; `signatures`: `Codec`<{ `protected`: `string` ; `signature`: `string`  }[], { `protected`: `string` ; `signature`: `string`  }[], `unknown`\> & { `item`: `ExactCodec`<`TypeCodec`<{ `protected`: `TrivialCodec`<`string`\> ; `signature`: `TrivialCodec`<`string`\>  }\>\>  }  }\>, `$TypeOf`\> & `MapIn`<`OptionalProps`<{ `link`: `OptionalCodec`<`Type`<`CID`<`unknown`, `number`, `number`, `Version`\>, `string`, `string`\>\> ; `payload`: `TrivialCodec`<`string`\> ; `signatures`: `Codec`<{ `protected`: `string` ; `signature`: `string`  }[], { `protected`: `string` ; `signature`: `string`  }[], `unknown`\> & { `item`: `ExactCodec`<`TypeCodec`<{ `protected`: `TrivialCodec`<`string`\> ; `signature`: `TrivialCodec`<`string`\>  }\>\>  }  }\>, `$TypeOf`\>\>

Create a JWS encoded signature over the given payload.
Will be signed by the currently authenticated DID.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `string` \| `Record`<`string`, `any`\> |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | `T` | The payload to sign |
| `options` | [`CreateJWSOptions`](../modules/dids.md#createjwsoptions) | Optional parameters |

#### Returns

`Promise`<`MapIn`<`RequiredProps`<{ `link`: `OptionalCodec`<`Type`<`CID`<`unknown`, `number`, `number`, `Version`\>, `string`, `string`\>\> ; `payload`: `TrivialCodec`<`string`\> ; `signatures`: `Codec`<{ `protected`: `string` ; `signature`: `string`  }[], { `protected`: `string` ; `signature`: `string`  }[], `unknown`\> & { `item`: `ExactCodec`<`TypeCodec`<{ `protected`: `TrivialCodec`<`string`\> ; `signature`: `TrivialCodec`<`string`\>  }\>\>  }  }\>, `$TypeOf`\> & `MapIn`<`OptionalProps`<{ `link`: `OptionalCodec`<`Type`<`CID`<`unknown`, `number`, `number`, `Version`\>, `string`, `string`\>\> ; `payload`: `TrivialCodec`<`string`\> ; `signatures`: `Codec`<{ `protected`: `string` ; `signature`: `string`  }[], { `protected`: `string` ; `signature`: `string`  }[], `unknown`\> & { `item`: `ExactCodec`<`TypeCodec`<{ `protected`: `TrivialCodec`<`string`\> ; `signature`: `TrivialCodec`<`string`\>  }\>\>  }  }\>, `$TypeOf`\>\>

___

### decryptDagJWE

▸ **decryptDagJWE**(`jwe`): `Promise`<`Record`<`string`, `any`\>\>

Try to decrypt the given DagJWE with the currently authenticated user.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `jwe` | `JWE` | The JWE to decrypt |

#### Returns

`Promise`<`Record`<`string`, `any`\>\>

An ipld object

___

### decryptJWE

▸ **decryptJWE**(`jwe`, `options?`): `Promise`<`Uint8Array`\>

Try to decrypt the given JWE with the currently authenticated user.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `jwe` | `JWE` | The JWE to decrypt |
| `options` | [`DecryptJWEOptions`](../modules/dids.md#decryptjweoptions) | Optional parameters |

#### Returns

`Promise`<`Uint8Array`\>

___

### resolve

▸ **resolve**(`didUrl`): `Promise`<`DIDResolutionResult`\>

Resolve the DID Document of the given DID.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `didUrl` | `string` | The DID to resolve |

#### Returns

`Promise`<`DIDResolutionResult`\>

___

### setProvider

▸ **setProvider**(`provider`): `void`

Set the DID provider of this instance.
Only callable if provider not already set.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `provider` | [`DIDProvider`](../modules/dids.md#didprovider) | The DIDProvider to use |

#### Returns

`void`

___

### setResolver

▸ **setResolver**(`resolver`, `resolverOptions?`): `void`

Set the DID-resolver user by this instance

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `resolver` | `ResolverRegistry` \| `Resolver` | Either a Resolver instance or an object with specific resolvers |
| `resolverOptions?` | `ResolverOptions` | Options to use for the created resolver. Will be ignored if a Resolver instance is passed |

#### Returns

`void`

___

### verifyJWS

▸ **verifyJWS**(`jws`, `options?`): `Promise`<[`VerifyJWSResult`](../modules/dids.md#verifyjwsresult)\>

Verify a JWS. Uses the 'kid' in the header as the way to resolve
the author public key.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `jws` | `string` \| `MapIn`<`RequiredProps`<{ `link`: `OptionalCodec`<`Type`<`CID`<`unknown`, `number`, `number`, `Version`\>, `string`, `string`\>\> ; `payload`: `TrivialCodec`<`string`\> ; `signatures`: `Codec`<{ `protected`: `string` ; `signature`: `string`  }[], { `protected`: `string` ; `signature`: `string`  }[], `unknown`\> & { `item`: `ExactCodec`<`TypeCodec`<{ `protected`: `TrivialCodec`<`string`\> ; `signature`: `TrivialCodec`<`string`\>  }\>\>  }  }\>, `$TypeOf`\> & `MapIn`<`OptionalProps`<{ `link`: `OptionalCodec`<`Type`<`CID`<`unknown`, `number`, `number`, `Version`\>, `string`, `string`\>\> ; `payload`: `TrivialCodec`<`string`\> ; `signatures`: `Codec`<{ `protected`: `string` ; `signature`: `string`  }[], { `protected`: `string` ; `signature`: `string`  }[], `unknown`\> & { `item`: `ExactCodec`<`TypeCodec`<{ `protected`: `TrivialCodec`<`string`\> ; `signature`: `TrivialCodec`<`string`\>  }\>\>  }  }\>, `$TypeOf`\> | The JWS to verify |
| `options` | [`VerifyJWSOptions`](../modules/dids.md#verifyjwsoptions) | Optional arguments for verification |

#### Returns

`Promise`<[`VerifyJWSResult`](../modules/dids.md#verifyjwsresult)\>

Information about the signed JWS

___

### withCapability

▸ **withCapability**(`cap`): [`DID`](dids.DID.md)

Attach a capability to the DID instance

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cap` | `MapIn`<`RequiredProps`<{ `h`: `ExactCodec`<`TypeCodec`<{ `t`: `KeyOfCodec`<{ `caip122`: ``null`` ; `eip4361`: ``null``  }\>  }\>\> ; `p`: `SparseCodec`<{ `aud`: `TrivialCodec`<`string`\> ; `domain`: `TrivialCodec`<`string`\> ; `exp`: `OptionalCodec`<`TrivialCodec`<`string`\>\> ; `iat`: `TrivialCodec`<`string`\> ; `iss`: `TrivialCodec`<`string`\> ; `nbf`: `OptionalCodec`<`TrivialCodec`<`string`\>\> ; `nonce`: `TrivialCodec`<`string`\> ; `requestId`: `OptionalCodec`<`TrivialCodec`<`string`\>\> ; `resources`: `OptionalCodec`<`Codec`<`string`[], `string`[], `unknown`\> & { `item`: `TrivialCodec`<`string`\>  }\> ; `statement`: `OptionalCodec`<`TrivialCodec`<`string`\>\> ; `version`: `TrivialCodec`<`string`\>  }\> ; `s`: `OptionalCodec`<`ExactCodec`<`TypeCodec`<{ `s`: `TrivialCodec`<`string`\> ; `t`: `KeyOfCodec`<{ `eip1271`: ``null`` ; `eip191`: ``null`` ; `solana:ed25519`: ``null`` ; `stacks:secp256k1`: ``null`` ; `tezos:ed25519`: ``null``  }\>  }\>\>\>  }\>, `$TypeOf`\> & `MapIn`<`OptionalProps`<{ `h`: `ExactCodec`<`TypeCodec`<{ `t`: `KeyOfCodec`<{ `caip122`: ``null`` ; `eip4361`: ``null``  }\>  }\>\> ; `p`: `SparseCodec`<{ `aud`: `TrivialCodec`<`string`\> ; `domain`: `TrivialCodec`<`string`\> ; `exp`: `OptionalCodec`<`TrivialCodec`<`string`\>\> ; `iat`: `TrivialCodec`<`string`\> ; `iss`: `TrivialCodec`<`string`\> ; `nbf`: `OptionalCodec`<`TrivialCodec`<`string`\>\> ; `nonce`: `TrivialCodec`<`string`\> ; `requestId`: `OptionalCodec`<`TrivialCodec`<`string`\>\> ; `resources`: `OptionalCodec`<`Codec`<`string`[], `string`[], `unknown`\> & { `item`: `TrivialCodec`<`string`\>  }\> ; `statement`: `OptionalCodec`<`TrivialCodec`<`string`\>\> ; `version`: `TrivialCodec`<`string`\>  }\> ; `s`: `OptionalCodec`<`ExactCodec`<`TypeCodec`<{ `s`: `TrivialCodec`<`string`\> ; `t`: `KeyOfCodec`<{ `eip1271`: ``null`` ; `eip191`: ``null`` ; `solana:ed25519`: ``null`` ; `stacks:secp256k1`: ``null`` ; `tezos:ed25519`: ``null``  }\>  }\>\>\>  }\>, `$TypeOf`\> | The capability to attach |

#### Returns

[`DID`](dids.DID.md)

A new DID instance with the capability attached
