import React from 'react'
import { useStore } from '@nanostores/react'
import { $account } from './account'
import { RainbowProvider, WithEthereumCacao } from './ethereum'
// import { WithTezos } from './tezos'

function SignIn() {
  return (
    <>
      <h1>Sign In With ...</h1>
      <ul className={'sign-in-options'}>
        {/*<li>*/}
        {/*<WithEthereum />*/}
        {/*</li>*/}
        <li>
          <WithEthereumCacao />
        </li>
        {/*<li>*/}
        {/*  <WithTezos />*/}
        {/*</li>*/}
        {/*<li>*/}
        {/*  <button className={'solana'}>Solana</button>*/}
        {/*</li>*/}
        {/*<li>*/}
        {/*  <button className={'stacks'}>Stacks</button>*/}
        {/*</li>*/}
      </ul>
    </>
  )
}

function DisplayAccount() {
  const account = useStore($account)
  if (account.kind === 'absent') return <></>

  const handleDisconnect = () => {
    account
      .disconnect()
      .then(() => {
        console.log('disconnected')
      })
      .catch((error) => {
        console.error(error)
      })
  }

  return (
    <div>
      <h2>Current account:</h2>
      <pre>
        <code>{account.accountId.toString()}</code>
      </pre>
      {/*<p>SIWx message:</p>*/}
      {/*<pre>*/}
      {/*  <code>{account.siwe.toString()}</code>*/}
      {/*</pre>*/}
      <p>
        <button onClick={handleDisconnect}>Disconnect</button>
      </p>
    </div>
  )
}

export function App() {
  return (
    <RainbowProvider>
      <div className={'container'}>
        <SignIn />
        <DisplayAccount />
      </div>
    </RainbowProvider>
  )
}
