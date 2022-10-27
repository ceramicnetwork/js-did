import detectEthereumProvider from '@metamask/detect-provider'
import { EthereumAuthProvider } from '@ceramicnetwork/blockchain-utils-linking'
import { DIDSession } from 'did-session'
import React, { useState } from 'react'

function AuthorizationHandler() {
  const [session, setSession] = useState<DIDSession>()

  const authenticate = async () => {
    const ethProvider = await detectEthereumProvider();
    const addresses = await (window.ethereum as any).request({ method: 'eth_requestAccounts' })
    const authProvider = new EthereumAuthProvider(ethProvider, addresses[0])

    const oneWeek = 60 * 60 * 24 * 7

    const session = await DIDSession.authorize(
      authProvider,
      {
        resources: ['test-resource', 'another-test-resource'],
        expiresInSecs: oneWeek,
        domain: 'YourAppName'
      })
    setSession(session)
  }

  const render = () => {
    return (
      <div>
        { session === undefined || !session.isAuthorized() ? renderUnauthenticated() : renderAuthenticated() }
      </div>
    )
  }

  const renderUnauthenticated = () => {
    return (
      <a
        className="App-link"
        onClick={authenticate}
      >
        Authenticate & Authorize
      </a>
    )
  }

  const renderAuthenticated = () => {
    return (
      <div>
        <a
          className="App-link"
          onClick={ () => {
            console.log(`${JSON.stringify(session?.cacao, null, 2)}`)
          }}
        >
          Log session's CACAO
        </a>
        <br/>
        <a
          className="App-link"
          onClick={ () => {
            console.log(`${session!.serialize()}`)
          }}
        >
          Log serialized session
        </a>
        <br/>
        <input type="text" id="message" name="message"/>
        <a
          className="App-link"
          onClick={ async () => {
            const message = (document?.getElementById("message") as HTMLInputElement).value
            const signed = await session!.did.createJWS(message)
            console.log(`${signed.signatures[0].signature}`)
          }}
        >
          Log message's signature
        </a>
        <br/>
        <a
          className="App-link"
          onClick={ () => {
            setSession(undefined)
          }}
        >
          Sign out
        </a>
      </div>
    )
  }

  return render()
}

export default AuthorizationHandler
