# Ethereum AuthMethod and Verifier


## Installation

```
npm install --save ethereum-cacao
```

## Usage

```js
// Auth Usage
import * as EthereumWebAuth from 'ethereum-cacao'
// ...

const ethProvider = // import/get your web3 eth provider
const account = await getAccount(ethProvider) // enable, address, chainid on ethProvider
const authMethod = EthereumWebAuth.getAuthMethod(ethProvider, account)

const client = new ComposeClient({ceramic, definition})
const resources = client.resources

const session = await DIDSession.authorize(authMethod, { resources })
client.setDID(session.did)


// Verifier Usage
const verifiers = {
	...EthereumWebAuth.getEIP191Verifier()
}

Cacao.verify(cacao, { verifiers, ...opts})
```

## License

Apache-2.0 OR MIT
