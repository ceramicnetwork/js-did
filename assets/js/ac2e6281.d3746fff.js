"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[8613],{4852:(e,t,r)=>{r.d(t,{Zo:()=>c,kt:()=>v});var n=r(9231);function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function i(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function a(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?i(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):i(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function l(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},i=Object.keys(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var d=n.createContext({}),s=function(e){var t=n.useContext(d),r=t;return e&&(r="function"==typeof e?e(t):a(a({},t),e)),r},c=function(e){var t=s(e.components);return n.createElement(d.Provider,{value:t},e.children)},p="mdxType",u={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},h=n.forwardRef((function(e,t){var r=e.components,o=e.mdxType,i=e.originalType,d=e.parentName,c=l(e,["components","mdxType","originalType","parentName"]),p=s(r),h=o,v=p["".concat(d,".").concat(h)]||p[h]||u[h]||i;return r?n.createElement(v,a(a({ref:t},c),{},{components:r})):n.createElement(v,a({ref:t},c))}));function v(e,t){var r=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var i=r.length,a=new Array(i);a[0]=h;var l={};for(var d in t)hasOwnProperty.call(t,d)&&(l[d]=t[d]);l.originalType=e,l[p]="string"==typeof e?e:o,a[1]=l;for(var s=2;s<i;s++)a[s]=r[s];return n.createElement.apply(null,a)}return n.createElement.apply(null,r)}h.displayName="MDXCreateElement"},3539:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>d,contentTitle:()=>a,default:()=>u,frontMatter:()=>i,metadata:()=>l,toc:()=>s});var n=r(644),o=(r(9231),r(4852));const i={id:"pkh_did_resolver",title:"Module: pkh-did-resolver",custom_edit_url:null},a="PKH DID method resolver",l={unversionedId:"api/modules/pkh_did_resolver",id:"api/modules/pkh_did_resolver",title:"Module: pkh-did-resolver",description:"This package contains did:pkh method resolver implementation. Please refer to the specification for details about how this DID method works.",source:"@site/docs/api/modules/pkh_did_resolver.md",sourceDirName:"api/modules",slug:"/api/modules/pkh_did_resolver",permalink:"/docs/api/modules/pkh_did_resolver",draft:!1,editUrl:null,tags:[],version:"current",frontMatter:{id:"pkh_did_resolver",title:"Module: pkh-did-resolver",custom_edit_url:null},sidebar:"api",previous:{title:"Module: key-did-resolver",permalink:"/docs/api/modules/key_did_resolver"},next:{title:"Module: codecs",permalink:"/docs/api/modules/codecs"}},d={},s=[{value:"Usage",id:"usage",level:2},{value:"Installation",id:"installation",level:3},{value:"Resolving a PKH DID",id:"resolving-a-pkh-did",level:3},{value:"Functions",id:"functions",level:2},{value:"getResolver",id:"getresolver",level:3},{value:"Returns",id:"returns",level:4}],c={toc:s},p="wrapper";function u(e){let{components:t,...r}=e;return(0,o.kt)(p,(0,n.Z)({},c,r,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"pkh-did-method-resolver"},"PKH DID method resolver"),(0,o.kt)("p",null,"This package contains did:pkh method resolver implementation. Please refer to the ",(0,o.kt)("a",{parentName:"p",href:"https://github.com/w3c-ccg/did-pkh/blob/main/did-pkh-method-draft.md"},"specification")," for details about how this DID method works."),(0,o.kt)("h2",{id:"usage"},"Usage"),(0,o.kt)("p",null,"This package is used as a plugin to the ",(0,o.kt)("a",{parentName:"p",href:"https://github.com/decentralized-identity/did-resolver"},(0,o.kt)("inlineCode",{parentName:"a"},"did-resolver"))," library, which is the primary interface for resolving DIDs."),(0,o.kt)("h3",{id:"installation"},"Installation"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},"$ npm install pkh-did-resolver\n")),(0,o.kt)("h3",{id:"resolving-a-pkh-did"},"Resolving a PKH DID"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},"import { Resolver } from 'did-resolver'\nimport { getResolver } from 'pkh-did-resolver'\n\nconst pkhResolver = getResolver()\nconst resolver = new Resolver(pkhResolver)\n\nconst didResolutionResult = await resolver.resolve('did:pkh:eip155:1:0xab16a96d359ec26a11e2c2b3d8f8b8942d5bfcdb')\n")),(0,o.kt)("p",null,"Result:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},'{\n  "didDocument": {\n    "assertionMethod": [\n      "did:pkh:eip155:1:0xab16a96d359ec26a11e2c2b3d8f8b8942d5bfcdb#blockchainAccountId",\n    ],\n    "authentication": [\n      "did:pkh:eip155:1:0xab16a96d359ec26a11e2c2b3d8f8b8942d5bfcdb#blockchainAccountId",\n    ],\n    "id": "did:pkh:eip155:1:0xab16a96d359ec26a11e2c2b3d8f8b8942d5bfcdb",\n    "verificationMethod": [{\n      "blockchainAccountId": "eip155:1:0xab16a96d359ec26a11e2c2b3d8f8b8942d5bfcdb",\n      "controller": "did:pkh:eip155:1:0xab16a96d359ec26a11e2c2b3d8f8b8942d5bfcdb",\n      "id": "did:pkh:eip155:1:0xab16a96d359ec26a11e2c2b3d8f8b8942d5bfcdb#blockchainAccountId",\n      "type": "EcdsaSecp256k1RecoveryMethod2020",\n    }],\n  },\n  "didDocumentMetadata": {},\n  "didResolutionMetadata": {\n    "contentType": "application/did+json",\n  },\n}\n')),(0,o.kt)("h2",{id:"functions"},"Functions"),(0,o.kt)("h3",{id:"getresolver"},"getResolver"),(0,o.kt)("p",null,"\u25b8 ",(0,o.kt)("strong",{parentName:"p"},"getResolver"),"(): ",(0,o.kt)("inlineCode",{parentName:"p"},"ResolverRegistry")),(0,o.kt)("h4",{id:"returns"},"Returns"),(0,o.kt)("p",null,(0,o.kt)("inlineCode",{parentName:"p"},"ResolverRegistry")))}u.isMDXComponent=!0}}]);