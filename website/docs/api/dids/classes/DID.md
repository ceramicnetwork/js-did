# Class: DID

Interact with DIDs.

## Constructors

### new DID()

> **new DID**(`__namedParameters`): [`DID`](DID.md)

#### Parameters

• **\_\_namedParameters**: [`DIDOptions`](../index.md#didoptions) = `{}`

#### Returns

[`DID`](DID.md)

## Accessors

### authenticated

> `get` **authenticated**(): `boolean`

Check if user is authenticated.

#### Returns

`boolean`

***

### capability

> `get` **capability**(): `Cacao`

Get attached capability

#### Returns

`Cacao`

***

### hasCapability

> `get` **hasCapability**(): `boolean`

Check if the DID has a capability attached

#### Returns

`boolean`

***

### hasParent

> `get` **hasParent**(): `boolean`

Check if DID has parent DID

#### Returns

`boolean`

***

### id

> `get` **id**(): `string`

Get the DID identifier of the user.

#### Returns

`string`

***

### parent

> `get` **parent**(): `string`

Get parent DID, parent DID is the capability issuer

#### Returns

`string`

## Methods

### authenticate()

> **authenticate**(`__namedParameters`): `Promise`\<`string`\>

Authenticate the user.

#### Parameters

• **\_\_namedParameters**: [`AuthenticateOptions`](../index.md#authenticateoptions) = `{}`

#### Returns

`Promise`\<`string`\>

***

### createDagJWE()

> **createDagJWE**(`cleartext`, `recipients`, `options`): `Promise`\<`JWE`\>

Create an IPFS compatibe DagJWE encrypted to the given recipients.

#### Parameters

• **cleartext**: `Record`\<`string`, `any`\>

The cleartext to be encrypted, may include ipld links

• **recipients**: `string`[]

An array of DIDs

• **options**: [`CreateJWEOptions`](../index.md#createjweoptions) = `{}`

Optional parameters

#### Returns

`Promise`\<`JWE`\>

***

### createDagJWS()

> **createDagJWS**(`payload`, `options`): `Promise`\<[`DagJWSResult`](../index.md#dagjwsresult)\>

Create an IPFS compatibe DagJWS encoded signature over the given payload.
Will be signed by the currently authenticated DID.

#### Parameters

• **payload**: `Record`\<`string`, `any`\>

The payload to sign, may include ipld links

• **options**: [`CreateJWSOptions`](../index.md#createjwsoptions) = `{}`

Optional parameters

#### Returns

`Promise`\<[`DagJWSResult`](../index.md#dagjwsresult)\>

***

### createJWE()

> **createJWE**(`cleartext`, `recipients`, `options`): `Promise`\<`JWE`\>

Create a JWE encrypted to the given recipients.

#### Parameters

• **cleartext**: `Uint8Array`

The cleartext to be encrypted

• **recipients**: `string`[]

An array of DIDs

• **options**: [`CreateJWEOptions`](../index.md#createjweoptions) = `{}`

Optional parameters

#### Returns

`Promise`\<`JWE`\>

***

### createJWS()

> **createJWS**\<`T`\>(`payload`, `options`): `Promise`\<[`DagJWS`](../index.md#dagjws)\>

Create a JWS encoded signature over the given payload.
Will be signed by the currently authenticated DID.

#### Type Parameters

• **T** *extends* `string` \| `Record`\<`string`, `any`\>

#### Parameters

• **payload**: `T`

The payload to sign

• **options**: [`CreateJWSOptions`](../index.md#createjwsoptions) = `{}`

Optional parameters

#### Returns

`Promise`\<[`DagJWS`](../index.md#dagjws)\>

***

### decryptDagJWE()

> **decryptDagJWE**(`jwe`): `Promise`\<`Record`\<`string`, `any`\>\>

Try to decrypt the given DagJWE with the currently authenticated user.

#### Parameters

• **jwe**: `JWE`

The JWE to decrypt

#### Returns

`Promise`\<`Record`\<`string`, `any`\>\>

An ipld object

***

### decryptJWE()

> **decryptJWE**(`jwe`, `options`): `Promise`\<`Uint8Array`\>

Try to decrypt the given JWE with the currently authenticated user.

#### Parameters

• **jwe**: `JWE`

The JWE to decrypt

• **options**: [`DecryptJWEOptions`](../index.md#decryptjweoptions) = `{}`

Optional parameters

#### Returns

`Promise`\<`Uint8Array`\>

***

### resolve()

> **resolve**(`didUrl`): `Promise`\<`DIDResolutionResult`\>

Resolve the DID Document of the given DID.

#### Parameters

• **didUrl**: `string`

The DID to resolve

#### Returns

`Promise`\<`DIDResolutionResult`\>

***

### setProvider()

> **setProvider**(`provider`): `void`

Set the DID provider of this instance.
Only callable if provider not already set.

#### Parameters

• **provider**: [`DIDProvider`](../index.md#didprovider)

The DIDProvider to use

#### Returns

`void`

***

### setResolver()

> **setResolver**(`resolver`, `resolverOptions`?): `void`

Set the DID-resolver user by this instance

#### Parameters

• **resolver**: `ResolverRegistry` \| `Resolver`

Either a Resolver instance or an object with specific resolvers

• **resolverOptions?**: `ResolverOptions`

Options to use for the created resolver. Will be ignored if a Resolver instance is passed

#### Returns

`void`

***

### verifyJWS()

> **verifyJWS**(`jws`, `options`): `Promise`\<[`VerifyJWSResult`](../index.md#verifyjwsresult)\>

Verify a JWS. Uses the 'kid' in the header as the way to resolve
the author public key.

#### Parameters

• **jws**: `string` \| [`DagJWS`](../index.md#dagjws)

The JWS to verify

• **options**: [`VerifyJWSOptions`](../index.md#verifyjwsoptions) = `{}`

Optional arguments for verification

#### Returns

`Promise`\<[`VerifyJWSResult`](../index.md#verifyjwsresult)\>

Information about the signed JWS

***

### withCapability()

> **withCapability**(`cap`): [`DID`](DID.md)

Attach a capability to the DID instance

#### Parameters

• **cap**: `Cacao`

The capability to attach

#### Returns

[`DID`](DID.md)

A new DID instance with the capability attached
