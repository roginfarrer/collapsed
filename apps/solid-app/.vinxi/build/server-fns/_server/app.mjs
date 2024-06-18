import{ssr as o,ssrHydrationKey as j,ssrAttribute as M,escape as z,ssrElement as F}from"solid-js/web";import{createSignal as D}from"solid-js";/**
  * @collapsed/core v4.0.1
  *
  * Copyright (c) 2019-2024, Rogin Farrer
  *
  * This source code is licensed under the MIT license found in the
  * LICENSE.md file in the root directory of this source tree.
  *
  * @license MIT
  */function U(e){if(!e||typeof e=="string")return 0;let t=e/36;return Math.round((4+15*t**.25+t/5)*10)}function _(e,t){let n=performance.now(),r={};function s(){r.id=requestAnimationFrame(i=>{i-n>t?e():s()})}return s(),r}function b(e){e.id&&cancelAnimationFrame(e.id)}var x=new Map;function B(e){return x.has(e)||x.set(e,U(e)),x.get(e)}var J=class{#e;frameId;endFrameId;constructor(e){this.#e={easing:"cubic-bezier(0.4, 0, 0.2, 1)",duration:"auto",collapsedHeight:0,onExpandedChange(){},onTransitionStateChange(){},...e}}setOptions(e){this.#e={...this.#e,...e}}#t(){return this.#e.getDisclosureElement()}#n(e){return this.#e.duration==="auto"?B(e):this.#e.duration}#r=e=>{let t=()=>{let n=this.#t();n.style.removeProperty("transition"),n.style.height===`${this.#e.collapsedHeight}px`?(this.setCollapsedStyles(),this.frameId=requestAnimationFrame(()=>{this.#e.onTransitionStateChange("collapseEnd")})):(n.style.removeProperty("height"),n.style.removeProperty("overflow"),n.style.removeProperty("display"),this.frameId=requestAnimationFrame(()=>{this.#e.onTransitionStateChange("expandEnd")}))};this.endFrameId&&b(this.endFrameId),this.endFrameId=_(t,e)};getCollapsedStyles(){return{height:`${this.#e.collapsedHeight}px`,overflow:"hidden",display:this.#e.collapsedHeight===0?"none":"block"}}setCollapsedStyles(){let e=this.#t();for(let[t,n]of Object.entries(this.getCollapsedStyles()))e.style.setProperty(t,n)}unsetCollapsedStyles(){let e=this.#t();for(let t of Object.keys(this.getCollapsedStyles()))e.style.removeProperty(t)}open(){let e=this.#t();if(this.#e.onExpandedChange(!0),this.frameId&&cancelAnimationFrame(this.frameId),this.endFrameId&&b(this.endFrameId),P()){e.style.removeProperty("display"),e.style.removeProperty("height"),e.style.removeProperty("overflow");return}this.frameId=requestAnimationFrame(()=>{this.#e.onTransitionStateChange("expandStart"),e.style.setProperty("display","block"),e.style.setProperty("overflow","hidden"),e.style.setProperty("height",`${this.#e.collapsedHeight}px`),this.frameId=requestAnimationFrame(()=>{this.#e.onTransitionStateChange("expanding");let t=e.scrollHeight,n=this.#n(t);this.#r(n),e.style.transition=`height ${n}ms ${this.#e.easing}`,e.style.height=`${t}px`})})}close(){if(this.#e.onExpandedChange(!1),this.frameId&&cancelAnimationFrame(this.frameId),this.endFrameId&&b(this.endFrameId),P()){this.setCollapsedStyles();return}this.#e.onTransitionStateChange("collapseStart"),this.frameId=requestAnimationFrame(()=>{let e=this.#t(),t=e.scrollHeight,n=this.#n(t);this.#r(n),e.style.transition=`height ${n}ms ${this.#e.easing}`,e.style.height=`${t}px`,this.frameId=requestAnimationFrame(()=>{this.#e.onTransitionStateChange("collapsing"),e.style.overflow="hidden",e.style.height=`${this.#e.collapsedHeight}px`})})}};function P(){return window.matchMedia("(prefers-reduced-motion: reduce)").matches}/**
  * @collapsed/solid v0.0.0
  *
  * Copyright (c) 2019-2024, Rogin Farrer
  *
  * This source code is licensed under the MIT license found in the
  * LICENSE.md file in the root directory of this source tree.
  *
  * @license MIT
  */var K=Symbol("error");function L(e){return e instanceof Error?e:new Error(typeof e=="string"?e:"Unknown error",{cause:e})}function E(e,t=d){let n=t&&t.context&&t.context[K],r=L(e);if(!n)throw r;try{for(let s of n)s(r)}catch(s){E(s,t&&t.owner||null)}}var d=null;function G(){let e={owner:d,context:d?d.context:null,owned:null,cleanups:null};return d&&(d.owned?d.owned.push(e):d.owned=[e]),e}function m(e,t){return[()=>e,n=>e=typeof n=="function"?n(e):n]}function Q(e,t){d=G();try{e(t)}catch(n){E(n)}finally{d=d.owner}}function R(e,t,n={}){let r=Array.isArray(e),s=n.defer;return()=>{if(s)return;let i;if(r){i=[];for(let h=0;h<e.length;h++)i.push(e[h]())}else i=e();return t(i)}}var V={};function W(){let e=V.context;if(!e)throw new Error("createUniqueId cannot be used under non-hydrating context");return`${e.id}${e.count++}`}function u(...e){let t={};for(let n=0;n<e.length;n++){let r=e[n];if(typeof r=="function"&&(r=r()),r){let s=Object.getOwnPropertyDescriptors(r);for(let i in s)i in t||Object.defineProperty(t,i,{enumerable:!0,get(){for(let h=e.length-1;h>=0;h--){let f,c=e[h];if(typeof c=="function"&&(c=c()),f=(c||{})[i],f!==void 0)return f}}})}}return t}function X(e){let t=W(),[n,r]=m(!1),[s,i]=m(!1),[h,f]=m(),[c,A]=m(),v=u({getDisclosureElement:()=>h(),onExpandedChange(l){r(l),e.onExpandedChange?.(l)},onTransitionStateChange(l){switch(l){case"collapseEnd":case"expandEnd":i(!1);break}e.onTransitionStateChange?.(l)}},e),g=new J(v),[H,T]=m(g.getCollapsedStyles());R(n,l=>{i(!0),l?g.open():g.close()},{defer:!0}),Q(()=>{g.setOptions(v),T(g.getCollapsedStyles())});let w=`collapsed-disclosure-${t}`,k=l=>{let p=u({disabled:!1},l),S=c?c()?.tagName==="BUTTON":void 0,y=q=>{p?.disabled||(Y(q,p.onClick),r(N=>!N))},C={"aria-controls":w,"aria-expanded":n(),ref:A,onClick:y},I={type:"button",disabled:p?.disabled?!0:void 0},$={"aria-disabled":p?.disabled?!0:void 0,role:"button",tabIndex:p?.disabled?-1:0};return S===!1?u(C,$,p,{onClick:y}):S===!0?u(C,I,p,{onClick:y}):u(C,$,I,p,{onClick:y})};function O(l){return u({id:w},l,{ref:f,style:{boxSizing:"border-box",...!s()&&!n()?H():{}}})}return{get isExpanded(){return n()},setExpanded:r,getToggleProps:k,getCollapseProps:O}}function Y(e,t){t&&(typeof t=="function"?t(e):t[0](t[1],e))}var a="<p>Hello there</p>",Z=["<main",'><h1>Hello world!</h1><input type="number"',">","","</main>"];function ne(){const[e,t]=D(60),n=X({get collapsedHeight(){return Number.isNaN(e())?0:e()}});return o(Z,j(),M("value",z(e(),!0),!1),F("button",n.getToggleProps(),()=>"Toggle",!1),F("div",n.getCollapseProps(),()=>[o(a),o(a),o(a),o(a),o(a),o(a),o(a),o(a),o(a),o(a),o(a),o(a)],!1))}export{ne as default};