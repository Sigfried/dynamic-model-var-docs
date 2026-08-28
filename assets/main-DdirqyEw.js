import{r as u,j as t,R as Dt,g as _t,G as ce,a as Bt,c as Ht,b as Wt,d as Ft,S as zt,M as Me,u as Gt,D as Ut,e as qt}from"./index-C73tCobu.js";function Kt({dataService:e,selectedIds:o,onToggle:n}){const a=u.useMemo(()=>e.getCategoryTrees(),[e]),[r,s]=u.useState(new Set),i=l=>s(d=>{const f=new Set(d);return f.has(l)?f.delete(l):f.add(l),f}),c=a.reduce((l,d)=>l+d.classIds.length,0);return t.jsxs("div",{className:"text-sm",children:[t.jsx("div",{className:"flex items-baseline gap-2 px-3 py-2 border-b border-gray-200 dark:border-slate-700",children:t.jsxs("span",{className:"font-semibold flex-1",children:[e.getConceptLabel("entity",!0)," (",c,")"]})}),a.map(l=>{const d=r.has(l.id),f=l.classIds.filter(x=>o.has(x)).length;return t.jsxs("div",{children:[t.jsxs("button",{type:"button",onClick:()=>i(l.id),className:`w-full flex items-center gap-2 px-3 py-1.5 text-left font-medium
                         bg-gray-50 dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700
                         hover:bg-gray-100 dark:hover:bg-slate-700`,children:[t.jsx("span",{className:"text-xs text-gray-400",children:d?"▶":"▼"}),t.jsx("span",{className:"flex-1",children:l.label}),f>0&&t.jsxs("span",{className:"text-xs text-gray-400",children:[f," / ",l.classIds.length]})]}),!d&&l.roots.map(x=>t.jsx(it,{node:x,depth:0,selectedIds:o,onToggle:n},x.classId))]},l.id)})]})}function it({node:e,depth:o,selectedIds:n,onToggle:a}){const{classId:r}=e;return t.jsxs(t.Fragment,{children:[t.jsxs("label",{"data-class-row":r,className:`flex items-center gap-2 pr-3 py-1 cursor-pointer
                    hover:bg-blue-50 dark:hover:bg-slate-800
                    ${n.has(r)?"bg-blue-50 dark:bg-slate-800":""}`,style:{paddingLeft:`${.75+o*1}rem`},children:[t.jsx("input",{type:"checkbox",checked:n.has(r),onChange:()=>a(r)}),t.jsxs("span",{className:"flex-1 min-w-0 truncate",children:[t.jsx("span",{className:"font-mono text-xs",children:r}),e.outOfCategoryParent&&t.jsxs("span",{className:"ml-1 text-[10px] text-gray-400 dark:text-slate-500",title:`Extends ${e.outOfCategoryParent}, which is in another category`,children:["↳ ",e.outOfCategoryParent]})]})]}),e.children.map(s=>t.jsx(it,{node:s,depth:o+1,selectedIds:n,onToggle:a},s.classId))]})}function Vt({dataService:e,selectedIds:o,onToggle:n,onShowDetail:a}){const r=u.useMemo(()=>e.getContainmentNodes(),[e]),s=u.useMemo(()=>e.getEntityColumns(),[e]),i=u.useMemo(()=>{const c=new Map;for(const l of r){const d=e.getRangeCountsByType(l.id);c.set(l.id,{props:e.getSlotCount(l.id),cls:d.cls,vars:e.getVariableCount(l.id)})}return c},[r,e]);return t.jsxs("div",{className:"text-sm selection-tree",children:[t.jsxs("div",{className:"flex items-baseline gap-2 px-3 py-2 border-b border-gray-200 dark:border-slate-700",children:[t.jsxs("span",{className:"font-semibold flex-1",children:[e.getConceptLabel("entity",!0)," (",r.length,")"]}),t.jsxs("span",{className:"flex items-center gap-1 text-[10px] uppercase tracking-wide shrink-0",children:[t.jsx("span",{className:"text-gray-500",title:s.props.tip,children:s.props.header}),t.jsx("span",{className:"text-blue-500",title:s.cls.tip,children:s.cls.header}),t.jsx("span",{className:"text-amber-600",title:s.vars.tip,children:s.vars.header})]})]}),t.jsx(Dt,{nodes:r,selected:[...o],levelsExpanded:0,renderRow:({node:c,isSelected:l})=>{const d=i.get(c.id);return t.jsxs("span",{"data-entity-row":c.id,className:`flex items-center gap-2 flex-1 min-w-0 px-1 rounded
                          ${l?"bg-blue-100 dark:bg-sky-900/50":""}`,children:[t.jsx("input",{type:"checkbox",checked:l,title:`${l?"Remove":"Add"} ${c.id} ${l?"from":"to"} the canvas`,onClick:f=>f.stopPropagation(),onChange:f=>{f.stopPropagation(),n(c.id)}}),t.jsx("button",{type:"button",title:`Show details for ${c.id}`,onClick:f=>{f.stopPropagation(),a?.(c.id)},className:`font-mono text-xs flex-1 min-w-0 truncate text-left
                            hover:underline ${l?"font-semibold":""}`,children:c.name??c.id}),d&&t.jsxs("span",{className:"flex items-center gap-1 shrink-0 tabular-nums",children:[t.jsx(De,{n:d.props,title:s.props.tip,className:"text-gray-500"}),t.jsx(De,{n:d.cls,title:s.cls.tip,className:"text-blue-500"}),t.jsx(De,{n:d.vars,title:s.vars.tip,className:"text-amber-600"})]})]})}})]})}function De({n:e,title:o,className:n}){return t.jsx("span",{title:o,"data-count-badge":"",className:`w-5 text-right text-[11px] ${e===0?"text-gray-300 dark:text-slate-600":n}`,children:e===0?"·":e})}function Te(e){throw new Error('Could not dynamically require "'+e+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var _e={exports:{}},Je;function Qt(){return Je||(Je=1,(function(e,o){(function(n){e.exports=n()})(function(){return(function(){function n(a,r,s){function i(d,f){if(!r[d]){if(!a[d]){var x=typeof Te=="function"&&Te;if(!f&&x)return x(d,!0);if(c)return c(d,!0);var h=new Error("Cannot find module '"+d+"'");throw h.code="MODULE_NOT_FOUND",h}var m=r[d]={exports:{}};a[d][0].call(m.exports,function(v){var g=a[d][1][v];return i(g||v)},m,m.exports,n,a,r,s)}return r[d].exports}for(var c=typeof Te=="function"&&Te,l=0;l<s.length;l++)i(s[l]);return i}return n})()({1:[function(n,a,r){Object.defineProperty(r,"__esModule",{value:!0}),r.default=void 0;function s(h){"@babel/helpers - typeof";return s=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(m){return typeof m}:function(m){return m&&typeof Symbol=="function"&&m.constructor===Symbol&&m!==Symbol.prototype?"symbol":typeof m},s(h)}function i(h,m){if(!(h instanceof m))throw new TypeError("Cannot call a class as a function")}function c(h,m){for(var v=0;v<m.length;v++){var g=m[v];g.enumerable=g.enumerable||!1,g.configurable=!0,"value"in g&&(g.writable=!0),Object.defineProperty(h,d(g.key),g)}}function l(h,m,v){return m&&c(h.prototype,m),Object.defineProperty(h,"prototype",{writable:!1}),h}function d(h){var m=f(h,"string");return s(m)=="symbol"?m:m+""}function f(h,m){if(s(h)!="object"||!h)return h;var v=h[Symbol.toPrimitive];if(v!==void 0){var g=v.call(h,m);if(s(g)!="object")return g;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(h)}r.default=(function(){function h(){var m=this,v=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},g=v.defaultLayoutOptions,w=g===void 0?{}:g,b=v.algorithms,N=b===void 0?["layered","stress","mrtree","radial","force","disco","sporeOverlap","sporeCompaction","rectpacking"]:b,j=v.workerFactory,L=v.workerUrl;if(i(this,h),this.defaultLayoutOptions=w,this.initialized=!1,typeof L>"u"&&typeof j>"u")throw new Error("Cannot construct an ELK without both 'workerUrl' and 'workerFactory'.");var O=j;typeof L<"u"&&typeof j>"u"&&(O=function(W){return new Worker(W)});var B=O(L);if(typeof B.postMessage!="function")throw new TypeError("Created worker does not provide the required 'postMessage' function.");this.worker=new x(B),this.worker.postMessage({cmd:"register",algorithms:N}).then(function(F){return m.initialized=!0}).catch(console.err)}return l(h,[{key:"layout",value:function(v){var g=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},w=g.layoutOptions,b=w===void 0?this.defaultLayoutOptions:w,N=g.logging,j=N===void 0?!1:N,L=g.measureExecutionTime,O=L===void 0?!1:L;return v?this.worker.postMessage({cmd:"layout",graph:v,layoutOptions:b,options:{logging:j,measureExecutionTime:O}}):Promise.reject(new Error("Missing mandatory parameter 'graph'."))}},{key:"knownLayoutAlgorithms",value:function(){return this.worker.postMessage({cmd:"algorithms"})}},{key:"knownLayoutOptions",value:function(){return this.worker.postMessage({cmd:"options"})}},{key:"knownLayoutCategories",value:function(){return this.worker.postMessage({cmd:"categories"})}},{key:"terminateWorker",value:function(){this.worker&&this.worker.terminate()}}])})();var x=(function(){function h(m){var v=this;if(i(this,h),m===void 0)throw new Error("Missing mandatory parameter 'worker'.");this.resolvers={},this.worker=m,this.worker.onmessage=function(g){setTimeout(function(){v.receive(v,g)},0)}}return l(h,[{key:"postMessage",value:function(v){var g=this.id||0;this.id=g+1,v.id=g;var w=this;return new Promise(function(b,N){w.resolvers[g]=function(j,L){j?(w.convertGwtStyleError(j),N(j)):b(L)},w.worker.postMessage(v)})}},{key:"receive",value:function(v,g){var w=g.data,b=v.resolvers[w.id];b&&(delete v.resolvers[w.id],w.error?b(w.error):b(null,w.data))}},{key:"terminate",value:function(){this.worker&&this.worker.terminate()}},{key:"convertGwtStyleError",value:function(v){if(v){var g=v.__java$exception;g&&(g.cause&&g.cause.backingJsObject&&(v.cause=g.cause.backingJsObject,this.convertGwtStyleError(v.cause)),delete v.__java$exception)}}}])})()},{}],2:[function(n,a,r){var s=n("./elk-api.js").default;Object.defineProperty(a.exports,"__esModule",{value:!0}),a.exports=s,s.default=s},{"./elk-api.js":1}]},{},[2])(2)})})(_e)),_e.exports}var Xt=Qt();const Yt=_t(Xt),Zt="/dynamic-model-var-docs/assets/elk-worker.min-r_yRvuMO.js";class Jt{elk=null;ensure(){return this.elk||(this.elk=new Yt({workerUrl:Zt})),this.elk}async layout(o,n={}){const{direction:a="DOWN",nodeSpacing:r=32,layerSpacing:s=56,usePartitions:i=!1,extraLayoutOptions:c={}}=n,l={id:"root",layoutOptions:{"elk.algorithm":"layered","elk.direction":a,"elk.spacing.nodeNode":String(r),"elk.layered.spacing.nodeNodeBetweenLayers":String(s),"elk.edgeRouting":"ORTHOGONAL","elk.layered.considerModelOrder.strategy":"NODES_AND_EDGES",...i?{"elk.partitioning.activate":"true"}:{},...c},children:o.nodes.map(g=>({id:g.id,width:g.width,height:g.height,...g.ports?.length?{ports:g.ports.map(w=>({id:w.id,x:w.x,y:w.y,width:0,height:0}))}:{},...i&&g.partition!==void 0||g.ports?.length?{layoutOptions:{...i&&g.partition!==void 0?{"elk.partitioning.partition":String(g.partition)}:{},...g.ports?.length?{"elk.portConstraints":"FIXED_POS"}:{}}}:{}})),edges:o.edges.filter(g=>g.source!==g.target).map(g=>({id:g.id,sources:[g.sourcePort??g.source],targets:[g.targetPort??g.target]}))},d=new Map(o.edges.map(g=>[g.id,g])),f=await this.ensure().layout(l),x=(f.children??[]).map(g=>({id:g.id,x:g.x??0,y:g.y??0,width:g.width??0,height:g.height??0})),h=(f.edges??[]).map(g=>{const w=d.get(g.id);if(!w)throw new Error(`ELK returned unknown edge id: ${g.id}`);return{id:g.id,source:w.source,target:w.target,sections:g.sections}}),m=Math.max(0,...x.map(g=>g.x+g.width)),v=Math.max(0,...x.map(g=>g.y+g.height));return{nodes:x,edges:h,width:m,height:v}}cancel(){this.elk&&(this.elk.terminateWorker(),this.elk=null)}dispose(){this.cancel()}}function Oe(e){if(!e?.length)return[];const o=e[0];return[o.startPoint,...o.bendPoints??[],o.endPoint]}function et(e,o,n){const a=o.x-e.x,r=o.y-e.y,s=Math.hypot(a,r);if(s<1e-6)return{...e};const i=Math.min(n,s/2)/s;return{x:e.x+a*i,y:e.y+r*i}}function en(e,o){if(e.length<2)return tn(e);let n=`M${e[0].x},${e[0].y}`;for(let r=1;r<e.length-1;r++){const s=et(e[r],e[r-1],o),i=et(e[r],e[r+1],o);n+=`L${s.x},${s.y}Q${e[r].x},${e[r].y} ${i.x},${i.y}`}const a=e[e.length-1];return`${n}L${a.x},${a.y}`}function tn(e){return e.length?e.map((o,n)=>`${n===0?"M":"L"}${o.x},${o.y}`).join(""):""}function nn(e,o){let n=0,a=e.length-1,r=e[e.length-1];for(let s=e.length-1;s>0;s--){const i=Math.hypot(e[s].x-e[s-1].x,e[s].y-e[s-1].y);if(n+i>=o){const c=(o-n)/i;r={x:e[s].x+(e[s-1].x-e[s].x)*c,y:e[s].y+(e[s-1].y-e[s].y)*c},a=s-1;break}n+=i,a=s-1}return{cut:a,cutPoint:r}}function on(e,o,n,a){if(e.length<2||n<=0)return a(e);const{cut:r,cutPoint:s}=nn(e,n),i=e.slice(0,r+1),c=i[i.length-1],l=c&&Math.abs(c.x-s.x)<1e-6&&Math.abs(c.y-s.y)<1e-6;return a([...i,...l?[]:[s],o])}function sn(e,o=1.5){if(e.length<3)return e;const n=[e[0]];for(let a=1;a<e.length-1;a++){const r=n[n.length-1],s=e[a],i=e[a+1],c=i.x-r.x,l=i.y-r.y,d=Math.hypot(c,l);(d<1e-6?Math.hypot(s.x-r.x,s.y-r.y):Math.abs(l*s.x-c*s.y+i.x*r.y-i.y*r.x)/d)>o&&n.push(s)}return n.push(e[e.length-1]),n}function an(e,o,n,a){const r=Math.hypot(o.x,o.y)||1,s=o.x/r,i=o.y/r,c=-i,l=s,d=n/2,f={x:e.x+c*d,y:e.y+l*d},x={x:e.x-c*d,y:e.y-l*d},h={x:e.x+s*a,y:e.y+i*a};return`M${f.x},${f.y}L${h.x},${h.y}L${x.x},${x.y}Z`}function rn(e,o,n,a,r=16){const s={x:e.x+n.x*r,y:e.y+n.y*r},i={x:o.x+a.x*r,y:o.y+a.y*r},c=[e,s];if(Math.abs(n.x)>.5){const l=(s.x+i.x)/2;Math.abs(s.y-i.y)>.5&&c.push({x:l,y:s.y},{x:l,y:i.y})}else{const l=(s.y+i.y)/2;Math.abs(s.x-i.x)>.5&&c.push({x:s.x,y:l},{x:i.x,y:l})}return c.push(i,o),sn(c)}function ln(e,o={}){const n=u.useRef(null);n.current||(n.current=new Jt);const[a,r]=u.useState(null),[s,i]=u.useState(!1),c=JSON.stringify(o);u.useEffect(()=>{const f=n.current;if(!e||e.nodes.length===0){r(null),i(!1);return}let x=!1;return i(!0),f.layout(e,JSON.parse(c)).then(h=>{x||(r({spec:e,layout:h}),i(!1))},h=>{x||(i(!1),console.error("graph-core layout failed:",h))}),()=>{x=!0,f.cancel()}},[e,c]),u.useEffect(()=>()=>n.current?.dispose(),[]);const l=!!e&&e.nodes.length>0,d=a&&a.spec===e?a.layout:null;return{layout:d,inProgress:(s||!d)&&l}}function cn(e){const o=e.clientWidth,n=e.clientHeight,a=document.querySelector("[data-help-popover]");if(!a||!a.matches(":popover-open"))return{w:o,h:n};const r=a.getBoundingClientRect(),s=e.getBoundingClientRect(),i=Math.min(r.right,s.right)-Math.max(r.left,s.left);return i<=0?{w:o,h:n}:{w:Math.max(o-i,o*.4),h:n}}function dn(e={}){const{min:o=.2,max:n=2}=e,a=u.useRef(null),r=u.useRef(null),s=u.useRef(null),i=u.useRef(1),c=u.useRef({w:0,h:0}),l=u.useRef(null),d=u.useRef(null),f=u.useRef(!0),x=u.useCallback(()=>{const b=r.current;b&&(b.style.width=`${c.current.w*i.current}px`,b.style.height=`${c.current.h*i.current}px`)},[]),h=u.useCallback(b=>{i.current=Math.min(n,Math.max(o,b)),l.current&&cancelAnimationFrame(l.current),l.current=requestAnimationFrame(()=>{l.current=null;const N=s.current;N&&(N.style.transform=`scale(${i.current})`)}),d.current&&clearTimeout(d.current),d.current=setTimeout(()=>{d.current=null,x()},100)},[o,n,x]),m=u.useCallback(b=>{f.current=!1,h(b)},[h]),v=u.useCallback(b=>m(i.current*b),[m]),g=u.useCallback((b,N)=>{c.current={w:b,h:N};const j=s.current;j&&(j.style.width=`${b}px`,j.style.height=`${N}px`,j.style.transformOrigin="0 0",j.style.transform=`scale(${i.current})`),x()},[x]),w=u.useCallback(()=>{const b=a.current,{w:N,h:j}=c.current;if(!b||!N||!j)return;f.current=!0;const L=cn(b);h(Math.min(L.w/N,L.h/j,1)),x(),requestAnimationFrame(()=>{b.scrollLeft=0,b.scrollTop=0})},[h,x]);return u.useEffect(()=>{const b=a.current;if(!b)return;const N=j=>{!j.ctrlKey&&!j.metaKey||(j.preventDefault(),m(i.current*(1-j.deltaY*.005)))};return b.addEventListener("wheel",N,{passive:!1}),()=>b.removeEventListener("wheel",N)},[m]),u.useEffect(()=>{const b=a.current;if(!b)return;let N=!1,j=0,L=0,O=0,B=0,F=!1;const W=A=>A instanceof Element&&!A.closest("[data-pan-ignore]"),I=A=>{A.button!==0||!W(A.target)||(N=!0,F=!1,j=A.clientX,L=A.clientY,O=b.scrollLeft,B=b.scrollTop,b.style.cursor="grabbing")},G=A=>{if(!N)return;const H=A.clientX-j,$=A.clientY-L;!F&&Math.hypot(H,$)<3||(F||(F=!0,b.setPointerCapture(A.pointerId)),A.preventDefault(),b.scrollLeft=O-H,b.scrollTop=B-$)},M=A=>{N&&(N=!1,b.style.cursor="",b.hasPointerCapture(A.pointerId)&&b.releasePointerCapture(A.pointerId))};return b.addEventListener("pointerdown",I),b.addEventListener("pointermove",G),b.addEventListener("pointerup",M),b.addEventListener("pointercancel",M),()=>{b.removeEventListener("pointerdown",I),b.removeEventListener("pointermove",G),b.removeEventListener("pointerup",M),b.removeEventListener("pointercancel",M)}},[]),{containerRef:a,spacerRef:r,wrapperRef:s,applyZoom:m,zoomBy:v,zoomToFit:w,getZoom:()=>i.current,isAutoFit:()=>f.current,setContentSize:g}}function hn(e){const o=ce.siblings;return o[e%o.length]}function un(e,o,n){const a=new Map;for(const r of[...e].sort()){const s=o(r);!s||!n(s)||a.set(s,[...a.get(s)??[],r])}return a}function pn(e){return`merged::${e}`}function gn(e){return e.startsWith("merged::")}function mn(e,o,n){if(!o.length)return e;const a=new Map(o.map(s=>[s.id,[]])),r=[];for(const s of e){const i=s.owners?.length?[...s.owners].sort((c,l)=>o.findIndex(d=>d.id===c.id)-o.findIndex(d=>d.id===l.id))[0]:void 0;i?a.get(i.id)?.push(s):r.push(s)}return[...r,...o.flatMap(s=>[n(s),...a.get(s.id)??[]])]}const Ge=new Set;function be(e){$e();for(const o of Ge)o(e)}const fn=300;let xe;function $e(){xe!==void 0&&(clearTimeout(xe),xe=void 0)}function qe(){$e(),xe=setTimeout(()=>{xe=void 0,be(null)},fn)}const yn=140;function bn({label:e,groups:o,relatedCount:n,shownCount:a,onAdd:r,onRemove:s,onInspect:i}){const[c,l]=u.useState(null),[d,f]=u.useState(null),x=u.useRef(null),h=u.useId();if(u.useEffect(()=>{const g=w=>{w!==h&&(l(null),f(null))};return Ge.add(g),()=>{Ge.delete(g)}},[h]),u.useEffect(()=>{if(!c)return;const g=b=>{b.target?.closest("[data-relation-menu]")||be(null)},w=b=>{b.key==="Escape"&&be(null)};return document.addEventListener("mousedown",g,!0),document.addEventListener("keydown",w),()=>{document.removeEventListener("mousedown",g,!0),document.removeEventListener("keydown",w)}},[c]),!o.length)return null;const m=()=>{const g=x.current?.getBoundingClientRect();g&&(be(h),l({x:g.left,y:g.bottom+2}))},v=g=>{g.stopPropagation(),c?be(null):m()};return t.jsxs(t.Fragment,{children:[t.jsxs("button",{ref:x,"data-relation-menu":!0,"data-relation-trigger":!0,"data-no-drag":!0,"data-help-id":"relation-menu",title:`${n} entities related to ${e}, ${a} of them on the diagram — hover to browse them`,onMouseEnter:m,onMouseLeave:qe,onClick:v,className:`flex items-center gap-1 text-[9px] leading-none px-1.5 py-0.5
                    rounded border
                    border-amber-300 dark:border-amber-700
                    bg-amber-50 dark:bg-amber-950/40
                    text-amber-900 dark:text-amber-200
                    hover:bg-amber-200 dark:hover:bg-amber-800
                    ${c?"bg-amber-200 dark:bg-amber-800":""}`,children:[t.jsx("span",{"aria-hidden":!0,className:"opacity-60",children:"☰"}),t.jsx("span",{className:"tabular-nums",children:n}),t.jsx("span",{children:"related"}),t.jsxs("span",{className:"opacity-70",children:["· ",a," shown"]}),t.jsx("span",{"aria-hidden":!0,className:"opacity-60",children:"▾"})]}),c&&Bt.createPortal(t.jsx(wn,{anchor:c,label:e,groups:o,openGroup:d,setOpenGroup:f,onAdd:r,onRemove:s,onInspect:i}),document.body)]})}function wn({anchor:e,label:o,groups:n,openGroup:a,setOpenGroup:r,onAdd:s,onRemove:i,onInspect:c}){const{ref:l,style:d}=vn(e),f=n.find(x=>x.position===a);return t.jsxs("div",{ref:l,"data-relation-menu":!0,onMouseEnter:$e,onMouseLeave:qe,style:d,className:`fixed z-50 min-w-[13rem] rounded border shadow-lg text-[11px]
                 border-gray-300 dark:border-slate-600
                 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-100`,children:[t.jsxs("div",{className:`px-2 py-1 border-b border-gray-200 dark:border-slate-600
                      text-[9px] uppercase tracking-wide text-gray-500 dark:text-gray-400`,children:[o," — related entities"]}),n.map(x=>t.jsxs("button",{"data-relation-group":x.position,onMouseEnter:()=>r(x.position),onClick:h=>{h.stopPropagation(),r(a===x.position?null:x.position)},className:`flex w-full items-center gap-2 px-2 py-1 text-left
                      hover:bg-amber-50 dark:hover:bg-amber-900/40
                      ${a===x.position?"bg-amber-50 dark:bg-amber-900/40":""}`,children:[t.jsx("span",{className:"tabular-nums font-semibold shrink-0",children:x.items.length}),t.jsx("span",{className:"flex-1 truncate",children:x.label}),t.jsx("span",{className:"text-gray-400 shrink-0",children:"▸"})]},x.position)),f&&t.jsx(xn,{group:f,label:o,onAdd:s,onRemove:i,onInspect:c})]})}function xn({group:e,label:o,onAdd:n,onRemove:a,onInspect:r}){const s=u.useRef(null),[i,c]=u.useState(!1),[l,d]=u.useState(void 0),f=e.items.filter(h=>!h.drawn),x=e.items.filter(h=>h.drawn);return u.useLayoutEffect(()=>{const h=s.current,m=h?.offsetParent;if(!h||!m)return;const v=m.getBoundingClientRect(),g=h.offsetWidth,w=4,b=window.innerWidth-w-v.right,N=v.left-w;g<=b?(c(!1),d(void 0)):g<=N?(c(!0),d(void 0)):(c(N>b),d(Math.max(Math.max(N,b),yn)))},[e.position]),t.jsxs("div",{ref:s,"data-relation-menu":!0,"data-relation-submenu":e.position,onMouseEnter:$e,onMouseLeave:qe,style:l===void 0?void 0:{maxWidth:l,minWidth:0},className:`absolute top-0 max-h-[60vh] min-w-[14rem] overflow-y-auto rounded border shadow-lg
                  border-gray-300 dark:border-slate-600
                  bg-white dark:bg-slate-800
                  ${i?"right-full mr-0.5":"left-full ml-0.5"}`,children:[t.jsxs("div",{className:`sticky top-0 border-b
                      border-gray-200 dark:border-slate-600
                      bg-white dark:bg-slate-800`,children:[t.jsxs("div",{className:"px-2 py-1 text-[9px] text-gray-500 dark:text-gray-400",children:[e.items.length," ",e.label]}),t.jsxs("div",{className:"flex items-center gap-2 px-2 pb-1 text-[9px]",children:[f.length>1&&t.jsxs("button",{"data-relation-add-all":e.position,onClick:h=>{h.stopPropagation(),f.forEach(m=>n(m.other))},className:`underline text-amber-800 dark:text-amber-300
                         hover:text-amber-950 dark:hover:text-amber-100`,children:["add all ",f.length]}),x.length>1&&t.jsxs("button",{"data-relation-hide-all":e.position,onClick:h=>{h.stopPropagation(),x.forEach(m=>a(m.other))},className:`underline text-gray-500 dark:text-gray-400
                         hover:text-red-600 dark:hover:text-red-400`,children:["hide all ",x.length]})]})]}),e.items.map(h=>t.jsxs("div",{"data-relation-item":h.other,"data-relation-drawn":h.drawn?"":void 0,className:"flex items-center gap-1 px-2 py-0.5 hover:bg-amber-50 dark:hover:bg-amber-900/40",children:[t.jsxs("button",{title:h.drawn?`${h.other} is on the diagram — click to remove it`:`Add ${h.other} to the diagram and tick its checkbox (${e.label} ${o})`,onClick:m=>{m.stopPropagation(),h.drawn?a(h.other):n(h.other)},className:`flex-1 min-w-0 text-left ${h.drawn?"text-gray-400 dark:text-gray-500":"text-gray-800 dark:text-gray-100"}`,children:[t.jsx("span",{className:"block truncate",children:h.other}),t.jsx("span",{className:"block truncate text-[9px] text-gray-400 dark:text-gray-500",children:h.slots.join(", ")})]}),h.drawn&&t.jsx("button",{"data-relation-remove":h.other,title:`Remove ${h.other} from the diagram`,onClick:m=>{m.stopPropagation(),a(h.other)},className:`text-[10px] leading-none px-1 rounded text-gray-400 shrink-0
                         hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/40`,children:"✕"}),r&&t.jsx("button",{title:`Open ${h.other}'s details`,onClick:m=>{m.stopPropagation(),r(h.other)},className:`text-[10px] leading-none px-1 rounded text-gray-400 shrink-0
                         hover:text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-900/40`,children:"ⓘ"})]},h.other))]})}function vn(e){const o=u.useRef(null),[n,a]=u.useState(e);return u.useLayoutEffect(()=>{const r=o.current;if(!r)return;const s=r.getBoundingClientRect(),i=6;a({x:Math.max(i,Math.min(e.x,window.innerWidth-s.width-i)),y:Math.max(i,Math.min(e.y,window.innerHeight-s.height-i))})},[e]),{ref:o,style:{left:n.x,top:n.y}}}const ae={sibs:!0,dir:"RIGHT",merge:"near"},we={dir:"explore-nl-dir",merge:"explore-nl-merge",sibs:"explore-nl-sibs"},Ke="~",kn=["exp","hidden","owners"];function Sn(e,o){const n=e.get(o);return n?n.split(Ke).filter(Boolean):[]}function Ae(e){try{return localStorage.getItem(e)}catch{return null}}function Cn(e,o){try{localStorage.setItem(e,o)}catch{}}function Pe(e,o){return e&&o.includes(e)?e:null}function ve(e=window.location.search){const o=new URLSearchParams(e),n=Pe(o.get("dir"),["RIGHT","DOWN"])??Pe(Ae(we.dir),["RIGHT","DOWN"])??ae.dir,a=Pe(o.get("merge"),["near","far","bend","off"])??Pe(Ae(we.merge),["near","far","bend","off"])??ae.merge,r=o.has("sibs")?o.get("sibs")==="1":Ae(we.sibs)!==null?Ae(we.sibs)!=="0":ae.sibs;return{sel:Sn(o,"sel"),detail:o.get("detail")||null,roots:o.get("roots")==="1",sibs:r,dir:n,merge:a}}function lt(e){const o=new URL(window.location.href),n=o.searchParams,a=(s,i)=>{i.length===0?n.delete(s):n.set(s,[...i].sort().join(Ke))},r=(s,i,c)=>{c?n.delete(s):n.set(s,i)};for(const s of kn)n.delete(s);a("sel",e.sel),e.detail?n.set("detail",e.detail):n.delete("detail"),r("roots","1",!e.roots),r("sibs",e.sibs?"1":"0",e.sibs===ae.sibs),r("dir",e.dir,e.dir===ae.dir),r("merge",e.merge,e.merge===ae.merge),window.history.replaceState(null,"",o)}function Be(e,o){Cn(we[e],typeof o=="boolean"?o?"1":"0":String(o))}function jn(e,o=window.location.href){const n=new URL(o),a=new URLSearchParams,r=(s,i)=>a.set(s,i);return e.sel.length&&r("sel",[...e.sel].sort().join(Ke)),e.detail&&r("detail",e.detail),e.roots&&r("roots","1"),e.sibs!==ae.sibs&&r("sibs",e.sibs?"1":"0"),e.dir!==ae.dir&&r("dir",e.dir),e.merge!==ae.merge&&r("merge",e.merge),n.search=a.toString(),n.toString()}const ee=240,ue=30,ke=20,Nn=6,Ve=22,ct=18,fe=28;function dt(e,o,n=()=>!1){const a=new Map;for(const r of e){if(n(r.other))continue;const s=r.position,i=a.get(s)??new Map,c=i.get(r.other)??[];c.includes(r.slot)||c.push(r.slot),i.set(r.other,c),a.set(s,i)}return Wt.filter(r=>a.has(r)).map(r=>{const s=[...a.get(r)].map(([i,c])=>({other:i,slots:c,drawn:o(i)})).sort((i,c)=>i.other.localeCompare(c.other));return{position:r,label:Ft(r,s.length),items:s}})}function X(e){return e.storageDirection==="flipped"?e.target:e.source}function ht(e){return e.anchorClass??X(e)}function En(e,o,n){const a=new Map,r=new Map,s=[],i=new Set;for(const d of e.edges)d.type==="isa"?(a.set(d.target,[...a.get(d.target)??[],d.source]),r.set(d.source,(r.get(d.source)??0)+1)):d.isLoop||(s.push(d),i.add(`${X(d)}|${d.slotName}`));const c=new Set(e.nodes.map(d=>d.id));return{nodes:e.nodes.map(d=>{const f=new Map(n(d.id).map((I,G)=>[I.name,G])),x=(I,G)=>(f.get(I.slot)??Number.MAX_SAFE_INTEGER)-(f.get(G.slot)??Number.MAX_SAFE_INTEGER),h=d.slots.map(I=>({...I,connected:I.isLoop||i.has(`${d.id}|${I.slot}`)})).sort(x),m=new Set(h.map(I=>I.slot)),v=n(d.id).filter(I=>!m.has(I.name)).map(I=>({slot:I.name,range:I.range,channel:"plain",flipped:!1,cardinality:Ht(I.required,I.multivalued),isLoop:!1,connected:!1})),g=h.filter(I=>I.connected),w=[...h.filter(I=>!I.connected),...v].sort(x),b=[...g,...w].slice(0,Math.max(Nn,g.length)),N=b.length===g.length+w.length,j=o.has(d.id)||N,L=j?[...g,...w]:b,O=N?0:g.length+w.length-b.length,B=e.hiddenOwners.get(d.id)??[],F=e.hiddenOwned.get(d.id)??[],W=dt(d.relations,I=>c.has(I),I=>I===d.id);return{...d,isaParents:a.get(d.id)??[],subclassCount:r.get(d.id)??0,members:[],hiddenOwners:B,hiddenOwned:F,relationGroups:W,...ut(W),rows:L,allRows:[...g,...w],hiddenCount:O,expanded:j,height:pt(L.length,O,W.length>0)}}),edges:s,edgeColors:new Map}}function ut(e){const o=new Map;for(const n of e)for(const a of n.items)o.set(a.other,(o.get(a.other)??!1)||a.drawn);return{relatedCount:o.size,shownCount:[...o.values()].filter(Boolean).length}}function pt(e,o,n){return ue+(n?Ve:0)+e*ke+(o?ct:0)+(e?5:0)}function Mn(e,o,n,a,r,s){const i=un(e.nodes.map(w=>w.id),o,n);if(!i.size)return e;const c=new Map(e.nodes.map(w=>[w.id,w])),l=new Set(e.nodes.map(w=>w.id)),d=new Map,f=[],x=new Map;for(const[w,b]of i){const N=pn(w),j=b.map((T,V)=>({id:T,label:c.get(T)?.label??T,color:hn(V)}));for(const T of j)d.set(T.id,N);const L=c.has(w);L&&d.set(w,N);const O=new Map(j.map(T=>[T.id,T])),B=new Map,F=L?[w,...b]:b;for(const T of F){const V=c.get(T);if(!V)continue;const Z=T===w;for(const P of V.allRows){const q=a(T,P.slot),K=q!==void 0&&q!==T,re=`${Z||K?q??w:T}|${P.slot}`,pe=B.get(re),Se=O.get(T),Ce=Z||K?pe?.owners??[]:[...pe?.owners??[],...Se?[Se]:[]];B.set(re,{...pe??P,connected:(pe?.connected??!1)||P.connected,owners:Ce,declaringClass:re.slice(0,re.indexOf("|"))})}}for(const[T,V]of B)V.owners?.length&&x.set(`${N}|${T}`,V.owners[0].color);const W=[...B.values()],I=T=>{const V=T.owners?.length?T.owners[0].id:w;return s(V,T.slot)};W.sort((T,V)=>I(T)-I(V));const G=mn(W,j,T=>({slot:`::hdr:${T.id}`,range:"",channel:"plain",flipped:!1,cardinality:"",isLoop:!1,connected:!1,header:T})),M=T=>!d.has(T)&&!F.includes(T),A=[...new Set(F.flatMap(T=>c.get(T)?.hiddenOwners??[]))].filter(M),H=[...new Set(F.flatMap(T=>c.get(T)?.hiddenOwned??[]))].filter(M),$=dt(F.flatMap(T=>c.get(T)?.relations??[]),T=>l.has(T),T=>!M(T)),z=c.get(b[0]),Y=r(w);f.push({...z,id:N,label:w,description:Y.description,abstract:Y.abstract,slots:[],members:j,role:F.some(T=>c.get(T)?.role==="selected")?"selected":"context",layer:Math.min(...F.map(T=>c.get(T)?.layer??0)),isaParents:[],subclassCount:j.length,hiddenOwners:A,hiddenOwned:H,relationGroups:$,...ut($),rows:G,allRows:W,hiddenCount:0,expanded:!0,height:pt(G.length,0,$.length>0)})}const h=[...e.nodes.filter(w=>!d.has(w.id)),...f],m=new Set,v=e.edges.map(w=>({...w,source:d.get(w.source)??w.source,target:d.get(w.target)??w.target,anchorClass:d.has(X(w))?a(X(w),w.slotName)??X(w):X(w)})).filter(w=>{const b=X(w);if(!gn(b))return!0;const N=b===w.source?w.target:w.source,j=`${b}|${w.anchorClass}|${w.slotName}|${N}|${w.storageDirection}`;return m.has(j)?!1:(m.add(j),!0)}).filter(w=>w.source!==w.target),g=new Map;for(const w of v){const b=x.get(`${X(w)}|${ht(w)}|${w.slotName}`);b&&g.set(w.id,b)}return{nodes:h,edges:v,edgeColors:g}}function Tn({title:e}){return t.jsxs("svg",{viewBox:"0 0 16 16",width:"15",height:"15","aria-hidden":"false",className:"shrink-0 text-amber-600 dark:text-amber-400",children:[t.jsx("title",{children:e}),t.jsx("path",{d:"M12.33 10.5 A5 5 0 1 1 12.33 5.5",fill:"none",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round"}),t.jsx("path",{d:"M13.7 7.9 L10.6 6.7 L13.7 4.2 Z",fill:"currentColor"})]})}function On(e){return ue+(e.relationGroups.length>0?Ve:0)}function gt(e,o,n){const a=e.rows.findIndex(r=>r.slot===o&&!r.header&&(!n||!r.declaringClass||r.declaringClass===n));if(a<0)throw new Error(`No displayed row for ${o} on ${e.id}`);return On(e)+a*ke+ke/2}const An=4,Pn=10,mt=12,le=mt,He=mt*1.5,We=0,tt=.85,ft=.8,yt=1.6,$n=ft*.67,Rn=yt*.67;function Fe(e,o){if(e==="off"||o.length<2)return 0;if(e==="near")return 40;if(e==="far")return 120;const n=o[o.length-1],a=o[o.length-2];return Math.hypot(n.x-a.x,n.y-a.y)}function nt(e,o){return e<2?0:Math.min(An,o/(e-1))}function Ln(e,o){const n=new Map,a=(l,d,f,x)=>{const h=n.get(l.id)??[];return h.some(m=>m.id===d)||(h.push({id:d,x:f,y:x}),n.set(l.id,h)),d},r=new Map(e.nodes.map(l=>[l.id,l])),s=new Map;for(const l of e.edges){const d=X(l)===l.source?l.target:l.source,f=`${d}|${d===l.source?"out":"in"}`;s.set(f,(s.get(f)??0)+1)}const i=new Map,c=e.edges.map(l=>{const d=r.get(X(l)),f=r.get(X(l)===l.source?l.target:l.source);if(!d||!f)throw new Error(`Edge ${l.id} endpoint missing from subgraph`);const x=l.storageDirection==="flipped",h=gt(d,l.slotName,ht(l)),m=a(d,`${d.id}::row:${l.slotName}`,x?0:ee,h),v=f.id===l.source,g=`${f.id}|${v?"out":"in"}`,w=s.get(g)??1,b=i.get(g)??0;i.set(g,b+1);const N=nt(w,ue-4),j=ue/2+(b-(w-1)/2)*N,L=o==="RIGHT"?a(f,`${f.id}::hdr:${v?"out":"in"}:${b}`,v?ee:0,j):a(f,`${f.id}::hdr:${v?"out":"in"}:${b}`,ee/2+(b-(w-1)/2)*nt(w,ee/2),v?f.height:0);return{id:l.id,source:l.source,target:l.target,sourcePort:x?L:m,targetPort:x?m:L}});return{nodes:e.nodes.map(l=>({id:l.id,width:ee,height:l.height,partition:l.layer,ports:n.get(l.id)})),edges:c}}function In(e,o){if(!e?.length)return e;const n=e[0],a=n.bendPoints?.length?n.bendPoints[n.bendPoints.length-1]:n.startPoint,r=n.endPoint.x-a.x,s=n.endPoint.y-a.y,i=Math.hypot(r,s);if(i<1)return e;const c=Math.min(o,i*.8)/i,l={x:n.endPoint.x-r*c,y:n.endPoint.y-s*c};return[{...n,endPoint:l},...e.slice(1)]}function Dn(e,o){if(!e?.length)return e;const n=e[0],a=n.bendPoints?.length?n.bendPoints[0]:n.endPoint,r=a.x-n.startPoint.x,s=a.y-n.startPoint.y,i=Math.hypot(r,s);if(i<1)return e;const c=Math.min(o,i*.8)/i,l={x:n.startPoint.x+r*c,y:n.startPoint.y+s*c};return[{...n,startPoint:l},...e.slice(1)]}function _n({dataService:e,selectedIds:o,onNodeClick:n,onAdd:a,onRemove:r,pathToRoot:s=!1,onTogglePathToRoot:i,direction:c,setDirection:l,mergeMode:d,setMergeMode:f,mergeSibs:x,setMergeSibs:h}){const m=u.useId().replace(/[^a-zA-Z0-9]/g,""),v=p=>`${p}-${m}`,[g,w]=u.useState(new Set),b=u.useMemo(()=>e.getOwnershipSubgraph([...o].sort(),{pathToRoot:s}),[e,o,s]),N=u.useMemo(()=>new Map(b.nodes.map(p=>[p.id,e.getClassSummary(p.id)?.slots??[]])),[e,b]),j=u.useMemo(()=>En(b,g,p=>N.get(p)??[]),[b,g,N]),L=u.useMemo(()=>new Map(b.nodes.map(p=>[p.id,e.getClassSummary(p.id)])),[e,b]),O=u.useMemo(()=>{if(!x)return j;const p=C=>L.get(C)?.parentId,k=C=>!zt.has(C),S=(C,D)=>C.range===D.range&&C.multivalued===D.multivalued;return Mn(j,p,k,(C,D)=>{const _=e.getClassSummary(C)?.slots.find(Q=>Q.name===D);if(!_)return;if(!_.inheritedFrom)return C;const U=e.getClassSummary(_.inheritedFrom)?.slots.find(Q=>Q.name===D);return U&&S(_,U)?_.inheritedFrom:C},C=>{const D=e.getClassSummary(C);return{description:D?.description??"",abstract:D?.isAbstract??!1}},(C,D)=>{const _=e.getClassSummary(C)?.slots.findIndex(U=>U.name===D)??-1;return _<0?Number.MAX_SAFE_INTEGER:_})},[j,L,x,e]),[B,F]=u.useState(new Map),[W,I]=u.useState(new Map),G=u.useMemo(()=>Ln(O,c),[O,c]),{layout:M,inProgress:A}=ln(G,{direction:c,usePartitions:!0,nodeSpacing:28,layerSpacing:72,extraLayoutOptions:{"elk.spacing.edgeNode":"18","elk.spacing.edgeEdge":"12","elk.layered.spacing.edgeNodeBetweenLayers":"18","elk.layered.spacing.edgeEdgeBetweenLayers":"10"}}),H=dn(),$=(M?.width??0)+fe*2,z=(M?.height??0)+fe*2;u.useEffect(()=>{M&&(H.setContentSize($,z),H.isAutoFit()&&H.zoomToFit())},[M,$,z]),u.useEffect(()=>F(new Map),[M]),u.useEffect(()=>I(new Map),[b]);const Y=u.useRef(new Map),T=u.useRef(!1),V=u.useRef(B);V.current=B;const Z=u.useMemo(()=>{const p=new Map((M?.nodes??[]).map(S=>[S.id,S])),k=new Map(W);for(const[S,y]of B)k.set(S,y);for(const[S,{dx:y,dy:E}]of k){const R=p.get(S);R&&p.set(S,{...R,x:R.x+y,y:R.y+E})}return Y.current=p,p},[M,B,W]),P=u.useCallback((p,k)=>{if(k.button!==0||k.target.closest('button, a, [role="button"], [data-no-drag]'))return;k.stopPropagation();const S=k.clientX,y=k.clientY,E=H.getZoom()||1,R=B.get(p)??{dx:0,dy:0},C=k.currentTarget;C.setPointerCapture(k.pointerId);let D=!1;const _=Q=>{const J=(Q.clientX-S)/E,ne=(Q.clientY-y)/E;!D&&Math.hypot(J,ne)<3||(D=!0,T.current=!0,F(he=>new Map(he).set(p,{dx:R.dx+J,dy:R.dy+ne})))},U=Q=>{if(C.releasePointerCapture(Q.pointerId),C.removeEventListener("pointermove",_),C.removeEventListener("pointerup",U),D){const J=V.current.get(p);J&&I(ne=>new Map(ne).set(p,J))}};C.addEventListener("pointermove",_),C.addEventListener("pointerup",U)},[B]),q=u.useMemo(()=>new Map(O.nodes.map(p=>[p.id,p.role])),[O]),K=u.useMemo(()=>new Map(O.edges.map(p=>[p.id,p])),[O]),re=u.useMemo(()=>{const p=new Map;if(!M)return p;for(const k of O.edges){const S=X(k)===k.source?k.target:k.source,y=Z.get(S);if(!y)continue;const E=S===k.source,R=`${S}|${E?"out":"in"}`;if(p.has(R))continue;const C=E,D=We+He;p.set(R,c==="RIGHT"?{base:{x:C?y.x+ee+D:y.x-D,y:y.y+ue/2},dir:{x:C?-1:1,y:0}}:{base:{x:y.x+ee/2,y:C?y.y+y.height+D:y.y-D},dir:{x:0,y:C?-1:1}})}return p},[O,Z,M,c]),pe=u.useMemo(()=>{const p=new Map,k=new URLSearchParams(window.location.search).has("dbg"),S=new Set([...W.keys(),...B.keys()]);if(!M||S.size===0)return p;k&&console.log(`[drag] moved: ${[...S].join(", ")}`);const y=new Map(O.nodes.map(E=>[E.id,E]));for(const E of O.edges){const R=X(E),C=R===E.source?E.target:E.source;if(!S.has(R)&&!S.has(C))continue;const D=Z.get(R),_=Z.get(C),U=y.get(R);if(!D||!_||!U)continue;const Q=E.storageDirection==="flipped",J=c==="RIGHT";let ne;try{ne=gt(U,E.slotName)}catch{k&&console.log(`   SKIP ${R}.${E.slotName}: row not displayed`);continue}const he=J?{x:D.x+(Q?0:ee),y:D.y+ne}:{x:D.x+ee/2,y:D.y+ne},ie=J?{x:Q?-1:1,y:0}:{x:0,y:1},me=C===E.source,Ee=J?{x:me?_.x+ee:_.x,y:_.y+ue/2}:{x:_.x+ee/2,y:me?_.y+_.height:_.y},Ie=J?{x:me?1:-1,y:0}:{x:0,y:me?1:-1};p.set(E.id,rn(he,Ee,ie,Ie)),k&&console.log(`   reroute ${R}.${E.slotName} -> ${C}`)}return k&&console.log(`[drag] rerouted ${p.size} edge(s)`),p},[M,B,W,O,Z,c]);u.useEffect(()=>{if(!M||!new URLSearchParams(window.location.search).has("dbg"))return;const p=new Map;for(const k of M.edges){const S=K.get(k.id);if(!S)continue;const y=Oe(k.sections);if(y.length<2)continue;const E=X(S)===S.source?S.target:S.source;let R=0,C=0;for(let _=1;_<y.length;_++){const U=Math.abs(y[_].x-y[_-1].x),Q=Math.abs(y[_].y-y[_-1].y);U>.5&&Q>.5&&C++,_>1&&R++}const D=X(S);p.set(E,[...p.get(E)??[],`${D}.${S.slotName}  pts=${y.length} bends=${R}${C?` DIAGONAL x${C}`:""}  start=(${Math.round(y[0].x)},${Math.round(y[0].y)}) end=(${Math.round(y[y.length-1].x)},${Math.round(y[y.length-1].y)})`])}for(const[k,S]of p){if(S.length<2)continue;console.log(`
=== approaches to ${k} (${S.length}) ===`);const y=Z.get(k);y&&console.log(`   box at (${Math.round(y.x)},${Math.round(y.y)}) h=${Math.round(y.height)}`),S.forEach(E=>console.log("   "+E))}},[M,K,Z]);const Se=u.useMemo(()=>{const p=new Map;if(!M)return p;for(const k of M.edges){const S=K.get(k.id);if(!S||S.storageDirection==="flipped"||Fe(d,Oe(k.sections))<=0)continue;const y=X(S)===S.source?S.target:S.source,E=`${y}|${y===S.source?"out":"in"}`,R=re.get(E);if(!R)continue;const C=S.type==="ownership",D=q.get(S.source)==="context"||q.get(S.target)==="context",_=O.edgeColors.get(k.id),U=p.get(E);p.set(E,U?{...U,isOwn:U.isOwn||C,dimmed:U.dimmed&&D,edgeIds:[...U.edgeIds,k.id],...U.color===_?{}:{color:void 0}}:{...R,isOwn:C,dimmed:D,edgeIds:[k.id],..._?{color:_}:{}})}return p},[M,K,re,d,q,O]),Ce=u.useMemo(()=>new Set(O.nodes.map(p=>p.id)),[O]),ye=u.useCallback(p=>!!a&&p.channel!=="plain"&&!p.isLoop&&!Ce.has(p.range),[a,Ce]),Qe=u.useRef(null),Re=u.useRef(null),Le=u.useRef(void 0),Xe=u.useMemo(()=>{const p=new Map,k=new Map;for(const S of O.edges){k.set(S.id,[S.source,S.target]);for(const y of[S.source,S.target])p.set(y,[...p.get(y)??[],S.id])}return{nodeEdges:p,edgeEnds:k}},[O]),Ye=u.useRef(Xe);Ye.current=Xe;const ge=u.useCallback(p=>{Le.current=p,Re.current===null&&(Re.current=requestAnimationFrame(()=>{Re.current=null;const k=Le.current;Le.current=void 0;const S=Qe.current,y=H.wrapperRef.current;if(k===void 0||!S||!y)return;let E=null,R=null;if(k){const{nodeEdges:C,edgeEnds:D}=Ye.current;if(k.kind==="node"){E=new Set(C.get(k.id)??[]),R=new Set([k.id]);for(const _ of E)for(const U of D.get(_)??[])R.add(U)}else E=new Set([k.id]),R=new Set(D.get(k.id)??[])}S.querySelectorAll("path[data-edge-id]").forEach(C=>{const D=C.dataset.edgeId??"";E?E.has(D)?(C.style.opacity="1",C.style.strokeWidth=String(C.dataset.channel==="reference"?Rn:yt)):(C.style.opacity="0.38",C.style.strokeWidth=""):(C.style.opacity="",C.style.strokeWidth="")}),S.querySelectorAll("path[data-arrowhead]").forEach(C=>{const D=(C.dataset.arrowhead??"").split(" ");E?C.style.opacity=D.some(_=>E.has(_))?"1":"0.08":C.style.opacity=""}),y.querySelectorAll("[data-node-id]").forEach(C=>{const D=C.dataset.nodeId??"";C.style.opacity=R?R.has(D)?"1":"0.25":""})}))},[]);u.useEffect(()=>ge(null),[O,M,ge]);const Lt=p=>w(k=>{const S=new Set(k);return S.has(p)?S.delete(p):S.add(p),S}),Ze=p=>{Be("dir",p),l(p)},je=p=>{Be("merge",p),f(p)},It=()=>{Be("sibs",!x),h(!x)},Ne=e.getConceptLabel("attribute",!0).toLowerCase(),se=p=>`px-2 py-0.5 text-xs rounded border ${p?"border-blue-500 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300":"border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700"}`;return t.jsxs("div",{className:"relative w-full h-full",children:[t.jsxs("div",{"data-pan-ignore":!0,className:"absolute top-2 right-2 z-10 flex gap-1 items-center",children:[i&&t.jsxs(t.Fragment,{children:[t.jsx("button",{className:se(s),title:s?"Hide owners: show only what you selected":"Show every owner up to the root (can pull in most of the schema)",onClick:i,children:"⇱ roots"}),t.jsx("span",{className:"w-px h-4 bg-gray-300 dark:bg-slate-600 mx-1"})]}),t.jsx("button",{className:se(x),"data-help-id":"toolbar-siblings",title:x?"Siblings merged: classes sharing a parent share one box":"Siblings separate: no inheritance shown",onClick:It,children:"⑃ siblings"}),t.jsx("span",{className:"w-px h-4 bg-gray-300 dark:bg-slate-600 mx-1"}),t.jsx("button",{className:se(c==="RIGHT"),title:"Layout left to right",onClick:()=>Ze("RIGHT"),children:"LR"}),t.jsx("button",{className:se(c==="DOWN"),title:"Layout top down",onClick:()=>Ze("DOWN"),children:"TB"}),t.jsx("span",{className:"w-px h-4 bg-gray-300 dark:bg-slate-600 mx-1"}),t.jsx("button",{className:se(d==="near"),title:"Merge converging edges near the node (~40px)",onClick:()=>je("near"),children:"⋙"}),t.jsx("button",{className:se(d==="far"),title:"Merge converging edges early (~120px)",onClick:()=>je("far"),children:"⋙⋙"}),t.jsx("button",{className:se(d==="bend"),title:"Merge at ELK's last corner",onClick:()=>je("bend"),children:"⌙"}),t.jsx("button",{className:se(d==="off"),title:"No merging — every edge runs to its own port",onClick:()=>je("off"),children:"≡"}),t.jsx("span",{className:"w-px h-4 bg-gray-300 dark:bg-slate-600 mx-1"}),[["+",()=>H.zoomBy(1.3),"Zoom in"],["−",()=>H.zoomBy(1/1.3),"Zoom out"],["1:1",()=>H.applyZoom(1),"Reset zoom"],["⛶",()=>H.zoomToFit(),"Fit to view"]].map(([p,k,S])=>t.jsx("button",{onClick:k,title:S,className:se(!1),children:p},p))]}),A&&t.jsx("div",{className:"absolute inset-0 z-10 flex items-center justify-center text-sm text-gray-400 bg-white/50 dark:bg-slate-900/50",children:"Computing layout…"}),t.jsx("div",{ref:H.containerRef,"data-graph-direction":c,className:"w-full h-full overflow-auto cursor-grab",children:t.jsx("div",{ref:H.spacerRef,children:t.jsx("div",{ref:H.wrapperRef,className:"relative",children:M&&t.jsxs(t.Fragment,{children:[t.jsxs("svg",{ref:Qe,className:"absolute top-0 left-0 pointer-events-none",width:$,height:z,children:[t.jsxs("defs",{children:[t.jsx("marker",{id:v("arrow-own"),viewBox:"0 0 10 7",refX:"0",refY:"3.5",markerWidth:le,markerHeight:le*.75,markerUnits:"userSpaceOnUse",orient:"auto-start-reverse",children:t.jsx("path",{d:"M0,0L10,3.5L0,7Z",fill:ce.ownership})}),t.jsx("marker",{id:v("arrow-own-back"),viewBox:"0 0 10 7",refX:"10",refY:"3.5",markerWidth:le,markerHeight:le*.75,markerUnits:"userSpaceOnUse",orient:"auto-start-reverse",children:t.jsx("path",{d:"M10,0L0,3.5L10,7Z",fill:ce.ownership})}),t.jsx("marker",{id:v("arrow-assoc"),viewBox:"0 0 10 7",refX:"0",refY:"3.5",markerWidth:le*tt,markerHeight:le*.75*tt,markerUnits:"userSpaceOnUse",orient:"auto-start-reverse",children:t.jsx("path",{d:"M0,0L10,3.5L0,7Z",fill:ce.reference})})]}),t.jsxs("g",{transform:`translate(${fe}, ${fe})`,children:[[...Se].map(([p,k])=>t.jsx("path",{"data-arrowhead":k.edgeIds.join(" "),d:an(k.base,k.dir,le,He),fill:k.color??(k.isOwn?ce.ownership:ce.reference),opacity:k.dimmed?.4:1,style:{transition:"opacity 120ms"}},`head-${p}`)),M.edges.map(p=>{const k=K.get(p.id);if(!k)throw new Error(`Routed edge ${p.id} missing from view model`);const S=k.storageDirection==="flipped",y=X(k)===k.source?k.target:k.source,E=S?void 0:re.get(`${y}|${y===k.source?"out":"in"}`),R=pe.get(p.id),C=!!E&&Fe(d,R??Oe(p.sections))>0,D=k.type!=="ownership",_=C?p.sections:In(p.sections,le+We+(S?2:0)),U=D?Dn(_,He+We):_,Q=R??Oe(U),J=Ie=>en(Ie,Pn),ne=Fe(d,Q),he=E&&ne>0?on(Q,E.base,ne,J):J(Q);if(!he)return null;const ie=k.type==="ownership",me=q.get(p.source)==="context"||q.get(p.target)==="context",Ee=C?void 0:ie?S?"arrow-own-back":"arrow-own":"arrow-assoc";return t.jsxs("g",{children:[t.jsx("path",{"data-edge-id":p.id,"data-channel":ie?"ownership":"reference",d:he,fill:"none",opacity:me?.4:1,stroke:O.edgeColors.get(p.id)??(ie?ce.ownership:ce.reference),strokeWidth:ie?ft:$n,strokeDasharray:ie?void 0:"5 4",markerEnd:Ee?`url(#${v(Ee)})`:void 0,markerStart:!ie&&!C?`url(#${v("arrow-assoc")})`:void 0,style:{transition:"opacity 120ms, stroke-width 120ms"}}),t.jsx("path",{d:he,fill:"none",stroke:"transparent",strokeWidth:11,style:{pointerEvents:"stroke"},onMouseEnter:()=>ge({kind:"edge",id:p.id}),onMouseLeave:()=>ge(null)})]},p.id)})]})]}),O.nodes.map(p=>{const k=Z.get(p.id);if(!k)return null;const S=p.role==="context";return t.jsxs("div",{"data-node-id":p.id,"data-pan-ignore":!0,"data-pinned":W.has(p.id)?"":void 0,onPointerDown:y=>P(p.id,y),onDoubleClick:y=>{W.has(p.id)&&(y.stopPropagation(),I(E=>{const R=new Map(E);return R.delete(p.id),R}))},onClick:()=>{if(T.current){T.current=!1;return}n?.(p.members.length?p.label:p.id)},onMouseEnter:()=>ge({kind:"node",id:p.id}),onMouseLeave:()=>ge(null),className:`absolute rounded-md text-xs bg-white dark:bg-slate-800 ${B.has(p.id)?"":"[transition:transform_300ms,opacity_120ms]"} cursor-pointer ${S?"opacity-60 border border-dashed border-gray-400 dark:border-slate-500":W.has(p.id)?"border-2 border-amber-500 dark:border-amber-400 shadow-md":"border-2 border-slate-500 dark:border-slate-400 shadow-md"}`,style:{width:ee,height:p.height,transform:`translate(${k.x+fe}px, ${k.y+fe}px)`},children:[t.jsxs("div",{className:"flex items-center gap-1 px-2 rounded-t-[4px] bg-slate-700 dark:bg-slate-700 text-white border-b border-slate-800 dark:border-slate-600",style:{height:ue},children:[t.jsx("span",{className:`font-semibold truncate ${p.abstract?"italic":""}`,title:p.description||p.id,children:p.label}),t.jsxs("span",{className:"ml-auto flex gap-1 shrink-0",children:[p.members.length>0&&t.jsxs("span",{title:`${p.members.length} classes that are a ${p.label}, merged into one box`,className:"text-[9px] px-1 rounded bg-sky-100 dark:bg-sky-900 text-sky-800 dark:text-sky-200",children:["⑃ ",p.members.length]}),p.isaParents.map(y=>t.jsxs("span",{title:`is-a ${y}`,className:"text-[9px] px-1 rounded bg-sky-100 dark:bg-sky-900 text-sky-800 dark:text-sky-200",children:["⊳ ",y]},y)),p.subclassCount>0&&p.members.length===0&&t.jsxs("span",{title:`${p.subclassCount} subclasses shown`,className:"text-[9px] px-1 rounded bg-sky-100 dark:bg-sky-900 text-sky-800 dark:text-sky-200",children:["▷ ",p.subclassCount]}),(()=>{const E=(p.members.length?p.members.map(R=>R.id):[p.id]).filter(R=>o.has(R));return E.length?t.jsx("button",{"data-dismiss":p.id,"data-help-id":"node-dismiss",title:E.length>1?`Remove all ${E.length} selected classes in ${p.label}`:`Remove ${p.label} from the canvas`,onClick:R=>{R.stopPropagation(),E.forEach(C=>r?.(C))},className:`text-[10px] leading-none px-1 rounded text-gray-400
                                         hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/40`,children:"✕"}):null})()]})]}),p.relationGroups.length>0&&t.jsx("div",{"data-help-id":"relation-menu",className:`flex items-center gap-1 px-2 border-b overflow-hidden
                                     border-gray-200 dark:border-slate-600
                                     bg-amber-50/60 dark:bg-amber-950/30`,style:{height:Ve},children:t.jsx(bn,{label:p.label,groups:p.relationGroups,relatedCount:p.relatedCount,shownCount:p.shownCount,onAdd:y=>a?.(y),onRemove:y=>r?.(y),onInspect:n})}),p.rows.map(y=>y.header?t.jsx("div",{"data-no-drag":!0,title:`${y.header.label} — is a ${p.label}; click for details`,onClick:E=>{E.stopPropagation(),n?.(y.header.id)},className:`flex items-center px-2 text-[10px] font-semibold
                                     cursor-pointer hover:brightness-110`,style:{height:ke,background:y.header.color,color:"#fff"},children:t.jsx("span",{className:"truncate",children:y.header.label})},y.slot):t.jsxs("div",{"data-row":y.slot,"data-declaring-class":y.declaringClass,"data-expandable":ye(y)?"":void 0,"data-no-drag":ye(y)?"":void 0,title:(y.channel==="plain"?`${y.slot}: ${y.range}`:`${y.slot} → ${y.range} (${y.cardinality})${y.flipped?" — owner side":""}`+(ye(y)?` — click to add ${y.range}`:""))+((y.owners?.length??0)>1?`
also declared by ${y.owners.slice(1).map(E=>E.label).join(", ")}`:""),onClick:ye(y)?E=>{E.stopPropagation(),a?.(y.range)}:void 0,className:`flex items-center gap-1.5 px-2 text-[11px] ${y.owners?.length?"":y.connected?"text-gray-700 dark:text-gray-300":"text-gray-400 dark:text-gray-500"} ${ye(y)?"cursor-pointer hover:bg-sky-50 dark:hover:bg-sky-900/30 hover:text-sky-700 dark:hover:text-sky-300":""}`,style:{height:ke,...y.owners?.length?{color:y.owners[0].color,opacity:y.connected?1:.55}:{}},children:[y.channel==="plain"?t.jsx("span",{className:"w-1.5 h-1.5 rounded-full shrink-0 border border-gray-400 dark:border-gray-500"}):t.jsx("span",{className:`w-1.5 h-1.5 rounded-full shrink-0 ${y.channel==="ownership"?"bg-amber-500":"bg-gray-400"} ${y.connected?"":"opacity-60"}`}),t.jsx("span",{className:`truncate ${p.members.length&&!y.owners?.length?"font-semibold text-gray-900 dark:text-gray-100":""}`,children:y.slot}),y.isLoop&&t.jsx(Tn,{title:`self-referential: a ${y.range} can own another ${y.range} via ${y.slot}`}),t.jsxs("span",{className:"ml-auto text-[9px] text-gray-400 dark:text-gray-500 truncate max-w-[90px]",children:[y.range," ",y.cardinality]})]},y.declaringClass?`${y.declaringClass}|${y.slot}`:y.slot)),p.hiddenCount>0&&t.jsx("button",{className:"w-full text-left px-2 text-[10px] text-sky-600 dark:text-sky-400 hover:underline",style:{height:ct},title:`${Ne} without an edge on the current canvas, plus plain (non-entity) ${Ne}`,onClick:y=>{y.stopPropagation(),Lt(p.id)},children:p.expanded?`− fewer ${Ne}`:`+ ${p.hiddenCount} more ${Ne}`})]},p.id)})]})})})})]})}function Bn({classId:e,dataService:o,onClose:n,onNavigate:a,isSelected:r,onToggleSelect:s}){const i=u.useMemo(()=>o.getClassSummary(e),[e,o]),[c,l]=u.useState([]),d=u.useCallback(h=>{h!==e&&(l(m=>[...m,e]),a(h))},[e,a]),f=u.useCallback(()=>{l(h=>h.length===0?h:(a(h[h.length-1]),h.slice(0,-1)))},[a]);u.useEffect(()=>{const h=m=>{m.key==="Escape"&&n()};return window.addEventListener("keydown",h),()=>window.removeEventListener("keydown",h)},[n]);const x=o.getTypeLabel("slot",!0);return t.jsxs("aside",{className:`w-96 shrink-0 flex flex-col min-h-0 border-l border-gray-200 dark:border-slate-700
                 bg-white dark:bg-slate-900`,"aria-label":"Entity details",children:[t.jsxs("header",{className:`flex items-start gap-2 px-3 py-2 border-b border-gray-200 dark:border-slate-700
                   bg-gray-50 dark:bg-slate-800 shrink-0`,children:[c.length>0&&t.jsx("button",{onClick:f,className:"text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-sm mt-0.5",title:"Back",children:"←"}),t.jsxs("div",{className:"flex-1 min-w-0",children:[t.jsxs("div",{className:"font-semibold text-sm text-blue-700 dark:text-blue-300 break-words",children:[i?.name??e,i?.isAbstract&&t.jsx("span",{className:"ml-1 text-xs text-purple-500 italic",children:"(abstract)"})]}),i?.parentId&&t.jsxs("div",{className:"text-xs text-gray-400",children:["is a"," ",t.jsx("button",{onClick:()=>d(i.parentId),className:"text-blue-600 dark:text-blue-400 hover:underline",children:i.parentId})]})]}),t.jsx("button",{onClick:n,className:"text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-sm px-1",title:"Close (Esc)",children:"✕"})]}),i?t.jsxs("div",{className:"flex-1 overflow-y-auto min-h-0 px-3 py-2 space-y-3",children:[t.jsx("button",{onClick:()=>s(e),className:`w-full px-2 py-1 text-xs rounded border ${r?"border-blue-500 bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300":"border-gray-300 dark:border-slate-600 hover:border-blue-400 text-gray-600 dark:text-gray-300"}`,children:r?"✓ In diagram — click to remove":"+ Add to diagram"}),i.description&&t.jsx("p",{className:"text-xs text-gray-600 dark:text-gray-300 leading-relaxed",children:i.description}),i.referencedBy.length>0&&t.jsxs("section",{children:[t.jsxs(ot,{children:["Referenced by (",i.referencedBy.length,")"]}),t.jsx("ul",{className:"space-y-0.5",children:i.referencedBy.map((h,m)=>t.jsxs("li",{className:"text-xs",children:[t.jsx("button",{onClick:()=>d(h.classId),className:"text-blue-600 dark:text-blue-400 hover:underline cursor-pointer",children:h.classId}),t.jsxs("span",{className:"text-gray-400",children:[".",h.slotName]})]},`${h.classId}.${h.slotName}-${m}`))})]}),i.slots.length>0&&t.jsxs("section",{children:[t.jsxs(ot,{children:[x," (",i.slots.length,")"]}),t.jsx("ul",{className:"divide-y divide-gray-100 dark:divide-slate-700",children:i.slots.map((h,m)=>t.jsxs("li",{className:"py-1.5",children:[t.jsxs("div",{className:"flex items-baseline gap-1.5 flex-wrap",children:[t.jsx("span",{className:"text-xs font-medium text-gray-800 dark:text-gray-100",children:h.name}),t.jsx(Hn,{range:h.range,onNavigate:d,dataService:o})]}),h.description&&t.jsx("p",{className:"mt-0.5 text-[11px] text-gray-500 dark:text-gray-400 leading-snug break-words",children:h.description})]},`${h.name}-${m}`))})]})]}):t.jsxs("div",{className:"p-3 text-xs text-gray-500",children:["Entity not found: ",e]})]})}function ot({children:e}){return t.jsx("div",{className:"text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-1",children:e})}function Hn({range:e,onNavigate:o,dataService:n}){const a=n.itemExists(e)&&!e.endsWith("Enum"),i=`inline-block px-1 py-0 rounded text-[11px] font-medium ${new Set(["string","integer","boolean","float","double","decimal","date","datetime","time","uri","uriorcurie","ncname"]).has(e.toLowerCase())?"bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300":e.endsWith("Enum")?"bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300":"bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"}`;return a?t.jsx("button",{onClick:()=>o(e),className:`${i} hover:underline cursor-pointer`,children:e}):t.jsx("span",{className:i,children:e})}const Wn=[{heading:"Start here — what the diagram says",cases:[{name:"1. One box",note:"A single class. Rows are its attributes: name, then range and cardinality on the right. Filled amber dots are attributes that draw an edge; hollow grey dots are scalars and enums, which never do.",sel:["Organization"]},{name:"2. One edge — A owns B",note:"Visit owns TimePeriod. The edge leaves the `year_range` ROW, not the box, and the arrowhead lands on the owned class. This anchoring is the whole idea: an edge tells you WHICH attribute made it.",sel:["Visit","TimePeriod"]},{name:"3. Owns vs. belongs-to",note:"Opposite directions. Specimen OWNS its creation activity (forward). Specimen BELONGS TO a Participant — declared as `source_participant` on Specimen, but drawn Participant → Specimen, because a single-valued pointer at an entity is a foreign key. `parent_specimen` is also here as a self-loop.",sel:["Specimen","Participant","SpecimenCreationActivity"]},{name:"4. All three edge types at once",note:"THE DECISION CASE. SpecimenContainer has exactly one of each: `additive` → Substance is own-fwd; `contained_in` → Specimen is own-bkwd; `container` → SpecimenStorageActivity is an association (slate, dashed, arrowed BOTH ends). Compare own-bkwd against association here — they layer identically and differ only in ink.",sel:["SpecimenContainer","Specimen","Substance","SpecimenStorageActivity"]},{name:"5. Both associations, under crowding",note:"The schema has exactly TWO association edges and both are here: `Specimen.related_document` → Document and `SpecimenStorageActivity.container` → SpecimenContainer. Case 4 shows the three verdicts isolated; this shows them competing for the same borders. Watch SpecimenContainer's right side, where an association and an own-bkwd edge arrive together — both leave a slot row on the right and point back left, so they are the pair that header-side merging has to keep distinguishable. `Participant.originating_site` → Organization is the other thing to look at: own-bkwd today, arguably an association.",sel:["Document","Organization","Participant","Specimen","SpecimenContainer","SpecimenStorageActivity"]},{name:"6. A small real neighbourhood",note:"BodySite and its six owners — the smallest convergence that still looks like a real diagram. Six edges arriving on one box, each from a different attribute row.",sel:["BodySite","Condition","ImagingFile","ImagingStudy","MeasurementObservation","Procedure","SpecimenCreationActivity"]}]},{heading:"One rule at a time",cases:[{name:"Rule 1 — multivalued owns forward",note:"A multivalued slot means the owner has-a collection, so ownership runs forward: Questionnaire.items and ResearchStudy.consents. The two `part_of` self-loops are the counterexample — multivalued but drawn backward, because they walk UP a tree.",sel:["ResearchStudy","Consent","Questionnaire","QuestionnaireItem"]},{name:"Rule 2 — single-valued belongs backward",note:"The largest group (70 edges). Participant fans OUT to 22 targets, nearly all reversed: each target declares `associated_participant` and is drawn as belonging to Participant. This is the group that would move if own-bkwd merges into association.",sel:["Participant","Condition","Demography","Exposure","Procedure","Visit"]},{name:"Exception 2a — no independent existence",note:"Single-valued, but forward anyway: Quantity, TimePoint and the like have no identity of their own, so the value belongs to whoever holds it rather than owning the holder.",sel:["SpecimenStorageActivity","Quantity","TimePoint","Activity"]},{name:"Entity-ranged — always forward",note:"The twelve focus / associated_evidence slots range on Entity, the universal root. A pointer AT the root is never a foreign key back to an owner, so these run forward whatever their cardinality. Both single- and multi-valued focus sites are here — all should point AT Entity.",sel:["Observation","ObservationSet","MeasurementObservation","Document","Condition","SdohObservation","Entity"]},{name:"Association — no ownership claim",note:"Both associations in the schema: Document.related_document → Specimen, and SpecimenContainer.container → SpecimenStorageActivity. Slate and dashed, arrowed at both ends. They are listed explicitly because they are multivalued, so Rule 1 would otherwise call them ownership.",sel:["Document","Specimen","SpecimenContainer","SpecimenStorageActivity"]},{name:"Self-loops",note:"The five self-owning slots (TimePoint.index_time_point, File.derived_from, Specimen.parent_specimen, ResearchStudy.part_of, SpecimenContainer.parent_container) — loop markers, not routed edges. ResearchStudy also pulls in its TimePoint edges; the loops are the circular arrows on the rows.",sel:["TimePoint","File","Specimen","ResearchStudy","SpecimenContainer"]}]},{heading:"Inheritance (the ⑃ siblings toggle)",cases:[{name:"One child, merged with its parent",note:"MeasurementObservation alone. It still merges: the box is titled Observation, its 13 inherited rows sit at the top in black, and MeasurementObservation's own 9 follow under its coloured header. Merging does not wait for a second sibling — a class must not change shape because of what else you happen to select.",sel:["MeasurementObservation"]},{name:"Children that add nothing",note:'SpecimenQuality- and SpecimenQuantityObservation declare no slots of their own. Both still get a header under the shared rows, because "this subclass adds nothing" is the answer to what they are — and without the headers the selection would leave no trace in the box at all.',sel:["SpecimenQualityObservation","SpecimenQuantityObservation"]},{name:"slot_usage — same name, different type",note:"QuestionnaireResponseValue's five children each narrow `value` to a different type (boolean, decimal, integer, TimePoint, and the parent's string). That narrowing is the entire reason the five classes exist, so each keeps its OWN row rather than merging into the parent's — the one place a shared row would be a lie.",sel:["QuestionnaireResponseValueBoolean","QuestionnaireResponseValueDecimal","QuestionnaireResponseValueInteger","QuestionnaireResponseValueString","QuestionnaireResponseValueTimePoint"]},{name:"The full Observation family",note:"All five Observation subclasses plus the parent. One box where there would be six, and the shared rows are stated once. Turn ⑃ siblings off to see what it replaces. Note each edge leaves in the colour of the child that owns its row; inherited slots' edges are the parent's and are drawn once, not once per child.",sel:["Observation","MeasurementObservation","SdohObservation","DimensionalObservation","SpecimenQualityObservation","SpecimenQuantityObservation"]}]},{heading:"The bare diagonal",cases:[{name:"BodySite 6-way (the original)",note:"The reproducer from the handoff. In ⌙ (bend) the top approach arrives as a straight diagonal with no steps; in ⋙ (near) it keeps its horizontal run. This is the case the fix has to fix.",sel:["BodySite","Condition","Consent","Demography","Exposure","Observation","Procedure","ImagingFile","ImagingStudy","MeasurementObservation","SpecimenCreationActivity"]},{name:"BodySite, owners only",note:"The same convergence with nothing else on canvas — six owners, no unrelated boxes for a diagonal to cut across. Shows whether the degeneracy is about the convergence itself or about crowding.",sel:["BodySite","Condition","ImagingFile","ImagingStudy","MeasurementObservation","Procedure","SpecimenCreationActivity"]},{name:"TimePoint 16-edge",note:"Densest corridor in the schema: 8 owners but 16 slot-edges, since each Specimen*Activity owns date_started and date_ended. Also where the second-from-top edge goes diagonal and pair edges cross.",sel:["TimePoint","Consent","ResearchStudy","TimePeriod","SpecimenCreationActivity","SpecimenProcessingActivity","SpecimenStorageActivity","SpecimenTransportActivity","QuestionnaireResponseValueTimePoint"]},{name:"TimePoint + Person (crossing)",note:"Siggie's repro for the crossing bug: the paired date_started / date_ended edges from different owners cross each other on the way in. Compare pair ordering against the case above.",sel:["TimePoint","Person","Consent","ResearchStudy","TimePeriod","SpecimenCreationActivity","SpecimenProcessingActivity","SpecimenStorageActivity","SpecimenTransportActivity","QuestionnaireResponseValueTimePoint"]}]},{heading:"Pathological convergences",cases:[{name:"Quantity 19-edge (worst case)",note:"The largest convergence in the schema: 16 owning classes, 19 slot-edges. The fan is squeezed hardest here, so ENTITY_FAN_GAP and the merge distance both show their limits.",sel:["Quantity","Activity","Assay","DeviceExposure","DimensionalObservation","DrugExposure","MeasurementObservation","Observation","Procedure","SdohObservation","SpecimenCreationActivity","SpecimenProcessingActivity","SpecimenQualityObservation","SpecimenQuantityObservation","SpecimenStorageActivity","SpecimenTransportActivity","Substance"]},{name:"Context 6-way (uniform owners)",note:"Six owners that are all observation classes — same size, same shape, similar row counts. The controlled comparison for BodySite, whose owners vary wildly in height.",sel:["Context","DimensionalObservation","MeasurementObservation","Observation","SdohObservation","SpecimenQualityObservation","SpecimenQuantityObservation"]},{name:"Two convergences at once",note:"Quantity and TimePoint both converge from the same Specimen activity classes, so two corridors compete for the same space. Where merge distance trades off against crossings.",sel:["Quantity","TimePoint","SpecimenCreationActivity","SpecimenProcessingActivity","SpecimenStorageActivity","SpecimenTransportActivity"]}]},{heading:"Flipped divergences (found via the legend)",cases:[{name:"Participant 22-way (largest fan in the schema)",note:"Bigger than any inbound convergence: 22 edges leaving Participant, 21 of them FLIPPED. Flipped edges keep their attribute-row anchor and must not merge, so this is the fan the merge code deliberately does not touch — and therefore the one nothing has been tuned against.",sel:["Participant","Condition","Consent","Demography","DeviceExposure","DrugExposure","Exposure","File","ImagingStudy","MeasurementObservation","Observation","Procedure","SdohObservation","Specimen","Visit"]},{name:"Visit 19-way",note:"The same shape one size down, and it overlaps Participant heavily — most classes carry both associated_participant and associated_visit, so the two fans run through the same corridor as pairs.",sel:["Visit","Condition","Demography","DeviceExposure","DrugExposure","Exposure","ImagingStudy","MeasurementObservation","Observation","Procedure","QuestionnaireResponse","SdohObservation","TimePeriod"]},{name:"Participant + Visit + Organization",note:"All three FK hubs at once (22 + 19 + 11 edges, nearly all flipped). The densest picture the schema can produce, and the stress test for anything that changes routing.",sel:["Participant","Visit","Organization","Condition","Demography","DimensionalObservation","MeasurementObservation","Observation","ObservationSet","Procedure","SdohObservation","SpecimenQualityObservation","SpecimenQuantityObservation"]},{name:"Converge and diverge at once",note:"MeasurementObservation owns BodySite/Context/Quantity while being owned by Participant/Visit/Organization — edges fan IN and OUT of the same box. Where merged (entity-end) and unmerged (flipped) arrivals sit side by side.",sel:["MeasurementObservation","BodySite","Context","Quantity","Participant","Visit","Organization","MeasurementObservationSet"]}]},{heading:"Normal cases (a fix must not break these)",cases:[{name:"Single edge",note:"One owner, one edge, no convergence at all — merging is a no-op. The floor: if this looks wrong, something basic broke.",sel:["Visit","TimePeriod"]},{name:"Two owners",note:"The smallest real convergence. Two approaches, one arrowhead — the fan is barely a fan, so a merge distance that is too long is obvious here first.",sel:["Participant","Visit","ObservationSet"]},{name:"Specimen chain (deep, not wide)",note:"A long ownership chain rather than a convergence: many layers, few edges per node. Checks that tuning for convergences has not made ordinary edges worse.",sel:["Specimen","SpecimenContainer","SpecimenCreationActivity","SpecimenProcessingActivity","SpecimenStorageActivity","SpecimenTransportActivity","Participant"]},{name:"The known 3-node cycle",note:"Specimen -> SpecimenStorageActivity -> SpecimenContainer -> Specimen: an association plus two ownership edges. Known and deliberately unhandled; here so it stays visible.",sel:["Specimen","SpecimenStorageActivity","SpecimenContainer"]},{name:"Backward ownership (own-bkwd)",note:"Slots drawn backward (performed_by, associated_person, contained_in, related_imaging_study). These keep their attribute-row anchor and must NOT merge — check the arrowheads.",sel:["Organization","Person","Participant","ImagingFile","ImagingStudy","SpecimenContainer","Specimen"]},{name:"Path to root",note:"Path-to-root on from a single deep class, which pulls in every owner up the chain. The biggest graph reachable in one click.",sel:["MeasurementObservation"],roots:!0}]}],st={"own-fwd":{text:"owns (forward)",cls:"text-amber-700 dark:text-amber-400 border-amber-400"},"own-bkwd":{text:"belongs to (backward)",cls:"text-amber-800 dark:text-amber-300 border-amber-600"},association:{text:"association (no ownership)",cls:"text-slate-600 dark:text-slate-300 border-slate-500"},excluded:{text:"dropped",cls:"text-gray-400 dark:text-gray-500 border-gray-300"}};function Fn({dataService:e,onSelect:o}){const n=u.useMemo(()=>e.getOwnershipPairGroups(),[e]),a=u.useMemo(()=>e.getConvergenceRanking(),[e]),r=u.useMemo(()=>e.getDivergenceRanking(),[e]),[s,i]=u.useState(null),c=l=>t.jsx("button",{onClick:()=>o([l]),className:"hover:underline text-blue-600 dark:text-blue-400",title:`Select ${l}`,children:l});return t.jsxs("div",{className:"text-xs",children:[t.jsxs("section",{className:"mb-4",children:[t.jsx("h3",{className:`text-[11px] font-semibold uppercase tracking-wider
                       text-gray-400 dark:text-gray-500 mb-1`,children:"Biggest fans"}),t.jsx("p",{className:"text-[11px] text-gray-500 dark:text-gray-400 mb-1.5",children:"Counted in slot-edges, not classes: one class owning a target through two slots crowds the corridor twice. Click a row to load just that fan."}),t.jsx("div",{className:"grid grid-cols-2 gap-3",children:[["Converging (in)",a.slice(0,6).map(l=>({entity:l.entity,n:l.edgeCount,peers:l.owners,flipped:0}))],["Diverging (out)",r.slice(0,6).map(l=>({entity:l.entity,n:l.edgeCount,peers:l.owned,flipped:l.flippedCount}))]].map(([l,d])=>t.jsxs("div",{children:[t.jsx("h4",{className:"text-[10px] font-medium text-gray-500 dark:text-gray-400 mb-0.5",children:l}),t.jsx("ul",{className:"space-y-0.5",children:d.map(f=>t.jsx("li",{children:t.jsxs("button",{onClick:()=>o([f.entity,...f.peers]),title:`Select ${f.entity} and all ${f.peers.length} peers`,className:"w-full text-left hover:bg-gray-50 dark:hover:bg-slate-700 rounded px-1",children:[t.jsx("span",{className:"text-blue-600 dark:text-blue-400",children:f.entity}),t.jsxs("span",{className:"text-gray-400 ml-1",children:[f.n,f.flipped>0?` (${f.flipped} flipped)`:""]})]})},f.entity))})]},l))})]}),t.jsxs("section",{children:[t.jsx("h3",{className:`text-[11px] font-semibold uppercase tracking-wider
                       text-gray-400 dark:text-gray-500 mb-1`,children:"Every ownership pair, by rule"}),t.jsx("p",{className:"text-[11px] text-gray-500 dark:text-gray-400 mb-1.5",children:"Derived live from the classifier the graph itself uses, so this cannot drift from what is drawn. Overrides and value-object membership are hand-curated — if a pair looks wrong, the classification is."}),t.jsx("ul",{className:"space-y-1",children:n.map(l=>{const d=`${l.verdict}/${l.rule}`,f=st[l.verdict]??st.ref,x=s===d;return t.jsxs("li",{className:"border-l-2 pl-2 border-gray-200 dark:border-slate-600",children:[t.jsxs("button",{onClick:()=>i(x?null:d),className:"w-full text-left",children:[t.jsx("span",{className:`inline-block px-1 rounded border text-[10px] ${f.cls}`,children:f.text}),t.jsx("span",{className:"ml-1.5 font-medium",children:l.rule}),t.jsx("span",{className:"ml-1 text-gray-400",children:l.pairs.length}),t.jsx("span",{className:"ml-1 text-gray-400",children:x?"▾":"▸"})]}),t.jsx("p",{className:"text-[11px] leading-snug text-gray-600 dark:text-gray-400 mt-0.5",children:l.ruleText}),x&&t.jsx("ul",{className:"mt-1 mb-1.5 space-y-0.5 font-mono text-[10px]",children:l.pairs.map(h=>t.jsxs("li",{className:"text-gray-600 dark:text-gray-400",children:[c(h.declaredOn),t.jsxs("span",{className:"text-gray-400",children:[".",h.slotName]}),t.jsx("span",{className:"mx-1 text-gray-400",children:h.multivalued?"↠":"→"}),c(h.range),h.isLoop&&t.jsx("span",{className:"ml-1 text-amber-600",children:"loop"}),(l.verdict==="own-bkwd"||l.verdict==="association")&&t.jsxs("span",{className:"ml-1 text-gray-400",children:["(owner: ",h.owner,")"]})]},`${h.declaredOn}.${h.slotName}`))})]},d)})})]})]})}function zn(e,o){return e.sel.length===o.size&&e.sel.every(n=>o.has(n))}function Gn({onClose:e,onApply:o,selectedIds:n,dataService:a}){const[r,s]=u.useState("cases");return u.useEffect(()=>{const i=c=>{c.key==="Escape"&&e()};return window.addEventListener("keydown",i),()=>window.removeEventListener("keydown",i)},[e]),t.jsxs("div",{className:`absolute top-14 right-4 z-30 w-[26rem] max-h-[80vh] overflow-y-auto
                 rounded-lg border border-gray-300 dark:border-slate-600
                 bg-white dark:bg-slate-800 shadow-xl text-gray-900 dark:text-gray-100`,children:[t.jsxs("div",{className:`sticky top-0 flex items-baseline justify-between gap-2 px-4 py-2
                      border-b border-gray-200 dark:border-slate-700
                      bg-white dark:bg-slate-800`,children:[t.jsxs("div",{children:[t.jsx("h2",{className:"text-sm font-semibold",children:"Example cases"}),t.jsx("p",{className:"text-[11px] text-gray-500 dark:text-gray-400",children:"Fixed targets for comparing merge modes and routing constants."})]}),t.jsx("button",{onClick:e,title:"Close (Esc)",className:"text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-lg leading-none",children:"×"})]}),t.jsx("div",{className:`sticky top-[3.25rem] flex gap-1 px-4 py-1.5 border-b
                      border-gray-200 dark:border-slate-700
                      bg-white dark:bg-slate-800`,children:[["cases","Cases"],["legend","Ownership legend"]].map(([i,c])=>t.jsx("button",{onClick:()=>s(i),className:`px-2 py-0.5 text-xs rounded border ${r===i?"border-blue-500 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300":"border-transparent text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-700"}`,children:c},i))}),t.jsxs("div",{className:"px-4 py-2",children:[r==="legend"&&t.jsx(Fn,{dataService:a,onSelect:i=>o({name:"ad hoc",note:"",sel:i})}),r==="cases"&&Wn.map(i=>t.jsxs("section",{className:"mb-3 last:mb-1",children:[t.jsx("h3",{className:`text-[11px] font-semibold uppercase tracking-wider
                           text-gray-400 dark:text-gray-500 mb-1`,children:i.heading}),t.jsx("ul",{className:"space-y-1.5",children:i.cases.map(c=>{const l=zn(c,n);return t.jsx("li",{children:t.jsxs("button",{onClick:()=>o(c),className:`block w-full text-left rounded px-2 py-1 border
                        ${l?"border-blue-500 bg-blue-50 dark:bg-blue-950":"border-transparent hover:bg-gray-50 dark:hover:bg-slate-700"}`,children:[t.jsx("span",{className:`text-xs font-medium ${l?"text-blue-700 dark:text-blue-300":"text-blue-600 dark:text-blue-400"}`,children:c.name}),t.jsxs("span",{className:"ml-1.5 text-[10px] text-gray-400",children:[c.sel.length,c.roots?" ⇱":""]}),t.jsx("p",{className:"text-[11px] leading-snug text-gray-600 dark:text-gray-400 mt-0.5",children:c.note})]})},c.name)})})]},i.heading))]})]})}function bt(e){const o=e?.trim().toLowerCase();return o==="dim"||o==="ring"||o==="none"?o:void 0}function wt(e){const o=e?.trim().toLowerCase();return o==="left"||o==="right"||o==="top"||o==="bottom"?o:void 0}function xt(e){const o=e?.trim();if(!o)return;const n=Number(o);if(Number.isFinite(n))return{px:n};const a=o.match(/^(-)?(?:anchor|parentBox)\.(width|height)(?:\s*\*\s*(-?[\d.]+))?$/i);if(!a)return;const[,r,s,i]=a,c=i===void 0?1:Number(i);if(Number.isFinite(c))return{of:s.toLowerCase(),times:r?-c:c}}function vt(e,o){const n=e?.trim();if(!n)return{kind:"help-id",arg:o};if(n==="none")return{kind:"none"};const a=n.indexOf(":");return a===-1?{kind:"help-id",arg:n}:{kind:n.slice(0,a).trim(),arg:n.slice(a+1).trim()}}const Un="Format",qn="Walkthrough",Kn=new Set([Un,"TODO"]),kt=/^<\/?(?:details|summary)\b[^>]*>$/i;function oe(e,o){const n=`- **${o}:**`,a=e.findIndex(r=>r.trimStart().startsWith(n));if(a!==-1)return e[a].trimStart().slice(n.length).trim()}function Vn(e,o){const n=`- **${o}:**`,a=e.findIndex(d=>d.trimStart().startsWith(n));if(a===-1)return;const r=e[a].trimStart().slice(n.length).trim(),s=[];for(let d=a+1;d<e.length&&!(e[d].trimStart().startsWith("- **")||kt.test(e[d].trim()));d++)s.push(e[d]);for(;s.length&&s[s.length-1].trim()==="";)s.pop();if(s.length===0)return r;const i=s.filter(d=>d.trim()!=="").map(d=>d.length-d.trimStart().length),c=Math.min(...i),l=s.map(d=>d.slice(c)).join(`
`);return r?`${r}
${l}`:l}function Qn(e,o){const n=`- **${o}:**`,a=e.findIndex(s=>s.trimStart().startsWith(n));if(a===-1)return[];const r=[];for(let s=a+1;s<e.length;s++){const i=e[s].trimStart();if(i.startsWith("- **")||i==="")break;i.startsWith("- ")&&r.push(i.slice(2).trim())}return r}function Xn(e,o){const n=e.findIndex(i=>i.trimStart().startsWith("- **Beats:**"));if(n===-1)return;const a=[];let r=null;const s=()=>{r&&a.push(r)};for(let i=n+1;i<e.length;i++){const c=e[i].trimStart();if(c.startsWith("- **"))break;if(c==="")continue;const l=c.match(/^(\d+)\.\s+(.*)$/);if(l){s(),r={text:l[2].trim()};continue}const d=c.match(/^-\s+([A-Za-z]+):\s*(.*)$/);if(d&&r){const[,f,x]=d,h=f.toLowerCase();h==="anchor"?r.anchor=vt(x,o):h==="action"?r.action=x.trim():h==="change"?r.change=x.trim():h==="highlight"?r.highlight=bt(x):h==="position"?r.position=wt(x):h==="offsetx"?r.offsetX=xt(x):h==="keep"&&(r.keep=x.trim()!=="false");continue}r&&!c.startsWith("-")&&(r.text=`${r.text} ${c}`.trim())}return s(),a.length>0?a:void 0}function Yn(e,o){const n=e.split(`
`),r=n[0].match(/^###\s+(.+)$/);if(!r)return null;const s=r[1].trim(),i=oe(n,"Title")??s,c=Vn(n,"Description")??"",l=Qn(n,"Interactions"),d=oe(n,"Shortcut"),f=oe(n,"Context"),x=vt(oe(n,"Anchor"),s),h=oe(n,"Action"),m=oe(n,"Once"),v=oe(n,"Change"),g=bt(oe(n,"Highlight")),w=wt(oe(n,"Position")),b=xt(oe(n,"OffsetX")),N=Xn(n,s),j=oe(n,"Tour");return{id:s,title:i,description:c,interactions:l,shortcut:d,context:f,anchor:x,action:h,once:m,change:v,highlight:g,position:w,offsetX:b,tour:j===void 0?void 0:j||qn,order:o,beats:N}}function Zn(e,o){const n=e.split(`
`),a=n.findIndex(x=>/^##\s+/.test(x)),r=a===-1?null:n[a].match(/^##\s+(.+)$/),s=r?r[1].trim():"Unknown",i=s.toLowerCase().replace(/[^a-z0-9]+/g,"-"),c=[];for(let x=a+1;x<n.length&&!n[x].startsWith("### ");x++)kt.test(n[x].trim())||c.push(n[x]);const l=c.join(`
`).trim(),d=[],f=e.split(/(?=^### )/m);for(const x of f){if(!x.startsWith("### "))continue;const h=Yn(x.trim(),o());h&&d.push(h)}return{id:i,title:s,body:l,entries:d}}function Jn(e){const o=new Set;for(const n of[...e.entries.values()].sort((a,r)=>a.order-r.order))n.tour&&o.add(n.tour);return[...o]}function St(e,o){const n=Jn(e)[0];return[...e.entries.values()].filter(a=>a.tour!==void 0&&a.tour===n).sort((a,r)=>a.order-r.order)}function eo(e,o){const n=[];return St(e).forEach((a,r)=>{const s=r+1;if(!a.beats||a.beats.length===0){n.push({entry:a,step:s,beatIndex:0,beatCount:0,blocks:[a.description],text:a.description,anchor:a.anchor,action:a.action,change:a.change,highlight:a.highlight,position:a.position,offsetX:a.offsetX});return}let i=a.description?[a.description]:[];i.length>0&&n.push({entry:a,step:s,beatIndex:-1,beatCount:a.beats.length,blocks:i,text:i.join(`

`),anchor:a.anchor,action:a.action,change:a.change,highlight:a.highlight,position:a.position,offsetX:a.offsetX}),a.beats.forEach((c,l)=>{i=c.keep?[...i,c.text]:[c.text],n.push({entry:a,step:s,beatIndex:l,beat:c,beatCount:a.beats.length,blocks:i,text:i.join(`

`),anchor:c.anchor??a.anchor,action:c.action,highlight:c.highlight??a.highlight,position:c.position??a.position,offsetX:c.offsetX??a.offsetX,change:c.change})})}),n}function to(e){const n=e.replace(/<!--[\s\S]*?-->/g,"").trim().split(/^---$/m).map(i=>i.trim()).filter(Boolean),a=[],r=new Map;let s=0;for(const i of n){if(!i.match(/^## /m))continue;const c=i.match(/^##\s+(.+)$/m)?.[1].trim();if(c&&Kn.has(c))continue;const l=Zn(i,()=>s++);a.push(l);for(const d of l.entries)r.set(d.id,d)}return{sections:a,entries:r}}const Ct=!1,jt=u.createContext(null);function Nt(){const e=u.useContext(jt);if(!e)throw new Error("useHelp must be used inside <HelpProvider>");return e}function no(){const e=document.activeElement;return e instanceof HTMLInputElement||e instanceof HTMLTextAreaElement||e?.getAttribute("contenteditable")==="true"}function oo({markdown:e,onPushChange:o,onPopChange:n,resolvers:a,children:r}){const s=u.useMemo(()=>to(e),[e]),i=u.useMemo(()=>eo(s),[s]),c=u.useMemo(()=>St(s).length,[s]),[l,d]=u.useState(!1),[f,x]=u.useState(null),[h,m]=u.useState(null),v=u.useRef(0),g=u.useCallback(()=>{d(!1),m(null)},[]),w=u.useCallback(()=>m(null),[]),b=u.useCallback(M=>m(M),[]),N=u.useCallback(M=>{const A=i[M];A&&(x(M),m(A.entry.id),A.change!=null&&o&&(o(A.change),v.current+=1))},[i,o]),j=u.useCallback(M=>{i[M+1]?.change!=null&&n&&v.current>0&&(n(),v.current-=1);const H=i[M];H&&(x(M),m(H.entry.id))},[i,n]),L=u.useCallback(()=>{d(!1),v.current=0,N(0)},[N]),O=u.useCallback(()=>{if(x(null),m(null),n)for(let M=0;M<v.current;M++)n();v.current=0},[n]),B=u.useCallback(()=>{f!==null&&(f+1>=i.length?O():N(f+1))},[f,i.length,N,O]),F=u.useCallback(()=>{f!==null&&f>0&&j(f-1)},[f,j]),W=u.useCallback(()=>{f!==null&&O(),m(null)},[f,O]),I=u.useCallback(M=>{if(!M)return null;const{kind:A}=M;if(A==="none")return null;const{arg:H}=M;return A==="help-id"?document.querySelector(`[data-help-id="${CSS.escape(H)}"]`):a?.[A]?.(H)??null},[a]);u.useEffect(()=>(document.body.classList.toggle("help-mode",l),()=>{document.body.classList.remove("help-mode")}),[l]),u.useEffect(()=>{if(l)return window.addEventListener("blur",g),()=>window.removeEventListener("blur",g)},[l,g]),u.useEffect(()=>{if(!l)return;function M(A){const H=A.target;if(!H)return;const $=H.closest("[data-help-id]");$?(A.stopPropagation(),A.preventDefault(),b($.getAttribute("data-help-id"))):H.closest("[data-help-popover]")||w()}return document.addEventListener("click",M,!0),()=>document.removeEventListener("click",M,!0)},[l,b,w]),u.useEffect(()=>{function M(A){if(A.key==="?"&&no(),A.key==="Escape"&&(l||f!==null)){A.preventDefault(),A.stopPropagation(),h&&f===null?w():f!==null?O():W();return}f!==null&&(A.key==="ArrowRight"&&(A.preventDefault(),B()),A.key==="ArrowLeft"&&(A.preventDefault(),F()))}return document.addEventListener("keydown",M,!0),()=>document.removeEventListener("keydown",M,!0)},[l,f,h,W,w,O,B,F]);const G=u.useMemo(()=>({helpMode:l,toggleHelpMode:W,exitHelpMode:g,tourIndex:f,startTour:L,endTour:O,nextStep:B,prevStep:F,positions:i,position:f===null?void 0:i[f],stepCount:c,content:s,activeId:h,showEntry:b,dismissEntry:w,resolveAnchor:I}),[l,W,g,f,L,O,B,F,i,c,s,h,b,w,I]);return t.jsx(jt.Provider,{value:G,children:r})}const Ue={a:({href:e,children:o})=>t.jsx("a",{href:e,target:"_blank",rel:"noreferrer",children:o}),blockquote:({children:e})=>t.jsxs("div",{className:"help-popover-alert",role:"note",children:[t.jsx("span",{className:"help-popover-alert-mark","aria-hidden":"true",children:"!"}),t.jsx("div",{children:e})]})};function so(e){try{return localStorage.getItem(e)}catch{return null}}function ao(e,o){try{localStorage.setItem(e,o)}catch{}}const Et="help-once-";function ro(e){return e.split(`
`).filter(o=>!/^\s{0,3}>/.test(o)).join(`
`).replace(/\n{3,}/g,`

`).trim()}function io(e){return so(Et+e)==="1"}function lo(e){ao(Et+e,"1")}function co(e){return{...Ue,blockquote:({children:o})=>t.jsxs("div",{className:"help-popover-alert",role:"note",children:[t.jsx("span",{className:"help-popover-alert-mark","aria-hidden":"true",children:"!"}),t.jsxs("div",{children:[o,t.jsxs("label",{className:"help-popover-alert-once",children:[t.jsx("input",{type:"checkbox",onChange:e}),"Don't show this again"]})]})]})}}function ho(){const{helpMode:e,tourIndex:o,position:n,positions:a,stepCount:r,content:s,activeId:i,dismissEntry:c,nextStep:l,prevStep:d,endTour:f,showEntry:x,resolveAnchor:h}=Nt(),m=o!==null,v=i?s.entries.get(i):void 0,g=h,w=u.useCallback(P=>g(P)?.getBoundingClientRect()??null,[g]),b=m?n?.anchor:v?.anchor,N=(m?n?.highlight:v?.highlight)??"dim",j=()=>{if(!n||n.beatCount===0)return null;const P=n.beatIndex+1;return t.jsx("span",{className:"help-tour-dots",title:`Beat ${P} of ${n.beatCount} in this step`,children:Array.from({length:n.beatCount},(q,K)=>t.jsx("span",{className:K<P?"help-dot help-dot-on":"help-dot"},K))})},[L,O]=u.useState(null),[B,F]=u.useState(!1),W=u.useRef(null),[,I]=u.useState(0),G=v?.once,M=G!==void 0&&io(G),A=u.useMemo(()=>G===void 0?Ue:co(()=>{lo(G),I(P=>P+1)}),[G]),H=u.useRef(null);u.useEffect(()=>{H.current=null},[i,b]),u.useLayoutEffect(()=>{if(!i){O(null);return}const P=()=>{const K=g(b);K&&H.current!==K&&(H.current=K,K.scrollIntoView({block:"center",behavior:"smooth"})),O(K?.getBoundingClientRect()??null)};P(),window.addEventListener("resize",P),window.addEventListener("scroll",P,!0);const q=window.setInterval(P,250);return()=>{window.removeEventListener("resize",P),window.removeEventListener("scroll",P,!0),window.clearInterval(q)}},[i,b,g]);const $=600,z=m&&n?.change!=null&&b!==void 0&&b.kind!=="none",[Y,T]=u.useState(!1);u.useEffect(()=>{if(!z){T(!0);return}T(!1);const P=window.setTimeout(()=>T(!0),$);return()=>window.clearTimeout(P)},[z,o]);const V=Y||L!==null;u.useEffect(()=>{const P=W.current;P&&(v&&V?P.matches(":popover-open")||P.showPopover():P.matches(":popover-open")&&P.hidePopover())},[v,V]),u.useEffect(()=>{(!e||m)&&F(!1)},[e,m]);const Z=e&&!m?[...s.entries.values()].filter(P=>w(P.anchor)).map(P=>P.id):[];return t.jsxs(t.Fragment,{children:[L&&i&&N!=="none"&&t.jsx("div",{className:`help-spotlight${N==="ring"?" help-spotlight-ring":""}`,style:{left:L.left-4,top:L.top-4,width:L.width+8,height:L.height+8}}),Z.map(P=>{const q=w(s.entries.get(P)?.anchor);return q?t.jsx("button",{className:"help-hint",title:s.entries.get(P)?.title??P,style:{left:q.right-6,top:q.top-6},onMouseEnter:()=>{B||x(P)},onMouseLeave:()=>{B||c()},onClick:K=>{K.stopPropagation(),F(!0),x(P)},children:"?"},P):null}),t.jsx("div",{ref:W,popover:"manual","data-help-popover":"",className:"help-popover",style:uo(L,m?n?.position:void 0,m?n?.offsetX:void 0),children:v&&t.jsxs(t.Fragment,{children:[t.jsx("h4",{className:"help-popover-title",children:v.title}),m&&n?.action&&t.jsxs("div",{className:"help-popover-action",children:[t.jsx("span",{className:"help-popover-action-mark","aria-hidden":"true",children:"✓"}),t.jsx("div",{children:t.jsx(Me,{children:n.action})})]}),(m?n?.blocks.some(Boolean):v.description)&&t.jsx("div",{className:"help-popover-body",children:(m?n.blocks:[v.description]).map(P=>M?ro(P):P).filter(Boolean).map((P,q,K)=>t.jsx("div",{className:q===K.length-1?void 0:"help-beat-past",children:t.jsx(Me,{components:A,children:P})},q))}),v.interactions.length>0&&t.jsx("ul",{className:"help-popover-interactions",children:v.interactions.map((P,q)=>t.jsx("li",{children:t.jsx(Me,{components:Ue,children:P})},q))}),v.shortcut&&t.jsxs("p",{className:"help-popover-shortcut",children:["Shortcut: ",t.jsx("kbd",{children:v.shortcut})]}),v.context&&t.jsx("div",{className:"help-popover-context",children:t.jsx(Me,{children:v.context})}),m?t.jsxs("div",{className:"help-tour-nav",children:[t.jsxs("span",{className:"help-tour-count",title:`Position ${o+1} of ${a.length}`,children:[n?.step," / ",r]}),j(),t.jsx("span",{className:"help-tour-spacer"}),t.jsx("button",{onClick:d,disabled:o===0,title:"Previous (← arrow key)",children:"← back"}),t.jsx("button",{onClick:l,className:"help-tour-next",title:"Next (→ arrow key)",children:o+1===a.length?"done":"next →"}),t.jsx("button",{onClick:f,title:"End the tour and undo what it added (Esc)",children:"✕"})]}):t.jsxs("div",{className:"help-tour-nav",children:[t.jsx("span",{className:"help-tour-spacer"}),t.jsx("button",{onClick:()=>{F(!1),c()},children:"close"})]})]})})]})}function uo(e,o,n){const s=window.innerWidth,i=window.innerHeight;if(!e)return{left:Math.max(8,(s-320)/2),top:Math.max(8,(i-260)/2),width:320};const c=260;if(o){const g={right:{left:e.right+12,top:e.top},left:{left:e.left-320-12,top:e.top},bottom:{left:e.left,top:e.bottom+12},top:{left:e.left,top:e.top-c-12}}[o];return ze({left:Math.max(8,Math.min(g.left,s-320-8)),top:Math.max(8,Math.min(g.top,i-c)),width:320},e,n,s)}const l=document.querySelector("[data-graph-direction]"),d=l?.getAttribute("data-graph-direction");if(!!l&&po(e,l.getBoundingClientRect())&&d==="RIGHT"){const g=e.bottom+12;if(g+c<=i-8)return ze({left:Math.max(8,Math.min(e.left,s-320-8)),top:g,width:320},e,n,s)}const x=s-e.right-12,h=e.left-12,m=x>=h?Math.min(e.right+12,s-320-8):Math.max(8,e.left-320-12),v=Math.max(8,Math.min(e.top+e.height/2-c/3,i-c));return ze({left:Math.max(8,m),top:v,width:320},e,n,s)}function ze(e,o,n,a){if(!n)return e;const r="px"in n?n.px:(n.of==="width"?o.width:o.height)*n.times;return{...e,left:Math.max(8,Math.min(e.left+r,a-e.width-8))}}function po(e,o){return e.left<o.right&&e.right>o.left&&e.top<o.bottom&&e.bottom>o.top}const de=(e,o)=>`[${e}="${CSS.escape(o)}"]`,go=()=>document.querySelector('[data-help-id="selection-tree"]');function Mt(e){const o=go();if(!o)return null;const n=o.querySelector(de("data-class-row",e));if(n)return n;const r=[...o.querySelectorAll(de("data-entity-row",e))].map(s=>s.closest(".dbw-row")??s);return r.find(s=>s.getBoundingClientRect().height>0)??r[0]??null}function mo(e){return Mt(e)?.querySelector('input[type="checkbox"]')??null}function Tt(e){const o=document.querySelector(de("data-node-id",e));if(o)return o;const n=document.querySelector(de("data-node-id",`merged::${e}`));return n||(document.querySelector(de("data-declaring-class",e))?.closest("[data-node-id]")??null)}function fo(e){const o=e.lastIndexOf(".");if(o===-1)return null;const n=e.slice(0,o),a=e.slice(o+1),r=Tt(n);if(!r)return null;const s=r.querySelector(`${de("data-row",a)}${de("data-declaring-class",n)}`);return s||r.querySelector(de("data-row",a))}const yo={"entity-row":Mt,"entity-checkbox":mo,"slot-row":fo,"node-box":Tt},bo=`# Explorer help

Help + tour content for the dmvd Explorer. The **Format** section below is the
spec; everything from *Getting started* onward is the content itself.

Parsed by \`parseHelpContent.ts\`; pinned by \`src/test/helpContent.test.ts\`.
Package-level design lives in [docs/HELP_PACKAGE_PLAN.md](../../docs/HELP_PACKAGE_PLAN.md).

---
<details>
<summary><b>TODO</b></summary>

- according to my work process loop i give you new todos here,
  but the next todos require screen shots, so do nothing until i
  paste them into session

### Still open

- **open the app at the start of the tour** — the other half of bullet one, left
  alone pending your call on whether it should auto-fire.

<details>
<summary><b>Original unfinished draft text</b></summary>

1. current first step sort of highlights the title but doesn't dim the rest. fix
   only if it takes less than a minute. text:
   - **BDCHM Explorer**
   - An interactive map of the [BioData Catalyst Harmonized Model](https://rtiinternational.github.io/NHLBI-BDC-DMC-HM/)
     — the ~55 entities defined by its [LinkML schema](https://linkml.io/)
     and how they relate to each other. You can use it to more quickly and thoroughly
     understand the relationships than with the static [LinkML documentation](https://rtiinternational.github.io/NHLBI-BDC-DMC-HM/).
     It is meant to help researchers who:
     - Have access to data in BDCHM format and want to understand its structure;
     - Have data that they want to harmonize to BDCHM format; or
     - Are designing studies and want to model them using BDCHM or want to use
       BDCHM for ideas or inspiration for their own efforts.
   - Pick some entities on the left and the diagram shows how they fit
     together. Click the title to clear everything and start over.
2. highlight selection panel. text:
   - **Entities**
   - A LinkML schema defines classes representing a data model's entities.
     A class defines a set of slots or attributes (like columns in a database table)
     which can hold
     - other entities,
     - permissible value sets (enumerations),
     - or raw data types (strings, integers, etc.)
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
</details>


### following steps not finished yet. ignore
- **Make better Change, Action, Beat implementation**
  - When relationship-kinds (Tour 3.1) pops up the action has already
    occurred and the Action: text does not make the step more legible.
    A better sequence of events would be:
    - anchor on unchecked MeasurementObservation selection row
    - actually would be better if this were not 
- **Change: allow add, remove, clear.** The authoring
  format has an additive \`Change:\` and no remove verb. Consequence
  today: tour step 4 ADDS to step 3's canvas instead of replacing it,
  so the canvas is cumulative where the copy reads as if it were
  showing a clean two-box example. Notes about this also in
  \`help-content.md\`
- **Tour authoring notes + draft preview** — \`Note:\` / \`Draft:\`
  / \`ForClaude:\` fields, and a way to view a tour *including* its
  parked and unfinished steps. deferred 2026-08-27 for time
- **Multi-line for the OTHER fields** (\`Context:\`, \`Action:\`, beat text).
  Deliberately not done: you said "1 for now; may need 2 soon". The block
  reader (\`extractBlockField\`) is written generically, so each field is a
  one-line change when you want it.
- **Multi-line for the OTHER fields** (\`Context:\`, \`Action:\`, beat text) —
  still parked at your "1 for now". Also listed below.


</details>

---

<details>
<summary><b>Format</b></summary>

## Format

> This section is the spec, and it is deliberately part of the document so it
> renders wherever the file is read. The parser skips it by name — see
> \`SPEC_SECTION\` in \`parseHelpContent.ts\`. Keep it current when the format
> changes.

### Structure

\`\`\`
## Section Title          — groups entries; body text before the first ###
### entry-id              — one entry: a help topic and/or a tour step
\`\`\`

Sections are separated by \`---\` lines.

**Sections organise the source file; they do not appear in the app.** Neither
a section's title nor its body text is rendered anywhere today — the popover
shows one entry at a time, and both the tour and help mode reach entries
through the flat registry, never through sections. So:

- **Prose written as section body text is invisible to the reader.** If you
  want it in the tour, it belongs in an entry's \`Description:\`.
- **Section boundaries do not constrain tour order, but file order IS tour
  order.** A tour's steps run in the order they appear in this file, counting
  across sections — so consecutive steps may sit in different sections, and
  moving a step means moving its block.

They are still doing two jobs, so do not remove them: they group entries
legibly in this file, and the \`---\` separators between them are what the
parser splits on. \`HelpSection.body\` is parsed and available if a future help
mode wants to show section intros — it is unused, not unsupported.

**Each section is wrapped in \`<details>\` so the file folds when read on
GitHub**, which is what makes a 600-line document navigable. Two things about
that wrapper are deliberate:

- **The \`<summary>\` repeats the \`## Heading\` below it.** That looks redundant
  and is load-bearing: the parser identifies a section by \`^## \` and matches
  \`PROSE_SECTIONS\` on that text, so deleting the heading in favour of the
  summary makes the section invisible to the parser.
- **The content sections are \`<details open>\`; \`Format\` and \`TODO\` are not.**
  Collapsing the tour while you are editing it would hide the work; the long
  reference material is what benefits from folding.

A multi-line field stops at \`<details>\`, \`</details>\` or \`<summary>\` as well as
at the next \`- **Field:**\`, so the closing tag after a section's last entry
does not get swallowed into that entry's \`Description:\`.

### Entry fields

| Field | Meaning |
|---|---|
| \`Title:\` | short name shown as the popover heading |
| \`Description:\` | one or two sentences; markdown allowed |
| \`Interactions:\` | bullet list of what you can do |
| \`Shortcut:\` | key hint, rendered as a \`<kbd>\` |
| \`Context:\` | smaller footnote text |
| \`Anchor:\` | what to point at — see [Anchors](#anchors) |
| \`Action:\` | one sentence saying what the tour just DID — see [Actions](#actions) |
| \`Once:\` | storage key letting this entry's alerts be dismissed for good — see [Alerts](#alerts) |
| \`Change:\` | what this step ADDS to the app state, as a URL query — see [Change](#change) |
| \`Highlight:\` | how hard to point at the anchor: \`ring\`, \`dim\`, \`none\` — see [Highlight](#highlight) |
| \`Position:\` | force the popover to a side: \`left\`, \`right\`, \`top\`, \`bottom\` — see [Placement](#placement) |
| \`OffsetX:\` | nudge it horizontally — see [Placement](#placement) |
| \`Tour:\` | which tour this is a step of, e.g. \`Walkthrough\`; omit for help-only |
| \`Beats:\` | ordered sub-steps, each REPLACING the last — see [Beats](#beats) |

Written as \`- **Field:** value\`. Only \`Title\` and \`Description\` are required.
An entry with no \`Tour:\` is help-only: reachable in help mode, never visited by
a tour.

**\`Description:\` is a multi-line markdown block; every other field is one
line.** The description runs from the colon to the next \`- **Field:**\`, so it
can hold paragraphs, bullet lists and links — write the step's prose the way
you want it read, in the order you want it read:

\`\`\`markdown
- **Description:** An interactive map of the [BDCHM](https://example.org)
  — what it is, in a sentence or two.

  It is meant to help researchers who:

  - have data in this format;
  - want to harmonize to it.
- **Anchor:** app-title
\`\`\`

Continuation lines are indented to show they belong to the field; the indent is
stripped before the markdown is rendered. **Blank lines do not end the block** —
only the next \`- **Field:**\` does.

Because the description can carry its own bullets, \`Interactions:\` and
\`Context:\` are now optional structure rather than the only way to get a second
paragraph. Use them when you want a step's furniture set apart from its prose;
put the prose in \`Description:\`.

### Tours and order

\`Tour:\` does two jobs: it marks an entry as a step, and it names **which tour**
the step belongs to.

\`\`\`markdown
- **Tour:** Walkthrough    <- a step of the Walkthrough tour
- **Tour:**                <- bare: joins the default tour, also "Walkthrough"
  (field absent)           <- help-only, never visited by a tour
\`\`\`

**Order comes from the file, not from the field.** A tour's steps run top to
bottom in the order their entries appear here. So:

- **Inserting a step is a paste.** Write the entry where you want it to happen.
  Nothing else in the file changes.
- **Moving a step is moving its block.** Cut, paste, done.
- **There is no number to get wrong** — no duplicates, no gaps, no renumbering
  a tail of steps because one went in the middle.

The counter the viewer sees (\`4.2 / 6\`) is computed from rank at parse time.

**Several tours can share this file.** Entries with different \`Tour:\` names are
different walks: \`Tour: Walkthrough\` and \`Tour: Deep dive\` interleave freely in
the file and each tour sees only its own steps, in file order. One entry belongs
to at most one tour; a topic two tours both want is written twice, or written
once as a help-only entry that both link to.

> **What this replaced.** \`Tour:\` was a 1-based number until 2026-08-28.
> Inserting a step between 3 and 4 meant renumbering every step after it, and a
> duplicate or a gap silently reordered the tour rather than failing. Siggie,
> 2026-08-28: *"make it easy to add/move steps without having to renumber
> everything."* Note the two forms are distinguishable on sight — \`Tour: 3\` is
> not a tour name — so an unmigrated entry is visible rather than silently
> wrong, unlike the \`State:\`/\`Change:\` rename.

### Disabling a field

**Prefix any field name with \`_\` to park it.** The field is still parsed, but
treated as absent:

\`\`\`markdown
- **_Tour:** Walkthrough  <- entry drops out of the tour, stays as help
- **_Change:** sel=X      <- change not pushed
\`\`\`

Use it for a step that is written but not ready to appear. The step simply
drops out of the sequence — parking one of six leaves a working 5-step tour,
and since order comes from the file there is nothing to renumber.

### Anchors

\`Anchor:\` says which element on screen the popover points at and rings. It is
separate from the entry's \`### id\`, which is only identity: the registry key
that tests, \`Beats:\` and cross-links use.

There are two ways to name an element, and they differ in *when* the element
has to exist.

**Tagged elements — \`data-help-id\`.** Dmvd hand-writes
\`data-help-id="<name>"\` on the dozen or so landmarks worth explaining (the
title, the left panel, the graph canvas, the toolbar toggles). The attribute is
not only for anchoring: in help mode a click anywhere inside a tagged element
opens that element's entry, so the tag is what makes a region clickable-for-help
in the first place. Anchoring reuses it. Grep for \`data-help-id=\` to see every
one.

**Runtime lookups — \`<kind>:<argument>\`.** A diagram row or tree row cannot
carry a stable tag: the diagram destroys and rebuilds its boxes on every
relayout, and one class can be drawn in several places. So instead of naming an
element the anchor names a **question** — \`entity-row:Participant\` means "ask
the host where Participant's row is, right now" — and a resolver function
answers it at the moment the popover is placed.

| Form | Meaning |
|---|---|
| *(omitted)* | \`help-id:<the entry id>\` — the common case, when the entry explains a tagged element and shares its name |
| \`<bare-id>\` | \`help-id:<bare-id>\` — for an entry pointing at a tagged element under some other name |
| \`<kind>:<argument>\` | run the host's \`<kind>\` resolver on \`<argument>\` |
| \`none\` | point at nothing; the popover is centred and nothing is ringed |

| Kind | Points at |
|---|---|
| \`help-id:<id>\` | the element tagged \`data-help-id="<id>"\` |
| \`entity-row:<Entity>\` | that entity's row in the selection panel |
| \`entity-checkbox:<Entity>\` | that row's checkbox |
| \`slot-row:<Entity>.<slot>\` | one attribute row inside a diagram box |
| \`node-box:<Entity>\` | a whole entity box on the diagram |

Only \`help-id\` and \`none\` are built in. **The other kinds are registered by the
host app, not known to the parser**, which splits \`kind:argument\` and stops:
resolving "entity row" means knowing what a dmvd entity row is, which the help
package must not. They are handed in as \`<HelpProvider resolvers={...}>\`; dmvd's
live in \`src/explore/helpResolvers.ts\`.

**Why an attribute rather than a CSS selector or a plain \`id\`.** A selector
anchor (\`.left-panel > div:nth-child(2)\`) would resolve fine — \`help-id\` is a
\`querySelector\` underneath — but it breaks silently on any restyle, and nothing
in the styled file hints that help depends on it. \`data-help-id\` greps, survives
refactors, and is visible at the point of use. A plain \`id\` would anchor, but it
is a page-wide namespace shared with anything else that wants one, and it does
not mark "this region is help-clickable" the way the dedicated attribute does.

An anchor whose element is not on screen — a collapsed tree row, a box the
current selection does not include — degrades to an unringed, centred popover
rather than failing.

Two kinds have an edge worth knowing when you author:


- **\`entity-row\` / \`entity-checkbox\`** work in both left-panel modes (table and
  tree). In tree mode everything starts collapsed, so a deeply nested entity's
  row may not exist in the DOM when the step fires; give such a step a
  \`Change:\` that selects the entity, or anchor it at the diagram instead.
- **\`slot-row:<E>.<slot>\`** splits on the LAST dot. Inside a merged sibling box
  several rows can share a slot name, and \`<E>\` is what picks between them.

### Actions

When a step changes the app for the viewer, it **must** say so:

\`\`\`markdown
- **Action:** Ticked MeasurementObservation for you in the panel on the left.
\`\`\`

Write it as a plain sentence in the tour's own voice. This exists because a step
that silently changes the diagram reads as a description of whatever just
appeared. The popover renders \`Action:\` text in its own band, visually distinct
from the description.

**Rule of thumb:** if the step carries a \`Change:\` that actually changes
something, it needs an \`Action:\`. A test enforces this.

### Alerts

**A markdown blockquote is an alert.** Write \`>\` in any \`Description:\` or beat
and it renders as an amber, ruled-left band with a \`!\` — for the thing a reader
has to notice rather than read past:

\`\`\`markdown
- **Description:** Ordinary prose.

  > This tour will introduce you to all of the Explorer's major features.
  > Click the ✕ or hit **Esc** any time to leave.
\`\`\`

An alert is part of a step's prose, not a property of the step, which is why it
is markdown rather than an \`Alert:\` field. A field can sit in only one place;
\`>\` goes wherever the sentence belongs — before the text, after it, or as the
whole block — and works in every beat without each one declaring a field.

**Prefix every line with \`>\`.** Markdown's lazy continuation would let you drop
it on later lines, but a dismissed alert is removed line by line, so an
unprefixed line stays behind after the rest of the note has gone.

Don't confuse it with the \`Action:\` band, which is also tinted and ruled. Blue
and \`✓\` is the tour reporting what it just did to your app; amber and \`!\` is
the tour telling you something. Two different sentences, two different bands.

#### \`Once:\` — an alert you can put away

An alert is permanent by default, which is right for a caution that is true
every time you read the step. For the other kind — the orientation note a
first-time visitor needs and a returning one should not have to dismiss again —
give the entry a \`Once:\`:

\`\`\`markdown
- **Once:** intro
\`\`\`

Every alert in that entry then carries a **Don't show this again** checkbox,
and ticking it stores \`help-once-intro\` in \`localStorage\`; on the next visit
those alerts are stripped from the entry before it renders.

An explicit checkbox rather than a silent show-once counter, deliberately: with
a counter a reader who wanted the note back cannot get it, and a reader who
never looked has already spent their one showing.

**The key is authored, not derived from the entry id.** Two entries can share a
key so that one tick silences the same note in both, and renaming an entry does
not resurrect a note the viewer already put away.

### Highlight

By default an anchored step draws a blue ring around its anchor **and** dims
everything else. \`Highlight:\` changes that:

\`\`\`
- **Highlight:** ring
\`\`\`

| value | effect |
|---|---|
| (omitted) | ring + dimming — the default |
| \`dim\` | the same, written out |
| \`ring\` | the ring alone, nothing dimmed |
| \`none\` | draw nothing |

Use \`ring\` when the anchor is one control among several the reader is meant to
compare — dimming the rest hides the context the step is talking about.

**\`none\` still resolves the anchor**, so the anchor keeps positioning the
popover. That is the point of it: a step can aim the popover at something
without visually seizing it. (\`Anchor: none\` is the different thing — no anchor
at all, so the popover is centred.)

Unrecognised values are ignored, so a typo costs the override and not the tour.
A beat inherits its step's \`Highlight:\` and can override it.

### Placement

The popover normally places itself: **below** the anchor when the anchor is a
box on the diagram and the layout is LR, **beside** it (on whichever side has
more room) otherwise. That rule is about the diagram's growth axis — in LR the
graph grows rightwards, so a popover on the right is standing where the next
box will be laid out.

Two fields override it, on a step or on a beat:

\`\`\`
- **Position:** bottom
- **OffsetX:** anchor.width * 1.3
\`\`\`

\`Position:\` is one of \`left\`, \`right\`, \`top\`, \`bottom\`, relative to the anchor.
A value that is none of those is ignored, so a typo costs the override rather
than the tour.

\`OffsetX:\` shifts the popover horizontally after placing it. It takes either a
pixel count (\`260\`, \`-40\`) or a multiple of the anchor's own size
(\`anchor.width * 1.3\`, \`anchor.height\`, \`-anchor.width\`). \`parentBox\` works as
a synonym for \`anchor\`.

**Prefer the relative form.** Every entity box is the same width, so
\`anchor.width * 1.3\` clears one box plus a gutter — which is how you leave room
for a box the step is about to add — and it stays right if the box width
changes. It is a closed grammar, not an expression: \`anchor.width + 10\` and
\`anchor.left\` do not parse.

Both are clamped to the viewport. An override can pick a bad side; it cannot
push the popover off-screen.

A beat inherits its step's \`Position:\` and \`OffsetX:\` and can override either
independently, the same way it inherits \`Anchor:\`.

### Change

\`Change:\` is a **delta**, in the same vocabulary as a share link: it says what
the step ADDS to the app state, and a param it does not name is a param it does
not touch.

\`\`\`markdown
- **Change:** sel=BodySite~Participant
\`\`\`

**Entering a position pushes its change; \`back\` pops it.** That is what makes
\`back\` exact without every step having to describe the whole world, and it is
why leaving the tour needs no restore — the tour unwinds only what it added, so
anything the viewer did during it is simply still there.

**A value already present is pushed anyway.** The second copy is a reference
count: if the viewer had \`Participant\` ticked and a step also wants it, popping
removes the tour's copy and leaves theirs. You never author this; it is what the
mechanism does with a change you wrote.

| Written | Means |
|---|---|
| \`- **Change:** sel=Participant\` | add Participant to whatever is drawn |
| \`- **Change:** dir=DOWN\` | set the direction; leave the selection alone |
| \`- **Change:**\` (no value) | change nothing, but occupy a slot on the stack |
| *(field absent)* | push nothing at all — see the beats note below |

The empty form is what an exposition step wants. It is not the same as omitting
the field: an empty \`Change:\` pushes an empty frame, so stepping back into it
pops the step after it; omitting the field pushes nothing, so back through the
position is a plain move.

**Scalars overwrite and are not restored.** A step that sets \`dir=DOWN\` over a
viewer's \`dir=RIGHT\` keeps \`DOWN\` after the pop. Deliberate, and decided rather
than overlooked — Siggie, 2026-08-27: *"if scalar settings clobber user actions,
don't worry about it. easy enough for the user to reclick the button."* Only
\`sel\` is refcounted, because only \`sel\` has room to hold two copies.

**There is no "remove" verb.** A step can add a class to the diagram; it cannot
take one away. If a step needs a clean diagram rather than a cumulative one,
that is a format addition, not something to fake with the fields that exist.

**Beats: only the first pushes the step's change.** Under the old model every
beat re-applied its step's full state, which was harmless because re-applying
the same absolute state twice does nothing. Pushing the same delta once per beat
is not: a four-beat step would stack four frames and \`back\` would crawl out of
them one useless pop at a time. So a step's \`Change:\` belongs to its first beat,
and a later beat pushes only a change it declares itself.

> **What this replaced.** \`State:\` was a **full, absolute** query, applied with
> \`url.search = query\`. So the tour had to snapshot the viewer's state on entry
> and restore it on exit; a mid-tour edit was clobbered, which is what the
> yellow *"your changes will be discarded"* warning was for; and **any field a
> step did not name snapped back to its default** — Siggie had a non-default
> setting and every step with a \`State:\` silently reset it, because no step
> wrote that param. All three are gone. Note the two forms look identical in the
> file: \`State: sel=X\` and \`Change: sel=X\` are the same text meaning opposite
> things, so an old value cannot be migrated by leaving it alone.

### Beats

A tour step is one popover that can advance through several **beats** without
moving on to the next step. Use beats for sub-steps of one idea, and for
revealing a list one item at a time.

**The step OPENS on its \`Description:\` alone, and each beat REPLACES what is
showing.** One thought on screen at a time.

So a step with N beats has **N+1 positions**: the opening, then one per beat.
(A step whose \`Description:\` is empty has no opening position — there would be
nothing to show — and starts on beat 1.)

\`\`\`markdown
- **Description:** The setup, shown alone first.
- **Beats:**
  1. Replaces the setup.
     - Anchor: selection-tree
  2. Replaces beat 1. Markdown allowed.
     - Anchor: entity-row:MeasurementObservation
     - Action: Ticked it for you.
     - Change: sel=MeasurementObservation
\`\`\`

**Beat text must not be empty.** Under the old accumulating default an empty
beat was invisible, because the blocks above it filled the popover; now it is
the only block, and the position renders blank. There is a test for it.

**\`Keep:\` accumulates instead.** A beat that continues the previous thought
rather than starting a new one keeps what is showing and adds below it:

\`\`\`markdown
  3. Adds below beat 2 instead of replacing it.
     - Keep: true
\`\`\`

Everything but the newest block is then dimmed, so the reader can see what just
arrived. Use it for a genuine reveal-the-list step; the next beat without a
\`Keep:\` clears the accumulation again. A bare \`- Keep:\` counts as true (it is a
marker, not a setting); \`Keep: false\` is not a keep.

Each beat may carry its own \`Anchor:\`, \`Action:\`, \`Change:\` and \`Keep:\` as
indented \`- Field: value\` lines. Note these are **plain, not bold** — that is
what keeps a beat's own fields distinguishable from the entry fields that
follow the block. A beat that omits \`Anchor:\` or \`Action:\` inherits the step's.

> **This default has been both ways; here is why it settled here.** Beats first
> REPLACED, which forced an author to repeat the description in beat one or
> watch it vanish. So on 2026-08-28 they were made to ACCUMULATE, with the
> description as beat one — *"by default, the beat text is additive on top of
> that / in order to clear previous text add a 'clear' marker or field"*.
>
> That fixed the repetition and introduced a worse problem: the newest text sat
> at the BOTTOM of a growing block, so the reader had to find where to start.
> Dimming the old text further, a coloured rule on the new block and an
> entrance animation were all tried; none of them fixed it. Siggie, same day:
> *"the blue line isn't quite doing it. let's change the default to
> Clear: true."*
>
> So beats replace again — but the two things that made the ORIGINAL replacing
> model painful are both gone. The description now has its own opening
> position, so it is read before any beat replaces it and never has to be
> repeated; and \`Keep:\` is there for the steps that genuinely want to build a
> list up. The default is what most beats want, and the other case is one
> field away.

A step with no \`Beats:\` is exactly one position, so steps written before beats
existed still parse and behave identically. \`next\` advances beat by beat, then
to the next step.

**The counter always counts STEPS** — \`2 / 6\` for the whole of step 2, however
many beats it has — and beat progress is shown beside it as **reveal dots**,
one per beat, filled as they appear. Two scales, two widgets: a fraction that
mixes them cannot be read, which is what was wrong with the old \`2.1 / 6\`
(\`2.1\` is not a position out of 6). A step with no beats shows no dots.

### Who the tour is for

Someone who arrives from a **link** with no one explaining it — the program
manager case. So step 1 assumes nothing, and any step that needs a selection
brings its own via \`Change:\` rather than asking the visitor to click first.

</details>
---
<details open>
<summary><b>Getting started</b></summary>

## Getting started

What this app is and how to move around it.

### app-title

- **Title:** BDCHM Explorer
- **Tour:** Walkthrough
- **Description:** An interactive map of the **BioData Catalyst Harmonized Model**
  — the ~55 entities defined by its [LinkML schema](https://linkml.io/) and how
  they relate to each other. You can use it to more quickly and thoroughly
  understand the relationships than with the static
  [LinkML documentation](https://rtiinternational.github.io/NHLBI-BDC-DMC-HM/).
  It is meant to help researchers who:

  - Have access to data in BDCHM format and want to understand its structure;
  - Have data that they want to harmonize to BDCHM format; or
  - Are designing studies and want to model them using BDCHM or want to use
    BDCHM for ideas or inspiration for their own efforts.

  Pick some entities on the left and the diagram shows how they fit together.
  Click the title to clear everything and start over.

  > This tour will introduce you to all of BDCHM Explorer's major features.
  > - Click the ✕ or hit **Esc** any time to exit.
  > - Use arrow keys or next/back buttons to navigate.
- **Anchor:** app-title
- **Once:** intro
- **Change:**

### selection-tree

- **Title:** Entities
- **Tour:** Walkthrough
- **Anchor:** selection-tree
- **Description:** A LinkML schema defines classes representing a data model's
  entities. The left panel lists them, grouped into categories for convenience,
  though these categories are not actually part of the schema.
- **Beats:** <!-- these are just copied from below, need to get beats working
              right before authoring -->
  1. In order to select an entity for display, click its checkbox
     - Anchor: entity-row:Person
  2. The Person box shows the entity name, a dismiss (x) icon, a menu
     for displaying boxes for related entities, and a list of this entity's
     attributes.
     - Anchor: node-box:Person
     - Change: sel=Person
     - Action: I clicked the Person checkbox and the Person entity appeared in the viewing panel.
  3. Hover over the yellow \`☰ 2 related · 0 shown ▾\` button to reveal a cascading
     menu allowing you to display entities related to this one.
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
- **Description:** While the relationship between an entity and its enumerations and raw data attributes is direct (e.g., \`MeasurementObservation.observation_type\` → \`MeasurementObservationTypeEnum\`, or \`MeasurementObservation.age_at_observation\` → \`integer\`), it can be related to other entities in more complex ways.
- **Action:** Selected MeasurementObservation for you, and highlighted its \`observation_type\` attribute.
- **Anchor:** slot-row:MeasurementObservation.observation_type
- **Change:** sel=MeasurementObservation
- **Beats:**
  1. **Inheritance**, known in modeling parlance as IS_A relationships — e.g. \`MeasurementObservation.is_a\` → \`Observation\`.
     - Anchor: node-box:MeasurementObservation
  2. **Association / ownership / containment**, known in modeling parlance as HAS_A relationships — e.g. \`Visit.associated_participant\` → \`Participant\`.
     - Anchor: node-box:MeasurementObservation
  3. A primary goal
     - Anchor: none
  4. Entities can be related to each other through
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

</details>
---
<details open>
<summary><b>Reading the diagram</b></summary>

## Reading the diagram

What the boxes and lines mean.

### graph-canvas

- **Title:** Selecting an entity
- **Tour:** Walkthrough
- **Description:** Select an entity by clicking its checkbox and it appears in the main panel. Only what you select is drawn — related entities are reached from the box's relation menu. There are five ways an entity can be related to another.
- **Action:** Added Participant and BodySite to what is already on the diagram. You would normally do this by ticking them in the tree on the left.
- **Change:** sel=BodySite~Participant
- **Beats:**
  1. Select an entity by clicking its checkbox and it appears in the main panel. Only what you select is drawn. There are five ways an entity can be related to another.
     - Anchor: selection-tree
  2. This is the entity's row in the selection panel.
     - Anchor: entity-row:Participant
  3. Clicking the checkbox is what puts it on the diagram.
     - Anchor: entity-checkbox:Participant

<!--
  TODO(siggie): your draft's step 4 says "goal is to show all the
  relationship types. if there are any entities that use all four, select
  one of those, otherwise will have to select one that has most and then
  select another that has the others." That is an instruction to yourself,
  not copy — it is NOT translated into a beat. The \`Change:\` above still
  carries the old \`sel=BodySite~Participant\`; pick the entity or entities
  that actually demonstrate all five once you have checked which do.

  Note this step now ADDS to the diagram rather than replacing it, so
  MeasurementObservation from step 3 is still drawn beside Participant and
  BodySite. The Action: says so. If the step wants a clean two-box diagram
  instead, the format has no "remove" verb — say so and it can gain one.

  Note the count: your draft says "five ways" here and you confirmed five
  is right (four ownership kinds + associations). The stale "four" note is
  gone.

  TODO(siggie): this entry kept the id \`graph-canvas\` so its help-only
  content is not orphaned, but your draft's step 4 is about the SELECTION
  panel, not the canvas. The old canvas copy is preserved as
  \`graph-canvas-reading\` below. Consider renaming this entry.
-->

### graph-canvas-reading

- **Title:** The diagram
- **Description:** Each box is an entity; each row inside it is one of that entity's attributes. Lines run from an owner to the thing it owns, so reading left to right is reading "contains".
- **Interactions:**
  - Click a box to open its details.
  - Drag a box to move it; drag the background to pan.
  - Click an attribute row that names an entity to pull that entity onto the diagram.
- **Anchor:** graph-canvas

### relation-menu

- **Title:** The relation menu
- **Description:** Every entity related to this one, grouped by how it is related. The trigger says how many there are and how many are already on the diagram; opening it branches into the five kinds of relationship, and each branch lists the entities in it.
- **Interactions:**
  - Hover **☰ N related · M shown** to open the menu, then a branch to list its entities.
  - Click an entity to put it on the diagram — which also ticks its checkbox on the left. Click it again — or its ✕ — to take it off; entities already drawn are greyed out.
  - "add all N" / "hide all N" at the top of a branch — draw or clear the whole branch at once. Both counts are shown before you click. "hide all" removes every entity in the branch, including ones you had selected yourself.
  - **ⓘ** opens an entity's details without adding it to the diagram.
- **Context:** From one entity's point of view there are five ways to be related. Four are ownership, and each names which side declares the attribute that creates it. Running *outward*: things that **belong to me by my attribute** (this entity declares the slot) and things that **belong to me by their attribute** (they declare it, pointing back here). Organization is entirely the second kind — it owns thirteen kinds of thing and declares no slot for any of them. Running *inward*, the same split: entities **I belong to, by my attribute** and entities **I belong to, by their attribute**. Fifth are **associations**, where neither entity owns the other.

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
---
<details open>
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

### example-cases

- **Title:** Example cases
- **Description:** Named selections that show particular routing and inheritance situations. Useful for seeing what the diagram does with the awkward cases.

### help-button

- **Title:** Help and tour
- **Description:** **Take the tour** for a short guided walk, or turn on **help mode** to explore at your own pace — every part of the screen with help attached gets a dot you can click.
- **Shortcut:** ?

</details>
`,wo={frames:[],counts:new Map},xo="~";function at(e,o){return e&&o.includes(e)?e:null}function vo(e){const o=new URLSearchParams(e),n={};o.has("detail")&&(n.detail=o.get("detail")||null),o.has("roots")&&(n.roots=o.get("roots")==="1"),o.has("sibs")&&(n.sibs=o.get("sibs")==="1");const a=at(o.get("dir"),["RIGHT","DOWN"]);a&&(n.dir=a);const r=at(o.get("merge"),["near","far","bend","off"]);r&&(n.merge=r);const s=o.get("sel");return{sel:s?s.split(xo).filter(Boolean):[],scalars:n}}function Ot(e,o,n){const a=new Map(e);for(const r of o){const s=(a.get(r)??0)+n;s>0?a.set(r,s):a.delete(r)}return a}function ko(e,o){return{frames:[...e.frames,o],counts:Ot(e.counts,o.sel,1)}}function So(e){const o=e.frames[e.frames.length-1];return o?{frames:e.frames.slice(0,-1),counts:Ot(e.counts,o.sel,-1)}:e}function At(e,o){const n=new Set(e.sel);for(const r of o.counts.keys())n.add(r);let a={};for(const r of o.frames)a={...a,...r.scalars};return{...e,...a,sel:[...n]}}function Pt(e,o){return{...e,sel:e.sel.filter(n=>!o.counts.has(n))}}function $t(e,o,n){const a=new Set(e.sel),r=new Set;for(const i of o.counts.keys())a.has(i)||r.add(i);for(const i of n.ticked??[])o.counts.has(i)&&r.add(i);if(r.size===0)return{state:e,stack:o};const s=new Map(o.counts);for(const i of r)s.delete(i);return{state:e,stack:{frames:o.frames.map(i=>({...i,sel:i.sel.filter(c=>!r.has(c))})),counts:s}}}function Co(){const{modelData:e,loading:o,error:n}=Gt(),a=u.useMemo(()=>e?new Ut(e):null,[e]),r=u.useMemo(()=>ve(),[]),[s,i]=u.useState(()=>new Set(r.sel)),[c,l]=u.useState(r.detail),[d,f]=u.useState(!1),[x,h]=u.useState("list"),[m,v]=u.useState(r.roots),[g,w]=u.useState(r.sibs),[b,N]=u.useState(r.dir),[j,L]=u.useState(r.merge),[O,B]=u.useState(!1),[F,W]=u.useState(!1),I=u.useCallback($=>{i(new Set($.sel)),v(!!$.roots),l(null)},[]);u.useEffect(()=>{const $=()=>{const z=ve();i(new Set(z.sel)),l(z.detail),v(z.roots),w(z.sibs),N(z.dir),L(z.merge)};return window.addEventListener("explore:state-from-url",$),()=>window.removeEventListener("explore:state-from-url",$)},[]),u.useEffect(()=>{const $={sel:[...s],detail:c,roots:m,sibs:g,dir:b,merge:j};lt($),jo($t($,te,{}).stack)},[s,c,m,g,b,j]);const G=u.useCallback($=>{i(z=>{const Y=new Set(z);return Y.has($)?Y.delete($):Y.add($),Y}),rt($)},[]),M=u.useCallback($=>{i(z=>z.has($)?z:new Set(z).add($)),rt($)},[]),A=u.useCallback($=>i(z=>{if(!z.has($))return z;const Y=new Set(z);return Y.delete($),Y}),[]),H=u.useCallback(()=>{i(new Set),l(null),f(!1),v(!1)},[]);return n?t.jsxs("div",{className:"p-8 text-red-600",children:["Failed to load model data: ",String(n)]}):o||!a?t.jsx("div",{className:"p-8 text-gray-400",children:"Loading model…"}):t.jsxs("div",{className:"relative flex flex-col h-screen bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100",children:[t.jsxs("header",{className:"flex items-center justify-between px-4 py-2 bg-blue-600 text-white shrink-0",children:[t.jsxs("div",{children:[t.jsx("h1",{"data-help-id":"app-title",className:"text-lg font-bold leading-tight cursor-pointer hover:opacity-80 transition-opacity",onClick:H,title:"Click to clear the selection and reset the view",children:"BDCHM Explorer"}),t.jsx("p",{className:"text-xs text-blue-100",children:"BioData Catalyst Harmonized Model"})]}),t.jsxs("div",{className:"flex items-center gap-4",children:[t.jsx(To,{}),t.jsx("button",{"data-help-id":"example-cases",onClick:()=>B($=>!$),className:`text-sm underline hover:text-white ${O?"text-white":"text-blue-100"}`,title:"Named selections for comparing edge routing",children:"example cases"}),t.jsx("button",{onClick:async()=>{const $=jn({sel:[...s],detail:c,roots:m,sibs:g,dir:b,merge:j});try{await navigator.clipboard.writeText($),W(!0),window.setTimeout(()=>W(!1),1500)}catch{W(!1),window.prompt("Copy this link:",$)}},"data-help-id":"copy-link",className:"text-sm underline text-blue-100 hover:text-white",title:"Copy a link that reproduces exactly this view, settings included",children:F?"✓ copied":"copy link"}),t.jsx("a",{href:"/dynamic-model-var-docs/previous.html",className:"text-sm underline text-blue-100 hover:text-white",children:"previous views"})]})]}),O&&t.jsx(Gn,{onClose:()=>B(!1),onApply:I,selectedIds:s,dataService:a}),t.jsxs("div",{className:"flex-1 flex min-h-0",children:[d?t.jsxs("button",{onClick:()=>f(!1),title:"Show entity selection",className:`shrink-0 w-8 border-r border-gray-200 dark:border-slate-700
                       bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700
                       flex flex-col items-center gap-2 py-2 text-gray-400`,children:[t.jsx("span",{className:"text-xs",children:"▶"}),t.jsxs("span",{className:"text-[10px] uppercase tracking-wider [writing-mode:vertical-rl]",children:[a.getConceptLabel("entity",!0),s.size>0?` (${s.size})`:""]})]}):t.jsxs("div",{className:"w-80 shrink-0 flex flex-col min-h-0 border-r border-gray-200 dark:border-slate-700",children:[t.jsx("div",{className:"flex-1 overflow-y-auto min-h-0","data-help-id":"selection-tree",children:x==="tree"?t.jsx(Vt,{dataService:a,selectedIds:s,onToggle:G,onShowDetail:l}):t.jsx(Kt,{dataService:a,selectedIds:s,onToggle:G})}),t.jsx("button",{onClick:()=>h($=>$==="tree"?"list":"tree"),title:"Switch between the ownership tree and the flat category list",className:`shrink-0 px-3 py-1 text-xs text-gray-400 border-t border-gray-200
                         dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 text-left`,children:x==="tree"?"☰ flat list":"⑃ tree"}),t.jsx("button",{onClick:()=>f(!0),title:"Hide entity selection",className:`shrink-0 px-3 py-1 text-xs text-gray-400 border-t border-gray-200
                         dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 text-left`,children:"◀ Hide"})]}),t.jsx("div",{className:"flex-1 min-w-0","data-help-id":"graph-canvas",children:s.size===0?t.jsx("div",{className:"h-full flex items-center justify-center text-sm text-gray-400 p-8",children:"Select entities on the left to build the ownership subgraph."}):t.jsx(_n,{dataService:a,selectedIds:s,onNodeClick:l,onAdd:M,onRemove:A,pathToRoot:m,onTogglePathToRoot:()=>v($=>!$),direction:b,setDirection:N,mergeMode:j,setMergeMode:L,mergeSibs:g,setMergeSibs:w})}),c&&t.jsx(Bn,{classId:c,dataService:a,onClose:()=>l(null),onNavigate:l,isSelected:s.has(c),onToggleSelect:G})]})]})}let te=wo;function jo(e){te=e}function rt(e){te=$t(ve(),te,{ticked:[e]}).stack}function Rt(e){lt(e),window.dispatchEvent(new Event("explore:state-from-url"))}function No(e){const o=Pt(ve(),te);te=ko(te,vo(e)),Rt(At(o,te))}function Eo(){const e=Pt(ve(),te);te=So(te),Rt(At(e,te))}function Mo(){return t.jsxs(oo,{markdown:bo,onPushChange:No,onPopChange:Eo,resolvers:yo,children:[t.jsx(Co,{}),t.jsx(ho,{})]})}function To(){const{helpMode:e,toggleHelpMode:o,startTour:n}=Nt();return t.jsxs("span",{className:"flex items-center gap-2","data-help-id":"help-button",children:[t.jsx("button",{onClick:n,className:"text-sm font-semibold px-2.5 py-1 rounded-full bg-white/95 text-blue-700 shadow-sm hover:bg-white hover:shadow",title:"A short guided walk through the app",children:"take the tour"}),Ct]})}qt.createRoot(document.getElementById("root")).render(t.jsx(u.StrictMode,{children:t.jsx(Mo,{})}));
