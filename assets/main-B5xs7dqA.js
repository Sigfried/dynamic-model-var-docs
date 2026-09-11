import{i as Ci,p as nc,r as y,j as u,E as we,g as ic,a as jr,b as Lr,S as sc,c as oc,d as rc,s as ac,w as lc,R as Pt,e as cc,f as hc,m as uc,h as dc,k as fc,l as Gs,o as Nr,v as pc,n as Gn,q as qe,t as tt,u as Xt,x as Ce,y as Sn,z as Tn,M as Zt,A as mc,B as gc,D as yc,C as bc}from"./index-DwKnoFRI.js";function Vr(e){return[...new Set([...e.classIds,...e.pins])]}const wc=e=>`entity-row:${e}`,xc=e=>`entity-checkbox:${e}`,vc=e=>`category-row:${e}`,kc=e=>`node-box:${e}`,Sc=e=>`child-header:${e}`,Tc=(e,t)=>`slot-row:${e}.${t}`,Ir=e=>Ci(e.id)?nc(e.id):e.id,Cc=e=>kc(Ir(e)),Ac=(e,t)=>Tc(t.declaringClass??Ir(e),t.slot);function Pc({dataService:e,selectedIds:t,onToggle:n,onShowCategory:i}){const s=y.useMemo(()=>e.getCategoryTrees(),[e]),[r,o]=y.useState(new Set),a=l=>o(h=>{const f=new Set(h);return f.has(l)?f.delete(l):f.add(l),f}),c=s.reduce((l,h)=>l+h.classIds.length,0);return u.jsxs("div",{className:"text-sm",children:[u.jsx("div",{className:"flex items-baseline gap-2 px-3 py-2 border-b border-gray-200 dark:border-slate-700",children:u.jsxs("span",{className:"font-semibold flex-1",children:[e.getConceptLabel("entity",!0)," (",c,")"]})}),s.map(l=>{const h=r.has(l.id),f=l.classIds.filter(d=>t.has(d)).length;return u.jsxs("div",{children:[u.jsxs("div",{"data-help-id":vc(l.id),className:`w-full flex items-stretch font-medium
                         bg-gray-50 dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700`,children:[u.jsxs("button",{type:"button",onClick:()=>a(l.id),className:`flex-1 min-w-0 flex items-center gap-2 px-3 py-1.5 text-left
                           hover:bg-gray-100 dark:hover:bg-slate-700`,children:[u.jsx("span",{className:"text-xs text-gray-400",children:h?"▶":"▼"}),u.jsx("span",{className:"flex-1 truncate",children:l.label}),f>0&&u.jsxs("span",{className:"text-xs text-gray-400",children:[f," / ",l.classIds.length]})]}),i&&u.jsx("button",{type:"button","data-show-category":l.id,title:`Draw the ${l.label} content view — replaces the canvas`,onClick:()=>i(Vr(l)),className:`px-2.5 shrink-0 text-gray-400 border-l border-gray-100
                             dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700
                             hover:text-blue-600 dark:hover:text-sky-400`,children:"⊞"})]}),!h&&l.roots.map(d=>u.jsx(Br,{node:d,depth:0,selectedIds:t,onToggle:n},d.classId))]},l.id)})]})}function Br({node:e,depth:t,selectedIds:n,onToggle:i}){const{classId:s}=e;return u.jsxs(u.Fragment,{children:[u.jsxs("label",{"data-class-row":s,"data-help-id":wc(s),className:`flex items-center gap-2 pr-3 py-1 cursor-pointer
                    hover:bg-blue-50 dark:hover:bg-slate-800
                    ${n.has(s)?"bg-blue-50 dark:bg-slate-800":""}`,style:{paddingLeft:`${.75+t*1}rem`},children:[u.jsx("input",{type:"checkbox","data-help-id":xc(s),checked:n.has(s),onChange:()=>i(s)}),u.jsxs("span",{className:"flex-1 min-w-0 truncate",children:[u.jsx("span",{className:"font-mono text-xs",children:s}),e.outOfCategoryParent&&u.jsxs("span",{className:"ml-1 text-[10px] text-gray-400 dark:text-slate-500",title:`Extends ${e.outOfCategoryParent}, which is in another category`,children:["↳ ",e.outOfCategoryParent]})]})]}),e.children.map(r=>u.jsx(Br,{node:r,depth:t+1,selectedIds:n,onToggle:i},r.classId))]})}const ss=y.createContext({});function os(e){const t=y.useRef(null);return t.current===null&&(t.current=e()),t.current}const Ec=typeof window<"u",Cn=Ec?y.useLayoutEffect:y.useEffect,Vn=y.createContext(null);function rs(e,t){e.indexOf(t)===-1&&e.push(t)}function An(e,t){const n=e.indexOf(t);n>-1&&e.splice(n,1)}const We=(e,t,n)=>n>t?t:n<e?e:n;let In=()=>{};const Ye={},$r=e=>/^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(e),Fr=e=>typeof e=="object"&&e!==null,_r=e=>/^0[^.\s]+$/u.test(e);function Hr(e){let t;return()=>(t===void 0&&(t=e()),t)}const je=e=>e,zt=(...e)=>e.reduce((t,n)=>i=>n(t(i))),Bt=(e,t,n)=>{const i=t-e;return i?(n-e)/i:1};class as{constructor(){this.subscriptions=[]}add(t){return rs(this.subscriptions,t),()=>An(this.subscriptions,t)}notify(t,n,i){const s=this.subscriptions.length;if(s)if(s===1)this.subscriptions[0](t,n,i);else for(let r=0;r<s;r++){const o=this.subscriptions[r];o&&o(t,n,i)}}getSize(){return this.subscriptions.length}clear(){this.subscriptions.length=0}}const Le=e=>e*1e3,Re=e=>e/1e3,zr=(e,t)=>t?e*(1e3/t):0,Wr=(e,t,n)=>(((1-3*n+3*t)*e+(3*n-6*t))*e+3*t)*e,Dc=1e-7,Mc=12;function Oc(e,t,n,i,s){let r,o,a=0;do o=t+(n-t)/2,r=Wr(o,i,s)-e,r>0?n=o:t=o;while(Math.abs(r)>Dc&&++a<Mc);return o}function Wt(e,t,n,i){if(e===t&&n===i)return je;const s=r=>Oc(r,0,1,e,n);return r=>r===0||r===1?r:Wr(s(r),t,i)}const Gr=e=>t=>t<=.5?e(2*t)/2:(2-e(2*(1-t)))/2,Ur=e=>t=>1-e(1-t),Kr=Wt(.33,1.53,.69,.99),ls=Ur(Kr),qr=Gr(ls),Qr=e=>e>=1?1:(e*=2)<1?.5*ls(e):.5*(2-Math.pow(2,-10*(e-1))),cs=e=>1-Math.sin(Math.acos(e)),Yr=Ur(cs),Xr=Gr(cs),Rc=Wt(.42,0,1,1),jc=Wt(0,0,.58,1),Zr=Wt(.42,0,.58,1),Lc=e=>Array.isArray(e)&&typeof e[0]!="number",Jr=e=>Array.isArray(e)&&typeof e[0]=="number",Nc={linear:je,easeIn:Rc,easeInOut:Zr,easeOut:jc,circIn:cs,circInOut:Xr,circOut:Yr,backIn:ls,backInOut:qr,backOut:Kr,anticipate:Qr},Vc=e=>typeof e=="string",Us=e=>{if(Jr(e)){In(e.length===4);const[t,n,i,s]=e;return Wt(t,n,i,s)}else if(Vc(e))return Nc[e];return e},Jt=["setup","read","resolveKeyframes","preUpdate","update","preRender","render","postRender"];function Ic(e){let t=new Set,n=new Set,i=!1,s=!1;const r=new WeakSet;let o={delta:0,timestamp:0,isProcessing:!1};function a(l){r.has(l)&&(c.schedule(l),e()),l(o)}const c={schedule:(l,h=!1,f=!1)=>{const m=f&&i?t:n;return h&&r.add(l),m.add(l),l},cancel:l=>{n.delete(l),r.delete(l)},process:l=>{if(o=l,i){s=!0;return}i=!0;const h=t;t=n,n=h,t.forEach(a),t.clear(),i=!1,s&&(s=!1,c.process(l))}};return c}const Bc=40;function ea(e,t){let n=!1,i=!0;const s={delta:0,timestamp:0,isProcessing:!1},r=()=>n=!0,o=Jt.reduce((v,w)=>(v[w]=Ic(r),v),{}),{setup:a,read:c,resolveKeyframes:l,preUpdate:h,update:f,preRender:d,render:m,postRender:g}=o,b=()=>{const v=Ye.useManualTiming,w=v?s.timestamp:performance.now();n=!1,v||(s.delta=i?1e3/60:Math.max(Math.min(w-s.timestamp,Bc),1)),s.timestamp=w,s.isProcessing=!0,a.process(s),c.process(s),l.process(s),h.process(s),f.process(s),d.process(s),m.process(s),g.process(s),s.isProcessing=!1,n&&t&&(i=!1,e(b))},p=()=>{n=!0,i=!0,s.isProcessing||e(b)};return{schedule:Jt.reduce((v,w)=>{const k=o[w];return v[w]=(E,T=!1,D=!1)=>(n||p(),k.schedule(E,T,D)),v},{}),cancel:v=>{for(let w=0;w<Jt.length;w++)o[Jt[w]].cancel(v)},state:s,steps:o}}const{schedule:ee,cancel:Xe,state:pe,steps:Un}=ea(typeof requestAnimationFrame<"u"?requestAnimationFrame:je,!0);let fn;function $c(){fn=void 0}const ye={now:()=>(fn===void 0&&ye.set(pe.isProcessing||Ye.useManualTiming?pe.timestamp:performance.now()),fn),set:e=>{fn=e,queueMicrotask($c)}},ta=e=>t=>typeof t=="string"&&t.startsWith(e),na=ta("--"),Fc=ta("var(--"),hs=e=>Fc(e)?_c.test(e.split("/*")[0].trim()):!1,_c=/var\(--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)$/iu;function Ks(e){return typeof e!="string"?!1:e.split("/*")[0].includes("var(--")}const vt={test:e=>typeof e=="number",parse:parseFloat,transform:e=>e},$t={...vt,transform:e=>We(0,1,e)},en={...vt,default:1},Ot=e=>Math.round(e*1e5)/1e5,us=/-?(?:\d+(?:\.\d+)?|\.\d+)/gu;function Hc(e){return e==null}const zc=/^(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))$/iu,ds=(e,t)=>n=>!!(typeof n=="string"&&zc.test(n)&&n.startsWith(e)||t&&!Hc(n)&&Object.prototype.hasOwnProperty.call(n,t)),ia=(e,t,n)=>i=>{if(typeof i!="string")return i;const[s,r,o,a]=i.match(us);return{[e]:parseFloat(s),[t]:parseFloat(r),[n]:parseFloat(o),alpha:a!==void 0?parseFloat(a):1}},Wc=e=>We(0,255,e),Kn={...vt,transform:e=>Math.round(Wc(e))},st={test:ds("rgb","red"),parse:ia("red","green","blue"),transform:({red:e,green:t,blue:n,alpha:i=1})=>"rgba("+Kn.transform(e)+", "+Kn.transform(t)+", "+Kn.transform(n)+", "+Ot($t.transform(i))+")"};function Gc(e){let t="",n="",i="",s="";return e.length>5?(t=e.substring(1,3),n=e.substring(3,5),i=e.substring(5,7),s=e.substring(7,9)):(t=e.substring(1,2),n=e.substring(2,3),i=e.substring(3,4),s=e.substring(4,5),t+=t,n+=n,i+=i,s+=s),{red:parseInt(t,16),green:parseInt(n,16),blue:parseInt(i,16),alpha:s?parseInt(s,16)/255:1}}const Ai={test:ds("#"),parse:Gc,transform:st.transform},Gt=e=>({test:t=>typeof t=="string"&&t.endsWith(e)&&t.split(" ").length===1,parse:parseFloat,transform:t=>`${t}${e}`}),Ge=Gt("deg"),ze=Gt("%"),I=Gt("px"),Uc=Gt("vh"),Kc=Gt("vw"),qs={...ze,parse:e=>ze.parse(e)/100,transform:e=>ze.transform(e*100)},gt={test:ds("hsl","hue"),parse:ia("hue","saturation","lightness"),transform:({hue:e,saturation:t,lightness:n,alpha:i=1})=>"hsla("+Math.round(e)+", "+ze.transform(Ot(t))+", "+ze.transform(Ot(n))+", "+Ot($t.transform(i))+")"},le={test:e=>st.test(e)||Ai.test(e)||gt.test(e),parse:e=>st.test(e)?st.parse(e):gt.test(e)?gt.parse(e):Ai.parse(e),transform:e=>typeof e=="string"?e:e.hasOwnProperty("red")?st.transform(e):gt.transform(e),getAnimatableNone:e=>{const t=le.parse(e);return t.alpha=0,le.transform(t)}},qc=/(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))/giu;function Qc(e){return isNaN(e)&&typeof e=="string"&&(e.match(us)?.length||0)+(e.match(qc)?.length||0)>0}const sa="number",oa="color",Yc="var",Xc="var(",Qs="${}",Zc=/var\s*\(\s*--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)|#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\)|-?(?:\d+(?:\.\d+)?|\.\d+)/giu;function wt(e){const t=e.toString(),n=[],i={color:[],number:[],var:[]},s=[];let r=0;const a=t.replace(Zc,c=>(le.test(c)?(i.color.push(r),s.push(oa),n.push(le.parse(c))):c.startsWith(Xc)?(i.var.push(r),s.push(Yc),n.push(c)):(i.number.push(r),s.push(sa),n.push(parseFloat(c))),++r,Qs)).split(Qs);return{values:n,split:a,indexes:i,types:s}}function Jc(e){return wt(e).values}function ra({split:e,types:t}){const n=e.length;return i=>{let s="";for(let r=0;r<n;r++)if(s+=e[r],i[r]!==void 0){const o=t[r];o===sa?s+=Ot(i[r]):o===oa?s+=le.transform(i[r]):s+=i[r]}return s}}function eh(e){return ra(wt(e))}const th=e=>typeof e=="number"?0:le.test(e)?le.getAnimatableNone(e):e,nh=(e,t)=>typeof e=="number"?t?.trim().endsWith("/")?e:0:th(e);function ih(e){const t=wt(e);return ra(t)(t.values.map((i,s)=>nh(i,t.split[s])))}const Be={test:Qc,parse:Jc,createTransformer:eh,getAnimatableNone:ih};function qn(e,t,n){return n<0&&(n+=1),n>1&&(n-=1),n<1/6?e+(t-e)*6*n:n<1/2?t:n<2/3?e+(t-e)*(2/3-n)*6:e}function sh({hue:e,saturation:t,lightness:n,alpha:i}){e/=360,t/=100,n/=100;let s=0,r=0,o=0;if(!t)s=r=o=n;else{const a=n<.5?n*(1+t):n+t-n*t,c=2*n-a;s=qn(c,a,e+1/3),r=qn(c,a,e),o=qn(c,a,e-1/3)}return{red:Math.round(s*255),green:Math.round(r*255),blue:Math.round(o*255),alpha:i}}function Pn(e,t){return n=>n>0?t:e}const J=(e,t,n)=>e+(t-e)*n,Qn=(e,t,n)=>{const i=e*e,s=n*(t*t-i)+i;return s<0?0:Math.sqrt(s)},oh=[Ai,st,gt],rh=e=>oh.find(t=>t.test(e));function Ys(e){const t=rh(e);if(!t)return!1;let n=t.parse(e);return t===gt&&(n=sh(n)),n}const Xs=(e,t)=>{const n=Ys(e),i=Ys(t);if(!n||!i)return Pn(e,t);const s={...n};return r=>(s.red=Qn(n.red,i.red,r),s.green=Qn(n.green,i.green,r),s.blue=Qn(n.blue,i.blue,r),s.alpha=J(n.alpha,i.alpha,r),st.transform(s))},Pi=new Set(["none","hidden"]);function ah(e,t){return Pi.has(e)?n=>n<=0?e:t:n=>n>=1?t:e}function lh(e,t){return n=>J(e,t,n)}function fs(e){return typeof e=="number"?lh:typeof e=="string"?hs(e)?Pn:le.test(e)?Xs:uh:Array.isArray(e)?aa:typeof e=="object"?le.test(e)?Xs:ch:Pn}function aa(e,t){const n=[...e],i=n.length,s=e.map((r,o)=>fs(r)(r,t[o]));return r=>{for(let o=0;o<i;o++)n[o]=s[o](r);return n}}function ch(e,t){const n={...e,...t},i={};for(const s in n)e[s]!==void 0&&t[s]!==void 0&&(i[s]=fs(e[s])(e[s],t[s]));return s=>{for(const r in i)n[r]=i[r](s);return n}}function hh(e,t){const n=[],i={color:0,var:0,number:0};for(let s=0;s<t.values.length;s++){const r=t.types[s],o=e.indexes[r][i[r]],a=e.values[o]??0;n[s]=a,i[r]++}return n}const uh=(e,t)=>{const n=Be.createTransformer(t),i=wt(e),s=wt(t);return i.indexes.var.length===s.indexes.var.length&&i.indexes.color.length===s.indexes.color.length&&i.indexes.number.length>=s.indexes.number.length?Pi.has(e)&&!s.values.length||Pi.has(t)&&!i.values.length?ah(e,t):zt(aa(hh(i,s),s.values),n):Pn(e,t)};function la(e,t,n){return typeof e=="number"&&typeof t=="number"&&typeof n=="number"?J(e,t,n):fs(e)(e,t)}const dh=e=>{const t=({timestamp:n})=>e(n);return{start:(n=!0)=>ee.update(t,n),stop:()=>Xe(t),now:()=>pe.isProcessing?pe.timestamp:ye.now()}},ca=(e,t,n=10)=>{let i="";const s=Math.max(Math.round(t/n),2);for(let r=0;r<s;r++)i+=Math.round(e(r/(s-1))*1e4)/1e4+", ";return`linear(${i.substring(0,i.length-2)})`},ps=2e4;function ms(e,t=50,n=ps,i){let s=0,r=e.next(s);for(;!r.done&&s<n;)s+=t,r=e.next(s);return s>=n?1/0:s}function fh(e,t=100,n){const i=n({...e,keyframes:[0,t]}),s=Math.min(ms(i),ps);return{type:"keyframes",ease:r=>i.next(s*r).value/t,duration:Re(s)}}const oe={stiffness:100,damping:10,mass:1,velocity:0,duration:800,bounce:.3,visualDuration:.3,restSpeed:{granular:.01,default:2},restDelta:{granular:.005,default:.5},minDuration:.01,maxDuration:10,minDamping:.05,maxDamping:1};function Ei(e,t){return e*Math.sqrt(1-t*t)}const ph=12;function mh(e,t,n){let i=n;for(let s=1;s<ph;s++)i=i-e(i)/t(i);return i}const Yn=.001;function gh({duration:e=oe.duration,bounce:t=oe.bounce,velocity:n=oe.velocity,mass:i=oe.mass}){let s,r,o=1-t;o=We(oe.minDamping,oe.maxDamping,o),e=We(oe.minDuration,oe.maxDuration,Re(e)),o<1?(s=l=>{const h=l*o,f=h*e,d=h-n,m=Ei(l,o),g=Math.exp(-f);return Yn-d/m*g},r=l=>{const f=l*o*e,d=f*n+n,m=o*o*l*l*e,g=Math.exp(-f),b=Ei(l*l,o);return(-s(l)+Yn>0?-1:1)*((d-m)*g)/b}):(s=l=>{const h=Math.exp(-l*e),f=(l-n)*e+1;return-Yn+h*f},r=l=>{const h=Math.exp(-l*e),f=(n-l)*(e*e);return h*f});const a=5/e,c=mh(s,r,a);if(e=Le(e),isNaN(c))return{stiffness:oe.stiffness,damping:oe.damping,duration:e};{const l=c*c*i;return{stiffness:l,damping:o*2*Math.sqrt(i*l),duration:e}}}const yh=["duration","bounce"],bh=["stiffness","damping","mass"];function Zs(e,t){return t.some(n=>e[n]!==void 0)}function wh(e){let t={velocity:oe.velocity,stiffness:oe.stiffness,damping:oe.damping,mass:oe.mass,isResolvedFromDuration:!1,...e};if(!Zs(e,bh)&&Zs(e,yh))if(t.velocity=0,e.visualDuration){const n=e.visualDuration,i=2*Math.PI/(n*1.2),s=i*i,r=2*We(.05,1,1-(e.bounce||0))*Math.sqrt(s);t={...t,mass:oe.mass,stiffness:s,damping:r}}else{const n=gh({...e,velocity:0});t={...t,...n,mass:oe.mass},t.isResolvedFromDuration=!0}return t}function En(e=oe.visualDuration,t=oe.bounce){const n=typeof e!="object"?{visualDuration:e,keyframes:[0,1],bounce:t}:e;let{restSpeed:i,restDelta:s}=n;const r=n.keyframes[0],o=n.keyframes[n.keyframes.length-1],a={done:!1,value:r},{stiffness:c,damping:l,mass:h,duration:f,velocity:d,isResolvedFromDuration:m}=wh({...n,velocity:-Re(n.velocity||0)}),g=d||0,b=l/(2*Math.sqrt(c*h)),p=o-r,x=Re(Math.sqrt(c/h)),S=b*x,v=Math.abs(p)<5;i||(i=v?oe.restSpeed.granular:oe.restSpeed.default),s||(s=v?oe.restDelta.granular:oe.restDelta.default);let w,k;if(b<1){const T=Ei(x,b),D=(g+S*p)/T,P=S*D+p*T,N=S*p-D*T;let F=-1,B=0,O=0;const $=C=>{if(C!==F){F=C;const U=Math.exp(-S*C),xe=Math.sin(T*C),L=Math.cos(T*C);B=o-U*(D*xe+p*L),O=U*(P*xe+N*L)}};w=C=>($(C),B),k=C=>($(C),O)}else if(b===1){w=D=>o-Math.exp(-x*D)*(p+(g+x*p)*D);const T=g+x*p;k=D=>Math.exp(-x*D)*(x*T*D-g)}else{const T=x*Math.sqrt(b*b-1);w=F=>{const B=Math.exp(-S*F),O=Math.min(T*F,300);return o-B*((g+S*p)*Math.sinh(O)+T*p*Math.cosh(O))/T};const D=(g+S*p)/T,P=S*D-p*T,N=S*p-D*T;k=F=>{const B=Math.exp(-S*F),O=Math.min(T*F,300);return B*(P*Math.sinh(O)+N*Math.cosh(O))}}const E={calculatedDuration:m&&f||null,velocity:T=>Le(k(T)),next:T=>{const D=w(T);if(m)a.done=T>=f;else{const P=Le(k(T));a.done=Math.abs(P)<=i&&Math.abs(o-D)<=s}return a.value=a.done?o:D,a},toString:()=>{const T=Math.min(ms(E),ps),D=ca(P=>E.next(T*P).value,T,30);return T+"ms "+D},toTransition:()=>{}};return E}En.applyToOptions=e=>{const t=fh(e,100,En);return e.ease=t.ease,e.duration=Le(t.duration),e.type="keyframes",e};function Di({keyframes:e,velocity:t=0,power:n=.8,timeConstant:i=325,bounceDamping:s=10,bounceStiffness:r=500,modifyTarget:o,min:a,max:c,restDelta:l=.5,restSpeed:h}){const f=e[0],d={done:!1,value:f},m=T=>T<a||T>c,g=T=>a===void 0?c:c===void 0||Math.abs(a-T)<Math.abs(c-T)?a:c;let b=n*t;const p=f+b,x=o===void 0?p:o(p);x!==p&&(b=x-f);const S=T=>-b*Math.exp(-T/i),v=T=>{const D=S(T);d.done=Math.abs(D)<=l,d.value=d.done?x:x+D};let w,k;const E=T=>{m(d.value)&&(w=T,k=En({keyframes:[d.value,g(d.value)],velocity:-S(T)/i*1e3,damping:s,stiffness:r,restDelta:l,restSpeed:h}))};return E(0),{calculatedDuration:null,next:T=>{let D=!1;return!k&&w===void 0&&(D=!0,v(T),E(T)),w!==void 0&&T>=w?k.next(T-w):(!D&&v(T),d)}}}function xh(e,t,n){const i=[],s=n||Ye.mix||la,r=e.length-1;for(let o=0;o<r;o++){let a=s(e[o],e[o+1]);if(t){const c=Array.isArray(t)?t[o]||je:t;a=zt(c,a)}i.push(a)}return i}function vh(e,t,{clamp:n=!0,ease:i,mixer:s}={}){const r=e.length;if(In(r===t.length),r===1)return()=>t[0];if(r===2&&t[0]===t[1])return()=>t[1];const o=e[0]===e[1];e[0]>e[r-1]&&(e=[...e].reverse(),t=[...t].reverse());const a=xh(t,i,s),c=a.length,l=h=>{if(o&&h<e[0])return t[0];let f=0;if(c>1)for(;f<e.length-2&&!(h<e[f+1]);f++);const d=Bt(e[f],e[f+1],h);return a[f](d)};return n?h=>l(We(e[0],e[r-1],h)):l}function kh(e,t){const n=e[e.length-1];for(let i=1;i<=t;i++){const s=Bt(0,t,i);e.push(J(n,1,s))}}function Sh(e){const t=[0];return kh(t,e.length-1),t}function Th(e,t){return e.map(n=>n*t)}function Ch(e,t){return e.map(()=>t||Zr).splice(0,e.length-1)}function Rt({duration:e=300,keyframes:t,times:n,ease:i="easeInOut"}){const s=Lc(i)?i.map(Us):Us(i),r={done:!1,value:t[0]},o=Th(n&&n.length===t.length?n:Sh(t),e),a=vh(o,t,{ease:Array.isArray(s)?s:Ch(t,s)});return{calculatedDuration:e,next:c=>(r.value=a(c),r.done=c>=e,r)}}const Ah=5;function Ph(e,t,n){const i=Math.max(t-Ah,0);return zr(n-e(i),t-i)}const Eh=e=>e!==null;function Bn(e,{repeat:t,repeatType:n="loop"},i,s=1){const r=e.filter(Eh),a=s<0||t&&n!=="loop"&&t%2===1?0:r.length-1;return!a||i===void 0?r[a]:i}const Dh={decay:Di,inertia:Di,tween:Rt,keyframes:Rt,spring:En};function ha(e){typeof e.type=="string"&&(e.type=Dh[e.type])}class gs{constructor(){this.updateFinished()}get finished(){return this._finished}updateFinished(){this._finished=new Promise(t=>{this.resolve=t})}notifyFinished(){this.resolve()}then(t,n){return this.finished.then(t,n)}}const Mh=e=>e/100;class Dn extends gs{constructor(t){super(),this.state="idle",this.startTime=null,this.isStopped=!1,this.currentTime=0,this.holdTime=null,this.playbackSpeed=1,this.delayState={done:!1,value:void 0},this.stop=()=>{const{motionValue:n}=this.options;n&&n.updatedAt!==ye.now()&&this.tick(ye.now()),this.isStopped=!0,this.state!=="idle"&&(this.teardown(),this.options.onStop?.())},this.options=t,this.initAnimation(),this.play(),t.autoplay===!1&&this.pause()}initAnimation(){const{options:t}=this;ha(t);const{type:n=Rt,repeat:i=0,repeatDelay:s=0,repeatType:r,velocity:o=0}=t;let{keyframes:a}=t;const c=n||Rt;c!==Rt&&typeof a[0]!="number"&&(this.mixKeyframes=zt(Mh,la(a[0],a[1])),a=[0,100]);const l=c({...t,keyframes:a});r==="mirror"&&(this.mirroredGenerator=c({...t,keyframes:[...a].reverse(),velocity:-o})),l.calculatedDuration===null&&(l.calculatedDuration=ms(l));const{calculatedDuration:h}=l;this.calculatedDuration=h,this.resolvedDuration=h+s,this.totalDuration=this.resolvedDuration*(i+1)-s,this.generator=l}updateTime(t){const n=Math.round(t-this.startTime)*this.playbackSpeed;this.holdTime!==null?this.currentTime=this.holdTime:this.currentTime=n}tick(t,n=!1){const{generator:i,totalDuration:s,mixKeyframes:r,mirroredGenerator:o,resolvedDuration:a,calculatedDuration:c}=this;if(this.startTime===null)return i.next(0);const{delay:l=0,keyframes:h,repeat:f,repeatType:d,repeatDelay:m,type:g,onUpdate:b,finalKeyframe:p}=this.options;this.speed>0?this.startTime=Math.min(this.startTime,t):this.speed<0&&(this.startTime=Math.min(t-s/this.speed,this.startTime)),n?this.currentTime=t:this.updateTime(t);const x=this.currentTime-l*(this.playbackSpeed>=0?1:-1),S=this.playbackSpeed>=0?x<0:x>s;this.currentTime=Math.max(x,0),this.state==="finished"&&this.holdTime===null&&(this.currentTime=s);let v=this.currentTime,w=i;if(f){const D=Math.min(this.currentTime,s)/a;let P=Math.floor(D),N=D%1;!N&&D>=1&&(N=1),N===1&&P--,P=Math.min(P,f+1),P%2&&(d==="reverse"?(N=1-N,m&&(N-=m/a)):d==="mirror"&&(w=o)),v=We(0,1,N)*a}let k;S?(this.delayState.value=h[0],k=this.delayState):k=w.next(v),r&&!S&&(k.value=r(k.value));let{done:E}=k;!S&&c!==null&&(E=this.playbackSpeed>=0?this.currentTime>=s:this.currentTime<=0);const T=this.holdTime===null&&(this.state==="finished"||this.state==="running"&&E);return T&&g!==Di&&(k.value=Bn(h,this.options,p,this.speed)),b&&b(k.value),T&&this.finish(),k}then(t,n){return this.finished.then(t,n)}get duration(){return Re(this.calculatedDuration)}get iterationDuration(){const{delay:t=0}=this.options||{};return this.duration+Re(t)}get time(){return Re(this.currentTime)}set time(t){t=Le(t),this.currentTime=t,this.startTime===null||this.holdTime!==null||this.playbackSpeed===0?this.holdTime=t:this.driver&&(this.startTime=this.driver.now()-t/this.playbackSpeed),this.driver?this.driver.start(!1):(this.startTime=0,this.state="paused",this.holdTime=t,this.tick(t))}getGeneratorVelocity(){const t=this.currentTime;if(t<=0)return this.options.velocity||0;if(this.generator.velocity)return this.generator.velocity(t);const n=this.generator.next(t).value;return Ph(i=>this.generator.next(i).value,t,n)}get speed(){return this.playbackSpeed}set speed(t){const n=this.playbackSpeed!==t;n&&this.driver&&this.updateTime(ye.now()),this.playbackSpeed=t,n&&this.driver&&(this.time=Re(this.currentTime))}play(){if(this.isStopped)return;const{driver:t=dh,startTime:n}=this.options;this.driver||(this.driver=t(s=>this.tick(s))),this.options.onPlay?.();const i=this.driver.now();this.state==="finished"?(this.updateFinished(),this.startTime=i):this.holdTime!==null?this.startTime=i-this.holdTime:this.startTime||(this.startTime=n??i),this.state==="finished"&&this.speed<0&&(this.startTime+=this.calculatedDuration),this.holdTime=null,this.state="running",this.driver.start()}pause(){this.state="paused",this.updateTime(ye.now()),this.holdTime=this.currentTime}complete(){this.state!=="running"&&this.play(),this.state="finished",this.holdTime=null}finish(){this.notifyFinished(),this.teardown(),this.state="finished",this.options.onComplete?.()}cancel(){this.holdTime=null,this.startTime=0,this.tick(0),this.teardown(),this.options.onCancel?.()}teardown(){this.state="idle",this.stopDriver(),this.startTime=this.holdTime=null}stopDriver(){this.driver&&(this.driver.stop(),this.driver=void 0)}sample(t){return this.startTime=0,this.tick(t,!0)}attachTimeline(t){return this.options.allowFlatten&&(this.options.type="keyframes",this.options.ease="linear",this.initAnimation()),this.driver?.stop(),t.observe(this)}}function Oh(e){for(let t=1;t<e.length;t++)e[t]??(e[t]=e[t-1])}const ot=e=>e*180/Math.PI,Mi=e=>{const t=ot(Math.atan2(e[1],e[0]));return Oi(t)},Rh={x:4,y:5,translateX:4,translateY:5,scaleX:0,scaleY:3,scale:e=>(Math.abs(e[0])+Math.abs(e[3]))/2,rotate:Mi,rotateZ:Mi,skewX:e=>ot(Math.atan(e[1])),skewY:e=>ot(Math.atan(e[2])),skew:e=>(Math.abs(e[1])+Math.abs(e[2]))/2},Oi=e=>(e=e%360,e<0&&(e+=360),e),Js=Mi,eo=e=>Math.sqrt(e[0]*e[0]+e[1]*e[1]),to=e=>Math.sqrt(e[4]*e[4]+e[5]*e[5]),jh={x:12,y:13,z:14,translateX:12,translateY:13,translateZ:14,scaleX:eo,scaleY:to,scale:e=>(eo(e)+to(e))/2,rotateX:e=>Oi(ot(Math.atan2(e[6],e[5]))),rotateY:e=>Oi(ot(Math.atan2(-e[2],e[0]))),rotateZ:Js,rotate:Js,skewX:e=>ot(Math.atan(e[4])),skewY:e=>ot(Math.atan(e[1])),skew:e=>(Math.abs(e[1])+Math.abs(e[4]))/2};function Ri(e){return e.includes("scale")?1:0}function ji(e,t){if(!e||e==="none")return Ri(t);const n=e.match(/^matrix3d\(([-\d.e\s,]+)\)$/u);let i,s;if(n)i=jh,s=n;else{const a=e.match(/^matrix\(([-\d.e\s,]+)\)$/u);i=Rh,s=a}if(!s)return Ri(t);const r=i[t],o=s[1].split(",").map(Nh);return typeof r=="function"?r(o):o[r]}const Lh=(e,t)=>{const{transform:n="none"}=getComputedStyle(e);return ji(n,t)};function Nh(e){return parseFloat(e.trim())}const kt=["transformPerspective","x","y","z","translateX","translateY","translateZ","scale","scaleX","scaleY","rotate","rotateX","rotateY","rotateZ","skew","skewX","skewY"],St=new Set([...kt,"pathRotation"]),no=e=>e===vt||e===I,Vh=new Set(["x","y","z"]),Ih=kt.filter(e=>!Vh.has(e));function Bh(e){const t=[];return Ih.forEach(n=>{const i=e.getValue(n);i!==void 0&&(t.push([n,i.get()]),i.set(n.startsWith("scale")?1:0))}),t}const Qe={width:({x:e},{paddingLeft:t="0",paddingRight:n="0",boxSizing:i})=>{const s=e.max-e.min;return i==="border-box"?s:s-parseFloat(t)-parseFloat(n)},height:({y:e},{paddingTop:t="0",paddingBottom:n="0",boxSizing:i})=>{const s=e.max-e.min;return i==="border-box"?s:s-parseFloat(t)-parseFloat(n)},top:(e,{top:t})=>parseFloat(t),left:(e,{left:t})=>parseFloat(t),bottom:({y:e},{top:t})=>parseFloat(t)+(e.max-e.min),right:({x:e},{left:t})=>parseFloat(t)+(e.max-e.min),x:(e,{transform:t})=>ji(t,"x"),y:(e,{transform:t})=>ji(t,"y")};Qe.translateX=Qe.x;Qe.translateY=Qe.y;const rt=new Set;let Li=!1,Ni=!1,Vi=!1;function ua(){if(Ni){const e=Array.from(rt).filter(i=>i.needsMeasurement),t=new Set(e.map(i=>i.element)),n=new Map;t.forEach(i=>{const s=Bh(i);s.length&&(n.set(i,s),i.render())}),e.forEach(i=>i.measureInitialState()),t.forEach(i=>{i.render();const s=n.get(i);s&&s.forEach(([r,o])=>{i.getValue(r)?.set(o)})}),e.forEach(i=>i.measureEndState()),e.forEach(i=>{i.suspendedScrollY!==void 0&&window.scrollTo(0,i.suspendedScrollY)})}Ni=!1,Li=!1,rt.forEach(e=>e.complete(Vi)),rt.clear()}function da(){rt.forEach(e=>{e.readKeyframes(),e.needsMeasurement&&(Ni=!0)})}function $h(){Vi=!0,da(),ua(),Vi=!1}class ys{constructor(t,n,i,s,r,o=!1){this.state="pending",this.isAsync=!1,this.needsMeasurement=!1,this.unresolvedKeyframes=[...t],this.onComplete=n,this.name=i,this.motionValue=s,this.element=r,this.isAsync=o}scheduleResolve(){this.state="scheduled",this.isAsync?(rt.add(this),Li||(Li=!0,ee.read(da),ee.resolveKeyframes(ua))):(this.readKeyframes(),this.complete())}readKeyframes(){const{unresolvedKeyframes:t,name:n,element:i,motionValue:s}=this;if(t[0]===null){const r=s?.get(),o=t[t.length-1];if(r!==void 0)t[0]=r;else if(i&&n){const a=i.readValue(n,o);a!=null&&(t[0]=a)}t[0]===void 0&&(t[0]=o),s&&r===void 0&&s.set(t[0])}Oh(t)}setFinalKeyframe(){}measureInitialState(){}renderEndStyles(){}measureEndState(){}complete(t=!1){this.state="complete",this.onComplete(this.unresolvedKeyframes,this.finalKeyframe,t),rt.delete(this)}cancel(){this.state==="scheduled"&&(rt.delete(this),this.state="pending")}resume(){this.state==="pending"&&this.scheduleResolve()}}const Fh=e=>e.startsWith("--");function fa(e,t,n){Fh(t)?e.style.setProperty(t,n):e.style[t]=n}const _h={};function pa(e,t){const n=Hr(e);return()=>_h[t]??n()}const Hh=pa(()=>window.ScrollTimeline!==void 0,"scrollTimeline"),ma=pa(()=>{try{document.createElement("div").animate({opacity:0},{easing:"linear(0, 1)"})}catch{return!1}return!0},"linearEasing"),Et=([e,t,n,i])=>`cubic-bezier(${e}, ${t}, ${n}, ${i})`,io={linear:"linear",ease:"ease",easeIn:"ease-in",easeOut:"ease-out",easeInOut:"ease-in-out",circIn:Et([0,.65,.55,1]),circOut:Et([.55,0,1,.45]),backIn:Et([.31,.01,.66,-.59]),backOut:Et([.33,1.53,.69,.99])};function ga(e,t){if(e)return typeof e=="function"?ma()?ca(e,t):"ease-out":Jr(e)?Et(e):Array.isArray(e)?e.map(n=>ga(n,t)||io.easeOut):io[e]}function zh(e,t,n,{delay:i=0,duration:s=300,repeat:r=0,repeatType:o="loop",ease:a="easeOut",times:c}={},l=void 0){const h={[t]:n};c&&(h.offset=c);const f=ga(a,s);Array.isArray(f)&&(h.easing=f);const d={delay:i,duration:s,easing:Array.isArray(f)?"linear":f,fill:"both",iterations:r+1,direction:o==="reverse"?"alternate":"normal"};return l&&(d.pseudoElement=l),e.animate(h,d)}function ya(e){return typeof e=="function"&&"applyToOptions"in e}function Wh({type:e,...t}){return ya(e)&&ma()?e.applyToOptions(t):(t.duration??(t.duration=300),t.ease??(t.ease="easeOut"),t)}class ba extends gs{constructor(t){if(super(),this.finishedTime=null,this.isStopped=!1,this.manualStartTime=null,!t)return;const{element:n,name:i,keyframes:s,pseudoElement:r,allowFlatten:o=!1,finalKeyframe:a,onComplete:c}=t;this.isPseudoElement=!!r,this.allowFlatten=o,this.options=t,In(typeof t.type!="string");const l=Wh(t);this.animation=zh(n,i,s,l,r),l.autoplay===!1&&this.animation.pause(),this.animation.onfinish=()=>{if(this.finishedTime=this.time,!r){const h=Bn(s,this.options,a,this.speed);this.updateMotionValue&&this.updateMotionValue(h),fa(n,i,h),this.animation.cancel()}c?.(),this.notifyFinished()}}play(){this.isStopped||(this.manualStartTime=null,this.animation.play(),this.state==="finished"&&this.updateFinished())}pause(){this.animation.pause()}complete(){this.animation.finish?.()}cancel(){try{this.animation.cancel()}catch{}}stop(){if(this.isStopped)return;this.isStopped=!0;const{state:t}=this;t==="idle"||t==="finished"||(this.updateMotionValue?this.updateMotionValue():this.commitStyles(),this.isPseudoElement||this.cancel())}commitStyles(){const t=this.options?.element;!this.isPseudoElement&&t?.isConnected&&this.animation.commitStyles?.()}get duration(){const t=this.animation.effect?.getComputedTiming?.().duration||0;return Re(Number(t))}get iterationDuration(){const{delay:t=0}=this.options||{};return this.duration+Re(t)}get time(){return Re(Number(this.animation.currentTime)||0)}set time(t){const n=this.finishedTime!==null;this.manualStartTime=null,this.finishedTime=null,this.animation.currentTime=Le(t),n&&this.animation.pause()}get speed(){return this.animation.playbackRate}set speed(t){t<0&&(this.finishedTime=null),this.animation.playbackRate=t}get state(){return this.finishedTime!==null?"finished":this.animation.playState}get startTime(){return this.manualStartTime??Number(this.animation.startTime)}set startTime(t){this.manualStartTime=this.animation.startTime=t}attachTimeline({timeline:t,rangeStart:n,rangeEnd:i,observe:s}){return this.allowFlatten&&this.animation.effect?.updateTiming({easing:"linear"}),this.animation.onfinish=null,t&&Hh()?(this.animation.timeline=t,n&&(this.animation.rangeStart=n),i&&(this.animation.rangeEnd=i),je):s(this)}}const wa={anticipate:Qr,backInOut:qr,circInOut:Xr};function Gh(e){return e in wa}function Uh(e){typeof e.ease=="string"&&Gh(e.ease)&&(e.ease=wa[e.ease])}const Xn=10;class Kh extends ba{constructor(t){Uh(t),ha(t),super(t),t.startTime!==void 0&&t.autoplay!==!1&&(this.startTime=t.startTime),this.options=t}updateMotionValue(t){const{motionValue:n,onUpdate:i,onComplete:s,element:r,...o}=this.options;if(!n)return;if(t!==void 0){n.set(t);return}const a=new Dn({...o,autoplay:!1}),c=Math.max(Xn,ye.now()-this.startTime),l=We(0,Xn,c-Xn),h=a.sample(c).value,{name:f}=this.options;r&&f&&fa(r,f,h),n.setWithVelocity(a.sample(Math.max(0,c-l)).value,h,l),a.stop()}}const so=(e,t)=>t==="zIndex"?!1:!!(typeof e=="number"||Array.isArray(e)||typeof e=="string"&&(Be.test(e)||e==="0")&&!e.startsWith("url("));function qh(e){const t=e[0];if(e.length===1)return!0;for(let n=0;n<e.length;n++)if(e[n]!==t)return!0}function Qh(e,t,n,i){const s=e[0];if(s===null)return!1;if(t==="display"||t==="visibility")return!0;const r=e[e.length-1],o=so(s,t),a=so(r,t);return!o||!a?!1:qh(e)||(n==="spring"||ya(n))&&i}function Ii(e){e.duration=0,e.type="keyframes"}const xa=new Set(["opacity","clipPath","filter","transform","backgroundColor"]),Yh=/^(?:oklch|oklab|lab|lch|color|color-mix|light-dark)\(/;function Xh(e){for(let t=0;t<e.length;t++)if(typeof e[t]=="string"&&Yh.test(e[t]))return!0;return!1}const Zh=new Set(["color","backgroundColor","outlineColor","fill","stroke","borderColor","borderTopColor","borderRightColor","borderBottomColor","borderLeftColor"]),Jh=Hr(()=>Object.hasOwnProperty.call(Element.prototype,"animate"));function eu(e){const{motionValue:t,name:n,repeatDelay:i,repeatType:s,damping:r,type:o,keyframes:a}=e,c=t?.owner?.current;if(!(c instanceof HTMLElement)&&!(c instanceof SVGElement))return!1;const{onUpdate:l,transformTemplate:h}=t.owner.getProps();return Jh()&&n&&(xa.has(n)||Zh.has(n)&&Xh(a))&&(n!=="transform"||!h)&&!l&&!i&&s!=="mirror"&&r!==0&&o!=="inertia"}const tu=40;class nu extends gs{constructor({autoplay:t=!0,delay:n=0,type:i="keyframes",repeat:s=0,repeatDelay:r=0,repeatType:o="loop",keyframes:a,name:c,motionValue:l,element:h,...f}){super(),this.stop=()=>{this._animation&&(this._animation.stop(),this.stopTimeline?.()),this.keyframeResolver?.cancel()},this.createdAt=ye.now();const d={autoplay:t,delay:n,type:i,repeat:s,repeatDelay:r,repeatType:o,name:c,motionValue:l,element:h,...f},m=h?.KeyframeResolver||ys;this.keyframeResolver=new m(a,(g,b,p)=>this.onKeyframesResolved(g,b,d,!p),c,l,h),this.keyframeResolver?.scheduleResolve()}onKeyframesResolved(t,n,i,s){this.keyframeResolver=void 0;const{name:r,type:o,velocity:a,delay:c,isHandoff:l,onUpdate:h}=i;this.resolvedAt=ye.now();let f=!0;Qh(t,r,o,a)||(f=!1,(Ye.instantAnimations||!c)&&h?.(Bn(t,i,n)),t[0]=t[t.length-1],Ii(i),i.repeat=0);const m={startTime:s?this.resolvedAt?this.resolvedAt-this.createdAt>tu?this.resolvedAt:this.createdAt:this.createdAt:void 0,finalKeyframe:n,...i,keyframes:t},g=f&&!l&&eu(m),b=m.motionValue?.owner?.current;let p;if(g)try{p=new Kh({...m,element:b})}catch{p=new Dn(m)}else p=new Dn(m);p.finished.then(()=>{this.notifyFinished()}).catch(je),this.pendingTimeline&&(this.stopTimeline=p.attachTimeline(this.pendingTimeline),this.pendingTimeline=void 0),this._animation=p}get finished(){return this._animation?this.animation.finished:this._finished}then(t,n){return this.finished.finally(t).then(()=>{})}get animation(){return this._animation||(this.keyframeResolver?.resume(),$h()),this._animation}get duration(){return this.animation.duration}get iterationDuration(){return this.animation.iterationDuration}get time(){return this.animation.time}set time(t){this.animation.time=t}get speed(){return this.animation.speed}get state(){return this.animation.state}set speed(t){this.animation.speed=t}get startTime(){return this.animation.startTime}attachTimeline(t){return this._animation?this.stopTimeline=this.animation.attachTimeline(t):this.pendingTimeline=t,()=>this.stop()}play(){this.animation.play()}pause(){this.animation.pause()}complete(){this.animation.complete()}cancel(){this._animation&&this.animation.cancel(),this.keyframeResolver?.cancel()}}function va(e,t,n,i=0,s=1){const r=Array.from(e).sort((l,h)=>l.sortNodePosition(h)).indexOf(t),o=e.size,a=(o-1)*i;return typeof n=="function"?n(r,o):s===1?r*i:a-r*i}const oo=30,iu=e=>!isNaN(parseFloat(e));class su{constructor(t,n={}){this.canTrackVelocity=null,this.events={},this.updateAndNotify=i=>{const s=ye.now();if(this.updatedAt!==s&&this.setPrevFrameValue(),this.prev=this.current,this.setCurrent(i),this.current!==this.prev&&(this.events.change?.notify(this.current),this.dependents))for(const r of this.dependents)r.dirty()},this.hasAnimated=!1,this.setCurrent(t),this.owner=n.owner}setCurrent(t){this.current=t,this.updatedAt=ye.now(),this.canTrackVelocity===null&&t!==void 0&&(this.canTrackVelocity=iu(this.current))}setPrevFrameValue(t=this.current){this.prevFrameValue=t,this.prevUpdatedAt=this.updatedAt}onChange(t){return this.on("change",t)}on(t,n){this.events[t]||(this.events[t]=new as);const i=this.events[t].add(n);return t==="change"?()=>{i(),ee.read(()=>{this.events.change.getSize()||this.stop()})}:i}clearListeners(){for(const t in this.events)this.events[t].clear()}attach(t,n){this.passiveEffect=t,this.stopPassiveEffect=n}set(t){this.passiveEffect?this.passiveEffect(t,this.updateAndNotify):this.updateAndNotify(t)}setWithVelocity(t,n,i){this.set(n),this.prev=void 0,this.prevFrameValue=t,this.prevUpdatedAt=this.updatedAt-i}jump(t,n=!0){this.updateAndNotify(t),this.prev=t,this.prevUpdatedAt=this.prevFrameValue=void 0,n&&this.stop(),this.stopPassiveEffect&&this.stopPassiveEffect()}dirty(){this.events.change?.notify(this.current)}addDependent(t){this.dependents||(this.dependents=new Set),this.dependents.add(t)}removeDependent(t){this.dependents&&this.dependents.delete(t)}get(){return this.current}getPrevious(){return this.prev}getVelocity(){const t=ye.now();if(!this.canTrackVelocity||this.prevFrameValue===void 0||t-this.updatedAt>oo)return 0;const n=Math.min(this.updatedAt-this.prevUpdatedAt,oo);return zr(parseFloat(this.current)-parseFloat(this.prevFrameValue),n)}start(t){return this.stop(),new Promise(n=>{this.hasAnimated=!0,this.animation=t(n),this.events.animationStart&&this.events.animationStart.notify()}).then(()=>{this.events.animationComplete&&this.events.animationComplete.notify(),this.clearAnimation()})}stop(){this.animation&&(this.animation.stop(),this.events.animationCancel&&this.events.animationCancel.notify()),this.clearAnimation()}isAnimating(){return!!this.animation}clearAnimation(){delete this.animation}destroy(){this.dependents?.clear(),this.events.destroy?.notify(),this.clearListeners(),this.stop(),this.stopPassiveEffect&&this.stopPassiveEffect()}}function xt(e,t){return new su(e,t)}function ka(e,t){if(e?.inherit&&t){const{inherit:n,...i}=e;return{...t,...i}}return e}function bs(e,t){const n=e?.[t]??e?.default??e;return n!==e?ka(n,e):n}const ou={type:"spring",stiffness:500,damping:25,restSpeed:10},ru=e=>({type:"spring",stiffness:550,damping:e===0?2*Math.sqrt(550):30,restSpeed:10}),au={type:"keyframes",duration:.8},lu={type:"keyframes",ease:[.25,.1,.35,1],duration:.3},cu=(e,{keyframes:t})=>t.length>2?au:St.has(e)?e.startsWith("scale")?ru(t[1]):ou:lu,hu=new Set(["when","delay","delayChildren","staggerChildren","staggerDirection","repeat","repeatType","repeatDelay","from","elapsed"]);function uu(e){for(const t in e)if(!hu.has(t))return!0;return!1}const ws=(e,t,n,i={},s,r)=>o=>{const a=bs(i,e)||{},c=a.delay||i.delay||0;let{elapsed:l=0}=i;l=l-Le(c);const h={keyframes:Array.isArray(n)?n:[null,n],ease:"easeOut",velocity:t.getVelocity(),...a,delay:-l,onUpdate:d=>{t.set(d),a.onUpdate&&a.onUpdate(d)},onComplete:()=>{o(),a.onComplete&&a.onComplete()},name:e,motionValue:t,element:r?void 0:s};uu(a)||Object.assign(h,cu(e,h)),h.duration&&(h.duration=Le(h.duration)),h.repeatDelay&&(h.repeatDelay=Le(h.repeatDelay)),h.from!==void 0&&(h.keyframes[0]=h.from);let f=!1;if((h.type===!1||h.duration===0&&!h.repeatDelay)&&(Ii(h),h.delay===0&&(f=!0)),(Ye.instantAnimations||Ye.skipAnimations||s?.shouldSkipAnimations||a.skipAnimations)&&(f=!0,Ii(h),h.delay=0),h.allowFlatten=!a.type&&!a.ease,f&&!r&&t.get()!==void 0){const d=Bn(h.keyframes,a);if(d!==void 0){ee.update(()=>{h.onUpdate(d),h.onComplete()});return}}return a.isSync?new Dn(h):new nu(h)},du=/^var\(--(?:([\w-]+)|([\w-]+), ?([a-zA-Z\d ()%#.,-]+))\)/u;function fu(e){const t=du.exec(e);if(!t)return[,];const[,n,i,s]=t;return[`--${n??i}`,s]}function Sa(e,t,n=1){const[i,s]=fu(e);if(!i)return;const r=window.getComputedStyle(t).getPropertyValue(i);if(r){const o=r.trim();return $r(o)?parseFloat(o):o}return hs(s)?Sa(s,t,n+1):s}function ro(e){const t=[{},{}];return e?.values.forEach((n,i)=>{t[0][i]=n.get(),t[1][i]=n.getVelocity()}),t}function xs(e,t,n,i){if(typeof t=="function"){const[s,r]=ro(i);t=t(n!==void 0?n:e.custom,s,r)}if(typeof t=="string"&&(t=e.variants&&e.variants[t]),typeof t=="function"){const[s,r]=ro(i);t=t(n!==void 0?n:e.custom,s,r)}return t}function at(e,t,n){const i=e.getProps();return xs(i,t,n!==void 0?n:i.custom,e)}const Ta=new Set(["width","height","top","left","right","bottom",...kt]),Bi=e=>Array.isArray(e);function pu(e,t,n){e.hasValue(t)?e.getValue(t).set(n):e.addValue(t,xt(n))}function mu(e){return Bi(e)?e[e.length-1]||0:e}function gu(e,t){const n=at(e,t);let{transitionEnd:i={},transition:s={},...r}=n||{};r={...r,...i};for(const o in r){const a=mu(r[o]);pu(e,o,a)}}const me=e=>!!(e&&e.getVelocity);function yu(e){return!!(me(e)&&e.add)}function $i(e,t){const n=e.getValue("willChange");if(yu(n))return n.add(t);if(!n&&Ye.WillChange){const i=new Ye.WillChange("auto");e.addValue("willChange",i),i.add(t)}}function vs(e){return e.replace(/([A-Z])/g,t=>`-${t.toLowerCase()}`)}const bu="framerAppearId",Ca="data-"+vs(bu);function Aa(e){return e.props[Ca]}const wu=typeof window<"u";function xu({protectedKeys:e,needsAnimating:t},n){const i=e.hasOwnProperty(n)&&t[n]!==!0;return t[n]=!1,i}function Pa(e,t,{delay:n=0,transitionOverride:i,type:s}={}){let{transition:r,transitionEnd:o,...a}=t;const c=e.getDefaultTransition();r=r?ka(r,c):c;const l=r?.reduceMotion,h=r?.skipAnimations;i&&(r=i);const f=[],d=s&&e.animationState&&e.animationState.getState()[s],m=r?.path;m&&m.animateVisualElement(e,a,r,n,f);for(const g in a){const b=e.getValue(g,e.latestValues[g]??null),p=a[g];if(p===void 0||d&&xu(d,g))continue;const x={delay:n,...bs(r||{},g)};h&&(x.skipAnimations=!0);const S=b.get();if(S!==void 0&&!b.isAnimating()&&!Array.isArray(p)&&p===S&&!x.velocity){ee.update(()=>b.set(p));continue}let v=!1;if(wu&&window.MotionHandoffAnimation){const E=Aa(e);if(E){const T=window.MotionHandoffAnimation(E,g,ee);T!==null&&(x.startTime=T,v=!0)}}$i(e,g);const w=l??e.shouldReduceMotion;b.start(ws(g,b,p,w&&Ta.has(g)?{type:!1}:x,e,v));const k=b.animation;k&&f.push(k)}if(o){const g=()=>ee.update(()=>{o&&gu(e,o)});f.length?Promise.all(f).then(g):g()}return f}function Fi(e,t,n={}){const i=at(e,t,n.type==="exit"?e.presenceContext?.custom:void 0);let{transition:s=e.getDefaultTransition()||{}}=i||{};n.transitionOverride&&(s=n.transitionOverride);const r=i?()=>Promise.all(Pa(e,i,n)):()=>Promise.resolve(),o=e.variantChildren&&e.variantChildren.size?(c=0)=>{const{delayChildren:l=0,staggerChildren:h,staggerDirection:f}=s;return vu(e,t,c,l,h,f,n)}:()=>Promise.resolve(),{when:a}=s;if(a){const[c,l]=a==="beforeChildren"?[r,o]:[o,r];return c().then(()=>l())}else return Promise.all([r(),o(n.delay)])}function vu(e,t,n=0,i=0,s=0,r=1,o){const a=[];for(const c of e.variantChildren)c.notify("AnimationStart",t),a.push(Fi(c,t,{...o,delay:n+(typeof i=="function"?0:i)+va(e.variantChildren,c,i,s,r)}).then(()=>c.notify("AnimationComplete",t)));return Promise.all(a)}function ku(e,t,n={}){e.notify("AnimationStart",t);let i;if(Array.isArray(t)){const s=t.map(r=>Fi(e,r,n));i=Promise.all(s)}else if(typeof t=="string")i=Fi(e,t,n);else{const s=typeof t=="function"?at(e,t,n.custom):t;i=Promise.all(Pa(e,s,n))}return i.then(()=>{e.notify("AnimationComplete",t)})}const Su={test:e=>e==="auto",parse:e=>e},Ea=e=>t=>t.test(e),Da=[vt,I,ze,Ge,Kc,Uc,Su],ao=e=>Da.find(Ea(e));function Tu(e){return typeof e=="number"?e===0:e!==null?e==="none"||e==="0"||_r(e):!0}const Cu=new Set(["brightness","contrast","saturate","opacity"]);function Au(e){const[t,n]=e.slice(0,-1).split("(");if(t==="drop-shadow")return e;const[i]=n.match(us)||[];if(!i)return e;const s=n.replace(i,"");let r=Cu.has(t)?1:0;return i!==n&&(r*=100),t+"("+r+s+")"}const Pu=/\b([a-z-]*)\(.*?\)/gu,_i={...Be,getAnimatableNone:e=>{const t=e.match(Pu);return t?t.map(Au).join(" "):e}},Hi={...Be,getAnimatableNone:e=>{const t=Be.parse(e);return Be.createTransformer(e)(t.map(i=>typeof i=="number"?0:typeof i=="object"?{...i,alpha:1}:i))}},lo={...vt,transform:Math.round},Eu={rotate:Ge,pathRotation:Ge,rotateX:Ge,rotateY:Ge,rotateZ:Ge,scale:en,scaleX:en,scaleY:en,scaleZ:en,skew:Ge,skewX:Ge,skewY:Ge,distance:I,translateX:I,translateY:I,translateZ:I,x:I,y:I,z:I,perspective:I,transformPerspective:I,opacity:$t,originX:qs,originY:qs,originZ:I},Mn={borderWidth:I,borderTopWidth:I,borderRightWidth:I,borderBottomWidth:I,borderLeftWidth:I,borderRadius:I,borderTopLeftRadius:I,borderTopRightRadius:I,borderBottomRightRadius:I,borderBottomLeftRadius:I,width:I,maxWidth:I,height:I,maxHeight:I,top:I,right:I,bottom:I,left:I,inset:I,insetBlock:I,insetBlockStart:I,insetBlockEnd:I,insetInline:I,insetInlineStart:I,insetInlineEnd:I,padding:I,paddingTop:I,paddingRight:I,paddingBottom:I,paddingLeft:I,paddingBlock:I,paddingBlockStart:I,paddingBlockEnd:I,paddingInline:I,paddingInlineStart:I,paddingInlineEnd:I,margin:I,marginTop:I,marginRight:I,marginBottom:I,marginLeft:I,marginBlock:I,marginBlockStart:I,marginBlockEnd:I,marginInline:I,marginInlineStart:I,marginInlineEnd:I,fontSize:I,backgroundPositionX:I,backgroundPositionY:I,...Eu,zIndex:lo,fillOpacity:$t,strokeOpacity:$t,numOctaves:lo},Du={...Mn,color:le,backgroundColor:le,outlineColor:le,fill:le,stroke:le,borderColor:le,borderTopColor:le,borderRightColor:le,borderBottomColor:le,borderLeftColor:le,filter:_i,WebkitFilter:_i,mask:Hi,WebkitMask:Hi},Ma=e=>Du[e],Mu=new Set([_i,Hi]);function Oa(e,t){let n=Ma(e);return Mu.has(n)||(n=Be),n.getAnimatableNone?n.getAnimatableNone(t):void 0}const Ou=new Set(["auto","none","0"]);function Ru(e,t,n){let i=0,s;for(;i<e.length&&!s;){const r=e[i];typeof r=="string"&&!Ou.has(r)&&wt(r).values.length&&(s=e[i]),i++}if(s&&n)for(const r of t)e[r]=Oa(n,s)}class ju extends ys{constructor(t,n,i,s,r){super(t,n,i,s,r,!0)}readKeyframes(){const{unresolvedKeyframes:t,element:n,name:i}=this;if(!n||!n.current)return;super.readKeyframes();for(let h=0;h<t.length;h++){let f=t[h];if(typeof f=="string"&&(f=f.trim(),hs(f))){const d=Sa(f,n.current);d!==void 0&&(t[h]=d),h===t.length-1&&(this.finalKeyframe=f)}}if(this.resolveNoneKeyframes(),!Ta.has(i)||t.length!==2)return;const[s,r]=t,o=ao(s),a=ao(r),c=Ks(s),l=Ks(r);if(c!==l&&Qe[i]){this.needsMeasurement=!0;return}if(o!==a)if(no(o)&&no(a))for(let h=0;h<t.length;h++){const f=t[h];typeof f=="string"&&(t[h]=parseFloat(f))}else Qe[i]&&(this.needsMeasurement=!0)}resolveNoneKeyframes(){const{unresolvedKeyframes:t,name:n}=this,i=[];for(let s=0;s<t.length;s++)(t[s]===null||Tu(t[s]))&&i.push(s);i.length&&Ru(t,i,n)}measureInitialState(){const{element:t,unresolvedKeyframes:n,name:i}=this;if(!t||!t.current)return;i==="height"&&(this.suspendedScrollY=window.pageYOffset),this.measuredOrigin=Qe[i](t.measureViewportBox(),window.getComputedStyle(t.current)),n[0]=this.measuredOrigin;const s=n[n.length-1];s!==void 0&&t.getValue(i,s).jump(s,!1)}measureEndState(){const{element:t,name:n,unresolvedKeyframes:i}=this;if(!t||!t.current)return;const s=t.getValue(n);s&&s.jump(this.measuredOrigin,!1);const r=i.length-1,o=i[r];i[r]=Qe[n](t.measureViewportBox(),window.getComputedStyle(t.current)),o!==null&&this.finalKeyframe===void 0&&(this.finalKeyframe=o),this.removedTransforms?.length&&this.removedTransforms.forEach(([a,c])=>{t.getValue(a).set(c)}),this.resolveNoneKeyframes()}}const ks=["borderTopLeftRadius","borderTopRightRadius","borderBottomRightRadius","borderBottomLeftRadius"];function Ra(e,t,n){if(e==null)return[];if(e instanceof EventTarget)return[e];if(typeof e=="string"){let i=document;const s=n?.[e]??i.querySelectorAll(e);return s?Array.from(s):[]}return Array.from(e).filter(i=>i!=null)}const zi=(e,t)=>t&&typeof e=="number"?t.transform(e):e;function pn(e){return Fr(e)&&"offsetHeight"in e&&!("ownerSVGElement"in e)}const{schedule:Ss}=ea(queueMicrotask,!1),Ie={x:!1,y:!1};function ja(){return Ie.x||Ie.y}function Lu(e){return e==="x"||e==="y"?Ie[e]?null:(Ie[e]=!0,()=>{Ie[e]=!1}):Ie.x||Ie.y?null:(Ie.x=Ie.y=!0,()=>{Ie.x=Ie.y=!1})}function La(e,t){const n=Ra(e),i=new AbortController,s={passive:!0,...t,signal:i.signal};return[n,s,()=>i.abort()]}function Nu(e){return!(e.pointerType==="touch"||ja())}function Vu(e,t,n={}){const[i,s,r]=La(e,n);return i.forEach(o=>{let a=!1,c=!1,l;const h=()=>{o.removeEventListener("pointerleave",g)},f=p=>{l&&(l(p),l=void 0),h()},d=p=>{a=!1,window.removeEventListener("pointerup",d),window.removeEventListener("pointercancel",d),c&&(c=!1,f(p))},m=()=>{a=!0,window.addEventListener("pointerup",d,s),window.addEventListener("pointercancel",d,s)},g=p=>{if(p.pointerType!=="touch"){if(a){c=!0;return}f(p)}},b=p=>{if(!Nu(p))return;c=!1;const x=t(o,p);typeof x=="function"&&(l=x,o.addEventListener("pointerleave",g,s))};o.addEventListener("pointerenter",b,s),o.addEventListener("pointerdown",m,s)}),r}const Na=(e,t)=>t?e===t?!0:Na(e,t.parentElement):!1,Ts=e=>e.pointerType==="mouse"?typeof e.button!="number"||e.button<=0:e.isPrimary!==!1,Iu=new Set(["BUTTON","INPUT","SELECT","TEXTAREA","A"]);function Bu(e){return Iu.has(e.tagName)||e.isContentEditable===!0}const $u=new Set(["INPUT","SELECT","TEXTAREA"]);function Fu(e){return $u.has(e.tagName)||e.isContentEditable===!0}const mn=new WeakSet;function co(e){return t=>{t.key==="Enter"&&e(t)}}function Zn(e,t){e.dispatchEvent(new PointerEvent("pointer"+t,{isPrimary:!0,bubbles:!0}))}const _u=(e,t)=>{const n=e.currentTarget;if(!n)return;const i=co(()=>{if(mn.has(n))return;Zn(n,"down");const s=co(()=>{Zn(n,"up")}),r=()=>Zn(n,"cancel");n.addEventListener("keyup",s,t),n.addEventListener("blur",r,t)});n.addEventListener("keydown",i,t),n.addEventListener("blur",()=>n.removeEventListener("keydown",i),t)};function ho(e){return Ts(e)&&!ja()}const uo=new WeakSet;function Hu(e,t,n={}){const[i,s,r]=La(e,n),o=a=>{const c=a.currentTarget;if(!ho(a)||uo.has(a))return;mn.add(c),n.stopPropagation&&uo.add(a);const l=t(c,a),h={...s,capture:!0},f=(g,b)=>{window.removeEventListener("pointerup",d,h),window.removeEventListener("pointercancel",m,h),mn.has(c)&&mn.delete(c),ho(g)&&typeof l=="function"&&l(g,{success:b})},d=g=>{f(g,c===window||c===document||n.useGlobalTarget||Na(c,g.target))},m=g=>{f(g,!1)};window.addEventListener("pointerup",d,h),window.addEventListener("pointercancel",m,h)};return i.forEach(a=>{(n.useGlobalTarget?window:a).addEventListener("pointerdown",o,s),pn(a)&&(a.addEventListener("focus",l=>_u(l,s)),!Bu(a)&&!a.hasAttribute("tabindex")&&(a.tabIndex=0))}),r}function Cs(e){return Fr(e)&&"ownerSVGElement"in e}const gn=new WeakMap;let yn;const Va=(e,t,n)=>(i,s)=>s&&s[0]?s[0][e+"Size"]:Cs(i)&&"getBBox"in i?i.getBBox()[t]:i[n],zu=Va("inline","width","offsetWidth"),Wu=Va("block","height","offsetHeight");function Gu({target:e,borderBoxSize:t}){gn.get(e)?.forEach(n=>{n(e,{get width(){return zu(e,t)},get height(){return Wu(e,t)}})})}function Uu(e){e.forEach(Gu)}function Ku(){typeof ResizeObserver>"u"||(yn=new ResizeObserver(Uu))}function qu(e,t){yn||Ku();const n=Ra(e);return n.forEach(i=>{let s=gn.get(i);s||(s=new Set,gn.set(i,s)),s.add(t),yn?.observe(i)}),()=>{n.forEach(i=>{const s=gn.get(i);s?.delete(t),s?.size||yn?.unobserve(i)})}}const bn=new Set;let yt;function Qu(){yt=()=>{const e={get width(){return window.innerWidth},get height(){return window.innerHeight}};bn.forEach(t=>t(e))},window.addEventListener("resize",yt)}function Yu(e){return bn.add(e),yt||Qu(),()=>{bn.delete(e),!bn.size&&typeof yt=="function"&&(window.removeEventListener("resize",yt),yt=void 0)}}function fo(e,t){return typeof e=="function"?Yu(e):qu(e,t)}function Xu(e){return Cs(e)&&e.tagName==="svg"}const Zu=[...Da,le,Be],Ju=e=>Zu.find(Ea(e)),po=()=>({translate:0,scale:1,origin:0,originPoint:0}),bt=()=>({x:po(),y:po()}),mo=()=>({min:0,max:0}),ue=()=>({x:mo(),y:mo()}),ed=new WeakMap;function $n(e){return e!==null&&typeof e=="object"&&typeof e.start=="function"}function Ft(e){return typeof e=="string"||Array.isArray(e)}const As=["animate","whileInView","whileFocus","whileHover","whileTap","whileDrag","exit"],Ps=["initial",...As];function Fn(e){return $n(e.animate)||Ps.some(t=>Ft(e[t]))}function Ia(e){return!!(Fn(e)||e.variants)}function td(e,t,n){for(const i in t){const s=t[i],r=n[i];if(me(s))e.addValue(i,s);else if(me(r))e.addValue(i,xt(s,{owner:e}));else if(r!==s)if(e.hasValue(i)){const o=e.getValue(i);o.liveStyle===!0?o.jump(s):o.hasAnimated||o.set(s)}else{const o=e.getStaticValue(i);e.addValue(i,xt(o!==void 0?o:s,{owner:e}))}}for(const i in n)t[i]===void 0&&e.removeValue(i);return t}const Wi={current:null},Ba={current:!1},nd=typeof window<"u";function id(){if(Ba.current=!0,!!nd)if(window.matchMedia){const e=window.matchMedia("(prefers-reduced-motion)"),t=()=>Wi.current=e.matches;e.addEventListener("change",t),t()}else Wi.current=!1}const go=["AnimationStart","AnimationComplete","Update","BeforeLayoutMeasure","LayoutMeasure","LayoutAnimationStart","LayoutAnimationComplete"];let On={};function $a(e){On=e}function sd(){return On}class od{scrapeMotionValuesFromProps(t,n,i){return{}}constructor({parent:t,props:n,presenceContext:i,reducedMotionConfig:s,skipAnimations:r,blockInitialAnimation:o,visualState:a},c={}){this.current=null,this.children=new Set,this.isVariantNode=!1,this.isControllingVariants=!1,this.shouldReduceMotion=null,this.shouldSkipAnimations=!1,this.values=new Map,this.KeyframeResolver=ys,this.features={},this.valueSubscriptions=new Map,this.prevMotionValues={},this.hasBeenMounted=!1,this.events={},this.propEventSubscriptions={},this.notifyUpdate=()=>this.notify("Update",this.latestValues),this.render=()=>{this.current&&(this.triggerBuild(),this.renderInstance(this.current,this.renderState,this.props.style,this.projection))},this.renderScheduledAt=0,this.scheduleRender=()=>{const m=ye.now();this.renderScheduledAt<m&&(this.renderScheduledAt=m,ee.render(this.render,!1,!0))};const{latestValues:l,renderState:h}=a;this.latestValues=l,this.baseTarget={...l},this.initialValues=n.initial?{...l}:{},this.renderState=h,this.parent=t,this.props=n,this.presenceContext=i,this.depth=t?t.depth+1:0,this.reducedMotionConfig=s,this.skipAnimationsConfig=r,this.options=c,this.blockInitialAnimation=!!o,this.isControllingVariants=Fn(n),this.isVariantNode=Ia(n),this.isVariantNode&&(this.variantChildren=new Set),this.manuallyAnimateOnMount=!!(t&&t.current);const{willChange:f,...d}=this.scrapeMotionValuesFromProps(n,{},this);for(const m in d){const g=d[m];l[m]!==void 0&&me(g)&&g.set(l[m])}}mount(t){if(this.hasBeenMounted)for(const n in this.initialValues)this.values.get(n)?.jump(this.initialValues[n]),this.latestValues[n]=this.initialValues[n];this.current=t,ed.set(t,this),this.projection&&!this.projection.instance&&this.projection.mount(t),this.parent&&this.isVariantNode&&!this.isControllingVariants&&(this.removeFromVariantTree=this.parent.addVariantChild(this)),this.values.forEach((n,i)=>this.bindToMotionValue(i,n)),this.reducedMotionConfig==="never"?this.shouldReduceMotion=!1:this.reducedMotionConfig==="always"?this.shouldReduceMotion=!0:(Ba.current||id(),this.shouldReduceMotion=Wi.current),this.shouldSkipAnimations=this.skipAnimationsConfig??!1,this.parent?.addChild(this),this.update(this.props,this.presenceContext),this.hasBeenMounted=!0}unmount(){this.projection&&this.projection.unmount(),Xe(this.notifyUpdate),Xe(this.render),this.valueSubscriptions.forEach(t=>t()),this.valueSubscriptions.clear(),this.removeFromVariantTree&&this.removeFromVariantTree(),this.parent?.removeChild(this);for(const t in this.events)this.events[t].clear();for(const t in this.features){const n=this.features[t];n&&(n.unmount(),n.isMounted=!1)}this.current=null}addChild(t){this.children.add(t),this.enteringChildren??(this.enteringChildren=new Set),this.enteringChildren.add(t)}removeChild(t){this.children.delete(t),this.enteringChildren&&this.enteringChildren.delete(t)}bindToMotionValue(t,n){if(this.valueSubscriptions.has(t)&&this.valueSubscriptions.get(t)(),n.accelerate&&xa.has(t)&&this.current instanceof HTMLElement){const{factory:o,keyframes:a,times:c,ease:l,duration:h}=n.accelerate,f=new ba({element:this.current,name:t,keyframes:a,times:c,ease:l,duration:Le(h)}),d=o(f);this.valueSubscriptions.set(t,()=>{d(),f.cancel()});return}const i=St.has(t);i&&this.onBindTransform&&this.onBindTransform();const s=n.on("change",o=>{this.latestValues[t]=o,this.props.onUpdate&&ee.preRender(this.notifyUpdate),i&&this.projection&&(this.projection.isTransformDirty=!0),this.scheduleRender()});let r;typeof window<"u"&&window.MotionCheckAppearSync&&(r=window.MotionCheckAppearSync(this,t,n)),this.valueSubscriptions.set(t,()=>{s(),r&&r()})}sortNodePosition(t){return!this.current||!this.sortInstanceNodePosition||this.type!==t.type?0:this.sortInstanceNodePosition(this.current,t.current)}updateFeatures(){let t="animation";for(t in On){const n=On[t];if(!n)continue;const{isEnabled:i,Feature:s}=n;if(!this.features[t]&&s&&i(this.props)&&(this.features[t]=new s(this)),this.features[t]){const r=this.features[t];r.isMounted?r.update():(r.mount(),r.isMounted=!0)}}}triggerBuild(){this.build(this.renderState,this.latestValues,this.props)}measureViewportBox(){return this.current?this.measureInstanceViewportBox(this.current,this.props):ue()}getStaticValue(t){return this.latestValues[t]}setStaticValue(t,n){this.latestValues[t]=n}update(t,n){(t.transformTemplate||this.props.transformTemplate)&&this.scheduleRender(),this.prevProps=this.props,this.props=t,this.prevPresenceContext=this.presenceContext,this.presenceContext=n;for(let i=0;i<go.length;i++){const s=go[i];this.propEventSubscriptions[s]&&(this.propEventSubscriptions[s](),delete this.propEventSubscriptions[s]);const r="on"+s,o=t[r];o&&(this.propEventSubscriptions[s]=this.on(s,o))}this.prevMotionValues=td(this,this.scrapeMotionValuesFromProps(t,this.prevProps||{},this),this.prevMotionValues),this.handleChildMotionValue&&this.handleChildMotionValue()}getProps(){return this.props}getVariant(t){return this.props.variants?this.props.variants[t]:void 0}getDefaultTransition(){return this.props.transition}getTransformPagePoint(){return this.props.transformPagePoint}getClosestVariantNode(){return this.isVariantNode?this:this.parent?this.parent.getClosestVariantNode():void 0}addVariantChild(t){const n=this.getClosestVariantNode();if(n)return n.variantChildren&&n.variantChildren.add(t),()=>n.variantChildren.delete(t)}addValue(t,n){const i=this.values.get(t);n!==i&&(i&&this.removeValue(t),this.bindToMotionValue(t,n),this.values.set(t,n),this.latestValues[t]=n.get())}removeValue(t){this.values.delete(t);const n=this.valueSubscriptions.get(t);n&&(n(),this.valueSubscriptions.delete(t)),delete this.latestValues[t],this.removeValueFromRenderState(t,this.renderState)}hasValue(t){return this.values.has(t)}getValue(t,n){if(this.props.values&&this.props.values[t])return this.props.values[t];let i=this.values.get(t);return i===void 0&&n!==void 0&&(i=xt(n===null?void 0:n,{owner:this}),this.addValue(t,i)),i}readValue(t,n){let i=this.latestValues[t]!==void 0||!this.current?this.latestValues[t]:this.getBaseTargetFromProps(this.props,t)??this.readValueFromInstance(this.current,t,this.options);return i!=null&&(typeof i=="string"&&($r(i)||_r(i))?i=parseFloat(i):!Ju(i)&&Be.test(n)&&(i=Oa(t,n)),this.setBaseTarget(t,me(i)?i.get():i)),me(i)?i.get():i}setBaseTarget(t,n){this.baseTarget[t]=n}getBaseTarget(t){const{initial:n}=this.props;let i;if(typeof n=="string"||typeof n=="object"){const r=xs(this.props,n,this.presenceContext?.custom);r&&(i=r[t])}if(n&&i!==void 0)return i;const s=this.getBaseTargetFromProps(this.props,t);return s!==void 0&&!me(s)?s:this.initialValues[t]!==void 0&&i===void 0?void 0:this.baseTarget[t]}on(t,n){return this.events[t]||(this.events[t]=new as),this.events[t].add(n)}notify(t,...n){this.events[t]&&this.events[t].notify(...n)}scheduleRenderMicrotask(){Ss.render(this.render)}}class Fa extends od{constructor(){super(...arguments),this.KeyframeResolver=ju}sortInstanceNodePosition(t,n){return t.compareDocumentPosition(n)&2?1:-1}getBaseTargetFromProps(t,n){const i=t.style;return i?i[n]:void 0}removeValueFromRenderState(t,{vars:n,style:i}){delete n[t],delete i[t]}handleChildMotionValue(){this.childSubscription&&(this.childSubscription(),delete this.childSubscription);const{children:t}=this.props;me(t)&&(this.childSubscription=t.on("change",n=>{this.current&&(this.current.textContent=`${n}`)}))}}class Ze{constructor(t){this.isMounted=!1,this.node=t}update(){}}function _a({top:e,left:t,right:n,bottom:i}){return{x:{min:t,max:n},y:{min:e,max:i}}}function rd({x:e,y:t}){return{top:t.min,right:e.max,bottom:t.max,left:e.min}}function ad(e,t){if(!t)return e;const n=t({x:e.left,y:e.top}),i=t({x:e.right,y:e.bottom});return{top:n.y,left:n.x,bottom:i.y,right:i.x}}function Jn(e){return e===void 0||e===1}function Gi({scale:e,scaleX:t,scaleY:n}){return!Jn(e)||!Jn(t)||!Jn(n)}function it(e){return Gi(e)||Ha(e)||e.z||e.rotate||e.rotateX||e.rotateY||e.skewX||e.skewY}function Ha(e){return yo(e.x)||yo(e.y)}function yo(e){return e&&e!=="0%"}function Rn(e,t,n){const i=e-n,s=t*i;return n+s}function bo(e,t,n,i,s){return s!==void 0&&(e=Rn(e,s,i)),Rn(e,n,i)+t}function Ui(e,t=0,n=1,i,s){e.min=bo(e.min,t,n,i,s),e.max=bo(e.max,t,n,i,s)}function za(e,{x:t,y:n}){Ui(e.x,t.translate,t.scale,t.originPoint),Ui(e.y,n.translate,n.scale,n.originPoint)}const wo=.999999999999,xo=1.0000000000001;function ld(e,t,n,i=!1){const s=n.length;if(!s)return;t.x=t.y=1;let r,o;for(let a=0;a<s;a++){r=n[a],o=r.projectionDelta;const{visualElement:c}=r.options;c&&c.props.style&&c.props.style.display==="contents"||(i&&r.options.layoutScroll&&r.scroll&&r!==r.root&&(_e(e.x,-r.scroll.offset.x),_e(e.y,-r.scroll.offset.y)),o&&(t.x*=o.x.scale,t.y*=o.y.scale,za(e,o)),i&&it(r.latestValues)&&wn(e,r.latestValues,r.layout?.layoutBox))}t.x<xo&&t.x>wo&&(t.x=1),t.y<xo&&t.y>wo&&(t.y=1)}function _e(e,t){e.min+=t,e.max+=t}function vo(e,t,n,i,s=.5){const r=J(e.min,e.max,s);Ui(e,t,n,r,i)}function ko(e,t){return typeof e=="string"?parseFloat(e)/100*(t.max-t.min):e}function wn(e,t,n){const i=n??e;vo(e.x,ko(t.x,i.x),t.scaleX,t.scale,t.originX),vo(e.y,ko(t.y,i.y),t.scaleY,t.scale,t.originY)}function Wa(e,t){return _a(ad(e.getBoundingClientRect(),t))}function cd(e,t,n){const i=Wa(e,n),{scroll:s}=t;return s&&(_e(i.x,s.offset.x),_e(i.y,s.offset.y)),i}const hd={x:"translateX",y:"translateY",z:"translateZ",transformPerspective:"perspective"},ud=kt.length;function dd(e,t,n){let i="",s=!0;for(let o=0;o<ud;o++){const a=kt[o],c=e[a];if(c===void 0)continue;let l=!0;if(typeof c=="number")l=c===(a.startsWith("scale")?1:0);else{const h=parseFloat(c);l=a.startsWith("scale")?h===1:h===0}if(!l||n){const h=zi(c,Mn[a]);if(!l){s=!1;const f=hd[a]||a;i+=`${f}(${h}) `}n&&(t[a]=h)}}const r=e.pathRotation;return r&&(s=!1,i+=`rotate(${zi(r,Mn.pathRotation)}) `),i=i.trim(),n?i=n(t,s?"":i):s&&(i="none"),i}function Es(e,t,n){const{style:i,vars:s,transformOrigin:r}=e;let o=!1,a=!1;for(const c in t){const l=t[c];if(St.has(c)){o=!0;continue}else if(na(c)){s[c]=l;continue}else{const h=zi(l,Mn[c]);c.startsWith("origin")?(a=!0,r[c]=h):i[c]=h}}if(t.transform||(o||n?i.transform=dd(t,e.transform,n):i.transform&&(i.transform="none")),a){const{originX:c="50%",originY:l="50%",originZ:h=0}=r;i.transformOrigin=`${c} ${l} ${h}`}}function Ga(e,{style:t,vars:n},i,s){const r=e.style;let o;for(o in t)r[o]=t[o];s?.applyProjectionStyles(r,i);for(o in n)r.setProperty(o,n[o])}function So(e,t){return t.max===t.min?0:e/(t.max-t.min)*100}const Ct={correct:(e,t)=>{if(!t.target)return e;if(typeof e=="string")if(I.test(e))e=parseFloat(e);else return e;const n=So(e,t.target.x),i=So(e,t.target.y);return`${n}% ${i}%`}},fd={correct:(e,{treeScale:t,projectionDelta:n})=>{const i=e,s=Be.parse(e);if(s.length>5)return i;const r=Be.createTransformer(e),o=typeof s[0]!="number"?1:0,a=n.x.scale*t.x,c=n.y.scale*t.y;s[0+o]/=a,s[1+o]/=c;const l=J(a,c,.5);return typeof s[2+o]=="number"&&(s[2+o]/=l),typeof s[3+o]=="number"&&(s[3+o]/=l),r(s)}},Ki={borderRadius:{...Ct,applyTo:[...ks]},borderTopLeftRadius:Ct,borderTopRightRadius:Ct,borderBottomLeftRadius:Ct,borderBottomRightRadius:Ct,boxShadow:fd};function Ua(e,{layout:t,layoutId:n}){return St.has(e)||e.startsWith("origin")||(t||n!==void 0)&&(!!Ki[e]||e==="opacity")}function Ds(e,t,n){const i=e.style,s=t?.style,r={};if(!i)return r;for(const o in i)(me(i[o])||s&&me(s[o])||Ua(o,e)||n?.getValue(o)?.liveStyle!==void 0)&&(r[o]=i[o]);return r}function pd(e){return window.getComputedStyle(e)}class md extends Fa{constructor(){super(...arguments),this.type="html",this.renderInstance=Ga}mount(t){In(!!t.style),super.mount(t)}readValueFromInstance(t,n){if(St.has(n))return this.projection?.isProjecting?Ri(n):Lh(t,n);{const i=pd(t),s=(na(n)?i.getPropertyValue(n):i[n])||0;return typeof s=="string"?s.trim():s}}measureInstanceViewportBox(t,{transformPagePoint:n}){return Wa(t,n)}build(t,n,i){Es(t,n,i.transformTemplate)}scrapeMotionValuesFromProps(t,n,i){return Ds(t,n,i)}}const gd={offset:"stroke-dashoffset",array:"stroke-dasharray"},yd={offset:"strokeDashoffset",array:"strokeDasharray"};function bd(e,t,n=1,i=0,s=!0){e.pathLength=1;const r=s?gd:yd;e[r.offset]=`${-i}`,e[r.array]=`${t} ${n}`}const Ka=["transform","opacity","offsetDistance","offsetPath","offsetRotate","offsetAnchor"];function qa(e,{attrX:t,attrY:n,attrScale:i,pathLength:s,pathSpacing:r=1,pathOffset:o=0,...a},c,l,h){if(Es(e,a,l),c){e.style.viewBox&&(e.attrs.viewBox=e.style.viewBox);return}e.attrs=e.style,e.style={};const{attrs:f,style:d}=e;for(const m of Ka)f[m]!==void 0&&(d[m]=f[m],delete f[m]);(d.transform||f.transformOrigin)&&(d.transformOrigin=f.transformOrigin??"50% 50%",delete f.transformOrigin),d.transform&&(d.transformBox=h?.transformBox??"fill-box",delete f.transformBox),t!==void 0&&(f.x=t),n!==void 0&&(f.y=n),i!==void 0&&(f.scale=i),s!==void 0&&bd(f,s,r,o,!1)}const Qa=new Set(["baseFrequency","diffuseConstant","kernelMatrix","kernelUnitLength","keySplines","keyTimes","limitingConeAngle","markerHeight","markerWidth","numOctaves","targetX","targetY","surfaceScale","specularConstant","specularExponent","stdDeviation","tableValues","viewBox","gradientTransform","pathLength","startOffset","textLength","lengthAdjust"]),Ya=e=>typeof e=="string"&&e.toLowerCase()==="svg";function wd(e,t,n,i){Ga(e,t,void 0,i);for(const s in t.attrs)e.setAttribute(Qa.has(s)?s:vs(s),t.attrs[s])}function Xa(e,t,n){const i=Ds(e,t,n);for(const s in e)if(me(e[s])||me(t[s])){const r=kt.indexOf(s)!==-1?"attr"+s.charAt(0).toUpperCase()+s.substring(1):s;i[r]=e[s]}return i}class xd extends Fa{constructor(){super(...arguments),this.type="svg",this.isSVGTag=!1,this.measureInstanceViewportBox=ue}getBaseTargetFromProps(t,n){return t[n]}readValueFromInstance(t,n){if(St.has(n)){const i=Ma(n);return i&&i.default||0}if(Ka.includes(n)){const s=getComputedStyle(t)[n];if(typeof s=="string"&&s)return s.trim()}return n=Qa.has(n)?n:vs(n),t.getAttribute(n)}scrapeMotionValuesFromProps(t,n,i){return Xa(t,n,i)}build(t,n,i){qa(t,n,this.isSVGTag,i.transformTemplate,i.style)}renderInstance(t,n,i,s){wd(t,n,i,s)}mount(t){this.isSVGTag=Ya(t.tagName),super.mount(t)}}const vd=Ps.length;function Za(e){if(!e)return;if(!e.isControllingVariants){const n=e.parent?Za(e.parent)||{}:{};return e.props.initial!==void 0&&(n.initial=e.props.initial),n}const t={};for(let n=0;n<vd;n++){const i=Ps[n],s=e.props[i];(Ft(s)||s===!1)&&(t[i]=s)}return t}function Ja(e,t){if(!Array.isArray(t))return!1;const n=t.length;if(n!==e.length)return!1;for(let i=0;i<n;i++)if(t[i]!==e[i])return!1;return!0}const kd=[...As].reverse(),Sd=As.length;function Td(e){return t=>Promise.all(t.map(({animation:n,options:i})=>ku(e,n,i)))}function Cd(e){let t=Td(e),n=To(),i=!0,s=!1;const r=l=>(h,f)=>{const d=at(e,f,l==="exit"?e.presenceContext?.custom:void 0);if(d){const{transition:m,transitionEnd:g,...b}=d;h={...h,...b,...g}}return h};function o(l){t=l(e)}function a(l){const{props:h}=e,f=Za(e.parent)||{},d=[],m=new Set;let g={},b=1/0;for(let x=0;x<Sd;x++){const S=kd[x],v=n[S],w=h[S]!==void 0?h[S]:f[S],k=Ft(w),E=S===l?v.isActive:null;E===!1&&(b=x);let T=w===f[S]&&w!==h[S]&&k;if(T&&(i||s)&&e.manuallyAnimateOnMount&&(T=!1),v.protectedKeys={...g},!v.isActive&&E===null||!w&&!v.prevProp||$n(w)||typeof w=="boolean")continue;if(S==="exit"&&v.isActive&&E!==!0){v.prevResolvedValues&&(g={...g,...v.prevResolvedValues});continue}const D=Ad(v.prevProp,w);let P=D||S===l&&v.isActive&&!T&&k||x>b&&k,N=!1;const F=Array.isArray(w)?w:[w];let B=F.reduce(r(S),{});E===!1&&(B={});const{prevResolvedValues:O={}}=v,$={...O,...B},C=L=>{P=!0,m.has(L)&&(N=!0,m.delete(L)),v.needsAnimating[L]=!0;const W=e.getValue(L);W&&(W.liveStyle=!1)};for(const L in $){const W=B[L],j=O[L];if(g.hasOwnProperty(L))continue;let Y=!1;Bi(W)&&Bi(j)?Y=!Ja(W,j)||D:Y=W!==j,Y?W!=null?C(L):m.add(L):W!==void 0&&m.has(L)?C(L):v.protectedKeys[L]=!0}v.prevProp=w,v.prevResolvedValues=B,v.isActive&&(g={...g,...B}),(i||s)&&e.blockInitialAnimation&&(P=!1);const U=T&&D;P&&(!U||N)&&d.push(...F.map(L=>{const W={type:S};if(typeof L=="string"&&(i||s)&&!U&&e.manuallyAnimateOnMount&&e.parent){const{parent:j}=e,Y=at(j,L);if(j.enteringChildren&&Y){const{delayChildren:ve}=Y.transition||{};W.delay=va(j.enteringChildren,e,ve)}}return{animation:L,options:W}}))}if(m.size){const x={};if(typeof h.initial!="boolean"){const S=at(e,Array.isArray(h.initial)?h.initial[0]:h.initial);S&&S.transition&&(x.transition=S.transition)}m.forEach(S=>{const v=e.getBaseTarget(S),w=e.getValue(S);w&&(w.liveStyle=!0),x[S]=v??null}),d.push({animation:x})}let p=!!d.length;return i&&(h.initial===!1||h.initial===h.animate)&&!e.manuallyAnimateOnMount&&(p=!1),i=!1,s=!1,p?t(d):Promise.resolve()}function c(l,h){if(n[l].isActive===h)return Promise.resolve();e.variantChildren?.forEach(d=>d.animationState?.setActive(l,h)),n[l].isActive=h;const f=a(l);for(const d in n)n[d].protectedKeys={};return f}return{animateChanges:a,setActive:c,setAnimateFunction:o,getState:()=>n,reset:()=>{n=To(),s=!0}}}function Ad(e,t){return typeof t=="string"?t!==e:Array.isArray(t)?!Ja(t,e):!1}function nt(e=!1){return{isActive:e,protectedKeys:{},needsAnimating:{},prevResolvedValues:{}}}function To(){return{animate:nt(!0),whileInView:nt(),whileHover:nt(),whileTap:nt(),whileDrag:nt(),whileFocus:nt(),exit:nt()}}function qi(e,t){e.min=t.min,e.max=t.max}function Ve(e,t){qi(e.x,t.x),qi(e.y,t.y)}function Co(e,t){e.translate=t.translate,e.scale=t.scale,e.originPoint=t.originPoint,e.origin=t.origin}const el=1e-4,Pd=1-el,Ed=1+el,tl=.01,Dd=0-tl,Md=0+tl;function be(e){return e.max-e.min}function Od(e,t,n){return Math.abs(e-t)<=n}function Ao(e,t,n,i=.5){e.origin=i,e.originPoint=J(t.min,t.max,e.origin),e.scale=be(n)/be(t),e.translate=J(n.min,n.max,e.origin)-e.originPoint,(e.scale>=Pd&&e.scale<=Ed||isNaN(e.scale))&&(e.scale=1),(e.translate>=Dd&&e.translate<=Md||isNaN(e.translate))&&(e.translate=0)}function jt(e,t,n,i){Ao(e.x,t.x,n.x,i?i.originX:void 0),Ao(e.y,t.y,n.y,i?i.originY:void 0)}function Po(e,t,n,i=0){const s=i?J(n.min,n.max,i):n.min;e.min=s+t.min,e.max=e.min+be(t)}function Rd(e,t,n,i){Po(e.x,t.x,n.x,i?.x),Po(e.y,t.y,n.y,i?.y)}function Eo(e,t,n,i=0){const s=i?J(n.min,n.max,i):n.min;e.min=t.min-s,e.max=e.min+be(t)}function jn(e,t,n,i){Eo(e.x,t.x,n.x,i?.x),Eo(e.y,t.y,n.y,i?.y)}function Do(e,t,n,i,s){return e-=t,e=Rn(e,1/n,i),s!==void 0&&(e=Rn(e,1/s,i)),e}function jd(e,t=0,n=1,i=.5,s,r=e,o=e){if(ze.test(t)&&(t=parseFloat(t),t=J(o.min,o.max,t/100)-o.min),typeof t!="number")return;let a=J(r.min,r.max,i);e===r&&(a-=t),e.min=Do(e.min,t,n,a,s),e.max=Do(e.max,t,n,a,s)}function Mo(e,t,[n,i,s],r,o){jd(e,t[n],t[i],t[s],t.scale,r,o)}const Ld=["x","scaleX","originX"],Nd=["y","scaleY","originY"];function Oo(e,t,n,i){Mo(e.x,t,Ld,n?n.x:void 0,i?i.x:void 0),Mo(e.y,t,Nd,n?n.y:void 0,i?i.y:void 0)}function Ro(e){return e.translate===0&&e.scale===1}function nl(e){return Ro(e.x)&&Ro(e.y)}function jo(e,t){return e.min===t.min&&e.max===t.max}function Vd(e,t){return jo(e.x,t.x)&&jo(e.y,t.y)}function Lo(e,t){return Math.round(e.min)===Math.round(t.min)&&Math.round(e.max)===Math.round(t.max)}function il(e,t){return Lo(e.x,t.x)&&Lo(e.y,t.y)}function No(e){return be(e.x)/be(e.y)}function Vo(e,t){return e.translate===t.translate&&e.scale===t.scale&&e.originPoint===t.originPoint}function Fe(e){return[e("x"),e("y")]}function Id(e,t,n){let i="";const s=e.x.translate/t.x,r=e.y.translate/t.y,o=n?.z||0;if((s||r||o)&&(i=`translate3d(${s}px, ${r}px, ${o}px) `),(t.x!==1||t.y!==1)&&(i+=`scale(${1/t.x}, ${1/t.y}) `),n){const{transformPerspective:l,rotate:h,pathRotation:f,rotateX:d,rotateY:m,skewX:g,skewY:b}=n;l&&(i=`perspective(${l}px) ${i}`),h&&(i+=`rotate(${h}deg) `),f&&(i+=`rotate(${f}deg) `),d&&(i+=`rotateX(${d}deg) `),m&&(i+=`rotateY(${m}deg) `),g&&(i+=`skewX(${g}deg) `),b&&(i+=`skewY(${b}deg) `)}const a=e.x.scale*t.x,c=e.y.scale*t.y;return(a!==1||c!==1)&&(i+=`scale(${a}, ${c})`),i||"none"}const Bd=ks.length,Io=e=>typeof e=="string"?parseFloat(e):e,Bo=e=>typeof e=="number"||I.test(e);function $d(e,t,n,i,s,r){s?(e.opacity=J(0,n.opacity??1,Fd(i)),e.opacityExit=J(t.opacity??1,0,_d(i))):r&&(e.opacity=J(t.opacity??1,n.opacity??1,i));for(let o=0;o<Bd;o++){const a=ks[o];let c=$o(t,a),l=$o(n,a);if(c===void 0&&l===void 0)continue;c||(c=0),l||(l=0),c===0||l===0||Bo(c)===Bo(l)?(e[a]=Math.max(J(Io(c),Io(l),i),0),(ze.test(l)||ze.test(c))&&(e[a]+="%")):e[a]=l}(t.rotate||n.rotate)&&(e.rotate=J(t.rotate||0,n.rotate||0,i))}function $o(e,t){return e[t]!==void 0?e[t]:e.borderRadius}const Fd=sl(0,.5,Yr),_d=sl(.5,.95,je);function sl(e,t,n){return i=>i<e?0:i>t?1:n(Bt(e,t,i))}function Hd(e,t,n){const i=me(e)?e:xt(e);return i.start(ws("",i,t,n)),i.animation}function _t(e,t,n,i={passive:!0}){return e.addEventListener(t,n,i),()=>e.removeEventListener(t,n,i)}const zd=(e,t)=>e.depth-t.depth;class Wd{constructor(){this.children=[],this.isDirty=!1}add(t){rs(this.children,t),this.isDirty=!0}remove(t){An(this.children,t),this.isDirty=!0}forEach(t){this.isDirty&&this.children.sort(zd),this.isDirty=!1,this.children.forEach(t)}}function Gd(e,t){const n=ye.now(),i=({timestamp:s})=>{const r=s-n;r>=t&&(Xe(i),e(r-t))};return ee.setup(i,!0),()=>Xe(i)}function xn(e){return me(e)?e.get():e}class Ud{constructor(){this.members=[]}add(t){rs(this.members,t);for(let n=this.members.length-1;n>=0;n--){const i=this.members[n];if(i===t||i===this.lead||i===this.prevLead)continue;const s=i.instance;(!s||s.isConnected===!1)&&!i.snapshot&&(An(this.members,i),i.unmount())}t.scheduleRender()}remove(t){if(An(this.members,t),t===this.prevLead&&(this.prevLead=void 0),t===this.lead){const n=this.members[this.members.length-1];n&&this.promote(n)}}relegate(t){for(let n=this.members.indexOf(t)-1;n>=0;n--){const i=this.members[n];if(i.isPresent!==!1&&i.instance?.isConnected!==!1)return this.promote(i),!0}return!1}promote(t,n){const i=this.lead;if(t!==i&&(this.prevLead=i,this.lead=t,t.show(),i)){i.updateSnapshot(),t.scheduleRender();const{layoutDependency:s}=i.options,{layoutDependency:r}=t.options;(s===void 0||s!==r)&&(t.resumeFrom=i,n&&(i.preserveOpacity=!0),i.snapshot&&(t.snapshot=i.snapshot,t.snapshot.latestValues=i.animationValues||i.latestValues),t.root?.isUpdating&&(t.isLayoutDirty=!0)),t.options.crossfade===!1&&i.hide()}}exitAnimationComplete(){this.members.forEach(t=>{t.options.onExitComplete?.(),t.resumingFrom?.options.onExitComplete?.()})}scheduleRender(){this.members.forEach(t=>t.instance&&t.scheduleRender(!1))}removeLeadSnapshot(){this.lead?.snapshot&&(this.lead.snapshot=void 0)}}const vn={hasAnimatedSinceResize:!0,hasEverUpdated:!1},ei=["","X","Y","Z"],Kd=1e3;let qd=0;function ti(e,t,n,i){const{latestValues:s}=t;s[e]&&(n[e]=s[e],t.setStaticValue(e,0),i&&(i[e]=0))}function ol(e){if(e.hasCheckedOptimisedAppear=!0,e.root===e)return;const{visualElement:t}=e.options;if(!t)return;const n=Aa(t);if(window.MotionHasOptimisedAnimation(n,"transform")){const{layout:s,layoutId:r}=e.options;window.MotionCancelOptimisedAnimation(n,"transform",ee,!(s||r))}const{parent:i}=e;i&&!i.hasCheckedOptimisedAppear&&ol(i)}function rl({attachResizeListener:e,defaultParent:t,measureScroll:n,checkIsScrollRoot:i,resetTransform:s}){return class{constructor(o={},a=t?.()){this.id=qd++,this.animationId=0,this.animationCommitId=0,this.children=new Set,this.options={},this.isTreeAnimating=!1,this.isAnimationBlocked=!1,this.isLayoutDirty=!1,this.isProjectionDirty=!1,this.isSharedProjectionDirty=!1,this.isTransformDirty=!1,this.updateManuallyBlocked=!1,this.updateBlockedByResize=!1,this.isUpdating=!1,this.isSVG=!1,this.needsReset=!1,this.shouldResetTransform=!1,this.hasCheckedOptimisedAppear=!1,this.treeScale={x:1,y:1},this.eventHandlers=new Map,this.hasTreeAnimated=!1,this.layoutVersion=0,this.updateScheduled=!1,this.scheduleUpdate=()=>this.update(),this.projectionUpdateScheduled=!1,this.checkUpdateFailed=()=>{this.isUpdating&&(this.isUpdating=!1,this.clearAllSnapshots())},this.updateProjection=()=>{this.projectionUpdateScheduled=!1,this.nodes.forEach(Xd),this.nodes.forEach(sf),this.nodes.forEach(of),this.nodes.forEach(Zd)},this.resolvedRelativeTargetAt=0,this.linkedParentVersion=0,this.hasProjected=!1,this.isVisible=!0,this.animationProgress=0,this.sharedNodes=new Map,this.latestValues=o,this.root=a?a.root||a:this,this.path=a?[...a.path,a]:[],this.parent=a,this.depth=a?a.depth+1:0;for(let c=0;c<this.path.length;c++)this.path[c].shouldResetTransform=!0;this.root===this&&(this.nodes=new Wd)}addEventListener(o,a){return this.eventHandlers.has(o)||this.eventHandlers.set(o,new as),this.eventHandlers.get(o).add(a)}notifyListeners(o,...a){const c=this.eventHandlers.get(o);c&&c.notify(...a)}hasListeners(o){return this.eventHandlers.has(o)}mount(o){if(this.instance)return;this.isSVG=Cs(o)&&!Xu(o),this.instance=o;const{layoutId:a,layout:c,visualElement:l}=this.options;if(l&&!l.current&&l.mount(o),this.root.nodes.add(this),this.parent&&this.parent.children.add(this),this.root.hasTreeAnimated&&(c||a)&&(this.isLayoutDirty=!0),e){let h,f=0;const d=()=>this.root.updateBlockedByResize=!1;ee.read(()=>{f=window.innerWidth}),e(o,()=>{const m=window.innerWidth;m!==f&&(f=m,this.root.updateBlockedByResize=!0,h&&h(),h=Gd(d,250),vn.hasAnimatedSinceResize&&(vn.hasAnimatedSinceResize=!1,this.nodes.forEach(Ho)))})}a&&this.root.registerSharedNode(a,this),this.options.animate!==!1&&l&&(a||c)&&this.addEventListener("didUpdate",({delta:h,hasLayoutChanged:f,hasRelativeLayoutChanged:d,layout:m})=>{if(this.isTreeAnimationBlocked()){this.target=void 0,this.relativeTarget=void 0;return}const g=this.options.transition||l.getDefaultTransition()||hf,{onLayoutAnimationStart:b,onLayoutAnimationComplete:p}=l.getProps(),x=!this.targetLayout||!il(this.targetLayout,m),S=!f&&d;if(this.options.layoutRoot||this.resumeFrom||S||f&&(x||!this.currentAnimation)){this.resumeFrom&&(this.resumingFrom=this.resumeFrom,this.resumingFrom.resumingFrom=void 0);const v={...bs(g,"layout"),onPlay:b,onComplete:p};(l.shouldReduceMotion||this.options.layoutRoot)&&(v.delay=0,v.type=!1),this.startAnimation(v),this.setAnimationOrigin(h,S,v.path)}else f||Ho(this),this.isLead()&&this.options.onExitComplete&&this.options.onExitComplete();this.targetLayout=m})}unmount(){this.options.layoutId&&this.willUpdate(),this.root.nodes.remove(this);const o=this.getStack();o&&o.remove(this),this.parent&&this.parent.children.delete(this),this.instance=void 0,this.eventHandlers.clear(),Xe(this.updateProjection)}blockUpdate(){this.updateManuallyBlocked=!0}unblockUpdate(){this.updateManuallyBlocked=!1}isUpdateBlocked(){return this.updateManuallyBlocked||this.updateBlockedByResize}isTreeAnimationBlocked(){return this.isAnimationBlocked||this.parent&&this.parent.isTreeAnimationBlocked()||!1}startUpdate(){this.isUpdateBlocked()||(this.isUpdating=!0,this.nodes&&this.nodes.forEach(rf),this.animationId++)}getTransformTemplate(){const{visualElement:o}=this.options;return o&&o.getProps().transformTemplate}willUpdate(o=!0){if(this.root.hasTreeAnimated=!0,this.root.isUpdateBlocked()){this.options.onExitComplete&&this.options.onExitComplete();return}if(window.MotionCancelOptimisedAnimation&&!this.hasCheckedOptimisedAppear&&ol(this),!this.root.isUpdating&&this.root.startUpdate(),this.isLayoutDirty)return;this.isLayoutDirty=!0;for(let h=0;h<this.path.length;h++){const f=this.path[h];f.shouldResetTransform=!0,(typeof f.latestValues.x=="string"||typeof f.latestValues.y=="string")&&(f.isLayoutDirty=!0),f.updateScroll("snapshot"),f.options.layoutRoot&&f.willUpdate(!1)}const{layoutId:a,layout:c}=this.options;if(a===void 0&&!c)return;const l=this.getTransformTemplate();this.prevTransformTemplateValue=l?l(this.latestValues,""):void 0,this.updateSnapshot(),o&&this.notifyListeners("willUpdate")}update(){if(this.updateScheduled=!1,this.isUpdateBlocked()){const c=this.updateBlockedByResize;this.unblockUpdate(),this.updateBlockedByResize=!1,this.clearAllSnapshots(),c&&this.nodes.forEach(ef),this.nodes.forEach(Fo);return}if(this.animationId<=this.animationCommitId){this.nodes.forEach(_o);return}this.animationCommitId=this.animationId,this.isUpdating?(this.isUpdating=!1,this.nodes.forEach(tf),this.nodes.forEach(nf),this.nodes.forEach(Qd),this.nodes.forEach(Yd)):this.nodes.forEach(_o),this.clearAllSnapshots();const a=ye.now();pe.delta=We(0,1e3/60,a-pe.timestamp),pe.timestamp=a,pe.isProcessing=!0,Un.update.process(pe),Un.preRender.process(pe),Un.render.process(pe),pe.isProcessing=!1}didUpdate(){this.updateScheduled||(this.updateScheduled=!0,Ss.read(this.scheduleUpdate))}clearAllSnapshots(){this.nodes.forEach(Jd),this.sharedNodes.forEach(af)}scheduleUpdateProjection(){this.projectionUpdateScheduled||(this.projectionUpdateScheduled=!0,ee.preRender(this.updateProjection,!1,!0))}scheduleCheckAfterUnmount(){ee.postRender(()=>{this.isLayoutDirty?this.root.didUpdate():this.root.checkUpdateFailed()})}updateSnapshot(){this.snapshot||!this.instance||(this.snapshot=this.measure(),this.snapshot&&!be(this.snapshot.measuredBox.x)&&!be(this.snapshot.measuredBox.y)&&(this.snapshot=void 0))}updateLayout(){if(!this.instance||(this.updateScroll(),!(this.options.alwaysMeasureLayout&&this.isLead())&&!this.isLayoutDirty))return;if(this.resumeFrom&&!this.resumeFrom.instance)for(let c=0;c<this.path.length;c++)this.path[c].updateScroll();const o=this.layout;this.layout=this.measure(!1),this.layoutVersion++,this.layoutCorrected||(this.layoutCorrected=ue()),this.isLayoutDirty=!1,this.projectionDelta=void 0,this.notifyListeners("measure",this.layout.layoutBox);const{visualElement:a}=this.options;a&&a.notify("LayoutMeasure",this.layout.layoutBox,o?o.layoutBox:void 0)}updateScroll(o="measure"){let a=!!(this.options.layoutScroll&&this.instance);if(this.scroll&&this.scroll.animationId===this.root.animationId&&this.scroll.phase===o&&(a=!1),a&&this.instance){const c=i(this.instance);this.scroll={animationId:this.root.animationId,phase:o,isRoot:c,offset:n(this.instance),wasRoot:this.scroll?this.scroll.isRoot:c}}}resetTransform(){if(!s)return;const o=this.isLayoutDirty||this.shouldResetTransform||this.options.alwaysMeasureLayout,a=this.projectionDelta&&!nl(this.projectionDelta),c=this.getTransformTemplate(),l=c?c(this.latestValues,""):void 0,h=l!==this.prevTransformTemplateValue;o&&this.instance&&(a||it(this.latestValues)||h)&&(s(this.instance,l),this.shouldResetTransform=!1,this.scheduleRender())}measure(o=!0){const a=this.measurePageBox();let c=this.removeElementScroll(a);return o&&(c=this.removeTransform(c)),uf(c),{animationId:this.root.animationId,measuredBox:a,layoutBox:c,latestValues:{},source:this.id}}measurePageBox(){const{visualElement:o}=this.options;if(!o)return ue();const a=o.measureViewportBox();if(!(this.scroll?.wasRoot||this.path.some(df))){const{scroll:l}=this.root;l&&(_e(a.x,l.offset.x),_e(a.y,l.offset.y))}return a}removeElementScroll(o){const a=ue();if(Ve(a,o),this.scroll?.wasRoot)return a;for(let c=0;c<this.path.length;c++){const l=this.path[c],{scroll:h,options:f}=l;l!==this.root&&h&&f.layoutScroll&&(h.wasRoot&&Ve(a,o),_e(a.x,h.offset.x),_e(a.y,h.offset.y))}return a}applyTransform(o,a=!1,c){const l=c||ue();Ve(l,o);for(let h=0;h<this.path.length;h++){const f=this.path[h];!a&&f.options.layoutScroll&&f.scroll&&f!==f.root&&(_e(l.x,-f.scroll.offset.x),_e(l.y,-f.scroll.offset.y)),it(f.latestValues)&&wn(l,f.latestValues,f.layout?.layoutBox)}return it(this.latestValues)&&wn(l,this.latestValues,this.layout?.layoutBox),l}removeTransform(o){const a=ue();Ve(a,o);for(let c=0;c<this.path.length;c++){const l=this.path[c];if(!it(l.latestValues))continue;let h;l.instance&&(Gi(l.latestValues)&&l.updateSnapshot(),h=ue(),Ve(h,l.measurePageBox())),Oo(a,l.latestValues,l.snapshot?.layoutBox,h)}return it(this.latestValues)&&Oo(a,this.latestValues),a}setTargetDelta(o){this.targetDelta=o,this.root.scheduleUpdateProjection(),this.isProjectionDirty=!0}setOptions(o){this.options={...this.options,...o,crossfade:o.crossfade!==void 0?o.crossfade:!0}}clearMeasurements(){this.scroll=void 0,this.layout=void 0,this.snapshot=void 0,this.prevTransformTemplateValue=void 0,this.targetDelta=void 0,this.target=void 0,this.isLayoutDirty=!1}forceRelativeParentToResolveTarget(){this.relativeParent&&this.relativeParent.resolvedRelativeTargetAt!==pe.timestamp&&this.relativeParent.resolveTargetDelta(!0)}resolveTargetDelta(o=!1){const a=this.getLead();this.isProjectionDirty||(this.isProjectionDirty=a.isProjectionDirty),this.isTransformDirty||(this.isTransformDirty=a.isTransformDirty),this.isSharedProjectionDirty||(this.isSharedProjectionDirty=a.isSharedProjectionDirty);const c=!!this.resumingFrom||this!==a;if(!(o||c&&this.isSharedProjectionDirty||this.isProjectionDirty||this.parent?.isProjectionDirty||this.attemptToResolveRelativeTarget||this.root.updateBlockedByResize))return;const{layout:h,layoutId:f}=this.options;if(!this.layout||!(h||f))return;this.resolvedRelativeTargetAt=pe.timestamp;const d=this.getClosestProjectingParent();d&&this.linkedParentVersion!==d.layoutVersion&&!d.options.layoutRoot&&this.removeRelativeTarget(),!this.targetDelta&&!this.relativeTarget&&(this.options.layoutAnchor!==!1&&d&&d.layout?this.createRelativeTarget(d,this.layout.layoutBox,d.layout.layoutBox):this.removeRelativeTarget()),!(!this.relativeTarget&&!this.targetDelta)&&(this.target||(this.target=ue(),this.targetWithTransforms=ue()),this.relativeTarget&&this.relativeTargetOrigin&&this.relativeParent&&this.relativeParent.target?(this.forceRelativeParentToResolveTarget(),Rd(this.target,this.relativeTarget,this.relativeParent.target,this.options.layoutAnchor||void 0)):this.targetDelta?(this.resumingFrom?this.applyTransform(this.layout.layoutBox,!1,this.target):Ve(this.target,this.layout.layoutBox),za(this.target,this.targetDelta)):Ve(this.target,this.layout.layoutBox),this.attemptToResolveRelativeTarget&&(this.attemptToResolveRelativeTarget=!1,this.options.layoutAnchor!==!1&&d&&!!d.resumingFrom==!!this.resumingFrom&&!d.options.layoutScroll&&d.target&&this.animationProgress!==1?this.createRelativeTarget(d,this.target,d.target):this.relativeParent=this.relativeTarget=void 0))}getClosestProjectingParent(){if(!(!this.parent||Gi(this.parent.latestValues)||Ha(this.parent.latestValues)))return this.parent.isProjecting()?this.parent:this.parent.getClosestProjectingParent()}isProjecting(){return!!((this.relativeTarget||this.targetDelta||this.options.layoutRoot)&&this.layout)}createRelativeTarget(o,a,c){this.relativeParent=o,this.linkedParentVersion=o.layoutVersion,this.forceRelativeParentToResolveTarget(),this.relativeTarget=ue(),this.relativeTargetOrigin=ue(),jn(this.relativeTargetOrigin,a,c,this.options.layoutAnchor||void 0),Ve(this.relativeTarget,this.relativeTargetOrigin)}removeRelativeTarget(){this.relativeParent=this.relativeTarget=void 0}calcProjection(){const o=this.getLead(),a=!!this.resumingFrom||this!==o;let c=!0;if((this.isProjectionDirty||this.parent?.isProjectionDirty)&&(c=!1),a&&(this.isSharedProjectionDirty||this.isTransformDirty)&&(c=!1),this.resolvedRelativeTargetAt===pe.timestamp&&(c=!1),c)return;const{layout:l,layoutId:h}=this.options;if(this.isTreeAnimating=!!(this.parent&&this.parent.isTreeAnimating||this.currentAnimation||this.pendingAnimation),this.isTreeAnimating||(this.targetDelta=this.relativeTarget=void 0),!this.layout||!(l||h))return;Ve(this.layoutCorrected,this.layout.layoutBox);const f=this.treeScale.x,d=this.treeScale.y;ld(this.layoutCorrected,this.treeScale,this.path,a),o.layout&&!o.target&&(this.treeScale.x!==1||this.treeScale.y!==1)&&(o.target=o.layout.layoutBox,o.targetWithTransforms=ue());const{target:m}=o;if(!m){this.prevProjectionDelta&&(this.createProjectionDeltas(),this.scheduleRender());return}!this.projectionDelta||!this.prevProjectionDelta?this.createProjectionDeltas():(Co(this.prevProjectionDelta.x,this.projectionDelta.x),Co(this.prevProjectionDelta.y,this.projectionDelta.y)),jt(this.projectionDelta,this.layoutCorrected,m,this.latestValues),(this.treeScale.x!==f||this.treeScale.y!==d||!Vo(this.projectionDelta.x,this.prevProjectionDelta.x)||!Vo(this.projectionDelta.y,this.prevProjectionDelta.y))&&(this.hasProjected=!0,this.scheduleRender(),this.notifyListeners("projectionUpdate",m))}hide(){this.isVisible=!1}show(){this.isVisible=!0}scheduleRender(o=!0){if(this.options.visualElement?.scheduleRender(),o){const a=this.getStack();a&&a.scheduleRender()}this.resumingFrom&&!this.resumingFrom.instance&&(this.resumingFrom=void 0)}createProjectionDeltas(){this.prevProjectionDelta=bt(),this.projectionDelta=bt(),this.projectionDeltaWithTransform=bt()}setAnimationOrigin(o,a=!1,c){const l=this.snapshot,h=l?l.latestValues:{},f={...this.latestValues},d=bt();(!this.relativeParent||!this.relativeParent.options.layoutRoot)&&(this.relativeTarget=this.relativeTargetOrigin=void 0),this.attemptToResolveRelativeTarget=!a;const m=ue(),g=l?l.source:void 0,b=this.layout?this.layout.source:void 0,p=g!==b,x=this.getStack(),S=!x||x.members.length<=1,v=!!(p&&!S&&this.options.crossfade===!0&&!this.path.some(cf));this.animationProgress=0;let w;const k=c?.interpolateProjection(o);this.mixTargetDelta=E=>{const T=E/1e3,D=k?.(T);D?(d.x.translate=D.x,d.x.scale=J(o.x.scale,1,T),d.x.origin=o.x.origin,d.x.originPoint=o.x.originPoint,d.y.translate=D.y,d.y.scale=J(o.y.scale,1,T),d.y.origin=o.y.origin,d.y.originPoint=o.y.originPoint):(zo(d.x,o.x,T),zo(d.y,o.y,T)),this.setTargetDelta(d),this.relativeTarget&&this.relativeTargetOrigin&&this.layout&&this.relativeParent&&this.relativeParent.layout&&(jn(m,this.layout.layoutBox,this.relativeParent.layout.layoutBox,this.options.layoutAnchor||void 0),lf(this.relativeTarget,this.relativeTargetOrigin,m,T),w&&Vd(this.relativeTarget,w)&&(this.isProjectionDirty=!1),w||(w=ue()),Ve(w,this.relativeTarget)),p&&(this.animationValues=f,$d(f,h,this.latestValues,T,v,S)),D&&D.rotate!==void 0&&(this.animationValues||(this.animationValues=f),this.animationValues.pathRotation=D.rotate),this.root.scheduleUpdateProjection(),this.scheduleRender(),this.animationProgress=T},this.mixTargetDelta(this.options.layoutRoot?1e3:0)}startAnimation(o){this.notifyListeners("animationStart"),this.currentAnimation?.stop(),this.resumingFrom?.currentAnimation?.stop(),this.pendingAnimation&&(Xe(this.pendingAnimation),this.pendingAnimation=void 0),this.pendingAnimation=ee.update(()=>{vn.hasAnimatedSinceResize=!0,this.motionValue||(this.motionValue=xt(0)),this.motionValue.jump(0,!1),this.currentAnimation=Hd(this.motionValue,[0,1e3],{...o,velocity:0,isSync:!0,onUpdate:a=>{this.mixTargetDelta(a),o.onUpdate&&o.onUpdate(a)},onComplete:()=>{o.onComplete&&o.onComplete(),this.completeAnimation()}}),this.resumingFrom&&(this.resumingFrom.currentAnimation=this.currentAnimation),this.pendingAnimation=void 0})}completeAnimation(){this.resumingFrom&&(this.resumingFrom.currentAnimation=void 0,this.resumingFrom.preserveOpacity=void 0);const o=this.getStack();o&&o.exitAnimationComplete(),this.resumingFrom=this.currentAnimation=this.animationValues=void 0,this.notifyListeners("animationComplete")}finishAnimation(){this.currentAnimation&&(this.mixTargetDelta&&this.mixTargetDelta(Kd),this.currentAnimation.stop()),this.completeAnimation()}applyTransformsToTarget(){const o=this.getLead();let{targetWithTransforms:a,target:c,layout:l,latestValues:h}=o;if(!(!a||!c||!l)){if(this!==o&&this.layout&&l&&al(this.options.animationType,this.layout.layoutBox,l.layoutBox)){c=this.target||ue();const f=be(this.layout.layoutBox.x);c.x.min=o.target.x.min,c.x.max=c.x.min+f;const d=be(this.layout.layoutBox.y);c.y.min=o.target.y.min,c.y.max=c.y.min+d}Ve(a,c),wn(a,h),jt(this.projectionDeltaWithTransform,this.layoutCorrected,a,h)}}registerSharedNode(o,a){this.sharedNodes.has(o)||this.sharedNodes.set(o,new Ud),this.sharedNodes.get(o).add(a);const l=a.options.initialPromotionConfig;a.promote({transition:l?l.transition:void 0,preserveFollowOpacity:l&&l.shouldPreserveFollowOpacity?l.shouldPreserveFollowOpacity(a):void 0})}isLead(){const o=this.getStack();return o?o.lead===this:!0}getLead(){const{layoutId:o}=this.options;return o?this.getStack()?.lead||this:this}getPrevLead(){const{layoutId:o}=this.options;return o?this.getStack()?.prevLead:void 0}getStack(){const{layoutId:o}=this.options;if(o)return this.root.sharedNodes.get(o)}promote({needsReset:o,transition:a,preserveFollowOpacity:c}={}){const l=this.getStack();l&&l.promote(this,c),o&&(this.projectionDelta=void 0,this.needsReset=!0),a&&this.setOptions({transition:a})}relegate(){const o=this.getStack();return o?o.relegate(this):!1}resetSkewAndRotation(){const{visualElement:o}=this.options;if(!o)return;let a=!1;const{latestValues:c}=o;if((c.z||c.rotate||c.rotateX||c.rotateY||c.rotateZ||c.skewX||c.skewY)&&(a=!0),!a)return;const l={};c.z&&ti("z",o,l,this.animationValues);for(let h=0;h<ei.length;h++)ti(`rotate${ei[h]}`,o,l,this.animationValues),ti(`skew${ei[h]}`,o,l,this.animationValues);o.render();for(const h in l)o.setStaticValue(h,l[h]),this.animationValues&&(this.animationValues[h]=l[h]);o.scheduleRender()}applyProjectionStyles(o,a){if(!this.instance||this.isSVG)return;if(!this.isVisible){o.visibility="hidden";return}const c=this.getTransformTemplate();if(this.needsReset){this.needsReset=!1,o.visibility="",o.opacity="",o.pointerEvents=xn(a?.pointerEvents)||"",o.transform=c?c(this.latestValues,""):"none";return}const l=this.getLead();if(!this.projectionDelta||!this.layout||!l.target){this.options.layoutId&&(o.opacity=this.latestValues.opacity!==void 0?this.latestValues.opacity:1,o.pointerEvents=xn(a?.pointerEvents)||""),this.hasProjected&&!it(this.latestValues)&&(o.transform=c?c({},""):"none",this.hasProjected=!1);return}o.visibility="";const h=l.animationValues||l.latestValues;this.applyTransformsToTarget();let f=Id(this.projectionDeltaWithTransform,this.treeScale,h);c&&(f=c(h,f)),o.transform=f;const{x:d,y:m}=this.projectionDelta;o.transformOrigin=`${d.origin*100}% ${m.origin*100}% 0`,l.animationValues?o.opacity=l===this?h.opacity??this.latestValues.opacity??1:this.preserveOpacity?this.latestValues.opacity:h.opacityExit:o.opacity=l===this?h.opacity!==void 0?h.opacity:"":h.opacityExit!==void 0?h.opacityExit:0;for(const g in Ki){if(h[g]===void 0)continue;const{correct:b,applyTo:p,isCSSVariable:x}=Ki[g],S=f==="none"?h[g]:b(h[g],l);if(p){const v=p.length;for(let w=0;w<v;w++)o[p[w]]=S}else x?this.options.visualElement.renderState.vars[g]=S:o[g]=S}this.options.layoutId&&(o.pointerEvents=l===this?xn(a?.pointerEvents)||"":"none")}clearSnapshot(){this.resumeFrom=this.snapshot=void 0}resetTree(){this.root.nodes.forEach(o=>o.currentAnimation?.stop()),this.root.nodes.forEach(Fo),this.root.sharedNodes.clear()}}}function Qd(e){e.updateLayout()}function Yd(e){const t=e.resumeFrom?.snapshot||e.snapshot;if(e.isLead()&&e.layout&&t&&e.hasListeners("didUpdate")){const{layoutBox:n,measuredBox:i}=e.layout,{animationType:s}=e.options,r=t.source!==e.layout.source;if(s==="size")Fe(h=>{const f=r?t.measuredBox[h]:t.layoutBox[h],d=be(f);f.min=n[h].min,f.max=f.min+d});else if(s==="x"||s==="y"){const h=s==="x"?"y":"x";qi(r?t.measuredBox[h]:t.layoutBox[h],n[h])}else al(s,t.layoutBox,n)&&Fe(h=>{const f=r?t.measuredBox[h]:t.layoutBox[h],d=be(n[h]);f.max=f.min+d,e.relativeTarget&&!e.currentAnimation&&(e.isProjectionDirty=!0,e.relativeTarget[h].max=e.relativeTarget[h].min+d)});const o=bt();jt(o,n,t.layoutBox);const a=bt();r?jt(a,e.applyTransform(i,!0),t.measuredBox):jt(a,n,t.layoutBox);const c=!nl(o);let l=!1;if(!e.resumeFrom){const h=e.getClosestProjectingParent();if(h&&!h.resumeFrom){const{snapshot:f,layout:d}=h;if(f&&d){const m=e.options.layoutAnchor||void 0,g=ue();jn(g,t.layoutBox,f.layoutBox,m);const b=ue();jn(b,n,d.layoutBox,m),il(g,b)||(l=!0),h.options.layoutRoot&&(e.relativeTarget=b,e.relativeTargetOrigin=g,e.relativeParent=h)}}}e.notifyListeners("didUpdate",{layout:n,snapshot:t,delta:a,layoutDelta:o,hasLayoutChanged:c,hasRelativeLayoutChanged:l})}else if(e.isLead()){const{onExitComplete:n}=e.options;n&&n()}e.options.transition=void 0}function Xd(e){e.parent&&(e.isProjecting()||(e.isProjectionDirty=e.parent.isProjectionDirty),e.isSharedProjectionDirty||(e.isSharedProjectionDirty=!!(e.isProjectionDirty||e.parent.isProjectionDirty||e.parent.isSharedProjectionDirty)),e.isTransformDirty||(e.isTransformDirty=e.parent.isTransformDirty))}function Zd(e){e.isProjectionDirty=e.isSharedProjectionDirty=e.isTransformDirty=!1}function Jd(e){e.clearSnapshot()}function Fo(e){e.clearMeasurements()}function ef(e){e.isLayoutDirty=!0,e.updateLayout()}function _o(e){e.isLayoutDirty=!1}function tf(e){e.isAnimationBlocked&&e.layout&&!e.isLayoutDirty&&(e.snapshot=e.layout,e.isLayoutDirty=!0)}function nf(e){const{visualElement:t}=e.options;t&&t.getProps().onBeforeLayoutMeasure&&t.notify("BeforeLayoutMeasure"),e.resetTransform()}function Ho(e){e.finishAnimation(),e.targetDelta=e.relativeTarget=e.target=void 0,e.isProjectionDirty=!0}function sf(e){e.resolveTargetDelta()}function of(e){e.calcProjection()}function rf(e){e.resetSkewAndRotation()}function af(e){e.removeLeadSnapshot()}function zo(e,t,n){e.translate=J(t.translate,0,n),e.scale=J(t.scale,1,n),e.origin=t.origin,e.originPoint=t.originPoint}function Wo(e,t,n,i){e.min=J(t.min,n.min,i),e.max=J(t.max,n.max,i)}function lf(e,t,n,i){Wo(e.x,t.x,n.x,i),Wo(e.y,t.y,n.y,i)}function cf(e){return e.animationValues&&e.animationValues.opacityExit!==void 0}const hf={duration:.45,ease:[.4,0,.1,1]},Go=e=>typeof navigator<"u"&&navigator.userAgent&&navigator.userAgent.toLowerCase().includes(e),Uo=Go("applewebkit/")&&!Go("chrome/")?Math.round:je;function Ko(e){e.min=Uo(e.min),e.max=Uo(e.max)}function uf(e){Ko(e.x),Ko(e.y)}function al(e,t,n){return e==="position"||e==="preserve-aspect"&&!Od(No(t),No(n),.2)}function df(e){return e!==e.root&&e.scroll?.wasRoot}const ff=rl({attachResizeListener:(e,t)=>_t(e,"resize",t),measureScroll:()=>({x:document.documentElement.scrollLeft||document.body?.scrollLeft||0,y:document.documentElement.scrollTop||document.body?.scrollTop||0}),checkIsScrollRoot:()=>!0}),ni={current:void 0},ll=rl({measureScroll:e=>({x:e.scrollLeft,y:e.scrollTop}),defaultParent:()=>{if(!ni.current){const e=new ff({});e.mount(window),e.setOptions({layoutScroll:!0}),ni.current=e}return ni.current},resetTransform:(e,t)=>{e.style.transform=t!==void 0?t:"none"},checkIsScrollRoot:e=>window.getComputedStyle(e).position==="fixed"}),Ms=y.createContext({transformPagePoint:e=>e,isStatic:!1,reducedMotion:"never"});function qo(e,t){if(typeof e=="function")return e(t);e!=null&&(e.current=t)}function pf(...e){return t=>{let n=!1;const i=e.map(s=>{const r=qo(s,t);return!n&&typeof r=="function"&&(n=!0),r});if(n)return()=>{for(let s=0;s<i.length;s++){const r=i[s];typeof r=="function"?r():qo(e[s],null)}}}}function mf(...e){return y.useCallback(pf(...e),e)}class gf extends y.Component{getSnapshotBeforeUpdate(t){const n=this.props.childRef.current;if(pn(n)&&t.isPresent&&!this.props.isPresent&&this.props.pop!==!1){const i=n.offsetParent,s=pn(i)&&i.offsetWidth||0,r=pn(i)&&i.offsetHeight||0,o=getComputedStyle(n),a=this.props.sizeRef.current;a.height=parseFloat(o.height),a.width=parseFloat(o.width),a.top=n.offsetTop,a.left=n.offsetLeft,a.right=s-a.width-a.left,a.bottom=r-a.height-a.top,a.direction=o.direction}return null}componentDidUpdate(){}render(){return this.props.children}}function yf({children:e,isPresent:t,anchorX:n,anchorY:i,root:s,pop:r}){const o=y.useId(),a=y.useRef(null),c=y.useRef({width:0,height:0,top:0,left:0,right:0,bottom:0,direction:"ltr"}),{nonce:l}=y.useContext(Ms),h=r!==!1?e.props?.ref??e?.ref:void 0,f=mf(a,h);return y.useInsertionEffect(()=>{const{width:d,height:m,top:g,left:b,right:p,bottom:x,direction:S}=c.current;if(t||r===!1||!a.current||!d||!m)return;const v=S==="rtl",w=n==="left"?v?`right: ${p}`:`left: ${b}`:v?`left: ${b}`:`right: ${p}`,k=i==="bottom"?`bottom: ${x}`:`top: ${g}`;a.current.dataset.motionPopId=o;const E=document.createElement("style");l&&(E.nonce=l);const T=s??document.head;return T.appendChild(E),E.sheet&&E.sheet.insertRule(`
          [data-motion-pop-id="${o}"] {
            position: absolute !important;
            width: ${d}px !important;
            height: ${m}px !important;
            ${w}px !important;
            ${k}px !important;
          }
        `),()=>{a.current?.removeAttribute("data-motion-pop-id"),T.contains(E)&&T.removeChild(E)}},[t]),u.jsx(gf,{isPresent:t,childRef:a,sizeRef:c,pop:r,children:r===!1?e:y.cloneElement(e,{ref:f})})}const bf=({children:e,initial:t,isPresent:n,onExitComplete:i,custom:s,presenceAffectsLayout:r,mode:o,anchorX:a,anchorY:c,root:l})=>{const h=os(wf),f=y.useId(),d=y.useRef(n),m=y.useRef(i);Cn(()=>{d.current=n,m.current=i});let g=!0,b=y.useMemo(()=>(g=!1,{id:f,initial:t,isPresent:n,custom:s,onExitComplete:p=>{h.set(p,!0);for(const x of h.values())if(!x)return;i&&i()},register:p=>(h.set(p,!1),()=>{h.delete(p),!d.current&&!h.size&&m.current?.()})}),[n,h,i]);return r&&g&&(b={...b}),y.useMemo(()=>{h.forEach((p,x)=>h.set(x,!1))},[n]),y.useEffect(()=>{!n&&!h.size&&i&&i()},[n]),e=u.jsx(yf,{pop:o==="popLayout",isPresent:n,anchorX:a,anchorY:c,root:l,children:e}),u.jsx(Vn.Provider,{value:b,children:e})};function wf(){return new Map}function cl(e=!0){const t=y.useContext(Vn);if(t===null)return[!0,null];const{isPresent:n,onExitComplete:i,register:s}=t,r=y.useId();y.useEffect(()=>{if(e)return s(r)},[e]);const o=y.useCallback(()=>e&&i&&i(r),[r,i,e]);return!n&&i?[!1,o]:[!0]}const tn=e=>e.key||"";function Qo(e){const t=[];return y.Children.forEach(e,n=>{y.isValidElement(n)&&t.push(n)}),t}const xf=({children:e,custom:t,initial:n=!0,onExitComplete:i,presenceAffectsLayout:s=!0,mode:r="sync",propagate:o=!1,anchorX:a="left",anchorY:c="top",root:l})=>{const[h,f]=cl(o),d=y.useMemo(()=>Qo(e),[e]),m=o&&!h?[]:d.map(tn),g=y.useRef(!0),b=y.useRef(d),p=os(()=>new Map),x=y.useRef(new Set),[S,v]=y.useState(d),[w,k]=y.useState(d);Cn(()=>{o&&!h&&!w.length&&f?.()},[h,o,w.length,f]),Cn(()=>{g.current=!1,b.current=d;for(let D=0;D<w.length;D++){const P=tn(w[D]);m.includes(P)?(p.delete(P),x.current.delete(P)):p.get(P)!==!0&&p.set(P,!1)}},[w,m.length,m.join("-")]);const E=[];if(d!==S){let D=[...d],P=0;for(const N of w){const F=m.indexOf(tn(N));F===-1?(D.splice(P++,0,N),E.push(N)):P=F+E.length+1}return r==="wait"&&E.length&&(D=E),k(Qo(D)),v(d),null}const{forceRender:T}=y.useContext(ss);return u.jsx(u.Fragment,{children:w.map(D=>{const P=tn(D),N=o&&!h?!1:d===w||m.includes(P),F=()=>{if(x.current.has(P))return;if(p.has(P))x.current.add(P),p.set(P,!0);else return;let B=!0;p.forEach(O=>{O||(B=!1)}),B&&(T?.(),k(b.current),o&&f?.(),i&&i())};return u.jsx(bf,{isPresent:N,initial:!g.current||n?void 0:!1,custom:t,presenceAffectsLayout:s,mode:r,root:l,onExitComplete:N?void 0:F,anchorX:a,anchorY:c,children:D},P)})})},hl=y.createContext({strict:!1}),Yo={animation:["animate","variants","whileHover","whileTap","exit","whileInView","whileFocus","whileDrag"],exit:["exit"],drag:["drag","dragControls"],focus:["whileFocus"],hover:["whileHover","onHoverStart","onHoverEnd"],tap:["whileTap","onTap","onTapStart","onTapCancel"],pan:["onPan","onPanStart","onPanSessionStart","onPanEnd"],inView:["whileInView","onViewportEnter","onViewportLeave"],layout:["layout","layoutId"]};let Xo=!1;function vf(){if(Xo)return;const e={};for(const t in Yo)e[t]={isEnabled:n=>Yo[t].some(i=>!!n[i])};$a(e),Xo=!0}function ul(){return vf(),sd()}function kf(e){const t=ul();for(const n in e)t[n]={...t[n],...e[n]};$a(t)}const _n=y.createContext({});function Sf(e,t){if(Fn(e)){const{initial:n,animate:i}=e;return{initial:n===!1||Ft(n)?n:void 0,animate:Ft(i)?i:void 0}}return e.inherit!==!1?t:{}}function Tf(e){const{initial:t,animate:n}=Sf(e,y.useContext(_n));return y.useMemo(()=>({initial:t,animate:n}),[Zo(t),Zo(n)])}function Zo(e){return Array.isArray(e)?e.join(" "):e}const Os=()=>({style:{},transform:{},transformOrigin:{},vars:{}});function dl(e,t,n){for(const i in t)!me(t[i])&&!Ua(i,n)&&(e[i]=t[i])}function Cf({transformTemplate:e},t){return y.useMemo(()=>{const n=Os();return Es(n,t,e),Object.assign({},n.vars,n.style)},[t])}function Af(e,t){const n=e.style||{},i={};return dl(i,n,e),Object.assign(i,Cf(e,t)),i}function Pf(e,t){const n={},i=Af(e,t);return e.drag&&e.dragListener!==!1&&(n.draggable=!1,i.userSelect=i.WebkitUserSelect=i.WebkitTouchCallout="none",i.touchAction=e.drag===!0?"none":`pan-${e.drag==="x"?"y":"x"}`),e.tabIndex===void 0&&(e.onTap||e.onTapStart||e.whileTap)&&(n.tabIndex=0),n.style=i,n}const fl=()=>({...Os(),attrs:{}});function Ef(e,t,n,i){const s=y.useMemo(()=>{const r=fl();return qa(r,t,Ya(i),e.transformTemplate,e.style),{...r.attrs,style:{...r.style}}},[t]);if(e.style){const r={};dl(r,e.style,e),s.style={...r,...s.style}}return s}const Df=new Set(["animate","exit","variants","initial","style","values","variants","transition","transformTemplate","custom","inherit","onBeforeLayoutMeasure","onAnimationStart","onAnimationComplete","onUpdate","onDragStart","onDrag","onDragEnd","onMeasureDragConstraints","onDirectionLock","onDragTransitionEnd","_dragX","_dragY","onHoverStart","onHoverEnd","onViewportEnter","onViewportLeave","globalTapTarget","propagate","ignoreStrict","viewport"]);function Ln(e){return e.startsWith("while")||e.startsWith("drag")&&e!=="draggable"||e.startsWith("layout")||e.startsWith("onTap")||e.startsWith("onPan")||e.startsWith("onLayout")||Df.has(e)}function Mf(e,t){return e.startsWith("on")?!Ln(e):t?.(e)??!Ln(e)}function Of(e,t,n,i){const s={};for(const r in e)r==="values"&&typeof e.values=="object"||me(e[r])||(Mf(r,i)||n===!0&&Ln(r)||!t&&!Ln(r)||e.draggable&&r.startsWith("onDrag"))&&(s[r]=e[r]);return s}const Rf=["animate","circle","defs","desc","ellipse","g","image","line","filter","marker","mask","metadata","path","pattern","polygon","polyline","rect","stop","switch","symbol","svg","text","tspan","use","view"];function Rs(e){return typeof e!="string"||e.includes("-")?!1:!!(Rf.indexOf(e)>-1||/[A-Z]/u.test(e))}function jf(e,t,n,{latestValues:i},s,r=!1,o,a){const l=(o??Rs(e)?Ef:Pf)(t,i,s,e),h=Of(t,typeof e=="string",r,a),f=e!==y.Fragment?{...h,...l,ref:n}:{},{children:d}=t,m=y.useMemo(()=>me(d)?d.get():d,[d]);return y.createElement(e,{...f,children:m})}function Lf({scrapeMotionValuesFromProps:e,createRenderState:t},n,i,s){return{latestValues:Nf(n,i,s,e),renderState:t()}}function Nf(e,t,n,i){const s={},r=i(e,{});for(const d in r)s[d]=xn(r[d]);let{initial:o,animate:a}=e;const c=Fn(e),l=Ia(e);t&&l&&!c&&e.inherit!==!1&&(o===void 0&&(o=t.initial),a===void 0&&(a=t.animate));let h=n?n.initial===!1:!1;h=h||o===!1;const f=h?a:o;if(f&&typeof f!="boolean"&&!$n(f)){const d=Array.isArray(f)?f:[f];for(let m=0;m<d.length;m++){const g=xs(e,d[m]);if(g){const{transitionEnd:b,transition:p,...x}=g;for(const S in x){let v=x[S];if(Array.isArray(v)){const w=h?v.length-1:0;v=v[w]}v!==null&&(s[S]=v)}for(const S in b)s[S]=b[S]}}}return s}const pl=e=>(t,n)=>{const i=y.useContext(_n),s=y.useContext(Vn),r=()=>Lf(e,t,i,s);return n?r():os(r)},Vf=pl({scrapeMotionValuesFromProps:Ds,createRenderState:Os}),If=pl({scrapeMotionValuesFromProps:Xa,createRenderState:fl}),Bf=Symbol.for("motionComponentSymbol");function $f(e,t,n){const i=y.useRef(n);y.useInsertionEffect(()=>{i.current=n});const s=y.useRef(null);return y.useCallback(r=>{r&&e.onMount?.(r),t&&(r?t.mount(r):t.unmount());const o=i.current;if(typeof o=="function")if(r){const a=o(r);typeof a=="function"&&(s.current=a)}else s.current?(s.current(),s.current=null):o(r);else o&&(o.current=r)},[t])}const ml=y.createContext({});function mt(e){return e&&typeof e=="object"&&Object.prototype.hasOwnProperty.call(e,"current")}function Ff(e,t,n,i,s,r){const{visualElement:o}=y.useContext(_n),a=y.useContext(hl),c=y.useContext(Vn),l=y.useContext(Ms),h=l.reducedMotion,f=l.skipAnimations,d=y.useRef(null),m=y.useRef(!1);i=i||a.renderer,!d.current&&i&&(d.current=i(e,{visualState:t,parent:o,props:n,presenceContext:c,blockInitialAnimation:c?c.initial===!1:!1,reducedMotionConfig:h,skipAnimations:f,isSVG:r}),m.current&&d.current&&(d.current.manuallyAnimateOnMount=!0));const g=d.current,b=y.useContext(ml);g&&!g.projection&&s&&(g.type==="html"||g.type==="svg")&&_f(d.current,n,s,b);const p=y.useRef(!1);y.useInsertionEffect(()=>{g&&p.current&&g.update(n,c)});const x=n[Ca],S=y.useRef(!!x&&typeof window<"u"&&!window.MotionHandoffIsComplete?.(x)&&window.MotionHasOptimisedAnimation?.(x));return Cn(()=>{m.current=!0,g&&(p.current=!0,window.MotionIsMounted=!0,g.updateFeatures(),g.scheduleRenderMicrotask(),S.current&&g.animationState&&g.animationState.animateChanges())}),y.useEffect(()=>{g&&(!S.current&&g.animationState&&g.animationState.animateChanges(),S.current&&(queueMicrotask(()=>{window.MotionHandoffMarkAsComplete?.(x)}),S.current=!1),g.enteringChildren=void 0)}),g}function _f(e,t,n,i){const{layoutId:s,layout:r,drag:o,dragConstraints:a,layoutScroll:c,layoutRoot:l,layoutAnchor:h,layoutCrossfade:f}=t;e.projection=new n(e.latestValues,t["data-framer-portal-id"]?void 0:gl(e.parent)),e.projection.setOptions({layoutId:s,layout:r,alwaysMeasureLayout:!!o||a&&mt(a),visualElement:e,animationType:typeof r=="string"?r:"both",initialPromotionConfig:i,crossfade:f,layoutScroll:c,layoutRoot:l,layoutAnchor:h})}function gl(e){if(e)return e.options.allowProjection!==!1?e.projection:gl(e.parent)}function ii(e,{forwardMotionProps:t=!1,type:n}={},i,s){i&&kf(i);const r=n?n==="svg":Rs(e),o=r?If:Vf;function a(l,h){let f;const d={...y.useContext(Ms),...l,layoutId:Hf(l)},{isStatic:m,isValidProp:g}=d,b=Tf(l),p=o(l,m);if(!m&&typeof window<"u"){zf();const x=Wf(d);f=x.MeasureLayout,b.visualElement=Ff(e,p,d,s,x.ProjectionNode,r)}return u.jsxs(_n.Provider,{value:b,children:[f&&b.visualElement?u.jsx(f,{visualElement:b.visualElement,...d}):null,jf(e,l,$f(p,b.visualElement,h),p,m,t,r,g)]})}a.displayName=`motion.${typeof e=="string"?e:`create(${e.displayName??e.name??""})`}`;const c=y.forwardRef(a);return c[Bf]=e,c}function Hf({layoutId:e}){const t=y.useContext(ss).id;return t&&e!==void 0?t+"-"+e:e}function zf(e,t){y.useContext(hl).strict}function Wf(e){const t=ul(),{drag:n,layout:i}=t;if(!n&&!i)return{};const s={...n,...i};return{MeasureLayout:n?.isEnabled(e)||i?.isEnabled(e)?s.MeasureLayout:void 0,ProjectionNode:s.ProjectionNode}}function Gf(e,t){if(typeof Proxy>"u")return ii;const n=new Map,i=(r,o)=>ii(r,o,e,t),s=(r,o)=>i(r,o);return new Proxy(s,{get:(r,o)=>o==="create"?i:(n.has(o)||n.set(o,ii(o,void 0,e,t)),n.get(o))})}const Uf=(e,t)=>t.isSVG??Rs(e)?new xd(t):new md(t,{allowProjection:e!==y.Fragment});class Kf extends Ze{constructor(t){super(t),t.animationState||(t.animationState=Cd(t))}updateAnimationControlsSubscription(){const{animate:t}=this.node.getProps();$n(t)&&(this.unmountControls=t.subscribe(this.node))}mount(){this.updateAnimationControlsSubscription()}update(){const{animate:t}=this.node.getProps(),{animate:n}=this.node.prevProps||{};t!==n&&this.updateAnimationControlsSubscription()}unmount(){this.node.animationState.reset(),this.unmountControls?.()}}let qf=0;class Qf extends Ze{constructor(){super(...arguments),this.id=qf++,this.isExitComplete=!1}update(){if(!this.node.presenceContext)return;const{isPresent:t,onExitComplete:n}=this.node.presenceContext,{isPresent:i}=this.node.prevPresenceContext||{};if(!this.node.animationState||t===i)return;if(t&&i===!1){if(this.isExitComplete){const{initial:r,custom:o}=this.node.getProps();if(typeof r=="string"||typeof r=="object"&&r!==null&&!Array.isArray(r)){const a=at(this.node,r,o);if(a){const{transition:c,transitionEnd:l,...h}=a;for(const f in h)this.node.getValue(f)?.jump(h[f])}}this.node.animationState.reset(),this.node.animationState.animateChanges()}else this.node.animationState.setActive("exit",!1);this.isExitComplete=!1;return}const s=this.node.animationState.setActive("exit",!t);n&&!t&&s.then(()=>{this.isExitComplete=!0,n(this.id)})}mount(){const{register:t,onExitComplete:n}=this.node.presenceContext||{};n&&n(this.id),t&&(this.unmount=t(this.id))}unmount(){}}const Yf={animation:{Feature:Kf},exit:{Feature:Qf}};function Ut(e){return{point:{x:e.pageX,y:e.pageY}}}const Xf=e=>t=>Ts(t)&&e(t,Ut(t));function Lt(e,t,n,i){return _t(e,t,Xf(n),i)}const yl=({current:e})=>e?e.ownerDocument.defaultView:null,Jo=(e,t)=>Math.abs(e-t);function Zf(e,t){const n=Jo(e.x,t.x),i=Jo(e.y,t.y);return Math.sqrt(n**2+i**2)}const er=new Set(["auto","scroll"]);class bl{constructor(t,n,{transformPagePoint:i,contextWindow:s=window,dragSnapToOrigin:r=!1,distanceThreshold:o=3,element:a}={}){if(this.startEvent=null,this.lastMoveEvent=null,this.lastMoveEventInfo=null,this.lastRawMoveEventInfo=null,this.handlers={},this.contextWindow=window,this.scrollPositions=new Map,this.removeScrollListeners=null,this.onElementScroll=g=>{this.handleScroll(g.target)},this.onWindowScroll=()=>{this.handleScroll(window)},this.updatePoint=()=>{if(!(this.lastMoveEvent&&this.lastMoveEventInfo))return;this.lastRawMoveEventInfo&&(this.lastMoveEventInfo=nn(this.lastRawMoveEventInfo,this.transformPagePoint));const g=si(this.lastMoveEventInfo,this.history),b=this.startEvent!==null,p=Zf(g.offset,{x:0,y:0})>=this.distanceThreshold;if(!b&&!p)return;const{point:x}=g,{timestamp:S}=pe;this.history.push({...x,timestamp:S});const{onStart:v,onMove:w}=this.handlers;b||(v&&v(this.lastMoveEvent,g),this.startEvent=this.lastMoveEvent),w&&w(this.lastMoveEvent,g)},this.handlePointerMove=(g,b)=>{this.lastMoveEvent=g,this.lastRawMoveEventInfo=b,this.lastMoveEventInfo=nn(b,this.transformPagePoint),ee.update(this.updatePoint,!0)},this.handlePointerUp=(g,b)=>{this.end();const{onEnd:p,onSessionEnd:x,resumeAnimation:S}=this.handlers;if((this.dragSnapToOrigin||!this.startEvent)&&S&&S(),!(this.lastMoveEvent&&this.lastMoveEventInfo))return;const v=si(g.type==="pointercancel"?this.lastMoveEventInfo:nn(b,this.transformPagePoint),this.history);this.startEvent&&p&&p(g,v),x&&x(g,v)},!Ts(t))return;this.dragSnapToOrigin=r,this.handlers=n,this.transformPagePoint=i,this.distanceThreshold=o,this.contextWindow=s||window;const c=Ut(t),l=nn(c,this.transformPagePoint),{point:h}=l,{timestamp:f}=pe;this.history=[{...h,timestamp:f}];const{onSessionStart:d}=n;d&&d(t,si(l,this.history));const m={passive:!0,capture:!0};this.removeListeners=zt(Lt(this.contextWindow,"pointermove",this.handlePointerMove,m),Lt(this.contextWindow,"pointerup",this.handlePointerUp,m),Lt(this.contextWindow,"pointercancel",this.handlePointerUp,m)),a&&this.startScrollTracking(a)}startScrollTracking(t){let n=t.parentElement;for(;n;){const i=getComputedStyle(n);(er.has(i.overflowX)||er.has(i.overflowY))&&this.scrollPositions.set(n,{x:n.scrollLeft,y:n.scrollTop}),n=n.parentElement}this.scrollPositions.set(window,{x:window.scrollX,y:window.scrollY}),window.addEventListener("scroll",this.onElementScroll,{capture:!0}),window.addEventListener("scroll",this.onWindowScroll),this.removeScrollListeners=()=>{window.removeEventListener("scroll",this.onElementScroll,{capture:!0}),window.removeEventListener("scroll",this.onWindowScroll)}}handleScroll(t){const n=this.scrollPositions.get(t);if(!n)return;const i=t===window,s=i?{x:window.scrollX,y:window.scrollY}:{x:t.scrollLeft,y:t.scrollTop},r={x:s.x-n.x,y:s.y-n.y};r.x===0&&r.y===0||(i?this.lastMoveEventInfo&&(this.lastMoveEventInfo.point.x+=r.x,this.lastMoveEventInfo.point.y+=r.y):this.history.length>0&&(this.history[0].x-=r.x,this.history[0].y-=r.y),this.scrollPositions.set(t,s),ee.update(this.updatePoint,!0))}updateHandlers(t){this.handlers=t}end(){this.removeListeners&&this.removeListeners(),this.removeScrollListeners&&this.removeScrollListeners(),this.scrollPositions.clear(),Xe(this.updatePoint)}}function nn(e,t){return t?{point:t(e.point)}:e}function tr(e,t){return{x:e.x-t.x,y:e.y-t.y}}function si({point:e},t){return{point:e,delta:tr(e,wl(t)),offset:tr(e,Jf(t)),velocity:ep(t,.1)}}function Jf(e){return e[0]}function wl(e){return e[e.length-1]}function ep(e,t){if(e.length<2)return{x:0,y:0};let n=e.length-1,i=null;const s=wl(e);for(;n>=0&&(i=e[n],!(s.timestamp-i.timestamp>Le(t)));)n--;if(!i)return{x:0,y:0};i===e[0]&&e.length>2&&s.timestamp-i.timestamp>Le(t)*2&&(i=e[1]);const r=Re(s.timestamp-i.timestamp);if(r===0)return{x:0,y:0};const o={x:(s.x-i.x)/r,y:(s.y-i.y)/r};return o.x===1/0&&(o.x=0),o.y===1/0&&(o.y=0),o}function tp(e,{min:t,max:n},i){return t!==void 0&&e<t?e=i?J(t,e,i.min):Math.max(e,t):n!==void 0&&e>n&&(e=i?J(n,e,i.max):Math.min(e,n)),e}function nr(e,t,n){return{min:t!==void 0?e.min+t:void 0,max:n!==void 0?e.max+n-(e.max-e.min):void 0}}function np(e,{top:t,left:n,bottom:i,right:s}){return{x:nr(e.x,n,s),y:nr(e.y,t,i)}}function ir(e,t){let n=t.min-e.min,i=t.max-e.max;return t.max-t.min<e.max-e.min&&([n,i]=[i,n]),{min:n,max:i}}function ip(e,t){return{x:ir(e.x,t.x),y:ir(e.y,t.y)}}function sp(e,t){let n=.5;const i=be(e),s=be(t);return s>i?n=Bt(t.min,t.max-i,e.min):i>s&&(n=Bt(e.min,e.max-s,t.min)),We(0,1,n)}function op(e,t){const n={};return t.min!==void 0&&(n.min=t.min-e.min),t.max!==void 0&&(n.max=t.max-e.min),n}const Qi=.35;function rp(e=Qi){return e===!1?e=0:e===!0&&(e=Qi),{x:sr(e,"left","right"),y:sr(e,"top","bottom")}}function sr(e,t,n){return{min:or(e,t),max:or(e,n)}}function or(e,t){return typeof e=="number"?e:e[t]||0}const ap=new WeakMap;class lp{constructor(t){this.openDragLock=null,this.isDragging=!1,this.currentDirection=null,this.originPoint={x:0,y:0},this.constraints=!1,this.hasMutatedConstraints=!1,this.elastic=ue(),this.latestPointerEvent=null,this.latestPanInfo=null,this.visualElement=t}start(t,{snapToCursor:n=!1,distanceThreshold:i}={}){const{presenceContext:s}=this.visualElement;if(s&&s.isPresent===!1)return;const r=f=>{n&&this.snapToCursor(Ut(f).point),this.stopAnimation()},o=(f,d)=>{const{drag:m,dragPropagation:g,onDragStart:b}=this.getProps();if(m&&!g&&(this.openDragLock&&this.openDragLock(),this.openDragLock=Lu(m),!this.openDragLock))return;this.latestPointerEvent=f,this.latestPanInfo=d,this.isDragging=!0,this.currentDirection=null,this.resolveConstraints(),this.visualElement.projection&&(this.visualElement.projection.isAnimationBlocked=!0,this.visualElement.projection.target=void 0),Fe(x=>{let S=this.getAxisMotionValue(x).get()||0;if(ze.test(S)){const{projection:v}=this.visualElement;if(v&&v.layout){const w=v.layout.layoutBox[x];w&&(S=be(w)*(parseFloat(S)/100))}}this.originPoint[x]=S}),b&&ee.update(()=>b(f,d),!1,!0),$i(this.visualElement,"transform");const{animationState:p}=this.visualElement;p&&p.setActive("whileDrag",!0)},a=(f,d)=>{this.latestPointerEvent=f,this.latestPanInfo=d;const{dragPropagation:m,dragDirectionLock:g,onDirectionLock:b,onDrag:p}=this.getProps();if(!m&&!this.openDragLock)return;const{offset:x}=d;if(g&&this.currentDirection===null){this.currentDirection=hp(x),this.currentDirection!==null&&b&&b(this.currentDirection);return}this.updateAxis("x",d.point,x),this.updateAxis("y",d.point,x),this.visualElement.render(),p&&ee.update(()=>p(f,d),!1,!0)},c=(f,d)=>{this.latestPointerEvent=f,this.latestPanInfo=d,this.stop(f,d),this.latestPointerEvent=null,this.latestPanInfo=null},l=()=>{const{dragSnapToOrigin:f}=this.getProps();(f||this.constraints)&&this.startAnimation({x:0,y:0})},{dragSnapToOrigin:h}=this.getProps();this.panSession=new bl(t,{onSessionStart:r,onStart:o,onMove:a,onSessionEnd:c,resumeAnimation:l},{transformPagePoint:this.visualElement.getTransformPagePoint(),dragSnapToOrigin:h,distanceThreshold:i,contextWindow:yl(this.visualElement),element:this.visualElement.current})}stop(t,n){const i=t||this.latestPointerEvent,s=n||this.latestPanInfo,r=this.isDragging;if(this.cancel(),!r||!s||!i)return;const{velocity:o}=s;this.startAnimation(o);const{onDragEnd:a}=this.getProps();a&&ee.postRender(()=>a(i,s))}cancel(){this.isDragging=!1;const{projection:t,animationState:n}=this.visualElement;t&&(t.isAnimationBlocked=!1),this.endPanSession();const{dragPropagation:i}=this.getProps();!i&&this.openDragLock&&(this.openDragLock(),this.openDragLock=null),n&&n.setActive("whileDrag",!1)}endPanSession(){this.panSession&&this.panSession.end(),this.panSession=void 0}updateAxis(t,n,i){const{drag:s}=this.getProps();if(!i||!sn(t,s,this.currentDirection))return;const r=this.getAxisMotionValue(t);let o=this.originPoint[t]+i[t];this.constraints&&this.constraints[t]&&(o=tp(o,this.constraints[t],this.elastic[t])),r.set(o)}resolveConstraints(){const{dragConstraints:t,dragElastic:n}=this.getProps(),i=this.visualElement.projection&&!this.visualElement.projection.layout?this.visualElement.projection.measure(!1):this.visualElement.projection?.layout,s=this.constraints;t&&mt(t)?this.constraints||(this.constraints=this.resolveRefConstraints()):t&&i?this.constraints=np(i.layoutBox,t):this.constraints=!1,this.elastic=rp(n),s!==this.constraints&&!mt(t)&&i&&this.constraints&&!this.hasMutatedConstraints&&Fe(r=>{this.constraints!==!1&&this.getAxisMotionValue(r)&&(this.constraints[r]=op(i.layoutBox[r],this.constraints[r]))})}resolveRefConstraints(){const{dragConstraints:t,onMeasureDragConstraints:n}=this.getProps();if(!t||!mt(t))return!1;const i=t.current,{projection:s}=this.visualElement;if(!s||!s.layout)return!1;s.root&&(s.root.scroll=void 0,s.root.updateScroll());const r=cd(i,s.root,this.visualElement.getTransformPagePoint());let o=ip(s.layout.layoutBox,r);if(n){const a=n(rd(o));this.hasMutatedConstraints=!!a,a&&(o=_a(a))}return o}startAnimation(t){const{drag:n,dragMomentum:i,dragElastic:s,dragTransition:r,dragSnapToOrigin:o,onDragTransitionEnd:a}=this.getProps(),c=this.constraints||{},l=Fe(h=>{if(!sn(h,n,this.currentDirection))return;let f=c&&c[h]||{};(o===!0||o===h)&&(f={min:0,max:0});const d=s?200:1e6,m=s?40:1e7,g={type:"inertia",velocity:i?t[h]:0,bounceStiffness:d,bounceDamping:m,timeConstant:750,restDelta:1,restSpeed:10,...r,...f};return this.startAxisValueAnimation(h,g)});return Promise.all(l).then(a)}startAxisValueAnimation(t,n){const i=this.getAxisMotionValue(t);return $i(this.visualElement,t),i.start(ws(t,i,0,n,this.visualElement,!1))}stopAnimation(){Fe(t=>this.getAxisMotionValue(t).stop())}getAxisMotionValue(t){const n=`_drag${t.toUpperCase()}`,s=this.visualElement.getProps()[n];return s||this.visualElement.getValue(t,this.visualElement.latestValues[t]??0)}snapToCursor(t){Fe(n=>{const{drag:i}=this.getProps();if(!sn(n,i,this.currentDirection))return;const{projection:s}=this.visualElement,r=this.getAxisMotionValue(n);if(s&&s.layout){const{min:o,max:a}=s.layout.layoutBox[n],c=r.get()||0;r.set(t[n]-J(o,a,.5)+c)}})}scalePositionWithinConstraints(){if(!this.visualElement.current)return;const{drag:t,dragConstraints:n}=this.getProps(),{projection:i}=this.visualElement;if(!mt(n)||!i||!this.constraints)return;this.stopAnimation();const s={x:0,y:0};Fe(o=>{const a=this.getAxisMotionValue(o);if(a&&this.constraints!==!1){const c=a.get();s[o]=sp({min:c,max:c},this.constraints[o])}});const{transformTemplate:r}=this.visualElement.getProps();this.visualElement.current.style.transform=r?r({},""):"none",i.root&&i.root.updateScroll(),i.updateLayout(),this.constraints=!1,this.resolveConstraints(),Fe(o=>{if(!sn(o,t,null))return;const a=this.getAxisMotionValue(o),{min:c,max:l}=this.constraints[o];a.set(J(c,l,s[o]))}),this.visualElement.render()}addListeners(){if(!this.visualElement.current)return;ap.set(this.visualElement,this);const t=this.visualElement.current,n=Lt(t,"pointerdown",l=>{const{drag:h,dragListener:f=!0}=this.getProps(),d=l.target,m=d!==t&&Fu(d);h&&f&&!m&&this.start(l)});let i;const s=()=>{const{dragConstraints:l}=this.getProps();mt(l)&&l.current&&(this.constraints=this.resolveRefConstraints(),i||(i=cp(t,l.current,()=>this.scalePositionWithinConstraints())))},{projection:r}=this.visualElement,o=r.addEventListener("measure",s);r&&!r.layout&&(r.root&&r.root.updateScroll(),r.updateLayout()),ee.read(s);const a=_t(window,"resize",()=>this.scalePositionWithinConstraints()),c=r.addEventListener("didUpdate",(({delta:l,hasLayoutChanged:h})=>{this.isDragging&&h&&(Fe(f=>{const d=this.getAxisMotionValue(f);d&&(this.originPoint[f]+=l[f].translate,d.set(d.get()+l[f].translate))}),this.visualElement.render())}));return()=>{a(),n(),o(),c&&c(),i&&i()}}getProps(){const t=this.visualElement.getProps(),{drag:n=!1,dragDirectionLock:i=!1,dragPropagation:s=!1,dragConstraints:r=!1,dragElastic:o=Qi,dragMomentum:a=!0}=t;return{...t,drag:n,dragDirectionLock:i,dragPropagation:s,dragConstraints:r,dragElastic:o,dragMomentum:a}}}function rr(e){let t=!0;return()=>{if(t){t=!1;return}e()}}function cp(e,t,n){const i=fo(e,rr(n)),s=fo(t,rr(n));return()=>{i(),s()}}function sn(e,t,n){return(t===!0||t===e)&&(n===null||n===e)}function hp(e,t=10){let n=null;return Math.abs(e.y)>t?n="y":Math.abs(e.x)>t&&(n="x"),n}class up extends Ze{constructor(t){super(t),this.removeGroupControls=je,this.removeListeners=je,this.controls=new lp(t)}mount(){const{dragControls:t}=this.node.getProps();t&&(this.removeGroupControls=t.subscribe(this.controls)),this.removeListeners=this.controls.addListeners()||je}update(){const{dragControls:t}=this.node.getProps(),{dragControls:n}=this.node.prevProps||{};t!==n&&(this.removeGroupControls(),t&&(this.removeGroupControls=t.subscribe(this.controls)))}unmount(){this.removeGroupControls(),this.removeListeners(),this.controls.isDragging||this.controls.endPanSession()}}const oi=e=>(t,n)=>{e&&ee.update(()=>e(t,n),!1,!0)};class dp extends Ze{constructor(){super(...arguments),this.removePointerDownListener=je}onPointerDown(t){this.session=new bl(t,this.createPanHandlers(),{transformPagePoint:this.node.getTransformPagePoint(),contextWindow:yl(this.node)})}createPanHandlers(){const{onPanSessionStart:t,onPanStart:n,onPan:i,onPanEnd:s}=this.node.getProps();return{onSessionStart:oi(t),onStart:oi(n),onMove:oi(i),onEnd:(r,o)=>{delete this.session,s&&ee.postRender(()=>s(r,o))}}}mount(){this.removePointerDownListener=Lt(this.node.current,"pointerdown",t=>this.onPointerDown(t))}update(){this.session&&this.session.updateHandlers(this.createPanHandlers())}unmount(){this.removePointerDownListener(),this.session&&this.session.end()}}let ri=!1;class fp extends y.Component{componentDidMount(){const{visualElement:t,layoutGroup:n,switchLayoutGroup:i,layoutId:s}=this.props,{projection:r}=t;r&&(n.group&&n.group.add(r),i&&i.register&&s&&i.register(r),ri&&r.root.didUpdate(),r.addEventListener("animationComplete",()=>{this.safeToRemove()}),r.setOptions({...r.options,layoutDependency:this.props.layoutDependency,onExitComplete:()=>this.safeToRemove()})),vn.hasEverUpdated=!0}getSnapshotBeforeUpdate(t){const{layoutDependency:n,visualElement:i,drag:s,isPresent:r}=this.props,{projection:o}=i;return o&&(o.isPresent=r,t.layoutDependency!==n&&o.setOptions({...o.options,layoutDependency:n}),ri=!0,s||t.layoutDependency!==n||n===void 0||t.isPresent!==r?o.willUpdate():this.safeToRemove(),t.isPresent!==r&&(r?o.promote():o.relegate()||ee.postRender(()=>{const a=o.getStack();(!a||!a.members.length)&&this.safeToRemove()}))),null}componentDidUpdate(){const{visualElement:t,layoutAnchor:n}=this.props,{projection:i}=t;i&&(i.options.layoutAnchor=n,i.root.didUpdate(),Ss.postRender(()=>{!i.currentAnimation&&i.isLead()&&this.safeToRemove()}))}componentWillUnmount(){const{visualElement:t,layoutGroup:n,switchLayoutGroup:i}=this.props,{projection:s}=t;ri=!0,s&&(s.scheduleCheckAfterUnmount(),n&&n.group&&n.group.remove(s),i&&i.deregister&&i.deregister(s))}safeToRemove(){const{safeToRemove:t}=this.props;t&&t()}render(){return null}}function xl(e){const[t,n]=cl(),i=y.useContext(ss);return u.jsx(fp,{...e,layoutGroup:i,switchLayoutGroup:y.useContext(ml),isPresent:t,safeToRemove:n})}const pp={pan:{Feature:dp},drag:{Feature:up,ProjectionNode:ll,MeasureLayout:xl}};function ar(e,t,n){const{props:i}=e;e.animationState&&i.whileHover&&e.animationState.setActive("whileHover",n==="Start");const s="onHover"+n,r=i[s];r&&ee.postRender(()=>r(t,Ut(t)))}class mp extends Ze{mount(){const{current:t}=this.node;t&&(this.unmount=Vu(t,(n,i)=>(ar(this.node,i,"Start"),s=>ar(this.node,s,"End"))))}unmount(){}}class gp extends Ze{constructor(){super(...arguments),this.isActive=!1}onFocus(){let t=!1;try{t=this.node.current.matches(":focus-visible")}catch{t=!0}!t||!this.node.animationState||(this.node.animationState.setActive("whileFocus",!0),this.isActive=!0)}onBlur(){!this.isActive||!this.node.animationState||(this.node.animationState.setActive("whileFocus",!1),this.isActive=!1)}mount(){this.unmount=zt(_t(this.node.current,"focus",()=>this.onFocus()),_t(this.node.current,"blur",()=>this.onBlur()))}unmount(){}}function lr(e,t,n){const{props:i}=e;if(e.current instanceof HTMLButtonElement&&e.current.disabled)return;e.animationState&&i.whileTap&&e.animationState.setActive("whileTap",n==="Start");const s="onTap"+(n==="End"?"":n),r=i[s];r&&ee.postRender(()=>r(t,Ut(t)))}class yp extends Ze{mount(){const{current:t}=this.node;if(!t)return;const{globalTapTarget:n,propagate:i}=this.node.props;this.unmount=Hu(t,(s,r)=>(lr(this.node,r,"Start"),(o,{success:a})=>lr(this.node,o,a?"End":"Cancel")),{useGlobalTarget:n,stopPropagation:i?.tap===!1})}unmount(){}}const Yi=new WeakMap,ai=new WeakMap,bp=e=>{const t=Yi.get(e.target);t&&t(e)},wp=e=>{e.forEach(bp)};function xp({root:e,...t}){const n=e||document;ai.has(n)||ai.set(n,{});const i=ai.get(n),s=JSON.stringify(t);return i[s]||(i[s]=new IntersectionObserver(wp,{root:e,...t})),i[s]}function vp(e,t,n){const i=xp(t);return Yi.set(e,n),i.observe(e),()=>{Yi.delete(e),i.unobserve(e)}}const kp={some:0,all:1};class Sp extends Ze{constructor(){super(...arguments),this.hasEnteredView=!1,this.isInView=!1}startObserver(){this.stopObserver?.();const{viewport:t={}}=this.node.getProps(),{root:n,margin:i,amount:s="some",once:r}=t,o={root:n?n.current:void 0,rootMargin:i,threshold:typeof s=="number"?s:kp[s]},a=c=>{const{isIntersecting:l}=c;if(this.isInView===l||(this.isInView=l,r&&!l&&this.hasEnteredView))return;l&&(this.hasEnteredView=!0),this.node.animationState&&this.node.animationState.setActive("whileInView",l);const{onViewportEnter:h,onViewportLeave:f}=this.node.getProps(),d=l?h:f;d&&d(c)};this.stopObserver=vp(this.node.current,o,a)}mount(){this.startObserver()}update(){if(typeof IntersectionObserver>"u")return;const{props:t,prevProps:n}=this.node;["amount","margin","root"].some(Tp(t,n))&&this.startObserver()}unmount(){this.stopObserver?.(),this.hasEnteredView=!1,this.isInView=!1}}function Tp({viewport:e={}},{viewport:t={}}={}){return n=>e[n]!==t[n]}const Cp={inView:{Feature:Sp},tap:{Feature:yp},focus:{Feature:gp},hover:{Feature:mp}},Ap={layout:{ProjectionNode:ll,MeasureLayout:xl}},Pp={...Yf,...Cp,...pp,...Ap},Ep=Gf(Pp,Uf),Dp=Ep,ie={head:{len:18,span:12},secondaryScale:.85,gap:0,stroke:{own:1.4,ownHover:2.6,refFactor:.75},dash:"5 4",kinds:{"own-fwd":{color:we.ownFwd,heads:"end",headDirection:"forward",dashed:!1,secondary:!1,label:"A owns B"},"own-bkwd":{color:we.ownBkwd,heads:"end",headDirection:"backward",dashed:!1,secondary:!1,label:"A belongs to B"},association:{color:we.association,heads:"both",headDirection:"forward",dashed:!0,secondary:!0,label:"A and B are associated"}}};function Mp(e){return e==="forward"?"M0,0 L10,3.5 L0,7 Z":"M10,0 L0,3.5 L10,7 Z"}function kn(e,t=1){const{len:n,span:i}=ie.head;return{viewBox:"0 0 10 7",refX:0,refY:3.5,markerWidth:n*t,markerHeight:i*t,markerUnits:"userSpaceOnUse",orient:"auto-start-reverse",d:Mp(e)}}function cr(e){const t=ie.kinds[e].secondary?ie.secondaryScale:1;return ie.head.len*t+ie.gap}function on(e){throw new Error('Could not dynamically require "'+e+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var li={exports:{}},hr;function Op(){return hr||(hr=1,(function(e,t){(function(n){e.exports=n()})(function(){return(function(){function n(i,s,r){function o(l,h){if(!s[l]){if(!i[l]){var f=typeof on=="function"&&on;if(!h&&f)return f(l,!0);if(a)return a(l,!0);var d=new Error("Cannot find module '"+l+"'");throw d.code="MODULE_NOT_FOUND",d}var m=s[l]={exports:{}};i[l][0].call(m.exports,function(g){var b=i[l][1][g];return o(b||g)},m,m.exports,n,i,s,r)}return s[l].exports}for(var a=typeof on=="function"&&on,c=0;c<r.length;c++)o(r[c]);return o}return n})()({1:[function(n,i,s){Object.defineProperty(s,"__esModule",{value:!0}),s.default=void 0;function r(d){"@babel/helpers - typeof";return r=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(m){return typeof m}:function(m){return m&&typeof Symbol=="function"&&m.constructor===Symbol&&m!==Symbol.prototype?"symbol":typeof m},r(d)}function o(d,m){if(!(d instanceof m))throw new TypeError("Cannot call a class as a function")}function a(d,m){for(var g=0;g<m.length;g++){var b=m[g];b.enumerable=b.enumerable||!1,b.configurable=!0,"value"in b&&(b.writable=!0),Object.defineProperty(d,l(b.key),b)}}function c(d,m,g){return m&&a(d.prototype,m),Object.defineProperty(d,"prototype",{writable:!1}),d}function l(d){var m=h(d,"string");return r(m)=="symbol"?m:m+""}function h(d,m){if(r(d)!="object"||!d)return d;var g=d[Symbol.toPrimitive];if(g!==void 0){var b=g.call(d,m);if(r(b)!="object")return b;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(d)}s.default=(function(){function d(){var m=this,g=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},b=g.defaultLayoutOptions,p=b===void 0?{}:b,x=g.algorithms,S=x===void 0?["layered","stress","mrtree","radial","force","disco","sporeOverlap","sporeCompaction","rectpacking"]:x,v=g.workerFactory,w=g.workerUrl;if(o(this,d),this.defaultLayoutOptions=p,this.initialized=!1,typeof w>"u"&&typeof v>"u")throw new Error("Cannot construct an ELK without both 'workerUrl' and 'workerFactory'.");var k=v;typeof w<"u"&&typeof v>"u"&&(k=function(D){return new Worker(D)});var E=k(w);if(typeof E.postMessage!="function")throw new TypeError("Created worker does not provide the required 'postMessage' function.");this.worker=new f(E),this.worker.postMessage({cmd:"register",algorithms:S}).then(function(T){return m.initialized=!0}).catch(console.err)}return c(d,[{key:"layout",value:function(g){var b=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},p=b.layoutOptions,x=p===void 0?this.defaultLayoutOptions:p,S=b.logging,v=S===void 0?!1:S,w=b.measureExecutionTime,k=w===void 0?!1:w;return g?this.worker.postMessage({cmd:"layout",graph:g,layoutOptions:x,options:{logging:v,measureExecutionTime:k}}):Promise.reject(new Error("Missing mandatory parameter 'graph'."))}},{key:"knownLayoutAlgorithms",value:function(){return this.worker.postMessage({cmd:"algorithms"})}},{key:"knownLayoutOptions",value:function(){return this.worker.postMessage({cmd:"options"})}},{key:"knownLayoutCategories",value:function(){return this.worker.postMessage({cmd:"categories"})}},{key:"terminateWorker",value:function(){this.worker&&this.worker.terminate()}}])})();var f=(function(){function d(m){var g=this;if(o(this,d),m===void 0)throw new Error("Missing mandatory parameter 'worker'.");this.resolvers={},this.worker=m,this.worker.onmessage=function(b){setTimeout(function(){g.receive(g,b)},0)}}return c(d,[{key:"postMessage",value:function(g){var b=this.id||0;this.id=b+1,g.id=b;var p=this;return new Promise(function(x,S){p.resolvers[b]=function(v,w){v?(p.convertGwtStyleError(v),S(v)):x(w)},p.worker.postMessage(g)})}},{key:"receive",value:function(g,b){var p=b.data,x=g.resolvers[p.id];x&&(delete g.resolvers[p.id],p.error?x(p.error):x(null,p.data))}},{key:"terminate",value:function(){this.worker&&this.worker.terminate()}},{key:"convertGwtStyleError",value:function(g){if(g){var b=g.__java$exception;b&&(b.cause&&b.cause.backingJsObject&&(g.cause=b.cause.backingJsObject,this.convertGwtStyleError(g.cause)),delete g.__java$exception)}}}])})()},{}],2:[function(n,i,s){var r=n("./elk-api.js").default;Object.defineProperty(i.exports,"__esModule",{value:!0}),i.exports=r,r.default=r},{"./elk-api.js":1}]},{},[2])(2)})})(li)),li.exports}var Rp=Op();const jp=ic(Rp),Lp="/dynamic-model-var-docs/assets/elk-worker.min-r_yRvuMO.js";class Np{elk=null;ensure(){return this.elk||(this.elk=new jp({workerUrl:Lp})),this.elk}async layout(t,n={}){const{direction:i="DOWN",nodeSpacing:s=32,layerSpacing:r=56,usePartitions:o=!1,extraLayoutOptions:a={}}=n,c={id:"root",layoutOptions:{"elk.algorithm":"layered","elk.direction":i,"elk.spacing.nodeNode":String(s),"elk.layered.spacing.nodeNodeBetweenLayers":String(r),"elk.edgeRouting":"ORTHOGONAL","elk.layered.considerModelOrder.strategy":"NODES_AND_EDGES",...o?{"elk.partitioning.activate":"true"}:{},...a},children:t.nodes.map(p=>({id:p.id,width:p.width,height:p.height,...p.ports?.length?{ports:p.ports.map(x=>({id:x.id,x:x.x,y:x.y,width:0,height:0}))}:{},...o&&p.partition!==void 0||p.ports?.length?{layoutOptions:{...o&&p.partition!==void 0?{"elk.partitioning.partition":String(p.partition)}:{},...p.ports?.length?{"elk.portConstraints":"FIXED_POS"}:{}}}:{}})),edges:t.edges.filter(p=>p.source!==p.target).map(p=>({id:p.id,sources:[p.sourcePort??p.source],targets:[p.targetPort??p.target]}))},l=new Map(t.edges.map(p=>[p.id,p]));this.elk;const h=performance.now(),f=await this.ensure().layout(c);performance.now()-h,t.nodes.length,t.edges.length;const d=(f.children??[]).map(p=>({id:p.id,x:p.x??0,y:p.y??0,width:p.width??0,height:p.height??0})),m=(f.edges??[]).map(p=>{const x=l.get(p.id);if(!x)throw new Error(`ELK returned unknown edge id: ${p.id}`);return{id:p.id,source:x.source,target:x.target,sections:p.sections}}),g=Math.max(0,...d.map(p=>p.x+p.width)),b=Math.max(0,...d.map(p=>p.y+p.height));return{nodes:d,edges:m,width:g,height:b}}cancel(){this.elk&&(this.elk.terminateWorker(),this.elk=null)}dispose(){this.cancel()}}function rn(e){if(!e?.length)return[];const t=e[0];return[t.startPoint,...t.bendPoints??[],t.endPoint]}function ur(e,t,n){const i=t.x-e.x,s=t.y-e.y,r=Math.hypot(i,s);if(r<1e-6)return{...e};const o=Math.min(n,r/2)/r;return{x:e.x+i*o,y:e.y+s*o}}function Vp(e,t){if(e.length<2)return Ip(e);let n=`M${e[0].x},${e[0].y}`;for(let s=1;s<e.length-1;s++){const r=ur(e[s],e[s-1],t),o=ur(e[s],e[s+1],t);n+=`L${r.x},${r.y}Q${e[s].x},${e[s].y} ${o.x},${o.y}`}const i=e[e.length-1];return`${n}L${i.x},${i.y}`}function Ip(e){return e.length?e.map((t,n)=>`${n===0?"M":"L"}${t.x},${t.y}`).join(""):""}function Bp(e,t){let n=0,i=e.length-1,s=e[e.length-1];for(let r=e.length-1;r>0;r--){const o=Math.hypot(e[r].x-e[r-1].x,e[r].y-e[r-1].y);if(n+o>=t){const a=(t-n)/o;s={x:e[r].x+(e[r-1].x-e[r].x)*a,y:e[r].y+(e[r-1].y-e[r].y)*a},i=r-1;break}n+=o,i=r-1}return{cut:i,cutPoint:s}}function $p(e,t,n,i){if(e.length<2||n<=0)return i(e);const{cut:s,cutPoint:r}=Bp(e,n),o=e.slice(0,s+1),a=o[o.length-1],c=a&&Math.abs(a.x-r.x)<1e-6&&Math.abs(a.y-r.y)<1e-6;return i([...o,...c?[]:[r],t])}function Fp(e,t=1.5){if(e.length<3)return e;const n=[e[0]];for(let i=1;i<e.length-1;i++){const s=n[n.length-1],r=e[i],o=e[i+1],a=o.x-s.x,c=o.y-s.y,l=Math.hypot(a,c);(l<1e-6?Math.hypot(r.x-s.x,r.y-s.y):Math.abs(c*r.x-a*r.y+o.x*s.y-o.y*s.x)/l)>t&&n.push(r)}return n.push(e[e.length-1]),n}function _p(e,t,n,i){const s=Math.hypot(t.x,t.y)||1,r=t.x/s,o=t.y/s,a=-o,c=r,l=n/2,h={x:e.x+a*l,y:e.y+c*l},f={x:e.x-a*l,y:e.y-c*l},d={x:e.x+r*i,y:e.y+o*i};return`M${h.x},${h.y}L${d.x},${d.y}L${f.x},${f.y}Z`}function Hp(e,t,n,i,s=16){const r={x:e.x+n.x*s,y:e.y+n.y*s},o={x:t.x+i.x*s,y:t.y+i.y*s},a=[e,r];if(Math.abs(n.x)>.5){const c=(r.x+o.x)/2;Math.abs(r.y-o.y)>.5&&a.push({x:c,y:r.y},{x:c,y:o.y})}else{const c=(r.y+o.y)/2;Math.abs(r.x-o.x)>.5&&a.push({x:r.x,y:c},{x:o.x,y:c})}return a.push(o,t),Fp(a)}function zp(e,t={}){const n=y.useRef(null);n.current||(n.current=new Np);const[i,s]=y.useState(null),[r,o]=y.useState(!1),a=JSON.stringify(t);y.useEffect(()=>{const h=n.current;if(!e||e.nodes.length===0){s(null),o(!1);return}let f=!1;return o(!0),h.layout(e,JSON.parse(a)).then(d=>{f||(s({spec:e,layout:d}),o(!1))},d=>{f||(o(!1),console.error("graph-core layout failed:",d))}),()=>{f=!0,h.cancel()}},[e,a]),y.useEffect(()=>()=>n.current?.dispose(),[]);const c=!!e&&e.nodes.length>0,l=!i||i.spec!==e;return{latest:i,inProgress:(r||l)&&c}}const Wp=300,Gp=100,Up=200,Kp=75,qp=250,Qp=120,Yp=200,Xp=[.65,0,.35,1],an=e=>e/1e3,Zp=()=>typeof window<"u"&&typeof window.matchMedia=="function"&&window.matchMedia("(prefers-reduced-motion: reduce)").matches,Kt=e=>()=>Zp()?0:e,vl=Kt(Wp),dr=Kt(Gp),Jp=Kt(Up),em=Kt(Kp),tm=Kt(qp),ln=()=>Qp,fr=.5;function nm(e={}){const{min:t=.2,max:n=2}=e,i=y.useRef(null),s=y.useRef(null),r=y.useRef(null),o=y.useRef(1),a=y.useRef({w:0,h:0}),c=y.useRef(null),l=y.useRef(null),h=y.useRef(!0),f=y.useRef(!0),d=y.useCallback(()=>{const v=i.current;return v?{x:v.clientWidth*fr,y:v.clientHeight*fr}:{x:0,y:0}},[]),m=y.useCallback(v=>{const w=s.current;if(w){const{x:k,y:E}=d();w.style.transition=v?`width ${v}ms, height ${v}ms`:"",w.style.padding=`${E}px ${k}px`,w.style.width=`${a.current.w*o.current+2*k}px`,w.style.height=`${a.current.h*o.current+2*E}px`}},[d]),g=y.useCallback((v,w)=>{o.current=Math.min(n,Math.max(t,v));const k=w?vl():0;c.current&&cancelAnimationFrame(c.current),c.current=requestAnimationFrame(()=>{c.current=null;const E=r.current;E&&(E.style.transition=k?`transform ${k}ms`:"",E.style.transform=`scale(${o.current})`)}),l.current&&(clearTimeout(l.current),l.current=null),k?m(k):l.current=setTimeout(()=>{l.current=null,m(0)},100)},[t,n,m]),b=y.useCallback((v,w=!0)=>{h.current=!1,g(v,w)},[g]),p=y.useCallback(v=>b(o.current*v),[b]),x=y.useCallback((v,w)=>{a.current={w:v,h:w};const k=r.current;k&&(k.style.width=`${v}px`,k.style.height=`${w}px`,k.style.transformOrigin="0 0",k.style.transform=`scale(${o.current})`),m(0)},[m]),S=y.useCallback(()=>{const v=i.current,{w,h:k}=a.current;if(!v||!w||!k)return;h.current=!0;const E=!f.current;f.current=!1,g(Math.min(v.clientWidth/w,v.clientHeight/k,1),E),requestAnimationFrame(()=>{const{x:T,y:D}=d();typeof v.scrollTo=="function"?v.scrollTo({left:T,top:D,behavior:E?"smooth":"auto"}):(v.scrollLeft=T,v.scrollTop=D)})},[g,d]);return y.useEffect(()=>{const v=i.current;if(!v)return;const w=k=>{!k.ctrlKey&&!k.metaKey||(k.preventDefault(),b(o.current*(1-k.deltaY*.005),!1))};return v.addEventListener("wheel",w,{passive:!1}),()=>v.removeEventListener("wheel",w)},[b]),y.useEffect(()=>{const v=i.current;if(!v)return;let w=!1,k=0,E=0,T=0,D=0,P=!1;const N=$=>$ instanceof Element&&!$.closest("[data-pan-ignore]"),F=$=>{$.button!==0||!N($.target)||(w=!0,P=!1,k=$.clientX,E=$.clientY,T=v.scrollLeft,D=v.scrollTop,v.style.cursor="grabbing")},B=$=>{if(!w)return;const C=$.clientX-k,U=$.clientY-E;!P&&Math.hypot(C,U)<3||(P||(P=!0,v.setPointerCapture($.pointerId)),$.preventDefault(),v.scrollLeft=T-C,v.scrollTop=D-U)},O=$=>{w&&(w=!1,v.style.cursor="",v.hasPointerCapture($.pointerId)&&v.releasePointerCapture($.pointerId))};return v.addEventListener("pointerdown",F),v.addEventListener("pointermove",B),v.addEventListener("pointerup",O),v.addEventListener("pointercancel",O),()=>{v.removeEventListener("pointerdown",F),v.removeEventListener("pointermove",B),v.removeEventListener("pointerup",O),v.removeEventListener("pointercancel",O)}},[]),{containerRef:i,spacerRef:s,wrapperRef:r,applyZoom:b,zoomBy:p,zoomToFit:S,getZoom:()=>o.current,isAutoFit:()=>h.current,setContentSize:x}}const im=2,sm=.5;function Nn({kind:e,width:t=44,className:n}){const i=y.useId().replace(/:/g,""),s=ie.kinds[e],r=sm*(s.secondary?ie.secondaryScale:1),{d:o,...a}=kn(s.headDirection,r),c=a.markerWidth,l=`es-${i}`,h=s.heads==="both"?1+c:1,f=t-1-c;return u.jsxs("svg",{width:t,height:"14",viewBox:`0 0 ${t} 14`,className:`shrink-0 ${n??""}`,"aria-hidden":!0,children:[u.jsx("defs",{children:u.jsx("marker",{id:l,...a,children:u.jsx("path",{d:o,fill:s.color})})}),u.jsx("line",{x1:h,y1:"7",x2:f,y2:"7",stroke:s.color,strokeWidth:im,strokeDasharray:s.dashed?ie.dash:void 0,markerStart:s.heads==="both"?`url(#${l})`:void 0,markerEnd:`url(#${l})`})]})}const kl={"owned-mine":{side:"left",kind:"own-bkwd"},"owned-theirs":{side:"left",kind:"own-fwd"},"owns-mine":{side:"right",kind:"own-fwd"},"owns-theirs":{side:"right",kind:"own-bkwd"},association:{side:"left",kind:"association"}},om=300,Xi=new Set;let Nt;function js(){Nt!==void 0&&(clearTimeout(Nt),Nt=void 0)}function Dt(e){js();for(const t of Xi)t(e)}function Sl(){js(),Nt=setTimeout(()=>{Nt=void 0,Dt(null)},om)}function rm({label:e,rows:t,onAdd:n,onRemove:i,onInspect:s,colorOf:r,slotOrder:o,parentOf:a}){const[c,l]=y.useState(null),[h,f]=y.useState(null),d=y.useRef(null),m=y.useRef(null),g=y.useId();y.useEffect(()=>{const k=E=>{E!==g&&(l(null),f(null))};return Xi.add(k),()=>{Xi.delete(k)}},[g]),y.useEffect(()=>{if(!c)return;const k=T=>{T.target?.closest("[data-relation-bar]")||Dt(null)},E=T=>{T.key==="Escape"&&Dt(null)};return document.addEventListener("mousedown",k,!0),document.addEventListener("keydown",E),()=>{document.removeEventListener("mousedown",k,!0),document.removeEventListener("keydown",E)}},[c]);const b=k=>t.filter(E=>kl[E.position].side===k),p=k=>new Set(b(k).map(E=>E.other)).size,x=p("left"),S=p("right");if(x===0&&S===0)return null;const v=(k,E)=>{const T=E?.getBoundingClientRect();T&&(Dt(g),l(k),f({x:T.left,y:T.bottom+2}))},w=(k,E,T)=>{const D=c===k;return u.jsx("button",{ref:T,"data-relation-bar":!0,"data-no-drag":!0,disabled:E===0,"aria-label":k==="left"?`${E} classes ${e} belongs to`:`${E} classes ${e} owns`,onMouseEnter:()=>E>0&&v(k,T.current),onMouseLeave:Sl,onClick:P=>{P.stopPropagation(),E!==0&&(D?Dt(null):v(k,T.current))},className:`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] leading-none
                    tabular-nums transition-colors
                    ${E===0?"text-gray-300 dark:text-slate-600 cursor-default":D?"bg-sky-200 dark:bg-sky-800 text-sky-900 dark:text-sky-100":"text-sky-800 dark:text-sky-200 hover:bg-sky-100 dark:hover:bg-sky-900"}`,children:k==="left"?u.jsxs(u.Fragment,{children:[u.jsx("span",{"aria-hidden":!0,children:"←"}),E]}):u.jsxs(u.Fragment,{children:[E,u.jsx("span",{"aria-hidden":!0,children:"→"})]})})};return u.jsxs(u.Fragment,{children:[w("left",x,d),u.jsx("span",{className:`flex-1 min-w-0 text-center text-[9px] text-gray-400
                       dark:text-slate-500 truncate select-none`,children:"related"}),w("right",S,m),c&&h&&jr.createPortal(u.jsx(lm,{anchor:h,side:c,label:e,rows:b(c),onAdd:n,onRemove:i,onInspect:s,colorOf:r,slotOrder:o,parentOf:a}),document.body)]})}function am(e){const t=y.useRef(null),[n,i]=y.useState(e);return y.useEffect(()=>{const s=t.current;if(!s)return;const r=s.getBoundingClientRect(),o=8;i({x:Math.max(o,Math.min(e.x,window.innerWidth-r.width-o)),y:Math.max(o,Math.min(e.y,window.innerHeight-r.height-o))})},[e]),{ref:t,pos:n}}function lm({anchor:e,side:t,label:n,rows:i,onAdd:s,onRemove:r,onInspect:o,colorOf:a,slotOrder:c,parentOf:l}){const{ref:h,pos:f}=am(e),d=w=>{const k=c?.indexOf(w.slot)??-1;return k===-1?Number.MAX_SAFE_INTEGER:k},m=[...i].sort((w,k)=>d(w)-d(k)||w.other.localeCompare(k.other)||w.slot.localeCompare(k.slot)),g=new Map,b=new Set;if(l){const w=new Map(m.map(k=>[`${k.slot}|${k.other}`,k]));for(const k of m){const E=l(k.other),T=E===void 0?void 0:w.get(`${k.slot}|${E}`);if(!T||T===k)continue;b.add(k);const D=`${k.slot}|${E}`;g.set(D,[...g.get(D)??[],k])}}const p=[],x=(w,k)=>{p.push({row:w,depth:k});for(const E of g.get(`${w.slot}|${w.other}`)??[])x(E,k+1)};for(const w of m)b.has(w)||x(w,0);const S=m.every(w=>w.drawn),v=[...new Set(m.map(w=>w.other))];return u.jsxs("div",{ref:h,"data-relation-bar":!0,onMouseEnter:js,onMouseLeave:Sl,style:{left:f.x,top:f.y},className:`fixed z-50 w-max max-w-[min(46rem,calc(100vw-2rem))] max-h-[60vh]
                 overflow-y-auto overflow-x-hidden py-1
                 rounded-md border border-gray-300 dark:border-slate-600
                 bg-white dark:bg-slate-800 shadow-xl
                 text-gray-900 dark:text-gray-100`,children:[u.jsx("div",{className:"px-3 py-1 border-b border-gray-200 dark:border-slate-700",children:u.jsxs("div",{className:"text-[11px] font-semibold",children:[u.jsx("b",{children:n})," ",t==="left"?"belongs to":"owns"," ",v.length," ",v.length===1?"entity":"distinct entities",m.length!==v.length&&u.jsxs("span",{className:"font-normal text-gray-500 dark:text-slate-400",children:[" ","through ",m.length," attributes"]})]})}),u.jsx("button",{onClick:()=>v.forEach(w=>S?r(w):s(w)),className:`block w-full text-left px-3 py-1 text-[11px]
                   text-blue-600 dark:text-blue-400
                   hover:bg-gray-100 dark:hover:bg-slate-700`,children:S?`hide all ${v.length} entities`:`add all ${v.length} entities`}),u.jsx("table",{className:"w-full text-[11px]",children:u.jsx("tbody",{children:p.map(({row:w,depth:k})=>{const E=kl[w.position].kind,T=k>0&&u.jsx("span",{"aria-hidden":!0,className:"text-gray-400 dark:text-slate-500 select-none",style:{paddingLeft:`${(k-1)*.75}rem`},children:"↳ "}),D=w.declaredBy===w.other?n:w.declaredBy,P=t==="left"?w.other:D,N=t==="left"?D:w.other;return u.jsxs("tr",{"data-family-depth":k,className:"hover:bg-gray-100 dark:hover:bg-slate-700",children:[u.jsx("td",{className:"pl-2 pr-1 py-0.5",children:u.jsx("button",{onClick:F=>{F.stopPropagation(),(w.drawn?r:s)(w.other)},"aria-label":w.drawn?`Remove ${w.other} from the diagram`:`Add ${w.other} to the diagram`,className:`w-4 h-4 rounded-sm leading-none text-[11px]
                                flex items-center justify-center border
                                ${w.drawn?"border-sky-300 bg-sky-50 text-sky-700 hover:bg-sky-200 dark:border-sky-700 dark:bg-sky-950 dark:text-sky-300":"border-gray-300 text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:border-slate-600 dark:hover:bg-slate-600"}`,children:w.drawn?"−":"+"})}),u.jsxs("td",{className:"pl-1 pr-2 py-0.5 text-right whitespace-nowrap",children:[t==="left"&&T,u.jsx(pr,{cls:P,row:w,colorOf:a,onInspect:o})]}),u.jsx("td",{className:`px-2 py-0.5 font-mono text-gray-400 dark:text-slate-500
                               whitespace-nowrap tabular-nums text-right`,children:w.cardinality}),u.jsx("td",{className:"px-1 py-0.5 align-middle",children:u.jsx(Nn,{kind:E,width:30})}),u.jsxs("td",{className:"pr-3 py-0.5 whitespace-nowrap",children:[t==="right"&&T,u.jsx(pr,{cls:N,row:w,colorOf:a,onInspect:o})]})]},`${w.declaredBy}.${w.slot}->${w.other}`)})})})]})}function pr({cls:e,row:t,colorOf:n,onInspect:i}){const s=n?.(e),r=e===t.declaredBy,o=s?{color:s.text}:void 0;return u.jsxs("span",{className:"font-mono",children:[i?u.jsx("button",{onClick:a=>{a.stopPropagation(),i(e)},title:`Open ${e}'s details`,className:"hover:underline",style:o,children:e}):u.jsx("span",{style:o,children:e}),r&&u.jsxs("span",{className:s?"opacity-80":"text-gray-500 dark:text-slate-400",style:o,children:[".",t.slot]})]})}const De={sibs:!0,dir:"RIGHT",merge:"near",legend:!1,cases:!1},Tl=["legend","cases"];function cm(e,t){if(e.get("panels")!=="0")return t;for(const n of Tl)t[n]=!1;return t.detail=null,t}const Mt={dir:"explore-nl-dir",merge:"explore-nl-merge",sibs:"explore-nl-sibs"},Hn="~",hm=["exp","hidden","owners"],um=["tour"];let Vt;function dm(e=window.location.search){return Vt===void 0&&(Vt=new URLSearchParams(e).get("tour")==="1"),Vt}function fm(e,t){const n=e.get(t);return n?n.split(Hn).filter(Boolean):[]}function Cl(e){const t=e.get("cat");if(!t)return[];const n=t.split(new RegExp(`[,${Hn}]`)).filter(Boolean);return[...new Set(n.flatMap(i=>{const s=Lr.find(r=>r.id===i);return s?Vr(s):[]}))]}function cn(e){try{return localStorage.getItem(e)}catch{return null}}function pm(e,t){try{localStorage.setItem(e,t)}catch{}}function hn(e,t){return e&&t.includes(e)?e:null}function He(e=window.location.search){const t=new URLSearchParams(e),n=hn(t.get("dir"),["RIGHT","DOWN"])??hn(cn(Mt.dir),["RIGHT","DOWN"])??De.dir,i=hn(t.get("merge"),["near","far","bend","off"])??hn(cn(Mt.merge),["near","far","bend","off"])??De.merge,s=t.has("sibs")?t.get("sibs")==="1":cn(Mt.sibs)!==null?cn(Mt.sibs)!=="0":De.sibs,r=fm(t,"sel"),o=cm(t,{legend:t.get("legend")==="1",cases:t.get("cases")==="1",detail:t.get("detail")||null});return t.has("legend")&&(o.legend=t.get("legend")==="1"),t.has("cases")&&(o.cases=t.get("cases")==="1"),t.has("detail")&&(o.detail=t.get("detail")||null),{sel:r.length?r:Cl(t),detail:o.detail,roots:t.get("roots")==="1",sibs:s,dir:n,merge:i,legend:o.legend,cases:o.cases}}function Al(e,{push:t=!1}={}){const n=new URL(window.location.href),i=n.searchParams,s=(o,a)=>{a.length===0?i.delete(o):i.set(o,[...a].sort().join(Hn))},r=(o,a,c)=>{c?i.delete(o):i.set(o,a)};for(const o of hm)i.delete(o);Vt===void 0&&i.has("tour")&&(Vt=i.get("tour")==="1");for(const o of um)i.delete(o);s("sel",e.sel),e.detail?i.set("detail",e.detail):i.delete("detail"),r("roots","1",!e.roots),r("sibs",e.sibs?"1":"0",e.sibs===De.sibs),r("dir",e.dir,e.dir===De.dir),r("merge",e.merge,e.merge===De.merge),r("legend","1",e.legend===De.legend),r("cases","1",e.cases===De.cases),i.delete("panels"),i.delete("cat"),t?window.history.pushState(null,"",n):window.history.replaceState(null,"",n)}function mr(e,t){pm(Mt[e],typeof t=="boolean"?t?"1":"0":String(t))}function mm(e,t=window.location.href){const n=new URL(t),i=new URLSearchParams,s=(r,o)=>i.set(r,o);return e.sel.length&&s("sel",[...e.sel].sort().join(Hn)),e.detail&&s("detail",e.detail),e.roots&&s("roots","1"),e.sibs!==De.sibs&&s("sibs",e.sibs?"1":"0"),e.dir!==De.dir&&s("dir",e.dir),e.merge!==De.merge&&s("merge",e.merge),e.legend!==De.legend&&s("legend","1"),e.cases!==De.cases&&s("cases","1"),n.search=i.toString(),n.toString()}const Te=240,lt=30,gm=.6,ct=20,ym=1/0,Ls=22,Pl=18,ft=28;function El(e,t,n=()=>!1){const i=new Map;for(const s of e){if(n(s.other))continue;const r=s.position,o=i.get(r)??new Map,a=o.get(s.other)??[];a.includes(s.slot)||a.push(s.slot),o.set(s.other,a),i.set(r,o)}return cc.filter(s=>i.has(s)).map(s=>{const r=[...i.get(s)].map(([o,a])=>({other:o,slots:a,drawn:t(o)})).sort((o,a)=>o.other.localeCompare(a.other));return{position:s,label:hc(s,r.length),items:r}})}function Dl(e,t,n=()=>!1){const i=new Set,s=[];for(const r of e){if(n(r.other))continue;const o=`${r.declaredBy}.${r.slot}->${r.other}:${r.position}`;i.has(o)||(i.add(o),s.push({other:r.other,position:r.position,slot:r.slot,declaredBy:r.declaredBy,cardinality:r.cardinality,drawn:t(r.other)}))}return s}function ce(e){return e.storageDirection==="flipped"?e.target:e.source}function Zi(e){return e.anchorClass??ce(e)}function bm(e,t,n,i,s){const r=new Map,o=new Map,a=[],c=new Set;for(const d of e.edges)d.type==="isa"?(r.set(d.target,[...r.get(d.target)??[],d.source]),o.set(d.source,(o.get(d.source)??0)+1)):d.isLoop||(a.push(d),c.add(`${ce(d)}|${d.slotName}`));const l=new Set(e.nodes.map(d=>d.id)),h=e.nodes.map(d=>{const m=new Map(n(d.id).map((O,$)=>[O.name,$])),g=(O,$)=>(m.get(O.slot)??Number.MAX_SAFE_INTEGER)-(m.get($.slot)??Number.MAX_SAFE_INTEGER),b=d.slots.map(O=>({...O,connected:O.isLoop||c.has(`${d.id}|${O.slot}`),rangeColor:i(O.range),targetColor:s(O.range)})).sort(g),p=new Set(b.map(O=>O.slot)),x=n(d.id).filter(O=>!p.has(O.name)).map(O=>({slot:O.name,range:O.range,channel:"plain",flipped:!1,cardinality:oc(O.required,O.multivalued),isLoop:!1,connected:!1,rangeColor:i(O.range)})),S=b.filter(O=>O.connected),v=[...b.filter(O=>!O.connected),...x].sort(g),w=[...S,...v].slice(0,Math.max(ym,S.length)),k=w.length===S.length+v.length,E=t.has(d.id)||k,T=E?[...S,...v]:w,D=k?0:S.length+v.length-w.length,P=e.hiddenOwners.get(d.id)??[],N=e.hiddenOwned.get(d.id)??[],F=El(d.relations,O=>l.has(O),O=>O===d.id),B=Dl(d.relations,O=>l.has(O),O=>O===d.id);return{...d,isaParents:r.get(d.id)??[],subclassCount:o.get(d.id)??0,members:[],hiddenOwners:P,hiddenOwned:N,relationGroups:F,relationRows:B,...Ml(F),rows:T,allRows:[...S,...v],hiddenCount:D,expanded:E,height:Ol(T.length,D,F.length>0)}}),f=new Map;for(const d of a){const m=ce(d)===d.source?d.target:d.source,g=s(m);g&&f.set(d.id,g)}return{nodes:h,edges:a,edgeColors:f}}function Ml(e){const t=new Map;for(const n of e)for(const i of n.items)t.set(i.other,(t.get(i.other)??!1)||i.drawn);return{relatedCount:t.size,shownCount:[...t.values()].filter(Boolean).length}}function Ol(e,t,n){return lt+(n?Ls:0)+e*ct+(t?Pl:0)+(e?5:0)}function wm(e,t,n,i,s,r,o){const a=rc(e.nodes.map(x=>x.id),t,n);if(!a.size)return e;const c=new Map(e.nodes.map(x=>[x.id,x])),l=new Set(e.nodes.map(x=>x.id)),h=new Map,f=[],d=new Map;for(const[x,S]of a){const v=uc(x),w=S.map(j=>({id:j,label:c.get(j)?.label??j,color:ac(o(j))}));for(const j of w)h.set(j.id,v);const k=c.has(x);k&&h.set(x,v);const E=new Map(w.map(j=>[j.id,j])),T=new Map,D=k?[x,...S]:S;for(const j of D){const Y=c.get(j);if(!Y)continue;const ve=j===x;for(const ne of Y.allRows){const Me=i(j,ne.slot),Oe=Me!==void 0&&Me!==j,Ae=`${ve||Oe?Me??x:j}|${ne.slot}`,ke=T.get(Ae),q=E.get(j),Q=ve||Oe?ke?.owners??[]:[...ke?.owners??[],...q?[q]:[]];T.set(Ae,{...ke??ne,connected:(ke?.connected??!1)||ne.connected,owners:Q,declaringClass:Ae.slice(0,Ae.indexOf("|"))})}}const P=new Map;for(const j of T.values())if(j.targetColor)for(const Y of j.owners??[])P.has(Y.id)||P.set(Y.id,j.targetColor);for(const j of w){const Y=P.get(j.id);Y&&(j.color=Y)}for(const[j,Y]of T)Y.targetColor&&d.set(`${v}|${j}`,Y.targetColor);const N=[...T.values()],F=j=>{const Y=j.owners?.length?j.owners[0].id:x;return r(Y,j.slot)};N.sort((j,Y)=>F(j)-F(Y));const B=lc(N,w,j=>({slot:`::hdr:${j.id}`,range:"",channel:"plain",flipped:!1,cardinality:"",isLoop:!1,connected:!1,rangeColor:"",header:j})),O=j=>!h.has(j)&&!D.includes(j),$=[...new Set(D.flatMap(j=>c.get(j)?.hiddenOwners??[]))].filter(O),C=[...new Set(D.flatMap(j=>c.get(j)?.hiddenOwned??[]))].filter(O),U=El(D.flatMap(j=>c.get(j)?.relations??[]),j=>l.has(j),j=>!O(j)),xe=Dl(D.flatMap(j=>c.get(j)?.relations??[]),j=>l.has(j),j=>!O(j)),L=c.get(S[0]),W=s(x);f.push({...L,id:v,label:x,description:W.description,abstract:W.abstract,slots:[],members:w,role:D.some(j=>c.get(j)?.role==="selected")?"selected":"context",layer:Math.min(...D.map(j=>c.get(j)?.layer??0)),isaParents:[],subclassCount:w.length,hiddenOwners:$,hiddenOwned:C,relationGroups:U,relationRows:xe,...Ml(U),rows:B,allRows:N,hiddenCount:0,expanded:!0,height:Ol(B.length,0,U.length>0)})}const m=[...e.nodes.filter(x=>!h.has(x.id)),...f],g=new Set,b=e.edges.map(x=>({...x,source:h.get(x.source)??x.source,target:h.get(x.target)??x.target,entityMember:(()=>{if(x.inducedFrom!==void 0)return;const S=ce(x)===x.source?x.target:x.source;return h.has(S)?S:void 0})(),anchorClass:h.has(ce(x))?i(ce(x),x.slotName)??ce(x):ce(x)})).filter(x=>{if(!Ci(x.source)&&!Ci(x.target))return!0;const S=`${x.source}|${x.target}|${x.anchorClass}|${x.slotName}|${x.storageDirection}`;return g.has(S)?!1:(g.add(S),!0)}).filter(x=>x.source!==x.target),p=new Map(e.edgeColors);for(const x of b){const S=d.get(`${ce(x)}|${Zi(x)}|${x.slotName}`);S&&p.set(x.id,S)}return{nodes:m,edges:b,edgeColors:p}}function xm({title:e}){return u.jsxs("svg",{viewBox:"0 0 16 16",width:"15",height:"15","aria-hidden":"false",className:"shrink-0",style:{color:Pt.entity},children:[u.jsx("title",{children:e}),u.jsx("path",{d:"M12.33 10.5 A5 5 0 1 1 12.33 5.5",fill:"none",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round"}),u.jsx("path",{d:"M13.7 7.9 L10.6 6.7 L13.7 4.2 Z",fill:"currentColor"})]})}function Rl(e){return lt+(e.relationGroups.length>0?Ls:0)}function jl(e,t,n){const i=e.rows.findIndex(s=>s.slot===t&&!s.header&&(!n||!s.declaringClass||s.declaringClass===n));if(i<0)throw new Error(`No displayed row for ${t} on ${e.id}`);return Rl(e)+i*ct+ct/2}function vm(e,t){const n=e.rows.findIndex(i=>i.header?.id===t);if(!(n<0))return Rl(e)+n*ct+ct/2}function Ji(e,t){if(e.storageDirection==="flipped"||!t.members.length)return;const n=e.entityMember;return n&&t.members.some(i=>i.id===n)?n:void 0}const km=4,Sm=10,Tm=ie.head.span,gr=ie.head.len,Cm=ie.gap,Am=ie.secondaryScale,Ll=ie.stroke.own,Nl=ie.stroke.ownHover,Pm=Ll*ie.stroke.refFactor,Em=Nl*ie.stroke.refFactor;function yr(e,t){return e?t?we.ownBkwd:we.ownFwd:we.association}function ci(e,t){if(e==="off"||t.length<2)return 0;if(e==="near")return 40;if(e==="far")return 120;const n=t[t.length-1],i=t[t.length-2];return Math.hypot(n.x-i.x,n.y-i.y)}function br(e,t){return e<2?0:Math.min(km,t/(e-1))}function Dm(e,t){const n=new Map,i=(l,h,f,d)=>{const m=n.get(l.id)??[];return m.some(g=>g.id===h)||(m.push({id:h,x:f,y:d}),n.set(l.id,m)),h},s=new Map(e.nodes.map(l=>[l.id,l])),r=l=>{const h=s.get(ce(l)===l.source?l.target:l.source);return!!h&&Ji(l,h)!==void 0},o=new Map;for(const l of e.edges){if(r(l))continue;const h=ce(l)===l.source?l.target:l.source,f=`${h}|${h===l.source?"out":"in"}`;o.set(f,(o.get(f)??0)+1)}const a=new Map,c=e.edges.map(l=>{const h=s.get(ce(l)),f=s.get(ce(l)===l.source?l.target:l.source);if(!h||!f)throw new Error(`Edge ${l.id} endpoint missing from subgraph`);const d=l.storageDirection==="flipped",m=jl(h,l.slotName,Zi(l)),g=i(h,`${h.id}::row:${Zi(l)}|${l.slotName}`,d?0:Te,m),b=f.id===l.source,p=`${f.id}|${b?"out":"in"}`,x=Ji(l,f),S=x!==void 0?vm(f,x):void 0;let v;if(x!==void 0&&S!==void 0)v=i(f,`${f.id}::mhdr:${b?"out":"in"}:${x}`,t==="RIGHT"?b?Te:0:Te/2,t==="RIGHT"?S:b?f.height:0);else{const w=o.get(p)??1,k=a.get(p)??0;a.set(p,k+1);const E=br(w,lt-4),T=lt/2+(k-(w-1)/2)*E;v=t==="RIGHT"?i(f,`${f.id}::hdr:${b?"out":"in"}:${k}`,b?Te:0,T):i(f,`${f.id}::hdr:${b?"out":"in"}:${k}`,Te/2+(k-(w-1)/2)*br(w,Te/2),b?f.height:0)}return{id:l.id,source:l.source,target:l.target,sourcePort:d?v:g,targetPort:d?g:v}});return{nodes:e.nodes.map(l=>({id:l.id,width:Te,height:l.height,partition:l.layer,ports:n.get(l.id)})),edges:c}}function Mm(e,t){if(!e?.length)return e;const n=e[0],i=n.bendPoints?.length?n.bendPoints[n.bendPoints.length-1]:n.startPoint,s=n.endPoint.x-i.x,r=n.endPoint.y-i.y,o=Math.hypot(s,r);if(o<1)return e;const a=Math.min(t,o*.8)/o,c={x:n.endPoint.x-s*a,y:n.endPoint.y-r*a};return[{...n,endPoint:c},...e.slice(1)]}function Om(e,t){if(!e?.length)return e;const n=e[0],i=n.bendPoints?.length?n.bendPoints[0]:n.endPoint,s=i.x-n.startPoint.x,r=i.y-n.startPoint.y,o=Math.hypot(s,r);if(o<1)return e;const a=Math.min(t,o*.8)/o,c={x:n.startPoint.x+s*a,y:n.startPoint.y+r*a};return[{...n,startPoint:c},...e.slice(1)]}function Rm({dataService:e,selectedIds:t,onNodeClick:n,onAdd:i,onRemove:s,pathToRoot:r=!1,onTogglePathToRoot:o,direction:a,setDirection:c,mergeMode:l,setMergeMode:h}){const f=y.useId().replace(/[^a-zA-Z0-9]/g,""),d=A=>`${A}-${f}`,[m,g]=y.useState(new Set),b=y.useMemo(()=>e.getOwnershipSubgraph([...t].sort(),{pathToRoot:r}),[e,t,r]),p=y.useCallback(A=>e.getTargetColor(A),[e]),x=y.useMemo(()=>new Map(b.nodes.map(A=>[A.id,e.getClassSummary(A.id)?.slots??[]])),[e,b]),S=y.useMemo(()=>bm(b,m,A=>x.get(A)??[],A=>e.getRangeColor(A),A=>e.getTargetColor(A)),[b,m,x,e]),v=y.useMemo(()=>new Map(b.nodes.map(A=>[A.id,e.getClassSummary(A.id)])),[e,b]),w=y.useMemo(()=>{const A=M=>v.get(M)?.parentId,R=M=>!dc.has(M),V=(M,_)=>M.range===_.range&&M.multivalued===_.multivalued;return wm(S,A,R,(M,_)=>{const z=e.getClassSummary(M)?.slots.find(he=>he.name===_);if(!z)return;if(!z.inheritedFrom)return M;const Z=e.getClassSummary(z.inheritedFrom)?.slots.find(he=>he.name===_);return Z&&V(z,Z)?z.inheritedFrom:M},M=>{const _=e.getClassSummary(M);return{description:_?.description??"",abstract:_?.isAbstract??!1}},(M,_)=>{const z=e.getClassSummary(M)?.slots.findIndex(Z=>Z.name===_)??-1;return z<0?Number.MAX_SAFE_INTEGER:z},M=>e.siblingColorIndexOf(M))},[S,v,e]),[k,E]=y.useState(new Map),[T,D]=y.useState(new Map),P=y.useMemo(()=>Dm(w,a),[w,a]),{latest:N,inProgress:F}=zp(P,{direction:a,usePartitions:!0,nodeSpacing:28,layerSpacing:72,extraLayoutOptions:{"elk.spacing.edgeNode":"18","elk.spacing.edgeEdge":"12","elk.layered.spacing.edgeNodeBetweenLayers":"18","elk.layered.spacing.edgeEdgeBetweenLayers":"10"}}),B=N?.spec===P?N.layout:null,O=N?.layout??null,$=nm(),C=(O?.width??0)+ft*2,U=(O?.height??0)+ft*2;y.useEffect(()=>{B&&($.setContentSize(C,U),$.isAutoFit()&&$.zoomToFit())},[B,C,U]),y.useEffect(()=>E(new Map),[B]),y.useEffect(()=>D(new Map),[B]);const[xe,L]=y.useState(!1),W=y.useRef(!0);y.useEffect(()=>{if(!B){L(!1),O||(W.current=!0);return}const A=W.current?0:tm();if(W.current=!1,A===0){L(!0);return}const R=setTimeout(()=>L(!0),A);return()=>clearTimeout(R)},[B,O]);const j=y.useRef(new Map),Y=y.useRef(!1),ve=y.useRef(k);ve.current=k;const ne=y.useMemo(()=>{const A=new Map((O?.nodes??[]).map(V=>[V.id,V])),R=new Map(T);for(const[V,H]of k)R.set(V,H);for(const[V,{dx:H,dy:K}]of R){const X=A.get(V);X&&A.set(V,{...X,x:X.x+H,y:X.y+K})}return j.current=A,A},[O,k,T]),[Me,Oe]=y.useState(!1);y.useEffect(()=>{if(!F){Oe(!1);return}const A=setTimeout(()=>Oe(!0),Yp);return()=>clearTimeout(A)},[F]);const Ae=y.useCallback((A,R)=>{if(R.button!==0||R.target.closest('button, a, [role="button"], [data-no-drag]'))return;R.stopPropagation();const V=R.clientX,H=R.clientY,K=$.getZoom()||1,X=k.get(A)??{dx:0,dy:0},M=R.currentTarget;M.setPointerCapture(R.pointerId);let _=!1;const z=he=>{const Ee=(he.clientX-V)/K,Ne=(he.clientY-H)/K;!_&&Math.hypot(Ee,Ne)<3||(_=!0,Y.current=!0,E(et=>new Map(et).set(A,{dx:X.dx+Ee,dy:X.dy+Ne})))},Z=he=>{if(M.releasePointerCapture(he.pointerId),M.removeEventListener("pointermove",z),M.removeEventListener("pointerup",Z),_){const Ee=ve.current.get(A);Ee&&D(Ne=>new Map(Ne).set(A,Ee))}};M.addEventListener("pointermove",z),M.addEventListener("pointerup",Z)},[k]),ke=y.useMemo(()=>new Map(w.nodes.map(A=>[A.id,A.role])),[w]),q=y.useMemo(()=>new Map(w.edges.map(A=>[A.id,A])),[w]),Q=y.useMemo(()=>{const A=new Map(w.nodes.map(R=>[R.id,R]));return new Set(w.edges.filter(R=>{const V=A.get(ce(R)===R.source?R.target:R.source);return!!V&&Ji(R,V)!==void 0}).map(R=>R.id))},[w]),te=y.useMemo(()=>{const A=new Map;if(!B)return A;for(const R of w.edges){const V=ce(R)===R.source?R.target:R.source,H=ne.get(V);if(!H||Q.has(R.id))continue;const K=V===R.source,X=`${V}|${K?"out":"in"}`;if(A.has(X))continue;const M=K,_=Cm+gr;A.set(X,a==="RIGHT"?{base:{x:M?H.x+Te+_:H.x-_,y:H.y+lt/2},dir:{x:M?-1:1,y:0}}:{base:{x:H.x+Te/2,y:M?H.y+H.height+_:H.y-_},dir:{x:0,y:M?-1:1}})}return A},[w,ne,B,a,Q]),re=y.useMemo(()=>{const A=new Map,R=new URLSearchParams(window.location.search).has("dbg"),V=new Set([...T.keys(),...k.keys()]);if(!B||V.size===0)return A;R&&console.log(`[drag] moved: ${[...V].join(", ")}`);const H=new Map(w.nodes.map(K=>[K.id,K]));for(const K of w.edges){const X=ce(K),M=X===K.source?K.target:K.source;if(!V.has(X)&&!V.has(M))continue;const _=ne.get(X),z=ne.get(M),Z=H.get(X);if(!_||!z||!Z)continue;const he=K.storageDirection==="flipped",Ee=a==="RIGHT";let Ne;try{Ne=jl(Z,K.slotName)}catch{R&&console.log(`   SKIP ${X}.${K.slotName}: row not displayed`);continue}const et=Ee?{x:_.x+(he?0:Te),y:_.y+Ne}:{x:_.x+Te/2,y:_.y+Ne},Ke=Ee?{x:he?-1:1,y:0}:{x:0,y:1},dt=M===K.source,Yt=Ee?{x:dt?z.x+Te:z.x,y:z.y+lt/2}:{x:z.x+Te/2,y:dt?z.y+z.height:z.y},Wn=Ee?{x:dt?1:-1,y:0}:{x:0,y:dt?1:-1};A.set(K.id,Hp(et,Yt,Ke,Wn)),R&&console.log(`   reroute ${X}.${K.slotName} -> ${M}`)}return R&&console.log(`[drag] rerouted ${A.size} edge(s)`),A},[B,k,T,w,ne,a]);y.useEffect(()=>{if(!B||!new URLSearchParams(window.location.search).has("dbg"))return;const A=new Map;for(const R of B.edges){const V=q.get(R.id);if(!V)continue;const H=rn(R.sections);if(H.length<2)continue;const K=ce(V)===V.source?V.target:V.source;let X=0,M=0;for(let z=1;z<H.length;z++){const Z=Math.abs(H[z].x-H[z-1].x),he=Math.abs(H[z].y-H[z-1].y);Z>.5&&he>.5&&M++,z>1&&X++}const _=ce(V);A.set(K,[...A.get(K)??[],`${_}.${V.slotName}  pts=${H.length} bends=${X}${M?` DIAGONAL x${M}`:""}  start=(${Math.round(H[0].x)},${Math.round(H[0].y)}) end=(${Math.round(H[H.length-1].x)},${Math.round(H[H.length-1].y)})`])}for(const[R,V]of A){if(V.length<2)continue;console.log(`
=== approaches to ${R} (${V.length}) ===`);const H=ne.get(R);H&&console.log(`   box at (${Math.round(H.x)},${Math.round(H.y)}) h=${Math.round(H.height)}`),V.forEach(K=>console.log("   "+K))}},[B,q,ne]);const Se=y.useMemo(()=>{const A=new Map;if(!B)return A;for(const R of B.edges){const V=q.get(R.id);if(!V||V.storageDirection==="flipped"||Q.has(R.id)||ci(l,rn(R.sections))<=0)continue;const H=ce(V)===V.source?V.target:V.source,K=`${H}|${H===V.source?"out":"in"}`,X=te.get(K);if(!X)continue;const M=V.type==="ownership",_=ke.get(V.source)==="context"||ke.get(V.target)==="context",z=w.edgeColors.get(R.id),Z=A.get(K);A.set(K,Z?{...Z,isOwn:Z.isOwn||M,dimmed:Z.dimmed&&_,edgeIds:[...Z.edgeIds,R.id],...Z.color?.text===z?.text?{}:{color:void 0}}:{...X,isOwn:M,dimmed:_,edgeIds:[R.id],...z?{color:z}:{}})}return A},[B,q,te,l,ke,w,Q]),$e=y.useMemo(()=>new Set(w.nodes.map(A=>A.id)),[w]),Pe=y.useCallback(A=>!!i&&A.channel!=="plain"&&!A.isLoop&&!$e.has(A.range),[i,$e]),Tt=y.useRef(null),Je=y.useRef(null),G=y.useRef(void 0),se=y.useMemo(()=>{const A=new Map,R=new Map;for(const V of w.edges){R.set(V.id,[V.source,V.target]);for(const H of[V.source,V.target])A.set(H,[...A.get(H)??[],V.id])}return{nodeEdges:A,edgeEnds:R}},[w]),de=y.useRef(se);de.current=se;const ae=y.useCallback(A=>{G.current=A,Je.current===null&&(Je.current=requestAnimationFrame(()=>{Je.current=null;const R=G.current;G.current=void 0;const V=Tt.current,H=$.wrapperRef.current;if(R===void 0||!V||!H)return;let K=null,X=null;if(R){const{nodeEdges:_,edgeEnds:z}=de.current;if(R.kind==="node"){K=new Set(_.get(R.id)??[]),X=new Set([R.id]);for(const Z of K)for(const he of z.get(Z)??[])X.add(he)}else K=new Set([R.id]),X=new Set(z.get(R.id)??[])}const M=(_,z,Z)=>{_.style.filter=z===null||z?"":`opacity(${Z})`};V.querySelectorAll("path[data-edge-id]").forEach(_=>{const z=_.dataset.edgeId??"",Z=K?K.has(z):null;M(_,Z,.38),_.style.strokeWidth=Z?String(_.dataset.channel==="reference"?Em:Nl):""}),V.querySelectorAll("path[data-arrowhead]").forEach(_=>{const z=(_.dataset.arrowhead??"").split(" ");M(_,K?z.some(Z=>K.has(Z)):null,.08)}),H.querySelectorAll("[data-node-id]").forEach(_=>{M(_,X?X.has(_.dataset.nodeId??""):null,.25)})}))},[]);y.useEffect(()=>ae(null),[w,B,ae]);const tc=A=>g(R=>{const V=new Set(R);return V.has(A)?V.delete(A):V.add(A),V}),Ws=A=>{mr("dir",A),c(A)},qt=A=>{mr("merge",A),h(A)},Qt=e.getConceptLabel("attribute",!0).toLowerCase(),Ue=A=>`px-2 py-0.5 text-xs rounded border ${A?"border-blue-500 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300":"border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700"}`;return u.jsxs("div",{className:"relative w-full h-full",children:[u.jsxs("div",{"data-pan-ignore":!0,className:"absolute top-2 right-2 z-10 flex gap-1 items-center",children:[Me&&u.jsxs("div",{className:`mr-2 flex items-center gap-2 rounded px-2 py-1
                          text-xs text-gray-500 dark:text-gray-400
                          bg-white/80 dark:bg-slate-900/80 shadow-sm`,children:[u.jsx("span",{className:`inline-block h-3 w-3 animate-spin rounded-full
                             border-2 border-gray-300 border-t-gray-600
                             dark:border-slate-600 dark:border-t-slate-300`}),"Computing layout…"]}),o&&u.jsxs(u.Fragment,{children:[u.jsx("button",{className:Ue(r),title:r?"Hide owners: show only what you selected":"Show every owner up to the root (can pull in most of the schema)",onClick:o,children:"⇱ roots"}),u.jsx("span",{className:"w-px h-4 bg-gray-300 dark:bg-slate-600 mx-1"})]}),u.jsx("button",{className:Ue(a==="RIGHT"),title:"Layout left to right",onClick:()=>Ws("RIGHT"),children:"LR"}),u.jsx("button",{className:Ue(a==="DOWN"),title:"Layout top down",onClick:()=>Ws("DOWN"),children:"TB"}),u.jsx("span",{className:"w-px h-4 bg-gray-300 dark:bg-slate-600 mx-1"}),u.jsx("button",{className:Ue(l==="near"),title:"Merge converging edges near the node (~40px)",onClick:()=>qt("near"),children:"⋙"}),u.jsx("button",{className:Ue(l==="far"),title:"Merge converging edges early (~120px)",onClick:()=>qt("far"),children:"⋙⋙"}),u.jsx("button",{className:Ue(l==="bend"),title:"Merge at ELK's last corner",onClick:()=>qt("bend"),children:"⌙"}),u.jsx("button",{className:Ue(l==="off"),title:"No merging — every edge runs to its own port",onClick:()=>qt("off"),children:"≡"}),u.jsx("span",{className:"w-px h-4 bg-gray-300 dark:bg-slate-600 mx-1"}),[["+",()=>$.zoomBy(1.3),"Zoom in"],["−",()=>$.zoomBy(1/1.3),"Zoom out"],["1:1",()=>$.applyZoom(1),"Reset zoom"],["⛶",()=>$.zoomToFit(),"Fit to view"]].map(([A,R,V])=>u.jsx("button",{onClick:R,title:V,className:Ue(!1),children:A},A))]}),u.jsx("div",{ref:$.containerRef,"data-graph-direction":a,className:"w-full h-full overflow-auto cursor-grab",children:u.jsx("div",{ref:$.spacerRef,children:u.jsx("div",{ref:$.wrapperRef,className:"relative",children:O&&u.jsxs(u.Fragment,{children:[u.jsxs("svg",{ref:Tt,className:"absolute top-0 left-0 pointer-events-none",width:C,height:U,children:[u.jsxs("defs",{children:[(()=>{const A=kn("forward"),{d:R,...V}=A;return u.jsx("marker",{id:d("arrow-own"),...V,children:u.jsx("path",{d:R,fill:we.ownFwd})})})(),(()=>{const{d:A,...R}=kn("backward");return u.jsx("marker",{id:d("arrow-own-back"),...R,children:u.jsx("path",{d:A,fill:we.ownBkwd})})})(),(()=>{const{d:A,...R}=kn("forward",Am);return u.jsx("marker",{id:d("arrow-assoc"),...R,children:u.jsx("path",{d:A,fill:we.association})})})()]}),u.jsxs("g",{transform:`translate(${ft}, ${ft})`,style:{opacity:xe?1:0,transition:`opacity ${em()}ms`},children:[[...Se].map(([A,R])=>u.jsx("path",{"data-arrowhead":R.edgeIds.join(" "),d:_p(R.base,R.dir,Tm,gr),fill:R.color?.text??yr(R.isOwn,!1),opacity:R.dimmed?.4:1,style:{transition:`filter ${ln()}ms`}},`head-${A}`)),(B?.edges??[]).map(A=>{const R=q.get(A.id);if(!R)throw new Error(`Routed edge ${A.id} missing from view model`);const V=R.storageDirection==="flipped",H=ce(R)===R.source?R.target:R.source,K=V||Q.has(A.id)?void 0:te.get(`${H}|${H===R.source?"out":"in"}`),X=re.get(A.id),M=!!K&&ci(l,X??rn(A.sections))>0,_=R.type!=="ownership",z=M?A.sections:Mm(A.sections,cr(_?"association":"own-fwd")),Z=_?Om(z,cr("association")):z,he=X??rn(Z),Ee=Wn=>Vp(Wn,Sm),Ne=ci(l,he),et=K&&Ne>0?$p(he,K.base,Ne,Ee):Ee(he);if(!et)return null;const Ke=R.type==="ownership",dt=ke.get(A.source)==="context"||ke.get(A.target)==="context",Yt=M?void 0:Ke?V?"arrow-own-back":"arrow-own":"arrow-assoc";return u.jsxs("g",{children:[u.jsx("path",{"data-edge-id":A.id,"data-channel":Ke?"ownership":"reference",d:et,fill:"none",opacity:dt?.4:1,stroke:w.edgeColors.get(A.id)?.text??yr(Ke,V),strokeWidth:Ke?Ll:Pm,strokeDasharray:Ke?void 0:ie.dash,markerEnd:Yt?`url(#${d(Yt)})`:void 0,markerStart:!Ke&&!M?`url(#${d("arrow-assoc")})`:void 0,style:{transition:`filter ${ln()}ms, stroke-width ${ln()}ms`}}),u.jsx("path",{d:et,fill:"none",stroke:"transparent",strokeWidth:11,style:{pointerEvents:"stroke"},onMouseEnter:()=>ae({kind:"edge",id:A.id}),onMouseLeave:()=>ae(null)})]},A.id)})]})]}),u.jsx(xf,{initial:!1,children:w.nodes.map(A=>{const R=ne.get(A.id);if(!R)return null;const V=A.role==="context",H=R.x+ft,K=R.y+ft,X={duration:an(k.has(A.id)?0:vl()),ease:Xp};return u.jsxs(Dp.div,{initial:{opacity:0,x:H,y:K},animate:{opacity:V?gm:1,x:H,y:K},exit:{opacity:0,transition:{duration:an(dr())}},transition:{x:X,y:X,opacity:{duration:an(dr()),delay:an(Jp())}},"data-node-id":A.id,"data-help-id":Cc(A),"data-pan-ignore":!0,"data-pinned":T.has(A.id)?"":void 0,onPointerDown:M=>Ae(A.id,M),onClick:()=>{if(Y.current){Y.current=!1;return}n?.(A.members.length?A.label:A.id)},onMouseEnter:()=>ae({kind:"node",id:A.id}),onMouseLeave:()=>ae(null),className:`absolute rounded-md text-xs bg-white dark:bg-slate-800 cursor-pointer ${V?"border border-dashed border-gray-400 dark:border-slate-500":T.has(A.id)?"border-2 border-amber-500 dark:border-amber-400 shadow-md":"border-2 border-slate-500 dark:border-slate-400 shadow-md"}`,style:{width:Te,height:A.height,transition:`filter ${ln()}ms`},children:[u.jsxs("div",{className:"flex items-center gap-1 px-2 rounded-t-[4px] bg-slate-700 dark:bg-slate-700 text-white border-b border-slate-800 dark:border-slate-600",style:{height:lt},children:[u.jsx("span",{className:`font-semibold truncate ${A.abstract?"italic":""}`,title:A.description||A.id,children:A.label}),u.jsxs("span",{className:"ml-auto flex gap-1 shrink-0",children:[A.members.length>0&&u.jsxs("span",{title:`${A.members.length} classes that are a ${A.label}, merged into one box`,className:"text-[9px] px-1 rounded bg-sky-100 dark:bg-sky-900 text-sky-800 dark:text-sky-200",children:["⑃ ",A.members.length]}),A.isaParents.map(M=>u.jsxs("span",{title:`is-a ${M}`,className:"text-[9px] px-1 rounded bg-sky-100 dark:bg-sky-900 text-sky-800 dark:text-sky-200",children:["⊳ ",M]},M)),A.subclassCount>0&&A.members.length===0&&u.jsxs("span",{title:`${A.subclassCount} subclasses shown`,className:"text-[9px] px-1 rounded bg-sky-100 dark:bg-sky-900 text-sky-800 dark:text-sky-200",children:["▷ ",A.subclassCount]}),(()=>{const _=(A.members.length?A.members.map(z=>z.id):[A.id]).filter(z=>t.has(z));return _.length?u.jsx("button",{"data-dismiss":A.id,"data-help-id":"node-dismiss",title:_.length>1?`Remove all ${_.length} selected classes in ${A.label}`:`Remove ${A.label} from the canvas`,onClick:z=>{z.stopPropagation(),_.forEach(Z=>s?.(Z))},className:`text-[10px] leading-none px-1 rounded text-gray-400
                                         hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/40`,children:"✕"}):null})()]})]}),A.relationGroups.length>0&&u.jsx("div",{"data-help-id":"relation-bar",className:`flex items-center gap-1 px-2 border-b overflow-hidden
                                     border-gray-200 dark:border-slate-600
                                     bg-sky-50/60 dark:bg-sky-950/30`,style:{height:Ls},children:u.jsx(rm,{label:A.label,rows:A.relationRows,onAdd:M=>i?.(M),onRemove:M=>s?.(M),onInspect:n,colorOf:p,slotOrder:A.allRows.map(M=>M.slot),parentOf:M=>e.getClassSummary(M)?.parentId})}),A.rows.map(M=>M.header?u.jsx("div",{"data-no-drag":!0,"data-help-id":Sc(M.header.id),title:`${M.header.label} — is a ${A.label}; click for details`,onClick:_=>{_.stopPropagation(),n?.(M.header.id)},className:`flex items-center px-2 text-[10px] font-semibold
                                     cursor-pointer hover:brightness-110`,style:{height:ct,background:M.header.color.fill,color:sc},children:u.jsx("span",{className:"truncate",children:M.header.label})},M.slot):u.jsxs("div",{"data-help-id":Ac(A,M),"data-expandable":Pe(M)?"":void 0,"data-no-drag":Pe(M)?"":void 0,title:(M.channel==="plain"?`${M.slot}: ${M.range}`:`${M.slot} → ${M.range} (${M.cardinality})${M.flipped?" — owner side":""}`+(Pe(M)?` — click to add ${M.range}`:""))+((M.owners?.length??0)>1?`
also declared by ${M.owners.slice(1).map(_=>_.label).join(", ")}`:""),onClick:Pe(M)?_=>{_.stopPropagation(),i?.(M.range)}:void 0,className:`flex items-center gap-1.5 px-2 text-[11px] ${M.targetColor?"":M.connected?"text-gray-700 dark:text-gray-300":"text-gray-400 dark:text-gray-500"} ${Pe(M)?"cursor-pointer hover:bg-sky-50 dark:hover:bg-sky-900/30 hover:text-sky-700 dark:hover:text-sky-300":""}`,style:{height:ct,...M.targetColor?{color:M.targetColor.text}:{}},children:[u.jsx("span",{className:"w-1.5 h-1.5 rounded-full shrink-0 border",style:{borderColor:M.rangeColor,background:M.connected?M.rangeColor:"transparent"}}),u.jsx("span",{className:`truncate ${A.members.length&&!M.owners?.length?`font-semibold ${M.targetColor?"":"text-gray-900 dark:text-gray-100"}`:""}`,children:M.slot}),M.isLoop&&u.jsx(xm,{title:`self-referential: a ${M.range} can own another ${M.range} via ${M.slot}`}),u.jsxs("span",{className:"ml-auto text-[9px] truncate max-w-[90px]",children:[u.jsx("span",{style:{color:M.rangeColor},children:M.range}),u.jsxs("span",{className:"text-gray-400 dark:text-gray-500",children:[" ",M.cardinality]})]})]},M.declaringClass?`${M.declaringClass}|${M.slot}`:M.slot)),A.hiddenCount>0&&u.jsx("button",{className:"w-full text-left px-2 text-[10px] text-sky-600 dark:text-sky-400 hover:underline",style:{height:Pl},title:`${Qt} without an edge on the current canvas, plus plain (non-entity) ${Qt}`,onClick:M=>{M.stopPropagation(),tc(A.id)},children:A.expanded?`− fewer ${Qt}`:`+ ${A.hiddenCount} more ${Qt}`})]},A.id)})})]})})})})]})}function jm({classId:e,dataService:t,onClose:n,onNavigate:i,isSelected:s,onToggleSelect:r}){const o=y.useMemo(()=>t.getClassSummary(e),[e,t]),[a,c]=y.useState([]),l=y.useCallback(d=>{d!==e&&(c(m=>[...m,e]),i(d))},[e,i]),h=y.useCallback(()=>{c(d=>d.length===0?d:(i(d[d.length-1]),d.slice(0,-1)))},[i]);y.useEffect(()=>{const d=m=>{m.key==="Escape"&&n()};return window.addEventListener("keydown",d),()=>window.removeEventListener("keydown",d)},[n]);const f=t.getTypeLabel("slot",!0);return u.jsxs("aside",{className:`w-96 shrink-0 flex flex-col min-h-0 border-l border-gray-200 dark:border-slate-700
                 bg-white dark:bg-slate-900`,"aria-label":"Entity details",children:[u.jsxs("header",{className:`flex items-start gap-2 px-3 py-2 border-b border-gray-200 dark:border-slate-700
                   bg-gray-50 dark:bg-slate-800 shrink-0`,children:[a.length>0&&u.jsx("button",{onClick:h,className:"text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-sm mt-0.5",title:"Back",children:"←"}),u.jsxs("div",{className:"flex-1 min-w-0",children:[u.jsxs("div",{className:"font-semibold text-sm text-blue-700 dark:text-blue-300 break-words",children:[o?.name??e,o?.isAbstract&&u.jsx("span",{className:"ml-1 text-xs text-purple-500 italic",children:"(abstract)"})]}),o?.parentId&&u.jsxs("div",{className:"text-xs text-gray-400",children:["is a"," ",u.jsx("button",{onClick:()=>l(o.parentId),className:"text-blue-600 dark:text-blue-400 hover:underline",children:o.parentId})]})]}),u.jsx("button",{onClick:n,className:"text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-sm px-1",title:"Close (Esc)",children:"✕"})]}),o?u.jsxs("div",{className:"flex-1 overflow-y-auto min-h-0 px-3 py-2 space-y-3",children:[u.jsx("button",{onClick:()=>r(e),className:`w-full px-2 py-1 text-xs rounded border ${s?"border-blue-500 bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300":"border-gray-300 dark:border-slate-600 hover:border-blue-400 text-gray-600 dark:text-gray-300"}`,children:s?"✓ In diagram — click to remove":"+ Add to diagram"}),o.description&&u.jsx("p",{className:"text-xs text-gray-600 dark:text-gray-300 leading-relaxed",children:o.description}),o.referencedBy.length>0&&u.jsxs("section",{children:[u.jsxs(wr,{children:["Referenced by (",o.referencedBy.length,")"]}),u.jsx("ul",{className:"space-y-0.5",children:o.referencedBy.map((d,m)=>u.jsxs("li",{className:"text-xs",children:[u.jsx("button",{onClick:()=>l(d.classId),className:"text-blue-600 dark:text-blue-400 hover:underline cursor-pointer",children:d.classId}),u.jsxs("span",{className:"text-gray-400",children:[".",d.slotName]})]},`${d.classId}.${d.slotName}-${m}`))})]}),o.slots.length>0&&u.jsxs("section",{children:[u.jsxs(wr,{children:[f," (",o.slots.length,")"]}),u.jsx("ul",{className:"divide-y divide-gray-100 dark:divide-slate-700",children:o.slots.map((d,m)=>u.jsxs("li",{className:"py-1.5",children:[u.jsxs("div",{className:"flex items-baseline gap-1.5 flex-wrap",children:[u.jsx("span",{className:"text-xs font-medium text-gray-800 dark:text-gray-100",children:d.name}),u.jsx(Lm,{range:d.range,onNavigate:l,dataService:t})]}),d.description&&u.jsx("p",{className:"mt-0.5 text-[11px] text-gray-500 dark:text-gray-400 leading-snug break-words",children:d.description})]},`${d.name}-${m}`))})]})]}):u.jsxs("div",{className:"p-3 text-xs text-gray-500",children:["Entity not found: ",e]})]})}function wr({children:e}){return u.jsx("div",{className:"text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-1",children:e})}function Lm({range:e,onNavigate:t,dataService:n}){const i=n.itemExists(e)&&!e.endsWith("Enum"),o=`inline-block px-1 py-0 rounded text-[11px] font-medium ${new Set(["string","integer","boolean","float","double","decimal","date","datetime","time","uri","uriorcurie","ncname"]).has(e.toLowerCase())?"bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300":e.endsWith("Enum")?"bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300":"bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"}`;return i?u.jsx("button",{onClick:()=>t(e),className:`${o} hover:underline cursor-pointer`,children:e}):u.jsx("span",{className:o,children:e})}const Nm=[{heading:"One rule at a time",cases:[{name:"Rule 1 — multivalued owns forward",note:"A multivalued slot means the owner has-a collection, so ownership runs forward: Questionnaire.items and ResearchStudy.consents. The two `part_of` self-loops are the counterexample — multivalued but drawn backward, because they walk UP a tree.",sel:["ResearchStudy","Consent","Questionnaire","QuestionnaireItem"]},{name:"Rule 2 — single-valued belongs backward",note:"The largest group (70 edges). Participant fans OUT to 22 targets, nearly all reversed: each target declares `associated_participant` and is drawn as belonging to Participant. This is the group that would move if own-bkwd merges into association.",sel:["Participant","Condition","Demography","Exposure","Procedure","Visit"]},{name:"Exception 2a — no independent existence",note:"Single-valued, but forward anyway: Quantity, TimePoint and the like have no identity of their own, so the value belongs to whoever holds it rather than owning the holder.",sel:["SpecimenStorageActivity","Quantity","TimePoint","Activity"]},{name:"Entity-ranged — always forward",note:"The twelve focus / associated_evidence slots range on Entity, the universal root. A pointer AT the root is never a foreign key back to an owner, so these run forward whatever their cardinality. Both single- and multi-valued focus sites are here — all should point AT Entity.",sel:["Observation","ObservationSet","MeasurementObservation","Document","Condition","SdohObservation","Entity"]},{name:"Association — no ownership claim",note:"Both associations in the schema: Document.related_document → Specimen, and SpecimenContainer.container → SpecimenStorageActivity. Slate and dashed, arrowed at both ends. They are listed explicitly because they are multivalued, so Rule 1 would otherwise call them ownership.",sel:["Document","Specimen","SpecimenContainer","SpecimenStorageActivity"]},{name:"Self-loops",note:"The five self-owning slots (TimePoint.index_time_point, File.derived_from, Specimen.parent_specimen, ResearchStudy.part_of, SpecimenContainer.parent_container) — loop markers, not routed edges. ResearchStudy also pulls in its TimePoint edges; the loops are the circular arrows on the rows.",sel:["TimePoint","File","Specimen","ResearchStudy","SpecimenContainer"]}]},{heading:"Inheritance (merged sibling boxes)",cases:[{name:"One child, merged with its parent",note:"MeasurementObservation alone. It still merges: the box is titled Observation, its 13 inherited rows sit at the top in black, and MeasurementObservation's own 9 follow under its coloured header. Merging does not wait for a second sibling — a class must not change shape because of what else you happen to select.",sel:["MeasurementObservation"]},{name:"Children that add nothing",note:'SpecimenQuality- and SpecimenQuantityObservation declare no slots of their own. Both still get a header under the shared rows, because "this subclass adds nothing" is the answer to what they are — and without the headers the selection would leave no trace in the box at all.',sel:["SpecimenQualityObservation","SpecimenQuantityObservation"]},{name:"slot_usage — same name, different type",note:"QuestionnaireResponseValue's five children each narrow `value` to a different type (boolean, decimal, integer, TimePoint, and the parent's string). That narrowing is the entire reason the five classes exist, so each keeps its OWN row rather than merging into the parent's — the one place a shared row would be a lie.",sel:["QuestionnaireResponseValueBoolean","QuestionnaireResponseValueDecimal","QuestionnaireResponseValueInteger","QuestionnaireResponseValueString","QuestionnaireResponseValueTimePoint"]},{name:"The full Observation family",note:"All five Observation subclasses plus the parent. One box where there would be six, and the shared rows are stated once. Note each edge leaves in the colour of the child that owns its row; inherited slots' edges are the parent's and are drawn once, not once per child.",sel:["Observation","MeasurementObservation","SdohObservation","DimensionalObservation","SpecimenQualityObservation","SpecimenQuantityObservation"]}]},{heading:"The bare diagonal",cases:[{name:"BodySite 6-way (the original)",note:"The reproducer from the handoff. In ⌙ (bend) the top approach arrives as a straight diagonal with no steps; in ⋙ (near) it keeps its horizontal run. This is the case the fix has to fix.",sel:["BodySite","Condition","Consent","Demography","Exposure","Observation","Procedure","ImagingFile","ImagingStudy","MeasurementObservation","SpecimenCreationActivity"]},{name:"BodySite, owners only",note:"The same convergence with nothing else on canvas — six owners, no unrelated boxes for a diagonal to cut across. Shows whether the degeneracy is about the convergence itself or about crowding.",sel:["BodySite","Condition","ImagingFile","ImagingStudy","MeasurementObservation","Procedure","SpecimenCreationActivity"]},{name:"TimePoint 16-edge",note:"Densest corridor in the schema: 8 owners but 16 slot-edges, since each Specimen*Activity owns date_started and date_ended. Also where the second-from-top edge goes diagonal and pair edges cross.",sel:["TimePoint","Consent","ResearchStudy","TimePeriod","SpecimenCreationActivity","SpecimenProcessingActivity","SpecimenStorageActivity","SpecimenTransportActivity","QuestionnaireResponseValueTimePoint"]},{name:"TimePoint + Person (crossing)",note:"Siggie's repro for the crossing bug: the paired date_started / date_ended edges from different owners cross each other on the way in. Compare pair ordering against the case above.",sel:["TimePoint","Person","Consent","ResearchStudy","TimePeriod","SpecimenCreationActivity","SpecimenProcessingActivity","SpecimenStorageActivity","SpecimenTransportActivity","QuestionnaireResponseValueTimePoint"]}]},{heading:"Pathological convergences",cases:[{name:"Quantity 19-edge (worst case)",note:"The largest convergence in the schema: 16 owning classes, 19 slot-edges. The fan is squeezed hardest here, so ENTITY_FAN_GAP and the merge distance both show their limits.",sel:["Quantity","Activity","Assay","DeviceExposure","DimensionalObservation","DrugExposure","MeasurementObservation","Observation","Procedure","SdohObservation","SpecimenCreationActivity","SpecimenProcessingActivity","SpecimenQualityObservation","SpecimenQuantityObservation","SpecimenStorageActivity","SpecimenTransportActivity","Substance"]},{name:"Context 6-way (uniform owners)",note:"Six owners that are all observation classes — same size, same shape, similar row counts. The controlled comparison for BodySite, whose owners vary wildly in height.",sel:["Context","DimensionalObservation","MeasurementObservation","Observation","SdohObservation","SpecimenQualityObservation","SpecimenQuantityObservation"]},{name:"Two convergences at once",note:"Quantity and TimePoint both converge from the same Specimen activity classes, so two corridors compete for the same space. Where merge distance trades off against crossings.",sel:["Quantity","TimePoint","SpecimenCreationActivity","SpecimenProcessingActivity","SpecimenStorageActivity","SpecimenTransportActivity"]}]},{heading:"Flipped divergences (found via the legend)",cases:[{name:"Participant 22-way (largest fan in the schema)",note:"Bigger than any inbound convergence: 22 edges leaving Participant, 21 of them FLIPPED. Flipped edges keep their attribute-row anchor and must not merge, so this is the fan the merge code deliberately does not touch — and therefore the one nothing has been tuned against.",sel:["Participant","Condition","Consent","Demography","DeviceExposure","DrugExposure","Exposure","File","ImagingStudy","MeasurementObservation","Observation","Procedure","SdohObservation","Specimen","Visit"]},{name:"Visit 19-way",note:"The same shape one size down, and it overlaps Participant heavily — most classes carry both associated_participant and associated_visit, so the two fans run through the same corridor as pairs.",sel:["Visit","Condition","Demography","DeviceExposure","DrugExposure","Exposure","ImagingStudy","MeasurementObservation","Observation","Procedure","QuestionnaireResponse","SdohObservation","TimePeriod"]},{name:"Participant + Visit + Organization",note:"All three FK hubs at once (22 + 19 + 11 edges, nearly all flipped). The densest picture the schema can produce, and the stress test for anything that changes routing.",sel:["Participant","Visit","Organization","Condition","Demography","DimensionalObservation","MeasurementObservation","Observation","ObservationSet","Procedure","SdohObservation","SpecimenQualityObservation","SpecimenQuantityObservation"]},{name:"Converge and diverge at once",note:"MeasurementObservation owns BodySite/Context/Quantity while being owned by Participant/Visit/Organization — edges fan IN and OUT of the same box. Where merged (entity-end) and unmerged (flipped) arrivals sit side by side.",sel:["MeasurementObservation","BodySite","Context","Quantity","Participant","Visit","Organization","MeasurementObservationSet"]}]},{heading:"Normal cases (a fix must not break these)",cases:[{name:"Single edge",note:"One owner, one edge, no convergence at all — merging is a no-op. The floor: if this looks wrong, something basic broke.",sel:["Visit","TimePeriod"]},{name:"Two owners",note:"The smallest real convergence. Two approaches, one arrowhead — the fan is barely a fan, so a merge distance that is too long is obvious here first.",sel:["Participant","Visit","ObservationSet"]},{name:"Specimen chain (deep, not wide)",note:"A long ownership chain rather than a convergence: many layers, few edges per node. Checks that tuning for convergences has not made ordinary edges worse.",sel:["Specimen","SpecimenContainer","SpecimenCreationActivity","SpecimenProcessingActivity","SpecimenStorageActivity","SpecimenTransportActivity","Participant"]},{name:"The known 3-node cycle",note:"Specimen -> SpecimenStorageActivity -> SpecimenContainer -> Specimen: an association plus two ownership edges. Known and deliberately unhandled; here so it stays visible.",sel:["Specimen","SpecimenStorageActivity","SpecimenContainer"]},{name:"Backward ownership (own-bkwd)",note:"Slots drawn backward (performed_by, associated_person, contained_in, related_imaging_study). These keep their attribute-row anchor and must NOT merge — check the arrowheads.",sel:["Organization","Person","Participant","ImagingFile","ImagingStudy","SpecimenContainer","Specimen"]},{name:"Path to root",note:"Path-to-root on from a single deep class, which pulls in every owner up the chain. The biggest graph reachable in one click.",sel:["MeasurementObservation"],roots:!0}]}],Vm=3,hi=40;function Vl(){const[e,t]=y.useState(null),n=y.useCallback(s=>{if(s.button!==0||s.target.closest('button, a, input, select, textarea, [role="button"], [data-no-drag]'))return;const o=(s.currentTarget.closest("[data-draggable]")??s.currentTarget).getBoundingClientRect(),a=s.clientX,c=s.clientY,l={left:o.left,top:o.top},h=s.currentTarget;h.setPointerCapture(s.pointerId);let f=!1;const d=g=>{const b=g.clientX-a,p=g.clientY-c;if(!f&&Math.hypot(b,p)<Vm)return;f=!0;const x={left:Math.max(Math.min(l.left+b,window.innerWidth-hi),hi-o.width),top:Math.min(Math.max(l.top+p,0),window.innerHeight-hi)};t(x)},m=g=>{h.releasePointerCapture(g.pointerId),h.removeEventListener("pointermove",d),h.removeEventListener("pointerup",m),h.removeEventListener("pointercancel",m)};h.addEventListener("pointermove",d),h.addEventListener("pointerup",m),h.addEventListener("pointercancel",m)},[]),i=y.useCallback(()=>t(null),[]);return{offset:e,onPointerDown:n,reset:i}}function Il({title:e,subtitle:t,onClose:n,offset:i,children:s}){const r=Vl();y.useEffect(()=>{const a=c=>{c.key==="Escape"&&n()};return window.addEventListener("keydown",a),()=>window.removeEventListener("keydown",a)},[n]);const o=r.offset!==null;return u.jsxs("div",{"data-draggable":"",style:{resize:"both",...r.offset?{position:"fixed",...r.offset,right:"auto"}:{}},className:`z-30 w-[26rem] max-h-[80vh] overflow-y-auto
                  rounded-lg border border-gray-300 dark:border-slate-600
                  bg-white dark:bg-slate-800 shadow-xl
                  text-gray-900 dark:text-gray-100
                  ${o?"":`absolute top-14 ${i?"right-[27rem]":"right-4"}`}`,children:[u.jsxs("div",{onPointerDown:r.onPointerDown,className:`sticky top-0 flex items-baseline justify-between gap-2 px-4 py-2
                   border-b border-gray-200 dark:border-slate-700
                   bg-white dark:bg-slate-800 cursor-grab active:cursor-grabbing
                   select-none`,children:[u.jsxs("div",{children:[u.jsx("h2",{className:"text-sm font-semibold",children:e}),t&&u.jsx("p",{className:"text-[11px] text-gray-500 dark:text-gray-400",children:t})]}),u.jsxs("div",{className:"flex items-center gap-1 shrink-0",children:[o&&u.jsx("button",{onClick:r.reset,title:"Put it back",className:`text-gray-400 hover:text-gray-700 dark:hover:text-gray-200
                         text-xs leading-none px-1`,children:"⤺"}),u.jsx("button",{onClick:n,title:"Close (Esc)",className:"text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-lg leading-none",children:"×"})]})]}),u.jsx("div",{className:"px-4 py-2",children:s})]})}function Im(e,t){return e.sel.length===t.size&&e.sel.every(n=>t.has(n))}function Bm({onClose:e,onApply:t,selectedIds:n,dataService:i,offset:s}){const r=y.useMemo(()=>i.getConvergenceRanking(),[i]),o=y.useMemo(()=>i.getDivergenceRanking(),[i]),a=c=>t({name:"ad hoc",note:"",sel:c});return u.jsxs(Il,{title:"Example cases",subtitle:"Selections worth looking at, simple to dense.",onClose:e,offset:s,children:[u.jsxs("section",{className:"mb-4",children:[u.jsx(xr,{children:"Biggest fans"}),u.jsx("p",{className:"text-[11px] text-gray-500 dark:text-gray-400 mb-1.5",children:"Counted in slot-edges, not classes: one class owning a target through two slots crowds the corridor twice. Click a row to load just that fan."}),u.jsx("div",{className:"grid grid-cols-2 gap-3",children:[["Converging (in)",r.slice(0,6).map(c=>({entity:c.entity,n:c.edgeCount,peers:c.owners,flipped:0}))],["Diverging (out)",o.slice(0,6).map(c=>({entity:c.entity,n:c.edgeCount,peers:c.owned,flipped:c.flippedCount}))]].map(([c,l])=>u.jsxs("div",{children:[u.jsx("h4",{className:"text-[10px] font-medium text-gray-500 dark:text-gray-400 mb-0.5",children:c}),u.jsx("ul",{className:"space-y-0.5",children:l.map(h=>u.jsx("li",{children:u.jsxs("button",{onClick:()=>a([h.entity,...h.peers]),title:`Select ${h.entity} and all ${h.peers.length} peers`,className:"w-full text-left text-xs hover:bg-gray-50 dark:hover:bg-slate-700 rounded px-1",children:[u.jsx("span",{className:"text-blue-600 dark:text-blue-400",children:h.entity}),u.jsxs("span",{className:"text-gray-400 ml-1",children:[h.n,h.flipped>0?` (${h.flipped} flipped)`:""]})]})},h.entity))})]},c))})]}),Nm.map(c=>u.jsxs("section",{className:"mb-3 last:mb-1",children:[u.jsx(xr,{children:c.heading}),u.jsx("ul",{className:"space-y-1.5",children:c.cases.map(l=>{const h=Im(l,n);return u.jsx("li",{children:u.jsxs("button",{onClick:()=>t(l),className:`block w-full text-left rounded px-2 py-1 border
                      ${h?"border-blue-500 bg-blue-50 dark:bg-blue-950":"border-transparent hover:bg-gray-50 dark:hover:bg-slate-700"}`,children:[u.jsx("span",{className:`text-xs font-medium ${h?"text-blue-700 dark:text-blue-300":"text-blue-600 dark:text-blue-400"}`,children:l.name}),u.jsxs("span",{className:"ml-1.5 text-[10px] text-gray-400",children:[l.sel.length,l.roots?" ⇱":""]}),u.jsx("p",{className:"text-[11px] leading-snug text-gray-600 dark:text-gray-400 mt-0.5",children:l.note})]})},l.name)})})]},c.heading))]})}function xr({children:e}){return u.jsx("h3",{className:`text-[11px] font-semibold uppercase tracking-wider
                   text-gray-400 dark:text-gray-500 mb-1`,children:e})}const vr={"own-fwd":{text:"owns (forward)",color:we.ownFwd},"own-bkwd":{text:"belongs to (backward)",color:we.ownBkwd},association:{text:"association (no ownership)",color:we.association},excluded:{text:"dropped",cls:"text-gray-400 dark:text-gray-500 border-gray-300"}},$m=[{kind:"own-fwd",color:we.ownFwd,title:ie.kinds["own-fwd"].label,body:"The arrow runs from the owner to what it holds. A owns B when the schema puts the collection on A, or when B has no independent existence — a Quantity of 5 mg is not something you look up."},{kind:"own-bkwd",color:we.ownBkwd,title:ie.kinds["own-bkwd"].label,body:'The same relationship stored at the other end: A carries a pointer to one B that exists without it. Drawn B → A, so you still read "start at B to find A". A Participant carries on existing whether or not any observation points at it.'},{kind:"association",color:we.association,title:ie.kinds.association.label,body:"Neither owns the other. Dashed, with arrowheads at both ends. Only two edges in the schema are this — a slot the ownership rules would otherwise claim, wrongly."}],Fm=[{glyph:"⇱ roots",what:"Also draw everything on the path up to a root."},{glyph:"LR / TB",what:"Lay the diagram out left-to-right or top-down."},{glyph:"⋙ ⋙⋙ ⌙ ≡",what:"Where converging edges join before their shared arrowhead — near the box, early, at the last corner, or not at all. Temporary, for picking one by eye."},{glyph:"+ − 1:1 ⛶",what:"Zoom in, out, reset, fit to view."}],_m=[["0..1","optional, at most one"],["1..1","required, exactly one"],["0..*","optional, any number"],["1..*","required, one or more"]];function Hm({dataService:e,onClose:t,onSelect:n,offset:i}){const s=y.useMemo(()=>e.getOwnershipPairGroups(),[e]),[r,o]=y.useState(null),a=c=>u.jsx("button",{onClick:()=>n([c]),className:"hover:underline text-blue-600 dark:text-blue-400",title:`Select ${c}`,children:c});return u.jsx(Il,{title:"Ownership legend",subtitle:"What the diagram's arrows, colors and buttons mean.",onClose:t,offset:i,children:u.jsxs("div",{className:"text-xs",children:[u.jsxs(At,{title:"The three kinds of relationship",children:[u.jsxs("p",{className:"text-[11px] text-gray-500 dark:text-gray-400 mb-2",children:["Every edge is a class-valued attribute. Classes are placed so that if ",u.jsx("b",{children:"A"})," is drawn before ",u.jsx("b",{children:"B"}),", you reach ",u.jsx("b",{children:"B"})," through"," ",u.jsx("b",{children:"A"})," — so an edge always tells you where to start."]}),u.jsx("ul",{className:"space-y-2",children:$m.map(c=>u.jsxs("li",{className:"flex gap-2",children:[u.jsx(Nn,{kind:c.kind,className:"mt-0.5"}),u.jsxs("div",{className:"min-w-0",children:[u.jsx("div",{className:"font-medium",style:{color:c.color},children:c.title}),u.jsx("p",{className:"text-[11px] leading-snug text-gray-600 dark:text-gray-400",children:c.body})]})]},c.title))}),u.jsxs("p",{className:"text-[11px] leading-snug text-gray-500 dark:text-gray-400 mt-2",children:["An edge leaves the ",u.jsx("b",{children:"attribute's row"}),", not the box — that is how you tell which attribute made it. A ",u.jsx("b",{children:"⟲"})," on a row is a slot pointing back at its own class."]}),u.jsxs("p",{className:"text-[11px] leading-snug text-gray-500 dark:text-gray-400 mt-2",children:["Owners are drawn first, so a box's ",u.jsx("b",{children:"← N"})," counts what it belongs to (on its left) and ",u.jsx("b",{children:"M →"})," what it owns (on its right). Hover either to list them. The little edge on each row is the one above: it says which end holds the arrowhead, and so which entity declares the attribute — and ",u.jsx("i",{children:"both"})," kinds turn up on ",u.jsx("i",{children:"both"})," sides."]})]}),u.jsxs(At,{title:"Colors",children:[u.jsx(kr,{caption:"A row's dot and its range label say what KIND of thing the attribute points at.",items:[{color:Pt.entity,label:"another entity"},{color:Pt.enum,label:"a value set"},{color:Pt.dataType,label:"a data type"}]}),u.jsxs("p",{className:"text-[11px] leading-snug text-gray-600 dark:text-gray-400 mt-2",children:["A ",u.jsx("b",{children:"filled"})," dot draws an edge; a ",u.jsx("b",{children:"hollow"})," one does not, because what it points at is not on the canvas. Only entity ranges can draw edges at all."]}),u.jsx(kr,{className:"mt-3",caption:"Inside a merged box, a color says which entity an attribute belongs to.",items:fc.slice(0,4).map((c,l)=>({color:c.text,swatch:c.fill,label:l===0?"the parent":`child ${l}`}))})]}),u.jsx(At,{title:"Cardinality",children:u.jsx("ul",{className:"flex flex-wrap gap-x-4 gap-y-1",children:_m.map(([c,l])=>u.jsxs("li",{className:"flex items-center gap-1.5",children:[u.jsx("span",{className:"font-mono text-[11px] text-gray-700 dark:text-gray-300",children:c}),u.jsx("span",{className:"text-[11px] text-gray-500 dark:text-gray-400",children:l})]},c))})}),u.jsx(At,{title:"The toolbar",children:u.jsx("ul",{className:"space-y-1",children:Fm.map(c=>u.jsxs("li",{className:"flex gap-2",children:[u.jsx("span",{className:"shrink-0 font-mono text-[11px] text-gray-700 dark:text-gray-300 w-20",children:c.glyph}),u.jsx("span",{className:"text-[11px] leading-snug text-gray-600 dark:text-gray-400",children:c.what})]},c.glyph))})}),u.jsxs(At,{title:"Every relationship, by rule",children:[u.jsx("p",{className:"text-[11px] text-gray-500 dark:text-gray-400 mb-1.5",children:"Derived live from the classifier the graph itself uses, so this cannot drift from what is drawn. Overrides and value-object membership are hand-curated — if a pair looks wrong, the classification is. Click any class to select it."}),u.jsx("ul",{className:"space-y-1",children:s.map(c=>{const l=`${c.verdict}/${c.rule}`,h=vr[c.verdict]??vr.excluded,f=r===l;return u.jsxs("li",{className:"border-l-2 pl-2 border-gray-200 dark:border-slate-600",children:[u.jsxs("button",{onClick:()=>o(f?null:l),className:"w-full text-left",children:[u.jsx("span",{className:`inline-block px-1 rounded border text-[10px] ${h.cls??""}`,style:h.color?{color:h.color,borderColor:h.color}:void 0,children:h.text}),u.jsx("span",{className:"ml-1.5 font-medium",children:c.rule}),u.jsx("span",{className:"ml-1 text-gray-400",children:c.pairs.length}),u.jsx("span",{className:"ml-1 text-gray-400",children:f?"▾":"▸"})]}),u.jsx("p",{className:"text-[11px] leading-snug text-gray-600 dark:text-gray-400 mt-0.5",children:c.ruleText}),f&&u.jsx("ul",{className:"mt-1 mb-1.5 space-y-0.5 font-mono text-[10px]",children:c.pairs.map(d=>u.jsxs("li",{className:"text-gray-600 dark:text-gray-400",children:[a(d.declaredOn),u.jsxs("span",{className:"text-gray-400",children:[".",d.slotName]}),u.jsx("span",{className:"mx-1 text-gray-400",children:d.multivalued?"↠":"→"}),a(d.range),d.isLoop&&u.jsx("span",{className:"ml-1",style:{color:Pt.entity},children:"loop"}),(c.verdict==="own-bkwd"||c.verdict==="association")&&u.jsxs("span",{className:"ml-1 text-gray-400",children:["(owner: ",d.owner,")"]})]},`${d.declaredOn}.${d.slotName}`))})]},l)})})]}),u.jsxs("p",{className:"text-[10px] text-gray-400 dark:text-gray-500 mt-3",children:["A box's ",u.jsx("b",{children:"“N related”"})," count is of distinct classes"," ",u.jsx("i",{children:"outside"})," it, so selecting a class that folds into a merged box can make the number go ",u.jsx("i",{children:"down"}),". Correct, if counter-intuitive."]})]})})}function At({title:e,children:t}){return u.jsxs("section",{className:"mb-4 last:mb-1",children:[u.jsx("h3",{className:`text-[11px] font-semibold uppercase tracking-wider
                     text-gray-400 dark:text-gray-500 mb-1`,children:e}),t]})}function kr({caption:e,items:t,className:n}){return u.jsxs("div",{className:n,children:[u.jsx("p",{className:"text-[11px] text-gray-500 dark:text-gray-400 mb-1",children:e}),u.jsx("ul",{className:"flex flex-wrap gap-x-3 gap-y-1",children:t.map(i=>u.jsxs("li",{className:"flex items-center gap-1",children:[u.jsx("span",{className:"inline-block w-3 h-3 rounded-sm border",style:{background:i.swatch??i.color,borderColor:i.color}}),u.jsx("span",{className:"text-[11px]",style:{color:i.color},children:i.label})]},i.label))})]})}const zm=!1,Wm=!1,Bl=y.createContext(null);function ht(){const e=y.useContext(Bl);if(!e)throw new Error("useHelp must be used inside <HelpProvider>");return e}const Gm=300,Um=[{id:"graph-canvas-reading",label:"Reading the diagram"},{id:"relation-bar",label:"The relation bar"},{id:"merged-boxes",label:"Inheritance and merged boxes"},{id:"node-dismiss",label:"Closing a box"},{id:"copy-link",label:"Sharing what you see"}];function Km({onOpenLegend:e,onOpenCases:t,legendOpen:n,casesOpen:i,onClosePanels:s,anyPanelOpen:r}){const{showEntry:o,showAddresses:a,toggleAddresses:c}=ht(),[l,h]=y.useState(!1),f=y.useRef(void 0),d=()=>{f.current!==void 0&&(clearTimeout(f.current),f.current=void 0)},m=()=>{d(),f.current=setTimeout(()=>h(!1),Gm)};y.useEffect(()=>d,[]),y.useEffect(()=>{if(!l)return;const b=x=>{x.target?.closest("[data-help-menu]")||h(!1)},p=x=>{x.key==="Escape"&&h(!1)};return document.addEventListener("mousedown",b,!0),document.addEventListener("keydown",p),()=>{document.removeEventListener("mousedown",b,!0),document.removeEventListener("keydown",p)}},[l]);const g=b=>()=>{h(!1),b()};return u.jsxs("span",{"data-help-menu":!0,"data-help-id":"help-menu",className:"relative",onMouseEnter:()=>{d(),h(!0)},onMouseLeave:m,children:[u.jsxs("button",{onClick:()=>h(b=>!b),title:"Legend, example cases and help topics",className:`text-sm underline hover:text-white ${l?"text-white":"text-blue-100"}`,children:["Help ",u.jsx("span",{"aria-hidden":!0,className:"opacity-70",children:"▾"})]}),l&&u.jsxs("div",{className:`absolute right-0 top-full mt-1 z-40 w-60 py-1
                     rounded-md border border-gray-300 dark:border-slate-600
                     bg-white dark:bg-slate-800 shadow-xl
                     text-gray-900 dark:text-gray-100`,children:[u.jsxs(un,{onClick:g(e),children:[n?"Hide ownership legend":"Ownership legend",u.jsx(ui,{children:"every relationship in the schema, by rule"})]}),u.jsxs(un,{onClick:g(t),children:[i?"Hide example cases":"Example cases",u.jsx(ui,{children:"selections worth looking at"})]}),r&&u.jsxs(un,{onClick:g(s),children:["Close all panels",u.jsx(ui,{children:"legend, cases and the detail drawer"})]}),u.jsx(qm,{}),Um.map(b=>u.jsx(un,{onClick:g(()=>o(b.id)),children:b.label},b.id)),Wm]})]})}function un({onClick:e,children:t}){return u.jsx("button",{onClick:e,className:`block w-full text-left px-3 py-1.5 text-xs
                 hover:bg-gray-100 dark:hover:bg-slate-700`,children:t})}function ui({children:e}){return u.jsx("span",{className:"block text-[10px] text-gray-400 dark:text-gray-500",children:e})}function qm(){return u.jsx("div",{className:"my-1 border-t border-gray-200 dark:border-slate-700"})}function $l(e){const t=Number(e?.trim());return Number.isFinite(t)&&t>=240?t:void 0}function Fl(e){const t=e?.trim().toLowerCase();return t==="dim"||t==="ring"||t==="none"?t:void 0}function _l(e){const t=e?.trim().toLowerCase();return t==="left"||t==="right"||t==="top"||t==="bottom"?t:void 0}function Hl(e){const t=e?.trim();if(!t)return;const n=Number(t);if(Number.isFinite(n))return{px:n};const i=t.match(/^(-)?(?:anchor|parentBox)\.(width|height)(?:\s*\*\s*(-?[\d.]+))?$/i);if(!i)return;const[,s,r,o]=i,a=o===void 0?1:Number(o);if(Number.isFinite(a))return{of:r.toLowerCase(),times:s?-a:a}}function Ht(e,t){const n=e?.trim();if(!n)return{kind:"help-id",arg:t};if(n==="none")return{kind:"none"};const i=n.indexOf(":");return i===-1?{kind:"help-id",arg:n}:{kind:n.slice(0,i).trim(),arg:n.slice(i+1).trim()}}const Qm="Format",Ym="Walkthrough",Xm=new Set([Qm,"TODO"]),zl=/^<\/?(?:details|summary)\b[^>]*>$/i;function ge(e,t){const n=t.toLowerCase();for(const i of e){const s=ut(i);if(s){if(s.name==="beats"&&n!=="beats")return;if(s.name===n)return s.value}}}function ut(e){const t=e.trimStart().match(/^-\s+(.*)$/);if(!t)return;const n=t[1].replace(/\*\*/g,""),i=n.indexOf(":");if(i===-1)return;const s=n.slice(0,i).trim();if(/^[A-Za-z_][A-Za-z0-9_]*$/.test(s))return{name:s.toLowerCase(),value:n.slice(i+1).trim()}}function Ns(e){return e.length>0&&!/^\s/.test(e)&&ut(e)!==void 0}function Wl(e,t){const n=t.toLowerCase(),i=e.findIndex(l=>ut(l)?.name===n);if(i===-1)return;const s=ut(e[i]).value,r=[];for(let l=i+1;l<e.length&&!(Ns(e[l])||zl.test(e[l].trim()));l++)r.push(e[l]);for(;r.length&&r[r.length-1].trim()==="";)r.pop();if(r.length===0)return s;const o=r.filter(l=>l.trim()!=="").map(l=>l.length-l.trimStart().length),a=Math.min(...o),c=r.map(l=>l.slice(a)).join(`
`);return s?`${s}
${c}`:c}function Zm(e,t){const n=t.toLowerCase(),i=e.findIndex(r=>ut(r)?.name===n);if(i===-1)return[];const s=[];for(let r=i+1;r<e.length;r++){const o=e[r].trimStart();if(Ns(e[r])||o==="")break;o.startsWith("- ")&&s.push(o.slice(2).trim())}return s}function Jm(e,t){const n=e.findIndex(o=>ut(o)?.name==="beats");if(n===-1)return;const i=[];let s=null;const r=()=>{s&&i.push(s)};for(let o=n+1;o<e.length;o++){const a=e[o].trimStart();if(Ns(e[o])||e[o].length>0&&!/^\s/.test(e[o])&&/^<\/?[a-z]/i.test(a))break;if(a==="")continue;const c=a.match(/^(\d+)\.\s+(.*)$/);if(c){r(),s={text:c[2].trim()};continue}const l=ut(a);if(l&&s){const{name:h,value:f}=l;if(h==="description"){const d=e[o].length-e[o].trimStart().length,m=[];let g=o+1;for(;g<e.length;g++){if(e[g].trim()===""){m.push("");continue}if(e[g].length-e[g].trimStart().length<=d)break;m.push(e[g])}for(;m.length&&m[m.length-1].trim()==="";)m.pop();if(m.length){const b=m.filter(S=>S.trim()!=="").map(S=>S.length-S.trimStart().length),p=Math.min(...b),x=m.map(S=>S.slice(p)).join(`
`);s.description=f?`${f}
${x}`:x}else s.description=f;o=g-1;continue}h==="anchor"?s.anchor=Ht(f,t):h==="spotlight"?s.spotlight=Ht(f,t):h==="action"?s.action=f.trim():h==="change"?s.change=f.trim():h==="only"?(s.change=f.trim(),s.replace=!0):h==="highlight"?s.highlight=Fl(f):h==="width"?s.width=$l(f):h==="position"?s.position=_l(f):h==="offsetx"?s.offsetX=Hl(f):h==="keep"&&(s.keep=f.trim()!=="false");continue}s&&!a.startsWith("-")&&(s.text=`${s.text} ${a}`.trim())}return r(),i.length>0?i:void 0}function eg(e,t){const n=e.split(`
`),s=n[0].match(/^###\s+(.+)$/);if(!s)return null;const r=s[1].trim(),o=ge(n,"Title")??r,a=Wl(n,"Description")??"",c=Zm(n,"Interactions"),l=ge(n,"Shortcut"),h=ge(n,"Context"),f=Ht(ge(n,"Anchor"),r),d=ge(n,"Spotlight"),m=d===void 0?void 0:Ht(d,r),g=ge(n,"Action"),b=ge(n,"Once"),p=ge(n,"Only"),x=ge(n,"Change"),S=x??p,v=x===void 0&&p!==void 0?!0:void 0,w=Fl(ge(n,"Highlight")),k=$l(ge(n,"Width")),E=_l(ge(n,"Position")),T=Hl(ge(n,"OffsetX")),D=Jm(n,r),P=ge(n,"Tour");return{id:r,title:o,description:a,interactions:c,shortcut:l,context:h,anchor:f,action:g,once:b,change:S,replace:v,highlight:w,width:k,position:E,offsetX:T,tour:P===void 0?void 0:P||Ym,order:t,beats:D,...m?{spotlight:m}:{}}}function tg(e,t){const n=e.split(`
`),i=n.findIndex(m=>/^##\s+/.test(m)),s=i===-1?null:n[i].match(/^##\s+(.+)$/),r=s?s[1].trim():"Unknown",o=r.toLowerCase().replace(/[^a-z0-9]+/g,"-"),a=[];for(let m=i+1;m<n.length&&!n[m].startsWith("### ");m++)zl.test(n[m].trim())||a.push(n[m]);const c=a.join(`
`).trim(),l=ge(a,"TourMetadata"),h=l===void 0?void 0:{name:l||r,description:Wl(a,"Description")?.trim()??"",abbr:ge(a,"TourAbbr")?.trim()||void 0},f=[],d=e.split(/(?=^### )/m);for(const m of d){if(!m.startsWith("### "))continue;const g=eg(m.trim(),t());g&&f.push(g)}return{id:o,title:r,body:c,entries:f,tourMeta:h}}function es(e){const t=new Set;for(const n of[...e.entries.values()].sort((i,s)=>i.order-s.order))n.tour&&t.add(n.tour);return[...t]}function Gl(e,t){const n=t??es(e)[0];return[...e.entries.values()].filter(i=>i.tour!==void 0&&i.tour===n).sort((i,s)=>i.order-s.order)}function di(e,t){return t<0?e:`${e} ▸${t+1}`}function fi(e){return`### ${e}`}function ts(e,t){const n=[];return Gl(e,t).forEach((i,s)=>{const r=s+1;if(!i.beats||i.beats.length===0){n.push({entry:i,step:r,beatIndex:0,beatCount:0,address:di(i.id,-1),searchFor:fi(i.id),blocks:[i.description],text:i.description,anchor:i.anchor,...i.spotlight?{spotlight:i.spotlight}:{},action:i.action,change:i.change,replace:i.replace,highlight:i.highlight,width:i.width,position:i.position,offsetX:i.offsetX});return}let o=i.description?[i.description]:[];o.length>0&&n.push({entry:i,step:r,beatIndex:-1,beatCount:i.beats.length,address:di(i.id,-1),searchFor:fi(i.id),blocks:o,text:o.join(`

`),anchor:i.anchor,...i.spotlight?{spotlight:i.spotlight}:{},action:i.action,change:i.change,replace:i.replace,highlight:i.highlight,width:i.width,position:i.position,offsetX:i.offsetX});let a=i.width;i.beats.forEach((c,l)=>{const h=c.description??"";o=c.keep?[...o,h]:[h],c.width!==void 0&&(a=c.width),n.push({entry:i,step:r,beatIndex:l,beat:c,beatCount:i.beats.length,address:di(i.id,l),searchFor:fi(i.id),blocks:o,text:o.join(`

`),anchor:c.anchor??i.anchor,...c.spotlight??i.spotlight?{spotlight:c.spotlight??i.spotlight}:{},action:c.action,highlight:c.highlight??i.highlight,width:a,position:c.position??i.position,offsetX:c.offsetX??i.offsetX,change:c.change,replace:c.replace})})}),n}function ng(e){const n=e.replace(/<!--[\s\S]*?-->/g,"").trim().split(/(?=^## )/m).map(a=>a.trim()).filter(Boolean),i=[],s=new Map;let r=0;for(const a of n){if(!a.match(/^## /m))continue;const c=a.match(/^##\s+(.+)$/m)?.[1].trim();if(c&&Xm.has(c))continue;const l=tg(a,()=>r++);i.push(l);for(const h of l.entries)s.set(h.id,h)}const o=new Map;for(const a of i)a.tourMeta&&o.set(a.tourMeta.name,a.tourMeta);return{sections:i,entries:s,tourMeta:o}}const ig=/\{\{\s*([a-z][a-z0-9-]*)\s*:\s*([^}]*?)\s*\}\}/gi;function sg(e,t){return!t||!e.includes("{{")?e:e.replace(ig,(n,i,s)=>t[i.toLowerCase()]?.(s)??n)}function Sr(e){const t=new Set;return e.map((n,i)=>({p:n,index:i})).filter(({p:n})=>t.has(n.step)?!1:(t.add(n.step),!0)).map(({p:n,index:i})=>({index:i,step:n.step,title:n.entry.title,beatCount:n.beatCount}))}function Ul({scope:e,onClose:t}){const{content:n,tours:i,tourMeta:s,tourName:r,tourIndex:o,positions:a,position:c,goToStep:l,startTour:h}=ht();y.useEffect(()=>{const p=x=>{x.key==="Escape"&&(x.stopPropagation(),x.preventDefault(),t())};return window.addEventListener("keydown",p,!0),()=>window.removeEventListener("keydown",p,!0)},[t]);const f=y.useRef(null);y.useEffect(()=>{const p=f.current;if(!(!p||typeof p.showPopover!="function"))return p.showPopover(),()=>{p.matches(":popover-open")&&p.hidePopover()}},[]);const d=y.useMemo(()=>e==="all"?i.map(p=>({name:p,rows:Sr(ts(n,p))})):[],[e,i,n]),m=c?.step,g=o===null?void 0:r,b=(p,x,S)=>u.jsxs("button",{onClick:S,"aria-current":x?"step":void 0,className:`help-map-step${x?" help-map-step-here":""}`,children:[u.jsx("span",{className:"help-map-num",children:p.step}),u.jsx("span",{className:"help-map-title",children:p.title}),p.beatCount>0&&u.jsx("span",{className:"help-map-beats",title:`${p.beatCount+1} screens in this step`,children:p.beatCount+1})]},p.index);return jr.createPortal(u.jsx("div",{ref:f,popover:"manual",className:"help-map-backdrop",onMouseDown:t,children:u.jsxs("div",{role:"dialog","aria-label":e==="all"?"All tours":"Tour outline",className:"help-map",onMouseDown:p=>p.stopPropagation(),children:[u.jsxs("div",{className:"help-map-head",children:[u.jsxs("div",{children:[u.jsx("h2",{children:e==="all"?"Tours":g??"This tour"}),u.jsx("p",{children:e==="all"?"Every guided walk, and what is in it. Click any step to start there.":"Click any step to jump to it."})]}),u.jsx("button",{onClick:t,title:"Close (Esc)",className:"help-map-close",children:"✕"})]}),u.jsx("div",{className:"help-map-body",children:e==="tour"?Sr(a).map(p=>b(p,p.step===m,()=>{l(p.index),t()})):d.map(({name:p,rows:x})=>u.jsxs("section",{className:"help-map-tour",children:[u.jsx("button",{className:"help-map-tourname",onClick:()=>{h(p),t()},children:p}),s.get(p)?.description&&u.jsx("p",{className:"help-map-blurb",children:s.get(p).description}),x.map(S=>b(S,g===p&&S.step===m,()=>{g===p?l(S.index):h(p,S.index),t()}))]},p))})]})}),document.body)}function og(){const{tours:e,tourMeta:t,startTour:n}=ht(),[i,s]=y.useState(!1),{overviewOpen:r,setOverviewOpen:o}=ht(),a=y.useRef(null);return y.useEffect(()=>{if(!i)return;const c=h=>{h.target?.closest("[data-tour-chooser]")||s(!1)},l=h=>{h.key==="Escape"&&s(!1)};return document.addEventListener("mousedown",c,!0),document.addEventListener("keydown",l),()=>{document.removeEventListener("mousedown",c,!0),document.removeEventListener("keydown",l)}},[i]),e.length===0?null:u.jsxs("span",{"data-tour-chooser":!0,"data-help-id":"tour-chooser",className:"relative",onMouseEnter:()=>s(!0),children:[u.jsx("button",{onClick:()=>{s(!1),o(!0)},title:"Guided walks through the app and the model; click for the overview",className:`text-sm font-semibold px-2.5 py-1 rounded-full bg-white/95
                   text-blue-700 shadow-sm hover:bg-white hover:shadow`,children:"Guided tours"}),i&&u.jsxs("div",{ref:a,role:"dialog","aria-label":"Guided tours",className:`absolute right-0 top-full mt-1 z-40 w-80 p-1
                     rounded-md border border-gray-300 dark:border-slate-600
                     bg-white dark:bg-slate-800 shadow-xl
                     text-gray-900 dark:text-gray-100`,children:[u.jsxs("p",{className:"px-3 pt-2 pb-1 text-[11px] text-gray-500 dark:text-gray-400",children:["Each one stands on its own. Leave any tour with ",u.jsx("kbd",{children:"Esc"}),"."]}),u.jsxs("button",{"data-tour-overview":!0,onClick:()=>{s(!1),o(!0)},className:`block w-full text-left px-3 py-2 rounded
                       hover:bg-gray-100 dark:hover:bg-slate-700`,children:[u.jsx("span",{className:"block text-xs font-semibold",children:"Overview"}),u.jsxs("span",{className:"block text-[11px] text-gray-500 dark:text-gray-400",children:["All ",e.length," tours and every step in them — start anywhere."]})]}),u.jsx("div",{className:"my-1 border-t border-gray-200 dark:border-slate-700"}),e.map(c=>u.jsxs("button",{onClick:()=>{s(!1),n(c)},className:`block w-full text-left px-3 py-2 rounded
                         hover:bg-gray-100 dark:hover:bg-slate-700`,children:[u.jsx("span",{className:"block text-xs font-semibold",children:c}),t.get(c)?.description&&u.jsx("span",{className:"block text-[11px] text-gray-500 dark:text-gray-400",children:t.get(c).description})]},c))]}),r&&u.jsx(Ul,{scope:"all",onClose:()=>o(!1)})]})}const rg="dmvd.help.showAddresses";function ag(){const e=document.activeElement;return e instanceof HTMLInputElement||e instanceof HTMLTextAreaElement||e?.getAttribute("contenteditable")==="true"}function lg(e,t){if(!t)return e;const n=r=>sg(r,t),i=r=>r===void 0?void 0:n(r),s=new Map([...e.entries].map(([r,o])=>[r,{...o,description:n(o.description),interactions:o.interactions.map(n),action:i(o.action),context:i(o.context),beats:o.beats?.map(a=>({...a,description:i(a.description),action:i(a.action)}))}]));return{sections:e.sections.map(r=>({...r,entries:r.entries.map(o=>s.get(o.id)??o),tourMeta:r.tourMeta&&{...r.tourMeta,description:n(r.tourMeta.description)}})),entries:s,tourMeta:new Map([...e.tourMeta].map(([r,o])=>[r,{...o,description:n(o.description)}]))}}function cg({markdown:e,onPushChange:t,onPopChange:n,onJumpChanges:i,onTourStart:s,onTourEnd:r,textResolvers:o,widgets:a,centerOn:c,children:l}){const[h,f]=y.useState(),d=h??o,m=y.useMemo(()=>lg(ng(e),d),[e,d]),[g,b]=y.useState(!1),[p,x]=y.useState(null),[S,v]=y.useState(void 0),[w,k]=y.useState(!1),E=y.useMemo(()=>es(m),[m]),T=y.useMemo(()=>ts(m,S),[m,S]),D=y.useMemo(()=>Gl(m,S).length,[m,S]),[P,N]=y.useState(null),[F,B]=y.useState(()=>!1),O=y.useCallback(()=>{B(q=>{const Q=!q;try{window.localStorage.setItem(rg,Q?"1":"0")}catch{}return Q})},[]),$=y.useCallback(()=>{b(!1),N(null)},[]),C=y.useCallback(()=>N(null),[]),U=y.useCallback(q=>N(q),[]),xe=y.useCallback(q=>{const Q=T[q];Q&&(x(q),N(Q.entry.id),Q.change!=null&&t&&t(Q.change,Q.replace))},[T,t]),L=y.useCallback(q=>{T[q+1]?.change!=null&&n&&n();const te=T[q];te&&(x(q),N(te.entry.id))},[T,n]),W=y.useCallback(q=>{if(p===null||q===p)return;const Q=T[q];if(Q&&i){if(q>p){const te=T.slice(p+1,q+1).filter(re=>re.change!=null).map(re=>({query:re.change,replace:re.replace}));i(te,0)}else{const te=T.slice(q+1,p+1).filter(re=>re.change!=null).length;i([],te)}x(q),N(Q.entry.id)}},[p,T,i]),j=y.useCallback((q=es(m)[0],Q=0)=>{b(!1),v(q);const te=ts(m,q),re=Math.min(Math.max(Q,0),Math.max(te.length-1,0)),Se=te[re];if(!Se)return;s?.(),x(re),N(Se.entry.id);const $e=te.slice(0,re+1).filter(Pe=>Pe.change!=null).map(Pe=>({query:Pe.change,replace:Pe.replace}));re>0&&i?i($e,0):Se.change!=null&&t&&t(Se.change,Se.replace)},[m,t,i,s]),Y=y.useCallback(()=>{x(null),N(null),v(void 0),r?.()},[r]),ve=y.useCallback(()=>{p!==null&&(p+1>=T.length?Y():xe(p+1))},[p,T.length,xe,Y]),ne=y.useCallback(()=>{p!==null&&p>0&&L(p-1)},[p,L]),Me=y.useCallback(()=>{p!==null&&Y(),N(null)},[p,Y]),Oe=y.useCallback(q=>{if(!q)return null;const{kind:Q}=q;if(Q==="none")return null;const{arg:te}=q,re=Q==="help-id"?te:`${Q}:${te}`,Se=document.querySelectorAll(`[data-help-id="${CSS.escape(re)}"]`);return Se.length<2?Se[0]??null:[...Se].find($e=>$e.getBoundingClientRect().height>0)??Se[0]},[]);y.useEffect(()=>(document.body.classList.toggle("help-mode",g),()=>{document.body.classList.remove("help-mode")}),[g]),y.useEffect(()=>{if(g)return window.addEventListener("blur",$),()=>window.removeEventListener("blur",$)},[g,$]),y.useEffect(()=>{if(!g)return;function q(Q){const te=Q.target;if(!te)return;const re=te.closest("[data-help-id]");re?(Q.stopPropagation(),Q.preventDefault(),U(re.getAttribute("data-help-id"))):te.closest("[data-help-popover]")||C()}return document.addEventListener("click",q,!0),()=>document.removeEventListener("click",q,!0)},[g,U,C]),y.useEffect(()=>{function q(Q){if(Q.key==="?"&&!ag()){Q.preventDefault(),p===null?k(te=>!te):Y();return}if(Q.key==="Escape"&&(g||p!==null||P)){Q.preventDefault(),Q.stopPropagation(),P&&p===null?C():p!==null?Y():Me();return}p!==null&&(Q.key==="ArrowRight"&&(Q.preventDefault(),ve()),Q.key==="ArrowLeft"&&(Q.preventDefault(),ne()))}return document.addEventListener("keydown",q,!0),()=>document.removeEventListener("keydown",q,!0)},[g,p,P,Me,C,Y,ve,ne]);const Ae=y.useCallback(()=>c?Oe(Ht(c,c))?.getBoundingClientRect()??null:null,[c,Oe]),ke=y.useMemo(()=>({setTextResolvers:f,helpMode:g,toggleHelpMode:Me,exitHelpMode:$,tourIndex:p,startTour:j,endTour:Y,nextStep:ve,prevStep:ne,goToStep:W,positions:T,position:p===null?void 0:T[p],stepCount:D,tours:E,tourName:S,tourMeta:m.tourMeta,overviewOpen:w,setOverviewOpen:k,...a?{widgets:a}:{},showAddresses:F,toggleAddresses:O,content:m,activeId:P,showEntry:U,dismissEntry:C,resolveAnchor:Oe,centerRect:Ae}),[g,Me,$,p,j,Y,ve,ne,W,T,D,E,S,w,a,F,O,m,P,U,C,Oe,Ae]);return u.jsx(Bl.Provider,{value:ke,children:l})}function Tr(e,t){const n=String(e);if(typeof t!="string")throw new TypeError("Expected character");let i=0,s=n.indexOf(t);for(;s!==-1;)i++,s=n.indexOf(t,s+t.length);return i}const hg=["AElig","AMP","Aacute","Acirc","Agrave","Aring","Atilde","Auml","COPY","Ccedil","ETH","Eacute","Ecirc","Egrave","Euml","GT","Iacute","Icirc","Igrave","Iuml","LT","Ntilde","Oacute","Ocirc","Ograve","Oslash","Otilde","Ouml","QUOT","REG","THORN","Uacute","Ucirc","Ugrave","Uuml","Yacute","aacute","acirc","acute","aelig","agrave","amp","aring","atilde","auml","brvbar","ccedil","cedil","cent","copy","curren","deg","divide","eacute","ecirc","egrave","eth","euml","frac12","frac14","frac34","gt","iacute","icirc","iexcl","igrave","iquest","iuml","laquo","lt","macr","micro","middot","nbsp","not","ntilde","oacute","ocirc","ograve","ordf","ordm","oslash","otilde","ouml","para","plusmn","pound","quot","raquo","reg","sect","shy","sup1","sup2","sup3","szlig","thorn","times","uacute","ucirc","ugrave","uml","uuml","yacute","yen","yuml"],Cr={0:"�",128:"€",130:"‚",131:"ƒ",132:"„",133:"…",134:"†",135:"‡",136:"ˆ",137:"‰",138:"Š",139:"‹",140:"Œ",142:"Ž",145:"‘",146:"’",147:"“",148:"”",149:"•",150:"–",151:"—",152:"˜",153:"™",154:"š",155:"›",156:"œ",158:"ž",159:"Ÿ"};function Kl(e){const t=typeof e=="string"?e.charCodeAt(0):e;return t>=48&&t<=57}function ug(e){const t=typeof e=="string"?e.charCodeAt(0):e;return t>=97&&t<=102||t>=65&&t<=70||t>=48&&t<=57}function dg(e){const t=typeof e=="string"?e.charCodeAt(0):e;return t>=97&&t<=122||t>=65&&t<=90}function Ar(e){return dg(e)||Kl(e)}const fg=["","Named character references must be terminated by a semicolon","Numeric character references must be terminated by a semicolon","Named character references cannot be empty","Numeric character references cannot be empty","Named character references must be known","Numeric character references cannot be disallowed","Numeric character references cannot be outside the permissible Unicode range"];function Vs(e,t){const n=t||{},i=typeof n.additional=="string"?n.additional.charCodeAt(0):n.additional,s=[];let r=0,o=-1,a="",c,l;n.position&&("start"in n.position||"indent"in n.position?(l=n.position.indent,c=n.position.start):c=n.position);let h=(c?c.line:0)||1,f=(c?c.column:0)||1,d=g(),m;for(r--;++r<=e.length;)if(m===10&&(f=(l?l[o]:0)||1),m=e.charCodeAt(r),m===38){const x=e.charCodeAt(r+1);if(x===9||x===10||x===12||x===32||x===38||x===60||Number.isNaN(x)||i&&x===i){a+=String.fromCharCode(m),f++;continue}const S=r+1;let v=S,w=S,k;if(x===35){w=++v;const O=e.charCodeAt(w);O===88||O===120?(k="hexadecimal",w=++v):k="decimal"}else k="named";let E="",T="",D="";const P=k==="named"?Ar:k==="decimal"?Kl:ug;for(w--;++w<=e.length;){const O=e.charCodeAt(w);if(!P(O))break;D+=String.fromCharCode(O),k==="named"&&hg.includes(D)&&(E=D,T=Gs(D))}let N=e.charCodeAt(w)===59;if(N){w++;const O=k==="named"?Gs(D):!1;O&&(E=D,T=O)}let F=1+w-S,B="";if(!(!N&&n.nonTerminated===!1))if(!D)k!=="named"&&b(4,F);else if(k==="named"){if(N&&!T)b(5,1);else if(E!==D&&(w=v+E.length,F=1+w-v,N=!1),!N){const O=E?1:3;if(n.attribute){const $=e.charCodeAt(w);$===61?(b(O,F),T=""):Ar($)?T="":b(O,F)}else b(O,F)}B=T}else{N||b(2,F);let O=Number.parseInt(D,k==="hexadecimal"?16:10);if(pg(O))b(7,F),B="�";else if(O in Cr)b(6,F),B=Cr[O];else{let $="";mg(O)&&b(6,F),O>65535&&(O-=65536,$+=String.fromCharCode(O>>>10|55296),O=56320|O&1023),B=$+String.fromCharCode(O)}}if(B){p(),d=g(),r=w-1,f+=w-S+1,s.push(B);const O=g();O.offset++,n.reference&&n.reference.call(n.referenceContext||void 0,B,{start:d,end:O},e.slice(S-1,w)),d=O}else D=e.slice(S-1,w),a+=D,f+=D.length,r=w-1}else m===10&&(h++,o++,f=0),Number.isNaN(m)?p():(a+=String.fromCharCode(m),f++);return s.join("");function g(){return{line:h,column:f,offset:r+((c?c.offset:0)||0)}}function b(x,S){let v;n.warning&&(v=g(),v.column+=S,v.offset+=S,n.warning.call(n.warningContext||void 0,fg[x],v,x))}function p(){a&&(s.push(a),n.text&&n.text.call(n.textContext||void 0,a,{start:d,end:g()}),a="")}}function pg(e){return e>=55296&&e<=57343||e>1114111}function mg(e){return e>=1&&e<=8||e===11||e>=13&&e<=31||e>=127&&e<=159||e>=64976&&e<=65007||(e&65535)===65535||(e&65535)===65534}const gg=/["&'<>`]/g,yg=/[\uD800-\uDBFF][\uDC00-\uDFFF]/g,bg=/[\x01-\t\v\f\x0E-\x1F\x7F\x81\x8D\x8F\x90\x9D\xA0-\uFFFF]/g,wg=/[|\\{}()[\]^$+*?.]/g,Pr=new WeakMap;function xg(e,t){if(e=e.replace(t.subset?vg(t.subset):gg,i),t.subset||t.escapeOnly)return e;return e.replace(yg,n).replace(bg,i);function n(s,r,o){return t.format((s.charCodeAt(0)-55296)*1024+s.charCodeAt(1)-56320+65536,o.charCodeAt(r+2),t)}function i(s,r,o){return t.format(s.charCodeAt(0),o.charCodeAt(r+1),t)}}function vg(e){let t=Pr.get(e);return t||(t=kg(e),Pr.set(e,t)),t}function kg(e){const t=[];let n=-1;for(;++n<e.length;)t.push(e[n].replace(wg,"\\$&"));return new RegExp("(?:"+t.join("|")+")","g")}function Sg(e){return"&#x"+e.toString(16).toUpperCase()+";"}function Tg(e,t){return xg(e,Object.assign({format:Sg},t))}const Cg={}.hasOwnProperty,Ag={},Er=/^[^\t\n\r "#'.<=>`}]+$/,Pg=/^[^\t\n\r "'<=>`}]+$/;function Eg(){return{canContainEols:["textDirective"],enter:{directiveContainer:Mg,directiveContainerAttributes:mi,directiveContainerLabel:jg,directiveLeaf:Og,directiveLeafAttributes:mi,directiveText:Rg,directiveTextAttributes:mi},exit:{directiveContainer:vi,directiveContainerAttributeClassValue:yi,directiveContainerAttributeIdValue:gi,directiveContainerAttributeName:wi,directiveContainerAttributeValue:bi,directiveContainerAttributes:xi,directiveContainerLabel:Lg,directiveContainerName:pi,directiveLeaf:vi,directiveLeafAttributeClassValue:yi,directiveLeafAttributeIdValue:gi,directiveLeafAttributeName:wi,directiveLeafAttributeValue:bi,directiveLeafAttributes:xi,directiveLeafName:pi,directiveText:vi,directiveTextAttributeClassValue:yi,directiveTextAttributeIdValue:gi,directiveTextAttributeName:wi,directiveTextAttributeValue:bi,directiveTextAttributes:xi,directiveTextName:pi}}}function Dg(e){const t=Ag;if(t.quote!=='"'&&t.quote!=="'"&&t.quote!==null&&t.quote!==void 0)throw new Error("Invalid quote `"+t.quote+"`, expected `'` or `\"`");return n.peek=Ng,{handlers:{containerDirective:n,leafDirective:n,textDirective:n},unsafe:[{character:"\r",inConstruct:["leafDirectiveLabel","containerDirectiveLabel"]},{character:`
`,inConstruct:["leafDirectiveLabel","containerDirectiveLabel"]},{before:"[^:]",character:":",after:"[A-Za-z]",inConstruct:["phrasing"]},{atBreak:!0,character:":",after:":"}]};function n(r,o,a,c){const l=a.createTracker(c),h=Vg(r),f=a.enter(r.type);let d=l.move(h+(r.name||"")),m;if(r.type==="containerDirective"){const g=(r.children||[])[0];m=Dr(g)?g:void 0}else m=r;if(m&&m.children&&m.children.length>0){const g=a.enter("label"),b=`${r.type}Label`,p=a.enter(b);d+=l.move("["),d+=l.move(a.containerPhrasing(m,{...l.current(),before:d,after:"]"})),d+=l.move("]"),p(),g()}if(d+=l.move(i(r,a)),r.type==="containerDirective"){const g=(r.children||[])[0];let b=r;Dr(g)&&(b=Object.assign({},r,{children:r.children.slice(1)})),b&&b.children&&b.children.length>0&&(d+=l.move(`
`),d+=l.move(a.containerFlow(b,l.current()))),d+=l.move(`
`+h)}return f(),d}function i(r,o){const a=r.attributes||{},c=[];let l,h,f,d;for(d in a)if(Cg.call(a,d)&&a[d]!==void 0&&a[d]!==null){const m=String(a[d]);if(d==="id")f=t.preferShortcut!==!1&&Er.test(m)?"#"+m:s("id",m,r,o);else if(d==="class"){const g=m.split(/[\t\n\r ]+/g),b=[],p=[];let x=-1;for(;++x<g.length;)(t.preferShortcut!==!1&&Er.test(g[x])?p:b).push(g[x]);l=b.length>0?s("class",b.join(" "),r,o):"",h=p.length>0?"."+p.join("."):""}else c.push(s(d,m,r,o))}return l&&c.unshift(l),h&&c.unshift(h),f&&c.unshift(f),c.length>0?"{"+c.join(" ")+"}":""}function s(r,o,a,c){if(t.collapseEmptyAttributes!==!1&&!o)return r;if(t.preferUnquoted&&Pg.test(o))return r+"="+o;const l=t.quote||c.options.quote||'"',h=l==='"'?"'":'"',f=t.quoteSmart&&Tr(o,l)>Tr(o,h)?h:l,d=a.type==="textDirective"?[f]:[f,`
`,"\r"];return r+"="+f+Tg(o,{subset:d})+f}}function Mg(e){Is.call(this,"containerDirective",e)}function Og(e){Is.call(this,"leafDirective",e)}function Rg(e){Is.call(this,"textDirective",e)}function Is(e,t){this.enter({type:e,name:"",attributes:{},children:[]},t)}function pi(e){const t=this.stack[this.stack.length-1];Nr(t.type==="containerDirective"||t.type==="leafDirective"||t.type==="textDirective"),t.name=this.sliceSerialize(e)}function jg(e){this.enter({type:"paragraph",data:{directiveLabel:!0},children:[]},e)}function Lg(e){this.exit(e)}function mi(){this.data.directiveAttributes=[],this.buffer()}function gi(e){this.data.directiveAttributes.push(["id",Vs(this.sliceSerialize(e),{attribute:!0})])}function yi(e){this.data.directiveAttributes.push(["class",Vs(this.sliceSerialize(e),{attribute:!0})])}function bi(e){const t=this.data.directiveAttributes;t[t.length-1][1]=Vs(this.sliceSerialize(e),{attribute:!0})}function wi(e){this.data.directiveAttributes.push([this.sliceSerialize(e),""])}function xi(){const e=this.data.directiveAttributes,t={};let n=-1;for(;++n<e.length;){const s=e[n];s[0]==="class"&&t.class?t.class+=" "+s[1]:t[s[0]]=s[1]}this.data.directiveAttributes=void 0,this.resume();const i=this.stack[this.stack.length-1];Nr(i.type==="containerDirective"||i.type==="leafDirective"||i.type==="textDirective"),i.attributes=t}function vi(e){this.exit(e)}function Ng(){return":"}function Dr(e){return!!(e&&e.type==="paragraph"&&e.data&&e.data.directiveLabel)}function Vg(e){let t=0;return e.type==="containerDirective"?(pc(e,function(n,i){if(n.type==="containerDirective"){let s=i.length,r=0;for(;s--;)i[s].type==="containerDirective"&&r++;r>t&&(t=r)}}),t+=3):e.type==="leafDirective"?t=2:t=1,":".repeat(t)}function Bs(e,t,n,i,s,r,o,a,c,l,h,f,d,m,g){let b,p;return x;function x(C){return e.enter(i),e.enter(s),e.consume(C),e.exit(s),S}function S(C){return C===35?(b=o,v(C)):C===46?(b=a,v(C)):g&&Gn(C)?qe(e,S,"whitespace")(C):!g&&tt(C)?Xt(e,S)(C):C===null||Ce(C)||Sn(C)||Tn(C)&&C!==45&&C!==95?$(C):(e.enter(r),e.enter(c),e.consume(C),E)}function v(C){const U=b+"Marker";return e.enter(r),e.enter(b),e.enter(U),e.consume(C),e.exit(U),w}function w(C){if(C===null||C===34||C===35||C===39||C===46||C===60||C===61||C===62||C===96||C===125||tt(C))return n(C);const U=b+"Value";return e.enter(U),e.consume(C),k}function k(C){if(C===null||C===34||C===39||C===60||C===61||C===62||C===96)return n(C);if(C===35||C===46||C===125||tt(C)){const U=b+"Value";return e.exit(U),e.exit(b),e.exit(r),S(C)}return e.consume(C),k}function E(C){return C===null||Ce(C)||Sn(C)||Tn(C)&&C!==45&&C!==46&&C!==58&&C!==95?(e.exit(c),g&&Gn(C)?qe(e,T,"whitespace")(C):!g&&tt(C)?Xt(e,T)(C):T(C)):(e.consume(C),E)}function T(C){return C===61?(e.enter(l),e.consume(C),e.exit(l),D):(e.exit(r),S(C))}function D(C){return C===null||C===60||C===61||C===62||C===96||C===125||g&&Ce(C)?n(C):C===34||C===39?(e.enter(h),e.enter(d),e.consume(C),e.exit(d),p=C,N):g&&Gn(C)?qe(e,D,"whitespace")(C):!g&&tt(C)?Xt(e,D)(C):(e.enter(f),e.enter(m),e.consume(C),p=void 0,P)}function P(C){return C===null||C===34||C===39||C===60||C===61||C===62||C===96?n(C):C===125||tt(C)?(e.exit(m),e.exit(f),e.exit(r),S(C)):(e.consume(C),P)}function N(C){return C===p?(e.enter(d),e.consume(C),e.exit(d),e.exit(h),e.exit(r),O):(e.enter(f),F(C))}function F(C){return C===p?(e.exit(f),N(C)):C===null?n(C):Ce(C)?g?n(C):Xt(e,F)(C):(e.enter(m),e.consume(C),B)}function B(C){return C===p||C===null||Ce(C)?(e.exit(m),F(C)):(e.consume(C),B)}function O(C){return C===125||tt(C)?S(C):$(C)}function $(C){return C===125?(e.enter(s),e.consume(C),e.exit(s),e.exit(i),t):n(C)}}function $s(e,t,n,i,s,r,o){let a=0,c=0,l;return h;function h(p){return e.enter(i),e.enter(s),e.consume(p),e.exit(s),f}function f(p){return p===93?(e.enter(s),e.consume(p),e.exit(s),e.exit(i),t):(e.enter(r),d(p))}function d(p){if(p===93&&!c)return b(p);const x=e.enter("chunkText",{_contentTypeTextTrailing:!0,contentType:"text",previous:l});return l&&(l.next=x),l=x,m(p)}function m(p){return p===null||a>999||p===91&&++c>32?n(p):p===93&&!c--?(e.exit("chunkText"),b(p)):Ce(p)?o?n(p):(e.consume(p),e.exit("chunkText"),d):(e.consume(p),p===92?g:m)}function g(p){return p===91||p===92||p===93?(e.consume(p),a++,m):m(p)}function b(p){return e.exit(r),e.enter(s),e.consume(p),e.exit(s),e.exit(i),t}}function Fs(e,t,n,i){const s=this;return r;function r(a){return a===null||Ce(a)||Tn(a)||Sn(a)?n(a):(e.enter(i),e.consume(a),o)}function o(a){return a===null||Ce(a)||Sn(a)||Tn(a)&&a!==45&&a!==95?(e.exit(i),s.previous===45||s.previous===95?n(a):t(a)):(e.consume(a),o)}}const Ig={tokenize:Fg,concrete:!0},Bg={tokenize:_g,partial:!0},$g={tokenize:Hg,partial:!0},dn={tokenize:zg,partial:!0};function Fg(e,t,n){const i=this,s=i.events[i.events.length-1],r=s&&s[1].type==="linePrefix"?s[2].sliceSerialize(s[1],!0).length:0;let o=0,a;return c;function c(P){return e.enter("directiveContainer"),e.enter("directiveContainerFence"),e.enter("directiveContainerSequence"),l(P)}function l(P){return P===58?(e.consume(P),o++,l):o<3?n(P):(e.exit("directiveContainerSequence"),Fs.call(i,e,h,n,"directiveContainerName")(P))}function h(P){return P===91?e.attempt(Bg,f,f)(P):f(P)}function f(P){return P===123?e.attempt($g,d,d)(P):d(P)}function d(P){return qe(e,m,"whitespace")(P)}function m(P){return e.exit("directiveContainerFence"),P===null?T(P):Ce(P)?i.interrupt?t(P):e.attempt(dn,g,T)(P):n(P)}function g(P){return P===null?T(P):Ce(P)?e.check(dn,v,T)(P):(e.enter("directiveContainerContent"),b(P))}function b(P){return e.attempt({tokenize:D,partial:!0},E,r?qe(e,p,"linePrefix",r+1):p)(P)}function p(P){return P===null?E(P):Ce(P)?e.check(dn,S,E)(P):S(P)}function x(P){if(P===null){const N=e.exit("chunkDocument");return i.parser.lazy[N.start.line]=!1,E(P)}return Ce(P)?e.check(dn,w,k)(P):(e.consume(P),x)}function S(P){const N=e.enter("chunkDocument",{contentType:"document",previous:a});return a&&(a.next=N),a=N,x(P)}function v(P){return e.enter("directiveContainerContent"),b(P)}function w(P){e.consume(P);const N=e.exit("chunkDocument");return i.parser.lazy[N.start.line]=!1,b}function k(P){const N=e.exit("chunkDocument");return i.parser.lazy[N.start.line]=!1,E(P)}function E(P){return e.exit("directiveContainerContent"),T(P)}function T(P){return e.exit("directiveContainer"),t(P)}function D(P,N,F){let B=0;return qe(P,O,"linePrefix",i.parser.constructs.disable.null.includes("codeIndented")?void 0:4);function O(U){return P.enter("directiveContainerFence"),P.enter("directiveContainerSequence"),$(U)}function $(U){return U===58?(P.consume(U),B++,$):B<o?F(U):(P.exit("directiveContainerSequence"),qe(P,C,"whitespace")(U))}function C(U){return U===null||Ce(U)?(P.exit("directiveContainerFence"),N(U)):F(U)}}}function _g(e,t,n){return $s(e,t,n,"directiveContainerLabel","directiveContainerLabelMarker","directiveContainerLabelString",!0)}function Hg(e,t,n){return Bs(e,t,n,"directiveContainerAttributes","directiveContainerAttributesMarker","directiveContainerAttribute","directiveContainerAttributeId","directiveContainerAttributeClass","directiveContainerAttributeName","directiveContainerAttributeInitializerMarker","directiveContainerAttributeValueLiteral","directiveContainerAttributeValue","directiveContainerAttributeValueMarker","directiveContainerAttributeValueData",!0)}function zg(e,t,n){const i=this;return s;function s(o){return e.enter("lineEnding"),e.consume(o),e.exit("lineEnding"),r}function r(o){return i.parser.lazy[i.now().line]?n(o):t(o)}}const Wg={tokenize:Kg},Gg={tokenize:qg,partial:!0},Ug={tokenize:Qg,partial:!0};function Kg(e,t,n){const i=this;return s;function s(h){return e.enter("directiveLeaf"),e.enter("directiveLeafSequence"),e.consume(h),r}function r(h){return h===58?(e.consume(h),e.exit("directiveLeafSequence"),Fs.call(i,e,o,n,"directiveLeafName")):n(h)}function o(h){return h===91?e.attempt(Gg,a,a)(h):a(h)}function a(h){return h===123?e.attempt(Ug,c,c)(h):c(h)}function c(h){return qe(e,l,"whitespace")(h)}function l(h){return h===null||Ce(h)?(e.exit("directiveLeaf"),t(h)):n(h)}}function qg(e,t,n){return $s(e,t,n,"directiveLeafLabel","directiveLeafLabelMarker","directiveLeafLabelString",!0)}function Qg(e,t,n){return Bs(e,t,n,"directiveLeafAttributes","directiveLeafAttributesMarker","directiveLeafAttribute","directiveLeafAttributeId","directiveLeafAttributeClass","directiveLeafAttributeName","directiveLeafAttributeInitializerMarker","directiveLeafAttributeValueLiteral","directiveLeafAttributeValue","directiveLeafAttributeValueMarker","directiveLeafAttributeValueData",!0)}const Yg={tokenize:ey,previous:Jg},Xg={tokenize:ty,partial:!0},Zg={tokenize:ny,partial:!0};function Jg(e){return e!==58||this.events[this.events.length-1][1].type==="characterEscape"}function ey(e,t,n){const i=this;return s;function s(c){return e.enter("directiveText"),e.enter("directiveTextMarker"),e.consume(c),e.exit("directiveTextMarker"),Fs.call(i,e,r,n,"directiveTextName")}function r(c){return c===58?n(c):c===91?e.attempt(Xg,o,o)(c):o(c)}function o(c){return c===123?e.attempt(Zg,a,a)(c):a(c)}function a(c){return e.exit("directiveText"),t(c)}}function ty(e,t,n){return $s(e,t,n,"directiveTextLabel","directiveTextLabelMarker","directiveTextLabelString")}function ny(e,t,n){return Bs(e,t,n,"directiveTextAttributes","directiveTextAttributesMarker","directiveTextAttribute","directiveTextAttributeId","directiveTextAttributeClass","directiveTextAttributeName","directiveTextAttributeInitializerMarker","directiveTextAttributeValueLiteral","directiveTextAttributeValue","directiveTextAttributeValueMarker","directiveTextAttributeValueData")}function iy(){return{text:{58:Yg},flow:{58:[Ig,Wg]}}}function sy(){const t=this.data(),n=t.micromarkExtensions||(t.micromarkExtensions=[]),i=t.fromMarkdownExtensions||(t.fromMarkdownExtensions=[]),s=t.toMarkdownExtensions||(t.toMarkdownExtensions=[]);n.push(iy()),i.push(Eg()),s.push(Dg())}const Mr={size:e=>`font-size:${e}`,color:e=>`color:${e}`,bg:e=>`background-color:${e}`,opacity:e=>`opacity:${e}`,nowrap:()=>"white-space:nowrap"},oy="s",ry=/^[\w.#%(),\s-]*$/;function ay(e){const t=[];for(const[n,i]of Object.entries(e??{})){if(!(n in Mr))continue;const s=(i??"").trim();!ry.test(s)||/url\s*\(/i.test(s)||t.push(Mr[n](s))}return t.join(";")}const ly=new Set(["textDirective","leafDirective","containerDirective"]);function ql(e){if(ly.has(e.type)){const t=e.type==="textDirective",n=e.name===oy?ay(e.attributes):"";e.data={...e.data,hName:t?"span":"div",hProperties:n?{style:n,className:"help-styled"}:{}}}for(const t of e.children??[])ql(t)}function cy(){return e=>{ql(e)}}const hy=[sy,cy],ns={a:({href:e,children:t})=>u.jsx("a",{href:e,target:"_blank",rel:"noreferrer",children:t}),blockquote:({children:e})=>u.jsxs("div",{className:"help-popover-alert",role:"note",children:[u.jsx("span",{className:"help-popover-alert-mark","aria-hidden":"true",children:"!"}),u.jsx("div",{children:e})]})},is="widget:",uy=e=>e.startsWith(is)?e:mc(e);function dy(e){return function({src:n,alt:i}){if(n?.startsWith(is)){const s=n.slice(is.length),r=s.indexOf(":"),o=r===-1?s:s.slice(0,r),a=r===-1?"":s.slice(r+1);return e?.[o]?.(a)??u.jsx("span",{children:i})}return u.jsx("img",{src:n,alt:i})}}function fy(e){try{return localStorage.getItem(e)}catch{return null}}function py(e,t){try{localStorage.setItem(e,t)}catch{}}const Ql="help-once-",ki="data-help-anchor",Si="data-help-spotlight",Or="data-help-hint",my="--help-hint",gy=40;function yy(e){return e.split(`
`).filter(t=>!/^\s{0,3}>/.test(t)).join(`
`).replace(/\n{3,}/g,`

`).trim()}function by(e){return fy(Ql+e)==="1"}function wy(e){py(Ql+e,"1")}function xy(e){return{...ns,blockquote:({children:t})=>u.jsxs("div",{className:"help-popover-alert",role:"note",children:[u.jsx("span",{className:"help-popover-alert-mark","aria-hidden":"true",children:"!"}),u.jsxs("div",{children:[t,u.jsxs("label",{className:"help-popover-alert-once",children:[u.jsx("input",{type:"checkbox",onChange:e}),"Don't show this again"]})]})]})}}function vy(){const{helpMode:e,tourIndex:t,position:n,positions:i,stepCount:s,content:r,activeId:o,dismissEntry:a,nextStep:c,prevStep:l,endTour:h,showEntry:f,resolveAnchor:d,centerRect:m,showAddresses:g,tourName:b,tourMeta:p,widgets:x}=ht(),S=b===void 0?void 0:p.get(b)?.abbr??b,[v,w]=y.useState(!1),k=t!==null;y.useEffect(()=>{k||w(!1)},[k]);const E=o?r.entries.get(o):void 0,T=Vl(),D=d,P=k?n?.anchor:E?.anchor,N=k?n?.spotlight:E?.spotlight,F=(k?n?.highlight:E?.highlight)??"dim",B=()=>{if(!n||n.beatCount===0)return null;const G=n.beatIndex+1;return u.jsx("span",{className:"help-tour-dots",title:`Screen ${G+1} of ${n.beatCount+1} in this step`,children:Array.from({length:n.beatCount},(se,de)=>u.jsx("span",{className:de<G?"help-dot help-dot-on":"help-dot"},de))})},[O,$]=y.useState(!1),[C,U]=y.useState(!1),[xe,L]=y.useState(void 0),[W,j]=y.useState(!1),Y=y.useRef(null),[,ve]=y.useState(0),ne=E?.once,Me=ne!==void 0&&by(ne),Oe=y.useMemo(()=>({...ne===void 0?ns:xy(()=>{wy(ne),ve(G=>G+1)}),img:dy(x)}),[ne,x]),Ae=(k?n?.blocks??[]:[E?.description??""]).map(G=>Me?yy(G):G).filter(Boolean),ke=(k?n?.width:void 0)??Math.max(Ey(Ae.join(`

`)),k?Dy():0),q=y.useRef(!1);y.useEffect(()=>{q.current=!1},[o,P]);const Q=T.reset;y.useEffect(()=>{Q()},[o,t,Q]),y.useLayoutEffect(()=>{if(!o){$(!1),L(void 0);return}let G=null;const se=()=>{const ae=D(P);ae!==G&&(G?.removeAttribute(ki),G=ae,$(!!ae),L(ae?.closest("[data-graph-direction]")?.getAttribute("data-graph-direction")==="RIGHT"?"below":void 0),ae&&(ae.setAttribute(ki,""),q.current||(q.current=!0,ae.scrollIntoView({block:"center",behavior:"smooth"}))))};se();const de=new MutationObserver(se);return de.observe(document.body,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["data-help-id"]}),()=>{de.disconnect(),G?.removeAttribute(ki),$(!1),L(void 0)}},[o,P,D]),y.useLayoutEffect(()=>{if(!o||!N){U(!1);return}let G=null;const se=()=>{const ae=D(N);ae!==G&&(G?.removeAttribute(Si),G=ae,U(!!ae),ae?.setAttribute(Si,""))};se();const de=new MutationObserver(se);return de.observe(document.body,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["data-help-id"]}),()=>{de.disconnect(),G?.removeAttribute(Si),U(!1)}},[o,N,D]);const te=600,re=k&&n?.change!=null&&P!==void 0&&P.kind!=="none",[Se,$e]=y.useState(!1);y.useEffect(()=>{if(!re){$e(!0);return}$e(!1);const G=window.setTimeout(()=>$e(!0),te);return()=>window.clearTimeout(G)},[re,t]);const Pe=Se||O,Tt=k?n?.address??"tour":o??"none";y.useEffect(()=>{const G=Y.current;G&&(E&&Pe?G.matches(":popover-open")||G.showPopover():G.matches(":popover-open")&&G.hidePopover())},[E,Pe,Tt]),y.useEffect(()=>{(!e||k)&&j(!1)},[e,k]);const Je=y.useMemo(()=>e&&!k?[...r.entries.values()].filter(G=>D(G.anchor)).slice(0,gy).map((G,se)=>({id:G.id,title:G.title,name:`${my}-${se}`})):[],[e,k,r,D]);return y.useLayoutEffect(()=>{const G=Je.map(se=>{const de=D(r.entries.get(se.id)?.anchor);return de?.setAttribute(Or,se.name),de}).filter(Boolean);return()=>G.forEach(se=>se.removeAttribute(Or))},[Je,r,D]),u.jsxs(u.Fragment,{children:[(C||O)&&o&&F!=="none"&&u.jsx("div",{className:`help-spotlight${F==="ring"?" help-spotlight-ring":""}`,"data-on-spotlight":C?"":void 0}),Je.map(({id:G,title:se,name:de})=>u.jsx("button",{className:"help-hint",title:se??G,style:{positionAnchor:de},onMouseEnter:()=>{W||f(G)},onMouseLeave:()=>{W||a()},onClick:ae=>{ae.stopPropagation(),j(!0),f(G)},children:"?"},G)),u.jsx("div",{ref:Y,popover:"manual","data-help-popover":"","data-anchored":O&&!T.offset?"":void 0,className:"help-popover",style:{...My(O,k?n?.position:void 0,k?n?.offsetX:void 0,ke,O?null:m(),xe),...T.offset?{positionArea:"none",left:T.offset.left,top:T.offset.top,right:"auto",bottom:"auto",margin:0,transform:"none"}:{}},children:E&&u.jsxs(u.Fragment,{children:[u.jsxs("h4",{className:"help-popover-title",onPointerDown:T.onPointerDown,style:{cursor:T.offset?"grabbing":"grab",userSelect:"none"},title:"Drag to move",children:[k&&S&&u.jsx("span",{className:"help-popover-tour",children:S}),E.title]}),k&&n?.action&&u.jsxs("div",{className:"help-popover-action",children:[u.jsx("span",{className:"help-popover-action-mark","aria-hidden":"true",children:"✓"}),u.jsx("div",{children:u.jsx(Zt,{children:n.action})})]}),k&&g&&n?.change&&!n.action&&u.jsxs("div",{className:"help-popover-action",style:{opacity:.85},children:[u.jsx("span",{className:"help-popover-action-mark","aria-hidden":"true",children:"⚠"}),u.jsxs("div",{children:[u.jsx("em",{children:"Authoring:"})," this position changes the app (",u.jsx("code",{children:n.change}),") but has no ",u.jsx("code",{children:"Action:"}),"."]})]}),Ae.length>0&&u.jsx("div",{className:"help-popover-body",children:Ae.map((G,se,de)=>u.jsx("div",{className:se===de.length-1?void 0:"help-beat-past",children:u.jsx(Zt,{components:Oe,urlTransform:uy,remarkPlugins:hy,children:G})},se))}),E.interactions.length>0&&u.jsx("ul",{className:"help-popover-interactions",children:E.interactions.map((G,se)=>u.jsx("li",{children:u.jsx(Zt,{components:ns,children:G})},se))}),E.shortcut&&u.jsxs("p",{className:"help-popover-shortcut",children:["Shortcut: ",u.jsx("kbd",{children:E.shortcut})]}),E.context&&u.jsx("div",{className:"help-popover-context",children:u.jsx(Zt,{children:E.context})}),k?u.jsxs("div",{className:"help-tour-nav",children:[u.jsxs("span",{className:"help-tour-count",title:`Position ${t+1} of ${i.length}`,children:[n?.step," / ",s]}),B(),u.jsx("button",{className:"help-tour-map-btn",onClick:()=>w(G=>!G),"aria-expanded":v,title:"Show the tour outline",children:"⊞"}),u.jsx("span",{className:"help-tour-spacer"}),u.jsx("button",{onClick:l,disabled:t===0,title:"Previous (← arrow key)",children:"← back"}),u.jsx("button",{onClick:c,className:"help-tour-next",title:"Next (→ arrow key)",children:t+1===i.length?"done":"next →"}),u.jsx("button",{onClick:h,title:"End the tour and undo what it added (Esc)",children:"✕"})]}):u.jsxs("div",{className:"help-tour-nav",children:[u.jsx("span",{className:"help-tour-spacer"}),u.jsx("button",{onClick:()=>{j(!1),a()},children:"close"})]}),g&&u.jsx(ky,{address:k?n?.address:E.id,searchFor:k?n?.searchFor:`### ${E.id}`})]})},Tt),v&&k&&u.jsx(Ul,{scope:"tour",onClose:()=>w(!1)})]})}function ky({address:e,searchFor:t}){const[n,i]=y.useState(!1);return y.useEffect(()=>{if(!n)return;const s=setTimeout(()=>i(!1),1200);return()=>clearTimeout(s)},[n]),!e||!t?null:u.jsxs("button",{type:"button",className:"help-popover-address",title:`Copy “${t}” — search help-content.md for it`,onClick:()=>{navigator.clipboard?.writeText(t).then(()=>i(!0),()=>{})},children:[e,n?" ✓":""]})}const Yl=320,Sy=320,Ty=800,Cy=8,Ay=24,Py=3;function Ey(e){const t=e.trim().length;return t===0?Yl:Math.round(Math.min(Ty,Math.max(Sy,Math.sqrt(t*Cy*Ay*Py))))}function Dy(){return 393}function My(e,t,n,i,s,r){const o=window.innerWidth,a=window.innerHeight,c=Math.min(i??Yl,o-16);if(!e){const h=s??new DOMRect(0,0,o,a),f=h.left+h.width/2;return{left:Math.max(8,Math.min(f-c/2,o-c-8)),top:"50%",transform:"translateY(-50%)",maxHeight:`${a-16}px`,width:c}}return{positionArea:t?{right:"inline-end span-block-end",left:"inline-start span-block-end",top:"block-start span-inline-end",bottom:"block-end span-inline-end"}[t]:r==="below"?"block-end span-inline-end":"inline-end span-block-end",width:c,...Oy(n)}}function Oy(e){return e?{marginLeft:"px"in e?`${e.px}px`:`calc(anchor-size(${e.of}) * ${e.times})`}:{}}const Ti=e=>e&&e.trim()?e.trim():void 0;function Ry(e){return{"model-description":t=>Ti(e.getClassDescription(t)),"enum-description":t=>Ti(e.getEnumDetail(t)?.description),"category-label":t=>Ti(Lr.find(n=>n.id===t)?.label),edge:t=>t in ie.kinds?`![${ie.kinds[t].label}](widget:edge:${t})`:void 0,relation:t=>{const n=Xl(t);return n?`![${n.left} ${n.right}](widget:relation:${t})`:void 0}}}function Xl(e){const[t,n,i]=e.split(":");return t&&t in ie.kinds&&n&&i?{kind:t,left:n,right:i}:void 0}const jy={edge:e=>e in ie.kinds?u.jsx(Nn,{kind:e,width:40,className:"help-inline-widget"}):null,relation:e=>{const t=Xl(e);return t?u.jsxs("span",{className:"help-inline-relation",children:[u.jsx("code",{children:t.left}),u.jsx(Nn,{kind:t.kind,width:40,className:"help-inline-widget"}),u.jsx("code",{children:t.right})]}):null}},Ly=`# BDCHM Explorer help

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
- **Description:**
  So, when the Explorer has configured an attribute target as
  *belonging to* its defining entity, it places the target to the right and
  draws a forward-pointing arrow.

  \`Condition.affected_body_site\` {{edge:own-fwd}} \`BodySite\`

  hello?
  {{relation:own-fwd:Condition.affected_body_site:BodySite}}

  :s[\`Condition.affected_body_site\`]{size=.7em bg=pink opacity=.4}

  :::s{size=.8em color=blue}
  A whole paragraph, with **bold** and \`code\` still working.
  :::
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
`,_s={inTour:!1,held:[],tempHeld:[],tour:[],region:0,tourStates:[],scalars:{}},Ny="~";function Rr(e,t){return e&&t.includes(e)?e:null}function Zl(e,t=!1){const n=new URLSearchParams(e),i={};if(n.get("panels")==="0"){for(const c of Tl)i[c]=!1;i.detail=null}n.has("detail")&&(i.detail=n.get("detail")||null),n.has("roots")&&(i.roots=n.get("roots")==="1"),n.has("sibs")&&(i.sibs=n.get("sibs")==="1"),n.has("legend")&&(i.legend=n.get("legend")==="1"),n.has("cases")&&(i.cases=n.get("cases")==="1");const s=Rr(n.get("dir"),["RIGHT","DOWN"]);s&&(i.dir=s);const r=Rr(n.get("merge"),["near","far","bend","off"]);r&&(i.merge=r);const o=n.get("sel"),a=o?o.split(Ny).filter(Boolean):Cl(n);return t?{sel:a,scalars:i,replace:!0}:{sel:a,scalars:i}}function It(e,t){return[...new Set([...e,...t])]}function Vy(e){return{..._s,inTour:!0,held:[...e]}}function Iy(){return _s}function By(e){return It(e.held,e.tempHeld)}function Jl(e,t){const n=t.replace?e.region+1:e.region,i=t.replace?[...t.sel]:It(e.tour,t.sel),s={...e.scalars,...t.scalars};return{...e,tour:i,region:n,scalars:s,tourStates:[...e.tourStates,{sel:i,scalars:s,region:n}]}}function ec(e){if(e.tourStates.length===0)return e;const t=e.tourStates.slice(0,-1),n=t[t.length-1];return{...e,tourStates:t,tour:n?n.sel:[],region:n?n.region:0}}function Hs(e){return e.region>0}function $y(e,t){if(!e.inTour)return e;const n=Hs(e)?"tempHeld":"held";return e[n].includes(t)?e:{...e,[n]:[...e[n],t]}}function Fy(e,t){if(!e.inTour)return e;const n=i=>i.filter(s=>s!==t);return{...e,tour:n(e.tour),tempHeld:n(e.tempHeld),held:Hs(e)?e.held:n(e.held)}}function zs(e,t){if(!t.inTour)return e;const n=Hs(t)?It(t.tour,t.tempHeld):It(It(t.tour,t.tempHeld),t.held);return{...e,...t.scalars,sel:n}}function _y(){const{modelData:e,loading:t,error:n}=gc(),i=y.useMemo(()=>e?new yc(e):null,[e]),{setTextResolvers:s}=ht(),r=y.useMemo(()=>i?Ry(i):void 0,[i]);y.useEffect(()=>s(r),[r,s]);const o=y.useMemo(()=>He(),[]),[a,c]=y.useState(()=>new Set(o.sel)),[l,h]=y.useState(o.detail),[f,d]=y.useState(!1),m=y.useRef(!1),[g,b]=y.useState(o.roots),[p,x]=y.useState(o.sibs),[S,v]=y.useState(o.dir),[w,k]=y.useState(o.merge),[E,T]=y.useState(o.cases),[D,P]=y.useState(o.legend),[N,F]=y.useState(!1),B=y.useCallback(L=>{c(new Set(L.sel)),b(!!L.roots),h(null)},[]);y.useEffect(()=>{const L=()=>{const W=He();c(new Set(W.sel)),h(W.detail),b(W.roots),x(W.sibs),v(W.dir),k(W.merge),P(W.legend),T(W.cases)};return window.addEventListener("popstate",L),window.addEventListener("explore:state-from-url",L),()=>{window.removeEventListener("popstate",L),window.removeEventListener("explore:state-from-url",L)}},[]),y.useEffect(()=>{const L={sel:[...a],detail:l,roots:g,sibs:p,dir:S,merge:w,legend:D,cases:E},W=m.current;m.current=!1,Al(L,{push:W})},[a,l,g,p,S,w,D,E]);const O=y.useCallback(L=>{pt(L,!He().sel.includes(L)),c(W=>{const j=new Set(W);return j.has(L)?j.delete(L):j.add(L),j})},[]),$=y.useCallback(L=>{pt(L,!0),c(W=>W.has(L)?W:new Set(W).add(L))},[]),C=y.useCallback(L=>{pt(L,!1),c(W=>{if(!W.has(L))return W;const j=new Set(W);return j.delete(L),j})},[]),U=y.useCallback(L=>{c(j=>j.size===L.length&&L.every(Y=>j.has(Y))?j:(m.current=!0,new Set(L)));const W=new Set(L);for(const j of He().sel)W.has(j)||pt(j,!1);for(const j of L)pt(j,!0)},[]),xe=y.useCallback(()=>{for(const L of He().sel)pt(L,!1);c(new Set),h(null),d(!1),b(!1)},[]);return n?u.jsxs("div",{className:"p-8 text-red-600",children:["Failed to load model data: ",String(n)]}):t||!i?u.jsx("div",{className:"p-8 text-gray-400",children:"Loading model…"}):u.jsxs("div",{className:"relative flex flex-col h-screen bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100",children:[u.jsxs("header",{className:"flex items-center justify-between px-4 py-2 bg-blue-600 text-white shrink-0",children:[u.jsxs("div",{children:[u.jsx("h1",{"data-help-id":"app-title",className:"text-lg font-bold leading-tight cursor-pointer hover:opacity-80 transition-opacity",onClick:xe,title:"Click to clear the selection and reset the view",children:"BDCHM Explorer"}),u.jsx("p",{className:"text-xs text-blue-100",children:"BioData Catalyst Harmonized Model"})]}),u.jsxs("div",{className:"flex items-center gap-4",children:[u.jsx(qy,{}),u.jsx(og,{}),u.jsx(Km,{onOpenLegend:()=>P(L=>!L),onOpenCases:()=>T(L=>!L),legendOpen:D,casesOpen:E,anyPanelOpen:D||E||l!==null,onClosePanels:()=>{P(!1),T(!1),h(null)}}),u.jsx("button",{onClick:async()=>{const L=mm({sel:[...a],detail:l,roots:g,sibs:p,dir:S,merge:w,legend:D,cases:E});try{await navigator.clipboard.writeText(L),F(!0),window.setTimeout(()=>F(!1),1500)}catch{F(!1),window.prompt("Copy this link:",L)}},"data-help-id":"copy-link",className:"text-sm underline text-blue-100 hover:text-white",title:"Copy a link that reproduces exactly this view, settings included",children:N?"✓ copied":"copy link"}),u.jsx("a",{href:"/dynamic-model-var-docs/previous.html",className:"text-sm underline text-blue-100 hover:text-white",children:"previous views"}),u.jsx("a",{href:"https://github.com/Sigfried/dynamic-model-var-docs",target:"_blank",rel:"noopener noreferrer",className:"text-blue-100 hover:text-white",title:"Source code on GitHub","aria-label":"Source code on GitHub",children:u.jsx("svg",{viewBox:"0 0 16 16",width:"18",height:"18",fill:"currentColor","aria-hidden":!0,children:u.jsx("path",{d:"M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"})})})]})]}),D&&u.jsx(Hm,{onClose:()=>P(!1),onSelect:L=>B({name:"ad hoc",note:"",sel:L}),dataService:i}),E&&u.jsx(Bm,{onClose:()=>T(!1),onApply:B,selectedIds:a,dataService:i,offset:D}),u.jsxs("div",{className:"flex-1 flex min-h-0",children:[f?u.jsxs("button",{onClick:()=>d(!1),title:"Show entity selection",className:`shrink-0 w-8 border-r border-gray-200 dark:border-slate-700
                       bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700
                       flex flex-col items-center gap-2 py-2 text-gray-400`,children:[u.jsx("span",{className:"text-xs",children:"▶"}),u.jsxs("span",{className:"text-[10px] uppercase tracking-wider [writing-mode:vertical-rl]",children:[i.getConceptLabel("entity",!0),a.size>0?` (${a.size})`:""]})]}):u.jsxs("div",{className:"w-80 shrink-0 flex flex-col min-h-0 border-r border-gray-200 dark:border-slate-700",children:[u.jsx("div",{className:"flex-1 overflow-y-auto min-h-0","data-help-id":"selection-tree",children:u.jsx(Pc,{dataService:i,selectedIds:a,onToggle:O,onShowCategory:U})}),u.jsx("button",{onClick:()=>d(!0),title:"Hide entity selection",className:`shrink-0 px-3 py-1 text-xs text-gray-400 border-t border-gray-200
                         dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 text-left`,children:"◀ Hide"})]}),u.jsx("div",{className:"flex-1 min-w-0","data-help-id":"graph-canvas",children:a.size===0?u.jsx("div",{className:"h-full flex items-center justify-center text-sm text-gray-400 p-8",children:"Select entities on the left to build the ownership subgraph."}):u.jsx(Rm,{dataService:i,selectedIds:a,onNodeClick:h,onAdd:$,onRemove:C,pathToRoot:g,onTogglePathToRoot:()=>b(L=>!L),direction:S,setDirection:v,mergeMode:w,setMergeMode:k,mergeSibs:p,setMergeSibs:x})}),l&&u.jsx(jm,{classId:l,dataService:i,onClose:()=>h(null),onNavigate:h,isSelected:a.has(l),onToggleSelect:O})]})]})}let fe=_s;function pt(e,t){fe=t?$y(fe,e):Fy(fe,e)}function zn(e){Al(e),window.dispatchEvent(new Event("explore:state-from-url"))}function Hy(){fe=Vy(He().sel)}function zy(){if(!fe.inTour)return;const e=By(fe),t=He();fe=Iy(),zn({...t,sel:e})}function Wy(e,t=!1){fe=Jl(fe,Zl(e,t)),zn(zs(He(),fe))}function Gy(){fe=ec(fe),zn(zs(He(),fe))}function Uy(e,t){for(let n=0;n<t;n++)fe=ec(fe);for(const n of e)fe=Jl(fe,Zl(n.query,n.replace));zn(zs(He(),fe))}function Ky(){return u.jsxs(cg,{markdown:Ly,widgets:jy,onPushChange:Wy,onPopChange:Gy,onJumpChanges:Uy,onTourStart:Hy,onTourEnd:zy,children:[u.jsx(_y,{}),u.jsx(vy,{})]})}function qy(){const{helpMode:e,toggleHelpMode:t,startTour:n}=ht();return y.useEffect(()=>{dm()&&n()},[]),u.jsx("span",{className:"flex items-center gap-2","data-help-id":"help-button",children:zm})}bc.createRoot(document.getElementById("root")).render(u.jsx(y.StrictMode,{children:u.jsx(Ky,{})}));
