---
id: "dids.DID"
title: "Class: DID"
custom_edit_url: null
---

[dids](../modules/dids.md).DID

Interact with DIDs.

## Constructors

### constructor

• **new DID**(`__namedParameters?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | [`DIDOptions`](../modules/dids.md#didoptions) |

## Accessors

### authenticated

• `get` **authenticated**(): `boolean`

Check if user is authenticated.

#### Returns

`boolean`

___

### capability

• `get` **capability**(): `Cacao`

Get attached capability

#### Returns

`Cacao`

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

▸ **authenticate**(`__namedParameters?`): `Promise`<`string`\>

Authenticate the user.

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | [`AuthenticateOptions`](../modules/dids.md#authenticateoptions) |

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

▸ **createJWS**<`T`\>(`payload`, `options?`): `Promise`<[`DagJWS`](../modules/dids.md#dagjws)\>

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

`Promise`<[`DagJWS`](../modules/dids.md#dagjws)\>

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
| `jws` | `string` \| [`DagJWS`](../modules/dids.md#dagjws) | The JWS to verify |
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
| `cap` | `Cacao` | The capability to attach |

#### Returns

[`DID`](dids.DID.md)

A new DID instance with the capability attached
