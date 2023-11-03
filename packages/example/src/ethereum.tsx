import { connectorsForWallets, RainbowKitProvider, useConnectModal } from '@rainbow-me/rainbowkit'
import { configureChains, createConfig, useAccount, useDisconnect, WagmiConfig } from 'wagmi'
import { AccountId } from 'caip'
import { $account } from './account'
import React, { PropsWithChildren, useCallback } from 'react'
import { mainnet, polygon } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'
import {
  injectedWallet,
  metaMaskWallet,
  rainbowWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets'
import { QueryClient } from '@tanstack/react-query'
import { EthereumWebAuth } from '@didtools/pkh-ethereum'
import { DIDSession } from 'did-session'

export function WithEthereumCacao() {
  const connectModal = useConnectModal()
  const disconnect = useDisconnect()

  useAccount({
    async onConnect({ address, connector }) {
      if (!address || !connector) return
      await connector.getChainId().then(async (chainId) => {
        const accountId = new AccountId({ address: address, chainId: `eip155:${chainId}` })
        const provider = await connector.getProvider()
        const authMethod = await EthereumWebAuth.getAuthMethod(provider, accountId)
        const session = await DIDSession.get(accountId, authMethod, { resources: ['ceramic://nil'] })
        const did = session.did
        const signature = await did.createJWS({ hello: 'world' })
        console.log('did-signature-jws', signature)
        $account.set({
          kind: 'ready',
          siwe: '',
          accountId: accountId,
          disconnect: async () => {
            await disconnect.disconnectAsync()
            $account.set({ kind: 'absent' })
          },
        })
      })
    },
  })

  const handleClick = useCallback(() => {
    if (connectModal.connectModalOpen) return
    if (connectModal.openConnectModal) connectModal.openConnectModal()
  }, [connectModal])

  return (
    <button onClick={handleClick} type="button">
      Ethereum + CACAO (see console log)
    </button>
  )
}

const { publicClient, webSocketPublicClient, chains } = configureChains(
  [mainnet, polygon],
  [publicProvider()]
)

const projectId = '81d9f4a7bc6d0c61f049e8a34b088f95'

const connectors = connectorsForWallets([
  {
    groupName: 'Recommended',
    wallets: [
      injectedWallet({ chains }),
      metaMaskWallet({ chains, projectId }),
      rainbowWallet({ projectId, chains }),
      walletConnectWallet({ projectId, chains }),
    ],
  },
])

const config = createConfig({
  publicClient,
  queryClient: new QueryClient(),
  webSocketPublicClient,
  connectors,
})

export function RainbowProvider(props: PropsWithChildren) {
  return (
    <WagmiConfig config={config}>
      <RainbowKitProvider chains={chains}>{props.children}</RainbowKitProvider>
    </WagmiConfig>
  )
}
