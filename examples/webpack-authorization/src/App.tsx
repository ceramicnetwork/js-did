import React from 'react';
import logo from './logo.svg';
import './App.css';
import AuthorizationHandler from './components/AuthorizationHandler'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div style={{ flex:'1', backgroundColor:'#ff4f00', width:'16px'}}></div>
        <div style={ { lineHeight:'0.8', textAlign:'left', paddingLeft:'6px'} }>
          <span style={ {fontSize:'100px!important',fontWeight: 'bold'} }>CACAOs</span>
          <br/>
          <span style={ {color: '#ff4f00'}}>and</span>
          <br/>
          <span>DIDSession</span>
        </div>
      </header>
      <div className="App-UI">
        <AuthorizationHandler/>
      </div>
    </div>
  );
}

export default App;
