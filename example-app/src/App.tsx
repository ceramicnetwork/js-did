import React from 'react';
import logo from './logo.svg';
import './App.css';
import { DIDSession } from 'did-session'
import { EthereumAuthProvider } from '@ceramicnetwork/blockchain-utils-linking'
import detectEthereumProvider from '@metamask/detect-provider'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} width={400} height={400} className="logo" alt="logo" />
        <br/>
        <a
          className="App-link"
          onClick={ async () => {
            const ethProvider = await detectEthereumProvider();
            // @ts-ignore
            const addresses = await ethProvider.enable()
            const authProvider = new EthereumAuthProvider(ethProvider, addresses[0])

            // the resources param is a list of strings identifying resources you want to authorize for,
            // according to the verification protocol you use (e.g. for Ceramic Network Protocol, these are ceramic stream IDs)
            const session = await DIDSession.authorize(authProvider, { resources: ['resource']})
            console.log('Session authorisation result', session)
          }}
        >
          Authenticate
        </a>
      </header>
    </div>
  );
}

export default App;
