import{i as tr,p as Cl,r as p,j as d,R as He,a as Al,g as Pl,E as xe,b as nr,c as sr,S as El,d as Ml,e as Dl,s as jl,w as Rl,f as Ol,h as Nl,m as Ll,k as Vl,l as Il,M as Wt,u as Bl,D as $l,n as Fl}from"./index-DImzdRxU.js";function ir(e){return[...new Set([...e.classIds,...e.pins])]}const _l=e=>`entity-row:${e}`,Hl=e=>`entity-checkbox:${e}`,Wl=e=>`category-row:${e}`,zl=e=>`node-box:${e}`,Ul=e=>`child-header:${e}`,Gl=(e,t)=>`slot-row:${e}.${t}`,or=e=>tr(e.id)?Cl(e.id):e.id,Kl=e=>zl(or(e)),Ql=(e,t)=>Gl(t.declaringClass??or(e),t.slot);function ql({dataService:e,selectedIds:t,onToggle:n,onShowCategory:s}){const i=p.useMemo(()=>e.getCategoryTrees(),[e]),[r,o]=p.useState(new Set),a=l=>o(h=>{const f=new Set(h);return f.has(l)?f.delete(l):f.add(l),f}),c=i.reduce((l,h)=>l+h.classIds.length,0);return d.jsxs("div",{className:"text-sm",children:[d.jsx("div",{className:"flex items-baseline gap-2 px-3 py-2 border-b border-gray-200 dark:border-slate-700",children:d.jsxs("span",{className:"font-semibold flex-1",children:[e.getConceptLabel("entity",!0)," (",c,")"]})}),i.map(l=>{const h=r.has(l.id),f=l.classIds.filter(u=>t.has(u)).length;return d.jsxs("div",{children:[d.jsxs("div",{"data-help-id":Wl(l.id),className:`w-full flex items-stretch font-medium
                         bg-gray-50 dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700`,children:[d.jsxs("button",{type:"button",onClick:()=>a(l.id),className:`flex-1 min-w-0 flex items-center gap-2 px-3 py-1.5 text-left
                           hover:bg-gray-100 dark:hover:bg-slate-700`,children:[d.jsx("span",{className:"text-xs text-gray-400",children:h?"▶":"▼"}),d.jsx("span",{className:"flex-1 truncate",children:l.label}),f>0&&d.jsxs("span",{className:"text-xs text-gray-400",children:[f," / ",l.classIds.length]})]}),s&&d.jsx("button",{type:"button","data-show-category":l.id,title:`Draw the ${l.label} content view — replaces the canvas`,onClick:()=>s(ir(l)),className:`px-2.5 shrink-0 text-gray-400 border-l border-gray-100
                             dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700
                             hover:text-blue-600 dark:hover:text-sky-400`,children:"⊞"})]}),!h&&l.roots.map(u=>d.jsx(rr,{node:u,depth:0,selectedIds:t,onToggle:n},u.classId))]},l.id)})]})}function rr({node:e,depth:t,selectedIds:n,onToggle:s}){const{classId:i}=e;return d.jsxs(d.Fragment,{children:[d.jsxs("label",{"data-class-row":i,"data-help-id":_l(i),className:`flex items-center gap-2 pr-3 py-1 cursor-pointer
                    hover:bg-blue-50 dark:hover:bg-slate-800
                    ${n.has(i)?"bg-blue-50 dark:bg-slate-800":""}`,style:{paddingLeft:`${.75+t*1}rem`},children:[d.jsx("input",{type:"checkbox","data-help-id":Hl(i),checked:n.has(i),onChange:()=>s(i)}),d.jsxs("span",{className:"flex-1 min-w-0 truncate",children:[d.jsx("span",{className:"font-mono text-xs",children:i}),e.outOfCategoryParent&&d.jsxs("span",{className:"ml-1 text-[10px] text-gray-400 dark:text-slate-500",title:`Extends ${e.outOfCategoryParent}, which is in another category`,children:["↳ ",e.outOfCategoryParent]})]})]}),e.children.map(r=>d.jsx(rr,{node:r,depth:t+1,selectedIds:n,onToggle:s},r.classId))]})}function Xl({dataService:e,selectedIds:t,onToggle:n,onShowDetail:s}){const i=p.useMemo(()=>e.getContainmentNodes(),[e]),r=p.useMemo(()=>e.getEntityColumns(),[e]),o=p.useMemo(()=>{const a=new Map;for(const c of i){const l=e.getRangeCountsByType(c.id);a.set(c.id,{props:e.getSlotCount(c.id),cls:l.cls,vars:e.getVariableCount(c.id)})}return a},[i,e]);return d.jsxs("div",{className:"text-sm selection-tree",children:[d.jsxs("div",{className:"flex items-baseline gap-2 px-3 py-2 border-b border-gray-200 dark:border-slate-700",children:[d.jsxs("span",{className:"font-semibold flex-1",children:[e.getConceptLabel("entity",!0)," (",i.length,")"]}),d.jsxs("span",{className:"flex items-center gap-1 text-[10px] uppercase tracking-wide shrink-0",children:[d.jsx("span",{className:"text-gray-500",title:r.props.tip,children:r.props.header}),d.jsx("span",{style:{color:He.entity},title:r.cls.tip,children:r.cls.header}),d.jsx("span",{style:{color:He.variable},title:r.vars.tip,children:r.vars.header})]})]}),d.jsx(Al,{nodes:i,selected:[...t],levelsExpanded:0,renderRow:({node:a,isSelected:c})=>{const l=o.get(a.id);return d.jsxs("span",{className:`flex items-center gap-2 flex-1 min-w-0 px-1 rounded
                          ${c?"bg-blue-100 dark:bg-sky-900/50":""}`,children:[d.jsx("input",{type:"checkbox",checked:c,title:`${c?"Remove":"Add"} ${a.id} ${c?"from":"to"} the canvas`,onClick:h=>h.stopPropagation(),onChange:h=>{h.stopPropagation(),n(a.id)}}),d.jsx("button",{type:"button",title:`Show details for ${a.id}`,onClick:h=>{h.stopPropagation(),s?.(a.id)},className:`font-mono text-xs flex-1 min-w-0 truncate text-left
                            hover:underline ${c?"font-semibold":""}`,children:a.name??a.id}),l&&d.jsxs("span",{className:"flex items-center gap-1 shrink-0 tabular-nums",children:[d.jsx(On,{n:l.props,title:r.props.tip,className:"text-gray-500"}),d.jsx(On,{n:l.cls,title:r.cls.tip,color:He.entity}),d.jsx(On,{n:l.vars,title:r.vars.tip,color:He.variable})]})]})}})]})}function On({n:e,title:t,className:n,color:s}){const i=e===0;return d.jsx("span",{title:t,"data-count-badge":"",className:`w-5 text-right text-[11px] ${i?"text-gray-300 dark:text-slate-600":n??""}`,style:!i&&s?{color:s}:void 0,children:i?"·":e})}const Bs=p.createContext({});function $s(e){const t=p.useRef(null);return t.current===null&&(t.current=e()),t.current}const Yl=typeof window<"u",un=Yl?p.useLayoutEffect:p.useEffect,kn=p.createContext(null);function Fs(e,t){e.indexOf(t)===-1&&e.push(t)}function fn(e,t){const n=e.indexOf(t);n>-1&&e.splice(n,1)}const $e=(e,t,n)=>n>t?t:n<e?e:n;let Tn=()=>{};const Ge={},ar=e=>/^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(e),lr=e=>typeof e=="object"&&e!==null,cr=e=>/^0[^.\s]+$/u.test(e);function dr(e){let t;return()=>(t===void 0&&(t=e()),t)}const Me=e=>e,Lt=(...e)=>e.reduce((t,n)=>s=>n(t(s))),jt=(e,t,n)=>{const s=t-e;return s?(n-e)/s:1};class _s{constructor(){this.subscriptions=[]}add(t){return Fs(this.subscriptions,t),()=>fn(this.subscriptions,t)}notify(t,n,s){const i=this.subscriptions.length;if(i)if(i===1)this.subscriptions[0](t,n,s);else for(let r=0;r<i;r++){const o=this.subscriptions[r];o&&o(t,n,s)}}getSize(){return this.subscriptions.length}clear(){this.subscriptions.length=0}}const De=e=>e*1e3,Ee=e=>e/1e3,hr=(e,t)=>t?e*(1e3/t):0,ur=(e,t,n)=>(((1-3*n+3*t)*e+(3*n-6*t))*e+3*t)*e,Zl=1e-7,Jl=12;function ec(e,t,n,s,i){let r,o,a=0;do o=t+(n-t)/2,r=ur(o,s,i)-e,r>0?n=o:t=o;while(Math.abs(r)>Zl&&++a<Jl);return o}function Vt(e,t,n,s){if(e===t&&n===s)return Me;const i=r=>ec(r,0,1,e,n);return r=>r===0||r===1?r:ur(i(r),t,s)}const fr=e=>t=>t<=.5?e(2*t)/2:(2-e(2*(1-t)))/2,pr=e=>t=>1-e(1-t),mr=Vt(.33,1.53,.69,.99),Hs=pr(mr),gr=fr(Hs),yr=e=>e>=1?1:(e*=2)<1?.5*Hs(e):.5*(2-Math.pow(2,-10*(e-1))),Ws=e=>1-Math.sin(Math.acos(e)),wr=pr(Ws),xr=fr(Ws),tc=Vt(.42,0,1,1),nc=Vt(0,0,.58,1),br=Vt(.42,0,.58,1),sc=e=>Array.isArray(e)&&typeof e[0]!="number",vr=e=>Array.isArray(e)&&typeof e[0]=="number",ic={linear:Me,easeIn:tc,easeInOut:br,easeOut:nc,circIn:Ws,circInOut:xr,circOut:wr,backIn:Hs,backInOut:gr,backOut:mr,anticipate:yr},oc=e=>typeof e=="string",Ti=e=>{if(vr(e)){Tn(e.length===4);const[t,n,s,i]=e;return Vt(t,n,s,i)}else if(oc(e))return ic[e];return e},zt=["setup","read","resolveKeyframes","preUpdate","update","preRender","render","postRender"];function rc(e){let t=new Set,n=new Set,s=!1,i=!1;const r=new WeakSet;let o={delta:0,timestamp:0,isProcessing:!1};function a(l){r.has(l)&&(c.schedule(l),e()),l(o)}const c={schedule:(l,h=!1,f=!1)=>{const w=f&&s?t:n;return h&&r.add(l),w.add(l),l},cancel:l=>{n.delete(l),r.delete(l)},process:l=>{if(o=l,s){i=!0;return}s=!0;const h=t;t=n,n=h,t.forEach(a),t.clear(),s=!1,i&&(i=!1,c.process(l))}};return c}const ac=40;function kr(e,t){let n=!1,s=!0;const i={delta:0,timestamp:0,isProcessing:!1},r=()=>n=!0,o=zt.reduce((v,b)=>(v[b]=rc(r),v),{}),{setup:a,read:c,resolveKeyframes:l,preUpdate:h,update:f,preRender:u,render:w,postRender:g}=o,m=()=>{const v=Ge.useManualTiming,b=v?i.timestamp:performance.now();n=!1,v||(i.delta=s?1e3/60:Math.max(Math.min(b-i.timestamp,ac),1)),i.timestamp=b,i.isProcessing=!0,a.process(i),c.process(i),l.process(i),h.process(i),f.process(i),u.process(i),w.process(i),g.process(i),i.isProcessing=!1,n&&t&&(s=!1,e(m))},y=()=>{n=!0,s=!0,i.isProcessing||e(m)};return{schedule:zt.reduce((v,b)=>{const C=o[b];return v[b]=(P,S=!1,M=!1)=>(n||y(),C.schedule(P,S,M)),v},{}),cancel:v=>{for(let b=0;b<zt.length;b++)o[zt[b]].cancel(v)},state:i,steps:o}}const{schedule:ne,cancel:Ke,state:fe,steps:Nn}=kr(typeof requestAnimationFrame<"u"?requestAnimationFrame:Me,!0);let nn;function lc(){nn=void 0}const ye={now:()=>(nn===void 0&&ye.set(fe.isProcessing||Ge.useManualTiming?fe.timestamp:performance.now()),nn),set:e=>{nn=e,queueMicrotask(lc)}},Tr=e=>t=>typeof t=="string"&&t.startsWith(e),Sr=Tr("--"),cc=Tr("var(--"),zs=e=>cc(e)?dc.test(e.split("/*")[0].trim()):!1,dc=/var\(--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)$/iu;function Si(e){return typeof e!="string"?!1:e.split("/*")[0].includes("var(--")}const pt={test:e=>typeof e=="number",parse:parseFloat,transform:e=>e},Rt={...pt,transform:e=>$e(0,1,e)},Ut={...pt,default:1},St=e=>Math.round(e*1e5)/1e5,Us=/-?(?:\d+(?:\.\d+)?|\.\d+)/gu;function hc(e){return e==null}const uc=/^(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))$/iu,Gs=(e,t)=>n=>!!(typeof n=="string"&&uc.test(n)&&n.startsWith(e)||t&&!hc(n)&&Object.prototype.hasOwnProperty.call(n,t)),Cr=(e,t,n)=>s=>{if(typeof s!="string")return s;const[i,r,o,a]=s.match(Us);return{[e]:parseFloat(i),[t]:parseFloat(r),[n]:parseFloat(o),alpha:a!==void 0?parseFloat(a):1}},fc=e=>$e(0,255,e),Ln={...pt,transform:e=>Math.round(fc(e))},Ze={test:Gs("rgb","red"),parse:Cr("red","green","blue"),transform:({red:e,green:t,blue:n,alpha:s=1})=>"rgba("+Ln.transform(e)+", "+Ln.transform(t)+", "+Ln.transform(n)+", "+St(Rt.transform(s))+")"};function pc(e){let t="",n="",s="",i="";return e.length>5?(t=e.substring(1,3),n=e.substring(3,5),s=e.substring(5,7),i=e.substring(7,9)):(t=e.substring(1,2),n=e.substring(2,3),s=e.substring(3,4),i=e.substring(4,5),t+=t,n+=n,s+=s,i+=i),{red:parseInt(t,16),green:parseInt(n,16),blue:parseInt(s,16),alpha:i?parseInt(i,16)/255:1}}const as={test:Gs("#"),parse:pc,transform:Ze.transform},It=e=>({test:t=>typeof t=="string"&&t.endsWith(e)&&t.split(" ").length===1,parse:parseFloat,transform:t=>`${t}${e}`}),_e=It("deg"),Be=It("%"),O=It("px"),mc=It("vh"),gc=It("vw"),Ci={...Be,parse:e=>Be.parse(e)/100,transform:e=>Be.transform(e*100)},ct={test:Gs("hsl","hue"),parse:Cr("hue","saturation","lightness"),transform:({hue:e,saturation:t,lightness:n,alpha:s=1})=>"hsla("+Math.round(e)+", "+Be.transform(St(t))+", "+Be.transform(St(n))+", "+St(Rt.transform(s))+")"},ae={test:e=>Ze.test(e)||as.test(e)||ct.test(e),parse:e=>Ze.test(e)?Ze.parse(e):ct.test(e)?ct.parse(e):as.parse(e),transform:e=>typeof e=="string"?e:e.hasOwnProperty("red")?Ze.transform(e):ct.transform(e),getAnimatableNone:e=>{const t=ae.parse(e);return t.alpha=0,ae.transform(t)}},yc=/(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))/giu;function wc(e){return isNaN(e)&&typeof e=="string"&&(e.match(Us)?.length||0)+(e.match(yc)?.length||0)>0}const Ar="number",Pr="color",xc="var",bc="var(",Ai="${}",vc=/var\s*\(\s*--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)|#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\)|-?(?:\d+(?:\.\d+)?|\.\d+)/giu;function ut(e){const t=e.toString(),n=[],s={color:[],number:[],var:[]},i=[];let r=0;const a=t.replace(vc,c=>(ae.test(c)?(s.color.push(r),i.push(Pr),n.push(ae.parse(c))):c.startsWith(bc)?(s.var.push(r),i.push(xc),n.push(c)):(s.number.push(r),i.push(Ar),n.push(parseFloat(c))),++r,Ai)).split(Ai);return{values:n,split:a,indexes:s,types:i}}function kc(e){return ut(e).values}function Er({split:e,types:t}){const n=e.length;return s=>{let i="";for(let r=0;r<n;r++)if(i+=e[r],s[r]!==void 0){const o=t[r];o===Ar?i+=St(s[r]):o===Pr?i+=ae.transform(s[r]):i+=s[r]}return i}}function Tc(e){return Er(ut(e))}const Sc=e=>typeof e=="number"?0:ae.test(e)?ae.getAnimatableNone(e):e,Cc=(e,t)=>typeof e=="number"?t?.trim().endsWith("/")?e:0:Sc(e);function Ac(e){const t=ut(e);return Er(t)(t.values.map((s,i)=>Cc(s,t.split[i])))}const Ne={test:wc,parse:kc,createTransformer:Tc,getAnimatableNone:Ac};function Vn(e,t,n){return n<0&&(n+=1),n>1&&(n-=1),n<1/6?e+(t-e)*6*n:n<1/2?t:n<2/3?e+(t-e)*(2/3-n)*6:e}function Pc({hue:e,saturation:t,lightness:n,alpha:s}){e/=360,t/=100,n/=100;let i=0,r=0,o=0;if(!t)i=r=o=n;else{const a=n<.5?n*(1+t):n+t-n*t,c=2*n-a;i=Vn(c,a,e+1/3),r=Vn(c,a,e),o=Vn(c,a,e-1/3)}return{red:Math.round(i*255),green:Math.round(r*255),blue:Math.round(o*255),alpha:s}}function pn(e,t){return n=>n>0?t:e}const te=(e,t,n)=>e+(t-e)*n,In=(e,t,n)=>{const s=e*e,i=n*(t*t-s)+s;return i<0?0:Math.sqrt(i)},Ec=[as,Ze,ct],Mc=e=>Ec.find(t=>t.test(e));function Pi(e){const t=Mc(e);if(!t)return!1;let n=t.parse(e);return t===ct&&(n=Pc(n)),n}const Ei=(e,t)=>{const n=Pi(e),s=Pi(t);if(!n||!s)return pn(e,t);const i={...n};return r=>(i.red=In(n.red,s.red,r),i.green=In(n.green,s.green,r),i.blue=In(n.blue,s.blue,r),i.alpha=te(n.alpha,s.alpha,r),Ze.transform(i))},ls=new Set(["none","hidden"]);function Dc(e,t){return ls.has(e)?n=>n<=0?e:t:n=>n>=1?t:e}function jc(e,t){return n=>te(e,t,n)}function Ks(e){return typeof e=="number"?jc:typeof e=="string"?zs(e)?pn:ae.test(e)?Ei:Nc:Array.isArray(e)?Mr:typeof e=="object"?ae.test(e)?Ei:Rc:pn}function Mr(e,t){const n=[...e],s=n.length,i=e.map((r,o)=>Ks(r)(r,t[o]));return r=>{for(let o=0;o<s;o++)n[o]=i[o](r);return n}}function Rc(e,t){const n={...e,...t},s={};for(const i in n)e[i]!==void 0&&t[i]!==void 0&&(s[i]=Ks(e[i])(e[i],t[i]));return i=>{for(const r in s)n[r]=s[r](i);return n}}function Oc(e,t){const n=[],s={color:0,var:0,number:0};for(let i=0;i<t.values.length;i++){const r=t.types[i],o=e.indexes[r][s[r]],a=e.values[o]??0;n[i]=a,s[r]++}return n}const Nc=(e,t)=>{const n=Ne.createTransformer(t),s=ut(e),i=ut(t);return s.indexes.var.length===i.indexes.var.length&&s.indexes.color.length===i.indexes.color.length&&s.indexes.number.length>=i.indexes.number.length?ls.has(e)&&!i.values.length||ls.has(t)&&!s.values.length?Dc(e,t):Lt(Mr(Oc(s,i),i.values),n):pn(e,t)};function Dr(e,t,n){return typeof e=="number"&&typeof t=="number"&&typeof n=="number"?te(e,t,n):Ks(e)(e,t)}const Lc=e=>{const t=({timestamp:n})=>e(n);return{start:(n=!0)=>ne.update(t,n),stop:()=>Ke(t),now:()=>fe.isProcessing?fe.timestamp:ye.now()}},jr=(e,t,n=10)=>{let s="";const i=Math.max(Math.round(t/n),2);for(let r=0;r<i;r++)s+=Math.round(e(r/(i-1))*1e4)/1e4+", ";return`linear(${s.substring(0,s.length-2)})`},Qs=2e4;function qs(e,t=50,n=Qs,s){let i=0,r=e.next(i);for(;!r.done&&i<n;)i+=t,r=e.next(i);return i>=n?1/0:i}function Vc(e,t=100,n){const s=n({...e,keyframes:[0,t]}),i=Math.min(qs(s),Qs);return{type:"keyframes",ease:r=>s.next(i*r).value/t,duration:Ee(i)}}const oe={stiffness:100,damping:10,mass:1,velocity:0,duration:800,bounce:.3,visualDuration:.3,restSpeed:{granular:.01,default:2},restDelta:{granular:.005,default:.5},minDuration:.01,maxDuration:10,minDamping:.05,maxDamping:1};function cs(e,t){return e*Math.sqrt(1-t*t)}const Ic=12;function Bc(e,t,n){let s=n;for(let i=1;i<Ic;i++)s=s-e(s)/t(s);return s}const Bn=.001;function $c({duration:e=oe.duration,bounce:t=oe.bounce,velocity:n=oe.velocity,mass:s=oe.mass}){let i,r,o=1-t;o=$e(oe.minDamping,oe.maxDamping,o),e=$e(oe.minDuration,oe.maxDuration,Ee(e)),o<1?(i=l=>{const h=l*o,f=h*e,u=h-n,w=cs(l,o),g=Math.exp(-f);return Bn-u/w*g},r=l=>{const f=l*o*e,u=f*n+n,w=o*o*l*l*e,g=Math.exp(-f),m=cs(l*l,o);return(-i(l)+Bn>0?-1:1)*((u-w)*g)/m}):(i=l=>{const h=Math.exp(-l*e),f=(l-n)*e+1;return-Bn+h*f},r=l=>{const h=Math.exp(-l*e),f=(n-l)*(e*e);return h*f});const a=5/e,c=Bc(i,r,a);if(e=De(e),isNaN(c))return{stiffness:oe.stiffness,damping:oe.damping,duration:e};{const l=c*c*s;return{stiffness:l,damping:o*2*Math.sqrt(s*l),duration:e}}}const Fc=["duration","bounce"],_c=["stiffness","damping","mass"];function Mi(e,t){return t.some(n=>e[n]!==void 0)}function Hc(e){let t={velocity:oe.velocity,stiffness:oe.stiffness,damping:oe.damping,mass:oe.mass,isResolvedFromDuration:!1,...e};if(!Mi(e,_c)&&Mi(e,Fc))if(t.velocity=0,e.visualDuration){const n=e.visualDuration,s=2*Math.PI/(n*1.2),i=s*s,r=2*$e(.05,1,1-(e.bounce||0))*Math.sqrt(i);t={...t,mass:oe.mass,stiffness:i,damping:r}}else{const n=$c({...e,velocity:0});t={...t,...n,mass:oe.mass},t.isResolvedFromDuration=!0}return t}function mn(e=oe.visualDuration,t=oe.bounce){const n=typeof e!="object"?{visualDuration:e,keyframes:[0,1],bounce:t}:e;let{restSpeed:s,restDelta:i}=n;const r=n.keyframes[0],o=n.keyframes[n.keyframes.length-1],a={done:!1,value:r},{stiffness:c,damping:l,mass:h,duration:f,velocity:u,isResolvedFromDuration:w}=Hc({...n,velocity:-Ee(n.velocity||0)}),g=u||0,m=l/(2*Math.sqrt(c*h)),y=o-r,x=Ee(Math.sqrt(c/h)),T=m*x,v=Math.abs(y)<5;s||(s=v?oe.restSpeed.granular:oe.restSpeed.default),i||(i=v?oe.restDelta.granular:oe.restDelta.default);let b,C;if(m<1){const S=cs(x,m),M=(g+T*y)/S,N=T*M+y*S,H=T*y-M*S;let F=-1,G=0,R=0;const I=q=>{if(q!==F){F=q;const X=Math.exp(-T*q),le=Math.sin(S*q),K=Math.cos(S*q);G=o-X*(M*le+y*K),R=X*(N*le+H*K)}};b=q=>(I(q),G),C=q=>(I(q),R)}else if(m===1){b=M=>o-Math.exp(-x*M)*(y+(g+x*y)*M);const S=g+x*y;C=M=>Math.exp(-x*M)*(x*S*M-g)}else{const S=x*Math.sqrt(m*m-1);b=F=>{const G=Math.exp(-T*F),R=Math.min(S*F,300);return o-G*((g+T*y)*Math.sinh(R)+S*y*Math.cosh(R))/S};const M=(g+T*y)/S,N=T*M-y*S,H=T*y-M*S;C=F=>{const G=Math.exp(-T*F),R=Math.min(S*F,300);return G*(N*Math.sinh(R)+H*Math.cosh(R))}}const P={calculatedDuration:w&&f||null,velocity:S=>De(C(S)),next:S=>{const M=b(S);if(w)a.done=S>=f;else{const N=De(C(S));a.done=Math.abs(N)<=s&&Math.abs(o-M)<=i}return a.value=a.done?o:M,a},toString:()=>{const S=Math.min(qs(P),Qs),M=jr(N=>P.next(S*N).value,S,30);return S+"ms "+M},toTransition:()=>{}};return P}mn.applyToOptions=e=>{const t=Vc(e,100,mn);return e.ease=t.ease,e.duration=De(t.duration),e.type="keyframes",e};function ds({keyframes:e,velocity:t=0,power:n=.8,timeConstant:s=325,bounceDamping:i=10,bounceStiffness:r=500,modifyTarget:o,min:a,max:c,restDelta:l=.5,restSpeed:h}){const f=e[0],u={done:!1,value:f},w=S=>S<a||S>c,g=S=>a===void 0?c:c===void 0||Math.abs(a-S)<Math.abs(c-S)?a:c;let m=n*t;const y=f+m,x=o===void 0?y:o(y);x!==y&&(m=x-f);const T=S=>-m*Math.exp(-S/s),v=S=>{const M=T(S);u.done=Math.abs(M)<=l,u.value=u.done?x:x+M};let b,C;const P=S=>{w(u.value)&&(b=S,C=mn({keyframes:[u.value,g(u.value)],velocity:-T(S)/s*1e3,damping:i,stiffness:r,restDelta:l,restSpeed:h}))};return P(0),{calculatedDuration:null,next:S=>{let M=!1;return!C&&b===void 0&&(M=!0,v(S),P(S)),b!==void 0&&S>=b?C.next(S-b):(!M&&v(S),u)}}}function Wc(e,t,n){const s=[],i=n||Ge.mix||Dr,r=e.length-1;for(let o=0;o<r;o++){let a=i(e[o],e[o+1]);if(t){const c=Array.isArray(t)?t[o]||Me:t;a=Lt(c,a)}s.push(a)}return s}function zc(e,t,{clamp:n=!0,ease:s,mixer:i}={}){const r=e.length;if(Tn(r===t.length),r===1)return()=>t[0];if(r===2&&t[0]===t[1])return()=>t[1];const o=e[0]===e[1];e[0]>e[r-1]&&(e=[...e].reverse(),t=[...t].reverse());const a=Wc(t,s,i),c=a.length,l=h=>{if(o&&h<e[0])return t[0];let f=0;if(c>1)for(;f<e.length-2&&!(h<e[f+1]);f++);const u=jt(e[f],e[f+1],h);return a[f](u)};return n?h=>l($e(e[0],e[r-1],h)):l}function Uc(e,t){const n=e[e.length-1];for(let s=1;s<=t;s++){const i=jt(0,t,s);e.push(te(n,1,i))}}function Gc(e){const t=[0];return Uc(t,e.length-1),t}function Kc(e,t){return e.map(n=>n*t)}function Qc(e,t){return e.map(()=>t||br).splice(0,e.length-1)}function Ct({duration:e=300,keyframes:t,times:n,ease:s="easeInOut"}){const i=sc(s)?s.map(Ti):Ti(s),r={done:!1,value:t[0]},o=Kc(n&&n.length===t.length?n:Gc(t),e),a=zc(o,t,{ease:Array.isArray(i)?i:Qc(t,i)});return{calculatedDuration:e,next:c=>(r.value=a(c),r.done=c>=e,r)}}const qc=5;function Xc(e,t,n){const s=Math.max(t-qc,0);return hr(n-e(s),t-s)}const Yc=e=>e!==null;function Sn(e,{repeat:t,repeatType:n="loop"},s,i=1){const r=e.filter(Yc),a=i<0||t&&n!=="loop"&&t%2===1?0:r.length-1;return!a||s===void 0?r[a]:s}const Zc={decay:ds,inertia:ds,tween:Ct,keyframes:Ct,spring:mn};function Rr(e){typeof e.type=="string"&&(e.type=Zc[e.type])}class Xs{constructor(){this.updateFinished()}get finished(){return this._finished}updateFinished(){this._finished=new Promise(t=>{this.resolve=t})}notifyFinished(){this.resolve()}then(t,n){return this.finished.then(t,n)}}const Jc=e=>e/100;class gn extends Xs{constructor(t){super(),this.state="idle",this.startTime=null,this.isStopped=!1,this.currentTime=0,this.holdTime=null,this.playbackSpeed=1,this.delayState={done:!1,value:void 0},this.stop=()=>{const{motionValue:n}=this.options;n&&n.updatedAt!==ye.now()&&this.tick(ye.now()),this.isStopped=!0,this.state!=="idle"&&(this.teardown(),this.options.onStop?.())},this.options=t,this.initAnimation(),this.play(),t.autoplay===!1&&this.pause()}initAnimation(){const{options:t}=this;Rr(t);const{type:n=Ct,repeat:s=0,repeatDelay:i=0,repeatType:r,velocity:o=0}=t;let{keyframes:a}=t;const c=n||Ct;c!==Ct&&typeof a[0]!="number"&&(this.mixKeyframes=Lt(Jc,Dr(a[0],a[1])),a=[0,100]);const l=c({...t,keyframes:a});r==="mirror"&&(this.mirroredGenerator=c({...t,keyframes:[...a].reverse(),velocity:-o})),l.calculatedDuration===null&&(l.calculatedDuration=qs(l));const{calculatedDuration:h}=l;this.calculatedDuration=h,this.resolvedDuration=h+i,this.totalDuration=this.resolvedDuration*(s+1)-i,this.generator=l}updateTime(t){const n=Math.round(t-this.startTime)*this.playbackSpeed;this.holdTime!==null?this.currentTime=this.holdTime:this.currentTime=n}tick(t,n=!1){const{generator:s,totalDuration:i,mixKeyframes:r,mirroredGenerator:o,resolvedDuration:a,calculatedDuration:c}=this;if(this.startTime===null)return s.next(0);const{delay:l=0,keyframes:h,repeat:f,repeatType:u,repeatDelay:w,type:g,onUpdate:m,finalKeyframe:y}=this.options;this.speed>0?this.startTime=Math.min(this.startTime,t):this.speed<0&&(this.startTime=Math.min(t-i/this.speed,this.startTime)),n?this.currentTime=t:this.updateTime(t);const x=this.currentTime-l*(this.playbackSpeed>=0?1:-1),T=this.playbackSpeed>=0?x<0:x>i;this.currentTime=Math.max(x,0),this.state==="finished"&&this.holdTime===null&&(this.currentTime=i);let v=this.currentTime,b=s;if(f){const M=Math.min(this.currentTime,i)/a;let N=Math.floor(M),H=M%1;!H&&M>=1&&(H=1),H===1&&N--,N=Math.min(N,f+1),N%2&&(u==="reverse"?(H=1-H,w&&(H-=w/a)):u==="mirror"&&(b=o)),v=$e(0,1,H)*a}let C;T?(this.delayState.value=h[0],C=this.delayState):C=b.next(v),r&&!T&&(C.value=r(C.value));let{done:P}=C;!T&&c!==null&&(P=this.playbackSpeed>=0?this.currentTime>=i:this.currentTime<=0);const S=this.holdTime===null&&(this.state==="finished"||this.state==="running"&&P);return S&&g!==ds&&(C.value=Sn(h,this.options,y,this.speed)),m&&m(C.value),S&&this.finish(),C}then(t,n){return this.finished.then(t,n)}get duration(){return Ee(this.calculatedDuration)}get iterationDuration(){const{delay:t=0}=this.options||{};return this.duration+Ee(t)}get time(){return Ee(this.currentTime)}set time(t){t=De(t),this.currentTime=t,this.startTime===null||this.holdTime!==null||this.playbackSpeed===0?this.holdTime=t:this.driver&&(this.startTime=this.driver.now()-t/this.playbackSpeed),this.driver?this.driver.start(!1):(this.startTime=0,this.state="paused",this.holdTime=t,this.tick(t))}getGeneratorVelocity(){const t=this.currentTime;if(t<=0)return this.options.velocity||0;if(this.generator.velocity)return this.generator.velocity(t);const n=this.generator.next(t).value;return Xc(s=>this.generator.next(s).value,t,n)}get speed(){return this.playbackSpeed}set speed(t){const n=this.playbackSpeed!==t;n&&this.driver&&this.updateTime(ye.now()),this.playbackSpeed=t,n&&this.driver&&(this.time=Ee(this.currentTime))}play(){if(this.isStopped)return;const{driver:t=Lc,startTime:n}=this.options;this.driver||(this.driver=t(i=>this.tick(i))),this.options.onPlay?.();const s=this.driver.now();this.state==="finished"?(this.updateFinished(),this.startTime=s):this.holdTime!==null?this.startTime=s-this.holdTime:this.startTime||(this.startTime=n??s),this.state==="finished"&&this.speed<0&&(this.startTime+=this.calculatedDuration),this.holdTime=null,this.state="running",this.driver.start()}pause(){this.state="paused",this.updateTime(ye.now()),this.holdTime=this.currentTime}complete(){this.state!=="running"&&this.play(),this.state="finished",this.holdTime=null}finish(){this.notifyFinished(),this.teardown(),this.state="finished",this.options.onComplete?.()}cancel(){this.holdTime=null,this.startTime=0,this.tick(0),this.teardown(),this.options.onCancel?.()}teardown(){this.state="idle",this.stopDriver(),this.startTime=this.holdTime=null}stopDriver(){this.driver&&(this.driver.stop(),this.driver=void 0)}sample(t){return this.startTime=0,this.tick(t,!0)}attachTimeline(t){return this.options.allowFlatten&&(this.options.type="keyframes",this.options.ease="linear",this.initAnimation()),this.driver?.stop(),t.observe(this)}}function ed(e){for(let t=1;t<e.length;t++)e[t]??(e[t]=e[t-1])}const Je=e=>e*180/Math.PI,hs=e=>{const t=Je(Math.atan2(e[1],e[0]));return us(t)},td={x:4,y:5,translateX:4,translateY:5,scaleX:0,scaleY:3,scale:e=>(Math.abs(e[0])+Math.abs(e[3]))/2,rotate:hs,rotateZ:hs,skewX:e=>Je(Math.atan(e[1])),skewY:e=>Je(Math.atan(e[2])),skew:e=>(Math.abs(e[1])+Math.abs(e[2]))/2},us=e=>(e=e%360,e<0&&(e+=360),e),Di=hs,ji=e=>Math.sqrt(e[0]*e[0]+e[1]*e[1]),Ri=e=>Math.sqrt(e[4]*e[4]+e[5]*e[5]),nd={x:12,y:13,z:14,translateX:12,translateY:13,translateZ:14,scaleX:ji,scaleY:Ri,scale:e=>(ji(e)+Ri(e))/2,rotateX:e=>us(Je(Math.atan2(e[6],e[5]))),rotateY:e=>us(Je(Math.atan2(-e[2],e[0]))),rotateZ:Di,rotate:Di,skewX:e=>Je(Math.atan(e[4])),skewY:e=>Je(Math.atan(e[1])),skew:e=>(Math.abs(e[1])+Math.abs(e[4]))/2};function fs(e){return e.includes("scale")?1:0}function ps(e,t){if(!e||e==="none")return fs(t);const n=e.match(/^matrix3d\(([-\d.e\s,]+)\)$/u);let s,i;if(n)s=nd,i=n;else{const a=e.match(/^matrix\(([-\d.e\s,]+)\)$/u);s=td,i=a}if(!i)return fs(t);const r=s[t],o=i[1].split(",").map(id);return typeof r=="function"?r(o):o[r]}const sd=(e,t)=>{const{transform:n="none"}=getComputedStyle(e);return ps(n,t)};function id(e){return parseFloat(e.trim())}const mt=["transformPerspective","x","y","z","translateX","translateY","translateZ","scale","scaleX","scaleY","rotate","rotateX","rotateY","rotateZ","skew","skewX","skewY"],gt=new Set([...mt,"pathRotation"]),Oi=e=>e===pt||e===O,od=new Set(["x","y","z"]),rd=mt.filter(e=>!od.has(e));function ad(e){const t=[];return rd.forEach(n=>{const s=e.getValue(n);s!==void 0&&(t.push([n,s.get()]),s.set(n.startsWith("scale")?1:0))}),t}const Ue={width:({x:e},{paddingLeft:t="0",paddingRight:n="0",boxSizing:s})=>{const i=e.max-e.min;return s==="border-box"?i:i-parseFloat(t)-parseFloat(n)},height:({y:e},{paddingTop:t="0",paddingBottom:n="0",boxSizing:s})=>{const i=e.max-e.min;return s==="border-box"?i:i-parseFloat(t)-parseFloat(n)},top:(e,{top:t})=>parseFloat(t),left:(e,{left:t})=>parseFloat(t),bottom:({y:e},{top:t})=>parseFloat(t)+(e.max-e.min),right:({x:e},{left:t})=>parseFloat(t)+(e.max-e.min),x:(e,{transform:t})=>ps(t,"x"),y:(e,{transform:t})=>ps(t,"y")};Ue.translateX=Ue.x;Ue.translateY=Ue.y;const et=new Set;let ms=!1,gs=!1,ys=!1;function Or(){if(gs){const e=Array.from(et).filter(s=>s.needsMeasurement),t=new Set(e.map(s=>s.element)),n=new Map;t.forEach(s=>{const i=ad(s);i.length&&(n.set(s,i),s.render())}),e.forEach(s=>s.measureInitialState()),t.forEach(s=>{s.render();const i=n.get(s);i&&i.forEach(([r,o])=>{s.getValue(r)?.set(o)})}),e.forEach(s=>s.measureEndState()),e.forEach(s=>{s.suspendedScrollY!==void 0&&window.scrollTo(0,s.suspendedScrollY)})}gs=!1,ms=!1,et.forEach(e=>e.complete(ys)),et.clear()}function Nr(){et.forEach(e=>{e.readKeyframes(),e.needsMeasurement&&(gs=!0)})}function ld(){ys=!0,Nr(),Or(),ys=!1}class Ys{constructor(t,n,s,i,r,o=!1){this.state="pending",this.isAsync=!1,this.needsMeasurement=!1,this.unresolvedKeyframes=[...t],this.onComplete=n,this.name=s,this.motionValue=i,this.element=r,this.isAsync=o}scheduleResolve(){this.state="scheduled",this.isAsync?(et.add(this),ms||(ms=!0,ne.read(Nr),ne.resolveKeyframes(Or))):(this.readKeyframes(),this.complete())}readKeyframes(){const{unresolvedKeyframes:t,name:n,element:s,motionValue:i}=this;if(t[0]===null){const r=i?.get(),o=t[t.length-1];if(r!==void 0)t[0]=r;else if(s&&n){const a=s.readValue(n,o);a!=null&&(t[0]=a)}t[0]===void 0&&(t[0]=o),i&&r===void 0&&i.set(t[0])}ed(t)}setFinalKeyframe(){}measureInitialState(){}renderEndStyles(){}measureEndState(){}complete(t=!1){this.state="complete",this.onComplete(this.unresolvedKeyframes,this.finalKeyframe,t),et.delete(this)}cancel(){this.state==="scheduled"&&(et.delete(this),this.state="pending")}resume(){this.state==="pending"&&this.scheduleResolve()}}const cd=e=>e.startsWith("--");function Lr(e,t,n){cd(t)?e.style.setProperty(t,n):e.style[t]=n}const dd={};function Vr(e,t){const n=dr(e);return()=>dd[t]??n()}const hd=Vr(()=>window.ScrollTimeline!==void 0,"scrollTimeline"),Ir=Vr(()=>{try{document.createElement("div").animate({opacity:0},{easing:"linear(0, 1)"})}catch{return!1}return!0},"linearEasing"),vt=([e,t,n,s])=>`cubic-bezier(${e}, ${t}, ${n}, ${s})`,Ni={linear:"linear",ease:"ease",easeIn:"ease-in",easeOut:"ease-out",easeInOut:"ease-in-out",circIn:vt([0,.65,.55,1]),circOut:vt([.55,0,1,.45]),backIn:vt([.31,.01,.66,-.59]),backOut:vt([.33,1.53,.69,.99])};function Br(e,t){if(e)return typeof e=="function"?Ir()?jr(e,t):"ease-out":vr(e)?vt(e):Array.isArray(e)?e.map(n=>Br(n,t)||Ni.easeOut):Ni[e]}function ud(e,t,n,{delay:s=0,duration:i=300,repeat:r=0,repeatType:o="loop",ease:a="easeOut",times:c}={},l=void 0){const h={[t]:n};c&&(h.offset=c);const f=Br(a,i);Array.isArray(f)&&(h.easing=f);const u={delay:s,duration:i,easing:Array.isArray(f)?"linear":f,fill:"both",iterations:r+1,direction:o==="reverse"?"alternate":"normal"};return l&&(u.pseudoElement=l),e.animate(h,u)}function $r(e){return typeof e=="function"&&"applyToOptions"in e}function fd({type:e,...t}){return $r(e)&&Ir()?e.applyToOptions(t):(t.duration??(t.duration=300),t.ease??(t.ease="easeOut"),t)}class Fr extends Xs{constructor(t){if(super(),this.finishedTime=null,this.isStopped=!1,this.manualStartTime=null,!t)return;const{element:n,name:s,keyframes:i,pseudoElement:r,allowFlatten:o=!1,finalKeyframe:a,onComplete:c}=t;this.isPseudoElement=!!r,this.allowFlatten=o,this.options=t,Tn(typeof t.type!="string");const l=fd(t);this.animation=ud(n,s,i,l,r),l.autoplay===!1&&this.animation.pause(),this.animation.onfinish=()=>{if(this.finishedTime=this.time,!r){const h=Sn(i,this.options,a,this.speed);this.updateMotionValue&&this.updateMotionValue(h),Lr(n,s,h),this.animation.cancel()}c?.(),this.notifyFinished()}}play(){this.isStopped||(this.manualStartTime=null,this.animation.play(),this.state==="finished"&&this.updateFinished())}pause(){this.animation.pause()}complete(){this.animation.finish?.()}cancel(){try{this.animation.cancel()}catch{}}stop(){if(this.isStopped)return;this.isStopped=!0;const{state:t}=this;t==="idle"||t==="finished"||(this.updateMotionValue?this.updateMotionValue():this.commitStyles(),this.isPseudoElement||this.cancel())}commitStyles(){const t=this.options?.element;!this.isPseudoElement&&t?.isConnected&&this.animation.commitStyles?.()}get duration(){const t=this.animation.effect?.getComputedTiming?.().duration||0;return Ee(Number(t))}get iterationDuration(){const{delay:t=0}=this.options||{};return this.duration+Ee(t)}get time(){return Ee(Number(this.animation.currentTime)||0)}set time(t){const n=this.finishedTime!==null;this.manualStartTime=null,this.finishedTime=null,this.animation.currentTime=De(t),n&&this.animation.pause()}get speed(){return this.animation.playbackRate}set speed(t){t<0&&(this.finishedTime=null),this.animation.playbackRate=t}get state(){return this.finishedTime!==null?"finished":this.animation.playState}get startTime(){return this.manualStartTime??Number(this.animation.startTime)}set startTime(t){this.manualStartTime=this.animation.startTime=t}attachTimeline({timeline:t,rangeStart:n,rangeEnd:s,observe:i}){return this.allowFlatten&&this.animation.effect?.updateTiming({easing:"linear"}),this.animation.onfinish=null,t&&hd()?(this.animation.timeline=t,n&&(this.animation.rangeStart=n),s&&(this.animation.rangeEnd=s),Me):i(this)}}const _r={anticipate:yr,backInOut:gr,circInOut:xr};function pd(e){return e in _r}function md(e){typeof e.ease=="string"&&pd(e.ease)&&(e.ease=_r[e.ease])}const $n=10;class gd extends Fr{constructor(t){md(t),Rr(t),super(t),t.startTime!==void 0&&t.autoplay!==!1&&(this.startTime=t.startTime),this.options=t}updateMotionValue(t){const{motionValue:n,onUpdate:s,onComplete:i,element:r,...o}=this.options;if(!n)return;if(t!==void 0){n.set(t);return}const a=new gn({...o,autoplay:!1}),c=Math.max($n,ye.now()-this.startTime),l=$e(0,$n,c-$n),h=a.sample(c).value,{name:f}=this.options;r&&f&&Lr(r,f,h),n.setWithVelocity(a.sample(Math.max(0,c-l)).value,h,l),a.stop()}}const Li=(e,t)=>t==="zIndex"?!1:!!(typeof e=="number"||Array.isArray(e)||typeof e=="string"&&(Ne.test(e)||e==="0")&&!e.startsWith("url("));function yd(e){const t=e[0];if(e.length===1)return!0;for(let n=0;n<e.length;n++)if(e[n]!==t)return!0}function wd(e,t,n,s){const i=e[0];if(i===null)return!1;if(t==="display"||t==="visibility")return!0;const r=e[e.length-1],o=Li(i,t),a=Li(r,t);return!o||!a?!1:yd(e)||(n==="spring"||$r(n))&&s}function ws(e){e.duration=0,e.type="keyframes"}const Hr=new Set(["opacity","clipPath","filter","transform","backgroundColor"]),xd=/^(?:oklch|oklab|lab|lch|color|color-mix|light-dark)\(/;function bd(e){for(let t=0;t<e.length;t++)if(typeof e[t]=="string"&&xd.test(e[t]))return!0;return!1}const vd=new Set(["color","backgroundColor","outlineColor","fill","stroke","borderColor","borderTopColor","borderRightColor","borderBottomColor","borderLeftColor"]),kd=dr(()=>Object.hasOwnProperty.call(Element.prototype,"animate"));function Td(e){const{motionValue:t,name:n,repeatDelay:s,repeatType:i,damping:r,type:o,keyframes:a}=e,c=t?.owner?.current;if(!(c instanceof HTMLElement)&&!(c instanceof SVGElement))return!1;const{onUpdate:l,transformTemplate:h}=t.owner.getProps();return kd()&&n&&(Hr.has(n)||vd.has(n)&&bd(a))&&(n!=="transform"||!h)&&!l&&!s&&i!=="mirror"&&r!==0&&o!=="inertia"}const Sd=40;class Cd extends Xs{constructor({autoplay:t=!0,delay:n=0,type:s="keyframes",repeat:i=0,repeatDelay:r=0,repeatType:o="loop",keyframes:a,name:c,motionValue:l,element:h,...f}){super(),this.stop=()=>{this._animation&&(this._animation.stop(),this.stopTimeline?.()),this.keyframeResolver?.cancel()},this.createdAt=ye.now();const u={autoplay:t,delay:n,type:s,repeat:i,repeatDelay:r,repeatType:o,name:c,motionValue:l,element:h,...f},w=h?.KeyframeResolver||Ys;this.keyframeResolver=new w(a,(g,m,y)=>this.onKeyframesResolved(g,m,u,!y),c,l,h),this.keyframeResolver?.scheduleResolve()}onKeyframesResolved(t,n,s,i){this.keyframeResolver=void 0;const{name:r,type:o,velocity:a,delay:c,isHandoff:l,onUpdate:h}=s;this.resolvedAt=ye.now();let f=!0;wd(t,r,o,a)||(f=!1,(Ge.instantAnimations||!c)&&h?.(Sn(t,s,n)),t[0]=t[t.length-1],ws(s),s.repeat=0);const w={startTime:i?this.resolvedAt?this.resolvedAt-this.createdAt>Sd?this.resolvedAt:this.createdAt:this.createdAt:void 0,finalKeyframe:n,...s,keyframes:t},g=f&&!l&&Td(w),m=w.motionValue?.owner?.current;let y;if(g)try{y=new gd({...w,element:m})}catch{y=new gn(w)}else y=new gn(w);y.finished.then(()=>{this.notifyFinished()}).catch(Me),this.pendingTimeline&&(this.stopTimeline=y.attachTimeline(this.pendingTimeline),this.pendingTimeline=void 0),this._animation=y}get finished(){return this._animation?this.animation.finished:this._finished}then(t,n){return this.finished.finally(t).then(()=>{})}get animation(){return this._animation||(this.keyframeResolver?.resume(),ld()),this._animation}get duration(){return this.animation.duration}get iterationDuration(){return this.animation.iterationDuration}get time(){return this.animation.time}set time(t){this.animation.time=t}get speed(){return this.animation.speed}get state(){return this.animation.state}set speed(t){this.animation.speed=t}get startTime(){return this.animation.startTime}attachTimeline(t){return this._animation?this.stopTimeline=this.animation.attachTimeline(t):this.pendingTimeline=t,()=>this.stop()}play(){this.animation.play()}pause(){this.animation.pause()}complete(){this.animation.complete()}cancel(){this._animation&&this.animation.cancel(),this.keyframeResolver?.cancel()}}function Wr(e,t,n,s=0,i=1){const r=Array.from(e).sort((l,h)=>l.sortNodePosition(h)).indexOf(t),o=e.size,a=(o-1)*s;return typeof n=="function"?n(r,o):i===1?r*s:a-r*s}const Vi=30,Ad=e=>!isNaN(parseFloat(e));class Pd{constructor(t,n={}){this.canTrackVelocity=null,this.events={},this.updateAndNotify=s=>{const i=ye.now();if(this.updatedAt!==i&&this.setPrevFrameValue(),this.prev=this.current,this.setCurrent(s),this.current!==this.prev&&(this.events.change?.notify(this.current),this.dependents))for(const r of this.dependents)r.dirty()},this.hasAnimated=!1,this.setCurrent(t),this.owner=n.owner}setCurrent(t){this.current=t,this.updatedAt=ye.now(),this.canTrackVelocity===null&&t!==void 0&&(this.canTrackVelocity=Ad(this.current))}setPrevFrameValue(t=this.current){this.prevFrameValue=t,this.prevUpdatedAt=this.updatedAt}onChange(t){return this.on("change",t)}on(t,n){this.events[t]||(this.events[t]=new _s);const s=this.events[t].add(n);return t==="change"?()=>{s(),ne.read(()=>{this.events.change.getSize()||this.stop()})}:s}clearListeners(){for(const t in this.events)this.events[t].clear()}attach(t,n){this.passiveEffect=t,this.stopPassiveEffect=n}set(t){this.passiveEffect?this.passiveEffect(t,this.updateAndNotify):this.updateAndNotify(t)}setWithVelocity(t,n,s){this.set(n),this.prev=void 0,this.prevFrameValue=t,this.prevUpdatedAt=this.updatedAt-s}jump(t,n=!0){this.updateAndNotify(t),this.prev=t,this.prevUpdatedAt=this.prevFrameValue=void 0,n&&this.stop(),this.stopPassiveEffect&&this.stopPassiveEffect()}dirty(){this.events.change?.notify(this.current)}addDependent(t){this.dependents||(this.dependents=new Set),this.dependents.add(t)}removeDependent(t){this.dependents&&this.dependents.delete(t)}get(){return this.current}getPrevious(){return this.prev}getVelocity(){const t=ye.now();if(!this.canTrackVelocity||this.prevFrameValue===void 0||t-this.updatedAt>Vi)return 0;const n=Math.min(this.updatedAt-this.prevUpdatedAt,Vi);return hr(parseFloat(this.current)-parseFloat(this.prevFrameValue),n)}start(t){return this.stop(),new Promise(n=>{this.hasAnimated=!0,this.animation=t(n),this.events.animationStart&&this.events.animationStart.notify()}).then(()=>{this.events.animationComplete&&this.events.animationComplete.notify(),this.clearAnimation()})}stop(){this.animation&&(this.animation.stop(),this.events.animationCancel&&this.events.animationCancel.notify()),this.clearAnimation()}isAnimating(){return!!this.animation}clearAnimation(){delete this.animation}destroy(){this.dependents?.clear(),this.events.destroy?.notify(),this.clearListeners(),this.stop(),this.stopPassiveEffect&&this.stopPassiveEffect()}}function ft(e,t){return new Pd(e,t)}function zr(e,t){if(e?.inherit&&t){const{inherit:n,...s}=e;return{...t,...s}}return e}function Zs(e,t){const n=e?.[t]??e?.default??e;return n!==e?zr(n,e):n}const Ed={type:"spring",stiffness:500,damping:25,restSpeed:10},Md=e=>({type:"spring",stiffness:550,damping:e===0?2*Math.sqrt(550):30,restSpeed:10}),Dd={type:"keyframes",duration:.8},jd={type:"keyframes",ease:[.25,.1,.35,1],duration:.3},Rd=(e,{keyframes:t})=>t.length>2?Dd:gt.has(e)?e.startsWith("scale")?Md(t[1]):Ed:jd,Od=new Set(["when","delay","delayChildren","staggerChildren","staggerDirection","repeat","repeatType","repeatDelay","from","elapsed"]);function Nd(e){for(const t in e)if(!Od.has(t))return!0;return!1}const Js=(e,t,n,s={},i,r)=>o=>{const a=Zs(s,e)||{},c=a.delay||s.delay||0;let{elapsed:l=0}=s;l=l-De(c);const h={keyframes:Array.isArray(n)?n:[null,n],ease:"easeOut",velocity:t.getVelocity(),...a,delay:-l,onUpdate:u=>{t.set(u),a.onUpdate&&a.onUpdate(u)},onComplete:()=>{o(),a.onComplete&&a.onComplete()},name:e,motionValue:t,element:r?void 0:i};Nd(a)||Object.assign(h,Rd(e,h)),h.duration&&(h.duration=De(h.duration)),h.repeatDelay&&(h.repeatDelay=De(h.repeatDelay)),h.from!==void 0&&(h.keyframes[0]=h.from);let f=!1;if((h.type===!1||h.duration===0&&!h.repeatDelay)&&(ws(h),h.delay===0&&(f=!0)),(Ge.instantAnimations||Ge.skipAnimations||i?.shouldSkipAnimations||a.skipAnimations)&&(f=!0,ws(h),h.delay=0),h.allowFlatten=!a.type&&!a.ease,f&&!r&&t.get()!==void 0){const u=Sn(h.keyframes,a);if(u!==void 0){ne.update(()=>{h.onUpdate(u),h.onComplete()});return}}return a.isSync?new gn(h):new Cd(h)},Ld=/^var\(--(?:([\w-]+)|([\w-]+), ?([a-zA-Z\d ()%#.,-]+))\)/u;function Vd(e){const t=Ld.exec(e);if(!t)return[,];const[,n,s,i]=t;return[`--${n??s}`,i]}function Ur(e,t,n=1){const[s,i]=Vd(e);if(!s)return;const r=window.getComputedStyle(t).getPropertyValue(s);if(r){const o=r.trim();return ar(o)?parseFloat(o):o}return zs(i)?Ur(i,t,n+1):i}function Ii(e){const t=[{},{}];return e?.values.forEach((n,s)=>{t[0][s]=n.get(),t[1][s]=n.getVelocity()}),t}function ei(e,t,n,s){if(typeof t=="function"){const[i,r]=Ii(s);t=t(n!==void 0?n:e.custom,i,r)}if(typeof t=="string"&&(t=e.variants&&e.variants[t]),typeof t=="function"){const[i,r]=Ii(s);t=t(n!==void 0?n:e.custom,i,r)}return t}function tt(e,t,n){const s=e.getProps();return ei(s,t,n!==void 0?n:s.custom,e)}const Gr=new Set(["width","height","top","left","right","bottom",...mt]),xs=e=>Array.isArray(e);function Id(e,t,n){e.hasValue(t)?e.getValue(t).set(n):e.addValue(t,ft(n))}function Bd(e){return xs(e)?e[e.length-1]||0:e}function $d(e,t){const n=tt(e,t);let{transitionEnd:s={},transition:i={},...r}=n||{};r={...r,...s};for(const o in r){const a=Bd(r[o]);Id(e,o,a)}}const pe=e=>!!(e&&e.getVelocity);function Fd(e){return!!(pe(e)&&e.add)}function bs(e,t){const n=e.getValue("willChange");if(Fd(n))return n.add(t);if(!n&&Ge.WillChange){const s=new Ge.WillChange("auto");e.addValue("willChange",s),s.add(t)}}function ti(e){return e.replace(/([A-Z])/g,t=>`-${t.toLowerCase()}`)}const _d="framerAppearId",Kr="data-"+ti(_d);function Qr(e){return e.props[Kr]}const Hd=typeof window<"u";function Wd({protectedKeys:e,needsAnimating:t},n){const s=e.hasOwnProperty(n)&&t[n]!==!0;return t[n]=!1,s}function qr(e,t,{delay:n=0,transitionOverride:s,type:i}={}){let{transition:r,transitionEnd:o,...a}=t;const c=e.getDefaultTransition();r=r?zr(r,c):c;const l=r?.reduceMotion,h=r?.skipAnimations;s&&(r=s);const f=[],u=i&&e.animationState&&e.animationState.getState()[i],w=r?.path;w&&w.animateVisualElement(e,a,r,n,f);for(const g in a){const m=e.getValue(g,e.latestValues[g]??null),y=a[g];if(y===void 0||u&&Wd(u,g))continue;const x={delay:n,...Zs(r||{},g)};h&&(x.skipAnimations=!0);const T=m.get();if(T!==void 0&&!m.isAnimating()&&!Array.isArray(y)&&y===T&&!x.velocity){ne.update(()=>m.set(y));continue}let v=!1;if(Hd&&window.MotionHandoffAnimation){const P=Qr(e);if(P){const S=window.MotionHandoffAnimation(P,g,ne);S!==null&&(x.startTime=S,v=!0)}}bs(e,g);const b=l??e.shouldReduceMotion;m.start(Js(g,m,y,b&&Gr.has(g)?{type:!1}:x,e,v));const C=m.animation;C&&f.push(C)}if(o){const g=()=>ne.update(()=>{o&&$d(e,o)});f.length?Promise.all(f).then(g):g()}return f}function vs(e,t,n={}){const s=tt(e,t,n.type==="exit"?e.presenceContext?.custom:void 0);let{transition:i=e.getDefaultTransition()||{}}=s||{};n.transitionOverride&&(i=n.transitionOverride);const r=s?()=>Promise.all(qr(e,s,n)):()=>Promise.resolve(),o=e.variantChildren&&e.variantChildren.size?(c=0)=>{const{delayChildren:l=0,staggerChildren:h,staggerDirection:f}=i;return zd(e,t,c,l,h,f,n)}:()=>Promise.resolve(),{when:a}=i;if(a){const[c,l]=a==="beforeChildren"?[r,o]:[o,r];return c().then(()=>l())}else return Promise.all([r(),o(n.delay)])}function zd(e,t,n=0,s=0,i=0,r=1,o){const a=[];for(const c of e.variantChildren)c.notify("AnimationStart",t),a.push(vs(c,t,{...o,delay:n+(typeof s=="function"?0:s)+Wr(e.variantChildren,c,s,i,r)}).then(()=>c.notify("AnimationComplete",t)));return Promise.all(a)}function Ud(e,t,n={}){e.notify("AnimationStart",t);let s;if(Array.isArray(t)){const i=t.map(r=>vs(e,r,n));s=Promise.all(i)}else if(typeof t=="string")s=vs(e,t,n);else{const i=typeof t=="function"?tt(e,t,n.custom):t;s=Promise.all(qr(e,i,n))}return s.then(()=>{e.notify("AnimationComplete",t)})}const Gd={test:e=>e==="auto",parse:e=>e},Xr=e=>t=>t.test(e),Yr=[pt,O,Be,_e,gc,mc,Gd],Bi=e=>Yr.find(Xr(e));function Kd(e){return typeof e=="number"?e===0:e!==null?e==="none"||e==="0"||cr(e):!0}const Qd=new Set(["brightness","contrast","saturate","opacity"]);function qd(e){const[t,n]=e.slice(0,-1).split("(");if(t==="drop-shadow")return e;const[s]=n.match(Us)||[];if(!s)return e;const i=n.replace(s,"");let r=Qd.has(t)?1:0;return s!==n&&(r*=100),t+"("+r+i+")"}const Xd=/\b([a-z-]*)\(.*?\)/gu,ks={...Ne,getAnimatableNone:e=>{const t=e.match(Xd);return t?t.map(qd).join(" "):e}},Ts={...Ne,getAnimatableNone:e=>{const t=Ne.parse(e);return Ne.createTransformer(e)(t.map(s=>typeof s=="number"?0:typeof s=="object"?{...s,alpha:1}:s))}},$i={...pt,transform:Math.round},Yd={rotate:_e,pathRotation:_e,rotateX:_e,rotateY:_e,rotateZ:_e,scale:Ut,scaleX:Ut,scaleY:Ut,scaleZ:Ut,skew:_e,skewX:_e,skewY:_e,distance:O,translateX:O,translateY:O,translateZ:O,x:O,y:O,z:O,perspective:O,transformPerspective:O,opacity:Rt,originX:Ci,originY:Ci,originZ:O},yn={borderWidth:O,borderTopWidth:O,borderRightWidth:O,borderBottomWidth:O,borderLeftWidth:O,borderRadius:O,borderTopLeftRadius:O,borderTopRightRadius:O,borderBottomRightRadius:O,borderBottomLeftRadius:O,width:O,maxWidth:O,height:O,maxHeight:O,top:O,right:O,bottom:O,left:O,inset:O,insetBlock:O,insetBlockStart:O,insetBlockEnd:O,insetInline:O,insetInlineStart:O,insetInlineEnd:O,padding:O,paddingTop:O,paddingRight:O,paddingBottom:O,paddingLeft:O,paddingBlock:O,paddingBlockStart:O,paddingBlockEnd:O,paddingInline:O,paddingInlineStart:O,paddingInlineEnd:O,margin:O,marginTop:O,marginRight:O,marginBottom:O,marginLeft:O,marginBlock:O,marginBlockStart:O,marginBlockEnd:O,marginInline:O,marginInlineStart:O,marginInlineEnd:O,fontSize:O,backgroundPositionX:O,backgroundPositionY:O,...Yd,zIndex:$i,fillOpacity:Rt,strokeOpacity:Rt,numOctaves:$i},Zd={...yn,color:ae,backgroundColor:ae,outlineColor:ae,fill:ae,stroke:ae,borderColor:ae,borderTopColor:ae,borderRightColor:ae,borderBottomColor:ae,borderLeftColor:ae,filter:ks,WebkitFilter:ks,mask:Ts,WebkitMask:Ts},Zr=e=>Zd[e],Jd=new Set([ks,Ts]);function Jr(e,t){let n=Zr(e);return Jd.has(n)||(n=Ne),n.getAnimatableNone?n.getAnimatableNone(t):void 0}const eh=new Set(["auto","none","0"]);function th(e,t,n){let s=0,i;for(;s<e.length&&!i;){const r=e[s];typeof r=="string"&&!eh.has(r)&&ut(r).values.length&&(i=e[s]),s++}if(i&&n)for(const r of t)e[r]=Jr(n,i)}class nh extends Ys{constructor(t,n,s,i,r){super(t,n,s,i,r,!0)}readKeyframes(){const{unresolvedKeyframes:t,element:n,name:s}=this;if(!n||!n.current)return;super.readKeyframes();for(let h=0;h<t.length;h++){let f=t[h];if(typeof f=="string"&&(f=f.trim(),zs(f))){const u=Ur(f,n.current);u!==void 0&&(t[h]=u),h===t.length-1&&(this.finalKeyframe=f)}}if(this.resolveNoneKeyframes(),!Gr.has(s)||t.length!==2)return;const[i,r]=t,o=Bi(i),a=Bi(r),c=Si(i),l=Si(r);if(c!==l&&Ue[s]){this.needsMeasurement=!0;return}if(o!==a)if(Oi(o)&&Oi(a))for(let h=0;h<t.length;h++){const f=t[h];typeof f=="string"&&(t[h]=parseFloat(f))}else Ue[s]&&(this.needsMeasurement=!0)}resolveNoneKeyframes(){const{unresolvedKeyframes:t,name:n}=this,s=[];for(let i=0;i<t.length;i++)(t[i]===null||Kd(t[i]))&&s.push(i);s.length&&th(t,s,n)}measureInitialState(){const{element:t,unresolvedKeyframes:n,name:s}=this;if(!t||!t.current)return;s==="height"&&(this.suspendedScrollY=window.pageYOffset),this.measuredOrigin=Ue[s](t.measureViewportBox(),window.getComputedStyle(t.current)),n[0]=this.measuredOrigin;const i=n[n.length-1];i!==void 0&&t.getValue(s,i).jump(i,!1)}measureEndState(){const{element:t,name:n,unresolvedKeyframes:s}=this;if(!t||!t.current)return;const i=t.getValue(n);i&&i.jump(this.measuredOrigin,!1);const r=s.length-1,o=s[r];s[r]=Ue[n](t.measureViewportBox(),window.getComputedStyle(t.current)),o!==null&&this.finalKeyframe===void 0&&(this.finalKeyframe=o),this.removedTransforms?.length&&this.removedTransforms.forEach(([a,c])=>{t.getValue(a).set(c)}),this.resolveNoneKeyframes()}}const ni=["borderTopLeftRadius","borderTopRightRadius","borderBottomRightRadius","borderBottomLeftRadius"];function ea(e,t,n){if(e==null)return[];if(e instanceof EventTarget)return[e];if(typeof e=="string"){let s=document;const i=n?.[e]??s.querySelectorAll(e);return i?Array.from(i):[]}return Array.from(e).filter(s=>s!=null)}const Ss=(e,t)=>t&&typeof e=="number"?t.transform(e):e;function sn(e){return lr(e)&&"offsetHeight"in e&&!("ownerSVGElement"in e)}const{schedule:si}=kr(queueMicrotask,!1),Oe={x:!1,y:!1};function ta(){return Oe.x||Oe.y}function sh(e){return e==="x"||e==="y"?Oe[e]?null:(Oe[e]=!0,()=>{Oe[e]=!1}):Oe.x||Oe.y?null:(Oe.x=Oe.y=!0,()=>{Oe.x=Oe.y=!1})}function na(e,t){const n=ea(e),s=new AbortController,i={passive:!0,...t,signal:s.signal};return[n,i,()=>s.abort()]}function ih(e){return!(e.pointerType==="touch"||ta())}function oh(e,t,n={}){const[s,i,r]=na(e,n);return s.forEach(o=>{let a=!1,c=!1,l;const h=()=>{o.removeEventListener("pointerleave",g)},f=y=>{l&&(l(y),l=void 0),h()},u=y=>{a=!1,window.removeEventListener("pointerup",u),window.removeEventListener("pointercancel",u),c&&(c=!1,f(y))},w=()=>{a=!0,window.addEventListener("pointerup",u,i),window.addEventListener("pointercancel",u,i)},g=y=>{if(y.pointerType!=="touch"){if(a){c=!0;return}f(y)}},m=y=>{if(!ih(y))return;c=!1;const x=t(o,y);typeof x=="function"&&(l=x,o.addEventListener("pointerleave",g,i))};o.addEventListener("pointerenter",m,i),o.addEventListener("pointerdown",w,i)}),r}const sa=(e,t)=>t?e===t?!0:sa(e,t.parentElement):!1,ii=e=>e.pointerType==="mouse"?typeof e.button!="number"||e.button<=0:e.isPrimary!==!1,rh=new Set(["BUTTON","INPUT","SELECT","TEXTAREA","A"]);function ah(e){return rh.has(e.tagName)||e.isContentEditable===!0}const lh=new Set(["INPUT","SELECT","TEXTAREA"]);function ch(e){return lh.has(e.tagName)||e.isContentEditable===!0}const on=new WeakSet;function Fi(e){return t=>{t.key==="Enter"&&e(t)}}function Fn(e,t){e.dispatchEvent(new PointerEvent("pointer"+t,{isPrimary:!0,bubbles:!0}))}const dh=(e,t)=>{const n=e.currentTarget;if(!n)return;const s=Fi(()=>{if(on.has(n))return;Fn(n,"down");const i=Fi(()=>{Fn(n,"up")}),r=()=>Fn(n,"cancel");n.addEventListener("keyup",i,t),n.addEventListener("blur",r,t)});n.addEventListener("keydown",s,t),n.addEventListener("blur",()=>n.removeEventListener("keydown",s),t)};function _i(e){return ii(e)&&!ta()}const Hi=new WeakSet;function hh(e,t,n={}){const[s,i,r]=na(e,n),o=a=>{const c=a.currentTarget;if(!_i(a)||Hi.has(a))return;on.add(c),n.stopPropagation&&Hi.add(a);const l=t(c,a),h={...i,capture:!0},f=(g,m)=>{window.removeEventListener("pointerup",u,h),window.removeEventListener("pointercancel",w,h),on.has(c)&&on.delete(c),_i(g)&&typeof l=="function"&&l(g,{success:m})},u=g=>{f(g,c===window||c===document||n.useGlobalTarget||sa(c,g.target))},w=g=>{f(g,!1)};window.addEventListener("pointerup",u,h),window.addEventListener("pointercancel",w,h)};return s.forEach(a=>{(n.useGlobalTarget?window:a).addEventListener("pointerdown",o,i),sn(a)&&(a.addEventListener("focus",l=>dh(l,i)),!ah(a)&&!a.hasAttribute("tabindex")&&(a.tabIndex=0))}),r}function oi(e){return lr(e)&&"ownerSVGElement"in e}const rn=new WeakMap;let an;const ia=(e,t,n)=>(s,i)=>i&&i[0]?i[0][e+"Size"]:oi(s)&&"getBBox"in s?s.getBBox()[t]:s[n],uh=ia("inline","width","offsetWidth"),fh=ia("block","height","offsetHeight");function ph({target:e,borderBoxSize:t}){rn.get(e)?.forEach(n=>{n(e,{get width(){return uh(e,t)},get height(){return fh(e,t)}})})}function mh(e){e.forEach(ph)}function gh(){typeof ResizeObserver>"u"||(an=new ResizeObserver(mh))}function yh(e,t){an||gh();const n=ea(e);return n.forEach(s=>{let i=rn.get(s);i||(i=new Set,rn.set(s,i)),i.add(t),an?.observe(s)}),()=>{n.forEach(s=>{const i=rn.get(s);i?.delete(t),i?.size||an?.unobserve(s)})}}const ln=new Set;let dt;function wh(){dt=()=>{const e={get width(){return window.innerWidth},get height(){return window.innerHeight}};ln.forEach(t=>t(e))},window.addEventListener("resize",dt)}function xh(e){return ln.add(e),dt||wh(),()=>{ln.delete(e),!ln.size&&typeof dt=="function"&&(window.removeEventListener("resize",dt),dt=void 0)}}function Wi(e,t){return typeof e=="function"?xh(e):yh(e,t)}function bh(e){return oi(e)&&e.tagName==="svg"}const vh=[...Yr,ae,Ne],kh=e=>vh.find(Xr(e)),zi=()=>({translate:0,scale:1,origin:0,originPoint:0}),ht=()=>({x:zi(),y:zi()}),Ui=()=>({min:0,max:0}),he=()=>({x:Ui(),y:Ui()}),Th=new WeakMap;function Cn(e){return e!==null&&typeof e=="object"&&typeof e.start=="function"}function Ot(e){return typeof e=="string"||Array.isArray(e)}const ri=["animate","whileInView","whileFocus","whileHover","whileTap","whileDrag","exit"],ai=["initial",...ri];function An(e){return Cn(e.animate)||ai.some(t=>Ot(e[t]))}function oa(e){return!!(An(e)||e.variants)}function Sh(e,t,n){for(const s in t){const i=t[s],r=n[s];if(pe(i))e.addValue(s,i);else if(pe(r))e.addValue(s,ft(i,{owner:e}));else if(r!==i)if(e.hasValue(s)){const o=e.getValue(s);o.liveStyle===!0?o.jump(i):o.hasAnimated||o.set(i)}else{const o=e.getStaticValue(s);e.addValue(s,ft(o!==void 0?o:i,{owner:e}))}}for(const s in n)t[s]===void 0&&e.removeValue(s);return t}const Cs={current:null},ra={current:!1},Ch=typeof window<"u";function Ah(){if(ra.current=!0,!!Ch)if(window.matchMedia){const e=window.matchMedia("(prefers-reduced-motion)"),t=()=>Cs.current=e.matches;e.addEventListener("change",t),t()}else Cs.current=!1}const Gi=["AnimationStart","AnimationComplete","Update","BeforeLayoutMeasure","LayoutMeasure","LayoutAnimationStart","LayoutAnimationComplete"];let wn={};function aa(e){wn=e}function Ph(){return wn}class Eh{scrapeMotionValuesFromProps(t,n,s){return{}}constructor({parent:t,props:n,presenceContext:s,reducedMotionConfig:i,skipAnimations:r,blockInitialAnimation:o,visualState:a},c={}){this.current=null,this.children=new Set,this.isVariantNode=!1,this.isControllingVariants=!1,this.shouldReduceMotion=null,this.shouldSkipAnimations=!1,this.values=new Map,this.KeyframeResolver=Ys,this.features={},this.valueSubscriptions=new Map,this.prevMotionValues={},this.hasBeenMounted=!1,this.events={},this.propEventSubscriptions={},this.notifyUpdate=()=>this.notify("Update",this.latestValues),this.render=()=>{this.current&&(this.triggerBuild(),this.renderInstance(this.current,this.renderState,this.props.style,this.projection))},this.renderScheduledAt=0,this.scheduleRender=()=>{const w=ye.now();this.renderScheduledAt<w&&(this.renderScheduledAt=w,ne.render(this.render,!1,!0))};const{latestValues:l,renderState:h}=a;this.latestValues=l,this.baseTarget={...l},this.initialValues=n.initial?{...l}:{},this.renderState=h,this.parent=t,this.props=n,this.presenceContext=s,this.depth=t?t.depth+1:0,this.reducedMotionConfig=i,this.skipAnimationsConfig=r,this.options=c,this.blockInitialAnimation=!!o,this.isControllingVariants=An(n),this.isVariantNode=oa(n),this.isVariantNode&&(this.variantChildren=new Set),this.manuallyAnimateOnMount=!!(t&&t.current);const{willChange:f,...u}=this.scrapeMotionValuesFromProps(n,{},this);for(const w in u){const g=u[w];l[w]!==void 0&&pe(g)&&g.set(l[w])}}mount(t){if(this.hasBeenMounted)for(const n in this.initialValues)this.values.get(n)?.jump(this.initialValues[n]),this.latestValues[n]=this.initialValues[n];this.current=t,Th.set(t,this),this.projection&&!this.projection.instance&&this.projection.mount(t),this.parent&&this.isVariantNode&&!this.isControllingVariants&&(this.removeFromVariantTree=this.parent.addVariantChild(this)),this.values.forEach((n,s)=>this.bindToMotionValue(s,n)),this.reducedMotionConfig==="never"?this.shouldReduceMotion=!1:this.reducedMotionConfig==="always"?this.shouldReduceMotion=!0:(ra.current||Ah(),this.shouldReduceMotion=Cs.current),this.shouldSkipAnimations=this.skipAnimationsConfig??!1,this.parent?.addChild(this),this.update(this.props,this.presenceContext),this.hasBeenMounted=!0}unmount(){this.projection&&this.projection.unmount(),Ke(this.notifyUpdate),Ke(this.render),this.valueSubscriptions.forEach(t=>t()),this.valueSubscriptions.clear(),this.removeFromVariantTree&&this.removeFromVariantTree(),this.parent?.removeChild(this);for(const t in this.events)this.events[t].clear();for(const t in this.features){const n=this.features[t];n&&(n.unmount(),n.isMounted=!1)}this.current=null}addChild(t){this.children.add(t),this.enteringChildren??(this.enteringChildren=new Set),this.enteringChildren.add(t)}removeChild(t){this.children.delete(t),this.enteringChildren&&this.enteringChildren.delete(t)}bindToMotionValue(t,n){if(this.valueSubscriptions.has(t)&&this.valueSubscriptions.get(t)(),n.accelerate&&Hr.has(t)&&this.current instanceof HTMLElement){const{factory:o,keyframes:a,times:c,ease:l,duration:h}=n.accelerate,f=new Fr({element:this.current,name:t,keyframes:a,times:c,ease:l,duration:De(h)}),u=o(f);this.valueSubscriptions.set(t,()=>{u(),f.cancel()});return}const s=gt.has(t);s&&this.onBindTransform&&this.onBindTransform();const i=n.on("change",o=>{this.latestValues[t]=o,this.props.onUpdate&&ne.preRender(this.notifyUpdate),s&&this.projection&&(this.projection.isTransformDirty=!0),this.scheduleRender()});let r;typeof window<"u"&&window.MotionCheckAppearSync&&(r=window.MotionCheckAppearSync(this,t,n)),this.valueSubscriptions.set(t,()=>{i(),r&&r()})}sortNodePosition(t){return!this.current||!this.sortInstanceNodePosition||this.type!==t.type?0:this.sortInstanceNodePosition(this.current,t.current)}updateFeatures(){let t="animation";for(t in wn){const n=wn[t];if(!n)continue;const{isEnabled:s,Feature:i}=n;if(!this.features[t]&&i&&s(this.props)&&(this.features[t]=new i(this)),this.features[t]){const r=this.features[t];r.isMounted?r.update():(r.mount(),r.isMounted=!0)}}}triggerBuild(){this.build(this.renderState,this.latestValues,this.props)}measureViewportBox(){return this.current?this.measureInstanceViewportBox(this.current,this.props):he()}getStaticValue(t){return this.latestValues[t]}setStaticValue(t,n){this.latestValues[t]=n}update(t,n){(t.transformTemplate||this.props.transformTemplate)&&this.scheduleRender(),this.prevProps=this.props,this.props=t,this.prevPresenceContext=this.presenceContext,this.presenceContext=n;for(let s=0;s<Gi.length;s++){const i=Gi[s];this.propEventSubscriptions[i]&&(this.propEventSubscriptions[i](),delete this.propEventSubscriptions[i]);const r="on"+i,o=t[r];o&&(this.propEventSubscriptions[i]=this.on(i,o))}this.prevMotionValues=Sh(this,this.scrapeMotionValuesFromProps(t,this.prevProps||{},this),this.prevMotionValues),this.handleChildMotionValue&&this.handleChildMotionValue()}getProps(){return this.props}getVariant(t){return this.props.variants?this.props.variants[t]:void 0}getDefaultTransition(){return this.props.transition}getTransformPagePoint(){return this.props.transformPagePoint}getClosestVariantNode(){return this.isVariantNode?this:this.parent?this.parent.getClosestVariantNode():void 0}addVariantChild(t){const n=this.getClosestVariantNode();if(n)return n.variantChildren&&n.variantChildren.add(t),()=>n.variantChildren.delete(t)}addValue(t,n){const s=this.values.get(t);n!==s&&(s&&this.removeValue(t),this.bindToMotionValue(t,n),this.values.set(t,n),this.latestValues[t]=n.get())}removeValue(t){this.values.delete(t);const n=this.valueSubscriptions.get(t);n&&(n(),this.valueSubscriptions.delete(t)),delete this.latestValues[t],this.removeValueFromRenderState(t,this.renderState)}hasValue(t){return this.values.has(t)}getValue(t,n){if(this.props.values&&this.props.values[t])return this.props.values[t];let s=this.values.get(t);return s===void 0&&n!==void 0&&(s=ft(n===null?void 0:n,{owner:this}),this.addValue(t,s)),s}readValue(t,n){let s=this.latestValues[t]!==void 0||!this.current?this.latestValues[t]:this.getBaseTargetFromProps(this.props,t)??this.readValueFromInstance(this.current,t,this.options);return s!=null&&(typeof s=="string"&&(ar(s)||cr(s))?s=parseFloat(s):!kh(s)&&Ne.test(n)&&(s=Jr(t,n)),this.setBaseTarget(t,pe(s)?s.get():s)),pe(s)?s.get():s}setBaseTarget(t,n){this.baseTarget[t]=n}getBaseTarget(t){const{initial:n}=this.props;let s;if(typeof n=="string"||typeof n=="object"){const r=ei(this.props,n,this.presenceContext?.custom);r&&(s=r[t])}if(n&&s!==void 0)return s;const i=this.getBaseTargetFromProps(this.props,t);return i!==void 0&&!pe(i)?i:this.initialValues[t]!==void 0&&s===void 0?void 0:this.baseTarget[t]}on(t,n){return this.events[t]||(this.events[t]=new _s),this.events[t].add(n)}notify(t,...n){this.events[t]&&this.events[t].notify(...n)}scheduleRenderMicrotask(){si.render(this.render)}}class la extends Eh{constructor(){super(...arguments),this.KeyframeResolver=nh}sortInstanceNodePosition(t,n){return t.compareDocumentPosition(n)&2?1:-1}getBaseTargetFromProps(t,n){const s=t.style;return s?s[n]:void 0}removeValueFromRenderState(t,{vars:n,style:s}){delete n[t],delete s[t]}handleChildMotionValue(){this.childSubscription&&(this.childSubscription(),delete this.childSubscription);const{children:t}=this.props;pe(t)&&(this.childSubscription=t.on("change",n=>{this.current&&(this.current.textContent=`${n}`)}))}}class Qe{constructor(t){this.isMounted=!1,this.node=t}update(){}}function ca({top:e,left:t,right:n,bottom:s}){return{x:{min:t,max:n},y:{min:e,max:s}}}function Mh({x:e,y:t}){return{top:t.min,right:e.max,bottom:t.max,left:e.min}}function Dh(e,t){if(!t)return e;const n=t({x:e.left,y:e.top}),s=t({x:e.right,y:e.bottom});return{top:n.y,left:n.x,bottom:s.y,right:s.x}}function _n(e){return e===void 0||e===1}function As({scale:e,scaleX:t,scaleY:n}){return!_n(e)||!_n(t)||!_n(n)}function Ye(e){return As(e)||da(e)||e.z||e.rotate||e.rotateX||e.rotateY||e.skewX||e.skewY}function da(e){return Ki(e.x)||Ki(e.y)}function Ki(e){return e&&e!=="0%"}function xn(e,t,n){const s=e-n,i=t*s;return n+i}function Qi(e,t,n,s,i){return i!==void 0&&(e=xn(e,i,s)),xn(e,n,s)+t}function Ps(e,t=0,n=1,s,i){e.min=Qi(e.min,t,n,s,i),e.max=Qi(e.max,t,n,s,i)}function ha(e,{x:t,y:n}){Ps(e.x,t.translate,t.scale,t.originPoint),Ps(e.y,n.translate,n.scale,n.originPoint)}const qi=.999999999999,Xi=1.0000000000001;function jh(e,t,n,s=!1){const i=n.length;if(!i)return;t.x=t.y=1;let r,o;for(let a=0;a<i;a++){r=n[a],o=r.projectionDelta;const{visualElement:c}=r.options;c&&c.props.style&&c.props.style.display==="contents"||(s&&r.options.layoutScroll&&r.scroll&&r!==r.root&&(Ve(e.x,-r.scroll.offset.x),Ve(e.y,-r.scroll.offset.y)),o&&(t.x*=o.x.scale,t.y*=o.y.scale,ha(e,o)),s&&Ye(r.latestValues)&&cn(e,r.latestValues,r.layout?.layoutBox))}t.x<Xi&&t.x>qi&&(t.x=1),t.y<Xi&&t.y>qi&&(t.y=1)}function Ve(e,t){e.min+=t,e.max+=t}function Yi(e,t,n,s,i=.5){const r=te(e.min,e.max,i);Ps(e,t,n,r,s)}function Zi(e,t){return typeof e=="string"?parseFloat(e)/100*(t.max-t.min):e}function cn(e,t,n){const s=n??e;Yi(e.x,Zi(t.x,s.x),t.scaleX,t.scale,t.originX),Yi(e.y,Zi(t.y,s.y),t.scaleY,t.scale,t.originY)}function ua(e,t){return ca(Dh(e.getBoundingClientRect(),t))}function Rh(e,t,n){const s=ua(e,n),{scroll:i}=t;return i&&(Ve(s.x,i.offset.x),Ve(s.y,i.offset.y)),s}const Oh={x:"translateX",y:"translateY",z:"translateZ",transformPerspective:"perspective"},Nh=mt.length;function Lh(e,t,n){let s="",i=!0;for(let o=0;o<Nh;o++){const a=mt[o],c=e[a];if(c===void 0)continue;let l=!0;if(typeof c=="number")l=c===(a.startsWith("scale")?1:0);else{const h=parseFloat(c);l=a.startsWith("scale")?h===1:h===0}if(!l||n){const h=Ss(c,yn[a]);if(!l){i=!1;const f=Oh[a]||a;s+=`${f}(${h}) `}n&&(t[a]=h)}}const r=e.pathRotation;return r&&(i=!1,s+=`rotate(${Ss(r,yn.pathRotation)}) `),s=s.trim(),n?s=n(t,i?"":s):i&&(s="none"),s}function li(e,t,n){const{style:s,vars:i,transformOrigin:r}=e;let o=!1,a=!1;for(const c in t){const l=t[c];if(gt.has(c)){o=!0;continue}else if(Sr(c)){i[c]=l;continue}else{const h=Ss(l,yn[c]);c.startsWith("origin")?(a=!0,r[c]=h):s[c]=h}}if(t.transform||(o||n?s.transform=Lh(t,e.transform,n):s.transform&&(s.transform="none")),a){const{originX:c="50%",originY:l="50%",originZ:h=0}=r;s.transformOrigin=`${c} ${l} ${h}`}}function fa(e,{style:t,vars:n},s,i){const r=e.style;let o;for(o in t)r[o]=t[o];i?.applyProjectionStyles(r,s);for(o in n)r.setProperty(o,n[o])}function Ji(e,t){return t.max===t.min?0:e/(t.max-t.min)*100}const xt={correct:(e,t)=>{if(!t.target)return e;if(typeof e=="string")if(O.test(e))e=parseFloat(e);else return e;const n=Ji(e,t.target.x),s=Ji(e,t.target.y);return`${n}% ${s}%`}},Vh={correct:(e,{treeScale:t,projectionDelta:n})=>{const s=e,i=Ne.parse(e);if(i.length>5)return s;const r=Ne.createTransformer(e),o=typeof i[0]!="number"?1:0,a=n.x.scale*t.x,c=n.y.scale*t.y;i[0+o]/=a,i[1+o]/=c;const l=te(a,c,.5);return typeof i[2+o]=="number"&&(i[2+o]/=l),typeof i[3+o]=="number"&&(i[3+o]/=l),r(i)}},Es={borderRadius:{...xt,applyTo:[...ni]},borderTopLeftRadius:xt,borderTopRightRadius:xt,borderBottomLeftRadius:xt,borderBottomRightRadius:xt,boxShadow:Vh};function pa(e,{layout:t,layoutId:n}){return gt.has(e)||e.startsWith("origin")||(t||n!==void 0)&&(!!Es[e]||e==="opacity")}function ci(e,t,n){const s=e.style,i=t?.style,r={};if(!s)return r;for(const o in s)(pe(s[o])||i&&pe(i[o])||pa(o,e)||n?.getValue(o)?.liveStyle!==void 0)&&(r[o]=s[o]);return r}function Ih(e){return window.getComputedStyle(e)}class Bh extends la{constructor(){super(...arguments),this.type="html",this.renderInstance=fa}mount(t){Tn(!!t.style),super.mount(t)}readValueFromInstance(t,n){if(gt.has(n))return this.projection?.isProjecting?fs(n):sd(t,n);{const s=Ih(t),i=(Sr(n)?s.getPropertyValue(n):s[n])||0;return typeof i=="string"?i.trim():i}}measureInstanceViewportBox(t,{transformPagePoint:n}){return ua(t,n)}build(t,n,s){li(t,n,s.transformTemplate)}scrapeMotionValuesFromProps(t,n,s){return ci(t,n,s)}}const $h={offset:"stroke-dashoffset",array:"stroke-dasharray"},Fh={offset:"strokeDashoffset",array:"strokeDasharray"};function _h(e,t,n=1,s=0,i=!0){e.pathLength=1;const r=i?$h:Fh;e[r.offset]=`${-s}`,e[r.array]=`${t} ${n}`}const ma=["transform","opacity","offsetDistance","offsetPath","offsetRotate","offsetAnchor"];function ga(e,{attrX:t,attrY:n,attrScale:s,pathLength:i,pathSpacing:r=1,pathOffset:o=0,...a},c,l,h){if(li(e,a,l),c){e.style.viewBox&&(e.attrs.viewBox=e.style.viewBox);return}e.attrs=e.style,e.style={};const{attrs:f,style:u}=e;for(const w of ma)f[w]!==void 0&&(u[w]=f[w],delete f[w]);(u.transform||f.transformOrigin)&&(u.transformOrigin=f.transformOrigin??"50% 50%",delete f.transformOrigin),u.transform&&(u.transformBox=h?.transformBox??"fill-box",delete f.transformBox),t!==void 0&&(f.x=t),n!==void 0&&(f.y=n),s!==void 0&&(f.scale=s),i!==void 0&&_h(f,i,r,o,!1)}const ya=new Set(["baseFrequency","diffuseConstant","kernelMatrix","kernelUnitLength","keySplines","keyTimes","limitingConeAngle","markerHeight","markerWidth","numOctaves","targetX","targetY","surfaceScale","specularConstant","specularExponent","stdDeviation","tableValues","viewBox","gradientTransform","pathLength","startOffset","textLength","lengthAdjust"]),wa=e=>typeof e=="string"&&e.toLowerCase()==="svg";function Hh(e,t,n,s){fa(e,t,void 0,s);for(const i in t.attrs)e.setAttribute(ya.has(i)?i:ti(i),t.attrs[i])}function xa(e,t,n){const s=ci(e,t,n);for(const i in e)if(pe(e[i])||pe(t[i])){const r=mt.indexOf(i)!==-1?"attr"+i.charAt(0).toUpperCase()+i.substring(1):i;s[r]=e[i]}return s}class Wh extends la{constructor(){super(...arguments),this.type="svg",this.isSVGTag=!1,this.measureInstanceViewportBox=he}getBaseTargetFromProps(t,n){return t[n]}readValueFromInstance(t,n){if(gt.has(n)){const s=Zr(n);return s&&s.default||0}if(ma.includes(n)){const i=getComputedStyle(t)[n];if(typeof i=="string"&&i)return i.trim()}return n=ya.has(n)?n:ti(n),t.getAttribute(n)}scrapeMotionValuesFromProps(t,n,s){return xa(t,n,s)}build(t,n,s){ga(t,n,this.isSVGTag,s.transformTemplate,s.style)}renderInstance(t,n,s,i){Hh(t,n,s,i)}mount(t){this.isSVGTag=wa(t.tagName),super.mount(t)}}const zh=ai.length;function ba(e){if(!e)return;if(!e.isControllingVariants){const n=e.parent?ba(e.parent)||{}:{};return e.props.initial!==void 0&&(n.initial=e.props.initial),n}const t={};for(let n=0;n<zh;n++){const s=ai[n],i=e.props[s];(Ot(i)||i===!1)&&(t[s]=i)}return t}function va(e,t){if(!Array.isArray(t))return!1;const n=t.length;if(n!==e.length)return!1;for(let s=0;s<n;s++)if(t[s]!==e[s])return!1;return!0}const Uh=[...ri].reverse(),Gh=ri.length;function Kh(e){return t=>Promise.all(t.map(({animation:n,options:s})=>Ud(e,n,s)))}function Qh(e){let t=Kh(e),n=eo(),s=!0,i=!1;const r=l=>(h,f)=>{const u=tt(e,f,l==="exit"?e.presenceContext?.custom:void 0);if(u){const{transition:w,transitionEnd:g,...m}=u;h={...h,...m,...g}}return h};function o(l){t=l(e)}function a(l){const{props:h}=e,f=ba(e.parent)||{},u=[],w=new Set;let g={},m=1/0;for(let x=0;x<Gh;x++){const T=Uh[x],v=n[T],b=h[T]!==void 0?h[T]:f[T],C=Ot(b),P=T===l?v.isActive:null;P===!1&&(m=x);let S=b===f[T]&&b!==h[T]&&C;if(S&&(s||i)&&e.manuallyAnimateOnMount&&(S=!1),v.protectedKeys={...g},!v.isActive&&P===null||!b&&!v.prevProp||Cn(b)||typeof b=="boolean")continue;if(T==="exit"&&v.isActive&&P!==!0){v.prevResolvedValues&&(g={...g,...v.prevResolvedValues});continue}const M=qh(v.prevProp,b);let N=M||T===l&&v.isActive&&!S&&C||x>m&&C,H=!1;const F=Array.isArray(b)?b:[b];let G=F.reduce(r(T),{});P===!1&&(G={});const{prevResolvedValues:R={}}=v,I={...R,...G},q=K=>{N=!0,w.has(K)&&(H=!0,w.delete(K)),v.needsAnimating[K]=!0;const J=e.getValue(K);J&&(J.liveStyle=!1)};for(const K in I){const J=G[K],A=R[K];if(g.hasOwnProperty(K))continue;let V=!1;xs(J)&&xs(A)?V=!va(J,A)||M:V=J!==A,V?J!=null?q(K):w.add(K):J!==void 0&&w.has(K)?q(K):v.protectedKeys[K]=!0}v.prevProp=b,v.prevResolvedValues=G,v.isActive&&(g={...g,...G}),(s||i)&&e.blockInitialAnimation&&(N=!1);const X=S&&M;N&&(!X||H)&&u.push(...F.map(K=>{const J={type:T};if(typeof K=="string"&&(s||i)&&!X&&e.manuallyAnimateOnMount&&e.parent){const{parent:A}=e,V=tt(A,K);if(A.enteringChildren&&V){const{delayChildren:Y}=V.transition||{};J.delay=Wr(A.enteringChildren,e,Y)}}return{animation:K,options:J}}))}if(w.size){const x={};if(typeof h.initial!="boolean"){const T=tt(e,Array.isArray(h.initial)?h.initial[0]:h.initial);T&&T.transition&&(x.transition=T.transition)}w.forEach(T=>{const v=e.getBaseTarget(T),b=e.getValue(T);b&&(b.liveStyle=!0),x[T]=v??null}),u.push({animation:x})}let y=!!u.length;return s&&(h.initial===!1||h.initial===h.animate)&&!e.manuallyAnimateOnMount&&(y=!1),s=!1,i=!1,y?t(u):Promise.resolve()}function c(l,h){if(n[l].isActive===h)return Promise.resolve();e.variantChildren?.forEach(u=>u.animationState?.setActive(l,h)),n[l].isActive=h;const f=a(l);for(const u in n)n[u].protectedKeys={};return f}return{animateChanges:a,setActive:c,setAnimateFunction:o,getState:()=>n,reset:()=>{n=eo(),i=!0}}}function qh(e,t){return typeof t=="string"?t!==e:Array.isArray(t)?!va(t,e):!1}function Xe(e=!1){return{isActive:e,protectedKeys:{},needsAnimating:{},prevResolvedValues:{}}}function eo(){return{animate:Xe(!0),whileInView:Xe(),whileHover:Xe(),whileTap:Xe(),whileDrag:Xe(),whileFocus:Xe(),exit:Xe()}}function Ms(e,t){e.min=t.min,e.max=t.max}function Re(e,t){Ms(e.x,t.x),Ms(e.y,t.y)}function to(e,t){e.translate=t.translate,e.scale=t.scale,e.originPoint=t.originPoint,e.origin=t.origin}const ka=1e-4,Xh=1-ka,Yh=1+ka,Ta=.01,Zh=0-Ta,Jh=0+Ta;function we(e){return e.max-e.min}function eu(e,t,n){return Math.abs(e-t)<=n}function no(e,t,n,s=.5){e.origin=s,e.originPoint=te(t.min,t.max,e.origin),e.scale=we(n)/we(t),e.translate=te(n.min,n.max,e.origin)-e.originPoint,(e.scale>=Xh&&e.scale<=Yh||isNaN(e.scale))&&(e.scale=1),(e.translate>=Zh&&e.translate<=Jh||isNaN(e.translate))&&(e.translate=0)}function At(e,t,n,s){no(e.x,t.x,n.x,s?s.originX:void 0),no(e.y,t.y,n.y,s?s.originY:void 0)}function so(e,t,n,s=0){const i=s?te(n.min,n.max,s):n.min;e.min=i+t.min,e.max=e.min+we(t)}function tu(e,t,n,s){so(e.x,t.x,n.x,s?.x),so(e.y,t.y,n.y,s?.y)}function io(e,t,n,s=0){const i=s?te(n.min,n.max,s):n.min;e.min=t.min-i,e.max=e.min+we(t)}function bn(e,t,n,s){io(e.x,t.x,n.x,s?.x),io(e.y,t.y,n.y,s?.y)}function oo(e,t,n,s,i){return e-=t,e=xn(e,1/n,s),i!==void 0&&(e=xn(e,1/i,s)),e}function nu(e,t=0,n=1,s=.5,i,r=e,o=e){if(Be.test(t)&&(t=parseFloat(t),t=te(o.min,o.max,t/100)-o.min),typeof t!="number")return;let a=te(r.min,r.max,s);e===r&&(a-=t),e.min=oo(e.min,t,n,a,i),e.max=oo(e.max,t,n,a,i)}function ro(e,t,[n,s,i],r,o){nu(e,t[n],t[s],t[i],t.scale,r,o)}const su=["x","scaleX","originX"],iu=["y","scaleY","originY"];function ao(e,t,n,s){ro(e.x,t,su,n?n.x:void 0,s?s.x:void 0),ro(e.y,t,iu,n?n.y:void 0,s?s.y:void 0)}function lo(e){return e.translate===0&&e.scale===1}function Sa(e){return lo(e.x)&&lo(e.y)}function co(e,t){return e.min===t.min&&e.max===t.max}function ou(e,t){return co(e.x,t.x)&&co(e.y,t.y)}function ho(e,t){return Math.round(e.min)===Math.round(t.min)&&Math.round(e.max)===Math.round(t.max)}function Ca(e,t){return ho(e.x,t.x)&&ho(e.y,t.y)}function uo(e){return we(e.x)/we(e.y)}function fo(e,t){return e.translate===t.translate&&e.scale===t.scale&&e.originPoint===t.originPoint}function Le(e){return[e("x"),e("y")]}function ru(e,t,n){let s="";const i=e.x.translate/t.x,r=e.y.translate/t.y,o=n?.z||0;if((i||r||o)&&(s=`translate3d(${i}px, ${r}px, ${o}px) `),(t.x!==1||t.y!==1)&&(s+=`scale(${1/t.x}, ${1/t.y}) `),n){const{transformPerspective:l,rotate:h,pathRotation:f,rotateX:u,rotateY:w,skewX:g,skewY:m}=n;l&&(s=`perspective(${l}px) ${s}`),h&&(s+=`rotate(${h}deg) `),f&&(s+=`rotate(${f}deg) `),u&&(s+=`rotateX(${u}deg) `),w&&(s+=`rotateY(${w}deg) `),g&&(s+=`skewX(${g}deg) `),m&&(s+=`skewY(${m}deg) `)}const a=e.x.scale*t.x,c=e.y.scale*t.y;return(a!==1||c!==1)&&(s+=`scale(${a}, ${c})`),s||"none"}const au=ni.length,po=e=>typeof e=="string"?parseFloat(e):e,mo=e=>typeof e=="number"||O.test(e);function lu(e,t,n,s,i,r){i?(e.opacity=te(0,n.opacity??1,cu(s)),e.opacityExit=te(t.opacity??1,0,du(s))):r&&(e.opacity=te(t.opacity??1,n.opacity??1,s));for(let o=0;o<au;o++){const a=ni[o];let c=go(t,a),l=go(n,a);if(c===void 0&&l===void 0)continue;c||(c=0),l||(l=0),c===0||l===0||mo(c)===mo(l)?(e[a]=Math.max(te(po(c),po(l),s),0),(Be.test(l)||Be.test(c))&&(e[a]+="%")):e[a]=l}(t.rotate||n.rotate)&&(e.rotate=te(t.rotate||0,n.rotate||0,s))}function go(e,t){return e[t]!==void 0?e[t]:e.borderRadius}const cu=Aa(0,.5,wr),du=Aa(.5,.95,Me);function Aa(e,t,n){return s=>s<e?0:s>t?1:n(jt(e,t,s))}function hu(e,t,n){const s=pe(e)?e:ft(e);return s.start(Js("",s,t,n)),s.animation}function Nt(e,t,n,s={passive:!0}){return e.addEventListener(t,n,s),()=>e.removeEventListener(t,n,s)}const uu=(e,t)=>e.depth-t.depth;class fu{constructor(){this.children=[],this.isDirty=!1}add(t){Fs(this.children,t),this.isDirty=!0}remove(t){fn(this.children,t),this.isDirty=!0}forEach(t){this.isDirty&&this.children.sort(uu),this.isDirty=!1,this.children.forEach(t)}}function pu(e,t){const n=ye.now(),s=({timestamp:i})=>{const r=i-n;r>=t&&(Ke(s),e(r-t))};return ne.setup(s,!0),()=>Ke(s)}function dn(e){return pe(e)?e.get():e}class mu{constructor(){this.members=[]}add(t){Fs(this.members,t);for(let n=this.members.length-1;n>=0;n--){const s=this.members[n];if(s===t||s===this.lead||s===this.prevLead)continue;const i=s.instance;(!i||i.isConnected===!1)&&!s.snapshot&&(fn(this.members,s),s.unmount())}t.scheduleRender()}remove(t){if(fn(this.members,t),t===this.prevLead&&(this.prevLead=void 0),t===this.lead){const n=this.members[this.members.length-1];n&&this.promote(n)}}relegate(t){for(let n=this.members.indexOf(t)-1;n>=0;n--){const s=this.members[n];if(s.isPresent!==!1&&s.instance?.isConnected!==!1)return this.promote(s),!0}return!1}promote(t,n){const s=this.lead;if(t!==s&&(this.prevLead=s,this.lead=t,t.show(),s)){s.updateSnapshot(),t.scheduleRender();const{layoutDependency:i}=s.options,{layoutDependency:r}=t.options;(i===void 0||i!==r)&&(t.resumeFrom=s,n&&(s.preserveOpacity=!0),s.snapshot&&(t.snapshot=s.snapshot,t.snapshot.latestValues=s.animationValues||s.latestValues),t.root?.isUpdating&&(t.isLayoutDirty=!0)),t.options.crossfade===!1&&s.hide()}}exitAnimationComplete(){this.members.forEach(t=>{t.options.onExitComplete?.(),t.resumingFrom?.options.onExitComplete?.()})}scheduleRender(){this.members.forEach(t=>t.instance&&t.scheduleRender(!1))}removeLeadSnapshot(){this.lead?.snapshot&&(this.lead.snapshot=void 0)}}const hn={hasAnimatedSinceResize:!0,hasEverUpdated:!1},Hn=["","X","Y","Z"],gu=1e3;let yu=0;function Wn(e,t,n,s){const{latestValues:i}=t;i[e]&&(n[e]=i[e],t.setStaticValue(e,0),s&&(s[e]=0))}function Pa(e){if(e.hasCheckedOptimisedAppear=!0,e.root===e)return;const{visualElement:t}=e.options;if(!t)return;const n=Qr(t);if(window.MotionHasOptimisedAnimation(n,"transform")){const{layout:i,layoutId:r}=e.options;window.MotionCancelOptimisedAnimation(n,"transform",ne,!(i||r))}const{parent:s}=e;s&&!s.hasCheckedOptimisedAppear&&Pa(s)}function Ea({attachResizeListener:e,defaultParent:t,measureScroll:n,checkIsScrollRoot:s,resetTransform:i}){return class{constructor(o={},a=t?.()){this.id=yu++,this.animationId=0,this.animationCommitId=0,this.children=new Set,this.options={},this.isTreeAnimating=!1,this.isAnimationBlocked=!1,this.isLayoutDirty=!1,this.isProjectionDirty=!1,this.isSharedProjectionDirty=!1,this.isTransformDirty=!1,this.updateManuallyBlocked=!1,this.updateBlockedByResize=!1,this.isUpdating=!1,this.isSVG=!1,this.needsReset=!1,this.shouldResetTransform=!1,this.hasCheckedOptimisedAppear=!1,this.treeScale={x:1,y:1},this.eventHandlers=new Map,this.hasTreeAnimated=!1,this.layoutVersion=0,this.updateScheduled=!1,this.scheduleUpdate=()=>this.update(),this.projectionUpdateScheduled=!1,this.checkUpdateFailed=()=>{this.isUpdating&&(this.isUpdating=!1,this.clearAllSnapshots())},this.updateProjection=()=>{this.projectionUpdateScheduled=!1,this.nodes.forEach(bu),this.nodes.forEach(Au),this.nodes.forEach(Pu),this.nodes.forEach(vu)},this.resolvedRelativeTargetAt=0,this.linkedParentVersion=0,this.hasProjected=!1,this.isVisible=!0,this.animationProgress=0,this.sharedNodes=new Map,this.latestValues=o,this.root=a?a.root||a:this,this.path=a?[...a.path,a]:[],this.parent=a,this.depth=a?a.depth+1:0;for(let c=0;c<this.path.length;c++)this.path[c].shouldResetTransform=!0;this.root===this&&(this.nodes=new fu)}addEventListener(o,a){return this.eventHandlers.has(o)||this.eventHandlers.set(o,new _s),this.eventHandlers.get(o).add(a)}notifyListeners(o,...a){const c=this.eventHandlers.get(o);c&&c.notify(...a)}hasListeners(o){return this.eventHandlers.has(o)}mount(o){if(this.instance)return;this.isSVG=oi(o)&&!bh(o),this.instance=o;const{layoutId:a,layout:c,visualElement:l}=this.options;if(l&&!l.current&&l.mount(o),this.root.nodes.add(this),this.parent&&this.parent.children.add(this),this.root.hasTreeAnimated&&(c||a)&&(this.isLayoutDirty=!0),e){let h,f=0;const u=()=>this.root.updateBlockedByResize=!1;ne.read(()=>{f=window.innerWidth}),e(o,()=>{const w=window.innerWidth;w!==f&&(f=w,this.root.updateBlockedByResize=!0,h&&h(),h=pu(u,250),hn.hasAnimatedSinceResize&&(hn.hasAnimatedSinceResize=!1,this.nodes.forEach(xo)))})}a&&this.root.registerSharedNode(a,this),this.options.animate!==!1&&l&&(a||c)&&this.addEventListener("didUpdate",({delta:h,hasLayoutChanged:f,hasRelativeLayoutChanged:u,layout:w})=>{if(this.isTreeAnimationBlocked()){this.target=void 0,this.relativeTarget=void 0;return}const g=this.options.transition||l.getDefaultTransition()||Ru,{onLayoutAnimationStart:m,onLayoutAnimationComplete:y}=l.getProps(),x=!this.targetLayout||!Ca(this.targetLayout,w),T=!f&&u;if(this.options.layoutRoot||this.resumeFrom||T||f&&(x||!this.currentAnimation)){this.resumeFrom&&(this.resumingFrom=this.resumeFrom,this.resumingFrom.resumingFrom=void 0);const v={...Zs(g,"layout"),onPlay:m,onComplete:y};(l.shouldReduceMotion||this.options.layoutRoot)&&(v.delay=0,v.type=!1),this.startAnimation(v),this.setAnimationOrigin(h,T,v.path)}else f||xo(this),this.isLead()&&this.options.onExitComplete&&this.options.onExitComplete();this.targetLayout=w})}unmount(){this.options.layoutId&&this.willUpdate(),this.root.nodes.remove(this);const o=this.getStack();o&&o.remove(this),this.parent&&this.parent.children.delete(this),this.instance=void 0,this.eventHandlers.clear(),Ke(this.updateProjection)}blockUpdate(){this.updateManuallyBlocked=!0}unblockUpdate(){this.updateManuallyBlocked=!1}isUpdateBlocked(){return this.updateManuallyBlocked||this.updateBlockedByResize}isTreeAnimationBlocked(){return this.isAnimationBlocked||this.parent&&this.parent.isTreeAnimationBlocked()||!1}startUpdate(){this.isUpdateBlocked()||(this.isUpdating=!0,this.nodes&&this.nodes.forEach(Eu),this.animationId++)}getTransformTemplate(){const{visualElement:o}=this.options;return o&&o.getProps().transformTemplate}willUpdate(o=!0){if(this.root.hasTreeAnimated=!0,this.root.isUpdateBlocked()){this.options.onExitComplete&&this.options.onExitComplete();return}if(window.MotionCancelOptimisedAnimation&&!this.hasCheckedOptimisedAppear&&Pa(this),!this.root.isUpdating&&this.root.startUpdate(),this.isLayoutDirty)return;this.isLayoutDirty=!0;for(let h=0;h<this.path.length;h++){const f=this.path[h];f.shouldResetTransform=!0,(typeof f.latestValues.x=="string"||typeof f.latestValues.y=="string")&&(f.isLayoutDirty=!0),f.updateScroll("snapshot"),f.options.layoutRoot&&f.willUpdate(!1)}const{layoutId:a,layout:c}=this.options;if(a===void 0&&!c)return;const l=this.getTransformTemplate();this.prevTransformTemplateValue=l?l(this.latestValues,""):void 0,this.updateSnapshot(),o&&this.notifyListeners("willUpdate")}update(){if(this.updateScheduled=!1,this.isUpdateBlocked()){const c=this.updateBlockedByResize;this.unblockUpdate(),this.updateBlockedByResize=!1,this.clearAllSnapshots(),c&&this.nodes.forEach(Tu),this.nodes.forEach(yo);return}if(this.animationId<=this.animationCommitId){this.nodes.forEach(wo);return}this.animationCommitId=this.animationId,this.isUpdating?(this.isUpdating=!1,this.nodes.forEach(Su),this.nodes.forEach(Cu),this.nodes.forEach(wu),this.nodes.forEach(xu)):this.nodes.forEach(wo),this.clearAllSnapshots();const a=ye.now();fe.delta=$e(0,1e3/60,a-fe.timestamp),fe.timestamp=a,fe.isProcessing=!0,Nn.update.process(fe),Nn.preRender.process(fe),Nn.render.process(fe),fe.isProcessing=!1}didUpdate(){this.updateScheduled||(this.updateScheduled=!0,si.read(this.scheduleUpdate))}clearAllSnapshots(){this.nodes.forEach(ku),this.sharedNodes.forEach(Mu)}scheduleUpdateProjection(){this.projectionUpdateScheduled||(this.projectionUpdateScheduled=!0,ne.preRender(this.updateProjection,!1,!0))}scheduleCheckAfterUnmount(){ne.postRender(()=>{this.isLayoutDirty?this.root.didUpdate():this.root.checkUpdateFailed()})}updateSnapshot(){this.snapshot||!this.instance||(this.snapshot=this.measure(),this.snapshot&&!we(this.snapshot.measuredBox.x)&&!we(this.snapshot.measuredBox.y)&&(this.snapshot=void 0))}updateLayout(){if(!this.instance||(this.updateScroll(),!(this.options.alwaysMeasureLayout&&this.isLead())&&!this.isLayoutDirty))return;if(this.resumeFrom&&!this.resumeFrom.instance)for(let c=0;c<this.path.length;c++)this.path[c].updateScroll();const o=this.layout;this.layout=this.measure(!1),this.layoutVersion++,this.layoutCorrected||(this.layoutCorrected=he()),this.isLayoutDirty=!1,this.projectionDelta=void 0,this.notifyListeners("measure",this.layout.layoutBox);const{visualElement:a}=this.options;a&&a.notify("LayoutMeasure",this.layout.layoutBox,o?o.layoutBox:void 0)}updateScroll(o="measure"){let a=!!(this.options.layoutScroll&&this.instance);if(this.scroll&&this.scroll.animationId===this.root.animationId&&this.scroll.phase===o&&(a=!1),a&&this.instance){const c=s(this.instance);this.scroll={animationId:this.root.animationId,phase:o,isRoot:c,offset:n(this.instance),wasRoot:this.scroll?this.scroll.isRoot:c}}}resetTransform(){if(!i)return;const o=this.isLayoutDirty||this.shouldResetTransform||this.options.alwaysMeasureLayout,a=this.projectionDelta&&!Sa(this.projectionDelta),c=this.getTransformTemplate(),l=c?c(this.latestValues,""):void 0,h=l!==this.prevTransformTemplateValue;o&&this.instance&&(a||Ye(this.latestValues)||h)&&(i(this.instance,l),this.shouldResetTransform=!1,this.scheduleRender())}measure(o=!0){const a=this.measurePageBox();let c=this.removeElementScroll(a);return o&&(c=this.removeTransform(c)),Ou(c),{animationId:this.root.animationId,measuredBox:a,layoutBox:c,latestValues:{},source:this.id}}measurePageBox(){const{visualElement:o}=this.options;if(!o)return he();const a=o.measureViewportBox();if(!(this.scroll?.wasRoot||this.path.some(Nu))){const{scroll:l}=this.root;l&&(Ve(a.x,l.offset.x),Ve(a.y,l.offset.y))}return a}removeElementScroll(o){const a=he();if(Re(a,o),this.scroll?.wasRoot)return a;for(let c=0;c<this.path.length;c++){const l=this.path[c],{scroll:h,options:f}=l;l!==this.root&&h&&f.layoutScroll&&(h.wasRoot&&Re(a,o),Ve(a.x,h.offset.x),Ve(a.y,h.offset.y))}return a}applyTransform(o,a=!1,c){const l=c||he();Re(l,o);for(let h=0;h<this.path.length;h++){const f=this.path[h];!a&&f.options.layoutScroll&&f.scroll&&f!==f.root&&(Ve(l.x,-f.scroll.offset.x),Ve(l.y,-f.scroll.offset.y)),Ye(f.latestValues)&&cn(l,f.latestValues,f.layout?.layoutBox)}return Ye(this.latestValues)&&cn(l,this.latestValues,this.layout?.layoutBox),l}removeTransform(o){const a=he();Re(a,o);for(let c=0;c<this.path.length;c++){const l=this.path[c];if(!Ye(l.latestValues))continue;let h;l.instance&&(As(l.latestValues)&&l.updateSnapshot(),h=he(),Re(h,l.measurePageBox())),ao(a,l.latestValues,l.snapshot?.layoutBox,h)}return Ye(this.latestValues)&&ao(a,this.latestValues),a}setTargetDelta(o){this.targetDelta=o,this.root.scheduleUpdateProjection(),this.isProjectionDirty=!0}setOptions(o){this.options={...this.options,...o,crossfade:o.crossfade!==void 0?o.crossfade:!0}}clearMeasurements(){this.scroll=void 0,this.layout=void 0,this.snapshot=void 0,this.prevTransformTemplateValue=void 0,this.targetDelta=void 0,this.target=void 0,this.isLayoutDirty=!1}forceRelativeParentToResolveTarget(){this.relativeParent&&this.relativeParent.resolvedRelativeTargetAt!==fe.timestamp&&this.relativeParent.resolveTargetDelta(!0)}resolveTargetDelta(o=!1){const a=this.getLead();this.isProjectionDirty||(this.isProjectionDirty=a.isProjectionDirty),this.isTransformDirty||(this.isTransformDirty=a.isTransformDirty),this.isSharedProjectionDirty||(this.isSharedProjectionDirty=a.isSharedProjectionDirty);const c=!!this.resumingFrom||this!==a;if(!(o||c&&this.isSharedProjectionDirty||this.isProjectionDirty||this.parent?.isProjectionDirty||this.attemptToResolveRelativeTarget||this.root.updateBlockedByResize))return;const{layout:h,layoutId:f}=this.options;if(!this.layout||!(h||f))return;this.resolvedRelativeTargetAt=fe.timestamp;const u=this.getClosestProjectingParent();u&&this.linkedParentVersion!==u.layoutVersion&&!u.options.layoutRoot&&this.removeRelativeTarget(),!this.targetDelta&&!this.relativeTarget&&(this.options.layoutAnchor!==!1&&u&&u.layout?this.createRelativeTarget(u,this.layout.layoutBox,u.layout.layoutBox):this.removeRelativeTarget()),!(!this.relativeTarget&&!this.targetDelta)&&(this.target||(this.target=he(),this.targetWithTransforms=he()),this.relativeTarget&&this.relativeTargetOrigin&&this.relativeParent&&this.relativeParent.target?(this.forceRelativeParentToResolveTarget(),tu(this.target,this.relativeTarget,this.relativeParent.target,this.options.layoutAnchor||void 0)):this.targetDelta?(this.resumingFrom?this.applyTransform(this.layout.layoutBox,!1,this.target):Re(this.target,this.layout.layoutBox),ha(this.target,this.targetDelta)):Re(this.target,this.layout.layoutBox),this.attemptToResolveRelativeTarget&&(this.attemptToResolveRelativeTarget=!1,this.options.layoutAnchor!==!1&&u&&!!u.resumingFrom==!!this.resumingFrom&&!u.options.layoutScroll&&u.target&&this.animationProgress!==1?this.createRelativeTarget(u,this.target,u.target):this.relativeParent=this.relativeTarget=void 0))}getClosestProjectingParent(){if(!(!this.parent||As(this.parent.latestValues)||da(this.parent.latestValues)))return this.parent.isProjecting()?this.parent:this.parent.getClosestProjectingParent()}isProjecting(){return!!((this.relativeTarget||this.targetDelta||this.options.layoutRoot)&&this.layout)}createRelativeTarget(o,a,c){this.relativeParent=o,this.linkedParentVersion=o.layoutVersion,this.forceRelativeParentToResolveTarget(),this.relativeTarget=he(),this.relativeTargetOrigin=he(),bn(this.relativeTargetOrigin,a,c,this.options.layoutAnchor||void 0),Re(this.relativeTarget,this.relativeTargetOrigin)}removeRelativeTarget(){this.relativeParent=this.relativeTarget=void 0}calcProjection(){const o=this.getLead(),a=!!this.resumingFrom||this!==o;let c=!0;if((this.isProjectionDirty||this.parent?.isProjectionDirty)&&(c=!1),a&&(this.isSharedProjectionDirty||this.isTransformDirty)&&(c=!1),this.resolvedRelativeTargetAt===fe.timestamp&&(c=!1),c)return;const{layout:l,layoutId:h}=this.options;if(this.isTreeAnimating=!!(this.parent&&this.parent.isTreeAnimating||this.currentAnimation||this.pendingAnimation),this.isTreeAnimating||(this.targetDelta=this.relativeTarget=void 0),!this.layout||!(l||h))return;Re(this.layoutCorrected,this.layout.layoutBox);const f=this.treeScale.x,u=this.treeScale.y;jh(this.layoutCorrected,this.treeScale,this.path,a),o.layout&&!o.target&&(this.treeScale.x!==1||this.treeScale.y!==1)&&(o.target=o.layout.layoutBox,o.targetWithTransforms=he());const{target:w}=o;if(!w){this.prevProjectionDelta&&(this.createProjectionDeltas(),this.scheduleRender());return}!this.projectionDelta||!this.prevProjectionDelta?this.createProjectionDeltas():(to(this.prevProjectionDelta.x,this.projectionDelta.x),to(this.prevProjectionDelta.y,this.projectionDelta.y)),At(this.projectionDelta,this.layoutCorrected,w,this.latestValues),(this.treeScale.x!==f||this.treeScale.y!==u||!fo(this.projectionDelta.x,this.prevProjectionDelta.x)||!fo(this.projectionDelta.y,this.prevProjectionDelta.y))&&(this.hasProjected=!0,this.scheduleRender(),this.notifyListeners("projectionUpdate",w))}hide(){this.isVisible=!1}show(){this.isVisible=!0}scheduleRender(o=!0){if(this.options.visualElement?.scheduleRender(),o){const a=this.getStack();a&&a.scheduleRender()}this.resumingFrom&&!this.resumingFrom.instance&&(this.resumingFrom=void 0)}createProjectionDeltas(){this.prevProjectionDelta=ht(),this.projectionDelta=ht(),this.projectionDeltaWithTransform=ht()}setAnimationOrigin(o,a=!1,c){const l=this.snapshot,h=l?l.latestValues:{},f={...this.latestValues},u=ht();(!this.relativeParent||!this.relativeParent.options.layoutRoot)&&(this.relativeTarget=this.relativeTargetOrigin=void 0),this.attemptToResolveRelativeTarget=!a;const w=he(),g=l?l.source:void 0,m=this.layout?this.layout.source:void 0,y=g!==m,x=this.getStack(),T=!x||x.members.length<=1,v=!!(y&&!T&&this.options.crossfade===!0&&!this.path.some(ju));this.animationProgress=0;let b;const C=c?.interpolateProjection(o);this.mixTargetDelta=P=>{const S=P/1e3,M=C?.(S);M?(u.x.translate=M.x,u.x.scale=te(o.x.scale,1,S),u.x.origin=o.x.origin,u.x.originPoint=o.x.originPoint,u.y.translate=M.y,u.y.scale=te(o.y.scale,1,S),u.y.origin=o.y.origin,u.y.originPoint=o.y.originPoint):(bo(u.x,o.x,S),bo(u.y,o.y,S)),this.setTargetDelta(u),this.relativeTarget&&this.relativeTargetOrigin&&this.layout&&this.relativeParent&&this.relativeParent.layout&&(bn(w,this.layout.layoutBox,this.relativeParent.layout.layoutBox,this.options.layoutAnchor||void 0),Du(this.relativeTarget,this.relativeTargetOrigin,w,S),b&&ou(this.relativeTarget,b)&&(this.isProjectionDirty=!1),b||(b=he()),Re(b,this.relativeTarget)),y&&(this.animationValues=f,lu(f,h,this.latestValues,S,v,T)),M&&M.rotate!==void 0&&(this.animationValues||(this.animationValues=f),this.animationValues.pathRotation=M.rotate),this.root.scheduleUpdateProjection(),this.scheduleRender(),this.animationProgress=S},this.mixTargetDelta(this.options.layoutRoot?1e3:0)}startAnimation(o){this.notifyListeners("animationStart"),this.currentAnimation?.stop(),this.resumingFrom?.currentAnimation?.stop(),this.pendingAnimation&&(Ke(this.pendingAnimation),this.pendingAnimation=void 0),this.pendingAnimation=ne.update(()=>{hn.hasAnimatedSinceResize=!0,this.motionValue||(this.motionValue=ft(0)),this.motionValue.jump(0,!1),this.currentAnimation=hu(this.motionValue,[0,1e3],{...o,velocity:0,isSync:!0,onUpdate:a=>{this.mixTargetDelta(a),o.onUpdate&&o.onUpdate(a)},onComplete:()=>{o.onComplete&&o.onComplete(),this.completeAnimation()}}),this.resumingFrom&&(this.resumingFrom.currentAnimation=this.currentAnimation),this.pendingAnimation=void 0})}completeAnimation(){this.resumingFrom&&(this.resumingFrom.currentAnimation=void 0,this.resumingFrom.preserveOpacity=void 0);const o=this.getStack();o&&o.exitAnimationComplete(),this.resumingFrom=this.currentAnimation=this.animationValues=void 0,this.notifyListeners("animationComplete")}finishAnimation(){this.currentAnimation&&(this.mixTargetDelta&&this.mixTargetDelta(gu),this.currentAnimation.stop()),this.completeAnimation()}applyTransformsToTarget(){const o=this.getLead();let{targetWithTransforms:a,target:c,layout:l,latestValues:h}=o;if(!(!a||!c||!l)){if(this!==o&&this.layout&&l&&Ma(this.options.animationType,this.layout.layoutBox,l.layoutBox)){c=this.target||he();const f=we(this.layout.layoutBox.x);c.x.min=o.target.x.min,c.x.max=c.x.min+f;const u=we(this.layout.layoutBox.y);c.y.min=o.target.y.min,c.y.max=c.y.min+u}Re(a,c),cn(a,h),At(this.projectionDeltaWithTransform,this.layoutCorrected,a,h)}}registerSharedNode(o,a){this.sharedNodes.has(o)||this.sharedNodes.set(o,new mu),this.sharedNodes.get(o).add(a);const l=a.options.initialPromotionConfig;a.promote({transition:l?l.transition:void 0,preserveFollowOpacity:l&&l.shouldPreserveFollowOpacity?l.shouldPreserveFollowOpacity(a):void 0})}isLead(){const o=this.getStack();return o?o.lead===this:!0}getLead(){const{layoutId:o}=this.options;return o?this.getStack()?.lead||this:this}getPrevLead(){const{layoutId:o}=this.options;return o?this.getStack()?.prevLead:void 0}getStack(){const{layoutId:o}=this.options;if(o)return this.root.sharedNodes.get(o)}promote({needsReset:o,transition:a,preserveFollowOpacity:c}={}){const l=this.getStack();l&&l.promote(this,c),o&&(this.projectionDelta=void 0,this.needsReset=!0),a&&this.setOptions({transition:a})}relegate(){const o=this.getStack();return o?o.relegate(this):!1}resetSkewAndRotation(){const{visualElement:o}=this.options;if(!o)return;let a=!1;const{latestValues:c}=o;if((c.z||c.rotate||c.rotateX||c.rotateY||c.rotateZ||c.skewX||c.skewY)&&(a=!0),!a)return;const l={};c.z&&Wn("z",o,l,this.animationValues);for(let h=0;h<Hn.length;h++)Wn(`rotate${Hn[h]}`,o,l,this.animationValues),Wn(`skew${Hn[h]}`,o,l,this.animationValues);o.render();for(const h in l)o.setStaticValue(h,l[h]),this.animationValues&&(this.animationValues[h]=l[h]);o.scheduleRender()}applyProjectionStyles(o,a){if(!this.instance||this.isSVG)return;if(!this.isVisible){o.visibility="hidden";return}const c=this.getTransformTemplate();if(this.needsReset){this.needsReset=!1,o.visibility="",o.opacity="",o.pointerEvents=dn(a?.pointerEvents)||"",o.transform=c?c(this.latestValues,""):"none";return}const l=this.getLead();if(!this.projectionDelta||!this.layout||!l.target){this.options.layoutId&&(o.opacity=this.latestValues.opacity!==void 0?this.latestValues.opacity:1,o.pointerEvents=dn(a?.pointerEvents)||""),this.hasProjected&&!Ye(this.latestValues)&&(o.transform=c?c({},""):"none",this.hasProjected=!1);return}o.visibility="";const h=l.animationValues||l.latestValues;this.applyTransformsToTarget();let f=ru(this.projectionDeltaWithTransform,this.treeScale,h);c&&(f=c(h,f)),o.transform=f;const{x:u,y:w}=this.projectionDelta;o.transformOrigin=`${u.origin*100}% ${w.origin*100}% 0`,l.animationValues?o.opacity=l===this?h.opacity??this.latestValues.opacity??1:this.preserveOpacity?this.latestValues.opacity:h.opacityExit:o.opacity=l===this?h.opacity!==void 0?h.opacity:"":h.opacityExit!==void 0?h.opacityExit:0;for(const g in Es){if(h[g]===void 0)continue;const{correct:m,applyTo:y,isCSSVariable:x}=Es[g],T=f==="none"?h[g]:m(h[g],l);if(y){const v=y.length;for(let b=0;b<v;b++)o[y[b]]=T}else x?this.options.visualElement.renderState.vars[g]=T:o[g]=T}this.options.layoutId&&(o.pointerEvents=l===this?dn(a?.pointerEvents)||"":"none")}clearSnapshot(){this.resumeFrom=this.snapshot=void 0}resetTree(){this.root.nodes.forEach(o=>o.currentAnimation?.stop()),this.root.nodes.forEach(yo),this.root.sharedNodes.clear()}}}function wu(e){e.updateLayout()}function xu(e){const t=e.resumeFrom?.snapshot||e.snapshot;if(e.isLead()&&e.layout&&t&&e.hasListeners("didUpdate")){const{layoutBox:n,measuredBox:s}=e.layout,{animationType:i}=e.options,r=t.source!==e.layout.source;if(i==="size")Le(h=>{const f=r?t.measuredBox[h]:t.layoutBox[h],u=we(f);f.min=n[h].min,f.max=f.min+u});else if(i==="x"||i==="y"){const h=i==="x"?"y":"x";Ms(r?t.measuredBox[h]:t.layoutBox[h],n[h])}else Ma(i,t.layoutBox,n)&&Le(h=>{const f=r?t.measuredBox[h]:t.layoutBox[h],u=we(n[h]);f.max=f.min+u,e.relativeTarget&&!e.currentAnimation&&(e.isProjectionDirty=!0,e.relativeTarget[h].max=e.relativeTarget[h].min+u)});const o=ht();At(o,n,t.layoutBox);const a=ht();r?At(a,e.applyTransform(s,!0),t.measuredBox):At(a,n,t.layoutBox);const c=!Sa(o);let l=!1;if(!e.resumeFrom){const h=e.getClosestProjectingParent();if(h&&!h.resumeFrom){const{snapshot:f,layout:u}=h;if(f&&u){const w=e.options.layoutAnchor||void 0,g=he();bn(g,t.layoutBox,f.layoutBox,w);const m=he();bn(m,n,u.layoutBox,w),Ca(g,m)||(l=!0),h.options.layoutRoot&&(e.relativeTarget=m,e.relativeTargetOrigin=g,e.relativeParent=h)}}}e.notifyListeners("didUpdate",{layout:n,snapshot:t,delta:a,layoutDelta:o,hasLayoutChanged:c,hasRelativeLayoutChanged:l})}else if(e.isLead()){const{onExitComplete:n}=e.options;n&&n()}e.options.transition=void 0}function bu(e){e.parent&&(e.isProjecting()||(e.isProjectionDirty=e.parent.isProjectionDirty),e.isSharedProjectionDirty||(e.isSharedProjectionDirty=!!(e.isProjectionDirty||e.parent.isProjectionDirty||e.parent.isSharedProjectionDirty)),e.isTransformDirty||(e.isTransformDirty=e.parent.isTransformDirty))}function vu(e){e.isProjectionDirty=e.isSharedProjectionDirty=e.isTransformDirty=!1}function ku(e){e.clearSnapshot()}function yo(e){e.clearMeasurements()}function Tu(e){e.isLayoutDirty=!0,e.updateLayout()}function wo(e){e.isLayoutDirty=!1}function Su(e){e.isAnimationBlocked&&e.layout&&!e.isLayoutDirty&&(e.snapshot=e.layout,e.isLayoutDirty=!0)}function Cu(e){const{visualElement:t}=e.options;t&&t.getProps().onBeforeLayoutMeasure&&t.notify("BeforeLayoutMeasure"),e.resetTransform()}function xo(e){e.finishAnimation(),e.targetDelta=e.relativeTarget=e.target=void 0,e.isProjectionDirty=!0}function Au(e){e.resolveTargetDelta()}function Pu(e){e.calcProjection()}function Eu(e){e.resetSkewAndRotation()}function Mu(e){e.removeLeadSnapshot()}function bo(e,t,n){e.translate=te(t.translate,0,n),e.scale=te(t.scale,1,n),e.origin=t.origin,e.originPoint=t.originPoint}function vo(e,t,n,s){e.min=te(t.min,n.min,s),e.max=te(t.max,n.max,s)}function Du(e,t,n,s){vo(e.x,t.x,n.x,s),vo(e.y,t.y,n.y,s)}function ju(e){return e.animationValues&&e.animationValues.opacityExit!==void 0}const Ru={duration:.45,ease:[.4,0,.1,1]},ko=e=>typeof navigator<"u"&&navigator.userAgent&&navigator.userAgent.toLowerCase().includes(e),To=ko("applewebkit/")&&!ko("chrome/")?Math.round:Me;function So(e){e.min=To(e.min),e.max=To(e.max)}function Ou(e){So(e.x),So(e.y)}function Ma(e,t,n){return e==="position"||e==="preserve-aspect"&&!eu(uo(t),uo(n),.2)}function Nu(e){return e!==e.root&&e.scroll?.wasRoot}const Lu=Ea({attachResizeListener:(e,t)=>Nt(e,"resize",t),measureScroll:()=>({x:document.documentElement.scrollLeft||document.body?.scrollLeft||0,y:document.documentElement.scrollTop||document.body?.scrollTop||0}),checkIsScrollRoot:()=>!0}),zn={current:void 0},Da=Ea({measureScroll:e=>({x:e.scrollLeft,y:e.scrollTop}),defaultParent:()=>{if(!zn.current){const e=new Lu({});e.mount(window),e.setOptions({layoutScroll:!0}),zn.current=e}return zn.current},resetTransform:(e,t)=>{e.style.transform=t!==void 0?t:"none"},checkIsScrollRoot:e=>window.getComputedStyle(e).position==="fixed"}),di=p.createContext({transformPagePoint:e=>e,isStatic:!1,reducedMotion:"never"});function Co(e,t){if(typeof e=="function")return e(t);e!=null&&(e.current=t)}function Vu(...e){return t=>{let n=!1;const s=e.map(i=>{const r=Co(i,t);return!n&&typeof r=="function"&&(n=!0),r});if(n)return()=>{for(let i=0;i<s.length;i++){const r=s[i];typeof r=="function"?r():Co(e[i],null)}}}}function Iu(...e){return p.useCallback(Vu(...e),e)}class Bu extends p.Component{getSnapshotBeforeUpdate(t){const n=this.props.childRef.current;if(sn(n)&&t.isPresent&&!this.props.isPresent&&this.props.pop!==!1){const s=n.offsetParent,i=sn(s)&&s.offsetWidth||0,r=sn(s)&&s.offsetHeight||0,o=getComputedStyle(n),a=this.props.sizeRef.current;a.height=parseFloat(o.height),a.width=parseFloat(o.width),a.top=n.offsetTop,a.left=n.offsetLeft,a.right=i-a.width-a.left,a.bottom=r-a.height-a.top,a.direction=o.direction}return null}componentDidUpdate(){}render(){return this.props.children}}function $u({children:e,isPresent:t,anchorX:n,anchorY:s,root:i,pop:r}){const o=p.useId(),a=p.useRef(null),c=p.useRef({width:0,height:0,top:0,left:0,right:0,bottom:0,direction:"ltr"}),{nonce:l}=p.useContext(di),h=r!==!1?e.props?.ref??e?.ref:void 0,f=Iu(a,h);return p.useInsertionEffect(()=>{const{width:u,height:w,top:g,left:m,right:y,bottom:x,direction:T}=c.current;if(t||r===!1||!a.current||!u||!w)return;const v=T==="rtl",b=n==="left"?v?`right: ${y}`:`left: ${m}`:v?`left: ${m}`:`right: ${y}`,C=s==="bottom"?`bottom: ${x}`:`top: ${g}`;a.current.dataset.motionPopId=o;const P=document.createElement("style");l&&(P.nonce=l);const S=i??document.head;return S.appendChild(P),P.sheet&&P.sheet.insertRule(`
          [data-motion-pop-id="${o}"] {
            position: absolute !important;
            width: ${u}px !important;
            height: ${w}px !important;
            ${b}px !important;
            ${C}px !important;
          }
        `),()=>{a.current?.removeAttribute("data-motion-pop-id"),S.contains(P)&&S.removeChild(P)}},[t]),d.jsx(Bu,{isPresent:t,childRef:a,sizeRef:c,pop:r,children:r===!1?e:p.cloneElement(e,{ref:f})})}const Fu=({children:e,initial:t,isPresent:n,onExitComplete:s,custom:i,presenceAffectsLayout:r,mode:o,anchorX:a,anchorY:c,root:l})=>{const h=$s(_u),f=p.useId(),u=p.useRef(n),w=p.useRef(s);un(()=>{u.current=n,w.current=s});let g=!0,m=p.useMemo(()=>(g=!1,{id:f,initial:t,isPresent:n,custom:i,onExitComplete:y=>{h.set(y,!0);for(const x of h.values())if(!x)return;s&&s()},register:y=>(h.set(y,!1),()=>{h.delete(y),!u.current&&!h.size&&w.current?.()})}),[n,h,s]);return r&&g&&(m={...m}),p.useMemo(()=>{h.forEach((y,x)=>h.set(x,!1))},[n]),p.useEffect(()=>{!n&&!h.size&&s&&s()},[n]),e=d.jsx($u,{pop:o==="popLayout",isPresent:n,anchorX:a,anchorY:c,root:l,children:e}),d.jsx(kn.Provider,{value:m,children:e})};function _u(){return new Map}function ja(e=!0){const t=p.useContext(kn);if(t===null)return[!0,null];const{isPresent:n,onExitComplete:s,register:i}=t,r=p.useId();p.useEffect(()=>{if(e)return i(r)},[e]);const o=p.useCallback(()=>e&&s&&s(r),[r,s,e]);return!n&&s?[!1,o]:[!0]}const Gt=e=>e.key||"";function Ao(e){const t=[];return p.Children.forEach(e,n=>{p.isValidElement(n)&&t.push(n)}),t}const Hu=({children:e,custom:t,initial:n=!0,onExitComplete:s,presenceAffectsLayout:i=!0,mode:r="sync",propagate:o=!1,anchorX:a="left",anchorY:c="top",root:l})=>{const[h,f]=ja(o),u=p.useMemo(()=>Ao(e),[e]),w=o&&!h?[]:u.map(Gt),g=p.useRef(!0),m=p.useRef(u),y=$s(()=>new Map),x=p.useRef(new Set),[T,v]=p.useState(u),[b,C]=p.useState(u);un(()=>{o&&!h&&!b.length&&f?.()},[h,o,b.length,f]),un(()=>{g.current=!1,m.current=u;for(let M=0;M<b.length;M++){const N=Gt(b[M]);w.includes(N)?(y.delete(N),x.current.delete(N)):y.get(N)!==!0&&y.set(N,!1)}},[b,w.length,w.join("-")]);const P=[];if(u!==T){let M=[...u],N=0;for(const H of b){const F=w.indexOf(Gt(H));F===-1?(M.splice(N++,0,H),P.push(H)):N=F+P.length+1}return r==="wait"&&P.length&&(M=P),C(Ao(M)),v(u),null}const{forceRender:S}=p.useContext(Bs);return d.jsx(d.Fragment,{children:b.map(M=>{const N=Gt(M),H=o&&!h?!1:u===b||w.includes(N),F=()=>{if(x.current.has(N))return;if(y.has(N))x.current.add(N),y.set(N,!0);else return;let G=!0;y.forEach(R=>{R||(G=!1)}),G&&(S?.(),C(m.current),o&&f?.(),s&&s())};return d.jsx(Fu,{isPresent:H,initial:!g.current||n?void 0:!1,custom:t,presenceAffectsLayout:i,mode:r,root:l,onExitComplete:H?void 0:F,anchorX:a,anchorY:c,children:M},N)})})},Ra=p.createContext({strict:!1}),Po={animation:["animate","variants","whileHover","whileTap","exit","whileInView","whileFocus","whileDrag"],exit:["exit"],drag:["drag","dragControls"],focus:["whileFocus"],hover:["whileHover","onHoverStart","onHoverEnd"],tap:["whileTap","onTap","onTapStart","onTapCancel"],pan:["onPan","onPanStart","onPanSessionStart","onPanEnd"],inView:["whileInView","onViewportEnter","onViewportLeave"],layout:["layout","layoutId"]};let Eo=!1;function Wu(){if(Eo)return;const e={};for(const t in Po)e[t]={isEnabled:n=>Po[t].some(s=>!!n[s])};aa(e),Eo=!0}function Oa(){return Wu(),Ph()}function zu(e){const t=Oa();for(const n in e)t[n]={...t[n],...e[n]};aa(t)}const Pn=p.createContext({});function Uu(e,t){if(An(e)){const{initial:n,animate:s}=e;return{initial:n===!1||Ot(n)?n:void 0,animate:Ot(s)?s:void 0}}return e.inherit!==!1?t:{}}function Gu(e){const{initial:t,animate:n}=Uu(e,p.useContext(Pn));return p.useMemo(()=>({initial:t,animate:n}),[Mo(t),Mo(n)])}function Mo(e){return Array.isArray(e)?e.join(" "):e}const hi=()=>({style:{},transform:{},transformOrigin:{},vars:{}});function Na(e,t,n){for(const s in t)!pe(t[s])&&!pa(s,n)&&(e[s]=t[s])}function Ku({transformTemplate:e},t){return p.useMemo(()=>{const n=hi();return li(n,t,e),Object.assign({},n.vars,n.style)},[t])}function Qu(e,t){const n=e.style||{},s={};return Na(s,n,e),Object.assign(s,Ku(e,t)),s}function qu(e,t){const n={},s=Qu(e,t);return e.drag&&e.dragListener!==!1&&(n.draggable=!1,s.userSelect=s.WebkitUserSelect=s.WebkitTouchCallout="none",s.touchAction=e.drag===!0?"none":`pan-${e.drag==="x"?"y":"x"}`),e.tabIndex===void 0&&(e.onTap||e.onTapStart||e.whileTap)&&(n.tabIndex=0),n.style=s,n}const La=()=>({...hi(),attrs:{}});function Xu(e,t,n,s){const i=p.useMemo(()=>{const r=La();return ga(r,t,wa(s),e.transformTemplate,e.style),{...r.attrs,style:{...r.style}}},[t]);if(e.style){const r={};Na(r,e.style,e),i.style={...r,...i.style}}return i}const Yu=new Set(["animate","exit","variants","initial","style","values","variants","transition","transformTemplate","custom","inherit","onBeforeLayoutMeasure","onAnimationStart","onAnimationComplete","onUpdate","onDragStart","onDrag","onDragEnd","onMeasureDragConstraints","onDirectionLock","onDragTransitionEnd","_dragX","_dragY","onHoverStart","onHoverEnd","onViewportEnter","onViewportLeave","globalTapTarget","propagate","ignoreStrict","viewport"]);function vn(e){return e.startsWith("while")||e.startsWith("drag")&&e!=="draggable"||e.startsWith("layout")||e.startsWith("onTap")||e.startsWith("onPan")||e.startsWith("onLayout")||Yu.has(e)}function Zu(e,t){return e.startsWith("on")?!vn(e):t?.(e)??!vn(e)}function Ju(e,t,n,s){const i={};for(const r in e)r==="values"&&typeof e.values=="object"||pe(e[r])||(Zu(r,s)||n===!0&&vn(r)||!t&&!vn(r)||e.draggable&&r.startsWith("onDrag"))&&(i[r]=e[r]);return i}const ef=["animate","circle","defs","desc","ellipse","g","image","line","filter","marker","mask","metadata","path","pattern","polygon","polyline","rect","stop","switch","symbol","svg","text","tspan","use","view"];function ui(e){return typeof e!="string"||e.includes("-")?!1:!!(ef.indexOf(e)>-1||/[A-Z]/u.test(e))}function tf(e,t,n,{latestValues:s},i,r=!1,o,a){const l=(o??ui(e)?Xu:qu)(t,s,i,e),h=Ju(t,typeof e=="string",r,a),f=e!==p.Fragment?{...h,...l,ref:n}:{},{children:u}=t,w=p.useMemo(()=>pe(u)?u.get():u,[u]);return p.createElement(e,{...f,children:w})}function nf({scrapeMotionValuesFromProps:e,createRenderState:t},n,s,i){return{latestValues:sf(n,s,i,e),renderState:t()}}function sf(e,t,n,s){const i={},r=s(e,{});for(const u in r)i[u]=dn(r[u]);let{initial:o,animate:a}=e;const c=An(e),l=oa(e);t&&l&&!c&&e.inherit!==!1&&(o===void 0&&(o=t.initial),a===void 0&&(a=t.animate));let h=n?n.initial===!1:!1;h=h||o===!1;const f=h?a:o;if(f&&typeof f!="boolean"&&!Cn(f)){const u=Array.isArray(f)?f:[f];for(let w=0;w<u.length;w++){const g=ei(e,u[w]);if(g){const{transitionEnd:m,transition:y,...x}=g;for(const T in x){let v=x[T];if(Array.isArray(v)){const b=h?v.length-1:0;v=v[b]}v!==null&&(i[T]=v)}for(const T in m)i[T]=m[T]}}}return i}const Va=e=>(t,n)=>{const s=p.useContext(Pn),i=p.useContext(kn),r=()=>nf(e,t,s,i);return n?r():$s(r)},of=Va({scrapeMotionValuesFromProps:ci,createRenderState:hi}),rf=Va({scrapeMotionValuesFromProps:xa,createRenderState:La}),af=Symbol.for("motionComponentSymbol");function lf(e,t,n){const s=p.useRef(n);p.useInsertionEffect(()=>{s.current=n});const i=p.useRef(null);return p.useCallback(r=>{r&&e.onMount?.(r),t&&(r?t.mount(r):t.unmount());const o=s.current;if(typeof o=="function")if(r){const a=o(r);typeof a=="function"&&(i.current=a)}else i.current?(i.current(),i.current=null):o(r);else o&&(o.current=r)},[t])}const Ia=p.createContext({});function lt(e){return e&&typeof e=="object"&&Object.prototype.hasOwnProperty.call(e,"current")}function cf(e,t,n,s,i,r){const{visualElement:o}=p.useContext(Pn),a=p.useContext(Ra),c=p.useContext(kn),l=p.useContext(di),h=l.reducedMotion,f=l.skipAnimations,u=p.useRef(null),w=p.useRef(!1);s=s||a.renderer,!u.current&&s&&(u.current=s(e,{visualState:t,parent:o,props:n,presenceContext:c,blockInitialAnimation:c?c.initial===!1:!1,reducedMotionConfig:h,skipAnimations:f,isSVG:r}),w.current&&u.current&&(u.current.manuallyAnimateOnMount=!0));const g=u.current,m=p.useContext(Ia);g&&!g.projection&&i&&(g.type==="html"||g.type==="svg")&&df(u.current,n,i,m);const y=p.useRef(!1);p.useInsertionEffect(()=>{g&&y.current&&g.update(n,c)});const x=n[Kr],T=p.useRef(!!x&&typeof window<"u"&&!window.MotionHandoffIsComplete?.(x)&&window.MotionHasOptimisedAnimation?.(x));return un(()=>{w.current=!0,g&&(y.current=!0,window.MotionIsMounted=!0,g.updateFeatures(),g.scheduleRenderMicrotask(),T.current&&g.animationState&&g.animationState.animateChanges())}),p.useEffect(()=>{g&&(!T.current&&g.animationState&&g.animationState.animateChanges(),T.current&&(queueMicrotask(()=>{window.MotionHandoffMarkAsComplete?.(x)}),T.current=!1),g.enteringChildren=void 0)}),g}function df(e,t,n,s){const{layoutId:i,layout:r,drag:o,dragConstraints:a,layoutScroll:c,layoutRoot:l,layoutAnchor:h,layoutCrossfade:f}=t;e.projection=new n(e.latestValues,t["data-framer-portal-id"]?void 0:Ba(e.parent)),e.projection.setOptions({layoutId:i,layout:r,alwaysMeasureLayout:!!o||a&&lt(a),visualElement:e,animationType:typeof r=="string"?r:"both",initialPromotionConfig:s,crossfade:f,layoutScroll:c,layoutRoot:l,layoutAnchor:h})}function Ba(e){if(e)return e.options.allowProjection!==!1?e.projection:Ba(e.parent)}function Un(e,{forwardMotionProps:t=!1,type:n}={},s,i){s&&zu(s);const r=n?n==="svg":ui(e),o=r?rf:of;function a(l,h){let f;const u={...p.useContext(di),...l,layoutId:hf(l)},{isStatic:w,isValidProp:g}=u,m=Gu(l),y=o(l,w);if(!w&&typeof window<"u"){uf();const x=ff(u);f=x.MeasureLayout,m.visualElement=cf(e,y,u,i,x.ProjectionNode,r)}return d.jsxs(Pn.Provider,{value:m,children:[f&&m.visualElement?d.jsx(f,{visualElement:m.visualElement,...u}):null,tf(e,l,lf(y,m.visualElement,h),y,w,t,r,g)]})}a.displayName=`motion.${typeof e=="string"?e:`create(${e.displayName??e.name??""})`}`;const c=p.forwardRef(a);return c[af]=e,c}function hf({layoutId:e}){const t=p.useContext(Bs).id;return t&&e!==void 0?t+"-"+e:e}function uf(e,t){p.useContext(Ra).strict}function ff(e){const t=Oa(),{drag:n,layout:s}=t;if(!n&&!s)return{};const i={...n,...s};return{MeasureLayout:n?.isEnabled(e)||s?.isEnabled(e)?i.MeasureLayout:void 0,ProjectionNode:i.ProjectionNode}}function pf(e,t){if(typeof Proxy>"u")return Un;const n=new Map,s=(r,o)=>Un(r,o,e,t),i=(r,o)=>s(r,o);return new Proxy(i,{get:(r,o)=>o==="create"?s:(n.has(o)||n.set(o,Un(o,void 0,e,t)),n.get(o))})}const mf=(e,t)=>t.isSVG??ui(e)?new Wh(t):new Bh(t,{allowProjection:e!==p.Fragment});class gf extends Qe{constructor(t){super(t),t.animationState||(t.animationState=Qh(t))}updateAnimationControlsSubscription(){const{animate:t}=this.node.getProps();Cn(t)&&(this.unmountControls=t.subscribe(this.node))}mount(){this.updateAnimationControlsSubscription()}update(){const{animate:t}=this.node.getProps(),{animate:n}=this.node.prevProps||{};t!==n&&this.updateAnimationControlsSubscription()}unmount(){this.node.animationState.reset(),this.unmountControls?.()}}let yf=0;class wf extends Qe{constructor(){super(...arguments),this.id=yf++,this.isExitComplete=!1}update(){if(!this.node.presenceContext)return;const{isPresent:t,onExitComplete:n}=this.node.presenceContext,{isPresent:s}=this.node.prevPresenceContext||{};if(!this.node.animationState||t===s)return;if(t&&s===!1){if(this.isExitComplete){const{initial:r,custom:o}=this.node.getProps();if(typeof r=="string"||typeof r=="object"&&r!==null&&!Array.isArray(r)){const a=tt(this.node,r,o);if(a){const{transition:c,transitionEnd:l,...h}=a;for(const f in h)this.node.getValue(f)?.jump(h[f])}}this.node.animationState.reset(),this.node.animationState.animateChanges()}else this.node.animationState.setActive("exit",!1);this.isExitComplete=!1;return}const i=this.node.animationState.setActive("exit",!t);n&&!t&&i.then(()=>{this.isExitComplete=!0,n(this.id)})}mount(){const{register:t,onExitComplete:n}=this.node.presenceContext||{};n&&n(this.id),t&&(this.unmount=t(this.id))}unmount(){}}const xf={animation:{Feature:gf},exit:{Feature:wf}};function Bt(e){return{point:{x:e.pageX,y:e.pageY}}}const bf=e=>t=>ii(t)&&e(t,Bt(t));function Pt(e,t,n,s){return Nt(e,t,bf(n),s)}const $a=({current:e})=>e?e.ownerDocument.defaultView:null,Do=(e,t)=>Math.abs(e-t);function vf(e,t){const n=Do(e.x,t.x),s=Do(e.y,t.y);return Math.sqrt(n**2+s**2)}const jo=new Set(["auto","scroll"]);class Fa{constructor(t,n,{transformPagePoint:s,contextWindow:i=window,dragSnapToOrigin:r=!1,distanceThreshold:o=3,element:a}={}){if(this.startEvent=null,this.lastMoveEvent=null,this.lastMoveEventInfo=null,this.lastRawMoveEventInfo=null,this.handlers={},this.contextWindow=window,this.scrollPositions=new Map,this.removeScrollListeners=null,this.onElementScroll=g=>{this.handleScroll(g.target)},this.onWindowScroll=()=>{this.handleScroll(window)},this.updatePoint=()=>{if(!(this.lastMoveEvent&&this.lastMoveEventInfo))return;this.lastRawMoveEventInfo&&(this.lastMoveEventInfo=Kt(this.lastRawMoveEventInfo,this.transformPagePoint));const g=Gn(this.lastMoveEventInfo,this.history),m=this.startEvent!==null,y=vf(g.offset,{x:0,y:0})>=this.distanceThreshold;if(!m&&!y)return;const{point:x}=g,{timestamp:T}=fe;this.history.push({...x,timestamp:T});const{onStart:v,onMove:b}=this.handlers;m||(v&&v(this.lastMoveEvent,g),this.startEvent=this.lastMoveEvent),b&&b(this.lastMoveEvent,g)},this.handlePointerMove=(g,m)=>{this.lastMoveEvent=g,this.lastRawMoveEventInfo=m,this.lastMoveEventInfo=Kt(m,this.transformPagePoint),ne.update(this.updatePoint,!0)},this.handlePointerUp=(g,m)=>{this.end();const{onEnd:y,onSessionEnd:x,resumeAnimation:T}=this.handlers;if((this.dragSnapToOrigin||!this.startEvent)&&T&&T(),!(this.lastMoveEvent&&this.lastMoveEventInfo))return;const v=Gn(g.type==="pointercancel"?this.lastMoveEventInfo:Kt(m,this.transformPagePoint),this.history);this.startEvent&&y&&y(g,v),x&&x(g,v)},!ii(t))return;this.dragSnapToOrigin=r,this.handlers=n,this.transformPagePoint=s,this.distanceThreshold=o,this.contextWindow=i||window;const c=Bt(t),l=Kt(c,this.transformPagePoint),{point:h}=l,{timestamp:f}=fe;this.history=[{...h,timestamp:f}];const{onSessionStart:u}=n;u&&u(t,Gn(l,this.history));const w={passive:!0,capture:!0};this.removeListeners=Lt(Pt(this.contextWindow,"pointermove",this.handlePointerMove,w),Pt(this.contextWindow,"pointerup",this.handlePointerUp,w),Pt(this.contextWindow,"pointercancel",this.handlePointerUp,w)),a&&this.startScrollTracking(a)}startScrollTracking(t){let n=t.parentElement;for(;n;){const s=getComputedStyle(n);(jo.has(s.overflowX)||jo.has(s.overflowY))&&this.scrollPositions.set(n,{x:n.scrollLeft,y:n.scrollTop}),n=n.parentElement}this.scrollPositions.set(window,{x:window.scrollX,y:window.scrollY}),window.addEventListener("scroll",this.onElementScroll,{capture:!0}),window.addEventListener("scroll",this.onWindowScroll),this.removeScrollListeners=()=>{window.removeEventListener("scroll",this.onElementScroll,{capture:!0}),window.removeEventListener("scroll",this.onWindowScroll)}}handleScroll(t){const n=this.scrollPositions.get(t);if(!n)return;const s=t===window,i=s?{x:window.scrollX,y:window.scrollY}:{x:t.scrollLeft,y:t.scrollTop},r={x:i.x-n.x,y:i.y-n.y};r.x===0&&r.y===0||(s?this.lastMoveEventInfo&&(this.lastMoveEventInfo.point.x+=r.x,this.lastMoveEventInfo.point.y+=r.y):this.history.length>0&&(this.history[0].x-=r.x,this.history[0].y-=r.y),this.scrollPositions.set(t,i),ne.update(this.updatePoint,!0))}updateHandlers(t){this.handlers=t}end(){this.removeListeners&&this.removeListeners(),this.removeScrollListeners&&this.removeScrollListeners(),this.scrollPositions.clear(),Ke(this.updatePoint)}}function Kt(e,t){return t?{point:t(e.point)}:e}function Ro(e,t){return{x:e.x-t.x,y:e.y-t.y}}function Gn({point:e},t){return{point:e,delta:Ro(e,_a(t)),offset:Ro(e,kf(t)),velocity:Tf(t,.1)}}function kf(e){return e[0]}function _a(e){return e[e.length-1]}function Tf(e,t){if(e.length<2)return{x:0,y:0};let n=e.length-1,s=null;const i=_a(e);for(;n>=0&&(s=e[n],!(i.timestamp-s.timestamp>De(t)));)n--;if(!s)return{x:0,y:0};s===e[0]&&e.length>2&&i.timestamp-s.timestamp>De(t)*2&&(s=e[1]);const r=Ee(i.timestamp-s.timestamp);if(r===0)return{x:0,y:0};const o={x:(i.x-s.x)/r,y:(i.y-s.y)/r};return o.x===1/0&&(o.x=0),o.y===1/0&&(o.y=0),o}function Sf(e,{min:t,max:n},s){return t!==void 0&&e<t?e=s?te(t,e,s.min):Math.max(e,t):n!==void 0&&e>n&&(e=s?te(n,e,s.max):Math.min(e,n)),e}function Oo(e,t,n){return{min:t!==void 0?e.min+t:void 0,max:n!==void 0?e.max+n-(e.max-e.min):void 0}}function Cf(e,{top:t,left:n,bottom:s,right:i}){return{x:Oo(e.x,n,i),y:Oo(e.y,t,s)}}function No(e,t){let n=t.min-e.min,s=t.max-e.max;return t.max-t.min<e.max-e.min&&([n,s]=[s,n]),{min:n,max:s}}function Af(e,t){return{x:No(e.x,t.x),y:No(e.y,t.y)}}function Pf(e,t){let n=.5;const s=we(e),i=we(t);return i>s?n=jt(t.min,t.max-s,e.min):s>i&&(n=jt(e.min,e.max-i,t.min)),$e(0,1,n)}function Ef(e,t){const n={};return t.min!==void 0&&(n.min=t.min-e.min),t.max!==void 0&&(n.max=t.max-e.min),n}const Ds=.35;function Mf(e=Ds){return e===!1?e=0:e===!0&&(e=Ds),{x:Lo(e,"left","right"),y:Lo(e,"top","bottom")}}function Lo(e,t,n){return{min:Vo(e,t),max:Vo(e,n)}}function Vo(e,t){return typeof e=="number"?e:e[t]||0}const Df=new WeakMap;class jf{constructor(t){this.openDragLock=null,this.isDragging=!1,this.currentDirection=null,this.originPoint={x:0,y:0},this.constraints=!1,this.hasMutatedConstraints=!1,this.elastic=he(),this.latestPointerEvent=null,this.latestPanInfo=null,this.visualElement=t}start(t,{snapToCursor:n=!1,distanceThreshold:s}={}){const{presenceContext:i}=this.visualElement;if(i&&i.isPresent===!1)return;const r=f=>{n&&this.snapToCursor(Bt(f).point),this.stopAnimation()},o=(f,u)=>{const{drag:w,dragPropagation:g,onDragStart:m}=this.getProps();if(w&&!g&&(this.openDragLock&&this.openDragLock(),this.openDragLock=sh(w),!this.openDragLock))return;this.latestPointerEvent=f,this.latestPanInfo=u,this.isDragging=!0,this.currentDirection=null,this.resolveConstraints(),this.visualElement.projection&&(this.visualElement.projection.isAnimationBlocked=!0,this.visualElement.projection.target=void 0),Le(x=>{let T=this.getAxisMotionValue(x).get()||0;if(Be.test(T)){const{projection:v}=this.visualElement;if(v&&v.layout){const b=v.layout.layoutBox[x];b&&(T=we(b)*(parseFloat(T)/100))}}this.originPoint[x]=T}),m&&ne.update(()=>m(f,u),!1,!0),bs(this.visualElement,"transform");const{animationState:y}=this.visualElement;y&&y.setActive("whileDrag",!0)},a=(f,u)=>{this.latestPointerEvent=f,this.latestPanInfo=u;const{dragPropagation:w,dragDirectionLock:g,onDirectionLock:m,onDrag:y}=this.getProps();if(!w&&!this.openDragLock)return;const{offset:x}=u;if(g&&this.currentDirection===null){this.currentDirection=Of(x),this.currentDirection!==null&&m&&m(this.currentDirection);return}this.updateAxis("x",u.point,x),this.updateAxis("y",u.point,x),this.visualElement.render(),y&&ne.update(()=>y(f,u),!1,!0)},c=(f,u)=>{this.latestPointerEvent=f,this.latestPanInfo=u,this.stop(f,u),this.latestPointerEvent=null,this.latestPanInfo=null},l=()=>{const{dragSnapToOrigin:f}=this.getProps();(f||this.constraints)&&this.startAnimation({x:0,y:0})},{dragSnapToOrigin:h}=this.getProps();this.panSession=new Fa(t,{onSessionStart:r,onStart:o,onMove:a,onSessionEnd:c,resumeAnimation:l},{transformPagePoint:this.visualElement.getTransformPagePoint(),dragSnapToOrigin:h,distanceThreshold:s,contextWindow:$a(this.visualElement),element:this.visualElement.current})}stop(t,n){const s=t||this.latestPointerEvent,i=n||this.latestPanInfo,r=this.isDragging;if(this.cancel(),!r||!i||!s)return;const{velocity:o}=i;this.startAnimation(o);const{onDragEnd:a}=this.getProps();a&&ne.postRender(()=>a(s,i))}cancel(){this.isDragging=!1;const{projection:t,animationState:n}=this.visualElement;t&&(t.isAnimationBlocked=!1),this.endPanSession();const{dragPropagation:s}=this.getProps();!s&&this.openDragLock&&(this.openDragLock(),this.openDragLock=null),n&&n.setActive("whileDrag",!1)}endPanSession(){this.panSession&&this.panSession.end(),this.panSession=void 0}updateAxis(t,n,s){const{drag:i}=this.getProps();if(!s||!Qt(t,i,this.currentDirection))return;const r=this.getAxisMotionValue(t);let o=this.originPoint[t]+s[t];this.constraints&&this.constraints[t]&&(o=Sf(o,this.constraints[t],this.elastic[t])),r.set(o)}resolveConstraints(){const{dragConstraints:t,dragElastic:n}=this.getProps(),s=this.visualElement.projection&&!this.visualElement.projection.layout?this.visualElement.projection.measure(!1):this.visualElement.projection?.layout,i=this.constraints;t&&lt(t)?this.constraints||(this.constraints=this.resolveRefConstraints()):t&&s?this.constraints=Cf(s.layoutBox,t):this.constraints=!1,this.elastic=Mf(n),i!==this.constraints&&!lt(t)&&s&&this.constraints&&!this.hasMutatedConstraints&&Le(r=>{this.constraints!==!1&&this.getAxisMotionValue(r)&&(this.constraints[r]=Ef(s.layoutBox[r],this.constraints[r]))})}resolveRefConstraints(){const{dragConstraints:t,onMeasureDragConstraints:n}=this.getProps();if(!t||!lt(t))return!1;const s=t.current,{projection:i}=this.visualElement;if(!i||!i.layout)return!1;i.root&&(i.root.scroll=void 0,i.root.updateScroll());const r=Rh(s,i.root,this.visualElement.getTransformPagePoint());let o=Af(i.layout.layoutBox,r);if(n){const a=n(Mh(o));this.hasMutatedConstraints=!!a,a&&(o=ca(a))}return o}startAnimation(t){const{drag:n,dragMomentum:s,dragElastic:i,dragTransition:r,dragSnapToOrigin:o,onDragTransitionEnd:a}=this.getProps(),c=this.constraints||{},l=Le(h=>{if(!Qt(h,n,this.currentDirection))return;let f=c&&c[h]||{};(o===!0||o===h)&&(f={min:0,max:0});const u=i?200:1e6,w=i?40:1e7,g={type:"inertia",velocity:s?t[h]:0,bounceStiffness:u,bounceDamping:w,timeConstant:750,restDelta:1,restSpeed:10,...r,...f};return this.startAxisValueAnimation(h,g)});return Promise.all(l).then(a)}startAxisValueAnimation(t,n){const s=this.getAxisMotionValue(t);return bs(this.visualElement,t),s.start(Js(t,s,0,n,this.visualElement,!1))}stopAnimation(){Le(t=>this.getAxisMotionValue(t).stop())}getAxisMotionValue(t){const n=`_drag${t.toUpperCase()}`,i=this.visualElement.getProps()[n];return i||this.visualElement.getValue(t,this.visualElement.latestValues[t]??0)}snapToCursor(t){Le(n=>{const{drag:s}=this.getProps();if(!Qt(n,s,this.currentDirection))return;const{projection:i}=this.visualElement,r=this.getAxisMotionValue(n);if(i&&i.layout){const{min:o,max:a}=i.layout.layoutBox[n],c=r.get()||0;r.set(t[n]-te(o,a,.5)+c)}})}scalePositionWithinConstraints(){if(!this.visualElement.current)return;const{drag:t,dragConstraints:n}=this.getProps(),{projection:s}=this.visualElement;if(!lt(n)||!s||!this.constraints)return;this.stopAnimation();const i={x:0,y:0};Le(o=>{const a=this.getAxisMotionValue(o);if(a&&this.constraints!==!1){const c=a.get();i[o]=Pf({min:c,max:c},this.constraints[o])}});const{transformTemplate:r}=this.visualElement.getProps();this.visualElement.current.style.transform=r?r({},""):"none",s.root&&s.root.updateScroll(),s.updateLayout(),this.constraints=!1,this.resolveConstraints(),Le(o=>{if(!Qt(o,t,null))return;const a=this.getAxisMotionValue(o),{min:c,max:l}=this.constraints[o];a.set(te(c,l,i[o]))}),this.visualElement.render()}addListeners(){if(!this.visualElement.current)return;Df.set(this.visualElement,this);const t=this.visualElement.current,n=Pt(t,"pointerdown",l=>{const{drag:h,dragListener:f=!0}=this.getProps(),u=l.target,w=u!==t&&ch(u);h&&f&&!w&&this.start(l)});let s;const i=()=>{const{dragConstraints:l}=this.getProps();lt(l)&&l.current&&(this.constraints=this.resolveRefConstraints(),s||(s=Rf(t,l.current,()=>this.scalePositionWithinConstraints())))},{projection:r}=this.visualElement,o=r.addEventListener("measure",i);r&&!r.layout&&(r.root&&r.root.updateScroll(),r.updateLayout()),ne.read(i);const a=Nt(window,"resize",()=>this.scalePositionWithinConstraints()),c=r.addEventListener("didUpdate",(({delta:l,hasLayoutChanged:h})=>{this.isDragging&&h&&(Le(f=>{const u=this.getAxisMotionValue(f);u&&(this.originPoint[f]+=l[f].translate,u.set(u.get()+l[f].translate))}),this.visualElement.render())}));return()=>{a(),n(),o(),c&&c(),s&&s()}}getProps(){const t=this.visualElement.getProps(),{drag:n=!1,dragDirectionLock:s=!1,dragPropagation:i=!1,dragConstraints:r=!1,dragElastic:o=Ds,dragMomentum:a=!0}=t;return{...t,drag:n,dragDirectionLock:s,dragPropagation:i,dragConstraints:r,dragElastic:o,dragMomentum:a}}}function Io(e){let t=!0;return()=>{if(t){t=!1;return}e()}}function Rf(e,t,n){const s=Wi(e,Io(n)),i=Wi(t,Io(n));return()=>{s(),i()}}function Qt(e,t,n){return(t===!0||t===e)&&(n===null||n===e)}function Of(e,t=10){let n=null;return Math.abs(e.y)>t?n="y":Math.abs(e.x)>t&&(n="x"),n}class Nf extends Qe{constructor(t){super(t),this.removeGroupControls=Me,this.removeListeners=Me,this.controls=new jf(t)}mount(){const{dragControls:t}=this.node.getProps();t&&(this.removeGroupControls=t.subscribe(this.controls)),this.removeListeners=this.controls.addListeners()||Me}update(){const{dragControls:t}=this.node.getProps(),{dragControls:n}=this.node.prevProps||{};t!==n&&(this.removeGroupControls(),t&&(this.removeGroupControls=t.subscribe(this.controls)))}unmount(){this.removeGroupControls(),this.removeListeners(),this.controls.isDragging||this.controls.endPanSession()}}const Kn=e=>(t,n)=>{e&&ne.update(()=>e(t,n),!1,!0)};class Lf extends Qe{constructor(){super(...arguments),this.removePointerDownListener=Me}onPointerDown(t){this.session=new Fa(t,this.createPanHandlers(),{transformPagePoint:this.node.getTransformPagePoint(),contextWindow:$a(this.node)})}createPanHandlers(){const{onPanSessionStart:t,onPanStart:n,onPan:s,onPanEnd:i}=this.node.getProps();return{onSessionStart:Kn(t),onStart:Kn(n),onMove:Kn(s),onEnd:(r,o)=>{delete this.session,i&&ne.postRender(()=>i(r,o))}}}mount(){this.removePointerDownListener=Pt(this.node.current,"pointerdown",t=>this.onPointerDown(t))}update(){this.session&&this.session.updateHandlers(this.createPanHandlers())}unmount(){this.removePointerDownListener(),this.session&&this.session.end()}}let Qn=!1;class Vf extends p.Component{componentDidMount(){const{visualElement:t,layoutGroup:n,switchLayoutGroup:s,layoutId:i}=this.props,{projection:r}=t;r&&(n.group&&n.group.add(r),s&&s.register&&i&&s.register(r),Qn&&r.root.didUpdate(),r.addEventListener("animationComplete",()=>{this.safeToRemove()}),r.setOptions({...r.options,layoutDependency:this.props.layoutDependency,onExitComplete:()=>this.safeToRemove()})),hn.hasEverUpdated=!0}getSnapshotBeforeUpdate(t){const{layoutDependency:n,visualElement:s,drag:i,isPresent:r}=this.props,{projection:o}=s;return o&&(o.isPresent=r,t.layoutDependency!==n&&o.setOptions({...o.options,layoutDependency:n}),Qn=!0,i||t.layoutDependency!==n||n===void 0||t.isPresent!==r?o.willUpdate():this.safeToRemove(),t.isPresent!==r&&(r?o.promote():o.relegate()||ne.postRender(()=>{const a=o.getStack();(!a||!a.members.length)&&this.safeToRemove()}))),null}componentDidUpdate(){const{visualElement:t,layoutAnchor:n}=this.props,{projection:s}=t;s&&(s.options.layoutAnchor=n,s.root.didUpdate(),si.postRender(()=>{!s.currentAnimation&&s.isLead()&&this.safeToRemove()}))}componentWillUnmount(){const{visualElement:t,layoutGroup:n,switchLayoutGroup:s}=this.props,{projection:i}=t;Qn=!0,i&&(i.scheduleCheckAfterUnmount(),n&&n.group&&n.group.remove(i),s&&s.deregister&&s.deregister(i))}safeToRemove(){const{safeToRemove:t}=this.props;t&&t()}render(){return null}}function Ha(e){const[t,n]=ja(),s=p.useContext(Bs);return d.jsx(Vf,{...e,layoutGroup:s,switchLayoutGroup:p.useContext(Ia),isPresent:t,safeToRemove:n})}const If={pan:{Feature:Lf},drag:{Feature:Nf,ProjectionNode:Da,MeasureLayout:Ha}};function Bo(e,t,n){const{props:s}=e;e.animationState&&s.whileHover&&e.animationState.setActive("whileHover",n==="Start");const i="onHover"+n,r=s[i];r&&ne.postRender(()=>r(t,Bt(t)))}class Bf extends Qe{mount(){const{current:t}=this.node;t&&(this.unmount=oh(t,(n,s)=>(Bo(this.node,s,"Start"),i=>Bo(this.node,i,"End"))))}unmount(){}}class $f extends Qe{constructor(){super(...arguments),this.isActive=!1}onFocus(){let t=!1;try{t=this.node.current.matches(":focus-visible")}catch{t=!0}!t||!this.node.animationState||(this.node.animationState.setActive("whileFocus",!0),this.isActive=!0)}onBlur(){!this.isActive||!this.node.animationState||(this.node.animationState.setActive("whileFocus",!1),this.isActive=!1)}mount(){this.unmount=Lt(Nt(this.node.current,"focus",()=>this.onFocus()),Nt(this.node.current,"blur",()=>this.onBlur()))}unmount(){}}function $o(e,t,n){const{props:s}=e;if(e.current instanceof HTMLButtonElement&&e.current.disabled)return;e.animationState&&s.whileTap&&e.animationState.setActive("whileTap",n==="Start");const i="onTap"+(n==="End"?"":n),r=s[i];r&&ne.postRender(()=>r(t,Bt(t)))}class Ff extends Qe{mount(){const{current:t}=this.node;if(!t)return;const{globalTapTarget:n,propagate:s}=this.node.props;this.unmount=hh(t,(i,r)=>($o(this.node,r,"Start"),(o,{success:a})=>$o(this.node,o,a?"End":"Cancel")),{useGlobalTarget:n,stopPropagation:s?.tap===!1})}unmount(){}}const js=new WeakMap,qn=new WeakMap,_f=e=>{const t=js.get(e.target);t&&t(e)},Hf=e=>{e.forEach(_f)};function Wf({root:e,...t}){const n=e||document;qn.has(n)||qn.set(n,{});const s=qn.get(n),i=JSON.stringify(t);return s[i]||(s[i]=new IntersectionObserver(Hf,{root:e,...t})),s[i]}function zf(e,t,n){const s=Wf(t);return js.set(e,n),s.observe(e),()=>{js.delete(e),s.unobserve(e)}}const Uf={some:0,all:1};class Gf extends Qe{constructor(){super(...arguments),this.hasEnteredView=!1,this.isInView=!1}startObserver(){this.stopObserver?.();const{viewport:t={}}=this.node.getProps(),{root:n,margin:s,amount:i="some",once:r}=t,o={root:n?n.current:void 0,rootMargin:s,threshold:typeof i=="number"?i:Uf[i]},a=c=>{const{isIntersecting:l}=c;if(this.isInView===l||(this.isInView=l,r&&!l&&this.hasEnteredView))return;l&&(this.hasEnteredView=!0),this.node.animationState&&this.node.animationState.setActive("whileInView",l);const{onViewportEnter:h,onViewportLeave:f}=this.node.getProps(),u=l?h:f;u&&u(c)};this.stopObserver=zf(this.node.current,o,a)}mount(){this.startObserver()}update(){if(typeof IntersectionObserver>"u")return;const{props:t,prevProps:n}=this.node;["amount","margin","root"].some(Kf(t,n))&&this.startObserver()}unmount(){this.stopObserver?.(),this.hasEnteredView=!1,this.isInView=!1}}function Kf({viewport:e={}},{viewport:t={}}={}){return n=>e[n]!==t[n]}const Qf={inView:{Feature:Gf},tap:{Feature:Ff},focus:{Feature:$f},hover:{Feature:Bf}},qf={layout:{ProjectionNode:Da,MeasureLayout:Ha}},Xf={...xf,...Qf,...If,...qf},Yf=pf(Xf,mf),Zf=Yf;function qt(e){throw new Error('Could not dynamically require "'+e+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var Xn={exports:{}},Fo;function Jf(){return Fo||(Fo=1,(function(e,t){(function(n){e.exports=n()})(function(){return(function(){function n(s,i,r){function o(l,h){if(!i[l]){if(!s[l]){var f=typeof qt=="function"&&qt;if(!h&&f)return f(l,!0);if(a)return a(l,!0);var u=new Error("Cannot find module '"+l+"'");throw u.code="MODULE_NOT_FOUND",u}var w=i[l]={exports:{}};s[l][0].call(w.exports,function(g){var m=s[l][1][g];return o(m||g)},w,w.exports,n,s,i,r)}return i[l].exports}for(var a=typeof qt=="function"&&qt,c=0;c<r.length;c++)o(r[c]);return o}return n})()({1:[function(n,s,i){Object.defineProperty(i,"__esModule",{value:!0}),i.default=void 0;function r(u){"@babel/helpers - typeof";return r=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(w){return typeof w}:function(w){return w&&typeof Symbol=="function"&&w.constructor===Symbol&&w!==Symbol.prototype?"symbol":typeof w},r(u)}function o(u,w){if(!(u instanceof w))throw new TypeError("Cannot call a class as a function")}function a(u,w){for(var g=0;g<w.length;g++){var m=w[g];m.enumerable=m.enumerable||!1,m.configurable=!0,"value"in m&&(m.writable=!0),Object.defineProperty(u,l(m.key),m)}}function c(u,w,g){return w&&a(u.prototype,w),Object.defineProperty(u,"prototype",{writable:!1}),u}function l(u){var w=h(u,"string");return r(w)=="symbol"?w:w+""}function h(u,w){if(r(u)!="object"||!u)return u;var g=u[Symbol.toPrimitive];if(g!==void 0){var m=g.call(u,w);if(r(m)!="object")return m;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(u)}i.default=(function(){function u(){var w=this,g=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},m=g.defaultLayoutOptions,y=m===void 0?{}:m,x=g.algorithms,T=x===void 0?["layered","stress","mrtree","radial","force","disco","sporeOverlap","sporeCompaction","rectpacking"]:x,v=g.workerFactory,b=g.workerUrl;if(o(this,u),this.defaultLayoutOptions=y,this.initialized=!1,typeof b>"u"&&typeof v>"u")throw new Error("Cannot construct an ELK without both 'workerUrl' and 'workerFactory'.");var C=v;typeof b<"u"&&typeof v>"u"&&(C=function(M){return new Worker(M)});var P=C(b);if(typeof P.postMessage!="function")throw new TypeError("Created worker does not provide the required 'postMessage' function.");this.worker=new f(P),this.worker.postMessage({cmd:"register",algorithms:T}).then(function(S){return w.initialized=!0}).catch(console.err)}return c(u,[{key:"layout",value:function(g){var m=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},y=m.layoutOptions,x=y===void 0?this.defaultLayoutOptions:y,T=m.logging,v=T===void 0?!1:T,b=m.measureExecutionTime,C=b===void 0?!1:b;return g?this.worker.postMessage({cmd:"layout",graph:g,layoutOptions:x,options:{logging:v,measureExecutionTime:C}}):Promise.reject(new Error("Missing mandatory parameter 'graph'."))}},{key:"knownLayoutAlgorithms",value:function(){return this.worker.postMessage({cmd:"algorithms"})}},{key:"knownLayoutOptions",value:function(){return this.worker.postMessage({cmd:"options"})}},{key:"knownLayoutCategories",value:function(){return this.worker.postMessage({cmd:"categories"})}},{key:"terminateWorker",value:function(){this.worker&&this.worker.terminate()}}])})();var f=(function(){function u(w){var g=this;if(o(this,u),w===void 0)throw new Error("Missing mandatory parameter 'worker'.");this.resolvers={},this.worker=w,this.worker.onmessage=function(m){setTimeout(function(){g.receive(g,m)},0)}}return c(u,[{key:"postMessage",value:function(g){var m=this.id||0;this.id=m+1,g.id=m;var y=this;return new Promise(function(x,T){y.resolvers[m]=function(v,b){v?(y.convertGwtStyleError(v),T(v)):x(b)},y.worker.postMessage(g)})}},{key:"receive",value:function(g,m){var y=m.data,x=g.resolvers[y.id];x&&(delete g.resolvers[y.id],y.error?x(y.error):x(null,y.data))}},{key:"terminate",value:function(){this.worker&&this.worker.terminate()}},{key:"convertGwtStyleError",value:function(g){if(g){var m=g.__java$exception;m&&(m.cause&&m.cause.backingJsObject&&(g.cause=m.cause.backingJsObject,this.convertGwtStyleError(g.cause)),delete g.__java$exception)}}}])})()},{}],2:[function(n,s,i){var r=n("./elk-api.js").default;Object.defineProperty(s.exports,"__esModule",{value:!0}),s.exports=r,r.default=r},{"./elk-api.js":1}]},{},[2])(2)})})(Xn)),Xn.exports}var ep=Jf();const tp=Pl(ep),np="/dynamic-model-var-docs/assets/elk-worker.min-r_yRvuMO.js";class sp{elk=null;ensure(){return this.elk||(this.elk=new tp({workerUrl:np})),this.elk}async layout(t,n={}){const{direction:s="DOWN",nodeSpacing:i=32,layerSpacing:r=56,usePartitions:o=!1,extraLayoutOptions:a={}}=n,c={id:"root",layoutOptions:{"elk.algorithm":"layered","elk.direction":s,"elk.spacing.nodeNode":String(i),"elk.layered.spacing.nodeNodeBetweenLayers":String(r),"elk.edgeRouting":"ORTHOGONAL","elk.layered.considerModelOrder.strategy":"NODES_AND_EDGES",...o?{"elk.partitioning.activate":"true"}:{},...a},children:t.nodes.map(y=>({id:y.id,width:y.width,height:y.height,...y.ports?.length?{ports:y.ports.map(x=>({id:x.id,x:x.x,y:x.y,width:0,height:0}))}:{},...o&&y.partition!==void 0||y.ports?.length?{layoutOptions:{...o&&y.partition!==void 0?{"elk.partitioning.partition":String(y.partition)}:{},...y.ports?.length?{"elk.portConstraints":"FIXED_POS"}:{}}}:{}})),edges:t.edges.filter(y=>y.source!==y.target).map(y=>({id:y.id,sources:[y.sourcePort??y.source],targets:[y.targetPort??y.target]}))},l=new Map(t.edges.map(y=>[y.id,y]));this.elk;const h=performance.now(),f=await this.ensure().layout(c);performance.now()-h,t.nodes.length,t.edges.length;const u=(f.children??[]).map(y=>({id:y.id,x:y.x??0,y:y.y??0,width:y.width??0,height:y.height??0})),w=(f.edges??[]).map(y=>{const x=l.get(y.id);if(!x)throw new Error(`ELK returned unknown edge id: ${y.id}`);return{id:y.id,source:x.source,target:x.target,sections:y.sections}}),g=Math.max(0,...u.map(y=>y.x+y.width)),m=Math.max(0,...u.map(y=>y.y+y.height));return{nodes:u,edges:w,width:g,height:m}}cancel(){this.elk&&(this.elk.terminateWorker(),this.elk=null)}dispose(){this.cancel()}}function Xt(e){if(!e?.length)return[];const t=e[0];return[t.startPoint,...t.bendPoints??[],t.endPoint]}function _o(e,t,n){const s=t.x-e.x,i=t.y-e.y,r=Math.hypot(s,i);if(r<1e-6)return{...e};const o=Math.min(n,r/2)/r;return{x:e.x+s*o,y:e.y+i*o}}function ip(e,t){if(e.length<2)return op(e);let n=`M${e[0].x},${e[0].y}`;for(let i=1;i<e.length-1;i++){const r=_o(e[i],e[i-1],t),o=_o(e[i],e[i+1],t);n+=`L${r.x},${r.y}Q${e[i].x},${e[i].y} ${o.x},${o.y}`}const s=e[e.length-1];return`${n}L${s.x},${s.y}`}function op(e){return e.length?e.map((t,n)=>`${n===0?"M":"L"}${t.x},${t.y}`).join(""):""}function rp(e,t){let n=0,s=e.length-1,i=e[e.length-1];for(let r=e.length-1;r>0;r--){const o=Math.hypot(e[r].x-e[r-1].x,e[r].y-e[r-1].y);if(n+o>=t){const a=(t-n)/o;i={x:e[r].x+(e[r-1].x-e[r].x)*a,y:e[r].y+(e[r-1].y-e[r].y)*a},s=r-1;break}n+=o,s=r-1}return{cut:s,cutPoint:i}}function ap(e,t,n,s){if(e.length<2||n<=0)return s(e);const{cut:i,cutPoint:r}=rp(e,n),o=e.slice(0,i+1),a=o[o.length-1],c=a&&Math.abs(a.x-r.x)<1e-6&&Math.abs(a.y-r.y)<1e-6;return s([...o,...c?[]:[r],t])}function lp(e,t=1.5){if(e.length<3)return e;const n=[e[0]];for(let s=1;s<e.length-1;s++){const i=n[n.length-1],r=e[s],o=e[s+1],a=o.x-i.x,c=o.y-i.y,l=Math.hypot(a,c);(l<1e-6?Math.hypot(r.x-i.x,r.y-i.y):Math.abs(c*r.x-a*r.y+o.x*i.y-o.y*i.x)/l)>t&&n.push(r)}return n.push(e[e.length-1]),n}function cp(e,t,n,s){const i=Math.hypot(t.x,t.y)||1,r=t.x/i,o=t.y/i,a=-o,c=r,l=n/2,h={x:e.x+a*l,y:e.y+c*l},f={x:e.x-a*l,y:e.y-c*l},u={x:e.x+r*s,y:e.y+o*s};return`M${h.x},${h.y}L${u.x},${u.y}L${f.x},${f.y}Z`}function dp(e,t,n,s,i=16){const r={x:e.x+n.x*i,y:e.y+n.y*i},o={x:t.x+s.x*i,y:t.y+s.y*i},a=[e,r];if(Math.abs(n.x)>.5){const c=(r.x+o.x)/2;Math.abs(r.y-o.y)>.5&&a.push({x:c,y:r.y},{x:c,y:o.y})}else{const c=(r.y+o.y)/2;Math.abs(r.x-o.x)>.5&&a.push({x:r.x,y:c},{x:o.x,y:c})}return a.push(o,t),lp(a)}function hp(e,t={}){const n=p.useRef(null);n.current||(n.current=new sp);const[s,i]=p.useState(null),[r,o]=p.useState(!1),a=JSON.stringify(t);p.useEffect(()=>{const h=n.current;if(!e||e.nodes.length===0){i(null),o(!1);return}let f=!1;return o(!0),h.layout(e,JSON.parse(a)).then(u=>{f||(i({spec:e,layout:u}),o(!1))},u=>{f||(o(!1),console.error("graph-core layout failed:",u))}),()=>{f=!0,h.cancel()}},[e,a]),p.useEffect(()=>()=>n.current?.dispose(),[]);const c=!!e&&e.nodes.length>0,l=!s||s.spec!==e;return{latest:s,inProgress:(r||l)&&c}}const up=300,fp=100,pp=200,mp=75,gp=250,yp=120,wp=200,xp=[.65,0,.35,1],Yt=e=>e/1e3,bp=()=>typeof window<"u"&&typeof window.matchMedia=="function"&&window.matchMedia("(prefers-reduced-motion: reduce)").matches,$t=e=>()=>bp()?0:e,Wa=$t(up),Ho=$t(fp),vp=$t(pp),kp=$t(mp),Tp=$t(gp),Zt=()=>yp,Wo=.5;function Sp(e={}){const{min:t=.2,max:n=2}=e,s=p.useRef(null),i=p.useRef(null),r=p.useRef(null),o=p.useRef(1),a=p.useRef({w:0,h:0}),c=p.useRef(null),l=p.useRef(null),h=p.useRef(!0),f=p.useRef(!0),u=p.useCallback(()=>{const v=s.current;return v?{x:v.clientWidth*Wo,y:v.clientHeight*Wo}:{x:0,y:0}},[]),w=p.useCallback(v=>{const b=i.current;if(b){const{x:C,y:P}=u();b.style.transition=v?`width ${v}ms, height ${v}ms`:"",b.style.padding=`${P}px ${C}px`,b.style.width=`${a.current.w*o.current+2*C}px`,b.style.height=`${a.current.h*o.current+2*P}px`}},[u]),g=p.useCallback((v,b)=>{o.current=Math.min(n,Math.max(t,v));const C=b?Wa():0;c.current&&cancelAnimationFrame(c.current),c.current=requestAnimationFrame(()=>{c.current=null;const P=r.current;P&&(P.style.transition=C?`transform ${C}ms`:"",P.style.transform=`scale(${o.current})`)}),l.current&&(clearTimeout(l.current),l.current=null),C?w(C):l.current=setTimeout(()=>{l.current=null,w(0)},100)},[t,n,w]),m=p.useCallback((v,b=!0)=>{h.current=!1,g(v,b)},[g]),y=p.useCallback(v=>m(o.current*v),[m]),x=p.useCallback((v,b)=>{a.current={w:v,h:b};const C=r.current;C&&(C.style.width=`${v}px`,C.style.height=`${b}px`,C.style.transformOrigin="0 0",C.style.transform=`scale(${o.current})`),w(0)},[w]),T=p.useCallback(()=>{const v=s.current,{w:b,h:C}=a.current;if(!v||!b||!C)return;h.current=!0;const P=!f.current;f.current=!1,g(Math.min(v.clientWidth/b,v.clientHeight/C,1),P),requestAnimationFrame(()=>{const{x:S,y:M}=u();typeof v.scrollTo=="function"?v.scrollTo({left:S,top:M,behavior:P?"smooth":"auto"}):(v.scrollLeft=S,v.scrollTop=M)})},[g,u]);return p.useEffect(()=>{const v=s.current;if(!v)return;const b=C=>{!C.ctrlKey&&!C.metaKey||(C.preventDefault(),m(o.current*(1-C.deltaY*.005),!1))};return v.addEventListener("wheel",b,{passive:!1}),()=>v.removeEventListener("wheel",b)},[m]),p.useEffect(()=>{const v=s.current;if(!v)return;let b=!1,C=0,P=0,S=0,M=0,N=!1;const H=I=>I instanceof Element&&!I.closest("[data-pan-ignore]"),F=I=>{I.button!==0||!H(I.target)||(b=!0,N=!1,C=I.clientX,P=I.clientY,S=v.scrollLeft,M=v.scrollTop,v.style.cursor="grabbing")},G=I=>{if(!b)return;const q=I.clientX-C,X=I.clientY-P;!N&&Math.hypot(q,X)<3||(N||(N=!0,v.setPointerCapture(I.pointerId)),I.preventDefault(),v.scrollLeft=S-q,v.scrollTop=M-X)},R=I=>{b&&(b=!1,v.style.cursor="",v.hasPointerCapture(I.pointerId)&&v.releasePointerCapture(I.pointerId))};return v.addEventListener("pointerdown",F),v.addEventListener("pointermove",G),v.addEventListener("pointerup",R),v.addEventListener("pointercancel",R),()=>{v.removeEventListener("pointerdown",F),v.removeEventListener("pointermove",G),v.removeEventListener("pointerup",R),v.removeEventListener("pointercancel",R)}},[]),{containerRef:s,spacerRef:i,wrapperRef:r,applyZoom:m,zoomBy:y,zoomToFit:T,getZoom:()=>o.current,isAutoFit:()=>h.current,setContentSize:x}}const Cp=2;function za({kind:e,width:t=44,className:n}){const s=p.useId().replace(/:/g,""),i=e==="association"?xe.association:e==="own-bkwd"?xe.ownBkwd:xe.ownFwd,r=e==="own-bkwd",o=e==="association",a=`es-${s}`,c=o?6:1,l=t-6;return d.jsxs("svg",{width:t,height:"14",viewBox:`0 0 ${t} 14`,className:`shrink-0 ${n??""}`,"aria-hidden":!0,children:[d.jsx("defs",{children:d.jsx("marker",{id:a,markerWidth:"5",markerHeight:"5",refX:r?.5:4.5,refY:"2.5",orient:"auto-start-reverse",markerUnits:"userSpaceOnUse",children:d.jsx("path",{d:r?"M5,0 L0,2.5 L5,5 z":"M0,0 L5,2.5 L0,5 z",fill:i})})}),d.jsx("line",{x1:c,y1:"7",x2:l,y2:"7",stroke:i,strokeWidth:Cp,strokeDasharray:e==="association"?"5 4":void 0,markerStart:o?`url(#${a})`:void 0,markerEnd:`url(#${a})`})]})}const Ua={"owned-mine":{side:"left",kind:"own-bkwd"},"owned-theirs":{side:"left",kind:"own-fwd"},"owns-mine":{side:"right",kind:"own-fwd"},"owns-theirs":{side:"right",kind:"own-bkwd"},association:{side:"left",kind:"association"}},Ap=300,Rs=new Set;let Et;function fi(){Et!==void 0&&(clearTimeout(Et),Et=void 0)}function kt(e){fi();for(const t of Rs)t(e)}function Ga(){fi(),Et=setTimeout(()=>{Et=void 0,kt(null)},Ap)}function Pp({label:e,rows:t,onAdd:n,onRemove:s,onInspect:i,colorOf:r,slotOrder:o}){const[a,c]=p.useState(null),[l,h]=p.useState(null),f=p.useRef(null),u=p.useRef(null),w=p.useId();p.useEffect(()=>{const b=C=>{C!==w&&(c(null),h(null))};return Rs.add(b),()=>{Rs.delete(b)}},[w]),p.useEffect(()=>{if(!a)return;const b=P=>{P.target?.closest("[data-relation-bar]")||kt(null)},C=P=>{P.key==="Escape"&&kt(null)};return document.addEventListener("mousedown",b,!0),document.addEventListener("keydown",C),()=>{document.removeEventListener("mousedown",b,!0),document.removeEventListener("keydown",C)}},[a]);const g=b=>t.filter(C=>Ua[C.position].side===b),m=b=>new Set(g(b).map(C=>C.other)).size,y=m("left"),x=m("right");if(y===0&&x===0)return null;const T=(b,C)=>{const P=C?.getBoundingClientRect();P&&(kt(w),c(b),h({x:P.left,y:P.bottom+2}))},v=(b,C,P)=>{const S=a===b;return d.jsx("button",{ref:P,"data-relation-bar":!0,"data-no-drag":!0,disabled:C===0,"aria-label":b==="left"?`${C} classes ${e} belongs to`:`${C} classes ${e} owns`,onMouseEnter:()=>C>0&&T(b,P.current),onMouseLeave:Ga,onClick:M=>{M.stopPropagation(),C!==0&&(S?kt(null):T(b,P.current))},className:`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] leading-none
                    tabular-nums transition-colors
                    ${C===0?"text-gray-300 dark:text-slate-600 cursor-default":S?"bg-sky-200 dark:bg-sky-800 text-sky-900 dark:text-sky-100":"text-sky-800 dark:text-sky-200 hover:bg-sky-100 dark:hover:bg-sky-900"}`,children:b==="left"?d.jsxs(d.Fragment,{children:[d.jsx("span",{"aria-hidden":!0,children:"←"}),C]}):d.jsxs(d.Fragment,{children:[C,d.jsx("span",{"aria-hidden":!0,children:"→"})]})})};return d.jsxs(d.Fragment,{children:[v("left",y,f),d.jsx("span",{className:`flex-1 min-w-0 text-center text-[9px] text-gray-400
                       dark:text-slate-500 truncate select-none`,children:"related"}),v("right",x,u),a&&l&&nr.createPortal(d.jsx(Mp,{anchor:l,side:a,label:e,rows:g(a),onAdd:n,onRemove:s,onInspect:i,colorOf:r,slotOrder:o}),document.body)]})}function Ep(e){const t=p.useRef(null),[n,s]=p.useState(e);return p.useEffect(()=>{const i=t.current;if(!i)return;const r=i.getBoundingClientRect(),o=8;s({x:Math.max(o,Math.min(e.x,window.innerWidth-r.width-o)),y:Math.max(o,Math.min(e.y,window.innerHeight-r.height-o))})},[e]),{ref:t,pos:n}}function Mp({anchor:e,side:t,label:n,rows:s,onAdd:i,onRemove:r,onInspect:o,colorOf:a,slotOrder:c}){const{ref:l,pos:h}=Ep(e),f=m=>{const y=c?.indexOf(m.slot)??-1;return y===-1?Number.MAX_SAFE_INTEGER:y},u=[...s].sort((m,y)=>f(m)-f(y)||m.other.localeCompare(y.other)||m.slot.localeCompare(y.slot)),w=u.every(m=>m.drawn),g=[...new Set(u.map(m=>m.other))];return d.jsxs("div",{ref:l,"data-relation-bar":!0,onMouseEnter:fi,onMouseLeave:Ga,style:{left:h.x,top:h.y},className:`fixed z-50 w-max max-w-[min(46rem,calc(100vw-2rem))] max-h-[60vh]
                 overflow-y-auto overflow-x-hidden py-1
                 rounded-md border border-gray-300 dark:border-slate-600
                 bg-white dark:bg-slate-800 shadow-xl
                 text-gray-900 dark:text-gray-100`,children:[d.jsx("div",{className:"px-3 py-1 border-b border-gray-200 dark:border-slate-700",children:d.jsxs("div",{className:"text-[11px] font-semibold",children:[d.jsx("b",{children:n})," ",t==="left"?"belongs to":"owns"," ",g.length," ",g.length===1?"entity":"distinct entities",u.length!==g.length&&d.jsxs("span",{className:"font-normal text-gray-500 dark:text-slate-400",children:[" ","through ",u.length," attributes"]})]})}),d.jsx("button",{onClick:()=>g.forEach(m=>w?r(m):i(m)),className:`block w-full text-left px-3 py-1 text-[11px]
                   text-blue-600 dark:text-blue-400
                   hover:bg-gray-100 dark:hover:bg-slate-700`,children:w?`hide all ${g.length} entities`:`add all ${g.length} entities`}),d.jsx("table",{className:"w-full text-[11px]",children:d.jsx("tbody",{children:u.map(m=>{const y=Ua[m.position].kind,x=m.declaredBy===m.other?n:m.declaredBy,T=t==="left"?m.other:x,v=t==="left"?x:m.other;return d.jsxs("tr",{className:"hover:bg-gray-100 dark:hover:bg-slate-700",children:[d.jsx("td",{className:"pl-2 pr-1 py-0.5",children:d.jsx("button",{onClick:b=>{b.stopPropagation(),(m.drawn?r:i)(m.other)},"aria-label":m.drawn?`Remove ${m.other} from the diagram`:`Add ${m.other} to the diagram`,className:`w-4 h-4 rounded-sm leading-none text-[11px]
                                flex items-center justify-center border
                                ${m.drawn?"border-sky-300 bg-sky-50 text-sky-700 hover:bg-sky-200 dark:border-sky-700 dark:bg-sky-950 dark:text-sky-300":"border-gray-300 text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:border-slate-600 dark:hover:bg-slate-600"}`,children:m.drawn?"−":"+"})}),d.jsx("td",{className:"pl-1 pr-2 py-0.5 text-right whitespace-nowrap",children:d.jsx(zo,{cls:T,row:m,colorOf:a,onInspect:o})}),d.jsx("td",{className:`px-2 py-0.5 font-mono text-gray-400 dark:text-slate-500
                               whitespace-nowrap tabular-nums text-right`,children:m.cardinality}),d.jsx("td",{className:"px-1 py-0.5 align-middle",children:d.jsx(za,{kind:y,width:30})}),d.jsx("td",{className:"pr-3 py-0.5 whitespace-nowrap",children:d.jsx(zo,{cls:v,row:m,colorOf:a,onInspect:o})})]},`${m.declaredBy}.${m.slot}->${m.other}`)})})})]})}function zo({cls:e,row:t,colorOf:n,onInspect:s}){const i=n?.(e),r=e===t.declaredBy,o=i?{color:i.text}:void 0;return d.jsxs("span",{className:"font-mono",children:[s?d.jsx("button",{onClick:a=>{a.stopPropagation(),s(e)},title:`Open ${e}'s details`,className:"hover:underline",style:o,children:e}):d.jsx("span",{style:o,children:e}),r&&d.jsxs("span",{className:i?"opacity-80":"text-gray-500 dark:text-slate-400",style:o,children:[".",t.slot]})]})}const Se={sibs:!0,dir:"RIGHT",merge:"near",legend:!1,cases:!1},Ka=["legend","cases"];function Dp(e,t){if(e.get("panels")!=="0")return t;for(const n of Ka)t[n]=!1;return t.detail=null,t}const Tt={dir:"explore-nl-dir",merge:"explore-nl-merge",sibs:"explore-nl-sibs"},En="~",jp=["exp","hidden","owners"],Rp=["tour"];let Mt;function Op(e=window.location.search){return Mt===void 0&&(Mt=new URLSearchParams(e).get("tour")==="1"),Mt}function Np(e,t){const n=e.get(t);return n?n.split(En).filter(Boolean):[]}function Qa(e){const t=e.get("cat");if(!t)return[];const n=t.split(new RegExp(`[,${En}]`)).filter(Boolean);return[...new Set(n.flatMap(s=>{const i=sr.find(r=>r.id===s);return i?ir(i):[]}))]}function Jt(e){try{return localStorage.getItem(e)}catch{return null}}function Lp(e,t){try{localStorage.setItem(e,t)}catch{}}function en(e,t){return e&&t.includes(e)?e:null}function Ie(e=window.location.search){const t=new URLSearchParams(e),n=en(t.get("dir"),["RIGHT","DOWN"])??en(Jt(Tt.dir),["RIGHT","DOWN"])??Se.dir,s=en(t.get("merge"),["near","far","bend","off"])??en(Jt(Tt.merge),["near","far","bend","off"])??Se.merge,i=t.has("sibs")?t.get("sibs")==="1":Jt(Tt.sibs)!==null?Jt(Tt.sibs)!=="0":Se.sibs,r=Np(t,"sel"),o=Dp(t,{legend:t.get("legend")==="1",cases:t.get("cases")==="1",detail:t.get("detail")||null});return t.has("legend")&&(o.legend=t.get("legend")==="1"),t.has("cases")&&(o.cases=t.get("cases")==="1"),t.has("detail")&&(o.detail=t.get("detail")||null),{sel:r.length?r:Qa(t),detail:o.detail,roots:t.get("roots")==="1",sibs:i,dir:n,merge:s,legend:o.legend,cases:o.cases}}function qa(e,{push:t=!1}={}){const n=new URL(window.location.href),s=n.searchParams,i=(o,a)=>{a.length===0?s.delete(o):s.set(o,[...a].sort().join(En))},r=(o,a,c)=>{c?s.delete(o):s.set(o,a)};for(const o of jp)s.delete(o);Mt===void 0&&s.has("tour")&&(Mt=s.get("tour")==="1");for(const o of Rp)s.delete(o);i("sel",e.sel),e.detail?s.set("detail",e.detail):s.delete("detail"),r("roots","1",!e.roots),r("sibs",e.sibs?"1":"0",e.sibs===Se.sibs),r("dir",e.dir,e.dir===Se.dir),r("merge",e.merge,e.merge===Se.merge),r("legend","1",e.legend===Se.legend),r("cases","1",e.cases===Se.cases),s.delete("panels"),s.delete("cat"),t?window.history.pushState(null,"",n):window.history.replaceState(null,"",n)}function Yn(e,t){Lp(Tt[e],typeof t=="boolean"?t?"1":"0":String(t))}function Vp(e,t=window.location.href){const n=new URL(t),s=new URLSearchParams,i=(r,o)=>s.set(r,o);return e.sel.length&&i("sel",[...e.sel].sort().join(En)),e.detail&&i("detail",e.detail),e.roots&&i("roots","1"),e.sibs!==Se.sibs&&i("sibs",e.sibs?"1":"0"),e.dir!==Se.dir&&i("dir",e.dir),e.merge!==Se.merge&&i("merge",e.merge),e.legend!==Se.legend&&i("legend","1"),e.cases!==Se.cases&&i("cases","1"),n.search=s.toString(),n.toString()}const ke=240,nt=30,Ip=.6,st=20,Bp=1/0,pi=22,Xa=18,rt=28;function Ya(e,t,n=()=>!1){const s=new Map;for(const i of e){if(n(i.other))continue;const r=i.position,o=s.get(r)??new Map,a=o.get(i.other)??[];a.includes(i.slot)||a.push(i.slot),o.set(i.other,a),s.set(r,o)}return Ol.filter(i=>s.has(i)).map(i=>{const r=[...s.get(i)].map(([o,a])=>({other:o,slots:a,drawn:t(o)})).sort((o,a)=>o.other.localeCompare(a.other));return{position:i,label:Nl(i,r.length),items:r}})}function Za(e,t,n=()=>!1){const s=new Set,i=[];for(const r of e){if(n(r.other))continue;const o=`${r.declaredBy}.${r.slot}->${r.other}:${r.position}`;s.has(o)||(s.add(o),i.push({other:r.other,position:r.position,slot:r.slot,declaredBy:r.declaredBy,cardinality:r.cardinality,drawn:t(r.other)}))}return i}function re(e){return e.storageDirection==="flipped"?e.target:e.source}function Os(e){return e.anchorClass??re(e)}function $p(e,t,n,s,i){const r=new Map,o=new Map,a=[],c=new Set;for(const u of e.edges)u.type==="isa"?(r.set(u.target,[...r.get(u.target)??[],u.source]),o.set(u.source,(o.get(u.source)??0)+1)):u.isLoop||(a.push(u),c.add(`${re(u)}|${u.slotName}`));const l=new Set(e.nodes.map(u=>u.id)),h=e.nodes.map(u=>{const w=new Map(n(u.id).map((R,I)=>[R.name,I])),g=(R,I)=>(w.get(R.slot)??Number.MAX_SAFE_INTEGER)-(w.get(I.slot)??Number.MAX_SAFE_INTEGER),m=u.slots.map(R=>({...R,connected:R.isLoop||c.has(`${u.id}|${R.slot}`),rangeColor:s(R.range),targetColor:i(R.range)})).sort(g),y=new Set(m.map(R=>R.slot)),x=n(u.id).filter(R=>!y.has(R.name)).map(R=>({slot:R.name,range:R.range,channel:"plain",flipped:!1,cardinality:Ml(R.required,R.multivalued),isLoop:!1,connected:!1,rangeColor:s(R.range)})),T=m.filter(R=>R.connected),v=[...m.filter(R=>!R.connected),...x].sort(g),b=[...T,...v].slice(0,Math.max(Bp,T.length)),C=b.length===T.length+v.length,P=t.has(u.id)||C,S=P?[...T,...v]:b,M=C?0:T.length+v.length-b.length,N=e.hiddenOwners.get(u.id)??[],H=e.hiddenOwned.get(u.id)??[],F=Ya(u.relations,R=>l.has(R),R=>R===u.id),G=Za(u.relations,R=>l.has(R),R=>R===u.id);return{...u,isaParents:r.get(u.id)??[],subclassCount:o.get(u.id)??0,members:[],hiddenOwners:N,hiddenOwned:H,relationGroups:F,relationRows:G,...Ja(F),rows:S,allRows:[...T,...v],hiddenCount:M,expanded:P,height:el(S.length,M,F.length>0)}}),f=new Map;for(const u of a){const w=re(u)===u.source?u.target:u.source,g=i(w);g&&f.set(u.id,g)}return{nodes:h,edges:a,edgeColors:f}}function Ja(e){const t=new Map;for(const n of e)for(const s of n.items)t.set(s.other,(t.get(s.other)??!1)||s.drawn);return{relatedCount:t.size,shownCount:[...t.values()].filter(Boolean).length}}function el(e,t,n){return nt+(n?pi:0)+e*st+(t?Xa:0)+(e?5:0)}function Fp(e,t,n,s,i,r,o){const a=Dl(e.nodes.map(x=>x.id),t,n);if(!a.size)return e;const c=new Map(e.nodes.map(x=>[x.id,x])),l=new Set(e.nodes.map(x=>x.id)),h=new Map,f=[],u=new Map;for(const[x,T]of a){const v=Ll(x),b=T.map(A=>({id:A,label:c.get(A)?.label??A,color:jl(o(A))}));for(const A of b)h.set(A.id,v);const C=c.has(x);C&&h.set(x,v);const P=new Map(b.map(A=>[A.id,A])),S=new Map,M=C?[x,...T]:T;for(const A of M){const V=c.get(A);if(!V)continue;const Y=A===x;for(const me of V.allRows){const Ce=s(A,me.slot),W=Ce!==void 0&&Ce!==A,U=`${Y||W?Ce??x:A}|${me.slot}`,ee=S.get(U),se=P.get(A),ie=Y||W?ee?.owners??[]:[...ee?.owners??[],...se?[se]:[]];S.set(U,{...ee??me,connected:(ee?.connected??!1)||me.connected,owners:ie,declaringClass:U.slice(0,U.indexOf("|"))})}}const N=new Map;for(const A of S.values())if(A.targetColor)for(const V of A.owners??[])N.has(V.id)||N.set(V.id,A.targetColor);for(const A of b){const V=N.get(A.id);V&&(A.color=V)}for(const[A,V]of S)V.targetColor&&u.set(`${v}|${A}`,V.targetColor);const H=[...S.values()],F=A=>{const V=A.owners?.length?A.owners[0].id:x;return r(V,A.slot)};H.sort((A,V)=>F(A)-F(V));const G=Rl(H,b,A=>({slot:`::hdr:${A.id}`,range:"",channel:"plain",flipped:!1,cardinality:"",isLoop:!1,connected:!1,rangeColor:"",header:A})),R=A=>!h.has(A)&&!M.includes(A),I=[...new Set(M.flatMap(A=>c.get(A)?.hiddenOwners??[]))].filter(R),q=[...new Set(M.flatMap(A=>c.get(A)?.hiddenOwned??[]))].filter(R),X=Ya(M.flatMap(A=>c.get(A)?.relations??[]),A=>l.has(A),A=>!R(A)),le=Za(M.flatMap(A=>c.get(A)?.relations??[]),A=>l.has(A),A=>!R(A)),K=c.get(T[0]),J=i(x);f.push({...K,id:v,label:x,description:J.description,abstract:J.abstract,slots:[],members:b,role:M.some(A=>c.get(A)?.role==="selected")?"selected":"context",layer:Math.min(...M.map(A=>c.get(A)?.layer??0)),isaParents:[],subclassCount:b.length,hiddenOwners:I,hiddenOwned:q,relationGroups:X,relationRows:le,...Ja(X),rows:G,allRows:H,hiddenCount:0,expanded:!0,height:el(G.length,0,X.length>0)})}const w=[...e.nodes.filter(x=>!h.has(x.id)),...f],g=new Set,m=e.edges.map(x=>({...x,source:h.get(x.source)??x.source,target:h.get(x.target)??x.target,entityMember:(()=>{const T=re(x)===x.source?x.target:x.source;return h.has(T)?T:void 0})(),anchorClass:h.has(re(x))?s(re(x),x.slotName)??re(x):re(x)})).filter(x=>{const T=re(x);if(!tr(T))return!0;const v=T===x.source?x.target:x.source,b=`${T}|${x.anchorClass}|${x.slotName}|${v}|${x.storageDirection}`;return g.has(b)?!1:(g.add(b),!0)}).filter(x=>x.source!==x.target),y=new Map(e.edgeColors);for(const x of m){const T=u.get(`${re(x)}|${Os(x)}|${x.slotName}`);T&&y.set(x.id,T)}return{nodes:w,edges:m,edgeColors:y}}function _p({title:e}){return d.jsxs("svg",{viewBox:"0 0 16 16",width:"15",height:"15","aria-hidden":"false",className:"shrink-0",style:{color:He.entity},children:[d.jsx("title",{children:e}),d.jsx("path",{d:"M12.33 10.5 A5 5 0 1 1 12.33 5.5",fill:"none",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round"}),d.jsx("path",{d:"M13.7 7.9 L10.6 6.7 L13.7 4.2 Z",fill:"currentColor"})]})}function tl(e){return nt+(e.relationGroups.length>0?pi:0)}function nl(e,t,n){const s=e.rows.findIndex(i=>i.slot===t&&!i.header&&(!n||!i.declaringClass||i.declaringClass===n));if(s<0)throw new Error(`No displayed row for ${t} on ${e.id}`);return tl(e)+s*st+st/2}function Hp(e,t){const n=e.rows.findIndex(s=>s.header?.id===t);if(!(n<0))return tl(e)+n*st+st/2}function Ns(e,t){if(e.storageDirection==="flipped"||!t.members.length)return;const n=e.entityMember;return n&&t.members.some(s=>s.id===n)?n:void 0}const Wp=4,zp=10,sl=12,ze=sl,Zn=sl*1.5,Jn=0,Uo=.85,il=1.4,ol=2.6,Up=il*.75,Gp=ol*.75;function Go(e,t){return e?t?xe.ownBkwd:xe.ownFwd:xe.association}function es(e,t){if(e==="off"||t.length<2)return 0;if(e==="near")return 40;if(e==="far")return 120;const n=t[t.length-1],s=t[t.length-2];return Math.hypot(n.x-s.x,n.y-s.y)}function Ko(e,t){return e<2?0:Math.min(Wp,t/(e-1))}function Kp(e,t){const n=new Map,s=(l,h,f,u)=>{const w=n.get(l.id)??[];return w.some(g=>g.id===h)||(w.push({id:h,x:f,y:u}),n.set(l.id,w)),h},i=new Map(e.nodes.map(l=>[l.id,l])),r=l=>{const h=i.get(re(l)===l.source?l.target:l.source);return!!h&&Ns(l,h)!==void 0},o=new Map;for(const l of e.edges){if(r(l))continue;const h=re(l)===l.source?l.target:l.source,f=`${h}|${h===l.source?"out":"in"}`;o.set(f,(o.get(f)??0)+1)}const a=new Map,c=e.edges.map(l=>{const h=i.get(re(l)),f=i.get(re(l)===l.source?l.target:l.source);if(!h||!f)throw new Error(`Edge ${l.id} endpoint missing from subgraph`);const u=l.storageDirection==="flipped",w=nl(h,l.slotName,Os(l)),g=s(h,`${h.id}::row:${Os(l)}|${l.slotName}`,u?0:ke,w),m=f.id===l.source,y=`${f.id}|${m?"out":"in"}`,x=Ns(l,f),T=x!==void 0?Hp(f,x):void 0;let v;if(x!==void 0&&T!==void 0)v=s(f,`${f.id}::mhdr:${m?"out":"in"}:${x}`,t==="RIGHT"?m?ke:0:ke/2,t==="RIGHT"?T:m?f.height:0);else{const b=o.get(y)??1,C=a.get(y)??0;a.set(y,C+1);const P=Ko(b,nt-4),S=nt/2+(C-(b-1)/2)*P;v=t==="RIGHT"?s(f,`${f.id}::hdr:${m?"out":"in"}:${C}`,m?ke:0,S):s(f,`${f.id}::hdr:${m?"out":"in"}:${C}`,ke/2+(C-(b-1)/2)*Ko(b,ke/2),m?f.height:0)}return{id:l.id,source:l.source,target:l.target,sourcePort:u?v:g,targetPort:u?g:v}});return{nodes:e.nodes.map(l=>({id:l.id,width:ke,height:l.height,partition:l.layer,ports:n.get(l.id)})),edges:c}}function Qp(e,t){if(!e?.length)return e;const n=e[0],s=n.bendPoints?.length?n.bendPoints[n.bendPoints.length-1]:n.startPoint,i=n.endPoint.x-s.x,r=n.endPoint.y-s.y,o=Math.hypot(i,r);if(o<1)return e;const a=Math.min(t,o*.8)/o,c={x:n.endPoint.x-i*a,y:n.endPoint.y-r*a};return[{...n,endPoint:c},...e.slice(1)]}function qp(e,t){if(!e?.length)return e;const n=e[0],s=n.bendPoints?.length?n.bendPoints[0]:n.endPoint,i=s.x-n.startPoint.x,r=s.y-n.startPoint.y,o=Math.hypot(i,r);if(o<1)return e;const a=Math.min(t,o*.8)/o,c={x:n.startPoint.x+i*a,y:n.startPoint.y+r*a};return[{...n,startPoint:c},...e.slice(1)]}function Xp({dataService:e,selectedIds:t,onNodeClick:n,onAdd:s,onRemove:i,pathToRoot:r=!1,onTogglePathToRoot:o,direction:a,setDirection:c,mergeMode:l,setMergeMode:h,mergeSibs:f,setMergeSibs:u}){const w=p.useId().replace(/[^a-zA-Z0-9]/g,""),g=k=>`${k}-${w}`,[m,y]=p.useState(new Set),x=p.useMemo(()=>e.getOwnershipSubgraph([...t].sort(),{pathToRoot:r}),[e,t,r]),T=p.useCallback(k=>e.getTargetColor(k),[e]),v=p.useMemo(()=>new Map(x.nodes.map(k=>[k.id,e.getClassSummary(k.id)?.slots??[]])),[e,x]),b=p.useMemo(()=>$p(x,m,k=>v.get(k)??[],k=>e.getRangeColor(k),k=>e.getTargetColor(k)),[x,m,v,e]),C=p.useMemo(()=>new Map(x.nodes.map(k=>[k.id,e.getClassSummary(k.id)])),[e,x]),P=p.useMemo(()=>{if(!f)return b;const k=E=>C.get(E)?.parentId,D=E=>!Vl.has(E),j=(E,L)=>E.range===L.range&&E.multivalued===L.multivalued;return Fp(b,k,D,(E,L)=>{const $=e.getClassSummary(E)?.slots.find(de=>de.name===L);if(!$)return;if(!$.inheritedFrom)return E;const Z=e.getClassSummary($.inheritedFrom)?.slots.find(de=>de.name===L);return Z&&j($,Z)?$.inheritedFrom:E},E=>{const L=e.getClassSummary(E);return{description:L?.description??"",abstract:L?.isAbstract??!1}},(E,L)=>{const $=e.getClassSummary(E)?.slots.findIndex(Z=>Z.name===L)??-1;return $<0?Number.MAX_SAFE_INTEGER:$},E=>e.siblingColorIndexOf(E))},[b,C,f,e]),[S,M]=p.useState(new Map),[N,H]=p.useState(new Map),F=p.useMemo(()=>Kp(P,a),[P,a]),{latest:G,inProgress:R}=hp(F,{direction:a,usePartitions:!0,nodeSpacing:28,layerSpacing:72,extraLayoutOptions:{"elk.spacing.edgeNode":"18","elk.spacing.edgeEdge":"12","elk.layered.spacing.edgeNodeBetweenLayers":"18","elk.layered.spacing.edgeEdgeBetweenLayers":"10"}}),I=G?.spec===F?G.layout:null,q=G?.layout??null,X=Sp(),le=(q?.width??0)+rt*2,K=(q?.height??0)+rt*2;p.useEffect(()=>{I&&(X.setContentSize(le,K),X.isAutoFit()&&X.zoomToFit())},[I,le,K]),p.useEffect(()=>M(new Map),[I]),p.useEffect(()=>H(new Map),[I]);const[J,A]=p.useState(!1),V=p.useRef(!0);p.useEffect(()=>{if(!I){A(!1),q||(V.current=!0);return}const k=V.current?0:Tp();if(V.current=!1,k===0){A(!0);return}const D=setTimeout(()=>A(!0),k);return()=>clearTimeout(D)},[I,q]);const Y=p.useRef(new Map),me=p.useRef(!1),Ce=p.useRef(S);Ce.current=S;const W=p.useMemo(()=>{const k=new Map((q?.nodes??[]).map(j=>[j.id,j])),D=new Map(N);for(const[j,B]of S)D.set(j,B);for(const[j,{dx:B,dy:_}]of D){const Q=k.get(j);Q&&k.set(j,{...Q,x:Q.x+B,y:Q.y+_})}return Y.current=k,k},[q,S,N]),[U,ee]=p.useState(!1);p.useEffect(()=>{if(!R){ee(!1);return}const k=setTimeout(()=>ee(!0),wp);return()=>clearTimeout(k)},[R]);const se=p.useCallback((k,D)=>{if(D.button!==0||D.target.closest('button, a, [role="button"], [data-no-drag]'))return;D.stopPropagation();const j=D.clientX,B=D.clientY,_=X.getZoom()||1,Q=S.get(k)??{dx:0,dy:0},E=D.currentTarget;E.setPointerCapture(D.pointerId);let L=!1;const $=de=>{const Te=(de.clientX-j)/_,je=(de.clientY-B)/_;!L&&Math.hypot(Te,je)<3||(L=!0,me.current=!0,M(qe=>new Map(qe).set(k,{dx:Q.dx+Te,dy:Q.dy+je})))},Z=de=>{if(E.releasePointerCapture(de.pointerId),E.removeEventListener("pointermove",$),E.removeEventListener("pointerup",Z),L){const Te=Ce.current.get(k);Te&&H(je=>new Map(je).set(k,Te))}};E.addEventListener("pointermove",$),E.addEventListener("pointerup",Z)},[S]),ie=p.useMemo(()=>new Map(P.nodes.map(k=>[k.id,k.role])),[P]),Ae=p.useMemo(()=>new Map(P.edges.map(k=>[k.id,k])),[P]),be=p.useMemo(()=>{const k=new Map(P.nodes.map(D=>[D.id,D]));return new Set(P.edges.filter(D=>{const j=k.get(re(D)===D.source?D.target:D.source);return!!j&&Ns(D,j)!==void 0}).map(D=>D.id))},[P]),z=p.useMemo(()=>{const k=new Map;if(!I)return k;for(const D of P.edges){const j=re(D)===D.source?D.target:D.source,B=W.get(j);if(!B||be.has(D.id))continue;const _=j===D.source,Q=`${j}|${_?"out":"in"}`;if(k.has(Q))continue;const E=_,L=Jn+Zn;k.set(Q,a==="RIGHT"?{base:{x:E?B.x+ke+L:B.x-L,y:B.y+nt/2},dir:{x:E?-1:1,y:0}}:{base:{x:B.x+ke/2,y:E?B.y+B.height+L:B.y-L},dir:{x:0,y:E?-1:1}})}return k},[P,W,I,a,be]),ce=p.useMemo(()=>{const k=new Map,D=new URLSearchParams(window.location.search).has("dbg"),j=new Set([...N.keys(),...S.keys()]);if(!I||j.size===0)return k;D&&console.log(`[drag] moved: ${[...j].join(", ")}`);const B=new Map(P.nodes.map(_=>[_.id,_]));for(const _ of P.edges){const Q=re(_),E=Q===_.source?_.target:_.source;if(!j.has(Q)&&!j.has(E))continue;const L=W.get(Q),$=W.get(E),Z=B.get(Q);if(!L||!$||!Z)continue;const de=_.storageDirection==="flipped",Te=a==="RIGHT";let je;try{je=nl(Z,_.slotName)}catch{D&&console.log(`   SKIP ${Q}.${_.slotName}: row not displayed`);continue}const qe=Te?{x:L.x+(de?0:ke),y:L.y+je}:{x:L.x+ke/2,y:L.y+je},We=Te?{x:de?-1:1,y:0}:{x:0,y:1},ot=E===_.source,Ht=Te?{x:ot?$.x+ke:$.x,y:$.y+nt/2}:{x:$.x+ke/2,y:ot?$.y+$.height:$.y},Rn=Te?{x:ot?1:-1,y:0}:{x:0,y:ot?1:-1};k.set(_.id,dp(qe,Ht,We,Rn)),D&&console.log(`   reroute ${Q}.${_.slotName} -> ${E}`)}return D&&console.log(`[drag] rerouted ${k.size} edge(s)`),k},[I,S,N,P,W,a]);p.useEffect(()=>{if(!I||!new URLSearchParams(window.location.search).has("dbg"))return;const k=new Map;for(const D of I.edges){const j=Ae.get(D.id);if(!j)continue;const B=Xt(D.sections);if(B.length<2)continue;const _=re(j)===j.source?j.target:j.source;let Q=0,E=0;for(let $=1;$<B.length;$++){const Z=Math.abs(B[$].x-B[$-1].x),de=Math.abs(B[$].y-B[$-1].y);Z>.5&&de>.5&&E++,$>1&&Q++}const L=re(j);k.set(_,[...k.get(_)??[],`${L}.${j.slotName}  pts=${B.length} bends=${Q}${E?` DIAGONAL x${E}`:""}  start=(${Math.round(B[0].x)},${Math.round(B[0].y)}) end=(${Math.round(B[B.length-1].x)},${Math.round(B[B.length-1].y)})`])}for(const[D,j]of k){if(j.length<2)continue;console.log(`
=== approaches to ${D} (${j.length}) ===`);const B=W.get(D);B&&console.log(`   box at (${Math.round(B.x)},${Math.round(B.y)}) h=${Math.round(B.height)}`),j.forEach(_=>console.log("   "+_))}},[I,Ae,W]);const ve=p.useMemo(()=>{const k=new Map;if(!I)return k;for(const D of I.edges){const j=Ae.get(D.id);if(!j||j.storageDirection==="flipped"||be.has(D.id)||es(l,Xt(D.sections))<=0)continue;const B=re(j)===j.source?j.target:j.source,_=`${B}|${B===j.source?"out":"in"}`,Q=z.get(_);if(!Q)continue;const E=j.type==="ownership",L=ie.get(j.source)==="context"||ie.get(j.target)==="context",$=P.edgeColors.get(D.id),Z=k.get(_);k.set(_,Z?{...Z,isOwn:Z.isOwn||E,dimmed:Z.dimmed&&L,edgeIds:[...Z.edgeIds,D.id],...Z.color?.text===$?.text?{}:{color:void 0}}:{...Q,isOwn:E,dimmed:L,edgeIds:[D.id],...$?{color:$}:{}})}return k},[I,Ae,z,l,ie,P,be]),Pe=p.useMemo(()=>new Set(P.nodes.map(k=>k.id)),[P]),wt=p.useCallback(k=>!!s&&k.channel!=="plain"&&!k.isLoop&&!Pe.has(k.range),[s,Pe]),xi=p.useRef(null),Dn=p.useRef(null),jn=p.useRef(void 0),bi=p.useMemo(()=>{const k=new Map,D=new Map;for(const j of P.edges){D.set(j.id,[j.source,j.target]);for(const B of[j.source,j.target])k.set(B,[...k.get(B)??[],j.id])}return{nodeEdges:k,edgeEnds:D}},[P]),vi=p.useRef(bi);vi.current=bi;const it=p.useCallback(k=>{jn.current=k,Dn.current===null&&(Dn.current=requestAnimationFrame(()=>{Dn.current=null;const D=jn.current;jn.current=void 0;const j=xi.current,B=X.wrapperRef.current;if(D===void 0||!j||!B)return;let _=null,Q=null;if(D){const{nodeEdges:L,edgeEnds:$}=vi.current;if(D.kind==="node"){_=new Set(L.get(D.id)??[]),Q=new Set([D.id]);for(const Z of _)for(const de of $.get(Z)??[])Q.add(de)}else _=new Set([D.id]),Q=new Set($.get(D.id)??[])}const E=(L,$,Z)=>{L.style.filter=$===null||$?"":`opacity(${Z})`};j.querySelectorAll("path[data-edge-id]").forEach(L=>{const $=L.dataset.edgeId??"",Z=_?_.has($):null;E(L,Z,.38),L.style.strokeWidth=Z?String(L.dataset.channel==="reference"?Gp:ol):""}),j.querySelectorAll("path[data-arrowhead]").forEach(L=>{const $=(L.dataset.arrowhead??"").split(" ");E(L,_?$.some(Z=>_.has(Z)):null,.08)}),B.querySelectorAll("[data-node-id]").forEach(L=>{E(L,Q?Q.has(L.dataset.nodeId??""):null,.25)})}))},[]);p.useEffect(()=>it(null),[P,I,it]);const Tl=k=>y(D=>{const j=new Set(D);return j.has(k)?j.delete(k):j.add(k),j}),ki=k=>{Yn("dir",k),c(k)},Ft=k=>{Yn("merge",k),h(k)},Sl=()=>{Yn("sibs",!f),u(!f)},_t=e.getConceptLabel("attribute",!0).toLowerCase(),Fe=k=>`px-2 py-0.5 text-xs rounded border ${k?"border-blue-500 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300":"border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700"}`;return d.jsxs("div",{className:"relative w-full h-full",children:[d.jsxs("div",{"data-pan-ignore":!0,className:"absolute top-2 right-2 z-10 flex gap-1 items-center",children:[U&&d.jsxs("div",{className:`mr-2 flex items-center gap-2 rounded px-2 py-1
                          text-xs text-gray-500 dark:text-gray-400
                          bg-white/80 dark:bg-slate-900/80 shadow-sm`,children:[d.jsx("span",{className:`inline-block h-3 w-3 animate-spin rounded-full
                             border-2 border-gray-300 border-t-gray-600
                             dark:border-slate-600 dark:border-t-slate-300`}),"Computing layout…"]}),o&&d.jsxs(d.Fragment,{children:[d.jsx("button",{className:Fe(r),title:r?"Hide owners: show only what you selected":"Show every owner up to the root (can pull in most of the schema)",onClick:o,children:"⇱ roots"}),d.jsx("span",{className:"w-px h-4 bg-gray-300 dark:bg-slate-600 mx-1"})]}),d.jsx("button",{className:Fe(f),"data-help-id":"toolbar-siblings",title:f?"Siblings merged: classes sharing a parent share one box":"Siblings separate: no inheritance shown",onClick:Sl,children:"⑃ siblings"}),d.jsx("span",{className:"w-px h-4 bg-gray-300 dark:bg-slate-600 mx-1"}),d.jsx("button",{className:Fe(a==="RIGHT"),title:"Layout left to right",onClick:()=>ki("RIGHT"),children:"LR"}),d.jsx("button",{className:Fe(a==="DOWN"),title:"Layout top down",onClick:()=>ki("DOWN"),children:"TB"}),d.jsx("span",{className:"w-px h-4 bg-gray-300 dark:bg-slate-600 mx-1"}),d.jsx("button",{className:Fe(l==="near"),title:"Merge converging edges near the node (~40px)",onClick:()=>Ft("near"),children:"⋙"}),d.jsx("button",{className:Fe(l==="far"),title:"Merge converging edges early (~120px)",onClick:()=>Ft("far"),children:"⋙⋙"}),d.jsx("button",{className:Fe(l==="bend"),title:"Merge at ELK's last corner",onClick:()=>Ft("bend"),children:"⌙"}),d.jsx("button",{className:Fe(l==="off"),title:"No merging — every edge runs to its own port",onClick:()=>Ft("off"),children:"≡"}),d.jsx("span",{className:"w-px h-4 bg-gray-300 dark:bg-slate-600 mx-1"}),[["+",()=>X.zoomBy(1.3),"Zoom in"],["−",()=>X.zoomBy(1/1.3),"Zoom out"],["1:1",()=>X.applyZoom(1),"Reset zoom"],["⛶",()=>X.zoomToFit(),"Fit to view"]].map(([k,D,j])=>d.jsx("button",{onClick:D,title:j,className:Fe(!1),children:k},k))]}),d.jsx("div",{ref:X.containerRef,"data-graph-direction":a,className:"w-full h-full overflow-auto cursor-grab",children:d.jsx("div",{ref:X.spacerRef,children:d.jsx("div",{ref:X.wrapperRef,className:"relative",children:q&&d.jsxs(d.Fragment,{children:[d.jsxs("svg",{ref:xi,className:"absolute top-0 left-0 pointer-events-none",width:le,height:K,children:[d.jsxs("defs",{children:[d.jsx("marker",{id:g("arrow-own"),viewBox:"0 0 10 7",refX:"0",refY:"3.5",markerWidth:ze,markerHeight:ze*.75,markerUnits:"userSpaceOnUse",orient:"auto-start-reverse",children:d.jsx("path",{d:"M0,0L10,3.5L0,7Z",fill:xe.ownFwd})}),d.jsx("marker",{id:g("arrow-own-back"),viewBox:"0 0 10 7",refX:"10",refY:"3.5",markerWidth:ze,markerHeight:ze*.75,markerUnits:"userSpaceOnUse",orient:"auto-start-reverse",children:d.jsx("path",{d:"M10,0L0,3.5L10,7Z",fill:xe.ownBkwd})}),d.jsx("marker",{id:g("arrow-assoc"),viewBox:"0 0 10 7",refX:"0",refY:"3.5",markerWidth:ze*Uo,markerHeight:ze*.75*Uo,markerUnits:"userSpaceOnUse",orient:"auto-start-reverse",children:d.jsx("path",{d:"M0,0L10,3.5L0,7Z",fill:xe.association})})]}),d.jsxs("g",{transform:`translate(${rt}, ${rt})`,style:{opacity:J?1:0,transition:`opacity ${kp()}ms`},children:[[...ve].map(([k,D])=>d.jsx("path",{"data-arrowhead":D.edgeIds.join(" "),d:cp(D.base,D.dir,ze,Zn),fill:D.color?.text??Go(D.isOwn,!1),opacity:D.dimmed?.4:1,style:{transition:`filter ${Zt()}ms`}},`head-${k}`)),(I?.edges??[]).map(k=>{const D=Ae.get(k.id);if(!D)throw new Error(`Routed edge ${k.id} missing from view model`);const j=D.storageDirection==="flipped",B=re(D)===D.source?D.target:D.source,_=j||be.has(k.id)?void 0:z.get(`${B}|${B===D.source?"out":"in"}`),Q=ce.get(k.id),E=!!_&&es(l,Q??Xt(k.sections))>0,L=D.type!=="ownership",$=E?k.sections:Qp(k.sections,ze+Jn+(j?2:0)),Z=L?qp($,Zn+Jn):$,de=Q??Xt(Z),Te=Rn=>ip(Rn,zp),je=es(l,de),qe=_&&je>0?ap(de,_.base,je,Te):Te(de);if(!qe)return null;const We=D.type==="ownership",ot=ie.get(k.source)==="context"||ie.get(k.target)==="context",Ht=E?void 0:We?j?"arrow-own-back":"arrow-own":"arrow-assoc";return d.jsxs("g",{children:[d.jsx("path",{"data-edge-id":k.id,"data-channel":We?"ownership":"reference",d:qe,fill:"none",opacity:ot?.4:1,stroke:P.edgeColors.get(k.id)?.text??Go(We,j),strokeWidth:We?il:Up,strokeDasharray:We?void 0:"5 4",markerEnd:Ht?`url(#${g(Ht)})`:void 0,markerStart:!We&&!E?`url(#${g("arrow-assoc")})`:void 0,style:{transition:`filter ${Zt()}ms, stroke-width ${Zt()}ms`}}),d.jsx("path",{d:qe,fill:"none",stroke:"transparent",strokeWidth:11,style:{pointerEvents:"stroke"},onMouseEnter:()=>it({kind:"edge",id:k.id}),onMouseLeave:()=>it(null)})]},k.id)})]})]}),d.jsx(Hu,{initial:!1,children:P.nodes.map(k=>{const D=W.get(k.id);if(!D)return null;const j=k.role==="context",B=D.x+rt,_=D.y+rt,Q={duration:Yt(S.has(k.id)?0:Wa()),ease:xp};return d.jsxs(Zf.div,{initial:{opacity:0,x:B,y:_},animate:{opacity:j?Ip:1,x:B,y:_},exit:{opacity:0,transition:{duration:Yt(Ho())}},transition:{x:Q,y:Q,opacity:{duration:Yt(Ho()),delay:Yt(vp())}},"data-node-id":k.id,"data-help-id":Kl(k),"data-pan-ignore":!0,"data-pinned":N.has(k.id)?"":void 0,onPointerDown:E=>se(k.id,E),onClick:()=>{if(me.current){me.current=!1;return}n?.(k.members.length?k.label:k.id)},onMouseEnter:()=>it({kind:"node",id:k.id}),onMouseLeave:()=>it(null),className:`absolute rounded-md text-xs bg-white dark:bg-slate-800 cursor-pointer ${j?"border border-dashed border-gray-400 dark:border-slate-500":N.has(k.id)?"border-2 border-amber-500 dark:border-amber-400 shadow-md":"border-2 border-slate-500 dark:border-slate-400 shadow-md"}`,style:{width:ke,height:k.height,transition:`filter ${Zt()}ms`},children:[d.jsxs("div",{className:"flex items-center gap-1 px-2 rounded-t-[4px] bg-slate-700 dark:bg-slate-700 text-white border-b border-slate-800 dark:border-slate-600",style:{height:nt},children:[d.jsx("span",{className:`font-semibold truncate ${k.abstract?"italic":""}`,title:k.description||k.id,children:k.label}),d.jsxs("span",{className:"ml-auto flex gap-1 shrink-0",children:[k.members.length>0&&d.jsxs("span",{title:`${k.members.length} classes that are a ${k.label}, merged into one box`,className:"text-[9px] px-1 rounded bg-sky-100 dark:bg-sky-900 text-sky-800 dark:text-sky-200",children:["⑃ ",k.members.length]}),k.isaParents.map(E=>d.jsxs("span",{title:`is-a ${E}`,className:"text-[9px] px-1 rounded bg-sky-100 dark:bg-sky-900 text-sky-800 dark:text-sky-200",children:["⊳ ",E]},E)),k.subclassCount>0&&k.members.length===0&&d.jsxs("span",{title:`${k.subclassCount} subclasses shown`,className:"text-[9px] px-1 rounded bg-sky-100 dark:bg-sky-900 text-sky-800 dark:text-sky-200",children:["▷ ",k.subclassCount]}),(()=>{const L=(k.members.length?k.members.map($=>$.id):[k.id]).filter($=>t.has($));return L.length?d.jsx("button",{"data-dismiss":k.id,"data-help-id":"node-dismiss",title:L.length>1?`Remove all ${L.length} selected classes in ${k.label}`:`Remove ${k.label} from the canvas`,onClick:$=>{$.stopPropagation(),L.forEach(Z=>i?.(Z))},className:`text-[10px] leading-none px-1 rounded text-gray-400
                                         hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/40`,children:"✕"}):null})()]})]}),k.relationGroups.length>0&&d.jsx("div",{"data-help-id":"relation-bar",className:`flex items-center gap-1 px-2 border-b overflow-hidden
                                     border-gray-200 dark:border-slate-600
                                     bg-sky-50/60 dark:bg-sky-950/30`,style:{height:pi},children:d.jsx(Pp,{label:k.label,rows:k.relationRows,onAdd:E=>s?.(E),onRemove:E=>i?.(E),onInspect:n,colorOf:T,slotOrder:k.allRows.map(E=>E.slot)})}),k.rows.map(E=>E.header?d.jsx("div",{"data-no-drag":!0,"data-help-id":Ul(E.header.id),title:`${E.header.label} — is a ${k.label}; click for details`,onClick:L=>{L.stopPropagation(),n?.(E.header.id)},className:`flex items-center px-2 text-[10px] font-semibold
                                     cursor-pointer hover:brightness-110`,style:{height:st,background:E.header.color.fill,color:El},children:d.jsx("span",{className:"truncate",children:E.header.label})},E.slot):d.jsxs("div",{"data-help-id":Ql(k,E),"data-expandable":wt(E)?"":void 0,"data-no-drag":wt(E)?"":void 0,title:(E.channel==="plain"?`${E.slot}: ${E.range}`:`${E.slot} → ${E.range} (${E.cardinality})${E.flipped?" — owner side":""}`+(wt(E)?` — click to add ${E.range}`:""))+((E.owners?.length??0)>1?`
also declared by ${E.owners.slice(1).map(L=>L.label).join(", ")}`:""),onClick:wt(E)?L=>{L.stopPropagation(),s?.(E.range)}:void 0,className:`flex items-center gap-1.5 px-2 text-[11px] ${E.targetColor?"":E.connected?"text-gray-700 dark:text-gray-300":"text-gray-400 dark:text-gray-500"} ${wt(E)?"cursor-pointer hover:bg-sky-50 dark:hover:bg-sky-900/30 hover:text-sky-700 dark:hover:text-sky-300":""}`,style:{height:st,...E.targetColor?{color:E.targetColor.text}:{}},children:[d.jsx("span",{className:"w-1.5 h-1.5 rounded-full shrink-0 border",style:{borderColor:E.rangeColor,background:E.connected?E.rangeColor:"transparent"}}),d.jsx("span",{className:`truncate ${k.members.length&&!E.owners?.length?`font-semibold ${E.targetColor?"":"text-gray-900 dark:text-gray-100"}`:""}`,children:E.slot}),E.isLoop&&d.jsx(_p,{title:`self-referential: a ${E.range} can own another ${E.range} via ${E.slot}`}),d.jsxs("span",{className:"ml-auto text-[9px] truncate max-w-[90px]",children:[d.jsx("span",{style:{color:E.rangeColor},children:E.range}),d.jsxs("span",{className:"text-gray-400 dark:text-gray-500",children:[" ",E.cardinality]})]})]},E.declaringClass?`${E.declaringClass}|${E.slot}`:E.slot)),k.hiddenCount>0&&d.jsx("button",{className:"w-full text-left px-2 text-[10px] text-sky-600 dark:text-sky-400 hover:underline",style:{height:Xa},title:`${_t} without an edge on the current canvas, plus plain (non-entity) ${_t}`,onClick:E=>{E.stopPropagation(),Tl(k.id)},children:k.expanded?`− fewer ${_t}`:`+ ${k.hiddenCount} more ${_t}`})]},k.id)})})]})})})})]})}function Yp({classId:e,dataService:t,onClose:n,onNavigate:s,isSelected:i,onToggleSelect:r}){const o=p.useMemo(()=>t.getClassSummary(e),[e,t]),[a,c]=p.useState([]),l=p.useCallback(u=>{u!==e&&(c(w=>[...w,e]),s(u))},[e,s]),h=p.useCallback(()=>{c(u=>u.length===0?u:(s(u[u.length-1]),u.slice(0,-1)))},[s]);p.useEffect(()=>{const u=w=>{w.key==="Escape"&&n()};return window.addEventListener("keydown",u),()=>window.removeEventListener("keydown",u)},[n]);const f=t.getTypeLabel("slot",!0);return d.jsxs("aside",{className:`w-96 shrink-0 flex flex-col min-h-0 border-l border-gray-200 dark:border-slate-700
                 bg-white dark:bg-slate-900`,"aria-label":"Entity details",children:[d.jsxs("header",{className:`flex items-start gap-2 px-3 py-2 border-b border-gray-200 dark:border-slate-700
                   bg-gray-50 dark:bg-slate-800 shrink-0`,children:[a.length>0&&d.jsx("button",{onClick:h,className:"text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-sm mt-0.5",title:"Back",children:"←"}),d.jsxs("div",{className:"flex-1 min-w-0",children:[d.jsxs("div",{className:"font-semibold text-sm text-blue-700 dark:text-blue-300 break-words",children:[o?.name??e,o?.isAbstract&&d.jsx("span",{className:"ml-1 text-xs text-purple-500 italic",children:"(abstract)"})]}),o?.parentId&&d.jsxs("div",{className:"text-xs text-gray-400",children:["is a"," ",d.jsx("button",{onClick:()=>l(o.parentId),className:"text-blue-600 dark:text-blue-400 hover:underline",children:o.parentId})]})]}),d.jsx("button",{onClick:n,className:"text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-sm px-1",title:"Close (Esc)",children:"✕"})]}),o?d.jsxs("div",{className:"flex-1 overflow-y-auto min-h-0 px-3 py-2 space-y-3",children:[d.jsx("button",{onClick:()=>r(e),className:`w-full px-2 py-1 text-xs rounded border ${i?"border-blue-500 bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300":"border-gray-300 dark:border-slate-600 hover:border-blue-400 text-gray-600 dark:text-gray-300"}`,children:i?"✓ In diagram — click to remove":"+ Add to diagram"}),o.description&&d.jsx("p",{className:"text-xs text-gray-600 dark:text-gray-300 leading-relaxed",children:o.description}),o.referencedBy.length>0&&d.jsxs("section",{children:[d.jsxs(Qo,{children:["Referenced by (",o.referencedBy.length,")"]}),d.jsx("ul",{className:"space-y-0.5",children:o.referencedBy.map((u,w)=>d.jsxs("li",{className:"text-xs",children:[d.jsx("button",{onClick:()=>l(u.classId),className:"text-blue-600 dark:text-blue-400 hover:underline cursor-pointer",children:u.classId}),d.jsxs("span",{className:"text-gray-400",children:[".",u.slotName]})]},`${u.classId}.${u.slotName}-${w}`))})]}),o.slots.length>0&&d.jsxs("section",{children:[d.jsxs(Qo,{children:[f," (",o.slots.length,")"]}),d.jsx("ul",{className:"divide-y divide-gray-100 dark:divide-slate-700",children:o.slots.map((u,w)=>d.jsxs("li",{className:"py-1.5",children:[d.jsxs("div",{className:"flex items-baseline gap-1.5 flex-wrap",children:[d.jsx("span",{className:"text-xs font-medium text-gray-800 dark:text-gray-100",children:u.name}),d.jsx(Zp,{range:u.range,onNavigate:l,dataService:t})]}),u.description&&d.jsx("p",{className:"mt-0.5 text-[11px] text-gray-500 dark:text-gray-400 leading-snug break-words",children:u.description})]},`${u.name}-${w}`))})]})]}):d.jsxs("div",{className:"p-3 text-xs text-gray-500",children:["Entity not found: ",e]})]})}function Qo({children:e}){return d.jsx("div",{className:"text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-1",children:e})}function Zp({range:e,onNavigate:t,dataService:n}){const s=n.itemExists(e)&&!e.endsWith("Enum"),o=`inline-block px-1 py-0 rounded text-[11px] font-medium ${new Set(["string","integer","boolean","float","double","decimal","date","datetime","time","uri","uriorcurie","ncname"]).has(e.toLowerCase())?"bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300":e.endsWith("Enum")?"bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300":"bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"}`;return s?d.jsx("button",{onClick:()=>t(e),className:`${o} hover:underline cursor-pointer`,children:e}):d.jsx("span",{className:o,children:e})}const Jp=[{heading:"One rule at a time",cases:[{name:"Rule 1 — multivalued owns forward",note:"A multivalued slot means the owner has-a collection, so ownership runs forward: Questionnaire.items and ResearchStudy.consents. The two `part_of` self-loops are the counterexample — multivalued but drawn backward, because they walk UP a tree.",sel:["ResearchStudy","Consent","Questionnaire","QuestionnaireItem"]},{name:"Rule 2 — single-valued belongs backward",note:"The largest group (70 edges). Participant fans OUT to 22 targets, nearly all reversed: each target declares `associated_participant` and is drawn as belonging to Participant. This is the group that would move if own-bkwd merges into association.",sel:["Participant","Condition","Demography","Exposure","Procedure","Visit"]},{name:"Exception 2a — no independent existence",note:"Single-valued, but forward anyway: Quantity, TimePoint and the like have no identity of their own, so the value belongs to whoever holds it rather than owning the holder.",sel:["SpecimenStorageActivity","Quantity","TimePoint","Activity"]},{name:"Entity-ranged — always forward",note:"The twelve focus / associated_evidence slots range on Entity, the universal root. A pointer AT the root is never a foreign key back to an owner, so these run forward whatever their cardinality. Both single- and multi-valued focus sites are here — all should point AT Entity.",sel:["Observation","ObservationSet","MeasurementObservation","Document","Condition","SdohObservation","Entity"]},{name:"Association — no ownership claim",note:"Both associations in the schema: Document.related_document → Specimen, and SpecimenContainer.container → SpecimenStorageActivity. Slate and dashed, arrowed at both ends. They are listed explicitly because they are multivalued, so Rule 1 would otherwise call them ownership.",sel:["Document","Specimen","SpecimenContainer","SpecimenStorageActivity"]},{name:"Self-loops",note:"The five self-owning slots (TimePoint.index_time_point, File.derived_from, Specimen.parent_specimen, ResearchStudy.part_of, SpecimenContainer.parent_container) — loop markers, not routed edges. ResearchStudy also pulls in its TimePoint edges; the loops are the circular arrows on the rows.",sel:["TimePoint","File","Specimen","ResearchStudy","SpecimenContainer"]}]},{heading:"Inheritance (the ⑃ siblings toggle)",cases:[{name:"One child, merged with its parent",note:"MeasurementObservation alone. It still merges: the box is titled Observation, its 13 inherited rows sit at the top in black, and MeasurementObservation's own 9 follow under its coloured header. Merging does not wait for a second sibling — a class must not change shape because of what else you happen to select.",sel:["MeasurementObservation"]},{name:"Children that add nothing",note:'SpecimenQuality- and SpecimenQuantityObservation declare no slots of their own. Both still get a header under the shared rows, because "this subclass adds nothing" is the answer to what they are — and without the headers the selection would leave no trace in the box at all.',sel:["SpecimenQualityObservation","SpecimenQuantityObservation"]},{name:"slot_usage — same name, different type",note:"QuestionnaireResponseValue's five children each narrow `value` to a different type (boolean, decimal, integer, TimePoint, and the parent's string). That narrowing is the entire reason the five classes exist, so each keeps its OWN row rather than merging into the parent's — the one place a shared row would be a lie.",sel:["QuestionnaireResponseValueBoolean","QuestionnaireResponseValueDecimal","QuestionnaireResponseValueInteger","QuestionnaireResponseValueString","QuestionnaireResponseValueTimePoint"]},{name:"The full Observation family",note:"All five Observation subclasses plus the parent. One box where there would be six, and the shared rows are stated once. Turn ⑃ siblings off to see what it replaces. Note each edge leaves in the colour of the child that owns its row; inherited slots' edges are the parent's and are drawn once, not once per child.",sel:["Observation","MeasurementObservation","SdohObservation","DimensionalObservation","SpecimenQualityObservation","SpecimenQuantityObservation"]}]},{heading:"The bare diagonal",cases:[{name:"BodySite 6-way (the original)",note:"The reproducer from the handoff. In ⌙ (bend) the top approach arrives as a straight diagonal with no steps; in ⋙ (near) it keeps its horizontal run. This is the case the fix has to fix.",sel:["BodySite","Condition","Consent","Demography","Exposure","Observation","Procedure","ImagingFile","ImagingStudy","MeasurementObservation","SpecimenCreationActivity"]},{name:"BodySite, owners only",note:"The same convergence with nothing else on canvas — six owners, no unrelated boxes for a diagonal to cut across. Shows whether the degeneracy is about the convergence itself or about crowding.",sel:["BodySite","Condition","ImagingFile","ImagingStudy","MeasurementObservation","Procedure","SpecimenCreationActivity"]},{name:"TimePoint 16-edge",note:"Densest corridor in the schema: 8 owners but 16 slot-edges, since each Specimen*Activity owns date_started and date_ended. Also where the second-from-top edge goes diagonal and pair edges cross.",sel:["TimePoint","Consent","ResearchStudy","TimePeriod","SpecimenCreationActivity","SpecimenProcessingActivity","SpecimenStorageActivity","SpecimenTransportActivity","QuestionnaireResponseValueTimePoint"]},{name:"TimePoint + Person (crossing)",note:"Siggie's repro for the crossing bug: the paired date_started / date_ended edges from different owners cross each other on the way in. Compare pair ordering against the case above.",sel:["TimePoint","Person","Consent","ResearchStudy","TimePeriod","SpecimenCreationActivity","SpecimenProcessingActivity","SpecimenStorageActivity","SpecimenTransportActivity","QuestionnaireResponseValueTimePoint"]}]},{heading:"Pathological convergences",cases:[{name:"Quantity 19-edge (worst case)",note:"The largest convergence in the schema: 16 owning classes, 19 slot-edges. The fan is squeezed hardest here, so ENTITY_FAN_GAP and the merge distance both show their limits.",sel:["Quantity","Activity","Assay","DeviceExposure","DimensionalObservation","DrugExposure","MeasurementObservation","Observation","Procedure","SdohObservation","SpecimenCreationActivity","SpecimenProcessingActivity","SpecimenQualityObservation","SpecimenQuantityObservation","SpecimenStorageActivity","SpecimenTransportActivity","Substance"]},{name:"Context 6-way (uniform owners)",note:"Six owners that are all observation classes — same size, same shape, similar row counts. The controlled comparison for BodySite, whose owners vary wildly in height.",sel:["Context","DimensionalObservation","MeasurementObservation","Observation","SdohObservation","SpecimenQualityObservation","SpecimenQuantityObservation"]},{name:"Two convergences at once",note:"Quantity and TimePoint both converge from the same Specimen activity classes, so two corridors compete for the same space. Where merge distance trades off against crossings.",sel:["Quantity","TimePoint","SpecimenCreationActivity","SpecimenProcessingActivity","SpecimenStorageActivity","SpecimenTransportActivity"]}]},{heading:"Flipped divergences (found via the legend)",cases:[{name:"Participant 22-way (largest fan in the schema)",note:"Bigger than any inbound convergence: 22 edges leaving Participant, 21 of them FLIPPED. Flipped edges keep their attribute-row anchor and must not merge, so this is the fan the merge code deliberately does not touch — and therefore the one nothing has been tuned against.",sel:["Participant","Condition","Consent","Demography","DeviceExposure","DrugExposure","Exposure","File","ImagingStudy","MeasurementObservation","Observation","Procedure","SdohObservation","Specimen","Visit"]},{name:"Visit 19-way",note:"The same shape one size down, and it overlaps Participant heavily — most classes carry both associated_participant and associated_visit, so the two fans run through the same corridor as pairs.",sel:["Visit","Condition","Demography","DeviceExposure","DrugExposure","Exposure","ImagingStudy","MeasurementObservation","Observation","Procedure","QuestionnaireResponse","SdohObservation","TimePeriod"]},{name:"Participant + Visit + Organization",note:"All three FK hubs at once (22 + 19 + 11 edges, nearly all flipped). The densest picture the schema can produce, and the stress test for anything that changes routing.",sel:["Participant","Visit","Organization","Condition","Demography","DimensionalObservation","MeasurementObservation","Observation","ObservationSet","Procedure","SdohObservation","SpecimenQualityObservation","SpecimenQuantityObservation"]},{name:"Converge and diverge at once",note:"MeasurementObservation owns BodySite/Context/Quantity while being owned by Participant/Visit/Organization — edges fan IN and OUT of the same box. Where merged (entity-end) and unmerged (flipped) arrivals sit side by side.",sel:["MeasurementObservation","BodySite","Context","Quantity","Participant","Visit","Organization","MeasurementObservationSet"]}]},{heading:"Normal cases (a fix must not break these)",cases:[{name:"Single edge",note:"One owner, one edge, no convergence at all — merging is a no-op. The floor: if this looks wrong, something basic broke.",sel:["Visit","TimePeriod"]},{name:"Two owners",note:"The smallest real convergence. Two approaches, one arrowhead — the fan is barely a fan, so a merge distance that is too long is obvious here first.",sel:["Participant","Visit","ObservationSet"]},{name:"Specimen chain (deep, not wide)",note:"A long ownership chain rather than a convergence: many layers, few edges per node. Checks that tuning for convergences has not made ordinary edges worse.",sel:["Specimen","SpecimenContainer","SpecimenCreationActivity","SpecimenProcessingActivity","SpecimenStorageActivity","SpecimenTransportActivity","Participant"]},{name:"The known 3-node cycle",note:"Specimen -> SpecimenStorageActivity -> SpecimenContainer -> Specimen: an association plus two ownership edges. Known and deliberately unhandled; here so it stays visible.",sel:["Specimen","SpecimenStorageActivity","SpecimenContainer"]},{name:"Backward ownership (own-bkwd)",note:"Slots drawn backward (performed_by, associated_person, contained_in, related_imaging_study). These keep their attribute-row anchor and must NOT merge — check the arrowheads.",sel:["Organization","Person","Participant","ImagingFile","ImagingStudy","SpecimenContainer","Specimen"]},{name:"Path to root",note:"Path-to-root on from a single deep class, which pulls in every owner up the chain. The biggest graph reachable in one click.",sel:["MeasurementObservation"],roots:!0}]}],em=3,ts=40;function rl(){const[e,t]=p.useState(null),n=p.useCallback(i=>{if(i.button!==0||i.target.closest('button, a, input, select, textarea, [role="button"], [data-no-drag]'))return;const o=(i.currentTarget.closest("[data-draggable]")??i.currentTarget).getBoundingClientRect(),a=i.clientX,c=i.clientY,l={left:o.left,top:o.top},h=i.currentTarget;h.setPointerCapture(i.pointerId);let f=!1;const u=g=>{const m=g.clientX-a,y=g.clientY-c;if(!f&&Math.hypot(m,y)<em)return;f=!0;const x={left:Math.max(Math.min(l.left+m,window.innerWidth-ts),ts-o.width),top:Math.min(Math.max(l.top+y,0),window.innerHeight-ts)};t(x)},w=g=>{h.releasePointerCapture(g.pointerId),h.removeEventListener("pointermove",u),h.removeEventListener("pointerup",w),h.removeEventListener("pointercancel",w)};h.addEventListener("pointermove",u),h.addEventListener("pointerup",w),h.addEventListener("pointercancel",w)},[]),s=p.useCallback(()=>t(null),[]);return{offset:e,onPointerDown:n,reset:s}}function al({title:e,subtitle:t,onClose:n,offset:s,children:i}){const r=rl();p.useEffect(()=>{const a=c=>{c.key==="Escape"&&n()};return window.addEventListener("keydown",a),()=>window.removeEventListener("keydown",a)},[n]);const o=r.offset!==null;return d.jsxs("div",{"data-draggable":"",style:{resize:"both",...r.offset?{position:"fixed",...r.offset,right:"auto"}:{}},className:`z-30 w-[26rem] max-h-[80vh] overflow-y-auto
                  rounded-lg border border-gray-300 dark:border-slate-600
                  bg-white dark:bg-slate-800 shadow-xl
                  text-gray-900 dark:text-gray-100
                  ${o?"":`absolute top-14 ${s?"right-[27rem]":"right-4"}`}`,children:[d.jsxs("div",{onPointerDown:r.onPointerDown,className:`sticky top-0 flex items-baseline justify-between gap-2 px-4 py-2
                   border-b border-gray-200 dark:border-slate-700
                   bg-white dark:bg-slate-800 cursor-grab active:cursor-grabbing
                   select-none`,children:[d.jsxs("div",{children:[d.jsx("h2",{className:"text-sm font-semibold",children:e}),t&&d.jsx("p",{className:"text-[11px] text-gray-500 dark:text-gray-400",children:t})]}),d.jsxs("div",{className:"flex items-center gap-1 shrink-0",children:[o&&d.jsx("button",{onClick:r.reset,title:"Put it back",className:`text-gray-400 hover:text-gray-700 dark:hover:text-gray-200
                         text-xs leading-none px-1`,children:"⤺"}),d.jsx("button",{onClick:n,title:"Close (Esc)",className:"text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-lg leading-none",children:"×"})]})]}),d.jsx("div",{className:"px-4 py-2",children:i})]})}function tm(e,t){return e.sel.length===t.size&&e.sel.every(n=>t.has(n))}function nm({onClose:e,onApply:t,selectedIds:n,dataService:s,offset:i}){const r=p.useMemo(()=>s.getConvergenceRanking(),[s]),o=p.useMemo(()=>s.getDivergenceRanking(),[s]),a=c=>t({name:"ad hoc",note:"",sel:c});return d.jsxs(al,{title:"Example cases",subtitle:"Selections worth looking at, simple to dense.",onClose:e,offset:i,children:[d.jsxs("section",{className:"mb-4",children:[d.jsx(qo,{children:"Biggest fans"}),d.jsx("p",{className:"text-[11px] text-gray-500 dark:text-gray-400 mb-1.5",children:"Counted in slot-edges, not classes: one class owning a target through two slots crowds the corridor twice. Click a row to load just that fan."}),d.jsx("div",{className:"grid grid-cols-2 gap-3",children:[["Converging (in)",r.slice(0,6).map(c=>({entity:c.entity,n:c.edgeCount,peers:c.owners,flipped:0}))],["Diverging (out)",o.slice(0,6).map(c=>({entity:c.entity,n:c.edgeCount,peers:c.owned,flipped:c.flippedCount}))]].map(([c,l])=>d.jsxs("div",{children:[d.jsx("h4",{className:"text-[10px] font-medium text-gray-500 dark:text-gray-400 mb-0.5",children:c}),d.jsx("ul",{className:"space-y-0.5",children:l.map(h=>d.jsx("li",{children:d.jsxs("button",{onClick:()=>a([h.entity,...h.peers]),title:`Select ${h.entity} and all ${h.peers.length} peers`,className:"w-full text-left text-xs hover:bg-gray-50 dark:hover:bg-slate-700 rounded px-1",children:[d.jsx("span",{className:"text-blue-600 dark:text-blue-400",children:h.entity}),d.jsxs("span",{className:"text-gray-400 ml-1",children:[h.n,h.flipped>0?` (${h.flipped} flipped)`:""]})]})},h.entity))})]},c))})]}),Jp.map(c=>d.jsxs("section",{className:"mb-3 last:mb-1",children:[d.jsx(qo,{children:c.heading}),d.jsx("ul",{className:"space-y-1.5",children:c.cases.map(l=>{const h=tm(l,n);return d.jsx("li",{children:d.jsxs("button",{onClick:()=>t(l),className:`block w-full text-left rounded px-2 py-1 border
                      ${h?"border-blue-500 bg-blue-50 dark:bg-blue-950":"border-transparent hover:bg-gray-50 dark:hover:bg-slate-700"}`,children:[d.jsx("span",{className:`text-xs font-medium ${h?"text-blue-700 dark:text-blue-300":"text-blue-600 dark:text-blue-400"}`,children:l.name}),d.jsxs("span",{className:"ml-1.5 text-[10px] text-gray-400",children:[l.sel.length,l.roots?" ⇱":""]}),d.jsx("p",{className:"text-[11px] leading-snug text-gray-600 dark:text-gray-400 mt-0.5",children:l.note})]})},l.name)})})]},c.heading))]})}function qo({children:e}){return d.jsx("h3",{className:`text-[11px] font-semibold uppercase tracking-wider
                   text-gray-400 dark:text-gray-500 mb-1`,children:e})}const Xo={"own-fwd":{text:"owns (forward)",color:xe.ownFwd},"own-bkwd":{text:"belongs to (backward)",color:xe.ownBkwd},association:{text:"association (no ownership)",color:xe.association},excluded:{text:"dropped",cls:"text-gray-400 dark:text-gray-500 border-gray-300"}},sm=[{kind:"own-fwd",color:xe.ownFwd,title:"A owns B",body:"The arrow runs from the owner to what it holds. A owns B when the schema puts the collection on A, or when B has no independent existence — a Quantity of 5 mg is not something you look up."},{kind:"own-bkwd",color:xe.ownBkwd,title:"A belongs to B",body:'The same relationship stored at the other end: A carries a pointer to one B that exists without it. Drawn B → A, so you still read "start at B to find A". A Participant carries on existing whether or not any observation points at it.'},{kind:"association",color:xe.association,title:"A and B are associated",body:"Neither owns the other. Dashed, with arrowheads at both ends. Only two edges in the schema are this — a slot the ownership rules would otherwise claim, wrongly."}],im=[{glyph:"⇱ roots",what:"Also draw everything on the path up to a root."},{glyph:"⑃ siblings",what:"Draw classes that share a parent as one merged box."},{glyph:"LR / TB",what:"Lay the diagram out left-to-right or top-down."},{glyph:"⋙ ⋙⋙ ⌙ ≡",what:"Where converging edges join before their shared arrowhead — near the box, early, at the last corner, or not at all. Temporary, for picking one by eye."},{glyph:"+ − 1:1 ⛶",what:"Zoom in, out, reset, fit to view."}],om=[["0..1","optional, at most one"],["1..1","required, exactly one"],["0..*","optional, any number"],["1..*","required, one or more"]];function rm({dataService:e,onClose:t,onSelect:n,offset:s}){const i=p.useMemo(()=>e.getOwnershipPairGroups(),[e]),[r,o]=p.useState(null),a=c=>d.jsx("button",{onClick:()=>n([c]),className:"hover:underline text-blue-600 dark:text-blue-400",title:`Select ${c}`,children:c});return d.jsx(al,{title:"Ownership legend",subtitle:"What the diagram's arrows, colors and buttons mean.",onClose:t,offset:s,children:d.jsxs("div",{className:"text-xs",children:[d.jsxs(bt,{title:"The three kinds of relationship",children:[d.jsxs("p",{className:"text-[11px] text-gray-500 dark:text-gray-400 mb-2",children:["Every edge is a class-valued attribute. Classes are placed so that if ",d.jsx("b",{children:"A"})," is drawn before ",d.jsx("b",{children:"B"}),", you reach ",d.jsx("b",{children:"B"})," through"," ",d.jsx("b",{children:"A"})," — so an edge always tells you where to start."]}),d.jsx("ul",{className:"space-y-2",children:sm.map(c=>d.jsxs("li",{className:"flex gap-2",children:[d.jsx(za,{kind:c.kind,className:"mt-0.5"}),d.jsxs("div",{className:"min-w-0",children:[d.jsx("div",{className:"font-medium",style:{color:c.color},children:c.title}),d.jsx("p",{className:"text-[11px] leading-snug text-gray-600 dark:text-gray-400",children:c.body})]})]},c.title))}),d.jsxs("p",{className:"text-[11px] leading-snug text-gray-500 dark:text-gray-400 mt-2",children:["An edge leaves the ",d.jsx("b",{children:"attribute's row"}),", not the box — that is how you tell which attribute made it. A ",d.jsx("b",{children:"⟲"})," on a row is a slot pointing back at its own class."]}),d.jsxs("p",{className:"text-[11px] leading-snug text-gray-500 dark:text-gray-400 mt-2",children:["Owners are drawn first, so a box's ",d.jsx("b",{children:"← N"})," counts what it belongs to (on its left) and ",d.jsx("b",{children:"M →"})," what it owns (on its right). Hover either to list them. The little edge on each row is the one above: it says which end holds the arrowhead, and so which entity declares the attribute — and ",d.jsx("i",{children:"both"})," kinds turn up on ",d.jsx("i",{children:"both"})," sides."]})]}),d.jsxs(bt,{title:"Colors",children:[d.jsx(Yo,{caption:"A row's dot and its range label say what KIND of thing the attribute points at.",items:[{color:He.entity,label:"another entity"},{color:He.enum,label:"a value set"},{color:He.dataType,label:"a data type"}]}),d.jsxs("p",{className:"text-[11px] leading-snug text-gray-600 dark:text-gray-400 mt-2",children:["A ",d.jsx("b",{children:"filled"})," dot draws an edge; a ",d.jsx("b",{children:"hollow"})," one does not, because what it points at is not on the canvas. Only entity ranges can draw edges at all."]}),d.jsx(Yo,{className:"mt-3",caption:"Inside a merged box, a color says which class an attribute belongs to.",items:Il.slice(0,4).map((c,l)=>({color:c.text,swatch:c.fill,label:l===0?"the parent":`child ${l}`}))})]}),d.jsx(bt,{title:"Cardinality",children:d.jsx("ul",{className:"flex flex-wrap gap-x-4 gap-y-1",children:om.map(([c,l])=>d.jsxs("li",{className:"flex items-center gap-1.5",children:[d.jsx("span",{className:"font-mono text-[11px] text-gray-700 dark:text-gray-300",children:c}),d.jsx("span",{className:"text-[11px] text-gray-500 dark:text-gray-400",children:l})]},c))})}),d.jsx(bt,{title:"The toolbar",children:d.jsx("ul",{className:"space-y-1",children:im.map(c=>d.jsxs("li",{className:"flex gap-2",children:[d.jsx("span",{className:"shrink-0 font-mono text-[11px] text-gray-700 dark:text-gray-300 w-20",children:c.glyph}),d.jsx("span",{className:"text-[11px] leading-snug text-gray-600 dark:text-gray-400",children:c.what})]},c.glyph))})}),d.jsxs(bt,{title:"Every relationship, by rule",children:[d.jsx("p",{className:"text-[11px] text-gray-500 dark:text-gray-400 mb-1.5",children:"Derived live from the classifier the graph itself uses, so this cannot drift from what is drawn. Overrides and value-object membership are hand-curated — if a pair looks wrong, the classification is. Click any class to select it."}),d.jsx("ul",{className:"space-y-1",children:i.map(c=>{const l=`${c.verdict}/${c.rule}`,h=Xo[c.verdict]??Xo.excluded,f=r===l;return d.jsxs("li",{className:"border-l-2 pl-2 border-gray-200 dark:border-slate-600",children:[d.jsxs("button",{onClick:()=>o(f?null:l),className:"w-full text-left",children:[d.jsx("span",{className:`inline-block px-1 rounded border text-[10px] ${h.cls??""}`,style:h.color?{color:h.color,borderColor:h.color}:void 0,children:h.text}),d.jsx("span",{className:"ml-1.5 font-medium",children:c.rule}),d.jsx("span",{className:"ml-1 text-gray-400",children:c.pairs.length}),d.jsx("span",{className:"ml-1 text-gray-400",children:f?"▾":"▸"})]}),d.jsx("p",{className:"text-[11px] leading-snug text-gray-600 dark:text-gray-400 mt-0.5",children:c.ruleText}),f&&d.jsx("ul",{className:"mt-1 mb-1.5 space-y-0.5 font-mono text-[10px]",children:c.pairs.map(u=>d.jsxs("li",{className:"text-gray-600 dark:text-gray-400",children:[a(u.declaredOn),d.jsxs("span",{className:"text-gray-400",children:[".",u.slotName]}),d.jsx("span",{className:"mx-1 text-gray-400",children:u.multivalued?"↠":"→"}),a(u.range),u.isLoop&&d.jsx("span",{className:"ml-1",style:{color:He.entity},children:"loop"}),(c.verdict==="own-bkwd"||c.verdict==="association")&&d.jsxs("span",{className:"ml-1 text-gray-400",children:["(owner: ",u.owner,")"]})]},`${u.declaredOn}.${u.slotName}`))})]},l)})})]}),d.jsxs("p",{className:"text-[10px] text-gray-400 dark:text-gray-500 mt-3",children:["A box's ",d.jsx("b",{children:"“N related”"})," count is of distinct classes"," ",d.jsx("i",{children:"outside"})," it, so selecting a class that folds into a merged box can make the number go ",d.jsx("i",{children:"down"}),". Correct, if counter-intuitive."]})]})})}function bt({title:e,children:t}){return d.jsxs("section",{className:"mb-4 last:mb-1",children:[d.jsx("h3",{className:`text-[11px] font-semibold uppercase tracking-wider
                     text-gray-400 dark:text-gray-500 mb-1`,children:e}),t]})}function Yo({caption:e,items:t,className:n}){return d.jsxs("div",{className:n,children:[d.jsx("p",{className:"text-[11px] text-gray-500 dark:text-gray-400 mb-1",children:e}),d.jsx("ul",{className:"flex flex-wrap gap-x-3 gap-y-1",children:t.map(s=>d.jsxs("li",{className:"flex items-center gap-1",children:[d.jsx("span",{className:"inline-block w-3 h-3 rounded-sm border",style:{background:s.swatch??s.color,borderColor:s.color}}),d.jsx("span",{className:"text-[11px]",style:{color:s.color},children:s.label})]},s.label))})]})}const am=!1,lm=!1,ll=p.createContext(null);function yt(){const e=p.useContext(ll);if(!e)throw new Error("useHelp must be used inside <HelpProvider>");return e}const cm=300,dm=[{id:"graph-canvas-reading",label:"Reading the diagram"},{id:"relation-bar",label:"The relation bar"},{id:"toolbar-siblings",label:"Inheritance and merged boxes"},{id:"node-dismiss",label:"Closing a box"},{id:"copy-link",label:"Sharing what you see"}];function hm({onOpenLegend:e,onOpenCases:t,legendOpen:n,casesOpen:s,onClosePanels:i,anyPanelOpen:r}){const{showEntry:o,showAddresses:a,toggleAddresses:c}=yt(),[l,h]=p.useState(!1),f=p.useRef(void 0),u=()=>{f.current!==void 0&&(clearTimeout(f.current),f.current=void 0)},w=()=>{u(),f.current=setTimeout(()=>h(!1),cm)};p.useEffect(()=>u,[]),p.useEffect(()=>{if(!l)return;const m=x=>{x.target?.closest("[data-help-menu]")||h(!1)},y=x=>{x.key==="Escape"&&h(!1)};return document.addEventListener("mousedown",m,!0),document.addEventListener("keydown",y),()=>{document.removeEventListener("mousedown",m,!0),document.removeEventListener("keydown",y)}},[l]);const g=m=>()=>{h(!1),m()};return d.jsxs("span",{"data-help-menu":!0,"data-help-id":"help-menu",className:"relative",onMouseEnter:()=>{u(),h(!0)},onMouseLeave:w,children:[d.jsxs("button",{onClick:()=>h(m=>!m),title:"Legend, example cases and help topics",className:`text-sm underline hover:text-white ${l?"text-white":"text-blue-100"}`,children:["Help ",d.jsx("span",{"aria-hidden":!0,className:"opacity-70",children:"▾"})]}),l&&d.jsxs("div",{className:`absolute right-0 top-full mt-1 z-40 w-60 py-1
                     rounded-md border border-gray-300 dark:border-slate-600
                     bg-white dark:bg-slate-800 shadow-xl
                     text-gray-900 dark:text-gray-100`,children:[d.jsxs(tn,{onClick:g(e),children:[n?"Hide ownership legend":"Ownership legend",d.jsx(ns,{children:"every relationship in the schema, by rule"})]}),d.jsxs(tn,{onClick:g(t),children:[s?"Hide example cases":"Example cases",d.jsx(ns,{children:"selections worth looking at"})]}),r&&d.jsxs(tn,{onClick:g(i),children:["Close all panels",d.jsx(ns,{children:"legend, cases and the detail drawer"})]}),d.jsx(um,{}),dm.map(m=>d.jsx(tn,{onClick:g(()=>o(m.id)),children:m.label},m.id)),lm]})]})}function tn({onClick:e,children:t}){return d.jsx("button",{onClick:e,className:`block w-full text-left px-3 py-1.5 text-xs
                 hover:bg-gray-100 dark:hover:bg-slate-700`,children:t})}function ns({children:e}){return d.jsx("span",{className:"block text-[10px] text-gray-400 dark:text-gray-500",children:e})}function um(){return d.jsx("div",{className:"my-1 border-t border-gray-200 dark:border-slate-700"})}function cl(e){const t=Number(e?.trim());return Number.isFinite(t)&&t>=240?t:void 0}function dl(e){const t=e?.trim().toLowerCase();return t==="dim"||t==="ring"||t==="none"?t:void 0}function hl(e){const t=e?.trim().toLowerCase();return t==="left"||t==="right"||t==="top"||t==="bottom"?t:void 0}function ul(e){const t=e?.trim();if(!t)return;const n=Number(t);if(Number.isFinite(n))return{px:n};const s=t.match(/^(-)?(?:anchor|parentBox)\.(width|height)(?:\s*\*\s*(-?[\d.]+))?$/i);if(!s)return;const[,i,r,o]=s,a=o===void 0?1:Number(o);if(Number.isFinite(a))return{of:r.toLowerCase(),times:i?-a:a}}function mi(e,t){const n=e?.trim();if(!n)return{kind:"help-id",arg:t};if(n==="none")return{kind:"none"};const s=n.indexOf(":");return s===-1?{kind:"help-id",arg:n}:{kind:n.slice(0,s).trim(),arg:n.slice(s+1).trim()}}const fm="Format",pm="Walkthrough",mm=new Set([fm,"TODO"]),fl=/^<\/?(?:details|summary)\b[^>]*>$/i;function ge(e,t){const n=t.toLowerCase();for(const s of e){const i=Ls(s);if(i){if(i.name==="beats"&&n!=="beats")return;if(i.name===n)return i.value}}}function Ls(e){const t=e.trimStart().match(/^-\s+(.*)$/);if(!t)return;const n=t[1].replace(/\*\*/g,""),s=n.indexOf(":");if(s===-1)return;const i=n.slice(0,s).trim();if(/^[A-Za-z_][A-Za-z0-9_]*$/.test(i))return{name:i.toLowerCase(),value:n.slice(s+1).trim()}}function pl(e,t){const n=`- **${t}:**`,s=e.findIndex(l=>l.trimStart().startsWith(n));if(s===-1)return;const i=e[s].trimStart().slice(n.length).trim(),r=[];for(let l=s+1;l<e.length&&!(e[l].trimStart().startsWith("- **")||fl.test(e[l].trim()));l++)r.push(e[l]);for(;r.length&&r[r.length-1].trim()==="";)r.pop();if(r.length===0)return i;const o=r.filter(l=>l.trim()!=="").map(l=>l.length-l.trimStart().length),a=Math.min(...o),c=r.map(l=>l.slice(a)).join(`
`);return i?`${i}
${c}`:c}function gm(e,t){const n=`- **${t}:**`,s=e.findIndex(r=>r.trimStart().startsWith(n));if(s===-1)return[];const i=[];for(let r=s+1;r<e.length;r++){const o=e[r].trimStart();if(o.startsWith("- **")||o==="")break;o.startsWith("- ")&&i.push(o.slice(2).trim())}return i}function ym(e,t){const n=e.findIndex(o=>Ls(o)?.name==="beats");if(n===-1)return;const s=[];let i=null;const r=()=>{i&&s.push(i)};for(let o=n+1;o<e.length;o++){const a=e[o].trimStart();if(e[o].length>0&&!/^\s/.test(e[o])&&Ls(e[o])||e[o].length>0&&!/^\s/.test(e[o])&&/^<\/?[a-z]/i.test(a))break;if(a==="")continue;const c=a.match(/^(\d+)\.\s+(.*)$/);if(c){r(),i={text:c[2].trim()};continue}const l=a.match(/^-\s+([A-Za-z]+):\s*(.*)$/);if(l&&i){const[,h,f]=l,u=h.toLowerCase();if(u==="description"){const w=e[o].length-e[o].trimStart().length,g=[];let m=o+1;for(;m<e.length;m++){if(e[m].trim()===""){g.push("");continue}if(e[m].length-e[m].trimStart().length<=w)break;g.push(e[m])}for(;g.length&&g[g.length-1].trim()==="";)g.pop();if(g.length){const y=g.filter(v=>v.trim()!=="").map(v=>v.length-v.trimStart().length),x=Math.min(...y),T=g.map(v=>v.slice(x)).join(`
`);i.description=f?`${f}
${T}`:T}else i.description=f;o=m-1;continue}u==="anchor"?i.anchor=mi(f,t):u==="action"?i.action=f.trim():u==="change"?i.change=f.trim():u==="only"?(i.change=f.trim(),i.replace=!0):u==="highlight"?i.highlight=dl(f):u==="width"?i.width=cl(f):u==="position"?i.position=hl(f):u==="offsetx"?i.offsetX=ul(f):u==="keep"&&(i.keep=f.trim()!=="false");continue}i&&!a.startsWith("-")&&(i.text=`${i.text} ${a}`.trim())}return r(),s.length>0?s:void 0}function wm(e,t){const n=e.split(`
`),i=n[0].match(/^###\s+(.+)$/);if(!i)return null;const r=i[1].trim(),o=ge(n,"Title")??r,a=pl(n,"Description")??"",c=gm(n,"Interactions"),l=ge(n,"Shortcut"),h=ge(n,"Context"),f=mi(ge(n,"Anchor"),r),u=ge(n,"Action"),w=ge(n,"Once"),g=ge(n,"Only"),m=ge(n,"Change"),y=m??g,x=m===void 0&&g!==void 0?!0:void 0,T=dl(ge(n,"Highlight")),v=cl(ge(n,"Width")),b=hl(ge(n,"Position")),C=ul(ge(n,"OffsetX")),P=ym(n,r),S=ge(n,"Tour");return{id:r,title:o,description:a,interactions:c,shortcut:l,context:h,anchor:f,action:u,once:w,change:y,replace:x,highlight:T,width:v,position:b,offsetX:C,tour:S===void 0?void 0:S||pm,order:t,beats:P}}function xm(e,t){const n=e.split(`
`),s=n.findIndex(w=>/^##\s+/.test(w)),i=s===-1?null:n[s].match(/^##\s+(.+)$/),r=i?i[1].trim():"Unknown",o=r.toLowerCase().replace(/[^a-z0-9]+/g,"-"),a=[];for(let w=s+1;w<n.length&&!n[w].startsWith("### ");w++)fl.test(n[w].trim())||a.push(n[w]);const c=a.join(`
`).trim(),l=ge(a,"TourMetadata"),h=l===void 0?void 0:{name:l||r,description:pl(a,"Description")?.trim()??"",abbr:ge(a,"TourAbbr")?.trim()||void 0},f=[],u=e.split(/(?=^### )/m);for(const w of u){if(!w.startsWith("### "))continue;const g=wm(w.trim(),t());g&&f.push(g)}return{id:o,title:r,body:c,entries:f,tourMeta:h}}function ml(e){const t=new Set;for(const n of[...e.entries.values()].sort((s,i)=>s.order-i.order))n.tour&&t.add(n.tour);return[...t]}function gl(e,t){const n=t??ml(e)[0];return[...e.entries.values()].filter(s=>s.tour!==void 0&&s.tour===n).sort((s,i)=>s.order-i.order)}function ss(e,t){return t<0?e:`${e} ▸${t+1}`}function is(e){return`### ${e}`}function Vs(e,t){const n=[];return gl(e,t).forEach((s,i)=>{const r=i+1;if(!s.beats||s.beats.length===0){n.push({entry:s,step:r,beatIndex:0,beatCount:0,address:ss(s.id,-1),searchFor:is(s.id),blocks:[s.description],text:s.description,anchor:s.anchor,action:s.action,change:s.change,replace:s.replace,highlight:s.highlight,width:s.width,position:s.position,offsetX:s.offsetX});return}let o=s.description?[s.description]:[];o.length>0&&n.push({entry:s,step:r,beatIndex:-1,beatCount:s.beats.length,address:ss(s.id,-1),searchFor:is(s.id),blocks:o,text:o.join(`

`),anchor:s.anchor,action:s.action,change:s.change,replace:s.replace,highlight:s.highlight,width:s.width,position:s.position,offsetX:s.offsetX});let a=s.width;s.beats.forEach((c,l)=>{const h=c.description??"";o=c.keep?[...o,h]:[h],c.width!==void 0&&(a=c.width),n.push({entry:s,step:r,beatIndex:l,beat:c,beatCount:s.beats.length,address:ss(s.id,l),searchFor:is(s.id),blocks:o,text:o.join(`

`),anchor:c.anchor??s.anchor,action:c.action,highlight:c.highlight??s.highlight,width:a,position:c.position??s.position,offsetX:c.offsetX??s.offsetX,change:c.change,replace:c.replace})})}),n}function bm(e){const n=e.replace(/<!--[\s\S]*?-->/g,"").trim().split(/(?=^## )/m).map(a=>a.trim()).filter(Boolean),s=[],i=new Map;let r=0;for(const a of n){if(!a.match(/^## /m))continue;const c=a.match(/^##\s+(.+)$/m)?.[1].trim();if(c&&mm.has(c))continue;const l=xm(a,()=>r++);s.push(l);for(const h of l.entries)i.set(h.id,h)}const o=new Map;for(const a of s)a.tourMeta&&o.set(a.tourMeta.name,a.tourMeta);return{sections:s,entries:i,tourMeta:o}}const vm=/\{\{\s*([a-z][a-z0-9-]*)\s*:\s*([^}]*?)\s*\}\}/gi;function km(e,t){return!t||!e.includes("{{")?e:e.replace(vm,(n,s,i)=>t[s.toLowerCase()]?.(i)??n)}function Zo(e){const t=new Set;return e.map((n,s)=>({p:n,index:s})).filter(({p:n})=>t.has(n.step)?!1:(t.add(n.step),!0)).map(({p:n,index:s})=>({index:s,step:n.step,title:n.entry.title,beatCount:n.beatCount}))}function yl({scope:e,onClose:t}){const{content:n,tours:s,tourMeta:i,tourName:r,tourIndex:o,positions:a,position:c,goToStep:l,startTour:h}=yt();p.useEffect(()=>{const y=x=>{x.key==="Escape"&&t()};return window.addEventListener("keydown",y),()=>window.removeEventListener("keydown",y)},[t]);const f=p.useRef(null);p.useEffect(()=>{const y=f.current;if(!(!y||typeof y.showPopover!="function"))return y.showPopover(),()=>{y.matches(":popover-open")&&y.hidePopover()}},[]);const u=p.useMemo(()=>e==="all"?s.map(y=>({name:y,rows:Zo(Vs(n,y))})):[],[e,s,n]),w=c?.step,g=o===null?void 0:r,m=(y,x,T)=>d.jsxs("button",{onClick:T,"aria-current":x?"step":void 0,className:`help-map-step${x?" help-map-step-here":""}`,children:[d.jsx("span",{className:"help-map-num",children:y.step}),d.jsx("span",{className:"help-map-title",children:y.title}),y.beatCount>0&&d.jsx("span",{className:"help-map-beats",title:`${y.beatCount+1} screens in this step`,children:y.beatCount+1})]},y.index);return nr.createPortal(d.jsx("div",{ref:f,popover:"manual",className:"help-map-backdrop",onMouseDown:t,children:d.jsxs("div",{role:"dialog","aria-label":e==="all"?"All tours":"Tour outline",className:"help-map",onMouseDown:y=>y.stopPropagation(),children:[d.jsxs("div",{className:"help-map-head",children:[d.jsxs("div",{children:[d.jsx("h2",{children:e==="all"?"Tours":g??"This tour"}),d.jsx("p",{children:e==="all"?"Every guided walk, and what is in it. Click any step to start there.":"Click any step to jump to it."})]}),d.jsx("button",{onClick:t,title:"Close (Esc)",className:"help-map-close",children:"✕"})]}),d.jsx("div",{className:"help-map-body",children:e==="tour"?Zo(a).map(y=>m(y,y.step===w,()=>{l(y.index),t()})):u.map(({name:y,rows:x})=>d.jsxs("section",{className:"help-map-tour",children:[d.jsx("button",{className:"help-map-tourname",onClick:()=>{h(y),t()},children:y}),i.get(y)?.description&&d.jsx("p",{className:"help-map-blurb",children:i.get(y).description}),x.map(T=>m(T,g===y&&T.step===w,()=>{g===y?l(T.index):h(y,T.index),t()}))]},y))})]})}),document.body)}function Tm(){const{tours:e,tourMeta:t,startTour:n}=yt(),[s,i]=p.useState(!1),[r,o]=p.useState(!1),a=p.useRef(null);return p.useEffect(()=>{if(!s)return;const c=h=>{h.target?.closest("[data-tour-chooser]")||i(!1)},l=h=>{h.key==="Escape"&&i(!1)};return document.addEventListener("mousedown",c,!0),document.addEventListener("keydown",l),()=>{document.removeEventListener("mousedown",c,!0),document.removeEventListener("keydown",l)}},[s]),e.length===0?null:d.jsxs("span",{"data-tour-chooser":!0,"data-help-id":"tour-chooser",className:"relative",onMouseEnter:()=>i(!0),children:[d.jsx("button",{onClick:()=>{i(!1),o(!0)},title:"Guided walks through the app and the model; click for the overview",className:`text-sm font-semibold px-2.5 py-1 rounded-full bg-white/95
                   text-blue-700 shadow-sm hover:bg-white hover:shadow`,children:"Guided tours"}),s&&d.jsxs("div",{ref:a,role:"dialog","aria-label":"Guided tours",className:`absolute right-0 top-full mt-1 z-40 w-80 p-1
                     rounded-md border border-gray-300 dark:border-slate-600
                     bg-white dark:bg-slate-800 shadow-xl
                     text-gray-900 dark:text-gray-100`,children:[d.jsxs("p",{className:"px-3 pt-2 pb-1 text-[11px] text-gray-500 dark:text-gray-400",children:["Each one stands on its own. Leave any tour with ",d.jsx("kbd",{children:"Esc"}),"."]}),d.jsxs("button",{"data-tour-overview":!0,onClick:()=>{i(!1),o(!0)},className:`block w-full text-left px-3 py-2 rounded
                       hover:bg-gray-100 dark:hover:bg-slate-700`,children:[d.jsx("span",{className:"block text-xs font-semibold",children:"Overview"}),d.jsxs("span",{className:"block text-[11px] text-gray-500 dark:text-gray-400",children:["All ",e.length," tours and every step in them — start anywhere."]})]}),d.jsx("div",{className:"my-1 border-t border-gray-200 dark:border-slate-700"}),e.map(c=>d.jsxs("button",{onClick:()=>{i(!1),n(c)},className:`block w-full text-left px-3 py-2 rounded
                         hover:bg-gray-100 dark:hover:bg-slate-700`,children:[d.jsx("span",{className:"block text-xs font-semibold",children:c}),t.get(c)?.description&&d.jsx("span",{className:"block text-[11px] text-gray-500 dark:text-gray-400",children:t.get(c).description})]},c))]}),r&&d.jsx(yl,{scope:"all",onClose:()=>o(!1)})]})}const Sm="dmvd.help.showAddresses";function Cm(){const e=document.activeElement;return e instanceof HTMLInputElement||e instanceof HTMLTextAreaElement||e?.getAttribute("contenteditable")==="true"}function Am(e,t){if(!t)return e;const n=r=>km(r,t),s=r=>r===void 0?void 0:n(r),i=new Map([...e.entries].map(([r,o])=>[r,{...o,description:n(o.description),interactions:o.interactions.map(n),action:s(o.action),context:s(o.context),beats:o.beats?.map(a=>({...a,description:s(a.description),action:s(a.action)}))}]));return{sections:e.sections.map(r=>({...r,entries:r.entries.map(o=>i.get(o.id)??o),tourMeta:r.tourMeta&&{...r.tourMeta,description:n(r.tourMeta.description)}})),entries:i,tourMeta:new Map([...e.tourMeta].map(([r,o])=>[r,{...o,description:n(o.description)}]))}}function Pm({markdown:e,onPushChange:t,onPopChange:n,onJumpChanges:s,onTourStart:i,onTourEnd:r,textResolvers:o,centerOn:a,children:c}){const[l,h]=p.useState(),f=l??o,u=p.useMemo(()=>Am(bm(e),f),[e,f]),[w,g]=p.useState(!1),[m,y]=p.useState(null),[x,T]=p.useState(void 0),v=p.useMemo(()=>ml(u),[u]),b=p.useMemo(()=>Vs(u,x),[u,x]),C=p.useMemo(()=>gl(u,x).length,[u,x]),[P,S]=p.useState(null),[M,N]=p.useState(()=>!1),H=p.useCallback(()=>{N(W=>{const U=!W;try{window.localStorage.setItem(Sm,U?"1":"0")}catch{}return U})},[]),F=p.useCallback(()=>{g(!1),S(null)},[]),G=p.useCallback(()=>S(null),[]),R=p.useCallback(W=>S(W),[]),I=p.useCallback(W=>{const U=b[W];U&&(y(W),S(U.entry.id),U.change!=null&&t&&t(U.change,U.replace))},[b,t]),q=p.useCallback(W=>{b[W+1]?.change!=null&&n&&n();const ee=b[W];ee&&(y(W),S(ee.entry.id))},[b,n]),X=p.useCallback(W=>{if(m===null||W===m)return;const U=b[W];if(U&&s){if(W>m){const ee=b.slice(m+1,W+1).filter(se=>se.change!=null).map(se=>({query:se.change,replace:se.replace}));s(ee,0)}else{const ee=b.slice(W+1,m+1).filter(se=>se.change!=null).length;s([],ee)}y(W),S(U.entry.id)}},[m,b,s]),le=p.useCallback((W,U=0)=>{g(!1),T(W);const ee=Vs(u,W),se=Math.min(Math.max(U,0),Math.max(ee.length-1,0)),ie=ee[se];if(!ie)return;i?.(),y(se),S(ie.entry.id);const Ae=ee.slice(0,se+1).filter(be=>be.change!=null).map(be=>({query:be.change,replace:be.replace}));se>0&&s?s(Ae,0):ie.change!=null&&t&&t(ie.change,ie.replace)},[u,t,s,i]),K=p.useCallback(()=>{y(null),S(null),T(void 0),r?.()},[r]),J=p.useCallback(()=>{m!==null&&(m+1>=b.length?K():I(m+1))},[m,b.length,I,K]),A=p.useCallback(()=>{m!==null&&m>0&&q(m-1)},[m,q]),V=p.useCallback(()=>{m!==null&&K(),S(null)},[m,K]),Y=p.useCallback(W=>{if(!W)return null;const{kind:U}=W;if(U==="none")return null;const{arg:ee}=W,se=U==="help-id"?ee:`${U}:${ee}`,ie=document.querySelectorAll(`[data-help-id="${CSS.escape(se)}"]`);return ie.length<2?ie[0]??null:[...ie].find(Ae=>Ae.getBoundingClientRect().height>0)??ie[0]},[]);p.useEffect(()=>(document.body.classList.toggle("help-mode",w),()=>{document.body.classList.remove("help-mode")}),[w]),p.useEffect(()=>{if(w)return window.addEventListener("blur",F),()=>window.removeEventListener("blur",F)},[w,F]),p.useEffect(()=>{if(!w)return;function W(U){const ee=U.target;if(!ee)return;const se=ee.closest("[data-help-id]");se?(U.stopPropagation(),U.preventDefault(),R(se.getAttribute("data-help-id"))):ee.closest("[data-help-popover]")||G()}return document.addEventListener("click",W,!0),()=>document.removeEventListener("click",W,!0)},[w,R,G]),p.useEffect(()=>{function W(U){if(U.key==="?"&&!Cm()){U.preventDefault(),m===null?le():K();return}if(U.key==="Escape"&&(w||m!==null||P)){U.preventDefault(),U.stopPropagation(),P&&m===null?G():m!==null?K():V();return}m!==null&&(U.key==="ArrowRight"&&(U.preventDefault(),J()),U.key==="ArrowLeft"&&(U.preventDefault(),A()))}return document.addEventListener("keydown",W,!0),()=>document.removeEventListener("keydown",W,!0)},[w,m,P,V,G,K,le,J,A]);const me=p.useCallback(()=>a?Y(mi(a,a))?.getBoundingClientRect()??null:null,[a,Y]),Ce=p.useMemo(()=>({setTextResolvers:h,helpMode:w,toggleHelpMode:V,exitHelpMode:F,tourIndex:m,startTour:le,endTour:K,nextStep:J,prevStep:A,goToStep:X,positions:b,position:m===null?void 0:b[m],stepCount:C,tours:v,tourName:x,tourMeta:u.tourMeta,showAddresses:M,toggleAddresses:H,content:u,activeId:P,showEntry:R,dismissEntry:G,resolveAnchor:Y,centerRect:me}),[w,V,F,m,le,K,J,A,X,b,C,v,x,M,H,u,P,R,G,Y,me]);return d.jsx(ll.Provider,{value:Ce,children:c})}const Is={a:({href:e,children:t})=>d.jsx("a",{href:e,target:"_blank",rel:"noreferrer",children:t}),blockquote:({children:e})=>d.jsxs("div",{className:"help-popover-alert",role:"note",children:[d.jsx("span",{className:"help-popover-alert-mark","aria-hidden":"true",children:"!"}),d.jsx("div",{children:e})]})};function Em(e){try{return localStorage.getItem(e)}catch{return null}}function Mm(e,t){try{localStorage.setItem(e,t)}catch{}}const wl="help-once-",os="data-help-anchor",Jo="data-help-hint",Dm="--help-hint",jm=40;function Rm(e){return e.split(`
`).filter(t=>!/^\s{0,3}>/.test(t)).join(`
`).replace(/\n{3,}/g,`

`).trim()}function Om(e){return Em(wl+e)==="1"}function Nm(e){Mm(wl+e,"1")}function Lm(e){return{...Is,blockquote:({children:t})=>d.jsxs("div",{className:"help-popover-alert",role:"note",children:[d.jsx("span",{className:"help-popover-alert-mark","aria-hidden":"true",children:"!"}),d.jsxs("div",{children:[t,d.jsxs("label",{className:"help-popover-alert-once",children:[d.jsx("input",{type:"checkbox",onChange:e}),"Don't show this again"]})]})]})}}function Vm(){const{helpMode:e,tourIndex:t,position:n,positions:s,stepCount:i,content:r,activeId:o,dismissEntry:a,nextStep:c,prevStep:l,endTour:h,showEntry:f,resolveAnchor:u,centerRect:w,showAddresses:g,tourName:m,tourMeta:y}=yt(),x=m===void 0?void 0:y.get(m)?.abbr??m,[T,v]=p.useState(!1),b=t!==null,C=o?r.entries.get(o):void 0,P=rl(),S=u,M=b?n?.anchor:C?.anchor,N=(b?n?.highlight:C?.highlight)??"dim",H=()=>{if(!n||n.beatCount===0)return null;const z=n.beatIndex+1;return d.jsx("span",{className:"help-tour-dots",title:`Screen ${z+1} of ${n.beatCount+1} in this step`,children:Array.from({length:n.beatCount},(ce,ve)=>d.jsx("span",{className:ve<z?"help-dot help-dot-on":"help-dot"},ve))})},[F,G]=p.useState(!1),[R,I]=p.useState(void 0),[q,X]=p.useState(!1),le=p.useRef(null),[,K]=p.useState(0),J=C?.once,A=J!==void 0&&Om(J),V=p.useMemo(()=>J===void 0?Is:Lm(()=>{Nm(J),K(z=>z+1)}),[J]),Y=(b?n?.blocks??[]:[C?.description??""]).map(z=>A?Rm(z):z).filter(Boolean),me=(b?n?.width:void 0)??Math.max(Wm(Y.join(`

`)),b?zm():0),Ce=p.useRef(!1);p.useEffect(()=>{Ce.current=!1},[o,M]);const W=P.reset;p.useEffect(()=>{W()},[o,t,W]),p.useLayoutEffect(()=>{if(!o){G(!1),I(void 0);return}let z=null;const ce=()=>{const Pe=S(M);Pe!==z&&(z?.removeAttribute(os),z=Pe,G(!!Pe),I(Pe?.closest("[data-graph-direction]")?.getAttribute("data-graph-direction")==="RIGHT"?"below":void 0),Pe&&(Pe.setAttribute(os,""),Ce.current||(Ce.current=!0,Pe.scrollIntoView({block:"center",behavior:"smooth"}))))};ce();const ve=new MutationObserver(ce);return ve.observe(document.body,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["data-help-id"]}),()=>{ve.disconnect(),z?.removeAttribute(os),G(!1),I(void 0)}},[o,M,S]);const U=600,ee=b&&n?.change!=null&&M!==void 0&&M.kind!=="none",[se,ie]=p.useState(!1);p.useEffect(()=>{if(!ee){ie(!0);return}ie(!1);const z=window.setTimeout(()=>ie(!0),U);return()=>window.clearTimeout(z)},[ee,t]);const Ae=se||F;p.useEffect(()=>{const z=le.current;z&&(C&&Ae?z.matches(":popover-open")||z.showPopover():z.matches(":popover-open")&&z.hidePopover())},[C,Ae]),p.useEffect(()=>{(!e||b)&&X(!1)},[e,b]);const be=p.useMemo(()=>e&&!b?[...r.entries.values()].filter(z=>S(z.anchor)).slice(0,jm).map((z,ce)=>({id:z.id,title:z.title,name:`${Dm}-${ce}`})):[],[e,b,r,S]);return p.useLayoutEffect(()=>{const z=be.map(ce=>{const ve=S(r.entries.get(ce.id)?.anchor);return ve?.setAttribute(Jo,ce.name),ve}).filter(Boolean);return()=>z.forEach(ce=>ce.removeAttribute(Jo))},[be,r,S]),d.jsxs(d.Fragment,{children:[F&&o&&N!=="none"&&d.jsx("div",{className:`help-spotlight${N==="ring"?" help-spotlight-ring":""}`}),be.map(({id:z,title:ce,name:ve})=>d.jsx("button",{className:"help-hint",title:ce??z,style:{positionAnchor:ve},onMouseEnter:()=>{q||f(z)},onMouseLeave:()=>{q||a()},onClick:Pe=>{Pe.stopPropagation(),X(!0),f(z)},children:"?"},z)),d.jsx("div",{ref:le,popover:"manual","data-help-popover":"","data-anchored":F?"":void 0,className:"help-popover",style:{...Um(F,b?n?.position:void 0,b?n?.offsetX:void 0,me,F?null:w(),R),...P.offset?{positionArea:"none",left:P.offset.left,top:P.offset.top,right:"auto",bottom:"auto",margin:0,transform:"none"}:{}},children:C&&d.jsxs(d.Fragment,{children:[d.jsxs("h4",{className:"help-popover-title",onPointerDown:P.onPointerDown,style:{cursor:P.offset?"grabbing":"grab",userSelect:"none"},title:"Drag to move",children:[b&&x&&d.jsx("span",{className:"help-popover-tour",children:x}),C.title]}),b&&n?.action&&d.jsxs("div",{className:"help-popover-action",children:[d.jsx("span",{className:"help-popover-action-mark","aria-hidden":"true",children:"✓"}),d.jsx("div",{children:d.jsx(Wt,{children:n.action})})]}),b&&g&&n?.change&&!n.action&&d.jsxs("div",{className:"help-popover-action",style:{opacity:.85},children:[d.jsx("span",{className:"help-popover-action-mark","aria-hidden":"true",children:"⚠"}),d.jsxs("div",{children:[d.jsx("em",{children:"Authoring:"})," this position changes the app (",d.jsx("code",{children:n.change}),") but has no ",d.jsx("code",{children:"Action:"}),"."]})]}),Y.length>0&&d.jsx("div",{className:"help-popover-body",children:Y.map((z,ce,ve)=>d.jsx("div",{className:ce===ve.length-1?void 0:"help-beat-past",children:d.jsx(Wt,{components:V,children:z})},ce))}),C.interactions.length>0&&d.jsx("ul",{className:"help-popover-interactions",children:C.interactions.map((z,ce)=>d.jsx("li",{children:d.jsx(Wt,{components:Is,children:z})},ce))}),C.shortcut&&d.jsxs("p",{className:"help-popover-shortcut",children:["Shortcut: ",d.jsx("kbd",{children:C.shortcut})]}),C.context&&d.jsx("div",{className:"help-popover-context",children:d.jsx(Wt,{children:C.context})}),b?d.jsxs("div",{className:"help-tour-nav",children:[d.jsxs("span",{className:"help-tour-count",title:`Position ${t+1} of ${s.length}`,children:[n?.step," / ",i]}),H(),d.jsx("button",{className:"help-tour-map-btn",onClick:()=>v(z=>!z),"aria-expanded":T,title:"Show the tour outline",children:"⊞"}),d.jsx("span",{className:"help-tour-spacer"}),d.jsx("button",{onClick:l,disabled:t===0,title:"Previous (← arrow key)",children:"← back"}),d.jsx("button",{onClick:c,className:"help-tour-next",title:"Next (→ arrow key)",children:t+1===s.length?"done":"next →"}),d.jsx("button",{onClick:h,title:"End the tour and undo what it added (Esc)",children:"✕"})]}):d.jsxs("div",{className:"help-tour-nav",children:[d.jsx("span",{className:"help-tour-spacer"}),d.jsx("button",{onClick:()=>{X(!1),a()},children:"close"})]}),g&&d.jsx(Im,{address:b?n?.address:C.id,searchFor:b?n?.searchFor:`### ${C.id}`})]})}),T&&b&&d.jsx(yl,{scope:"tour",onClose:()=>v(!1)})]})}function Im({address:e,searchFor:t}){const[n,s]=p.useState(!1);return p.useEffect(()=>{if(!n)return;const i=setTimeout(()=>s(!1),1200);return()=>clearTimeout(i)},[n]),!e||!t?null:d.jsxs("button",{type:"button",className:"help-popover-address",title:`Copy “${t}” — search help-content.md for it`,onClick:()=>{navigator.clipboard?.writeText(t).then(()=>s(!0),()=>{})},children:[e,n?" ✓":""]})}const xl=320,Bm=320,$m=800,Fm=8,_m=24,Hm=3;function Wm(e){const t=e.trim().length;return t===0?xl:Math.round(Math.min($m,Math.max(Bm,Math.sqrt(t*Fm*_m*Hm))))}function zm(){return 393}function Um(e,t,n,s,i,r){const o=window.innerWidth,a=window.innerHeight,c=Math.min(s??xl,o-16);if(!e){const h=i??new DOMRect(0,0,o,a),f=h.left+h.width/2;return{left:Math.max(8,Math.min(f-c/2,o-c-8)),top:"50%",transform:"translateY(-50%)",maxHeight:`${a-16}px`,width:c}}return{positionArea:t?{right:"inline-end span-block-end",left:"inline-start span-block-end",top:"block-start span-inline-end",bottom:"block-end span-inline-end"}[t]:r==="below"?"block-end span-inline-end":"inline-end span-block-end",width:c,...Gm(n)}}function Gm(e){return e?{marginLeft:"px"in e?`${e.px}px`:`calc(anchor-size(${e.of}) * ${e.times})`}:{}}const rs=e=>e&&e.trim()?e.trim():void 0;function Km(e){return{"model-description":t=>rs(e.getClassDescription(t)),"enum-description":t=>rs(e.getEnumDetail(t)?.description),"category-label":t=>rs(sr.find(n=>n.id===t)?.label)}}const Qm=`# BDCHM Explorer help

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
- **TourAbbr:** BDCHM
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
  <!-- 
  should BDC and LinkML and pipeline details be put elsewhere so we can get
  to model content quicker and provide a bit deeper treatment of the context
  on request?

  used to have this in the BDC context part of Walkthrough:
  (using [BDC's tools](https://biodatacatalyst.nhlbi.nih.gov/use-bdc/analyze-data/) or otherwise);
  -->
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
  > Salvaged 2026-09-09 from the stash: this is your shortened \`why\`. The
  > LinkML half moved to \`linkml-context\`, the first step of Getting
  > oriented, and your comment there says the two still overlap. TASKS 3b.

  You may want to use BDCHM:
  - to analyze data harmonized to it;
  - to harmonize your own data to it;
  - design new studies pre-harmonized to it; or
  - use it for ideas or inspiration in designing your own data models.

  Doing almost anything involving BDCHM requires a basic, overall
  understanding of its structure. The **BDCHM Explorer** provides
  a single-page, highly interactive interface allowing you to easily see
  details of and relationships between specific entities or neighborhoods
  around entities you select.
- **Anchor:** none
- **Change:**

</details><!-- end of BDCHM tour -->
</div>

<div style="margin-left: 40px">
<details open>
<summary><b>Getting oriented</b></summary>

## Getting oriented
- **TourMetadata:**
- **Description:** How to use the BDCHM Explorer: the panel, the boxes, and how to grow a diagram

### linkml-context
- **Title:** BDCHM Explorer
- **Tour:** Getting oriented
- **Description:** <!-- redundant with \`why\` above. fix: figure out what goes where -->
  > Salvaged 2026-09-09 from the stash, where you had made this the first
  > step of Getting oriented. It repeats most of \`why\` at the end of tour 1.
  > Decide what goes where (TASKS 3b), then delete this note.

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

### bdchm-entities

- **Title:** Model entities
- **Tour:** Getting oriented
- Only: panels=0
- **Anchor:** none
- **Highlight:** selection-tree
- **Width:** 800
- **Description:** [put some intro text here]

  This tour is about the app rather than the model: how to put classes on
  the canvas, what a box shows, and how to move from one class to the ones
  it is connected to. It grows one small diagram a step at a time, from a
  person in a study to a number you would analyse.
- **Beats:**
  1. selection
     - Description:
       The left panel lists every class in the model, grouped into the six
       categories the first tour walked through. The grouping is the
       Explorer's, not the schema's.
     - Anchor: entity-row:Person
     - Width: 420
  2. display
     - Keep: true
     - Description: Ticking one draws it. Person is now on the canvas.
     - Change: sel=Person
     - Action: Ticked Person for you.
     - Anchor: node-box:Person
  <!-- maybe next step should replace this one? -->


### selection-tree

- **Title:** Entities
- **Tour:** Getting oriented
- **Anchor:** selection-tree
- **Description:**
  > Salvaged 2026-09-09 from the stash: your step, kept whole. It overlaps
  > the step before it (tick a checkbox, a box appears) and the step after
  > (what a box shows). Yours starts on Participant; the spine below starts
  > on Person. Integrate, then delete this note.

  A LinkML schema defines classes representing a data model's
  entities. The left panel lists them, grouped into categories for convenience,
  though these categories are not actually part of the schema.
- **Beats:** <!-- these are just copied from below, need to get beats working
              right before authoring -->
  1. tick a checkbox
     - Description: In order to select an entity for display, click its checkbox
     - Anchor: entity-row:Participant
  2. the box that appears
     - Description:
       The Participant box shows the entity name, a dismiss (x) icon, a menu
       for displaying boxes for related entities, and a list of this entity's
       attributes.
     - Anchor: node-box:Participant
     - Change: sel=Participant
     - Action: I clicked the Participant checkbox and the Participant entity appeared in the viewing panel.
  3. the related counts
     - Description:
       Hover over the \`← 3\` or \`22 →\` counts to list the entities related to this
       one, and click any of them to display it.
     - Anchor: node-box:Participant
     - Highlight: none


### selection-tree-mechanics

- **Title:** Choosing what to look at
- **Tour:** Getting oriented
- **Description:**
  > Salvaged 2026-09-09 from the stash, where you had made this help-only
  > entry a tour step. It describes the panel's TREE mode (arrows, nesting by
  > ownership); the default is list mode, and \`entity-row\` anchors only
  > resolve there. Integrate with \`selection-tree\` above, then delete this
  > note.

  Entities are arranged by **ownership**: an entity is nested under
  whatever owns it. Tick a checkbox to put an entity on the diagram. The
  checkbox is the only thing that selects — clicking the row or the arrow
  just opens and closes the tree.
- **Interactions:**
  - Checkbox — add or remove that entity from the diagram.
  - Arrow — expand or collapse, without changing the selection.
  - Name — open the details panel without changing the selection.
- **Context:** An entity can sit in more than one place in the tree, because things can be owned by more than one kind of thing. The widget marks the duplicates for you.
- **Anchor:** selection-tree


### entity-box

- **Title:** What a box shows
- **Tour:** Getting oriented
- **Only:** sel=Person
- **Action:** Drew just Person, so there is one box to read.
- **Anchor:** node-box:Person
- **Description:**
  A box is one class. Its header carries the class name and, at the far
  right, a ✕ that takes it off the canvas again. Below the header there is
  one row per attribute.
- **Beats:**
  1. a row
     - Description:
       ##### Attributes
       Each row is an attribute: its name on the left, and on the right what
       it holds and how many — \`0..1\` for optional and single, \`0..*\` for a
       list. Most rows hold a plain value or a code from a value set.
     - Anchor: slot-row:Person.year_of_birth
  2. an entity row
     - Description:
       ##### Rows that name other classes
       \`cause_of_death\` holds another class rather than a value. Rows like
       this are where the lines come from: when CauseOfDeath is on the
       canvas, a line runs from this row to it. Clicking the row puts it
       there. The dot is hollow because CauseOfDeath is not drawn yet; the
       next tour, *Reading the diagram*, is about the dots and colours.
     - Anchor: slot-row:Person.cause_of_death
  3. the relation bar
     - Description:
       ##### The relation bar
       The two counts in the header are the relation bar. **← N** is how many
       classes this one belongs to, which the layout draws to its left;
       **M →** how many it owns, drawn to its right. Hover either count for
       the list. This is how you reach a class that has no row here:
       Participant is connected to Person, but the attribute connecting them
       is declared on Participant, so it shows up in Person's bar and not in
       Person's rows.
     - Anchor: relation-bar


### grow-participant

- **Title:** Adding a related class
- **Tour:** Getting oriented
- **Only:** sel=Person~Participant
- **Action:** Added Participant, the same as clicking it in Person's → list.
- **Anchor:** node-box:Participant
- **Description:**
  Participant landed to the RIGHT of Person, and a line joins them. The
  canvas is laid out by ownership, owners on the left, so where a box lands
  already says something about it.

  A **Person** is a human being; a **Participant** is that person's role in
  one study, and the same person in three studies is three Participants.
- **Beats:**
  1. the row that made the line
     - Description:
       ##### The row that made the line
       The line comes from Participant's \`associated_person\` row. Every line
       on the canvas leaves an attribute row on one box and lands on the
       class that row names, so you can always see WHICH attribute connects
       two classes.
     - Anchor: slot-row:Participant.associated_person
  2. the second way
     - Description:
       ##### Two ways to grow a diagram
       Participant's own rows name classes that are not on the canvas yet —
       a ResearchStudy, an Organization, Consents. Clicking any of those rows
       adds that class. Rows and the relation bar are the two ways to grow a
       diagram without going back to the panel; both also tick the checkbox
       on the left.
     - Anchor: slot-row:Participant.member_of_research_study


### grow-visit

- **Title:** A visit
- **Tour:** Getting oriented
- **Only:** sel=Person~Participant~Visit
- **Action:** Added Visit from Participant's → list.
- **Anchor:** node-box:Visit
- **Description:**
  A Visit is an encounter with the healthcare system, and most of what is
  recorded about a participant is recorded at one. It belongs to a
  Participant the same way Participant belongs to a Person: through an
  \`associated_participant\` attribute declared on Visit, drawn as one more
  hop to the right.


### grow-observation

- **Title:** An observation
- **Tour:** Getting oriented
- **Only:** sel=Person~Participant~Visit~Observation
- **Action:** Added Observation from Visit's → list.
- **Anchor:** node-box:Observation
- **Description:**
  {{model-description:Observation}}

  Two lines arrive here, because an Observation names both the Participant
  it is about and the Visit it was made at. It has five subclasses, which
  the *Inheritance* tour draws; on its own it is just this box.
- **Beats:**
  1. the value
     - Description:
       ##### The value
       \`observation_type\` says what was measured, and \`value_quantity\` is
       where a numeric answer goes. Its dot is hollow: Quantity is not on the
       canvas. Clicking the row would add it.
     - Anchor: slot-row:Observation.value_quantity


### grow-quantity

- **Title:** The spine
- **Tour:** Getting oriented
- **Only:** sel=Person~Participant~Visit~Observation~Quantity
- **Action:** Added Quantity, the same as clicking the \`value_quantity\` row.
- **Anchor:** node-box:Quantity
- **Description:**
  {{model-description:Quantity}}

  Five boxes, and they are the spine of the model: Person → Participant →
  Visit → Observation → Quantity is the path from a human being to a number
  you would analyse, and four of the six categories hang off it. The
  \`value_quantity\` dot is filled now that its line is drawn.


### detail-panel

- **Title:** Details
- **Tour:** Getting oriented
- **Change:** detail=Observation
- **Action:** Opened the details panel for Observation, the same as clicking its box header.
- **Anchor:** none
- **Description:**
  Clicking a box — its header, or any row that is not itself clickable —
  opens the class's details: its description, every attribute with its
  type, and the classes that refer to it. Class names inside the panel are
  links, so you can follow references without changing what is drawn. The
  **ⓘ** beside a row in the relation bar opens the same panel for that
  class. Close it with its ✕.


### moving-around

- **Title:** Moving around
- **Tour:** Getting oriented
- **Change:** panels=0
- **Action:** Closed the details panel.
- **Anchor:** graph-canvas
- **Highlight:** ring
- **Description:**
  Drag the background to pan. Zoom with Ctrl+wheel (⌘+wheel on a Mac, or a
  pinch), or with the \`+\` \`−\` \`1:1\` \`⛶\` buttons at the top right; \`⛶\` fits
  the whole diagram in the window, and \`LR\` / \`TB\` lay it out left to right
  or top down. Hover a box and everything not connected to it fades.

  You can drag a box out of the way, too. Its lines follow but are not
  re-routed around anything, and the next change to the selection lays
  everything out afresh.


### where-next

- **Title:** Where to go from here
- **Tour:** Getting oriented
- **Anchor:** none
- **Description:**
  That is the whole mechanism: tick, click a row or a bar entry, read the
  box. Three more things are worth knowing.
- **Beats:**
  1. category views
     - Description:
       ##### A category at once
       The ⊞ on a category header draws every class in that category, plus
       the two or three outside classes that make it legible. It replaces
       whatever was on the canvas.
     - Anchor: category-row:admin
  2. copy link
     - Description:
       ##### Sharing a view
       **Copy link** copies a URL that reproduces exactly this canvas —
       selection and settings — for anyone who opens it.
     - Anchor: copy-link
  3. the other tours
     - Description:
       ##### The other tours
       *Reading the diagram* explains the dots, colours and where a line
       attaches; *Ownership* explains why boxes land where they do and what
       the three kinds of line mean; *Inheritance* explains the boxes that
       hold several classes at once.
     - Anchor: tour-chooser

</details><!-- end of Getting oriented tour -->
</div>

<div style="margin-left: 40px">
<details open>
<summary><b>Reading the diagram</b></summary>

## Reading the diagram
- **TourMetadata:**
- **Description:** Rows, dots and colours, and where a line attaches

### rows-and-dots

- **Title:** Rows and dots
- **Tour:** Reading the diagram
- **Only:** sel=Visit&panels=0
- **Action:** Drew Visit on its own.
- **Anchor:** node-box:Visit
- **Description:**
  One class, no lines. Every row is an attribute, and the dot at its left
  and the label at its right share a colour that says what KIND of thing
  the attribute holds.
- **Beats:**
  1. a data type
     - Description:
       ##### Green: a data value
       \`age_at_visit_start\` is an integer. Green rows hold plain data —
       strings, numbers, dates — and never draw a line.
     - Anchor: slot-row:Visit.age_at_visit_start
  2. a value set
     - Description:
       ##### Purple: a value set
       \`visit_category\` holds one code from a permissible value set, an
       enumeration. Purple rows never draw a line either.
     - Anchor: slot-row:Visit.visit_category
  3. an entity
     - Description:
       ##### Blue: another class
       \`year_range\` holds a TimePeriod, another class in the model. Blue rows
       are the only ones that draw lines, and this dot is hollow because
       TimePeriod is not on the canvas. A hollow dot is an invitation: click
       the row.
     - Anchor: slot-row:Visit.year_range
  4. cardinality
     - Description:
       ##### How many
       The small grey figure after the type is the cardinality: \`1..1\`
       exactly one, \`0..1\` at most one, \`0..*\` any number, \`1..*\` at least
       one. The left digit says whether the attribute is required, the right
       whether it is a list.
     - Anchor: slot-row:Visit.visit_provenance


### one-edge

- **Title:** One line
- **Tour:** Reading the diagram
- **Only:** sel=Visit~TimePeriod
- **Action:** Added TimePeriod.
- **Anchor:** slot-row:Visit.year_range
- **Description:**
  Now the \`year_range\` dot is filled and a line leaves it. This is the one
  idea the whole diagram rests on: **a line leaves the attribute row that
  creates it**, not the box, so you can always see which attribute connects
  two classes. The arrowhead lands on the class the row names.
- **Beats:**
  1. the far end
     - Description:
       ##### The far end
       At the other end the line points at TimePeriod as a whole, not at one
       of its rows: the attribute is Visit's, and TimePeriod is only what it
       holds. TimePeriod's own two blue rows are hollow, because TimePoint is
       not drawn.
     - Anchor: node-box:TimePeriod


### which-way

- **Title:** Which way a line runs
- **Tour:** Reading the diagram
- **Only:** sel=Participant~Visit~TimePeriod
- **Action:** Added Participant.
- **Anchor:** slot-row:Visit.associated_participant
- **Description:**
  Participant landed on the LEFT, and the line from Visit's
  \`associated_participant\` row runs backwards to it, arrowhead at
  Participant. Same rule for both lines: the line leaves the row, and the
  arrowhead lands on the class the row names. What differs is which side
  the named class is drawn on, and that is decided by **ownership**: a
  Visit belongs to its Participant, so Participant is drawn first; a Visit
  owns its TimePeriod, so TimePeriod is drawn after. How the Explorer decides
  which is which is the *Ownership* tour.
- **Beats:**
  1. left to right
     - Description:
       ##### Reading left to right
       So the canvas reads left to right as "contains": everything that owns
       a class is to its left, everything it owns is to its right. Hover a
       box and everything not connected to it fades.
     - Anchor: node-box:Participant


### loops

- **Title:** A class that names itself
- **Tour:** Reading the diagram
- **Only:** sel=ResearchStudy
- **Action:** Drew ResearchStudy on its own.
- **Anchor:** slot-row:ResearchStudy.part_of
- **Description:**
  \`part_of\` holds a ResearchStudy, so a study can be a sub-study of another.
  A line from a box to itself would only be noise, so the row carries a loop
  mark instead. Studies, specimens, containers, questionnaire items, files
  and time points all nest this way.

</details><!-- end of Reading the diagram tour -->
</div>

<div style="margin-left: 40px">
<details open>
<summary><b>Ownership</b></summary>

## Ownership
- **TourMetadata:**
- **Description:** Why boxes land where they do, and what the three kinds of line mean

### why-ownership

- **Title:** Ownership
- **Tour:** Ownership
- **Only:** panels=0
- **Anchor:** none
- **Width:** 560
- **Description:**
  The canvas is laid out by **ownership**: a class is drawn to the right of
  whatever owns it. That one idea is what the whole diagram is about, and it
  is not in the schema. A LinkML schema says that Visit has an attribute
  holding a Participant; it does not say which of the two contains the
  other, and the generated documentation cannot show it either.

  So the Explorer decides, with a few rules, and draws the result. This
  tour shows the rules on real cases. There are three kinds of line:

  - **owns** — the line runs from the owner's row to the class it holds;
  - **belongs to** — the line runs from the member's row BACK to the class
    it belongs to;
  - **associated with** — dashed, arrowed at both ends, and no claim either
    way.


### owns-forward

- **Title:** Owns: a list of things
- **Tour:** Ownership
- **Only:** sel=Questionnaire~QuestionnaireItem
- **Action:** Drew Questionnaire and QuestionnaireItem.
- **Anchor:** slot-row:Questionnaire.items
- **Description:**
  The easy case. \`items\` holds a LIST of QuestionnaireItems (\`1..*\`), and a
  class that holds a list of things owns them: the items are part of the
  questionnaire. The line runs from the owner's row rightward to the owned
  class. **Rule 1: a list-valued attribute owns its class.**


### belongs-backward

- **Title:** Belongs to: a pointer at something bigger
- **Tour:** Ownership
- **Only:** sel=Participant~Specimen~SpecimenCreationActivity
- **Action:** Drew Specimen with its Participant and its creation activity.
- **Anchor:** node-box:Specimen
- **Description:**
  Specimen has lines in both directions, and they mean opposite things.
- **Beats:**
  1. belongs to
     - Description:
       ##### Belongs to
       \`source_participant\` holds ONE Participant, and a Participant exists
       whether or not any specimen points at it. A single-valued pointer at
       something with a life of its own is a foreign key: the specimen
       belongs to the participant, not the other way round. So Participant is
       drawn on the left and the line runs from this row back to it.
       **Rule 2: a single-valued attribute belongs to its class.**
     - Anchor: slot-row:Specimen.source_participant
  2. owns
     - Description:
       ##### Owns
       \`creation_activity\` is also single-valued, yet the activity is drawn
       on the right, owned. A specimen's creation, processing, storage and
       transport activities are one family, three of them lists, and
       splitting the family on cardinality alone would be wrong — so the
       Explorer says so explicitly. The rules have exceptions, and every one
       is listed rather than guessed.
     - Anchor: slot-row:Specimen.creation_activity
  3. the loop
     - Description:
       ##### And itself
       \`parent_specimen\` names Specimen: an aliquot or a section is a specimen
       derived from another one. It is drawn as a loop mark on the row rather
       than as a line.
     - Anchor: slot-row:Specimen.parent_specimen


### values-forward

- **Title:** Owns: a value with no life of its own
- **Tour:** Ownership
- **Only:** sel=Observation~Quantity
- **Action:** Drew Observation and Quantity.
- **Anchor:** slot-row:Observation.value_quantity
- **Description:**
  \`value_quantity\` is single-valued, so Rule 2 would say the observation
  belongs to its Quantity — and a reader would conclude that to find an
  observation you start from a number. But a Quantity is a value, \`5 mg\`,
  not something you look up; it belongs to whoever holds it. So it is owned,
  and drawn on the right. The same goes for TimePoint, TimePeriod, BodySite
  and a few more: **a class with no independent existence is owned even by
  a single-valued attribute.** Which classes those are is a decision
  recorded in the Explorer, not something the schema can tell it.


### three-kinds

- **Title:** All three kinds at once
- **Tour:** Ownership
- **Only:** sel=SpecimenContainer~Specimen~Substance~SpecimenStorageActivity
- **Action:** Drew SpecimenContainer, Specimen, Substance and SpecimenStorageActivity.
- **Anchor:** node-box:SpecimenContainer
- **Width:** 520
- **Description:**
  Four classes, and every kind of line. Read them one at a time, and notice
  that the three attributes are declared on three different classes.
- **Beats:**
  1. owns
     - Description:
       ##### Owns
       \`SpecimenContainer.additive\` — a list of Substances. Rule 1: the
       container owns them. The line runs rightward, arrowhead on Substance.
     - Anchor: slot-row:SpecimenContainer.additive
  2. belongs to
     - Description:
       ##### Belongs to
       \`Specimen.contained_in\` — one container, which exists with or without
       this specimen. Rule 2: the specimen belongs to it. The container is
       drawn on the left and the line runs from this row back to it.
     - Anchor: slot-row:Specimen.contained_in
  3. association
     - Description:
       ##### Associated with
       \`SpecimenStorageActivity.container\` — a list of containers, so Rule 1
       would say the storage activity OWNS them. It does not: a container
       outlives the activity and holds specimens on its own. This is an
       **association**: no ownership claim either way, drawn slate, dashed
       and arrowed at both ends. The model has exactly two; the other is a
       specimen's \`related_document\`.
     - Anchor: slot-row:SpecimenStorageActivity.container
  4. why it matters
     - Description:
       ##### Why it matters
       Without the association this picture would be a cycle: the specimen
       owns its storage activity, which would own the container, which owns
       the specimen. Calling one of the three an association is what lets
       the canvas be read left to right at all.
     - Anchor: node-box:Specimen


### bar-sides

- **Title:** The relation bar, revisited
- **Tour:** Ownership
- **Only:** sel=Observation~ObservationSet~Participant~Visit~Organization
- **Action:** Drew Observation with the four classes that own it.
- **Anchor:** node-box:Observation
- **Highlight:** ring
- **Description:**
  Every class that owns Observation is to its left — that is all the bar's
  **←** count means. But they own it for two different reasons: Participant,
  Visit and Organization because Observation POINTS at them (it belongs to
  each), and ObservationSet because its \`observations\` list collects
  Observations (it owns them). Both kinds turn up on both sides of a bar.

  Hover the **←** count. Each row is written in canvas order, owner on the
  left, and names the attribute at the end that declares it — so
  \`Observation.performed_by\` and \`ObservationSet.observations\` sit at
  opposite ends of their rows even though both are on this side. The little
  line on each row is drawn the way the canvas draws it.


### legend-pointer

- **Title:** Every rule, every line
- **Tour:** Ownership
- **Anchor:** help-menu
- **Highlight:** ring
- **Description:**
  The **Ownership legend** in the Help menu lists every rule with the lines
  it produced, computed from the schema each time it opens, so it cannot go
  stale. When a line looks wrong, that is where to check which rule put it
  there. The exceptions are exactly the places where the Explorer had to
  make a call; if you think a call is wrong, the legend is where to have the
  argument.

</details><!-- end of Ownership tour -->
</div>

<div style="margin-left: 40px">
<details open>
<summary><b>Inheritance</b></summary>

## Inheritance
- **TourMetadata:**
- **Description:** Subclasses, and the boxes that hold several classes at once

### one-child

- **Title:** A class and its parent, one box
- **Tour:** Inheritance
- **Only:** sel=MeasurementObservation&panels=0
- **Action:** Drew MeasurementObservation on its own.
- **Anchor:** node-box:Observation
- **Description:**
  You asked for MeasurementObservation and the box is titled
  **Observation**. MeasurementObservation is a subclass — an Observation
  with a few extra attributes — and the Explorer draws a subclass INSIDE its
  parent's box rather than as a second box joined by a line. The \`⑃ 1\` in
  the header says one subclass is merged in.
- **Beats:**
  1. inherited rows
     - Description:
       ##### What it inherits
       The bold rows at the top are Observation's: the four \`value_\`
       attributes, who performed it, the participant and the visit.
       MeasurementObservation has all of them.
     - Anchor: slot-row:Observation.associated_participant
  2. the child's header
     - Description:
       ##### What it adds
       Below them a coloured header names the subclass, and the rows under
       it are the ones it adds: a normal range, a body site, the instrument.
       Everything under this header is MeasurementObservation's alone.
     - Anchor: child-header:MeasurementObservation
  3. one is enough
     - Description:
       ##### Merged even alone
       This happens with a single subclass, not only when siblings are drawn
       together. A class should not change shape depending on what else you
       happen to have selected.
     - Anchor: node-box:Observation


### add-nothing

- **Title:** Subclasses that add nothing
- **Tour:** Inheritance
- **Only:** sel=SpecimenQualityObservation~SpecimenQuantityObservation
- **Action:** Drew the two specimen observations.
- **Anchor:** child-header:SpecimenQualityObservation
- **Description:**
  Two subclasses of Observation, and neither declares a single attribute of
  its own: two headers with nothing under them. That is not a gap. "An
  Observation made about a specimen rather than a person, adding nothing"
  is the whole definition of these classes, and an empty header is the
  honest picture of it.


### narrowing

- **Title:** Same attribute, narrower type
- **Tour:** Inheritance
- **Only:** sel=QuestionnaireResponseValueBoolean~QuestionnaireResponseValueDecimal~QuestionnaireResponseValueInteger~QuestionnaireResponseValueString~QuestionnaireResponseValueTimePoint
- **Action:** Drew the five typed questionnaire answers.
- **Anchor:** slot-row:QuestionnaireResponseValue.value
- **Description:**
  A QuestionnaireResponseValue has a \`value\`, declared as a string. Its five
  subclasses exist for one reason each: to say that \`value\` is a boolean, a
  decimal, an integer, a string or a TimePoint. LinkML calls this narrowing
  \`slot_usage\`.
- **Beats:**
  1. a narrowed row
     - Description:
       ##### The child's own row
       So each child keeps its OWN \`value\` row under its header, with the
       narrower type, instead of sharing the parent's — the one case where a
       shared row would be a lie.
     - Anchor: slot-row:QuestionnaireResponseValueBoolean.value
  2. the one that doesn't
     - Description:
       ##### The one that adds nothing
       The String child's \`value\` is a string, exactly as the parent declared
       it, so it has no row of its own: the header alone. Compare its
       TimePoint sibling, whose \`value\` is another class and gets a blue dot.
     - Anchor: child-header:QuestionnaireResponseValueString


### full-family

- **Title:** The whole family
- **Tour:** Inheritance
- **Only:** cat=observation
- **Action:** Drew the Observations / Measurements category, the same as pressing its ⊞ button.
- **Anchor:** node-box:Observation
- **Width:** 520
- **Description:**
  The largest hierarchy in the model, and the best picture of what merging
  buys. One box holds Observation and all five subclasses; the rows they
  share are stated once, at the top, and each subclass adds its own beneath
  its coloured header. Drawn as six separate boxes, the shared rows would be
  repeated six times.
- **Beats:**
  1. colours
     - Description:
       ##### Colours
       Each subclass has a colour, worn by its header and by any line leaving
       one of its rows, so a line can be traced back to the subclass that
       declares it. A line from a shared row is drawn once, not once per
       subclass.
     - Anchor: child-header:MeasurementObservation
  2. the sets
     - Description:
       ##### The sets mirror them
       ObservationSet has the same shape: three subclasses in one box, one
       per kind of observation being grouped.
     - Anchor: node-box:ObservationSet
  3. a narrowed line
     - Description:
       ##### A line that lands on a header
       \`MeasurementObservationSet.observations\` is a narrowed \`observations\`:
       a measurement set holds MeasurementObservations specifically, not
       Observations in general. So its line does not land on the Observation
       box as a whole but on the **MeasurementObservation header** inside
       it, in that subclass's colour.
     - Anchor: slot-row:MeasurementObservationSet.observations
  4. the landing
     - Description:
       ##### Where it lands
       Here. The plain \`ObservationSet.observations\` line, one row up in the
       other box, lands on this box's header as usual.
     - Anchor: child-header:MeasurementObservation


### families

- **Title:** Where inheritance lives in the model
- **Tour:** Inheritance
- **Anchor:** none
- **Description:**
  BDCHM uses inheritance in five places, and you have now seen the two big
  ones: Observation with five subclasses and ObservationSet with three. The
  others are Exposure (a drug or a device), File (an imaging file), and the
  five typed questionnaire answers. Everywhere else, a class stands on its
  own.

  The categories in the left panel are not inheritance: a category is a
  browsing aid, and a class listed in two of them is one class, not two.

</details><!-- end of Inheritance tour -->
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
`,gi={inTour:!1,held:[],tempHeld:[],tour:[],region:0,tourStates:[],scalars:{}},qm="~";function er(e,t){return e&&t.includes(e)?e:null}function bl(e,t=!1){const n=new URLSearchParams(e),s={};if(n.get("panels")==="0"){for(const c of Ka)s[c]=!1;s.detail=null}n.has("detail")&&(s.detail=n.get("detail")||null),n.has("roots")&&(s.roots=n.get("roots")==="1"),n.has("sibs")&&(s.sibs=n.get("sibs")==="1"),n.has("legend")&&(s.legend=n.get("legend")==="1"),n.has("cases")&&(s.cases=n.get("cases")==="1");const i=er(n.get("dir"),["RIGHT","DOWN"]);i&&(s.dir=i);const r=er(n.get("merge"),["near","far","bend","off"]);r&&(s.merge=r);const o=n.get("sel"),a=o?o.split(qm).filter(Boolean):Qa(n);return t?{sel:a,scalars:s,replace:!0}:{sel:a,scalars:s}}function Dt(e,t){return[...new Set([...e,...t])]}function Xm(e){return{...gi,inTour:!0,held:[...e]}}function Ym(){return gi}function Zm(e){return Dt(e.held,e.tempHeld)}function vl(e,t){const n=t.replace?e.region+1:e.region,s=t.replace?[...t.sel]:Dt(e.tour,t.sel),i={...e.scalars,...t.scalars};return{...e,tour:s,region:n,scalars:i,tourStates:[...e.tourStates,{sel:s,scalars:i,region:n}]}}function kl(e){if(e.tourStates.length===0)return e;const t=e.tourStates.slice(0,-1),n=t[t.length-1];return{...e,tourStates:t,tour:n?n.sel:[],region:n?n.region:0}}function yi(e){return e.region>0}function Jm(e,t){if(!e.inTour)return e;const n=yi(e)?"tempHeld":"held";return e[n].includes(t)?e:{...e,[n]:[...e[n],t]}}function eg(e,t){if(!e.inTour)return e;const n=s=>s.filter(i=>i!==t);return{...e,tour:n(e.tour),tempHeld:n(e.tempHeld),held:yi(e)?e.held:n(e.held)}}function wi(e,t){if(!t.inTour)return e;const n=yi(t)?Dt(t.tour,t.tempHeld):Dt(Dt(t.tour,t.tempHeld),t.held);return{...e,...t.scalars,sel:n}}function tg(){const{modelData:e,loading:t,error:n}=Bl(),s=p.useMemo(()=>e?new $l(e):null,[e]),{setTextResolvers:i}=yt(),r=p.useMemo(()=>s?Km(s):void 0,[s]);p.useEffect(()=>i(r),[r,i]);const o=p.useMemo(()=>Ie(),[]),[a,c]=p.useState(()=>new Set(o.sel)),[l,h]=p.useState(o.detail),[f,u]=p.useState(!1),w=p.useRef(!1),[g,m]=p.useState("list"),[y,x]=p.useState(o.roots),[T,v]=p.useState(o.sibs),[b,C]=p.useState(o.dir),[P,S]=p.useState(o.merge),[M,N]=p.useState(o.cases),[H,F]=p.useState(o.legend),[G,R]=p.useState(!1),I=p.useCallback(A=>{c(new Set(A.sel)),x(!!A.roots),h(null)},[]);p.useEffect(()=>{const A=()=>{const V=Ie();c(new Set(V.sel)),h(V.detail),x(V.roots),v(V.sibs),C(V.dir),S(V.merge),F(V.legend),N(V.cases)};return window.addEventListener("popstate",A),window.addEventListener("explore:state-from-url",A),()=>{window.removeEventListener("popstate",A),window.removeEventListener("explore:state-from-url",A)}},[]),p.useEffect(()=>{const A={sel:[...a],detail:l,roots:y,sibs:T,dir:b,merge:P,legend:H,cases:M},V=w.current;w.current=!1,qa(A,{push:V})},[a,l,y,T,b,P,H,M]);const q=p.useCallback(A=>{at(A,!Ie().sel.includes(A)),c(V=>{const Y=new Set(V);return Y.has(A)?Y.delete(A):Y.add(A),Y})},[]),X=p.useCallback(A=>{at(A,!0),c(V=>V.has(A)?V:new Set(V).add(A))},[]),le=p.useCallback(A=>{at(A,!1),c(V=>{if(!V.has(A))return V;const Y=new Set(V);return Y.delete(A),Y})},[]),K=p.useCallback(A=>{c(Y=>Y.size===A.length&&A.every(me=>Y.has(me))?Y:(w.current=!0,new Set(A)));const V=new Set(A);for(const Y of Ie().sel)V.has(Y)||at(Y,!1);for(const Y of A)at(Y,!0)},[]),J=p.useCallback(()=>{for(const A of Ie().sel)at(A,!1);c(new Set),h(null),u(!1),x(!1)},[]);return n?d.jsxs("div",{className:"p-8 text-red-600",children:["Failed to load model data: ",String(n)]}):t||!s?d.jsx("div",{className:"p-8 text-gray-400",children:"Loading model…"}):d.jsxs("div",{className:"relative flex flex-col h-screen bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100",children:[d.jsxs("header",{className:"flex items-center justify-between px-4 py-2 bg-blue-600 text-white shrink-0",children:[d.jsxs("div",{children:[d.jsx("h1",{"data-help-id":"app-title",className:"text-lg font-bold leading-tight cursor-pointer hover:opacity-80 transition-opacity",onClick:J,title:"Click to clear the selection and reset the view",children:"BDCHM Explorer"}),d.jsx("p",{className:"text-xs text-blue-100",children:"BioData Catalyst Harmonized Model"})]}),d.jsxs("div",{className:"flex items-center gap-4",children:[d.jsx(lg,{}),d.jsx(Tm,{}),d.jsx(hm,{onOpenLegend:()=>F(A=>!A),onOpenCases:()=>N(A=>!A),legendOpen:H,casesOpen:M,anyPanelOpen:H||M||l!==null,onClosePanels:()=>{F(!1),N(!1),h(null)}}),d.jsx("button",{onClick:async()=>{const A=Vp({sel:[...a],detail:l,roots:y,sibs:T,dir:b,merge:P,legend:H,cases:M});try{await navigator.clipboard.writeText(A),R(!0),window.setTimeout(()=>R(!1),1500)}catch{R(!1),window.prompt("Copy this link:",A)}},"data-help-id":"copy-link",className:"text-sm underline text-blue-100 hover:text-white",title:"Copy a link that reproduces exactly this view, settings included",children:G?"✓ copied":"copy link"}),d.jsx("a",{href:"/dynamic-model-var-docs/previous.html",className:"text-sm underline text-blue-100 hover:text-white",children:"previous views"}),d.jsx("a",{href:"https://github.com/Sigfried/dynamic-model-var-docs",target:"_blank",rel:"noopener noreferrer",className:"text-blue-100 hover:text-white",title:"Source code on GitHub","aria-label":"Source code on GitHub",children:d.jsx("svg",{viewBox:"0 0 16 16",width:"18",height:"18",fill:"currentColor","aria-hidden":!0,children:d.jsx("path",{d:"M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"})})})]})]}),H&&d.jsx(rm,{onClose:()=>F(!1),onSelect:A=>I({name:"ad hoc",note:"",sel:A}),dataService:s}),M&&d.jsx(nm,{onClose:()=>N(!1),onApply:I,selectedIds:a,dataService:s,offset:H}),d.jsxs("div",{className:"flex-1 flex min-h-0",children:[f?d.jsxs("button",{onClick:()=>u(!1),title:"Show entity selection",className:`shrink-0 w-8 border-r border-gray-200 dark:border-slate-700
                       bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700
                       flex flex-col items-center gap-2 py-2 text-gray-400`,children:[d.jsx("span",{className:"text-xs",children:"▶"}),d.jsxs("span",{className:"text-[10px] uppercase tracking-wider [writing-mode:vertical-rl]",children:[s.getConceptLabel("entity",!0),a.size>0?` (${a.size})`:""]})]}):d.jsxs("div",{className:"w-80 shrink-0 flex flex-col min-h-0 border-r border-gray-200 dark:border-slate-700",children:[d.jsx("div",{className:"flex-1 overflow-y-auto min-h-0","data-help-id":"selection-tree",children:g==="tree"?d.jsx(Xl,{dataService:s,selectedIds:a,onToggle:q,onShowDetail:h}):d.jsx(ql,{dataService:s,selectedIds:a,onToggle:q,onShowCategory:K})}),d.jsx("button",{onClick:()=>m(A=>A==="tree"?"list":"tree"),title:"Switch between the ownership tree and the flat category list",className:`shrink-0 px-3 py-1 text-xs text-gray-400 border-t border-gray-200
                         dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 text-left`,children:g==="tree"?"☰ flat list":"⑃ tree"}),d.jsx("button",{onClick:()=>u(!0),title:"Hide entity selection",className:`shrink-0 px-3 py-1 text-xs text-gray-400 border-t border-gray-200
                         dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 text-left`,children:"◀ Hide"})]}),d.jsx("div",{className:"flex-1 min-w-0","data-help-id":"graph-canvas",children:a.size===0?d.jsx("div",{className:"h-full flex items-center justify-center text-sm text-gray-400 p-8",children:"Select entities on the left to build the ownership subgraph."}):d.jsx(Xp,{dataService:s,selectedIds:a,onNodeClick:h,onAdd:X,onRemove:le,pathToRoot:y,onTogglePathToRoot:()=>x(A=>!A),direction:b,setDirection:C,mergeMode:P,setMergeMode:S,mergeSibs:T,setMergeSibs:v})}),l&&d.jsx(Yp,{classId:l,dataService:s,onClose:()=>h(null),onNavigate:h,isSelected:a.has(l),onToggleSelect:q})]})]})}let ue=gi;function at(e,t){ue=t?Jm(ue,e):eg(ue,e)}function Mn(e){qa(e),window.dispatchEvent(new Event("explore:state-from-url"))}function ng(){ue=Xm(Ie().sel)}function sg(){if(!ue.inTour)return;const e=Zm(ue),t=Ie();ue=Ym(),Mn({...t,sel:e})}function ig(e,t=!1){ue=vl(ue,bl(e,t)),Mn(wi(Ie(),ue))}function og(){ue=kl(ue),Mn(wi(Ie(),ue))}function rg(e,t){for(let n=0;n<t;n++)ue=kl(ue);for(const n of e)ue=vl(ue,bl(n.query,n.replace));Mn(wi(Ie(),ue))}function ag(){return d.jsxs(Pm,{markdown:Qm,onPushChange:ig,onPopChange:og,onJumpChanges:rg,onTourStart:ng,onTourEnd:sg,children:[d.jsx(tg,{}),d.jsx(Vm,{})]})}function lg(){const{helpMode:e,toggleHelpMode:t,startTour:n}=yt();return p.useEffect(()=>{Op()&&n()},[]),d.jsx("span",{className:"flex items-center gap-2","data-help-id":"help-button",children:am})}Fl.createRoot(document.getElementById("root")).render(d.jsx(p.StrictMode,{children:d.jsx(ag,{})}));
