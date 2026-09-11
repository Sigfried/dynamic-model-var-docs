import{i as ls,p as Tl,r as m,j as d,E as we,g as Sl,a as ir,b as or,S as Cl,c as Al,d as Pl,s as El,w as Ml,R as St,e as Dl,f as Ol,m as Rl,h as jl,k as Ll,M as Qt,l as Nl,u as Vl,D as Il,n as Bl}from"./index-Chpj4An8.js";function rr(e){return[...new Set([...e.classIds,...e.pins])]}const $l=e=>`entity-row:${e}`,Fl=e=>`entity-checkbox:${e}`,_l=e=>`category-row:${e}`,Hl=e=>`node-box:${e}`,Wl=e=>`child-header:${e}`,zl=(e,t)=>`slot-row:${e}.${t}`,ar=e=>ls(e.id)?Tl(e.id):e.id,Gl=e=>Hl(ar(e)),Ul=(e,t)=>zl(t.declaringClass??ar(e),t.slot);function Kl({dataService:e,selectedIds:t,onToggle:n,onShowCategory:s}){const i=m.useMemo(()=>e.getCategoryTrees(),[e]),[r,o]=m.useState(new Set),a=l=>o(h=>{const f=new Set(h);return f.has(l)?f.delete(l):f.add(l),f}),c=i.reduce((l,h)=>l+h.classIds.length,0);return d.jsxs("div",{className:"text-sm",children:[d.jsx("div",{className:"flex items-baseline gap-2 px-3 py-2 border-b border-gray-200 dark:border-slate-700",children:d.jsxs("span",{className:"font-semibold flex-1",children:[e.getConceptLabel("entity",!0)," (",c,")"]})}),i.map(l=>{const h=r.has(l.id),f=l.classIds.filter(u=>t.has(u)).length;return d.jsxs("div",{children:[d.jsxs("div",{"data-help-id":_l(l.id),className:`w-full flex items-stretch font-medium
                         bg-gray-50 dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700`,children:[d.jsxs("button",{type:"button",onClick:()=>a(l.id),className:`flex-1 min-w-0 flex items-center gap-2 px-3 py-1.5 text-left
                           hover:bg-gray-100 dark:hover:bg-slate-700`,children:[d.jsx("span",{className:"text-xs text-gray-400",children:h?"▶":"▼"}),d.jsx("span",{className:"flex-1 truncate",children:l.label}),f>0&&d.jsxs("span",{className:"text-xs text-gray-400",children:[f," / ",l.classIds.length]})]}),s&&d.jsx("button",{type:"button","data-show-category":l.id,title:`Draw the ${l.label} content view — replaces the canvas`,onClick:()=>s(rr(l)),className:`px-2.5 shrink-0 text-gray-400 border-l border-gray-100
                             dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700
                             hover:text-blue-600 dark:hover:text-sky-400`,children:"⊞"})]}),!h&&l.roots.map(u=>d.jsx(lr,{node:u,depth:0,selectedIds:t,onToggle:n},u.classId))]},l.id)})]})}function lr({node:e,depth:t,selectedIds:n,onToggle:s}){const{classId:i}=e;return d.jsxs(d.Fragment,{children:[d.jsxs("label",{"data-class-row":i,"data-help-id":$l(i),className:`flex items-center gap-2 pr-3 py-1 cursor-pointer
                    hover:bg-blue-50 dark:hover:bg-slate-800
                    ${n.has(i)?"bg-blue-50 dark:bg-slate-800":""}`,style:{paddingLeft:`${.75+t*1}rem`},children:[d.jsx("input",{type:"checkbox","data-help-id":Fl(i),checked:n.has(i),onChange:()=>s(i)}),d.jsxs("span",{className:"flex-1 min-w-0 truncate",children:[d.jsx("span",{className:"font-mono text-xs",children:i}),e.outOfCategoryParent&&d.jsxs("span",{className:"ml-1 text-[10px] text-gray-400 dark:text-slate-500",title:`Extends ${e.outOfCategoryParent}, which is in another category`,children:["↳ ",e.outOfCategoryParent]})]})]}),e.children.map(r=>d.jsx(lr,{node:r,depth:t+1,selectedIds:n,onToggle:s},r.classId))]})}const _s=m.createContext({});function Hs(e){const t=m.useRef(null);return t.current===null&&(t.current=e()),t.current}const Ql=typeof window<"u",bn=Ql?m.useLayoutEffect:m.useEffect,En=m.createContext(null);function Ws(e,t){e.indexOf(t)===-1&&e.push(t)}function wn(e,t){const n=e.indexOf(t);n>-1&&e.splice(n,1)}const We=(e,t,n)=>n>t?t:n<e?e:n;let Mn=()=>{};const Qe={},cr=e=>/^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(e),hr=e=>typeof e=="object"&&e!==null,dr=e=>/^0[^.\s]+$/u.test(e);function ur(e){let t;return()=>(t===void 0&&(t=e()),t)}const Re=e=>e,Ft=(...e)=>e.reduce((t,n)=>s=>n(t(s))),Nt=(e,t,n)=>{const s=t-e;return s?(n-e)/s:1};class zs{constructor(){this.subscriptions=[]}add(t){return Ws(this.subscriptions,t),()=>wn(this.subscriptions,t)}notify(t,n,s){const i=this.subscriptions.length;if(i)if(i===1)this.subscriptions[0](t,n,s);else for(let r=0;r<i;r++){const o=this.subscriptions[r];o&&o(t,n,s)}}getSize(){return this.subscriptions.length}clear(){this.subscriptions.length=0}}const je=e=>e*1e3,Oe=e=>e/1e3,fr=(e,t)=>t?e*(1e3/t):0,pr=(e,t,n)=>(((1-3*n+3*t)*e+(3*n-6*t))*e+3*t)*e,ql=1e-7,Yl=12;function Xl(e,t,n,s,i){let r,o,a=0;do o=t+(n-t)/2,r=pr(o,s,i)-e,r>0?n=o:t=o;while(Math.abs(r)>ql&&++a<Yl);return o}function _t(e,t,n,s){if(e===t&&n===s)return Re;const i=r=>Xl(r,0,1,e,n);return r=>r===0||r===1?r:pr(i(r),t,s)}const mr=e=>t=>t<=.5?e(2*t)/2:(2-e(2*(1-t)))/2,gr=e=>t=>1-e(1-t),yr=_t(.33,1.53,.69,.99),Gs=gr(yr),br=mr(Gs),wr=e=>e>=1?1:(e*=2)<1?.5*Gs(e):.5*(2-Math.pow(2,-10*(e-1))),Us=e=>1-Math.sin(Math.acos(e)),xr=gr(Us),vr=mr(Us),Zl=_t(.42,0,1,1),Jl=_t(0,0,.58,1),kr=_t(.42,0,.58,1),ec=e=>Array.isArray(e)&&typeof e[0]!="number",Tr=e=>Array.isArray(e)&&typeof e[0]=="number",tc={linear:Re,easeIn:Zl,easeInOut:kr,easeOut:Jl,circIn:Us,circInOut:vr,circOut:xr,backIn:Gs,backInOut:br,backOut:yr,anticipate:wr},nc=e=>typeof e=="string",Si=e=>{if(Tr(e)){Mn(e.length===4);const[t,n,s,i]=e;return _t(t,n,s,i)}else if(nc(e))return tc[e];return e},qt=["setup","read","resolveKeyframes","preUpdate","update","preRender","render","postRender"];function sc(e){let t=new Set,n=new Set,s=!1,i=!1;const r=new WeakSet;let o={delta:0,timestamp:0,isProcessing:!1};function a(l){r.has(l)&&(c.schedule(l),e()),l(o)}const c={schedule:(l,h=!1,f=!1)=>{const g=f&&s?t:n;return h&&r.add(l),g.add(l),l},cancel:l=>{n.delete(l),r.delete(l)},process:l=>{if(o=l,s){i=!0;return}s=!0;const h=t;t=n,n=h,t.forEach(a),t.clear(),s=!1,i&&(i=!1,c.process(l))}};return c}const ic=40;function Sr(e,t){let n=!1,s=!0;const i={delta:0,timestamp:0,isProcessing:!1},r=()=>n=!0,o=qt.reduce((v,b)=>(v[b]=sc(r),v),{}),{setup:a,read:c,resolveKeyframes:l,preUpdate:h,update:f,preRender:u,render:g,postRender:y}=o,x=()=>{const v=Qe.useManualTiming,b=v?i.timestamp:performance.now();n=!1,v||(i.delta=s?1e3/60:Math.max(Math.min(b-i.timestamp,ic),1)),i.timestamp=b,i.isProcessing=!0,a.process(i),c.process(i),l.process(i),h.process(i),f.process(i),u.process(i),g.process(i),y.process(i),i.isProcessing=!1,n&&t&&(s=!1,e(x))},p=()=>{n=!0,s=!0,i.isProcessing||e(x)};return{schedule:qt.reduce((v,b)=>{const k=o[b];return v[b]=(A,C=!1,E=!1)=>(n||p(),k.schedule(A,C,E)),v},{}),cancel:v=>{for(let b=0;b<qt.length;b++)o[qt[b]].cancel(v)},state:i,steps:o}}const{schedule:ee,cancel:qe,state:pe,steps:In}=Sr(typeof requestAnimationFrame<"u"?requestAnimationFrame:Re,!0);let ln;function oc(){ln=void 0}const ye={now:()=>(ln===void 0&&ye.set(pe.isProcessing||Qe.useManualTiming?pe.timestamp:performance.now()),ln),set:e=>{ln=e,queueMicrotask(oc)}},Cr=e=>t=>typeof t=="string"&&t.startsWith(e),Ar=Cr("--"),rc=Cr("var(--"),Ks=e=>rc(e)?ac.test(e.split("/*")[0].trim()):!1,ac=/var\(--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)$/iu;function Ci(e){return typeof e!="string"?!1:e.split("/*")[0].includes("var(--")}const bt={test:e=>typeof e=="number",parse:parseFloat,transform:e=>e},Vt={...bt,transform:e=>We(0,1,e)},Yt={...bt,default:1},Et=e=>Math.round(e*1e5)/1e5,Qs=/-?(?:\d+(?:\.\d+)?|\.\d+)/gu;function lc(e){return e==null}const cc=/^(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))$/iu,qs=(e,t)=>n=>!!(typeof n=="string"&&cc.test(n)&&n.startsWith(e)||t&&!lc(n)&&Object.prototype.hasOwnProperty.call(n,t)),Pr=(e,t,n)=>s=>{if(typeof s!="string")return s;const[i,r,o,a]=s.match(Qs);return{[e]:parseFloat(i),[t]:parseFloat(r),[n]:parseFloat(o),alpha:a!==void 0?parseFloat(a):1}},hc=e=>We(0,255,e),Bn={...bt,transform:e=>Math.round(hc(e))},tt={test:qs("rgb","red"),parse:Pr("red","green","blue"),transform:({red:e,green:t,blue:n,alpha:s=1})=>"rgba("+Bn.transform(e)+", "+Bn.transform(t)+", "+Bn.transform(n)+", "+Et(Vt.transform(s))+")"};function dc(e){let t="",n="",s="",i="";return e.length>5?(t=e.substring(1,3),n=e.substring(3,5),s=e.substring(5,7),i=e.substring(7,9)):(t=e.substring(1,2),n=e.substring(2,3),s=e.substring(3,4),i=e.substring(4,5),t+=t,n+=n,s+=s,i+=i),{red:parseInt(t,16),green:parseInt(n,16),blue:parseInt(s,16),alpha:i?parseInt(i,16)/255:1}}const cs={test:qs("#"),parse:dc,transform:tt.transform},Ht=e=>({test:t=>typeof t=="string"&&t.endsWith(e)&&t.split(" ").length===1,parse:parseFloat,transform:t=>`${t}${e}`}),ze=Ht("deg"),He=Ht("%"),N=Ht("px"),uc=Ht("vh"),fc=Ht("vw"),Ai={...He,parse:e=>He.parse(e)/100,transform:e=>He.transform(e*100)},ft={test:qs("hsl","hue"),parse:Pr("hue","saturation","lightness"),transform:({hue:e,saturation:t,lightness:n,alpha:s=1})=>"hsla("+Math.round(e)+", "+He.transform(Et(t))+", "+He.transform(Et(n))+", "+Et(Vt.transform(s))+")"},le={test:e=>tt.test(e)||cs.test(e)||ft.test(e),parse:e=>tt.test(e)?tt.parse(e):ft.test(e)?ft.parse(e):cs.parse(e),transform:e=>typeof e=="string"?e:e.hasOwnProperty("red")?tt.transform(e):ft.transform(e),getAnimatableNone:e=>{const t=le.parse(e);return t.alpha=0,le.transform(t)}},pc=/(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))/giu;function mc(e){return isNaN(e)&&typeof e=="string"&&(e.match(Qs)?.length||0)+(e.match(pc)?.length||0)>0}const Er="number",Mr="color",gc="var",yc="var(",Pi="${}",bc=/var\s*\(\s*--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)|#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\)|-?(?:\d+(?:\.\d+)?|\.\d+)/giu;function gt(e){const t=e.toString(),n=[],s={color:[],number:[],var:[]},i=[];let r=0;const a=t.replace(bc,c=>(le.test(c)?(s.color.push(r),i.push(Mr),n.push(le.parse(c))):c.startsWith(yc)?(s.var.push(r),i.push(gc),n.push(c)):(s.number.push(r),i.push(Er),n.push(parseFloat(c))),++r,Pi)).split(Pi);return{values:n,split:a,indexes:s,types:i}}function wc(e){return gt(e).values}function Dr({split:e,types:t}){const n=e.length;return s=>{let i="";for(let r=0;r<n;r++)if(i+=e[r],s[r]!==void 0){const o=t[r];o===Er?i+=Et(s[r]):o===Mr?i+=le.transform(s[r]):i+=s[r]}return i}}function xc(e){return Dr(gt(e))}const vc=e=>typeof e=="number"?0:le.test(e)?le.getAnimatableNone(e):e,kc=(e,t)=>typeof e=="number"?t?.trim().endsWith("/")?e:0:vc(e);function Tc(e){const t=gt(e);return Dr(t)(t.values.map((s,i)=>kc(s,t.split[i])))}const Ie={test:mc,parse:wc,createTransformer:xc,getAnimatableNone:Tc};function $n(e,t,n){return n<0&&(n+=1),n>1&&(n-=1),n<1/6?e+(t-e)*6*n:n<1/2?t:n<2/3?e+(t-e)*(2/3-n)*6:e}function Sc({hue:e,saturation:t,lightness:n,alpha:s}){e/=360,t/=100,n/=100;let i=0,r=0,o=0;if(!t)i=r=o=n;else{const a=n<.5?n*(1+t):n+t-n*t,c=2*n-a;i=$n(c,a,e+1/3),r=$n(c,a,e),o=$n(c,a,e-1/3)}return{red:Math.round(i*255),green:Math.round(r*255),blue:Math.round(o*255),alpha:s}}function xn(e,t){return n=>n>0?t:e}const J=(e,t,n)=>e+(t-e)*n,Fn=(e,t,n)=>{const s=e*e,i=n*(t*t-s)+s;return i<0?0:Math.sqrt(i)},Cc=[cs,tt,ft],Ac=e=>Cc.find(t=>t.test(e));function Ei(e){const t=Ac(e);if(!t)return!1;let n=t.parse(e);return t===ft&&(n=Sc(n)),n}const Mi=(e,t)=>{const n=Ei(e),s=Ei(t);if(!n||!s)return xn(e,t);const i={...n};return r=>(i.red=Fn(n.red,s.red,r),i.green=Fn(n.green,s.green,r),i.blue=Fn(n.blue,s.blue,r),i.alpha=J(n.alpha,s.alpha,r),tt.transform(i))},hs=new Set(["none","hidden"]);function Pc(e,t){return hs.has(e)?n=>n<=0?e:t:n=>n>=1?t:e}function Ec(e,t){return n=>J(e,t,n)}function Ys(e){return typeof e=="number"?Ec:typeof e=="string"?Ks(e)?xn:le.test(e)?Mi:Oc:Array.isArray(e)?Or:typeof e=="object"?le.test(e)?Mi:Mc:xn}function Or(e,t){const n=[...e],s=n.length,i=e.map((r,o)=>Ys(r)(r,t[o]));return r=>{for(let o=0;o<s;o++)n[o]=i[o](r);return n}}function Mc(e,t){const n={...e,...t},s={};for(const i in n)e[i]!==void 0&&t[i]!==void 0&&(s[i]=Ys(e[i])(e[i],t[i]));return i=>{for(const r in s)n[r]=s[r](i);return n}}function Dc(e,t){const n=[],s={color:0,var:0,number:0};for(let i=0;i<t.values.length;i++){const r=t.types[i],o=e.indexes[r][s[r]],a=e.values[o]??0;n[i]=a,s[r]++}return n}const Oc=(e,t)=>{const n=Ie.createTransformer(t),s=gt(e),i=gt(t);return s.indexes.var.length===i.indexes.var.length&&s.indexes.color.length===i.indexes.color.length&&s.indexes.number.length>=i.indexes.number.length?hs.has(e)&&!i.values.length||hs.has(t)&&!s.values.length?Pc(e,t):Ft(Or(Dc(s,i),i.values),n):xn(e,t)};function Rr(e,t,n){return typeof e=="number"&&typeof t=="number"&&typeof n=="number"?J(e,t,n):Ys(e)(e,t)}const Rc=e=>{const t=({timestamp:n})=>e(n);return{start:(n=!0)=>ee.update(t,n),stop:()=>qe(t),now:()=>pe.isProcessing?pe.timestamp:ye.now()}},jr=(e,t,n=10)=>{let s="";const i=Math.max(Math.round(t/n),2);for(let r=0;r<i;r++)s+=Math.round(e(r/(i-1))*1e4)/1e4+", ";return`linear(${s.substring(0,s.length-2)})`},Xs=2e4;function Zs(e,t=50,n=Xs,s){let i=0,r=e.next(i);for(;!r.done&&i<n;)i+=t,r=e.next(i);return i>=n?1/0:i}function jc(e,t=100,n){const s=n({...e,keyframes:[0,t]}),i=Math.min(Zs(s),Xs);return{type:"keyframes",ease:r=>s.next(i*r).value/t,duration:Oe(i)}}const oe={stiffness:100,damping:10,mass:1,velocity:0,duration:800,bounce:.3,visualDuration:.3,restSpeed:{granular:.01,default:2},restDelta:{granular:.005,default:.5},minDuration:.01,maxDuration:10,minDamping:.05,maxDamping:1};function ds(e,t){return e*Math.sqrt(1-t*t)}const Lc=12;function Nc(e,t,n){let s=n;for(let i=1;i<Lc;i++)s=s-e(s)/t(s);return s}const _n=.001;function Vc({duration:e=oe.duration,bounce:t=oe.bounce,velocity:n=oe.velocity,mass:s=oe.mass}){let i,r,o=1-t;o=We(oe.minDamping,oe.maxDamping,o),e=We(oe.minDuration,oe.maxDuration,Oe(e)),o<1?(i=l=>{const h=l*o,f=h*e,u=h-n,g=ds(l,o),y=Math.exp(-f);return _n-u/g*y},r=l=>{const f=l*o*e,u=f*n+n,g=o*o*l*l*e,y=Math.exp(-f),x=ds(l*l,o);return(-i(l)+_n>0?-1:1)*((u-g)*y)/x}):(i=l=>{const h=Math.exp(-l*e),f=(l-n)*e+1;return-_n+h*f},r=l=>{const h=Math.exp(-l*e),f=(n-l)*(e*e);return h*f});const a=5/e,c=Nc(i,r,a);if(e=je(e),isNaN(c))return{stiffness:oe.stiffness,damping:oe.damping,duration:e};{const l=c*c*s;return{stiffness:l,damping:o*2*Math.sqrt(s*l),duration:e}}}const Ic=["duration","bounce"],Bc=["stiffness","damping","mass"];function Di(e,t){return t.some(n=>e[n]!==void 0)}function $c(e){let t={velocity:oe.velocity,stiffness:oe.stiffness,damping:oe.damping,mass:oe.mass,isResolvedFromDuration:!1,...e};if(!Di(e,Bc)&&Di(e,Ic))if(t.velocity=0,e.visualDuration){const n=e.visualDuration,s=2*Math.PI/(n*1.2),i=s*s,r=2*We(.05,1,1-(e.bounce||0))*Math.sqrt(i);t={...t,mass:oe.mass,stiffness:i,damping:r}}else{const n=Vc({...e,velocity:0});t={...t,...n,mass:oe.mass},t.isResolvedFromDuration=!0}return t}function vn(e=oe.visualDuration,t=oe.bounce){const n=typeof e!="object"?{visualDuration:e,keyframes:[0,1],bounce:t}:e;let{restSpeed:s,restDelta:i}=n;const r=n.keyframes[0],o=n.keyframes[n.keyframes.length-1],a={done:!1,value:r},{stiffness:c,damping:l,mass:h,duration:f,velocity:u,isResolvedFromDuration:g}=$c({...n,velocity:-Oe(n.velocity||0)}),y=u||0,x=l/(2*Math.sqrt(c*h)),p=o-r,w=Oe(Math.sqrt(c/h)),S=x*w,v=Math.abs(p)<5;s||(s=v?oe.restSpeed.granular:oe.restSpeed.default),i||(i=v?oe.restDelta.granular:oe.restDelta.default);let b,k;if(x<1){const C=ds(w,x),E=(y+S*p)/C,L=S*E+p*C,I=S*p-E*C;let K=-1,_=0,R=0;const B=Y=>{if(Y!==K){K=Y;const Z=Math.exp(-S*Y),xe=Math.sin(C*Y),O=Math.cos(C*Y);_=o-Z*(E*xe+p*O),R=Z*(L*xe+I*O)}};b=Y=>(B(Y),_),k=Y=>(B(Y),R)}else if(x===1){b=E=>o-Math.exp(-w*E)*(p+(y+w*p)*E);const C=y+w*p;k=E=>Math.exp(-w*E)*(w*C*E-y)}else{const C=w*Math.sqrt(x*x-1);b=K=>{const _=Math.exp(-S*K),R=Math.min(C*K,300);return o-_*((y+S*p)*Math.sinh(R)+C*p*Math.cosh(R))/C};const E=(y+S*p)/C,L=S*E-p*C,I=S*p-E*C;k=K=>{const _=Math.exp(-S*K),R=Math.min(C*K,300);return _*(L*Math.sinh(R)+I*Math.cosh(R))}}const A={calculatedDuration:g&&f||null,velocity:C=>je(k(C)),next:C=>{const E=b(C);if(g)a.done=C>=f;else{const L=je(k(C));a.done=Math.abs(L)<=s&&Math.abs(o-E)<=i}return a.value=a.done?o:E,a},toString:()=>{const C=Math.min(Zs(A),Xs),E=jr(L=>A.next(C*L).value,C,30);return C+"ms "+E},toTransition:()=>{}};return A}vn.applyToOptions=e=>{const t=jc(e,100,vn);return e.ease=t.ease,e.duration=je(t.duration),e.type="keyframes",e};function us({keyframes:e,velocity:t=0,power:n=.8,timeConstant:s=325,bounceDamping:i=10,bounceStiffness:r=500,modifyTarget:o,min:a,max:c,restDelta:l=.5,restSpeed:h}){const f=e[0],u={done:!1,value:f},g=C=>C<a||C>c,y=C=>a===void 0?c:c===void 0||Math.abs(a-C)<Math.abs(c-C)?a:c;let x=n*t;const p=f+x,w=o===void 0?p:o(p);w!==p&&(x=w-f);const S=C=>-x*Math.exp(-C/s),v=C=>{const E=S(C);u.done=Math.abs(E)<=l,u.value=u.done?w:w+E};let b,k;const A=C=>{g(u.value)&&(b=C,k=vn({keyframes:[u.value,y(u.value)],velocity:-S(C)/s*1e3,damping:i,stiffness:r,restDelta:l,restSpeed:h}))};return A(0),{calculatedDuration:null,next:C=>{let E=!1;return!k&&b===void 0&&(E=!0,v(C),A(C)),b!==void 0&&C>=b?k.next(C-b):(!E&&v(C),u)}}}function Fc(e,t,n){const s=[],i=n||Qe.mix||Rr,r=e.length-1;for(let o=0;o<r;o++){let a=i(e[o],e[o+1]);if(t){const c=Array.isArray(t)?t[o]||Re:t;a=Ft(c,a)}s.push(a)}return s}function _c(e,t,{clamp:n=!0,ease:s,mixer:i}={}){const r=e.length;if(Mn(r===t.length),r===1)return()=>t[0];if(r===2&&t[0]===t[1])return()=>t[1];const o=e[0]===e[1];e[0]>e[r-1]&&(e=[...e].reverse(),t=[...t].reverse());const a=Fc(t,s,i),c=a.length,l=h=>{if(o&&h<e[0])return t[0];let f=0;if(c>1)for(;f<e.length-2&&!(h<e[f+1]);f++);const u=Nt(e[f],e[f+1],h);return a[f](u)};return n?h=>l(We(e[0],e[r-1],h)):l}function Hc(e,t){const n=e[e.length-1];for(let s=1;s<=t;s++){const i=Nt(0,t,s);e.push(J(n,1,i))}}function Wc(e){const t=[0];return Hc(t,e.length-1),t}function zc(e,t){return e.map(n=>n*t)}function Gc(e,t){return e.map(()=>t||kr).splice(0,e.length-1)}function Mt({duration:e=300,keyframes:t,times:n,ease:s="easeInOut"}){const i=ec(s)?s.map(Si):Si(s),r={done:!1,value:t[0]},o=zc(n&&n.length===t.length?n:Wc(t),e),a=_c(o,t,{ease:Array.isArray(i)?i:Gc(t,i)});return{calculatedDuration:e,next:c=>(r.value=a(c),r.done=c>=e,r)}}const Uc=5;function Kc(e,t,n){const s=Math.max(t-Uc,0);return fr(n-e(s),t-s)}const Qc=e=>e!==null;function Dn(e,{repeat:t,repeatType:n="loop"},s,i=1){const r=e.filter(Qc),a=i<0||t&&n!=="loop"&&t%2===1?0:r.length-1;return!a||s===void 0?r[a]:s}const qc={decay:us,inertia:us,tween:Mt,keyframes:Mt,spring:vn};function Lr(e){typeof e.type=="string"&&(e.type=qc[e.type])}class Js{constructor(){this.updateFinished()}get finished(){return this._finished}updateFinished(){this._finished=new Promise(t=>{this.resolve=t})}notifyFinished(){this.resolve()}then(t,n){return this.finished.then(t,n)}}const Yc=e=>e/100;class kn extends Js{constructor(t){super(),this.state="idle",this.startTime=null,this.isStopped=!1,this.currentTime=0,this.holdTime=null,this.playbackSpeed=1,this.delayState={done:!1,value:void 0},this.stop=()=>{const{motionValue:n}=this.options;n&&n.updatedAt!==ye.now()&&this.tick(ye.now()),this.isStopped=!0,this.state!=="idle"&&(this.teardown(),this.options.onStop?.())},this.options=t,this.initAnimation(),this.play(),t.autoplay===!1&&this.pause()}initAnimation(){const{options:t}=this;Lr(t);const{type:n=Mt,repeat:s=0,repeatDelay:i=0,repeatType:r,velocity:o=0}=t;let{keyframes:a}=t;const c=n||Mt;c!==Mt&&typeof a[0]!="number"&&(this.mixKeyframes=Ft(Yc,Rr(a[0],a[1])),a=[0,100]);const l=c({...t,keyframes:a});r==="mirror"&&(this.mirroredGenerator=c({...t,keyframes:[...a].reverse(),velocity:-o})),l.calculatedDuration===null&&(l.calculatedDuration=Zs(l));const{calculatedDuration:h}=l;this.calculatedDuration=h,this.resolvedDuration=h+i,this.totalDuration=this.resolvedDuration*(s+1)-i,this.generator=l}updateTime(t){const n=Math.round(t-this.startTime)*this.playbackSpeed;this.holdTime!==null?this.currentTime=this.holdTime:this.currentTime=n}tick(t,n=!1){const{generator:s,totalDuration:i,mixKeyframes:r,mirroredGenerator:o,resolvedDuration:a,calculatedDuration:c}=this;if(this.startTime===null)return s.next(0);const{delay:l=0,keyframes:h,repeat:f,repeatType:u,repeatDelay:g,type:y,onUpdate:x,finalKeyframe:p}=this.options;this.speed>0?this.startTime=Math.min(this.startTime,t):this.speed<0&&(this.startTime=Math.min(t-i/this.speed,this.startTime)),n?this.currentTime=t:this.updateTime(t);const w=this.currentTime-l*(this.playbackSpeed>=0?1:-1),S=this.playbackSpeed>=0?w<0:w>i;this.currentTime=Math.max(w,0),this.state==="finished"&&this.holdTime===null&&(this.currentTime=i);let v=this.currentTime,b=s;if(f){const E=Math.min(this.currentTime,i)/a;let L=Math.floor(E),I=E%1;!I&&E>=1&&(I=1),I===1&&L--,L=Math.min(L,f+1),L%2&&(u==="reverse"?(I=1-I,g&&(I-=g/a)):u==="mirror"&&(b=o)),v=We(0,1,I)*a}let k;S?(this.delayState.value=h[0],k=this.delayState):k=b.next(v),r&&!S&&(k.value=r(k.value));let{done:A}=k;!S&&c!==null&&(A=this.playbackSpeed>=0?this.currentTime>=i:this.currentTime<=0);const C=this.holdTime===null&&(this.state==="finished"||this.state==="running"&&A);return C&&y!==us&&(k.value=Dn(h,this.options,p,this.speed)),x&&x(k.value),C&&this.finish(),k}then(t,n){return this.finished.then(t,n)}get duration(){return Oe(this.calculatedDuration)}get iterationDuration(){const{delay:t=0}=this.options||{};return this.duration+Oe(t)}get time(){return Oe(this.currentTime)}set time(t){t=je(t),this.currentTime=t,this.startTime===null||this.holdTime!==null||this.playbackSpeed===0?this.holdTime=t:this.driver&&(this.startTime=this.driver.now()-t/this.playbackSpeed),this.driver?this.driver.start(!1):(this.startTime=0,this.state="paused",this.holdTime=t,this.tick(t))}getGeneratorVelocity(){const t=this.currentTime;if(t<=0)return this.options.velocity||0;if(this.generator.velocity)return this.generator.velocity(t);const n=this.generator.next(t).value;return Kc(s=>this.generator.next(s).value,t,n)}get speed(){return this.playbackSpeed}set speed(t){const n=this.playbackSpeed!==t;n&&this.driver&&this.updateTime(ye.now()),this.playbackSpeed=t,n&&this.driver&&(this.time=Oe(this.currentTime))}play(){if(this.isStopped)return;const{driver:t=Rc,startTime:n}=this.options;this.driver||(this.driver=t(i=>this.tick(i))),this.options.onPlay?.();const s=this.driver.now();this.state==="finished"?(this.updateFinished(),this.startTime=s):this.holdTime!==null?this.startTime=s-this.holdTime:this.startTime||(this.startTime=n??s),this.state==="finished"&&this.speed<0&&(this.startTime+=this.calculatedDuration),this.holdTime=null,this.state="running",this.driver.start()}pause(){this.state="paused",this.updateTime(ye.now()),this.holdTime=this.currentTime}complete(){this.state!=="running"&&this.play(),this.state="finished",this.holdTime=null}finish(){this.notifyFinished(),this.teardown(),this.state="finished",this.options.onComplete?.()}cancel(){this.holdTime=null,this.startTime=0,this.tick(0),this.teardown(),this.options.onCancel?.()}teardown(){this.state="idle",this.stopDriver(),this.startTime=this.holdTime=null}stopDriver(){this.driver&&(this.driver.stop(),this.driver=void 0)}sample(t){return this.startTime=0,this.tick(t,!0)}attachTimeline(t){return this.options.allowFlatten&&(this.options.type="keyframes",this.options.ease="linear",this.initAnimation()),this.driver?.stop(),t.observe(this)}}function Xc(e){for(let t=1;t<e.length;t++)e[t]??(e[t]=e[t-1])}const nt=e=>e*180/Math.PI,fs=e=>{const t=nt(Math.atan2(e[1],e[0]));return ps(t)},Zc={x:4,y:5,translateX:4,translateY:5,scaleX:0,scaleY:3,scale:e=>(Math.abs(e[0])+Math.abs(e[3]))/2,rotate:fs,rotateZ:fs,skewX:e=>nt(Math.atan(e[1])),skewY:e=>nt(Math.atan(e[2])),skew:e=>(Math.abs(e[1])+Math.abs(e[2]))/2},ps=e=>(e=e%360,e<0&&(e+=360),e),Oi=fs,Ri=e=>Math.sqrt(e[0]*e[0]+e[1]*e[1]),ji=e=>Math.sqrt(e[4]*e[4]+e[5]*e[5]),Jc={x:12,y:13,z:14,translateX:12,translateY:13,translateZ:14,scaleX:Ri,scaleY:ji,scale:e=>(Ri(e)+ji(e))/2,rotateX:e=>ps(nt(Math.atan2(e[6],e[5]))),rotateY:e=>ps(nt(Math.atan2(-e[2],e[0]))),rotateZ:Oi,rotate:Oi,skewX:e=>nt(Math.atan(e[4])),skewY:e=>nt(Math.atan(e[1])),skew:e=>(Math.abs(e[1])+Math.abs(e[4]))/2};function ms(e){return e.includes("scale")?1:0}function gs(e,t){if(!e||e==="none")return ms(t);const n=e.match(/^matrix3d\(([-\d.e\s,]+)\)$/u);let s,i;if(n)s=Jc,i=n;else{const a=e.match(/^matrix\(([-\d.e\s,]+)\)$/u);s=Zc,i=a}if(!i)return ms(t);const r=s[t],o=i[1].split(",").map(th);return typeof r=="function"?r(o):o[r]}const eh=(e,t)=>{const{transform:n="none"}=getComputedStyle(e);return gs(n,t)};function th(e){return parseFloat(e.trim())}const wt=["transformPerspective","x","y","z","translateX","translateY","translateZ","scale","scaleX","scaleY","rotate","rotateX","rotateY","rotateZ","skew","skewX","skewY"],xt=new Set([...wt,"pathRotation"]),Li=e=>e===bt||e===N,nh=new Set(["x","y","z"]),sh=wt.filter(e=>!nh.has(e));function ih(e){const t=[];return sh.forEach(n=>{const s=e.getValue(n);s!==void 0&&(t.push([n,s.get()]),s.set(n.startsWith("scale")?1:0))}),t}const Ke={width:({x:e},{paddingLeft:t="0",paddingRight:n="0",boxSizing:s})=>{const i=e.max-e.min;return s==="border-box"?i:i-parseFloat(t)-parseFloat(n)},height:({y:e},{paddingTop:t="0",paddingBottom:n="0",boxSizing:s})=>{const i=e.max-e.min;return s==="border-box"?i:i-parseFloat(t)-parseFloat(n)},top:(e,{top:t})=>parseFloat(t),left:(e,{left:t})=>parseFloat(t),bottom:({y:e},{top:t})=>parseFloat(t)+(e.max-e.min),right:({x:e},{left:t})=>parseFloat(t)+(e.max-e.min),x:(e,{transform:t})=>gs(t,"x"),y:(e,{transform:t})=>gs(t,"y")};Ke.translateX=Ke.x;Ke.translateY=Ke.y;const st=new Set;let ys=!1,bs=!1,ws=!1;function Nr(){if(bs){const e=Array.from(st).filter(s=>s.needsMeasurement),t=new Set(e.map(s=>s.element)),n=new Map;t.forEach(s=>{const i=ih(s);i.length&&(n.set(s,i),s.render())}),e.forEach(s=>s.measureInitialState()),t.forEach(s=>{s.render();const i=n.get(s);i&&i.forEach(([r,o])=>{s.getValue(r)?.set(o)})}),e.forEach(s=>s.measureEndState()),e.forEach(s=>{s.suspendedScrollY!==void 0&&window.scrollTo(0,s.suspendedScrollY)})}bs=!1,ys=!1,st.forEach(e=>e.complete(ws)),st.clear()}function Vr(){st.forEach(e=>{e.readKeyframes(),e.needsMeasurement&&(bs=!0)})}function oh(){ws=!0,Vr(),Nr(),ws=!1}class ei{constructor(t,n,s,i,r,o=!1){this.state="pending",this.isAsync=!1,this.needsMeasurement=!1,this.unresolvedKeyframes=[...t],this.onComplete=n,this.name=s,this.motionValue=i,this.element=r,this.isAsync=o}scheduleResolve(){this.state="scheduled",this.isAsync?(st.add(this),ys||(ys=!0,ee.read(Vr),ee.resolveKeyframes(Nr))):(this.readKeyframes(),this.complete())}readKeyframes(){const{unresolvedKeyframes:t,name:n,element:s,motionValue:i}=this;if(t[0]===null){const r=i?.get(),o=t[t.length-1];if(r!==void 0)t[0]=r;else if(s&&n){const a=s.readValue(n,o);a!=null&&(t[0]=a)}t[0]===void 0&&(t[0]=o),i&&r===void 0&&i.set(t[0])}Xc(t)}setFinalKeyframe(){}measureInitialState(){}renderEndStyles(){}measureEndState(){}complete(t=!1){this.state="complete",this.onComplete(this.unresolvedKeyframes,this.finalKeyframe,t),st.delete(this)}cancel(){this.state==="scheduled"&&(st.delete(this),this.state="pending")}resume(){this.state==="pending"&&this.scheduleResolve()}}const rh=e=>e.startsWith("--");function Ir(e,t,n){rh(t)?e.style.setProperty(t,n):e.style[t]=n}const ah={};function Br(e,t){const n=ur(e);return()=>ah[t]??n()}const lh=Br(()=>window.ScrollTimeline!==void 0,"scrollTimeline"),$r=Br(()=>{try{document.createElement("div").animate({opacity:0},{easing:"linear(0, 1)"})}catch{return!1}return!0},"linearEasing"),Ct=([e,t,n,s])=>`cubic-bezier(${e}, ${t}, ${n}, ${s})`,Ni={linear:"linear",ease:"ease",easeIn:"ease-in",easeOut:"ease-out",easeInOut:"ease-in-out",circIn:Ct([0,.65,.55,1]),circOut:Ct([.55,0,1,.45]),backIn:Ct([.31,.01,.66,-.59]),backOut:Ct([.33,1.53,.69,.99])};function Fr(e,t){if(e)return typeof e=="function"?$r()?jr(e,t):"ease-out":Tr(e)?Ct(e):Array.isArray(e)?e.map(n=>Fr(n,t)||Ni.easeOut):Ni[e]}function ch(e,t,n,{delay:s=0,duration:i=300,repeat:r=0,repeatType:o="loop",ease:a="easeOut",times:c}={},l=void 0){const h={[t]:n};c&&(h.offset=c);const f=Fr(a,i);Array.isArray(f)&&(h.easing=f);const u={delay:s,duration:i,easing:Array.isArray(f)?"linear":f,fill:"both",iterations:r+1,direction:o==="reverse"?"alternate":"normal"};return l&&(u.pseudoElement=l),e.animate(h,u)}function _r(e){return typeof e=="function"&&"applyToOptions"in e}function hh({type:e,...t}){return _r(e)&&$r()?e.applyToOptions(t):(t.duration??(t.duration=300),t.ease??(t.ease="easeOut"),t)}class Hr extends Js{constructor(t){if(super(),this.finishedTime=null,this.isStopped=!1,this.manualStartTime=null,!t)return;const{element:n,name:s,keyframes:i,pseudoElement:r,allowFlatten:o=!1,finalKeyframe:a,onComplete:c}=t;this.isPseudoElement=!!r,this.allowFlatten=o,this.options=t,Mn(typeof t.type!="string");const l=hh(t);this.animation=ch(n,s,i,l,r),l.autoplay===!1&&this.animation.pause(),this.animation.onfinish=()=>{if(this.finishedTime=this.time,!r){const h=Dn(i,this.options,a,this.speed);this.updateMotionValue&&this.updateMotionValue(h),Ir(n,s,h),this.animation.cancel()}c?.(),this.notifyFinished()}}play(){this.isStopped||(this.manualStartTime=null,this.animation.play(),this.state==="finished"&&this.updateFinished())}pause(){this.animation.pause()}complete(){this.animation.finish?.()}cancel(){try{this.animation.cancel()}catch{}}stop(){if(this.isStopped)return;this.isStopped=!0;const{state:t}=this;t==="idle"||t==="finished"||(this.updateMotionValue?this.updateMotionValue():this.commitStyles(),this.isPseudoElement||this.cancel())}commitStyles(){const t=this.options?.element;!this.isPseudoElement&&t?.isConnected&&this.animation.commitStyles?.()}get duration(){const t=this.animation.effect?.getComputedTiming?.().duration||0;return Oe(Number(t))}get iterationDuration(){const{delay:t=0}=this.options||{};return this.duration+Oe(t)}get time(){return Oe(Number(this.animation.currentTime)||0)}set time(t){const n=this.finishedTime!==null;this.manualStartTime=null,this.finishedTime=null,this.animation.currentTime=je(t),n&&this.animation.pause()}get speed(){return this.animation.playbackRate}set speed(t){t<0&&(this.finishedTime=null),this.animation.playbackRate=t}get state(){return this.finishedTime!==null?"finished":this.animation.playState}get startTime(){return this.manualStartTime??Number(this.animation.startTime)}set startTime(t){this.manualStartTime=this.animation.startTime=t}attachTimeline({timeline:t,rangeStart:n,rangeEnd:s,observe:i}){return this.allowFlatten&&this.animation.effect?.updateTiming({easing:"linear"}),this.animation.onfinish=null,t&&lh()?(this.animation.timeline=t,n&&(this.animation.rangeStart=n),s&&(this.animation.rangeEnd=s),Re):i(this)}}const Wr={anticipate:wr,backInOut:br,circInOut:vr};function dh(e){return e in Wr}function uh(e){typeof e.ease=="string"&&dh(e.ease)&&(e.ease=Wr[e.ease])}const Hn=10;class fh extends Hr{constructor(t){uh(t),Lr(t),super(t),t.startTime!==void 0&&t.autoplay!==!1&&(this.startTime=t.startTime),this.options=t}updateMotionValue(t){const{motionValue:n,onUpdate:s,onComplete:i,element:r,...o}=this.options;if(!n)return;if(t!==void 0){n.set(t);return}const a=new kn({...o,autoplay:!1}),c=Math.max(Hn,ye.now()-this.startTime),l=We(0,Hn,c-Hn),h=a.sample(c).value,{name:f}=this.options;r&&f&&Ir(r,f,h),n.setWithVelocity(a.sample(Math.max(0,c-l)).value,h,l),a.stop()}}const Vi=(e,t)=>t==="zIndex"?!1:!!(typeof e=="number"||Array.isArray(e)||typeof e=="string"&&(Ie.test(e)||e==="0")&&!e.startsWith("url("));function ph(e){const t=e[0];if(e.length===1)return!0;for(let n=0;n<e.length;n++)if(e[n]!==t)return!0}function mh(e,t,n,s){const i=e[0];if(i===null)return!1;if(t==="display"||t==="visibility")return!0;const r=e[e.length-1],o=Vi(i,t),a=Vi(r,t);return!o||!a?!1:ph(e)||(n==="spring"||_r(n))&&s}function xs(e){e.duration=0,e.type="keyframes"}const zr=new Set(["opacity","clipPath","filter","transform","backgroundColor"]),gh=/^(?:oklch|oklab|lab|lch|color|color-mix|light-dark)\(/;function yh(e){for(let t=0;t<e.length;t++)if(typeof e[t]=="string"&&gh.test(e[t]))return!0;return!1}const bh=new Set(["color","backgroundColor","outlineColor","fill","stroke","borderColor","borderTopColor","borderRightColor","borderBottomColor","borderLeftColor"]),wh=ur(()=>Object.hasOwnProperty.call(Element.prototype,"animate"));function xh(e){const{motionValue:t,name:n,repeatDelay:s,repeatType:i,damping:r,type:o,keyframes:a}=e,c=t?.owner?.current;if(!(c instanceof HTMLElement)&&!(c instanceof SVGElement))return!1;const{onUpdate:l,transformTemplate:h}=t.owner.getProps();return wh()&&n&&(zr.has(n)||bh.has(n)&&yh(a))&&(n!=="transform"||!h)&&!l&&!s&&i!=="mirror"&&r!==0&&o!=="inertia"}const vh=40;class kh extends Js{constructor({autoplay:t=!0,delay:n=0,type:s="keyframes",repeat:i=0,repeatDelay:r=0,repeatType:o="loop",keyframes:a,name:c,motionValue:l,element:h,...f}){super(),this.stop=()=>{this._animation&&(this._animation.stop(),this.stopTimeline?.()),this.keyframeResolver?.cancel()},this.createdAt=ye.now();const u={autoplay:t,delay:n,type:s,repeat:i,repeatDelay:r,repeatType:o,name:c,motionValue:l,element:h,...f},g=h?.KeyframeResolver||ei;this.keyframeResolver=new g(a,(y,x,p)=>this.onKeyframesResolved(y,x,u,!p),c,l,h),this.keyframeResolver?.scheduleResolve()}onKeyframesResolved(t,n,s,i){this.keyframeResolver=void 0;const{name:r,type:o,velocity:a,delay:c,isHandoff:l,onUpdate:h}=s;this.resolvedAt=ye.now();let f=!0;mh(t,r,o,a)||(f=!1,(Qe.instantAnimations||!c)&&h?.(Dn(t,s,n)),t[0]=t[t.length-1],xs(s),s.repeat=0);const g={startTime:i?this.resolvedAt?this.resolvedAt-this.createdAt>vh?this.resolvedAt:this.createdAt:this.createdAt:void 0,finalKeyframe:n,...s,keyframes:t},y=f&&!l&&xh(g),x=g.motionValue?.owner?.current;let p;if(y)try{p=new fh({...g,element:x})}catch{p=new kn(g)}else p=new kn(g);p.finished.then(()=>{this.notifyFinished()}).catch(Re),this.pendingTimeline&&(this.stopTimeline=p.attachTimeline(this.pendingTimeline),this.pendingTimeline=void 0),this._animation=p}get finished(){return this._animation?this.animation.finished:this._finished}then(t,n){return this.finished.finally(t).then(()=>{})}get animation(){return this._animation||(this.keyframeResolver?.resume(),oh()),this._animation}get duration(){return this.animation.duration}get iterationDuration(){return this.animation.iterationDuration}get time(){return this.animation.time}set time(t){this.animation.time=t}get speed(){return this.animation.speed}get state(){return this.animation.state}set speed(t){this.animation.speed=t}get startTime(){return this.animation.startTime}attachTimeline(t){return this._animation?this.stopTimeline=this.animation.attachTimeline(t):this.pendingTimeline=t,()=>this.stop()}play(){this.animation.play()}pause(){this.animation.pause()}complete(){this.animation.complete()}cancel(){this._animation&&this.animation.cancel(),this.keyframeResolver?.cancel()}}function Gr(e,t,n,s=0,i=1){const r=Array.from(e).sort((l,h)=>l.sortNodePosition(h)).indexOf(t),o=e.size,a=(o-1)*s;return typeof n=="function"?n(r,o):i===1?r*s:a-r*s}const Ii=30,Th=e=>!isNaN(parseFloat(e));class Sh{constructor(t,n={}){this.canTrackVelocity=null,this.events={},this.updateAndNotify=s=>{const i=ye.now();if(this.updatedAt!==i&&this.setPrevFrameValue(),this.prev=this.current,this.setCurrent(s),this.current!==this.prev&&(this.events.change?.notify(this.current),this.dependents))for(const r of this.dependents)r.dirty()},this.hasAnimated=!1,this.setCurrent(t),this.owner=n.owner}setCurrent(t){this.current=t,this.updatedAt=ye.now(),this.canTrackVelocity===null&&t!==void 0&&(this.canTrackVelocity=Th(this.current))}setPrevFrameValue(t=this.current){this.prevFrameValue=t,this.prevUpdatedAt=this.updatedAt}onChange(t){return this.on("change",t)}on(t,n){this.events[t]||(this.events[t]=new zs);const s=this.events[t].add(n);return t==="change"?()=>{s(),ee.read(()=>{this.events.change.getSize()||this.stop()})}:s}clearListeners(){for(const t in this.events)this.events[t].clear()}attach(t,n){this.passiveEffect=t,this.stopPassiveEffect=n}set(t){this.passiveEffect?this.passiveEffect(t,this.updateAndNotify):this.updateAndNotify(t)}setWithVelocity(t,n,s){this.set(n),this.prev=void 0,this.prevFrameValue=t,this.prevUpdatedAt=this.updatedAt-s}jump(t,n=!0){this.updateAndNotify(t),this.prev=t,this.prevUpdatedAt=this.prevFrameValue=void 0,n&&this.stop(),this.stopPassiveEffect&&this.stopPassiveEffect()}dirty(){this.events.change?.notify(this.current)}addDependent(t){this.dependents||(this.dependents=new Set),this.dependents.add(t)}removeDependent(t){this.dependents&&this.dependents.delete(t)}get(){return this.current}getPrevious(){return this.prev}getVelocity(){const t=ye.now();if(!this.canTrackVelocity||this.prevFrameValue===void 0||t-this.updatedAt>Ii)return 0;const n=Math.min(this.updatedAt-this.prevUpdatedAt,Ii);return fr(parseFloat(this.current)-parseFloat(this.prevFrameValue),n)}start(t){return this.stop(),new Promise(n=>{this.hasAnimated=!0,this.animation=t(n),this.events.animationStart&&this.events.animationStart.notify()}).then(()=>{this.events.animationComplete&&this.events.animationComplete.notify(),this.clearAnimation()})}stop(){this.animation&&(this.animation.stop(),this.events.animationCancel&&this.events.animationCancel.notify()),this.clearAnimation()}isAnimating(){return!!this.animation}clearAnimation(){delete this.animation}destroy(){this.dependents?.clear(),this.events.destroy?.notify(),this.clearListeners(),this.stop(),this.stopPassiveEffect&&this.stopPassiveEffect()}}function yt(e,t){return new Sh(e,t)}function Ur(e,t){if(e?.inherit&&t){const{inherit:n,...s}=e;return{...t,...s}}return e}function ti(e,t){const n=e?.[t]??e?.default??e;return n!==e?Ur(n,e):n}const Ch={type:"spring",stiffness:500,damping:25,restSpeed:10},Ah=e=>({type:"spring",stiffness:550,damping:e===0?2*Math.sqrt(550):30,restSpeed:10}),Ph={type:"keyframes",duration:.8},Eh={type:"keyframes",ease:[.25,.1,.35,1],duration:.3},Mh=(e,{keyframes:t})=>t.length>2?Ph:xt.has(e)?e.startsWith("scale")?Ah(t[1]):Ch:Eh,Dh=new Set(["when","delay","delayChildren","staggerChildren","staggerDirection","repeat","repeatType","repeatDelay","from","elapsed"]);function Oh(e){for(const t in e)if(!Dh.has(t))return!0;return!1}const ni=(e,t,n,s={},i,r)=>o=>{const a=ti(s,e)||{},c=a.delay||s.delay||0;let{elapsed:l=0}=s;l=l-je(c);const h={keyframes:Array.isArray(n)?n:[null,n],ease:"easeOut",velocity:t.getVelocity(),...a,delay:-l,onUpdate:u=>{t.set(u),a.onUpdate&&a.onUpdate(u)},onComplete:()=>{o(),a.onComplete&&a.onComplete()},name:e,motionValue:t,element:r?void 0:i};Oh(a)||Object.assign(h,Mh(e,h)),h.duration&&(h.duration=je(h.duration)),h.repeatDelay&&(h.repeatDelay=je(h.repeatDelay)),h.from!==void 0&&(h.keyframes[0]=h.from);let f=!1;if((h.type===!1||h.duration===0&&!h.repeatDelay)&&(xs(h),h.delay===0&&(f=!0)),(Qe.instantAnimations||Qe.skipAnimations||i?.shouldSkipAnimations||a.skipAnimations)&&(f=!0,xs(h),h.delay=0),h.allowFlatten=!a.type&&!a.ease,f&&!r&&t.get()!==void 0){const u=Dn(h.keyframes,a);if(u!==void 0){ee.update(()=>{h.onUpdate(u),h.onComplete()});return}}return a.isSync?new kn(h):new kh(h)},Rh=/^var\(--(?:([\w-]+)|([\w-]+), ?([a-zA-Z\d ()%#.,-]+))\)/u;function jh(e){const t=Rh.exec(e);if(!t)return[,];const[,n,s,i]=t;return[`--${n??s}`,i]}function Kr(e,t,n=1){const[s,i]=jh(e);if(!s)return;const r=window.getComputedStyle(t).getPropertyValue(s);if(r){const o=r.trim();return cr(o)?parseFloat(o):o}return Ks(i)?Kr(i,t,n+1):i}function Bi(e){const t=[{},{}];return e?.values.forEach((n,s)=>{t[0][s]=n.get(),t[1][s]=n.getVelocity()}),t}function si(e,t,n,s){if(typeof t=="function"){const[i,r]=Bi(s);t=t(n!==void 0?n:e.custom,i,r)}if(typeof t=="string"&&(t=e.variants&&e.variants[t]),typeof t=="function"){const[i,r]=Bi(s);t=t(n!==void 0?n:e.custom,i,r)}return t}function it(e,t,n){const s=e.getProps();return si(s,t,n!==void 0?n:s.custom,e)}const Qr=new Set(["width","height","top","left","right","bottom",...wt]),vs=e=>Array.isArray(e);function Lh(e,t,n){e.hasValue(t)?e.getValue(t).set(n):e.addValue(t,yt(n))}function Nh(e){return vs(e)?e[e.length-1]||0:e}function Vh(e,t){const n=it(e,t);let{transitionEnd:s={},transition:i={},...r}=n||{};r={...r,...s};for(const o in r){const a=Nh(r[o]);Lh(e,o,a)}}const me=e=>!!(e&&e.getVelocity);function Ih(e){return!!(me(e)&&e.add)}function ks(e,t){const n=e.getValue("willChange");if(Ih(n))return n.add(t);if(!n&&Qe.WillChange){const s=new Qe.WillChange("auto");e.addValue("willChange",s),s.add(t)}}function ii(e){return e.replace(/([A-Z])/g,t=>`-${t.toLowerCase()}`)}const Bh="framerAppearId",qr="data-"+ii(Bh);function Yr(e){return e.props[qr]}const $h=typeof window<"u";function Fh({protectedKeys:e,needsAnimating:t},n){const s=e.hasOwnProperty(n)&&t[n]!==!0;return t[n]=!1,s}function Xr(e,t,{delay:n=0,transitionOverride:s,type:i}={}){let{transition:r,transitionEnd:o,...a}=t;const c=e.getDefaultTransition();r=r?Ur(r,c):c;const l=r?.reduceMotion,h=r?.skipAnimations;s&&(r=s);const f=[],u=i&&e.animationState&&e.animationState.getState()[i],g=r?.path;g&&g.animateVisualElement(e,a,r,n,f);for(const y in a){const x=e.getValue(y,e.latestValues[y]??null),p=a[y];if(p===void 0||u&&Fh(u,y))continue;const w={delay:n,...ti(r||{},y)};h&&(w.skipAnimations=!0);const S=x.get();if(S!==void 0&&!x.isAnimating()&&!Array.isArray(p)&&p===S&&!w.velocity){ee.update(()=>x.set(p));continue}let v=!1;if($h&&window.MotionHandoffAnimation){const A=Yr(e);if(A){const C=window.MotionHandoffAnimation(A,y,ee);C!==null&&(w.startTime=C,v=!0)}}ks(e,y);const b=l??e.shouldReduceMotion;x.start(ni(y,x,p,b&&Qr.has(y)?{type:!1}:w,e,v));const k=x.animation;k&&f.push(k)}if(o){const y=()=>ee.update(()=>{o&&Vh(e,o)});f.length?Promise.all(f).then(y):y()}return f}function Ts(e,t,n={}){const s=it(e,t,n.type==="exit"?e.presenceContext?.custom:void 0);let{transition:i=e.getDefaultTransition()||{}}=s||{};n.transitionOverride&&(i=n.transitionOverride);const r=s?()=>Promise.all(Xr(e,s,n)):()=>Promise.resolve(),o=e.variantChildren&&e.variantChildren.size?(c=0)=>{const{delayChildren:l=0,staggerChildren:h,staggerDirection:f}=i;return _h(e,t,c,l,h,f,n)}:()=>Promise.resolve(),{when:a}=i;if(a){const[c,l]=a==="beforeChildren"?[r,o]:[o,r];return c().then(()=>l())}else return Promise.all([r(),o(n.delay)])}function _h(e,t,n=0,s=0,i=0,r=1,o){const a=[];for(const c of e.variantChildren)c.notify("AnimationStart",t),a.push(Ts(c,t,{...o,delay:n+(typeof s=="function"?0:s)+Gr(e.variantChildren,c,s,i,r)}).then(()=>c.notify("AnimationComplete",t)));return Promise.all(a)}function Hh(e,t,n={}){e.notify("AnimationStart",t);let s;if(Array.isArray(t)){const i=t.map(r=>Ts(e,r,n));s=Promise.all(i)}else if(typeof t=="string")s=Ts(e,t,n);else{const i=typeof t=="function"?it(e,t,n.custom):t;s=Promise.all(Xr(e,i,n))}return s.then(()=>{e.notify("AnimationComplete",t)})}const Wh={test:e=>e==="auto",parse:e=>e},Zr=e=>t=>t.test(e),Jr=[bt,N,He,ze,fc,uc,Wh],$i=e=>Jr.find(Zr(e));function zh(e){return typeof e=="number"?e===0:e!==null?e==="none"||e==="0"||dr(e):!0}const Gh=new Set(["brightness","contrast","saturate","opacity"]);function Uh(e){const[t,n]=e.slice(0,-1).split("(");if(t==="drop-shadow")return e;const[s]=n.match(Qs)||[];if(!s)return e;const i=n.replace(s,"");let r=Gh.has(t)?1:0;return s!==n&&(r*=100),t+"("+r+i+")"}const Kh=/\b([a-z-]*)\(.*?\)/gu,Ss={...Ie,getAnimatableNone:e=>{const t=e.match(Kh);return t?t.map(Uh).join(" "):e}},Cs={...Ie,getAnimatableNone:e=>{const t=Ie.parse(e);return Ie.createTransformer(e)(t.map(s=>typeof s=="number"?0:typeof s=="object"?{...s,alpha:1}:s))}},Fi={...bt,transform:Math.round},Qh={rotate:ze,pathRotation:ze,rotateX:ze,rotateY:ze,rotateZ:ze,scale:Yt,scaleX:Yt,scaleY:Yt,scaleZ:Yt,skew:ze,skewX:ze,skewY:ze,distance:N,translateX:N,translateY:N,translateZ:N,x:N,y:N,z:N,perspective:N,transformPerspective:N,opacity:Vt,originX:Ai,originY:Ai,originZ:N},Tn={borderWidth:N,borderTopWidth:N,borderRightWidth:N,borderBottomWidth:N,borderLeftWidth:N,borderRadius:N,borderTopLeftRadius:N,borderTopRightRadius:N,borderBottomRightRadius:N,borderBottomLeftRadius:N,width:N,maxWidth:N,height:N,maxHeight:N,top:N,right:N,bottom:N,left:N,inset:N,insetBlock:N,insetBlockStart:N,insetBlockEnd:N,insetInline:N,insetInlineStart:N,insetInlineEnd:N,padding:N,paddingTop:N,paddingRight:N,paddingBottom:N,paddingLeft:N,paddingBlock:N,paddingBlockStart:N,paddingBlockEnd:N,paddingInline:N,paddingInlineStart:N,paddingInlineEnd:N,margin:N,marginTop:N,marginRight:N,marginBottom:N,marginLeft:N,marginBlock:N,marginBlockStart:N,marginBlockEnd:N,marginInline:N,marginInlineStart:N,marginInlineEnd:N,fontSize:N,backgroundPositionX:N,backgroundPositionY:N,...Qh,zIndex:Fi,fillOpacity:Vt,strokeOpacity:Vt,numOctaves:Fi},qh={...Tn,color:le,backgroundColor:le,outlineColor:le,fill:le,stroke:le,borderColor:le,borderTopColor:le,borderRightColor:le,borderBottomColor:le,borderLeftColor:le,filter:Ss,WebkitFilter:Ss,mask:Cs,WebkitMask:Cs},ea=e=>qh[e],Yh=new Set([Ss,Cs]);function ta(e,t){let n=ea(e);return Yh.has(n)||(n=Ie),n.getAnimatableNone?n.getAnimatableNone(t):void 0}const Xh=new Set(["auto","none","0"]);function Zh(e,t,n){let s=0,i;for(;s<e.length&&!i;){const r=e[s];typeof r=="string"&&!Xh.has(r)&&gt(r).values.length&&(i=e[s]),s++}if(i&&n)for(const r of t)e[r]=ta(n,i)}class Jh extends ei{constructor(t,n,s,i,r){super(t,n,s,i,r,!0)}readKeyframes(){const{unresolvedKeyframes:t,element:n,name:s}=this;if(!n||!n.current)return;super.readKeyframes();for(let h=0;h<t.length;h++){let f=t[h];if(typeof f=="string"&&(f=f.trim(),Ks(f))){const u=Kr(f,n.current);u!==void 0&&(t[h]=u),h===t.length-1&&(this.finalKeyframe=f)}}if(this.resolveNoneKeyframes(),!Qr.has(s)||t.length!==2)return;const[i,r]=t,o=$i(i),a=$i(r),c=Ci(i),l=Ci(r);if(c!==l&&Ke[s]){this.needsMeasurement=!0;return}if(o!==a)if(Li(o)&&Li(a))for(let h=0;h<t.length;h++){const f=t[h];typeof f=="string"&&(t[h]=parseFloat(f))}else Ke[s]&&(this.needsMeasurement=!0)}resolveNoneKeyframes(){const{unresolvedKeyframes:t,name:n}=this,s=[];for(let i=0;i<t.length;i++)(t[i]===null||zh(t[i]))&&s.push(i);s.length&&Zh(t,s,n)}measureInitialState(){const{element:t,unresolvedKeyframes:n,name:s}=this;if(!t||!t.current)return;s==="height"&&(this.suspendedScrollY=window.pageYOffset),this.measuredOrigin=Ke[s](t.measureViewportBox(),window.getComputedStyle(t.current)),n[0]=this.measuredOrigin;const i=n[n.length-1];i!==void 0&&t.getValue(s,i).jump(i,!1)}measureEndState(){const{element:t,name:n,unresolvedKeyframes:s}=this;if(!t||!t.current)return;const i=t.getValue(n);i&&i.jump(this.measuredOrigin,!1);const r=s.length-1,o=s[r];s[r]=Ke[n](t.measureViewportBox(),window.getComputedStyle(t.current)),o!==null&&this.finalKeyframe===void 0&&(this.finalKeyframe=o),this.removedTransforms?.length&&this.removedTransforms.forEach(([a,c])=>{t.getValue(a).set(c)}),this.resolveNoneKeyframes()}}const oi=["borderTopLeftRadius","borderTopRightRadius","borderBottomRightRadius","borderBottomLeftRadius"];function na(e,t,n){if(e==null)return[];if(e instanceof EventTarget)return[e];if(typeof e=="string"){let s=document;const i=n?.[e]??s.querySelectorAll(e);return i?Array.from(i):[]}return Array.from(e).filter(s=>s!=null)}const As=(e,t)=>t&&typeof e=="number"?t.transform(e):e;function cn(e){return hr(e)&&"offsetHeight"in e&&!("ownerSVGElement"in e)}const{schedule:ri}=Sr(queueMicrotask,!1),Ve={x:!1,y:!1};function sa(){return Ve.x||Ve.y}function ed(e){return e==="x"||e==="y"?Ve[e]?null:(Ve[e]=!0,()=>{Ve[e]=!1}):Ve.x||Ve.y?null:(Ve.x=Ve.y=!0,()=>{Ve.x=Ve.y=!1})}function ia(e,t){const n=na(e),s=new AbortController,i={passive:!0,...t,signal:s.signal};return[n,i,()=>s.abort()]}function td(e){return!(e.pointerType==="touch"||sa())}function nd(e,t,n={}){const[s,i,r]=ia(e,n);return s.forEach(o=>{let a=!1,c=!1,l;const h=()=>{o.removeEventListener("pointerleave",y)},f=p=>{l&&(l(p),l=void 0),h()},u=p=>{a=!1,window.removeEventListener("pointerup",u),window.removeEventListener("pointercancel",u),c&&(c=!1,f(p))},g=()=>{a=!0,window.addEventListener("pointerup",u,i),window.addEventListener("pointercancel",u,i)},y=p=>{if(p.pointerType!=="touch"){if(a){c=!0;return}f(p)}},x=p=>{if(!td(p))return;c=!1;const w=t(o,p);typeof w=="function"&&(l=w,o.addEventListener("pointerleave",y,i))};o.addEventListener("pointerenter",x,i),o.addEventListener("pointerdown",g,i)}),r}const oa=(e,t)=>t?e===t?!0:oa(e,t.parentElement):!1,ai=e=>e.pointerType==="mouse"?typeof e.button!="number"||e.button<=0:e.isPrimary!==!1,sd=new Set(["BUTTON","INPUT","SELECT","TEXTAREA","A"]);function id(e){return sd.has(e.tagName)||e.isContentEditable===!0}const od=new Set(["INPUT","SELECT","TEXTAREA"]);function rd(e){return od.has(e.tagName)||e.isContentEditable===!0}const hn=new WeakSet;function _i(e){return t=>{t.key==="Enter"&&e(t)}}function Wn(e,t){e.dispatchEvent(new PointerEvent("pointer"+t,{isPrimary:!0,bubbles:!0}))}const ad=(e,t)=>{const n=e.currentTarget;if(!n)return;const s=_i(()=>{if(hn.has(n))return;Wn(n,"down");const i=_i(()=>{Wn(n,"up")}),r=()=>Wn(n,"cancel");n.addEventListener("keyup",i,t),n.addEventListener("blur",r,t)});n.addEventListener("keydown",s,t),n.addEventListener("blur",()=>n.removeEventListener("keydown",s),t)};function Hi(e){return ai(e)&&!sa()}const Wi=new WeakSet;function ld(e,t,n={}){const[s,i,r]=ia(e,n),o=a=>{const c=a.currentTarget;if(!Hi(a)||Wi.has(a))return;hn.add(c),n.stopPropagation&&Wi.add(a);const l=t(c,a),h={...i,capture:!0},f=(y,x)=>{window.removeEventListener("pointerup",u,h),window.removeEventListener("pointercancel",g,h),hn.has(c)&&hn.delete(c),Hi(y)&&typeof l=="function"&&l(y,{success:x})},u=y=>{f(y,c===window||c===document||n.useGlobalTarget||oa(c,y.target))},g=y=>{f(y,!1)};window.addEventListener("pointerup",u,h),window.addEventListener("pointercancel",g,h)};return s.forEach(a=>{(n.useGlobalTarget?window:a).addEventListener("pointerdown",o,i),cn(a)&&(a.addEventListener("focus",l=>ad(l,i)),!id(a)&&!a.hasAttribute("tabindex")&&(a.tabIndex=0))}),r}function li(e){return hr(e)&&"ownerSVGElement"in e}const dn=new WeakMap;let un;const ra=(e,t,n)=>(s,i)=>i&&i[0]?i[0][e+"Size"]:li(s)&&"getBBox"in s?s.getBBox()[t]:s[n],cd=ra("inline","width","offsetWidth"),hd=ra("block","height","offsetHeight");function dd({target:e,borderBoxSize:t}){dn.get(e)?.forEach(n=>{n(e,{get width(){return cd(e,t)},get height(){return hd(e,t)}})})}function ud(e){e.forEach(dd)}function fd(){typeof ResizeObserver>"u"||(un=new ResizeObserver(ud))}function pd(e,t){un||fd();const n=na(e);return n.forEach(s=>{let i=dn.get(s);i||(i=new Set,dn.set(s,i)),i.add(t),un?.observe(s)}),()=>{n.forEach(s=>{const i=dn.get(s);i?.delete(t),i?.size||un?.unobserve(s)})}}const fn=new Set;let pt;function md(){pt=()=>{const e={get width(){return window.innerWidth},get height(){return window.innerHeight}};fn.forEach(t=>t(e))},window.addEventListener("resize",pt)}function gd(e){return fn.add(e),pt||md(),()=>{fn.delete(e),!fn.size&&typeof pt=="function"&&(window.removeEventListener("resize",pt),pt=void 0)}}function zi(e,t){return typeof e=="function"?gd(e):pd(e,t)}function yd(e){return li(e)&&e.tagName==="svg"}const bd=[...Jr,le,Ie],wd=e=>bd.find(Zr(e)),Gi=()=>({translate:0,scale:1,origin:0,originPoint:0}),mt=()=>({x:Gi(),y:Gi()}),Ui=()=>({min:0,max:0}),de=()=>({x:Ui(),y:Ui()}),xd=new WeakMap;function On(e){return e!==null&&typeof e=="object"&&typeof e.start=="function"}function It(e){return typeof e=="string"||Array.isArray(e)}const ci=["animate","whileInView","whileFocus","whileHover","whileTap","whileDrag","exit"],hi=["initial",...ci];function Rn(e){return On(e.animate)||hi.some(t=>It(e[t]))}function aa(e){return!!(Rn(e)||e.variants)}function vd(e,t,n){for(const s in t){const i=t[s],r=n[s];if(me(i))e.addValue(s,i);else if(me(r))e.addValue(s,yt(i,{owner:e}));else if(r!==i)if(e.hasValue(s)){const o=e.getValue(s);o.liveStyle===!0?o.jump(i):o.hasAnimated||o.set(i)}else{const o=e.getStaticValue(s);e.addValue(s,yt(o!==void 0?o:i,{owner:e}))}}for(const s in n)t[s]===void 0&&e.removeValue(s);return t}const Ps={current:null},la={current:!1},kd=typeof window<"u";function Td(){if(la.current=!0,!!kd)if(window.matchMedia){const e=window.matchMedia("(prefers-reduced-motion)"),t=()=>Ps.current=e.matches;e.addEventListener("change",t),t()}else Ps.current=!1}const Ki=["AnimationStart","AnimationComplete","Update","BeforeLayoutMeasure","LayoutMeasure","LayoutAnimationStart","LayoutAnimationComplete"];let Sn={};function ca(e){Sn=e}function Sd(){return Sn}class Cd{scrapeMotionValuesFromProps(t,n,s){return{}}constructor({parent:t,props:n,presenceContext:s,reducedMotionConfig:i,skipAnimations:r,blockInitialAnimation:o,visualState:a},c={}){this.current=null,this.children=new Set,this.isVariantNode=!1,this.isControllingVariants=!1,this.shouldReduceMotion=null,this.shouldSkipAnimations=!1,this.values=new Map,this.KeyframeResolver=ei,this.features={},this.valueSubscriptions=new Map,this.prevMotionValues={},this.hasBeenMounted=!1,this.events={},this.propEventSubscriptions={},this.notifyUpdate=()=>this.notify("Update",this.latestValues),this.render=()=>{this.current&&(this.triggerBuild(),this.renderInstance(this.current,this.renderState,this.props.style,this.projection))},this.renderScheduledAt=0,this.scheduleRender=()=>{const g=ye.now();this.renderScheduledAt<g&&(this.renderScheduledAt=g,ee.render(this.render,!1,!0))};const{latestValues:l,renderState:h}=a;this.latestValues=l,this.baseTarget={...l},this.initialValues=n.initial?{...l}:{},this.renderState=h,this.parent=t,this.props=n,this.presenceContext=s,this.depth=t?t.depth+1:0,this.reducedMotionConfig=i,this.skipAnimationsConfig=r,this.options=c,this.blockInitialAnimation=!!o,this.isControllingVariants=Rn(n),this.isVariantNode=aa(n),this.isVariantNode&&(this.variantChildren=new Set),this.manuallyAnimateOnMount=!!(t&&t.current);const{willChange:f,...u}=this.scrapeMotionValuesFromProps(n,{},this);for(const g in u){const y=u[g];l[g]!==void 0&&me(y)&&y.set(l[g])}}mount(t){if(this.hasBeenMounted)for(const n in this.initialValues)this.values.get(n)?.jump(this.initialValues[n]),this.latestValues[n]=this.initialValues[n];this.current=t,xd.set(t,this),this.projection&&!this.projection.instance&&this.projection.mount(t),this.parent&&this.isVariantNode&&!this.isControllingVariants&&(this.removeFromVariantTree=this.parent.addVariantChild(this)),this.values.forEach((n,s)=>this.bindToMotionValue(s,n)),this.reducedMotionConfig==="never"?this.shouldReduceMotion=!1:this.reducedMotionConfig==="always"?this.shouldReduceMotion=!0:(la.current||Td(),this.shouldReduceMotion=Ps.current),this.shouldSkipAnimations=this.skipAnimationsConfig??!1,this.parent?.addChild(this),this.update(this.props,this.presenceContext),this.hasBeenMounted=!0}unmount(){this.projection&&this.projection.unmount(),qe(this.notifyUpdate),qe(this.render),this.valueSubscriptions.forEach(t=>t()),this.valueSubscriptions.clear(),this.removeFromVariantTree&&this.removeFromVariantTree(),this.parent?.removeChild(this);for(const t in this.events)this.events[t].clear();for(const t in this.features){const n=this.features[t];n&&(n.unmount(),n.isMounted=!1)}this.current=null}addChild(t){this.children.add(t),this.enteringChildren??(this.enteringChildren=new Set),this.enteringChildren.add(t)}removeChild(t){this.children.delete(t),this.enteringChildren&&this.enteringChildren.delete(t)}bindToMotionValue(t,n){if(this.valueSubscriptions.has(t)&&this.valueSubscriptions.get(t)(),n.accelerate&&zr.has(t)&&this.current instanceof HTMLElement){const{factory:o,keyframes:a,times:c,ease:l,duration:h}=n.accelerate,f=new Hr({element:this.current,name:t,keyframes:a,times:c,ease:l,duration:je(h)}),u=o(f);this.valueSubscriptions.set(t,()=>{u(),f.cancel()});return}const s=xt.has(t);s&&this.onBindTransform&&this.onBindTransform();const i=n.on("change",o=>{this.latestValues[t]=o,this.props.onUpdate&&ee.preRender(this.notifyUpdate),s&&this.projection&&(this.projection.isTransformDirty=!0),this.scheduleRender()});let r;typeof window<"u"&&window.MotionCheckAppearSync&&(r=window.MotionCheckAppearSync(this,t,n)),this.valueSubscriptions.set(t,()=>{i(),r&&r()})}sortNodePosition(t){return!this.current||!this.sortInstanceNodePosition||this.type!==t.type?0:this.sortInstanceNodePosition(this.current,t.current)}updateFeatures(){let t="animation";for(t in Sn){const n=Sn[t];if(!n)continue;const{isEnabled:s,Feature:i}=n;if(!this.features[t]&&i&&s(this.props)&&(this.features[t]=new i(this)),this.features[t]){const r=this.features[t];r.isMounted?r.update():(r.mount(),r.isMounted=!0)}}}triggerBuild(){this.build(this.renderState,this.latestValues,this.props)}measureViewportBox(){return this.current?this.measureInstanceViewportBox(this.current,this.props):de()}getStaticValue(t){return this.latestValues[t]}setStaticValue(t,n){this.latestValues[t]=n}update(t,n){(t.transformTemplate||this.props.transformTemplate)&&this.scheduleRender(),this.prevProps=this.props,this.props=t,this.prevPresenceContext=this.presenceContext,this.presenceContext=n;for(let s=0;s<Ki.length;s++){const i=Ki[s];this.propEventSubscriptions[i]&&(this.propEventSubscriptions[i](),delete this.propEventSubscriptions[i]);const r="on"+i,o=t[r];o&&(this.propEventSubscriptions[i]=this.on(i,o))}this.prevMotionValues=vd(this,this.scrapeMotionValuesFromProps(t,this.prevProps||{},this),this.prevMotionValues),this.handleChildMotionValue&&this.handleChildMotionValue()}getProps(){return this.props}getVariant(t){return this.props.variants?this.props.variants[t]:void 0}getDefaultTransition(){return this.props.transition}getTransformPagePoint(){return this.props.transformPagePoint}getClosestVariantNode(){return this.isVariantNode?this:this.parent?this.parent.getClosestVariantNode():void 0}addVariantChild(t){const n=this.getClosestVariantNode();if(n)return n.variantChildren&&n.variantChildren.add(t),()=>n.variantChildren.delete(t)}addValue(t,n){const s=this.values.get(t);n!==s&&(s&&this.removeValue(t),this.bindToMotionValue(t,n),this.values.set(t,n),this.latestValues[t]=n.get())}removeValue(t){this.values.delete(t);const n=this.valueSubscriptions.get(t);n&&(n(),this.valueSubscriptions.delete(t)),delete this.latestValues[t],this.removeValueFromRenderState(t,this.renderState)}hasValue(t){return this.values.has(t)}getValue(t,n){if(this.props.values&&this.props.values[t])return this.props.values[t];let s=this.values.get(t);return s===void 0&&n!==void 0&&(s=yt(n===null?void 0:n,{owner:this}),this.addValue(t,s)),s}readValue(t,n){let s=this.latestValues[t]!==void 0||!this.current?this.latestValues[t]:this.getBaseTargetFromProps(this.props,t)??this.readValueFromInstance(this.current,t,this.options);return s!=null&&(typeof s=="string"&&(cr(s)||dr(s))?s=parseFloat(s):!wd(s)&&Ie.test(n)&&(s=ta(t,n)),this.setBaseTarget(t,me(s)?s.get():s)),me(s)?s.get():s}setBaseTarget(t,n){this.baseTarget[t]=n}getBaseTarget(t){const{initial:n}=this.props;let s;if(typeof n=="string"||typeof n=="object"){const r=si(this.props,n,this.presenceContext?.custom);r&&(s=r[t])}if(n&&s!==void 0)return s;const i=this.getBaseTargetFromProps(this.props,t);return i!==void 0&&!me(i)?i:this.initialValues[t]!==void 0&&s===void 0?void 0:this.baseTarget[t]}on(t,n){return this.events[t]||(this.events[t]=new zs),this.events[t].add(n)}notify(t,...n){this.events[t]&&this.events[t].notify(...n)}scheduleRenderMicrotask(){ri.render(this.render)}}class ha extends Cd{constructor(){super(...arguments),this.KeyframeResolver=Jh}sortInstanceNodePosition(t,n){return t.compareDocumentPosition(n)&2?1:-1}getBaseTargetFromProps(t,n){const s=t.style;return s?s[n]:void 0}removeValueFromRenderState(t,{vars:n,style:s}){delete n[t],delete s[t]}handleChildMotionValue(){this.childSubscription&&(this.childSubscription(),delete this.childSubscription);const{children:t}=this.props;me(t)&&(this.childSubscription=t.on("change",n=>{this.current&&(this.current.textContent=`${n}`)}))}}class Ye{constructor(t){this.isMounted=!1,this.node=t}update(){}}function da({top:e,left:t,right:n,bottom:s}){return{x:{min:t,max:n},y:{min:e,max:s}}}function Ad({x:e,y:t}){return{top:t.min,right:e.max,bottom:t.max,left:e.min}}function Pd(e,t){if(!t)return e;const n=t({x:e.left,y:e.top}),s=t({x:e.right,y:e.bottom});return{top:n.y,left:n.x,bottom:s.y,right:s.x}}function zn(e){return e===void 0||e===1}function Es({scale:e,scaleX:t,scaleY:n}){return!zn(e)||!zn(t)||!zn(n)}function et(e){return Es(e)||ua(e)||e.z||e.rotate||e.rotateX||e.rotateY||e.skewX||e.skewY}function ua(e){return Qi(e.x)||Qi(e.y)}function Qi(e){return e&&e!=="0%"}function Cn(e,t,n){const s=e-n,i=t*s;return n+i}function qi(e,t,n,s,i){return i!==void 0&&(e=Cn(e,i,s)),Cn(e,n,s)+t}function Ms(e,t=0,n=1,s,i){e.min=qi(e.min,t,n,s,i),e.max=qi(e.max,t,n,s,i)}function fa(e,{x:t,y:n}){Ms(e.x,t.translate,t.scale,t.originPoint),Ms(e.y,n.translate,n.scale,n.originPoint)}const Yi=.999999999999,Xi=1.0000000000001;function Ed(e,t,n,s=!1){const i=n.length;if(!i)return;t.x=t.y=1;let r,o;for(let a=0;a<i;a++){r=n[a],o=r.projectionDelta;const{visualElement:c}=r.options;c&&c.props.style&&c.props.style.display==="contents"||(s&&r.options.layoutScroll&&r.scroll&&r!==r.root&&(Fe(e.x,-r.scroll.offset.x),Fe(e.y,-r.scroll.offset.y)),o&&(t.x*=o.x.scale,t.y*=o.y.scale,fa(e,o)),s&&et(r.latestValues)&&pn(e,r.latestValues,r.layout?.layoutBox))}t.x<Xi&&t.x>Yi&&(t.x=1),t.y<Xi&&t.y>Yi&&(t.y=1)}function Fe(e,t){e.min+=t,e.max+=t}function Zi(e,t,n,s,i=.5){const r=J(e.min,e.max,i);Ms(e,t,n,r,s)}function Ji(e,t){return typeof e=="string"?parseFloat(e)/100*(t.max-t.min):e}function pn(e,t,n){const s=n??e;Zi(e.x,Ji(t.x,s.x),t.scaleX,t.scale,t.originX),Zi(e.y,Ji(t.y,s.y),t.scaleY,t.scale,t.originY)}function pa(e,t){return da(Pd(e.getBoundingClientRect(),t))}function Md(e,t,n){const s=pa(e,n),{scroll:i}=t;return i&&(Fe(s.x,i.offset.x),Fe(s.y,i.offset.y)),s}const Dd={x:"translateX",y:"translateY",z:"translateZ",transformPerspective:"perspective"},Od=wt.length;function Rd(e,t,n){let s="",i=!0;for(let o=0;o<Od;o++){const a=wt[o],c=e[a];if(c===void 0)continue;let l=!0;if(typeof c=="number")l=c===(a.startsWith("scale")?1:0);else{const h=parseFloat(c);l=a.startsWith("scale")?h===1:h===0}if(!l||n){const h=As(c,Tn[a]);if(!l){i=!1;const f=Dd[a]||a;s+=`${f}(${h}) `}n&&(t[a]=h)}}const r=e.pathRotation;return r&&(i=!1,s+=`rotate(${As(r,Tn.pathRotation)}) `),s=s.trim(),n?s=n(t,i?"":s):i&&(s="none"),s}function di(e,t,n){const{style:s,vars:i,transformOrigin:r}=e;let o=!1,a=!1;for(const c in t){const l=t[c];if(xt.has(c)){o=!0;continue}else if(Ar(c)){i[c]=l;continue}else{const h=As(l,Tn[c]);c.startsWith("origin")?(a=!0,r[c]=h):s[c]=h}}if(t.transform||(o||n?s.transform=Rd(t,e.transform,n):s.transform&&(s.transform="none")),a){const{originX:c="50%",originY:l="50%",originZ:h=0}=r;s.transformOrigin=`${c} ${l} ${h}`}}function ma(e,{style:t,vars:n},s,i){const r=e.style;let o;for(o in t)r[o]=t[o];i?.applyProjectionStyles(r,s);for(o in n)r.setProperty(o,n[o])}function eo(e,t){return t.max===t.min?0:e/(t.max-t.min)*100}const kt={correct:(e,t)=>{if(!t.target)return e;if(typeof e=="string")if(N.test(e))e=parseFloat(e);else return e;const n=eo(e,t.target.x),s=eo(e,t.target.y);return`${n}% ${s}%`}},jd={correct:(e,{treeScale:t,projectionDelta:n})=>{const s=e,i=Ie.parse(e);if(i.length>5)return s;const r=Ie.createTransformer(e),o=typeof i[0]!="number"?1:0,a=n.x.scale*t.x,c=n.y.scale*t.y;i[0+o]/=a,i[1+o]/=c;const l=J(a,c,.5);return typeof i[2+o]=="number"&&(i[2+o]/=l),typeof i[3+o]=="number"&&(i[3+o]/=l),r(i)}},Ds={borderRadius:{...kt,applyTo:[...oi]},borderTopLeftRadius:kt,borderTopRightRadius:kt,borderBottomLeftRadius:kt,borderBottomRightRadius:kt,boxShadow:jd};function ga(e,{layout:t,layoutId:n}){return xt.has(e)||e.startsWith("origin")||(t||n!==void 0)&&(!!Ds[e]||e==="opacity")}function ui(e,t,n){const s=e.style,i=t?.style,r={};if(!s)return r;for(const o in s)(me(s[o])||i&&me(i[o])||ga(o,e)||n?.getValue(o)?.liveStyle!==void 0)&&(r[o]=s[o]);return r}function Ld(e){return window.getComputedStyle(e)}class Nd extends ha{constructor(){super(...arguments),this.type="html",this.renderInstance=ma}mount(t){Mn(!!t.style),super.mount(t)}readValueFromInstance(t,n){if(xt.has(n))return this.projection?.isProjecting?ms(n):eh(t,n);{const s=Ld(t),i=(Ar(n)?s.getPropertyValue(n):s[n])||0;return typeof i=="string"?i.trim():i}}measureInstanceViewportBox(t,{transformPagePoint:n}){return pa(t,n)}build(t,n,s){di(t,n,s.transformTemplate)}scrapeMotionValuesFromProps(t,n,s){return ui(t,n,s)}}const Vd={offset:"stroke-dashoffset",array:"stroke-dasharray"},Id={offset:"strokeDashoffset",array:"strokeDasharray"};function Bd(e,t,n=1,s=0,i=!0){e.pathLength=1;const r=i?Vd:Id;e[r.offset]=`${-s}`,e[r.array]=`${t} ${n}`}const ya=["transform","opacity","offsetDistance","offsetPath","offsetRotate","offsetAnchor"];function ba(e,{attrX:t,attrY:n,attrScale:s,pathLength:i,pathSpacing:r=1,pathOffset:o=0,...a},c,l,h){if(di(e,a,l),c){e.style.viewBox&&(e.attrs.viewBox=e.style.viewBox);return}e.attrs=e.style,e.style={};const{attrs:f,style:u}=e;for(const g of ya)f[g]!==void 0&&(u[g]=f[g],delete f[g]);(u.transform||f.transformOrigin)&&(u.transformOrigin=f.transformOrigin??"50% 50%",delete f.transformOrigin),u.transform&&(u.transformBox=h?.transformBox??"fill-box",delete f.transformBox),t!==void 0&&(f.x=t),n!==void 0&&(f.y=n),s!==void 0&&(f.scale=s),i!==void 0&&Bd(f,i,r,o,!1)}const wa=new Set(["baseFrequency","diffuseConstant","kernelMatrix","kernelUnitLength","keySplines","keyTimes","limitingConeAngle","markerHeight","markerWidth","numOctaves","targetX","targetY","surfaceScale","specularConstant","specularExponent","stdDeviation","tableValues","viewBox","gradientTransform","pathLength","startOffset","textLength","lengthAdjust"]),xa=e=>typeof e=="string"&&e.toLowerCase()==="svg";function $d(e,t,n,s){ma(e,t,void 0,s);for(const i in t.attrs)e.setAttribute(wa.has(i)?i:ii(i),t.attrs[i])}function va(e,t,n){const s=ui(e,t,n);for(const i in e)if(me(e[i])||me(t[i])){const r=wt.indexOf(i)!==-1?"attr"+i.charAt(0).toUpperCase()+i.substring(1):i;s[r]=e[i]}return s}class Fd extends ha{constructor(){super(...arguments),this.type="svg",this.isSVGTag=!1,this.measureInstanceViewportBox=de}getBaseTargetFromProps(t,n){return t[n]}readValueFromInstance(t,n){if(xt.has(n)){const s=ea(n);return s&&s.default||0}if(ya.includes(n)){const i=getComputedStyle(t)[n];if(typeof i=="string"&&i)return i.trim()}return n=wa.has(n)?n:ii(n),t.getAttribute(n)}scrapeMotionValuesFromProps(t,n,s){return va(t,n,s)}build(t,n,s){ba(t,n,this.isSVGTag,s.transformTemplate,s.style)}renderInstance(t,n,s,i){$d(t,n,s,i)}mount(t){this.isSVGTag=xa(t.tagName),super.mount(t)}}const _d=hi.length;function ka(e){if(!e)return;if(!e.isControllingVariants){const n=e.parent?ka(e.parent)||{}:{};return e.props.initial!==void 0&&(n.initial=e.props.initial),n}const t={};for(let n=0;n<_d;n++){const s=hi[n],i=e.props[s];(It(i)||i===!1)&&(t[s]=i)}return t}function Ta(e,t){if(!Array.isArray(t))return!1;const n=t.length;if(n!==e.length)return!1;for(let s=0;s<n;s++)if(t[s]!==e[s])return!1;return!0}const Hd=[...ci].reverse(),Wd=ci.length;function zd(e){return t=>Promise.all(t.map(({animation:n,options:s})=>Hh(e,n,s)))}function Gd(e){let t=zd(e),n=to(),s=!0,i=!1;const r=l=>(h,f)=>{const u=it(e,f,l==="exit"?e.presenceContext?.custom:void 0);if(u){const{transition:g,transitionEnd:y,...x}=u;h={...h,...x,...y}}return h};function o(l){t=l(e)}function a(l){const{props:h}=e,f=ka(e.parent)||{},u=[],g=new Set;let y={},x=1/0;for(let w=0;w<Wd;w++){const S=Hd[w],v=n[S],b=h[S]!==void 0?h[S]:f[S],k=It(b),A=S===l?v.isActive:null;A===!1&&(x=w);let C=b===f[S]&&b!==h[S]&&k;if(C&&(s||i)&&e.manuallyAnimateOnMount&&(C=!1),v.protectedKeys={...y},!v.isActive&&A===null||!b&&!v.prevProp||On(b)||typeof b=="boolean")continue;if(S==="exit"&&v.isActive&&A!==!0){v.prevResolvedValues&&(y={...y,...v.prevResolvedValues});continue}const E=Ud(v.prevProp,b);let L=E||S===l&&v.isActive&&!C&&k||w>x&&k,I=!1;const K=Array.isArray(b)?b:[b];let _=K.reduce(r(S),{});A===!1&&(_={});const{prevResolvedValues:R={}}=v,B={...R,..._},Y=O=>{L=!0,g.has(O)&&(I=!0,g.delete(O)),v.needsAnimating[O]=!0;const H=e.getValue(O);H&&(H.liveStyle=!1)};for(const O in B){const H=_[O],D=R[O];if(y.hasOwnProperty(O))continue;let Q=!1;vs(H)&&vs(D)?Q=!Ta(H,D)||E:Q=H!==D,Q?H!=null?Y(O):g.add(O):H!==void 0&&g.has(O)?Y(O):v.protectedKeys[O]=!0}v.prevProp=b,v.prevResolvedValues=_,v.isActive&&(y={...y,..._}),(s||i)&&e.blockInitialAnimation&&(L=!1);const Z=C&&E;L&&(!Z||I)&&u.push(...K.map(O=>{const H={type:S};if(typeof O=="string"&&(s||i)&&!Z&&e.manuallyAnimateOnMount&&e.parent){const{parent:D}=e,Q=it(D,O);if(D.enteringChildren&&Q){const{delayChildren:ve}=Q.transition||{};H.delay=Gr(D.enteringChildren,e,ve)}}return{animation:O,options:H}}))}if(g.size){const w={};if(typeof h.initial!="boolean"){const S=it(e,Array.isArray(h.initial)?h.initial[0]:h.initial);S&&S.transition&&(w.transition=S.transition)}g.forEach(S=>{const v=e.getBaseTarget(S),b=e.getValue(S);b&&(b.liveStyle=!0),w[S]=v??null}),u.push({animation:w})}let p=!!u.length;return s&&(h.initial===!1||h.initial===h.animate)&&!e.manuallyAnimateOnMount&&(p=!1),s=!1,i=!1,p?t(u):Promise.resolve()}function c(l,h){if(n[l].isActive===h)return Promise.resolve();e.variantChildren?.forEach(u=>u.animationState?.setActive(l,h)),n[l].isActive=h;const f=a(l);for(const u in n)n[u].protectedKeys={};return f}return{animateChanges:a,setActive:c,setAnimateFunction:o,getState:()=>n,reset:()=>{n=to(),i=!0}}}function Ud(e,t){return typeof t=="string"?t!==e:Array.isArray(t)?!Ta(t,e):!1}function Je(e=!1){return{isActive:e,protectedKeys:{},needsAnimating:{},prevResolvedValues:{}}}function to(){return{animate:Je(!0),whileInView:Je(),whileHover:Je(),whileTap:Je(),whileDrag:Je(),whileFocus:Je(),exit:Je()}}function Os(e,t){e.min=t.min,e.max=t.max}function Ne(e,t){Os(e.x,t.x),Os(e.y,t.y)}function no(e,t){e.translate=t.translate,e.scale=t.scale,e.originPoint=t.originPoint,e.origin=t.origin}const Sa=1e-4,Kd=1-Sa,Qd=1+Sa,Ca=.01,qd=0-Ca,Yd=0+Ca;function be(e){return e.max-e.min}function Xd(e,t,n){return Math.abs(e-t)<=n}function so(e,t,n,s=.5){e.origin=s,e.originPoint=J(t.min,t.max,e.origin),e.scale=be(n)/be(t),e.translate=J(n.min,n.max,e.origin)-e.originPoint,(e.scale>=Kd&&e.scale<=Qd||isNaN(e.scale))&&(e.scale=1),(e.translate>=qd&&e.translate<=Yd||isNaN(e.translate))&&(e.translate=0)}function Dt(e,t,n,s){so(e.x,t.x,n.x,s?s.originX:void 0),so(e.y,t.y,n.y,s?s.originY:void 0)}function io(e,t,n,s=0){const i=s?J(n.min,n.max,s):n.min;e.min=i+t.min,e.max=e.min+be(t)}function Zd(e,t,n,s){io(e.x,t.x,n.x,s?.x),io(e.y,t.y,n.y,s?.y)}function oo(e,t,n,s=0){const i=s?J(n.min,n.max,s):n.min;e.min=t.min-i,e.max=e.min+be(t)}function An(e,t,n,s){oo(e.x,t.x,n.x,s?.x),oo(e.y,t.y,n.y,s?.y)}function ro(e,t,n,s,i){return e-=t,e=Cn(e,1/n,s),i!==void 0&&(e=Cn(e,1/i,s)),e}function Jd(e,t=0,n=1,s=.5,i,r=e,o=e){if(He.test(t)&&(t=parseFloat(t),t=J(o.min,o.max,t/100)-o.min),typeof t!="number")return;let a=J(r.min,r.max,s);e===r&&(a-=t),e.min=ro(e.min,t,n,a,i),e.max=ro(e.max,t,n,a,i)}function ao(e,t,[n,s,i],r,o){Jd(e,t[n],t[s],t[i],t.scale,r,o)}const eu=["x","scaleX","originX"],tu=["y","scaleY","originY"];function lo(e,t,n,s){ao(e.x,t,eu,n?n.x:void 0,s?s.x:void 0),ao(e.y,t,tu,n?n.y:void 0,s?s.y:void 0)}function co(e){return e.translate===0&&e.scale===1}function Aa(e){return co(e.x)&&co(e.y)}function ho(e,t){return e.min===t.min&&e.max===t.max}function nu(e,t){return ho(e.x,t.x)&&ho(e.y,t.y)}function uo(e,t){return Math.round(e.min)===Math.round(t.min)&&Math.round(e.max)===Math.round(t.max)}function Pa(e,t){return uo(e.x,t.x)&&uo(e.y,t.y)}function fo(e){return be(e.x)/be(e.y)}function po(e,t){return e.translate===t.translate&&e.scale===t.scale&&e.originPoint===t.originPoint}function $e(e){return[e("x"),e("y")]}function su(e,t,n){let s="";const i=e.x.translate/t.x,r=e.y.translate/t.y,o=n?.z||0;if((i||r||o)&&(s=`translate3d(${i}px, ${r}px, ${o}px) `),(t.x!==1||t.y!==1)&&(s+=`scale(${1/t.x}, ${1/t.y}) `),n){const{transformPerspective:l,rotate:h,pathRotation:f,rotateX:u,rotateY:g,skewX:y,skewY:x}=n;l&&(s=`perspective(${l}px) ${s}`),h&&(s+=`rotate(${h}deg) `),f&&(s+=`rotate(${f}deg) `),u&&(s+=`rotateX(${u}deg) `),g&&(s+=`rotateY(${g}deg) `),y&&(s+=`skewX(${y}deg) `),x&&(s+=`skewY(${x}deg) `)}const a=e.x.scale*t.x,c=e.y.scale*t.y;return(a!==1||c!==1)&&(s+=`scale(${a}, ${c})`),s||"none"}const iu=oi.length,mo=e=>typeof e=="string"?parseFloat(e):e,go=e=>typeof e=="number"||N.test(e);function ou(e,t,n,s,i,r){i?(e.opacity=J(0,n.opacity??1,ru(s)),e.opacityExit=J(t.opacity??1,0,au(s))):r&&(e.opacity=J(t.opacity??1,n.opacity??1,s));for(let o=0;o<iu;o++){const a=oi[o];let c=yo(t,a),l=yo(n,a);if(c===void 0&&l===void 0)continue;c||(c=0),l||(l=0),c===0||l===0||go(c)===go(l)?(e[a]=Math.max(J(mo(c),mo(l),s),0),(He.test(l)||He.test(c))&&(e[a]+="%")):e[a]=l}(t.rotate||n.rotate)&&(e.rotate=J(t.rotate||0,n.rotate||0,s))}function yo(e,t){return e[t]!==void 0?e[t]:e.borderRadius}const ru=Ea(0,.5,xr),au=Ea(.5,.95,Re);function Ea(e,t,n){return s=>s<e?0:s>t?1:n(Nt(e,t,s))}function lu(e,t,n){const s=me(e)?e:yt(e);return s.start(ni("",s,t,n)),s.animation}function Bt(e,t,n,s={passive:!0}){return e.addEventListener(t,n,s),()=>e.removeEventListener(t,n,s)}const cu=(e,t)=>e.depth-t.depth;class hu{constructor(){this.children=[],this.isDirty=!1}add(t){Ws(this.children,t),this.isDirty=!0}remove(t){wn(this.children,t),this.isDirty=!0}forEach(t){this.isDirty&&this.children.sort(cu),this.isDirty=!1,this.children.forEach(t)}}function du(e,t){const n=ye.now(),s=({timestamp:i})=>{const r=i-n;r>=t&&(qe(s),e(r-t))};return ee.setup(s,!0),()=>qe(s)}function mn(e){return me(e)?e.get():e}class uu{constructor(){this.members=[]}add(t){Ws(this.members,t);for(let n=this.members.length-1;n>=0;n--){const s=this.members[n];if(s===t||s===this.lead||s===this.prevLead)continue;const i=s.instance;(!i||i.isConnected===!1)&&!s.snapshot&&(wn(this.members,s),s.unmount())}t.scheduleRender()}remove(t){if(wn(this.members,t),t===this.prevLead&&(this.prevLead=void 0),t===this.lead){const n=this.members[this.members.length-1];n&&this.promote(n)}}relegate(t){for(let n=this.members.indexOf(t)-1;n>=0;n--){const s=this.members[n];if(s.isPresent!==!1&&s.instance?.isConnected!==!1)return this.promote(s),!0}return!1}promote(t,n){const s=this.lead;if(t!==s&&(this.prevLead=s,this.lead=t,t.show(),s)){s.updateSnapshot(),t.scheduleRender();const{layoutDependency:i}=s.options,{layoutDependency:r}=t.options;(i===void 0||i!==r)&&(t.resumeFrom=s,n&&(s.preserveOpacity=!0),s.snapshot&&(t.snapshot=s.snapshot,t.snapshot.latestValues=s.animationValues||s.latestValues),t.root?.isUpdating&&(t.isLayoutDirty=!0)),t.options.crossfade===!1&&s.hide()}}exitAnimationComplete(){this.members.forEach(t=>{t.options.onExitComplete?.(),t.resumingFrom?.options.onExitComplete?.()})}scheduleRender(){this.members.forEach(t=>t.instance&&t.scheduleRender(!1))}removeLeadSnapshot(){this.lead?.snapshot&&(this.lead.snapshot=void 0)}}const gn={hasAnimatedSinceResize:!0,hasEverUpdated:!1},Gn=["","X","Y","Z"],fu=1e3;let pu=0;function Un(e,t,n,s){const{latestValues:i}=t;i[e]&&(n[e]=i[e],t.setStaticValue(e,0),s&&(s[e]=0))}function Ma(e){if(e.hasCheckedOptimisedAppear=!0,e.root===e)return;const{visualElement:t}=e.options;if(!t)return;const n=Yr(t);if(window.MotionHasOptimisedAnimation(n,"transform")){const{layout:i,layoutId:r}=e.options;window.MotionCancelOptimisedAnimation(n,"transform",ee,!(i||r))}const{parent:s}=e;s&&!s.hasCheckedOptimisedAppear&&Ma(s)}function Da({attachResizeListener:e,defaultParent:t,measureScroll:n,checkIsScrollRoot:s,resetTransform:i}){return class{constructor(o={},a=t?.()){this.id=pu++,this.animationId=0,this.animationCommitId=0,this.children=new Set,this.options={},this.isTreeAnimating=!1,this.isAnimationBlocked=!1,this.isLayoutDirty=!1,this.isProjectionDirty=!1,this.isSharedProjectionDirty=!1,this.isTransformDirty=!1,this.updateManuallyBlocked=!1,this.updateBlockedByResize=!1,this.isUpdating=!1,this.isSVG=!1,this.needsReset=!1,this.shouldResetTransform=!1,this.hasCheckedOptimisedAppear=!1,this.treeScale={x:1,y:1},this.eventHandlers=new Map,this.hasTreeAnimated=!1,this.layoutVersion=0,this.updateScheduled=!1,this.scheduleUpdate=()=>this.update(),this.projectionUpdateScheduled=!1,this.checkUpdateFailed=()=>{this.isUpdating&&(this.isUpdating=!1,this.clearAllSnapshots())},this.updateProjection=()=>{this.projectionUpdateScheduled=!1,this.nodes.forEach(yu),this.nodes.forEach(Tu),this.nodes.forEach(Su),this.nodes.forEach(bu)},this.resolvedRelativeTargetAt=0,this.linkedParentVersion=0,this.hasProjected=!1,this.isVisible=!0,this.animationProgress=0,this.sharedNodes=new Map,this.latestValues=o,this.root=a?a.root||a:this,this.path=a?[...a.path,a]:[],this.parent=a,this.depth=a?a.depth+1:0;for(let c=0;c<this.path.length;c++)this.path[c].shouldResetTransform=!0;this.root===this&&(this.nodes=new hu)}addEventListener(o,a){return this.eventHandlers.has(o)||this.eventHandlers.set(o,new zs),this.eventHandlers.get(o).add(a)}notifyListeners(o,...a){const c=this.eventHandlers.get(o);c&&c.notify(...a)}hasListeners(o){return this.eventHandlers.has(o)}mount(o){if(this.instance)return;this.isSVG=li(o)&&!yd(o),this.instance=o;const{layoutId:a,layout:c,visualElement:l}=this.options;if(l&&!l.current&&l.mount(o),this.root.nodes.add(this),this.parent&&this.parent.children.add(this),this.root.hasTreeAnimated&&(c||a)&&(this.isLayoutDirty=!0),e){let h,f=0;const u=()=>this.root.updateBlockedByResize=!1;ee.read(()=>{f=window.innerWidth}),e(o,()=>{const g=window.innerWidth;g!==f&&(f=g,this.root.updateBlockedByResize=!0,h&&h(),h=du(u,250),gn.hasAnimatedSinceResize&&(gn.hasAnimatedSinceResize=!1,this.nodes.forEach(xo)))})}a&&this.root.registerSharedNode(a,this),this.options.animate!==!1&&l&&(a||c)&&this.addEventListener("didUpdate",({delta:h,hasLayoutChanged:f,hasRelativeLayoutChanged:u,layout:g})=>{if(this.isTreeAnimationBlocked()){this.target=void 0,this.relativeTarget=void 0;return}const y=this.options.transition||l.getDefaultTransition()||Mu,{onLayoutAnimationStart:x,onLayoutAnimationComplete:p}=l.getProps(),w=!this.targetLayout||!Pa(this.targetLayout,g),S=!f&&u;if(this.options.layoutRoot||this.resumeFrom||S||f&&(w||!this.currentAnimation)){this.resumeFrom&&(this.resumingFrom=this.resumeFrom,this.resumingFrom.resumingFrom=void 0);const v={...ti(y,"layout"),onPlay:x,onComplete:p};(l.shouldReduceMotion||this.options.layoutRoot)&&(v.delay=0,v.type=!1),this.startAnimation(v),this.setAnimationOrigin(h,S,v.path)}else f||xo(this),this.isLead()&&this.options.onExitComplete&&this.options.onExitComplete();this.targetLayout=g})}unmount(){this.options.layoutId&&this.willUpdate(),this.root.nodes.remove(this);const o=this.getStack();o&&o.remove(this),this.parent&&this.parent.children.delete(this),this.instance=void 0,this.eventHandlers.clear(),qe(this.updateProjection)}blockUpdate(){this.updateManuallyBlocked=!0}unblockUpdate(){this.updateManuallyBlocked=!1}isUpdateBlocked(){return this.updateManuallyBlocked||this.updateBlockedByResize}isTreeAnimationBlocked(){return this.isAnimationBlocked||this.parent&&this.parent.isTreeAnimationBlocked()||!1}startUpdate(){this.isUpdateBlocked()||(this.isUpdating=!0,this.nodes&&this.nodes.forEach(Cu),this.animationId++)}getTransformTemplate(){const{visualElement:o}=this.options;return o&&o.getProps().transformTemplate}willUpdate(o=!0){if(this.root.hasTreeAnimated=!0,this.root.isUpdateBlocked()){this.options.onExitComplete&&this.options.onExitComplete();return}if(window.MotionCancelOptimisedAnimation&&!this.hasCheckedOptimisedAppear&&Ma(this),!this.root.isUpdating&&this.root.startUpdate(),this.isLayoutDirty)return;this.isLayoutDirty=!0;for(let h=0;h<this.path.length;h++){const f=this.path[h];f.shouldResetTransform=!0,(typeof f.latestValues.x=="string"||typeof f.latestValues.y=="string")&&(f.isLayoutDirty=!0),f.updateScroll("snapshot"),f.options.layoutRoot&&f.willUpdate(!1)}const{layoutId:a,layout:c}=this.options;if(a===void 0&&!c)return;const l=this.getTransformTemplate();this.prevTransformTemplateValue=l?l(this.latestValues,""):void 0,this.updateSnapshot(),o&&this.notifyListeners("willUpdate")}update(){if(this.updateScheduled=!1,this.isUpdateBlocked()){const c=this.updateBlockedByResize;this.unblockUpdate(),this.updateBlockedByResize=!1,this.clearAllSnapshots(),c&&this.nodes.forEach(xu),this.nodes.forEach(bo);return}if(this.animationId<=this.animationCommitId){this.nodes.forEach(wo);return}this.animationCommitId=this.animationId,this.isUpdating?(this.isUpdating=!1,this.nodes.forEach(vu),this.nodes.forEach(ku),this.nodes.forEach(mu),this.nodes.forEach(gu)):this.nodes.forEach(wo),this.clearAllSnapshots();const a=ye.now();pe.delta=We(0,1e3/60,a-pe.timestamp),pe.timestamp=a,pe.isProcessing=!0,In.update.process(pe),In.preRender.process(pe),In.render.process(pe),pe.isProcessing=!1}didUpdate(){this.updateScheduled||(this.updateScheduled=!0,ri.read(this.scheduleUpdate))}clearAllSnapshots(){this.nodes.forEach(wu),this.sharedNodes.forEach(Au)}scheduleUpdateProjection(){this.projectionUpdateScheduled||(this.projectionUpdateScheduled=!0,ee.preRender(this.updateProjection,!1,!0))}scheduleCheckAfterUnmount(){ee.postRender(()=>{this.isLayoutDirty?this.root.didUpdate():this.root.checkUpdateFailed()})}updateSnapshot(){this.snapshot||!this.instance||(this.snapshot=this.measure(),this.snapshot&&!be(this.snapshot.measuredBox.x)&&!be(this.snapshot.measuredBox.y)&&(this.snapshot=void 0))}updateLayout(){if(!this.instance||(this.updateScroll(),!(this.options.alwaysMeasureLayout&&this.isLead())&&!this.isLayoutDirty))return;if(this.resumeFrom&&!this.resumeFrom.instance)for(let c=0;c<this.path.length;c++)this.path[c].updateScroll();const o=this.layout;this.layout=this.measure(!1),this.layoutVersion++,this.layoutCorrected||(this.layoutCorrected=de()),this.isLayoutDirty=!1,this.projectionDelta=void 0,this.notifyListeners("measure",this.layout.layoutBox);const{visualElement:a}=this.options;a&&a.notify("LayoutMeasure",this.layout.layoutBox,o?o.layoutBox:void 0)}updateScroll(o="measure"){let a=!!(this.options.layoutScroll&&this.instance);if(this.scroll&&this.scroll.animationId===this.root.animationId&&this.scroll.phase===o&&(a=!1),a&&this.instance){const c=s(this.instance);this.scroll={animationId:this.root.animationId,phase:o,isRoot:c,offset:n(this.instance),wasRoot:this.scroll?this.scroll.isRoot:c}}}resetTransform(){if(!i)return;const o=this.isLayoutDirty||this.shouldResetTransform||this.options.alwaysMeasureLayout,a=this.projectionDelta&&!Aa(this.projectionDelta),c=this.getTransformTemplate(),l=c?c(this.latestValues,""):void 0,h=l!==this.prevTransformTemplateValue;o&&this.instance&&(a||et(this.latestValues)||h)&&(i(this.instance,l),this.shouldResetTransform=!1,this.scheduleRender())}measure(o=!0){const a=this.measurePageBox();let c=this.removeElementScroll(a);return o&&(c=this.removeTransform(c)),Du(c),{animationId:this.root.animationId,measuredBox:a,layoutBox:c,latestValues:{},source:this.id}}measurePageBox(){const{visualElement:o}=this.options;if(!o)return de();const a=o.measureViewportBox();if(!(this.scroll?.wasRoot||this.path.some(Ou))){const{scroll:l}=this.root;l&&(Fe(a.x,l.offset.x),Fe(a.y,l.offset.y))}return a}removeElementScroll(o){const a=de();if(Ne(a,o),this.scroll?.wasRoot)return a;for(let c=0;c<this.path.length;c++){const l=this.path[c],{scroll:h,options:f}=l;l!==this.root&&h&&f.layoutScroll&&(h.wasRoot&&Ne(a,o),Fe(a.x,h.offset.x),Fe(a.y,h.offset.y))}return a}applyTransform(o,a=!1,c){const l=c||de();Ne(l,o);for(let h=0;h<this.path.length;h++){const f=this.path[h];!a&&f.options.layoutScroll&&f.scroll&&f!==f.root&&(Fe(l.x,-f.scroll.offset.x),Fe(l.y,-f.scroll.offset.y)),et(f.latestValues)&&pn(l,f.latestValues,f.layout?.layoutBox)}return et(this.latestValues)&&pn(l,this.latestValues,this.layout?.layoutBox),l}removeTransform(o){const a=de();Ne(a,o);for(let c=0;c<this.path.length;c++){const l=this.path[c];if(!et(l.latestValues))continue;let h;l.instance&&(Es(l.latestValues)&&l.updateSnapshot(),h=de(),Ne(h,l.measurePageBox())),lo(a,l.latestValues,l.snapshot?.layoutBox,h)}return et(this.latestValues)&&lo(a,this.latestValues),a}setTargetDelta(o){this.targetDelta=o,this.root.scheduleUpdateProjection(),this.isProjectionDirty=!0}setOptions(o){this.options={...this.options,...o,crossfade:o.crossfade!==void 0?o.crossfade:!0}}clearMeasurements(){this.scroll=void 0,this.layout=void 0,this.snapshot=void 0,this.prevTransformTemplateValue=void 0,this.targetDelta=void 0,this.target=void 0,this.isLayoutDirty=!1}forceRelativeParentToResolveTarget(){this.relativeParent&&this.relativeParent.resolvedRelativeTargetAt!==pe.timestamp&&this.relativeParent.resolveTargetDelta(!0)}resolveTargetDelta(o=!1){const a=this.getLead();this.isProjectionDirty||(this.isProjectionDirty=a.isProjectionDirty),this.isTransformDirty||(this.isTransformDirty=a.isTransformDirty),this.isSharedProjectionDirty||(this.isSharedProjectionDirty=a.isSharedProjectionDirty);const c=!!this.resumingFrom||this!==a;if(!(o||c&&this.isSharedProjectionDirty||this.isProjectionDirty||this.parent?.isProjectionDirty||this.attemptToResolveRelativeTarget||this.root.updateBlockedByResize))return;const{layout:h,layoutId:f}=this.options;if(!this.layout||!(h||f))return;this.resolvedRelativeTargetAt=pe.timestamp;const u=this.getClosestProjectingParent();u&&this.linkedParentVersion!==u.layoutVersion&&!u.options.layoutRoot&&this.removeRelativeTarget(),!this.targetDelta&&!this.relativeTarget&&(this.options.layoutAnchor!==!1&&u&&u.layout?this.createRelativeTarget(u,this.layout.layoutBox,u.layout.layoutBox):this.removeRelativeTarget()),!(!this.relativeTarget&&!this.targetDelta)&&(this.target||(this.target=de(),this.targetWithTransforms=de()),this.relativeTarget&&this.relativeTargetOrigin&&this.relativeParent&&this.relativeParent.target?(this.forceRelativeParentToResolveTarget(),Zd(this.target,this.relativeTarget,this.relativeParent.target,this.options.layoutAnchor||void 0)):this.targetDelta?(this.resumingFrom?this.applyTransform(this.layout.layoutBox,!1,this.target):Ne(this.target,this.layout.layoutBox),fa(this.target,this.targetDelta)):Ne(this.target,this.layout.layoutBox),this.attemptToResolveRelativeTarget&&(this.attemptToResolveRelativeTarget=!1,this.options.layoutAnchor!==!1&&u&&!!u.resumingFrom==!!this.resumingFrom&&!u.options.layoutScroll&&u.target&&this.animationProgress!==1?this.createRelativeTarget(u,this.target,u.target):this.relativeParent=this.relativeTarget=void 0))}getClosestProjectingParent(){if(!(!this.parent||Es(this.parent.latestValues)||ua(this.parent.latestValues)))return this.parent.isProjecting()?this.parent:this.parent.getClosestProjectingParent()}isProjecting(){return!!((this.relativeTarget||this.targetDelta||this.options.layoutRoot)&&this.layout)}createRelativeTarget(o,a,c){this.relativeParent=o,this.linkedParentVersion=o.layoutVersion,this.forceRelativeParentToResolveTarget(),this.relativeTarget=de(),this.relativeTargetOrigin=de(),An(this.relativeTargetOrigin,a,c,this.options.layoutAnchor||void 0),Ne(this.relativeTarget,this.relativeTargetOrigin)}removeRelativeTarget(){this.relativeParent=this.relativeTarget=void 0}calcProjection(){const o=this.getLead(),a=!!this.resumingFrom||this!==o;let c=!0;if((this.isProjectionDirty||this.parent?.isProjectionDirty)&&(c=!1),a&&(this.isSharedProjectionDirty||this.isTransformDirty)&&(c=!1),this.resolvedRelativeTargetAt===pe.timestamp&&(c=!1),c)return;const{layout:l,layoutId:h}=this.options;if(this.isTreeAnimating=!!(this.parent&&this.parent.isTreeAnimating||this.currentAnimation||this.pendingAnimation),this.isTreeAnimating||(this.targetDelta=this.relativeTarget=void 0),!this.layout||!(l||h))return;Ne(this.layoutCorrected,this.layout.layoutBox);const f=this.treeScale.x,u=this.treeScale.y;Ed(this.layoutCorrected,this.treeScale,this.path,a),o.layout&&!o.target&&(this.treeScale.x!==1||this.treeScale.y!==1)&&(o.target=o.layout.layoutBox,o.targetWithTransforms=de());const{target:g}=o;if(!g){this.prevProjectionDelta&&(this.createProjectionDeltas(),this.scheduleRender());return}!this.projectionDelta||!this.prevProjectionDelta?this.createProjectionDeltas():(no(this.prevProjectionDelta.x,this.projectionDelta.x),no(this.prevProjectionDelta.y,this.projectionDelta.y)),Dt(this.projectionDelta,this.layoutCorrected,g,this.latestValues),(this.treeScale.x!==f||this.treeScale.y!==u||!po(this.projectionDelta.x,this.prevProjectionDelta.x)||!po(this.projectionDelta.y,this.prevProjectionDelta.y))&&(this.hasProjected=!0,this.scheduleRender(),this.notifyListeners("projectionUpdate",g))}hide(){this.isVisible=!1}show(){this.isVisible=!0}scheduleRender(o=!0){if(this.options.visualElement?.scheduleRender(),o){const a=this.getStack();a&&a.scheduleRender()}this.resumingFrom&&!this.resumingFrom.instance&&(this.resumingFrom=void 0)}createProjectionDeltas(){this.prevProjectionDelta=mt(),this.projectionDelta=mt(),this.projectionDeltaWithTransform=mt()}setAnimationOrigin(o,a=!1,c){const l=this.snapshot,h=l?l.latestValues:{},f={...this.latestValues},u=mt();(!this.relativeParent||!this.relativeParent.options.layoutRoot)&&(this.relativeTarget=this.relativeTargetOrigin=void 0),this.attemptToResolveRelativeTarget=!a;const g=de(),y=l?l.source:void 0,x=this.layout?this.layout.source:void 0,p=y!==x,w=this.getStack(),S=!w||w.members.length<=1,v=!!(p&&!S&&this.options.crossfade===!0&&!this.path.some(Eu));this.animationProgress=0;let b;const k=c?.interpolateProjection(o);this.mixTargetDelta=A=>{const C=A/1e3,E=k?.(C);E?(u.x.translate=E.x,u.x.scale=J(o.x.scale,1,C),u.x.origin=o.x.origin,u.x.originPoint=o.x.originPoint,u.y.translate=E.y,u.y.scale=J(o.y.scale,1,C),u.y.origin=o.y.origin,u.y.originPoint=o.y.originPoint):(vo(u.x,o.x,C),vo(u.y,o.y,C)),this.setTargetDelta(u),this.relativeTarget&&this.relativeTargetOrigin&&this.layout&&this.relativeParent&&this.relativeParent.layout&&(An(g,this.layout.layoutBox,this.relativeParent.layout.layoutBox,this.options.layoutAnchor||void 0),Pu(this.relativeTarget,this.relativeTargetOrigin,g,C),b&&nu(this.relativeTarget,b)&&(this.isProjectionDirty=!1),b||(b=de()),Ne(b,this.relativeTarget)),p&&(this.animationValues=f,ou(f,h,this.latestValues,C,v,S)),E&&E.rotate!==void 0&&(this.animationValues||(this.animationValues=f),this.animationValues.pathRotation=E.rotate),this.root.scheduleUpdateProjection(),this.scheduleRender(),this.animationProgress=C},this.mixTargetDelta(this.options.layoutRoot?1e3:0)}startAnimation(o){this.notifyListeners("animationStart"),this.currentAnimation?.stop(),this.resumingFrom?.currentAnimation?.stop(),this.pendingAnimation&&(qe(this.pendingAnimation),this.pendingAnimation=void 0),this.pendingAnimation=ee.update(()=>{gn.hasAnimatedSinceResize=!0,this.motionValue||(this.motionValue=yt(0)),this.motionValue.jump(0,!1),this.currentAnimation=lu(this.motionValue,[0,1e3],{...o,velocity:0,isSync:!0,onUpdate:a=>{this.mixTargetDelta(a),o.onUpdate&&o.onUpdate(a)},onComplete:()=>{o.onComplete&&o.onComplete(),this.completeAnimation()}}),this.resumingFrom&&(this.resumingFrom.currentAnimation=this.currentAnimation),this.pendingAnimation=void 0})}completeAnimation(){this.resumingFrom&&(this.resumingFrom.currentAnimation=void 0,this.resumingFrom.preserveOpacity=void 0);const o=this.getStack();o&&o.exitAnimationComplete(),this.resumingFrom=this.currentAnimation=this.animationValues=void 0,this.notifyListeners("animationComplete")}finishAnimation(){this.currentAnimation&&(this.mixTargetDelta&&this.mixTargetDelta(fu),this.currentAnimation.stop()),this.completeAnimation()}applyTransformsToTarget(){const o=this.getLead();let{targetWithTransforms:a,target:c,layout:l,latestValues:h}=o;if(!(!a||!c||!l)){if(this!==o&&this.layout&&l&&Oa(this.options.animationType,this.layout.layoutBox,l.layoutBox)){c=this.target||de();const f=be(this.layout.layoutBox.x);c.x.min=o.target.x.min,c.x.max=c.x.min+f;const u=be(this.layout.layoutBox.y);c.y.min=o.target.y.min,c.y.max=c.y.min+u}Ne(a,c),pn(a,h),Dt(this.projectionDeltaWithTransform,this.layoutCorrected,a,h)}}registerSharedNode(o,a){this.sharedNodes.has(o)||this.sharedNodes.set(o,new uu),this.sharedNodes.get(o).add(a);const l=a.options.initialPromotionConfig;a.promote({transition:l?l.transition:void 0,preserveFollowOpacity:l&&l.shouldPreserveFollowOpacity?l.shouldPreserveFollowOpacity(a):void 0})}isLead(){const o=this.getStack();return o?o.lead===this:!0}getLead(){const{layoutId:o}=this.options;return o?this.getStack()?.lead||this:this}getPrevLead(){const{layoutId:o}=this.options;return o?this.getStack()?.prevLead:void 0}getStack(){const{layoutId:o}=this.options;if(o)return this.root.sharedNodes.get(o)}promote({needsReset:o,transition:a,preserveFollowOpacity:c}={}){const l=this.getStack();l&&l.promote(this,c),o&&(this.projectionDelta=void 0,this.needsReset=!0),a&&this.setOptions({transition:a})}relegate(){const o=this.getStack();return o?o.relegate(this):!1}resetSkewAndRotation(){const{visualElement:o}=this.options;if(!o)return;let a=!1;const{latestValues:c}=o;if((c.z||c.rotate||c.rotateX||c.rotateY||c.rotateZ||c.skewX||c.skewY)&&(a=!0),!a)return;const l={};c.z&&Un("z",o,l,this.animationValues);for(let h=0;h<Gn.length;h++)Un(`rotate${Gn[h]}`,o,l,this.animationValues),Un(`skew${Gn[h]}`,o,l,this.animationValues);o.render();for(const h in l)o.setStaticValue(h,l[h]),this.animationValues&&(this.animationValues[h]=l[h]);o.scheduleRender()}applyProjectionStyles(o,a){if(!this.instance||this.isSVG)return;if(!this.isVisible){o.visibility="hidden";return}const c=this.getTransformTemplate();if(this.needsReset){this.needsReset=!1,o.visibility="",o.opacity="",o.pointerEvents=mn(a?.pointerEvents)||"",o.transform=c?c(this.latestValues,""):"none";return}const l=this.getLead();if(!this.projectionDelta||!this.layout||!l.target){this.options.layoutId&&(o.opacity=this.latestValues.opacity!==void 0?this.latestValues.opacity:1,o.pointerEvents=mn(a?.pointerEvents)||""),this.hasProjected&&!et(this.latestValues)&&(o.transform=c?c({},""):"none",this.hasProjected=!1);return}o.visibility="";const h=l.animationValues||l.latestValues;this.applyTransformsToTarget();let f=su(this.projectionDeltaWithTransform,this.treeScale,h);c&&(f=c(h,f)),o.transform=f;const{x:u,y:g}=this.projectionDelta;o.transformOrigin=`${u.origin*100}% ${g.origin*100}% 0`,l.animationValues?o.opacity=l===this?h.opacity??this.latestValues.opacity??1:this.preserveOpacity?this.latestValues.opacity:h.opacityExit:o.opacity=l===this?h.opacity!==void 0?h.opacity:"":h.opacityExit!==void 0?h.opacityExit:0;for(const y in Ds){if(h[y]===void 0)continue;const{correct:x,applyTo:p,isCSSVariable:w}=Ds[y],S=f==="none"?h[y]:x(h[y],l);if(p){const v=p.length;for(let b=0;b<v;b++)o[p[b]]=S}else w?this.options.visualElement.renderState.vars[y]=S:o[y]=S}this.options.layoutId&&(o.pointerEvents=l===this?mn(a?.pointerEvents)||"":"none")}clearSnapshot(){this.resumeFrom=this.snapshot=void 0}resetTree(){this.root.nodes.forEach(o=>o.currentAnimation?.stop()),this.root.nodes.forEach(bo),this.root.sharedNodes.clear()}}}function mu(e){e.updateLayout()}function gu(e){const t=e.resumeFrom?.snapshot||e.snapshot;if(e.isLead()&&e.layout&&t&&e.hasListeners("didUpdate")){const{layoutBox:n,measuredBox:s}=e.layout,{animationType:i}=e.options,r=t.source!==e.layout.source;if(i==="size")$e(h=>{const f=r?t.measuredBox[h]:t.layoutBox[h],u=be(f);f.min=n[h].min,f.max=f.min+u});else if(i==="x"||i==="y"){const h=i==="x"?"y":"x";Os(r?t.measuredBox[h]:t.layoutBox[h],n[h])}else Oa(i,t.layoutBox,n)&&$e(h=>{const f=r?t.measuredBox[h]:t.layoutBox[h],u=be(n[h]);f.max=f.min+u,e.relativeTarget&&!e.currentAnimation&&(e.isProjectionDirty=!0,e.relativeTarget[h].max=e.relativeTarget[h].min+u)});const o=mt();Dt(o,n,t.layoutBox);const a=mt();r?Dt(a,e.applyTransform(s,!0),t.measuredBox):Dt(a,n,t.layoutBox);const c=!Aa(o);let l=!1;if(!e.resumeFrom){const h=e.getClosestProjectingParent();if(h&&!h.resumeFrom){const{snapshot:f,layout:u}=h;if(f&&u){const g=e.options.layoutAnchor||void 0,y=de();An(y,t.layoutBox,f.layoutBox,g);const x=de();An(x,n,u.layoutBox,g),Pa(y,x)||(l=!0),h.options.layoutRoot&&(e.relativeTarget=x,e.relativeTargetOrigin=y,e.relativeParent=h)}}}e.notifyListeners("didUpdate",{layout:n,snapshot:t,delta:a,layoutDelta:o,hasLayoutChanged:c,hasRelativeLayoutChanged:l})}else if(e.isLead()){const{onExitComplete:n}=e.options;n&&n()}e.options.transition=void 0}function yu(e){e.parent&&(e.isProjecting()||(e.isProjectionDirty=e.parent.isProjectionDirty),e.isSharedProjectionDirty||(e.isSharedProjectionDirty=!!(e.isProjectionDirty||e.parent.isProjectionDirty||e.parent.isSharedProjectionDirty)),e.isTransformDirty||(e.isTransformDirty=e.parent.isTransformDirty))}function bu(e){e.isProjectionDirty=e.isSharedProjectionDirty=e.isTransformDirty=!1}function wu(e){e.clearSnapshot()}function bo(e){e.clearMeasurements()}function xu(e){e.isLayoutDirty=!0,e.updateLayout()}function wo(e){e.isLayoutDirty=!1}function vu(e){e.isAnimationBlocked&&e.layout&&!e.isLayoutDirty&&(e.snapshot=e.layout,e.isLayoutDirty=!0)}function ku(e){const{visualElement:t}=e.options;t&&t.getProps().onBeforeLayoutMeasure&&t.notify("BeforeLayoutMeasure"),e.resetTransform()}function xo(e){e.finishAnimation(),e.targetDelta=e.relativeTarget=e.target=void 0,e.isProjectionDirty=!0}function Tu(e){e.resolveTargetDelta()}function Su(e){e.calcProjection()}function Cu(e){e.resetSkewAndRotation()}function Au(e){e.removeLeadSnapshot()}function vo(e,t,n){e.translate=J(t.translate,0,n),e.scale=J(t.scale,1,n),e.origin=t.origin,e.originPoint=t.originPoint}function ko(e,t,n,s){e.min=J(t.min,n.min,s),e.max=J(t.max,n.max,s)}function Pu(e,t,n,s){ko(e.x,t.x,n.x,s),ko(e.y,t.y,n.y,s)}function Eu(e){return e.animationValues&&e.animationValues.opacityExit!==void 0}const Mu={duration:.45,ease:[.4,0,.1,1]},To=e=>typeof navigator<"u"&&navigator.userAgent&&navigator.userAgent.toLowerCase().includes(e),So=To("applewebkit/")&&!To("chrome/")?Math.round:Re;function Co(e){e.min=So(e.min),e.max=So(e.max)}function Du(e){Co(e.x),Co(e.y)}function Oa(e,t,n){return e==="position"||e==="preserve-aspect"&&!Xd(fo(t),fo(n),.2)}function Ou(e){return e!==e.root&&e.scroll?.wasRoot}const Ru=Da({attachResizeListener:(e,t)=>Bt(e,"resize",t),measureScroll:()=>({x:document.documentElement.scrollLeft||document.body?.scrollLeft||0,y:document.documentElement.scrollTop||document.body?.scrollTop||0}),checkIsScrollRoot:()=>!0}),Kn={current:void 0},Ra=Da({measureScroll:e=>({x:e.scrollLeft,y:e.scrollTop}),defaultParent:()=>{if(!Kn.current){const e=new Ru({});e.mount(window),e.setOptions({layoutScroll:!0}),Kn.current=e}return Kn.current},resetTransform:(e,t)=>{e.style.transform=t!==void 0?t:"none"},checkIsScrollRoot:e=>window.getComputedStyle(e).position==="fixed"}),fi=m.createContext({transformPagePoint:e=>e,isStatic:!1,reducedMotion:"never"});function Ao(e,t){if(typeof e=="function")return e(t);e!=null&&(e.current=t)}function ju(...e){return t=>{let n=!1;const s=e.map(i=>{const r=Ao(i,t);return!n&&typeof r=="function"&&(n=!0),r});if(n)return()=>{for(let i=0;i<s.length;i++){const r=s[i];typeof r=="function"?r():Ao(e[i],null)}}}}function Lu(...e){return m.useCallback(ju(...e),e)}class Nu extends m.Component{getSnapshotBeforeUpdate(t){const n=this.props.childRef.current;if(cn(n)&&t.isPresent&&!this.props.isPresent&&this.props.pop!==!1){const s=n.offsetParent,i=cn(s)&&s.offsetWidth||0,r=cn(s)&&s.offsetHeight||0,o=getComputedStyle(n),a=this.props.sizeRef.current;a.height=parseFloat(o.height),a.width=parseFloat(o.width),a.top=n.offsetTop,a.left=n.offsetLeft,a.right=i-a.width-a.left,a.bottom=r-a.height-a.top,a.direction=o.direction}return null}componentDidUpdate(){}render(){return this.props.children}}function Vu({children:e,isPresent:t,anchorX:n,anchorY:s,root:i,pop:r}){const o=m.useId(),a=m.useRef(null),c=m.useRef({width:0,height:0,top:0,left:0,right:0,bottom:0,direction:"ltr"}),{nonce:l}=m.useContext(fi),h=r!==!1?e.props?.ref??e?.ref:void 0,f=Lu(a,h);return m.useInsertionEffect(()=>{const{width:u,height:g,top:y,left:x,right:p,bottom:w,direction:S}=c.current;if(t||r===!1||!a.current||!u||!g)return;const v=S==="rtl",b=n==="left"?v?`right: ${p}`:`left: ${x}`:v?`left: ${x}`:`right: ${p}`,k=s==="bottom"?`bottom: ${w}`:`top: ${y}`;a.current.dataset.motionPopId=o;const A=document.createElement("style");l&&(A.nonce=l);const C=i??document.head;return C.appendChild(A),A.sheet&&A.sheet.insertRule(`
          [data-motion-pop-id="${o}"] {
            position: absolute !important;
            width: ${u}px !important;
            height: ${g}px !important;
            ${b}px !important;
            ${k}px !important;
          }
        `),()=>{a.current?.removeAttribute("data-motion-pop-id"),C.contains(A)&&C.removeChild(A)}},[t]),d.jsx(Nu,{isPresent:t,childRef:a,sizeRef:c,pop:r,children:r===!1?e:m.cloneElement(e,{ref:f})})}const Iu=({children:e,initial:t,isPresent:n,onExitComplete:s,custom:i,presenceAffectsLayout:r,mode:o,anchorX:a,anchorY:c,root:l})=>{const h=Hs(Bu),f=m.useId(),u=m.useRef(n),g=m.useRef(s);bn(()=>{u.current=n,g.current=s});let y=!0,x=m.useMemo(()=>(y=!1,{id:f,initial:t,isPresent:n,custom:i,onExitComplete:p=>{h.set(p,!0);for(const w of h.values())if(!w)return;s&&s()},register:p=>(h.set(p,!1),()=>{h.delete(p),!u.current&&!h.size&&g.current?.()})}),[n,h,s]);return r&&y&&(x={...x}),m.useMemo(()=>{h.forEach((p,w)=>h.set(w,!1))},[n]),m.useEffect(()=>{!n&&!h.size&&s&&s()},[n]),e=d.jsx(Vu,{pop:o==="popLayout",isPresent:n,anchorX:a,anchorY:c,root:l,children:e}),d.jsx(En.Provider,{value:x,children:e})};function Bu(){return new Map}function ja(e=!0){const t=m.useContext(En);if(t===null)return[!0,null];const{isPresent:n,onExitComplete:s,register:i}=t,r=m.useId();m.useEffect(()=>{if(e)return i(r)},[e]);const o=m.useCallback(()=>e&&s&&s(r),[r,s,e]);return!n&&s?[!1,o]:[!0]}const Xt=e=>e.key||"";function Po(e){const t=[];return m.Children.forEach(e,n=>{m.isValidElement(n)&&t.push(n)}),t}const $u=({children:e,custom:t,initial:n=!0,onExitComplete:s,presenceAffectsLayout:i=!0,mode:r="sync",propagate:o=!1,anchorX:a="left",anchorY:c="top",root:l})=>{const[h,f]=ja(o),u=m.useMemo(()=>Po(e),[e]),g=o&&!h?[]:u.map(Xt),y=m.useRef(!0),x=m.useRef(u),p=Hs(()=>new Map),w=m.useRef(new Set),[S,v]=m.useState(u),[b,k]=m.useState(u);bn(()=>{o&&!h&&!b.length&&f?.()},[h,o,b.length,f]),bn(()=>{y.current=!1,x.current=u;for(let E=0;E<b.length;E++){const L=Xt(b[E]);g.includes(L)?(p.delete(L),w.current.delete(L)):p.get(L)!==!0&&p.set(L,!1)}},[b,g.length,g.join("-")]);const A=[];if(u!==S){let E=[...u],L=0;for(const I of b){const K=g.indexOf(Xt(I));K===-1?(E.splice(L++,0,I),A.push(I)):L=K+A.length+1}return r==="wait"&&A.length&&(E=A),k(Po(E)),v(u),null}const{forceRender:C}=m.useContext(_s);return d.jsx(d.Fragment,{children:b.map(E=>{const L=Xt(E),I=o&&!h?!1:u===b||g.includes(L),K=()=>{if(w.current.has(L))return;if(p.has(L))w.current.add(L),p.set(L,!0);else return;let _=!0;p.forEach(R=>{R||(_=!1)}),_&&(C?.(),k(x.current),o&&f?.(),s&&s())};return d.jsx(Iu,{isPresent:I,initial:!y.current||n?void 0:!1,custom:t,presenceAffectsLayout:i,mode:r,root:l,onExitComplete:I?void 0:K,anchorX:a,anchorY:c,children:E},L)})})},La=m.createContext({strict:!1}),Eo={animation:["animate","variants","whileHover","whileTap","exit","whileInView","whileFocus","whileDrag"],exit:["exit"],drag:["drag","dragControls"],focus:["whileFocus"],hover:["whileHover","onHoverStart","onHoverEnd"],tap:["whileTap","onTap","onTapStart","onTapCancel"],pan:["onPan","onPanStart","onPanSessionStart","onPanEnd"],inView:["whileInView","onViewportEnter","onViewportLeave"],layout:["layout","layoutId"]};let Mo=!1;function Fu(){if(Mo)return;const e={};for(const t in Eo)e[t]={isEnabled:n=>Eo[t].some(s=>!!n[s])};ca(e),Mo=!0}function Na(){return Fu(),Sd()}function _u(e){const t=Na();for(const n in e)t[n]={...t[n],...e[n]};ca(t)}const jn=m.createContext({});function Hu(e,t){if(Rn(e)){const{initial:n,animate:s}=e;return{initial:n===!1||It(n)?n:void 0,animate:It(s)?s:void 0}}return e.inherit!==!1?t:{}}function Wu(e){const{initial:t,animate:n}=Hu(e,m.useContext(jn));return m.useMemo(()=>({initial:t,animate:n}),[Do(t),Do(n)])}function Do(e){return Array.isArray(e)?e.join(" "):e}const pi=()=>({style:{},transform:{},transformOrigin:{},vars:{}});function Va(e,t,n){for(const s in t)!me(t[s])&&!ga(s,n)&&(e[s]=t[s])}function zu({transformTemplate:e},t){return m.useMemo(()=>{const n=pi();return di(n,t,e),Object.assign({},n.vars,n.style)},[t])}function Gu(e,t){const n=e.style||{},s={};return Va(s,n,e),Object.assign(s,zu(e,t)),s}function Uu(e,t){const n={},s=Gu(e,t);return e.drag&&e.dragListener!==!1&&(n.draggable=!1,s.userSelect=s.WebkitUserSelect=s.WebkitTouchCallout="none",s.touchAction=e.drag===!0?"none":`pan-${e.drag==="x"?"y":"x"}`),e.tabIndex===void 0&&(e.onTap||e.onTapStart||e.whileTap)&&(n.tabIndex=0),n.style=s,n}const Ia=()=>({...pi(),attrs:{}});function Ku(e,t,n,s){const i=m.useMemo(()=>{const r=Ia();return ba(r,t,xa(s),e.transformTemplate,e.style),{...r.attrs,style:{...r.style}}},[t]);if(e.style){const r={};Va(r,e.style,e),i.style={...r,...i.style}}return i}const Qu=new Set(["animate","exit","variants","initial","style","values","variants","transition","transformTemplate","custom","inherit","onBeforeLayoutMeasure","onAnimationStart","onAnimationComplete","onUpdate","onDragStart","onDrag","onDragEnd","onMeasureDragConstraints","onDirectionLock","onDragTransitionEnd","_dragX","_dragY","onHoverStart","onHoverEnd","onViewportEnter","onViewportLeave","globalTapTarget","propagate","ignoreStrict","viewport"]);function Pn(e){return e.startsWith("while")||e.startsWith("drag")&&e!=="draggable"||e.startsWith("layout")||e.startsWith("onTap")||e.startsWith("onPan")||e.startsWith("onLayout")||Qu.has(e)}function qu(e,t){return e.startsWith("on")?!Pn(e):t?.(e)??!Pn(e)}function Yu(e,t,n,s){const i={};for(const r in e)r==="values"&&typeof e.values=="object"||me(e[r])||(qu(r,s)||n===!0&&Pn(r)||!t&&!Pn(r)||e.draggable&&r.startsWith("onDrag"))&&(i[r]=e[r]);return i}const Xu=["animate","circle","defs","desc","ellipse","g","image","line","filter","marker","mask","metadata","path","pattern","polygon","polyline","rect","stop","switch","symbol","svg","text","tspan","use","view"];function mi(e){return typeof e!="string"||e.includes("-")?!1:!!(Xu.indexOf(e)>-1||/[A-Z]/u.test(e))}function Zu(e,t,n,{latestValues:s},i,r=!1,o,a){const l=(o??mi(e)?Ku:Uu)(t,s,i,e),h=Yu(t,typeof e=="string",r,a),f=e!==m.Fragment?{...h,...l,ref:n}:{},{children:u}=t,g=m.useMemo(()=>me(u)?u.get():u,[u]);return m.createElement(e,{...f,children:g})}function Ju({scrapeMotionValuesFromProps:e,createRenderState:t},n,s,i){return{latestValues:ef(n,s,i,e),renderState:t()}}function ef(e,t,n,s){const i={},r=s(e,{});for(const u in r)i[u]=mn(r[u]);let{initial:o,animate:a}=e;const c=Rn(e),l=aa(e);t&&l&&!c&&e.inherit!==!1&&(o===void 0&&(o=t.initial),a===void 0&&(a=t.animate));let h=n?n.initial===!1:!1;h=h||o===!1;const f=h?a:o;if(f&&typeof f!="boolean"&&!On(f)){const u=Array.isArray(f)?f:[f];for(let g=0;g<u.length;g++){const y=si(e,u[g]);if(y){const{transitionEnd:x,transition:p,...w}=y;for(const S in w){let v=w[S];if(Array.isArray(v)){const b=h?v.length-1:0;v=v[b]}v!==null&&(i[S]=v)}for(const S in x)i[S]=x[S]}}}return i}const Ba=e=>(t,n)=>{const s=m.useContext(jn),i=m.useContext(En),r=()=>Ju(e,t,s,i);return n?r():Hs(r)},tf=Ba({scrapeMotionValuesFromProps:ui,createRenderState:pi}),nf=Ba({scrapeMotionValuesFromProps:va,createRenderState:Ia}),sf=Symbol.for("motionComponentSymbol");function of(e,t,n){const s=m.useRef(n);m.useInsertionEffect(()=>{s.current=n});const i=m.useRef(null);return m.useCallback(r=>{r&&e.onMount?.(r),t&&(r?t.mount(r):t.unmount());const o=s.current;if(typeof o=="function")if(r){const a=o(r);typeof a=="function"&&(i.current=a)}else i.current?(i.current(),i.current=null):o(r);else o&&(o.current=r)},[t])}const $a=m.createContext({});function ut(e){return e&&typeof e=="object"&&Object.prototype.hasOwnProperty.call(e,"current")}function rf(e,t,n,s,i,r){const{visualElement:o}=m.useContext(jn),a=m.useContext(La),c=m.useContext(En),l=m.useContext(fi),h=l.reducedMotion,f=l.skipAnimations,u=m.useRef(null),g=m.useRef(!1);s=s||a.renderer,!u.current&&s&&(u.current=s(e,{visualState:t,parent:o,props:n,presenceContext:c,blockInitialAnimation:c?c.initial===!1:!1,reducedMotionConfig:h,skipAnimations:f,isSVG:r}),g.current&&u.current&&(u.current.manuallyAnimateOnMount=!0));const y=u.current,x=m.useContext($a);y&&!y.projection&&i&&(y.type==="html"||y.type==="svg")&&af(u.current,n,i,x);const p=m.useRef(!1);m.useInsertionEffect(()=>{y&&p.current&&y.update(n,c)});const w=n[qr],S=m.useRef(!!w&&typeof window<"u"&&!window.MotionHandoffIsComplete?.(w)&&window.MotionHasOptimisedAnimation?.(w));return bn(()=>{g.current=!0,y&&(p.current=!0,window.MotionIsMounted=!0,y.updateFeatures(),y.scheduleRenderMicrotask(),S.current&&y.animationState&&y.animationState.animateChanges())}),m.useEffect(()=>{y&&(!S.current&&y.animationState&&y.animationState.animateChanges(),S.current&&(queueMicrotask(()=>{window.MotionHandoffMarkAsComplete?.(w)}),S.current=!1),y.enteringChildren=void 0)}),y}function af(e,t,n,s){const{layoutId:i,layout:r,drag:o,dragConstraints:a,layoutScroll:c,layoutRoot:l,layoutAnchor:h,layoutCrossfade:f}=t;e.projection=new n(e.latestValues,t["data-framer-portal-id"]?void 0:Fa(e.parent)),e.projection.setOptions({layoutId:i,layout:r,alwaysMeasureLayout:!!o||a&&ut(a),visualElement:e,animationType:typeof r=="string"?r:"both",initialPromotionConfig:s,crossfade:f,layoutScroll:c,layoutRoot:l,layoutAnchor:h})}function Fa(e){if(e)return e.options.allowProjection!==!1?e.projection:Fa(e.parent)}function Qn(e,{forwardMotionProps:t=!1,type:n}={},s,i){s&&_u(s);const r=n?n==="svg":mi(e),o=r?nf:tf;function a(l,h){let f;const u={...m.useContext(fi),...l,layoutId:lf(l)},{isStatic:g,isValidProp:y}=u,x=Wu(l),p=o(l,g);if(!g&&typeof window<"u"){cf();const w=hf(u);f=w.MeasureLayout,x.visualElement=rf(e,p,u,i,w.ProjectionNode,r)}return d.jsxs(jn.Provider,{value:x,children:[f&&x.visualElement?d.jsx(f,{visualElement:x.visualElement,...u}):null,Zu(e,l,of(p,x.visualElement,h),p,g,t,r,y)]})}a.displayName=`motion.${typeof e=="string"?e:`create(${e.displayName??e.name??""})`}`;const c=m.forwardRef(a);return c[sf]=e,c}function lf({layoutId:e}){const t=m.useContext(_s).id;return t&&e!==void 0?t+"-"+e:e}function cf(e,t){m.useContext(La).strict}function hf(e){const t=Na(),{drag:n,layout:s}=t;if(!n&&!s)return{};const i={...n,...s};return{MeasureLayout:n?.isEnabled(e)||s?.isEnabled(e)?i.MeasureLayout:void 0,ProjectionNode:i.ProjectionNode}}function df(e,t){if(typeof Proxy>"u")return Qn;const n=new Map,s=(r,o)=>Qn(r,o,e,t),i=(r,o)=>s(r,o);return new Proxy(i,{get:(r,o)=>o==="create"?s:(n.has(o)||n.set(o,Qn(o,void 0,e,t)),n.get(o))})}const uf=(e,t)=>t.isSVG??mi(e)?new Fd(t):new Nd(t,{allowProjection:e!==m.Fragment});class ff extends Ye{constructor(t){super(t),t.animationState||(t.animationState=Gd(t))}updateAnimationControlsSubscription(){const{animate:t}=this.node.getProps();On(t)&&(this.unmountControls=t.subscribe(this.node))}mount(){this.updateAnimationControlsSubscription()}update(){const{animate:t}=this.node.getProps(),{animate:n}=this.node.prevProps||{};t!==n&&this.updateAnimationControlsSubscription()}unmount(){this.node.animationState.reset(),this.unmountControls?.()}}let pf=0;class mf extends Ye{constructor(){super(...arguments),this.id=pf++,this.isExitComplete=!1}update(){if(!this.node.presenceContext)return;const{isPresent:t,onExitComplete:n}=this.node.presenceContext,{isPresent:s}=this.node.prevPresenceContext||{};if(!this.node.animationState||t===s)return;if(t&&s===!1){if(this.isExitComplete){const{initial:r,custom:o}=this.node.getProps();if(typeof r=="string"||typeof r=="object"&&r!==null&&!Array.isArray(r)){const a=it(this.node,r,o);if(a){const{transition:c,transitionEnd:l,...h}=a;for(const f in h)this.node.getValue(f)?.jump(h[f])}}this.node.animationState.reset(),this.node.animationState.animateChanges()}else this.node.animationState.setActive("exit",!1);this.isExitComplete=!1;return}const i=this.node.animationState.setActive("exit",!t);n&&!t&&i.then(()=>{this.isExitComplete=!0,n(this.id)})}mount(){const{register:t,onExitComplete:n}=this.node.presenceContext||{};n&&n(this.id),t&&(this.unmount=t(this.id))}unmount(){}}const gf={animation:{Feature:ff},exit:{Feature:mf}};function Wt(e){return{point:{x:e.pageX,y:e.pageY}}}const yf=e=>t=>ai(t)&&e(t,Wt(t));function Ot(e,t,n,s){return Bt(e,t,yf(n),s)}const _a=({current:e})=>e?e.ownerDocument.defaultView:null,Oo=(e,t)=>Math.abs(e-t);function bf(e,t){const n=Oo(e.x,t.x),s=Oo(e.y,t.y);return Math.sqrt(n**2+s**2)}const Ro=new Set(["auto","scroll"]);class Ha{constructor(t,n,{transformPagePoint:s,contextWindow:i=window,dragSnapToOrigin:r=!1,distanceThreshold:o=3,element:a}={}){if(this.startEvent=null,this.lastMoveEvent=null,this.lastMoveEventInfo=null,this.lastRawMoveEventInfo=null,this.handlers={},this.contextWindow=window,this.scrollPositions=new Map,this.removeScrollListeners=null,this.onElementScroll=y=>{this.handleScroll(y.target)},this.onWindowScroll=()=>{this.handleScroll(window)},this.updatePoint=()=>{if(!(this.lastMoveEvent&&this.lastMoveEventInfo))return;this.lastRawMoveEventInfo&&(this.lastMoveEventInfo=Zt(this.lastRawMoveEventInfo,this.transformPagePoint));const y=qn(this.lastMoveEventInfo,this.history),x=this.startEvent!==null,p=bf(y.offset,{x:0,y:0})>=this.distanceThreshold;if(!x&&!p)return;const{point:w}=y,{timestamp:S}=pe;this.history.push({...w,timestamp:S});const{onStart:v,onMove:b}=this.handlers;x||(v&&v(this.lastMoveEvent,y),this.startEvent=this.lastMoveEvent),b&&b(this.lastMoveEvent,y)},this.handlePointerMove=(y,x)=>{this.lastMoveEvent=y,this.lastRawMoveEventInfo=x,this.lastMoveEventInfo=Zt(x,this.transformPagePoint),ee.update(this.updatePoint,!0)},this.handlePointerUp=(y,x)=>{this.end();const{onEnd:p,onSessionEnd:w,resumeAnimation:S}=this.handlers;if((this.dragSnapToOrigin||!this.startEvent)&&S&&S(),!(this.lastMoveEvent&&this.lastMoveEventInfo))return;const v=qn(y.type==="pointercancel"?this.lastMoveEventInfo:Zt(x,this.transformPagePoint),this.history);this.startEvent&&p&&p(y,v),w&&w(y,v)},!ai(t))return;this.dragSnapToOrigin=r,this.handlers=n,this.transformPagePoint=s,this.distanceThreshold=o,this.contextWindow=i||window;const c=Wt(t),l=Zt(c,this.transformPagePoint),{point:h}=l,{timestamp:f}=pe;this.history=[{...h,timestamp:f}];const{onSessionStart:u}=n;u&&u(t,qn(l,this.history));const g={passive:!0,capture:!0};this.removeListeners=Ft(Ot(this.contextWindow,"pointermove",this.handlePointerMove,g),Ot(this.contextWindow,"pointerup",this.handlePointerUp,g),Ot(this.contextWindow,"pointercancel",this.handlePointerUp,g)),a&&this.startScrollTracking(a)}startScrollTracking(t){let n=t.parentElement;for(;n;){const s=getComputedStyle(n);(Ro.has(s.overflowX)||Ro.has(s.overflowY))&&this.scrollPositions.set(n,{x:n.scrollLeft,y:n.scrollTop}),n=n.parentElement}this.scrollPositions.set(window,{x:window.scrollX,y:window.scrollY}),window.addEventListener("scroll",this.onElementScroll,{capture:!0}),window.addEventListener("scroll",this.onWindowScroll),this.removeScrollListeners=()=>{window.removeEventListener("scroll",this.onElementScroll,{capture:!0}),window.removeEventListener("scroll",this.onWindowScroll)}}handleScroll(t){const n=this.scrollPositions.get(t);if(!n)return;const s=t===window,i=s?{x:window.scrollX,y:window.scrollY}:{x:t.scrollLeft,y:t.scrollTop},r={x:i.x-n.x,y:i.y-n.y};r.x===0&&r.y===0||(s?this.lastMoveEventInfo&&(this.lastMoveEventInfo.point.x+=r.x,this.lastMoveEventInfo.point.y+=r.y):this.history.length>0&&(this.history[0].x-=r.x,this.history[0].y-=r.y),this.scrollPositions.set(t,i),ee.update(this.updatePoint,!0))}updateHandlers(t){this.handlers=t}end(){this.removeListeners&&this.removeListeners(),this.removeScrollListeners&&this.removeScrollListeners(),this.scrollPositions.clear(),qe(this.updatePoint)}}function Zt(e,t){return t?{point:t(e.point)}:e}function jo(e,t){return{x:e.x-t.x,y:e.y-t.y}}function qn({point:e},t){return{point:e,delta:jo(e,Wa(t)),offset:jo(e,wf(t)),velocity:xf(t,.1)}}function wf(e){return e[0]}function Wa(e){return e[e.length-1]}function xf(e,t){if(e.length<2)return{x:0,y:0};let n=e.length-1,s=null;const i=Wa(e);for(;n>=0&&(s=e[n],!(i.timestamp-s.timestamp>je(t)));)n--;if(!s)return{x:0,y:0};s===e[0]&&e.length>2&&i.timestamp-s.timestamp>je(t)*2&&(s=e[1]);const r=Oe(i.timestamp-s.timestamp);if(r===0)return{x:0,y:0};const o={x:(i.x-s.x)/r,y:(i.y-s.y)/r};return o.x===1/0&&(o.x=0),o.y===1/0&&(o.y=0),o}function vf(e,{min:t,max:n},s){return t!==void 0&&e<t?e=s?J(t,e,s.min):Math.max(e,t):n!==void 0&&e>n&&(e=s?J(n,e,s.max):Math.min(e,n)),e}function Lo(e,t,n){return{min:t!==void 0?e.min+t:void 0,max:n!==void 0?e.max+n-(e.max-e.min):void 0}}function kf(e,{top:t,left:n,bottom:s,right:i}){return{x:Lo(e.x,n,i),y:Lo(e.y,t,s)}}function No(e,t){let n=t.min-e.min,s=t.max-e.max;return t.max-t.min<e.max-e.min&&([n,s]=[s,n]),{min:n,max:s}}function Tf(e,t){return{x:No(e.x,t.x),y:No(e.y,t.y)}}function Sf(e,t){let n=.5;const s=be(e),i=be(t);return i>s?n=Nt(t.min,t.max-s,e.min):s>i&&(n=Nt(e.min,e.max-i,t.min)),We(0,1,n)}function Cf(e,t){const n={};return t.min!==void 0&&(n.min=t.min-e.min),t.max!==void 0&&(n.max=t.max-e.min),n}const Rs=.35;function Af(e=Rs){return e===!1?e=0:e===!0&&(e=Rs),{x:Vo(e,"left","right"),y:Vo(e,"top","bottom")}}function Vo(e,t,n){return{min:Io(e,t),max:Io(e,n)}}function Io(e,t){return typeof e=="number"?e:e[t]||0}const Pf=new WeakMap;class Ef{constructor(t){this.openDragLock=null,this.isDragging=!1,this.currentDirection=null,this.originPoint={x:0,y:0},this.constraints=!1,this.hasMutatedConstraints=!1,this.elastic=de(),this.latestPointerEvent=null,this.latestPanInfo=null,this.visualElement=t}start(t,{snapToCursor:n=!1,distanceThreshold:s}={}){const{presenceContext:i}=this.visualElement;if(i&&i.isPresent===!1)return;const r=f=>{n&&this.snapToCursor(Wt(f).point),this.stopAnimation()},o=(f,u)=>{const{drag:g,dragPropagation:y,onDragStart:x}=this.getProps();if(g&&!y&&(this.openDragLock&&this.openDragLock(),this.openDragLock=ed(g),!this.openDragLock))return;this.latestPointerEvent=f,this.latestPanInfo=u,this.isDragging=!0,this.currentDirection=null,this.resolveConstraints(),this.visualElement.projection&&(this.visualElement.projection.isAnimationBlocked=!0,this.visualElement.projection.target=void 0),$e(w=>{let S=this.getAxisMotionValue(w).get()||0;if(He.test(S)){const{projection:v}=this.visualElement;if(v&&v.layout){const b=v.layout.layoutBox[w];b&&(S=be(b)*(parseFloat(S)/100))}}this.originPoint[w]=S}),x&&ee.update(()=>x(f,u),!1,!0),ks(this.visualElement,"transform");const{animationState:p}=this.visualElement;p&&p.setActive("whileDrag",!0)},a=(f,u)=>{this.latestPointerEvent=f,this.latestPanInfo=u;const{dragPropagation:g,dragDirectionLock:y,onDirectionLock:x,onDrag:p}=this.getProps();if(!g&&!this.openDragLock)return;const{offset:w}=u;if(y&&this.currentDirection===null){this.currentDirection=Df(w),this.currentDirection!==null&&x&&x(this.currentDirection);return}this.updateAxis("x",u.point,w),this.updateAxis("y",u.point,w),this.visualElement.render(),p&&ee.update(()=>p(f,u),!1,!0)},c=(f,u)=>{this.latestPointerEvent=f,this.latestPanInfo=u,this.stop(f,u),this.latestPointerEvent=null,this.latestPanInfo=null},l=()=>{const{dragSnapToOrigin:f}=this.getProps();(f||this.constraints)&&this.startAnimation({x:0,y:0})},{dragSnapToOrigin:h}=this.getProps();this.panSession=new Ha(t,{onSessionStart:r,onStart:o,onMove:a,onSessionEnd:c,resumeAnimation:l},{transformPagePoint:this.visualElement.getTransformPagePoint(),dragSnapToOrigin:h,distanceThreshold:s,contextWindow:_a(this.visualElement),element:this.visualElement.current})}stop(t,n){const s=t||this.latestPointerEvent,i=n||this.latestPanInfo,r=this.isDragging;if(this.cancel(),!r||!i||!s)return;const{velocity:o}=i;this.startAnimation(o);const{onDragEnd:a}=this.getProps();a&&ee.postRender(()=>a(s,i))}cancel(){this.isDragging=!1;const{projection:t,animationState:n}=this.visualElement;t&&(t.isAnimationBlocked=!1),this.endPanSession();const{dragPropagation:s}=this.getProps();!s&&this.openDragLock&&(this.openDragLock(),this.openDragLock=null),n&&n.setActive("whileDrag",!1)}endPanSession(){this.panSession&&this.panSession.end(),this.panSession=void 0}updateAxis(t,n,s){const{drag:i}=this.getProps();if(!s||!Jt(t,i,this.currentDirection))return;const r=this.getAxisMotionValue(t);let o=this.originPoint[t]+s[t];this.constraints&&this.constraints[t]&&(o=vf(o,this.constraints[t],this.elastic[t])),r.set(o)}resolveConstraints(){const{dragConstraints:t,dragElastic:n}=this.getProps(),s=this.visualElement.projection&&!this.visualElement.projection.layout?this.visualElement.projection.measure(!1):this.visualElement.projection?.layout,i=this.constraints;t&&ut(t)?this.constraints||(this.constraints=this.resolveRefConstraints()):t&&s?this.constraints=kf(s.layoutBox,t):this.constraints=!1,this.elastic=Af(n),i!==this.constraints&&!ut(t)&&s&&this.constraints&&!this.hasMutatedConstraints&&$e(r=>{this.constraints!==!1&&this.getAxisMotionValue(r)&&(this.constraints[r]=Cf(s.layoutBox[r],this.constraints[r]))})}resolveRefConstraints(){const{dragConstraints:t,onMeasureDragConstraints:n}=this.getProps();if(!t||!ut(t))return!1;const s=t.current,{projection:i}=this.visualElement;if(!i||!i.layout)return!1;i.root&&(i.root.scroll=void 0,i.root.updateScroll());const r=Md(s,i.root,this.visualElement.getTransformPagePoint());let o=Tf(i.layout.layoutBox,r);if(n){const a=n(Ad(o));this.hasMutatedConstraints=!!a,a&&(o=da(a))}return o}startAnimation(t){const{drag:n,dragMomentum:s,dragElastic:i,dragTransition:r,dragSnapToOrigin:o,onDragTransitionEnd:a}=this.getProps(),c=this.constraints||{},l=$e(h=>{if(!Jt(h,n,this.currentDirection))return;let f=c&&c[h]||{};(o===!0||o===h)&&(f={min:0,max:0});const u=i?200:1e6,g=i?40:1e7,y={type:"inertia",velocity:s?t[h]:0,bounceStiffness:u,bounceDamping:g,timeConstant:750,restDelta:1,restSpeed:10,...r,...f};return this.startAxisValueAnimation(h,y)});return Promise.all(l).then(a)}startAxisValueAnimation(t,n){const s=this.getAxisMotionValue(t);return ks(this.visualElement,t),s.start(ni(t,s,0,n,this.visualElement,!1))}stopAnimation(){$e(t=>this.getAxisMotionValue(t).stop())}getAxisMotionValue(t){const n=`_drag${t.toUpperCase()}`,i=this.visualElement.getProps()[n];return i||this.visualElement.getValue(t,this.visualElement.latestValues[t]??0)}snapToCursor(t){$e(n=>{const{drag:s}=this.getProps();if(!Jt(n,s,this.currentDirection))return;const{projection:i}=this.visualElement,r=this.getAxisMotionValue(n);if(i&&i.layout){const{min:o,max:a}=i.layout.layoutBox[n],c=r.get()||0;r.set(t[n]-J(o,a,.5)+c)}})}scalePositionWithinConstraints(){if(!this.visualElement.current)return;const{drag:t,dragConstraints:n}=this.getProps(),{projection:s}=this.visualElement;if(!ut(n)||!s||!this.constraints)return;this.stopAnimation();const i={x:0,y:0};$e(o=>{const a=this.getAxisMotionValue(o);if(a&&this.constraints!==!1){const c=a.get();i[o]=Sf({min:c,max:c},this.constraints[o])}});const{transformTemplate:r}=this.visualElement.getProps();this.visualElement.current.style.transform=r?r({},""):"none",s.root&&s.root.updateScroll(),s.updateLayout(),this.constraints=!1,this.resolveConstraints(),$e(o=>{if(!Jt(o,t,null))return;const a=this.getAxisMotionValue(o),{min:c,max:l}=this.constraints[o];a.set(J(c,l,i[o]))}),this.visualElement.render()}addListeners(){if(!this.visualElement.current)return;Pf.set(this.visualElement,this);const t=this.visualElement.current,n=Ot(t,"pointerdown",l=>{const{drag:h,dragListener:f=!0}=this.getProps(),u=l.target,g=u!==t&&rd(u);h&&f&&!g&&this.start(l)});let s;const i=()=>{const{dragConstraints:l}=this.getProps();ut(l)&&l.current&&(this.constraints=this.resolveRefConstraints(),s||(s=Mf(t,l.current,()=>this.scalePositionWithinConstraints())))},{projection:r}=this.visualElement,o=r.addEventListener("measure",i);r&&!r.layout&&(r.root&&r.root.updateScroll(),r.updateLayout()),ee.read(i);const a=Bt(window,"resize",()=>this.scalePositionWithinConstraints()),c=r.addEventListener("didUpdate",(({delta:l,hasLayoutChanged:h})=>{this.isDragging&&h&&($e(f=>{const u=this.getAxisMotionValue(f);u&&(this.originPoint[f]+=l[f].translate,u.set(u.get()+l[f].translate))}),this.visualElement.render())}));return()=>{a(),n(),o(),c&&c(),s&&s()}}getProps(){const t=this.visualElement.getProps(),{drag:n=!1,dragDirectionLock:s=!1,dragPropagation:i=!1,dragConstraints:r=!1,dragElastic:o=Rs,dragMomentum:a=!0}=t;return{...t,drag:n,dragDirectionLock:s,dragPropagation:i,dragConstraints:r,dragElastic:o,dragMomentum:a}}}function Bo(e){let t=!0;return()=>{if(t){t=!1;return}e()}}function Mf(e,t,n){const s=zi(e,Bo(n)),i=zi(t,Bo(n));return()=>{s(),i()}}function Jt(e,t,n){return(t===!0||t===e)&&(n===null||n===e)}function Df(e,t=10){let n=null;return Math.abs(e.y)>t?n="y":Math.abs(e.x)>t&&(n="x"),n}class Of extends Ye{constructor(t){super(t),this.removeGroupControls=Re,this.removeListeners=Re,this.controls=new Ef(t)}mount(){const{dragControls:t}=this.node.getProps();t&&(this.removeGroupControls=t.subscribe(this.controls)),this.removeListeners=this.controls.addListeners()||Re}update(){const{dragControls:t}=this.node.getProps(),{dragControls:n}=this.node.prevProps||{};t!==n&&(this.removeGroupControls(),t&&(this.removeGroupControls=t.subscribe(this.controls)))}unmount(){this.removeGroupControls(),this.removeListeners(),this.controls.isDragging||this.controls.endPanSession()}}const Yn=e=>(t,n)=>{e&&ee.update(()=>e(t,n),!1,!0)};class Rf extends Ye{constructor(){super(...arguments),this.removePointerDownListener=Re}onPointerDown(t){this.session=new Ha(t,this.createPanHandlers(),{transformPagePoint:this.node.getTransformPagePoint(),contextWindow:_a(this.node)})}createPanHandlers(){const{onPanSessionStart:t,onPanStart:n,onPan:s,onPanEnd:i}=this.node.getProps();return{onSessionStart:Yn(t),onStart:Yn(n),onMove:Yn(s),onEnd:(r,o)=>{delete this.session,i&&ee.postRender(()=>i(r,o))}}}mount(){this.removePointerDownListener=Ot(this.node.current,"pointerdown",t=>this.onPointerDown(t))}update(){this.session&&this.session.updateHandlers(this.createPanHandlers())}unmount(){this.removePointerDownListener(),this.session&&this.session.end()}}let Xn=!1;class jf extends m.Component{componentDidMount(){const{visualElement:t,layoutGroup:n,switchLayoutGroup:s,layoutId:i}=this.props,{projection:r}=t;r&&(n.group&&n.group.add(r),s&&s.register&&i&&s.register(r),Xn&&r.root.didUpdate(),r.addEventListener("animationComplete",()=>{this.safeToRemove()}),r.setOptions({...r.options,layoutDependency:this.props.layoutDependency,onExitComplete:()=>this.safeToRemove()})),gn.hasEverUpdated=!0}getSnapshotBeforeUpdate(t){const{layoutDependency:n,visualElement:s,drag:i,isPresent:r}=this.props,{projection:o}=s;return o&&(o.isPresent=r,t.layoutDependency!==n&&o.setOptions({...o.options,layoutDependency:n}),Xn=!0,i||t.layoutDependency!==n||n===void 0||t.isPresent!==r?o.willUpdate():this.safeToRemove(),t.isPresent!==r&&(r?o.promote():o.relegate()||ee.postRender(()=>{const a=o.getStack();(!a||!a.members.length)&&this.safeToRemove()}))),null}componentDidUpdate(){const{visualElement:t,layoutAnchor:n}=this.props,{projection:s}=t;s&&(s.options.layoutAnchor=n,s.root.didUpdate(),ri.postRender(()=>{!s.currentAnimation&&s.isLead()&&this.safeToRemove()}))}componentWillUnmount(){const{visualElement:t,layoutGroup:n,switchLayoutGroup:s}=this.props,{projection:i}=t;Xn=!0,i&&(i.scheduleCheckAfterUnmount(),n&&n.group&&n.group.remove(i),s&&s.deregister&&s.deregister(i))}safeToRemove(){const{safeToRemove:t}=this.props;t&&t()}render(){return null}}function za(e){const[t,n]=ja(),s=m.useContext(_s);return d.jsx(jf,{...e,layoutGroup:s,switchLayoutGroup:m.useContext($a),isPresent:t,safeToRemove:n})}const Lf={pan:{Feature:Rf},drag:{Feature:Of,ProjectionNode:Ra,MeasureLayout:za}};function $o(e,t,n){const{props:s}=e;e.animationState&&s.whileHover&&e.animationState.setActive("whileHover",n==="Start");const i="onHover"+n,r=s[i];r&&ee.postRender(()=>r(t,Wt(t)))}class Nf extends Ye{mount(){const{current:t}=this.node;t&&(this.unmount=nd(t,(n,s)=>($o(this.node,s,"Start"),i=>$o(this.node,i,"End"))))}unmount(){}}class Vf extends Ye{constructor(){super(...arguments),this.isActive=!1}onFocus(){let t=!1;try{t=this.node.current.matches(":focus-visible")}catch{t=!0}!t||!this.node.animationState||(this.node.animationState.setActive("whileFocus",!0),this.isActive=!0)}onBlur(){!this.isActive||!this.node.animationState||(this.node.animationState.setActive("whileFocus",!1),this.isActive=!1)}mount(){this.unmount=Ft(Bt(this.node.current,"focus",()=>this.onFocus()),Bt(this.node.current,"blur",()=>this.onBlur()))}unmount(){}}function Fo(e,t,n){const{props:s}=e;if(e.current instanceof HTMLButtonElement&&e.current.disabled)return;e.animationState&&s.whileTap&&e.animationState.setActive("whileTap",n==="Start");const i="onTap"+(n==="End"?"":n),r=s[i];r&&ee.postRender(()=>r(t,Wt(t)))}class If extends Ye{mount(){const{current:t}=this.node;if(!t)return;const{globalTapTarget:n,propagate:s}=this.node.props;this.unmount=ld(t,(i,r)=>(Fo(this.node,r,"Start"),(o,{success:a})=>Fo(this.node,o,a?"End":"Cancel")),{useGlobalTarget:n,stopPropagation:s?.tap===!1})}unmount(){}}const js=new WeakMap,Zn=new WeakMap,Bf=e=>{const t=js.get(e.target);t&&t(e)},$f=e=>{e.forEach(Bf)};function Ff({root:e,...t}){const n=e||document;Zn.has(n)||Zn.set(n,{});const s=Zn.get(n),i=JSON.stringify(t);return s[i]||(s[i]=new IntersectionObserver($f,{root:e,...t})),s[i]}function _f(e,t,n){const s=Ff(t);return js.set(e,n),s.observe(e),()=>{js.delete(e),s.unobserve(e)}}const Hf={some:0,all:1};class Wf extends Ye{constructor(){super(...arguments),this.hasEnteredView=!1,this.isInView=!1}startObserver(){this.stopObserver?.();const{viewport:t={}}=this.node.getProps(),{root:n,margin:s,amount:i="some",once:r}=t,o={root:n?n.current:void 0,rootMargin:s,threshold:typeof i=="number"?i:Hf[i]},a=c=>{const{isIntersecting:l}=c;if(this.isInView===l||(this.isInView=l,r&&!l&&this.hasEnteredView))return;l&&(this.hasEnteredView=!0),this.node.animationState&&this.node.animationState.setActive("whileInView",l);const{onViewportEnter:h,onViewportLeave:f}=this.node.getProps(),u=l?h:f;u&&u(c)};this.stopObserver=_f(this.node.current,o,a)}mount(){this.startObserver()}update(){if(typeof IntersectionObserver>"u")return;const{props:t,prevProps:n}=this.node;["amount","margin","root"].some(zf(t,n))&&this.startObserver()}unmount(){this.stopObserver?.(),this.hasEnteredView=!1,this.isInView=!1}}function zf({viewport:e={}},{viewport:t={}}={}){return n=>e[n]!==t[n]}const Gf={inView:{Feature:Wf},tap:{Feature:If},focus:{Feature:Vf},hover:{Feature:Nf}},Uf={layout:{ProjectionNode:Ra,MeasureLayout:za}},Kf={...gf,...Gf,...Lf,...Uf},Qf=df(Kf,uf),qf=Qf,ie={head:{len:18,span:12},secondaryScale:.85,gap:0,stroke:{own:1.4,ownHover:2.6,refFactor:.75},dash:"5 4",kinds:{"own-fwd":{color:we.ownFwd,heads:"end",headDirection:"forward",dashed:!1,secondary:!1,label:"A owns B"},"own-bkwd":{color:we.ownBkwd,heads:"end",headDirection:"backward",dashed:!1,secondary:!1,label:"A belongs to B"},association:{color:we.association,heads:"both",headDirection:"forward",dashed:!0,secondary:!0,label:"A and B are associated"}}};function Yf(e){return e==="forward"?"M0,0 L10,3.5 L0,7 Z":"M10,0 L0,3.5 L10,7 Z"}function yn(e,t=1){const{len:n,span:s}=ie.head;return{viewBox:"0 0 10 7",refX:0,refY:3.5,markerWidth:n*t,markerHeight:s*t,markerUnits:"userSpaceOnUse",orient:"auto-start-reverse",d:Yf(e)}}function _o(e){const t=ie.kinds[e].secondary?ie.secondaryScale:1;return ie.head.len*t+ie.gap}function en(e){throw new Error('Could not dynamically require "'+e+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var Jn={exports:{}},Ho;function Xf(){return Ho||(Ho=1,(function(e,t){(function(n){e.exports=n()})(function(){return(function(){function n(s,i,r){function o(l,h){if(!i[l]){if(!s[l]){var f=typeof en=="function"&&en;if(!h&&f)return f(l,!0);if(a)return a(l,!0);var u=new Error("Cannot find module '"+l+"'");throw u.code="MODULE_NOT_FOUND",u}var g=i[l]={exports:{}};s[l][0].call(g.exports,function(y){var x=s[l][1][y];return o(x||y)},g,g.exports,n,s,i,r)}return i[l].exports}for(var a=typeof en=="function"&&en,c=0;c<r.length;c++)o(r[c]);return o}return n})()({1:[function(n,s,i){Object.defineProperty(i,"__esModule",{value:!0}),i.default=void 0;function r(u){"@babel/helpers - typeof";return r=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(g){return typeof g}:function(g){return g&&typeof Symbol=="function"&&g.constructor===Symbol&&g!==Symbol.prototype?"symbol":typeof g},r(u)}function o(u,g){if(!(u instanceof g))throw new TypeError("Cannot call a class as a function")}function a(u,g){for(var y=0;y<g.length;y++){var x=g[y];x.enumerable=x.enumerable||!1,x.configurable=!0,"value"in x&&(x.writable=!0),Object.defineProperty(u,l(x.key),x)}}function c(u,g,y){return g&&a(u.prototype,g),Object.defineProperty(u,"prototype",{writable:!1}),u}function l(u){var g=h(u,"string");return r(g)=="symbol"?g:g+""}function h(u,g){if(r(u)!="object"||!u)return u;var y=u[Symbol.toPrimitive];if(y!==void 0){var x=y.call(u,g);if(r(x)!="object")return x;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(u)}i.default=(function(){function u(){var g=this,y=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},x=y.defaultLayoutOptions,p=x===void 0?{}:x,w=y.algorithms,S=w===void 0?["layered","stress","mrtree","radial","force","disco","sporeOverlap","sporeCompaction","rectpacking"]:w,v=y.workerFactory,b=y.workerUrl;if(o(this,u),this.defaultLayoutOptions=p,this.initialized=!1,typeof b>"u"&&typeof v>"u")throw new Error("Cannot construct an ELK without both 'workerUrl' and 'workerFactory'.");var k=v;typeof b<"u"&&typeof v>"u"&&(k=function(E){return new Worker(E)});var A=k(b);if(typeof A.postMessage!="function")throw new TypeError("Created worker does not provide the required 'postMessage' function.");this.worker=new f(A),this.worker.postMessage({cmd:"register",algorithms:S}).then(function(C){return g.initialized=!0}).catch(console.err)}return c(u,[{key:"layout",value:function(y){var x=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},p=x.layoutOptions,w=p===void 0?this.defaultLayoutOptions:p,S=x.logging,v=S===void 0?!1:S,b=x.measureExecutionTime,k=b===void 0?!1:b;return y?this.worker.postMessage({cmd:"layout",graph:y,layoutOptions:w,options:{logging:v,measureExecutionTime:k}}):Promise.reject(new Error("Missing mandatory parameter 'graph'."))}},{key:"knownLayoutAlgorithms",value:function(){return this.worker.postMessage({cmd:"algorithms"})}},{key:"knownLayoutOptions",value:function(){return this.worker.postMessage({cmd:"options"})}},{key:"knownLayoutCategories",value:function(){return this.worker.postMessage({cmd:"categories"})}},{key:"terminateWorker",value:function(){this.worker&&this.worker.terminate()}}])})();var f=(function(){function u(g){var y=this;if(o(this,u),g===void 0)throw new Error("Missing mandatory parameter 'worker'.");this.resolvers={},this.worker=g,this.worker.onmessage=function(x){setTimeout(function(){y.receive(y,x)},0)}}return c(u,[{key:"postMessage",value:function(y){var x=this.id||0;this.id=x+1,y.id=x;var p=this;return new Promise(function(w,S){p.resolvers[x]=function(v,b){v?(p.convertGwtStyleError(v),S(v)):w(b)},p.worker.postMessage(y)})}},{key:"receive",value:function(y,x){var p=x.data,w=y.resolvers[p.id];w&&(delete y.resolvers[p.id],p.error?w(p.error):w(null,p.data))}},{key:"terminate",value:function(){this.worker&&this.worker.terminate()}},{key:"convertGwtStyleError",value:function(y){if(y){var x=y.__java$exception;x&&(x.cause&&x.cause.backingJsObject&&(y.cause=x.cause.backingJsObject,this.convertGwtStyleError(y.cause)),delete y.__java$exception)}}}])})()},{}],2:[function(n,s,i){var r=n("./elk-api.js").default;Object.defineProperty(s.exports,"__esModule",{value:!0}),s.exports=r,r.default=r},{"./elk-api.js":1}]},{},[2])(2)})})(Jn)),Jn.exports}var Zf=Xf();const Jf=Sl(Zf),ep="/dynamic-model-var-docs/assets/elk-worker.min-r_yRvuMO.js";class tp{elk=null;ensure(){return this.elk||(this.elk=new Jf({workerUrl:ep})),this.elk}async layout(t,n={}){const{direction:s="DOWN",nodeSpacing:i=32,layerSpacing:r=56,usePartitions:o=!1,extraLayoutOptions:a={}}=n,c={id:"root",layoutOptions:{"elk.algorithm":"layered","elk.direction":s,"elk.spacing.nodeNode":String(i),"elk.layered.spacing.nodeNodeBetweenLayers":String(r),"elk.edgeRouting":"ORTHOGONAL","elk.layered.considerModelOrder.strategy":"NODES_AND_EDGES",...o?{"elk.partitioning.activate":"true"}:{},...a},children:t.nodes.map(p=>({id:p.id,width:p.width,height:p.height,...p.ports?.length?{ports:p.ports.map(w=>({id:w.id,x:w.x,y:w.y,width:0,height:0}))}:{},...o&&p.partition!==void 0||p.ports?.length?{layoutOptions:{...o&&p.partition!==void 0?{"elk.partitioning.partition":String(p.partition)}:{},...p.ports?.length?{"elk.portConstraints":"FIXED_POS"}:{}}}:{}})),edges:t.edges.filter(p=>p.source!==p.target).map(p=>({id:p.id,sources:[p.sourcePort??p.source],targets:[p.targetPort??p.target]}))},l=new Map(t.edges.map(p=>[p.id,p]));this.elk;const h=performance.now(),f=await this.ensure().layout(c);performance.now()-h,t.nodes.length,t.edges.length;const u=(f.children??[]).map(p=>({id:p.id,x:p.x??0,y:p.y??0,width:p.width??0,height:p.height??0})),g=(f.edges??[]).map(p=>{const w=l.get(p.id);if(!w)throw new Error(`ELK returned unknown edge id: ${p.id}`);return{id:p.id,source:w.source,target:w.target,sections:p.sections}}),y=Math.max(0,...u.map(p=>p.x+p.width)),x=Math.max(0,...u.map(p=>p.y+p.height));return{nodes:u,edges:g,width:y,height:x}}cancel(){this.elk&&(this.elk.terminateWorker(),this.elk=null)}dispose(){this.cancel()}}function tn(e){if(!e?.length)return[];const t=e[0];return[t.startPoint,...t.bendPoints??[],t.endPoint]}function Wo(e,t,n){const s=t.x-e.x,i=t.y-e.y,r=Math.hypot(s,i);if(r<1e-6)return{...e};const o=Math.min(n,r/2)/r;return{x:e.x+s*o,y:e.y+i*o}}function np(e,t){if(e.length<2)return sp(e);let n=`M${e[0].x},${e[0].y}`;for(let i=1;i<e.length-1;i++){const r=Wo(e[i],e[i-1],t),o=Wo(e[i],e[i+1],t);n+=`L${r.x},${r.y}Q${e[i].x},${e[i].y} ${o.x},${o.y}`}const s=e[e.length-1];return`${n}L${s.x},${s.y}`}function sp(e){return e.length?e.map((t,n)=>`${n===0?"M":"L"}${t.x},${t.y}`).join(""):""}function ip(e,t){let n=0,s=e.length-1,i=e[e.length-1];for(let r=e.length-1;r>0;r--){const o=Math.hypot(e[r].x-e[r-1].x,e[r].y-e[r-1].y);if(n+o>=t){const a=(t-n)/o;i={x:e[r].x+(e[r-1].x-e[r].x)*a,y:e[r].y+(e[r-1].y-e[r].y)*a},s=r-1;break}n+=o,s=r-1}return{cut:s,cutPoint:i}}function op(e,t,n,s){if(e.length<2||n<=0)return s(e);const{cut:i,cutPoint:r}=ip(e,n),o=e.slice(0,i+1),a=o[o.length-1],c=a&&Math.abs(a.x-r.x)<1e-6&&Math.abs(a.y-r.y)<1e-6;return s([...o,...c?[]:[r],t])}function rp(e,t=1.5){if(e.length<3)return e;const n=[e[0]];for(let s=1;s<e.length-1;s++){const i=n[n.length-1],r=e[s],o=e[s+1],a=o.x-i.x,c=o.y-i.y,l=Math.hypot(a,c);(l<1e-6?Math.hypot(r.x-i.x,r.y-i.y):Math.abs(c*r.x-a*r.y+o.x*i.y-o.y*i.x)/l)>t&&n.push(r)}return n.push(e[e.length-1]),n}function ap(e,t,n,s){const i=Math.hypot(t.x,t.y)||1,r=t.x/i,o=t.y/i,a=-o,c=r,l=n/2,h={x:e.x+a*l,y:e.y+c*l},f={x:e.x-a*l,y:e.y-c*l},u={x:e.x+r*s,y:e.y+o*s};return`M${h.x},${h.y}L${u.x},${u.y}L${f.x},${f.y}Z`}function lp(e,t,n,s,i=16){const r={x:e.x+n.x*i,y:e.y+n.y*i},o={x:t.x+s.x*i,y:t.y+s.y*i},a=[e,r];if(Math.abs(n.x)>.5){const c=(r.x+o.x)/2;Math.abs(r.y-o.y)>.5&&a.push({x:c,y:r.y},{x:c,y:o.y})}else{const c=(r.y+o.y)/2;Math.abs(r.x-o.x)>.5&&a.push({x:r.x,y:c},{x:o.x,y:c})}return a.push(o,t),rp(a)}function cp(e,t={}){const n=m.useRef(null);n.current||(n.current=new tp);const[s,i]=m.useState(null),[r,o]=m.useState(!1),a=JSON.stringify(t);m.useEffect(()=>{const h=n.current;if(!e||e.nodes.length===0){i(null),o(!1);return}let f=!1;return o(!0),h.layout(e,JSON.parse(a)).then(u=>{f||(i({spec:e,layout:u}),o(!1))},u=>{f||(o(!1),console.error("graph-core layout failed:",u))}),()=>{f=!0,h.cancel()}},[e,a]),m.useEffect(()=>()=>n.current?.dispose(),[]);const c=!!e&&e.nodes.length>0,l=!s||s.spec!==e;return{latest:s,inProgress:(r||l)&&c}}const hp=300,dp=100,up=200,fp=75,pp=250,mp=120,gp=200,yp=[.65,0,.35,1],nn=e=>e/1e3,bp=()=>typeof window<"u"&&typeof window.matchMedia=="function"&&window.matchMedia("(prefers-reduced-motion: reduce)").matches,zt=e=>()=>bp()?0:e,Ga=zt(hp),zo=zt(dp),wp=zt(up),xp=zt(fp),vp=zt(pp),sn=()=>mp,Go=.5;function kp(e={}){const{min:t=.2,max:n=2}=e,s=m.useRef(null),i=m.useRef(null),r=m.useRef(null),o=m.useRef(1),a=m.useRef({w:0,h:0}),c=m.useRef(null),l=m.useRef(null),h=m.useRef(!0),f=m.useRef(!0),u=m.useCallback(()=>{const v=s.current;return v?{x:v.clientWidth*Go,y:v.clientHeight*Go}:{x:0,y:0}},[]),g=m.useCallback(v=>{const b=i.current;if(b){const{x:k,y:A}=u();b.style.transition=v?`width ${v}ms, height ${v}ms`:"",b.style.padding=`${A}px ${k}px`,b.style.width=`${a.current.w*o.current+2*k}px`,b.style.height=`${a.current.h*o.current+2*A}px`}},[u]),y=m.useCallback((v,b)=>{o.current=Math.min(n,Math.max(t,v));const k=b?Ga():0;c.current&&cancelAnimationFrame(c.current),c.current=requestAnimationFrame(()=>{c.current=null;const A=r.current;A&&(A.style.transition=k?`transform ${k}ms`:"",A.style.transform=`scale(${o.current})`)}),l.current&&(clearTimeout(l.current),l.current=null),k?g(k):l.current=setTimeout(()=>{l.current=null,g(0)},100)},[t,n,g]),x=m.useCallback((v,b=!0)=>{h.current=!1,y(v,b)},[y]),p=m.useCallback(v=>x(o.current*v),[x]),w=m.useCallback((v,b)=>{a.current={w:v,h:b};const k=r.current;k&&(k.style.width=`${v}px`,k.style.height=`${b}px`,k.style.transformOrigin="0 0",k.style.transform=`scale(${o.current})`),g(0)},[g]),S=m.useCallback(()=>{const v=s.current,{w:b,h:k}=a.current;if(!v||!b||!k)return;h.current=!0;const A=!f.current;f.current=!1,y(Math.min(v.clientWidth/b,v.clientHeight/k,1),A),requestAnimationFrame(()=>{const{x:C,y:E}=u();typeof v.scrollTo=="function"?v.scrollTo({left:C,top:E,behavior:A?"smooth":"auto"}):(v.scrollLeft=C,v.scrollTop=E)})},[y,u]);return m.useEffect(()=>{const v=s.current;if(!v)return;const b=k=>{!k.ctrlKey&&!k.metaKey||(k.preventDefault(),x(o.current*(1-k.deltaY*.005),!1))};return v.addEventListener("wheel",b,{passive:!1}),()=>v.removeEventListener("wheel",b)},[x]),m.useEffect(()=>{const v=s.current;if(!v)return;let b=!1,k=0,A=0,C=0,E=0,L=!1;const I=B=>B instanceof Element&&!B.closest("[data-pan-ignore]"),K=B=>{B.button!==0||!I(B.target)||(b=!0,L=!1,k=B.clientX,A=B.clientY,C=v.scrollLeft,E=v.scrollTop,v.style.cursor="grabbing")},_=B=>{if(!b)return;const Y=B.clientX-k,Z=B.clientY-A;!L&&Math.hypot(Y,Z)<3||(L||(L=!0,v.setPointerCapture(B.pointerId)),B.preventDefault(),v.scrollLeft=C-Y,v.scrollTop=E-Z)},R=B=>{b&&(b=!1,v.style.cursor="",v.hasPointerCapture(B.pointerId)&&v.releasePointerCapture(B.pointerId))};return v.addEventListener("pointerdown",K),v.addEventListener("pointermove",_),v.addEventListener("pointerup",R),v.addEventListener("pointercancel",R),()=>{v.removeEventListener("pointerdown",K),v.removeEventListener("pointermove",_),v.removeEventListener("pointerup",R),v.removeEventListener("pointercancel",R)}},[]),{containerRef:s,spacerRef:i,wrapperRef:r,applyZoom:x,zoomBy:p,zoomToFit:S,getZoom:()=>o.current,isAutoFit:()=>h.current,setContentSize:w}}const Tp=2,Sp=.5;function gi({kind:e,width:t=44,className:n}){const s=m.useId().replace(/:/g,""),i=ie.kinds[e],r=Sp*(i.secondary?ie.secondaryScale:1),{d:o,...a}=yn(i.headDirection,r),c=a.markerWidth,l=`es-${s}`,h=i.heads==="both"?1+c:1,f=t-1-c;return d.jsxs("svg",{width:t,height:"14",viewBox:`0 0 ${t} 14`,className:`shrink-0 ${n??""}`,"aria-hidden":!0,children:[d.jsx("defs",{children:d.jsx("marker",{id:l,...a,children:d.jsx("path",{d:o,fill:i.color})})}),d.jsx("line",{x1:h,y1:"7",x2:f,y2:"7",stroke:i.color,strokeWidth:Tp,strokeDasharray:i.dashed?ie.dash:void 0,markerStart:i.heads==="both"?`url(#${l})`:void 0,markerEnd:`url(#${l})`})]})}const Ua={"owned-mine":{side:"left",kind:"own-bkwd"},"owned-theirs":{side:"left",kind:"own-fwd"},"owns-mine":{side:"right",kind:"own-fwd"},"owns-theirs":{side:"right",kind:"own-bkwd"},association:{side:"left",kind:"association"}},Cp=300,Ls=new Set;let Rt;function yi(){Rt!==void 0&&(clearTimeout(Rt),Rt=void 0)}function At(e){yi();for(const t of Ls)t(e)}function Ka(){yi(),Rt=setTimeout(()=>{Rt=void 0,At(null)},Cp)}function Ap({label:e,rows:t,onAdd:n,onRemove:s,onInspect:i,colorOf:r,slotOrder:o,parentOf:a}){const[c,l]=m.useState(null),[h,f]=m.useState(null),u=m.useRef(null),g=m.useRef(null),y=m.useId();m.useEffect(()=>{const k=A=>{A!==y&&(l(null),f(null))};return Ls.add(k),()=>{Ls.delete(k)}},[y]),m.useEffect(()=>{if(!c)return;const k=C=>{C.target?.closest("[data-relation-bar]")||At(null)},A=C=>{C.key==="Escape"&&At(null)};return document.addEventListener("mousedown",k,!0),document.addEventListener("keydown",A),()=>{document.removeEventListener("mousedown",k,!0),document.removeEventListener("keydown",A)}},[c]);const x=k=>t.filter(A=>Ua[A.position].side===k),p=k=>new Set(x(k).map(A=>A.other)).size,w=p("left"),S=p("right");if(w===0&&S===0)return null;const v=(k,A)=>{const C=A?.getBoundingClientRect();C&&(At(y),l(k),f({x:C.left,y:C.bottom+2}))},b=(k,A,C)=>{const E=c===k;return d.jsx("button",{ref:C,"data-relation-bar":!0,"data-no-drag":!0,disabled:A===0,"aria-label":k==="left"?`${A} classes ${e} belongs to`:`${A} classes ${e} owns`,onMouseEnter:()=>A>0&&v(k,C.current),onMouseLeave:Ka,onClick:L=>{L.stopPropagation(),A!==0&&(E?At(null):v(k,C.current))},className:`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] leading-none
                    tabular-nums transition-colors
                    ${A===0?"text-gray-300 dark:text-slate-600 cursor-default":E?"bg-sky-200 dark:bg-sky-800 text-sky-900 dark:text-sky-100":"text-sky-800 dark:text-sky-200 hover:bg-sky-100 dark:hover:bg-sky-900"}`,children:k==="left"?d.jsxs(d.Fragment,{children:[d.jsx("span",{"aria-hidden":!0,children:"←"}),A]}):d.jsxs(d.Fragment,{children:[A,d.jsx("span",{"aria-hidden":!0,children:"→"})]})})};return d.jsxs(d.Fragment,{children:[b("left",w,u),d.jsx("span",{className:`flex-1 min-w-0 text-center text-[9px] text-gray-400
                       dark:text-slate-500 truncate select-none`,children:"related"}),b("right",S,g),c&&h&&ir.createPortal(d.jsx(Ep,{anchor:h,side:c,label:e,rows:x(c),onAdd:n,onRemove:s,onInspect:i,colorOf:r,slotOrder:o,parentOf:a}),document.body)]})}function Pp(e){const t=m.useRef(null),[n,s]=m.useState(e);return m.useEffect(()=>{const i=t.current;if(!i)return;const r=i.getBoundingClientRect(),o=8;s({x:Math.max(o,Math.min(e.x,window.innerWidth-r.width-o)),y:Math.max(o,Math.min(e.y,window.innerHeight-r.height-o))})},[e]),{ref:t,pos:n}}function Ep({anchor:e,side:t,label:n,rows:s,onAdd:i,onRemove:r,onInspect:o,colorOf:a,slotOrder:c,parentOf:l}){const{ref:h,pos:f}=Pp(e),u=b=>{const k=c?.indexOf(b.slot)??-1;return k===-1?Number.MAX_SAFE_INTEGER:k},g=[...s].sort((b,k)=>u(b)-u(k)||b.other.localeCompare(k.other)||b.slot.localeCompare(k.slot)),y=new Map,x=new Set;if(l){const b=new Map(g.map(k=>[`${k.slot}|${k.other}`,k]));for(const k of g){const A=l(k.other),C=A===void 0?void 0:b.get(`${k.slot}|${A}`);if(!C||C===k)continue;x.add(k);const E=`${k.slot}|${A}`;y.set(E,[...y.get(E)??[],k])}}const p=[],w=(b,k)=>{p.push({row:b,depth:k});for(const A of y.get(`${b.slot}|${b.other}`)??[])w(A,k+1)};for(const b of g)x.has(b)||w(b,0);const S=g.every(b=>b.drawn),v=[...new Set(g.map(b=>b.other))];return d.jsxs("div",{ref:h,"data-relation-bar":!0,onMouseEnter:yi,onMouseLeave:Ka,style:{left:f.x,top:f.y},className:`fixed z-50 w-max max-w-[min(46rem,calc(100vw-2rem))] max-h-[60vh]
                 overflow-y-auto overflow-x-hidden py-1
                 rounded-md border border-gray-300 dark:border-slate-600
                 bg-white dark:bg-slate-800 shadow-xl
                 text-gray-900 dark:text-gray-100`,children:[d.jsx("div",{className:"px-3 py-1 border-b border-gray-200 dark:border-slate-700",children:d.jsxs("div",{className:"text-[11px] font-semibold",children:[d.jsx("b",{children:n})," ",t==="left"?"belongs to":"owns"," ",v.length," ",v.length===1?"entity":"distinct entities",g.length!==v.length&&d.jsxs("span",{className:"font-normal text-gray-500 dark:text-slate-400",children:[" ","through ",g.length," attributes"]})]})}),d.jsx("button",{onClick:()=>v.forEach(b=>S?r(b):i(b)),className:`block w-full text-left px-3 py-1 text-[11px]
                   text-blue-600 dark:text-blue-400
                   hover:bg-gray-100 dark:hover:bg-slate-700`,children:S?`hide all ${v.length} entities`:`add all ${v.length} entities`}),d.jsx("table",{className:"w-full text-[11px]",children:d.jsx("tbody",{children:p.map(({row:b,depth:k})=>{const A=Ua[b.position].kind,C=k>0&&d.jsx("span",{"aria-hidden":!0,className:"text-gray-400 dark:text-slate-500 select-none",style:{paddingLeft:`${(k-1)*.75}rem`},children:"↳ "}),E=b.declaredBy===b.other?n:b.declaredBy,L=t==="left"?b.other:E,I=t==="left"?E:b.other;return d.jsxs("tr",{"data-family-depth":k,className:"hover:bg-gray-100 dark:hover:bg-slate-700",children:[d.jsx("td",{className:"pl-2 pr-1 py-0.5",children:d.jsx("button",{onClick:K=>{K.stopPropagation(),(b.drawn?r:i)(b.other)},"aria-label":b.drawn?`Remove ${b.other} from the diagram`:`Add ${b.other} to the diagram`,className:`w-4 h-4 rounded-sm leading-none text-[11px]
                                flex items-center justify-center border
                                ${b.drawn?"border-sky-300 bg-sky-50 text-sky-700 hover:bg-sky-200 dark:border-sky-700 dark:bg-sky-950 dark:text-sky-300":"border-gray-300 text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:border-slate-600 dark:hover:bg-slate-600"}`,children:b.drawn?"−":"+"})}),d.jsxs("td",{className:"pl-1 pr-2 py-0.5 text-right whitespace-nowrap",children:[t==="left"&&C,d.jsx(Uo,{cls:L,row:b,colorOf:a,onInspect:o})]}),d.jsx("td",{className:`px-2 py-0.5 font-mono text-gray-400 dark:text-slate-500
                               whitespace-nowrap tabular-nums text-right`,children:b.cardinality}),d.jsx("td",{className:"px-1 py-0.5 align-middle",children:d.jsx(gi,{kind:A,width:30})}),d.jsxs("td",{className:"pr-3 py-0.5 whitespace-nowrap",children:[t==="right"&&C,d.jsx(Uo,{cls:I,row:b,colorOf:a,onInspect:o})]})]},`${b.declaredBy}.${b.slot}->${b.other}`)})})})]})}function Uo({cls:e,row:t,colorOf:n,onInspect:s}){const i=n?.(e),r=e===t.declaredBy,o=i?{color:i.text}:void 0;return d.jsxs("span",{className:"font-mono",children:[s?d.jsx("button",{onClick:a=>{a.stopPropagation(),s(e)},title:`Open ${e}'s details`,className:"hover:underline",style:o,children:e}):d.jsx("span",{style:o,children:e}),r&&d.jsxs("span",{className:i?"opacity-80":"text-gray-500 dark:text-slate-400",style:o,children:[".",t.slot]})]})}const Ee={sibs:!0,dir:"RIGHT",merge:"near",legend:!1,cases:!1},Qa=["legend","cases"];function Mp(e,t){if(e.get("panels")!=="0")return t;for(const n of Qa)t[n]=!1;return t.detail=null,t}const Pt={dir:"explore-nl-dir",merge:"explore-nl-merge",sibs:"explore-nl-sibs"},Ln="~",Dp=["exp","hidden","owners"],Op=["tour"];let jt;function Rp(e=window.location.search){return jt===void 0&&(jt=new URLSearchParams(e).get("tour")==="1"),jt}function jp(e,t){const n=e.get(t);return n?n.split(Ln).filter(Boolean):[]}function qa(e){const t=e.get("cat");if(!t)return[];const n=t.split(new RegExp(`[,${Ln}]`)).filter(Boolean);return[...new Set(n.flatMap(s=>{const i=or.find(r=>r.id===s);return i?rr(i):[]}))]}function on(e){try{return localStorage.getItem(e)}catch{return null}}function Lp(e,t){try{localStorage.setItem(e,t)}catch{}}function rn(e,t){return e&&t.includes(e)?e:null}function _e(e=window.location.search){const t=new URLSearchParams(e),n=rn(t.get("dir"),["RIGHT","DOWN"])??rn(on(Pt.dir),["RIGHT","DOWN"])??Ee.dir,s=rn(t.get("merge"),["near","far","bend","off"])??rn(on(Pt.merge),["near","far","bend","off"])??Ee.merge,i=t.has("sibs")?t.get("sibs")==="1":on(Pt.sibs)!==null?on(Pt.sibs)!=="0":Ee.sibs,r=jp(t,"sel"),o=Mp(t,{legend:t.get("legend")==="1",cases:t.get("cases")==="1",detail:t.get("detail")||null});return t.has("legend")&&(o.legend=t.get("legend")==="1"),t.has("cases")&&(o.cases=t.get("cases")==="1"),t.has("detail")&&(o.detail=t.get("detail")||null),{sel:r.length?r:qa(t),detail:o.detail,roots:t.get("roots")==="1",sibs:i,dir:n,merge:s,legend:o.legend,cases:o.cases}}function Ya(e,{push:t=!1}={}){const n=new URL(window.location.href),s=n.searchParams,i=(o,a)=>{a.length===0?s.delete(o):s.set(o,[...a].sort().join(Ln))},r=(o,a,c)=>{c?s.delete(o):s.set(o,a)};for(const o of Dp)s.delete(o);jt===void 0&&s.has("tour")&&(jt=s.get("tour")==="1");for(const o of Op)s.delete(o);i("sel",e.sel),e.detail?s.set("detail",e.detail):s.delete("detail"),r("roots","1",!e.roots),r("sibs",e.sibs?"1":"0",e.sibs===Ee.sibs),r("dir",e.dir,e.dir===Ee.dir),r("merge",e.merge,e.merge===Ee.merge),r("legend","1",e.legend===Ee.legend),r("cases","1",e.cases===Ee.cases),s.delete("panels"),s.delete("cat"),t?window.history.pushState(null,"",n):window.history.replaceState(null,"",n)}function Ko(e,t){Lp(Pt[e],typeof t=="boolean"?t?"1":"0":String(t))}function Np(e,t=window.location.href){const n=new URL(t),s=new URLSearchParams,i=(r,o)=>s.set(r,o);return e.sel.length&&i("sel",[...e.sel].sort().join(Ln)),e.detail&&i("detail",e.detail),e.roots&&i("roots","1"),e.sibs!==Ee.sibs&&i("sibs",e.sibs?"1":"0"),e.dir!==Ee.dir&&i("dir",e.dir),e.merge!==Ee.merge&&i("merge",e.merge),e.legend!==Ee.legend&&i("legend","1"),e.cases!==Ee.cases&&i("cases","1"),n.search=s.toString(),n.toString()}const Se=240,ot=30,Vp=.6,rt=20,Ip=1/0,bi=22,Xa=18,ht=28;function Za(e,t,n=()=>!1){const s=new Map;for(const i of e){if(n(i.other))continue;const r=i.position,o=s.get(r)??new Map,a=o.get(i.other)??[];a.includes(i.slot)||a.push(i.slot),o.set(i.other,a),s.set(r,o)}return Dl.filter(i=>s.has(i)).map(i=>{const r=[...s.get(i)].map(([o,a])=>({other:o,slots:a,drawn:t(o)})).sort((o,a)=>o.other.localeCompare(a.other));return{position:i,label:Ol(i,r.length),items:r}})}function Ja(e,t,n=()=>!1){const s=new Set,i=[];for(const r of e){if(n(r.other))continue;const o=`${r.declaredBy}.${r.slot}->${r.other}:${r.position}`;s.has(o)||(s.add(o),i.push({other:r.other,position:r.position,slot:r.slot,declaredBy:r.declaredBy,cardinality:r.cardinality,drawn:t(r.other)}))}return i}function ce(e){return e.storageDirection==="flipped"?e.target:e.source}function Ns(e){return e.anchorClass??ce(e)}function Bp(e,t,n,s,i){const r=new Map,o=new Map,a=[],c=new Set;for(const u of e.edges)u.type==="isa"?(r.set(u.target,[...r.get(u.target)??[],u.source]),o.set(u.source,(o.get(u.source)??0)+1)):u.isLoop||(a.push(u),c.add(`${ce(u)}|${u.slotName}`));const l=new Set(e.nodes.map(u=>u.id)),h=e.nodes.map(u=>{const g=new Map(n(u.id).map((R,B)=>[R.name,B])),y=(R,B)=>(g.get(R.slot)??Number.MAX_SAFE_INTEGER)-(g.get(B.slot)??Number.MAX_SAFE_INTEGER),x=u.slots.map(R=>({...R,connected:R.isLoop||c.has(`${u.id}|${R.slot}`),rangeColor:s(R.range),targetColor:i(R.range)})).sort(y),p=new Set(x.map(R=>R.slot)),w=n(u.id).filter(R=>!p.has(R.name)).map(R=>({slot:R.name,range:R.range,channel:"plain",flipped:!1,cardinality:Al(R.required,R.multivalued),isLoop:!1,connected:!1,rangeColor:s(R.range)})),S=x.filter(R=>R.connected),v=[...x.filter(R=>!R.connected),...w].sort(y),b=[...S,...v].slice(0,Math.max(Ip,S.length)),k=b.length===S.length+v.length,A=t.has(u.id)||k,C=A?[...S,...v]:b,E=k?0:S.length+v.length-b.length,L=e.hiddenOwners.get(u.id)??[],I=e.hiddenOwned.get(u.id)??[],K=Za(u.relations,R=>l.has(R),R=>R===u.id),_=Ja(u.relations,R=>l.has(R),R=>R===u.id);return{...u,isaParents:r.get(u.id)??[],subclassCount:o.get(u.id)??0,members:[],hiddenOwners:L,hiddenOwned:I,relationGroups:K,relationRows:_,...el(K),rows:C,allRows:[...S,...v],hiddenCount:E,expanded:A,height:tl(C.length,E,K.length>0)}}),f=new Map;for(const u of a){const g=ce(u)===u.source?u.target:u.source,y=i(g);y&&f.set(u.id,y)}return{nodes:h,edges:a,edgeColors:f}}function el(e){const t=new Map;for(const n of e)for(const s of n.items)t.set(s.other,(t.get(s.other)??!1)||s.drawn);return{relatedCount:t.size,shownCount:[...t.values()].filter(Boolean).length}}function tl(e,t,n){return ot+(n?bi:0)+e*rt+(t?Xa:0)+(e?5:0)}function $p(e,t,n,s,i,r,o){const a=Pl(e.nodes.map(w=>w.id),t,n);if(!a.size)return e;const c=new Map(e.nodes.map(w=>[w.id,w])),l=new Set(e.nodes.map(w=>w.id)),h=new Map,f=[],u=new Map;for(const[w,S]of a){const v=Rl(w),b=S.map(D=>({id:D,label:c.get(D)?.label??D,color:El(o(D))}));for(const D of b)h.set(D.id,v);const k=c.has(w);k&&h.set(w,v);const A=new Map(b.map(D=>[D.id,D])),C=new Map,E=k?[w,...S]:S;for(const D of E){const Q=c.get(D);if(!Q)continue;const ve=D===w;for(const ne of Q.allRows){const Me=s(D,ne.slot),De=Me!==void 0&&Me!==D,Ce=`${ve||De?Me??w:D}|${ne.slot}`,ke=C.get(Ce),G=A.get(D),U=ve||De?ke?.owners??[]:[...ke?.owners??[],...G?[G]:[]];C.set(Ce,{...ke??ne,connected:(ke?.connected??!1)||ne.connected,owners:U,declaringClass:Ce.slice(0,Ce.indexOf("|"))})}}const L=new Map;for(const D of C.values())if(D.targetColor)for(const Q of D.owners??[])L.has(Q.id)||L.set(Q.id,D.targetColor);for(const D of b){const Q=L.get(D.id);Q&&(D.color=Q)}for(const[D,Q]of C)Q.targetColor&&u.set(`${v}|${D}`,Q.targetColor);const I=[...C.values()],K=D=>{const Q=D.owners?.length?D.owners[0].id:w;return r(Q,D.slot)};I.sort((D,Q)=>K(D)-K(Q));const _=Ml(I,b,D=>({slot:`::hdr:${D.id}`,range:"",channel:"plain",flipped:!1,cardinality:"",isLoop:!1,connected:!1,rangeColor:"",header:D})),R=D=>!h.has(D)&&!E.includes(D),B=[...new Set(E.flatMap(D=>c.get(D)?.hiddenOwners??[]))].filter(R),Y=[...new Set(E.flatMap(D=>c.get(D)?.hiddenOwned??[]))].filter(R),Z=Za(E.flatMap(D=>c.get(D)?.relations??[]),D=>l.has(D),D=>!R(D)),xe=Ja(E.flatMap(D=>c.get(D)?.relations??[]),D=>l.has(D),D=>!R(D)),O=c.get(S[0]),H=i(w);f.push({...O,id:v,label:w,description:H.description,abstract:H.abstract,slots:[],members:b,role:E.some(D=>c.get(D)?.role==="selected")?"selected":"context",layer:Math.min(...E.map(D=>c.get(D)?.layer??0)),isaParents:[],subclassCount:b.length,hiddenOwners:B,hiddenOwned:Y,relationGroups:Z,relationRows:xe,...el(Z),rows:_,allRows:I,hiddenCount:0,expanded:!0,height:tl(_.length,0,Z.length>0)})}const g=[...e.nodes.filter(w=>!h.has(w.id)),...f],y=new Set,x=e.edges.map(w=>({...w,source:h.get(w.source)??w.source,target:h.get(w.target)??w.target,entityMember:(()=>{if(w.inducedFrom!==void 0)return;const S=ce(w)===w.source?w.target:w.source;return h.has(S)?S:void 0})(),anchorClass:h.has(ce(w))?s(ce(w),w.slotName)??ce(w):ce(w)})).filter(w=>{if(!ls(w.source)&&!ls(w.target))return!0;const S=`${w.source}|${w.target}|${w.anchorClass}|${w.slotName}|${w.storageDirection}`;return y.has(S)?!1:(y.add(S),!0)}).filter(w=>w.source!==w.target),p=new Map(e.edgeColors);for(const w of x){const S=u.get(`${ce(w)}|${Ns(w)}|${w.slotName}`);S&&p.set(w.id,S)}return{nodes:g,edges:x,edgeColors:p}}function Fp({title:e}){return d.jsxs("svg",{viewBox:"0 0 16 16",width:"15",height:"15","aria-hidden":"false",className:"shrink-0",style:{color:St.entity},children:[d.jsx("title",{children:e}),d.jsx("path",{d:"M12.33 10.5 A5 5 0 1 1 12.33 5.5",fill:"none",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round"}),d.jsx("path",{d:"M13.7 7.9 L10.6 6.7 L13.7 4.2 Z",fill:"currentColor"})]})}function nl(e){return ot+(e.relationGroups.length>0?bi:0)}function sl(e,t,n){const s=e.rows.findIndex(i=>i.slot===t&&!i.header&&(!n||!i.declaringClass||i.declaringClass===n));if(s<0)throw new Error(`No displayed row for ${t} on ${e.id}`);return nl(e)+s*rt+rt/2}function _p(e,t){const n=e.rows.findIndex(s=>s.header?.id===t);if(!(n<0))return nl(e)+n*rt+rt/2}function Vs(e,t){if(e.storageDirection==="flipped"||!t.members.length)return;const n=e.entityMember;return n&&t.members.some(s=>s.id===n)?n:void 0}const Hp=4,Wp=10,zp=ie.head.span,Qo=ie.head.len,Gp=ie.gap,Up=ie.secondaryScale,il=ie.stroke.own,ol=ie.stroke.ownHover,Kp=il*ie.stroke.refFactor,Qp=ol*ie.stroke.refFactor;function qo(e,t){return e?t?we.ownBkwd:we.ownFwd:we.association}function es(e,t){if(e==="off"||t.length<2)return 0;if(e==="near")return 40;if(e==="far")return 120;const n=t[t.length-1],s=t[t.length-2];return Math.hypot(n.x-s.x,n.y-s.y)}function Yo(e,t){return e<2?0:Math.min(Hp,t/(e-1))}function qp(e,t){const n=new Map,s=(l,h,f,u)=>{const g=n.get(l.id)??[];return g.some(y=>y.id===h)||(g.push({id:h,x:f,y:u}),n.set(l.id,g)),h},i=new Map(e.nodes.map(l=>[l.id,l])),r=l=>{const h=i.get(ce(l)===l.source?l.target:l.source);return!!h&&Vs(l,h)!==void 0},o=new Map;for(const l of e.edges){if(r(l))continue;const h=ce(l)===l.source?l.target:l.source,f=`${h}|${h===l.source?"out":"in"}`;o.set(f,(o.get(f)??0)+1)}const a=new Map,c=e.edges.map(l=>{const h=i.get(ce(l)),f=i.get(ce(l)===l.source?l.target:l.source);if(!h||!f)throw new Error(`Edge ${l.id} endpoint missing from subgraph`);const u=l.storageDirection==="flipped",g=sl(h,l.slotName,Ns(l)),y=s(h,`${h.id}::row:${Ns(l)}|${l.slotName}`,u?0:Se,g),x=f.id===l.source,p=`${f.id}|${x?"out":"in"}`,w=Vs(l,f),S=w!==void 0?_p(f,w):void 0;let v;if(w!==void 0&&S!==void 0)v=s(f,`${f.id}::mhdr:${x?"out":"in"}:${w}`,t==="RIGHT"?x?Se:0:Se/2,t==="RIGHT"?S:x?f.height:0);else{const b=o.get(p)??1,k=a.get(p)??0;a.set(p,k+1);const A=Yo(b,ot-4),C=ot/2+(k-(b-1)/2)*A;v=t==="RIGHT"?s(f,`${f.id}::hdr:${x?"out":"in"}:${k}`,x?Se:0,C):s(f,`${f.id}::hdr:${x?"out":"in"}:${k}`,Se/2+(k-(b-1)/2)*Yo(b,Se/2),x?f.height:0)}return{id:l.id,source:l.source,target:l.target,sourcePort:u?v:y,targetPort:u?y:v}});return{nodes:e.nodes.map(l=>({id:l.id,width:Se,height:l.height,partition:l.layer,ports:n.get(l.id)})),edges:c}}function Yp(e,t){if(!e?.length)return e;const n=e[0],s=n.bendPoints?.length?n.bendPoints[n.bendPoints.length-1]:n.startPoint,i=n.endPoint.x-s.x,r=n.endPoint.y-s.y,o=Math.hypot(i,r);if(o<1)return e;const a=Math.min(t,o*.8)/o,c={x:n.endPoint.x-i*a,y:n.endPoint.y-r*a};return[{...n,endPoint:c},...e.slice(1)]}function Xp(e,t){if(!e?.length)return e;const n=e[0],s=n.bendPoints?.length?n.bendPoints[0]:n.endPoint,i=s.x-n.startPoint.x,r=s.y-n.startPoint.y,o=Math.hypot(i,r);if(o<1)return e;const a=Math.min(t,o*.8)/o,c={x:n.startPoint.x+i*a,y:n.startPoint.y+r*a};return[{...n,startPoint:c},...e.slice(1)]}function Zp({dataService:e,selectedIds:t,onNodeClick:n,onAdd:s,onRemove:i,pathToRoot:r=!1,onTogglePathToRoot:o,direction:a,setDirection:c,mergeMode:l,setMergeMode:h}){const f=m.useId().replace(/[^a-zA-Z0-9]/g,""),u=T=>`${T}-${f}`,[g,y]=m.useState(new Set),x=m.useMemo(()=>e.getOwnershipSubgraph([...t].sort(),{pathToRoot:r}),[e,t,r]),p=m.useCallback(T=>e.getTargetColor(T),[e]),w=m.useMemo(()=>new Map(x.nodes.map(T=>[T.id,e.getClassSummary(T.id)?.slots??[]])),[e,x]),S=m.useMemo(()=>Bp(x,g,T=>w.get(T)??[],T=>e.getRangeColor(T),T=>e.getTargetColor(T)),[x,g,w,e]),v=m.useMemo(()=>new Map(x.nodes.map(T=>[T.id,e.getClassSummary(T.id)])),[e,x]),b=m.useMemo(()=>{const T=P=>v.get(P)?.parentId,M=P=>!jl.has(P),j=(P,V)=>P.range===V.range&&P.multivalued===V.multivalued;return $p(S,T,M,(P,V)=>{const F=e.getClassSummary(P)?.slots.find(he=>he.name===V);if(!F)return;if(!F.inheritedFrom)return P;const X=e.getClassSummary(F.inheritedFrom)?.slots.find(he=>he.name===V);return X&&j(F,X)?F.inheritedFrom:P},P=>{const V=e.getClassSummary(P);return{description:V?.description??"",abstract:V?.isAbstract??!1}},(P,V)=>{const F=e.getClassSummary(P)?.slots.findIndex(X=>X.name===V)??-1;return F<0?Number.MAX_SAFE_INTEGER:F},P=>e.siblingColorIndexOf(P))},[S,v,e]),[k,A]=m.useState(new Map),[C,E]=m.useState(new Map),L=m.useMemo(()=>qp(b,a),[b,a]),{latest:I,inProgress:K}=cp(L,{direction:a,usePartitions:!0,nodeSpacing:28,layerSpacing:72,extraLayoutOptions:{"elk.spacing.edgeNode":"18","elk.spacing.edgeEdge":"12","elk.layered.spacing.edgeNodeBetweenLayers":"18","elk.layered.spacing.edgeEdgeBetweenLayers":"10"}}),_=I?.spec===L?I.layout:null,R=I?.layout??null,B=kp(),Y=(R?.width??0)+ht*2,Z=(R?.height??0)+ht*2;m.useEffect(()=>{_&&(B.setContentSize(Y,Z),B.isAutoFit()&&B.zoomToFit())},[_,Y,Z]),m.useEffect(()=>A(new Map),[_]),m.useEffect(()=>E(new Map),[_]);const[xe,O]=m.useState(!1),H=m.useRef(!0);m.useEffect(()=>{if(!_){O(!1),R||(H.current=!0);return}const T=H.current?0:vp();if(H.current=!1,T===0){O(!0);return}const M=setTimeout(()=>O(!0),T);return()=>clearTimeout(M)},[_,R]);const D=m.useRef(new Map),Q=m.useRef(!1),ve=m.useRef(k);ve.current=k;const ne=m.useMemo(()=>{const T=new Map((R?.nodes??[]).map(j=>[j.id,j])),M=new Map(C);for(const[j,$]of k)M.set(j,$);for(const[j,{dx:$,dy:z}]of M){const q=T.get(j);q&&T.set(j,{...q,x:q.x+$,y:q.y+z})}return D.current=T,T},[R,k,C]),[Me,De]=m.useState(!1);m.useEffect(()=>{if(!K){De(!1);return}const T=setTimeout(()=>De(!0),gp);return()=>clearTimeout(T)},[K]);const Ce=m.useCallback((T,M)=>{if(M.button!==0||M.target.closest('button, a, [role="button"], [data-no-drag]'))return;M.stopPropagation();const j=M.clientX,$=M.clientY,z=B.getZoom()||1,q=k.get(T)??{dx:0,dy:0},P=M.currentTarget;P.setPointerCapture(M.pointerId);let V=!1;const F=he=>{const Pe=(he.clientX-j)/z,Le=(he.clientY-$)/z;!V&&Math.hypot(Pe,Le)<3||(V=!0,Q.current=!0,A(Ze=>new Map(Ze).set(T,{dx:q.dx+Pe,dy:q.dy+Le})))},X=he=>{if(P.releasePointerCapture(he.pointerId),P.removeEventListener("pointermove",F),P.removeEventListener("pointerup",X),V){const Pe=ve.current.get(T);Pe&&E(Le=>new Map(Le).set(T,Pe))}};P.addEventListener("pointermove",F),P.addEventListener("pointerup",X)},[k]),ke=m.useMemo(()=>new Map(b.nodes.map(T=>[T.id,T.role])),[b]),G=m.useMemo(()=>new Map(b.edges.map(T=>[T.id,T])),[b]),U=m.useMemo(()=>{const T=new Map(b.nodes.map(M=>[M.id,M]));return new Set(b.edges.filter(M=>{const j=T.get(ce(M)===M.source?M.target:M.source);return!!j&&Vs(M,j)!==void 0}).map(M=>M.id))},[b]),te=m.useMemo(()=>{const T=new Map;if(!_)return T;for(const M of b.edges){const j=ce(M)===M.source?M.target:M.source,$=ne.get(j);if(!$||U.has(M.id))continue;const z=j===M.source,q=`${j}|${z?"out":"in"}`;if(T.has(q))continue;const P=z,V=Gp+Qo;T.set(q,a==="RIGHT"?{base:{x:P?$.x+Se+V:$.x-V,y:$.y+ot/2},dir:{x:P?-1:1,y:0}}:{base:{x:$.x+Se/2,y:P?$.y+$.height+V:$.y-V},dir:{x:0,y:P?-1:1}})}return T},[b,ne,_,a,U]),re=m.useMemo(()=>{const T=new Map,M=new URLSearchParams(window.location.search).has("dbg"),j=new Set([...C.keys(),...k.keys()]);if(!_||j.size===0)return T;M&&console.log(`[drag] moved: ${[...j].join(", ")}`);const $=new Map(b.nodes.map(z=>[z.id,z]));for(const z of b.edges){const q=ce(z),P=q===z.source?z.target:z.source;if(!j.has(q)&&!j.has(P))continue;const V=ne.get(q),F=ne.get(P),X=$.get(q);if(!V||!F||!X)continue;const he=z.storageDirection==="flipped",Pe=a==="RIGHT";let Le;try{Le=sl(X,z.slotName)}catch{M&&console.log(`   SKIP ${q}.${z.slotName}: row not displayed`);continue}const Ze=Pe?{x:V.x+(he?0:Se),y:V.y+Le}:{x:V.x+Se/2,y:V.y+Le},Ue=Pe?{x:he?-1:1,y:0}:{x:0,y:1},ct=P===z.source,Kt=Pe?{x:ct?F.x+Se:F.x,y:F.y+ot/2}:{x:F.x+Se/2,y:ct?F.y+F.height:F.y},Vn=Pe?{x:ct?1:-1,y:0}:{x:0,y:ct?1:-1};T.set(z.id,lp(Ze,Kt,Ue,Vn)),M&&console.log(`   reroute ${q}.${z.slotName} -> ${P}`)}return M&&console.log(`[drag] rerouted ${T.size} edge(s)`),T},[_,k,C,b,ne,a]);m.useEffect(()=>{if(!_||!new URLSearchParams(window.location.search).has("dbg"))return;const T=new Map;for(const M of _.edges){const j=G.get(M.id);if(!j)continue;const $=tn(M.sections);if($.length<2)continue;const z=ce(j)===j.source?j.target:j.source;let q=0,P=0;for(let F=1;F<$.length;F++){const X=Math.abs($[F].x-$[F-1].x),he=Math.abs($[F].y-$[F-1].y);X>.5&&he>.5&&P++,F>1&&q++}const V=ce(j);T.set(z,[...T.get(z)??[],`${V}.${j.slotName}  pts=${$.length} bends=${q}${P?` DIAGONAL x${P}`:""}  start=(${Math.round($[0].x)},${Math.round($[0].y)}) end=(${Math.round($[$.length-1].x)},${Math.round($[$.length-1].y)})`])}for(const[M,j]of T){if(j.length<2)continue;console.log(`
=== approaches to ${M} (${j.length}) ===`);const $=ne.get(M);$&&console.log(`   box at (${Math.round($.x)},${Math.round($.y)}) h=${Math.round($.height)}`),j.forEach(z=>console.log("   "+z))}},[_,G,ne]);const Te=m.useMemo(()=>{const T=new Map;if(!_)return T;for(const M of _.edges){const j=G.get(M.id);if(!j||j.storageDirection==="flipped"||U.has(M.id)||es(l,tn(M.sections))<=0)continue;const $=ce(j)===j.source?j.target:j.source,z=`${$}|${$===j.source?"out":"in"}`,q=te.get(z);if(!q)continue;const P=j.type==="ownership",V=ke.get(j.source)==="context"||ke.get(j.target)==="context",F=b.edgeColors.get(M.id),X=T.get(z);T.set(z,X?{...X,isOwn:X.isOwn||P,dimmed:X.dimmed&&V,edgeIds:[...X.edgeIds,M.id],...X.color?.text===F?.text?{}:{color:void 0}}:{...q,isOwn:P,dimmed:V,edgeIds:[M.id],...F?{color:F}:{}})}return T},[_,G,te,l,ke,b,U]),Be=m.useMemo(()=>new Set(b.nodes.map(T=>T.id)),[b]),Ae=m.useCallback(T=>!!s&&T.channel!=="plain"&&!T.isLoop&&!Be.has(T.range),[s,Be]),vt=m.useRef(null),Xe=m.useRef(null),W=m.useRef(void 0),se=m.useMemo(()=>{const T=new Map,M=new Map;for(const j of b.edges){M.set(j.id,[j.source,j.target]);for(const $ of[j.source,j.target])T.set($,[...T.get($)??[],j.id])}return{nodeEdges:T,edgeEnds:M}},[b]),ue=m.useRef(se);ue.current=se;const ae=m.useCallback(T=>{W.current=T,Xe.current===null&&(Xe.current=requestAnimationFrame(()=>{Xe.current=null;const M=W.current;W.current=void 0;const j=vt.current,$=B.wrapperRef.current;if(M===void 0||!j||!$)return;let z=null,q=null;if(M){const{nodeEdges:V,edgeEnds:F}=ue.current;if(M.kind==="node"){z=new Set(V.get(M.id)??[]),q=new Set([M.id]);for(const X of z)for(const he of F.get(X)??[])q.add(he)}else z=new Set([M.id]),q=new Set(F.get(M.id)??[])}const P=(V,F,X)=>{V.style.filter=F===null||F?"":`opacity(${X})`};j.querySelectorAll("path[data-edge-id]").forEach(V=>{const F=V.dataset.edgeId??"",X=z?z.has(F):null;P(V,X,.38),V.style.strokeWidth=X?String(V.dataset.channel==="reference"?Qp:ol):""}),j.querySelectorAll("path[data-arrowhead]").forEach(V=>{const F=(V.dataset.arrowhead??"").split(" ");P(V,z?F.some(X=>z.has(X)):null,.08)}),$.querySelectorAll("[data-node-id]").forEach(V=>{P(V,q?q.has(V.dataset.nodeId??""):null,.25)})}))},[]);m.useEffect(()=>ae(null),[b,_,ae]);const kl=T=>y(M=>{const j=new Set(M);return j.has(T)?j.delete(T):j.add(T),j}),Ti=T=>{Ko("dir",T),c(T)},Gt=T=>{Ko("merge",T),h(T)},Ut=e.getConceptLabel("attribute",!0).toLowerCase(),Ge=T=>`px-2 py-0.5 text-xs rounded border ${T?"border-blue-500 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300":"border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700"}`;return d.jsxs("div",{className:"relative w-full h-full",children:[d.jsxs("div",{"data-pan-ignore":!0,className:"absolute top-2 right-2 z-10 flex gap-1 items-center",children:[Me&&d.jsxs("div",{className:`mr-2 flex items-center gap-2 rounded px-2 py-1
                          text-xs text-gray-500 dark:text-gray-400
                          bg-white/80 dark:bg-slate-900/80 shadow-sm`,children:[d.jsx("span",{className:`inline-block h-3 w-3 animate-spin rounded-full
                             border-2 border-gray-300 border-t-gray-600
                             dark:border-slate-600 dark:border-t-slate-300`}),"Computing layout…"]}),o&&d.jsxs(d.Fragment,{children:[d.jsx("button",{className:Ge(r),title:r?"Hide owners: show only what you selected":"Show every owner up to the root (can pull in most of the schema)",onClick:o,children:"⇱ roots"}),d.jsx("span",{className:"w-px h-4 bg-gray-300 dark:bg-slate-600 mx-1"})]}),d.jsx("button",{className:Ge(a==="RIGHT"),title:"Layout left to right",onClick:()=>Ti("RIGHT"),children:"LR"}),d.jsx("button",{className:Ge(a==="DOWN"),title:"Layout top down",onClick:()=>Ti("DOWN"),children:"TB"}),d.jsx("span",{className:"w-px h-4 bg-gray-300 dark:bg-slate-600 mx-1"}),d.jsx("button",{className:Ge(l==="near"),title:"Merge converging edges near the node (~40px)",onClick:()=>Gt("near"),children:"⋙"}),d.jsx("button",{className:Ge(l==="far"),title:"Merge converging edges early (~120px)",onClick:()=>Gt("far"),children:"⋙⋙"}),d.jsx("button",{className:Ge(l==="bend"),title:"Merge at ELK's last corner",onClick:()=>Gt("bend"),children:"⌙"}),d.jsx("button",{className:Ge(l==="off"),title:"No merging — every edge runs to its own port",onClick:()=>Gt("off"),children:"≡"}),d.jsx("span",{className:"w-px h-4 bg-gray-300 dark:bg-slate-600 mx-1"}),[["+",()=>B.zoomBy(1.3),"Zoom in"],["−",()=>B.zoomBy(1/1.3),"Zoom out"],["1:1",()=>B.applyZoom(1),"Reset zoom"],["⛶",()=>B.zoomToFit(),"Fit to view"]].map(([T,M,j])=>d.jsx("button",{onClick:M,title:j,className:Ge(!1),children:T},T))]}),d.jsx("div",{ref:B.containerRef,"data-graph-direction":a,className:"w-full h-full overflow-auto cursor-grab",children:d.jsx("div",{ref:B.spacerRef,children:d.jsx("div",{ref:B.wrapperRef,className:"relative",children:R&&d.jsxs(d.Fragment,{children:[d.jsxs("svg",{ref:vt,className:"absolute top-0 left-0 pointer-events-none",width:Y,height:Z,children:[d.jsxs("defs",{children:[(()=>{const T=yn("forward"),{d:M,...j}=T;return d.jsx("marker",{id:u("arrow-own"),...j,children:d.jsx("path",{d:M,fill:we.ownFwd})})})(),(()=>{const{d:T,...M}=yn("backward");return d.jsx("marker",{id:u("arrow-own-back"),...M,children:d.jsx("path",{d:T,fill:we.ownBkwd})})})(),(()=>{const{d:T,...M}=yn("forward",Up);return d.jsx("marker",{id:u("arrow-assoc"),...M,children:d.jsx("path",{d:T,fill:we.association})})})()]}),d.jsxs("g",{transform:`translate(${ht}, ${ht})`,style:{opacity:xe?1:0,transition:`opacity ${xp()}ms`},children:[[...Te].map(([T,M])=>d.jsx("path",{"data-arrowhead":M.edgeIds.join(" "),d:ap(M.base,M.dir,zp,Qo),fill:M.color?.text??qo(M.isOwn,!1),opacity:M.dimmed?.4:1,style:{transition:`filter ${sn()}ms`}},`head-${T}`)),(_?.edges??[]).map(T=>{const M=G.get(T.id);if(!M)throw new Error(`Routed edge ${T.id} missing from view model`);const j=M.storageDirection==="flipped",$=ce(M)===M.source?M.target:M.source,z=j||U.has(T.id)?void 0:te.get(`${$}|${$===M.source?"out":"in"}`),q=re.get(T.id),P=!!z&&es(l,q??tn(T.sections))>0,V=M.type!=="ownership",F=P?T.sections:Yp(T.sections,_o(V?"association":"own-fwd")),X=V?Xp(F,_o("association")):F,he=q??tn(X),Pe=Vn=>np(Vn,Wp),Le=es(l,he),Ze=z&&Le>0?op(he,z.base,Le,Pe):Pe(he);if(!Ze)return null;const Ue=M.type==="ownership",ct=ke.get(T.source)==="context"||ke.get(T.target)==="context",Kt=P?void 0:Ue?j?"arrow-own-back":"arrow-own":"arrow-assoc";return d.jsxs("g",{children:[d.jsx("path",{"data-edge-id":T.id,"data-channel":Ue?"ownership":"reference",d:Ze,fill:"none",opacity:ct?.4:1,stroke:b.edgeColors.get(T.id)?.text??qo(Ue,j),strokeWidth:Ue?il:Kp,strokeDasharray:Ue?void 0:ie.dash,markerEnd:Kt?`url(#${u(Kt)})`:void 0,markerStart:!Ue&&!P?`url(#${u("arrow-assoc")})`:void 0,style:{transition:`filter ${sn()}ms, stroke-width ${sn()}ms`}}),d.jsx("path",{d:Ze,fill:"none",stroke:"transparent",strokeWidth:11,style:{pointerEvents:"stroke"},onMouseEnter:()=>ae({kind:"edge",id:T.id}),onMouseLeave:()=>ae(null)})]},T.id)})]})]}),d.jsx($u,{initial:!1,children:b.nodes.map(T=>{const M=ne.get(T.id);if(!M)return null;const j=T.role==="context",$=M.x+ht,z=M.y+ht,q={duration:nn(k.has(T.id)?0:Ga()),ease:yp};return d.jsxs(qf.div,{initial:{opacity:0,x:$,y:z},animate:{opacity:j?Vp:1,x:$,y:z},exit:{opacity:0,transition:{duration:nn(zo())}},transition:{x:q,y:q,opacity:{duration:nn(zo()),delay:nn(wp())}},"data-node-id":T.id,"data-help-id":Gl(T),"data-pan-ignore":!0,"data-pinned":C.has(T.id)?"":void 0,onPointerDown:P=>Ce(T.id,P),onClick:()=>{if(Q.current){Q.current=!1;return}n?.(T.members.length?T.label:T.id)},onMouseEnter:()=>ae({kind:"node",id:T.id}),onMouseLeave:()=>ae(null),className:`absolute rounded-md text-xs bg-white dark:bg-slate-800 cursor-pointer ${j?"border border-dashed border-gray-400 dark:border-slate-500":C.has(T.id)?"border-2 border-amber-500 dark:border-amber-400 shadow-md":"border-2 border-slate-500 dark:border-slate-400 shadow-md"}`,style:{width:Se,height:T.height,transition:`filter ${sn()}ms`},children:[d.jsxs("div",{className:"flex items-center gap-1 px-2 rounded-t-[4px] bg-slate-700 dark:bg-slate-700 text-white border-b border-slate-800 dark:border-slate-600",style:{height:ot},children:[d.jsx("span",{className:`font-semibold truncate ${T.abstract?"italic":""}`,title:T.description||T.id,children:T.label}),d.jsxs("span",{className:"ml-auto flex gap-1 shrink-0",children:[T.members.length>0&&d.jsxs("span",{title:`${T.members.length} classes that are a ${T.label}, merged into one box`,className:"text-[9px] px-1 rounded bg-sky-100 dark:bg-sky-900 text-sky-800 dark:text-sky-200",children:["⑃ ",T.members.length]}),T.isaParents.map(P=>d.jsxs("span",{title:`is-a ${P}`,className:"text-[9px] px-1 rounded bg-sky-100 dark:bg-sky-900 text-sky-800 dark:text-sky-200",children:["⊳ ",P]},P)),T.subclassCount>0&&T.members.length===0&&d.jsxs("span",{title:`${T.subclassCount} subclasses shown`,className:"text-[9px] px-1 rounded bg-sky-100 dark:bg-sky-900 text-sky-800 dark:text-sky-200",children:["▷ ",T.subclassCount]}),(()=>{const V=(T.members.length?T.members.map(F=>F.id):[T.id]).filter(F=>t.has(F));return V.length?d.jsx("button",{"data-dismiss":T.id,"data-help-id":"node-dismiss",title:V.length>1?`Remove all ${V.length} selected classes in ${T.label}`:`Remove ${T.label} from the canvas`,onClick:F=>{F.stopPropagation(),V.forEach(X=>i?.(X))},className:`text-[10px] leading-none px-1 rounded text-gray-400
                                         hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/40`,children:"✕"}):null})()]})]}),T.relationGroups.length>0&&d.jsx("div",{"data-help-id":"relation-bar",className:`flex items-center gap-1 px-2 border-b overflow-hidden
                                     border-gray-200 dark:border-slate-600
                                     bg-sky-50/60 dark:bg-sky-950/30`,style:{height:bi},children:d.jsx(Ap,{label:T.label,rows:T.relationRows,onAdd:P=>s?.(P),onRemove:P=>i?.(P),onInspect:n,colorOf:p,slotOrder:T.allRows.map(P=>P.slot),parentOf:P=>e.getClassSummary(P)?.parentId})}),T.rows.map(P=>P.header?d.jsx("div",{"data-no-drag":!0,"data-help-id":Wl(P.header.id),title:`${P.header.label} — is a ${T.label}; click for details`,onClick:V=>{V.stopPropagation(),n?.(P.header.id)},className:`flex items-center px-2 text-[10px] font-semibold
                                     cursor-pointer hover:brightness-110`,style:{height:rt,background:P.header.color.fill,color:Cl},children:d.jsx("span",{className:"truncate",children:P.header.label})},P.slot):d.jsxs("div",{"data-help-id":Ul(T,P),"data-expandable":Ae(P)?"":void 0,"data-no-drag":Ae(P)?"":void 0,title:(P.channel==="plain"?`${P.slot}: ${P.range}`:`${P.slot} → ${P.range} (${P.cardinality})${P.flipped?" — owner side":""}`+(Ae(P)?` — click to add ${P.range}`:""))+((P.owners?.length??0)>1?`
also declared by ${P.owners.slice(1).map(V=>V.label).join(", ")}`:""),onClick:Ae(P)?V=>{V.stopPropagation(),s?.(P.range)}:void 0,className:`flex items-center gap-1.5 px-2 text-[11px] ${P.targetColor?"":P.connected?"text-gray-700 dark:text-gray-300":"text-gray-400 dark:text-gray-500"} ${Ae(P)?"cursor-pointer hover:bg-sky-50 dark:hover:bg-sky-900/30 hover:text-sky-700 dark:hover:text-sky-300":""}`,style:{height:rt,...P.targetColor?{color:P.targetColor.text}:{}},children:[d.jsx("span",{className:"w-1.5 h-1.5 rounded-full shrink-0 border",style:{borderColor:P.rangeColor,background:P.connected?P.rangeColor:"transparent"}}),d.jsx("span",{className:`truncate ${T.members.length&&!P.owners?.length?`font-semibold ${P.targetColor?"":"text-gray-900 dark:text-gray-100"}`:""}`,children:P.slot}),P.isLoop&&d.jsx(Fp,{title:`self-referential: a ${P.range} can own another ${P.range} via ${P.slot}`}),d.jsxs("span",{className:"ml-auto text-[9px] truncate max-w-[90px]",children:[d.jsx("span",{style:{color:P.rangeColor},children:P.range}),d.jsxs("span",{className:"text-gray-400 dark:text-gray-500",children:[" ",P.cardinality]})]})]},P.declaringClass?`${P.declaringClass}|${P.slot}`:P.slot)),T.hiddenCount>0&&d.jsx("button",{className:"w-full text-left px-2 text-[10px] text-sky-600 dark:text-sky-400 hover:underline",style:{height:Xa},title:`${Ut} without an edge on the current canvas, plus plain (non-entity) ${Ut}`,onClick:P=>{P.stopPropagation(),kl(T.id)},children:T.expanded?`− fewer ${Ut}`:`+ ${T.hiddenCount} more ${Ut}`})]},T.id)})})]})})})})]})}function Jp({classId:e,dataService:t,onClose:n,onNavigate:s,isSelected:i,onToggleSelect:r}){const o=m.useMemo(()=>t.getClassSummary(e),[e,t]),[a,c]=m.useState([]),l=m.useCallback(u=>{u!==e&&(c(g=>[...g,e]),s(u))},[e,s]),h=m.useCallback(()=>{c(u=>u.length===0?u:(s(u[u.length-1]),u.slice(0,-1)))},[s]);m.useEffect(()=>{const u=g=>{g.key==="Escape"&&n()};return window.addEventListener("keydown",u),()=>window.removeEventListener("keydown",u)},[n]);const f=t.getTypeLabel("slot",!0);return d.jsxs("aside",{className:`w-96 shrink-0 flex flex-col min-h-0 border-l border-gray-200 dark:border-slate-700
                 bg-white dark:bg-slate-900`,"aria-label":"Entity details",children:[d.jsxs("header",{className:`flex items-start gap-2 px-3 py-2 border-b border-gray-200 dark:border-slate-700
                   bg-gray-50 dark:bg-slate-800 shrink-0`,children:[a.length>0&&d.jsx("button",{onClick:h,className:"text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-sm mt-0.5",title:"Back",children:"←"}),d.jsxs("div",{className:"flex-1 min-w-0",children:[d.jsxs("div",{className:"font-semibold text-sm text-blue-700 dark:text-blue-300 break-words",children:[o?.name??e,o?.isAbstract&&d.jsx("span",{className:"ml-1 text-xs text-purple-500 italic",children:"(abstract)"})]}),o?.parentId&&d.jsxs("div",{className:"text-xs text-gray-400",children:["is a"," ",d.jsx("button",{onClick:()=>l(o.parentId),className:"text-blue-600 dark:text-blue-400 hover:underline",children:o.parentId})]})]}),d.jsx("button",{onClick:n,className:"text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-sm px-1",title:"Close (Esc)",children:"✕"})]}),o?d.jsxs("div",{className:"flex-1 overflow-y-auto min-h-0 px-3 py-2 space-y-3",children:[d.jsx("button",{onClick:()=>r(e),className:`w-full px-2 py-1 text-xs rounded border ${i?"border-blue-500 bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300":"border-gray-300 dark:border-slate-600 hover:border-blue-400 text-gray-600 dark:text-gray-300"}`,children:i?"✓ In diagram — click to remove":"+ Add to diagram"}),o.description&&d.jsx("p",{className:"text-xs text-gray-600 dark:text-gray-300 leading-relaxed",children:o.description}),o.referencedBy.length>0&&d.jsxs("section",{children:[d.jsxs(Xo,{children:["Referenced by (",o.referencedBy.length,")"]}),d.jsx("ul",{className:"space-y-0.5",children:o.referencedBy.map((u,g)=>d.jsxs("li",{className:"text-xs",children:[d.jsx("button",{onClick:()=>l(u.classId),className:"text-blue-600 dark:text-blue-400 hover:underline cursor-pointer",children:u.classId}),d.jsxs("span",{className:"text-gray-400",children:[".",u.slotName]})]},`${u.classId}.${u.slotName}-${g}`))})]}),o.slots.length>0&&d.jsxs("section",{children:[d.jsxs(Xo,{children:[f," (",o.slots.length,")"]}),d.jsx("ul",{className:"divide-y divide-gray-100 dark:divide-slate-700",children:o.slots.map((u,g)=>d.jsxs("li",{className:"py-1.5",children:[d.jsxs("div",{className:"flex items-baseline gap-1.5 flex-wrap",children:[d.jsx("span",{className:"text-xs font-medium text-gray-800 dark:text-gray-100",children:u.name}),d.jsx(em,{range:u.range,onNavigate:l,dataService:t})]}),u.description&&d.jsx("p",{className:"mt-0.5 text-[11px] text-gray-500 dark:text-gray-400 leading-snug break-words",children:u.description})]},`${u.name}-${g}`))})]})]}):d.jsxs("div",{className:"p-3 text-xs text-gray-500",children:["Entity not found: ",e]})]})}function Xo({children:e}){return d.jsx("div",{className:"text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-1",children:e})}function em({range:e,onNavigate:t,dataService:n}){const s=n.itemExists(e)&&!e.endsWith("Enum"),o=`inline-block px-1 py-0 rounded text-[11px] font-medium ${new Set(["string","integer","boolean","float","double","decimal","date","datetime","time","uri","uriorcurie","ncname"]).has(e.toLowerCase())?"bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300":e.endsWith("Enum")?"bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300":"bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"}`;return s?d.jsx("button",{onClick:()=>t(e),className:`${o} hover:underline cursor-pointer`,children:e}):d.jsx("span",{className:o,children:e})}const tm=[{heading:"One rule at a time",cases:[{name:"Rule 1 — multivalued owns forward",note:"A multivalued slot means the owner has-a collection, so ownership runs forward: Questionnaire.items and ResearchStudy.consents. The two `part_of` self-loops are the counterexample — multivalued but drawn backward, because they walk UP a tree.",sel:["ResearchStudy","Consent","Questionnaire","QuestionnaireItem"]},{name:"Rule 2 — single-valued belongs backward",note:"The largest group (70 edges). Participant fans OUT to 22 targets, nearly all reversed: each target declares `associated_participant` and is drawn as belonging to Participant. This is the group that would move if own-bkwd merges into association.",sel:["Participant","Condition","Demography","Exposure","Procedure","Visit"]},{name:"Exception 2a — no independent existence",note:"Single-valued, but forward anyway: Quantity, TimePoint and the like have no identity of their own, so the value belongs to whoever holds it rather than owning the holder.",sel:["SpecimenStorageActivity","Quantity","TimePoint","Activity"]},{name:"Entity-ranged — always forward",note:"The twelve focus / associated_evidence slots range on Entity, the universal root. A pointer AT the root is never a foreign key back to an owner, so these run forward whatever their cardinality. Both single- and multi-valued focus sites are here — all should point AT Entity.",sel:["Observation","ObservationSet","MeasurementObservation","Document","Condition","SdohObservation","Entity"]},{name:"Association — no ownership claim",note:"Both associations in the schema: Document.related_document → Specimen, and SpecimenContainer.container → SpecimenStorageActivity. Slate and dashed, arrowed at both ends. They are listed explicitly because they are multivalued, so Rule 1 would otherwise call them ownership.",sel:["Document","Specimen","SpecimenContainer","SpecimenStorageActivity"]},{name:"Self-loops",note:"The five self-owning slots (TimePoint.index_time_point, File.derived_from, Specimen.parent_specimen, ResearchStudy.part_of, SpecimenContainer.parent_container) — loop markers, not routed edges. ResearchStudy also pulls in its TimePoint edges; the loops are the circular arrows on the rows.",sel:["TimePoint","File","Specimen","ResearchStudy","SpecimenContainer"]}]},{heading:"Inheritance (merged sibling boxes)",cases:[{name:"One child, merged with its parent",note:"MeasurementObservation alone. It still merges: the box is titled Observation, its 13 inherited rows sit at the top in black, and MeasurementObservation's own 9 follow under its coloured header. Merging does not wait for a second sibling — a class must not change shape because of what else you happen to select.",sel:["MeasurementObservation"]},{name:"Children that add nothing",note:'SpecimenQuality- and SpecimenQuantityObservation declare no slots of their own. Both still get a header under the shared rows, because "this subclass adds nothing" is the answer to what they are — and without the headers the selection would leave no trace in the box at all.',sel:["SpecimenQualityObservation","SpecimenQuantityObservation"]},{name:"slot_usage — same name, different type",note:"QuestionnaireResponseValue's five children each narrow `value` to a different type (boolean, decimal, integer, TimePoint, and the parent's string). That narrowing is the entire reason the five classes exist, so each keeps its OWN row rather than merging into the parent's — the one place a shared row would be a lie.",sel:["QuestionnaireResponseValueBoolean","QuestionnaireResponseValueDecimal","QuestionnaireResponseValueInteger","QuestionnaireResponseValueString","QuestionnaireResponseValueTimePoint"]},{name:"The full Observation family",note:"All five Observation subclasses plus the parent. One box where there would be six, and the shared rows are stated once. Note each edge leaves in the colour of the child that owns its row; inherited slots' edges are the parent's and are drawn once, not once per child.",sel:["Observation","MeasurementObservation","SdohObservation","DimensionalObservation","SpecimenQualityObservation","SpecimenQuantityObservation"]}]},{heading:"The bare diagonal",cases:[{name:"BodySite 6-way (the original)",note:"The reproducer from the handoff. In ⌙ (bend) the top approach arrives as a straight diagonal with no steps; in ⋙ (near) it keeps its horizontal run. This is the case the fix has to fix.",sel:["BodySite","Condition","Consent","Demography","Exposure","Observation","Procedure","ImagingFile","ImagingStudy","MeasurementObservation","SpecimenCreationActivity"]},{name:"BodySite, owners only",note:"The same convergence with nothing else on canvas — six owners, no unrelated boxes for a diagonal to cut across. Shows whether the degeneracy is about the convergence itself or about crowding.",sel:["BodySite","Condition","ImagingFile","ImagingStudy","MeasurementObservation","Procedure","SpecimenCreationActivity"]},{name:"TimePoint 16-edge",note:"Densest corridor in the schema: 8 owners but 16 slot-edges, since each Specimen*Activity owns date_started and date_ended. Also where the second-from-top edge goes diagonal and pair edges cross.",sel:["TimePoint","Consent","ResearchStudy","TimePeriod","SpecimenCreationActivity","SpecimenProcessingActivity","SpecimenStorageActivity","SpecimenTransportActivity","QuestionnaireResponseValueTimePoint"]},{name:"TimePoint + Person (crossing)",note:"Siggie's repro for the crossing bug: the paired date_started / date_ended edges from different owners cross each other on the way in. Compare pair ordering against the case above.",sel:["TimePoint","Person","Consent","ResearchStudy","TimePeriod","SpecimenCreationActivity","SpecimenProcessingActivity","SpecimenStorageActivity","SpecimenTransportActivity","QuestionnaireResponseValueTimePoint"]}]},{heading:"Pathological convergences",cases:[{name:"Quantity 19-edge (worst case)",note:"The largest convergence in the schema: 16 owning classes, 19 slot-edges. The fan is squeezed hardest here, so ENTITY_FAN_GAP and the merge distance both show their limits.",sel:["Quantity","Activity","Assay","DeviceExposure","DimensionalObservation","DrugExposure","MeasurementObservation","Observation","Procedure","SdohObservation","SpecimenCreationActivity","SpecimenProcessingActivity","SpecimenQualityObservation","SpecimenQuantityObservation","SpecimenStorageActivity","SpecimenTransportActivity","Substance"]},{name:"Context 6-way (uniform owners)",note:"Six owners that are all observation classes — same size, same shape, similar row counts. The controlled comparison for BodySite, whose owners vary wildly in height.",sel:["Context","DimensionalObservation","MeasurementObservation","Observation","SdohObservation","SpecimenQualityObservation","SpecimenQuantityObservation"]},{name:"Two convergences at once",note:"Quantity and TimePoint both converge from the same Specimen activity classes, so two corridors compete for the same space. Where merge distance trades off against crossings.",sel:["Quantity","TimePoint","SpecimenCreationActivity","SpecimenProcessingActivity","SpecimenStorageActivity","SpecimenTransportActivity"]}]},{heading:"Flipped divergences (found via the legend)",cases:[{name:"Participant 22-way (largest fan in the schema)",note:"Bigger than any inbound convergence: 22 edges leaving Participant, 21 of them FLIPPED. Flipped edges keep their attribute-row anchor and must not merge, so this is the fan the merge code deliberately does not touch — and therefore the one nothing has been tuned against.",sel:["Participant","Condition","Consent","Demography","DeviceExposure","DrugExposure","Exposure","File","ImagingStudy","MeasurementObservation","Observation","Procedure","SdohObservation","Specimen","Visit"]},{name:"Visit 19-way",note:"The same shape one size down, and it overlaps Participant heavily — most classes carry both associated_participant and associated_visit, so the two fans run through the same corridor as pairs.",sel:["Visit","Condition","Demography","DeviceExposure","DrugExposure","Exposure","ImagingStudy","MeasurementObservation","Observation","Procedure","QuestionnaireResponse","SdohObservation","TimePeriod"]},{name:"Participant + Visit + Organization",note:"All three FK hubs at once (22 + 19 + 11 edges, nearly all flipped). The densest picture the schema can produce, and the stress test for anything that changes routing.",sel:["Participant","Visit","Organization","Condition","Demography","DimensionalObservation","MeasurementObservation","Observation","ObservationSet","Procedure","SdohObservation","SpecimenQualityObservation","SpecimenQuantityObservation"]},{name:"Converge and diverge at once",note:"MeasurementObservation owns BodySite/Context/Quantity while being owned by Participant/Visit/Organization — edges fan IN and OUT of the same box. Where merged (entity-end) and unmerged (flipped) arrivals sit side by side.",sel:["MeasurementObservation","BodySite","Context","Quantity","Participant","Visit","Organization","MeasurementObservationSet"]}]},{heading:"Normal cases (a fix must not break these)",cases:[{name:"Single edge",note:"One owner, one edge, no convergence at all — merging is a no-op. The floor: if this looks wrong, something basic broke.",sel:["Visit","TimePeriod"]},{name:"Two owners",note:"The smallest real convergence. Two approaches, one arrowhead — the fan is barely a fan, so a merge distance that is too long is obvious here first.",sel:["Participant","Visit","ObservationSet"]},{name:"Specimen chain (deep, not wide)",note:"A long ownership chain rather than a convergence: many layers, few edges per node. Checks that tuning for convergences has not made ordinary edges worse.",sel:["Specimen","SpecimenContainer","SpecimenCreationActivity","SpecimenProcessingActivity","SpecimenStorageActivity","SpecimenTransportActivity","Participant"]},{name:"The known 3-node cycle",note:"Specimen -> SpecimenStorageActivity -> SpecimenContainer -> Specimen: an association plus two ownership edges. Known and deliberately unhandled; here so it stays visible.",sel:["Specimen","SpecimenStorageActivity","SpecimenContainer"]},{name:"Backward ownership (own-bkwd)",note:"Slots drawn backward (performed_by, associated_person, contained_in, related_imaging_study). These keep their attribute-row anchor and must NOT merge — check the arrowheads.",sel:["Organization","Person","Participant","ImagingFile","ImagingStudy","SpecimenContainer","Specimen"]},{name:"Path to root",note:"Path-to-root on from a single deep class, which pulls in every owner up the chain. The biggest graph reachable in one click.",sel:["MeasurementObservation"],roots:!0}]}],nm=3,ts=40;function rl(){const[e,t]=m.useState(null),n=m.useCallback(i=>{if(i.button!==0||i.target.closest('button, a, input, select, textarea, [role="button"], [data-no-drag]'))return;const o=(i.currentTarget.closest("[data-draggable]")??i.currentTarget).getBoundingClientRect(),a=i.clientX,c=i.clientY,l={left:o.left,top:o.top},h=i.currentTarget;h.setPointerCapture(i.pointerId);let f=!1;const u=y=>{const x=y.clientX-a,p=y.clientY-c;if(!f&&Math.hypot(x,p)<nm)return;f=!0;const w={left:Math.max(Math.min(l.left+x,window.innerWidth-ts),ts-o.width),top:Math.min(Math.max(l.top+p,0),window.innerHeight-ts)};t(w)},g=y=>{h.releasePointerCapture(y.pointerId),h.removeEventListener("pointermove",u),h.removeEventListener("pointerup",g),h.removeEventListener("pointercancel",g)};h.addEventListener("pointermove",u),h.addEventListener("pointerup",g),h.addEventListener("pointercancel",g)},[]),s=m.useCallback(()=>t(null),[]);return{offset:e,onPointerDown:n,reset:s}}function al({title:e,subtitle:t,onClose:n,offset:s,children:i}){const r=rl();m.useEffect(()=>{const a=c=>{c.key==="Escape"&&n()};return window.addEventListener("keydown",a),()=>window.removeEventListener("keydown",a)},[n]);const o=r.offset!==null;return d.jsxs("div",{"data-draggable":"",style:{resize:"both",...r.offset?{position:"fixed",...r.offset,right:"auto"}:{}},className:`z-30 w-[26rem] max-h-[80vh] overflow-y-auto
                  rounded-lg border border-gray-300 dark:border-slate-600
                  bg-white dark:bg-slate-800 shadow-xl
                  text-gray-900 dark:text-gray-100
                  ${o?"":`absolute top-14 ${s?"right-[27rem]":"right-4"}`}`,children:[d.jsxs("div",{onPointerDown:r.onPointerDown,className:`sticky top-0 flex items-baseline justify-between gap-2 px-4 py-2
                   border-b border-gray-200 dark:border-slate-700
                   bg-white dark:bg-slate-800 cursor-grab active:cursor-grabbing
                   select-none`,children:[d.jsxs("div",{children:[d.jsx("h2",{className:"text-sm font-semibold",children:e}),t&&d.jsx("p",{className:"text-[11px] text-gray-500 dark:text-gray-400",children:t})]}),d.jsxs("div",{className:"flex items-center gap-1 shrink-0",children:[o&&d.jsx("button",{onClick:r.reset,title:"Put it back",className:`text-gray-400 hover:text-gray-700 dark:hover:text-gray-200
                         text-xs leading-none px-1`,children:"⤺"}),d.jsx("button",{onClick:n,title:"Close (Esc)",className:"text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-lg leading-none",children:"×"})]})]}),d.jsx("div",{className:"px-4 py-2",children:i})]})}function sm(e,t){return e.sel.length===t.size&&e.sel.every(n=>t.has(n))}function im({onClose:e,onApply:t,selectedIds:n,dataService:s,offset:i}){const r=m.useMemo(()=>s.getConvergenceRanking(),[s]),o=m.useMemo(()=>s.getDivergenceRanking(),[s]),a=c=>t({name:"ad hoc",note:"",sel:c});return d.jsxs(al,{title:"Example cases",subtitle:"Selections worth looking at, simple to dense.",onClose:e,offset:i,children:[d.jsxs("section",{className:"mb-4",children:[d.jsx(Zo,{children:"Biggest fans"}),d.jsx("p",{className:"text-[11px] text-gray-500 dark:text-gray-400 mb-1.5",children:"Counted in slot-edges, not classes: one class owning a target through two slots crowds the corridor twice. Click a row to load just that fan."}),d.jsx("div",{className:"grid grid-cols-2 gap-3",children:[["Converging (in)",r.slice(0,6).map(c=>({entity:c.entity,n:c.edgeCount,peers:c.owners,flipped:0}))],["Diverging (out)",o.slice(0,6).map(c=>({entity:c.entity,n:c.edgeCount,peers:c.owned,flipped:c.flippedCount}))]].map(([c,l])=>d.jsxs("div",{children:[d.jsx("h4",{className:"text-[10px] font-medium text-gray-500 dark:text-gray-400 mb-0.5",children:c}),d.jsx("ul",{className:"space-y-0.5",children:l.map(h=>d.jsx("li",{children:d.jsxs("button",{onClick:()=>a([h.entity,...h.peers]),title:`Select ${h.entity} and all ${h.peers.length} peers`,className:"w-full text-left text-xs hover:bg-gray-50 dark:hover:bg-slate-700 rounded px-1",children:[d.jsx("span",{className:"text-blue-600 dark:text-blue-400",children:h.entity}),d.jsxs("span",{className:"text-gray-400 ml-1",children:[h.n,h.flipped>0?` (${h.flipped} flipped)`:""]})]})},h.entity))})]},c))})]}),tm.map(c=>d.jsxs("section",{className:"mb-3 last:mb-1",children:[d.jsx(Zo,{children:c.heading}),d.jsx("ul",{className:"space-y-1.5",children:c.cases.map(l=>{const h=sm(l,n);return d.jsx("li",{children:d.jsxs("button",{onClick:()=>t(l),className:`block w-full text-left rounded px-2 py-1 border
                      ${h?"border-blue-500 bg-blue-50 dark:bg-blue-950":"border-transparent hover:bg-gray-50 dark:hover:bg-slate-700"}`,children:[d.jsx("span",{className:`text-xs font-medium ${h?"text-blue-700 dark:text-blue-300":"text-blue-600 dark:text-blue-400"}`,children:l.name}),d.jsxs("span",{className:"ml-1.5 text-[10px] text-gray-400",children:[l.sel.length,l.roots?" ⇱":""]}),d.jsx("p",{className:"text-[11px] leading-snug text-gray-600 dark:text-gray-400 mt-0.5",children:l.note})]})},l.name)})})]},c.heading))]})}function Zo({children:e}){return d.jsx("h3",{className:`text-[11px] font-semibold uppercase tracking-wider
                   text-gray-400 dark:text-gray-500 mb-1`,children:e})}const Jo={"own-fwd":{text:"owns (forward)",color:we.ownFwd},"own-bkwd":{text:"belongs to (backward)",color:we.ownBkwd},association:{text:"association (no ownership)",color:we.association},excluded:{text:"dropped",cls:"text-gray-400 dark:text-gray-500 border-gray-300"}},om=[{kind:"own-fwd",color:we.ownFwd,title:ie.kinds["own-fwd"].label,body:"The arrow runs from the owner to what it holds. A owns B when the schema puts the collection on A, or when B has no independent existence — a Quantity of 5 mg is not something you look up."},{kind:"own-bkwd",color:we.ownBkwd,title:ie.kinds["own-bkwd"].label,body:'The same relationship stored at the other end: A carries a pointer to one B that exists without it. Drawn B → A, so you still read "start at B to find A". A Participant carries on existing whether or not any observation points at it.'},{kind:"association",color:we.association,title:ie.kinds.association.label,body:"Neither owns the other. Dashed, with arrowheads at both ends. Only two edges in the schema are this — a slot the ownership rules would otherwise claim, wrongly."}],rm=[{glyph:"⇱ roots",what:"Also draw everything on the path up to a root."},{glyph:"LR / TB",what:"Lay the diagram out left-to-right or top-down."},{glyph:"⋙ ⋙⋙ ⌙ ≡",what:"Where converging edges join before their shared arrowhead — near the box, early, at the last corner, or not at all. Temporary, for picking one by eye."},{glyph:"+ − 1:1 ⛶",what:"Zoom in, out, reset, fit to view."}],am=[["0..1","optional, at most one"],["1..1","required, exactly one"],["0..*","optional, any number"],["1..*","required, one or more"]];function lm({dataService:e,onClose:t,onSelect:n,offset:s}){const i=m.useMemo(()=>e.getOwnershipPairGroups(),[e]),[r,o]=m.useState(null),a=c=>d.jsx("button",{onClick:()=>n([c]),className:"hover:underline text-blue-600 dark:text-blue-400",title:`Select ${c}`,children:c});return d.jsx(al,{title:"Ownership legend",subtitle:"What the diagram's arrows, colors and buttons mean.",onClose:t,offset:s,children:d.jsxs("div",{className:"text-xs",children:[d.jsxs(Tt,{title:"The three kinds of relationship",children:[d.jsxs("p",{className:"text-[11px] text-gray-500 dark:text-gray-400 mb-2",children:["Every edge is a class-valued attribute. Classes are placed so that if ",d.jsx("b",{children:"A"})," is drawn before ",d.jsx("b",{children:"B"}),", you reach ",d.jsx("b",{children:"B"})," through"," ",d.jsx("b",{children:"A"})," — so an edge always tells you where to start."]}),d.jsx("ul",{className:"space-y-2",children:om.map(c=>d.jsxs("li",{className:"flex gap-2",children:[d.jsx(gi,{kind:c.kind,className:"mt-0.5"}),d.jsxs("div",{className:"min-w-0",children:[d.jsx("div",{className:"font-medium",style:{color:c.color},children:c.title}),d.jsx("p",{className:"text-[11px] leading-snug text-gray-600 dark:text-gray-400",children:c.body})]})]},c.title))}),d.jsxs("p",{className:"text-[11px] leading-snug text-gray-500 dark:text-gray-400 mt-2",children:["An edge leaves the ",d.jsx("b",{children:"attribute's row"}),", not the box — that is how you tell which attribute made it. A ",d.jsx("b",{children:"⟲"})," on a row is a slot pointing back at its own class."]}),d.jsxs("p",{className:"text-[11px] leading-snug text-gray-500 dark:text-gray-400 mt-2",children:["Owners are drawn first, so a box's ",d.jsx("b",{children:"← N"})," counts what it belongs to (on its left) and ",d.jsx("b",{children:"M →"})," what it owns (on its right). Hover either to list them. The little edge on each row is the one above: it says which end holds the arrowhead, and so which entity declares the attribute — and ",d.jsx("i",{children:"both"})," kinds turn up on ",d.jsx("i",{children:"both"})," sides."]})]}),d.jsxs(Tt,{title:"Colors",children:[d.jsx(er,{caption:"A row's dot and its range label say what KIND of thing the attribute points at.",items:[{color:St.entity,label:"another entity"},{color:St.enum,label:"a value set"},{color:St.dataType,label:"a data type"}]}),d.jsxs("p",{className:"text-[11px] leading-snug text-gray-600 dark:text-gray-400 mt-2",children:["A ",d.jsx("b",{children:"filled"})," dot draws an edge; a ",d.jsx("b",{children:"hollow"})," one does not, because what it points at is not on the canvas. Only entity ranges can draw edges at all."]}),d.jsx(er,{className:"mt-3",caption:"Inside a merged box, a color says which entity an attribute belongs to.",items:Ll.slice(0,4).map((c,l)=>({color:c.text,swatch:c.fill,label:l===0?"the parent":`child ${l}`}))})]}),d.jsx(Tt,{title:"Cardinality",children:d.jsx("ul",{className:"flex flex-wrap gap-x-4 gap-y-1",children:am.map(([c,l])=>d.jsxs("li",{className:"flex items-center gap-1.5",children:[d.jsx("span",{className:"font-mono text-[11px] text-gray-700 dark:text-gray-300",children:c}),d.jsx("span",{className:"text-[11px] text-gray-500 dark:text-gray-400",children:l})]},c))})}),d.jsx(Tt,{title:"The toolbar",children:d.jsx("ul",{className:"space-y-1",children:rm.map(c=>d.jsxs("li",{className:"flex gap-2",children:[d.jsx("span",{className:"shrink-0 font-mono text-[11px] text-gray-700 dark:text-gray-300 w-20",children:c.glyph}),d.jsx("span",{className:"text-[11px] leading-snug text-gray-600 dark:text-gray-400",children:c.what})]},c.glyph))})}),d.jsxs(Tt,{title:"Every relationship, by rule",children:[d.jsx("p",{className:"text-[11px] text-gray-500 dark:text-gray-400 mb-1.5",children:"Derived live from the classifier the graph itself uses, so this cannot drift from what is drawn. Overrides and value-object membership are hand-curated — if a pair looks wrong, the classification is. Click any class to select it."}),d.jsx("ul",{className:"space-y-1",children:i.map(c=>{const l=`${c.verdict}/${c.rule}`,h=Jo[c.verdict]??Jo.excluded,f=r===l;return d.jsxs("li",{className:"border-l-2 pl-2 border-gray-200 dark:border-slate-600",children:[d.jsxs("button",{onClick:()=>o(f?null:l),className:"w-full text-left",children:[d.jsx("span",{className:`inline-block px-1 rounded border text-[10px] ${h.cls??""}`,style:h.color?{color:h.color,borderColor:h.color}:void 0,children:h.text}),d.jsx("span",{className:"ml-1.5 font-medium",children:c.rule}),d.jsx("span",{className:"ml-1 text-gray-400",children:c.pairs.length}),d.jsx("span",{className:"ml-1 text-gray-400",children:f?"▾":"▸"})]}),d.jsx("p",{className:"text-[11px] leading-snug text-gray-600 dark:text-gray-400 mt-0.5",children:c.ruleText}),f&&d.jsx("ul",{className:"mt-1 mb-1.5 space-y-0.5 font-mono text-[10px]",children:c.pairs.map(u=>d.jsxs("li",{className:"text-gray-600 dark:text-gray-400",children:[a(u.declaredOn),d.jsxs("span",{className:"text-gray-400",children:[".",u.slotName]}),d.jsx("span",{className:"mx-1 text-gray-400",children:u.multivalued?"↠":"→"}),a(u.range),u.isLoop&&d.jsx("span",{className:"ml-1",style:{color:St.entity},children:"loop"}),(c.verdict==="own-bkwd"||c.verdict==="association")&&d.jsxs("span",{className:"ml-1 text-gray-400",children:["(owner: ",u.owner,")"]})]},`${u.declaredOn}.${u.slotName}`))})]},l)})})]}),d.jsxs("p",{className:"text-[10px] text-gray-400 dark:text-gray-500 mt-3",children:["A box's ",d.jsx("b",{children:"“N related”"})," count is of distinct classes"," ",d.jsx("i",{children:"outside"})," it, so selecting a class that folds into a merged box can make the number go ",d.jsx("i",{children:"down"}),". Correct, if counter-intuitive."]})]})})}function Tt({title:e,children:t}){return d.jsxs("section",{className:"mb-4 last:mb-1",children:[d.jsx("h3",{className:`text-[11px] font-semibold uppercase tracking-wider
                     text-gray-400 dark:text-gray-500 mb-1`,children:e}),t]})}function er({caption:e,items:t,className:n}){return d.jsxs("div",{className:n,children:[d.jsx("p",{className:"text-[11px] text-gray-500 dark:text-gray-400 mb-1",children:e}),d.jsx("ul",{className:"flex flex-wrap gap-x-3 gap-y-1",children:t.map(s=>d.jsxs("li",{className:"flex items-center gap-1",children:[d.jsx("span",{className:"inline-block w-3 h-3 rounded-sm border",style:{background:s.swatch??s.color,borderColor:s.color}}),d.jsx("span",{className:"text-[11px]",style:{color:s.color},children:s.label})]},s.label))})]})}const cm=!1,hm=!1,ll=m.createContext(null);function at(){const e=m.useContext(ll);if(!e)throw new Error("useHelp must be used inside <HelpProvider>");return e}const dm=300,um=[{id:"graph-canvas-reading",label:"Reading the diagram"},{id:"relation-bar",label:"The relation bar"},{id:"merged-boxes",label:"Inheritance and merged boxes"},{id:"node-dismiss",label:"Closing a box"},{id:"copy-link",label:"Sharing what you see"}];function fm({onOpenLegend:e,onOpenCases:t,legendOpen:n,casesOpen:s,onClosePanels:i,anyPanelOpen:r}){const{showEntry:o,showAddresses:a,toggleAddresses:c}=at(),[l,h]=m.useState(!1),f=m.useRef(void 0),u=()=>{f.current!==void 0&&(clearTimeout(f.current),f.current=void 0)},g=()=>{u(),f.current=setTimeout(()=>h(!1),dm)};m.useEffect(()=>u,[]),m.useEffect(()=>{if(!l)return;const x=w=>{w.target?.closest("[data-help-menu]")||h(!1)},p=w=>{w.key==="Escape"&&h(!1)};return document.addEventListener("mousedown",x,!0),document.addEventListener("keydown",p),()=>{document.removeEventListener("mousedown",x,!0),document.removeEventListener("keydown",p)}},[l]);const y=x=>()=>{h(!1),x()};return d.jsxs("span",{"data-help-menu":!0,"data-help-id":"help-menu",className:"relative",onMouseEnter:()=>{u(),h(!0)},onMouseLeave:g,children:[d.jsxs("button",{onClick:()=>h(x=>!x),title:"Legend, example cases and help topics",className:`text-sm underline hover:text-white ${l?"text-white":"text-blue-100"}`,children:["Help ",d.jsx("span",{"aria-hidden":!0,className:"opacity-70",children:"▾"})]}),l&&d.jsxs("div",{className:`absolute right-0 top-full mt-1 z-40 w-60 py-1
                     rounded-md border border-gray-300 dark:border-slate-600
                     bg-white dark:bg-slate-800 shadow-xl
                     text-gray-900 dark:text-gray-100`,children:[d.jsxs(an,{onClick:y(e),children:[n?"Hide ownership legend":"Ownership legend",d.jsx(ns,{children:"every relationship in the schema, by rule"})]}),d.jsxs(an,{onClick:y(t),children:[s?"Hide example cases":"Example cases",d.jsx(ns,{children:"selections worth looking at"})]}),r&&d.jsxs(an,{onClick:y(i),children:["Close all panels",d.jsx(ns,{children:"legend, cases and the detail drawer"})]}),d.jsx(pm,{}),um.map(x=>d.jsx(an,{onClick:y(()=>o(x.id)),children:x.label},x.id)),hm]})]})}function an({onClick:e,children:t}){return d.jsx("button",{onClick:e,className:`block w-full text-left px-3 py-1.5 text-xs
                 hover:bg-gray-100 dark:hover:bg-slate-700`,children:t})}function ns({children:e}){return d.jsx("span",{className:"block text-[10px] text-gray-400 dark:text-gray-500",children:e})}function pm(){return d.jsx("div",{className:"my-1 border-t border-gray-200 dark:border-slate-700"})}function cl(e){const t=Number(e?.trim());return Number.isFinite(t)&&t>=240?t:void 0}function hl(e){const t=e?.trim().toLowerCase();return t==="dim"||t==="ring"||t==="none"?t:void 0}function dl(e){const t=e?.trim().toLowerCase();return t==="left"||t==="right"||t==="top"||t==="bottom"?t:void 0}function ul(e){const t=e?.trim();if(!t)return;const n=Number(t);if(Number.isFinite(n))return{px:n};const s=t.match(/^(-)?(?:anchor|parentBox)\.(width|height)(?:\s*\*\s*(-?[\d.]+))?$/i);if(!s)return;const[,i,r,o]=s,a=o===void 0?1:Number(o);if(Number.isFinite(a))return{of:r.toLowerCase(),times:i?-a:a}}function $t(e,t){const n=e?.trim();if(!n)return{kind:"help-id",arg:t};if(n==="none")return{kind:"none"};const s=n.indexOf(":");return s===-1?{kind:"help-id",arg:n}:{kind:n.slice(0,s).trim(),arg:n.slice(s+1).trim()}}const mm="Format",gm="Walkthrough",ym=new Set([mm,"TODO"]),fl=/^<\/?(?:details|summary)\b[^>]*>$/i;function ge(e,t){const n=t.toLowerCase();for(const s of e){const i=lt(s);if(i){if(i.name==="beats"&&n!=="beats")return;if(i.name===n)return i.value}}}function lt(e){const t=e.trimStart().match(/^-\s+(.*)$/);if(!t)return;const n=t[1].replace(/\*\*/g,""),s=n.indexOf(":");if(s===-1)return;const i=n.slice(0,s).trim();if(/^[A-Za-z_][A-Za-z0-9_]*$/.test(i))return{name:i.toLowerCase(),value:n.slice(s+1).trim()}}function wi(e){return e.length>0&&!/^\s/.test(e)&&lt(e)!==void 0}function pl(e,t){const n=t.toLowerCase(),s=e.findIndex(l=>lt(l)?.name===n);if(s===-1)return;const i=lt(e[s]).value,r=[];for(let l=s+1;l<e.length&&!(wi(e[l])||fl.test(e[l].trim()));l++)r.push(e[l]);for(;r.length&&r[r.length-1].trim()==="";)r.pop();if(r.length===0)return i;const o=r.filter(l=>l.trim()!=="").map(l=>l.length-l.trimStart().length),a=Math.min(...o),c=r.map(l=>l.slice(a)).join(`
`);return i?`${i}
${c}`:c}function bm(e,t){const n=t.toLowerCase(),s=e.findIndex(r=>lt(r)?.name===n);if(s===-1)return[];const i=[];for(let r=s+1;r<e.length;r++){const o=e[r].trimStart();if(wi(e[r])||o==="")break;o.startsWith("- ")&&i.push(o.slice(2).trim())}return i}function wm(e,t){const n=e.findIndex(o=>lt(o)?.name==="beats");if(n===-1)return;const s=[];let i=null;const r=()=>{i&&s.push(i)};for(let o=n+1;o<e.length;o++){const a=e[o].trimStart();if(wi(e[o])||e[o].length>0&&!/^\s/.test(e[o])&&/^<\/?[a-z]/i.test(a))break;if(a==="")continue;const c=a.match(/^(\d+)\.\s+(.*)$/);if(c){r(),i={text:c[2].trim()};continue}const l=lt(a);if(l&&i){const{name:h,value:f}=l;if(h==="description"){const u=e[o].length-e[o].trimStart().length,g=[];let y=o+1;for(;y<e.length;y++){if(e[y].trim()===""){g.push("");continue}if(e[y].length-e[y].trimStart().length<=u)break;g.push(e[y])}for(;g.length&&g[g.length-1].trim()==="";)g.pop();if(g.length){const x=g.filter(S=>S.trim()!=="").map(S=>S.length-S.trimStart().length),p=Math.min(...x),w=g.map(S=>S.slice(p)).join(`
`);i.description=f?`${f}
${w}`:w}else i.description=f;o=y-1;continue}h==="anchor"?i.anchor=$t(f,t):h==="spotlight"?i.spotlight=$t(f,t):h==="action"?i.action=f.trim():h==="change"?i.change=f.trim():h==="only"?(i.change=f.trim(),i.replace=!0):h==="highlight"?i.highlight=hl(f):h==="width"?i.width=cl(f):h==="position"?i.position=dl(f):h==="offsetx"?i.offsetX=ul(f):h==="keep"&&(i.keep=f.trim()!=="false");continue}i&&!a.startsWith("-")&&(i.text=`${i.text} ${a}`.trim())}return r(),s.length>0?s:void 0}function xm(e,t){const n=e.split(`
`),i=n[0].match(/^###\s+(.+)$/);if(!i)return null;const r=i[1].trim(),o=ge(n,"Title")??r,a=pl(n,"Description")??"",c=bm(n,"Interactions"),l=ge(n,"Shortcut"),h=ge(n,"Context"),f=$t(ge(n,"Anchor"),r),u=ge(n,"Spotlight"),g=u===void 0?void 0:$t(u,r),y=ge(n,"Action"),x=ge(n,"Once"),p=ge(n,"Only"),w=ge(n,"Change"),S=w??p,v=w===void 0&&p!==void 0?!0:void 0,b=hl(ge(n,"Highlight")),k=cl(ge(n,"Width")),A=dl(ge(n,"Position")),C=ul(ge(n,"OffsetX")),E=wm(n,r),L=ge(n,"Tour");return{id:r,title:o,description:a,interactions:c,shortcut:l,context:h,anchor:f,action:y,once:x,change:S,replace:v,highlight:b,width:k,position:A,offsetX:C,tour:L===void 0?void 0:L||gm,order:t,beats:E,...g?{spotlight:g}:{}}}function vm(e,t){const n=e.split(`
`),s=n.findIndex(g=>/^##\s+/.test(g)),i=s===-1?null:n[s].match(/^##\s+(.+)$/),r=i?i[1].trim():"Unknown",o=r.toLowerCase().replace(/[^a-z0-9]+/g,"-"),a=[];for(let g=s+1;g<n.length&&!n[g].startsWith("### ");g++)fl.test(n[g].trim())||a.push(n[g]);const c=a.join(`
`).trim(),l=ge(a,"TourMetadata"),h=l===void 0?void 0:{name:l||r,description:pl(a,"Description")?.trim()??"",abbr:ge(a,"TourAbbr")?.trim()||void 0},f=[],u=e.split(/(?=^### )/m);for(const g of u){if(!g.startsWith("### "))continue;const y=xm(g.trim(),t());y&&f.push(y)}return{id:o,title:r,body:c,entries:f,tourMeta:h}}function Is(e){const t=new Set;for(const n of[...e.entries.values()].sort((s,i)=>s.order-i.order))n.tour&&t.add(n.tour);return[...t]}function ml(e,t){const n=t??Is(e)[0];return[...e.entries.values()].filter(s=>s.tour!==void 0&&s.tour===n).sort((s,i)=>s.order-i.order)}function ss(e,t){return t<0?e:`${e} ▸${t+1}`}function is(e){return`### ${e}`}function Bs(e,t){const n=[];return ml(e,t).forEach((s,i)=>{const r=i+1;if(!s.beats||s.beats.length===0){n.push({entry:s,step:r,beatIndex:0,beatCount:0,address:ss(s.id,-1),searchFor:is(s.id),blocks:[s.description],text:s.description,anchor:s.anchor,...s.spotlight?{spotlight:s.spotlight}:{},action:s.action,change:s.change,replace:s.replace,highlight:s.highlight,width:s.width,position:s.position,offsetX:s.offsetX});return}let o=s.description?[s.description]:[];o.length>0&&n.push({entry:s,step:r,beatIndex:-1,beatCount:s.beats.length,address:ss(s.id,-1),searchFor:is(s.id),blocks:o,text:o.join(`

`),anchor:s.anchor,...s.spotlight?{spotlight:s.spotlight}:{},action:s.action,change:s.change,replace:s.replace,highlight:s.highlight,width:s.width,position:s.position,offsetX:s.offsetX});let a=s.width;s.beats.forEach((c,l)=>{const h=c.description??"";o=c.keep?[...o,h]:[h],c.width!==void 0&&(a=c.width),n.push({entry:s,step:r,beatIndex:l,beat:c,beatCount:s.beats.length,address:ss(s.id,l),searchFor:is(s.id),blocks:o,text:o.join(`

`),anchor:c.anchor??s.anchor,...c.spotlight??s.spotlight?{spotlight:c.spotlight??s.spotlight}:{},action:c.action,highlight:c.highlight??s.highlight,width:a,position:c.position??s.position,offsetX:c.offsetX??s.offsetX,change:c.change,replace:c.replace})})}),n}function km(e){const n=e.replace(/<!--[\s\S]*?-->/g,"").trim().split(/(?=^## )/m).map(a=>a.trim()).filter(Boolean),s=[],i=new Map;let r=0;for(const a of n){if(!a.match(/^## /m))continue;const c=a.match(/^##\s+(.+)$/m)?.[1].trim();if(c&&ym.has(c))continue;const l=vm(a,()=>r++);s.push(l);for(const h of l.entries)i.set(h.id,h)}const o=new Map;for(const a of s)a.tourMeta&&o.set(a.tourMeta.name,a.tourMeta);return{sections:s,entries:i,tourMeta:o}}const Tm=/\{\{\s*([a-z][a-z0-9-]*)\s*:\s*([^}]*?)\s*\}\}/gi;function Sm(e,t){return!t||!e.includes("{{")?e:e.replace(Tm,(n,s,i)=>t[s.toLowerCase()]?.(i)??n)}function tr(e){const t=new Set;return e.map((n,s)=>({p:n,index:s})).filter(({p:n})=>t.has(n.step)?!1:(t.add(n.step),!0)).map(({p:n,index:s})=>({index:s,step:n.step,title:n.entry.title,beatCount:n.beatCount}))}function gl({scope:e,onClose:t}){const{content:n,tours:s,tourMeta:i,tourName:r,tourIndex:o,positions:a,position:c,goToStep:l,startTour:h}=at();m.useEffect(()=>{const p=w=>{w.key==="Escape"&&(w.stopPropagation(),w.preventDefault(),t())};return window.addEventListener("keydown",p,!0),()=>window.removeEventListener("keydown",p,!0)},[t]);const f=m.useRef(null);m.useEffect(()=>{const p=f.current;if(!(!p||typeof p.showPopover!="function"))return p.showPopover(),()=>{p.matches(":popover-open")&&p.hidePopover()}},[]);const u=m.useMemo(()=>e==="all"?s.map(p=>({name:p,rows:tr(Bs(n,p))})):[],[e,s,n]),g=c?.step,y=o===null?void 0:r,x=(p,w,S)=>d.jsxs("button",{onClick:S,"aria-current":w?"step":void 0,className:`help-map-step${w?" help-map-step-here":""}`,children:[d.jsx("span",{className:"help-map-num",children:p.step}),d.jsx("span",{className:"help-map-title",children:p.title}),p.beatCount>0&&d.jsx("span",{className:"help-map-beats",title:`${p.beatCount+1} screens in this step`,children:p.beatCount+1})]},p.index);return ir.createPortal(d.jsx("div",{ref:f,popover:"manual",className:"help-map-backdrop",onMouseDown:t,children:d.jsxs("div",{role:"dialog","aria-label":e==="all"?"All tours":"Tour outline",className:"help-map",onMouseDown:p=>p.stopPropagation(),children:[d.jsxs("div",{className:"help-map-head",children:[d.jsxs("div",{children:[d.jsx("h2",{children:e==="all"?"Tours":y??"This tour"}),d.jsx("p",{children:e==="all"?"Every guided walk, and what is in it. Click any step to start there.":"Click any step to jump to it."})]}),d.jsx("button",{onClick:t,title:"Close (Esc)",className:"help-map-close",children:"✕"})]}),d.jsx("div",{className:"help-map-body",children:e==="tour"?tr(a).map(p=>x(p,p.step===g,()=>{l(p.index),t()})):u.map(({name:p,rows:w})=>d.jsxs("section",{className:"help-map-tour",children:[d.jsx("button",{className:"help-map-tourname",onClick:()=>{h(p),t()},children:p}),i.get(p)?.description&&d.jsx("p",{className:"help-map-blurb",children:i.get(p).description}),w.map(S=>x(S,y===p&&S.step===g,()=>{y===p?l(S.index):h(p,S.index),t()}))]},p))})]})}),document.body)}function Cm(){const{tours:e,tourMeta:t,startTour:n}=at(),[s,i]=m.useState(!1),{overviewOpen:r,setOverviewOpen:o}=at(),a=m.useRef(null);return m.useEffect(()=>{if(!s)return;const c=h=>{h.target?.closest("[data-tour-chooser]")||i(!1)},l=h=>{h.key==="Escape"&&i(!1)};return document.addEventListener("mousedown",c,!0),document.addEventListener("keydown",l),()=>{document.removeEventListener("mousedown",c,!0),document.removeEventListener("keydown",l)}},[s]),e.length===0?null:d.jsxs("span",{"data-tour-chooser":!0,"data-help-id":"tour-chooser",className:"relative",onMouseEnter:()=>i(!0),children:[d.jsx("button",{onClick:()=>{i(!1),o(!0)},title:"Guided walks through the app and the model; click for the overview",className:`text-sm font-semibold px-2.5 py-1 rounded-full bg-white/95
                   text-blue-700 shadow-sm hover:bg-white hover:shadow`,children:"Guided tours"}),s&&d.jsxs("div",{ref:a,role:"dialog","aria-label":"Guided tours",className:`absolute right-0 top-full mt-1 z-40 w-80 p-1
                     rounded-md border border-gray-300 dark:border-slate-600
                     bg-white dark:bg-slate-800 shadow-xl
                     text-gray-900 dark:text-gray-100`,children:[d.jsxs("p",{className:"px-3 pt-2 pb-1 text-[11px] text-gray-500 dark:text-gray-400",children:["Each one stands on its own. Leave any tour with ",d.jsx("kbd",{children:"Esc"}),"."]}),d.jsxs("button",{"data-tour-overview":!0,onClick:()=>{i(!1),o(!0)},className:`block w-full text-left px-3 py-2 rounded
                       hover:bg-gray-100 dark:hover:bg-slate-700`,children:[d.jsx("span",{className:"block text-xs font-semibold",children:"Overview"}),d.jsxs("span",{className:"block text-[11px] text-gray-500 dark:text-gray-400",children:["All ",e.length," tours and every step in them — start anywhere."]})]}),d.jsx("div",{className:"my-1 border-t border-gray-200 dark:border-slate-700"}),e.map(c=>d.jsxs("button",{onClick:()=>{i(!1),n(c)},className:`block w-full text-left px-3 py-2 rounded
                         hover:bg-gray-100 dark:hover:bg-slate-700`,children:[d.jsx("span",{className:"block text-xs font-semibold",children:c}),t.get(c)?.description&&d.jsx("span",{className:"block text-[11px] text-gray-500 dark:text-gray-400",children:t.get(c).description})]},c))]}),r&&d.jsx(gl,{scope:"all",onClose:()=>o(!1)})]})}const Am="dmvd.help.showAddresses";function Pm(){const e=document.activeElement;return e instanceof HTMLInputElement||e instanceof HTMLTextAreaElement||e?.getAttribute("contenteditable")==="true"}function Em(e,t){if(!t)return e;const n=r=>Sm(r,t),s=r=>r===void 0?void 0:n(r),i=new Map([...e.entries].map(([r,o])=>[r,{...o,description:n(o.description),interactions:o.interactions.map(n),action:s(o.action),context:s(o.context),beats:o.beats?.map(a=>({...a,description:s(a.description),action:s(a.action)}))}]));return{sections:e.sections.map(r=>({...r,entries:r.entries.map(o=>i.get(o.id)??o),tourMeta:r.tourMeta&&{...r.tourMeta,description:n(r.tourMeta.description)}})),entries:i,tourMeta:new Map([...e.tourMeta].map(([r,o])=>[r,{...o,description:n(o.description)}]))}}function Mm({markdown:e,onPushChange:t,onPopChange:n,onJumpChanges:s,onTourStart:i,onTourEnd:r,textResolvers:o,widgets:a,centerOn:c,children:l}){const[h,f]=m.useState(),u=h??o,g=m.useMemo(()=>Em(km(e),u),[e,u]),[y,x]=m.useState(!1),[p,w]=m.useState(null),[S,v]=m.useState(void 0),[b,k]=m.useState(!1),A=m.useMemo(()=>Is(g),[g]),C=m.useMemo(()=>Bs(g,S),[g,S]),E=m.useMemo(()=>ml(g,S).length,[g,S]),[L,I]=m.useState(null),[K,_]=m.useState(()=>!1),R=m.useCallback(()=>{_(G=>{const U=!G;try{window.localStorage.setItem(Am,U?"1":"0")}catch{}return U})},[]),B=m.useCallback(()=>{x(!1),I(null)},[]),Y=m.useCallback(()=>I(null),[]),Z=m.useCallback(G=>I(G),[]),xe=m.useCallback(G=>{const U=C[G];U&&(w(G),I(U.entry.id),U.change!=null&&t&&t(U.change,U.replace))},[C,t]),O=m.useCallback(G=>{C[G+1]?.change!=null&&n&&n();const te=C[G];te&&(w(G),I(te.entry.id))},[C,n]),H=m.useCallback(G=>{if(p===null||G===p)return;const U=C[G];if(U&&s){if(G>p){const te=C.slice(p+1,G+1).filter(re=>re.change!=null).map(re=>({query:re.change,replace:re.replace}));s(te,0)}else{const te=C.slice(G+1,p+1).filter(re=>re.change!=null).length;s([],te)}w(G),I(U.entry.id)}},[p,C,s]),D=m.useCallback((G=Is(g)[0],U=0)=>{x(!1),v(G);const te=Bs(g,G),re=Math.min(Math.max(U,0),Math.max(te.length-1,0)),Te=te[re];if(!Te)return;i?.(),w(re),I(Te.entry.id);const Be=te.slice(0,re+1).filter(Ae=>Ae.change!=null).map(Ae=>({query:Ae.change,replace:Ae.replace}));re>0&&s?s(Be,0):Te.change!=null&&t&&t(Te.change,Te.replace)},[g,t,s,i]),Q=m.useCallback(()=>{w(null),I(null),v(void 0),r?.()},[r]),ve=m.useCallback(()=>{p!==null&&(p+1>=C.length?Q():xe(p+1))},[p,C.length,xe,Q]),ne=m.useCallback(()=>{p!==null&&p>0&&O(p-1)},[p,O]),Me=m.useCallback(()=>{p!==null&&Q(),I(null)},[p,Q]),De=m.useCallback(G=>{if(!G)return null;const{kind:U}=G;if(U==="none")return null;const{arg:te}=G,re=U==="help-id"?te:`${U}:${te}`,Te=document.querySelectorAll(`[data-help-id="${CSS.escape(re)}"]`);return Te.length<2?Te[0]??null:[...Te].find(Be=>Be.getBoundingClientRect().height>0)??Te[0]},[]);m.useEffect(()=>(document.body.classList.toggle("help-mode",y),()=>{document.body.classList.remove("help-mode")}),[y]),m.useEffect(()=>{if(y)return window.addEventListener("blur",B),()=>window.removeEventListener("blur",B)},[y,B]),m.useEffect(()=>{if(!y)return;function G(U){const te=U.target;if(!te)return;const re=te.closest("[data-help-id]");re?(U.stopPropagation(),U.preventDefault(),Z(re.getAttribute("data-help-id"))):te.closest("[data-help-popover]")||Y()}return document.addEventListener("click",G,!0),()=>document.removeEventListener("click",G,!0)},[y,Z,Y]),m.useEffect(()=>{function G(U){if(U.key==="?"&&!Pm()){U.preventDefault(),p===null?k(te=>!te):Q();return}if(U.key==="Escape"&&(y||p!==null||L)){U.preventDefault(),U.stopPropagation(),L&&p===null?Y():p!==null?Q():Me();return}p!==null&&(U.key==="ArrowRight"&&(U.preventDefault(),ve()),U.key==="ArrowLeft"&&(U.preventDefault(),ne()))}return document.addEventListener("keydown",G,!0),()=>document.removeEventListener("keydown",G,!0)},[y,p,L,Me,Y,Q,ve,ne]);const Ce=m.useCallback(()=>c?De($t(c,c))?.getBoundingClientRect()??null:null,[c,De]),ke=m.useMemo(()=>({setTextResolvers:f,helpMode:y,toggleHelpMode:Me,exitHelpMode:B,tourIndex:p,startTour:D,endTour:Q,nextStep:ve,prevStep:ne,goToStep:H,positions:C,position:p===null?void 0:C[p],stepCount:E,tours:A,tourName:S,tourMeta:g.tourMeta,overviewOpen:b,setOverviewOpen:k,...a?{widgets:a}:{},showAddresses:K,toggleAddresses:R,content:g,activeId:L,showEntry:Z,dismissEntry:Y,resolveAnchor:De,centerRect:Ce}),[y,Me,B,p,D,Q,ve,ne,H,C,E,A,S,b,a,K,R,g,L,Z,Y,De,Ce]);return d.jsx(ll.Provider,{value:ke,children:l})}const $s={a:({href:e,children:t})=>d.jsx("a",{href:e,target:"_blank",rel:"noreferrer",children:t}),blockquote:({children:e})=>d.jsxs("div",{className:"help-popover-alert",role:"note",children:[d.jsx("span",{className:"help-popover-alert-mark","aria-hidden":"true",children:"!"}),d.jsx("div",{children:e})]})},Fs="widget:",Dm=e=>e.startsWith(Fs)?e:Nl(e);function Om(e){return function({src:n,alt:s}){if(n?.startsWith(Fs)){const i=n.slice(Fs.length),r=i.indexOf(":"),o=r===-1?i:i.slice(0,r),a=r===-1?"":i.slice(r+1);return e?.[o]?.(a)??d.jsx("span",{children:s})}return d.jsx("img",{src:n,alt:s})}}function Rm(e){try{return localStorage.getItem(e)}catch{return null}}function jm(e,t){try{localStorage.setItem(e,t)}catch{}}const yl="help-once-",os="data-help-anchor",rs="data-help-spotlight",nr="data-help-hint",Lm="--help-hint",Nm=40;function Vm(e){return e.split(`
`).filter(t=>!/^\s{0,3}>/.test(t)).join(`
`).replace(/\n{3,}/g,`

`).trim()}function Im(e){return Rm(yl+e)==="1"}function Bm(e){jm(yl+e,"1")}function $m(e){return{...$s,blockquote:({children:t})=>d.jsxs("div",{className:"help-popover-alert",role:"note",children:[d.jsx("span",{className:"help-popover-alert-mark","aria-hidden":"true",children:"!"}),d.jsxs("div",{children:[t,d.jsxs("label",{className:"help-popover-alert-once",children:[d.jsx("input",{type:"checkbox",onChange:e}),"Don't show this again"]})]})]})}}function Fm(){const{helpMode:e,tourIndex:t,position:n,positions:s,stepCount:i,content:r,activeId:o,dismissEntry:a,nextStep:c,prevStep:l,endTour:h,showEntry:f,resolveAnchor:u,centerRect:g,showAddresses:y,tourName:x,tourMeta:p,widgets:w}=at(),S=x===void 0?void 0:p.get(x)?.abbr??x,[v,b]=m.useState(!1),k=t!==null;m.useEffect(()=>{k||b(!1)},[k]);const A=o?r.entries.get(o):void 0,C=rl(),E=u,L=k?n?.anchor:A?.anchor,I=k?n?.spotlight:A?.spotlight,K=(k?n?.highlight:A?.highlight)??"dim",_=()=>{if(!n||n.beatCount===0)return null;const W=n.beatIndex+1;return d.jsx("span",{className:"help-tour-dots",title:`Screen ${W+1} of ${n.beatCount+1} in this step`,children:Array.from({length:n.beatCount},(se,ue)=>d.jsx("span",{className:ue<W?"help-dot help-dot-on":"help-dot"},ue))})},[R,B]=m.useState(!1),[Y,Z]=m.useState(!1),[xe,O]=m.useState(void 0),[H,D]=m.useState(!1),Q=m.useRef(null),[,ve]=m.useState(0),ne=A?.once,Me=ne!==void 0&&Im(ne),De=m.useMemo(()=>({...ne===void 0?$s:$m(()=>{Bm(ne),ve(W=>W+1)}),img:Om(w)}),[ne,w]),Ce=(k?n?.blocks??[]:[A?.description??""]).map(W=>Me?Vm(W):W).filter(Boolean),ke=(k?n?.width:void 0)??Math.max(Km(Ce.join(`

`)),k?Qm():0),G=m.useRef(!1);m.useEffect(()=>{G.current=!1},[o,L]);const U=C.reset;m.useEffect(()=>{U()},[o,t,U]),m.useLayoutEffect(()=>{if(!o){B(!1),O(void 0);return}let W=null;const se=()=>{const ae=E(L);ae!==W&&(W?.removeAttribute(os),W=ae,B(!!ae),O(ae?.closest("[data-graph-direction]")?.getAttribute("data-graph-direction")==="RIGHT"?"below":void 0),ae&&(ae.setAttribute(os,""),G.current||(G.current=!0,ae.scrollIntoView({block:"center",behavior:"smooth"}))))};se();const ue=new MutationObserver(se);return ue.observe(document.body,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["data-help-id"]}),()=>{ue.disconnect(),W?.removeAttribute(os),B(!1),O(void 0)}},[o,L,E]),m.useLayoutEffect(()=>{if(!o||!I){Z(!1);return}let W=null;const se=()=>{const ae=E(I);ae!==W&&(W?.removeAttribute(rs),W=ae,Z(!!ae),ae?.setAttribute(rs,""))};se();const ue=new MutationObserver(se);return ue.observe(document.body,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["data-help-id"]}),()=>{ue.disconnect(),W?.removeAttribute(rs),Z(!1)}},[o,I,E]);const te=600,re=k&&n?.change!=null&&L!==void 0&&L.kind!=="none",[Te,Be]=m.useState(!1);m.useEffect(()=>{if(!re){Be(!0);return}Be(!1);const W=window.setTimeout(()=>Be(!0),te);return()=>window.clearTimeout(W)},[re,t]);const Ae=Te||R,vt=k?n?.address??"tour":o??"none";m.useEffect(()=>{const W=Q.current;W&&(A&&Ae?W.matches(":popover-open")||W.showPopover():W.matches(":popover-open")&&W.hidePopover())},[A,Ae,vt]),m.useEffect(()=>{(!e||k)&&D(!1)},[e,k]);const Xe=m.useMemo(()=>e&&!k?[...r.entries.values()].filter(W=>E(W.anchor)).slice(0,Nm).map((W,se)=>({id:W.id,title:W.title,name:`${Lm}-${se}`})):[],[e,k,r,E]);return m.useLayoutEffect(()=>{const W=Xe.map(se=>{const ue=E(r.entries.get(se.id)?.anchor);return ue?.setAttribute(nr,se.name),ue}).filter(Boolean);return()=>W.forEach(se=>se.removeAttribute(nr))},[Xe,r,E]),d.jsxs(d.Fragment,{children:[(Y||R)&&o&&K!=="none"&&d.jsx("div",{className:`help-spotlight${K==="ring"?" help-spotlight-ring":""}`,"data-on-spotlight":Y?"":void 0}),Xe.map(({id:W,title:se,name:ue})=>d.jsx("button",{className:"help-hint",title:se??W,style:{positionAnchor:ue},onMouseEnter:()=>{H||f(W)},onMouseLeave:()=>{H||a()},onClick:ae=>{ae.stopPropagation(),D(!0),f(W)},children:"?"},W)),d.jsx("div",{ref:Q,popover:"manual","data-help-popover":"","data-anchored":R&&!C.offset?"":void 0,className:"help-popover",style:{...qm(R,k?n?.position:void 0,k?n?.offsetX:void 0,ke,R?null:g(),xe),...C.offset?{positionArea:"none",left:C.offset.left,top:C.offset.top,right:"auto",bottom:"auto",margin:0,transform:"none"}:{}},children:A&&d.jsxs(d.Fragment,{children:[d.jsxs("h4",{className:"help-popover-title",onPointerDown:C.onPointerDown,style:{cursor:C.offset?"grabbing":"grab",userSelect:"none"},title:"Drag to move",children:[k&&S&&d.jsx("span",{className:"help-popover-tour",children:S}),A.title]}),k&&n?.action&&d.jsxs("div",{className:"help-popover-action",children:[d.jsx("span",{className:"help-popover-action-mark","aria-hidden":"true",children:"✓"}),d.jsx("div",{children:d.jsx(Qt,{children:n.action})})]}),k&&y&&n?.change&&!n.action&&d.jsxs("div",{className:"help-popover-action",style:{opacity:.85},children:[d.jsx("span",{className:"help-popover-action-mark","aria-hidden":"true",children:"⚠"}),d.jsxs("div",{children:[d.jsx("em",{children:"Authoring:"})," this position changes the app (",d.jsx("code",{children:n.change}),") but has no ",d.jsx("code",{children:"Action:"}),"."]})]}),Ce.length>0&&d.jsx("div",{className:"help-popover-body",children:Ce.map((W,se,ue)=>d.jsx("div",{className:se===ue.length-1?void 0:"help-beat-past",children:d.jsx(Qt,{components:De,urlTransform:Dm,children:W})},se))}),A.interactions.length>0&&d.jsx("ul",{className:"help-popover-interactions",children:A.interactions.map((W,se)=>d.jsx("li",{children:d.jsx(Qt,{components:$s,children:W})},se))}),A.shortcut&&d.jsxs("p",{className:"help-popover-shortcut",children:["Shortcut: ",d.jsx("kbd",{children:A.shortcut})]}),A.context&&d.jsx("div",{className:"help-popover-context",children:d.jsx(Qt,{children:A.context})}),k?d.jsxs("div",{className:"help-tour-nav",children:[d.jsxs("span",{className:"help-tour-count",title:`Position ${t+1} of ${s.length}`,children:[n?.step," / ",i]}),_(),d.jsx("button",{className:"help-tour-map-btn",onClick:()=>b(W=>!W),"aria-expanded":v,title:"Show the tour outline",children:"⊞"}),d.jsx("span",{className:"help-tour-spacer"}),d.jsx("button",{onClick:l,disabled:t===0,title:"Previous (← arrow key)",children:"← back"}),d.jsx("button",{onClick:c,className:"help-tour-next",title:"Next (→ arrow key)",children:t+1===s.length?"done":"next →"}),d.jsx("button",{onClick:h,title:"End the tour and undo what it added (Esc)",children:"✕"})]}):d.jsxs("div",{className:"help-tour-nav",children:[d.jsx("span",{className:"help-tour-spacer"}),d.jsx("button",{onClick:()=>{D(!1),a()},children:"close"})]}),y&&d.jsx(_m,{address:k?n?.address:A.id,searchFor:k?n?.searchFor:`### ${A.id}`})]})},vt),v&&k&&d.jsx(gl,{scope:"tour",onClose:()=>b(!1)})]})}function _m({address:e,searchFor:t}){const[n,s]=m.useState(!1);return m.useEffect(()=>{if(!n)return;const i=setTimeout(()=>s(!1),1200);return()=>clearTimeout(i)},[n]),!e||!t?null:d.jsxs("button",{type:"button",className:"help-popover-address",title:`Copy “${t}” — search help-content.md for it`,onClick:()=>{navigator.clipboard?.writeText(t).then(()=>s(!0),()=>{})},children:[e,n?" ✓":""]})}const bl=320,Hm=320,Wm=800,zm=8,Gm=24,Um=3;function Km(e){const t=e.trim().length;return t===0?bl:Math.round(Math.min(Wm,Math.max(Hm,Math.sqrt(t*zm*Gm*Um))))}function Qm(){return 393}function qm(e,t,n,s,i,r){const o=window.innerWidth,a=window.innerHeight,c=Math.min(s??bl,o-16);if(!e){const h=i??new DOMRect(0,0,o,a),f=h.left+h.width/2;return{left:Math.max(8,Math.min(f-c/2,o-c-8)),top:"50%",transform:"translateY(-50%)",maxHeight:`${a-16}px`,width:c}}return{positionArea:t?{right:"inline-end span-block-end",left:"inline-start span-block-end",top:"block-start span-inline-end",bottom:"block-end span-inline-end"}[t]:r==="below"?"block-end span-inline-end":"inline-end span-block-end",width:c,...Ym(n)}}function Ym(e){return e?{marginLeft:"px"in e?`${e.px}px`:`calc(anchor-size(${e.of}) * ${e.times})`}:{}}const as=e=>e&&e.trim()?e.trim():void 0;function Xm(e){return{"model-description":t=>as(e.getClassDescription(t)),"enum-description":t=>as(e.getEnumDetail(t)?.description),"category-label":t=>as(or.find(n=>n.id===t)?.label),edge:t=>t in ie.kinds?`![${ie.kinds[t].label}](widget:edge:${t})`:void 0}}const Zm={edge:e=>e in ie.kinds?d.jsx(gi,{kind:e,width:40,className:"help-inline-widget"}):null},Jm=`# BDCHM Explorer help

Help + tour content for the dmvd Explorer. This file is dmvd's content; the
authoring format it is written in is specified in
[\`src/help/FORMAT.md\`](../help/FORMAT.md), which belongs to the help package
and knows nothing about BDCHM.

Parsed by [\`parseHelpContent.ts\`](../help/parseHelpContent.ts); pinned by
\`src/test/helpContent.test.ts\`. Package-level design lives in
[docs/HELP_PACKAGE_PLAN.md](../../docs/HELP_PACKAGE_PLAN.md).

**Terminology.** The things in the boxes are **entities**, and their rows are
**attributes**. Say "class" only when talking about LinkML itself or about
inheritance (subclass, parent class), where the word is the signal that we
mean is-a and not ownership — "parent" alone is ambiguous in an app whose
left panel nests entities under their owners. Ownership is owner/owned. No
hybrids ("entity class"): state the LinkML equivalence once where the term is
introduced and then use one word.

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
<summary><b>Ownership</b></summary>

## Ownership
- **TourMetadata:**
- **Description:** Why boxes land where they do, and what the three kinds of line mean

<!--

I want to restructure this

-->
### why-ownership

- **Title:** Relationships between entities
- **Tour:** Ownership
- Only: sel=Participant~Condition~BodySite
- **Anchor:** node-box:Condition
- Position: bottom
- Highlight: none
- **Width:** 560
- **Description:**
  The canvas is laid out by **ownership** (aka, containment or has-a
  relationships): an entity is drawn to the right of whatever owns it. That one
  idea is what the whole diagram is about, but the schema doesn't specify
  these relationships. 
- Beats:
  1. own-fwd
     - Title: none
     - Keep: true
     - Highlight: dim
     - Spotlight: slot-row:Condition.affected_body_site
     - Description:
       For instance, **Condition** has an optional (0..1) \`affected_body_site\` attribute
       pointing at **BodySite**, as some conditions can occurr at
       specific body sites.
  2. own-bkwd
     - Title: none
     - Keep: true
     - Highlight: dim
     - Spotlight: slot-row:Condition.associated_participant
     - Description:
       It also has a required (1..1) \`associated_participant\` attribute
       pointing at **Participant**, as condition records must belong to someone
       in a study.
  3. - two-edge-types
     - Title: none
     - Description:
       The LinkML schema does specify **is-a** relationships (see the
       Inheritance tour), and, from a pure data modeling point of view,
       these two attributes define **has-a** relationships. That is, a
       Condition entity *has a* Participant entity and it *has a*
       BodySite entity. But from a how-it-makes-sense-to-think-about-it
       point of view — or which database records depend on others —
       the condition belongs to the participant, not the other way around.

       The schema makes \`associated_participant\` a required attribute
       because it would make no sense to have a Condition record without
       a Participant.
  4. - optional-owners
     - Title: none
     - Change: sel=Visit
     - Anchor: node-box:Visit
     - Description:
       **Visit**, however, is not required in the model (though it may be
       required in the source data). The BDCHM Explorer represents
       Visit as owning Condition because, when an \`associated_visit\`
       is present, the condition was observed or recorded during the
       visit.

### edge-types

- **Title:** Edge types
- **Tour:** Ownership
- Only: sel=Participant~Condition~BodySite
- Spotlight: slot-row:Condition.affected_body_site
- **Anchor:** node-box:Condition
- **Width:** 550
- **Description:**
  So, when the Explorer has configured an attribute target as
  *belonging to* its defining entity, it places the target to the right and
  draws a forward-pointing arrow.

  \`Condition.affected_body_site\` {{edge:own-fwd}}&nbsp;\`BodySite\`
- Beats:
  1. backwards
     - Keep: true
     - Spotlight: slot-row:Condition.associated_participant
     - Description:
       When the target is considered to be *owned by*
       the defining entity, it places the target to the left
       and draws a backward-pointing arrow {{edge:own-bkwd}}


       or {{edge:association}}
- **Beats:**
  1. belongs to
     - Description:
       ##### Belongs to
       \`source_participant\` holds ONE Participant, and a Participant exists
       whether or not any specimen points at it. A single-valued pointer at
       something with a life of its own is a foreign key: the specimen
       belongs to the participant, not the other way round. So Participant is
       drawn on the left and the line runs from this row back to it.
       **Rule 2: a single-valued attribute belongs to its entity.**
     - Anchor: slot-row:Specimen.source_participant
<!--  
     - Only: sel=Participant~Condition~BodySite
     -
  and it is not in the schema.
  A LinkML schema says that Visit has an attribute holding a Participant; it
  does not say which of the two contains the other, and the generated
  documentation cannot show it either.

  So the Explorer decides, with a few rules and a number of exceptions, 
  <!-- where do these live in code? ideally it would be in a declarative
       config file for both the rules and exceptions - ->
  and draws the result. This
  tour shows the rules on real cases.

  There are three kinds of edges (lines) between entities on the diagram:
  3. - two-edge-types
     - Description:
       ###### Two main edge types
       So we have edges pointing forward, to the right

  - **owns** — the line runs from the owner's row to the entity it holds;
  - **belongs to** — the line runs from the member's row BACK to the entity
    it belongs to;
  - **associated with** — dashed, arrowed at both ends, and no claim either
    way.
-->

### owns-forward

- **Title:** Owns: a list of things
- **Tour:** Ownership
- **Only:** sel=Questionnaire~QuestionnaireItem
- **Action:** Drew Questionnaire and QuestionnaireItem.
- **Anchor:** slot-row:Questionnaire.items
- **Description:**
  The easy case. \`items\` holds a LIST of QuestionnaireItems (\`1..*\`), and a
  entity that holds a list of things owns them: the items are part of the
  questionnaire. The line runs from the owner's row rightward to the owned
  entity. **Rule 1: a list-valued attribute owns its entity.**


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
       **Rule 2: a single-valued attribute belongs to its entity.**
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
  and a few more: **an entity with no independent existence is owned even by
  a single-valued attribute.** Which entities those are is a decision
  recorded in the Explorer, not something the schema can tell it.


### owns-family

- **Title:** Owns: the whole family
- **Tour:** Ownership
- **Only:** sel=ObservationSet~Observation~MeasurementObservation~SdohObservation
- **Action:** Drew ObservationSet, Observation and two of its subclasses.
- **Anchor:** slot-row:ObservationSet.observations
- **Description:**
  \`observations\` holds a list of Observations, so Rule 1 says the set owns
  them. But an item in that list can just as well be a MeasurementObservation
  or an SdohObservation — an attribute whose type is a parent class accepts
  any of its subclasses — so ObservationSet owns each of those too.
  **Rule 3: whatever owns a parent owns its children.** That is why the one
  line from this row lands on the merged box's header rather than on any one
  child, and why the set's **→** count takes in the whole family.


### three-kinds

- **Title:** All three kinds at once
- **Tour:** Ownership
- **Only:** sel=SpecimenContainer~Specimen~Substance~SpecimenStorageActivity
- **Action:** Drew SpecimenContainer, Specimen, Substance and SpecimenStorageActivity.
- **Anchor:** node-box:SpecimenContainer
- **Width:** 520
- **Description:**
  Four entities, and every kind of line. Read them one at a time, and notice
  that the three attributes are declared on three different entities.
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
- **Action:** Drew Observation with the four entities that own it.
- **Anchor:** node-box:Observation
- **Highlight:** ring
- **Description:**
  Every entity that owns Observation is to its left — that is all the bar's
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
  BioData Catalyst ([BDC](https://biodatacatalyst.nhlbi.nih.gov/))
  is a cloud-based ecosystem where researchers can find and work with
  [NHLBI](https://www.nhlbi.nih.gov/) data resources.
  **BDCHM** currently harmonizes nine priority [TOPMed](https://topmed.nhlbi.nih.gov/)
  cohorts (e.g., the Framingham Heart Study and Women's Health Initiative)
  and the [INCLUDE Data Hub](https://portal.includedcc.org/), with more on their way.
- Beats:
  1. What's in the model?
     - **Description:** 
       The BDCHM schema provides a flexible, general purpose structure
       for storing clinical trials data. BDCHM Explorer categorizes the
       entities specified in the model into six areas to make it easier
       to browse and comprehend. This tour will walk you through each
       category.
     - **Anchor:** selection-tree

<!-- 
### test
- Title: test
- **Tour:** The BioData Catalyst Harmonized Model
- Change: sel=Observation
- Anchor: slot-row:Observation.age_at_observation
- Position: top
- Description:
  blah blah blah blah blah blah blah blah blah blah 
  blah blah blah blah blah blah blah blah blah blah 
  blah blah blah blah blah blah blah blah blah blah 
  blah blah blah blah blah blah blah blah blah blah 
  blah blah blah blah blah blah blah blah blah blah 
  blah blah blah blah blah blah blah blah blah blah 
  blah blah blah blah blah blah blah blah blah blah 
  blah blah blah blah blah blah blah blah blah blah 
  blah blah blah blah blah blah blah blah blah blah 
  blah blah blah blah blah blah blah blah blah blah 
  blah blah blah blah blah blah blah blah blah blah 
  blah blah blah blah blah blah blah blah blah blah 
  blah blah blah blah blah blah blah blah blah blah 
  blah blah blah blah blah blah blah blah blah blah 
  blah blah blah blah blah blah blah blah blah blah 
  blah blah blah blah blah blah blah blah blah blah 
  blah blah blah blah blah blah blah blah blah blah 

- Anchor: slot row:Observation.associated_participant
- **Anchor:** node-box:Observation
-->

### admin-study

- **Title:** Category: Admin / Study
- **Tour:** The BioData Catalyst Harmonized Model
- **Anchor:** category-row:admin
- **Description:**
  These are the entities around which study data — describing
  clinical events and observations, specimens, surveys —
  are organized.

  ###### Clicking the **⊞** button by the category title draws the whole category on the canvas.
<!-- - **Action:** Drew the whole Admin / Study category, the same as pressing its ⊞ button.-->
- Beats:
  1. Walk through
     - Description:
       We will now walk through each entity in the category. If you would like to skip
       to another category, click ⊞ below.
     - Only: cat=admin
  2. ResearchStudyCollection
     - Description:
       A **ResearchStudyCollection** contains a list of **ResearchStudies**
       and, through them, owns every other entity in the model.

       *{{model-description:ResearchStudyCollection}}*
     - Anchor: node-box:ResearchStudyCollection
  3. ResearchStudy
     - Description:
       ##### ResearchStudy
       *{{model-description:ResearchStudy}}*

       \`part_of\` points at ResearchStudy itself — the loop on this box — so a
       study can be a sub-study of another.
     - Anchor: node-box:ResearchStudy
  4. Organization
     - Description:
       ##### Organization
       *{{model-description:Organization}}*

       It declares no attribute pointing at anything here. Everything that
       names an Organization — \`Participant.originating_site\`, and the
       \`performed_by\` that Observation, ObservationSet and
       SpecimenCreationActivity declare and their subclasses inherit — is
       declared elsewhere and drawn back at it.
     - Anchor: node-box:Organization
  5. Person
     - Description:
       ##### Person
       *{{model-description:Person}}*
     - Anchor: node-box:Person
  6. Participant
     - Description:
       ##### Participant
       *{{model-description:Participant}}*
     - Anchor: node-box:Participant
  7. person vs participant
     - Description:
       ##### One person, several participants
       Person and Participant are the first genuinely modelling-flavoured
       distinction in the schema, and it is worth slowing down for. A
       **Person** is generally a human being. A **Participant** is that person's role in
       one study, and \`associated_person\` is the link. The same person enrolled
       in three studies is three Participants — usually de-identified and
       deliberately untraceable back to the actual person.
     - Anchor: node-box:Participant
  8. Consent
     - Description:
       ##### Consent
       *{{model-description:Consent}}*

       Both Participant and ResearchStudy own a list of them, so consent is
       recorded per person and per study.
     - Anchor: node-box:Consent
  9. Visit
     - Description:
       ##### Visit
       *{{model-description:Visit}}*
     - Anchor: node-box:Visit
  10. Demography
     - Description:
       ##### Demography
       *{{model-description:Demography}}*

       Sex, ethnicity and race sit here rather than on Person. Demography
       points at a Participant, and optionally at the Visit it was recorded
       at — so it is a record ABOUT a participant, not a fixed property of the
       human being.
     - Anchor: node-box:Demography
  11. what the other categories borrow
     - Description:
       ##### What the other categories borrow
       Participant and Visit are what the rest of the model hangs off.
       Clinical, Observations, Laboratory and Files all point back at a
       Participant, a Visit, or both — which is why those categories borrow
       the two into their own views. Survey is the exception:
       ten entities and almost no outward references, a self-contained subtree.
     - Anchor: none


### clinical-records

- **Title:** Category: Clinical
- **Tour:** The BioData Catalyst Harmonized Model
- **Description:**
  Eight entities record *what happened to a participant medically*. Every one of
  them is a record OF someone, usually AT an encounter — which is why Person,
  Participant and Visit are drawn here too even though they belong to Admin.
  Take them away and Clinical is a pile of disconnected records.
- **Anchor:** category-row:clinical
- Only: cat=clinical
<!-- - **Action:** Drew the whole Clinical category, the same as pressing its ⊞ button. -->
- Beats:
  1. three boxes on loan
     - Description:
       ##### Three boxes on loan
       Person, Participant and Visit are Admin entities, pinned into this view
       because the category does not mean anything without them. Read the rest
       of the diagram as hanging off Participant: everything to its right is a
       record about that participant.
     - Anchor: node-box:Participant
  2. CauseOfDeath
     - Description:
       ##### CauseOfDeath
       *{{model-description:CauseOfDeath}}*

       It belongs to Person rather than to Participant — the one clinical
       fact recorded about the human being rather than about a study role,
       and the reason Person is drawn on this canvas at all.
     - Anchor: node-box:CauseOfDeath
  3. Condition
     - Description:
       ##### Condition
       *{{model-description:Condition}}*
     - Anchor: node-box:Condition
  4. Procedure
     - Description:
       ##### Procedure
       *{{model-description:Procedure}}*
     - Anchor: node-box:Procedure
  5. Exposure
     - Description:
       ##### Exposure
       *{{model-description:Exposure}}*

       DrugExposure and DeviceExposure are its subclasses — a medication and a
       foreign object respectively — and the diagram draws them merged into
       Exposure's box rather than as three separate boxes joined by edges.
     - Anchor: node-box:Exposure
  6. ImagingStudy
     - Description:
       ##### ImagingStudy
       *{{model-description:ImagingStudy}}*
     - Anchor: node-box:ImagingStudy
  7. BodySite
     - Description:
       ##### BodySite
       *{{model-description:BodySite}}*

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
  This is where the numbers live. Twelve entities, but only four ideas: an
  **Observation** (one measured thing), an **ObservationSet** (a group of them
  taken together, like a blood panel), and the **Context** an observation was
  made in. Participant, Visit and BodySite are borrowed from elsewhere, because
  an observation is *of* someone, *at* an encounter, and often *somewhere* on a
  body.
- **Anchor:** category-row:observation
- Only: cat=observation
<!-- - **Action:** Drew the whole Observations / Measurements category, the same as pressing its ⊞ button. -->
- Beats:
  1. ObservationSet
     - Description:
       ##### ObservationSet
       *{{model-description:ObservationSet}}*

       A complete blood count is one ObservationSet holding a dozen
       Observations. \`observations\` is the attribute that owns them, which is
       the edge running rightward out of this box.
     - Anchor: node-box:ObservationSet
  2. Observation
     - Description:
       ##### Observation
       *{{model-description:Observation}}*

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
       *{{model-description:Context}}* {{model-description:Activity}}

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
  Twelve entities about *physical material* — what was collected from a
  participant, what was done to it, and what was measured on it. Specimen sits
  in the middle and almost everything here is attached to it. Participant is
  the one borrowed entity: a specimen comes FROM someone, and that is the only
  outside fact the category needs.
- **Anchor:** category-row:lab
- Only: cat=lab
<!-- - **Action:** Drew the whole Laboratory / Biospecimen category, the same as pressing its ⊞ button. -->
- Beats:
  1. Specimen
     - Description:
       ##### Specimen
       *{{model-description:Specimen}}*

       \`parent_specimen\` points back at Specimen itself — the loop on this box
       — because an aliquot or a portion is a specimen derived from another
       specimen.
     - Anchor: node-box:Specimen
  2. SpecimenContainer
     - Description:
       ##### SpecimenContainer
       *{{model-description:SpecimenContainer}}*

       It nests the same way specimens do: \`parent_container\` is a loop, so a
       well sits in a plate.
     - Anchor: node-box:SpecimenContainer
  3. Assay
     - Description:
       ##### Assay
       *{{model-description:Assay}}*
     - Anchor: node-box:Assay
  4. the four activities
     - Description:
       ##### Four activities
       A specimen owns a history, and each stage is its own entity:
       **SpecimenCreationActivity** (collected or derived),
       **SpecimenProcessingActivity** (changed without becoming something new),
       **SpecimenStorageActivity** (kept somewhere) and
       **SpecimenTransportActivity** (moved between places). Four edges leave
       Specimen for them, one per stage.
     - Anchor: node-box:SpecimenCreationActivity
  5. BiologicProduct
     - Description:
       ##### BiologicProduct
       *{{model-description:BiologicProduct}}*

       \`derived_product\` makes it something a specimen produced — a culture
       grown from a sample rather than the sample itself.
     - Anchor: node-box:BiologicProduct
  6. the specimen observations
     - Description:
       ##### Measuring the specimen
       SpecimenQualityObservation and SpecimenQuantityObservation hang off
       Specimen through \`quality_measure\` and \`quantity_measure\`. They are
       Observations — the same entity you just met — pointed at material rather
       than at a person, which is why they are listed in both categories.
     - Anchor: child-header:SpecimenQualityObservation
  7. Substance
     - Description:
       ##### Substance
       *{{model-description:Substance}}*

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
  Ten entities, and almost no connection to the rest of the model. This is the
  one category you can read entirely on its own — nothing outside it needs to
  be borrowed in, and only a couple of attributes reach out. It is two mirrored
  halves: the **questions** on the left, the **answers** on the right.
- **Anchor:** category-row:survey
- Only: cat=survey
<!-- - **Action:** Drew the whole Survey / Questionnaire category, the same as pressing its ⊞ button. -->
- Beats:
  1. Questionnaire
     - Description:
       ##### Questionnaire
       *{{model-description:Questionnaire}}*
     - Anchor: node-box:Questionnaire
  2. QuestionnaireItem
     - Description:
       ##### QuestionnaireItem
       *{{model-description:QuestionnaireItem}}*

       \`part_of\` is a loop on this box, which is how a questionnaire nests
       sections inside sections: an item can be a group holding other items.
     - Anchor: node-box:QuestionnaireItem
  3. QuestionnaireResponse
     - Description:
       ##### QuestionnaireResponse
       *{{model-description:QuestionnaireResponse}}*

       It is the mirror of Questionnaire — one filled-in form against one
       blank one.
     - Anchor: node-box:QuestionnaireResponse
  4. QuestionnaireResponseItem
     - Description:
       ##### QuestionnaireResponseItem
       *{{model-description:QuestionnaireResponseItem}}*

       And this mirrors QuestionnaireItem. \`has_questionnaire_item\` is the edge
       joining the two halves: an answer knows which question it answers.
     - Anchor: node-box:QuestionnaireResponseItem
  5. the typed values
     - Description:
       ##### One answer, five types
       QuestionnaireResponseValue is a *single-valued answer*, and it has five
       subclasses — one each for a decimal, a boolean, an integer, a TimePoint
       and a string. The diagram merges them into one box. A model can either
       carry one loosely-typed value column or an entity per type; BDCHM chose
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
  attached to a participant, and **value types** — the small structured entities
  that other entities use to hold a number or a date. Both were pulled out here
  because they belong to no one category; they are used by all of them.
- **Anchor:** category-row:other
- Only: cat=other
<!-- - **Action:** Drew the whole Files / Other category, the same as pressing its ⊞ button. -->
- Beats:
  1. Document
     - Description:
       ##### Document
       *{{model-description:Document}}*

       It stands alone on this canvas. Its \`focus\` attribute points at the
       root of the whole model, a class named Entity that the Explorer does not draw, and
       \`related_document\` reaches it from Specimen — so both of its edges land
       outside this category.
     - Anchor: node-box:Document
  2. File
     - Description:
       ##### File
       *{{model-description:File}}*

       \`derived_from\` is a loop: a converted or processed file remembers the
       one it came from.
     - Anchor: node-box:File
  3. ImagingFile
     - Description:
       ##### ImagingFile
       *{{model-description:ImagingFile}}*

       It is File's only subclass today, so the diagram merges it into File's
       box rather than drawing two. Its extra rows — modality, series, an
       anatomical site — are the DICOM metadata a plain file has no room for,
       and \`related_imaging_study\` ties it back to Clinical's ImagingStudy,
       which is off this canvas.
     - Anchor: node-box:File
  4. Quantity
     - Description:
       ##### Quantity
       *{{model-description:Quantity}}*

       This is the most reused entity in BDCHM. Observations of every kind hold
       their value in one; so do an assay's detection limits, a substance's
       amount, a procedure's quantity and a processing step's duration. It has
       no edges here because everything that points at it lives in another
       category.
     - Anchor: node-box:Quantity
  5. TimePoint and TimePeriod
     - Description:
       ##### TimePoint and TimePeriod
       *{{model-description:TimePoint}}*

       A TimePeriod is just a start and an end, both TimePoints — the two edges
       between those boxes. And \`index_time_point\` is a loop on TimePoint,
       which is what makes "six months after enrolment" expressible without
       knowing the calendar date.
     - Anchor: node-box:TimePoint

### why

- **Title:** BDCHM Explorer
- **Tour:** The BioData Catalyst Harmonized Model
- **Description:** 
  > Salvaged 2026-09-09 from the stash: this is your shortened \`why\`. The
  > LinkML half moved to \`linkml-context\`, the first step of Getting
  > oriented, and your comment there says the two still overlap. TASKS \`why-argument\`.

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
  > Decide what goes where (TASKS \`why-argument\`), then delete this note.

  BDCHM and the ingestion pipeline are built using [LinkML](https://linkml.io/).
  Neither the raw LinkML [YAML file](https://github.com/RTIInternational/NHLBI-BDC-DMC-HM/blob/main/src/bdchm/schema/bdchm.yaml)
  nor the LinkML [generated documentation](https://rtiinternational.github.io/NHLBI-BDC-DMC-HM/)
  are easy to grasp given that BDCHM's over 4,000-line schema includes around
  225 total attributes, 56 distinct entities, 50 permissible value sets,
  7 primitive data types, and 80 relationships between entities. 

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
  > taken from Tour 1. needs editing:

  Studies arrive with
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
- **Anchor:** none
- **Change:**
- **Width:** 700
- **Beats:**
  1. contents
     - Keep: true
     - Description:
       > redundant with above
       ##### Contents
       The model includes 56 entities (LinkML calls them classes; the left panel lists them) with ~340 total attributes
       falling into one of three attribute types:
       - primitive data values (e.g., strings, integers)
       - 52 permissible value sets (e.g., visit categories, units of
         measure, condition codes)
       - about 80 links to other entities indicating ownership or
         containment relationships (e.g., multiple Participant entities
         can "belong" to a single Person entity)

### bdchm-entities

- **Title:** Model entities
- **Tour:** Getting oriented
- Only: panels=0
- **Anchor:** none
- **Highlight:** selection-tree
- **Width:** 800
- **Description:** [put some intro text here]

  This tour is about the app rather than the model: how to put entities on
  the canvas, what a box shows, and how to move from one entity to the ones
  it is connected to. It grows one small diagram a step at a time, from a
  person in a study to a number you would analyse.
- **Beats:**
  1. selection
     - Description:
       The left panel lists every entity in the model, grouped into the six
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
  A box is one entity. Its header carries the entity name and, at the far
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
       ##### Rows that name other entities
       \`cause_of_death\` holds another entity rather than a value. Rows like
       this are where the lines come from: when CauseOfDeath is on the
       canvas, a line runs from this row to it. Clicking the row puts it
       there. The dot is hollow because CauseOfDeath is not drawn yet; the
       next tour, *Reading the diagram*, is about the dots and colours.
     - Anchor: slot-row:Person.cause_of_death
  3. the relation bar
     - Description:
       ##### The relation bar
       The two counts in the header are the relation bar. **← N** is how many
       entities this one belongs to, which the layout draws to its left;
       **M →** how many it owns, drawn to its right. Hover either count for
       the list. This is how you reach an entity that has no row here:
       Participant is connected to Person, but the attribute connecting them
       is declared on Participant, so it shows up in Person's bar and not in
       Person's rows.
     - Anchor: relation-bar


### grow-participant

- **Title:** Adding a related entity
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
       entity that row names, so you can always see WHICH attribute connects
       two entities.
     - Anchor: slot-row:Participant.associated_person
  2. the second way
     - Description:
       ##### Two ways to grow a diagram
       Participant's own rows name entities that are not on the canvas yet —
       a ResearchStudy, an Organization, Consents. Clicking any of those rows
       adds that entity. Rows and the relation bar are the two ways to grow a
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
  *{{model-description:Observation}}*

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

- **Title:** From a person to a number
- **Tour:** Getting oriented
- **Only:** sel=Person~Participant~Visit~Observation~Quantity
- **Action:** Added Quantity, the same as clicking the \`value_quantity\` row.
- **Anchor:** node-box:Quantity
- **Description:**
  *{{model-description:Quantity}}*

  Five boxes: Person → Participant → Visit → Observation → Quantity is the
  path from a human being to a number you would analyse, and four of the six
  categories hang off it. The \`value_quantity\` dot is filled now that its
  line is drawn.


### detail-panel

- **Title:** Details
- **Tour:** Getting oriented
- **Change:** detail=Observation
- **Action:** Opened the details panel for Observation, the same as clicking its box header.
- **Anchor:** none
- **Description:**
  Clicking a box — its header, or any row that is not itself clickable —
  opens the entity's details: its description, every attribute with its
  type, and the entities that refer to it. Entity names inside the panel are
  links, so you can follow references without changing what is drawn. The
  **ⓘ** beside a row in the relation bar opens the same panel for that
  entity. Close it with its ✕.


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
       The ⊞ on a category header draws every entity in that category, plus
       the two or three outside entities that make it legible. It replaces
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
       hold several entities at once.
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
  One entity, no lines. Every row is an attribute, and the dot at its left
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
       ##### Blue: another entity
       \`year_range\` holds a TimePeriod, another entity in the model. Blue rows
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
  two entities. The arrowhead lands on the entity the row names.
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
  arrowhead lands on the entity the row names. What differs is which side
  the named entity is drawn on, and that is decided by **ownership**: a
  Visit belongs to its Participant, so Participant is drawn first; a Visit
  owns its TimePeriod, so TimePeriod is drawn after. How the Explorer decides
  which is which is the *Ownership* tour.
- **Beats:**
  1. left to right
     - Description:
       ##### Reading left to right
       So the canvas reads left to right as "contains": everything that owns
       an entity is to its left, everything it owns is to its right. Hover a
       box and everything not connected to it fades.
     - Anchor: node-box:Participant


### loops

- **Title:** An entity that names itself
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
<summary><b>Inheritance</b></summary>

## Inheritance
- **TourMetadata:**
- **Description:** Subclasses, and the boxes that hold several entities at once

### one-child

- **Title:** An entity and its parent class, one box
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
       together. An entity should not change shape depending on what else you
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
  is the whole definition of these subclasses, and an empty header is the
  honest picture of it.


### narrowing

- **Title:** Same attribute, narrower type
- **Tour:** Inheritance
- **Only:** sel=QuestionnaireResponseValueBoolean~QuestionnaireResponseValueDecimal~QuestionnaireResponseValueInteger~QuestionnaireResponseValueString~QuestionnaireResponseValueTimePoint
- **Action:** Drew the five typed questionnaire answers.
- **Anchor:** slot-row:QuestionnaireResponseValue.value
- **Position:** right
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
       TimePoint sibling, whose \`value\` is another entity and gets a blue dot.
     - Anchor: child-header:QuestionnaireResponseValueString


### full-family

- **Title:** The whole family
- **Tour:** Inheritance
- **Only:** cat=observation
- **Action:** Drew the Observations / Measurements category, the same as pressing its ⊞ button.
- **Anchor:** node-box:Observation
- **Position:** right
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
  five typed questionnaire answers. Everywhere else, an entity stands on its
  own.

  The categories in the left panel are not inheritance: a category is a
  browsing aid, and an entity listed in two of them is one entity, not two.

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

### merged-boxes

- **Title:** Merged inheritance boxes
- **Anchor:** none
- **Description:** When several entities on the diagram share a parent class, they collapse into one box titled by that parent. Rows the parent defines come first, then a coloured header per child followed by the rows that child adds. Whatever owns the parent owns every child too, so a line into the box header is a line to the whole family.
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

</details>
`,xi={inTour:!1,held:[],tempHeld:[],tour:[],region:0,tourStates:[],scalars:{}},eg="~";function sr(e,t){return e&&t.includes(e)?e:null}function wl(e,t=!1){const n=new URLSearchParams(e),s={};if(n.get("panels")==="0"){for(const c of Qa)s[c]=!1;s.detail=null}n.has("detail")&&(s.detail=n.get("detail")||null),n.has("roots")&&(s.roots=n.get("roots")==="1"),n.has("sibs")&&(s.sibs=n.get("sibs")==="1"),n.has("legend")&&(s.legend=n.get("legend")==="1"),n.has("cases")&&(s.cases=n.get("cases")==="1");const i=sr(n.get("dir"),["RIGHT","DOWN"]);i&&(s.dir=i);const r=sr(n.get("merge"),["near","far","bend","off"]);r&&(s.merge=r);const o=n.get("sel"),a=o?o.split(eg).filter(Boolean):qa(n);return t?{sel:a,scalars:s,replace:!0}:{sel:a,scalars:s}}function Lt(e,t){return[...new Set([...e,...t])]}function tg(e){return{...xi,inTour:!0,held:[...e]}}function ng(){return xi}function sg(e){return Lt(e.held,e.tempHeld)}function xl(e,t){const n=t.replace?e.region+1:e.region,s=t.replace?[...t.sel]:Lt(e.tour,t.sel),i={...e.scalars,...t.scalars};return{...e,tour:s,region:n,scalars:i,tourStates:[...e.tourStates,{sel:s,scalars:i,region:n}]}}function vl(e){if(e.tourStates.length===0)return e;const t=e.tourStates.slice(0,-1),n=t[t.length-1];return{...e,tourStates:t,tour:n?n.sel:[],region:n?n.region:0}}function vi(e){return e.region>0}function ig(e,t){if(!e.inTour)return e;const n=vi(e)?"tempHeld":"held";return e[n].includes(t)?e:{...e,[n]:[...e[n],t]}}function og(e,t){if(!e.inTour)return e;const n=s=>s.filter(i=>i!==t);return{...e,tour:n(e.tour),tempHeld:n(e.tempHeld),held:vi(e)?e.held:n(e.held)}}function ki(e,t){if(!t.inTour)return e;const n=vi(t)?Lt(t.tour,t.tempHeld):Lt(Lt(t.tour,t.tempHeld),t.held);return{...e,...t.scalars,sel:n}}function rg(){const{modelData:e,loading:t,error:n}=Vl(),s=m.useMemo(()=>e?new Il(e):null,[e]),{setTextResolvers:i}=at(),r=m.useMemo(()=>s?Xm(s):void 0,[s]);m.useEffect(()=>i(r),[r,i]);const o=m.useMemo(()=>_e(),[]),[a,c]=m.useState(()=>new Set(o.sel)),[l,h]=m.useState(o.detail),[f,u]=m.useState(!1),g=m.useRef(!1),[y,x]=m.useState(o.roots),[p,w]=m.useState(o.sibs),[S,v]=m.useState(o.dir),[b,k]=m.useState(o.merge),[A,C]=m.useState(o.cases),[E,L]=m.useState(o.legend),[I,K]=m.useState(!1),_=m.useCallback(O=>{c(new Set(O.sel)),x(!!O.roots),h(null)},[]);m.useEffect(()=>{const O=()=>{const H=_e();c(new Set(H.sel)),h(H.detail),x(H.roots),w(H.sibs),v(H.dir),k(H.merge),L(H.legend),C(H.cases)};return window.addEventListener("popstate",O),window.addEventListener("explore:state-from-url",O),()=>{window.removeEventListener("popstate",O),window.removeEventListener("explore:state-from-url",O)}},[]),m.useEffect(()=>{const O={sel:[...a],detail:l,roots:y,sibs:p,dir:S,merge:b,legend:E,cases:A},H=g.current;g.current=!1,Ya(O,{push:H})},[a,l,y,p,S,b,E,A]);const R=m.useCallback(O=>{dt(O,!_e().sel.includes(O)),c(H=>{const D=new Set(H);return D.has(O)?D.delete(O):D.add(O),D})},[]),B=m.useCallback(O=>{dt(O,!0),c(H=>H.has(O)?H:new Set(H).add(O))},[]),Y=m.useCallback(O=>{dt(O,!1),c(H=>{if(!H.has(O))return H;const D=new Set(H);return D.delete(O),D})},[]),Z=m.useCallback(O=>{c(D=>D.size===O.length&&O.every(Q=>D.has(Q))?D:(g.current=!0,new Set(O)));const H=new Set(O);for(const D of _e().sel)H.has(D)||dt(D,!1);for(const D of O)dt(D,!0)},[]),xe=m.useCallback(()=>{for(const O of _e().sel)dt(O,!1);c(new Set),h(null),u(!1),x(!1)},[]);return n?d.jsxs("div",{className:"p-8 text-red-600",children:["Failed to load model data: ",String(n)]}):t||!s?d.jsx("div",{className:"p-8 text-gray-400",children:"Loading model…"}):d.jsxs("div",{className:"relative flex flex-col h-screen bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100",children:[d.jsxs("header",{className:"flex items-center justify-between px-4 py-2 bg-blue-600 text-white shrink-0",children:[d.jsxs("div",{children:[d.jsx("h1",{"data-help-id":"app-title",className:"text-lg font-bold leading-tight cursor-pointer hover:opacity-80 transition-opacity",onClick:xe,title:"Click to clear the selection and reset the view",children:"BDCHM Explorer"}),d.jsx("p",{className:"text-xs text-blue-100",children:"BioData Catalyst Harmonized Model"})]}),d.jsxs("div",{className:"flex items-center gap-4",children:[d.jsx(fg,{}),d.jsx(Cm,{}),d.jsx(fm,{onOpenLegend:()=>L(O=>!O),onOpenCases:()=>C(O=>!O),legendOpen:E,casesOpen:A,anyPanelOpen:E||A||l!==null,onClosePanels:()=>{L(!1),C(!1),h(null)}}),d.jsx("button",{onClick:async()=>{const O=Np({sel:[...a],detail:l,roots:y,sibs:p,dir:S,merge:b,legend:E,cases:A});try{await navigator.clipboard.writeText(O),K(!0),window.setTimeout(()=>K(!1),1500)}catch{K(!1),window.prompt("Copy this link:",O)}},"data-help-id":"copy-link",className:"text-sm underline text-blue-100 hover:text-white",title:"Copy a link that reproduces exactly this view, settings included",children:I?"✓ copied":"copy link"}),d.jsx("a",{href:"/dynamic-model-var-docs/previous.html",className:"text-sm underline text-blue-100 hover:text-white",children:"previous views"}),d.jsx("a",{href:"https://github.com/Sigfried/dynamic-model-var-docs",target:"_blank",rel:"noopener noreferrer",className:"text-blue-100 hover:text-white",title:"Source code on GitHub","aria-label":"Source code on GitHub",children:d.jsx("svg",{viewBox:"0 0 16 16",width:"18",height:"18",fill:"currentColor","aria-hidden":!0,children:d.jsx("path",{d:"M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"})})})]})]}),E&&d.jsx(lm,{onClose:()=>L(!1),onSelect:O=>_({name:"ad hoc",note:"",sel:O}),dataService:s}),A&&d.jsx(im,{onClose:()=>C(!1),onApply:_,selectedIds:a,dataService:s,offset:E}),d.jsxs("div",{className:"flex-1 flex min-h-0",children:[f?d.jsxs("button",{onClick:()=>u(!1),title:"Show entity selection",className:`shrink-0 w-8 border-r border-gray-200 dark:border-slate-700
                       bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700
                       flex flex-col items-center gap-2 py-2 text-gray-400`,children:[d.jsx("span",{className:"text-xs",children:"▶"}),d.jsxs("span",{className:"text-[10px] uppercase tracking-wider [writing-mode:vertical-rl]",children:[s.getConceptLabel("entity",!0),a.size>0?` (${a.size})`:""]})]}):d.jsxs("div",{className:"w-80 shrink-0 flex flex-col min-h-0 border-r border-gray-200 dark:border-slate-700",children:[d.jsx("div",{className:"flex-1 overflow-y-auto min-h-0","data-help-id":"selection-tree",children:d.jsx(Kl,{dataService:s,selectedIds:a,onToggle:R,onShowCategory:Z})}),d.jsx("button",{onClick:()=>u(!0),title:"Hide entity selection",className:`shrink-0 px-3 py-1 text-xs text-gray-400 border-t border-gray-200
                         dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 text-left`,children:"◀ Hide"})]}),d.jsx("div",{className:"flex-1 min-w-0","data-help-id":"graph-canvas",children:a.size===0?d.jsx("div",{className:"h-full flex items-center justify-center text-sm text-gray-400 p-8",children:"Select entities on the left to build the ownership subgraph."}):d.jsx(Zp,{dataService:s,selectedIds:a,onNodeClick:h,onAdd:B,onRemove:Y,pathToRoot:y,onTogglePathToRoot:()=>x(O=>!O),direction:S,setDirection:v,mergeMode:b,setMergeMode:k,mergeSibs:p,setMergeSibs:w})}),l&&d.jsx(Jp,{classId:l,dataService:s,onClose:()=>h(null),onNavigate:h,isSelected:a.has(l),onToggleSelect:R})]})]})}let fe=xi;function dt(e,t){fe=t?ig(fe,e):og(fe,e)}function Nn(e){Ya(e),window.dispatchEvent(new Event("explore:state-from-url"))}function ag(){fe=tg(_e().sel)}function lg(){if(!fe.inTour)return;const e=sg(fe),t=_e();fe=ng(),Nn({...t,sel:e})}function cg(e,t=!1){fe=xl(fe,wl(e,t)),Nn(ki(_e(),fe))}function hg(){fe=vl(fe),Nn(ki(_e(),fe))}function dg(e,t){for(let n=0;n<t;n++)fe=vl(fe);for(const n of e)fe=xl(fe,wl(n.query,n.replace));Nn(ki(_e(),fe))}function ug(){return d.jsxs(Mm,{markdown:Jm,widgets:Zm,onPushChange:cg,onPopChange:hg,onJumpChanges:dg,onTourStart:ag,onTourEnd:lg,children:[d.jsx(rg,{}),d.jsx(Fm,{})]})}function fg(){const{helpMode:e,toggleHelpMode:t,startTour:n}=at();return m.useEffect(()=>{Rp()&&n()},[]),d.jsx("span",{className:"flex items-center gap-2","data-help-id":"help-button",children:cm})}Bl.createRoot(document.getElementById("root")).render(d.jsx(m.StrictMode,{children:d.jsx(ug,{})}));
