"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[9031],{4852:(e,t,n)=>{n.d(t,{Zo:()=>u,kt:()=>h});var r=n(9231);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function p(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var l=r.createContext({}),s=function(e){var t=r.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},u=function(e){var t=s(e.components);return r.createElement(l.Provider,{value:t},e.children)},c="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},m=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,l=e.parentName,u=p(e,["components","mdxType","originalType","parentName"]),c=s(n),m=a,h=c["".concat(l,".").concat(m)]||c[m]||d[m]||o;return n?r.createElement(h,i(i({ref:t},u),{},{components:n})):r.createElement(h,i({ref:t},u))}));function h(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,i=new Array(o);i[0]=m;var p={};for(var l in t)hasOwnProperty.call(t,l)&&(p[l]=t[l]);p.originalType=e,p[c]="string"==typeof e?e:a,i[1]=p;for(var s=2;s<o;s++)i[s]=n[s];return r.createElement.apply(null,i)}return r.createElement.apply(null,n)}m.displayName="MDXCreateElement"},9103:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>i,default:()=>d,frontMatter:()=>o,metadata:()=>p,toc:()=>s});var r=n(5907),a=(n(9231),n(4852));const o={id:"pkh_tezos.TezosWebAuth",title:"Namespace: TezosWebAuth",custom_edit_url:null},i=void 0,p={unversionedId:"api/namespaces/pkh_tezos.TezosWebAuth",id:"api/namespaces/pkh_tezos.TezosWebAuth",title:"Namespace: TezosWebAuth",description:"pkh-tezos.TezosWebAuth",source:"@site/docs/api/namespaces/pkh_tezos.TezosWebAuth.md",sourceDirName:"api/namespaces",slug:"/api/namespaces/pkh_tezos.TezosWebAuth",permalink:"/docs/api/namespaces/pkh_tezos.TezosWebAuth",draft:!1,editUrl:null,tags:[],version:"current",frontMatter:{id:"pkh_tezos.TezosWebAuth",title:"Namespace: TezosWebAuth",custom_edit_url:null}},l={},s=[{value:"Functions",id:"functions",level:2},{value:"getAuthMethod",id:"getauthmethod",level:3},{value:"Parameters",id:"parameters",level:4},{value:"Returns",id:"returns",level:4}],u={toc:s},c="wrapper";function d(e){let{components:t,...n}=e;return(0,a.kt)(c,(0,r.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"/docs/api/modules/pkh_tezos"},"pkh-tezos"),".TezosWebAuth"),(0,a.kt)("h2",{id:"functions"},"Functions"),(0,a.kt)("h3",{id:"getauthmethod"},"getAuthMethod"),(0,a.kt)("p",null,"\u25b8 ",(0,a.kt)("strong",{parentName:"p"},"getAuthMethod"),"(",(0,a.kt)("inlineCode",{parentName:"p"},"tzProvider"),", ",(0,a.kt)("inlineCode",{parentName:"p"},"account"),"): ",(0,a.kt)("inlineCode",{parentName:"p"},"Promise"),"<",(0,a.kt)("inlineCode",{parentName:"p"},"AuthMethod"),">"),(0,a.kt)("h4",{id:"parameters"},"Parameters"),(0,a.kt)("table",null,(0,a.kt)("thead",{parentName:"table"},(0,a.kt)("tr",{parentName:"thead"},(0,a.kt)("th",{parentName:"tr",align:"left"},"Name"),(0,a.kt)("th",{parentName:"tr",align:"left"},"Type"))),(0,a.kt)("tbody",{parentName:"table"},(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:"left"},(0,a.kt)("inlineCode",{parentName:"td"},"tzProvider")),(0,a.kt)("td",{parentName:"tr",align:"left"},(0,a.kt)("inlineCode",{parentName:"td"},"any"))),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:"left"},(0,a.kt)("inlineCode",{parentName:"td"},"account")),(0,a.kt)("td",{parentName:"tr",align:"left"},(0,a.kt)("inlineCode",{parentName:"td"},"AccountId"))))),(0,a.kt)("h4",{id:"returns"},"Returns"),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"Promise"),"<",(0,a.kt)("inlineCode",{parentName:"p"},"AuthMethod"),">"))}d.isMDXComponent=!0}}]);