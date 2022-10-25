"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[4],{4852:(e,t,n)=>{n.d(t,{Zo:()=>u,kt:()=>m});var r=n(9231);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var c=r.createContext({}),l=function(e){var t=r.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},u=function(e){var t=l(e.components);return r.createElement(c.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},d=r.forwardRef((function(e,t){var n=e.components,o=e.mdxType,a=e.originalType,c=e.parentName,u=s(e,["components","mdxType","originalType","parentName"]),d=l(n),m=o,f=d["".concat(c,".").concat(m)]||d[m]||p[m]||a;return n?r.createElement(f,i(i({ref:t},u),{},{components:n})):r.createElement(f,i({ref:t},u))}));function m(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var a=n.length,i=new Array(a);i[0]=d;var s={};for(var c in t)hasOwnProperty.call(t,c)&&(s[c]=t[c]);s.originalType=e,s.mdxType="string"==typeof e?e:o,i[1]=s;for(var l=2;l<a;l++)i[l]=n[l];return r.createElement.apply(null,i)}return r.createElement.apply(null,n)}d.displayName="MDXCreateElement"},3567:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>c,contentTitle:()=>i,default:()=>p,frontMatter:()=>a,metadata:()=>s,toc:()=>l});var r=n(7626),o=(n(9231),n(4852));const a={},i="Configuration",s={unversionedId:"configuration",id:"configuration",title:"Configuration",description:"When creating a DID session, you need to pass an array of string identifiers for resources you want to authorize",source:"@site/docs/configuration.md",sourceDirName:".",slug:"/configuration",permalink:"/docs/configuration",draft:!1,tags:[],version:"current",frontMatter:{},sidebar:"docs",previous:{title:"Authorization",permalink:"/docs/authorization"},next:{title:"Managing Sessions",permalink:"/docs/managing-sessions"}},c={},l=[],u={toc:l};function p(e){let{components:t,...n}=e;return(0,o.kt)("wrapper",(0,r.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"configuration"},"Configuration"),(0,o.kt)("p",null,"When creating a DID session, you need to pass an array of string identifiers for resources you want to authorize\nfor. In the context of the Ceramic Network, resources are an array of Model Stream Ids or Streams Ids. Typically\nyou will just pass resources from the ",(0,o.kt)("inlineCode",{parentName:"p"},"@composedb")," libraries as you will already manage your Composites and Models\nthere. For example:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},"import { ComposeClient } from '@composedb/client'\n\n//... Reference above and `@composedb` docs for additional configuration here\n\nconst client = new ComposeClient({ceramic, definition})\nconst resources = client.resources\nconst session = await DIDSession.authorize(authMethod, { resources })\nclient.setDID(session.did)\n")),(0,o.kt)("p",null,"If you are still using ",(0,o.kt)("inlineCode",{parentName:"p"},"@glazed")," libraries and tile document streams you will typically pass a wildcard resource,\nthis all allows 'access all'. While not ideal, there is technical limits in ",(0,o.kt)("inlineCode",{parentName:"p"},"@glazed")," libraries and tile document\nstreams that make it difficult to offer more granular permission access to sets of stream. Authorization was mostly\ndesigned with model document streams and ",(0,o.kt)("inlineCode",{parentName:"p"},"@composedb")," libraries in mind. Wildcard resource may not be supported in\nthe future."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},"const session = await DIDSession.authorize(authMethod, { resources: [`ceramic://*`]})\n")),(0,o.kt)("p",null,"By default a session will expire in 1 day. You can change this time by passing the ",(0,o.kt)("inlineCode",{parentName:"p"},"expiresInSecs")," option to\nindicate how many seconds from the current time you want this session to expire."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},"const oneWeek = 60 * 60 * 24 * 7\nconst session = await DIDSession.authorize(authMethod, { resources: [...], expiresInSecs: oneWeek })\n")))}p.isMDXComponent=!0}}]);