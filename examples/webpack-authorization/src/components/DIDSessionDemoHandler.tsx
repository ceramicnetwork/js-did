import detectEthereumProvider from '@metamask/detect-provider'
import { EthereumAuthProvider } from '@ceramicnetwork/blockchain-utils-linking'
import { DIDSession } from 'did-session'
import React, { useState } from 'react'
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { Stack, TextField } from '@mui/material'

const MessageTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#ff4f00',
    },
    '&:hover fieldset': {
      borderColor: '#ff4f00',
    },
  },
});

function DIDSessionDemoHandler() {
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
        <div>
          { session === undefined || !session.isAuthorized() ? renderUnauthenticated() : renderAuthenticated() }
        </div>
      </div>
    )
  }

  const renderUnauthenticated = () => {
    return (
      <Button
        variant="contained"
        size="large"
        onClick={authenticate}
      >
        Authenticate & Authorize
      </Button>
    )
  }

  const renderAuthenticated = () => {
    return (
      <Stack spacing={2}>
        <Stack direction='row' justifyContent="center">
          <Button
            variant="contained"
            size="large"
            onClick={ () => {
              console.log(`${JSON.stringify(session?.cacao, null, 2)}`)
            }}
          >
            Log session's CACAO
          </Button>
        </Stack>
        <Stack direction='row' justifyContent="center">
          <Button
            variant="contained"
            size="large"
            onClick={ () => {
              console.log(`${session!.serialize()}`)
            }}
          >
            Log serialized session
          </Button>
        </Stack>
        <Stack direction='row' spacing={2} justifyContent="center">
          <MessageTextField
            id="message"
            label="Message"
            variant="outlined"
            sx={{ input: { color: '#ff4f00' } }}
          />
          <Stack justifyContent="center">
            <Button
              variant="contained"
              size="large"
              onClick={ async () => {
                const message = (document?.getElementById("message") as HTMLInputElement).value
                const signed = await session!.did.createJWS(message)
                console.log(`${signed.signatures[0].signature}`)
              }}
            >
              Log message's signature
            </Button>
          </Stack>
        </Stack>
        <Stack direction='row' justifyContent="center">
          <Button
            variant="contained"
            color="error"
            size="large"
            onClick={ () => {
              setSession(undefined)
            }}
          >
            Sign out
          </Button>
        </Stack>
      </Stack>
    )
  }

  return render()
}

export default DIDSessionDemoHandler
