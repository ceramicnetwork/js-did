import { DIDSession } from 'did-session'
import detectEthereumProvider from '@metamask/detect-provider'
import { EthereumAuthProvider } from '@ceramicnetwork/blockchain-utils-linking'
import { ComposeClient } from '@composedb/client'
import { definition } from '../data/__generated__/definition.js'
import { useState } from 'react'

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

  const loadSession = async(authProvider: EthereumAuthProvider, resources: Array<string>):Promise<DIDSession> => {
    let session
    // get a serialized session from local storage
    const sessionStr = localStorage.getItem('didsession')

    if (sessionStr) {
      session = await DIDSession.fromSession(sessionStr)
    }

    if (!session || (session.hasSession && session.isExpired)) {
      session = await DIDSession.authorize(authProvider, { resources: resources})
      // store the serialized session in local storage
      localStorage.setItem('didsession', session.serialize())
    }
    

    return session
  }

  const authenticate = async () => {
    // @ts-ignore
    const compose = new ComposeClient({ ceramic: 'http://localhost:7007', definition })

    const ethProvider = await detectEthereumProvider();
    const addresses = await (window.ethereum as any).request({ method: 'eth_requestAccounts' })
    const authProvider = new EthereumAuthProvider(ethProvider, addresses[0])

    const session = await loadSession(authProvider, compose.resources)
    setSession(session)
  }

  return (
    <div>
      <a
        className="App-link"
        onClick={authenticate}
      >
        Authenticate & Authorize
      </a>
      { session === undefined || !session.isAuthorized() ? renderUnauthenticated() : renderAuthenticated()
      }
    </div>
  )
}

export default AuthorizationHandler
