# Class: WebcryptoProvider

## Implements

- `DIDProvider`

## Constructors

### new WebcryptoProvider()

> **new WebcryptoProvider**(`keyPair`): [`WebcryptoProvider`](WebcryptoProvider.md)

#### Parameters

• **keyPair**: `CryptoKeyPair`

#### Returns

[`WebcryptoProvider`](WebcryptoProvider.md)

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
