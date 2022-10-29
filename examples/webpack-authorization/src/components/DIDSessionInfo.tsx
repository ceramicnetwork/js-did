function DIDSessionDemoHandler() {
 return (
   <div>
     <ul className='App-ul'>
       <li className='App-li'><a className='App-link' href='https://github.com/ceramicnetwork/js-did/tree/main/packages/did-session'>https://github.com/ceramicnetwork/js-did/tree/main/packages/did-session</a></li>
       <li className='App-li'>create a did:key</li>
       <li className='App-li'>authenticate your DApp’s user with SIWE (+ support for other auth providers)</li>
       <li className='App-li'>create a CACAO for your did:key, issued by the user’s did:pkh</li>
       <li className='App-li'>store it in a serializable session object</li>
     </ul>
   </div>
 )
}

export default DIDSessionDemoHandler
