"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[518],{4852:(e,t,r)=>{r.d(t,{Zo:()=>p,kt:()=>y});var n=r(9231);function i(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function d(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function a(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?d(Object(r),!0).forEach((function(t){i(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):d(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function o(e,t){if(null==e)return{};var r,n,i=function(e,t){if(null==e)return{};var r,n,i={},d=Object.keys(e);for(n=0;n<d.length;n++)r=d[n],t.indexOf(r)>=0||(i[r]=e[r]);return i}(e,t);if(Object.getOwnPropertySymbols){var d=Object.getOwnPropertySymbols(e);for(n=0;n<d.length;n++)r=d[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(i[r]=e[r])}return i}var l=n.createContext({}),s=function(e){var t=n.useContext(l),r=t;return e&&(r="function"==typeof e?e(t):a(a({},t),e)),r},p=function(e){var t=s(e.components);return n.createElement(l.Provider,{value:t},e.children)},c="mdxType",u={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},m=n.forwardRef((function(e,t){var r=e.components,i=e.mdxType,d=e.originalType,l=e.parentName,p=o(e,["components","mdxType","originalType","parentName"]),c=s(r),m=i,y=c["".concat(l,".").concat(m)]||c[m]||u[m]||d;return r?n.createElement(y,a(a({ref:t},p),{},{components:r})):n.createElement(y,a({ref:t},p))}));function y(e,t){var r=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var d=r.length,a=new Array(d);a[0]=m;var o={};for(var l in t)hasOwnProperty.call(t,l)&&(o[l]=t[l]);o.originalType=e,o[c]="string"==typeof e?e:i,a[1]=o;for(var s=2;s<d;s++)a[s]=r[s];return n.createElement.apply(null,a)}return n.createElement.apply(null,r)}m.displayName="MDXCreateElement"},7059:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>l,contentTitle:()=>a,default:()=>u,frontMatter:()=>d,metadata:()=>o,toc:()=>s});var n=r(5675),i=(r(9231),r(4852));const d={id:"key_did_provider_ed25519",title:"Module: key-did-provider-ed25519",custom_edit_url:null},a="ed25519 key did provider",o={unversionedId:"api/modules/key_did_provider_ed25519",id:"api/modules/key_did_provider_ed25519",title:"Module: key-did-provider-ed25519",description:"This is a DID Provider which implements EIP2844 for did using ed25519. It also supports decryption using x25519.",source:"@site/docs/api/modules/key_did_provider_ed25519.md",sourceDirName:"api/modules",slug:"/api/modules/key_did_provider_ed25519",permalink:"/docs/api/modules/key_did_provider_ed25519",draft:!1,editUrl:null,tags:[],version:"current",frontMatter:{id:"key_did_provider_ed25519",title:"Module: key-did-provider-ed25519",custom_edit_url:null},sidebar:"api",previous:{title:"Module: pkh-stacks",permalink:"/docs/api/modules/pkh_stacks"},next:{title:"Module: key-did-resolver",permalink:"/docs/api/modules/key_did_resolver"}},l={},s=[{value:"Installation",id:"installation",level:2},{value:"Usage",id:"usage",level:2},{value:"Classes",id:"classes",level:2},{value:"Functions",id:"functions",level:2},{value:"encodeDID",id:"encodedid",level:3},{value:"Parameters",id:"parameters",level:4},{value:"Returns",id:"returns",level:4}],p={toc:s},c="wrapper";function u(e){let{components:t,...r}=e;return(0,i.kt)(c,(0,n.Z)({},p,r,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("h1",{id:"ed25519-key-did-provider"},"ed25519 key did provider"),(0,i.kt)("p",null,"This is a DID Provider which implements ",(0,i.kt)("a",{parentName:"p",href:"https://eips.ethereum.org/EIPS/eip-2844"},"EIP2844")," for ",(0,i.kt)("inlineCode",{parentName:"p"},"did:key:")," using ed25519. It also supports decryption using x25519."),(0,i.kt)("h2",{id:"installation"},"Installation"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},"npm install --save key-did-provider-ed25519\n")),(0,i.kt)("h2",{id:"usage"},"Usage"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},"import { Ed25519Provider } from 'key-did-provider-ed25519'\nimport KeyResolver from 'key-did-resolver'\nimport { DID } from 'dids'\n\nconst seed = new Uint8Array(...) //  32 bytes with high entropy\nconst provider = new Ed25519Provider(seed)\nconst did = new DID({ provider, resolver: KeyResolver.getResolver() })\nawait did.authenticate()\n\n// log the DID\nconsole.log(did.id)\n\n// create JWS\nconst { jws, linkedBlock } = await did.createDagJWS({ hello: 'world' })\n\n// verify JWS\nawait did.verifyJWS(jws)\n\n// create JWE\nconst jwe = await did.createDagJWE({ very: 'secret' }, [did.id])\n\n// decrypt JWE\nconst decrypted = await did.decryptDagJWE(jwe)\n")),(0,i.kt)("h2",{id:"classes"},"Classes"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/api/classes/key_did_provider_ed25519.Ed25519Provider"},"Ed25519Provider"))),(0,i.kt)("h2",{id:"functions"},"Functions"),(0,i.kt)("h3",{id:"encodedid"},"encodeDID"),(0,i.kt)("p",null,"\u25b8 ",(0,i.kt)("strong",{parentName:"p"},"encodeDID"),"(",(0,i.kt)("inlineCode",{parentName:"p"},"publicKey"),"): ",(0,i.kt)("inlineCode",{parentName:"p"},"string")),(0,i.kt)("h4",{id:"parameters"},"Parameters"),(0,i.kt)("table",null,(0,i.kt)("thead",{parentName:"table"},(0,i.kt)("tr",{parentName:"thead"},(0,i.kt)("th",{parentName:"tr",align:"left"},"Name"),(0,i.kt)("th",{parentName:"tr",align:"left"},"Type"))),(0,i.kt)("tbody",{parentName:"table"},(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:"left"},(0,i.kt)("inlineCode",{parentName:"td"},"publicKey")),(0,i.kt)("td",{parentName:"tr",align:"left"},(0,i.kt)("inlineCode",{parentName:"td"},"Uint8Array"))))),(0,i.kt)("h4",{id:"returns"},"Returns"),(0,i.kt)("p",null,(0,i.kt)("inlineCode",{parentName:"p"},"string")))}u.isMDXComponent=!0}}]);