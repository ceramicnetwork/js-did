import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} width={400} height={400} className="logo" alt="logo" />
        <br/>
        <a
          className="App-link"
          onClick={() => {
            window.alert("Not implemented")
          }}
        >
          Authenticate
        </a>
      </header>
    </div>
  );
}

export default App;
