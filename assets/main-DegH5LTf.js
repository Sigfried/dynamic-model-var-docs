import{i as Di,p as lc,r as y,j as d,E as Ke,O as Qs,g as cc,a as Br,b as $r,S as uc,c as hc,d as dc,s as fc,w as pc,R as He,e as mc,f as gc,m as yc,h as bc,k as wc,l as Fr,n as Ys,o as _r,v as xc,q as qn,t as Ye,u as nt,x as Zt,y as Ae,z as Cn,A as An,M as Jt,B as vc,C as kc,D as Tc,F as Sc}from"./index-DHwbe8Go.js";function Hr(e){return[...new Set([...e.classIds,...e.pins])]}const Cc=e=>`entity-row:${e}`,Ac=e=>`entity-checkbox:${e}`,Pc=e=>`category-row:${e}`,Ec=e=>`node-box:${e}`,Dc=e=>`child-header:${e}`,Mc=(e,t)=>`slot-row:${e}.${t}`,Wr=e=>Di(e.id)?lc(e.id):e.id,Oc=e=>Ec(Wr(e)),Rc=(e,t)=>Mc(t.declaringClass??Wr(e),t.slot);function jc({dataService:e,selectedIds:t,onToggle:n,onShowCategory:i}){const s=y.useMemo(()=>e.getCategoryTrees(),[e]),[r,o]=y.useState(new Set),a=c=>o(u=>{const f=new Set(u);return f.has(c)?f.delete(c):f.add(c),f}),l=s.reduce((c,u)=>c+u.classIds.length,0);return d.jsxs("div",{className:"text-sm",children:[d.jsx("div",{className:"flex items-baseline gap-2 px-3 py-2 border-b border-gray-200 dark:border-slate-700",children:d.jsxs("span",{className:"font-semibold flex-1",children:[e.getConceptLabel("entity",!0)," (",l,")"]})}),s.map(c=>{const u=r.has(c.id),f=c.classIds.filter(h=>t.has(h)).length;return d.jsxs("div",{children:[d.jsxs("div",{"data-help-id":Pc(c.id),className:`w-full flex items-stretch font-medium
                         bg-gray-50 dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700`,children:[d.jsxs("button",{type:"button",onClick:()=>a(c.id),className:`flex-1 min-w-0 flex items-center gap-2 px-3 py-1.5 text-left
                           hover:bg-gray-100 dark:hover:bg-slate-700`,children:[d.jsx("span",{className:"text-xs text-gray-400",children:u?"▶":"▼"}),d.jsx("span",{className:"flex-1 truncate",children:c.label}),f>0&&d.jsxs("span",{className:"text-xs text-gray-400",children:[f," / ",c.classIds.length]})]}),i&&d.jsx("button",{type:"button","data-show-category":c.id,title:`Draw the ${c.label} content view — replaces the canvas`,onClick:()=>i(Hr(c)),className:`px-2.5 shrink-0 text-gray-400 border-l border-gray-100
                             dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700
                             hover:text-blue-600 dark:hover:text-sky-400`,children:"⊞"})]}),!u&&c.roots.map(h=>d.jsx(zr,{node:h,depth:0,selectedIds:t,onToggle:n},h.classId))]},c.id)})]})}function zr({node:e,depth:t,selectedIds:n,onToggle:i}){const{classId:s}=e;return d.jsxs(d.Fragment,{children:[d.jsxs("label",{"data-class-row":s,"data-help-id":Cc(s),className:`flex items-center gap-2 pr-3 py-1 cursor-pointer
                    hover:bg-blue-50 dark:hover:bg-slate-800
                    ${n.has(s)?"bg-blue-50 dark:bg-slate-800":""}`,style:{paddingLeft:`${.75+t*1}rem`},children:[d.jsx("input",{type:"checkbox","data-help-id":Ac(s),checked:n.has(s),onChange:()=>i(s)}),d.jsxs("span",{className:"flex-1 min-w-0 truncate",children:[d.jsx("span",{className:"font-mono text-xs",children:s}),e.outOfCategoryParent&&d.jsxs("span",{className:"ml-1 text-[10px] text-gray-400 dark:text-slate-500",title:`Extends ${e.outOfCategoryParent}, which is in another category`,children:["↳ ",e.outOfCategoryParent]})]})]}),e.children.map(r=>d.jsx(zr,{node:r,depth:t+1,selectedIds:n,onToggle:i},r.classId))]})}const ls=y.createContext({});function cs(e){const t=y.useRef(null);return t.current===null&&(t.current=e()),t.current}const Lc=typeof window<"u",Pn=Lc?y.useLayoutEffect:y.useEffect,Bn=y.createContext(null);function us(e,t){e.indexOf(t)===-1&&e.push(t)}function En(e,t){const n=e.indexOf(t);n>-1&&e.splice(n,1)}const Ge=(e,t,n)=>n>t?t:n<e?e:n;let $n=()=>{};const Ze={},Gr=e=>/^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(e),Ur=e=>typeof e=="object"&&e!==null,Kr=e=>/^0[^.\s]+$/u.test(e);function qr(e){let t;return()=>(t===void 0&&(t=e()),t)}const Re=e=>e,zt=(...e)=>e.reduce((t,n)=>i=>n(t(i))),$t=(e,t,n)=>{const i=t-e;return i?(n-e)/i:1};class hs{constructor(){this.subscriptions=[]}add(t){return us(this.subscriptions,t),()=>En(this.subscriptions,t)}notify(t,n,i){const s=this.subscriptions.length;if(s)if(s===1)this.subscriptions[0](t,n,i);else for(let r=0;r<s;r++){const o=this.subscriptions[r];o&&o(t,n,i)}}getSize(){return this.subscriptions.length}clear(){this.subscriptions.length=0}}const je=e=>e*1e3,Oe=e=>e/1e3,Qr=(e,t)=>t?e*(1e3/t):0,Yr=(e,t,n)=>(((1-3*n+3*t)*e+(3*n-6*t))*e+3*t)*e,Nc=1e-7,Vc=12;function Ic(e,t,n,i,s){let r,o,a=0;do o=t+(n-t)/2,r=Yr(o,i,s)-e,r>0?n=o:t=o;while(Math.abs(r)>Nc&&++a<Vc);return o}function Gt(e,t,n,i){if(e===t&&n===i)return Re;const s=r=>Ic(r,0,1,e,n);return r=>r===0||r===1?r:Yr(s(r),t,i)}const Xr=e=>t=>t<=.5?e(2*t)/2:(2-e(2*(1-t)))/2,Zr=e=>t=>1-e(1-t),Jr=Gt(.33,1.53,.69,.99),ds=Zr(Jr),ea=Xr(ds),ta=e=>e>=1?1:(e*=2)<1?.5*ds(e):.5*(2-Math.pow(2,-10*(e-1))),fs=e=>1-Math.sin(Math.acos(e)),na=Zr(fs),ia=Xr(fs),Bc=Gt(.42,0,1,1),$c=Gt(0,0,.58,1),sa=Gt(.42,0,.58,1),Fc=e=>Array.isArray(e)&&typeof e[0]!="number",oa=e=>Array.isArray(e)&&typeof e[0]=="number",_c={linear:Re,easeIn:Bc,easeInOut:sa,easeOut:$c,circIn:fs,circInOut:ia,circOut:na,backIn:ds,backInOut:ea,backOut:Jr,anticipate:ta},Hc=e=>typeof e=="string",Xs=e=>{if(oa(e)){$n(e.length===4);const[t,n,i,s]=e;return Gt(t,n,i,s)}else if(Hc(e))return _c[e];return e},en=["setup","read","resolveKeyframes","preUpdate","update","preRender","render","postRender"];function Wc(e){let t=new Set,n=new Set,i=!1,s=!1;const r=new WeakSet;let o={delta:0,timestamp:0,isProcessing:!1};function a(c){r.has(c)&&(l.schedule(c),e()),c(o)}const l={schedule:(c,u=!1,f=!1)=>{const g=f&&i?t:n;return u&&r.add(c),g.add(c),c},cancel:c=>{n.delete(c),r.delete(c)},process:c=>{if(o=c,i){s=!0;return}i=!0;const u=t;t=n,n=u,t.forEach(a),t.clear(),i=!1,s&&(s=!1,l.process(c))}};return l}const zc=40;function ra(e,t){let n=!1,i=!0;const s={delta:0,timestamp:0,isProcessing:!1},r=()=>n=!0,o=en.reduce((v,x)=>(v[x]=Wc(r),v),{}),{setup:a,read:l,resolveKeyframes:c,preUpdate:u,update:f,preRender:h,render:g,postRender:p}=o,b=()=>{const v=Ze.useManualTiming,x=v?s.timestamp:performance.now();n=!1,v||(s.delta=i?1e3/60:Math.max(Math.min(x-s.timestamp,zc),1)),s.timestamp=x,s.isProcessing=!0,a.process(s),l.process(s),c.process(s),u.process(s),f.process(s),h.process(s),g.process(s),p.process(s),s.isProcessing=!1,n&&t&&(i=!1,e(b))},m=()=>{n=!0,i=!0,s.isProcessing||e(b)};return{schedule:en.reduce((v,x)=>{const C=o[x];return v[x]=(D,T=!1,P=!1)=>(n||m(),C.schedule(D,T,P)),v},{}),cancel:v=>{for(let x=0;x<en.length;x++)o[en[x]].cancel(v)},state:s,steps:o}}const{schedule:te,cancel:Je,state:ge,steps:Qn}=ra(typeof requestAnimationFrame<"u"?requestAnimationFrame:Re,!0);let mn;function Gc(){mn=void 0}const ke={now:()=>(mn===void 0&&ke.set(ge.isProcessing||Ze.useManualTiming?ge.timestamp:performance.now()),mn),set:e=>{mn=e,queueMicrotask(Gc)}},aa=e=>t=>typeof t=="string"&&t.startsWith(e),la=aa("--"),Uc=aa("var(--"),ps=e=>Uc(e)?Kc.test(e.split("/*")[0].trim()):!1,Kc=/var\(--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)$/iu;function Zs(e){return typeof e!="string"?!1:e.split("/*")[0].includes("var(--")}const St={test:e=>typeof e=="number",parse:parseFloat,transform:e=>e},Ft={...St,transform:e=>Ge(0,1,e)},tn={...St,default:1},Rt=e=>Math.round(e*1e5)/1e5,ms=/-?(?:\d+(?:\.\d+)?|\.\d+)/gu;function qc(e){return e==null}const Qc=/^(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))$/iu,gs=(e,t)=>n=>!!(typeof n=="string"&&Qc.test(n)&&n.startsWith(e)||t&&!qc(n)&&Object.prototype.hasOwnProperty.call(n,t)),ca=(e,t,n)=>i=>{if(typeof i!="string")return i;const[s,r,o,a]=i.match(ms);return{[e]:parseFloat(s),[t]:parseFloat(r),[n]:parseFloat(o),alpha:a!==void 0?parseFloat(a):1}},Yc=e=>Ge(0,255,e),Yn={...St,transform:e=>Math.round(Yc(e))},ot={test:gs("rgb","red"),parse:ca("red","green","blue"),transform:({red:e,green:t,blue:n,alpha:i=1})=>"rgba("+Yn.transform(e)+", "+Yn.transform(t)+", "+Yn.transform(n)+", "+Rt(Ft.transform(i))+")"};function Xc(e){let t="",n="",i="",s="";return e.length>5?(t=e.substring(1,3),n=e.substring(3,5),i=e.substring(5,7),s=e.substring(7,9)):(t=e.substring(1,2),n=e.substring(2,3),i=e.substring(3,4),s=e.substring(4,5),t+=t,n+=n,i+=i,s+=s),{red:parseInt(t,16),green:parseInt(n,16),blue:parseInt(i,16),alpha:s?parseInt(s,16)/255:1}}const Mi={test:gs("#"),parse:Xc,transform:ot.transform},Ut=e=>({test:t=>typeof t=="string"&&t.endsWith(e)&&t.split(" ").length===1,parse:parseFloat,transform:t=>`${t}${e}`}),Ue=Ut("deg"),ze=Ut("%"),$=Ut("px"),Zc=Ut("vh"),Jc=Ut("vw"),Js={...ze,parse:e=>ze.parse(e)/100,transform:e=>ze.transform(e*100)},wt={test:gs("hsl","hue"),parse:ca("hue","saturation","lightness"),transform:({hue:e,saturation:t,lightness:n,alpha:i=1})=>"hsla("+Math.round(e)+", "+ze.transform(Rt(t))+", "+ze.transform(Rt(n))+", "+Rt(Ft.transform(i))+")"},le={test:e=>ot.test(e)||Mi.test(e)||wt.test(e),parse:e=>ot.test(e)?ot.parse(e):wt.test(e)?wt.parse(e):Mi.parse(e),transform:e=>typeof e=="string"?e:e.hasOwnProperty("red")?ot.transform(e):wt.transform(e),getAnimatableNone:e=>{const t=le.parse(e);return t.alpha=0,le.transform(t)}},eu=/(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))/giu;function tu(e){return isNaN(e)&&typeof e=="string"&&(e.match(ms)?.length||0)+(e.match(eu)?.length||0)>0}const ua="number",ha="color",nu="var",iu="var(",eo="${}",su=/var\s*\(\s*--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)|#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\)|-?(?:\d+(?:\.\d+)?|\.\d+)/giu;function kt(e){const t=e.toString(),n=[],i={color:[],number:[],var:[]},s=[];let r=0;const a=t.replace(su,l=>(le.test(l)?(i.color.push(r),s.push(ha),n.push(le.parse(l))):l.startsWith(iu)?(i.var.push(r),s.push(nu),n.push(l)):(i.number.push(r),s.push(ua),n.push(parseFloat(l))),++r,eo)).split(eo);return{values:n,split:a,indexes:i,types:s}}function ou(e){return kt(e).values}function da({split:e,types:t}){const n=e.length;return i=>{let s="";for(let r=0;r<n;r++)if(s+=e[r],i[r]!==void 0){const o=t[r];o===ua?s+=Rt(i[r]):o===ha?s+=le.transform(i[r]):s+=i[r]}return s}}function ru(e){return da(kt(e))}const au=e=>typeof e=="number"?0:le.test(e)?le.getAnimatableNone(e):e,lu=(e,t)=>typeof e=="number"?t?.trim().endsWith("/")?e:0:au(e);function cu(e){const t=kt(e);return da(t)(t.values.map((i,s)=>lu(i,t.split[s])))}const $e={test:tu,parse:ou,createTransformer:ru,getAnimatableNone:cu};function Xn(e,t,n){return n<0&&(n+=1),n>1&&(n-=1),n<1/6?e+(t-e)*6*n:n<1/2?t:n<2/3?e+(t-e)*(2/3-n)*6:e}function uu({hue:e,saturation:t,lightness:n,alpha:i}){e/=360,t/=100,n/=100;let s=0,r=0,o=0;if(!t)s=r=o=n;else{const a=n<.5?n*(1+t):n+t-n*t,l=2*n-a;s=Xn(l,a,e+1/3),r=Xn(l,a,e),o=Xn(l,a,e-1/3)}return{red:Math.round(s*255),green:Math.round(r*255),blue:Math.round(o*255),alpha:i}}function Dn(e,t){return n=>n>0?t:e}const ee=(e,t,n)=>e+(t-e)*n,Zn=(e,t,n)=>{const i=e*e,s=n*(t*t-i)+i;return s<0?0:Math.sqrt(s)},hu=[Mi,ot,wt],du=e=>hu.find(t=>t.test(e));function to(e){const t=du(e);if(!t)return!1;let n=t.parse(e);return t===wt&&(n=uu(n)),n}const no=(e,t)=>{const n=to(e),i=to(t);if(!n||!i)return Dn(e,t);const s={...n};return r=>(s.red=Zn(n.red,i.red,r),s.green=Zn(n.green,i.green,r),s.blue=Zn(n.blue,i.blue,r),s.alpha=ee(n.alpha,i.alpha,r),ot.transform(s))},Oi=new Set(["none","hidden"]);function fu(e,t){return Oi.has(e)?n=>n<=0?e:t:n=>n>=1?t:e}function pu(e,t){return n=>ee(e,t,n)}function ys(e){return typeof e=="number"?pu:typeof e=="string"?ps(e)?Dn:le.test(e)?no:yu:Array.isArray(e)?fa:typeof e=="object"?le.test(e)?no:mu:Dn}function fa(e,t){const n=[...e],i=n.length,s=e.map((r,o)=>ys(r)(r,t[o]));return r=>{for(let o=0;o<i;o++)n[o]=s[o](r);return n}}function mu(e,t){const n={...e,...t},i={};for(const s in n)e[s]!==void 0&&t[s]!==void 0&&(i[s]=ys(e[s])(e[s],t[s]));return s=>{for(const r in i)n[r]=i[r](s);return n}}function gu(e,t){const n=[],i={color:0,var:0,number:0};for(let s=0;s<t.values.length;s++){const r=t.types[s],o=e.indexes[r][i[r]],a=e.values[o]??0;n[s]=a,i[r]++}return n}const yu=(e,t)=>{const n=$e.createTransformer(t),i=kt(e),s=kt(t);return i.indexes.var.length===s.indexes.var.length&&i.indexes.color.length===s.indexes.color.length&&i.indexes.number.length>=s.indexes.number.length?Oi.has(e)&&!s.values.length||Oi.has(t)&&!i.values.length?fu(e,t):zt(fa(gu(i,s),s.values),n):Dn(e,t)};function pa(e,t,n){return typeof e=="number"&&typeof t=="number"&&typeof n=="number"?ee(e,t,n):ys(e)(e,t)}const bu=e=>{const t=({timestamp:n})=>e(n);return{start:(n=!0)=>te.update(t,n),stop:()=>Je(t),now:()=>ge.isProcessing?ge.timestamp:ke.now()}},ma=(e,t,n=10)=>{let i="";const s=Math.max(Math.round(t/n),2);for(let r=0;r<s;r++)i+=Math.round(e(r/(s-1))*1e4)/1e4+", ";return`linear(${i.substring(0,i.length-2)})`},bs=2e4;function ws(e,t=50,n=bs,i){let s=0,r=e.next(s);for(;!r.done&&s<n;)s+=t,r=e.next(s);return s>=n?1/0:s}function wu(e,t=100,n){const i=n({...e,keyframes:[0,t]}),s=Math.min(ws(i),bs);return{type:"keyframes",ease:r=>i.next(s*r).value/t,duration:Oe(s)}}const se={stiffness:100,damping:10,mass:1,velocity:0,duration:800,bounce:.3,visualDuration:.3,restSpeed:{granular:.01,default:2},restDelta:{granular:.005,default:.5},minDuration:.01,maxDuration:10,minDamping:.05,maxDamping:1};function Ri(e,t){return e*Math.sqrt(1-t*t)}const xu=12;function vu(e,t,n){let i=n;for(let s=1;s<xu;s++)i=i-e(i)/t(i);return i}const Jn=.001;function ku({duration:e=se.duration,bounce:t=se.bounce,velocity:n=se.velocity,mass:i=se.mass}){let s,r,o=1-t;o=Ge(se.minDamping,se.maxDamping,o),e=Ge(se.minDuration,se.maxDuration,Oe(e)),o<1?(s=c=>{const u=c*o,f=u*e,h=u-n,g=Ri(c,o),p=Math.exp(-f);return Jn-h/g*p},r=c=>{const f=c*o*e,h=f*n+n,g=o*o*c*c*e,p=Math.exp(-f),b=Ri(c*c,o);return(-s(c)+Jn>0?-1:1)*((h-g)*p)/b}):(s=c=>{const u=Math.exp(-c*e),f=(c-n)*e+1;return-Jn+u*f},r=c=>{const u=Math.exp(-c*e),f=(n-c)*(e*e);return u*f});const a=5/e,l=vu(s,r,a);if(e=je(e),isNaN(l))return{stiffness:se.stiffness,damping:se.damping,duration:e};{const c=l*l*i;return{stiffness:c,damping:o*2*Math.sqrt(i*c),duration:e}}}const Tu=["duration","bounce"],Su=["stiffness","damping","mass"];function io(e,t){return t.some(n=>e[n]!==void 0)}function Cu(e){let t={velocity:se.velocity,stiffness:se.stiffness,damping:se.damping,mass:se.mass,isResolvedFromDuration:!1,...e};if(!io(e,Su)&&io(e,Tu))if(t.velocity=0,e.visualDuration){const n=e.visualDuration,i=2*Math.PI/(n*1.2),s=i*i,r=2*Ge(.05,1,1-(e.bounce||0))*Math.sqrt(s);t={...t,mass:se.mass,stiffness:s,damping:r}}else{const n=ku({...e,velocity:0});t={...t,...n,mass:se.mass},t.isResolvedFromDuration=!0}return t}function Mn(e=se.visualDuration,t=se.bounce){const n=typeof e!="object"?{visualDuration:e,keyframes:[0,1],bounce:t}:e;let{restSpeed:i,restDelta:s}=n;const r=n.keyframes[0],o=n.keyframes[n.keyframes.length-1],a={done:!1,value:r},{stiffness:l,damping:c,mass:u,duration:f,velocity:h,isResolvedFromDuration:g}=Cu({...n,velocity:-Oe(n.velocity||0)}),p=h||0,b=c/(2*Math.sqrt(l*u)),m=o-r,w=Oe(Math.sqrt(l/u)),k=b*w,v=Math.abs(m)<5;i||(i=v?se.restSpeed.granular:se.restSpeed.default),s||(s=v?se.restDelta.granular:se.restDelta.default);let x,C;if(b<1){const T=Ri(w,b),P=(p+k*m)/T,E=k*P+m*T,L=k*m-P*T;let I=-1,B=0,O=0;const _=S=>{if(S!==I){I=S;const z=Math.exp(-k*S),fe=Math.sin(T*S),N=Math.cos(T*S);B=o-z*(P*fe+m*N),O=z*(E*fe+L*N)}};x=S=>(_(S),B),C=S=>(_(S),O)}else if(b===1){x=P=>o-Math.exp(-w*P)*(m+(p+w*m)*P);const T=p+w*m;C=P=>Math.exp(-w*P)*(w*T*P-p)}else{const T=w*Math.sqrt(b*b-1);x=I=>{const B=Math.exp(-k*I),O=Math.min(T*I,300);return o-B*((p+k*m)*Math.sinh(O)+T*m*Math.cosh(O))/T};const P=(p+k*m)/T,E=k*P-m*T,L=k*m-P*T;C=I=>{const B=Math.exp(-k*I),O=Math.min(T*I,300);return B*(E*Math.sinh(O)+L*Math.cosh(O))}}const D={calculatedDuration:g&&f||null,velocity:T=>je(C(T)),next:T=>{const P=x(T);if(g)a.done=T>=f;else{const E=je(C(T));a.done=Math.abs(E)<=i&&Math.abs(o-P)<=s}return a.value=a.done?o:P,a},toString:()=>{const T=Math.min(ws(D),bs),P=ma(E=>D.next(T*E).value,T,30);return T+"ms "+P},toTransition:()=>{}};return D}Mn.applyToOptions=e=>{const t=wu(e,100,Mn);return e.ease=t.ease,e.duration=je(t.duration),e.type="keyframes",e};function ji({keyframes:e,velocity:t=0,power:n=.8,timeConstant:i=325,bounceDamping:s=10,bounceStiffness:r=500,modifyTarget:o,min:a,max:l,restDelta:c=.5,restSpeed:u}){const f=e[0],h={done:!1,value:f},g=T=>T<a||T>l,p=T=>a===void 0?l:l===void 0||Math.abs(a-T)<Math.abs(l-T)?a:l;let b=n*t;const m=f+b,w=o===void 0?m:o(m);w!==m&&(b=w-f);const k=T=>-b*Math.exp(-T/i),v=T=>{const P=k(T);h.done=Math.abs(P)<=c,h.value=h.done?w:w+P};let x,C;const D=T=>{g(h.value)&&(x=T,C=Mn({keyframes:[h.value,p(h.value)],velocity:-k(T)/i*1e3,damping:s,stiffness:r,restDelta:c,restSpeed:u}))};return D(0),{calculatedDuration:null,next:T=>{let P=!1;return!C&&x===void 0&&(P=!0,v(T),D(T)),x!==void 0&&T>=x?C.next(T-x):(!P&&v(T),h)}}}function Au(e,t,n){const i=[],s=n||Ze.mix||pa,r=e.length-1;for(let o=0;o<r;o++){let a=s(e[o],e[o+1]);if(t){const l=Array.isArray(t)?t[o]||Re:t;a=zt(l,a)}i.push(a)}return i}function Pu(e,t,{clamp:n=!0,ease:i,mixer:s}={}){const r=e.length;if($n(r===t.length),r===1)return()=>t[0];if(r===2&&t[0]===t[1])return()=>t[1];const o=e[0]===e[1];e[0]>e[r-1]&&(e=[...e].reverse(),t=[...t].reverse());const a=Au(t,i,s),l=a.length,c=u=>{if(o&&u<e[0])return t[0];let f=0;if(l>1)for(;f<e.length-2&&!(u<e[f+1]);f++);const h=$t(e[f],e[f+1],u);return a[f](h)};return n?u=>c(Ge(e[0],e[r-1],u)):c}function Eu(e,t){const n=e[e.length-1];for(let i=1;i<=t;i++){const s=$t(0,t,i);e.push(ee(n,1,s))}}function Du(e){const t=[0];return Eu(t,e.length-1),t}function Mu(e,t){return e.map(n=>n*t)}function Ou(e,t){return e.map(()=>t||sa).splice(0,e.length-1)}function jt({duration:e=300,keyframes:t,times:n,ease:i="easeInOut"}){const s=Fc(i)?i.map(Xs):Xs(i),r={done:!1,value:t[0]},o=Mu(n&&n.length===t.length?n:Du(t),e),a=Pu(o,t,{ease:Array.isArray(s)?s:Ou(t,s)});return{calculatedDuration:e,next:l=>(r.value=a(l),r.done=l>=e,r)}}const Ru=5;function ju(e,t,n){const i=Math.max(t-Ru,0);return Qr(n-e(i),t-i)}const Lu=e=>e!==null;function Fn(e,{repeat:t,repeatType:n="loop"},i,s=1){const r=e.filter(Lu),a=s<0||t&&n!=="loop"&&t%2===1?0:r.length-1;return!a||i===void 0?r[a]:i}const Nu={decay:ji,inertia:ji,tween:jt,keyframes:jt,spring:Mn};function ga(e){typeof e.type=="string"&&(e.type=Nu[e.type])}class xs{constructor(){this.updateFinished()}get finished(){return this._finished}updateFinished(){this._finished=new Promise(t=>{this.resolve=t})}notifyFinished(){this.resolve()}then(t,n){return this.finished.then(t,n)}}const Vu=e=>e/100;class On extends xs{constructor(t){super(),this.state="idle",this.startTime=null,this.isStopped=!1,this.currentTime=0,this.holdTime=null,this.playbackSpeed=1,this.delayState={done:!1,value:void 0},this.stop=()=>{const{motionValue:n}=this.options;n&&n.updatedAt!==ke.now()&&this.tick(ke.now()),this.isStopped=!0,this.state!=="idle"&&(this.teardown(),this.options.onStop?.())},this.options=t,this.initAnimation(),this.play(),t.autoplay===!1&&this.pause()}initAnimation(){const{options:t}=this;ga(t);const{type:n=jt,repeat:i=0,repeatDelay:s=0,repeatType:r,velocity:o=0}=t;let{keyframes:a}=t;const l=n||jt;l!==jt&&typeof a[0]!="number"&&(this.mixKeyframes=zt(Vu,pa(a[0],a[1])),a=[0,100]);const c=l({...t,keyframes:a});r==="mirror"&&(this.mirroredGenerator=l({...t,keyframes:[...a].reverse(),velocity:-o})),c.calculatedDuration===null&&(c.calculatedDuration=ws(c));const{calculatedDuration:u}=c;this.calculatedDuration=u,this.resolvedDuration=u+s,this.totalDuration=this.resolvedDuration*(i+1)-s,this.generator=c}updateTime(t){const n=Math.round(t-this.startTime)*this.playbackSpeed;this.holdTime!==null?this.currentTime=this.holdTime:this.currentTime=n}tick(t,n=!1){const{generator:i,totalDuration:s,mixKeyframes:r,mirroredGenerator:o,resolvedDuration:a,calculatedDuration:l}=this;if(this.startTime===null)return i.next(0);const{delay:c=0,keyframes:u,repeat:f,repeatType:h,repeatDelay:g,type:p,onUpdate:b,finalKeyframe:m}=this.options;this.speed>0?this.startTime=Math.min(this.startTime,t):this.speed<0&&(this.startTime=Math.min(t-s/this.speed,this.startTime)),n?this.currentTime=t:this.updateTime(t);const w=this.currentTime-c*(this.playbackSpeed>=0?1:-1),k=this.playbackSpeed>=0?w<0:w>s;this.currentTime=Math.max(w,0),this.state==="finished"&&this.holdTime===null&&(this.currentTime=s);let v=this.currentTime,x=i;if(f){const P=Math.min(this.currentTime,s)/a;let E=Math.floor(P),L=P%1;!L&&P>=1&&(L=1),L===1&&E--,E=Math.min(E,f+1),E%2&&(h==="reverse"?(L=1-L,g&&(L-=g/a)):h==="mirror"&&(x=o)),v=Ge(0,1,L)*a}let C;k?(this.delayState.value=u[0],C=this.delayState):C=x.next(v),r&&!k&&(C.value=r(C.value));let{done:D}=C;!k&&l!==null&&(D=this.playbackSpeed>=0?this.currentTime>=s:this.currentTime<=0);const T=this.holdTime===null&&(this.state==="finished"||this.state==="running"&&D);return T&&p!==ji&&(C.value=Fn(u,this.options,m,this.speed)),b&&b(C.value),T&&this.finish(),C}then(t,n){return this.finished.then(t,n)}get duration(){return Oe(this.calculatedDuration)}get iterationDuration(){const{delay:t=0}=this.options||{};return this.duration+Oe(t)}get time(){return Oe(this.currentTime)}set time(t){t=je(t),this.currentTime=t,this.startTime===null||this.holdTime!==null||this.playbackSpeed===0?this.holdTime=t:this.driver&&(this.startTime=this.driver.now()-t/this.playbackSpeed),this.driver?this.driver.start(!1):(this.startTime=0,this.state="paused",this.holdTime=t,this.tick(t))}getGeneratorVelocity(){const t=this.currentTime;if(t<=0)return this.options.velocity||0;if(this.generator.velocity)return this.generator.velocity(t);const n=this.generator.next(t).value;return ju(i=>this.generator.next(i).value,t,n)}get speed(){return this.playbackSpeed}set speed(t){const n=this.playbackSpeed!==t;n&&this.driver&&this.updateTime(ke.now()),this.playbackSpeed=t,n&&this.driver&&(this.time=Oe(this.currentTime))}play(){if(this.isStopped)return;const{driver:t=bu,startTime:n}=this.options;this.driver||(this.driver=t(s=>this.tick(s))),this.options.onPlay?.();const i=this.driver.now();this.state==="finished"?(this.updateFinished(),this.startTime=i):this.holdTime!==null?this.startTime=i-this.holdTime:this.startTime||(this.startTime=n??i),this.state==="finished"&&this.speed<0&&(this.startTime+=this.calculatedDuration),this.holdTime=null,this.state="running",this.driver.start()}pause(){this.state="paused",this.updateTime(ke.now()),this.holdTime=this.currentTime}complete(){this.state!=="running"&&this.play(),this.state="finished",this.holdTime=null}finish(){this.notifyFinished(),this.teardown(),this.state="finished",this.options.onComplete?.()}cancel(){this.holdTime=null,this.startTime=0,this.tick(0),this.teardown(),this.options.onCancel?.()}teardown(){this.state="idle",this.stopDriver(),this.startTime=this.holdTime=null}stopDriver(){this.driver&&(this.driver.stop(),this.driver=void 0)}sample(t){return this.startTime=0,this.tick(t,!0)}attachTimeline(t){return this.options.allowFlatten&&(this.options.type="keyframes",this.options.ease="linear",this.initAnimation()),this.driver?.stop(),t.observe(this)}}function Iu(e){for(let t=1;t<e.length;t++)e[t]??(e[t]=e[t-1])}const rt=e=>e*180/Math.PI,Li=e=>{const t=rt(Math.atan2(e[1],e[0]));return Ni(t)},Bu={x:4,y:5,translateX:4,translateY:5,scaleX:0,scaleY:3,scale:e=>(Math.abs(e[0])+Math.abs(e[3]))/2,rotate:Li,rotateZ:Li,skewX:e=>rt(Math.atan(e[1])),skewY:e=>rt(Math.atan(e[2])),skew:e=>(Math.abs(e[1])+Math.abs(e[2]))/2},Ni=e=>(e=e%360,e<0&&(e+=360),e),so=Li,oo=e=>Math.sqrt(e[0]*e[0]+e[1]*e[1]),ro=e=>Math.sqrt(e[4]*e[4]+e[5]*e[5]),$u={x:12,y:13,z:14,translateX:12,translateY:13,translateZ:14,scaleX:oo,scaleY:ro,scale:e=>(oo(e)+ro(e))/2,rotateX:e=>Ni(rt(Math.atan2(e[6],e[5]))),rotateY:e=>Ni(rt(Math.atan2(-e[2],e[0]))),rotateZ:so,rotate:so,skewX:e=>rt(Math.atan(e[4])),skewY:e=>rt(Math.atan(e[1])),skew:e=>(Math.abs(e[1])+Math.abs(e[4]))/2};function Vi(e){return e.includes("scale")?1:0}function Ii(e,t){if(!e||e==="none")return Vi(t);const n=e.match(/^matrix3d\(([-\d.e\s,]+)\)$/u);let i,s;if(n)i=$u,s=n;else{const a=e.match(/^matrix\(([-\d.e\s,]+)\)$/u);i=Bu,s=a}if(!s)return Vi(t);const r=i[t],o=s[1].split(",").map(_u);return typeof r=="function"?r(o):o[r]}const Fu=(e,t)=>{const{transform:n="none"}=getComputedStyle(e);return Ii(n,t)};function _u(e){return parseFloat(e.trim())}const Ct=["transformPerspective","x","y","z","translateX","translateY","translateZ","scale","scaleX","scaleY","rotate","rotateX","rotateY","rotateZ","skew","skewX","skewY"],At=new Set([...Ct,"pathRotation"]),ao=e=>e===St||e===$,Hu=new Set(["x","y","z"]),Wu=Ct.filter(e=>!Hu.has(e));function zu(e){const t=[];return Wu.forEach(n=>{const i=e.getValue(n);i!==void 0&&(t.push([n,i.get()]),i.set(n.startsWith("scale")?1:0))}),t}const Xe={width:({x:e},{paddingLeft:t="0",paddingRight:n="0",boxSizing:i})=>{const s=e.max-e.min;return i==="border-box"?s:s-parseFloat(t)-parseFloat(n)},height:({y:e},{paddingTop:t="0",paddingBottom:n="0",boxSizing:i})=>{const s=e.max-e.min;return i==="border-box"?s:s-parseFloat(t)-parseFloat(n)},top:(e,{top:t})=>parseFloat(t),left:(e,{left:t})=>parseFloat(t),bottom:({y:e},{top:t})=>parseFloat(t)+(e.max-e.min),right:({x:e},{left:t})=>parseFloat(t)+(e.max-e.min),x:(e,{transform:t})=>Ii(t,"x"),y:(e,{transform:t})=>Ii(t,"y")};Xe.translateX=Xe.x;Xe.translateY=Xe.y;const at=new Set;let Bi=!1,$i=!1,Fi=!1;function ya(){if($i){const e=Array.from(at).filter(i=>i.needsMeasurement),t=new Set(e.map(i=>i.element)),n=new Map;t.forEach(i=>{const s=zu(i);s.length&&(n.set(i,s),i.render())}),e.forEach(i=>i.measureInitialState()),t.forEach(i=>{i.render();const s=n.get(i);s&&s.forEach(([r,o])=>{i.getValue(r)?.set(o)})}),e.forEach(i=>i.measureEndState()),e.forEach(i=>{i.suspendedScrollY!==void 0&&window.scrollTo(0,i.suspendedScrollY)})}$i=!1,Bi=!1,at.forEach(e=>e.complete(Fi)),at.clear()}function ba(){at.forEach(e=>{e.readKeyframes(),e.needsMeasurement&&($i=!0)})}function Gu(){Fi=!0,ba(),ya(),Fi=!1}class vs{constructor(t,n,i,s,r,o=!1){this.state="pending",this.isAsync=!1,this.needsMeasurement=!1,this.unresolvedKeyframes=[...t],this.onComplete=n,this.name=i,this.motionValue=s,this.element=r,this.isAsync=o}scheduleResolve(){this.state="scheduled",this.isAsync?(at.add(this),Bi||(Bi=!0,te.read(ba),te.resolveKeyframes(ya))):(this.readKeyframes(),this.complete())}readKeyframes(){const{unresolvedKeyframes:t,name:n,element:i,motionValue:s}=this;if(t[0]===null){const r=s?.get(),o=t[t.length-1];if(r!==void 0)t[0]=r;else if(i&&n){const a=i.readValue(n,o);a!=null&&(t[0]=a)}t[0]===void 0&&(t[0]=o),s&&r===void 0&&s.set(t[0])}Iu(t)}setFinalKeyframe(){}measureInitialState(){}renderEndStyles(){}measureEndState(){}complete(t=!1){this.state="complete",this.onComplete(this.unresolvedKeyframes,this.finalKeyframe,t),at.delete(this)}cancel(){this.state==="scheduled"&&(at.delete(this),this.state="pending")}resume(){this.state==="pending"&&this.scheduleResolve()}}const Uu=e=>e.startsWith("--");function wa(e,t,n){Uu(t)?e.style.setProperty(t,n):e.style[t]=n}const Ku={};function xa(e,t){const n=qr(e);return()=>Ku[t]??n()}const qu=xa(()=>window.ScrollTimeline!==void 0,"scrollTimeline"),va=xa(()=>{try{document.createElement("div").animate({opacity:0},{easing:"linear(0, 1)"})}catch{return!1}return!0},"linearEasing"),Dt=([e,t,n,i])=>`cubic-bezier(${e}, ${t}, ${n}, ${i})`,lo={linear:"linear",ease:"ease",easeIn:"ease-in",easeOut:"ease-out",easeInOut:"ease-in-out",circIn:Dt([0,.65,.55,1]),circOut:Dt([.55,0,1,.45]),backIn:Dt([.31,.01,.66,-.59]),backOut:Dt([.33,1.53,.69,.99])};function ka(e,t){if(e)return typeof e=="function"?va()?ma(e,t):"ease-out":oa(e)?Dt(e):Array.isArray(e)?e.map(n=>ka(n,t)||lo.easeOut):lo[e]}function Qu(e,t,n,{delay:i=0,duration:s=300,repeat:r=0,repeatType:o="loop",ease:a="easeOut",times:l}={},c=void 0){const u={[t]:n};l&&(u.offset=l);const f=ka(a,s);Array.isArray(f)&&(u.easing=f);const h={delay:i,duration:s,easing:Array.isArray(f)?"linear":f,fill:"both",iterations:r+1,direction:o==="reverse"?"alternate":"normal"};return c&&(h.pseudoElement=c),e.animate(u,h)}function Ta(e){return typeof e=="function"&&"applyToOptions"in e}function Yu({type:e,...t}){return Ta(e)&&va()?e.applyToOptions(t):(t.duration??(t.duration=300),t.ease??(t.ease="easeOut"),t)}class Sa extends xs{constructor(t){if(super(),this.finishedTime=null,this.isStopped=!1,this.manualStartTime=null,!t)return;const{element:n,name:i,keyframes:s,pseudoElement:r,allowFlatten:o=!1,finalKeyframe:a,onComplete:l}=t;this.isPseudoElement=!!r,this.allowFlatten=o,this.options=t,$n(typeof t.type!="string");const c=Yu(t);this.animation=Qu(n,i,s,c,r),c.autoplay===!1&&this.animation.pause(),this.animation.onfinish=()=>{if(this.finishedTime=this.time,!r){const u=Fn(s,this.options,a,this.speed);this.updateMotionValue&&this.updateMotionValue(u),wa(n,i,u),this.animation.cancel()}l?.(),this.notifyFinished()}}play(){this.isStopped||(this.manualStartTime=null,this.animation.play(),this.state==="finished"&&this.updateFinished())}pause(){this.animation.pause()}complete(){this.animation.finish?.()}cancel(){try{this.animation.cancel()}catch{}}stop(){if(this.isStopped)return;this.isStopped=!0;const{state:t}=this;t==="idle"||t==="finished"||(this.updateMotionValue?this.updateMotionValue():this.commitStyles(),this.isPseudoElement||this.cancel())}commitStyles(){const t=this.options?.element;!this.isPseudoElement&&t?.isConnected&&this.animation.commitStyles?.()}get duration(){const t=this.animation.effect?.getComputedTiming?.().duration||0;return Oe(Number(t))}get iterationDuration(){const{delay:t=0}=this.options||{};return this.duration+Oe(t)}get time(){return Oe(Number(this.animation.currentTime)||0)}set time(t){const n=this.finishedTime!==null;this.manualStartTime=null,this.finishedTime=null,this.animation.currentTime=je(t),n&&this.animation.pause()}get speed(){return this.animation.playbackRate}set speed(t){t<0&&(this.finishedTime=null),this.animation.playbackRate=t}get state(){return this.finishedTime!==null?"finished":this.animation.playState}get startTime(){return this.manualStartTime??Number(this.animation.startTime)}set startTime(t){this.manualStartTime=this.animation.startTime=t}attachTimeline({timeline:t,rangeStart:n,rangeEnd:i,observe:s}){return this.allowFlatten&&this.animation.effect?.updateTiming({easing:"linear"}),this.animation.onfinish=null,t&&qu()?(this.animation.timeline=t,n&&(this.animation.rangeStart=n),i&&(this.animation.rangeEnd=i),Re):s(this)}}const Ca={anticipate:ta,backInOut:ea,circInOut:ia};function Xu(e){return e in Ca}function Zu(e){typeof e.ease=="string"&&Xu(e.ease)&&(e.ease=Ca[e.ease])}const ei=10;class Ju extends Sa{constructor(t){Zu(t),ga(t),super(t),t.startTime!==void 0&&t.autoplay!==!1&&(this.startTime=t.startTime),this.options=t}updateMotionValue(t){const{motionValue:n,onUpdate:i,onComplete:s,element:r,...o}=this.options;if(!n)return;if(t!==void 0){n.set(t);return}const a=new On({...o,autoplay:!1}),l=Math.max(ei,ke.now()-this.startTime),c=Ge(0,ei,l-ei),u=a.sample(l).value,{name:f}=this.options;r&&f&&wa(r,f,u),n.setWithVelocity(a.sample(Math.max(0,l-c)).value,u,c),a.stop()}}const co=(e,t)=>t==="zIndex"?!1:!!(typeof e=="number"||Array.isArray(e)||typeof e=="string"&&($e.test(e)||e==="0")&&!e.startsWith("url("));function eh(e){const t=e[0];if(e.length===1)return!0;for(let n=0;n<e.length;n++)if(e[n]!==t)return!0}function th(e,t,n,i){const s=e[0];if(s===null)return!1;if(t==="display"||t==="visibility")return!0;const r=e[e.length-1],o=co(s,t),a=co(r,t);return!o||!a?!1:eh(e)||(n==="spring"||Ta(n))&&i}function _i(e){e.duration=0,e.type="keyframes"}const Aa=new Set(["opacity","clipPath","filter","transform","backgroundColor"]),nh=/^(?:oklch|oklab|lab|lch|color|color-mix|light-dark)\(/;function ih(e){for(let t=0;t<e.length;t++)if(typeof e[t]=="string"&&nh.test(e[t]))return!0;return!1}const sh=new Set(["color","backgroundColor","outlineColor","fill","stroke","borderColor","borderTopColor","borderRightColor","borderBottomColor","borderLeftColor"]),oh=qr(()=>Object.hasOwnProperty.call(Element.prototype,"animate"));function rh(e){const{motionValue:t,name:n,repeatDelay:i,repeatType:s,damping:r,type:o,keyframes:a}=e,l=t?.owner?.current;if(!(l instanceof HTMLElement)&&!(l instanceof SVGElement))return!1;const{onUpdate:c,transformTemplate:u}=t.owner.getProps();return oh()&&n&&(Aa.has(n)||sh.has(n)&&ih(a))&&(n!=="transform"||!u)&&!c&&!i&&s!=="mirror"&&r!==0&&o!=="inertia"}const ah=40;class lh extends xs{constructor({autoplay:t=!0,delay:n=0,type:i="keyframes",repeat:s=0,repeatDelay:r=0,repeatType:o="loop",keyframes:a,name:l,motionValue:c,element:u,...f}){super(),this.stop=()=>{this._animation&&(this._animation.stop(),this.stopTimeline?.()),this.keyframeResolver?.cancel()},this.createdAt=ke.now();const h={autoplay:t,delay:n,type:i,repeat:s,repeatDelay:r,repeatType:o,name:l,motionValue:c,element:u,...f},g=u?.KeyframeResolver||vs;this.keyframeResolver=new g(a,(p,b,m)=>this.onKeyframesResolved(p,b,h,!m),l,c,u),this.keyframeResolver?.scheduleResolve()}onKeyframesResolved(t,n,i,s){this.keyframeResolver=void 0;const{name:r,type:o,velocity:a,delay:l,isHandoff:c,onUpdate:u}=i;this.resolvedAt=ke.now();let f=!0;th(t,r,o,a)||(f=!1,(Ze.instantAnimations||!l)&&u?.(Fn(t,i,n)),t[0]=t[t.length-1],_i(i),i.repeat=0);const g={startTime:s?this.resolvedAt?this.resolvedAt-this.createdAt>ah?this.resolvedAt:this.createdAt:this.createdAt:void 0,finalKeyframe:n,...i,keyframes:t},p=f&&!c&&rh(g),b=g.motionValue?.owner?.current;let m;if(p)try{m=new Ju({...g,element:b})}catch{m=new On(g)}else m=new On(g);m.finished.then(()=>{this.notifyFinished()}).catch(Re),this.pendingTimeline&&(this.stopTimeline=m.attachTimeline(this.pendingTimeline),this.pendingTimeline=void 0),this._animation=m}get finished(){return this._animation?this.animation.finished:this._finished}then(t,n){return this.finished.finally(t).then(()=>{})}get animation(){return this._animation||(this.keyframeResolver?.resume(),Gu()),this._animation}get duration(){return this.animation.duration}get iterationDuration(){return this.animation.iterationDuration}get time(){return this.animation.time}set time(t){this.animation.time=t}get speed(){return this.animation.speed}get state(){return this.animation.state}set speed(t){this.animation.speed=t}get startTime(){return this.animation.startTime}attachTimeline(t){return this._animation?this.stopTimeline=this.animation.attachTimeline(t):this.pendingTimeline=t,()=>this.stop()}play(){this.animation.play()}pause(){this.animation.pause()}complete(){this.animation.complete()}cancel(){this._animation&&this.animation.cancel(),this.keyframeResolver?.cancel()}}function Pa(e,t,n,i=0,s=1){const r=Array.from(e).sort((c,u)=>c.sortNodePosition(u)).indexOf(t),o=e.size,a=(o-1)*i;return typeof n=="function"?n(r,o):s===1?r*i:a-r*i}const uo=30,ch=e=>!isNaN(parseFloat(e));class uh{constructor(t,n={}){this.canTrackVelocity=null,this.events={},this.updateAndNotify=i=>{const s=ke.now();if(this.updatedAt!==s&&this.setPrevFrameValue(),this.prev=this.current,this.setCurrent(i),this.current!==this.prev&&(this.events.change?.notify(this.current),this.dependents))for(const r of this.dependents)r.dirty()},this.hasAnimated=!1,this.setCurrent(t),this.owner=n.owner}setCurrent(t){this.current=t,this.updatedAt=ke.now(),this.canTrackVelocity===null&&t!==void 0&&(this.canTrackVelocity=ch(this.current))}setPrevFrameValue(t=this.current){this.prevFrameValue=t,this.prevUpdatedAt=this.updatedAt}onChange(t){return this.on("change",t)}on(t,n){this.events[t]||(this.events[t]=new hs);const i=this.events[t].add(n);return t==="change"?()=>{i(),te.read(()=>{this.events.change.getSize()||this.stop()})}:i}clearListeners(){for(const t in this.events)this.events[t].clear()}attach(t,n){this.passiveEffect=t,this.stopPassiveEffect=n}set(t){this.passiveEffect?this.passiveEffect(t,this.updateAndNotify):this.updateAndNotify(t)}setWithVelocity(t,n,i){this.set(n),this.prev=void 0,this.prevFrameValue=t,this.prevUpdatedAt=this.updatedAt-i}jump(t,n=!0){this.updateAndNotify(t),this.prev=t,this.prevUpdatedAt=this.prevFrameValue=void 0,n&&this.stop(),this.stopPassiveEffect&&this.stopPassiveEffect()}dirty(){this.events.change?.notify(this.current)}addDependent(t){this.dependents||(this.dependents=new Set),this.dependents.add(t)}removeDependent(t){this.dependents&&this.dependents.delete(t)}get(){return this.current}getPrevious(){return this.prev}getVelocity(){const t=ke.now();if(!this.canTrackVelocity||this.prevFrameValue===void 0||t-this.updatedAt>uo)return 0;const n=Math.min(this.updatedAt-this.prevUpdatedAt,uo);return Qr(parseFloat(this.current)-parseFloat(this.prevFrameValue),n)}start(t){return this.stop(),new Promise(n=>{this.hasAnimated=!0,this.animation=t(n),this.events.animationStart&&this.events.animationStart.notify()}).then(()=>{this.events.animationComplete&&this.events.animationComplete.notify(),this.clearAnimation()})}stop(){this.animation&&(this.animation.stop(),this.events.animationCancel&&this.events.animationCancel.notify()),this.clearAnimation()}isAnimating(){return!!this.animation}clearAnimation(){delete this.animation}destroy(){this.dependents?.clear(),this.events.destroy?.notify(),this.clearListeners(),this.stop(),this.stopPassiveEffect&&this.stopPassiveEffect()}}function Tt(e,t){return new uh(e,t)}function Ea(e,t){if(e?.inherit&&t){const{inherit:n,...i}=e;return{...t,...i}}return e}function ks(e,t){const n=e?.[t]??e?.default??e;return n!==e?Ea(n,e):n}const hh={type:"spring",stiffness:500,damping:25,restSpeed:10},dh=e=>({type:"spring",stiffness:550,damping:e===0?2*Math.sqrt(550):30,restSpeed:10}),fh={type:"keyframes",duration:.8},ph={type:"keyframes",ease:[.25,.1,.35,1],duration:.3},mh=(e,{keyframes:t})=>t.length>2?fh:At.has(e)?e.startsWith("scale")?dh(t[1]):hh:ph,gh=new Set(["when","delay","delayChildren","staggerChildren","staggerDirection","repeat","repeatType","repeatDelay","from","elapsed"]);function yh(e){for(const t in e)if(!gh.has(t))return!0;return!1}const Ts=(e,t,n,i={},s,r)=>o=>{const a=ks(i,e)||{},l=a.delay||i.delay||0;let{elapsed:c=0}=i;c=c-je(l);const u={keyframes:Array.isArray(n)?n:[null,n],ease:"easeOut",velocity:t.getVelocity(),...a,delay:-c,onUpdate:h=>{t.set(h),a.onUpdate&&a.onUpdate(h)},onComplete:()=>{o(),a.onComplete&&a.onComplete()},name:e,motionValue:t,element:r?void 0:s};yh(a)||Object.assign(u,mh(e,u)),u.duration&&(u.duration=je(u.duration)),u.repeatDelay&&(u.repeatDelay=je(u.repeatDelay)),u.from!==void 0&&(u.keyframes[0]=u.from);let f=!1;if((u.type===!1||u.duration===0&&!u.repeatDelay)&&(_i(u),u.delay===0&&(f=!0)),(Ze.instantAnimations||Ze.skipAnimations||s?.shouldSkipAnimations||a.skipAnimations)&&(f=!0,_i(u),u.delay=0),u.allowFlatten=!a.type&&!a.ease,f&&!r&&t.get()!==void 0){const h=Fn(u.keyframes,a);if(h!==void 0){te.update(()=>{u.onUpdate(h),u.onComplete()});return}}return a.isSync?new On(u):new lh(u)},bh=/^var\(--(?:([\w-]+)|([\w-]+), ?([a-zA-Z\d ()%#.,-]+))\)/u;function wh(e){const t=bh.exec(e);if(!t)return[,];const[,n,i,s]=t;return[`--${n??i}`,s]}function Da(e,t,n=1){const[i,s]=wh(e);if(!i)return;const r=window.getComputedStyle(t).getPropertyValue(i);if(r){const o=r.trim();return Gr(o)?parseFloat(o):o}return ps(s)?Da(s,t,n+1):s}function ho(e){const t=[{},{}];return e?.values.forEach((n,i)=>{t[0][i]=n.get(),t[1][i]=n.getVelocity()}),t}function Ss(e,t,n,i){if(typeof t=="function"){const[s,r]=ho(i);t=t(n!==void 0?n:e.custom,s,r)}if(typeof t=="string"&&(t=e.variants&&e.variants[t]),typeof t=="function"){const[s,r]=ho(i);t=t(n!==void 0?n:e.custom,s,r)}return t}function lt(e,t,n){const i=e.getProps();return Ss(i,t,n!==void 0?n:i.custom,e)}const Ma=new Set(["width","height","top","left","right","bottom",...Ct]),Hi=e=>Array.isArray(e);function xh(e,t,n){e.hasValue(t)?e.getValue(t).set(n):e.addValue(t,Tt(n))}function vh(e){return Hi(e)?e[e.length-1]||0:e}function kh(e,t){const n=lt(e,t);let{transitionEnd:i={},transition:s={},...r}=n||{};r={...r,...i};for(const o in r){const a=vh(r[o]);xh(e,o,a)}}const ye=e=>!!(e&&e.getVelocity);function Th(e){return!!(ye(e)&&e.add)}function Wi(e,t){const n=e.getValue("willChange");if(Th(n))return n.add(t);if(!n&&Ze.WillChange){const i=new Ze.WillChange("auto");e.addValue("willChange",i),i.add(t)}}function Cs(e){return e.replace(/([A-Z])/g,t=>`-${t.toLowerCase()}`)}const Sh="framerAppearId",Oa="data-"+Cs(Sh);function Ra(e){return e.props[Oa]}const Ch=typeof window<"u";function Ah({protectedKeys:e,needsAnimating:t},n){const i=e.hasOwnProperty(n)&&t[n]!==!0;return t[n]=!1,i}function ja(e,t,{delay:n=0,transitionOverride:i,type:s}={}){let{transition:r,transitionEnd:o,...a}=t;const l=e.getDefaultTransition();r=r?Ea(r,l):l;const c=r?.reduceMotion,u=r?.skipAnimations;i&&(r=i);const f=[],h=s&&e.animationState&&e.animationState.getState()[s],g=r?.path;g&&g.animateVisualElement(e,a,r,n,f);for(const p in a){const b=e.getValue(p,e.latestValues[p]??null),m=a[p];if(m===void 0||h&&Ah(h,p))continue;const w={delay:n,...ks(r||{},p)};u&&(w.skipAnimations=!0);const k=b.get();if(k!==void 0&&!b.isAnimating()&&!Array.isArray(m)&&m===k&&!w.velocity){te.update(()=>b.set(m));continue}let v=!1;if(Ch&&window.MotionHandoffAnimation){const D=Ra(e);if(D){const T=window.MotionHandoffAnimation(D,p,te);T!==null&&(w.startTime=T,v=!0)}}Wi(e,p);const x=c??e.shouldReduceMotion;b.start(Ts(p,b,m,x&&Ma.has(p)?{type:!1}:w,e,v));const C=b.animation;C&&f.push(C)}if(o){const p=()=>te.update(()=>{o&&kh(e,o)});f.length?Promise.all(f).then(p):p()}return f}function zi(e,t,n={}){const i=lt(e,t,n.type==="exit"?e.presenceContext?.custom:void 0);let{transition:s=e.getDefaultTransition()||{}}=i||{};n.transitionOverride&&(s=n.transitionOverride);const r=i?()=>Promise.all(ja(e,i,n)):()=>Promise.resolve(),o=e.variantChildren&&e.variantChildren.size?(l=0)=>{const{delayChildren:c=0,staggerChildren:u,staggerDirection:f}=s;return Ph(e,t,l,c,u,f,n)}:()=>Promise.resolve(),{when:a}=s;if(a){const[l,c]=a==="beforeChildren"?[r,o]:[o,r];return l().then(()=>c())}else return Promise.all([r(),o(n.delay)])}function Ph(e,t,n=0,i=0,s=0,r=1,o){const a=[];for(const l of e.variantChildren)l.notify("AnimationStart",t),a.push(zi(l,t,{...o,delay:n+(typeof i=="function"?0:i)+Pa(e.variantChildren,l,i,s,r)}).then(()=>l.notify("AnimationComplete",t)));return Promise.all(a)}function Eh(e,t,n={}){e.notify("AnimationStart",t);let i;if(Array.isArray(t)){const s=t.map(r=>zi(e,r,n));i=Promise.all(s)}else if(typeof t=="string")i=zi(e,t,n);else{const s=typeof t=="function"?lt(e,t,n.custom):t;i=Promise.all(ja(e,s,n))}return i.then(()=>{e.notify("AnimationComplete",t)})}const Dh={test:e=>e==="auto",parse:e=>e},La=e=>t=>t.test(e),Na=[St,$,ze,Ue,Jc,Zc,Dh],fo=e=>Na.find(La(e));function Mh(e){return typeof e=="number"?e===0:e!==null?e==="none"||e==="0"||Kr(e):!0}const Oh=new Set(["brightness","contrast","saturate","opacity"]);function Rh(e){const[t,n]=e.slice(0,-1).split("(");if(t==="drop-shadow")return e;const[i]=n.match(ms)||[];if(!i)return e;const s=n.replace(i,"");let r=Oh.has(t)?1:0;return i!==n&&(r*=100),t+"("+r+s+")"}const jh=/\b([a-z-]*)\(.*?\)/gu,Gi={...$e,getAnimatableNone:e=>{const t=e.match(jh);return t?t.map(Rh).join(" "):e}},Ui={...$e,getAnimatableNone:e=>{const t=$e.parse(e);return $e.createTransformer(e)(t.map(i=>typeof i=="number"?0:typeof i=="object"?{...i,alpha:1}:i))}},po={...St,transform:Math.round},Lh={rotate:Ue,pathRotation:Ue,rotateX:Ue,rotateY:Ue,rotateZ:Ue,scale:tn,scaleX:tn,scaleY:tn,scaleZ:tn,skew:Ue,skewX:Ue,skewY:Ue,distance:$,translateX:$,translateY:$,translateZ:$,x:$,y:$,z:$,perspective:$,transformPerspective:$,opacity:Ft,originX:Js,originY:Js,originZ:$},Rn={borderWidth:$,borderTopWidth:$,borderRightWidth:$,borderBottomWidth:$,borderLeftWidth:$,borderRadius:$,borderTopLeftRadius:$,borderTopRightRadius:$,borderBottomRightRadius:$,borderBottomLeftRadius:$,width:$,maxWidth:$,height:$,maxHeight:$,top:$,right:$,bottom:$,left:$,inset:$,insetBlock:$,insetBlockStart:$,insetBlockEnd:$,insetInline:$,insetInlineStart:$,insetInlineEnd:$,padding:$,paddingTop:$,paddingRight:$,paddingBottom:$,paddingLeft:$,paddingBlock:$,paddingBlockStart:$,paddingBlockEnd:$,paddingInline:$,paddingInlineStart:$,paddingInlineEnd:$,margin:$,marginTop:$,marginRight:$,marginBottom:$,marginLeft:$,marginBlock:$,marginBlockStart:$,marginBlockEnd:$,marginInline:$,marginInlineStart:$,marginInlineEnd:$,fontSize:$,backgroundPositionX:$,backgroundPositionY:$,...Lh,zIndex:po,fillOpacity:Ft,strokeOpacity:Ft,numOctaves:po},Nh={...Rn,color:le,backgroundColor:le,outlineColor:le,fill:le,stroke:le,borderColor:le,borderTopColor:le,borderRightColor:le,borderBottomColor:le,borderLeftColor:le,filter:Gi,WebkitFilter:Gi,mask:Ui,WebkitMask:Ui},Va=e=>Nh[e],Vh=new Set([Gi,Ui]);function Ia(e,t){let n=Va(e);return Vh.has(n)||(n=$e),n.getAnimatableNone?n.getAnimatableNone(t):void 0}const Ih=new Set(["auto","none","0"]);function Bh(e,t,n){let i=0,s;for(;i<e.length&&!s;){const r=e[i];typeof r=="string"&&!Ih.has(r)&&kt(r).values.length&&(s=e[i]),i++}if(s&&n)for(const r of t)e[r]=Ia(n,s)}class $h extends vs{constructor(t,n,i,s,r){super(t,n,i,s,r,!0)}readKeyframes(){const{unresolvedKeyframes:t,element:n,name:i}=this;if(!n||!n.current)return;super.readKeyframes();for(let u=0;u<t.length;u++){let f=t[u];if(typeof f=="string"&&(f=f.trim(),ps(f))){const h=Da(f,n.current);h!==void 0&&(t[u]=h),u===t.length-1&&(this.finalKeyframe=f)}}if(this.resolveNoneKeyframes(),!Ma.has(i)||t.length!==2)return;const[s,r]=t,o=fo(s),a=fo(r),l=Zs(s),c=Zs(r);if(l!==c&&Xe[i]){this.needsMeasurement=!0;return}if(o!==a)if(ao(o)&&ao(a))for(let u=0;u<t.length;u++){const f=t[u];typeof f=="string"&&(t[u]=parseFloat(f))}else Xe[i]&&(this.needsMeasurement=!0)}resolveNoneKeyframes(){const{unresolvedKeyframes:t,name:n}=this,i=[];for(let s=0;s<t.length;s++)(t[s]===null||Mh(t[s]))&&i.push(s);i.length&&Bh(t,i,n)}measureInitialState(){const{element:t,unresolvedKeyframes:n,name:i}=this;if(!t||!t.current)return;i==="height"&&(this.suspendedScrollY=window.pageYOffset),this.measuredOrigin=Xe[i](t.measureViewportBox(),window.getComputedStyle(t.current)),n[0]=this.measuredOrigin;const s=n[n.length-1];s!==void 0&&t.getValue(i,s).jump(s,!1)}measureEndState(){const{element:t,name:n,unresolvedKeyframes:i}=this;if(!t||!t.current)return;const s=t.getValue(n);s&&s.jump(this.measuredOrigin,!1);const r=i.length-1,o=i[r];i[r]=Xe[n](t.measureViewportBox(),window.getComputedStyle(t.current)),o!==null&&this.finalKeyframe===void 0&&(this.finalKeyframe=o),this.removedTransforms?.length&&this.removedTransforms.forEach(([a,l])=>{t.getValue(a).set(l)}),this.resolveNoneKeyframes()}}const As=["borderTopLeftRadius","borderTopRightRadius","borderBottomRightRadius","borderBottomLeftRadius"];function Ba(e,t,n){if(e==null)return[];if(e instanceof EventTarget)return[e];if(typeof e=="string"){let i=document;const s=n?.[e]??i.querySelectorAll(e);return s?Array.from(s):[]}return Array.from(e).filter(i=>i!=null)}const Ki=(e,t)=>t&&typeof e=="number"?t.transform(e):e;function gn(e){return Ur(e)&&"offsetHeight"in e&&!("ownerSVGElement"in e)}const{schedule:Ps}=ra(queueMicrotask,!1),Be={x:!1,y:!1};function $a(){return Be.x||Be.y}function Fh(e){return e==="x"||e==="y"?Be[e]?null:(Be[e]=!0,()=>{Be[e]=!1}):Be.x||Be.y?null:(Be.x=Be.y=!0,()=>{Be.x=Be.y=!1})}function Fa(e,t){const n=Ba(e),i=new AbortController,s={passive:!0,...t,signal:i.signal};return[n,s,()=>i.abort()]}function _h(e){return!(e.pointerType==="touch"||$a())}function Hh(e,t,n={}){const[i,s,r]=Fa(e,n);return i.forEach(o=>{let a=!1,l=!1,c;const u=()=>{o.removeEventListener("pointerleave",p)},f=m=>{c&&(c(m),c=void 0),u()},h=m=>{a=!1,window.removeEventListener("pointerup",h),window.removeEventListener("pointercancel",h),l&&(l=!1,f(m))},g=()=>{a=!0,window.addEventListener("pointerup",h,s),window.addEventListener("pointercancel",h,s)},p=m=>{if(m.pointerType!=="touch"){if(a){l=!0;return}f(m)}},b=m=>{if(!_h(m))return;l=!1;const w=t(o,m);typeof w=="function"&&(c=w,o.addEventListener("pointerleave",p,s))};o.addEventListener("pointerenter",b,s),o.addEventListener("pointerdown",g,s)}),r}const _a=(e,t)=>t?e===t?!0:_a(e,t.parentElement):!1,Es=e=>e.pointerType==="mouse"?typeof e.button!="number"||e.button<=0:e.isPrimary!==!1,Wh=new Set(["BUTTON","INPUT","SELECT","TEXTAREA","A"]);function zh(e){return Wh.has(e.tagName)||e.isContentEditable===!0}const Gh=new Set(["INPUT","SELECT","TEXTAREA"]);function Uh(e){return Gh.has(e.tagName)||e.isContentEditable===!0}const yn=new WeakSet;function mo(e){return t=>{t.key==="Enter"&&e(t)}}function ti(e,t){e.dispatchEvent(new PointerEvent("pointer"+t,{isPrimary:!0,bubbles:!0}))}const Kh=(e,t)=>{const n=e.currentTarget;if(!n)return;const i=mo(()=>{if(yn.has(n))return;ti(n,"down");const s=mo(()=>{ti(n,"up")}),r=()=>ti(n,"cancel");n.addEventListener("keyup",s,t),n.addEventListener("blur",r,t)});n.addEventListener("keydown",i,t),n.addEventListener("blur",()=>n.removeEventListener("keydown",i),t)};function go(e){return Es(e)&&!$a()}const yo=new WeakSet;function qh(e,t,n={}){const[i,s,r]=Fa(e,n),o=a=>{const l=a.currentTarget;if(!go(a)||yo.has(a))return;yn.add(l),n.stopPropagation&&yo.add(a);const c=t(l,a),u={...s,capture:!0},f=(p,b)=>{window.removeEventListener("pointerup",h,u),window.removeEventListener("pointercancel",g,u),yn.has(l)&&yn.delete(l),go(p)&&typeof c=="function"&&c(p,{success:b})},h=p=>{f(p,l===window||l===document||n.useGlobalTarget||_a(l,p.target))},g=p=>{f(p,!1)};window.addEventListener("pointerup",h,u),window.addEventListener("pointercancel",g,u)};return i.forEach(a=>{(n.useGlobalTarget?window:a).addEventListener("pointerdown",o,s),gn(a)&&(a.addEventListener("focus",c=>Kh(c,s)),!zh(a)&&!a.hasAttribute("tabindex")&&(a.tabIndex=0))}),r}function Ds(e){return Ur(e)&&"ownerSVGElement"in e}const bn=new WeakMap;let wn;const Ha=(e,t,n)=>(i,s)=>s&&s[0]?s[0][e+"Size"]:Ds(i)&&"getBBox"in i?i.getBBox()[t]:i[n],Qh=Ha("inline","width","offsetWidth"),Yh=Ha("block","height","offsetHeight");function Xh({target:e,borderBoxSize:t}){bn.get(e)?.forEach(n=>{n(e,{get width(){return Qh(e,t)},get height(){return Yh(e,t)}})})}function Zh(e){e.forEach(Xh)}function Jh(){typeof ResizeObserver>"u"||(wn=new ResizeObserver(Zh))}function ed(e,t){wn||Jh();const n=Ba(e);return n.forEach(i=>{let s=bn.get(i);s||(s=new Set,bn.set(i,s)),s.add(t),wn?.observe(i)}),()=>{n.forEach(i=>{const s=bn.get(i);s?.delete(t),s?.size||wn?.unobserve(i)})}}const xn=new Set;let xt;function td(){xt=()=>{const e={get width(){return window.innerWidth},get height(){return window.innerHeight}};xn.forEach(t=>t(e))},window.addEventListener("resize",xt)}function nd(e){return xn.add(e),xt||td(),()=>{xn.delete(e),!xn.size&&typeof xt=="function"&&(window.removeEventListener("resize",xt),xt=void 0)}}function bo(e,t){return typeof e=="function"?nd(e):ed(e,t)}function id(e){return Ds(e)&&e.tagName==="svg"}const sd=[...Na,le,$e],od=e=>sd.find(La(e)),wo=()=>({translate:0,scale:1,origin:0,originPoint:0}),vt=()=>({x:wo(),y:wo()}),xo=()=>({min:0,max:0}),he=()=>({x:xo(),y:xo()}),rd=new WeakMap;function _n(e){return e!==null&&typeof e=="object"&&typeof e.start=="function"}function _t(e){return typeof e=="string"||Array.isArray(e)}const Ms=["animate","whileInView","whileFocus","whileHover","whileTap","whileDrag","exit"],Os=["initial",...Ms];function Hn(e){return _n(e.animate)||Os.some(t=>_t(e[t]))}function Wa(e){return!!(Hn(e)||e.variants)}function ad(e,t,n){for(const i in t){const s=t[i],r=n[i];if(ye(s))e.addValue(i,s);else if(ye(r))e.addValue(i,Tt(s,{owner:e}));else if(r!==s)if(e.hasValue(i)){const o=e.getValue(i);o.liveStyle===!0?o.jump(s):o.hasAnimated||o.set(s)}else{const o=e.getStaticValue(i);e.addValue(i,Tt(o!==void 0?o:s,{owner:e}))}}for(const i in n)t[i]===void 0&&e.removeValue(i);return t}const qi={current:null},za={current:!1},ld=typeof window<"u";function cd(){if(za.current=!0,!!ld)if(window.matchMedia){const e=window.matchMedia("(prefers-reduced-motion)"),t=()=>qi.current=e.matches;e.addEventListener("change",t),t()}else qi.current=!1}const vo=["AnimationStart","AnimationComplete","Update","BeforeLayoutMeasure","LayoutMeasure","LayoutAnimationStart","LayoutAnimationComplete"];let jn={};function Ga(e){jn=e}function ud(){return jn}class hd{scrapeMotionValuesFromProps(t,n,i){return{}}constructor({parent:t,props:n,presenceContext:i,reducedMotionConfig:s,skipAnimations:r,blockInitialAnimation:o,visualState:a},l={}){this.current=null,this.children=new Set,this.isVariantNode=!1,this.isControllingVariants=!1,this.shouldReduceMotion=null,this.shouldSkipAnimations=!1,this.values=new Map,this.KeyframeResolver=vs,this.features={},this.valueSubscriptions=new Map,this.prevMotionValues={},this.hasBeenMounted=!1,this.events={},this.propEventSubscriptions={},this.notifyUpdate=()=>this.notify("Update",this.latestValues),this.render=()=>{this.current&&(this.triggerBuild(),this.renderInstance(this.current,this.renderState,this.props.style,this.projection))},this.renderScheduledAt=0,this.scheduleRender=()=>{const g=ke.now();this.renderScheduledAt<g&&(this.renderScheduledAt=g,te.render(this.render,!1,!0))};const{latestValues:c,renderState:u}=a;this.latestValues=c,this.baseTarget={...c},this.initialValues=n.initial?{...c}:{},this.renderState=u,this.parent=t,this.props=n,this.presenceContext=i,this.depth=t?t.depth+1:0,this.reducedMotionConfig=s,this.skipAnimationsConfig=r,this.options=l,this.blockInitialAnimation=!!o,this.isControllingVariants=Hn(n),this.isVariantNode=Wa(n),this.isVariantNode&&(this.variantChildren=new Set),this.manuallyAnimateOnMount=!!(t&&t.current);const{willChange:f,...h}=this.scrapeMotionValuesFromProps(n,{},this);for(const g in h){const p=h[g];c[g]!==void 0&&ye(p)&&p.set(c[g])}}mount(t){if(this.hasBeenMounted)for(const n in this.initialValues)this.values.get(n)?.jump(this.initialValues[n]),this.latestValues[n]=this.initialValues[n];this.current=t,rd.set(t,this),this.projection&&!this.projection.instance&&this.projection.mount(t),this.parent&&this.isVariantNode&&!this.isControllingVariants&&(this.removeFromVariantTree=this.parent.addVariantChild(this)),this.values.forEach((n,i)=>this.bindToMotionValue(i,n)),this.reducedMotionConfig==="never"?this.shouldReduceMotion=!1:this.reducedMotionConfig==="always"?this.shouldReduceMotion=!0:(za.current||cd(),this.shouldReduceMotion=qi.current),this.shouldSkipAnimations=this.skipAnimationsConfig??!1,this.parent?.addChild(this),this.update(this.props,this.presenceContext),this.hasBeenMounted=!0}unmount(){this.projection&&this.projection.unmount(),Je(this.notifyUpdate),Je(this.render),this.valueSubscriptions.forEach(t=>t()),this.valueSubscriptions.clear(),this.removeFromVariantTree&&this.removeFromVariantTree(),this.parent?.removeChild(this);for(const t in this.events)this.events[t].clear();for(const t in this.features){const n=this.features[t];n&&(n.unmount(),n.isMounted=!1)}this.current=null}addChild(t){this.children.add(t),this.enteringChildren??(this.enteringChildren=new Set),this.enteringChildren.add(t)}removeChild(t){this.children.delete(t),this.enteringChildren&&this.enteringChildren.delete(t)}bindToMotionValue(t,n){if(this.valueSubscriptions.has(t)&&this.valueSubscriptions.get(t)(),n.accelerate&&Aa.has(t)&&this.current instanceof HTMLElement){const{factory:o,keyframes:a,times:l,ease:c,duration:u}=n.accelerate,f=new Sa({element:this.current,name:t,keyframes:a,times:l,ease:c,duration:je(u)}),h=o(f);this.valueSubscriptions.set(t,()=>{h(),f.cancel()});return}const i=At.has(t);i&&this.onBindTransform&&this.onBindTransform();const s=n.on("change",o=>{this.latestValues[t]=o,this.props.onUpdate&&te.preRender(this.notifyUpdate),i&&this.projection&&(this.projection.isTransformDirty=!0),this.scheduleRender()});let r;typeof window<"u"&&window.MotionCheckAppearSync&&(r=window.MotionCheckAppearSync(this,t,n)),this.valueSubscriptions.set(t,()=>{s(),r&&r()})}sortNodePosition(t){return!this.current||!this.sortInstanceNodePosition||this.type!==t.type?0:this.sortInstanceNodePosition(this.current,t.current)}updateFeatures(){let t="animation";for(t in jn){const n=jn[t];if(!n)continue;const{isEnabled:i,Feature:s}=n;if(!this.features[t]&&s&&i(this.props)&&(this.features[t]=new s(this)),this.features[t]){const r=this.features[t];r.isMounted?r.update():(r.mount(),r.isMounted=!0)}}}triggerBuild(){this.build(this.renderState,this.latestValues,this.props)}measureViewportBox(){return this.current?this.measureInstanceViewportBox(this.current,this.props):he()}getStaticValue(t){return this.latestValues[t]}setStaticValue(t,n){this.latestValues[t]=n}update(t,n){(t.transformTemplate||this.props.transformTemplate)&&this.scheduleRender(),this.prevProps=this.props,this.props=t,this.prevPresenceContext=this.presenceContext,this.presenceContext=n;for(let i=0;i<vo.length;i++){const s=vo[i];this.propEventSubscriptions[s]&&(this.propEventSubscriptions[s](),delete this.propEventSubscriptions[s]);const r="on"+s,o=t[r];o&&(this.propEventSubscriptions[s]=this.on(s,o))}this.prevMotionValues=ad(this,this.scrapeMotionValuesFromProps(t,this.prevProps||{},this),this.prevMotionValues),this.handleChildMotionValue&&this.handleChildMotionValue()}getProps(){return this.props}getVariant(t){return this.props.variants?this.props.variants[t]:void 0}getDefaultTransition(){return this.props.transition}getTransformPagePoint(){return this.props.transformPagePoint}getClosestVariantNode(){return this.isVariantNode?this:this.parent?this.parent.getClosestVariantNode():void 0}addVariantChild(t){const n=this.getClosestVariantNode();if(n)return n.variantChildren&&n.variantChildren.add(t),()=>n.variantChildren.delete(t)}addValue(t,n){const i=this.values.get(t);n!==i&&(i&&this.removeValue(t),this.bindToMotionValue(t,n),this.values.set(t,n),this.latestValues[t]=n.get())}removeValue(t){this.values.delete(t);const n=this.valueSubscriptions.get(t);n&&(n(),this.valueSubscriptions.delete(t)),delete this.latestValues[t],this.removeValueFromRenderState(t,this.renderState)}hasValue(t){return this.values.has(t)}getValue(t,n){if(this.props.values&&this.props.values[t])return this.props.values[t];let i=this.values.get(t);return i===void 0&&n!==void 0&&(i=Tt(n===null?void 0:n,{owner:this}),this.addValue(t,i)),i}readValue(t,n){let i=this.latestValues[t]!==void 0||!this.current?this.latestValues[t]:this.getBaseTargetFromProps(this.props,t)??this.readValueFromInstance(this.current,t,this.options);return i!=null&&(typeof i=="string"&&(Gr(i)||Kr(i))?i=parseFloat(i):!od(i)&&$e.test(n)&&(i=Ia(t,n)),this.setBaseTarget(t,ye(i)?i.get():i)),ye(i)?i.get():i}setBaseTarget(t,n){this.baseTarget[t]=n}getBaseTarget(t){const{initial:n}=this.props;let i;if(typeof n=="string"||typeof n=="object"){const r=Ss(this.props,n,this.presenceContext?.custom);r&&(i=r[t])}if(n&&i!==void 0)return i;const s=this.getBaseTargetFromProps(this.props,t);return s!==void 0&&!ye(s)?s:this.initialValues[t]!==void 0&&i===void 0?void 0:this.baseTarget[t]}on(t,n){return this.events[t]||(this.events[t]=new hs),this.events[t].add(n)}notify(t,...n){this.events[t]&&this.events[t].notify(...n)}scheduleRenderMicrotask(){Ps.render(this.render)}}class Ua extends hd{constructor(){super(...arguments),this.KeyframeResolver=$h}sortInstanceNodePosition(t,n){return t.compareDocumentPosition(n)&2?1:-1}getBaseTargetFromProps(t,n){const i=t.style;return i?i[n]:void 0}removeValueFromRenderState(t,{vars:n,style:i}){delete n[t],delete i[t]}handleChildMotionValue(){this.childSubscription&&(this.childSubscription(),delete this.childSubscription);const{children:t}=this.props;ye(t)&&(this.childSubscription=t.on("change",n=>{this.current&&(this.current.textContent=`${n}`)}))}}class et{constructor(t){this.isMounted=!1,this.node=t}update(){}}function Ka({top:e,left:t,right:n,bottom:i}){return{x:{min:t,max:n},y:{min:e,max:i}}}function dd({x:e,y:t}){return{top:t.min,right:e.max,bottom:t.max,left:e.min}}function fd(e,t){if(!t)return e;const n=t({x:e.left,y:e.top}),i=t({x:e.right,y:e.bottom});return{top:n.y,left:n.x,bottom:i.y,right:i.x}}function ni(e){return e===void 0||e===1}function Qi({scale:e,scaleX:t,scaleY:n}){return!ni(e)||!ni(t)||!ni(n)}function st(e){return Qi(e)||qa(e)||e.z||e.rotate||e.rotateX||e.rotateY||e.skewX||e.skewY}function qa(e){return ko(e.x)||ko(e.y)}function ko(e){return e&&e!=="0%"}function Ln(e,t,n){const i=e-n,s=t*i;return n+s}function To(e,t,n,i,s){return s!==void 0&&(e=Ln(e,s,i)),Ln(e,n,i)+t}function Yi(e,t=0,n=1,i,s){e.min=To(e.min,t,n,i,s),e.max=To(e.max,t,n,i,s)}function Qa(e,{x:t,y:n}){Yi(e.x,t.translate,t.scale,t.originPoint),Yi(e.y,n.translate,n.scale,n.originPoint)}const So=.999999999999,Co=1.0000000000001;function pd(e,t,n,i=!1){const s=n.length;if(!s)return;t.x=t.y=1;let r,o;for(let a=0;a<s;a++){r=n[a],o=r.projectionDelta;const{visualElement:l}=r.options;l&&l.props.style&&l.props.style.display==="contents"||(i&&r.options.layoutScroll&&r.scroll&&r!==r.root&&(_e(e.x,-r.scroll.offset.x),_e(e.y,-r.scroll.offset.y)),o&&(t.x*=o.x.scale,t.y*=o.y.scale,Qa(e,o)),i&&st(r.latestValues)&&vn(e,r.latestValues,r.layout?.layoutBox))}t.x<Co&&t.x>So&&(t.x=1),t.y<Co&&t.y>So&&(t.y=1)}function _e(e,t){e.min+=t,e.max+=t}function Ao(e,t,n,i,s=.5){const r=ee(e.min,e.max,s);Yi(e,t,n,r,i)}function Po(e,t){return typeof e=="string"?parseFloat(e)/100*(t.max-t.min):e}function vn(e,t,n){const i=n??e;Ao(e.x,Po(t.x,i.x),t.scaleX,t.scale,t.originX),Ao(e.y,Po(t.y,i.y),t.scaleY,t.scale,t.originY)}function Ya(e,t){return Ka(fd(e.getBoundingClientRect(),t))}function md(e,t,n){const i=Ya(e,n),{scroll:s}=t;return s&&(_e(i.x,s.offset.x),_e(i.y,s.offset.y)),i}const gd={x:"translateX",y:"translateY",z:"translateZ",transformPerspective:"perspective"},yd=Ct.length;function bd(e,t,n){let i="",s=!0;for(let o=0;o<yd;o++){const a=Ct[o],l=e[a];if(l===void 0)continue;let c=!0;if(typeof l=="number")c=l===(a.startsWith("scale")?1:0);else{const u=parseFloat(l);c=a.startsWith("scale")?u===1:u===0}if(!c||n){const u=Ki(l,Rn[a]);if(!c){s=!1;const f=gd[a]||a;i+=`${f}(${u}) `}n&&(t[a]=u)}}const r=e.pathRotation;return r&&(s=!1,i+=`rotate(${Ki(r,Rn.pathRotation)}) `),i=i.trim(),n?i=n(t,s?"":i):s&&(i="none"),i}function Rs(e,t,n){const{style:i,vars:s,transformOrigin:r}=e;let o=!1,a=!1;for(const l in t){const c=t[l];if(At.has(l)){o=!0;continue}else if(la(l)){s[l]=c;continue}else{const u=Ki(c,Rn[l]);l.startsWith("origin")?(a=!0,r[l]=u):i[l]=u}}if(t.transform||(o||n?i.transform=bd(t,e.transform,n):i.transform&&(i.transform="none")),a){const{originX:l="50%",originY:c="50%",originZ:u=0}=r;i.transformOrigin=`${l} ${c} ${u}`}}function Xa(e,{style:t,vars:n},i,s){const r=e.style;let o;for(o in t)r[o]=t[o];s?.applyProjectionStyles(r,i);for(o in n)r.setProperty(o,n[o])}function Eo(e,t){return t.max===t.min?0:e/(t.max-t.min)*100}const Et={correct:(e,t)=>{if(!t.target)return e;if(typeof e=="string")if($.test(e))e=parseFloat(e);else return e;const n=Eo(e,t.target.x),i=Eo(e,t.target.y);return`${n}% ${i}%`}},wd={correct:(e,{treeScale:t,projectionDelta:n})=>{const i=e,s=$e.parse(e);if(s.length>5)return i;const r=$e.createTransformer(e),o=typeof s[0]!="number"?1:0,a=n.x.scale*t.x,l=n.y.scale*t.y;s[0+o]/=a,s[1+o]/=l;const c=ee(a,l,.5);return typeof s[2+o]=="number"&&(s[2+o]/=c),typeof s[3+o]=="number"&&(s[3+o]/=c),r(s)}},Xi={borderRadius:{...Et,applyTo:[...As]},borderTopLeftRadius:Et,borderTopRightRadius:Et,borderBottomLeftRadius:Et,borderBottomRightRadius:Et,boxShadow:wd};function Za(e,{layout:t,layoutId:n}){return At.has(e)||e.startsWith("origin")||(t||n!==void 0)&&(!!Xi[e]||e==="opacity")}function js(e,t,n){const i=e.style,s=t?.style,r={};if(!i)return r;for(const o in i)(ye(i[o])||s&&ye(s[o])||Za(o,e)||n?.getValue(o)?.liveStyle!==void 0)&&(r[o]=i[o]);return r}function xd(e){return window.getComputedStyle(e)}class vd extends Ua{constructor(){super(...arguments),this.type="html",this.renderInstance=Xa}mount(t){$n(!!t.style),super.mount(t)}readValueFromInstance(t,n){if(At.has(n))return this.projection?.isProjecting?Vi(n):Fu(t,n);{const i=xd(t),s=(la(n)?i.getPropertyValue(n):i[n])||0;return typeof s=="string"?s.trim():s}}measureInstanceViewportBox(t,{transformPagePoint:n}){return Ya(t,n)}build(t,n,i){Rs(t,n,i.transformTemplate)}scrapeMotionValuesFromProps(t,n,i){return js(t,n,i)}}const kd={offset:"stroke-dashoffset",array:"stroke-dasharray"},Td={offset:"strokeDashoffset",array:"strokeDasharray"};function Sd(e,t,n=1,i=0,s=!0){e.pathLength=1;const r=s?kd:Td;e[r.offset]=`${-i}`,e[r.array]=`${t} ${n}`}const Ja=["transform","opacity","offsetDistance","offsetPath","offsetRotate","offsetAnchor"];function el(e,{attrX:t,attrY:n,attrScale:i,pathLength:s,pathSpacing:r=1,pathOffset:o=0,...a},l,c,u){if(Rs(e,a,c),l){e.style.viewBox&&(e.attrs.viewBox=e.style.viewBox);return}e.attrs=e.style,e.style={};const{attrs:f,style:h}=e;for(const g of Ja)f[g]!==void 0&&(h[g]=f[g],delete f[g]);(h.transform||f.transformOrigin)&&(h.transformOrigin=f.transformOrigin??"50% 50%",delete f.transformOrigin),h.transform&&(h.transformBox=u?.transformBox??"fill-box",delete f.transformBox),t!==void 0&&(f.x=t),n!==void 0&&(f.y=n),i!==void 0&&(f.scale=i),s!==void 0&&Sd(f,s,r,o,!1)}const tl=new Set(["baseFrequency","diffuseConstant","kernelMatrix","kernelUnitLength","keySplines","keyTimes","limitingConeAngle","markerHeight","markerWidth","numOctaves","targetX","targetY","surfaceScale","specularConstant","specularExponent","stdDeviation","tableValues","viewBox","gradientTransform","pathLength","startOffset","textLength","lengthAdjust"]),nl=e=>typeof e=="string"&&e.toLowerCase()==="svg";function Cd(e,t,n,i){Xa(e,t,void 0,i);for(const s in t.attrs)e.setAttribute(tl.has(s)?s:Cs(s),t.attrs[s])}function il(e,t,n){const i=js(e,t,n);for(const s in e)if(ye(e[s])||ye(t[s])){const r=Ct.indexOf(s)!==-1?"attr"+s.charAt(0).toUpperCase()+s.substring(1):s;i[r]=e[s]}return i}class Ad extends Ua{constructor(){super(...arguments),this.type="svg",this.isSVGTag=!1,this.measureInstanceViewportBox=he}getBaseTargetFromProps(t,n){return t[n]}readValueFromInstance(t,n){if(At.has(n)){const i=Va(n);return i&&i.default||0}if(Ja.includes(n)){const s=getComputedStyle(t)[n];if(typeof s=="string"&&s)return s.trim()}return n=tl.has(n)?n:Cs(n),t.getAttribute(n)}scrapeMotionValuesFromProps(t,n,i){return il(t,n,i)}build(t,n,i){el(t,n,this.isSVGTag,i.transformTemplate,i.style)}renderInstance(t,n,i,s){Cd(t,n,i,s)}mount(t){this.isSVGTag=nl(t.tagName),super.mount(t)}}const Pd=Os.length;function sl(e){if(!e)return;if(!e.isControllingVariants){const n=e.parent?sl(e.parent)||{}:{};return e.props.initial!==void 0&&(n.initial=e.props.initial),n}const t={};for(let n=0;n<Pd;n++){const i=Os[n],s=e.props[i];(_t(s)||s===!1)&&(t[i]=s)}return t}function ol(e,t){if(!Array.isArray(t))return!1;const n=t.length;if(n!==e.length)return!1;for(let i=0;i<n;i++)if(t[i]!==e[i])return!1;return!0}const Ed=[...Ms].reverse(),Dd=Ms.length;function Md(e){return t=>Promise.all(t.map(({animation:n,options:i})=>Eh(e,n,i)))}function Od(e){let t=Md(e),n=Do(),i=!0,s=!1;const r=c=>(u,f)=>{const h=lt(e,f,c==="exit"?e.presenceContext?.custom:void 0);if(h){const{transition:g,transitionEnd:p,...b}=h;u={...u,...b,...p}}return u};function o(c){t=c(e)}function a(c){const{props:u}=e,f=sl(e.parent)||{},h=[],g=new Set;let p={},b=1/0;for(let w=0;w<Dd;w++){const k=Ed[w],v=n[k],x=u[k]!==void 0?u[k]:f[k],C=_t(x),D=k===c?v.isActive:null;D===!1&&(b=w);let T=x===f[k]&&x!==u[k]&&C;if(T&&(i||s)&&e.manuallyAnimateOnMount&&(T=!1),v.protectedKeys={...p},!v.isActive&&D===null||!x&&!v.prevProp||_n(x)||typeof x=="boolean")continue;if(k==="exit"&&v.isActive&&D!==!0){v.prevResolvedValues&&(p={...p,...v.prevResolvedValues});continue}const P=Rd(v.prevProp,x);let E=P||k===c&&v.isActive&&!T&&C||w>b&&C,L=!1;const I=Array.isArray(x)?x:[x];let B=I.reduce(r(k),{});D===!1&&(B={});const{prevResolvedValues:O={}}=v,_={...O,...B},S=N=>{E=!0,g.has(N)&&(L=!0,g.delete(N)),v.needsAnimating[N]=!0;const G=e.getValue(N);G&&(G.liveStyle=!1)};for(const N in _){const G=B[N],j=O[N];if(p.hasOwnProperty(N))continue;let X=!1;Hi(G)&&Hi(j)?X=!ol(G,j)||P:X=G!==j,X?G!=null?S(N):g.add(N):G!==void 0&&g.has(N)?S(N):v.protectedKeys[N]=!0}v.prevProp=x,v.prevResolvedValues=B,v.isActive&&(p={...p,...B}),(i||s)&&e.blockInitialAnimation&&(E=!1);const z=T&&P;E&&(!z||L)&&h.push(...I.map(N=>{const G={type:k};if(typeof N=="string"&&(i||s)&&!z&&e.manuallyAnimateOnMount&&e.parent){const{parent:j}=e,X=lt(j,N);if(j.enteringChildren&&X){const{delayChildren:oe}=X.transition||{};G.delay=Pa(j.enteringChildren,e,oe)}}return{animation:N,options:G}}))}if(g.size){const w={};if(typeof u.initial!="boolean"){const k=lt(e,Array.isArray(u.initial)?u.initial[0]:u.initial);k&&k.transition&&(w.transition=k.transition)}g.forEach(k=>{const v=e.getBaseTarget(k),x=e.getValue(k);x&&(x.liveStyle=!0),w[k]=v??null}),h.push({animation:w})}let m=!!h.length;return i&&(u.initial===!1||u.initial===u.animate)&&!e.manuallyAnimateOnMount&&(m=!1),i=!1,s=!1,m?t(h):Promise.resolve()}function l(c,u){if(n[c].isActive===u)return Promise.resolve();e.variantChildren?.forEach(h=>h.animationState?.setActive(c,u)),n[c].isActive=u;const f=a(c);for(const h in n)n[h].protectedKeys={};return f}return{animateChanges:a,setActive:l,setAnimateFunction:o,getState:()=>n,reset:()=>{n=Do(),s=!0}}}function Rd(e,t){return typeof t=="string"?t!==e:Array.isArray(t)?!ol(t,e):!1}function it(e=!1){return{isActive:e,protectedKeys:{},needsAnimating:{},prevResolvedValues:{}}}function Do(){return{animate:it(!0),whileInView:it(),whileHover:it(),whileTap:it(),whileDrag:it(),whileFocus:it(),exit:it()}}function Zi(e,t){e.min=t.min,e.max=t.max}function Ie(e,t){Zi(e.x,t.x),Zi(e.y,t.y)}function Mo(e,t){e.translate=t.translate,e.scale=t.scale,e.originPoint=t.originPoint,e.origin=t.origin}const rl=1e-4,jd=1-rl,Ld=1+rl,al=.01,Nd=0-al,Vd=0+al;function Te(e){return e.max-e.min}function Id(e,t,n){return Math.abs(e-t)<=n}function Oo(e,t,n,i=.5){e.origin=i,e.originPoint=ee(t.min,t.max,e.origin),e.scale=Te(n)/Te(t),e.translate=ee(n.min,n.max,e.origin)-e.originPoint,(e.scale>=jd&&e.scale<=Ld||isNaN(e.scale))&&(e.scale=1),(e.translate>=Nd&&e.translate<=Vd||isNaN(e.translate))&&(e.translate=0)}function Lt(e,t,n,i){Oo(e.x,t.x,n.x,i?i.originX:void 0),Oo(e.y,t.y,n.y,i?i.originY:void 0)}function Ro(e,t,n,i=0){const s=i?ee(n.min,n.max,i):n.min;e.min=s+t.min,e.max=e.min+Te(t)}function Bd(e,t,n,i){Ro(e.x,t.x,n.x,i?.x),Ro(e.y,t.y,n.y,i?.y)}function jo(e,t,n,i=0){const s=i?ee(n.min,n.max,i):n.min;e.min=t.min-s,e.max=e.min+Te(t)}function Nn(e,t,n,i){jo(e.x,t.x,n.x,i?.x),jo(e.y,t.y,n.y,i?.y)}function Lo(e,t,n,i,s){return e-=t,e=Ln(e,1/n,i),s!==void 0&&(e=Ln(e,1/s,i)),e}function $d(e,t=0,n=1,i=.5,s,r=e,o=e){if(ze.test(t)&&(t=parseFloat(t),t=ee(o.min,o.max,t/100)-o.min),typeof t!="number")return;let a=ee(r.min,r.max,i);e===r&&(a-=t),e.min=Lo(e.min,t,n,a,s),e.max=Lo(e.max,t,n,a,s)}function No(e,t,[n,i,s],r,o){$d(e,t[n],t[i],t[s],t.scale,r,o)}const Fd=["x","scaleX","originX"],_d=["y","scaleY","originY"];function Vo(e,t,n,i){No(e.x,t,Fd,n?n.x:void 0,i?i.x:void 0),No(e.y,t,_d,n?n.y:void 0,i?i.y:void 0)}function Io(e){return e.translate===0&&e.scale===1}function ll(e){return Io(e.x)&&Io(e.y)}function Bo(e,t){return e.min===t.min&&e.max===t.max}function Hd(e,t){return Bo(e.x,t.x)&&Bo(e.y,t.y)}function $o(e,t){return Math.round(e.min)===Math.round(t.min)&&Math.round(e.max)===Math.round(t.max)}function cl(e,t){return $o(e.x,t.x)&&$o(e.y,t.y)}function Fo(e){return Te(e.x)/Te(e.y)}function _o(e,t){return e.translate===t.translate&&e.scale===t.scale&&e.originPoint===t.originPoint}function Fe(e){return[e("x"),e("y")]}function Wd(e,t,n){let i="";const s=e.x.translate/t.x,r=e.y.translate/t.y,o=n?.z||0;if((s||r||o)&&(i=`translate3d(${s}px, ${r}px, ${o}px) `),(t.x!==1||t.y!==1)&&(i+=`scale(${1/t.x}, ${1/t.y}) `),n){const{transformPerspective:c,rotate:u,pathRotation:f,rotateX:h,rotateY:g,skewX:p,skewY:b}=n;c&&(i=`perspective(${c}px) ${i}`),u&&(i+=`rotate(${u}deg) `),f&&(i+=`rotate(${f}deg) `),h&&(i+=`rotateX(${h}deg) `),g&&(i+=`rotateY(${g}deg) `),p&&(i+=`skewX(${p}deg) `),b&&(i+=`skewY(${b}deg) `)}const a=e.x.scale*t.x,l=e.y.scale*t.y;return(a!==1||l!==1)&&(i+=`scale(${a}, ${l})`),i||"none"}const zd=As.length,Ho=e=>typeof e=="string"?parseFloat(e):e,Wo=e=>typeof e=="number"||$.test(e);function Gd(e,t,n,i,s,r){s?(e.opacity=ee(0,n.opacity??1,Ud(i)),e.opacityExit=ee(t.opacity??1,0,Kd(i))):r&&(e.opacity=ee(t.opacity??1,n.opacity??1,i));for(let o=0;o<zd;o++){const a=As[o];let l=zo(t,a),c=zo(n,a);if(l===void 0&&c===void 0)continue;l||(l=0),c||(c=0),l===0||c===0||Wo(l)===Wo(c)?(e[a]=Math.max(ee(Ho(l),Ho(c),i),0),(ze.test(c)||ze.test(l))&&(e[a]+="%")):e[a]=c}(t.rotate||n.rotate)&&(e.rotate=ee(t.rotate||0,n.rotate||0,i))}function zo(e,t){return e[t]!==void 0?e[t]:e.borderRadius}const Ud=ul(0,.5,na),Kd=ul(.5,.95,Re);function ul(e,t,n){return i=>i<e?0:i>t?1:n($t(e,t,i))}function qd(e,t,n){const i=ye(e)?e:Tt(e);return i.start(Ts("",i,t,n)),i.animation}function Ht(e,t,n,i={passive:!0}){return e.addEventListener(t,n,i),()=>e.removeEventListener(t,n,i)}const Qd=(e,t)=>e.depth-t.depth;class Yd{constructor(){this.children=[],this.isDirty=!1}add(t){us(this.children,t),this.isDirty=!0}remove(t){En(this.children,t),this.isDirty=!0}forEach(t){this.isDirty&&this.children.sort(Qd),this.isDirty=!1,this.children.forEach(t)}}function Xd(e,t){const n=ke.now(),i=({timestamp:s})=>{const r=s-n;r>=t&&(Je(i),e(r-t))};return te.setup(i,!0),()=>Je(i)}function kn(e){return ye(e)?e.get():e}class Zd{constructor(){this.members=[]}add(t){us(this.members,t);for(let n=this.members.length-1;n>=0;n--){const i=this.members[n];if(i===t||i===this.lead||i===this.prevLead)continue;const s=i.instance;(!s||s.isConnected===!1)&&!i.snapshot&&(En(this.members,i),i.unmount())}t.scheduleRender()}remove(t){if(En(this.members,t),t===this.prevLead&&(this.prevLead=void 0),t===this.lead){const n=this.members[this.members.length-1];n&&this.promote(n)}}relegate(t){for(let n=this.members.indexOf(t)-1;n>=0;n--){const i=this.members[n];if(i.isPresent!==!1&&i.instance?.isConnected!==!1)return this.promote(i),!0}return!1}promote(t,n){const i=this.lead;if(t!==i&&(this.prevLead=i,this.lead=t,t.show(),i)){i.updateSnapshot(),t.scheduleRender();const{layoutDependency:s}=i.options,{layoutDependency:r}=t.options;(s===void 0||s!==r)&&(t.resumeFrom=i,n&&(i.preserveOpacity=!0),i.snapshot&&(t.snapshot=i.snapshot,t.snapshot.latestValues=i.animationValues||i.latestValues),t.root?.isUpdating&&(t.isLayoutDirty=!0)),t.options.crossfade===!1&&i.hide()}}exitAnimationComplete(){this.members.forEach(t=>{t.options.onExitComplete?.(),t.resumingFrom?.options.onExitComplete?.()})}scheduleRender(){this.members.forEach(t=>t.instance&&t.scheduleRender(!1))}removeLeadSnapshot(){this.lead?.snapshot&&(this.lead.snapshot=void 0)}}const Tn={hasAnimatedSinceResize:!0,hasEverUpdated:!1},ii=["","X","Y","Z"],Jd=1e3;let ef=0;function si(e,t,n,i){const{latestValues:s}=t;s[e]&&(n[e]=s[e],t.setStaticValue(e,0),i&&(i[e]=0))}function hl(e){if(e.hasCheckedOptimisedAppear=!0,e.root===e)return;const{visualElement:t}=e.options;if(!t)return;const n=Ra(t);if(window.MotionHasOptimisedAnimation(n,"transform")){const{layout:s,layoutId:r}=e.options;window.MotionCancelOptimisedAnimation(n,"transform",te,!(s||r))}const{parent:i}=e;i&&!i.hasCheckedOptimisedAppear&&hl(i)}function dl({attachResizeListener:e,defaultParent:t,measureScroll:n,checkIsScrollRoot:i,resetTransform:s}){return class{constructor(o={},a=t?.()){this.id=ef++,this.animationId=0,this.animationCommitId=0,this.children=new Set,this.options={},this.isTreeAnimating=!1,this.isAnimationBlocked=!1,this.isLayoutDirty=!1,this.isProjectionDirty=!1,this.isSharedProjectionDirty=!1,this.isTransformDirty=!1,this.updateManuallyBlocked=!1,this.updateBlockedByResize=!1,this.isUpdating=!1,this.isSVG=!1,this.needsReset=!1,this.shouldResetTransform=!1,this.hasCheckedOptimisedAppear=!1,this.treeScale={x:1,y:1},this.eventHandlers=new Map,this.hasTreeAnimated=!1,this.layoutVersion=0,this.updateScheduled=!1,this.scheduleUpdate=()=>this.update(),this.projectionUpdateScheduled=!1,this.checkUpdateFailed=()=>{this.isUpdating&&(this.isUpdating=!1,this.clearAllSnapshots())},this.updateProjection=()=>{this.projectionUpdateScheduled=!1,this.nodes.forEach(sf),this.nodes.forEach(uf),this.nodes.forEach(hf),this.nodes.forEach(of)},this.resolvedRelativeTargetAt=0,this.linkedParentVersion=0,this.hasProjected=!1,this.isVisible=!0,this.animationProgress=0,this.sharedNodes=new Map,this.latestValues=o,this.root=a?a.root||a:this,this.path=a?[...a.path,a]:[],this.parent=a,this.depth=a?a.depth+1:0;for(let l=0;l<this.path.length;l++)this.path[l].shouldResetTransform=!0;this.root===this&&(this.nodes=new Yd)}addEventListener(o,a){return this.eventHandlers.has(o)||this.eventHandlers.set(o,new hs),this.eventHandlers.get(o).add(a)}notifyListeners(o,...a){const l=this.eventHandlers.get(o);l&&l.notify(...a)}hasListeners(o){return this.eventHandlers.has(o)}mount(o){if(this.instance)return;this.isSVG=Ds(o)&&!id(o),this.instance=o;const{layoutId:a,layout:l,visualElement:c}=this.options;if(c&&!c.current&&c.mount(o),this.root.nodes.add(this),this.parent&&this.parent.children.add(this),this.root.hasTreeAnimated&&(l||a)&&(this.isLayoutDirty=!0),e){let u,f=0;const h=()=>this.root.updateBlockedByResize=!1;te.read(()=>{f=window.innerWidth}),e(o,()=>{const g=window.innerWidth;g!==f&&(f=g,this.root.updateBlockedByResize=!0,u&&u(),u=Xd(h,250),Tn.hasAnimatedSinceResize&&(Tn.hasAnimatedSinceResize=!1,this.nodes.forEach(Ko)))})}a&&this.root.registerSharedNode(a,this),this.options.animate!==!1&&c&&(a||l)&&this.addEventListener("didUpdate",({delta:u,hasLayoutChanged:f,hasRelativeLayoutChanged:h,layout:g})=>{if(this.isTreeAnimationBlocked()){this.target=void 0,this.relativeTarget=void 0;return}const p=this.options.transition||c.getDefaultTransition()||gf,{onLayoutAnimationStart:b,onLayoutAnimationComplete:m}=c.getProps(),w=!this.targetLayout||!cl(this.targetLayout,g),k=!f&&h;if(this.options.layoutRoot||this.resumeFrom||k||f&&(w||!this.currentAnimation)){this.resumeFrom&&(this.resumingFrom=this.resumeFrom,this.resumingFrom.resumingFrom=void 0);const v={...ks(p,"layout"),onPlay:b,onComplete:m};(c.shouldReduceMotion||this.options.layoutRoot)&&(v.delay=0,v.type=!1),this.startAnimation(v),this.setAnimationOrigin(u,k,v.path)}else f||Ko(this),this.isLead()&&this.options.onExitComplete&&this.options.onExitComplete();this.targetLayout=g})}unmount(){this.options.layoutId&&this.willUpdate(),this.root.nodes.remove(this);const o=this.getStack();o&&o.remove(this),this.parent&&this.parent.children.delete(this),this.instance=void 0,this.eventHandlers.clear(),Je(this.updateProjection)}blockUpdate(){this.updateManuallyBlocked=!0}unblockUpdate(){this.updateManuallyBlocked=!1}isUpdateBlocked(){return this.updateManuallyBlocked||this.updateBlockedByResize}isTreeAnimationBlocked(){return this.isAnimationBlocked||this.parent&&this.parent.isTreeAnimationBlocked()||!1}startUpdate(){this.isUpdateBlocked()||(this.isUpdating=!0,this.nodes&&this.nodes.forEach(df),this.animationId++)}getTransformTemplate(){const{visualElement:o}=this.options;return o&&o.getProps().transformTemplate}willUpdate(o=!0){if(this.root.hasTreeAnimated=!0,this.root.isUpdateBlocked()){this.options.onExitComplete&&this.options.onExitComplete();return}if(window.MotionCancelOptimisedAnimation&&!this.hasCheckedOptimisedAppear&&hl(this),!this.root.isUpdating&&this.root.startUpdate(),this.isLayoutDirty)return;this.isLayoutDirty=!0;for(let u=0;u<this.path.length;u++){const f=this.path[u];f.shouldResetTransform=!0,(typeof f.latestValues.x=="string"||typeof f.latestValues.y=="string")&&(f.isLayoutDirty=!0),f.updateScroll("snapshot"),f.options.layoutRoot&&f.willUpdate(!1)}const{layoutId:a,layout:l}=this.options;if(a===void 0&&!l)return;const c=this.getTransformTemplate();this.prevTransformTemplateValue=c?c(this.latestValues,""):void 0,this.updateSnapshot(),o&&this.notifyListeners("willUpdate")}update(){if(this.updateScheduled=!1,this.isUpdateBlocked()){const l=this.updateBlockedByResize;this.unblockUpdate(),this.updateBlockedByResize=!1,this.clearAllSnapshots(),l&&this.nodes.forEach(af),this.nodes.forEach(Go);return}if(this.animationId<=this.animationCommitId){this.nodes.forEach(Uo);return}this.animationCommitId=this.animationId,this.isUpdating?(this.isUpdating=!1,this.nodes.forEach(lf),this.nodes.forEach(cf),this.nodes.forEach(tf),this.nodes.forEach(nf)):this.nodes.forEach(Uo),this.clearAllSnapshots();const a=ke.now();ge.delta=Ge(0,1e3/60,a-ge.timestamp),ge.timestamp=a,ge.isProcessing=!0,Qn.update.process(ge),Qn.preRender.process(ge),Qn.render.process(ge),ge.isProcessing=!1}didUpdate(){this.updateScheduled||(this.updateScheduled=!0,Ps.read(this.scheduleUpdate))}clearAllSnapshots(){this.nodes.forEach(rf),this.sharedNodes.forEach(ff)}scheduleUpdateProjection(){this.projectionUpdateScheduled||(this.projectionUpdateScheduled=!0,te.preRender(this.updateProjection,!1,!0))}scheduleCheckAfterUnmount(){te.postRender(()=>{this.isLayoutDirty?this.root.didUpdate():this.root.checkUpdateFailed()})}updateSnapshot(){this.snapshot||!this.instance||(this.snapshot=this.measure(),this.snapshot&&!Te(this.snapshot.measuredBox.x)&&!Te(this.snapshot.measuredBox.y)&&(this.snapshot=void 0))}updateLayout(){if(!this.instance||(this.updateScroll(),!(this.options.alwaysMeasureLayout&&this.isLead())&&!this.isLayoutDirty))return;if(this.resumeFrom&&!this.resumeFrom.instance)for(let l=0;l<this.path.length;l++)this.path[l].updateScroll();const o=this.layout;this.layout=this.measure(!1),this.layoutVersion++,this.layoutCorrected||(this.layoutCorrected=he()),this.isLayoutDirty=!1,this.projectionDelta=void 0,this.notifyListeners("measure",this.layout.layoutBox);const{visualElement:a}=this.options;a&&a.notify("LayoutMeasure",this.layout.layoutBox,o?o.layoutBox:void 0)}updateScroll(o="measure"){let a=!!(this.options.layoutScroll&&this.instance);if(this.scroll&&this.scroll.animationId===this.root.animationId&&this.scroll.phase===o&&(a=!1),a&&this.instance){const l=i(this.instance);this.scroll={animationId:this.root.animationId,phase:o,isRoot:l,offset:n(this.instance),wasRoot:this.scroll?this.scroll.isRoot:l}}}resetTransform(){if(!s)return;const o=this.isLayoutDirty||this.shouldResetTransform||this.options.alwaysMeasureLayout,a=this.projectionDelta&&!ll(this.projectionDelta),l=this.getTransformTemplate(),c=l?l(this.latestValues,""):void 0,u=c!==this.prevTransformTemplateValue;o&&this.instance&&(a||st(this.latestValues)||u)&&(s(this.instance,c),this.shouldResetTransform=!1,this.scheduleRender())}measure(o=!0){const a=this.measurePageBox();let l=this.removeElementScroll(a);return o&&(l=this.removeTransform(l)),yf(l),{animationId:this.root.animationId,measuredBox:a,layoutBox:l,latestValues:{},source:this.id}}measurePageBox(){const{visualElement:o}=this.options;if(!o)return he();const a=o.measureViewportBox();if(!(this.scroll?.wasRoot||this.path.some(bf))){const{scroll:c}=this.root;c&&(_e(a.x,c.offset.x),_e(a.y,c.offset.y))}return a}removeElementScroll(o){const a=he();if(Ie(a,o),this.scroll?.wasRoot)return a;for(let l=0;l<this.path.length;l++){const c=this.path[l],{scroll:u,options:f}=c;c!==this.root&&u&&f.layoutScroll&&(u.wasRoot&&Ie(a,o),_e(a.x,u.offset.x),_e(a.y,u.offset.y))}return a}applyTransform(o,a=!1,l){const c=l||he();Ie(c,o);for(let u=0;u<this.path.length;u++){const f=this.path[u];!a&&f.options.layoutScroll&&f.scroll&&f!==f.root&&(_e(c.x,-f.scroll.offset.x),_e(c.y,-f.scroll.offset.y)),st(f.latestValues)&&vn(c,f.latestValues,f.layout?.layoutBox)}return st(this.latestValues)&&vn(c,this.latestValues,this.layout?.layoutBox),c}removeTransform(o){const a=he();Ie(a,o);for(let l=0;l<this.path.length;l++){const c=this.path[l];if(!st(c.latestValues))continue;let u;c.instance&&(Qi(c.latestValues)&&c.updateSnapshot(),u=he(),Ie(u,c.measurePageBox())),Vo(a,c.latestValues,c.snapshot?.layoutBox,u)}return st(this.latestValues)&&Vo(a,this.latestValues),a}setTargetDelta(o){this.targetDelta=o,this.root.scheduleUpdateProjection(),this.isProjectionDirty=!0}setOptions(o){this.options={...this.options,...o,crossfade:o.crossfade!==void 0?o.crossfade:!0}}clearMeasurements(){this.scroll=void 0,this.layout=void 0,this.snapshot=void 0,this.prevTransformTemplateValue=void 0,this.targetDelta=void 0,this.target=void 0,this.isLayoutDirty=!1}forceRelativeParentToResolveTarget(){this.relativeParent&&this.relativeParent.resolvedRelativeTargetAt!==ge.timestamp&&this.relativeParent.resolveTargetDelta(!0)}resolveTargetDelta(o=!1){const a=this.getLead();this.isProjectionDirty||(this.isProjectionDirty=a.isProjectionDirty),this.isTransformDirty||(this.isTransformDirty=a.isTransformDirty),this.isSharedProjectionDirty||(this.isSharedProjectionDirty=a.isSharedProjectionDirty);const l=!!this.resumingFrom||this!==a;if(!(o||l&&this.isSharedProjectionDirty||this.isProjectionDirty||this.parent?.isProjectionDirty||this.attemptToResolveRelativeTarget||this.root.updateBlockedByResize))return;const{layout:u,layoutId:f}=this.options;if(!this.layout||!(u||f))return;this.resolvedRelativeTargetAt=ge.timestamp;const h=this.getClosestProjectingParent();h&&this.linkedParentVersion!==h.layoutVersion&&!h.options.layoutRoot&&this.removeRelativeTarget(),!this.targetDelta&&!this.relativeTarget&&(this.options.layoutAnchor!==!1&&h&&h.layout?this.createRelativeTarget(h,this.layout.layoutBox,h.layout.layoutBox):this.removeRelativeTarget()),!(!this.relativeTarget&&!this.targetDelta)&&(this.target||(this.target=he(),this.targetWithTransforms=he()),this.relativeTarget&&this.relativeTargetOrigin&&this.relativeParent&&this.relativeParent.target?(this.forceRelativeParentToResolveTarget(),Bd(this.target,this.relativeTarget,this.relativeParent.target,this.options.layoutAnchor||void 0)):this.targetDelta?(this.resumingFrom?this.applyTransform(this.layout.layoutBox,!1,this.target):Ie(this.target,this.layout.layoutBox),Qa(this.target,this.targetDelta)):Ie(this.target,this.layout.layoutBox),this.attemptToResolveRelativeTarget&&(this.attemptToResolveRelativeTarget=!1,this.options.layoutAnchor!==!1&&h&&!!h.resumingFrom==!!this.resumingFrom&&!h.options.layoutScroll&&h.target&&this.animationProgress!==1?this.createRelativeTarget(h,this.target,h.target):this.relativeParent=this.relativeTarget=void 0))}getClosestProjectingParent(){if(!(!this.parent||Qi(this.parent.latestValues)||qa(this.parent.latestValues)))return this.parent.isProjecting()?this.parent:this.parent.getClosestProjectingParent()}isProjecting(){return!!((this.relativeTarget||this.targetDelta||this.options.layoutRoot)&&this.layout)}createRelativeTarget(o,a,l){this.relativeParent=o,this.linkedParentVersion=o.layoutVersion,this.forceRelativeParentToResolveTarget(),this.relativeTarget=he(),this.relativeTargetOrigin=he(),Nn(this.relativeTargetOrigin,a,l,this.options.layoutAnchor||void 0),Ie(this.relativeTarget,this.relativeTargetOrigin)}removeRelativeTarget(){this.relativeParent=this.relativeTarget=void 0}calcProjection(){const o=this.getLead(),a=!!this.resumingFrom||this!==o;let l=!0;if((this.isProjectionDirty||this.parent?.isProjectionDirty)&&(l=!1),a&&(this.isSharedProjectionDirty||this.isTransformDirty)&&(l=!1),this.resolvedRelativeTargetAt===ge.timestamp&&(l=!1),l)return;const{layout:c,layoutId:u}=this.options;if(this.isTreeAnimating=!!(this.parent&&this.parent.isTreeAnimating||this.currentAnimation||this.pendingAnimation),this.isTreeAnimating||(this.targetDelta=this.relativeTarget=void 0),!this.layout||!(c||u))return;Ie(this.layoutCorrected,this.layout.layoutBox);const f=this.treeScale.x,h=this.treeScale.y;pd(this.layoutCorrected,this.treeScale,this.path,a),o.layout&&!o.target&&(this.treeScale.x!==1||this.treeScale.y!==1)&&(o.target=o.layout.layoutBox,o.targetWithTransforms=he());const{target:g}=o;if(!g){this.prevProjectionDelta&&(this.createProjectionDeltas(),this.scheduleRender());return}!this.projectionDelta||!this.prevProjectionDelta?this.createProjectionDeltas():(Mo(this.prevProjectionDelta.x,this.projectionDelta.x),Mo(this.prevProjectionDelta.y,this.projectionDelta.y)),Lt(this.projectionDelta,this.layoutCorrected,g,this.latestValues),(this.treeScale.x!==f||this.treeScale.y!==h||!_o(this.projectionDelta.x,this.prevProjectionDelta.x)||!_o(this.projectionDelta.y,this.prevProjectionDelta.y))&&(this.hasProjected=!0,this.scheduleRender(),this.notifyListeners("projectionUpdate",g))}hide(){this.isVisible=!1}show(){this.isVisible=!0}scheduleRender(o=!0){if(this.options.visualElement?.scheduleRender(),o){const a=this.getStack();a&&a.scheduleRender()}this.resumingFrom&&!this.resumingFrom.instance&&(this.resumingFrom=void 0)}createProjectionDeltas(){this.prevProjectionDelta=vt(),this.projectionDelta=vt(),this.projectionDeltaWithTransform=vt()}setAnimationOrigin(o,a=!1,l){const c=this.snapshot,u=c?c.latestValues:{},f={...this.latestValues},h=vt();(!this.relativeParent||!this.relativeParent.options.layoutRoot)&&(this.relativeTarget=this.relativeTargetOrigin=void 0),this.attemptToResolveRelativeTarget=!a;const g=he(),p=c?c.source:void 0,b=this.layout?this.layout.source:void 0,m=p!==b,w=this.getStack(),k=!w||w.members.length<=1,v=!!(m&&!k&&this.options.crossfade===!0&&!this.path.some(mf));this.animationProgress=0;let x;const C=l?.interpolateProjection(o);this.mixTargetDelta=D=>{const T=D/1e3,P=C?.(T);P?(h.x.translate=P.x,h.x.scale=ee(o.x.scale,1,T),h.x.origin=o.x.origin,h.x.originPoint=o.x.originPoint,h.y.translate=P.y,h.y.scale=ee(o.y.scale,1,T),h.y.origin=o.y.origin,h.y.originPoint=o.y.originPoint):(qo(h.x,o.x,T),qo(h.y,o.y,T)),this.setTargetDelta(h),this.relativeTarget&&this.relativeTargetOrigin&&this.layout&&this.relativeParent&&this.relativeParent.layout&&(Nn(g,this.layout.layoutBox,this.relativeParent.layout.layoutBox,this.options.layoutAnchor||void 0),pf(this.relativeTarget,this.relativeTargetOrigin,g,T),x&&Hd(this.relativeTarget,x)&&(this.isProjectionDirty=!1),x||(x=he()),Ie(x,this.relativeTarget)),m&&(this.animationValues=f,Gd(f,u,this.latestValues,T,v,k)),P&&P.rotate!==void 0&&(this.animationValues||(this.animationValues=f),this.animationValues.pathRotation=P.rotate),this.root.scheduleUpdateProjection(),this.scheduleRender(),this.animationProgress=T},this.mixTargetDelta(this.options.layoutRoot?1e3:0)}startAnimation(o){this.notifyListeners("animationStart"),this.currentAnimation?.stop(),this.resumingFrom?.currentAnimation?.stop(),this.pendingAnimation&&(Je(this.pendingAnimation),this.pendingAnimation=void 0),this.pendingAnimation=te.update(()=>{Tn.hasAnimatedSinceResize=!0,this.motionValue||(this.motionValue=Tt(0)),this.motionValue.jump(0,!1),this.currentAnimation=qd(this.motionValue,[0,1e3],{...o,velocity:0,isSync:!0,onUpdate:a=>{this.mixTargetDelta(a),o.onUpdate&&o.onUpdate(a)},onComplete:()=>{o.onComplete&&o.onComplete(),this.completeAnimation()}}),this.resumingFrom&&(this.resumingFrom.currentAnimation=this.currentAnimation),this.pendingAnimation=void 0})}completeAnimation(){this.resumingFrom&&(this.resumingFrom.currentAnimation=void 0,this.resumingFrom.preserveOpacity=void 0);const o=this.getStack();o&&o.exitAnimationComplete(),this.resumingFrom=this.currentAnimation=this.animationValues=void 0,this.notifyListeners("animationComplete")}finishAnimation(){this.currentAnimation&&(this.mixTargetDelta&&this.mixTargetDelta(Jd),this.currentAnimation.stop()),this.completeAnimation()}applyTransformsToTarget(){const o=this.getLead();let{targetWithTransforms:a,target:l,layout:c,latestValues:u}=o;if(!(!a||!l||!c)){if(this!==o&&this.layout&&c&&fl(this.options.animationType,this.layout.layoutBox,c.layoutBox)){l=this.target||he();const f=Te(this.layout.layoutBox.x);l.x.min=o.target.x.min,l.x.max=l.x.min+f;const h=Te(this.layout.layoutBox.y);l.y.min=o.target.y.min,l.y.max=l.y.min+h}Ie(a,l),vn(a,u),Lt(this.projectionDeltaWithTransform,this.layoutCorrected,a,u)}}registerSharedNode(o,a){this.sharedNodes.has(o)||this.sharedNodes.set(o,new Zd),this.sharedNodes.get(o).add(a);const c=a.options.initialPromotionConfig;a.promote({transition:c?c.transition:void 0,preserveFollowOpacity:c&&c.shouldPreserveFollowOpacity?c.shouldPreserveFollowOpacity(a):void 0})}isLead(){const o=this.getStack();return o?o.lead===this:!0}getLead(){const{layoutId:o}=this.options;return o?this.getStack()?.lead||this:this}getPrevLead(){const{layoutId:o}=this.options;return o?this.getStack()?.prevLead:void 0}getStack(){const{layoutId:o}=this.options;if(o)return this.root.sharedNodes.get(o)}promote({needsReset:o,transition:a,preserveFollowOpacity:l}={}){const c=this.getStack();c&&c.promote(this,l),o&&(this.projectionDelta=void 0,this.needsReset=!0),a&&this.setOptions({transition:a})}relegate(){const o=this.getStack();return o?o.relegate(this):!1}resetSkewAndRotation(){const{visualElement:o}=this.options;if(!o)return;let a=!1;const{latestValues:l}=o;if((l.z||l.rotate||l.rotateX||l.rotateY||l.rotateZ||l.skewX||l.skewY)&&(a=!0),!a)return;const c={};l.z&&si("z",o,c,this.animationValues);for(let u=0;u<ii.length;u++)si(`rotate${ii[u]}`,o,c,this.animationValues),si(`skew${ii[u]}`,o,c,this.animationValues);o.render();for(const u in c)o.setStaticValue(u,c[u]),this.animationValues&&(this.animationValues[u]=c[u]);o.scheduleRender()}applyProjectionStyles(o,a){if(!this.instance||this.isSVG)return;if(!this.isVisible){o.visibility="hidden";return}const l=this.getTransformTemplate();if(this.needsReset){this.needsReset=!1,o.visibility="",o.opacity="",o.pointerEvents=kn(a?.pointerEvents)||"",o.transform=l?l(this.latestValues,""):"none";return}const c=this.getLead();if(!this.projectionDelta||!this.layout||!c.target){this.options.layoutId&&(o.opacity=this.latestValues.opacity!==void 0?this.latestValues.opacity:1,o.pointerEvents=kn(a?.pointerEvents)||""),this.hasProjected&&!st(this.latestValues)&&(o.transform=l?l({},""):"none",this.hasProjected=!1);return}o.visibility="";const u=c.animationValues||c.latestValues;this.applyTransformsToTarget();let f=Wd(this.projectionDeltaWithTransform,this.treeScale,u);l&&(f=l(u,f)),o.transform=f;const{x:h,y:g}=this.projectionDelta;o.transformOrigin=`${h.origin*100}% ${g.origin*100}% 0`,c.animationValues?o.opacity=c===this?u.opacity??this.latestValues.opacity??1:this.preserveOpacity?this.latestValues.opacity:u.opacityExit:o.opacity=c===this?u.opacity!==void 0?u.opacity:"":u.opacityExit!==void 0?u.opacityExit:0;for(const p in Xi){if(u[p]===void 0)continue;const{correct:b,applyTo:m,isCSSVariable:w}=Xi[p],k=f==="none"?u[p]:b(u[p],c);if(m){const v=m.length;for(let x=0;x<v;x++)o[m[x]]=k}else w?this.options.visualElement.renderState.vars[p]=k:o[p]=k}this.options.layoutId&&(o.pointerEvents=c===this?kn(a?.pointerEvents)||"":"none")}clearSnapshot(){this.resumeFrom=this.snapshot=void 0}resetTree(){this.root.nodes.forEach(o=>o.currentAnimation?.stop()),this.root.nodes.forEach(Go),this.root.sharedNodes.clear()}}}function tf(e){e.updateLayout()}function nf(e){const t=e.resumeFrom?.snapshot||e.snapshot;if(e.isLead()&&e.layout&&t&&e.hasListeners("didUpdate")){const{layoutBox:n,measuredBox:i}=e.layout,{animationType:s}=e.options,r=t.source!==e.layout.source;if(s==="size")Fe(u=>{const f=r?t.measuredBox[u]:t.layoutBox[u],h=Te(f);f.min=n[u].min,f.max=f.min+h});else if(s==="x"||s==="y"){const u=s==="x"?"y":"x";Zi(r?t.measuredBox[u]:t.layoutBox[u],n[u])}else fl(s,t.layoutBox,n)&&Fe(u=>{const f=r?t.measuredBox[u]:t.layoutBox[u],h=Te(n[u]);f.max=f.min+h,e.relativeTarget&&!e.currentAnimation&&(e.isProjectionDirty=!0,e.relativeTarget[u].max=e.relativeTarget[u].min+h)});const o=vt();Lt(o,n,t.layoutBox);const a=vt();r?Lt(a,e.applyTransform(i,!0),t.measuredBox):Lt(a,n,t.layoutBox);const l=!ll(o);let c=!1;if(!e.resumeFrom){const u=e.getClosestProjectingParent();if(u&&!u.resumeFrom){const{snapshot:f,layout:h}=u;if(f&&h){const g=e.options.layoutAnchor||void 0,p=he();Nn(p,t.layoutBox,f.layoutBox,g);const b=he();Nn(b,n,h.layoutBox,g),cl(p,b)||(c=!0),u.options.layoutRoot&&(e.relativeTarget=b,e.relativeTargetOrigin=p,e.relativeParent=u)}}}e.notifyListeners("didUpdate",{layout:n,snapshot:t,delta:a,layoutDelta:o,hasLayoutChanged:l,hasRelativeLayoutChanged:c})}else if(e.isLead()){const{onExitComplete:n}=e.options;n&&n()}e.options.transition=void 0}function sf(e){e.parent&&(e.isProjecting()||(e.isProjectionDirty=e.parent.isProjectionDirty),e.isSharedProjectionDirty||(e.isSharedProjectionDirty=!!(e.isProjectionDirty||e.parent.isProjectionDirty||e.parent.isSharedProjectionDirty)),e.isTransformDirty||(e.isTransformDirty=e.parent.isTransformDirty))}function of(e){e.isProjectionDirty=e.isSharedProjectionDirty=e.isTransformDirty=!1}function rf(e){e.clearSnapshot()}function Go(e){e.clearMeasurements()}function af(e){e.isLayoutDirty=!0,e.updateLayout()}function Uo(e){e.isLayoutDirty=!1}function lf(e){e.isAnimationBlocked&&e.layout&&!e.isLayoutDirty&&(e.snapshot=e.layout,e.isLayoutDirty=!0)}function cf(e){const{visualElement:t}=e.options;t&&t.getProps().onBeforeLayoutMeasure&&t.notify("BeforeLayoutMeasure"),e.resetTransform()}function Ko(e){e.finishAnimation(),e.targetDelta=e.relativeTarget=e.target=void 0,e.isProjectionDirty=!0}function uf(e){e.resolveTargetDelta()}function hf(e){e.calcProjection()}function df(e){e.resetSkewAndRotation()}function ff(e){e.removeLeadSnapshot()}function qo(e,t,n){e.translate=ee(t.translate,0,n),e.scale=ee(t.scale,1,n),e.origin=t.origin,e.originPoint=t.originPoint}function Qo(e,t,n,i){e.min=ee(t.min,n.min,i),e.max=ee(t.max,n.max,i)}function pf(e,t,n,i){Qo(e.x,t.x,n.x,i),Qo(e.y,t.y,n.y,i)}function mf(e){return e.animationValues&&e.animationValues.opacityExit!==void 0}const gf={duration:.45,ease:[.4,0,.1,1]},Yo=e=>typeof navigator<"u"&&navigator.userAgent&&navigator.userAgent.toLowerCase().includes(e),Xo=Yo("applewebkit/")&&!Yo("chrome/")?Math.round:Re;function Zo(e){e.min=Xo(e.min),e.max=Xo(e.max)}function yf(e){Zo(e.x),Zo(e.y)}function fl(e,t,n){return e==="position"||e==="preserve-aspect"&&!Id(Fo(t),Fo(n),.2)}function bf(e){return e!==e.root&&e.scroll?.wasRoot}const wf=dl({attachResizeListener:(e,t)=>Ht(e,"resize",t),measureScroll:()=>({x:document.documentElement.scrollLeft||document.body?.scrollLeft||0,y:document.documentElement.scrollTop||document.body?.scrollTop||0}),checkIsScrollRoot:()=>!0}),oi={current:void 0},pl=dl({measureScroll:e=>({x:e.scrollLeft,y:e.scrollTop}),defaultParent:()=>{if(!oi.current){const e=new wf({});e.mount(window),e.setOptions({layoutScroll:!0}),oi.current=e}return oi.current},resetTransform:(e,t)=>{e.style.transform=t!==void 0?t:"none"},checkIsScrollRoot:e=>window.getComputedStyle(e).position==="fixed"}),Ls=y.createContext({transformPagePoint:e=>e,isStatic:!1,reducedMotion:"never"});function Jo(e,t){if(typeof e=="function")return e(t);e!=null&&(e.current=t)}function xf(...e){return t=>{let n=!1;const i=e.map(s=>{const r=Jo(s,t);return!n&&typeof r=="function"&&(n=!0),r});if(n)return()=>{for(let s=0;s<i.length;s++){const r=i[s];typeof r=="function"?r():Jo(e[s],null)}}}}function vf(...e){return y.useCallback(xf(...e),e)}class kf extends y.Component{getSnapshotBeforeUpdate(t){const n=this.props.childRef.current;if(gn(n)&&t.isPresent&&!this.props.isPresent&&this.props.pop!==!1){const i=n.offsetParent,s=gn(i)&&i.offsetWidth||0,r=gn(i)&&i.offsetHeight||0,o=getComputedStyle(n),a=this.props.sizeRef.current;a.height=parseFloat(o.height),a.width=parseFloat(o.width),a.top=n.offsetTop,a.left=n.offsetLeft,a.right=s-a.width-a.left,a.bottom=r-a.height-a.top,a.direction=o.direction}return null}componentDidUpdate(){}render(){return this.props.children}}function Tf({children:e,isPresent:t,anchorX:n,anchorY:i,root:s,pop:r}){const o=y.useId(),a=y.useRef(null),l=y.useRef({width:0,height:0,top:0,left:0,right:0,bottom:0,direction:"ltr"}),{nonce:c}=y.useContext(Ls),u=r!==!1?e.props?.ref??e?.ref:void 0,f=vf(a,u);return y.useInsertionEffect(()=>{const{width:h,height:g,top:p,left:b,right:m,bottom:w,direction:k}=l.current;if(t||r===!1||!a.current||!h||!g)return;const v=k==="rtl",x=n==="left"?v?`right: ${m}`:`left: ${b}`:v?`left: ${b}`:`right: ${m}`,C=i==="bottom"?`bottom: ${w}`:`top: ${p}`;a.current.dataset.motionPopId=o;const D=document.createElement("style");c&&(D.nonce=c);const T=s??document.head;return T.appendChild(D),D.sheet&&D.sheet.insertRule(`
          [data-motion-pop-id="${o}"] {
            position: absolute !important;
            width: ${h}px !important;
            height: ${g}px !important;
            ${x}px !important;
            ${C}px !important;
          }
        `),()=>{a.current?.removeAttribute("data-motion-pop-id"),T.contains(D)&&T.removeChild(D)}},[t]),d.jsx(kf,{isPresent:t,childRef:a,sizeRef:l,pop:r,children:r===!1?e:y.cloneElement(e,{ref:f})})}const Sf=({children:e,initial:t,isPresent:n,onExitComplete:i,custom:s,presenceAffectsLayout:r,mode:o,anchorX:a,anchorY:l,root:c})=>{const u=cs(Cf),f=y.useId(),h=y.useRef(n),g=y.useRef(i);Pn(()=>{h.current=n,g.current=i});let p=!0,b=y.useMemo(()=>(p=!1,{id:f,initial:t,isPresent:n,custom:s,onExitComplete:m=>{u.set(m,!0);for(const w of u.values())if(!w)return;i&&i()},register:m=>(u.set(m,!1),()=>{u.delete(m),!h.current&&!u.size&&g.current?.()})}),[n,u,i]);return r&&p&&(b={...b}),y.useMemo(()=>{u.forEach((m,w)=>u.set(w,!1))},[n]),y.useEffect(()=>{!n&&!u.size&&i&&i()},[n]),e=d.jsx(Tf,{pop:o==="popLayout",isPresent:n,anchorX:a,anchorY:l,root:c,children:e}),d.jsx(Bn.Provider,{value:b,children:e})};function Cf(){return new Map}function ml(e=!0){const t=y.useContext(Bn);if(t===null)return[!0,null];const{isPresent:n,onExitComplete:i,register:s}=t,r=y.useId();y.useEffect(()=>{if(e)return s(r)},[e]);const o=y.useCallback(()=>e&&i&&i(r),[r,i,e]);return!n&&i?[!1,o]:[!0]}const nn=e=>e.key||"";function er(e){const t=[];return y.Children.forEach(e,n=>{y.isValidElement(n)&&t.push(n)}),t}const Af=({children:e,custom:t,initial:n=!0,onExitComplete:i,presenceAffectsLayout:s=!0,mode:r="sync",propagate:o=!1,anchorX:a="left",anchorY:l="top",root:c})=>{const[u,f]=ml(o),h=y.useMemo(()=>er(e),[e]),g=o&&!u?[]:h.map(nn),p=y.useRef(!0),b=y.useRef(h),m=cs(()=>new Map),w=y.useRef(new Set),[k,v]=y.useState(h),[x,C]=y.useState(h);Pn(()=>{o&&!u&&!x.length&&f?.()},[u,o,x.length,f]),Pn(()=>{p.current=!1,b.current=h;for(let P=0;P<x.length;P++){const E=nn(x[P]);g.includes(E)?(m.delete(E),w.current.delete(E)):m.get(E)!==!0&&m.set(E,!1)}},[x,g.length,g.join("-")]);const D=[];if(h!==k){let P=[...h],E=0;for(const L of x){const I=g.indexOf(nn(L));I===-1?(P.splice(E++,0,L),D.push(L)):E=I+D.length+1}return r==="wait"&&D.length&&(P=D),C(er(P)),v(h),null}const{forceRender:T}=y.useContext(ls);return d.jsx(d.Fragment,{children:x.map(P=>{const E=nn(P),L=o&&!u?!1:h===x||g.includes(E),I=()=>{if(w.current.has(E))return;if(m.has(E))w.current.add(E),m.set(E,!0);else return;let B=!0;m.forEach(O=>{O||(B=!1)}),B&&(T?.(),C(b.current),o&&f?.(),i&&i())};return d.jsx(Sf,{isPresent:L,initial:!p.current||n?void 0:!1,custom:t,presenceAffectsLayout:s,mode:r,root:c,onExitComplete:L?void 0:I,anchorX:a,anchorY:l,children:P},E)})})},gl=y.createContext({strict:!1}),tr={animation:["animate","variants","whileHover","whileTap","exit","whileInView","whileFocus","whileDrag"],exit:["exit"],drag:["drag","dragControls"],focus:["whileFocus"],hover:["whileHover","onHoverStart","onHoverEnd"],tap:["whileTap","onTap","onTapStart","onTapCancel"],pan:["onPan","onPanStart","onPanSessionStart","onPanEnd"],inView:["whileInView","onViewportEnter","onViewportLeave"],layout:["layout","layoutId"]};let nr=!1;function Pf(){if(nr)return;const e={};for(const t in tr)e[t]={isEnabled:n=>tr[t].some(i=>!!n[i])};Ga(e),nr=!0}function yl(){return Pf(),ud()}function Ef(e){const t=yl();for(const n in e)t[n]={...t[n],...e[n]};Ga(t)}const Wn=y.createContext({});function Df(e,t){if(Hn(e)){const{initial:n,animate:i}=e;return{initial:n===!1||_t(n)?n:void 0,animate:_t(i)?i:void 0}}return e.inherit!==!1?t:{}}function Mf(e){const{initial:t,animate:n}=Df(e,y.useContext(Wn));return y.useMemo(()=>({initial:t,animate:n}),[ir(t),ir(n)])}function ir(e){return Array.isArray(e)?e.join(" "):e}const Ns=()=>({style:{},transform:{},transformOrigin:{},vars:{}});function bl(e,t,n){for(const i in t)!ye(t[i])&&!Za(i,n)&&(e[i]=t[i])}function Of({transformTemplate:e},t){return y.useMemo(()=>{const n=Ns();return Rs(n,t,e),Object.assign({},n.vars,n.style)},[t])}function Rf(e,t){const n=e.style||{},i={};return bl(i,n,e),Object.assign(i,Of(e,t)),i}function jf(e,t){const n={},i=Rf(e,t);return e.drag&&e.dragListener!==!1&&(n.draggable=!1,i.userSelect=i.WebkitUserSelect=i.WebkitTouchCallout="none",i.touchAction=e.drag===!0?"none":`pan-${e.drag==="x"?"y":"x"}`),e.tabIndex===void 0&&(e.onTap||e.onTapStart||e.whileTap)&&(n.tabIndex=0),n.style=i,n}const wl=()=>({...Ns(),attrs:{}});function Lf(e,t,n,i){const s=y.useMemo(()=>{const r=wl();return el(r,t,nl(i),e.transformTemplate,e.style),{...r.attrs,style:{...r.style}}},[t]);if(e.style){const r={};bl(r,e.style,e),s.style={...r,...s.style}}return s}const Nf=new Set(["animate","exit","variants","initial","style","values","variants","transition","transformTemplate","custom","inherit","onBeforeLayoutMeasure","onAnimationStart","onAnimationComplete","onUpdate","onDragStart","onDrag","onDragEnd","onMeasureDragConstraints","onDirectionLock","onDragTransitionEnd","_dragX","_dragY","onHoverStart","onHoverEnd","onViewportEnter","onViewportLeave","globalTapTarget","propagate","ignoreStrict","viewport"]);function Vn(e){return e.startsWith("while")||e.startsWith("drag")&&e!=="draggable"||e.startsWith("layout")||e.startsWith("onTap")||e.startsWith("onPan")||e.startsWith("onLayout")||Nf.has(e)}function Vf(e,t){return e.startsWith("on")?!Vn(e):t?.(e)??!Vn(e)}function If(e,t,n,i){const s={};for(const r in e)r==="values"&&typeof e.values=="object"||ye(e[r])||(Vf(r,i)||n===!0&&Vn(r)||!t&&!Vn(r)||e.draggable&&r.startsWith("onDrag"))&&(s[r]=e[r]);return s}const Bf=["animate","circle","defs","desc","ellipse","g","image","line","filter","marker","mask","metadata","path","pattern","polygon","polyline","rect","stop","switch","symbol","svg","text","tspan","use","view"];function Vs(e){return typeof e!="string"||e.includes("-")?!1:!!(Bf.indexOf(e)>-1||/[A-Z]/u.test(e))}function $f(e,t,n,{latestValues:i},s,r=!1,o,a){const c=(o??Vs(e)?Lf:jf)(t,i,s,e),u=If(t,typeof e=="string",r,a),f=e!==y.Fragment?{...u,...c,ref:n}:{},{children:h}=t,g=y.useMemo(()=>ye(h)?h.get():h,[h]);return y.createElement(e,{...f,children:g})}function Ff({scrapeMotionValuesFromProps:e,createRenderState:t},n,i,s){return{latestValues:_f(n,i,s,e),renderState:t()}}function _f(e,t,n,i){const s={},r=i(e,{});for(const h in r)s[h]=kn(r[h]);let{initial:o,animate:a}=e;const l=Hn(e),c=Wa(e);t&&c&&!l&&e.inherit!==!1&&(o===void 0&&(o=t.initial),a===void 0&&(a=t.animate));let u=n?n.initial===!1:!1;u=u||o===!1;const f=u?a:o;if(f&&typeof f!="boolean"&&!_n(f)){const h=Array.isArray(f)?f:[f];for(let g=0;g<h.length;g++){const p=Ss(e,h[g]);if(p){const{transitionEnd:b,transition:m,...w}=p;for(const k in w){let v=w[k];if(Array.isArray(v)){const x=u?v.length-1:0;v=v[x]}v!==null&&(s[k]=v)}for(const k in b)s[k]=b[k]}}}return s}const xl=e=>(t,n)=>{const i=y.useContext(Wn),s=y.useContext(Bn),r=()=>Ff(e,t,i,s);return n?r():cs(r)},Hf=xl({scrapeMotionValuesFromProps:js,createRenderState:Ns}),Wf=xl({scrapeMotionValuesFromProps:il,createRenderState:wl}),zf=Symbol.for("motionComponentSymbol");function Gf(e,t,n){const i=y.useRef(n);y.useInsertionEffect(()=>{i.current=n});const s=y.useRef(null);return y.useCallback(r=>{r&&e.onMount?.(r),t&&(r?t.mount(r):t.unmount());const o=i.current;if(typeof o=="function")if(r){const a=o(r);typeof a=="function"&&(s.current=a)}else s.current?(s.current(),s.current=null):o(r);else o&&(o.current=r)},[t])}const vl=y.createContext({});function bt(e){return e&&typeof e=="object"&&Object.prototype.hasOwnProperty.call(e,"current")}function Uf(e,t,n,i,s,r){const{visualElement:o}=y.useContext(Wn),a=y.useContext(gl),l=y.useContext(Bn),c=y.useContext(Ls),u=c.reducedMotion,f=c.skipAnimations,h=y.useRef(null),g=y.useRef(!1);i=i||a.renderer,!h.current&&i&&(h.current=i(e,{visualState:t,parent:o,props:n,presenceContext:l,blockInitialAnimation:l?l.initial===!1:!1,reducedMotionConfig:u,skipAnimations:f,isSVG:r}),g.current&&h.current&&(h.current.manuallyAnimateOnMount=!0));const p=h.current,b=y.useContext(vl);p&&!p.projection&&s&&(p.type==="html"||p.type==="svg")&&Kf(h.current,n,s,b);const m=y.useRef(!1);y.useInsertionEffect(()=>{p&&m.current&&p.update(n,l)});const w=n[Oa],k=y.useRef(!!w&&typeof window<"u"&&!window.MotionHandoffIsComplete?.(w)&&window.MotionHasOptimisedAnimation?.(w));return Pn(()=>{g.current=!0,p&&(m.current=!0,window.MotionIsMounted=!0,p.updateFeatures(),p.scheduleRenderMicrotask(),k.current&&p.animationState&&p.animationState.animateChanges())}),y.useEffect(()=>{p&&(!k.current&&p.animationState&&p.animationState.animateChanges(),k.current&&(queueMicrotask(()=>{window.MotionHandoffMarkAsComplete?.(w)}),k.current=!1),p.enteringChildren=void 0)}),p}function Kf(e,t,n,i){const{layoutId:s,layout:r,drag:o,dragConstraints:a,layoutScroll:l,layoutRoot:c,layoutAnchor:u,layoutCrossfade:f}=t;e.projection=new n(e.latestValues,t["data-framer-portal-id"]?void 0:kl(e.parent)),e.projection.setOptions({layoutId:s,layout:r,alwaysMeasureLayout:!!o||a&&bt(a),visualElement:e,animationType:typeof r=="string"?r:"both",initialPromotionConfig:i,crossfade:f,layoutScroll:l,layoutRoot:c,layoutAnchor:u})}function kl(e){if(e)return e.options.allowProjection!==!1?e.projection:kl(e.parent)}function ri(e,{forwardMotionProps:t=!1,type:n}={},i,s){i&&Ef(i);const r=n?n==="svg":Vs(e),o=r?Wf:Hf;function a(c,u){let f;const h={...y.useContext(Ls),...c,layoutId:qf(c)},{isStatic:g,isValidProp:p}=h,b=Mf(c),m=o(c,g);if(!g&&typeof window<"u"){Qf();const w=Yf(h);f=w.MeasureLayout,b.visualElement=Uf(e,m,h,s,w.ProjectionNode,r)}return d.jsxs(Wn.Provider,{value:b,children:[f&&b.visualElement?d.jsx(f,{visualElement:b.visualElement,...h}):null,$f(e,c,Gf(m,b.visualElement,u),m,g,t,r,p)]})}a.displayName=`motion.${typeof e=="string"?e:`create(${e.displayName??e.name??""})`}`;const l=y.forwardRef(a);return l[zf]=e,l}function qf({layoutId:e}){const t=y.useContext(ls).id;return t&&e!==void 0?t+"-"+e:e}function Qf(e,t){y.useContext(gl).strict}function Yf(e){const t=yl(),{drag:n,layout:i}=t;if(!n&&!i)return{};const s={...n,...i};return{MeasureLayout:n?.isEnabled(e)||i?.isEnabled(e)?s.MeasureLayout:void 0,ProjectionNode:s.ProjectionNode}}function Xf(e,t){if(typeof Proxy>"u")return ri;const n=new Map,i=(r,o)=>ri(r,o,e,t),s=(r,o)=>i(r,o);return new Proxy(s,{get:(r,o)=>o==="create"?i:(n.has(o)||n.set(o,ri(o,void 0,e,t)),n.get(o))})}const Zf=(e,t)=>t.isSVG??Vs(e)?new Ad(t):new vd(t,{allowProjection:e!==y.Fragment});class Jf extends et{constructor(t){super(t),t.animationState||(t.animationState=Od(t))}updateAnimationControlsSubscription(){const{animate:t}=this.node.getProps();_n(t)&&(this.unmountControls=t.subscribe(this.node))}mount(){this.updateAnimationControlsSubscription()}update(){const{animate:t}=this.node.getProps(),{animate:n}=this.node.prevProps||{};t!==n&&this.updateAnimationControlsSubscription()}unmount(){this.node.animationState.reset(),this.unmountControls?.()}}let ep=0;class tp extends et{constructor(){super(...arguments),this.id=ep++,this.isExitComplete=!1}update(){if(!this.node.presenceContext)return;const{isPresent:t,onExitComplete:n}=this.node.presenceContext,{isPresent:i}=this.node.prevPresenceContext||{};if(!this.node.animationState||t===i)return;if(t&&i===!1){if(this.isExitComplete){const{initial:r,custom:o}=this.node.getProps();if(typeof r=="string"||typeof r=="object"&&r!==null&&!Array.isArray(r)){const a=lt(this.node,r,o);if(a){const{transition:l,transitionEnd:c,...u}=a;for(const f in u)this.node.getValue(f)?.jump(u[f])}}this.node.animationState.reset(),this.node.animationState.animateChanges()}else this.node.animationState.setActive("exit",!1);this.isExitComplete=!1;return}const s=this.node.animationState.setActive("exit",!t);n&&!t&&s.then(()=>{this.isExitComplete=!0,n(this.id)})}mount(){const{register:t,onExitComplete:n}=this.node.presenceContext||{};n&&n(this.id),t&&(this.unmount=t(this.id))}unmount(){}}const np={animation:{Feature:Jf},exit:{Feature:tp}};function Kt(e){return{point:{x:e.pageX,y:e.pageY}}}const ip=e=>t=>Es(t)&&e(t,Kt(t));function Nt(e,t,n,i){return Ht(e,t,ip(n),i)}const Tl=({current:e})=>e?e.ownerDocument.defaultView:null,sr=(e,t)=>Math.abs(e-t);function sp(e,t){const n=sr(e.x,t.x),i=sr(e.y,t.y);return Math.sqrt(n**2+i**2)}const or=new Set(["auto","scroll"]);class Sl{constructor(t,n,{transformPagePoint:i,contextWindow:s=window,dragSnapToOrigin:r=!1,distanceThreshold:o=3,element:a}={}){if(this.startEvent=null,this.lastMoveEvent=null,this.lastMoveEventInfo=null,this.lastRawMoveEventInfo=null,this.handlers={},this.contextWindow=window,this.scrollPositions=new Map,this.removeScrollListeners=null,this.onElementScroll=p=>{this.handleScroll(p.target)},this.onWindowScroll=()=>{this.handleScroll(window)},this.updatePoint=()=>{if(!(this.lastMoveEvent&&this.lastMoveEventInfo))return;this.lastRawMoveEventInfo&&(this.lastMoveEventInfo=sn(this.lastRawMoveEventInfo,this.transformPagePoint));const p=ai(this.lastMoveEventInfo,this.history),b=this.startEvent!==null,m=sp(p.offset,{x:0,y:0})>=this.distanceThreshold;if(!b&&!m)return;const{point:w}=p,{timestamp:k}=ge;this.history.push({...w,timestamp:k});const{onStart:v,onMove:x}=this.handlers;b||(v&&v(this.lastMoveEvent,p),this.startEvent=this.lastMoveEvent),x&&x(this.lastMoveEvent,p)},this.handlePointerMove=(p,b)=>{this.lastMoveEvent=p,this.lastRawMoveEventInfo=b,this.lastMoveEventInfo=sn(b,this.transformPagePoint),te.update(this.updatePoint,!0)},this.handlePointerUp=(p,b)=>{this.end();const{onEnd:m,onSessionEnd:w,resumeAnimation:k}=this.handlers;if((this.dragSnapToOrigin||!this.startEvent)&&k&&k(),!(this.lastMoveEvent&&this.lastMoveEventInfo))return;const v=ai(p.type==="pointercancel"?this.lastMoveEventInfo:sn(b,this.transformPagePoint),this.history);this.startEvent&&m&&m(p,v),w&&w(p,v)},!Es(t))return;this.dragSnapToOrigin=r,this.handlers=n,this.transformPagePoint=i,this.distanceThreshold=o,this.contextWindow=s||window;const l=Kt(t),c=sn(l,this.transformPagePoint),{point:u}=c,{timestamp:f}=ge;this.history=[{...u,timestamp:f}];const{onSessionStart:h}=n;h&&h(t,ai(c,this.history));const g={passive:!0,capture:!0};this.removeListeners=zt(Nt(this.contextWindow,"pointermove",this.handlePointerMove,g),Nt(this.contextWindow,"pointerup",this.handlePointerUp,g),Nt(this.contextWindow,"pointercancel",this.handlePointerUp,g)),a&&this.startScrollTracking(a)}startScrollTracking(t){let n=t.parentElement;for(;n;){const i=getComputedStyle(n);(or.has(i.overflowX)||or.has(i.overflowY))&&this.scrollPositions.set(n,{x:n.scrollLeft,y:n.scrollTop}),n=n.parentElement}this.scrollPositions.set(window,{x:window.scrollX,y:window.scrollY}),window.addEventListener("scroll",this.onElementScroll,{capture:!0}),window.addEventListener("scroll",this.onWindowScroll),this.removeScrollListeners=()=>{window.removeEventListener("scroll",this.onElementScroll,{capture:!0}),window.removeEventListener("scroll",this.onWindowScroll)}}handleScroll(t){const n=this.scrollPositions.get(t);if(!n)return;const i=t===window,s=i?{x:window.scrollX,y:window.scrollY}:{x:t.scrollLeft,y:t.scrollTop},r={x:s.x-n.x,y:s.y-n.y};r.x===0&&r.y===0||(i?this.lastMoveEventInfo&&(this.lastMoveEventInfo.point.x+=r.x,this.lastMoveEventInfo.point.y+=r.y):this.history.length>0&&(this.history[0].x-=r.x,this.history[0].y-=r.y),this.scrollPositions.set(t,s),te.update(this.updatePoint,!0))}updateHandlers(t){this.handlers=t}end(){this.removeListeners&&this.removeListeners(),this.removeScrollListeners&&this.removeScrollListeners(),this.scrollPositions.clear(),Je(this.updatePoint)}}function sn(e,t){return t?{point:t(e.point)}:e}function rr(e,t){return{x:e.x-t.x,y:e.y-t.y}}function ai({point:e},t){return{point:e,delta:rr(e,Cl(t)),offset:rr(e,op(t)),velocity:rp(t,.1)}}function op(e){return e[0]}function Cl(e){return e[e.length-1]}function rp(e,t){if(e.length<2)return{x:0,y:0};let n=e.length-1,i=null;const s=Cl(e);for(;n>=0&&(i=e[n],!(s.timestamp-i.timestamp>je(t)));)n--;if(!i)return{x:0,y:0};i===e[0]&&e.length>2&&s.timestamp-i.timestamp>je(t)*2&&(i=e[1]);const r=Oe(s.timestamp-i.timestamp);if(r===0)return{x:0,y:0};const o={x:(s.x-i.x)/r,y:(s.y-i.y)/r};return o.x===1/0&&(o.x=0),o.y===1/0&&(o.y=0),o}function ap(e,{min:t,max:n},i){return t!==void 0&&e<t?e=i?ee(t,e,i.min):Math.max(e,t):n!==void 0&&e>n&&(e=i?ee(n,e,i.max):Math.min(e,n)),e}function ar(e,t,n){return{min:t!==void 0?e.min+t:void 0,max:n!==void 0?e.max+n-(e.max-e.min):void 0}}function lp(e,{top:t,left:n,bottom:i,right:s}){return{x:ar(e.x,n,s),y:ar(e.y,t,i)}}function lr(e,t){let n=t.min-e.min,i=t.max-e.max;return t.max-t.min<e.max-e.min&&([n,i]=[i,n]),{min:n,max:i}}function cp(e,t){return{x:lr(e.x,t.x),y:lr(e.y,t.y)}}function up(e,t){let n=.5;const i=Te(e),s=Te(t);return s>i?n=$t(t.min,t.max-i,e.min):i>s&&(n=$t(e.min,e.max-s,t.min)),Ge(0,1,n)}function hp(e,t){const n={};return t.min!==void 0&&(n.min=t.min-e.min),t.max!==void 0&&(n.max=t.max-e.min),n}const Ji=.35;function dp(e=Ji){return e===!1?e=0:e===!0&&(e=Ji),{x:cr(e,"left","right"),y:cr(e,"top","bottom")}}function cr(e,t,n){return{min:ur(e,t),max:ur(e,n)}}function ur(e,t){return typeof e=="number"?e:e[t]||0}const fp=new WeakMap;class pp{constructor(t){this.openDragLock=null,this.isDragging=!1,this.currentDirection=null,this.originPoint={x:0,y:0},this.constraints=!1,this.hasMutatedConstraints=!1,this.elastic=he(),this.latestPointerEvent=null,this.latestPanInfo=null,this.visualElement=t}start(t,{snapToCursor:n=!1,distanceThreshold:i}={}){const{presenceContext:s}=this.visualElement;if(s&&s.isPresent===!1)return;const r=f=>{n&&this.snapToCursor(Kt(f).point),this.stopAnimation()},o=(f,h)=>{const{drag:g,dragPropagation:p,onDragStart:b}=this.getProps();if(g&&!p&&(this.openDragLock&&this.openDragLock(),this.openDragLock=Fh(g),!this.openDragLock))return;this.latestPointerEvent=f,this.latestPanInfo=h,this.isDragging=!0,this.currentDirection=null,this.resolveConstraints(),this.visualElement.projection&&(this.visualElement.projection.isAnimationBlocked=!0,this.visualElement.projection.target=void 0),Fe(w=>{let k=this.getAxisMotionValue(w).get()||0;if(ze.test(k)){const{projection:v}=this.visualElement;if(v&&v.layout){const x=v.layout.layoutBox[w];x&&(k=Te(x)*(parseFloat(k)/100))}}this.originPoint[w]=k}),b&&te.update(()=>b(f,h),!1,!0),Wi(this.visualElement,"transform");const{animationState:m}=this.visualElement;m&&m.setActive("whileDrag",!0)},a=(f,h)=>{this.latestPointerEvent=f,this.latestPanInfo=h;const{dragPropagation:g,dragDirectionLock:p,onDirectionLock:b,onDrag:m}=this.getProps();if(!g&&!this.openDragLock)return;const{offset:w}=h;if(p&&this.currentDirection===null){this.currentDirection=gp(w),this.currentDirection!==null&&b&&b(this.currentDirection);return}this.updateAxis("x",h.point,w),this.updateAxis("y",h.point,w),this.visualElement.render(),m&&te.update(()=>m(f,h),!1,!0)},l=(f,h)=>{this.latestPointerEvent=f,this.latestPanInfo=h,this.stop(f,h),this.latestPointerEvent=null,this.latestPanInfo=null},c=()=>{const{dragSnapToOrigin:f}=this.getProps();(f||this.constraints)&&this.startAnimation({x:0,y:0})},{dragSnapToOrigin:u}=this.getProps();this.panSession=new Sl(t,{onSessionStart:r,onStart:o,onMove:a,onSessionEnd:l,resumeAnimation:c},{transformPagePoint:this.visualElement.getTransformPagePoint(),dragSnapToOrigin:u,distanceThreshold:i,contextWindow:Tl(this.visualElement),element:this.visualElement.current})}stop(t,n){const i=t||this.latestPointerEvent,s=n||this.latestPanInfo,r=this.isDragging;if(this.cancel(),!r||!s||!i)return;const{velocity:o}=s;this.startAnimation(o);const{onDragEnd:a}=this.getProps();a&&te.postRender(()=>a(i,s))}cancel(){this.isDragging=!1;const{projection:t,animationState:n}=this.visualElement;t&&(t.isAnimationBlocked=!1),this.endPanSession();const{dragPropagation:i}=this.getProps();!i&&this.openDragLock&&(this.openDragLock(),this.openDragLock=null),n&&n.setActive("whileDrag",!1)}endPanSession(){this.panSession&&this.panSession.end(),this.panSession=void 0}updateAxis(t,n,i){const{drag:s}=this.getProps();if(!i||!on(t,s,this.currentDirection))return;const r=this.getAxisMotionValue(t);let o=this.originPoint[t]+i[t];this.constraints&&this.constraints[t]&&(o=ap(o,this.constraints[t],this.elastic[t])),r.set(o)}resolveConstraints(){const{dragConstraints:t,dragElastic:n}=this.getProps(),i=this.visualElement.projection&&!this.visualElement.projection.layout?this.visualElement.projection.measure(!1):this.visualElement.projection?.layout,s=this.constraints;t&&bt(t)?this.constraints||(this.constraints=this.resolveRefConstraints()):t&&i?this.constraints=lp(i.layoutBox,t):this.constraints=!1,this.elastic=dp(n),s!==this.constraints&&!bt(t)&&i&&this.constraints&&!this.hasMutatedConstraints&&Fe(r=>{this.constraints!==!1&&this.getAxisMotionValue(r)&&(this.constraints[r]=hp(i.layoutBox[r],this.constraints[r]))})}resolveRefConstraints(){const{dragConstraints:t,onMeasureDragConstraints:n}=this.getProps();if(!t||!bt(t))return!1;const i=t.current,{projection:s}=this.visualElement;if(!s||!s.layout)return!1;s.root&&(s.root.scroll=void 0,s.root.updateScroll());const r=md(i,s.root,this.visualElement.getTransformPagePoint());let o=cp(s.layout.layoutBox,r);if(n){const a=n(dd(o));this.hasMutatedConstraints=!!a,a&&(o=Ka(a))}return o}startAnimation(t){const{drag:n,dragMomentum:i,dragElastic:s,dragTransition:r,dragSnapToOrigin:o,onDragTransitionEnd:a}=this.getProps(),l=this.constraints||{},c=Fe(u=>{if(!on(u,n,this.currentDirection))return;let f=l&&l[u]||{};(o===!0||o===u)&&(f={min:0,max:0});const h=s?200:1e6,g=s?40:1e7,p={type:"inertia",velocity:i?t[u]:0,bounceStiffness:h,bounceDamping:g,timeConstant:750,restDelta:1,restSpeed:10,...r,...f};return this.startAxisValueAnimation(u,p)});return Promise.all(c).then(a)}startAxisValueAnimation(t,n){const i=this.getAxisMotionValue(t);return Wi(this.visualElement,t),i.start(Ts(t,i,0,n,this.visualElement,!1))}stopAnimation(){Fe(t=>this.getAxisMotionValue(t).stop())}getAxisMotionValue(t){const n=`_drag${t.toUpperCase()}`,s=this.visualElement.getProps()[n];return s||this.visualElement.getValue(t,this.visualElement.latestValues[t]??0)}snapToCursor(t){Fe(n=>{const{drag:i}=this.getProps();if(!on(n,i,this.currentDirection))return;const{projection:s}=this.visualElement,r=this.getAxisMotionValue(n);if(s&&s.layout){const{min:o,max:a}=s.layout.layoutBox[n],l=r.get()||0;r.set(t[n]-ee(o,a,.5)+l)}})}scalePositionWithinConstraints(){if(!this.visualElement.current)return;const{drag:t,dragConstraints:n}=this.getProps(),{projection:i}=this.visualElement;if(!bt(n)||!i||!this.constraints)return;this.stopAnimation();const s={x:0,y:0};Fe(o=>{const a=this.getAxisMotionValue(o);if(a&&this.constraints!==!1){const l=a.get();s[o]=up({min:l,max:l},this.constraints[o])}});const{transformTemplate:r}=this.visualElement.getProps();this.visualElement.current.style.transform=r?r({},""):"none",i.root&&i.root.updateScroll(),i.updateLayout(),this.constraints=!1,this.resolveConstraints(),Fe(o=>{if(!on(o,t,null))return;const a=this.getAxisMotionValue(o),{min:l,max:c}=this.constraints[o];a.set(ee(l,c,s[o]))}),this.visualElement.render()}addListeners(){if(!this.visualElement.current)return;fp.set(this.visualElement,this);const t=this.visualElement.current,n=Nt(t,"pointerdown",c=>{const{drag:u,dragListener:f=!0}=this.getProps(),h=c.target,g=h!==t&&Uh(h);u&&f&&!g&&this.start(c)});let i;const s=()=>{const{dragConstraints:c}=this.getProps();bt(c)&&c.current&&(this.constraints=this.resolveRefConstraints(),i||(i=mp(t,c.current,()=>this.scalePositionWithinConstraints())))},{projection:r}=this.visualElement,o=r.addEventListener("measure",s);r&&!r.layout&&(r.root&&r.root.updateScroll(),r.updateLayout()),te.read(s);const a=Ht(window,"resize",()=>this.scalePositionWithinConstraints()),l=r.addEventListener("didUpdate",(({delta:c,hasLayoutChanged:u})=>{this.isDragging&&u&&(Fe(f=>{const h=this.getAxisMotionValue(f);h&&(this.originPoint[f]+=c[f].translate,h.set(h.get()+c[f].translate))}),this.visualElement.render())}));return()=>{a(),n(),o(),l&&l(),i&&i()}}getProps(){const t=this.visualElement.getProps(),{drag:n=!1,dragDirectionLock:i=!1,dragPropagation:s=!1,dragConstraints:r=!1,dragElastic:o=Ji,dragMomentum:a=!0}=t;return{...t,drag:n,dragDirectionLock:i,dragPropagation:s,dragConstraints:r,dragElastic:o,dragMomentum:a}}}function hr(e){let t=!0;return()=>{if(t){t=!1;return}e()}}function mp(e,t,n){const i=bo(e,hr(n)),s=bo(t,hr(n));return()=>{i(),s()}}function on(e,t,n){return(t===!0||t===e)&&(n===null||n===e)}function gp(e,t=10){let n=null;return Math.abs(e.y)>t?n="y":Math.abs(e.x)>t&&(n="x"),n}class yp extends et{constructor(t){super(t),this.removeGroupControls=Re,this.removeListeners=Re,this.controls=new pp(t)}mount(){const{dragControls:t}=this.node.getProps();t&&(this.removeGroupControls=t.subscribe(this.controls)),this.removeListeners=this.controls.addListeners()||Re}update(){const{dragControls:t}=this.node.getProps(),{dragControls:n}=this.node.prevProps||{};t!==n&&(this.removeGroupControls(),t&&(this.removeGroupControls=t.subscribe(this.controls)))}unmount(){this.removeGroupControls(),this.removeListeners(),this.controls.isDragging||this.controls.endPanSession()}}const li=e=>(t,n)=>{e&&te.update(()=>e(t,n),!1,!0)};class bp extends et{constructor(){super(...arguments),this.removePointerDownListener=Re}onPointerDown(t){this.session=new Sl(t,this.createPanHandlers(),{transformPagePoint:this.node.getTransformPagePoint(),contextWindow:Tl(this.node)})}createPanHandlers(){const{onPanSessionStart:t,onPanStart:n,onPan:i,onPanEnd:s}=this.node.getProps();return{onSessionStart:li(t),onStart:li(n),onMove:li(i),onEnd:(r,o)=>{delete this.session,s&&te.postRender(()=>s(r,o))}}}mount(){this.removePointerDownListener=Nt(this.node.current,"pointerdown",t=>this.onPointerDown(t))}update(){this.session&&this.session.updateHandlers(this.createPanHandlers())}unmount(){this.removePointerDownListener(),this.session&&this.session.end()}}let ci=!1;class wp extends y.Component{componentDidMount(){const{visualElement:t,layoutGroup:n,switchLayoutGroup:i,layoutId:s}=this.props,{projection:r}=t;r&&(n.group&&n.group.add(r),i&&i.register&&s&&i.register(r),ci&&r.root.didUpdate(),r.addEventListener("animationComplete",()=>{this.safeToRemove()}),r.setOptions({...r.options,layoutDependency:this.props.layoutDependency,onExitComplete:()=>this.safeToRemove()})),Tn.hasEverUpdated=!0}getSnapshotBeforeUpdate(t){const{layoutDependency:n,visualElement:i,drag:s,isPresent:r}=this.props,{projection:o}=i;return o&&(o.isPresent=r,t.layoutDependency!==n&&o.setOptions({...o.options,layoutDependency:n}),ci=!0,s||t.layoutDependency!==n||n===void 0||t.isPresent!==r?o.willUpdate():this.safeToRemove(),t.isPresent!==r&&(r?o.promote():o.relegate()||te.postRender(()=>{const a=o.getStack();(!a||!a.members.length)&&this.safeToRemove()}))),null}componentDidUpdate(){const{visualElement:t,layoutAnchor:n}=this.props,{projection:i}=t;i&&(i.options.layoutAnchor=n,i.root.didUpdate(),Ps.postRender(()=>{!i.currentAnimation&&i.isLead()&&this.safeToRemove()}))}componentWillUnmount(){const{visualElement:t,layoutGroup:n,switchLayoutGroup:i}=this.props,{projection:s}=t;ci=!0,s&&(s.scheduleCheckAfterUnmount(),n&&n.group&&n.group.remove(s),i&&i.deregister&&i.deregister(s))}safeToRemove(){const{safeToRemove:t}=this.props;t&&t()}render(){return null}}function Al(e){const[t,n]=ml(),i=y.useContext(ls);return d.jsx(wp,{...e,layoutGroup:i,switchLayoutGroup:y.useContext(vl),isPresent:t,safeToRemove:n})}const xp={pan:{Feature:bp},drag:{Feature:yp,ProjectionNode:pl,MeasureLayout:Al}};function dr(e,t,n){const{props:i}=e;e.animationState&&i.whileHover&&e.animationState.setActive("whileHover",n==="Start");const s="onHover"+n,r=i[s];r&&te.postRender(()=>r(t,Kt(t)))}class vp extends et{mount(){const{current:t}=this.node;t&&(this.unmount=Hh(t,(n,i)=>(dr(this.node,i,"Start"),s=>dr(this.node,s,"End"))))}unmount(){}}class kp extends et{constructor(){super(...arguments),this.isActive=!1}onFocus(){let t=!1;try{t=this.node.current.matches(":focus-visible")}catch{t=!0}!t||!this.node.animationState||(this.node.animationState.setActive("whileFocus",!0),this.isActive=!0)}onBlur(){!this.isActive||!this.node.animationState||(this.node.animationState.setActive("whileFocus",!1),this.isActive=!1)}mount(){this.unmount=zt(Ht(this.node.current,"focus",()=>this.onFocus()),Ht(this.node.current,"blur",()=>this.onBlur()))}unmount(){}}function fr(e,t,n){const{props:i}=e;if(e.current instanceof HTMLButtonElement&&e.current.disabled)return;e.animationState&&i.whileTap&&e.animationState.setActive("whileTap",n==="Start");const s="onTap"+(n==="End"?"":n),r=i[s];r&&te.postRender(()=>r(t,Kt(t)))}class Tp extends et{mount(){const{current:t}=this.node;if(!t)return;const{globalTapTarget:n,propagate:i}=this.node.props;this.unmount=qh(t,(s,r)=>(fr(this.node,r,"Start"),(o,{success:a})=>fr(this.node,o,a?"End":"Cancel")),{useGlobalTarget:n,stopPropagation:i?.tap===!1})}unmount(){}}const es=new WeakMap,ui=new WeakMap,Sp=e=>{const t=es.get(e.target);t&&t(e)},Cp=e=>{e.forEach(Sp)};function Ap({root:e,...t}){const n=e||document;ui.has(n)||ui.set(n,{});const i=ui.get(n),s=JSON.stringify(t);return i[s]||(i[s]=new IntersectionObserver(Cp,{root:e,...t})),i[s]}function Pp(e,t,n){const i=Ap(t);return es.set(e,n),i.observe(e),()=>{es.delete(e),i.unobserve(e)}}const Ep={some:0,all:1};class Dp extends et{constructor(){super(...arguments),this.hasEnteredView=!1,this.isInView=!1}startObserver(){this.stopObserver?.();const{viewport:t={}}=this.node.getProps(),{root:n,margin:i,amount:s="some",once:r}=t,o={root:n?n.current:void 0,rootMargin:i,threshold:typeof s=="number"?s:Ep[s]},a=l=>{const{isIntersecting:c}=l;if(this.isInView===c||(this.isInView=c,r&&!c&&this.hasEnteredView))return;c&&(this.hasEnteredView=!0),this.node.animationState&&this.node.animationState.setActive("whileInView",c);const{onViewportEnter:u,onViewportLeave:f}=this.node.getProps(),h=c?u:f;h&&h(l)};this.stopObserver=Pp(this.node.current,o,a)}mount(){this.startObserver()}update(){if(typeof IntersectionObserver>"u")return;const{props:t,prevProps:n}=this.node;["amount","margin","root"].some(Mp(t,n))&&this.startObserver()}unmount(){this.stopObserver?.(),this.hasEnteredView=!1,this.isInView=!1}}function Mp({viewport:e={}},{viewport:t={}}={}){return n=>e[n]!==t[n]}const Op={inView:{Feature:Dp},tap:{Feature:Tp},focus:{Feature:kp},hover:{Feature:vp}},Rp={layout:{ProjectionNode:pl,MeasureLayout:Al}},jp={...np,...Op,...xp,...Rp},Lp=Xf(jp,Zf),Np=Lp,ie={head:{len:18,span:12},secondaryScale:.85,gap:0,stroke:{own:1.4,ownHover:2.6,refFactor:.75},dash:"5 4",kinds:{"own-fwd":Qs["own-fwd"],"own-bkwd":Qs["own-bkwd"],association:{color:Ke.association,heads:"both",headDirection:"forward",dashed:!0,secondary:!0,label:"A and B are associated"}}};function Vp(e){return e==="forward"?"M0,0 L10,3.5 L0,7 Z":"M10,0 L0,3.5 L10,7 Z"}function Sn(e,t=1){const{len:n,span:i}=ie.head;return{viewBox:"0 0 10 7",refX:0,refY:3.5,markerWidth:n*t,markerHeight:i*t,markerUnits:"userSpaceOnUse",orient:"auto-start-reverse",d:Vp(e)}}function pr(e){const t=ie.kinds[e].secondary?ie.secondaryScale:1;return ie.head.len*t+ie.gap}function rn(e){throw new Error('Could not dynamically require "'+e+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var hi={exports:{}},mr;function Ip(){return mr||(mr=1,(function(e,t){(function(n){e.exports=n()})(function(){return(function(){function n(i,s,r){function o(c,u){if(!s[c]){if(!i[c]){var f=typeof rn=="function"&&rn;if(!u&&f)return f(c,!0);if(a)return a(c,!0);var h=new Error("Cannot find module '"+c+"'");throw h.code="MODULE_NOT_FOUND",h}var g=s[c]={exports:{}};i[c][0].call(g.exports,function(p){var b=i[c][1][p];return o(b||p)},g,g.exports,n,i,s,r)}return s[c].exports}for(var a=typeof rn=="function"&&rn,l=0;l<r.length;l++)o(r[l]);return o}return n})()({1:[function(n,i,s){Object.defineProperty(s,"__esModule",{value:!0}),s.default=void 0;function r(h){"@babel/helpers - typeof";return r=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(g){return typeof g}:function(g){return g&&typeof Symbol=="function"&&g.constructor===Symbol&&g!==Symbol.prototype?"symbol":typeof g},r(h)}function o(h,g){if(!(h instanceof g))throw new TypeError("Cannot call a class as a function")}function a(h,g){for(var p=0;p<g.length;p++){var b=g[p];b.enumerable=b.enumerable||!1,b.configurable=!0,"value"in b&&(b.writable=!0),Object.defineProperty(h,c(b.key),b)}}function l(h,g,p){return g&&a(h.prototype,g),Object.defineProperty(h,"prototype",{writable:!1}),h}function c(h){var g=u(h,"string");return r(g)=="symbol"?g:g+""}function u(h,g){if(r(h)!="object"||!h)return h;var p=h[Symbol.toPrimitive];if(p!==void 0){var b=p.call(h,g);if(r(b)!="object")return b;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(h)}s.default=(function(){function h(){var g=this,p=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},b=p.defaultLayoutOptions,m=b===void 0?{}:b,w=p.algorithms,k=w===void 0?["layered","stress","mrtree","radial","force","disco","sporeOverlap","sporeCompaction","rectpacking"]:w,v=p.workerFactory,x=p.workerUrl;if(o(this,h),this.defaultLayoutOptions=m,this.initialized=!1,typeof x>"u"&&typeof v>"u")throw new Error("Cannot construct an ELK without both 'workerUrl' and 'workerFactory'.");var C=v;typeof x<"u"&&typeof v>"u"&&(C=function(P){return new Worker(P)});var D=C(x);if(typeof D.postMessage!="function")throw new TypeError("Created worker does not provide the required 'postMessage' function.");this.worker=new f(D),this.worker.postMessage({cmd:"register",algorithms:k}).then(function(T){return g.initialized=!0}).catch(console.err)}return l(h,[{key:"layout",value:function(p){var b=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},m=b.layoutOptions,w=m===void 0?this.defaultLayoutOptions:m,k=b.logging,v=k===void 0?!1:k,x=b.measureExecutionTime,C=x===void 0?!1:x;return p?this.worker.postMessage({cmd:"layout",graph:p,layoutOptions:w,options:{logging:v,measureExecutionTime:C}}):Promise.reject(new Error("Missing mandatory parameter 'graph'."))}},{key:"knownLayoutAlgorithms",value:function(){return this.worker.postMessage({cmd:"algorithms"})}},{key:"knownLayoutOptions",value:function(){return this.worker.postMessage({cmd:"options"})}},{key:"knownLayoutCategories",value:function(){return this.worker.postMessage({cmd:"categories"})}},{key:"terminateWorker",value:function(){this.worker&&this.worker.terminate()}}])})();var f=(function(){function h(g){var p=this;if(o(this,h),g===void 0)throw new Error("Missing mandatory parameter 'worker'.");this.resolvers={},this.worker=g,this.worker.onmessage=function(b){setTimeout(function(){p.receive(p,b)},0)}}return l(h,[{key:"postMessage",value:function(p){var b=this.id||0;this.id=b+1,p.id=b;var m=this;return new Promise(function(w,k){m.resolvers[b]=function(v,x){v?(m.convertGwtStyleError(v),k(v)):w(x)},m.worker.postMessage(p)})}},{key:"receive",value:function(p,b){var m=b.data,w=p.resolvers[m.id];w&&(delete p.resolvers[m.id],m.error?w(m.error):w(null,m.data))}},{key:"terminate",value:function(){this.worker&&this.worker.terminate()}},{key:"convertGwtStyleError",value:function(p){if(p){var b=p.__java$exception;b&&(b.cause&&b.cause.backingJsObject&&(p.cause=b.cause.backingJsObject,this.convertGwtStyleError(p.cause)),delete p.__java$exception)}}}])})()},{}],2:[function(n,i,s){var r=n("./elk-api.js").default;Object.defineProperty(i.exports,"__esModule",{value:!0}),i.exports=r,r.default=r},{"./elk-api.js":1}]},{},[2])(2)})})(hi)),hi.exports}var Bp=Ip();const $p=cc(Bp),Fp="/dynamic-model-var-docs/assets/elk-worker.min-r_yRvuMO.js";class _p{elk=null;ensure(){return this.elk||(this.elk=new $p({workerUrl:Fp})),this.elk}async layout(t,n={}){const{direction:i="DOWN",nodeSpacing:s=32,layerSpacing:r=56,usePartitions:o=!1,extraLayoutOptions:a={}}=n,l={id:"root",layoutOptions:{"elk.algorithm":"layered","elk.direction":i,"elk.spacing.nodeNode":String(s),"elk.layered.spacing.nodeNodeBetweenLayers":String(r),"elk.edgeRouting":"ORTHOGONAL","elk.layered.considerModelOrder.strategy":"NODES_AND_EDGES",...o?{"elk.partitioning.activate":"true"}:{},...a},children:t.nodes.map(m=>({id:m.id,width:m.width,height:m.height,...m.ports?.length?{ports:m.ports.map(w=>({id:w.id,x:w.x,y:w.y,width:0,height:0}))}:{},...o&&m.partition!==void 0||m.ports?.length?{layoutOptions:{...o&&m.partition!==void 0?{"elk.partitioning.partition":String(m.partition)}:{},...m.ports?.length?{"elk.portConstraints":"FIXED_POS"}:{}}}:{}})),edges:t.edges.filter(m=>m.source!==m.target).map(m=>({id:m.id,sources:[m.sourcePort??m.source],targets:[m.targetPort??m.target]}))},c=new Map(t.edges.map(m=>[m.id,m]));this.elk;const u=performance.now(),f=await this.ensure().layout(l);performance.now()-u,t.nodes.length,t.edges.length;const h=(f.children??[]).map(m=>({id:m.id,x:m.x??0,y:m.y??0,width:m.width??0,height:m.height??0})),g=(f.edges??[]).map(m=>{const w=c.get(m.id);if(!w)throw new Error(`ELK returned unknown edge id: ${m.id}`);return{id:m.id,source:w.source,target:w.target,sections:m.sections}}),p=Math.max(0,...h.map(m=>m.x+m.width)),b=Math.max(0,...h.map(m=>m.y+m.height));return{nodes:h,edges:g,width:p,height:b}}cancel(){this.elk&&(this.elk.terminateWorker(),this.elk=null)}dispose(){this.cancel()}}function an(e){if(!e?.length)return[];const t=e[0];return[t.startPoint,...t.bendPoints??[],t.endPoint]}function gr(e,t,n){const i=t.x-e.x,s=t.y-e.y,r=Math.hypot(i,s);if(r<1e-6)return{...e};const o=Math.min(n,r/2)/r;return{x:e.x+i*o,y:e.y+s*o}}function Hp(e,t){if(e.length<2)return Wp(e);let n=`M${e[0].x},${e[0].y}`;for(let s=1;s<e.length-1;s++){const r=gr(e[s],e[s-1],t),o=gr(e[s],e[s+1],t);n+=`L${r.x},${r.y}Q${e[s].x},${e[s].y} ${o.x},${o.y}`}const i=e[e.length-1];return`${n}L${i.x},${i.y}`}function Wp(e){return e.length?e.map((t,n)=>`${n===0?"M":"L"}${t.x},${t.y}`).join(""):""}function zp(e,t){let n=0,i=e.length-1,s=e[e.length-1];for(let r=e.length-1;r>0;r--){const o=Math.hypot(e[r].x-e[r-1].x,e[r].y-e[r-1].y);if(n+o>=t){const a=(t-n)/o;s={x:e[r].x+(e[r-1].x-e[r].x)*a,y:e[r].y+(e[r-1].y-e[r].y)*a},i=r-1;break}n+=o,i=r-1}return{cut:i,cutPoint:s}}function Gp(e,t,n,i){if(e.length<2||n<=0)return i(e);const{cut:s,cutPoint:r}=zp(e,n),o=e.slice(0,s+1),a=o[o.length-1],l=a&&Math.abs(a.x-r.x)<1e-6&&Math.abs(a.y-r.y)<1e-6;return i([...o,...l?[]:[r],t])}function Up(e,t=1.5){if(e.length<3)return e;const n=[e[0]];for(let i=1;i<e.length-1;i++){const s=n[n.length-1],r=e[i],o=e[i+1],a=o.x-s.x,l=o.y-s.y,c=Math.hypot(a,l);(c<1e-6?Math.hypot(r.x-s.x,r.y-s.y):Math.abs(l*r.x-a*r.y+o.x*s.y-o.y*s.x)/c)>t&&n.push(r)}return n.push(e[e.length-1]),n}function Kp(e,t,n,i){const s=Math.hypot(t.x,t.y)||1,r=t.x/s,o=t.y/s,a=-o,l=r,c=n/2,u={x:e.x+a*c,y:e.y+l*c},f={x:e.x-a*c,y:e.y-l*c},h={x:e.x+r*i,y:e.y+o*i};return`M${u.x},${u.y}L${h.x},${h.y}L${f.x},${f.y}Z`}function qp(e,t,n,i,s=16){const r={x:e.x+n.x*s,y:e.y+n.y*s},o={x:t.x+i.x*s,y:t.y+i.y*s},a=[e,r];if(Math.abs(n.x)>.5){const l=(r.x+o.x)/2;Math.abs(r.y-o.y)>.5&&a.push({x:l,y:r.y},{x:l,y:o.y})}else{const l=(r.y+o.y)/2;Math.abs(r.x-o.x)>.5&&a.push({x:r.x,y:l},{x:o.x,y:l})}return a.push(o,t),Up(a)}function Qp(e,t={}){const n=y.useRef(null);n.current||(n.current=new _p);const[i,s]=y.useState(null),[r,o]=y.useState(!1),a=JSON.stringify(t);y.useEffect(()=>{const u=n.current;if(!e||e.nodes.length===0){s(null),o(!1);return}let f=!1;return o(!0),u.layout(e,JSON.parse(a)).then(h=>{f||(s({spec:e,layout:h}),o(!1))},h=>{f||(o(!1),console.error("graph-core layout failed:",h))}),()=>{f=!0,u.cancel()}},[e,a]),y.useEffect(()=>()=>n.current?.dispose(),[]);const l=!!e&&e.nodes.length>0,c=!i||i.spec!==e;return{latest:i,inProgress:(r||c)&&l}}const Yp=300,Xp=100,Zp=200,Jp=75,em=250,tm=120,nm=200,im=[.65,0,.35,1],ln=e=>e/1e3,sm=()=>typeof window<"u"&&typeof window.matchMedia=="function"&&window.matchMedia("(prefers-reduced-motion: reduce)").matches,qt=e=>()=>sm()?0:e,Pl=qt(Yp),yr=qt(Xp),om=qt(Zp),rm=qt(Jp),am=qt(em),cn=()=>tm,br=.5;function lm(e={}){const{min:t=.2,max:n=2}=e,i=y.useRef(null),s=y.useRef(null),r=y.useRef(null),o=y.useRef(1),a=y.useRef({w:0,h:0}),l=y.useRef(null),c=y.useRef(null),u=y.useRef(!0),f=y.useRef(!0),h=y.useCallback(()=>{const v=i.current;return v?{x:v.clientWidth*br,y:v.clientHeight*br}:{x:0,y:0}},[]),g=y.useCallback(v=>{const x=s.current;if(x){const{x:C,y:D}=h();x.style.transition=v?`width ${v}ms, height ${v}ms`:"",x.style.padding=`${D}px ${C}px`,x.style.width=`${a.current.w*o.current+2*C}px`,x.style.height=`${a.current.h*o.current+2*D}px`}},[h]),p=y.useCallback((v,x)=>{o.current=Math.min(n,Math.max(t,v));const C=x?Pl():0;l.current&&cancelAnimationFrame(l.current),l.current=requestAnimationFrame(()=>{l.current=null;const D=r.current;D&&(D.style.transition=C?`transform ${C}ms`:"",D.style.transform=`scale(${o.current})`)}),c.current&&(clearTimeout(c.current),c.current=null),C?g(C):c.current=setTimeout(()=>{c.current=null,g(0)},100)},[t,n,g]),b=y.useCallback((v,x=!0)=>{u.current=!1,p(v,x)},[p]),m=y.useCallback(v=>b(o.current*v),[b]),w=y.useCallback((v,x)=>{a.current={w:v,h:x};const C=r.current;C&&(C.style.width=`${v}px`,C.style.height=`${x}px`,C.style.transformOrigin="0 0",C.style.transform=`scale(${o.current})`),g(0)},[g]),k=y.useCallback(()=>{const v=i.current,{w:x,h:C}=a.current;if(!v||!x||!C)return;u.current=!0;const D=!f.current;f.current=!1,p(Math.min(v.clientWidth/x,v.clientHeight/C,1),D),requestAnimationFrame(()=>{const{x:T,y:P}=h();typeof v.scrollTo=="function"?v.scrollTo({left:T,top:P,behavior:D?"smooth":"auto"}):(v.scrollLeft=T,v.scrollTop=P)})},[p,h]);return y.useEffect(()=>{const v=i.current;if(!v)return;const x=C=>{!C.ctrlKey&&!C.metaKey||(C.preventDefault(),b(o.current*(1-C.deltaY*.005),!1))};return v.addEventListener("wheel",x,{passive:!1}),()=>v.removeEventListener("wheel",x)},[b]),y.useEffect(()=>{const v=i.current;if(!v)return;let x=!1,C=0,D=0,T=0,P=0,E=!1;const L=_=>_ instanceof Element&&!_.closest("[data-pan-ignore]"),I=_=>{_.button!==0||!L(_.target)||(x=!0,E=!1,C=_.clientX,D=_.clientY,T=v.scrollLeft,P=v.scrollTop,v.style.cursor="grabbing")},B=_=>{if(!x)return;const S=_.clientX-C,z=_.clientY-D;!E&&Math.hypot(S,z)<3||(E||(E=!0,v.setPointerCapture(_.pointerId)),_.preventDefault(),v.scrollLeft=T-S,v.scrollTop=P-z)},O=_=>{x&&(x=!1,v.style.cursor="",v.hasPointerCapture(_.pointerId)&&v.releasePointerCapture(_.pointerId))};return v.addEventListener("pointerdown",I),v.addEventListener("pointermove",B),v.addEventListener("pointerup",O),v.addEventListener("pointercancel",O),()=>{v.removeEventListener("pointerdown",I),v.removeEventListener("pointermove",B),v.removeEventListener("pointerup",O),v.removeEventListener("pointercancel",O)}},[]),{containerRef:i,spacerRef:s,wrapperRef:r,applyZoom:b,zoomBy:m,zoomToFit:k,getZoom:()=>o.current,isAutoFit:()=>u.current,setContentSize:w}}const cm=2,um=.5;function In({kind:e,width:t=44,className:n}){const i=y.useId().replace(/:/g,""),s=ie.kinds[e],r=um*(s.secondary?ie.secondaryScale:1),{d:o,...a}=Sn(s.headDirection,r),l=a.markerWidth,c=`es-${i}`,u=s.heads==="both"?1+l:1,f=t-1-l;return d.jsxs("svg",{width:t,height:"14",viewBox:`0 0 ${t} 14`,className:`shrink-0 ${n??""}`,"aria-hidden":!0,children:[d.jsx("defs",{children:d.jsx("marker",{id:c,...a,children:d.jsx("path",{d:o,fill:s.color})})}),d.jsx("line",{x1:u,y1:"7",x2:f,y2:"7",stroke:s.color,strokeWidth:cm,strokeDasharray:s.dashed?ie.dash:void 0,markerStart:s.heads==="both"?`url(#${c})`:void 0,markerEnd:`url(#${c})`})]})}const El={"owned-mine":{side:"left",kind:"own-bkwd"},"owned-theirs":{side:"left",kind:"own-fwd"},"owns-mine":{side:"right",kind:"own-fwd"},"owns-theirs":{side:"right",kind:"own-bkwd"},association:{side:"left",kind:"association"}},hm=300,ts=new Set;let Vt;function Is(){Vt!==void 0&&(clearTimeout(Vt),Vt=void 0)}function Mt(e){Is();for(const t of ts)t(e)}function Dl(){Is(),Vt=setTimeout(()=>{Vt=void 0,Mt(null)},hm)}function dm({label:e,rows:t,onAdd:n,onRemove:i,onInspect:s,colorOf:r,slotOrder:o,parentOf:a}){const[l,c]=y.useState(null),[u,f]=y.useState(null),h=y.useRef(null),g=y.useRef(null),p=y.useId();y.useEffect(()=>{const C=D=>{D!==p&&(c(null),f(null))};return ts.add(C),()=>{ts.delete(C)}},[p]),y.useEffect(()=>{if(!l)return;const C=T=>{T.target?.closest("[data-relation-bar]")||Mt(null)},D=T=>{T.key==="Escape"&&Mt(null)};return document.addEventListener("mousedown",C,!0),document.addEventListener("keydown",D),()=>{document.removeEventListener("mousedown",C,!0),document.removeEventListener("keydown",D)}},[l]);const b=C=>t.filter(D=>El[D.position].side===C),m=C=>new Set(b(C).map(D=>D.other)).size,w=m("left"),k=m("right");if(w===0&&k===0)return null;const v=(C,D)=>{const T=D?.getBoundingClientRect();T&&(Mt(p),c(C),f({x:T.left,y:T.bottom+2}))},x=(C,D,T)=>{const P=l===C;return d.jsx("button",{ref:T,"data-relation-bar":!0,"data-no-drag":!0,disabled:D===0,"aria-label":C==="left"?`${D} classes ${e} belongs to`:`${D} classes ${e} owns`,onMouseEnter:()=>D>0&&v(C,T.current),onMouseLeave:Dl,onClick:E=>{E.stopPropagation(),D!==0&&(P?Mt(null):v(C,T.current))},className:`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] leading-none
                    tabular-nums transition-colors
                    ${D===0?"text-gray-300 dark:text-slate-600 cursor-default":P?"bg-sky-200 dark:bg-sky-800 text-sky-900 dark:text-sky-100":"text-sky-800 dark:text-sky-200 hover:bg-sky-100 dark:hover:bg-sky-900"}`,children:C==="left"?d.jsxs(d.Fragment,{children:[d.jsx("span",{"aria-hidden":!0,children:"←"}),D]}):d.jsxs(d.Fragment,{children:[D,d.jsx("span",{"aria-hidden":!0,children:"→"})]})})};return d.jsxs(d.Fragment,{children:[x("left",w,h),d.jsx("span",{className:`flex-1 min-w-0 text-center text-[9px] text-gray-400
                       dark:text-slate-500 truncate select-none`,children:"related"}),x("right",k,g),l&&u&&Br.createPortal(d.jsx(pm,{anchor:u,side:l,label:e,rows:b(l),onAdd:n,onRemove:i,onInspect:s,colorOf:r,slotOrder:o,parentOf:a}),document.body)]})}function fm(e){const t=y.useRef(null),[n,i]=y.useState(e);return y.useEffect(()=>{const s=t.current;if(!s)return;const r=s.getBoundingClientRect(),o=8;i({x:Math.max(o,Math.min(e.x,window.innerWidth-r.width-o)),y:Math.max(o,Math.min(e.y,window.innerHeight-r.height-o))})},[e]),{ref:t,pos:n}}function pm({anchor:e,side:t,label:n,rows:i,onAdd:s,onRemove:r,onInspect:o,colorOf:a,slotOrder:l,parentOf:c}){const{ref:u,pos:f}=fm(e),h=x=>{const C=l?.indexOf(x.slot)??-1;return C===-1?Number.MAX_SAFE_INTEGER:C},g=[...i].sort((x,C)=>h(x)-h(C)||x.other.localeCompare(C.other)||x.slot.localeCompare(C.slot)),p=new Map,b=new Set;if(c){const x=new Map(g.map(C=>[`${C.slot}|${C.other}`,C]));for(const C of g){const D=c(C.other),T=D===void 0?void 0:x.get(`${C.slot}|${D}`);if(!T||T===C)continue;b.add(C);const P=`${C.slot}|${D}`;p.set(P,[...p.get(P)??[],C])}}const m=[],w=(x,C)=>{m.push({row:x,depth:C});for(const D of p.get(`${x.slot}|${x.other}`)??[])w(D,C+1)};for(const x of g)b.has(x)||w(x,0);const k=g.every(x=>x.drawn),v=[...new Set(g.map(x=>x.other))];return d.jsxs("div",{ref:u,"data-relation-bar":!0,onMouseEnter:Is,onMouseLeave:Dl,style:{left:f.x,top:f.y},className:`fixed z-50 w-max max-w-[min(46rem,calc(100vw-2rem))] max-h-[60vh]
                 overflow-y-auto overflow-x-hidden py-1
                 rounded-md border border-gray-300 dark:border-slate-600
                 bg-white dark:bg-slate-800 shadow-xl
                 text-gray-900 dark:text-gray-100`,children:[d.jsx("div",{className:"px-3 py-1 border-b border-gray-200 dark:border-slate-700",children:d.jsxs("div",{className:"text-[11px] font-semibold",children:[d.jsx("b",{children:n})," ",t==="left"?"belongs to":"owns"," ",v.length," ",v.length===1?"entity":"distinct entities",g.length!==v.length&&d.jsxs("span",{className:"font-normal text-gray-500 dark:text-slate-400",children:[" ","through ",g.length," attributes"]})]})}),d.jsx("button",{onClick:()=>v.forEach(x=>k?r(x):s(x)),className:`block w-full text-left px-3 py-1 text-[11px]
                   text-blue-600 dark:text-blue-400
                   hover:bg-gray-100 dark:hover:bg-slate-700`,children:k?`hide all ${v.length} entities`:`add all ${v.length} entities`}),d.jsx("table",{className:"w-full text-[11px]",children:d.jsx("tbody",{children:m.map(({row:x,depth:C})=>{const D=El[x.position].kind,T=C>0&&d.jsx("span",{"aria-hidden":!0,className:"text-gray-400 dark:text-slate-500 select-none",style:{paddingLeft:`${(C-1)*.75}rem`},children:"↳ "}),P=x.declaredBy===x.other?n:x.declaredBy,E=t==="left"?x.other:P,L=t==="left"?P:x.other;return d.jsxs("tr",{"data-family-depth":C,className:"hover:bg-gray-100 dark:hover:bg-slate-700",children:[d.jsx("td",{className:"pl-2 pr-1 py-0.5",children:d.jsx("button",{onClick:I=>{I.stopPropagation(),(x.drawn?r:s)(x.other)},"aria-label":x.drawn?`Remove ${x.other} from the diagram`:`Add ${x.other} to the diagram`,className:`w-4 h-4 rounded-sm leading-none text-[11px]
                                flex items-center justify-center border
                                ${x.drawn?"border-sky-300 bg-sky-50 text-sky-700 hover:bg-sky-200 dark:border-sky-700 dark:bg-sky-950 dark:text-sky-300":"border-gray-300 text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:border-slate-600 dark:hover:bg-slate-600"}`,children:x.drawn?"−":"+"})}),d.jsxs("td",{className:"pl-1 pr-2 py-0.5 text-right whitespace-nowrap",children:[t==="left"&&T,d.jsx(wr,{cls:E,row:x,colorOf:a,onInspect:o})]}),d.jsx("td",{className:`px-2 py-0.5 font-mono text-gray-400 dark:text-slate-500
                               whitespace-nowrap tabular-nums text-right`,children:x.cardinality}),d.jsx("td",{className:"px-1 py-0.5 align-middle",children:d.jsx(In,{kind:D,width:30})}),d.jsxs("td",{className:"pr-3 py-0.5 whitespace-nowrap",children:[t==="right"&&T,d.jsx(wr,{cls:L,row:x,colorOf:a,onInspect:o})]})]},`${x.declaredBy}.${x.slot}->${x.other}`)})})})]})}function wr({cls:e,row:t,colorOf:n,onInspect:i}){const s=n?.(e),r=e===t.declaredBy,o=s?{color:s.text}:void 0;return d.jsxs("span",{className:"font-mono",children:[i?d.jsx("button",{onClick:a=>{a.stopPropagation(),i(e)},title:`Open ${e}'s details`,className:"hover:underline",style:o,children:e}):d.jsx("span",{style:o,children:e}),r&&d.jsxs("span",{className:s?"opacity-80":"text-gray-500 dark:text-slate-400",style:o,children:[".",t.slot]})]})}const De={sibs:!0,dir:"RIGHT",merge:"near",legend:!1,cases:!1},Ml=["legend","cases"];function mm(e,t){if(e.get("panels")!=="0")return t;for(const n of Ml)t[n]=!1;return t.detail=null,t}const Ot={dir:"explore-nl-dir",merge:"explore-nl-merge",sibs:"explore-nl-sibs"},zn="~",gm=["exp","hidden","owners"],ym=["tour"];let It;function bm(e=window.location.search){return It===void 0&&(It=new URLSearchParams(e).get("tour")==="1"),It}function wm(e,t){const n=e.get(t);return n?n.split(zn).filter(Boolean):[]}function Ol(e){const t=e.get("cat");if(!t)return[];const n=t.split(new RegExp(`[,${zn}]`)).filter(Boolean);return[...new Set(n.flatMap(i=>{const s=$r.find(r=>r.id===i);return s?Hr(s):[]}))]}function un(e){try{return localStorage.getItem(e)}catch{return null}}function xm(e,t){try{localStorage.setItem(e,t)}catch{}}function hn(e,t){return e&&t.includes(e)?e:null}function We(e=window.location.search){const t=new URLSearchParams(e),n=hn(t.get("dir"),["RIGHT","DOWN"])??hn(un(Ot.dir),["RIGHT","DOWN"])??De.dir,i=hn(t.get("merge"),["near","far","bend","off"])??hn(un(Ot.merge),["near","far","bend","off"])??De.merge,s=t.has("sibs")?t.get("sibs")==="1":un(Ot.sibs)!==null?un(Ot.sibs)!=="0":De.sibs,r=wm(t,"sel"),o=mm(t,{legend:t.get("legend")==="1",cases:t.get("cases")==="1",detail:t.get("detail")||null});return t.has("legend")&&(o.legend=t.get("legend")==="1"),t.has("cases")&&(o.cases=t.get("cases")==="1"),t.has("detail")&&(o.detail=t.get("detail")||null),{sel:r.length?r:Ol(t),detail:o.detail,roots:t.get("roots")==="1",sibs:s,dir:n,merge:i,legend:o.legend,cases:o.cases}}function Rl(e,{push:t=!1}={}){const n=new URL(window.location.href),i=n.searchParams,s=(o,a)=>{a.length===0?i.delete(o):i.set(o,[...a].sort().join(zn))},r=(o,a,l)=>{l?i.delete(o):i.set(o,a)};for(const o of gm)i.delete(o);It===void 0&&i.has("tour")&&(It=i.get("tour")==="1");for(const o of ym)i.delete(o);s("sel",e.sel),e.detail?i.set("detail",e.detail):i.delete("detail"),r("roots","1",!e.roots),r("sibs",e.sibs?"1":"0",e.sibs===De.sibs),r("dir",e.dir,e.dir===De.dir),r("merge",e.merge,e.merge===De.merge),r("legend","1",e.legend===De.legend),r("cases","1",e.cases===De.cases),i.delete("panels"),i.delete("cat"),t?window.history.pushState(null,"",n):window.history.replaceState(null,"",n)}function xr(e,t){xm(Ot[e],typeof t=="boolean"?t?"1":"0":String(t))}function vm(e,t=window.location.href){const n=new URL(t),i=new URLSearchParams,s=(r,o)=>i.set(r,o);return e.sel.length&&s("sel",[...e.sel].sort().join(zn)),e.detail&&s("detail",e.detail),e.roots&&s("roots","1"),e.sibs!==De.sibs&&s("sibs",e.sibs?"1":"0"),e.dir!==De.dir&&s("dir",e.dir),e.merge!==De.merge&&s("merge",e.merge),e.legend!==De.legend&&s("legend","1"),e.cases!==De.cases&&s("cases","1"),n.search=i.toString(),n.toString()}const Ce=240,ct=30,km=.6,ut=20,Tm=1/0,Bs=22,jl=18,gt=28;function Ll(e,t,n=()=>!1){const i=new Map;for(const s of e){if(n(s.other))continue;const r=s.position,o=i.get(r)??new Map,a=o.get(s.other)??[];a.includes(s.slot)||a.push(s.slot),o.set(s.other,a),i.set(r,o)}return mc.filter(s=>i.has(s)).map(s=>{const r=[...i.get(s)].map(([o,a])=>({other:o,slots:a,drawn:t(o)})).sort((o,a)=>o.other.localeCompare(a.other));return{position:s,label:gc(s,r.length),items:r}})}function Nl(e,t,n=()=>!1){const i=new Set,s=[];for(const r of e){if(n(r.other))continue;const o=`${r.declaredBy}.${r.slot}->${r.other}:${r.position}`;i.has(o)||(i.add(o),s.push({other:r.other,position:r.position,slot:r.slot,declaredBy:r.declaredBy,cardinality:r.cardinality,drawn:t(r.other)}))}return s}function ce(e){return e.storageDirection==="flipped"?e.target:e.source}function ns(e){return e.anchorClass??ce(e)}function Sm(e,t,n,i,s){const r=new Map,o=new Map,a=[],l=new Set;for(const h of e.edges)h.type==="isa"?(r.set(h.target,[...r.get(h.target)??[],h.source]),o.set(h.source,(o.get(h.source)??0)+1)):h.isLoop||(a.push(h),l.add(`${ce(h)}|${h.slotName}`));const c=new Set(e.nodes.map(h=>h.id)),u=e.nodes.map(h=>{const g=new Map(n(h.id).map((O,_)=>[O.name,_])),p=(O,_)=>(g.get(O.slot)??Number.MAX_SAFE_INTEGER)-(g.get(_.slot)??Number.MAX_SAFE_INTEGER),b=h.slots.map(O=>({...O,connected:O.isLoop||l.has(`${h.id}|${O.slot}`),rangeColor:i(O.range),targetColor:s(O.range)})).sort(p),m=new Set(b.map(O=>O.slot)),w=n(h.id).filter(O=>!m.has(O.name)).map(O=>({slot:O.name,range:O.range,channel:"plain",flipped:!1,cardinality:hc(O.required,O.multivalued),isLoop:!1,connected:!1,rangeColor:i(O.range)})),k=b.filter(O=>O.connected),v=[...b.filter(O=>!O.connected),...w].sort(p),x=[...k,...v].slice(0,Math.max(Tm,k.length)),C=x.length===k.length+v.length,D=t.has(h.id)||C,T=D?[...k,...v]:x,P=C?0:k.length+v.length-x.length,E=e.hiddenOwners.get(h.id)??[],L=e.hiddenOwned.get(h.id)??[],I=Ll(h.relations,O=>c.has(O),O=>O===h.id),B=Nl(h.relations,O=>c.has(O),O=>O===h.id);return{...h,isaParents:r.get(h.id)??[],subclassCount:o.get(h.id)??0,members:[],hiddenOwners:E,hiddenOwned:L,relationGroups:I,relationRows:B,...Vl(I),rows:T,allRows:[...k,...v],hiddenCount:P,expanded:D,height:Il(T.length,P,I.length>0)}}),f=new Map;for(const h of a){const g=ce(h)===h.source?h.target:h.source,p=s(g);p&&f.set(h.id,p)}return{nodes:u,edges:a,edgeColors:f}}function Vl(e){const t=new Map;for(const n of e)for(const i of n.items)t.set(i.other,(t.get(i.other)??!1)||i.drawn);return{relatedCount:t.size,shownCount:[...t.values()].filter(Boolean).length}}function Il(e,t,n){return ct+(n?Bs:0)+e*ut+(t?jl:0)+(e?5:0)}function Cm(e,t,n,i,s,r,o){const a=dc(e.nodes.map(w=>w.id),t,n);if(!a.size)return e;const l=new Map(e.nodes.map(w=>[w.id,w])),c=new Set(e.nodes.map(w=>w.id)),u=new Map,f=[],h=new Map;for(const[w,k]of a){const v=yc(w),x=k.map(j=>({id:j,label:l.get(j)?.label??j,color:fc(o(j))}));for(const j of x)u.set(j.id,v);const C=l.has(w);C&&u.set(w,v);const D=new Map(x.map(j=>[j.id,j])),T=new Map,P=C?[w,...k]:k;for(const j of P){const X=l.get(j);if(!X)continue;const oe=j===w;for(const re of X.allRows){const Me=i(j,re.slot),be=Me!==void 0&&Me!==j,Pe=`${oe||be?Me??w:j}|${re.slot}`,ve=T.get(Pe),Se=D.get(j),q=oe||be?ve?.owners??[]:[...ve?.owners??[],...Se?[Se]:[]];T.set(Pe,{...ve??re,connected:(ve?.connected??!1)||re.connected,owners:q,declaringClass:Pe.slice(0,Pe.indexOf("|"))})}}const E=new Map;for(const j of T.values())if(j.targetColor)for(const X of j.owners??[])E.has(X.id)||E.set(X.id,j.targetColor);for(const j of x){const X=E.get(j.id);X&&(j.color=X)}for(const[j,X]of T)X.targetColor&&h.set(`${v}|${j}`,X.targetColor);const L=[...T.values()],I=j=>{const X=j.owners?.length?j.owners[0].id:w;return r(X,j.slot)};L.sort((j,X)=>I(j)-I(X));const B=pc(L,x,j=>({slot:`::hdr:${j.id}`,range:"",channel:"plain",flipped:!1,cardinality:"",isLoop:!1,connected:!1,rangeColor:"",header:j})),O=j=>!u.has(j)&&!P.includes(j),_=[...new Set(P.flatMap(j=>l.get(j)?.hiddenOwners??[]))].filter(O),S=[...new Set(P.flatMap(j=>l.get(j)?.hiddenOwned??[]))].filter(O),z=Ll(P.flatMap(j=>l.get(j)?.relations??[]),j=>c.has(j),j=>!O(j)),fe=Nl(P.flatMap(j=>l.get(j)?.relations??[]),j=>c.has(j),j=>!O(j)),N=l.get(k[0]),G=s(w);f.push({...N,id:v,label:w,description:G.description,abstract:G.abstract,slots:[],members:x,role:P.some(j=>l.get(j)?.role==="selected")?"selected":"context",layer:Math.min(...P.map(j=>l.get(j)?.layer??0)),isaParents:[],subclassCount:x.length,hiddenOwners:_,hiddenOwned:S,relationGroups:z,relationRows:fe,...Vl(z),rows:B,allRows:L,hiddenCount:0,expanded:!0,height:Il(B.length,0,z.length>0)})}const g=[...e.nodes.filter(w=>!u.has(w.id)),...f],p=new Set,b=e.edges.map(w=>({...w,source:u.get(w.source)??w.source,target:u.get(w.target)??w.target,entityMember:(()=>{if(w.inducedFrom!==void 0)return;const k=ce(w)===w.source?w.target:w.source;return u.has(k)?k:void 0})(),anchorClass:u.has(ce(w))?i(ce(w),w.slotName)??ce(w):ce(w)})).filter(w=>{if(!Di(w.source)&&!Di(w.target))return!0;const k=`${w.source}|${w.target}|${w.anchorClass}|${w.slotName}|${w.storageDirection}`;return p.has(k)?!1:(p.add(k),!0)}).filter(w=>w.source!==w.target),m=new Map(e.edgeColors);for(const w of b){const k=h.get(`${ce(w)}|${ns(w)}|${w.slotName}`);k&&m.set(w.id,k)}return{nodes:g,edges:b,edgeColors:m}}function Am({title:e}){return d.jsxs("svg",{viewBox:"0 0 16 16",width:"15",height:"15","aria-hidden":"false",className:"shrink-0",style:{color:He.entity},children:[d.jsx("title",{children:e}),d.jsx("path",{d:"M12.33 10.5 A5 5 0 1 1 12.33 5.5",fill:"none",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round"}),d.jsx("path",{d:"M13.7 7.9 L10.6 6.7 L13.7 4.2 Z",fill:"currentColor"})]})}function Bl(e){return ct+(e.relationGroups.length>0?Bs:0)}function $l(e,t,n){const i=e.rows.findIndex(s=>s.slot===t&&!s.header&&(!n||!s.declaringClass||s.declaringClass===n));if(i<0)throw new Error(`No displayed row for ${t} on ${e.id}`);return Bl(e)+i*ut+ut/2}function Pm(e,t){const n=e.rows.findIndex(i=>i.header?.id===t);if(!(n<0))return Bl(e)+n*ut+ut/2}function is(e,t){if(e.storageDirection==="flipped"||!t.members.length)return;const n=e.entityMember;return n&&t.members.some(i=>i.id===n)?n:void 0}const Em=4,Dm=10,Mm=ie.head.span,vr=ie.head.len,Om=ie.gap,Rm=ie.secondaryScale,Fl=ie.stroke.own,_l=ie.stroke.ownHover,jm=Fl*ie.stroke.refFactor,Lm=_l*ie.stroke.refFactor;function kr(e,t){return e?t?Ke.ownBkwd:Ke.ownFwd:Ke.association}function di(e,t){if(e==="off"||t.length<2)return 0;if(e==="near")return 40;if(e==="far")return 120;const n=t[t.length-1],i=t[t.length-2];return Math.hypot(n.x-i.x,n.y-i.y)}function Tr(e,t){return e<2?0:Math.min(Em,t/(e-1))}function Nm(e,t){const n=new Map,i=(c,u,f,h)=>{const g=n.get(c.id)??[];return g.some(p=>p.id===u)||(g.push({id:u,x:f,y:h}),n.set(c.id,g)),u},s=new Map(e.nodes.map(c=>[c.id,c])),r=c=>{const u=s.get(ce(c)===c.source?c.target:c.source);return!!u&&is(c,u)!==void 0},o=new Map;for(const c of e.edges){if(r(c))continue;const u=ce(c)===c.source?c.target:c.source,f=`${u}|${u===c.source?"out":"in"}`;o.set(f,(o.get(f)??0)+1)}const a=new Map,l=e.edges.map(c=>{const u=s.get(ce(c)),f=s.get(ce(c)===c.source?c.target:c.source);if(!u||!f)throw new Error(`Edge ${c.id} endpoint missing from subgraph`);const h=c.storageDirection==="flipped",g=$l(u,c.slotName,ns(c)),p=i(u,`${u.id}::row:${ns(c)}|${c.slotName}`,h?0:Ce,g),b=f.id===c.source,m=`${f.id}|${b?"out":"in"}`,w=is(c,f),k=w!==void 0?Pm(f,w):void 0;let v;if(w!==void 0&&k!==void 0)v=i(f,`${f.id}::mhdr:${b?"out":"in"}:${w}`,t==="RIGHT"?b?Ce:0:Ce/2,t==="RIGHT"?k:b?f.height:0);else{const x=o.get(m)??1,C=a.get(m)??0;a.set(m,C+1);const D=Tr(x,ct-4),T=ct/2+(C-(x-1)/2)*D;v=t==="RIGHT"?i(f,`${f.id}::hdr:${b?"out":"in"}:${C}`,b?Ce:0,T):i(f,`${f.id}::hdr:${b?"out":"in"}:${C}`,Ce/2+(C-(x-1)/2)*Tr(x,Ce/2),b?f.height:0)}return{id:c.id,source:c.source,target:c.target,sourcePort:h?v:p,targetPort:h?p:v}});return{nodes:e.nodes.map(c=>({id:c.id,width:Ce,height:c.height,partition:c.layer,ports:n.get(c.id)})),edges:l}}function Vm(e,t){if(!e?.length)return e;const n=e[0],i=n.bendPoints?.length?n.bendPoints[n.bendPoints.length-1]:n.startPoint,s=n.endPoint.x-i.x,r=n.endPoint.y-i.y,o=Math.hypot(s,r);if(o<1)return e;const a=Math.min(t,o*.8)/o,l={x:n.endPoint.x-s*a,y:n.endPoint.y-r*a};return[{...n,endPoint:l},...e.slice(1)]}function Im(e,t){if(!e?.length)return e;const n=e[0],i=n.bendPoints?.length?n.bendPoints[0]:n.endPoint,s=i.x-n.startPoint.x,r=i.y-n.startPoint.y,o=Math.hypot(s,r);if(o<1)return e;const a=Math.min(t,o*.8)/o,l={x:n.startPoint.x+s*a,y:n.startPoint.y+r*a};return[{...n,startPoint:l},...e.slice(1)]}function Bm({dataService:e,selectedIds:t,onNodeClick:n,onAdd:i,onRemove:s,pathToRoot:r=!1,onTogglePathToRoot:o,direction:a,setDirection:l,mergeMode:c,setMergeMode:u}){const f=y.useId().replace(/[^a-zA-Z0-9]/g,""),h=A=>`${A}-${f}`,[g,p]=y.useState(new Set),b=y.useMemo(()=>e.getOwnershipSubgraph([...t].sort(),{pathToRoot:r}),[e,t,r]),m=y.useCallback(A=>e.getTargetColor(A),[e]),w=y.useMemo(()=>new Map(b.nodes.map(A=>[A.id,e.getClassSummary(A.id)?.slots??[]])),[e,b]),k=y.useMemo(()=>Sm(b,g,A=>w.get(A)??[],A=>e.getRangeColor(A),A=>e.getTargetColor(A)),[b,g,w,e]),v=y.useMemo(()=>new Map(b.nodes.map(A=>[A.id,e.getClassSummary(A.id)])),[e,b]),x=y.useMemo(()=>{const A=M=>v.get(M)?.parentId,R=M=>!bc.has(M),V=(M,F)=>M.range===F.range&&M.multivalued===F.multivalued;return Cm(k,A,R,(M,F)=>{const W=e.getClassSummary(M)?.slots.find(ue=>ue.name===F);if(!W)return;if(!W.inheritedFrom)return M;const Z=e.getClassSummary(W.inheritedFrom)?.slots.find(ue=>ue.name===F);return Z&&V(W,Z)?W.inheritedFrom:M},M=>{const F=e.getClassSummary(M);return{description:F?.description??"",abstract:F?.isAbstract??!1}},(M,F)=>{const W=e.getClassSummary(M)?.slots.findIndex(Z=>Z.name===F)??-1;return W<0?Number.MAX_SAFE_INTEGER:W},M=>e.siblingColorIndexOf(M))},[k,v,e]),[C,D]=y.useState(new Map),[T,P]=y.useState(new Map),E=y.useMemo(()=>Nm(x,a),[x,a]),{latest:L,inProgress:I}=Qp(E,{direction:a,usePartitions:!0,nodeSpacing:28,layerSpacing:72,extraLayoutOptions:{"elk.spacing.edgeNode":"18","elk.spacing.edgeEdge":"12","elk.layered.spacing.edgeNodeBetweenLayers":"18","elk.layered.spacing.edgeEdgeBetweenLayers":"10"}}),B=L?.spec===E?L.layout:null,O=L?.layout??null,_=lm(),S=(O?.width??0)+gt*2,z=(O?.height??0)+gt*2;y.useEffect(()=>{B&&(_.setContentSize(S,z),_.isAutoFit()&&_.zoomToFit())},[B,S,z]),y.useEffect(()=>D(new Map),[B]),y.useEffect(()=>P(new Map),[B]);const[fe,N]=y.useState(!1),G=y.useRef(!0);y.useEffect(()=>{if(!B){N(!1),O||(G.current=!0);return}const A=G.current?0:am();if(G.current=!1,A===0){N(!0);return}const R=setTimeout(()=>N(!0),A);return()=>clearTimeout(R)},[B,O]);const j=y.useRef(new Map),X=y.useRef(!1),oe=y.useRef(C);oe.current=C;const re=y.useMemo(()=>{const A=new Map((O?.nodes??[]).map(V=>[V.id,V])),R=new Map(T);for(const[V,H]of C)R.set(V,H);for(const[V,{dx:H,dy:K}]of R){const Y=A.get(V);Y&&A.set(V,{...Y,x:Y.x+H,y:Y.y+K})}return j.current=A,A},[O,C,T]),[Me,be]=y.useState(!1);y.useEffect(()=>{if(!I){be(!1);return}const A=setTimeout(()=>be(!0),nm);return()=>clearTimeout(A)},[I]);const Pe=y.useCallback((A,R)=>{if(R.button!==0||R.target.closest('button, a, [role="button"], [data-no-drag]'))return;R.stopPropagation();const V=R.clientX,H=R.clientY,K=_.getZoom()||1,Y=C.get(A)??{dx:0,dy:0},M=R.currentTarget;M.setPointerCapture(R.pointerId);let F=!1;const W=ue=>{const Ee=(ue.clientX-V)/K,Ve=(ue.clientY-H)/K;!F&&Math.hypot(Ee,Ve)<3||(F=!0,X.current=!0,D(tt=>new Map(tt).set(A,{dx:Y.dx+Ee,dy:Y.dy+Ve})))},Z=ue=>{if(M.releasePointerCapture(ue.pointerId),M.removeEventListener("pointermove",W),M.removeEventListener("pointerup",Z),F){const Ee=oe.current.get(A);Ee&&P(Ve=>new Map(Ve).set(A,Ee))}};M.addEventListener("pointermove",W),M.addEventListener("pointerup",Z)},[C]),ve=y.useMemo(()=>new Map(x.nodes.map(A=>[A.id,A.role])),[x]),Se=y.useMemo(()=>new Map(x.edges.map(A=>[A.id,A])),[x]),q=y.useMemo(()=>{const A=new Map(x.nodes.map(R=>[R.id,R]));return new Set(x.edges.filter(R=>{const V=A.get(ce(R)===R.source?R.target:R.source);return!!V&&is(R,V)!==void 0}).map(R=>R.id))},[x]),Q=y.useMemo(()=>{const A=new Map;if(!B)return A;for(const R of x.edges){const V=ce(R)===R.source?R.target:R.source,H=re.get(V);if(!H||q.has(R.id))continue;const K=V===R.source,Y=`${V}|${K?"out":"in"}`;if(A.has(Y))continue;const M=K,F=Om+vr;A.set(Y,a==="RIGHT"?{base:{x:M?H.x+Ce+F:H.x-F,y:H.y+ct/2},dir:{x:M?-1:1,y:0}}:{base:{x:H.x+Ce/2,y:M?H.y+H.height+F:H.y-F},dir:{x:0,y:M?-1:1}})}return A},[x,re,B,a,q]),ne=y.useMemo(()=>{const A=new Map,R=new URLSearchParams(window.location.search).has("dbg"),V=new Set([...T.keys(),...C.keys()]);if(!B||V.size===0)return A;R&&console.log(`[drag] moved: ${[...V].join(", ")}`);const H=new Map(x.nodes.map(K=>[K.id,K]));for(const K of x.edges){const Y=ce(K),M=Y===K.source?K.target:K.source;if(!V.has(Y)&&!V.has(M))continue;const F=re.get(Y),W=re.get(M),Z=H.get(Y);if(!F||!W||!Z)continue;const ue=K.storageDirection==="flipped",Ee=a==="RIGHT";let Ve;try{Ve=$l(Z,K.slotName)}catch{R&&console.log(`   SKIP ${Y}.${K.slotName}: row not displayed`);continue}const tt=Ee?{x:F.x+(ue?0:Ce),y:F.y+Ve}:{x:F.x+Ce/2,y:F.y+Ve},Qe=Ee?{x:ue?-1:1,y:0}:{x:0,y:1},mt=M===K.source,Xt=Ee?{x:mt?W.x+Ce:W.x,y:W.y+ct/2}:{x:W.x+Ce/2,y:mt?W.y+W.height:W.y},Kn=Ee?{x:mt?1:-1,y:0}:{x:0,y:mt?1:-1};A.set(K.id,qp(tt,Xt,Qe,Kn)),R&&console.log(`   reroute ${Y}.${K.slotName} -> ${M}`)}return R&&console.log(`[drag] rerouted ${A.size} edge(s)`),A},[B,C,T,x,re,a]);y.useEffect(()=>{if(!B||!new URLSearchParams(window.location.search).has("dbg"))return;const A=new Map;for(const R of B.edges){const V=Se.get(R.id);if(!V)continue;const H=an(R.sections);if(H.length<2)continue;const K=ce(V)===V.source?V.target:V.source;let Y=0,M=0;for(let W=1;W<H.length;W++){const Z=Math.abs(H[W].x-H[W-1].x),ue=Math.abs(H[W].y-H[W-1].y);Z>.5&&ue>.5&&M++,W>1&&Y++}const F=ce(V);A.set(K,[...A.get(K)??[],`${F}.${V.slotName}  pts=${H.length} bends=${Y}${M?` DIAGONAL x${M}`:""}  start=(${Math.round(H[0].x)},${Math.round(H[0].y)}) end=(${Math.round(H[H.length-1].x)},${Math.round(H[H.length-1].y)})`])}for(const[R,V]of A){if(V.length<2)continue;console.log(`
=== approaches to ${R} (${V.length}) ===`);const H=re.get(R);H&&console.log(`   box at (${Math.round(H.x)},${Math.round(H.y)}) h=${Math.round(H.height)}`),V.forEach(K=>console.log("   "+K))}},[B,Se,re]);const ae=y.useMemo(()=>{const A=new Map;if(!B)return A;for(const R of B.edges){const V=Se.get(R.id);if(!V||V.storageDirection==="flipped"||q.has(R.id)||di(c,an(R.sections))<=0)continue;const H=ce(V)===V.source?V.target:V.source,K=`${H}|${H===V.source?"out":"in"}`,Y=Q.get(K);if(!Y)continue;const M=V.type==="ownership",F=ve.get(V.source)==="context"||ve.get(V.target)==="context",W=x.edgeColors.get(R.id),Z=A.get(K);A.set(K,Z?{...Z,isOwn:Z.isOwn||M,dimmed:Z.dimmed&&F,edgeIds:[...Z.edgeIds,R.id],...Z.color?.text===W?.text?{}:{color:void 0}}:{...Y,isOwn:M,dimmed:F,edgeIds:[R.id],...W?{color:W}:{}})}return A},[B,Se,Q,c,ve,x,q]),we=y.useMemo(()=>new Set(x.nodes.map(A=>A.id)),[x]),Le=y.useCallback(A=>!!i&&A.channel!=="plain"&&!A.isLoop&&!we.has(A.range),[i,we]),Ne=y.useRef(null),dt=y.useRef(null),ft=y.useRef(void 0),pt=y.useMemo(()=>{const A=new Map,R=new Map;for(const V of x.edges){R.set(V.id,[V.source,V.target]);for(const H of[V.source,V.target])A.set(H,[...A.get(H)??[],V.id])}return{nodeEdges:A,edgeEnds:R}},[x]),U=y.useRef(pt);U.current=pt;const J=y.useCallback(A=>{ft.current=A,dt.current===null&&(dt.current=requestAnimationFrame(()=>{dt.current=null;const R=ft.current;ft.current=void 0;const V=Ne.current,H=_.wrapperRef.current;if(R===void 0||!V||!H)return;let K=null,Y=null;if(R){const{nodeEdges:F,edgeEnds:W}=U.current;if(R.kind==="node"){K=new Set(F.get(R.id)??[]),Y=new Set([R.id]);for(const Z of K)for(const ue of W.get(Z)??[])Y.add(ue)}else K=new Set([R.id]),Y=new Set(W.get(R.id)??[])}const M=(F,W,Z)=>{F.style.filter=W===null||W?"":`opacity(${Z})`};V.querySelectorAll("path[data-edge-id]").forEach(F=>{const W=F.dataset.edgeId??"",Z=K?K.has(W):null;M(F,Z,.38),F.style.strokeWidth=Z?String(F.dataset.channel==="reference"?Lm:_l):""}),V.querySelectorAll("path[data-arrowhead]").forEach(F=>{const W=(F.dataset.arrowhead??"").split(" ");M(F,K?W.some(Z=>K.has(Z)):null,.08)}),H.querySelectorAll("[data-node-id]").forEach(F=>{M(F,Y?Y.has(F.dataset.nodeId??""):null,.25)})}))},[]);y.useEffect(()=>J(null),[x,B,J]);const pe=A=>p(R=>{const V=new Set(R);return V.has(A)?V.delete(A):V.add(A),V}),me=A=>{xr("dir",A),l(A)},Qt=A=>{xr("merge",A),u(A)},Yt=e.getConceptLabel("attribute",!0).toLowerCase(),qe=A=>`px-2 py-0.5 text-xs rounded border ${A?"border-blue-500 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300":"border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700"}`;return d.jsxs("div",{className:"relative w-full h-full",children:[d.jsxs("div",{"data-pan-ignore":!0,className:"absolute top-2 right-2 z-10 flex gap-1 items-center",children:[Me&&d.jsxs("div",{className:`mr-2 flex items-center gap-2 rounded px-2 py-1
                          text-xs text-gray-500 dark:text-gray-400
                          bg-white/80 dark:bg-slate-900/80 shadow-sm`,children:[d.jsx("span",{className:`inline-block h-3 w-3 animate-spin rounded-full
                             border-2 border-gray-300 border-t-gray-600
                             dark:border-slate-600 dark:border-t-slate-300`}),"Computing layout…"]}),o&&d.jsxs(d.Fragment,{children:[d.jsx("button",{className:qe(r),title:r?"Hide owners: show only what you selected":"Show every owner up to the root (can pull in most of the schema)",onClick:o,children:"⇱ roots"}),d.jsx("span",{className:"w-px h-4 bg-gray-300 dark:bg-slate-600 mx-1"})]}),d.jsx("button",{className:qe(a==="RIGHT"),title:"Layout left to right",onClick:()=>me("RIGHT"),children:"LR"}),d.jsx("button",{className:qe(a==="DOWN"),title:"Layout top down",onClick:()=>me("DOWN"),children:"TB"}),d.jsx("span",{className:"w-px h-4 bg-gray-300 dark:bg-slate-600 mx-1"}),d.jsx("button",{className:qe(c==="near"),title:"Merge converging edges near the node (~40px)",onClick:()=>Qt("near"),children:"⋙"}),d.jsx("button",{className:qe(c==="far"),title:"Merge converging edges early (~120px)",onClick:()=>Qt("far"),children:"⋙⋙"}),d.jsx("button",{className:qe(c==="bend"),title:"Merge at ELK's last corner",onClick:()=>Qt("bend"),children:"⌙"}),d.jsx("button",{className:qe(c==="off"),title:"No merging — every edge runs to its own port",onClick:()=>Qt("off"),children:"≡"}),d.jsx("span",{className:"w-px h-4 bg-gray-300 dark:bg-slate-600 mx-1"}),[["+",()=>_.zoomBy(1.3),"Zoom in"],["−",()=>_.zoomBy(1/1.3),"Zoom out"],["1:1",()=>_.applyZoom(1),"Reset zoom"],["⛶",()=>_.zoomToFit(),"Fit to view"]].map(([A,R,V])=>d.jsx("button",{onClick:R,title:V,className:qe(!1),children:A},A))]}),d.jsx("div",{ref:_.containerRef,"data-graph-direction":a,className:"w-full h-full overflow-auto cursor-grab",children:d.jsx("div",{ref:_.spacerRef,children:d.jsx("div",{ref:_.wrapperRef,className:"relative",children:O&&d.jsxs(d.Fragment,{children:[d.jsxs("svg",{ref:Ne,className:"absolute top-0 left-0 pointer-events-none",width:S,height:z,children:[d.jsxs("defs",{children:[(()=>{const A=Sn("forward"),{d:R,...V}=A;return d.jsx("marker",{id:h("arrow-own"),...V,children:d.jsx("path",{d:R,fill:Ke.ownFwd})})})(),(()=>{const{d:A,...R}=Sn("backward");return d.jsx("marker",{id:h("arrow-own-back"),...R,children:d.jsx("path",{d:A,fill:Ke.ownBkwd})})})(),(()=>{const{d:A,...R}=Sn("forward",Rm);return d.jsx("marker",{id:h("arrow-assoc"),...R,children:d.jsx("path",{d:A,fill:Ke.association})})})()]}),d.jsxs("g",{transform:`translate(${gt}, ${gt})`,style:{opacity:fe?1:0,transition:`opacity ${rm()}ms`},children:[[...ae].map(([A,R])=>d.jsx("path",{"data-arrowhead":R.edgeIds.join(" "),d:Kp(R.base,R.dir,Mm,vr),fill:R.color?.text??kr(R.isOwn,!1),opacity:R.dimmed?.4:1,style:{transition:`filter ${cn()}ms`}},`head-${A}`)),(B?.edges??[]).map(A=>{const R=Se.get(A.id);if(!R)throw new Error(`Routed edge ${A.id} missing from view model`);const V=R.storageDirection==="flipped",H=ce(R)===R.source?R.target:R.source,K=V||q.has(A.id)?void 0:Q.get(`${H}|${H===R.source?"out":"in"}`),Y=ne.get(A.id),M=!!K&&di(c,Y??an(A.sections))>0,F=R.type!=="ownership",W=M?A.sections:Vm(A.sections,pr(F?"association":"own-fwd")),Z=F?Im(W,pr("association")):W,ue=Y??an(Z),Ee=Kn=>Hp(Kn,Dm),Ve=di(c,ue),tt=K&&Ve>0?Gp(ue,K.base,Ve,Ee):Ee(ue);if(!tt)return null;const Qe=R.type==="ownership",mt=ve.get(A.source)==="context"||ve.get(A.target)==="context",Xt=M?void 0:Qe?V?"arrow-own-back":"arrow-own":"arrow-assoc";return d.jsxs("g",{children:[d.jsx("path",{"data-edge-id":A.id,"data-channel":Qe?"ownership":"reference",d:tt,fill:"none",opacity:mt?.4:1,stroke:x.edgeColors.get(A.id)?.text??kr(Qe,V),strokeWidth:Qe?Fl:jm,strokeDasharray:Qe?void 0:ie.dash,markerEnd:Xt?`url(#${h(Xt)})`:void 0,markerStart:!Qe&&!M?`url(#${h("arrow-assoc")})`:void 0,style:{transition:`filter ${cn()}ms, stroke-width ${cn()}ms`}}),d.jsx("path",{d:tt,fill:"none",stroke:"transparent",strokeWidth:11,style:{pointerEvents:"stroke"},onMouseEnter:()=>J({kind:"edge",id:A.id}),onMouseLeave:()=>J(null)})]},A.id)})]})]}),d.jsx(Af,{initial:!1,children:x.nodes.map(A=>{const R=re.get(A.id);if(!R)return null;const V=A.role==="context",H=R.x+gt,K=R.y+gt,Y={duration:ln(C.has(A.id)?0:Pl()),ease:im};return d.jsxs(Np.div,{initial:{opacity:0,x:H,y:K},animate:{opacity:V?km:1,x:H,y:K},exit:{opacity:0,transition:{duration:ln(yr())}},transition:{x:Y,y:Y,opacity:{duration:ln(yr()),delay:ln(om())}},"data-node-id":A.id,"data-help-id":Oc(A),"data-pan-ignore":!0,"data-pinned":T.has(A.id)?"":void 0,onPointerDown:M=>Pe(A.id,M),onClick:()=>{if(X.current){X.current=!1;return}n?.(A.members.length?A.label:A.id)},onMouseEnter:()=>J({kind:"node",id:A.id}),onMouseLeave:()=>J(null),className:`absolute rounded-md text-xs bg-white dark:bg-slate-800 cursor-pointer ${V?"border border-dashed border-gray-400 dark:border-slate-500":T.has(A.id)?"border-2 border-amber-500 dark:border-amber-400 shadow-md":"border-2 border-slate-500 dark:border-slate-400 shadow-md"}`,style:{width:Ce,height:A.height,transition:`filter ${cn()}ms`},children:[d.jsxs("div",{className:"flex items-center gap-1 px-2 rounded-t-[4px] bg-slate-700 dark:bg-slate-700 text-white border-b border-slate-800 dark:border-slate-600",style:{height:ct},children:[d.jsx("span",{className:`font-semibold truncate ${A.abstract?"italic":""}`,title:A.description||A.id,children:A.label}),d.jsxs("span",{className:"ml-auto flex gap-1 shrink-0",children:[A.members.length>0&&d.jsxs("span",{title:`${A.members.length} classes that are a ${A.label}, merged into one box`,className:"text-[9px] px-1 rounded bg-sky-100 dark:bg-sky-900 text-sky-800 dark:text-sky-200",children:["⑃ ",A.members.length]}),A.isaParents.map(M=>d.jsxs("span",{title:`is-a ${M}`,className:"text-[9px] px-1 rounded bg-sky-100 dark:bg-sky-900 text-sky-800 dark:text-sky-200",children:["⊳ ",M]},M)),A.subclassCount>0&&A.members.length===0&&d.jsxs("span",{title:`${A.subclassCount} subclasses shown`,className:"text-[9px] px-1 rounded bg-sky-100 dark:bg-sky-900 text-sky-800 dark:text-sky-200",children:["▷ ",A.subclassCount]}),(()=>{const F=(A.members.length?A.members.map(W=>W.id):[A.id]).filter(W=>t.has(W));return F.length?d.jsx("button",{"data-dismiss":A.id,"data-help-id":"node-dismiss",title:F.length>1?`Remove all ${F.length} selected classes in ${A.label}`:`Remove ${A.label} from the canvas`,onClick:W=>{W.stopPropagation(),F.forEach(Z=>s?.(Z))},className:`text-[10px] leading-none px-1 rounded text-gray-400
                                         hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/40`,children:"✕"}):null})()]})]}),A.relationGroups.length>0&&d.jsx("div",{"data-help-id":"relation-bar",className:`flex items-center gap-1 px-2 border-b overflow-hidden
                                     border-gray-200 dark:border-slate-600
                                     bg-sky-50/60 dark:bg-sky-950/30`,style:{height:Bs},children:d.jsx(dm,{label:A.label,rows:A.relationRows,onAdd:M=>i?.(M),onRemove:M=>s?.(M),onInspect:n,colorOf:m,slotOrder:A.allRows.map(M=>M.slot),parentOf:M=>e.getClassSummary(M)?.parentId})}),A.rows.map(M=>M.header?d.jsx("div",{"data-no-drag":!0,"data-help-id":Dc(M.header.id),title:`${M.header.label} — is a ${A.label}; click for details`,onClick:F=>{F.stopPropagation(),n?.(M.header.id)},className:`flex items-center px-2 text-[10px] font-semibold
                                     cursor-pointer hover:brightness-110`,style:{height:ut,background:M.header.color.fill,color:uc},children:d.jsx("span",{className:"truncate",children:M.header.label})},M.slot):d.jsxs("div",{"data-help-id":Rc(A,M),"data-expandable":Le(M)?"":void 0,"data-no-drag":Le(M)?"":void 0,title:(M.channel==="plain"?`${M.slot}: ${M.range}`:`${M.slot} → ${M.range} (${M.cardinality})${M.flipped?" — owner side":""}`+(Le(M)?` — click to add ${M.range}`:""))+((M.owners?.length??0)>1?`
also declared by ${M.owners.slice(1).map(F=>F.label).join(", ")}`:""),onClick:Le(M)?F=>{F.stopPropagation(),i?.(M.range)}:void 0,className:`flex items-center gap-1.5 px-2 text-[11px] ${M.targetColor?"":M.connected?"text-gray-700 dark:text-gray-300":"text-gray-400 dark:text-gray-500"} ${Le(M)?"cursor-pointer hover:bg-sky-50 dark:hover:bg-sky-900/30 hover:text-sky-700 dark:hover:text-sky-300":""}`,style:{height:ut,...M.targetColor?{color:M.targetColor.text}:{}},children:[d.jsx("span",{className:"w-1.5 h-1.5 rounded-full shrink-0 border",style:{borderColor:M.rangeColor,background:M.connected?M.rangeColor:"transparent"}}),d.jsx("span",{className:`truncate ${A.members.length&&!M.owners?.length?`font-semibold ${M.targetColor?"":"text-gray-900 dark:text-gray-100"}`:""}`,children:M.slot}),M.isLoop&&d.jsx(Am,{title:`self-referential: a ${M.range} can own another ${M.range} via ${M.slot}`}),d.jsxs("span",{className:"ml-auto text-[9px] truncate max-w-[90px]",children:[d.jsx("span",{style:{color:M.rangeColor},children:M.range}),d.jsxs("span",{className:"text-gray-400 dark:text-gray-500",children:[" ",M.cardinality]})]})]},M.declaringClass?`${M.declaringClass}|${M.slot}`:M.slot)),A.hiddenCount>0&&d.jsx("button",{className:"w-full text-left px-2 text-[10px] text-sky-600 dark:text-sky-400 hover:underline",style:{height:jl},title:`${Yt} without an edge on the current canvas, plus plain (non-entity) ${Yt}`,onClick:M=>{M.stopPropagation(),pe(A.id)},children:A.expanded?`− fewer ${Yt}`:`+ ${A.hiddenCount} more ${Yt}`})]},A.id)})})]})})})})]})}function $m({classId:e,dataService:t,onClose:n,onNavigate:i,isSelected:s,onToggleSelect:r}){const o=y.useMemo(()=>t.getClassSummary(e),[e,t]),[a,l]=y.useState([]),c=y.useCallback(h=>{h!==e&&(l(g=>[...g,e]),i(h))},[e,i]),u=y.useCallback(()=>{l(h=>h.length===0?h:(i(h[h.length-1]),h.slice(0,-1)))},[i]);y.useEffect(()=>{const h=g=>{g.key==="Escape"&&n()};return window.addEventListener("keydown",h),()=>window.removeEventListener("keydown",h)},[n]);const f=t.getTypeLabel("slot",!0);return d.jsxs("aside",{className:`w-96 shrink-0 flex flex-col min-h-0 border-l border-gray-200 dark:border-slate-700
                 bg-white dark:bg-slate-900`,"aria-label":"Entity details",children:[d.jsxs("header",{className:`flex items-start gap-2 px-3 py-2 border-b border-gray-200 dark:border-slate-700
                   bg-gray-50 dark:bg-slate-800 shrink-0`,children:[a.length>0&&d.jsx("button",{onClick:u,className:"text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-sm mt-0.5",title:"Back",children:"←"}),d.jsxs("div",{className:"flex-1 min-w-0",children:[d.jsxs("div",{className:"font-semibold text-sm text-blue-700 dark:text-blue-300 break-words",children:[o?.name??e,o?.isAbstract&&d.jsx("span",{className:"ml-1 text-xs text-purple-500 italic",children:"(abstract)"})]}),o?.parentId&&d.jsxs("div",{className:"text-xs text-gray-400",children:["is a"," ",d.jsx("button",{onClick:()=>c(o.parentId),className:"text-blue-600 dark:text-blue-400 hover:underline",children:o.parentId})]})]}),d.jsx("button",{onClick:n,className:"text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-sm px-1",title:"Close (Esc)",children:"✕"})]}),o?d.jsxs("div",{className:"flex-1 overflow-y-auto min-h-0 px-3 py-2 space-y-3",children:[d.jsx("button",{onClick:()=>r(e),className:`w-full px-2 py-1 text-xs rounded border ${s?"border-blue-500 bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300":"border-gray-300 dark:border-slate-600 hover:border-blue-400 text-gray-600 dark:text-gray-300"}`,children:s?"✓ In diagram — click to remove":"+ Add to diagram"}),o.description&&d.jsx("p",{className:"text-xs text-gray-600 dark:text-gray-300 leading-relaxed",children:o.description}),o.referencedBy.length>0&&d.jsxs("section",{children:[d.jsxs(Sr,{children:["Referenced by (",o.referencedBy.length,")"]}),d.jsx("ul",{className:"space-y-0.5",children:o.referencedBy.map((h,g)=>d.jsxs("li",{className:"text-xs",children:[d.jsx("button",{onClick:()=>c(h.classId),className:"text-blue-600 dark:text-blue-400 hover:underline cursor-pointer",children:h.classId}),d.jsxs("span",{className:"text-gray-400",children:[".",h.slotName]})]},`${h.classId}.${h.slotName}-${g}`))})]}),o.slots.length>0&&d.jsxs("section",{children:[d.jsxs(Sr,{children:[f," (",o.slots.length,")"]}),d.jsx("ul",{className:"divide-y divide-gray-100 dark:divide-slate-700",children:o.slots.map((h,g)=>d.jsxs("li",{className:"py-1.5",children:[d.jsxs("div",{className:"flex items-baseline gap-1.5 flex-wrap",children:[d.jsx("span",{className:"text-xs font-medium text-gray-800 dark:text-gray-100",children:h.name}),d.jsx(Fm,{range:h.range,onNavigate:c,dataService:t})]}),h.description&&d.jsx("p",{className:"mt-0.5 text-[11px] text-gray-500 dark:text-gray-400 leading-snug break-words",children:h.description})]},`${h.name}-${g}`))})]})]}):d.jsxs("div",{className:"p-3 text-xs text-gray-500",children:["Entity not found: ",e]})]})}function Sr({children:e}){return d.jsx("div",{className:"text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-1",children:e})}function Fm({range:e,onNavigate:t,dataService:n}){const i=n.getRangeKind(e),s=i==="class"&&n.itemExists(e),o=`inline-block px-1 py-0 rounded text-[11px] font-medium ${i==="type"?"bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300":i==="enum"?"bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300":"bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"}`;return s?d.jsx("button",{onClick:()=>t(e),className:`${o} hover:underline cursor-pointer`,children:e}):d.jsx("span",{className:o,children:e})}const _m=[{heading:"One rule at a time",cases:[{name:"Rule 1 — multivalued owns forward",note:"A multivalued slot means the owner has-a collection, so ownership runs forward: Questionnaire.items and ResearchStudy.consents. The two `part_of` self-loops are the counterexample — multivalued but drawn backward, because they walk UP a tree.",sel:["ResearchStudy","Consent","Questionnaire","QuestionnaireItem"]},{name:"Rule 2 — single-valued belongs backward",note:"The largest group (70 edges). Participant fans OUT to 22 targets, nearly all reversed: each target declares `associated_participant` and is drawn as belonging to Participant. This is the group that would move if own-bkwd merges into association.",sel:["Participant","Condition","Demography","Exposure","Procedure","Visit"]},{name:"Exception 2a — no independent existence",note:"Single-valued, but forward anyway: Quantity, TimePoint and the like have no identity of their own, so the value belongs to whoever holds it rather than owning the holder.",sel:["SpecimenStorageActivity","Quantity","TimePoint","Activity"]},{name:"Entity-ranged — always forward",note:"The twelve focus / associated_evidence slots range on Entity, the universal root. A pointer AT the root is never a foreign key back to an owner, so these run forward whatever their cardinality. Both single- and multi-valued focus sites are here — all should point AT Entity.",sel:["Observation","ObservationSet","MeasurementObservation","Document","Condition","SdohObservation","Entity"]},{name:"Association — no ownership claim",note:"Both associations in the schema: Document.related_document → Specimen, and SpecimenContainer.container → SpecimenStorageActivity. Slate and dashed, arrowed at both ends. They are listed explicitly because they are multivalued, so Rule 1 would otherwise call them ownership.",sel:["Document","Specimen","SpecimenContainer","SpecimenStorageActivity"]},{name:"Self-loops",note:"The five self-owning slots (TimePoint.index_time_point, File.derived_from, Specimen.parent_specimen, ResearchStudy.part_of, SpecimenContainer.parent_container) — loop markers, not routed edges. ResearchStudy also pulls in its TimePoint edges; the loops are the circular arrows on the rows.",sel:["TimePoint","File","Specimen","ResearchStudy","SpecimenContainer"]}]},{heading:"Inheritance (merged sibling boxes)",cases:[{name:"One child, merged with its parent",note:"MeasurementObservation alone. It still merges: the box is titled Observation, its 13 inherited rows sit at the top in black, and MeasurementObservation's own 9 follow under its coloured header. Merging does not wait for a second sibling — a class must not change shape because of what else you happen to select.",sel:["MeasurementObservation"]},{name:"Children that add nothing",note:'SpecimenQuality- and SpecimenQuantityObservation declare no slots of their own. Both still get a header under the shared rows, because "this subclass adds nothing" is the answer to what they are — and without the headers the selection would leave no trace in the box at all.',sel:["SpecimenQualityObservation","SpecimenQuantityObservation"]},{name:"slot_usage — same name, different type",note:"QuestionnaireResponseValue's five children each narrow `value` to a different type (boolean, decimal, integer, TimePoint, and the parent's string). That narrowing is the entire reason the five classes exist, so each keeps its OWN row rather than merging into the parent's — the one place a shared row would be a lie.",sel:["QuestionnaireResponseValueBoolean","QuestionnaireResponseValueDecimal","QuestionnaireResponseValueInteger","QuestionnaireResponseValueString","QuestionnaireResponseValueTimePoint"]},{name:"The full Observation family",note:"All five Observation subclasses plus the parent. One box where there would be six, and the shared rows are stated once. Note each edge leaves in the colour of the child that owns its row; inherited slots' edges are the parent's and are drawn once, not once per child.",sel:["Observation","MeasurementObservation","SdohObservation","DimensionalObservation","SpecimenQualityObservation","SpecimenQuantityObservation"]}]},{heading:"The bare diagonal",cases:[{name:"BodySite 6-way (the original)",note:"The reproducer from the handoff. In ⌙ (bend) the top approach arrives as a straight diagonal with no steps; in ⋙ (near) it keeps its horizontal run. This is the case the fix has to fix.",sel:["BodySite","Condition","Consent","Demography","Exposure","Observation","Procedure","ImagingFile","ImagingStudy","MeasurementObservation","SpecimenCreationActivity"]},{name:"BodySite, owners only",note:"The same convergence with nothing else on canvas — six owners, no unrelated boxes for a diagonal to cut across. Shows whether the degeneracy is about the convergence itself or about crowding.",sel:["BodySite","Condition","ImagingFile","ImagingStudy","MeasurementObservation","Procedure","SpecimenCreationActivity"]},{name:"TimePoint 16-edge",note:"Densest corridor in the schema: 8 owners but 16 slot-edges, since each Specimen*Activity owns date_started and date_ended. Also where the second-from-top edge goes diagonal and pair edges cross.",sel:["TimePoint","Consent","ResearchStudy","TimePeriod","SpecimenCreationActivity","SpecimenProcessingActivity","SpecimenStorageActivity","SpecimenTransportActivity","QuestionnaireResponseValueTimePoint"]},{name:"TimePoint + Person (crossing)",note:"Siggie's repro for the crossing bug: the paired date_started / date_ended edges from different owners cross each other on the way in. Compare pair ordering against the case above.",sel:["TimePoint","Person","Consent","ResearchStudy","TimePeriod","SpecimenCreationActivity","SpecimenProcessingActivity","SpecimenStorageActivity","SpecimenTransportActivity","QuestionnaireResponseValueTimePoint"]}]},{heading:"Pathological convergences",cases:[{name:"Quantity 19-edge (worst case)",note:"The largest convergence in the schema: 16 owning classes, 19 slot-edges. The fan is squeezed hardest here, so ENTITY_FAN_GAP and the merge distance both show their limits.",sel:["Quantity","Activity","Assay","DeviceExposure","DimensionalObservation","DrugExposure","MeasurementObservation","Observation","Procedure","SdohObservation","SpecimenCreationActivity","SpecimenProcessingActivity","SpecimenQualityObservation","SpecimenQuantityObservation","SpecimenStorageActivity","SpecimenTransportActivity","Substance"]},{name:"Context 6-way (uniform owners)",note:"Six owners that are all observation classes — same size, same shape, similar row counts. The controlled comparison for BodySite, whose owners vary wildly in height.",sel:["Context","DimensionalObservation","MeasurementObservation","Observation","SdohObservation","SpecimenQualityObservation","SpecimenQuantityObservation"]},{name:"Two convergences at once",note:"Quantity and TimePoint both converge from the same Specimen activity classes, so two corridors compete for the same space. Where merge distance trades off against crossings.",sel:["Quantity","TimePoint","SpecimenCreationActivity","SpecimenProcessingActivity","SpecimenStorageActivity","SpecimenTransportActivity"]}]},{heading:"Flipped divergences (found via the legend)",cases:[{name:"Participant 22-way (largest fan in the schema)",note:"Bigger than any inbound convergence: 22 edges leaving Participant, 21 of them FLIPPED. Flipped edges keep their attribute-row anchor and must not merge, so this is the fan the merge code deliberately does not touch — and therefore the one nothing has been tuned against.",sel:["Participant","Condition","Consent","Demography","DeviceExposure","DrugExposure","Exposure","File","ImagingStudy","MeasurementObservation","Observation","Procedure","SdohObservation","Specimen","Visit"]},{name:"Visit 19-way",note:"The same shape one size down, and it overlaps Participant heavily — most classes carry both associated_participant and associated_visit, so the two fans run through the same corridor as pairs.",sel:["Visit","Condition","Demography","DeviceExposure","DrugExposure","Exposure","ImagingStudy","MeasurementObservation","Observation","Procedure","QuestionnaireResponse","SdohObservation","TimePeriod"]},{name:"Participant + Visit + Organization",note:"All three FK hubs at once (22 + 19 + 11 edges, nearly all flipped). The densest picture the schema can produce, and the stress test for anything that changes routing.",sel:["Participant","Visit","Organization","Condition","Demography","DimensionalObservation","MeasurementObservation","Observation","ObservationSet","Procedure","SdohObservation","SpecimenQualityObservation","SpecimenQuantityObservation"]},{name:"Converge and diverge at once",note:"MeasurementObservation owns BodySite/Context/Quantity while being owned by Participant/Visit/Organization — edges fan IN and OUT of the same box. Where merged (entity-end) and unmerged (flipped) arrivals sit side by side.",sel:["MeasurementObservation","BodySite","Context","Quantity","Participant","Visit","Organization","MeasurementObservationSet"]}]},{heading:"Normal cases (a fix must not break these)",cases:[{name:"Single edge",note:"One owner, one edge, no convergence at all — merging is a no-op. The floor: if this looks wrong, something basic broke.",sel:["Visit","TimePeriod"]},{name:"Two owners",note:"The smallest real convergence. Two approaches, one arrowhead — the fan is barely a fan, so a merge distance that is too long is obvious here first.",sel:["Participant","Visit","ObservationSet"]},{name:"Specimen chain (deep, not wide)",note:"A long ownership chain rather than a convergence: many layers, few edges per node. Checks that tuning for convergences has not made ordinary edges worse.",sel:["Specimen","SpecimenContainer","SpecimenCreationActivity","SpecimenProcessingActivity","SpecimenStorageActivity","SpecimenTransportActivity","Participant"]},{name:"The known 3-node cycle",note:"Specimen -> SpecimenStorageActivity -> SpecimenContainer -> Specimen: an association plus two ownership edges. Known and deliberately unhandled; here so it stays visible.",sel:["Specimen","SpecimenStorageActivity","SpecimenContainer"]},{name:"Backward ownership (own-bkwd)",note:"Slots drawn backward (performed_by, associated_person, contained_in, related_imaging_study). These keep their attribute-row anchor and must NOT merge — check the arrowheads.",sel:["Organization","Person","Participant","ImagingFile","ImagingStudy","SpecimenContainer","Specimen"]},{name:"Path to root",note:"Path-to-root on from a single deep class, which pulls in every owner up the chain. The biggest graph reachable in one click.",sel:["MeasurementObservation"],roots:!0}]}],Hm=3,fi=40;function Hl(){const[e,t]=y.useState(null),n=y.useCallback(s=>{if(s.button!==0||s.target.closest('button, a, input, select, textarea, [role="button"], [data-no-drag]'))return;const o=(s.currentTarget.closest("[data-draggable]")??s.currentTarget).getBoundingClientRect(),a=s.clientX,l=s.clientY,c={left:o.left,top:o.top},u=s.currentTarget;u.setPointerCapture(s.pointerId);let f=!1;const h=p=>{const b=p.clientX-a,m=p.clientY-l;if(!f&&Math.hypot(b,m)<Hm)return;f=!0;const w={left:Math.max(Math.min(c.left+b,window.innerWidth-fi),fi-o.width),top:Math.min(Math.max(c.top+m,0),window.innerHeight-fi)};t(w)},g=p=>{u.releasePointerCapture(p.pointerId),u.removeEventListener("pointermove",h),u.removeEventListener("pointerup",g),u.removeEventListener("pointercancel",g)};u.addEventListener("pointermove",h),u.addEventListener("pointerup",g),u.addEventListener("pointercancel",g)},[]),i=y.useCallback(()=>t(null),[]);return{offset:e,onPointerDown:n,reset:i}}const $s={legend:30,cases:26},Wm=1,zm=$s.legend+Wm;function Wl({title:e,subtitle:t,onClose:n,offset:i,widthRem:s=$s.cases,children:r}){const o=Hl();y.useEffect(()=>{const l=c=>{c.key==="Escape"&&n()};return window.addEventListener("keydown",l),()=>window.removeEventListener("keydown",l)},[n]);const a=o.offset!==null;return d.jsxs("div",{"data-draggable":"",style:{resize:"both",width:`${s}rem`,maxWidth:"calc(100vw - 2rem)",maxHeight:o.offset?`calc(100vh - ${o.offset.top}px - 1rem)`:"calc(100vh - 4.5rem)",...o.offset?{position:"fixed",...o.offset,right:"auto"}:!a&&i?{right:`${zm}rem`}:{}},className:`z-30 overflow-y-auto
                  rounded-lg border border-gray-300 dark:border-slate-600
                  bg-white dark:bg-slate-800 shadow-xl
                  text-gray-900 dark:text-gray-100
                  ${a?"":`absolute top-14 ${i?"":"right-4"}`}`,children:[d.jsxs("div",{onPointerDown:o.onPointerDown,className:`sticky top-0 flex items-baseline justify-between gap-2 px-4 py-2
                   border-b border-gray-200 dark:border-slate-700
                   bg-white dark:bg-slate-800 cursor-grab active:cursor-grabbing
                   select-none`,children:[d.jsxs("div",{children:[d.jsx("h2",{className:"text-sm font-semibold",children:e}),t&&d.jsx("p",{className:"text-[11px] text-gray-500 dark:text-gray-400",children:t})]}),d.jsxs("div",{className:"flex items-center gap-1 shrink-0",children:[a&&d.jsx("button",{onClick:o.reset,title:"Put it back",className:`text-gray-400 hover:text-gray-700 dark:hover:text-gray-200
                         text-xs leading-none px-1`,children:"⤺"}),d.jsx("button",{onClick:n,title:"Close (Esc)",className:"text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-lg leading-none",children:"×"})]})]}),d.jsx("div",{className:"px-4 py-2",children:r})]})}function Gm(e,t){return e.sel.length===t.size&&e.sel.every(n=>t.has(n))}function Um({onClose:e,onApply:t,selectedIds:n,dataService:i,offset:s}){const r=y.useMemo(()=>i.getConvergenceRanking(),[i]),o=y.useMemo(()=>i.getDivergenceRanking(),[i]),a=l=>t({name:"ad hoc",note:"",sel:l});return d.jsxs(Wl,{title:"Example cases",subtitle:"Selections worth looking at, simple to dense.",onClose:e,offset:s,children:[d.jsxs("section",{className:"mb-4",children:[d.jsx(Cr,{children:"Biggest fans"}),d.jsx("p",{className:"text-[11px] text-gray-500 dark:text-gray-400 mb-1.5",children:"Counted in slot-edges, not classes: one class owning a target through two slots crowds the corridor twice. Click a row to load just that fan."}),d.jsx("div",{className:"grid grid-cols-2 gap-3",children:[["Converging (in)",r.slice(0,6).map(l=>({entity:l.entity,n:l.edgeCount,peers:l.owners,flipped:0}))],["Diverging (out)",o.slice(0,6).map(l=>({entity:l.entity,n:l.edgeCount,peers:l.owned,flipped:l.flippedCount}))]].map(([l,c])=>d.jsxs("div",{children:[d.jsx("h4",{className:"text-[10px] font-medium text-gray-500 dark:text-gray-400 mb-0.5",children:l}),d.jsx("ul",{className:"space-y-0.5",children:c.map(u=>d.jsx("li",{children:d.jsxs("button",{onClick:()=>a([u.entity,...u.peers]),title:`Select ${u.entity} and all ${u.peers.length} peers`,className:"w-full text-left text-xs hover:bg-gray-50 dark:hover:bg-slate-700 rounded px-1",children:[d.jsx("span",{className:"text-blue-600 dark:text-blue-400",children:u.entity}),d.jsxs("span",{className:"text-gray-400 ml-1",children:[u.n,u.flipped>0?` (${u.flipped} flipped)`:""]})]})},u.entity))})]},l))})]}),_m.map(l=>d.jsxs("section",{className:"mb-3 last:mb-1",children:[d.jsx(Cr,{children:l.heading}),d.jsx("ul",{className:"space-y-1.5",children:l.cases.map(c=>{const u=Gm(c,n);return d.jsx("li",{children:d.jsxs("button",{onClick:()=>t(c),className:`block w-full text-left rounded px-2 py-1 border
                      ${u?"border-blue-500 bg-blue-50 dark:bg-blue-950":"border-transparent hover:bg-gray-50 dark:hover:bg-slate-700"}`,children:[d.jsx("span",{className:`text-xs font-medium ${u?"text-blue-700 dark:text-blue-300":"text-blue-600 dark:text-blue-400"}`,children:c.name}),d.jsxs("span",{className:"ml-1.5 text-[10px] text-gray-400",children:[c.sel.length,c.roots?" ⇱":""]}),d.jsx("p",{className:"text-[11px] leading-snug text-gray-600 dark:text-gray-400 mt-0.5",children:c.note})]})},c.name)})})]},l.heading))]})}function Cr({children:e}){return d.jsx("h3",{className:`text-[11px] font-semibold uppercase tracking-wider
                   text-gray-400 dark:text-gray-500 mb-1`,children:e})}const pi="text-[11px] leading-snug text-gray-500 dark:text-gray-400 mb-2";function Ar({kind:e}){const t=ie.kinds[e];return d.jsxs("span",{className:"flex items-center gap-1.5 my-1 ml-4",children:[d.jsx(In,{kind:e,width:56}),d.jsx("span",{className:"font-medium",style:{color:t.color},children:t.label})]})}const Km={"own-fwd":Ke.ownFwd,"own-bkwd":Ke.ownBkwd,excluded:void 0},qm=[{glyph:"⇱ roots",what:"Also draw everything on the path up to a root."},{glyph:"LR / TB",what:"Lay the diagram out left-to-right or top-down."},{glyph:"⋙ ⋙⋙ ⌙ ≡",what:"Where converging edges join before their shared arrowhead — near the box, early, at the last corner, or not at all. Temporary, for picking one by eye."},{glyph:"+ − 1:1 ⛶",what:"Zoom in, out, reset, fit to view."}],Qm=[["0..1","optional, at most one"],["1..1","required, exactly one"],["0..*","optional, any number"],["1..*","required, one or more"]];function Ym({dataService:e,onClose:t,onSelect:n,offset:i}){const s=y.useMemo(()=>e.getOwnershipPairGroups(),[e]),[r,o]=y.useState(null),a=l=>d.jsx("button",{onClick:()=>n([l]),className:"cursor-pointer hover:underline text-blue-600 dark:text-blue-400",title:`Select ${l}`,children:l});return d.jsxs(Wl,{title:"Legend",subtitle:"What the diagram's arrows, colors and buttons mean.",onClose:t,offset:i,widthRem:$s.legend,children:[d.jsxs("div",{className:"text-xs",children:[d.jsxs(dn,{title:"Arrow direction and ownership",children:[d.jsx("p",{className:pi,children:"Edges connect entities in ownership (i.e., containment or has-a) relationships. They start at attribute rows that point to other entities and end at the header of the target entity's box."}),d.jsxs("p",{className:pi,children:["An attribute can target an entity that it ",d.jsx("b",{children:"owns"}),d.jsx(Ar,{kind:"own-fwd"}),"in which case, B appears to the right of A and the edge points forward."]}),d.jsxs("p",{className:pi,children:["Or it can target an entity that it ",d.jsx("b",{children:"belongs to"}),d.jsx(Ar,{kind:"own-bkwd"}),"in which case, B appears to the left of A and the edge points backward."]}),d.jsx("p",{className:"text-[11px] text-gray-500 dark:text-gray-400 mb-1.5",children:"Ownership direction is governed by three rules and one set of exceptions. Click any rule to view the attributes it applies to."}),d.jsx("ul",{className:"space-y-1",children:s.map(l=>{const c=`${l.verdict}/${l.rule}`,u=Km[l.verdict],f=r===c,h=wc(l.rule)!==void 0;return d.jsxs("li",{className:`border-l-2 pl-2 border-gray-200 dark:border-slate-600${h?" ml-4":""}`,children:[d.jsxs("button",{onClick:()=>o(f?null:c),"aria-expanded":f,title:f?"Hide these attributes":"List the attributes this rule applies to",className:`group w-full text-left cursor-pointer rounded px-1 -mx-1
                               hover:bg-gray-100 dark:hover:bg-slate-700`,children:[d.jsx("span",{className:u?"font-medium":"font-medium text-gray-400",style:u?{color:u}:void 0,children:l.ruleLabel}),d.jsx("span",{className:"ml-1 text-gray-400",children:l.pairs.length}),d.jsx("span",{className:`ml-1 text-gray-400 group-hover:text-gray-700
                                     dark:group-hover:text-gray-200`,children:f?"▾":"▸"})]}),d.jsx("p",{className:"text-[11px] leading-snug text-gray-600 dark:text-gray-400 mt-0.5",children:l.ruleText}),f&&d.jsx("ul",{className:"mt-1 mb-1.5 space-y-0.5 font-mono text-[10px]",children:l.pairs.map(g=>d.jsxs("li",{className:"text-gray-600 dark:text-gray-400",children:[a(g.declaredOn),d.jsxs("span",{className:"text-gray-400",children:[".",g.slotName]}),d.jsx("span",{className:"mx-1 text-gray-400",children:g.multivalued?"↠":"→"}),a(g.range),g.isLoop&&d.jsx("span",{className:"ml-1",style:{color:He.entity},children:"loop"})]},`${g.declaredOn}.${g.slotName}`))})]},c)})})]}),d.jsx(dn,{title:"Cardinality",children:d.jsx("ul",{className:"flex flex-wrap gap-x-4 gap-y-1",children:Qm.map(([l,c])=>d.jsxs("li",{className:"flex items-center gap-1.5",children:[d.jsx("span",{className:"font-mono text-[11px] text-gray-700 dark:text-gray-300",children:l}),d.jsx("span",{className:"text-[11px] text-gray-500 dark:text-gray-400",children:c})]},l))})}),d.jsxs(dn,{title:"Colors",children:[d.jsx(Pr,{caption:"A row's dot and its range label say what KIND of thing the attribute points at.",items:[{color:He.entity,label:"another entity"},{color:He.enum,label:"a value set"},{color:He.dataType,label:"a data type"}]}),d.jsxs("p",{className:"text-[11px] leading-snug text-gray-600 dark:text-gray-400 mt-2",children:["A ",d.jsx("b",{children:"filled"})," dot draws an edge; a ",d.jsx("b",{children:"hollow"})," one does not, because what it points at is not on the canvas. Only entity ranges can draw edges at all."]}),d.jsx(Pr,{className:"mt-3",caption:"Inside a merged box, a color says which entity an attribute belongs to.",items:Fr.slice(0,4).map((l,c)=>({color:l.text,swatch:l.fill,label:c===0?"the parent":`child ${c}`}))})]}),d.jsx(dn,{title:"The toolbar",children:d.jsx("ul",{className:"space-y-1",children:qm.map(l=>d.jsxs("li",{className:"flex gap-2",children:[d.jsx("span",{className:"shrink-0 font-mono text-[11px] text-gray-700 dark:text-gray-300 w-20",children:l.glyph}),d.jsx("span",{className:"text-[11px] leading-snug text-gray-600 dark:text-gray-400",children:l.what})]},l.glyph))})})]}),d.jsxs("p",{className:"text-[10px] text-gray-400 dark:text-gray-500 mt-3",children:["A box's ",d.jsx("b",{children:"“N related”"})," count is of distinct classes"," ",d.jsx("i",{children:"outside"})," it, so selecting a class that folds into a merged box can make the number go ",d.jsx("i",{children:"down"}),". Correct, if counter-intuitive."]})]})}function dn({title:e,children:t}){return d.jsxs("section",{className:"mb-4 last:mb-1",children:[d.jsx("h3",{className:`text-[11px] font-semibold uppercase tracking-wider
                     text-gray-400 dark:text-gray-500 mb-1`,children:e}),t]})}function Pr({caption:e,items:t,className:n}){return d.jsxs("div",{className:n,children:[d.jsx("p",{className:"text-[11px] text-gray-500 dark:text-gray-400 mb-1",children:e}),d.jsx("ul",{className:"flex flex-wrap gap-x-3 gap-y-1",children:t.map(i=>d.jsxs("li",{className:"flex items-center gap-1",children:[d.jsx("span",{className:"inline-block w-3 h-3 rounded-sm border",style:{background:i.swatch??i.color,borderColor:i.color}}),d.jsx("span",{className:"text-[11px]",style:{color:i.color},children:i.label})]},i.label))})]})}const Xm=!1,Zm=!1,zl=y.createContext(null);function ht(){const e=y.useContext(zl);if(!e)throw new Error("useHelp must be used inside <HelpProvider>");return e}const Jm=300,eg=[{id:"graph-canvas-reading",label:"Reading the diagram"},{id:"relation-bar",label:"The relation bar"},{id:"merged-boxes",label:"Inheritance and merged boxes"},{id:"node-dismiss",label:"Closing a box"},{id:"copy-link",label:"Sharing what you see"}];function tg({onOpenLegend:e,onOpenCases:t,legendOpen:n,casesOpen:i,onClosePanels:s,anyPanelOpen:r}){const{showEntry:o,showAddresses:a,toggleAddresses:l}=ht(),[c,u]=y.useState(!1),f=y.useRef(void 0),h=()=>{f.current!==void 0&&(clearTimeout(f.current),f.current=void 0)},g=()=>{h(),f.current=setTimeout(()=>u(!1),Jm)};y.useEffect(()=>h,[]),y.useEffect(()=>{if(!c)return;const b=w=>{w.target?.closest("[data-help-menu]")||u(!1)},m=w=>{w.key==="Escape"&&u(!1)};return document.addEventListener("mousedown",b,!0),document.addEventListener("keydown",m),()=>{document.removeEventListener("mousedown",b,!0),document.removeEventListener("keydown",m)}},[c]);const p=b=>()=>{u(!1),b()};return d.jsxs("span",{"data-help-menu":!0,"data-help-id":"help-menu",className:"relative",onMouseEnter:()=>{h(),u(!0)},onMouseLeave:g,children:[d.jsxs("button",{onClick:()=>u(b=>!b),title:"Legend, example cases and help topics",className:`text-sm underline hover:text-white ${c?"text-white":"text-blue-100"}`,children:["Help ",d.jsx("span",{"aria-hidden":!0,className:"opacity-70",children:"▾"})]}),c&&d.jsxs("div",{className:`absolute right-0 top-full mt-1 z-40 w-60 py-1
                     rounded-md border border-gray-300 dark:border-slate-600
                     bg-white dark:bg-slate-800 shadow-xl
                     text-gray-900 dark:text-gray-100`,children:[d.jsxs(fn,{onClick:p(e),children:[n?"Hide ownership legend":"Ownership legend",d.jsx(mi,{children:"every relationship in the schema, by rule"})]}),d.jsxs(fn,{onClick:p(t),children:[i?"Hide example cases":"Example cases",d.jsx(mi,{children:"selections worth looking at"})]}),r&&d.jsxs(fn,{onClick:p(s),children:["Close all panels",d.jsx(mi,{children:"legend, cases and the detail drawer"})]}),d.jsx(ng,{}),eg.map(b=>d.jsx(fn,{onClick:p(()=>o(b.id)),children:b.label},b.id)),Zm]})]})}function fn({onClick:e,children:t}){return d.jsx("button",{onClick:e,className:`block w-full text-left px-3 py-1.5 text-xs
                 hover:bg-gray-100 dark:hover:bg-slate-700`,children:t})}function mi({children:e}){return d.jsx("span",{className:"block text-[10px] text-gray-400 dark:text-gray-500",children:e})}function ng(){return d.jsx("div",{className:"my-1 border-t border-gray-200 dark:border-slate-700"})}function Gl(e){const t=Number(e?.trim());return Number.isFinite(t)&&t>=240?t:void 0}function Ul(e){const t=e?.trim().toLowerCase();return t==="dim"||t==="ring"||t==="none"?t:void 0}function Kl(e){const t=e?.trim().toLowerCase();return t==="left"||t==="right"||t==="top"||t==="bottom"?t:void 0}function ql(e){const t=e?.trim();if(!t)return;const n=Number(t);if(Number.isFinite(n))return{px:n};const i=t.match(/^(-)?(?:anchor|parentBox)\.(width|height)(?:\s*\*\s*(-?[\d.]+))?$/i);if(!i)return;const[,s,r,o]=i,a=o===void 0?1:Number(o);if(Number.isFinite(a))return{of:r.toLowerCase(),times:s?-a:a}}function Wt(e,t){const n=e?.trim();if(!n)return{kind:"help-id",arg:t};if(n==="none")return{kind:"none"};const i=n.indexOf(":");return i===-1?{kind:"help-id",arg:n}:{kind:n.slice(0,i).trim(),arg:n.slice(i+1).trim()}}const ig="Format",sg="Walkthrough",og=new Set([ig,"TODO"]),Ql=/^<\/?(?:details|summary)\b[^>]*>$/i;function xe(e,t){const n=t.toLowerCase();for(const i of e){const s=Pt(i);if(s){if(s.name==="beats"&&n!=="beats")return;if(s.name===n&&!s.parked)return s.value}}}function Pt(e){const t=e.trimStart().match(/^-\s+(.*)$/);if(!t)return;let n=t[1].replace(/\*\*/g,"").trim(),i=!1;if(n.startsWith("~~")){const o=n.indexOf("~~",2);if(o===-1)return;i=!0,n=o===n.length-2?n.slice(2,o):`${n.slice(2,o)}${n.slice(o+2)}`}const s=n.indexOf(":");if(s===-1)return;const r=n.slice(0,s).trim();if(/^[A-Za-z_][A-Za-z0-9_]*$/.test(r))return{name:r.toLowerCase(),value:n.slice(s+1).trim(),parked:i}}const Fs=e=>{const t=Pt(e);return t&&!t.parked?t.name:void 0},rg=new Set(["title","description","interactions","shortcut","context","anchor","spotlight","action","once","change","only","highlight","width","position","offsetx","tour","beats"]),ag=new Set(["description","anchor","spotlight","action","change","only","highlight","width","position","offsetx","keep"]),lg=new Set(["tourmetadata","tourabbr","description"]);function Yl(e,t,n,i){for(const s of e){if(!Gn(s))continue;const r=Pt(s);!r.parked&&!t.has(r.name)&&i.push(`${n}: unknown field "${r.name}" (a misspelling? to park a field, strike it through: ~~${r.name}:~~)`)}}function Gn(e){return e.length>0&&!/^\s/.test(e)&&Pt(e)!==void 0}function Xl(e,t){const n=t.toLowerCase(),i=e.findIndex(c=>Fs(c)===n);if(i===-1)return;const s=Pt(e[i]).value,r=[];for(let c=i+1;c<e.length&&!(Gn(e[c])||Ql.test(e[c].trim()));c++)r.push(e[c]);for(;r.length&&r[r.length-1].trim()==="";)r.pop();if(r.length===0)return s;const o=r.filter(c=>c.trim()!=="").map(c=>c.length-c.trimStart().length),a=Math.min(...o),l=r.map(c=>c.slice(a)).join(`
`);return s?`${s}
${l}`:l}function cg(e,t){const n=t.toLowerCase(),i=e.findIndex(r=>Fs(r)===n);if(i===-1)return[];const s=[];for(let r=i+1;r<e.length;r++){const o=e[r].trimStart();if(Gn(e[r])||o==="")break;o.startsWith("- ")&&s.push(o.slice(2).trim())}return s}function ug(e,t,n){const i=e.findIndex(a=>Fs(a)==="beats");if(i===-1)return;const s=[];let r=null;const o=()=>{r&&s.push(r)};for(let a=i+1;a<e.length;a++){const l=e[a].trimStart();if(Gn(e[a])||e[a].length>0&&!/^\s/.test(e[a])&&/^<\/?[a-z]/i.test(l))break;if(l==="")continue;const c=l.match(/^(\d+)\.\s+(.*)$/);if(c){o(),r={text:c[2].trim()};continue}const u=Pt(l);if(!u?.parked){if(u&&r){const{name:f,value:h}=u;if(!ag.has(f)){n.push(`${t} beat ${s.length+1}: unknown field "${f}" (a misspelling? to park a field, strike it through: ~~${f}:~~)`);continue}if(f==="description"){const g=e[a].length-e[a].trimStart().length,p=[];let b=a+1;for(;b<e.length;b++){if(e[b].trim()===""){p.push("");continue}if(e[b].length-e[b].trimStart().length<=g)break;p.push(e[b])}for(;p.length&&p[p.length-1].trim()==="";)p.pop();if(p.length){const m=p.filter(v=>v.trim()!=="").map(v=>v.length-v.trimStart().length),w=Math.min(...m),k=p.map(v=>v.slice(w)).join(`
`);r.description=h?`${h}
${k}`:k}else r.description=h;a=b-1;continue}f==="anchor"?r.anchor=Wt(h,t):f==="spotlight"?r.spotlight=Wt(h,t):f==="action"?r.action=h.trim():f==="change"?r.change=h.trim():f==="only"?(r.change=h.trim(),r.replace=!0):f==="highlight"?r.highlight=Ul(h):f==="width"?r.width=Gl(h):f==="position"?r.position=Kl(h):f==="offsetx"?r.offsetX=ql(h):f==="keep"&&(r.keep=h.trim()!=="false");continue}r&&!l.startsWith("-")&&(r.text=`${r.text} ${l}`.trim())}}return o(),s.length>0?s:void 0}function hg(e,t,n){const i=e.split(`
`),r=i[0].match(/^###\s+(.+)$/);if(!r)return null;const o=r[1].trim();Yl(i,rg,o,n);const a=xe(i,"Title")??o,l=Xl(i,"Description")??"",c=cg(i,"Interactions"),u=xe(i,"Shortcut"),f=xe(i,"Context"),h=Wt(xe(i,"Anchor"),o),g=xe(i,"Spotlight"),p=g===void 0?void 0:Wt(g,o),b=xe(i,"Action"),m=xe(i,"Once"),w=xe(i,"Only"),k=xe(i,"Change"),v=k??w,x=k===void 0&&w!==void 0?!0:void 0,C=Ul(xe(i,"Highlight")),D=Gl(xe(i,"Width")),T=Kl(xe(i,"Position")),P=ql(xe(i,"OffsetX")),E=ug(i,o,n),L=xe(i,"Tour");return{id:o,title:a,description:l,interactions:c,shortcut:u,context:f,anchor:h,action:b,once:m,change:v,replace:x,highlight:C,width:D,position:T,offsetX:P,tour:L===void 0?void 0:L||sg,order:t,beats:E,...p?{spotlight:p}:{}}}function dg(e,t,n){const i=e.split(`
`),s=i.findIndex(p=>/^##\s+/.test(p)),r=s===-1?null:i[s].match(/^##\s+(.+)$/),o=r?r[1].trim():"Unknown",a=o.toLowerCase().replace(/[^a-z0-9]+/g,"-"),l=[];for(let p=s+1;p<i.length&&!i[p].startsWith("### ");p++)Ql.test(i[p].trim())||l.push(i[p]);const c=l.join(`
`).trim();Yl(l,lg,`section "${o}"`,n);const u=xe(l,"TourMetadata"),f=u===void 0?void 0:{name:u||o,description:Xl(l,"Description")?.trim()??"",abbr:xe(l,"TourAbbr")?.trim()||void 0},h=[],g=e.split(/(?=^### )/m);for(const p of g){if(!p.startsWith("### "))continue;const b=hg(p.trim(),t(),n);b&&h.push(b)}return{id:a,title:o,body:c,entries:h,tourMeta:f}}function ss(e){const t=new Set;for(const n of[...e.entries.values()].sort((i,s)=>i.order-s.order))n.tour&&t.add(n.tour);return[...t]}function Zl(e,t){const n=t??ss(e)[0];return[...e.entries.values()].filter(i=>i.tour!==void 0&&i.tour===n).sort((i,s)=>i.order-s.order)}function gi(e,t){return t<0?e:`${e} ▸${t+1}`}function yi(e){return`### ${e}`}function os(e,t){const n=[];return Zl(e,t).forEach((i,s)=>{const r=s+1;if(!i.beats||i.beats.length===0){n.push({entry:i,step:r,beatIndex:0,beatCount:0,address:gi(i.id,-1),searchFor:yi(i.id),blocks:[i.description],text:i.description,anchor:i.anchor,...i.spotlight?{spotlight:i.spotlight}:{},action:i.action,change:i.change,replace:i.replace,highlight:i.highlight,width:i.width,position:i.position,offsetX:i.offsetX});return}let o=i.description?[i.description]:[];o.length>0&&n.push({entry:i,step:r,beatIndex:-1,beatCount:i.beats.length,address:gi(i.id,-1),searchFor:yi(i.id),blocks:o,text:o.join(`

`),anchor:i.anchor,...i.spotlight?{spotlight:i.spotlight}:{},action:i.action,change:i.change,replace:i.replace,highlight:i.highlight,width:i.width,position:i.position,offsetX:i.offsetX});let a=i.width;i.beats.forEach((l,c)=>{const u=l.description??"";o=l.keep?[...o,u]:[u],l.width!==void 0&&(a=l.width),n.push({entry:i,step:r,beatIndex:c,beat:l,beatCount:i.beats.length,address:gi(i.id,c),searchFor:yi(i.id),blocks:o,text:o.join(`

`),anchor:l.anchor??i.anchor,...l.spotlight??i.spotlight?{spotlight:l.spotlight??i.spotlight}:{},action:l.action,highlight:l.highlight??i.highlight,width:a,position:l.position??i.position,offsetX:l.offsetX??i.offsetX,change:l.change,replace:l.replace})})}),n}function fg(e){const n=e.replace(/<!--[\s\S]*?-->/g,"").trim().split(/(?=^## )/m).map(l=>l.trim()).filter(Boolean),i=[],s=new Map,r=[];let o=0;for(const l of n){if(!l.match(/^## /m))continue;const c=l.match(/^##\s+(.+)$/m)?.[1].trim();if(c&&og.has(c))continue;const u=dg(l,()=>o++,r);i.push(u);for(const f of u.entries)s.set(f.id,f)}const a=new Map;for(const l of i)l.tourMeta&&a.set(l.tourMeta.name,l.tourMeta);return r.length&&console.warn(`[help-content] ${r.length} problem(s):
  ${r.join(`
  `)}`),{sections:i,entries:s,tourMeta:a,problems:r}}const pg=/\{\{\s*([a-z][a-z0-9-]*)\s*:\s*([^}]*?)\s*\}\}/gi;function mg(e,t){return!t||!e.includes("{{")?e:e.replace(pg,(n,i,s)=>t[i.toLowerCase()]?.(s)??n)}function Er(e){const t=new Set;return e.map((n,i)=>({p:n,index:i})).filter(({p:n})=>t.has(n.step)?!1:(t.add(n.step),!0)).map(({p:n,index:i})=>({index:i,step:n.step,title:n.entry.title,beatCount:n.beatCount}))}function Jl({scope:e,onClose:t}){const{content:n,tours:i,tourMeta:s,tourName:r,tourIndex:o,positions:a,position:l,goToStep:c,startTour:u}=ht();y.useEffect(()=>{const m=w=>{w.key==="Escape"&&(w.stopPropagation(),w.preventDefault(),t())};return window.addEventListener("keydown",m,!0),()=>window.removeEventListener("keydown",m,!0)},[t]);const f=y.useRef(null);y.useEffect(()=>{const m=f.current;if(!(!m||typeof m.showPopover!="function"))return m.showPopover(),()=>{m.matches(":popover-open")&&m.hidePopover()}},[]);const h=y.useMemo(()=>e==="all"?i.map(m=>({name:m,rows:Er(os(n,m))})):[],[e,i,n]),g=l?.step,p=o===null?void 0:r,b=(m,w,k)=>d.jsxs("button",{onClick:k,"aria-current":w?"step":void 0,className:`help-map-step${w?" help-map-step-here":""}`,children:[d.jsx("span",{className:"help-map-num",children:m.step}),d.jsx("span",{className:"help-map-title",children:m.title}),m.beatCount>0&&d.jsx("span",{className:"help-map-beats",title:`${m.beatCount+1} screens in this step`,children:m.beatCount+1})]},m.index);return Br.createPortal(d.jsx("div",{ref:f,popover:"manual",className:"help-map-backdrop",onMouseDown:t,children:d.jsxs("div",{role:"dialog","aria-label":e==="all"?"All tours":"Tour outline",className:"help-map",onMouseDown:m=>m.stopPropagation(),children:[d.jsxs("div",{className:"help-map-head",children:[d.jsxs("div",{children:[d.jsx("h2",{children:e==="all"?"Tours":p??"This tour"}),d.jsx("p",{children:e==="all"?"Every guided walk, and what is in it. Click any step to start there.":"Click any step to jump to it."})]}),d.jsx("button",{onClick:t,title:"Close (Esc)",className:"help-map-close",children:"✕"})]}),d.jsx("div",{className:"help-map-body",children:e==="tour"?Er(a).map(m=>b(m,m.step===g,()=>{c(m.index),t()})):h.map(({name:m,rows:w})=>d.jsxs("section",{className:"help-map-tour",children:[d.jsx("button",{className:"help-map-tourname",onClick:()=>{u(m),t()},children:m}),s.get(m)?.description&&d.jsx("p",{className:"help-map-blurb",children:s.get(m).description}),w.map(k=>b(k,p===m&&k.step===g,()=>{p===m?c(k.index):u(m,k.index),t()}))]},m))})]})}),document.body)}function gg(){const{tours:e,tourMeta:t,startTour:n}=ht(),[i,s]=y.useState(!1),{overviewOpen:r,setOverviewOpen:o}=ht(),a=y.useRef(null);return y.useEffect(()=>{if(!i)return;const l=u=>{u.target?.closest("[data-tour-chooser]")||s(!1)},c=u=>{u.key==="Escape"&&s(!1)};return document.addEventListener("mousedown",l,!0),document.addEventListener("keydown",c),()=>{document.removeEventListener("mousedown",l,!0),document.removeEventListener("keydown",c)}},[i]),e.length===0?null:d.jsxs("span",{"data-tour-chooser":!0,"data-help-id":"tour-chooser",className:"relative",onMouseEnter:()=>s(!0),children:[d.jsx("button",{onClick:()=>{s(!1),o(!0)},title:"Guided walks through the app and the model; click for the overview",className:`text-sm font-semibold px-2.5 py-1 rounded-full bg-white/95
                   text-blue-700 shadow-sm hover:bg-white hover:shadow`,children:"Guided tours"}),i&&d.jsxs("div",{ref:a,role:"dialog","aria-label":"Guided tours",className:`absolute right-0 top-full mt-1 z-40 w-80 p-1
                     rounded-md border border-gray-300 dark:border-slate-600
                     bg-white dark:bg-slate-800 shadow-xl
                     text-gray-900 dark:text-gray-100`,children:[d.jsxs("p",{className:"px-3 pt-2 pb-1 text-[11px] text-gray-500 dark:text-gray-400",children:["Each one stands on its own. Leave any tour with ",d.jsx("kbd",{children:"Esc"}),"."]}),d.jsxs("button",{"data-tour-overview":!0,onClick:()=>{s(!1),o(!0)},className:`block w-full text-left px-3 py-2 rounded
                       hover:bg-gray-100 dark:hover:bg-slate-700`,children:[d.jsx("span",{className:"block text-xs font-semibold",children:"Overview"}),d.jsxs("span",{className:"block text-[11px] text-gray-500 dark:text-gray-400",children:["All ",e.length," tours and every step in them — start anywhere."]})]}),d.jsx("div",{className:"my-1 border-t border-gray-200 dark:border-slate-700"}),e.map(l=>d.jsxs("button",{onClick:()=>{s(!1),n(l)},className:`block w-full text-left px-3 py-2 rounded
                         hover:bg-gray-100 dark:hover:bg-slate-700`,children:[d.jsx("span",{className:"block text-xs font-semibold",children:l}),t.get(l)?.description&&d.jsx("span",{className:"block text-[11px] text-gray-500 dark:text-gray-400",children:t.get(l).description})]},l))]}),r&&d.jsx(Jl,{scope:"all",onClose:()=>o(!1)})]})}const yg="dmvd.help.showAddresses";function bg(){const e=document.activeElement;return e instanceof HTMLInputElement||e instanceof HTMLTextAreaElement||e?.getAttribute("contenteditable")==="true"}function wg(e,t){if(!t)return e;const n=r=>mg(r,t),i=r=>r===void 0?void 0:n(r),s=new Map([...e.entries].map(([r,o])=>[r,{...o,description:n(o.description),interactions:o.interactions.map(n),action:i(o.action),context:i(o.context),beats:o.beats?.map(a=>({...a,description:i(a.description),action:i(a.action)}))}]));return{sections:e.sections.map(r=>({...r,entries:r.entries.map(o=>s.get(o.id)??o),tourMeta:r.tourMeta&&{...r.tourMeta,description:n(r.tourMeta.description)}})),entries:s,tourMeta:new Map([...e.tourMeta].map(([r,o])=>[r,{...o,description:n(o.description)}]))}}function xg({markdown:e,onPushChange:t,onPopChange:n,onJumpChanges:i,onTourStart:s,onTourEnd:r,textResolvers:o,widgets:a,colors:l,centerOn:c,children:u}){const[f,h]=y.useState(),g=f??o,p=y.useMemo(()=>wg(fg(e),g),[e,g]),[b,m]=y.useState(!1),[w,k]=y.useState(null),[v,x]=y.useState(void 0),[C,D]=y.useState(!1),T=y.useMemo(()=>ss(p),[p]),P=y.useMemo(()=>os(p,v),[p,v]),E=y.useMemo(()=>Zl(p,v).length,[p,v]),[L,I]=y.useState(null),[B,O]=y.useState(()=>!1),_=y.useCallback(()=>{O(q=>{const Q=!q;try{window.localStorage.setItem(yg,Q?"1":"0")}catch{}return Q})},[]),S=y.useCallback(()=>{m(!1),I(null)},[]),z=y.useCallback(()=>I(null),[]),fe=y.useCallback(q=>I(q),[]),N=y.useCallback(q=>{const Q=P[q];Q&&(k(q),I(Q.entry.id),Q.change!=null&&t&&t(Q.change,Q.replace))},[P,t]),G=y.useCallback(q=>{P[q+1]?.change!=null&&n&&n();const ne=P[q];ne&&(k(q),I(ne.entry.id))},[P,n]),j=y.useCallback(q=>{if(w===null||q===w)return;const Q=P[q];if(Q&&i){if(q>w){const ne=P.slice(w+1,q+1).filter(ae=>ae.change!=null).map(ae=>({query:ae.change,replace:ae.replace}));i(ne,0)}else{const ne=P.slice(q+1,w+1).filter(ae=>ae.change!=null).length;i([],ne)}k(q),I(Q.entry.id)}},[w,P,i]),X=y.useCallback((q=ss(p)[0],Q=0)=>{m(!1),x(q);const ne=os(p,q),ae=Math.min(Math.max(Q,0),Math.max(ne.length-1,0)),we=ne[ae];if(!we)return;s?.(),k(ae),I(we.entry.id);const Le=ne.slice(0,ae+1).filter(Ne=>Ne.change!=null).map(Ne=>({query:Ne.change,replace:Ne.replace}));ae>0&&i?i(Le,0):we.change!=null&&t&&t(we.change,we.replace)},[p,t,i,s]),oe=y.useCallback(()=>{k(null),I(null),x(void 0),r?.()},[r]),re=y.useCallback(()=>{w!==null&&(w+1>=P.length?oe():N(w+1))},[w,P.length,N,oe]),Me=y.useCallback(()=>{w!==null&&w>0&&G(w-1)},[w,G]),be=y.useCallback(()=>{w!==null&&oe(),I(null)},[w,oe]),Pe=y.useCallback(q=>{if(!q)return null;const{kind:Q}=q;if(Q==="none")return null;const{arg:ne}=q,ae=Q==="help-id"?ne:`${Q}:${ne}`,we=document.querySelectorAll(`[data-help-id="${CSS.escape(ae)}"]`);return we.length<2?we[0]??null:[...we].find(Le=>Le.getBoundingClientRect().height>0)??we[0]},[]);y.useEffect(()=>(document.body.classList.toggle("help-mode",b),()=>{document.body.classList.remove("help-mode")}),[b]),y.useEffect(()=>{if(b)return window.addEventListener("blur",S),()=>window.removeEventListener("blur",S)},[b,S]),y.useEffect(()=>{if(!b)return;function q(Q){const ne=Q.target;if(!ne)return;const ae=ne.closest("[data-help-id]");ae?(Q.stopPropagation(),Q.preventDefault(),fe(ae.getAttribute("data-help-id"))):ne.closest("[data-help-popover]")||z()}return document.addEventListener("click",q,!0),()=>document.removeEventListener("click",q,!0)},[b,fe,z]),y.useEffect(()=>{function q(Q){if(Q.key==="?"&&!bg()){Q.preventDefault(),w===null?D(ne=>!ne):oe();return}if(Q.key==="Escape"&&(b||w!==null||L)){Q.preventDefault(),Q.stopPropagation(),L&&w===null?z():w!==null?oe():be();return}w!==null&&(Q.key==="ArrowRight"&&(Q.preventDefault(),re()),Q.key==="ArrowLeft"&&(Q.preventDefault(),Me()))}return document.addEventListener("keydown",q,!0),()=>document.removeEventListener("keydown",q,!0)},[b,w,L,be,z,oe,re,Me]);const ve=y.useCallback(()=>c?Pe(Wt(c,c))?.getBoundingClientRect()??null:null,[c,Pe]),Se=y.useMemo(()=>({setTextResolvers:h,helpMode:b,toggleHelpMode:be,exitHelpMode:S,tourIndex:w,startTour:X,endTour:oe,nextStep:re,prevStep:Me,goToStep:j,positions:P,position:w===null?void 0:P[w],stepCount:E,tours:T,tourName:v,tourMeta:p.tourMeta,overviewOpen:C,setOverviewOpen:D,...a?{widgets:a}:{},...l?{colors:l}:{},showAddresses:B,toggleAddresses:_,content:p,activeId:L,showEntry:fe,dismissEntry:z,resolveAnchor:Pe,centerRect:ve}),[b,be,S,w,X,oe,re,Me,j,P,E,T,v,C,a,l,B,_,p,L,fe,z,Pe,ve]);return d.jsx(zl.Provider,{value:Se,children:u})}function Dr(e,t){const n=String(e);if(typeof t!="string")throw new TypeError("Expected character");let i=0,s=n.indexOf(t);for(;s!==-1;)i++,s=n.indexOf(t,s+t.length);return i}const vg=["AElig","AMP","Aacute","Acirc","Agrave","Aring","Atilde","Auml","COPY","Ccedil","ETH","Eacute","Ecirc","Egrave","Euml","GT","Iacute","Icirc","Igrave","Iuml","LT","Ntilde","Oacute","Ocirc","Ograve","Oslash","Otilde","Ouml","QUOT","REG","THORN","Uacute","Ucirc","Ugrave","Uuml","Yacute","aacute","acirc","acute","aelig","agrave","amp","aring","atilde","auml","brvbar","ccedil","cedil","cent","copy","curren","deg","divide","eacute","ecirc","egrave","eth","euml","frac12","frac14","frac34","gt","iacute","icirc","iexcl","igrave","iquest","iuml","laquo","lt","macr","micro","middot","nbsp","not","ntilde","oacute","ocirc","ograve","ordf","ordm","oslash","otilde","ouml","para","plusmn","pound","quot","raquo","reg","sect","shy","sup1","sup2","sup3","szlig","thorn","times","uacute","ucirc","ugrave","uml","uuml","yacute","yen","yuml"],Mr={0:"�",128:"€",130:"‚",131:"ƒ",132:"„",133:"…",134:"†",135:"‡",136:"ˆ",137:"‰",138:"Š",139:"‹",140:"Œ",142:"Ž",145:"‘",146:"’",147:"“",148:"”",149:"•",150:"–",151:"—",152:"˜",153:"™",154:"š",155:"›",156:"œ",158:"ž",159:"Ÿ"};function ec(e){const t=typeof e=="string"?e.charCodeAt(0):e;return t>=48&&t<=57}function kg(e){const t=typeof e=="string"?e.charCodeAt(0):e;return t>=97&&t<=102||t>=65&&t<=70||t>=48&&t<=57}function Tg(e){const t=typeof e=="string"?e.charCodeAt(0):e;return t>=97&&t<=122||t>=65&&t<=90}function Or(e){return Tg(e)||ec(e)}const Sg=["","Named character references must be terminated by a semicolon","Numeric character references must be terminated by a semicolon","Named character references cannot be empty","Numeric character references cannot be empty","Named character references must be known","Numeric character references cannot be disallowed","Numeric character references cannot be outside the permissible Unicode range"];function _s(e,t){const n=t||{},i=typeof n.additional=="string"?n.additional.charCodeAt(0):n.additional,s=[];let r=0,o=-1,a="",l,c;n.position&&("start"in n.position||"indent"in n.position?(c=n.position.indent,l=n.position.start):l=n.position);let u=(l?l.line:0)||1,f=(l?l.column:0)||1,h=p(),g;for(r--;++r<=e.length;)if(g===10&&(f=(c?c[o]:0)||1),g=e.charCodeAt(r),g===38){const w=e.charCodeAt(r+1);if(w===9||w===10||w===12||w===32||w===38||w===60||Number.isNaN(w)||i&&w===i){a+=String.fromCharCode(g),f++;continue}const k=r+1;let v=k,x=k,C;if(w===35){x=++v;const O=e.charCodeAt(x);O===88||O===120?(C="hexadecimal",x=++v):C="decimal"}else C="named";let D="",T="",P="";const E=C==="named"?Or:C==="decimal"?ec:kg;for(x--;++x<=e.length;){const O=e.charCodeAt(x);if(!E(O))break;P+=String.fromCharCode(O),C==="named"&&vg.includes(P)&&(D=P,T=Ys(P))}let L=e.charCodeAt(x)===59;if(L){x++;const O=C==="named"?Ys(P):!1;O&&(D=P,T=O)}let I=1+x-k,B="";if(!(!L&&n.nonTerminated===!1))if(!P)C!=="named"&&b(4,I);else if(C==="named"){if(L&&!T)b(5,1);else if(D!==P&&(x=v+D.length,I=1+x-v,L=!1),!L){const O=D?1:3;if(n.attribute){const _=e.charCodeAt(x);_===61?(b(O,I),T=""):Or(_)?T="":b(O,I)}else b(O,I)}B=T}else{L||b(2,I);let O=Number.parseInt(P,C==="hexadecimal"?16:10);if(Cg(O))b(7,I),B="�";else if(O in Mr)b(6,I),B=Mr[O];else{let _="";Ag(O)&&b(6,I),O>65535&&(O-=65536,_+=String.fromCharCode(O>>>10|55296),O=56320|O&1023),B=_+String.fromCharCode(O)}}if(B){m(),h=p(),r=x-1,f+=x-k+1,s.push(B);const O=p();O.offset++,n.reference&&n.reference.call(n.referenceContext||void 0,B,{start:h,end:O},e.slice(k-1,x)),h=O}else P=e.slice(k-1,x),a+=P,f+=P.length,r=x-1}else g===10&&(u++,o++,f=0),Number.isNaN(g)?m():(a+=String.fromCharCode(g),f++);return s.join("");function p(){return{line:u,column:f,offset:r+((l?l.offset:0)||0)}}function b(w,k){let v;n.warning&&(v=p(),v.column+=k,v.offset+=k,n.warning.call(n.warningContext||void 0,Sg[w],v,w))}function m(){a&&(s.push(a),n.text&&n.text.call(n.textContext||void 0,a,{start:h,end:p()}),a="")}}function Cg(e){return e>=55296&&e<=57343||e>1114111}function Ag(e){return e>=1&&e<=8||e===11||e>=13&&e<=31||e>=127&&e<=159||e>=64976&&e<=65007||(e&65535)===65535||(e&65535)===65534}const Pg=/["&'<>`]/g,Eg=/[\uD800-\uDBFF][\uDC00-\uDFFF]/g,Dg=/[\x01-\t\v\f\x0E-\x1F\x7F\x81\x8D\x8F\x90\x9D\xA0-\uFFFF]/g,Mg=/[|\\{}()[\]^$+*?.]/g,Rr=new WeakMap;function Og(e,t){if(e=e.replace(t.subset?Rg(t.subset):Pg,i),t.subset||t.escapeOnly)return e;return e.replace(Eg,n).replace(Dg,i);function n(s,r,o){return t.format((s.charCodeAt(0)-55296)*1024+s.charCodeAt(1)-56320+65536,o.charCodeAt(r+2),t)}function i(s,r,o){return t.format(s.charCodeAt(0),o.charCodeAt(r+1),t)}}function Rg(e){let t=Rr.get(e);return t||(t=jg(e),Rr.set(e,t)),t}function jg(e){const t=[];let n=-1;for(;++n<e.length;)t.push(e[n].replace(Mg,"\\$&"));return new RegExp("(?:"+t.join("|")+")","g")}function Lg(e){return"&#x"+e.toString(16).toUpperCase()+";"}function Ng(e,t){return Og(e,Object.assign({format:Lg},t))}const Vg={}.hasOwnProperty,Ig={},jr=/^[^\t\n\r "#'.<=>`}]+$/,Bg=/^[^\t\n\r "'<=>`}]+$/;function $g(){return{canContainEols:["textDirective"],enter:{directiveContainer:_g,directiveContainerAttributes:wi,directiveContainerLabel:zg,directiveLeaf:Hg,directiveLeafAttributes:wi,directiveText:Wg,directiveTextAttributes:wi},exit:{directiveContainer:Ci,directiveContainerAttributeClassValue:vi,directiveContainerAttributeIdValue:xi,directiveContainerAttributeName:Ti,directiveContainerAttributeValue:ki,directiveContainerAttributes:Si,directiveContainerLabel:Gg,directiveContainerName:bi,directiveLeaf:Ci,directiveLeafAttributeClassValue:vi,directiveLeafAttributeIdValue:xi,directiveLeafAttributeName:Ti,directiveLeafAttributeValue:ki,directiveLeafAttributes:Si,directiveLeafName:bi,directiveText:Ci,directiveTextAttributeClassValue:vi,directiveTextAttributeIdValue:xi,directiveTextAttributeName:Ti,directiveTextAttributeValue:ki,directiveTextAttributes:Si,directiveTextName:bi}}}function Fg(e){const t=Ig;if(t.quote!=='"'&&t.quote!=="'"&&t.quote!==null&&t.quote!==void 0)throw new Error("Invalid quote `"+t.quote+"`, expected `'` or `\"`");return n.peek=Ug,{handlers:{containerDirective:n,leafDirective:n,textDirective:n},unsafe:[{character:"\r",inConstruct:["leafDirectiveLabel","containerDirectiveLabel"]},{character:`
`,inConstruct:["leafDirectiveLabel","containerDirectiveLabel"]},{before:"[^:]",character:":",after:"[A-Za-z]",inConstruct:["phrasing"]},{atBreak:!0,character:":",after:":"}]};function n(r,o,a,l){const c=a.createTracker(l),u=Kg(r),f=a.enter(r.type);let h=c.move(u+(r.name||"")),g;if(r.type==="containerDirective"){const p=(r.children||[])[0];g=Lr(p)?p:void 0}else g=r;if(g&&g.children&&g.children.length>0){const p=a.enter("label"),b=`${r.type}Label`,m=a.enter(b);h+=c.move("["),h+=c.move(a.containerPhrasing(g,{...c.current(),before:h,after:"]"})),h+=c.move("]"),m(),p()}if(h+=c.move(i(r,a)),r.type==="containerDirective"){const p=(r.children||[])[0];let b=r;Lr(p)&&(b=Object.assign({},r,{children:r.children.slice(1)})),b&&b.children&&b.children.length>0&&(h+=c.move(`
`),h+=c.move(a.containerFlow(b,c.current()))),h+=c.move(`
`+u)}return f(),h}function i(r,o){const a=r.attributes||{},l=[];let c,u,f,h;for(h in a)if(Vg.call(a,h)&&a[h]!==void 0&&a[h]!==null){const g=String(a[h]);if(h==="id")f=t.preferShortcut!==!1&&jr.test(g)?"#"+g:s("id",g,r,o);else if(h==="class"){const p=g.split(/[\t\n\r ]+/g),b=[],m=[];let w=-1;for(;++w<p.length;)(t.preferShortcut!==!1&&jr.test(p[w])?m:b).push(p[w]);c=b.length>0?s("class",b.join(" "),r,o):"",u=m.length>0?"."+m.join("."):""}else l.push(s(h,g,r,o))}return c&&l.unshift(c),u&&l.unshift(u),f&&l.unshift(f),l.length>0?"{"+l.join(" ")+"}":""}function s(r,o,a,l){if(t.collapseEmptyAttributes!==!1&&!o)return r;if(t.preferUnquoted&&Bg.test(o))return r+"="+o;const c=t.quote||l.options.quote||'"',u=c==='"'?"'":'"',f=t.quoteSmart&&Dr(o,c)>Dr(o,u)?u:c,h=a.type==="textDirective"?[f]:[f,`
`,"\r"];return r+"="+f+Ng(o,{subset:h})+f}}function _g(e){Hs.call(this,"containerDirective",e)}function Hg(e){Hs.call(this,"leafDirective",e)}function Wg(e){Hs.call(this,"textDirective",e)}function Hs(e,t){this.enter({type:e,name:"",attributes:{},children:[]},t)}function bi(e){const t=this.stack[this.stack.length-1];_r(t.type==="containerDirective"||t.type==="leafDirective"||t.type==="textDirective"),t.name=this.sliceSerialize(e)}function zg(e){this.enter({type:"paragraph",data:{directiveLabel:!0},children:[]},e)}function Gg(e){this.exit(e)}function wi(){this.data.directiveAttributes=[],this.buffer()}function xi(e){this.data.directiveAttributes.push(["id",_s(this.sliceSerialize(e),{attribute:!0})])}function vi(e){this.data.directiveAttributes.push(["class",_s(this.sliceSerialize(e),{attribute:!0})])}function ki(e){const t=this.data.directiveAttributes;t[t.length-1][1]=_s(this.sliceSerialize(e),{attribute:!0})}function Ti(e){this.data.directiveAttributes.push([this.sliceSerialize(e),""])}function Si(){const e=this.data.directiveAttributes,t={};let n=-1;for(;++n<e.length;){const s=e[n];s[0]==="class"&&t.class?t.class+=" "+s[1]:t[s[0]]=s[1]}this.data.directiveAttributes=void 0,this.resume();const i=this.stack[this.stack.length-1];_r(i.type==="containerDirective"||i.type==="leafDirective"||i.type==="textDirective"),i.attributes=t}function Ci(e){this.exit(e)}function Ug(){return":"}function Lr(e){return!!(e&&e.type==="paragraph"&&e.data&&e.data.directiveLabel)}function Kg(e){let t=0;return e.type==="containerDirective"?(xc(e,function(n,i){if(n.type==="containerDirective"){let s=i.length,r=0;for(;s--;)i[s].type==="containerDirective"&&r++;r>t&&(t=r)}}),t+=3):e.type==="leafDirective"?t=2:t=1,":".repeat(t)}function Ws(e,t,n,i,s,r,o,a,l,c,u,f,h,g,p){let b,m;return w;function w(S){return e.enter(i),e.enter(s),e.consume(S),e.exit(s),k}function k(S){return S===35?(b=o,v(S)):S===46?(b=a,v(S)):p&&qn(S)?Ye(e,k,"whitespace")(S):!p&&nt(S)?Zt(e,k)(S):S===null||Ae(S)||Cn(S)||An(S)&&S!==45&&S!==95?_(S):(e.enter(r),e.enter(l),e.consume(S),D)}function v(S){const z=b+"Marker";return e.enter(r),e.enter(b),e.enter(z),e.consume(S),e.exit(z),x}function x(S){if(S===null||S===34||S===35||S===39||S===46||S===60||S===61||S===62||S===96||S===125||nt(S))return n(S);const z=b+"Value";return e.enter(z),e.consume(S),C}function C(S){if(S===null||S===34||S===39||S===60||S===61||S===62||S===96)return n(S);if(S===35||S===46||S===125||nt(S)){const z=b+"Value";return e.exit(z),e.exit(b),e.exit(r),k(S)}return e.consume(S),C}function D(S){return S===null||Ae(S)||Cn(S)||An(S)&&S!==45&&S!==46&&S!==58&&S!==95?(e.exit(l),p&&qn(S)?Ye(e,T,"whitespace")(S):!p&&nt(S)?Zt(e,T)(S):T(S)):(e.consume(S),D)}function T(S){return S===61?(e.enter(c),e.consume(S),e.exit(c),P):(e.exit(r),k(S))}function P(S){return S===null||S===60||S===61||S===62||S===96||S===125||p&&Ae(S)?n(S):S===34||S===39?(e.enter(u),e.enter(h),e.consume(S),e.exit(h),m=S,L):p&&qn(S)?Ye(e,P,"whitespace")(S):!p&&nt(S)?Zt(e,P)(S):(e.enter(f),e.enter(g),e.consume(S),m=void 0,E)}function E(S){return S===null||S===34||S===39||S===60||S===61||S===62||S===96?n(S):S===125||nt(S)?(e.exit(g),e.exit(f),e.exit(r),k(S)):(e.consume(S),E)}function L(S){return S===m?(e.enter(h),e.consume(S),e.exit(h),e.exit(u),e.exit(r),O):(e.enter(f),I(S))}function I(S){return S===m?(e.exit(f),L(S)):S===null?n(S):Ae(S)?p?n(S):Zt(e,I)(S):(e.enter(g),e.consume(S),B)}function B(S){return S===m||S===null||Ae(S)?(e.exit(g),I(S)):(e.consume(S),B)}function O(S){return S===125||nt(S)?k(S):_(S)}function _(S){return S===125?(e.enter(s),e.consume(S),e.exit(s),e.exit(i),t):n(S)}}function zs(e,t,n,i,s,r,o){let a=0,l=0,c;return u;function u(m){return e.enter(i),e.enter(s),e.consume(m),e.exit(s),f}function f(m){return m===93?(e.enter(s),e.consume(m),e.exit(s),e.exit(i),t):(e.enter(r),h(m))}function h(m){if(m===93&&!l)return b(m);const w=e.enter("chunkText",{_contentTypeTextTrailing:!0,contentType:"text",previous:c});return c&&(c.next=w),c=w,g(m)}function g(m){return m===null||a>999||m===91&&++l>32?n(m):m===93&&!l--?(e.exit("chunkText"),b(m)):Ae(m)?o?n(m):(e.consume(m),e.exit("chunkText"),h):(e.consume(m),m===92?p:g)}function p(m){return m===91||m===92||m===93?(e.consume(m),a++,g):g(m)}function b(m){return e.exit(r),e.enter(s),e.consume(m),e.exit(s),e.exit(i),t}}function Gs(e,t,n,i){const s=this;return r;function r(a){return a===null||Ae(a)||An(a)||Cn(a)?n(a):(e.enter(i),e.consume(a),o)}function o(a){return a===null||Ae(a)||Cn(a)||An(a)&&a!==45&&a!==95?(e.exit(i),s.previous===45||s.previous===95?n(a):t(a)):(e.consume(a),o)}}const qg={tokenize:Xg,concrete:!0},Qg={tokenize:Zg,partial:!0},Yg={tokenize:Jg,partial:!0},pn={tokenize:ey,partial:!0};function Xg(e,t,n){const i=this,s=i.events[i.events.length-1],r=s&&s[1].type==="linePrefix"?s[2].sliceSerialize(s[1],!0).length:0;let o=0,a;return l;function l(E){return e.enter("directiveContainer"),e.enter("directiveContainerFence"),e.enter("directiveContainerSequence"),c(E)}function c(E){return E===58?(e.consume(E),o++,c):o<3?n(E):(e.exit("directiveContainerSequence"),Gs.call(i,e,u,n,"directiveContainerName")(E))}function u(E){return E===91?e.attempt(Qg,f,f)(E):f(E)}function f(E){return E===123?e.attempt(Yg,h,h)(E):h(E)}function h(E){return Ye(e,g,"whitespace")(E)}function g(E){return e.exit("directiveContainerFence"),E===null?T(E):Ae(E)?i.interrupt?t(E):e.attempt(pn,p,T)(E):n(E)}function p(E){return E===null?T(E):Ae(E)?e.check(pn,v,T)(E):(e.enter("directiveContainerContent"),b(E))}function b(E){return e.attempt({tokenize:P,partial:!0},D,r?Ye(e,m,"linePrefix",r+1):m)(E)}function m(E){return E===null?D(E):Ae(E)?e.check(pn,k,D)(E):k(E)}function w(E){if(E===null){const L=e.exit("chunkDocument");return i.parser.lazy[L.start.line]=!1,D(E)}return Ae(E)?e.check(pn,x,C)(E):(e.consume(E),w)}function k(E){const L=e.enter("chunkDocument",{contentType:"document",previous:a});return a&&(a.next=L),a=L,w(E)}function v(E){return e.enter("directiveContainerContent"),b(E)}function x(E){e.consume(E);const L=e.exit("chunkDocument");return i.parser.lazy[L.start.line]=!1,b}function C(E){const L=e.exit("chunkDocument");return i.parser.lazy[L.start.line]=!1,D(E)}function D(E){return e.exit("directiveContainerContent"),T(E)}function T(E){return e.exit("directiveContainer"),t(E)}function P(E,L,I){let B=0;return Ye(E,O,"linePrefix",i.parser.constructs.disable.null.includes("codeIndented")?void 0:4);function O(z){return E.enter("directiveContainerFence"),E.enter("directiveContainerSequence"),_(z)}function _(z){return z===58?(E.consume(z),B++,_):B<o?I(z):(E.exit("directiveContainerSequence"),Ye(E,S,"whitespace")(z))}function S(z){return z===null||Ae(z)?(E.exit("directiveContainerFence"),L(z)):I(z)}}}function Zg(e,t,n){return zs(e,t,n,"directiveContainerLabel","directiveContainerLabelMarker","directiveContainerLabelString",!0)}function Jg(e,t,n){return Ws(e,t,n,"directiveContainerAttributes","directiveContainerAttributesMarker","directiveContainerAttribute","directiveContainerAttributeId","directiveContainerAttributeClass","directiveContainerAttributeName","directiveContainerAttributeInitializerMarker","directiveContainerAttributeValueLiteral","directiveContainerAttributeValue","directiveContainerAttributeValueMarker","directiveContainerAttributeValueData",!0)}function ey(e,t,n){const i=this;return s;function s(o){return e.enter("lineEnding"),e.consume(o),e.exit("lineEnding"),r}function r(o){return i.parser.lazy[i.now().line]?n(o):t(o)}}const ty={tokenize:sy},ny={tokenize:oy,partial:!0},iy={tokenize:ry,partial:!0};function sy(e,t,n){const i=this;return s;function s(u){return e.enter("directiveLeaf"),e.enter("directiveLeafSequence"),e.consume(u),r}function r(u){return u===58?(e.consume(u),e.exit("directiveLeafSequence"),Gs.call(i,e,o,n,"directiveLeafName")):n(u)}function o(u){return u===91?e.attempt(ny,a,a)(u):a(u)}function a(u){return u===123?e.attempt(iy,l,l)(u):l(u)}function l(u){return Ye(e,c,"whitespace")(u)}function c(u){return u===null||Ae(u)?(e.exit("directiveLeaf"),t(u)):n(u)}}function oy(e,t,n){return zs(e,t,n,"directiveLeafLabel","directiveLeafLabelMarker","directiveLeafLabelString",!0)}function ry(e,t,n){return Ws(e,t,n,"directiveLeafAttributes","directiveLeafAttributesMarker","directiveLeafAttribute","directiveLeafAttributeId","directiveLeafAttributeClass","directiveLeafAttributeName","directiveLeafAttributeInitializerMarker","directiveLeafAttributeValueLiteral","directiveLeafAttributeValue","directiveLeafAttributeValueMarker","directiveLeafAttributeValueData",!0)}const ay={tokenize:hy,previous:uy},ly={tokenize:dy,partial:!0},cy={tokenize:fy,partial:!0};function uy(e){return e!==58||this.events[this.events.length-1][1].type==="characterEscape"}function hy(e,t,n){const i=this;return s;function s(l){return e.enter("directiveText"),e.enter("directiveTextMarker"),e.consume(l),e.exit("directiveTextMarker"),Gs.call(i,e,r,n,"directiveTextName")}function r(l){return l===58?n(l):l===91?e.attempt(ly,o,o)(l):o(l)}function o(l){return l===123?e.attempt(cy,a,a)(l):a(l)}function a(l){return e.exit("directiveText"),t(l)}}function dy(e,t,n){return zs(e,t,n,"directiveTextLabel","directiveTextLabelMarker","directiveTextLabelString")}function fy(e,t,n){return Ws(e,t,n,"directiveTextAttributes","directiveTextAttributesMarker","directiveTextAttribute","directiveTextAttributeId","directiveTextAttributeClass","directiveTextAttributeName","directiveTextAttributeInitializerMarker","directiveTextAttributeValueLiteral","directiveTextAttributeValue","directiveTextAttributeValueMarker","directiveTextAttributeValueData")}function py(){return{text:{58:ay},flow:{58:[qg,ty]}}}function my(){const t=this.data(),n=t.micromarkExtensions||(t.micromarkExtensions=[]),i=t.fromMarkdownExtensions||(t.fromMarkdownExtensions=[]),s=t.toMarkdownExtensions||(t.toMarkdownExtensions=[]);n.push(py()),i.push($g()),s.push(Fg())}const Nr={size:e=>`font-size:${e}`,color:e=>`color:${e}`,bg:e=>`background-color:${e}`,opacity:e=>`opacity:${e}`,nowrap:()=>"white-space:nowrap",center:()=>"text-align:center"},gy=new Set(["center"]),yy="s",by=/^[\w.#%(),\s-]*$/,wy=new Set(["color","bg"]);function xy(e,t=!1,n){const i=[];for(const[s,r]of Object.entries(e??{})){if(!(s in Nr)||t&&gy.has(s))continue;let o=(r??"").trim();wy.has(s)&&(o=n?.[o]??o),!(!by.test(o)||/url\s*\(/i.test(o))&&i.push(Nr[s](o))}return i.join(";")}const vy=new Set(["textDirective","leafDirective","containerDirective"]);function tc(e,t){if(vy.has(e.type)){const n=e.type==="textDirective",i=e.name===yy?xy(e.attributes,n,t):"";e.data={...e.data,hName:n?"span":"div",hProperties:i?{style:i,className:"help-styled"}:{}}}for(const n of e.children??[])tc(n,t)}function ky(e={}){return t=>{tc(t,e.colors)}}const Ty=e=>[my,[ky,{colors:e}]],rs={a:({href:e,children:t})=>d.jsx("a",{href:e,target:"_blank",rel:"noreferrer",children:t}),blockquote:({children:e})=>d.jsxs("div",{className:"help-popover-alert",role:"note",children:[d.jsx("span",{className:"help-popover-alert-mark","aria-hidden":"true",children:"!"}),d.jsx("div",{children:e})]})},as="widget:",Sy=e=>e.startsWith(as)?e:vc(e);function Cy(e){return function({src:n,alt:i}){if(n?.startsWith(as)){const s=n.slice(as.length),r=s.indexOf(":"),o=r===-1?s:s.slice(0,r),a=r===-1?"":s.slice(r+1);return e?.[o]?.(a)??d.jsx("span",{children:i})}return d.jsx("img",{src:n,alt:i})}}function Ay(e){try{return localStorage.getItem(e)}catch{return null}}function Py(e,t){try{localStorage.setItem(e,t)}catch{}}const nc="help-once-",Ai="data-help-anchor",Pi="data-help-spotlight",Vr="data-help-hint",Ey="--help-hint",Dy=40;function My(e){return e.split(`
`).filter(t=>!/^\s{0,3}>/.test(t)).join(`
`).replace(/\n{3,}/g,`

`).trim()}function Oy(e){return Ay(nc+e)==="1"}function Ry(e){Py(nc+e,"1")}function jy(e){return{...rs,blockquote:({children:t})=>d.jsxs("div",{className:"help-popover-alert",role:"note",children:[d.jsx("span",{className:"help-popover-alert-mark","aria-hidden":"true",children:"!"}),d.jsxs("div",{children:[t,d.jsxs("label",{className:"help-popover-alert-once",children:[d.jsx("input",{type:"checkbox",onChange:e}),"Don't show this again"]})]})]})}}function Ly(){const{helpMode:e,tourIndex:t,position:n,positions:i,stepCount:s,content:r,activeId:o,dismissEntry:a,nextStep:l,prevStep:c,endTour:u,showEntry:f,resolveAnchor:h,centerRect:g,showAddresses:p,tourName:b,tourMeta:m,widgets:w,colors:k}=ht(),v=y.useMemo(()=>Ty(k),[k]),x=b===void 0?void 0:m.get(b)?.abbr??b,[C,D]=y.useState(!1),T=t!==null;y.useEffect(()=>{T||D(!1)},[T]);const P=o?r.entries.get(o):void 0,E=Hl(),L=h,I=T?n?.anchor:P?.anchor,B=T?n?.spotlight:P?.spotlight,O=(T?n?.highlight:P?.highlight)??"dim",_=()=>{if(!n||n.beatCount===0)return null;const U=n.beatIndex+1;return d.jsx("span",{className:"help-tour-dots",title:`Screen ${U+1} of ${n.beatCount+1} in this step`,children:Array.from({length:n.beatCount},(J,pe)=>d.jsx("span",{className:pe<U?"help-dot help-dot-on":"help-dot"},pe))})},[S,z]=y.useState(!1),[fe,N]=y.useState(!1),[G,j]=y.useState(void 0),[X,oe]=y.useState(!1),re=y.useRef(null),[,Me]=y.useState(0),be=P?.once,Pe=be!==void 0&&Oy(be),ve=y.useMemo(()=>({...be===void 0?rs:jy(()=>{Ry(be),Me(U=>U+1)}),img:Cy(w)}),[be,w]),Se=(T?n?.blocks??[]:[P?.description??""]).map(U=>Pe?My(U):U).filter(Boolean),q=(T?n?.width:void 0)??Math.max(_y(Se.join(`

`)),T?Hy():0),Q=y.useRef(!1);y.useEffect(()=>{Q.current=!1},[o,I]);const ne=E.reset;y.useEffect(()=>{ne()},[o,t,ne]),y.useLayoutEffect(()=>{if(!o){z(!1),j(void 0);return}let U=null;const J=()=>{const me=L(I);me!==U&&(U?.removeAttribute(Ai),U=me,z(!!me),j(me?.closest("[data-graph-direction]")?.getAttribute("data-graph-direction")==="RIGHT"?"below":void 0),me&&(me.setAttribute(Ai,""),Q.current||(Q.current=!0,me.scrollIntoView({block:"center",behavior:"smooth"}))))};J();const pe=new MutationObserver(J);return pe.observe(document.body,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["data-help-id"]}),()=>{pe.disconnect(),U?.removeAttribute(Ai),z(!1),j(void 0)}},[o,I,L]),y.useLayoutEffect(()=>{if(!o||!B){N(!1);return}let U=null;const J=()=>{const me=L(B);me!==U&&(U?.removeAttribute(Pi),U=me,N(!!me),me?.setAttribute(Pi,""))};J();const pe=new MutationObserver(J);return pe.observe(document.body,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["data-help-id"]}),()=>{pe.disconnect(),U?.removeAttribute(Pi),N(!1)}},[o,B,L]);const ae=600,we=T&&n?.change!=null&&I!==void 0&&I.kind!=="none",[Le,Ne]=y.useState(!1);y.useEffect(()=>{if(!we){Ne(!0);return}Ne(!1);const U=window.setTimeout(()=>Ne(!0),ae);return()=>window.clearTimeout(U)},[we,t]);const dt=Le||S,ft=T?n?.address??"tour":o??"none";y.useEffect(()=>{const U=re.current;U&&(P&&dt?U.matches(":popover-open")||U.showPopover():U.matches(":popover-open")&&U.hidePopover())},[P,dt,ft]),y.useEffect(()=>{(!e||T)&&oe(!1)},[e,T]);const pt=y.useMemo(()=>e&&!T?[...r.entries.values()].filter(U=>L(U.anchor)).slice(0,Dy).map((U,J)=>({id:U.id,title:U.title,name:`${Ey}-${J}`})):[],[e,T,r,L]);return y.useLayoutEffect(()=>{const U=pt.map(J=>{const pe=L(r.entries.get(J.id)?.anchor);return pe?.setAttribute(Vr,J.name),pe}).filter(Boolean);return()=>U.forEach(J=>J.removeAttribute(Vr))},[pt,r,L]),d.jsxs(d.Fragment,{children:[(fe||S)&&o&&O!=="none"&&d.jsx("div",{className:`help-spotlight${O==="ring"?" help-spotlight-ring":""}`,"data-on-spotlight":fe?"":void 0}),pt.map(({id:U,title:J,name:pe})=>d.jsx("button",{className:"help-hint",title:J??U,style:{positionAnchor:pe},onMouseEnter:()=>{X||f(U)},onMouseLeave:()=>{X||a()},onClick:me=>{me.stopPropagation(),oe(!0),f(U)},children:"?"},U)),d.jsx("div",{ref:re,popover:"manual","data-help-popover":"","data-anchored":S&&!E.offset?"":void 0,className:"help-popover",style:{...Wy(S,T?n?.position:void 0,T?n?.offsetX:void 0,q,S?null:g(),G),...E.offset?{positionArea:"none",left:E.offset.left,top:E.offset.top,right:"auto",bottom:"auto",margin:0,transform:"none"}:{}},children:P&&d.jsxs(d.Fragment,{children:[d.jsxs("h4",{className:"help-popover-title",onPointerDown:E.onPointerDown,style:{cursor:E.offset?"grabbing":"grab",userSelect:"none"},title:"Drag to move",children:[T&&x&&d.jsx("span",{className:"help-popover-tour",children:x}),P.title]}),T&&n?.action&&d.jsxs("div",{className:"help-popover-action",children:[d.jsx("span",{className:"help-popover-action-mark","aria-hidden":"true",children:"✓"}),d.jsx("div",{children:d.jsx(Jt,{children:n.action})})]}),T&&p&&n?.change&&!n.action&&d.jsxs("div",{className:"help-popover-action",style:{opacity:.85},children:[d.jsx("span",{className:"help-popover-action-mark","aria-hidden":"true",children:"⚠"}),d.jsxs("div",{children:[d.jsx("em",{children:"Authoring:"})," this position changes the app (",d.jsx("code",{children:n.change}),") but has no ",d.jsx("code",{children:"Action:"}),"."]})]}),Se.length>0&&d.jsx("div",{className:"help-popover-body",children:Se.map((U,J,pe)=>d.jsx("div",{className:J===pe.length-1?void 0:"help-beat-past",children:d.jsx(Jt,{components:ve,urlTransform:Sy,remarkPlugins:v,children:U})},J))}),P.interactions.length>0&&d.jsx("ul",{className:"help-popover-interactions",children:P.interactions.map((U,J)=>d.jsx("li",{children:d.jsx(Jt,{components:rs,children:U})},J))}),P.shortcut&&d.jsxs("p",{className:"help-popover-shortcut",children:["Shortcut: ",d.jsx("kbd",{children:P.shortcut})]}),P.context&&d.jsx("div",{className:"help-popover-context",children:d.jsx(Jt,{children:P.context})}),T?d.jsxs("div",{className:"help-tour-nav",children:[d.jsxs("span",{className:"help-tour-count",title:`Position ${t+1} of ${i.length}`,children:[n?.step," / ",s]}),_(),d.jsx("button",{className:"help-tour-map-btn",onClick:()=>D(U=>!U),"aria-expanded":C,title:"Show the tour outline",children:"⊞"}),d.jsx("span",{className:"help-tour-spacer"}),d.jsx("button",{onClick:c,disabled:t===0,title:"Previous (← arrow key)",children:"← back"}),d.jsx("button",{onClick:l,className:"help-tour-next",title:"Next (→ arrow key)",children:t+1===i.length?"done":"next →"}),d.jsx("button",{onClick:u,title:"End the tour and undo what it added (Esc)",children:"✕"})]}):d.jsxs("div",{className:"help-tour-nav",children:[d.jsx("span",{className:"help-tour-spacer"}),d.jsx("button",{onClick:()=>{oe(!1),a()},children:"close"})]}),p&&d.jsx(Ny,{address:T?n?.address:P.id,searchFor:T?n?.searchFor:`### ${P.id}`})]})},ft),C&&T&&d.jsx(Jl,{scope:"tour",onClose:()=>D(!1)})]})}function Ny({address:e,searchFor:t}){const[n,i]=y.useState(!1);return y.useEffect(()=>{if(!n)return;const s=setTimeout(()=>i(!1),1200);return()=>clearTimeout(s)},[n]),!e||!t?null:d.jsxs("button",{type:"button",className:"help-popover-address",title:`Copy “${t}” — search help-content.md for it`,onClick:()=>{navigator.clipboard?.writeText(t).then(()=>i(!0),()=>{})},children:[e,n?" ✓":""]})}const ic=320,Vy=320,Iy=800,By=8,$y=24,Fy=3;function _y(e){const t=e.trim().length;return t===0?ic:Math.round(Math.min(Iy,Math.max(Vy,Math.sqrt(t*By*$y*Fy))))}function Hy(){return 393}function Wy(e,t,n,i,s,r){const o=window.innerWidth,a=window.innerHeight,l=Math.min(i??ic,o-16);if(!e){const u=s??new DOMRect(0,0,o,a),f=u.left+u.width/2;return{left:Math.max(8,Math.min(f-l/2,o-l-8)),top:"50%",transform:"translateY(-50%)",maxHeight:`${a-16}px`,width:l}}return{positionArea:t?{right:"inline-end span-block-end",left:"inline-start span-block-end",top:"block-start span-inline-end",bottom:"block-end span-inline-end"}[t]:r==="below"?"block-end span-inline-end":"inline-end span-block-end",width:l,...zy(n)}}function zy(e){return e?{marginLeft:"px"in e?`${e.px}px`:`calc(anchor-size(${e.of}) * ${e.times})`}:{}}const Ei=e=>e&&e.trim()?e.trim():void 0;function Gy(e){return{"model-description":t=>Ei(e.getClassDescription(t)),"enum-description":t=>Ei(e.getEnumDetail(t)?.description),"category-label":t=>Ei($r.find(n=>n.id===t)?.label),edge:t=>t in ie.kinds?`![${ie.kinds[t].label}](widget:edge:${t})`:void 0,relation:t=>{const n=sc(t);return n?`![${n.left} ${n.right}](widget:relation:${t})`:void 0}}}function sc(e){const[t,n,i]=e.split(":");return t&&t in ie.kinds&&n&&i?{kind:t,left:n,right:i}:void 0}const Uy={edge:e=>e in ie.kinds?d.jsx(In,{kind:e,width:40,className:"help-inline-widget"}):null,relation:e=>{const t=sc(e);return t?d.jsxs("span",{className:"help-inline-relation",children:[d.jsx("code",{children:t.left}),d.jsx(In,{kind:t.kind,width:40,className:"help-inline-widget"}),d.jsx("code",{children:t.right})]}):null}},Ky={...Object.fromEntries(Object.entries(ie.kinds).map(([e,t])=>[e,t.color])),entity:He.entity,enum:He.enum,"data-type":He.dataType,variable:He.variable,slot:He.slot,...Object.fromEntries(Fr.flatMap((e,t)=>[[`sibling-${t}`,e.text],[`sibling-${t}-fill`,e.fill]]))},qy=`# BDCHM Explorer help

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
- **Description:** Why boxes land where they do, and what the two kinds of line mean

<!--
I've moved this section to the top just while i'm working actively on it.

I want to restructure something like this:
- explain ownership, why it's needed, the two edge types
  - (association edges can be explained in a commented-out appendix, or not)
- explain the rules and exceptions, in this order:
  - Rule 1, Multivalued owns -- multivalue-owns-fwd
    - currently no exceptions
  - Rule 2, Single value -- single-value-belongs-to-bkwd
    - Exceptions: Single value owns -- single-value-owns-fwd
  - Rule 3, Children follow their parents -- child-following-parent

The rule steps below are drafted against the LIVE classifier (probed
2026-09-11): 38 Rule 1 pairs, 60 Rule 2, 51 exception, 10 Rule 3. They use the
legend's own \`label\` strings from \`OWNERSHIP_RULES\`, so tour, legend and
classifier say one thing; if a label changes there, change it here.
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
     - ~~Title: none~~
     - Keep: true
     - Highlight: dim
     - Spotlight: slot-row:Condition.affected_body_site
     - Description:
       **Condition** has two attributes pointing at other entities.

       \`affected_body_site\` → **BodySite**, optional (\`0..1\`). Some conditions
       occur at a specific body site.
  2. own-bkwd
     - ~~Title: none~~
     - Keep: true
     - Highlight: dim
     - Spotlight: slot-row:Condition.associated_participant
     - Description:
       \`associated_participant\` → **Participant**, required (\`1..1\`). A
       condition record must belong to someone in a study.
  3. two-edge-types
     - ~~Title: none~~
     - Description:
       Both attributes point from Condition at something else, but they don't
       mean the same thing. A condition *belongs to* its participant: the
       record makes no sense without one, which is why the schema marks
       \`associated_participant\` required. A body site is just part of how the
       condition is described.

       Ownership is about which record depends on which — not about which end
       the schema happened to put the pointer on.
  4. optional-owners
     - ~~Title: none~~
     - Change: sel=Visit
     - Anchor: node-box:Visit
     - Description:
       **Visit** shows that required-ness isn't the test. \`associated_visit\`
       is optional (though the source data may require it), and the Explorer
       still draws Visit as owning Condition: when a visit is present, the
       condition was observed or recorded during it.

### edge-types

- **Title:** Edge types
- **Tour:** Ownership
- Only: sel=Participant~Condition~BodySite
- Spotlight: slot-row:Condition.affected_body_site
- **Anchor:** node-box:Condition
- Width: 600
- **Description:**
  So, when the Explorer has configured an attribute target as
  :s[owning]{color=own-fwd} its target, it places the target to the right and
  draws a forward-pointing arrow.
  :::s{center color=entity}
    {{relation:own-fwd:Condition.affected_body_site:BodySite}}
  :::
- Beats:
  1. backwards
     - Keep: true
     - Spotlight: slot-row:Condition.associated_participant
     - Description:
       When the target is considered to be by* :s[owned by]{color=own-bkwd} its
       target, it places the target to the left and draws a backward-pointing
       arrow {{edge:own-bkwd}}
       :::s{center color=entity}
         {{relation:own-bkwd:Condition.associated_participant:Participant}}
       :::

### the-legend

- **Title:** Three rules, and where they live
- **Tour:** Ownership
- Only: sel=Participant~Condition~BodySite&legend=1
- **Action:** Opened the Legend panel — it is always in the Help menu.
- **Anchor:** none
- **Width:** 560
- **Description:**
  The schema doesn't say which end owns which, so the Explorer decides, and it
  decides by **three rules**. They are listed in the **Legend**, which is open
  now and always available from the Help menu.

  Each rule shows the count of attributes it decided, and clicking one lists
  them. So when a line looks wrong, that is where to find out which rule put it
  there.


### multivalue-owns-fwd

- **Title:** Owns because multivalued
- **Tour:** Ownership
- **Only:** sel=Questionnaire~QuestionnaireItem&legend=0
- **Action:** Drew Questionnaire and the items it holds.
- **Anchor:** slot-row:Questionnaire.items
- **Width:** 560
- **Description:**
  **Rule 1 — :s[owns because multivalued]{color=own-fwd}.** The easy case, and
  the most common one: 38 of the attributes in this model.

  \`items\` holds a LIST of QuestionnaireItems (\`1..*\`), and an entity that holds
  a list of things owns them. So the target is drawn to the right and the arrow
  runs forward.
  :::s{center color=entity}
    {{relation:own-fwd:Questionnaire.items:QuestionnaireItem}}
  :::

  In this schema it has no exceptions.


### single-value-belongs-to-bkwd

- **Title:** Belongs to because single-valued
- **Tour:** Ownership
- **Only:** sel=Participant~Specimen&legend=0
- **Action:** Drew Specimen and the Participant it came from.
- **Anchor:** slot-row:Specimen.source_participant
- **Width:** 560
- **Description:**
  **Rule 2 — :s[belongs to because single-valued]{color=own-bkwd}.** The
  other big group: 60 attributes.

  \`source_participant\` holds ONE Participant, and that Participant exists
  whether or not any specimen points at it. A single-valued pointer at
  something with a life of its own reads as a **foreign key**: the specimen
  belongs to the participant, not the other way round.
  :::s{center color=entity}
    {{relation:own-bkwd:Specimen.source_participant:Participant}}
  :::
- Beats:
  1. so it flips
     - Description:
       That is why this one flips. The attribute is declared on **Specimen**,
       but the ownership runs the other way, so Participant is drawn on the
       **left** and the arrow points back at it {{edge:own-bkwd}}.

       Every \`associated_participant\`, \`associated_visit\` and \`performed_by\`
       in the model works this way — which is why participants and visits end
       up on the left edge of most pictures.


### single-value-owns-fwd

- **Title:** Owns despite being single-valued
- **Tour:** Ownership
- **Only:** sel=Observation~Quantity&legend=0
- **Action:** Drew Observation and a Quantity.
- **Anchor:** node-box:Quantity
- Position: bottom
- **Spotlight:** slot-row:Observation.value_quantity
- **Width:** 600
- **Description:**
  **The exception to Rule 2 — :s[owns despite being single-valued]{color=own-fwd}.**
  51 attributes.

  \`value_quantity\` is single-valued, so **Rule 2** would say the observation
  **belongs to** its Quantity. But a Quantity is a value, \`5 mg\` — you find it
  by way of whatever holds it.
- Beats:
  1. the criterion
     - Description:
       So the test isn't "does this have independent existence?" — it is
       narrower and easier to check:

       **the holder is where this is found.**

       Quantity, TimePoint, BodySite, TimePeriod, Substance and a dozen more
       pass it. A Participant or an Organization does not: you can find those
       on their own — which is why \`associated_participant\`, further down,
       still flips backward under **Rule 2**.

       The schema can't tell us this: the list is recorded in the Explorer by
       hand, and these decisions could be debated.
     - Spotlight: slot-row:Observation.associated_participant


### child-following-parent

- **Title:** Owns the children because it owns the parent
- **Tour:** Ownership
- **Only:** sel=QuestionnaireResponseItem~QuestionnaireResponseValue&legend=0
- **Action:** Drew QuestionnaireResponseItem and the value it holds.
- **Anchor:** node-box:QuestionnaireResponseValue
- **Spotlight:** slot-row:QuestionnaireResponseItem.response_value
- **Width:** 600
- **Description:**
  **Rule 3 — :s[owns the children because it owns the parent]{color=own-fwd}.**
  10 edges.

  \`response_value\` points at QuestionnaireResponseValue, which the
  single-valued exception says the item owns. But an attribute whose type is a
  parent class accepts any of its **subclasses** too — and this value has five
  of them.
- Beats:
  1. draw the children
     - Change: sel=QuestionnaireResponseValueDecimal~QuestionnaireResponseValueBoolean~QuestionnaireResponseValueInteger~QuestionnaireResponseValueTimePoint~QuestionnaireResponseValueString
     - Action: Added the five subclasses of QuestionnaireResponseValue.
     - Anchor: node-box:QuestionnaireResponseValue
     - Highlight: ring
     - Description:
       A response value can be a decimal, a boolean, an integer, a timepoint or
       a string. They merge into one box, and the item owns each of them —
       through that same one attribute.

       Those edges are **induced** from the declared one: no attribute of their
       own says so. That is why the single line lands on the box's **header**
       rather than on any one child.


### bar-sides

- **Title:** One side, two rules
- **Tour:** Ownership
- **Only:** sel=Observation~ObservationSet~Participant~Visit~Organization&legend=0
- **Action:** Drew Observation with the four entities that own it.
- **Anchor:** node-box:Observation
- **Highlight:** ring
- **Width:** 560
- **Description:**
  Four entities own Observation, so all four are drawn to its **left** — that
  is what the relation bar's **←** count means. But they are not all there for
  the same reason.
- Beats:
  1. two rules, one side
     - Description:
       Participant, Visit and Organization own it by **Rule 2**: Observation
       points at each of them, so each one flipped. ObservationSet owns it by
       **Rule 1**: its \`observations\` list collects Observations.

       Position alone doesn't tell you which — that is what the legend is for.
  2. hover the count
     - Description:
       Hover the **←** count to see them listed, each with the attribute that
       declares it.


### rules-recap

- **Title:** That's the whole of it
- **Tour:** Ownership
- Change: legend=1
- **Anchor:** none
- **Width:** 520
- **Description:**
  Three rules and one exception decide every line on the canvas:

  1. A **multivalued** attribute :s[owns]{color=own-fwd} what it points at.
  2. A **single-valued** attribute :s[belongs to]{color=own-bkwd} what it
     points at —
  3. unless the target is found only by way of its holder, in which case it is
     :s[owned]{color=own-fwd} after all.
  4. And whatever owns a parent class owns its **subclasses** too.

  The legend lists them against the live schema every time it opens, so when a
  line looks wrong, that is where to have the argument.

<!--
APPENDIX, parked: association edges.

No slot classifies as \`association\` any more (ASSOCIATION_SLOTS is empty since
2026-09-11), so there is nothing on the canvas to point at and the step below
would be describing a line a reader can never see. Kept as a comment because
the KIND still exists and the schema could need it again; see
OWNERSHIP_CLASSIFICATION.md §When a schema needs it.

### association-appendix

- **Title:** When neither one owns the other
- **Tour:** Ownership
- **Anchor:** none
- **Width:** 520
- **Description:**
  A third kind of line exists, though this model currently has none: an
  **association**, drawn dashed and arrowed at both ends. It says two entities
  are related and makes **no ownership claim in either direction**.

  It is what a schema needs when both rules above would overclaim — when one
  entity holds a list of another (**Rule 1** would say it owns them) but the target
  plainly outlives the holder and is reachable on its own.
-->

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
`,Us={inTour:!1,held:[],tempHeld:[],tour:[],region:0,tourStates:[],scalars:{}},Qy="~";function Ir(e,t){return e&&t.includes(e)?e:null}function oc(e,t=!1){const n=new URLSearchParams(e),i={};if(n.get("panels")==="0"){for(const l of Ml)i[l]=!1;i.detail=null}n.has("detail")&&(i.detail=n.get("detail")||null),n.has("roots")&&(i.roots=n.get("roots")==="1"),n.has("sibs")&&(i.sibs=n.get("sibs")==="1"),n.has("legend")&&(i.legend=n.get("legend")==="1"),n.has("cases")&&(i.cases=n.get("cases")==="1");const s=Ir(n.get("dir"),["RIGHT","DOWN"]);s&&(i.dir=s);const r=Ir(n.get("merge"),["near","far","bend","off"]);r&&(i.merge=r);const o=n.get("sel"),a=o?o.split(Qy).filter(Boolean):Ol(n);return t?{sel:a,scalars:i,replace:!0}:{sel:a,scalars:i}}function Bt(e,t){return[...new Set([...e,...t])]}function Yy(e){return{...Us,inTour:!0,held:[...e]}}function Xy(){return Us}function Zy(e){return Bt(e.held,e.tempHeld)}function rc(e,t){const n=t.replace?e.region+1:e.region,i=t.replace?[...t.sel]:Bt(e.tour,t.sel),s={...e.scalars,...t.scalars};return{...e,tour:i,region:n,scalars:s,tourStates:[...e.tourStates,{sel:i,scalars:s,region:n}]}}function ac(e){if(e.tourStates.length===0)return e;const t=e.tourStates.slice(0,-1),n=t[t.length-1];return{...e,tourStates:t,tour:n?n.sel:[],region:n?n.region:0}}function Ks(e){return e.region>0}function Jy(e,t){if(!e.inTour)return e;const n=Ks(e)?"tempHeld":"held";return e[n].includes(t)?e:{...e,[n]:[...e[n],t]}}function eb(e,t){if(!e.inTour)return e;const n=i=>i.filter(s=>s!==t);return{...e,tour:n(e.tour),tempHeld:n(e.tempHeld),held:Ks(e)?e.held:n(e.held)}}function qs(e,t){if(!t.inTour)return e;const n=Ks(t)?Bt(t.tour,t.tempHeld):Bt(Bt(t.tour,t.tempHeld),t.held);return{...e,...t.scalars,sel:n}}function tb(){const{modelData:e,loading:t,error:n}=kc(),i=y.useMemo(()=>e?new Tc(e):null,[e]),{setTextResolvers:s}=ht(),r=y.useMemo(()=>i?Gy(i):void 0,[i]);y.useEffect(()=>s(r),[r,s]);const o=y.useMemo(()=>We(),[]),[a,l]=y.useState(()=>new Set(o.sel)),[c,u]=y.useState(o.detail),[f,h]=y.useState(!1),g=y.useRef(!1),[p,b]=y.useState(o.roots),[m,w]=y.useState(o.sibs),[k,v]=y.useState(o.dir),[x,C]=y.useState(o.merge),[D,T]=y.useState(o.cases),[P,E]=y.useState(o.legend),[L,I]=y.useState(!1),B=y.useCallback(N=>{l(new Set(N.sel)),b(!!N.roots),u(null)},[]);y.useEffect(()=>{const N=()=>{const G=We();l(new Set(G.sel)),u(G.detail),b(G.roots),w(G.sibs),v(G.dir),C(G.merge),E(G.legend),T(G.cases)};return window.addEventListener("popstate",N),window.addEventListener("explore:state-from-url",N),()=>{window.removeEventListener("popstate",N),window.removeEventListener("explore:state-from-url",N)}},[]),y.useEffect(()=>{const N={sel:[...a],detail:c,roots:p,sibs:m,dir:k,merge:x,legend:P,cases:D},G=g.current;g.current=!1,Rl(N,{push:G})},[a,c,p,m,k,x,P,D]);const O=y.useCallback(N=>{yt(N,!We().sel.includes(N)),l(G=>{const j=new Set(G);return j.has(N)?j.delete(N):j.add(N),j})},[]),_=y.useCallback(N=>{yt(N,!0),l(G=>G.has(N)?G:new Set(G).add(N))},[]),S=y.useCallback(N=>{yt(N,!1),l(G=>{if(!G.has(N))return G;const j=new Set(G);return j.delete(N),j})},[]),z=y.useCallback(N=>{l(j=>j.size===N.length&&N.every(X=>j.has(X))?j:(g.current=!0,new Set(N)));const G=new Set(N);for(const j of We().sel)G.has(j)||yt(j,!1);for(const j of N)yt(j,!0)},[]),fe=y.useCallback(()=>{for(const N of We().sel)yt(N,!1);l(new Set),u(null),h(!1),b(!1)},[]);return n?d.jsxs("div",{className:"p-8 text-red-600",children:["Failed to load model data: ",String(n)]}):t||!i?d.jsx("div",{className:"p-8 text-gray-400",children:"Loading model…"}):d.jsxs("div",{className:"relative flex flex-col h-screen bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100",children:[d.jsxs("header",{className:"flex items-center justify-between px-4 py-2 bg-blue-600 text-white shrink-0",children:[d.jsxs("div",{children:[d.jsx("h1",{"data-help-id":"app-title",className:"text-lg font-bold leading-tight cursor-pointer hover:opacity-80 transition-opacity",onClick:fe,title:"Click to clear the selection and reset the view",children:"BDCHM Explorer"}),d.jsx("p",{className:"text-xs text-blue-100",children:"BioData Catalyst Harmonized Model"})]}),d.jsxs("div",{className:"flex items-center gap-4",children:[d.jsx(lb,{}),d.jsx(gg,{}),d.jsx(tg,{onOpenLegend:()=>E(N=>!N),onOpenCases:()=>T(N=>!N),legendOpen:P,casesOpen:D,anyPanelOpen:P||D||c!==null,onClosePanels:()=>{E(!1),T(!1),u(null)}}),d.jsx("button",{onClick:async()=>{const N=vm({sel:[...a],detail:c,roots:p,sibs:m,dir:k,merge:x,legend:P,cases:D});try{await navigator.clipboard.writeText(N),I(!0),window.setTimeout(()=>I(!1),1500)}catch{I(!1),window.prompt("Copy this link:",N)}},"data-help-id":"copy-link",className:"text-sm underline text-blue-100 hover:text-white",title:"Copy a link that reproduces exactly this view, settings included",children:L?"✓ copied":"copy link"}),d.jsx("a",{href:"/dynamic-model-var-docs/previous.html",className:"text-sm underline text-blue-100 hover:text-white",children:"previous views"}),d.jsx("a",{href:"https://github.com/Sigfried/dynamic-model-var-docs",target:"_blank",rel:"noopener noreferrer",className:"text-blue-100 hover:text-white",title:"Source code on GitHub","aria-label":"Source code on GitHub",children:d.jsx("svg",{viewBox:"0 0 16 16",width:"18",height:"18",fill:"currentColor","aria-hidden":!0,children:d.jsx("path",{d:"M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"})})})]})]}),P&&d.jsx(Ym,{onClose:()=>E(!1),onSelect:N=>B({name:"ad hoc",note:"",sel:N}),dataService:i}),D&&d.jsx(Um,{onClose:()=>T(!1),onApply:B,selectedIds:a,dataService:i,offset:P}),d.jsxs("div",{className:"flex-1 flex min-h-0",children:[f?d.jsxs("button",{onClick:()=>h(!1),title:"Show entity selection",className:`shrink-0 w-8 border-r border-gray-200 dark:border-slate-700
                       bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700
                       flex flex-col items-center gap-2 py-2 text-gray-400`,children:[d.jsx("span",{className:"text-xs",children:"▶"}),d.jsxs("span",{className:"text-[10px] uppercase tracking-wider [writing-mode:vertical-rl]",children:[i.getConceptLabel("entity",!0),a.size>0?` (${a.size})`:""]})]}):d.jsxs("div",{className:"w-80 shrink-0 flex flex-col min-h-0 border-r border-gray-200 dark:border-slate-700",children:[d.jsx("div",{className:"flex-1 overflow-y-auto min-h-0","data-help-id":"selection-tree",children:d.jsx(jc,{dataService:i,selectedIds:a,onToggle:O,onShowCategory:z})}),d.jsx("button",{onClick:()=>h(!0),title:"Hide entity selection",className:`shrink-0 px-3 py-1 text-xs text-gray-400 border-t border-gray-200
                         dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 text-left`,children:"◀ Hide"})]}),d.jsx("div",{className:"flex-1 min-w-0","data-help-id":"graph-canvas",children:a.size===0?d.jsx("div",{className:"h-full flex items-center justify-center text-sm text-gray-400 p-8",children:"Select entities on the left to build the ownership subgraph."}):d.jsx(Bm,{dataService:i,selectedIds:a,onNodeClick:u,onAdd:_,onRemove:S,pathToRoot:p,onTogglePathToRoot:()=>b(N=>!N),direction:k,setDirection:v,mergeMode:x,setMergeMode:C,mergeSibs:m,setMergeSibs:w})}),c&&d.jsx($m,{classId:c,dataService:i,onClose:()=>u(null),onNavigate:u,isSelected:a.has(c),onToggleSelect:O})]})]})}let de=Us;function yt(e,t){de=t?Jy(de,e):eb(de,e)}function Un(e){Rl(e),window.dispatchEvent(new Event("explore:state-from-url"))}function nb(){de=Yy(We().sel)}function ib(){if(!de.inTour)return;const e=Zy(de),t=We();de=Xy(),Un({...t,sel:e})}function sb(e,t=!1){de=rc(de,oc(e,t)),Un(qs(We(),de))}function ob(){de=ac(de),Un(qs(We(),de))}function rb(e,t){for(let n=0;n<t;n++)de=ac(de);for(const n of e)de=rc(de,oc(n.query,n.replace));Un(qs(We(),de))}function ab(){return d.jsxs(xg,{markdown:qy,widgets:Uy,colors:Ky,onPushChange:sb,onPopChange:ob,onJumpChanges:rb,onTourStart:nb,onTourEnd:ib,children:[d.jsx(tb,{}),d.jsx(Ly,{})]})}function lb(){const{helpMode:e,toggleHelpMode:t,startTour:n}=ht();return y.useEffect(()=>{bm()&&n()},[]),d.jsx("span",{className:"flex items-center gap-2","data-help-id":"help-button",children:Xm})}Sc.createRoot(document.getElementById("root")).render(d.jsx(y.StrictMode,{children:d.jsx(ab,{})}));
