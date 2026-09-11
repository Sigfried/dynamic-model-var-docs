import{i as Ei,p as oc,r as y,j as u,E as Te,g as rc,a as Nr,b as Vr,S as ac,c as lc,d as cc,s as hc,w as uc,R as ze,e as dc,f as fc,m as pc,h as mc,k as Ir,l as Ks,o as Br,v as gc,n as qn,q as Ye,t as nt,u as Jt,x as Pe,y as Cn,z as An,M as en,A as yc,B as bc,D as wc,C as xc}from"./index-DwKnoFRI.js";function $r(e){return[...new Set([...e.classIds,...e.pins])]}const vc=e=>`entity-row:${e}`,kc=e=>`entity-checkbox:${e}`,Sc=e=>`category-row:${e}`,Tc=e=>`node-box:${e}`,Cc=e=>`child-header:${e}`,Ac=(e,t)=>`slot-row:${e}.${t}`,Fr=e=>Ei(e.id)?oc(e.id):e.id,Pc=e=>Tc(Fr(e)),Ec=(e,t)=>Ac(t.declaringClass??Fr(e),t.slot);function Dc({dataService:e,selectedIds:t,onToggle:n,onShowCategory:i}){const s=y.useMemo(()=>e.getCategoryTrees(),[e]),[o,r]=y.useState(new Set),a=c=>r(h=>{const f=new Set(h);return f.has(c)?f.delete(c):f.add(c),f}),l=s.reduce((c,h)=>c+h.classIds.length,0);return u.jsxs("div",{className:"text-sm",children:[u.jsx("div",{className:"flex items-baseline gap-2 px-3 py-2 border-b border-gray-200 dark:border-slate-700",children:u.jsxs("span",{className:"font-semibold flex-1",children:[e.getConceptLabel("entity",!0)," (",l,")"]})}),s.map(c=>{const h=o.has(c.id),f=c.classIds.filter(d=>t.has(d)).length;return u.jsxs("div",{children:[u.jsxs("div",{"data-help-id":Sc(c.id),className:`w-full flex items-stretch font-medium
                         bg-gray-50 dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700`,children:[u.jsxs("button",{type:"button",onClick:()=>a(c.id),className:`flex-1 min-w-0 flex items-center gap-2 px-3 py-1.5 text-left
                           hover:bg-gray-100 dark:hover:bg-slate-700`,children:[u.jsx("span",{className:"text-xs text-gray-400",children:h?"▶":"▼"}),u.jsx("span",{className:"flex-1 truncate",children:c.label}),f>0&&u.jsxs("span",{className:"text-xs text-gray-400",children:[f," / ",c.classIds.length]})]}),i&&u.jsx("button",{type:"button","data-show-category":c.id,title:`Draw the ${c.label} content view — replaces the canvas`,onClick:()=>i($r(c)),className:`px-2.5 shrink-0 text-gray-400 border-l border-gray-100
                             dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700
                             hover:text-blue-600 dark:hover:text-sky-400`,children:"⊞"})]}),!h&&c.roots.map(d=>u.jsx(_r,{node:d,depth:0,selectedIds:t,onToggle:n},d.classId))]},c.id)})]})}function _r({node:e,depth:t,selectedIds:n,onToggle:i}){const{classId:s}=e;return u.jsxs(u.Fragment,{children:[u.jsxs("label",{"data-class-row":s,"data-help-id":vc(s),className:`flex items-center gap-2 pr-3 py-1 cursor-pointer
                    hover:bg-blue-50 dark:hover:bg-slate-800
                    ${n.has(s)?"bg-blue-50 dark:bg-slate-800":""}`,style:{paddingLeft:`${.75+t*1}rem`},children:[u.jsx("input",{type:"checkbox","data-help-id":kc(s),checked:n.has(s),onChange:()=>i(s)}),u.jsxs("span",{className:"flex-1 min-w-0 truncate",children:[u.jsx("span",{className:"font-mono text-xs",children:s}),e.outOfCategoryParent&&u.jsxs("span",{className:"ml-1 text-[10px] text-gray-400 dark:text-slate-500",title:`Extends ${e.outOfCategoryParent}, which is in another category`,children:["↳ ",e.outOfCategoryParent]})]})]}),e.children.map(o=>u.jsx(_r,{node:o,depth:t+1,selectedIds:n,onToggle:i},o.classId))]})}const as=y.createContext({});function ls(e){const t=y.useRef(null);return t.current===null&&(t.current=e()),t.current}const Mc=typeof window<"u",Pn=Mc?y.useLayoutEffect:y.useEffect,Bn=y.createContext(null);function cs(e,t){e.indexOf(t)===-1&&e.push(t)}function En(e,t){const n=e.indexOf(t);n>-1&&e.splice(n,1)}const Ue=(e,t,n)=>n>t?t:n<e?e:n;let $n=()=>{};const Ze={},Hr=e=>/^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(e),zr=e=>typeof e=="object"&&e!==null,Wr=e=>/^0[^.\s]+$/u.test(e);function Gr(e){let t;return()=>(t===void 0&&(t=e()),t)}const je=e=>e,Gt=(...e)=>e.reduce((t,n)=>i=>n(t(i))),Ft=(e,t,n)=>{const i=t-e;return i?(n-e)/i:1};class hs{constructor(){this.subscriptions=[]}add(t){return cs(this.subscriptions,t),()=>En(this.subscriptions,t)}notify(t,n,i){const s=this.subscriptions.length;if(s)if(s===1)this.subscriptions[0](t,n,i);else for(let o=0;o<s;o++){const r=this.subscriptions[o];r&&r(t,n,i)}}getSize(){return this.subscriptions.length}clear(){this.subscriptions.length=0}}const Le=e=>e*1e3,Re=e=>e/1e3,Ur=(e,t)=>t?e*(1e3/t):0,Kr=(e,t,n)=>(((1-3*n+3*t)*e+(3*n-6*t))*e+3*t)*e,Oc=1e-7,Rc=12;function jc(e,t,n,i,s){let o,r,a=0;do r=t+(n-t)/2,o=Kr(r,i,s)-e,o>0?n=r:t=r;while(Math.abs(o)>Oc&&++a<Rc);return r}function Ut(e,t,n,i){if(e===t&&n===i)return je;const s=o=>jc(o,0,1,e,n);return o=>o===0||o===1?o:Kr(s(o),t,i)}const qr=e=>t=>t<=.5?e(2*t)/2:(2-e(2*(1-t)))/2,Qr=e=>t=>1-e(1-t),Yr=Ut(.33,1.53,.69,.99),us=Qr(Yr),Xr=qr(us),Zr=e=>e>=1?1:(e*=2)<1?.5*us(e):.5*(2-Math.pow(2,-10*(e-1))),ds=e=>1-Math.sin(Math.acos(e)),Jr=Qr(ds),ea=qr(ds),Lc=Ut(.42,0,1,1),Nc=Ut(0,0,.58,1),ta=Ut(.42,0,.58,1),Vc=e=>Array.isArray(e)&&typeof e[0]!="number",na=e=>Array.isArray(e)&&typeof e[0]=="number",Ic={linear:je,easeIn:Lc,easeInOut:ta,easeOut:Nc,circIn:ds,circInOut:ea,circOut:Jr,backIn:us,backInOut:Xr,backOut:Yr,anticipate:Zr},Bc=e=>typeof e=="string",qs=e=>{if(na(e)){$n(e.length===4);const[t,n,i,s]=e;return Ut(t,n,i,s)}else if(Bc(e))return Ic[e];return e},tn=["setup","read","resolveKeyframes","preUpdate","update","preRender","render","postRender"];function $c(e){let t=new Set,n=new Set,i=!1,s=!1;const o=new WeakSet;let r={delta:0,timestamp:0,isProcessing:!1};function a(c){o.has(c)&&(l.schedule(c),e()),c(r)}const l={schedule:(c,h=!1,f=!1)=>{const g=f&&i?t:n;return h&&o.add(c),g.add(c),c},cancel:c=>{n.delete(c),o.delete(c)},process:c=>{if(r=c,i){s=!0;return}i=!0;const h=t;t=n,n=h,t.forEach(a),t.clear(),i=!1,s&&(s=!1,l.process(c))}};return l}const Fc=40;function ia(e,t){let n=!1,i=!0;const s={delta:0,timestamp:0,isProcessing:!1},o=()=>n=!0,r=tn.reduce((v,x)=>(v[x]=$c(o),v),{}),{setup:a,read:l,resolveKeyframes:c,preUpdate:h,update:f,preRender:d,render:g,postRender:p}=r,b=()=>{const v=Ze.useManualTiming,x=v?s.timestamp:performance.now();n=!1,v||(s.delta=i?1e3/60:Math.max(Math.min(x-s.timestamp,Fc),1)),s.timestamp=x,s.isProcessing=!0,a.process(s),l.process(s),c.process(s),h.process(s),f.process(s),d.process(s),g.process(s),p.process(s),s.isProcessing=!1,n&&t&&(i=!1,e(b))},m=()=>{n=!0,i=!0,s.isProcessing||e(b)};return{schedule:tn.reduce((v,x)=>{const C=r[x];return v[x]=(D,S=!1,P=!1)=>(n||m(),C.schedule(D,S,P)),v},{}),cancel:v=>{for(let x=0;x<tn.length;x++)r[tn[x]].cancel(v)},state:s,steps:r}}const{schedule:te,cancel:Je,state:ge,steps:Qn}=ia(typeof requestAnimationFrame<"u"?requestAnimationFrame:je,!0);let mn;function _c(){mn=void 0}const ke={now:()=>(mn===void 0&&ke.set(ge.isProcessing||Ze.useManualTiming?ge.timestamp:performance.now()),mn),set:e=>{mn=e,queueMicrotask(_c)}},sa=e=>t=>typeof t=="string"&&t.startsWith(e),oa=sa("--"),Hc=sa("var(--"),fs=e=>Hc(e)?zc.test(e.split("/*")[0].trim()):!1,zc=/var\(--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)$/iu;function Qs(e){return typeof e!="string"?!1:e.split("/*")[0].includes("var(--")}const Tt={test:e=>typeof e=="number",parse:parseFloat,transform:e=>e},_t={...Tt,transform:e=>Ue(0,1,e)},nn={...Tt,default:1},jt=e=>Math.round(e*1e5)/1e5,ps=/-?(?:\d+(?:\.\d+)?|\.\d+)/gu;function Wc(e){return e==null}const Gc=/^(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))$/iu,ms=(e,t)=>n=>!!(typeof n=="string"&&Gc.test(n)&&n.startsWith(e)||t&&!Wc(n)&&Object.prototype.hasOwnProperty.call(n,t)),ra=(e,t,n)=>i=>{if(typeof i!="string")return i;const[s,o,r,a]=i.match(ps);return{[e]:parseFloat(s),[t]:parseFloat(o),[n]:parseFloat(r),alpha:a!==void 0?parseFloat(a):1}},Uc=e=>Ue(0,255,e),Yn={...Tt,transform:e=>Math.round(Uc(e))},ot={test:ms("rgb","red"),parse:ra("red","green","blue"),transform:({red:e,green:t,blue:n,alpha:i=1})=>"rgba("+Yn.transform(e)+", "+Yn.transform(t)+", "+Yn.transform(n)+", "+jt(_t.transform(i))+")"};function Kc(e){let t="",n="",i="",s="";return e.length>5?(t=e.substring(1,3),n=e.substring(3,5),i=e.substring(5,7),s=e.substring(7,9)):(t=e.substring(1,2),n=e.substring(2,3),i=e.substring(3,4),s=e.substring(4,5),t+=t,n+=n,i+=i,s+=s),{red:parseInt(t,16),green:parseInt(n,16),blue:parseInt(i,16),alpha:s?parseInt(s,16)/255:1}}const Di={test:ms("#"),parse:Kc,transform:ot.transform},Kt=e=>({test:t=>typeof t=="string"&&t.endsWith(e)&&t.split(" ").length===1,parse:parseFloat,transform:t=>`${t}${e}`}),Ke=Kt("deg"),Ge=Kt("%"),$=Kt("px"),qc=Kt("vh"),Qc=Kt("vw"),Ys={...Ge,parse:e=>Ge.parse(e)/100,transform:e=>Ge.transform(e*100)},wt={test:ms("hsl","hue"),parse:ra("hue","saturation","lightness"),transform:({hue:e,saturation:t,lightness:n,alpha:i=1})=>"hsla("+Math.round(e)+", "+Ge.transform(jt(t))+", "+Ge.transform(jt(n))+", "+jt(_t.transform(i))+")"},le={test:e=>ot.test(e)||Di.test(e)||wt.test(e),parse:e=>ot.test(e)?ot.parse(e):wt.test(e)?wt.parse(e):Di.parse(e),transform:e=>typeof e=="string"?e:e.hasOwnProperty("red")?ot.transform(e):wt.transform(e),getAnimatableNone:e=>{const t=le.parse(e);return t.alpha=0,le.transform(t)}},Yc=/(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))/giu;function Xc(e){return isNaN(e)&&typeof e=="string"&&(e.match(ps)?.length||0)+(e.match(Yc)?.length||0)>0}const aa="number",la="color",Zc="var",Jc="var(",Xs="${}",eh=/var\s*\(\s*--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)|#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\)|-?(?:\d+(?:\.\d+)?|\.\d+)/giu;function kt(e){const t=e.toString(),n=[],i={color:[],number:[],var:[]},s=[];let o=0;const a=t.replace(eh,l=>(le.test(l)?(i.color.push(o),s.push(la),n.push(le.parse(l))):l.startsWith(Jc)?(i.var.push(o),s.push(Zc),n.push(l)):(i.number.push(o),s.push(aa),n.push(parseFloat(l))),++o,Xs)).split(Xs);return{values:n,split:a,indexes:i,types:s}}function th(e){return kt(e).values}function ca({split:e,types:t}){const n=e.length;return i=>{let s="";for(let o=0;o<n;o++)if(s+=e[o],i[o]!==void 0){const r=t[o];r===aa?s+=jt(i[o]):r===la?s+=le.transform(i[o]):s+=i[o]}return s}}function nh(e){return ca(kt(e))}const ih=e=>typeof e=="number"?0:le.test(e)?le.getAnimatableNone(e):e,sh=(e,t)=>typeof e=="number"?t?.trim().endsWith("/")?e:0:ih(e);function oh(e){const t=kt(e);return ca(t)(t.values.map((i,s)=>sh(i,t.split[s])))}const Fe={test:Xc,parse:th,createTransformer:nh,getAnimatableNone:oh};function Xn(e,t,n){return n<0&&(n+=1),n>1&&(n-=1),n<1/6?e+(t-e)*6*n:n<1/2?t:n<2/3?e+(t-e)*(2/3-n)*6:e}function rh({hue:e,saturation:t,lightness:n,alpha:i}){e/=360,t/=100,n/=100;let s=0,o=0,r=0;if(!t)s=o=r=n;else{const a=n<.5?n*(1+t):n+t-n*t,l=2*n-a;s=Xn(l,a,e+1/3),o=Xn(l,a,e),r=Xn(l,a,e-1/3)}return{red:Math.round(s*255),green:Math.round(o*255),blue:Math.round(r*255),alpha:i}}function Dn(e,t){return n=>n>0?t:e}const ee=(e,t,n)=>e+(t-e)*n,Zn=(e,t,n)=>{const i=e*e,s=n*(t*t-i)+i;return s<0?0:Math.sqrt(s)},ah=[Di,ot,wt],lh=e=>ah.find(t=>t.test(e));function Zs(e){const t=lh(e);if(!t)return!1;let n=t.parse(e);return t===wt&&(n=rh(n)),n}const Js=(e,t)=>{const n=Zs(e),i=Zs(t);if(!n||!i)return Dn(e,t);const s={...n};return o=>(s.red=Zn(n.red,i.red,o),s.green=Zn(n.green,i.green,o),s.blue=Zn(n.blue,i.blue,o),s.alpha=ee(n.alpha,i.alpha,o),ot.transform(s))},Mi=new Set(["none","hidden"]);function ch(e,t){return Mi.has(e)?n=>n<=0?e:t:n=>n>=1?t:e}function hh(e,t){return n=>ee(e,t,n)}function gs(e){return typeof e=="number"?hh:typeof e=="string"?fs(e)?Dn:le.test(e)?Js:fh:Array.isArray(e)?ha:typeof e=="object"?le.test(e)?Js:uh:Dn}function ha(e,t){const n=[...e],i=n.length,s=e.map((o,r)=>gs(o)(o,t[r]));return o=>{for(let r=0;r<i;r++)n[r]=s[r](o);return n}}function uh(e,t){const n={...e,...t},i={};for(const s in n)e[s]!==void 0&&t[s]!==void 0&&(i[s]=gs(e[s])(e[s],t[s]));return s=>{for(const o in i)n[o]=i[o](s);return n}}function dh(e,t){const n=[],i={color:0,var:0,number:0};for(let s=0;s<t.values.length;s++){const o=t.types[s],r=e.indexes[o][i[o]],a=e.values[r]??0;n[s]=a,i[o]++}return n}const fh=(e,t)=>{const n=Fe.createTransformer(t),i=kt(e),s=kt(t);return i.indexes.var.length===s.indexes.var.length&&i.indexes.color.length===s.indexes.color.length&&i.indexes.number.length>=s.indexes.number.length?Mi.has(e)&&!s.values.length||Mi.has(t)&&!i.values.length?ch(e,t):Gt(ha(dh(i,s),s.values),n):Dn(e,t)};function ua(e,t,n){return typeof e=="number"&&typeof t=="number"&&typeof n=="number"?ee(e,t,n):gs(e)(e,t)}const ph=e=>{const t=({timestamp:n})=>e(n);return{start:(n=!0)=>te.update(t,n),stop:()=>Je(t),now:()=>ge.isProcessing?ge.timestamp:ke.now()}},da=(e,t,n=10)=>{let i="";const s=Math.max(Math.round(t/n),2);for(let o=0;o<s;o++)i+=Math.round(e(o/(s-1))*1e4)/1e4+", ";return`linear(${i.substring(0,i.length-2)})`},ys=2e4;function bs(e,t=50,n=ys,i){let s=0,o=e.next(s);for(;!o.done&&s<n;)s+=t,o=e.next(s);return s>=n?1/0:s}function mh(e,t=100,n){const i=n({...e,keyframes:[0,t]}),s=Math.min(bs(i),ys);return{type:"keyframes",ease:o=>i.next(s*o).value/t,duration:Re(s)}}const se={stiffness:100,damping:10,mass:1,velocity:0,duration:800,bounce:.3,visualDuration:.3,restSpeed:{granular:.01,default:2},restDelta:{granular:.005,default:.5},minDuration:.01,maxDuration:10,minDamping:.05,maxDamping:1};function Oi(e,t){return e*Math.sqrt(1-t*t)}const gh=12;function yh(e,t,n){let i=n;for(let s=1;s<gh;s++)i=i-e(i)/t(i);return i}const Jn=.001;function bh({duration:e=se.duration,bounce:t=se.bounce,velocity:n=se.velocity,mass:i=se.mass}){let s,o,r=1-t;r=Ue(se.minDamping,se.maxDamping,r),e=Ue(se.minDuration,se.maxDuration,Re(e)),r<1?(s=c=>{const h=c*r,f=h*e,d=h-n,g=Oi(c,r),p=Math.exp(-f);return Jn-d/g*p},o=c=>{const f=c*r*e,d=f*n+n,g=r*r*c*c*e,p=Math.exp(-f),b=Oi(c*c,r);return(-s(c)+Jn>0?-1:1)*((d-g)*p)/b}):(s=c=>{const h=Math.exp(-c*e),f=(c-n)*e+1;return-Jn+h*f},o=c=>{const h=Math.exp(-c*e),f=(n-c)*(e*e);return h*f});const a=5/e,l=yh(s,o,a);if(e=Le(e),isNaN(l))return{stiffness:se.stiffness,damping:se.damping,duration:e};{const c=l*l*i;return{stiffness:c,damping:r*2*Math.sqrt(i*c),duration:e}}}const wh=["duration","bounce"],xh=["stiffness","damping","mass"];function eo(e,t){return t.some(n=>e[n]!==void 0)}function vh(e){let t={velocity:se.velocity,stiffness:se.stiffness,damping:se.damping,mass:se.mass,isResolvedFromDuration:!1,...e};if(!eo(e,xh)&&eo(e,wh))if(t.velocity=0,e.visualDuration){const n=e.visualDuration,i=2*Math.PI/(n*1.2),s=i*i,o=2*Ue(.05,1,1-(e.bounce||0))*Math.sqrt(s);t={...t,mass:se.mass,stiffness:s,damping:o}}else{const n=bh({...e,velocity:0});t={...t,...n,mass:se.mass},t.isResolvedFromDuration=!0}return t}function Mn(e=se.visualDuration,t=se.bounce){const n=typeof e!="object"?{visualDuration:e,keyframes:[0,1],bounce:t}:e;let{restSpeed:i,restDelta:s}=n;const o=n.keyframes[0],r=n.keyframes[n.keyframes.length-1],a={done:!1,value:o},{stiffness:l,damping:c,mass:h,duration:f,velocity:d,isResolvedFromDuration:g}=vh({...n,velocity:-Re(n.velocity||0)}),p=d||0,b=c/(2*Math.sqrt(l*h)),m=r-o,w=Re(Math.sqrt(l/h)),k=b*w,v=Math.abs(m)<5;i||(i=v?se.restSpeed.granular:se.restSpeed.default),s||(s=v?se.restDelta.granular:se.restDelta.default);let x,C;if(b<1){const S=Oi(w,b),P=(p+k*m)/S,E=k*P+m*S,L=k*m-P*S;let I=-1,B=0,O=0;const _=T=>{if(T!==I){I=T;const W=Math.exp(-k*T),fe=Math.sin(S*T),N=Math.cos(S*T);B=r-W*(P*fe+m*N),O=W*(E*fe+L*N)}};x=T=>(_(T),B),C=T=>(_(T),O)}else if(b===1){x=P=>r-Math.exp(-w*P)*(m+(p+w*m)*P);const S=p+w*m;C=P=>Math.exp(-w*P)*(w*S*P-p)}else{const S=w*Math.sqrt(b*b-1);x=I=>{const B=Math.exp(-k*I),O=Math.min(S*I,300);return r-B*((p+k*m)*Math.sinh(O)+S*m*Math.cosh(O))/S};const P=(p+k*m)/S,E=k*P-m*S,L=k*m-P*S;C=I=>{const B=Math.exp(-k*I),O=Math.min(S*I,300);return B*(E*Math.sinh(O)+L*Math.cosh(O))}}const D={calculatedDuration:g&&f||null,velocity:S=>Le(C(S)),next:S=>{const P=x(S);if(g)a.done=S>=f;else{const E=Le(C(S));a.done=Math.abs(E)<=i&&Math.abs(r-P)<=s}return a.value=a.done?r:P,a},toString:()=>{const S=Math.min(bs(D),ys),P=da(E=>D.next(S*E).value,S,30);return S+"ms "+P},toTransition:()=>{}};return D}Mn.applyToOptions=e=>{const t=mh(e,100,Mn);return e.ease=t.ease,e.duration=Le(t.duration),e.type="keyframes",e};function Ri({keyframes:e,velocity:t=0,power:n=.8,timeConstant:i=325,bounceDamping:s=10,bounceStiffness:o=500,modifyTarget:r,min:a,max:l,restDelta:c=.5,restSpeed:h}){const f=e[0],d={done:!1,value:f},g=S=>S<a||S>l,p=S=>a===void 0?l:l===void 0||Math.abs(a-S)<Math.abs(l-S)?a:l;let b=n*t;const m=f+b,w=r===void 0?m:r(m);w!==m&&(b=w-f);const k=S=>-b*Math.exp(-S/i),v=S=>{const P=k(S);d.done=Math.abs(P)<=c,d.value=d.done?w:w+P};let x,C;const D=S=>{g(d.value)&&(x=S,C=Mn({keyframes:[d.value,p(d.value)],velocity:-k(S)/i*1e3,damping:s,stiffness:o,restDelta:c,restSpeed:h}))};return D(0),{calculatedDuration:null,next:S=>{let P=!1;return!C&&x===void 0&&(P=!0,v(S),D(S)),x!==void 0&&S>=x?C.next(S-x):(!P&&v(S),d)}}}function kh(e,t,n){const i=[],s=n||Ze.mix||ua,o=e.length-1;for(let r=0;r<o;r++){let a=s(e[r],e[r+1]);if(t){const l=Array.isArray(t)?t[r]||je:t;a=Gt(l,a)}i.push(a)}return i}function Sh(e,t,{clamp:n=!0,ease:i,mixer:s}={}){const o=e.length;if($n(o===t.length),o===1)return()=>t[0];if(o===2&&t[0]===t[1])return()=>t[1];const r=e[0]===e[1];e[0]>e[o-1]&&(e=[...e].reverse(),t=[...t].reverse());const a=kh(t,i,s),l=a.length,c=h=>{if(r&&h<e[0])return t[0];let f=0;if(l>1)for(;f<e.length-2&&!(h<e[f+1]);f++);const d=Ft(e[f],e[f+1],h);return a[f](d)};return n?h=>c(Ue(e[0],e[o-1],h)):c}function Th(e,t){const n=e[e.length-1];for(let i=1;i<=t;i++){const s=Ft(0,t,i);e.push(ee(n,1,s))}}function Ch(e){const t=[0];return Th(t,e.length-1),t}function Ah(e,t){return e.map(n=>n*t)}function Ph(e,t){return e.map(()=>t||ta).splice(0,e.length-1)}function Lt({duration:e=300,keyframes:t,times:n,ease:i="easeInOut"}){const s=Vc(i)?i.map(qs):qs(i),o={done:!1,value:t[0]},r=Ah(n&&n.length===t.length?n:Ch(t),e),a=Sh(r,t,{ease:Array.isArray(s)?s:Ph(t,s)});return{calculatedDuration:e,next:l=>(o.value=a(l),o.done=l>=e,o)}}const Eh=5;function Dh(e,t,n){const i=Math.max(t-Eh,0);return Ur(n-e(i),t-i)}const Mh=e=>e!==null;function Fn(e,{repeat:t,repeatType:n="loop"},i,s=1){const o=e.filter(Mh),a=s<0||t&&n!=="loop"&&t%2===1?0:o.length-1;return!a||i===void 0?o[a]:i}const Oh={decay:Ri,inertia:Ri,tween:Lt,keyframes:Lt,spring:Mn};function fa(e){typeof e.type=="string"&&(e.type=Oh[e.type])}class ws{constructor(){this.updateFinished()}get finished(){return this._finished}updateFinished(){this._finished=new Promise(t=>{this.resolve=t})}notifyFinished(){this.resolve()}then(t,n){return this.finished.then(t,n)}}const Rh=e=>e/100;class On extends ws{constructor(t){super(),this.state="idle",this.startTime=null,this.isStopped=!1,this.currentTime=0,this.holdTime=null,this.playbackSpeed=1,this.delayState={done:!1,value:void 0},this.stop=()=>{const{motionValue:n}=this.options;n&&n.updatedAt!==ke.now()&&this.tick(ke.now()),this.isStopped=!0,this.state!=="idle"&&(this.teardown(),this.options.onStop?.())},this.options=t,this.initAnimation(),this.play(),t.autoplay===!1&&this.pause()}initAnimation(){const{options:t}=this;fa(t);const{type:n=Lt,repeat:i=0,repeatDelay:s=0,repeatType:o,velocity:r=0}=t;let{keyframes:a}=t;const l=n||Lt;l!==Lt&&typeof a[0]!="number"&&(this.mixKeyframes=Gt(Rh,ua(a[0],a[1])),a=[0,100]);const c=l({...t,keyframes:a});o==="mirror"&&(this.mirroredGenerator=l({...t,keyframes:[...a].reverse(),velocity:-r})),c.calculatedDuration===null&&(c.calculatedDuration=bs(c));const{calculatedDuration:h}=c;this.calculatedDuration=h,this.resolvedDuration=h+s,this.totalDuration=this.resolvedDuration*(i+1)-s,this.generator=c}updateTime(t){const n=Math.round(t-this.startTime)*this.playbackSpeed;this.holdTime!==null?this.currentTime=this.holdTime:this.currentTime=n}tick(t,n=!1){const{generator:i,totalDuration:s,mixKeyframes:o,mirroredGenerator:r,resolvedDuration:a,calculatedDuration:l}=this;if(this.startTime===null)return i.next(0);const{delay:c=0,keyframes:h,repeat:f,repeatType:d,repeatDelay:g,type:p,onUpdate:b,finalKeyframe:m}=this.options;this.speed>0?this.startTime=Math.min(this.startTime,t):this.speed<0&&(this.startTime=Math.min(t-s/this.speed,this.startTime)),n?this.currentTime=t:this.updateTime(t);const w=this.currentTime-c*(this.playbackSpeed>=0?1:-1),k=this.playbackSpeed>=0?w<0:w>s;this.currentTime=Math.max(w,0),this.state==="finished"&&this.holdTime===null&&(this.currentTime=s);let v=this.currentTime,x=i;if(f){const P=Math.min(this.currentTime,s)/a;let E=Math.floor(P),L=P%1;!L&&P>=1&&(L=1),L===1&&E--,E=Math.min(E,f+1),E%2&&(d==="reverse"?(L=1-L,g&&(L-=g/a)):d==="mirror"&&(x=r)),v=Ue(0,1,L)*a}let C;k?(this.delayState.value=h[0],C=this.delayState):C=x.next(v),o&&!k&&(C.value=o(C.value));let{done:D}=C;!k&&l!==null&&(D=this.playbackSpeed>=0?this.currentTime>=s:this.currentTime<=0);const S=this.holdTime===null&&(this.state==="finished"||this.state==="running"&&D);return S&&p!==Ri&&(C.value=Fn(h,this.options,m,this.speed)),b&&b(C.value),S&&this.finish(),C}then(t,n){return this.finished.then(t,n)}get duration(){return Re(this.calculatedDuration)}get iterationDuration(){const{delay:t=0}=this.options||{};return this.duration+Re(t)}get time(){return Re(this.currentTime)}set time(t){t=Le(t),this.currentTime=t,this.startTime===null||this.holdTime!==null||this.playbackSpeed===0?this.holdTime=t:this.driver&&(this.startTime=this.driver.now()-t/this.playbackSpeed),this.driver?this.driver.start(!1):(this.startTime=0,this.state="paused",this.holdTime=t,this.tick(t))}getGeneratorVelocity(){const t=this.currentTime;if(t<=0)return this.options.velocity||0;if(this.generator.velocity)return this.generator.velocity(t);const n=this.generator.next(t).value;return Dh(i=>this.generator.next(i).value,t,n)}get speed(){return this.playbackSpeed}set speed(t){const n=this.playbackSpeed!==t;n&&this.driver&&this.updateTime(ke.now()),this.playbackSpeed=t,n&&this.driver&&(this.time=Re(this.currentTime))}play(){if(this.isStopped)return;const{driver:t=ph,startTime:n}=this.options;this.driver||(this.driver=t(s=>this.tick(s))),this.options.onPlay?.();const i=this.driver.now();this.state==="finished"?(this.updateFinished(),this.startTime=i):this.holdTime!==null?this.startTime=i-this.holdTime:this.startTime||(this.startTime=n??i),this.state==="finished"&&this.speed<0&&(this.startTime+=this.calculatedDuration),this.holdTime=null,this.state="running",this.driver.start()}pause(){this.state="paused",this.updateTime(ke.now()),this.holdTime=this.currentTime}complete(){this.state!=="running"&&this.play(),this.state="finished",this.holdTime=null}finish(){this.notifyFinished(),this.teardown(),this.state="finished",this.options.onComplete?.()}cancel(){this.holdTime=null,this.startTime=0,this.tick(0),this.teardown(),this.options.onCancel?.()}teardown(){this.state="idle",this.stopDriver(),this.startTime=this.holdTime=null}stopDriver(){this.driver&&(this.driver.stop(),this.driver=void 0)}sample(t){return this.startTime=0,this.tick(t,!0)}attachTimeline(t){return this.options.allowFlatten&&(this.options.type="keyframes",this.options.ease="linear",this.initAnimation()),this.driver?.stop(),t.observe(this)}}function jh(e){for(let t=1;t<e.length;t++)e[t]??(e[t]=e[t-1])}const rt=e=>e*180/Math.PI,ji=e=>{const t=rt(Math.atan2(e[1],e[0]));return Li(t)},Lh={x:4,y:5,translateX:4,translateY:5,scaleX:0,scaleY:3,scale:e=>(Math.abs(e[0])+Math.abs(e[3]))/2,rotate:ji,rotateZ:ji,skewX:e=>rt(Math.atan(e[1])),skewY:e=>rt(Math.atan(e[2])),skew:e=>(Math.abs(e[1])+Math.abs(e[2]))/2},Li=e=>(e=e%360,e<0&&(e+=360),e),to=ji,no=e=>Math.sqrt(e[0]*e[0]+e[1]*e[1]),io=e=>Math.sqrt(e[4]*e[4]+e[5]*e[5]),Nh={x:12,y:13,z:14,translateX:12,translateY:13,translateZ:14,scaleX:no,scaleY:io,scale:e=>(no(e)+io(e))/2,rotateX:e=>Li(rt(Math.atan2(e[6],e[5]))),rotateY:e=>Li(rt(Math.atan2(-e[2],e[0]))),rotateZ:to,rotate:to,skewX:e=>rt(Math.atan(e[4])),skewY:e=>rt(Math.atan(e[1])),skew:e=>(Math.abs(e[1])+Math.abs(e[4]))/2};function Ni(e){return e.includes("scale")?1:0}function Vi(e,t){if(!e||e==="none")return Ni(t);const n=e.match(/^matrix3d\(([-\d.e\s,]+)\)$/u);let i,s;if(n)i=Nh,s=n;else{const a=e.match(/^matrix\(([-\d.e\s,]+)\)$/u);i=Lh,s=a}if(!s)return Ni(t);const o=i[t],r=s[1].split(",").map(Ih);return typeof o=="function"?o(r):r[o]}const Vh=(e,t)=>{const{transform:n="none"}=getComputedStyle(e);return Vi(n,t)};function Ih(e){return parseFloat(e.trim())}const Ct=["transformPerspective","x","y","z","translateX","translateY","translateZ","scale","scaleX","scaleY","rotate","rotateX","rotateY","rotateZ","skew","skewX","skewY"],At=new Set([...Ct,"pathRotation"]),so=e=>e===Tt||e===$,Bh=new Set(["x","y","z"]),$h=Ct.filter(e=>!Bh.has(e));function Fh(e){const t=[];return $h.forEach(n=>{const i=e.getValue(n);i!==void 0&&(t.push([n,i.get()]),i.set(n.startsWith("scale")?1:0))}),t}const Xe={width:({x:e},{paddingLeft:t="0",paddingRight:n="0",boxSizing:i})=>{const s=e.max-e.min;return i==="border-box"?s:s-parseFloat(t)-parseFloat(n)},height:({y:e},{paddingTop:t="0",paddingBottom:n="0",boxSizing:i})=>{const s=e.max-e.min;return i==="border-box"?s:s-parseFloat(t)-parseFloat(n)},top:(e,{top:t})=>parseFloat(t),left:(e,{left:t})=>parseFloat(t),bottom:({y:e},{top:t})=>parseFloat(t)+(e.max-e.min),right:({x:e},{left:t})=>parseFloat(t)+(e.max-e.min),x:(e,{transform:t})=>Vi(t,"x"),y:(e,{transform:t})=>Vi(t,"y")};Xe.translateX=Xe.x;Xe.translateY=Xe.y;const at=new Set;let Ii=!1,Bi=!1,$i=!1;function pa(){if(Bi){const e=Array.from(at).filter(i=>i.needsMeasurement),t=new Set(e.map(i=>i.element)),n=new Map;t.forEach(i=>{const s=Fh(i);s.length&&(n.set(i,s),i.render())}),e.forEach(i=>i.measureInitialState()),t.forEach(i=>{i.render();const s=n.get(i);s&&s.forEach(([o,r])=>{i.getValue(o)?.set(r)})}),e.forEach(i=>i.measureEndState()),e.forEach(i=>{i.suspendedScrollY!==void 0&&window.scrollTo(0,i.suspendedScrollY)})}Bi=!1,Ii=!1,at.forEach(e=>e.complete($i)),at.clear()}function ma(){at.forEach(e=>{e.readKeyframes(),e.needsMeasurement&&(Bi=!0)})}function _h(){$i=!0,ma(),pa(),$i=!1}class xs{constructor(t,n,i,s,o,r=!1){this.state="pending",this.isAsync=!1,this.needsMeasurement=!1,this.unresolvedKeyframes=[...t],this.onComplete=n,this.name=i,this.motionValue=s,this.element=o,this.isAsync=r}scheduleResolve(){this.state="scheduled",this.isAsync?(at.add(this),Ii||(Ii=!0,te.read(ma),te.resolveKeyframes(pa))):(this.readKeyframes(),this.complete())}readKeyframes(){const{unresolvedKeyframes:t,name:n,element:i,motionValue:s}=this;if(t[0]===null){const o=s?.get(),r=t[t.length-1];if(o!==void 0)t[0]=o;else if(i&&n){const a=i.readValue(n,r);a!=null&&(t[0]=a)}t[0]===void 0&&(t[0]=r),s&&o===void 0&&s.set(t[0])}jh(t)}setFinalKeyframe(){}measureInitialState(){}renderEndStyles(){}measureEndState(){}complete(t=!1){this.state="complete",this.onComplete(this.unresolvedKeyframes,this.finalKeyframe,t),at.delete(this)}cancel(){this.state==="scheduled"&&(at.delete(this),this.state="pending")}resume(){this.state==="pending"&&this.scheduleResolve()}}const Hh=e=>e.startsWith("--");function ga(e,t,n){Hh(t)?e.style.setProperty(t,n):e.style[t]=n}const zh={};function ya(e,t){const n=Gr(e);return()=>zh[t]??n()}const Wh=ya(()=>window.ScrollTimeline!==void 0,"scrollTimeline"),ba=ya(()=>{try{document.createElement("div").animate({opacity:0},{easing:"linear(0, 1)"})}catch{return!1}return!0},"linearEasing"),Mt=([e,t,n,i])=>`cubic-bezier(${e}, ${t}, ${n}, ${i})`,oo={linear:"linear",ease:"ease",easeIn:"ease-in",easeOut:"ease-out",easeInOut:"ease-in-out",circIn:Mt([0,.65,.55,1]),circOut:Mt([.55,0,1,.45]),backIn:Mt([.31,.01,.66,-.59]),backOut:Mt([.33,1.53,.69,.99])};function wa(e,t){if(e)return typeof e=="function"?ba()?da(e,t):"ease-out":na(e)?Mt(e):Array.isArray(e)?e.map(n=>wa(n,t)||oo.easeOut):oo[e]}function Gh(e,t,n,{delay:i=0,duration:s=300,repeat:o=0,repeatType:r="loop",ease:a="easeOut",times:l}={},c=void 0){const h={[t]:n};l&&(h.offset=l);const f=wa(a,s);Array.isArray(f)&&(h.easing=f);const d={delay:i,duration:s,easing:Array.isArray(f)?"linear":f,fill:"both",iterations:o+1,direction:r==="reverse"?"alternate":"normal"};return c&&(d.pseudoElement=c),e.animate(h,d)}function xa(e){return typeof e=="function"&&"applyToOptions"in e}function Uh({type:e,...t}){return xa(e)&&ba()?e.applyToOptions(t):(t.duration??(t.duration=300),t.ease??(t.ease="easeOut"),t)}class va extends ws{constructor(t){if(super(),this.finishedTime=null,this.isStopped=!1,this.manualStartTime=null,!t)return;const{element:n,name:i,keyframes:s,pseudoElement:o,allowFlatten:r=!1,finalKeyframe:a,onComplete:l}=t;this.isPseudoElement=!!o,this.allowFlatten=r,this.options=t,$n(typeof t.type!="string");const c=Uh(t);this.animation=Gh(n,i,s,c,o),c.autoplay===!1&&this.animation.pause(),this.animation.onfinish=()=>{if(this.finishedTime=this.time,!o){const h=Fn(s,this.options,a,this.speed);this.updateMotionValue&&this.updateMotionValue(h),ga(n,i,h),this.animation.cancel()}l?.(),this.notifyFinished()}}play(){this.isStopped||(this.manualStartTime=null,this.animation.play(),this.state==="finished"&&this.updateFinished())}pause(){this.animation.pause()}complete(){this.animation.finish?.()}cancel(){try{this.animation.cancel()}catch{}}stop(){if(this.isStopped)return;this.isStopped=!0;const{state:t}=this;t==="idle"||t==="finished"||(this.updateMotionValue?this.updateMotionValue():this.commitStyles(),this.isPseudoElement||this.cancel())}commitStyles(){const t=this.options?.element;!this.isPseudoElement&&t?.isConnected&&this.animation.commitStyles?.()}get duration(){const t=this.animation.effect?.getComputedTiming?.().duration||0;return Re(Number(t))}get iterationDuration(){const{delay:t=0}=this.options||{};return this.duration+Re(t)}get time(){return Re(Number(this.animation.currentTime)||0)}set time(t){const n=this.finishedTime!==null;this.manualStartTime=null,this.finishedTime=null,this.animation.currentTime=Le(t),n&&this.animation.pause()}get speed(){return this.animation.playbackRate}set speed(t){t<0&&(this.finishedTime=null),this.animation.playbackRate=t}get state(){return this.finishedTime!==null?"finished":this.animation.playState}get startTime(){return this.manualStartTime??Number(this.animation.startTime)}set startTime(t){this.manualStartTime=this.animation.startTime=t}attachTimeline({timeline:t,rangeStart:n,rangeEnd:i,observe:s}){return this.allowFlatten&&this.animation.effect?.updateTiming({easing:"linear"}),this.animation.onfinish=null,t&&Wh()?(this.animation.timeline=t,n&&(this.animation.rangeStart=n),i&&(this.animation.rangeEnd=i),je):s(this)}}const ka={anticipate:Zr,backInOut:Xr,circInOut:ea};function Kh(e){return e in ka}function qh(e){typeof e.ease=="string"&&Kh(e.ease)&&(e.ease=ka[e.ease])}const ei=10;class Qh extends va{constructor(t){qh(t),fa(t),super(t),t.startTime!==void 0&&t.autoplay!==!1&&(this.startTime=t.startTime),this.options=t}updateMotionValue(t){const{motionValue:n,onUpdate:i,onComplete:s,element:o,...r}=this.options;if(!n)return;if(t!==void 0){n.set(t);return}const a=new On({...r,autoplay:!1}),l=Math.max(ei,ke.now()-this.startTime),c=Ue(0,ei,l-ei),h=a.sample(l).value,{name:f}=this.options;o&&f&&ga(o,f,h),n.setWithVelocity(a.sample(Math.max(0,l-c)).value,h,c),a.stop()}}const ro=(e,t)=>t==="zIndex"?!1:!!(typeof e=="number"||Array.isArray(e)||typeof e=="string"&&(Fe.test(e)||e==="0")&&!e.startsWith("url("));function Yh(e){const t=e[0];if(e.length===1)return!0;for(let n=0;n<e.length;n++)if(e[n]!==t)return!0}function Xh(e,t,n,i){const s=e[0];if(s===null)return!1;if(t==="display"||t==="visibility")return!0;const o=e[e.length-1],r=ro(s,t),a=ro(o,t);return!r||!a?!1:Yh(e)||(n==="spring"||xa(n))&&i}function Fi(e){e.duration=0,e.type="keyframes"}const Sa=new Set(["opacity","clipPath","filter","transform","backgroundColor"]),Zh=/^(?:oklch|oklab|lab|lch|color|color-mix|light-dark)\(/;function Jh(e){for(let t=0;t<e.length;t++)if(typeof e[t]=="string"&&Zh.test(e[t]))return!0;return!1}const eu=new Set(["color","backgroundColor","outlineColor","fill","stroke","borderColor","borderTopColor","borderRightColor","borderBottomColor","borderLeftColor"]),tu=Gr(()=>Object.hasOwnProperty.call(Element.prototype,"animate"));function nu(e){const{motionValue:t,name:n,repeatDelay:i,repeatType:s,damping:o,type:r,keyframes:a}=e,l=t?.owner?.current;if(!(l instanceof HTMLElement)&&!(l instanceof SVGElement))return!1;const{onUpdate:c,transformTemplate:h}=t.owner.getProps();return tu()&&n&&(Sa.has(n)||eu.has(n)&&Jh(a))&&(n!=="transform"||!h)&&!c&&!i&&s!=="mirror"&&o!==0&&r!=="inertia"}const iu=40;class su extends ws{constructor({autoplay:t=!0,delay:n=0,type:i="keyframes",repeat:s=0,repeatDelay:o=0,repeatType:r="loop",keyframes:a,name:l,motionValue:c,element:h,...f}){super(),this.stop=()=>{this._animation&&(this._animation.stop(),this.stopTimeline?.()),this.keyframeResolver?.cancel()},this.createdAt=ke.now();const d={autoplay:t,delay:n,type:i,repeat:s,repeatDelay:o,repeatType:r,name:l,motionValue:c,element:h,...f},g=h?.KeyframeResolver||xs;this.keyframeResolver=new g(a,(p,b,m)=>this.onKeyframesResolved(p,b,d,!m),l,c,h),this.keyframeResolver?.scheduleResolve()}onKeyframesResolved(t,n,i,s){this.keyframeResolver=void 0;const{name:o,type:r,velocity:a,delay:l,isHandoff:c,onUpdate:h}=i;this.resolvedAt=ke.now();let f=!0;Xh(t,o,r,a)||(f=!1,(Ze.instantAnimations||!l)&&h?.(Fn(t,i,n)),t[0]=t[t.length-1],Fi(i),i.repeat=0);const g={startTime:s?this.resolvedAt?this.resolvedAt-this.createdAt>iu?this.resolvedAt:this.createdAt:this.createdAt:void 0,finalKeyframe:n,...i,keyframes:t},p=f&&!c&&nu(g),b=g.motionValue?.owner?.current;let m;if(p)try{m=new Qh({...g,element:b})}catch{m=new On(g)}else m=new On(g);m.finished.then(()=>{this.notifyFinished()}).catch(je),this.pendingTimeline&&(this.stopTimeline=m.attachTimeline(this.pendingTimeline),this.pendingTimeline=void 0),this._animation=m}get finished(){return this._animation?this.animation.finished:this._finished}then(t,n){return this.finished.finally(t).then(()=>{})}get animation(){return this._animation||(this.keyframeResolver?.resume(),_h()),this._animation}get duration(){return this.animation.duration}get iterationDuration(){return this.animation.iterationDuration}get time(){return this.animation.time}set time(t){this.animation.time=t}get speed(){return this.animation.speed}get state(){return this.animation.state}set speed(t){this.animation.speed=t}get startTime(){return this.animation.startTime}attachTimeline(t){return this._animation?this.stopTimeline=this.animation.attachTimeline(t):this.pendingTimeline=t,()=>this.stop()}play(){this.animation.play()}pause(){this.animation.pause()}complete(){this.animation.complete()}cancel(){this._animation&&this.animation.cancel(),this.keyframeResolver?.cancel()}}function Ta(e,t,n,i=0,s=1){const o=Array.from(e).sort((c,h)=>c.sortNodePosition(h)).indexOf(t),r=e.size,a=(r-1)*i;return typeof n=="function"?n(o,r):s===1?o*i:a-o*i}const ao=30,ou=e=>!isNaN(parseFloat(e));class ru{constructor(t,n={}){this.canTrackVelocity=null,this.events={},this.updateAndNotify=i=>{const s=ke.now();if(this.updatedAt!==s&&this.setPrevFrameValue(),this.prev=this.current,this.setCurrent(i),this.current!==this.prev&&(this.events.change?.notify(this.current),this.dependents))for(const o of this.dependents)o.dirty()},this.hasAnimated=!1,this.setCurrent(t),this.owner=n.owner}setCurrent(t){this.current=t,this.updatedAt=ke.now(),this.canTrackVelocity===null&&t!==void 0&&(this.canTrackVelocity=ou(this.current))}setPrevFrameValue(t=this.current){this.prevFrameValue=t,this.prevUpdatedAt=this.updatedAt}onChange(t){return this.on("change",t)}on(t,n){this.events[t]||(this.events[t]=new hs);const i=this.events[t].add(n);return t==="change"?()=>{i(),te.read(()=>{this.events.change.getSize()||this.stop()})}:i}clearListeners(){for(const t in this.events)this.events[t].clear()}attach(t,n){this.passiveEffect=t,this.stopPassiveEffect=n}set(t){this.passiveEffect?this.passiveEffect(t,this.updateAndNotify):this.updateAndNotify(t)}setWithVelocity(t,n,i){this.set(n),this.prev=void 0,this.prevFrameValue=t,this.prevUpdatedAt=this.updatedAt-i}jump(t,n=!0){this.updateAndNotify(t),this.prev=t,this.prevUpdatedAt=this.prevFrameValue=void 0,n&&this.stop(),this.stopPassiveEffect&&this.stopPassiveEffect()}dirty(){this.events.change?.notify(this.current)}addDependent(t){this.dependents||(this.dependents=new Set),this.dependents.add(t)}removeDependent(t){this.dependents&&this.dependents.delete(t)}get(){return this.current}getPrevious(){return this.prev}getVelocity(){const t=ke.now();if(!this.canTrackVelocity||this.prevFrameValue===void 0||t-this.updatedAt>ao)return 0;const n=Math.min(this.updatedAt-this.prevUpdatedAt,ao);return Ur(parseFloat(this.current)-parseFloat(this.prevFrameValue),n)}start(t){return this.stop(),new Promise(n=>{this.hasAnimated=!0,this.animation=t(n),this.events.animationStart&&this.events.animationStart.notify()}).then(()=>{this.events.animationComplete&&this.events.animationComplete.notify(),this.clearAnimation()})}stop(){this.animation&&(this.animation.stop(),this.events.animationCancel&&this.events.animationCancel.notify()),this.clearAnimation()}isAnimating(){return!!this.animation}clearAnimation(){delete this.animation}destroy(){this.dependents?.clear(),this.events.destroy?.notify(),this.clearListeners(),this.stop(),this.stopPassiveEffect&&this.stopPassiveEffect()}}function St(e,t){return new ru(e,t)}function Ca(e,t){if(e?.inherit&&t){const{inherit:n,...i}=e;return{...t,...i}}return e}function vs(e,t){const n=e?.[t]??e?.default??e;return n!==e?Ca(n,e):n}const au={type:"spring",stiffness:500,damping:25,restSpeed:10},lu=e=>({type:"spring",stiffness:550,damping:e===0?2*Math.sqrt(550):30,restSpeed:10}),cu={type:"keyframes",duration:.8},hu={type:"keyframes",ease:[.25,.1,.35,1],duration:.3},uu=(e,{keyframes:t})=>t.length>2?cu:At.has(e)?e.startsWith("scale")?lu(t[1]):au:hu,du=new Set(["when","delay","delayChildren","staggerChildren","staggerDirection","repeat","repeatType","repeatDelay","from","elapsed"]);function fu(e){for(const t in e)if(!du.has(t))return!0;return!1}const ks=(e,t,n,i={},s,o)=>r=>{const a=vs(i,e)||{},l=a.delay||i.delay||0;let{elapsed:c=0}=i;c=c-Le(l);const h={keyframes:Array.isArray(n)?n:[null,n],ease:"easeOut",velocity:t.getVelocity(),...a,delay:-c,onUpdate:d=>{t.set(d),a.onUpdate&&a.onUpdate(d)},onComplete:()=>{r(),a.onComplete&&a.onComplete()},name:e,motionValue:t,element:o?void 0:s};fu(a)||Object.assign(h,uu(e,h)),h.duration&&(h.duration=Le(h.duration)),h.repeatDelay&&(h.repeatDelay=Le(h.repeatDelay)),h.from!==void 0&&(h.keyframes[0]=h.from);let f=!1;if((h.type===!1||h.duration===0&&!h.repeatDelay)&&(Fi(h),h.delay===0&&(f=!0)),(Ze.instantAnimations||Ze.skipAnimations||s?.shouldSkipAnimations||a.skipAnimations)&&(f=!0,Fi(h),h.delay=0),h.allowFlatten=!a.type&&!a.ease,f&&!o&&t.get()!==void 0){const d=Fn(h.keyframes,a);if(d!==void 0){te.update(()=>{h.onUpdate(d),h.onComplete()});return}}return a.isSync?new On(h):new su(h)},pu=/^var\(--(?:([\w-]+)|([\w-]+), ?([a-zA-Z\d ()%#.,-]+))\)/u;function mu(e){const t=pu.exec(e);if(!t)return[,];const[,n,i,s]=t;return[`--${n??i}`,s]}function Aa(e,t,n=1){const[i,s]=mu(e);if(!i)return;const o=window.getComputedStyle(t).getPropertyValue(i);if(o){const r=o.trim();return Hr(r)?parseFloat(r):r}return fs(s)?Aa(s,t,n+1):s}function lo(e){const t=[{},{}];return e?.values.forEach((n,i)=>{t[0][i]=n.get(),t[1][i]=n.getVelocity()}),t}function Ss(e,t,n,i){if(typeof t=="function"){const[s,o]=lo(i);t=t(n!==void 0?n:e.custom,s,o)}if(typeof t=="string"&&(t=e.variants&&e.variants[t]),typeof t=="function"){const[s,o]=lo(i);t=t(n!==void 0?n:e.custom,s,o)}return t}function lt(e,t,n){const i=e.getProps();return Ss(i,t,n!==void 0?n:i.custom,e)}const Pa=new Set(["width","height","top","left","right","bottom",...Ct]),_i=e=>Array.isArray(e);function gu(e,t,n){e.hasValue(t)?e.getValue(t).set(n):e.addValue(t,St(n))}function yu(e){return _i(e)?e[e.length-1]||0:e}function bu(e,t){const n=lt(e,t);let{transitionEnd:i={},transition:s={},...o}=n||{};o={...o,...i};for(const r in o){const a=yu(o[r]);gu(e,r,a)}}const ye=e=>!!(e&&e.getVelocity);function wu(e){return!!(ye(e)&&e.add)}function Hi(e,t){const n=e.getValue("willChange");if(wu(n))return n.add(t);if(!n&&Ze.WillChange){const i=new Ze.WillChange("auto");e.addValue("willChange",i),i.add(t)}}function Ts(e){return e.replace(/([A-Z])/g,t=>`-${t.toLowerCase()}`)}const xu="framerAppearId",Ea="data-"+Ts(xu);function Da(e){return e.props[Ea]}const vu=typeof window<"u";function ku({protectedKeys:e,needsAnimating:t},n){const i=e.hasOwnProperty(n)&&t[n]!==!0;return t[n]=!1,i}function Ma(e,t,{delay:n=0,transitionOverride:i,type:s}={}){let{transition:o,transitionEnd:r,...a}=t;const l=e.getDefaultTransition();o=o?Ca(o,l):l;const c=o?.reduceMotion,h=o?.skipAnimations;i&&(o=i);const f=[],d=s&&e.animationState&&e.animationState.getState()[s],g=o?.path;g&&g.animateVisualElement(e,a,o,n,f);for(const p in a){const b=e.getValue(p,e.latestValues[p]??null),m=a[p];if(m===void 0||d&&ku(d,p))continue;const w={delay:n,...vs(o||{},p)};h&&(w.skipAnimations=!0);const k=b.get();if(k!==void 0&&!b.isAnimating()&&!Array.isArray(m)&&m===k&&!w.velocity){te.update(()=>b.set(m));continue}let v=!1;if(vu&&window.MotionHandoffAnimation){const D=Da(e);if(D){const S=window.MotionHandoffAnimation(D,p,te);S!==null&&(w.startTime=S,v=!0)}}Hi(e,p);const x=c??e.shouldReduceMotion;b.start(ks(p,b,m,x&&Pa.has(p)?{type:!1}:w,e,v));const C=b.animation;C&&f.push(C)}if(r){const p=()=>te.update(()=>{r&&bu(e,r)});f.length?Promise.all(f).then(p):p()}return f}function zi(e,t,n={}){const i=lt(e,t,n.type==="exit"?e.presenceContext?.custom:void 0);let{transition:s=e.getDefaultTransition()||{}}=i||{};n.transitionOverride&&(s=n.transitionOverride);const o=i?()=>Promise.all(Ma(e,i,n)):()=>Promise.resolve(),r=e.variantChildren&&e.variantChildren.size?(l=0)=>{const{delayChildren:c=0,staggerChildren:h,staggerDirection:f}=s;return Su(e,t,l,c,h,f,n)}:()=>Promise.resolve(),{when:a}=s;if(a){const[l,c]=a==="beforeChildren"?[o,r]:[r,o];return l().then(()=>c())}else return Promise.all([o(),r(n.delay)])}function Su(e,t,n=0,i=0,s=0,o=1,r){const a=[];for(const l of e.variantChildren)l.notify("AnimationStart",t),a.push(zi(l,t,{...r,delay:n+(typeof i=="function"?0:i)+Ta(e.variantChildren,l,i,s,o)}).then(()=>l.notify("AnimationComplete",t)));return Promise.all(a)}function Tu(e,t,n={}){e.notify("AnimationStart",t);let i;if(Array.isArray(t)){const s=t.map(o=>zi(e,o,n));i=Promise.all(s)}else if(typeof t=="string")i=zi(e,t,n);else{const s=typeof t=="function"?lt(e,t,n.custom):t;i=Promise.all(Ma(e,s,n))}return i.then(()=>{e.notify("AnimationComplete",t)})}const Cu={test:e=>e==="auto",parse:e=>e},Oa=e=>t=>t.test(e),Ra=[Tt,$,Ge,Ke,Qc,qc,Cu],co=e=>Ra.find(Oa(e));function Au(e){return typeof e=="number"?e===0:e!==null?e==="none"||e==="0"||Wr(e):!0}const Pu=new Set(["brightness","contrast","saturate","opacity"]);function Eu(e){const[t,n]=e.slice(0,-1).split("(");if(t==="drop-shadow")return e;const[i]=n.match(ps)||[];if(!i)return e;const s=n.replace(i,"");let o=Pu.has(t)?1:0;return i!==n&&(o*=100),t+"("+o+s+")"}const Du=/\b([a-z-]*)\(.*?\)/gu,Wi={...Fe,getAnimatableNone:e=>{const t=e.match(Du);return t?t.map(Eu).join(" "):e}},Gi={...Fe,getAnimatableNone:e=>{const t=Fe.parse(e);return Fe.createTransformer(e)(t.map(i=>typeof i=="number"?0:typeof i=="object"?{...i,alpha:1}:i))}},ho={...Tt,transform:Math.round},Mu={rotate:Ke,pathRotation:Ke,rotateX:Ke,rotateY:Ke,rotateZ:Ke,scale:nn,scaleX:nn,scaleY:nn,scaleZ:nn,skew:Ke,skewX:Ke,skewY:Ke,distance:$,translateX:$,translateY:$,translateZ:$,x:$,y:$,z:$,perspective:$,transformPerspective:$,opacity:_t,originX:Ys,originY:Ys,originZ:$},Rn={borderWidth:$,borderTopWidth:$,borderRightWidth:$,borderBottomWidth:$,borderLeftWidth:$,borderRadius:$,borderTopLeftRadius:$,borderTopRightRadius:$,borderBottomRightRadius:$,borderBottomLeftRadius:$,width:$,maxWidth:$,height:$,maxHeight:$,top:$,right:$,bottom:$,left:$,inset:$,insetBlock:$,insetBlockStart:$,insetBlockEnd:$,insetInline:$,insetInlineStart:$,insetInlineEnd:$,padding:$,paddingTop:$,paddingRight:$,paddingBottom:$,paddingLeft:$,paddingBlock:$,paddingBlockStart:$,paddingBlockEnd:$,paddingInline:$,paddingInlineStart:$,paddingInlineEnd:$,margin:$,marginTop:$,marginRight:$,marginBottom:$,marginLeft:$,marginBlock:$,marginBlockStart:$,marginBlockEnd:$,marginInline:$,marginInlineStart:$,marginInlineEnd:$,fontSize:$,backgroundPositionX:$,backgroundPositionY:$,...Mu,zIndex:ho,fillOpacity:_t,strokeOpacity:_t,numOctaves:ho},Ou={...Rn,color:le,backgroundColor:le,outlineColor:le,fill:le,stroke:le,borderColor:le,borderTopColor:le,borderRightColor:le,borderBottomColor:le,borderLeftColor:le,filter:Wi,WebkitFilter:Wi,mask:Gi,WebkitMask:Gi},ja=e=>Ou[e],Ru=new Set([Wi,Gi]);function La(e,t){let n=ja(e);return Ru.has(n)||(n=Fe),n.getAnimatableNone?n.getAnimatableNone(t):void 0}const ju=new Set(["auto","none","0"]);function Lu(e,t,n){let i=0,s;for(;i<e.length&&!s;){const o=e[i];typeof o=="string"&&!ju.has(o)&&kt(o).values.length&&(s=e[i]),i++}if(s&&n)for(const o of t)e[o]=La(n,s)}class Nu extends xs{constructor(t,n,i,s,o){super(t,n,i,s,o,!0)}readKeyframes(){const{unresolvedKeyframes:t,element:n,name:i}=this;if(!n||!n.current)return;super.readKeyframes();for(let h=0;h<t.length;h++){let f=t[h];if(typeof f=="string"&&(f=f.trim(),fs(f))){const d=Aa(f,n.current);d!==void 0&&(t[h]=d),h===t.length-1&&(this.finalKeyframe=f)}}if(this.resolveNoneKeyframes(),!Pa.has(i)||t.length!==2)return;const[s,o]=t,r=co(s),a=co(o),l=Qs(s),c=Qs(o);if(l!==c&&Xe[i]){this.needsMeasurement=!0;return}if(r!==a)if(so(r)&&so(a))for(let h=0;h<t.length;h++){const f=t[h];typeof f=="string"&&(t[h]=parseFloat(f))}else Xe[i]&&(this.needsMeasurement=!0)}resolveNoneKeyframes(){const{unresolvedKeyframes:t,name:n}=this,i=[];for(let s=0;s<t.length;s++)(t[s]===null||Au(t[s]))&&i.push(s);i.length&&Lu(t,i,n)}measureInitialState(){const{element:t,unresolvedKeyframes:n,name:i}=this;if(!t||!t.current)return;i==="height"&&(this.suspendedScrollY=window.pageYOffset),this.measuredOrigin=Xe[i](t.measureViewportBox(),window.getComputedStyle(t.current)),n[0]=this.measuredOrigin;const s=n[n.length-1];s!==void 0&&t.getValue(i,s).jump(s,!1)}measureEndState(){const{element:t,name:n,unresolvedKeyframes:i}=this;if(!t||!t.current)return;const s=t.getValue(n);s&&s.jump(this.measuredOrigin,!1);const o=i.length-1,r=i[o];i[o]=Xe[n](t.measureViewportBox(),window.getComputedStyle(t.current)),r!==null&&this.finalKeyframe===void 0&&(this.finalKeyframe=r),this.removedTransforms?.length&&this.removedTransforms.forEach(([a,l])=>{t.getValue(a).set(l)}),this.resolveNoneKeyframes()}}const Cs=["borderTopLeftRadius","borderTopRightRadius","borderBottomRightRadius","borderBottomLeftRadius"];function Na(e,t,n){if(e==null)return[];if(e instanceof EventTarget)return[e];if(typeof e=="string"){let i=document;const s=n?.[e]??i.querySelectorAll(e);return s?Array.from(s):[]}return Array.from(e).filter(i=>i!=null)}const Ui=(e,t)=>t&&typeof e=="number"?t.transform(e):e;function gn(e){return zr(e)&&"offsetHeight"in e&&!("ownerSVGElement"in e)}const{schedule:As}=ia(queueMicrotask,!1),$e={x:!1,y:!1};function Va(){return $e.x||$e.y}function Vu(e){return e==="x"||e==="y"?$e[e]?null:($e[e]=!0,()=>{$e[e]=!1}):$e.x||$e.y?null:($e.x=$e.y=!0,()=>{$e.x=$e.y=!1})}function Ia(e,t){const n=Na(e),i=new AbortController,s={passive:!0,...t,signal:i.signal};return[n,s,()=>i.abort()]}function Iu(e){return!(e.pointerType==="touch"||Va())}function Bu(e,t,n={}){const[i,s,o]=Ia(e,n);return i.forEach(r=>{let a=!1,l=!1,c;const h=()=>{r.removeEventListener("pointerleave",p)},f=m=>{c&&(c(m),c=void 0),h()},d=m=>{a=!1,window.removeEventListener("pointerup",d),window.removeEventListener("pointercancel",d),l&&(l=!1,f(m))},g=()=>{a=!0,window.addEventListener("pointerup",d,s),window.addEventListener("pointercancel",d,s)},p=m=>{if(m.pointerType!=="touch"){if(a){l=!0;return}f(m)}},b=m=>{if(!Iu(m))return;l=!1;const w=t(r,m);typeof w=="function"&&(c=w,r.addEventListener("pointerleave",p,s))};r.addEventListener("pointerenter",b,s),r.addEventListener("pointerdown",g,s)}),o}const Ba=(e,t)=>t?e===t?!0:Ba(e,t.parentElement):!1,Ps=e=>e.pointerType==="mouse"?typeof e.button!="number"||e.button<=0:e.isPrimary!==!1,$u=new Set(["BUTTON","INPUT","SELECT","TEXTAREA","A"]);function Fu(e){return $u.has(e.tagName)||e.isContentEditable===!0}const _u=new Set(["INPUT","SELECT","TEXTAREA"]);function Hu(e){return _u.has(e.tagName)||e.isContentEditable===!0}const yn=new WeakSet;function uo(e){return t=>{t.key==="Enter"&&e(t)}}function ti(e,t){e.dispatchEvent(new PointerEvent("pointer"+t,{isPrimary:!0,bubbles:!0}))}const zu=(e,t)=>{const n=e.currentTarget;if(!n)return;const i=uo(()=>{if(yn.has(n))return;ti(n,"down");const s=uo(()=>{ti(n,"up")}),o=()=>ti(n,"cancel");n.addEventListener("keyup",s,t),n.addEventListener("blur",o,t)});n.addEventListener("keydown",i,t),n.addEventListener("blur",()=>n.removeEventListener("keydown",i),t)};function fo(e){return Ps(e)&&!Va()}const po=new WeakSet;function Wu(e,t,n={}){const[i,s,o]=Ia(e,n),r=a=>{const l=a.currentTarget;if(!fo(a)||po.has(a))return;yn.add(l),n.stopPropagation&&po.add(a);const c=t(l,a),h={...s,capture:!0},f=(p,b)=>{window.removeEventListener("pointerup",d,h),window.removeEventListener("pointercancel",g,h),yn.has(l)&&yn.delete(l),fo(p)&&typeof c=="function"&&c(p,{success:b})},d=p=>{f(p,l===window||l===document||n.useGlobalTarget||Ba(l,p.target))},g=p=>{f(p,!1)};window.addEventListener("pointerup",d,h),window.addEventListener("pointercancel",g,h)};return i.forEach(a=>{(n.useGlobalTarget?window:a).addEventListener("pointerdown",r,s),gn(a)&&(a.addEventListener("focus",c=>zu(c,s)),!Fu(a)&&!a.hasAttribute("tabindex")&&(a.tabIndex=0))}),o}function Es(e){return zr(e)&&"ownerSVGElement"in e}const bn=new WeakMap;let wn;const $a=(e,t,n)=>(i,s)=>s&&s[0]?s[0][e+"Size"]:Es(i)&&"getBBox"in i?i.getBBox()[t]:i[n],Gu=$a("inline","width","offsetWidth"),Uu=$a("block","height","offsetHeight");function Ku({target:e,borderBoxSize:t}){bn.get(e)?.forEach(n=>{n(e,{get width(){return Gu(e,t)},get height(){return Uu(e,t)}})})}function qu(e){e.forEach(Ku)}function Qu(){typeof ResizeObserver>"u"||(wn=new ResizeObserver(qu))}function Yu(e,t){wn||Qu();const n=Na(e);return n.forEach(i=>{let s=bn.get(i);s||(s=new Set,bn.set(i,s)),s.add(t),wn?.observe(i)}),()=>{n.forEach(i=>{const s=bn.get(i);s?.delete(t),s?.size||wn?.unobserve(i)})}}const xn=new Set;let xt;function Xu(){xt=()=>{const e={get width(){return window.innerWidth},get height(){return window.innerHeight}};xn.forEach(t=>t(e))},window.addEventListener("resize",xt)}function Zu(e){return xn.add(e),xt||Xu(),()=>{xn.delete(e),!xn.size&&typeof xt=="function"&&(window.removeEventListener("resize",xt),xt=void 0)}}function mo(e,t){return typeof e=="function"?Zu(e):Yu(e,t)}function Ju(e){return Es(e)&&e.tagName==="svg"}const ed=[...Ra,le,Fe],td=e=>ed.find(Oa(e)),go=()=>({translate:0,scale:1,origin:0,originPoint:0}),vt=()=>({x:go(),y:go()}),yo=()=>({min:0,max:0}),ue=()=>({x:yo(),y:yo()}),nd=new WeakMap;function _n(e){return e!==null&&typeof e=="object"&&typeof e.start=="function"}function Ht(e){return typeof e=="string"||Array.isArray(e)}const Ds=["animate","whileInView","whileFocus","whileHover","whileTap","whileDrag","exit"],Ms=["initial",...Ds];function Hn(e){return _n(e.animate)||Ms.some(t=>Ht(e[t]))}function Fa(e){return!!(Hn(e)||e.variants)}function id(e,t,n){for(const i in t){const s=t[i],o=n[i];if(ye(s))e.addValue(i,s);else if(ye(o))e.addValue(i,St(s,{owner:e}));else if(o!==s)if(e.hasValue(i)){const r=e.getValue(i);r.liveStyle===!0?r.jump(s):r.hasAnimated||r.set(s)}else{const r=e.getStaticValue(i);e.addValue(i,St(r!==void 0?r:s,{owner:e}))}}for(const i in n)t[i]===void 0&&e.removeValue(i);return t}const Ki={current:null},_a={current:!1},sd=typeof window<"u";function od(){if(_a.current=!0,!!sd)if(window.matchMedia){const e=window.matchMedia("(prefers-reduced-motion)"),t=()=>Ki.current=e.matches;e.addEventListener("change",t),t()}else Ki.current=!1}const bo=["AnimationStart","AnimationComplete","Update","BeforeLayoutMeasure","LayoutMeasure","LayoutAnimationStart","LayoutAnimationComplete"];let jn={};function Ha(e){jn=e}function rd(){return jn}class ad{scrapeMotionValuesFromProps(t,n,i){return{}}constructor({parent:t,props:n,presenceContext:i,reducedMotionConfig:s,skipAnimations:o,blockInitialAnimation:r,visualState:a},l={}){this.current=null,this.children=new Set,this.isVariantNode=!1,this.isControllingVariants=!1,this.shouldReduceMotion=null,this.shouldSkipAnimations=!1,this.values=new Map,this.KeyframeResolver=xs,this.features={},this.valueSubscriptions=new Map,this.prevMotionValues={},this.hasBeenMounted=!1,this.events={},this.propEventSubscriptions={},this.notifyUpdate=()=>this.notify("Update",this.latestValues),this.render=()=>{this.current&&(this.triggerBuild(),this.renderInstance(this.current,this.renderState,this.props.style,this.projection))},this.renderScheduledAt=0,this.scheduleRender=()=>{const g=ke.now();this.renderScheduledAt<g&&(this.renderScheduledAt=g,te.render(this.render,!1,!0))};const{latestValues:c,renderState:h}=a;this.latestValues=c,this.baseTarget={...c},this.initialValues=n.initial?{...c}:{},this.renderState=h,this.parent=t,this.props=n,this.presenceContext=i,this.depth=t?t.depth+1:0,this.reducedMotionConfig=s,this.skipAnimationsConfig=o,this.options=l,this.blockInitialAnimation=!!r,this.isControllingVariants=Hn(n),this.isVariantNode=Fa(n),this.isVariantNode&&(this.variantChildren=new Set),this.manuallyAnimateOnMount=!!(t&&t.current);const{willChange:f,...d}=this.scrapeMotionValuesFromProps(n,{},this);for(const g in d){const p=d[g];c[g]!==void 0&&ye(p)&&p.set(c[g])}}mount(t){if(this.hasBeenMounted)for(const n in this.initialValues)this.values.get(n)?.jump(this.initialValues[n]),this.latestValues[n]=this.initialValues[n];this.current=t,nd.set(t,this),this.projection&&!this.projection.instance&&this.projection.mount(t),this.parent&&this.isVariantNode&&!this.isControllingVariants&&(this.removeFromVariantTree=this.parent.addVariantChild(this)),this.values.forEach((n,i)=>this.bindToMotionValue(i,n)),this.reducedMotionConfig==="never"?this.shouldReduceMotion=!1:this.reducedMotionConfig==="always"?this.shouldReduceMotion=!0:(_a.current||od(),this.shouldReduceMotion=Ki.current),this.shouldSkipAnimations=this.skipAnimationsConfig??!1,this.parent?.addChild(this),this.update(this.props,this.presenceContext),this.hasBeenMounted=!0}unmount(){this.projection&&this.projection.unmount(),Je(this.notifyUpdate),Je(this.render),this.valueSubscriptions.forEach(t=>t()),this.valueSubscriptions.clear(),this.removeFromVariantTree&&this.removeFromVariantTree(),this.parent?.removeChild(this);for(const t in this.events)this.events[t].clear();for(const t in this.features){const n=this.features[t];n&&(n.unmount(),n.isMounted=!1)}this.current=null}addChild(t){this.children.add(t),this.enteringChildren??(this.enteringChildren=new Set),this.enteringChildren.add(t)}removeChild(t){this.children.delete(t),this.enteringChildren&&this.enteringChildren.delete(t)}bindToMotionValue(t,n){if(this.valueSubscriptions.has(t)&&this.valueSubscriptions.get(t)(),n.accelerate&&Sa.has(t)&&this.current instanceof HTMLElement){const{factory:r,keyframes:a,times:l,ease:c,duration:h}=n.accelerate,f=new va({element:this.current,name:t,keyframes:a,times:l,ease:c,duration:Le(h)}),d=r(f);this.valueSubscriptions.set(t,()=>{d(),f.cancel()});return}const i=At.has(t);i&&this.onBindTransform&&this.onBindTransform();const s=n.on("change",r=>{this.latestValues[t]=r,this.props.onUpdate&&te.preRender(this.notifyUpdate),i&&this.projection&&(this.projection.isTransformDirty=!0),this.scheduleRender()});let o;typeof window<"u"&&window.MotionCheckAppearSync&&(o=window.MotionCheckAppearSync(this,t,n)),this.valueSubscriptions.set(t,()=>{s(),o&&o()})}sortNodePosition(t){return!this.current||!this.sortInstanceNodePosition||this.type!==t.type?0:this.sortInstanceNodePosition(this.current,t.current)}updateFeatures(){let t="animation";for(t in jn){const n=jn[t];if(!n)continue;const{isEnabled:i,Feature:s}=n;if(!this.features[t]&&s&&i(this.props)&&(this.features[t]=new s(this)),this.features[t]){const o=this.features[t];o.isMounted?o.update():(o.mount(),o.isMounted=!0)}}}triggerBuild(){this.build(this.renderState,this.latestValues,this.props)}measureViewportBox(){return this.current?this.measureInstanceViewportBox(this.current,this.props):ue()}getStaticValue(t){return this.latestValues[t]}setStaticValue(t,n){this.latestValues[t]=n}update(t,n){(t.transformTemplate||this.props.transformTemplate)&&this.scheduleRender(),this.prevProps=this.props,this.props=t,this.prevPresenceContext=this.presenceContext,this.presenceContext=n;for(let i=0;i<bo.length;i++){const s=bo[i];this.propEventSubscriptions[s]&&(this.propEventSubscriptions[s](),delete this.propEventSubscriptions[s]);const o="on"+s,r=t[o];r&&(this.propEventSubscriptions[s]=this.on(s,r))}this.prevMotionValues=id(this,this.scrapeMotionValuesFromProps(t,this.prevProps||{},this),this.prevMotionValues),this.handleChildMotionValue&&this.handleChildMotionValue()}getProps(){return this.props}getVariant(t){return this.props.variants?this.props.variants[t]:void 0}getDefaultTransition(){return this.props.transition}getTransformPagePoint(){return this.props.transformPagePoint}getClosestVariantNode(){return this.isVariantNode?this:this.parent?this.parent.getClosestVariantNode():void 0}addVariantChild(t){const n=this.getClosestVariantNode();if(n)return n.variantChildren&&n.variantChildren.add(t),()=>n.variantChildren.delete(t)}addValue(t,n){const i=this.values.get(t);n!==i&&(i&&this.removeValue(t),this.bindToMotionValue(t,n),this.values.set(t,n),this.latestValues[t]=n.get())}removeValue(t){this.values.delete(t);const n=this.valueSubscriptions.get(t);n&&(n(),this.valueSubscriptions.delete(t)),delete this.latestValues[t],this.removeValueFromRenderState(t,this.renderState)}hasValue(t){return this.values.has(t)}getValue(t,n){if(this.props.values&&this.props.values[t])return this.props.values[t];let i=this.values.get(t);return i===void 0&&n!==void 0&&(i=St(n===null?void 0:n,{owner:this}),this.addValue(t,i)),i}readValue(t,n){let i=this.latestValues[t]!==void 0||!this.current?this.latestValues[t]:this.getBaseTargetFromProps(this.props,t)??this.readValueFromInstance(this.current,t,this.options);return i!=null&&(typeof i=="string"&&(Hr(i)||Wr(i))?i=parseFloat(i):!td(i)&&Fe.test(n)&&(i=La(t,n)),this.setBaseTarget(t,ye(i)?i.get():i)),ye(i)?i.get():i}setBaseTarget(t,n){this.baseTarget[t]=n}getBaseTarget(t){const{initial:n}=this.props;let i;if(typeof n=="string"||typeof n=="object"){const o=Ss(this.props,n,this.presenceContext?.custom);o&&(i=o[t])}if(n&&i!==void 0)return i;const s=this.getBaseTargetFromProps(this.props,t);return s!==void 0&&!ye(s)?s:this.initialValues[t]!==void 0&&i===void 0?void 0:this.baseTarget[t]}on(t,n){return this.events[t]||(this.events[t]=new hs),this.events[t].add(n)}notify(t,...n){this.events[t]&&this.events[t].notify(...n)}scheduleRenderMicrotask(){As.render(this.render)}}class za extends ad{constructor(){super(...arguments),this.KeyframeResolver=Nu}sortInstanceNodePosition(t,n){return t.compareDocumentPosition(n)&2?1:-1}getBaseTargetFromProps(t,n){const i=t.style;return i?i[n]:void 0}removeValueFromRenderState(t,{vars:n,style:i}){delete n[t],delete i[t]}handleChildMotionValue(){this.childSubscription&&(this.childSubscription(),delete this.childSubscription);const{children:t}=this.props;ye(t)&&(this.childSubscription=t.on("change",n=>{this.current&&(this.current.textContent=`${n}`)}))}}class et{constructor(t){this.isMounted=!1,this.node=t}update(){}}function Wa({top:e,left:t,right:n,bottom:i}){return{x:{min:t,max:n},y:{min:e,max:i}}}function ld({x:e,y:t}){return{top:t.min,right:e.max,bottom:t.max,left:e.min}}function cd(e,t){if(!t)return e;const n=t({x:e.left,y:e.top}),i=t({x:e.right,y:e.bottom});return{top:n.y,left:n.x,bottom:i.y,right:i.x}}function ni(e){return e===void 0||e===1}function qi({scale:e,scaleX:t,scaleY:n}){return!ni(e)||!ni(t)||!ni(n)}function st(e){return qi(e)||Ga(e)||e.z||e.rotate||e.rotateX||e.rotateY||e.skewX||e.skewY}function Ga(e){return wo(e.x)||wo(e.y)}function wo(e){return e&&e!=="0%"}function Ln(e,t,n){const i=e-n,s=t*i;return n+s}function xo(e,t,n,i,s){return s!==void 0&&(e=Ln(e,s,i)),Ln(e,n,i)+t}function Qi(e,t=0,n=1,i,s){e.min=xo(e.min,t,n,i,s),e.max=xo(e.max,t,n,i,s)}function Ua(e,{x:t,y:n}){Qi(e.x,t.translate,t.scale,t.originPoint),Qi(e.y,n.translate,n.scale,n.originPoint)}const vo=.999999999999,ko=1.0000000000001;function hd(e,t,n,i=!1){const s=n.length;if(!s)return;t.x=t.y=1;let o,r;for(let a=0;a<s;a++){o=n[a],r=o.projectionDelta;const{visualElement:l}=o.options;l&&l.props.style&&l.props.style.display==="contents"||(i&&o.options.layoutScroll&&o.scroll&&o!==o.root&&(He(e.x,-o.scroll.offset.x),He(e.y,-o.scroll.offset.y)),r&&(t.x*=r.x.scale,t.y*=r.y.scale,Ua(e,r)),i&&st(o.latestValues)&&vn(e,o.latestValues,o.layout?.layoutBox))}t.x<ko&&t.x>vo&&(t.x=1),t.y<ko&&t.y>vo&&(t.y=1)}function He(e,t){e.min+=t,e.max+=t}function So(e,t,n,i,s=.5){const o=ee(e.min,e.max,s);Qi(e,t,n,o,i)}function To(e,t){return typeof e=="string"?parseFloat(e)/100*(t.max-t.min):e}function vn(e,t,n){const i=n??e;So(e.x,To(t.x,i.x),t.scaleX,t.scale,t.originX),So(e.y,To(t.y,i.y),t.scaleY,t.scale,t.originY)}function Ka(e,t){return Wa(cd(e.getBoundingClientRect(),t))}function ud(e,t,n){const i=Ka(e,n),{scroll:s}=t;return s&&(He(i.x,s.offset.x),He(i.y,s.offset.y)),i}const dd={x:"translateX",y:"translateY",z:"translateZ",transformPerspective:"perspective"},fd=Ct.length;function pd(e,t,n){let i="",s=!0;for(let r=0;r<fd;r++){const a=Ct[r],l=e[a];if(l===void 0)continue;let c=!0;if(typeof l=="number")c=l===(a.startsWith("scale")?1:0);else{const h=parseFloat(l);c=a.startsWith("scale")?h===1:h===0}if(!c||n){const h=Ui(l,Rn[a]);if(!c){s=!1;const f=dd[a]||a;i+=`${f}(${h}) `}n&&(t[a]=h)}}const o=e.pathRotation;return o&&(s=!1,i+=`rotate(${Ui(o,Rn.pathRotation)}) `),i=i.trim(),n?i=n(t,s?"":i):s&&(i="none"),i}function Os(e,t,n){const{style:i,vars:s,transformOrigin:o}=e;let r=!1,a=!1;for(const l in t){const c=t[l];if(At.has(l)){r=!0;continue}else if(oa(l)){s[l]=c;continue}else{const h=Ui(c,Rn[l]);l.startsWith("origin")?(a=!0,o[l]=h):i[l]=h}}if(t.transform||(r||n?i.transform=pd(t,e.transform,n):i.transform&&(i.transform="none")),a){const{originX:l="50%",originY:c="50%",originZ:h=0}=o;i.transformOrigin=`${l} ${c} ${h}`}}function qa(e,{style:t,vars:n},i,s){const o=e.style;let r;for(r in t)o[r]=t[r];s?.applyProjectionStyles(o,i);for(r in n)o.setProperty(r,n[r])}function Co(e,t){return t.max===t.min?0:e/(t.max-t.min)*100}const Et={correct:(e,t)=>{if(!t.target)return e;if(typeof e=="string")if($.test(e))e=parseFloat(e);else return e;const n=Co(e,t.target.x),i=Co(e,t.target.y);return`${n}% ${i}%`}},md={correct:(e,{treeScale:t,projectionDelta:n})=>{const i=e,s=Fe.parse(e);if(s.length>5)return i;const o=Fe.createTransformer(e),r=typeof s[0]!="number"?1:0,a=n.x.scale*t.x,l=n.y.scale*t.y;s[0+r]/=a,s[1+r]/=l;const c=ee(a,l,.5);return typeof s[2+r]=="number"&&(s[2+r]/=c),typeof s[3+r]=="number"&&(s[3+r]/=c),o(s)}},Yi={borderRadius:{...Et,applyTo:[...Cs]},borderTopLeftRadius:Et,borderTopRightRadius:Et,borderBottomLeftRadius:Et,borderBottomRightRadius:Et,boxShadow:md};function Qa(e,{layout:t,layoutId:n}){return At.has(e)||e.startsWith("origin")||(t||n!==void 0)&&(!!Yi[e]||e==="opacity")}function Rs(e,t,n){const i=e.style,s=t?.style,o={};if(!i)return o;for(const r in i)(ye(i[r])||s&&ye(s[r])||Qa(r,e)||n?.getValue(r)?.liveStyle!==void 0)&&(o[r]=i[r]);return o}function gd(e){return window.getComputedStyle(e)}class yd extends za{constructor(){super(...arguments),this.type="html",this.renderInstance=qa}mount(t){$n(!!t.style),super.mount(t)}readValueFromInstance(t,n){if(At.has(n))return this.projection?.isProjecting?Ni(n):Vh(t,n);{const i=gd(t),s=(oa(n)?i.getPropertyValue(n):i[n])||0;return typeof s=="string"?s.trim():s}}measureInstanceViewportBox(t,{transformPagePoint:n}){return Ka(t,n)}build(t,n,i){Os(t,n,i.transformTemplate)}scrapeMotionValuesFromProps(t,n,i){return Rs(t,n,i)}}const bd={offset:"stroke-dashoffset",array:"stroke-dasharray"},wd={offset:"strokeDashoffset",array:"strokeDasharray"};function xd(e,t,n=1,i=0,s=!0){e.pathLength=1;const o=s?bd:wd;e[o.offset]=`${-i}`,e[o.array]=`${t} ${n}`}const Ya=["transform","opacity","offsetDistance","offsetPath","offsetRotate","offsetAnchor"];function Xa(e,{attrX:t,attrY:n,attrScale:i,pathLength:s,pathSpacing:o=1,pathOffset:r=0,...a},l,c,h){if(Os(e,a,c),l){e.style.viewBox&&(e.attrs.viewBox=e.style.viewBox);return}e.attrs=e.style,e.style={};const{attrs:f,style:d}=e;for(const g of Ya)f[g]!==void 0&&(d[g]=f[g],delete f[g]);(d.transform||f.transformOrigin)&&(d.transformOrigin=f.transformOrigin??"50% 50%",delete f.transformOrigin),d.transform&&(d.transformBox=h?.transformBox??"fill-box",delete f.transformBox),t!==void 0&&(f.x=t),n!==void 0&&(f.y=n),i!==void 0&&(f.scale=i),s!==void 0&&xd(f,s,o,r,!1)}const Za=new Set(["baseFrequency","diffuseConstant","kernelMatrix","kernelUnitLength","keySplines","keyTimes","limitingConeAngle","markerHeight","markerWidth","numOctaves","targetX","targetY","surfaceScale","specularConstant","specularExponent","stdDeviation","tableValues","viewBox","gradientTransform","pathLength","startOffset","textLength","lengthAdjust"]),Ja=e=>typeof e=="string"&&e.toLowerCase()==="svg";function vd(e,t,n,i){qa(e,t,void 0,i);for(const s in t.attrs)e.setAttribute(Za.has(s)?s:Ts(s),t.attrs[s])}function el(e,t,n){const i=Rs(e,t,n);for(const s in e)if(ye(e[s])||ye(t[s])){const o=Ct.indexOf(s)!==-1?"attr"+s.charAt(0).toUpperCase()+s.substring(1):s;i[o]=e[s]}return i}class kd extends za{constructor(){super(...arguments),this.type="svg",this.isSVGTag=!1,this.measureInstanceViewportBox=ue}getBaseTargetFromProps(t,n){return t[n]}readValueFromInstance(t,n){if(At.has(n)){const i=ja(n);return i&&i.default||0}if(Ya.includes(n)){const s=getComputedStyle(t)[n];if(typeof s=="string"&&s)return s.trim()}return n=Za.has(n)?n:Ts(n),t.getAttribute(n)}scrapeMotionValuesFromProps(t,n,i){return el(t,n,i)}build(t,n,i){Xa(t,n,this.isSVGTag,i.transformTemplate,i.style)}renderInstance(t,n,i,s){vd(t,n,i,s)}mount(t){this.isSVGTag=Ja(t.tagName),super.mount(t)}}const Sd=Ms.length;function tl(e){if(!e)return;if(!e.isControllingVariants){const n=e.parent?tl(e.parent)||{}:{};return e.props.initial!==void 0&&(n.initial=e.props.initial),n}const t={};for(let n=0;n<Sd;n++){const i=Ms[n],s=e.props[i];(Ht(s)||s===!1)&&(t[i]=s)}return t}function nl(e,t){if(!Array.isArray(t))return!1;const n=t.length;if(n!==e.length)return!1;for(let i=0;i<n;i++)if(t[i]!==e[i])return!1;return!0}const Td=[...Ds].reverse(),Cd=Ds.length;function Ad(e){return t=>Promise.all(t.map(({animation:n,options:i})=>Tu(e,n,i)))}function Pd(e){let t=Ad(e),n=Ao(),i=!0,s=!1;const o=c=>(h,f)=>{const d=lt(e,f,c==="exit"?e.presenceContext?.custom:void 0);if(d){const{transition:g,transitionEnd:p,...b}=d;h={...h,...b,...p}}return h};function r(c){t=c(e)}function a(c){const{props:h}=e,f=tl(e.parent)||{},d=[],g=new Set;let p={},b=1/0;for(let w=0;w<Cd;w++){const k=Td[w],v=n[k],x=h[k]!==void 0?h[k]:f[k],C=Ht(x),D=k===c?v.isActive:null;D===!1&&(b=w);let S=x===f[k]&&x!==h[k]&&C;if(S&&(i||s)&&e.manuallyAnimateOnMount&&(S=!1),v.protectedKeys={...p},!v.isActive&&D===null||!x&&!v.prevProp||_n(x)||typeof x=="boolean")continue;if(k==="exit"&&v.isActive&&D!==!0){v.prevResolvedValues&&(p={...p,...v.prevResolvedValues});continue}const P=Ed(v.prevProp,x);let E=P||k===c&&v.isActive&&!S&&C||w>b&&C,L=!1;const I=Array.isArray(x)?x:[x];let B=I.reduce(o(k),{});D===!1&&(B={});const{prevResolvedValues:O={}}=v,_={...O,...B},T=N=>{E=!0,g.has(N)&&(L=!0,g.delete(N)),v.needsAnimating[N]=!0;const G=e.getValue(N);G&&(G.liveStyle=!1)};for(const N in _){const G=B[N],j=O[N];if(p.hasOwnProperty(N))continue;let X=!1;_i(G)&&_i(j)?X=!nl(G,j)||P:X=G!==j,X?G!=null?T(N):g.add(N):G!==void 0&&g.has(N)?T(N):v.protectedKeys[N]=!0}v.prevProp=x,v.prevResolvedValues=B,v.isActive&&(p={...p,...B}),(i||s)&&e.blockInitialAnimation&&(E=!1);const W=S&&P;E&&(!W||L)&&d.push(...I.map(N=>{const G={type:k};if(typeof N=="string"&&(i||s)&&!W&&e.manuallyAnimateOnMount&&e.parent){const{parent:j}=e,X=lt(j,N);if(j.enteringChildren&&X){const{delayChildren:oe}=X.transition||{};G.delay=Ta(j.enteringChildren,e,oe)}}return{animation:N,options:G}}))}if(g.size){const w={};if(typeof h.initial!="boolean"){const k=lt(e,Array.isArray(h.initial)?h.initial[0]:h.initial);k&&k.transition&&(w.transition=k.transition)}g.forEach(k=>{const v=e.getBaseTarget(k),x=e.getValue(k);x&&(x.liveStyle=!0),w[k]=v??null}),d.push({animation:w})}let m=!!d.length;return i&&(h.initial===!1||h.initial===h.animate)&&!e.manuallyAnimateOnMount&&(m=!1),i=!1,s=!1,m?t(d):Promise.resolve()}function l(c,h){if(n[c].isActive===h)return Promise.resolve();e.variantChildren?.forEach(d=>d.animationState?.setActive(c,h)),n[c].isActive=h;const f=a(c);for(const d in n)n[d].protectedKeys={};return f}return{animateChanges:a,setActive:l,setAnimateFunction:r,getState:()=>n,reset:()=>{n=Ao(),s=!0}}}function Ed(e,t){return typeof t=="string"?t!==e:Array.isArray(t)?!nl(t,e):!1}function it(e=!1){return{isActive:e,protectedKeys:{},needsAnimating:{},prevResolvedValues:{}}}function Ao(){return{animate:it(!0),whileInView:it(),whileHover:it(),whileTap:it(),whileDrag:it(),whileFocus:it(),exit:it()}}function Xi(e,t){e.min=t.min,e.max=t.max}function Be(e,t){Xi(e.x,t.x),Xi(e.y,t.y)}function Po(e,t){e.translate=t.translate,e.scale=t.scale,e.originPoint=t.originPoint,e.origin=t.origin}const il=1e-4,Dd=1-il,Md=1+il,sl=.01,Od=0-sl,Rd=0+sl;function Se(e){return e.max-e.min}function jd(e,t,n){return Math.abs(e-t)<=n}function Eo(e,t,n,i=.5){e.origin=i,e.originPoint=ee(t.min,t.max,e.origin),e.scale=Se(n)/Se(t),e.translate=ee(n.min,n.max,e.origin)-e.originPoint,(e.scale>=Dd&&e.scale<=Md||isNaN(e.scale))&&(e.scale=1),(e.translate>=Od&&e.translate<=Rd||isNaN(e.translate))&&(e.translate=0)}function Nt(e,t,n,i){Eo(e.x,t.x,n.x,i?i.originX:void 0),Eo(e.y,t.y,n.y,i?i.originY:void 0)}function Do(e,t,n,i=0){const s=i?ee(n.min,n.max,i):n.min;e.min=s+t.min,e.max=e.min+Se(t)}function Ld(e,t,n,i){Do(e.x,t.x,n.x,i?.x),Do(e.y,t.y,n.y,i?.y)}function Mo(e,t,n,i=0){const s=i?ee(n.min,n.max,i):n.min;e.min=t.min-s,e.max=e.min+Se(t)}function Nn(e,t,n,i){Mo(e.x,t.x,n.x,i?.x),Mo(e.y,t.y,n.y,i?.y)}function Oo(e,t,n,i,s){return e-=t,e=Ln(e,1/n,i),s!==void 0&&(e=Ln(e,1/s,i)),e}function Nd(e,t=0,n=1,i=.5,s,o=e,r=e){if(Ge.test(t)&&(t=parseFloat(t),t=ee(r.min,r.max,t/100)-r.min),typeof t!="number")return;let a=ee(o.min,o.max,i);e===o&&(a-=t),e.min=Oo(e.min,t,n,a,s),e.max=Oo(e.max,t,n,a,s)}function Ro(e,t,[n,i,s],o,r){Nd(e,t[n],t[i],t[s],t.scale,o,r)}const Vd=["x","scaleX","originX"],Id=["y","scaleY","originY"];function jo(e,t,n,i){Ro(e.x,t,Vd,n?n.x:void 0,i?i.x:void 0),Ro(e.y,t,Id,n?n.y:void 0,i?i.y:void 0)}function Lo(e){return e.translate===0&&e.scale===1}function ol(e){return Lo(e.x)&&Lo(e.y)}function No(e,t){return e.min===t.min&&e.max===t.max}function Bd(e,t){return No(e.x,t.x)&&No(e.y,t.y)}function Vo(e,t){return Math.round(e.min)===Math.round(t.min)&&Math.round(e.max)===Math.round(t.max)}function rl(e,t){return Vo(e.x,t.x)&&Vo(e.y,t.y)}function Io(e){return Se(e.x)/Se(e.y)}function Bo(e,t){return e.translate===t.translate&&e.scale===t.scale&&e.originPoint===t.originPoint}function _e(e){return[e("x"),e("y")]}function $d(e,t,n){let i="";const s=e.x.translate/t.x,o=e.y.translate/t.y,r=n?.z||0;if((s||o||r)&&(i=`translate3d(${s}px, ${o}px, ${r}px) `),(t.x!==1||t.y!==1)&&(i+=`scale(${1/t.x}, ${1/t.y}) `),n){const{transformPerspective:c,rotate:h,pathRotation:f,rotateX:d,rotateY:g,skewX:p,skewY:b}=n;c&&(i=`perspective(${c}px) ${i}`),h&&(i+=`rotate(${h}deg) `),f&&(i+=`rotate(${f}deg) `),d&&(i+=`rotateX(${d}deg) `),g&&(i+=`rotateY(${g}deg) `),p&&(i+=`skewX(${p}deg) `),b&&(i+=`skewY(${b}deg) `)}const a=e.x.scale*t.x,l=e.y.scale*t.y;return(a!==1||l!==1)&&(i+=`scale(${a}, ${l})`),i||"none"}const Fd=Cs.length,$o=e=>typeof e=="string"?parseFloat(e):e,Fo=e=>typeof e=="number"||$.test(e);function _d(e,t,n,i,s,o){s?(e.opacity=ee(0,n.opacity??1,Hd(i)),e.opacityExit=ee(t.opacity??1,0,zd(i))):o&&(e.opacity=ee(t.opacity??1,n.opacity??1,i));for(let r=0;r<Fd;r++){const a=Cs[r];let l=_o(t,a),c=_o(n,a);if(l===void 0&&c===void 0)continue;l||(l=0),c||(c=0),l===0||c===0||Fo(l)===Fo(c)?(e[a]=Math.max(ee($o(l),$o(c),i),0),(Ge.test(c)||Ge.test(l))&&(e[a]+="%")):e[a]=c}(t.rotate||n.rotate)&&(e.rotate=ee(t.rotate||0,n.rotate||0,i))}function _o(e,t){return e[t]!==void 0?e[t]:e.borderRadius}const Hd=al(0,.5,Jr),zd=al(.5,.95,je);function al(e,t,n){return i=>i<e?0:i>t?1:n(Ft(e,t,i))}function Wd(e,t,n){const i=ye(e)?e:St(e);return i.start(ks("",i,t,n)),i.animation}function zt(e,t,n,i={passive:!0}){return e.addEventListener(t,n,i),()=>e.removeEventListener(t,n,i)}const Gd=(e,t)=>e.depth-t.depth;class Ud{constructor(){this.children=[],this.isDirty=!1}add(t){cs(this.children,t),this.isDirty=!0}remove(t){En(this.children,t),this.isDirty=!0}forEach(t){this.isDirty&&this.children.sort(Gd),this.isDirty=!1,this.children.forEach(t)}}function Kd(e,t){const n=ke.now(),i=({timestamp:s})=>{const o=s-n;o>=t&&(Je(i),e(o-t))};return te.setup(i,!0),()=>Je(i)}function kn(e){return ye(e)?e.get():e}class qd{constructor(){this.members=[]}add(t){cs(this.members,t);for(let n=this.members.length-1;n>=0;n--){const i=this.members[n];if(i===t||i===this.lead||i===this.prevLead)continue;const s=i.instance;(!s||s.isConnected===!1)&&!i.snapshot&&(En(this.members,i),i.unmount())}t.scheduleRender()}remove(t){if(En(this.members,t),t===this.prevLead&&(this.prevLead=void 0),t===this.lead){const n=this.members[this.members.length-1];n&&this.promote(n)}}relegate(t){for(let n=this.members.indexOf(t)-1;n>=0;n--){const i=this.members[n];if(i.isPresent!==!1&&i.instance?.isConnected!==!1)return this.promote(i),!0}return!1}promote(t,n){const i=this.lead;if(t!==i&&(this.prevLead=i,this.lead=t,t.show(),i)){i.updateSnapshot(),t.scheduleRender();const{layoutDependency:s}=i.options,{layoutDependency:o}=t.options;(s===void 0||s!==o)&&(t.resumeFrom=i,n&&(i.preserveOpacity=!0),i.snapshot&&(t.snapshot=i.snapshot,t.snapshot.latestValues=i.animationValues||i.latestValues),t.root?.isUpdating&&(t.isLayoutDirty=!0)),t.options.crossfade===!1&&i.hide()}}exitAnimationComplete(){this.members.forEach(t=>{t.options.onExitComplete?.(),t.resumingFrom?.options.onExitComplete?.()})}scheduleRender(){this.members.forEach(t=>t.instance&&t.scheduleRender(!1))}removeLeadSnapshot(){this.lead?.snapshot&&(this.lead.snapshot=void 0)}}const Sn={hasAnimatedSinceResize:!0,hasEverUpdated:!1},ii=["","X","Y","Z"],Qd=1e3;let Yd=0;function si(e,t,n,i){const{latestValues:s}=t;s[e]&&(n[e]=s[e],t.setStaticValue(e,0),i&&(i[e]=0))}function ll(e){if(e.hasCheckedOptimisedAppear=!0,e.root===e)return;const{visualElement:t}=e.options;if(!t)return;const n=Da(t);if(window.MotionHasOptimisedAnimation(n,"transform")){const{layout:s,layoutId:o}=e.options;window.MotionCancelOptimisedAnimation(n,"transform",te,!(s||o))}const{parent:i}=e;i&&!i.hasCheckedOptimisedAppear&&ll(i)}function cl({attachResizeListener:e,defaultParent:t,measureScroll:n,checkIsScrollRoot:i,resetTransform:s}){return class{constructor(r={},a=t?.()){this.id=Yd++,this.animationId=0,this.animationCommitId=0,this.children=new Set,this.options={},this.isTreeAnimating=!1,this.isAnimationBlocked=!1,this.isLayoutDirty=!1,this.isProjectionDirty=!1,this.isSharedProjectionDirty=!1,this.isTransformDirty=!1,this.updateManuallyBlocked=!1,this.updateBlockedByResize=!1,this.isUpdating=!1,this.isSVG=!1,this.needsReset=!1,this.shouldResetTransform=!1,this.hasCheckedOptimisedAppear=!1,this.treeScale={x:1,y:1},this.eventHandlers=new Map,this.hasTreeAnimated=!1,this.layoutVersion=0,this.updateScheduled=!1,this.scheduleUpdate=()=>this.update(),this.projectionUpdateScheduled=!1,this.checkUpdateFailed=()=>{this.isUpdating&&(this.isUpdating=!1,this.clearAllSnapshots())},this.updateProjection=()=>{this.projectionUpdateScheduled=!1,this.nodes.forEach(Jd),this.nodes.forEach(rf),this.nodes.forEach(af),this.nodes.forEach(ef)},this.resolvedRelativeTargetAt=0,this.linkedParentVersion=0,this.hasProjected=!1,this.isVisible=!0,this.animationProgress=0,this.sharedNodes=new Map,this.latestValues=r,this.root=a?a.root||a:this,this.path=a?[...a.path,a]:[],this.parent=a,this.depth=a?a.depth+1:0;for(let l=0;l<this.path.length;l++)this.path[l].shouldResetTransform=!0;this.root===this&&(this.nodes=new Ud)}addEventListener(r,a){return this.eventHandlers.has(r)||this.eventHandlers.set(r,new hs),this.eventHandlers.get(r).add(a)}notifyListeners(r,...a){const l=this.eventHandlers.get(r);l&&l.notify(...a)}hasListeners(r){return this.eventHandlers.has(r)}mount(r){if(this.instance)return;this.isSVG=Es(r)&&!Ju(r),this.instance=r;const{layoutId:a,layout:l,visualElement:c}=this.options;if(c&&!c.current&&c.mount(r),this.root.nodes.add(this),this.parent&&this.parent.children.add(this),this.root.hasTreeAnimated&&(l||a)&&(this.isLayoutDirty=!0),e){let h,f=0;const d=()=>this.root.updateBlockedByResize=!1;te.read(()=>{f=window.innerWidth}),e(r,()=>{const g=window.innerWidth;g!==f&&(f=g,this.root.updateBlockedByResize=!0,h&&h(),h=Kd(d,250),Sn.hasAnimatedSinceResize&&(Sn.hasAnimatedSinceResize=!1,this.nodes.forEach(Wo)))})}a&&this.root.registerSharedNode(a,this),this.options.animate!==!1&&c&&(a||l)&&this.addEventListener("didUpdate",({delta:h,hasLayoutChanged:f,hasRelativeLayoutChanged:d,layout:g})=>{if(this.isTreeAnimationBlocked()){this.target=void 0,this.relativeTarget=void 0;return}const p=this.options.transition||c.getDefaultTransition()||df,{onLayoutAnimationStart:b,onLayoutAnimationComplete:m}=c.getProps(),w=!this.targetLayout||!rl(this.targetLayout,g),k=!f&&d;if(this.options.layoutRoot||this.resumeFrom||k||f&&(w||!this.currentAnimation)){this.resumeFrom&&(this.resumingFrom=this.resumeFrom,this.resumingFrom.resumingFrom=void 0);const v={...vs(p,"layout"),onPlay:b,onComplete:m};(c.shouldReduceMotion||this.options.layoutRoot)&&(v.delay=0,v.type=!1),this.startAnimation(v),this.setAnimationOrigin(h,k,v.path)}else f||Wo(this),this.isLead()&&this.options.onExitComplete&&this.options.onExitComplete();this.targetLayout=g})}unmount(){this.options.layoutId&&this.willUpdate(),this.root.nodes.remove(this);const r=this.getStack();r&&r.remove(this),this.parent&&this.parent.children.delete(this),this.instance=void 0,this.eventHandlers.clear(),Je(this.updateProjection)}blockUpdate(){this.updateManuallyBlocked=!0}unblockUpdate(){this.updateManuallyBlocked=!1}isUpdateBlocked(){return this.updateManuallyBlocked||this.updateBlockedByResize}isTreeAnimationBlocked(){return this.isAnimationBlocked||this.parent&&this.parent.isTreeAnimationBlocked()||!1}startUpdate(){this.isUpdateBlocked()||(this.isUpdating=!0,this.nodes&&this.nodes.forEach(lf),this.animationId++)}getTransformTemplate(){const{visualElement:r}=this.options;return r&&r.getProps().transformTemplate}willUpdate(r=!0){if(this.root.hasTreeAnimated=!0,this.root.isUpdateBlocked()){this.options.onExitComplete&&this.options.onExitComplete();return}if(window.MotionCancelOptimisedAnimation&&!this.hasCheckedOptimisedAppear&&ll(this),!this.root.isUpdating&&this.root.startUpdate(),this.isLayoutDirty)return;this.isLayoutDirty=!0;for(let h=0;h<this.path.length;h++){const f=this.path[h];f.shouldResetTransform=!0,(typeof f.latestValues.x=="string"||typeof f.latestValues.y=="string")&&(f.isLayoutDirty=!0),f.updateScroll("snapshot"),f.options.layoutRoot&&f.willUpdate(!1)}const{layoutId:a,layout:l}=this.options;if(a===void 0&&!l)return;const c=this.getTransformTemplate();this.prevTransformTemplateValue=c?c(this.latestValues,""):void 0,this.updateSnapshot(),r&&this.notifyListeners("willUpdate")}update(){if(this.updateScheduled=!1,this.isUpdateBlocked()){const l=this.updateBlockedByResize;this.unblockUpdate(),this.updateBlockedByResize=!1,this.clearAllSnapshots(),l&&this.nodes.forEach(nf),this.nodes.forEach(Ho);return}if(this.animationId<=this.animationCommitId){this.nodes.forEach(zo);return}this.animationCommitId=this.animationId,this.isUpdating?(this.isUpdating=!1,this.nodes.forEach(sf),this.nodes.forEach(of),this.nodes.forEach(Xd),this.nodes.forEach(Zd)):this.nodes.forEach(zo),this.clearAllSnapshots();const a=ke.now();ge.delta=Ue(0,1e3/60,a-ge.timestamp),ge.timestamp=a,ge.isProcessing=!0,Qn.update.process(ge),Qn.preRender.process(ge),Qn.render.process(ge),ge.isProcessing=!1}didUpdate(){this.updateScheduled||(this.updateScheduled=!0,As.read(this.scheduleUpdate))}clearAllSnapshots(){this.nodes.forEach(tf),this.sharedNodes.forEach(cf)}scheduleUpdateProjection(){this.projectionUpdateScheduled||(this.projectionUpdateScheduled=!0,te.preRender(this.updateProjection,!1,!0))}scheduleCheckAfterUnmount(){te.postRender(()=>{this.isLayoutDirty?this.root.didUpdate():this.root.checkUpdateFailed()})}updateSnapshot(){this.snapshot||!this.instance||(this.snapshot=this.measure(),this.snapshot&&!Se(this.snapshot.measuredBox.x)&&!Se(this.snapshot.measuredBox.y)&&(this.snapshot=void 0))}updateLayout(){if(!this.instance||(this.updateScroll(),!(this.options.alwaysMeasureLayout&&this.isLead())&&!this.isLayoutDirty))return;if(this.resumeFrom&&!this.resumeFrom.instance)for(let l=0;l<this.path.length;l++)this.path[l].updateScroll();const r=this.layout;this.layout=this.measure(!1),this.layoutVersion++,this.layoutCorrected||(this.layoutCorrected=ue()),this.isLayoutDirty=!1,this.projectionDelta=void 0,this.notifyListeners("measure",this.layout.layoutBox);const{visualElement:a}=this.options;a&&a.notify("LayoutMeasure",this.layout.layoutBox,r?r.layoutBox:void 0)}updateScroll(r="measure"){let a=!!(this.options.layoutScroll&&this.instance);if(this.scroll&&this.scroll.animationId===this.root.animationId&&this.scroll.phase===r&&(a=!1),a&&this.instance){const l=i(this.instance);this.scroll={animationId:this.root.animationId,phase:r,isRoot:l,offset:n(this.instance),wasRoot:this.scroll?this.scroll.isRoot:l}}}resetTransform(){if(!s)return;const r=this.isLayoutDirty||this.shouldResetTransform||this.options.alwaysMeasureLayout,a=this.projectionDelta&&!ol(this.projectionDelta),l=this.getTransformTemplate(),c=l?l(this.latestValues,""):void 0,h=c!==this.prevTransformTemplateValue;r&&this.instance&&(a||st(this.latestValues)||h)&&(s(this.instance,c),this.shouldResetTransform=!1,this.scheduleRender())}measure(r=!0){const a=this.measurePageBox();let l=this.removeElementScroll(a);return r&&(l=this.removeTransform(l)),ff(l),{animationId:this.root.animationId,measuredBox:a,layoutBox:l,latestValues:{},source:this.id}}measurePageBox(){const{visualElement:r}=this.options;if(!r)return ue();const a=r.measureViewportBox();if(!(this.scroll?.wasRoot||this.path.some(pf))){const{scroll:c}=this.root;c&&(He(a.x,c.offset.x),He(a.y,c.offset.y))}return a}removeElementScroll(r){const a=ue();if(Be(a,r),this.scroll?.wasRoot)return a;for(let l=0;l<this.path.length;l++){const c=this.path[l],{scroll:h,options:f}=c;c!==this.root&&h&&f.layoutScroll&&(h.wasRoot&&Be(a,r),He(a.x,h.offset.x),He(a.y,h.offset.y))}return a}applyTransform(r,a=!1,l){const c=l||ue();Be(c,r);for(let h=0;h<this.path.length;h++){const f=this.path[h];!a&&f.options.layoutScroll&&f.scroll&&f!==f.root&&(He(c.x,-f.scroll.offset.x),He(c.y,-f.scroll.offset.y)),st(f.latestValues)&&vn(c,f.latestValues,f.layout?.layoutBox)}return st(this.latestValues)&&vn(c,this.latestValues,this.layout?.layoutBox),c}removeTransform(r){const a=ue();Be(a,r);for(let l=0;l<this.path.length;l++){const c=this.path[l];if(!st(c.latestValues))continue;let h;c.instance&&(qi(c.latestValues)&&c.updateSnapshot(),h=ue(),Be(h,c.measurePageBox())),jo(a,c.latestValues,c.snapshot?.layoutBox,h)}return st(this.latestValues)&&jo(a,this.latestValues),a}setTargetDelta(r){this.targetDelta=r,this.root.scheduleUpdateProjection(),this.isProjectionDirty=!0}setOptions(r){this.options={...this.options,...r,crossfade:r.crossfade!==void 0?r.crossfade:!0}}clearMeasurements(){this.scroll=void 0,this.layout=void 0,this.snapshot=void 0,this.prevTransformTemplateValue=void 0,this.targetDelta=void 0,this.target=void 0,this.isLayoutDirty=!1}forceRelativeParentToResolveTarget(){this.relativeParent&&this.relativeParent.resolvedRelativeTargetAt!==ge.timestamp&&this.relativeParent.resolveTargetDelta(!0)}resolveTargetDelta(r=!1){const a=this.getLead();this.isProjectionDirty||(this.isProjectionDirty=a.isProjectionDirty),this.isTransformDirty||(this.isTransformDirty=a.isTransformDirty),this.isSharedProjectionDirty||(this.isSharedProjectionDirty=a.isSharedProjectionDirty);const l=!!this.resumingFrom||this!==a;if(!(r||l&&this.isSharedProjectionDirty||this.isProjectionDirty||this.parent?.isProjectionDirty||this.attemptToResolveRelativeTarget||this.root.updateBlockedByResize))return;const{layout:h,layoutId:f}=this.options;if(!this.layout||!(h||f))return;this.resolvedRelativeTargetAt=ge.timestamp;const d=this.getClosestProjectingParent();d&&this.linkedParentVersion!==d.layoutVersion&&!d.options.layoutRoot&&this.removeRelativeTarget(),!this.targetDelta&&!this.relativeTarget&&(this.options.layoutAnchor!==!1&&d&&d.layout?this.createRelativeTarget(d,this.layout.layoutBox,d.layout.layoutBox):this.removeRelativeTarget()),!(!this.relativeTarget&&!this.targetDelta)&&(this.target||(this.target=ue(),this.targetWithTransforms=ue()),this.relativeTarget&&this.relativeTargetOrigin&&this.relativeParent&&this.relativeParent.target?(this.forceRelativeParentToResolveTarget(),Ld(this.target,this.relativeTarget,this.relativeParent.target,this.options.layoutAnchor||void 0)):this.targetDelta?(this.resumingFrom?this.applyTransform(this.layout.layoutBox,!1,this.target):Be(this.target,this.layout.layoutBox),Ua(this.target,this.targetDelta)):Be(this.target,this.layout.layoutBox),this.attemptToResolveRelativeTarget&&(this.attemptToResolveRelativeTarget=!1,this.options.layoutAnchor!==!1&&d&&!!d.resumingFrom==!!this.resumingFrom&&!d.options.layoutScroll&&d.target&&this.animationProgress!==1?this.createRelativeTarget(d,this.target,d.target):this.relativeParent=this.relativeTarget=void 0))}getClosestProjectingParent(){if(!(!this.parent||qi(this.parent.latestValues)||Ga(this.parent.latestValues)))return this.parent.isProjecting()?this.parent:this.parent.getClosestProjectingParent()}isProjecting(){return!!((this.relativeTarget||this.targetDelta||this.options.layoutRoot)&&this.layout)}createRelativeTarget(r,a,l){this.relativeParent=r,this.linkedParentVersion=r.layoutVersion,this.forceRelativeParentToResolveTarget(),this.relativeTarget=ue(),this.relativeTargetOrigin=ue(),Nn(this.relativeTargetOrigin,a,l,this.options.layoutAnchor||void 0),Be(this.relativeTarget,this.relativeTargetOrigin)}removeRelativeTarget(){this.relativeParent=this.relativeTarget=void 0}calcProjection(){const r=this.getLead(),a=!!this.resumingFrom||this!==r;let l=!0;if((this.isProjectionDirty||this.parent?.isProjectionDirty)&&(l=!1),a&&(this.isSharedProjectionDirty||this.isTransformDirty)&&(l=!1),this.resolvedRelativeTargetAt===ge.timestamp&&(l=!1),l)return;const{layout:c,layoutId:h}=this.options;if(this.isTreeAnimating=!!(this.parent&&this.parent.isTreeAnimating||this.currentAnimation||this.pendingAnimation),this.isTreeAnimating||(this.targetDelta=this.relativeTarget=void 0),!this.layout||!(c||h))return;Be(this.layoutCorrected,this.layout.layoutBox);const f=this.treeScale.x,d=this.treeScale.y;hd(this.layoutCorrected,this.treeScale,this.path,a),r.layout&&!r.target&&(this.treeScale.x!==1||this.treeScale.y!==1)&&(r.target=r.layout.layoutBox,r.targetWithTransforms=ue());const{target:g}=r;if(!g){this.prevProjectionDelta&&(this.createProjectionDeltas(),this.scheduleRender());return}!this.projectionDelta||!this.prevProjectionDelta?this.createProjectionDeltas():(Po(this.prevProjectionDelta.x,this.projectionDelta.x),Po(this.prevProjectionDelta.y,this.projectionDelta.y)),Nt(this.projectionDelta,this.layoutCorrected,g,this.latestValues),(this.treeScale.x!==f||this.treeScale.y!==d||!Bo(this.projectionDelta.x,this.prevProjectionDelta.x)||!Bo(this.projectionDelta.y,this.prevProjectionDelta.y))&&(this.hasProjected=!0,this.scheduleRender(),this.notifyListeners("projectionUpdate",g))}hide(){this.isVisible=!1}show(){this.isVisible=!0}scheduleRender(r=!0){if(this.options.visualElement?.scheduleRender(),r){const a=this.getStack();a&&a.scheduleRender()}this.resumingFrom&&!this.resumingFrom.instance&&(this.resumingFrom=void 0)}createProjectionDeltas(){this.prevProjectionDelta=vt(),this.projectionDelta=vt(),this.projectionDeltaWithTransform=vt()}setAnimationOrigin(r,a=!1,l){const c=this.snapshot,h=c?c.latestValues:{},f={...this.latestValues},d=vt();(!this.relativeParent||!this.relativeParent.options.layoutRoot)&&(this.relativeTarget=this.relativeTargetOrigin=void 0),this.attemptToResolveRelativeTarget=!a;const g=ue(),p=c?c.source:void 0,b=this.layout?this.layout.source:void 0,m=p!==b,w=this.getStack(),k=!w||w.members.length<=1,v=!!(m&&!k&&this.options.crossfade===!0&&!this.path.some(uf));this.animationProgress=0;let x;const C=l?.interpolateProjection(r);this.mixTargetDelta=D=>{const S=D/1e3,P=C?.(S);P?(d.x.translate=P.x,d.x.scale=ee(r.x.scale,1,S),d.x.origin=r.x.origin,d.x.originPoint=r.x.originPoint,d.y.translate=P.y,d.y.scale=ee(r.y.scale,1,S),d.y.origin=r.y.origin,d.y.originPoint=r.y.originPoint):(Go(d.x,r.x,S),Go(d.y,r.y,S)),this.setTargetDelta(d),this.relativeTarget&&this.relativeTargetOrigin&&this.layout&&this.relativeParent&&this.relativeParent.layout&&(Nn(g,this.layout.layoutBox,this.relativeParent.layout.layoutBox,this.options.layoutAnchor||void 0),hf(this.relativeTarget,this.relativeTargetOrigin,g,S),x&&Bd(this.relativeTarget,x)&&(this.isProjectionDirty=!1),x||(x=ue()),Be(x,this.relativeTarget)),m&&(this.animationValues=f,_d(f,h,this.latestValues,S,v,k)),P&&P.rotate!==void 0&&(this.animationValues||(this.animationValues=f),this.animationValues.pathRotation=P.rotate),this.root.scheduleUpdateProjection(),this.scheduleRender(),this.animationProgress=S},this.mixTargetDelta(this.options.layoutRoot?1e3:0)}startAnimation(r){this.notifyListeners("animationStart"),this.currentAnimation?.stop(),this.resumingFrom?.currentAnimation?.stop(),this.pendingAnimation&&(Je(this.pendingAnimation),this.pendingAnimation=void 0),this.pendingAnimation=te.update(()=>{Sn.hasAnimatedSinceResize=!0,this.motionValue||(this.motionValue=St(0)),this.motionValue.jump(0,!1),this.currentAnimation=Wd(this.motionValue,[0,1e3],{...r,velocity:0,isSync:!0,onUpdate:a=>{this.mixTargetDelta(a),r.onUpdate&&r.onUpdate(a)},onComplete:()=>{r.onComplete&&r.onComplete(),this.completeAnimation()}}),this.resumingFrom&&(this.resumingFrom.currentAnimation=this.currentAnimation),this.pendingAnimation=void 0})}completeAnimation(){this.resumingFrom&&(this.resumingFrom.currentAnimation=void 0,this.resumingFrom.preserveOpacity=void 0);const r=this.getStack();r&&r.exitAnimationComplete(),this.resumingFrom=this.currentAnimation=this.animationValues=void 0,this.notifyListeners("animationComplete")}finishAnimation(){this.currentAnimation&&(this.mixTargetDelta&&this.mixTargetDelta(Qd),this.currentAnimation.stop()),this.completeAnimation()}applyTransformsToTarget(){const r=this.getLead();let{targetWithTransforms:a,target:l,layout:c,latestValues:h}=r;if(!(!a||!l||!c)){if(this!==r&&this.layout&&c&&hl(this.options.animationType,this.layout.layoutBox,c.layoutBox)){l=this.target||ue();const f=Se(this.layout.layoutBox.x);l.x.min=r.target.x.min,l.x.max=l.x.min+f;const d=Se(this.layout.layoutBox.y);l.y.min=r.target.y.min,l.y.max=l.y.min+d}Be(a,l),vn(a,h),Nt(this.projectionDeltaWithTransform,this.layoutCorrected,a,h)}}registerSharedNode(r,a){this.sharedNodes.has(r)||this.sharedNodes.set(r,new qd),this.sharedNodes.get(r).add(a);const c=a.options.initialPromotionConfig;a.promote({transition:c?c.transition:void 0,preserveFollowOpacity:c&&c.shouldPreserveFollowOpacity?c.shouldPreserveFollowOpacity(a):void 0})}isLead(){const r=this.getStack();return r?r.lead===this:!0}getLead(){const{layoutId:r}=this.options;return r?this.getStack()?.lead||this:this}getPrevLead(){const{layoutId:r}=this.options;return r?this.getStack()?.prevLead:void 0}getStack(){const{layoutId:r}=this.options;if(r)return this.root.sharedNodes.get(r)}promote({needsReset:r,transition:a,preserveFollowOpacity:l}={}){const c=this.getStack();c&&c.promote(this,l),r&&(this.projectionDelta=void 0,this.needsReset=!0),a&&this.setOptions({transition:a})}relegate(){const r=this.getStack();return r?r.relegate(this):!1}resetSkewAndRotation(){const{visualElement:r}=this.options;if(!r)return;let a=!1;const{latestValues:l}=r;if((l.z||l.rotate||l.rotateX||l.rotateY||l.rotateZ||l.skewX||l.skewY)&&(a=!0),!a)return;const c={};l.z&&si("z",r,c,this.animationValues);for(let h=0;h<ii.length;h++)si(`rotate${ii[h]}`,r,c,this.animationValues),si(`skew${ii[h]}`,r,c,this.animationValues);r.render();for(const h in c)r.setStaticValue(h,c[h]),this.animationValues&&(this.animationValues[h]=c[h]);r.scheduleRender()}applyProjectionStyles(r,a){if(!this.instance||this.isSVG)return;if(!this.isVisible){r.visibility="hidden";return}const l=this.getTransformTemplate();if(this.needsReset){this.needsReset=!1,r.visibility="",r.opacity="",r.pointerEvents=kn(a?.pointerEvents)||"",r.transform=l?l(this.latestValues,""):"none";return}const c=this.getLead();if(!this.projectionDelta||!this.layout||!c.target){this.options.layoutId&&(r.opacity=this.latestValues.opacity!==void 0?this.latestValues.opacity:1,r.pointerEvents=kn(a?.pointerEvents)||""),this.hasProjected&&!st(this.latestValues)&&(r.transform=l?l({},""):"none",this.hasProjected=!1);return}r.visibility="";const h=c.animationValues||c.latestValues;this.applyTransformsToTarget();let f=$d(this.projectionDeltaWithTransform,this.treeScale,h);l&&(f=l(h,f)),r.transform=f;const{x:d,y:g}=this.projectionDelta;r.transformOrigin=`${d.origin*100}% ${g.origin*100}% 0`,c.animationValues?r.opacity=c===this?h.opacity??this.latestValues.opacity??1:this.preserveOpacity?this.latestValues.opacity:h.opacityExit:r.opacity=c===this?h.opacity!==void 0?h.opacity:"":h.opacityExit!==void 0?h.opacityExit:0;for(const p in Yi){if(h[p]===void 0)continue;const{correct:b,applyTo:m,isCSSVariable:w}=Yi[p],k=f==="none"?h[p]:b(h[p],c);if(m){const v=m.length;for(let x=0;x<v;x++)r[m[x]]=k}else w?this.options.visualElement.renderState.vars[p]=k:r[p]=k}this.options.layoutId&&(r.pointerEvents=c===this?kn(a?.pointerEvents)||"":"none")}clearSnapshot(){this.resumeFrom=this.snapshot=void 0}resetTree(){this.root.nodes.forEach(r=>r.currentAnimation?.stop()),this.root.nodes.forEach(Ho),this.root.sharedNodes.clear()}}}function Xd(e){e.updateLayout()}function Zd(e){const t=e.resumeFrom?.snapshot||e.snapshot;if(e.isLead()&&e.layout&&t&&e.hasListeners("didUpdate")){const{layoutBox:n,measuredBox:i}=e.layout,{animationType:s}=e.options,o=t.source!==e.layout.source;if(s==="size")_e(h=>{const f=o?t.measuredBox[h]:t.layoutBox[h],d=Se(f);f.min=n[h].min,f.max=f.min+d});else if(s==="x"||s==="y"){const h=s==="x"?"y":"x";Xi(o?t.measuredBox[h]:t.layoutBox[h],n[h])}else hl(s,t.layoutBox,n)&&_e(h=>{const f=o?t.measuredBox[h]:t.layoutBox[h],d=Se(n[h]);f.max=f.min+d,e.relativeTarget&&!e.currentAnimation&&(e.isProjectionDirty=!0,e.relativeTarget[h].max=e.relativeTarget[h].min+d)});const r=vt();Nt(r,n,t.layoutBox);const a=vt();o?Nt(a,e.applyTransform(i,!0),t.measuredBox):Nt(a,n,t.layoutBox);const l=!ol(r);let c=!1;if(!e.resumeFrom){const h=e.getClosestProjectingParent();if(h&&!h.resumeFrom){const{snapshot:f,layout:d}=h;if(f&&d){const g=e.options.layoutAnchor||void 0,p=ue();Nn(p,t.layoutBox,f.layoutBox,g);const b=ue();Nn(b,n,d.layoutBox,g),rl(p,b)||(c=!0),h.options.layoutRoot&&(e.relativeTarget=b,e.relativeTargetOrigin=p,e.relativeParent=h)}}}e.notifyListeners("didUpdate",{layout:n,snapshot:t,delta:a,layoutDelta:r,hasLayoutChanged:l,hasRelativeLayoutChanged:c})}else if(e.isLead()){const{onExitComplete:n}=e.options;n&&n()}e.options.transition=void 0}function Jd(e){e.parent&&(e.isProjecting()||(e.isProjectionDirty=e.parent.isProjectionDirty),e.isSharedProjectionDirty||(e.isSharedProjectionDirty=!!(e.isProjectionDirty||e.parent.isProjectionDirty||e.parent.isSharedProjectionDirty)),e.isTransformDirty||(e.isTransformDirty=e.parent.isTransformDirty))}function ef(e){e.isProjectionDirty=e.isSharedProjectionDirty=e.isTransformDirty=!1}function tf(e){e.clearSnapshot()}function Ho(e){e.clearMeasurements()}function nf(e){e.isLayoutDirty=!0,e.updateLayout()}function zo(e){e.isLayoutDirty=!1}function sf(e){e.isAnimationBlocked&&e.layout&&!e.isLayoutDirty&&(e.snapshot=e.layout,e.isLayoutDirty=!0)}function of(e){const{visualElement:t}=e.options;t&&t.getProps().onBeforeLayoutMeasure&&t.notify("BeforeLayoutMeasure"),e.resetTransform()}function Wo(e){e.finishAnimation(),e.targetDelta=e.relativeTarget=e.target=void 0,e.isProjectionDirty=!0}function rf(e){e.resolveTargetDelta()}function af(e){e.calcProjection()}function lf(e){e.resetSkewAndRotation()}function cf(e){e.removeLeadSnapshot()}function Go(e,t,n){e.translate=ee(t.translate,0,n),e.scale=ee(t.scale,1,n),e.origin=t.origin,e.originPoint=t.originPoint}function Uo(e,t,n,i){e.min=ee(t.min,n.min,i),e.max=ee(t.max,n.max,i)}function hf(e,t,n,i){Uo(e.x,t.x,n.x,i),Uo(e.y,t.y,n.y,i)}function uf(e){return e.animationValues&&e.animationValues.opacityExit!==void 0}const df={duration:.45,ease:[.4,0,.1,1]},Ko=e=>typeof navigator<"u"&&navigator.userAgent&&navigator.userAgent.toLowerCase().includes(e),qo=Ko("applewebkit/")&&!Ko("chrome/")?Math.round:je;function Qo(e){e.min=qo(e.min),e.max=qo(e.max)}function ff(e){Qo(e.x),Qo(e.y)}function hl(e,t,n){return e==="position"||e==="preserve-aspect"&&!jd(Io(t),Io(n),.2)}function pf(e){return e!==e.root&&e.scroll?.wasRoot}const mf=cl({attachResizeListener:(e,t)=>zt(e,"resize",t),measureScroll:()=>({x:document.documentElement.scrollLeft||document.body?.scrollLeft||0,y:document.documentElement.scrollTop||document.body?.scrollTop||0}),checkIsScrollRoot:()=>!0}),oi={current:void 0},ul=cl({measureScroll:e=>({x:e.scrollLeft,y:e.scrollTop}),defaultParent:()=>{if(!oi.current){const e=new mf({});e.mount(window),e.setOptions({layoutScroll:!0}),oi.current=e}return oi.current},resetTransform:(e,t)=>{e.style.transform=t!==void 0?t:"none"},checkIsScrollRoot:e=>window.getComputedStyle(e).position==="fixed"}),js=y.createContext({transformPagePoint:e=>e,isStatic:!1,reducedMotion:"never"});function Yo(e,t){if(typeof e=="function")return e(t);e!=null&&(e.current=t)}function gf(...e){return t=>{let n=!1;const i=e.map(s=>{const o=Yo(s,t);return!n&&typeof o=="function"&&(n=!0),o});if(n)return()=>{for(let s=0;s<i.length;s++){const o=i[s];typeof o=="function"?o():Yo(e[s],null)}}}}function yf(...e){return y.useCallback(gf(...e),e)}class bf extends y.Component{getSnapshotBeforeUpdate(t){const n=this.props.childRef.current;if(gn(n)&&t.isPresent&&!this.props.isPresent&&this.props.pop!==!1){const i=n.offsetParent,s=gn(i)&&i.offsetWidth||0,o=gn(i)&&i.offsetHeight||0,r=getComputedStyle(n),a=this.props.sizeRef.current;a.height=parseFloat(r.height),a.width=parseFloat(r.width),a.top=n.offsetTop,a.left=n.offsetLeft,a.right=s-a.width-a.left,a.bottom=o-a.height-a.top,a.direction=r.direction}return null}componentDidUpdate(){}render(){return this.props.children}}function wf({children:e,isPresent:t,anchorX:n,anchorY:i,root:s,pop:o}){const r=y.useId(),a=y.useRef(null),l=y.useRef({width:0,height:0,top:0,left:0,right:0,bottom:0,direction:"ltr"}),{nonce:c}=y.useContext(js),h=o!==!1?e.props?.ref??e?.ref:void 0,f=yf(a,h);return y.useInsertionEffect(()=>{const{width:d,height:g,top:p,left:b,right:m,bottom:w,direction:k}=l.current;if(t||o===!1||!a.current||!d||!g)return;const v=k==="rtl",x=n==="left"?v?`right: ${m}`:`left: ${b}`:v?`left: ${b}`:`right: ${m}`,C=i==="bottom"?`bottom: ${w}`:`top: ${p}`;a.current.dataset.motionPopId=r;const D=document.createElement("style");c&&(D.nonce=c);const S=s??document.head;return S.appendChild(D),D.sheet&&D.sheet.insertRule(`
          [data-motion-pop-id="${r}"] {
            position: absolute !important;
            width: ${d}px !important;
            height: ${g}px !important;
            ${x}px !important;
            ${C}px !important;
          }
        `),()=>{a.current?.removeAttribute("data-motion-pop-id"),S.contains(D)&&S.removeChild(D)}},[t]),u.jsx(bf,{isPresent:t,childRef:a,sizeRef:l,pop:o,children:o===!1?e:y.cloneElement(e,{ref:f})})}const xf=({children:e,initial:t,isPresent:n,onExitComplete:i,custom:s,presenceAffectsLayout:o,mode:r,anchorX:a,anchorY:l,root:c})=>{const h=ls(vf),f=y.useId(),d=y.useRef(n),g=y.useRef(i);Pn(()=>{d.current=n,g.current=i});let p=!0,b=y.useMemo(()=>(p=!1,{id:f,initial:t,isPresent:n,custom:s,onExitComplete:m=>{h.set(m,!0);for(const w of h.values())if(!w)return;i&&i()},register:m=>(h.set(m,!1),()=>{h.delete(m),!d.current&&!h.size&&g.current?.()})}),[n,h,i]);return o&&p&&(b={...b}),y.useMemo(()=>{h.forEach((m,w)=>h.set(w,!1))},[n]),y.useEffect(()=>{!n&&!h.size&&i&&i()},[n]),e=u.jsx(wf,{pop:r==="popLayout",isPresent:n,anchorX:a,anchorY:l,root:c,children:e}),u.jsx(Bn.Provider,{value:b,children:e})};function vf(){return new Map}function dl(e=!0){const t=y.useContext(Bn);if(t===null)return[!0,null];const{isPresent:n,onExitComplete:i,register:s}=t,o=y.useId();y.useEffect(()=>{if(e)return s(o)},[e]);const r=y.useCallback(()=>e&&i&&i(o),[o,i,e]);return!n&&i?[!1,r]:[!0]}const sn=e=>e.key||"";function Xo(e){const t=[];return y.Children.forEach(e,n=>{y.isValidElement(n)&&t.push(n)}),t}const kf=({children:e,custom:t,initial:n=!0,onExitComplete:i,presenceAffectsLayout:s=!0,mode:o="sync",propagate:r=!1,anchorX:a="left",anchorY:l="top",root:c})=>{const[h,f]=dl(r),d=y.useMemo(()=>Xo(e),[e]),g=r&&!h?[]:d.map(sn),p=y.useRef(!0),b=y.useRef(d),m=ls(()=>new Map),w=y.useRef(new Set),[k,v]=y.useState(d),[x,C]=y.useState(d);Pn(()=>{r&&!h&&!x.length&&f?.()},[h,r,x.length,f]),Pn(()=>{p.current=!1,b.current=d;for(let P=0;P<x.length;P++){const E=sn(x[P]);g.includes(E)?(m.delete(E),w.current.delete(E)):m.get(E)!==!0&&m.set(E,!1)}},[x,g.length,g.join("-")]);const D=[];if(d!==k){let P=[...d],E=0;for(const L of x){const I=g.indexOf(sn(L));I===-1?(P.splice(E++,0,L),D.push(L)):E=I+D.length+1}return o==="wait"&&D.length&&(P=D),C(Xo(P)),v(d),null}const{forceRender:S}=y.useContext(as);return u.jsx(u.Fragment,{children:x.map(P=>{const E=sn(P),L=r&&!h?!1:d===x||g.includes(E),I=()=>{if(w.current.has(E))return;if(m.has(E))w.current.add(E),m.set(E,!0);else return;let B=!0;m.forEach(O=>{O||(B=!1)}),B&&(S?.(),C(b.current),r&&f?.(),i&&i())};return u.jsx(xf,{isPresent:L,initial:!p.current||n?void 0:!1,custom:t,presenceAffectsLayout:s,mode:o,root:c,onExitComplete:L?void 0:I,anchorX:a,anchorY:l,children:P},E)})})},fl=y.createContext({strict:!1}),Zo={animation:["animate","variants","whileHover","whileTap","exit","whileInView","whileFocus","whileDrag"],exit:["exit"],drag:["drag","dragControls"],focus:["whileFocus"],hover:["whileHover","onHoverStart","onHoverEnd"],tap:["whileTap","onTap","onTapStart","onTapCancel"],pan:["onPan","onPanStart","onPanSessionStart","onPanEnd"],inView:["whileInView","onViewportEnter","onViewportLeave"],layout:["layout","layoutId"]};let Jo=!1;function Sf(){if(Jo)return;const e={};for(const t in Zo)e[t]={isEnabled:n=>Zo[t].some(i=>!!n[i])};Ha(e),Jo=!0}function pl(){return Sf(),rd()}function Tf(e){const t=pl();for(const n in e)t[n]={...t[n],...e[n]};Ha(t)}const zn=y.createContext({});function Cf(e,t){if(Hn(e)){const{initial:n,animate:i}=e;return{initial:n===!1||Ht(n)?n:void 0,animate:Ht(i)?i:void 0}}return e.inherit!==!1?t:{}}function Af(e){const{initial:t,animate:n}=Cf(e,y.useContext(zn));return y.useMemo(()=>({initial:t,animate:n}),[er(t),er(n)])}function er(e){return Array.isArray(e)?e.join(" "):e}const Ls=()=>({style:{},transform:{},transformOrigin:{},vars:{}});function ml(e,t,n){for(const i in t)!ye(t[i])&&!Qa(i,n)&&(e[i]=t[i])}function Pf({transformTemplate:e},t){return y.useMemo(()=>{const n=Ls();return Os(n,t,e),Object.assign({},n.vars,n.style)},[t])}function Ef(e,t){const n=e.style||{},i={};return ml(i,n,e),Object.assign(i,Pf(e,t)),i}function Df(e,t){const n={},i=Ef(e,t);return e.drag&&e.dragListener!==!1&&(n.draggable=!1,i.userSelect=i.WebkitUserSelect=i.WebkitTouchCallout="none",i.touchAction=e.drag===!0?"none":`pan-${e.drag==="x"?"y":"x"}`),e.tabIndex===void 0&&(e.onTap||e.onTapStart||e.whileTap)&&(n.tabIndex=0),n.style=i,n}const gl=()=>({...Ls(),attrs:{}});function Mf(e,t,n,i){const s=y.useMemo(()=>{const o=gl();return Xa(o,t,Ja(i),e.transformTemplate,e.style),{...o.attrs,style:{...o.style}}},[t]);if(e.style){const o={};ml(o,e.style,e),s.style={...o,...s.style}}return s}const Of=new Set(["animate","exit","variants","initial","style","values","variants","transition","transformTemplate","custom","inherit","onBeforeLayoutMeasure","onAnimationStart","onAnimationComplete","onUpdate","onDragStart","onDrag","onDragEnd","onMeasureDragConstraints","onDirectionLock","onDragTransitionEnd","_dragX","_dragY","onHoverStart","onHoverEnd","onViewportEnter","onViewportLeave","globalTapTarget","propagate","ignoreStrict","viewport"]);function Vn(e){return e.startsWith("while")||e.startsWith("drag")&&e!=="draggable"||e.startsWith("layout")||e.startsWith("onTap")||e.startsWith("onPan")||e.startsWith("onLayout")||Of.has(e)}function Rf(e,t){return e.startsWith("on")?!Vn(e):t?.(e)??!Vn(e)}function jf(e,t,n,i){const s={};for(const o in e)o==="values"&&typeof e.values=="object"||ye(e[o])||(Rf(o,i)||n===!0&&Vn(o)||!t&&!Vn(o)||e.draggable&&o.startsWith("onDrag"))&&(s[o]=e[o]);return s}const Lf=["animate","circle","defs","desc","ellipse","g","image","line","filter","marker","mask","metadata","path","pattern","polygon","polyline","rect","stop","switch","symbol","svg","text","tspan","use","view"];function Ns(e){return typeof e!="string"||e.includes("-")?!1:!!(Lf.indexOf(e)>-1||/[A-Z]/u.test(e))}function Nf(e,t,n,{latestValues:i},s,o=!1,r,a){const c=(r??Ns(e)?Mf:Df)(t,i,s,e),h=jf(t,typeof e=="string",o,a),f=e!==y.Fragment?{...h,...c,ref:n}:{},{children:d}=t,g=y.useMemo(()=>ye(d)?d.get():d,[d]);return y.createElement(e,{...f,children:g})}function Vf({scrapeMotionValuesFromProps:e,createRenderState:t},n,i,s){return{latestValues:If(n,i,s,e),renderState:t()}}function If(e,t,n,i){const s={},o=i(e,{});for(const d in o)s[d]=kn(o[d]);let{initial:r,animate:a}=e;const l=Hn(e),c=Fa(e);t&&c&&!l&&e.inherit!==!1&&(r===void 0&&(r=t.initial),a===void 0&&(a=t.animate));let h=n?n.initial===!1:!1;h=h||r===!1;const f=h?a:r;if(f&&typeof f!="boolean"&&!_n(f)){const d=Array.isArray(f)?f:[f];for(let g=0;g<d.length;g++){const p=Ss(e,d[g]);if(p){const{transitionEnd:b,transition:m,...w}=p;for(const k in w){let v=w[k];if(Array.isArray(v)){const x=h?v.length-1:0;v=v[x]}v!==null&&(s[k]=v)}for(const k in b)s[k]=b[k]}}}return s}const yl=e=>(t,n)=>{const i=y.useContext(zn),s=y.useContext(Bn),o=()=>Vf(e,t,i,s);return n?o():ls(o)},Bf=yl({scrapeMotionValuesFromProps:Rs,createRenderState:Ls}),$f=yl({scrapeMotionValuesFromProps:el,createRenderState:gl}),Ff=Symbol.for("motionComponentSymbol");function _f(e,t,n){const i=y.useRef(n);y.useInsertionEffect(()=>{i.current=n});const s=y.useRef(null);return y.useCallback(o=>{o&&e.onMount?.(o),t&&(o?t.mount(o):t.unmount());const r=i.current;if(typeof r=="function")if(o){const a=r(o);typeof a=="function"&&(s.current=a)}else s.current?(s.current(),s.current=null):r(o);else r&&(r.current=o)},[t])}const bl=y.createContext({});function bt(e){return e&&typeof e=="object"&&Object.prototype.hasOwnProperty.call(e,"current")}function Hf(e,t,n,i,s,o){const{visualElement:r}=y.useContext(zn),a=y.useContext(fl),l=y.useContext(Bn),c=y.useContext(js),h=c.reducedMotion,f=c.skipAnimations,d=y.useRef(null),g=y.useRef(!1);i=i||a.renderer,!d.current&&i&&(d.current=i(e,{visualState:t,parent:r,props:n,presenceContext:l,blockInitialAnimation:l?l.initial===!1:!1,reducedMotionConfig:h,skipAnimations:f,isSVG:o}),g.current&&d.current&&(d.current.manuallyAnimateOnMount=!0));const p=d.current,b=y.useContext(bl);p&&!p.projection&&s&&(p.type==="html"||p.type==="svg")&&zf(d.current,n,s,b);const m=y.useRef(!1);y.useInsertionEffect(()=>{p&&m.current&&p.update(n,l)});const w=n[Ea],k=y.useRef(!!w&&typeof window<"u"&&!window.MotionHandoffIsComplete?.(w)&&window.MotionHasOptimisedAnimation?.(w));return Pn(()=>{g.current=!0,p&&(m.current=!0,window.MotionIsMounted=!0,p.updateFeatures(),p.scheduleRenderMicrotask(),k.current&&p.animationState&&p.animationState.animateChanges())}),y.useEffect(()=>{p&&(!k.current&&p.animationState&&p.animationState.animateChanges(),k.current&&(queueMicrotask(()=>{window.MotionHandoffMarkAsComplete?.(w)}),k.current=!1),p.enteringChildren=void 0)}),p}function zf(e,t,n,i){const{layoutId:s,layout:o,drag:r,dragConstraints:a,layoutScroll:l,layoutRoot:c,layoutAnchor:h,layoutCrossfade:f}=t;e.projection=new n(e.latestValues,t["data-framer-portal-id"]?void 0:wl(e.parent)),e.projection.setOptions({layoutId:s,layout:o,alwaysMeasureLayout:!!r||a&&bt(a),visualElement:e,animationType:typeof o=="string"?o:"both",initialPromotionConfig:i,crossfade:f,layoutScroll:l,layoutRoot:c,layoutAnchor:h})}function wl(e){if(e)return e.options.allowProjection!==!1?e.projection:wl(e.parent)}function ri(e,{forwardMotionProps:t=!1,type:n}={},i,s){i&&Tf(i);const o=n?n==="svg":Ns(e),r=o?$f:Bf;function a(c,h){let f;const d={...y.useContext(js),...c,layoutId:Wf(c)},{isStatic:g,isValidProp:p}=d,b=Af(c),m=r(c,g);if(!g&&typeof window<"u"){Gf();const w=Uf(d);f=w.MeasureLayout,b.visualElement=Hf(e,m,d,s,w.ProjectionNode,o)}return u.jsxs(zn.Provider,{value:b,children:[f&&b.visualElement?u.jsx(f,{visualElement:b.visualElement,...d}):null,Nf(e,c,_f(m,b.visualElement,h),m,g,t,o,p)]})}a.displayName=`motion.${typeof e=="string"?e:`create(${e.displayName??e.name??""})`}`;const l=y.forwardRef(a);return l[Ff]=e,l}function Wf({layoutId:e}){const t=y.useContext(as).id;return t&&e!==void 0?t+"-"+e:e}function Gf(e,t){y.useContext(fl).strict}function Uf(e){const t=pl(),{drag:n,layout:i}=t;if(!n&&!i)return{};const s={...n,...i};return{MeasureLayout:n?.isEnabled(e)||i?.isEnabled(e)?s.MeasureLayout:void 0,ProjectionNode:s.ProjectionNode}}function Kf(e,t){if(typeof Proxy>"u")return ri;const n=new Map,i=(o,r)=>ri(o,r,e,t),s=(o,r)=>i(o,r);return new Proxy(s,{get:(o,r)=>r==="create"?i:(n.has(r)||n.set(r,ri(r,void 0,e,t)),n.get(r))})}const qf=(e,t)=>t.isSVG??Ns(e)?new kd(t):new yd(t,{allowProjection:e!==y.Fragment});class Qf extends et{constructor(t){super(t),t.animationState||(t.animationState=Pd(t))}updateAnimationControlsSubscription(){const{animate:t}=this.node.getProps();_n(t)&&(this.unmountControls=t.subscribe(this.node))}mount(){this.updateAnimationControlsSubscription()}update(){const{animate:t}=this.node.getProps(),{animate:n}=this.node.prevProps||{};t!==n&&this.updateAnimationControlsSubscription()}unmount(){this.node.animationState.reset(),this.unmountControls?.()}}let Yf=0;class Xf extends et{constructor(){super(...arguments),this.id=Yf++,this.isExitComplete=!1}update(){if(!this.node.presenceContext)return;const{isPresent:t,onExitComplete:n}=this.node.presenceContext,{isPresent:i}=this.node.prevPresenceContext||{};if(!this.node.animationState||t===i)return;if(t&&i===!1){if(this.isExitComplete){const{initial:o,custom:r}=this.node.getProps();if(typeof o=="string"||typeof o=="object"&&o!==null&&!Array.isArray(o)){const a=lt(this.node,o,r);if(a){const{transition:l,transitionEnd:c,...h}=a;for(const f in h)this.node.getValue(f)?.jump(h[f])}}this.node.animationState.reset(),this.node.animationState.animateChanges()}else this.node.animationState.setActive("exit",!1);this.isExitComplete=!1;return}const s=this.node.animationState.setActive("exit",!t);n&&!t&&s.then(()=>{this.isExitComplete=!0,n(this.id)})}mount(){const{register:t,onExitComplete:n}=this.node.presenceContext||{};n&&n(this.id),t&&(this.unmount=t(this.id))}unmount(){}}const Zf={animation:{Feature:Qf},exit:{Feature:Xf}};function qt(e){return{point:{x:e.pageX,y:e.pageY}}}const Jf=e=>t=>Ps(t)&&e(t,qt(t));function Vt(e,t,n,i){return zt(e,t,Jf(n),i)}const xl=({current:e})=>e?e.ownerDocument.defaultView:null,tr=(e,t)=>Math.abs(e-t);function ep(e,t){const n=tr(e.x,t.x),i=tr(e.y,t.y);return Math.sqrt(n**2+i**2)}const nr=new Set(["auto","scroll"]);class vl{constructor(t,n,{transformPagePoint:i,contextWindow:s=window,dragSnapToOrigin:o=!1,distanceThreshold:r=3,element:a}={}){if(this.startEvent=null,this.lastMoveEvent=null,this.lastMoveEventInfo=null,this.lastRawMoveEventInfo=null,this.handlers={},this.contextWindow=window,this.scrollPositions=new Map,this.removeScrollListeners=null,this.onElementScroll=p=>{this.handleScroll(p.target)},this.onWindowScroll=()=>{this.handleScroll(window)},this.updatePoint=()=>{if(!(this.lastMoveEvent&&this.lastMoveEventInfo))return;this.lastRawMoveEventInfo&&(this.lastMoveEventInfo=on(this.lastRawMoveEventInfo,this.transformPagePoint));const p=ai(this.lastMoveEventInfo,this.history),b=this.startEvent!==null,m=ep(p.offset,{x:0,y:0})>=this.distanceThreshold;if(!b&&!m)return;const{point:w}=p,{timestamp:k}=ge;this.history.push({...w,timestamp:k});const{onStart:v,onMove:x}=this.handlers;b||(v&&v(this.lastMoveEvent,p),this.startEvent=this.lastMoveEvent),x&&x(this.lastMoveEvent,p)},this.handlePointerMove=(p,b)=>{this.lastMoveEvent=p,this.lastRawMoveEventInfo=b,this.lastMoveEventInfo=on(b,this.transformPagePoint),te.update(this.updatePoint,!0)},this.handlePointerUp=(p,b)=>{this.end();const{onEnd:m,onSessionEnd:w,resumeAnimation:k}=this.handlers;if((this.dragSnapToOrigin||!this.startEvent)&&k&&k(),!(this.lastMoveEvent&&this.lastMoveEventInfo))return;const v=ai(p.type==="pointercancel"?this.lastMoveEventInfo:on(b,this.transformPagePoint),this.history);this.startEvent&&m&&m(p,v),w&&w(p,v)},!Ps(t))return;this.dragSnapToOrigin=o,this.handlers=n,this.transformPagePoint=i,this.distanceThreshold=r,this.contextWindow=s||window;const l=qt(t),c=on(l,this.transformPagePoint),{point:h}=c,{timestamp:f}=ge;this.history=[{...h,timestamp:f}];const{onSessionStart:d}=n;d&&d(t,ai(c,this.history));const g={passive:!0,capture:!0};this.removeListeners=Gt(Vt(this.contextWindow,"pointermove",this.handlePointerMove,g),Vt(this.contextWindow,"pointerup",this.handlePointerUp,g),Vt(this.contextWindow,"pointercancel",this.handlePointerUp,g)),a&&this.startScrollTracking(a)}startScrollTracking(t){let n=t.parentElement;for(;n;){const i=getComputedStyle(n);(nr.has(i.overflowX)||nr.has(i.overflowY))&&this.scrollPositions.set(n,{x:n.scrollLeft,y:n.scrollTop}),n=n.parentElement}this.scrollPositions.set(window,{x:window.scrollX,y:window.scrollY}),window.addEventListener("scroll",this.onElementScroll,{capture:!0}),window.addEventListener("scroll",this.onWindowScroll),this.removeScrollListeners=()=>{window.removeEventListener("scroll",this.onElementScroll,{capture:!0}),window.removeEventListener("scroll",this.onWindowScroll)}}handleScroll(t){const n=this.scrollPositions.get(t);if(!n)return;const i=t===window,s=i?{x:window.scrollX,y:window.scrollY}:{x:t.scrollLeft,y:t.scrollTop},o={x:s.x-n.x,y:s.y-n.y};o.x===0&&o.y===0||(i?this.lastMoveEventInfo&&(this.lastMoveEventInfo.point.x+=o.x,this.lastMoveEventInfo.point.y+=o.y):this.history.length>0&&(this.history[0].x-=o.x,this.history[0].y-=o.y),this.scrollPositions.set(t,s),te.update(this.updatePoint,!0))}updateHandlers(t){this.handlers=t}end(){this.removeListeners&&this.removeListeners(),this.removeScrollListeners&&this.removeScrollListeners(),this.scrollPositions.clear(),Je(this.updatePoint)}}function on(e,t){return t?{point:t(e.point)}:e}function ir(e,t){return{x:e.x-t.x,y:e.y-t.y}}function ai({point:e},t){return{point:e,delta:ir(e,kl(t)),offset:ir(e,tp(t)),velocity:np(t,.1)}}function tp(e){return e[0]}function kl(e){return e[e.length-1]}function np(e,t){if(e.length<2)return{x:0,y:0};let n=e.length-1,i=null;const s=kl(e);for(;n>=0&&(i=e[n],!(s.timestamp-i.timestamp>Le(t)));)n--;if(!i)return{x:0,y:0};i===e[0]&&e.length>2&&s.timestamp-i.timestamp>Le(t)*2&&(i=e[1]);const o=Re(s.timestamp-i.timestamp);if(o===0)return{x:0,y:0};const r={x:(s.x-i.x)/o,y:(s.y-i.y)/o};return r.x===1/0&&(r.x=0),r.y===1/0&&(r.y=0),r}function ip(e,{min:t,max:n},i){return t!==void 0&&e<t?e=i?ee(t,e,i.min):Math.max(e,t):n!==void 0&&e>n&&(e=i?ee(n,e,i.max):Math.min(e,n)),e}function sr(e,t,n){return{min:t!==void 0?e.min+t:void 0,max:n!==void 0?e.max+n-(e.max-e.min):void 0}}function sp(e,{top:t,left:n,bottom:i,right:s}){return{x:sr(e.x,n,s),y:sr(e.y,t,i)}}function or(e,t){let n=t.min-e.min,i=t.max-e.max;return t.max-t.min<e.max-e.min&&([n,i]=[i,n]),{min:n,max:i}}function op(e,t){return{x:or(e.x,t.x),y:or(e.y,t.y)}}function rp(e,t){let n=.5;const i=Se(e),s=Se(t);return s>i?n=Ft(t.min,t.max-i,e.min):i>s&&(n=Ft(e.min,e.max-s,t.min)),Ue(0,1,n)}function ap(e,t){const n={};return t.min!==void 0&&(n.min=t.min-e.min),t.max!==void 0&&(n.max=t.max-e.min),n}const Zi=.35;function lp(e=Zi){return e===!1?e=0:e===!0&&(e=Zi),{x:rr(e,"left","right"),y:rr(e,"top","bottom")}}function rr(e,t,n){return{min:ar(e,t),max:ar(e,n)}}function ar(e,t){return typeof e=="number"?e:e[t]||0}const cp=new WeakMap;class hp{constructor(t){this.openDragLock=null,this.isDragging=!1,this.currentDirection=null,this.originPoint={x:0,y:0},this.constraints=!1,this.hasMutatedConstraints=!1,this.elastic=ue(),this.latestPointerEvent=null,this.latestPanInfo=null,this.visualElement=t}start(t,{snapToCursor:n=!1,distanceThreshold:i}={}){const{presenceContext:s}=this.visualElement;if(s&&s.isPresent===!1)return;const o=f=>{n&&this.snapToCursor(qt(f).point),this.stopAnimation()},r=(f,d)=>{const{drag:g,dragPropagation:p,onDragStart:b}=this.getProps();if(g&&!p&&(this.openDragLock&&this.openDragLock(),this.openDragLock=Vu(g),!this.openDragLock))return;this.latestPointerEvent=f,this.latestPanInfo=d,this.isDragging=!0,this.currentDirection=null,this.resolveConstraints(),this.visualElement.projection&&(this.visualElement.projection.isAnimationBlocked=!0,this.visualElement.projection.target=void 0),_e(w=>{let k=this.getAxisMotionValue(w).get()||0;if(Ge.test(k)){const{projection:v}=this.visualElement;if(v&&v.layout){const x=v.layout.layoutBox[w];x&&(k=Se(x)*(parseFloat(k)/100))}}this.originPoint[w]=k}),b&&te.update(()=>b(f,d),!1,!0),Hi(this.visualElement,"transform");const{animationState:m}=this.visualElement;m&&m.setActive("whileDrag",!0)},a=(f,d)=>{this.latestPointerEvent=f,this.latestPanInfo=d;const{dragPropagation:g,dragDirectionLock:p,onDirectionLock:b,onDrag:m}=this.getProps();if(!g&&!this.openDragLock)return;const{offset:w}=d;if(p&&this.currentDirection===null){this.currentDirection=dp(w),this.currentDirection!==null&&b&&b(this.currentDirection);return}this.updateAxis("x",d.point,w),this.updateAxis("y",d.point,w),this.visualElement.render(),m&&te.update(()=>m(f,d),!1,!0)},l=(f,d)=>{this.latestPointerEvent=f,this.latestPanInfo=d,this.stop(f,d),this.latestPointerEvent=null,this.latestPanInfo=null},c=()=>{const{dragSnapToOrigin:f}=this.getProps();(f||this.constraints)&&this.startAnimation({x:0,y:0})},{dragSnapToOrigin:h}=this.getProps();this.panSession=new vl(t,{onSessionStart:o,onStart:r,onMove:a,onSessionEnd:l,resumeAnimation:c},{transformPagePoint:this.visualElement.getTransformPagePoint(),dragSnapToOrigin:h,distanceThreshold:i,contextWindow:xl(this.visualElement),element:this.visualElement.current})}stop(t,n){const i=t||this.latestPointerEvent,s=n||this.latestPanInfo,o=this.isDragging;if(this.cancel(),!o||!s||!i)return;const{velocity:r}=s;this.startAnimation(r);const{onDragEnd:a}=this.getProps();a&&te.postRender(()=>a(i,s))}cancel(){this.isDragging=!1;const{projection:t,animationState:n}=this.visualElement;t&&(t.isAnimationBlocked=!1),this.endPanSession();const{dragPropagation:i}=this.getProps();!i&&this.openDragLock&&(this.openDragLock(),this.openDragLock=null),n&&n.setActive("whileDrag",!1)}endPanSession(){this.panSession&&this.panSession.end(),this.panSession=void 0}updateAxis(t,n,i){const{drag:s}=this.getProps();if(!i||!rn(t,s,this.currentDirection))return;const o=this.getAxisMotionValue(t);let r=this.originPoint[t]+i[t];this.constraints&&this.constraints[t]&&(r=ip(r,this.constraints[t],this.elastic[t])),o.set(r)}resolveConstraints(){const{dragConstraints:t,dragElastic:n}=this.getProps(),i=this.visualElement.projection&&!this.visualElement.projection.layout?this.visualElement.projection.measure(!1):this.visualElement.projection?.layout,s=this.constraints;t&&bt(t)?this.constraints||(this.constraints=this.resolveRefConstraints()):t&&i?this.constraints=sp(i.layoutBox,t):this.constraints=!1,this.elastic=lp(n),s!==this.constraints&&!bt(t)&&i&&this.constraints&&!this.hasMutatedConstraints&&_e(o=>{this.constraints!==!1&&this.getAxisMotionValue(o)&&(this.constraints[o]=ap(i.layoutBox[o],this.constraints[o]))})}resolveRefConstraints(){const{dragConstraints:t,onMeasureDragConstraints:n}=this.getProps();if(!t||!bt(t))return!1;const i=t.current,{projection:s}=this.visualElement;if(!s||!s.layout)return!1;s.root&&(s.root.scroll=void 0,s.root.updateScroll());const o=ud(i,s.root,this.visualElement.getTransformPagePoint());let r=op(s.layout.layoutBox,o);if(n){const a=n(ld(r));this.hasMutatedConstraints=!!a,a&&(r=Wa(a))}return r}startAnimation(t){const{drag:n,dragMomentum:i,dragElastic:s,dragTransition:o,dragSnapToOrigin:r,onDragTransitionEnd:a}=this.getProps(),l=this.constraints||{},c=_e(h=>{if(!rn(h,n,this.currentDirection))return;let f=l&&l[h]||{};(r===!0||r===h)&&(f={min:0,max:0});const d=s?200:1e6,g=s?40:1e7,p={type:"inertia",velocity:i?t[h]:0,bounceStiffness:d,bounceDamping:g,timeConstant:750,restDelta:1,restSpeed:10,...o,...f};return this.startAxisValueAnimation(h,p)});return Promise.all(c).then(a)}startAxisValueAnimation(t,n){const i=this.getAxisMotionValue(t);return Hi(this.visualElement,t),i.start(ks(t,i,0,n,this.visualElement,!1))}stopAnimation(){_e(t=>this.getAxisMotionValue(t).stop())}getAxisMotionValue(t){const n=`_drag${t.toUpperCase()}`,s=this.visualElement.getProps()[n];return s||this.visualElement.getValue(t,this.visualElement.latestValues[t]??0)}snapToCursor(t){_e(n=>{const{drag:i}=this.getProps();if(!rn(n,i,this.currentDirection))return;const{projection:s}=this.visualElement,o=this.getAxisMotionValue(n);if(s&&s.layout){const{min:r,max:a}=s.layout.layoutBox[n],l=o.get()||0;o.set(t[n]-ee(r,a,.5)+l)}})}scalePositionWithinConstraints(){if(!this.visualElement.current)return;const{drag:t,dragConstraints:n}=this.getProps(),{projection:i}=this.visualElement;if(!bt(n)||!i||!this.constraints)return;this.stopAnimation();const s={x:0,y:0};_e(r=>{const a=this.getAxisMotionValue(r);if(a&&this.constraints!==!1){const l=a.get();s[r]=rp({min:l,max:l},this.constraints[r])}});const{transformTemplate:o}=this.visualElement.getProps();this.visualElement.current.style.transform=o?o({},""):"none",i.root&&i.root.updateScroll(),i.updateLayout(),this.constraints=!1,this.resolveConstraints(),_e(r=>{if(!rn(r,t,null))return;const a=this.getAxisMotionValue(r),{min:l,max:c}=this.constraints[r];a.set(ee(l,c,s[r]))}),this.visualElement.render()}addListeners(){if(!this.visualElement.current)return;cp.set(this.visualElement,this);const t=this.visualElement.current,n=Vt(t,"pointerdown",c=>{const{drag:h,dragListener:f=!0}=this.getProps(),d=c.target,g=d!==t&&Hu(d);h&&f&&!g&&this.start(c)});let i;const s=()=>{const{dragConstraints:c}=this.getProps();bt(c)&&c.current&&(this.constraints=this.resolveRefConstraints(),i||(i=up(t,c.current,()=>this.scalePositionWithinConstraints())))},{projection:o}=this.visualElement,r=o.addEventListener("measure",s);o&&!o.layout&&(o.root&&o.root.updateScroll(),o.updateLayout()),te.read(s);const a=zt(window,"resize",()=>this.scalePositionWithinConstraints()),l=o.addEventListener("didUpdate",(({delta:c,hasLayoutChanged:h})=>{this.isDragging&&h&&(_e(f=>{const d=this.getAxisMotionValue(f);d&&(this.originPoint[f]+=c[f].translate,d.set(d.get()+c[f].translate))}),this.visualElement.render())}));return()=>{a(),n(),r(),l&&l(),i&&i()}}getProps(){const t=this.visualElement.getProps(),{drag:n=!1,dragDirectionLock:i=!1,dragPropagation:s=!1,dragConstraints:o=!1,dragElastic:r=Zi,dragMomentum:a=!0}=t;return{...t,drag:n,dragDirectionLock:i,dragPropagation:s,dragConstraints:o,dragElastic:r,dragMomentum:a}}}function lr(e){let t=!0;return()=>{if(t){t=!1;return}e()}}function up(e,t,n){const i=mo(e,lr(n)),s=mo(t,lr(n));return()=>{i(),s()}}function rn(e,t,n){return(t===!0||t===e)&&(n===null||n===e)}function dp(e,t=10){let n=null;return Math.abs(e.y)>t?n="y":Math.abs(e.x)>t&&(n="x"),n}class fp extends et{constructor(t){super(t),this.removeGroupControls=je,this.removeListeners=je,this.controls=new hp(t)}mount(){const{dragControls:t}=this.node.getProps();t&&(this.removeGroupControls=t.subscribe(this.controls)),this.removeListeners=this.controls.addListeners()||je}update(){const{dragControls:t}=this.node.getProps(),{dragControls:n}=this.node.prevProps||{};t!==n&&(this.removeGroupControls(),t&&(this.removeGroupControls=t.subscribe(this.controls)))}unmount(){this.removeGroupControls(),this.removeListeners(),this.controls.isDragging||this.controls.endPanSession()}}const li=e=>(t,n)=>{e&&te.update(()=>e(t,n),!1,!0)};class pp extends et{constructor(){super(...arguments),this.removePointerDownListener=je}onPointerDown(t){this.session=new vl(t,this.createPanHandlers(),{transformPagePoint:this.node.getTransformPagePoint(),contextWindow:xl(this.node)})}createPanHandlers(){const{onPanSessionStart:t,onPanStart:n,onPan:i,onPanEnd:s}=this.node.getProps();return{onSessionStart:li(t),onStart:li(n),onMove:li(i),onEnd:(o,r)=>{delete this.session,s&&te.postRender(()=>s(o,r))}}}mount(){this.removePointerDownListener=Vt(this.node.current,"pointerdown",t=>this.onPointerDown(t))}update(){this.session&&this.session.updateHandlers(this.createPanHandlers())}unmount(){this.removePointerDownListener(),this.session&&this.session.end()}}let ci=!1;class mp extends y.Component{componentDidMount(){const{visualElement:t,layoutGroup:n,switchLayoutGroup:i,layoutId:s}=this.props,{projection:o}=t;o&&(n.group&&n.group.add(o),i&&i.register&&s&&i.register(o),ci&&o.root.didUpdate(),o.addEventListener("animationComplete",()=>{this.safeToRemove()}),o.setOptions({...o.options,layoutDependency:this.props.layoutDependency,onExitComplete:()=>this.safeToRemove()})),Sn.hasEverUpdated=!0}getSnapshotBeforeUpdate(t){const{layoutDependency:n,visualElement:i,drag:s,isPresent:o}=this.props,{projection:r}=i;return r&&(r.isPresent=o,t.layoutDependency!==n&&r.setOptions({...r.options,layoutDependency:n}),ci=!0,s||t.layoutDependency!==n||n===void 0||t.isPresent!==o?r.willUpdate():this.safeToRemove(),t.isPresent!==o&&(o?r.promote():r.relegate()||te.postRender(()=>{const a=r.getStack();(!a||!a.members.length)&&this.safeToRemove()}))),null}componentDidUpdate(){const{visualElement:t,layoutAnchor:n}=this.props,{projection:i}=t;i&&(i.options.layoutAnchor=n,i.root.didUpdate(),As.postRender(()=>{!i.currentAnimation&&i.isLead()&&this.safeToRemove()}))}componentWillUnmount(){const{visualElement:t,layoutGroup:n,switchLayoutGroup:i}=this.props,{projection:s}=t;ci=!0,s&&(s.scheduleCheckAfterUnmount(),n&&n.group&&n.group.remove(s),i&&i.deregister&&i.deregister(s))}safeToRemove(){const{safeToRemove:t}=this.props;t&&t()}render(){return null}}function Sl(e){const[t,n]=dl(),i=y.useContext(as);return u.jsx(mp,{...e,layoutGroup:i,switchLayoutGroup:y.useContext(bl),isPresent:t,safeToRemove:n})}const gp={pan:{Feature:pp},drag:{Feature:fp,ProjectionNode:ul,MeasureLayout:Sl}};function cr(e,t,n){const{props:i}=e;e.animationState&&i.whileHover&&e.animationState.setActive("whileHover",n==="Start");const s="onHover"+n,o=i[s];o&&te.postRender(()=>o(t,qt(t)))}class yp extends et{mount(){const{current:t}=this.node;t&&(this.unmount=Bu(t,(n,i)=>(cr(this.node,i,"Start"),s=>cr(this.node,s,"End"))))}unmount(){}}class bp extends et{constructor(){super(...arguments),this.isActive=!1}onFocus(){let t=!1;try{t=this.node.current.matches(":focus-visible")}catch{t=!0}!t||!this.node.animationState||(this.node.animationState.setActive("whileFocus",!0),this.isActive=!0)}onBlur(){!this.isActive||!this.node.animationState||(this.node.animationState.setActive("whileFocus",!1),this.isActive=!1)}mount(){this.unmount=Gt(zt(this.node.current,"focus",()=>this.onFocus()),zt(this.node.current,"blur",()=>this.onBlur()))}unmount(){}}function hr(e,t,n){const{props:i}=e;if(e.current instanceof HTMLButtonElement&&e.current.disabled)return;e.animationState&&i.whileTap&&e.animationState.setActive("whileTap",n==="Start");const s="onTap"+(n==="End"?"":n),o=i[s];o&&te.postRender(()=>o(t,qt(t)))}class wp extends et{mount(){const{current:t}=this.node;if(!t)return;const{globalTapTarget:n,propagate:i}=this.node.props;this.unmount=Wu(t,(s,o)=>(hr(this.node,o,"Start"),(r,{success:a})=>hr(this.node,r,a?"End":"Cancel")),{useGlobalTarget:n,stopPropagation:i?.tap===!1})}unmount(){}}const Ji=new WeakMap,hi=new WeakMap,xp=e=>{const t=Ji.get(e.target);t&&t(e)},vp=e=>{e.forEach(xp)};function kp({root:e,...t}){const n=e||document;hi.has(n)||hi.set(n,{});const i=hi.get(n),s=JSON.stringify(t);return i[s]||(i[s]=new IntersectionObserver(vp,{root:e,...t})),i[s]}function Sp(e,t,n){const i=kp(t);return Ji.set(e,n),i.observe(e),()=>{Ji.delete(e),i.unobserve(e)}}const Tp={some:0,all:1};class Cp extends et{constructor(){super(...arguments),this.hasEnteredView=!1,this.isInView=!1}startObserver(){this.stopObserver?.();const{viewport:t={}}=this.node.getProps(),{root:n,margin:i,amount:s="some",once:o}=t,r={root:n?n.current:void 0,rootMargin:i,threshold:typeof s=="number"?s:Tp[s]},a=l=>{const{isIntersecting:c}=l;if(this.isInView===c||(this.isInView=c,o&&!c&&this.hasEnteredView))return;c&&(this.hasEnteredView=!0),this.node.animationState&&this.node.animationState.setActive("whileInView",c);const{onViewportEnter:h,onViewportLeave:f}=this.node.getProps(),d=c?h:f;d&&d(l)};this.stopObserver=Sp(this.node.current,r,a)}mount(){this.startObserver()}update(){if(typeof IntersectionObserver>"u")return;const{props:t,prevProps:n}=this.node;["amount","margin","root"].some(Ap(t,n))&&this.startObserver()}unmount(){this.stopObserver?.(),this.hasEnteredView=!1,this.isInView=!1}}function Ap({viewport:e={}},{viewport:t={}}={}){return n=>e[n]!==t[n]}const Pp={inView:{Feature:Cp},tap:{Feature:wp},focus:{Feature:bp},hover:{Feature:yp}},Ep={layout:{ProjectionNode:ul,MeasureLayout:Sl}},Dp={...Zf,...Pp,...gp,...Ep},Mp=Kf(Dp,qf),Op=Mp,ne={head:{len:18,span:12},secondaryScale:.85,gap:0,stroke:{own:1.4,ownHover:2.6,refFactor:.75},dash:"5 4",kinds:{"own-fwd":{color:Te.ownFwd,heads:"end",headDirection:"forward",dashed:!1,secondary:!1,label:"A owns B"},"own-bkwd":{color:Te.ownBkwd,heads:"end",headDirection:"backward",dashed:!1,secondary:!1,label:"A belongs to B"},association:{color:Te.association,heads:"both",headDirection:"forward",dashed:!0,secondary:!0,label:"A and B are associated"}}};function Rp(e){return e==="forward"?"M0,0 L10,3.5 L0,7 Z":"M10,0 L0,3.5 L10,7 Z"}function Tn(e,t=1){const{len:n,span:i}=ne.head;return{viewBox:"0 0 10 7",refX:0,refY:3.5,markerWidth:n*t,markerHeight:i*t,markerUnits:"userSpaceOnUse",orient:"auto-start-reverse",d:Rp(e)}}function ur(e){const t=ne.kinds[e].secondary?ne.secondaryScale:1;return ne.head.len*t+ne.gap}function an(e){throw new Error('Could not dynamically require "'+e+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var ui={exports:{}},dr;function jp(){return dr||(dr=1,(function(e,t){(function(n){e.exports=n()})(function(){return(function(){function n(i,s,o){function r(c,h){if(!s[c]){if(!i[c]){var f=typeof an=="function"&&an;if(!h&&f)return f(c,!0);if(a)return a(c,!0);var d=new Error("Cannot find module '"+c+"'");throw d.code="MODULE_NOT_FOUND",d}var g=s[c]={exports:{}};i[c][0].call(g.exports,function(p){var b=i[c][1][p];return r(b||p)},g,g.exports,n,i,s,o)}return s[c].exports}for(var a=typeof an=="function"&&an,l=0;l<o.length;l++)r(o[l]);return r}return n})()({1:[function(n,i,s){Object.defineProperty(s,"__esModule",{value:!0}),s.default=void 0;function o(d){"@babel/helpers - typeof";return o=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(g){return typeof g}:function(g){return g&&typeof Symbol=="function"&&g.constructor===Symbol&&g!==Symbol.prototype?"symbol":typeof g},o(d)}function r(d,g){if(!(d instanceof g))throw new TypeError("Cannot call a class as a function")}function a(d,g){for(var p=0;p<g.length;p++){var b=g[p];b.enumerable=b.enumerable||!1,b.configurable=!0,"value"in b&&(b.writable=!0),Object.defineProperty(d,c(b.key),b)}}function l(d,g,p){return g&&a(d.prototype,g),Object.defineProperty(d,"prototype",{writable:!1}),d}function c(d){var g=h(d,"string");return o(g)=="symbol"?g:g+""}function h(d,g){if(o(d)!="object"||!d)return d;var p=d[Symbol.toPrimitive];if(p!==void 0){var b=p.call(d,g);if(o(b)!="object")return b;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(d)}s.default=(function(){function d(){var g=this,p=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},b=p.defaultLayoutOptions,m=b===void 0?{}:b,w=p.algorithms,k=w===void 0?["layered","stress","mrtree","radial","force","disco","sporeOverlap","sporeCompaction","rectpacking"]:w,v=p.workerFactory,x=p.workerUrl;if(r(this,d),this.defaultLayoutOptions=m,this.initialized=!1,typeof x>"u"&&typeof v>"u")throw new Error("Cannot construct an ELK without both 'workerUrl' and 'workerFactory'.");var C=v;typeof x<"u"&&typeof v>"u"&&(C=function(P){return new Worker(P)});var D=C(x);if(typeof D.postMessage!="function")throw new TypeError("Created worker does not provide the required 'postMessage' function.");this.worker=new f(D),this.worker.postMessage({cmd:"register",algorithms:k}).then(function(S){return g.initialized=!0}).catch(console.err)}return l(d,[{key:"layout",value:function(p){var b=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},m=b.layoutOptions,w=m===void 0?this.defaultLayoutOptions:m,k=b.logging,v=k===void 0?!1:k,x=b.measureExecutionTime,C=x===void 0?!1:x;return p?this.worker.postMessage({cmd:"layout",graph:p,layoutOptions:w,options:{logging:v,measureExecutionTime:C}}):Promise.reject(new Error("Missing mandatory parameter 'graph'."))}},{key:"knownLayoutAlgorithms",value:function(){return this.worker.postMessage({cmd:"algorithms"})}},{key:"knownLayoutOptions",value:function(){return this.worker.postMessage({cmd:"options"})}},{key:"knownLayoutCategories",value:function(){return this.worker.postMessage({cmd:"categories"})}},{key:"terminateWorker",value:function(){this.worker&&this.worker.terminate()}}])})();var f=(function(){function d(g){var p=this;if(r(this,d),g===void 0)throw new Error("Missing mandatory parameter 'worker'.");this.resolvers={},this.worker=g,this.worker.onmessage=function(b){setTimeout(function(){p.receive(p,b)},0)}}return l(d,[{key:"postMessage",value:function(p){var b=this.id||0;this.id=b+1,p.id=b;var m=this;return new Promise(function(w,k){m.resolvers[b]=function(v,x){v?(m.convertGwtStyleError(v),k(v)):w(x)},m.worker.postMessage(p)})}},{key:"receive",value:function(p,b){var m=b.data,w=p.resolvers[m.id];w&&(delete p.resolvers[m.id],m.error?w(m.error):w(null,m.data))}},{key:"terminate",value:function(){this.worker&&this.worker.terminate()}},{key:"convertGwtStyleError",value:function(p){if(p){var b=p.__java$exception;b&&(b.cause&&b.cause.backingJsObject&&(p.cause=b.cause.backingJsObject,this.convertGwtStyleError(p.cause)),delete p.__java$exception)}}}])})()},{}],2:[function(n,i,s){var o=n("./elk-api.js").default;Object.defineProperty(i.exports,"__esModule",{value:!0}),i.exports=o,o.default=o},{"./elk-api.js":1}]},{},[2])(2)})})(ui)),ui.exports}var Lp=jp();const Np=rc(Lp),Vp="/dynamic-model-var-docs/assets/elk-worker.min-r_yRvuMO.js";class Ip{elk=null;ensure(){return this.elk||(this.elk=new Np({workerUrl:Vp})),this.elk}async layout(t,n={}){const{direction:i="DOWN",nodeSpacing:s=32,layerSpacing:o=56,usePartitions:r=!1,extraLayoutOptions:a={}}=n,l={id:"root",layoutOptions:{"elk.algorithm":"layered","elk.direction":i,"elk.spacing.nodeNode":String(s),"elk.layered.spacing.nodeNodeBetweenLayers":String(o),"elk.edgeRouting":"ORTHOGONAL","elk.layered.considerModelOrder.strategy":"NODES_AND_EDGES",...r?{"elk.partitioning.activate":"true"}:{},...a},children:t.nodes.map(m=>({id:m.id,width:m.width,height:m.height,...m.ports?.length?{ports:m.ports.map(w=>({id:w.id,x:w.x,y:w.y,width:0,height:0}))}:{},...r&&m.partition!==void 0||m.ports?.length?{layoutOptions:{...r&&m.partition!==void 0?{"elk.partitioning.partition":String(m.partition)}:{},...m.ports?.length?{"elk.portConstraints":"FIXED_POS"}:{}}}:{}})),edges:t.edges.filter(m=>m.source!==m.target).map(m=>({id:m.id,sources:[m.sourcePort??m.source],targets:[m.targetPort??m.target]}))},c=new Map(t.edges.map(m=>[m.id,m]));this.elk;const h=performance.now(),f=await this.ensure().layout(l);performance.now()-h,t.nodes.length,t.edges.length;const d=(f.children??[]).map(m=>({id:m.id,x:m.x??0,y:m.y??0,width:m.width??0,height:m.height??0})),g=(f.edges??[]).map(m=>{const w=c.get(m.id);if(!w)throw new Error(`ELK returned unknown edge id: ${m.id}`);return{id:m.id,source:w.source,target:w.target,sections:m.sections}}),p=Math.max(0,...d.map(m=>m.x+m.width)),b=Math.max(0,...d.map(m=>m.y+m.height));return{nodes:d,edges:g,width:p,height:b}}cancel(){this.elk&&(this.elk.terminateWorker(),this.elk=null)}dispose(){this.cancel()}}function ln(e){if(!e?.length)return[];const t=e[0];return[t.startPoint,...t.bendPoints??[],t.endPoint]}function fr(e,t,n){const i=t.x-e.x,s=t.y-e.y,o=Math.hypot(i,s);if(o<1e-6)return{...e};const r=Math.min(n,o/2)/o;return{x:e.x+i*r,y:e.y+s*r}}function Bp(e,t){if(e.length<2)return $p(e);let n=`M${e[0].x},${e[0].y}`;for(let s=1;s<e.length-1;s++){const o=fr(e[s],e[s-1],t),r=fr(e[s],e[s+1],t);n+=`L${o.x},${o.y}Q${e[s].x},${e[s].y} ${r.x},${r.y}`}const i=e[e.length-1];return`${n}L${i.x},${i.y}`}function $p(e){return e.length?e.map((t,n)=>`${n===0?"M":"L"}${t.x},${t.y}`).join(""):""}function Fp(e,t){let n=0,i=e.length-1,s=e[e.length-1];for(let o=e.length-1;o>0;o--){const r=Math.hypot(e[o].x-e[o-1].x,e[o].y-e[o-1].y);if(n+r>=t){const a=(t-n)/r;s={x:e[o].x+(e[o-1].x-e[o].x)*a,y:e[o].y+(e[o-1].y-e[o].y)*a},i=o-1;break}n+=r,i=o-1}return{cut:i,cutPoint:s}}function _p(e,t,n,i){if(e.length<2||n<=0)return i(e);const{cut:s,cutPoint:o}=Fp(e,n),r=e.slice(0,s+1),a=r[r.length-1],l=a&&Math.abs(a.x-o.x)<1e-6&&Math.abs(a.y-o.y)<1e-6;return i([...r,...l?[]:[o],t])}function Hp(e,t=1.5){if(e.length<3)return e;const n=[e[0]];for(let i=1;i<e.length-1;i++){const s=n[n.length-1],o=e[i],r=e[i+1],a=r.x-s.x,l=r.y-s.y,c=Math.hypot(a,l);(c<1e-6?Math.hypot(o.x-s.x,o.y-s.y):Math.abs(l*o.x-a*o.y+r.x*s.y-r.y*s.x)/c)>t&&n.push(o)}return n.push(e[e.length-1]),n}function zp(e,t,n,i){const s=Math.hypot(t.x,t.y)||1,o=t.x/s,r=t.y/s,a=-r,l=o,c=n/2,h={x:e.x+a*c,y:e.y+l*c},f={x:e.x-a*c,y:e.y-l*c},d={x:e.x+o*i,y:e.y+r*i};return`M${h.x},${h.y}L${d.x},${d.y}L${f.x},${f.y}Z`}function Wp(e,t,n,i,s=16){const o={x:e.x+n.x*s,y:e.y+n.y*s},r={x:t.x+i.x*s,y:t.y+i.y*s},a=[e,o];if(Math.abs(n.x)>.5){const l=(o.x+r.x)/2;Math.abs(o.y-r.y)>.5&&a.push({x:l,y:o.y},{x:l,y:r.y})}else{const l=(o.y+r.y)/2;Math.abs(o.x-r.x)>.5&&a.push({x:o.x,y:l},{x:r.x,y:l})}return a.push(r,t),Hp(a)}function Gp(e,t={}){const n=y.useRef(null);n.current||(n.current=new Ip);const[i,s]=y.useState(null),[o,r]=y.useState(!1),a=JSON.stringify(t);y.useEffect(()=>{const h=n.current;if(!e||e.nodes.length===0){s(null),r(!1);return}let f=!1;return r(!0),h.layout(e,JSON.parse(a)).then(d=>{f||(s({spec:e,layout:d}),r(!1))},d=>{f||(r(!1),console.error("graph-core layout failed:",d))}),()=>{f=!0,h.cancel()}},[e,a]),y.useEffect(()=>()=>n.current?.dispose(),[]);const l=!!e&&e.nodes.length>0,c=!i||i.spec!==e;return{latest:i,inProgress:(o||c)&&l}}const Up=300,Kp=100,qp=200,Qp=75,Yp=250,Xp=120,Zp=200,Jp=[.65,0,.35,1],cn=e=>e/1e3,em=()=>typeof window<"u"&&typeof window.matchMedia=="function"&&window.matchMedia("(prefers-reduced-motion: reduce)").matches,Qt=e=>()=>em()?0:e,Tl=Qt(Up),pr=Qt(Kp),tm=Qt(qp),nm=Qt(Qp),im=Qt(Yp),hn=()=>Xp,mr=.5;function sm(e={}){const{min:t=.2,max:n=2}=e,i=y.useRef(null),s=y.useRef(null),o=y.useRef(null),r=y.useRef(1),a=y.useRef({w:0,h:0}),l=y.useRef(null),c=y.useRef(null),h=y.useRef(!0),f=y.useRef(!0),d=y.useCallback(()=>{const v=i.current;return v?{x:v.clientWidth*mr,y:v.clientHeight*mr}:{x:0,y:0}},[]),g=y.useCallback(v=>{const x=s.current;if(x){const{x:C,y:D}=d();x.style.transition=v?`width ${v}ms, height ${v}ms`:"",x.style.padding=`${D}px ${C}px`,x.style.width=`${a.current.w*r.current+2*C}px`,x.style.height=`${a.current.h*r.current+2*D}px`}},[d]),p=y.useCallback((v,x)=>{r.current=Math.min(n,Math.max(t,v));const C=x?Tl():0;l.current&&cancelAnimationFrame(l.current),l.current=requestAnimationFrame(()=>{l.current=null;const D=o.current;D&&(D.style.transition=C?`transform ${C}ms`:"",D.style.transform=`scale(${r.current})`)}),c.current&&(clearTimeout(c.current),c.current=null),C?g(C):c.current=setTimeout(()=>{c.current=null,g(0)},100)},[t,n,g]),b=y.useCallback((v,x=!0)=>{h.current=!1,p(v,x)},[p]),m=y.useCallback(v=>b(r.current*v),[b]),w=y.useCallback((v,x)=>{a.current={w:v,h:x};const C=o.current;C&&(C.style.width=`${v}px`,C.style.height=`${x}px`,C.style.transformOrigin="0 0",C.style.transform=`scale(${r.current})`),g(0)},[g]),k=y.useCallback(()=>{const v=i.current,{w:x,h:C}=a.current;if(!v||!x||!C)return;h.current=!0;const D=!f.current;f.current=!1,p(Math.min(v.clientWidth/x,v.clientHeight/C,1),D),requestAnimationFrame(()=>{const{x:S,y:P}=d();typeof v.scrollTo=="function"?v.scrollTo({left:S,top:P,behavior:D?"smooth":"auto"}):(v.scrollLeft=S,v.scrollTop=P)})},[p,d]);return y.useEffect(()=>{const v=i.current;if(!v)return;const x=C=>{!C.ctrlKey&&!C.metaKey||(C.preventDefault(),b(r.current*(1-C.deltaY*.005),!1))};return v.addEventListener("wheel",x,{passive:!1}),()=>v.removeEventListener("wheel",x)},[b]),y.useEffect(()=>{const v=i.current;if(!v)return;let x=!1,C=0,D=0,S=0,P=0,E=!1;const L=_=>_ instanceof Element&&!_.closest("[data-pan-ignore]"),I=_=>{_.button!==0||!L(_.target)||(x=!0,E=!1,C=_.clientX,D=_.clientY,S=v.scrollLeft,P=v.scrollTop,v.style.cursor="grabbing")},B=_=>{if(!x)return;const T=_.clientX-C,W=_.clientY-D;!E&&Math.hypot(T,W)<3||(E||(E=!0,v.setPointerCapture(_.pointerId)),_.preventDefault(),v.scrollLeft=S-T,v.scrollTop=P-W)},O=_=>{x&&(x=!1,v.style.cursor="",v.hasPointerCapture(_.pointerId)&&v.releasePointerCapture(_.pointerId))};return v.addEventListener("pointerdown",I),v.addEventListener("pointermove",B),v.addEventListener("pointerup",O),v.addEventListener("pointercancel",O),()=>{v.removeEventListener("pointerdown",I),v.removeEventListener("pointermove",B),v.removeEventListener("pointerup",O),v.removeEventListener("pointercancel",O)}},[]),{containerRef:i,spacerRef:s,wrapperRef:o,applyZoom:b,zoomBy:m,zoomToFit:k,getZoom:()=>r.current,isAutoFit:()=>h.current,setContentSize:w}}const om=2,rm=.5;function In({kind:e,width:t=44,className:n}){const i=y.useId().replace(/:/g,""),s=ne.kinds[e],o=rm*(s.secondary?ne.secondaryScale:1),{d:r,...a}=Tn(s.headDirection,o),l=a.markerWidth,c=`es-${i}`,h=s.heads==="both"?1+l:1,f=t-1-l;return u.jsxs("svg",{width:t,height:"14",viewBox:`0 0 ${t} 14`,className:`shrink-0 ${n??""}`,"aria-hidden":!0,children:[u.jsx("defs",{children:u.jsx("marker",{id:c,...a,children:u.jsx("path",{d:r,fill:s.color})})}),u.jsx("line",{x1:h,y1:"7",x2:f,y2:"7",stroke:s.color,strokeWidth:om,strokeDasharray:s.dashed?ne.dash:void 0,markerStart:s.heads==="both"?`url(#${c})`:void 0,markerEnd:`url(#${c})`})]})}const Cl={"owned-mine":{side:"left",kind:"own-bkwd"},"owned-theirs":{side:"left",kind:"own-fwd"},"owns-mine":{side:"right",kind:"own-fwd"},"owns-theirs":{side:"right",kind:"own-bkwd"},association:{side:"left",kind:"association"}},am=300,es=new Set;let It;function Vs(){It!==void 0&&(clearTimeout(It),It=void 0)}function Ot(e){Vs();for(const t of es)t(e)}function Al(){Vs(),It=setTimeout(()=>{It=void 0,Ot(null)},am)}function lm({label:e,rows:t,onAdd:n,onRemove:i,onInspect:s,colorOf:o,slotOrder:r,parentOf:a}){const[l,c]=y.useState(null),[h,f]=y.useState(null),d=y.useRef(null),g=y.useRef(null),p=y.useId();y.useEffect(()=>{const C=D=>{D!==p&&(c(null),f(null))};return es.add(C),()=>{es.delete(C)}},[p]),y.useEffect(()=>{if(!l)return;const C=S=>{S.target?.closest("[data-relation-bar]")||Ot(null)},D=S=>{S.key==="Escape"&&Ot(null)};return document.addEventListener("mousedown",C,!0),document.addEventListener("keydown",D),()=>{document.removeEventListener("mousedown",C,!0),document.removeEventListener("keydown",D)}},[l]);const b=C=>t.filter(D=>Cl[D.position].side===C),m=C=>new Set(b(C).map(D=>D.other)).size,w=m("left"),k=m("right");if(w===0&&k===0)return null;const v=(C,D)=>{const S=D?.getBoundingClientRect();S&&(Ot(p),c(C),f({x:S.left,y:S.bottom+2}))},x=(C,D,S)=>{const P=l===C;return u.jsx("button",{ref:S,"data-relation-bar":!0,"data-no-drag":!0,disabled:D===0,"aria-label":C==="left"?`${D} classes ${e} belongs to`:`${D} classes ${e} owns`,onMouseEnter:()=>D>0&&v(C,S.current),onMouseLeave:Al,onClick:E=>{E.stopPropagation(),D!==0&&(P?Ot(null):v(C,S.current))},className:`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] leading-none
                    tabular-nums transition-colors
                    ${D===0?"text-gray-300 dark:text-slate-600 cursor-default":P?"bg-sky-200 dark:bg-sky-800 text-sky-900 dark:text-sky-100":"text-sky-800 dark:text-sky-200 hover:bg-sky-100 dark:hover:bg-sky-900"}`,children:C==="left"?u.jsxs(u.Fragment,{children:[u.jsx("span",{"aria-hidden":!0,children:"←"}),D]}):u.jsxs(u.Fragment,{children:[D,u.jsx("span",{"aria-hidden":!0,children:"→"})]})})};return u.jsxs(u.Fragment,{children:[x("left",w,d),u.jsx("span",{className:`flex-1 min-w-0 text-center text-[9px] text-gray-400
                       dark:text-slate-500 truncate select-none`,children:"related"}),x("right",k,g),l&&h&&Nr.createPortal(u.jsx(hm,{anchor:h,side:l,label:e,rows:b(l),onAdd:n,onRemove:i,onInspect:s,colorOf:o,slotOrder:r,parentOf:a}),document.body)]})}function cm(e){const t=y.useRef(null),[n,i]=y.useState(e);return y.useEffect(()=>{const s=t.current;if(!s)return;const o=s.getBoundingClientRect(),r=8;i({x:Math.max(r,Math.min(e.x,window.innerWidth-o.width-r)),y:Math.max(r,Math.min(e.y,window.innerHeight-o.height-r))})},[e]),{ref:t,pos:n}}function hm({anchor:e,side:t,label:n,rows:i,onAdd:s,onRemove:o,onInspect:r,colorOf:a,slotOrder:l,parentOf:c}){const{ref:h,pos:f}=cm(e),d=x=>{const C=l?.indexOf(x.slot)??-1;return C===-1?Number.MAX_SAFE_INTEGER:C},g=[...i].sort((x,C)=>d(x)-d(C)||x.other.localeCompare(C.other)||x.slot.localeCompare(C.slot)),p=new Map,b=new Set;if(c){const x=new Map(g.map(C=>[`${C.slot}|${C.other}`,C]));for(const C of g){const D=c(C.other),S=D===void 0?void 0:x.get(`${C.slot}|${D}`);if(!S||S===C)continue;b.add(C);const P=`${C.slot}|${D}`;p.set(P,[...p.get(P)??[],C])}}const m=[],w=(x,C)=>{m.push({row:x,depth:C});for(const D of p.get(`${x.slot}|${x.other}`)??[])w(D,C+1)};for(const x of g)b.has(x)||w(x,0);const k=g.every(x=>x.drawn),v=[...new Set(g.map(x=>x.other))];return u.jsxs("div",{ref:h,"data-relation-bar":!0,onMouseEnter:Vs,onMouseLeave:Al,style:{left:f.x,top:f.y},className:`fixed z-50 w-max max-w-[min(46rem,calc(100vw-2rem))] max-h-[60vh]
                 overflow-y-auto overflow-x-hidden py-1
                 rounded-md border border-gray-300 dark:border-slate-600
                 bg-white dark:bg-slate-800 shadow-xl
                 text-gray-900 dark:text-gray-100`,children:[u.jsx("div",{className:"px-3 py-1 border-b border-gray-200 dark:border-slate-700",children:u.jsxs("div",{className:"text-[11px] font-semibold",children:[u.jsx("b",{children:n})," ",t==="left"?"belongs to":"owns"," ",v.length," ",v.length===1?"entity":"distinct entities",g.length!==v.length&&u.jsxs("span",{className:"font-normal text-gray-500 dark:text-slate-400",children:[" ","through ",g.length," attributes"]})]})}),u.jsx("button",{onClick:()=>v.forEach(x=>k?o(x):s(x)),className:`block w-full text-left px-3 py-1 text-[11px]
                   text-blue-600 dark:text-blue-400
                   hover:bg-gray-100 dark:hover:bg-slate-700`,children:k?`hide all ${v.length} entities`:`add all ${v.length} entities`}),u.jsx("table",{className:"w-full text-[11px]",children:u.jsx("tbody",{children:m.map(({row:x,depth:C})=>{const D=Cl[x.position].kind,S=C>0&&u.jsx("span",{"aria-hidden":!0,className:"text-gray-400 dark:text-slate-500 select-none",style:{paddingLeft:`${(C-1)*.75}rem`},children:"↳ "}),P=x.declaredBy===x.other?n:x.declaredBy,E=t==="left"?x.other:P,L=t==="left"?P:x.other;return u.jsxs("tr",{"data-family-depth":C,className:"hover:bg-gray-100 dark:hover:bg-slate-700",children:[u.jsx("td",{className:"pl-2 pr-1 py-0.5",children:u.jsx("button",{onClick:I=>{I.stopPropagation(),(x.drawn?o:s)(x.other)},"aria-label":x.drawn?`Remove ${x.other} from the diagram`:`Add ${x.other} to the diagram`,className:`w-4 h-4 rounded-sm leading-none text-[11px]
                                flex items-center justify-center border
                                ${x.drawn?"border-sky-300 bg-sky-50 text-sky-700 hover:bg-sky-200 dark:border-sky-700 dark:bg-sky-950 dark:text-sky-300":"border-gray-300 text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:border-slate-600 dark:hover:bg-slate-600"}`,children:x.drawn?"−":"+"})}),u.jsxs("td",{className:"pl-1 pr-2 py-0.5 text-right whitespace-nowrap",children:[t==="left"&&S,u.jsx(gr,{cls:E,row:x,colorOf:a,onInspect:r})]}),u.jsx("td",{className:`px-2 py-0.5 font-mono text-gray-400 dark:text-slate-500
                               whitespace-nowrap tabular-nums text-right`,children:x.cardinality}),u.jsx("td",{className:"px-1 py-0.5 align-middle",children:u.jsx(In,{kind:D,width:30})}),u.jsxs("td",{className:"pr-3 py-0.5 whitespace-nowrap",children:[t==="right"&&S,u.jsx(gr,{cls:L,row:x,colorOf:a,onInspect:r})]})]},`${x.declaredBy}.${x.slot}->${x.other}`)})})})]})}function gr({cls:e,row:t,colorOf:n,onInspect:i}){const s=n?.(e),o=e===t.declaredBy,r=s?{color:s.text}:void 0;return u.jsxs("span",{className:"font-mono",children:[i?u.jsx("button",{onClick:a=>{a.stopPropagation(),i(e)},title:`Open ${e}'s details`,className:"hover:underline",style:r,children:e}):u.jsx("span",{style:r,children:e}),o&&u.jsxs("span",{className:s?"opacity-80":"text-gray-500 dark:text-slate-400",style:r,children:[".",t.slot]})]})}const Me={sibs:!0,dir:"RIGHT",merge:"near",legend:!1,cases:!1},Pl=["legend","cases"];function um(e,t){if(e.get("panels")!=="0")return t;for(const n of Pl)t[n]=!1;return t.detail=null,t}const Rt={dir:"explore-nl-dir",merge:"explore-nl-merge",sibs:"explore-nl-sibs"},Wn="~",dm=["exp","hidden","owners"],fm=["tour"];let Bt;function pm(e=window.location.search){return Bt===void 0&&(Bt=new URLSearchParams(e).get("tour")==="1"),Bt}function mm(e,t){const n=e.get(t);return n?n.split(Wn).filter(Boolean):[]}function El(e){const t=e.get("cat");if(!t)return[];const n=t.split(new RegExp(`[,${Wn}]`)).filter(Boolean);return[...new Set(n.flatMap(i=>{const s=Vr.find(o=>o.id===i);return s?$r(s):[]}))]}function un(e){try{return localStorage.getItem(e)}catch{return null}}function gm(e,t){try{localStorage.setItem(e,t)}catch{}}function dn(e,t){return e&&t.includes(e)?e:null}function We(e=window.location.search){const t=new URLSearchParams(e),n=dn(t.get("dir"),["RIGHT","DOWN"])??dn(un(Rt.dir),["RIGHT","DOWN"])??Me.dir,i=dn(t.get("merge"),["near","far","bend","off"])??dn(un(Rt.merge),["near","far","bend","off"])??Me.merge,s=t.has("sibs")?t.get("sibs")==="1":un(Rt.sibs)!==null?un(Rt.sibs)!=="0":Me.sibs,o=mm(t,"sel"),r=um(t,{legend:t.get("legend")==="1",cases:t.get("cases")==="1",detail:t.get("detail")||null});return t.has("legend")&&(r.legend=t.get("legend")==="1"),t.has("cases")&&(r.cases=t.get("cases")==="1"),t.has("detail")&&(r.detail=t.get("detail")||null),{sel:o.length?o:El(t),detail:r.detail,roots:t.get("roots")==="1",sibs:s,dir:n,merge:i,legend:r.legend,cases:r.cases}}function Dl(e,{push:t=!1}={}){const n=new URL(window.location.href),i=n.searchParams,s=(r,a)=>{a.length===0?i.delete(r):i.set(r,[...a].sort().join(Wn))},o=(r,a,l)=>{l?i.delete(r):i.set(r,a)};for(const r of dm)i.delete(r);Bt===void 0&&i.has("tour")&&(Bt=i.get("tour")==="1");for(const r of fm)i.delete(r);s("sel",e.sel),e.detail?i.set("detail",e.detail):i.delete("detail"),o("roots","1",!e.roots),o("sibs",e.sibs?"1":"0",e.sibs===Me.sibs),o("dir",e.dir,e.dir===Me.dir),o("merge",e.merge,e.merge===Me.merge),o("legend","1",e.legend===Me.legend),o("cases","1",e.cases===Me.cases),i.delete("panels"),i.delete("cat"),t?window.history.pushState(null,"",n):window.history.replaceState(null,"",n)}function yr(e,t){gm(Rt[e],typeof t=="boolean"?t?"1":"0":String(t))}function ym(e,t=window.location.href){const n=new URL(t),i=new URLSearchParams,s=(o,r)=>i.set(o,r);return e.sel.length&&s("sel",[...e.sel].sort().join(Wn)),e.detail&&s("detail",e.detail),e.roots&&s("roots","1"),e.sibs!==Me.sibs&&s("sibs",e.sibs?"1":"0"),e.dir!==Me.dir&&s("dir",e.dir),e.merge!==Me.merge&&s("merge",e.merge),e.legend!==Me.legend&&s("legend","1"),e.cases!==Me.cases&&s("cases","1"),n.search=i.toString(),n.toString()}const Ae=240,ct=30,bm=.6,ht=20,wm=1/0,Is=22,Ml=18,gt=28;function Ol(e,t,n=()=>!1){const i=new Map;for(const s of e){if(n(s.other))continue;const o=s.position,r=i.get(o)??new Map,a=r.get(s.other)??[];a.includes(s.slot)||a.push(s.slot),r.set(s.other,a),i.set(o,r)}return dc.filter(s=>i.has(s)).map(s=>{const o=[...i.get(s)].map(([r,a])=>({other:r,slots:a,drawn:t(r)})).sort((r,a)=>r.other.localeCompare(a.other));return{position:s,label:fc(s,o.length),items:o}})}function Rl(e,t,n=()=>!1){const i=new Set,s=[];for(const o of e){if(n(o.other))continue;const r=`${o.declaredBy}.${o.slot}->${o.other}:${o.position}`;i.has(r)||(i.add(r),s.push({other:o.other,position:o.position,slot:o.slot,declaredBy:o.declaredBy,cardinality:o.cardinality,drawn:t(o.other)}))}return s}function ce(e){return e.storageDirection==="flipped"?e.target:e.source}function ts(e){return e.anchorClass??ce(e)}function xm(e,t,n,i,s){const o=new Map,r=new Map,a=[],l=new Set;for(const d of e.edges)d.type==="isa"?(o.set(d.target,[...o.get(d.target)??[],d.source]),r.set(d.source,(r.get(d.source)??0)+1)):d.isLoop||(a.push(d),l.add(`${ce(d)}|${d.slotName}`));const c=new Set(e.nodes.map(d=>d.id)),h=e.nodes.map(d=>{const g=new Map(n(d.id).map((O,_)=>[O.name,_])),p=(O,_)=>(g.get(O.slot)??Number.MAX_SAFE_INTEGER)-(g.get(_.slot)??Number.MAX_SAFE_INTEGER),b=d.slots.map(O=>({...O,connected:O.isLoop||l.has(`${d.id}|${O.slot}`),rangeColor:i(O.range),targetColor:s(O.range)})).sort(p),m=new Set(b.map(O=>O.slot)),w=n(d.id).filter(O=>!m.has(O.name)).map(O=>({slot:O.name,range:O.range,channel:"plain",flipped:!1,cardinality:lc(O.required,O.multivalued),isLoop:!1,connected:!1,rangeColor:i(O.range)})),k=b.filter(O=>O.connected),v=[...b.filter(O=>!O.connected),...w].sort(p),x=[...k,...v].slice(0,Math.max(wm,k.length)),C=x.length===k.length+v.length,D=t.has(d.id)||C,S=D?[...k,...v]:x,P=C?0:k.length+v.length-x.length,E=e.hiddenOwners.get(d.id)??[],L=e.hiddenOwned.get(d.id)??[],I=Ol(d.relations,O=>c.has(O),O=>O===d.id),B=Rl(d.relations,O=>c.has(O),O=>O===d.id);return{...d,isaParents:o.get(d.id)??[],subclassCount:r.get(d.id)??0,members:[],hiddenOwners:E,hiddenOwned:L,relationGroups:I,relationRows:B,...jl(I),rows:S,allRows:[...k,...v],hiddenCount:P,expanded:D,height:Ll(S.length,P,I.length>0)}}),f=new Map;for(const d of a){const g=ce(d)===d.source?d.target:d.source,p=s(g);p&&f.set(d.id,p)}return{nodes:h,edges:a,edgeColors:f}}function jl(e){const t=new Map;for(const n of e)for(const i of n.items)t.set(i.other,(t.get(i.other)??!1)||i.drawn);return{relatedCount:t.size,shownCount:[...t.values()].filter(Boolean).length}}function Ll(e,t,n){return ct+(n?Is:0)+e*ht+(t?Ml:0)+(e?5:0)}function vm(e,t,n,i,s,o,r){const a=cc(e.nodes.map(w=>w.id),t,n);if(!a.size)return e;const l=new Map(e.nodes.map(w=>[w.id,w])),c=new Set(e.nodes.map(w=>w.id)),h=new Map,f=[],d=new Map;for(const[w,k]of a){const v=pc(w),x=k.map(j=>({id:j,label:l.get(j)?.label??j,color:hc(r(j))}));for(const j of x)h.set(j.id,v);const C=l.has(w);C&&h.set(w,v);const D=new Map(x.map(j=>[j.id,j])),S=new Map,P=C?[w,...k]:k;for(const j of P){const X=l.get(j);if(!X)continue;const oe=j===w;for(const re of X.allRows){const Oe=i(j,re.slot),be=Oe!==void 0&&Oe!==j,Ee=`${oe||be?Oe??w:j}|${re.slot}`,ve=S.get(Ee),Ce=D.get(j),q=oe||be?ve?.owners??[]:[...ve?.owners??[],...Ce?[Ce]:[]];S.set(Ee,{...ve??re,connected:(ve?.connected??!1)||re.connected,owners:q,declaringClass:Ee.slice(0,Ee.indexOf("|"))})}}const E=new Map;for(const j of S.values())if(j.targetColor)for(const X of j.owners??[])E.has(X.id)||E.set(X.id,j.targetColor);for(const j of x){const X=E.get(j.id);X&&(j.color=X)}for(const[j,X]of S)X.targetColor&&d.set(`${v}|${j}`,X.targetColor);const L=[...S.values()],I=j=>{const X=j.owners?.length?j.owners[0].id:w;return o(X,j.slot)};L.sort((j,X)=>I(j)-I(X));const B=uc(L,x,j=>({slot:`::hdr:${j.id}`,range:"",channel:"plain",flipped:!1,cardinality:"",isLoop:!1,connected:!1,rangeColor:"",header:j})),O=j=>!h.has(j)&&!P.includes(j),_=[...new Set(P.flatMap(j=>l.get(j)?.hiddenOwners??[]))].filter(O),T=[...new Set(P.flatMap(j=>l.get(j)?.hiddenOwned??[]))].filter(O),W=Ol(P.flatMap(j=>l.get(j)?.relations??[]),j=>c.has(j),j=>!O(j)),fe=Rl(P.flatMap(j=>l.get(j)?.relations??[]),j=>c.has(j),j=>!O(j)),N=l.get(k[0]),G=s(w);f.push({...N,id:v,label:w,description:G.description,abstract:G.abstract,slots:[],members:x,role:P.some(j=>l.get(j)?.role==="selected")?"selected":"context",layer:Math.min(...P.map(j=>l.get(j)?.layer??0)),isaParents:[],subclassCount:x.length,hiddenOwners:_,hiddenOwned:T,relationGroups:W,relationRows:fe,...jl(W),rows:B,allRows:L,hiddenCount:0,expanded:!0,height:Ll(B.length,0,W.length>0)})}const g=[...e.nodes.filter(w=>!h.has(w.id)),...f],p=new Set,b=e.edges.map(w=>({...w,source:h.get(w.source)??w.source,target:h.get(w.target)??w.target,entityMember:(()=>{if(w.inducedFrom!==void 0)return;const k=ce(w)===w.source?w.target:w.source;return h.has(k)?k:void 0})(),anchorClass:h.has(ce(w))?i(ce(w),w.slotName)??ce(w):ce(w)})).filter(w=>{if(!Ei(w.source)&&!Ei(w.target))return!0;const k=`${w.source}|${w.target}|${w.anchorClass}|${w.slotName}|${w.storageDirection}`;return p.has(k)?!1:(p.add(k),!0)}).filter(w=>w.source!==w.target),m=new Map(e.edgeColors);for(const w of b){const k=d.get(`${ce(w)}|${ts(w)}|${w.slotName}`);k&&m.set(w.id,k)}return{nodes:g,edges:b,edgeColors:m}}function km({title:e}){return u.jsxs("svg",{viewBox:"0 0 16 16",width:"15",height:"15","aria-hidden":"false",className:"shrink-0",style:{color:ze.entity},children:[u.jsx("title",{children:e}),u.jsx("path",{d:"M12.33 10.5 A5 5 0 1 1 12.33 5.5",fill:"none",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round"}),u.jsx("path",{d:"M13.7 7.9 L10.6 6.7 L13.7 4.2 Z",fill:"currentColor"})]})}function Nl(e){return ct+(e.relationGroups.length>0?Is:0)}function Vl(e,t,n){const i=e.rows.findIndex(s=>s.slot===t&&!s.header&&(!n||!s.declaringClass||s.declaringClass===n));if(i<0)throw new Error(`No displayed row for ${t} on ${e.id}`);return Nl(e)+i*ht+ht/2}function Sm(e,t){const n=e.rows.findIndex(i=>i.header?.id===t);if(!(n<0))return Nl(e)+n*ht+ht/2}function ns(e,t){if(e.storageDirection==="flipped"||!t.members.length)return;const n=e.entityMember;return n&&t.members.some(i=>i.id===n)?n:void 0}const Tm=4,Cm=10,Am=ne.head.span,br=ne.head.len,Pm=ne.gap,Em=ne.secondaryScale,Il=ne.stroke.own,Bl=ne.stroke.ownHover,Dm=Il*ne.stroke.refFactor,Mm=Bl*ne.stroke.refFactor;function wr(e,t){return e?t?Te.ownBkwd:Te.ownFwd:Te.association}function di(e,t){if(e==="off"||t.length<2)return 0;if(e==="near")return 40;if(e==="far")return 120;const n=t[t.length-1],i=t[t.length-2];return Math.hypot(n.x-i.x,n.y-i.y)}function xr(e,t){return e<2?0:Math.min(Tm,t/(e-1))}function Om(e,t){const n=new Map,i=(c,h,f,d)=>{const g=n.get(c.id)??[];return g.some(p=>p.id===h)||(g.push({id:h,x:f,y:d}),n.set(c.id,g)),h},s=new Map(e.nodes.map(c=>[c.id,c])),o=c=>{const h=s.get(ce(c)===c.source?c.target:c.source);return!!h&&ns(c,h)!==void 0},r=new Map;for(const c of e.edges){if(o(c))continue;const h=ce(c)===c.source?c.target:c.source,f=`${h}|${h===c.source?"out":"in"}`;r.set(f,(r.get(f)??0)+1)}const a=new Map,l=e.edges.map(c=>{const h=s.get(ce(c)),f=s.get(ce(c)===c.source?c.target:c.source);if(!h||!f)throw new Error(`Edge ${c.id} endpoint missing from subgraph`);const d=c.storageDirection==="flipped",g=Vl(h,c.slotName,ts(c)),p=i(h,`${h.id}::row:${ts(c)}|${c.slotName}`,d?0:Ae,g),b=f.id===c.source,m=`${f.id}|${b?"out":"in"}`,w=ns(c,f),k=w!==void 0?Sm(f,w):void 0;let v;if(w!==void 0&&k!==void 0)v=i(f,`${f.id}::mhdr:${b?"out":"in"}:${w}`,t==="RIGHT"?b?Ae:0:Ae/2,t==="RIGHT"?k:b?f.height:0);else{const x=r.get(m)??1,C=a.get(m)??0;a.set(m,C+1);const D=xr(x,ct-4),S=ct/2+(C-(x-1)/2)*D;v=t==="RIGHT"?i(f,`${f.id}::hdr:${b?"out":"in"}:${C}`,b?Ae:0,S):i(f,`${f.id}::hdr:${b?"out":"in"}:${C}`,Ae/2+(C-(x-1)/2)*xr(x,Ae/2),b?f.height:0)}return{id:c.id,source:c.source,target:c.target,sourcePort:d?v:p,targetPort:d?p:v}});return{nodes:e.nodes.map(c=>({id:c.id,width:Ae,height:c.height,partition:c.layer,ports:n.get(c.id)})),edges:l}}function Rm(e,t){if(!e?.length)return e;const n=e[0],i=n.bendPoints?.length?n.bendPoints[n.bendPoints.length-1]:n.startPoint,s=n.endPoint.x-i.x,o=n.endPoint.y-i.y,r=Math.hypot(s,o);if(r<1)return e;const a=Math.min(t,r*.8)/r,l={x:n.endPoint.x-s*a,y:n.endPoint.y-o*a};return[{...n,endPoint:l},...e.slice(1)]}function jm(e,t){if(!e?.length)return e;const n=e[0],i=n.bendPoints?.length?n.bendPoints[0]:n.endPoint,s=i.x-n.startPoint.x,o=i.y-n.startPoint.y,r=Math.hypot(s,o);if(r<1)return e;const a=Math.min(t,r*.8)/r,l={x:n.startPoint.x+s*a,y:n.startPoint.y+o*a};return[{...n,startPoint:l},...e.slice(1)]}function Lm({dataService:e,selectedIds:t,onNodeClick:n,onAdd:i,onRemove:s,pathToRoot:o=!1,onTogglePathToRoot:r,direction:a,setDirection:l,mergeMode:c,setMergeMode:h}){const f=y.useId().replace(/[^a-zA-Z0-9]/g,""),d=A=>`${A}-${f}`,[g,p]=y.useState(new Set),b=y.useMemo(()=>e.getOwnershipSubgraph([...t].sort(),{pathToRoot:o}),[e,t,o]),m=y.useCallback(A=>e.getTargetColor(A),[e]),w=y.useMemo(()=>new Map(b.nodes.map(A=>[A.id,e.getClassSummary(A.id)?.slots??[]])),[e,b]),k=y.useMemo(()=>xm(b,g,A=>w.get(A)??[],A=>e.getRangeColor(A),A=>e.getTargetColor(A)),[b,g,w,e]),v=y.useMemo(()=>new Map(b.nodes.map(A=>[A.id,e.getClassSummary(A.id)])),[e,b]),x=y.useMemo(()=>{const A=M=>v.get(M)?.parentId,R=M=>!mc.has(M),V=(M,F)=>M.range===F.range&&M.multivalued===F.multivalued;return vm(k,A,R,(M,F)=>{const z=e.getClassSummary(M)?.slots.find(he=>he.name===F);if(!z)return;if(!z.inheritedFrom)return M;const Z=e.getClassSummary(z.inheritedFrom)?.slots.find(he=>he.name===F);return Z&&V(z,Z)?z.inheritedFrom:M},M=>{const F=e.getClassSummary(M);return{description:F?.description??"",abstract:F?.isAbstract??!1}},(M,F)=>{const z=e.getClassSummary(M)?.slots.findIndex(Z=>Z.name===F)??-1;return z<0?Number.MAX_SAFE_INTEGER:z},M=>e.siblingColorIndexOf(M))},[k,v,e]),[C,D]=y.useState(new Map),[S,P]=y.useState(new Map),E=y.useMemo(()=>Om(x,a),[x,a]),{latest:L,inProgress:I}=Gp(E,{direction:a,usePartitions:!0,nodeSpacing:28,layerSpacing:72,extraLayoutOptions:{"elk.spacing.edgeNode":"18","elk.spacing.edgeEdge":"12","elk.layered.spacing.edgeNodeBetweenLayers":"18","elk.layered.spacing.edgeEdgeBetweenLayers":"10"}}),B=L?.spec===E?L.layout:null,O=L?.layout??null,_=sm(),T=(O?.width??0)+gt*2,W=(O?.height??0)+gt*2;y.useEffect(()=>{B&&(_.setContentSize(T,W),_.isAutoFit()&&_.zoomToFit())},[B,T,W]),y.useEffect(()=>D(new Map),[B]),y.useEffect(()=>P(new Map),[B]);const[fe,N]=y.useState(!1),G=y.useRef(!0);y.useEffect(()=>{if(!B){N(!1),O||(G.current=!0);return}const A=G.current?0:im();if(G.current=!1,A===0){N(!0);return}const R=setTimeout(()=>N(!0),A);return()=>clearTimeout(R)},[B,O]);const j=y.useRef(new Map),X=y.useRef(!1),oe=y.useRef(C);oe.current=C;const re=y.useMemo(()=>{const A=new Map((O?.nodes??[]).map(V=>[V.id,V])),R=new Map(S);for(const[V,H]of C)R.set(V,H);for(const[V,{dx:H,dy:K}]of R){const Y=A.get(V);Y&&A.set(V,{...Y,x:Y.x+H,y:Y.y+K})}return j.current=A,A},[O,C,S]),[Oe,be]=y.useState(!1);y.useEffect(()=>{if(!I){be(!1);return}const A=setTimeout(()=>be(!0),Zp);return()=>clearTimeout(A)},[I]);const Ee=y.useCallback((A,R)=>{if(R.button!==0||R.target.closest('button, a, [role="button"], [data-no-drag]'))return;R.stopPropagation();const V=R.clientX,H=R.clientY,K=_.getZoom()||1,Y=C.get(A)??{dx:0,dy:0},M=R.currentTarget;M.setPointerCapture(R.pointerId);let F=!1;const z=he=>{const De=(he.clientX-V)/K,Ie=(he.clientY-H)/K;!F&&Math.hypot(De,Ie)<3||(F=!0,X.current=!0,D(tt=>new Map(tt).set(A,{dx:Y.dx+De,dy:Y.dy+Ie})))},Z=he=>{if(M.releasePointerCapture(he.pointerId),M.removeEventListener("pointermove",z),M.removeEventListener("pointerup",Z),F){const De=oe.current.get(A);De&&P(Ie=>new Map(Ie).set(A,De))}};M.addEventListener("pointermove",z),M.addEventListener("pointerup",Z)},[C]),ve=y.useMemo(()=>new Map(x.nodes.map(A=>[A.id,A.role])),[x]),Ce=y.useMemo(()=>new Map(x.edges.map(A=>[A.id,A])),[x]),q=y.useMemo(()=>{const A=new Map(x.nodes.map(R=>[R.id,R]));return new Set(x.edges.filter(R=>{const V=A.get(ce(R)===R.source?R.target:R.source);return!!V&&ns(R,V)!==void 0}).map(R=>R.id))},[x]),Q=y.useMemo(()=>{const A=new Map;if(!B)return A;for(const R of x.edges){const V=ce(R)===R.source?R.target:R.source,H=re.get(V);if(!H||q.has(R.id))continue;const K=V===R.source,Y=`${V}|${K?"out":"in"}`;if(A.has(Y))continue;const M=K,F=Pm+br;A.set(Y,a==="RIGHT"?{base:{x:M?H.x+Ae+F:H.x-F,y:H.y+ct/2},dir:{x:M?-1:1,y:0}}:{base:{x:H.x+Ae/2,y:M?H.y+H.height+F:H.y-F},dir:{x:0,y:M?-1:1}})}return A},[x,re,B,a,q]),ie=y.useMemo(()=>{const A=new Map,R=new URLSearchParams(window.location.search).has("dbg"),V=new Set([...S.keys(),...C.keys()]);if(!B||V.size===0)return A;R&&console.log(`[drag] moved: ${[...V].join(", ")}`);const H=new Map(x.nodes.map(K=>[K.id,K]));for(const K of x.edges){const Y=ce(K),M=Y===K.source?K.target:K.source;if(!V.has(Y)&&!V.has(M))continue;const F=re.get(Y),z=re.get(M),Z=H.get(Y);if(!F||!z||!Z)continue;const he=K.storageDirection==="flipped",De=a==="RIGHT";let Ie;try{Ie=Vl(Z,K.slotName)}catch{R&&console.log(`   SKIP ${Y}.${K.slotName}: row not displayed`);continue}const tt=De?{x:F.x+(he?0:Ae),y:F.y+Ie}:{x:F.x+Ae/2,y:F.y+Ie},Qe=De?{x:he?-1:1,y:0}:{x:0,y:1},mt=M===K.source,Zt=De?{x:mt?z.x+Ae:z.x,y:z.y+ct/2}:{x:z.x+Ae/2,y:mt?z.y+z.height:z.y},Kn=De?{x:mt?1:-1,y:0}:{x:0,y:mt?1:-1};A.set(K.id,Wp(tt,Zt,Qe,Kn)),R&&console.log(`   reroute ${Y}.${K.slotName} -> ${M}`)}return R&&console.log(`[drag] rerouted ${A.size} edge(s)`),A},[B,C,S,x,re,a]);y.useEffect(()=>{if(!B||!new URLSearchParams(window.location.search).has("dbg"))return;const A=new Map;for(const R of B.edges){const V=Ce.get(R.id);if(!V)continue;const H=ln(R.sections);if(H.length<2)continue;const K=ce(V)===V.source?V.target:V.source;let Y=0,M=0;for(let z=1;z<H.length;z++){const Z=Math.abs(H[z].x-H[z-1].x),he=Math.abs(H[z].y-H[z-1].y);Z>.5&&he>.5&&M++,z>1&&Y++}const F=ce(V);A.set(K,[...A.get(K)??[],`${F}.${V.slotName}  pts=${H.length} bends=${Y}${M?` DIAGONAL x${M}`:""}  start=(${Math.round(H[0].x)},${Math.round(H[0].y)}) end=(${Math.round(H[H.length-1].x)},${Math.round(H[H.length-1].y)})`])}for(const[R,V]of A){if(V.length<2)continue;console.log(`
=== approaches to ${R} (${V.length}) ===`);const H=re.get(R);H&&console.log(`   box at (${Math.round(H.x)},${Math.round(H.y)}) h=${Math.round(H.height)}`),V.forEach(K=>console.log("   "+K))}},[B,Ce,re]);const ae=y.useMemo(()=>{const A=new Map;if(!B)return A;for(const R of B.edges){const V=Ce.get(R.id);if(!V||V.storageDirection==="flipped"||q.has(R.id)||di(c,ln(R.sections))<=0)continue;const H=ce(V)===V.source?V.target:V.source,K=`${H}|${H===V.source?"out":"in"}`,Y=Q.get(K);if(!Y)continue;const M=V.type==="ownership",F=ve.get(V.source)==="context"||ve.get(V.target)==="context",z=x.edgeColors.get(R.id),Z=A.get(K);A.set(K,Z?{...Z,isOwn:Z.isOwn||M,dimmed:Z.dimmed&&F,edgeIds:[...Z.edgeIds,R.id],...Z.color?.text===z?.text?{}:{color:void 0}}:{...Y,isOwn:M,dimmed:F,edgeIds:[R.id],...z?{color:z}:{}})}return A},[B,Ce,Q,c,ve,x,q]),we=y.useMemo(()=>new Set(x.nodes.map(A=>A.id)),[x]),Ne=y.useCallback(A=>!!i&&A.channel!=="plain"&&!A.isLoop&&!we.has(A.range),[i,we]),Ve=y.useRef(null),dt=y.useRef(null),ft=y.useRef(void 0),pt=y.useMemo(()=>{const A=new Map,R=new Map;for(const V of x.edges){R.set(V.id,[V.source,V.target]);for(const H of[V.source,V.target])A.set(H,[...A.get(H)??[],V.id])}return{nodeEdges:A,edgeEnds:R}},[x]),U=y.useRef(pt);U.current=pt;const J=y.useCallback(A=>{ft.current=A,dt.current===null&&(dt.current=requestAnimationFrame(()=>{dt.current=null;const R=ft.current;ft.current=void 0;const V=Ve.current,H=_.wrapperRef.current;if(R===void 0||!V||!H)return;let K=null,Y=null;if(R){const{nodeEdges:F,edgeEnds:z}=U.current;if(R.kind==="node"){K=new Set(F.get(R.id)??[]),Y=new Set([R.id]);for(const Z of K)for(const he of z.get(Z)??[])Y.add(he)}else K=new Set([R.id]),Y=new Set(z.get(R.id)??[])}const M=(F,z,Z)=>{F.style.filter=z===null||z?"":`opacity(${Z})`};V.querySelectorAll("path[data-edge-id]").forEach(F=>{const z=F.dataset.edgeId??"",Z=K?K.has(z):null;M(F,Z,.38),F.style.strokeWidth=Z?String(F.dataset.channel==="reference"?Mm:Bl):""}),V.querySelectorAll("path[data-arrowhead]").forEach(F=>{const z=(F.dataset.arrowhead??"").split(" ");M(F,K?z.some(Z=>K.has(Z)):null,.08)}),H.querySelectorAll("[data-node-id]").forEach(F=>{M(F,Y?Y.has(F.dataset.nodeId??""):null,.25)})}))},[]);y.useEffect(()=>J(null),[x,B,J]);const pe=A=>p(R=>{const V=new Set(R);return V.has(A)?V.delete(A):V.add(A),V}),me=A=>{yr("dir",A),l(A)},Yt=A=>{yr("merge",A),h(A)},Xt=e.getConceptLabel("attribute",!0).toLowerCase(),qe=A=>`px-2 py-0.5 text-xs rounded border ${A?"border-blue-500 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300":"border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700"}`;return u.jsxs("div",{className:"relative w-full h-full",children:[u.jsxs("div",{"data-pan-ignore":!0,className:"absolute top-2 right-2 z-10 flex gap-1 items-center",children:[Oe&&u.jsxs("div",{className:`mr-2 flex items-center gap-2 rounded px-2 py-1
                          text-xs text-gray-500 dark:text-gray-400
                          bg-white/80 dark:bg-slate-900/80 shadow-sm`,children:[u.jsx("span",{className:`inline-block h-3 w-3 animate-spin rounded-full
                             border-2 border-gray-300 border-t-gray-600
                             dark:border-slate-600 dark:border-t-slate-300`}),"Computing layout…"]}),r&&u.jsxs(u.Fragment,{children:[u.jsx("button",{className:qe(o),title:o?"Hide owners: show only what you selected":"Show every owner up to the root (can pull in most of the schema)",onClick:r,children:"⇱ roots"}),u.jsx("span",{className:"w-px h-4 bg-gray-300 dark:bg-slate-600 mx-1"})]}),u.jsx("button",{className:qe(a==="RIGHT"),title:"Layout left to right",onClick:()=>me("RIGHT"),children:"LR"}),u.jsx("button",{className:qe(a==="DOWN"),title:"Layout top down",onClick:()=>me("DOWN"),children:"TB"}),u.jsx("span",{className:"w-px h-4 bg-gray-300 dark:bg-slate-600 mx-1"}),u.jsx("button",{className:qe(c==="near"),title:"Merge converging edges near the node (~40px)",onClick:()=>Yt("near"),children:"⋙"}),u.jsx("button",{className:qe(c==="far"),title:"Merge converging edges early (~120px)",onClick:()=>Yt("far"),children:"⋙⋙"}),u.jsx("button",{className:qe(c==="bend"),title:"Merge at ELK's last corner",onClick:()=>Yt("bend"),children:"⌙"}),u.jsx("button",{className:qe(c==="off"),title:"No merging — every edge runs to its own port",onClick:()=>Yt("off"),children:"≡"}),u.jsx("span",{className:"w-px h-4 bg-gray-300 dark:bg-slate-600 mx-1"}),[["+",()=>_.zoomBy(1.3),"Zoom in"],["−",()=>_.zoomBy(1/1.3),"Zoom out"],["1:1",()=>_.applyZoom(1),"Reset zoom"],["⛶",()=>_.zoomToFit(),"Fit to view"]].map(([A,R,V])=>u.jsx("button",{onClick:R,title:V,className:qe(!1),children:A},A))]}),u.jsx("div",{ref:_.containerRef,"data-graph-direction":a,className:"w-full h-full overflow-auto cursor-grab",children:u.jsx("div",{ref:_.spacerRef,children:u.jsx("div",{ref:_.wrapperRef,className:"relative",children:O&&u.jsxs(u.Fragment,{children:[u.jsxs("svg",{ref:Ve,className:"absolute top-0 left-0 pointer-events-none",width:T,height:W,children:[u.jsxs("defs",{children:[(()=>{const A=Tn("forward"),{d:R,...V}=A;return u.jsx("marker",{id:d("arrow-own"),...V,children:u.jsx("path",{d:R,fill:Te.ownFwd})})})(),(()=>{const{d:A,...R}=Tn("backward");return u.jsx("marker",{id:d("arrow-own-back"),...R,children:u.jsx("path",{d:A,fill:Te.ownBkwd})})})(),(()=>{const{d:A,...R}=Tn("forward",Em);return u.jsx("marker",{id:d("arrow-assoc"),...R,children:u.jsx("path",{d:A,fill:Te.association})})})()]}),u.jsxs("g",{transform:`translate(${gt}, ${gt})`,style:{opacity:fe?1:0,transition:`opacity ${nm()}ms`},children:[[...ae].map(([A,R])=>u.jsx("path",{"data-arrowhead":R.edgeIds.join(" "),d:zp(R.base,R.dir,Am,br),fill:R.color?.text??wr(R.isOwn,!1),opacity:R.dimmed?.4:1,style:{transition:`filter ${hn()}ms`}},`head-${A}`)),(B?.edges??[]).map(A=>{const R=Ce.get(A.id);if(!R)throw new Error(`Routed edge ${A.id} missing from view model`);const V=R.storageDirection==="flipped",H=ce(R)===R.source?R.target:R.source,K=V||q.has(A.id)?void 0:Q.get(`${H}|${H===R.source?"out":"in"}`),Y=ie.get(A.id),M=!!K&&di(c,Y??ln(A.sections))>0,F=R.type!=="ownership",z=M?A.sections:Rm(A.sections,ur(F?"association":"own-fwd")),Z=F?jm(z,ur("association")):z,he=Y??ln(Z),De=Kn=>Bp(Kn,Cm),Ie=di(c,he),tt=K&&Ie>0?_p(he,K.base,Ie,De):De(he);if(!tt)return null;const Qe=R.type==="ownership",mt=ve.get(A.source)==="context"||ve.get(A.target)==="context",Zt=M?void 0:Qe?V?"arrow-own-back":"arrow-own":"arrow-assoc";return u.jsxs("g",{children:[u.jsx("path",{"data-edge-id":A.id,"data-channel":Qe?"ownership":"reference",d:tt,fill:"none",opacity:mt?.4:1,stroke:x.edgeColors.get(A.id)?.text??wr(Qe,V),strokeWidth:Qe?Il:Dm,strokeDasharray:Qe?void 0:ne.dash,markerEnd:Zt?`url(#${d(Zt)})`:void 0,markerStart:!Qe&&!M?`url(#${d("arrow-assoc")})`:void 0,style:{transition:`filter ${hn()}ms, stroke-width ${hn()}ms`}}),u.jsx("path",{d:tt,fill:"none",stroke:"transparent",strokeWidth:11,style:{pointerEvents:"stroke"},onMouseEnter:()=>J({kind:"edge",id:A.id}),onMouseLeave:()=>J(null)})]},A.id)})]})]}),u.jsx(kf,{initial:!1,children:x.nodes.map(A=>{const R=re.get(A.id);if(!R)return null;const V=A.role==="context",H=R.x+gt,K=R.y+gt,Y={duration:cn(C.has(A.id)?0:Tl()),ease:Jp};return u.jsxs(Op.div,{initial:{opacity:0,x:H,y:K},animate:{opacity:V?bm:1,x:H,y:K},exit:{opacity:0,transition:{duration:cn(pr())}},transition:{x:Y,y:Y,opacity:{duration:cn(pr()),delay:cn(tm())}},"data-node-id":A.id,"data-help-id":Pc(A),"data-pan-ignore":!0,"data-pinned":S.has(A.id)?"":void 0,onPointerDown:M=>Ee(A.id,M),onClick:()=>{if(X.current){X.current=!1;return}n?.(A.members.length?A.label:A.id)},onMouseEnter:()=>J({kind:"node",id:A.id}),onMouseLeave:()=>J(null),className:`absolute rounded-md text-xs bg-white dark:bg-slate-800 cursor-pointer ${V?"border border-dashed border-gray-400 dark:border-slate-500":S.has(A.id)?"border-2 border-amber-500 dark:border-amber-400 shadow-md":"border-2 border-slate-500 dark:border-slate-400 shadow-md"}`,style:{width:Ae,height:A.height,transition:`filter ${hn()}ms`},children:[u.jsxs("div",{className:"flex items-center gap-1 px-2 rounded-t-[4px] bg-slate-700 dark:bg-slate-700 text-white border-b border-slate-800 dark:border-slate-600",style:{height:ct},children:[u.jsx("span",{className:`font-semibold truncate ${A.abstract?"italic":""}`,title:A.description||A.id,children:A.label}),u.jsxs("span",{className:"ml-auto flex gap-1 shrink-0",children:[A.members.length>0&&u.jsxs("span",{title:`${A.members.length} classes that are a ${A.label}, merged into one box`,className:"text-[9px] px-1 rounded bg-sky-100 dark:bg-sky-900 text-sky-800 dark:text-sky-200",children:["⑃ ",A.members.length]}),A.isaParents.map(M=>u.jsxs("span",{title:`is-a ${M}`,className:"text-[9px] px-1 rounded bg-sky-100 dark:bg-sky-900 text-sky-800 dark:text-sky-200",children:["⊳ ",M]},M)),A.subclassCount>0&&A.members.length===0&&u.jsxs("span",{title:`${A.subclassCount} subclasses shown`,className:"text-[9px] px-1 rounded bg-sky-100 dark:bg-sky-900 text-sky-800 dark:text-sky-200",children:["▷ ",A.subclassCount]}),(()=>{const F=(A.members.length?A.members.map(z=>z.id):[A.id]).filter(z=>t.has(z));return F.length?u.jsx("button",{"data-dismiss":A.id,"data-help-id":"node-dismiss",title:F.length>1?`Remove all ${F.length} selected classes in ${A.label}`:`Remove ${A.label} from the canvas`,onClick:z=>{z.stopPropagation(),F.forEach(Z=>s?.(Z))},className:`text-[10px] leading-none px-1 rounded text-gray-400
                                         hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/40`,children:"✕"}):null})()]})]}),A.relationGroups.length>0&&u.jsx("div",{"data-help-id":"relation-bar",className:`flex items-center gap-1 px-2 border-b overflow-hidden
                                     border-gray-200 dark:border-slate-600
                                     bg-sky-50/60 dark:bg-sky-950/30`,style:{height:Is},children:u.jsx(lm,{label:A.label,rows:A.relationRows,onAdd:M=>i?.(M),onRemove:M=>s?.(M),onInspect:n,colorOf:m,slotOrder:A.allRows.map(M=>M.slot),parentOf:M=>e.getClassSummary(M)?.parentId})}),A.rows.map(M=>M.header?u.jsx("div",{"data-no-drag":!0,"data-help-id":Cc(M.header.id),title:`${M.header.label} — is a ${A.label}; click for details`,onClick:F=>{F.stopPropagation(),n?.(M.header.id)},className:`flex items-center px-2 text-[10px] font-semibold
                                     cursor-pointer hover:brightness-110`,style:{height:ht,background:M.header.color.fill,color:ac},children:u.jsx("span",{className:"truncate",children:M.header.label})},M.slot):u.jsxs("div",{"data-help-id":Ec(A,M),"data-expandable":Ne(M)?"":void 0,"data-no-drag":Ne(M)?"":void 0,title:(M.channel==="plain"?`${M.slot}: ${M.range}`:`${M.slot} → ${M.range} (${M.cardinality})${M.flipped?" — owner side":""}`+(Ne(M)?` — click to add ${M.range}`:""))+((M.owners?.length??0)>1?`
also declared by ${M.owners.slice(1).map(F=>F.label).join(", ")}`:""),onClick:Ne(M)?F=>{F.stopPropagation(),i?.(M.range)}:void 0,className:`flex items-center gap-1.5 px-2 text-[11px] ${M.targetColor?"":M.connected?"text-gray-700 dark:text-gray-300":"text-gray-400 dark:text-gray-500"} ${Ne(M)?"cursor-pointer hover:bg-sky-50 dark:hover:bg-sky-900/30 hover:text-sky-700 dark:hover:text-sky-300":""}`,style:{height:ht,...M.targetColor?{color:M.targetColor.text}:{}},children:[u.jsx("span",{className:"w-1.5 h-1.5 rounded-full shrink-0 border",style:{borderColor:M.rangeColor,background:M.connected?M.rangeColor:"transparent"}}),u.jsx("span",{className:`truncate ${A.members.length&&!M.owners?.length?`font-semibold ${M.targetColor?"":"text-gray-900 dark:text-gray-100"}`:""}`,children:M.slot}),M.isLoop&&u.jsx(km,{title:`self-referential: a ${M.range} can own another ${M.range} via ${M.slot}`}),u.jsxs("span",{className:"ml-auto text-[9px] truncate max-w-[90px]",children:[u.jsx("span",{style:{color:M.rangeColor},children:M.range}),u.jsxs("span",{className:"text-gray-400 dark:text-gray-500",children:[" ",M.cardinality]})]})]},M.declaringClass?`${M.declaringClass}|${M.slot}`:M.slot)),A.hiddenCount>0&&u.jsx("button",{className:"w-full text-left px-2 text-[10px] text-sky-600 dark:text-sky-400 hover:underline",style:{height:Ml},title:`${Xt} without an edge on the current canvas, plus plain (non-entity) ${Xt}`,onClick:M=>{M.stopPropagation(),pe(A.id)},children:A.expanded?`− fewer ${Xt}`:`+ ${A.hiddenCount} more ${Xt}`})]},A.id)})})]})})})})]})}function Nm({classId:e,dataService:t,onClose:n,onNavigate:i,isSelected:s,onToggleSelect:o}){const r=y.useMemo(()=>t.getClassSummary(e),[e,t]),[a,l]=y.useState([]),c=y.useCallback(d=>{d!==e&&(l(g=>[...g,e]),i(d))},[e,i]),h=y.useCallback(()=>{l(d=>d.length===0?d:(i(d[d.length-1]),d.slice(0,-1)))},[i]);y.useEffect(()=>{const d=g=>{g.key==="Escape"&&n()};return window.addEventListener("keydown",d),()=>window.removeEventListener("keydown",d)},[n]);const f=t.getTypeLabel("slot",!0);return u.jsxs("aside",{className:`w-96 shrink-0 flex flex-col min-h-0 border-l border-gray-200 dark:border-slate-700
                 bg-white dark:bg-slate-900`,"aria-label":"Entity details",children:[u.jsxs("header",{className:`flex items-start gap-2 px-3 py-2 border-b border-gray-200 dark:border-slate-700
                   bg-gray-50 dark:bg-slate-800 shrink-0`,children:[a.length>0&&u.jsx("button",{onClick:h,className:"text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-sm mt-0.5",title:"Back",children:"←"}),u.jsxs("div",{className:"flex-1 min-w-0",children:[u.jsxs("div",{className:"font-semibold text-sm text-blue-700 dark:text-blue-300 break-words",children:[r?.name??e,r?.isAbstract&&u.jsx("span",{className:"ml-1 text-xs text-purple-500 italic",children:"(abstract)"})]}),r?.parentId&&u.jsxs("div",{className:"text-xs text-gray-400",children:["is a"," ",u.jsx("button",{onClick:()=>c(r.parentId),className:"text-blue-600 dark:text-blue-400 hover:underline",children:r.parentId})]})]}),u.jsx("button",{onClick:n,className:"text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-sm px-1",title:"Close (Esc)",children:"✕"})]}),r?u.jsxs("div",{className:"flex-1 overflow-y-auto min-h-0 px-3 py-2 space-y-3",children:[u.jsx("button",{onClick:()=>o(e),className:`w-full px-2 py-1 text-xs rounded border ${s?"border-blue-500 bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300":"border-gray-300 dark:border-slate-600 hover:border-blue-400 text-gray-600 dark:text-gray-300"}`,children:s?"✓ In diagram — click to remove":"+ Add to diagram"}),r.description&&u.jsx("p",{className:"text-xs text-gray-600 dark:text-gray-300 leading-relaxed",children:r.description}),r.referencedBy.length>0&&u.jsxs("section",{children:[u.jsxs(vr,{children:["Referenced by (",r.referencedBy.length,")"]}),u.jsx("ul",{className:"space-y-0.5",children:r.referencedBy.map((d,g)=>u.jsxs("li",{className:"text-xs",children:[u.jsx("button",{onClick:()=>c(d.classId),className:"text-blue-600 dark:text-blue-400 hover:underline cursor-pointer",children:d.classId}),u.jsxs("span",{className:"text-gray-400",children:[".",d.slotName]})]},`${d.classId}.${d.slotName}-${g}`))})]}),r.slots.length>0&&u.jsxs("section",{children:[u.jsxs(vr,{children:[f," (",r.slots.length,")"]}),u.jsx("ul",{className:"divide-y divide-gray-100 dark:divide-slate-700",children:r.slots.map((d,g)=>u.jsxs("li",{className:"py-1.5",children:[u.jsxs("div",{className:"flex items-baseline gap-1.5 flex-wrap",children:[u.jsx("span",{className:"text-xs font-medium text-gray-800 dark:text-gray-100",children:d.name}),u.jsx(Vm,{range:d.range,onNavigate:c,dataService:t})]}),d.description&&u.jsx("p",{className:"mt-0.5 text-[11px] text-gray-500 dark:text-gray-400 leading-snug break-words",children:d.description})]},`${d.name}-${g}`))})]})]}):u.jsxs("div",{className:"p-3 text-xs text-gray-500",children:["Entity not found: ",e]})]})}function vr({children:e}){return u.jsx("div",{className:"text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-1",children:e})}function Vm({range:e,onNavigate:t,dataService:n}){const i=n.itemExists(e)&&!e.endsWith("Enum"),r=`inline-block px-1 py-0 rounded text-[11px] font-medium ${new Set(["string","integer","boolean","float","double","decimal","date","datetime","time","uri","uriorcurie","ncname"]).has(e.toLowerCase())?"bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300":e.endsWith("Enum")?"bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300":"bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"}`;return i?u.jsx("button",{onClick:()=>t(e),className:`${r} hover:underline cursor-pointer`,children:e}):u.jsx("span",{className:r,children:e})}const Im=[{heading:"One rule at a time",cases:[{name:"Rule 1 — multivalued owns forward",note:"A multivalued slot means the owner has-a collection, so ownership runs forward: Questionnaire.items and ResearchStudy.consents. The two `part_of` self-loops are the counterexample — multivalued but drawn backward, because they walk UP a tree.",sel:["ResearchStudy","Consent","Questionnaire","QuestionnaireItem"]},{name:"Rule 2 — single-valued belongs backward",note:"The largest group (70 edges). Participant fans OUT to 22 targets, nearly all reversed: each target declares `associated_participant` and is drawn as belonging to Participant. This is the group that would move if own-bkwd merges into association.",sel:["Participant","Condition","Demography","Exposure","Procedure","Visit"]},{name:"Exception 2a — no independent existence",note:"Single-valued, but forward anyway: Quantity, TimePoint and the like have no identity of their own, so the value belongs to whoever holds it rather than owning the holder.",sel:["SpecimenStorageActivity","Quantity","TimePoint","Activity"]},{name:"Entity-ranged — always forward",note:"The twelve focus / associated_evidence slots range on Entity, the universal root. A pointer AT the root is never a foreign key back to an owner, so these run forward whatever their cardinality. Both single- and multi-valued focus sites are here — all should point AT Entity.",sel:["Observation","ObservationSet","MeasurementObservation","Document","Condition","SdohObservation","Entity"]},{name:"Association — no ownership claim",note:"Both associations in the schema: Document.related_document → Specimen, and SpecimenContainer.container → SpecimenStorageActivity. Slate and dashed, arrowed at both ends. They are listed explicitly because they are multivalued, so Rule 1 would otherwise call them ownership.",sel:["Document","Specimen","SpecimenContainer","SpecimenStorageActivity"]},{name:"Self-loops",note:"The five self-owning slots (TimePoint.index_time_point, File.derived_from, Specimen.parent_specimen, ResearchStudy.part_of, SpecimenContainer.parent_container) — loop markers, not routed edges. ResearchStudy also pulls in its TimePoint edges; the loops are the circular arrows on the rows.",sel:["TimePoint","File","Specimen","ResearchStudy","SpecimenContainer"]}]},{heading:"Inheritance (merged sibling boxes)",cases:[{name:"One child, merged with its parent",note:"MeasurementObservation alone. It still merges: the box is titled Observation, its 13 inherited rows sit at the top in black, and MeasurementObservation's own 9 follow under its coloured header. Merging does not wait for a second sibling — a class must not change shape because of what else you happen to select.",sel:["MeasurementObservation"]},{name:"Children that add nothing",note:'SpecimenQuality- and SpecimenQuantityObservation declare no slots of their own. Both still get a header under the shared rows, because "this subclass adds nothing" is the answer to what they are — and without the headers the selection would leave no trace in the box at all.',sel:["SpecimenQualityObservation","SpecimenQuantityObservation"]},{name:"slot_usage — same name, different type",note:"QuestionnaireResponseValue's five children each narrow `value` to a different type (boolean, decimal, integer, TimePoint, and the parent's string). That narrowing is the entire reason the five classes exist, so each keeps its OWN row rather than merging into the parent's — the one place a shared row would be a lie.",sel:["QuestionnaireResponseValueBoolean","QuestionnaireResponseValueDecimal","QuestionnaireResponseValueInteger","QuestionnaireResponseValueString","QuestionnaireResponseValueTimePoint"]},{name:"The full Observation family",note:"All five Observation subclasses plus the parent. One box where there would be six, and the shared rows are stated once. Note each edge leaves in the colour of the child that owns its row; inherited slots' edges are the parent's and are drawn once, not once per child.",sel:["Observation","MeasurementObservation","SdohObservation","DimensionalObservation","SpecimenQualityObservation","SpecimenQuantityObservation"]}]},{heading:"The bare diagonal",cases:[{name:"BodySite 6-way (the original)",note:"The reproducer from the handoff. In ⌙ (bend) the top approach arrives as a straight diagonal with no steps; in ⋙ (near) it keeps its horizontal run. This is the case the fix has to fix.",sel:["BodySite","Condition","Consent","Demography","Exposure","Observation","Procedure","ImagingFile","ImagingStudy","MeasurementObservation","SpecimenCreationActivity"]},{name:"BodySite, owners only",note:"The same convergence with nothing else on canvas — six owners, no unrelated boxes for a diagonal to cut across. Shows whether the degeneracy is about the convergence itself or about crowding.",sel:["BodySite","Condition","ImagingFile","ImagingStudy","MeasurementObservation","Procedure","SpecimenCreationActivity"]},{name:"TimePoint 16-edge",note:"Densest corridor in the schema: 8 owners but 16 slot-edges, since each Specimen*Activity owns date_started and date_ended. Also where the second-from-top edge goes diagonal and pair edges cross.",sel:["TimePoint","Consent","ResearchStudy","TimePeriod","SpecimenCreationActivity","SpecimenProcessingActivity","SpecimenStorageActivity","SpecimenTransportActivity","QuestionnaireResponseValueTimePoint"]},{name:"TimePoint + Person (crossing)",note:"Siggie's repro for the crossing bug: the paired date_started / date_ended edges from different owners cross each other on the way in. Compare pair ordering against the case above.",sel:["TimePoint","Person","Consent","ResearchStudy","TimePeriod","SpecimenCreationActivity","SpecimenProcessingActivity","SpecimenStorageActivity","SpecimenTransportActivity","QuestionnaireResponseValueTimePoint"]}]},{heading:"Pathological convergences",cases:[{name:"Quantity 19-edge (worst case)",note:"The largest convergence in the schema: 16 owning classes, 19 slot-edges. The fan is squeezed hardest here, so ENTITY_FAN_GAP and the merge distance both show their limits.",sel:["Quantity","Activity","Assay","DeviceExposure","DimensionalObservation","DrugExposure","MeasurementObservation","Observation","Procedure","SdohObservation","SpecimenCreationActivity","SpecimenProcessingActivity","SpecimenQualityObservation","SpecimenQuantityObservation","SpecimenStorageActivity","SpecimenTransportActivity","Substance"]},{name:"Context 6-way (uniform owners)",note:"Six owners that are all observation classes — same size, same shape, similar row counts. The controlled comparison for BodySite, whose owners vary wildly in height.",sel:["Context","DimensionalObservation","MeasurementObservation","Observation","SdohObservation","SpecimenQualityObservation","SpecimenQuantityObservation"]},{name:"Two convergences at once",note:"Quantity and TimePoint both converge from the same Specimen activity classes, so two corridors compete for the same space. Where merge distance trades off against crossings.",sel:["Quantity","TimePoint","SpecimenCreationActivity","SpecimenProcessingActivity","SpecimenStorageActivity","SpecimenTransportActivity"]}]},{heading:"Flipped divergences (found via the legend)",cases:[{name:"Participant 22-way (largest fan in the schema)",note:"Bigger than any inbound convergence: 22 edges leaving Participant, 21 of them FLIPPED. Flipped edges keep their attribute-row anchor and must not merge, so this is the fan the merge code deliberately does not touch — and therefore the one nothing has been tuned against.",sel:["Participant","Condition","Consent","Demography","DeviceExposure","DrugExposure","Exposure","File","ImagingStudy","MeasurementObservation","Observation","Procedure","SdohObservation","Specimen","Visit"]},{name:"Visit 19-way",note:"The same shape one size down, and it overlaps Participant heavily — most classes carry both associated_participant and associated_visit, so the two fans run through the same corridor as pairs.",sel:["Visit","Condition","Demography","DeviceExposure","DrugExposure","Exposure","ImagingStudy","MeasurementObservation","Observation","Procedure","QuestionnaireResponse","SdohObservation","TimePeriod"]},{name:"Participant + Visit + Organization",note:"All three FK hubs at once (22 + 19 + 11 edges, nearly all flipped). The densest picture the schema can produce, and the stress test for anything that changes routing.",sel:["Participant","Visit","Organization","Condition","Demography","DimensionalObservation","MeasurementObservation","Observation","ObservationSet","Procedure","SdohObservation","SpecimenQualityObservation","SpecimenQuantityObservation"]},{name:"Converge and diverge at once",note:"MeasurementObservation owns BodySite/Context/Quantity while being owned by Participant/Visit/Organization — edges fan IN and OUT of the same box. Where merged (entity-end) and unmerged (flipped) arrivals sit side by side.",sel:["MeasurementObservation","BodySite","Context","Quantity","Participant","Visit","Organization","MeasurementObservationSet"]}]},{heading:"Normal cases (a fix must not break these)",cases:[{name:"Single edge",note:"One owner, one edge, no convergence at all — merging is a no-op. The floor: if this looks wrong, something basic broke.",sel:["Visit","TimePeriod"]},{name:"Two owners",note:"The smallest real convergence. Two approaches, one arrowhead — the fan is barely a fan, so a merge distance that is too long is obvious here first.",sel:["Participant","Visit","ObservationSet"]},{name:"Specimen chain (deep, not wide)",note:"A long ownership chain rather than a convergence: many layers, few edges per node. Checks that tuning for convergences has not made ordinary edges worse.",sel:["Specimen","SpecimenContainer","SpecimenCreationActivity","SpecimenProcessingActivity","SpecimenStorageActivity","SpecimenTransportActivity","Participant"]},{name:"The known 3-node cycle",note:"Specimen -> SpecimenStorageActivity -> SpecimenContainer -> Specimen: an association plus two ownership edges. Known and deliberately unhandled; here so it stays visible.",sel:["Specimen","SpecimenStorageActivity","SpecimenContainer"]},{name:"Backward ownership (own-bkwd)",note:"Slots drawn backward (performed_by, associated_person, contained_in, related_imaging_study). These keep their attribute-row anchor and must NOT merge — check the arrowheads.",sel:["Organization","Person","Participant","ImagingFile","ImagingStudy","SpecimenContainer","Specimen"]},{name:"Path to root",note:"Path-to-root on from a single deep class, which pulls in every owner up the chain. The biggest graph reachable in one click.",sel:["MeasurementObservation"],roots:!0}]}],Bm=3,fi=40;function $l(){const[e,t]=y.useState(null),n=y.useCallback(s=>{if(s.button!==0||s.target.closest('button, a, input, select, textarea, [role="button"], [data-no-drag]'))return;const r=(s.currentTarget.closest("[data-draggable]")??s.currentTarget).getBoundingClientRect(),a=s.clientX,l=s.clientY,c={left:r.left,top:r.top},h=s.currentTarget;h.setPointerCapture(s.pointerId);let f=!1;const d=p=>{const b=p.clientX-a,m=p.clientY-l;if(!f&&Math.hypot(b,m)<Bm)return;f=!0;const w={left:Math.max(Math.min(c.left+b,window.innerWidth-fi),fi-r.width),top:Math.min(Math.max(c.top+m,0),window.innerHeight-fi)};t(w)},g=p=>{h.releasePointerCapture(p.pointerId),h.removeEventListener("pointermove",d),h.removeEventListener("pointerup",g),h.removeEventListener("pointercancel",g)};h.addEventListener("pointermove",d),h.addEventListener("pointerup",g),h.addEventListener("pointercancel",g)},[]),i=y.useCallback(()=>t(null),[]);return{offset:e,onPointerDown:n,reset:i}}function Fl({title:e,subtitle:t,onClose:n,offset:i,children:s}){const o=$l();y.useEffect(()=>{const a=l=>{l.key==="Escape"&&n()};return window.addEventListener("keydown",a),()=>window.removeEventListener("keydown",a)},[n]);const r=o.offset!==null;return u.jsxs("div",{"data-draggable":"",style:{resize:"both",...o.offset?{position:"fixed",...o.offset,right:"auto"}:{}},className:`z-30 w-[26rem] max-h-[80vh] overflow-y-auto
                  rounded-lg border border-gray-300 dark:border-slate-600
                  bg-white dark:bg-slate-800 shadow-xl
                  text-gray-900 dark:text-gray-100
                  ${r?"":`absolute top-14 ${i?"right-[27rem]":"right-4"}`}`,children:[u.jsxs("div",{onPointerDown:o.onPointerDown,className:`sticky top-0 flex items-baseline justify-between gap-2 px-4 py-2
                   border-b border-gray-200 dark:border-slate-700
                   bg-white dark:bg-slate-800 cursor-grab active:cursor-grabbing
                   select-none`,children:[u.jsxs("div",{children:[u.jsx("h2",{className:"text-sm font-semibold",children:e}),t&&u.jsx("p",{className:"text-[11px] text-gray-500 dark:text-gray-400",children:t})]}),u.jsxs("div",{className:"flex items-center gap-1 shrink-0",children:[r&&u.jsx("button",{onClick:o.reset,title:"Put it back",className:`text-gray-400 hover:text-gray-700 dark:hover:text-gray-200
                         text-xs leading-none px-1`,children:"⤺"}),u.jsx("button",{onClick:n,title:"Close (Esc)",className:"text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-lg leading-none",children:"×"})]})]}),u.jsx("div",{className:"px-4 py-2",children:s})]})}function $m(e,t){return e.sel.length===t.size&&e.sel.every(n=>t.has(n))}function Fm({onClose:e,onApply:t,selectedIds:n,dataService:i,offset:s}){const o=y.useMemo(()=>i.getConvergenceRanking(),[i]),r=y.useMemo(()=>i.getDivergenceRanking(),[i]),a=l=>t({name:"ad hoc",note:"",sel:l});return u.jsxs(Fl,{title:"Example cases",subtitle:"Selections worth looking at, simple to dense.",onClose:e,offset:s,children:[u.jsxs("section",{className:"mb-4",children:[u.jsx(kr,{children:"Biggest fans"}),u.jsx("p",{className:"text-[11px] text-gray-500 dark:text-gray-400 mb-1.5",children:"Counted in slot-edges, not classes: one class owning a target through two slots crowds the corridor twice. Click a row to load just that fan."}),u.jsx("div",{className:"grid grid-cols-2 gap-3",children:[["Converging (in)",o.slice(0,6).map(l=>({entity:l.entity,n:l.edgeCount,peers:l.owners,flipped:0}))],["Diverging (out)",r.slice(0,6).map(l=>({entity:l.entity,n:l.edgeCount,peers:l.owned,flipped:l.flippedCount}))]].map(([l,c])=>u.jsxs("div",{children:[u.jsx("h4",{className:"text-[10px] font-medium text-gray-500 dark:text-gray-400 mb-0.5",children:l}),u.jsx("ul",{className:"space-y-0.5",children:c.map(h=>u.jsx("li",{children:u.jsxs("button",{onClick:()=>a([h.entity,...h.peers]),title:`Select ${h.entity} and all ${h.peers.length} peers`,className:"w-full text-left text-xs hover:bg-gray-50 dark:hover:bg-slate-700 rounded px-1",children:[u.jsx("span",{className:"text-blue-600 dark:text-blue-400",children:h.entity}),u.jsxs("span",{className:"text-gray-400 ml-1",children:[h.n,h.flipped>0?` (${h.flipped} flipped)`:""]})]})},h.entity))})]},l))})]}),Im.map(l=>u.jsxs("section",{className:"mb-3 last:mb-1",children:[u.jsx(kr,{children:l.heading}),u.jsx("ul",{className:"space-y-1.5",children:l.cases.map(c=>{const h=$m(c,n);return u.jsx("li",{children:u.jsxs("button",{onClick:()=>t(c),className:`block w-full text-left rounded px-2 py-1 border
                      ${h?"border-blue-500 bg-blue-50 dark:bg-blue-950":"border-transparent hover:bg-gray-50 dark:hover:bg-slate-700"}`,children:[u.jsx("span",{className:`text-xs font-medium ${h?"text-blue-700 dark:text-blue-300":"text-blue-600 dark:text-blue-400"}`,children:c.name}),u.jsxs("span",{className:"ml-1.5 text-[10px] text-gray-400",children:[c.sel.length,c.roots?" ⇱":""]}),u.jsx("p",{className:"text-[11px] leading-snug text-gray-600 dark:text-gray-400 mt-0.5",children:c.note})]})},c.name)})})]},l.heading))]})}function kr({children:e}){return u.jsx("h3",{className:`text-[11px] font-semibold uppercase tracking-wider
                   text-gray-400 dark:text-gray-500 mb-1`,children:e})}const Sr={"own-fwd":{text:"owns (forward)",color:Te.ownFwd},"own-bkwd":{text:"belongs to (backward)",color:Te.ownBkwd},association:{text:"association (no ownership)",color:Te.association},excluded:{text:"dropped",cls:"text-gray-400 dark:text-gray-500 border-gray-300"}},_m=[{kind:"own-fwd",color:Te.ownFwd,title:ne.kinds["own-fwd"].label,body:"The arrow runs from the owner to what it holds. A owns B when the schema puts the collection on A, or when B has no independent existence — a Quantity of 5 mg is not something you look up."},{kind:"own-bkwd",color:Te.ownBkwd,title:ne.kinds["own-bkwd"].label,body:'The same relationship stored at the other end: A carries a pointer to one B that exists without it. Drawn B → A, so you still read "start at B to find A". A Participant carries on existing whether or not any observation points at it.'},{kind:"association",color:Te.association,title:ne.kinds.association.label,body:"Neither owns the other. Dashed, with arrowheads at both ends. Only two edges in the schema are this — a slot the ownership rules would otherwise claim, wrongly."}],Hm=[{glyph:"⇱ roots",what:"Also draw everything on the path up to a root."},{glyph:"LR / TB",what:"Lay the diagram out left-to-right or top-down."},{glyph:"⋙ ⋙⋙ ⌙ ≡",what:"Where converging edges join before their shared arrowhead — near the box, early, at the last corner, or not at all. Temporary, for picking one by eye."},{glyph:"+ − 1:1 ⛶",what:"Zoom in, out, reset, fit to view."}],zm=[["0..1","optional, at most one"],["1..1","required, exactly one"],["0..*","optional, any number"],["1..*","required, one or more"]];function Wm({dataService:e,onClose:t,onSelect:n,offset:i}){const s=y.useMemo(()=>e.getOwnershipPairGroups(),[e]),[o,r]=y.useState(null),a=l=>u.jsx("button",{onClick:()=>n([l]),className:"hover:underline text-blue-600 dark:text-blue-400",title:`Select ${l}`,children:l});return u.jsx(Fl,{title:"Ownership legend",subtitle:"What the diagram's arrows, colors and buttons mean.",onClose:t,offset:i,children:u.jsxs("div",{className:"text-xs",children:[u.jsxs(Dt,{title:"The three kinds of relationship",children:[u.jsxs("p",{className:"text-[11px] text-gray-500 dark:text-gray-400 mb-2",children:["Every edge is a class-valued attribute. Classes are placed so that if ",u.jsx("b",{children:"A"})," is drawn before ",u.jsx("b",{children:"B"}),", you reach ",u.jsx("b",{children:"B"})," through"," ",u.jsx("b",{children:"A"})," — so an edge always tells you where to start."]}),u.jsx("ul",{className:"space-y-2",children:_m.map(l=>u.jsxs("li",{className:"flex gap-2",children:[u.jsx(In,{kind:l.kind,className:"mt-0.5"}),u.jsxs("div",{className:"min-w-0",children:[u.jsx("div",{className:"font-medium",style:{color:l.color},children:l.title}),u.jsx("p",{className:"text-[11px] leading-snug text-gray-600 dark:text-gray-400",children:l.body})]})]},l.title))}),u.jsxs("p",{className:"text-[11px] leading-snug text-gray-500 dark:text-gray-400 mt-2",children:["An edge leaves the ",u.jsx("b",{children:"attribute's row"}),", not the box — that is how you tell which attribute made it. A ",u.jsx("b",{children:"⟲"})," on a row is a slot pointing back at its own class."]}),u.jsxs("p",{className:"text-[11px] leading-snug text-gray-500 dark:text-gray-400 mt-2",children:["Owners are drawn first, so a box's ",u.jsx("b",{children:"← N"})," counts what it belongs to (on its left) and ",u.jsx("b",{children:"M →"})," what it owns (on its right). Hover either to list them. The little edge on each row is the one above: it says which end holds the arrowhead, and so which entity declares the attribute — and ",u.jsx("i",{children:"both"})," kinds turn up on ",u.jsx("i",{children:"both"})," sides."]})]}),u.jsxs(Dt,{title:"Colors",children:[u.jsx(Tr,{caption:"A row's dot and its range label say what KIND of thing the attribute points at.",items:[{color:ze.entity,label:"another entity"},{color:ze.enum,label:"a value set"},{color:ze.dataType,label:"a data type"}]}),u.jsxs("p",{className:"text-[11px] leading-snug text-gray-600 dark:text-gray-400 mt-2",children:["A ",u.jsx("b",{children:"filled"})," dot draws an edge; a ",u.jsx("b",{children:"hollow"})," one does not, because what it points at is not on the canvas. Only entity ranges can draw edges at all."]}),u.jsx(Tr,{className:"mt-3",caption:"Inside a merged box, a color says which entity an attribute belongs to.",items:Ir.slice(0,4).map((l,c)=>({color:l.text,swatch:l.fill,label:c===0?"the parent":`child ${c}`}))})]}),u.jsx(Dt,{title:"Cardinality",children:u.jsx("ul",{className:"flex flex-wrap gap-x-4 gap-y-1",children:zm.map(([l,c])=>u.jsxs("li",{className:"flex items-center gap-1.5",children:[u.jsx("span",{className:"font-mono text-[11px] text-gray-700 dark:text-gray-300",children:l}),u.jsx("span",{className:"text-[11px] text-gray-500 dark:text-gray-400",children:c})]},l))})}),u.jsx(Dt,{title:"The toolbar",children:u.jsx("ul",{className:"space-y-1",children:Hm.map(l=>u.jsxs("li",{className:"flex gap-2",children:[u.jsx("span",{className:"shrink-0 font-mono text-[11px] text-gray-700 dark:text-gray-300 w-20",children:l.glyph}),u.jsx("span",{className:"text-[11px] leading-snug text-gray-600 dark:text-gray-400",children:l.what})]},l.glyph))})}),u.jsxs(Dt,{title:"Every relationship, by rule",children:[u.jsx("p",{className:"text-[11px] text-gray-500 dark:text-gray-400 mb-1.5",children:"Derived live from the classifier the graph itself uses, so this cannot drift from what is drawn. Overrides and value-object membership are hand-curated — if a pair looks wrong, the classification is. Click any class to select it."}),u.jsx("ul",{className:"space-y-1",children:s.map(l=>{const c=`${l.verdict}/${l.rule}`,h=Sr[l.verdict]??Sr.excluded,f=o===c;return u.jsxs("li",{className:"border-l-2 pl-2 border-gray-200 dark:border-slate-600",children:[u.jsxs("button",{onClick:()=>r(f?null:c),className:"w-full text-left",children:[u.jsx("span",{className:`inline-block px-1 rounded border text-[10px] ${h.cls??""}`,style:h.color?{color:h.color,borderColor:h.color}:void 0,children:h.text}),u.jsx("span",{className:"ml-1.5 font-medium",children:l.rule}),u.jsx("span",{className:"ml-1 text-gray-400",children:l.pairs.length}),u.jsx("span",{className:"ml-1 text-gray-400",children:f?"▾":"▸"})]}),u.jsx("p",{className:"text-[11px] leading-snug text-gray-600 dark:text-gray-400 mt-0.5",children:l.ruleText}),f&&u.jsx("ul",{className:"mt-1 mb-1.5 space-y-0.5 font-mono text-[10px]",children:l.pairs.map(d=>u.jsxs("li",{className:"text-gray-600 dark:text-gray-400",children:[a(d.declaredOn),u.jsxs("span",{className:"text-gray-400",children:[".",d.slotName]}),u.jsx("span",{className:"mx-1 text-gray-400",children:d.multivalued?"↠":"→"}),a(d.range),d.isLoop&&u.jsx("span",{className:"ml-1",style:{color:ze.entity},children:"loop"}),(l.verdict==="own-bkwd"||l.verdict==="association")&&u.jsxs("span",{className:"ml-1 text-gray-400",children:["(owner: ",d.owner,")"]})]},`${d.declaredOn}.${d.slotName}`))})]},c)})})]}),u.jsxs("p",{className:"text-[10px] text-gray-400 dark:text-gray-500 mt-3",children:["A box's ",u.jsx("b",{children:"“N related”"})," count is of distinct classes"," ",u.jsx("i",{children:"outside"})," it, so selecting a class that folds into a merged box can make the number go ",u.jsx("i",{children:"down"}),". Correct, if counter-intuitive."]})]})})}function Dt({title:e,children:t}){return u.jsxs("section",{className:"mb-4 last:mb-1",children:[u.jsx("h3",{className:`text-[11px] font-semibold uppercase tracking-wider
                     text-gray-400 dark:text-gray-500 mb-1`,children:e}),t]})}function Tr({caption:e,items:t,className:n}){return u.jsxs("div",{className:n,children:[u.jsx("p",{className:"text-[11px] text-gray-500 dark:text-gray-400 mb-1",children:e}),u.jsx("ul",{className:"flex flex-wrap gap-x-3 gap-y-1",children:t.map(i=>u.jsxs("li",{className:"flex items-center gap-1",children:[u.jsx("span",{className:"inline-block w-3 h-3 rounded-sm border",style:{background:i.swatch??i.color,borderColor:i.color}}),u.jsx("span",{className:"text-[11px]",style:{color:i.color},children:i.label})]},i.label))})]})}const Gm=!1,Um=!1,_l=y.createContext(null);function ut(){const e=y.useContext(_l);if(!e)throw new Error("useHelp must be used inside <HelpProvider>");return e}const Km=300,qm=[{id:"graph-canvas-reading",label:"Reading the diagram"},{id:"relation-bar",label:"The relation bar"},{id:"merged-boxes",label:"Inheritance and merged boxes"},{id:"node-dismiss",label:"Closing a box"},{id:"copy-link",label:"Sharing what you see"}];function Qm({onOpenLegend:e,onOpenCases:t,legendOpen:n,casesOpen:i,onClosePanels:s,anyPanelOpen:o}){const{showEntry:r,showAddresses:a,toggleAddresses:l}=ut(),[c,h]=y.useState(!1),f=y.useRef(void 0),d=()=>{f.current!==void 0&&(clearTimeout(f.current),f.current=void 0)},g=()=>{d(),f.current=setTimeout(()=>h(!1),Km)};y.useEffect(()=>d,[]),y.useEffect(()=>{if(!c)return;const b=w=>{w.target?.closest("[data-help-menu]")||h(!1)},m=w=>{w.key==="Escape"&&h(!1)};return document.addEventListener("mousedown",b,!0),document.addEventListener("keydown",m),()=>{document.removeEventListener("mousedown",b,!0),document.removeEventListener("keydown",m)}},[c]);const p=b=>()=>{h(!1),b()};return u.jsxs("span",{"data-help-menu":!0,"data-help-id":"help-menu",className:"relative",onMouseEnter:()=>{d(),h(!0)},onMouseLeave:g,children:[u.jsxs("button",{onClick:()=>h(b=>!b),title:"Legend, example cases and help topics",className:`text-sm underline hover:text-white ${c?"text-white":"text-blue-100"}`,children:["Help ",u.jsx("span",{"aria-hidden":!0,className:"opacity-70",children:"▾"})]}),c&&u.jsxs("div",{className:`absolute right-0 top-full mt-1 z-40 w-60 py-1
                     rounded-md border border-gray-300 dark:border-slate-600
                     bg-white dark:bg-slate-800 shadow-xl
                     text-gray-900 dark:text-gray-100`,children:[u.jsxs(fn,{onClick:p(e),children:[n?"Hide ownership legend":"Ownership legend",u.jsx(pi,{children:"every relationship in the schema, by rule"})]}),u.jsxs(fn,{onClick:p(t),children:[i?"Hide example cases":"Example cases",u.jsx(pi,{children:"selections worth looking at"})]}),o&&u.jsxs(fn,{onClick:p(s),children:["Close all panels",u.jsx(pi,{children:"legend, cases and the detail drawer"})]}),u.jsx(Ym,{}),qm.map(b=>u.jsx(fn,{onClick:p(()=>r(b.id)),children:b.label},b.id)),Um]})]})}function fn({onClick:e,children:t}){return u.jsx("button",{onClick:e,className:`block w-full text-left px-3 py-1.5 text-xs
                 hover:bg-gray-100 dark:hover:bg-slate-700`,children:t})}function pi({children:e}){return u.jsx("span",{className:"block text-[10px] text-gray-400 dark:text-gray-500",children:e})}function Ym(){return u.jsx("div",{className:"my-1 border-t border-gray-200 dark:border-slate-700"})}function Hl(e){const t=Number(e?.trim());return Number.isFinite(t)&&t>=240?t:void 0}function zl(e){const t=e?.trim().toLowerCase();return t==="dim"||t==="ring"||t==="none"?t:void 0}function Wl(e){const t=e?.trim().toLowerCase();return t==="left"||t==="right"||t==="top"||t==="bottom"?t:void 0}function Gl(e){const t=e?.trim();if(!t)return;const n=Number(t);if(Number.isFinite(n))return{px:n};const i=t.match(/^(-)?(?:anchor|parentBox)\.(width|height)(?:\s*\*\s*(-?[\d.]+))?$/i);if(!i)return;const[,s,o,r]=i,a=r===void 0?1:Number(r);if(Number.isFinite(a))return{of:o.toLowerCase(),times:s?-a:a}}function Wt(e,t){const n=e?.trim();if(!n)return{kind:"help-id",arg:t};if(n==="none")return{kind:"none"};const i=n.indexOf(":");return i===-1?{kind:"help-id",arg:n}:{kind:n.slice(0,i).trim(),arg:n.slice(i+1).trim()}}const Xm="Format",Zm="Walkthrough",Jm=new Set([Xm,"TODO"]),Ul=/^<\/?(?:details|summary)\b[^>]*>$/i;function xe(e,t){const n=t.toLowerCase();for(const i of e){const s=Pt(i);if(s){if(s.name==="beats"&&n!=="beats")return;if(s.name===n&&!s.parked)return s.value}}}function Pt(e){const t=e.trimStart().match(/^-\s+(.*)$/);if(!t)return;let n=t[1].replace(/\*\*/g,"").trim(),i=!1;if(n.startsWith("~~")){const r=n.indexOf("~~",2);if(r===-1)return;i=!0,n=r===n.length-2?n.slice(2,r):`${n.slice(2,r)}${n.slice(r+2)}`}const s=n.indexOf(":");if(s===-1)return;const o=n.slice(0,s).trim();if(/^[A-Za-z_][A-Za-z0-9_]*$/.test(o))return{name:o.toLowerCase(),value:n.slice(s+1).trim(),parked:i}}const Bs=e=>{const t=Pt(e);return t&&!t.parked?t.name:void 0},eg=new Set(["title","description","interactions","shortcut","context","anchor","spotlight","action","once","change","only","highlight","width","position","offsetx","tour","beats"]),tg=new Set(["description","anchor","spotlight","action","change","only","highlight","width","position","offsetx","keep"]),ng=new Set(["tourmetadata","tourabbr","description"]);function Kl(e,t,n,i){for(const s of e){if(!Gn(s))continue;const o=Pt(s);!o.parked&&!t.has(o.name)&&i.push(`${n}: unknown field "${o.name}" (a misspelling? to park a field, strike it through: ~~${o.name}:~~)`)}}function Gn(e){return e.length>0&&!/^\s/.test(e)&&Pt(e)!==void 0}function ql(e,t){const n=t.toLowerCase(),i=e.findIndex(c=>Bs(c)===n);if(i===-1)return;const s=Pt(e[i]).value,o=[];for(let c=i+1;c<e.length&&!(Gn(e[c])||Ul.test(e[c].trim()));c++)o.push(e[c]);for(;o.length&&o[o.length-1].trim()==="";)o.pop();if(o.length===0)return s;const r=o.filter(c=>c.trim()!=="").map(c=>c.length-c.trimStart().length),a=Math.min(...r),l=o.map(c=>c.slice(a)).join(`
`);return s?`${s}
${l}`:l}function ig(e,t){const n=t.toLowerCase(),i=e.findIndex(o=>Bs(o)===n);if(i===-1)return[];const s=[];for(let o=i+1;o<e.length;o++){const r=e[o].trimStart();if(Gn(e[o])||r==="")break;r.startsWith("- ")&&s.push(r.slice(2).trim())}return s}function sg(e,t,n){const i=e.findIndex(a=>Bs(a)==="beats");if(i===-1)return;const s=[];let o=null;const r=()=>{o&&s.push(o)};for(let a=i+1;a<e.length;a++){const l=e[a].trimStart();if(Gn(e[a])||e[a].length>0&&!/^\s/.test(e[a])&&/^<\/?[a-z]/i.test(l))break;if(l==="")continue;const c=l.match(/^(\d+)\.\s+(.*)$/);if(c){r(),o={text:c[2].trim()};continue}const h=Pt(l);if(!h?.parked){if(h&&o){const{name:f,value:d}=h;if(!tg.has(f)){n.push(`${t} beat ${s.length+1}: unknown field "${f}" (a misspelling? to park a field, strike it through: ~~${f}:~~)`);continue}if(f==="description"){const g=e[a].length-e[a].trimStart().length,p=[];let b=a+1;for(;b<e.length;b++){if(e[b].trim()===""){p.push("");continue}if(e[b].length-e[b].trimStart().length<=g)break;p.push(e[b])}for(;p.length&&p[p.length-1].trim()==="";)p.pop();if(p.length){const m=p.filter(v=>v.trim()!=="").map(v=>v.length-v.trimStart().length),w=Math.min(...m),k=p.map(v=>v.slice(w)).join(`
`);o.description=d?`${d}
${k}`:k}else o.description=d;a=b-1;continue}f==="anchor"?o.anchor=Wt(d,t):f==="spotlight"?o.spotlight=Wt(d,t):f==="action"?o.action=d.trim():f==="change"?o.change=d.trim():f==="only"?(o.change=d.trim(),o.replace=!0):f==="highlight"?o.highlight=zl(d):f==="width"?o.width=Hl(d):f==="position"?o.position=Wl(d):f==="offsetx"?o.offsetX=Gl(d):f==="keep"&&(o.keep=d.trim()!=="false");continue}o&&!l.startsWith("-")&&(o.text=`${o.text} ${l}`.trim())}}return r(),s.length>0?s:void 0}function og(e,t,n){const i=e.split(`
`),o=i[0].match(/^###\s+(.+)$/);if(!o)return null;const r=o[1].trim();Kl(i,eg,r,n);const a=xe(i,"Title")??r,l=ql(i,"Description")??"",c=ig(i,"Interactions"),h=xe(i,"Shortcut"),f=xe(i,"Context"),d=Wt(xe(i,"Anchor"),r),g=xe(i,"Spotlight"),p=g===void 0?void 0:Wt(g,r),b=xe(i,"Action"),m=xe(i,"Once"),w=xe(i,"Only"),k=xe(i,"Change"),v=k??w,x=k===void 0&&w!==void 0?!0:void 0,C=zl(xe(i,"Highlight")),D=Hl(xe(i,"Width")),S=Wl(xe(i,"Position")),P=Gl(xe(i,"OffsetX")),E=sg(i,r,n),L=xe(i,"Tour");return{id:r,title:a,description:l,interactions:c,shortcut:h,context:f,anchor:d,action:b,once:m,change:v,replace:x,highlight:C,width:D,position:S,offsetX:P,tour:L===void 0?void 0:L||Zm,order:t,beats:E,...p?{spotlight:p}:{}}}function rg(e,t,n){const i=e.split(`
`),s=i.findIndex(p=>/^##\s+/.test(p)),o=s===-1?null:i[s].match(/^##\s+(.+)$/),r=o?o[1].trim():"Unknown",a=r.toLowerCase().replace(/[^a-z0-9]+/g,"-"),l=[];for(let p=s+1;p<i.length&&!i[p].startsWith("### ");p++)Ul.test(i[p].trim())||l.push(i[p]);const c=l.join(`
`).trim();Kl(l,ng,`section "${r}"`,n);const h=xe(l,"TourMetadata"),f=h===void 0?void 0:{name:h||r,description:ql(l,"Description")?.trim()??"",abbr:xe(l,"TourAbbr")?.trim()||void 0},d=[],g=e.split(/(?=^### )/m);for(const p of g){if(!p.startsWith("### "))continue;const b=og(p.trim(),t(),n);b&&d.push(b)}return{id:a,title:r,body:c,entries:d,tourMeta:f}}function is(e){const t=new Set;for(const n of[...e.entries.values()].sort((i,s)=>i.order-s.order))n.tour&&t.add(n.tour);return[...t]}function Ql(e,t){const n=t??is(e)[0];return[...e.entries.values()].filter(i=>i.tour!==void 0&&i.tour===n).sort((i,s)=>i.order-s.order)}function mi(e,t){return t<0?e:`${e} ▸${t+1}`}function gi(e){return`### ${e}`}function ss(e,t){const n=[];return Ql(e,t).forEach((i,s)=>{const o=s+1;if(!i.beats||i.beats.length===0){n.push({entry:i,step:o,beatIndex:0,beatCount:0,address:mi(i.id,-1),searchFor:gi(i.id),blocks:[i.description],text:i.description,anchor:i.anchor,...i.spotlight?{spotlight:i.spotlight}:{},action:i.action,change:i.change,replace:i.replace,highlight:i.highlight,width:i.width,position:i.position,offsetX:i.offsetX});return}let r=i.description?[i.description]:[];r.length>0&&n.push({entry:i,step:o,beatIndex:-1,beatCount:i.beats.length,address:mi(i.id,-1),searchFor:gi(i.id),blocks:r,text:r.join(`

`),anchor:i.anchor,...i.spotlight?{spotlight:i.spotlight}:{},action:i.action,change:i.change,replace:i.replace,highlight:i.highlight,width:i.width,position:i.position,offsetX:i.offsetX});let a=i.width;i.beats.forEach((l,c)=>{const h=l.description??"";r=l.keep?[...r,h]:[h],l.width!==void 0&&(a=l.width),n.push({entry:i,step:o,beatIndex:c,beat:l,beatCount:i.beats.length,address:mi(i.id,c),searchFor:gi(i.id),blocks:r,text:r.join(`

`),anchor:l.anchor??i.anchor,...l.spotlight??i.spotlight?{spotlight:l.spotlight??i.spotlight}:{},action:l.action,highlight:l.highlight??i.highlight,width:a,position:l.position??i.position,offsetX:l.offsetX??i.offsetX,change:l.change,replace:l.replace})})}),n}function ag(e){const n=e.replace(/<!--[\s\S]*?-->/g,"").trim().split(/(?=^## )/m).map(l=>l.trim()).filter(Boolean),i=[],s=new Map,o=[];let r=0;for(const l of n){if(!l.match(/^## /m))continue;const c=l.match(/^##\s+(.+)$/m)?.[1].trim();if(c&&Jm.has(c))continue;const h=rg(l,()=>r++,o);i.push(h);for(const f of h.entries)s.set(f.id,f)}const a=new Map;for(const l of i)l.tourMeta&&a.set(l.tourMeta.name,l.tourMeta);return o.length&&console.warn(`[help-content] ${o.length} problem(s):
  ${o.join(`
  `)}`),{sections:i,entries:s,tourMeta:a,problems:o}}const lg=/\{\{\s*([a-z][a-z0-9-]*)\s*:\s*([^}]*?)\s*\}\}/gi;function cg(e,t){return!t||!e.includes("{{")?e:e.replace(lg,(n,i,s)=>t[i.toLowerCase()]?.(s)??n)}function Cr(e){const t=new Set;return e.map((n,i)=>({p:n,index:i})).filter(({p:n})=>t.has(n.step)?!1:(t.add(n.step),!0)).map(({p:n,index:i})=>({index:i,step:n.step,title:n.entry.title,beatCount:n.beatCount}))}function Yl({scope:e,onClose:t}){const{content:n,tours:i,tourMeta:s,tourName:o,tourIndex:r,positions:a,position:l,goToStep:c,startTour:h}=ut();y.useEffect(()=>{const m=w=>{w.key==="Escape"&&(w.stopPropagation(),w.preventDefault(),t())};return window.addEventListener("keydown",m,!0),()=>window.removeEventListener("keydown",m,!0)},[t]);const f=y.useRef(null);y.useEffect(()=>{const m=f.current;if(!(!m||typeof m.showPopover!="function"))return m.showPopover(),()=>{m.matches(":popover-open")&&m.hidePopover()}},[]);const d=y.useMemo(()=>e==="all"?i.map(m=>({name:m,rows:Cr(ss(n,m))})):[],[e,i,n]),g=l?.step,p=r===null?void 0:o,b=(m,w,k)=>u.jsxs("button",{onClick:k,"aria-current":w?"step":void 0,className:`help-map-step${w?" help-map-step-here":""}`,children:[u.jsx("span",{className:"help-map-num",children:m.step}),u.jsx("span",{className:"help-map-title",children:m.title}),m.beatCount>0&&u.jsx("span",{className:"help-map-beats",title:`${m.beatCount+1} screens in this step`,children:m.beatCount+1})]},m.index);return Nr.createPortal(u.jsx("div",{ref:f,popover:"manual",className:"help-map-backdrop",onMouseDown:t,children:u.jsxs("div",{role:"dialog","aria-label":e==="all"?"All tours":"Tour outline",className:"help-map",onMouseDown:m=>m.stopPropagation(),children:[u.jsxs("div",{className:"help-map-head",children:[u.jsxs("div",{children:[u.jsx("h2",{children:e==="all"?"Tours":p??"This tour"}),u.jsx("p",{children:e==="all"?"Every guided walk, and what is in it. Click any step to start there.":"Click any step to jump to it."})]}),u.jsx("button",{onClick:t,title:"Close (Esc)",className:"help-map-close",children:"✕"})]}),u.jsx("div",{className:"help-map-body",children:e==="tour"?Cr(a).map(m=>b(m,m.step===g,()=>{c(m.index),t()})):d.map(({name:m,rows:w})=>u.jsxs("section",{className:"help-map-tour",children:[u.jsx("button",{className:"help-map-tourname",onClick:()=>{h(m),t()},children:m}),s.get(m)?.description&&u.jsx("p",{className:"help-map-blurb",children:s.get(m).description}),w.map(k=>b(k,p===m&&k.step===g,()=>{p===m?c(k.index):h(m,k.index),t()}))]},m))})]})}),document.body)}function hg(){const{tours:e,tourMeta:t,startTour:n}=ut(),[i,s]=y.useState(!1),{overviewOpen:o,setOverviewOpen:r}=ut(),a=y.useRef(null);return y.useEffect(()=>{if(!i)return;const l=h=>{h.target?.closest("[data-tour-chooser]")||s(!1)},c=h=>{h.key==="Escape"&&s(!1)};return document.addEventListener("mousedown",l,!0),document.addEventListener("keydown",c),()=>{document.removeEventListener("mousedown",l,!0),document.removeEventListener("keydown",c)}},[i]),e.length===0?null:u.jsxs("span",{"data-tour-chooser":!0,"data-help-id":"tour-chooser",className:"relative",onMouseEnter:()=>s(!0),children:[u.jsx("button",{onClick:()=>{s(!1),r(!0)},title:"Guided walks through the app and the model; click for the overview",className:`text-sm font-semibold px-2.5 py-1 rounded-full bg-white/95
                   text-blue-700 shadow-sm hover:bg-white hover:shadow`,children:"Guided tours"}),i&&u.jsxs("div",{ref:a,role:"dialog","aria-label":"Guided tours",className:`absolute right-0 top-full mt-1 z-40 w-80 p-1
                     rounded-md border border-gray-300 dark:border-slate-600
                     bg-white dark:bg-slate-800 shadow-xl
                     text-gray-900 dark:text-gray-100`,children:[u.jsxs("p",{className:"px-3 pt-2 pb-1 text-[11px] text-gray-500 dark:text-gray-400",children:["Each one stands on its own. Leave any tour with ",u.jsx("kbd",{children:"Esc"}),"."]}),u.jsxs("button",{"data-tour-overview":!0,onClick:()=>{s(!1),r(!0)},className:`block w-full text-left px-3 py-2 rounded
                       hover:bg-gray-100 dark:hover:bg-slate-700`,children:[u.jsx("span",{className:"block text-xs font-semibold",children:"Overview"}),u.jsxs("span",{className:"block text-[11px] text-gray-500 dark:text-gray-400",children:["All ",e.length," tours and every step in them — start anywhere."]})]}),u.jsx("div",{className:"my-1 border-t border-gray-200 dark:border-slate-700"}),e.map(l=>u.jsxs("button",{onClick:()=>{s(!1),n(l)},className:`block w-full text-left px-3 py-2 rounded
                         hover:bg-gray-100 dark:hover:bg-slate-700`,children:[u.jsx("span",{className:"block text-xs font-semibold",children:l}),t.get(l)?.description&&u.jsx("span",{className:"block text-[11px] text-gray-500 dark:text-gray-400",children:t.get(l).description})]},l))]}),o&&u.jsx(Yl,{scope:"all",onClose:()=>r(!1)})]})}const ug="dmvd.help.showAddresses";function dg(){const e=document.activeElement;return e instanceof HTMLInputElement||e instanceof HTMLTextAreaElement||e?.getAttribute("contenteditable")==="true"}function fg(e,t){if(!t)return e;const n=o=>cg(o,t),i=o=>o===void 0?void 0:n(o),s=new Map([...e.entries].map(([o,r])=>[o,{...r,description:n(r.description),interactions:r.interactions.map(n),action:i(r.action),context:i(r.context),beats:r.beats?.map(a=>({...a,description:i(a.description),action:i(a.action)}))}]));return{sections:e.sections.map(o=>({...o,entries:o.entries.map(r=>s.get(r.id)??r),tourMeta:o.tourMeta&&{...o.tourMeta,description:n(o.tourMeta.description)}})),entries:s,tourMeta:new Map([...e.tourMeta].map(([o,r])=>[o,{...r,description:n(r.description)}]))}}function pg({markdown:e,onPushChange:t,onPopChange:n,onJumpChanges:i,onTourStart:s,onTourEnd:o,textResolvers:r,widgets:a,colors:l,centerOn:c,children:h}){const[f,d]=y.useState(),g=f??r,p=y.useMemo(()=>fg(ag(e),g),[e,g]),[b,m]=y.useState(!1),[w,k]=y.useState(null),[v,x]=y.useState(void 0),[C,D]=y.useState(!1),S=y.useMemo(()=>is(p),[p]),P=y.useMemo(()=>ss(p,v),[p,v]),E=y.useMemo(()=>Ql(p,v).length,[p,v]),[L,I]=y.useState(null),[B,O]=y.useState(()=>!1),_=y.useCallback(()=>{O(q=>{const Q=!q;try{window.localStorage.setItem(ug,Q?"1":"0")}catch{}return Q})},[]),T=y.useCallback(()=>{m(!1),I(null)},[]),W=y.useCallback(()=>I(null),[]),fe=y.useCallback(q=>I(q),[]),N=y.useCallback(q=>{const Q=P[q];Q&&(k(q),I(Q.entry.id),Q.change!=null&&t&&t(Q.change,Q.replace))},[P,t]),G=y.useCallback(q=>{P[q+1]?.change!=null&&n&&n();const ie=P[q];ie&&(k(q),I(ie.entry.id))},[P,n]),j=y.useCallback(q=>{if(w===null||q===w)return;const Q=P[q];if(Q&&i){if(q>w){const ie=P.slice(w+1,q+1).filter(ae=>ae.change!=null).map(ae=>({query:ae.change,replace:ae.replace}));i(ie,0)}else{const ie=P.slice(q+1,w+1).filter(ae=>ae.change!=null).length;i([],ie)}k(q),I(Q.entry.id)}},[w,P,i]),X=y.useCallback((q=is(p)[0],Q=0)=>{m(!1),x(q);const ie=ss(p,q),ae=Math.min(Math.max(Q,0),Math.max(ie.length-1,0)),we=ie[ae];if(!we)return;s?.(),k(ae),I(we.entry.id);const Ne=ie.slice(0,ae+1).filter(Ve=>Ve.change!=null).map(Ve=>({query:Ve.change,replace:Ve.replace}));ae>0&&i?i(Ne,0):we.change!=null&&t&&t(we.change,we.replace)},[p,t,i,s]),oe=y.useCallback(()=>{k(null),I(null),x(void 0),o?.()},[o]),re=y.useCallback(()=>{w!==null&&(w+1>=P.length?oe():N(w+1))},[w,P.length,N,oe]),Oe=y.useCallback(()=>{w!==null&&w>0&&G(w-1)},[w,G]),be=y.useCallback(()=>{w!==null&&oe(),I(null)},[w,oe]),Ee=y.useCallback(q=>{if(!q)return null;const{kind:Q}=q;if(Q==="none")return null;const{arg:ie}=q,ae=Q==="help-id"?ie:`${Q}:${ie}`,we=document.querySelectorAll(`[data-help-id="${CSS.escape(ae)}"]`);return we.length<2?we[0]??null:[...we].find(Ne=>Ne.getBoundingClientRect().height>0)??we[0]},[]);y.useEffect(()=>(document.body.classList.toggle("help-mode",b),()=>{document.body.classList.remove("help-mode")}),[b]),y.useEffect(()=>{if(b)return window.addEventListener("blur",T),()=>window.removeEventListener("blur",T)},[b,T]),y.useEffect(()=>{if(!b)return;function q(Q){const ie=Q.target;if(!ie)return;const ae=ie.closest("[data-help-id]");ae?(Q.stopPropagation(),Q.preventDefault(),fe(ae.getAttribute("data-help-id"))):ie.closest("[data-help-popover]")||W()}return document.addEventListener("click",q,!0),()=>document.removeEventListener("click",q,!0)},[b,fe,W]),y.useEffect(()=>{function q(Q){if(Q.key==="?"&&!dg()){Q.preventDefault(),w===null?D(ie=>!ie):oe();return}if(Q.key==="Escape"&&(b||w!==null||L)){Q.preventDefault(),Q.stopPropagation(),L&&w===null?W():w!==null?oe():be();return}w!==null&&(Q.key==="ArrowRight"&&(Q.preventDefault(),re()),Q.key==="ArrowLeft"&&(Q.preventDefault(),Oe()))}return document.addEventListener("keydown",q,!0),()=>document.removeEventListener("keydown",q,!0)},[b,w,L,be,W,oe,re,Oe]);const ve=y.useCallback(()=>c?Ee(Wt(c,c))?.getBoundingClientRect()??null:null,[c,Ee]),Ce=y.useMemo(()=>({setTextResolvers:d,helpMode:b,toggleHelpMode:be,exitHelpMode:T,tourIndex:w,startTour:X,endTour:oe,nextStep:re,prevStep:Oe,goToStep:j,positions:P,position:w===null?void 0:P[w],stepCount:E,tours:S,tourName:v,tourMeta:p.tourMeta,overviewOpen:C,setOverviewOpen:D,...a?{widgets:a}:{},...l?{colors:l}:{},showAddresses:B,toggleAddresses:_,content:p,activeId:L,showEntry:fe,dismissEntry:W,resolveAnchor:Ee,centerRect:ve}),[b,be,T,w,X,oe,re,Oe,j,P,E,S,v,C,a,l,B,_,p,L,fe,W,Ee,ve]);return u.jsx(_l.Provider,{value:Ce,children:h})}function Ar(e,t){const n=String(e);if(typeof t!="string")throw new TypeError("Expected character");let i=0,s=n.indexOf(t);for(;s!==-1;)i++,s=n.indexOf(t,s+t.length);return i}const mg=["AElig","AMP","Aacute","Acirc","Agrave","Aring","Atilde","Auml","COPY","Ccedil","ETH","Eacute","Ecirc","Egrave","Euml","GT","Iacute","Icirc","Igrave","Iuml","LT","Ntilde","Oacute","Ocirc","Ograve","Oslash","Otilde","Ouml","QUOT","REG","THORN","Uacute","Ucirc","Ugrave","Uuml","Yacute","aacute","acirc","acute","aelig","agrave","amp","aring","atilde","auml","brvbar","ccedil","cedil","cent","copy","curren","deg","divide","eacute","ecirc","egrave","eth","euml","frac12","frac14","frac34","gt","iacute","icirc","iexcl","igrave","iquest","iuml","laquo","lt","macr","micro","middot","nbsp","not","ntilde","oacute","ocirc","ograve","ordf","ordm","oslash","otilde","ouml","para","plusmn","pound","quot","raquo","reg","sect","shy","sup1","sup2","sup3","szlig","thorn","times","uacute","ucirc","ugrave","uml","uuml","yacute","yen","yuml"],Pr={0:"�",128:"€",130:"‚",131:"ƒ",132:"„",133:"…",134:"†",135:"‡",136:"ˆ",137:"‰",138:"Š",139:"‹",140:"Œ",142:"Ž",145:"‘",146:"’",147:"“",148:"”",149:"•",150:"–",151:"—",152:"˜",153:"™",154:"š",155:"›",156:"œ",158:"ž",159:"Ÿ"};function Xl(e){const t=typeof e=="string"?e.charCodeAt(0):e;return t>=48&&t<=57}function gg(e){const t=typeof e=="string"?e.charCodeAt(0):e;return t>=97&&t<=102||t>=65&&t<=70||t>=48&&t<=57}function yg(e){const t=typeof e=="string"?e.charCodeAt(0):e;return t>=97&&t<=122||t>=65&&t<=90}function Er(e){return yg(e)||Xl(e)}const bg=["","Named character references must be terminated by a semicolon","Numeric character references must be terminated by a semicolon","Named character references cannot be empty","Numeric character references cannot be empty","Named character references must be known","Numeric character references cannot be disallowed","Numeric character references cannot be outside the permissible Unicode range"];function $s(e,t){const n=t||{},i=typeof n.additional=="string"?n.additional.charCodeAt(0):n.additional,s=[];let o=0,r=-1,a="",l,c;n.position&&("start"in n.position||"indent"in n.position?(c=n.position.indent,l=n.position.start):l=n.position);let h=(l?l.line:0)||1,f=(l?l.column:0)||1,d=p(),g;for(o--;++o<=e.length;)if(g===10&&(f=(c?c[r]:0)||1),g=e.charCodeAt(o),g===38){const w=e.charCodeAt(o+1);if(w===9||w===10||w===12||w===32||w===38||w===60||Number.isNaN(w)||i&&w===i){a+=String.fromCharCode(g),f++;continue}const k=o+1;let v=k,x=k,C;if(w===35){x=++v;const O=e.charCodeAt(x);O===88||O===120?(C="hexadecimal",x=++v):C="decimal"}else C="named";let D="",S="",P="";const E=C==="named"?Er:C==="decimal"?Xl:gg;for(x--;++x<=e.length;){const O=e.charCodeAt(x);if(!E(O))break;P+=String.fromCharCode(O),C==="named"&&mg.includes(P)&&(D=P,S=Ks(P))}let L=e.charCodeAt(x)===59;if(L){x++;const O=C==="named"?Ks(P):!1;O&&(D=P,S=O)}let I=1+x-k,B="";if(!(!L&&n.nonTerminated===!1))if(!P)C!=="named"&&b(4,I);else if(C==="named"){if(L&&!S)b(5,1);else if(D!==P&&(x=v+D.length,I=1+x-v,L=!1),!L){const O=D?1:3;if(n.attribute){const _=e.charCodeAt(x);_===61?(b(O,I),S=""):Er(_)?S="":b(O,I)}else b(O,I)}B=S}else{L||b(2,I);let O=Number.parseInt(P,C==="hexadecimal"?16:10);if(wg(O))b(7,I),B="�";else if(O in Pr)b(6,I),B=Pr[O];else{let _="";xg(O)&&b(6,I),O>65535&&(O-=65536,_+=String.fromCharCode(O>>>10|55296),O=56320|O&1023),B=_+String.fromCharCode(O)}}if(B){m(),d=p(),o=x-1,f+=x-k+1,s.push(B);const O=p();O.offset++,n.reference&&n.reference.call(n.referenceContext||void 0,B,{start:d,end:O},e.slice(k-1,x)),d=O}else P=e.slice(k-1,x),a+=P,f+=P.length,o=x-1}else g===10&&(h++,r++,f=0),Number.isNaN(g)?m():(a+=String.fromCharCode(g),f++);return s.join("");function p(){return{line:h,column:f,offset:o+((l?l.offset:0)||0)}}function b(w,k){let v;n.warning&&(v=p(),v.column+=k,v.offset+=k,n.warning.call(n.warningContext||void 0,bg[w],v,w))}function m(){a&&(s.push(a),n.text&&n.text.call(n.textContext||void 0,a,{start:d,end:p()}),a="")}}function wg(e){return e>=55296&&e<=57343||e>1114111}function xg(e){return e>=1&&e<=8||e===11||e>=13&&e<=31||e>=127&&e<=159||e>=64976&&e<=65007||(e&65535)===65535||(e&65535)===65534}const vg=/["&'<>`]/g,kg=/[\uD800-\uDBFF][\uDC00-\uDFFF]/g,Sg=/[\x01-\t\v\f\x0E-\x1F\x7F\x81\x8D\x8F\x90\x9D\xA0-\uFFFF]/g,Tg=/[|\\{}()[\]^$+*?.]/g,Dr=new WeakMap;function Cg(e,t){if(e=e.replace(t.subset?Ag(t.subset):vg,i),t.subset||t.escapeOnly)return e;return e.replace(kg,n).replace(Sg,i);function n(s,o,r){return t.format((s.charCodeAt(0)-55296)*1024+s.charCodeAt(1)-56320+65536,r.charCodeAt(o+2),t)}function i(s,o,r){return t.format(s.charCodeAt(0),r.charCodeAt(o+1),t)}}function Ag(e){let t=Dr.get(e);return t||(t=Pg(e),Dr.set(e,t)),t}function Pg(e){const t=[];let n=-1;for(;++n<e.length;)t.push(e[n].replace(Tg,"\\$&"));return new RegExp("(?:"+t.join("|")+")","g")}function Eg(e){return"&#x"+e.toString(16).toUpperCase()+";"}function Dg(e,t){return Cg(e,Object.assign({format:Eg},t))}const Mg={}.hasOwnProperty,Og={},Mr=/^[^\t\n\r "#'.<=>`}]+$/,Rg=/^[^\t\n\r "'<=>`}]+$/;function jg(){return{canContainEols:["textDirective"],enter:{directiveContainer:Ng,directiveContainerAttributes:bi,directiveContainerLabel:Bg,directiveLeaf:Vg,directiveLeafAttributes:bi,directiveText:Ig,directiveTextAttributes:bi},exit:{directiveContainer:Ti,directiveContainerAttributeClassValue:xi,directiveContainerAttributeIdValue:wi,directiveContainerAttributeName:ki,directiveContainerAttributeValue:vi,directiveContainerAttributes:Si,directiveContainerLabel:$g,directiveContainerName:yi,directiveLeaf:Ti,directiveLeafAttributeClassValue:xi,directiveLeafAttributeIdValue:wi,directiveLeafAttributeName:ki,directiveLeafAttributeValue:vi,directiveLeafAttributes:Si,directiveLeafName:yi,directiveText:Ti,directiveTextAttributeClassValue:xi,directiveTextAttributeIdValue:wi,directiveTextAttributeName:ki,directiveTextAttributeValue:vi,directiveTextAttributes:Si,directiveTextName:yi}}}function Lg(e){const t=Og;if(t.quote!=='"'&&t.quote!=="'"&&t.quote!==null&&t.quote!==void 0)throw new Error("Invalid quote `"+t.quote+"`, expected `'` or `\"`");return n.peek=Fg,{handlers:{containerDirective:n,leafDirective:n,textDirective:n},unsafe:[{character:"\r",inConstruct:["leafDirectiveLabel","containerDirectiveLabel"]},{character:`
`,inConstruct:["leafDirectiveLabel","containerDirectiveLabel"]},{before:"[^:]",character:":",after:"[A-Za-z]",inConstruct:["phrasing"]},{atBreak:!0,character:":",after:":"}]};function n(o,r,a,l){const c=a.createTracker(l),h=_g(o),f=a.enter(o.type);let d=c.move(h+(o.name||"")),g;if(o.type==="containerDirective"){const p=(o.children||[])[0];g=Or(p)?p:void 0}else g=o;if(g&&g.children&&g.children.length>0){const p=a.enter("label"),b=`${o.type}Label`,m=a.enter(b);d+=c.move("["),d+=c.move(a.containerPhrasing(g,{...c.current(),before:d,after:"]"})),d+=c.move("]"),m(),p()}if(d+=c.move(i(o,a)),o.type==="containerDirective"){const p=(o.children||[])[0];let b=o;Or(p)&&(b=Object.assign({},o,{children:o.children.slice(1)})),b&&b.children&&b.children.length>0&&(d+=c.move(`
`),d+=c.move(a.containerFlow(b,c.current()))),d+=c.move(`
`+h)}return f(),d}function i(o,r){const a=o.attributes||{},l=[];let c,h,f,d;for(d in a)if(Mg.call(a,d)&&a[d]!==void 0&&a[d]!==null){const g=String(a[d]);if(d==="id")f=t.preferShortcut!==!1&&Mr.test(g)?"#"+g:s("id",g,o,r);else if(d==="class"){const p=g.split(/[\t\n\r ]+/g),b=[],m=[];let w=-1;for(;++w<p.length;)(t.preferShortcut!==!1&&Mr.test(p[w])?m:b).push(p[w]);c=b.length>0?s("class",b.join(" "),o,r):"",h=m.length>0?"."+m.join("."):""}else l.push(s(d,g,o,r))}return c&&l.unshift(c),h&&l.unshift(h),f&&l.unshift(f),l.length>0?"{"+l.join(" ")+"}":""}function s(o,r,a,l){if(t.collapseEmptyAttributes!==!1&&!r)return o;if(t.preferUnquoted&&Rg.test(r))return o+"="+r;const c=t.quote||l.options.quote||'"',h=c==='"'?"'":'"',f=t.quoteSmart&&Ar(r,c)>Ar(r,h)?h:c,d=a.type==="textDirective"?[f]:[f,`
`,"\r"];return o+"="+f+Dg(r,{subset:d})+f}}function Ng(e){Fs.call(this,"containerDirective",e)}function Vg(e){Fs.call(this,"leafDirective",e)}function Ig(e){Fs.call(this,"textDirective",e)}function Fs(e,t){this.enter({type:e,name:"",attributes:{},children:[]},t)}function yi(e){const t=this.stack[this.stack.length-1];Br(t.type==="containerDirective"||t.type==="leafDirective"||t.type==="textDirective"),t.name=this.sliceSerialize(e)}function Bg(e){this.enter({type:"paragraph",data:{directiveLabel:!0},children:[]},e)}function $g(e){this.exit(e)}function bi(){this.data.directiveAttributes=[],this.buffer()}function wi(e){this.data.directiveAttributes.push(["id",$s(this.sliceSerialize(e),{attribute:!0})])}function xi(e){this.data.directiveAttributes.push(["class",$s(this.sliceSerialize(e),{attribute:!0})])}function vi(e){const t=this.data.directiveAttributes;t[t.length-1][1]=$s(this.sliceSerialize(e),{attribute:!0})}function ki(e){this.data.directiveAttributes.push([this.sliceSerialize(e),""])}function Si(){const e=this.data.directiveAttributes,t={};let n=-1;for(;++n<e.length;){const s=e[n];s[0]==="class"&&t.class?t.class+=" "+s[1]:t[s[0]]=s[1]}this.data.directiveAttributes=void 0,this.resume();const i=this.stack[this.stack.length-1];Br(i.type==="containerDirective"||i.type==="leafDirective"||i.type==="textDirective"),i.attributes=t}function Ti(e){this.exit(e)}function Fg(){return":"}function Or(e){return!!(e&&e.type==="paragraph"&&e.data&&e.data.directiveLabel)}function _g(e){let t=0;return e.type==="containerDirective"?(gc(e,function(n,i){if(n.type==="containerDirective"){let s=i.length,o=0;for(;s--;)i[s].type==="containerDirective"&&o++;o>t&&(t=o)}}),t+=3):e.type==="leafDirective"?t=2:t=1,":".repeat(t)}function _s(e,t,n,i,s,o,r,a,l,c,h,f,d,g,p){let b,m;return w;function w(T){return e.enter(i),e.enter(s),e.consume(T),e.exit(s),k}function k(T){return T===35?(b=r,v(T)):T===46?(b=a,v(T)):p&&qn(T)?Ye(e,k,"whitespace")(T):!p&&nt(T)?Jt(e,k)(T):T===null||Pe(T)||Cn(T)||An(T)&&T!==45&&T!==95?_(T):(e.enter(o),e.enter(l),e.consume(T),D)}function v(T){const W=b+"Marker";return e.enter(o),e.enter(b),e.enter(W),e.consume(T),e.exit(W),x}function x(T){if(T===null||T===34||T===35||T===39||T===46||T===60||T===61||T===62||T===96||T===125||nt(T))return n(T);const W=b+"Value";return e.enter(W),e.consume(T),C}function C(T){if(T===null||T===34||T===39||T===60||T===61||T===62||T===96)return n(T);if(T===35||T===46||T===125||nt(T)){const W=b+"Value";return e.exit(W),e.exit(b),e.exit(o),k(T)}return e.consume(T),C}function D(T){return T===null||Pe(T)||Cn(T)||An(T)&&T!==45&&T!==46&&T!==58&&T!==95?(e.exit(l),p&&qn(T)?Ye(e,S,"whitespace")(T):!p&&nt(T)?Jt(e,S)(T):S(T)):(e.consume(T),D)}function S(T){return T===61?(e.enter(c),e.consume(T),e.exit(c),P):(e.exit(o),k(T))}function P(T){return T===null||T===60||T===61||T===62||T===96||T===125||p&&Pe(T)?n(T):T===34||T===39?(e.enter(h),e.enter(d),e.consume(T),e.exit(d),m=T,L):p&&qn(T)?Ye(e,P,"whitespace")(T):!p&&nt(T)?Jt(e,P)(T):(e.enter(f),e.enter(g),e.consume(T),m=void 0,E)}function E(T){return T===null||T===34||T===39||T===60||T===61||T===62||T===96?n(T):T===125||nt(T)?(e.exit(g),e.exit(f),e.exit(o),k(T)):(e.consume(T),E)}function L(T){return T===m?(e.enter(d),e.consume(T),e.exit(d),e.exit(h),e.exit(o),O):(e.enter(f),I(T))}function I(T){return T===m?(e.exit(f),L(T)):T===null?n(T):Pe(T)?p?n(T):Jt(e,I)(T):(e.enter(g),e.consume(T),B)}function B(T){return T===m||T===null||Pe(T)?(e.exit(g),I(T)):(e.consume(T),B)}function O(T){return T===125||nt(T)?k(T):_(T)}function _(T){return T===125?(e.enter(s),e.consume(T),e.exit(s),e.exit(i),t):n(T)}}function Hs(e,t,n,i,s,o,r){let a=0,l=0,c;return h;function h(m){return e.enter(i),e.enter(s),e.consume(m),e.exit(s),f}function f(m){return m===93?(e.enter(s),e.consume(m),e.exit(s),e.exit(i),t):(e.enter(o),d(m))}function d(m){if(m===93&&!l)return b(m);const w=e.enter("chunkText",{_contentTypeTextTrailing:!0,contentType:"text",previous:c});return c&&(c.next=w),c=w,g(m)}function g(m){return m===null||a>999||m===91&&++l>32?n(m):m===93&&!l--?(e.exit("chunkText"),b(m)):Pe(m)?r?n(m):(e.consume(m),e.exit("chunkText"),d):(e.consume(m),m===92?p:g)}function p(m){return m===91||m===92||m===93?(e.consume(m),a++,g):g(m)}function b(m){return e.exit(o),e.enter(s),e.consume(m),e.exit(s),e.exit(i),t}}function zs(e,t,n,i){const s=this;return o;function o(a){return a===null||Pe(a)||An(a)||Cn(a)?n(a):(e.enter(i),e.consume(a),r)}function r(a){return a===null||Pe(a)||Cn(a)||An(a)&&a!==45&&a!==95?(e.exit(i),s.previous===45||s.previous===95?n(a):t(a)):(e.consume(a),r)}}const Hg={tokenize:Gg,concrete:!0},zg={tokenize:Ug,partial:!0},Wg={tokenize:Kg,partial:!0},pn={tokenize:qg,partial:!0};function Gg(e,t,n){const i=this,s=i.events[i.events.length-1],o=s&&s[1].type==="linePrefix"?s[2].sliceSerialize(s[1],!0).length:0;let r=0,a;return l;function l(E){return e.enter("directiveContainer"),e.enter("directiveContainerFence"),e.enter("directiveContainerSequence"),c(E)}function c(E){return E===58?(e.consume(E),r++,c):r<3?n(E):(e.exit("directiveContainerSequence"),zs.call(i,e,h,n,"directiveContainerName")(E))}function h(E){return E===91?e.attempt(zg,f,f)(E):f(E)}function f(E){return E===123?e.attempt(Wg,d,d)(E):d(E)}function d(E){return Ye(e,g,"whitespace")(E)}function g(E){return e.exit("directiveContainerFence"),E===null?S(E):Pe(E)?i.interrupt?t(E):e.attempt(pn,p,S)(E):n(E)}function p(E){return E===null?S(E):Pe(E)?e.check(pn,v,S)(E):(e.enter("directiveContainerContent"),b(E))}function b(E){return e.attempt({tokenize:P,partial:!0},D,o?Ye(e,m,"linePrefix",o+1):m)(E)}function m(E){return E===null?D(E):Pe(E)?e.check(pn,k,D)(E):k(E)}function w(E){if(E===null){const L=e.exit("chunkDocument");return i.parser.lazy[L.start.line]=!1,D(E)}return Pe(E)?e.check(pn,x,C)(E):(e.consume(E),w)}function k(E){const L=e.enter("chunkDocument",{contentType:"document",previous:a});return a&&(a.next=L),a=L,w(E)}function v(E){return e.enter("directiveContainerContent"),b(E)}function x(E){e.consume(E);const L=e.exit("chunkDocument");return i.parser.lazy[L.start.line]=!1,b}function C(E){const L=e.exit("chunkDocument");return i.parser.lazy[L.start.line]=!1,D(E)}function D(E){return e.exit("directiveContainerContent"),S(E)}function S(E){return e.exit("directiveContainer"),t(E)}function P(E,L,I){let B=0;return Ye(E,O,"linePrefix",i.parser.constructs.disable.null.includes("codeIndented")?void 0:4);function O(W){return E.enter("directiveContainerFence"),E.enter("directiveContainerSequence"),_(W)}function _(W){return W===58?(E.consume(W),B++,_):B<r?I(W):(E.exit("directiveContainerSequence"),Ye(E,T,"whitespace")(W))}function T(W){return W===null||Pe(W)?(E.exit("directiveContainerFence"),L(W)):I(W)}}}function Ug(e,t,n){return Hs(e,t,n,"directiveContainerLabel","directiveContainerLabelMarker","directiveContainerLabelString",!0)}function Kg(e,t,n){return _s(e,t,n,"directiveContainerAttributes","directiveContainerAttributesMarker","directiveContainerAttribute","directiveContainerAttributeId","directiveContainerAttributeClass","directiveContainerAttributeName","directiveContainerAttributeInitializerMarker","directiveContainerAttributeValueLiteral","directiveContainerAttributeValue","directiveContainerAttributeValueMarker","directiveContainerAttributeValueData",!0)}function qg(e,t,n){const i=this;return s;function s(r){return e.enter("lineEnding"),e.consume(r),e.exit("lineEnding"),o}function o(r){return i.parser.lazy[i.now().line]?n(r):t(r)}}const Qg={tokenize:Zg},Yg={tokenize:Jg,partial:!0},Xg={tokenize:ey,partial:!0};function Zg(e,t,n){const i=this;return s;function s(h){return e.enter("directiveLeaf"),e.enter("directiveLeafSequence"),e.consume(h),o}function o(h){return h===58?(e.consume(h),e.exit("directiveLeafSequence"),zs.call(i,e,r,n,"directiveLeafName")):n(h)}function r(h){return h===91?e.attempt(Yg,a,a)(h):a(h)}function a(h){return h===123?e.attempt(Xg,l,l)(h):l(h)}function l(h){return Ye(e,c,"whitespace")(h)}function c(h){return h===null||Pe(h)?(e.exit("directiveLeaf"),t(h)):n(h)}}function Jg(e,t,n){return Hs(e,t,n,"directiveLeafLabel","directiveLeafLabelMarker","directiveLeafLabelString",!0)}function ey(e,t,n){return _s(e,t,n,"directiveLeafAttributes","directiveLeafAttributesMarker","directiveLeafAttribute","directiveLeafAttributeId","directiveLeafAttributeClass","directiveLeafAttributeName","directiveLeafAttributeInitializerMarker","directiveLeafAttributeValueLiteral","directiveLeafAttributeValue","directiveLeafAttributeValueMarker","directiveLeafAttributeValueData",!0)}const ty={tokenize:oy,previous:sy},ny={tokenize:ry,partial:!0},iy={tokenize:ay,partial:!0};function sy(e){return e!==58||this.events[this.events.length-1][1].type==="characterEscape"}function oy(e,t,n){const i=this;return s;function s(l){return e.enter("directiveText"),e.enter("directiveTextMarker"),e.consume(l),e.exit("directiveTextMarker"),zs.call(i,e,o,n,"directiveTextName")}function o(l){return l===58?n(l):l===91?e.attempt(ny,r,r)(l):r(l)}function r(l){return l===123?e.attempt(iy,a,a)(l):a(l)}function a(l){return e.exit("directiveText"),t(l)}}function ry(e,t,n){return Hs(e,t,n,"directiveTextLabel","directiveTextLabelMarker","directiveTextLabelString")}function ay(e,t,n){return _s(e,t,n,"directiveTextAttributes","directiveTextAttributesMarker","directiveTextAttribute","directiveTextAttributeId","directiveTextAttributeClass","directiveTextAttributeName","directiveTextAttributeInitializerMarker","directiveTextAttributeValueLiteral","directiveTextAttributeValue","directiveTextAttributeValueMarker","directiveTextAttributeValueData")}function ly(){return{text:{58:ty},flow:{58:[Hg,Qg]}}}function cy(){const t=this.data(),n=t.micromarkExtensions||(t.micromarkExtensions=[]),i=t.fromMarkdownExtensions||(t.fromMarkdownExtensions=[]),s=t.toMarkdownExtensions||(t.toMarkdownExtensions=[]);n.push(ly()),i.push(jg()),s.push(Lg())}const Rr={size:e=>`font-size:${e}`,color:e=>`color:${e}`,bg:e=>`background-color:${e}`,opacity:e=>`opacity:${e}`,nowrap:()=>"white-space:nowrap",center:()=>"text-align:center"},hy=new Set(["center"]),uy="s",dy=/^[\w.#%(),\s-]*$/,fy=new Set(["color","bg"]);function py(e,t=!1,n){const i=[];for(const[s,o]of Object.entries(e??{})){if(!(s in Rr)||t&&hy.has(s))continue;let r=(o??"").trim();fy.has(s)&&(r=n?.[r]??r),!(!dy.test(r)||/url\s*\(/i.test(r))&&i.push(Rr[s](r))}return i.join(";")}const my=new Set(["textDirective","leafDirective","containerDirective"]);function Zl(e,t){if(my.has(e.type)){const n=e.type==="textDirective",i=e.name===uy?py(e.attributes,n,t):"";e.data={...e.data,hName:n?"span":"div",hProperties:i?{style:i,className:"help-styled"}:{}}}for(const n of e.children??[])Zl(n,t)}function gy(e={}){return t=>{Zl(t,e.colors)}}const yy=e=>[cy,[gy,{colors:e}]],os={a:({href:e,children:t})=>u.jsx("a",{href:e,target:"_blank",rel:"noreferrer",children:t}),blockquote:({children:e})=>u.jsxs("div",{className:"help-popover-alert",role:"note",children:[u.jsx("span",{className:"help-popover-alert-mark","aria-hidden":"true",children:"!"}),u.jsx("div",{children:e})]})},rs="widget:",by=e=>e.startsWith(rs)?e:yc(e);function wy(e){return function({src:n,alt:i}){if(n?.startsWith(rs)){const s=n.slice(rs.length),o=s.indexOf(":"),r=o===-1?s:s.slice(0,o),a=o===-1?"":s.slice(o+1);return e?.[r]?.(a)??u.jsx("span",{children:i})}return u.jsx("img",{src:n,alt:i})}}function xy(e){try{return localStorage.getItem(e)}catch{return null}}function vy(e,t){try{localStorage.setItem(e,t)}catch{}}const Jl="help-once-",Ci="data-help-anchor",Ai="data-help-spotlight",jr="data-help-hint",ky="--help-hint",Sy=40;function Ty(e){return e.split(`
`).filter(t=>!/^\s{0,3}>/.test(t)).join(`
`).replace(/\n{3,}/g,`

`).trim()}function Cy(e){return xy(Jl+e)==="1"}function Ay(e){vy(Jl+e,"1")}function Py(e){return{...os,blockquote:({children:t})=>u.jsxs("div",{className:"help-popover-alert",role:"note",children:[u.jsx("span",{className:"help-popover-alert-mark","aria-hidden":"true",children:"!"}),u.jsxs("div",{children:[t,u.jsxs("label",{className:"help-popover-alert-once",children:[u.jsx("input",{type:"checkbox",onChange:e}),"Don't show this again"]})]})]})}}function Ey(){const{helpMode:e,tourIndex:t,position:n,positions:i,stepCount:s,content:o,activeId:r,dismissEntry:a,nextStep:l,prevStep:c,endTour:h,showEntry:f,resolveAnchor:d,centerRect:g,showAddresses:p,tourName:b,tourMeta:m,widgets:w,colors:k}=ut(),v=y.useMemo(()=>yy(k),[k]),x=b===void 0?void 0:m.get(b)?.abbr??b,[C,D]=y.useState(!1),S=t!==null;y.useEffect(()=>{S||D(!1)},[S]);const P=r?o.entries.get(r):void 0,E=$l(),L=d,I=S?n?.anchor:P?.anchor,B=S?n?.spotlight:P?.spotlight,O=(S?n?.highlight:P?.highlight)??"dim",_=()=>{if(!n||n.beatCount===0)return null;const U=n.beatIndex+1;return u.jsx("span",{className:"help-tour-dots",title:`Screen ${U+1} of ${n.beatCount+1} in this step`,children:Array.from({length:n.beatCount},(J,pe)=>u.jsx("span",{className:pe<U?"help-dot help-dot-on":"help-dot"},pe))})},[T,W]=y.useState(!1),[fe,N]=y.useState(!1),[G,j]=y.useState(void 0),[X,oe]=y.useState(!1),re=y.useRef(null),[,Oe]=y.useState(0),be=P?.once,Ee=be!==void 0&&Cy(be),ve=y.useMemo(()=>({...be===void 0?os:Py(()=>{Ay(be),Oe(U=>U+1)}),img:wy(w)}),[be,w]),Ce=(S?n?.blocks??[]:[P?.description??""]).map(U=>Ee?Ty(U):U).filter(Boolean),q=(S?n?.width:void 0)??Math.max(Ny(Ce.join(`

`)),S?Vy():0),Q=y.useRef(!1);y.useEffect(()=>{Q.current=!1},[r,I]);const ie=E.reset;y.useEffect(()=>{ie()},[r,t,ie]),y.useLayoutEffect(()=>{if(!r){W(!1),j(void 0);return}let U=null;const J=()=>{const me=L(I);me!==U&&(U?.removeAttribute(Ci),U=me,W(!!me),j(me?.closest("[data-graph-direction]")?.getAttribute("data-graph-direction")==="RIGHT"?"below":void 0),me&&(me.setAttribute(Ci,""),Q.current||(Q.current=!0,me.scrollIntoView({block:"center",behavior:"smooth"}))))};J();const pe=new MutationObserver(J);return pe.observe(document.body,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["data-help-id"]}),()=>{pe.disconnect(),U?.removeAttribute(Ci),W(!1),j(void 0)}},[r,I,L]),y.useLayoutEffect(()=>{if(!r||!B){N(!1);return}let U=null;const J=()=>{const me=L(B);me!==U&&(U?.removeAttribute(Ai),U=me,N(!!me),me?.setAttribute(Ai,""))};J();const pe=new MutationObserver(J);return pe.observe(document.body,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["data-help-id"]}),()=>{pe.disconnect(),U?.removeAttribute(Ai),N(!1)}},[r,B,L]);const ae=600,we=S&&n?.change!=null&&I!==void 0&&I.kind!=="none",[Ne,Ve]=y.useState(!1);y.useEffect(()=>{if(!we){Ve(!0);return}Ve(!1);const U=window.setTimeout(()=>Ve(!0),ae);return()=>window.clearTimeout(U)},[we,t]);const dt=Ne||T,ft=S?n?.address??"tour":r??"none";y.useEffect(()=>{const U=re.current;U&&(P&&dt?U.matches(":popover-open")||U.showPopover():U.matches(":popover-open")&&U.hidePopover())},[P,dt,ft]),y.useEffect(()=>{(!e||S)&&oe(!1)},[e,S]);const pt=y.useMemo(()=>e&&!S?[...o.entries.values()].filter(U=>L(U.anchor)).slice(0,Sy).map((U,J)=>({id:U.id,title:U.title,name:`${ky}-${J}`})):[],[e,S,o,L]);return y.useLayoutEffect(()=>{const U=pt.map(J=>{const pe=L(o.entries.get(J.id)?.anchor);return pe?.setAttribute(jr,J.name),pe}).filter(Boolean);return()=>U.forEach(J=>J.removeAttribute(jr))},[pt,o,L]),u.jsxs(u.Fragment,{children:[(fe||T)&&r&&O!=="none"&&u.jsx("div",{className:`help-spotlight${O==="ring"?" help-spotlight-ring":""}`,"data-on-spotlight":fe?"":void 0}),pt.map(({id:U,title:J,name:pe})=>u.jsx("button",{className:"help-hint",title:J??U,style:{positionAnchor:pe},onMouseEnter:()=>{X||f(U)},onMouseLeave:()=>{X||a()},onClick:me=>{me.stopPropagation(),oe(!0),f(U)},children:"?"},U)),u.jsx("div",{ref:re,popover:"manual","data-help-popover":"","data-anchored":T&&!E.offset?"":void 0,className:"help-popover",style:{...Iy(T,S?n?.position:void 0,S?n?.offsetX:void 0,q,T?null:g(),G),...E.offset?{positionArea:"none",left:E.offset.left,top:E.offset.top,right:"auto",bottom:"auto",margin:0,transform:"none"}:{}},children:P&&u.jsxs(u.Fragment,{children:[u.jsxs("h4",{className:"help-popover-title",onPointerDown:E.onPointerDown,style:{cursor:E.offset?"grabbing":"grab",userSelect:"none"},title:"Drag to move",children:[S&&x&&u.jsx("span",{className:"help-popover-tour",children:x}),P.title]}),S&&n?.action&&u.jsxs("div",{className:"help-popover-action",children:[u.jsx("span",{className:"help-popover-action-mark","aria-hidden":"true",children:"✓"}),u.jsx("div",{children:u.jsx(en,{children:n.action})})]}),S&&p&&n?.change&&!n.action&&u.jsxs("div",{className:"help-popover-action",style:{opacity:.85},children:[u.jsx("span",{className:"help-popover-action-mark","aria-hidden":"true",children:"⚠"}),u.jsxs("div",{children:[u.jsx("em",{children:"Authoring:"})," this position changes the app (",u.jsx("code",{children:n.change}),") but has no ",u.jsx("code",{children:"Action:"}),"."]})]}),Ce.length>0&&u.jsx("div",{className:"help-popover-body",children:Ce.map((U,J,pe)=>u.jsx("div",{className:J===pe.length-1?void 0:"help-beat-past",children:u.jsx(en,{components:ve,urlTransform:by,remarkPlugins:v,children:U})},J))}),P.interactions.length>0&&u.jsx("ul",{className:"help-popover-interactions",children:P.interactions.map((U,J)=>u.jsx("li",{children:u.jsx(en,{components:os,children:U})},J))}),P.shortcut&&u.jsxs("p",{className:"help-popover-shortcut",children:["Shortcut: ",u.jsx("kbd",{children:P.shortcut})]}),P.context&&u.jsx("div",{className:"help-popover-context",children:u.jsx(en,{children:P.context})}),S?u.jsxs("div",{className:"help-tour-nav",children:[u.jsxs("span",{className:"help-tour-count",title:`Position ${t+1} of ${i.length}`,children:[n?.step," / ",s]}),_(),u.jsx("button",{className:"help-tour-map-btn",onClick:()=>D(U=>!U),"aria-expanded":C,title:"Show the tour outline",children:"⊞"}),u.jsx("span",{className:"help-tour-spacer"}),u.jsx("button",{onClick:c,disabled:t===0,title:"Previous (← arrow key)",children:"← back"}),u.jsx("button",{onClick:l,className:"help-tour-next",title:"Next (→ arrow key)",children:t+1===i.length?"done":"next →"}),u.jsx("button",{onClick:h,title:"End the tour and undo what it added (Esc)",children:"✕"})]}):u.jsxs("div",{className:"help-tour-nav",children:[u.jsx("span",{className:"help-tour-spacer"}),u.jsx("button",{onClick:()=>{oe(!1),a()},children:"close"})]}),p&&u.jsx(Dy,{address:S?n?.address:P.id,searchFor:S?n?.searchFor:`### ${P.id}`})]})},ft),C&&S&&u.jsx(Yl,{scope:"tour",onClose:()=>D(!1)})]})}function Dy({address:e,searchFor:t}){const[n,i]=y.useState(!1);return y.useEffect(()=>{if(!n)return;const s=setTimeout(()=>i(!1),1200);return()=>clearTimeout(s)},[n]),!e||!t?null:u.jsxs("button",{type:"button",className:"help-popover-address",title:`Copy “${t}” — search help-content.md for it`,onClick:()=>{navigator.clipboard?.writeText(t).then(()=>i(!0),()=>{})},children:[e,n?" ✓":""]})}const ec=320,My=320,Oy=800,Ry=8,jy=24,Ly=3;function Ny(e){const t=e.trim().length;return t===0?ec:Math.round(Math.min(Oy,Math.max(My,Math.sqrt(t*Ry*jy*Ly))))}function Vy(){return 393}function Iy(e,t,n,i,s,o){const r=window.innerWidth,a=window.innerHeight,l=Math.min(i??ec,r-16);if(!e){const h=s??new DOMRect(0,0,r,a),f=h.left+h.width/2;return{left:Math.max(8,Math.min(f-l/2,r-l-8)),top:"50%",transform:"translateY(-50%)",maxHeight:`${a-16}px`,width:l}}return{positionArea:t?{right:"inline-end span-block-end",left:"inline-start span-block-end",top:"block-start span-inline-end",bottom:"block-end span-inline-end"}[t]:o==="below"?"block-end span-inline-end":"inline-end span-block-end",width:l,...By(n)}}function By(e){return e?{marginLeft:"px"in e?`${e.px}px`:`calc(anchor-size(${e.of}) * ${e.times})`}:{}}const Pi=e=>e&&e.trim()?e.trim():void 0;function $y(e){return{"model-description":t=>Pi(e.getClassDescription(t)),"enum-description":t=>Pi(e.getEnumDetail(t)?.description),"category-label":t=>Pi(Vr.find(n=>n.id===t)?.label),edge:t=>t in ne.kinds?`![${ne.kinds[t].label}](widget:edge:${t})`:void 0,relation:t=>{const n=tc(t);return n?`![${n.left} ${n.right}](widget:relation:${t})`:void 0}}}function tc(e){const[t,n,i]=e.split(":");return t&&t in ne.kinds&&n&&i?{kind:t,left:n,right:i}:void 0}const Fy={edge:e=>e in ne.kinds?u.jsx(In,{kind:e,width:40,className:"help-inline-widget"}):null,relation:e=>{const t=tc(e);return t?u.jsxs("span",{className:"help-inline-relation",children:[u.jsx("code",{children:t.left}),u.jsx(In,{kind:t.kind,width:40,className:"help-inline-widget"}),u.jsx("code",{children:t.right})]}):null}},_y={...Object.fromEntries(Object.entries(ne.kinds).map(([e,t])=>[e,t.color])),entity:ze.entity,enum:ze.enum,"data-type":ze.dataType,variable:ze.variable,slot:ze.slot,...Object.fromEntries(Ir.flatMap((e,t)=>[[`sibling-${t}`,e.text],[`sibling-${t}-fill`,e.fill]]))},Hy=`# BDCHM Explorer help

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
     - ~~Title: none~~
     - Keep: true
     - Highlight: dim
     - Spotlight: slot-row:Condition.affected_body_site
     - Description:
       For instance, **Condition** has an optional (0..1) \`affected_body_site\` attribute
       pointing at **BodySite**, as some conditions can occurr at
       specific body sites.
  2. own-bkwd
     - ~~Title: none~~
     - Keep: true
     - Highlight: dim
     - Spotlight: slot-row:Condition.associated_participant
     - Description:
       It also has a required (1..1) \`associated_participant\` attribute
       pointing at **Participant**, as condition records must belong to someone
       in a study.
  3. - two-edge-types
     - ~~Title: none~~
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
     - ~~Title: none~~
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
  1. association
     - Spotlight: slot-row:Condition.associated_participant
     - Only: sel=Document~Specimen~SpecimenContainer~SpecimenStorageActivity
     - Anchor: node-box:SpecimenContainer
     - ~~Position:~~ right
     - Description:
       The model currently has two attributes for which ownership didn't
       make sense in either direction
       When the target is considered to be by* :s[owned by]{color=own-bkwd} its
       target, it places the target to the left and draws a backward-pointing
       arrow {{edge:association}}
       :::s{center color=entity}
         {{relation:association:SpecimenStorageActivity.container:SpecimenContainer}}
       :::

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
`,Ws={inTour:!1,held:[],tempHeld:[],tour:[],region:0,tourStates:[],scalars:{}},zy="~";function Lr(e,t){return e&&t.includes(e)?e:null}function nc(e,t=!1){const n=new URLSearchParams(e),i={};if(n.get("panels")==="0"){for(const l of Pl)i[l]=!1;i.detail=null}n.has("detail")&&(i.detail=n.get("detail")||null),n.has("roots")&&(i.roots=n.get("roots")==="1"),n.has("sibs")&&(i.sibs=n.get("sibs")==="1"),n.has("legend")&&(i.legend=n.get("legend")==="1"),n.has("cases")&&(i.cases=n.get("cases")==="1");const s=Lr(n.get("dir"),["RIGHT","DOWN"]);s&&(i.dir=s);const o=Lr(n.get("merge"),["near","far","bend","off"]);o&&(i.merge=o);const r=n.get("sel"),a=r?r.split(zy).filter(Boolean):El(n);return t?{sel:a,scalars:i,replace:!0}:{sel:a,scalars:i}}function $t(e,t){return[...new Set([...e,...t])]}function Wy(e){return{...Ws,inTour:!0,held:[...e]}}function Gy(){return Ws}function Uy(e){return $t(e.held,e.tempHeld)}function ic(e,t){const n=t.replace?e.region+1:e.region,i=t.replace?[...t.sel]:$t(e.tour,t.sel),s={...e.scalars,...t.scalars};return{...e,tour:i,region:n,scalars:s,tourStates:[...e.tourStates,{sel:i,scalars:s,region:n}]}}function sc(e){if(e.tourStates.length===0)return e;const t=e.tourStates.slice(0,-1),n=t[t.length-1];return{...e,tourStates:t,tour:n?n.sel:[],region:n?n.region:0}}function Gs(e){return e.region>0}function Ky(e,t){if(!e.inTour)return e;const n=Gs(e)?"tempHeld":"held";return e[n].includes(t)?e:{...e,[n]:[...e[n],t]}}function qy(e,t){if(!e.inTour)return e;const n=i=>i.filter(s=>s!==t);return{...e,tour:n(e.tour),tempHeld:n(e.tempHeld),held:Gs(e)?e.held:n(e.held)}}function Us(e,t){if(!t.inTour)return e;const n=Gs(t)?$t(t.tour,t.tempHeld):$t($t(t.tour,t.tempHeld),t.held);return{...e,...t.scalars,sel:n}}function Qy(){const{modelData:e,loading:t,error:n}=bc(),i=y.useMemo(()=>e?new wc(e):null,[e]),{setTextResolvers:s}=ut(),o=y.useMemo(()=>i?$y(i):void 0,[i]);y.useEffect(()=>s(o),[o,s]);const r=y.useMemo(()=>We(),[]),[a,l]=y.useState(()=>new Set(r.sel)),[c,h]=y.useState(r.detail),[f,d]=y.useState(!1),g=y.useRef(!1),[p,b]=y.useState(r.roots),[m,w]=y.useState(r.sibs),[k,v]=y.useState(r.dir),[x,C]=y.useState(r.merge),[D,S]=y.useState(r.cases),[P,E]=y.useState(r.legend),[L,I]=y.useState(!1),B=y.useCallback(N=>{l(new Set(N.sel)),b(!!N.roots),h(null)},[]);y.useEffect(()=>{const N=()=>{const G=We();l(new Set(G.sel)),h(G.detail),b(G.roots),w(G.sibs),v(G.dir),C(G.merge),E(G.legend),S(G.cases)};return window.addEventListener("popstate",N),window.addEventListener("explore:state-from-url",N),()=>{window.removeEventListener("popstate",N),window.removeEventListener("explore:state-from-url",N)}},[]),y.useEffect(()=>{const N={sel:[...a],detail:c,roots:p,sibs:m,dir:k,merge:x,legend:P,cases:D},G=g.current;g.current=!1,Dl(N,{push:G})},[a,c,p,m,k,x,P,D]);const O=y.useCallback(N=>{yt(N,!We().sel.includes(N)),l(G=>{const j=new Set(G);return j.has(N)?j.delete(N):j.add(N),j})},[]),_=y.useCallback(N=>{yt(N,!0),l(G=>G.has(N)?G:new Set(G).add(N))},[]),T=y.useCallback(N=>{yt(N,!1),l(G=>{if(!G.has(N))return G;const j=new Set(G);return j.delete(N),j})},[]),W=y.useCallback(N=>{l(j=>j.size===N.length&&N.every(X=>j.has(X))?j:(g.current=!0,new Set(N)));const G=new Set(N);for(const j of We().sel)G.has(j)||yt(j,!1);for(const j of N)yt(j,!0)},[]),fe=y.useCallback(()=>{for(const N of We().sel)yt(N,!1);l(new Set),h(null),d(!1),b(!1)},[]);return n?u.jsxs("div",{className:"p-8 text-red-600",children:["Failed to load model data: ",String(n)]}):t||!i?u.jsx("div",{className:"p-8 text-gray-400",children:"Loading model…"}):u.jsxs("div",{className:"relative flex flex-col h-screen bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100",children:[u.jsxs("header",{className:"flex items-center justify-between px-4 py-2 bg-blue-600 text-white shrink-0",children:[u.jsxs("div",{children:[u.jsx("h1",{"data-help-id":"app-title",className:"text-lg font-bold leading-tight cursor-pointer hover:opacity-80 transition-opacity",onClick:fe,title:"Click to clear the selection and reset the view",children:"BDCHM Explorer"}),u.jsx("p",{className:"text-xs text-blue-100",children:"BioData Catalyst Harmonized Model"})]}),u.jsxs("div",{className:"flex items-center gap-4",children:[u.jsx(nb,{}),u.jsx(hg,{}),u.jsx(Qm,{onOpenLegend:()=>E(N=>!N),onOpenCases:()=>S(N=>!N),legendOpen:P,casesOpen:D,anyPanelOpen:P||D||c!==null,onClosePanels:()=>{E(!1),S(!1),h(null)}}),u.jsx("button",{onClick:async()=>{const N=ym({sel:[...a],detail:c,roots:p,sibs:m,dir:k,merge:x,legend:P,cases:D});try{await navigator.clipboard.writeText(N),I(!0),window.setTimeout(()=>I(!1),1500)}catch{I(!1),window.prompt("Copy this link:",N)}},"data-help-id":"copy-link",className:"text-sm underline text-blue-100 hover:text-white",title:"Copy a link that reproduces exactly this view, settings included",children:L?"✓ copied":"copy link"}),u.jsx("a",{href:"/dynamic-model-var-docs/previous.html",className:"text-sm underline text-blue-100 hover:text-white",children:"previous views"}),u.jsx("a",{href:"https://github.com/Sigfried/dynamic-model-var-docs",target:"_blank",rel:"noopener noreferrer",className:"text-blue-100 hover:text-white",title:"Source code on GitHub","aria-label":"Source code on GitHub",children:u.jsx("svg",{viewBox:"0 0 16 16",width:"18",height:"18",fill:"currentColor","aria-hidden":!0,children:u.jsx("path",{d:"M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"})})})]})]}),P&&u.jsx(Wm,{onClose:()=>E(!1),onSelect:N=>B({name:"ad hoc",note:"",sel:N}),dataService:i}),D&&u.jsx(Fm,{onClose:()=>S(!1),onApply:B,selectedIds:a,dataService:i,offset:P}),u.jsxs("div",{className:"flex-1 flex min-h-0",children:[f?u.jsxs("button",{onClick:()=>d(!1),title:"Show entity selection",className:`shrink-0 w-8 border-r border-gray-200 dark:border-slate-700
                       bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700
                       flex flex-col items-center gap-2 py-2 text-gray-400`,children:[u.jsx("span",{className:"text-xs",children:"▶"}),u.jsxs("span",{className:"text-[10px] uppercase tracking-wider [writing-mode:vertical-rl]",children:[i.getConceptLabel("entity",!0),a.size>0?` (${a.size})`:""]})]}):u.jsxs("div",{className:"w-80 shrink-0 flex flex-col min-h-0 border-r border-gray-200 dark:border-slate-700",children:[u.jsx("div",{className:"flex-1 overflow-y-auto min-h-0","data-help-id":"selection-tree",children:u.jsx(Dc,{dataService:i,selectedIds:a,onToggle:O,onShowCategory:W})}),u.jsx("button",{onClick:()=>d(!0),title:"Hide entity selection",className:`shrink-0 px-3 py-1 text-xs text-gray-400 border-t border-gray-200
                         dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 text-left`,children:"◀ Hide"})]}),u.jsx("div",{className:"flex-1 min-w-0","data-help-id":"graph-canvas",children:a.size===0?u.jsx("div",{className:"h-full flex items-center justify-center text-sm text-gray-400 p-8",children:"Select entities on the left to build the ownership subgraph."}):u.jsx(Lm,{dataService:i,selectedIds:a,onNodeClick:h,onAdd:_,onRemove:T,pathToRoot:p,onTogglePathToRoot:()=>b(N=>!N),direction:k,setDirection:v,mergeMode:x,setMergeMode:C,mergeSibs:m,setMergeSibs:w})}),c&&u.jsx(Nm,{classId:c,dataService:i,onClose:()=>h(null),onNavigate:h,isSelected:a.has(c),onToggleSelect:O})]})]})}let de=Ws;function yt(e,t){de=t?Ky(de,e):qy(de,e)}function Un(e){Dl(e),window.dispatchEvent(new Event("explore:state-from-url"))}function Yy(){de=Wy(We().sel)}function Xy(){if(!de.inTour)return;const e=Uy(de),t=We();de=Gy(),Un({...t,sel:e})}function Zy(e,t=!1){de=ic(de,nc(e,t)),Un(Us(We(),de))}function Jy(){de=sc(de),Un(Us(We(),de))}function eb(e,t){for(let n=0;n<t;n++)de=sc(de);for(const n of e)de=ic(de,nc(n.query,n.replace));Un(Us(We(),de))}function tb(){return u.jsxs(pg,{markdown:Hy,widgets:Fy,colors:_y,onPushChange:Zy,onPopChange:Jy,onJumpChanges:eb,onTourStart:Yy,onTourEnd:Xy,children:[u.jsx(Qy,{}),u.jsx(Ey,{})]})}function nb(){const{helpMode:e,toggleHelpMode:t,startTour:n}=ut();return y.useEffect(()=>{pm()&&n()},[]),u.jsx("span",{className:"flex items-center gap-2","data-help-id":"help-button",children:Gm})}xc.createRoot(document.getElementById("root")).render(u.jsx(y.StrictMode,{children:u.jsx(tb,{})}));
