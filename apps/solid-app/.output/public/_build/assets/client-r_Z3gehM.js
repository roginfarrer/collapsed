const c={context:void 0,registry:void 0};function re(e){c.context=e}function Fe(){return{...c.context,id:`${c.context.id}${c.context.count++}-`,count:0}}const je=(e,n)=>e===n,X=Symbol("solid-proxy"),L={equals:je};let I=null,qe=Ce;const E=1,F=2,pe={owned:null,cleanups:null,context:null,owner:null};var h=null;let V=null,Me=null,g=null,y=null,x=null,M=0;function Ue(e,n){const t=g,s=h,i=e.length===0,r=n===void 0?s:n,o=i?pe:{owned:null,cleanups:null,context:r?r.context:null,owner:r},l=i?e:()=>e(()=>P(()=>R(o)));h=o,g=null;try{return H(l,!0)}finally{g=t,h=s}}function me(e,n){n=n?Object.assign({},L,n):L;const t={value:e,observers:null,observerSlots:null,comparator:n.equals||void 0},s=i=>(typeof i=="function"&&(i=i(t.value)),we(t,i));return[xe.bind(t),s]}function T(e,n,t){const s=ee(e,n,!1,E);U(s)}function be(e,n,t){t=t?Object.assign({},L,t):L;const s=ee(e,n,!0,0);return s.observers=null,s.observerSlots=null,s.comparator=t.equals||void 0,U(s),xe.bind(s)}function P(e){if(g===null)return e();const n=g;g=null;try{return e()}finally{g=n}}function Re(e){return h===null||(h.cleanups===null?h.cleanups=[e]:h.cleanups.push(e)),e}function De(e,n){I||(I=Symbol("error")),h=ee(void 0,void 0,!0),h.context={...h.context,[I]:[n]};try{return e()}catch(t){D(t)}finally{h=h.owner}}function xe(){if(this.sources&&this.state)if(this.state===E)U(this);else{const e=y;y=null,H(()=>j(this),!1),y=e}if(g){const e=this.observers?this.observers.length:0;g.sources?(g.sources.push(this),g.sourceSlots.push(e)):(g.sources=[this],g.sourceSlots=[e]),this.observers?(this.observers.push(g),this.observerSlots.push(g.sources.length-1)):(this.observers=[g],this.observerSlots=[g.sources.length-1])}return this.value}function we(e,n,t){let s=e.value;return(!e.comparator||!e.comparator(s,n))&&(e.value=n,e.observers&&e.observers.length&&H(()=>{for(let i=0;i<e.observers.length;i+=1){const r=e.observers[i],o=V&&V.running;o&&V.disposed.has(r),(o?!r.tState:!r.state)&&(r.pure?y.push(r):x.push(r),r.observers&&Se(r)),o||(r.state=E)}if(y.length>1e6)throw y=[],new Error},!1)),n}function U(e){if(!e.fn)return;R(e);const n=M;Be(e,e.value,n)}function Be(e,n,t){let s;const i=h,r=g;g=h=e;try{s=e.fn(n)}catch(o){return e.pure&&(e.state=E,e.owned&&e.owned.forEach(R),e.owned=null),e.updatedAt=t+1,D(o)}finally{g=r,h=i}(!e.updatedAt||e.updatedAt<=t)&&(e.updatedAt!=null&&"observers"in e?we(e,s):e.value=s,e.updatedAt=t)}function ee(e,n,t,s=E,i){const r={fn:e,state:s,updatedAt:null,owned:null,sources:null,sourceSlots:null,cleanups:null,value:n,owner:h,context:h?h.context:null,pure:t};return h===null||h!==pe&&(h.owned?h.owned.push(r):h.owned=[r]),r}function Ee(e){if(e.state===0)return;if(e.state===F)return j(e);if(e.suspense&&P(e.suspense.inFallback))return e.suspense.effects.push(e);const n=[e];for(;(e=e.owner)&&(!e.updatedAt||e.updatedAt<M);)e.state&&n.push(e);for(let t=n.length-1;t>=0;t--)if(e=n[t],e.state===E)U(e);else if(e.state===F){const s=y;y=null,H(()=>j(e,n[0]),!1),y=s}}function H(e,n){if(y)return e();let t=!1;n||(y=[]),x?t=!0:x=[],M++;try{const s=e();return Ve(t),s}catch(s){t||(x=null),y=null,D(s)}}function Ve(e){if(y&&(Ce(y),y=null),e)return;const n=x;x=null,n.length&&H(()=>qe(n),!1)}function Ce(e){for(let n=0;n<e.length;n++)Ee(e[n])}function j(e,n){e.state=0;for(let t=0;t<e.sources.length;t+=1){const s=e.sources[t];if(s.sources){const i=s.state;i===E?s!==n&&(!s.updatedAt||s.updatedAt<M)&&Ee(s):i===F&&j(s,n)}}}function Se(e){for(let n=0;n<e.observers.length;n+=1){const t=e.observers[n];t.state||(t.state=F,t.pure?y.push(t):x.push(t),t.observers&&Se(t))}}function R(e){let n;if(e.sources)for(;e.sources.length;){const t=e.sources.pop(),s=e.sourceSlots.pop(),i=t.observers;if(i&&i.length){const r=i.pop(),o=t.observerSlots.pop();s<i.length&&(r.sourceSlots[o]=s,i[s]=r,t.observerSlots[s]=o)}}if(e.owned){for(n=e.owned.length-1;n>=0;n--)R(e.owned[n]);e.owned=null}if(e.cleanups){for(n=e.cleanups.length-1;n>=0;n--)e.cleanups[n]();e.cleanups=null}e.state=0}function Ke(e){return e instanceof Error?e:new Error(typeof e=="string"?e:"Unknown error",{cause:e})}function le(e,n,t){try{for(const s of n)s(e)}catch(s){D(s,t&&t.owner||null)}}function D(e,n=h){const t=I&&n&&n.context&&n.context[I],s=Ke(e);if(!t)throw s;x?x.push({fn(){le(s,t,n)},state:E}):le(s,t,n)}let $e=!1;function ze(){$e=!0}function C(e,n){if($e&&c.context){const t=c.context;re(Fe());const s=P(()=>e(n||{}));return re(t),s}return P(()=>e(n||{}))}function _(){return!0}const Ye={get(e,n,t){return n===X?t:e.get(n)},has(e,n){return n===X?!0:e.has(n)},set:_,deleteProperty:_,getOwnPropertyDescriptor(e,n){return{configurable:!0,enumerable:!0,get(){return e.get(n)},set:_,deleteProperty:_}},ownKeys(e){return e.keys()}};function K(e){return(e=typeof e=="function"?e():e)?e:{}}function Ge(){for(let e=0,n=this.length;e<n;++e){const t=this[e]();if(t!==void 0)return t}}function oe(...e){let n=!1;for(let o=0;o<e.length;o++){const l=e[o];n=n||!!l&&X in l,e[o]=typeof l=="function"?(n=!0,be(l)):l}if(n)return new Proxy({get(o){for(let l=e.length-1;l>=0;l--){const u=K(e[l])[o];if(u!==void 0)return u}},has(o){for(let l=e.length-1;l>=0;l--)if(o in K(e[l]))return!0;return!1},keys(){const o=[];for(let l=0;l<e.length;l++)o.push(...Object.keys(K(e[l])));return[...new Set(o)]}},Ye);const t={},s=Object.create(null);for(let o=e.length-1;o>=0;o--){const l=e[o];if(!l)continue;const u=Object.getOwnPropertyNames(l);for(let d=u.length-1;d>=0;d--){const f=u[d];if(f==="__proto__"||f==="constructor")continue;const a=Object.getOwnPropertyDescriptor(l,f);if(!s[f])s[f]=a.get?{enumerable:!0,configurable:!0,get:Ge.bind(t[f]=[a.get.bind(l)])}:a.value!==void 0?a:void 0;else{const p=t[f];p&&(a.get?p.push(a.get.bind(l)):a.value!==void 0&&p.push(()=>a.value))}}}const i={},r=Object.keys(s);for(let o=r.length-1;o>=0;o--){const l=r[o],u=s[l];u&&u.get?Object.defineProperty(i,l,u):i[l]=u?u.value:void 0}return i}let k;function We(e){let n;c.context&&c.load&&(n=c.load(c.context.id+c.context.count));const[t,s]=me(n,void 0);return k||(k=new Set),k.add(s),Re(()=>k.delete(s)),be(()=>{let i;if(i=t()){const r=e.fallback;return typeof r=="function"&&r.length?P(()=>r(i,()=>s())):r}return De(()=>e.children,s)},void 0,void 0)}const Xe=["allowfullscreen","async","autofocus","autoplay","checked","controls","default","disabled","formnovalidate","hidden","indeterminate","inert","ismap","loop","multiple","muted","nomodule","novalidate","open","playsinline","readonly","required","reversed","seamless","selected"],Ze=new Set(["className","value","readOnly","formNoValidate","isMap","noModule","playsInline",...Xe]),Je=new Set(["innerHTML","textContent","innerText","children"]),Qe=Object.assign(Object.create(null),{className:"class",htmlFor:"for"}),et=Object.assign(Object.create(null),{class:"className",formnovalidate:{$:"formNoValidate",BUTTON:1,INPUT:1},ismap:{$:"isMap",IMG:1},nomodule:{$:"noModule",SCRIPT:1},playsinline:{$:"playsInline",VIDEO:1},readonly:{$:"readOnly",INPUT:1,TEXTAREA:1}});function tt(e,n){const t=et[e];return typeof t=="object"?t[n]?t.$:void 0:t}const nt=new Set(["beforeinput","click","dblclick","contextmenu","focusin","focusout","input","keydown","keyup","mousedown","mousemove","mouseout","mouseover","mouseup","pointerdown","pointermove","pointerout","pointerover","pointerup","touchend","touchmove","touchstart"]);function st(e,n,t){let s=t.length,i=n.length,r=s,o=0,l=0,u=n[i-1].nextSibling,d=null;for(;o<i||l<r;){if(n[o]===t[l]){o++,l++;continue}for(;n[i-1]===t[r-1];)i--,r--;if(i===o){const f=r<s?l?t[l-1].nextSibling:t[r-l]:u;for(;l<r;)e.insertBefore(t[l++],f)}else if(r===l)for(;o<i;)(!d||!d.has(n[o]))&&n[o].remove(),o++;else if(n[o]===t[r-1]&&t[l]===n[i-1]){const f=n[--i].nextSibling;e.insertBefore(t[l++],n[o++].nextSibling),e.insertBefore(t[--r],f),n[i]=t[r]}else{if(!d){d=new Map;let a=l;for(;a<r;)d.set(t[a],a++)}const f=d.get(n[o]);if(f!=null)if(l<f&&f<r){let a=o,p=1,S;for(;++a<i&&a<r&&!((S=d.get(n[a]))==null||S!==f+p);)p++;if(p>f-l){const O=n[o];for(;l<f;)e.insertBefore(t[l++],O)}else e.replaceChild(t[l++],n[o++])}else o++;else n[o++].remove()}}}const ue="_$DX_DELEGATE";function it(e,n,t,s={}){let i;return Ue(r=>{i=r,n===document?e():Pe(n,e(),n.firstChild?null:void 0,t)},s.owner),()=>{i(),n.textContent=""}}function Ae(e,n,t){let s;const i=()=>{const o=document.createElement("template");return o.innerHTML=e,o.content.firstChild},r=()=>(s||(s=i())).cloneNode(!0);return r.cloneNode=r,r}function Te(e,n=window.document){const t=n[ue]||(n[ue]=new Set);for(let s=0,i=e.length;s<i;s++){const r=e[s];t.has(r)||(t.add(r),n.addEventListener(r,Ie))}}function rt(e,n,t){c.context&&e.isConnected||(e[n]=t)}function Z(e,n,t){c.context&&e.isConnected||(t==null?e.removeAttribute(n):e.setAttribute(n,t))}function lt(e,n){c.context&&e.isConnected||(n==null?e.removeAttribute("class"):e.className=n)}function ot(e,n,t,s){if(s)Array.isArray(t)?(e[`$$${n}`]=t[0],e[`$$${n}Data`]=t[1]):e[`$$${n}`]=t;else if(Array.isArray(t)){const i=t[0];e.addEventListener(n,t[0]=r=>i.call(e,t[1],r))}else e.addEventListener(n,t)}function ut(e,n,t={}){const s=Object.keys(n||{}),i=Object.keys(t);let r,o;for(r=0,o=i.length;r<o;r++){const l=i[r];!l||l==="undefined"||n[l]||(fe(e,l,!1),delete t[l])}for(r=0,o=s.length;r<o;r++){const l=s[r],u=!!n[l];!l||l==="undefined"||t[l]===u||!u||(fe(e,l,!0),t[l]=u)}return t}function ct(e,n,t){if(!n)return t?Z(e,"style"):n;const s=e.style;if(typeof n=="string")return s.cssText=n;typeof t=="string"&&(s.cssText=t=void 0),t||(t={}),n||(n={});let i,r;for(r in t)n[r]==null&&s.removeProperty(r),delete t[r];for(r in n)i=n[r],i!==t[r]&&(s.setProperty(r,i),t[r]=i);return t}function ce(e,n={},t,s){const i={};return T(()=>typeof n.ref=="function"?ft(n.ref,e):n.ref=e),T(()=>at(e,n,t,!0,i,!0)),i}function ft(e,n,t){return P(()=>e(n,t))}function Pe(e,n,t,s){if(t!==void 0&&!s&&(s=[]),typeof n!="function")return q(e,n,s,t);T(i=>q(e,n(),i,t),s)}function at(e,n,t,s,i={},r=!1){n||(n={});for(const o in i)if(!(o in n)){if(o==="children")continue;i[o]=ae(e,o,null,i[o],t,r)}for(const o in n){if(o==="children")continue;const l=n[o];i[o]=ae(e,o,l,i[o],t,r)}}function dt(e,n,t={}){c.completed=globalThis._$HY.completed,c.events=globalThis._$HY.events,c.load=i=>globalThis._$HY.r[i],c.has=i=>i in globalThis._$HY.r,c.gather=i=>he(n,i),c.registry=new Map,c.context={id:t.renderId||"",count:0},he(n,t.renderId);const s=it(e,n,[...n.childNodes],t);return c.context=null,s}function ve(e){let n,t;return!c.context||!(n=c.registry.get(t=yt()))?e():(c.completed&&c.completed.add(n),c.registry.delete(t),n)}function ht(){c.events&&!c.events.queued&&(queueMicrotask(()=>{const{completed:e,events:n}=c;for(n.queued=!1;n.length;){const[t,s]=n[0];if(!e.has(t))return;Ie(s),n.shift()}}),c.events.queued=!0)}function gt(e){return e.toLowerCase().replace(/-([a-z])/g,(n,t)=>t.toUpperCase())}function fe(e,n,t){const s=n.trim().split(/\s+/);for(let i=0,r=s.length;i<r;i++)e.classList.toggle(s[i],t)}function ae(e,n,t,s,i,r){let o,l,u,d,f;if(n==="style")return ct(e,t,s);if(n==="classList")return ut(e,t,s);if(t===s)return s;if(n==="ref")r||t(e);else if(n.slice(0,3)==="on:"){const a=n.slice(3);s&&e.removeEventListener(a,s),t&&e.addEventListener(a,t)}else if(n.slice(0,10)==="oncapture:"){const a=n.slice(10);s&&e.removeEventListener(a,s,!0),t&&e.addEventListener(a,t,!0)}else if(n.slice(0,2)==="on"){const a=n.slice(2).toLowerCase(),p=nt.has(a);if(!p&&s){const S=Array.isArray(s)?s[0]:s;e.removeEventListener(a,S)}(p||t)&&(ot(e,a,t,p),p&&Te([a]))}else if(n.slice(0,5)==="attr:")Z(e,n.slice(5),t);else if((f=n.slice(0,5)==="prop:")||(u=Je.has(n))||(d=tt(n,e.tagName))||(l=Ze.has(n))||(o=e.nodeName.includes("-"))){if(f)n=n.slice(5),l=!0;else if(c.context&&e.isConnected)return t;n==="class"||n==="className"?lt(e,t):o&&!l&&!u?e[gt(n)]=t:e[d||n]=t}else Z(e,Qe[n]||n,t);return t}function Ie(e){const n=`$$${e.type}`;let t=e.composedPath&&e.composedPath()[0]||e.target;for(e.target!==t&&Object.defineProperty(e,"target",{configurable:!0,value:t}),Object.defineProperty(e,"currentTarget",{configurable:!0,get(){return t||document}}),c.registry&&!c.done&&(c.done=_$HY.done=!0);t;){const s=t[n];if(s&&!t.disabled){const i=t[`${n}Data`];if(i!==void 0?s.call(t,i,e):s.call(t,e),e.cancelBubble)return}t=t._$host||t.parentNode||t.host}}function q(e,n,t,s,i){const r=!!c.context&&e.isConnected;if(r){!t&&(t=[...e.childNodes]);let u=[];for(let d=0;d<t.length;d++){const f=t[d];f.nodeType===8&&f.data.slice(0,2)==="!$"?f.remove():u.push(f)}t=u}for(;typeof t=="function";)t=t();if(n===t)return t;const o=typeof n,l=s!==void 0;if(e=l&&t[0]&&t[0].parentNode||e,o==="string"||o==="number"){if(r)return t;if(o==="number"&&(n=n.toString()),l){let u=t[0];u&&u.nodeType===3?u.data!==n&&(u.data=n):u=document.createTextNode(n),t=$(e,t,s,u)}else t!==""&&typeof t=="string"?t=e.firstChild.data=n:t=e.textContent=n}else if(n==null||o==="boolean"){if(r)return t;t=$(e,t,s)}else{if(o==="function")return T(()=>{let u=n();for(;typeof u=="function";)u=u();t=q(e,u,t,s)}),()=>t;if(Array.isArray(n)){const u=[],d=t&&Array.isArray(t);if(J(u,n,t,i))return T(()=>t=q(e,u,t,s,!0)),()=>t;if(r){if(!u.length)return t;if(s===void 0)return[...e.childNodes];let f=u[0],a=[f];for(;(f=f.nextSibling)!==s;)a.push(f);return t=a}if(u.length===0){if(t=$(e,t,s),l)return t}else d?t.length===0?de(e,u,s):st(e,t,u):(t&&$(e),de(e,u));t=u}else if(n.nodeType){if(r&&n.parentNode)return t=l?[n]:n;if(Array.isArray(t)){if(l)return t=$(e,t,s,n);$(e,t,null,n)}else t==null||t===""||!e.firstChild?e.appendChild(n):e.replaceChild(n,e.firstChild);t=n}}return t}function J(e,n,t,s){let i=!1;for(let r=0,o=n.length;r<o;r++){let l=n[r],u=t&&t[e.length],d;if(!(l==null||l===!0||l===!1))if((d=typeof l)=="object"&&l.nodeType)e.push(l);else if(Array.isArray(l))i=J(e,l,u)||i;else if(d==="function")if(s){for(;typeof l=="function";)l=l();i=J(e,Array.isArray(l)?l:[l],Array.isArray(u)?u:[u])||i}else e.push(l),i=!0;else{const f=String(l);u&&u.nodeType===3&&u.data===f?e.push(u):e.push(document.createTextNode(f))}}return i}function de(e,n,t=null){for(let s=0,i=n.length;s<i;s++)e.insertBefore(n[s],t)}function $(e,n,t,s){if(t===void 0)return e.textContent="";const i=s||document.createTextNode("");if(n.length){let r=!1;for(let o=n.length-1;o>=0;o--){const l=n[o];if(i!==l){const u=l.parentNode===e;!r&&!o?u?e.replaceChild(i,l):e.insertBefore(i,t):u&&l.remove()}else r=!0}}else e.insertBefore(i,t);return[i]}function he(e,n){const t=e.querySelectorAll("*[data-hk]");for(let s=0;s<t.length;s++){const i=t[s],r=i.getAttribute("data-hk");(!n||r.startsWith(n))&&!c.registry.has(r)&&c.registry.set(r,i)}}function yt(){const e=c.context;return`${e.id}${e.count++}`}const pt=(...e)=>(ze(),dt(...e)),z="Invariant Violation",{setPrototypeOf:mt=function(e,n){return e.__proto__=n,e}}=Object;class te extends Error{framesToPop=1;name=z;constructor(n=z){super(typeof n=="number"?`${z}: ${n} (see https://github.com/apollographql/invariant-packages)`:n),mt(this,te.prototype)}}function Y(e,n){if(!e)throw new te(n)}const bt=/^[A-Za-z]:\//;function xt(e=""){return e&&e.replace(/\\/g,"/").replace(bt,n=>n.toUpperCase())}const wt=/^[/\\]{2}/,Et=/^[/\\](?![/\\])|^[/\\]{2}(?!\.)|^[A-Za-z]:[/\\]/,Ct=/^[A-Za-z]:$/,St=function(e){if(e.length===0)return".";e=xt(e);const n=e.match(wt),t=Q(e),s=e[e.length-1]==="/";return e=$t(e,!t),e.length===0?t?"/":s?"./":".":(s&&(e+="/"),Ct.test(e)&&(e+="/"),n?t?`//${e}`:`//./${e}`:t&&!Q(e)?`/${e}`:e)},He=function(...e){if(e.length===0)return".";let n;for(const t of e)t&&t.length>0&&(n===void 0?n=t:n+=`/${t}`);return n===void 0?".":St(n.replace(/\/\/+/g,"/"))};function $t(e,n){let t="",s=0,i=-1,r=0,o=null;for(let l=0;l<=e.length;++l){if(l<e.length)o=e[l];else{if(o==="/")break;o="/"}if(o==="/"){if(!(i===l-1||r===1))if(r===2){if(t.length<2||s!==2||t[t.length-1]!=="."||t[t.length-2]!=="."){if(t.length>2){const u=t.lastIndexOf("/");u===-1?(t="",s=0):(t=t.slice(0,u),s=t.length-1-t.lastIndexOf("/")),i=l,r=0;continue}else if(t.length>0){t="",s=0,i=l,r=0;continue}}n&&(t+=t.length>0?"/..":"..",s=2)}else t.length>0?t+=`/${e.slice(i+1,l)}`:t=e.slice(i+1,l),s=l-i-1;i=l,r=0}else o==="."&&r!==-1?++r:r=-1}return t}const Q=function(e){return Et.test(e)};function At(e){return`virtual:${e}`}function Tt(e){return e.handler?.endsWith(".html")?Q(e.handler)?e.handler:He(e.root,e.handler):`#vinxi/handler/${e.name}`}const Pt=new Proxy({},{get(e,n){return Y(typeof n=="string","Bundler name should be a string"),{name:n,type:"client",handler:At(Tt({name:n})),baseURL:"/_build",chunks:new Proxy({},{get(t,s){Y(typeof s=="string","Chunk expected");let i=He("/_build",s+".mjs");return{import(){return import(i)},output:{path:i}}}}),inputs:new Proxy({},{get(t,s){Y(typeof s=="string","Input must be string");let i=window.manifest[s].output;return{async import(){return import(i)},async assets(){return window.manifest[s].assets},output:{path:i}}}})}}});globalThis.MANIFEST=Pt;/**
  * @collapsed/core v4.0.1
  *
  * Copyright (c) 2019-2024, Rogin Farrer
  *
  * This source code is licensed under the MIT license found in the
  * LICENSE.md file in the root directory of this source tree.
  *
  * @license MIT
  */function vt(e){if(!e||typeof e=="string")return 0;let n=e/36;return Math.round((4+15*n**.25+n/5)*10)}function It(e,n){let t=performance.now(),s={};function i(){s.id=requestAnimationFrame(r=>{r-t>n?e():i()})}return i(),s}function G(e){e.id&&cancelAnimationFrame(e.id)}var W=new Map;function Ht(e){return W.has(e)||W.set(e,vt(e)),W.get(e)}var Ot=class{#e;frameId;endFrameId;constructor(e){this.#e={easing:"cubic-bezier(0.4, 0, 0.2, 1)",duration:"auto",collapsedHeight:0,onExpandedChange(){},onTransitionStateChange(){},...e}}setOptions(e){this.#e={...this.#e,...e}}#t(){return this.#e.getDisclosureElement()}#n(e){return this.#e.duration==="auto"?Ht(e):this.#e.duration}#s=e=>{let n=()=>{let t=this.#t();t.style.removeProperty("transition"),t.style.height===`${this.#e.collapsedHeight}px`?(this.setCollapsedStyles(),this.frameId=requestAnimationFrame(()=>{this.#e.onTransitionStateChange("collapseEnd")})):(t.style.removeProperty("height"),t.style.removeProperty("overflow"),t.style.removeProperty("display"),this.frameId=requestAnimationFrame(()=>{this.#e.onTransitionStateChange("expandEnd")}))};this.endFrameId&&G(this.endFrameId),this.endFrameId=It(n,e)};getCollapsedStyles(){return{height:`${this.#e.collapsedHeight}px`,overflow:"hidden",display:this.#e.collapsedHeight===0?"none":"block"}}setCollapsedStyles(){let e=this.#t();for(let[n,t]of Object.entries(this.getCollapsedStyles()))e.style.setProperty(n,t)}unsetCollapsedStyles(){let e=this.#t();for(let n of Object.keys(this.getCollapsedStyles()))e.style.removeProperty(n)}open(){let e=this.#t();if(this.#e.onExpandedChange(!0),this.frameId&&cancelAnimationFrame(this.frameId),this.endFrameId&&G(this.endFrameId),ge()){e.style.removeProperty("display"),e.style.removeProperty("height"),e.style.removeProperty("overflow");return}this.frameId=requestAnimationFrame(()=>{this.#e.onTransitionStateChange("expandStart"),e.style.setProperty("display","block"),e.style.setProperty("overflow","hidden"),e.style.setProperty("height",`${this.#e.collapsedHeight}px`),this.frameId=requestAnimationFrame(()=>{this.#e.onTransitionStateChange("expanding");let n=e.scrollHeight,t=this.#n(n);this.#s(t),e.style.transition=`height ${t}ms ${this.#e.easing}`,e.style.height=`${n}px`})})}close(){if(this.#e.onExpandedChange(!1),this.frameId&&cancelAnimationFrame(this.frameId),this.endFrameId&&G(this.endFrameId),ge()){this.setCollapsedStyles();return}this.#e.onTransitionStateChange("collapseStart"),this.frameId=requestAnimationFrame(()=>{let e=this.#t(),n=e.scrollHeight,t=this.#n(n);this.#s(t),e.style.transition=`height ${t}ms ${this.#e.easing}`,e.style.height=`${n}px`,this.frameId=requestAnimationFrame(()=>{this.#e.onTransitionStateChange("collapsing"),e.style.overflow="hidden",e.style.height=`${this.#e.collapsedHeight}px`})})}};function ge(){return window.matchMedia("(prefers-reduced-motion: reduce)").matches}/**
  * @collapsed/solid v0.0.0
  *
  * Copyright (c) 2019-2024, Rogin Farrer
  *
  * This source code is licensed under the MIT license found in the
  * LICENSE.md file in the root directory of this source tree.
  *
  * @license MIT
  */var Nt=Symbol("error");function _t(e){return e instanceof Error?e:new Error(typeof e=="string"?e:"Unknown error",{cause:e})}function Oe(e,n=b){let t=n&&n.context&&n.context[Nt],s=_t(e);if(!t)throw s;try{for(let i of t)i(s)}catch(i){Oe(i,n&&n.owner||null)}}var b=null;function kt(){let e={owner:b,context:b?b.context:null,owned:null,cleanups:null};return b&&(b.owned?b.owned.push(e):b.owned=[e]),e}function v(e,n){return[()=>e,t=>e=typeof t=="function"?t(e):t]}function Lt(e,n){b=kt();try{e(n)}catch(t){Oe(t)}finally{b=b.owner}}function Ft(e,n,t={}){let s=Array.isArray(e),i=t.defer;return()=>{if(i)return;let r;if(s){r=[];for(let o=0;o<e.length;o++)r.push(e[o]())}else r=e();return n(r)}}var jt={};function qt(){let e=jt.context;if(!e)throw new Error("createUniqueId cannot be used under non-hydrating context");return`${e.id}${e.count++}`}function A(...e){let n={};for(let t=0;t<e.length;t++){let s=e[t];if(typeof s=="function"&&(s=s()),s){let i=Object.getOwnPropertyDescriptors(s);for(let r in i)r in n||Object.defineProperty(n,r,{enumerable:!0,get(){for(let o=e.length-1;o>=0;o--){let l,u=e[o];if(typeof u=="function"&&(u=u()),l=(u||{})[r],l!==void 0)return l}}})}}return n}function Mt(e){let n=qt(),[t,s]=v(!1),[i,r]=v(!1),[o,l]=v(),[u,d]=v(),f=A({getDisclosureElement:()=>o(),onExpandedChange(m){s(m),e.onExpandedChange?.(m)},onTransitionStateChange(m){switch(m){case"collapseEnd":case"expandEnd":r(!1);break}e.onTransitionStateChange?.(m)}},e),a=new Ot(f),[p,S]=v(a.getCollapsedStyles());Ft(t,m=>{r(!0),m?a.open():a.close()},{defer:!0}),Lt(()=>{a.setOptions(f),S(a.getCollapsedStyles())});let O=`collapsed-disclosure-${n}`,Ne=m=>{let w=A({disabled:!1},m),ne=u?u()?.tagName==="BUTTON":void 0,N=ke=>{w?.disabled||(Ut(ke,w.onClick),s(Le=>!Le))},B={"aria-controls":O,"aria-expanded":t(),ref:d,onClick:N},se={type:"button",disabled:w?.disabled?!0:void 0},ie={"aria-disabled":w?.disabled?!0:void 0,role:"button",tabIndex:w?.disabled?-1:0};return ne===!1?A(B,ie,w,{onClick:N}):ne===!0?A(B,se,w,{onClick:N}):A(B,ie,se,w,{onClick:N})};function _e(m){return A({id:O},m,{ref:l,style:{boxSizing:"border-box",...!i()&&!t()?p():{}}})}return{get isExpanded(){return t()},setExpanded:s,getToggleProps:Ne,getCollapseProps:_e}}function Ut(e,n){n&&(typeof n=="function"?n(e):n[0](n[1],e))}var Rt=Ae("<main><h1>Hello world!</h1><input type=number><button>Toggle</button><div><p>Hello there</p><p>Hello there</p><p>Hello there</p><p>Hello there</p><p>Hello there</p><p>Hello there</p><p>Hello there</p><p>Hello there</p><p>Hello there</p><p>Hello there</p><p>Hello there</p><p>Hello there");function Dt(){const[e,n]=me(60),t=Mt({get collapsedHeight(){return Number.isNaN(e())?0:e()}});return(()=>{var s=ve(Rt),i=s.firstChild,r=i.nextSibling,o=r.nextSibling,l=o.nextSibling;return r.$$input=u=>n(u.target.valueAsNumber||0),ce(o,oe(()=>t.getToggleProps()),!1),ce(l,oe(()=>t.getCollapseProps()),!1),T(()=>rt(r,"value",e())),ht(),s})()}Te(["input"]);const Bt=e=>null;var Vt=Ae("<span style=font-size:1.5em;text-align:center;position:fixed;left:0px;bottom:55%;width:100%;>");const Kt=e=>{const n="Error | Uncaught Client Exception";return C(We,{fallback:t=>(console.error(t),[(()=>{var s=ve(Vt);return Pe(s,n),s})(),C(Bt,{code:500})]),get children(){return e.children}})};function zt(e,n){return pt(e,n)}function ye(e){return e.children}function Yt(){return C(ye,{get children(){return C(ye,{get children(){return C(Kt,{get children(){return C(Dt,{})}})}})}})}zt(()=>C(Yt,{}),document.getElementById("app"));const Gt=void 0;export{Gt as default};
