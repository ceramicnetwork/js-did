import detectEthereumProvider from '@metamask/detect-provider'
import { EthereumAuthProvider } from '@ceramicnetwork/blockchain-utils-linking'
import { DIDSession } from 'did-session'
import React, { useState } from 'react'

function AuthorizationHandler() {
  const [session, setSession] = useState<DIDSession>()

  return (
    <div>
      <a
        className="App-link"
        onClick={ async () => {
          const ethProvider = await detectEthereumProvider();
          const addresses = await (window.ethereum as any).request({ method: 'eth_requestAccounts' })
          const authProvider = new EthereumAuthProvider(ethProvider, addresses[0])

          // the resources param is a list of strings identifying resources you want to authorize for,
          // according to the verification protocol you use (e.g. for Ceramic Network Protocol, these are ceramic stream IDs)
          const session = await DIDSession.authorize(authProvider, { resources: ['test-resource']})
          setSession(session)
        }}
      >
        Authenticate & Authorize
      </a>
      <div>

      </div>
      { session === undefined || !session.isAuthorized() ?
        `There's no authorized session, click the 'Authenticate & Authorize' button`
        :
        `${session.did.id} authorized for resources: ${session.authorizations}`
      }
    </div>
  )
}

export default AuthorizationHandler
