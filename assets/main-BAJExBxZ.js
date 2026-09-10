import{i as os,p as kl,r as p,j as h,g as Tl,E as xe,a as tr,b as nr,S as Sl,c as Cl,d as Al,s as Pl,w as El,R as xt,e as Ml,f as Dl,m as Ol,h as Rl,k as jl,M as Wt,u as Ll,D as Nl,l as Vl}from"./index-DrnSqbqh.js";function sr(e){return[...new Set([...e.classIds,...e.pins])]}const Il=e=>`entity-row:${e}`,Bl=e=>`entity-checkbox:${e}`,$l=e=>`category-row:${e}`,Fl=e=>`node-box:${e}`,_l=e=>`child-header:${e}`,Hl=(e,t)=>`slot-row:${e}.${t}`,ir=e=>os(e.id)?kl(e.id):e.id,Wl=e=>Fl(ir(e)),zl=(e,t)=>Hl(t.declaringClass??ir(e),t.slot);function Ul({dataService:e,selectedIds:t,onToggle:n,onShowCategory:s}){const i=p.useMemo(()=>e.getCategoryTrees(),[e]),[r,o]=p.useState(new Set),a=l=>o(d=>{const f=new Set(d);return f.has(l)?f.delete(l):f.add(l),f}),c=i.reduce((l,d)=>l+d.classIds.length,0);return h.jsxs("div",{className:"text-sm",children:[h.jsx("div",{className:"flex items-baseline gap-2 px-3 py-2 border-b border-gray-200 dark:border-slate-700",children:h.jsxs("span",{className:"font-semibold flex-1",children:[e.getConceptLabel("entity",!0)," (",c,")"]})}),i.map(l=>{const d=r.has(l.id),f=l.classIds.filter(u=>t.has(u)).length;return h.jsxs("div",{children:[h.jsxs("div",{"data-help-id":$l(l.id),className:`w-full flex items-stretch font-medium
                         bg-gray-50 dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700`,children:[h.jsxs("button",{type:"button",onClick:()=>a(l.id),className:`flex-1 min-w-0 flex items-center gap-2 px-3 py-1.5 text-left
                           hover:bg-gray-100 dark:hover:bg-slate-700`,children:[h.jsx("span",{className:"text-xs text-gray-400",children:d?"▶":"▼"}),h.jsx("span",{className:"flex-1 truncate",children:l.label}),f>0&&h.jsxs("span",{className:"text-xs text-gray-400",children:[f," / ",l.classIds.length]})]}),s&&h.jsx("button",{type:"button","data-show-category":l.id,title:`Draw the ${l.label} content view — replaces the canvas`,onClick:()=>s(sr(l)),className:`px-2.5 shrink-0 text-gray-400 border-l border-gray-100
                             dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700
                             hover:text-blue-600 dark:hover:text-sky-400`,children:"⊞"})]}),!d&&l.roots.map(u=>h.jsx(or,{node:u,depth:0,selectedIds:t,onToggle:n},u.classId))]},l.id)})]})}function or({node:e,depth:t,selectedIds:n,onToggle:s}){const{classId:i}=e;return h.jsxs(h.Fragment,{children:[h.jsxs("label",{"data-class-row":i,"data-help-id":Il(i),className:`flex items-center gap-2 pr-3 py-1 cursor-pointer
                    hover:bg-blue-50 dark:hover:bg-slate-800
                    ${n.has(i)?"bg-blue-50 dark:bg-slate-800":""}`,style:{paddingLeft:`${.75+t*1}rem`},children:[h.jsx("input",{type:"checkbox","data-help-id":Bl(i),checked:n.has(i),onChange:()=>s(i)}),h.jsxs("span",{className:"flex-1 min-w-0 truncate",children:[h.jsx("span",{className:"font-mono text-xs",children:i}),e.outOfCategoryParent&&h.jsxs("span",{className:"ml-1 text-[10px] text-gray-400 dark:text-slate-500",title:`Extends ${e.outOfCategoryParent}, which is in another category`,children:["↳ ",e.outOfCategoryParent]})]})]}),e.children.map(r=>h.jsx(or,{node:r,depth:t+1,selectedIds:n,onToggle:s},r.classId))]})}const Is=p.createContext({});function Bs(e){const t=p.useRef(null);return t.current===null&&(t.current=e()),t.current}const Gl=typeof window<"u",un=Gl?p.useLayoutEffect:p.useEffect,kn=p.createContext(null);function $s(e,t){e.indexOf(t)===-1&&e.push(t)}function fn(e,t){const n=e.indexOf(t);n>-1&&e.splice(n,1)}const $e=(e,t,n)=>n>t?t:n<e?e:n;let Tn=()=>{};const Ue={},rr=e=>/^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(e),ar=e=>typeof e=="object"&&e!==null,lr=e=>/^0[^.\s]+$/u.test(e);function cr(e){let t;return()=>(t===void 0&&(t=e()),t)}const Pe=e=>e,Nt=(...e)=>e.reduce((t,n)=>s=>n(t(s))),Ot=(e,t,n)=>{const s=t-e;return s?(n-e)/s:1};class Fs{constructor(){this.subscriptions=[]}add(t){return $s(this.subscriptions,t),()=>fn(this.subscriptions,t)}notify(t,n,s){const i=this.subscriptions.length;if(i)if(i===1)this.subscriptions[0](t,n,s);else for(let r=0;r<i;r++){const o=this.subscriptions[r];o&&o(t,n,s)}}getSize(){return this.subscriptions.length}clear(){this.subscriptions.length=0}}const Ee=e=>e*1e3,Ae=e=>e/1e3,dr=(e,t)=>t?e*(1e3/t):0,hr=(e,t,n)=>(((1-3*n+3*t)*e+(3*n-6*t))*e+3*t)*e,Kl=1e-7,Ql=12;function ql(e,t,n,s,i){let r,o,a=0;do o=t+(n-t)/2,r=hr(o,s,i)-e,r>0?n=o:t=o;while(Math.abs(r)>Kl&&++a<Ql);return o}function Vt(e,t,n,s){if(e===t&&n===s)return Pe;const i=r=>ql(r,0,1,e,n);return r=>r===0||r===1?r:hr(i(r),t,s)}const ur=e=>t=>t<=.5?e(2*t)/2:(2-e(2*(1-t)))/2,fr=e=>t=>1-e(1-t),pr=Vt(.33,1.53,.69,.99),_s=fr(pr),mr=ur(_s),gr=e=>e>=1?1:(e*=2)<1?.5*_s(e):.5*(2-Math.pow(2,-10*(e-1))),Hs=e=>1-Math.sin(Math.acos(e)),yr=fr(Hs),wr=ur(Hs),Xl=Vt(.42,0,1,1),Yl=Vt(0,0,.58,1),br=Vt(.42,0,.58,1),Zl=e=>Array.isArray(e)&&typeof e[0]!="number",xr=e=>Array.isArray(e)&&typeof e[0]=="number",Jl={linear:Pe,easeIn:Xl,easeInOut:br,easeOut:Yl,circIn:Hs,circInOut:wr,circOut:yr,backIn:_s,backInOut:mr,backOut:pr,anticipate:gr},ec=e=>typeof e=="string",ki=e=>{if(xr(e)){Tn(e.length===4);const[t,n,s,i]=e;return Vt(t,n,s,i)}else if(ec(e))return Jl[e];return e},zt=["setup","read","resolveKeyframes","preUpdate","update","preRender","render","postRender"];function tc(e){let t=new Set,n=new Set,s=!1,i=!1;const r=new WeakSet;let o={delta:0,timestamp:0,isProcessing:!1};function a(l){r.has(l)&&(c.schedule(l),e()),l(o)}const c={schedule:(l,d=!1,f=!1)=>{const m=f&&s?t:n;return d&&r.add(l),m.add(l),l},cancel:l=>{n.delete(l),r.delete(l)},process:l=>{if(o=l,s){i=!0;return}s=!0;const d=t;t=n,n=d,t.forEach(a),t.clear(),s=!1,i&&(i=!1,c.process(l))}};return c}const nc=40;function vr(e,t){let n=!1,s=!0;const i={delta:0,timestamp:0,isProcessing:!1},r=()=>n=!0,o=zt.reduce((v,w)=>(v[w]=tc(r),v),{}),{setup:a,read:c,resolveKeyframes:l,preUpdate:d,update:f,preRender:u,render:m,postRender:g}=o,b=()=>{const v=Ue.useManualTiming,w=v?i.timestamp:performance.now();n=!1,v||(i.delta=s?1e3/60:Math.max(Math.min(w-i.timestamp,nc),1)),i.timestamp=w,i.isProcessing=!0,a.process(i),c.process(i),l.process(i),d.process(i),f.process(i),u.process(i),m.process(i),g.process(i),i.isProcessing=!1,n&&t&&(s=!1,e(b))},y=()=>{n=!0,s=!0,i.isProcessing||e(b)};return{schedule:zt.reduce((v,w)=>{const k=o[w];return v[w]=(A,C=!1,E=!1)=>(n||y(),k.schedule(A,C,E)),v},{}),cancel:v=>{for(let w=0;w<zt.length;w++)o[zt[w]].cancel(v)},state:i,steps:o}}const{schedule:ee,cancel:Ge,state:ue,steps:jn}=vr(typeof requestAnimationFrame<"u"?requestAnimationFrame:Pe,!0);let nn;function sc(){nn=void 0}const we={now:()=>(nn===void 0&&we.set(ue.isProcessing||Ue.useManualTiming?ue.timestamp:performance.now()),nn),set:e=>{nn=e,queueMicrotask(sc)}},kr=e=>t=>typeof t=="string"&&t.startsWith(e),Tr=kr("--"),ic=kr("var(--"),Ws=e=>ic(e)?oc.test(e.split("/*")[0].trim()):!1,oc=/var\(--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)$/iu;function Ti(e){return typeof e!="string"?!1:e.split("/*")[0].includes("var(--")}const mt={test:e=>typeof e=="number",parse:parseFloat,transform:e=>e},Rt={...mt,transform:e=>$e(0,1,e)},Ut={...mt,default:1},St=e=>Math.round(e*1e5)/1e5,zs=/-?(?:\d+(?:\.\d+)?|\.\d+)/gu;function rc(e){return e==null}const ac=/^(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))$/iu,Us=(e,t)=>n=>!!(typeof n=="string"&&ac.test(n)&&n.startsWith(e)||t&&!rc(n)&&Object.prototype.hasOwnProperty.call(n,t)),Sr=(e,t,n)=>s=>{if(typeof s!="string")return s;const[i,r,o,a]=s.match(zs);return{[e]:parseFloat(i),[t]:parseFloat(r),[n]:parseFloat(o),alpha:a!==void 0?parseFloat(a):1}},lc=e=>$e(0,255,e),Ln={...mt,transform:e=>Math.round(lc(e))},Ye={test:Us("rgb","red"),parse:Sr("red","green","blue"),transform:({red:e,green:t,blue:n,alpha:s=1})=>"rgba("+Ln.transform(e)+", "+Ln.transform(t)+", "+Ln.transform(n)+", "+St(Rt.transform(s))+")"};function cc(e){let t="",n="",s="",i="";return e.length>5?(t=e.substring(1,3),n=e.substring(3,5),s=e.substring(5,7),i=e.substring(7,9)):(t=e.substring(1,2),n=e.substring(2,3),s=e.substring(3,4),i=e.substring(4,5),t+=t,n+=n,s+=s,i+=i),{red:parseInt(t,16),green:parseInt(n,16),blue:parseInt(s,16),alpha:i?parseInt(i,16)/255:1}}const rs={test:Us("#"),parse:cc,transform:Ye.transform},It=e=>({test:t=>typeof t=="string"&&t.endsWith(e)&&t.split(" ").length===1,parse:parseFloat,transform:t=>`${t}${e}`}),Fe=It("deg"),Be=It("%"),N=It("px"),dc=It("vh"),hc=It("vw"),Si={...Be,parse:e=>Be.parse(e)/100,transform:e=>Be.transform(e*100)},dt={test:Us("hsl","hue"),parse:Sr("hue","saturation","lightness"),transform:({hue:e,saturation:t,lightness:n,alpha:s=1})=>"hsla("+Math.round(e)+", "+Be.transform(St(t))+", "+Be.transform(St(n))+", "+St(Rt.transform(s))+")"},re={test:e=>Ye.test(e)||rs.test(e)||dt.test(e),parse:e=>Ye.test(e)?Ye.parse(e):dt.test(e)?dt.parse(e):rs.parse(e),transform:e=>typeof e=="string"?e:e.hasOwnProperty("red")?Ye.transform(e):dt.transform(e),getAnimatableNone:e=>{const t=re.parse(e);return t.alpha=0,re.transform(t)}},uc=/(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))/giu;function fc(e){return isNaN(e)&&typeof e=="string"&&(e.match(zs)?.length||0)+(e.match(uc)?.length||0)>0}const Cr="number",Ar="color",pc="var",mc="var(",Ci="${}",gc=/var\s*\(\s*--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)|#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\)|-?(?:\d+(?:\.\d+)?|\.\d+)/giu;function ft(e){const t=e.toString(),n=[],s={color:[],number:[],var:[]},i=[];let r=0;const a=t.replace(gc,c=>(re.test(c)?(s.color.push(r),i.push(Ar),n.push(re.parse(c))):c.startsWith(mc)?(s.var.push(r),i.push(pc),n.push(c)):(s.number.push(r),i.push(Cr),n.push(parseFloat(c))),++r,Ci)).split(Ci);return{values:n,split:a,indexes:s,types:i}}function yc(e){return ft(e).values}function Pr({split:e,types:t}){const n=e.length;return s=>{let i="";for(let r=0;r<n;r++)if(i+=e[r],s[r]!==void 0){const o=t[r];o===Cr?i+=St(s[r]):o===Ar?i+=re.transform(s[r]):i+=s[r]}return i}}function wc(e){return Pr(ft(e))}const bc=e=>typeof e=="number"?0:re.test(e)?re.getAnimatableNone(e):e,xc=(e,t)=>typeof e=="number"?t?.trim().endsWith("/")?e:0:bc(e);function vc(e){const t=ft(e);return Pr(t)(t.values.map((s,i)=>xc(s,t.split[i])))}const je={test:fc,parse:yc,createTransformer:wc,getAnimatableNone:vc};function Nn(e,t,n){return n<0&&(n+=1),n>1&&(n-=1),n<1/6?e+(t-e)*6*n:n<1/2?t:n<2/3?e+(t-e)*(2/3-n)*6:e}function kc({hue:e,saturation:t,lightness:n,alpha:s}){e/=360,t/=100,n/=100;let i=0,r=0,o=0;if(!t)i=r=o=n;else{const a=n<.5?n*(1+t):n+t-n*t,c=2*n-a;i=Nn(c,a,e+1/3),r=Nn(c,a,e),o=Nn(c,a,e-1/3)}return{red:Math.round(i*255),green:Math.round(r*255),blue:Math.round(o*255),alpha:s}}function pn(e,t){return n=>n>0?t:e}const J=(e,t,n)=>e+(t-e)*n,Vn=(e,t,n)=>{const s=e*e,i=n*(t*t-s)+s;return i<0?0:Math.sqrt(i)},Tc=[rs,Ye,dt],Sc=e=>Tc.find(t=>t.test(e));function Ai(e){const t=Sc(e);if(!t)return!1;let n=t.parse(e);return t===dt&&(n=kc(n)),n}const Pi=(e,t)=>{const n=Ai(e),s=Ai(t);if(!n||!s)return pn(e,t);const i={...n};return r=>(i.red=Vn(n.red,s.red,r),i.green=Vn(n.green,s.green,r),i.blue=Vn(n.blue,s.blue,r),i.alpha=J(n.alpha,s.alpha,r),Ye.transform(i))},as=new Set(["none","hidden"]);function Cc(e,t){return as.has(e)?n=>n<=0?e:t:n=>n>=1?t:e}function Ac(e,t){return n=>J(e,t,n)}function Gs(e){return typeof e=="number"?Ac:typeof e=="string"?Ws(e)?pn:re.test(e)?Pi:Mc:Array.isArray(e)?Er:typeof e=="object"?re.test(e)?Pi:Pc:pn}function Er(e,t){const n=[...e],s=n.length,i=e.map((r,o)=>Gs(r)(r,t[o]));return r=>{for(let o=0;o<s;o++)n[o]=i[o](r);return n}}function Pc(e,t){const n={...e,...t},s={};for(const i in n)e[i]!==void 0&&t[i]!==void 0&&(s[i]=Gs(e[i])(e[i],t[i]));return i=>{for(const r in s)n[r]=s[r](i);return n}}function Ec(e,t){const n=[],s={color:0,var:0,number:0};for(let i=0;i<t.values.length;i++){const r=t.types[i],o=e.indexes[r][s[r]],a=e.values[o]??0;n[i]=a,s[r]++}return n}const Mc=(e,t)=>{const n=je.createTransformer(t),s=ft(e),i=ft(t);return s.indexes.var.length===i.indexes.var.length&&s.indexes.color.length===i.indexes.color.length&&s.indexes.number.length>=i.indexes.number.length?as.has(e)&&!i.values.length||as.has(t)&&!s.values.length?Cc(e,t):Nt(Er(Ec(s,i),i.values),n):pn(e,t)};function Mr(e,t,n){return typeof e=="number"&&typeof t=="number"&&typeof n=="number"?J(e,t,n):Gs(e)(e,t)}const Dc=e=>{const t=({timestamp:n})=>e(n);return{start:(n=!0)=>ee.update(t,n),stop:()=>Ge(t),now:()=>ue.isProcessing?ue.timestamp:we.now()}},Dr=(e,t,n=10)=>{let s="";const i=Math.max(Math.round(t/n),2);for(let r=0;r<i;r++)s+=Math.round(e(r/(i-1))*1e4)/1e4+", ";return`linear(${s.substring(0,s.length-2)})`},Ks=2e4;function Qs(e,t=50,n=Ks,s){let i=0,r=e.next(i);for(;!r.done&&i<n;)i+=t,r=e.next(i);return i>=n?1/0:i}function Oc(e,t=100,n){const s=n({...e,keyframes:[0,t]}),i=Math.min(Qs(s),Ks);return{type:"keyframes",ease:r=>s.next(i*r).value/t,duration:Ae(i)}}const ie={stiffness:100,damping:10,mass:1,velocity:0,duration:800,bounce:.3,visualDuration:.3,restSpeed:{granular:.01,default:2},restDelta:{granular:.005,default:.5},minDuration:.01,maxDuration:10,minDamping:.05,maxDamping:1};function ls(e,t){return e*Math.sqrt(1-t*t)}const Rc=12;function jc(e,t,n){let s=n;for(let i=1;i<Rc;i++)s=s-e(s)/t(s);return s}const In=.001;function Lc({duration:e=ie.duration,bounce:t=ie.bounce,velocity:n=ie.velocity,mass:s=ie.mass}){let i,r,o=1-t;o=$e(ie.minDamping,ie.maxDamping,o),e=$e(ie.minDuration,ie.maxDuration,Ae(e)),o<1?(i=l=>{const d=l*o,f=d*e,u=d-n,m=ls(l,o),g=Math.exp(-f);return In-u/m*g},r=l=>{const f=l*o*e,u=f*n+n,m=o*o*l*l*e,g=Math.exp(-f),b=ls(l*l,o);return(-i(l)+In>0?-1:1)*((u-m)*g)/b}):(i=l=>{const d=Math.exp(-l*e),f=(l-n)*e+1;return-In+d*f},r=l=>{const d=Math.exp(-l*e),f=(n-l)*(e*e);return d*f});const a=5/e,c=jc(i,r,a);if(e=Ee(e),isNaN(c))return{stiffness:ie.stiffness,damping:ie.damping,duration:e};{const l=c*c*s;return{stiffness:l,damping:o*2*Math.sqrt(s*l),duration:e}}}const Nc=["duration","bounce"],Vc=["stiffness","damping","mass"];function Ei(e,t){return t.some(n=>e[n]!==void 0)}function Ic(e){let t={velocity:ie.velocity,stiffness:ie.stiffness,damping:ie.damping,mass:ie.mass,isResolvedFromDuration:!1,...e};if(!Ei(e,Vc)&&Ei(e,Nc))if(t.velocity=0,e.visualDuration){const n=e.visualDuration,s=2*Math.PI/(n*1.2),i=s*s,r=2*$e(.05,1,1-(e.bounce||0))*Math.sqrt(i);t={...t,mass:ie.mass,stiffness:i,damping:r}}else{const n=Lc({...e,velocity:0});t={...t,...n,mass:ie.mass},t.isResolvedFromDuration=!0}return t}function mn(e=ie.visualDuration,t=ie.bounce){const n=typeof e!="object"?{visualDuration:e,keyframes:[0,1],bounce:t}:e;let{restSpeed:s,restDelta:i}=n;const r=n.keyframes[0],o=n.keyframes[n.keyframes.length-1],a={done:!1,value:r},{stiffness:c,damping:l,mass:d,duration:f,velocity:u,isResolvedFromDuration:m}=Ic({...n,velocity:-Ae(n.velocity||0)}),g=u||0,b=l/(2*Math.sqrt(c*d)),y=o-r,x=Ae(Math.sqrt(c/d)),S=b*x,v=Math.abs(y)<5;s||(s=v?ie.restSpeed.granular:ie.restSpeed.default),i||(i=v?ie.restDelta.granular:ie.restDelta.default);let w,k;if(b<1){const C=ls(x,b),E=(g+S*y)/C,L=S*E+y*C,K=S*y-E*C;let W=-1,I=0,O=0;const B=Y=>{if(Y!==W){W=Y;const te=Math.exp(-S*Y),ge=Math.sin(C*Y),R=Math.cos(C*Y);I=o-te*(E*ge+y*R),O=te*(L*ge+K*R)}};w=Y=>(B(Y),I),k=Y=>(B(Y),O)}else if(b===1){w=E=>o-Math.exp(-x*E)*(y+(g+x*y)*E);const C=g+x*y;k=E=>Math.exp(-x*E)*(x*C*E-g)}else{const C=x*Math.sqrt(b*b-1);w=W=>{const I=Math.exp(-S*W),O=Math.min(C*W,300);return o-I*((g+S*y)*Math.sinh(O)+C*y*Math.cosh(O))/C};const E=(g+S*y)/C,L=S*E-y*C,K=S*y-E*C;k=W=>{const I=Math.exp(-S*W),O=Math.min(C*W,300);return I*(L*Math.sinh(O)+K*Math.cosh(O))}}const A={calculatedDuration:m&&f||null,velocity:C=>Ee(k(C)),next:C=>{const E=w(C);if(m)a.done=C>=f;else{const L=Ee(k(C));a.done=Math.abs(L)<=s&&Math.abs(o-E)<=i}return a.value=a.done?o:E,a},toString:()=>{const C=Math.min(Qs(A),Ks),E=Dr(L=>A.next(C*L).value,C,30);return C+"ms "+E},toTransition:()=>{}};return A}mn.applyToOptions=e=>{const t=Oc(e,100,mn);return e.ease=t.ease,e.duration=Ee(t.duration),e.type="keyframes",e};function cs({keyframes:e,velocity:t=0,power:n=.8,timeConstant:s=325,bounceDamping:i=10,bounceStiffness:r=500,modifyTarget:o,min:a,max:c,restDelta:l=.5,restSpeed:d}){const f=e[0],u={done:!1,value:f},m=C=>C<a||C>c,g=C=>a===void 0?c:c===void 0||Math.abs(a-C)<Math.abs(c-C)?a:c;let b=n*t;const y=f+b,x=o===void 0?y:o(y);x!==y&&(b=x-f);const S=C=>-b*Math.exp(-C/s),v=C=>{const E=S(C);u.done=Math.abs(E)<=l,u.value=u.done?x:x+E};let w,k;const A=C=>{m(u.value)&&(w=C,k=mn({keyframes:[u.value,g(u.value)],velocity:-S(C)/s*1e3,damping:i,stiffness:r,restDelta:l,restSpeed:d}))};return A(0),{calculatedDuration:null,next:C=>{let E=!1;return!k&&w===void 0&&(E=!0,v(C),A(C)),w!==void 0&&C>=w?k.next(C-w):(!E&&v(C),u)}}}function Bc(e,t,n){const s=[],i=n||Ue.mix||Mr,r=e.length-1;for(let o=0;o<r;o++){let a=i(e[o],e[o+1]);if(t){const c=Array.isArray(t)?t[o]||Pe:t;a=Nt(c,a)}s.push(a)}return s}function $c(e,t,{clamp:n=!0,ease:s,mixer:i}={}){const r=e.length;if(Tn(r===t.length),r===1)return()=>t[0];if(r===2&&t[0]===t[1])return()=>t[1];const o=e[0]===e[1];e[0]>e[r-1]&&(e=[...e].reverse(),t=[...t].reverse());const a=Bc(t,s,i),c=a.length,l=d=>{if(o&&d<e[0])return t[0];let f=0;if(c>1)for(;f<e.length-2&&!(d<e[f+1]);f++);const u=Ot(e[f],e[f+1],d);return a[f](u)};return n?d=>l($e(e[0],e[r-1],d)):l}function Fc(e,t){const n=e[e.length-1];for(let s=1;s<=t;s++){const i=Ot(0,t,s);e.push(J(n,1,i))}}function _c(e){const t=[0];return Fc(t,e.length-1),t}function Hc(e,t){return e.map(n=>n*t)}function Wc(e,t){return e.map(()=>t||br).splice(0,e.length-1)}function Ct({duration:e=300,keyframes:t,times:n,ease:s="easeInOut"}){const i=Zl(s)?s.map(ki):ki(s),r={done:!1,value:t[0]},o=Hc(n&&n.length===t.length?n:_c(t),e),a=$c(o,t,{ease:Array.isArray(i)?i:Wc(t,i)});return{calculatedDuration:e,next:c=>(r.value=a(c),r.done=c>=e,r)}}const zc=5;function Uc(e,t,n){const s=Math.max(t-zc,0);return dr(n-e(s),t-s)}const Gc=e=>e!==null;function Sn(e,{repeat:t,repeatType:n="loop"},s,i=1){const r=e.filter(Gc),a=i<0||t&&n!=="loop"&&t%2===1?0:r.length-1;return!a||s===void 0?r[a]:s}const Kc={decay:cs,inertia:cs,tween:Ct,keyframes:Ct,spring:mn};function Or(e){typeof e.type=="string"&&(e.type=Kc[e.type])}class qs{constructor(){this.updateFinished()}get finished(){return this._finished}updateFinished(){this._finished=new Promise(t=>{this.resolve=t})}notifyFinished(){this.resolve()}then(t,n){return this.finished.then(t,n)}}const Qc=e=>e/100;class gn extends qs{constructor(t){super(),this.state="idle",this.startTime=null,this.isStopped=!1,this.currentTime=0,this.holdTime=null,this.playbackSpeed=1,this.delayState={done:!1,value:void 0},this.stop=()=>{const{motionValue:n}=this.options;n&&n.updatedAt!==we.now()&&this.tick(we.now()),this.isStopped=!0,this.state!=="idle"&&(this.teardown(),this.options.onStop?.())},this.options=t,this.initAnimation(),this.play(),t.autoplay===!1&&this.pause()}initAnimation(){const{options:t}=this;Or(t);const{type:n=Ct,repeat:s=0,repeatDelay:i=0,repeatType:r,velocity:o=0}=t;let{keyframes:a}=t;const c=n||Ct;c!==Ct&&typeof a[0]!="number"&&(this.mixKeyframes=Nt(Qc,Mr(a[0],a[1])),a=[0,100]);const l=c({...t,keyframes:a});r==="mirror"&&(this.mirroredGenerator=c({...t,keyframes:[...a].reverse(),velocity:-o})),l.calculatedDuration===null&&(l.calculatedDuration=Qs(l));const{calculatedDuration:d}=l;this.calculatedDuration=d,this.resolvedDuration=d+i,this.totalDuration=this.resolvedDuration*(s+1)-i,this.generator=l}updateTime(t){const n=Math.round(t-this.startTime)*this.playbackSpeed;this.holdTime!==null?this.currentTime=this.holdTime:this.currentTime=n}tick(t,n=!1){const{generator:s,totalDuration:i,mixKeyframes:r,mirroredGenerator:o,resolvedDuration:a,calculatedDuration:c}=this;if(this.startTime===null)return s.next(0);const{delay:l=0,keyframes:d,repeat:f,repeatType:u,repeatDelay:m,type:g,onUpdate:b,finalKeyframe:y}=this.options;this.speed>0?this.startTime=Math.min(this.startTime,t):this.speed<0&&(this.startTime=Math.min(t-i/this.speed,this.startTime)),n?this.currentTime=t:this.updateTime(t);const x=this.currentTime-l*(this.playbackSpeed>=0?1:-1),S=this.playbackSpeed>=0?x<0:x>i;this.currentTime=Math.max(x,0),this.state==="finished"&&this.holdTime===null&&(this.currentTime=i);let v=this.currentTime,w=s;if(f){const E=Math.min(this.currentTime,i)/a;let L=Math.floor(E),K=E%1;!K&&E>=1&&(K=1),K===1&&L--,L=Math.min(L,f+1),L%2&&(u==="reverse"?(K=1-K,m&&(K-=m/a)):u==="mirror"&&(w=o)),v=$e(0,1,K)*a}let k;S?(this.delayState.value=d[0],k=this.delayState):k=w.next(v),r&&!S&&(k.value=r(k.value));let{done:A}=k;!S&&c!==null&&(A=this.playbackSpeed>=0?this.currentTime>=i:this.currentTime<=0);const C=this.holdTime===null&&(this.state==="finished"||this.state==="running"&&A);return C&&g!==cs&&(k.value=Sn(d,this.options,y,this.speed)),b&&b(k.value),C&&this.finish(),k}then(t,n){return this.finished.then(t,n)}get duration(){return Ae(this.calculatedDuration)}get iterationDuration(){const{delay:t=0}=this.options||{};return this.duration+Ae(t)}get time(){return Ae(this.currentTime)}set time(t){t=Ee(t),this.currentTime=t,this.startTime===null||this.holdTime!==null||this.playbackSpeed===0?this.holdTime=t:this.driver&&(this.startTime=this.driver.now()-t/this.playbackSpeed),this.driver?this.driver.start(!1):(this.startTime=0,this.state="paused",this.holdTime=t,this.tick(t))}getGeneratorVelocity(){const t=this.currentTime;if(t<=0)return this.options.velocity||0;if(this.generator.velocity)return this.generator.velocity(t);const n=this.generator.next(t).value;return Uc(s=>this.generator.next(s).value,t,n)}get speed(){return this.playbackSpeed}set speed(t){const n=this.playbackSpeed!==t;n&&this.driver&&this.updateTime(we.now()),this.playbackSpeed=t,n&&this.driver&&(this.time=Ae(this.currentTime))}play(){if(this.isStopped)return;const{driver:t=Dc,startTime:n}=this.options;this.driver||(this.driver=t(i=>this.tick(i))),this.options.onPlay?.();const s=this.driver.now();this.state==="finished"?(this.updateFinished(),this.startTime=s):this.holdTime!==null?this.startTime=s-this.holdTime:this.startTime||(this.startTime=n??s),this.state==="finished"&&this.speed<0&&(this.startTime+=this.calculatedDuration),this.holdTime=null,this.state="running",this.driver.start()}pause(){this.state="paused",this.updateTime(we.now()),this.holdTime=this.currentTime}complete(){this.state!=="running"&&this.play(),this.state="finished",this.holdTime=null}finish(){this.notifyFinished(),this.teardown(),this.state="finished",this.options.onComplete?.()}cancel(){this.holdTime=null,this.startTime=0,this.tick(0),this.teardown(),this.options.onCancel?.()}teardown(){this.state="idle",this.stopDriver(),this.startTime=this.holdTime=null}stopDriver(){this.driver&&(this.driver.stop(),this.driver=void 0)}sample(t){return this.startTime=0,this.tick(t,!0)}attachTimeline(t){return this.options.allowFlatten&&(this.options.type="keyframes",this.options.ease="linear",this.initAnimation()),this.driver?.stop(),t.observe(this)}}function qc(e){for(let t=1;t<e.length;t++)e[t]??(e[t]=e[t-1])}const Ze=e=>e*180/Math.PI,ds=e=>{const t=Ze(Math.atan2(e[1],e[0]));return hs(t)},Xc={x:4,y:5,translateX:4,translateY:5,scaleX:0,scaleY:3,scale:e=>(Math.abs(e[0])+Math.abs(e[3]))/2,rotate:ds,rotateZ:ds,skewX:e=>Ze(Math.atan(e[1])),skewY:e=>Ze(Math.atan(e[2])),skew:e=>(Math.abs(e[1])+Math.abs(e[2]))/2},hs=e=>(e=e%360,e<0&&(e+=360),e),Mi=ds,Di=e=>Math.sqrt(e[0]*e[0]+e[1]*e[1]),Oi=e=>Math.sqrt(e[4]*e[4]+e[5]*e[5]),Yc={x:12,y:13,z:14,translateX:12,translateY:13,translateZ:14,scaleX:Di,scaleY:Oi,scale:e=>(Di(e)+Oi(e))/2,rotateX:e=>hs(Ze(Math.atan2(e[6],e[5]))),rotateY:e=>hs(Ze(Math.atan2(-e[2],e[0]))),rotateZ:Mi,rotate:Mi,skewX:e=>Ze(Math.atan(e[4])),skewY:e=>Ze(Math.atan(e[1])),skew:e=>(Math.abs(e[1])+Math.abs(e[4]))/2};function us(e){return e.includes("scale")?1:0}function fs(e,t){if(!e||e==="none")return us(t);const n=e.match(/^matrix3d\(([-\d.e\s,]+)\)$/u);let s,i;if(n)s=Yc,i=n;else{const a=e.match(/^matrix\(([-\d.e\s,]+)\)$/u);s=Xc,i=a}if(!i)return us(t);const r=s[t],o=i[1].split(",").map(Jc);return typeof r=="function"?r(o):o[r]}const Zc=(e,t)=>{const{transform:n="none"}=getComputedStyle(e);return fs(n,t)};function Jc(e){return parseFloat(e.trim())}const gt=["transformPerspective","x","y","z","translateX","translateY","translateZ","scale","scaleX","scaleY","rotate","rotateX","rotateY","rotateZ","skew","skewX","skewY"],yt=new Set([...gt,"pathRotation"]),Ri=e=>e===mt||e===N,ed=new Set(["x","y","z"]),td=gt.filter(e=>!ed.has(e));function nd(e){const t=[];return td.forEach(n=>{const s=e.getValue(n);s!==void 0&&(t.push([n,s.get()]),s.set(n.startsWith("scale")?1:0))}),t}const ze={width:({x:e},{paddingLeft:t="0",paddingRight:n="0",boxSizing:s})=>{const i=e.max-e.min;return s==="border-box"?i:i-parseFloat(t)-parseFloat(n)},height:({y:e},{paddingTop:t="0",paddingBottom:n="0",boxSizing:s})=>{const i=e.max-e.min;return s==="border-box"?i:i-parseFloat(t)-parseFloat(n)},top:(e,{top:t})=>parseFloat(t),left:(e,{left:t})=>parseFloat(t),bottom:({y:e},{top:t})=>parseFloat(t)+(e.max-e.min),right:({x:e},{left:t})=>parseFloat(t)+(e.max-e.min),x:(e,{transform:t})=>fs(t,"x"),y:(e,{transform:t})=>fs(t,"y")};ze.translateX=ze.x;ze.translateY=ze.y;const Je=new Set;let ps=!1,ms=!1,gs=!1;function Rr(){if(ms){const e=Array.from(Je).filter(s=>s.needsMeasurement),t=new Set(e.map(s=>s.element)),n=new Map;t.forEach(s=>{const i=nd(s);i.length&&(n.set(s,i),s.render())}),e.forEach(s=>s.measureInitialState()),t.forEach(s=>{s.render();const i=n.get(s);i&&i.forEach(([r,o])=>{s.getValue(r)?.set(o)})}),e.forEach(s=>s.measureEndState()),e.forEach(s=>{s.suspendedScrollY!==void 0&&window.scrollTo(0,s.suspendedScrollY)})}ms=!1,ps=!1,Je.forEach(e=>e.complete(gs)),Je.clear()}function jr(){Je.forEach(e=>{e.readKeyframes(),e.needsMeasurement&&(ms=!0)})}function sd(){gs=!0,jr(),Rr(),gs=!1}class Xs{constructor(t,n,s,i,r,o=!1){this.state="pending",this.isAsync=!1,this.needsMeasurement=!1,this.unresolvedKeyframes=[...t],this.onComplete=n,this.name=s,this.motionValue=i,this.element=r,this.isAsync=o}scheduleResolve(){this.state="scheduled",this.isAsync?(Je.add(this),ps||(ps=!0,ee.read(jr),ee.resolveKeyframes(Rr))):(this.readKeyframes(),this.complete())}readKeyframes(){const{unresolvedKeyframes:t,name:n,element:s,motionValue:i}=this;if(t[0]===null){const r=i?.get(),o=t[t.length-1];if(r!==void 0)t[0]=r;else if(s&&n){const a=s.readValue(n,o);a!=null&&(t[0]=a)}t[0]===void 0&&(t[0]=o),i&&r===void 0&&i.set(t[0])}qc(t)}setFinalKeyframe(){}measureInitialState(){}renderEndStyles(){}measureEndState(){}complete(t=!1){this.state="complete",this.onComplete(this.unresolvedKeyframes,this.finalKeyframe,t),Je.delete(this)}cancel(){this.state==="scheduled"&&(Je.delete(this),this.state="pending")}resume(){this.state==="pending"&&this.scheduleResolve()}}const id=e=>e.startsWith("--");function Lr(e,t,n){id(t)?e.style.setProperty(t,n):e.style[t]=n}const od={};function Nr(e,t){const n=cr(e);return()=>od[t]??n()}const rd=Nr(()=>window.ScrollTimeline!==void 0,"scrollTimeline"),Vr=Nr(()=>{try{document.createElement("div").animate({opacity:0},{easing:"linear(0, 1)"})}catch{return!1}return!0},"linearEasing"),vt=([e,t,n,s])=>`cubic-bezier(${e}, ${t}, ${n}, ${s})`,ji={linear:"linear",ease:"ease",easeIn:"ease-in",easeOut:"ease-out",easeInOut:"ease-in-out",circIn:vt([0,.65,.55,1]),circOut:vt([.55,0,1,.45]),backIn:vt([.31,.01,.66,-.59]),backOut:vt([.33,1.53,.69,.99])};function Ir(e,t){if(e)return typeof e=="function"?Vr()?Dr(e,t):"ease-out":xr(e)?vt(e):Array.isArray(e)?e.map(n=>Ir(n,t)||ji.easeOut):ji[e]}function ad(e,t,n,{delay:s=0,duration:i=300,repeat:r=0,repeatType:o="loop",ease:a="easeOut",times:c}={},l=void 0){const d={[t]:n};c&&(d.offset=c);const f=Ir(a,i);Array.isArray(f)&&(d.easing=f);const u={delay:s,duration:i,easing:Array.isArray(f)?"linear":f,fill:"both",iterations:r+1,direction:o==="reverse"?"alternate":"normal"};return l&&(u.pseudoElement=l),e.animate(d,u)}function Br(e){return typeof e=="function"&&"applyToOptions"in e}function ld({type:e,...t}){return Br(e)&&Vr()?e.applyToOptions(t):(t.duration??(t.duration=300),t.ease??(t.ease="easeOut"),t)}class $r extends qs{constructor(t){if(super(),this.finishedTime=null,this.isStopped=!1,this.manualStartTime=null,!t)return;const{element:n,name:s,keyframes:i,pseudoElement:r,allowFlatten:o=!1,finalKeyframe:a,onComplete:c}=t;this.isPseudoElement=!!r,this.allowFlatten=o,this.options=t,Tn(typeof t.type!="string");const l=ld(t);this.animation=ad(n,s,i,l,r),l.autoplay===!1&&this.animation.pause(),this.animation.onfinish=()=>{if(this.finishedTime=this.time,!r){const d=Sn(i,this.options,a,this.speed);this.updateMotionValue&&this.updateMotionValue(d),Lr(n,s,d),this.animation.cancel()}c?.(),this.notifyFinished()}}play(){this.isStopped||(this.manualStartTime=null,this.animation.play(),this.state==="finished"&&this.updateFinished())}pause(){this.animation.pause()}complete(){this.animation.finish?.()}cancel(){try{this.animation.cancel()}catch{}}stop(){if(this.isStopped)return;this.isStopped=!0;const{state:t}=this;t==="idle"||t==="finished"||(this.updateMotionValue?this.updateMotionValue():this.commitStyles(),this.isPseudoElement||this.cancel())}commitStyles(){const t=this.options?.element;!this.isPseudoElement&&t?.isConnected&&this.animation.commitStyles?.()}get duration(){const t=this.animation.effect?.getComputedTiming?.().duration||0;return Ae(Number(t))}get iterationDuration(){const{delay:t=0}=this.options||{};return this.duration+Ae(t)}get time(){return Ae(Number(this.animation.currentTime)||0)}set time(t){const n=this.finishedTime!==null;this.manualStartTime=null,this.finishedTime=null,this.animation.currentTime=Ee(t),n&&this.animation.pause()}get speed(){return this.animation.playbackRate}set speed(t){t<0&&(this.finishedTime=null),this.animation.playbackRate=t}get state(){return this.finishedTime!==null?"finished":this.animation.playState}get startTime(){return this.manualStartTime??Number(this.animation.startTime)}set startTime(t){this.manualStartTime=this.animation.startTime=t}attachTimeline({timeline:t,rangeStart:n,rangeEnd:s,observe:i}){return this.allowFlatten&&this.animation.effect?.updateTiming({easing:"linear"}),this.animation.onfinish=null,t&&rd()?(this.animation.timeline=t,n&&(this.animation.rangeStart=n),s&&(this.animation.rangeEnd=s),Pe):i(this)}}const Fr={anticipate:gr,backInOut:mr,circInOut:wr};function cd(e){return e in Fr}function dd(e){typeof e.ease=="string"&&cd(e.ease)&&(e.ease=Fr[e.ease])}const Bn=10;class hd extends $r{constructor(t){dd(t),Or(t),super(t),t.startTime!==void 0&&t.autoplay!==!1&&(this.startTime=t.startTime),this.options=t}updateMotionValue(t){const{motionValue:n,onUpdate:s,onComplete:i,element:r,...o}=this.options;if(!n)return;if(t!==void 0){n.set(t);return}const a=new gn({...o,autoplay:!1}),c=Math.max(Bn,we.now()-this.startTime),l=$e(0,Bn,c-Bn),d=a.sample(c).value,{name:f}=this.options;r&&f&&Lr(r,f,d),n.setWithVelocity(a.sample(Math.max(0,c-l)).value,d,l),a.stop()}}const Li=(e,t)=>t==="zIndex"?!1:!!(typeof e=="number"||Array.isArray(e)||typeof e=="string"&&(je.test(e)||e==="0")&&!e.startsWith("url("));function ud(e){const t=e[0];if(e.length===1)return!0;for(let n=0;n<e.length;n++)if(e[n]!==t)return!0}function fd(e,t,n,s){const i=e[0];if(i===null)return!1;if(t==="display"||t==="visibility")return!0;const r=e[e.length-1],o=Li(i,t),a=Li(r,t);return!o||!a?!1:ud(e)||(n==="spring"||Br(n))&&s}function ys(e){e.duration=0,e.type="keyframes"}const _r=new Set(["opacity","clipPath","filter","transform","backgroundColor"]),pd=/^(?:oklch|oklab|lab|lch|color|color-mix|light-dark)\(/;function md(e){for(let t=0;t<e.length;t++)if(typeof e[t]=="string"&&pd.test(e[t]))return!0;return!1}const gd=new Set(["color","backgroundColor","outlineColor","fill","stroke","borderColor","borderTopColor","borderRightColor","borderBottomColor","borderLeftColor"]),yd=cr(()=>Object.hasOwnProperty.call(Element.prototype,"animate"));function wd(e){const{motionValue:t,name:n,repeatDelay:s,repeatType:i,damping:r,type:o,keyframes:a}=e,c=t?.owner?.current;if(!(c instanceof HTMLElement)&&!(c instanceof SVGElement))return!1;const{onUpdate:l,transformTemplate:d}=t.owner.getProps();return yd()&&n&&(_r.has(n)||gd.has(n)&&md(a))&&(n!=="transform"||!d)&&!l&&!s&&i!=="mirror"&&r!==0&&o!=="inertia"}const bd=40;class xd extends qs{constructor({autoplay:t=!0,delay:n=0,type:s="keyframes",repeat:i=0,repeatDelay:r=0,repeatType:o="loop",keyframes:a,name:c,motionValue:l,element:d,...f}){super(),this.stop=()=>{this._animation&&(this._animation.stop(),this.stopTimeline?.()),this.keyframeResolver?.cancel()},this.createdAt=we.now();const u={autoplay:t,delay:n,type:s,repeat:i,repeatDelay:r,repeatType:o,name:c,motionValue:l,element:d,...f},m=d?.KeyframeResolver||Xs;this.keyframeResolver=new m(a,(g,b,y)=>this.onKeyframesResolved(g,b,u,!y),c,l,d),this.keyframeResolver?.scheduleResolve()}onKeyframesResolved(t,n,s,i){this.keyframeResolver=void 0;const{name:r,type:o,velocity:a,delay:c,isHandoff:l,onUpdate:d}=s;this.resolvedAt=we.now();let f=!0;fd(t,r,o,a)||(f=!1,(Ue.instantAnimations||!c)&&d?.(Sn(t,s,n)),t[0]=t[t.length-1],ys(s),s.repeat=0);const m={startTime:i?this.resolvedAt?this.resolvedAt-this.createdAt>bd?this.resolvedAt:this.createdAt:this.createdAt:void 0,finalKeyframe:n,...s,keyframes:t},g=f&&!l&&wd(m),b=m.motionValue?.owner?.current;let y;if(g)try{y=new hd({...m,element:b})}catch{y=new gn(m)}else y=new gn(m);y.finished.then(()=>{this.notifyFinished()}).catch(Pe),this.pendingTimeline&&(this.stopTimeline=y.attachTimeline(this.pendingTimeline),this.pendingTimeline=void 0),this._animation=y}get finished(){return this._animation?this.animation.finished:this._finished}then(t,n){return this.finished.finally(t).then(()=>{})}get animation(){return this._animation||(this.keyframeResolver?.resume(),sd()),this._animation}get duration(){return this.animation.duration}get iterationDuration(){return this.animation.iterationDuration}get time(){return this.animation.time}set time(t){this.animation.time=t}get speed(){return this.animation.speed}get state(){return this.animation.state}set speed(t){this.animation.speed=t}get startTime(){return this.animation.startTime}attachTimeline(t){return this._animation?this.stopTimeline=this.animation.attachTimeline(t):this.pendingTimeline=t,()=>this.stop()}play(){this.animation.play()}pause(){this.animation.pause()}complete(){this.animation.complete()}cancel(){this._animation&&this.animation.cancel(),this.keyframeResolver?.cancel()}}function Hr(e,t,n,s=0,i=1){const r=Array.from(e).sort((l,d)=>l.sortNodePosition(d)).indexOf(t),o=e.size,a=(o-1)*s;return typeof n=="function"?n(r,o):i===1?r*s:a-r*s}const Ni=30,vd=e=>!isNaN(parseFloat(e));class kd{constructor(t,n={}){this.canTrackVelocity=null,this.events={},this.updateAndNotify=s=>{const i=we.now();if(this.updatedAt!==i&&this.setPrevFrameValue(),this.prev=this.current,this.setCurrent(s),this.current!==this.prev&&(this.events.change?.notify(this.current),this.dependents))for(const r of this.dependents)r.dirty()},this.hasAnimated=!1,this.setCurrent(t),this.owner=n.owner}setCurrent(t){this.current=t,this.updatedAt=we.now(),this.canTrackVelocity===null&&t!==void 0&&(this.canTrackVelocity=vd(this.current))}setPrevFrameValue(t=this.current){this.prevFrameValue=t,this.prevUpdatedAt=this.updatedAt}onChange(t){return this.on("change",t)}on(t,n){this.events[t]||(this.events[t]=new Fs);const s=this.events[t].add(n);return t==="change"?()=>{s(),ee.read(()=>{this.events.change.getSize()||this.stop()})}:s}clearListeners(){for(const t in this.events)this.events[t].clear()}attach(t,n){this.passiveEffect=t,this.stopPassiveEffect=n}set(t){this.passiveEffect?this.passiveEffect(t,this.updateAndNotify):this.updateAndNotify(t)}setWithVelocity(t,n,s){this.set(n),this.prev=void 0,this.prevFrameValue=t,this.prevUpdatedAt=this.updatedAt-s}jump(t,n=!0){this.updateAndNotify(t),this.prev=t,this.prevUpdatedAt=this.prevFrameValue=void 0,n&&this.stop(),this.stopPassiveEffect&&this.stopPassiveEffect()}dirty(){this.events.change?.notify(this.current)}addDependent(t){this.dependents||(this.dependents=new Set),this.dependents.add(t)}removeDependent(t){this.dependents&&this.dependents.delete(t)}get(){return this.current}getPrevious(){return this.prev}getVelocity(){const t=we.now();if(!this.canTrackVelocity||this.prevFrameValue===void 0||t-this.updatedAt>Ni)return 0;const n=Math.min(this.updatedAt-this.prevUpdatedAt,Ni);return dr(parseFloat(this.current)-parseFloat(this.prevFrameValue),n)}start(t){return this.stop(),new Promise(n=>{this.hasAnimated=!0,this.animation=t(n),this.events.animationStart&&this.events.animationStart.notify()}).then(()=>{this.events.animationComplete&&this.events.animationComplete.notify(),this.clearAnimation()})}stop(){this.animation&&(this.animation.stop(),this.events.animationCancel&&this.events.animationCancel.notify()),this.clearAnimation()}isAnimating(){return!!this.animation}clearAnimation(){delete this.animation}destroy(){this.dependents?.clear(),this.events.destroy?.notify(),this.clearListeners(),this.stop(),this.stopPassiveEffect&&this.stopPassiveEffect()}}function pt(e,t){return new kd(e,t)}function Wr(e,t){if(e?.inherit&&t){const{inherit:n,...s}=e;return{...t,...s}}return e}function Ys(e,t){const n=e?.[t]??e?.default??e;return n!==e?Wr(n,e):n}const Td={type:"spring",stiffness:500,damping:25,restSpeed:10},Sd=e=>({type:"spring",stiffness:550,damping:e===0?2*Math.sqrt(550):30,restSpeed:10}),Cd={type:"keyframes",duration:.8},Ad={type:"keyframes",ease:[.25,.1,.35,1],duration:.3},Pd=(e,{keyframes:t})=>t.length>2?Cd:yt.has(e)?e.startsWith("scale")?Sd(t[1]):Td:Ad,Ed=new Set(["when","delay","delayChildren","staggerChildren","staggerDirection","repeat","repeatType","repeatDelay","from","elapsed"]);function Md(e){for(const t in e)if(!Ed.has(t))return!0;return!1}const Zs=(e,t,n,s={},i,r)=>o=>{const a=Ys(s,e)||{},c=a.delay||s.delay||0;let{elapsed:l=0}=s;l=l-Ee(c);const d={keyframes:Array.isArray(n)?n:[null,n],ease:"easeOut",velocity:t.getVelocity(),...a,delay:-l,onUpdate:u=>{t.set(u),a.onUpdate&&a.onUpdate(u)},onComplete:()=>{o(),a.onComplete&&a.onComplete()},name:e,motionValue:t,element:r?void 0:i};Md(a)||Object.assign(d,Pd(e,d)),d.duration&&(d.duration=Ee(d.duration)),d.repeatDelay&&(d.repeatDelay=Ee(d.repeatDelay)),d.from!==void 0&&(d.keyframes[0]=d.from);let f=!1;if((d.type===!1||d.duration===0&&!d.repeatDelay)&&(ys(d),d.delay===0&&(f=!0)),(Ue.instantAnimations||Ue.skipAnimations||i?.shouldSkipAnimations||a.skipAnimations)&&(f=!0,ys(d),d.delay=0),d.allowFlatten=!a.type&&!a.ease,f&&!r&&t.get()!==void 0){const u=Sn(d.keyframes,a);if(u!==void 0){ee.update(()=>{d.onUpdate(u),d.onComplete()});return}}return a.isSync?new gn(d):new xd(d)},Dd=/^var\(--(?:([\w-]+)|([\w-]+), ?([a-zA-Z\d ()%#.,-]+))\)/u;function Od(e){const t=Dd.exec(e);if(!t)return[,];const[,n,s,i]=t;return[`--${n??s}`,i]}function zr(e,t,n=1){const[s,i]=Od(e);if(!s)return;const r=window.getComputedStyle(t).getPropertyValue(s);if(r){const o=r.trim();return rr(o)?parseFloat(o):o}return Ws(i)?zr(i,t,n+1):i}function Vi(e){const t=[{},{}];return e?.values.forEach((n,s)=>{t[0][s]=n.get(),t[1][s]=n.getVelocity()}),t}function Js(e,t,n,s){if(typeof t=="function"){const[i,r]=Vi(s);t=t(n!==void 0?n:e.custom,i,r)}if(typeof t=="string"&&(t=e.variants&&e.variants[t]),typeof t=="function"){const[i,r]=Vi(s);t=t(n!==void 0?n:e.custom,i,r)}return t}function et(e,t,n){const s=e.getProps();return Js(s,t,n!==void 0?n:s.custom,e)}const Ur=new Set(["width","height","top","left","right","bottom",...gt]),ws=e=>Array.isArray(e);function Rd(e,t,n){e.hasValue(t)?e.getValue(t).set(n):e.addValue(t,pt(n))}function jd(e){return ws(e)?e[e.length-1]||0:e}function Ld(e,t){const n=et(e,t);let{transitionEnd:s={},transition:i={},...r}=n||{};r={...r,...s};for(const o in r){const a=jd(r[o]);Rd(e,o,a)}}const fe=e=>!!(e&&e.getVelocity);function Nd(e){return!!(fe(e)&&e.add)}function bs(e,t){const n=e.getValue("willChange");if(Nd(n))return n.add(t);if(!n&&Ue.WillChange){const s=new Ue.WillChange("auto");e.addValue("willChange",s),s.add(t)}}function ei(e){return e.replace(/([A-Z])/g,t=>`-${t.toLowerCase()}`)}const Vd="framerAppearId",Gr="data-"+ei(Vd);function Kr(e){return e.props[Gr]}const Id=typeof window<"u";function Bd({protectedKeys:e,needsAnimating:t},n){const s=e.hasOwnProperty(n)&&t[n]!==!0;return t[n]=!1,s}function Qr(e,t,{delay:n=0,transitionOverride:s,type:i}={}){let{transition:r,transitionEnd:o,...a}=t;const c=e.getDefaultTransition();r=r?Wr(r,c):c;const l=r?.reduceMotion,d=r?.skipAnimations;s&&(r=s);const f=[],u=i&&e.animationState&&e.animationState.getState()[i],m=r?.path;m&&m.animateVisualElement(e,a,r,n,f);for(const g in a){const b=e.getValue(g,e.latestValues[g]??null),y=a[g];if(y===void 0||u&&Bd(u,g))continue;const x={delay:n,...Ys(r||{},g)};d&&(x.skipAnimations=!0);const S=b.get();if(S!==void 0&&!b.isAnimating()&&!Array.isArray(y)&&y===S&&!x.velocity){ee.update(()=>b.set(y));continue}let v=!1;if(Id&&window.MotionHandoffAnimation){const A=Kr(e);if(A){const C=window.MotionHandoffAnimation(A,g,ee);C!==null&&(x.startTime=C,v=!0)}}bs(e,g);const w=l??e.shouldReduceMotion;b.start(Zs(g,b,y,w&&Ur.has(g)?{type:!1}:x,e,v));const k=b.animation;k&&f.push(k)}if(o){const g=()=>ee.update(()=>{o&&Ld(e,o)});f.length?Promise.all(f).then(g):g()}return f}function xs(e,t,n={}){const s=et(e,t,n.type==="exit"?e.presenceContext?.custom:void 0);let{transition:i=e.getDefaultTransition()||{}}=s||{};n.transitionOverride&&(i=n.transitionOverride);const r=s?()=>Promise.all(Qr(e,s,n)):()=>Promise.resolve(),o=e.variantChildren&&e.variantChildren.size?(c=0)=>{const{delayChildren:l=0,staggerChildren:d,staggerDirection:f}=i;return $d(e,t,c,l,d,f,n)}:()=>Promise.resolve(),{when:a}=i;if(a){const[c,l]=a==="beforeChildren"?[r,o]:[o,r];return c().then(()=>l())}else return Promise.all([r(),o(n.delay)])}function $d(e,t,n=0,s=0,i=0,r=1,o){const a=[];for(const c of e.variantChildren)c.notify("AnimationStart",t),a.push(xs(c,t,{...o,delay:n+(typeof s=="function"?0:s)+Hr(e.variantChildren,c,s,i,r)}).then(()=>c.notify("AnimationComplete",t)));return Promise.all(a)}function Fd(e,t,n={}){e.notify("AnimationStart",t);let s;if(Array.isArray(t)){const i=t.map(r=>xs(e,r,n));s=Promise.all(i)}else if(typeof t=="string")s=xs(e,t,n);else{const i=typeof t=="function"?et(e,t,n.custom):t;s=Promise.all(Qr(e,i,n))}return s.then(()=>{e.notify("AnimationComplete",t)})}const _d={test:e=>e==="auto",parse:e=>e},qr=e=>t=>t.test(e),Xr=[mt,N,Be,Fe,hc,dc,_d],Ii=e=>Xr.find(qr(e));function Hd(e){return typeof e=="number"?e===0:e!==null?e==="none"||e==="0"||lr(e):!0}const Wd=new Set(["brightness","contrast","saturate","opacity"]);function zd(e){const[t,n]=e.slice(0,-1).split("(");if(t==="drop-shadow")return e;const[s]=n.match(zs)||[];if(!s)return e;const i=n.replace(s,"");let r=Wd.has(t)?1:0;return s!==n&&(r*=100),t+"("+r+i+")"}const Ud=/\b([a-z-]*)\(.*?\)/gu,vs={...je,getAnimatableNone:e=>{const t=e.match(Ud);return t?t.map(zd).join(" "):e}},ks={...je,getAnimatableNone:e=>{const t=je.parse(e);return je.createTransformer(e)(t.map(s=>typeof s=="number"?0:typeof s=="object"?{...s,alpha:1}:s))}},Bi={...mt,transform:Math.round},Gd={rotate:Fe,pathRotation:Fe,rotateX:Fe,rotateY:Fe,rotateZ:Fe,scale:Ut,scaleX:Ut,scaleY:Ut,scaleZ:Ut,skew:Fe,skewX:Fe,skewY:Fe,distance:N,translateX:N,translateY:N,translateZ:N,x:N,y:N,z:N,perspective:N,transformPerspective:N,opacity:Rt,originX:Si,originY:Si,originZ:N},yn={borderWidth:N,borderTopWidth:N,borderRightWidth:N,borderBottomWidth:N,borderLeftWidth:N,borderRadius:N,borderTopLeftRadius:N,borderTopRightRadius:N,borderBottomRightRadius:N,borderBottomLeftRadius:N,width:N,maxWidth:N,height:N,maxHeight:N,top:N,right:N,bottom:N,left:N,inset:N,insetBlock:N,insetBlockStart:N,insetBlockEnd:N,insetInline:N,insetInlineStart:N,insetInlineEnd:N,padding:N,paddingTop:N,paddingRight:N,paddingBottom:N,paddingLeft:N,paddingBlock:N,paddingBlockStart:N,paddingBlockEnd:N,paddingInline:N,paddingInlineStart:N,paddingInlineEnd:N,margin:N,marginTop:N,marginRight:N,marginBottom:N,marginLeft:N,marginBlock:N,marginBlockStart:N,marginBlockEnd:N,marginInline:N,marginInlineStart:N,marginInlineEnd:N,fontSize:N,backgroundPositionX:N,backgroundPositionY:N,...Gd,zIndex:Bi,fillOpacity:Rt,strokeOpacity:Rt,numOctaves:Bi},Kd={...yn,color:re,backgroundColor:re,outlineColor:re,fill:re,stroke:re,borderColor:re,borderTopColor:re,borderRightColor:re,borderBottomColor:re,borderLeftColor:re,filter:vs,WebkitFilter:vs,mask:ks,WebkitMask:ks},Yr=e=>Kd[e],Qd=new Set([vs,ks]);function Zr(e,t){let n=Yr(e);return Qd.has(n)||(n=je),n.getAnimatableNone?n.getAnimatableNone(t):void 0}const qd=new Set(["auto","none","0"]);function Xd(e,t,n){let s=0,i;for(;s<e.length&&!i;){const r=e[s];typeof r=="string"&&!qd.has(r)&&ft(r).values.length&&(i=e[s]),s++}if(i&&n)for(const r of t)e[r]=Zr(n,i)}class Yd extends Xs{constructor(t,n,s,i,r){super(t,n,s,i,r,!0)}readKeyframes(){const{unresolvedKeyframes:t,element:n,name:s}=this;if(!n||!n.current)return;super.readKeyframes();for(let d=0;d<t.length;d++){let f=t[d];if(typeof f=="string"&&(f=f.trim(),Ws(f))){const u=zr(f,n.current);u!==void 0&&(t[d]=u),d===t.length-1&&(this.finalKeyframe=f)}}if(this.resolveNoneKeyframes(),!Ur.has(s)||t.length!==2)return;const[i,r]=t,o=Ii(i),a=Ii(r),c=Ti(i),l=Ti(r);if(c!==l&&ze[s]){this.needsMeasurement=!0;return}if(o!==a)if(Ri(o)&&Ri(a))for(let d=0;d<t.length;d++){const f=t[d];typeof f=="string"&&(t[d]=parseFloat(f))}else ze[s]&&(this.needsMeasurement=!0)}resolveNoneKeyframes(){const{unresolvedKeyframes:t,name:n}=this,s=[];for(let i=0;i<t.length;i++)(t[i]===null||Hd(t[i]))&&s.push(i);s.length&&Xd(t,s,n)}measureInitialState(){const{element:t,unresolvedKeyframes:n,name:s}=this;if(!t||!t.current)return;s==="height"&&(this.suspendedScrollY=window.pageYOffset),this.measuredOrigin=ze[s](t.measureViewportBox(),window.getComputedStyle(t.current)),n[0]=this.measuredOrigin;const i=n[n.length-1];i!==void 0&&t.getValue(s,i).jump(i,!1)}measureEndState(){const{element:t,name:n,unresolvedKeyframes:s}=this;if(!t||!t.current)return;const i=t.getValue(n);i&&i.jump(this.measuredOrigin,!1);const r=s.length-1,o=s[r];s[r]=ze[n](t.measureViewportBox(),window.getComputedStyle(t.current)),o!==null&&this.finalKeyframe===void 0&&(this.finalKeyframe=o),this.removedTransforms?.length&&this.removedTransforms.forEach(([a,c])=>{t.getValue(a).set(c)}),this.resolveNoneKeyframes()}}const ti=["borderTopLeftRadius","borderTopRightRadius","borderBottomRightRadius","borderBottomLeftRadius"];function Jr(e,t,n){if(e==null)return[];if(e instanceof EventTarget)return[e];if(typeof e=="string"){let s=document;const i=n?.[e]??s.querySelectorAll(e);return i?Array.from(i):[]}return Array.from(e).filter(s=>s!=null)}const Ts=(e,t)=>t&&typeof e=="number"?t.transform(e):e;function sn(e){return ar(e)&&"offsetHeight"in e&&!("ownerSVGElement"in e)}const{schedule:ni}=vr(queueMicrotask,!1),Re={x:!1,y:!1};function ea(){return Re.x||Re.y}function Zd(e){return e==="x"||e==="y"?Re[e]?null:(Re[e]=!0,()=>{Re[e]=!1}):Re.x||Re.y?null:(Re.x=Re.y=!0,()=>{Re.x=Re.y=!1})}function ta(e,t){const n=Jr(e),s=new AbortController,i={passive:!0,...t,signal:s.signal};return[n,i,()=>s.abort()]}function Jd(e){return!(e.pointerType==="touch"||ea())}function eh(e,t,n={}){const[s,i,r]=ta(e,n);return s.forEach(o=>{let a=!1,c=!1,l;const d=()=>{o.removeEventListener("pointerleave",g)},f=y=>{l&&(l(y),l=void 0),d()},u=y=>{a=!1,window.removeEventListener("pointerup",u),window.removeEventListener("pointercancel",u),c&&(c=!1,f(y))},m=()=>{a=!0,window.addEventListener("pointerup",u,i),window.addEventListener("pointercancel",u,i)},g=y=>{if(y.pointerType!=="touch"){if(a){c=!0;return}f(y)}},b=y=>{if(!Jd(y))return;c=!1;const x=t(o,y);typeof x=="function"&&(l=x,o.addEventListener("pointerleave",g,i))};o.addEventListener("pointerenter",b,i),o.addEventListener("pointerdown",m,i)}),r}const na=(e,t)=>t?e===t?!0:na(e,t.parentElement):!1,si=e=>e.pointerType==="mouse"?typeof e.button!="number"||e.button<=0:e.isPrimary!==!1,th=new Set(["BUTTON","INPUT","SELECT","TEXTAREA","A"]);function nh(e){return th.has(e.tagName)||e.isContentEditable===!0}const sh=new Set(["INPUT","SELECT","TEXTAREA"]);function ih(e){return sh.has(e.tagName)||e.isContentEditable===!0}const on=new WeakSet;function $i(e){return t=>{t.key==="Enter"&&e(t)}}function $n(e,t){e.dispatchEvent(new PointerEvent("pointer"+t,{isPrimary:!0,bubbles:!0}))}const oh=(e,t)=>{const n=e.currentTarget;if(!n)return;const s=$i(()=>{if(on.has(n))return;$n(n,"down");const i=$i(()=>{$n(n,"up")}),r=()=>$n(n,"cancel");n.addEventListener("keyup",i,t),n.addEventListener("blur",r,t)});n.addEventListener("keydown",s,t),n.addEventListener("blur",()=>n.removeEventListener("keydown",s),t)};function Fi(e){return si(e)&&!ea()}const _i=new WeakSet;function rh(e,t,n={}){const[s,i,r]=ta(e,n),o=a=>{const c=a.currentTarget;if(!Fi(a)||_i.has(a))return;on.add(c),n.stopPropagation&&_i.add(a);const l=t(c,a),d={...i,capture:!0},f=(g,b)=>{window.removeEventListener("pointerup",u,d),window.removeEventListener("pointercancel",m,d),on.has(c)&&on.delete(c),Fi(g)&&typeof l=="function"&&l(g,{success:b})},u=g=>{f(g,c===window||c===document||n.useGlobalTarget||na(c,g.target))},m=g=>{f(g,!1)};window.addEventListener("pointerup",u,d),window.addEventListener("pointercancel",m,d)};return s.forEach(a=>{(n.useGlobalTarget?window:a).addEventListener("pointerdown",o,i),sn(a)&&(a.addEventListener("focus",l=>oh(l,i)),!nh(a)&&!a.hasAttribute("tabindex")&&(a.tabIndex=0))}),r}function ii(e){return ar(e)&&"ownerSVGElement"in e}const rn=new WeakMap;let an;const sa=(e,t,n)=>(s,i)=>i&&i[0]?i[0][e+"Size"]:ii(s)&&"getBBox"in s?s.getBBox()[t]:s[n],ah=sa("inline","width","offsetWidth"),lh=sa("block","height","offsetHeight");function ch({target:e,borderBoxSize:t}){rn.get(e)?.forEach(n=>{n(e,{get width(){return ah(e,t)},get height(){return lh(e,t)}})})}function dh(e){e.forEach(ch)}function hh(){typeof ResizeObserver>"u"||(an=new ResizeObserver(dh))}function uh(e,t){an||hh();const n=Jr(e);return n.forEach(s=>{let i=rn.get(s);i||(i=new Set,rn.set(s,i)),i.add(t),an?.observe(s)}),()=>{n.forEach(s=>{const i=rn.get(s);i?.delete(t),i?.size||an?.unobserve(s)})}}const ln=new Set;let ht;function fh(){ht=()=>{const e={get width(){return window.innerWidth},get height(){return window.innerHeight}};ln.forEach(t=>t(e))},window.addEventListener("resize",ht)}function ph(e){return ln.add(e),ht||fh(),()=>{ln.delete(e),!ln.size&&typeof ht=="function"&&(window.removeEventListener("resize",ht),ht=void 0)}}function Hi(e,t){return typeof e=="function"?ph(e):uh(e,t)}function mh(e){return ii(e)&&e.tagName==="svg"}const gh=[...Xr,re,je],yh=e=>gh.find(qr(e)),Wi=()=>({translate:0,scale:1,origin:0,originPoint:0}),ut=()=>({x:Wi(),y:Wi()}),zi=()=>({min:0,max:0}),ce=()=>({x:zi(),y:zi()}),wh=new WeakMap;function Cn(e){return e!==null&&typeof e=="object"&&typeof e.start=="function"}function jt(e){return typeof e=="string"||Array.isArray(e)}const oi=["animate","whileInView","whileFocus","whileHover","whileTap","whileDrag","exit"],ri=["initial",...oi];function An(e){return Cn(e.animate)||ri.some(t=>jt(e[t]))}function ia(e){return!!(An(e)||e.variants)}function bh(e,t,n){for(const s in t){const i=t[s],r=n[s];if(fe(i))e.addValue(s,i);else if(fe(r))e.addValue(s,pt(i,{owner:e}));else if(r!==i)if(e.hasValue(s)){const o=e.getValue(s);o.liveStyle===!0?o.jump(i):o.hasAnimated||o.set(i)}else{const o=e.getStaticValue(s);e.addValue(s,pt(o!==void 0?o:i,{owner:e}))}}for(const s in n)t[s]===void 0&&e.removeValue(s);return t}const Ss={current:null},oa={current:!1},xh=typeof window<"u";function vh(){if(oa.current=!0,!!xh)if(window.matchMedia){const e=window.matchMedia("(prefers-reduced-motion)"),t=()=>Ss.current=e.matches;e.addEventListener("change",t),t()}else Ss.current=!1}const Ui=["AnimationStart","AnimationComplete","Update","BeforeLayoutMeasure","LayoutMeasure","LayoutAnimationStart","LayoutAnimationComplete"];let wn={};function ra(e){wn=e}function kh(){return wn}class Th{scrapeMotionValuesFromProps(t,n,s){return{}}constructor({parent:t,props:n,presenceContext:s,reducedMotionConfig:i,skipAnimations:r,blockInitialAnimation:o,visualState:a},c={}){this.current=null,this.children=new Set,this.isVariantNode=!1,this.isControllingVariants=!1,this.shouldReduceMotion=null,this.shouldSkipAnimations=!1,this.values=new Map,this.KeyframeResolver=Xs,this.features={},this.valueSubscriptions=new Map,this.prevMotionValues={},this.hasBeenMounted=!1,this.events={},this.propEventSubscriptions={},this.notifyUpdate=()=>this.notify("Update",this.latestValues),this.render=()=>{this.current&&(this.triggerBuild(),this.renderInstance(this.current,this.renderState,this.props.style,this.projection))},this.renderScheduledAt=0,this.scheduleRender=()=>{const m=we.now();this.renderScheduledAt<m&&(this.renderScheduledAt=m,ee.render(this.render,!1,!0))};const{latestValues:l,renderState:d}=a;this.latestValues=l,this.baseTarget={...l},this.initialValues=n.initial?{...l}:{},this.renderState=d,this.parent=t,this.props=n,this.presenceContext=s,this.depth=t?t.depth+1:0,this.reducedMotionConfig=i,this.skipAnimationsConfig=r,this.options=c,this.blockInitialAnimation=!!o,this.isControllingVariants=An(n),this.isVariantNode=ia(n),this.isVariantNode&&(this.variantChildren=new Set),this.manuallyAnimateOnMount=!!(t&&t.current);const{willChange:f,...u}=this.scrapeMotionValuesFromProps(n,{},this);for(const m in u){const g=u[m];l[m]!==void 0&&fe(g)&&g.set(l[m])}}mount(t){if(this.hasBeenMounted)for(const n in this.initialValues)this.values.get(n)?.jump(this.initialValues[n]),this.latestValues[n]=this.initialValues[n];this.current=t,wh.set(t,this),this.projection&&!this.projection.instance&&this.projection.mount(t),this.parent&&this.isVariantNode&&!this.isControllingVariants&&(this.removeFromVariantTree=this.parent.addVariantChild(this)),this.values.forEach((n,s)=>this.bindToMotionValue(s,n)),this.reducedMotionConfig==="never"?this.shouldReduceMotion=!1:this.reducedMotionConfig==="always"?this.shouldReduceMotion=!0:(oa.current||vh(),this.shouldReduceMotion=Ss.current),this.shouldSkipAnimations=this.skipAnimationsConfig??!1,this.parent?.addChild(this),this.update(this.props,this.presenceContext),this.hasBeenMounted=!0}unmount(){this.projection&&this.projection.unmount(),Ge(this.notifyUpdate),Ge(this.render),this.valueSubscriptions.forEach(t=>t()),this.valueSubscriptions.clear(),this.removeFromVariantTree&&this.removeFromVariantTree(),this.parent?.removeChild(this);for(const t in this.events)this.events[t].clear();for(const t in this.features){const n=this.features[t];n&&(n.unmount(),n.isMounted=!1)}this.current=null}addChild(t){this.children.add(t),this.enteringChildren??(this.enteringChildren=new Set),this.enteringChildren.add(t)}removeChild(t){this.children.delete(t),this.enteringChildren&&this.enteringChildren.delete(t)}bindToMotionValue(t,n){if(this.valueSubscriptions.has(t)&&this.valueSubscriptions.get(t)(),n.accelerate&&_r.has(t)&&this.current instanceof HTMLElement){const{factory:o,keyframes:a,times:c,ease:l,duration:d}=n.accelerate,f=new $r({element:this.current,name:t,keyframes:a,times:c,ease:l,duration:Ee(d)}),u=o(f);this.valueSubscriptions.set(t,()=>{u(),f.cancel()});return}const s=yt.has(t);s&&this.onBindTransform&&this.onBindTransform();const i=n.on("change",o=>{this.latestValues[t]=o,this.props.onUpdate&&ee.preRender(this.notifyUpdate),s&&this.projection&&(this.projection.isTransformDirty=!0),this.scheduleRender()});let r;typeof window<"u"&&window.MotionCheckAppearSync&&(r=window.MotionCheckAppearSync(this,t,n)),this.valueSubscriptions.set(t,()=>{i(),r&&r()})}sortNodePosition(t){return!this.current||!this.sortInstanceNodePosition||this.type!==t.type?0:this.sortInstanceNodePosition(this.current,t.current)}updateFeatures(){let t="animation";for(t in wn){const n=wn[t];if(!n)continue;const{isEnabled:s,Feature:i}=n;if(!this.features[t]&&i&&s(this.props)&&(this.features[t]=new i(this)),this.features[t]){const r=this.features[t];r.isMounted?r.update():(r.mount(),r.isMounted=!0)}}}triggerBuild(){this.build(this.renderState,this.latestValues,this.props)}measureViewportBox(){return this.current?this.measureInstanceViewportBox(this.current,this.props):ce()}getStaticValue(t){return this.latestValues[t]}setStaticValue(t,n){this.latestValues[t]=n}update(t,n){(t.transformTemplate||this.props.transformTemplate)&&this.scheduleRender(),this.prevProps=this.props,this.props=t,this.prevPresenceContext=this.presenceContext,this.presenceContext=n;for(let s=0;s<Ui.length;s++){const i=Ui[s];this.propEventSubscriptions[i]&&(this.propEventSubscriptions[i](),delete this.propEventSubscriptions[i]);const r="on"+i,o=t[r];o&&(this.propEventSubscriptions[i]=this.on(i,o))}this.prevMotionValues=bh(this,this.scrapeMotionValuesFromProps(t,this.prevProps||{},this),this.prevMotionValues),this.handleChildMotionValue&&this.handleChildMotionValue()}getProps(){return this.props}getVariant(t){return this.props.variants?this.props.variants[t]:void 0}getDefaultTransition(){return this.props.transition}getTransformPagePoint(){return this.props.transformPagePoint}getClosestVariantNode(){return this.isVariantNode?this:this.parent?this.parent.getClosestVariantNode():void 0}addVariantChild(t){const n=this.getClosestVariantNode();if(n)return n.variantChildren&&n.variantChildren.add(t),()=>n.variantChildren.delete(t)}addValue(t,n){const s=this.values.get(t);n!==s&&(s&&this.removeValue(t),this.bindToMotionValue(t,n),this.values.set(t,n),this.latestValues[t]=n.get())}removeValue(t){this.values.delete(t);const n=this.valueSubscriptions.get(t);n&&(n(),this.valueSubscriptions.delete(t)),delete this.latestValues[t],this.removeValueFromRenderState(t,this.renderState)}hasValue(t){return this.values.has(t)}getValue(t,n){if(this.props.values&&this.props.values[t])return this.props.values[t];let s=this.values.get(t);return s===void 0&&n!==void 0&&(s=pt(n===null?void 0:n,{owner:this}),this.addValue(t,s)),s}readValue(t,n){let s=this.latestValues[t]!==void 0||!this.current?this.latestValues[t]:this.getBaseTargetFromProps(this.props,t)??this.readValueFromInstance(this.current,t,this.options);return s!=null&&(typeof s=="string"&&(rr(s)||lr(s))?s=parseFloat(s):!yh(s)&&je.test(n)&&(s=Zr(t,n)),this.setBaseTarget(t,fe(s)?s.get():s)),fe(s)?s.get():s}setBaseTarget(t,n){this.baseTarget[t]=n}getBaseTarget(t){const{initial:n}=this.props;let s;if(typeof n=="string"||typeof n=="object"){const r=Js(this.props,n,this.presenceContext?.custom);r&&(s=r[t])}if(n&&s!==void 0)return s;const i=this.getBaseTargetFromProps(this.props,t);return i!==void 0&&!fe(i)?i:this.initialValues[t]!==void 0&&s===void 0?void 0:this.baseTarget[t]}on(t,n){return this.events[t]||(this.events[t]=new Fs),this.events[t].add(n)}notify(t,...n){this.events[t]&&this.events[t].notify(...n)}scheduleRenderMicrotask(){ni.render(this.render)}}class aa extends Th{constructor(){super(...arguments),this.KeyframeResolver=Yd}sortInstanceNodePosition(t,n){return t.compareDocumentPosition(n)&2?1:-1}getBaseTargetFromProps(t,n){const s=t.style;return s?s[n]:void 0}removeValueFromRenderState(t,{vars:n,style:s}){delete n[t],delete s[t]}handleChildMotionValue(){this.childSubscription&&(this.childSubscription(),delete this.childSubscription);const{children:t}=this.props;fe(t)&&(this.childSubscription=t.on("change",n=>{this.current&&(this.current.textContent=`${n}`)}))}}class Ke{constructor(t){this.isMounted=!1,this.node=t}update(){}}function la({top:e,left:t,right:n,bottom:s}){return{x:{min:t,max:n},y:{min:e,max:s}}}function Sh({x:e,y:t}){return{top:t.min,right:e.max,bottom:t.max,left:e.min}}function Ch(e,t){if(!t)return e;const n=t({x:e.left,y:e.top}),s=t({x:e.right,y:e.bottom});return{top:n.y,left:n.x,bottom:s.y,right:s.x}}function Fn(e){return e===void 0||e===1}function Cs({scale:e,scaleX:t,scaleY:n}){return!Fn(e)||!Fn(t)||!Fn(n)}function Xe(e){return Cs(e)||ca(e)||e.z||e.rotate||e.rotateX||e.rotateY||e.skewX||e.skewY}function ca(e){return Gi(e.x)||Gi(e.y)}function Gi(e){return e&&e!=="0%"}function bn(e,t,n){const s=e-n,i=t*s;return n+i}function Ki(e,t,n,s,i){return i!==void 0&&(e=bn(e,i,s)),bn(e,n,s)+t}function As(e,t=0,n=1,s,i){e.min=Ki(e.min,t,n,s,i),e.max=Ki(e.max,t,n,s,i)}function da(e,{x:t,y:n}){As(e.x,t.translate,t.scale,t.originPoint),As(e.y,n.translate,n.scale,n.originPoint)}const Qi=.999999999999,qi=1.0000000000001;function Ah(e,t,n,s=!1){const i=n.length;if(!i)return;t.x=t.y=1;let r,o;for(let a=0;a<i;a++){r=n[a],o=r.projectionDelta;const{visualElement:c}=r.options;c&&c.props.style&&c.props.style.display==="contents"||(s&&r.options.layoutScroll&&r.scroll&&r!==r.root&&(Ve(e.x,-r.scroll.offset.x),Ve(e.y,-r.scroll.offset.y)),o&&(t.x*=o.x.scale,t.y*=o.y.scale,da(e,o)),s&&Xe(r.latestValues)&&cn(e,r.latestValues,r.layout?.layoutBox))}t.x<qi&&t.x>Qi&&(t.x=1),t.y<qi&&t.y>Qi&&(t.y=1)}function Ve(e,t){e.min+=t,e.max+=t}function Xi(e,t,n,s,i=.5){const r=J(e.min,e.max,i);As(e,t,n,r,s)}function Yi(e,t){return typeof e=="string"?parseFloat(e)/100*(t.max-t.min):e}function cn(e,t,n){const s=n??e;Xi(e.x,Yi(t.x,s.x),t.scaleX,t.scale,t.originX),Xi(e.y,Yi(t.y,s.y),t.scaleY,t.scale,t.originY)}function ha(e,t){return la(Ch(e.getBoundingClientRect(),t))}function Ph(e,t,n){const s=ha(e,n),{scroll:i}=t;return i&&(Ve(s.x,i.offset.x),Ve(s.y,i.offset.y)),s}const Eh={x:"translateX",y:"translateY",z:"translateZ",transformPerspective:"perspective"},Mh=gt.length;function Dh(e,t,n){let s="",i=!0;for(let o=0;o<Mh;o++){const a=gt[o],c=e[a];if(c===void 0)continue;let l=!0;if(typeof c=="number")l=c===(a.startsWith("scale")?1:0);else{const d=parseFloat(c);l=a.startsWith("scale")?d===1:d===0}if(!l||n){const d=Ts(c,yn[a]);if(!l){i=!1;const f=Eh[a]||a;s+=`${f}(${d}) `}n&&(t[a]=d)}}const r=e.pathRotation;return r&&(i=!1,s+=`rotate(${Ts(r,yn.pathRotation)}) `),s=s.trim(),n?s=n(t,i?"":s):i&&(s="none"),s}function ai(e,t,n){const{style:s,vars:i,transformOrigin:r}=e;let o=!1,a=!1;for(const c in t){const l=t[c];if(yt.has(c)){o=!0;continue}else if(Tr(c)){i[c]=l;continue}else{const d=Ts(l,yn[c]);c.startsWith("origin")?(a=!0,r[c]=d):s[c]=d}}if(t.transform||(o||n?s.transform=Dh(t,e.transform,n):s.transform&&(s.transform="none")),a){const{originX:c="50%",originY:l="50%",originZ:d=0}=r;s.transformOrigin=`${c} ${l} ${d}`}}function ua(e,{style:t,vars:n},s,i){const r=e.style;let o;for(o in t)r[o]=t[o];i?.applyProjectionStyles(r,s);for(o in n)r.setProperty(o,n[o])}function Zi(e,t){return t.max===t.min?0:e/(t.max-t.min)*100}const wt={correct:(e,t)=>{if(!t.target)return e;if(typeof e=="string")if(N.test(e))e=parseFloat(e);else return e;const n=Zi(e,t.target.x),s=Zi(e,t.target.y);return`${n}% ${s}%`}},Oh={correct:(e,{treeScale:t,projectionDelta:n})=>{const s=e,i=je.parse(e);if(i.length>5)return s;const r=je.createTransformer(e),o=typeof i[0]!="number"?1:0,a=n.x.scale*t.x,c=n.y.scale*t.y;i[0+o]/=a,i[1+o]/=c;const l=J(a,c,.5);return typeof i[2+o]=="number"&&(i[2+o]/=l),typeof i[3+o]=="number"&&(i[3+o]/=l),r(i)}},Ps={borderRadius:{...wt,applyTo:[...ti]},borderTopLeftRadius:wt,borderTopRightRadius:wt,borderBottomLeftRadius:wt,borderBottomRightRadius:wt,boxShadow:Oh};function fa(e,{layout:t,layoutId:n}){return yt.has(e)||e.startsWith("origin")||(t||n!==void 0)&&(!!Ps[e]||e==="opacity")}function li(e,t,n){const s=e.style,i=t?.style,r={};if(!s)return r;for(const o in s)(fe(s[o])||i&&fe(i[o])||fa(o,e)||n?.getValue(o)?.liveStyle!==void 0)&&(r[o]=s[o]);return r}function Rh(e){return window.getComputedStyle(e)}class jh extends aa{constructor(){super(...arguments),this.type="html",this.renderInstance=ua}mount(t){Tn(!!t.style),super.mount(t)}readValueFromInstance(t,n){if(yt.has(n))return this.projection?.isProjecting?us(n):Zc(t,n);{const s=Rh(t),i=(Tr(n)?s.getPropertyValue(n):s[n])||0;return typeof i=="string"?i.trim():i}}measureInstanceViewportBox(t,{transformPagePoint:n}){return ha(t,n)}build(t,n,s){ai(t,n,s.transformTemplate)}scrapeMotionValuesFromProps(t,n,s){return li(t,n,s)}}const Lh={offset:"stroke-dashoffset",array:"stroke-dasharray"},Nh={offset:"strokeDashoffset",array:"strokeDasharray"};function Vh(e,t,n=1,s=0,i=!0){e.pathLength=1;const r=i?Lh:Nh;e[r.offset]=`${-s}`,e[r.array]=`${t} ${n}`}const pa=["transform","opacity","offsetDistance","offsetPath","offsetRotate","offsetAnchor"];function ma(e,{attrX:t,attrY:n,attrScale:s,pathLength:i,pathSpacing:r=1,pathOffset:o=0,...a},c,l,d){if(ai(e,a,l),c){e.style.viewBox&&(e.attrs.viewBox=e.style.viewBox);return}e.attrs=e.style,e.style={};const{attrs:f,style:u}=e;for(const m of pa)f[m]!==void 0&&(u[m]=f[m],delete f[m]);(u.transform||f.transformOrigin)&&(u.transformOrigin=f.transformOrigin??"50% 50%",delete f.transformOrigin),u.transform&&(u.transformBox=d?.transformBox??"fill-box",delete f.transformBox),t!==void 0&&(f.x=t),n!==void 0&&(f.y=n),s!==void 0&&(f.scale=s),i!==void 0&&Vh(f,i,r,o,!1)}const ga=new Set(["baseFrequency","diffuseConstant","kernelMatrix","kernelUnitLength","keySplines","keyTimes","limitingConeAngle","markerHeight","markerWidth","numOctaves","targetX","targetY","surfaceScale","specularConstant","specularExponent","stdDeviation","tableValues","viewBox","gradientTransform","pathLength","startOffset","textLength","lengthAdjust"]),ya=e=>typeof e=="string"&&e.toLowerCase()==="svg";function Ih(e,t,n,s){ua(e,t,void 0,s);for(const i in t.attrs)e.setAttribute(ga.has(i)?i:ei(i),t.attrs[i])}function wa(e,t,n){const s=li(e,t,n);for(const i in e)if(fe(e[i])||fe(t[i])){const r=gt.indexOf(i)!==-1?"attr"+i.charAt(0).toUpperCase()+i.substring(1):i;s[r]=e[i]}return s}class Bh extends aa{constructor(){super(...arguments),this.type="svg",this.isSVGTag=!1,this.measureInstanceViewportBox=ce}getBaseTargetFromProps(t,n){return t[n]}readValueFromInstance(t,n){if(yt.has(n)){const s=Yr(n);return s&&s.default||0}if(pa.includes(n)){const i=getComputedStyle(t)[n];if(typeof i=="string"&&i)return i.trim()}return n=ga.has(n)?n:ei(n),t.getAttribute(n)}scrapeMotionValuesFromProps(t,n,s){return wa(t,n,s)}build(t,n,s){ma(t,n,this.isSVGTag,s.transformTemplate,s.style)}renderInstance(t,n,s,i){Ih(t,n,s,i)}mount(t){this.isSVGTag=ya(t.tagName),super.mount(t)}}const $h=ri.length;function ba(e){if(!e)return;if(!e.isControllingVariants){const n=e.parent?ba(e.parent)||{}:{};return e.props.initial!==void 0&&(n.initial=e.props.initial),n}const t={};for(let n=0;n<$h;n++){const s=ri[n],i=e.props[s];(jt(i)||i===!1)&&(t[s]=i)}return t}function xa(e,t){if(!Array.isArray(t))return!1;const n=t.length;if(n!==e.length)return!1;for(let s=0;s<n;s++)if(t[s]!==e[s])return!1;return!0}const Fh=[...oi].reverse(),_h=oi.length;function Hh(e){return t=>Promise.all(t.map(({animation:n,options:s})=>Fd(e,n,s)))}function Wh(e){let t=Hh(e),n=Ji(),s=!0,i=!1;const r=l=>(d,f)=>{const u=et(e,f,l==="exit"?e.presenceContext?.custom:void 0);if(u){const{transition:m,transitionEnd:g,...b}=u;d={...d,...b,...g}}return d};function o(l){t=l(e)}function a(l){const{props:d}=e,f=ba(e.parent)||{},u=[],m=new Set;let g={},b=1/0;for(let x=0;x<_h;x++){const S=Fh[x],v=n[S],w=d[S]!==void 0?d[S]:f[S],k=jt(w),A=S===l?v.isActive:null;A===!1&&(b=x);let C=w===f[S]&&w!==d[S]&&k;if(C&&(s||i)&&e.manuallyAnimateOnMount&&(C=!1),v.protectedKeys={...g},!v.isActive&&A===null||!w&&!v.prevProp||Cn(w)||typeof w=="boolean")continue;if(S==="exit"&&v.isActive&&A!==!0){v.prevResolvedValues&&(g={...g,...v.prevResolvedValues});continue}const E=zh(v.prevProp,w);let L=E||S===l&&v.isActive&&!C&&k||x>b&&k,K=!1;const W=Array.isArray(w)?w:[w];let I=W.reduce(r(S),{});A===!1&&(I={});const{prevResolvedValues:O={}}=v,B={...O,...I},Y=R=>{L=!0,m.has(R)&&(K=!0,m.delete(R)),v.needsAnimating[R]=!0;const $=e.getValue(R);$&&($.liveStyle=!1)};for(const R in B){const $=I[R],M=O[R];if(g.hasOwnProperty(R))continue;let q=!1;ws($)&&ws(M)?q=!xa($,M)||E:q=$!==M,q?$!=null?Y(R):m.add(R):$!==void 0&&m.has(R)?Y(R):v.protectedKeys[R]=!0}v.prevProp=w,v.prevResolvedValues=I,v.isActive&&(g={...g,...I}),(s||i)&&e.blockInitialAnimation&&(L=!1);const te=C&&E;L&&(!te||K)&&u.push(...W.map(R=>{const $={type:S};if(typeof R=="string"&&(s||i)&&!te&&e.manuallyAnimateOnMount&&e.parent){const{parent:M}=e,q=et(M,R);if(M.enteringChildren&&q){const{delayChildren:pe}=q.transition||{};$.delay=Hr(M.enteringChildren,e,pe)}}return{animation:R,options:$}}))}if(m.size){const x={};if(typeof d.initial!="boolean"){const S=et(e,Array.isArray(d.initial)?d.initial[0]:d.initial);S&&S.transition&&(x.transition=S.transition)}m.forEach(S=>{const v=e.getBaseTarget(S),w=e.getValue(S);w&&(w.liveStyle=!0),x[S]=v??null}),u.push({animation:x})}let y=!!u.length;return s&&(d.initial===!1||d.initial===d.animate)&&!e.manuallyAnimateOnMount&&(y=!1),s=!1,i=!1,y?t(u):Promise.resolve()}function c(l,d){if(n[l].isActive===d)return Promise.resolve();e.variantChildren?.forEach(u=>u.animationState?.setActive(l,d)),n[l].isActive=d;const f=a(l);for(const u in n)n[u].protectedKeys={};return f}return{animateChanges:a,setActive:c,setAnimateFunction:o,getState:()=>n,reset:()=>{n=Ji(),i=!0}}}function zh(e,t){return typeof t=="string"?t!==e:Array.isArray(t)?!xa(t,e):!1}function qe(e=!1){return{isActive:e,protectedKeys:{},needsAnimating:{},prevResolvedValues:{}}}function Ji(){return{animate:qe(!0),whileInView:qe(),whileHover:qe(),whileTap:qe(),whileDrag:qe(),whileFocus:qe(),exit:qe()}}function Es(e,t){e.min=t.min,e.max=t.max}function Oe(e,t){Es(e.x,t.x),Es(e.y,t.y)}function eo(e,t){e.translate=t.translate,e.scale=t.scale,e.originPoint=t.originPoint,e.origin=t.origin}const va=1e-4,Uh=1-va,Gh=1+va,ka=.01,Kh=0-ka,Qh=0+ka;function be(e){return e.max-e.min}function qh(e,t,n){return Math.abs(e-t)<=n}function to(e,t,n,s=.5){e.origin=s,e.originPoint=J(t.min,t.max,e.origin),e.scale=be(n)/be(t),e.translate=J(n.min,n.max,e.origin)-e.originPoint,(e.scale>=Uh&&e.scale<=Gh||isNaN(e.scale))&&(e.scale=1),(e.translate>=Kh&&e.translate<=Qh||isNaN(e.translate))&&(e.translate=0)}function At(e,t,n,s){to(e.x,t.x,n.x,s?s.originX:void 0),to(e.y,t.y,n.y,s?s.originY:void 0)}function no(e,t,n,s=0){const i=s?J(n.min,n.max,s):n.min;e.min=i+t.min,e.max=e.min+be(t)}function Xh(e,t,n,s){no(e.x,t.x,n.x,s?.x),no(e.y,t.y,n.y,s?.y)}function so(e,t,n,s=0){const i=s?J(n.min,n.max,s):n.min;e.min=t.min-i,e.max=e.min+be(t)}function xn(e,t,n,s){so(e.x,t.x,n.x,s?.x),so(e.y,t.y,n.y,s?.y)}function io(e,t,n,s,i){return e-=t,e=bn(e,1/n,s),i!==void 0&&(e=bn(e,1/i,s)),e}function Yh(e,t=0,n=1,s=.5,i,r=e,o=e){if(Be.test(t)&&(t=parseFloat(t),t=J(o.min,o.max,t/100)-o.min),typeof t!="number")return;let a=J(r.min,r.max,s);e===r&&(a-=t),e.min=io(e.min,t,n,a,i),e.max=io(e.max,t,n,a,i)}function oo(e,t,[n,s,i],r,o){Yh(e,t[n],t[s],t[i],t.scale,r,o)}const Zh=["x","scaleX","originX"],Jh=["y","scaleY","originY"];function ro(e,t,n,s){oo(e.x,t,Zh,n?n.x:void 0,s?s.x:void 0),oo(e.y,t,Jh,n?n.y:void 0,s?s.y:void 0)}function ao(e){return e.translate===0&&e.scale===1}function Ta(e){return ao(e.x)&&ao(e.y)}function lo(e,t){return e.min===t.min&&e.max===t.max}function eu(e,t){return lo(e.x,t.x)&&lo(e.y,t.y)}function co(e,t){return Math.round(e.min)===Math.round(t.min)&&Math.round(e.max)===Math.round(t.max)}function Sa(e,t){return co(e.x,t.x)&&co(e.y,t.y)}function ho(e){return be(e.x)/be(e.y)}function uo(e,t){return e.translate===t.translate&&e.scale===t.scale&&e.originPoint===t.originPoint}function Ne(e){return[e("x"),e("y")]}function tu(e,t,n){let s="";const i=e.x.translate/t.x,r=e.y.translate/t.y,o=n?.z||0;if((i||r||o)&&(s=`translate3d(${i}px, ${r}px, ${o}px) `),(t.x!==1||t.y!==1)&&(s+=`scale(${1/t.x}, ${1/t.y}) `),n){const{transformPerspective:l,rotate:d,pathRotation:f,rotateX:u,rotateY:m,skewX:g,skewY:b}=n;l&&(s=`perspective(${l}px) ${s}`),d&&(s+=`rotate(${d}deg) `),f&&(s+=`rotate(${f}deg) `),u&&(s+=`rotateX(${u}deg) `),m&&(s+=`rotateY(${m}deg) `),g&&(s+=`skewX(${g}deg) `),b&&(s+=`skewY(${b}deg) `)}const a=e.x.scale*t.x,c=e.y.scale*t.y;return(a!==1||c!==1)&&(s+=`scale(${a}, ${c})`),s||"none"}const nu=ti.length,fo=e=>typeof e=="string"?parseFloat(e):e,po=e=>typeof e=="number"||N.test(e);function su(e,t,n,s,i,r){i?(e.opacity=J(0,n.opacity??1,iu(s)),e.opacityExit=J(t.opacity??1,0,ou(s))):r&&(e.opacity=J(t.opacity??1,n.opacity??1,s));for(let o=0;o<nu;o++){const a=ti[o];let c=mo(t,a),l=mo(n,a);if(c===void 0&&l===void 0)continue;c||(c=0),l||(l=0),c===0||l===0||po(c)===po(l)?(e[a]=Math.max(J(fo(c),fo(l),s),0),(Be.test(l)||Be.test(c))&&(e[a]+="%")):e[a]=l}(t.rotate||n.rotate)&&(e.rotate=J(t.rotate||0,n.rotate||0,s))}function mo(e,t){return e[t]!==void 0?e[t]:e.borderRadius}const iu=Ca(0,.5,yr),ou=Ca(.5,.95,Pe);function Ca(e,t,n){return s=>s<e?0:s>t?1:n(Ot(e,t,s))}function ru(e,t,n){const s=fe(e)?e:pt(e);return s.start(Zs("",s,t,n)),s.animation}function Lt(e,t,n,s={passive:!0}){return e.addEventListener(t,n,s),()=>e.removeEventListener(t,n,s)}const au=(e,t)=>e.depth-t.depth;class lu{constructor(){this.children=[],this.isDirty=!1}add(t){$s(this.children,t),this.isDirty=!0}remove(t){fn(this.children,t),this.isDirty=!0}forEach(t){this.isDirty&&this.children.sort(au),this.isDirty=!1,this.children.forEach(t)}}function cu(e,t){const n=we.now(),s=({timestamp:i})=>{const r=i-n;r>=t&&(Ge(s),e(r-t))};return ee.setup(s,!0),()=>Ge(s)}function dn(e){return fe(e)?e.get():e}class du{constructor(){this.members=[]}add(t){$s(this.members,t);for(let n=this.members.length-1;n>=0;n--){const s=this.members[n];if(s===t||s===this.lead||s===this.prevLead)continue;const i=s.instance;(!i||i.isConnected===!1)&&!s.snapshot&&(fn(this.members,s),s.unmount())}t.scheduleRender()}remove(t){if(fn(this.members,t),t===this.prevLead&&(this.prevLead=void 0),t===this.lead){const n=this.members[this.members.length-1];n&&this.promote(n)}}relegate(t){for(let n=this.members.indexOf(t)-1;n>=0;n--){const s=this.members[n];if(s.isPresent!==!1&&s.instance?.isConnected!==!1)return this.promote(s),!0}return!1}promote(t,n){const s=this.lead;if(t!==s&&(this.prevLead=s,this.lead=t,t.show(),s)){s.updateSnapshot(),t.scheduleRender();const{layoutDependency:i}=s.options,{layoutDependency:r}=t.options;(i===void 0||i!==r)&&(t.resumeFrom=s,n&&(s.preserveOpacity=!0),s.snapshot&&(t.snapshot=s.snapshot,t.snapshot.latestValues=s.animationValues||s.latestValues),t.root?.isUpdating&&(t.isLayoutDirty=!0)),t.options.crossfade===!1&&s.hide()}}exitAnimationComplete(){this.members.forEach(t=>{t.options.onExitComplete?.(),t.resumingFrom?.options.onExitComplete?.()})}scheduleRender(){this.members.forEach(t=>t.instance&&t.scheduleRender(!1))}removeLeadSnapshot(){this.lead?.snapshot&&(this.lead.snapshot=void 0)}}const hn={hasAnimatedSinceResize:!0,hasEverUpdated:!1},_n=["","X","Y","Z"],hu=1e3;let uu=0;function Hn(e,t,n,s){const{latestValues:i}=t;i[e]&&(n[e]=i[e],t.setStaticValue(e,0),s&&(s[e]=0))}function Aa(e){if(e.hasCheckedOptimisedAppear=!0,e.root===e)return;const{visualElement:t}=e.options;if(!t)return;const n=Kr(t);if(window.MotionHasOptimisedAnimation(n,"transform")){const{layout:i,layoutId:r}=e.options;window.MotionCancelOptimisedAnimation(n,"transform",ee,!(i||r))}const{parent:s}=e;s&&!s.hasCheckedOptimisedAppear&&Aa(s)}function Pa({attachResizeListener:e,defaultParent:t,measureScroll:n,checkIsScrollRoot:s,resetTransform:i}){return class{constructor(o={},a=t?.()){this.id=uu++,this.animationId=0,this.animationCommitId=0,this.children=new Set,this.options={},this.isTreeAnimating=!1,this.isAnimationBlocked=!1,this.isLayoutDirty=!1,this.isProjectionDirty=!1,this.isSharedProjectionDirty=!1,this.isTransformDirty=!1,this.updateManuallyBlocked=!1,this.updateBlockedByResize=!1,this.isUpdating=!1,this.isSVG=!1,this.needsReset=!1,this.shouldResetTransform=!1,this.hasCheckedOptimisedAppear=!1,this.treeScale={x:1,y:1},this.eventHandlers=new Map,this.hasTreeAnimated=!1,this.layoutVersion=0,this.updateScheduled=!1,this.scheduleUpdate=()=>this.update(),this.projectionUpdateScheduled=!1,this.checkUpdateFailed=()=>{this.isUpdating&&(this.isUpdating=!1,this.clearAllSnapshots())},this.updateProjection=()=>{this.projectionUpdateScheduled=!1,this.nodes.forEach(mu),this.nodes.forEach(vu),this.nodes.forEach(ku),this.nodes.forEach(gu)},this.resolvedRelativeTargetAt=0,this.linkedParentVersion=0,this.hasProjected=!1,this.isVisible=!0,this.animationProgress=0,this.sharedNodes=new Map,this.latestValues=o,this.root=a?a.root||a:this,this.path=a?[...a.path,a]:[],this.parent=a,this.depth=a?a.depth+1:0;for(let c=0;c<this.path.length;c++)this.path[c].shouldResetTransform=!0;this.root===this&&(this.nodes=new lu)}addEventListener(o,a){return this.eventHandlers.has(o)||this.eventHandlers.set(o,new Fs),this.eventHandlers.get(o).add(a)}notifyListeners(o,...a){const c=this.eventHandlers.get(o);c&&c.notify(...a)}hasListeners(o){return this.eventHandlers.has(o)}mount(o){if(this.instance)return;this.isSVG=ii(o)&&!mh(o),this.instance=o;const{layoutId:a,layout:c,visualElement:l}=this.options;if(l&&!l.current&&l.mount(o),this.root.nodes.add(this),this.parent&&this.parent.children.add(this),this.root.hasTreeAnimated&&(c||a)&&(this.isLayoutDirty=!0),e){let d,f=0;const u=()=>this.root.updateBlockedByResize=!1;ee.read(()=>{f=window.innerWidth}),e(o,()=>{const m=window.innerWidth;m!==f&&(f=m,this.root.updateBlockedByResize=!0,d&&d(),d=cu(u,250),hn.hasAnimatedSinceResize&&(hn.hasAnimatedSinceResize=!1,this.nodes.forEach(wo)))})}a&&this.root.registerSharedNode(a,this),this.options.animate!==!1&&l&&(a||c)&&this.addEventListener("didUpdate",({delta:d,hasLayoutChanged:f,hasRelativeLayoutChanged:u,layout:m})=>{if(this.isTreeAnimationBlocked()){this.target=void 0,this.relativeTarget=void 0;return}const g=this.options.transition||l.getDefaultTransition()||Pu,{onLayoutAnimationStart:b,onLayoutAnimationComplete:y}=l.getProps(),x=!this.targetLayout||!Sa(this.targetLayout,m),S=!f&&u;if(this.options.layoutRoot||this.resumeFrom||S||f&&(x||!this.currentAnimation)){this.resumeFrom&&(this.resumingFrom=this.resumeFrom,this.resumingFrom.resumingFrom=void 0);const v={...Ys(g,"layout"),onPlay:b,onComplete:y};(l.shouldReduceMotion||this.options.layoutRoot)&&(v.delay=0,v.type=!1),this.startAnimation(v),this.setAnimationOrigin(d,S,v.path)}else f||wo(this),this.isLead()&&this.options.onExitComplete&&this.options.onExitComplete();this.targetLayout=m})}unmount(){this.options.layoutId&&this.willUpdate(),this.root.nodes.remove(this);const o=this.getStack();o&&o.remove(this),this.parent&&this.parent.children.delete(this),this.instance=void 0,this.eventHandlers.clear(),Ge(this.updateProjection)}blockUpdate(){this.updateManuallyBlocked=!0}unblockUpdate(){this.updateManuallyBlocked=!1}isUpdateBlocked(){return this.updateManuallyBlocked||this.updateBlockedByResize}isTreeAnimationBlocked(){return this.isAnimationBlocked||this.parent&&this.parent.isTreeAnimationBlocked()||!1}startUpdate(){this.isUpdateBlocked()||(this.isUpdating=!0,this.nodes&&this.nodes.forEach(Tu),this.animationId++)}getTransformTemplate(){const{visualElement:o}=this.options;return o&&o.getProps().transformTemplate}willUpdate(o=!0){if(this.root.hasTreeAnimated=!0,this.root.isUpdateBlocked()){this.options.onExitComplete&&this.options.onExitComplete();return}if(window.MotionCancelOptimisedAnimation&&!this.hasCheckedOptimisedAppear&&Aa(this),!this.root.isUpdating&&this.root.startUpdate(),this.isLayoutDirty)return;this.isLayoutDirty=!0;for(let d=0;d<this.path.length;d++){const f=this.path[d];f.shouldResetTransform=!0,(typeof f.latestValues.x=="string"||typeof f.latestValues.y=="string")&&(f.isLayoutDirty=!0),f.updateScroll("snapshot"),f.options.layoutRoot&&f.willUpdate(!1)}const{layoutId:a,layout:c}=this.options;if(a===void 0&&!c)return;const l=this.getTransformTemplate();this.prevTransformTemplateValue=l?l(this.latestValues,""):void 0,this.updateSnapshot(),o&&this.notifyListeners("willUpdate")}update(){if(this.updateScheduled=!1,this.isUpdateBlocked()){const c=this.updateBlockedByResize;this.unblockUpdate(),this.updateBlockedByResize=!1,this.clearAllSnapshots(),c&&this.nodes.forEach(wu),this.nodes.forEach(go);return}if(this.animationId<=this.animationCommitId){this.nodes.forEach(yo);return}this.animationCommitId=this.animationId,this.isUpdating?(this.isUpdating=!1,this.nodes.forEach(bu),this.nodes.forEach(xu),this.nodes.forEach(fu),this.nodes.forEach(pu)):this.nodes.forEach(yo),this.clearAllSnapshots();const a=we.now();ue.delta=$e(0,1e3/60,a-ue.timestamp),ue.timestamp=a,ue.isProcessing=!0,jn.update.process(ue),jn.preRender.process(ue),jn.render.process(ue),ue.isProcessing=!1}didUpdate(){this.updateScheduled||(this.updateScheduled=!0,ni.read(this.scheduleUpdate))}clearAllSnapshots(){this.nodes.forEach(yu),this.sharedNodes.forEach(Su)}scheduleUpdateProjection(){this.projectionUpdateScheduled||(this.projectionUpdateScheduled=!0,ee.preRender(this.updateProjection,!1,!0))}scheduleCheckAfterUnmount(){ee.postRender(()=>{this.isLayoutDirty?this.root.didUpdate():this.root.checkUpdateFailed()})}updateSnapshot(){this.snapshot||!this.instance||(this.snapshot=this.measure(),this.snapshot&&!be(this.snapshot.measuredBox.x)&&!be(this.snapshot.measuredBox.y)&&(this.snapshot=void 0))}updateLayout(){if(!this.instance||(this.updateScroll(),!(this.options.alwaysMeasureLayout&&this.isLead())&&!this.isLayoutDirty))return;if(this.resumeFrom&&!this.resumeFrom.instance)for(let c=0;c<this.path.length;c++)this.path[c].updateScroll();const o=this.layout;this.layout=this.measure(!1),this.layoutVersion++,this.layoutCorrected||(this.layoutCorrected=ce()),this.isLayoutDirty=!1,this.projectionDelta=void 0,this.notifyListeners("measure",this.layout.layoutBox);const{visualElement:a}=this.options;a&&a.notify("LayoutMeasure",this.layout.layoutBox,o?o.layoutBox:void 0)}updateScroll(o="measure"){let a=!!(this.options.layoutScroll&&this.instance);if(this.scroll&&this.scroll.animationId===this.root.animationId&&this.scroll.phase===o&&(a=!1),a&&this.instance){const c=s(this.instance);this.scroll={animationId:this.root.animationId,phase:o,isRoot:c,offset:n(this.instance),wasRoot:this.scroll?this.scroll.isRoot:c}}}resetTransform(){if(!i)return;const o=this.isLayoutDirty||this.shouldResetTransform||this.options.alwaysMeasureLayout,a=this.projectionDelta&&!Ta(this.projectionDelta),c=this.getTransformTemplate(),l=c?c(this.latestValues,""):void 0,d=l!==this.prevTransformTemplateValue;o&&this.instance&&(a||Xe(this.latestValues)||d)&&(i(this.instance,l),this.shouldResetTransform=!1,this.scheduleRender())}measure(o=!0){const a=this.measurePageBox();let c=this.removeElementScroll(a);return o&&(c=this.removeTransform(c)),Eu(c),{animationId:this.root.animationId,measuredBox:a,layoutBox:c,latestValues:{},source:this.id}}measurePageBox(){const{visualElement:o}=this.options;if(!o)return ce();const a=o.measureViewportBox();if(!(this.scroll?.wasRoot||this.path.some(Mu))){const{scroll:l}=this.root;l&&(Ve(a.x,l.offset.x),Ve(a.y,l.offset.y))}return a}removeElementScroll(o){const a=ce();if(Oe(a,o),this.scroll?.wasRoot)return a;for(let c=0;c<this.path.length;c++){const l=this.path[c],{scroll:d,options:f}=l;l!==this.root&&d&&f.layoutScroll&&(d.wasRoot&&Oe(a,o),Ve(a.x,d.offset.x),Ve(a.y,d.offset.y))}return a}applyTransform(o,a=!1,c){const l=c||ce();Oe(l,o);for(let d=0;d<this.path.length;d++){const f=this.path[d];!a&&f.options.layoutScroll&&f.scroll&&f!==f.root&&(Ve(l.x,-f.scroll.offset.x),Ve(l.y,-f.scroll.offset.y)),Xe(f.latestValues)&&cn(l,f.latestValues,f.layout?.layoutBox)}return Xe(this.latestValues)&&cn(l,this.latestValues,this.layout?.layoutBox),l}removeTransform(o){const a=ce();Oe(a,o);for(let c=0;c<this.path.length;c++){const l=this.path[c];if(!Xe(l.latestValues))continue;let d;l.instance&&(Cs(l.latestValues)&&l.updateSnapshot(),d=ce(),Oe(d,l.measurePageBox())),ro(a,l.latestValues,l.snapshot?.layoutBox,d)}return Xe(this.latestValues)&&ro(a,this.latestValues),a}setTargetDelta(o){this.targetDelta=o,this.root.scheduleUpdateProjection(),this.isProjectionDirty=!0}setOptions(o){this.options={...this.options,...o,crossfade:o.crossfade!==void 0?o.crossfade:!0}}clearMeasurements(){this.scroll=void 0,this.layout=void 0,this.snapshot=void 0,this.prevTransformTemplateValue=void 0,this.targetDelta=void 0,this.target=void 0,this.isLayoutDirty=!1}forceRelativeParentToResolveTarget(){this.relativeParent&&this.relativeParent.resolvedRelativeTargetAt!==ue.timestamp&&this.relativeParent.resolveTargetDelta(!0)}resolveTargetDelta(o=!1){const a=this.getLead();this.isProjectionDirty||(this.isProjectionDirty=a.isProjectionDirty),this.isTransformDirty||(this.isTransformDirty=a.isTransformDirty),this.isSharedProjectionDirty||(this.isSharedProjectionDirty=a.isSharedProjectionDirty);const c=!!this.resumingFrom||this!==a;if(!(o||c&&this.isSharedProjectionDirty||this.isProjectionDirty||this.parent?.isProjectionDirty||this.attemptToResolveRelativeTarget||this.root.updateBlockedByResize))return;const{layout:d,layoutId:f}=this.options;if(!this.layout||!(d||f))return;this.resolvedRelativeTargetAt=ue.timestamp;const u=this.getClosestProjectingParent();u&&this.linkedParentVersion!==u.layoutVersion&&!u.options.layoutRoot&&this.removeRelativeTarget(),!this.targetDelta&&!this.relativeTarget&&(this.options.layoutAnchor!==!1&&u&&u.layout?this.createRelativeTarget(u,this.layout.layoutBox,u.layout.layoutBox):this.removeRelativeTarget()),!(!this.relativeTarget&&!this.targetDelta)&&(this.target||(this.target=ce(),this.targetWithTransforms=ce()),this.relativeTarget&&this.relativeTargetOrigin&&this.relativeParent&&this.relativeParent.target?(this.forceRelativeParentToResolveTarget(),Xh(this.target,this.relativeTarget,this.relativeParent.target,this.options.layoutAnchor||void 0)):this.targetDelta?(this.resumingFrom?this.applyTransform(this.layout.layoutBox,!1,this.target):Oe(this.target,this.layout.layoutBox),da(this.target,this.targetDelta)):Oe(this.target,this.layout.layoutBox),this.attemptToResolveRelativeTarget&&(this.attemptToResolveRelativeTarget=!1,this.options.layoutAnchor!==!1&&u&&!!u.resumingFrom==!!this.resumingFrom&&!u.options.layoutScroll&&u.target&&this.animationProgress!==1?this.createRelativeTarget(u,this.target,u.target):this.relativeParent=this.relativeTarget=void 0))}getClosestProjectingParent(){if(!(!this.parent||Cs(this.parent.latestValues)||ca(this.parent.latestValues)))return this.parent.isProjecting()?this.parent:this.parent.getClosestProjectingParent()}isProjecting(){return!!((this.relativeTarget||this.targetDelta||this.options.layoutRoot)&&this.layout)}createRelativeTarget(o,a,c){this.relativeParent=o,this.linkedParentVersion=o.layoutVersion,this.forceRelativeParentToResolveTarget(),this.relativeTarget=ce(),this.relativeTargetOrigin=ce(),xn(this.relativeTargetOrigin,a,c,this.options.layoutAnchor||void 0),Oe(this.relativeTarget,this.relativeTargetOrigin)}removeRelativeTarget(){this.relativeParent=this.relativeTarget=void 0}calcProjection(){const o=this.getLead(),a=!!this.resumingFrom||this!==o;let c=!0;if((this.isProjectionDirty||this.parent?.isProjectionDirty)&&(c=!1),a&&(this.isSharedProjectionDirty||this.isTransformDirty)&&(c=!1),this.resolvedRelativeTargetAt===ue.timestamp&&(c=!1),c)return;const{layout:l,layoutId:d}=this.options;if(this.isTreeAnimating=!!(this.parent&&this.parent.isTreeAnimating||this.currentAnimation||this.pendingAnimation),this.isTreeAnimating||(this.targetDelta=this.relativeTarget=void 0),!this.layout||!(l||d))return;Oe(this.layoutCorrected,this.layout.layoutBox);const f=this.treeScale.x,u=this.treeScale.y;Ah(this.layoutCorrected,this.treeScale,this.path,a),o.layout&&!o.target&&(this.treeScale.x!==1||this.treeScale.y!==1)&&(o.target=o.layout.layoutBox,o.targetWithTransforms=ce());const{target:m}=o;if(!m){this.prevProjectionDelta&&(this.createProjectionDeltas(),this.scheduleRender());return}!this.projectionDelta||!this.prevProjectionDelta?this.createProjectionDeltas():(eo(this.prevProjectionDelta.x,this.projectionDelta.x),eo(this.prevProjectionDelta.y,this.projectionDelta.y)),At(this.projectionDelta,this.layoutCorrected,m,this.latestValues),(this.treeScale.x!==f||this.treeScale.y!==u||!uo(this.projectionDelta.x,this.prevProjectionDelta.x)||!uo(this.projectionDelta.y,this.prevProjectionDelta.y))&&(this.hasProjected=!0,this.scheduleRender(),this.notifyListeners("projectionUpdate",m))}hide(){this.isVisible=!1}show(){this.isVisible=!0}scheduleRender(o=!0){if(this.options.visualElement?.scheduleRender(),o){const a=this.getStack();a&&a.scheduleRender()}this.resumingFrom&&!this.resumingFrom.instance&&(this.resumingFrom=void 0)}createProjectionDeltas(){this.prevProjectionDelta=ut(),this.projectionDelta=ut(),this.projectionDeltaWithTransform=ut()}setAnimationOrigin(o,a=!1,c){const l=this.snapshot,d=l?l.latestValues:{},f={...this.latestValues},u=ut();(!this.relativeParent||!this.relativeParent.options.layoutRoot)&&(this.relativeTarget=this.relativeTargetOrigin=void 0),this.attemptToResolveRelativeTarget=!a;const m=ce(),g=l?l.source:void 0,b=this.layout?this.layout.source:void 0,y=g!==b,x=this.getStack(),S=!x||x.members.length<=1,v=!!(y&&!S&&this.options.crossfade===!0&&!this.path.some(Au));this.animationProgress=0;let w;const k=c?.interpolateProjection(o);this.mixTargetDelta=A=>{const C=A/1e3,E=k?.(C);E?(u.x.translate=E.x,u.x.scale=J(o.x.scale,1,C),u.x.origin=o.x.origin,u.x.originPoint=o.x.originPoint,u.y.translate=E.y,u.y.scale=J(o.y.scale,1,C),u.y.origin=o.y.origin,u.y.originPoint=o.y.originPoint):(bo(u.x,o.x,C),bo(u.y,o.y,C)),this.setTargetDelta(u),this.relativeTarget&&this.relativeTargetOrigin&&this.layout&&this.relativeParent&&this.relativeParent.layout&&(xn(m,this.layout.layoutBox,this.relativeParent.layout.layoutBox,this.options.layoutAnchor||void 0),Cu(this.relativeTarget,this.relativeTargetOrigin,m,C),w&&eu(this.relativeTarget,w)&&(this.isProjectionDirty=!1),w||(w=ce()),Oe(w,this.relativeTarget)),y&&(this.animationValues=f,su(f,d,this.latestValues,C,v,S)),E&&E.rotate!==void 0&&(this.animationValues||(this.animationValues=f),this.animationValues.pathRotation=E.rotate),this.root.scheduleUpdateProjection(),this.scheduleRender(),this.animationProgress=C},this.mixTargetDelta(this.options.layoutRoot?1e3:0)}startAnimation(o){this.notifyListeners("animationStart"),this.currentAnimation?.stop(),this.resumingFrom?.currentAnimation?.stop(),this.pendingAnimation&&(Ge(this.pendingAnimation),this.pendingAnimation=void 0),this.pendingAnimation=ee.update(()=>{hn.hasAnimatedSinceResize=!0,this.motionValue||(this.motionValue=pt(0)),this.motionValue.jump(0,!1),this.currentAnimation=ru(this.motionValue,[0,1e3],{...o,velocity:0,isSync:!0,onUpdate:a=>{this.mixTargetDelta(a),o.onUpdate&&o.onUpdate(a)},onComplete:()=>{o.onComplete&&o.onComplete(),this.completeAnimation()}}),this.resumingFrom&&(this.resumingFrom.currentAnimation=this.currentAnimation),this.pendingAnimation=void 0})}completeAnimation(){this.resumingFrom&&(this.resumingFrom.currentAnimation=void 0,this.resumingFrom.preserveOpacity=void 0);const o=this.getStack();o&&o.exitAnimationComplete(),this.resumingFrom=this.currentAnimation=this.animationValues=void 0,this.notifyListeners("animationComplete")}finishAnimation(){this.currentAnimation&&(this.mixTargetDelta&&this.mixTargetDelta(hu),this.currentAnimation.stop()),this.completeAnimation()}applyTransformsToTarget(){const o=this.getLead();let{targetWithTransforms:a,target:c,layout:l,latestValues:d}=o;if(!(!a||!c||!l)){if(this!==o&&this.layout&&l&&Ea(this.options.animationType,this.layout.layoutBox,l.layoutBox)){c=this.target||ce();const f=be(this.layout.layoutBox.x);c.x.min=o.target.x.min,c.x.max=c.x.min+f;const u=be(this.layout.layoutBox.y);c.y.min=o.target.y.min,c.y.max=c.y.min+u}Oe(a,c),cn(a,d),At(this.projectionDeltaWithTransform,this.layoutCorrected,a,d)}}registerSharedNode(o,a){this.sharedNodes.has(o)||this.sharedNodes.set(o,new du),this.sharedNodes.get(o).add(a);const l=a.options.initialPromotionConfig;a.promote({transition:l?l.transition:void 0,preserveFollowOpacity:l&&l.shouldPreserveFollowOpacity?l.shouldPreserveFollowOpacity(a):void 0})}isLead(){const o=this.getStack();return o?o.lead===this:!0}getLead(){const{layoutId:o}=this.options;return o?this.getStack()?.lead||this:this}getPrevLead(){const{layoutId:o}=this.options;return o?this.getStack()?.prevLead:void 0}getStack(){const{layoutId:o}=this.options;if(o)return this.root.sharedNodes.get(o)}promote({needsReset:o,transition:a,preserveFollowOpacity:c}={}){const l=this.getStack();l&&l.promote(this,c),o&&(this.projectionDelta=void 0,this.needsReset=!0),a&&this.setOptions({transition:a})}relegate(){const o=this.getStack();return o?o.relegate(this):!1}resetSkewAndRotation(){const{visualElement:o}=this.options;if(!o)return;let a=!1;const{latestValues:c}=o;if((c.z||c.rotate||c.rotateX||c.rotateY||c.rotateZ||c.skewX||c.skewY)&&(a=!0),!a)return;const l={};c.z&&Hn("z",o,l,this.animationValues);for(let d=0;d<_n.length;d++)Hn(`rotate${_n[d]}`,o,l,this.animationValues),Hn(`skew${_n[d]}`,o,l,this.animationValues);o.render();for(const d in l)o.setStaticValue(d,l[d]),this.animationValues&&(this.animationValues[d]=l[d]);o.scheduleRender()}applyProjectionStyles(o,a){if(!this.instance||this.isSVG)return;if(!this.isVisible){o.visibility="hidden";return}const c=this.getTransformTemplate();if(this.needsReset){this.needsReset=!1,o.visibility="",o.opacity="",o.pointerEvents=dn(a?.pointerEvents)||"",o.transform=c?c(this.latestValues,""):"none";return}const l=this.getLead();if(!this.projectionDelta||!this.layout||!l.target){this.options.layoutId&&(o.opacity=this.latestValues.opacity!==void 0?this.latestValues.opacity:1,o.pointerEvents=dn(a?.pointerEvents)||""),this.hasProjected&&!Xe(this.latestValues)&&(o.transform=c?c({},""):"none",this.hasProjected=!1);return}o.visibility="";const d=l.animationValues||l.latestValues;this.applyTransformsToTarget();let f=tu(this.projectionDeltaWithTransform,this.treeScale,d);c&&(f=c(d,f)),o.transform=f;const{x:u,y:m}=this.projectionDelta;o.transformOrigin=`${u.origin*100}% ${m.origin*100}% 0`,l.animationValues?o.opacity=l===this?d.opacity??this.latestValues.opacity??1:this.preserveOpacity?this.latestValues.opacity:d.opacityExit:o.opacity=l===this?d.opacity!==void 0?d.opacity:"":d.opacityExit!==void 0?d.opacityExit:0;for(const g in Ps){if(d[g]===void 0)continue;const{correct:b,applyTo:y,isCSSVariable:x}=Ps[g],S=f==="none"?d[g]:b(d[g],l);if(y){const v=y.length;for(let w=0;w<v;w++)o[y[w]]=S}else x?this.options.visualElement.renderState.vars[g]=S:o[g]=S}this.options.layoutId&&(o.pointerEvents=l===this?dn(a?.pointerEvents)||"":"none")}clearSnapshot(){this.resumeFrom=this.snapshot=void 0}resetTree(){this.root.nodes.forEach(o=>o.currentAnimation?.stop()),this.root.nodes.forEach(go),this.root.sharedNodes.clear()}}}function fu(e){e.updateLayout()}function pu(e){const t=e.resumeFrom?.snapshot||e.snapshot;if(e.isLead()&&e.layout&&t&&e.hasListeners("didUpdate")){const{layoutBox:n,measuredBox:s}=e.layout,{animationType:i}=e.options,r=t.source!==e.layout.source;if(i==="size")Ne(d=>{const f=r?t.measuredBox[d]:t.layoutBox[d],u=be(f);f.min=n[d].min,f.max=f.min+u});else if(i==="x"||i==="y"){const d=i==="x"?"y":"x";Es(r?t.measuredBox[d]:t.layoutBox[d],n[d])}else Ea(i,t.layoutBox,n)&&Ne(d=>{const f=r?t.measuredBox[d]:t.layoutBox[d],u=be(n[d]);f.max=f.min+u,e.relativeTarget&&!e.currentAnimation&&(e.isProjectionDirty=!0,e.relativeTarget[d].max=e.relativeTarget[d].min+u)});const o=ut();At(o,n,t.layoutBox);const a=ut();r?At(a,e.applyTransform(s,!0),t.measuredBox):At(a,n,t.layoutBox);const c=!Ta(o);let l=!1;if(!e.resumeFrom){const d=e.getClosestProjectingParent();if(d&&!d.resumeFrom){const{snapshot:f,layout:u}=d;if(f&&u){const m=e.options.layoutAnchor||void 0,g=ce();xn(g,t.layoutBox,f.layoutBox,m);const b=ce();xn(b,n,u.layoutBox,m),Sa(g,b)||(l=!0),d.options.layoutRoot&&(e.relativeTarget=b,e.relativeTargetOrigin=g,e.relativeParent=d)}}}e.notifyListeners("didUpdate",{layout:n,snapshot:t,delta:a,layoutDelta:o,hasLayoutChanged:c,hasRelativeLayoutChanged:l})}else if(e.isLead()){const{onExitComplete:n}=e.options;n&&n()}e.options.transition=void 0}function mu(e){e.parent&&(e.isProjecting()||(e.isProjectionDirty=e.parent.isProjectionDirty),e.isSharedProjectionDirty||(e.isSharedProjectionDirty=!!(e.isProjectionDirty||e.parent.isProjectionDirty||e.parent.isSharedProjectionDirty)),e.isTransformDirty||(e.isTransformDirty=e.parent.isTransformDirty))}function gu(e){e.isProjectionDirty=e.isSharedProjectionDirty=e.isTransformDirty=!1}function yu(e){e.clearSnapshot()}function go(e){e.clearMeasurements()}function wu(e){e.isLayoutDirty=!0,e.updateLayout()}function yo(e){e.isLayoutDirty=!1}function bu(e){e.isAnimationBlocked&&e.layout&&!e.isLayoutDirty&&(e.snapshot=e.layout,e.isLayoutDirty=!0)}function xu(e){const{visualElement:t}=e.options;t&&t.getProps().onBeforeLayoutMeasure&&t.notify("BeforeLayoutMeasure"),e.resetTransform()}function wo(e){e.finishAnimation(),e.targetDelta=e.relativeTarget=e.target=void 0,e.isProjectionDirty=!0}function vu(e){e.resolveTargetDelta()}function ku(e){e.calcProjection()}function Tu(e){e.resetSkewAndRotation()}function Su(e){e.removeLeadSnapshot()}function bo(e,t,n){e.translate=J(t.translate,0,n),e.scale=J(t.scale,1,n),e.origin=t.origin,e.originPoint=t.originPoint}function xo(e,t,n,s){e.min=J(t.min,n.min,s),e.max=J(t.max,n.max,s)}function Cu(e,t,n,s){xo(e.x,t.x,n.x,s),xo(e.y,t.y,n.y,s)}function Au(e){return e.animationValues&&e.animationValues.opacityExit!==void 0}const Pu={duration:.45,ease:[.4,0,.1,1]},vo=e=>typeof navigator<"u"&&navigator.userAgent&&navigator.userAgent.toLowerCase().includes(e),ko=vo("applewebkit/")&&!vo("chrome/")?Math.round:Pe;function To(e){e.min=ko(e.min),e.max=ko(e.max)}function Eu(e){To(e.x),To(e.y)}function Ea(e,t,n){return e==="position"||e==="preserve-aspect"&&!qh(ho(t),ho(n),.2)}function Mu(e){return e!==e.root&&e.scroll?.wasRoot}const Du=Pa({attachResizeListener:(e,t)=>Lt(e,"resize",t),measureScroll:()=>({x:document.documentElement.scrollLeft||document.body?.scrollLeft||0,y:document.documentElement.scrollTop||document.body?.scrollTop||0}),checkIsScrollRoot:()=>!0}),Wn={current:void 0},Ma=Pa({measureScroll:e=>({x:e.scrollLeft,y:e.scrollTop}),defaultParent:()=>{if(!Wn.current){const e=new Du({});e.mount(window),e.setOptions({layoutScroll:!0}),Wn.current=e}return Wn.current},resetTransform:(e,t)=>{e.style.transform=t!==void 0?t:"none"},checkIsScrollRoot:e=>window.getComputedStyle(e).position==="fixed"}),ci=p.createContext({transformPagePoint:e=>e,isStatic:!1,reducedMotion:"never"});function So(e,t){if(typeof e=="function")return e(t);e!=null&&(e.current=t)}function Ou(...e){return t=>{let n=!1;const s=e.map(i=>{const r=So(i,t);return!n&&typeof r=="function"&&(n=!0),r});if(n)return()=>{for(let i=0;i<s.length;i++){const r=s[i];typeof r=="function"?r():So(e[i],null)}}}}function Ru(...e){return p.useCallback(Ou(...e),e)}class ju extends p.Component{getSnapshotBeforeUpdate(t){const n=this.props.childRef.current;if(sn(n)&&t.isPresent&&!this.props.isPresent&&this.props.pop!==!1){const s=n.offsetParent,i=sn(s)&&s.offsetWidth||0,r=sn(s)&&s.offsetHeight||0,o=getComputedStyle(n),a=this.props.sizeRef.current;a.height=parseFloat(o.height),a.width=parseFloat(o.width),a.top=n.offsetTop,a.left=n.offsetLeft,a.right=i-a.width-a.left,a.bottom=r-a.height-a.top,a.direction=o.direction}return null}componentDidUpdate(){}render(){return this.props.children}}function Lu({children:e,isPresent:t,anchorX:n,anchorY:s,root:i,pop:r}){const o=p.useId(),a=p.useRef(null),c=p.useRef({width:0,height:0,top:0,left:0,right:0,bottom:0,direction:"ltr"}),{nonce:l}=p.useContext(ci),d=r!==!1?e.props?.ref??e?.ref:void 0,f=Ru(a,d);return p.useInsertionEffect(()=>{const{width:u,height:m,top:g,left:b,right:y,bottom:x,direction:S}=c.current;if(t||r===!1||!a.current||!u||!m)return;const v=S==="rtl",w=n==="left"?v?`right: ${y}`:`left: ${b}`:v?`left: ${b}`:`right: ${y}`,k=s==="bottom"?`bottom: ${x}`:`top: ${g}`;a.current.dataset.motionPopId=o;const A=document.createElement("style");l&&(A.nonce=l);const C=i??document.head;return C.appendChild(A),A.sheet&&A.sheet.insertRule(`
          [data-motion-pop-id="${o}"] {
            position: absolute !important;
            width: ${u}px !important;
            height: ${m}px !important;
            ${w}px !important;
            ${k}px !important;
          }
        `),()=>{a.current?.removeAttribute("data-motion-pop-id"),C.contains(A)&&C.removeChild(A)}},[t]),h.jsx(ju,{isPresent:t,childRef:a,sizeRef:c,pop:r,children:r===!1?e:p.cloneElement(e,{ref:f})})}const Nu=({children:e,initial:t,isPresent:n,onExitComplete:s,custom:i,presenceAffectsLayout:r,mode:o,anchorX:a,anchorY:c,root:l})=>{const d=Bs(Vu),f=p.useId(),u=p.useRef(n),m=p.useRef(s);un(()=>{u.current=n,m.current=s});let g=!0,b=p.useMemo(()=>(g=!1,{id:f,initial:t,isPresent:n,custom:i,onExitComplete:y=>{d.set(y,!0);for(const x of d.values())if(!x)return;s&&s()},register:y=>(d.set(y,!1),()=>{d.delete(y),!u.current&&!d.size&&m.current?.()})}),[n,d,s]);return r&&g&&(b={...b}),p.useMemo(()=>{d.forEach((y,x)=>d.set(x,!1))},[n]),p.useEffect(()=>{!n&&!d.size&&s&&s()},[n]),e=h.jsx(Lu,{pop:o==="popLayout",isPresent:n,anchorX:a,anchorY:c,root:l,children:e}),h.jsx(kn.Provider,{value:b,children:e})};function Vu(){return new Map}function Da(e=!0){const t=p.useContext(kn);if(t===null)return[!0,null];const{isPresent:n,onExitComplete:s,register:i}=t,r=p.useId();p.useEffect(()=>{if(e)return i(r)},[e]);const o=p.useCallback(()=>e&&s&&s(r),[r,s,e]);return!n&&s?[!1,o]:[!0]}const Gt=e=>e.key||"";function Co(e){const t=[];return p.Children.forEach(e,n=>{p.isValidElement(n)&&t.push(n)}),t}const Iu=({children:e,custom:t,initial:n=!0,onExitComplete:s,presenceAffectsLayout:i=!0,mode:r="sync",propagate:o=!1,anchorX:a="left",anchorY:c="top",root:l})=>{const[d,f]=Da(o),u=p.useMemo(()=>Co(e),[e]),m=o&&!d?[]:u.map(Gt),g=p.useRef(!0),b=p.useRef(u),y=Bs(()=>new Map),x=p.useRef(new Set),[S,v]=p.useState(u),[w,k]=p.useState(u);un(()=>{o&&!d&&!w.length&&f?.()},[d,o,w.length,f]),un(()=>{g.current=!1,b.current=u;for(let E=0;E<w.length;E++){const L=Gt(w[E]);m.includes(L)?(y.delete(L),x.current.delete(L)):y.get(L)!==!0&&y.set(L,!1)}},[w,m.length,m.join("-")]);const A=[];if(u!==S){let E=[...u],L=0;for(const K of w){const W=m.indexOf(Gt(K));W===-1?(E.splice(L++,0,K),A.push(K)):L=W+A.length+1}return r==="wait"&&A.length&&(E=A),k(Co(E)),v(u),null}const{forceRender:C}=p.useContext(Is);return h.jsx(h.Fragment,{children:w.map(E=>{const L=Gt(E),K=o&&!d?!1:u===w||m.includes(L),W=()=>{if(x.current.has(L))return;if(y.has(L))x.current.add(L),y.set(L,!0);else return;let I=!0;y.forEach(O=>{O||(I=!1)}),I&&(C?.(),k(b.current),o&&f?.(),s&&s())};return h.jsx(Nu,{isPresent:K,initial:!g.current||n?void 0:!1,custom:t,presenceAffectsLayout:i,mode:r,root:l,onExitComplete:K?void 0:W,anchorX:a,anchorY:c,children:E},L)})})},Oa=p.createContext({strict:!1}),Ao={animation:["animate","variants","whileHover","whileTap","exit","whileInView","whileFocus","whileDrag"],exit:["exit"],drag:["drag","dragControls"],focus:["whileFocus"],hover:["whileHover","onHoverStart","onHoverEnd"],tap:["whileTap","onTap","onTapStart","onTapCancel"],pan:["onPan","onPanStart","onPanSessionStart","onPanEnd"],inView:["whileInView","onViewportEnter","onViewportLeave"],layout:["layout","layoutId"]};let Po=!1;function Bu(){if(Po)return;const e={};for(const t in Ao)e[t]={isEnabled:n=>Ao[t].some(s=>!!n[s])};ra(e),Po=!0}function Ra(){return Bu(),kh()}function $u(e){const t=Ra();for(const n in e)t[n]={...t[n],...e[n]};ra(t)}const Pn=p.createContext({});function Fu(e,t){if(An(e)){const{initial:n,animate:s}=e;return{initial:n===!1||jt(n)?n:void 0,animate:jt(s)?s:void 0}}return e.inherit!==!1?t:{}}function _u(e){const{initial:t,animate:n}=Fu(e,p.useContext(Pn));return p.useMemo(()=>({initial:t,animate:n}),[Eo(t),Eo(n)])}function Eo(e){return Array.isArray(e)?e.join(" "):e}const di=()=>({style:{},transform:{},transformOrigin:{},vars:{}});function ja(e,t,n){for(const s in t)!fe(t[s])&&!fa(s,n)&&(e[s]=t[s])}function Hu({transformTemplate:e},t){return p.useMemo(()=>{const n=di();return ai(n,t,e),Object.assign({},n.vars,n.style)},[t])}function Wu(e,t){const n=e.style||{},s={};return ja(s,n,e),Object.assign(s,Hu(e,t)),s}function zu(e,t){const n={},s=Wu(e,t);return e.drag&&e.dragListener!==!1&&(n.draggable=!1,s.userSelect=s.WebkitUserSelect=s.WebkitTouchCallout="none",s.touchAction=e.drag===!0?"none":`pan-${e.drag==="x"?"y":"x"}`),e.tabIndex===void 0&&(e.onTap||e.onTapStart||e.whileTap)&&(n.tabIndex=0),n.style=s,n}const La=()=>({...di(),attrs:{}});function Uu(e,t,n,s){const i=p.useMemo(()=>{const r=La();return ma(r,t,ya(s),e.transformTemplate,e.style),{...r.attrs,style:{...r.style}}},[t]);if(e.style){const r={};ja(r,e.style,e),i.style={...r,...i.style}}return i}const Gu=new Set(["animate","exit","variants","initial","style","values","variants","transition","transformTemplate","custom","inherit","onBeforeLayoutMeasure","onAnimationStart","onAnimationComplete","onUpdate","onDragStart","onDrag","onDragEnd","onMeasureDragConstraints","onDirectionLock","onDragTransitionEnd","_dragX","_dragY","onHoverStart","onHoverEnd","onViewportEnter","onViewportLeave","globalTapTarget","propagate","ignoreStrict","viewport"]);function vn(e){return e.startsWith("while")||e.startsWith("drag")&&e!=="draggable"||e.startsWith("layout")||e.startsWith("onTap")||e.startsWith("onPan")||e.startsWith("onLayout")||Gu.has(e)}function Ku(e,t){return e.startsWith("on")?!vn(e):t?.(e)??!vn(e)}function Qu(e,t,n,s){const i={};for(const r in e)r==="values"&&typeof e.values=="object"||fe(e[r])||(Ku(r,s)||n===!0&&vn(r)||!t&&!vn(r)||e.draggable&&r.startsWith("onDrag"))&&(i[r]=e[r]);return i}const qu=["animate","circle","defs","desc","ellipse","g","image","line","filter","marker","mask","metadata","path","pattern","polygon","polyline","rect","stop","switch","symbol","svg","text","tspan","use","view"];function hi(e){return typeof e!="string"||e.includes("-")?!1:!!(qu.indexOf(e)>-1||/[A-Z]/u.test(e))}function Xu(e,t,n,{latestValues:s},i,r=!1,o,a){const l=(o??hi(e)?Uu:zu)(t,s,i,e),d=Qu(t,typeof e=="string",r,a),f=e!==p.Fragment?{...d,...l,ref:n}:{},{children:u}=t,m=p.useMemo(()=>fe(u)?u.get():u,[u]);return p.createElement(e,{...f,children:m})}function Yu({scrapeMotionValuesFromProps:e,createRenderState:t},n,s,i){return{latestValues:Zu(n,s,i,e),renderState:t()}}function Zu(e,t,n,s){const i={},r=s(e,{});for(const u in r)i[u]=dn(r[u]);let{initial:o,animate:a}=e;const c=An(e),l=ia(e);t&&l&&!c&&e.inherit!==!1&&(o===void 0&&(o=t.initial),a===void 0&&(a=t.animate));let d=n?n.initial===!1:!1;d=d||o===!1;const f=d?a:o;if(f&&typeof f!="boolean"&&!Cn(f)){const u=Array.isArray(f)?f:[f];for(let m=0;m<u.length;m++){const g=Js(e,u[m]);if(g){const{transitionEnd:b,transition:y,...x}=g;for(const S in x){let v=x[S];if(Array.isArray(v)){const w=d?v.length-1:0;v=v[w]}v!==null&&(i[S]=v)}for(const S in b)i[S]=b[S]}}}return i}const Na=e=>(t,n)=>{const s=p.useContext(Pn),i=p.useContext(kn),r=()=>Yu(e,t,s,i);return n?r():Bs(r)},Ju=Na({scrapeMotionValuesFromProps:li,createRenderState:di}),ef=Na({scrapeMotionValuesFromProps:wa,createRenderState:La}),tf=Symbol.for("motionComponentSymbol");function nf(e,t,n){const s=p.useRef(n);p.useInsertionEffect(()=>{s.current=n});const i=p.useRef(null);return p.useCallback(r=>{r&&e.onMount?.(r),t&&(r?t.mount(r):t.unmount());const o=s.current;if(typeof o=="function")if(r){const a=o(r);typeof a=="function"&&(i.current=a)}else i.current?(i.current(),i.current=null):o(r);else o&&(o.current=r)},[t])}const Va=p.createContext({});function ct(e){return e&&typeof e=="object"&&Object.prototype.hasOwnProperty.call(e,"current")}function sf(e,t,n,s,i,r){const{visualElement:o}=p.useContext(Pn),a=p.useContext(Oa),c=p.useContext(kn),l=p.useContext(ci),d=l.reducedMotion,f=l.skipAnimations,u=p.useRef(null),m=p.useRef(!1);s=s||a.renderer,!u.current&&s&&(u.current=s(e,{visualState:t,parent:o,props:n,presenceContext:c,blockInitialAnimation:c?c.initial===!1:!1,reducedMotionConfig:d,skipAnimations:f,isSVG:r}),m.current&&u.current&&(u.current.manuallyAnimateOnMount=!0));const g=u.current,b=p.useContext(Va);g&&!g.projection&&i&&(g.type==="html"||g.type==="svg")&&of(u.current,n,i,b);const y=p.useRef(!1);p.useInsertionEffect(()=>{g&&y.current&&g.update(n,c)});const x=n[Gr],S=p.useRef(!!x&&typeof window<"u"&&!window.MotionHandoffIsComplete?.(x)&&window.MotionHasOptimisedAnimation?.(x));return un(()=>{m.current=!0,g&&(y.current=!0,window.MotionIsMounted=!0,g.updateFeatures(),g.scheduleRenderMicrotask(),S.current&&g.animationState&&g.animationState.animateChanges())}),p.useEffect(()=>{g&&(!S.current&&g.animationState&&g.animationState.animateChanges(),S.current&&(queueMicrotask(()=>{window.MotionHandoffMarkAsComplete?.(x)}),S.current=!1),g.enteringChildren=void 0)}),g}function of(e,t,n,s){const{layoutId:i,layout:r,drag:o,dragConstraints:a,layoutScroll:c,layoutRoot:l,layoutAnchor:d,layoutCrossfade:f}=t;e.projection=new n(e.latestValues,t["data-framer-portal-id"]?void 0:Ia(e.parent)),e.projection.setOptions({layoutId:i,layout:r,alwaysMeasureLayout:!!o||a&&ct(a),visualElement:e,animationType:typeof r=="string"?r:"both",initialPromotionConfig:s,crossfade:f,layoutScroll:c,layoutRoot:l,layoutAnchor:d})}function Ia(e){if(e)return e.options.allowProjection!==!1?e.projection:Ia(e.parent)}function zn(e,{forwardMotionProps:t=!1,type:n}={},s,i){s&&$u(s);const r=n?n==="svg":hi(e),o=r?ef:Ju;function a(l,d){let f;const u={...p.useContext(ci),...l,layoutId:rf(l)},{isStatic:m,isValidProp:g}=u,b=_u(l),y=o(l,m);if(!m&&typeof window<"u"){af();const x=lf(u);f=x.MeasureLayout,b.visualElement=sf(e,y,u,i,x.ProjectionNode,r)}return h.jsxs(Pn.Provider,{value:b,children:[f&&b.visualElement?h.jsx(f,{visualElement:b.visualElement,...u}):null,Xu(e,l,nf(y,b.visualElement,d),y,m,t,r,g)]})}a.displayName=`motion.${typeof e=="string"?e:`create(${e.displayName??e.name??""})`}`;const c=p.forwardRef(a);return c[tf]=e,c}function rf({layoutId:e}){const t=p.useContext(Is).id;return t&&e!==void 0?t+"-"+e:e}function af(e,t){p.useContext(Oa).strict}function lf(e){const t=Ra(),{drag:n,layout:s}=t;if(!n&&!s)return{};const i={...n,...s};return{MeasureLayout:n?.isEnabled(e)||s?.isEnabled(e)?i.MeasureLayout:void 0,ProjectionNode:i.ProjectionNode}}function cf(e,t){if(typeof Proxy>"u")return zn;const n=new Map,s=(r,o)=>zn(r,o,e,t),i=(r,o)=>s(r,o);return new Proxy(i,{get:(r,o)=>o==="create"?s:(n.has(o)||n.set(o,zn(o,void 0,e,t)),n.get(o))})}const df=(e,t)=>t.isSVG??hi(e)?new Bh(t):new jh(t,{allowProjection:e!==p.Fragment});class hf extends Ke{constructor(t){super(t),t.animationState||(t.animationState=Wh(t))}updateAnimationControlsSubscription(){const{animate:t}=this.node.getProps();Cn(t)&&(this.unmountControls=t.subscribe(this.node))}mount(){this.updateAnimationControlsSubscription()}update(){const{animate:t}=this.node.getProps(),{animate:n}=this.node.prevProps||{};t!==n&&this.updateAnimationControlsSubscription()}unmount(){this.node.animationState.reset(),this.unmountControls?.()}}let uf=0;class ff extends Ke{constructor(){super(...arguments),this.id=uf++,this.isExitComplete=!1}update(){if(!this.node.presenceContext)return;const{isPresent:t,onExitComplete:n}=this.node.presenceContext,{isPresent:s}=this.node.prevPresenceContext||{};if(!this.node.animationState||t===s)return;if(t&&s===!1){if(this.isExitComplete){const{initial:r,custom:o}=this.node.getProps();if(typeof r=="string"||typeof r=="object"&&r!==null&&!Array.isArray(r)){const a=et(this.node,r,o);if(a){const{transition:c,transitionEnd:l,...d}=a;for(const f in d)this.node.getValue(f)?.jump(d[f])}}this.node.animationState.reset(),this.node.animationState.animateChanges()}else this.node.animationState.setActive("exit",!1);this.isExitComplete=!1;return}const i=this.node.animationState.setActive("exit",!t);n&&!t&&i.then(()=>{this.isExitComplete=!0,n(this.id)})}mount(){const{register:t,onExitComplete:n}=this.node.presenceContext||{};n&&n(this.id),t&&(this.unmount=t(this.id))}unmount(){}}const pf={animation:{Feature:hf},exit:{Feature:ff}};function Bt(e){return{point:{x:e.pageX,y:e.pageY}}}const mf=e=>t=>si(t)&&e(t,Bt(t));function Pt(e,t,n,s){return Lt(e,t,mf(n),s)}const Ba=({current:e})=>e?e.ownerDocument.defaultView:null,Mo=(e,t)=>Math.abs(e-t);function gf(e,t){const n=Mo(e.x,t.x),s=Mo(e.y,t.y);return Math.sqrt(n**2+s**2)}const Do=new Set(["auto","scroll"]);class $a{constructor(t,n,{transformPagePoint:s,contextWindow:i=window,dragSnapToOrigin:r=!1,distanceThreshold:o=3,element:a}={}){if(this.startEvent=null,this.lastMoveEvent=null,this.lastMoveEventInfo=null,this.lastRawMoveEventInfo=null,this.handlers={},this.contextWindow=window,this.scrollPositions=new Map,this.removeScrollListeners=null,this.onElementScroll=g=>{this.handleScroll(g.target)},this.onWindowScroll=()=>{this.handleScroll(window)},this.updatePoint=()=>{if(!(this.lastMoveEvent&&this.lastMoveEventInfo))return;this.lastRawMoveEventInfo&&(this.lastMoveEventInfo=Kt(this.lastRawMoveEventInfo,this.transformPagePoint));const g=Un(this.lastMoveEventInfo,this.history),b=this.startEvent!==null,y=gf(g.offset,{x:0,y:0})>=this.distanceThreshold;if(!b&&!y)return;const{point:x}=g,{timestamp:S}=ue;this.history.push({...x,timestamp:S});const{onStart:v,onMove:w}=this.handlers;b||(v&&v(this.lastMoveEvent,g),this.startEvent=this.lastMoveEvent),w&&w(this.lastMoveEvent,g)},this.handlePointerMove=(g,b)=>{this.lastMoveEvent=g,this.lastRawMoveEventInfo=b,this.lastMoveEventInfo=Kt(b,this.transformPagePoint),ee.update(this.updatePoint,!0)},this.handlePointerUp=(g,b)=>{this.end();const{onEnd:y,onSessionEnd:x,resumeAnimation:S}=this.handlers;if((this.dragSnapToOrigin||!this.startEvent)&&S&&S(),!(this.lastMoveEvent&&this.lastMoveEventInfo))return;const v=Un(g.type==="pointercancel"?this.lastMoveEventInfo:Kt(b,this.transformPagePoint),this.history);this.startEvent&&y&&y(g,v),x&&x(g,v)},!si(t))return;this.dragSnapToOrigin=r,this.handlers=n,this.transformPagePoint=s,this.distanceThreshold=o,this.contextWindow=i||window;const c=Bt(t),l=Kt(c,this.transformPagePoint),{point:d}=l,{timestamp:f}=ue;this.history=[{...d,timestamp:f}];const{onSessionStart:u}=n;u&&u(t,Un(l,this.history));const m={passive:!0,capture:!0};this.removeListeners=Nt(Pt(this.contextWindow,"pointermove",this.handlePointerMove,m),Pt(this.contextWindow,"pointerup",this.handlePointerUp,m),Pt(this.contextWindow,"pointercancel",this.handlePointerUp,m)),a&&this.startScrollTracking(a)}startScrollTracking(t){let n=t.parentElement;for(;n;){const s=getComputedStyle(n);(Do.has(s.overflowX)||Do.has(s.overflowY))&&this.scrollPositions.set(n,{x:n.scrollLeft,y:n.scrollTop}),n=n.parentElement}this.scrollPositions.set(window,{x:window.scrollX,y:window.scrollY}),window.addEventListener("scroll",this.onElementScroll,{capture:!0}),window.addEventListener("scroll",this.onWindowScroll),this.removeScrollListeners=()=>{window.removeEventListener("scroll",this.onElementScroll,{capture:!0}),window.removeEventListener("scroll",this.onWindowScroll)}}handleScroll(t){const n=this.scrollPositions.get(t);if(!n)return;const s=t===window,i=s?{x:window.scrollX,y:window.scrollY}:{x:t.scrollLeft,y:t.scrollTop},r={x:i.x-n.x,y:i.y-n.y};r.x===0&&r.y===0||(s?this.lastMoveEventInfo&&(this.lastMoveEventInfo.point.x+=r.x,this.lastMoveEventInfo.point.y+=r.y):this.history.length>0&&(this.history[0].x-=r.x,this.history[0].y-=r.y),this.scrollPositions.set(t,i),ee.update(this.updatePoint,!0))}updateHandlers(t){this.handlers=t}end(){this.removeListeners&&this.removeListeners(),this.removeScrollListeners&&this.removeScrollListeners(),this.scrollPositions.clear(),Ge(this.updatePoint)}}function Kt(e,t){return t?{point:t(e.point)}:e}function Oo(e,t){return{x:e.x-t.x,y:e.y-t.y}}function Un({point:e},t){return{point:e,delta:Oo(e,Fa(t)),offset:Oo(e,yf(t)),velocity:wf(t,.1)}}function yf(e){return e[0]}function Fa(e){return e[e.length-1]}function wf(e,t){if(e.length<2)return{x:0,y:0};let n=e.length-1,s=null;const i=Fa(e);for(;n>=0&&(s=e[n],!(i.timestamp-s.timestamp>Ee(t)));)n--;if(!s)return{x:0,y:0};s===e[0]&&e.length>2&&i.timestamp-s.timestamp>Ee(t)*2&&(s=e[1]);const r=Ae(i.timestamp-s.timestamp);if(r===0)return{x:0,y:0};const o={x:(i.x-s.x)/r,y:(i.y-s.y)/r};return o.x===1/0&&(o.x=0),o.y===1/0&&(o.y=0),o}function bf(e,{min:t,max:n},s){return t!==void 0&&e<t?e=s?J(t,e,s.min):Math.max(e,t):n!==void 0&&e>n&&(e=s?J(n,e,s.max):Math.min(e,n)),e}function Ro(e,t,n){return{min:t!==void 0?e.min+t:void 0,max:n!==void 0?e.max+n-(e.max-e.min):void 0}}function xf(e,{top:t,left:n,bottom:s,right:i}){return{x:Ro(e.x,n,i),y:Ro(e.y,t,s)}}function jo(e,t){let n=t.min-e.min,s=t.max-e.max;return t.max-t.min<e.max-e.min&&([n,s]=[s,n]),{min:n,max:s}}function vf(e,t){return{x:jo(e.x,t.x),y:jo(e.y,t.y)}}function kf(e,t){let n=.5;const s=be(e),i=be(t);return i>s?n=Ot(t.min,t.max-s,e.min):s>i&&(n=Ot(e.min,e.max-i,t.min)),$e(0,1,n)}function Tf(e,t){const n={};return t.min!==void 0&&(n.min=t.min-e.min),t.max!==void 0&&(n.max=t.max-e.min),n}const Ms=.35;function Sf(e=Ms){return e===!1?e=0:e===!0&&(e=Ms),{x:Lo(e,"left","right"),y:Lo(e,"top","bottom")}}function Lo(e,t,n){return{min:No(e,t),max:No(e,n)}}function No(e,t){return typeof e=="number"?e:e[t]||0}const Cf=new WeakMap;class Af{constructor(t){this.openDragLock=null,this.isDragging=!1,this.currentDirection=null,this.originPoint={x:0,y:0},this.constraints=!1,this.hasMutatedConstraints=!1,this.elastic=ce(),this.latestPointerEvent=null,this.latestPanInfo=null,this.visualElement=t}start(t,{snapToCursor:n=!1,distanceThreshold:s}={}){const{presenceContext:i}=this.visualElement;if(i&&i.isPresent===!1)return;const r=f=>{n&&this.snapToCursor(Bt(f).point),this.stopAnimation()},o=(f,u)=>{const{drag:m,dragPropagation:g,onDragStart:b}=this.getProps();if(m&&!g&&(this.openDragLock&&this.openDragLock(),this.openDragLock=Zd(m),!this.openDragLock))return;this.latestPointerEvent=f,this.latestPanInfo=u,this.isDragging=!0,this.currentDirection=null,this.resolveConstraints(),this.visualElement.projection&&(this.visualElement.projection.isAnimationBlocked=!0,this.visualElement.projection.target=void 0),Ne(x=>{let S=this.getAxisMotionValue(x).get()||0;if(Be.test(S)){const{projection:v}=this.visualElement;if(v&&v.layout){const w=v.layout.layoutBox[x];w&&(S=be(w)*(parseFloat(S)/100))}}this.originPoint[x]=S}),b&&ee.update(()=>b(f,u),!1,!0),bs(this.visualElement,"transform");const{animationState:y}=this.visualElement;y&&y.setActive("whileDrag",!0)},a=(f,u)=>{this.latestPointerEvent=f,this.latestPanInfo=u;const{dragPropagation:m,dragDirectionLock:g,onDirectionLock:b,onDrag:y}=this.getProps();if(!m&&!this.openDragLock)return;const{offset:x}=u;if(g&&this.currentDirection===null){this.currentDirection=Ef(x),this.currentDirection!==null&&b&&b(this.currentDirection);return}this.updateAxis("x",u.point,x),this.updateAxis("y",u.point,x),this.visualElement.render(),y&&ee.update(()=>y(f,u),!1,!0)},c=(f,u)=>{this.latestPointerEvent=f,this.latestPanInfo=u,this.stop(f,u),this.latestPointerEvent=null,this.latestPanInfo=null},l=()=>{const{dragSnapToOrigin:f}=this.getProps();(f||this.constraints)&&this.startAnimation({x:0,y:0})},{dragSnapToOrigin:d}=this.getProps();this.panSession=new $a(t,{onSessionStart:r,onStart:o,onMove:a,onSessionEnd:c,resumeAnimation:l},{transformPagePoint:this.visualElement.getTransformPagePoint(),dragSnapToOrigin:d,distanceThreshold:s,contextWindow:Ba(this.visualElement),element:this.visualElement.current})}stop(t,n){const s=t||this.latestPointerEvent,i=n||this.latestPanInfo,r=this.isDragging;if(this.cancel(),!r||!i||!s)return;const{velocity:o}=i;this.startAnimation(o);const{onDragEnd:a}=this.getProps();a&&ee.postRender(()=>a(s,i))}cancel(){this.isDragging=!1;const{projection:t,animationState:n}=this.visualElement;t&&(t.isAnimationBlocked=!1),this.endPanSession();const{dragPropagation:s}=this.getProps();!s&&this.openDragLock&&(this.openDragLock(),this.openDragLock=null),n&&n.setActive("whileDrag",!1)}endPanSession(){this.panSession&&this.panSession.end(),this.panSession=void 0}updateAxis(t,n,s){const{drag:i}=this.getProps();if(!s||!Qt(t,i,this.currentDirection))return;const r=this.getAxisMotionValue(t);let o=this.originPoint[t]+s[t];this.constraints&&this.constraints[t]&&(o=bf(o,this.constraints[t],this.elastic[t])),r.set(o)}resolveConstraints(){const{dragConstraints:t,dragElastic:n}=this.getProps(),s=this.visualElement.projection&&!this.visualElement.projection.layout?this.visualElement.projection.measure(!1):this.visualElement.projection?.layout,i=this.constraints;t&&ct(t)?this.constraints||(this.constraints=this.resolveRefConstraints()):t&&s?this.constraints=xf(s.layoutBox,t):this.constraints=!1,this.elastic=Sf(n),i!==this.constraints&&!ct(t)&&s&&this.constraints&&!this.hasMutatedConstraints&&Ne(r=>{this.constraints!==!1&&this.getAxisMotionValue(r)&&(this.constraints[r]=Tf(s.layoutBox[r],this.constraints[r]))})}resolveRefConstraints(){const{dragConstraints:t,onMeasureDragConstraints:n}=this.getProps();if(!t||!ct(t))return!1;const s=t.current,{projection:i}=this.visualElement;if(!i||!i.layout)return!1;i.root&&(i.root.scroll=void 0,i.root.updateScroll());const r=Ph(s,i.root,this.visualElement.getTransformPagePoint());let o=vf(i.layout.layoutBox,r);if(n){const a=n(Sh(o));this.hasMutatedConstraints=!!a,a&&(o=la(a))}return o}startAnimation(t){const{drag:n,dragMomentum:s,dragElastic:i,dragTransition:r,dragSnapToOrigin:o,onDragTransitionEnd:a}=this.getProps(),c=this.constraints||{},l=Ne(d=>{if(!Qt(d,n,this.currentDirection))return;let f=c&&c[d]||{};(o===!0||o===d)&&(f={min:0,max:0});const u=i?200:1e6,m=i?40:1e7,g={type:"inertia",velocity:s?t[d]:0,bounceStiffness:u,bounceDamping:m,timeConstant:750,restDelta:1,restSpeed:10,...r,...f};return this.startAxisValueAnimation(d,g)});return Promise.all(l).then(a)}startAxisValueAnimation(t,n){const s=this.getAxisMotionValue(t);return bs(this.visualElement,t),s.start(Zs(t,s,0,n,this.visualElement,!1))}stopAnimation(){Ne(t=>this.getAxisMotionValue(t).stop())}getAxisMotionValue(t){const n=`_drag${t.toUpperCase()}`,i=this.visualElement.getProps()[n];return i||this.visualElement.getValue(t,this.visualElement.latestValues[t]??0)}snapToCursor(t){Ne(n=>{const{drag:s}=this.getProps();if(!Qt(n,s,this.currentDirection))return;const{projection:i}=this.visualElement,r=this.getAxisMotionValue(n);if(i&&i.layout){const{min:o,max:a}=i.layout.layoutBox[n],c=r.get()||0;r.set(t[n]-J(o,a,.5)+c)}})}scalePositionWithinConstraints(){if(!this.visualElement.current)return;const{drag:t,dragConstraints:n}=this.getProps(),{projection:s}=this.visualElement;if(!ct(n)||!s||!this.constraints)return;this.stopAnimation();const i={x:0,y:0};Ne(o=>{const a=this.getAxisMotionValue(o);if(a&&this.constraints!==!1){const c=a.get();i[o]=kf({min:c,max:c},this.constraints[o])}});const{transformTemplate:r}=this.visualElement.getProps();this.visualElement.current.style.transform=r?r({},""):"none",s.root&&s.root.updateScroll(),s.updateLayout(),this.constraints=!1,this.resolveConstraints(),Ne(o=>{if(!Qt(o,t,null))return;const a=this.getAxisMotionValue(o),{min:c,max:l}=this.constraints[o];a.set(J(c,l,i[o]))}),this.visualElement.render()}addListeners(){if(!this.visualElement.current)return;Cf.set(this.visualElement,this);const t=this.visualElement.current,n=Pt(t,"pointerdown",l=>{const{drag:d,dragListener:f=!0}=this.getProps(),u=l.target,m=u!==t&&ih(u);d&&f&&!m&&this.start(l)});let s;const i=()=>{const{dragConstraints:l}=this.getProps();ct(l)&&l.current&&(this.constraints=this.resolveRefConstraints(),s||(s=Pf(t,l.current,()=>this.scalePositionWithinConstraints())))},{projection:r}=this.visualElement,o=r.addEventListener("measure",i);r&&!r.layout&&(r.root&&r.root.updateScroll(),r.updateLayout()),ee.read(i);const a=Lt(window,"resize",()=>this.scalePositionWithinConstraints()),c=r.addEventListener("didUpdate",(({delta:l,hasLayoutChanged:d})=>{this.isDragging&&d&&(Ne(f=>{const u=this.getAxisMotionValue(f);u&&(this.originPoint[f]+=l[f].translate,u.set(u.get()+l[f].translate))}),this.visualElement.render())}));return()=>{a(),n(),o(),c&&c(),s&&s()}}getProps(){const t=this.visualElement.getProps(),{drag:n=!1,dragDirectionLock:s=!1,dragPropagation:i=!1,dragConstraints:r=!1,dragElastic:o=Ms,dragMomentum:a=!0}=t;return{...t,drag:n,dragDirectionLock:s,dragPropagation:i,dragConstraints:r,dragElastic:o,dragMomentum:a}}}function Vo(e){let t=!0;return()=>{if(t){t=!1;return}e()}}function Pf(e,t,n){const s=Hi(e,Vo(n)),i=Hi(t,Vo(n));return()=>{s(),i()}}function Qt(e,t,n){return(t===!0||t===e)&&(n===null||n===e)}function Ef(e,t=10){let n=null;return Math.abs(e.y)>t?n="y":Math.abs(e.x)>t&&(n="x"),n}class Mf extends Ke{constructor(t){super(t),this.removeGroupControls=Pe,this.removeListeners=Pe,this.controls=new Af(t)}mount(){const{dragControls:t}=this.node.getProps();t&&(this.removeGroupControls=t.subscribe(this.controls)),this.removeListeners=this.controls.addListeners()||Pe}update(){const{dragControls:t}=this.node.getProps(),{dragControls:n}=this.node.prevProps||{};t!==n&&(this.removeGroupControls(),t&&(this.removeGroupControls=t.subscribe(this.controls)))}unmount(){this.removeGroupControls(),this.removeListeners(),this.controls.isDragging||this.controls.endPanSession()}}const Gn=e=>(t,n)=>{e&&ee.update(()=>e(t,n),!1,!0)};class Df extends Ke{constructor(){super(...arguments),this.removePointerDownListener=Pe}onPointerDown(t){this.session=new $a(t,this.createPanHandlers(),{transformPagePoint:this.node.getTransformPagePoint(),contextWindow:Ba(this.node)})}createPanHandlers(){const{onPanSessionStart:t,onPanStart:n,onPan:s,onPanEnd:i}=this.node.getProps();return{onSessionStart:Gn(t),onStart:Gn(n),onMove:Gn(s),onEnd:(r,o)=>{delete this.session,i&&ee.postRender(()=>i(r,o))}}}mount(){this.removePointerDownListener=Pt(this.node.current,"pointerdown",t=>this.onPointerDown(t))}update(){this.session&&this.session.updateHandlers(this.createPanHandlers())}unmount(){this.removePointerDownListener(),this.session&&this.session.end()}}let Kn=!1;class Of extends p.Component{componentDidMount(){const{visualElement:t,layoutGroup:n,switchLayoutGroup:s,layoutId:i}=this.props,{projection:r}=t;r&&(n.group&&n.group.add(r),s&&s.register&&i&&s.register(r),Kn&&r.root.didUpdate(),r.addEventListener("animationComplete",()=>{this.safeToRemove()}),r.setOptions({...r.options,layoutDependency:this.props.layoutDependency,onExitComplete:()=>this.safeToRemove()})),hn.hasEverUpdated=!0}getSnapshotBeforeUpdate(t){const{layoutDependency:n,visualElement:s,drag:i,isPresent:r}=this.props,{projection:o}=s;return o&&(o.isPresent=r,t.layoutDependency!==n&&o.setOptions({...o.options,layoutDependency:n}),Kn=!0,i||t.layoutDependency!==n||n===void 0||t.isPresent!==r?o.willUpdate():this.safeToRemove(),t.isPresent!==r&&(r?o.promote():o.relegate()||ee.postRender(()=>{const a=o.getStack();(!a||!a.members.length)&&this.safeToRemove()}))),null}componentDidUpdate(){const{visualElement:t,layoutAnchor:n}=this.props,{projection:s}=t;s&&(s.options.layoutAnchor=n,s.root.didUpdate(),ni.postRender(()=>{!s.currentAnimation&&s.isLead()&&this.safeToRemove()}))}componentWillUnmount(){const{visualElement:t,layoutGroup:n,switchLayoutGroup:s}=this.props,{projection:i}=t;Kn=!0,i&&(i.scheduleCheckAfterUnmount(),n&&n.group&&n.group.remove(i),s&&s.deregister&&s.deregister(i))}safeToRemove(){const{safeToRemove:t}=this.props;t&&t()}render(){return null}}function _a(e){const[t,n]=Da(),s=p.useContext(Is);return h.jsx(Of,{...e,layoutGroup:s,switchLayoutGroup:p.useContext(Va),isPresent:t,safeToRemove:n})}const Rf={pan:{Feature:Df},drag:{Feature:Mf,ProjectionNode:Ma,MeasureLayout:_a}};function Io(e,t,n){const{props:s}=e;e.animationState&&s.whileHover&&e.animationState.setActive("whileHover",n==="Start");const i="onHover"+n,r=s[i];r&&ee.postRender(()=>r(t,Bt(t)))}class jf extends Ke{mount(){const{current:t}=this.node;t&&(this.unmount=eh(t,(n,s)=>(Io(this.node,s,"Start"),i=>Io(this.node,i,"End"))))}unmount(){}}class Lf extends Ke{constructor(){super(...arguments),this.isActive=!1}onFocus(){let t=!1;try{t=this.node.current.matches(":focus-visible")}catch{t=!0}!t||!this.node.animationState||(this.node.animationState.setActive("whileFocus",!0),this.isActive=!0)}onBlur(){!this.isActive||!this.node.animationState||(this.node.animationState.setActive("whileFocus",!1),this.isActive=!1)}mount(){this.unmount=Nt(Lt(this.node.current,"focus",()=>this.onFocus()),Lt(this.node.current,"blur",()=>this.onBlur()))}unmount(){}}function Bo(e,t,n){const{props:s}=e;if(e.current instanceof HTMLButtonElement&&e.current.disabled)return;e.animationState&&s.whileTap&&e.animationState.setActive("whileTap",n==="Start");const i="onTap"+(n==="End"?"":n),r=s[i];r&&ee.postRender(()=>r(t,Bt(t)))}class Nf extends Ke{mount(){const{current:t}=this.node;if(!t)return;const{globalTapTarget:n,propagate:s}=this.node.props;this.unmount=rh(t,(i,r)=>(Bo(this.node,r,"Start"),(o,{success:a})=>Bo(this.node,o,a?"End":"Cancel")),{useGlobalTarget:n,stopPropagation:s?.tap===!1})}unmount(){}}const Ds=new WeakMap,Qn=new WeakMap,Vf=e=>{const t=Ds.get(e.target);t&&t(e)},If=e=>{e.forEach(Vf)};function Bf({root:e,...t}){const n=e||document;Qn.has(n)||Qn.set(n,{});const s=Qn.get(n),i=JSON.stringify(t);return s[i]||(s[i]=new IntersectionObserver(If,{root:e,...t})),s[i]}function $f(e,t,n){const s=Bf(t);return Ds.set(e,n),s.observe(e),()=>{Ds.delete(e),s.unobserve(e)}}const Ff={some:0,all:1};class _f extends Ke{constructor(){super(...arguments),this.hasEnteredView=!1,this.isInView=!1}startObserver(){this.stopObserver?.();const{viewport:t={}}=this.node.getProps(),{root:n,margin:s,amount:i="some",once:r}=t,o={root:n?n.current:void 0,rootMargin:s,threshold:typeof i=="number"?i:Ff[i]},a=c=>{const{isIntersecting:l}=c;if(this.isInView===l||(this.isInView=l,r&&!l&&this.hasEnteredView))return;l&&(this.hasEnteredView=!0),this.node.animationState&&this.node.animationState.setActive("whileInView",l);const{onViewportEnter:d,onViewportLeave:f}=this.node.getProps(),u=l?d:f;u&&u(c)};this.stopObserver=$f(this.node.current,o,a)}mount(){this.startObserver()}update(){if(typeof IntersectionObserver>"u")return;const{props:t,prevProps:n}=this.node;["amount","margin","root"].some(Hf(t,n))&&this.startObserver()}unmount(){this.stopObserver?.(),this.hasEnteredView=!1,this.isInView=!1}}function Hf({viewport:e={}},{viewport:t={}}={}){return n=>e[n]!==t[n]}const Wf={inView:{Feature:_f},tap:{Feature:Nf},focus:{Feature:Lf},hover:{Feature:jf}},zf={layout:{ProjectionNode:Ma,MeasureLayout:_a}},Uf={...pf,...Wf,...Rf,...zf},Gf=cf(Uf,df),Kf=Gf;function qt(e){throw new Error('Could not dynamically require "'+e+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var qn={exports:{}},$o;function Qf(){return $o||($o=1,(function(e,t){(function(n){e.exports=n()})(function(){return(function(){function n(s,i,r){function o(l,d){if(!i[l]){if(!s[l]){var f=typeof qt=="function"&&qt;if(!d&&f)return f(l,!0);if(a)return a(l,!0);var u=new Error("Cannot find module '"+l+"'");throw u.code="MODULE_NOT_FOUND",u}var m=i[l]={exports:{}};s[l][0].call(m.exports,function(g){var b=s[l][1][g];return o(b||g)},m,m.exports,n,s,i,r)}return i[l].exports}for(var a=typeof qt=="function"&&qt,c=0;c<r.length;c++)o(r[c]);return o}return n})()({1:[function(n,s,i){Object.defineProperty(i,"__esModule",{value:!0}),i.default=void 0;function r(u){"@babel/helpers - typeof";return r=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(m){return typeof m}:function(m){return m&&typeof Symbol=="function"&&m.constructor===Symbol&&m!==Symbol.prototype?"symbol":typeof m},r(u)}function o(u,m){if(!(u instanceof m))throw new TypeError("Cannot call a class as a function")}function a(u,m){for(var g=0;g<m.length;g++){var b=m[g];b.enumerable=b.enumerable||!1,b.configurable=!0,"value"in b&&(b.writable=!0),Object.defineProperty(u,l(b.key),b)}}function c(u,m,g){return m&&a(u.prototype,m),Object.defineProperty(u,"prototype",{writable:!1}),u}function l(u){var m=d(u,"string");return r(m)=="symbol"?m:m+""}function d(u,m){if(r(u)!="object"||!u)return u;var g=u[Symbol.toPrimitive];if(g!==void 0){var b=g.call(u,m);if(r(b)!="object")return b;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(u)}i.default=(function(){function u(){var m=this,g=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},b=g.defaultLayoutOptions,y=b===void 0?{}:b,x=g.algorithms,S=x===void 0?["layered","stress","mrtree","radial","force","disco","sporeOverlap","sporeCompaction","rectpacking"]:x,v=g.workerFactory,w=g.workerUrl;if(o(this,u),this.defaultLayoutOptions=y,this.initialized=!1,typeof w>"u"&&typeof v>"u")throw new Error("Cannot construct an ELK without both 'workerUrl' and 'workerFactory'.");var k=v;typeof w<"u"&&typeof v>"u"&&(k=function(E){return new Worker(E)});var A=k(w);if(typeof A.postMessage!="function")throw new TypeError("Created worker does not provide the required 'postMessage' function.");this.worker=new f(A),this.worker.postMessage({cmd:"register",algorithms:S}).then(function(C){return m.initialized=!0}).catch(console.err)}return c(u,[{key:"layout",value:function(g){var b=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},y=b.layoutOptions,x=y===void 0?this.defaultLayoutOptions:y,S=b.logging,v=S===void 0?!1:S,w=b.measureExecutionTime,k=w===void 0?!1:w;return g?this.worker.postMessage({cmd:"layout",graph:g,layoutOptions:x,options:{logging:v,measureExecutionTime:k}}):Promise.reject(new Error("Missing mandatory parameter 'graph'."))}},{key:"knownLayoutAlgorithms",value:function(){return this.worker.postMessage({cmd:"algorithms"})}},{key:"knownLayoutOptions",value:function(){return this.worker.postMessage({cmd:"options"})}},{key:"knownLayoutCategories",value:function(){return this.worker.postMessage({cmd:"categories"})}},{key:"terminateWorker",value:function(){this.worker&&this.worker.terminate()}}])})();var f=(function(){function u(m){var g=this;if(o(this,u),m===void 0)throw new Error("Missing mandatory parameter 'worker'.");this.resolvers={},this.worker=m,this.worker.onmessage=function(b){setTimeout(function(){g.receive(g,b)},0)}}return c(u,[{key:"postMessage",value:function(g){var b=this.id||0;this.id=b+1,g.id=b;var y=this;return new Promise(function(x,S){y.resolvers[b]=function(v,w){v?(y.convertGwtStyleError(v),S(v)):x(w)},y.worker.postMessage(g)})}},{key:"receive",value:function(g,b){var y=b.data,x=g.resolvers[y.id];x&&(delete g.resolvers[y.id],y.error?x(y.error):x(null,y.data))}},{key:"terminate",value:function(){this.worker&&this.worker.terminate()}},{key:"convertGwtStyleError",value:function(g){if(g){var b=g.__java$exception;b&&(b.cause&&b.cause.backingJsObject&&(g.cause=b.cause.backingJsObject,this.convertGwtStyleError(g.cause)),delete g.__java$exception)}}}])})()},{}],2:[function(n,s,i){var r=n("./elk-api.js").default;Object.defineProperty(s.exports,"__esModule",{value:!0}),s.exports=r,r.default=r},{"./elk-api.js":1}]},{},[2])(2)})})(qn)),qn.exports}var qf=Qf();const Xf=Tl(qf),Yf="/dynamic-model-var-docs/assets/elk-worker.min-r_yRvuMO.js";class Zf{elk=null;ensure(){return this.elk||(this.elk=new Xf({workerUrl:Yf})),this.elk}async layout(t,n={}){const{direction:s="DOWN",nodeSpacing:i=32,layerSpacing:r=56,usePartitions:o=!1,extraLayoutOptions:a={}}=n,c={id:"root",layoutOptions:{"elk.algorithm":"layered","elk.direction":s,"elk.spacing.nodeNode":String(i),"elk.layered.spacing.nodeNodeBetweenLayers":String(r),"elk.edgeRouting":"ORTHOGONAL","elk.layered.considerModelOrder.strategy":"NODES_AND_EDGES",...o?{"elk.partitioning.activate":"true"}:{},...a},children:t.nodes.map(y=>({id:y.id,width:y.width,height:y.height,...y.ports?.length?{ports:y.ports.map(x=>({id:x.id,x:x.x,y:x.y,width:0,height:0}))}:{},...o&&y.partition!==void 0||y.ports?.length?{layoutOptions:{...o&&y.partition!==void 0?{"elk.partitioning.partition":String(y.partition)}:{},...y.ports?.length?{"elk.portConstraints":"FIXED_POS"}:{}}}:{}})),edges:t.edges.filter(y=>y.source!==y.target).map(y=>({id:y.id,sources:[y.sourcePort??y.source],targets:[y.targetPort??y.target]}))},l=new Map(t.edges.map(y=>[y.id,y]));this.elk;const d=performance.now(),f=await this.ensure().layout(c);performance.now()-d,t.nodes.length,t.edges.length;const u=(f.children??[]).map(y=>({id:y.id,x:y.x??0,y:y.y??0,width:y.width??0,height:y.height??0})),m=(f.edges??[]).map(y=>{const x=l.get(y.id);if(!x)throw new Error(`ELK returned unknown edge id: ${y.id}`);return{id:y.id,source:x.source,target:x.target,sections:y.sections}}),g=Math.max(0,...u.map(y=>y.x+y.width)),b=Math.max(0,...u.map(y=>y.y+y.height));return{nodes:u,edges:m,width:g,height:b}}cancel(){this.elk&&(this.elk.terminateWorker(),this.elk=null)}dispose(){this.cancel()}}function Xt(e){if(!e?.length)return[];const t=e[0];return[t.startPoint,...t.bendPoints??[],t.endPoint]}function Fo(e,t,n){const s=t.x-e.x,i=t.y-e.y,r=Math.hypot(s,i);if(r<1e-6)return{...e};const o=Math.min(n,r/2)/r;return{x:e.x+s*o,y:e.y+i*o}}function Jf(e,t){if(e.length<2)return ep(e);let n=`M${e[0].x},${e[0].y}`;for(let i=1;i<e.length-1;i++){const r=Fo(e[i],e[i-1],t),o=Fo(e[i],e[i+1],t);n+=`L${r.x},${r.y}Q${e[i].x},${e[i].y} ${o.x},${o.y}`}const s=e[e.length-1];return`${n}L${s.x},${s.y}`}function ep(e){return e.length?e.map((t,n)=>`${n===0?"M":"L"}${t.x},${t.y}`).join(""):""}function tp(e,t){let n=0,s=e.length-1,i=e[e.length-1];for(let r=e.length-1;r>0;r--){const o=Math.hypot(e[r].x-e[r-1].x,e[r].y-e[r-1].y);if(n+o>=t){const a=(t-n)/o;i={x:e[r].x+(e[r-1].x-e[r].x)*a,y:e[r].y+(e[r-1].y-e[r].y)*a},s=r-1;break}n+=o,s=r-1}return{cut:s,cutPoint:i}}function np(e,t,n,s){if(e.length<2||n<=0)return s(e);const{cut:i,cutPoint:r}=tp(e,n),o=e.slice(0,i+1),a=o[o.length-1],c=a&&Math.abs(a.x-r.x)<1e-6&&Math.abs(a.y-r.y)<1e-6;return s([...o,...c?[]:[r],t])}function sp(e,t=1.5){if(e.length<3)return e;const n=[e[0]];for(let s=1;s<e.length-1;s++){const i=n[n.length-1],r=e[s],o=e[s+1],a=o.x-i.x,c=o.y-i.y,l=Math.hypot(a,c);(l<1e-6?Math.hypot(r.x-i.x,r.y-i.y):Math.abs(c*r.x-a*r.y+o.x*i.y-o.y*i.x)/l)>t&&n.push(r)}return n.push(e[e.length-1]),n}function ip(e,t,n,s){const i=Math.hypot(t.x,t.y)||1,r=t.x/i,o=t.y/i,a=-o,c=r,l=n/2,d={x:e.x+a*l,y:e.y+c*l},f={x:e.x-a*l,y:e.y-c*l},u={x:e.x+r*s,y:e.y+o*s};return`M${d.x},${d.y}L${u.x},${u.y}L${f.x},${f.y}Z`}function op(e,t,n,s,i=16){const r={x:e.x+n.x*i,y:e.y+n.y*i},o={x:t.x+s.x*i,y:t.y+s.y*i},a=[e,r];if(Math.abs(n.x)>.5){const c=(r.x+o.x)/2;Math.abs(r.y-o.y)>.5&&a.push({x:c,y:r.y},{x:c,y:o.y})}else{const c=(r.y+o.y)/2;Math.abs(r.x-o.x)>.5&&a.push({x:r.x,y:c},{x:o.x,y:c})}return a.push(o,t),sp(a)}function rp(e,t={}){const n=p.useRef(null);n.current||(n.current=new Zf);const[s,i]=p.useState(null),[r,o]=p.useState(!1),a=JSON.stringify(t);p.useEffect(()=>{const d=n.current;if(!e||e.nodes.length===0){i(null),o(!1);return}let f=!1;return o(!0),d.layout(e,JSON.parse(a)).then(u=>{f||(i({spec:e,layout:u}),o(!1))},u=>{f||(o(!1),console.error("graph-core layout failed:",u))}),()=>{f=!0,d.cancel()}},[e,a]),p.useEffect(()=>()=>n.current?.dispose(),[]);const c=!!e&&e.nodes.length>0,l=!s||s.spec!==e;return{latest:s,inProgress:(r||l)&&c}}const ap=300,lp=100,cp=200,dp=75,hp=250,up=120,fp=200,pp=[.65,0,.35,1],Yt=e=>e/1e3,mp=()=>typeof window<"u"&&typeof window.matchMedia=="function"&&window.matchMedia("(prefers-reduced-motion: reduce)").matches,$t=e=>()=>mp()?0:e,Ha=$t(ap),_o=$t(lp),gp=$t(cp),yp=$t(dp),wp=$t(hp),Zt=()=>up,Ho=.5;function bp(e={}){const{min:t=.2,max:n=2}=e,s=p.useRef(null),i=p.useRef(null),r=p.useRef(null),o=p.useRef(1),a=p.useRef({w:0,h:0}),c=p.useRef(null),l=p.useRef(null),d=p.useRef(!0),f=p.useRef(!0),u=p.useCallback(()=>{const v=s.current;return v?{x:v.clientWidth*Ho,y:v.clientHeight*Ho}:{x:0,y:0}},[]),m=p.useCallback(v=>{const w=i.current;if(w){const{x:k,y:A}=u();w.style.transition=v?`width ${v}ms, height ${v}ms`:"",w.style.padding=`${A}px ${k}px`,w.style.width=`${a.current.w*o.current+2*k}px`,w.style.height=`${a.current.h*o.current+2*A}px`}},[u]),g=p.useCallback((v,w)=>{o.current=Math.min(n,Math.max(t,v));const k=w?Ha():0;c.current&&cancelAnimationFrame(c.current),c.current=requestAnimationFrame(()=>{c.current=null;const A=r.current;A&&(A.style.transition=k?`transform ${k}ms`:"",A.style.transform=`scale(${o.current})`)}),l.current&&(clearTimeout(l.current),l.current=null),k?m(k):l.current=setTimeout(()=>{l.current=null,m(0)},100)},[t,n,m]),b=p.useCallback((v,w=!0)=>{d.current=!1,g(v,w)},[g]),y=p.useCallback(v=>b(o.current*v),[b]),x=p.useCallback((v,w)=>{a.current={w:v,h:w};const k=r.current;k&&(k.style.width=`${v}px`,k.style.height=`${w}px`,k.style.transformOrigin="0 0",k.style.transform=`scale(${o.current})`),m(0)},[m]),S=p.useCallback(()=>{const v=s.current,{w,h:k}=a.current;if(!v||!w||!k)return;d.current=!0;const A=!f.current;f.current=!1,g(Math.min(v.clientWidth/w,v.clientHeight/k,1),A),requestAnimationFrame(()=>{const{x:C,y:E}=u();typeof v.scrollTo=="function"?v.scrollTo({left:C,top:E,behavior:A?"smooth":"auto"}):(v.scrollLeft=C,v.scrollTop=E)})},[g,u]);return p.useEffect(()=>{const v=s.current;if(!v)return;const w=k=>{!k.ctrlKey&&!k.metaKey||(k.preventDefault(),b(o.current*(1-k.deltaY*.005),!1))};return v.addEventListener("wheel",w,{passive:!1}),()=>v.removeEventListener("wheel",w)},[b]),p.useEffect(()=>{const v=s.current;if(!v)return;let w=!1,k=0,A=0,C=0,E=0,L=!1;const K=B=>B instanceof Element&&!B.closest("[data-pan-ignore]"),W=B=>{B.button!==0||!K(B.target)||(w=!0,L=!1,k=B.clientX,A=B.clientY,C=v.scrollLeft,E=v.scrollTop,v.style.cursor="grabbing")},I=B=>{if(!w)return;const Y=B.clientX-k,te=B.clientY-A;!L&&Math.hypot(Y,te)<3||(L||(L=!0,v.setPointerCapture(B.pointerId)),B.preventDefault(),v.scrollLeft=C-Y,v.scrollTop=E-te)},O=B=>{w&&(w=!1,v.style.cursor="",v.hasPointerCapture(B.pointerId)&&v.releasePointerCapture(B.pointerId))};return v.addEventListener("pointerdown",W),v.addEventListener("pointermove",I),v.addEventListener("pointerup",O),v.addEventListener("pointercancel",O),()=>{v.removeEventListener("pointerdown",W),v.removeEventListener("pointermove",I),v.removeEventListener("pointerup",O),v.removeEventListener("pointercancel",O)}},[]),{containerRef:s,spacerRef:i,wrapperRef:r,applyZoom:b,zoomBy:y,zoomToFit:S,getZoom:()=>o.current,isAutoFit:()=>d.current,setContentSize:x}}const xp=2;function Wa({kind:e,width:t=44,className:n}){const s=p.useId().replace(/:/g,""),i=e==="association"?xe.association:e==="own-bkwd"?xe.ownBkwd:xe.ownFwd,r=e==="own-bkwd",o=e==="association",a=`es-${s}`,c=o?6:1,l=t-6;return h.jsxs("svg",{width:t,height:"14",viewBox:`0 0 ${t} 14`,className:`shrink-0 ${n??""}`,"aria-hidden":!0,children:[h.jsx("defs",{children:h.jsx("marker",{id:a,markerWidth:"5",markerHeight:"5",refX:r?.5:4.5,refY:"2.5",orient:"auto-start-reverse",markerUnits:"userSpaceOnUse",children:h.jsx("path",{d:r?"M5,0 L0,2.5 L5,5 z":"M0,0 L5,2.5 L0,5 z",fill:i})})}),h.jsx("line",{x1:c,y1:"7",x2:l,y2:"7",stroke:i,strokeWidth:xp,strokeDasharray:e==="association"?"5 4":void 0,markerStart:o?`url(#${a})`:void 0,markerEnd:`url(#${a})`})]})}const za={"owned-mine":{side:"left",kind:"own-bkwd"},"owned-theirs":{side:"left",kind:"own-fwd"},"owns-mine":{side:"right",kind:"own-fwd"},"owns-theirs":{side:"right",kind:"own-bkwd"},association:{side:"left",kind:"association"}},vp=300,Os=new Set;let Et;function ui(){Et!==void 0&&(clearTimeout(Et),Et=void 0)}function kt(e){ui();for(const t of Os)t(e)}function Ua(){ui(),Et=setTimeout(()=>{Et=void 0,kt(null)},vp)}function kp({label:e,rows:t,onAdd:n,onRemove:s,onInspect:i,colorOf:r,slotOrder:o,parentOf:a}){const[c,l]=p.useState(null),[d,f]=p.useState(null),u=p.useRef(null),m=p.useRef(null),g=p.useId();p.useEffect(()=>{const k=A=>{A!==g&&(l(null),f(null))};return Os.add(k),()=>{Os.delete(k)}},[g]),p.useEffect(()=>{if(!c)return;const k=C=>{C.target?.closest("[data-relation-bar]")||kt(null)},A=C=>{C.key==="Escape"&&kt(null)};return document.addEventListener("mousedown",k,!0),document.addEventListener("keydown",A),()=>{document.removeEventListener("mousedown",k,!0),document.removeEventListener("keydown",A)}},[c]);const b=k=>t.filter(A=>za[A.position].side===k),y=k=>new Set(b(k).map(A=>A.other)).size,x=y("left"),S=y("right");if(x===0&&S===0)return null;const v=(k,A)=>{const C=A?.getBoundingClientRect();C&&(kt(g),l(k),f({x:C.left,y:C.bottom+2}))},w=(k,A,C)=>{const E=c===k;return h.jsx("button",{ref:C,"data-relation-bar":!0,"data-no-drag":!0,disabled:A===0,"aria-label":k==="left"?`${A} classes ${e} belongs to`:`${A} classes ${e} owns`,onMouseEnter:()=>A>0&&v(k,C.current),onMouseLeave:Ua,onClick:L=>{L.stopPropagation(),A!==0&&(E?kt(null):v(k,C.current))},className:`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] leading-none
                    tabular-nums transition-colors
                    ${A===0?"text-gray-300 dark:text-slate-600 cursor-default":E?"bg-sky-200 dark:bg-sky-800 text-sky-900 dark:text-sky-100":"text-sky-800 dark:text-sky-200 hover:bg-sky-100 dark:hover:bg-sky-900"}`,children:k==="left"?h.jsxs(h.Fragment,{children:[h.jsx("span",{"aria-hidden":!0,children:"←"}),A]}):h.jsxs(h.Fragment,{children:[A,h.jsx("span",{"aria-hidden":!0,children:"→"})]})})};return h.jsxs(h.Fragment,{children:[w("left",x,u),h.jsx("span",{className:`flex-1 min-w-0 text-center text-[9px] text-gray-400
                       dark:text-slate-500 truncate select-none`,children:"related"}),w("right",S,m),c&&d&&tr.createPortal(h.jsx(Sp,{anchor:d,side:c,label:e,rows:b(c),onAdd:n,onRemove:s,onInspect:i,colorOf:r,slotOrder:o,parentOf:a}),document.body)]})}function Tp(e){const t=p.useRef(null),[n,s]=p.useState(e);return p.useEffect(()=>{const i=t.current;if(!i)return;const r=i.getBoundingClientRect(),o=8;s({x:Math.max(o,Math.min(e.x,window.innerWidth-r.width-o)),y:Math.max(o,Math.min(e.y,window.innerHeight-r.height-o))})},[e]),{ref:t,pos:n}}function Sp({anchor:e,side:t,label:n,rows:s,onAdd:i,onRemove:r,onInspect:o,colorOf:a,slotOrder:c,parentOf:l}){const{ref:d,pos:f}=Tp(e),u=w=>{const k=c?.indexOf(w.slot)??-1;return k===-1?Number.MAX_SAFE_INTEGER:k},m=[...s].sort((w,k)=>u(w)-u(k)||w.other.localeCompare(k.other)||w.slot.localeCompare(k.slot)),g=new Map,b=new Set;if(l){const w=new Map(m.map(k=>[`${k.slot}|${k.other}`,k]));for(const k of m){const A=l(k.other),C=A===void 0?void 0:w.get(`${k.slot}|${A}`);if(!C||C===k)continue;b.add(k);const E=`${k.slot}|${A}`;g.set(E,[...g.get(E)??[],k])}}const y=[],x=(w,k)=>{y.push({row:w,depth:k});for(const A of g.get(`${w.slot}|${w.other}`)??[])x(A,k+1)};for(const w of m)b.has(w)||x(w,0);const S=m.every(w=>w.drawn),v=[...new Set(m.map(w=>w.other))];return h.jsxs("div",{ref:d,"data-relation-bar":!0,onMouseEnter:ui,onMouseLeave:Ua,style:{left:f.x,top:f.y},className:`fixed z-50 w-max max-w-[min(46rem,calc(100vw-2rem))] max-h-[60vh]
                 overflow-y-auto overflow-x-hidden py-1
                 rounded-md border border-gray-300 dark:border-slate-600
                 bg-white dark:bg-slate-800 shadow-xl
                 text-gray-900 dark:text-gray-100`,children:[h.jsx("div",{className:"px-3 py-1 border-b border-gray-200 dark:border-slate-700",children:h.jsxs("div",{className:"text-[11px] font-semibold",children:[h.jsx("b",{children:n})," ",t==="left"?"belongs to":"owns"," ",v.length," ",v.length===1?"entity":"distinct entities",m.length!==v.length&&h.jsxs("span",{className:"font-normal text-gray-500 dark:text-slate-400",children:[" ","through ",m.length," attributes"]})]})}),h.jsx("button",{onClick:()=>v.forEach(w=>S?r(w):i(w)),className:`block w-full text-left px-3 py-1 text-[11px]
                   text-blue-600 dark:text-blue-400
                   hover:bg-gray-100 dark:hover:bg-slate-700`,children:S?`hide all ${v.length} entities`:`add all ${v.length} entities`}),h.jsx("table",{className:"w-full text-[11px]",children:h.jsx("tbody",{children:y.map(({row:w,depth:k})=>{const A=za[w.position].kind,C=k>0&&h.jsx("span",{"aria-hidden":!0,className:"text-gray-400 dark:text-slate-500 select-none",style:{paddingLeft:`${(k-1)*.75}rem`},children:"↳ "}),E=w.declaredBy===w.other?n:w.declaredBy,L=t==="left"?w.other:E,K=t==="left"?E:w.other;return h.jsxs("tr",{"data-family-depth":k,className:"hover:bg-gray-100 dark:hover:bg-slate-700",children:[h.jsx("td",{className:"pl-2 pr-1 py-0.5",children:h.jsx("button",{onClick:W=>{W.stopPropagation(),(w.drawn?r:i)(w.other)},"aria-label":w.drawn?`Remove ${w.other} from the diagram`:`Add ${w.other} to the diagram`,className:`w-4 h-4 rounded-sm leading-none text-[11px]
                                flex items-center justify-center border
                                ${w.drawn?"border-sky-300 bg-sky-50 text-sky-700 hover:bg-sky-200 dark:border-sky-700 dark:bg-sky-950 dark:text-sky-300":"border-gray-300 text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:border-slate-600 dark:hover:bg-slate-600"}`,children:w.drawn?"−":"+"})}),h.jsxs("td",{className:"pl-1 pr-2 py-0.5 text-right whitespace-nowrap",children:[t==="left"&&C,h.jsx(Wo,{cls:L,row:w,colorOf:a,onInspect:o})]}),h.jsx("td",{className:`px-2 py-0.5 font-mono text-gray-400 dark:text-slate-500
                               whitespace-nowrap tabular-nums text-right`,children:w.cardinality}),h.jsx("td",{className:"px-1 py-0.5 align-middle",children:h.jsx(Wa,{kind:A,width:30})}),h.jsxs("td",{className:"pr-3 py-0.5 whitespace-nowrap",children:[t==="right"&&C,h.jsx(Wo,{cls:K,row:w,colorOf:a,onInspect:o})]})]},`${w.declaredBy}.${w.slot}->${w.other}`)})})})]})}function Wo({cls:e,row:t,colorOf:n,onInspect:s}){const i=n?.(e),r=e===t.declaredBy,o=i?{color:i.text}:void 0;return h.jsxs("span",{className:"font-mono",children:[s?h.jsx("button",{onClick:a=>{a.stopPropagation(),s(e)},title:`Open ${e}'s details`,className:"hover:underline",style:o,children:e}):h.jsx("span",{style:o,children:e}),r&&h.jsxs("span",{className:i?"opacity-80":"text-gray-500 dark:text-slate-400",style:o,children:[".",t.slot]})]})}const Se={sibs:!0,dir:"RIGHT",merge:"near",legend:!1,cases:!1},Ga=["legend","cases"];function Cp(e,t){if(e.get("panels")!=="0")return t;for(const n of Ga)t[n]=!1;return t.detail=null,t}const Tt={dir:"explore-nl-dir",merge:"explore-nl-merge",sibs:"explore-nl-sibs"},En="~",Ap=["exp","hidden","owners"],Pp=["tour"];let Mt;function Ep(e=window.location.search){return Mt===void 0&&(Mt=new URLSearchParams(e).get("tour")==="1"),Mt}function Mp(e,t){const n=e.get(t);return n?n.split(En).filter(Boolean):[]}function Ka(e){const t=e.get("cat");if(!t)return[];const n=t.split(new RegExp(`[,${En}]`)).filter(Boolean);return[...new Set(n.flatMap(s=>{const i=nr.find(r=>r.id===s);return i?sr(i):[]}))]}function Jt(e){try{return localStorage.getItem(e)}catch{return null}}function Dp(e,t){try{localStorage.setItem(e,t)}catch{}}function en(e,t){return e&&t.includes(e)?e:null}function Ie(e=window.location.search){const t=new URLSearchParams(e),n=en(t.get("dir"),["RIGHT","DOWN"])??en(Jt(Tt.dir),["RIGHT","DOWN"])??Se.dir,s=en(t.get("merge"),["near","far","bend","off"])??en(Jt(Tt.merge),["near","far","bend","off"])??Se.merge,i=t.has("sibs")?t.get("sibs")==="1":Jt(Tt.sibs)!==null?Jt(Tt.sibs)!=="0":Se.sibs,r=Mp(t,"sel"),o=Cp(t,{legend:t.get("legend")==="1",cases:t.get("cases")==="1",detail:t.get("detail")||null});return t.has("legend")&&(o.legend=t.get("legend")==="1"),t.has("cases")&&(o.cases=t.get("cases")==="1"),t.has("detail")&&(o.detail=t.get("detail")||null),{sel:r.length?r:Ka(t),detail:o.detail,roots:t.get("roots")==="1",sibs:i,dir:n,merge:s,legend:o.legend,cases:o.cases}}function Qa(e,{push:t=!1}={}){const n=new URL(window.location.href),s=n.searchParams,i=(o,a)=>{a.length===0?s.delete(o):s.set(o,[...a].sort().join(En))},r=(o,a,c)=>{c?s.delete(o):s.set(o,a)};for(const o of Ap)s.delete(o);Mt===void 0&&s.has("tour")&&(Mt=s.get("tour")==="1");for(const o of Pp)s.delete(o);i("sel",e.sel),e.detail?s.set("detail",e.detail):s.delete("detail"),r("roots","1",!e.roots),r("sibs",e.sibs?"1":"0",e.sibs===Se.sibs),r("dir",e.dir,e.dir===Se.dir),r("merge",e.merge,e.merge===Se.merge),r("legend","1",e.legend===Se.legend),r("cases","1",e.cases===Se.cases),s.delete("panels"),s.delete("cat"),t?window.history.pushState(null,"",n):window.history.replaceState(null,"",n)}function zo(e,t){Dp(Tt[e],typeof t=="boolean"?t?"1":"0":String(t))}function Op(e,t=window.location.href){const n=new URL(t),s=new URLSearchParams,i=(r,o)=>s.set(r,o);return e.sel.length&&i("sel",[...e.sel].sort().join(En)),e.detail&&i("detail",e.detail),e.roots&&i("roots","1"),e.sibs!==Se.sibs&&i("sibs",e.sibs?"1":"0"),e.dir!==Se.dir&&i("dir",e.dir),e.merge!==Se.merge&&i("merge",e.merge),e.legend!==Se.legend&&i("legend","1"),e.cases!==Se.cases&&i("cases","1"),n.search=s.toString(),n.toString()}const ke=240,tt=30,Rp=.6,nt=20,jp=1/0,fi=22,qa=18,at=28;function Xa(e,t,n=()=>!1){const s=new Map;for(const i of e){if(n(i.other))continue;const r=i.position,o=s.get(r)??new Map,a=o.get(i.other)??[];a.includes(i.slot)||a.push(i.slot),o.set(i.other,a),s.set(r,o)}return Ml.filter(i=>s.has(i)).map(i=>{const r=[...s.get(i)].map(([o,a])=>({other:o,slots:a,drawn:t(o)})).sort((o,a)=>o.other.localeCompare(a.other));return{position:i,label:Dl(i,r.length),items:r}})}function Ya(e,t,n=()=>!1){const s=new Set,i=[];for(const r of e){if(n(r.other))continue;const o=`${r.declaredBy}.${r.slot}->${r.other}:${r.position}`;s.has(o)||(s.add(o),i.push({other:r.other,position:r.position,slot:r.slot,declaredBy:r.declaredBy,cardinality:r.cardinality,drawn:t(r.other)}))}return i}function ae(e){return e.storageDirection==="flipped"?e.target:e.source}function Rs(e){return e.anchorClass??ae(e)}function Lp(e,t,n,s,i){const r=new Map,o=new Map,a=[],c=new Set;for(const u of e.edges)u.type==="isa"?(r.set(u.target,[...r.get(u.target)??[],u.source]),o.set(u.source,(o.get(u.source)??0)+1)):u.isLoop||(a.push(u),c.add(`${ae(u)}|${u.slotName}`));const l=new Set(e.nodes.map(u=>u.id)),d=e.nodes.map(u=>{const m=new Map(n(u.id).map((O,B)=>[O.name,B])),g=(O,B)=>(m.get(O.slot)??Number.MAX_SAFE_INTEGER)-(m.get(B.slot)??Number.MAX_SAFE_INTEGER),b=u.slots.map(O=>({...O,connected:O.isLoop||c.has(`${u.id}|${O.slot}`),rangeColor:s(O.range),targetColor:i(O.range)})).sort(g),y=new Set(b.map(O=>O.slot)),x=n(u.id).filter(O=>!y.has(O.name)).map(O=>({slot:O.name,range:O.range,channel:"plain",flipped:!1,cardinality:Cl(O.required,O.multivalued),isLoop:!1,connected:!1,rangeColor:s(O.range)})),S=b.filter(O=>O.connected),v=[...b.filter(O=>!O.connected),...x].sort(g),w=[...S,...v].slice(0,Math.max(jp,S.length)),k=w.length===S.length+v.length,A=t.has(u.id)||k,C=A?[...S,...v]:w,E=k?0:S.length+v.length-w.length,L=e.hiddenOwners.get(u.id)??[],K=e.hiddenOwned.get(u.id)??[],W=Xa(u.relations,O=>l.has(O),O=>O===u.id),I=Ya(u.relations,O=>l.has(O),O=>O===u.id);return{...u,isaParents:r.get(u.id)??[],subclassCount:o.get(u.id)??0,members:[],hiddenOwners:L,hiddenOwned:K,relationGroups:W,relationRows:I,...Za(W),rows:C,allRows:[...S,...v],hiddenCount:E,expanded:A,height:Ja(C.length,E,W.length>0)}}),f=new Map;for(const u of a){const m=ae(u)===u.source?u.target:u.source,g=i(m);g&&f.set(u.id,g)}return{nodes:d,edges:a,edgeColors:f}}function Za(e){const t=new Map;for(const n of e)for(const s of n.items)t.set(s.other,(t.get(s.other)??!1)||s.drawn);return{relatedCount:t.size,shownCount:[...t.values()].filter(Boolean).length}}function Ja(e,t,n){return tt+(n?fi:0)+e*nt+(t?qa:0)+(e?5:0)}function Np(e,t,n,s,i,r,o){const a=Al(e.nodes.map(x=>x.id),t,n);if(!a.size)return e;const c=new Map(e.nodes.map(x=>[x.id,x])),l=new Set(e.nodes.map(x=>x.id)),d=new Map,f=[],u=new Map;for(const[x,S]of a){const v=Ol(x),w=S.map(M=>({id:M,label:c.get(M)?.label??M,color:Pl(o(M))}));for(const M of w)d.set(M.id,v);const k=c.has(x);k&&d.set(x,v);const A=new Map(w.map(M=>[M.id,M])),C=new Map,E=k?[x,...S]:S;for(const M of E){const q=c.get(M);if(!q)continue;const pe=M===x;for(const oe of q.allRows){const ve=s(M,oe.slot),Me=ve!==void 0&&ve!==M,Le=`${pe||Me?ve??x:M}|${oe.slot}`,z=C.get(Le),G=A.get(M),Z=pe||Me?z?.owners??[]:[...z?.owners??[],...G?[G]:[]];C.set(Le,{...z??oe,connected:(z?.connected??!1)||oe.connected,owners:Z,declaringClass:Le.slice(0,Le.indexOf("|"))})}}const L=new Map;for(const M of C.values())if(M.targetColor)for(const q of M.owners??[])L.has(q.id)||L.set(q.id,M.targetColor);for(const M of w){const q=L.get(M.id);q&&(M.color=q)}for(const[M,q]of C)q.targetColor&&u.set(`${v}|${M}`,q.targetColor);const K=[...C.values()],W=M=>{const q=M.owners?.length?M.owners[0].id:x;return r(q,M.slot)};K.sort((M,q)=>W(M)-W(q));const I=El(K,w,M=>({slot:`::hdr:${M.id}`,range:"",channel:"plain",flipped:!1,cardinality:"",isLoop:!1,connected:!1,rangeColor:"",header:M})),O=M=>!d.has(M)&&!E.includes(M),B=[...new Set(E.flatMap(M=>c.get(M)?.hiddenOwners??[]))].filter(O),Y=[...new Set(E.flatMap(M=>c.get(M)?.hiddenOwned??[]))].filter(O),te=Xa(E.flatMap(M=>c.get(M)?.relations??[]),M=>l.has(M),M=>!O(M)),ge=Ya(E.flatMap(M=>c.get(M)?.relations??[]),M=>l.has(M),M=>!O(M)),R=c.get(S[0]),$=i(x);f.push({...R,id:v,label:x,description:$.description,abstract:$.abstract,slots:[],members:w,role:E.some(M=>c.get(M)?.role==="selected")?"selected":"context",layer:Math.min(...E.map(M=>c.get(M)?.layer??0)),isaParents:[],subclassCount:w.length,hiddenOwners:B,hiddenOwned:Y,relationGroups:te,relationRows:ge,...Za(te),rows:I,allRows:K,hiddenCount:0,expanded:!0,height:Ja(I.length,0,te.length>0)})}const m=[...e.nodes.filter(x=>!d.has(x.id)),...f],g=new Set,b=e.edges.map(x=>({...x,source:d.get(x.source)??x.source,target:d.get(x.target)??x.target,entityMember:(()=>{if(x.inducedFrom!==void 0)return;const S=ae(x)===x.source?x.target:x.source;return d.has(S)?S:void 0})(),anchorClass:d.has(ae(x))?s(ae(x),x.slotName)??ae(x):ae(x)})).filter(x=>{if(!os(x.source)&&!os(x.target))return!0;const S=`${x.source}|${x.target}|${x.anchorClass}|${x.slotName}|${x.storageDirection}`;return g.has(S)?!1:(g.add(S),!0)}).filter(x=>x.source!==x.target),y=new Map(e.edgeColors);for(const x of b){const S=u.get(`${ae(x)}|${Rs(x)}|${x.slotName}`);S&&y.set(x.id,S)}return{nodes:m,edges:b,edgeColors:y}}function Vp({title:e}){return h.jsxs("svg",{viewBox:"0 0 16 16",width:"15",height:"15","aria-hidden":"false",className:"shrink-0",style:{color:xt.entity},children:[h.jsx("title",{children:e}),h.jsx("path",{d:"M12.33 10.5 A5 5 0 1 1 12.33 5.5",fill:"none",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round"}),h.jsx("path",{d:"M13.7 7.9 L10.6 6.7 L13.7 4.2 Z",fill:"currentColor"})]})}function el(e){return tt+(e.relationGroups.length>0?fi:0)}function tl(e,t,n){const s=e.rows.findIndex(i=>i.slot===t&&!i.header&&(!n||!i.declaringClass||i.declaringClass===n));if(s<0)throw new Error(`No displayed row for ${t} on ${e.id}`);return el(e)+s*nt+nt/2}function Ip(e,t){const n=e.rows.findIndex(s=>s.header?.id===t);if(!(n<0))return el(e)+n*nt+nt/2}function js(e,t){if(e.storageDirection==="flipped"||!t.members.length)return;const n=e.entityMember;return n&&t.members.some(s=>s.id===n)?n:void 0}const Bp=4,$p=10,nl=12,We=nl,Xn=nl*1.5,Yn=0,Uo=.85,sl=1.4,il=2.6,Fp=sl*.75,_p=il*.75;function Go(e,t){return e?t?xe.ownBkwd:xe.ownFwd:xe.association}function Zn(e,t){if(e==="off"||t.length<2)return 0;if(e==="near")return 40;if(e==="far")return 120;const n=t[t.length-1],s=t[t.length-2];return Math.hypot(n.x-s.x,n.y-s.y)}function Ko(e,t){return e<2?0:Math.min(Bp,t/(e-1))}function Hp(e,t){const n=new Map,s=(l,d,f,u)=>{const m=n.get(l.id)??[];return m.some(g=>g.id===d)||(m.push({id:d,x:f,y:u}),n.set(l.id,m)),d},i=new Map(e.nodes.map(l=>[l.id,l])),r=l=>{const d=i.get(ae(l)===l.source?l.target:l.source);return!!d&&js(l,d)!==void 0},o=new Map;for(const l of e.edges){if(r(l))continue;const d=ae(l)===l.source?l.target:l.source,f=`${d}|${d===l.source?"out":"in"}`;o.set(f,(o.get(f)??0)+1)}const a=new Map,c=e.edges.map(l=>{const d=i.get(ae(l)),f=i.get(ae(l)===l.source?l.target:l.source);if(!d||!f)throw new Error(`Edge ${l.id} endpoint missing from subgraph`);const u=l.storageDirection==="flipped",m=tl(d,l.slotName,Rs(l)),g=s(d,`${d.id}::row:${Rs(l)}|${l.slotName}`,u?0:ke,m),b=f.id===l.source,y=`${f.id}|${b?"out":"in"}`,x=js(l,f),S=x!==void 0?Ip(f,x):void 0;let v;if(x!==void 0&&S!==void 0)v=s(f,`${f.id}::mhdr:${b?"out":"in"}:${x}`,t==="RIGHT"?b?ke:0:ke/2,t==="RIGHT"?S:b?f.height:0);else{const w=o.get(y)??1,k=a.get(y)??0;a.set(y,k+1);const A=Ko(w,tt-4),C=tt/2+(k-(w-1)/2)*A;v=t==="RIGHT"?s(f,`${f.id}::hdr:${b?"out":"in"}:${k}`,b?ke:0,C):s(f,`${f.id}::hdr:${b?"out":"in"}:${k}`,ke/2+(k-(w-1)/2)*Ko(w,ke/2),b?f.height:0)}return{id:l.id,source:l.source,target:l.target,sourcePort:u?v:g,targetPort:u?g:v}});return{nodes:e.nodes.map(l=>({id:l.id,width:ke,height:l.height,partition:l.layer,ports:n.get(l.id)})),edges:c}}function Wp(e,t){if(!e?.length)return e;const n=e[0],s=n.bendPoints?.length?n.bendPoints[n.bendPoints.length-1]:n.startPoint,i=n.endPoint.x-s.x,r=n.endPoint.y-s.y,o=Math.hypot(i,r);if(o<1)return e;const a=Math.min(t,o*.8)/o,c={x:n.endPoint.x-i*a,y:n.endPoint.y-r*a};return[{...n,endPoint:c},...e.slice(1)]}function zp(e,t){if(!e?.length)return e;const n=e[0],s=n.bendPoints?.length?n.bendPoints[0]:n.endPoint,i=s.x-n.startPoint.x,r=s.y-n.startPoint.y,o=Math.hypot(i,r);if(o<1)return e;const a=Math.min(t,o*.8)/o,c={x:n.startPoint.x+i*a,y:n.startPoint.y+r*a};return[{...n,startPoint:c},...e.slice(1)]}function Up({dataService:e,selectedIds:t,onNodeClick:n,onAdd:s,onRemove:i,pathToRoot:r=!1,onTogglePathToRoot:o,direction:a,setDirection:c,mergeMode:l,setMergeMode:d}){const f=p.useId().replace(/[^a-zA-Z0-9]/g,""),u=T=>`${T}-${f}`,[m,g]=p.useState(new Set),b=p.useMemo(()=>e.getOwnershipSubgraph([...t].sort(),{pathToRoot:r}),[e,t,r]),y=p.useCallback(T=>e.getTargetColor(T),[e]),x=p.useMemo(()=>new Map(b.nodes.map(T=>[T.id,e.getClassSummary(T.id)?.slots??[]])),[e,b]),S=p.useMemo(()=>Lp(b,m,T=>x.get(T)??[],T=>e.getRangeColor(T),T=>e.getTargetColor(T)),[b,m,x,e]),v=p.useMemo(()=>new Map(b.nodes.map(T=>[T.id,e.getClassSummary(T.id)])),[e,b]),w=p.useMemo(()=>{const T=P=>v.get(P)?.parentId,D=P=>!Rl.has(P),j=(P,V)=>P.range===V.range&&P.multivalued===V.multivalued;return Np(S,T,D,(P,V)=>{const _=e.getClassSummary(P)?.slots.find(le=>le.name===V);if(!_)return;if(!_.inheritedFrom)return P;const X=e.getClassSummary(_.inheritedFrom)?.slots.find(le=>le.name===V);return X&&j(_,X)?_.inheritedFrom:P},P=>{const V=e.getClassSummary(P);return{description:V?.description??"",abstract:V?.isAbstract??!1}},(P,V)=>{const _=e.getClassSummary(P)?.slots.findIndex(X=>X.name===V)??-1;return _<0?Number.MAX_SAFE_INTEGER:_},P=>e.siblingColorIndexOf(P))},[S,v,e]),[k,A]=p.useState(new Map),[C,E]=p.useState(new Map),L=p.useMemo(()=>Hp(w,a),[w,a]),{latest:K,inProgress:W}=rp(L,{direction:a,usePartitions:!0,nodeSpacing:28,layerSpacing:72,extraLayoutOptions:{"elk.spacing.edgeNode":"18","elk.spacing.edgeEdge":"12","elk.layered.spacing.edgeNodeBetweenLayers":"18","elk.layered.spacing.edgeEdgeBetweenLayers":"10"}}),I=K?.spec===L?K.layout:null,O=K?.layout??null,B=bp(),Y=(O?.width??0)+at*2,te=(O?.height??0)+at*2;p.useEffect(()=>{I&&(B.setContentSize(Y,te),B.isAutoFit()&&B.zoomToFit())},[I,Y,te]),p.useEffect(()=>A(new Map),[I]),p.useEffect(()=>E(new Map),[I]);const[ge,R]=p.useState(!1),$=p.useRef(!0);p.useEffect(()=>{if(!I){R(!1),O||($.current=!0);return}const T=$.current?0:wp();if($.current=!1,T===0){R(!0);return}const D=setTimeout(()=>R(!0),T);return()=>clearTimeout(D)},[I,O]);const M=p.useRef(new Map),q=p.useRef(!1),pe=p.useRef(k);pe.current=k;const oe=p.useMemo(()=>{const T=new Map((O?.nodes??[]).map(j=>[j.id,j])),D=new Map(C);for(const[j,F]of k)D.set(j,F);for(const[j,{dx:F,dy:H}]of D){const Q=T.get(j);Q&&T.set(j,{...Q,x:Q.x+F,y:Q.y+H})}return M.current=T,T},[O,k,C]),[ve,Me]=p.useState(!1);p.useEffect(()=>{if(!W){Me(!1);return}const T=setTimeout(()=>Me(!0),fp);return()=>clearTimeout(T)},[W]);const Le=p.useCallback((T,D)=>{if(D.button!==0||D.target.closest('button, a, [role="button"], [data-no-drag]'))return;D.stopPropagation();const j=D.clientX,F=D.clientY,H=B.getZoom()||1,Q=k.get(T)??{dx:0,dy:0},P=D.currentTarget;P.setPointerCapture(D.pointerId);let V=!1;const _=le=>{const Te=(le.clientX-j)/H,De=(le.clientY-F)/H;!V&&Math.hypot(Te,De)<3||(V=!0,q.current=!0,A(Qe=>new Map(Qe).set(T,{dx:Q.dx+Te,dy:Q.dy+De})))},X=le=>{if(P.releasePointerCapture(le.pointerId),P.removeEventListener("pointermove",_),P.removeEventListener("pointerup",X),V){const Te=pe.current.get(T);Te&&E(De=>new Map(De).set(T,Te))}};P.addEventListener("pointermove",_),P.addEventListener("pointerup",X)},[k]),z=p.useMemo(()=>new Map(w.nodes.map(T=>[T.id,T.role])),[w]),G=p.useMemo(()=>new Map(w.edges.map(T=>[T.id,T])),[w]),Z=p.useMemo(()=>{const T=new Map(w.nodes.map(D=>[D.id,D]));return new Set(w.edges.filter(D=>{const j=T.get(ae(D)===D.source?D.target:D.source);return!!j&&js(D,j)!==void 0}).map(D=>D.id))},[w]),se=p.useMemo(()=>{const T=new Map;if(!I)return T;for(const D of w.edges){const j=ae(D)===D.source?D.target:D.source,F=oe.get(j);if(!F||Z.has(D.id))continue;const H=j===D.source,Q=`${j}|${H?"out":"in"}`;if(T.has(Q))continue;const P=H,V=Yn+Xn;T.set(Q,a==="RIGHT"?{base:{x:P?F.x+ke+V:F.x-V,y:F.y+tt/2},dir:{x:P?-1:1,y:0}}:{base:{x:F.x+ke/2,y:P?F.y+F.height+V:F.y-V},dir:{x:0,y:P?-1:1}})}return T},[w,oe,I,a,Z]),me=p.useMemo(()=>{const T=new Map,D=new URLSearchParams(window.location.search).has("dbg"),j=new Set([...C.keys(),...k.keys()]);if(!I||j.size===0)return T;D&&console.log(`[drag] moved: ${[...j].join(", ")}`);const F=new Map(w.nodes.map(H=>[H.id,H]));for(const H of w.edges){const Q=ae(H),P=Q===H.source?H.target:H.source;if(!j.has(Q)&&!j.has(P))continue;const V=oe.get(Q),_=oe.get(P),X=F.get(Q);if(!V||!_||!X)continue;const le=H.storageDirection==="flipped",Te=a==="RIGHT";let De;try{De=tl(X,H.slotName)}catch{D&&console.log(`   SKIP ${Q}.${H.slotName}: row not displayed`);continue}const Qe=Te?{x:V.x+(le?0:ke),y:V.y+De}:{x:V.x+ke/2,y:V.y+De},He=Te?{x:le?-1:1,y:0}:{x:0,y:1},rt=P===H.source,Ht=Te?{x:rt?_.x+ke:_.x,y:_.y+tt/2}:{x:_.x+ke/2,y:rt?_.y+_.height:_.y},Rn=Te?{x:rt?1:-1,y:0}:{x:0,y:rt?1:-1};T.set(H.id,op(Qe,Ht,He,Rn)),D&&console.log(`   reroute ${Q}.${H.slotName} -> ${P}`)}return D&&console.log(`[drag] rerouted ${T.size} edge(s)`),T},[I,k,C,w,oe,a]);p.useEffect(()=>{if(!I||!new URLSearchParams(window.location.search).has("dbg"))return;const T=new Map;for(const D of I.edges){const j=G.get(D.id);if(!j)continue;const F=Xt(D.sections);if(F.length<2)continue;const H=ae(j)===j.source?j.target:j.source;let Q=0,P=0;for(let _=1;_<F.length;_++){const X=Math.abs(F[_].x-F[_-1].x),le=Math.abs(F[_].y-F[_-1].y);X>.5&&le>.5&&P++,_>1&&Q++}const V=ae(j);T.set(H,[...T.get(H)??[],`${V}.${j.slotName}  pts=${F.length} bends=${Q}${P?` DIAGONAL x${P}`:""}  start=(${Math.round(F[0].x)},${Math.round(F[0].y)}) end=(${Math.round(F[F.length-1].x)},${Math.round(F[F.length-1].y)})`])}for(const[D,j]of T){if(j.length<2)continue;console.log(`
=== approaches to ${D} (${j.length}) ===`);const F=oe.get(D);F&&console.log(`   box at (${Math.round(F.x)},${Math.round(F.y)}) h=${Math.round(F.height)}`),j.forEach(H=>console.log("   "+H))}},[I,G,oe]);const U=p.useMemo(()=>{const T=new Map;if(!I)return T;for(const D of I.edges){const j=G.get(D.id);if(!j||j.storageDirection==="flipped"||Z.has(D.id)||Zn(l,Xt(D.sections))<=0)continue;const F=ae(j)===j.source?j.target:j.source,H=`${F}|${F===j.source?"out":"in"}`,Q=se.get(H);if(!Q)continue;const P=j.type==="ownership",V=z.get(j.source)==="context"||z.get(j.target)==="context",_=w.edgeColors.get(D.id),X=T.get(H);T.set(H,X?{...X,isOwn:X.isOwn||P,dimmed:X.dimmed&&V,edgeIds:[...X.edgeIds,D.id],...X.color?.text===_?.text?{}:{color:void 0}}:{...Q,isOwn:P,dimmed:V,edgeIds:[D.id],..._?{color:_}:{}})}return T},[I,G,se,l,z,w,Z]),ne=p.useMemo(()=>new Set(w.nodes.map(T=>T.id)),[w]),de=p.useCallback(T=>!!s&&T.channel!=="plain"&&!T.isLoop&&!ne.has(T.range),[s,ne]),Ce=p.useRef(null),Dn=p.useRef(null),On=p.useRef(void 0),bi=p.useMemo(()=>{const T=new Map,D=new Map;for(const j of w.edges){D.set(j.id,[j.source,j.target]);for(const F of[j.source,j.target])T.set(F,[...T.get(F)??[],j.id])}return{nodeEdges:T,edgeEnds:D}},[w]),xi=p.useRef(bi);xi.current=bi;const ot=p.useCallback(T=>{On.current=T,Dn.current===null&&(Dn.current=requestAnimationFrame(()=>{Dn.current=null;const D=On.current;On.current=void 0;const j=Ce.current,F=B.wrapperRef.current;if(D===void 0||!j||!F)return;let H=null,Q=null;if(D){const{nodeEdges:V,edgeEnds:_}=xi.current;if(D.kind==="node"){H=new Set(V.get(D.id)??[]),Q=new Set([D.id]);for(const X of H)for(const le of _.get(X)??[])Q.add(le)}else H=new Set([D.id]),Q=new Set(_.get(D.id)??[])}const P=(V,_,X)=>{V.style.filter=_===null||_?"":`opacity(${X})`};j.querySelectorAll("path[data-edge-id]").forEach(V=>{const _=V.dataset.edgeId??"",X=H?H.has(_):null;P(V,X,.38),V.style.strokeWidth=X?String(V.dataset.channel==="reference"?_p:il):""}),j.querySelectorAll("path[data-arrowhead]").forEach(V=>{const _=(V.dataset.arrowhead??"").split(" ");P(V,H?_.some(X=>H.has(X)):null,.08)}),F.querySelectorAll("[data-node-id]").forEach(V=>{P(V,Q?Q.has(V.dataset.nodeId??""):null,.25)})}))},[]);p.useEffect(()=>ot(null),[w,I,ot]);const vl=T=>g(D=>{const j=new Set(D);return j.has(T)?j.delete(T):j.add(T),j}),vi=T=>{zo("dir",T),c(T)},Ft=T=>{zo("merge",T),d(T)},_t=e.getConceptLabel("attribute",!0).toLowerCase(),_e=T=>`px-2 py-0.5 text-xs rounded border ${T?"border-blue-500 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300":"border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700"}`;return h.jsxs("div",{className:"relative w-full h-full",children:[h.jsxs("div",{"data-pan-ignore":!0,className:"absolute top-2 right-2 z-10 flex gap-1 items-center",children:[ve&&h.jsxs("div",{className:`mr-2 flex items-center gap-2 rounded px-2 py-1
                          text-xs text-gray-500 dark:text-gray-400
                          bg-white/80 dark:bg-slate-900/80 shadow-sm`,children:[h.jsx("span",{className:`inline-block h-3 w-3 animate-spin rounded-full
                             border-2 border-gray-300 border-t-gray-600
                             dark:border-slate-600 dark:border-t-slate-300`}),"Computing layout…"]}),o&&h.jsxs(h.Fragment,{children:[h.jsx("button",{className:_e(r),title:r?"Hide owners: show only what you selected":"Show every owner up to the root (can pull in most of the schema)",onClick:o,children:"⇱ roots"}),h.jsx("span",{className:"w-px h-4 bg-gray-300 dark:bg-slate-600 mx-1"})]}),h.jsx("button",{className:_e(a==="RIGHT"),title:"Layout left to right",onClick:()=>vi("RIGHT"),children:"LR"}),h.jsx("button",{className:_e(a==="DOWN"),title:"Layout top down",onClick:()=>vi("DOWN"),children:"TB"}),h.jsx("span",{className:"w-px h-4 bg-gray-300 dark:bg-slate-600 mx-1"}),h.jsx("button",{className:_e(l==="near"),title:"Merge converging edges near the node (~40px)",onClick:()=>Ft("near"),children:"⋙"}),h.jsx("button",{className:_e(l==="far"),title:"Merge converging edges early (~120px)",onClick:()=>Ft("far"),children:"⋙⋙"}),h.jsx("button",{className:_e(l==="bend"),title:"Merge at ELK's last corner",onClick:()=>Ft("bend"),children:"⌙"}),h.jsx("button",{className:_e(l==="off"),title:"No merging — every edge runs to its own port",onClick:()=>Ft("off"),children:"≡"}),h.jsx("span",{className:"w-px h-4 bg-gray-300 dark:bg-slate-600 mx-1"}),[["+",()=>B.zoomBy(1.3),"Zoom in"],["−",()=>B.zoomBy(1/1.3),"Zoom out"],["1:1",()=>B.applyZoom(1),"Reset zoom"],["⛶",()=>B.zoomToFit(),"Fit to view"]].map(([T,D,j])=>h.jsx("button",{onClick:D,title:j,className:_e(!1),children:T},T))]}),h.jsx("div",{ref:B.containerRef,"data-graph-direction":a,className:"w-full h-full overflow-auto cursor-grab",children:h.jsx("div",{ref:B.spacerRef,children:h.jsx("div",{ref:B.wrapperRef,className:"relative",children:O&&h.jsxs(h.Fragment,{children:[h.jsxs("svg",{ref:Ce,className:"absolute top-0 left-0 pointer-events-none",width:Y,height:te,children:[h.jsxs("defs",{children:[h.jsx("marker",{id:u("arrow-own"),viewBox:"0 0 10 7",refX:"0",refY:"3.5",markerWidth:We,markerHeight:We*.75,markerUnits:"userSpaceOnUse",orient:"auto-start-reverse",children:h.jsx("path",{d:"M0,0L10,3.5L0,7Z",fill:xe.ownFwd})}),h.jsx("marker",{id:u("arrow-own-back"),viewBox:"0 0 10 7",refX:"10",refY:"3.5",markerWidth:We,markerHeight:We*.75,markerUnits:"userSpaceOnUse",orient:"auto-start-reverse",children:h.jsx("path",{d:"M10,0L0,3.5L10,7Z",fill:xe.ownBkwd})}),h.jsx("marker",{id:u("arrow-assoc"),viewBox:"0 0 10 7",refX:"0",refY:"3.5",markerWidth:We*Uo,markerHeight:We*.75*Uo,markerUnits:"userSpaceOnUse",orient:"auto-start-reverse",children:h.jsx("path",{d:"M0,0L10,3.5L0,7Z",fill:xe.association})})]}),h.jsxs("g",{transform:`translate(${at}, ${at})`,style:{opacity:ge?1:0,transition:`opacity ${yp()}ms`},children:[[...U].map(([T,D])=>h.jsx("path",{"data-arrowhead":D.edgeIds.join(" "),d:ip(D.base,D.dir,We,Xn),fill:D.color?.text??Go(D.isOwn,!1),opacity:D.dimmed?.4:1,style:{transition:`filter ${Zt()}ms`}},`head-${T}`)),(I?.edges??[]).map(T=>{const D=G.get(T.id);if(!D)throw new Error(`Routed edge ${T.id} missing from view model`);const j=D.storageDirection==="flipped",F=ae(D)===D.source?D.target:D.source,H=j||Z.has(T.id)?void 0:se.get(`${F}|${F===D.source?"out":"in"}`),Q=me.get(T.id),P=!!H&&Zn(l,Q??Xt(T.sections))>0,V=D.type!=="ownership",_=P?T.sections:Wp(T.sections,We+Yn+(j?2:0)),X=V?zp(_,Xn+Yn):_,le=Q??Xt(X),Te=Rn=>Jf(Rn,$p),De=Zn(l,le),Qe=H&&De>0?np(le,H.base,De,Te):Te(le);if(!Qe)return null;const He=D.type==="ownership",rt=z.get(T.source)==="context"||z.get(T.target)==="context",Ht=P?void 0:He?j?"arrow-own-back":"arrow-own":"arrow-assoc";return h.jsxs("g",{children:[h.jsx("path",{"data-edge-id":T.id,"data-channel":He?"ownership":"reference",d:Qe,fill:"none",opacity:rt?.4:1,stroke:w.edgeColors.get(T.id)?.text??Go(He,j),strokeWidth:He?sl:Fp,strokeDasharray:He?void 0:"5 4",markerEnd:Ht?`url(#${u(Ht)})`:void 0,markerStart:!He&&!P?`url(#${u("arrow-assoc")})`:void 0,style:{transition:`filter ${Zt()}ms, stroke-width ${Zt()}ms`}}),h.jsx("path",{d:Qe,fill:"none",stroke:"transparent",strokeWidth:11,style:{pointerEvents:"stroke"},onMouseEnter:()=>ot({kind:"edge",id:T.id}),onMouseLeave:()=>ot(null)})]},T.id)})]})]}),h.jsx(Iu,{initial:!1,children:w.nodes.map(T=>{const D=oe.get(T.id);if(!D)return null;const j=T.role==="context",F=D.x+at,H=D.y+at,Q={duration:Yt(k.has(T.id)?0:Ha()),ease:pp};return h.jsxs(Kf.div,{initial:{opacity:0,x:F,y:H},animate:{opacity:j?Rp:1,x:F,y:H},exit:{opacity:0,transition:{duration:Yt(_o())}},transition:{x:Q,y:Q,opacity:{duration:Yt(_o()),delay:Yt(gp())}},"data-node-id":T.id,"data-help-id":Wl(T),"data-pan-ignore":!0,"data-pinned":C.has(T.id)?"":void 0,onPointerDown:P=>Le(T.id,P),onClick:()=>{if(q.current){q.current=!1;return}n?.(T.members.length?T.label:T.id)},onMouseEnter:()=>ot({kind:"node",id:T.id}),onMouseLeave:()=>ot(null),className:`absolute rounded-md text-xs bg-white dark:bg-slate-800 cursor-pointer ${j?"border border-dashed border-gray-400 dark:border-slate-500":C.has(T.id)?"border-2 border-amber-500 dark:border-amber-400 shadow-md":"border-2 border-slate-500 dark:border-slate-400 shadow-md"}`,style:{width:ke,height:T.height,transition:`filter ${Zt()}ms`},children:[h.jsxs("div",{className:"flex items-center gap-1 px-2 rounded-t-[4px] bg-slate-700 dark:bg-slate-700 text-white border-b border-slate-800 dark:border-slate-600",style:{height:tt},children:[h.jsx("span",{className:`font-semibold truncate ${T.abstract?"italic":""}`,title:T.description||T.id,children:T.label}),h.jsxs("span",{className:"ml-auto flex gap-1 shrink-0",children:[T.members.length>0&&h.jsxs("span",{title:`${T.members.length} classes that are a ${T.label}, merged into one box`,className:"text-[9px] px-1 rounded bg-sky-100 dark:bg-sky-900 text-sky-800 dark:text-sky-200",children:["⑃ ",T.members.length]}),T.isaParents.map(P=>h.jsxs("span",{title:`is-a ${P}`,className:"text-[9px] px-1 rounded bg-sky-100 dark:bg-sky-900 text-sky-800 dark:text-sky-200",children:["⊳ ",P]},P)),T.subclassCount>0&&T.members.length===0&&h.jsxs("span",{title:`${T.subclassCount} subclasses shown`,className:"text-[9px] px-1 rounded bg-sky-100 dark:bg-sky-900 text-sky-800 dark:text-sky-200",children:["▷ ",T.subclassCount]}),(()=>{const V=(T.members.length?T.members.map(_=>_.id):[T.id]).filter(_=>t.has(_));return V.length?h.jsx("button",{"data-dismiss":T.id,"data-help-id":"node-dismiss",title:V.length>1?`Remove all ${V.length} selected classes in ${T.label}`:`Remove ${T.label} from the canvas`,onClick:_=>{_.stopPropagation(),V.forEach(X=>i?.(X))},className:`text-[10px] leading-none px-1 rounded text-gray-400
                                         hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/40`,children:"✕"}):null})()]})]}),T.relationGroups.length>0&&h.jsx("div",{"data-help-id":"relation-bar",className:`flex items-center gap-1 px-2 border-b overflow-hidden
                                     border-gray-200 dark:border-slate-600
                                     bg-sky-50/60 dark:bg-sky-950/30`,style:{height:fi},children:h.jsx(kp,{label:T.label,rows:T.relationRows,onAdd:P=>s?.(P),onRemove:P=>i?.(P),onInspect:n,colorOf:y,slotOrder:T.allRows.map(P=>P.slot),parentOf:P=>e.getClassSummary(P)?.parentId})}),T.rows.map(P=>P.header?h.jsx("div",{"data-no-drag":!0,"data-help-id":_l(P.header.id),title:`${P.header.label} — is a ${T.label}; click for details`,onClick:V=>{V.stopPropagation(),n?.(P.header.id)},className:`flex items-center px-2 text-[10px] font-semibold
                                     cursor-pointer hover:brightness-110`,style:{height:nt,background:P.header.color.fill,color:Sl},children:h.jsx("span",{className:"truncate",children:P.header.label})},P.slot):h.jsxs("div",{"data-help-id":zl(T,P),"data-expandable":de(P)?"":void 0,"data-no-drag":de(P)?"":void 0,title:(P.channel==="plain"?`${P.slot}: ${P.range}`:`${P.slot} → ${P.range} (${P.cardinality})${P.flipped?" — owner side":""}`+(de(P)?` — click to add ${P.range}`:""))+((P.owners?.length??0)>1?`
also declared by ${P.owners.slice(1).map(V=>V.label).join(", ")}`:""),onClick:de(P)?V=>{V.stopPropagation(),s?.(P.range)}:void 0,className:`flex items-center gap-1.5 px-2 text-[11px] ${P.targetColor?"":P.connected?"text-gray-700 dark:text-gray-300":"text-gray-400 dark:text-gray-500"} ${de(P)?"cursor-pointer hover:bg-sky-50 dark:hover:bg-sky-900/30 hover:text-sky-700 dark:hover:text-sky-300":""}`,style:{height:nt,...P.targetColor?{color:P.targetColor.text}:{}},children:[h.jsx("span",{className:"w-1.5 h-1.5 rounded-full shrink-0 border",style:{borderColor:P.rangeColor,background:P.connected?P.rangeColor:"transparent"}}),h.jsx("span",{className:`truncate ${T.members.length&&!P.owners?.length?`font-semibold ${P.targetColor?"":"text-gray-900 dark:text-gray-100"}`:""}`,children:P.slot}),P.isLoop&&h.jsx(Vp,{title:`self-referential: a ${P.range} can own another ${P.range} via ${P.slot}`}),h.jsxs("span",{className:"ml-auto text-[9px] truncate max-w-[90px]",children:[h.jsx("span",{style:{color:P.rangeColor},children:P.range}),h.jsxs("span",{className:"text-gray-400 dark:text-gray-500",children:[" ",P.cardinality]})]})]},P.declaringClass?`${P.declaringClass}|${P.slot}`:P.slot)),T.hiddenCount>0&&h.jsx("button",{className:"w-full text-left px-2 text-[10px] text-sky-600 dark:text-sky-400 hover:underline",style:{height:qa},title:`${_t} without an edge on the current canvas, plus plain (non-entity) ${_t}`,onClick:P=>{P.stopPropagation(),vl(T.id)},children:T.expanded?`− fewer ${_t}`:`+ ${T.hiddenCount} more ${_t}`})]},T.id)})})]})})})})]})}function Gp({classId:e,dataService:t,onClose:n,onNavigate:s,isSelected:i,onToggleSelect:r}){const o=p.useMemo(()=>t.getClassSummary(e),[e,t]),[a,c]=p.useState([]),l=p.useCallback(u=>{u!==e&&(c(m=>[...m,e]),s(u))},[e,s]),d=p.useCallback(()=>{c(u=>u.length===0?u:(s(u[u.length-1]),u.slice(0,-1)))},[s]);p.useEffect(()=>{const u=m=>{m.key==="Escape"&&n()};return window.addEventListener("keydown",u),()=>window.removeEventListener("keydown",u)},[n]);const f=t.getTypeLabel("slot",!0);return h.jsxs("aside",{className:`w-96 shrink-0 flex flex-col min-h-0 border-l border-gray-200 dark:border-slate-700
                 bg-white dark:bg-slate-900`,"aria-label":"Entity details",children:[h.jsxs("header",{className:`flex items-start gap-2 px-3 py-2 border-b border-gray-200 dark:border-slate-700
                   bg-gray-50 dark:bg-slate-800 shrink-0`,children:[a.length>0&&h.jsx("button",{onClick:d,className:"text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-sm mt-0.5",title:"Back",children:"←"}),h.jsxs("div",{className:"flex-1 min-w-0",children:[h.jsxs("div",{className:"font-semibold text-sm text-blue-700 dark:text-blue-300 break-words",children:[o?.name??e,o?.isAbstract&&h.jsx("span",{className:"ml-1 text-xs text-purple-500 italic",children:"(abstract)"})]}),o?.parentId&&h.jsxs("div",{className:"text-xs text-gray-400",children:["is a"," ",h.jsx("button",{onClick:()=>l(o.parentId),className:"text-blue-600 dark:text-blue-400 hover:underline",children:o.parentId})]})]}),h.jsx("button",{onClick:n,className:"text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-sm px-1",title:"Close (Esc)",children:"✕"})]}),o?h.jsxs("div",{className:"flex-1 overflow-y-auto min-h-0 px-3 py-2 space-y-3",children:[h.jsx("button",{onClick:()=>r(e),className:`w-full px-2 py-1 text-xs rounded border ${i?"border-blue-500 bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300":"border-gray-300 dark:border-slate-600 hover:border-blue-400 text-gray-600 dark:text-gray-300"}`,children:i?"✓ In diagram — click to remove":"+ Add to diagram"}),o.description&&h.jsx("p",{className:"text-xs text-gray-600 dark:text-gray-300 leading-relaxed",children:o.description}),o.referencedBy.length>0&&h.jsxs("section",{children:[h.jsxs(Qo,{children:["Referenced by (",o.referencedBy.length,")"]}),h.jsx("ul",{className:"space-y-0.5",children:o.referencedBy.map((u,m)=>h.jsxs("li",{className:"text-xs",children:[h.jsx("button",{onClick:()=>l(u.classId),className:"text-blue-600 dark:text-blue-400 hover:underline cursor-pointer",children:u.classId}),h.jsxs("span",{className:"text-gray-400",children:[".",u.slotName]})]},`${u.classId}.${u.slotName}-${m}`))})]}),o.slots.length>0&&h.jsxs("section",{children:[h.jsxs(Qo,{children:[f," (",o.slots.length,")"]}),h.jsx("ul",{className:"divide-y divide-gray-100 dark:divide-slate-700",children:o.slots.map((u,m)=>h.jsxs("li",{className:"py-1.5",children:[h.jsxs("div",{className:"flex items-baseline gap-1.5 flex-wrap",children:[h.jsx("span",{className:"text-xs font-medium text-gray-800 dark:text-gray-100",children:u.name}),h.jsx(Kp,{range:u.range,onNavigate:l,dataService:t})]}),u.description&&h.jsx("p",{className:"mt-0.5 text-[11px] text-gray-500 dark:text-gray-400 leading-snug break-words",children:u.description})]},`${u.name}-${m}`))})]})]}):h.jsxs("div",{className:"p-3 text-xs text-gray-500",children:["Entity not found: ",e]})]})}function Qo({children:e}){return h.jsx("div",{className:"text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-1",children:e})}function Kp({range:e,onNavigate:t,dataService:n}){const s=n.itemExists(e)&&!e.endsWith("Enum"),o=`inline-block px-1 py-0 rounded text-[11px] font-medium ${new Set(["string","integer","boolean","float","double","decimal","date","datetime","time","uri","uriorcurie","ncname"]).has(e.toLowerCase())?"bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300":e.endsWith("Enum")?"bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300":"bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"}`;return s?h.jsx("button",{onClick:()=>t(e),className:`${o} hover:underline cursor-pointer`,children:e}):h.jsx("span",{className:o,children:e})}const Qp=[{heading:"One rule at a time",cases:[{name:"Rule 1 — multivalued owns forward",note:"A multivalued slot means the owner has-a collection, so ownership runs forward: Questionnaire.items and ResearchStudy.consents. The two `part_of` self-loops are the counterexample — multivalued but drawn backward, because they walk UP a tree.",sel:["ResearchStudy","Consent","Questionnaire","QuestionnaireItem"]},{name:"Rule 2 — single-valued belongs backward",note:"The largest group (70 edges). Participant fans OUT to 22 targets, nearly all reversed: each target declares `associated_participant` and is drawn as belonging to Participant. This is the group that would move if own-bkwd merges into association.",sel:["Participant","Condition","Demography","Exposure","Procedure","Visit"]},{name:"Exception 2a — no independent existence",note:"Single-valued, but forward anyway: Quantity, TimePoint and the like have no identity of their own, so the value belongs to whoever holds it rather than owning the holder.",sel:["SpecimenStorageActivity","Quantity","TimePoint","Activity"]},{name:"Entity-ranged — always forward",note:"The twelve focus / associated_evidence slots range on Entity, the universal root. A pointer AT the root is never a foreign key back to an owner, so these run forward whatever their cardinality. Both single- and multi-valued focus sites are here — all should point AT Entity.",sel:["Observation","ObservationSet","MeasurementObservation","Document","Condition","SdohObservation","Entity"]},{name:"Association — no ownership claim",note:"Both associations in the schema: Document.related_document → Specimen, and SpecimenContainer.container → SpecimenStorageActivity. Slate and dashed, arrowed at both ends. They are listed explicitly because they are multivalued, so Rule 1 would otherwise call them ownership.",sel:["Document","Specimen","SpecimenContainer","SpecimenStorageActivity"]},{name:"Self-loops",note:"The five self-owning slots (TimePoint.index_time_point, File.derived_from, Specimen.parent_specimen, ResearchStudy.part_of, SpecimenContainer.parent_container) — loop markers, not routed edges. ResearchStudy also pulls in its TimePoint edges; the loops are the circular arrows on the rows.",sel:["TimePoint","File","Specimen","ResearchStudy","SpecimenContainer"]}]},{heading:"Inheritance (merged sibling boxes)",cases:[{name:"One child, merged with its parent",note:"MeasurementObservation alone. It still merges: the box is titled Observation, its 13 inherited rows sit at the top in black, and MeasurementObservation's own 9 follow under its coloured header. Merging does not wait for a second sibling — a class must not change shape because of what else you happen to select.",sel:["MeasurementObservation"]},{name:"Children that add nothing",note:'SpecimenQuality- and SpecimenQuantityObservation declare no slots of their own. Both still get a header under the shared rows, because "this subclass adds nothing" is the answer to what they are — and without the headers the selection would leave no trace in the box at all.',sel:["SpecimenQualityObservation","SpecimenQuantityObservation"]},{name:"slot_usage — same name, different type",note:"QuestionnaireResponseValue's five children each narrow `value` to a different type (boolean, decimal, integer, TimePoint, and the parent's string). That narrowing is the entire reason the five classes exist, so each keeps its OWN row rather than merging into the parent's — the one place a shared row would be a lie.",sel:["QuestionnaireResponseValueBoolean","QuestionnaireResponseValueDecimal","QuestionnaireResponseValueInteger","QuestionnaireResponseValueString","QuestionnaireResponseValueTimePoint"]},{name:"The full Observation family",note:"All five Observation subclasses plus the parent. One box where there would be six, and the shared rows are stated once. Note each edge leaves in the colour of the child that owns its row; inherited slots' edges are the parent's and are drawn once, not once per child.",sel:["Observation","MeasurementObservation","SdohObservation","DimensionalObservation","SpecimenQualityObservation","SpecimenQuantityObservation"]}]},{heading:"The bare diagonal",cases:[{name:"BodySite 6-way (the original)",note:"The reproducer from the handoff. In ⌙ (bend) the top approach arrives as a straight diagonal with no steps; in ⋙ (near) it keeps its horizontal run. This is the case the fix has to fix.",sel:["BodySite","Condition","Consent","Demography","Exposure","Observation","Procedure","ImagingFile","ImagingStudy","MeasurementObservation","SpecimenCreationActivity"]},{name:"BodySite, owners only",note:"The same convergence with nothing else on canvas — six owners, no unrelated boxes for a diagonal to cut across. Shows whether the degeneracy is about the convergence itself or about crowding.",sel:["BodySite","Condition","ImagingFile","ImagingStudy","MeasurementObservation","Procedure","SpecimenCreationActivity"]},{name:"TimePoint 16-edge",note:"Densest corridor in the schema: 8 owners but 16 slot-edges, since each Specimen*Activity owns date_started and date_ended. Also where the second-from-top edge goes diagonal and pair edges cross.",sel:["TimePoint","Consent","ResearchStudy","TimePeriod","SpecimenCreationActivity","SpecimenProcessingActivity","SpecimenStorageActivity","SpecimenTransportActivity","QuestionnaireResponseValueTimePoint"]},{name:"TimePoint + Person (crossing)",note:"Siggie's repro for the crossing bug: the paired date_started / date_ended edges from different owners cross each other on the way in. Compare pair ordering against the case above.",sel:["TimePoint","Person","Consent","ResearchStudy","TimePeriod","SpecimenCreationActivity","SpecimenProcessingActivity","SpecimenStorageActivity","SpecimenTransportActivity","QuestionnaireResponseValueTimePoint"]}]},{heading:"Pathological convergences",cases:[{name:"Quantity 19-edge (worst case)",note:"The largest convergence in the schema: 16 owning classes, 19 slot-edges. The fan is squeezed hardest here, so ENTITY_FAN_GAP and the merge distance both show their limits.",sel:["Quantity","Activity","Assay","DeviceExposure","DimensionalObservation","DrugExposure","MeasurementObservation","Observation","Procedure","SdohObservation","SpecimenCreationActivity","SpecimenProcessingActivity","SpecimenQualityObservation","SpecimenQuantityObservation","SpecimenStorageActivity","SpecimenTransportActivity","Substance"]},{name:"Context 6-way (uniform owners)",note:"Six owners that are all observation classes — same size, same shape, similar row counts. The controlled comparison for BodySite, whose owners vary wildly in height.",sel:["Context","DimensionalObservation","MeasurementObservation","Observation","SdohObservation","SpecimenQualityObservation","SpecimenQuantityObservation"]},{name:"Two convergences at once",note:"Quantity and TimePoint both converge from the same Specimen activity classes, so two corridors compete for the same space. Where merge distance trades off against crossings.",sel:["Quantity","TimePoint","SpecimenCreationActivity","SpecimenProcessingActivity","SpecimenStorageActivity","SpecimenTransportActivity"]}]},{heading:"Flipped divergences (found via the legend)",cases:[{name:"Participant 22-way (largest fan in the schema)",note:"Bigger than any inbound convergence: 22 edges leaving Participant, 21 of them FLIPPED. Flipped edges keep their attribute-row anchor and must not merge, so this is the fan the merge code deliberately does not touch — and therefore the one nothing has been tuned against.",sel:["Participant","Condition","Consent","Demography","DeviceExposure","DrugExposure","Exposure","File","ImagingStudy","MeasurementObservation","Observation","Procedure","SdohObservation","Specimen","Visit"]},{name:"Visit 19-way",note:"The same shape one size down, and it overlaps Participant heavily — most classes carry both associated_participant and associated_visit, so the two fans run through the same corridor as pairs.",sel:["Visit","Condition","Demography","DeviceExposure","DrugExposure","Exposure","ImagingStudy","MeasurementObservation","Observation","Procedure","QuestionnaireResponse","SdohObservation","TimePeriod"]},{name:"Participant + Visit + Organization",note:"All three FK hubs at once (22 + 19 + 11 edges, nearly all flipped). The densest picture the schema can produce, and the stress test for anything that changes routing.",sel:["Participant","Visit","Organization","Condition","Demography","DimensionalObservation","MeasurementObservation","Observation","ObservationSet","Procedure","SdohObservation","SpecimenQualityObservation","SpecimenQuantityObservation"]},{name:"Converge and diverge at once",note:"MeasurementObservation owns BodySite/Context/Quantity while being owned by Participant/Visit/Organization — edges fan IN and OUT of the same box. Where merged (entity-end) and unmerged (flipped) arrivals sit side by side.",sel:["MeasurementObservation","BodySite","Context","Quantity","Participant","Visit","Organization","MeasurementObservationSet"]}]},{heading:"Normal cases (a fix must not break these)",cases:[{name:"Single edge",note:"One owner, one edge, no convergence at all — merging is a no-op. The floor: if this looks wrong, something basic broke.",sel:["Visit","TimePeriod"]},{name:"Two owners",note:"The smallest real convergence. Two approaches, one arrowhead — the fan is barely a fan, so a merge distance that is too long is obvious here first.",sel:["Participant","Visit","ObservationSet"]},{name:"Specimen chain (deep, not wide)",note:"A long ownership chain rather than a convergence: many layers, few edges per node. Checks that tuning for convergences has not made ordinary edges worse.",sel:["Specimen","SpecimenContainer","SpecimenCreationActivity","SpecimenProcessingActivity","SpecimenStorageActivity","SpecimenTransportActivity","Participant"]},{name:"The known 3-node cycle",note:"Specimen -> SpecimenStorageActivity -> SpecimenContainer -> Specimen: an association plus two ownership edges. Known and deliberately unhandled; here so it stays visible.",sel:["Specimen","SpecimenStorageActivity","SpecimenContainer"]},{name:"Backward ownership (own-bkwd)",note:"Slots drawn backward (performed_by, associated_person, contained_in, related_imaging_study). These keep their attribute-row anchor and must NOT merge — check the arrowheads.",sel:["Organization","Person","Participant","ImagingFile","ImagingStudy","SpecimenContainer","Specimen"]},{name:"Path to root",note:"Path-to-root on from a single deep class, which pulls in every owner up the chain. The biggest graph reachable in one click.",sel:["MeasurementObservation"],roots:!0}]}],qp=3,Jn=40;function ol(){const[e,t]=p.useState(null),n=p.useCallback(i=>{if(i.button!==0||i.target.closest('button, a, input, select, textarea, [role="button"], [data-no-drag]'))return;const o=(i.currentTarget.closest("[data-draggable]")??i.currentTarget).getBoundingClientRect(),a=i.clientX,c=i.clientY,l={left:o.left,top:o.top},d=i.currentTarget;d.setPointerCapture(i.pointerId);let f=!1;const u=g=>{const b=g.clientX-a,y=g.clientY-c;if(!f&&Math.hypot(b,y)<qp)return;f=!0;const x={left:Math.max(Math.min(l.left+b,window.innerWidth-Jn),Jn-o.width),top:Math.min(Math.max(l.top+y,0),window.innerHeight-Jn)};t(x)},m=g=>{d.releasePointerCapture(g.pointerId),d.removeEventListener("pointermove",u),d.removeEventListener("pointerup",m),d.removeEventListener("pointercancel",m)};d.addEventListener("pointermove",u),d.addEventListener("pointerup",m),d.addEventListener("pointercancel",m)},[]),s=p.useCallback(()=>t(null),[]);return{offset:e,onPointerDown:n,reset:s}}function rl({title:e,subtitle:t,onClose:n,offset:s,children:i}){const r=ol();p.useEffect(()=>{const a=c=>{c.key==="Escape"&&n()};return window.addEventListener("keydown",a),()=>window.removeEventListener("keydown",a)},[n]);const o=r.offset!==null;return h.jsxs("div",{"data-draggable":"",style:{resize:"both",...r.offset?{position:"fixed",...r.offset,right:"auto"}:{}},className:`z-30 w-[26rem] max-h-[80vh] overflow-y-auto
                  rounded-lg border border-gray-300 dark:border-slate-600
                  bg-white dark:bg-slate-800 shadow-xl
                  text-gray-900 dark:text-gray-100
                  ${o?"":`absolute top-14 ${s?"right-[27rem]":"right-4"}`}`,children:[h.jsxs("div",{onPointerDown:r.onPointerDown,className:`sticky top-0 flex items-baseline justify-between gap-2 px-4 py-2
                   border-b border-gray-200 dark:border-slate-700
                   bg-white dark:bg-slate-800 cursor-grab active:cursor-grabbing
                   select-none`,children:[h.jsxs("div",{children:[h.jsx("h2",{className:"text-sm font-semibold",children:e}),t&&h.jsx("p",{className:"text-[11px] text-gray-500 dark:text-gray-400",children:t})]}),h.jsxs("div",{className:"flex items-center gap-1 shrink-0",children:[o&&h.jsx("button",{onClick:r.reset,title:"Put it back",className:`text-gray-400 hover:text-gray-700 dark:hover:text-gray-200
                         text-xs leading-none px-1`,children:"⤺"}),h.jsx("button",{onClick:n,title:"Close (Esc)",className:"text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-lg leading-none",children:"×"})]})]}),h.jsx("div",{className:"px-4 py-2",children:i})]})}function Xp(e,t){return e.sel.length===t.size&&e.sel.every(n=>t.has(n))}function Yp({onClose:e,onApply:t,selectedIds:n,dataService:s,offset:i}){const r=p.useMemo(()=>s.getConvergenceRanking(),[s]),o=p.useMemo(()=>s.getDivergenceRanking(),[s]),a=c=>t({name:"ad hoc",note:"",sel:c});return h.jsxs(rl,{title:"Example cases",subtitle:"Selections worth looking at, simple to dense.",onClose:e,offset:i,children:[h.jsxs("section",{className:"mb-4",children:[h.jsx(qo,{children:"Biggest fans"}),h.jsx("p",{className:"text-[11px] text-gray-500 dark:text-gray-400 mb-1.5",children:"Counted in slot-edges, not classes: one class owning a target through two slots crowds the corridor twice. Click a row to load just that fan."}),h.jsx("div",{className:"grid grid-cols-2 gap-3",children:[["Converging (in)",r.slice(0,6).map(c=>({entity:c.entity,n:c.edgeCount,peers:c.owners,flipped:0}))],["Diverging (out)",o.slice(0,6).map(c=>({entity:c.entity,n:c.edgeCount,peers:c.owned,flipped:c.flippedCount}))]].map(([c,l])=>h.jsxs("div",{children:[h.jsx("h4",{className:"text-[10px] font-medium text-gray-500 dark:text-gray-400 mb-0.5",children:c}),h.jsx("ul",{className:"space-y-0.5",children:l.map(d=>h.jsx("li",{children:h.jsxs("button",{onClick:()=>a([d.entity,...d.peers]),title:`Select ${d.entity} and all ${d.peers.length} peers`,className:"w-full text-left text-xs hover:bg-gray-50 dark:hover:bg-slate-700 rounded px-1",children:[h.jsx("span",{className:"text-blue-600 dark:text-blue-400",children:d.entity}),h.jsxs("span",{className:"text-gray-400 ml-1",children:[d.n,d.flipped>0?` (${d.flipped} flipped)`:""]})]})},d.entity))})]},c))})]}),Qp.map(c=>h.jsxs("section",{className:"mb-3 last:mb-1",children:[h.jsx(qo,{children:c.heading}),h.jsx("ul",{className:"space-y-1.5",children:c.cases.map(l=>{const d=Xp(l,n);return h.jsx("li",{children:h.jsxs("button",{onClick:()=>t(l),className:`block w-full text-left rounded px-2 py-1 border
                      ${d?"border-blue-500 bg-blue-50 dark:bg-blue-950":"border-transparent hover:bg-gray-50 dark:hover:bg-slate-700"}`,children:[h.jsx("span",{className:`text-xs font-medium ${d?"text-blue-700 dark:text-blue-300":"text-blue-600 dark:text-blue-400"}`,children:l.name}),h.jsxs("span",{className:"ml-1.5 text-[10px] text-gray-400",children:[l.sel.length,l.roots?" ⇱":""]}),h.jsx("p",{className:"text-[11px] leading-snug text-gray-600 dark:text-gray-400 mt-0.5",children:l.note})]})},l.name)})})]},c.heading))]})}function qo({children:e}){return h.jsx("h3",{className:`text-[11px] font-semibold uppercase tracking-wider
                   text-gray-400 dark:text-gray-500 mb-1`,children:e})}const Xo={"own-fwd":{text:"owns (forward)",color:xe.ownFwd},"own-bkwd":{text:"belongs to (backward)",color:xe.ownBkwd},association:{text:"association (no ownership)",color:xe.association},excluded:{text:"dropped",cls:"text-gray-400 dark:text-gray-500 border-gray-300"}},Zp=[{kind:"own-fwd",color:xe.ownFwd,title:"A owns B",body:"The arrow runs from the owner to what it holds. A owns B when the schema puts the collection on A, or when B has no independent existence — a Quantity of 5 mg is not something you look up."},{kind:"own-bkwd",color:xe.ownBkwd,title:"A belongs to B",body:'The same relationship stored at the other end: A carries a pointer to one B that exists without it. Drawn B → A, so you still read "start at B to find A". A Participant carries on existing whether or not any observation points at it.'},{kind:"association",color:xe.association,title:"A and B are associated",body:"Neither owns the other. Dashed, with arrowheads at both ends. Only two edges in the schema are this — a slot the ownership rules would otherwise claim, wrongly."}],Jp=[{glyph:"⇱ roots",what:"Also draw everything on the path up to a root."},{glyph:"LR / TB",what:"Lay the diagram out left-to-right or top-down."},{glyph:"⋙ ⋙⋙ ⌙ ≡",what:"Where converging edges join before their shared arrowhead — near the box, early, at the last corner, or not at all. Temporary, for picking one by eye."},{glyph:"+ − 1:1 ⛶",what:"Zoom in, out, reset, fit to view."}],em=[["0..1","optional, at most one"],["1..1","required, exactly one"],["0..*","optional, any number"],["1..*","required, one or more"]];function tm({dataService:e,onClose:t,onSelect:n,offset:s}){const i=p.useMemo(()=>e.getOwnershipPairGroups(),[e]),[r,o]=p.useState(null),a=c=>h.jsx("button",{onClick:()=>n([c]),className:"hover:underline text-blue-600 dark:text-blue-400",title:`Select ${c}`,children:c});return h.jsx(rl,{title:"Ownership legend",subtitle:"What the diagram's arrows, colors and buttons mean.",onClose:t,offset:s,children:h.jsxs("div",{className:"text-xs",children:[h.jsxs(bt,{title:"The three kinds of relationship",children:[h.jsxs("p",{className:"text-[11px] text-gray-500 dark:text-gray-400 mb-2",children:["Every edge is a class-valued attribute. Classes are placed so that if ",h.jsx("b",{children:"A"})," is drawn before ",h.jsx("b",{children:"B"}),", you reach ",h.jsx("b",{children:"B"})," through"," ",h.jsx("b",{children:"A"})," — so an edge always tells you where to start."]}),h.jsx("ul",{className:"space-y-2",children:Zp.map(c=>h.jsxs("li",{className:"flex gap-2",children:[h.jsx(Wa,{kind:c.kind,className:"mt-0.5"}),h.jsxs("div",{className:"min-w-0",children:[h.jsx("div",{className:"font-medium",style:{color:c.color},children:c.title}),h.jsx("p",{className:"text-[11px] leading-snug text-gray-600 dark:text-gray-400",children:c.body})]})]},c.title))}),h.jsxs("p",{className:"text-[11px] leading-snug text-gray-500 dark:text-gray-400 mt-2",children:["An edge leaves the ",h.jsx("b",{children:"attribute's row"}),", not the box — that is how you tell which attribute made it. A ",h.jsx("b",{children:"⟲"})," on a row is a slot pointing back at its own class."]}),h.jsxs("p",{className:"text-[11px] leading-snug text-gray-500 dark:text-gray-400 mt-2",children:["Owners are drawn first, so a box's ",h.jsx("b",{children:"← N"})," counts what it belongs to (on its left) and ",h.jsx("b",{children:"M →"})," what it owns (on its right). Hover either to list them. The little edge on each row is the one above: it says which end holds the arrowhead, and so which entity declares the attribute — and ",h.jsx("i",{children:"both"})," kinds turn up on ",h.jsx("i",{children:"both"})," sides."]})]}),h.jsxs(bt,{title:"Colors",children:[h.jsx(Yo,{caption:"A row's dot and its range label say what KIND of thing the attribute points at.",items:[{color:xt.entity,label:"another entity"},{color:xt.enum,label:"a value set"},{color:xt.dataType,label:"a data type"}]}),h.jsxs("p",{className:"text-[11px] leading-snug text-gray-600 dark:text-gray-400 mt-2",children:["A ",h.jsx("b",{children:"filled"})," dot draws an edge; a ",h.jsx("b",{children:"hollow"})," one does not, because what it points at is not on the canvas. Only entity ranges can draw edges at all."]}),h.jsx(Yo,{className:"mt-3",caption:"Inside a merged box, a color says which entity an attribute belongs to.",items:jl.slice(0,4).map((c,l)=>({color:c.text,swatch:c.fill,label:l===0?"the parent":`child ${l}`}))})]}),h.jsx(bt,{title:"Cardinality",children:h.jsx("ul",{className:"flex flex-wrap gap-x-4 gap-y-1",children:em.map(([c,l])=>h.jsxs("li",{className:"flex items-center gap-1.5",children:[h.jsx("span",{className:"font-mono text-[11px] text-gray-700 dark:text-gray-300",children:c}),h.jsx("span",{className:"text-[11px] text-gray-500 dark:text-gray-400",children:l})]},c))})}),h.jsx(bt,{title:"The toolbar",children:h.jsx("ul",{className:"space-y-1",children:Jp.map(c=>h.jsxs("li",{className:"flex gap-2",children:[h.jsx("span",{className:"shrink-0 font-mono text-[11px] text-gray-700 dark:text-gray-300 w-20",children:c.glyph}),h.jsx("span",{className:"text-[11px] leading-snug text-gray-600 dark:text-gray-400",children:c.what})]},c.glyph))})}),h.jsxs(bt,{title:"Every relationship, by rule",children:[h.jsx("p",{className:"text-[11px] text-gray-500 dark:text-gray-400 mb-1.5",children:"Derived live from the classifier the graph itself uses, so this cannot drift from what is drawn. Overrides and value-object membership are hand-curated — if a pair looks wrong, the classification is. Click any class to select it."}),h.jsx("ul",{className:"space-y-1",children:i.map(c=>{const l=`${c.verdict}/${c.rule}`,d=Xo[c.verdict]??Xo.excluded,f=r===l;return h.jsxs("li",{className:"border-l-2 pl-2 border-gray-200 dark:border-slate-600",children:[h.jsxs("button",{onClick:()=>o(f?null:l),className:"w-full text-left",children:[h.jsx("span",{className:`inline-block px-1 rounded border text-[10px] ${d.cls??""}`,style:d.color?{color:d.color,borderColor:d.color}:void 0,children:d.text}),h.jsx("span",{className:"ml-1.5 font-medium",children:c.rule}),h.jsx("span",{className:"ml-1 text-gray-400",children:c.pairs.length}),h.jsx("span",{className:"ml-1 text-gray-400",children:f?"▾":"▸"})]}),h.jsx("p",{className:"text-[11px] leading-snug text-gray-600 dark:text-gray-400 mt-0.5",children:c.ruleText}),f&&h.jsx("ul",{className:"mt-1 mb-1.5 space-y-0.5 font-mono text-[10px]",children:c.pairs.map(u=>h.jsxs("li",{className:"text-gray-600 dark:text-gray-400",children:[a(u.declaredOn),h.jsxs("span",{className:"text-gray-400",children:[".",u.slotName]}),h.jsx("span",{className:"mx-1 text-gray-400",children:u.multivalued?"↠":"→"}),a(u.range),u.isLoop&&h.jsx("span",{className:"ml-1",style:{color:xt.entity},children:"loop"}),(c.verdict==="own-bkwd"||c.verdict==="association")&&h.jsxs("span",{className:"ml-1 text-gray-400",children:["(owner: ",u.owner,")"]})]},`${u.declaredOn}.${u.slotName}`))})]},l)})})]}),h.jsxs("p",{className:"text-[10px] text-gray-400 dark:text-gray-500 mt-3",children:["A box's ",h.jsx("b",{children:"“N related”"})," count is of distinct classes"," ",h.jsx("i",{children:"outside"})," it, so selecting a class that folds into a merged box can make the number go ",h.jsx("i",{children:"down"}),". Correct, if counter-intuitive."]})]})})}function bt({title:e,children:t}){return h.jsxs("section",{className:"mb-4 last:mb-1",children:[h.jsx("h3",{className:`text-[11px] font-semibold uppercase tracking-wider
                     text-gray-400 dark:text-gray-500 mb-1`,children:e}),t]})}function Yo({caption:e,items:t,className:n}){return h.jsxs("div",{className:n,children:[h.jsx("p",{className:"text-[11px] text-gray-500 dark:text-gray-400 mb-1",children:e}),h.jsx("ul",{className:"flex flex-wrap gap-x-3 gap-y-1",children:t.map(s=>h.jsxs("li",{className:"flex items-center gap-1",children:[h.jsx("span",{className:"inline-block w-3 h-3 rounded-sm border",style:{background:s.swatch??s.color,borderColor:s.color}}),h.jsx("span",{className:"text-[11px]",style:{color:s.color},children:s.label})]},s.label))})]})}const nm=!1,sm=!1,al=p.createContext(null);function st(){const e=p.useContext(al);if(!e)throw new Error("useHelp must be used inside <HelpProvider>");return e}const im=300,om=[{id:"graph-canvas-reading",label:"Reading the diagram"},{id:"relation-bar",label:"The relation bar"},{id:"merged-boxes",label:"Inheritance and merged boxes"},{id:"node-dismiss",label:"Closing a box"},{id:"copy-link",label:"Sharing what you see"}];function rm({onOpenLegend:e,onOpenCases:t,legendOpen:n,casesOpen:s,onClosePanels:i,anyPanelOpen:r}){const{showEntry:o,showAddresses:a,toggleAddresses:c}=st(),[l,d]=p.useState(!1),f=p.useRef(void 0),u=()=>{f.current!==void 0&&(clearTimeout(f.current),f.current=void 0)},m=()=>{u(),f.current=setTimeout(()=>d(!1),im)};p.useEffect(()=>u,[]),p.useEffect(()=>{if(!l)return;const b=x=>{x.target?.closest("[data-help-menu]")||d(!1)},y=x=>{x.key==="Escape"&&d(!1)};return document.addEventListener("mousedown",b,!0),document.addEventListener("keydown",y),()=>{document.removeEventListener("mousedown",b,!0),document.removeEventListener("keydown",y)}},[l]);const g=b=>()=>{d(!1),b()};return h.jsxs("span",{"data-help-menu":!0,"data-help-id":"help-menu",className:"relative",onMouseEnter:()=>{u(),d(!0)},onMouseLeave:m,children:[h.jsxs("button",{onClick:()=>d(b=>!b),title:"Legend, example cases and help topics",className:`text-sm underline hover:text-white ${l?"text-white":"text-blue-100"}`,children:["Help ",h.jsx("span",{"aria-hidden":!0,className:"opacity-70",children:"▾"})]}),l&&h.jsxs("div",{className:`absolute right-0 top-full mt-1 z-40 w-60 py-1
                     rounded-md border border-gray-300 dark:border-slate-600
                     bg-white dark:bg-slate-800 shadow-xl
                     text-gray-900 dark:text-gray-100`,children:[h.jsxs(tn,{onClick:g(e),children:[n?"Hide ownership legend":"Ownership legend",h.jsx(es,{children:"every relationship in the schema, by rule"})]}),h.jsxs(tn,{onClick:g(t),children:[s?"Hide example cases":"Example cases",h.jsx(es,{children:"selections worth looking at"})]}),r&&h.jsxs(tn,{onClick:g(i),children:["Close all panels",h.jsx(es,{children:"legend, cases and the detail drawer"})]}),h.jsx(am,{}),om.map(b=>h.jsx(tn,{onClick:g(()=>o(b.id)),children:b.label},b.id)),sm]})]})}function tn({onClick:e,children:t}){return h.jsx("button",{onClick:e,className:`block w-full text-left px-3 py-1.5 text-xs
                 hover:bg-gray-100 dark:hover:bg-slate-700`,children:t})}function es({children:e}){return h.jsx("span",{className:"block text-[10px] text-gray-400 dark:text-gray-500",children:e})}function am(){return h.jsx("div",{className:"my-1 border-t border-gray-200 dark:border-slate-700"})}function ll(e){const t=Number(e?.trim());return Number.isFinite(t)&&t>=240?t:void 0}function cl(e){const t=e?.trim().toLowerCase();return t==="dim"||t==="ring"||t==="none"?t:void 0}function dl(e){const t=e?.trim().toLowerCase();return t==="left"||t==="right"||t==="top"||t==="bottom"?t:void 0}function hl(e){const t=e?.trim();if(!t)return;const n=Number(t);if(Number.isFinite(n))return{px:n};const s=t.match(/^(-)?(?:anchor|parentBox)\.(width|height)(?:\s*\*\s*(-?[\d.]+))?$/i);if(!s)return;const[,i,r,o]=s,a=o===void 0?1:Number(o);if(Number.isFinite(a))return{of:r.toLowerCase(),times:i?-a:a}}function pi(e,t){const n=e?.trim();if(!n)return{kind:"help-id",arg:t};if(n==="none")return{kind:"none"};const s=n.indexOf(":");return s===-1?{kind:"help-id",arg:n}:{kind:n.slice(0,s).trim(),arg:n.slice(s+1).trim()}}const lm="Format",cm="Walkthrough",dm=new Set([lm,"TODO"]),ul=/^<\/?(?:details|summary)\b[^>]*>$/i;function ye(e,t){const n=t.toLowerCase();for(const s of e){const i=it(s);if(i){if(i.name==="beats"&&n!=="beats")return;if(i.name===n)return i.value}}}function it(e){const t=e.trimStart().match(/^-\s+(.*)$/);if(!t)return;const n=t[1].replace(/\*\*/g,""),s=n.indexOf(":");if(s===-1)return;const i=n.slice(0,s).trim();if(/^[A-Za-z_][A-Za-z0-9_]*$/.test(i))return{name:i.toLowerCase(),value:n.slice(s+1).trim()}}function mi(e){return e.length>0&&!/^\s/.test(e)&&it(e)!==void 0}function fl(e,t){const n=t.toLowerCase(),s=e.findIndex(l=>it(l)?.name===n);if(s===-1)return;const i=it(e[s]).value,r=[];for(let l=s+1;l<e.length&&!(mi(e[l])||ul.test(e[l].trim()));l++)r.push(e[l]);for(;r.length&&r[r.length-1].trim()==="";)r.pop();if(r.length===0)return i;const o=r.filter(l=>l.trim()!=="").map(l=>l.length-l.trimStart().length),a=Math.min(...o),c=r.map(l=>l.slice(a)).join(`
`);return i?`${i}
${c}`:c}function hm(e,t){const n=t.toLowerCase(),s=e.findIndex(r=>it(r)?.name===n);if(s===-1)return[];const i=[];for(let r=s+1;r<e.length;r++){const o=e[r].trimStart();if(mi(e[r])||o==="")break;o.startsWith("- ")&&i.push(o.slice(2).trim())}return i}function um(e,t){const n=e.findIndex(o=>it(o)?.name==="beats");if(n===-1)return;const s=[];let i=null;const r=()=>{i&&s.push(i)};for(let o=n+1;o<e.length;o++){const a=e[o].trimStart();if(mi(e[o])||e[o].length>0&&!/^\s/.test(e[o])&&/^<\/?[a-z]/i.test(a))break;if(a==="")continue;const c=a.match(/^(\d+)\.\s+(.*)$/);if(c){r(),i={text:c[2].trim()};continue}const l=it(a);if(l&&i){const{name:d,value:f}=l;if(d==="description"){const u=e[o].length-e[o].trimStart().length,m=[];let g=o+1;for(;g<e.length;g++){if(e[g].trim()===""){m.push("");continue}if(e[g].length-e[g].trimStart().length<=u)break;m.push(e[g])}for(;m.length&&m[m.length-1].trim()==="";)m.pop();if(m.length){const b=m.filter(S=>S.trim()!=="").map(S=>S.length-S.trimStart().length),y=Math.min(...b),x=m.map(S=>S.slice(y)).join(`
`);i.description=f?`${f}
${x}`:x}else i.description=f;o=g-1;continue}d==="anchor"?i.anchor=pi(f,t):d==="action"?i.action=f.trim():d==="change"?i.change=f.trim():d==="only"?(i.change=f.trim(),i.replace=!0):d==="highlight"?i.highlight=cl(f):d==="width"?i.width=ll(f):d==="position"?i.position=dl(f):d==="offsetx"?i.offsetX=hl(f):d==="keep"&&(i.keep=f.trim()!=="false");continue}i&&!a.startsWith("-")&&(i.text=`${i.text} ${a}`.trim())}return r(),s.length>0?s:void 0}function fm(e,t){const n=e.split(`
`),i=n[0].match(/^###\s+(.+)$/);if(!i)return null;const r=i[1].trim(),o=ye(n,"Title")??r,a=fl(n,"Description")??"",c=hm(n,"Interactions"),l=ye(n,"Shortcut"),d=ye(n,"Context"),f=pi(ye(n,"Anchor"),r),u=ye(n,"Action"),m=ye(n,"Once"),g=ye(n,"Only"),b=ye(n,"Change"),y=b??g,x=b===void 0&&g!==void 0?!0:void 0,S=cl(ye(n,"Highlight")),v=ll(ye(n,"Width")),w=dl(ye(n,"Position")),k=hl(ye(n,"OffsetX")),A=um(n,r),C=ye(n,"Tour");return{id:r,title:o,description:a,interactions:c,shortcut:l,context:d,anchor:f,action:u,once:m,change:y,replace:x,highlight:S,width:v,position:w,offsetX:k,tour:C===void 0?void 0:C||cm,order:t,beats:A}}function pm(e,t){const n=e.split(`
`),s=n.findIndex(m=>/^##\s+/.test(m)),i=s===-1?null:n[s].match(/^##\s+(.+)$/),r=i?i[1].trim():"Unknown",o=r.toLowerCase().replace(/[^a-z0-9]+/g,"-"),a=[];for(let m=s+1;m<n.length&&!n[m].startsWith("### ");m++)ul.test(n[m].trim())||a.push(n[m]);const c=a.join(`
`).trim(),l=ye(a,"TourMetadata"),d=l===void 0?void 0:{name:l||r,description:fl(a,"Description")?.trim()??"",abbr:ye(a,"TourAbbr")?.trim()||void 0},f=[],u=e.split(/(?=^### )/m);for(const m of u){if(!m.startsWith("### "))continue;const g=fm(m.trim(),t());g&&f.push(g)}return{id:o,title:r,body:c,entries:f,tourMeta:d}}function Ls(e){const t=new Set;for(const n of[...e.entries.values()].sort((s,i)=>s.order-i.order))n.tour&&t.add(n.tour);return[...t]}function pl(e,t){const n=t??Ls(e)[0];return[...e.entries.values()].filter(s=>s.tour!==void 0&&s.tour===n).sort((s,i)=>s.order-i.order)}function ts(e,t){return t<0?e:`${e} ▸${t+1}`}function ns(e){return`### ${e}`}function Ns(e,t){const n=[];return pl(e,t).forEach((s,i)=>{const r=i+1;if(!s.beats||s.beats.length===0){n.push({entry:s,step:r,beatIndex:0,beatCount:0,address:ts(s.id,-1),searchFor:ns(s.id),blocks:[s.description],text:s.description,anchor:s.anchor,action:s.action,change:s.change,replace:s.replace,highlight:s.highlight,width:s.width,position:s.position,offsetX:s.offsetX});return}let o=s.description?[s.description]:[];o.length>0&&n.push({entry:s,step:r,beatIndex:-1,beatCount:s.beats.length,address:ts(s.id,-1),searchFor:ns(s.id),blocks:o,text:o.join(`

`),anchor:s.anchor,action:s.action,change:s.change,replace:s.replace,highlight:s.highlight,width:s.width,position:s.position,offsetX:s.offsetX});let a=s.width;s.beats.forEach((c,l)=>{const d=c.description??"";o=c.keep?[...o,d]:[d],c.width!==void 0&&(a=c.width),n.push({entry:s,step:r,beatIndex:l,beat:c,beatCount:s.beats.length,address:ts(s.id,l),searchFor:ns(s.id),blocks:o,text:o.join(`

`),anchor:c.anchor??s.anchor,action:c.action,highlight:c.highlight??s.highlight,width:a,position:c.position??s.position,offsetX:c.offsetX??s.offsetX,change:c.change,replace:c.replace})})}),n}function mm(e){const n=e.replace(/<!--[\s\S]*?-->/g,"").trim().split(/(?=^## )/m).map(a=>a.trim()).filter(Boolean),s=[],i=new Map;let r=0;for(const a of n){if(!a.match(/^## /m))continue;const c=a.match(/^##\s+(.+)$/m)?.[1].trim();if(c&&dm.has(c))continue;const l=pm(a,()=>r++);s.push(l);for(const d of l.entries)i.set(d.id,d)}const o=new Map;for(const a of s)a.tourMeta&&o.set(a.tourMeta.name,a.tourMeta);return{sections:s,entries:i,tourMeta:o}}const gm=/\{\{\s*([a-z][a-z0-9-]*)\s*:\s*([^}]*?)\s*\}\}/gi;function ym(e,t){return!t||!e.includes("{{")?e:e.replace(gm,(n,s,i)=>t[s.toLowerCase()]?.(i)??n)}function Zo(e){const t=new Set;return e.map((n,s)=>({p:n,index:s})).filter(({p:n})=>t.has(n.step)?!1:(t.add(n.step),!0)).map(({p:n,index:s})=>({index:s,step:n.step,title:n.entry.title,beatCount:n.beatCount}))}function ml({scope:e,onClose:t}){const{content:n,tours:s,tourMeta:i,tourName:r,tourIndex:o,positions:a,position:c,goToStep:l,startTour:d}=st();p.useEffect(()=>{const y=x=>{x.key==="Escape"&&(x.stopPropagation(),x.preventDefault(),t())};return window.addEventListener("keydown",y,!0),()=>window.removeEventListener("keydown",y,!0)},[t]);const f=p.useRef(null);p.useEffect(()=>{const y=f.current;if(!(!y||typeof y.showPopover!="function"))return y.showPopover(),()=>{y.matches(":popover-open")&&y.hidePopover()}},[]);const u=p.useMemo(()=>e==="all"?s.map(y=>({name:y,rows:Zo(Ns(n,y))})):[],[e,s,n]),m=c?.step,g=o===null?void 0:r,b=(y,x,S)=>h.jsxs("button",{onClick:S,"aria-current":x?"step":void 0,className:`help-map-step${x?" help-map-step-here":""}`,children:[h.jsx("span",{className:"help-map-num",children:y.step}),h.jsx("span",{className:"help-map-title",children:y.title}),y.beatCount>0&&h.jsx("span",{className:"help-map-beats",title:`${y.beatCount+1} screens in this step`,children:y.beatCount+1})]},y.index);return tr.createPortal(h.jsx("div",{ref:f,popover:"manual",className:"help-map-backdrop",onMouseDown:t,children:h.jsxs("div",{role:"dialog","aria-label":e==="all"?"All tours":"Tour outline",className:"help-map",onMouseDown:y=>y.stopPropagation(),children:[h.jsxs("div",{className:"help-map-head",children:[h.jsxs("div",{children:[h.jsx("h2",{children:e==="all"?"Tours":g??"This tour"}),h.jsx("p",{children:e==="all"?"Every guided walk, and what is in it. Click any step to start there.":"Click any step to jump to it."})]}),h.jsx("button",{onClick:t,title:"Close (Esc)",className:"help-map-close",children:"✕"})]}),h.jsx("div",{className:"help-map-body",children:e==="tour"?Zo(a).map(y=>b(y,y.step===m,()=>{l(y.index),t()})):u.map(({name:y,rows:x})=>h.jsxs("section",{className:"help-map-tour",children:[h.jsx("button",{className:"help-map-tourname",onClick:()=>{d(y),t()},children:y}),i.get(y)?.description&&h.jsx("p",{className:"help-map-blurb",children:i.get(y).description}),x.map(S=>b(S,g===y&&S.step===m,()=>{g===y?l(S.index):d(y,S.index),t()}))]},y))})]})}),document.body)}function wm(){const{tours:e,tourMeta:t,startTour:n}=st(),[s,i]=p.useState(!1),{overviewOpen:r,setOverviewOpen:o}=st(),a=p.useRef(null);return p.useEffect(()=>{if(!s)return;const c=d=>{d.target?.closest("[data-tour-chooser]")||i(!1)},l=d=>{d.key==="Escape"&&i(!1)};return document.addEventListener("mousedown",c,!0),document.addEventListener("keydown",l),()=>{document.removeEventListener("mousedown",c,!0),document.removeEventListener("keydown",l)}},[s]),e.length===0?null:h.jsxs("span",{"data-tour-chooser":!0,"data-help-id":"tour-chooser",className:"relative",onMouseEnter:()=>i(!0),children:[h.jsx("button",{onClick:()=>{i(!1),o(!0)},title:"Guided walks through the app and the model; click for the overview",className:`text-sm font-semibold px-2.5 py-1 rounded-full bg-white/95
                   text-blue-700 shadow-sm hover:bg-white hover:shadow`,children:"Guided tours"}),s&&h.jsxs("div",{ref:a,role:"dialog","aria-label":"Guided tours",className:`absolute right-0 top-full mt-1 z-40 w-80 p-1
                     rounded-md border border-gray-300 dark:border-slate-600
                     bg-white dark:bg-slate-800 shadow-xl
                     text-gray-900 dark:text-gray-100`,children:[h.jsxs("p",{className:"px-3 pt-2 pb-1 text-[11px] text-gray-500 dark:text-gray-400",children:["Each one stands on its own. Leave any tour with ",h.jsx("kbd",{children:"Esc"}),"."]}),h.jsxs("button",{"data-tour-overview":!0,onClick:()=>{i(!1),o(!0)},className:`block w-full text-left px-3 py-2 rounded
                       hover:bg-gray-100 dark:hover:bg-slate-700`,children:[h.jsx("span",{className:"block text-xs font-semibold",children:"Overview"}),h.jsxs("span",{className:"block text-[11px] text-gray-500 dark:text-gray-400",children:["All ",e.length," tours and every step in them — start anywhere."]})]}),h.jsx("div",{className:"my-1 border-t border-gray-200 dark:border-slate-700"}),e.map(c=>h.jsxs("button",{onClick:()=>{i(!1),n(c)},className:`block w-full text-left px-3 py-2 rounded
                         hover:bg-gray-100 dark:hover:bg-slate-700`,children:[h.jsx("span",{className:"block text-xs font-semibold",children:c}),t.get(c)?.description&&h.jsx("span",{className:"block text-[11px] text-gray-500 dark:text-gray-400",children:t.get(c).description})]},c))]}),r&&h.jsx(ml,{scope:"all",onClose:()=>o(!1)})]})}const bm="dmvd.help.showAddresses";function xm(){const e=document.activeElement;return e instanceof HTMLInputElement||e instanceof HTMLTextAreaElement||e?.getAttribute("contenteditable")==="true"}function vm(e,t){if(!t)return e;const n=r=>ym(r,t),s=r=>r===void 0?void 0:n(r),i=new Map([...e.entries].map(([r,o])=>[r,{...o,description:n(o.description),interactions:o.interactions.map(n),action:s(o.action),context:s(o.context),beats:o.beats?.map(a=>({...a,description:s(a.description),action:s(a.action)}))}]));return{sections:e.sections.map(r=>({...r,entries:r.entries.map(o=>i.get(o.id)??o),tourMeta:r.tourMeta&&{...r.tourMeta,description:n(r.tourMeta.description)}})),entries:i,tourMeta:new Map([...e.tourMeta].map(([r,o])=>[r,{...o,description:n(o.description)}]))}}function km({markdown:e,onPushChange:t,onPopChange:n,onJumpChanges:s,onTourStart:i,onTourEnd:r,textResolvers:o,centerOn:a,children:c}){const[l,d]=p.useState(),f=l??o,u=p.useMemo(()=>vm(mm(e),f),[e,f]),[m,g]=p.useState(!1),[b,y]=p.useState(null),[x,S]=p.useState(void 0),[v,w]=p.useState(!1),k=p.useMemo(()=>Ls(u),[u]),A=p.useMemo(()=>Ns(u,x),[u,x]),C=p.useMemo(()=>pl(u,x).length,[u,x]),[E,L]=p.useState(null),[K,W]=p.useState(()=>!1),I=p.useCallback(()=>{W(z=>{const G=!z;try{window.localStorage.setItem(bm,G?"1":"0")}catch{}return G})},[]),O=p.useCallback(()=>{g(!1),L(null)},[]),B=p.useCallback(()=>L(null),[]),Y=p.useCallback(z=>L(z),[]),te=p.useCallback(z=>{const G=A[z];G&&(y(z),L(G.entry.id),G.change!=null&&t&&t(G.change,G.replace))},[A,t]),ge=p.useCallback(z=>{A[z+1]?.change!=null&&n&&n();const Z=A[z];Z&&(y(z),L(Z.entry.id))},[A,n]),R=p.useCallback(z=>{if(b===null||z===b)return;const G=A[z];if(G&&s){if(z>b){const Z=A.slice(b+1,z+1).filter(se=>se.change!=null).map(se=>({query:se.change,replace:se.replace}));s(Z,0)}else{const Z=A.slice(z+1,b+1).filter(se=>se.change!=null).length;s([],Z)}y(z),L(G.entry.id)}},[b,A,s]),$=p.useCallback((z=Ls(u)[0],G=0)=>{g(!1),S(z);const Z=Ns(u,z),se=Math.min(Math.max(G,0),Math.max(Z.length-1,0)),me=Z[se];if(!me)return;i?.(),y(se),L(me.entry.id);const U=Z.slice(0,se+1).filter(ne=>ne.change!=null).map(ne=>({query:ne.change,replace:ne.replace}));se>0&&s?s(U,0):me.change!=null&&t&&t(me.change,me.replace)},[u,t,s,i]),M=p.useCallback(()=>{y(null),L(null),S(void 0),r?.()},[r]),q=p.useCallback(()=>{b!==null&&(b+1>=A.length?M():te(b+1))},[b,A.length,te,M]),pe=p.useCallback(()=>{b!==null&&b>0&&ge(b-1)},[b,ge]),oe=p.useCallback(()=>{b!==null&&M(),L(null)},[b,M]),ve=p.useCallback(z=>{if(!z)return null;const{kind:G}=z;if(G==="none")return null;const{arg:Z}=z,se=G==="help-id"?Z:`${G}:${Z}`,me=document.querySelectorAll(`[data-help-id="${CSS.escape(se)}"]`);return me.length<2?me[0]??null:[...me].find(U=>U.getBoundingClientRect().height>0)??me[0]},[]);p.useEffect(()=>(document.body.classList.toggle("help-mode",m),()=>{document.body.classList.remove("help-mode")}),[m]),p.useEffect(()=>{if(m)return window.addEventListener("blur",O),()=>window.removeEventListener("blur",O)},[m,O]),p.useEffect(()=>{if(!m)return;function z(G){const Z=G.target;if(!Z)return;const se=Z.closest("[data-help-id]");se?(G.stopPropagation(),G.preventDefault(),Y(se.getAttribute("data-help-id"))):Z.closest("[data-help-popover]")||B()}return document.addEventListener("click",z,!0),()=>document.removeEventListener("click",z,!0)},[m,Y,B]),p.useEffect(()=>{function z(G){if(G.key==="?"&&!xm()){G.preventDefault(),b===null?w(Z=>!Z):M();return}if(G.key==="Escape"&&(m||b!==null||E)){G.preventDefault(),G.stopPropagation(),E&&b===null?B():b!==null?M():oe();return}b!==null&&(G.key==="ArrowRight"&&(G.preventDefault(),q()),G.key==="ArrowLeft"&&(G.preventDefault(),pe()))}return document.addEventListener("keydown",z,!0),()=>document.removeEventListener("keydown",z,!0)},[m,b,E,oe,B,M,q,pe]);const Me=p.useCallback(()=>a?ve(pi(a,a))?.getBoundingClientRect()??null:null,[a,ve]),Le=p.useMemo(()=>({setTextResolvers:d,helpMode:m,toggleHelpMode:oe,exitHelpMode:O,tourIndex:b,startTour:$,endTour:M,nextStep:q,prevStep:pe,goToStep:R,positions:A,position:b===null?void 0:A[b],stepCount:C,tours:k,tourName:x,tourMeta:u.tourMeta,overviewOpen:v,setOverviewOpen:w,showAddresses:K,toggleAddresses:I,content:u,activeId:E,showEntry:Y,dismissEntry:B,resolveAnchor:ve,centerRect:Me}),[m,oe,O,b,$,M,q,pe,R,A,C,k,x,v,K,I,u,E,Y,B,ve,Me]);return h.jsx(al.Provider,{value:Le,children:c})}const Vs={a:({href:e,children:t})=>h.jsx("a",{href:e,target:"_blank",rel:"noreferrer",children:t}),blockquote:({children:e})=>h.jsxs("div",{className:"help-popover-alert",role:"note",children:[h.jsx("span",{className:"help-popover-alert-mark","aria-hidden":"true",children:"!"}),h.jsx("div",{children:e})]})};function Tm(e){try{return localStorage.getItem(e)}catch{return null}}function Sm(e,t){try{localStorage.setItem(e,t)}catch{}}const gl="help-once-",ss="data-help-anchor",Jo="data-help-hint",Cm="--help-hint",Am=40;function Pm(e){return e.split(`
`).filter(t=>!/^\s{0,3}>/.test(t)).join(`
`).replace(/\n{3,}/g,`

`).trim()}function Em(e){return Tm(gl+e)==="1"}function Mm(e){Sm(gl+e,"1")}function Dm(e){return{...Vs,blockquote:({children:t})=>h.jsxs("div",{className:"help-popover-alert",role:"note",children:[h.jsx("span",{className:"help-popover-alert-mark","aria-hidden":"true",children:"!"}),h.jsxs("div",{children:[t,h.jsxs("label",{className:"help-popover-alert-once",children:[h.jsx("input",{type:"checkbox",onChange:e}),"Don't show this again"]})]})]})}}function Om(){const{helpMode:e,tourIndex:t,position:n,positions:s,stepCount:i,content:r,activeId:o,dismissEntry:a,nextStep:c,prevStep:l,endTour:d,showEntry:f,resolveAnchor:u,centerRect:m,showAddresses:g,tourName:b,tourMeta:y}=st(),x=b===void 0?void 0:y.get(b)?.abbr??b,[S,v]=p.useState(!1),w=t!==null;p.useEffect(()=>{w||v(!1)},[w]);const k=o?r.entries.get(o):void 0,A=ol(),C=u,E=w?n?.anchor:k?.anchor,L=(w?n?.highlight:k?.highlight)??"dim",K=()=>{if(!n||n.beatCount===0)return null;const U=n.beatIndex+1;return h.jsx("span",{className:"help-tour-dots",title:`Screen ${U+1} of ${n.beatCount+1} in this step`,children:Array.from({length:n.beatCount},(ne,de)=>h.jsx("span",{className:de<U?"help-dot help-dot-on":"help-dot"},de))})},[W,I]=p.useState(!1),[O,B]=p.useState(void 0),[Y,te]=p.useState(!1),ge=p.useRef(null),[,R]=p.useState(0),$=k?.once,M=$!==void 0&&Em($),q=p.useMemo(()=>$===void 0?Vs:Dm(()=>{Mm($),R(U=>U+1)}),[$]),pe=(w?n?.blocks??[]:[k?.description??""]).map(U=>M?Pm(U):U).filter(Boolean),oe=(w?n?.width:void 0)??Math.max(Bm(pe.join(`

`)),w?$m():0),ve=p.useRef(!1);p.useEffect(()=>{ve.current=!1},[o,E]);const Me=A.reset;p.useEffect(()=>{Me()},[o,t,Me]),p.useLayoutEffect(()=>{if(!o){I(!1),B(void 0);return}let U=null;const ne=()=>{const Ce=C(E);Ce!==U&&(U?.removeAttribute(ss),U=Ce,I(!!Ce),B(Ce?.closest("[data-graph-direction]")?.getAttribute("data-graph-direction")==="RIGHT"?"below":void 0),Ce&&(Ce.setAttribute(ss,""),ve.current||(ve.current=!0,Ce.scrollIntoView({block:"center",behavior:"smooth"}))))};ne();const de=new MutationObserver(ne);return de.observe(document.body,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["data-help-id"]}),()=>{de.disconnect(),U?.removeAttribute(ss),I(!1),B(void 0)}},[o,E,C]);const Le=600,z=w&&n?.change!=null&&E!==void 0&&E.kind!=="none",[G,Z]=p.useState(!1);p.useEffect(()=>{if(!z){Z(!0);return}Z(!1);const U=window.setTimeout(()=>Z(!0),Le);return()=>window.clearTimeout(U)},[z,t]);const se=G||W;p.useEffect(()=>{const U=ge.current;U&&(k&&se?U.matches(":popover-open")||U.showPopover():U.matches(":popover-open")&&U.hidePopover())},[k,se]),p.useEffect(()=>{(!e||w)&&te(!1)},[e,w]);const me=p.useMemo(()=>e&&!w?[...r.entries.values()].filter(U=>C(U.anchor)).slice(0,Am).map((U,ne)=>({id:U.id,title:U.title,name:`${Cm}-${ne}`})):[],[e,w,r,C]);return p.useLayoutEffect(()=>{const U=me.map(ne=>{const de=C(r.entries.get(ne.id)?.anchor);return de?.setAttribute(Jo,ne.name),de}).filter(Boolean);return()=>U.forEach(ne=>ne.removeAttribute(Jo))},[me,r,C]),h.jsxs(h.Fragment,{children:[W&&o&&L!=="none"&&h.jsx("div",{className:`help-spotlight${L==="ring"?" help-spotlight-ring":""}`}),me.map(({id:U,title:ne,name:de})=>h.jsx("button",{className:"help-hint",title:ne??U,style:{positionAnchor:de},onMouseEnter:()=>{Y||f(U)},onMouseLeave:()=>{Y||a()},onClick:Ce=>{Ce.stopPropagation(),te(!0),f(U)},children:"?"},U)),h.jsx("div",{ref:ge,popover:"manual","data-help-popover":"","data-anchored":W?"":void 0,className:"help-popover",style:{...Fm(W,w?n?.position:void 0,w?n?.offsetX:void 0,oe,W?null:m(),O),...A.offset?{positionArea:"none",left:A.offset.left,top:A.offset.top,right:"auto",bottom:"auto",margin:0,transform:"none"}:{}},children:k&&h.jsxs(h.Fragment,{children:[h.jsxs("h4",{className:"help-popover-title",onPointerDown:A.onPointerDown,style:{cursor:A.offset?"grabbing":"grab",userSelect:"none"},title:"Drag to move",children:[w&&x&&h.jsx("span",{className:"help-popover-tour",children:x}),k.title]}),w&&n?.action&&h.jsxs("div",{className:"help-popover-action",children:[h.jsx("span",{className:"help-popover-action-mark","aria-hidden":"true",children:"✓"}),h.jsx("div",{children:h.jsx(Wt,{children:n.action})})]}),w&&g&&n?.change&&!n.action&&h.jsxs("div",{className:"help-popover-action",style:{opacity:.85},children:[h.jsx("span",{className:"help-popover-action-mark","aria-hidden":"true",children:"⚠"}),h.jsxs("div",{children:[h.jsx("em",{children:"Authoring:"})," this position changes the app (",h.jsx("code",{children:n.change}),") but has no ",h.jsx("code",{children:"Action:"}),"."]})]}),pe.length>0&&h.jsx("div",{className:"help-popover-body",children:pe.map((U,ne,de)=>h.jsx("div",{className:ne===de.length-1?void 0:"help-beat-past",children:h.jsx(Wt,{components:q,children:U})},ne))}),k.interactions.length>0&&h.jsx("ul",{className:"help-popover-interactions",children:k.interactions.map((U,ne)=>h.jsx("li",{children:h.jsx(Wt,{components:Vs,children:U})},ne))}),k.shortcut&&h.jsxs("p",{className:"help-popover-shortcut",children:["Shortcut: ",h.jsx("kbd",{children:k.shortcut})]}),k.context&&h.jsx("div",{className:"help-popover-context",children:h.jsx(Wt,{children:k.context})}),w?h.jsxs("div",{className:"help-tour-nav",children:[h.jsxs("span",{className:"help-tour-count",title:`Position ${t+1} of ${s.length}`,children:[n?.step," / ",i]}),K(),h.jsx("button",{className:"help-tour-map-btn",onClick:()=>v(U=>!U),"aria-expanded":S,title:"Show the tour outline",children:"⊞"}),h.jsx("span",{className:"help-tour-spacer"}),h.jsx("button",{onClick:l,disabled:t===0,title:"Previous (← arrow key)",children:"← back"}),h.jsx("button",{onClick:c,className:"help-tour-next",title:"Next (→ arrow key)",children:t+1===s.length?"done":"next →"}),h.jsx("button",{onClick:d,title:"End the tour and undo what it added (Esc)",children:"✕"})]}):h.jsxs("div",{className:"help-tour-nav",children:[h.jsx("span",{className:"help-tour-spacer"}),h.jsx("button",{onClick:()=>{te(!1),a()},children:"close"})]}),g&&h.jsx(Rm,{address:w?n?.address:k.id,searchFor:w?n?.searchFor:`### ${k.id}`})]})}),S&&w&&h.jsx(ml,{scope:"tour",onClose:()=>v(!1)})]})}function Rm({address:e,searchFor:t}){const[n,s]=p.useState(!1);return p.useEffect(()=>{if(!n)return;const i=setTimeout(()=>s(!1),1200);return()=>clearTimeout(i)},[n]),!e||!t?null:h.jsxs("button",{type:"button",className:"help-popover-address",title:`Copy “${t}” — search help-content.md for it`,onClick:()=>{navigator.clipboard?.writeText(t).then(()=>s(!0),()=>{})},children:[e,n?" ✓":""]})}const yl=320,jm=320,Lm=800,Nm=8,Vm=24,Im=3;function Bm(e){const t=e.trim().length;return t===0?yl:Math.round(Math.min(Lm,Math.max(jm,Math.sqrt(t*Nm*Vm*Im))))}function $m(){return 393}function Fm(e,t,n,s,i,r){const o=window.innerWidth,a=window.innerHeight,c=Math.min(s??yl,o-16);if(!e){const d=i??new DOMRect(0,0,o,a),f=d.left+d.width/2;return{left:Math.max(8,Math.min(f-c/2,o-c-8)),top:"50%",transform:"translateY(-50%)",maxHeight:`${a-16}px`,width:c}}return{positionArea:t?{right:"inline-end span-block-end",left:"inline-start span-block-end",top:"block-start span-inline-end",bottom:"block-end span-inline-end"}[t]:r==="below"?"block-end span-inline-end":"inline-end span-block-end",width:c,..._m(n)}}function _m(e){return e?{marginLeft:"px"in e?`${e.px}px`:`calc(anchor-size(${e.of}) * ${e.times})`}:{}}const is=e=>e&&e.trim()?e.trim():void 0;function Hm(e){return{"model-description":t=>is(e.getClassDescription(t)),"enum-description":t=>is(e.getEnumDetail(t)?.description),"category-label":t=>is(nr.find(n=>n.id===t)?.label)}}const Wm=`# BDCHM Explorer help

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
<summary><b>Ownership</b></summary>

## Ownership
- **TourMetadata:**
- **Description:** Why boxes land where they do, and what the three kinds of line mean

<!--

I want to restructure this

-->
### why-ownership

- **Title:** Ownership
- **Tour:** Ownership
- **Only:** panels=0
- **Anchor:** none
- **Width:** 560
- **Description:**
  The canvas is laid out by **ownership**: an entity is drawn to the right of
  whatever owns it. That one idea is what the whole diagram is about, and it
  is not in the schema. A LinkML schema says that Visit has an attribute
  holding a Participant; it does not say which of the two contains the
  other, and the generated documentation cannot show it either.

  So the Explorer decides, with a few rules, and draws the result. This
  tour shows the rules on real cases. There are three kinds of line:

  - **owns** — the line runs from the owner's row to the entity it holds;
  - **belongs to** — the line runs from the member's row BACK to the entity
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
`,gi={inTour:!1,held:[],tempHeld:[],tour:[],region:0,tourStates:[],scalars:{}},zm="~";function er(e,t){return e&&t.includes(e)?e:null}function wl(e,t=!1){const n=new URLSearchParams(e),s={};if(n.get("panels")==="0"){for(const c of Ga)s[c]=!1;s.detail=null}n.has("detail")&&(s.detail=n.get("detail")||null),n.has("roots")&&(s.roots=n.get("roots")==="1"),n.has("sibs")&&(s.sibs=n.get("sibs")==="1"),n.has("legend")&&(s.legend=n.get("legend")==="1"),n.has("cases")&&(s.cases=n.get("cases")==="1");const i=er(n.get("dir"),["RIGHT","DOWN"]);i&&(s.dir=i);const r=er(n.get("merge"),["near","far","bend","off"]);r&&(s.merge=r);const o=n.get("sel"),a=o?o.split(zm).filter(Boolean):Ka(n);return t?{sel:a,scalars:s,replace:!0}:{sel:a,scalars:s}}function Dt(e,t){return[...new Set([...e,...t])]}function Um(e){return{...gi,inTour:!0,held:[...e]}}function Gm(){return gi}function Km(e){return Dt(e.held,e.tempHeld)}function bl(e,t){const n=t.replace?e.region+1:e.region,s=t.replace?[...t.sel]:Dt(e.tour,t.sel),i={...e.scalars,...t.scalars};return{...e,tour:s,region:n,scalars:i,tourStates:[...e.tourStates,{sel:s,scalars:i,region:n}]}}function xl(e){if(e.tourStates.length===0)return e;const t=e.tourStates.slice(0,-1),n=t[t.length-1];return{...e,tourStates:t,tour:n?n.sel:[],region:n?n.region:0}}function yi(e){return e.region>0}function Qm(e,t){if(!e.inTour)return e;const n=yi(e)?"tempHeld":"held";return e[n].includes(t)?e:{...e,[n]:[...e[n],t]}}function qm(e,t){if(!e.inTour)return e;const n=s=>s.filter(i=>i!==t);return{...e,tour:n(e.tour),tempHeld:n(e.tempHeld),held:yi(e)?e.held:n(e.held)}}function wi(e,t){if(!t.inTour)return e;const n=yi(t)?Dt(t.tour,t.tempHeld):Dt(Dt(t.tour,t.tempHeld),t.held);return{...e,...t.scalars,sel:n}}function Xm(){const{modelData:e,loading:t,error:n}=Ll(),s=p.useMemo(()=>e?new Nl(e):null,[e]),{setTextResolvers:i}=st(),r=p.useMemo(()=>s?Hm(s):void 0,[s]);p.useEffect(()=>i(r),[r,i]);const o=p.useMemo(()=>Ie(),[]),[a,c]=p.useState(()=>new Set(o.sel)),[l,d]=p.useState(o.detail),[f,u]=p.useState(!1),m=p.useRef(!1),[g,b]=p.useState(o.roots),[y,x]=p.useState(o.sibs),[S,v]=p.useState(o.dir),[w,k]=p.useState(o.merge),[A,C]=p.useState(o.cases),[E,L]=p.useState(o.legend),[K,W]=p.useState(!1),I=p.useCallback(R=>{c(new Set(R.sel)),b(!!R.roots),d(null)},[]);p.useEffect(()=>{const R=()=>{const $=Ie();c(new Set($.sel)),d($.detail),b($.roots),x($.sibs),v($.dir),k($.merge),L($.legend),C($.cases)};return window.addEventListener("popstate",R),window.addEventListener("explore:state-from-url",R),()=>{window.removeEventListener("popstate",R),window.removeEventListener("explore:state-from-url",R)}},[]),p.useEffect(()=>{const R={sel:[...a],detail:l,roots:g,sibs:y,dir:S,merge:w,legend:E,cases:A},$=m.current;m.current=!1,Qa(R,{push:$})},[a,l,g,y,S,w,E,A]);const O=p.useCallback(R=>{lt(R,!Ie().sel.includes(R)),c($=>{const M=new Set($);return M.has(R)?M.delete(R):M.add(R),M})},[]),B=p.useCallback(R=>{lt(R,!0),c($=>$.has(R)?$:new Set($).add(R))},[]),Y=p.useCallback(R=>{lt(R,!1),c($=>{if(!$.has(R))return $;const M=new Set($);return M.delete(R),M})},[]),te=p.useCallback(R=>{c(M=>M.size===R.length&&R.every(q=>M.has(q))?M:(m.current=!0,new Set(R)));const $=new Set(R);for(const M of Ie().sel)$.has(M)||lt(M,!1);for(const M of R)lt(M,!0)},[]),ge=p.useCallback(()=>{for(const R of Ie().sel)lt(R,!1);c(new Set),d(null),u(!1),b(!1)},[]);return n?h.jsxs("div",{className:"p-8 text-red-600",children:["Failed to load model data: ",String(n)]}):t||!s?h.jsx("div",{className:"p-8 text-gray-400",children:"Loading model…"}):h.jsxs("div",{className:"relative flex flex-col h-screen bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100",children:[h.jsxs("header",{className:"flex items-center justify-between px-4 py-2 bg-blue-600 text-white shrink-0",children:[h.jsxs("div",{children:[h.jsx("h1",{"data-help-id":"app-title",className:"text-lg font-bold leading-tight cursor-pointer hover:opacity-80 transition-opacity",onClick:ge,title:"Click to clear the selection and reset the view",children:"BDCHM Explorer"}),h.jsx("p",{className:"text-xs text-blue-100",children:"BioData Catalyst Harmonized Model"})]}),h.jsxs("div",{className:"flex items-center gap-4",children:[h.jsx(sg,{}),h.jsx(wm,{}),h.jsx(rm,{onOpenLegend:()=>L(R=>!R),onOpenCases:()=>C(R=>!R),legendOpen:E,casesOpen:A,anyPanelOpen:E||A||l!==null,onClosePanels:()=>{L(!1),C(!1),d(null)}}),h.jsx("button",{onClick:async()=>{const R=Op({sel:[...a],detail:l,roots:g,sibs:y,dir:S,merge:w,legend:E,cases:A});try{await navigator.clipboard.writeText(R),W(!0),window.setTimeout(()=>W(!1),1500)}catch{W(!1),window.prompt("Copy this link:",R)}},"data-help-id":"copy-link",className:"text-sm underline text-blue-100 hover:text-white",title:"Copy a link that reproduces exactly this view, settings included",children:K?"✓ copied":"copy link"}),h.jsx("a",{href:"/dynamic-model-var-docs/previous.html",className:"text-sm underline text-blue-100 hover:text-white",children:"previous views"}),h.jsx("a",{href:"https://github.com/Sigfried/dynamic-model-var-docs",target:"_blank",rel:"noopener noreferrer",className:"text-blue-100 hover:text-white",title:"Source code on GitHub","aria-label":"Source code on GitHub",children:h.jsx("svg",{viewBox:"0 0 16 16",width:"18",height:"18",fill:"currentColor","aria-hidden":!0,children:h.jsx("path",{d:"M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"})})})]})]}),E&&h.jsx(tm,{onClose:()=>L(!1),onSelect:R=>I({name:"ad hoc",note:"",sel:R}),dataService:s}),A&&h.jsx(Yp,{onClose:()=>C(!1),onApply:I,selectedIds:a,dataService:s,offset:E}),h.jsxs("div",{className:"flex-1 flex min-h-0",children:[f?h.jsxs("button",{onClick:()=>u(!1),title:"Show entity selection",className:`shrink-0 w-8 border-r border-gray-200 dark:border-slate-700
                       bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700
                       flex flex-col items-center gap-2 py-2 text-gray-400`,children:[h.jsx("span",{className:"text-xs",children:"▶"}),h.jsxs("span",{className:"text-[10px] uppercase tracking-wider [writing-mode:vertical-rl]",children:[s.getConceptLabel("entity",!0),a.size>0?` (${a.size})`:""]})]}):h.jsxs("div",{className:"w-80 shrink-0 flex flex-col min-h-0 border-r border-gray-200 dark:border-slate-700",children:[h.jsx("div",{className:"flex-1 overflow-y-auto min-h-0","data-help-id":"selection-tree",children:h.jsx(Ul,{dataService:s,selectedIds:a,onToggle:O,onShowCategory:te})}),h.jsx("button",{onClick:()=>u(!0),title:"Hide entity selection",className:`shrink-0 px-3 py-1 text-xs text-gray-400 border-t border-gray-200
                         dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 text-left`,children:"◀ Hide"})]}),h.jsx("div",{className:"flex-1 min-w-0","data-help-id":"graph-canvas",children:a.size===0?h.jsx("div",{className:"h-full flex items-center justify-center text-sm text-gray-400 p-8",children:"Select entities on the left to build the ownership subgraph."}):h.jsx(Up,{dataService:s,selectedIds:a,onNodeClick:d,onAdd:B,onRemove:Y,pathToRoot:g,onTogglePathToRoot:()=>b(R=>!R),direction:S,setDirection:v,mergeMode:w,setMergeMode:k,mergeSibs:y,setMergeSibs:x})}),l&&h.jsx(Gp,{classId:l,dataService:s,onClose:()=>d(null),onNavigate:d,isSelected:a.has(l),onToggleSelect:O})]})]})}let he=gi;function lt(e,t){he=t?Qm(he,e):qm(he,e)}function Mn(e){Qa(e),window.dispatchEvent(new Event("explore:state-from-url"))}function Ym(){he=Um(Ie().sel)}function Zm(){if(!he.inTour)return;const e=Km(he),t=Ie();he=Gm(),Mn({...t,sel:e})}function Jm(e,t=!1){he=bl(he,wl(e,t)),Mn(wi(Ie(),he))}function eg(){he=xl(he),Mn(wi(Ie(),he))}function tg(e,t){for(let n=0;n<t;n++)he=xl(he);for(const n of e)he=bl(he,wl(n.query,n.replace));Mn(wi(Ie(),he))}function ng(){return h.jsxs(km,{markdown:Wm,onPushChange:Jm,onPopChange:eg,onJumpChanges:tg,onTourStart:Ym,onTourEnd:Zm,children:[h.jsx(Xm,{}),h.jsx(Om,{})]})}function sg(){const{helpMode:e,toggleHelpMode:t,startTour:n}=st();return p.useEffect(()=>{Ep()&&n()},[]),h.jsx("span",{className:"flex items-center gap-2","data-help-id":"help-button",children:nm})}Vl.createRoot(document.getElementById("root")).render(h.jsx(p.StrictMode,{children:h.jsx(ng,{})}));
