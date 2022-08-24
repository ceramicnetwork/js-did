import detectEthereumProvider from '@metamask/detect-provider'
import { EthereumAuthProvider } from '@ceramicnetwork/blockchain-utils-linking'
import { DIDSession } from 'did-session'
import React, { useState } from 'react'

function AuthorizationHandler() {
  const [session, setSession] = useState<DIDSession>()

  const renderUnauthenticated = () => {
    return (
      <label>
        There's no authorized session, click the 'Authenticate & Authorize' button
      </label>
    )
  }

  const renderAuthenticated = () => {
    return (
      <div>
        <label> Authenticated DID: {session!.did.id} </label>
        <br/>
        <label> session.hasSession: {session!.hasSession ? 'true' : 'false'} </label>
        <br/>
        <label> session.isExpired: {session!.isExpired ? 'true' : 'false'} </label>
        <br/>
        <label> session.authorizations: {session!.authorizations} </label>
        <br/>
        <label> session.expiresInSecs: {session!.expireInSecs} </label>
        <br/>
        <a
          className="App-link"
          onClick={ () => {
            window.alert(`Serialized Session: ${session!.serialize()}`)
          }}
        >
          Serialize Session
        </a>
        <br/>
        <a
          className="App-link"
          onClick={ async () => {
            const serialized = session!.serialize()
            const newFromSerialized = await DIDSession.fromSession(serialized)
            window.alert(`Serialized Session: ${serialized}; New Copy from Serialized Session: ${newFromSerialized}`)
          }}
        >
          Serialize and Create a Copy
        </a>
      </div>
    )
  }

  return (
    <div>
      <a
        className="App-link"
        onClick={ async () => {
          const ethProvider = await detectEthereumProvider();
          const addresses = await (window.ethereum as any).request({ method: 'eth_requestAccounts' })
          const authProvider = new EthereumAuthProvider(ethProvider, addresses[0])

          const oneWeek = 60 * 60 * 24 * 7

          // the resources param is a list of strings identifying resources you want to authorize for,
          // according to the verification protocol you use (e.g. for Ceramic Network Protocol, these are ceramic stream IDs)
          const session = await DIDSession.authorize(
            authProvider,
            {
              resources: ['test-resource'],
              expiresInSecs: oneWeek,
              domain: 'YourAppName'
            })
          setSession(session)
        }}
      >
        Authenticate & Authorize
      </a>
      { session === undefined || !session.isAuthorized() ? renderUnauthenticated() : renderAuthenticated()
      }
    </div>
  )
}

export default AuthorizationHandler
