"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[3],{4852:(e,t,n)=>{n.d(t,{Zo:()=>p,kt:()=>k});var r=n(9231);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function d(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function a(e,t){if(null==e)return{};var n,r,i=function(e,t){if(null==e)return{};var n,r,i={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var s=r.createContext({}),l=function(e){var t=r.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):d(d({},t),e)),n},p=function(e){var t=l(e.components);return r.createElement(s.Provider,{value:t},e.children)},c={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},u=r.forwardRef((function(e,t){var n=e.components,i=e.mdxType,o=e.originalType,s=e.parentName,p=a(e,["components","mdxType","originalType","parentName"]),u=l(n),k=i,f=u["".concat(s,".").concat(k)]||u[k]||c[k]||o;return n?r.createElement(f,d(d({ref:t},p),{},{components:n})):r.createElement(f,d({ref:t},p))}));function k(e,t){var n=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var o=n.length,d=new Array(o);d[0]=u;var a={};for(var s in t)hasOwnProperty.call(t,s)&&(a[s]=t[s]);a.originalType=e,a.mdxType="string"==typeof e?e:i,d[1]=a;for(var l=2;l<o;l++)d[l]=n[l];return r.createElement.apply(null,d)}return r.createElement.apply(null,n)}u.displayName="MDXCreateElement"},1600:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>s,contentTitle:()=>d,default:()=>c,frontMatter:()=>o,metadata:()=>a,toc:()=>l});var r=n(7626),i=(n(9231),n(4852));const o={id:"key_did_resolver",title:"Module: key-did-resolver",custom_edit_url:null},d=void 0,a={unversionedId:"api/modules/key_did_resolver",id:"api/modules/key_did_resolver",title:"Module: key-did-resolver",description:"Installation",source:"@site/docs/api/modules/key_did_resolver.md",sourceDirName:"api/modules",slug:"/api/modules/key_did_resolver",permalink:"/docs/api/modules/key_did_resolver",draft:!1,editUrl:null,tags:[],version:"current",frontMatter:{id:"key_did_resolver",title:"Module: key-did-resolver",custom_edit_url:null},sidebar:"api",previous:{title:"Module: key-did-provider-ed25519",permalink:"/docs/api/modules/key_did_provider_ed25519"},next:{title:"Module: pkh-did-resolver",permalink:"/docs/api/modules/pkh_did_resolver"}},s={},l=[{value:"Installation",id:"installation",level:2},{value:"Usage",id:"usage",level:3},{value:"Code",id:"code",level:3},{value:"Output",id:"output",level:3},{value:"code snippet for ed25519",id:"code-snippet-for-ed25519",level:4},{value:"code snippet for P-256",id:"code-snippet-for-p-256",level:4},{value:"code snippet for P-384",id:"code-snippet-for-p-384",level:4},{value:"code snippet for P-521",id:"code-snippet-for-p-521",level:4},{value:"did document verificationMethod for ed25519:",id:"did-document-verificationmethod-for-ed25519",level:4},{value:"did document verificationMethod for P-256:",id:"did-document-verificationmethod-for-p-256",level:4},{value:"did document verificationMethod for P-384:",id:"did-document-verificationmethod-for-p-384",level:4},{value:"did document verificationMethod for P-521:",id:"did-document-verificationmethod-for-p-521",level:4},{value:"Testing",id:"testing",level:3},{value:"References",id:"references",level:3},{value:"Variables",id:"variables",level:2},{value:"default",id:"default",level:3},{value:"Type declaration",id:"type-declaration",level:4},{value:"Functions",id:"functions",level:2},{value:"getResolver",id:"getresolver",level:3},{value:"Returns",id:"returns",level:4}],p={toc:l};function c(e){let{components:t,...n}=e;return(0,i.kt)("wrapper",(0,r.Z)({},p,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("h2",{id:"installation"},"Installation"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},"$ npm install key-did-resolver\n")),(0,i.kt)("h3",{id:"usage"},"Usage"),(0,i.kt)("p",null,"This code includes support for the curves Ed25519, Secp256k1, Secp256r1 (P-256), Secp384r1 (P-384), and Secp521r1 (P-521) which follow the test vectors at:\n",(0,i.kt)("a",{parentName:"p",href:"https://github.com/w3c-ccg/did-method-key/tree/main/test-vectors"},"https://github.com/w3c-ccg/did-method-key/tree/main/test-vectors")),(0,i.kt)("p",null,"This code has been tested with the following ",(0,i.kt)("inlineCode",{parentName:"p"},"did:key"),(0,i.kt)("sup",{parentName:"p",id:"fnref-1"},(0,i.kt)("a",{parentName:"sup",href:"#fn-1",className:"footnote-ref"},"1"))," providers:\n|  Curve              | Repositry                                                      |\n| ------------------- | -------------------------------------------------------------- |\n| Ed25519             | ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/ceramicnetwork/js-did/tree/main/packages/key-did-provider-ed25519"},"https://github.com/ceramicnetwork/js-did/tree/main/packages/key-did-provider-ed25519"),"     |\n| Secp256k1           | ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/ceramicnetwork/key-did-provider-secp256k1"},"https://github.com/ceramicnetwork/key-did-provider-secp256k1"),"   |\n| P-256, P-384, P-521 | ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/bshambaugh/did-key-creator"},"https://github.com/bshambaugh/did-key-creator"),"                  |"),(0,i.kt)("p",null,"Compressed",(0,i.kt)("sup",{parentName:"p",id:"fnref-2"},(0,i.kt)("a",{parentName:"sup",href:"#fn-2",className:"footnote-ref"},"2"))," forms of P-256, P-384, and P-521 are preferred. ",(0,i.kt)("sup",{parentName:"p",id:"fnref-3"},(0,i.kt)("a",{parentName:"sup",href:"#fn-3",className:"footnote-ref"},"3"))),(0,i.kt)("h3",{id:"code"},"Code"),(0,i.kt)("p",null,"Using with secp256k1 did-key:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},"import * as KeyDidResolver from 'key-did-resolver'\nimport {Resolver} from 'did-resolver'\n\nconst keyDidResolver = KeyDIDResolver.getResolver()\nconsole.log(keyDidResolver)\nconst didResolver = new Resolver(keyDidResolver)\nconst doc = await didResolver.resolve('did:key:z6MktvqCyLxTsXUH1tUZncNdVeEZ7hNh7npPRbUU27GTrYb8')\n\nconsole.log(doc)\nconsole.log(doc.didDocument.verificationMethod)\n")),(0,i.kt)("h3",{id:"output"},"Output"),(0,i.kt)("p",null,"Using with secp256k1 did-key:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},"{\n  didResolutionMetadata: { contentType: 'application/did+json' },\n  didDocument: {\n    id: 'did:key:zQ3shokFTS3brHcDQrn82RUDfCZESWL1ZdCEJwekUDPQiYBme',\n    verificationMethod: [ [Object] ],\n    authentication: [\n      'did:key:zQ3shokFTS3brHcDQrn82RUDfCZESWL1ZdCEJwekUDPQiYBme#zQ3shokFTS3brHcDQrn82RUDfCZESWL1ZdCEJwekUDPQiYBme'\n    ],\n    assertionMethod: [\n      'did:key:zQ3shokFTS3brHcDQrn82RUDfCZESWL1ZdCEJwekUDPQiYBme#zQ3shokFTS3brHcDQrn82RUDfCZESWL1ZdCEJwekUDPQiYBme'\n    ],\n    capabilityDelegation: [\n      'did:key:zQ3shokFTS3brHcDQrn82RUDfCZESWL1ZdCEJwekUDPQiYBme#zQ3shokFTS3brHcDQrn82RUDfCZESWL1ZdCEJwekUDPQiYBme'\n    ],\n    capabilityInvocation: [\n      'did:key:zQ3shokFTS3brHcDQrn82RUDfCZESWL1ZdCEJwekUDPQiYBme#zQ3shokFTS3brHcDQrn82RUDfCZESWL1ZdCEJwekUDPQiYBme'\n    ]\n  },\n  didDocumentMetadata: {}\n}\n[\n  {\n    id: 'did:key:zQ3shokFTS3brHcDQrn82RUDfCZESWL1ZdCEJwekUDPQiYBme#zQ3shokFTS3brHcDQrn82RUDfCZESWL1ZdCEJwekUDPQiYBme',\n    type: 'Secp256k1VerificationKey2018',\n    controller: 'did:key:zQ3shokFTS3brHcDQrn82RUDfCZESWL1ZdCEJwekUDPQiYBme',\n    publicKeyBase58: '23o6Sau8NxxzXcgSc3PLcNxrzrZpbLeBn1izfv3jbKhuv'\n  }\n]\n\n")),(0,i.kt)("p",null,"The code for other curves is similar. Changing the did:key string is sufficient."),(0,i.kt)("h4",{id:"code-snippet-for-ed25519"},"code snippet for ed25519"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},"const doc = await didResolver.resolve('did:key:z6MktvqCyLxTsXUH1tUZncNdVeEZ7hNh7npPRbUU27GTrYb8')\n")),(0,i.kt)("h4",{id:"code-snippet-for-p-256"},"code snippet for P-256"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},"const doc = await didResolver.resolve('did:key:zDnaeUKTWUXc1HDpGfKbEK31nKLN19yX5aunFd7VK1CUMeyJu')\n")),(0,i.kt)("h4",{id:"code-snippet-for-p-384"},"code snippet for P-384"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},"const doc = await didResolver.resolve('did:key:z82LkvCwHNreneWpsgPEbV3gu1C6NFJEBg4srfJ5gdxEsMGRJUz2sG9FE42shbn2xkZJh54')\n")),(0,i.kt)("h4",{id:"code-snippet-for-p-521"},"code snippet for P-521"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},"const doc = await didResolver.resolve('did:key:z2J9gcGhudjgwsDLv4qJVM6DysnsjWRS6ggtCsSYpV9TGxd9WGoE1EkPxdvPcqEs7eLsQA985AGXPuqttPP7WJ5Qdiz27U3t')\n")),(0,i.kt)("p",null,"Note: All P-*** curves are compressed"),(0,i.kt)("p",null,"The verification method results are slightly different. Here is a sampling:"),(0,i.kt)("h4",{id:"did-document-verificationmethod-for-ed25519"},"did document verificationMethod for ed25519:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},"[\n  {\n    id: 'did:key:z6MktvqCyLxTsXUH1tUZncNdVeEZ7hNh7npPRbUU27GTrYb8#z6MktvqCyLxTsXUH1tUZncNdVeEZ7hNh7npPRbUU27GTrYb8',\n    type: 'Ed25519VerificationKey2018',\n    controller: 'did:key:z6MktvqCyLxTsXUH1tUZncNdVeEZ7hNh7npPRbUU27GTrYb8',\n    publicKeyBase58: 'FUaAP6i2XyyouPds73QneYgZJ86qhua2jaZYBqJSwKok'\n  }\n]\n")),(0,i.kt)("h4",{id:"did-document-verificationmethod-for-p-256"},"did document verificationMethod for P-256:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},"[\n  {\n    id: 'did:key:zDnaeUKTWUXc1HDpGfKbEK31nKLN19yX5aunFd7VK1CUMeyJu#zDnaeUKTWUXc1HDpGfKbEK31nKLN19yX5aunFd7VK1CUMeyJu',\n    type: 'JsonWebKey2020',\n    controller: 'did:key:zDnaeUKTWUXc1HDpGfKbEK31nKLN19yX5aunFd7VK1CUMeyJu',\n    publicKeyJwk: {\n      kty: 'EC',\n      crv: 'P-256',\n      x: 'OcPddBMXKURtwbPaZ9SfwEb8vwcvzFufpRwFuXQwf5Y',\n      y: 'nEA7FjXwRJ8CvUInUeMxIaRDTxUvKysqP2dSGcXZJfY'\n    }\n  }\n]\n")),(0,i.kt)("h4",{id:"did-document-verificationmethod-for-p-384"},"did document verificationMethod for P-384:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},"[\n  {\n    id: 'did:key:z82LkvCwHNreneWpsgPEbV3gu1C6NFJEBg4srfJ5gdxEsMGRJUz2sG9FE42shbn2xkZJh54#z82LkvCwHNreneWpsgPEbV3gu1C6NFJEBg4srfJ5gdxEsMGRJUz2sG9FE42shbn2xkZJh54',\n    type: 'JsonWebKey2020',\n    controller: 'did:key:z82LkvCwHNreneWpsgPEbV3gu1C6NFJEBg4srfJ5gdxEsMGRJUz2sG9FE42shbn2xkZJh54',\n    publicKeyJwk: {\n      kty: 'EC',\n      crv: 'P-384',\n      x: 'CA-iNoHDg1lL8pvX3d1uvExzVfCz7Rn6tW781Ub8K5MrDf2IMPyL0RTDiaLHC1JT',\n      y: 'Kpnrn8DkXUD3ge4mFxi-DKr0DYO2KuJdwNBrhzLRtfMa3WFMZBiPKUPfJj8dYNl_'\n    }\n  }\n]\n")),(0,i.kt)("h4",{id:"did-document-verificationmethod-for-p-521"},"did document verificationMethod for P-521:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},"[\n  {\n    id: 'did:key:z2J9gcGhudjgwsDLv4qJVM6DysnsjWRS6ggtCsSYpV9TGxd9WGoE1EkPxdvPcqEs7eLsQA985AGXPuqttPP7WJ5Qdiz27U3t#z2J9gcGhudjgwsDLv4qJVM6DysnsjWRS6ggtCsSYpV9TGxd9WGoE1EkPxdvPcqEs7eLsQA985AGXPuqttPP7WJ5Qdiz27U3t',\n    type: 'JsonWebKey2020',\n    controller: 'did:key:z2J9gcGhudjgwsDLv4qJVM6DysnsjWRS6ggtCsSYpV9TGxd9WGoE1EkPxdvPcqEs7eLsQA985AGXPuqttPP7WJ5Qdiz27U3t',\n    publicKeyJwk: {\n      kty: 'EC',\n      crv: 'P-521',\n      x: 'ATkofCC8_KAAJ3XSRayyPk8WqF9qahhoQVjbHtzbe5MSaaFiMKBZr-CurF9IcpJD-YYEukPmarSKFpXLtwAdiONT',\n      y: 'AWuYkJ7iaFhfz_dzFemaBnuq1WFnoZeIha7KpE9benPTX9FQhAoyHY-2qO4IyqGe1XGGtx8eJXvp57xMtUXm2rAH'\n    }\n }\n]\n")),(0,i.kt)("h3",{id:"testing"},"Testing"),(0,i.kt)("p",null,"Due to problems with parsing JSON with BigInt, tests need to be run with Jest in Serial mode. Use ",(0,i.kt)("strong",{parentName:"p"},(0,i.kt)("em",{parentName:"strong"},"npm run test -- --runInBand"))," ."),(0,i.kt)("h3",{id:"references"},"References"),(0,i.kt)("p",null,"[Standards for Efficient Cryptography\nSEC 2: Recommended Elliptic Curve Domain Parameters\nCerticom Research\nContact: Daniel R. L. Brown (dbrown@certicom.com)\nJanuary 27, 2010\nVersion 2.0 ]",", ",(0,i.kt)("a",{parentName:"p",href:"http://www.secg.org/sec2-v2.pdf"},"http://www.secg.org/sec2-v2.pdf")),(0,i.kt)("p",null,"[FIPS PUB 186-4 ,FEDERAL INFORMATION PROCESSING STANDARDS\nPUBLICATION, Digital Signature Standard (DSS)]",", ",(0,i.kt)("a",{parentName:"p",href:"https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.186-4.pdf"},"https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.186-4.pdf")),(0,i.kt)("p",null,"[Compact representation of an elliptic curve point, Network Working Group, A.J. Jivsov, March 15, 2014]",",\n",(0,i.kt)("a",{parentName:"p",href:"https://tools.ietf.org/id/draft-jivsov-ecc-compact-05.html"},"https://tools.ietf.org/id/draft-jivsov-ecc-compact-05.html")),(0,i.kt)("h2",{id:"variables"},"Variables"),(0,i.kt)("h3",{id:"default"},"default"),(0,i.kt)("p",null,"\u2022 ",(0,i.kt)("strong",{parentName:"p"},"default"),": ",(0,i.kt)("inlineCode",{parentName:"p"},"Object")),(0,i.kt)("h4",{id:"type-declaration"},"Type declaration"),(0,i.kt)("table",null,(0,i.kt)("thead",{parentName:"table"},(0,i.kt)("tr",{parentName:"thead"},(0,i.kt)("th",{parentName:"tr",align:"left"},"Name"),(0,i.kt)("th",{parentName:"tr",align:"left"},"Type"))),(0,i.kt)("tbody",{parentName:"table"},(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:"left"},(0,i.kt)("inlineCode",{parentName:"td"},"getResolver")),(0,i.kt)("td",{parentName:"tr",align:"left"},"() => ",(0,i.kt)("inlineCode",{parentName:"td"},"ResolverRegistry"))))),(0,i.kt)("h2",{id:"functions"},"Functions"),(0,i.kt)("h3",{id:"getresolver"},"getResolver"),(0,i.kt)("p",null,"\u25b8 ",(0,i.kt)("strong",{parentName:"p"},"getResolver"),"(): ",(0,i.kt)("inlineCode",{parentName:"p"},"ResolverRegistry")),(0,i.kt)("h4",{id:"returns"},"Returns"),(0,i.kt)("p",null,(0,i.kt)("inlineCode",{parentName:"p"},"ResolverRegistry")),(0,i.kt)("div",{className:"footnotes"},(0,i.kt)("hr",{parentName:"div"}),(0,i.kt)("ol",{parentName:"div"},(0,i.kt)("li",{parentName:"ol",id:"fn-1"},"The syntax of a did:key is ",(0,i.kt)("inlineCode",{parentName:"li"},"did:key:id"),". The did:key ",(0,i.kt)("inlineCode",{parentName:"li"},"id")," is the ",(0,i.kt)("inlineCode",{parentName:"li"},"base58btc string")," representation of the ",(0,i.kt)("inlineCode",{parentName:"li"},"Uint8Array (byte array)")," consisting of the ",(0,i.kt)("inlineCode",{parentName:"li"},"the multicodec name")," followed by ",(0,i.kt)("inlineCode",{parentName:"li"},"the public key {raw,uncompressed,compressed}"),".",(0,i.kt)("a",{parentName:"li",href:"#fnref-1",className:"footnote-backref"},"\u21a9")),(0,i.kt)("li",{parentName:"ol",id:"fn-2"},"Compressed keys are the X coordinate of the public key with a prefix that depends on the sign of the Y curve coordinate. The prefix is '02' if even and '03' if odd.",(0,i.kt)("a",{parentName:"li",href:"#fnref-2",className:"footnote-backref"},"\u21a9")),(0,i.kt)("li",{parentName:"ol",id:"fn-3"},"During development there was not yet consensus on using all compressed keys. Support for uncompressed keys with the '04' prefix and\nraw keys (just the x,y bytes with no prefix) was kept for the P-256 and P-384 curves.",(0,i.kt)("a",{parentName:"li",href:"#fnref-3",className:"footnote-backref"},"\u21a9")))))}c.isMDXComponent=!0}}]);