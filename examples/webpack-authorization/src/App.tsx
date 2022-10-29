import React from 'react';
import './App.css';
import DIDSessionDemoHandler from './components/DIDSessionDemoHandler'
import DIDSessionInfo from './components/DIDSessionInfo'
import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from '@mui/material'

const theme = createTheme({
  palette: {
    primary: {
      main: '#ff4f00',
    },
  },
})

function App() {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <header className="App-header">
          <p>
            CACAOs <span style={ {color: '#ff4f00'} } >and</span> DIDSession
          </p>
        </header>
        <div className="App-content">
          <DIDSessionInfo/>
          <DIDSessionDemoHandler/>
        </div>
      </ThemeProvider>
    </div>
  );
}

export default App;
