# Class: Ed25519Provider

## Implements

- `DIDProvider`

## Constructors

### new Ed25519Provider()

> **new Ed25519Provider**(`seed`): [`Ed25519Provider`](Ed25519Provider.md)

#### Parameters

• **seed**: `Uint8Array`

#### Returns

[`Ed25519Provider`](Ed25519Provider.md)

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
