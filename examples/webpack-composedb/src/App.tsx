import React from 'react';
import logo from './logo.svg';
import './App.css';
import ComposeDBProfileHandler from './components/ComposeDBProfileHandler'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} width={400} height={400} className="logo" alt="logo" />
        <ComposeDBProfileHandler/>
      </header>
    </div>
  );
}

export default App;
