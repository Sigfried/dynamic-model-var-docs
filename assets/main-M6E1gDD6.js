import{i as Ut,p as zn,r as c,j as t,R as xe,a as Qn,g as Gn,E as ie,b as Yt,c as Xt,S as Vn,d as qn,e as Kn,s as Un,w as Yn,f as Xn,h as Zn,m as Jn,k as es,l as ts,M as Qe,u as ns,D as ss,n as os}from"./index-BEl8sHBZ.js";function Zt(e){return[...new Set([...e.classIds,...e.pins])]}const rs=e=>`entity-row:${e}`,as=e=>`entity-checkbox:${e}`,is=e=>`category-row:${e}`,ls=e=>`node-box:${e}`,cs=e=>`child-header:${e}`,ds=(e,n)=>`slot-row:${e}.${n}`,Jt=e=>Ut(e.id)?zn(e.id):e.id,hs=e=>ls(Jt(e)),us=(e,n)=>ds(n.declaringClass??Jt(e),n.slot);function ps({dataService:e,selectedIds:n,onToggle:s,onShowCategory:o}){const r=c.useMemo(()=>e.getCategoryTrees(),[e]),[i,a]=c.useState(new Set),h=l=>a(y=>{const S=new Set(y);return S.has(l)?S.delete(l):S.add(l),S}),d=r.reduce((l,y)=>l+y.classIds.length,0);return t.jsxs("div",{className:"text-sm",children:[t.jsx("div",{className:"flex items-baseline gap-2 px-3 py-2 border-b border-gray-200 dark:border-slate-700",children:t.jsxs("span",{className:"font-semibold flex-1",children:[e.getConceptLabel("entity",!0)," (",d,")"]})}),r.map(l=>{const y=i.has(l.id),S=l.classIds.filter(u=>n.has(u)).length;return t.jsxs("div",{children:[t.jsxs("div",{"data-help-id":is(l.id),className:`w-full flex items-stretch font-medium
                         bg-gray-50 dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700`,children:[t.jsxs("button",{type:"button",onClick:()=>h(l.id),className:`flex-1 min-w-0 flex items-center gap-2 px-3 py-1.5 text-left
                           hover:bg-gray-100 dark:hover:bg-slate-700`,children:[t.jsx("span",{className:"text-xs text-gray-400",children:y?"▶":"▼"}),t.jsx("span",{className:"flex-1 truncate",children:l.label}),S>0&&t.jsxs("span",{className:"text-xs text-gray-400",children:[S," / ",l.classIds.length]})]}),o&&t.jsx("button",{type:"button","data-show-category":l.id,title:`Draw the ${l.label} content view — replaces the canvas`,onClick:()=>o(Zt(l)),className:`px-2.5 shrink-0 text-gray-400 border-l border-gray-100
                             dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700
                             hover:text-blue-600 dark:hover:text-sky-400`,children:"⊞"})]}),!y&&l.roots.map(u=>t.jsx(en,{node:u,depth:0,selectedIds:n,onToggle:s},u.classId))]},l.id)})]})}function en({node:e,depth:n,selectedIds:s,onToggle:o}){const{classId:r}=e;return t.jsxs(t.Fragment,{children:[t.jsxs("label",{"data-class-row":r,"data-help-id":rs(r),className:`flex items-center gap-2 pr-3 py-1 cursor-pointer
                    hover:bg-blue-50 dark:hover:bg-slate-800
                    ${s.has(r)?"bg-blue-50 dark:bg-slate-800":""}`,style:{paddingLeft:`${.75+n*1}rem`},children:[t.jsx("input",{type:"checkbox","data-help-id":as(r),checked:s.has(r),onChange:()=>o(r)}),t.jsxs("span",{className:"flex-1 min-w-0 truncate",children:[t.jsx("span",{className:"font-mono text-xs",children:r}),e.outOfCategoryParent&&t.jsxs("span",{className:"ml-1 text-[10px] text-gray-400 dark:text-slate-500",title:`Extends ${e.outOfCategoryParent}, which is in another category`,children:["↳ ",e.outOfCategoryParent]})]})]}),e.children.map(i=>t.jsx(en,{node:i,depth:n+1,selectedIds:s,onToggle:o},i.classId))]})}function gs({dataService:e,selectedIds:n,onToggle:s,onShowDetail:o}){const r=c.useMemo(()=>e.getContainmentNodes(),[e]),i=c.useMemo(()=>e.getEntityColumns(),[e]),a=c.useMemo(()=>{const h=new Map;for(const d of r){const l=e.getRangeCountsByType(d.id);h.set(d.id,{props:e.getSlotCount(d.id),cls:l.cls,vars:e.getVariableCount(d.id)})}return h},[r,e]);return t.jsxs("div",{className:"text-sm selection-tree",children:[t.jsxs("div",{className:"flex items-baseline gap-2 px-3 py-2 border-b border-gray-200 dark:border-slate-700",children:[t.jsxs("span",{className:"font-semibold flex-1",children:[e.getConceptLabel("entity",!0)," (",r.length,")"]}),t.jsxs("span",{className:"flex items-center gap-1 text-[10px] uppercase tracking-wide shrink-0",children:[t.jsx("span",{className:"text-gray-500",title:i.props.tip,children:i.props.header}),t.jsx("span",{style:{color:xe.entity},title:i.cls.tip,children:i.cls.header}),t.jsx("span",{style:{color:xe.variable},title:i.vars.tip,children:i.vars.header})]})]}),t.jsx(Qn,{nodes:r,selected:[...n],levelsExpanded:0,renderRow:({node:h,isSelected:d})=>{const l=a.get(h.id);return t.jsxs("span",{className:`flex items-center gap-2 flex-1 min-w-0 px-1 rounded
                          ${d?"bg-blue-100 dark:bg-sky-900/50":""}`,children:[t.jsx("input",{type:"checkbox",checked:d,title:`${d?"Remove":"Add"} ${h.id} ${d?"from":"to"} the canvas`,onClick:y=>y.stopPropagation(),onChange:y=>{y.stopPropagation(),s(h.id)}}),t.jsx("button",{type:"button",title:`Show details for ${h.id}`,onClick:y=>{y.stopPropagation(),o?.(h.id)},className:`font-mono text-xs flex-1 min-w-0 truncate text-left
                            hover:underline ${d?"font-semibold":""}`,children:h.name??h.id}),l&&t.jsxs("span",{className:"flex items-center gap-1 shrink-0 tabular-nums",children:[t.jsx(ot,{n:l.props,title:i.props.tip,className:"text-gray-500"}),t.jsx(ot,{n:l.cls,title:i.cls.tip,color:xe.entity}),t.jsx(ot,{n:l.vars,title:i.vars.tip,color:xe.variable})]})]})}})]})}function ot({n:e,title:n,className:s,color:o}){const r=e===0;return t.jsx("span",{title:n,"data-count-badge":"",className:`w-5 text-right text-[11px] ${r?"text-gray-300 dark:text-slate-600":s??""}`,style:!r&&o?{color:o}:void 0,children:r?"·":e})}function Ge(e){throw new Error('Could not dynamically require "'+e+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var rt={exports:{}},$t;function ms(){return $t||($t=1,(function(e,n){(function(s){e.exports=s()})(function(){return(function(){function s(o,r,i){function a(l,y){if(!r[l]){if(!o[l]){var S=typeof Ge=="function"&&Ge;if(!y&&S)return S(l,!0);if(h)return h(l,!0);var u=new Error("Cannot find module '"+l+"'");throw u.code="MODULE_NOT_FOUND",u}var x=r[l]={exports:{}};o[l][0].call(x.exports,function(k){var g=o[l][1][k];return a(g||k)},x,x.exports,s,o,r,i)}return r[l].exports}for(var h=typeof Ge=="function"&&Ge,d=0;d<i.length;d++)a(i[d]);return a}return s})()({1:[function(s,o,r){Object.defineProperty(r,"__esModule",{value:!0}),r.default=void 0;function i(u){"@babel/helpers - typeof";return i=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(x){return typeof x}:function(x){return x&&typeof Symbol=="function"&&x.constructor===Symbol&&x!==Symbol.prototype?"symbol":typeof x},i(u)}function a(u,x){if(!(u instanceof x))throw new TypeError("Cannot call a class as a function")}function h(u,x){for(var k=0;k<x.length;k++){var g=x[k];g.enumerable=g.enumerable||!1,g.configurable=!0,"value"in g&&(g.writable=!0),Object.defineProperty(u,l(g.key),g)}}function d(u,x,k){return x&&h(u.prototype,x),Object.defineProperty(u,"prototype",{writable:!1}),u}function l(u){var x=y(u,"string");return i(x)=="symbol"?x:x+""}function y(u,x){if(i(u)!="object"||!u)return u;var k=u[Symbol.toPrimitive];if(k!==void 0){var g=k.call(u,x);if(i(g)!="object")return g;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(u)}r.default=(function(){function u(){var x=this,k=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},g=k.defaultLayoutOptions,m=g===void 0?{}:g,f=k.algorithms,w=f===void 0?["layered","stress","mrtree","radial","force","disco","sporeOverlap","sporeCompaction","rectpacking"]:f,E=k.workerFactory,C=k.workerUrl;if(a(this,u),this.defaultLayoutOptions=m,this.initialized=!1,typeof C>"u"&&typeof E>"u")throw new Error("Cannot construct an ELK without both 'workerUrl' and 'workerFactory'.");var A=E;typeof C<"u"&&typeof E>"u"&&(A=function(B){return new Worker(B)});var M=A(C);if(typeof M.postMessage!="function")throw new TypeError("Created worker does not provide the required 'postMessage' function.");this.worker=new S(M),this.worker.postMessage({cmd:"register",algorithms:w}).then(function(L){return x.initialized=!0}).catch(console.err)}return d(u,[{key:"layout",value:function(k){var g=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},m=g.layoutOptions,f=m===void 0?this.defaultLayoutOptions:m,w=g.logging,E=w===void 0?!1:w,C=g.measureExecutionTime,A=C===void 0?!1:C;return k?this.worker.postMessage({cmd:"layout",graph:k,layoutOptions:f,options:{logging:E,measureExecutionTime:A}}):Promise.reject(new Error("Missing mandatory parameter 'graph'."))}},{key:"knownLayoutAlgorithms",value:function(){return this.worker.postMessage({cmd:"algorithms"})}},{key:"knownLayoutOptions",value:function(){return this.worker.postMessage({cmd:"options"})}},{key:"knownLayoutCategories",value:function(){return this.worker.postMessage({cmd:"categories"})}},{key:"terminateWorker",value:function(){this.worker&&this.worker.terminate()}}])})();var S=(function(){function u(x){var k=this;if(a(this,u),x===void 0)throw new Error("Missing mandatory parameter 'worker'.");this.resolvers={},this.worker=x,this.worker.onmessage=function(g){setTimeout(function(){k.receive(k,g)},0)}}return d(u,[{key:"postMessage",value:function(k){var g=this.id||0;this.id=g+1,k.id=g;var m=this;return new Promise(function(f,w){m.resolvers[g]=function(E,C){E?(m.convertGwtStyleError(E),w(E)):f(C)},m.worker.postMessage(k)})}},{key:"receive",value:function(k,g){var m=g.data,f=k.resolvers[m.id];f&&(delete k.resolvers[m.id],m.error?f(m.error):f(null,m.data))}},{key:"terminate",value:function(){this.worker&&this.worker.terminate()}},{key:"convertGwtStyleError",value:function(k){if(k){var g=k.__java$exception;g&&(g.cause&&g.cause.backingJsObject&&(k.cause=g.cause.backingJsObject,this.convertGwtStyleError(k.cause)),delete k.__java$exception)}}}])})()},{}],2:[function(s,o,r){var i=s("./elk-api.js").default;Object.defineProperty(o.exports,"__esModule",{value:!0}),o.exports=i,i.default=i},{"./elk-api.js":1}]},{},[2])(2)})})(rt)),rt.exports}var fs=ms();const ys=Gn(fs),xs="/dynamic-model-var-docs/assets/elk-worker.min-r_yRvuMO.js";class bs{elk=null;ensure(){return this.elk||(this.elk=new ys({workerUrl:xs})),this.elk}async layout(n,s={}){const{direction:o="DOWN",nodeSpacing:r=32,layerSpacing:i=56,usePartitions:a=!1,extraLayoutOptions:h={}}=s,d={id:"root",layoutOptions:{"elk.algorithm":"layered","elk.direction":o,"elk.spacing.nodeNode":String(r),"elk.layered.spacing.nodeNodeBetweenLayers":String(i),"elk.edgeRouting":"ORTHOGONAL","elk.layered.considerModelOrder.strategy":"NODES_AND_EDGES",...a?{"elk.partitioning.activate":"true"}:{},...h},children:n.nodes.map(m=>({id:m.id,width:m.width,height:m.height,...m.ports?.length?{ports:m.ports.map(f=>({id:f.id,x:f.x,y:f.y,width:0,height:0}))}:{},...a&&m.partition!==void 0||m.ports?.length?{layoutOptions:{...a&&m.partition!==void 0?{"elk.partitioning.partition":String(m.partition)}:{},...m.ports?.length?{"elk.portConstraints":"FIXED_POS"}:{}}}:{}})),edges:n.edges.filter(m=>m.source!==m.target).map(m=>({id:m.id,sources:[m.sourcePort??m.source],targets:[m.targetPort??m.target]}))},l=new Map(n.edges.map(m=>[m.id,m]));this.elk;const y=performance.now(),S=await this.ensure().layout(d);performance.now()-y,n.nodes.length,n.edges.length;const u=(S.children??[]).map(m=>({id:m.id,x:m.x??0,y:m.y??0,width:m.width??0,height:m.height??0})),x=(S.edges??[]).map(m=>{const f=l.get(m.id);if(!f)throw new Error(`ELK returned unknown edge id: ${m.id}`);return{id:m.id,source:f.source,target:f.target,sections:m.sections}}),k=Math.max(0,...u.map(m=>m.x+m.width)),g=Math.max(0,...u.map(m=>m.y+m.height));return{nodes:u,edges:x,width:k,height:g}}cancel(){this.elk&&(this.elk.terminateWorker(),this.elk=null)}dispose(){this.cancel()}}function Ve(e){if(!e?.length)return[];const n=e[0];return[n.startPoint,...n.bendPoints??[],n.endPoint]}function Lt(e,n,s){const o=n.x-e.x,r=n.y-e.y,i=Math.hypot(o,r);if(i<1e-6)return{...e};const a=Math.min(s,i/2)/i;return{x:e.x+o*a,y:e.y+r*a}}function ws(e,n){if(e.length<2)return vs(e);let s=`M${e[0].x},${e[0].y}`;for(let r=1;r<e.length-1;r++){const i=Lt(e[r],e[r-1],n),a=Lt(e[r],e[r+1],n);s+=`L${i.x},${i.y}Q${e[r].x},${e[r].y} ${a.x},${a.y}`}const o=e[e.length-1];return`${s}L${o.x},${o.y}`}function vs(e){return e.length?e.map((n,s)=>`${s===0?"M":"L"}${n.x},${n.y}`).join(""):""}function ks(e,n){let s=0,o=e.length-1,r=e[e.length-1];for(let i=e.length-1;i>0;i--){const a=Math.hypot(e[i].x-e[i-1].x,e[i].y-e[i-1].y);if(s+a>=n){const h=(n-s)/a;r={x:e[i].x+(e[i-1].x-e[i].x)*h,y:e[i].y+(e[i-1].y-e[i].y)*h},o=i-1;break}s+=a,o=i-1}return{cut:o,cutPoint:r}}function Ss(e,n,s,o){if(e.length<2||s<=0)return o(e);const{cut:r,cutPoint:i}=ks(e,s),a=e.slice(0,r+1),h=a[a.length-1],d=h&&Math.abs(h.x-i.x)<1e-6&&Math.abs(h.y-i.y)<1e-6;return o([...a,...d?[]:[i],n])}function Cs(e,n=1.5){if(e.length<3)return e;const s=[e[0]];for(let o=1;o<e.length-1;o++){const r=s[s.length-1],i=e[o],a=e[o+1],h=a.x-r.x,d=a.y-r.y,l=Math.hypot(h,d);(l<1e-6?Math.hypot(i.x-r.x,i.y-r.y):Math.abs(d*i.x-h*i.y+a.x*r.y-a.y*r.x)/l)>n&&s.push(i)}return s.push(e[e.length-1]),s}function js(e,n,s,o){const r=Math.hypot(n.x,n.y)||1,i=n.x/r,a=n.y/r,h=-a,d=i,l=s/2,y={x:e.x+h*l,y:e.y+d*l},S={x:e.x-h*l,y:e.y-d*l},u={x:e.x+i*o,y:e.y+a*o};return`M${y.x},${y.y}L${u.x},${u.y}L${S.x},${S.y}Z`}function Es(e,n,s,o,r=16){const i={x:e.x+s.x*r,y:e.y+s.y*r},a={x:n.x+o.x*r,y:n.y+o.y*r},h=[e,i];if(Math.abs(s.x)>.5){const d=(i.x+a.x)/2;Math.abs(i.y-a.y)>.5&&h.push({x:d,y:i.y},{x:d,y:a.y})}else{const d=(i.y+a.y)/2;Math.abs(i.x-a.x)>.5&&h.push({x:i.x,y:d},{x:a.x,y:d})}return h.push(a,n),Cs(h)}function Ns(e,n={}){const s=c.useRef(null);s.current||(s.current=new bs);const[o,r]=c.useState(null),[i,a]=c.useState(!1),h=JSON.stringify(n);c.useEffect(()=>{const S=s.current;if(!e||e.nodes.length===0){r(null),a(!1);return}let u=!1;return a(!0),S.layout(e,JSON.parse(h)).then(x=>{u||(r({spec:e,layout:x}),a(!1))},x=>{u||(a(!1),console.error("graph-core layout failed:",x))}),()=>{u=!0,S.cancel()}},[e,h]),c.useEffect(()=>()=>s.current?.dispose(),[]);const d=!!e&&e.nodes.length>0,l=o&&o.spec===e?o.layout:null,y=o&&o.spec!==e?o:null;return{layout:l,inProgress:(i||!l)&&d,previous:y}}const Ts=3e3,Ms=1e3,Os=500,As=1e3,Ps=600,Ds=120,Rs=200,$s=50,Ls=()=>typeof window<"u"&&typeof window.matchMedia=="function"&&window.matchMedia("(prefers-reduced-motion: reduce)").matches,He=e=>()=>Ls()?0:e,tn=He(Ts),It=He(Ms),Is=He(Os),_s=He(As),Bs=He(Ps),qe=()=>Ds;function Hs(e={}){const{min:n=.2,max:s=2}=e,o=c.useRef(null),r=c.useRef(null),i=c.useRef(null),a=c.useRef(1),h=c.useRef({w:0,h:0}),d=c.useRef(null),l=c.useRef(null),y=c.useRef(!0),S=c.useRef(!0),u=c.useCallback(w=>{const E=r.current;E&&(E.style.transition=w?`width ${w}ms, height ${w}ms`:"",E.style.width=`${h.current.w*a.current}px`,E.style.height=`${h.current.h*a.current}px`)},[]),x=c.useCallback((w,E)=>{a.current=Math.min(s,Math.max(n,w));const C=E?tn():0;d.current&&cancelAnimationFrame(d.current),d.current=requestAnimationFrame(()=>{d.current=null;const A=i.current;A&&(A.style.transition=C?`transform ${C}ms`:"",A.style.transform=`scale(${a.current})`)}),l.current&&(clearTimeout(l.current),l.current=null),C?u(C):l.current=setTimeout(()=>{l.current=null,u(0)},100)},[n,s,u]),k=c.useCallback((w,E=!0)=>{y.current=!1,x(w,E)},[x]),g=c.useCallback(w=>k(a.current*w),[k]),m=c.useCallback((w,E)=>{h.current={w,h:E};const C=i.current;C&&(C.style.width=`${w}px`,C.style.height=`${E}px`,C.style.transformOrigin="0 0",C.style.transform=`scale(${a.current})`),u(0)},[u]),f=c.useCallback(()=>{const w=o.current,{w:E,h:C}=h.current;if(!w||!E||!C)return;y.current=!0;const A=!S.current;S.current=!1,x(Math.min(w.clientWidth/E,w.clientHeight/C,1),A),requestAnimationFrame(()=>{typeof w.scrollTo=="function"?w.scrollTo({left:0,top:0,behavior:A?"smooth":"auto"}):(w.scrollLeft=0,w.scrollTop=0)})},[x]);return c.useEffect(()=>{const w=o.current;if(!w)return;const E=C=>{!C.ctrlKey&&!C.metaKey||(C.preventDefault(),k(a.current*(1-C.deltaY*.005),!1))};return w.addEventListener("wheel",E,{passive:!1}),()=>w.removeEventListener("wheel",E)},[k]),c.useEffect(()=>{const w=o.current;if(!w)return;let E=!1,C=0,A=0,M=0,L=0,B=!1;const G=O=>O instanceof Element&&!O.closest("[data-pan-ignore]"),K=O=>{O.button!==0||!G(O.target)||(E=!0,B=!1,C=O.clientX,A=O.clientY,M=w.scrollLeft,L=w.scrollTop,w.style.cursor="grabbing")},V=O=>{if(!E)return;const U=O.clientX-C,q=O.clientY-A;!B&&Math.hypot(U,q)<3||(B||(B=!0,w.setPointerCapture(O.pointerId)),O.preventDefault(),w.scrollLeft=M-U,w.scrollTop=L-q)},$=O=>{E&&(E=!1,w.style.cursor="",w.hasPointerCapture(O.pointerId)&&w.releasePointerCapture(O.pointerId))};return w.addEventListener("pointerdown",K),w.addEventListener("pointermove",V),w.addEventListener("pointerup",$),w.addEventListener("pointercancel",$),()=>{w.removeEventListener("pointerdown",K),w.removeEventListener("pointermove",V),w.removeEventListener("pointerup",$),w.removeEventListener("pointercancel",$)}},[]),{containerRef:o,spacerRef:r,wrapperRef:i,applyZoom:k,zoomBy:g,zoomToFit:f,getZoom:()=>a.current,isAutoFit:()=>y.current,setContentSize:m}}const Fs=2;function nn({kind:e,width:n=44,className:s}){const o=c.useId().replace(/:/g,""),r=e==="association"?ie.association:e==="own-bkwd"?ie.ownBkwd:ie.ownFwd,i=e==="own-bkwd",a=e==="association",h=`es-${o}`,d=a?6:1,l=n-6;return t.jsxs("svg",{width:n,height:"14",viewBox:`0 0 ${n} 14`,className:`shrink-0 ${s??""}`,"aria-hidden":!0,children:[t.jsx("defs",{children:t.jsx("marker",{id:h,markerWidth:"5",markerHeight:"5",refX:i?.5:4.5,refY:"2.5",orient:"auto-start-reverse",markerUnits:"userSpaceOnUse",children:t.jsx("path",{d:i?"M5,0 L0,2.5 L5,5 z":"M0,0 L5,2.5 L0,5 z",fill:r})})}),t.jsx("line",{x1:d,y1:"7",x2:l,y2:"7",stroke:r,strokeWidth:Fs,strokeDasharray:e==="association"?"5 4":void 0,markerStart:a?`url(#${h})`:void 0,markerEnd:`url(#${h})`})]})}const sn={"owned-mine":{side:"left",kind:"own-bkwd"},"owned-theirs":{side:"left",kind:"own-fwd"},"owns-mine":{side:"right",kind:"own-fwd"},"owns-theirs":{side:"right",kind:"own-bkwd"},association:{side:"left",kind:"association"}},Ws=300,ft=new Set;let Ie;function kt(){Ie!==void 0&&(clearTimeout(Ie),Ie=void 0)}function $e(e){kt();for(const n of ft)n(e)}function on(){kt(),Ie=setTimeout(()=>{Ie=void 0,$e(null)},Ws)}function zs({label:e,rows:n,onAdd:s,onRemove:o,onInspect:r,colorOf:i,slotOrder:a}){const[h,d]=c.useState(null),[l,y]=c.useState(null),S=c.useRef(null),u=c.useRef(null),x=c.useId();c.useEffect(()=>{const C=A=>{A!==x&&(d(null),y(null))};return ft.add(C),()=>{ft.delete(C)}},[x]),c.useEffect(()=>{if(!h)return;const C=M=>{M.target?.closest("[data-relation-bar]")||$e(null)},A=M=>{M.key==="Escape"&&$e(null)};return document.addEventListener("mousedown",C,!0),document.addEventListener("keydown",A),()=>{document.removeEventListener("mousedown",C,!0),document.removeEventListener("keydown",A)}},[h]);const k=C=>n.filter(A=>sn[A.position].side===C),g=C=>new Set(k(C).map(A=>A.other)).size,m=g("left"),f=g("right");if(m===0&&f===0)return null;const w=(C,A)=>{const M=A?.getBoundingClientRect();M&&($e(x),d(C),y({x:M.left,y:M.bottom+2}))},E=(C,A,M)=>{const L=h===C;return t.jsx("button",{ref:M,"data-relation-bar":!0,"data-no-drag":!0,disabled:A===0,"aria-label":C==="left"?`${A} classes ${e} belongs to`:`${A} classes ${e} owns`,onMouseEnter:()=>A>0&&w(C,M.current),onMouseLeave:on,onClick:B=>{B.stopPropagation(),A!==0&&(L?$e(null):w(C,M.current))},className:`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] leading-none
                    tabular-nums transition-colors
                    ${A===0?"text-gray-300 dark:text-slate-600 cursor-default":L?"bg-sky-200 dark:bg-sky-800 text-sky-900 dark:text-sky-100":"text-sky-800 dark:text-sky-200 hover:bg-sky-100 dark:hover:bg-sky-900"}`,children:C==="left"?t.jsxs(t.Fragment,{children:[t.jsx("span",{"aria-hidden":!0,children:"←"}),A]}):t.jsxs(t.Fragment,{children:[A,t.jsx("span",{"aria-hidden":!0,children:"→"})]})})};return t.jsxs(t.Fragment,{children:[E("left",m,S),t.jsx("span",{className:`flex-1 min-w-0 text-center text-[9px] text-gray-400
                       dark:text-slate-500 truncate select-none`,children:"related"}),E("right",f,u),h&&l&&Yt.createPortal(t.jsx(Gs,{anchor:l,side:h,label:e,rows:k(h),onAdd:s,onRemove:o,onInspect:r,colorOf:i,slotOrder:a}),document.body)]})}function Qs(e){const n=c.useRef(null),[s,o]=c.useState(e);return c.useEffect(()=>{const r=n.current;if(!r)return;const i=r.getBoundingClientRect(),a=8;o({x:Math.max(a,Math.min(e.x,window.innerWidth-i.width-a)),y:Math.max(a,Math.min(e.y,window.innerHeight-i.height-a))})},[e]),{ref:n,pos:s}}function Gs({anchor:e,side:n,label:s,rows:o,onAdd:r,onRemove:i,onInspect:a,colorOf:h,slotOrder:d}){const{ref:l,pos:y}=Qs(e),S=g=>{const m=d?.indexOf(g.slot)??-1;return m===-1?Number.MAX_SAFE_INTEGER:m},u=[...o].sort((g,m)=>S(g)-S(m)||g.other.localeCompare(m.other)||g.slot.localeCompare(m.slot)),x=u.every(g=>g.drawn),k=[...new Set(u.map(g=>g.other))];return t.jsxs("div",{ref:l,"data-relation-bar":!0,onMouseEnter:kt,onMouseLeave:on,style:{left:y.x,top:y.y},className:`fixed z-50 w-max max-w-[min(46rem,calc(100vw-2rem))] max-h-[60vh]
                 overflow-y-auto overflow-x-hidden py-1
                 rounded-md border border-gray-300 dark:border-slate-600
                 bg-white dark:bg-slate-800 shadow-xl
                 text-gray-900 dark:text-gray-100`,children:[t.jsx("div",{className:"px-3 py-1 border-b border-gray-200 dark:border-slate-700",children:t.jsxs("div",{className:"text-[11px] font-semibold",children:[t.jsx("b",{children:s})," ",n==="left"?"belongs to":"owns"," ",k.length," ",k.length===1?"entity":"distinct entities",u.length!==k.length&&t.jsxs("span",{className:"font-normal text-gray-500 dark:text-slate-400",children:[" ","through ",u.length," attributes"]})]})}),t.jsx("button",{onClick:()=>k.forEach(g=>x?i(g):r(g)),className:`block w-full text-left px-3 py-1 text-[11px]
                   text-blue-600 dark:text-blue-400
                   hover:bg-gray-100 dark:hover:bg-slate-700`,children:x?`hide all ${k.length} entities`:`add all ${k.length} entities`}),t.jsx("table",{className:"w-full text-[11px]",children:t.jsx("tbody",{children:u.map(g=>{const m=sn[g.position].kind,f=g.declaredBy===g.other?s:g.declaredBy,w=n==="left"?g.other:f,E=n==="left"?f:g.other;return t.jsxs("tr",{className:"hover:bg-gray-100 dark:hover:bg-slate-700",children:[t.jsx("td",{className:"pl-2 pr-1 py-0.5",children:t.jsx("button",{onClick:C=>{C.stopPropagation(),(g.drawn?i:r)(g.other)},"aria-label":g.drawn?`Remove ${g.other} from the diagram`:`Add ${g.other} to the diagram`,className:`w-4 h-4 rounded-sm leading-none text-[11px]
                                flex items-center justify-center border
                                ${g.drawn?"border-sky-300 bg-sky-50 text-sky-700 hover:bg-sky-200 dark:border-sky-700 dark:bg-sky-950 dark:text-sky-300":"border-gray-300 text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:border-slate-600 dark:hover:bg-slate-600"}`,children:g.drawn?"−":"+"})}),t.jsx("td",{className:"pl-1 pr-2 py-0.5 text-right whitespace-nowrap",children:t.jsx(_t,{cls:w,row:g,colorOf:h,onInspect:a})}),t.jsx("td",{className:`px-2 py-0.5 font-mono text-gray-400 dark:text-slate-500
                               whitespace-nowrap tabular-nums text-right`,children:g.cardinality}),t.jsx("td",{className:"px-1 py-0.5 align-middle",children:t.jsx(nn,{kind:m,width:30})}),t.jsx("td",{className:"pr-3 py-0.5 whitespace-nowrap",children:t.jsx(_t,{cls:E,row:g,colorOf:h,onInspect:a})})]},`${g.declaredBy}.${g.slot}->${g.other}`)})})})]})}function _t({cls:e,row:n,colorOf:s,onInspect:o}){const r=s?.(e),i=e===n.declaredBy,a=r?{color:r.text}:void 0;return t.jsxs("span",{className:"font-mono",children:[o?t.jsx("button",{onClick:h=>{h.stopPropagation(),o(e)},title:`Open ${e}'s details`,className:"hover:underline",style:a,children:e}):t.jsx("span",{style:a,children:e}),i&&t.jsxs("span",{className:r?"opacity-80":"text-gray-500 dark:text-slate-400",style:a,children:[".",n.slot]})]})}const pe={sibs:!0,dir:"RIGHT",merge:"near",legend:!1,cases:!1},rn=["legend","cases"];function Vs(e,n){if(e.get("panels")!=="0")return n;for(const s of rn)n[s]=!1;return n.detail=null,n}const Le={dir:"explore-nl-dir",merge:"explore-nl-merge",sibs:"explore-nl-sibs"},Xe="~",qs=["exp","hidden","owners"],Ks=["tour"];let _e;function Us(e=window.location.search){return _e===void 0&&(_e=new URLSearchParams(e).get("tour")==="1"),_e}function Ys(e,n){const s=e.get(n);return s?s.split(Xe).filter(Boolean):[]}function an(e){const n=e.get("cat");if(!n)return[];const s=n.split(new RegExp(`[,${Xe}]`)).filter(Boolean);return[...new Set(s.flatMap(o=>{const r=Xt.find(i=>i.id===o);return r?Zt(r):[]}))]}function Ke(e){try{return localStorage.getItem(e)}catch{return null}}function Xs(e,n){try{localStorage.setItem(e,n)}catch{}}function Ue(e,n){return e&&n.includes(e)?e:null}function fe(e=window.location.search){const n=new URLSearchParams(e),s=Ue(n.get("dir"),["RIGHT","DOWN"])??Ue(Ke(Le.dir),["RIGHT","DOWN"])??pe.dir,o=Ue(n.get("merge"),["near","far","bend","off"])??Ue(Ke(Le.merge),["near","far","bend","off"])??pe.merge,r=n.has("sibs")?n.get("sibs")==="1":Ke(Le.sibs)!==null?Ke(Le.sibs)!=="0":pe.sibs,i=Ys(n,"sel"),a=Vs(n,{legend:n.get("legend")==="1",cases:n.get("cases")==="1",detail:n.get("detail")||null});return n.has("legend")&&(a.legend=n.get("legend")==="1"),n.has("cases")&&(a.cases=n.get("cases")==="1"),n.has("detail")&&(a.detail=n.get("detail")||null),{sel:i.length?i:an(n),detail:a.detail,roots:n.get("roots")==="1",sibs:r,dir:s,merge:o,legend:a.legend,cases:a.cases}}function ln(e,{push:n=!1}={}){const s=new URL(window.location.href),o=s.searchParams,r=(a,h)=>{h.length===0?o.delete(a):o.set(a,[...h].sort().join(Xe))},i=(a,h,d)=>{d?o.delete(a):o.set(a,h)};for(const a of qs)o.delete(a);_e===void 0&&o.has("tour")&&(_e=o.get("tour")==="1");for(const a of Ks)o.delete(a);r("sel",e.sel),e.detail?o.set("detail",e.detail):o.delete("detail"),i("roots","1",!e.roots),i("sibs",e.sibs?"1":"0",e.sibs===pe.sibs),i("dir",e.dir,e.dir===pe.dir),i("merge",e.merge,e.merge===pe.merge),i("legend","1",e.legend===pe.legend),i("cases","1",e.cases===pe.cases),o.delete("panels"),o.delete("cat"),n?window.history.pushState(null,"",s):window.history.replaceState(null,"",s)}function at(e,n){Xs(Le[e],typeof n=="boolean"?n?"1":"0":String(n))}function Zs(e,n=window.location.href){const s=new URL(n),o=new URLSearchParams,r=(i,a)=>o.set(i,a);return e.sel.length&&r("sel",[...e.sel].sort().join(Xe)),e.detail&&r("detail",e.detail),e.roots&&r("roots","1"),e.sibs!==pe.sibs&&r("sibs",e.sibs?"1":"0"),e.dir!==pe.dir&&r("dir",e.dir),e.merge!==pe.merge&&r("merge",e.merge),e.legend!==pe.legend&&r("legend","1"),e.cases!==pe.cases&&r("cases","1"),s.search=o.toString(),s.toString()}const de=240,Se=30,Ce=20,Js=1/0,St=22,cn=18,Ne=28;function dn(e,n,s=()=>!1){const o=new Map;for(const r of e){if(s(r.other))continue;const i=r.position,a=o.get(i)??new Map,h=a.get(r.other)??[];h.includes(r.slot)||h.push(r.slot),a.set(r.other,h),o.set(i,a)}return Xn.filter(r=>o.has(r)).map(r=>{const i=[...o.get(r)].map(([a,h])=>({other:a,slots:h,drawn:n(a)})).sort((a,h)=>a.other.localeCompare(h.other));return{position:r,label:Zn(r,i.length),items:i}})}function hn(e,n,s=()=>!1){const o=new Set,r=[];for(const i of e){if(s(i.other))continue;const a=`${i.declaredBy}.${i.slot}->${i.other}:${i.position}`;o.has(a)||(o.add(a),r.push({other:i.other,position:i.position,slot:i.slot,declaredBy:i.declaredBy,cardinality:i.cardinality,drawn:n(i.other)}))}return r}function J(e){return e.storageDirection==="flipped"?e.target:e.source}function yt(e){return e.anchorClass??J(e)}function eo(e,n,s,o,r){const i=new Map,a=new Map,h=[],d=new Set;for(const u of e.edges)u.type==="isa"?(i.set(u.target,[...i.get(u.target)??[],u.source]),a.set(u.source,(a.get(u.source)??0)+1)):u.isLoop||(h.push(u),d.add(`${J(u)}|${u.slotName}`));const l=new Set(e.nodes.map(u=>u.id)),y=e.nodes.map(u=>{const x=new Map(s(u.id).map((O,U)=>[O.name,U])),k=(O,U)=>(x.get(O.slot)??Number.MAX_SAFE_INTEGER)-(x.get(U.slot)??Number.MAX_SAFE_INTEGER),g=u.slots.map(O=>({...O,connected:O.isLoop||d.has(`${u.id}|${O.slot}`),rangeColor:o(O.range),targetColor:r(O.range)})).sort(k),m=new Set(g.map(O=>O.slot)),f=s(u.id).filter(O=>!m.has(O.name)).map(O=>({slot:O.name,range:O.range,channel:"plain",flipped:!1,cardinality:qn(O.required,O.multivalued),isLoop:!1,connected:!1,rangeColor:o(O.range)})),w=g.filter(O=>O.connected),E=[...g.filter(O=>!O.connected),...f].sort(k),C=[...w,...E].slice(0,Math.max(Js,w.length)),A=C.length===w.length+E.length,M=n.has(u.id)||A,L=M?[...w,...E]:C,B=A?0:w.length+E.length-C.length,G=e.hiddenOwners.get(u.id)??[],K=e.hiddenOwned.get(u.id)??[],V=dn(u.relations,O=>l.has(O),O=>O===u.id),$=hn(u.relations,O=>l.has(O),O=>O===u.id);return{...u,isaParents:i.get(u.id)??[],subclassCount:a.get(u.id)??0,members:[],hiddenOwners:G,hiddenOwned:K,relationGroups:V,relationRows:$,...un(V),rows:L,allRows:[...w,...E],hiddenCount:B,expanded:M,height:pn(L.length,B,V.length>0)}}),S=new Map;for(const u of h){const x=J(u)===u.source?u.target:u.source,k=r(x);k&&S.set(u.id,k)}return{nodes:y,edges:h,edgeColors:S}}function un(e){const n=new Map;for(const s of e)for(const o of s.items)n.set(o.other,(n.get(o.other)??!1)||o.drawn);return{relatedCount:n.size,shownCount:[...n.values()].filter(Boolean).length}}function pn(e,n,s){return Se+(s?St:0)+e*Ce+(n?cn:0)+(e?5:0)}function to(e,n,s,o,r,i,a){const h=Kn(e.nodes.map(f=>f.id),n,s);if(!h.size)return e;const d=new Map(e.nodes.map(f=>[f.id,f])),l=new Set(e.nodes.map(f=>f.id)),y=new Map,S=[],u=new Map;for(const[f,w]of h){const E=Jn(f),C=w.map(v=>({id:v,label:d.get(v)?.label??v,color:Un(a(v))}));for(const v of C)y.set(v.id,E);const A=d.has(f);A&&y.set(f,E);const M=new Map(C.map(v=>[v.id,v])),L=new Map,B=A?[f,...w]:w;for(const v of B){const D=d.get(v);if(!D)continue;const z=v===f;for(const se of D.allRows){const me=o(v,se.slot),W=me!==void 0&&me!==v,I=`${z||W?me??f:v}|${se.slot}`,Q=L.get(I),Y=M.get(v),R=z||W?Q?.owners??[]:[...Q?.owners??[],...Y?[Y]:[]];L.set(I,{...Q??se,connected:(Q?.connected??!1)||se.connected,owners:R,declaringClass:I.slice(0,I.indexOf("|"))})}}const G=new Map;for(const v of L.values())if(v.targetColor)for(const D of v.owners??[])G.has(D.id)||G.set(D.id,v.targetColor);for(const v of C){const D=G.get(v.id);D&&(v.color=D)}for(const[v,D]of L)D.targetColor&&u.set(`${E}|${v}`,D.targetColor);const K=[...L.values()],V=v=>{const D=v.owners?.length?v.owners[0].id:f;return i(D,v.slot)};K.sort((v,D)=>V(v)-V(D));const $=Yn(K,C,v=>({slot:`::hdr:${v.id}`,range:"",channel:"plain",flipped:!1,cardinality:"",isLoop:!1,connected:!1,rangeColor:"",header:v})),O=v=>!y.has(v)&&!B.includes(v),U=[...new Set(B.flatMap(v=>d.get(v)?.hiddenOwners??[]))].filter(O),q=[...new Set(B.flatMap(v=>d.get(v)?.hiddenOwned??[]))].filter(O),ne=dn(B.flatMap(v=>d.get(v)?.relations??[]),v=>l.has(v),v=>!O(v)),le=hn(B.flatMap(v=>d.get(v)?.relations??[]),v=>l.has(v),v=>!O(v)),ee=d.get(w[0]),ae=r(f);S.push({...ee,id:E,label:f,description:ae.description,abstract:ae.abstract,slots:[],members:C,role:B.some(v=>d.get(v)?.role==="selected")?"selected":"context",layer:Math.min(...B.map(v=>d.get(v)?.layer??0)),isaParents:[],subclassCount:C.length,hiddenOwners:U,hiddenOwned:q,relationGroups:ne,relationRows:le,...un(ne),rows:$,allRows:K,hiddenCount:0,expanded:!0,height:pn($.length,0,ne.length>0)})}const x=[...e.nodes.filter(f=>!y.has(f.id)),...S],k=new Set,g=e.edges.map(f=>({...f,source:y.get(f.source)??f.source,target:y.get(f.target)??f.target,entityMember:(()=>{const w=J(f)===f.source?f.target:f.source;return y.has(w)?w:void 0})(),anchorClass:y.has(J(f))?o(J(f),f.slotName)??J(f):J(f)})).filter(f=>{const w=J(f);if(!Ut(w))return!0;const E=w===f.source?f.target:f.source,C=`${w}|${f.anchorClass}|${f.slotName}|${E}|${f.storageDirection}`;return k.has(C)?!1:(k.add(C),!0)}).filter(f=>f.source!==f.target),m=new Map(e.edgeColors);for(const f of g){const w=u.get(`${J(f)}|${yt(f)}|${f.slotName}`);w&&m.set(f.id,w)}return{nodes:x,edges:g,edgeColors:m}}function no({title:e}){return t.jsxs("svg",{viewBox:"0 0 16 16",width:"15",height:"15","aria-hidden":"false",className:"shrink-0",style:{color:xe.entity},children:[t.jsx("title",{children:e}),t.jsx("path",{d:"M12.33 10.5 A5 5 0 1 1 12.33 5.5",fill:"none",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round"}),t.jsx("path",{d:"M13.7 7.9 L10.6 6.7 L13.7 4.2 Z",fill:"currentColor"})]})}function gn(e){return Se+(e.relationGroups.length>0?St:0)}function mn(e,n,s){const o=e.rows.findIndex(r=>r.slot===n&&!r.header&&(!s||!r.declaringClass||r.declaringClass===s));if(o<0)throw new Error(`No displayed row for ${n} on ${e.id}`);return gn(e)+o*Ce+Ce/2}function so(e,n){const s=e.rows.findIndex(o=>o.header?.id===n);if(!(s<0))return gn(e)+s*Ce+Ce/2}function xt(e,n){if(e.storageDirection==="flipped"||!n.members.length)return;const s=e.entityMember;return s&&n.members.some(o=>o.id===s)?s:void 0}const oo=4,ro=10,fn=12,ve=fn,it=fn*1.5,lt=0,Bt=.85,yn=1.4,xn=2.6,ao=yn*.75,io=xn*.75;function Ht(e,n){return e?n?ie.ownBkwd:ie.ownFwd:ie.association}function ct(e,n){if(e==="off"||n.length<2)return 0;if(e==="near")return 40;if(e==="far")return 120;const s=n[n.length-1],o=n[n.length-2];return Math.hypot(s.x-o.x,s.y-o.y)}function Ft(e,n){return e<2?0:Math.min(oo,n/(e-1))}function lo(e,n){const s=new Map,o=(l,y,S,u)=>{const x=s.get(l.id)??[];return x.some(k=>k.id===y)||(x.push({id:y,x:S,y:u}),s.set(l.id,x)),y},r=new Map(e.nodes.map(l=>[l.id,l])),i=l=>{const y=r.get(J(l)===l.source?l.target:l.source);return!!y&&xt(l,y)!==void 0},a=new Map;for(const l of e.edges){if(i(l))continue;const y=J(l)===l.source?l.target:l.source,S=`${y}|${y===l.source?"out":"in"}`;a.set(S,(a.get(S)??0)+1)}const h=new Map,d=e.edges.map(l=>{const y=r.get(J(l)),S=r.get(J(l)===l.source?l.target:l.source);if(!y||!S)throw new Error(`Edge ${l.id} endpoint missing from subgraph`);const u=l.storageDirection==="flipped",x=mn(y,l.slotName,yt(l)),k=o(y,`${y.id}::row:${yt(l)}|${l.slotName}`,u?0:de,x),g=S.id===l.source,m=`${S.id}|${g?"out":"in"}`,f=xt(l,S),w=f!==void 0?so(S,f):void 0;let E;if(f!==void 0&&w!==void 0)E=o(S,`${S.id}::mhdr:${g?"out":"in"}:${f}`,n==="RIGHT"?g?de:0:de/2,n==="RIGHT"?w:g?S.height:0);else{const C=a.get(m)??1,A=h.get(m)??0;h.set(m,A+1);const M=Ft(C,Se-4),L=Se/2+(A-(C-1)/2)*M;E=n==="RIGHT"?o(S,`${S.id}::hdr:${g?"out":"in"}:${A}`,g?de:0,L):o(S,`${S.id}::hdr:${g?"out":"in"}:${A}`,de/2+(A-(C-1)/2)*Ft(C,de/2),g?S.height:0)}return{id:l.id,source:l.source,target:l.target,sourcePort:u?E:k,targetPort:u?k:E}});return{nodes:e.nodes.map(l=>({id:l.id,width:de,height:l.height,partition:l.layer,ports:s.get(l.id)})),edges:d}}function co(e,n){if(!e?.length)return e;const s=e[0],o=s.bendPoints?.length?s.bendPoints[s.bendPoints.length-1]:s.startPoint,r=s.endPoint.x-o.x,i=s.endPoint.y-o.y,a=Math.hypot(r,i);if(a<1)return e;const h=Math.min(n,a*.8)/a,d={x:s.endPoint.x-r*h,y:s.endPoint.y-i*h};return[{...s,endPoint:d},...e.slice(1)]}function ho(e,n){if(!e?.length)return e;const s=e[0],o=s.bendPoints?.length?s.bendPoints[0]:s.endPoint,r=o.x-s.startPoint.x,i=o.y-s.startPoint.y,a=Math.hypot(r,i);if(a<1)return e;const h=Math.min(n,a*.8)/a,d={x:s.startPoint.x+r*h,y:s.startPoint.y+i*h};return[{...s,startPoint:d},...e.slice(1)]}function uo({dataService:e,selectedIds:n,onNodeClick:s,onAdd:o,onRemove:r,pathToRoot:i=!1,onTogglePathToRoot:a,direction:h,setDirection:d,mergeMode:l,setMergeMode:y,mergeSibs:S,setMergeSibs:u}){const x=c.useId().replace(/[^a-zA-Z0-9]/g,""),k=p=>`${p}-${x}`,[g,m]=c.useState(new Set),f=c.useMemo(()=>e.getOwnershipSubgraph([...n].sort(),{pathToRoot:i}),[e,n,i]),w=c.useCallback(p=>e.getTargetColor(p),[e]),E=c.useMemo(()=>new Map(f.nodes.map(p=>[p.id,e.getClassSummary(p.id)?.slots??[]])),[e,f]),C=c.useMemo(()=>eo(f,g,p=>E.get(p)??[],p=>e.getRangeColor(p),p=>e.getTargetColor(p)),[f,g,E,e]),A=c.useMemo(()=>new Map(f.nodes.map(p=>[p.id,e.getClassSummary(p.id)])),[e,f]),M=c.useMemo(()=>{if(!S)return C;const p=T=>A.get(T)?.parentId,j=T=>!es.has(T),N=(T,_)=>T.range===_.range&&T.multivalued===_.multivalued;return to(C,p,j,(T,_)=>{const F=e.getClassSummary(T)?.slots.find(re=>re.name===_);if(!F)return;if(!F.inheritedFrom)return T;const Z=e.getClassSummary(F.inheritedFrom)?.slots.find(re=>re.name===_);return Z&&N(F,Z)?F.inheritedFrom:T},T=>{const _=e.getClassSummary(T);return{description:_?.description??"",abstract:_?.isAbstract??!1}},(T,_)=>{const F=e.getClassSummary(T)?.slots.findIndex(Z=>Z.name===_)??-1;return F<0?Number.MAX_SAFE_INTEGER:F},T=>e.siblingColorIndexOf(T))},[C,A,S,e]),[L,B]=c.useState(new Map),[G,K]=c.useState(new Map),V=c.useMemo(()=>lo(M,h),[M,h]),{layout:$,inProgress:O,previous:U}=Ns(V,{direction:h,usePartitions:!0,nodeSpacing:28,layerSpacing:72,extraLayoutOptions:{"elk.spacing.edgeNode":"18","elk.spacing.edgeEdge":"12","elk.layered.spacing.edgeNodeBetweenLayers":"18","elk.layered.spacing.edgeEdgeBetweenLayers":"10"}}),q=Hs(),ne=$??U?.layout??null,le=(ne?.width??0)+Ne*2,ee=(ne?.height??0)+Ne*2;c.useEffect(()=>{$&&(q.setContentSize(le,ee),q.isAutoFit()&&q.zoomToFit())},[$,le,ee]),c.useEffect(()=>B(new Map),[$]),c.useEffect(()=>K(new Map),[$]);const ae=c.useRef([]);c.useEffect(()=>{$&&(ae.current=M.nodes)},[$,M]);const v=c.useRef({key:null,pos:new Map,vms:new Map});U&&v.current.key!==U.spec&&(v.current={key:U.spec,pos:new Map(U.layout.nodes.map(p=>[p.id,p])),vms:new Map(ae.current.map(p=>[p.id,p]))});const D=v.current,z=c.useMemo(()=>!$||D.pos.size===0?new Set:new Set($.nodes.filter(p=>!D.pos.has(p.id)).map(p=>p.id)),[$,D]),se=c.useMemo(()=>{const p=new Set(M.nodes.map(j=>j.id));return[...D.vms.values()].filter(j=>!p.has(j.id)&&D.pos.has(j.id))},[D,M]),[me,W]=c.useState(new Set),[I,Q]=c.useState(new Set),Y=[...z].sort().join(),R=se.map(p=>p.id).sort().join();c.useEffect(()=>{if(z.size===0&&se.length===0)return;let p=0;const j=requestAnimationFrame(()=>{p=requestAnimationFrame(()=>{W(new Set(z)),Q(new Set(se.map(N=>N.id)))})});return()=>{cancelAnimationFrame(j),cancelAnimationFrame(p)}},[`${Y}|${R}`]),c.useEffect(()=>{if(se.length===0)return;const p=se.map(N=>N.id),j=setTimeout(()=>{for(const N of p)v.current.vms.delete(N),v.current.pos.delete(N);Q(N=>{const b=new Set(N);for(const P of p)b.delete(P);return b}),X(N=>N+1)},It()+$s);return()=>clearTimeout(j)},[R]);const[,X]=c.useState(0),[te,he]=c.useState(!1);c.useEffect(()=>{if(!$){he(!1);return}const p=Bs();if(p===0){he(!0);return}const j=setTimeout(()=>he(!0),p);return()=>clearTimeout(j)},[$]);const Ln=c.useRef(new Map),Je=c.useRef(!1),Tt=c.useRef(L);Tt.current=L;const be=c.useMemo(()=>{const p=$?.nodes??U?.layout.nodes??[],j=new Map(p.map(b=>[b.id,b]));for(const[b,P]of v.current.pos)j.has(b)||j.set(b,P);const N=new Map(G);for(const[b,P]of L)N.set(b,P);for(const[b,{dx:P,dy:H}]of N){const T=j.get(b);T&&j.set(b,{...T,x:T.x+P,y:T.y+H})}return Ln.current=j,j},[$,U,L,G]),[In,Mt]=c.useState(!1);c.useEffect(()=>{if(!O){Mt(!1);return}const p=setTimeout(()=>Mt(!0),Rs);return()=>clearTimeout(p)},[O]);const _n=c.useCallback((p,j)=>{if(j.button!==0||j.target.closest('button, a, [role="button"], [data-no-drag]'))return;j.stopPropagation();const N=j.clientX,b=j.clientY,P=q.getZoom()||1,H=L.get(p)??{dx:0,dy:0},T=j.currentTarget;T.setPointerCapture(j.pointerId);let _=!1;const F=re=>{const ue=(re.clientX-N)/P,ge=(re.clientY-b)/P;!_&&Math.hypot(ue,ge)<3||(_=!0,Je.current=!0,B(ke=>new Map(ke).set(p,{dx:H.dx+ue,dy:H.dy+ge})))},Z=re=>{if(T.releasePointerCapture(re.pointerId),T.removeEventListener("pointermove",F),T.removeEventListener("pointerup",Z),_){const ue=Tt.current.get(p);ue&&K(ge=>new Map(ge).set(p,ue))}};T.addEventListener("pointermove",F),T.addEventListener("pointerup",Z)},[L]),Oe=c.useMemo(()=>new Map(M.nodes.map(p=>[p.id,p.role])),[M]),Ae=c.useMemo(()=>new Map(M.edges.map(p=>[p.id,p])),[M]),Pe=c.useMemo(()=>{const p=new Map(M.nodes.map(j=>[j.id,j]));return new Set(M.edges.filter(j=>{const N=p.get(J(j)===j.source?j.target:j.source);return!!N&&xt(j,N)!==void 0}).map(j=>j.id))},[M]),et=c.useMemo(()=>{const p=new Map;if(!$)return p;for(const j of M.edges){const N=J(j)===j.source?j.target:j.source,b=be.get(N);if(!b||Pe.has(j.id))continue;const P=N===j.source,H=`${N}|${P?"out":"in"}`;if(p.has(H))continue;const T=P,_=lt+it;p.set(H,h==="RIGHT"?{base:{x:T?b.x+de+_:b.x-_,y:b.y+Se/2},dir:{x:T?-1:1,y:0}}:{base:{x:b.x+de/2,y:T?b.y+b.height+_:b.y-_},dir:{x:0,y:T?-1:1}})}return p},[M,be,$,h,Pe]),Bn=c.useMemo(()=>{const p=new Map,j=new URLSearchParams(window.location.search).has("dbg"),N=new Set([...G.keys(),...L.keys()]);if(!$||N.size===0)return p;j&&console.log(`[drag] moved: ${[...N].join(", ")}`);const b=new Map(M.nodes.map(P=>[P.id,P]));for(const P of M.edges){const H=J(P),T=H===P.source?P.target:P.source;if(!N.has(H)&&!N.has(T))continue;const _=be.get(H),F=be.get(T),Z=b.get(H);if(!_||!F||!Z)continue;const re=P.storageDirection==="flipped",ue=h==="RIGHT";let ge;try{ge=mn(Z,P.slotName)}catch{j&&console.log(`   SKIP ${H}.${P.slotName}: row not displayed`);continue}const ke=ue?{x:_.x+(re?0:de),y:_.y+ge}:{x:_.x+de/2,y:_.y+ge},we=ue?{x:re?-1:1,y:0}:{x:0,y:1},Ee=T===P.source,ze=ue?{x:Ee?F.x+de:F.x,y:F.y+Se/2}:{x:F.x+de/2,y:Ee?F.y+F.height:F.y},st=ue?{x:Ee?1:-1,y:0}:{x:0,y:Ee?1:-1};p.set(P.id,Es(ke,ze,we,st)),j&&console.log(`   reroute ${H}.${P.slotName} -> ${T}`)}return j&&console.log(`[drag] rerouted ${p.size} edge(s)`),p},[$,L,G,M,be,h]);c.useEffect(()=>{if(!$||!new URLSearchParams(window.location.search).has("dbg"))return;const p=new Map;for(const j of $.edges){const N=Ae.get(j.id);if(!N)continue;const b=Ve(j.sections);if(b.length<2)continue;const P=J(N)===N.source?N.target:N.source;let H=0,T=0;for(let F=1;F<b.length;F++){const Z=Math.abs(b[F].x-b[F-1].x),re=Math.abs(b[F].y-b[F-1].y);Z>.5&&re>.5&&T++,F>1&&H++}const _=J(N);p.set(P,[...p.get(P)??[],`${_}.${N.slotName}  pts=${b.length} bends=${H}${T?` DIAGONAL x${T}`:""}  start=(${Math.round(b[0].x)},${Math.round(b[0].y)}) end=(${Math.round(b[b.length-1].x)},${Math.round(b[b.length-1].y)})`])}for(const[j,N]of p){if(N.length<2)continue;console.log(`
=== approaches to ${j} (${N.length}) ===`);const b=be.get(j);b&&console.log(`   box at (${Math.round(b.x)},${Math.round(b.y)}) h=${Math.round(b.height)}`),N.forEach(P=>console.log("   "+P))}},[$,Ae,be]);const Hn=c.useMemo(()=>{const p=new Map;if(!$)return p;for(const j of $.edges){const N=Ae.get(j.id);if(!N||N.storageDirection==="flipped"||Pe.has(j.id)||ct(l,Ve(j.sections))<=0)continue;const b=J(N)===N.source?N.target:N.source,P=`${b}|${b===N.source?"out":"in"}`,H=et.get(P);if(!H)continue;const T=N.type==="ownership",_=Oe.get(N.source)==="context"||Oe.get(N.target)==="context",F=M.edgeColors.get(j.id),Z=p.get(P);p.set(P,Z?{...Z,isOwn:Z.isOwn||T,dimmed:Z.dimmed&&_,edgeIds:[...Z.edgeIds,j.id],...Z.color?.text===F?.text?{}:{color:void 0}}:{...H,isOwn:T,dimmed:_,edgeIds:[j.id],...F?{color:F}:{}})}return p},[$,Ae,et,l,Oe,M,Pe]),Ot=c.useMemo(()=>new Set(M.nodes.map(p=>p.id)),[M]),De=c.useCallback(p=>!!o&&p.channel!=="plain"&&!p.isLoop&&!Ot.has(p.range),[o,Ot]),At=c.useRef(null),tt=c.useRef(null),nt=c.useRef(void 0),Pt=c.useMemo(()=>{const p=new Map,j=new Map;for(const N of M.edges){j.set(N.id,[N.source,N.target]);for(const b of[N.source,N.target])p.set(b,[...p.get(b)??[],N.id])}return{nodeEdges:p,edgeEnds:j}},[M]),Dt=c.useRef(Pt);Dt.current=Pt;const je=c.useCallback(p=>{nt.current=p,tt.current===null&&(tt.current=requestAnimationFrame(()=>{tt.current=null;const j=nt.current;nt.current=void 0;const N=At.current,b=q.wrapperRef.current;if(j===void 0||!N||!b)return;let P=null,H=null;if(j){const{nodeEdges:T,edgeEnds:_}=Dt.current;if(j.kind==="node"){P=new Set(T.get(j.id)??[]),H=new Set([j.id]);for(const F of P)for(const Z of _.get(F)??[])H.add(Z)}else P=new Set([j.id]),H=new Set(_.get(j.id)??[])}N.querySelectorAll("path[data-edge-id]").forEach(T=>{const _=T.dataset.edgeId??"";P?P.has(_)?(T.style.opacity="1",T.style.strokeWidth=String(T.dataset.channel==="reference"?io:xn)):(T.style.opacity="0.38",T.style.strokeWidth=""):(T.style.opacity="",T.style.strokeWidth="")}),N.querySelectorAll("path[data-arrowhead]").forEach(T=>{const _=(T.dataset.arrowhead??"").split(" ");P?T.style.opacity=_.some(F=>P.has(F))?"1":"0.08":T.style.opacity=""}),b.querySelectorAll("[data-node-id]").forEach(T=>{const _=T.dataset.nodeId??"";T.style.opacity=H?H.has(_)?"1":"0.25":""})}))},[]);c.useEffect(()=>je(null),[M,$,je]);const Fn=p=>m(j=>{const N=new Set(j);return N.has(p)?N.delete(p):N.add(p),N}),Rt=p=>{at("dir",p),d(p)},Fe=p=>{at("merge",p),y(p)},Wn=()=>{at("sibs",!S),u(!S)},We=e.getConceptLabel("attribute",!0).toLowerCase(),ye=p=>`px-2 py-0.5 text-xs rounded border ${p?"border-blue-500 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300":"border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700"}`;return t.jsxs("div",{className:"relative w-full h-full",children:[t.jsxs("div",{"data-pan-ignore":!0,className:"absolute top-2 right-2 z-10 flex gap-1 items-center",children:[a&&t.jsxs(t.Fragment,{children:[t.jsx("button",{className:ye(i),title:i?"Hide owners: show only what you selected":"Show every owner up to the root (can pull in most of the schema)",onClick:a,children:"⇱ roots"}),t.jsx("span",{className:"w-px h-4 bg-gray-300 dark:bg-slate-600 mx-1"})]}),t.jsx("button",{className:ye(S),"data-help-id":"toolbar-siblings",title:S?"Siblings merged: classes sharing a parent share one box":"Siblings separate: no inheritance shown",onClick:Wn,children:"⑃ siblings"}),t.jsx("span",{className:"w-px h-4 bg-gray-300 dark:bg-slate-600 mx-1"}),t.jsx("button",{className:ye(h==="RIGHT"),title:"Layout left to right",onClick:()=>Rt("RIGHT"),children:"LR"}),t.jsx("button",{className:ye(h==="DOWN"),title:"Layout top down",onClick:()=>Rt("DOWN"),children:"TB"}),t.jsx("span",{className:"w-px h-4 bg-gray-300 dark:bg-slate-600 mx-1"}),t.jsx("button",{className:ye(l==="near"),title:"Merge converging edges near the node (~40px)",onClick:()=>Fe("near"),children:"⋙"}),t.jsx("button",{className:ye(l==="far"),title:"Merge converging edges early (~120px)",onClick:()=>Fe("far"),children:"⋙⋙"}),t.jsx("button",{className:ye(l==="bend"),title:"Merge at ELK's last corner",onClick:()=>Fe("bend"),children:"⌙"}),t.jsx("button",{className:ye(l==="off"),title:"No merging — every edge runs to its own port",onClick:()=>Fe("off"),children:"≡"}),t.jsx("span",{className:"w-px h-4 bg-gray-300 dark:bg-slate-600 mx-1"}),[["+",()=>q.zoomBy(1.3),"Zoom in"],["−",()=>q.zoomBy(1/1.3),"Zoom out"],["1:1",()=>q.applyZoom(1),"Reset zoom"],["⛶",()=>q.zoomToFit(),"Fit to view"]].map(([p,j,N])=>t.jsx("button",{onClick:j,title:N,className:ye(!1),children:p},p))]}),In&&t.jsxs("div",{className:`absolute top-2 right-2 z-10 flex items-center gap-2 rounded px-2 py-1
                        text-xs text-gray-500 dark:text-gray-400
                        bg-white/80 dark:bg-slate-900/80 shadow-sm`,children:[t.jsx("span",{className:`inline-block h-3 w-3 animate-spin rounded-full
                           border-2 border-gray-300 border-t-gray-600
                           dark:border-slate-600 dark:border-t-slate-300`}),"Computing layout…"]}),t.jsx("div",{ref:q.containerRef,"data-graph-direction":h,className:"w-full h-full overflow-auto cursor-grab",children:t.jsx("div",{ref:q.spacerRef,children:t.jsx("div",{ref:q.wrapperRef,className:"relative",children:ne&&t.jsxs(t.Fragment,{children:[t.jsxs("svg",{ref:At,className:"absolute top-0 left-0 pointer-events-none",width:le,height:ee,children:[t.jsxs("defs",{children:[t.jsx("marker",{id:k("arrow-own"),viewBox:"0 0 10 7",refX:"0",refY:"3.5",markerWidth:ve,markerHeight:ve*.75,markerUnits:"userSpaceOnUse",orient:"auto-start-reverse",children:t.jsx("path",{d:"M0,0L10,3.5L0,7Z",fill:ie.ownFwd})}),t.jsx("marker",{id:k("arrow-own-back"),viewBox:"0 0 10 7",refX:"10",refY:"3.5",markerWidth:ve,markerHeight:ve*.75,markerUnits:"userSpaceOnUse",orient:"auto-start-reverse",children:t.jsx("path",{d:"M10,0L0,3.5L10,7Z",fill:ie.ownBkwd})}),t.jsx("marker",{id:k("arrow-assoc"),viewBox:"0 0 10 7",refX:"0",refY:"3.5",markerWidth:ve*Bt,markerHeight:ve*.75*Bt,markerUnits:"userSpaceOnUse",orient:"auto-start-reverse",children:t.jsx("path",{d:"M0,0L10,3.5L0,7Z",fill:ie.association})})]}),t.jsxs("g",{transform:`translate(${Ne}, ${Ne})`,style:{opacity:te?1:0,transition:`opacity ${_s()}ms`},children:[[...Hn].map(([p,j])=>t.jsx("path",{"data-arrowhead":j.edgeIds.join(" "),d:js(j.base,j.dir,ve,it),fill:j.color?.text??Ht(j.isOwn,!1),opacity:j.dimmed?.4:1,style:{transition:`opacity ${qe()}ms`}},`head-${p}`)),($?.edges??[]).map(p=>{const j=Ae.get(p.id);if(!j)throw new Error(`Routed edge ${p.id} missing from view model`);const N=j.storageDirection==="flipped",b=J(j)===j.source?j.target:j.source,P=N||Pe.has(p.id)?void 0:et.get(`${b}|${b===j.source?"out":"in"}`),H=Bn.get(p.id),T=!!P&&ct(l,H??Ve(p.sections))>0,_=j.type!=="ownership",F=T?p.sections:co(p.sections,ve+lt+(N?2:0)),Z=_?ho(F,it+lt):F,re=H??Ve(Z),ue=st=>ws(st,ro),ge=ct(l,re),ke=P&&ge>0?Ss(re,P.base,ge,ue):ue(re);if(!ke)return null;const we=j.type==="ownership",Ee=Oe.get(p.source)==="context"||Oe.get(p.target)==="context",ze=T?void 0:we?N?"arrow-own-back":"arrow-own":"arrow-assoc";return t.jsxs("g",{children:[t.jsx("path",{"data-edge-id":p.id,"data-channel":we?"ownership":"reference",d:ke,fill:"none",opacity:Ee?.4:1,stroke:M.edgeColors.get(p.id)?.text??Ht(we,N),strokeWidth:we?yn:ao,strokeDasharray:we?void 0:"5 4",markerEnd:ze?`url(#${k(ze)})`:void 0,markerStart:!we&&!T?`url(#${k("arrow-assoc")})`:void 0,style:{transition:`opacity ${qe()}ms, stroke-width ${qe()}ms`}}),t.jsx("path",{d:ke,fill:"none",stroke:"transparent",strokeWidth:11,style:{pointerEvents:"stroke"},onMouseEnter:()=>je({kind:"edge",id:p.id}),onMouseLeave:()=>je(null)})]},p.id)})]})]}),[...M.nodes,...se].map(p=>{const j=be.get(p.id);if(!j)return null;const N=p.role==="context";return t.jsxs("div",{"data-node-id":p.id,"data-help-id":hs(p),"data-pan-ignore":!0,"data-pinned":G.has(p.id)?"":void 0,onPointerDown:b=>_n(p.id,b),onDoubleClick:b=>{G.has(p.id)&&(b.stopPropagation(),K(P=>{const H=new Map(P);return H.delete(p.id),H}))},onClick:()=>{if(Je.current){Je.current=!1;return}s?.(p.members.length?p.label:p.id)},onMouseEnter:()=>je({kind:"node",id:p.id}),onMouseLeave:()=>je(null),className:`absolute rounded-md text-xs bg-white dark:bg-slate-800 cursor-pointer ${N?"opacity-60 border border-dashed border-gray-400 dark:border-slate-500":G.has(p.id)?"border-2 border-amber-500 dark:border-amber-400 shadow-md":"border-2 border-slate-500 dark:border-slate-400 shadow-md"}`,style:{width:de,height:p.height,transform:`translate(${j.x+Ne}px, ${j.y+Ne}px)`,transition:L.has(p.id)?`opacity ${qe()}ms`:`transform ${tn()}ms, opacity ${It()}ms ${z.has(p.id)?Is():0}ms`,...z.has(p.id)&&!me.has(p.id)?{opacity:0}:I.has(p.id)?{opacity:0}:{}},children:[t.jsxs("div",{className:"flex items-center gap-1 px-2 rounded-t-[4px] bg-slate-700 dark:bg-slate-700 text-white border-b border-slate-800 dark:border-slate-600",style:{height:Se},children:[t.jsx("span",{className:`font-semibold truncate ${p.abstract?"italic":""}`,title:p.description||p.id,children:p.label}),t.jsxs("span",{className:"ml-auto flex gap-1 shrink-0",children:[p.members.length>0&&t.jsxs("span",{title:`${p.members.length} classes that are a ${p.label}, merged into one box`,className:"text-[9px] px-1 rounded bg-sky-100 dark:bg-sky-900 text-sky-800 dark:text-sky-200",children:["⑃ ",p.members.length]}),p.isaParents.map(b=>t.jsxs("span",{title:`is-a ${b}`,className:"text-[9px] px-1 rounded bg-sky-100 dark:bg-sky-900 text-sky-800 dark:text-sky-200",children:["⊳ ",b]},b)),p.subclassCount>0&&p.members.length===0&&t.jsxs("span",{title:`${p.subclassCount} subclasses shown`,className:"text-[9px] px-1 rounded bg-sky-100 dark:bg-sky-900 text-sky-800 dark:text-sky-200",children:["▷ ",p.subclassCount]}),(()=>{const P=(p.members.length?p.members.map(H=>H.id):[p.id]).filter(H=>n.has(H));return P.length?t.jsx("button",{"data-dismiss":p.id,"data-help-id":"node-dismiss",title:P.length>1?`Remove all ${P.length} selected classes in ${p.label}`:`Remove ${p.label} from the canvas`,onClick:H=>{H.stopPropagation(),P.forEach(T=>r?.(T))},className:`text-[10px] leading-none px-1 rounded text-gray-400
                                         hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/40`,children:"✕"}):null})()]})]}),p.relationGroups.length>0&&t.jsx("div",{"data-help-id":"relation-bar",className:`flex items-center gap-1 px-2 border-b overflow-hidden
                                     border-gray-200 dark:border-slate-600
                                     bg-sky-50/60 dark:bg-sky-950/30`,style:{height:St},children:t.jsx(zs,{label:p.label,rows:p.relationRows,onAdd:b=>o?.(b),onRemove:b=>r?.(b),onInspect:s,colorOf:w,slotOrder:p.allRows.map(b=>b.slot)})}),p.rows.map(b=>b.header?t.jsx("div",{"data-no-drag":!0,"data-help-id":cs(b.header.id),title:`${b.header.label} — is a ${p.label}; click for details`,onClick:P=>{P.stopPropagation(),s?.(b.header.id)},className:`flex items-center px-2 text-[10px] font-semibold
                                     cursor-pointer hover:brightness-110`,style:{height:Ce,background:b.header.color.fill,color:Vn},children:t.jsx("span",{className:"truncate",children:b.header.label})},b.slot):t.jsxs("div",{"data-help-id":us(p,b),"data-expandable":De(b)?"":void 0,"data-no-drag":De(b)?"":void 0,title:(b.channel==="plain"?`${b.slot}: ${b.range}`:`${b.slot} → ${b.range} (${b.cardinality})${b.flipped?" — owner side":""}`+(De(b)?` — click to add ${b.range}`:""))+((b.owners?.length??0)>1?`
also declared by ${b.owners.slice(1).map(P=>P.label).join(", ")}`:""),onClick:De(b)?P=>{P.stopPropagation(),o?.(b.range)}:void 0,className:`flex items-center gap-1.5 px-2 text-[11px] ${b.targetColor?"":b.connected?"text-gray-700 dark:text-gray-300":"text-gray-400 dark:text-gray-500"} ${De(b)?"cursor-pointer hover:bg-sky-50 dark:hover:bg-sky-900/30 hover:text-sky-700 dark:hover:text-sky-300":""}`,style:{height:Ce,...b.targetColor?{color:b.targetColor.text}:{}},children:[t.jsx("span",{className:"w-1.5 h-1.5 rounded-full shrink-0 border",style:{borderColor:b.rangeColor,background:b.connected?b.rangeColor:"transparent"}}),t.jsx("span",{className:`truncate ${p.members.length&&!b.owners?.length?`font-semibold ${b.targetColor?"":"text-gray-900 dark:text-gray-100"}`:""}`,children:b.slot}),b.isLoop&&t.jsx(no,{title:`self-referential: a ${b.range} can own another ${b.range} via ${b.slot}`}),t.jsxs("span",{className:"ml-auto text-[9px] truncate max-w-[90px]",children:[t.jsx("span",{style:{color:b.rangeColor},children:b.range}),t.jsxs("span",{className:"text-gray-400 dark:text-gray-500",children:[" ",b.cardinality]})]})]},b.declaringClass?`${b.declaringClass}|${b.slot}`:b.slot)),p.hiddenCount>0&&t.jsx("button",{className:"w-full text-left px-2 text-[10px] text-sky-600 dark:text-sky-400 hover:underline",style:{height:cn},title:`${We} without an edge on the current canvas, plus plain (non-entity) ${We}`,onClick:b=>{b.stopPropagation(),Fn(p.id)},children:p.expanded?`− fewer ${We}`:`+ ${p.hiddenCount} more ${We}`})]},p.id)})]})})})})]})}function po({classId:e,dataService:n,onClose:s,onNavigate:o,isSelected:r,onToggleSelect:i}){const a=c.useMemo(()=>n.getClassSummary(e),[e,n]),[h,d]=c.useState([]),l=c.useCallback(u=>{u!==e&&(d(x=>[...x,e]),o(u))},[e,o]),y=c.useCallback(()=>{d(u=>u.length===0?u:(o(u[u.length-1]),u.slice(0,-1)))},[o]);c.useEffect(()=>{const u=x=>{x.key==="Escape"&&s()};return window.addEventListener("keydown",u),()=>window.removeEventListener("keydown",u)},[s]);const S=n.getTypeLabel("slot",!0);return t.jsxs("aside",{className:`w-96 shrink-0 flex flex-col min-h-0 border-l border-gray-200 dark:border-slate-700
                 bg-white dark:bg-slate-900`,"aria-label":"Entity details",children:[t.jsxs("header",{className:`flex items-start gap-2 px-3 py-2 border-b border-gray-200 dark:border-slate-700
                   bg-gray-50 dark:bg-slate-800 shrink-0`,children:[h.length>0&&t.jsx("button",{onClick:y,className:"text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-sm mt-0.5",title:"Back",children:"←"}),t.jsxs("div",{className:"flex-1 min-w-0",children:[t.jsxs("div",{className:"font-semibold text-sm text-blue-700 dark:text-blue-300 break-words",children:[a?.name??e,a?.isAbstract&&t.jsx("span",{className:"ml-1 text-xs text-purple-500 italic",children:"(abstract)"})]}),a?.parentId&&t.jsxs("div",{className:"text-xs text-gray-400",children:["is a"," ",t.jsx("button",{onClick:()=>l(a.parentId),className:"text-blue-600 dark:text-blue-400 hover:underline",children:a.parentId})]})]}),t.jsx("button",{onClick:s,className:"text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-sm px-1",title:"Close (Esc)",children:"✕"})]}),a?t.jsxs("div",{className:"flex-1 overflow-y-auto min-h-0 px-3 py-2 space-y-3",children:[t.jsx("button",{onClick:()=>i(e),className:`w-full px-2 py-1 text-xs rounded border ${r?"border-blue-500 bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300":"border-gray-300 dark:border-slate-600 hover:border-blue-400 text-gray-600 dark:text-gray-300"}`,children:r?"✓ In diagram — click to remove":"+ Add to diagram"}),a.description&&t.jsx("p",{className:"text-xs text-gray-600 dark:text-gray-300 leading-relaxed",children:a.description}),a.referencedBy.length>0&&t.jsxs("section",{children:[t.jsxs(Wt,{children:["Referenced by (",a.referencedBy.length,")"]}),t.jsx("ul",{className:"space-y-0.5",children:a.referencedBy.map((u,x)=>t.jsxs("li",{className:"text-xs",children:[t.jsx("button",{onClick:()=>l(u.classId),className:"text-blue-600 dark:text-blue-400 hover:underline cursor-pointer",children:u.classId}),t.jsxs("span",{className:"text-gray-400",children:[".",u.slotName]})]},`${u.classId}.${u.slotName}-${x}`))})]}),a.slots.length>0&&t.jsxs("section",{children:[t.jsxs(Wt,{children:[S," (",a.slots.length,")"]}),t.jsx("ul",{className:"divide-y divide-gray-100 dark:divide-slate-700",children:a.slots.map((u,x)=>t.jsxs("li",{className:"py-1.5",children:[t.jsxs("div",{className:"flex items-baseline gap-1.5 flex-wrap",children:[t.jsx("span",{className:"text-xs font-medium text-gray-800 dark:text-gray-100",children:u.name}),t.jsx(go,{range:u.range,onNavigate:l,dataService:n})]}),u.description&&t.jsx("p",{className:"mt-0.5 text-[11px] text-gray-500 dark:text-gray-400 leading-snug break-words",children:u.description})]},`${u.name}-${x}`))})]})]}):t.jsxs("div",{className:"p-3 text-xs text-gray-500",children:["Entity not found: ",e]})]})}function Wt({children:e}){return t.jsx("div",{className:"text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-1",children:e})}function go({range:e,onNavigate:n,dataService:s}){const o=s.itemExists(e)&&!e.endsWith("Enum"),a=`inline-block px-1 py-0 rounded text-[11px] font-medium ${new Set(["string","integer","boolean","float","double","decimal","date","datetime","time","uri","uriorcurie","ncname"]).has(e.toLowerCase())?"bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300":e.endsWith("Enum")?"bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300":"bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"}`;return o?t.jsx("button",{onClick:()=>n(e),className:`${a} hover:underline cursor-pointer`,children:e}):t.jsx("span",{className:a,children:e})}const mo=[{heading:"One rule at a time",cases:[{name:"Rule 1 — multivalued owns forward",note:"A multivalued slot means the owner has-a collection, so ownership runs forward: Questionnaire.items and ResearchStudy.consents. The two `part_of` self-loops are the counterexample — multivalued but drawn backward, because they walk UP a tree.",sel:["ResearchStudy","Consent","Questionnaire","QuestionnaireItem"]},{name:"Rule 2 — single-valued belongs backward",note:"The largest group (70 edges). Participant fans OUT to 22 targets, nearly all reversed: each target declares `associated_participant` and is drawn as belonging to Participant. This is the group that would move if own-bkwd merges into association.",sel:["Participant","Condition","Demography","Exposure","Procedure","Visit"]},{name:"Exception 2a — no independent existence",note:"Single-valued, but forward anyway: Quantity, TimePoint and the like have no identity of their own, so the value belongs to whoever holds it rather than owning the holder.",sel:["SpecimenStorageActivity","Quantity","TimePoint","Activity"]},{name:"Entity-ranged — always forward",note:"The twelve focus / associated_evidence slots range on Entity, the universal root. A pointer AT the root is never a foreign key back to an owner, so these run forward whatever their cardinality. Both single- and multi-valued focus sites are here — all should point AT Entity.",sel:["Observation","ObservationSet","MeasurementObservation","Document","Condition","SdohObservation","Entity"]},{name:"Association — no ownership claim",note:"Both associations in the schema: Document.related_document → Specimen, and SpecimenContainer.container → SpecimenStorageActivity. Slate and dashed, arrowed at both ends. They are listed explicitly because they are multivalued, so Rule 1 would otherwise call them ownership.",sel:["Document","Specimen","SpecimenContainer","SpecimenStorageActivity"]},{name:"Self-loops",note:"The five self-owning slots (TimePoint.index_time_point, File.derived_from, Specimen.parent_specimen, ResearchStudy.part_of, SpecimenContainer.parent_container) — loop markers, not routed edges. ResearchStudy also pulls in its TimePoint edges; the loops are the circular arrows on the rows.",sel:["TimePoint","File","Specimen","ResearchStudy","SpecimenContainer"]}]},{heading:"Inheritance (the ⑃ siblings toggle)",cases:[{name:"One child, merged with its parent",note:"MeasurementObservation alone. It still merges: the box is titled Observation, its 13 inherited rows sit at the top in black, and MeasurementObservation's own 9 follow under its coloured header. Merging does not wait for a second sibling — a class must not change shape because of what else you happen to select.",sel:["MeasurementObservation"]},{name:"Children that add nothing",note:'SpecimenQuality- and SpecimenQuantityObservation declare no slots of their own. Both still get a header under the shared rows, because "this subclass adds nothing" is the answer to what they are — and without the headers the selection would leave no trace in the box at all.',sel:["SpecimenQualityObservation","SpecimenQuantityObservation"]},{name:"slot_usage — same name, different type",note:"QuestionnaireResponseValue's five children each narrow `value` to a different type (boolean, decimal, integer, TimePoint, and the parent's string). That narrowing is the entire reason the five classes exist, so each keeps its OWN row rather than merging into the parent's — the one place a shared row would be a lie.",sel:["QuestionnaireResponseValueBoolean","QuestionnaireResponseValueDecimal","QuestionnaireResponseValueInteger","QuestionnaireResponseValueString","QuestionnaireResponseValueTimePoint"]},{name:"The full Observation family",note:"All five Observation subclasses plus the parent. One box where there would be six, and the shared rows are stated once. Turn ⑃ siblings off to see what it replaces. Note each edge leaves in the colour of the child that owns its row; inherited slots' edges are the parent's and are drawn once, not once per child.",sel:["Observation","MeasurementObservation","SdohObservation","DimensionalObservation","SpecimenQualityObservation","SpecimenQuantityObservation"]}]},{heading:"The bare diagonal",cases:[{name:"BodySite 6-way (the original)",note:"The reproducer from the handoff. In ⌙ (bend) the top approach arrives as a straight diagonal with no steps; in ⋙ (near) it keeps its horizontal run. This is the case the fix has to fix.",sel:["BodySite","Condition","Consent","Demography","Exposure","Observation","Procedure","ImagingFile","ImagingStudy","MeasurementObservation","SpecimenCreationActivity"]},{name:"BodySite, owners only",note:"The same convergence with nothing else on canvas — six owners, no unrelated boxes for a diagonal to cut across. Shows whether the degeneracy is about the convergence itself or about crowding.",sel:["BodySite","Condition","ImagingFile","ImagingStudy","MeasurementObservation","Procedure","SpecimenCreationActivity"]},{name:"TimePoint 16-edge",note:"Densest corridor in the schema: 8 owners but 16 slot-edges, since each Specimen*Activity owns date_started and date_ended. Also where the second-from-top edge goes diagonal and pair edges cross.",sel:["TimePoint","Consent","ResearchStudy","TimePeriod","SpecimenCreationActivity","SpecimenProcessingActivity","SpecimenStorageActivity","SpecimenTransportActivity","QuestionnaireResponseValueTimePoint"]},{name:"TimePoint + Person (crossing)",note:"Siggie's repro for the crossing bug: the paired date_started / date_ended edges from different owners cross each other on the way in. Compare pair ordering against the case above.",sel:["TimePoint","Person","Consent","ResearchStudy","TimePeriod","SpecimenCreationActivity","SpecimenProcessingActivity","SpecimenStorageActivity","SpecimenTransportActivity","QuestionnaireResponseValueTimePoint"]}]},{heading:"Pathological convergences",cases:[{name:"Quantity 19-edge (worst case)",note:"The largest convergence in the schema: 16 owning classes, 19 slot-edges. The fan is squeezed hardest here, so ENTITY_FAN_GAP and the merge distance both show their limits.",sel:["Quantity","Activity","Assay","DeviceExposure","DimensionalObservation","DrugExposure","MeasurementObservation","Observation","Procedure","SdohObservation","SpecimenCreationActivity","SpecimenProcessingActivity","SpecimenQualityObservation","SpecimenQuantityObservation","SpecimenStorageActivity","SpecimenTransportActivity","Substance"]},{name:"Context 6-way (uniform owners)",note:"Six owners that are all observation classes — same size, same shape, similar row counts. The controlled comparison for BodySite, whose owners vary wildly in height.",sel:["Context","DimensionalObservation","MeasurementObservation","Observation","SdohObservation","SpecimenQualityObservation","SpecimenQuantityObservation"]},{name:"Two convergences at once",note:"Quantity and TimePoint both converge from the same Specimen activity classes, so two corridors compete for the same space. Where merge distance trades off against crossings.",sel:["Quantity","TimePoint","SpecimenCreationActivity","SpecimenProcessingActivity","SpecimenStorageActivity","SpecimenTransportActivity"]}]},{heading:"Flipped divergences (found via the legend)",cases:[{name:"Participant 22-way (largest fan in the schema)",note:"Bigger than any inbound convergence: 22 edges leaving Participant, 21 of them FLIPPED. Flipped edges keep their attribute-row anchor and must not merge, so this is the fan the merge code deliberately does not touch — and therefore the one nothing has been tuned against.",sel:["Participant","Condition","Consent","Demography","DeviceExposure","DrugExposure","Exposure","File","ImagingStudy","MeasurementObservation","Observation","Procedure","SdohObservation","Specimen","Visit"]},{name:"Visit 19-way",note:"The same shape one size down, and it overlaps Participant heavily — most classes carry both associated_participant and associated_visit, so the two fans run through the same corridor as pairs.",sel:["Visit","Condition","Demography","DeviceExposure","DrugExposure","Exposure","ImagingStudy","MeasurementObservation","Observation","Procedure","QuestionnaireResponse","SdohObservation","TimePeriod"]},{name:"Participant + Visit + Organization",note:"All three FK hubs at once (22 + 19 + 11 edges, nearly all flipped). The densest picture the schema can produce, and the stress test for anything that changes routing.",sel:["Participant","Visit","Organization","Condition","Demography","DimensionalObservation","MeasurementObservation","Observation","ObservationSet","Procedure","SdohObservation","SpecimenQualityObservation","SpecimenQuantityObservation"]},{name:"Converge and diverge at once",note:"MeasurementObservation owns BodySite/Context/Quantity while being owned by Participant/Visit/Organization — edges fan IN and OUT of the same box. Where merged (entity-end) and unmerged (flipped) arrivals sit side by side.",sel:["MeasurementObservation","BodySite","Context","Quantity","Participant","Visit","Organization","MeasurementObservationSet"]}]},{heading:"Normal cases (a fix must not break these)",cases:[{name:"Single edge",note:"One owner, one edge, no convergence at all — merging is a no-op. The floor: if this looks wrong, something basic broke.",sel:["Visit","TimePeriod"]},{name:"Two owners",note:"The smallest real convergence. Two approaches, one arrowhead — the fan is barely a fan, so a merge distance that is too long is obvious here first.",sel:["Participant","Visit","ObservationSet"]},{name:"Specimen chain (deep, not wide)",note:"A long ownership chain rather than a convergence: many layers, few edges per node. Checks that tuning for convergences has not made ordinary edges worse.",sel:["Specimen","SpecimenContainer","SpecimenCreationActivity","SpecimenProcessingActivity","SpecimenStorageActivity","SpecimenTransportActivity","Participant"]},{name:"The known 3-node cycle",note:"Specimen -> SpecimenStorageActivity -> SpecimenContainer -> Specimen: an association plus two ownership edges. Known and deliberately unhandled; here so it stays visible.",sel:["Specimen","SpecimenStorageActivity","SpecimenContainer"]},{name:"Backward ownership (own-bkwd)",note:"Slots drawn backward (performed_by, associated_person, contained_in, related_imaging_study). These keep their attribute-row anchor and must NOT merge — check the arrowheads.",sel:["Organization","Person","Participant","ImagingFile","ImagingStudy","SpecimenContainer","Specimen"]},{name:"Path to root",note:"Path-to-root on from a single deep class, which pulls in every owner up the chain. The biggest graph reachable in one click.",sel:["MeasurementObservation"],roots:!0}]}],fo=3,dt=40;function bn(){const[e,n]=c.useState(null),s=c.useCallback(r=>{if(r.button!==0||r.target.closest('button, a, input, select, textarea, [role="button"], [data-no-drag]'))return;const a=(r.currentTarget.closest("[data-draggable]")??r.currentTarget).getBoundingClientRect(),h=r.clientX,d=r.clientY,l={left:a.left,top:a.top},y=r.currentTarget;y.setPointerCapture(r.pointerId);let S=!1;const u=k=>{const g=k.clientX-h,m=k.clientY-d;if(!S&&Math.hypot(g,m)<fo)return;S=!0;const f={left:Math.max(Math.min(l.left+g,window.innerWidth-dt),dt-a.width),top:Math.min(Math.max(l.top+m,0),window.innerHeight-dt)};n(f)},x=k=>{y.releasePointerCapture(k.pointerId),y.removeEventListener("pointermove",u),y.removeEventListener("pointerup",x),y.removeEventListener("pointercancel",x)};y.addEventListener("pointermove",u),y.addEventListener("pointerup",x),y.addEventListener("pointercancel",x)},[]),o=c.useCallback(()=>n(null),[]);return{offset:e,onPointerDown:s,reset:o}}function wn({title:e,subtitle:n,onClose:s,offset:o,children:r}){const i=bn();c.useEffect(()=>{const h=d=>{d.key==="Escape"&&s()};return window.addEventListener("keydown",h),()=>window.removeEventListener("keydown",h)},[s]);const a=i.offset!==null;return t.jsxs("div",{"data-draggable":"",style:{resize:"both",...i.offset?{position:"fixed",...i.offset,right:"auto"}:{}},className:`z-30 w-[26rem] max-h-[80vh] overflow-y-auto
                  rounded-lg border border-gray-300 dark:border-slate-600
                  bg-white dark:bg-slate-800 shadow-xl
                  text-gray-900 dark:text-gray-100
                  ${a?"":`absolute top-14 ${o?"right-[27rem]":"right-4"}`}`,children:[t.jsxs("div",{onPointerDown:i.onPointerDown,className:`sticky top-0 flex items-baseline justify-between gap-2 px-4 py-2
                   border-b border-gray-200 dark:border-slate-700
                   bg-white dark:bg-slate-800 cursor-grab active:cursor-grabbing
                   select-none`,children:[t.jsxs("div",{children:[t.jsx("h2",{className:"text-sm font-semibold",children:e}),n&&t.jsx("p",{className:"text-[11px] text-gray-500 dark:text-gray-400",children:n})]}),t.jsxs("div",{className:"flex items-center gap-1 shrink-0",children:[a&&t.jsx("button",{onClick:i.reset,title:"Put it back",className:`text-gray-400 hover:text-gray-700 dark:hover:text-gray-200
                         text-xs leading-none px-1`,children:"⤺"}),t.jsx("button",{onClick:s,title:"Close (Esc)",className:"text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-lg leading-none",children:"×"})]})]}),t.jsx("div",{className:"px-4 py-2",children:r})]})}function yo(e,n){return e.sel.length===n.size&&e.sel.every(s=>n.has(s))}function xo({onClose:e,onApply:n,selectedIds:s,dataService:o,offset:r}){const i=c.useMemo(()=>o.getConvergenceRanking(),[o]),a=c.useMemo(()=>o.getDivergenceRanking(),[o]),h=d=>n({name:"ad hoc",note:"",sel:d});return t.jsxs(wn,{title:"Example cases",subtitle:"Selections worth looking at, simple to dense.",onClose:e,offset:r,children:[t.jsxs("section",{className:"mb-4",children:[t.jsx(zt,{children:"Biggest fans"}),t.jsx("p",{className:"text-[11px] text-gray-500 dark:text-gray-400 mb-1.5",children:"Counted in slot-edges, not classes: one class owning a target through two slots crowds the corridor twice. Click a row to load just that fan."}),t.jsx("div",{className:"grid grid-cols-2 gap-3",children:[["Converging (in)",i.slice(0,6).map(d=>({entity:d.entity,n:d.edgeCount,peers:d.owners,flipped:0}))],["Diverging (out)",a.slice(0,6).map(d=>({entity:d.entity,n:d.edgeCount,peers:d.owned,flipped:d.flippedCount}))]].map(([d,l])=>t.jsxs("div",{children:[t.jsx("h4",{className:"text-[10px] font-medium text-gray-500 dark:text-gray-400 mb-0.5",children:d}),t.jsx("ul",{className:"space-y-0.5",children:l.map(y=>t.jsx("li",{children:t.jsxs("button",{onClick:()=>h([y.entity,...y.peers]),title:`Select ${y.entity} and all ${y.peers.length} peers`,className:"w-full text-left text-xs hover:bg-gray-50 dark:hover:bg-slate-700 rounded px-1",children:[t.jsx("span",{className:"text-blue-600 dark:text-blue-400",children:y.entity}),t.jsxs("span",{className:"text-gray-400 ml-1",children:[y.n,y.flipped>0?` (${y.flipped} flipped)`:""]})]})},y.entity))})]},d))})]}),mo.map(d=>t.jsxs("section",{className:"mb-3 last:mb-1",children:[t.jsx(zt,{children:d.heading}),t.jsx("ul",{className:"space-y-1.5",children:d.cases.map(l=>{const y=yo(l,s);return t.jsx("li",{children:t.jsxs("button",{onClick:()=>n(l),className:`block w-full text-left rounded px-2 py-1 border
                      ${y?"border-blue-500 bg-blue-50 dark:bg-blue-950":"border-transparent hover:bg-gray-50 dark:hover:bg-slate-700"}`,children:[t.jsx("span",{className:`text-xs font-medium ${y?"text-blue-700 dark:text-blue-300":"text-blue-600 dark:text-blue-400"}`,children:l.name}),t.jsxs("span",{className:"ml-1.5 text-[10px] text-gray-400",children:[l.sel.length,l.roots?" ⇱":""]}),t.jsx("p",{className:"text-[11px] leading-snug text-gray-600 dark:text-gray-400 mt-0.5",children:l.note})]})},l.name)})})]},d.heading))]})}function zt({children:e}){return t.jsx("h3",{className:`text-[11px] font-semibold uppercase tracking-wider
                   text-gray-400 dark:text-gray-500 mb-1`,children:e})}const Qt={"own-fwd":{text:"owns (forward)",color:ie.ownFwd},"own-bkwd":{text:"belongs to (backward)",color:ie.ownBkwd},association:{text:"association (no ownership)",color:ie.association},excluded:{text:"dropped",cls:"text-gray-400 dark:text-gray-500 border-gray-300"}},bo=[{kind:"own-fwd",color:ie.ownFwd,title:"A owns B",body:"The arrow runs from the owner to what it holds. A owns B when the schema puts the collection on A, or when B has no independent existence — a Quantity of 5 mg is not something you look up."},{kind:"own-bkwd",color:ie.ownBkwd,title:"A belongs to B",body:'The same relationship stored at the other end: A carries a pointer to one B that exists without it. Drawn B → A, so you still read "start at B to find A". A Participant carries on existing whether or not any observation points at it.'},{kind:"association",color:ie.association,title:"A and B are associated",body:"Neither owns the other. Dashed, with arrowheads at both ends. Only two edges in the schema are this — a slot the ownership rules would otherwise claim, wrongly."}],wo=[{glyph:"⇱ roots",what:"Also draw everything on the path up to a root."},{glyph:"⑃ siblings",what:"Draw classes that share a parent as one merged box."},{glyph:"LR / TB",what:"Lay the diagram out left-to-right or top-down."},{glyph:"⋙ ⋙⋙ ⌙ ≡",what:"Where converging edges join before their shared arrowhead — near the box, early, at the last corner, or not at all. Temporary, for picking one by eye."},{glyph:"+ − 1:1 ⛶",what:"Zoom in, out, reset, fit to view."}],vo=[["0..1","optional, at most one"],["1..1","required, exactly one"],["0..*","optional, any number"],["1..*","required, one or more"]];function ko({dataService:e,onClose:n,onSelect:s,offset:o}){const r=c.useMemo(()=>e.getOwnershipPairGroups(),[e]),[i,a]=c.useState(null),h=d=>t.jsx("button",{onClick:()=>s([d]),className:"hover:underline text-blue-600 dark:text-blue-400",title:`Select ${d}`,children:d});return t.jsx(wn,{title:"Ownership legend",subtitle:"What the diagram's arrows, colors and buttons mean.",onClose:n,offset:o,children:t.jsxs("div",{className:"text-xs",children:[t.jsxs(Re,{title:"The three kinds of relationship",children:[t.jsxs("p",{className:"text-[11px] text-gray-500 dark:text-gray-400 mb-2",children:["Every edge is a class-valued attribute. Classes are placed so that if ",t.jsx("b",{children:"A"})," is drawn before ",t.jsx("b",{children:"B"}),", you reach ",t.jsx("b",{children:"B"})," through"," ",t.jsx("b",{children:"A"})," — so an edge always tells you where to start."]}),t.jsx("ul",{className:"space-y-2",children:bo.map(d=>t.jsxs("li",{className:"flex gap-2",children:[t.jsx(nn,{kind:d.kind,className:"mt-0.5"}),t.jsxs("div",{className:"min-w-0",children:[t.jsx("div",{className:"font-medium",style:{color:d.color},children:d.title}),t.jsx("p",{className:"text-[11px] leading-snug text-gray-600 dark:text-gray-400",children:d.body})]})]},d.title))}),t.jsxs("p",{className:"text-[11px] leading-snug text-gray-500 dark:text-gray-400 mt-2",children:["An edge leaves the ",t.jsx("b",{children:"attribute's row"}),", not the box — that is how you tell which attribute made it. A ",t.jsx("b",{children:"⟲"})," on a row is a slot pointing back at its own class."]}),t.jsxs("p",{className:"text-[11px] leading-snug text-gray-500 dark:text-gray-400 mt-2",children:["Owners are drawn first, so a box's ",t.jsx("b",{children:"← N"})," counts what it belongs to (on its left) and ",t.jsx("b",{children:"M →"})," what it owns (on its right). Hover either to list them. The little edge on each row is the one above: it says which end holds the arrowhead, and so which entity declares the attribute — and ",t.jsx("i",{children:"both"})," kinds turn up on ",t.jsx("i",{children:"both"})," sides."]})]}),t.jsxs(Re,{title:"Colors",children:[t.jsx(Gt,{caption:"A row's dot and its range label say what KIND of thing the attribute points at.",items:[{color:xe.entity,label:"another entity"},{color:xe.enum,label:"a value set"},{color:xe.dataType,label:"a data type"}]}),t.jsxs("p",{className:"text-[11px] leading-snug text-gray-600 dark:text-gray-400 mt-2",children:["A ",t.jsx("b",{children:"filled"})," dot draws an edge; a ",t.jsx("b",{children:"hollow"})," one does not, because what it points at is not on the canvas. Only entity ranges can draw edges at all."]}),t.jsx(Gt,{className:"mt-3",caption:"Inside a merged box, a color says which class an attribute belongs to.",items:ts.slice(0,4).map((d,l)=>({color:d.text,swatch:d.fill,label:l===0?"the parent":`child ${l}`}))})]}),t.jsx(Re,{title:"Cardinality",children:t.jsx("ul",{className:"flex flex-wrap gap-x-4 gap-y-1",children:vo.map(([d,l])=>t.jsxs("li",{className:"flex items-center gap-1.5",children:[t.jsx("span",{className:"font-mono text-[11px] text-gray-700 dark:text-gray-300",children:d}),t.jsx("span",{className:"text-[11px] text-gray-500 dark:text-gray-400",children:l})]},d))})}),t.jsx(Re,{title:"The toolbar",children:t.jsx("ul",{className:"space-y-1",children:wo.map(d=>t.jsxs("li",{className:"flex gap-2",children:[t.jsx("span",{className:"shrink-0 font-mono text-[11px] text-gray-700 dark:text-gray-300 w-20",children:d.glyph}),t.jsx("span",{className:"text-[11px] leading-snug text-gray-600 dark:text-gray-400",children:d.what})]},d.glyph))})}),t.jsxs(Re,{title:"Every relationship, by rule",children:[t.jsx("p",{className:"text-[11px] text-gray-500 dark:text-gray-400 mb-1.5",children:"Derived live from the classifier the graph itself uses, so this cannot drift from what is drawn. Overrides and value-object membership are hand-curated — if a pair looks wrong, the classification is. Click any class to select it."}),t.jsx("ul",{className:"space-y-1",children:r.map(d=>{const l=`${d.verdict}/${d.rule}`,y=Qt[d.verdict]??Qt.excluded,S=i===l;return t.jsxs("li",{className:"border-l-2 pl-2 border-gray-200 dark:border-slate-600",children:[t.jsxs("button",{onClick:()=>a(S?null:l),className:"w-full text-left",children:[t.jsx("span",{className:`inline-block px-1 rounded border text-[10px] ${y.cls??""}`,style:y.color?{color:y.color,borderColor:y.color}:void 0,children:y.text}),t.jsx("span",{className:"ml-1.5 font-medium",children:d.rule}),t.jsx("span",{className:"ml-1 text-gray-400",children:d.pairs.length}),t.jsx("span",{className:"ml-1 text-gray-400",children:S?"▾":"▸"})]}),t.jsx("p",{className:"text-[11px] leading-snug text-gray-600 dark:text-gray-400 mt-0.5",children:d.ruleText}),S&&t.jsx("ul",{className:"mt-1 mb-1.5 space-y-0.5 font-mono text-[10px]",children:d.pairs.map(u=>t.jsxs("li",{className:"text-gray-600 dark:text-gray-400",children:[h(u.declaredOn),t.jsxs("span",{className:"text-gray-400",children:[".",u.slotName]}),t.jsx("span",{className:"mx-1 text-gray-400",children:u.multivalued?"↠":"→"}),h(u.range),u.isLoop&&t.jsx("span",{className:"ml-1",style:{color:xe.entity},children:"loop"}),(d.verdict==="own-bkwd"||d.verdict==="association")&&t.jsxs("span",{className:"ml-1 text-gray-400",children:["(owner: ",u.owner,")"]})]},`${u.declaredOn}.${u.slotName}`))})]},l)})})]}),t.jsxs("p",{className:"text-[10px] text-gray-400 dark:text-gray-500 mt-3",children:["A box's ",t.jsx("b",{children:"“N related”"})," count is of distinct classes"," ",t.jsx("i",{children:"outside"})," it, so selecting a class that folds into a merged box can make the number go ",t.jsx("i",{children:"down"}),". Correct, if counter-intuitive."]})]})})}function Re({title:e,children:n}){return t.jsxs("section",{className:"mb-4 last:mb-1",children:[t.jsx("h3",{className:`text-[11px] font-semibold uppercase tracking-wider
                     text-gray-400 dark:text-gray-500 mb-1`,children:e}),n]})}function Gt({caption:e,items:n,className:s}){return t.jsxs("div",{className:s,children:[t.jsx("p",{className:"text-[11px] text-gray-500 dark:text-gray-400 mb-1",children:e}),t.jsx("ul",{className:"flex flex-wrap gap-x-3 gap-y-1",children:n.map(o=>t.jsxs("li",{className:"flex items-center gap-1",children:[t.jsx("span",{className:"inline-block w-3 h-3 rounded-sm border",style:{background:o.swatch??o.color,borderColor:o.color}}),t.jsx("span",{className:"text-[11px]",style:{color:o.color},children:o.label})]},o.label))})]})}const So=!1,Co=!1,vn=c.createContext(null);function Me(){const e=c.useContext(vn);if(!e)throw new Error("useHelp must be used inside <HelpProvider>");return e}const jo=300,Eo=[{id:"graph-canvas-reading",label:"Reading the diagram"},{id:"relation-bar",label:"The relation bar"},{id:"toolbar-siblings",label:"Inheritance and merged boxes"},{id:"node-dismiss",label:"Closing a box"},{id:"copy-link",label:"Sharing what you see"}];function No({onOpenLegend:e,onOpenCases:n,legendOpen:s,casesOpen:o,onClosePanels:r,anyPanelOpen:i}){const{showEntry:a,showAddresses:h,toggleAddresses:d}=Me(),[l,y]=c.useState(!1),S=c.useRef(void 0),u=()=>{S.current!==void 0&&(clearTimeout(S.current),S.current=void 0)},x=()=>{u(),S.current=setTimeout(()=>y(!1),jo)};c.useEffect(()=>u,[]),c.useEffect(()=>{if(!l)return;const g=f=>{f.target?.closest("[data-help-menu]")||y(!1)},m=f=>{f.key==="Escape"&&y(!1)};return document.addEventListener("mousedown",g,!0),document.addEventListener("keydown",m),()=>{document.removeEventListener("mousedown",g,!0),document.removeEventListener("keydown",m)}},[l]);const k=g=>()=>{y(!1),g()};return t.jsxs("span",{"data-help-menu":!0,"data-help-id":"help-menu",className:"relative",onMouseEnter:()=>{u(),y(!0)},onMouseLeave:x,children:[t.jsxs("button",{onClick:()=>y(g=>!g),title:"Legend, example cases and help topics",className:`text-sm underline hover:text-white ${l?"text-white":"text-blue-100"}`,children:["Help ",t.jsx("span",{"aria-hidden":!0,className:"opacity-70",children:"▾"})]}),l&&t.jsxs("div",{className:`absolute right-0 top-full mt-1 z-40 w-60 py-1
                     rounded-md border border-gray-300 dark:border-slate-600
                     bg-white dark:bg-slate-800 shadow-xl
                     text-gray-900 dark:text-gray-100`,children:[t.jsxs(Ye,{onClick:k(e),children:[s?"Hide ownership legend":"Ownership legend",t.jsx(ht,{children:"every relationship in the schema, by rule"})]}),t.jsxs(Ye,{onClick:k(n),children:[o?"Hide example cases":"Example cases",t.jsx(ht,{children:"selections worth looking at"})]}),i&&t.jsxs(Ye,{onClick:k(r),children:["Close all panels",t.jsx(ht,{children:"legend, cases and the detail drawer"})]}),t.jsx(To,{}),Eo.map(g=>t.jsx(Ye,{onClick:k(()=>a(g.id)),children:g.label},g.id)),Co]})]})}function Ye({onClick:e,children:n}){return t.jsx("button",{onClick:e,className:`block w-full text-left px-3 py-1.5 text-xs
                 hover:bg-gray-100 dark:hover:bg-slate-700`,children:n})}function ht({children:e}){return t.jsx("span",{className:"block text-[10px] text-gray-400 dark:text-gray-500",children:e})}function To(){return t.jsx("div",{className:"my-1 border-t border-gray-200 dark:border-slate-700"})}function kn(e){const n=Number(e?.trim());return Number.isFinite(n)&&n>=240?n:void 0}function Sn(e){const n=e?.trim().toLowerCase();return n==="dim"||n==="ring"||n==="none"?n:void 0}function Cn(e){const n=e?.trim().toLowerCase();return n==="left"||n==="right"||n==="top"||n==="bottom"?n:void 0}function jn(e){const n=e?.trim();if(!n)return;const s=Number(n);if(Number.isFinite(s))return{px:s};const o=n.match(/^(-)?(?:anchor|parentBox)\.(width|height)(?:\s*\*\s*(-?[\d.]+))?$/i);if(!o)return;const[,r,i,a]=o,h=a===void 0?1:Number(a);if(Number.isFinite(h))return{of:i.toLowerCase(),times:r?-h:h}}function Ct(e,n){const s=e?.trim();if(!s)return{kind:"help-id",arg:n};if(s==="none")return{kind:"none"};const o=s.indexOf(":");return o===-1?{kind:"help-id",arg:s}:{kind:s.slice(0,o).trim(),arg:s.slice(o+1).trim()}}const Mo="Format",Oo="Walkthrough",Ao=new Set([Mo,"TODO"]),En=/^<\/?(?:details|summary)\b[^>]*>$/i;function ce(e,n){const s=n.toLowerCase();for(const o of e){const r=bt(o);if(r){if(r.name==="beats"&&s!=="beats")return;if(r.name===s)return r.value}}}function bt(e){const n=e.trimStart().match(/^-\s+(.*)$/);if(!n)return;const s=n[1].replace(/\*\*/g,""),o=s.indexOf(":");if(o===-1)return;const r=s.slice(0,o).trim();if(/^[A-Za-z_][A-Za-z0-9_]*$/.test(r))return{name:r.toLowerCase(),value:s.slice(o+1).trim()}}function Nn(e,n){const s=`- **${n}:**`,o=e.findIndex(l=>l.trimStart().startsWith(s));if(o===-1)return;const r=e[o].trimStart().slice(s.length).trim(),i=[];for(let l=o+1;l<e.length&&!(e[l].trimStart().startsWith("- **")||En.test(e[l].trim()));l++)i.push(e[l]);for(;i.length&&i[i.length-1].trim()==="";)i.pop();if(i.length===0)return r;const a=i.filter(l=>l.trim()!=="").map(l=>l.length-l.trimStart().length),h=Math.min(...a),d=i.map(l=>l.slice(h)).join(`
`);return r?`${r}
${d}`:d}function Po(e,n){const s=`- **${n}:**`,o=e.findIndex(i=>i.trimStart().startsWith(s));if(o===-1)return[];const r=[];for(let i=o+1;i<e.length;i++){const a=e[i].trimStart();if(a.startsWith("- **")||a==="")break;a.startsWith("- ")&&r.push(a.slice(2).trim())}return r}function Do(e,n){const s=e.findIndex(a=>bt(a)?.name==="beats");if(s===-1)return;const o=[];let r=null;const i=()=>{r&&o.push(r)};for(let a=s+1;a<e.length;a++){const h=e[a].trimStart();if(e[a].length>0&&!/^\s/.test(e[a])&&bt(e[a])||e[a].length>0&&!/^\s/.test(e[a])&&/^<\/?[a-z]/i.test(h))break;if(h==="")continue;const d=h.match(/^(\d+)\.\s+(.*)$/);if(d){i(),r={text:d[2].trim()};continue}const l=h.match(/^-\s+([A-Za-z]+):\s*(.*)$/);if(l&&r){const[,y,S]=l,u=y.toLowerCase();if(u==="description"){const x=e[a].length-e[a].trimStart().length,k=[];let g=a+1;for(;g<e.length;g++){if(e[g].trim()===""){k.push("");continue}if(e[g].length-e[g].trimStart().length<=x)break;k.push(e[g])}for(;k.length&&k[k.length-1].trim()==="";)k.pop();if(k.length){const m=k.filter(E=>E.trim()!=="").map(E=>E.length-E.trimStart().length),f=Math.min(...m),w=k.map(E=>E.slice(f)).join(`
`);r.description=S?`${S}
${w}`:w}else r.description=S;a=g-1;continue}u==="anchor"?r.anchor=Ct(S,n):u==="action"?r.action=S.trim():u==="change"?r.change=S.trim():u==="only"?(r.change=S.trim(),r.replace=!0):u==="highlight"?r.highlight=Sn(S):u==="width"?r.width=kn(S):u==="position"?r.position=Cn(S):u==="offsetx"?r.offsetX=jn(S):u==="keep"&&(r.keep=S.trim()!=="false");continue}r&&!h.startsWith("-")&&(r.text=`${r.text} ${h}`.trim())}return i(),o.length>0?o:void 0}function Ro(e,n){const s=e.split(`
`),r=s[0].match(/^###\s+(.+)$/);if(!r)return null;const i=r[1].trim(),a=ce(s,"Title")??i,h=Nn(s,"Description")??"",d=Po(s,"Interactions"),l=ce(s,"Shortcut"),y=ce(s,"Context"),S=Ct(ce(s,"Anchor"),i),u=ce(s,"Action"),x=ce(s,"Once"),k=ce(s,"Only"),g=ce(s,"Change"),m=g??k,f=g===void 0&&k!==void 0?!0:void 0,w=Sn(ce(s,"Highlight")),E=kn(ce(s,"Width")),C=Cn(ce(s,"Position")),A=jn(ce(s,"OffsetX")),M=Do(s,i),L=ce(s,"Tour");return{id:i,title:a,description:h,interactions:d,shortcut:l,context:y,anchor:S,action:u,once:x,change:m,replace:f,highlight:w,width:E,position:C,offsetX:A,tour:L===void 0?void 0:L||Oo,order:n,beats:M}}function $o(e,n){const s=e.split(`
`),o=s.findIndex(x=>/^##\s+/.test(x)),r=o===-1?null:s[o].match(/^##\s+(.+)$/),i=r?r[1].trim():"Unknown",a=i.toLowerCase().replace(/[^a-z0-9]+/g,"-"),h=[];for(let x=o+1;x<s.length&&!s[x].startsWith("### ");x++)En.test(s[x].trim())||h.push(s[x]);const d=h.join(`
`).trim(),l=ce(h,"TourMetadata"),y=l===void 0?void 0:{name:l||i,description:Nn(h,"Description")?.trim()??""},S=[],u=e.split(/(?=^### )/m);for(const x of u){if(!x.startsWith("### "))continue;const k=Ro(x.trim(),n());k&&S.push(k)}return{id:a,title:i,body:d,entries:S,tourMeta:y}}function Tn(e){const n=new Set;for(const s of[...e.entries.values()].sort((o,r)=>o.order-r.order))s.tour&&n.add(s.tour);return[...n]}function Mn(e,n){const s=n??Tn(e)[0];return[...e.entries.values()].filter(o=>o.tour!==void 0&&o.tour===s).sort((o,r)=>o.order-r.order)}function ut(e,n){return n<0?e:`${e} ▸${n+1}`}function pt(e){return`### ${e}`}function wt(e,n){const s=[];return Mn(e,n).forEach((o,r)=>{const i=r+1;if(!o.beats||o.beats.length===0){s.push({entry:o,step:i,beatIndex:0,beatCount:0,address:ut(o.id,-1),searchFor:pt(o.id),blocks:[o.description],text:o.description,anchor:o.anchor,action:o.action,change:o.change,replace:o.replace,highlight:o.highlight,width:o.width,position:o.position,offsetX:o.offsetX});return}let a=o.description?[o.description]:[];a.length>0&&s.push({entry:o,step:i,beatIndex:-1,beatCount:o.beats.length,address:ut(o.id,-1),searchFor:pt(o.id),blocks:a,text:a.join(`

`),anchor:o.anchor,action:o.action,change:o.change,replace:o.replace,highlight:o.highlight,width:o.width,position:o.position,offsetX:o.offsetX});let h=o.width;o.beats.forEach((d,l)=>{const y=d.description??"";a=d.keep?[...a,y]:[y],d.width!==void 0&&(h=d.width),s.push({entry:o,step:i,beatIndex:l,beat:d,beatCount:o.beats.length,address:ut(o.id,l),searchFor:pt(o.id),blocks:a,text:a.join(`

`),anchor:d.anchor??o.anchor,action:d.action,highlight:d.highlight??o.highlight,width:h,position:d.position??o.position,offsetX:d.offsetX??o.offsetX,change:d.change,replace:d.replace})})}),s}function Lo(e){const s=e.replace(/<!--[\s\S]*?-->/g,"").trim().split(/(?=^## )/m).map(h=>h.trim()).filter(Boolean),o=[],r=new Map;let i=0;for(const h of s){if(!h.match(/^## /m))continue;const d=h.match(/^##\s+(.+)$/m)?.[1].trim();if(d&&Ao.has(d))continue;const l=$o(h,()=>i++);o.push(l);for(const y of l.entries)r.set(y.id,y)}const a=new Map;for(const h of o)h.tourMeta&&a.set(h.tourMeta.name,h.tourMeta);return{sections:o,entries:r,tourMeta:a}}const Io=/\{\{\s*([a-z][a-z0-9-]*)\s*:\s*([^}]*?)\s*\}\}/gi;function _o(e,n){return!n||!e.includes("{{")?e:e.replace(Io,(s,o,r)=>n[o.toLowerCase()]?.(r)??s)}function Vt(e){const n=new Set;return e.map((s,o)=>({p:s,index:o})).filter(({p:s})=>n.has(s.step)?!1:(n.add(s.step),!0)).map(({p:s,index:o})=>({index:o,step:s.step,title:s.entry.title,beatCount:s.beatCount}))}function On({scope:e,onClose:n}){const{content:s,tours:o,tourMeta:r,tourName:i,tourIndex:a,positions:h,position:d,goToStep:l,startTour:y}=Me();c.useEffect(()=>{const m=f=>{f.key==="Escape"&&n()};return window.addEventListener("keydown",m),()=>window.removeEventListener("keydown",m)},[n]);const S=c.useRef(null);c.useEffect(()=>{const m=S.current;if(!(!m||typeof m.showPopover!="function"))return m.showPopover(),()=>{m.matches(":popover-open")&&m.hidePopover()}},[]);const u=c.useMemo(()=>e==="all"?o.map(m=>({name:m,rows:Vt(wt(s,m))})):[],[e,o,s]),x=d?.step,k=a===null?void 0:i,g=(m,f,w)=>t.jsxs("button",{onClick:w,"aria-current":f?"step":void 0,className:`help-map-step${f?" help-map-step-here":""}`,children:[t.jsx("span",{className:"help-map-num",children:m.step}),t.jsx("span",{className:"help-map-title",children:m.title}),m.beatCount>0&&t.jsx("span",{className:"help-map-beats",title:`${m.beatCount+1} screens in this step`,children:m.beatCount+1})]},m.index);return Yt.createPortal(t.jsx("div",{ref:S,popover:"manual",className:"help-map-backdrop",onMouseDown:n,children:t.jsxs("div",{role:"dialog","aria-label":e==="all"?"All tours":"Tour outline",className:"help-map",onMouseDown:m=>m.stopPropagation(),children:[t.jsxs("div",{className:"help-map-head",children:[t.jsxs("div",{children:[t.jsx("h2",{children:e==="all"?"Tours":k??"This tour"}),t.jsx("p",{children:e==="all"?"Every guided walk, and what is in it. Click any step to start there.":"Click any step to jump to it."})]}),t.jsx("button",{onClick:n,title:"Close (Esc)",className:"help-map-close",children:"✕"})]}),t.jsx("div",{className:"help-map-body",children:e==="tour"?Vt(h).map(m=>g(m,m.step===x,()=>{l(m.index),n()})):u.map(({name:m,rows:f})=>t.jsxs("section",{className:"help-map-tour",children:[t.jsx("button",{className:"help-map-tourname",onClick:()=>{y(m),n()},children:m}),r.get(m)?.description&&t.jsx("p",{className:"help-map-blurb",children:r.get(m).description}),f.map(w=>g(w,k===m&&w.step===x,()=>{k===m?l(w.index):y(m,w.index),n()}))]},m))})]})}),document.body)}function Bo(){const{tours:e,tourMeta:n,startTour:s}=Me(),[o,r]=c.useState(!1),[i,a]=c.useState(!1),h=c.useRef(null);return c.useEffect(()=>{if(!o)return;const d=y=>{y.target?.closest("[data-tour-chooser]")||r(!1)},l=y=>{y.key==="Escape"&&r(!1)};return document.addEventListener("mousedown",d,!0),document.addEventListener("keydown",l),()=>{document.removeEventListener("mousedown",d,!0),document.removeEventListener("keydown",l)}},[o]),e.length===0?null:t.jsxs("span",{"data-tour-chooser":!0,"data-help-id":"tour-chooser",className:"relative",onMouseEnter:()=>r(!0),children:[t.jsx("button",{onClick:()=>r(d=>!d),title:"Guided walks through the app and the model",className:`text-sm font-semibold px-2.5 py-1 rounded-full bg-white/95
                   text-blue-700 shadow-sm hover:bg-white hover:shadow`,children:"Guided tours"}),o&&t.jsxs("div",{ref:h,role:"dialog","aria-label":"Guided tours",className:`absolute right-0 top-full mt-1 z-40 w-80 p-1
                     rounded-md border border-gray-300 dark:border-slate-600
                     bg-white dark:bg-slate-800 shadow-xl
                     text-gray-900 dark:text-gray-100`,children:[t.jsxs("p",{className:"px-3 pt-2 pb-1 text-[11px] text-gray-500 dark:text-gray-400",children:["Each one stands on its own. Leave any tour with ",t.jsx("kbd",{children:"Esc"}),"."]}),t.jsxs("button",{"data-tour-overview":!0,onClick:()=>{r(!1),a(!0)},className:`block w-full text-left px-3 py-2 rounded
                       hover:bg-gray-100 dark:hover:bg-slate-700`,children:[t.jsx("span",{className:"block text-xs font-semibold",children:"Overview"}),t.jsxs("span",{className:"block text-[11px] text-gray-500 dark:text-gray-400",children:["All ",e.length," tours and every step in them — start anywhere."]})]}),t.jsx("div",{className:"my-1 border-t border-gray-200 dark:border-slate-700"}),e.map(d=>t.jsxs("button",{onClick:()=>{r(!1),s(d)},className:`block w-full text-left px-3 py-2 rounded
                         hover:bg-gray-100 dark:hover:bg-slate-700`,children:[t.jsx("span",{className:"block text-xs font-semibold",children:d}),n.get(d)?.description&&t.jsx("span",{className:"block text-[11px] text-gray-500 dark:text-gray-400",children:n.get(d).description})]},d))]}),i&&t.jsx(On,{scope:"all",onClose:()=>a(!1)})]})}const Ho="dmvd.help.showAddresses";function Fo(){const e=document.activeElement;return e instanceof HTMLInputElement||e instanceof HTMLTextAreaElement||e?.getAttribute("contenteditable")==="true"}function Wo(e,n){if(!n)return e;const s=i=>_o(i,n),o=i=>i===void 0?void 0:s(i),r=new Map([...e.entries].map(([i,a])=>[i,{...a,description:s(a.description),interactions:a.interactions.map(s),action:o(a.action),context:o(a.context),beats:a.beats?.map(h=>({...h,description:o(h.description),action:o(h.action)}))}]));return{sections:e.sections.map(i=>({...i,entries:i.entries.map(a=>r.get(a.id)??a),tourMeta:i.tourMeta&&{...i.tourMeta,description:s(i.tourMeta.description)}})),entries:r,tourMeta:new Map([...e.tourMeta].map(([i,a])=>[i,{...a,description:s(a.description)}]))}}function zo({markdown:e,onPushChange:n,onPopChange:s,onJumpChanges:o,onTourStart:r,onTourEnd:i,textResolvers:a,centerOn:h,children:d}){const[l,y]=c.useState(),S=l??a,u=c.useMemo(()=>Wo(Lo(e),S),[e,S]),[x,k]=c.useState(!1),[g,m]=c.useState(null),[f,w]=c.useState(void 0),E=c.useMemo(()=>Tn(u),[u]),C=c.useMemo(()=>wt(u,f),[u,f]),A=c.useMemo(()=>Mn(u,f).length,[u,f]),[M,L]=c.useState(null),[B,G]=c.useState(()=>!1),K=c.useCallback(()=>{G(W=>{const I=!W;try{window.localStorage.setItem(Ho,I?"1":"0")}catch{}return I})},[]),V=c.useCallback(()=>{k(!1),L(null)},[]),$=c.useCallback(()=>L(null),[]),O=c.useCallback(W=>L(W),[]),U=c.useCallback(W=>{const I=C[W];I&&(m(W),L(I.entry.id),I.change!=null&&n&&n(I.change,I.replace))},[C,n]),q=c.useCallback(W=>{C[W+1]?.change!=null&&s&&s();const Q=C[W];Q&&(m(W),L(Q.entry.id))},[C,s]),ne=c.useCallback(W=>{if(g===null||W===g)return;const I=C[W];if(I&&o){if(W>g){const Q=C.slice(g+1,W+1).filter(Y=>Y.change!=null).map(Y=>({query:Y.change,replace:Y.replace}));o(Q,0)}else{const Q=C.slice(W+1,g+1).filter(Y=>Y.change!=null).length;o([],Q)}m(W),L(I.entry.id)}},[g,C,o]),le=c.useCallback((W,I=0)=>{k(!1),w(W);const Q=wt(u,W),Y=Math.min(Math.max(I,0),Math.max(Q.length-1,0)),R=Q[Y];if(!R)return;r?.(),m(Y),L(R.entry.id);const X=Q.slice(0,Y+1).filter(te=>te.change!=null).map(te=>({query:te.change,replace:te.replace}));Y>0&&o?o(X,0):R.change!=null&&n&&n(R.change,R.replace)},[u,n,o,r]),ee=c.useCallback(()=>{m(null),L(null),w(void 0),i?.()},[i]),ae=c.useCallback(()=>{g!==null&&(g+1>=C.length?ee():U(g+1))},[g,C.length,U,ee]),v=c.useCallback(()=>{g!==null&&g>0&&q(g-1)},[g,q]),D=c.useCallback(()=>{g!==null&&ee(),L(null)},[g,ee]),z=c.useCallback(W=>{if(!W)return null;const{kind:I}=W;if(I==="none")return null;const{arg:Q}=W,Y=I==="help-id"?Q:`${I}:${Q}`,R=document.querySelectorAll(`[data-help-id="${CSS.escape(Y)}"]`);return R.length<2?R[0]??null:[...R].find(X=>X.getBoundingClientRect().height>0)??R[0]},[]);c.useEffect(()=>(document.body.classList.toggle("help-mode",x),()=>{document.body.classList.remove("help-mode")}),[x]),c.useEffect(()=>{if(x)return window.addEventListener("blur",V),()=>window.removeEventListener("blur",V)},[x,V]),c.useEffect(()=>{if(!x)return;function W(I){const Q=I.target;if(!Q)return;const Y=Q.closest("[data-help-id]");Y?(I.stopPropagation(),I.preventDefault(),O(Y.getAttribute("data-help-id"))):Q.closest("[data-help-popover]")||$()}return document.addEventListener("click",W,!0),()=>document.removeEventListener("click",W,!0)},[x,O,$]),c.useEffect(()=>{function W(I){if(I.key==="?"&&!Fo()){I.preventDefault(),g===null?le():ee();return}if(I.key==="Escape"&&(x||g!==null||M)){I.preventDefault(),I.stopPropagation(),M&&g===null?$():g!==null?ee():D();return}g!==null&&(I.key==="ArrowRight"&&(I.preventDefault(),ae()),I.key==="ArrowLeft"&&(I.preventDefault(),v()))}return document.addEventListener("keydown",W,!0),()=>document.removeEventListener("keydown",W,!0)},[x,g,M,D,$,ee,le,ae,v]);const se=c.useCallback(()=>h?z(Ct(h,h))?.getBoundingClientRect()??null:null,[h,z]),me=c.useMemo(()=>({setTextResolvers:y,helpMode:x,toggleHelpMode:D,exitHelpMode:V,tourIndex:g,startTour:le,endTour:ee,nextStep:ae,prevStep:v,goToStep:ne,positions:C,position:g===null?void 0:C[g],stepCount:A,tours:E,tourName:f,tourMeta:u.tourMeta,showAddresses:B,toggleAddresses:K,content:u,activeId:M,showEntry:O,dismissEntry:$,resolveAnchor:z,centerRect:se}),[x,D,V,g,le,ee,ae,v,ne,C,A,E,f,B,K,u,M,O,$,z,se]);return t.jsx(vn.Provider,{value:me,children:d})}const vt={a:({href:e,children:n})=>t.jsx("a",{href:e,target:"_blank",rel:"noreferrer",children:n}),blockquote:({children:e})=>t.jsxs("div",{className:"help-popover-alert",role:"note",children:[t.jsx("span",{className:"help-popover-alert-mark","aria-hidden":"true",children:"!"}),t.jsx("div",{children:e})]})};function Qo(e){try{return localStorage.getItem(e)}catch{return null}}function Go(e,n){try{localStorage.setItem(e,n)}catch{}}const An="help-once-",gt="data-help-anchor",qt="data-help-hint",Vo="--help-hint",qo=40;function Ko(e){return e.split(`
`).filter(n=>!/^\s{0,3}>/.test(n)).join(`
`).replace(/\n{3,}/g,`

`).trim()}function Uo(e){return Qo(An+e)==="1"}function Yo(e){Go(An+e,"1")}function Xo(e){return{...vt,blockquote:({children:n})=>t.jsxs("div",{className:"help-popover-alert",role:"note",children:[t.jsx("span",{className:"help-popover-alert-mark","aria-hidden":"true",children:"!"}),t.jsxs("div",{children:[n,t.jsxs("label",{className:"help-popover-alert-once",children:[t.jsx("input",{type:"checkbox",onChange:e}),"Don't show this again"]})]})]})}}function Zo(){const{helpMode:e,tourIndex:n,position:s,positions:o,stepCount:r,content:i,activeId:a,dismissEntry:h,nextStep:d,prevStep:l,endTour:y,showEntry:S,resolveAnchor:u,centerRect:x,showAddresses:k}=Me(),[g,m]=c.useState(!1),f=n!==null,w=a?i.entries.get(a):void 0,E=bn(),C=u,A=f?s?.anchor:w?.anchor,M=(f?s?.highlight:w?.highlight)??"dim",L=()=>{if(!s||s.beatCount===0)return null;const R=s.beatIndex+1;return t.jsx("span",{className:"help-tour-dots",title:`Screen ${R+1} of ${s.beatCount+1} in this step`,children:Array.from({length:s.beatCount},(X,te)=>t.jsx("span",{className:te<R?"help-dot help-dot-on":"help-dot"},te))})},[B,G]=c.useState(!1),[K,V]=c.useState(void 0),[$,O]=c.useState(!1),U=c.useRef(null),[,q]=c.useState(0),ne=w?.once,le=ne!==void 0&&Uo(ne),ee=c.useMemo(()=>ne===void 0?vt:Xo(()=>{Yo(ne),q(R=>R+1)}),[ne]),ae=(f?s?.blocks??[]:[w?.description??""]).map(R=>le?Ko(R):R).filter(Boolean),v=(f?s?.width:void 0)??Math.max(rr(ae.join(`

`)),f?ar():0),D=c.useRef(!1);c.useEffect(()=>{D.current=!1},[a,A]);const z=E.reset;c.useEffect(()=>{z()},[a,n,z]),c.useLayoutEffect(()=>{if(!a){G(!1),V(void 0);return}let R=null;const X=()=>{const he=C(A);he!==R&&(R?.removeAttribute(gt),R=he,G(!!he),V(he?.closest("[data-graph-direction]")?.getAttribute("data-graph-direction")==="RIGHT"?"below":void 0),he&&(he.setAttribute(gt,""),D.current||(D.current=!0,he.scrollIntoView({block:"center",behavior:"smooth"}))))};X();const te=new MutationObserver(X);return te.observe(document.body,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["data-help-id"]}),()=>{te.disconnect(),R?.removeAttribute(gt),G(!1),V(void 0)}},[a,A,C]);const se=600,me=f&&s?.change!=null&&A!==void 0&&A.kind!=="none",[W,I]=c.useState(!1);c.useEffect(()=>{if(!me){I(!0);return}I(!1);const R=window.setTimeout(()=>I(!0),se);return()=>window.clearTimeout(R)},[me,n]);const Q=W||B;c.useEffect(()=>{const R=U.current;R&&(w&&Q?R.matches(":popover-open")||R.showPopover():R.matches(":popover-open")&&R.hidePopover())},[w,Q]),c.useEffect(()=>{(!e||f)&&O(!1)},[e,f]);const Y=c.useMemo(()=>e&&!f?[...i.entries.values()].filter(R=>C(R.anchor)).slice(0,qo).map((R,X)=>({id:R.id,title:R.title,name:`${Vo}-${X}`})):[],[e,f,i,C]);return c.useLayoutEffect(()=>{const R=Y.map(X=>{const te=C(i.entries.get(X.id)?.anchor);return te?.setAttribute(qt,X.name),te}).filter(Boolean);return()=>R.forEach(X=>X.removeAttribute(qt))},[Y,i,C]),t.jsxs(t.Fragment,{children:[B&&a&&M!=="none"&&t.jsx("div",{className:`help-spotlight${M==="ring"?" help-spotlight-ring":""}`}),Y.map(({id:R,title:X,name:te})=>t.jsx("button",{className:"help-hint",title:X??R,style:{positionAnchor:te},onMouseEnter:()=>{$||S(R)},onMouseLeave:()=>{$||h()},onClick:he=>{he.stopPropagation(),O(!0),S(R)},children:"?"},R)),t.jsx("div",{ref:U,popover:"manual","data-help-popover":"","data-anchored":B?"":void 0,className:"help-popover",style:{...ir(B,f?s?.position:void 0,f?s?.offsetX:void 0,v,B?null:x(),K),...E.offset?{positionArea:"none",left:E.offset.left,top:E.offset.top,right:"auto",bottom:"auto",margin:0,transform:"none"}:{}},children:w&&t.jsxs(t.Fragment,{children:[t.jsx("h4",{className:"help-popover-title",onPointerDown:E.onPointerDown,style:{cursor:E.offset?"grabbing":"grab",userSelect:"none"},title:"Drag to move",children:w.title}),f&&s?.action&&t.jsxs("div",{className:"help-popover-action",children:[t.jsx("span",{className:"help-popover-action-mark","aria-hidden":"true",children:"✓"}),t.jsx("div",{children:t.jsx(Qe,{children:s.action})})]}),f&&k&&s?.change&&!s.action&&t.jsxs("div",{className:"help-popover-action",style:{opacity:.85},children:[t.jsx("span",{className:"help-popover-action-mark","aria-hidden":"true",children:"⚠"}),t.jsxs("div",{children:[t.jsx("em",{children:"Authoring:"})," this position changes the app (",t.jsx("code",{children:s.change}),") but has no ",t.jsx("code",{children:"Action:"}),"."]})]}),ae.length>0&&t.jsx("div",{className:"help-popover-body",children:ae.map((R,X,te)=>t.jsx("div",{className:X===te.length-1?void 0:"help-beat-past",children:t.jsx(Qe,{components:ee,children:R})},X))}),w.interactions.length>0&&t.jsx("ul",{className:"help-popover-interactions",children:w.interactions.map((R,X)=>t.jsx("li",{children:t.jsx(Qe,{components:vt,children:R})},X))}),w.shortcut&&t.jsxs("p",{className:"help-popover-shortcut",children:["Shortcut: ",t.jsx("kbd",{children:w.shortcut})]}),w.context&&t.jsx("div",{className:"help-popover-context",children:t.jsx(Qe,{children:w.context})}),f?t.jsxs("div",{className:"help-tour-nav",children:[t.jsxs("span",{className:"help-tour-count",title:`Position ${n+1} of ${o.length}`,children:[s?.step," / ",r]}),L(),t.jsx("button",{className:"help-tour-map-btn",onClick:()=>m(R=>!R),"aria-expanded":g,title:"Show the tour outline",children:"⊞"}),t.jsx("span",{className:"help-tour-spacer"}),t.jsx("button",{onClick:l,disabled:n===0,title:"Previous (← arrow key)",children:"← back"}),t.jsx("button",{onClick:d,className:"help-tour-next",title:"Next (→ arrow key)",children:n+1===o.length?"done":"next →"}),t.jsx("button",{onClick:y,title:"End the tour and undo what it added (Esc)",children:"✕"})]}):t.jsxs("div",{className:"help-tour-nav",children:[t.jsx("span",{className:"help-tour-spacer"}),t.jsx("button",{onClick:()=>{O(!1),h()},children:"close"})]}),k&&t.jsx(Jo,{address:f?s?.address:w.id,searchFor:f?s?.searchFor:`### ${w.id}`})]})}),g&&f&&t.jsx(On,{scope:"tour",onClose:()=>m(!1)})]})}function Jo({address:e,searchFor:n}){const[s,o]=c.useState(!1);return c.useEffect(()=>{if(!s)return;const r=setTimeout(()=>o(!1),1200);return()=>clearTimeout(r)},[s]),!e||!n?null:t.jsxs("button",{type:"button",className:"help-popover-address",title:`Copy “${n}” — search help-content.md for it`,onClick:()=>{navigator.clipboard?.writeText(n).then(()=>o(!0),()=>{})},children:[e,s?" ✓":""]})}const Pn=320,er=320,tr=800,nr=8,sr=24,or=3;function rr(e){const n=e.trim().length;return n===0?Pn:Math.round(Math.min(tr,Math.max(er,Math.sqrt(n*nr*sr*or))))}function ar(){return 393}function ir(e,n,s,o,r,i){const a=window.innerWidth,h=window.innerHeight,d=Math.min(o??Pn,a-16);if(!e){const y=r??new DOMRect(0,0,a,h),S=y.left+y.width/2;return{left:Math.max(8,Math.min(S-d/2,a-d-8)),top:"50%",transform:"translateY(-50%)",maxHeight:`${h-16}px`,width:d}}return{positionArea:n?{right:"inline-end span-block-end",left:"inline-start span-block-end",top:"block-start span-inline-end",bottom:"block-end span-inline-end"}[n]:i==="below"?"block-end span-inline-end":"inline-end span-block-end",width:d,...lr(s)}}function lr(e){return e?{marginLeft:"px"in e?`${e.px}px`:`calc(anchor-size(${e.of}) * ${e.times})`}:{}}const mt=e=>e&&e.trim()?e.trim():void 0;function cr(e){return{"model-description":n=>mt(e.getClassDescription(n)),"enum-description":n=>mt(e.getEnumDetail(n)?.description),"category-label":n=>mt(Xt.find(s=>s.id===n)?.label)}}const dr=`# BDCHM Explorer help

Help + tour content for the dmvd Explorer. This file is dmvd's content; the
authoring format it is written in is specified in
[\`src/help/FORMAT.md\`](../help/FORMAT.md), which belongs to the help package
and knows nothing about BDCHM.

Parsed by [\`parseHelpContent.ts\`](../help/parseHelpContent.ts); pinned by
\`src/test/helpContent.test.ts\`. Package-level design lives in
[docs/HELP_PACKAGE_PLAN.md](../../docs/HELP_PACKAGE_PLAN.md).

<details>
<summary><b>TODO</b></summary>

> Check old draft text and make sure it all got included

3. select MeasurementObservation and highlight observation_type. text:
   - While the relationship between an entity and its enumerations and raw
     data attributes is direct (e.g.,
     \`MeasurementObservation.observation_type\` ==> \`MeasurementObservationTypeEnum\`
     or \`MeasurementObservation.age_at_observation\` ==> \`integer\`), it can be
     related to other entities in more complex ways
     [can we animate this so that step 4 keeps this popover but shows the next bullet, etc?
     not sure best way to represent this in my outline...well, we're going to need a reasonably
     human-readable/writable format for the full tour specs anyway]
     - inheritance, known in modeling parlance as IS_A relationships,
       e.g., \`MeasurementObservation.is_a\` ==> \`Observation\`, or
     - association / ownership / containment, known in modeling parlance as HAS_A relationships,
       e.g., \`Visit.associated_participant\` ==> \`Participant\`.
     A primary goal 
   - Entities can be related to each other through
4. goal is to show all the relationship types. if there are any entities
   that use all four, select one of those, otherwise will have to select
   one that has most and then select another that has the others. steps:
   1. **Selecting an entity** Select an entity by clicking its checkbox;
      the entity will appear in the main panel along with directly related
      entities. There are five ways an entity can be related to another.
   2. highlight row
   3. click checkbox.

</details><!-- end of todo -->

<details open>
<summary><b>Tours</b></summary>

<div style="margin-left: 40px">
<details open>
<summary><b>The BioData Catalyst Harmonized Model</b></summary>

## The BioData Catalyst Harmonized Model
- **TourMetadata:**
- **Description:** Introduction to the model: what it contains and what it's for

### bdchm

> *Introduces the BDCHM, its general context, and the types of data it
> holds. Content only. No app mechanics. adf*
>
> Category steps: one per category, each loading its ⊞ view, with beats
> revealing the story rather than the whole canvas at once. Survey's step
> gets to say the thing the numbers show — it is a self-contained subtree
> that barely touches the rest of the model.

- **Title:** The BioData Catalyst Harmonized Model (BDCHM)
- **Tour:** The BioData Catalyst Harmonized Model
- Only: panels=0
- **Anchor:** none
- **Highlight:** selection-tree
- **Width:** 800
- **Description:** 
  ### Context
  BioData Catalyst ([BDC](https://biodatacatalyst.nhlbi.nih.gov/))
  is a cloud-based ecosystem where researchers can find and work with
  [NHLBI](https://www.nhlbi.nih.gov/) data resources. Studies arrive with
  their own terminologies, units, and file structures, which are
  transformed by the Data Model-Based Ingestion Pipeline
  ([dm-bip](https://linkml.io/dm-bip/)) into a common, harmonized
  [LinkML schema](https://rtiinternational.github.io/NHLBI-BDC-DMC-HM/).
- **Beats:**
  1. sources
     - Keep: true
     - Description:
       ##### Sources
       Nine priority [TOPMed](https://topmed.nhlbi.nih.gov/)
       cohorts (e.g., the Framingham Heart Study and Women's Health Initiative)
       and the [INCLUDE Data Hub](https://portal.includedcc.org/) have been
       harmonized to it so far with more on their way.
  2. contents
     - Keep: true
     - Description:
       ##### Contents
       The model includes 56 entity classes (left panel) with ~340 total attributes
       falling into one of three attribute types:
       - primitive data values (e.g., strings, integers)
       - 52 permissible value sets (e.g., visit categories, units of
         measure, condition codes)
       - about 80 links to other entities indicating ownership or
         containment relationships (e.g., multiple Participant entities
         can "belong" to a single Person entity)


### app-model-mods

- **Title:** What's in the model?
- **Tour:** The BioData Catalyst Harmonized Model
- **Description:** 
  The BDCHM schema provides a flexible, general purpose structure
  for storing clinical trials data. This Explorer categorizes the
  entities specified in the model into six areas to make it easier
  to browse and comprehend. This tour will walk you through each
  category.
- **Anchor:** category-row:admin


### admin-study

- **Title:** Category: Admin / Study
- **Tour:** The BioData Catalyst Harmonized Model
- **Description:**
  Eight classes answer *who was studied, by whom, and under what agreement*.
  Nothing here is a measurement — these are the records every other category
  hangs off. Read the diagram left to right: the study comes first, the
  individual next, and what happened to them last.
- **Anchor:** category-row:admin
- Only: cat=admin
- **Action:** Drew the whole Admin / Study category, the same as pressing its ⊞ button.
- Beats:
  1. ResearchStudyCollection
     - Description:
       ##### ResearchStudyCollection
       {{model-description:ResearchStudyCollection}}
     - Anchor: node-box:ResearchStudyCollection
  2. ResearchStudy
     - Description:
       ##### ResearchStudy
       {{model-description:ResearchStudy}}

       \`part_of\` points at ResearchStudy itself — the loop on this box — so a
       study can be a sub-study of another.
     - Anchor: node-box:ResearchStudy
  3. Organization
     - Description:
       ##### Organization
       {{model-description:Organization}}

       It declares no attribute pointing at anything here. Everything that
       names an Organization — \`Participant.originating_site\`, and the
       \`performed_by\` that Observation, ObservationSet and
       SpecimenCreationActivity declare and their subclasses inherit — is
       declared elsewhere and drawn back at it.
     - Anchor: node-box:Organization
  4. Person
     - Description:
       ##### Person
       {{model-description:Person}}
     - Anchor: node-box:Person
  5. Participant
     - Description:
       ##### Participant
       {{model-description:Participant}}
     - Anchor: node-box:Participant
  6. person vs participant
     - Description:
       ##### One person, several participants
       Person and Participant are the first genuinely modelling-flavoured
       distinction in the schema, and it is worth slowing down for. A
       **Person** is generally a human being. A **Participant** is that person's role in
       one study, and \`associated_person\` is the link. The same person enrolled
       in three studies is three Participants — usually de-identified and
       deliberately untraceable back to the actual person.
     - Anchor: node-box:Participant
  7. Consent
     - Description:
       ##### Consent
       {{model-description:Consent}}

       Both Participant and ResearchStudy own a list of them, so consent is
       recorded per person and per study.
     - Anchor: node-box:Consent
  8. Visit
     - Description:
       ##### Visit
       {{model-description:Visit}}
     - Anchor: node-box:Visit
  9. Demography
     - Description:
       ##### Demography
       {{model-description:Demography}}

       Sex, ethnicity and race sit here rather than on Person. Demography
       points at a Participant, and optionally at the Visit it was recorded
       at — so it is a record ABOUT a participant, not a fixed property of the
       human being.
     - Anchor: node-box:Demography
  10. the spine
     - Description:
       ##### The spine
       Person → Participant → Visit is the path the rest of the model hangs
       off. Clinical, Observations, Laboratory and Files all point back at a
       Participant, a Visit, or both — which is why those categories borrow
       Participant and Visit into their own views. Survey is the exception:
       ten classes and almost no outward references, a self-contained subtree.
     - Anchor: none


### clinical-records

- **Title:** Category: Clinical
- **Tour:** The BioData Catalyst Harmonized Model
- **Description:**
  Eight classes record *what happened to a participant medically*. Every one of
  them is a record OF someone, usually AT an encounter — which is why Person,
  Participant and Visit are drawn here too even though they belong to Admin.
  Take them away and Clinical is a pile of disconnected records.
- **Anchor:** category-row:clinical
- Only: cat=clinical
- **Action:** Drew the whole Clinical category, the same as pressing its ⊞ button.
- Beats:
  1. the borrowed spine
     - Description:
       ##### Three boxes on loan
       Person, Participant and Visit are Admin classes, pinned into this view
       because the category does not mean anything without them. Read the rest
       of the diagram as hanging off Participant: everything to its right is a
       record about that participant.
     - Anchor: node-box:Participant
  2. CauseOfDeath
     - Description:
       ##### CauseOfDeath
       {{model-description:CauseOfDeath}}

       It hangs off Person rather than Participant — the one clinical fact
       recorded about the human being rather than about a study role.
     - Anchor: node-box:CauseOfDeath
  3. Condition
     - Description:
       ##### Condition
       {{model-description:Condition}}
     - Anchor: node-box:Condition
  4. Procedure
     - Description:
       ##### Procedure
       {{model-description:Procedure}}
     - Anchor: node-box:Procedure
  5. Exposure
     - Description:
       ##### Exposure
       {{model-description:Exposure}}

       DrugExposure and DeviceExposure are its subclasses — a medication and a
       foreign object respectively — and the diagram draws them merged into
       Exposure's box rather than as three separate boxes joined by edges.
     - Anchor: node-box:Exposure
  6. ImagingStudy
     - Description:
       ##### ImagingStudy
       {{model-description:ImagingStudy}}
     - Anchor: node-box:ImagingStudy
  7. BodySite
     - Description:
       ##### BodySite
       {{model-description:BodySite}}

       Condition, Procedure and ImagingStudy all point at it — *where* is part
       of what those records are. Anatomy belongs to Laboratory too, where a
       specimen's collection site names one, so the Explorer lists BodySite in
       both categories rather than choosing.
     - Anchor: node-box:BodySite
  8. what the category is for
     - Description:
       ##### What this category is for
       Clinical is the participant's medical history: diagnoses, procedures,
       exposures and imaging, each anchored to a person, a study role, and
       usually a point of contact with the health system. It says what was
       *found* or *done*. What was *measured* is the next category.
     - Anchor: none


### observation-measurement

- **Title:** Category: Observations / Measurements
- **Tour:** The BioData Catalyst Harmonized Model
- **Description:**
  This is where the numbers live. Twelve classes, but only four ideas: an
  **Observation** (one measured thing), an **ObservationSet** (a group of them
  taken together, like a blood panel), and the **Context** an observation was
  made in. Participant, Visit and BodySite are borrowed from elsewhere, because
  an observation is *of* someone, *at* an encounter, and often *somewhere* on a
  body.
- **Anchor:** category-row:observation
- Only: cat=observation
- **Action:** Drew the whole Observations / Measurements category, the same as pressing its ⊞ button.
- Beats:
  1. ObservationSet
     - Description:
       ##### ObservationSet
       {{model-description:ObservationSet}}

       A complete blood count is one ObservationSet holding a dozen
       Observations. \`observations\` is the attribute that owns them, which is
       the edge running rightward out of this box.
     - Anchor: node-box:ObservationSet
  2. Observation
     - Description:
       ##### Observation
       {{model-description:Observation}}

       Key and value: \`observation_type\` says *what was measured*, and one of
       four \`value_\` attributes holds the answer — \`value_quantity\` for a number
       with a unit, plus string, boolean and coded forms. Nearly every measured
       fact in BDCHM is one of these.
     - Anchor: node-box:Observation
  3. the five kinds
     - Description:
       ##### Five kinds of observation
       Observation has five subclasses, and the diagram merges them into one
       box rather than drawing five: **MeasurementObservation** (a clinical
       measurement), **SdohObservation** (social determinants of health),
       **DimensionalObservation** (length, width, area), and
       **SpecimenQualityObservation** and **SpecimenQuantityObservation**,
       which describe a specimen rather than a person. The last two are also
       listed under Laboratory.
     - Anchor: node-box:Observation
  4. sets mirror observations
     - Description:
       ##### The sets mirror them
       ObservationSet has its own subclasses — MeasurementObservationSet,
       SdohObservationSet, DimensionalObservationSet — one per kind of thing
       being grouped. Each owns observations of its matching type. The two
       hierarchies run in parallel, which is why the left of this diagram is
       two stacked merged boxes rather than one.
     - Anchor: node-box:ObservationSet
  5. Context and Activity
     - Description:
       ##### Context and Activity
       {{model-description:Context}} {{model-description:Activity}}

       Every kind of observation can carry a list of Contexts, and a Context
       points at the Activity that produced it — fasting, exercise, a dose
       administered. These are the circumstances that make a number
       interpretable.
     - Anchor: node-box:Context
  6. what the category is for
     - Description:
       ##### What this category is for
       Observations are the measured facts a researcher actually analyses.
       Everything else in the model exists to say *whose* they are, *when* they
       were taken, and *what they mean*. The subclass hierarchy here is the
       largest in BDCHM, and how the diagram draws inheritance gets a tour of
       its own.
     - Anchor: none


### lab-biospecimen

- **Title:** Category: Laboratory / Biospecimen
- **Tour:** The BioData Catalyst Harmonized Model
- **Description:**
  Twelve classes about *physical material* — what was collected from a
  participant, what was done to it, and what was measured on it. Specimen sits
  in the middle and almost everything here is attached to it. Participant is
  the one borrowed class: a specimen comes FROM someone, and that is the only
  outside fact the category needs.
- **Anchor:** category-row:lab
- Only: cat=lab
- **Action:** Drew the whole Laboratory / Biospecimen category, the same as pressing its ⊞ button.
- Beats:
  1. Specimen
     - Description:
       ##### Specimen
       {{model-description:Specimen}}

       \`parent_specimen\` points back at Specimen itself — the loop on this box
       — because an aliquot or a portion is a specimen derived from another
       specimen.
     - Anchor: node-box:Specimen
  2. SpecimenContainer
     - Description:
       ##### SpecimenContainer
       {{model-description:SpecimenContainer}}

       It nests the same way specimens do: \`parent_container\` is a loop, so a
       well sits in a plate.
     - Anchor: node-box:SpecimenContainer
  3. Assay
     - Description:
       ##### Assay
       {{model-description:Assay}}
     - Anchor: node-box:Assay
  4. the four activities
     - Description:
       ##### Four activities
       A specimen owns a history, and each stage is its own class:
       **SpecimenCreationActivity** (collected or derived),
       **SpecimenProcessingActivity** (changed without becoming something new),
       **SpecimenStorageActivity** (kept somewhere) and
       **SpecimenTransportActivity** (moved between places). Four edges leave
       Specimen for them, one per stage.
     - Anchor: node-box:SpecimenCreationActivity
  5. BiologicProduct
     - Description:
       ##### BiologicProduct
       {{model-description:BiologicProduct}}

       \`derived_product\` makes it something a specimen produced — a culture
       grown from a sample rather than the sample itself.
     - Anchor: node-box:BiologicProduct
  6. the specimen observations
     - Description:
       ##### Measuring the specimen
       SpecimenQualityObservation and SpecimenQuantityObservation hang off
       Specimen through \`quality_measure\` and \`quantity_measure\`. They are
       Observations — the same class you just met — pointed at material rather
       than at a person, which is why they are listed in both categories.
     - Anchor: child-header:SpecimenQualityObservation
  7. Substance
     - Description:
       ##### Substance
       {{model-description:Substance}}

       Three different things reach it: an Assay's reagent, a container's
       additive, and an additive used during collection or processing.
     - Anchor: node-box:Substance
  8. what the category is for
     - Description:
       ##### What this category is for
       Laboratory is the chain of custody: material comes off a participant,
       gets created, processed, stored and transported, and has assays and
       quality measures recorded against it. It is the only category that is
       mostly about *things* rather than about records.
     - Anchor: none


### survey-questionnaire

- **Title:** Category: Survey / Questionnaire
- **Tour:** The BioData Catalyst Harmonized Model
- **Description:**
  Ten classes, and almost no connection to the rest of the model. This is the
  one category you can read entirely on its own — nothing outside it needs to
  be borrowed in, and only a couple of attributes reach out. It is two mirrored
  halves: the **questions** on the left, the **answers** on the right.
- **Anchor:** category-row:survey
- Only: cat=survey
- **Action:** Drew the whole Survey / Questionnaire category, the same as pressing its ⊞ button.
- Beats:
  1. Questionnaire
     - Description:
       ##### Questionnaire
       {{model-description:Questionnaire}}
     - Anchor: node-box:Questionnaire
  2. QuestionnaireItem
     - Description:
       ##### QuestionnaireItem
       {{model-description:QuestionnaireItem}}

       \`part_of\` is a loop on this box, which is how a questionnaire nests
       sections inside sections: an item can be a group holding other items.
     - Anchor: node-box:QuestionnaireItem
  3. QuestionnaireResponse
     - Description:
       ##### QuestionnaireResponse
       {{model-description:QuestionnaireResponse}}

       It is the mirror of Questionnaire — one filled-in form against one
       blank one.
     - Anchor: node-box:QuestionnaireResponse
  4. QuestionnaireResponseItem
     - Description:
       ##### QuestionnaireResponseItem
       {{model-description:QuestionnaireResponseItem}}

       And this mirrors QuestionnaireItem. \`has_questionnaire_item\` is the edge
       joining the two halves: an answer knows which question it answers.
     - Anchor: node-box:QuestionnaireResponseItem
  5. the typed values
     - Description:
       ##### One answer, five types
       QuestionnaireResponseValue is a *single-valued answer*, and it has five
       subclasses — one each for a decimal, a boolean, an integer, a TimePoint
       and a string. The diagram merges them into one box. A model can either
       carry one loosely-typed value column or a class per type; BDCHM chose
       the second.
     - Anchor: node-box:QuestionnaireResponseValue
  6. self-contained
     - Description:
       ##### A subtree of its own
       Look at how few edges leave this picture. Almost the only thing Survey
       reaches outward for is the TimePoint a timed answer holds, and the Visit
       a response was collected at. Everywhere else in BDCHM, drawing a
       category means borrowing Participant and Visit to make it legible; here
       it does not.
     - Anchor: none
  7. what the category is for
     - Description:
       ##### What this category is for
       Survey holds instruments and their responses: the form as designed, and
       the form as filled in, kept deliberately apart so the same questionnaire
       can be answered many times. Its shape is borrowed from
       [FHIR](https://www.hl7.org/fhir/questionnaire.html), which is why it
       reads differently from the rest of the model.
     - Anchor: none


### other-files

- **Title:** Category: Files / Other
- **Tour:** The BioData Catalyst Harmonized Model
- **Description:**
  The leftovers, and they are leftovers of two quite different kinds: **files**
  attached to a participant, and **value types** — the small structured classes
  that other classes use to hold a number or a date. Both were pulled out here
  because they belong to no one category; they are used by all of them.
- **Anchor:** category-row:other
- Only: cat=other
- **Action:** Drew the whole Files / Other category, the same as pressing its ⊞ button.
- Beats:
  1. File
     - Description:
       ##### File
       {{model-description:File}}

       \`derived_from\` is a loop: a converted or processed file remembers the
       one it came from.
     - Anchor: node-box:File
  2. ImagingFile
     - Description:
       ##### ImagingFile
       {{model-description:ImagingFile}}

       It is File's only subclass today, so the diagram merges it into File's
       box rather than drawing two. Its extra rows — modality, series, an
       anatomical site — are the DICOM metadata a plain file has no room for,
       and \`related_imaging_study\` ties it back to Clinical's ImagingStudy,
       which is off this canvas.
     - Anchor: node-box:File
  3. Document
     - Description:
       ##### Document
       {{model-description:Document}}

       It stands alone on this canvas. Its \`focus\` attribute points at the
       universal root class, which the Explorer does not draw, and
       \`related_document\` reaches it from Specimen — so both of its edges land
       outside this category.
     - Anchor: node-box:Document
  4. Quantity
     - Description:
       ##### Quantity
       {{model-description:Quantity}}

       This is the most reused class in BDCHM. Observations of every kind hold
       their value in one; so do an assay's detection limits, a substance's
       amount, a procedure's quantity and a processing step's duration. It has
       no edges here because everything that points at it lives in another
       category.
     - Anchor: node-box:Quantity
  5. TimePoint and TimePeriod
     - Description:
       ##### TimePoint and TimePeriod
       {{model-description:TimePoint}}

       A TimePeriod is just a start and an end, both TimePoints — the two edges
       between those boxes. And \`index_time_point\` is a loop on TimePoint,
       which is what makes "six months after enrolment" expressible without
       knowing the calendar date.
     - Anchor: node-box:TimePoint
  6. what the category is for
     - Description:
       ##### What this category is for
       Nothing here is a subject of study. These are the building blocks
       everything else is made of — a number with a unit, a moment in time, a
       file on disk. A researcher reading the model meets them constantly and
       rarely needs to think about them, which is exactly why they were given
       their own corner rather than left scattered through the other five.
     - Anchor: none


### why

- **Title:** BDCHM Explorer
- **Tour:** The BioData Catalyst Harmonized Model
- **Description:** 
  BDCHM and the ingestion pipeline are built using [LinkML](https://linkml.io/).
  Neither the raw LinkML [YAML file](https://github.com/RTIInternational/NHLBI-BDC-DMC-HM/blob/main/src/bdchm/schema/bdchm.yaml)
  nor the LinkML [generated documentation](https://rtiinternational.github.io/NHLBI-BDC-DMC-HM/)
  are easy to grasp given that BDCHM's over 4,000-line schema includes around
  225 total attributes, 55 distinct class entities, 50 permissible value sets,
  7 primitive data types, and 80 relationships between class entities. 
  Yet doing almost anything involving BDCHM would require a basic, overall
  understanding of its structure. You may want to use BDCHM:
  - to analyze data harmonized to it (using [BDC's tools](https://biodatacatalyst.nhlbi.nih.gov/use-bdc/analyze-data/)
    or otherwise);
  - to harmonize your own data to it;
  - design new studies pre-harmonized to it; or
  - use it for ideas or inspiration in designing your own data models.

  The **BDCHM Explorer** provides a single-page, highly interactive interface
  allowing you to easily see details of and relationships between specific
  entities or neighborhoods around entities you select.
- **Anchor:** none
- **Change:**
- **Width:** 700

</details><!-- end of BDCHM tour -->
</div>

<div style="margin-left: 40px">
<details open>
<summary><b>Getting oriented</b></summary>

## Getting oriented
- **TourMetadata:**
- **Description:** How to use the BDCHM Explorer

### bdchm-entities

- **Title:** Model entities
- **Tour:** Getting oriented
- Only: panels=0
- **Anchor:** none
- **Highlight:** selection-tree
- **Width:** 800
- **Description:** [put some intro text here]
- **Beats:**
  1. selection
     - Description: The left panel lists every class in the model.
     - Anchor: entity-row:Person
     - Width: 300
  2. display
     - Keep: true
     - Description: Ticking one draws it. Person is now on the canvas.
     - Change: sel=Person
     - Anchor: node-box:Person
  3. relationships
     - Description:
       Entities can be related to each other in a variety of ways.
     - Change: sel=Participant~Visit~Observation
     - Anchor: node-box:Observation

</details><!-- end of Getting oriented tour -->
</div>

<div style="margin-left: 40px">
<details>
<summary><b>Walkthrough</b></summary>

## Walkthrough
- **TourMetadata:**
- **Description:** The original tour. Parts will be used for specific tours now.

### selection-tree

- **Title:** Entities
- **Tour:** Walkthrough
- **Anchor:** selection-tree
- **Description:** A LinkML schema defines classes representing a data model's
  entities. The left panel lists them, grouped into categories for convenience,
  though these categories are not actually part of the schema.
- **Beats:** <!-- these are just copied from below, need to get beats working
              right before authoring -->
  1. tick a checkbox
     - Description: In order to select an entity for display, click its checkbox
     - Anchor: entity-row:Person
  2. the box that appears
     - Description:
       The Person box shows the entity name, a dismiss (x) icon, a menu
       for displaying boxes for related entities, and a list of this entity's
       attributes.
     - Anchor: node-box:Person
     - Change: sel=Person
     - Action: I clicked the Person checkbox and the Person entity appeared in the viewing panel.
  3. the related counts
     - Description:
       Hover over the \`← 2\` or \`1 →\` counts to list the entities related to this
       one, and click any of them to display it.
     - Anchor: node-box:Person
     - Highlight: none

### entities

- **Title:** Entities
- **Tour:** Walkthrough
- **Anchor:** selection-tree
- **Description:** A LinkML schema defines classes representing a data model's
  entities. A class defines a set of slots or attributes (like columns in
  a database table) which can hold
  - other entities,
  - permissible value sets (enumerations),
  - or raw data types (strings, integers, etc.)

<!--
  TODO(siggie): translated faithfully, but note what this replaced. The
  entry that used to sit at tour position 2 was different copy entirely
  ("Choosing what to look at" — ownership nesting, what the checkbox vs the
  arrow vs the name each do, and a Context about an entity appearing in
  more than one place). Your draft's step 2 does not cover any of that.
  It is preserved verbatim as \`selection-tree-mechanics\` below, help-only,
  so nothing is lost. Decide whether your step 2 should absorb it.
-->

### relationship-kinds

- **Title:** How entities relate
- **Tour:** Walkthrough
- **Description:** 
  **[sg] this text is terrible. do we have something better?**
  While the relationship between an entity and its
  enumerations and raw data attributes is direct (e.g.,
  \`MeasurementObservation.observation_type\`
  → \`MeasurementObservationTypeEnum\`, or
  \`MeasurementObservation.age_at_observation\` → \`integer\`), it can be
  related to other entities in more complex ways.
 
- **Action:** Selected MeasurementObservation for you, and highlighted its \`observation_type\` attribute.
- **Anchor:** slot-row:MeasurementObservation.observation_type
- **Change:** sel=MeasurementObservation
- **Beats:**
  1. inheritance
     - Description: **Inheritance**, known in modeling parlance as IS_A relationships — e.g. \`MeasurementObservation.is_a\` → \`Observation\`.
     - Anchor: child-header:MeasurementObservation
  2. has-a
     - Description: **Association / ownership / containment**, known in modeling parlance as HAS_A relationships — e.g. \`Visit.associated_participant\` → \`Participant\`.
     - Anchor: child-header:MeasurementObservation
  3. UNFINISHED
     - Description: A primary goal
     - Anchor: none
  4. UNFINISHED
     - Description: Entities can be related to each other through
     - Anchor: none

<!--
  TODO(siggie): beats 4 and 5 are your two truncated sentences, carried
  over exactly as they trail off. Nothing invented. They will render as
  broken fragments in the tour until you finish them — that is deliberate,
  so they cannot ship unnoticed.

  [sg] the "solutions" below are not good

  TODO(siggie): this step is where you asked "can we animate this so that
  step 4 keeps this popover but shows the next bullet, etc?" Beats are the
  answer, and as of 2026-08-28 they ADD rather than replace, which is what
  you actually asked for: the Description stays on screen and each beat
  appears below it, earlier ones dimmed. The old beat 1 existed only to
  repeat the Description so it would not vanish -- deleted, with its
  \`slot-row\` anchor moved up to the entry where the step now starts.

  TODO(siggie): your draft numbers this "3" and puts "select
  MeasurementObservation and highlight observation_type" in the step title.
  The Action: field now says that out loud, which is the fix for the bug
  where a step changed the app silently.
-->

### selection-tree-mechanics

- **Title:** Choosing what to look at
- **Description:** Entities are arranged by **ownership**: an entity is nested under whatever owns it. Tick a checkbox to put an entity on the diagram. The checkbox is the only thing that selects — clicking the row or the arrow just opens and closes the tree.
- **Interactions:**
  - Checkbox — add or remove that entity from the diagram.
  - Arrow — expand or collapse, without changing the selection.
  - Name — open the details panel without changing the selection.
- **Context:** An entity can sit in more than one place in the tree, because things can be owned by more than one kind of thing. The widget marks the duplicates for you.
- **Anchor:** selection-tree

### graph-canvas

- **Title:** Selecting an entity
- **Tour:** Walkthrough
- **Description:** Select an entity by clicking its checkbox and it appears in the main panel. Only what you select is drawn — related entities are reached from the box's relation bar. There are five ways an entity can be related to another.
- **Action:** Cleared the diagram and drew just Participant and BodySite. You would normally do this by ticking them in the tree on the left.
- **Only:** sel=BodySite~Participant
- **Beats:**
  1. only what you select
     - Description: Select an entity by clicking its checkbox and it appears in the main panel. Only what you select is drawn. There are five ways an entity can be related to another.
     - Anchor: selection-tree
  2. the row
     - Description: This is the entity's row in the selection panel.
     - Anchor: entity-row:Participant
  3. the checkbox
     - Description: Clicking the checkbox is what puts it on the diagram.
     - Anchor: entity-checkbox:Participant

<!--
  TODO(siggie): your draft's step 4 says "goal is to show all the
  relationship types. if there are any entities that use all four, select
  one of those, otherwise will have to select one that has most and then
  select another that has the others." That is an instruction to yourself,
  not copy — it is NOT translated into a beat. The \`Change:\` above still
  carries the old \`sel=BodySite~Participant\`; pick the entity or entities
  that actually demonstrate all five once you have checked which do.

  This step now REPLACES the diagram (\`Only:\` rather than \`Change:\`, added
  2026-09-05), so MeasurementObservation from the previous step is gone and
  the canvas is the clean two-box example the copy reads as. Stepping BACK
  restores it.

  Note the count: your draft says "five ways" here and you confirmed five
  is right (four ownership kinds + associations). The stale "four" note is
  gone.

  TODO(siggie): this entry kept the id \`graph-canvas\` so its help-only
  content is not orphaned, but your draft's step 4 is about the SELECTION
  panel, not the canvas. The old canvas copy is preserved as
  \`graph-canvas-reading\` below. Consider renaming this entry.
-->

</details><!-- end of Walkthrough tour -->
</div>

</details><!-- end of Tours -->

<details>
<summary><b>Non-tour help items</b></summary>

### graph-canvas-reading

- **Title:** The diagram
- **Description:** Each box is an entity; each row inside it is one of that entity's attributes. Lines run from an owner to the thing it owns, so reading left to right is reading "contains".
- **Interactions:**
  - Click a box to open its details.
  - Drag a box to move it; drag the background to pan.
  - Click an attribute row that names an entity to pull that entity onto the diagram.
- **Anchor:** graph-canvas

### relation-bar

- **Title:** The relation bar
- **Description:** Every entity related to this one, split by which side of the diagram it sits on. **← N** counts the entities this one belongs to, drawn to its left; **M →** counts the ones it owns, drawn to its right. Hovering either opens the list.
- **Interactions:**
  - Hover **← N** or **M →** to list the relationships on that side.
  - Each row names the attribute that creates the relationship, draws the edge the way the diagram draws it, and gives the cardinality and the entity at the other end.
  - Click a row to put that entity on the diagram — which also ticks its checkbox on the left. Click it again to take it off; entities already drawn are dimmed.
  - "add all N" / "hide all N" draws or clears the whole side at once. "hide all" removes every entity on that side, including ones you had selected yourself.
  - **ⓘ** opens an entity's details without adding it to the diagram.
- **Context:** Entities are laid out so that owners come first, so everything that owns this one is to its left and everything it owns is to its right — that is all the two counts mean. The little edge on each row says something different: **which end carries the arrowhead**, and so which entity declares the attribute. Both kinds turn up on both sides. Of the four entities that own an Observation, three do because Observation points at them, and one because ObservationSet collects it. Organization is the extreme case: it owns thirteen kinds of thing and declares no attribute for any of them, so every row on its owned side points back at it.

### node-dismiss

- **Title:** Closing a box
- **Description:** Removes this entity from the diagram and unticks its checkbox on the left. A merged box removes every entity in it at once.

### toolbar-siblings

- **Title:** Merged inheritance boxes
- **Description:** When several entities on the diagram share a parent, they collapse into one box titled by that parent. Rows the parent defines come first, then a coloured header per child followed by the rows that child adds.
- **Interactions:**
  - Toggle off to draw each entity as its own separate box.
- **Context:** Lines leaving a child's rows take that child's colour, so you can trace a line back to the block it came from.

</details>

<details>
<summary><b>Sharing what you see</b></summary>

## Sharing what you see

### copy-link

- **Title:** Copy link
- **Tour:** Walkthrough
- **Description:** Copies a link that reproduces **exactly** this view — the selection and the toolbar settings. Anyone opening it sees what you see.
- **Interactions:**
  - Click to copy; the URL bar always holds the same link.
- **Context:** Settings travel in the link, so a diagram you set up deliberately does not get redrawn with someone else's preferences.
- **Change:**

<!--  probably not necessary; you'd already be there by the time you can display them, right?
### help-menu

- **Title:** Help
- **Description:** Everything explaining the diagram, in one menu.
  - **Tours** — guided walks, simplest first. Start anywhere: each one stands on its own, and you can leave with **Esc**.
  - **Ownership legend** — what the arrows, colors and toolbar buttons mean, and every relationship in the schema grouped by the rule that classified it.
  - **Example cases** — named selections that show particular routing and inheritance situations. Useful for seeing what the diagram does with the awkward cases.

  The legend and the cases open as separate panels, so you can keep the legend up while you flip through cases.

### help-button

- **Title:** Help and tour
- **Description:** **Take the tour** for a short guided walk through the app. Press \`?\` anywhere to start it, and again (or \`Esc\`) to leave.
- **Shortcut:** ?
-->

</details>
`,jt={inTour:!1,held:[],tempHeld:[],tour:[],region:0,tourStates:[],scalars:{}},hr="~";function Kt(e,n){return e&&n.includes(e)?e:null}function Dn(e,n=!1){const s=new URLSearchParams(e),o={};if(s.get("panels")==="0"){for(const d of rn)o[d]=!1;o.detail=null}s.has("detail")&&(o.detail=s.get("detail")||null),s.has("roots")&&(o.roots=s.get("roots")==="1"),s.has("sibs")&&(o.sibs=s.get("sibs")==="1"),s.has("legend")&&(o.legend=s.get("legend")==="1"),s.has("cases")&&(o.cases=s.get("cases")==="1");const r=Kt(s.get("dir"),["RIGHT","DOWN"]);r&&(o.dir=r);const i=Kt(s.get("merge"),["near","far","bend","off"]);i&&(o.merge=i);const a=s.get("sel"),h=a?a.split(hr).filter(Boolean):an(s);return n?{sel:h,scalars:o,replace:!0}:{sel:h,scalars:o}}function Be(e,n){return[...new Set([...e,...n])]}function ur(e){return{...jt,inTour:!0,held:[...e]}}function pr(){return jt}function gr(e){return Be(e.held,e.tempHeld)}function Rn(e,n){const s=n.replace?e.region+1:e.region,o=n.replace?[...n.sel]:Be(e.tour,n.sel),r={...e.scalars,...n.scalars};return{...e,tour:o,region:s,scalars:r,tourStates:[...e.tourStates,{sel:o,scalars:r,region:s}]}}function $n(e){if(e.tourStates.length===0)return e;const n=e.tourStates.slice(0,-1),s=n[n.length-1];return{...e,tourStates:n,tour:s?s.sel:[],region:s?s.region:0}}function Et(e){return e.region>0}function mr(e,n){if(!e.inTour)return e;const s=Et(e)?"tempHeld":"held";return e[s].includes(n)?e:{...e,[s]:[...e[s],n]}}function fr(e,n){if(!e.inTour)return e;const s=o=>o.filter(r=>r!==n);return{...e,tour:s(e.tour),tempHeld:s(e.tempHeld),held:Et(e)?e.held:s(e.held)}}function Nt(e,n){if(!n.inTour)return e;const s=Et(n)?Be(n.tour,n.tempHeld):Be(Be(n.tour,n.tempHeld),n.held);return{...e,...n.scalars,sel:s}}function yr(){const{modelData:e,loading:n,error:s}=ns(),o=c.useMemo(()=>e?new ss(e):null,[e]),{setTextResolvers:r}=Me(),i=c.useMemo(()=>o?cr(o):void 0,[o]);c.useEffect(()=>r(i),[i,r]);const a=c.useMemo(()=>fe(),[]),[h,d]=c.useState(()=>new Set(a.sel)),[l,y]=c.useState(a.detail),[S,u]=c.useState(!1),x=c.useRef(!1),[k,g]=c.useState("list"),[m,f]=c.useState(a.roots),[w,E]=c.useState(a.sibs),[C,A]=c.useState(a.dir),[M,L]=c.useState(a.merge),[B,G]=c.useState(a.cases),[K,V]=c.useState(a.legend),[$,O]=c.useState(!1),U=c.useCallback(v=>{d(new Set(v.sel)),f(!!v.roots),y(null)},[]);c.useEffect(()=>{const v=()=>{const D=fe();d(new Set(D.sel)),y(D.detail),f(D.roots),E(D.sibs),A(D.dir),L(D.merge),V(D.legend),G(D.cases)};return window.addEventListener("popstate",v),window.addEventListener("explore:state-from-url",v),()=>{window.removeEventListener("popstate",v),window.removeEventListener("explore:state-from-url",v)}},[]),c.useEffect(()=>{const v={sel:[...h],detail:l,roots:m,sibs:w,dir:C,merge:M,legend:K,cases:B},D=x.current;x.current=!1,ln(v,{push:D})},[h,l,m,w,C,M,K,B]);const q=c.useCallback(v=>{Te(v,!fe().sel.includes(v)),d(D=>{const z=new Set(D);return z.has(v)?z.delete(v):z.add(v),z})},[]),ne=c.useCallback(v=>{Te(v,!0),d(D=>D.has(v)?D:new Set(D).add(v))},[]),le=c.useCallback(v=>{Te(v,!1),d(D=>{if(!D.has(v))return D;const z=new Set(D);return z.delete(v),z})},[]),ee=c.useCallback(v=>{d(z=>z.size===v.length&&v.every(se=>z.has(se))?z:(x.current=!0,new Set(v)));const D=new Set(v);for(const z of fe().sel)D.has(z)||Te(z,!1);for(const z of v)Te(z,!0)},[]),ae=c.useCallback(()=>{for(const v of fe().sel)Te(v,!1);d(new Set),y(null),u(!1),f(!1)},[]);return s?t.jsxs("div",{className:"p-8 text-red-600",children:["Failed to load model data: ",String(s)]}):n||!o?t.jsx("div",{className:"p-8 text-gray-400",children:"Loading model…"}):t.jsxs("div",{className:"relative flex flex-col h-screen bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100",children:[t.jsxs("header",{className:"flex items-center justify-between px-4 py-2 bg-blue-600 text-white shrink-0",children:[t.jsxs("div",{children:[t.jsx("h1",{"data-help-id":"app-title",className:"text-lg font-bold leading-tight cursor-pointer hover:opacity-80 transition-opacity",onClick:ae,title:"Click to clear the selection and reset the view",children:"BDCHM Explorer"}),t.jsx("p",{className:"text-xs text-blue-100",children:"BioData Catalyst Harmonized Model"})]}),t.jsxs("div",{className:"flex items-center gap-4",children:[t.jsx(Cr,{}),t.jsx(Bo,{}),t.jsx(No,{onOpenLegend:()=>V(v=>!v),onOpenCases:()=>G(v=>!v),legendOpen:K,casesOpen:B,anyPanelOpen:K||B||l!==null,onClosePanels:()=>{V(!1),G(!1),y(null)}}),t.jsx("button",{onClick:async()=>{const v=Zs({sel:[...h],detail:l,roots:m,sibs:w,dir:C,merge:M,legend:K,cases:B});try{await navigator.clipboard.writeText(v),O(!0),window.setTimeout(()=>O(!1),1500)}catch{O(!1),window.prompt("Copy this link:",v)}},"data-help-id":"copy-link",className:"text-sm underline text-blue-100 hover:text-white",title:"Copy a link that reproduces exactly this view, settings included",children:$?"✓ copied":"copy link"}),t.jsx("a",{href:"/dynamic-model-var-docs/previous.html",className:"text-sm underline text-blue-100 hover:text-white",children:"previous views"}),t.jsx("a",{href:"https://github.com/Sigfried/dynamic-model-var-docs",target:"_blank",rel:"noopener noreferrer",className:"text-blue-100 hover:text-white",title:"Source code on GitHub","aria-label":"Source code on GitHub",children:t.jsx("svg",{viewBox:"0 0 16 16",width:"18",height:"18",fill:"currentColor","aria-hidden":!0,children:t.jsx("path",{d:"M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"})})})]})]}),K&&t.jsx(ko,{onClose:()=>V(!1),onSelect:v=>U({name:"ad hoc",note:"",sel:v}),dataService:o}),B&&t.jsx(xo,{onClose:()=>G(!1),onApply:U,selectedIds:h,dataService:o,offset:K}),t.jsxs("div",{className:"flex-1 flex min-h-0",children:[S?t.jsxs("button",{onClick:()=>u(!1),title:"Show entity selection",className:`shrink-0 w-8 border-r border-gray-200 dark:border-slate-700
                       bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700
                       flex flex-col items-center gap-2 py-2 text-gray-400`,children:[t.jsx("span",{className:"text-xs",children:"▶"}),t.jsxs("span",{className:"text-[10px] uppercase tracking-wider [writing-mode:vertical-rl]",children:[o.getConceptLabel("entity",!0),h.size>0?` (${h.size})`:""]})]}):t.jsxs("div",{className:"w-80 shrink-0 flex flex-col min-h-0 border-r border-gray-200 dark:border-slate-700",children:[t.jsx("div",{className:"flex-1 overflow-y-auto min-h-0","data-help-id":"selection-tree",children:k==="tree"?t.jsx(gs,{dataService:o,selectedIds:h,onToggle:q,onShowDetail:y}):t.jsx(ps,{dataService:o,selectedIds:h,onToggle:q,onShowCategory:ee})}),t.jsx("button",{onClick:()=>g(v=>v==="tree"?"list":"tree"),title:"Switch between the ownership tree and the flat category list",className:`shrink-0 px-3 py-1 text-xs text-gray-400 border-t border-gray-200
                         dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 text-left`,children:k==="tree"?"☰ flat list":"⑃ tree"}),t.jsx("button",{onClick:()=>u(!0),title:"Hide entity selection",className:`shrink-0 px-3 py-1 text-xs text-gray-400 border-t border-gray-200
                         dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 text-left`,children:"◀ Hide"})]}),t.jsx("div",{className:"flex-1 min-w-0","data-help-id":"graph-canvas",children:h.size===0?t.jsx("div",{className:"h-full flex items-center justify-center text-sm text-gray-400 p-8",children:"Select entities on the left to build the ownership subgraph."}):t.jsx(uo,{dataService:o,selectedIds:h,onNodeClick:y,onAdd:ne,onRemove:le,pathToRoot:m,onTogglePathToRoot:()=>f(v=>!v),direction:C,setDirection:A,mergeMode:M,setMergeMode:L,mergeSibs:w,setMergeSibs:E})}),l&&t.jsx(po,{classId:l,dataService:o,onClose:()=>y(null),onNavigate:y,isSelected:h.has(l),onToggleSelect:q})]})]})}let oe=jt;function Te(e,n){oe=n?mr(oe,e):fr(oe,e)}function Ze(e){ln(e),window.dispatchEvent(new Event("explore:state-from-url"))}function xr(){oe=ur(fe().sel)}function br(){if(!oe.inTour)return;const e=gr(oe),n=fe();oe=pr(),Ze({...n,sel:e})}function wr(e,n=!1){oe=Rn(oe,Dn(e,n)),Ze(Nt(fe(),oe))}function vr(){oe=$n(oe),Ze(Nt(fe(),oe))}function kr(e,n){for(let s=0;s<n;s++)oe=$n(oe);for(const s of e)oe=Rn(oe,Dn(s.query,s.replace));Ze(Nt(fe(),oe))}function Sr(){return t.jsxs(zo,{markdown:dr,onPushChange:wr,onPopChange:vr,onJumpChanges:kr,onTourStart:xr,onTourEnd:br,children:[t.jsx(yr,{}),t.jsx(Zo,{})]})}function Cr(){const{helpMode:e,toggleHelpMode:n,startTour:s}=Me();return c.useEffect(()=>{Us()&&s()},[]),t.jsx("span",{className:"flex items-center gap-2","data-help-id":"help-button",children:So})}os.createRoot(document.getElementById("root")).render(t.jsx(c.StrictMode,{children:t.jsx(Sr,{})}));
