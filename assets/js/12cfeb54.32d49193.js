"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[1e3],{4852:(e,n,t)=>{t.d(n,{Zo:()=>u,kt:()=>g});var r=t(9231);function s(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function i(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function o(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?i(Object(t),!0).forEach((function(n){s(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):i(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function a(e,n){if(null==e)return{};var t,r,s=function(e,n){if(null==e)return{};var t,r,s={},i=Object.keys(e);for(r=0;r<i.length;r++)t=i[r],n.indexOf(t)>=0||(s[t]=e[t]);return s}(e,n);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)t=i[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(s[t]=e[t])}return s}var c=r.createContext({}),l=function(e){var n=r.useContext(c),t=n;return e&&(t="function"==typeof e?e(n):o(o({},n),e)),t},u=function(e){var n=l(e.components);return r.createElement(c.Provider,{value:n},e.children)},p="mdxType",f={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},d=r.forwardRef((function(e,n){var t=e.components,s=e.mdxType,i=e.originalType,c=e.parentName,u=a(e,["components","mdxType","originalType","parentName"]),p=l(t),d=s,g=p["".concat(c,".").concat(d)]||p[d]||f[d]||i;return t?r.createElement(g,o(o({ref:n},u),{},{components:t})):r.createElement(g,o({ref:n},u))}));function g(e,n){var t=arguments,s=n&&n.mdxType;if("string"==typeof e||s){var i=t.length,o=new Array(i);o[0]=d;var a={};for(var c in n)hasOwnProperty.call(n,c)&&(a[c]=n[c]);a.originalType=e,a[p]="string"==typeof e?e:s,o[1]=a;for(var l=2;l<i;l++)o[l]=t[l];return r.createElement.apply(null,o)}return r.createElement.apply(null,t)}d.displayName="MDXCreateElement"},5880:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>c,contentTitle:()=>o,default:()=>f,frontMatter:()=>i,metadata:()=>a,toc:()=>l});var r=t(5675),s=(t(9231),t(4852));const i={},o="Managing Sessions",a={unversionedId:"managing-sessions",id:"managing-sessions",title:"Managing Sessions",description:"You can serialize a session to store for later and then re-initialize. Currently sessions are valid",source:"@site/docs/managing-sessions.md",sourceDirName:".",slug:"/managing-sessions",permalink:"/docs/managing-sessions",draft:!1,tags:[],version:"current",frontMatter:{},sidebar:"docs",previous:{title:"Configuration",permalink:"/docs/configuration"},next:{title:"Concepts overview",permalink:"/docs/guides/concepts-overview"}},c={},l=[],u={toc:l},p="wrapper";function f(e){let{components:n,...t}=e;return(0,s.kt)(p,(0,r.Z)({},u,t,{components:n,mdxType:"MDXLayout"}),(0,s.kt)("h1",{id:"managing-sessions"},"Managing Sessions"),(0,s.kt)("p",null,"You can serialize a session to store for later and then re-initialize. Currently sessions are valid\nfor 1 day by default."),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-js"},"// Create session as above, store for later\nconst session = await DIDSession.authorize(authMethod, { resources: [...]})\nconst sessionString = session.serialize()\n\n// write/save session string where you want (ie localstorage)\n// ...\n\n// Later re initialize session\nconst session2 = await DIDSession.fromSession(sessionString)\n")),(0,s.kt)("p",null,"Additional helper functions are available to help you manage a session lifecycle and the user experience."),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-js"},"// Check if authorized or created from existing session string\ndidsession.hasSession\n\n// Check if session expired\ndidsession.isExpired\n\n// Get resources session is authorized for\ndidsession.authorizations\n\n// Check number of seconds till expiration, may want to re auth user at a time before expiration\ndidsession.expiresInSecs\n")))}f.isMDXComponent=!0}}]);