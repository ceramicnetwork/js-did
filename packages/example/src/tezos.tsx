import React from 'react'
import { DAppClient } from '@airgap/beacon-sdk'
import { $account } from './account'
import { TezosWebAuth } from '@didtools/pkh-tezos'
import { fromDappClient } from '@siwx/auth/tezos'
import { SIWx } from '@siwx/auth'

const dAppClient = new DAppClient({ name: 'Sign in with Tezos example' })

export function WithTezos() {
  const handleClick = () => {
    console.log('click')
    // const authMethod = TezosWebAuth.getAuthMethod(dAppClient)
    // console.log('f')
    // const signed = await SIWx.request(fromDappClient(dAppClient), {
    //   domain: window.location.host,
    //   uri: window.location.origin,
    // })
    // $account.set({
    //   kind: 'ready',
    //   accountId: signed.message.accountId,
    //   siwx: signed,
    //   disconnect: async () => {
    //     await dAppClient.disconnect()
    //     $account.set({
    //       kind: 'absent',
    //     })
    //   },
    // })
  }

  return <button onClick={handleClick}>Tezos</button>
}
