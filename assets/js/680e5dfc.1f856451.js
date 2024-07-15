"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[5680],{4852:(e,t,a)=>{a.d(t,{Zo:()=>p,kt:()=>m});var n=a(9231);function r(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function i(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function l(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?i(Object(a),!0).forEach((function(t){r(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):i(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function s(e,t){if(null==e)return{};var a,n,r=function(e,t){if(null==e)return{};var a,n,r={},i=Object.keys(e);for(n=0;n<i.length;n++)a=i[n],t.indexOf(a)>=0||(r[a]=e[a]);return r}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)a=i[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var o=n.createContext({}),d=function(e){var t=n.useContext(o),a=t;return e&&(a="function"==typeof e?e(t):l(l({},t),e)),a},p=function(e){var t=d(e.components);return n.createElement(o.Provider,{value:t},e.children)},c="mdxType",k={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},u=n.forwardRef((function(e,t){var a=e.components,r=e.mdxType,i=e.originalType,o=e.parentName,p=s(e,["components","mdxType","originalType","parentName"]),c=d(a),u=r,m=c["".concat(o,".").concat(u)]||c[u]||k[u]||i;return a?n.createElement(m,l(l({ref:t},p),{},{components:a})):n.createElement(m,l({ref:t},p))}));function m(e,t){var a=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var i=a.length,l=new Array(i);l[0]=u;var s={};for(var o in t)hasOwnProperty.call(t,o)&&(s[o]=t[o]);s.originalType=e,s[c]="string"==typeof e?e:r,l[1]=s;for(var d=2;d<i;d++)l[d]=a[d];return n.createElement.apply(null,l)}return n.createElement.apply(null,a)}u.displayName="MDXCreateElement"},6070:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>o,contentTitle:()=>l,default:()=>k,frontMatter:()=>i,metadata:()=>s,toc:()=>d});var n=a(5799),r=(a(9231),a(4852));const i={id:"pkh_stacks",title:"Module: pkh-stacks",custom_edit_url:null},l=void 0,s={unversionedId:"api/modules/pkh_stacks",id:"api/modules/pkh_stacks",title:"Module: pkh-stacks",description:"Stacks AuthMethod and Verifier",source:"@site/docs/api/modules/pkh_stacks.md",sourceDirName:"api/modules",slug:"/api/modules/pkh_stacks",permalink:"/docs/api/modules/pkh_stacks",draft:!1,editUrl:null,tags:[],version:"current",frontMatter:{id:"pkh_stacks",title:"Module: pkh-stacks",custom_edit_url:null},sidebar:"api",previous:{title:"Module: pkh-tezos",permalink:"/docs/api/modules/pkh_tezos"},next:{title:"Module: key-did-provider-ed25519",permalink:"/docs/api/modules/key_did_provider_ed25519"}},o={},d=[{value:"Stacks AuthMethod and Verifier",id:"stacks-authmethod-and-verifier",level:2},{value:"Installation",id:"installation",level:2},{value:"Auth Usage",id:"auth-usage",level:2},{value:"Configuration",id:"configuration",level:2},{value:"Verifier Usage",id:"verifier-usage",level:2},{value:"Namespaces",id:"namespaces",level:2},{value:"Interfaces",id:"interfaces",level:2},{value:"Type Aliases",id:"type-aliases",level:2},{value:"SupportedProvider",id:"supportedprovider",level:3},{value:"Type declaration",id:"type-declaration",level:4},{value:"Variables",id:"variables",level:2},{value:"CHAIN_NAMESPACE",id:"chain_namespace",level:3},{value:"VERSION",id:"version",level:3},{value:"chainIdMap",id:"chainidmap",level:3},{value:"Type declaration",id:"type-declaration-1",level:4},{value:"Functions",id:"functions",level:2},{value:"assertSupportedProvider",id:"assertsupportedprovider",level:3},{value:"Parameters",id:"parameters",level:4},{value:"Returns",id:"returns",level:4},{value:"getAccountIdByNetwork",id:"getaccountidbynetwork",level:3},{value:"Parameters",id:"parameters-1",level:4},{value:"Returns",id:"returns-1",level:4},{value:"getStacksVerifier",id:"getstacksverifier",level:3},{value:"Returns",id:"returns-2",level:4},{value:"verifyStacksSignature",id:"verifystackssignature",level:3},{value:"Parameters",id:"parameters-2",level:4},{value:"Returns",id:"returns-3",level:4}],p={toc:d},c="wrapper";function k(e){let{components:t,...a}=e;return(0,r.kt)(c,(0,n.Z)({},p,a,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h2",{id:"stacks-authmethod-and-verifier"},"Stacks AuthMethod and Verifier"),(0,r.kt)("p",null,"Implements support to authenticate, authorize and verify with Stacks accounts as a did:pkh with SIWE(X) and CACAO.\nPrimarly used with ",(0,r.kt)("inlineCode",{parentName:"p"},"did-session")," and ",(0,r.kt)("inlineCode",{parentName:"p"},"@didtools/cacao"),"."),(0,r.kt)("h2",{id:"installation"},"Installation"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre"},"npm install --save @didtools/pkh-stacks\n")),(0,r.kt)("h2",{id:"auth-usage"},"Auth Usage"),(0,r.kt)("p",null,"To Auth in web based env, use any injected web3 provider that implements the standard interface with ",(0,r.kt)("inlineCode",{parentName:"p"},"StacksWebAuth"),"."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"// Web Auth Usage\nimport { StacksWebAuth, getAccountIdByNetwork, verifyStacksSignature } from '@didtools/pkh-stacks'\nimport { AppConfig, UserSession } from '@stacks/connect'\n\n// ...\nconst stacksProvider = window.StacksProvider\nconst appConfig = new AppConfig(['store_write'])\nconst userSession = new UserSession({ appConfig })\n\nconst userData = userSession.loadUserData()\nconst address = user.profile.stxAddress.mainnet\n\nconst accountId = await getAccountIdByNetwork('mainnet', address)\nconst authMethod = await StacksWebAuth.getAuthMethod(stacksProvider, accountId, publicKey)\n")),(0,r.kt)("p",null,"To use with did-session and reference did-session docs for more details."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},"const session = await DIDSession.authorize(authMethod, { resources: ['ceramic://*'] })\n")),(0,r.kt)("h2",{id:"configuration"},"Configuration"),(0,r.kt)("p",null,"AuthMethod creators consume a standard Stacks provider and an AccountId. AccountID follows the CAIP10 standard. The helper method ",(0,r.kt)("inlineCode",{parentName:"p"},"getAccountIdByNetwork")," id provided, but you can also create an AccountID using the CAIP library directly."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},"import { AccountId } from 'caip'\nimport { getAccountIdByNetwork } from '@didtools/pkh-stacks'\n// Using network string\nconst accountId = getAccountIdByNetwork('mainnet', address)\n// With CAIP\nconst stacksMainnetChainId = '1'\nconst chainNameSpace = 'stacks'\nconst chainId = `${chainNameSpace}:${stacksMainnetChainId}`\nconst accountIdCAIP = new AccountId({ address, chainId })\n")),(0,r.kt)("h2",{id:"verifier-usage"},"Verifier Usage"),(0,r.kt)("p",null,"Verifiers are needed to verify different did:pkh signed payloads using CACAO. Libraries that need them will\nconsume a verifiers map allowing your to register the verifiers you want to support."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"import { Cacao } from '@didtools/cacao'\nimport { getStacksVerifier } from '@didtools/pkh-stacks'\nimport { DID } from 'dids'\nconst verifiers = {\n  ...getStacksVerifier(),\n}\n// Directly with cacao\nCacao.verify(cacao, { verifiers, ...opts })\n// With DIDS, reference DIDS for more details\nconst dids = //configured dids instance\n  await dids.verifyJWS(jws, { capability, verifiers, ...opts })\n")),(0,r.kt)("h2",{id:"namespaces"},"Namespaces"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"/docs/api/namespaces/pkh_stacks.StacksWebAuth"},"StacksWebAuth"))),(0,r.kt)("h2",{id:"interfaces"},"Interfaces"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"/docs/api/interfaces/pkh_stacks.SignatureData"},"SignatureData"))),(0,r.kt)("h2",{id:"type-aliases"},"Type Aliases"),(0,r.kt)("h3",{id:"supportedprovider"},"SupportedProvider"),(0,r.kt)("p",null,"\u01ac ",(0,r.kt)("strong",{parentName:"p"},"SupportedProvider"),": ",(0,r.kt)("inlineCode",{parentName:"p"},"Object")),(0,r.kt)("h4",{id:"type-declaration"},"Type declaration"),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:"left"},"Name"),(0,r.kt)("th",{parentName:"tr",align:"left"},"Type"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:"left"},(0,r.kt)("inlineCode",{parentName:"td"},"signatureRequest")),(0,r.kt)("td",{parentName:"tr",align:"left"},"(",(0,r.kt)("inlineCode",{parentName:"td"},"payload"),": ",(0,r.kt)("inlineCode",{parentName:"td"},"string"),") => ",(0,r.kt)("inlineCode",{parentName:"td"},"Promise"),"<",(0,r.kt)("a",{parentName:"td",href:"/docs/api/interfaces/pkh_stacks.SignatureData"},(0,r.kt)("inlineCode",{parentName:"a"},"SignatureData")),">")))),(0,r.kt)("h2",{id:"variables"},"Variables"),(0,r.kt)("h3",{id:"chain_namespace"},"CHAIN","_","NAMESPACE"),(0,r.kt)("p",null,"\u2022 ",(0,r.kt)("inlineCode",{parentName:"p"},"Const")," ",(0,r.kt)("strong",{parentName:"p"},"CHAIN","_","NAMESPACE"),": ",(0,r.kt)("inlineCode",{parentName:"p"},'"stacks"')),(0,r.kt)("hr",null),(0,r.kt)("h3",{id:"version"},"VERSION"),(0,r.kt)("p",null,"\u2022 ",(0,r.kt)("inlineCode",{parentName:"p"},"Const")," ",(0,r.kt)("strong",{parentName:"p"},"VERSION"),": ",(0,r.kt)("inlineCode",{parentName:"p"},'"1"')),(0,r.kt)("hr",null),(0,r.kt)("h3",{id:"chainidmap"},"chainIdMap"),(0,r.kt)("p",null,"\u2022 ",(0,r.kt)("inlineCode",{parentName:"p"},"Const")," ",(0,r.kt)("strong",{parentName:"p"},"chainIdMap"),": ",(0,r.kt)("inlineCode",{parentName:"p"},"Object")),(0,r.kt)("h4",{id:"type-declaration-1"},"Type declaration"),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:"left"},"Name"),(0,r.kt)("th",{parentName:"tr",align:"left"},"Type"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:"left"},(0,r.kt)("inlineCode",{parentName:"td"},"mainnet")),(0,r.kt)("td",{parentName:"tr",align:"left"},(0,r.kt)("inlineCode",{parentName:"td"},"string"))),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:"left"},(0,r.kt)("inlineCode",{parentName:"td"},"testnet")),(0,r.kt)("td",{parentName:"tr",align:"left"},(0,r.kt)("inlineCode",{parentName:"td"},"string"))))),(0,r.kt)("h2",{id:"functions"},"Functions"),(0,r.kt)("h3",{id:"assertsupportedprovider"},"assertSupportedProvider"),(0,r.kt)("p",null,"\u25b8 ",(0,r.kt)("strong",{parentName:"p"},"assertSupportedProvider"),"(",(0,r.kt)("inlineCode",{parentName:"p"},"stacksProvider"),"): asserts stacksProvider is SupportedProvider"),(0,r.kt)("h4",{id:"parameters"},"Parameters"),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:"left"},"Name"),(0,r.kt)("th",{parentName:"tr",align:"left"},"Type"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:"left"},(0,r.kt)("inlineCode",{parentName:"td"},"stacksProvider")),(0,r.kt)("td",{parentName:"tr",align:"left"},(0,r.kt)("inlineCode",{parentName:"td"},"any"))))),(0,r.kt)("h4",{id:"returns"},"Returns"),(0,r.kt)("p",null,"asserts stacksProvider is SupportedProvider"),(0,r.kt)("hr",null),(0,r.kt)("h3",{id:"getaccountidbynetwork"},"getAccountIdByNetwork"),(0,r.kt)("p",null,"\u25b8 ",(0,r.kt)("strong",{parentName:"p"},"getAccountIdByNetwork"),"(",(0,r.kt)("inlineCode",{parentName:"p"},"network"),", ",(0,r.kt)("inlineCode",{parentName:"p"},"address"),"): ",(0,r.kt)("inlineCode",{parentName:"p"},"AccountId")),(0,r.kt)("p",null,"Helper function to get an accountId (CAIP10) for an Stacks account by network string 'mainet' | 'testnet'"),(0,r.kt)("h4",{id:"parameters-1"},"Parameters"),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:"left"},"Name"),(0,r.kt)("th",{parentName:"tr",align:"left"},"Type"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:"left"},(0,r.kt)("inlineCode",{parentName:"td"},"network")),(0,r.kt)("td",{parentName:"tr",align:"left"},(0,r.kt)("inlineCode",{parentName:"td"},"StacksNetwork"))),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:"left"},(0,r.kt)("inlineCode",{parentName:"td"},"address")),(0,r.kt)("td",{parentName:"tr",align:"left"},(0,r.kt)("inlineCode",{parentName:"td"},"string"))))),(0,r.kt)("h4",{id:"returns-1"},"Returns"),(0,r.kt)("p",null,(0,r.kt)("inlineCode",{parentName:"p"},"AccountId")),(0,r.kt)("hr",null),(0,r.kt)("h3",{id:"getstacksverifier"},"getStacksVerifier"),(0,r.kt)("p",null,"\u25b8 ",(0,r.kt)("strong",{parentName:"p"},"getStacksVerifier"),"(): ",(0,r.kt)("inlineCode",{parentName:"p"},"Verifiers")),(0,r.kt)("h4",{id:"returns-2"},"Returns"),(0,r.kt)("p",null,(0,r.kt)("inlineCode",{parentName:"p"},"Verifiers")),(0,r.kt)("hr",null),(0,r.kt)("h3",{id:"verifystackssignature"},"verifyStacksSignature"),(0,r.kt)("p",null,"\u25b8 ",(0,r.kt)("strong",{parentName:"p"},"verifyStacksSignature"),"(",(0,r.kt)("inlineCode",{parentName:"p"},"cacao"),", ",(0,r.kt)("inlineCode",{parentName:"p"},"options"),"): ",(0,r.kt)("inlineCode",{parentName:"p"},"void")),(0,r.kt)("h4",{id:"parameters-2"},"Parameters"),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:"left"},"Name"),(0,r.kt)("th",{parentName:"tr",align:"left"},"Type"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:"left"},(0,r.kt)("inlineCode",{parentName:"td"},"cacao")),(0,r.kt)("td",{parentName:"tr",align:"left"},(0,r.kt)("inlineCode",{parentName:"td"},"Cacao"))),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:"left"},(0,r.kt)("inlineCode",{parentName:"td"},"options")),(0,r.kt)("td",{parentName:"tr",align:"left"},(0,r.kt)("inlineCode",{parentName:"td"},"VerifyOptions"))))),(0,r.kt)("h4",{id:"returns-3"},"Returns"),(0,r.kt)("p",null,(0,r.kt)("inlineCode",{parentName:"p"},"void")))}k.isMDXComponent=!0}}]);