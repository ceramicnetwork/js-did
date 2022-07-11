# Class: DIDSession

[did-session](../modules/did_session.md).DIDSession

DID Session

```sh
import { DIDSession } from '@glazed/did-session'
```

## Constructors

### constructor

• **new DIDSession**(`params`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`SessionParams`](../modules/did_session.md#sessionparams) |

## Accessors

### authProvider

• `get` **authProvider**(): `EthereumAuthProvider`

Get authProvider

#### Returns

`EthereumAuthProvider`

___

### authorizations

• `get` **authorizations**(): `string`[]

Get the list of resources a session is authorized for

#### Returns

`string`[]

___

### cacao

• `get` **cacao**(): `Cacao`

Get the session CACAO

#### Returns

`Cacao`

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

### authorize

▸ **authorize**(`capabilityOpts?`): `Promise`<`DID`\>

Request authorization for session

#### Parameters

| Name | Type |
| :------ | :------ |
| `capabilityOpts` | `CapabilityOpts` |

#### Returns

`Promise`<`DID`\>

___

### getDID

▸ **getDID**(): `DID`

Get DID instance, if authorized

#### Returns

`DID`

___

### initDID

▸ **initDID**(`didKey`, `cacao`): `Promise`<`DID`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `didKey` | `DID` |
| `cacao` | `Cacao` |

#### Returns

`Promise`<`DID`\>

___

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

### fromSession

▸ `Static` **fromSession**(`session`, `authProvider`): `Promise`<[`DIDSession`](did_session.DIDSession.md)\>

Initialize a session from a serialized session string

#### Parameters

| Name | Type |
| :------ | :------ |
| `session` | `string` |
| `authProvider` | `EthereumAuthProvider` |

#### Returns

`Promise`<[`DIDSession`](did_session.DIDSession.md)\>
