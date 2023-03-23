"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[1217],{4852:(e,t,n)=>{n.d(t,{Zo:()=>u,kt:()=>h});var o=n(9231);function s(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function r(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,o)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?r(Object(n),!0).forEach((function(t){s(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function a(e,t){if(null==e)return{};var n,o,s=function(e,t){if(null==e)return{};var n,o,s={},r=Object.keys(e);for(o=0;o<r.length;o++)n=r[o],t.indexOf(n)>=0||(s[n]=e[n]);return s}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(o=0;o<r.length;o++)n=r[o],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(s[n]=e[n])}return s}var c=o.createContext({}),p=function(e){var t=o.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},u=function(e){var t=p(e.components);return o.createElement(c.Provider,{value:t},e.children)},l="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return o.createElement(o.Fragment,{},t)}},m=o.forwardRef((function(e,t){var n=e.components,s=e.mdxType,r=e.originalType,c=e.parentName,u=a(e,["components","mdxType","originalType","parentName"]),l=p(n),m=s,h=l["".concat(c,".").concat(m)]||l[m]||d[m]||r;return n?o.createElement(h,i(i({ref:t},u),{},{components:n})):o.createElement(h,i({ref:t},u))}));function h(e,t){var n=arguments,s=t&&t.mdxType;if("string"==typeof e||s){var r=n.length,i=new Array(r);i[0]=m;var a={};for(var c in t)hasOwnProperty.call(t,c)&&(a[c]=t[c]);a.originalType=e,a[l]="string"==typeof e?e:s,i[1]=a;for(var p=2;p<r;p++)i[p]=n[p];return o.createElement.apply(null,i)}return o.createElement.apply(null,n)}m.displayName="MDXCreateElement"},9710:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>c,contentTitle:()=>i,default:()=>d,frontMatter:()=>r,metadata:()=>a,toc:()=>p});var o=n(5675),s=(n(9231),n(4852));const r={},i="Using With ComposeDB Client",a={unversionedId:"guides/using-with-composedb-client",id:"guides/using-with-composedb-client",title:"Using With ComposeDB Client",description:"ComposeDB is a set of TypeScript libraries and tools to interact with the Dataverse using the Ceramic network.",source:"@site/docs/guides/using-with-composedb-client.md",sourceDirName:"guides",slug:"/guides/using-with-composedb-client",permalink:"/docs/guides/using-with-composedb-client",draft:!1,tags:[],version:"current",frontMatter:{},sidebar:"docs",previous:{title:"Concepts overview",permalink:"/docs/guides/concepts-overview"},next:{title:"Add Support for a Blockchain",permalink:"/docs/guides/add-chain-support"}},c={},p=[],u={toc:p},l="wrapper";function d(e){let{components:t,...n}=e;return(0,s.kt)(l,(0,o.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,s.kt)("h1",{id:"using-with-composedb-client"},"Using With ComposeDB Client"),(0,s.kt)("p",null,(0,s.kt)("a",{parentName:"p",href:"https://composedb.js.org"},"ComposeDB")," is a set of TypeScript libraries and tools to interact with the ",(0,s.kt)("a",{parentName:"p",href:"https://blog.ceramic.network/into-the-dataverse/"},"Dataverse")," using the ",(0,s.kt)("a",{parentName:"p",href:"https://ceramic.network/"},"Ceramic network"),"."),(0,s.kt)("p",null,"First, you should start with creating your instance of ",(0,s.kt)("inlineCode",{parentName:"p"},"ComposeClient")," from ",(0,s.kt)("inlineCode",{parentName:"p"},"@composedb/client")," package, passing it the\nurl to the ceramic node you want to use and the runtime composite definition of the composite you want to use in your App."),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-js"},"import { ComposeClient } from '@composedb/client'\nimport { definition } from './__generated__/definition.js'\n\nconst compose = new ComposeClient({ ceramic: 'http://localhost:7007', definition })\n")),(0,s.kt)("p",null,"Next, you can create a DID Session, passing it the resources from your client instance. The resources are a list of model\nstream IDs from your runtime composite definition:"),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-js"},"import { DIDSession } from 'did-session'\nimport type { AuthMethod } from '@didtools/cacao'\nimport { EthereumWebAuth, getAccountId } from '@didtools/pkh-ethereum'\n\nconst ethProvider = // import/get your web3 eth provider\nconst addresses = await ethProvider).request({ method: 'eth_requestAccounts' })\nconst accountId = await getAccountId(ethProvider, addresses[0])\nconst authMethod = await EthereumWebAuth.getAuthMethod(ethProvider, accountId)\n\nconst loadSession = async(authMethod: AuthMethod, resources: Array<string>):Promise<DIDSession> => {\n  return DIDSession.authorize(authMethod, { resources })\n}\n\nconst session = await loadSession(authMethod, compose.resources)\n")),(0,s.kt)("p",null,"Next, you can assign the authorized did from your session to your client. "),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-js"},"compose.setDID(session.did)\n\n// use the compose instance to make queries in ComposeDB graph\n")),(0,s.kt)("p",null,"Before you start making mutations with the client instance, you should make sure that the session is not expired"),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-js"},"// before compose mutations, check if session is still valid, if expired, create new\nif (session.isExpired) {\n  const session = loadSession(authMethod)\n  compose.setDID(session.did)\n}\n\n// continue to make mutations\n")),(0,s.kt)("p",null,"A typical pattern is to store a serialized session in local storage and load on use if available."),(0,s.kt)("admonition",{title:"Warning",type:"caution"},(0,s.kt)("p",{parentName:"admonition"},"LocalStorage is used for illustrative purposes here and may not be best for your app, as\nthere is a number of known issues with storing secret material in browser storage. The session string\nallows anyone with access to that string to make writes for that user for the time and resources that\nsession is valid for. How that session string is stored and managed is the responsibility of the application.")),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-js"},"// An updated version of loadSession(...)\nconst loadSession = async(authMethod: AuthMethod, resources: Array<string>):Promise<DIDSession> => {\n  const sessionStr = localStorage.getItem('didsession')\n  let session\n\n  if (sessionStr) {\n    session = await DIDSession.fromSession(sessionStr)\n  }\n\n  if (!session || (session.hasSession && session.isExpired)) {\n    session = await DIDSession.authorize(authMethod, { resources })\n    localStorage.setItem('didsession', session.serialize())\n  }\n\n  return session\n}\n")))}d.isMDXComponent=!0}}]);