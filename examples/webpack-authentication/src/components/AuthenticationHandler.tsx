import { DID } from 'dids'
import React, { useState } from 'react'
import detectEthereumProvider from '@metamask/detect-provider'
import KeyResolver from 'key-did-resolver'
import { Ed25519Provider } from 'key-did-provider-ed25519'
import { EthereumAuthProvider } from '@ceramicnetwork/blockchain-utils-linking'
import { randomBytes, randomString } from '@stablelib/random'
import { fromString } from 'uint8arrays'
import { create } from 'ipfs-http-client'

function AuthorizationHandler() {
  const [did, setDid] = useState<DID>()

  const authenticate = async () => {
    const ethProvider = await detectEthereumProvider();
    const addresses = await (window.ethereum as any).request({ method: 'eth_requestAccounts' })
    const authProvider = new EthereumAuthProvider(ethProvider, addresses[0])

    // Your DApp's/session's/user's seed
    const seed = '139ad0d8d069383b594ce6a81f67fae9469e436c01b8c95e9c4b3af3cd677ceb'
    const provider = new Ed25519Provider(fromString(seed, 'base16'))
    const resolver = KeyResolver.getResolver()
    const did = new DID({ provider, resolver })
    await did.authenticate()

    const expirationTime = new Date(Date.now() + 60 * 60 * 1000)
    const cacao = await authProvider.requestCapability(did.id, [], {
      domain: 'example.com', // optional
      statement: 'the message that you want to display to users', // optional
      version: '1.0', // optional
      nonce: randomString(10), // optional
      requestId: randomString(10), // optional
      resources: ['resource1', 'resource2'], // optional
      expirationTime: expirationTime.toISOString() //optional
    })
    const didWithCacao = did.withCapability(cacao)
    await didWithCacao.authenticate()

    setDid(didWithCacao)
  }

  const publishAnotherMessage = async () => {
    if (did) {
      const ipfs = create({ url: '/ip4/127.0.0.1/tcp/5001' })
      console.log("IPFS", ipfs)
      const message = { message: 'Message 1', parent: null }
      console.log('MESSAGE', message)

      const { jws, linkedBlock } = await did.createDagJWS(message)
      console.log('JWS', jws)
      console.log('LINKED BLOCK', linkedBlock)
      const jwsCid = await ipfs.dag.put(jws, { storeCodec: 'dag-jose', hashAlg: 'sha2-256' })
      console.log('JWSCID', jwsCid)
      const block = await ipfs.block.put(linkedBlock, { cid: jws.link })

      const readValue = await ipfs.dag.get(jwsCid, { path: '/link' })
      console.log('READVALUE', readValue.value)
      const readJWS = await ipfs.dag.get(jwsCid)
      console.log('READJWS', readJWS.value)
    }
  }

  const renderUnauthenticated = () => {
    return (
      <label>
        There's no authenticated DID, click the 'Authenticate' button
      </label>
    )
  }

  const renderAuthenticated = () => {
    return (
      <div>
        <label> Authenticated DID: {did?.id} </label>
        <br/>
        <label> Authenticated DID's parent: {did?.parent} </label>
        <br/>
        <a
          className="App-link"
          onClick={publishAnotherMessage}
        >
          Publish a message on IPFS
        </a>
      </div>
    )
  }

  return (
    <div>
      <a
        className="App-link"
        onClick={authenticate}
      >
        Authenticate
      </a>
      { did === undefined ? renderUnauthenticated() : renderAuthenticated()
      }
    </div>
  )
}

export default AuthorizationHandler
