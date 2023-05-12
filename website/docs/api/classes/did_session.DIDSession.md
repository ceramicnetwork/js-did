---
id: "did_session.DIDSession"
title: "Class: DIDSession"
custom_edit_url: null
---

[did-session](../modules/did_session.md).DIDSession

DID Session

```sh
import { DIDSession } from 'did-session'
```

## Constructors

### constructor

• **new DIDSession**(`params`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`SessionParams`](../modules/did_session.md#sessionparams) |

## Accessors

### authorizations

• `get` **authorizations**(): `string`[]

Get the list of resources a session is authorized for

#### Returns

`string`[]

___

### cacao

• `get` **cacao**(): `MapIn`<`RequiredProps`<{ `h`: `ExactCodec`<`TypeCodec`<{ `t`: `KeyOfCodec`<{ `caip122`: ``null`` ; `eip4361`: ``null``  }\>  }\>\> ; `p`: `SparseCodec`<{ `aud`: `TrivialCodec`<`string`\> ; `domain`: `TrivialCodec`<`string`\> ; `exp`: `OptionalCodec`<`TrivialCodec`<`string`\>\> ; `iat`: `TrivialCodec`<`string`\> ; `iss`: `TrivialCodec`<`string`\> ; `nbf`: `OptionalCodec`<`TrivialCodec`<`string`\>\> ; `nonce`: `TrivialCodec`<`string`\> ; `requestId`: `OptionalCodec`<`TrivialCodec`<`string`\>\> ; `resources`: `OptionalCodec`<`Codec`<`string`[], `string`[], `unknown`\> & { `item`: `TrivialCodec`<`string`\>  }\> ; `statement`: `OptionalCodec`<`TrivialCodec`<`string`\>\> ; `version`: `TrivialCodec`<`string`\>  }\> ; `s`: `OptionalCodec`<`ExactCodec`<`TypeCodec`<{ `s`: `TrivialCodec`<`string`\> ; `t`: `KeyOfCodec`<{ `eip1271`: ``null`` ; `eip191`: ``null`` ; `solana:ed25519`: ``null`` ; `stacks:secp256k1`: ``null`` ; `tezos:ed25519`: ``null``  }\>  }\>\>\>  }\>, `$TypeOf`\> & `MapIn`<`OptionalProps`<{ `h`: `ExactCodec`<`TypeCodec`<{ `t`: `KeyOfCodec`<{ `caip122`: ``null`` ; `eip4361`: ``null``  }\>  }\>\> ; `p`: `SparseCodec`<{ `aud`: `TrivialCodec`<`string`\> ; `domain`: `TrivialCodec`<`string`\> ; `exp`: `OptionalCodec`<`TrivialCodec`<`string`\>\> ; `iat`: `TrivialCodec`<`string`\> ; `iss`: `TrivialCodec`<`string`\> ; `nbf`: `OptionalCodec`<`TrivialCodec`<`string`\>\> ; `nonce`: `TrivialCodec`<`string`\> ; `requestId`: `OptionalCodec`<`TrivialCodec`<`string`\>\> ; `resources`: `OptionalCodec`<`Codec`<`string`[], `string`[], `unknown`\> & { `item`: `TrivialCodec`<`string`\>  }\> ; `statement`: `OptionalCodec`<`TrivialCodec`<`string`\>\> ; `version`: `TrivialCodec`<`string`\>  }\> ; `s`: `OptionalCodec`<`ExactCodec`<`TypeCodec`<{ `s`: `TrivialCodec`<`string`\> ; `t`: `KeyOfCodec`<{ `eip1271`: ``null`` ; `eip191`: ``null`` ; `solana:ed25519`: ``null`` ; `stacks:secp256k1`: ``null`` ; `tezos:ed25519`: ``null``  }\>  }\>\>\>  }\>, `$TypeOf`\>

Get the session CACAO

#### Returns

`MapIn`<`RequiredProps`<{ `h`: `ExactCodec`<`TypeCodec`<{ `t`: `KeyOfCodec`<{ `caip122`: ``null`` ; `eip4361`: ``null``  }\>  }\>\> ; `p`: `SparseCodec`<{ `aud`: `TrivialCodec`<`string`\> ; `domain`: `TrivialCodec`<`string`\> ; `exp`: `OptionalCodec`<`TrivialCodec`<`string`\>\> ; `iat`: `TrivialCodec`<`string`\> ; `iss`: `TrivialCodec`<`string`\> ; `nbf`: `OptionalCodec`<`TrivialCodec`<`string`\>\> ; `nonce`: `TrivialCodec`<`string`\> ; `requestId`: `OptionalCodec`<`TrivialCodec`<`string`\>\> ; `resources`: `OptionalCodec`<`Codec`<`string`[], `string`[], `unknown`\> & { `item`: `TrivialCodec`<`string`\>  }\> ; `statement`: `OptionalCodec`<`TrivialCodec`<`string`\>\> ; `version`: `TrivialCodec`<`string`\>  }\> ; `s`: `OptionalCodec`<`ExactCodec`<`TypeCodec`<{ `s`: `TrivialCodec`<`string`\> ; `t`: `KeyOfCodec`<{ `eip1271`: ``null`` ; `eip191`: ``null`` ; `solana:ed25519`: ``null`` ; `stacks:secp256k1`: ``null`` ; `tezos:ed25519`: ``null``  }\>  }\>\>\>  }\>, `$TypeOf`\> & `MapIn`<`OptionalProps`<{ `h`: `ExactCodec`<`TypeCodec`<{ `t`: `KeyOfCodec`<{ `caip122`: ``null`` ; `eip4361`: ``null``  }\>  }\>\> ; `p`: `SparseCodec`<{ `aud`: `TrivialCodec`<`string`\> ; `domain`: `TrivialCodec`<`string`\> ; `exp`: `OptionalCodec`<`TrivialCodec`<`string`\>\> ; `iat`: `TrivialCodec`<`string`\> ; `iss`: `TrivialCodec`<`string`\> ; `nbf`: `OptionalCodec`<`TrivialCodec`<`string`\>\> ; `nonce`: `TrivialCodec`<`string`\> ; `requestId`: `OptionalCodec`<`TrivialCodec`<`string`\>\> ; `resources`: `OptionalCodec`<`Codec`<`string`[], `string`[], `unknown`\> & { `item`: `TrivialCodec`<`string`\>  }\> ; `statement`: `OptionalCodec`<`TrivialCodec`<`string`\>\> ; `version`: `TrivialCodec`<`string`\>  }\> ; `s`: `OptionalCodec`<`ExactCodec`<`TypeCodec`<{ `s`: `TrivialCodec`<`string`\> ; `t`: `KeyOfCodec`<{ `eip1271`: ``null`` ; `eip191`: ``null`` ; `solana:ed25519`: ``null`` ; `stacks:secp256k1`: ``null`` ; `tezos:ed25519`: ``null``  }\>  }\>\>\>  }\>, `$TypeOf`\>

___

### did

• `get` **did**(): `DID`

Get DID instance, if authorized

#### Returns

`DID`

___

### expireInSecs

• `get` **expireInSecs**(): `number`

Number of seconds until a session expires

#### Returns

`number`

___

### hasSession

• `get` **hasSession**(): `boolean`

#### Returns

`boolean`

___

### id

• `get` **id**(): `string`

DID string associated to the session instance. session.id == session.getDID().parent

#### Returns

`string`

___

### isExpired

• `get` **isExpired**(): `boolean`

Determine if a session is expired or not

#### Returns

`boolean`

## Methods

### isAuthorized

▸ **isAuthorized**(`resources?`): `boolean`

Determine if session is available and optionally if authorized for given resources

#### Parameters

| Name | Type |
| :------ | :------ |
| `resources?` | `string`[] |

#### Returns

`boolean`

___

### serialize

▸ **serialize**(): `string`

Serialize session into string, can store and initalize the same session again while valid

#### Returns

`string`

___

### authorize

▸ `Static` **authorize**(`authMethod`, `authOpts?`): `Promise`<[`DIDSession`](did_session.DIDSession.md)\>

Request authorization for session

#### Parameters

| Name | Type |
| :------ | :------ |
| `authMethod` | `AuthMethod` |
| `authOpts` | `AuthOpts` |

#### Returns

`Promise`<[`DIDSession`](did_session.DIDSession.md)\>

___

### fromSession

▸ `Static` **fromSession**(`session`): `Promise`<[`DIDSession`](did_session.DIDSession.md)\>

Initialize a session from a serialized session string

#### Parameters

| Name | Type |
| :------ | :------ |
| `session` | `string` |

#### Returns

`Promise`<[`DIDSession`](did_session.DIDSession.md)\>

___

### initDID

▸ `Static` **initDID**(`didKey`, `cacao`): `Promise`<`DID`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `didKey` | `DID` |
| `cacao` | `MapIn`<`RequiredProps`<{ `h`: `ExactCodec`<`TypeCodec`<{ `t`: `KeyOfCodec`<{ `caip122`: ``null`` ; `eip4361`: ``null``  }\>  }\>\> ; `p`: `SparseCodec`<{ `aud`: `TrivialCodec`<`string`\> ; `domain`: `TrivialCodec`<`string`\> ; `exp`: `OptionalCodec`<`TrivialCodec`<`string`\>\> ; `iat`: `TrivialCodec`<`string`\> ; `iss`: `TrivialCodec`<`string`\> ; `nbf`: `OptionalCodec`<`TrivialCodec`<`string`\>\> ; `nonce`: `TrivialCodec`<`string`\> ; `requestId`: `OptionalCodec`<`TrivialCodec`<`string`\>\> ; `resources`: `OptionalCodec`<`Codec`<`string`[], `string`[], `unknown`\> & { `item`: `TrivialCodec`<`string`\>  }\> ; `statement`: `OptionalCodec`<`TrivialCodec`<`string`\>\> ; `version`: `TrivialCodec`<`string`\>  }\> ; `s`: `OptionalCodec`<`ExactCodec`<`TypeCodec`<{ `s`: `TrivialCodec`<`string`\> ; `t`: `KeyOfCodec`<{ `eip1271`: ``null`` ; `eip191`: ``null`` ; `solana:ed25519`: ``null`` ; `stacks:secp256k1`: ``null`` ; `tezos:ed25519`: ``null``  }\>  }\>\>\>  }\>, `$TypeOf`\> & `MapIn`<`OptionalProps`<{ `h`: `ExactCodec`<`TypeCodec`<{ `t`: `KeyOfCodec`<{ `caip122`: ``null`` ; `eip4361`: ``null``  }\>  }\>\> ; `p`: `SparseCodec`<{ `aud`: `TrivialCodec`<`string`\> ; `domain`: `TrivialCodec`<`string`\> ; `exp`: `OptionalCodec`<`TrivialCodec`<`string`\>\> ; `iat`: `TrivialCodec`<`string`\> ; `iss`: `TrivialCodec`<`string`\> ; `nbf`: `OptionalCodec`<`TrivialCodec`<`string`\>\> ; `nonce`: `TrivialCodec`<`string`\> ; `requestId`: `OptionalCodec`<`TrivialCodec`<`string`\>\> ; `resources`: `OptionalCodec`<`Codec`<`string`[], `string`[], `unknown`\> & { `item`: `TrivialCodec`<`string`\>  }\> ; `statement`: `OptionalCodec`<`TrivialCodec`<`string`\>\> ; `version`: `TrivialCodec`<`string`\>  }\> ; `s`: `OptionalCodec`<`ExactCodec`<`TypeCodec`<{ `s`: `TrivialCodec`<`string`\> ; `t`: `KeyOfCodec`<{ `eip1271`: ``null`` ; `eip191`: ``null`` ; `solana:ed25519`: ``null`` ; `stacks:secp256k1`: ``null`` ; `tezos:ed25519`: ``null``  }\>  }\>\>\>  }\>, `$TypeOf`\> |

#### Returns

`Promise`<`DID`\>
