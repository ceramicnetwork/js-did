# Class: Secp256k1Provider

## Implements

- `DIDProvider`

## Constructors

### new Secp256k1Provider()

> **new Secp256k1Provider**(`seed`): [`Secp256k1Provider`](Secp256k1Provider.md)

#### Parameters

• **seed**: `Uint8Array`

#### Returns

[`Secp256k1Provider`](Secp256k1Provider.md)

## Properties

### \_handle

> **\_handle**: `SendRequestFunc`\<`DIDProviderMethods`\>

## Accessors

### isDidProvider

> `get` **isDidProvider**(): `boolean`

#### Returns

`boolean`

## Methods

### send()

> **send**\<`Name`\>(`msg`): `Promise`\<`null` \| `RPCResponse`\<`DIDProviderMethods`, `Name`\>\>

#### Type Parameters

• **Name** *extends* keyof `DIDProviderMethods`

#### Parameters

• **msg**: `RPCRequest`\<`DIDProviderMethods`, `Name`\>

#### Returns

`Promise`\<`null` \| `RPCResponse`\<`DIDProviderMethods`, `Name`\>\>

#### Implementation of

`DIDProvider.send`
