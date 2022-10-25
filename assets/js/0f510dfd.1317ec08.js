"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[604],{4852:(e,t,n)=>{n.d(t,{Zo:()=>s,kt:()=>c});var a=n(9231);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},i=Object.keys(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var d=a.createContext({}),p=function(e){var t=a.useContext(d),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},s=function(e){var t=p(e.components);return a.createElement(d.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},m=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,i=e.originalType,d=e.parentName,s=l(e,["components","mdxType","originalType","parentName"]),m=p(n),c=r,h=m["".concat(d,".").concat(c)]||m[c]||u[c]||i;return n?a.createElement(h,o(o({ref:t},s),{},{components:n})):a.createElement(h,o({ref:t},s))}));function c(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var i=n.length,o=new Array(i);o[0]=m;var l={};for(var d in t)hasOwnProperty.call(t,d)&&(l[d]=t[d]);l.originalType=e,l.mdxType="string"==typeof e?e:r,o[1]=l;for(var p=2;p<i;p++)o[p]=n[p];return a.createElement.apply(null,o)}return a.createElement.apply(null,n)}m.displayName="MDXCreateElement"},70:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>d,contentTitle:()=>o,default:()=>u,frontMatter:()=>i,metadata:()=>l,toc:()=>p});var a=n(7626),r=(n(9231),n(4852));const i={id:"pkh_ethereum",title:"Module: pkh-ethereum",custom_edit_url:null},o="Ethereum AuthMethod and Verifier",l={unversionedId:"api/modules/pkh_ethereum",id:"api/modules/pkh_ethereum",title:"Module: pkh-ethereum",description:"Implements support to authenticate, authorize and verify with Ethereum accounts as a did:pkh with SIWE(X) and CACAO.",source:"@site/docs/api/modules/pkh_ethereum.md",sourceDirName:"api/modules",slug:"/api/modules/pkh_ethereum",permalink:"/docs/api/modules/pkh_ethereum",draft:!1,editUrl:null,tags:[],version:"current",frontMatter:{id:"pkh_ethereum",title:"Module: pkh-ethereum",custom_edit_url:null},sidebar:"api",previous:{title:"Class: DIDSession",permalink:"/docs/api/classes/did_session.DIDSession"},next:{title:"Module: pkh-solana",permalink:"/docs/api/modules/pkh_solana"}},d={},p=[{value:"Installation",id:"installation",level:2},{value:"Auth Usage",id:"auth-usage",level:2},{value:"Configuration",id:"configuration",level:2},{value:"Verifier Usage",id:"verifier-usage",level:2},{value:"Namespaces",id:"namespaces",level:2},{value:"Variables",id:"variables",level:2},{value:"CHAIN_NAMESPACE",id:"chain_namespace",level:3},{value:"LEGACY_CHAIN_ID_REORG_DATE",id:"legacy_chain_id_reorg_date",level:3},{value:"VERSION",id:"version",level:3},{value:"Functions",id:"functions",level:2},{value:"encodeRpcMessage",id:"encoderpcmessage",level:3},{value:"Parameters",id:"parameters",level:4},{value:"Returns",id:"returns",level:4},{value:"getAccountId",id:"getaccountid",level:3},{value:"Parameters",id:"parameters-1",level:4},{value:"Returns",id:"returns-1",level:4},{value:"getEIP191Verifier",id:"geteip191verifier",level:3},{value:"Returns",id:"returns-2",level:4},{value:"safeSend",id:"safesend",level:3},{value:"Parameters",id:"parameters-2",level:4},{value:"Returns",id:"returns-3",level:4},{value:"verifyEIP191Signature",id:"verifyeip191signature",level:3},{value:"Parameters",id:"parameters-3",level:4},{value:"Returns",id:"returns-4",level:4}],s={toc:p};function u(e){let{components:t,...n}=e;return(0,r.kt)("wrapper",(0,a.Z)({},s,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"ethereum-authmethod-and-verifier"},"Ethereum AuthMethod and Verifier"),(0,r.kt)("p",null,"Implements support to authenticate, authorize and verify with Ethereum accounts as a did:pkh with SIWE(X) and CACAO.\nPrimarly used with ",(0,r.kt)("inlineCode",{parentName:"p"},"did-session")," and ",(0,r.kt)("inlineCode",{parentName:"p"},"@didtools/cacao"),". "),(0,r.kt)("h2",{id:"installation"},"Installation"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre"},"npm install --save @didtools/pkh-ethereum\n")),(0,r.kt)("h2",{id:"auth-usage"},"Auth Usage"),(0,r.kt)("p",null,"To Auth in web based env, use any injected web3 provider that implements the standard interface with ",(0,r.kt)("inlineCode",{parentName:"p"},"EthereumWebAuth"),"."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"// Web Auth Usage\nimport { EthereumWebAuth, getAccountId } from '@didtools/pkh-ethereum'\n// ...\n\nconst ethProvider = // import/get your web3 eth provider\nconst addresses = await ethProvider.enable()\nconst accountId = await getAccountId(ethProvider, addresses[0])\n\nconst authMethod = EthereumWebAuth.getAuthMethod(ethProvider, accountId)\n")),(0,r.kt)("p",null,"To Auth in a Node based env, use any standard web3 provider interface with ",(0,r.kt)("inlineCode",{parentName:"p"},"EthereumNodeAuth")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"// Node Auth Usage\nimport { EthereumNodeAuth, getAccountId } from '@didtools/pkh-ethereum'\n// ...\n\nconst ethProvider = // import/get your web3 eth provider\nconst addresses = await ethProvider.enable()\nconst accountId = await getAccountId(ethProvider, addresses[0])\nconst appName = 'MyNodeApp'\n\nconst authMethod = EthereumNodeAuth.getAuthMethod(ethProvider, accountId, appName)\n")),(0,r.kt)("p",null,"To use with did-session and reference did-session docs for more details."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"const client = new ComposeClient({ceramic, definition})\nconst resources = client.resources\n\nconst session = await DIDSession.authorize(authMethod, { resources })\nclient.setDID(session.did)\n")),(0,r.kt)("h2",{id:"configuration"},"Configuration"),(0,r.kt)("p",null,"AuthMethod creators consume a standard Ethereum provider and an AccountId. AccountID follows the\nCAIP10 standard. The helper method ",(0,r.kt)("inlineCode",{parentName:"p"},"getAccountID")," is provided, but you can also create an AccountID\nusing the CAIP library directly. "),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"import { AccountId } from 'caip'\nimport { getAccountId } from '@didtools/pkh-ethereum'\n\nconst accountId = await getAccountId(ethProvider, addresses[0])\n\nconst ethMainnetChainId = '1'\nconst chainNameSpace = 'eip155'\nconst chainId = `${chainNameSpace}:${ethMainnetChainId}`\nconst accountIdCAIP = new AccountId({ address, chainId })\n\n// accountId = accountIdCAIP\n")),(0,r.kt)("p",null,"The ",(0,r.kt)("inlineCode",{parentName:"p"},"EthereumNodeAuth")," additionally consumes an application name. The 'EthereumWebAuth' method uses your\napplication domain name by default."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"import { EthereumNodeAuth  } from '@didtools/pkh-ethereum'\n\nconst appName = 'MyNodeApp'\nconst authMethod = EthereumNodeAuth.getAuthMethod(ethProvider, accountId, appName)\n")),(0,r.kt)("h2",{id:"verifier-usage"},"Verifier Usage"),(0,r.kt)("p",null,"Verifiers are needed to verify different did:pkh signed payloads using CACAO. Libraries that need them will\nconsume a verifiers map allowing your to register the verifiers you want to support. "),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"import { Cacao } from '@didtools/cacao'\nimport { getEIP191Verifier } from '@didtools/pkh-ethereum'\nimport { DID } from 'dids'\n\nconst verifiers = {\n    ...getEIP191Verifier()\n}\n\n// Directly with cacao\nCacao.verify(cacao, { verifiers, ...opts})\n\n// With DIDS, reference DIDS for more details\nconst dids = //configured dids instance\nawait dids.verifyJWS(jws, { capability, verifiers, ...opts})\n")),(0,r.kt)("h2",{id:"namespaces"},"Namespaces"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"/docs/api/namespaces/pkh_ethereum.EthereumNodeAuth"},"EthereumNodeAuth")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"/docs/api/namespaces/pkh_ethereum.EthereumWebAuth"},"EthereumWebAuth"))),(0,r.kt)("h2",{id:"variables"},"Variables"),(0,r.kt)("h3",{id:"chain_namespace"},"CHAIN","_","NAMESPACE"),(0,r.kt)("p",null,"\u2022 ",(0,r.kt)("inlineCode",{parentName:"p"},"Const")," ",(0,r.kt)("strong",{parentName:"p"},"CHAIN","_","NAMESPACE"),": ",(0,r.kt)("inlineCode",{parentName:"p"},'"eip155"')),(0,r.kt)("p",null,"CAIP2 for ethereum, used in CAIP10 (acountId)"),(0,r.kt)("hr",null),(0,r.kt)("h3",{id:"legacy_chain_id_reorg_date"},"LEGACY","_","CHAIN","_","ID","_","REORG","_","DATE"),(0,r.kt)("p",null,"\u2022 ",(0,r.kt)("inlineCode",{parentName:"p"},"Const")," ",(0,r.kt)("strong",{parentName:"p"},"LEGACY","_","CHAIN","_","ID","_","REORG","_","DATE"),": ",(0,r.kt)("inlineCode",{parentName:"p"},"number")),(0,r.kt)("hr",null),(0,r.kt)("h3",{id:"version"},"VERSION"),(0,r.kt)("p",null,"\u2022 ",(0,r.kt)("inlineCode",{parentName:"p"},"Const")," ",(0,r.kt)("strong",{parentName:"p"},"VERSION"),": ",(0,r.kt)("inlineCode",{parentName:"p"},'"1"')),(0,r.kt)("p",null,"SIWX Version"),(0,r.kt)("h2",{id:"functions"},"Functions"),(0,r.kt)("h3",{id:"encoderpcmessage"},"encodeRpcMessage"),(0,r.kt)("p",null,"\u25b8 ",(0,r.kt)("strong",{parentName:"p"},"encodeRpcMessage"),"(",(0,r.kt)("inlineCode",{parentName:"p"},"method"),", ",(0,r.kt)("inlineCode",{parentName:"p"},"params?"),"): ",(0,r.kt)("inlineCode",{parentName:"p"},"any")),(0,r.kt)("h4",{id:"parameters"},"Parameters"),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:"left"},"Name"),(0,r.kt)("th",{parentName:"tr",align:"left"},"Type"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:"left"},(0,r.kt)("inlineCode",{parentName:"td"},"method")),(0,r.kt)("td",{parentName:"tr",align:"left"},(0,r.kt)("inlineCode",{parentName:"td"},"string"))),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:"left"},(0,r.kt)("inlineCode",{parentName:"td"},"params?")),(0,r.kt)("td",{parentName:"tr",align:"left"},(0,r.kt)("inlineCode",{parentName:"td"},"any"))))),(0,r.kt)("h4",{id:"returns"},"Returns"),(0,r.kt)("p",null,(0,r.kt)("inlineCode",{parentName:"p"},"any")),(0,r.kt)("hr",null),(0,r.kt)("h3",{id:"getaccountid"},"getAccountId"),(0,r.kt)("p",null,"\u25b8 ",(0,r.kt)("strong",{parentName:"p"},"getAccountId"),"(",(0,r.kt)("inlineCode",{parentName:"p"},"ethProvider"),", ",(0,r.kt)("inlineCode",{parentName:"p"},"address"),"): ",(0,r.kt)("inlineCode",{parentName:"p"},"Promise"),"<",(0,r.kt)("inlineCode",{parentName:"p"},"AccountId"),">"),(0,r.kt)("p",null,"Helper function to get an accountId (CAIP10) for an Ethereum account, uses ethProvider to get chainId/network"),(0,r.kt)("h4",{id:"parameters-1"},"Parameters"),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:"left"},"Name"),(0,r.kt)("th",{parentName:"tr",align:"left"},"Type"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:"left"},(0,r.kt)("inlineCode",{parentName:"td"},"ethProvider")),(0,r.kt)("td",{parentName:"tr",align:"left"},(0,r.kt)("inlineCode",{parentName:"td"},"any"))),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:"left"},(0,r.kt)("inlineCode",{parentName:"td"},"address")),(0,r.kt)("td",{parentName:"tr",align:"left"},(0,r.kt)("inlineCode",{parentName:"td"},"string"))))),(0,r.kt)("h4",{id:"returns-1"},"Returns"),(0,r.kt)("p",null,(0,r.kt)("inlineCode",{parentName:"p"},"Promise"),"<",(0,r.kt)("inlineCode",{parentName:"p"},"AccountId"),">"),(0,r.kt)("hr",null),(0,r.kt)("h3",{id:"geteip191verifier"},"getEIP191Verifier"),(0,r.kt)("p",null,"\u25b8 ",(0,r.kt)("strong",{parentName:"p"},"getEIP191Verifier"),"(): ",(0,r.kt)("inlineCode",{parentName:"p"},"Verifiers")),(0,r.kt)("p",null,"Get a configured CACAO EIP191Verifier map for Ethereum EOA accounts"),(0,r.kt)("h4",{id:"returns-2"},"Returns"),(0,r.kt)("p",null,(0,r.kt)("inlineCode",{parentName:"p"},"Verifiers")),(0,r.kt)("hr",null),(0,r.kt)("h3",{id:"safesend"},"safeSend"),(0,r.kt)("p",null,"\u25b8 ",(0,r.kt)("strong",{parentName:"p"},"safeSend"),"(",(0,r.kt)("inlineCode",{parentName:"p"},"provider"),", ",(0,r.kt)("inlineCode",{parentName:"p"},"method"),", ",(0,r.kt)("inlineCode",{parentName:"p"},"params?"),"): ",(0,r.kt)("inlineCode",{parentName:"p"},"Promise"),"<",(0,r.kt)("inlineCode",{parentName:"p"},"any"),">"),(0,r.kt)("h4",{id:"parameters-2"},"Parameters"),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:"left"},"Name"),(0,r.kt)("th",{parentName:"tr",align:"left"},"Type"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:"left"},(0,r.kt)("inlineCode",{parentName:"td"},"provider")),(0,r.kt)("td",{parentName:"tr",align:"left"},(0,r.kt)("inlineCode",{parentName:"td"},"any"))),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:"left"},(0,r.kt)("inlineCode",{parentName:"td"},"method")),(0,r.kt)("td",{parentName:"tr",align:"left"},(0,r.kt)("inlineCode",{parentName:"td"},"string"))),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:"left"},(0,r.kt)("inlineCode",{parentName:"td"},"params?")),(0,r.kt)("td",{parentName:"tr",align:"left"},(0,r.kt)("inlineCode",{parentName:"td"},"any"),"[]")))),(0,r.kt)("h4",{id:"returns-3"},"Returns"),(0,r.kt)("p",null,(0,r.kt)("inlineCode",{parentName:"p"},"Promise"),"<",(0,r.kt)("inlineCode",{parentName:"p"},"any"),">"),(0,r.kt)("hr",null),(0,r.kt)("h3",{id:"verifyeip191signature"},"verifyEIP191Signature"),(0,r.kt)("p",null,"\u25b8 ",(0,r.kt)("strong",{parentName:"p"},"verifyEIP191Signature"),"(",(0,r.kt)("inlineCode",{parentName:"p"},"cacao"),", ",(0,r.kt)("inlineCode",{parentName:"p"},"options"),"): ",(0,r.kt)("inlineCode",{parentName:"p"},"void")),(0,r.kt)("h4",{id:"parameters-3"},"Parameters"),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:"left"},"Name"),(0,r.kt)("th",{parentName:"tr",align:"left"},"Type"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:"left"},(0,r.kt)("inlineCode",{parentName:"td"},"cacao")),(0,r.kt)("td",{parentName:"tr",align:"left"},(0,r.kt)("inlineCode",{parentName:"td"},"Cacao"))),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:"left"},(0,r.kt)("inlineCode",{parentName:"td"},"options")),(0,r.kt)("td",{parentName:"tr",align:"left"},(0,r.kt)("inlineCode",{parentName:"td"},"VerifyOptions"))))),(0,r.kt)("h4",{id:"returns-4"},"Returns"),(0,r.kt)("p",null,(0,r.kt)("inlineCode",{parentName:"p"},"void")))}u.isMDXComponent=!0}}]);