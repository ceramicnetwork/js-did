"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[4280],{4852:(e,t,r)=>{r.d(t,{Zo:()=>m,kt:()=>d});var n=r(9231);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function u(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function i(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},o=Object.keys(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var p=n.createContext({}),l=function(e){var t=n.useContext(p),r=t;return e&&(r="function"==typeof e?e(t):u(u({},t),e)),r},m=function(e){var t=l(e.components);return n.createElement(p.Provider,{value:t},e.children)},c="mdxType",h={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},s=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,o=e.originalType,p=e.parentName,m=i(e,["components","mdxType","originalType","parentName"]),c=l(r),s=a,d=c["".concat(p,".").concat(s)]||c[s]||h[s]||o;return r?n.createElement(d,u(u({ref:t},m),{},{components:r})):n.createElement(d,u({ref:t},m))}));function d(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=r.length,u=new Array(o);u[0]=s;var i={};for(var p in t)hasOwnProperty.call(t,p)&&(i[p]=t[p]);i.originalType=e,i[c]="string"==typeof e?e:a,u[1]=i;for(var l=2;l<o;l++)u[l]=r[l];return n.createElement.apply(null,u)}return n.createElement.apply(null,r)}s.displayName="MDXCreateElement"},5168:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>p,contentTitle:()=>u,default:()=>h,frontMatter:()=>o,metadata:()=>i,toc:()=>l});var n=r(5675),a=(r(9231),r(4852));const o={id:"pkh_ethereum.EthereumWebAuth",title:"Namespace: EthereumWebAuth",custom_edit_url:null},u=void 0,i={unversionedId:"api/namespaces/pkh_ethereum.EthereumWebAuth",id:"api/namespaces/pkh_ethereum.EthereumWebAuth",title:"Namespace: EthereumWebAuth",description:"pkh-ethereum.EthereumWebAuth",source:"@site/docs/api/namespaces/pkh_ethereum.EthereumWebAuth.md",sourceDirName:"api/namespaces",slug:"/api/namespaces/pkh_ethereum.EthereumWebAuth",permalink:"/docs/api/namespaces/pkh_ethereum.EthereumWebAuth",draft:!1,editUrl:null,tags:[],version:"current",frontMatter:{id:"pkh_ethereum.EthereumWebAuth",title:"Namespace: EthereumWebAuth",custom_edit_url:null}},p={},l=[{value:"Functions",id:"functions",level:2},{value:"getAuthMethod",id:"getauthmethod",level:3},{value:"Parameters",id:"parameters",level:4},{value:"Returns",id:"returns",level:4}],m={toc:l},c="wrapper";function h(e){let{components:t,...r}=e;return(0,a.kt)(c,(0,n.Z)({},m,r,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"/docs/api/modules/pkh_ethereum"},"pkh-ethereum"),".EthereumWebAuth"),(0,a.kt)("h2",{id:"functions"},"Functions"),(0,a.kt)("h3",{id:"getauthmethod"},"getAuthMethod"),(0,a.kt)("p",null,"\u25b8 ",(0,a.kt)("strong",{parentName:"p"},"getAuthMethod"),"(",(0,a.kt)("inlineCode",{parentName:"p"},"ethProvider"),", ",(0,a.kt)("inlineCode",{parentName:"p"},"account"),"): ",(0,a.kt)("inlineCode",{parentName:"p"},"Promise"),"<",(0,a.kt)("inlineCode",{parentName:"p"},"AuthMethod"),">"),(0,a.kt)("p",null,"Get a configured authMethod for an Ethereum account in a web based environment"),(0,a.kt)("h4",{id:"parameters"},"Parameters"),(0,a.kt)("table",null,(0,a.kt)("thead",{parentName:"table"},(0,a.kt)("tr",{parentName:"thead"},(0,a.kt)("th",{parentName:"tr",align:"left"},"Name"),(0,a.kt)("th",{parentName:"tr",align:"left"},"Type"))),(0,a.kt)("tbody",{parentName:"table"},(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:"left"},(0,a.kt)("inlineCode",{parentName:"td"},"ethProvider")),(0,a.kt)("td",{parentName:"tr",align:"left"},(0,a.kt)("inlineCode",{parentName:"td"},"any"))),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:"left"},(0,a.kt)("inlineCode",{parentName:"td"},"account")),(0,a.kt)("td",{parentName:"tr",align:"left"},(0,a.kt)("inlineCode",{parentName:"td"},"AccountId"))))),(0,a.kt)("h4",{id:"returns"},"Returns"),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"Promise"),"<",(0,a.kt)("inlineCode",{parentName:"p"},"AuthMethod"),">"))}h.isMDXComponent=!0}}]);