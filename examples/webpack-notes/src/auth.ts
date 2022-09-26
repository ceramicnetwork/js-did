import { randomBytes } from '@stablelib/random'
import { DID } from 'dids'
import { atom, useAtom } from 'jotai'
import { Ed25519Provider } from 'key-did-provider-ed25519'
import { getResolver } from 'key-did-resolver'
import { useCallback } from 'react'
import { fromString, toString } from 'uint8arrays'
import { DIDSession } from 'did-session'
import { EthereumWebAuth, getAccountId } from '@didtools/pkh-ethereum'
import { SolanaWebAuth, getAccountIdByNetwork} from '@didtools/pkh-solana'

import { compose } from './graphql'

export type AuthStatus = 'pending' | 'loading' | 'failed'
export type AuthState = { status: 'done'; id: string } | { status: AuthStatus }

const authAtom = atom<AuthState>({ status: 'pending' })

const resolver = getResolver()

export function randomSeed(): string {
  return toString(randomBytes(32), 'base16')
}

export function useAuth(): [AuthState, () => Promise<void>,  () => Promise<void>, () => void] {
  const [state, setState] = useAtom(authAtom)

  const authSolana = useCallback(
    async (): Promise<void> => {
      if (state.status === 'loading') {
        return
      }
      setState({ status: 'loading' })
      try {
        const solProvider = window.phantom.solana
        const address = await solProvider.connect()
        const accountId = getAccountIdByNetwork('mainnet', address.publicKey.toString())
        const authMethod = await SolanaWebAuth.getAuthMethod(solProvider, accountId)
        
        const session = await DIDSession.authorize(authMethod, { resources: compose.resources})
        compose.setDID(session.did)

        setState({ status: 'done', id: session.did.parent })
      } catch (err) {
        console.warn('Authentication error', err)
        setState({ status: 'failed' })
      }
    },
    [state.status, setState]
  )

  const authEthereum = useCallback(
    async (): Promise<void> => {
      if (state.status === 'loading') {
        return
      }
      setState({ status: 'loading' })
      try {
        const ethProvider = window.ethereum
        const addresses = await ethProvider.enable()
        const accountId = await getAccountId(ethProvider, addresses[0])
        const authMethod = await EthereumWebAuth.getAuthMethod(ethProvider, accountId)
        
        const session = await DIDSession.authorize(authMethod, { resources: compose.resources})
        compose.setDID(session.did)

        setState({ status: 'done', id: session.did.parent })
      } catch (err) {
        console.warn('Authentication error', err)
        setState({ status: 'failed' })
      }
    },
    [state.status, setState]
  )

  const reset = useCallback(() => {
    compose.setDID(new DID({ resolver }))
    setState({ status: 'pending' })
  }, [setState])

  return [state, authEthereum, authSolana, reset]
}
