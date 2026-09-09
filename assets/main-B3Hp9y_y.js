import{i as Dt,p as vn,r as p,j as t,R as xe,a as kn,g as Sn,E as ae,b as Rt,c as $t,S as Cn,d as jn,e as Nn,s as En,w as Tn,f as On,h as Mn,m as An,k as Pn,l as Dn,M as _e,u as Rn,D as $n,n as Ln}from"./index-CtBXVaTv.js";function Lt(e){return[...new Set([...e.classIds,...e.pins])]}const In=e=>`entity-row:${e}`,_n=e=>`entity-checkbox:${e}`,Bn=e=>`category-row:${e}`,Hn=e=>`node-box:${e}`,Fn=e=>`child-header:${e}`,Wn=(e,n)=>`slot-row:${e}.${n}`,It=e=>Dt(e.id)?vn(e.id):e.id,zn=e=>Hn(It(e)),Qn=(e,n)=>Wn(n.declaringClass??It(e),n.slot);function Gn({dataService:e,selectedIds:n,onToggle:s,onShowCategory:o}){const r=p.useMemo(()=>e.getCategoryTrees(),[e]),[i,a]=p.useState(new Set),h=l=>a(f=>{const b=new Set(f);return b.has(l)?b.delete(l):b.add(l),b}),d=r.reduce((l,f)=>l+f.classIds.length,0);return t.jsxs("div",{className:"text-sm",children:[t.jsx("div",{className:"flex items-baseline gap-2 px-3 py-2 border-b border-gray-200 dark:border-slate-700",children:t.jsxs("span",{className:"font-semibold flex-1",children:[e.getConceptLabel("entity",!0)," (",d,")"]})}),r.map(l=>{const f=i.has(l.id),b=l.classIds.filter(u=>n.has(u)).length;return t.jsxs("div",{children:[t.jsxs("div",{"data-help-id":Bn(l.id),className:`w-full flex items-stretch font-medium
                         bg-gray-50 dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700`,children:[t.jsxs("button",{type:"button",onClick:()=>h(l.id),className:`flex-1 min-w-0 flex items-center gap-2 px-3 py-1.5 text-left
                           hover:bg-gray-100 dark:hover:bg-slate-700`,children:[t.jsx("span",{className:"text-xs text-gray-400",children:f?"▶":"▼"}),t.jsx("span",{className:"flex-1 truncate",children:l.label}),b>0&&t.jsxs("span",{className:"text-xs text-gray-400",children:[b," / ",l.classIds.length]})]}),o&&t.jsx("button",{type:"button","data-show-category":l.id,title:`Draw the ${l.label} content view — replaces the canvas`,onClick:()=>o(Lt(l)),className:`px-2.5 shrink-0 text-gray-400 border-l border-gray-100
                             dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700
                             hover:text-blue-600 dark:hover:text-sky-400`,children:"⊞"})]}),!f&&l.roots.map(u=>t.jsx(_t,{node:u,depth:0,selectedIds:n,onToggle:s},u.classId))]},l.id)})]})}function _t({node:e,depth:n,selectedIds:s,onToggle:o}){const{classId:r}=e;return t.jsxs(t.Fragment,{children:[t.jsxs("label",{"data-class-row":r,"data-help-id":In(r),className:`flex items-center gap-2 pr-3 py-1 cursor-pointer
                    hover:bg-blue-50 dark:hover:bg-slate-800
                    ${s.has(r)?"bg-blue-50 dark:bg-slate-800":""}`,style:{paddingLeft:`${.75+n*1}rem`},children:[t.jsx("input",{type:"checkbox","data-help-id":_n(r),checked:s.has(r),onChange:()=>o(r)}),t.jsxs("span",{className:"flex-1 min-w-0 truncate",children:[t.jsx("span",{className:"font-mono text-xs",children:r}),e.outOfCategoryParent&&t.jsxs("span",{className:"ml-1 text-[10px] text-gray-400 dark:text-slate-500",title:`Extends ${e.outOfCategoryParent}, which is in another category`,children:["↳ ",e.outOfCategoryParent]})]})]}),e.children.map(i=>t.jsx(_t,{node:i,depth:n+1,selectedIds:s,onToggle:o},i.classId))]})}function Vn({dataService:e,selectedIds:n,onToggle:s,onShowDetail:o}){const r=p.useMemo(()=>e.getContainmentNodes(),[e]),i=p.useMemo(()=>e.getEntityColumns(),[e]),a=p.useMemo(()=>{const h=new Map;for(const d of r){const l=e.getRangeCountsByType(d.id);h.set(d.id,{props:e.getSlotCount(d.id),cls:l.cls,vars:e.getVariableCount(d.id)})}return h},[r,e]);return t.jsxs("div",{className:"text-sm selection-tree",children:[t.jsxs("div",{className:"flex items-baseline gap-2 px-3 py-2 border-b border-gray-200 dark:border-slate-700",children:[t.jsxs("span",{className:"font-semibold flex-1",children:[e.getConceptLabel("entity",!0)," (",r.length,")"]}),t.jsxs("span",{className:"flex items-center gap-1 text-[10px] uppercase tracking-wide shrink-0",children:[t.jsx("span",{className:"text-gray-500",title:i.props.tip,children:i.props.header}),t.jsx("span",{style:{color:xe.entity},title:i.cls.tip,children:i.cls.header}),t.jsx("span",{style:{color:xe.variable},title:i.vars.tip,children:i.vars.header})]})]}),t.jsx(kn,{nodes:r,selected:[...n],levelsExpanded:0,renderRow:({node:h,isSelected:d})=>{const l=a.get(h.id);return t.jsxs("span",{className:`flex items-center gap-2 flex-1 min-w-0 px-1 rounded
                          ${d?"bg-blue-100 dark:bg-sky-900/50":""}`,children:[t.jsx("input",{type:"checkbox",checked:d,title:`${d?"Remove":"Add"} ${h.id} ${d?"from":"to"} the canvas`,onClick:f=>f.stopPropagation(),onChange:f=>{f.stopPropagation(),s(h.id)}}),t.jsx("button",{type:"button",title:`Show details for ${h.id}`,onClick:f=>{f.stopPropagation(),o?.(h.id)},className:`font-mono text-xs flex-1 min-w-0 truncate text-left
                            hover:underline ${d?"font-semibold":""}`,children:h.name??h.id}),l&&t.jsxs("span",{className:"flex items-center gap-1 shrink-0 tabular-nums",children:[t.jsx(qe,{n:l.props,title:i.props.tip,className:"text-gray-500"}),t.jsx(qe,{n:l.cls,title:i.cls.tip,color:xe.entity}),t.jsx(qe,{n:l.vars,title:i.vars.tip,color:xe.variable})]})]})}})]})}function qe({n:e,title:n,className:s,color:o}){const r=e===0;return t.jsx("span",{title:n,"data-count-badge":"",className:`w-5 text-right text-[11px] ${r?"text-gray-300 dark:text-slate-600":s??""}`,style:!r&&o?{color:o}:void 0,children:r?"·":e})}function Be(e){throw new Error('Could not dynamically require "'+e+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var Ke={exports:{}},wt;function qn(){return wt||(wt=1,(function(e,n){(function(s){e.exports=s()})(function(){return(function(){function s(o,r,i){function a(l,f){if(!r[l]){if(!o[l]){var b=typeof Be=="function"&&Be;if(!f&&b)return b(l,!0);if(h)return h(l,!0);var u=new Error("Cannot find module '"+l+"'");throw u.code="MODULE_NOT_FOUND",u}var y=r[l]={exports:{}};o[l][0].call(y.exports,function(v){var c=o[l][1][v];return a(c||v)},y,y.exports,s,o,r,i)}return r[l].exports}for(var h=typeof Be=="function"&&Be,d=0;d<i.length;d++)a(i[d]);return a}return s})()({1:[function(s,o,r){Object.defineProperty(r,"__esModule",{value:!0}),r.default=void 0;function i(u){"@babel/helpers - typeof";return i=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(y){return typeof y}:function(y){return y&&typeof Symbol=="function"&&y.constructor===Symbol&&y!==Symbol.prototype?"symbol":typeof y},i(u)}function a(u,y){if(!(u instanceof y))throw new TypeError("Cannot call a class as a function")}function h(u,y){for(var v=0;v<y.length;v++){var c=y[v];c.enumerable=c.enumerable||!1,c.configurable=!0,"value"in c&&(c.writable=!0),Object.defineProperty(u,l(c.key),c)}}function d(u,y,v){return y&&h(u.prototype,y),Object.defineProperty(u,"prototype",{writable:!1}),u}function l(u){var y=f(u,"string");return i(y)=="symbol"?y:y+""}function f(u,y){if(i(u)!="object"||!u)return u;var v=u[Symbol.toPrimitive];if(v!==void 0){var c=v.call(u,y);if(i(c)!="object")return c;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(u)}r.default=(function(){function u(){var y=this,v=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},c=v.defaultLayoutOptions,k=c===void 0?{}:c,g=v.algorithms,S=g===void 0?["layered","stress","mrtree","radial","force","disco","sporeOverlap","sporeCompaction","rectpacking"]:g,N=v.workerFactory,j=v.workerUrl;if(a(this,u),this.defaultLayoutOptions=k,this.initialized=!1,typeof j>"u"&&typeof N>"u")throw new Error("Cannot construct an ELK without both 'workerUrl' and 'workerFactory'.");var A=N;typeof j<"u"&&typeof N>"u"&&(A=function(W){return new Worker(W)});var T=A(j);if(typeof T.postMessage!="function")throw new TypeError("Created worker does not provide the required 'postMessage' function.");this.worker=new b(T),this.worker.postMessage({cmd:"register",algorithms:S}).then(function($){return y.initialized=!0}).catch(console.err)}return d(u,[{key:"layout",value:function(v){var c=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},k=c.layoutOptions,g=k===void 0?this.defaultLayoutOptions:k,S=c.logging,N=S===void 0?!1:S,j=c.measureExecutionTime,A=j===void 0?!1:j;return v?this.worker.postMessage({cmd:"layout",graph:v,layoutOptions:g,options:{logging:N,measureExecutionTime:A}}):Promise.reject(new Error("Missing mandatory parameter 'graph'."))}},{key:"knownLayoutAlgorithms",value:function(){return this.worker.postMessage({cmd:"algorithms"})}},{key:"knownLayoutOptions",value:function(){return this.worker.postMessage({cmd:"options"})}},{key:"knownLayoutCategories",value:function(){return this.worker.postMessage({cmd:"categories"})}},{key:"terminateWorker",value:function(){this.worker&&this.worker.terminate()}}])})();var b=(function(){function u(y){var v=this;if(a(this,u),y===void 0)throw new Error("Missing mandatory parameter 'worker'.");this.resolvers={},this.worker=y,this.worker.onmessage=function(c){setTimeout(function(){v.receive(v,c)},0)}}return d(u,[{key:"postMessage",value:function(v){var c=this.id||0;this.id=c+1,v.id=c;var k=this;return new Promise(function(g,S){k.resolvers[c]=function(N,j){N?(k.convertGwtStyleError(N),S(N)):g(j)},k.worker.postMessage(v)})}},{key:"receive",value:function(v,c){var k=c.data,g=v.resolvers[k.id];g&&(delete v.resolvers[k.id],k.error?g(k.error):g(null,k.data))}},{key:"terminate",value:function(){this.worker&&this.worker.terminate()}},{key:"convertGwtStyleError",value:function(v){if(v){var c=v.__java$exception;c&&(c.cause&&c.cause.backingJsObject&&(v.cause=c.cause.backingJsObject,this.convertGwtStyleError(v.cause)),delete v.__java$exception)}}}])})()},{}],2:[function(s,o,r){var i=s("./elk-api.js").default;Object.defineProperty(o.exports,"__esModule",{value:!0}),o.exports=i,i.default=i},{"./elk-api.js":1}]},{},[2])(2)})})(Ke)),Ke.exports}var Kn=qn();const Un=Sn(Kn),Xn="/dynamic-model-var-docs/assets/elk-worker.min-r_yRvuMO.js";class Yn{elk=null;ensure(){return this.elk||(this.elk=new Un({workerUrl:Xn})),this.elk}async layout(n,s={}){const{direction:o="DOWN",nodeSpacing:r=32,layerSpacing:i=56,usePartitions:a=!1,extraLayoutOptions:h={}}=s,d={id:"root",layoutOptions:{"elk.algorithm":"layered","elk.direction":o,"elk.spacing.nodeNode":String(r),"elk.layered.spacing.nodeNodeBetweenLayers":String(i),"elk.edgeRouting":"ORTHOGONAL","elk.layered.considerModelOrder.strategy":"NODES_AND_EDGES",...a?{"elk.partitioning.activate":"true"}:{},...h},children:n.nodes.map(c=>({id:c.id,width:c.width,height:c.height,...c.ports?.length?{ports:c.ports.map(k=>({id:k.id,x:k.x,y:k.y,width:0,height:0}))}:{},...a&&c.partition!==void 0||c.ports?.length?{layoutOptions:{...a&&c.partition!==void 0?{"elk.partitioning.partition":String(c.partition)}:{},...c.ports?.length?{"elk.portConstraints":"FIXED_POS"}:{}}}:{}})),edges:n.edges.filter(c=>c.source!==c.target).map(c=>({id:c.id,sources:[c.sourcePort??c.source],targets:[c.targetPort??c.target]}))},l=new Map(n.edges.map(c=>[c.id,c])),f=await this.ensure().layout(d),b=(f.children??[]).map(c=>({id:c.id,x:c.x??0,y:c.y??0,width:c.width??0,height:c.height??0})),u=(f.edges??[]).map(c=>{const k=l.get(c.id);if(!k)throw new Error(`ELK returned unknown edge id: ${c.id}`);return{id:c.id,source:k.source,target:k.target,sections:c.sections}}),y=Math.max(0,...b.map(c=>c.x+c.width)),v=Math.max(0,...b.map(c=>c.y+c.height));return{nodes:b,edges:u,width:y,height:v}}cancel(){this.elk&&(this.elk.terminateWorker(),this.elk=null)}dispose(){this.cancel()}}function He(e){if(!e?.length)return[];const n=e[0];return[n.startPoint,...n.bendPoints??[],n.endPoint]}function vt(e,n,s){const o=n.x-e.x,r=n.y-e.y,i=Math.hypot(o,r);if(i<1e-6)return{...e};const a=Math.min(s,i/2)/i;return{x:e.x+o*a,y:e.y+r*a}}function Zn(e,n){if(e.length<2)return Jn(e);let s=`M${e[0].x},${e[0].y}`;for(let r=1;r<e.length-1;r++){const i=vt(e[r],e[r-1],n),a=vt(e[r],e[r+1],n);s+=`L${i.x},${i.y}Q${e[r].x},${e[r].y} ${a.x},${a.y}`}const o=e[e.length-1];return`${s}L${o.x},${o.y}`}function Jn(e){return e.length?e.map((n,s)=>`${s===0?"M":"L"}${n.x},${n.y}`).join(""):""}function es(e,n){let s=0,o=e.length-1,r=e[e.length-1];for(let i=e.length-1;i>0;i--){const a=Math.hypot(e[i].x-e[i-1].x,e[i].y-e[i-1].y);if(s+a>=n){const h=(n-s)/a;r={x:e[i].x+(e[i-1].x-e[i].x)*h,y:e[i].y+(e[i-1].y-e[i].y)*h},o=i-1;break}s+=a,o=i-1}return{cut:o,cutPoint:r}}function ts(e,n,s,o){if(e.length<2||s<=0)return o(e);const{cut:r,cutPoint:i}=es(e,s),a=e.slice(0,r+1),h=a[a.length-1],d=h&&Math.abs(h.x-i.x)<1e-6&&Math.abs(h.y-i.y)<1e-6;return o([...a,...d?[]:[i],n])}function ns(e,n=1.5){if(e.length<3)return e;const s=[e[0]];for(let o=1;o<e.length-1;o++){const r=s[s.length-1],i=e[o],a=e[o+1],h=a.x-r.x,d=a.y-r.y,l=Math.hypot(h,d);(l<1e-6?Math.hypot(i.x-r.x,i.y-r.y):Math.abs(d*i.x-h*i.y+a.x*r.y-a.y*r.x)/l)>n&&s.push(i)}return s.push(e[e.length-1]),s}function ss(e,n,s,o){const r=Math.hypot(n.x,n.y)||1,i=n.x/r,a=n.y/r,h=-a,d=i,l=s/2,f={x:e.x+h*l,y:e.y+d*l},b={x:e.x-h*l,y:e.y-d*l},u={x:e.x+i*o,y:e.y+a*o};return`M${f.x},${f.y}L${u.x},${u.y}L${b.x},${b.y}Z`}function os(e,n,s,o,r=16){const i={x:e.x+s.x*r,y:e.y+s.y*r},a={x:n.x+o.x*r,y:n.y+o.y*r},h=[e,i];if(Math.abs(s.x)>.5){const d=(i.x+a.x)/2;Math.abs(i.y-a.y)>.5&&h.push({x:d,y:i.y},{x:d,y:a.y})}else{const d=(i.y+a.y)/2;Math.abs(i.x-a.x)>.5&&h.push({x:i.x,y:d},{x:a.x,y:d})}return h.push(a,n),ns(h)}function rs(e,n={}){const s=p.useRef(null);s.current||(s.current=new Yn);const[o,r]=p.useState(null),[i,a]=p.useState(!1),h=JSON.stringify(n);p.useEffect(()=>{const f=s.current;if(!e||e.nodes.length===0){r(null),a(!1);return}let b=!1;return a(!0),f.layout(e,JSON.parse(h)).then(u=>{b||(r({spec:e,layout:u}),a(!1))},u=>{b||(a(!1),console.error("graph-core layout failed:",u))}),()=>{b=!0,f.cancel()}},[e,h]),p.useEffect(()=>()=>s.current?.dispose(),[]);const d=!!e&&e.nodes.length>0,l=o&&o.spec===e?o.layout:null;return{layout:l,inProgress:(i||!l)&&d}}function as(e={}){const{min:n=.2,max:s=2}=e,o=p.useRef(null),r=p.useRef(null),i=p.useRef(null),a=p.useRef(1),h=p.useRef({w:0,h:0}),d=p.useRef(null),l=p.useRef(null),f=p.useRef(!0),b=p.useCallback(()=>{const g=r.current;g&&(g.style.width=`${h.current.w*a.current}px`,g.style.height=`${h.current.h*a.current}px`)},[]),u=p.useCallback(g=>{a.current=Math.min(s,Math.max(n,g)),d.current&&cancelAnimationFrame(d.current),d.current=requestAnimationFrame(()=>{d.current=null;const S=i.current;S&&(S.style.transform=`scale(${a.current})`)}),l.current&&clearTimeout(l.current),l.current=setTimeout(()=>{l.current=null,b()},100)},[n,s,b]),y=p.useCallback(g=>{f.current=!1,u(g)},[u]),v=p.useCallback(g=>y(a.current*g),[y]),c=p.useCallback((g,S)=>{h.current={w:g,h:S};const N=i.current;N&&(N.style.width=`${g}px`,N.style.height=`${S}px`,N.style.transformOrigin="0 0",N.style.transform=`scale(${a.current})`),b()},[b]),k=p.useCallback(()=>{const g=o.current,{w:S,h:N}=h.current;!g||!S||!N||(f.current=!0,u(Math.min(g.clientWidth/S,g.clientHeight/N,1)),b(),requestAnimationFrame(()=>{g.scrollLeft=0,g.scrollTop=0}))},[u,b]);return p.useEffect(()=>{const g=o.current;if(!g)return;const S=N=>{!N.ctrlKey&&!N.metaKey||(N.preventDefault(),y(a.current*(1-N.deltaY*.005)))};return g.addEventListener("wheel",S,{passive:!1}),()=>g.removeEventListener("wheel",S)},[y]),p.useEffect(()=>{const g=o.current;if(!g)return;let S=!1,N=0,j=0,A=0,T=0,$=!1;const W=R=>R instanceof Element&&!R.closest("[data-pan-ignore]"),V=R=>{R.button!==0||!W(R.target)||(S=!0,$=!1,N=R.clientX,j=R.clientY,A=g.scrollLeft,T=g.scrollTop,g.style.cursor="grabbing")},U=R=>{if(!S)return;const D=R.clientX-N,Q=R.clientY-j;!$&&Math.hypot(D,Q)<3||($||($=!0,g.setPointerCapture(R.pointerId)),R.preventDefault(),g.scrollLeft=A-D,g.scrollTop=T-Q)},G=R=>{S&&(S=!1,g.style.cursor="",g.hasPointerCapture(R.pointerId)&&g.releasePointerCapture(R.pointerId))};return g.addEventListener("pointerdown",V),g.addEventListener("pointermove",U),g.addEventListener("pointerup",G),g.addEventListener("pointercancel",G),()=>{g.removeEventListener("pointerdown",V),g.removeEventListener("pointermove",U),g.removeEventListener("pointerup",G),g.removeEventListener("pointercancel",G)}},[]),{containerRef:o,spacerRef:r,wrapperRef:i,applyZoom:y,zoomBy:v,zoomToFit:k,getZoom:()=>a.current,isAutoFit:()=>f.current,setContentSize:c}}const is=2;function Bt({kind:e,width:n=44,className:s}){const o=p.useId().replace(/:/g,""),r=e==="association"?ae.association:e==="own-bkwd"?ae.ownBkwd:ae.ownFwd,i=e==="own-bkwd",a=e==="association",h=`es-${o}`,d=a?6:1,l=n-6;return t.jsxs("svg",{width:n,height:"14",viewBox:`0 0 ${n} 14`,className:`shrink-0 ${s??""}`,"aria-hidden":!0,children:[t.jsx("defs",{children:t.jsx("marker",{id:h,markerWidth:"5",markerHeight:"5",refX:i?.5:4.5,refY:"2.5",orient:"auto-start-reverse",markerUnits:"userSpaceOnUse",children:t.jsx("path",{d:i?"M5,0 L0,2.5 L5,5 z":"M0,0 L5,2.5 L0,5 z",fill:r})})}),t.jsx("line",{x1:d,y1:"7",x2:l,y2:"7",stroke:r,strokeWidth:is,strokeDasharray:e==="association"?"5 4":void 0,markerStart:a?`url(#${h})`:void 0,markerEnd:`url(#${h})`})]})}const Ht={"owned-mine":{side:"left",kind:"own-bkwd"},"owned-theirs":{side:"left",kind:"own-fwd"},"owns-mine":{side:"right",kind:"own-fwd"},"owns-theirs":{side:"right",kind:"own-bkwd"},association:{side:"left",kind:"association"}},ls=300,rt=new Set;let Pe;function ht(){Pe!==void 0&&(clearTimeout(Pe),Pe=void 0)}function Me(e){ht();for(const n of rt)n(e)}function Ft(){ht(),Pe=setTimeout(()=>{Pe=void 0,Me(null)},ls)}function cs({label:e,rows:n,onAdd:s,onRemove:o,onInspect:r,colorOf:i,slotOrder:a}){const[h,d]=p.useState(null),[l,f]=p.useState(null),b=p.useRef(null),u=p.useRef(null),y=p.useId();p.useEffect(()=>{const j=A=>{A!==y&&(d(null),f(null))};return rt.add(j),()=>{rt.delete(j)}},[y]),p.useEffect(()=>{if(!h)return;const j=T=>{T.target?.closest("[data-relation-bar]")||Me(null)},A=T=>{T.key==="Escape"&&Me(null)};return document.addEventListener("mousedown",j,!0),document.addEventListener("keydown",A),()=>{document.removeEventListener("mousedown",j,!0),document.removeEventListener("keydown",A)}},[h]);const v=j=>n.filter(A=>Ht[A.position].side===j),c=j=>new Set(v(j).map(A=>A.other)).size,k=c("left"),g=c("right");if(k===0&&g===0)return null;const S=(j,A)=>{const T=A?.getBoundingClientRect();T&&(Me(y),d(j),f({x:T.left,y:T.bottom+2}))},N=(j,A,T)=>{const $=h===j;return t.jsx("button",{ref:T,"data-relation-bar":!0,"data-no-drag":!0,disabled:A===0,"aria-label":j==="left"?`${A} classes ${e} belongs to`:`${A} classes ${e} owns`,onMouseEnter:()=>A>0&&S(j,T.current),onMouseLeave:Ft,onClick:W=>{W.stopPropagation(),A!==0&&($?Me(null):S(j,T.current))},className:`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] leading-none
                    tabular-nums transition-colors
                    ${A===0?"text-gray-300 dark:text-slate-600 cursor-default":$?"bg-sky-200 dark:bg-sky-800 text-sky-900 dark:text-sky-100":"text-sky-800 dark:text-sky-200 hover:bg-sky-100 dark:hover:bg-sky-900"}`,children:j==="left"?t.jsxs(t.Fragment,{children:[t.jsx("span",{"aria-hidden":!0,children:"←"}),A]}):t.jsxs(t.Fragment,{children:[A,t.jsx("span",{"aria-hidden":!0,children:"→"})]})})};return t.jsxs(t.Fragment,{children:[N("left",k,b),t.jsx("span",{className:`flex-1 min-w-0 text-center text-[9px] text-gray-400
                       dark:text-slate-500 truncate select-none`,children:"related"}),N("right",g,u),h&&l&&Rt.createPortal(t.jsx(hs,{anchor:l,side:h,label:e,rows:v(h),onAdd:s,onRemove:o,onInspect:r,colorOf:i,slotOrder:a}),document.body)]})}function ds(e){const n=p.useRef(null),[s,o]=p.useState(e);return p.useEffect(()=>{const r=n.current;if(!r)return;const i=r.getBoundingClientRect(),a=8;o({x:Math.max(a,Math.min(e.x,window.innerWidth-i.width-a)),y:Math.max(a,Math.min(e.y,window.innerHeight-i.height-a))})},[e]),{ref:n,pos:s}}function hs({anchor:e,side:n,label:s,rows:o,onAdd:r,onRemove:i,onInspect:a,colorOf:h,slotOrder:d}){const{ref:l,pos:f}=ds(e),b=c=>{const k=d?.indexOf(c.slot)??-1;return k===-1?Number.MAX_SAFE_INTEGER:k},u=[...o].sort((c,k)=>b(c)-b(k)||c.other.localeCompare(k.other)||c.slot.localeCompare(k.slot)),y=u.every(c=>c.drawn),v=[...new Set(u.map(c=>c.other))];return t.jsxs("div",{ref:l,"data-relation-bar":!0,onMouseEnter:ht,onMouseLeave:Ft,style:{left:f.x,top:f.y},className:`fixed z-50 w-max max-w-[min(46rem,calc(100vw-2rem))] max-h-[60vh]
                 overflow-y-auto overflow-x-hidden py-1
                 rounded-md border border-gray-300 dark:border-slate-600
                 bg-white dark:bg-slate-800 shadow-xl
                 text-gray-900 dark:text-gray-100`,children:[t.jsx("div",{className:"px-3 py-1 border-b border-gray-200 dark:border-slate-700",children:t.jsxs("div",{className:"text-[11px] font-semibold",children:[t.jsx("b",{children:s})," ",n==="left"?"belongs to":"owns"," ",v.length," ",v.length===1?"entity":"distinct entities",u.length!==v.length&&t.jsxs("span",{className:"font-normal text-gray-500 dark:text-slate-400",children:[" ","through ",u.length," attributes"]})]})}),t.jsx("button",{onClick:()=>v.forEach(c=>y?i(c):r(c)),className:`block w-full text-left px-3 py-1 text-[11px]
                   text-blue-600 dark:text-blue-400
                   hover:bg-gray-100 dark:hover:bg-slate-700`,children:y?`hide all ${v.length} entities`:`add all ${v.length} entities`}),t.jsx("table",{className:"w-full text-[11px]",children:t.jsx("tbody",{children:u.map(c=>{const k=Ht[c.position].kind,g=c.declaredBy===c.other?s:c.declaredBy,S=n==="left"?c.other:g,N=n==="left"?g:c.other;return t.jsxs("tr",{className:"hover:bg-gray-100 dark:hover:bg-slate-700",children:[t.jsx("td",{className:"pl-2 pr-1 py-0.5",children:t.jsx("button",{onClick:j=>{j.stopPropagation(),(c.drawn?i:r)(c.other)},"aria-label":c.drawn?`Remove ${c.other} from the diagram`:`Add ${c.other} to the diagram`,className:`w-4 h-4 rounded-sm leading-none text-[11px]
                                flex items-center justify-center border
                                ${c.drawn?"border-sky-300 bg-sky-50 text-sky-700 hover:bg-sky-200 dark:border-sky-700 dark:bg-sky-950 dark:text-sky-300":"border-gray-300 text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:border-slate-600 dark:hover:bg-slate-600"}`,children:c.drawn?"−":"+"})}),t.jsx("td",{className:"pl-1 pr-2 py-0.5 text-right whitespace-nowrap",children:t.jsx(kt,{cls:S,row:c,colorOf:h,onInspect:a})}),t.jsx("td",{className:`px-2 py-0.5 font-mono text-gray-400 dark:text-slate-500
                               whitespace-nowrap tabular-nums text-right`,children:c.cardinality}),t.jsx("td",{className:"px-1 py-0.5 align-middle",children:t.jsx(Bt,{kind:k,width:30})}),t.jsx("td",{className:"pr-3 py-0.5 whitespace-nowrap",children:t.jsx(kt,{cls:N,row:c,colorOf:h,onInspect:a})})]},`${c.declaredBy}.${c.slot}->${c.other}`)})})})]})}function kt({cls:e,row:n,colorOf:s,onInspect:o}){const r=s?.(e),i=e===n.declaredBy,a=r?{color:r.text}:void 0;return t.jsxs("span",{className:"font-mono",children:[o?t.jsx("button",{onClick:h=>{h.stopPropagation(),o(e)},title:`Open ${e}'s details`,className:"hover:underline",style:a,children:e}):t.jsx("span",{style:a,children:e}),i&&t.jsxs("span",{className:r?"opacity-80":"text-gray-500 dark:text-slate-400",style:a,children:[".",n.slot]})]})}const pe={sibs:!0,dir:"RIGHT",merge:"near",legend:!1,cases:!1},Wt=["legend","cases"];function us(e,n){if(e.get("panels")!=="0")return n;for(const s of Wt)n[s]=!1;return n.detail=null,n}const Ae={dir:"explore-nl-dir",merge:"explore-nl-merge",sibs:"explore-nl-sibs"},Qe="~",ps=["exp","hidden","owners"],gs=["tour"];let De;function ms(e=window.location.search){return De===void 0&&(De=new URLSearchParams(e).get("tour")==="1"),De}function fs(e,n){const s=e.get(n);return s?s.split(Qe).filter(Boolean):[]}function zt(e){const n=e.get("cat");if(!n)return[];const s=n.split(new RegExp(`[,${Qe}]`)).filter(Boolean);return[...new Set(s.flatMap(o=>{const r=$t.find(i=>i.id===o);return r?Lt(r):[]}))]}function Fe(e){try{return localStorage.getItem(e)}catch{return null}}function ys(e,n){try{localStorage.setItem(e,n)}catch{}}function We(e,n){return e&&n.includes(e)?e:null}function fe(e=window.location.search){const n=new URLSearchParams(e),s=We(n.get("dir"),["RIGHT","DOWN"])??We(Fe(Ae.dir),["RIGHT","DOWN"])??pe.dir,o=We(n.get("merge"),["near","far","bend","off"])??We(Fe(Ae.merge),["near","far","bend","off"])??pe.merge,r=n.has("sibs")?n.get("sibs")==="1":Fe(Ae.sibs)!==null?Fe(Ae.sibs)!=="0":pe.sibs,i=fs(n,"sel"),a=us(n,{legend:n.get("legend")==="1",cases:n.get("cases")==="1",detail:n.get("detail")||null});return n.has("legend")&&(a.legend=n.get("legend")==="1"),n.has("cases")&&(a.cases=n.get("cases")==="1"),n.has("detail")&&(a.detail=n.get("detail")||null),{sel:i.length?i:zt(n),detail:a.detail,roots:n.get("roots")==="1",sibs:r,dir:s,merge:o,legend:a.legend,cases:a.cases}}function Qt(e,{push:n=!1}={}){const s=new URL(window.location.href),o=s.searchParams,r=(a,h)=>{h.length===0?o.delete(a):o.set(a,[...h].sort().join(Qe))},i=(a,h,d)=>{d?o.delete(a):o.set(a,h)};for(const a of ps)o.delete(a);De===void 0&&o.has("tour")&&(De=o.get("tour")==="1");for(const a of gs)o.delete(a);r("sel",e.sel),e.detail?o.set("detail",e.detail):o.delete("detail"),i("roots","1",!e.roots),i("sibs",e.sibs?"1":"0",e.sibs===pe.sibs),i("dir",e.dir,e.dir===pe.dir),i("merge",e.merge,e.merge===pe.merge),i("legend","1",e.legend===pe.legend),i("cases","1",e.cases===pe.cases),o.delete("panels"),o.delete("cat"),n?window.history.pushState(null,"",s):window.history.replaceState(null,"",s)}function Ue(e,n){ys(Ae[e],typeof n=="boolean"?n?"1":"0":String(n))}function xs(e,n=window.location.href){const s=new URL(n),o=new URLSearchParams,r=(i,a)=>o.set(i,a);return e.sel.length&&r("sel",[...e.sel].sort().join(Qe)),e.detail&&r("detail",e.detail),e.roots&&r("roots","1"),e.sibs!==pe.sibs&&r("sibs",e.sibs?"1":"0"),e.dir!==pe.dir&&r("dir",e.dir),e.merge!==pe.merge&&r("merge",e.merge),e.legend!==pe.legend&&r("legend","1"),e.cases!==pe.cases&&r("cases","1"),s.search=o.toString(),s.toString()}const de=240,ke=30,Se=20,bs=1/0,ut=22,Gt=18,Ne=28;function Vt(e,n,s=()=>!1){const o=new Map;for(const r of e){if(s(r.other))continue;const i=r.position,a=o.get(i)??new Map,h=a.get(r.other)??[];h.includes(r.slot)||h.push(r.slot),a.set(r.other,h),o.set(i,a)}return On.filter(r=>o.has(r)).map(r=>{const i=[...o.get(r)].map(([a,h])=>({other:a,slots:h,drawn:n(a)})).sort((a,h)=>a.other.localeCompare(h.other));return{position:r,label:Mn(r,i.length),items:i}})}function qt(e,n,s=()=>!1){const o=new Set,r=[];for(const i of e){if(s(i.other))continue;const a=`${i.declaredBy}.${i.slot}->${i.other}:${i.position}`;o.has(a)||(o.add(a),r.push({other:i.other,position:i.position,slot:i.slot,declaredBy:i.declaredBy,cardinality:i.cardinality,drawn:n(i.other)}))}return r}function J(e){return e.storageDirection==="flipped"?e.target:e.source}function at(e){return e.anchorClass??J(e)}function ws(e,n,s,o,r){const i=new Map,a=new Map,h=[],d=new Set;for(const u of e.edges)u.type==="isa"?(i.set(u.target,[...i.get(u.target)??[],u.source]),a.set(u.source,(a.get(u.source)??0)+1)):u.isLoop||(h.push(u),d.add(`${J(u)}|${u.slotName}`));const l=new Set(e.nodes.map(u=>u.id)),f=e.nodes.map(u=>{const y=new Map(s(u.id).map((D,Q)=>[D.name,Q])),v=(D,Q)=>(y.get(D.slot)??Number.MAX_SAFE_INTEGER)-(y.get(Q.slot)??Number.MAX_SAFE_INTEGER),c=u.slots.map(D=>({...D,connected:D.isLoop||d.has(`${u.id}|${D.slot}`),rangeColor:o(D.range),targetColor:r(D.range)})).sort(v),k=new Set(c.map(D=>D.slot)),g=s(u.id).filter(D=>!k.has(D.name)).map(D=>({slot:D.name,range:D.range,channel:"plain",flipped:!1,cardinality:jn(D.required,D.multivalued),isLoop:!1,connected:!1,rangeColor:o(D.range)})),S=c.filter(D=>D.connected),N=[...c.filter(D=>!D.connected),...g].sort(v),j=[...S,...N].slice(0,Math.max(bs,S.length)),A=j.length===S.length+N.length,T=n.has(u.id)||A,$=T?[...S,...N]:j,W=A?0:S.length+N.length-j.length,V=e.hiddenOwners.get(u.id)??[],U=e.hiddenOwned.get(u.id)??[],G=Vt(u.relations,D=>l.has(D),D=>D===u.id),R=qt(u.relations,D=>l.has(D),D=>D===u.id);return{...u,isaParents:i.get(u.id)??[],subclassCount:a.get(u.id)??0,members:[],hiddenOwners:V,hiddenOwned:U,relationGroups:G,relationRows:R,...Kt(G),rows:$,allRows:[...S,...N],hiddenCount:W,expanded:T,height:Ut($.length,W,G.length>0)}}),b=new Map;for(const u of h){const y=J(u)===u.source?u.target:u.source,v=r(y);v&&b.set(u.id,v)}return{nodes:f,edges:h,edgeColors:b}}function Kt(e){const n=new Map;for(const s of e)for(const o of s.items)n.set(o.other,(n.get(o.other)??!1)||o.drawn);return{relatedCount:n.size,shownCount:[...n.values()].filter(Boolean).length}}function Ut(e,n,s){return ke+(s?ut:0)+e*Se+(n?Gt:0)+(e?5:0)}function vs(e,n,s,o,r,i,a){const h=Nn(e.nodes.map(g=>g.id),n,s);if(!h.size)return e;const d=new Map(e.nodes.map(g=>[g.id,g])),l=new Set(e.nodes.map(g=>g.id)),f=new Map,b=[],u=new Map;for(const[g,S]of h){const N=An(g),j=S.map(x=>({id:x,label:d.get(x)?.label??x,color:En(a(x))}));for(const x of j)f.set(x.id,N);const A=d.has(g);A&&f.set(g,N);const T=new Map(j.map(x=>[x.id,x])),$=new Map,W=A?[g,...S]:S;for(const x of W){const L=d.get(x);if(!L)continue;const z=x===g;for(const se of L.allRows){const le=o(x,se.slot),H=le!==void 0&&le!==x,I=`${z||H?le??g:x}|${se.slot}`,q=$.get(I),K=T.get(x),M=z||H?q?.owners??[]:[...q?.owners??[],...K?[K]:[]];$.set(I,{...q??se,connected:(q?.connected??!1)||se.connected,owners:M,declaringClass:I.slice(0,I.indexOf("|"))})}}const V=new Map;for(const x of $.values())if(x.targetColor)for(const L of x.owners??[])V.has(L.id)||V.set(L.id,x.targetColor);for(const x of j){const L=V.get(x.id);L&&(x.color=L)}for(const[x,L]of $)L.targetColor&&u.set(`${N}|${x}`,L.targetColor);const U=[...$.values()],G=x=>{const L=x.owners?.length?x.owners[0].id:g;return i(L,x.slot)};U.sort((x,L)=>G(x)-G(L));const R=Tn(U,j,x=>({slot:`::hdr:${x.id}`,range:"",channel:"plain",flipped:!1,cardinality:"",isLoop:!1,connected:!1,rangeColor:"",header:x})),D=x=>!f.has(x)&&!W.includes(x),Q=[...new Set(W.flatMap(x=>d.get(x)?.hiddenOwners??[]))].filter(D),ie=[...new Set(W.flatMap(x=>d.get(x)?.hiddenOwned??[]))].filter(D),te=Vt(W.flatMap(x=>d.get(x)?.relations??[]),x=>l.has(x),x=>!D(x)),ge=qt(W.flatMap(x=>d.get(x)?.relations??[]),x=>l.has(x),x=>!D(x)),ee=d.get(S[0]),re=r(g);b.push({...ee,id:N,label:g,description:re.description,abstract:re.abstract,slots:[],members:j,role:W.some(x=>d.get(x)?.role==="selected")?"selected":"context",layer:Math.min(...W.map(x=>d.get(x)?.layer??0)),isaParents:[],subclassCount:j.length,hiddenOwners:Q,hiddenOwned:ie,relationGroups:te,relationRows:ge,...Kt(te),rows:R,allRows:U,hiddenCount:0,expanded:!0,height:Ut(R.length,0,te.length>0)})}const y=[...e.nodes.filter(g=>!f.has(g.id)),...b],v=new Set,c=e.edges.map(g=>({...g,source:f.get(g.source)??g.source,target:f.get(g.target)??g.target,entityMember:(()=>{const S=J(g)===g.source?g.target:g.source;return f.has(S)?S:void 0})(),anchorClass:f.has(J(g))?o(J(g),g.slotName)??J(g):J(g)})).filter(g=>{const S=J(g);if(!Dt(S))return!0;const N=S===g.source?g.target:g.source,j=`${S}|${g.anchorClass}|${g.slotName}|${N}|${g.storageDirection}`;return v.has(j)?!1:(v.add(j),!0)}).filter(g=>g.source!==g.target),k=new Map(e.edgeColors);for(const g of c){const S=u.get(`${J(g)}|${at(g)}|${g.slotName}`);S&&k.set(g.id,S)}return{nodes:y,edges:c,edgeColors:k}}function ks({title:e}){return t.jsxs("svg",{viewBox:"0 0 16 16",width:"15",height:"15","aria-hidden":"false",className:"shrink-0",style:{color:xe.entity},children:[t.jsx("title",{children:e}),t.jsx("path",{d:"M12.33 10.5 A5 5 0 1 1 12.33 5.5",fill:"none",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round"}),t.jsx("path",{d:"M13.7 7.9 L10.6 6.7 L13.7 4.2 Z",fill:"currentColor"})]})}function Xt(e){return ke+(e.relationGroups.length>0?ut:0)}function Yt(e,n,s){const o=e.rows.findIndex(r=>r.slot===n&&!r.header&&(!s||!r.declaringClass||r.declaringClass===s));if(o<0)throw new Error(`No displayed row for ${n} on ${e.id}`);return Xt(e)+o*Se+Se/2}function Ss(e,n){const s=e.rows.findIndex(o=>o.header?.id===n);if(!(s<0))return Xt(e)+s*Se+Se/2}function it(e,n){if(e.storageDirection==="flipped"||!n.members.length)return;const s=e.entityMember;return s&&n.members.some(o=>o.id===s)?s:void 0}const Cs=4,js=10,Zt=12,we=Zt,Xe=Zt*1.5,Ye=0,St=.85,Jt=1.4,en=2.6,Ns=Jt*.75,Es=en*.75;function Ct(e,n){return e?n?ae.ownBkwd:ae.ownFwd:ae.association}function Ze(e,n){if(e==="off"||n.length<2)return 0;if(e==="near")return 40;if(e==="far")return 120;const s=n[n.length-1],o=n[n.length-2];return Math.hypot(s.x-o.x,s.y-o.y)}function jt(e,n){return e<2?0:Math.min(Cs,n/(e-1))}function Ts(e,n){const s=new Map,o=(l,f,b,u)=>{const y=s.get(l.id)??[];return y.some(v=>v.id===f)||(y.push({id:f,x:b,y:u}),s.set(l.id,y)),f},r=new Map(e.nodes.map(l=>[l.id,l])),i=l=>{const f=r.get(J(l)===l.source?l.target:l.source);return!!f&&it(l,f)!==void 0},a=new Map;for(const l of e.edges){if(i(l))continue;const f=J(l)===l.source?l.target:l.source,b=`${f}|${f===l.source?"out":"in"}`;a.set(b,(a.get(b)??0)+1)}const h=new Map,d=e.edges.map(l=>{const f=r.get(J(l)),b=r.get(J(l)===l.source?l.target:l.source);if(!f||!b)throw new Error(`Edge ${l.id} endpoint missing from subgraph`);const u=l.storageDirection==="flipped",y=Yt(f,l.slotName,at(l)),v=o(f,`${f.id}::row:${at(l)}|${l.slotName}`,u?0:de,y),c=b.id===l.source,k=`${b.id}|${c?"out":"in"}`,g=it(l,b),S=g!==void 0?Ss(b,g):void 0;let N;if(g!==void 0&&S!==void 0)N=o(b,`${b.id}::mhdr:${c?"out":"in"}:${g}`,n==="RIGHT"?c?de:0:de/2,n==="RIGHT"?S:c?b.height:0);else{const j=a.get(k)??1,A=h.get(k)??0;h.set(k,A+1);const T=jt(j,ke-4),$=ke/2+(A-(j-1)/2)*T;N=n==="RIGHT"?o(b,`${b.id}::hdr:${c?"out":"in"}:${A}`,c?de:0,$):o(b,`${b.id}::hdr:${c?"out":"in"}:${A}`,de/2+(A-(j-1)/2)*jt(j,de/2),c?b.height:0)}return{id:l.id,source:l.source,target:l.target,sourcePort:u?N:v,targetPort:u?v:N}});return{nodes:e.nodes.map(l=>({id:l.id,width:de,height:l.height,partition:l.layer,ports:s.get(l.id)})),edges:d}}function Os(e,n){if(!e?.length)return e;const s=e[0],o=s.bendPoints?.length?s.bendPoints[s.bendPoints.length-1]:s.startPoint,r=s.endPoint.x-o.x,i=s.endPoint.y-o.y,a=Math.hypot(r,i);if(a<1)return e;const h=Math.min(n,a*.8)/a,d={x:s.endPoint.x-r*h,y:s.endPoint.y-i*h};return[{...s,endPoint:d},...e.slice(1)]}function Ms(e,n){if(!e?.length)return e;const s=e[0],o=s.bendPoints?.length?s.bendPoints[0]:s.endPoint,r=o.x-s.startPoint.x,i=o.y-s.startPoint.y,a=Math.hypot(r,i);if(a<1)return e;const h=Math.min(n,a*.8)/a,d={x:s.startPoint.x+r*h,y:s.startPoint.y+i*h};return[{...s,startPoint:d},...e.slice(1)]}function As({dataService:e,selectedIds:n,onNodeClick:s,onAdd:o,onRemove:r,pathToRoot:i=!1,onTogglePathToRoot:a,direction:h,setDirection:d,mergeMode:l,setMergeMode:f,mergeSibs:b,setMergeSibs:u}){const y=p.useId().replace(/[^a-zA-Z0-9]/g,""),v=m=>`${m}-${y}`,[c,k]=p.useState(new Set),g=p.useMemo(()=>e.getOwnershipSubgraph([...n].sort(),{pathToRoot:i}),[e,n,i]),S=p.useCallback(m=>e.getTargetColor(m),[e]),N=p.useMemo(()=>new Map(g.nodes.map(m=>[m.id,e.getClassSummary(m.id)?.slots??[]])),[e,g]),j=p.useMemo(()=>ws(g,c,m=>N.get(m)??[],m=>e.getRangeColor(m),m=>e.getTargetColor(m)),[g,c,N,e]),A=p.useMemo(()=>new Map(g.nodes.map(m=>[m.id,e.getClassSummary(m.id)])),[e,g]),T=p.useMemo(()=>{if(!b)return j;const m=O=>A.get(O)?.parentId,C=O=>!Pn.has(O),E=(O,B)=>O.range===B.range&&O.multivalued===B.multivalued;return vs(j,m,C,(O,B)=>{const F=e.getClassSummary(O)?.slots.find(oe=>oe.name===B);if(!F)return;if(!F.inheritedFrom)return O;const Y=e.getClassSummary(F.inheritedFrom)?.slots.find(oe=>oe.name===B);return Y&&E(F,Y)?F.inheritedFrom:O},O=>{const B=e.getClassSummary(O);return{description:B?.description??"",abstract:B?.isAbstract??!1}},(O,B)=>{const F=e.getClassSummary(O)?.slots.findIndex(Y=>Y.name===B)??-1;return F<0?Number.MAX_SAFE_INTEGER:F},O=>e.siblingColorIndexOf(O))},[j,A,b,e]),[$,W]=p.useState(new Map),[V,U]=p.useState(new Map),G=p.useMemo(()=>Ts(T,h),[T,h]),{layout:R,inProgress:D}=rs(G,{direction:h,usePartitions:!0,nodeSpacing:28,layerSpacing:72,extraLayoutOptions:{"elk.spacing.edgeNode":"18","elk.spacing.edgeEdge":"12","elk.layered.spacing.edgeNodeBetweenLayers":"18","elk.layered.spacing.edgeEdgeBetweenLayers":"10"}}),Q=as(),ie=(R?.width??0)+Ne*2,te=(R?.height??0)+Ne*2;p.useEffect(()=>{R&&(Q.setContentSize(ie,te),Q.isAutoFit()&&Q.zoomToFit())},[R,ie,te]),p.useEffect(()=>W(new Map),[R]),p.useEffect(()=>U(new Map),[g]);const ge=p.useRef(new Map),ee=p.useRef(!1),re=p.useRef($);re.current=$;const x=p.useMemo(()=>{const m=new Map((R?.nodes??[]).map(E=>[E.id,E])),C=new Map(V);for(const[E,w]of $)C.set(E,w);for(const[E,{dx:w,dy:P}]of C){const _=m.get(E);_&&m.set(E,{..._,x:_.x+w,y:_.y+P})}return ge.current=m,m},[R,$,V]),L=p.useCallback((m,C)=>{if(C.button!==0||C.target.closest('button, a, [role="button"], [data-no-drag]'))return;C.stopPropagation();const E=C.clientX,w=C.clientY,P=Q.getZoom()||1,_=$.get(m)??{dx:0,dy:0},O=C.currentTarget;O.setPointerCapture(C.pointerId);let B=!1;const F=oe=>{const ue=(oe.clientX-E)/P,me=(oe.clientY-w)/P;!B&&Math.hypot(ue,me)<3||(B=!0,ee.current=!0,W(ve=>new Map(ve).set(m,{dx:_.dx+ue,dy:_.dy+me})))},Y=oe=>{if(O.releasePointerCapture(oe.pointerId),O.removeEventListener("pointermove",F),O.removeEventListener("pointerup",Y),B){const ue=re.current.get(m);ue&&U(me=>new Map(me).set(m,ue))}};O.addEventListener("pointermove",F),O.addEventListener("pointerup",Y)},[$]),z=p.useMemo(()=>new Map(T.nodes.map(m=>[m.id,m.role])),[T]),se=p.useMemo(()=>new Map(T.edges.map(m=>[m.id,m])),[T]),le=p.useMemo(()=>{const m=new Map(T.nodes.map(C=>[C.id,C]));return new Set(T.edges.filter(C=>{const E=m.get(J(C)===C.source?C.target:C.source);return!!E&&it(C,E)!==void 0}).map(C=>C.id))},[T]),H=p.useMemo(()=>{const m=new Map;if(!R)return m;for(const C of T.edges){const E=J(C)===C.source?C.target:C.source,w=x.get(E);if(!w||le.has(C.id))continue;const P=E===C.source,_=`${E}|${P?"out":"in"}`;if(m.has(_))continue;const O=P,B=Ye+Xe;m.set(_,h==="RIGHT"?{base:{x:O?w.x+de+B:w.x-B,y:w.y+ke/2},dir:{x:O?-1:1,y:0}}:{base:{x:w.x+de/2,y:O?w.y+w.height+B:w.y-B},dir:{x:0,y:O?-1:1}})}return m},[T,x,R,h,le]),I=p.useMemo(()=>{const m=new Map,C=new URLSearchParams(window.location.search).has("dbg"),E=new Set([...V.keys(),...$.keys()]);if(!R||E.size===0)return m;C&&console.log(`[drag] moved: ${[...E].join(", ")}`);const w=new Map(T.nodes.map(P=>[P.id,P]));for(const P of T.edges){const _=J(P),O=_===P.source?P.target:P.source;if(!E.has(_)&&!E.has(O))continue;const B=x.get(_),F=x.get(O),Y=w.get(_);if(!B||!F||!Y)continue;const oe=P.storageDirection==="flipped",ue=h==="RIGHT";let me;try{me=Yt(Y,P.slotName)}catch{C&&console.log(`   SKIP ${_}.${P.slotName}: row not displayed`);continue}const ve=ue?{x:B.x+(oe?0:de),y:B.y+me}:{x:B.x+de/2,y:B.y+me},be=ue?{x:oe?-1:1,y:0}:{x:0,y:1},je=O===P.source,Ie=ue?{x:je?F.x+de:F.x,y:F.y+ke/2}:{x:F.x+de/2,y:je?F.y+F.height:F.y},Ve=ue?{x:je?1:-1,y:0}:{x:0,y:je?1:-1};m.set(P.id,os(ve,Ie,be,Ve)),C&&console.log(`   reroute ${_}.${P.slotName} -> ${O}`)}return C&&console.log(`[drag] rerouted ${m.size} edge(s)`),m},[R,$,V,T,x,h]);p.useEffect(()=>{if(!R||!new URLSearchParams(window.location.search).has("dbg"))return;const m=new Map;for(const C of R.edges){const E=se.get(C.id);if(!E)continue;const w=He(C.sections);if(w.length<2)continue;const P=J(E)===E.source?E.target:E.source;let _=0,O=0;for(let F=1;F<w.length;F++){const Y=Math.abs(w[F].x-w[F-1].x),oe=Math.abs(w[F].y-w[F-1].y);Y>.5&&oe>.5&&O++,F>1&&_++}const B=J(E);m.set(P,[...m.get(P)??[],`${B}.${E.slotName}  pts=${w.length} bends=${_}${O?` DIAGONAL x${O}`:""}  start=(${Math.round(w[0].x)},${Math.round(w[0].y)}) end=(${Math.round(w[w.length-1].x)},${Math.round(w[w.length-1].y)})`])}for(const[C,E]of m){if(E.length<2)continue;console.log(`
=== approaches to ${C} (${E.length}) ===`);const w=x.get(C);w&&console.log(`   box at (${Math.round(w.x)},${Math.round(w.y)}) h=${Math.round(w.height)}`),E.forEach(P=>console.log("   "+P))}},[R,se,x]);const q=p.useMemo(()=>{const m=new Map;if(!R)return m;for(const C of R.edges){const E=se.get(C.id);if(!E||E.storageDirection==="flipped"||le.has(C.id)||Ze(l,He(C.sections))<=0)continue;const w=J(E)===E.source?E.target:E.source,P=`${w}|${w===E.source?"out":"in"}`,_=H.get(P);if(!_)continue;const O=E.type==="ownership",B=z.get(E.source)==="context"||z.get(E.target)==="context",F=T.edgeColors.get(C.id),Y=m.get(P);m.set(P,Y?{...Y,isOwn:Y.isOwn||O,dimmed:Y.dimmed&&B,edgeIds:[...Y.edgeIds,C.id],...Y.color?.text===F?.text?{}:{color:void 0}}:{..._,isOwn:O,dimmed:B,edgeIds:[C.id],...F?{color:F}:{}})}return m},[R,se,H,l,z,T,le]),K=p.useMemo(()=>new Set(T.nodes.map(m=>m.id)),[T]),M=p.useCallback(m=>!!o&&m.channel!=="plain"&&!m.isLoop&&!K.has(m.range),[o,K]),X=p.useRef(null),Z=p.useRef(null),he=p.useRef(void 0),yt=p.useMemo(()=>{const m=new Map,C=new Map;for(const E of T.edges){C.set(E.id,[E.source,E.target]);for(const w of[E.source,E.target])m.set(w,[...m.get(w)??[],E.id])}return{nodeEdges:m,edgeEnds:C}},[T]),xt=p.useRef(yt);xt.current=yt;const Ce=p.useCallback(m=>{he.current=m,Z.current===null&&(Z.current=requestAnimationFrame(()=>{Z.current=null;const C=he.current;he.current=void 0;const E=X.current,w=Q.wrapperRef.current;if(C===void 0||!E||!w)return;let P=null,_=null;if(C){const{nodeEdges:O,edgeEnds:B}=xt.current;if(C.kind==="node"){P=new Set(O.get(C.id)??[]),_=new Set([C.id]);for(const F of P)for(const Y of B.get(F)??[])_.add(Y)}else P=new Set([C.id]),_=new Set(B.get(C.id)??[])}E.querySelectorAll("path[data-edge-id]").forEach(O=>{const B=O.dataset.edgeId??"";P?P.has(B)?(O.style.opacity="1",O.style.strokeWidth=String(O.dataset.channel==="reference"?Es:en)):(O.style.opacity="0.38",O.style.strokeWidth=""):(O.style.opacity="",O.style.strokeWidth="")}),E.querySelectorAll("path[data-arrowhead]").forEach(O=>{const B=(O.dataset.arrowhead??"").split(" ");P?O.style.opacity=B.some(F=>P.has(F))?"1":"0.08":O.style.opacity=""}),w.querySelectorAll("[data-node-id]").forEach(O=>{const B=O.dataset.nodeId??"";O.style.opacity=_?_.has(B)?"1":"0.25":""})}))},[]);p.useEffect(()=>Ce(null),[T,R,Ce]);const bn=m=>k(C=>{const E=new Set(C);return E.has(m)?E.delete(m):E.add(m),E}),bt=m=>{Ue("dir",m),d(m)},$e=m=>{Ue("merge",m),f(m)},wn=()=>{Ue("sibs",!b),u(!b)},Le=e.getConceptLabel("attribute",!0).toLowerCase(),ye=m=>`px-2 py-0.5 text-xs rounded border ${m?"border-blue-500 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300":"border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700"}`;return t.jsxs("div",{className:"relative w-full h-full",children:[t.jsxs("div",{"data-pan-ignore":!0,className:"absolute top-2 right-2 z-10 flex gap-1 items-center",children:[a&&t.jsxs(t.Fragment,{children:[t.jsx("button",{className:ye(i),title:i?"Hide owners: show only what you selected":"Show every owner up to the root (can pull in most of the schema)",onClick:a,children:"⇱ roots"}),t.jsx("span",{className:"w-px h-4 bg-gray-300 dark:bg-slate-600 mx-1"})]}),t.jsx("button",{className:ye(b),"data-help-id":"toolbar-siblings",title:b?"Siblings merged: classes sharing a parent share one box":"Siblings separate: no inheritance shown",onClick:wn,children:"⑃ siblings"}),t.jsx("span",{className:"w-px h-4 bg-gray-300 dark:bg-slate-600 mx-1"}),t.jsx("button",{className:ye(h==="RIGHT"),title:"Layout left to right",onClick:()=>bt("RIGHT"),children:"LR"}),t.jsx("button",{className:ye(h==="DOWN"),title:"Layout top down",onClick:()=>bt("DOWN"),children:"TB"}),t.jsx("span",{className:"w-px h-4 bg-gray-300 dark:bg-slate-600 mx-1"}),t.jsx("button",{className:ye(l==="near"),title:"Merge converging edges near the node (~40px)",onClick:()=>$e("near"),children:"⋙"}),t.jsx("button",{className:ye(l==="far"),title:"Merge converging edges early (~120px)",onClick:()=>$e("far"),children:"⋙⋙"}),t.jsx("button",{className:ye(l==="bend"),title:"Merge at ELK's last corner",onClick:()=>$e("bend"),children:"⌙"}),t.jsx("button",{className:ye(l==="off"),title:"No merging — every edge runs to its own port",onClick:()=>$e("off"),children:"≡"}),t.jsx("span",{className:"w-px h-4 bg-gray-300 dark:bg-slate-600 mx-1"}),[["+",()=>Q.zoomBy(1.3),"Zoom in"],["−",()=>Q.zoomBy(1/1.3),"Zoom out"],["1:1",()=>Q.applyZoom(1),"Reset zoom"],["⛶",()=>Q.zoomToFit(),"Fit to view"]].map(([m,C,E])=>t.jsx("button",{onClick:C,title:E,className:ye(!1),children:m},m))]}),D&&t.jsx("div",{className:"absolute inset-0 z-10 flex items-center justify-center text-sm text-gray-400 bg-white/50 dark:bg-slate-900/50",children:"Computing layout…"}),t.jsx("div",{ref:Q.containerRef,"data-graph-direction":h,className:"w-full h-full overflow-auto cursor-grab",children:t.jsx("div",{ref:Q.spacerRef,children:t.jsx("div",{ref:Q.wrapperRef,className:"relative",children:R&&t.jsxs(t.Fragment,{children:[t.jsxs("svg",{ref:X,className:"absolute top-0 left-0 pointer-events-none",width:ie,height:te,children:[t.jsxs("defs",{children:[t.jsx("marker",{id:v("arrow-own"),viewBox:"0 0 10 7",refX:"0",refY:"3.5",markerWidth:we,markerHeight:we*.75,markerUnits:"userSpaceOnUse",orient:"auto-start-reverse",children:t.jsx("path",{d:"M0,0L10,3.5L0,7Z",fill:ae.ownFwd})}),t.jsx("marker",{id:v("arrow-own-back"),viewBox:"0 0 10 7",refX:"10",refY:"3.5",markerWidth:we,markerHeight:we*.75,markerUnits:"userSpaceOnUse",orient:"auto-start-reverse",children:t.jsx("path",{d:"M10,0L0,3.5L10,7Z",fill:ae.ownBkwd})}),t.jsx("marker",{id:v("arrow-assoc"),viewBox:"0 0 10 7",refX:"0",refY:"3.5",markerWidth:we*St,markerHeight:we*.75*St,markerUnits:"userSpaceOnUse",orient:"auto-start-reverse",children:t.jsx("path",{d:"M0,0L10,3.5L0,7Z",fill:ae.association})})]}),t.jsxs("g",{transform:`translate(${Ne}, ${Ne})`,children:[[...q].map(([m,C])=>t.jsx("path",{"data-arrowhead":C.edgeIds.join(" "),d:ss(C.base,C.dir,we,Xe),fill:C.color?.text??Ct(C.isOwn,!1),opacity:C.dimmed?.4:1,style:{transition:"opacity 120ms"}},`head-${m}`)),R.edges.map(m=>{const C=se.get(m.id);if(!C)throw new Error(`Routed edge ${m.id} missing from view model`);const E=C.storageDirection==="flipped",w=J(C)===C.source?C.target:C.source,P=E||le.has(m.id)?void 0:H.get(`${w}|${w===C.source?"out":"in"}`),_=I.get(m.id),O=!!P&&Ze(l,_??He(m.sections))>0,B=C.type!=="ownership",F=O?m.sections:Os(m.sections,we+Ye+(E?2:0)),Y=B?Ms(F,Xe+Ye):F,oe=_??He(Y),ue=Ve=>Zn(Ve,js),me=Ze(l,oe),ve=P&&me>0?ts(oe,P.base,me,ue):ue(oe);if(!ve)return null;const be=C.type==="ownership",je=z.get(m.source)==="context"||z.get(m.target)==="context",Ie=O?void 0:be?E?"arrow-own-back":"arrow-own":"arrow-assoc";return t.jsxs("g",{children:[t.jsx("path",{"data-edge-id":m.id,"data-channel":be?"ownership":"reference",d:ve,fill:"none",opacity:je?.4:1,stroke:T.edgeColors.get(m.id)?.text??Ct(be,E),strokeWidth:be?Jt:Ns,strokeDasharray:be?void 0:"5 4",markerEnd:Ie?`url(#${v(Ie)})`:void 0,markerStart:!be&&!O?`url(#${v("arrow-assoc")})`:void 0,style:{transition:"opacity 120ms, stroke-width 120ms"}}),t.jsx("path",{d:ve,fill:"none",stroke:"transparent",strokeWidth:11,style:{pointerEvents:"stroke"},onMouseEnter:()=>Ce({kind:"edge",id:m.id}),onMouseLeave:()=>Ce(null)})]},m.id)})]})]}),T.nodes.map(m=>{const C=x.get(m.id);if(!C)return null;const E=m.role==="context";return t.jsxs("div",{"data-node-id":m.id,"data-help-id":zn(m),"data-pan-ignore":!0,"data-pinned":V.has(m.id)?"":void 0,onPointerDown:w=>L(m.id,w),onDoubleClick:w=>{V.has(m.id)&&(w.stopPropagation(),U(P=>{const _=new Map(P);return _.delete(m.id),_}))},onClick:()=>{if(ee.current){ee.current=!1;return}s?.(m.members.length?m.label:m.id)},onMouseEnter:()=>Ce({kind:"node",id:m.id}),onMouseLeave:()=>Ce(null),className:`absolute rounded-md text-xs bg-white dark:bg-slate-800 ${$.has(m.id)?"":"[transition:transform_300ms,opacity_120ms]"} cursor-pointer ${E?"opacity-60 border border-dashed border-gray-400 dark:border-slate-500":V.has(m.id)?"border-2 border-amber-500 dark:border-amber-400 shadow-md":"border-2 border-slate-500 dark:border-slate-400 shadow-md"}`,style:{width:de,height:m.height,transform:`translate(${C.x+Ne}px, ${C.y+Ne}px)`},children:[t.jsxs("div",{className:"flex items-center gap-1 px-2 rounded-t-[4px] bg-slate-700 dark:bg-slate-700 text-white border-b border-slate-800 dark:border-slate-600",style:{height:ke},children:[t.jsx("span",{className:`font-semibold truncate ${m.abstract?"italic":""}`,title:m.description||m.id,children:m.label}),t.jsxs("span",{className:"ml-auto flex gap-1 shrink-0",children:[m.members.length>0&&t.jsxs("span",{title:`${m.members.length} classes that are a ${m.label}, merged into one box`,className:"text-[9px] px-1 rounded bg-sky-100 dark:bg-sky-900 text-sky-800 dark:text-sky-200",children:["⑃ ",m.members.length]}),m.isaParents.map(w=>t.jsxs("span",{title:`is-a ${w}`,className:"text-[9px] px-1 rounded bg-sky-100 dark:bg-sky-900 text-sky-800 dark:text-sky-200",children:["⊳ ",w]},w)),m.subclassCount>0&&m.members.length===0&&t.jsxs("span",{title:`${m.subclassCount} subclasses shown`,className:"text-[9px] px-1 rounded bg-sky-100 dark:bg-sky-900 text-sky-800 dark:text-sky-200",children:["▷ ",m.subclassCount]}),(()=>{const P=(m.members.length?m.members.map(_=>_.id):[m.id]).filter(_=>n.has(_));return P.length?t.jsx("button",{"data-dismiss":m.id,"data-help-id":"node-dismiss",title:P.length>1?`Remove all ${P.length} selected classes in ${m.label}`:`Remove ${m.label} from the canvas`,onClick:_=>{_.stopPropagation(),P.forEach(O=>r?.(O))},className:`text-[10px] leading-none px-1 rounded text-gray-400
                                         hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/40`,children:"✕"}):null})()]})]}),m.relationGroups.length>0&&t.jsx("div",{"data-help-id":"relation-bar",className:`flex items-center gap-1 px-2 border-b overflow-hidden
                                     border-gray-200 dark:border-slate-600
                                     bg-sky-50/60 dark:bg-sky-950/30`,style:{height:ut},children:t.jsx(cs,{label:m.label,rows:m.relationRows,onAdd:w=>o?.(w),onRemove:w=>r?.(w),onInspect:s,colorOf:S,slotOrder:m.allRows.map(w=>w.slot)})}),m.rows.map(w=>w.header?t.jsx("div",{"data-no-drag":!0,"data-help-id":Fn(w.header.id),title:`${w.header.label} — is a ${m.label}; click for details`,onClick:P=>{P.stopPropagation(),s?.(w.header.id)},className:`flex items-center px-2 text-[10px] font-semibold
                                     cursor-pointer hover:brightness-110`,style:{height:Se,background:w.header.color.fill,color:Cn},children:t.jsx("span",{className:"truncate",children:w.header.label})},w.slot):t.jsxs("div",{"data-help-id":Qn(m,w),"data-expandable":M(w)?"":void 0,"data-no-drag":M(w)?"":void 0,title:(w.channel==="plain"?`${w.slot}: ${w.range}`:`${w.slot} → ${w.range} (${w.cardinality})${w.flipped?" — owner side":""}`+(M(w)?` — click to add ${w.range}`:""))+((w.owners?.length??0)>1?`
also declared by ${w.owners.slice(1).map(P=>P.label).join(", ")}`:""),onClick:M(w)?P=>{P.stopPropagation(),o?.(w.range)}:void 0,className:`flex items-center gap-1.5 px-2 text-[11px] ${w.targetColor?"":w.connected?"text-gray-700 dark:text-gray-300":"text-gray-400 dark:text-gray-500"} ${M(w)?"cursor-pointer hover:bg-sky-50 dark:hover:bg-sky-900/30 hover:text-sky-700 dark:hover:text-sky-300":""}`,style:{height:Se,...w.targetColor?{color:w.targetColor.text}:{}},children:[t.jsx("span",{className:"w-1.5 h-1.5 rounded-full shrink-0 border",style:{borderColor:w.rangeColor,background:w.connected?w.rangeColor:"transparent"}}),t.jsx("span",{className:`truncate ${m.members.length&&!w.owners?.length?`font-semibold ${w.targetColor?"":"text-gray-900 dark:text-gray-100"}`:""}`,children:w.slot}),w.isLoop&&t.jsx(ks,{title:`self-referential: a ${w.range} can own another ${w.range} via ${w.slot}`}),t.jsxs("span",{className:"ml-auto text-[9px] truncate max-w-[90px]",children:[t.jsx("span",{style:{color:w.rangeColor},children:w.range}),t.jsxs("span",{className:"text-gray-400 dark:text-gray-500",children:[" ",w.cardinality]})]})]},w.declaringClass?`${w.declaringClass}|${w.slot}`:w.slot)),m.hiddenCount>0&&t.jsx("button",{className:"w-full text-left px-2 text-[10px] text-sky-600 dark:text-sky-400 hover:underline",style:{height:Gt},title:`${Le} without an edge on the current canvas, plus plain (non-entity) ${Le}`,onClick:w=>{w.stopPropagation(),bn(m.id)},children:m.expanded?`− fewer ${Le}`:`+ ${m.hiddenCount} more ${Le}`})]},m.id)})]})})})})]})}function Ps({classId:e,dataService:n,onClose:s,onNavigate:o,isSelected:r,onToggleSelect:i}){const a=p.useMemo(()=>n.getClassSummary(e),[e,n]),[h,d]=p.useState([]),l=p.useCallback(u=>{u!==e&&(d(y=>[...y,e]),o(u))},[e,o]),f=p.useCallback(()=>{d(u=>u.length===0?u:(o(u[u.length-1]),u.slice(0,-1)))},[o]);p.useEffect(()=>{const u=y=>{y.key==="Escape"&&s()};return window.addEventListener("keydown",u),()=>window.removeEventListener("keydown",u)},[s]);const b=n.getTypeLabel("slot",!0);return t.jsxs("aside",{className:`w-96 shrink-0 flex flex-col min-h-0 border-l border-gray-200 dark:border-slate-700
                 bg-white dark:bg-slate-900`,"aria-label":"Entity details",children:[t.jsxs("header",{className:`flex items-start gap-2 px-3 py-2 border-b border-gray-200 dark:border-slate-700
                   bg-gray-50 dark:bg-slate-800 shrink-0`,children:[h.length>0&&t.jsx("button",{onClick:f,className:"text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-sm mt-0.5",title:"Back",children:"←"}),t.jsxs("div",{className:"flex-1 min-w-0",children:[t.jsxs("div",{className:"font-semibold text-sm text-blue-700 dark:text-blue-300 break-words",children:[a?.name??e,a?.isAbstract&&t.jsx("span",{className:"ml-1 text-xs text-purple-500 italic",children:"(abstract)"})]}),a?.parentId&&t.jsxs("div",{className:"text-xs text-gray-400",children:["is a"," ",t.jsx("button",{onClick:()=>l(a.parentId),className:"text-blue-600 dark:text-blue-400 hover:underline",children:a.parentId})]})]}),t.jsx("button",{onClick:s,className:"text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-sm px-1",title:"Close (Esc)",children:"✕"})]}),a?t.jsxs("div",{className:"flex-1 overflow-y-auto min-h-0 px-3 py-2 space-y-3",children:[t.jsx("button",{onClick:()=>i(e),className:`w-full px-2 py-1 text-xs rounded border ${r?"border-blue-500 bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300":"border-gray-300 dark:border-slate-600 hover:border-blue-400 text-gray-600 dark:text-gray-300"}`,children:r?"✓ In diagram — click to remove":"+ Add to diagram"}),a.description&&t.jsx("p",{className:"text-xs text-gray-600 dark:text-gray-300 leading-relaxed",children:a.description}),a.referencedBy.length>0&&t.jsxs("section",{children:[t.jsxs(Nt,{children:["Referenced by (",a.referencedBy.length,")"]}),t.jsx("ul",{className:"space-y-0.5",children:a.referencedBy.map((u,y)=>t.jsxs("li",{className:"text-xs",children:[t.jsx("button",{onClick:()=>l(u.classId),className:"text-blue-600 dark:text-blue-400 hover:underline cursor-pointer",children:u.classId}),t.jsxs("span",{className:"text-gray-400",children:[".",u.slotName]})]},`${u.classId}.${u.slotName}-${y}`))})]}),a.slots.length>0&&t.jsxs("section",{children:[t.jsxs(Nt,{children:[b," (",a.slots.length,")"]}),t.jsx("ul",{className:"divide-y divide-gray-100 dark:divide-slate-700",children:a.slots.map((u,y)=>t.jsxs("li",{className:"py-1.5",children:[t.jsxs("div",{className:"flex items-baseline gap-1.5 flex-wrap",children:[t.jsx("span",{className:"text-xs font-medium text-gray-800 dark:text-gray-100",children:u.name}),t.jsx(Ds,{range:u.range,onNavigate:l,dataService:n})]}),u.description&&t.jsx("p",{className:"mt-0.5 text-[11px] text-gray-500 dark:text-gray-400 leading-snug break-words",children:u.description})]},`${u.name}-${y}`))})]})]}):t.jsxs("div",{className:"p-3 text-xs text-gray-500",children:["Entity not found: ",e]})]})}function Nt({children:e}){return t.jsx("div",{className:"text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-1",children:e})}function Ds({range:e,onNavigate:n,dataService:s}){const o=s.itemExists(e)&&!e.endsWith("Enum"),a=`inline-block px-1 py-0 rounded text-[11px] font-medium ${new Set(["string","integer","boolean","float","double","decimal","date","datetime","time","uri","uriorcurie","ncname"]).has(e.toLowerCase())?"bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300":e.endsWith("Enum")?"bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300":"bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"}`;return o?t.jsx("button",{onClick:()=>n(e),className:`${a} hover:underline cursor-pointer`,children:e}):t.jsx("span",{className:a,children:e})}const Rs=[{heading:"One rule at a time",cases:[{name:"Rule 1 — multivalued owns forward",note:"A multivalued slot means the owner has-a collection, so ownership runs forward: Questionnaire.items and ResearchStudy.consents. The two `part_of` self-loops are the counterexample — multivalued but drawn backward, because they walk UP a tree.",sel:["ResearchStudy","Consent","Questionnaire","QuestionnaireItem"]},{name:"Rule 2 — single-valued belongs backward",note:"The largest group (70 edges). Participant fans OUT to 22 targets, nearly all reversed: each target declares `associated_participant` and is drawn as belonging to Participant. This is the group that would move if own-bkwd merges into association.",sel:["Participant","Condition","Demography","Exposure","Procedure","Visit"]},{name:"Exception 2a — no independent existence",note:"Single-valued, but forward anyway: Quantity, TimePoint and the like have no identity of their own, so the value belongs to whoever holds it rather than owning the holder.",sel:["SpecimenStorageActivity","Quantity","TimePoint","Activity"]},{name:"Entity-ranged — always forward",note:"The twelve focus / associated_evidence slots range on Entity, the universal root. A pointer AT the root is never a foreign key back to an owner, so these run forward whatever their cardinality. Both single- and multi-valued focus sites are here — all should point AT Entity.",sel:["Observation","ObservationSet","MeasurementObservation","Document","Condition","SdohObservation","Entity"]},{name:"Association — no ownership claim",note:"Both associations in the schema: Document.related_document → Specimen, and SpecimenContainer.container → SpecimenStorageActivity. Slate and dashed, arrowed at both ends. They are listed explicitly because they are multivalued, so Rule 1 would otherwise call them ownership.",sel:["Document","Specimen","SpecimenContainer","SpecimenStorageActivity"]},{name:"Self-loops",note:"The five self-owning slots (TimePoint.index_time_point, File.derived_from, Specimen.parent_specimen, ResearchStudy.part_of, SpecimenContainer.parent_container) — loop markers, not routed edges. ResearchStudy also pulls in its TimePoint edges; the loops are the circular arrows on the rows.",sel:["TimePoint","File","Specimen","ResearchStudy","SpecimenContainer"]}]},{heading:"Inheritance (the ⑃ siblings toggle)",cases:[{name:"One child, merged with its parent",note:"MeasurementObservation alone. It still merges: the box is titled Observation, its 13 inherited rows sit at the top in black, and MeasurementObservation's own 9 follow under its coloured header. Merging does not wait for a second sibling — a class must not change shape because of what else you happen to select.",sel:["MeasurementObservation"]},{name:"Children that add nothing",note:'SpecimenQuality- and SpecimenQuantityObservation declare no slots of their own. Both still get a header under the shared rows, because "this subclass adds nothing" is the answer to what they are — and without the headers the selection would leave no trace in the box at all.',sel:["SpecimenQualityObservation","SpecimenQuantityObservation"]},{name:"slot_usage — same name, different type",note:"QuestionnaireResponseValue's five children each narrow `value` to a different type (boolean, decimal, integer, TimePoint, and the parent's string). That narrowing is the entire reason the five classes exist, so each keeps its OWN row rather than merging into the parent's — the one place a shared row would be a lie.",sel:["QuestionnaireResponseValueBoolean","QuestionnaireResponseValueDecimal","QuestionnaireResponseValueInteger","QuestionnaireResponseValueString","QuestionnaireResponseValueTimePoint"]},{name:"The full Observation family",note:"All five Observation subclasses plus the parent. One box where there would be six, and the shared rows are stated once. Turn ⑃ siblings off to see what it replaces. Note each edge leaves in the colour of the child that owns its row; inherited slots' edges are the parent's and are drawn once, not once per child.",sel:["Observation","MeasurementObservation","SdohObservation","DimensionalObservation","SpecimenQualityObservation","SpecimenQuantityObservation"]}]},{heading:"The bare diagonal",cases:[{name:"BodySite 6-way (the original)",note:"The reproducer from the handoff. In ⌙ (bend) the top approach arrives as a straight diagonal with no steps; in ⋙ (near) it keeps its horizontal run. This is the case the fix has to fix.",sel:["BodySite","Condition","Consent","Demography","Exposure","Observation","Procedure","ImagingFile","ImagingStudy","MeasurementObservation","SpecimenCreationActivity"]},{name:"BodySite, owners only",note:"The same convergence with nothing else on canvas — six owners, no unrelated boxes for a diagonal to cut across. Shows whether the degeneracy is about the convergence itself or about crowding.",sel:["BodySite","Condition","ImagingFile","ImagingStudy","MeasurementObservation","Procedure","SpecimenCreationActivity"]},{name:"TimePoint 16-edge",note:"Densest corridor in the schema: 8 owners but 16 slot-edges, since each Specimen*Activity owns date_started and date_ended. Also where the second-from-top edge goes diagonal and pair edges cross.",sel:["TimePoint","Consent","ResearchStudy","TimePeriod","SpecimenCreationActivity","SpecimenProcessingActivity","SpecimenStorageActivity","SpecimenTransportActivity","QuestionnaireResponseValueTimePoint"]},{name:"TimePoint + Person (crossing)",note:"Siggie's repro for the crossing bug: the paired date_started / date_ended edges from different owners cross each other on the way in. Compare pair ordering against the case above.",sel:["TimePoint","Person","Consent","ResearchStudy","TimePeriod","SpecimenCreationActivity","SpecimenProcessingActivity","SpecimenStorageActivity","SpecimenTransportActivity","QuestionnaireResponseValueTimePoint"]}]},{heading:"Pathological convergences",cases:[{name:"Quantity 19-edge (worst case)",note:"The largest convergence in the schema: 16 owning classes, 19 slot-edges. The fan is squeezed hardest here, so ENTITY_FAN_GAP and the merge distance both show their limits.",sel:["Quantity","Activity","Assay","DeviceExposure","DimensionalObservation","DrugExposure","MeasurementObservation","Observation","Procedure","SdohObservation","SpecimenCreationActivity","SpecimenProcessingActivity","SpecimenQualityObservation","SpecimenQuantityObservation","SpecimenStorageActivity","SpecimenTransportActivity","Substance"]},{name:"Context 6-way (uniform owners)",note:"Six owners that are all observation classes — same size, same shape, similar row counts. The controlled comparison for BodySite, whose owners vary wildly in height.",sel:["Context","DimensionalObservation","MeasurementObservation","Observation","SdohObservation","SpecimenQualityObservation","SpecimenQuantityObservation"]},{name:"Two convergences at once",note:"Quantity and TimePoint both converge from the same Specimen activity classes, so two corridors compete for the same space. Where merge distance trades off against crossings.",sel:["Quantity","TimePoint","SpecimenCreationActivity","SpecimenProcessingActivity","SpecimenStorageActivity","SpecimenTransportActivity"]}]},{heading:"Flipped divergences (found via the legend)",cases:[{name:"Participant 22-way (largest fan in the schema)",note:"Bigger than any inbound convergence: 22 edges leaving Participant, 21 of them FLIPPED. Flipped edges keep their attribute-row anchor and must not merge, so this is the fan the merge code deliberately does not touch — and therefore the one nothing has been tuned against.",sel:["Participant","Condition","Consent","Demography","DeviceExposure","DrugExposure","Exposure","File","ImagingStudy","MeasurementObservation","Observation","Procedure","SdohObservation","Specimen","Visit"]},{name:"Visit 19-way",note:"The same shape one size down, and it overlaps Participant heavily — most classes carry both associated_participant and associated_visit, so the two fans run through the same corridor as pairs.",sel:["Visit","Condition","Demography","DeviceExposure","DrugExposure","Exposure","ImagingStudy","MeasurementObservation","Observation","Procedure","QuestionnaireResponse","SdohObservation","TimePeriod"]},{name:"Participant + Visit + Organization",note:"All three FK hubs at once (22 + 19 + 11 edges, nearly all flipped). The densest picture the schema can produce, and the stress test for anything that changes routing.",sel:["Participant","Visit","Organization","Condition","Demography","DimensionalObservation","MeasurementObservation","Observation","ObservationSet","Procedure","SdohObservation","SpecimenQualityObservation","SpecimenQuantityObservation"]},{name:"Converge and diverge at once",note:"MeasurementObservation owns BodySite/Context/Quantity while being owned by Participant/Visit/Organization — edges fan IN and OUT of the same box. Where merged (entity-end) and unmerged (flipped) arrivals sit side by side.",sel:["MeasurementObservation","BodySite","Context","Quantity","Participant","Visit","Organization","MeasurementObservationSet"]}]},{heading:"Normal cases (a fix must not break these)",cases:[{name:"Single edge",note:"One owner, one edge, no convergence at all — merging is a no-op. The floor: if this looks wrong, something basic broke.",sel:["Visit","TimePeriod"]},{name:"Two owners",note:"The smallest real convergence. Two approaches, one arrowhead — the fan is barely a fan, so a merge distance that is too long is obvious here first.",sel:["Participant","Visit","ObservationSet"]},{name:"Specimen chain (deep, not wide)",note:"A long ownership chain rather than a convergence: many layers, few edges per node. Checks that tuning for convergences has not made ordinary edges worse.",sel:["Specimen","SpecimenContainer","SpecimenCreationActivity","SpecimenProcessingActivity","SpecimenStorageActivity","SpecimenTransportActivity","Participant"]},{name:"The known 3-node cycle",note:"Specimen -> SpecimenStorageActivity -> SpecimenContainer -> Specimen: an association plus two ownership edges. Known and deliberately unhandled; here so it stays visible.",sel:["Specimen","SpecimenStorageActivity","SpecimenContainer"]},{name:"Backward ownership (own-bkwd)",note:"Slots drawn backward (performed_by, associated_person, contained_in, related_imaging_study). These keep their attribute-row anchor and must NOT merge — check the arrowheads.",sel:["Organization","Person","Participant","ImagingFile","ImagingStudy","SpecimenContainer","Specimen"]},{name:"Path to root",note:"Path-to-root on from a single deep class, which pulls in every owner up the chain. The biggest graph reachable in one click.",sel:["MeasurementObservation"],roots:!0}]}],$s=3,Je=40;function tn(){const[e,n]=p.useState(null),s=p.useCallback(r=>{if(r.button!==0||r.target.closest('button, a, input, select, textarea, [role="button"], [data-no-drag]'))return;const a=(r.currentTarget.closest("[data-draggable]")??r.currentTarget).getBoundingClientRect(),h=r.clientX,d=r.clientY,l={left:a.left,top:a.top},f=r.currentTarget;f.setPointerCapture(r.pointerId);let b=!1;const u=v=>{const c=v.clientX-h,k=v.clientY-d;if(!b&&Math.hypot(c,k)<$s)return;b=!0;const g={left:Math.max(Math.min(l.left+c,window.innerWidth-Je),Je-a.width),top:Math.min(Math.max(l.top+k,0),window.innerHeight-Je)};n(g)},y=v=>{f.releasePointerCapture(v.pointerId),f.removeEventListener("pointermove",u),f.removeEventListener("pointerup",y),f.removeEventListener("pointercancel",y)};f.addEventListener("pointermove",u),f.addEventListener("pointerup",y),f.addEventListener("pointercancel",y)},[]),o=p.useCallback(()=>n(null),[]);return{offset:e,onPointerDown:s,reset:o}}function nn({title:e,subtitle:n,onClose:s,offset:o,children:r}){const i=tn();p.useEffect(()=>{const h=d=>{d.key==="Escape"&&s()};return window.addEventListener("keydown",h),()=>window.removeEventListener("keydown",h)},[s]);const a=i.offset!==null;return t.jsxs("div",{"data-draggable":"",style:{resize:"both",...i.offset?{position:"fixed",...i.offset,right:"auto"}:{}},className:`z-30 w-[26rem] max-h-[80vh] overflow-y-auto
                  rounded-lg border border-gray-300 dark:border-slate-600
                  bg-white dark:bg-slate-800 shadow-xl
                  text-gray-900 dark:text-gray-100
                  ${a?"":`absolute top-14 ${o?"right-[27rem]":"right-4"}`}`,children:[t.jsxs("div",{onPointerDown:i.onPointerDown,className:`sticky top-0 flex items-baseline justify-between gap-2 px-4 py-2
                   border-b border-gray-200 dark:border-slate-700
                   bg-white dark:bg-slate-800 cursor-grab active:cursor-grabbing
                   select-none`,children:[t.jsxs("div",{children:[t.jsx("h2",{className:"text-sm font-semibold",children:e}),n&&t.jsx("p",{className:"text-[11px] text-gray-500 dark:text-gray-400",children:n})]}),t.jsxs("div",{className:"flex items-center gap-1 shrink-0",children:[a&&t.jsx("button",{onClick:i.reset,title:"Put it back",className:`text-gray-400 hover:text-gray-700 dark:hover:text-gray-200
                         text-xs leading-none px-1`,children:"⤺"}),t.jsx("button",{onClick:s,title:"Close (Esc)",className:"text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-lg leading-none",children:"×"})]})]}),t.jsx("div",{className:"px-4 py-2",children:r})]})}function Ls(e,n){return e.sel.length===n.size&&e.sel.every(s=>n.has(s))}function Is({onClose:e,onApply:n,selectedIds:s,dataService:o,offset:r}){const i=p.useMemo(()=>o.getConvergenceRanking(),[o]),a=p.useMemo(()=>o.getDivergenceRanking(),[o]),h=d=>n({name:"ad hoc",note:"",sel:d});return t.jsxs(nn,{title:"Example cases",subtitle:"Selections worth looking at, simple to dense.",onClose:e,offset:r,children:[t.jsxs("section",{className:"mb-4",children:[t.jsx(Et,{children:"Biggest fans"}),t.jsx("p",{className:"text-[11px] text-gray-500 dark:text-gray-400 mb-1.5",children:"Counted in slot-edges, not classes: one class owning a target through two slots crowds the corridor twice. Click a row to load just that fan."}),t.jsx("div",{className:"grid grid-cols-2 gap-3",children:[["Converging (in)",i.slice(0,6).map(d=>({entity:d.entity,n:d.edgeCount,peers:d.owners,flipped:0}))],["Diverging (out)",a.slice(0,6).map(d=>({entity:d.entity,n:d.edgeCount,peers:d.owned,flipped:d.flippedCount}))]].map(([d,l])=>t.jsxs("div",{children:[t.jsx("h4",{className:"text-[10px] font-medium text-gray-500 dark:text-gray-400 mb-0.5",children:d}),t.jsx("ul",{className:"space-y-0.5",children:l.map(f=>t.jsx("li",{children:t.jsxs("button",{onClick:()=>h([f.entity,...f.peers]),title:`Select ${f.entity} and all ${f.peers.length} peers`,className:"w-full text-left text-xs hover:bg-gray-50 dark:hover:bg-slate-700 rounded px-1",children:[t.jsx("span",{className:"text-blue-600 dark:text-blue-400",children:f.entity}),t.jsxs("span",{className:"text-gray-400 ml-1",children:[f.n,f.flipped>0?` (${f.flipped} flipped)`:""]})]})},f.entity))})]},d))})]}),Rs.map(d=>t.jsxs("section",{className:"mb-3 last:mb-1",children:[t.jsx(Et,{children:d.heading}),t.jsx("ul",{className:"space-y-1.5",children:d.cases.map(l=>{const f=Ls(l,s);return t.jsx("li",{children:t.jsxs("button",{onClick:()=>n(l),className:`block w-full text-left rounded px-2 py-1 border
                      ${f?"border-blue-500 bg-blue-50 dark:bg-blue-950":"border-transparent hover:bg-gray-50 dark:hover:bg-slate-700"}`,children:[t.jsx("span",{className:`text-xs font-medium ${f?"text-blue-700 dark:text-blue-300":"text-blue-600 dark:text-blue-400"}`,children:l.name}),t.jsxs("span",{className:"ml-1.5 text-[10px] text-gray-400",children:[l.sel.length,l.roots?" ⇱":""]}),t.jsx("p",{className:"text-[11px] leading-snug text-gray-600 dark:text-gray-400 mt-0.5",children:l.note})]})},l.name)})})]},d.heading))]})}function Et({children:e}){return t.jsx("h3",{className:`text-[11px] font-semibold uppercase tracking-wider
                   text-gray-400 dark:text-gray-500 mb-1`,children:e})}const Tt={"own-fwd":{text:"owns (forward)",color:ae.ownFwd},"own-bkwd":{text:"belongs to (backward)",color:ae.ownBkwd},association:{text:"association (no ownership)",color:ae.association},excluded:{text:"dropped",cls:"text-gray-400 dark:text-gray-500 border-gray-300"}},_s=[{kind:"own-fwd",color:ae.ownFwd,title:"A owns B",body:"The arrow runs from the owner to what it holds. A owns B when the schema puts the collection on A, or when B has no independent existence — a Quantity of 5 mg is not something you look up."},{kind:"own-bkwd",color:ae.ownBkwd,title:"A belongs to B",body:'The same relationship stored at the other end: A carries a pointer to one B that exists without it. Drawn B → A, so you still read "start at B to find A". A Participant carries on existing whether or not any observation points at it.'},{kind:"association",color:ae.association,title:"A and B are associated",body:"Neither owns the other. Dashed, with arrowheads at both ends. Only two edges in the schema are this — a slot the ownership rules would otherwise claim, wrongly."}],Bs=[{glyph:"⇱ roots",what:"Also draw everything on the path up to a root."},{glyph:"⑃ siblings",what:"Draw classes that share a parent as one merged box."},{glyph:"LR / TB",what:"Lay the diagram out left-to-right or top-down."},{glyph:"⋙ ⋙⋙ ⌙ ≡",what:"Where converging edges join before their shared arrowhead — near the box, early, at the last corner, or not at all. Temporary, for picking one by eye."},{glyph:"+ − 1:1 ⛶",what:"Zoom in, out, reset, fit to view."}],Hs=[["0..1","optional, at most one"],["1..1","required, exactly one"],["0..*","optional, any number"],["1..*","required, one or more"]];function Fs({dataService:e,onClose:n,onSelect:s,offset:o}){const r=p.useMemo(()=>e.getOwnershipPairGroups(),[e]),[i,a]=p.useState(null),h=d=>t.jsx("button",{onClick:()=>s([d]),className:"hover:underline text-blue-600 dark:text-blue-400",title:`Select ${d}`,children:d});return t.jsx(nn,{title:"Ownership legend",subtitle:"What the diagram's arrows, colors and buttons mean.",onClose:n,offset:o,children:t.jsxs("div",{className:"text-xs",children:[t.jsxs(Oe,{title:"The three kinds of relationship",children:[t.jsxs("p",{className:"text-[11px] text-gray-500 dark:text-gray-400 mb-2",children:["Every edge is a class-valued attribute. Classes are placed so that if ",t.jsx("b",{children:"A"})," is drawn before ",t.jsx("b",{children:"B"}),", you reach ",t.jsx("b",{children:"B"})," through"," ",t.jsx("b",{children:"A"})," — so an edge always tells you where to start."]}),t.jsx("ul",{className:"space-y-2",children:_s.map(d=>t.jsxs("li",{className:"flex gap-2",children:[t.jsx(Bt,{kind:d.kind,className:"mt-0.5"}),t.jsxs("div",{className:"min-w-0",children:[t.jsx("div",{className:"font-medium",style:{color:d.color},children:d.title}),t.jsx("p",{className:"text-[11px] leading-snug text-gray-600 dark:text-gray-400",children:d.body})]})]},d.title))}),t.jsxs("p",{className:"text-[11px] leading-snug text-gray-500 dark:text-gray-400 mt-2",children:["An edge leaves the ",t.jsx("b",{children:"attribute's row"}),", not the box — that is how you tell which attribute made it. A ",t.jsx("b",{children:"⟲"})," on a row is a slot pointing back at its own class."]}),t.jsxs("p",{className:"text-[11px] leading-snug text-gray-500 dark:text-gray-400 mt-2",children:["Owners are drawn first, so a box's ",t.jsx("b",{children:"← N"})," counts what it belongs to (on its left) and ",t.jsx("b",{children:"M →"})," what it owns (on its right). Hover either to list them. The little edge on each row is the one above: it says which end holds the arrowhead, and so which entity declares the attribute — and ",t.jsx("i",{children:"both"})," kinds turn up on ",t.jsx("i",{children:"both"})," sides."]})]}),t.jsxs(Oe,{title:"Colors",children:[t.jsx(Ot,{caption:"A row's dot and its range label say what KIND of thing the attribute points at.",items:[{color:xe.entity,label:"another entity"},{color:xe.enum,label:"a value set"},{color:xe.dataType,label:"a data type"}]}),t.jsxs("p",{className:"text-[11px] leading-snug text-gray-600 dark:text-gray-400 mt-2",children:["A ",t.jsx("b",{children:"filled"})," dot draws an edge; a ",t.jsx("b",{children:"hollow"})," one does not, because what it points at is not on the canvas. Only entity ranges can draw edges at all."]}),t.jsx(Ot,{className:"mt-3",caption:"Inside a merged box, a color says which class an attribute belongs to.",items:Dn.slice(0,4).map((d,l)=>({color:d.text,swatch:d.fill,label:l===0?"the parent":`child ${l}`}))})]}),t.jsx(Oe,{title:"Cardinality",children:t.jsx("ul",{className:"flex flex-wrap gap-x-4 gap-y-1",children:Hs.map(([d,l])=>t.jsxs("li",{className:"flex items-center gap-1.5",children:[t.jsx("span",{className:"font-mono text-[11px] text-gray-700 dark:text-gray-300",children:d}),t.jsx("span",{className:"text-[11px] text-gray-500 dark:text-gray-400",children:l})]},d))})}),t.jsx(Oe,{title:"The toolbar",children:t.jsx("ul",{className:"space-y-1",children:Bs.map(d=>t.jsxs("li",{className:"flex gap-2",children:[t.jsx("span",{className:"shrink-0 font-mono text-[11px] text-gray-700 dark:text-gray-300 w-20",children:d.glyph}),t.jsx("span",{className:"text-[11px] leading-snug text-gray-600 dark:text-gray-400",children:d.what})]},d.glyph))})}),t.jsxs(Oe,{title:"Every relationship, by rule",children:[t.jsx("p",{className:"text-[11px] text-gray-500 dark:text-gray-400 mb-1.5",children:"Derived live from the classifier the graph itself uses, so this cannot drift from what is drawn. Overrides and value-object membership are hand-curated — if a pair looks wrong, the classification is. Click any class to select it."}),t.jsx("ul",{className:"space-y-1",children:r.map(d=>{const l=`${d.verdict}/${d.rule}`,f=Tt[d.verdict]??Tt.excluded,b=i===l;return t.jsxs("li",{className:"border-l-2 pl-2 border-gray-200 dark:border-slate-600",children:[t.jsxs("button",{onClick:()=>a(b?null:l),className:"w-full text-left",children:[t.jsx("span",{className:`inline-block px-1 rounded border text-[10px] ${f.cls??""}`,style:f.color?{color:f.color,borderColor:f.color}:void 0,children:f.text}),t.jsx("span",{className:"ml-1.5 font-medium",children:d.rule}),t.jsx("span",{className:"ml-1 text-gray-400",children:d.pairs.length}),t.jsx("span",{className:"ml-1 text-gray-400",children:b?"▾":"▸"})]}),t.jsx("p",{className:"text-[11px] leading-snug text-gray-600 dark:text-gray-400 mt-0.5",children:d.ruleText}),b&&t.jsx("ul",{className:"mt-1 mb-1.5 space-y-0.5 font-mono text-[10px]",children:d.pairs.map(u=>t.jsxs("li",{className:"text-gray-600 dark:text-gray-400",children:[h(u.declaredOn),t.jsxs("span",{className:"text-gray-400",children:[".",u.slotName]}),t.jsx("span",{className:"mx-1 text-gray-400",children:u.multivalued?"↠":"→"}),h(u.range),u.isLoop&&t.jsx("span",{className:"ml-1",style:{color:xe.entity},children:"loop"}),(d.verdict==="own-bkwd"||d.verdict==="association")&&t.jsxs("span",{className:"ml-1 text-gray-400",children:["(owner: ",u.owner,")"]})]},`${u.declaredOn}.${u.slotName}`))})]},l)})})]}),t.jsxs("p",{className:"text-[10px] text-gray-400 dark:text-gray-500 mt-3",children:["A box's ",t.jsx("b",{children:"“N related”"})," count is of distinct classes"," ",t.jsx("i",{children:"outside"})," it, so selecting a class that folds into a merged box can make the number go ",t.jsx("i",{children:"down"}),". Correct, if counter-intuitive."]})]})})}function Oe({title:e,children:n}){return t.jsxs("section",{className:"mb-4 last:mb-1",children:[t.jsx("h3",{className:`text-[11px] font-semibold uppercase tracking-wider
                     text-gray-400 dark:text-gray-500 mb-1`,children:e}),n]})}function Ot({caption:e,items:n,className:s}){return t.jsxs("div",{className:s,children:[t.jsx("p",{className:"text-[11px] text-gray-500 dark:text-gray-400 mb-1",children:e}),t.jsx("ul",{className:"flex flex-wrap gap-x-3 gap-y-1",children:n.map(o=>t.jsxs("li",{className:"flex items-center gap-1",children:[t.jsx("span",{className:"inline-block w-3 h-3 rounded-sm border",style:{background:o.swatch??o.color,borderColor:o.color}}),t.jsx("span",{className:"text-[11px]",style:{color:o.color},children:o.label})]},o.label))})]})}const Ws=!1,zs=!1,sn=p.createContext(null);function Te(){const e=p.useContext(sn);if(!e)throw new Error("useHelp must be used inside <HelpProvider>");return e}const Qs=300,Gs=[{id:"graph-canvas-reading",label:"Reading the diagram"},{id:"relation-bar",label:"The relation bar"},{id:"toolbar-siblings",label:"Inheritance and merged boxes"},{id:"node-dismiss",label:"Closing a box"},{id:"copy-link",label:"Sharing what you see"}];function Vs({onOpenLegend:e,onOpenCases:n,legendOpen:s,casesOpen:o,onClosePanels:r,anyPanelOpen:i}){const{showEntry:a,showAddresses:h,toggleAddresses:d}=Te(),[l,f]=p.useState(!1),b=p.useRef(void 0),u=()=>{b.current!==void 0&&(clearTimeout(b.current),b.current=void 0)},y=()=>{u(),b.current=setTimeout(()=>f(!1),Qs)};p.useEffect(()=>u,[]),p.useEffect(()=>{if(!l)return;const c=g=>{g.target?.closest("[data-help-menu]")||f(!1)},k=g=>{g.key==="Escape"&&f(!1)};return document.addEventListener("mousedown",c,!0),document.addEventListener("keydown",k),()=>{document.removeEventListener("mousedown",c,!0),document.removeEventListener("keydown",k)}},[l]);const v=c=>()=>{f(!1),c()};return t.jsxs("span",{"data-help-menu":!0,"data-help-id":"help-menu",className:"relative",onMouseEnter:()=>{u(),f(!0)},onMouseLeave:y,children:[t.jsxs("button",{onClick:()=>f(c=>!c),title:"Legend, example cases and help topics",className:`text-sm underline hover:text-white ${l?"text-white":"text-blue-100"}`,children:["Help ",t.jsx("span",{"aria-hidden":!0,className:"opacity-70",children:"▾"})]}),l&&t.jsxs("div",{className:`absolute right-0 top-full mt-1 z-40 w-60 py-1
                     rounded-md border border-gray-300 dark:border-slate-600
                     bg-white dark:bg-slate-800 shadow-xl
                     text-gray-900 dark:text-gray-100`,children:[t.jsxs(ze,{onClick:v(e),children:[s?"Hide ownership legend":"Ownership legend",t.jsx(et,{children:"every relationship in the schema, by rule"})]}),t.jsxs(ze,{onClick:v(n),children:[o?"Hide example cases":"Example cases",t.jsx(et,{children:"selections worth looking at"})]}),i&&t.jsxs(ze,{onClick:v(r),children:["Close all panels",t.jsx(et,{children:"legend, cases and the detail drawer"})]}),t.jsx(qs,{}),Gs.map(c=>t.jsx(ze,{onClick:v(()=>a(c.id)),children:c.label},c.id)),zs]})]})}function ze({onClick:e,children:n}){return t.jsx("button",{onClick:e,className:`block w-full text-left px-3 py-1.5 text-xs
                 hover:bg-gray-100 dark:hover:bg-slate-700`,children:n})}function et({children:e}){return t.jsx("span",{className:"block text-[10px] text-gray-400 dark:text-gray-500",children:e})}function qs(){return t.jsx("div",{className:"my-1 border-t border-gray-200 dark:border-slate-700"})}function on(e){const n=Number(e?.trim());return Number.isFinite(n)&&n>=240?n:void 0}function rn(e){const n=e?.trim().toLowerCase();return n==="dim"||n==="ring"||n==="none"?n:void 0}function an(e){const n=e?.trim().toLowerCase();return n==="left"||n==="right"||n==="top"||n==="bottom"?n:void 0}function ln(e){const n=e?.trim();if(!n)return;const s=Number(n);if(Number.isFinite(s))return{px:s};const o=n.match(/^(-)?(?:anchor|parentBox)\.(width|height)(?:\s*\*\s*(-?[\d.]+))?$/i);if(!o)return;const[,r,i,a]=o,h=a===void 0?1:Number(a);if(Number.isFinite(h))return{of:i.toLowerCase(),times:r?-h:h}}function pt(e,n){const s=e?.trim();if(!s)return{kind:"help-id",arg:n};if(s==="none")return{kind:"none"};const o=s.indexOf(":");return o===-1?{kind:"help-id",arg:s}:{kind:s.slice(0,o).trim(),arg:s.slice(o+1).trim()}}const Ks="Format",Us="Walkthrough",Xs=new Set([Ks,"TODO"]),cn=/^<\/?(?:details|summary)\b[^>]*>$/i;function ce(e,n){const s=n.toLowerCase();for(const o of e){const r=lt(o);if(r){if(r.name==="beats"&&s!=="beats")return;if(r.name===s)return r.value}}}function lt(e){const n=e.trimStart().match(/^-\s+(.*)$/);if(!n)return;const s=n[1].replace(/\*\*/g,""),o=s.indexOf(":");if(o===-1)return;const r=s.slice(0,o).trim();if(/^[A-Za-z_][A-Za-z0-9_]*$/.test(r))return{name:r.toLowerCase(),value:s.slice(o+1).trim()}}function dn(e,n){const s=`- **${n}:**`,o=e.findIndex(l=>l.trimStart().startsWith(s));if(o===-1)return;const r=e[o].trimStart().slice(s.length).trim(),i=[];for(let l=o+1;l<e.length&&!(e[l].trimStart().startsWith("- **")||cn.test(e[l].trim()));l++)i.push(e[l]);for(;i.length&&i[i.length-1].trim()==="";)i.pop();if(i.length===0)return r;const a=i.filter(l=>l.trim()!=="").map(l=>l.length-l.trimStart().length),h=Math.min(...a),d=i.map(l=>l.slice(h)).join(`
`);return r?`${r}
${d}`:d}function Ys(e,n){const s=`- **${n}:**`,o=e.findIndex(i=>i.trimStart().startsWith(s));if(o===-1)return[];const r=[];for(let i=o+1;i<e.length;i++){const a=e[i].trimStart();if(a.startsWith("- **")||a==="")break;a.startsWith("- ")&&r.push(a.slice(2).trim())}return r}function Zs(e,n){const s=e.findIndex(a=>lt(a)?.name==="beats");if(s===-1)return;const o=[];let r=null;const i=()=>{r&&o.push(r)};for(let a=s+1;a<e.length;a++){const h=e[a].trimStart();if(e[a].length>0&&!/^\s/.test(e[a])&&lt(e[a])||e[a].length>0&&!/^\s/.test(e[a])&&/^<\/?[a-z]/i.test(h))break;if(h==="")continue;const d=h.match(/^(\d+)\.\s+(.*)$/);if(d){i(),r={text:d[2].trim()};continue}const l=h.match(/^-\s+([A-Za-z]+):\s*(.*)$/);if(l&&r){const[,f,b]=l,u=f.toLowerCase();if(u==="description"){const y=e[a].length-e[a].trimStart().length,v=[];let c=a+1;for(;c<e.length;c++){if(e[c].trim()===""){v.push("");continue}if(e[c].length-e[c].trimStart().length<=y)break;v.push(e[c])}for(;v.length&&v[v.length-1].trim()==="";)v.pop();if(v.length){const k=v.filter(N=>N.trim()!=="").map(N=>N.length-N.trimStart().length),g=Math.min(...k),S=v.map(N=>N.slice(g)).join(`
`);r.description=b?`${b}
${S}`:S}else r.description=b;a=c-1;continue}u==="anchor"?r.anchor=pt(b,n):u==="action"?r.action=b.trim():u==="change"?r.change=b.trim():u==="only"?(r.change=b.trim(),r.replace=!0):u==="highlight"?r.highlight=rn(b):u==="width"?r.width=on(b):u==="position"?r.position=an(b):u==="offsetx"?r.offsetX=ln(b):u==="keep"&&(r.keep=b.trim()!=="false");continue}r&&!h.startsWith("-")&&(r.text=`${r.text} ${h}`.trim())}return i(),o.length>0?o:void 0}function Js(e,n){const s=e.split(`
`),r=s[0].match(/^###\s+(.+)$/);if(!r)return null;const i=r[1].trim(),a=ce(s,"Title")??i,h=dn(s,"Description")??"",d=Ys(s,"Interactions"),l=ce(s,"Shortcut"),f=ce(s,"Context"),b=pt(ce(s,"Anchor"),i),u=ce(s,"Action"),y=ce(s,"Once"),v=ce(s,"Only"),c=ce(s,"Change"),k=c??v,g=c===void 0&&v!==void 0?!0:void 0,S=rn(ce(s,"Highlight")),N=on(ce(s,"Width")),j=an(ce(s,"Position")),A=ln(ce(s,"OffsetX")),T=Zs(s,i),$=ce(s,"Tour");return{id:i,title:a,description:h,interactions:d,shortcut:l,context:f,anchor:b,action:u,once:y,change:k,replace:g,highlight:S,width:N,position:j,offsetX:A,tour:$===void 0?void 0:$||Us,order:n,beats:T}}function eo(e,n){const s=e.split(`
`),o=s.findIndex(y=>/^##\s+/.test(y)),r=o===-1?null:s[o].match(/^##\s+(.+)$/),i=r?r[1].trim():"Unknown",a=i.toLowerCase().replace(/[^a-z0-9]+/g,"-"),h=[];for(let y=o+1;y<s.length&&!s[y].startsWith("### ");y++)cn.test(s[y].trim())||h.push(s[y]);const d=h.join(`
`).trim(),l=ce(h,"TourMetadata"),f=l===void 0?void 0:{name:l||i,description:dn(h,"Description")?.trim()??""},b=[],u=e.split(/(?=^### )/m);for(const y of u){if(!y.startsWith("### "))continue;const v=Js(y.trim(),n());v&&b.push(v)}return{id:a,title:i,body:d,entries:b,tourMeta:f}}function hn(e){const n=new Set;for(const s of[...e.entries.values()].sort((o,r)=>o.order-r.order))s.tour&&n.add(s.tour);return[...n]}function un(e,n){const s=n??hn(e)[0];return[...e.entries.values()].filter(o=>o.tour!==void 0&&o.tour===s).sort((o,r)=>o.order-r.order)}function tt(e,n){return n<0?e:`${e} ▸${n+1}`}function nt(e){return`### ${e}`}function ct(e,n){const s=[];return un(e,n).forEach((o,r)=>{const i=r+1;if(!o.beats||o.beats.length===0){s.push({entry:o,step:i,beatIndex:0,beatCount:0,address:tt(o.id,-1),searchFor:nt(o.id),blocks:[o.description],text:o.description,anchor:o.anchor,action:o.action,change:o.change,replace:o.replace,highlight:o.highlight,width:o.width,position:o.position,offsetX:o.offsetX});return}let a=o.description?[o.description]:[];a.length>0&&s.push({entry:o,step:i,beatIndex:-1,beatCount:o.beats.length,address:tt(o.id,-1),searchFor:nt(o.id),blocks:a,text:a.join(`

`),anchor:o.anchor,action:o.action,change:o.change,replace:o.replace,highlight:o.highlight,width:o.width,position:o.position,offsetX:o.offsetX});let h=o.width;o.beats.forEach((d,l)=>{const f=d.description??"";a=d.keep?[...a,f]:[f],d.width!==void 0&&(h=d.width),s.push({entry:o,step:i,beatIndex:l,beat:d,beatCount:o.beats.length,address:tt(o.id,l),searchFor:nt(o.id),blocks:a,text:a.join(`

`),anchor:d.anchor??o.anchor,action:d.action,highlight:d.highlight??o.highlight,width:h,position:d.position??o.position,offsetX:d.offsetX??o.offsetX,change:d.change,replace:d.replace})})}),s}function to(e){const s=e.replace(/<!--[\s\S]*?-->/g,"").trim().split(/(?=^## )/m).map(h=>h.trim()).filter(Boolean),o=[],r=new Map;let i=0;for(const h of s){if(!h.match(/^## /m))continue;const d=h.match(/^##\s+(.+)$/m)?.[1].trim();if(d&&Xs.has(d))continue;const l=eo(h,()=>i++);o.push(l);for(const f of l.entries)r.set(f.id,f)}const a=new Map;for(const h of o)h.tourMeta&&a.set(h.tourMeta.name,h.tourMeta);return{sections:o,entries:r,tourMeta:a}}const no=/\{\{\s*([a-z][a-z0-9-]*)\s*:\s*([^}]*?)\s*\}\}/gi;function so(e,n){return!n||!e.includes("{{")?e:e.replace(no,(s,o,r)=>n[o.toLowerCase()]?.(r)??s)}function Mt(e){const n=new Set;return e.map((s,o)=>({p:s,index:o})).filter(({p:s})=>n.has(s.step)?!1:(n.add(s.step),!0)).map(({p:s,index:o})=>({index:o,step:s.step,title:s.entry.title,beatCount:s.beatCount}))}function pn({scope:e,onClose:n}){const{content:s,tours:o,tourMeta:r,tourName:i,tourIndex:a,positions:h,position:d,goToStep:l,startTour:f}=Te();p.useEffect(()=>{const k=g=>{g.key==="Escape"&&n()};return window.addEventListener("keydown",k),()=>window.removeEventListener("keydown",k)},[n]);const b=p.useRef(null);p.useEffect(()=>{const k=b.current;if(!(!k||typeof k.showPopover!="function"))return k.showPopover(),()=>{k.matches(":popover-open")&&k.hidePopover()}},[]);const u=p.useMemo(()=>e==="all"?o.map(k=>({name:k,rows:Mt(ct(s,k))})):[],[e,o,s]),y=d?.step,v=a===null?void 0:i,c=(k,g,S)=>t.jsxs("button",{onClick:S,"aria-current":g?"step":void 0,className:`help-map-step${g?" help-map-step-here":""}`,children:[t.jsx("span",{className:"help-map-num",children:k.step}),t.jsx("span",{className:"help-map-title",children:k.title}),k.beatCount>0&&t.jsx("span",{className:"help-map-beats",title:`${k.beatCount+1} screens in this step`,children:k.beatCount+1})]},k.index);return Rt.createPortal(t.jsx("div",{ref:b,popover:"manual",className:"help-map-backdrop",onMouseDown:n,children:t.jsxs("div",{role:"dialog","aria-label":e==="all"?"All tours":"Tour outline",className:"help-map",onMouseDown:k=>k.stopPropagation(),children:[t.jsxs("div",{className:"help-map-head",children:[t.jsxs("div",{children:[t.jsx("h2",{children:e==="all"?"Tours":v??"This tour"}),t.jsx("p",{children:e==="all"?"Every guided walk, and what is in it. Click any step to start there.":"Click any step to jump to it."})]}),t.jsx("button",{onClick:n,title:"Close (Esc)",className:"help-map-close",children:"✕"})]}),t.jsx("div",{className:"help-map-body",children:e==="tour"?Mt(h).map(k=>c(k,k.step===y,()=>{l(k.index),n()})):u.map(({name:k,rows:g})=>t.jsxs("section",{className:"help-map-tour",children:[t.jsx("button",{className:"help-map-tourname",onClick:()=>{f(k),n()},children:k}),r.get(k)?.description&&t.jsx("p",{className:"help-map-blurb",children:r.get(k).description}),g.map(S=>c(S,v===k&&S.step===y,()=>{v===k?l(S.index):f(k,S.index),n()}))]},k))})]})}),document.body)}function oo(){const{tours:e,tourMeta:n,startTour:s}=Te(),[o,r]=p.useState(!1),[i,a]=p.useState(!1),h=p.useRef(null);return p.useEffect(()=>{if(!o)return;const d=f=>{f.target?.closest("[data-tour-chooser]")||r(!1)},l=f=>{f.key==="Escape"&&r(!1)};return document.addEventListener("mousedown",d,!0),document.addEventListener("keydown",l),()=>{document.removeEventListener("mousedown",d,!0),document.removeEventListener("keydown",l)}},[o]),e.length===0?null:t.jsxs("span",{"data-tour-chooser":!0,"data-help-id":"tour-chooser",className:"relative",onMouseEnter:()=>r(!0),children:[t.jsx("button",{onClick:()=>r(d=>!d),title:"Guided walks through the app and the model",className:`text-sm font-semibold px-2.5 py-1 rounded-full bg-white/95
                   text-blue-700 shadow-sm hover:bg-white hover:shadow`,children:"Guided tours"}),o&&t.jsxs("div",{ref:h,role:"dialog","aria-label":"Guided tours",className:`absolute right-0 top-full mt-1 z-40 w-80 p-1
                     rounded-md border border-gray-300 dark:border-slate-600
                     bg-white dark:bg-slate-800 shadow-xl
                     text-gray-900 dark:text-gray-100`,children:[t.jsxs("p",{className:"px-3 pt-2 pb-1 text-[11px] text-gray-500 dark:text-gray-400",children:["Each one stands on its own. Leave any tour with ",t.jsx("kbd",{children:"Esc"}),"."]}),t.jsxs("button",{"data-tour-overview":!0,onClick:()=>{r(!1),a(!0)},className:`block w-full text-left px-3 py-2 rounded
                       hover:bg-gray-100 dark:hover:bg-slate-700`,children:[t.jsx("span",{className:"block text-xs font-semibold",children:"Overview"}),t.jsxs("span",{className:"block text-[11px] text-gray-500 dark:text-gray-400",children:["All ",e.length," tours and every step in them — start anywhere."]})]}),t.jsx("div",{className:"my-1 border-t border-gray-200 dark:border-slate-700"}),e.map(d=>t.jsxs("button",{onClick:()=>{r(!1),s(d)},className:`block w-full text-left px-3 py-2 rounded
                         hover:bg-gray-100 dark:hover:bg-slate-700`,children:[t.jsx("span",{className:"block text-xs font-semibold",children:d}),n.get(d)?.description&&t.jsx("span",{className:"block text-[11px] text-gray-500 dark:text-gray-400",children:n.get(d).description})]},d))]}),i&&t.jsx(pn,{scope:"all",onClose:()=>a(!1)})]})}const ro="dmvd.help.showAddresses";function ao(){const e=document.activeElement;return e instanceof HTMLInputElement||e instanceof HTMLTextAreaElement||e?.getAttribute("contenteditable")==="true"}function io(e,n){if(!n)return e;const s=i=>so(i,n),o=i=>i===void 0?void 0:s(i),r=new Map([...e.entries].map(([i,a])=>[i,{...a,description:s(a.description),interactions:a.interactions.map(s),action:o(a.action),context:o(a.context),beats:a.beats?.map(h=>({...h,description:o(h.description),action:o(h.action)}))}]));return{sections:e.sections.map(i=>({...i,entries:i.entries.map(a=>r.get(a.id)??a),tourMeta:i.tourMeta&&{...i.tourMeta,description:s(i.tourMeta.description)}})),entries:r,tourMeta:new Map([...e.tourMeta].map(([i,a])=>[i,{...a,description:s(a.description)}]))}}function lo({markdown:e,onPushChange:n,onPopChange:s,onJumpChanges:o,onTourStart:r,onTourEnd:i,textResolvers:a,centerOn:h,children:d}){const[l,f]=p.useState(),b=l??a,u=p.useMemo(()=>io(to(e),b),[e,b]),[y,v]=p.useState(!1),[c,k]=p.useState(null),[g,S]=p.useState(void 0),N=p.useMemo(()=>hn(u),[u]),j=p.useMemo(()=>ct(u,g),[u,g]),A=p.useMemo(()=>un(u,g).length,[u,g]),[T,$]=p.useState(null),[W,V]=p.useState(()=>!1),U=p.useCallback(()=>{V(H=>{const I=!H;try{window.localStorage.setItem(ro,I?"1":"0")}catch{}return I})},[]),G=p.useCallback(()=>{v(!1),$(null)},[]),R=p.useCallback(()=>$(null),[]),D=p.useCallback(H=>$(H),[]),Q=p.useCallback(H=>{const I=j[H];I&&(k(H),$(I.entry.id),I.change!=null&&n&&n(I.change,I.replace))},[j,n]),ie=p.useCallback(H=>{j[H+1]?.change!=null&&s&&s();const q=j[H];q&&(k(H),$(q.entry.id))},[j,s]),te=p.useCallback(H=>{if(c===null||H===c)return;const I=j[H];if(I&&o){if(H>c){const q=j.slice(c+1,H+1).filter(K=>K.change!=null).map(K=>({query:K.change,replace:K.replace}));o(q,0)}else{const q=j.slice(H+1,c+1).filter(K=>K.change!=null).length;o([],q)}k(H),$(I.entry.id)}},[c,j,o]),ge=p.useCallback((H,I=0)=>{v(!1),S(H);const q=ct(u,H),K=Math.min(Math.max(I,0),Math.max(q.length-1,0)),M=q[K];if(!M)return;r?.(),k(K),$(M.entry.id);const X=q.slice(0,K+1).filter(Z=>Z.change!=null).map(Z=>({query:Z.change,replace:Z.replace}));K>0&&o?o(X,0):M.change!=null&&n&&n(M.change,M.replace)},[u,n,o,r]),ee=p.useCallback(()=>{k(null),$(null),S(void 0),i?.()},[i]),re=p.useCallback(()=>{c!==null&&(c+1>=j.length?ee():Q(c+1))},[c,j.length,Q,ee]),x=p.useCallback(()=>{c!==null&&c>0&&ie(c-1)},[c,ie]),L=p.useCallback(()=>{c!==null&&ee(),$(null)},[c,ee]),z=p.useCallback(H=>{if(!H)return null;const{kind:I}=H;if(I==="none")return null;const{arg:q}=H,K=I==="help-id"?q:`${I}:${q}`,M=document.querySelectorAll(`[data-help-id="${CSS.escape(K)}"]`);return M.length<2?M[0]??null:[...M].find(X=>X.getBoundingClientRect().height>0)??M[0]},[]);p.useEffect(()=>(document.body.classList.toggle("help-mode",y),()=>{document.body.classList.remove("help-mode")}),[y]),p.useEffect(()=>{if(y)return window.addEventListener("blur",G),()=>window.removeEventListener("blur",G)},[y,G]),p.useEffect(()=>{if(!y)return;function H(I){const q=I.target;if(!q)return;const K=q.closest("[data-help-id]");K?(I.stopPropagation(),I.preventDefault(),D(K.getAttribute("data-help-id"))):q.closest("[data-help-popover]")||R()}return document.addEventListener("click",H,!0),()=>document.removeEventListener("click",H,!0)},[y,D,R]),p.useEffect(()=>{function H(I){if(I.key==="?"&&!ao()){I.preventDefault(),c===null?ge():ee();return}if(I.key==="Escape"&&(y||c!==null||T)){I.preventDefault(),I.stopPropagation(),T&&c===null?R():c!==null?ee():L();return}c!==null&&(I.key==="ArrowRight"&&(I.preventDefault(),re()),I.key==="ArrowLeft"&&(I.preventDefault(),x()))}return document.addEventListener("keydown",H,!0),()=>document.removeEventListener("keydown",H,!0)},[y,c,T,L,R,ee,ge,re,x]);const se=p.useCallback(()=>h?z(pt(h,h))?.getBoundingClientRect()??null:null,[h,z]),le=p.useMemo(()=>({setTextResolvers:f,helpMode:y,toggleHelpMode:L,exitHelpMode:G,tourIndex:c,startTour:ge,endTour:ee,nextStep:re,prevStep:x,goToStep:te,positions:j,position:c===null?void 0:j[c],stepCount:A,tours:N,tourName:g,tourMeta:u.tourMeta,showAddresses:W,toggleAddresses:U,content:u,activeId:T,showEntry:D,dismissEntry:R,resolveAnchor:z,centerRect:se}),[y,L,G,c,ge,ee,re,x,te,j,A,N,g,W,U,u,T,D,R,z,se]);return t.jsx(sn.Provider,{value:le,children:d})}const dt={a:({href:e,children:n})=>t.jsx("a",{href:e,target:"_blank",rel:"noreferrer",children:n}),blockquote:({children:e})=>t.jsxs("div",{className:"help-popover-alert",role:"note",children:[t.jsx("span",{className:"help-popover-alert-mark","aria-hidden":"true",children:"!"}),t.jsx("div",{children:e})]})};function co(e){try{return localStorage.getItem(e)}catch{return null}}function ho(e,n){try{localStorage.setItem(e,n)}catch{}}const gn="help-once-",st="data-help-anchor",At="data-help-hint",uo="--help-hint",po=40;function go(e){return e.split(`
`).filter(n=>!/^\s{0,3}>/.test(n)).join(`
`).replace(/\n{3,}/g,`

`).trim()}function mo(e){return co(gn+e)==="1"}function fo(e){ho(gn+e,"1")}function yo(e){return{...dt,blockquote:({children:n})=>t.jsxs("div",{className:"help-popover-alert",role:"note",children:[t.jsx("span",{className:"help-popover-alert-mark","aria-hidden":"true",children:"!"}),t.jsxs("div",{children:[n,t.jsxs("label",{className:"help-popover-alert-once",children:[t.jsx("input",{type:"checkbox",onChange:e}),"Don't show this again"]})]})]})}}function xo(){const{helpMode:e,tourIndex:n,position:s,positions:o,stepCount:r,content:i,activeId:a,dismissEntry:h,nextStep:d,prevStep:l,endTour:f,showEntry:b,resolveAnchor:u,centerRect:y,showAddresses:v}=Te(),[c,k]=p.useState(!1),g=n!==null,S=a?i.entries.get(a):void 0,N=tn(),j=u,A=g?s?.anchor:S?.anchor,T=(g?s?.highlight:S?.highlight)??"dim",$=()=>{if(!s||s.beatCount===0)return null;const M=s.beatIndex+1;return t.jsx("span",{className:"help-tour-dots",title:`Screen ${M+1} of ${s.beatCount+1} in this step`,children:Array.from({length:s.beatCount},(X,Z)=>t.jsx("span",{className:Z<M?"help-dot help-dot-on":"help-dot"},Z))})},[W,V]=p.useState(!1),[U,G]=p.useState(void 0),[R,D]=p.useState(!1),Q=p.useRef(null),[,ie]=p.useState(0),te=S?.once,ge=te!==void 0&&mo(te),ee=p.useMemo(()=>te===void 0?dt:yo(()=>{fo(te),ie(M=>M+1)}),[te]),re=(g?s?.blocks??[]:[S?.description??""]).map(M=>ge?go(M):M).filter(Boolean),x=(g?s?.width:void 0)??Math.max(jo(re.join(`

`)),g?No():0),L=p.useRef(!1);p.useEffect(()=>{L.current=!1},[a,A]);const z=N.reset;p.useEffect(()=>{z()},[a,n,z]),p.useLayoutEffect(()=>{if(!a){V(!1),G(void 0);return}let M=null;const X=()=>{const he=j(A);he!==M&&(M?.removeAttribute(st),M=he,V(!!he),G(he?.closest("[data-graph-direction]")?.getAttribute("data-graph-direction")==="RIGHT"?"below":void 0),he&&(he.setAttribute(st,""),L.current||(L.current=!0,he.scrollIntoView({block:"center",behavior:"smooth"}))))};X();const Z=new MutationObserver(X);return Z.observe(document.body,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["data-help-id"]}),()=>{Z.disconnect(),M?.removeAttribute(st),V(!1),G(void 0)}},[a,A,j]);const se=600,le=g&&s?.change!=null&&A!==void 0&&A.kind!=="none",[H,I]=p.useState(!1);p.useEffect(()=>{if(!le){I(!0);return}I(!1);const M=window.setTimeout(()=>I(!0),se);return()=>window.clearTimeout(M)},[le,n]);const q=H||W;p.useEffect(()=>{const M=Q.current;M&&(S&&q?M.matches(":popover-open")||M.showPopover():M.matches(":popover-open")&&M.hidePopover())},[S,q]),p.useEffect(()=>{(!e||g)&&D(!1)},[e,g]);const K=p.useMemo(()=>e&&!g?[...i.entries.values()].filter(M=>j(M.anchor)).slice(0,po).map((M,X)=>({id:M.id,title:M.title,name:`${uo}-${X}`})):[],[e,g,i,j]);return p.useLayoutEffect(()=>{const M=K.map(X=>{const Z=j(i.entries.get(X.id)?.anchor);return Z?.setAttribute(At,X.name),Z}).filter(Boolean);return()=>M.forEach(X=>X.removeAttribute(At))},[K,i,j]),t.jsxs(t.Fragment,{children:[W&&a&&T!=="none"&&t.jsx("div",{className:`help-spotlight${T==="ring"?" help-spotlight-ring":""}`}),K.map(({id:M,title:X,name:Z})=>t.jsx("button",{className:"help-hint",title:X??M,style:{positionAnchor:Z},onMouseEnter:()=>{R||b(M)},onMouseLeave:()=>{R||h()},onClick:he=>{he.stopPropagation(),D(!0),b(M)},children:"?"},M)),t.jsx("div",{ref:Q,popover:"manual","data-help-popover":"","data-anchored":W?"":void 0,className:"help-popover",style:{...Eo(W,g?s?.position:void 0,g?s?.offsetX:void 0,x,W?null:y(),U),...N.offset?{positionArea:"none",left:N.offset.left,top:N.offset.top,right:"auto",bottom:"auto",margin:0,transform:"none"}:{}},children:S&&t.jsxs(t.Fragment,{children:[t.jsx("h4",{className:"help-popover-title",onPointerDown:N.onPointerDown,style:{cursor:N.offset?"grabbing":"grab",userSelect:"none"},title:"Drag to move",children:S.title}),g&&s?.action&&t.jsxs("div",{className:"help-popover-action",children:[t.jsx("span",{className:"help-popover-action-mark","aria-hidden":"true",children:"✓"}),t.jsx("div",{children:t.jsx(_e,{children:s.action})})]}),g&&v&&s?.change&&!s.action&&t.jsxs("div",{className:"help-popover-action",style:{opacity:.85},children:[t.jsx("span",{className:"help-popover-action-mark","aria-hidden":"true",children:"⚠"}),t.jsxs("div",{children:[t.jsx("em",{children:"Authoring:"})," this position changes the app (",t.jsx("code",{children:s.change}),") but has no ",t.jsx("code",{children:"Action:"}),"."]})]}),re.length>0&&t.jsx("div",{className:"help-popover-body",children:re.map((M,X,Z)=>t.jsx("div",{className:X===Z.length-1?void 0:"help-beat-past",children:t.jsx(_e,{components:ee,children:M})},X))}),S.interactions.length>0&&t.jsx("ul",{className:"help-popover-interactions",children:S.interactions.map((M,X)=>t.jsx("li",{children:t.jsx(_e,{components:dt,children:M})},X))}),S.shortcut&&t.jsxs("p",{className:"help-popover-shortcut",children:["Shortcut: ",t.jsx("kbd",{children:S.shortcut})]}),S.context&&t.jsx("div",{className:"help-popover-context",children:t.jsx(_e,{children:S.context})}),g?t.jsxs("div",{className:"help-tour-nav",children:[t.jsxs("span",{className:"help-tour-count",title:`Position ${n+1} of ${o.length}`,children:[s?.step," / ",r]}),$(),t.jsx("button",{className:"help-tour-map-btn",onClick:()=>k(M=>!M),"aria-expanded":c,title:"Show the tour outline",children:"⊞"}),t.jsx("span",{className:"help-tour-spacer"}),t.jsx("button",{onClick:l,disabled:n===0,title:"Previous (← arrow key)",children:"← back"}),t.jsx("button",{onClick:d,className:"help-tour-next",title:"Next (→ arrow key)",children:n+1===o.length?"done":"next →"}),t.jsx("button",{onClick:f,title:"End the tour and undo what it added (Esc)",children:"✕"})]}):t.jsxs("div",{className:"help-tour-nav",children:[t.jsx("span",{className:"help-tour-spacer"}),t.jsx("button",{onClick:()=>{D(!1),h()},children:"close"})]}),v&&t.jsx(bo,{address:g?s?.address:S.id,searchFor:g?s?.searchFor:`### ${S.id}`})]})}),c&&g&&t.jsx(pn,{scope:"tour",onClose:()=>k(!1)})]})}function bo({address:e,searchFor:n}){const[s,o]=p.useState(!1);return p.useEffect(()=>{if(!s)return;const r=setTimeout(()=>o(!1),1200);return()=>clearTimeout(r)},[s]),!e||!n?null:t.jsxs("button",{type:"button",className:"help-popover-address",title:`Copy “${n}” — search help-content.md for it`,onClick:()=>{navigator.clipboard?.writeText(n).then(()=>o(!0),()=>{})},children:[e,s?" ✓":""]})}const mn=320,wo=320,vo=800,ko=8,So=24,Co=3;function jo(e){const n=e.trim().length;return n===0?mn:Math.round(Math.min(vo,Math.max(wo,Math.sqrt(n*ko*So*Co))))}function No(){return 393}function Eo(e,n,s,o,r,i){const a=window.innerWidth,h=window.innerHeight,d=Math.min(o??mn,a-16);if(!e){const f=r??new DOMRect(0,0,a,h),b=f.left+f.width/2;return{left:Math.max(8,Math.min(b-d/2,a-d-8)),top:"50%",transform:"translateY(-50%)",maxHeight:`${h-16}px`,width:d}}return{positionArea:n?{right:"inline-end span-block-end",left:"inline-start span-block-end",top:"block-start span-inline-end",bottom:"block-end span-inline-end"}[n]:i==="below"?"block-end span-inline-end":"inline-end span-block-end",width:d,...To(s)}}function To(e){return e?{marginLeft:"px"in e?`${e.px}px`:`calc(anchor-size(${e.of}) * ${e.times})`}:{}}const ot=e=>e&&e.trim()?e.trim():void 0;function Oo(e){return{"model-description":n=>ot(e.getClassDescription(n)),"enum-description":n=>ot(e.getEnumDetail(n)?.description),"category-label":n=>ot($t.find(s=>s.id===n)?.label)}}const Mo=`# BDCHM Explorer help

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
`,gt={inTour:!1,held:[],tempHeld:[],tour:[],region:0,tourStates:[],scalars:{}},Ao="~";function Pt(e,n){return e&&n.includes(e)?e:null}function fn(e,n=!1){const s=new URLSearchParams(e),o={};if(s.get("panels")==="0"){for(const d of Wt)o[d]=!1;o.detail=null}s.has("detail")&&(o.detail=s.get("detail")||null),s.has("roots")&&(o.roots=s.get("roots")==="1"),s.has("sibs")&&(o.sibs=s.get("sibs")==="1"),s.has("legend")&&(o.legend=s.get("legend")==="1"),s.has("cases")&&(o.cases=s.get("cases")==="1");const r=Pt(s.get("dir"),["RIGHT","DOWN"]);r&&(o.dir=r);const i=Pt(s.get("merge"),["near","far","bend","off"]);i&&(o.merge=i);const a=s.get("sel"),h=a?a.split(Ao).filter(Boolean):zt(s);return n?{sel:h,scalars:o,replace:!0}:{sel:h,scalars:o}}function Re(e,n){return[...new Set([...e,...n])]}function Po(e){return{...gt,inTour:!0,held:[...e]}}function Do(){return gt}function Ro(e){return Re(e.held,e.tempHeld)}function yn(e,n){const s=n.replace?e.region+1:e.region,o=n.replace?[...n.sel]:Re(e.tour,n.sel),r={...e.scalars,...n.scalars};return{...e,tour:o,region:s,scalars:r,tourStates:[...e.tourStates,{sel:o,scalars:r,region:s}]}}function xn(e){if(e.tourStates.length===0)return e;const n=e.tourStates.slice(0,-1),s=n[n.length-1];return{...e,tourStates:n,tour:s?s.sel:[],region:s?s.region:0}}function mt(e){return e.region>0}function $o(e,n){if(!e.inTour)return e;const s=mt(e)?"tempHeld":"held";return e[s].includes(n)?e:{...e,[s]:[...e[s],n]}}function Lo(e,n){if(!e.inTour)return e;const s=o=>o.filter(r=>r!==n);return{...e,tour:s(e.tour),tempHeld:s(e.tempHeld),held:mt(e)?e.held:s(e.held)}}function ft(e,n){if(!n.inTour)return e;const s=mt(n)?Re(n.tour,n.tempHeld):Re(Re(n.tour,n.tempHeld),n.held);return{...e,...n.scalars,sel:s}}function Io(){const{modelData:e,loading:n,error:s}=Rn(),o=p.useMemo(()=>e?new $n(e):null,[e]),{setTextResolvers:r}=Te(),i=p.useMemo(()=>o?Oo(o):void 0,[o]);p.useEffect(()=>r(i),[i,r]);const a=p.useMemo(()=>fe(),[]),[h,d]=p.useState(()=>new Set(a.sel)),[l,f]=p.useState(a.detail),[b,u]=p.useState(!1),y=p.useRef(!1),[v,c]=p.useState("list"),[k,g]=p.useState(a.roots),[S,N]=p.useState(a.sibs),[j,A]=p.useState(a.dir),[T,$]=p.useState(a.merge),[W,V]=p.useState(a.cases),[U,G]=p.useState(a.legend),[R,D]=p.useState(!1),Q=p.useCallback(x=>{d(new Set(x.sel)),g(!!x.roots),f(null)},[]);p.useEffect(()=>{const x=()=>{const L=fe();d(new Set(L.sel)),f(L.detail),g(L.roots),N(L.sibs),A(L.dir),$(L.merge),G(L.legend),V(L.cases)};return window.addEventListener("popstate",x),window.addEventListener("explore:state-from-url",x),()=>{window.removeEventListener("popstate",x),window.removeEventListener("explore:state-from-url",x)}},[]),p.useEffect(()=>{const x={sel:[...h],detail:l,roots:k,sibs:S,dir:j,merge:T,legend:U,cases:W},L=y.current;y.current=!1,Qt(x,{push:L})},[h,l,k,S,j,T,U,W]);const ie=p.useCallback(x=>{Ee(x,!fe().sel.includes(x)),d(L=>{const z=new Set(L);return z.has(x)?z.delete(x):z.add(x),z})},[]),te=p.useCallback(x=>{Ee(x,!0),d(L=>L.has(x)?L:new Set(L).add(x))},[]),ge=p.useCallback(x=>{Ee(x,!1),d(L=>{if(!L.has(x))return L;const z=new Set(L);return z.delete(x),z})},[]),ee=p.useCallback(x=>{d(z=>z.size===x.length&&x.every(se=>z.has(se))?z:(y.current=!0,new Set(x)));const L=new Set(x);for(const z of fe().sel)L.has(z)||Ee(z,!1);for(const z of x)Ee(z,!0)},[]),re=p.useCallback(()=>{for(const x of fe().sel)Ee(x,!1);d(new Set),f(null),u(!1),g(!1)},[]);return s?t.jsxs("div",{className:"p-8 text-red-600",children:["Failed to load model data: ",String(s)]}):n||!o?t.jsx("div",{className:"p-8 text-gray-400",children:"Loading model…"}):t.jsxs("div",{className:"relative flex flex-col h-screen bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100",children:[t.jsxs("header",{className:"flex items-center justify-between px-4 py-2 bg-blue-600 text-white shrink-0",children:[t.jsxs("div",{children:[t.jsx("h1",{"data-help-id":"app-title",className:"text-lg font-bold leading-tight cursor-pointer hover:opacity-80 transition-opacity",onClick:re,title:"Click to clear the selection and reset the view",children:"BDCHM Explorer"}),t.jsx("p",{className:"text-xs text-blue-100",children:"BioData Catalyst Harmonized Model"})]}),t.jsxs("div",{className:"flex items-center gap-4",children:[t.jsx(Qo,{}),t.jsx(oo,{}),t.jsx(Vs,{onOpenLegend:()=>G(x=>!x),onOpenCases:()=>V(x=>!x),legendOpen:U,casesOpen:W,anyPanelOpen:U||W||l!==null,onClosePanels:()=>{G(!1),V(!1),f(null)}}),t.jsx("button",{onClick:async()=>{const x=xs({sel:[...h],detail:l,roots:k,sibs:S,dir:j,merge:T,legend:U,cases:W});try{await navigator.clipboard.writeText(x),D(!0),window.setTimeout(()=>D(!1),1500)}catch{D(!1),window.prompt("Copy this link:",x)}},"data-help-id":"copy-link",className:"text-sm underline text-blue-100 hover:text-white",title:"Copy a link that reproduces exactly this view, settings included",children:R?"✓ copied":"copy link"}),t.jsx("a",{href:"/dynamic-model-var-docs/previous.html",className:"text-sm underline text-blue-100 hover:text-white",children:"previous views"}),t.jsx("a",{href:"https://github.com/Sigfried/dynamic-model-var-docs",target:"_blank",rel:"noopener noreferrer",className:"text-blue-100 hover:text-white",title:"Source code on GitHub","aria-label":"Source code on GitHub",children:t.jsx("svg",{viewBox:"0 0 16 16",width:"18",height:"18",fill:"currentColor","aria-hidden":!0,children:t.jsx("path",{d:"M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"})})})]})]}),U&&t.jsx(Fs,{onClose:()=>G(!1),onSelect:x=>Q({name:"ad hoc",note:"",sel:x}),dataService:o}),W&&t.jsx(Is,{onClose:()=>V(!1),onApply:Q,selectedIds:h,dataService:o,offset:U}),t.jsxs("div",{className:"flex-1 flex min-h-0",children:[b?t.jsxs("button",{onClick:()=>u(!1),title:"Show entity selection",className:`shrink-0 w-8 border-r border-gray-200 dark:border-slate-700
                       bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700
                       flex flex-col items-center gap-2 py-2 text-gray-400`,children:[t.jsx("span",{className:"text-xs",children:"▶"}),t.jsxs("span",{className:"text-[10px] uppercase tracking-wider [writing-mode:vertical-rl]",children:[o.getConceptLabel("entity",!0),h.size>0?` (${h.size})`:""]})]}):t.jsxs("div",{className:"w-80 shrink-0 flex flex-col min-h-0 border-r border-gray-200 dark:border-slate-700",children:[t.jsx("div",{className:"flex-1 overflow-y-auto min-h-0","data-help-id":"selection-tree",children:v==="tree"?t.jsx(Vn,{dataService:o,selectedIds:h,onToggle:ie,onShowDetail:f}):t.jsx(Gn,{dataService:o,selectedIds:h,onToggle:ie,onShowCategory:ee})}),t.jsx("button",{onClick:()=>c(x=>x==="tree"?"list":"tree"),title:"Switch between the ownership tree and the flat category list",className:`shrink-0 px-3 py-1 text-xs text-gray-400 border-t border-gray-200
                         dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 text-left`,children:v==="tree"?"☰ flat list":"⑃ tree"}),t.jsx("button",{onClick:()=>u(!0),title:"Hide entity selection",className:`shrink-0 px-3 py-1 text-xs text-gray-400 border-t border-gray-200
                         dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 text-left`,children:"◀ Hide"})]}),t.jsx("div",{className:"flex-1 min-w-0","data-help-id":"graph-canvas",children:h.size===0?t.jsx("div",{className:"h-full flex items-center justify-center text-sm text-gray-400 p-8",children:"Select entities on the left to build the ownership subgraph."}):t.jsx(As,{dataService:o,selectedIds:h,onNodeClick:f,onAdd:te,onRemove:ge,pathToRoot:k,onTogglePathToRoot:()=>g(x=>!x),direction:j,setDirection:A,mergeMode:T,setMergeMode:$,mergeSibs:S,setMergeSibs:N})}),l&&t.jsx(Ps,{classId:l,dataService:o,onClose:()=>f(null),onNavigate:f,isSelected:h.has(l),onToggleSelect:ie})]})]})}let ne=gt;function Ee(e,n){ne=n?$o(ne,e):Lo(ne,e)}function Ge(e){Qt(e),window.dispatchEvent(new Event("explore:state-from-url"))}function _o(){ne=Po(fe().sel)}function Bo(){if(!ne.inTour)return;const e=Ro(ne),n=fe();ne=Do(),Ge({...n,sel:e})}function Ho(e,n=!1){ne=yn(ne,fn(e,n)),Ge(ft(fe(),ne))}function Fo(){ne=xn(ne),Ge(ft(fe(),ne))}function Wo(e,n){for(let s=0;s<n;s++)ne=xn(ne);for(const s of e)ne=yn(ne,fn(s.query,s.replace));Ge(ft(fe(),ne))}function zo(){return t.jsxs(lo,{markdown:Mo,onPushChange:Ho,onPopChange:Fo,onJumpChanges:Wo,onTourStart:_o,onTourEnd:Bo,children:[t.jsx(Io,{}),t.jsx(xo,{})]})}function Qo(){const{helpMode:e,toggleHelpMode:n,startTour:s}=Te();return p.useEffect(()=>{ms()&&s()},[]),t.jsx("span",{className:"flex items-center gap-2","data-help-id":"help-button",children:Ws})}Ln.createRoot(document.getElementById("root")).render(t.jsx(p.StrictMode,{children:t.jsx(zo,{})}));
