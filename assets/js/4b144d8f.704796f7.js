"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[769],{4852:(e,t,n)=>{n.d(t,{Zo:()=>d,kt:()=>h});var a=n(9231);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},o=Object.keys(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var p=a.createContext({}),u=function(e){var t=a.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},d=function(e){var t=u(e.components);return a.createElement(p.Provider,{value:t},e.children)},c="mdxType",s={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},m=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,o=e.originalType,p=e.parentName,d=i(e,["components","mdxType","originalType","parentName"]),c=u(n),m=r,h=c["".concat(p,".").concat(m)]||c[m]||s[m]||o;return n?a.createElement(h,l(l({ref:t},d),{},{components:n})):a.createElement(h,l({ref:t},d))}));function h(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var o=n.length,l=new Array(o);l[0]=m;var i={};for(var p in t)hasOwnProperty.call(t,p)&&(i[p]=t[p]);i.originalType=e,i[c]="string"==typeof e?e:r,l[1]=i;for(var u=2;u<o;u++)l[u]=n[u];return a.createElement.apply(null,l)}return a.createElement.apply(null,n)}m.displayName="MDXCreateElement"},4914:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>p,contentTitle:()=>l,default:()=>s,frontMatter:()=>o,metadata:()=>i,toc:()=>u});var a=n(5675),r=(n(9231),n(4852));const o={id:"pkh_solana.SolanaNodeAuth",title:"Namespace: SolanaNodeAuth",custom_edit_url:null},l=void 0,i={unversionedId:"api/namespaces/pkh_solana.SolanaNodeAuth",id:"api/namespaces/pkh_solana.SolanaNodeAuth",title:"Namespace: SolanaNodeAuth",description:"pkh-solana.SolanaNodeAuth",source:"@site/docs/api/namespaces/pkh_solana.SolanaNodeAuth.md",sourceDirName:"api/namespaces",slug:"/api/namespaces/pkh_solana.SolanaNodeAuth",permalink:"/docs/api/namespaces/pkh_solana.SolanaNodeAuth",draft:!1,editUrl:null,tags:[],version:"current",frontMatter:{id:"pkh_solana.SolanaNodeAuth",title:"Namespace: SolanaNodeAuth",custom_edit_url:null}},p={},u=[{value:"Functions",id:"functions",level:2},{value:"getAuthMethod",id:"getauthmethod",level:3},{value:"Parameters",id:"parameters",level:4},{value:"Returns",id:"returns",level:4}],d={toc:u},c="wrapper";function s(e){let{components:t,...n}=e;return(0,r.kt)(c,(0,a.Z)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("p",null,(0,r.kt)("a",{parentName:"p",href:"/docs/api/modules/pkh_solana"},"pkh-solana"),".SolanaNodeAuth"),(0,r.kt)("h2",{id:"functions"},"Functions"),(0,r.kt)("h3",{id:"getauthmethod"},"getAuthMethod"),(0,r.kt)("p",null,"\u25b8 ",(0,r.kt)("strong",{parentName:"p"},"getAuthMethod"),"(",(0,r.kt)("inlineCode",{parentName:"p"},"ethProvider"),", ",(0,r.kt)("inlineCode",{parentName:"p"},"account"),", ",(0,r.kt)("inlineCode",{parentName:"p"},"appName"),"): ",(0,r.kt)("inlineCode",{parentName:"p"},"Promise"),"<",(0,r.kt)("inlineCode",{parentName:"p"},"AuthMethod"),">"),(0,r.kt)("p",null,"Get a configured authMethod for a Solana account in a node based environment"),(0,r.kt)("h4",{id:"parameters"},"Parameters"),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:"left"},"Name"),(0,r.kt)("th",{parentName:"tr",align:"left"},"Type"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:"left"},(0,r.kt)("inlineCode",{parentName:"td"},"ethProvider")),(0,r.kt)("td",{parentName:"tr",align:"left"},(0,r.kt)("inlineCode",{parentName:"td"},"any"))),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:"left"},(0,r.kt)("inlineCode",{parentName:"td"},"account")),(0,r.kt)("td",{parentName:"tr",align:"left"},(0,r.kt)("inlineCode",{parentName:"td"},"AccountId"))),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:"left"},(0,r.kt)("inlineCode",{parentName:"td"},"appName")),(0,r.kt)("td",{parentName:"tr",align:"left"},(0,r.kt)("inlineCode",{parentName:"td"},"string"))))),(0,r.kt)("h4",{id:"returns"},"Returns"),(0,r.kt)("p",null,(0,r.kt)("inlineCode",{parentName:"p"},"Promise"),"<",(0,r.kt)("inlineCode",{parentName:"p"},"AuthMethod"),">"))}s.isMDXComponent=!0}}]);