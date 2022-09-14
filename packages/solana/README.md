# Solana AuthMethod and Verifier


## Installation

```
npm install --save solana -cacao
```

## Usage

```js
// Auth Usage
import * as SolanaWebAuth from 'solana-cacao'
// ...
// TODO for solana
// const ethProvider = // import/get your web3 eth provider
// const account = await getAccount(ethProvider) // enable, address, chainid on ethProvider
// const authMethod = EthereumWebAuth.getAuthMethod(ethProvider, account)

const client = new ComposeClient({ceramic, definition})
const resources = client.resources

const session = await DIDSession.authorize(authMethod, { resources })
client.setDID(session.did)


// Verifier Usage
const verifiers = {
	...SolanaWebAuth.getSolanaED25519Verifier()
}

Cacao.verify(cacao, { verifiers, ...opts})
```

## License

Apache-2.0 OR MIT
