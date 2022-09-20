# CACAO

A library to represent chain-agnostic Object Capabilities (OCAP), created using [EIP-4361](https://github.com/ethereum/EIPs/blob/5e9b0fe0728e160f56dd1e4cbf7dc0a0b1772f82/EIPS/eip-4361.md) (or similar for other blockchains), as an [IPLD](https://ipld.io/) object.

## Examples

### Convert between CACAO and SIWE (EIP-4361)

```typescript
const siweMessage = new SiweMessage({
  domain: 'service.org',
  address: address,
  statement: 'I accept the ServiceOrg Terms of Service: https://service.org/tos',
  uri: 'did:key:z6MkrBdNdwUPnXDVD1DCxedzVVBpaGi8aSmoXFAeKNgtAer8',
  version: '1',
  nonce: '32891757',
  issuedAt: '2021-09-30T16:25:24.000Z',
  chainId: '1',
  resources: [
    'ipfs://Qme7ss3ARVgxv6rXqVPiikMJ8u2NLgmgszg13pYrDKEoiu',
    'https://example.com/my-web2-claim.json',
    'ceramic://k2t6wyfsu4pg040dpjpbla1ybxof65baldb7fvmeam4m3n71q0w1nslz609u2d',
  ],
})

const cacao = Cacao.fromSiweMessage(siweMessage)
const siweMessage2 = SiweMessage.fromCacao(cacao)
```

### Creating and signing a CACAO with private-key Wallet

```typescript
import { Wallet } from '@ethersproject/wallet'
import { Cacao, CacaoBlock, SiweMessage } from '@didtools/cacao'

const wallet = Wallet.createRandom()
const address = wallet.address

const siweMessage = new SiweMessage({
  domain: 'service.org',
  address: address,
  statement: 'I accept the ServiceOrg Terms of Service: https://service.org/tos',
  uri: 'did:key:z6MkrBdNdwUPnXDVD1DCxedzVVBpaGi8aSmoXFAeKNgtAer8',
  version: '1',
  nonce: '32891757',
  issuedAt: '2021-09-30T16:25:24.000Z',
  chainId: '1',
  resources: [
    'ipfs://Qme7ss3ARVgxv6rXqVPiikMJ8u2NLgmgszg13pYrDKEoiu',
    'https://example.com/my-web2-claim.json',
    'ceramic://k2t6wyfsu4pg040dpjpbla1ybxof65baldb7fvmeam4m3n71q0w1nslz609u2d',
  ],
})
const signature = await wallet.signMessage(siweMessage.toMessage())
siweMessage.signature = signature

const cacao = Cacao.fromSiweMessage(siweMessage)
```

### Usage with `EthereumAuthProvider` `requestCapability` to update a `TileDocument`

```typescript
import { Web3Provider } from "@ethersproject/providers"
import { EthereumAuthProvider } from "@ceramicnetwork/blockchain-utils-linking";
import { Ed25519Provider } from "key-did-provider-ed25519"
import { DID } from "dids"
import * as KeyDidResolver from "key-did-resolver";
import { TileDocument } from "@ceramicnetwork/stream-tile";
import { CeramicClient } from "@ceramicnetwork/http-client";
import type { Cacao } from "@didtools/cacao"

// Create the EthereumAuthProvider
const web3Provider = new Web3Provider(...) // connect to a provider
const address = "0xAB..." // get the signer address
const ethereumAuthProvider = new EthereumAuthProvider(web3Provider.provider, address) // Note: we pass the underlying RPC provider, not the ethers.js wrapped version

// Create a determinstic document for the user
const ceramic = new CeramicClient(CERAMIC_API_URL) // Ceramic HTTP Client
const deterministicDocument = await TileDocument.deterministic(ceramic, {
    deterministic: true,
    family: 'randomFamily',
    controllers: [`did:pkh:eip155:1:${address}`]
})

// Create a session key for the dApp
const seed = ... // 32 bytes of entropy
const didProvider = new Ed25519Provider(seed)
const didKey = new DID({
    provider: didProvider,
    resolver: KeyDidResolver.getResolver()
})
await didKey.authenticate()

// Request capability from user
const cacao = await ethereumAuthProvider.requestCapability(didKey.id, [deterministicDocument.id.toUrl()])

// Attach capability to session key
const didKeyWithCap = didKey.withCapability(cacao);
await didKeyWithCap.authenticate()

// Update user's TileDocument using session key that has the capability
await deterministicDocument.update({ foo: 'bar' }, {}, {
    asDid: didKeyWithCap
})
```

## License

Dual licensed with APACHE and MIT
