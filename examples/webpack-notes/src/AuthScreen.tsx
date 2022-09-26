import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import Root from './Root'
import { randomSeed, useAuth } from './auth'

export default function AuthScreen() {
  const [state, authEthereum, authSolana] = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const isLoading = state.status === 'loading'

  return state.status === 'done' ? (
    <Typography>Authenticated with ID {state.id}</Typography>
  ) : (
    <>
      <Typography>
        You need to authenticate to load your existing notes and create new ones.
      </Typography>
      <br/>
      <Button
        color="primary"
        onClick={() => {
          authSolana().then(() => navigate(location.state?.from?.pathname || '/'))
        }}
        variant="contained">
        Authenticate Solana Account
      </Button>
      <br/>
      <br/>
      <Button
        color="primary"
        onClick={() => {
          authEthereum().then(() => navigate(location.state?.from?.pathname || '/'))
        }}
        variant="contained">
        Authenticate Ethereum Account
      </Button>
    </>
  )
}
