import{i as Mi,p as dc,r as b,j as h,E as Ke,O as Ys,g as fc,a as _r,b as Hr,S as pc,c as Wr,d as mc,s as gc,w as yc,R as He,e as bc,f as wc,m as xc,h as vc,k as kc,l as zr,n as Xs,o as Gr,v as Tc,q as Yn,t as Ye,u as nt,x as Jt,y as Ae,z as Pn,A as En,M as en,B as Sc,C as Cc,D as Ac,F as Pc}from"./index-BJlO9rLl.js";function Ur(e){return[...new Set([...e.classIds,...e.pins])]}const Ec=e=>`entity-row:${e}`,Dc=e=>`entity-checkbox:${e}`,Mc=e=>`category-row:${e}`,Oc=e=>`node-box:${e}`,Rc=e=>`child-header:${e}`,jc=(e,t)=>`slot-row:${e}.${t}`,Kr=e=>Mi(e.id)?dc(e.id):e.id,Lc=e=>Oc(Kr(e)),Nc=(e,t)=>jc(t.declaringClass??Kr(e),t.slot);function Vc({dataService:e,selectedIds:t,onToggle:n,onShowCategory:i}){const s=b.useMemo(()=>e.getCategoryTrees(),[e]),[r,o]=b.useState(new Set),a=l=>o(u=>{const f=new Set(u);return f.has(l)?f.delete(l):f.add(l),f}),c=s.reduce((l,u)=>l+u.classIds.length,0);return h.jsxs("div",{className:"text-sm",children:[h.jsx("div",{className:"flex items-baseline gap-2 px-3 py-2 border-b border-gray-200 dark:border-slate-700",children:h.jsxs("span",{className:"font-semibold flex-1",children:[e.getConceptLabel("entity",!0)," (",c,")"]})}),s.map(l=>{const u=r.has(l.id),f=l.classIds.filter(d=>t.has(d)).length;return h.jsxs("div",{children:[h.jsxs("div",{"data-help-id":Mc(l.id),className:`w-full flex items-stretch font-medium
                         bg-gray-50 dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700`,children:[h.jsxs("button",{type:"button",onClick:()=>a(l.id),className:`flex-1 min-w-0 flex items-center gap-2 px-3 py-1.5 text-left
                           hover:bg-gray-100 dark:hover:bg-slate-700`,children:[h.jsx("span",{className:"text-xs text-gray-400",children:u?"▶":"▼"}),h.jsx("span",{className:"flex-1 truncate",children:l.label}),f>0&&h.jsxs("span",{className:"text-xs text-gray-400",children:[f," / ",l.classIds.length]})]}),i&&h.jsx("button",{type:"button","data-show-category":l.id,title:`Draw the ${l.label} content view — replaces the canvas`,onClick:()=>i(Ur(l)),className:`px-2.5 shrink-0 text-gray-400 border-l border-gray-100
                             dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700
                             hover:text-blue-600 dark:hover:text-sky-400`,children:"⊞"})]}),!u&&l.roots.map(d=>h.jsx(Qr,{node:d,depth:0,selectedIds:t,onToggle:n},d.classId))]},l.id)})]})}function Qr({node:e,depth:t,selectedIds:n,onToggle:i}){const{classId:s}=e;return h.jsxs(h.Fragment,{children:[h.jsxs("label",{"data-class-row":s,"data-help-id":Ec(s),className:`flex items-center gap-2 pr-3 py-1 cursor-pointer
                    hover:bg-blue-50 dark:hover:bg-slate-800
                    ${n.has(s)?"bg-blue-50 dark:bg-slate-800":""}`,style:{paddingLeft:`${.75+t*1}rem`},children:[h.jsx("input",{type:"checkbox","data-help-id":Dc(s),checked:n.has(s),onChange:()=>i(s)}),h.jsxs("span",{className:"flex-1 min-w-0 truncate",children:[h.jsx("span",{className:"font-mono text-xs",children:s}),e.outOfCategoryParent&&h.jsxs("span",{className:"ml-1 text-[10px] text-gray-400 dark:text-slate-500",title:`Extends ${e.outOfCategoryParent}, which is in another category`,children:["↳ ",e.outOfCategoryParent]})]})]}),e.children.map(r=>h.jsx(Qr,{node:r,depth:t+1,selectedIds:n,onToggle:i},r.classId))]})}const cs=b.createContext({});function us(e){const t=b.useRef(null);return t.current===null&&(t.current=e()),t.current}const Ic=typeof window<"u",Dn=Ic?b.useLayoutEffect:b.useEffect,Fn=b.createContext(null);function hs(e,t){e.indexOf(t)===-1&&e.push(t)}function Mn(e,t){const n=e.indexOf(t);n>-1&&e.splice(n,1)}const Ge=(e,t,n)=>n>t?t:n<e?e:n;let _n=()=>{};const Ze={},qr=e=>/^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(e),Yr=e=>typeof e=="object"&&e!==null,Xr=e=>/^0[^.\s]+$/u.test(e);function Zr(e){let t;return()=>(t===void 0&&(t=e()),t)}const Re=e=>e,Gt=(...e)=>e.reduce((t,n)=>i=>n(t(i))),Ft=(e,t,n)=>{const i=t-e;return i?(n-e)/i:1};class ds{constructor(){this.subscriptions=[]}add(t){return hs(this.subscriptions,t),()=>Mn(this.subscriptions,t)}notify(t,n,i){const s=this.subscriptions.length;if(s)if(s===1)this.subscriptions[0](t,n,i);else for(let r=0;r<s;r++){const o=this.subscriptions[r];o&&o(t,n,i)}}getSize(){return this.subscriptions.length}clear(){this.subscriptions.length=0}}const je=e=>e*1e3,Oe=e=>e/1e3,Jr=(e,t)=>t?e*(1e3/t):0,ea=(e,t,n)=>(((1-3*n+3*t)*e+(3*n-6*t))*e+3*t)*e,Bc=1e-7,$c=12;function Fc(e,t,n,i,s){let r,o,a=0;do o=t+(n-t)/2,r=ea(o,i,s)-e,r>0?n=o:t=o;while(Math.abs(r)>Bc&&++a<$c);return o}function Ut(e,t,n,i){if(e===t&&n===i)return Re;const s=r=>Fc(r,0,1,e,n);return r=>r===0||r===1?r:ea(s(r),t,i)}const ta=e=>t=>t<=.5?e(2*t)/2:(2-e(2*(1-t)))/2,na=e=>t=>1-e(1-t),ia=Ut(.33,1.53,.69,.99),fs=na(ia),sa=ta(fs),oa=e=>e>=1?1:(e*=2)<1?.5*fs(e):.5*(2-Math.pow(2,-10*(e-1))),ps=e=>1-Math.sin(Math.acos(e)),ra=na(ps),aa=ta(ps),_c=Ut(.42,0,1,1),Hc=Ut(0,0,.58,1),la=Ut(.42,0,.58,1),Wc=e=>Array.isArray(e)&&typeof e[0]!="number",ca=e=>Array.isArray(e)&&typeof e[0]=="number",zc={linear:Re,easeIn:_c,easeInOut:la,easeOut:Hc,circIn:ps,circInOut:aa,circOut:ra,backIn:fs,backInOut:sa,backOut:ia,anticipate:oa},Gc=e=>typeof e=="string",Zs=e=>{if(ca(e)){_n(e.length===4);const[t,n,i,s]=e;return Ut(t,n,i,s)}else if(Gc(e))return zc[e];return e},tn=["setup","read","resolveKeyframes","preUpdate","update","preRender","render","postRender"];function Uc(e){let t=new Set,n=new Set,i=!1,s=!1;const r=new WeakSet;let o={delta:0,timestamp:0,isProcessing:!1};function a(l){r.has(l)&&(c.schedule(l),e()),l(o)}const c={schedule:(l,u=!1,f=!1)=>{const y=f&&i?t:n;return u&&r.add(l),y.add(l),l},cancel:l=>{n.delete(l),r.delete(l)},process:l=>{if(o=l,i){s=!0;return}i=!0;const u=t;t=n,n=u,t.forEach(a),t.clear(),i=!1,s&&(s=!1,c.process(l))}};return c}const Kc=40;function ua(e,t){let n=!1,i=!0;const s={delta:0,timestamp:0,isProcessing:!1},r=()=>n=!0,o=tn.reduce((v,x)=>(v[x]=Uc(r),v),{}),{setup:a,read:c,resolveKeyframes:l,preUpdate:u,update:f,preRender:d,render:y,postRender:m}=o,w=()=>{const v=Ze.useManualTiming,x=v?s.timestamp:performance.now();n=!1,v||(s.delta=i?1e3/60:Math.max(Math.min(x-s.timestamp,Kc),1)),s.timestamp=x,s.isProcessing=!0,a.process(s),c.process(s),l.process(s),u.process(s),f.process(s),d.process(s),y.process(s),m.process(s),s.isProcessing=!1,n&&t&&(i=!1,e(w))},p=()=>{n=!0,i=!0,s.isProcessing||e(w)};return{schedule:tn.reduce((v,x)=>{const C=o[x];return v[x]=(D,T=!1,P=!1)=>(n||p(),C.schedule(D,T,P)),v},{}),cancel:v=>{for(let x=0;x<tn.length;x++)o[tn[x]].cancel(v)},state:s,steps:o}}const{schedule:te,cancel:Je,state:ge,steps:Xn}=ua(typeof requestAnimationFrame<"u"?requestAnimationFrame:Re,!0);let yn;function Qc(){yn=void 0}const ke={now:()=>(yn===void 0&&ke.set(ge.isProcessing||Ze.useManualTiming?ge.timestamp:performance.now()),yn),set:e=>{yn=e,queueMicrotask(Qc)}},ha=e=>t=>typeof t=="string"&&t.startsWith(e),da=ha("--"),qc=ha("var(--"),ms=e=>qc(e)?Yc.test(e.split("/*")[0].trim()):!1,Yc=/var\(--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)$/iu;function Js(e){return typeof e!="string"?!1:e.split("/*")[0].includes("var(--")}const St={test:e=>typeof e=="number",parse:parseFloat,transform:e=>e},_t={...St,transform:e=>Ge(0,1,e)},nn={...St,default:1},jt=e=>Math.round(e*1e5)/1e5,gs=/-?(?:\d+(?:\.\d+)?|\.\d+)/gu;function Xc(e){return e==null}const Zc=/^(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))$/iu,ys=(e,t)=>n=>!!(typeof n=="string"&&Zc.test(n)&&n.startsWith(e)||t&&!Xc(n)&&Object.prototype.hasOwnProperty.call(n,t)),fa=(e,t,n)=>i=>{if(typeof i!="string")return i;const[s,r,o,a]=i.match(gs);return{[e]:parseFloat(s),[t]:parseFloat(r),[n]:parseFloat(o),alpha:a!==void 0?parseFloat(a):1}},Jc=e=>Ge(0,255,e),Zn={...St,transform:e=>Math.round(Jc(e))},ot={test:ys("rgb","red"),parse:fa("red","green","blue"),transform:({red:e,green:t,blue:n,alpha:i=1})=>"rgba("+Zn.transform(e)+", "+Zn.transform(t)+", "+Zn.transform(n)+", "+jt(_t.transform(i))+")"};function eu(e){let t="",n="",i="",s="";return e.length>5?(t=e.substring(1,3),n=e.substring(3,5),i=e.substring(5,7),s=e.substring(7,9)):(t=e.substring(1,2),n=e.substring(2,3),i=e.substring(3,4),s=e.substring(4,5),t+=t,n+=n,i+=i,s+=s),{red:parseInt(t,16),green:parseInt(n,16),blue:parseInt(i,16),alpha:s?parseInt(s,16)/255:1}}const Oi={test:ys("#"),parse:eu,transform:ot.transform},Kt=e=>({test:t=>typeof t=="string"&&t.endsWith(e)&&t.split(" ").length===1,parse:parseFloat,transform:t=>`${t}${e}`}),Ue=Kt("deg"),ze=Kt("%"),$=Kt("px"),tu=Kt("vh"),nu=Kt("vw"),eo={...ze,parse:e=>ze.parse(e)/100,transform:e=>ze.transform(e*100)},wt={test:ys("hsl","hue"),parse:fa("hue","saturation","lightness"),transform:({hue:e,saturation:t,lightness:n,alpha:i=1})=>"hsla("+Math.round(e)+", "+ze.transform(jt(t))+", "+ze.transform(jt(n))+", "+jt(_t.transform(i))+")"},le={test:e=>ot.test(e)||Oi.test(e)||wt.test(e),parse:e=>ot.test(e)?ot.parse(e):wt.test(e)?wt.parse(e):Oi.parse(e),transform:e=>typeof e=="string"?e:e.hasOwnProperty("red")?ot.transform(e):wt.transform(e),getAnimatableNone:e=>{const t=le.parse(e);return t.alpha=0,le.transform(t)}},iu=/(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))/giu;function su(e){return isNaN(e)&&typeof e=="string"&&(e.match(gs)?.length||0)+(e.match(iu)?.length||0)>0}const pa="number",ma="color",ou="var",ru="var(",to="${}",au=/var\s*\(\s*--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)|#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\)|-?(?:\d+(?:\.\d+)?|\.\d+)/giu;function kt(e){const t=e.toString(),n=[],i={color:[],number:[],var:[]},s=[];let r=0;const a=t.replace(au,c=>(le.test(c)?(i.color.push(r),s.push(ma),n.push(le.parse(c))):c.startsWith(ru)?(i.var.push(r),s.push(ou),n.push(c)):(i.number.push(r),s.push(pa),n.push(parseFloat(c))),++r,to)).split(to);return{values:n,split:a,indexes:i,types:s}}function lu(e){return kt(e).values}function ga({split:e,types:t}){const n=e.length;return i=>{let s="";for(let r=0;r<n;r++)if(s+=e[r],i[r]!==void 0){const o=t[r];o===pa?s+=jt(i[r]):o===ma?s+=le.transform(i[r]):s+=i[r]}return s}}function cu(e){return ga(kt(e))}const uu=e=>typeof e=="number"?0:le.test(e)?le.getAnimatableNone(e):e,hu=(e,t)=>typeof e=="number"?t?.trim().endsWith("/")?e:0:uu(e);function du(e){const t=kt(e);return ga(t)(t.values.map((i,s)=>hu(i,t.split[s])))}const $e={test:su,parse:lu,createTransformer:cu,getAnimatableNone:du};function Jn(e,t,n){return n<0&&(n+=1),n>1&&(n-=1),n<1/6?e+(t-e)*6*n:n<1/2?t:n<2/3?e+(t-e)*(2/3-n)*6:e}function fu({hue:e,saturation:t,lightness:n,alpha:i}){e/=360,t/=100,n/=100;let s=0,r=0,o=0;if(!t)s=r=o=n;else{const a=n<.5?n*(1+t):n+t-n*t,c=2*n-a;s=Jn(c,a,e+1/3),r=Jn(c,a,e),o=Jn(c,a,e-1/3)}return{red:Math.round(s*255),green:Math.round(r*255),blue:Math.round(o*255),alpha:i}}function On(e,t){return n=>n>0?t:e}const ee=(e,t,n)=>e+(t-e)*n,ei=(e,t,n)=>{const i=e*e,s=n*(t*t-i)+i;return s<0?0:Math.sqrt(s)},pu=[Oi,ot,wt],mu=e=>pu.find(t=>t.test(e));function no(e){const t=mu(e);if(!t)return!1;let n=t.parse(e);return t===wt&&(n=fu(n)),n}const io=(e,t)=>{const n=no(e),i=no(t);if(!n||!i)return On(e,t);const s={...n};return r=>(s.red=ei(n.red,i.red,r),s.green=ei(n.green,i.green,r),s.blue=ei(n.blue,i.blue,r),s.alpha=ee(n.alpha,i.alpha,r),ot.transform(s))},Ri=new Set(["none","hidden"]);function gu(e,t){return Ri.has(e)?n=>n<=0?e:t:n=>n>=1?t:e}function yu(e,t){return n=>ee(e,t,n)}function bs(e){return typeof e=="number"?yu:typeof e=="string"?ms(e)?On:le.test(e)?io:xu:Array.isArray(e)?ya:typeof e=="object"?le.test(e)?io:bu:On}function ya(e,t){const n=[...e],i=n.length,s=e.map((r,o)=>bs(r)(r,t[o]));return r=>{for(let o=0;o<i;o++)n[o]=s[o](r);return n}}function bu(e,t){const n={...e,...t},i={};for(const s in n)e[s]!==void 0&&t[s]!==void 0&&(i[s]=bs(e[s])(e[s],t[s]));return s=>{for(const r in i)n[r]=i[r](s);return n}}function wu(e,t){const n=[],i={color:0,var:0,number:0};for(let s=0;s<t.values.length;s++){const r=t.types[s],o=e.indexes[r][i[r]],a=e.values[o]??0;n[s]=a,i[r]++}return n}const xu=(e,t)=>{const n=$e.createTransformer(t),i=kt(e),s=kt(t);return i.indexes.var.length===s.indexes.var.length&&i.indexes.color.length===s.indexes.color.length&&i.indexes.number.length>=s.indexes.number.length?Ri.has(e)&&!s.values.length||Ri.has(t)&&!i.values.length?gu(e,t):Gt(ya(wu(i,s),s.values),n):On(e,t)};function ba(e,t,n){return typeof e=="number"&&typeof t=="number"&&typeof n=="number"?ee(e,t,n):bs(e)(e,t)}const vu=e=>{const t=({timestamp:n})=>e(n);return{start:(n=!0)=>te.update(t,n),stop:()=>Je(t),now:()=>ge.isProcessing?ge.timestamp:ke.now()}},wa=(e,t,n=10)=>{let i="";const s=Math.max(Math.round(t/n),2);for(let r=0;r<s;r++)i+=Math.round(e(r/(s-1))*1e4)/1e4+", ";return`linear(${i.substring(0,i.length-2)})`},ws=2e4;function xs(e,t=50,n=ws,i){let s=0,r=e.next(s);for(;!r.done&&s<n;)s+=t,r=e.next(s);return s>=n?1/0:s}function ku(e,t=100,n){const i=n({...e,keyframes:[0,t]}),s=Math.min(xs(i),ws);return{type:"keyframes",ease:r=>i.next(s*r).value/t,duration:Oe(s)}}const se={stiffness:100,damping:10,mass:1,velocity:0,duration:800,bounce:.3,visualDuration:.3,restSpeed:{granular:.01,default:2},restDelta:{granular:.005,default:.5},minDuration:.01,maxDuration:10,minDamping:.05,maxDamping:1};function ji(e,t){return e*Math.sqrt(1-t*t)}const Tu=12;function Su(e,t,n){let i=n;for(let s=1;s<Tu;s++)i=i-e(i)/t(i);return i}const ti=.001;function Cu({duration:e=se.duration,bounce:t=se.bounce,velocity:n=se.velocity,mass:i=se.mass}){let s,r,o=1-t;o=Ge(se.minDamping,se.maxDamping,o),e=Ge(se.minDuration,se.maxDuration,Oe(e)),o<1?(s=l=>{const u=l*o,f=u*e,d=u-n,y=ji(l,o),m=Math.exp(-f);return ti-d/y*m},r=l=>{const f=l*o*e,d=f*n+n,y=o*o*l*l*e,m=Math.exp(-f),w=ji(l*l,o);return(-s(l)+ti>0?-1:1)*((d-y)*m)/w}):(s=l=>{const u=Math.exp(-l*e),f=(l-n)*e+1;return-ti+u*f},r=l=>{const u=Math.exp(-l*e),f=(n-l)*(e*e);return u*f});const a=5/e,c=Su(s,r,a);if(e=je(e),isNaN(c))return{stiffness:se.stiffness,damping:se.damping,duration:e};{const l=c*c*i;return{stiffness:l,damping:o*2*Math.sqrt(i*l),duration:e}}}const Au=["duration","bounce"],Pu=["stiffness","damping","mass"];function so(e,t){return t.some(n=>e[n]!==void 0)}function Eu(e){let t={velocity:se.velocity,stiffness:se.stiffness,damping:se.damping,mass:se.mass,isResolvedFromDuration:!1,...e};if(!so(e,Pu)&&so(e,Au))if(t.velocity=0,e.visualDuration){const n=e.visualDuration,i=2*Math.PI/(n*1.2),s=i*i,r=2*Ge(.05,1,1-(e.bounce||0))*Math.sqrt(s);t={...t,mass:se.mass,stiffness:s,damping:r}}else{const n=Cu({...e,velocity:0});t={...t,...n,mass:se.mass},t.isResolvedFromDuration=!0}return t}function Rn(e=se.visualDuration,t=se.bounce){const n=typeof e!="object"?{visualDuration:e,keyframes:[0,1],bounce:t}:e;let{restSpeed:i,restDelta:s}=n;const r=n.keyframes[0],o=n.keyframes[n.keyframes.length-1],a={done:!1,value:r},{stiffness:c,damping:l,mass:u,duration:f,velocity:d,isResolvedFromDuration:y}=Eu({...n,velocity:-Oe(n.velocity||0)}),m=d||0,w=l/(2*Math.sqrt(c*u)),p=o-r,g=Oe(Math.sqrt(c/u)),k=w*g,v=Math.abs(p)<5;i||(i=v?se.restSpeed.granular:se.restSpeed.default),s||(s=v?se.restDelta.granular:se.restDelta.default);let x,C;if(w<1){const T=ji(g,w),P=(m+k*p)/T,E=k*P+p*T,L=k*p-P*T;let I=-1,B=0,O=0;const F=S=>{if(S!==I){I=S;const z=Math.exp(-k*S),fe=Math.sin(T*S),N=Math.cos(T*S);B=o-z*(P*fe+p*N),O=z*(E*fe+L*N)}};x=S=>(F(S),B),C=S=>(F(S),O)}else if(w===1){x=P=>o-Math.exp(-g*P)*(p+(m+g*p)*P);const T=m+g*p;C=P=>Math.exp(-g*P)*(g*T*P-m)}else{const T=g*Math.sqrt(w*w-1);x=I=>{const B=Math.exp(-k*I),O=Math.min(T*I,300);return o-B*((m+k*p)*Math.sinh(O)+T*p*Math.cosh(O))/T};const P=(m+k*p)/T,E=k*P-p*T,L=k*p-P*T;C=I=>{const B=Math.exp(-k*I),O=Math.min(T*I,300);return B*(E*Math.sinh(O)+L*Math.cosh(O))}}const D={calculatedDuration:y&&f||null,velocity:T=>je(C(T)),next:T=>{const P=x(T);if(y)a.done=T>=f;else{const E=je(C(T));a.done=Math.abs(E)<=i&&Math.abs(o-P)<=s}return a.value=a.done?o:P,a},toString:()=>{const T=Math.min(xs(D),ws),P=wa(E=>D.next(T*E).value,T,30);return T+"ms "+P},toTransition:()=>{}};return D}Rn.applyToOptions=e=>{const t=ku(e,100,Rn);return e.ease=t.ease,e.duration=je(t.duration),e.type="keyframes",e};function Li({keyframes:e,velocity:t=0,power:n=.8,timeConstant:i=325,bounceDamping:s=10,bounceStiffness:r=500,modifyTarget:o,min:a,max:c,restDelta:l=.5,restSpeed:u}){const f=e[0],d={done:!1,value:f},y=T=>T<a||T>c,m=T=>a===void 0?c:c===void 0||Math.abs(a-T)<Math.abs(c-T)?a:c;let w=n*t;const p=f+w,g=o===void 0?p:o(p);g!==p&&(w=g-f);const k=T=>-w*Math.exp(-T/i),v=T=>{const P=k(T);d.done=Math.abs(P)<=l,d.value=d.done?g:g+P};let x,C;const D=T=>{y(d.value)&&(x=T,C=Rn({keyframes:[d.value,m(d.value)],velocity:-k(T)/i*1e3,damping:s,stiffness:r,restDelta:l,restSpeed:u}))};return D(0),{calculatedDuration:null,next:T=>{let P=!1;return!C&&x===void 0&&(P=!0,v(T),D(T)),x!==void 0&&T>=x?C.next(T-x):(!P&&v(T),d)}}}function Du(e,t,n){const i=[],s=n||Ze.mix||ba,r=e.length-1;for(let o=0;o<r;o++){let a=s(e[o],e[o+1]);if(t){const c=Array.isArray(t)?t[o]||Re:t;a=Gt(c,a)}i.push(a)}return i}function Mu(e,t,{clamp:n=!0,ease:i,mixer:s}={}){const r=e.length;if(_n(r===t.length),r===1)return()=>t[0];if(r===2&&t[0]===t[1])return()=>t[1];const o=e[0]===e[1];e[0]>e[r-1]&&(e=[...e].reverse(),t=[...t].reverse());const a=Du(t,i,s),c=a.length,l=u=>{if(o&&u<e[0])return t[0];let f=0;if(c>1)for(;f<e.length-2&&!(u<e[f+1]);f++);const d=Ft(e[f],e[f+1],u);return a[f](d)};return n?u=>l(Ge(e[0],e[r-1],u)):l}function Ou(e,t){const n=e[e.length-1];for(let i=1;i<=t;i++){const s=Ft(0,t,i);e.push(ee(n,1,s))}}function Ru(e){const t=[0];return Ou(t,e.length-1),t}function ju(e,t){return e.map(n=>n*t)}function Lu(e,t){return e.map(()=>t||la).splice(0,e.length-1)}function Lt({duration:e=300,keyframes:t,times:n,ease:i="easeInOut"}){const s=Wc(i)?i.map(Zs):Zs(i),r={done:!1,value:t[0]},o=ju(n&&n.length===t.length?n:Ru(t),e),a=Mu(o,t,{ease:Array.isArray(s)?s:Lu(t,s)});return{calculatedDuration:e,next:c=>(r.value=a(c),r.done=c>=e,r)}}const Nu=5;function Vu(e,t,n){const i=Math.max(t-Nu,0);return Jr(n-e(i),t-i)}const Iu=e=>e!==null;function Hn(e,{repeat:t,repeatType:n="loop"},i,s=1){const r=e.filter(Iu),a=s<0||t&&n!=="loop"&&t%2===1?0:r.length-1;return!a||i===void 0?r[a]:i}const Bu={decay:Li,inertia:Li,tween:Lt,keyframes:Lt,spring:Rn};function xa(e){typeof e.type=="string"&&(e.type=Bu[e.type])}class vs{constructor(){this.updateFinished()}get finished(){return this._finished}updateFinished(){this._finished=new Promise(t=>{this.resolve=t})}notifyFinished(){this.resolve()}then(t,n){return this.finished.then(t,n)}}const $u=e=>e/100;class jn extends vs{constructor(t){super(),this.state="idle",this.startTime=null,this.isStopped=!1,this.currentTime=0,this.holdTime=null,this.playbackSpeed=1,this.delayState={done:!1,value:void 0},this.stop=()=>{const{motionValue:n}=this.options;n&&n.updatedAt!==ke.now()&&this.tick(ke.now()),this.isStopped=!0,this.state!=="idle"&&(this.teardown(),this.options.onStop?.())},this.options=t,this.initAnimation(),this.play(),t.autoplay===!1&&this.pause()}initAnimation(){const{options:t}=this;xa(t);const{type:n=Lt,repeat:i=0,repeatDelay:s=0,repeatType:r,velocity:o=0}=t;let{keyframes:a}=t;const c=n||Lt;c!==Lt&&typeof a[0]!="number"&&(this.mixKeyframes=Gt($u,ba(a[0],a[1])),a=[0,100]);const l=c({...t,keyframes:a});r==="mirror"&&(this.mirroredGenerator=c({...t,keyframes:[...a].reverse(),velocity:-o})),l.calculatedDuration===null&&(l.calculatedDuration=xs(l));const{calculatedDuration:u}=l;this.calculatedDuration=u,this.resolvedDuration=u+s,this.totalDuration=this.resolvedDuration*(i+1)-s,this.generator=l}updateTime(t){const n=Math.round(t-this.startTime)*this.playbackSpeed;this.holdTime!==null?this.currentTime=this.holdTime:this.currentTime=n}tick(t,n=!1){const{generator:i,totalDuration:s,mixKeyframes:r,mirroredGenerator:o,resolvedDuration:a,calculatedDuration:c}=this;if(this.startTime===null)return i.next(0);const{delay:l=0,keyframes:u,repeat:f,repeatType:d,repeatDelay:y,type:m,onUpdate:w,finalKeyframe:p}=this.options;this.speed>0?this.startTime=Math.min(this.startTime,t):this.speed<0&&(this.startTime=Math.min(t-s/this.speed,this.startTime)),n?this.currentTime=t:this.updateTime(t);const g=this.currentTime-l*(this.playbackSpeed>=0?1:-1),k=this.playbackSpeed>=0?g<0:g>s;this.currentTime=Math.max(g,0),this.state==="finished"&&this.holdTime===null&&(this.currentTime=s);let v=this.currentTime,x=i;if(f){const P=Math.min(this.currentTime,s)/a;let E=Math.floor(P),L=P%1;!L&&P>=1&&(L=1),L===1&&E--,E=Math.min(E,f+1),E%2&&(d==="reverse"?(L=1-L,y&&(L-=y/a)):d==="mirror"&&(x=o)),v=Ge(0,1,L)*a}let C;k?(this.delayState.value=u[0],C=this.delayState):C=x.next(v),r&&!k&&(C.value=r(C.value));let{done:D}=C;!k&&c!==null&&(D=this.playbackSpeed>=0?this.currentTime>=s:this.currentTime<=0);const T=this.holdTime===null&&(this.state==="finished"||this.state==="running"&&D);return T&&m!==Li&&(C.value=Hn(u,this.options,p,this.speed)),w&&w(C.value),T&&this.finish(),C}then(t,n){return this.finished.then(t,n)}get duration(){return Oe(this.calculatedDuration)}get iterationDuration(){const{delay:t=0}=this.options||{};return this.duration+Oe(t)}get time(){return Oe(this.currentTime)}set time(t){t=je(t),this.currentTime=t,this.startTime===null||this.holdTime!==null||this.playbackSpeed===0?this.holdTime=t:this.driver&&(this.startTime=this.driver.now()-t/this.playbackSpeed),this.driver?this.driver.start(!1):(this.startTime=0,this.state="paused",this.holdTime=t,this.tick(t))}getGeneratorVelocity(){const t=this.currentTime;if(t<=0)return this.options.velocity||0;if(this.generator.velocity)return this.generator.velocity(t);const n=this.generator.next(t).value;return Vu(i=>this.generator.next(i).value,t,n)}get speed(){return this.playbackSpeed}set speed(t){const n=this.playbackSpeed!==t;n&&this.driver&&this.updateTime(ke.now()),this.playbackSpeed=t,n&&this.driver&&(this.time=Oe(this.currentTime))}play(){if(this.isStopped)return;const{driver:t=vu,startTime:n}=this.options;this.driver||(this.driver=t(s=>this.tick(s))),this.options.onPlay?.();const i=this.driver.now();this.state==="finished"?(this.updateFinished(),this.startTime=i):this.holdTime!==null?this.startTime=i-this.holdTime:this.startTime||(this.startTime=n??i),this.state==="finished"&&this.speed<0&&(this.startTime+=this.calculatedDuration),this.holdTime=null,this.state="running",this.driver.start()}pause(){this.state="paused",this.updateTime(ke.now()),this.holdTime=this.currentTime}complete(){this.state!=="running"&&this.play(),this.state="finished",this.holdTime=null}finish(){this.notifyFinished(),this.teardown(),this.state="finished",this.options.onComplete?.()}cancel(){this.holdTime=null,this.startTime=0,this.tick(0),this.teardown(),this.options.onCancel?.()}teardown(){this.state="idle",this.stopDriver(),this.startTime=this.holdTime=null}stopDriver(){this.driver&&(this.driver.stop(),this.driver=void 0)}sample(t){return this.startTime=0,this.tick(t,!0)}attachTimeline(t){return this.options.allowFlatten&&(this.options.type="keyframes",this.options.ease="linear",this.initAnimation()),this.driver?.stop(),t.observe(this)}}function Fu(e){for(let t=1;t<e.length;t++)e[t]??(e[t]=e[t-1])}const rt=e=>e*180/Math.PI,Ni=e=>{const t=rt(Math.atan2(e[1],e[0]));return Vi(t)},_u={x:4,y:5,translateX:4,translateY:5,scaleX:0,scaleY:3,scale:e=>(Math.abs(e[0])+Math.abs(e[3]))/2,rotate:Ni,rotateZ:Ni,skewX:e=>rt(Math.atan(e[1])),skewY:e=>rt(Math.atan(e[2])),skew:e=>(Math.abs(e[1])+Math.abs(e[2]))/2},Vi=e=>(e=e%360,e<0&&(e+=360),e),oo=Ni,ro=e=>Math.sqrt(e[0]*e[0]+e[1]*e[1]),ao=e=>Math.sqrt(e[4]*e[4]+e[5]*e[5]),Hu={x:12,y:13,z:14,translateX:12,translateY:13,translateZ:14,scaleX:ro,scaleY:ao,scale:e=>(ro(e)+ao(e))/2,rotateX:e=>Vi(rt(Math.atan2(e[6],e[5]))),rotateY:e=>Vi(rt(Math.atan2(-e[2],e[0]))),rotateZ:oo,rotate:oo,skewX:e=>rt(Math.atan(e[4])),skewY:e=>rt(Math.atan(e[1])),skew:e=>(Math.abs(e[1])+Math.abs(e[4]))/2};function Ii(e){return e.includes("scale")?1:0}function Bi(e,t){if(!e||e==="none")return Ii(t);const n=e.match(/^matrix3d\(([-\d.e\s,]+)\)$/u);let i,s;if(n)i=Hu,s=n;else{const a=e.match(/^matrix\(([-\d.e\s,]+)\)$/u);i=_u,s=a}if(!s)return Ii(t);const r=i[t],o=s[1].split(",").map(zu);return typeof r=="function"?r(o):o[r]}const Wu=(e,t)=>{const{transform:n="none"}=getComputedStyle(e);return Bi(n,t)};function zu(e){return parseFloat(e.trim())}const Ct=["transformPerspective","x","y","z","translateX","translateY","translateZ","scale","scaleX","scaleY","rotate","rotateX","rotateY","rotateZ","skew","skewX","skewY"],At=new Set([...Ct,"pathRotation"]),lo=e=>e===St||e===$,Gu=new Set(["x","y","z"]),Uu=Ct.filter(e=>!Gu.has(e));function Ku(e){const t=[];return Uu.forEach(n=>{const i=e.getValue(n);i!==void 0&&(t.push([n,i.get()]),i.set(n.startsWith("scale")?1:0))}),t}const Xe={width:({x:e},{paddingLeft:t="0",paddingRight:n="0",boxSizing:i})=>{const s=e.max-e.min;return i==="border-box"?s:s-parseFloat(t)-parseFloat(n)},height:({y:e},{paddingTop:t="0",paddingBottom:n="0",boxSizing:i})=>{const s=e.max-e.min;return i==="border-box"?s:s-parseFloat(t)-parseFloat(n)},top:(e,{top:t})=>parseFloat(t),left:(e,{left:t})=>parseFloat(t),bottom:({y:e},{top:t})=>parseFloat(t)+(e.max-e.min),right:({x:e},{left:t})=>parseFloat(t)+(e.max-e.min),x:(e,{transform:t})=>Bi(t,"x"),y:(e,{transform:t})=>Bi(t,"y")};Xe.translateX=Xe.x;Xe.translateY=Xe.y;const at=new Set;let $i=!1,Fi=!1,_i=!1;function va(){if(Fi){const e=Array.from(at).filter(i=>i.needsMeasurement),t=new Set(e.map(i=>i.element)),n=new Map;t.forEach(i=>{const s=Ku(i);s.length&&(n.set(i,s),i.render())}),e.forEach(i=>i.measureInitialState()),t.forEach(i=>{i.render();const s=n.get(i);s&&s.forEach(([r,o])=>{i.getValue(r)?.set(o)})}),e.forEach(i=>i.measureEndState()),e.forEach(i=>{i.suspendedScrollY!==void 0&&window.scrollTo(0,i.suspendedScrollY)})}Fi=!1,$i=!1,at.forEach(e=>e.complete(_i)),at.clear()}function ka(){at.forEach(e=>{e.readKeyframes(),e.needsMeasurement&&(Fi=!0)})}function Qu(){_i=!0,ka(),va(),_i=!1}class ks{constructor(t,n,i,s,r,o=!1){this.state="pending",this.isAsync=!1,this.needsMeasurement=!1,this.unresolvedKeyframes=[...t],this.onComplete=n,this.name=i,this.motionValue=s,this.element=r,this.isAsync=o}scheduleResolve(){this.state="scheduled",this.isAsync?(at.add(this),$i||($i=!0,te.read(ka),te.resolveKeyframes(va))):(this.readKeyframes(),this.complete())}readKeyframes(){const{unresolvedKeyframes:t,name:n,element:i,motionValue:s}=this;if(t[0]===null){const r=s?.get(),o=t[t.length-1];if(r!==void 0)t[0]=r;else if(i&&n){const a=i.readValue(n,o);a!=null&&(t[0]=a)}t[0]===void 0&&(t[0]=o),s&&r===void 0&&s.set(t[0])}Fu(t)}setFinalKeyframe(){}measureInitialState(){}renderEndStyles(){}measureEndState(){}complete(t=!1){this.state="complete",this.onComplete(this.unresolvedKeyframes,this.finalKeyframe,t),at.delete(this)}cancel(){this.state==="scheduled"&&(at.delete(this),this.state="pending")}resume(){this.state==="pending"&&this.scheduleResolve()}}const qu=e=>e.startsWith("--");function Ta(e,t,n){qu(t)?e.style.setProperty(t,n):e.style[t]=n}const Yu={};function Sa(e,t){const n=Zr(e);return()=>Yu[t]??n()}const Xu=Sa(()=>window.ScrollTimeline!==void 0,"scrollTimeline"),Ca=Sa(()=>{try{document.createElement("div").animate({opacity:0},{easing:"linear(0, 1)"})}catch{return!1}return!0},"linearEasing"),Mt=([e,t,n,i])=>`cubic-bezier(${e}, ${t}, ${n}, ${i})`,co={linear:"linear",ease:"ease",easeIn:"ease-in",easeOut:"ease-out",easeInOut:"ease-in-out",circIn:Mt([0,.65,.55,1]),circOut:Mt([.55,0,1,.45]),backIn:Mt([.31,.01,.66,-.59]),backOut:Mt([.33,1.53,.69,.99])};function Aa(e,t){if(e)return typeof e=="function"?Ca()?wa(e,t):"ease-out":ca(e)?Mt(e):Array.isArray(e)?e.map(n=>Aa(n,t)||co.easeOut):co[e]}function Zu(e,t,n,{delay:i=0,duration:s=300,repeat:r=0,repeatType:o="loop",ease:a="easeOut",times:c}={},l=void 0){const u={[t]:n};c&&(u.offset=c);const f=Aa(a,s);Array.isArray(f)&&(u.easing=f);const d={delay:i,duration:s,easing:Array.isArray(f)?"linear":f,fill:"both",iterations:r+1,direction:o==="reverse"?"alternate":"normal"};return l&&(d.pseudoElement=l),e.animate(u,d)}function Pa(e){return typeof e=="function"&&"applyToOptions"in e}function Ju({type:e,...t}){return Pa(e)&&Ca()?e.applyToOptions(t):(t.duration??(t.duration=300),t.ease??(t.ease="easeOut"),t)}class Ea extends vs{constructor(t){if(super(),this.finishedTime=null,this.isStopped=!1,this.manualStartTime=null,!t)return;const{element:n,name:i,keyframes:s,pseudoElement:r,allowFlatten:o=!1,finalKeyframe:a,onComplete:c}=t;this.isPseudoElement=!!r,this.allowFlatten=o,this.options=t,_n(typeof t.type!="string");const l=Ju(t);this.animation=Zu(n,i,s,l,r),l.autoplay===!1&&this.animation.pause(),this.animation.onfinish=()=>{if(this.finishedTime=this.time,!r){const u=Hn(s,this.options,a,this.speed);this.updateMotionValue&&this.updateMotionValue(u),Ta(n,i,u),this.animation.cancel()}c?.(),this.notifyFinished()}}play(){this.isStopped||(this.manualStartTime=null,this.animation.play(),this.state==="finished"&&this.updateFinished())}pause(){this.animation.pause()}complete(){this.animation.finish?.()}cancel(){try{this.animation.cancel()}catch{}}stop(){if(this.isStopped)return;this.isStopped=!0;const{state:t}=this;t==="idle"||t==="finished"||(this.updateMotionValue?this.updateMotionValue():this.commitStyles(),this.isPseudoElement||this.cancel())}commitStyles(){const t=this.options?.element;!this.isPseudoElement&&t?.isConnected&&this.animation.commitStyles?.()}get duration(){const t=this.animation.effect?.getComputedTiming?.().duration||0;return Oe(Number(t))}get iterationDuration(){const{delay:t=0}=this.options||{};return this.duration+Oe(t)}get time(){return Oe(Number(this.animation.currentTime)||0)}set time(t){const n=this.finishedTime!==null;this.manualStartTime=null,this.finishedTime=null,this.animation.currentTime=je(t),n&&this.animation.pause()}get speed(){return this.animation.playbackRate}set speed(t){t<0&&(this.finishedTime=null),this.animation.playbackRate=t}get state(){return this.finishedTime!==null?"finished":this.animation.playState}get startTime(){return this.manualStartTime??Number(this.animation.startTime)}set startTime(t){this.manualStartTime=this.animation.startTime=t}attachTimeline({timeline:t,rangeStart:n,rangeEnd:i,observe:s}){return this.allowFlatten&&this.animation.effect?.updateTiming({easing:"linear"}),this.animation.onfinish=null,t&&Xu()?(this.animation.timeline=t,n&&(this.animation.rangeStart=n),i&&(this.animation.rangeEnd=i),Re):s(this)}}const Da={anticipate:oa,backInOut:sa,circInOut:aa};function eh(e){return e in Da}function th(e){typeof e.ease=="string"&&eh(e.ease)&&(e.ease=Da[e.ease])}const ni=10;class nh extends Ea{constructor(t){th(t),xa(t),super(t),t.startTime!==void 0&&t.autoplay!==!1&&(this.startTime=t.startTime),this.options=t}updateMotionValue(t){const{motionValue:n,onUpdate:i,onComplete:s,element:r,...o}=this.options;if(!n)return;if(t!==void 0){n.set(t);return}const a=new jn({...o,autoplay:!1}),c=Math.max(ni,ke.now()-this.startTime),l=Ge(0,ni,c-ni),u=a.sample(c).value,{name:f}=this.options;r&&f&&Ta(r,f,u),n.setWithVelocity(a.sample(Math.max(0,c-l)).value,u,l),a.stop()}}const uo=(e,t)=>t==="zIndex"?!1:!!(typeof e=="number"||Array.isArray(e)||typeof e=="string"&&($e.test(e)||e==="0")&&!e.startsWith("url("));function ih(e){const t=e[0];if(e.length===1)return!0;for(let n=0;n<e.length;n++)if(e[n]!==t)return!0}function sh(e,t,n,i){const s=e[0];if(s===null)return!1;if(t==="display"||t==="visibility")return!0;const r=e[e.length-1],o=uo(s,t),a=uo(r,t);return!o||!a?!1:ih(e)||(n==="spring"||Pa(n))&&i}function Hi(e){e.duration=0,e.type="keyframes"}const Ma=new Set(["opacity","clipPath","filter","transform","backgroundColor"]),oh=/^(?:oklch|oklab|lab|lch|color|color-mix|light-dark)\(/;function rh(e){for(let t=0;t<e.length;t++)if(typeof e[t]=="string"&&oh.test(e[t]))return!0;return!1}const ah=new Set(["color","backgroundColor","outlineColor","fill","stroke","borderColor","borderTopColor","borderRightColor","borderBottomColor","borderLeftColor"]),lh=Zr(()=>Object.hasOwnProperty.call(Element.prototype,"animate"));function ch(e){const{motionValue:t,name:n,repeatDelay:i,repeatType:s,damping:r,type:o,keyframes:a}=e,c=t?.owner?.current;if(!(c instanceof HTMLElement)&&!(c instanceof SVGElement))return!1;const{onUpdate:l,transformTemplate:u}=t.owner.getProps();return lh()&&n&&(Ma.has(n)||ah.has(n)&&rh(a))&&(n!=="transform"||!u)&&!l&&!i&&s!=="mirror"&&r!==0&&o!=="inertia"}const uh=40;class hh extends vs{constructor({autoplay:t=!0,delay:n=0,type:i="keyframes",repeat:s=0,repeatDelay:r=0,repeatType:o="loop",keyframes:a,name:c,motionValue:l,element:u,...f}){super(),this.stop=()=>{this._animation&&(this._animation.stop(),this.stopTimeline?.()),this.keyframeResolver?.cancel()},this.createdAt=ke.now();const d={autoplay:t,delay:n,type:i,repeat:s,repeatDelay:r,repeatType:o,name:c,motionValue:l,element:u,...f},y=u?.KeyframeResolver||ks;this.keyframeResolver=new y(a,(m,w,p)=>this.onKeyframesResolved(m,w,d,!p),c,l,u),this.keyframeResolver?.scheduleResolve()}onKeyframesResolved(t,n,i,s){this.keyframeResolver=void 0;const{name:r,type:o,velocity:a,delay:c,isHandoff:l,onUpdate:u}=i;this.resolvedAt=ke.now();let f=!0;sh(t,r,o,a)||(f=!1,(Ze.instantAnimations||!c)&&u?.(Hn(t,i,n)),t[0]=t[t.length-1],Hi(i),i.repeat=0);const y={startTime:s?this.resolvedAt?this.resolvedAt-this.createdAt>uh?this.resolvedAt:this.createdAt:this.createdAt:void 0,finalKeyframe:n,...i,keyframes:t},m=f&&!l&&ch(y),w=y.motionValue?.owner?.current;let p;if(m)try{p=new nh({...y,element:w})}catch{p=new jn(y)}else p=new jn(y);p.finished.then(()=>{this.notifyFinished()}).catch(Re),this.pendingTimeline&&(this.stopTimeline=p.attachTimeline(this.pendingTimeline),this.pendingTimeline=void 0),this._animation=p}get finished(){return this._animation?this.animation.finished:this._finished}then(t,n){return this.finished.finally(t).then(()=>{})}get animation(){return this._animation||(this.keyframeResolver?.resume(),Qu()),this._animation}get duration(){return this.animation.duration}get iterationDuration(){return this.animation.iterationDuration}get time(){return this.animation.time}set time(t){this.animation.time=t}get speed(){return this.animation.speed}get state(){return this.animation.state}set speed(t){this.animation.speed=t}get startTime(){return this.animation.startTime}attachTimeline(t){return this._animation?this.stopTimeline=this.animation.attachTimeline(t):this.pendingTimeline=t,()=>this.stop()}play(){this.animation.play()}pause(){this.animation.pause()}complete(){this.animation.complete()}cancel(){this._animation&&this.animation.cancel(),this.keyframeResolver?.cancel()}}function Oa(e,t,n,i=0,s=1){const r=Array.from(e).sort((l,u)=>l.sortNodePosition(u)).indexOf(t),o=e.size,a=(o-1)*i;return typeof n=="function"?n(r,o):s===1?r*i:a-r*i}const ho=30,dh=e=>!isNaN(parseFloat(e));class fh{constructor(t,n={}){this.canTrackVelocity=null,this.events={},this.updateAndNotify=i=>{const s=ke.now();if(this.updatedAt!==s&&this.setPrevFrameValue(),this.prev=this.current,this.setCurrent(i),this.current!==this.prev&&(this.events.change?.notify(this.current),this.dependents))for(const r of this.dependents)r.dirty()},this.hasAnimated=!1,this.setCurrent(t),this.owner=n.owner}setCurrent(t){this.current=t,this.updatedAt=ke.now(),this.canTrackVelocity===null&&t!==void 0&&(this.canTrackVelocity=dh(this.current))}setPrevFrameValue(t=this.current){this.prevFrameValue=t,this.prevUpdatedAt=this.updatedAt}onChange(t){return this.on("change",t)}on(t,n){this.events[t]||(this.events[t]=new ds);const i=this.events[t].add(n);return t==="change"?()=>{i(),te.read(()=>{this.events.change.getSize()||this.stop()})}:i}clearListeners(){for(const t in this.events)this.events[t].clear()}attach(t,n){this.passiveEffect=t,this.stopPassiveEffect=n}set(t){this.passiveEffect?this.passiveEffect(t,this.updateAndNotify):this.updateAndNotify(t)}setWithVelocity(t,n,i){this.set(n),this.prev=void 0,this.prevFrameValue=t,this.prevUpdatedAt=this.updatedAt-i}jump(t,n=!0){this.updateAndNotify(t),this.prev=t,this.prevUpdatedAt=this.prevFrameValue=void 0,n&&this.stop(),this.stopPassiveEffect&&this.stopPassiveEffect()}dirty(){this.events.change?.notify(this.current)}addDependent(t){this.dependents||(this.dependents=new Set),this.dependents.add(t)}removeDependent(t){this.dependents&&this.dependents.delete(t)}get(){return this.current}getPrevious(){return this.prev}getVelocity(){const t=ke.now();if(!this.canTrackVelocity||this.prevFrameValue===void 0||t-this.updatedAt>ho)return 0;const n=Math.min(this.updatedAt-this.prevUpdatedAt,ho);return Jr(parseFloat(this.current)-parseFloat(this.prevFrameValue),n)}start(t){return this.stop(),new Promise(n=>{this.hasAnimated=!0,this.animation=t(n),this.events.animationStart&&this.events.animationStart.notify()}).then(()=>{this.events.animationComplete&&this.events.animationComplete.notify(),this.clearAnimation()})}stop(){this.animation&&(this.animation.stop(),this.events.animationCancel&&this.events.animationCancel.notify()),this.clearAnimation()}isAnimating(){return!!this.animation}clearAnimation(){delete this.animation}destroy(){this.dependents?.clear(),this.events.destroy?.notify(),this.clearListeners(),this.stop(),this.stopPassiveEffect&&this.stopPassiveEffect()}}function Tt(e,t){return new fh(e,t)}function Ra(e,t){if(e?.inherit&&t){const{inherit:n,...i}=e;return{...t,...i}}return e}function Ts(e,t){const n=e?.[t]??e?.default??e;return n!==e?Ra(n,e):n}const ph={type:"spring",stiffness:500,damping:25,restSpeed:10},mh=e=>({type:"spring",stiffness:550,damping:e===0?2*Math.sqrt(550):30,restSpeed:10}),gh={type:"keyframes",duration:.8},yh={type:"keyframes",ease:[.25,.1,.35,1],duration:.3},bh=(e,{keyframes:t})=>t.length>2?gh:At.has(e)?e.startsWith("scale")?mh(t[1]):ph:yh,wh=new Set(["when","delay","delayChildren","staggerChildren","staggerDirection","repeat","repeatType","repeatDelay","from","elapsed"]);function xh(e){for(const t in e)if(!wh.has(t))return!0;return!1}const Ss=(e,t,n,i={},s,r)=>o=>{const a=Ts(i,e)||{},c=a.delay||i.delay||0;let{elapsed:l=0}=i;l=l-je(c);const u={keyframes:Array.isArray(n)?n:[null,n],ease:"easeOut",velocity:t.getVelocity(),...a,delay:-l,onUpdate:d=>{t.set(d),a.onUpdate&&a.onUpdate(d)},onComplete:()=>{o(),a.onComplete&&a.onComplete()},name:e,motionValue:t,element:r?void 0:s};xh(a)||Object.assign(u,bh(e,u)),u.duration&&(u.duration=je(u.duration)),u.repeatDelay&&(u.repeatDelay=je(u.repeatDelay)),u.from!==void 0&&(u.keyframes[0]=u.from);let f=!1;if((u.type===!1||u.duration===0&&!u.repeatDelay)&&(Hi(u),u.delay===0&&(f=!0)),(Ze.instantAnimations||Ze.skipAnimations||s?.shouldSkipAnimations||a.skipAnimations)&&(f=!0,Hi(u),u.delay=0),u.allowFlatten=!a.type&&!a.ease,f&&!r&&t.get()!==void 0){const d=Hn(u.keyframes,a);if(d!==void 0){te.update(()=>{u.onUpdate(d),u.onComplete()});return}}return a.isSync?new jn(u):new hh(u)},vh=/^var\(--(?:([\w-]+)|([\w-]+), ?([a-zA-Z\d ()%#.,-]+))\)/u;function kh(e){const t=vh.exec(e);if(!t)return[,];const[,n,i,s]=t;return[`--${n??i}`,s]}function ja(e,t,n=1){const[i,s]=kh(e);if(!i)return;const r=window.getComputedStyle(t).getPropertyValue(i);if(r){const o=r.trim();return qr(o)?parseFloat(o):o}return ms(s)?ja(s,t,n+1):s}function fo(e){const t=[{},{}];return e?.values.forEach((n,i)=>{t[0][i]=n.get(),t[1][i]=n.getVelocity()}),t}function Cs(e,t,n,i){if(typeof t=="function"){const[s,r]=fo(i);t=t(n!==void 0?n:e.custom,s,r)}if(typeof t=="string"&&(t=e.variants&&e.variants[t]),typeof t=="function"){const[s,r]=fo(i);t=t(n!==void 0?n:e.custom,s,r)}return t}function lt(e,t,n){const i=e.getProps();return Cs(i,t,n!==void 0?n:i.custom,e)}const La=new Set(["width","height","top","left","right","bottom",...Ct]),Wi=e=>Array.isArray(e);function Th(e,t,n){e.hasValue(t)?e.getValue(t).set(n):e.addValue(t,Tt(n))}function Sh(e){return Wi(e)?e[e.length-1]||0:e}function Ch(e,t){const n=lt(e,t);let{transitionEnd:i={},transition:s={},...r}=n||{};r={...r,...i};for(const o in r){const a=Sh(r[o]);Th(e,o,a)}}const ye=e=>!!(e&&e.getVelocity);function Ah(e){return!!(ye(e)&&e.add)}function zi(e,t){const n=e.getValue("willChange");if(Ah(n))return n.add(t);if(!n&&Ze.WillChange){const i=new Ze.WillChange("auto");e.addValue("willChange",i),i.add(t)}}function As(e){return e.replace(/([A-Z])/g,t=>`-${t.toLowerCase()}`)}const Ph="framerAppearId",Na="data-"+As(Ph);function Va(e){return e.props[Na]}const Eh=typeof window<"u";function Dh({protectedKeys:e,needsAnimating:t},n){const i=e.hasOwnProperty(n)&&t[n]!==!0;return t[n]=!1,i}function Ia(e,t,{delay:n=0,transitionOverride:i,type:s}={}){let{transition:r,transitionEnd:o,...a}=t;const c=e.getDefaultTransition();r=r?Ra(r,c):c;const l=r?.reduceMotion,u=r?.skipAnimations;i&&(r=i);const f=[],d=s&&e.animationState&&e.animationState.getState()[s],y=r?.path;y&&y.animateVisualElement(e,a,r,n,f);for(const m in a){const w=e.getValue(m,e.latestValues[m]??null),p=a[m];if(p===void 0||d&&Dh(d,m))continue;const g={delay:n,...Ts(r||{},m)};u&&(g.skipAnimations=!0);const k=w.get();if(k!==void 0&&!w.isAnimating()&&!Array.isArray(p)&&p===k&&!g.velocity){te.update(()=>w.set(p));continue}let v=!1;if(Eh&&window.MotionHandoffAnimation){const D=Va(e);if(D){const T=window.MotionHandoffAnimation(D,m,te);T!==null&&(g.startTime=T,v=!0)}}zi(e,m);const x=l??e.shouldReduceMotion;w.start(Ss(m,w,p,x&&La.has(m)?{type:!1}:g,e,v));const C=w.animation;C&&f.push(C)}if(o){const m=()=>te.update(()=>{o&&Ch(e,o)});f.length?Promise.all(f).then(m):m()}return f}function Gi(e,t,n={}){const i=lt(e,t,n.type==="exit"?e.presenceContext?.custom:void 0);let{transition:s=e.getDefaultTransition()||{}}=i||{};n.transitionOverride&&(s=n.transitionOverride);const r=i?()=>Promise.all(Ia(e,i,n)):()=>Promise.resolve(),o=e.variantChildren&&e.variantChildren.size?(c=0)=>{const{delayChildren:l=0,staggerChildren:u,staggerDirection:f}=s;return Mh(e,t,c,l,u,f,n)}:()=>Promise.resolve(),{when:a}=s;if(a){const[c,l]=a==="beforeChildren"?[r,o]:[o,r];return c().then(()=>l())}else return Promise.all([r(),o(n.delay)])}function Mh(e,t,n=0,i=0,s=0,r=1,o){const a=[];for(const c of e.variantChildren)c.notify("AnimationStart",t),a.push(Gi(c,t,{...o,delay:n+(typeof i=="function"?0:i)+Oa(e.variantChildren,c,i,s,r)}).then(()=>c.notify("AnimationComplete",t)));return Promise.all(a)}function Oh(e,t,n={}){e.notify("AnimationStart",t);let i;if(Array.isArray(t)){const s=t.map(r=>Gi(e,r,n));i=Promise.all(s)}else if(typeof t=="string")i=Gi(e,t,n);else{const s=typeof t=="function"?lt(e,t,n.custom):t;i=Promise.all(Ia(e,s,n))}return i.then(()=>{e.notify("AnimationComplete",t)})}const Rh={test:e=>e==="auto",parse:e=>e},Ba=e=>t=>t.test(e),$a=[St,$,ze,Ue,nu,tu,Rh],po=e=>$a.find(Ba(e));function jh(e){return typeof e=="number"?e===0:e!==null?e==="none"||e==="0"||Xr(e):!0}const Lh=new Set(["brightness","contrast","saturate","opacity"]);function Nh(e){const[t,n]=e.slice(0,-1).split("(");if(t==="drop-shadow")return e;const[i]=n.match(gs)||[];if(!i)return e;const s=n.replace(i,"");let r=Lh.has(t)?1:0;return i!==n&&(r*=100),t+"("+r+s+")"}const Vh=/\b([a-z-]*)\(.*?\)/gu,Ui={...$e,getAnimatableNone:e=>{const t=e.match(Vh);return t?t.map(Nh).join(" "):e}},Ki={...$e,getAnimatableNone:e=>{const t=$e.parse(e);return $e.createTransformer(e)(t.map(i=>typeof i=="number"?0:typeof i=="object"?{...i,alpha:1}:i))}},mo={...St,transform:Math.round},Ih={rotate:Ue,pathRotation:Ue,rotateX:Ue,rotateY:Ue,rotateZ:Ue,scale:nn,scaleX:nn,scaleY:nn,scaleZ:nn,skew:Ue,skewX:Ue,skewY:Ue,distance:$,translateX:$,translateY:$,translateZ:$,x:$,y:$,z:$,perspective:$,transformPerspective:$,opacity:_t,originX:eo,originY:eo,originZ:$},Ln={borderWidth:$,borderTopWidth:$,borderRightWidth:$,borderBottomWidth:$,borderLeftWidth:$,borderRadius:$,borderTopLeftRadius:$,borderTopRightRadius:$,borderBottomRightRadius:$,borderBottomLeftRadius:$,width:$,maxWidth:$,height:$,maxHeight:$,top:$,right:$,bottom:$,left:$,inset:$,insetBlock:$,insetBlockStart:$,insetBlockEnd:$,insetInline:$,insetInlineStart:$,insetInlineEnd:$,padding:$,paddingTop:$,paddingRight:$,paddingBottom:$,paddingLeft:$,paddingBlock:$,paddingBlockStart:$,paddingBlockEnd:$,paddingInline:$,paddingInlineStart:$,paddingInlineEnd:$,margin:$,marginTop:$,marginRight:$,marginBottom:$,marginLeft:$,marginBlock:$,marginBlockStart:$,marginBlockEnd:$,marginInline:$,marginInlineStart:$,marginInlineEnd:$,fontSize:$,backgroundPositionX:$,backgroundPositionY:$,...Ih,zIndex:mo,fillOpacity:_t,strokeOpacity:_t,numOctaves:mo},Bh={...Ln,color:le,backgroundColor:le,outlineColor:le,fill:le,stroke:le,borderColor:le,borderTopColor:le,borderRightColor:le,borderBottomColor:le,borderLeftColor:le,filter:Ui,WebkitFilter:Ui,mask:Ki,WebkitMask:Ki},Fa=e=>Bh[e],$h=new Set([Ui,Ki]);function _a(e,t){let n=Fa(e);return $h.has(n)||(n=$e),n.getAnimatableNone?n.getAnimatableNone(t):void 0}const Fh=new Set(["auto","none","0"]);function _h(e,t,n){let i=0,s;for(;i<e.length&&!s;){const r=e[i];typeof r=="string"&&!Fh.has(r)&&kt(r).values.length&&(s=e[i]),i++}if(s&&n)for(const r of t)e[r]=_a(n,s)}class Hh extends ks{constructor(t,n,i,s,r){super(t,n,i,s,r,!0)}readKeyframes(){const{unresolvedKeyframes:t,element:n,name:i}=this;if(!n||!n.current)return;super.readKeyframes();for(let u=0;u<t.length;u++){let f=t[u];if(typeof f=="string"&&(f=f.trim(),ms(f))){const d=ja(f,n.current);d!==void 0&&(t[u]=d),u===t.length-1&&(this.finalKeyframe=f)}}if(this.resolveNoneKeyframes(),!La.has(i)||t.length!==2)return;const[s,r]=t,o=po(s),a=po(r),c=Js(s),l=Js(r);if(c!==l&&Xe[i]){this.needsMeasurement=!0;return}if(o!==a)if(lo(o)&&lo(a))for(let u=0;u<t.length;u++){const f=t[u];typeof f=="string"&&(t[u]=parseFloat(f))}else Xe[i]&&(this.needsMeasurement=!0)}resolveNoneKeyframes(){const{unresolvedKeyframes:t,name:n}=this,i=[];for(let s=0;s<t.length;s++)(t[s]===null||jh(t[s]))&&i.push(s);i.length&&_h(t,i,n)}measureInitialState(){const{element:t,unresolvedKeyframes:n,name:i}=this;if(!t||!t.current)return;i==="height"&&(this.suspendedScrollY=window.pageYOffset),this.measuredOrigin=Xe[i](t.measureViewportBox(),window.getComputedStyle(t.current)),n[0]=this.measuredOrigin;const s=n[n.length-1];s!==void 0&&t.getValue(i,s).jump(s,!1)}measureEndState(){const{element:t,name:n,unresolvedKeyframes:i}=this;if(!t||!t.current)return;const s=t.getValue(n);s&&s.jump(this.measuredOrigin,!1);const r=i.length-1,o=i[r];i[r]=Xe[n](t.measureViewportBox(),window.getComputedStyle(t.current)),o!==null&&this.finalKeyframe===void 0&&(this.finalKeyframe=o),this.removedTransforms?.length&&this.removedTransforms.forEach(([a,c])=>{t.getValue(a).set(c)}),this.resolveNoneKeyframes()}}const Ps=["borderTopLeftRadius","borderTopRightRadius","borderBottomRightRadius","borderBottomLeftRadius"];function Ha(e,t,n){if(e==null)return[];if(e instanceof EventTarget)return[e];if(typeof e=="string"){let i=document;const s=n?.[e]??i.querySelectorAll(e);return s?Array.from(s):[]}return Array.from(e).filter(i=>i!=null)}const Qi=(e,t)=>t&&typeof e=="number"?t.transform(e):e;function bn(e){return Yr(e)&&"offsetHeight"in e&&!("ownerSVGElement"in e)}const{schedule:Es}=ua(queueMicrotask,!1),Be={x:!1,y:!1};function Wa(){return Be.x||Be.y}function Wh(e){return e==="x"||e==="y"?Be[e]?null:(Be[e]=!0,()=>{Be[e]=!1}):Be.x||Be.y?null:(Be.x=Be.y=!0,()=>{Be.x=Be.y=!1})}function za(e,t){const n=Ha(e),i=new AbortController,s={passive:!0,...t,signal:i.signal};return[n,s,()=>i.abort()]}function zh(e){return!(e.pointerType==="touch"||Wa())}function Gh(e,t,n={}){const[i,s,r]=za(e,n);return i.forEach(o=>{let a=!1,c=!1,l;const u=()=>{o.removeEventListener("pointerleave",m)},f=p=>{l&&(l(p),l=void 0),u()},d=p=>{a=!1,window.removeEventListener("pointerup",d),window.removeEventListener("pointercancel",d),c&&(c=!1,f(p))},y=()=>{a=!0,window.addEventListener("pointerup",d,s),window.addEventListener("pointercancel",d,s)},m=p=>{if(p.pointerType!=="touch"){if(a){c=!0;return}f(p)}},w=p=>{if(!zh(p))return;c=!1;const g=t(o,p);typeof g=="function"&&(l=g,o.addEventListener("pointerleave",m,s))};o.addEventListener("pointerenter",w,s),o.addEventListener("pointerdown",y,s)}),r}const Ga=(e,t)=>t?e===t?!0:Ga(e,t.parentElement):!1,Ds=e=>e.pointerType==="mouse"?typeof e.button!="number"||e.button<=0:e.isPrimary!==!1,Uh=new Set(["BUTTON","INPUT","SELECT","TEXTAREA","A"]);function Kh(e){return Uh.has(e.tagName)||e.isContentEditable===!0}const Qh=new Set(["INPUT","SELECT","TEXTAREA"]);function qh(e){return Qh.has(e.tagName)||e.isContentEditable===!0}const wn=new WeakSet;function go(e){return t=>{t.key==="Enter"&&e(t)}}function ii(e,t){e.dispatchEvent(new PointerEvent("pointer"+t,{isPrimary:!0,bubbles:!0}))}const Yh=(e,t)=>{const n=e.currentTarget;if(!n)return;const i=go(()=>{if(wn.has(n))return;ii(n,"down");const s=go(()=>{ii(n,"up")}),r=()=>ii(n,"cancel");n.addEventListener("keyup",s,t),n.addEventListener("blur",r,t)});n.addEventListener("keydown",i,t),n.addEventListener("blur",()=>n.removeEventListener("keydown",i),t)};function yo(e){return Ds(e)&&!Wa()}const bo=new WeakSet;function Xh(e,t,n={}){const[i,s,r]=za(e,n),o=a=>{const c=a.currentTarget;if(!yo(a)||bo.has(a))return;wn.add(c),n.stopPropagation&&bo.add(a);const l=t(c,a),u={...s,capture:!0},f=(m,w)=>{window.removeEventListener("pointerup",d,u),window.removeEventListener("pointercancel",y,u),wn.has(c)&&wn.delete(c),yo(m)&&typeof l=="function"&&l(m,{success:w})},d=m=>{f(m,c===window||c===document||n.useGlobalTarget||Ga(c,m.target))},y=m=>{f(m,!1)};window.addEventListener("pointerup",d,u),window.addEventListener("pointercancel",y,u)};return i.forEach(a=>{(n.useGlobalTarget?window:a).addEventListener("pointerdown",o,s),bn(a)&&(a.addEventListener("focus",l=>Yh(l,s)),!Kh(a)&&!a.hasAttribute("tabindex")&&(a.tabIndex=0))}),r}function Ms(e){return Yr(e)&&"ownerSVGElement"in e}const xn=new WeakMap;let vn;const Ua=(e,t,n)=>(i,s)=>s&&s[0]?s[0][e+"Size"]:Ms(i)&&"getBBox"in i?i.getBBox()[t]:i[n],Zh=Ua("inline","width","offsetWidth"),Jh=Ua("block","height","offsetHeight");function ed({target:e,borderBoxSize:t}){xn.get(e)?.forEach(n=>{n(e,{get width(){return Zh(e,t)},get height(){return Jh(e,t)}})})}function td(e){e.forEach(ed)}function nd(){typeof ResizeObserver>"u"||(vn=new ResizeObserver(td))}function id(e,t){vn||nd();const n=Ha(e);return n.forEach(i=>{let s=xn.get(i);s||(s=new Set,xn.set(i,s)),s.add(t),vn?.observe(i)}),()=>{n.forEach(i=>{const s=xn.get(i);s?.delete(t),s?.size||vn?.unobserve(i)})}}const kn=new Set;let xt;function sd(){xt=()=>{const e={get width(){return window.innerWidth},get height(){return window.innerHeight}};kn.forEach(t=>t(e))},window.addEventListener("resize",xt)}function od(e){return kn.add(e),xt||sd(),()=>{kn.delete(e),!kn.size&&typeof xt=="function"&&(window.removeEventListener("resize",xt),xt=void 0)}}function wo(e,t){return typeof e=="function"?od(e):id(e,t)}function rd(e){return Ms(e)&&e.tagName==="svg"}const ad=[...$a,le,$e],ld=e=>ad.find(Ba(e)),xo=()=>({translate:0,scale:1,origin:0,originPoint:0}),vt=()=>({x:xo(),y:xo()}),vo=()=>({min:0,max:0}),he=()=>({x:vo(),y:vo()}),cd=new WeakMap;function Wn(e){return e!==null&&typeof e=="object"&&typeof e.start=="function"}function Ht(e){return typeof e=="string"||Array.isArray(e)}const Os=["animate","whileInView","whileFocus","whileHover","whileTap","whileDrag","exit"],Rs=["initial",...Os];function zn(e){return Wn(e.animate)||Rs.some(t=>Ht(e[t]))}function Ka(e){return!!(zn(e)||e.variants)}function ud(e,t,n){for(const i in t){const s=t[i],r=n[i];if(ye(s))e.addValue(i,s);else if(ye(r))e.addValue(i,Tt(s,{owner:e}));else if(r!==s)if(e.hasValue(i)){const o=e.getValue(i);o.liveStyle===!0?o.jump(s):o.hasAnimated||o.set(s)}else{const o=e.getStaticValue(i);e.addValue(i,Tt(o!==void 0?o:s,{owner:e}))}}for(const i in n)t[i]===void 0&&e.removeValue(i);return t}const qi={current:null},Qa={current:!1},hd=typeof window<"u";function dd(){if(Qa.current=!0,!!hd)if(window.matchMedia){const e=window.matchMedia("(prefers-reduced-motion)"),t=()=>qi.current=e.matches;e.addEventListener("change",t),t()}else qi.current=!1}const ko=["AnimationStart","AnimationComplete","Update","BeforeLayoutMeasure","LayoutMeasure","LayoutAnimationStart","LayoutAnimationComplete"];let Nn={};function qa(e){Nn=e}function fd(){return Nn}class pd{scrapeMotionValuesFromProps(t,n,i){return{}}constructor({parent:t,props:n,presenceContext:i,reducedMotionConfig:s,skipAnimations:r,blockInitialAnimation:o,visualState:a},c={}){this.current=null,this.children=new Set,this.isVariantNode=!1,this.isControllingVariants=!1,this.shouldReduceMotion=null,this.shouldSkipAnimations=!1,this.values=new Map,this.KeyframeResolver=ks,this.features={},this.valueSubscriptions=new Map,this.prevMotionValues={},this.hasBeenMounted=!1,this.events={},this.propEventSubscriptions={},this.notifyUpdate=()=>this.notify("Update",this.latestValues),this.render=()=>{this.current&&(this.triggerBuild(),this.renderInstance(this.current,this.renderState,this.props.style,this.projection))},this.renderScheduledAt=0,this.scheduleRender=()=>{const y=ke.now();this.renderScheduledAt<y&&(this.renderScheduledAt=y,te.render(this.render,!1,!0))};const{latestValues:l,renderState:u}=a;this.latestValues=l,this.baseTarget={...l},this.initialValues=n.initial?{...l}:{},this.renderState=u,this.parent=t,this.props=n,this.presenceContext=i,this.depth=t?t.depth+1:0,this.reducedMotionConfig=s,this.skipAnimationsConfig=r,this.options=c,this.blockInitialAnimation=!!o,this.isControllingVariants=zn(n),this.isVariantNode=Ka(n),this.isVariantNode&&(this.variantChildren=new Set),this.manuallyAnimateOnMount=!!(t&&t.current);const{willChange:f,...d}=this.scrapeMotionValuesFromProps(n,{},this);for(const y in d){const m=d[y];l[y]!==void 0&&ye(m)&&m.set(l[y])}}mount(t){if(this.hasBeenMounted)for(const n in this.initialValues)this.values.get(n)?.jump(this.initialValues[n]),this.latestValues[n]=this.initialValues[n];this.current=t,cd.set(t,this),this.projection&&!this.projection.instance&&this.projection.mount(t),this.parent&&this.isVariantNode&&!this.isControllingVariants&&(this.removeFromVariantTree=this.parent.addVariantChild(this)),this.values.forEach((n,i)=>this.bindToMotionValue(i,n)),this.reducedMotionConfig==="never"?this.shouldReduceMotion=!1:this.reducedMotionConfig==="always"?this.shouldReduceMotion=!0:(Qa.current||dd(),this.shouldReduceMotion=qi.current),this.shouldSkipAnimations=this.skipAnimationsConfig??!1,this.parent?.addChild(this),this.update(this.props,this.presenceContext),this.hasBeenMounted=!0}unmount(){this.projection&&this.projection.unmount(),Je(this.notifyUpdate),Je(this.render),this.valueSubscriptions.forEach(t=>t()),this.valueSubscriptions.clear(),this.removeFromVariantTree&&this.removeFromVariantTree(),this.parent?.removeChild(this);for(const t in this.events)this.events[t].clear();for(const t in this.features){const n=this.features[t];n&&(n.unmount(),n.isMounted=!1)}this.current=null}addChild(t){this.children.add(t),this.enteringChildren??(this.enteringChildren=new Set),this.enteringChildren.add(t)}removeChild(t){this.children.delete(t),this.enteringChildren&&this.enteringChildren.delete(t)}bindToMotionValue(t,n){if(this.valueSubscriptions.has(t)&&this.valueSubscriptions.get(t)(),n.accelerate&&Ma.has(t)&&this.current instanceof HTMLElement){const{factory:o,keyframes:a,times:c,ease:l,duration:u}=n.accelerate,f=new Ea({element:this.current,name:t,keyframes:a,times:c,ease:l,duration:je(u)}),d=o(f);this.valueSubscriptions.set(t,()=>{d(),f.cancel()});return}const i=At.has(t);i&&this.onBindTransform&&this.onBindTransform();const s=n.on("change",o=>{this.latestValues[t]=o,this.props.onUpdate&&te.preRender(this.notifyUpdate),i&&this.projection&&(this.projection.isTransformDirty=!0),this.scheduleRender()});let r;typeof window<"u"&&window.MotionCheckAppearSync&&(r=window.MotionCheckAppearSync(this,t,n)),this.valueSubscriptions.set(t,()=>{s(),r&&r()})}sortNodePosition(t){return!this.current||!this.sortInstanceNodePosition||this.type!==t.type?0:this.sortInstanceNodePosition(this.current,t.current)}updateFeatures(){let t="animation";for(t in Nn){const n=Nn[t];if(!n)continue;const{isEnabled:i,Feature:s}=n;if(!this.features[t]&&s&&i(this.props)&&(this.features[t]=new s(this)),this.features[t]){const r=this.features[t];r.isMounted?r.update():(r.mount(),r.isMounted=!0)}}}triggerBuild(){this.build(this.renderState,this.latestValues,this.props)}measureViewportBox(){return this.current?this.measureInstanceViewportBox(this.current,this.props):he()}getStaticValue(t){return this.latestValues[t]}setStaticValue(t,n){this.latestValues[t]=n}update(t,n){(t.transformTemplate||this.props.transformTemplate)&&this.scheduleRender(),this.prevProps=this.props,this.props=t,this.prevPresenceContext=this.presenceContext,this.presenceContext=n;for(let i=0;i<ko.length;i++){const s=ko[i];this.propEventSubscriptions[s]&&(this.propEventSubscriptions[s](),delete this.propEventSubscriptions[s]);const r="on"+s,o=t[r];o&&(this.propEventSubscriptions[s]=this.on(s,o))}this.prevMotionValues=ud(this,this.scrapeMotionValuesFromProps(t,this.prevProps||{},this),this.prevMotionValues),this.handleChildMotionValue&&this.handleChildMotionValue()}getProps(){return this.props}getVariant(t){return this.props.variants?this.props.variants[t]:void 0}getDefaultTransition(){return this.props.transition}getTransformPagePoint(){return this.props.transformPagePoint}getClosestVariantNode(){return this.isVariantNode?this:this.parent?this.parent.getClosestVariantNode():void 0}addVariantChild(t){const n=this.getClosestVariantNode();if(n)return n.variantChildren&&n.variantChildren.add(t),()=>n.variantChildren.delete(t)}addValue(t,n){const i=this.values.get(t);n!==i&&(i&&this.removeValue(t),this.bindToMotionValue(t,n),this.values.set(t,n),this.latestValues[t]=n.get())}removeValue(t){this.values.delete(t);const n=this.valueSubscriptions.get(t);n&&(n(),this.valueSubscriptions.delete(t)),delete this.latestValues[t],this.removeValueFromRenderState(t,this.renderState)}hasValue(t){return this.values.has(t)}getValue(t,n){if(this.props.values&&this.props.values[t])return this.props.values[t];let i=this.values.get(t);return i===void 0&&n!==void 0&&(i=Tt(n===null?void 0:n,{owner:this}),this.addValue(t,i)),i}readValue(t,n){let i=this.latestValues[t]!==void 0||!this.current?this.latestValues[t]:this.getBaseTargetFromProps(this.props,t)??this.readValueFromInstance(this.current,t,this.options);return i!=null&&(typeof i=="string"&&(qr(i)||Xr(i))?i=parseFloat(i):!ld(i)&&$e.test(n)&&(i=_a(t,n)),this.setBaseTarget(t,ye(i)?i.get():i)),ye(i)?i.get():i}setBaseTarget(t,n){this.baseTarget[t]=n}getBaseTarget(t){const{initial:n}=this.props;let i;if(typeof n=="string"||typeof n=="object"){const r=Cs(this.props,n,this.presenceContext?.custom);r&&(i=r[t])}if(n&&i!==void 0)return i;const s=this.getBaseTargetFromProps(this.props,t);return s!==void 0&&!ye(s)?s:this.initialValues[t]!==void 0&&i===void 0?void 0:this.baseTarget[t]}on(t,n){return this.events[t]||(this.events[t]=new ds),this.events[t].add(n)}notify(t,...n){this.events[t]&&this.events[t].notify(...n)}scheduleRenderMicrotask(){Es.render(this.render)}}class Ya extends pd{constructor(){super(...arguments),this.KeyframeResolver=Hh}sortInstanceNodePosition(t,n){return t.compareDocumentPosition(n)&2?1:-1}getBaseTargetFromProps(t,n){const i=t.style;return i?i[n]:void 0}removeValueFromRenderState(t,{vars:n,style:i}){delete n[t],delete i[t]}handleChildMotionValue(){this.childSubscription&&(this.childSubscription(),delete this.childSubscription);const{children:t}=this.props;ye(t)&&(this.childSubscription=t.on("change",n=>{this.current&&(this.current.textContent=`${n}`)}))}}class et{constructor(t){this.isMounted=!1,this.node=t}update(){}}function Xa({top:e,left:t,right:n,bottom:i}){return{x:{min:t,max:n},y:{min:e,max:i}}}function md({x:e,y:t}){return{top:t.min,right:e.max,bottom:t.max,left:e.min}}function gd(e,t){if(!t)return e;const n=t({x:e.left,y:e.top}),i=t({x:e.right,y:e.bottom});return{top:n.y,left:n.x,bottom:i.y,right:i.x}}function si(e){return e===void 0||e===1}function Yi({scale:e,scaleX:t,scaleY:n}){return!si(e)||!si(t)||!si(n)}function st(e){return Yi(e)||Za(e)||e.z||e.rotate||e.rotateX||e.rotateY||e.skewX||e.skewY}function Za(e){return To(e.x)||To(e.y)}function To(e){return e&&e!=="0%"}function Vn(e,t,n){const i=e-n,s=t*i;return n+s}function So(e,t,n,i,s){return s!==void 0&&(e=Vn(e,s,i)),Vn(e,n,i)+t}function Xi(e,t=0,n=1,i,s){e.min=So(e.min,t,n,i,s),e.max=So(e.max,t,n,i,s)}function Ja(e,{x:t,y:n}){Xi(e.x,t.translate,t.scale,t.originPoint),Xi(e.y,n.translate,n.scale,n.originPoint)}const Co=.999999999999,Ao=1.0000000000001;function yd(e,t,n,i=!1){const s=n.length;if(!s)return;t.x=t.y=1;let r,o;for(let a=0;a<s;a++){r=n[a],o=r.projectionDelta;const{visualElement:c}=r.options;c&&c.props.style&&c.props.style.display==="contents"||(i&&r.options.layoutScroll&&r.scroll&&r!==r.root&&(_e(e.x,-r.scroll.offset.x),_e(e.y,-r.scroll.offset.y)),o&&(t.x*=o.x.scale,t.y*=o.y.scale,Ja(e,o)),i&&st(r.latestValues)&&Tn(e,r.latestValues,r.layout?.layoutBox))}t.x<Ao&&t.x>Co&&(t.x=1),t.y<Ao&&t.y>Co&&(t.y=1)}function _e(e,t){e.min+=t,e.max+=t}function Po(e,t,n,i,s=.5){const r=ee(e.min,e.max,s);Xi(e,t,n,r,i)}function Eo(e,t){return typeof e=="string"?parseFloat(e)/100*(t.max-t.min):e}function Tn(e,t,n){const i=n??e;Po(e.x,Eo(t.x,i.x),t.scaleX,t.scale,t.originX),Po(e.y,Eo(t.y,i.y),t.scaleY,t.scale,t.originY)}function el(e,t){return Xa(gd(e.getBoundingClientRect(),t))}function bd(e,t,n){const i=el(e,n),{scroll:s}=t;return s&&(_e(i.x,s.offset.x),_e(i.y,s.offset.y)),i}const wd={x:"translateX",y:"translateY",z:"translateZ",transformPerspective:"perspective"},xd=Ct.length;function vd(e,t,n){let i="",s=!0;for(let o=0;o<xd;o++){const a=Ct[o],c=e[a];if(c===void 0)continue;let l=!0;if(typeof c=="number")l=c===(a.startsWith("scale")?1:0);else{const u=parseFloat(c);l=a.startsWith("scale")?u===1:u===0}if(!l||n){const u=Qi(c,Ln[a]);if(!l){s=!1;const f=wd[a]||a;i+=`${f}(${u}) `}n&&(t[a]=u)}}const r=e.pathRotation;return r&&(s=!1,i+=`rotate(${Qi(r,Ln.pathRotation)}) `),i=i.trim(),n?i=n(t,s?"":i):s&&(i="none"),i}function js(e,t,n){const{style:i,vars:s,transformOrigin:r}=e;let o=!1,a=!1;for(const c in t){const l=t[c];if(At.has(c)){o=!0;continue}else if(da(c)){s[c]=l;continue}else{const u=Qi(l,Ln[c]);c.startsWith("origin")?(a=!0,r[c]=u):i[c]=u}}if(t.transform||(o||n?i.transform=vd(t,e.transform,n):i.transform&&(i.transform="none")),a){const{originX:c="50%",originY:l="50%",originZ:u=0}=r;i.transformOrigin=`${c} ${l} ${u}`}}function tl(e,{style:t,vars:n},i,s){const r=e.style;let o;for(o in t)r[o]=t[o];s?.applyProjectionStyles(r,i);for(o in n)r.setProperty(o,n[o])}function Do(e,t){return t.max===t.min?0:e/(t.max-t.min)*100}const Et={correct:(e,t)=>{if(!t.target)return e;if(typeof e=="string")if($.test(e))e=parseFloat(e);else return e;const n=Do(e,t.target.x),i=Do(e,t.target.y);return`${n}% ${i}%`}},kd={correct:(e,{treeScale:t,projectionDelta:n})=>{const i=e,s=$e.parse(e);if(s.length>5)return i;const r=$e.createTransformer(e),o=typeof s[0]!="number"?1:0,a=n.x.scale*t.x,c=n.y.scale*t.y;s[0+o]/=a,s[1+o]/=c;const l=ee(a,c,.5);return typeof s[2+o]=="number"&&(s[2+o]/=l),typeof s[3+o]=="number"&&(s[3+o]/=l),r(s)}},Zi={borderRadius:{...Et,applyTo:[...Ps]},borderTopLeftRadius:Et,borderTopRightRadius:Et,borderBottomLeftRadius:Et,borderBottomRightRadius:Et,boxShadow:kd};function nl(e,{layout:t,layoutId:n}){return At.has(e)||e.startsWith("origin")||(t||n!==void 0)&&(!!Zi[e]||e==="opacity")}function Ls(e,t,n){const i=e.style,s=t?.style,r={};if(!i)return r;for(const o in i)(ye(i[o])||s&&ye(s[o])||nl(o,e)||n?.getValue(o)?.liveStyle!==void 0)&&(r[o]=i[o]);return r}function Td(e){return window.getComputedStyle(e)}class Sd extends Ya{constructor(){super(...arguments),this.type="html",this.renderInstance=tl}mount(t){_n(!!t.style),super.mount(t)}readValueFromInstance(t,n){if(At.has(n))return this.projection?.isProjecting?Ii(n):Wu(t,n);{const i=Td(t),s=(da(n)?i.getPropertyValue(n):i[n])||0;return typeof s=="string"?s.trim():s}}measureInstanceViewportBox(t,{transformPagePoint:n}){return el(t,n)}build(t,n,i){js(t,n,i.transformTemplate)}scrapeMotionValuesFromProps(t,n,i){return Ls(t,n,i)}}const Cd={offset:"stroke-dashoffset",array:"stroke-dasharray"},Ad={offset:"strokeDashoffset",array:"strokeDasharray"};function Pd(e,t,n=1,i=0,s=!0){e.pathLength=1;const r=s?Cd:Ad;e[r.offset]=`${-i}`,e[r.array]=`${t} ${n}`}const il=["transform","opacity","offsetDistance","offsetPath","offsetRotate","offsetAnchor"];function sl(e,{attrX:t,attrY:n,attrScale:i,pathLength:s,pathSpacing:r=1,pathOffset:o=0,...a},c,l,u){if(js(e,a,l),c){e.style.viewBox&&(e.attrs.viewBox=e.style.viewBox);return}e.attrs=e.style,e.style={};const{attrs:f,style:d}=e;for(const y of il)f[y]!==void 0&&(d[y]=f[y],delete f[y]);(d.transform||f.transformOrigin)&&(d.transformOrigin=f.transformOrigin??"50% 50%",delete f.transformOrigin),d.transform&&(d.transformBox=u?.transformBox??"fill-box",delete f.transformBox),t!==void 0&&(f.x=t),n!==void 0&&(f.y=n),i!==void 0&&(f.scale=i),s!==void 0&&Pd(f,s,r,o,!1)}const ol=new Set(["baseFrequency","diffuseConstant","kernelMatrix","kernelUnitLength","keySplines","keyTimes","limitingConeAngle","markerHeight","markerWidth","numOctaves","targetX","targetY","surfaceScale","specularConstant","specularExponent","stdDeviation","tableValues","viewBox","gradientTransform","pathLength","startOffset","textLength","lengthAdjust"]),rl=e=>typeof e=="string"&&e.toLowerCase()==="svg";function Ed(e,t,n,i){tl(e,t,void 0,i);for(const s in t.attrs)e.setAttribute(ol.has(s)?s:As(s),t.attrs[s])}function al(e,t,n){const i=Ls(e,t,n);for(const s in e)if(ye(e[s])||ye(t[s])){const r=Ct.indexOf(s)!==-1?"attr"+s.charAt(0).toUpperCase()+s.substring(1):s;i[r]=e[s]}return i}class Dd extends Ya{constructor(){super(...arguments),this.type="svg",this.isSVGTag=!1,this.measureInstanceViewportBox=he}getBaseTargetFromProps(t,n){return t[n]}readValueFromInstance(t,n){if(At.has(n)){const i=Fa(n);return i&&i.default||0}if(il.includes(n)){const s=getComputedStyle(t)[n];if(typeof s=="string"&&s)return s.trim()}return n=ol.has(n)?n:As(n),t.getAttribute(n)}scrapeMotionValuesFromProps(t,n,i){return al(t,n,i)}build(t,n,i){sl(t,n,this.isSVGTag,i.transformTemplate,i.style)}renderInstance(t,n,i,s){Ed(t,n,i,s)}mount(t){this.isSVGTag=rl(t.tagName),super.mount(t)}}const Md=Rs.length;function ll(e){if(!e)return;if(!e.isControllingVariants){const n=e.parent?ll(e.parent)||{}:{};return e.props.initial!==void 0&&(n.initial=e.props.initial),n}const t={};for(let n=0;n<Md;n++){const i=Rs[n],s=e.props[i];(Ht(s)||s===!1)&&(t[i]=s)}return t}function cl(e,t){if(!Array.isArray(t))return!1;const n=t.length;if(n!==e.length)return!1;for(let i=0;i<n;i++)if(t[i]!==e[i])return!1;return!0}const Od=[...Os].reverse(),Rd=Os.length;function jd(e){return t=>Promise.all(t.map(({animation:n,options:i})=>Oh(e,n,i)))}function Ld(e){let t=jd(e),n=Mo(),i=!0,s=!1;const r=l=>(u,f)=>{const d=lt(e,f,l==="exit"?e.presenceContext?.custom:void 0);if(d){const{transition:y,transitionEnd:m,...w}=d;u={...u,...w,...m}}return u};function o(l){t=l(e)}function a(l){const{props:u}=e,f=ll(e.parent)||{},d=[],y=new Set;let m={},w=1/0;for(let g=0;g<Rd;g++){const k=Od[g],v=n[k],x=u[k]!==void 0?u[k]:f[k],C=Ht(x),D=k===l?v.isActive:null;D===!1&&(w=g);let T=x===f[k]&&x!==u[k]&&C;if(T&&(i||s)&&e.manuallyAnimateOnMount&&(T=!1),v.protectedKeys={...m},!v.isActive&&D===null||!x&&!v.prevProp||Wn(x)||typeof x=="boolean")continue;if(k==="exit"&&v.isActive&&D!==!0){v.prevResolvedValues&&(m={...m,...v.prevResolvedValues});continue}const P=Nd(v.prevProp,x);let E=P||k===l&&v.isActive&&!T&&C||g>w&&C,L=!1;const I=Array.isArray(x)?x:[x];let B=I.reduce(r(k),{});D===!1&&(B={});const{prevResolvedValues:O={}}=v,F={...O,...B},S=N=>{E=!0,y.has(N)&&(L=!0,y.delete(N)),v.needsAnimating[N]=!0;const G=e.getValue(N);G&&(G.liveStyle=!1)};for(const N in F){const G=B[N],j=O[N];if(m.hasOwnProperty(N))continue;let X=!1;Wi(G)&&Wi(j)?X=!cl(G,j)||P:X=G!==j,X?G!=null?S(N):y.add(N):G!==void 0&&y.has(N)?S(N):v.protectedKeys[N]=!0}v.prevProp=x,v.prevResolvedValues=B,v.isActive&&(m={...m,...B}),(i||s)&&e.blockInitialAnimation&&(E=!1);const z=T&&P;E&&(!z||L)&&d.push(...I.map(N=>{const G={type:k};if(typeof N=="string"&&(i||s)&&!z&&e.manuallyAnimateOnMount&&e.parent){const{parent:j}=e,X=lt(j,N);if(j.enteringChildren&&X){const{delayChildren:oe}=X.transition||{};G.delay=Oa(j.enteringChildren,e,oe)}}return{animation:N,options:G}}))}if(y.size){const g={};if(typeof u.initial!="boolean"){const k=lt(e,Array.isArray(u.initial)?u.initial[0]:u.initial);k&&k.transition&&(g.transition=k.transition)}y.forEach(k=>{const v=e.getBaseTarget(k),x=e.getValue(k);x&&(x.liveStyle=!0),g[k]=v??null}),d.push({animation:g})}let p=!!d.length;return i&&(u.initial===!1||u.initial===u.animate)&&!e.manuallyAnimateOnMount&&(p=!1),i=!1,s=!1,p?t(d):Promise.resolve()}function c(l,u){if(n[l].isActive===u)return Promise.resolve();e.variantChildren?.forEach(d=>d.animationState?.setActive(l,u)),n[l].isActive=u;const f=a(l);for(const d in n)n[d].protectedKeys={};return f}return{animateChanges:a,setActive:c,setAnimateFunction:o,getState:()=>n,reset:()=>{n=Mo(),s=!0}}}function Nd(e,t){return typeof t=="string"?t!==e:Array.isArray(t)?!cl(t,e):!1}function it(e=!1){return{isActive:e,protectedKeys:{},needsAnimating:{},prevResolvedValues:{}}}function Mo(){return{animate:it(!0),whileInView:it(),whileHover:it(),whileTap:it(),whileDrag:it(),whileFocus:it(),exit:it()}}function Ji(e,t){e.min=t.min,e.max=t.max}function Ie(e,t){Ji(e.x,t.x),Ji(e.y,t.y)}function Oo(e,t){e.translate=t.translate,e.scale=t.scale,e.originPoint=t.originPoint,e.origin=t.origin}const ul=1e-4,Vd=1-ul,Id=1+ul,hl=.01,Bd=0-hl,$d=0+hl;function Te(e){return e.max-e.min}function Fd(e,t,n){return Math.abs(e-t)<=n}function Ro(e,t,n,i=.5){e.origin=i,e.originPoint=ee(t.min,t.max,e.origin),e.scale=Te(n)/Te(t),e.translate=ee(n.min,n.max,e.origin)-e.originPoint,(e.scale>=Vd&&e.scale<=Id||isNaN(e.scale))&&(e.scale=1),(e.translate>=Bd&&e.translate<=$d||isNaN(e.translate))&&(e.translate=0)}function Nt(e,t,n,i){Ro(e.x,t.x,n.x,i?i.originX:void 0),Ro(e.y,t.y,n.y,i?i.originY:void 0)}function jo(e,t,n,i=0){const s=i?ee(n.min,n.max,i):n.min;e.min=s+t.min,e.max=e.min+Te(t)}function _d(e,t,n,i){jo(e.x,t.x,n.x,i?.x),jo(e.y,t.y,n.y,i?.y)}function Lo(e,t,n,i=0){const s=i?ee(n.min,n.max,i):n.min;e.min=t.min-s,e.max=e.min+Te(t)}function In(e,t,n,i){Lo(e.x,t.x,n.x,i?.x),Lo(e.y,t.y,n.y,i?.y)}function No(e,t,n,i,s){return e-=t,e=Vn(e,1/n,i),s!==void 0&&(e=Vn(e,1/s,i)),e}function Hd(e,t=0,n=1,i=.5,s,r=e,o=e){if(ze.test(t)&&(t=parseFloat(t),t=ee(o.min,o.max,t/100)-o.min),typeof t!="number")return;let a=ee(r.min,r.max,i);e===r&&(a-=t),e.min=No(e.min,t,n,a,s),e.max=No(e.max,t,n,a,s)}function Vo(e,t,[n,i,s],r,o){Hd(e,t[n],t[i],t[s],t.scale,r,o)}const Wd=["x","scaleX","originX"],zd=["y","scaleY","originY"];function Io(e,t,n,i){Vo(e.x,t,Wd,n?n.x:void 0,i?i.x:void 0),Vo(e.y,t,zd,n?n.y:void 0,i?i.y:void 0)}function Bo(e){return e.translate===0&&e.scale===1}function dl(e){return Bo(e.x)&&Bo(e.y)}function $o(e,t){return e.min===t.min&&e.max===t.max}function Gd(e,t){return $o(e.x,t.x)&&$o(e.y,t.y)}function Fo(e,t){return Math.round(e.min)===Math.round(t.min)&&Math.round(e.max)===Math.round(t.max)}function fl(e,t){return Fo(e.x,t.x)&&Fo(e.y,t.y)}function _o(e){return Te(e.x)/Te(e.y)}function Ho(e,t){return e.translate===t.translate&&e.scale===t.scale&&e.originPoint===t.originPoint}function Fe(e){return[e("x"),e("y")]}function Ud(e,t,n){let i="";const s=e.x.translate/t.x,r=e.y.translate/t.y,o=n?.z||0;if((s||r||o)&&(i=`translate3d(${s}px, ${r}px, ${o}px) `),(t.x!==1||t.y!==1)&&(i+=`scale(${1/t.x}, ${1/t.y}) `),n){const{transformPerspective:l,rotate:u,pathRotation:f,rotateX:d,rotateY:y,skewX:m,skewY:w}=n;l&&(i=`perspective(${l}px) ${i}`),u&&(i+=`rotate(${u}deg) `),f&&(i+=`rotate(${f}deg) `),d&&(i+=`rotateX(${d}deg) `),y&&(i+=`rotateY(${y}deg) `),m&&(i+=`skewX(${m}deg) `),w&&(i+=`skewY(${w}deg) `)}const a=e.x.scale*t.x,c=e.y.scale*t.y;return(a!==1||c!==1)&&(i+=`scale(${a}, ${c})`),i||"none"}const Kd=Ps.length,Wo=e=>typeof e=="string"?parseFloat(e):e,zo=e=>typeof e=="number"||$.test(e);function Qd(e,t,n,i,s,r){s?(e.opacity=ee(0,n.opacity??1,qd(i)),e.opacityExit=ee(t.opacity??1,0,Yd(i))):r&&(e.opacity=ee(t.opacity??1,n.opacity??1,i));for(let o=0;o<Kd;o++){const a=Ps[o];let c=Go(t,a),l=Go(n,a);if(c===void 0&&l===void 0)continue;c||(c=0),l||(l=0),c===0||l===0||zo(c)===zo(l)?(e[a]=Math.max(ee(Wo(c),Wo(l),i),0),(ze.test(l)||ze.test(c))&&(e[a]+="%")):e[a]=l}(t.rotate||n.rotate)&&(e.rotate=ee(t.rotate||0,n.rotate||0,i))}function Go(e,t){return e[t]!==void 0?e[t]:e.borderRadius}const qd=pl(0,.5,ra),Yd=pl(.5,.95,Re);function pl(e,t,n){return i=>i<e?0:i>t?1:n(Ft(e,t,i))}function Xd(e,t,n){const i=ye(e)?e:Tt(e);return i.start(Ss("",i,t,n)),i.animation}function Wt(e,t,n,i={passive:!0}){return e.addEventListener(t,n,i),()=>e.removeEventListener(t,n,i)}const Zd=(e,t)=>e.depth-t.depth;class Jd{constructor(){this.children=[],this.isDirty=!1}add(t){hs(this.children,t),this.isDirty=!0}remove(t){Mn(this.children,t),this.isDirty=!0}forEach(t){this.isDirty&&this.children.sort(Zd),this.isDirty=!1,this.children.forEach(t)}}function ef(e,t){const n=ke.now(),i=({timestamp:s})=>{const r=s-n;r>=t&&(Je(i),e(r-t))};return te.setup(i,!0),()=>Je(i)}function Sn(e){return ye(e)?e.get():e}class tf{constructor(){this.members=[]}add(t){hs(this.members,t);for(let n=this.members.length-1;n>=0;n--){const i=this.members[n];if(i===t||i===this.lead||i===this.prevLead)continue;const s=i.instance;(!s||s.isConnected===!1)&&!i.snapshot&&(Mn(this.members,i),i.unmount())}t.scheduleRender()}remove(t){if(Mn(this.members,t),t===this.prevLead&&(this.prevLead=void 0),t===this.lead){const n=this.members[this.members.length-1];n&&this.promote(n)}}relegate(t){for(let n=this.members.indexOf(t)-1;n>=0;n--){const i=this.members[n];if(i.isPresent!==!1&&i.instance?.isConnected!==!1)return this.promote(i),!0}return!1}promote(t,n){const i=this.lead;if(t!==i&&(this.prevLead=i,this.lead=t,t.show(),i)){i.updateSnapshot(),t.scheduleRender();const{layoutDependency:s}=i.options,{layoutDependency:r}=t.options;(s===void 0||s!==r)&&(t.resumeFrom=i,n&&(i.preserveOpacity=!0),i.snapshot&&(t.snapshot=i.snapshot,t.snapshot.latestValues=i.animationValues||i.latestValues),t.root?.isUpdating&&(t.isLayoutDirty=!0)),t.options.crossfade===!1&&i.hide()}}exitAnimationComplete(){this.members.forEach(t=>{t.options.onExitComplete?.(),t.resumingFrom?.options.onExitComplete?.()})}scheduleRender(){this.members.forEach(t=>t.instance&&t.scheduleRender(!1))}removeLeadSnapshot(){this.lead?.snapshot&&(this.lead.snapshot=void 0)}}const Cn={hasAnimatedSinceResize:!0,hasEverUpdated:!1},oi=["","X","Y","Z"],nf=1e3;let sf=0;function ri(e,t,n,i){const{latestValues:s}=t;s[e]&&(n[e]=s[e],t.setStaticValue(e,0),i&&(i[e]=0))}function ml(e){if(e.hasCheckedOptimisedAppear=!0,e.root===e)return;const{visualElement:t}=e.options;if(!t)return;const n=Va(t);if(window.MotionHasOptimisedAnimation(n,"transform")){const{layout:s,layoutId:r}=e.options;window.MotionCancelOptimisedAnimation(n,"transform",te,!(s||r))}const{parent:i}=e;i&&!i.hasCheckedOptimisedAppear&&ml(i)}function gl({attachResizeListener:e,defaultParent:t,measureScroll:n,checkIsScrollRoot:i,resetTransform:s}){return class{constructor(o={},a=t?.()){this.id=sf++,this.animationId=0,this.animationCommitId=0,this.children=new Set,this.options={},this.isTreeAnimating=!1,this.isAnimationBlocked=!1,this.isLayoutDirty=!1,this.isProjectionDirty=!1,this.isSharedProjectionDirty=!1,this.isTransformDirty=!1,this.updateManuallyBlocked=!1,this.updateBlockedByResize=!1,this.isUpdating=!1,this.isSVG=!1,this.needsReset=!1,this.shouldResetTransform=!1,this.hasCheckedOptimisedAppear=!1,this.treeScale={x:1,y:1},this.eventHandlers=new Map,this.hasTreeAnimated=!1,this.layoutVersion=0,this.updateScheduled=!1,this.scheduleUpdate=()=>this.update(),this.projectionUpdateScheduled=!1,this.checkUpdateFailed=()=>{this.isUpdating&&(this.isUpdating=!1,this.clearAllSnapshots())},this.updateProjection=()=>{this.projectionUpdateScheduled=!1,this.nodes.forEach(af),this.nodes.forEach(ff),this.nodes.forEach(pf),this.nodes.forEach(lf)},this.resolvedRelativeTargetAt=0,this.linkedParentVersion=0,this.hasProjected=!1,this.isVisible=!0,this.animationProgress=0,this.sharedNodes=new Map,this.latestValues=o,this.root=a?a.root||a:this,this.path=a?[...a.path,a]:[],this.parent=a,this.depth=a?a.depth+1:0;for(let c=0;c<this.path.length;c++)this.path[c].shouldResetTransform=!0;this.root===this&&(this.nodes=new Jd)}addEventListener(o,a){return this.eventHandlers.has(o)||this.eventHandlers.set(o,new ds),this.eventHandlers.get(o).add(a)}notifyListeners(o,...a){const c=this.eventHandlers.get(o);c&&c.notify(...a)}hasListeners(o){return this.eventHandlers.has(o)}mount(o){if(this.instance)return;this.isSVG=Ms(o)&&!rd(o),this.instance=o;const{layoutId:a,layout:c,visualElement:l}=this.options;if(l&&!l.current&&l.mount(o),this.root.nodes.add(this),this.parent&&this.parent.children.add(this),this.root.hasTreeAnimated&&(c||a)&&(this.isLayoutDirty=!0),e){let u,f=0;const d=()=>this.root.updateBlockedByResize=!1;te.read(()=>{f=window.innerWidth}),e(o,()=>{const y=window.innerWidth;y!==f&&(f=y,this.root.updateBlockedByResize=!0,u&&u(),u=ef(d,250),Cn.hasAnimatedSinceResize&&(Cn.hasAnimatedSinceResize=!1,this.nodes.forEach(Qo)))})}a&&this.root.registerSharedNode(a,this),this.options.animate!==!1&&l&&(a||c)&&this.addEventListener("didUpdate",({delta:u,hasLayoutChanged:f,hasRelativeLayoutChanged:d,layout:y})=>{if(this.isTreeAnimationBlocked()){this.target=void 0,this.relativeTarget=void 0;return}const m=this.options.transition||l.getDefaultTransition()||wf,{onLayoutAnimationStart:w,onLayoutAnimationComplete:p}=l.getProps(),g=!this.targetLayout||!fl(this.targetLayout,y),k=!f&&d;if(this.options.layoutRoot||this.resumeFrom||k||f&&(g||!this.currentAnimation)){this.resumeFrom&&(this.resumingFrom=this.resumeFrom,this.resumingFrom.resumingFrom=void 0);const v={...Ts(m,"layout"),onPlay:w,onComplete:p};(l.shouldReduceMotion||this.options.layoutRoot)&&(v.delay=0,v.type=!1),this.startAnimation(v),this.setAnimationOrigin(u,k,v.path)}else f||Qo(this),this.isLead()&&this.options.onExitComplete&&this.options.onExitComplete();this.targetLayout=y})}unmount(){this.options.layoutId&&this.willUpdate(),this.root.nodes.remove(this);const o=this.getStack();o&&o.remove(this),this.parent&&this.parent.children.delete(this),this.instance=void 0,this.eventHandlers.clear(),Je(this.updateProjection)}blockUpdate(){this.updateManuallyBlocked=!0}unblockUpdate(){this.updateManuallyBlocked=!1}isUpdateBlocked(){return this.updateManuallyBlocked||this.updateBlockedByResize}isTreeAnimationBlocked(){return this.isAnimationBlocked||this.parent&&this.parent.isTreeAnimationBlocked()||!1}startUpdate(){this.isUpdateBlocked()||(this.isUpdating=!0,this.nodes&&this.nodes.forEach(mf),this.animationId++)}getTransformTemplate(){const{visualElement:o}=this.options;return o&&o.getProps().transformTemplate}willUpdate(o=!0){if(this.root.hasTreeAnimated=!0,this.root.isUpdateBlocked()){this.options.onExitComplete&&this.options.onExitComplete();return}if(window.MotionCancelOptimisedAnimation&&!this.hasCheckedOptimisedAppear&&ml(this),!this.root.isUpdating&&this.root.startUpdate(),this.isLayoutDirty)return;this.isLayoutDirty=!0;for(let u=0;u<this.path.length;u++){const f=this.path[u];f.shouldResetTransform=!0,(typeof f.latestValues.x=="string"||typeof f.latestValues.y=="string")&&(f.isLayoutDirty=!0),f.updateScroll("snapshot"),f.options.layoutRoot&&f.willUpdate(!1)}const{layoutId:a,layout:c}=this.options;if(a===void 0&&!c)return;const l=this.getTransformTemplate();this.prevTransformTemplateValue=l?l(this.latestValues,""):void 0,this.updateSnapshot(),o&&this.notifyListeners("willUpdate")}update(){if(this.updateScheduled=!1,this.isUpdateBlocked()){const c=this.updateBlockedByResize;this.unblockUpdate(),this.updateBlockedByResize=!1,this.clearAllSnapshots(),c&&this.nodes.forEach(uf),this.nodes.forEach(Uo);return}if(this.animationId<=this.animationCommitId){this.nodes.forEach(Ko);return}this.animationCommitId=this.animationId,this.isUpdating?(this.isUpdating=!1,this.nodes.forEach(hf),this.nodes.forEach(df),this.nodes.forEach(of),this.nodes.forEach(rf)):this.nodes.forEach(Ko),this.clearAllSnapshots();const a=ke.now();ge.delta=Ge(0,1e3/60,a-ge.timestamp),ge.timestamp=a,ge.isProcessing=!0,Xn.update.process(ge),Xn.preRender.process(ge),Xn.render.process(ge),ge.isProcessing=!1}didUpdate(){this.updateScheduled||(this.updateScheduled=!0,Es.read(this.scheduleUpdate))}clearAllSnapshots(){this.nodes.forEach(cf),this.sharedNodes.forEach(gf)}scheduleUpdateProjection(){this.projectionUpdateScheduled||(this.projectionUpdateScheduled=!0,te.preRender(this.updateProjection,!1,!0))}scheduleCheckAfterUnmount(){te.postRender(()=>{this.isLayoutDirty?this.root.didUpdate():this.root.checkUpdateFailed()})}updateSnapshot(){this.snapshot||!this.instance||(this.snapshot=this.measure(),this.snapshot&&!Te(this.snapshot.measuredBox.x)&&!Te(this.snapshot.measuredBox.y)&&(this.snapshot=void 0))}updateLayout(){if(!this.instance||(this.updateScroll(),!(this.options.alwaysMeasureLayout&&this.isLead())&&!this.isLayoutDirty))return;if(this.resumeFrom&&!this.resumeFrom.instance)for(let c=0;c<this.path.length;c++)this.path[c].updateScroll();const o=this.layout;this.layout=this.measure(!1),this.layoutVersion++,this.layoutCorrected||(this.layoutCorrected=he()),this.isLayoutDirty=!1,this.projectionDelta=void 0,this.notifyListeners("measure",this.layout.layoutBox);const{visualElement:a}=this.options;a&&a.notify("LayoutMeasure",this.layout.layoutBox,o?o.layoutBox:void 0)}updateScroll(o="measure"){let a=!!(this.options.layoutScroll&&this.instance);if(this.scroll&&this.scroll.animationId===this.root.animationId&&this.scroll.phase===o&&(a=!1),a&&this.instance){const c=i(this.instance);this.scroll={animationId:this.root.animationId,phase:o,isRoot:c,offset:n(this.instance),wasRoot:this.scroll?this.scroll.isRoot:c}}}resetTransform(){if(!s)return;const o=this.isLayoutDirty||this.shouldResetTransform||this.options.alwaysMeasureLayout,a=this.projectionDelta&&!dl(this.projectionDelta),c=this.getTransformTemplate(),l=c?c(this.latestValues,""):void 0,u=l!==this.prevTransformTemplateValue;o&&this.instance&&(a||st(this.latestValues)||u)&&(s(this.instance,l),this.shouldResetTransform=!1,this.scheduleRender())}measure(o=!0){const a=this.measurePageBox();let c=this.removeElementScroll(a);return o&&(c=this.removeTransform(c)),xf(c),{animationId:this.root.animationId,measuredBox:a,layoutBox:c,latestValues:{},source:this.id}}measurePageBox(){const{visualElement:o}=this.options;if(!o)return he();const a=o.measureViewportBox();if(!(this.scroll?.wasRoot||this.path.some(vf))){const{scroll:l}=this.root;l&&(_e(a.x,l.offset.x),_e(a.y,l.offset.y))}return a}removeElementScroll(o){const a=he();if(Ie(a,o),this.scroll?.wasRoot)return a;for(let c=0;c<this.path.length;c++){const l=this.path[c],{scroll:u,options:f}=l;l!==this.root&&u&&f.layoutScroll&&(u.wasRoot&&Ie(a,o),_e(a.x,u.offset.x),_e(a.y,u.offset.y))}return a}applyTransform(o,a=!1,c){const l=c||he();Ie(l,o);for(let u=0;u<this.path.length;u++){const f=this.path[u];!a&&f.options.layoutScroll&&f.scroll&&f!==f.root&&(_e(l.x,-f.scroll.offset.x),_e(l.y,-f.scroll.offset.y)),st(f.latestValues)&&Tn(l,f.latestValues,f.layout?.layoutBox)}return st(this.latestValues)&&Tn(l,this.latestValues,this.layout?.layoutBox),l}removeTransform(o){const a=he();Ie(a,o);for(let c=0;c<this.path.length;c++){const l=this.path[c];if(!st(l.latestValues))continue;let u;l.instance&&(Yi(l.latestValues)&&l.updateSnapshot(),u=he(),Ie(u,l.measurePageBox())),Io(a,l.latestValues,l.snapshot?.layoutBox,u)}return st(this.latestValues)&&Io(a,this.latestValues),a}setTargetDelta(o){this.targetDelta=o,this.root.scheduleUpdateProjection(),this.isProjectionDirty=!0}setOptions(o){this.options={...this.options,...o,crossfade:o.crossfade!==void 0?o.crossfade:!0}}clearMeasurements(){this.scroll=void 0,this.layout=void 0,this.snapshot=void 0,this.prevTransformTemplateValue=void 0,this.targetDelta=void 0,this.target=void 0,this.isLayoutDirty=!1}forceRelativeParentToResolveTarget(){this.relativeParent&&this.relativeParent.resolvedRelativeTargetAt!==ge.timestamp&&this.relativeParent.resolveTargetDelta(!0)}resolveTargetDelta(o=!1){const a=this.getLead();this.isProjectionDirty||(this.isProjectionDirty=a.isProjectionDirty),this.isTransformDirty||(this.isTransformDirty=a.isTransformDirty),this.isSharedProjectionDirty||(this.isSharedProjectionDirty=a.isSharedProjectionDirty);const c=!!this.resumingFrom||this!==a;if(!(o||c&&this.isSharedProjectionDirty||this.isProjectionDirty||this.parent?.isProjectionDirty||this.attemptToResolveRelativeTarget||this.root.updateBlockedByResize))return;const{layout:u,layoutId:f}=this.options;if(!this.layout||!(u||f))return;this.resolvedRelativeTargetAt=ge.timestamp;const d=this.getClosestProjectingParent();d&&this.linkedParentVersion!==d.layoutVersion&&!d.options.layoutRoot&&this.removeRelativeTarget(),!this.targetDelta&&!this.relativeTarget&&(this.options.layoutAnchor!==!1&&d&&d.layout?this.createRelativeTarget(d,this.layout.layoutBox,d.layout.layoutBox):this.removeRelativeTarget()),!(!this.relativeTarget&&!this.targetDelta)&&(this.target||(this.target=he(),this.targetWithTransforms=he()),this.relativeTarget&&this.relativeTargetOrigin&&this.relativeParent&&this.relativeParent.target?(this.forceRelativeParentToResolveTarget(),_d(this.target,this.relativeTarget,this.relativeParent.target,this.options.layoutAnchor||void 0)):this.targetDelta?(this.resumingFrom?this.applyTransform(this.layout.layoutBox,!1,this.target):Ie(this.target,this.layout.layoutBox),Ja(this.target,this.targetDelta)):Ie(this.target,this.layout.layoutBox),this.attemptToResolveRelativeTarget&&(this.attemptToResolveRelativeTarget=!1,this.options.layoutAnchor!==!1&&d&&!!d.resumingFrom==!!this.resumingFrom&&!d.options.layoutScroll&&d.target&&this.animationProgress!==1?this.createRelativeTarget(d,this.target,d.target):this.relativeParent=this.relativeTarget=void 0))}getClosestProjectingParent(){if(!(!this.parent||Yi(this.parent.latestValues)||Za(this.parent.latestValues)))return this.parent.isProjecting()?this.parent:this.parent.getClosestProjectingParent()}isProjecting(){return!!((this.relativeTarget||this.targetDelta||this.options.layoutRoot)&&this.layout)}createRelativeTarget(o,a,c){this.relativeParent=o,this.linkedParentVersion=o.layoutVersion,this.forceRelativeParentToResolveTarget(),this.relativeTarget=he(),this.relativeTargetOrigin=he(),In(this.relativeTargetOrigin,a,c,this.options.layoutAnchor||void 0),Ie(this.relativeTarget,this.relativeTargetOrigin)}removeRelativeTarget(){this.relativeParent=this.relativeTarget=void 0}calcProjection(){const o=this.getLead(),a=!!this.resumingFrom||this!==o;let c=!0;if((this.isProjectionDirty||this.parent?.isProjectionDirty)&&(c=!1),a&&(this.isSharedProjectionDirty||this.isTransformDirty)&&(c=!1),this.resolvedRelativeTargetAt===ge.timestamp&&(c=!1),c)return;const{layout:l,layoutId:u}=this.options;if(this.isTreeAnimating=!!(this.parent&&this.parent.isTreeAnimating||this.currentAnimation||this.pendingAnimation),this.isTreeAnimating||(this.targetDelta=this.relativeTarget=void 0),!this.layout||!(l||u))return;Ie(this.layoutCorrected,this.layout.layoutBox);const f=this.treeScale.x,d=this.treeScale.y;yd(this.layoutCorrected,this.treeScale,this.path,a),o.layout&&!o.target&&(this.treeScale.x!==1||this.treeScale.y!==1)&&(o.target=o.layout.layoutBox,o.targetWithTransforms=he());const{target:y}=o;if(!y){this.prevProjectionDelta&&(this.createProjectionDeltas(),this.scheduleRender());return}!this.projectionDelta||!this.prevProjectionDelta?this.createProjectionDeltas():(Oo(this.prevProjectionDelta.x,this.projectionDelta.x),Oo(this.prevProjectionDelta.y,this.projectionDelta.y)),Nt(this.projectionDelta,this.layoutCorrected,y,this.latestValues),(this.treeScale.x!==f||this.treeScale.y!==d||!Ho(this.projectionDelta.x,this.prevProjectionDelta.x)||!Ho(this.projectionDelta.y,this.prevProjectionDelta.y))&&(this.hasProjected=!0,this.scheduleRender(),this.notifyListeners("projectionUpdate",y))}hide(){this.isVisible=!1}show(){this.isVisible=!0}scheduleRender(o=!0){if(this.options.visualElement?.scheduleRender(),o){const a=this.getStack();a&&a.scheduleRender()}this.resumingFrom&&!this.resumingFrom.instance&&(this.resumingFrom=void 0)}createProjectionDeltas(){this.prevProjectionDelta=vt(),this.projectionDelta=vt(),this.projectionDeltaWithTransform=vt()}setAnimationOrigin(o,a=!1,c){const l=this.snapshot,u=l?l.latestValues:{},f={...this.latestValues},d=vt();(!this.relativeParent||!this.relativeParent.options.layoutRoot)&&(this.relativeTarget=this.relativeTargetOrigin=void 0),this.attemptToResolveRelativeTarget=!a;const y=he(),m=l?l.source:void 0,w=this.layout?this.layout.source:void 0,p=m!==w,g=this.getStack(),k=!g||g.members.length<=1,v=!!(p&&!k&&this.options.crossfade===!0&&!this.path.some(bf));this.animationProgress=0;let x;const C=c?.interpolateProjection(o);this.mixTargetDelta=D=>{const T=D/1e3,P=C?.(T);P?(d.x.translate=P.x,d.x.scale=ee(o.x.scale,1,T),d.x.origin=o.x.origin,d.x.originPoint=o.x.originPoint,d.y.translate=P.y,d.y.scale=ee(o.y.scale,1,T),d.y.origin=o.y.origin,d.y.originPoint=o.y.originPoint):(qo(d.x,o.x,T),qo(d.y,o.y,T)),this.setTargetDelta(d),this.relativeTarget&&this.relativeTargetOrigin&&this.layout&&this.relativeParent&&this.relativeParent.layout&&(In(y,this.layout.layoutBox,this.relativeParent.layout.layoutBox,this.options.layoutAnchor||void 0),yf(this.relativeTarget,this.relativeTargetOrigin,y,T),x&&Gd(this.relativeTarget,x)&&(this.isProjectionDirty=!1),x||(x=he()),Ie(x,this.relativeTarget)),p&&(this.animationValues=f,Qd(f,u,this.latestValues,T,v,k)),P&&P.rotate!==void 0&&(this.animationValues||(this.animationValues=f),this.animationValues.pathRotation=P.rotate),this.root.scheduleUpdateProjection(),this.scheduleRender(),this.animationProgress=T},this.mixTargetDelta(this.options.layoutRoot?1e3:0)}startAnimation(o){this.notifyListeners("animationStart"),this.currentAnimation?.stop(),this.resumingFrom?.currentAnimation?.stop(),this.pendingAnimation&&(Je(this.pendingAnimation),this.pendingAnimation=void 0),this.pendingAnimation=te.update(()=>{Cn.hasAnimatedSinceResize=!0,this.motionValue||(this.motionValue=Tt(0)),this.motionValue.jump(0,!1),this.currentAnimation=Xd(this.motionValue,[0,1e3],{...o,velocity:0,isSync:!0,onUpdate:a=>{this.mixTargetDelta(a),o.onUpdate&&o.onUpdate(a)},onComplete:()=>{o.onComplete&&o.onComplete(),this.completeAnimation()}}),this.resumingFrom&&(this.resumingFrom.currentAnimation=this.currentAnimation),this.pendingAnimation=void 0})}completeAnimation(){this.resumingFrom&&(this.resumingFrom.currentAnimation=void 0,this.resumingFrom.preserveOpacity=void 0);const o=this.getStack();o&&o.exitAnimationComplete(),this.resumingFrom=this.currentAnimation=this.animationValues=void 0,this.notifyListeners("animationComplete")}finishAnimation(){this.currentAnimation&&(this.mixTargetDelta&&this.mixTargetDelta(nf),this.currentAnimation.stop()),this.completeAnimation()}applyTransformsToTarget(){const o=this.getLead();let{targetWithTransforms:a,target:c,layout:l,latestValues:u}=o;if(!(!a||!c||!l)){if(this!==o&&this.layout&&l&&yl(this.options.animationType,this.layout.layoutBox,l.layoutBox)){c=this.target||he();const f=Te(this.layout.layoutBox.x);c.x.min=o.target.x.min,c.x.max=c.x.min+f;const d=Te(this.layout.layoutBox.y);c.y.min=o.target.y.min,c.y.max=c.y.min+d}Ie(a,c),Tn(a,u),Nt(this.projectionDeltaWithTransform,this.layoutCorrected,a,u)}}registerSharedNode(o,a){this.sharedNodes.has(o)||this.sharedNodes.set(o,new tf),this.sharedNodes.get(o).add(a);const l=a.options.initialPromotionConfig;a.promote({transition:l?l.transition:void 0,preserveFollowOpacity:l&&l.shouldPreserveFollowOpacity?l.shouldPreserveFollowOpacity(a):void 0})}isLead(){const o=this.getStack();return o?o.lead===this:!0}getLead(){const{layoutId:o}=this.options;return o?this.getStack()?.lead||this:this}getPrevLead(){const{layoutId:o}=this.options;return o?this.getStack()?.prevLead:void 0}getStack(){const{layoutId:o}=this.options;if(o)return this.root.sharedNodes.get(o)}promote({needsReset:o,transition:a,preserveFollowOpacity:c}={}){const l=this.getStack();l&&l.promote(this,c),o&&(this.projectionDelta=void 0,this.needsReset=!0),a&&this.setOptions({transition:a})}relegate(){const o=this.getStack();return o?o.relegate(this):!1}resetSkewAndRotation(){const{visualElement:o}=this.options;if(!o)return;let a=!1;const{latestValues:c}=o;if((c.z||c.rotate||c.rotateX||c.rotateY||c.rotateZ||c.skewX||c.skewY)&&(a=!0),!a)return;const l={};c.z&&ri("z",o,l,this.animationValues);for(let u=0;u<oi.length;u++)ri(`rotate${oi[u]}`,o,l,this.animationValues),ri(`skew${oi[u]}`,o,l,this.animationValues);o.render();for(const u in l)o.setStaticValue(u,l[u]),this.animationValues&&(this.animationValues[u]=l[u]);o.scheduleRender()}applyProjectionStyles(o,a){if(!this.instance||this.isSVG)return;if(!this.isVisible){o.visibility="hidden";return}const c=this.getTransformTemplate();if(this.needsReset){this.needsReset=!1,o.visibility="",o.opacity="",o.pointerEvents=Sn(a?.pointerEvents)||"",o.transform=c?c(this.latestValues,""):"none";return}const l=this.getLead();if(!this.projectionDelta||!this.layout||!l.target){this.options.layoutId&&(o.opacity=this.latestValues.opacity!==void 0?this.latestValues.opacity:1,o.pointerEvents=Sn(a?.pointerEvents)||""),this.hasProjected&&!st(this.latestValues)&&(o.transform=c?c({},""):"none",this.hasProjected=!1);return}o.visibility="";const u=l.animationValues||l.latestValues;this.applyTransformsToTarget();let f=Ud(this.projectionDeltaWithTransform,this.treeScale,u);c&&(f=c(u,f)),o.transform=f;const{x:d,y}=this.projectionDelta;o.transformOrigin=`${d.origin*100}% ${y.origin*100}% 0`,l.animationValues?o.opacity=l===this?u.opacity??this.latestValues.opacity??1:this.preserveOpacity?this.latestValues.opacity:u.opacityExit:o.opacity=l===this?u.opacity!==void 0?u.opacity:"":u.opacityExit!==void 0?u.opacityExit:0;for(const m in Zi){if(u[m]===void 0)continue;const{correct:w,applyTo:p,isCSSVariable:g}=Zi[m],k=f==="none"?u[m]:w(u[m],l);if(p){const v=p.length;for(let x=0;x<v;x++)o[p[x]]=k}else g?this.options.visualElement.renderState.vars[m]=k:o[m]=k}this.options.layoutId&&(o.pointerEvents=l===this?Sn(a?.pointerEvents)||"":"none")}clearSnapshot(){this.resumeFrom=this.snapshot=void 0}resetTree(){this.root.nodes.forEach(o=>o.currentAnimation?.stop()),this.root.nodes.forEach(Uo),this.root.sharedNodes.clear()}}}function of(e){e.updateLayout()}function rf(e){const t=e.resumeFrom?.snapshot||e.snapshot;if(e.isLead()&&e.layout&&t&&e.hasListeners("didUpdate")){const{layoutBox:n,measuredBox:i}=e.layout,{animationType:s}=e.options,r=t.source!==e.layout.source;if(s==="size")Fe(u=>{const f=r?t.measuredBox[u]:t.layoutBox[u],d=Te(f);f.min=n[u].min,f.max=f.min+d});else if(s==="x"||s==="y"){const u=s==="x"?"y":"x";Ji(r?t.measuredBox[u]:t.layoutBox[u],n[u])}else yl(s,t.layoutBox,n)&&Fe(u=>{const f=r?t.measuredBox[u]:t.layoutBox[u],d=Te(n[u]);f.max=f.min+d,e.relativeTarget&&!e.currentAnimation&&(e.isProjectionDirty=!0,e.relativeTarget[u].max=e.relativeTarget[u].min+d)});const o=vt();Nt(o,n,t.layoutBox);const a=vt();r?Nt(a,e.applyTransform(i,!0),t.measuredBox):Nt(a,n,t.layoutBox);const c=!dl(o);let l=!1;if(!e.resumeFrom){const u=e.getClosestProjectingParent();if(u&&!u.resumeFrom){const{snapshot:f,layout:d}=u;if(f&&d){const y=e.options.layoutAnchor||void 0,m=he();In(m,t.layoutBox,f.layoutBox,y);const w=he();In(w,n,d.layoutBox,y),fl(m,w)||(l=!0),u.options.layoutRoot&&(e.relativeTarget=w,e.relativeTargetOrigin=m,e.relativeParent=u)}}}e.notifyListeners("didUpdate",{layout:n,snapshot:t,delta:a,layoutDelta:o,hasLayoutChanged:c,hasRelativeLayoutChanged:l})}else if(e.isLead()){const{onExitComplete:n}=e.options;n&&n()}e.options.transition=void 0}function af(e){e.parent&&(e.isProjecting()||(e.isProjectionDirty=e.parent.isProjectionDirty),e.isSharedProjectionDirty||(e.isSharedProjectionDirty=!!(e.isProjectionDirty||e.parent.isProjectionDirty||e.parent.isSharedProjectionDirty)),e.isTransformDirty||(e.isTransformDirty=e.parent.isTransformDirty))}function lf(e){e.isProjectionDirty=e.isSharedProjectionDirty=e.isTransformDirty=!1}function cf(e){e.clearSnapshot()}function Uo(e){e.clearMeasurements()}function uf(e){e.isLayoutDirty=!0,e.updateLayout()}function Ko(e){e.isLayoutDirty=!1}function hf(e){e.isAnimationBlocked&&e.layout&&!e.isLayoutDirty&&(e.snapshot=e.layout,e.isLayoutDirty=!0)}function df(e){const{visualElement:t}=e.options;t&&t.getProps().onBeforeLayoutMeasure&&t.notify("BeforeLayoutMeasure"),e.resetTransform()}function Qo(e){e.finishAnimation(),e.targetDelta=e.relativeTarget=e.target=void 0,e.isProjectionDirty=!0}function ff(e){e.resolveTargetDelta()}function pf(e){e.calcProjection()}function mf(e){e.resetSkewAndRotation()}function gf(e){e.removeLeadSnapshot()}function qo(e,t,n){e.translate=ee(t.translate,0,n),e.scale=ee(t.scale,1,n),e.origin=t.origin,e.originPoint=t.originPoint}function Yo(e,t,n,i){e.min=ee(t.min,n.min,i),e.max=ee(t.max,n.max,i)}function yf(e,t,n,i){Yo(e.x,t.x,n.x,i),Yo(e.y,t.y,n.y,i)}function bf(e){return e.animationValues&&e.animationValues.opacityExit!==void 0}const wf={duration:.45,ease:[.4,0,.1,1]},Xo=e=>typeof navigator<"u"&&navigator.userAgent&&navigator.userAgent.toLowerCase().includes(e),Zo=Xo("applewebkit/")&&!Xo("chrome/")?Math.round:Re;function Jo(e){e.min=Zo(e.min),e.max=Zo(e.max)}function xf(e){Jo(e.x),Jo(e.y)}function yl(e,t,n){return e==="position"||e==="preserve-aspect"&&!Fd(_o(t),_o(n),.2)}function vf(e){return e!==e.root&&e.scroll?.wasRoot}const kf=gl({attachResizeListener:(e,t)=>Wt(e,"resize",t),measureScroll:()=>({x:document.documentElement.scrollLeft||document.body?.scrollLeft||0,y:document.documentElement.scrollTop||document.body?.scrollTop||0}),checkIsScrollRoot:()=>!0}),ai={current:void 0},bl=gl({measureScroll:e=>({x:e.scrollLeft,y:e.scrollTop}),defaultParent:()=>{if(!ai.current){const e=new kf({});e.mount(window),e.setOptions({layoutScroll:!0}),ai.current=e}return ai.current},resetTransform:(e,t)=>{e.style.transform=t!==void 0?t:"none"},checkIsScrollRoot:e=>window.getComputedStyle(e).position==="fixed"}),Ns=b.createContext({transformPagePoint:e=>e,isStatic:!1,reducedMotion:"never"});function er(e,t){if(typeof e=="function")return e(t);e!=null&&(e.current=t)}function Tf(...e){return t=>{let n=!1;const i=e.map(s=>{const r=er(s,t);return!n&&typeof r=="function"&&(n=!0),r});if(n)return()=>{for(let s=0;s<i.length;s++){const r=i[s];typeof r=="function"?r():er(e[s],null)}}}}function Sf(...e){return b.useCallback(Tf(...e),e)}class Cf extends b.Component{getSnapshotBeforeUpdate(t){const n=this.props.childRef.current;if(bn(n)&&t.isPresent&&!this.props.isPresent&&this.props.pop!==!1){const i=n.offsetParent,s=bn(i)&&i.offsetWidth||0,r=bn(i)&&i.offsetHeight||0,o=getComputedStyle(n),a=this.props.sizeRef.current;a.height=parseFloat(o.height),a.width=parseFloat(o.width),a.top=n.offsetTop,a.left=n.offsetLeft,a.right=s-a.width-a.left,a.bottom=r-a.height-a.top,a.direction=o.direction}return null}componentDidUpdate(){}render(){return this.props.children}}function Af({children:e,isPresent:t,anchorX:n,anchorY:i,root:s,pop:r}){const o=b.useId(),a=b.useRef(null),c=b.useRef({width:0,height:0,top:0,left:0,right:0,bottom:0,direction:"ltr"}),{nonce:l}=b.useContext(Ns),u=r!==!1?e.props?.ref??e?.ref:void 0,f=Sf(a,u);return b.useInsertionEffect(()=>{const{width:d,height:y,top:m,left:w,right:p,bottom:g,direction:k}=c.current;if(t||r===!1||!a.current||!d||!y)return;const v=k==="rtl",x=n==="left"?v?`right: ${p}`:`left: ${w}`:v?`left: ${w}`:`right: ${p}`,C=i==="bottom"?`bottom: ${g}`:`top: ${m}`;a.current.dataset.motionPopId=o;const D=document.createElement("style");l&&(D.nonce=l);const T=s??document.head;return T.appendChild(D),D.sheet&&D.sheet.insertRule(`
          [data-motion-pop-id="${o}"] {
            position: absolute !important;
            width: ${d}px !important;
            height: ${y}px !important;
            ${x}px !important;
            ${C}px !important;
          }
        `),()=>{a.current?.removeAttribute("data-motion-pop-id"),T.contains(D)&&T.removeChild(D)}},[t]),h.jsx(Cf,{isPresent:t,childRef:a,sizeRef:c,pop:r,children:r===!1?e:b.cloneElement(e,{ref:f})})}const Pf=({children:e,initial:t,isPresent:n,onExitComplete:i,custom:s,presenceAffectsLayout:r,mode:o,anchorX:a,anchorY:c,root:l})=>{const u=us(Ef),f=b.useId(),d=b.useRef(n),y=b.useRef(i);Dn(()=>{d.current=n,y.current=i});let m=!0,w=b.useMemo(()=>(m=!1,{id:f,initial:t,isPresent:n,custom:s,onExitComplete:p=>{u.set(p,!0);for(const g of u.values())if(!g)return;i&&i()},register:p=>(u.set(p,!1),()=>{u.delete(p),!d.current&&!u.size&&y.current?.()})}),[n,u,i]);return r&&m&&(w={...w}),b.useMemo(()=>{u.forEach((p,g)=>u.set(g,!1))},[n]),b.useEffect(()=>{!n&&!u.size&&i&&i()},[n]),e=h.jsx(Af,{pop:o==="popLayout",isPresent:n,anchorX:a,anchorY:c,root:l,children:e}),h.jsx(Fn.Provider,{value:w,children:e})};function Ef(){return new Map}function wl(e=!0){const t=b.useContext(Fn);if(t===null)return[!0,null];const{isPresent:n,onExitComplete:i,register:s}=t,r=b.useId();b.useEffect(()=>{if(e)return s(r)},[e]);const o=b.useCallback(()=>e&&i&&i(r),[r,i,e]);return!n&&i?[!1,o]:[!0]}const sn=e=>e.key||"";function tr(e){const t=[];return b.Children.forEach(e,n=>{b.isValidElement(n)&&t.push(n)}),t}const Df=({children:e,custom:t,initial:n=!0,onExitComplete:i,presenceAffectsLayout:s=!0,mode:r="sync",propagate:o=!1,anchorX:a="left",anchorY:c="top",root:l})=>{const[u,f]=wl(o),d=b.useMemo(()=>tr(e),[e]),y=o&&!u?[]:d.map(sn),m=b.useRef(!0),w=b.useRef(d),p=us(()=>new Map),g=b.useRef(new Set),[k,v]=b.useState(d),[x,C]=b.useState(d);Dn(()=>{o&&!u&&!x.length&&f?.()},[u,o,x.length,f]),Dn(()=>{m.current=!1,w.current=d;for(let P=0;P<x.length;P++){const E=sn(x[P]);y.includes(E)?(p.delete(E),g.current.delete(E)):p.get(E)!==!0&&p.set(E,!1)}},[x,y.length,y.join("-")]);const D=[];if(d!==k){let P=[...d],E=0;for(const L of x){const I=y.indexOf(sn(L));I===-1?(P.splice(E++,0,L),D.push(L)):E=I+D.length+1}return r==="wait"&&D.length&&(P=D),C(tr(P)),v(d),null}const{forceRender:T}=b.useContext(cs);return h.jsx(h.Fragment,{children:x.map(P=>{const E=sn(P),L=o&&!u?!1:d===x||y.includes(E),I=()=>{if(g.current.has(E))return;if(p.has(E))g.current.add(E),p.set(E,!0);else return;let B=!0;p.forEach(O=>{O||(B=!1)}),B&&(T?.(),C(w.current),o&&f?.(),i&&i())};return h.jsx(Pf,{isPresent:L,initial:!m.current||n?void 0:!1,custom:t,presenceAffectsLayout:s,mode:r,root:l,onExitComplete:L?void 0:I,anchorX:a,anchorY:c,children:P},E)})})},xl=b.createContext({strict:!1}),nr={animation:["animate","variants","whileHover","whileTap","exit","whileInView","whileFocus","whileDrag"],exit:["exit"],drag:["drag","dragControls"],focus:["whileFocus"],hover:["whileHover","onHoverStart","onHoverEnd"],tap:["whileTap","onTap","onTapStart","onTapCancel"],pan:["onPan","onPanStart","onPanSessionStart","onPanEnd"],inView:["whileInView","onViewportEnter","onViewportLeave"],layout:["layout","layoutId"]};let ir=!1;function Mf(){if(ir)return;const e={};for(const t in nr)e[t]={isEnabled:n=>nr[t].some(i=>!!n[i])};qa(e),ir=!0}function vl(){return Mf(),fd()}function Of(e){const t=vl();for(const n in e)t[n]={...t[n],...e[n]};qa(t)}const Gn=b.createContext({});function Rf(e,t){if(zn(e)){const{initial:n,animate:i}=e;return{initial:n===!1||Ht(n)?n:void 0,animate:Ht(i)?i:void 0}}return e.inherit!==!1?t:{}}function jf(e){const{initial:t,animate:n}=Rf(e,b.useContext(Gn));return b.useMemo(()=>({initial:t,animate:n}),[sr(t),sr(n)])}function sr(e){return Array.isArray(e)?e.join(" "):e}const Vs=()=>({style:{},transform:{},transformOrigin:{},vars:{}});function kl(e,t,n){for(const i in t)!ye(t[i])&&!nl(i,n)&&(e[i]=t[i])}function Lf({transformTemplate:e},t){return b.useMemo(()=>{const n=Vs();return js(n,t,e),Object.assign({},n.vars,n.style)},[t])}function Nf(e,t){const n=e.style||{},i={};return kl(i,n,e),Object.assign(i,Lf(e,t)),i}function Vf(e,t){const n={},i=Nf(e,t);return e.drag&&e.dragListener!==!1&&(n.draggable=!1,i.userSelect=i.WebkitUserSelect=i.WebkitTouchCallout="none",i.touchAction=e.drag===!0?"none":`pan-${e.drag==="x"?"y":"x"}`),e.tabIndex===void 0&&(e.onTap||e.onTapStart||e.whileTap)&&(n.tabIndex=0),n.style=i,n}const Tl=()=>({...Vs(),attrs:{}});function If(e,t,n,i){const s=b.useMemo(()=>{const r=Tl();return sl(r,t,rl(i),e.transformTemplate,e.style),{...r.attrs,style:{...r.style}}},[t]);if(e.style){const r={};kl(r,e.style,e),s.style={...r,...s.style}}return s}const Bf=new Set(["animate","exit","variants","initial","style","values","variants","transition","transformTemplate","custom","inherit","onBeforeLayoutMeasure","onAnimationStart","onAnimationComplete","onUpdate","onDragStart","onDrag","onDragEnd","onMeasureDragConstraints","onDirectionLock","onDragTransitionEnd","_dragX","_dragY","onHoverStart","onHoverEnd","onViewportEnter","onViewportLeave","globalTapTarget","propagate","ignoreStrict","viewport"]);function Bn(e){return e.startsWith("while")||e.startsWith("drag")&&e!=="draggable"||e.startsWith("layout")||e.startsWith("onTap")||e.startsWith("onPan")||e.startsWith("onLayout")||Bf.has(e)}function $f(e,t){return e.startsWith("on")?!Bn(e):t?.(e)??!Bn(e)}function Ff(e,t,n,i){const s={};for(const r in e)r==="values"&&typeof e.values=="object"||ye(e[r])||($f(r,i)||n===!0&&Bn(r)||!t&&!Bn(r)||e.draggable&&r.startsWith("onDrag"))&&(s[r]=e[r]);return s}const _f=["animate","circle","defs","desc","ellipse","g","image","line","filter","marker","mask","metadata","path","pattern","polygon","polyline","rect","stop","switch","symbol","svg","text","tspan","use","view"];function Is(e){return typeof e!="string"||e.includes("-")?!1:!!(_f.indexOf(e)>-1||/[A-Z]/u.test(e))}function Hf(e,t,n,{latestValues:i},s,r=!1,o,a){const l=(o??Is(e)?If:Vf)(t,i,s,e),u=Ff(t,typeof e=="string",r,a),f=e!==b.Fragment?{...u,...l,ref:n}:{},{children:d}=t,y=b.useMemo(()=>ye(d)?d.get():d,[d]);return b.createElement(e,{...f,children:y})}function Wf({scrapeMotionValuesFromProps:e,createRenderState:t},n,i,s){return{latestValues:zf(n,i,s,e),renderState:t()}}function zf(e,t,n,i){const s={},r=i(e,{});for(const d in r)s[d]=Sn(r[d]);let{initial:o,animate:a}=e;const c=zn(e),l=Ka(e);t&&l&&!c&&e.inherit!==!1&&(o===void 0&&(o=t.initial),a===void 0&&(a=t.animate));let u=n?n.initial===!1:!1;u=u||o===!1;const f=u?a:o;if(f&&typeof f!="boolean"&&!Wn(f)){const d=Array.isArray(f)?f:[f];for(let y=0;y<d.length;y++){const m=Cs(e,d[y]);if(m){const{transitionEnd:w,transition:p,...g}=m;for(const k in g){let v=g[k];if(Array.isArray(v)){const x=u?v.length-1:0;v=v[x]}v!==null&&(s[k]=v)}for(const k in w)s[k]=w[k]}}}return s}const Sl=e=>(t,n)=>{const i=b.useContext(Gn),s=b.useContext(Fn),r=()=>Wf(e,t,i,s);return n?r():us(r)},Gf=Sl({scrapeMotionValuesFromProps:Ls,createRenderState:Vs}),Uf=Sl({scrapeMotionValuesFromProps:al,createRenderState:Tl}),Kf=Symbol.for("motionComponentSymbol");function Qf(e,t,n){const i=b.useRef(n);b.useInsertionEffect(()=>{i.current=n});const s=b.useRef(null);return b.useCallback(r=>{r&&e.onMount?.(r),t&&(r?t.mount(r):t.unmount());const o=i.current;if(typeof o=="function")if(r){const a=o(r);typeof a=="function"&&(s.current=a)}else s.current?(s.current(),s.current=null):o(r);else o&&(o.current=r)},[t])}const Cl=b.createContext({});function bt(e){return e&&typeof e=="object"&&Object.prototype.hasOwnProperty.call(e,"current")}function qf(e,t,n,i,s,r){const{visualElement:o}=b.useContext(Gn),a=b.useContext(xl),c=b.useContext(Fn),l=b.useContext(Ns),u=l.reducedMotion,f=l.skipAnimations,d=b.useRef(null),y=b.useRef(!1);i=i||a.renderer,!d.current&&i&&(d.current=i(e,{visualState:t,parent:o,props:n,presenceContext:c,blockInitialAnimation:c?c.initial===!1:!1,reducedMotionConfig:u,skipAnimations:f,isSVG:r}),y.current&&d.current&&(d.current.manuallyAnimateOnMount=!0));const m=d.current,w=b.useContext(Cl);m&&!m.projection&&s&&(m.type==="html"||m.type==="svg")&&Yf(d.current,n,s,w);const p=b.useRef(!1);b.useInsertionEffect(()=>{m&&p.current&&m.update(n,c)});const g=n[Na],k=b.useRef(!!g&&typeof window<"u"&&!window.MotionHandoffIsComplete?.(g)&&window.MotionHasOptimisedAnimation?.(g));return Dn(()=>{y.current=!0,m&&(p.current=!0,window.MotionIsMounted=!0,m.updateFeatures(),m.scheduleRenderMicrotask(),k.current&&m.animationState&&m.animationState.animateChanges())}),b.useEffect(()=>{m&&(!k.current&&m.animationState&&m.animationState.animateChanges(),k.current&&(queueMicrotask(()=>{window.MotionHandoffMarkAsComplete?.(g)}),k.current=!1),m.enteringChildren=void 0)}),m}function Yf(e,t,n,i){const{layoutId:s,layout:r,drag:o,dragConstraints:a,layoutScroll:c,layoutRoot:l,layoutAnchor:u,layoutCrossfade:f}=t;e.projection=new n(e.latestValues,t["data-framer-portal-id"]?void 0:Al(e.parent)),e.projection.setOptions({layoutId:s,layout:r,alwaysMeasureLayout:!!o||a&&bt(a),visualElement:e,animationType:typeof r=="string"?r:"both",initialPromotionConfig:i,crossfade:f,layoutScroll:c,layoutRoot:l,layoutAnchor:u})}function Al(e){if(e)return e.options.allowProjection!==!1?e.projection:Al(e.parent)}function li(e,{forwardMotionProps:t=!1,type:n}={},i,s){i&&Of(i);const r=n?n==="svg":Is(e),o=r?Uf:Gf;function a(l,u){let f;const d={...b.useContext(Ns),...l,layoutId:Xf(l)},{isStatic:y,isValidProp:m}=d,w=jf(l),p=o(l,y);if(!y&&typeof window<"u"){Zf();const g=Jf(d);f=g.MeasureLayout,w.visualElement=qf(e,p,d,s,g.ProjectionNode,r)}return h.jsxs(Gn.Provider,{value:w,children:[f&&w.visualElement?h.jsx(f,{visualElement:w.visualElement,...d}):null,Hf(e,l,Qf(p,w.visualElement,u),p,y,t,r,m)]})}a.displayName=`motion.${typeof e=="string"?e:`create(${e.displayName??e.name??""})`}`;const c=b.forwardRef(a);return c[Kf]=e,c}function Xf({layoutId:e}){const t=b.useContext(cs).id;return t&&e!==void 0?t+"-"+e:e}function Zf(e,t){b.useContext(xl).strict}function Jf(e){const t=vl(),{drag:n,layout:i}=t;if(!n&&!i)return{};const s={...n,...i};return{MeasureLayout:n?.isEnabled(e)||i?.isEnabled(e)?s.MeasureLayout:void 0,ProjectionNode:s.ProjectionNode}}function ep(e,t){if(typeof Proxy>"u")return li;const n=new Map,i=(r,o)=>li(r,o,e,t),s=(r,o)=>i(r,o);return new Proxy(s,{get:(r,o)=>o==="create"?i:(n.has(o)||n.set(o,li(o,void 0,e,t)),n.get(o))})}const tp=(e,t)=>t.isSVG??Is(e)?new Dd(t):new Sd(t,{allowProjection:e!==b.Fragment});class np extends et{constructor(t){super(t),t.animationState||(t.animationState=Ld(t))}updateAnimationControlsSubscription(){const{animate:t}=this.node.getProps();Wn(t)&&(this.unmountControls=t.subscribe(this.node))}mount(){this.updateAnimationControlsSubscription()}update(){const{animate:t}=this.node.getProps(),{animate:n}=this.node.prevProps||{};t!==n&&this.updateAnimationControlsSubscription()}unmount(){this.node.animationState.reset(),this.unmountControls?.()}}let ip=0;class sp extends et{constructor(){super(...arguments),this.id=ip++,this.isExitComplete=!1}update(){if(!this.node.presenceContext)return;const{isPresent:t,onExitComplete:n}=this.node.presenceContext,{isPresent:i}=this.node.prevPresenceContext||{};if(!this.node.animationState||t===i)return;if(t&&i===!1){if(this.isExitComplete){const{initial:r,custom:o}=this.node.getProps();if(typeof r=="string"||typeof r=="object"&&r!==null&&!Array.isArray(r)){const a=lt(this.node,r,o);if(a){const{transition:c,transitionEnd:l,...u}=a;for(const f in u)this.node.getValue(f)?.jump(u[f])}}this.node.animationState.reset(),this.node.animationState.animateChanges()}else this.node.animationState.setActive("exit",!1);this.isExitComplete=!1;return}const s=this.node.animationState.setActive("exit",!t);n&&!t&&s.then(()=>{this.isExitComplete=!0,n(this.id)})}mount(){const{register:t,onExitComplete:n}=this.node.presenceContext||{};n&&n(this.id),t&&(this.unmount=t(this.id))}unmount(){}}const op={animation:{Feature:np},exit:{Feature:sp}};function Qt(e){return{point:{x:e.pageX,y:e.pageY}}}const rp=e=>t=>Ds(t)&&e(t,Qt(t));function Vt(e,t,n,i){return Wt(e,t,rp(n),i)}const Pl=({current:e})=>e?e.ownerDocument.defaultView:null,or=(e,t)=>Math.abs(e-t);function ap(e,t){const n=or(e.x,t.x),i=or(e.y,t.y);return Math.sqrt(n**2+i**2)}const rr=new Set(["auto","scroll"]);class El{constructor(t,n,{transformPagePoint:i,contextWindow:s=window,dragSnapToOrigin:r=!1,distanceThreshold:o=3,element:a}={}){if(this.startEvent=null,this.lastMoveEvent=null,this.lastMoveEventInfo=null,this.lastRawMoveEventInfo=null,this.handlers={},this.contextWindow=window,this.scrollPositions=new Map,this.removeScrollListeners=null,this.onElementScroll=m=>{this.handleScroll(m.target)},this.onWindowScroll=()=>{this.handleScroll(window)},this.updatePoint=()=>{if(!(this.lastMoveEvent&&this.lastMoveEventInfo))return;this.lastRawMoveEventInfo&&(this.lastMoveEventInfo=on(this.lastRawMoveEventInfo,this.transformPagePoint));const m=ci(this.lastMoveEventInfo,this.history),w=this.startEvent!==null,p=ap(m.offset,{x:0,y:0})>=this.distanceThreshold;if(!w&&!p)return;const{point:g}=m,{timestamp:k}=ge;this.history.push({...g,timestamp:k});const{onStart:v,onMove:x}=this.handlers;w||(v&&v(this.lastMoveEvent,m),this.startEvent=this.lastMoveEvent),x&&x(this.lastMoveEvent,m)},this.handlePointerMove=(m,w)=>{this.lastMoveEvent=m,this.lastRawMoveEventInfo=w,this.lastMoveEventInfo=on(w,this.transformPagePoint),te.update(this.updatePoint,!0)},this.handlePointerUp=(m,w)=>{this.end();const{onEnd:p,onSessionEnd:g,resumeAnimation:k}=this.handlers;if((this.dragSnapToOrigin||!this.startEvent)&&k&&k(),!(this.lastMoveEvent&&this.lastMoveEventInfo))return;const v=ci(m.type==="pointercancel"?this.lastMoveEventInfo:on(w,this.transformPagePoint),this.history);this.startEvent&&p&&p(m,v),g&&g(m,v)},!Ds(t))return;this.dragSnapToOrigin=r,this.handlers=n,this.transformPagePoint=i,this.distanceThreshold=o,this.contextWindow=s||window;const c=Qt(t),l=on(c,this.transformPagePoint),{point:u}=l,{timestamp:f}=ge;this.history=[{...u,timestamp:f}];const{onSessionStart:d}=n;d&&d(t,ci(l,this.history));const y={passive:!0,capture:!0};this.removeListeners=Gt(Vt(this.contextWindow,"pointermove",this.handlePointerMove,y),Vt(this.contextWindow,"pointerup",this.handlePointerUp,y),Vt(this.contextWindow,"pointercancel",this.handlePointerUp,y)),a&&this.startScrollTracking(a)}startScrollTracking(t){let n=t.parentElement;for(;n;){const i=getComputedStyle(n);(rr.has(i.overflowX)||rr.has(i.overflowY))&&this.scrollPositions.set(n,{x:n.scrollLeft,y:n.scrollTop}),n=n.parentElement}this.scrollPositions.set(window,{x:window.scrollX,y:window.scrollY}),window.addEventListener("scroll",this.onElementScroll,{capture:!0}),window.addEventListener("scroll",this.onWindowScroll),this.removeScrollListeners=()=>{window.removeEventListener("scroll",this.onElementScroll,{capture:!0}),window.removeEventListener("scroll",this.onWindowScroll)}}handleScroll(t){const n=this.scrollPositions.get(t);if(!n)return;const i=t===window,s=i?{x:window.scrollX,y:window.scrollY}:{x:t.scrollLeft,y:t.scrollTop},r={x:s.x-n.x,y:s.y-n.y};r.x===0&&r.y===0||(i?this.lastMoveEventInfo&&(this.lastMoveEventInfo.point.x+=r.x,this.lastMoveEventInfo.point.y+=r.y):this.history.length>0&&(this.history[0].x-=r.x,this.history[0].y-=r.y),this.scrollPositions.set(t,s),te.update(this.updatePoint,!0))}updateHandlers(t){this.handlers=t}end(){this.removeListeners&&this.removeListeners(),this.removeScrollListeners&&this.removeScrollListeners(),this.scrollPositions.clear(),Je(this.updatePoint)}}function on(e,t){return t?{point:t(e.point)}:e}function ar(e,t){return{x:e.x-t.x,y:e.y-t.y}}function ci({point:e},t){return{point:e,delta:ar(e,Dl(t)),offset:ar(e,lp(t)),velocity:cp(t,.1)}}function lp(e){return e[0]}function Dl(e){return e[e.length-1]}function cp(e,t){if(e.length<2)return{x:0,y:0};let n=e.length-1,i=null;const s=Dl(e);for(;n>=0&&(i=e[n],!(s.timestamp-i.timestamp>je(t)));)n--;if(!i)return{x:0,y:0};i===e[0]&&e.length>2&&s.timestamp-i.timestamp>je(t)*2&&(i=e[1]);const r=Oe(s.timestamp-i.timestamp);if(r===0)return{x:0,y:0};const o={x:(s.x-i.x)/r,y:(s.y-i.y)/r};return o.x===1/0&&(o.x=0),o.y===1/0&&(o.y=0),o}function up(e,{min:t,max:n},i){return t!==void 0&&e<t?e=i?ee(t,e,i.min):Math.max(e,t):n!==void 0&&e>n&&(e=i?ee(n,e,i.max):Math.min(e,n)),e}function lr(e,t,n){return{min:t!==void 0?e.min+t:void 0,max:n!==void 0?e.max+n-(e.max-e.min):void 0}}function hp(e,{top:t,left:n,bottom:i,right:s}){return{x:lr(e.x,n,s),y:lr(e.y,t,i)}}function cr(e,t){let n=t.min-e.min,i=t.max-e.max;return t.max-t.min<e.max-e.min&&([n,i]=[i,n]),{min:n,max:i}}function dp(e,t){return{x:cr(e.x,t.x),y:cr(e.y,t.y)}}function fp(e,t){let n=.5;const i=Te(e),s=Te(t);return s>i?n=Ft(t.min,t.max-i,e.min):i>s&&(n=Ft(e.min,e.max-s,t.min)),Ge(0,1,n)}function pp(e,t){const n={};return t.min!==void 0&&(n.min=t.min-e.min),t.max!==void 0&&(n.max=t.max-e.min),n}const es=.35;function mp(e=es){return e===!1?e=0:e===!0&&(e=es),{x:ur(e,"left","right"),y:ur(e,"top","bottom")}}function ur(e,t,n){return{min:hr(e,t),max:hr(e,n)}}function hr(e,t){return typeof e=="number"?e:e[t]||0}const gp=new WeakMap;class yp{constructor(t){this.openDragLock=null,this.isDragging=!1,this.currentDirection=null,this.originPoint={x:0,y:0},this.constraints=!1,this.hasMutatedConstraints=!1,this.elastic=he(),this.latestPointerEvent=null,this.latestPanInfo=null,this.visualElement=t}start(t,{snapToCursor:n=!1,distanceThreshold:i}={}){const{presenceContext:s}=this.visualElement;if(s&&s.isPresent===!1)return;const r=f=>{n&&this.snapToCursor(Qt(f).point),this.stopAnimation()},o=(f,d)=>{const{drag:y,dragPropagation:m,onDragStart:w}=this.getProps();if(y&&!m&&(this.openDragLock&&this.openDragLock(),this.openDragLock=Wh(y),!this.openDragLock))return;this.latestPointerEvent=f,this.latestPanInfo=d,this.isDragging=!0,this.currentDirection=null,this.resolveConstraints(),this.visualElement.projection&&(this.visualElement.projection.isAnimationBlocked=!0,this.visualElement.projection.target=void 0),Fe(g=>{let k=this.getAxisMotionValue(g).get()||0;if(ze.test(k)){const{projection:v}=this.visualElement;if(v&&v.layout){const x=v.layout.layoutBox[g];x&&(k=Te(x)*(parseFloat(k)/100))}}this.originPoint[g]=k}),w&&te.update(()=>w(f,d),!1,!0),zi(this.visualElement,"transform");const{animationState:p}=this.visualElement;p&&p.setActive("whileDrag",!0)},a=(f,d)=>{this.latestPointerEvent=f,this.latestPanInfo=d;const{dragPropagation:y,dragDirectionLock:m,onDirectionLock:w,onDrag:p}=this.getProps();if(!y&&!this.openDragLock)return;const{offset:g}=d;if(m&&this.currentDirection===null){this.currentDirection=wp(g),this.currentDirection!==null&&w&&w(this.currentDirection);return}this.updateAxis("x",d.point,g),this.updateAxis("y",d.point,g),this.visualElement.render(),p&&te.update(()=>p(f,d),!1,!0)},c=(f,d)=>{this.latestPointerEvent=f,this.latestPanInfo=d,this.stop(f,d),this.latestPointerEvent=null,this.latestPanInfo=null},l=()=>{const{dragSnapToOrigin:f}=this.getProps();(f||this.constraints)&&this.startAnimation({x:0,y:0})},{dragSnapToOrigin:u}=this.getProps();this.panSession=new El(t,{onSessionStart:r,onStart:o,onMove:a,onSessionEnd:c,resumeAnimation:l},{transformPagePoint:this.visualElement.getTransformPagePoint(),dragSnapToOrigin:u,distanceThreshold:i,contextWindow:Pl(this.visualElement),element:this.visualElement.current})}stop(t,n){const i=t||this.latestPointerEvent,s=n||this.latestPanInfo,r=this.isDragging;if(this.cancel(),!r||!s||!i)return;const{velocity:o}=s;this.startAnimation(o);const{onDragEnd:a}=this.getProps();a&&te.postRender(()=>a(i,s))}cancel(){this.isDragging=!1;const{projection:t,animationState:n}=this.visualElement;t&&(t.isAnimationBlocked=!1),this.endPanSession();const{dragPropagation:i}=this.getProps();!i&&this.openDragLock&&(this.openDragLock(),this.openDragLock=null),n&&n.setActive("whileDrag",!1)}endPanSession(){this.panSession&&this.panSession.end(),this.panSession=void 0}updateAxis(t,n,i){const{drag:s}=this.getProps();if(!i||!rn(t,s,this.currentDirection))return;const r=this.getAxisMotionValue(t);let o=this.originPoint[t]+i[t];this.constraints&&this.constraints[t]&&(o=up(o,this.constraints[t],this.elastic[t])),r.set(o)}resolveConstraints(){const{dragConstraints:t,dragElastic:n}=this.getProps(),i=this.visualElement.projection&&!this.visualElement.projection.layout?this.visualElement.projection.measure(!1):this.visualElement.projection?.layout,s=this.constraints;t&&bt(t)?this.constraints||(this.constraints=this.resolveRefConstraints()):t&&i?this.constraints=hp(i.layoutBox,t):this.constraints=!1,this.elastic=mp(n),s!==this.constraints&&!bt(t)&&i&&this.constraints&&!this.hasMutatedConstraints&&Fe(r=>{this.constraints!==!1&&this.getAxisMotionValue(r)&&(this.constraints[r]=pp(i.layoutBox[r],this.constraints[r]))})}resolveRefConstraints(){const{dragConstraints:t,onMeasureDragConstraints:n}=this.getProps();if(!t||!bt(t))return!1;const i=t.current,{projection:s}=this.visualElement;if(!s||!s.layout)return!1;s.root&&(s.root.scroll=void 0,s.root.updateScroll());const r=bd(i,s.root,this.visualElement.getTransformPagePoint());let o=dp(s.layout.layoutBox,r);if(n){const a=n(md(o));this.hasMutatedConstraints=!!a,a&&(o=Xa(a))}return o}startAnimation(t){const{drag:n,dragMomentum:i,dragElastic:s,dragTransition:r,dragSnapToOrigin:o,onDragTransitionEnd:a}=this.getProps(),c=this.constraints||{},l=Fe(u=>{if(!rn(u,n,this.currentDirection))return;let f=c&&c[u]||{};(o===!0||o===u)&&(f={min:0,max:0});const d=s?200:1e6,y=s?40:1e7,m={type:"inertia",velocity:i?t[u]:0,bounceStiffness:d,bounceDamping:y,timeConstant:750,restDelta:1,restSpeed:10,...r,...f};return this.startAxisValueAnimation(u,m)});return Promise.all(l).then(a)}startAxisValueAnimation(t,n){const i=this.getAxisMotionValue(t);return zi(this.visualElement,t),i.start(Ss(t,i,0,n,this.visualElement,!1))}stopAnimation(){Fe(t=>this.getAxisMotionValue(t).stop())}getAxisMotionValue(t){const n=`_drag${t.toUpperCase()}`,s=this.visualElement.getProps()[n];return s||this.visualElement.getValue(t,this.visualElement.latestValues[t]??0)}snapToCursor(t){Fe(n=>{const{drag:i}=this.getProps();if(!rn(n,i,this.currentDirection))return;const{projection:s}=this.visualElement,r=this.getAxisMotionValue(n);if(s&&s.layout){const{min:o,max:a}=s.layout.layoutBox[n],c=r.get()||0;r.set(t[n]-ee(o,a,.5)+c)}})}scalePositionWithinConstraints(){if(!this.visualElement.current)return;const{drag:t,dragConstraints:n}=this.getProps(),{projection:i}=this.visualElement;if(!bt(n)||!i||!this.constraints)return;this.stopAnimation();const s={x:0,y:0};Fe(o=>{const a=this.getAxisMotionValue(o);if(a&&this.constraints!==!1){const c=a.get();s[o]=fp({min:c,max:c},this.constraints[o])}});const{transformTemplate:r}=this.visualElement.getProps();this.visualElement.current.style.transform=r?r({},""):"none",i.root&&i.root.updateScroll(),i.updateLayout(),this.constraints=!1,this.resolveConstraints(),Fe(o=>{if(!rn(o,t,null))return;const a=this.getAxisMotionValue(o),{min:c,max:l}=this.constraints[o];a.set(ee(c,l,s[o]))}),this.visualElement.render()}addListeners(){if(!this.visualElement.current)return;gp.set(this.visualElement,this);const t=this.visualElement.current,n=Vt(t,"pointerdown",l=>{const{drag:u,dragListener:f=!0}=this.getProps(),d=l.target,y=d!==t&&qh(d);u&&f&&!y&&this.start(l)});let i;const s=()=>{const{dragConstraints:l}=this.getProps();bt(l)&&l.current&&(this.constraints=this.resolveRefConstraints(),i||(i=bp(t,l.current,()=>this.scalePositionWithinConstraints())))},{projection:r}=this.visualElement,o=r.addEventListener("measure",s);r&&!r.layout&&(r.root&&r.root.updateScroll(),r.updateLayout()),te.read(s);const a=Wt(window,"resize",()=>this.scalePositionWithinConstraints()),c=r.addEventListener("didUpdate",(({delta:l,hasLayoutChanged:u})=>{this.isDragging&&u&&(Fe(f=>{const d=this.getAxisMotionValue(f);d&&(this.originPoint[f]+=l[f].translate,d.set(d.get()+l[f].translate))}),this.visualElement.render())}));return()=>{a(),n(),o(),c&&c(),i&&i()}}getProps(){const t=this.visualElement.getProps(),{drag:n=!1,dragDirectionLock:i=!1,dragPropagation:s=!1,dragConstraints:r=!1,dragElastic:o=es,dragMomentum:a=!0}=t;return{...t,drag:n,dragDirectionLock:i,dragPropagation:s,dragConstraints:r,dragElastic:o,dragMomentum:a}}}function dr(e){let t=!0;return()=>{if(t){t=!1;return}e()}}function bp(e,t,n){const i=wo(e,dr(n)),s=wo(t,dr(n));return()=>{i(),s()}}function rn(e,t,n){return(t===!0||t===e)&&(n===null||n===e)}function wp(e,t=10){let n=null;return Math.abs(e.y)>t?n="y":Math.abs(e.x)>t&&(n="x"),n}class xp extends et{constructor(t){super(t),this.removeGroupControls=Re,this.removeListeners=Re,this.controls=new yp(t)}mount(){const{dragControls:t}=this.node.getProps();t&&(this.removeGroupControls=t.subscribe(this.controls)),this.removeListeners=this.controls.addListeners()||Re}update(){const{dragControls:t}=this.node.getProps(),{dragControls:n}=this.node.prevProps||{};t!==n&&(this.removeGroupControls(),t&&(this.removeGroupControls=t.subscribe(this.controls)))}unmount(){this.removeGroupControls(),this.removeListeners(),this.controls.isDragging||this.controls.endPanSession()}}const ui=e=>(t,n)=>{e&&te.update(()=>e(t,n),!1,!0)};class vp extends et{constructor(){super(...arguments),this.removePointerDownListener=Re}onPointerDown(t){this.session=new El(t,this.createPanHandlers(),{transformPagePoint:this.node.getTransformPagePoint(),contextWindow:Pl(this.node)})}createPanHandlers(){const{onPanSessionStart:t,onPanStart:n,onPan:i,onPanEnd:s}=this.node.getProps();return{onSessionStart:ui(t),onStart:ui(n),onMove:ui(i),onEnd:(r,o)=>{delete this.session,s&&te.postRender(()=>s(r,o))}}}mount(){this.removePointerDownListener=Vt(this.node.current,"pointerdown",t=>this.onPointerDown(t))}update(){this.session&&this.session.updateHandlers(this.createPanHandlers())}unmount(){this.removePointerDownListener(),this.session&&this.session.end()}}let hi=!1;class kp extends b.Component{componentDidMount(){const{visualElement:t,layoutGroup:n,switchLayoutGroup:i,layoutId:s}=this.props,{projection:r}=t;r&&(n.group&&n.group.add(r),i&&i.register&&s&&i.register(r),hi&&r.root.didUpdate(),r.addEventListener("animationComplete",()=>{this.safeToRemove()}),r.setOptions({...r.options,layoutDependency:this.props.layoutDependency,onExitComplete:()=>this.safeToRemove()})),Cn.hasEverUpdated=!0}getSnapshotBeforeUpdate(t){const{layoutDependency:n,visualElement:i,drag:s,isPresent:r}=this.props,{projection:o}=i;return o&&(o.isPresent=r,t.layoutDependency!==n&&o.setOptions({...o.options,layoutDependency:n}),hi=!0,s||t.layoutDependency!==n||n===void 0||t.isPresent!==r?o.willUpdate():this.safeToRemove(),t.isPresent!==r&&(r?o.promote():o.relegate()||te.postRender(()=>{const a=o.getStack();(!a||!a.members.length)&&this.safeToRemove()}))),null}componentDidUpdate(){const{visualElement:t,layoutAnchor:n}=this.props,{projection:i}=t;i&&(i.options.layoutAnchor=n,i.root.didUpdate(),Es.postRender(()=>{!i.currentAnimation&&i.isLead()&&this.safeToRemove()}))}componentWillUnmount(){const{visualElement:t,layoutGroup:n,switchLayoutGroup:i}=this.props,{projection:s}=t;hi=!0,s&&(s.scheduleCheckAfterUnmount(),n&&n.group&&n.group.remove(s),i&&i.deregister&&i.deregister(s))}safeToRemove(){const{safeToRemove:t}=this.props;t&&t()}render(){return null}}function Ml(e){const[t,n]=wl(),i=b.useContext(cs);return h.jsx(kp,{...e,layoutGroup:i,switchLayoutGroup:b.useContext(Cl),isPresent:t,safeToRemove:n})}const Tp={pan:{Feature:vp},drag:{Feature:xp,ProjectionNode:bl,MeasureLayout:Ml}};function fr(e,t,n){const{props:i}=e;e.animationState&&i.whileHover&&e.animationState.setActive("whileHover",n==="Start");const s="onHover"+n,r=i[s];r&&te.postRender(()=>r(t,Qt(t)))}class Sp extends et{mount(){const{current:t}=this.node;t&&(this.unmount=Gh(t,(n,i)=>(fr(this.node,i,"Start"),s=>fr(this.node,s,"End"))))}unmount(){}}class Cp extends et{constructor(){super(...arguments),this.isActive=!1}onFocus(){let t=!1;try{t=this.node.current.matches(":focus-visible")}catch{t=!0}!t||!this.node.animationState||(this.node.animationState.setActive("whileFocus",!0),this.isActive=!0)}onBlur(){!this.isActive||!this.node.animationState||(this.node.animationState.setActive("whileFocus",!1),this.isActive=!1)}mount(){this.unmount=Gt(Wt(this.node.current,"focus",()=>this.onFocus()),Wt(this.node.current,"blur",()=>this.onBlur()))}unmount(){}}function pr(e,t,n){const{props:i}=e;if(e.current instanceof HTMLButtonElement&&e.current.disabled)return;e.animationState&&i.whileTap&&e.animationState.setActive("whileTap",n==="Start");const s="onTap"+(n==="End"?"":n),r=i[s];r&&te.postRender(()=>r(t,Qt(t)))}class Ap extends et{mount(){const{current:t}=this.node;if(!t)return;const{globalTapTarget:n,propagate:i}=this.node.props;this.unmount=Xh(t,(s,r)=>(pr(this.node,r,"Start"),(o,{success:a})=>pr(this.node,o,a?"End":"Cancel")),{useGlobalTarget:n,stopPropagation:i?.tap===!1})}unmount(){}}const ts=new WeakMap,di=new WeakMap,Pp=e=>{const t=ts.get(e.target);t&&t(e)},Ep=e=>{e.forEach(Pp)};function Dp({root:e,...t}){const n=e||document;di.has(n)||di.set(n,{});const i=di.get(n),s=JSON.stringify(t);return i[s]||(i[s]=new IntersectionObserver(Ep,{root:e,...t})),i[s]}function Mp(e,t,n){const i=Dp(t);return ts.set(e,n),i.observe(e),()=>{ts.delete(e),i.unobserve(e)}}const Op={some:0,all:1};class Rp extends et{constructor(){super(...arguments),this.hasEnteredView=!1,this.isInView=!1}startObserver(){this.stopObserver?.();const{viewport:t={}}=this.node.getProps(),{root:n,margin:i,amount:s="some",once:r}=t,o={root:n?n.current:void 0,rootMargin:i,threshold:typeof s=="number"?s:Op[s]},a=c=>{const{isIntersecting:l}=c;if(this.isInView===l||(this.isInView=l,r&&!l&&this.hasEnteredView))return;l&&(this.hasEnteredView=!0),this.node.animationState&&this.node.animationState.setActive("whileInView",l);const{onViewportEnter:u,onViewportLeave:f}=this.node.getProps(),d=l?u:f;d&&d(c)};this.stopObserver=Mp(this.node.current,o,a)}mount(){this.startObserver()}update(){if(typeof IntersectionObserver>"u")return;const{props:t,prevProps:n}=this.node;["amount","margin","root"].some(jp(t,n))&&this.startObserver()}unmount(){this.stopObserver?.(),this.hasEnteredView=!1,this.isInView=!1}}function jp({viewport:e={}},{viewport:t={}}={}){return n=>e[n]!==t[n]}const Lp={inView:{Feature:Rp},tap:{Feature:Ap},focus:{Feature:Cp},hover:{Feature:Sp}},Np={layout:{ProjectionNode:bl,MeasureLayout:Ml}},Vp={...op,...Lp,...Tp,...Np},Ip=ep(Vp,tp),Bp=Ip,ie={head:{len:18,span:12},secondaryScale:.85,gap:0,stroke:{own:1.4,ownHover:2.6,refFactor:.75},dash:"5 4",kinds:{"own-fwd":Ys["own-fwd"],"own-bkwd":Ys["own-bkwd"],association:{color:Ke.association,heads:"both",headDirection:"forward",dashed:!0,secondary:!0,label:"A and B are associated"}}};function $p(e){return e==="forward"?"M0,0 L10,3.5 L0,7 Z":"M10,0 L0,3.5 L10,7 Z"}function An(e,t=1){const{len:n,span:i}=ie.head;return{viewBox:"0 0 10 7",refX:0,refY:3.5,markerWidth:n*t,markerHeight:i*t,markerUnits:"userSpaceOnUse",orient:"auto-start-reverse",d:$p(e)}}function mr(e){const t=ie.kinds[e].secondary?ie.secondaryScale:1;return ie.head.len*t+ie.gap}function an(e){throw new Error('Could not dynamically require "'+e+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var fi={exports:{}},gr;function Fp(){return gr||(gr=1,(function(e,t){(function(n){e.exports=n()})(function(){return(function(){function n(i,s,r){function o(l,u){if(!s[l]){if(!i[l]){var f=typeof an=="function"&&an;if(!u&&f)return f(l,!0);if(a)return a(l,!0);var d=new Error("Cannot find module '"+l+"'");throw d.code="MODULE_NOT_FOUND",d}var y=s[l]={exports:{}};i[l][0].call(y.exports,function(m){var w=i[l][1][m];return o(w||m)},y,y.exports,n,i,s,r)}return s[l].exports}for(var a=typeof an=="function"&&an,c=0;c<r.length;c++)o(r[c]);return o}return n})()({1:[function(n,i,s){Object.defineProperty(s,"__esModule",{value:!0}),s.default=void 0;function r(d){"@babel/helpers - typeof";return r=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(y){return typeof y}:function(y){return y&&typeof Symbol=="function"&&y.constructor===Symbol&&y!==Symbol.prototype?"symbol":typeof y},r(d)}function o(d,y){if(!(d instanceof y))throw new TypeError("Cannot call a class as a function")}function a(d,y){for(var m=0;m<y.length;m++){var w=y[m];w.enumerable=w.enumerable||!1,w.configurable=!0,"value"in w&&(w.writable=!0),Object.defineProperty(d,l(w.key),w)}}function c(d,y,m){return y&&a(d.prototype,y),Object.defineProperty(d,"prototype",{writable:!1}),d}function l(d){var y=u(d,"string");return r(y)=="symbol"?y:y+""}function u(d,y){if(r(d)!="object"||!d)return d;var m=d[Symbol.toPrimitive];if(m!==void 0){var w=m.call(d,y);if(r(w)!="object")return w;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(d)}s.default=(function(){function d(){var y=this,m=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},w=m.defaultLayoutOptions,p=w===void 0?{}:w,g=m.algorithms,k=g===void 0?["layered","stress","mrtree","radial","force","disco","sporeOverlap","sporeCompaction","rectpacking"]:g,v=m.workerFactory,x=m.workerUrl;if(o(this,d),this.defaultLayoutOptions=p,this.initialized=!1,typeof x>"u"&&typeof v>"u")throw new Error("Cannot construct an ELK without both 'workerUrl' and 'workerFactory'.");var C=v;typeof x<"u"&&typeof v>"u"&&(C=function(P){return new Worker(P)});var D=C(x);if(typeof D.postMessage!="function")throw new TypeError("Created worker does not provide the required 'postMessage' function.");this.worker=new f(D),this.worker.postMessage({cmd:"register",algorithms:k}).then(function(T){return y.initialized=!0}).catch(console.err)}return c(d,[{key:"layout",value:function(m){var w=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},p=w.layoutOptions,g=p===void 0?this.defaultLayoutOptions:p,k=w.logging,v=k===void 0?!1:k,x=w.measureExecutionTime,C=x===void 0?!1:x;return m?this.worker.postMessage({cmd:"layout",graph:m,layoutOptions:g,options:{logging:v,measureExecutionTime:C}}):Promise.reject(new Error("Missing mandatory parameter 'graph'."))}},{key:"knownLayoutAlgorithms",value:function(){return this.worker.postMessage({cmd:"algorithms"})}},{key:"knownLayoutOptions",value:function(){return this.worker.postMessage({cmd:"options"})}},{key:"knownLayoutCategories",value:function(){return this.worker.postMessage({cmd:"categories"})}},{key:"terminateWorker",value:function(){this.worker&&this.worker.terminate()}}])})();var f=(function(){function d(y){var m=this;if(o(this,d),y===void 0)throw new Error("Missing mandatory parameter 'worker'.");this.resolvers={},this.worker=y,this.worker.onmessage=function(w){setTimeout(function(){m.receive(m,w)},0)}}return c(d,[{key:"postMessage",value:function(m){var w=this.id||0;this.id=w+1,m.id=w;var p=this;return new Promise(function(g,k){p.resolvers[w]=function(v,x){v?(p.convertGwtStyleError(v),k(v)):g(x)},p.worker.postMessage(m)})}},{key:"receive",value:function(m,w){var p=w.data,g=m.resolvers[p.id];g&&(delete m.resolvers[p.id],p.error?g(p.error):g(null,p.data))}},{key:"terminate",value:function(){this.worker&&this.worker.terminate()}},{key:"convertGwtStyleError",value:function(m){if(m){var w=m.__java$exception;w&&(w.cause&&w.cause.backingJsObject&&(m.cause=w.cause.backingJsObject,this.convertGwtStyleError(m.cause)),delete m.__java$exception)}}}])})()},{}],2:[function(n,i,s){var r=n("./elk-api.js").default;Object.defineProperty(i.exports,"__esModule",{value:!0}),i.exports=r,r.default=r},{"./elk-api.js":1}]},{},[2])(2)})})(fi)),fi.exports}var _p=Fp();const Hp=fc(_p),Wp="/dynamic-model-var-docs/assets/elk-worker.min-r_yRvuMO.js";class zp{elk=null;ensure(){return this.elk||(this.elk=new Hp({workerUrl:Wp})),this.elk}async layout(t,n={}){const{direction:i="DOWN",nodeSpacing:s=32,layerSpacing:r=56,usePartitions:o=!1,extraLayoutOptions:a={}}=n,c={id:"root",layoutOptions:{"elk.algorithm":"layered","elk.direction":i,"elk.spacing.nodeNode":String(s),"elk.layered.spacing.nodeNodeBetweenLayers":String(r),"elk.edgeRouting":"ORTHOGONAL","elk.layered.considerModelOrder.strategy":"NODES_AND_EDGES",...o?{"elk.partitioning.activate":"true"}:{},...a},children:t.nodes.map(p=>({id:p.id,width:p.width,height:p.height,...p.ports?.length?{ports:p.ports.map(g=>({id:g.id,x:g.x,y:g.y,width:0,height:0}))}:{},...o&&p.partition!==void 0||p.ports?.length?{layoutOptions:{...o&&p.partition!==void 0?{"elk.partitioning.partition":String(p.partition)}:{},...p.ports?.length?{"elk.portConstraints":"FIXED_POS"}:{}}}:{}})),edges:t.edges.filter(p=>p.source!==p.target).map(p=>({id:p.id,sources:[p.sourcePort??p.source],targets:[p.targetPort??p.target]}))},l=new Map(t.edges.map(p=>[p.id,p]));this.elk;const u=performance.now(),f=await this.ensure().layout(c);performance.now()-u,t.nodes.length,t.edges.length;const d=(f.children??[]).map(p=>({id:p.id,x:p.x??0,y:p.y??0,width:p.width??0,height:p.height??0})),y=(f.edges??[]).map(p=>{const g=l.get(p.id);if(!g)throw new Error(`ELK returned unknown edge id: ${p.id}`);return{id:p.id,source:g.source,target:g.target,sections:p.sections}}),m=Math.max(0,...d.map(p=>p.x+p.width)),w=Math.max(0,...d.map(p=>p.y+p.height));return{nodes:d,edges:y,width:m,height:w}}cancel(){this.elk&&(this.elk.terminateWorker(),this.elk=null)}dispose(){this.cancel()}}function ln(e){if(!e?.length)return[];const t=e[0];return[t.startPoint,...t.bendPoints??[],t.endPoint]}function yr(e,t,n){const i=t.x-e.x,s=t.y-e.y,r=Math.hypot(i,s);if(r<1e-6)return{...e};const o=Math.min(n,r/2)/r;return{x:e.x+i*o,y:e.y+s*o}}function Gp(e,t){if(e.length<2)return Up(e);let n=`M${e[0].x},${e[0].y}`;for(let s=1;s<e.length-1;s++){const r=yr(e[s],e[s-1],t),o=yr(e[s],e[s+1],t);n+=`L${r.x},${r.y}Q${e[s].x},${e[s].y} ${o.x},${o.y}`}const i=e[e.length-1];return`${n}L${i.x},${i.y}`}function Up(e){return e.length?e.map((t,n)=>`${n===0?"M":"L"}${t.x},${t.y}`).join(""):""}function Kp(e,t){let n=0,i=e.length-1,s=e[e.length-1];for(let r=e.length-1;r>0;r--){const o=Math.hypot(e[r].x-e[r-1].x,e[r].y-e[r-1].y);if(n+o>=t){const a=(t-n)/o;s={x:e[r].x+(e[r-1].x-e[r].x)*a,y:e[r].y+(e[r-1].y-e[r].y)*a},i=r-1;break}n+=o,i=r-1}return{cut:i,cutPoint:s}}function Qp(e,t,n,i){if(e.length<2||n<=0)return i(e);const{cut:s,cutPoint:r}=Kp(e,n),o=e.slice(0,s+1),a=o[o.length-1],c=a&&Math.abs(a.x-r.x)<1e-6&&Math.abs(a.y-r.y)<1e-6;return i([...o,...c?[]:[r],t])}function qp(e,t=1.5){if(e.length<3)return e;const n=[e[0]];for(let i=1;i<e.length-1;i++){const s=n[n.length-1],r=e[i],o=e[i+1],a=o.x-s.x,c=o.y-s.y,l=Math.hypot(a,c);(l<1e-6?Math.hypot(r.x-s.x,r.y-s.y):Math.abs(c*r.x-a*r.y+o.x*s.y-o.y*s.x)/l)>t&&n.push(r)}return n.push(e[e.length-1]),n}function Yp(e,t,n,i){const s=Math.hypot(t.x,t.y)||1,r=t.x/s,o=t.y/s,a=-o,c=r,l=n/2,u={x:e.x+a*l,y:e.y+c*l},f={x:e.x-a*l,y:e.y-c*l},d={x:e.x+r*i,y:e.y+o*i};return`M${u.x},${u.y}L${d.x},${d.y}L${f.x},${f.y}Z`}function Xp(e,t,n,i,s=16){const r={x:e.x+n.x*s,y:e.y+n.y*s},o={x:t.x+i.x*s,y:t.y+i.y*s},a=[e,r];if(Math.abs(n.x)>.5){const c=(r.x+o.x)/2;Math.abs(r.y-o.y)>.5&&a.push({x:c,y:r.y},{x:c,y:o.y})}else{const c=(r.y+o.y)/2;Math.abs(r.x-o.x)>.5&&a.push({x:r.x,y:c},{x:o.x,y:c})}return a.push(o,t),qp(a)}function Zp(e,t={}){const n=b.useRef(null);n.current||(n.current=new zp);const[i,s]=b.useState(null),[r,o]=b.useState(!1),a=JSON.stringify(t);b.useEffect(()=>{const u=n.current;if(!e||e.nodes.length===0){s(null),o(!1);return}let f=!1;return o(!0),u.layout(e,JSON.parse(a)).then(d=>{f||(s({spec:e,layout:d}),o(!1))},d=>{f||(o(!1),console.error("graph-core layout failed:",d))}),()=>{f=!0,u.cancel()}},[e,a]),b.useEffect(()=>()=>n.current?.dispose(),[]);const c=!!e&&e.nodes.length>0,l=!i||i.spec!==e;return{latest:i,inProgress:(r||l)&&c}}const Jp=300,em=100,tm=200,nm=75,im=250,sm=120,om=200,rm=[.65,0,.35,1],cn=e=>e/1e3,am=()=>typeof window<"u"&&typeof window.matchMedia=="function"&&window.matchMedia("(prefers-reduced-motion: reduce)").matches,qt=e=>()=>am()?0:e,Ol=qt(Jp),br=qt(em),lm=qt(tm),cm=qt(nm),um=qt(im),un=()=>sm,wr=.5;function hm(e={}){const{min:t=.2,max:n=2}=e,i=b.useRef(null),s=b.useRef(null),r=b.useRef(null),o=b.useRef(1),a=b.useRef({w:0,h:0}),c=b.useRef(null),l=b.useRef(null),u=b.useRef(!0),f=b.useRef(!0),d=b.useCallback(()=>{const v=i.current;return v?{x:v.clientWidth*wr,y:v.clientHeight*wr}:{x:0,y:0}},[]),y=b.useCallback(v=>{const x=s.current;if(x){const{x:C,y:D}=d();x.style.transition=v?`width ${v}ms, height ${v}ms`:"",x.style.padding=`${D}px ${C}px`,x.style.width=`${a.current.w*o.current+2*C}px`,x.style.height=`${a.current.h*o.current+2*D}px`}},[d]),m=b.useCallback((v,x)=>{o.current=Math.min(n,Math.max(t,v));const C=x?Ol():0;c.current&&cancelAnimationFrame(c.current),c.current=requestAnimationFrame(()=>{c.current=null;const D=r.current;D&&(D.style.transition=C?`transform ${C}ms`:"",D.style.transform=`scale(${o.current})`)}),l.current&&(clearTimeout(l.current),l.current=null),C?y(C):l.current=setTimeout(()=>{l.current=null,y(0)},100)},[t,n,y]),w=b.useCallback((v,x=!0)=>{u.current=!1,m(v,x)},[m]),p=b.useCallback(v=>w(o.current*v),[w]),g=b.useCallback((v,x)=>{a.current={w:v,h:x};const C=r.current;C&&(C.style.width=`${v}px`,C.style.height=`${x}px`,C.style.transformOrigin="0 0",C.style.transform=`scale(${o.current})`),y(0)},[y]),k=b.useCallback(()=>{const v=i.current,{w:x,h:C}=a.current;if(!v||!x||!C)return;u.current=!0;const D=!f.current;f.current=!1,m(Math.min(v.clientWidth/x,v.clientHeight/C,1),D),requestAnimationFrame(()=>{const{x:T,y:P}=d();typeof v.scrollTo=="function"?v.scrollTo({left:T,top:P,behavior:D?"smooth":"auto"}):(v.scrollLeft=T,v.scrollTop=P)})},[m,d]);return b.useEffect(()=>{const v=i.current;if(!v)return;const x=C=>{!C.ctrlKey&&!C.metaKey||(C.preventDefault(),w(o.current*(1-C.deltaY*.005),!1))};return v.addEventListener("wheel",x,{passive:!1}),()=>v.removeEventListener("wheel",x)},[w]),b.useEffect(()=>{const v=i.current;if(!v)return;let x=!1,C=0,D=0,T=0,P=0,E=!1;const L=F=>F instanceof Element&&!F.closest("[data-pan-ignore]"),I=F=>{F.button!==0||!L(F.target)||(x=!0,E=!1,C=F.clientX,D=F.clientY,T=v.scrollLeft,P=v.scrollTop,v.style.cursor="grabbing")},B=F=>{if(!x)return;const S=F.clientX-C,z=F.clientY-D;!E&&Math.hypot(S,z)<3||(E||(E=!0,v.setPointerCapture(F.pointerId)),F.preventDefault(),v.scrollLeft=T-S,v.scrollTop=P-z)},O=F=>{x&&(x=!1,v.style.cursor="",v.hasPointerCapture(F.pointerId)&&v.releasePointerCapture(F.pointerId))};return v.addEventListener("pointerdown",I),v.addEventListener("pointermove",B),v.addEventListener("pointerup",O),v.addEventListener("pointercancel",O),()=>{v.removeEventListener("pointerdown",I),v.removeEventListener("pointermove",B),v.removeEventListener("pointerup",O),v.removeEventListener("pointercancel",O)}},[]),{containerRef:i,spacerRef:s,wrapperRef:r,applyZoom:w,zoomBy:p,zoomToFit:k,getZoom:()=>o.current,isAutoFit:()=>u.current,setContentSize:g}}const dm=2,fm=.5;function $n({kind:e,width:t=44,className:n}){const i=b.useId().replace(/:/g,""),s=ie.kinds[e],r=fm*(s.secondary?ie.secondaryScale:1),{d:o,...a}=An(s.headDirection,r),c=a.markerWidth,l=`es-${i}`,u=s.heads==="both"?1+c:1,f=t-1-c;return h.jsxs("svg",{width:t,height:"14",viewBox:`0 0 ${t} 14`,className:`shrink-0 ${n??""}`,"aria-hidden":!0,children:[h.jsx("defs",{children:h.jsx("marker",{id:l,...a,children:h.jsx("path",{d:o,fill:s.color})})}),h.jsx("line",{x1:u,y1:"7",x2:f,y2:"7",stroke:s.color,strokeWidth:dm,strokeDasharray:s.dashed?ie.dash:void 0,markerStart:s.heads==="both"?`url(#${l})`:void 0,markerEnd:`url(#${l})`})]})}const Rl={"owned-mine":{side:"left",kind:"own-bkwd"},"owned-theirs":{side:"left",kind:"own-fwd"},"owns-mine":{side:"right",kind:"own-fwd"},"owns-theirs":{side:"right",kind:"own-bkwd"},association:{side:"left",kind:"association"}},pm=300,ns=new Set;let It;function Bs(){It!==void 0&&(clearTimeout(It),It=void 0)}function Ot(e){Bs();for(const t of ns)t(e)}function jl(){Bs(),It=setTimeout(()=>{It=void 0,Ot(null)},pm)}function mm({label:e,rows:t,onAdd:n,onRemove:i,onInspect:s,colorOf:r,slotOrder:o,parentOf:a}){const[c,l]=b.useState(null),[u,f]=b.useState(null),d=b.useRef(null),y=b.useRef(null),m=b.useId();b.useEffect(()=>{const C=D=>{D!==m&&(l(null),f(null))};return ns.add(C),()=>{ns.delete(C)}},[m]),b.useEffect(()=>{if(!c)return;const C=T=>{T.target?.closest("[data-relation-bar]")||Ot(null)},D=T=>{T.key==="Escape"&&Ot(null)};return document.addEventListener("mousedown",C,!0),document.addEventListener("keydown",D),()=>{document.removeEventListener("mousedown",C,!0),document.removeEventListener("keydown",D)}},[c]);const w=C=>t.filter(D=>Rl[D.position].side===C),p=C=>new Set(w(C).map(D=>D.other)).size,g=p("left"),k=p("right");if(g===0&&k===0)return null;const v=(C,D)=>{const T=D?.getBoundingClientRect();T&&(Ot(m),l(C),f({x:T.left,y:T.bottom+2}))},x=(C,D,T)=>{const P=c===C;return h.jsx("button",{ref:T,"data-relation-bar":!0,"data-no-drag":!0,disabled:D===0,"aria-label":C==="left"?`${D} classes ${e} belongs to`:`${D} classes ${e} owns`,onMouseEnter:()=>D>0&&v(C,T.current),onMouseLeave:jl,onClick:E=>{E.stopPropagation(),D!==0&&(P?Ot(null):v(C,T.current))},className:`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] leading-none
                    tabular-nums transition-colors
                    ${D===0?"text-gray-300 dark:text-slate-600 cursor-default":P?"bg-sky-200 dark:bg-sky-800 text-sky-900 dark:text-sky-100":"text-sky-800 dark:text-sky-200 hover:bg-sky-100 dark:hover:bg-sky-900"}`,children:C==="left"?h.jsxs(h.Fragment,{children:[h.jsx("span",{"aria-hidden":!0,children:"←"}),D]}):h.jsxs(h.Fragment,{children:[D,h.jsx("span",{"aria-hidden":!0,children:"→"})]})})};return h.jsxs(h.Fragment,{children:[x("left",g,d),h.jsx("span",{className:`flex-1 min-w-0 text-center text-[9px] text-gray-400
                       dark:text-slate-500 truncate select-none`,children:"related"}),x("right",k,y),c&&u&&_r.createPortal(h.jsx(ym,{anchor:u,side:c,label:e,rows:w(c),onAdd:n,onRemove:i,onInspect:s,colorOf:r,slotOrder:o,parentOf:a}),document.body)]})}function gm(e){const t=b.useRef(null),[n,i]=b.useState(e);return b.useEffect(()=>{const s=t.current;if(!s)return;const r=s.getBoundingClientRect(),o=8;i({x:Math.max(o,Math.min(e.x,window.innerWidth-r.width-o)),y:Math.max(o,Math.min(e.y,window.innerHeight-r.height-o))})},[e]),{ref:t,pos:n}}function ym({anchor:e,side:t,label:n,rows:i,onAdd:s,onRemove:r,onInspect:o,colorOf:a,slotOrder:c,parentOf:l}){const{ref:u,pos:f}=gm(e),d=x=>{const C=c?.indexOf(x.slot)??-1;return C===-1?Number.MAX_SAFE_INTEGER:C},y=[...i].sort((x,C)=>d(x)-d(C)||x.other.localeCompare(C.other)||x.slot.localeCompare(C.slot)),m=new Map,w=new Set;if(l){const x=new Map(y.map(C=>[`${C.slot}|${C.other}`,C]));for(const C of y){const D=l(C.other),T=D===void 0?void 0:x.get(`${C.slot}|${D}`);if(!T||T===C)continue;w.add(C);const P=`${C.slot}|${D}`;m.set(P,[...m.get(P)??[],C])}}const p=[],g=(x,C)=>{p.push({row:x,depth:C});for(const D of m.get(`${x.slot}|${x.other}`)??[])g(D,C+1)};for(const x of y)w.has(x)||g(x,0);const k=y.every(x=>x.drawn),v=[...new Set(y.map(x=>x.other))];return h.jsxs("div",{ref:u,"data-relation-bar":!0,onMouseEnter:Bs,onMouseLeave:jl,style:{left:f.x,top:f.y},className:`fixed z-50 w-max max-w-[min(46rem,calc(100vw-2rem))] max-h-[60vh]
                 overflow-y-auto overflow-x-hidden py-1
                 rounded-md border border-gray-300 dark:border-slate-600
                 bg-white dark:bg-slate-800 shadow-xl
                 text-gray-900 dark:text-gray-100`,children:[h.jsx("div",{className:"px-3 py-1 border-b border-gray-200 dark:border-slate-700",children:h.jsxs("div",{className:"text-[11px] font-semibold",children:[h.jsx("b",{children:n})," ",t==="left"?"belongs to":"owns"," ",v.length," ",v.length===1?"entity":"distinct entities",y.length!==v.length&&h.jsxs("span",{className:"font-normal text-gray-500 dark:text-slate-400",children:[" ","through ",y.length," attributes"]})]})}),h.jsx("button",{onClick:()=>v.forEach(x=>k?r(x):s(x)),className:`block w-full text-left px-3 py-1 text-[11px]
                   text-blue-600 dark:text-blue-400
                   hover:bg-gray-100 dark:hover:bg-slate-700`,children:k?`hide all ${v.length} entities`:`add all ${v.length} entities`}),h.jsx("table",{className:"w-full text-[11px]",children:h.jsx("tbody",{children:p.map(({row:x,depth:C})=>{const D=Rl[x.position].kind,T=C>0&&h.jsx("span",{"aria-hidden":!0,className:"text-gray-400 dark:text-slate-500 select-none",style:{paddingLeft:`${(C-1)*.75}rem`},children:"↳ "}),P=x.declaredBy===x.other?n:x.declaredBy,E=t==="left"?x.other:P,L=t==="left"?P:x.other;return h.jsxs("tr",{"data-family-depth":C,className:"hover:bg-gray-100 dark:hover:bg-slate-700",children:[h.jsx("td",{className:"pl-2 pr-1 py-0.5",children:h.jsx("button",{onClick:I=>{I.stopPropagation(),(x.drawn?r:s)(x.other)},"aria-label":x.drawn?`Remove ${x.other} from the diagram`:`Add ${x.other} to the diagram`,className:`w-4 h-4 rounded-sm leading-none text-[11px]
                                flex items-center justify-center border
                                ${x.drawn?"border-sky-300 bg-sky-50 text-sky-700 hover:bg-sky-200 dark:border-sky-700 dark:bg-sky-950 dark:text-sky-300":"border-gray-300 text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:border-slate-600 dark:hover:bg-slate-600"}`,children:x.drawn?"−":"+"})}),h.jsxs("td",{className:"pl-1 pr-2 py-0.5 text-right whitespace-nowrap",children:[t==="left"&&T,h.jsx(xr,{cls:E,row:x,colorOf:a,onInspect:o})]}),h.jsx("td",{className:`px-2 py-0.5 font-mono text-gray-400 dark:text-slate-500
                               whitespace-nowrap tabular-nums text-right`,children:x.cardinality}),h.jsx("td",{className:"px-1 py-0.5 align-middle",children:h.jsx($n,{kind:D,width:30})}),h.jsxs("td",{className:"pr-3 py-0.5 whitespace-nowrap",children:[t==="right"&&T,h.jsx(xr,{cls:L,row:x,colorOf:a,onInspect:o})]})]},`${x.declaredBy}.${x.slot}->${x.other}`)})})})]})}function xr({cls:e,row:t,colorOf:n,onInspect:i}){const s=n?.(e),r=e===t.declaredBy,o=s?{color:s.text}:void 0;return h.jsxs("span",{className:"font-mono",children:[i?h.jsx("button",{onClick:a=>{a.stopPropagation(),i(e)},title:`Open ${e}'s details`,className:"hover:underline",style:o,children:e}):h.jsx("span",{style:o,children:e}),r&&h.jsxs("span",{className:s?"opacity-80":"text-gray-500 dark:text-slate-400",style:o,children:[".",t.slot]})]})}const De={sibs:!0,dir:"RIGHT",merge:"near",legend:!1,cases:!1},Ll=["legend","cases"];function bm(e,t){if(e.get("panels")!=="0")return t;for(const n of Ll)t[n]=!1;return t.detail=null,t}const Rt={dir:"explore-nl-dir",merge:"explore-nl-merge",sibs:"explore-nl-sibs"},Un="~",wm=["exp","hidden","owners"],xm=["tour"];let Bt;function vm(e=window.location.search){return Bt===void 0&&(Bt=new URLSearchParams(e).get("tour")==="1"),Bt}function km(e,t){const n=e.get(t);return n?n.split(Un).filter(Boolean):[]}function Nl(e){const t=e.get("cat");if(!t)return[];const n=t.split(new RegExp(`[,${Un}]`)).filter(Boolean);return[...new Set(n.flatMap(i=>{const s=Hr.find(r=>r.id===i);return s?Ur(s):[]}))]}function hn(e){try{return localStorage.getItem(e)}catch{return null}}function Tm(e,t){try{localStorage.setItem(e,t)}catch{}}function dn(e,t){return e&&t.includes(e)?e:null}function We(e=window.location.search){const t=new URLSearchParams(e),n=dn(t.get("dir"),["RIGHT","DOWN"])??dn(hn(Rt.dir),["RIGHT","DOWN"])??De.dir,i=dn(t.get("merge"),["near","far","bend","off"])??dn(hn(Rt.merge),["near","far","bend","off"])??De.merge,s=t.has("sibs")?t.get("sibs")==="1":hn(Rt.sibs)!==null?hn(Rt.sibs)!=="0":De.sibs,r=km(t,"sel"),o=bm(t,{legend:t.get("legend")==="1",cases:t.get("cases")==="1",detail:t.get("detail")||null});return t.has("legend")&&(o.legend=t.get("legend")==="1"),t.has("cases")&&(o.cases=t.get("cases")==="1"),t.has("detail")&&(o.detail=t.get("detail")||null),{sel:r.length?r:Nl(t),detail:o.detail,roots:t.get("roots")==="1",sibs:s,dir:n,merge:i,legend:o.legend,cases:o.cases}}function Vl(e,{push:t=!1}={}){const n=new URL(window.location.href),i=n.searchParams,s=(o,a)=>{a.length===0?i.delete(o):i.set(o,[...a].sort().join(Un))},r=(o,a,c)=>{c?i.delete(o):i.set(o,a)};for(const o of wm)i.delete(o);Bt===void 0&&i.has("tour")&&(Bt=i.get("tour")==="1");for(const o of xm)i.delete(o);s("sel",e.sel),e.detail?i.set("detail",e.detail):i.delete("detail"),r("roots","1",!e.roots),r("sibs",e.sibs?"1":"0",e.sibs===De.sibs),r("dir",e.dir,e.dir===De.dir),r("merge",e.merge,e.merge===De.merge),r("legend","1",e.legend===De.legend),r("cases","1",e.cases===De.cases),i.delete("panels"),i.delete("cat"),t?window.history.pushState(null,"",n):window.history.replaceState(null,"",n)}function vr(e,t){Tm(Rt[e],typeof t=="boolean"?t?"1":"0":String(t))}function Sm(e,t=window.location.href){const n=new URL(t),i=new URLSearchParams,s=(r,o)=>i.set(r,o);return e.sel.length&&s("sel",[...e.sel].sort().join(Un)),e.detail&&s("detail",e.detail),e.roots&&s("roots","1"),e.sibs!==De.sibs&&s("sibs",e.sibs?"1":"0"),e.dir!==De.dir&&s("dir",e.dir),e.merge!==De.merge&&s("merge",e.merge),e.legend!==De.legend&&s("legend","1"),e.cases!==De.cases&&s("cases","1"),n.search=i.toString(),n.toString()}const Ce=240,ct=30,Cm=.6,ut=20,Am=1/0,$s=22,Il=18,gt=28;function Bl(e,t,n=()=>!1){const i=new Map;for(const s of e){if(n(s.other))continue;const r=s.position,o=i.get(r)??new Map,a=o.get(s.other)??[];a.includes(s.slot)||a.push(s.slot),o.set(s.other,a),i.set(r,o)}return bc.filter(s=>i.has(s)).map(s=>{const r=[...i.get(s)].map(([o,a])=>({other:o,slots:a,drawn:t(o)})).sort((o,a)=>o.other.localeCompare(a.other));return{position:s,label:wc(s,r.length),items:r}})}function $l(e,t,n=()=>!1){const i=new Set,s=[];for(const r of e){if(n(r.other))continue;const o=`${r.declaredBy}.${r.slot}->${r.other}:${r.position}`;i.has(o)||(i.add(o),s.push({other:r.other,position:r.position,slot:r.slot,declaredBy:r.declaredBy,cardinality:r.cardinality,drawn:t(r.other)}))}return s}function ce(e){return e.storageDirection==="flipped"?e.target:e.source}function is(e){return e.anchorClass??ce(e)}function Pm(e,t,n,i,s){const r=new Map,o=new Map,a=[],c=new Set;for(const d of e.edges)d.type==="isa"?(r.set(d.target,[...r.get(d.target)??[],d.source]),o.set(d.source,(o.get(d.source)??0)+1)):d.isLoop||(a.push(d),c.add(`${ce(d)}|${d.slotName}`));const l=new Set(e.nodes.map(d=>d.id)),u=e.nodes.map(d=>{const y=new Map(n(d.id).map((O,F)=>[O.name,F])),m=(O,F)=>(y.get(O.slot)??Number.MAX_SAFE_INTEGER)-(y.get(F.slot)??Number.MAX_SAFE_INTEGER),w=d.slots.map(O=>({...O,connected:O.isLoop||c.has(`${d.id}|${O.slot}`),rangeColor:i(O.range),targetColor:s(O.range)})).sort(m),p=new Set(w.map(O=>O.slot)),g=n(d.id).filter(O=>!p.has(O.name)).map(O=>({slot:O.name,range:O.range,channel:"plain",flipped:!1,cardinality:Wr(O.required,O.multivalued),isLoop:!1,connected:!1,rangeColor:i(O.range)})),k=w.filter(O=>O.connected),v=[...w.filter(O=>!O.connected),...g].sort(m),x=[...k,...v].slice(0,Math.max(Am,k.length)),C=x.length===k.length+v.length,D=t.has(d.id)||C,T=D?[...k,...v]:x,P=C?0:k.length+v.length-x.length,E=e.hiddenOwners.get(d.id)??[],L=e.hiddenOwned.get(d.id)??[],I=Bl(d.relations,O=>l.has(O),O=>O===d.id),B=$l(d.relations,O=>l.has(O),O=>O===d.id);return{...d,isaParents:r.get(d.id)??[],subclassCount:o.get(d.id)??0,members:[],hiddenOwners:E,hiddenOwned:L,relationGroups:I,relationRows:B,...Fl(I),rows:T,allRows:[...k,...v],hiddenCount:P,expanded:D,height:_l(T.length,P,I.length>0)}}),f=new Map;for(const d of a){const y=ce(d)===d.source?d.target:d.source,m=s(y);m&&f.set(d.id,m)}return{nodes:u,edges:a,edgeColors:f}}function Fl(e){const t=new Map;for(const n of e)for(const i of n.items)t.set(i.other,(t.get(i.other)??!1)||i.drawn);return{relatedCount:t.size,shownCount:[...t.values()].filter(Boolean).length}}function _l(e,t,n){return ct+(n?$s:0)+e*ut+(t?Il:0)+(e?5:0)}function Em(e,t,n,i,s,r,o){const a=mc(e.nodes.map(g=>g.id),t,n);if(!a.size)return e;const c=new Map(e.nodes.map(g=>[g.id,g])),l=new Set(e.nodes.map(g=>g.id)),u=new Map,f=[],d=new Map;for(const[g,k]of a){const v=xc(g),x=k.map(j=>({id:j,label:c.get(j)?.label??j,color:gc(o(j))}));for(const j of x)u.set(j.id,v);const C=c.has(g);C&&u.set(g,v);const D=new Map(x.map(j=>[j.id,j])),T=new Map,P=C?[g,...k]:k;for(const j of P){const X=c.get(j);if(!X)continue;const oe=j===g;for(const re of X.allRows){const Me=i(j,re.slot),be=Me!==void 0&&Me!==j,Pe=`${oe||be?Me??g:j}|${re.slot}`,ve=T.get(Pe),Se=D.get(j),Q=oe||be?ve?.owners??[]:[...ve?.owners??[],...Se?[Se]:[]];T.set(Pe,{...ve??re,connected:(ve?.connected??!1)||re.connected,owners:Q,declaringClass:Pe.slice(0,Pe.indexOf("|"))})}}const E=new Map;for(const j of T.values())if(j.targetColor)for(const X of j.owners??[])E.has(X.id)||E.set(X.id,j.targetColor);for(const j of x){const X=E.get(j.id);X&&(j.color=X)}for(const[j,X]of T)X.targetColor&&d.set(`${v}|${j}`,X.targetColor);const L=[...T.values()],I=j=>{const X=j.owners?.length?j.owners[0].id:g;return r(X,j.slot)};L.sort((j,X)=>I(j)-I(X));const B=yc(L,x,j=>({slot:`::hdr:${j.id}`,range:"",channel:"plain",flipped:!1,cardinality:"",isLoop:!1,connected:!1,rangeColor:"",header:j})),O=j=>!u.has(j)&&!P.includes(j),F=[...new Set(P.flatMap(j=>c.get(j)?.hiddenOwners??[]))].filter(O),S=[...new Set(P.flatMap(j=>c.get(j)?.hiddenOwned??[]))].filter(O),z=Bl(P.flatMap(j=>c.get(j)?.relations??[]),j=>l.has(j),j=>!O(j)),fe=$l(P.flatMap(j=>c.get(j)?.relations??[]),j=>l.has(j),j=>!O(j)),N=c.get(k[0]),G=s(g);f.push({...N,id:v,label:g,description:G.description,abstract:G.abstract,slots:[],members:x,role:P.some(j=>c.get(j)?.role==="selected")?"selected":"context",layer:Math.min(...P.map(j=>c.get(j)?.layer??0)),isaParents:[],subclassCount:x.length,hiddenOwners:F,hiddenOwned:S,relationGroups:z,relationRows:fe,...Fl(z),rows:B,allRows:L,hiddenCount:0,expanded:!0,height:_l(B.length,0,z.length>0)})}const y=[...e.nodes.filter(g=>!u.has(g.id)),...f],m=new Set,w=e.edges.map(g=>({...g,source:u.get(g.source)??g.source,target:u.get(g.target)??g.target,entityMember:(()=>{if(g.inducedFrom!==void 0)return;const k=ce(g)===g.source?g.target:g.source;return u.has(k)?k:void 0})(),anchorClass:u.has(ce(g))?i(ce(g),g.slotName)??ce(g):ce(g)})).filter(g=>{if(!Mi(g.source)&&!Mi(g.target))return!0;const k=`${g.source}|${g.target}|${g.anchorClass}|${g.slotName}|${g.storageDirection}`;return m.has(k)?!1:(m.add(k),!0)}).filter(g=>g.source!==g.target),p=new Map(e.edgeColors);for(const g of w){const k=d.get(`${ce(g)}|${is(g)}|${g.slotName}`);k&&p.set(g.id,k)}return{nodes:y,edges:w,edgeColors:p}}function Dm({title:e}){return h.jsxs("svg",{viewBox:"0 0 16 16",width:"15",height:"15","aria-hidden":"false",className:"shrink-0",style:{color:He.entity},children:[h.jsx("title",{children:e}),h.jsx("path",{d:"M12.33 10.5 A5 5 0 1 1 12.33 5.5",fill:"none",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round"}),h.jsx("path",{d:"M13.7 7.9 L10.6 6.7 L13.7 4.2 Z",fill:"currentColor"})]})}function Hl(e){return ct+(e.relationGroups.length>0?$s:0)}function Wl(e,t,n){const i=e.rows.findIndex(s=>s.slot===t&&!s.header&&(!n||!s.declaringClass||s.declaringClass===n));if(i<0)throw new Error(`No displayed row for ${t} on ${e.id}`);return Hl(e)+i*ut+ut/2}function Mm(e,t){const n=e.rows.findIndex(i=>i.header?.id===t);if(!(n<0))return Hl(e)+n*ut+ut/2}function ss(e,t){if(e.storageDirection==="flipped"||!t.members.length)return;const n=e.entityMember;return n&&t.members.some(i=>i.id===n)?n:void 0}const Om=4,Rm=10,jm=ie.head.span,kr=ie.head.len,Lm=ie.gap,Nm=ie.secondaryScale,zl=ie.stroke.own,Gl=ie.stroke.ownHover,Vm=zl*ie.stroke.refFactor,Im=Gl*ie.stroke.refFactor;function Tr(e,t){return e?t?Ke.ownBkwd:Ke.ownFwd:Ke.association}function pi(e,t){if(e==="off"||t.length<2)return 0;if(e==="near")return 40;if(e==="far")return 120;const n=t[t.length-1],i=t[t.length-2];return Math.hypot(n.x-i.x,n.y-i.y)}function Sr(e,t){return e<2?0:Math.min(Om,t/(e-1))}function Bm(e,t){const n=new Map,i=(l,u,f,d)=>{const y=n.get(l.id)??[];return y.some(m=>m.id===u)||(y.push({id:u,x:f,y:d}),n.set(l.id,y)),u},s=new Map(e.nodes.map(l=>[l.id,l])),r=l=>{const u=s.get(ce(l)===l.source?l.target:l.source);return!!u&&ss(l,u)!==void 0},o=new Map;for(const l of e.edges){if(r(l))continue;const u=ce(l)===l.source?l.target:l.source,f=`${u}|${u===l.source?"out":"in"}`;o.set(f,(o.get(f)??0)+1)}const a=new Map,c=e.edges.map(l=>{const u=s.get(ce(l)),f=s.get(ce(l)===l.source?l.target:l.source);if(!u||!f)throw new Error(`Edge ${l.id} endpoint missing from subgraph`);const d=l.storageDirection==="flipped",y=Wl(u,l.slotName,is(l)),m=i(u,`${u.id}::row:${is(l)}|${l.slotName}`,d?0:Ce,y),w=f.id===l.source,p=`${f.id}|${w?"out":"in"}`,g=ss(l,f),k=g!==void 0?Mm(f,g):void 0;let v;if(g!==void 0&&k!==void 0)v=i(f,`${f.id}::mhdr:${w?"out":"in"}:${g}`,t==="RIGHT"?w?Ce:0:Ce/2,t==="RIGHT"?k:w?f.height:0);else{const x=o.get(p)??1,C=a.get(p)??0;a.set(p,C+1);const D=Sr(x,ct-4),T=ct/2+(C-(x-1)/2)*D;v=t==="RIGHT"?i(f,`${f.id}::hdr:${w?"out":"in"}:${C}`,w?Ce:0,T):i(f,`${f.id}::hdr:${w?"out":"in"}:${C}`,Ce/2+(C-(x-1)/2)*Sr(x,Ce/2),w?f.height:0)}return{id:l.id,source:l.source,target:l.target,sourcePort:d?v:m,targetPort:d?m:v}});return{nodes:e.nodes.map(l=>({id:l.id,width:Ce,height:l.height,partition:l.layer,ports:n.get(l.id)})),edges:c}}function $m(e,t){if(!e?.length)return e;const n=e[0],i=n.bendPoints?.length?n.bendPoints[n.bendPoints.length-1]:n.startPoint,s=n.endPoint.x-i.x,r=n.endPoint.y-i.y,o=Math.hypot(s,r);if(o<1)return e;const a=Math.min(t,o*.8)/o,c={x:n.endPoint.x-s*a,y:n.endPoint.y-r*a};return[{...n,endPoint:c},...e.slice(1)]}function Fm(e,t){if(!e?.length)return e;const n=e[0],i=n.bendPoints?.length?n.bendPoints[0]:n.endPoint,s=i.x-n.startPoint.x,r=i.y-n.startPoint.y,o=Math.hypot(s,r);if(o<1)return e;const a=Math.min(t,o*.8)/o,c={x:n.startPoint.x+s*a,y:n.startPoint.y+r*a};return[{...n,startPoint:c},...e.slice(1)]}function _m({dataService:e,selectedIds:t,onNodeClick:n,onAdd:i,onRemove:s,pathToRoot:r=!1,onTogglePathToRoot:o,direction:a,setDirection:c,mergeMode:l,setMergeMode:u}){const f=b.useId().replace(/[^a-zA-Z0-9]/g,""),d=A=>`${A}-${f}`,[y,m]=b.useState(new Set),w=b.useMemo(()=>e.getOwnershipSubgraph([...t].sort(),{pathToRoot:r}),[e,t,r]),p=b.useCallback(A=>e.getTargetColor(A),[e]),g=b.useMemo(()=>new Map(w.nodes.map(A=>[A.id,e.getClassSummary(A.id)?.slots??[]])),[e,w]),k=b.useMemo(()=>Pm(w,y,A=>g.get(A)??[],A=>e.getRangeColor(A),A=>e.getTargetColor(A)),[w,y,g,e]),v=b.useMemo(()=>new Map(w.nodes.map(A=>[A.id,e.getClassSummary(A.id)])),[e,w]),x=b.useMemo(()=>{const A=M=>v.get(M)?.parentId,R=M=>!vc.has(M),V=(M,_)=>M.range===_.range&&M.multivalued===_.multivalued;return Em(k,A,R,(M,_)=>{const W=e.getClassSummary(M)?.slots.find(ue=>ue.name===_);if(!W)return;if(!W.inheritedFrom)return M;const Z=e.getClassSummary(W.inheritedFrom)?.slots.find(ue=>ue.name===_);return Z&&V(W,Z)?W.inheritedFrom:M},M=>{const _=e.getClassSummary(M);return{description:_?.description??"",abstract:_?.isAbstract??!1}},(M,_)=>{const W=e.getClassSummary(M)?.slots.findIndex(Z=>Z.name===_)??-1;return W<0?Number.MAX_SAFE_INTEGER:W},M=>e.siblingColorIndexOf(M))},[k,v,e]),[C,D]=b.useState(new Map),[T,P]=b.useState(new Map),E=b.useMemo(()=>Bm(x,a),[x,a]),{latest:L,inProgress:I}=Zp(E,{direction:a,usePartitions:!0,nodeSpacing:28,layerSpacing:72,extraLayoutOptions:{"elk.spacing.edgeNode":"18","elk.spacing.edgeEdge":"12","elk.layered.spacing.edgeNodeBetweenLayers":"18","elk.layered.spacing.edgeEdgeBetweenLayers":"10"}}),B=L?.spec===E?L.layout:null,O=L?.layout??null,F=hm(),S=(O?.width??0)+gt*2,z=(O?.height??0)+gt*2;b.useEffect(()=>{B&&(F.setContentSize(S,z),F.isAutoFit()&&F.zoomToFit())},[B,S,z]),b.useEffect(()=>D(new Map),[B]),b.useEffect(()=>P(new Map),[B]);const[fe,N]=b.useState(!1),G=b.useRef(!0);b.useEffect(()=>{if(!B){N(!1),O||(G.current=!0);return}const A=G.current?0:um();if(G.current=!1,A===0){N(!0);return}const R=setTimeout(()=>N(!0),A);return()=>clearTimeout(R)},[B,O]);const j=b.useRef(new Map),X=b.useRef(!1),oe=b.useRef(C);oe.current=C;const re=b.useMemo(()=>{const A=new Map((O?.nodes??[]).map(V=>[V.id,V])),R=new Map(T);for(const[V,H]of C)R.set(V,H);for(const[V,{dx:H,dy:K}]of R){const Y=A.get(V);Y&&A.set(V,{...Y,x:Y.x+H,y:Y.y+K})}return j.current=A,A},[O,C,T]),[Me,be]=b.useState(!1);b.useEffect(()=>{if(!I){be(!1);return}const A=setTimeout(()=>be(!0),om);return()=>clearTimeout(A)},[I]);const Pe=b.useCallback((A,R)=>{if(R.button!==0||R.target.closest('button, a, [role="button"], [data-no-drag]'))return;R.stopPropagation();const V=R.clientX,H=R.clientY,K=F.getZoom()||1,Y=C.get(A)??{dx:0,dy:0},M=R.currentTarget;M.setPointerCapture(R.pointerId);let _=!1;const W=ue=>{const Ee=(ue.clientX-V)/K,Ve=(ue.clientY-H)/K;!_&&Math.hypot(Ee,Ve)<3||(_=!0,X.current=!0,D(tt=>new Map(tt).set(A,{dx:Y.dx+Ee,dy:Y.dy+Ve})))},Z=ue=>{if(M.releasePointerCapture(ue.pointerId),M.removeEventListener("pointermove",W),M.removeEventListener("pointerup",Z),_){const Ee=oe.current.get(A);Ee&&P(Ve=>new Map(Ve).set(A,Ee))}};M.addEventListener("pointermove",W),M.addEventListener("pointerup",Z)},[C]),ve=b.useMemo(()=>new Map(x.nodes.map(A=>[A.id,A.role])),[x]),Se=b.useMemo(()=>new Map(x.edges.map(A=>[A.id,A])),[x]),Q=b.useMemo(()=>{const A=new Map(x.nodes.map(R=>[R.id,R]));return new Set(x.edges.filter(R=>{const V=A.get(ce(R)===R.source?R.target:R.source);return!!V&&ss(R,V)!==void 0}).map(R=>R.id))},[x]),q=b.useMemo(()=>{const A=new Map;if(!B)return A;for(const R of x.edges){const V=ce(R)===R.source?R.target:R.source,H=re.get(V);if(!H||Q.has(R.id))continue;const K=V===R.source,Y=`${V}|${K?"out":"in"}`;if(A.has(Y))continue;const M=K,_=Lm+kr;A.set(Y,a==="RIGHT"?{base:{x:M?H.x+Ce+_:H.x-_,y:H.y+ct/2},dir:{x:M?-1:1,y:0}}:{base:{x:H.x+Ce/2,y:M?H.y+H.height+_:H.y-_},dir:{x:0,y:M?-1:1}})}return A},[x,re,B,a,Q]),ne=b.useMemo(()=>{const A=new Map,R=new URLSearchParams(window.location.search).has("dbg"),V=new Set([...T.keys(),...C.keys()]);if(!B||V.size===0)return A;R&&console.log(`[drag] moved: ${[...V].join(", ")}`);const H=new Map(x.nodes.map(K=>[K.id,K]));for(const K of x.edges){const Y=ce(K),M=Y===K.source?K.target:K.source;if(!V.has(Y)&&!V.has(M))continue;const _=re.get(Y),W=re.get(M),Z=H.get(Y);if(!_||!W||!Z)continue;const ue=K.storageDirection==="flipped",Ee=a==="RIGHT";let Ve;try{Ve=Wl(Z,K.slotName)}catch{R&&console.log(`   SKIP ${Y}.${K.slotName}: row not displayed`);continue}const tt=Ee?{x:_.x+(ue?0:Ce),y:_.y+Ve}:{x:_.x+Ce/2,y:_.y+Ve},qe=Ee?{x:ue?-1:1,y:0}:{x:0,y:1},mt=M===K.source,Zt=Ee?{x:mt?W.x+Ce:W.x,y:W.y+ct/2}:{x:W.x+Ce/2,y:mt?W.y+W.height:W.y},qn=Ee?{x:mt?1:-1,y:0}:{x:0,y:mt?1:-1};A.set(K.id,Xp(tt,Zt,qe,qn)),R&&console.log(`   reroute ${Y}.${K.slotName} -> ${M}`)}return R&&console.log(`[drag] rerouted ${A.size} edge(s)`),A},[B,C,T,x,re,a]);b.useEffect(()=>{if(!B||!new URLSearchParams(window.location.search).has("dbg"))return;const A=new Map;for(const R of B.edges){const V=Se.get(R.id);if(!V)continue;const H=ln(R.sections);if(H.length<2)continue;const K=ce(V)===V.source?V.target:V.source;let Y=0,M=0;for(let W=1;W<H.length;W++){const Z=Math.abs(H[W].x-H[W-1].x),ue=Math.abs(H[W].y-H[W-1].y);Z>.5&&ue>.5&&M++,W>1&&Y++}const _=ce(V);A.set(K,[...A.get(K)??[],`${_}.${V.slotName}  pts=${H.length} bends=${Y}${M?` DIAGONAL x${M}`:""}  start=(${Math.round(H[0].x)},${Math.round(H[0].y)}) end=(${Math.round(H[H.length-1].x)},${Math.round(H[H.length-1].y)})`])}for(const[R,V]of A){if(V.length<2)continue;console.log(`
=== approaches to ${R} (${V.length}) ===`);const H=re.get(R);H&&console.log(`   box at (${Math.round(H.x)},${Math.round(H.y)}) h=${Math.round(H.height)}`),V.forEach(K=>console.log("   "+K))}},[B,Se,re]);const ae=b.useMemo(()=>{const A=new Map;if(!B)return A;for(const R of B.edges){const V=Se.get(R.id);if(!V||V.storageDirection==="flipped"||Q.has(R.id)||pi(l,ln(R.sections))<=0)continue;const H=ce(V)===V.source?V.target:V.source,K=`${H}|${H===V.source?"out":"in"}`,Y=q.get(K);if(!Y)continue;const M=V.type==="ownership",_=ve.get(V.source)==="context"||ve.get(V.target)==="context",W=x.edgeColors.get(R.id),Z=A.get(K);A.set(K,Z?{...Z,isOwn:Z.isOwn||M,dimmed:Z.dimmed&&_,edgeIds:[...Z.edgeIds,R.id],...Z.color?.text===W?.text?{}:{color:void 0}}:{...Y,isOwn:M,dimmed:_,edgeIds:[R.id],...W?{color:W}:{}})}return A},[B,Se,q,l,ve,x,Q]),we=b.useMemo(()=>new Set(x.nodes.map(A=>A.id)),[x]),Le=b.useCallback(A=>!!i&&A.channel!=="plain"&&!A.isLoop&&!we.has(A.range),[i,we]),Ne=b.useRef(null),dt=b.useRef(null),ft=b.useRef(void 0),pt=b.useMemo(()=>{const A=new Map,R=new Map;for(const V of x.edges){R.set(V.id,[V.source,V.target]);for(const H of[V.source,V.target])A.set(H,[...A.get(H)??[],V.id])}return{nodeEdges:A,edgeEnds:R}},[x]),U=b.useRef(pt);U.current=pt;const J=b.useCallback(A=>{ft.current=A,dt.current===null&&(dt.current=requestAnimationFrame(()=>{dt.current=null;const R=ft.current;ft.current=void 0;const V=Ne.current,H=F.wrapperRef.current;if(R===void 0||!V||!H)return;let K=null,Y=null;if(R){const{nodeEdges:_,edgeEnds:W}=U.current;if(R.kind==="node"){K=new Set(_.get(R.id)??[]),Y=new Set([R.id]);for(const Z of K)for(const ue of W.get(Z)??[])Y.add(ue)}else K=new Set([R.id]),Y=new Set(W.get(R.id)??[])}const M=(_,W,Z)=>{_.style.filter=W===null||W?"":`opacity(${Z})`};V.querySelectorAll("path[data-edge-id]").forEach(_=>{const W=_.dataset.edgeId??"",Z=K?K.has(W):null;M(_,Z,.38),_.style.strokeWidth=Z?String(_.dataset.channel==="association"?Im:Gl):""}),V.querySelectorAll("path[data-arrowhead]").forEach(_=>{const W=(_.dataset.arrowhead??"").split(" ");M(_,K?W.some(Z=>K.has(Z)):null,.08)}),H.querySelectorAll("[data-node-id]").forEach(_=>{M(_,Y?Y.has(_.dataset.nodeId??""):null,.25)})}))},[]);b.useEffect(()=>J(null),[x,B,J]);const pe=A=>m(R=>{const V=new Set(R);return V.has(A)?V.delete(A):V.add(A),V}),me=A=>{vr("dir",A),c(A)},Yt=A=>{vr("merge",A),u(A)},Xt=e.getConceptLabel("attribute",!0).toLowerCase(),Qe=A=>`px-2 py-0.5 text-xs rounded border ${A?"border-blue-500 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300":"border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700"}`;return h.jsxs("div",{className:"relative w-full h-full",children:[h.jsxs("div",{"data-pan-ignore":!0,className:"absolute top-2 right-2 z-10 flex gap-1 items-center",children:[Me&&h.jsxs("div",{className:`mr-2 flex items-center gap-2 rounded px-2 py-1
                          text-xs text-gray-500 dark:text-gray-400
                          bg-white/80 dark:bg-slate-900/80 shadow-sm`,children:[h.jsx("span",{className:`inline-block h-3 w-3 animate-spin rounded-full
                             border-2 border-gray-300 border-t-gray-600
                             dark:border-slate-600 dark:border-t-slate-300`}),"Computing layout…"]}),o&&h.jsxs(h.Fragment,{children:[h.jsx("button",{className:Qe(r),title:r?"Hide owners: show only what you selected":"Show every owner up to the root (can pull in most of the schema)",onClick:o,children:"⇱ roots"}),h.jsx("span",{className:"w-px h-4 bg-gray-300 dark:bg-slate-600 mx-1"})]}),h.jsx("button",{className:Qe(a==="RIGHT"),title:"Layout left to right",onClick:()=>me("RIGHT"),children:"LR"}),h.jsx("button",{className:Qe(a==="DOWN"),title:"Layout top down",onClick:()=>me("DOWN"),children:"TB"}),h.jsx("span",{className:"w-px h-4 bg-gray-300 dark:bg-slate-600 mx-1"}),h.jsx("button",{className:Qe(l==="near"),title:"Merge converging edges near the node (~40px)",onClick:()=>Yt("near"),children:"⋙"}),h.jsx("button",{className:Qe(l==="far"),title:"Merge converging edges early (~120px)",onClick:()=>Yt("far"),children:"⋙⋙"}),h.jsx("button",{className:Qe(l==="bend"),title:"Merge at ELK's last corner",onClick:()=>Yt("bend"),children:"⌙"}),h.jsx("button",{className:Qe(l==="off"),title:"No merging — every edge runs to its own port",onClick:()=>Yt("off"),children:"≡"}),h.jsx("span",{className:"w-px h-4 bg-gray-300 dark:bg-slate-600 mx-1"}),[["+",()=>F.zoomBy(1.3),"Zoom in"],["−",()=>F.zoomBy(1/1.3),"Zoom out"],["1:1",()=>F.applyZoom(1),"Reset zoom"],["⛶",()=>F.zoomToFit(),"Fit to view"]].map(([A,R,V])=>h.jsx("button",{onClick:R,title:V,className:Qe(!1),children:A},A))]}),h.jsx("div",{ref:F.containerRef,"data-graph-direction":a,className:"w-full h-full overflow-auto cursor-grab",children:h.jsx("div",{ref:F.spacerRef,children:h.jsx("div",{ref:F.wrapperRef,className:"relative",children:O&&h.jsxs(h.Fragment,{children:[h.jsxs("svg",{ref:Ne,className:"absolute top-0 left-0 pointer-events-none",width:S,height:z,children:[h.jsxs("defs",{children:[(()=>{const A=An("forward"),{d:R,...V}=A;return h.jsx("marker",{id:d("arrow-own"),...V,children:h.jsx("path",{d:R,fill:Ke.ownFwd})})})(),(()=>{const{d:A,...R}=An("backward");return h.jsx("marker",{id:d("arrow-own-back"),...R,children:h.jsx("path",{d:A,fill:Ke.ownBkwd})})})(),(()=>{const{d:A,...R}=An("forward",Nm);return h.jsx("marker",{id:d("arrow-assoc"),...R,children:h.jsx("path",{d:A,fill:Ke.association})})})()]}),h.jsxs("g",{transform:`translate(${gt}, ${gt})`,style:{opacity:fe?1:0,transition:`opacity ${cm()}ms`},children:[[...ae].map(([A,R])=>h.jsx("path",{"data-arrowhead":R.edgeIds.join(" "),d:Yp(R.base,R.dir,jm,kr),fill:R.color?.text??Tr(R.isOwn,!1),opacity:R.dimmed?.4:1,style:{transition:`filter ${un()}ms`}},`head-${A}`)),(B?.edges??[]).map(A=>{const R=Se.get(A.id);if(!R)throw new Error(`Routed edge ${A.id} missing from view model`);const V=R.storageDirection==="flipped",H=ce(R)===R.source?R.target:R.source,K=V||Q.has(A.id)?void 0:q.get(`${H}|${H===R.source?"out":"in"}`),Y=ne.get(A.id),M=!!K&&pi(l,Y??ln(A.sections))>0,_=R.type!=="ownership",W=M?A.sections:$m(A.sections,mr(_?"association":"own-fwd")),Z=_?Fm(W,mr("association")):W,ue=Y??ln(Z),Ee=qn=>Gp(qn,Rm),Ve=pi(l,ue),tt=K&&Ve>0?Qp(ue,K.base,Ve,Ee):Ee(ue);if(!tt)return null;const qe=R.type==="ownership",mt=ve.get(A.source)==="context"||ve.get(A.target)==="context",Zt=M?void 0:qe?V?"arrow-own-back":"arrow-own":"arrow-assoc";return h.jsxs("g",{children:[h.jsx("path",{"data-edge-id":A.id,"data-channel":qe?"ownership":"association",d:tt,fill:"none",opacity:mt?.4:1,stroke:x.edgeColors.get(A.id)?.text??Tr(qe,V),strokeWidth:qe?zl:Vm,strokeDasharray:qe?void 0:ie.dash,markerEnd:Zt?`url(#${d(Zt)})`:void 0,markerStart:!qe&&!M?`url(#${d("arrow-assoc")})`:void 0,style:{transition:`filter ${un()}ms, stroke-width ${un()}ms`}}),h.jsx("path",{d:tt,fill:"none",stroke:"transparent",strokeWidth:11,style:{pointerEvents:"stroke"},onMouseEnter:()=>J({kind:"edge",id:A.id}),onMouseLeave:()=>J(null)})]},A.id)})]})]}),h.jsx(Df,{initial:!1,children:x.nodes.map(A=>{const R=re.get(A.id);if(!R)return null;const V=A.role==="context",H=R.x+gt,K=R.y+gt,Y={duration:cn(C.has(A.id)?0:Ol()),ease:rm};return h.jsxs(Bp.div,{initial:{opacity:0,x:H,y:K},animate:{opacity:V?Cm:1,x:H,y:K},exit:{opacity:0,transition:{duration:cn(br())}},transition:{x:Y,y:Y,opacity:{duration:cn(br()),delay:cn(lm())}},"data-node-id":A.id,"data-help-id":Lc(A),"data-pan-ignore":!0,"data-pinned":T.has(A.id)?"":void 0,onPointerDown:M=>Pe(A.id,M),onClick:()=>{if(X.current){X.current=!1;return}n?.(A.members.length?A.label:A.id)},onMouseEnter:()=>J({kind:"node",id:A.id}),onMouseLeave:()=>J(null),className:`absolute rounded-md text-xs bg-white dark:bg-slate-800 cursor-pointer ${V?"border border-dashed border-gray-400 dark:border-slate-500":T.has(A.id)?"border-2 border-amber-500 dark:border-amber-400 shadow-md":"border-2 border-slate-500 dark:border-slate-400 shadow-md"}`,style:{width:Ce,height:A.height,transition:`filter ${un()}ms`},children:[h.jsxs("div",{className:"flex items-center gap-1 px-2 rounded-t-[4px] bg-slate-700 dark:bg-slate-700 text-white border-b border-slate-800 dark:border-slate-600",style:{height:ct},children:[h.jsx("span",{className:`font-semibold truncate ${A.abstract?"italic":""}`,title:A.description||A.id,children:A.label}),h.jsxs("span",{className:"ml-auto flex gap-1 shrink-0",children:[A.members.length>0&&h.jsxs("span",{title:`${A.members.length} classes that are a ${A.label}, merged into one box`,className:"text-[9px] px-1 rounded bg-sky-100 dark:bg-sky-900 text-sky-800 dark:text-sky-200",children:["⑃ ",A.members.length]}),A.isaParents.map(M=>h.jsxs("span",{title:`is-a ${M}`,className:"text-[9px] px-1 rounded bg-sky-100 dark:bg-sky-900 text-sky-800 dark:text-sky-200",children:["⊳ ",M]},M)),A.subclassCount>0&&A.members.length===0&&h.jsxs("span",{title:`${A.subclassCount} subclasses shown`,className:"text-[9px] px-1 rounded bg-sky-100 dark:bg-sky-900 text-sky-800 dark:text-sky-200",children:["▷ ",A.subclassCount]}),(()=>{const _=(A.members.length?A.members.map(W=>W.id):[A.id]).filter(W=>t.has(W));return _.length?h.jsx("button",{"data-dismiss":A.id,"data-help-id":"node-dismiss",title:_.length>1?`Remove all ${_.length} selected classes in ${A.label}`:`Remove ${A.label} from the canvas`,onClick:W=>{W.stopPropagation(),_.forEach(Z=>s?.(Z))},className:`text-[10px] leading-none px-1 rounded text-gray-400
                                         hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/40`,children:"✕"}):null})()]})]}),A.relationGroups.length>0&&h.jsx("div",{"data-help-id":"relation-bar",className:`flex items-center gap-1 px-2 border-b overflow-hidden
                                     border-gray-200 dark:border-slate-600
                                     bg-sky-50/60 dark:bg-sky-950/30`,style:{height:$s},children:h.jsx(mm,{label:A.label,rows:A.relationRows,onAdd:M=>i?.(M),onRemove:M=>s?.(M),onInspect:n,colorOf:p,slotOrder:A.allRows.map(M=>M.slot),parentOf:M=>e.getClassSummary(M)?.parentId})}),A.rows.map(M=>M.header?h.jsx("div",{"data-no-drag":!0,"data-help-id":Rc(M.header.id),title:`${M.header.label} — is a ${A.label}; click for details`,onClick:_=>{_.stopPropagation(),n?.(M.header.id)},className:`flex items-center px-2 text-[10px] font-semibold
                                     cursor-pointer hover:brightness-110`,style:{height:ut,background:M.header.color.fill,color:pc},children:h.jsx("span",{className:"truncate",children:M.header.label})},M.slot):h.jsxs("div",{"data-help-id":Nc(A,M),"data-expandable":Le(M)?"":void 0,"data-no-drag":Le(M)?"":void 0,title:(M.channel==="plain"?`${M.slot}: ${M.range}`:`${M.slot} → ${M.range} (${M.cardinality})${M.flipped?" — owner side":""}`+(Le(M)?` — click to add ${M.range}`:""))+((M.owners?.length??0)>1?`
also declared by ${M.owners.slice(1).map(_=>_.label).join(", ")}`:""),onClick:Le(M)?_=>{_.stopPropagation(),i?.(M.range)}:void 0,className:`flex items-center gap-1.5 px-2 text-[11px] ${M.targetColor?"":M.connected?"text-gray-700 dark:text-gray-300":"text-gray-400 dark:text-gray-500"} ${Le(M)?"cursor-pointer hover:bg-sky-50 dark:hover:bg-sky-900/30 hover:text-sky-700 dark:hover:text-sky-300":""}`,style:{height:ut,...M.targetColor?{color:M.targetColor.text}:{}},children:[h.jsx("span",{className:"w-1.5 h-1.5 rounded-full shrink-0 border",style:{borderColor:M.rangeColor,background:M.connected?M.rangeColor:"transparent"}}),h.jsx("span",{className:`truncate ${A.members.length&&!M.owners?.length?`font-semibold ${M.targetColor?"":"text-gray-900 dark:text-gray-100"}`:""}`,children:M.slot}),M.isLoop&&h.jsx(Dm,{title:`self-referential: a ${M.range} can own another ${M.range} via ${M.slot}`}),h.jsxs("span",{className:"ml-auto text-[9px] truncate max-w-[90px]",children:[h.jsx("span",{style:{color:M.rangeColor},children:M.range}),h.jsxs("span",{className:"text-gray-400 dark:text-gray-500",children:[" ",M.cardinality]})]})]},M.declaringClass?`${M.declaringClass}|${M.slot}`:M.slot)),A.hiddenCount>0&&h.jsx("button",{className:"w-full text-left px-2 text-[10px] text-sky-600 dark:text-sky-400 hover:underline",style:{height:Il},title:`${Xt} without an edge on the current canvas, plus plain (non-entity) ${Xt}`,onClick:M=>{M.stopPropagation(),pe(A.id)},children:A.expanded?`− fewer ${Xt}`:`+ ${A.hiddenCount} more ${Xt}`})]},A.id)})})]})})})})]})}function Hm({classId:e,dataService:t,onClose:n,onNavigate:i,isSelected:s,onToggleSelect:r}){const o=b.useMemo(()=>t.getClassSummary(e),[e,t]),[a,c]=b.useState([]),l=b.useCallback(d=>{d!==e&&(c(y=>[...y,e]),i(d))},[e,i]),u=b.useCallback(()=>{c(d=>d.length===0?d:(i(d[d.length-1]),d.slice(0,-1)))},[i]);b.useEffect(()=>{const d=y=>{y.key==="Escape"&&n()};return window.addEventListener("keydown",d),()=>window.removeEventListener("keydown",d)},[n]);const f=t.getTypeLabel("slot",!0);return h.jsxs("aside",{className:`w-96 shrink-0 flex flex-col min-h-0 border-l border-gray-200 dark:border-slate-700
                 bg-white dark:bg-slate-900`,"aria-label":"Entity details",children:[h.jsxs("header",{className:`flex items-start gap-2 px-3 py-2 border-b border-gray-200 dark:border-slate-700
                   bg-gray-50 dark:bg-slate-800 shrink-0`,children:[a.length>0&&h.jsx("button",{onClick:u,className:"text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-sm mt-0.5",title:"Back",children:"←"}),h.jsxs("div",{className:"flex-1 min-w-0",children:[h.jsxs("div",{className:"font-semibold text-sm text-blue-700 dark:text-blue-300 break-words",children:[o?.name??e,o?.isAbstract&&h.jsx("span",{className:"ml-1 text-xs text-purple-500 italic",children:"(abstract)"})]}),o?.parentId&&h.jsxs("div",{className:"text-xs text-gray-400",children:["is a"," ",h.jsx("button",{onClick:()=>l(o.parentId),className:"text-blue-600 dark:text-blue-400 hover:underline",children:o.parentId})]})]}),h.jsx("button",{onClick:n,className:"text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-sm px-1",title:"Close (Esc)",children:"✕"})]}),o?h.jsxs("div",{className:"flex-1 overflow-y-auto min-h-0 px-3 py-2 space-y-3",children:[h.jsx("button",{onClick:()=>r(e),className:`w-full px-2 py-1 text-xs rounded border ${s?"border-blue-500 bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300":"border-gray-300 dark:border-slate-600 hover:border-blue-400 text-gray-600 dark:text-gray-300"}`,children:s?"✓ In diagram — click to remove":"+ Add to diagram"}),o.description&&h.jsx("p",{className:"text-xs text-gray-600 dark:text-gray-300 leading-relaxed",children:o.description}),o.referencedBy.length>0&&h.jsxs("section",{children:[h.jsxs(Cr,{children:["Referenced by (",o.referencedBy.length,")"]}),h.jsx("ul",{className:"space-y-0.5",children:o.referencedBy.map((d,y)=>h.jsxs("li",{className:"text-xs",children:[h.jsx("button",{onClick:()=>l(d.classId),className:"text-blue-600 dark:text-blue-400 hover:underline cursor-pointer",children:d.classId}),h.jsxs("span",{className:"text-gray-400",children:[".",d.slotName]})]},`${d.classId}.${d.slotName}-${y}`))})]}),o.slots.length>0&&h.jsxs("section",{children:[h.jsxs(Cr,{children:[f," (",o.slots.length,")"]}),h.jsx("ul",{className:"divide-y divide-gray-100 dark:divide-slate-700",children:o.slots.map((d,y)=>h.jsxs("li",{className:"py-1.5",children:[h.jsxs("div",{className:"flex items-baseline gap-1.5 flex-wrap",children:[h.jsx("span",{className:"text-xs font-medium text-gray-800 dark:text-gray-100",children:d.name}),h.jsx(Wm,{range:d.range,onNavigate:l,dataService:t})]}),d.description&&h.jsx("p",{className:"mt-0.5 text-[11px] text-gray-500 dark:text-gray-400 leading-snug break-words",children:d.description})]},`${d.name}-${y}`))})]})]}):h.jsxs("div",{className:"p-3 text-xs text-gray-500",children:["Entity not found: ",e]})]})}function Cr({children:e}){return h.jsx("div",{className:"text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-1",children:e})}function Wm({range:e,onNavigate:t,dataService:n}){const i=n.getRangeKind(e),s=i==="class"&&n.itemExists(e),o=`inline-block px-1 py-0 rounded text-[11px] font-medium ${i==="type"?"bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300":i==="enum"?"bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300":"bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"}`;return s?h.jsx("button",{onClick:()=>t(e),className:`${o} hover:underline cursor-pointer`,children:e}):h.jsx("span",{className:o,children:e})}const zm=[{heading:"One rule at a time",cases:[{name:"Rule 1 — multivalued owns forward",note:"A multivalued slot means the owner has-a collection, so ownership runs forward: Questionnaire.items and ResearchStudy.consents. The two `part_of` self-loops are the counterexample — multivalued but drawn backward, because they walk UP a tree.",sel:["ResearchStudy","Consent","Questionnaire","QuestionnaireItem"]},{name:"Rule 2 — single-valued belongs backward",note:"The largest group (70 edges). Participant fans OUT to 22 targets, nearly all reversed: each target declares `associated_participant` and is drawn as belonging to Participant. This is the group that would move if own-bkwd merges into association.",sel:["Participant","Condition","Demography","Exposure","Procedure","Visit"]},{name:"Exception 2a — no independent existence",note:"Single-valued, but forward anyway: Quantity, TimePoint and the like have no identity of their own, so the value belongs to whoever holds it rather than owning the holder.",sel:["SpecimenStorageActivity","Quantity","TimePoint","Activity"]},{name:"Entity-ranged — always forward",note:"The twelve focus / associated_evidence slots range on Entity, the universal root. A pointer AT the root is never a foreign key back to an owner, so these run forward whatever their cardinality. Both single- and multi-valued focus sites are here — all should point AT Entity.",sel:["Observation","ObservationSet","MeasurementObservation","Document","Condition","SdohObservation","Entity"]},{name:"Association — no ownership claim",note:"Both associations in the schema: Document.related_document → Specimen, and SpecimenContainer.container → SpecimenStorageActivity. Slate and dashed, arrowed at both ends. They are listed explicitly because they are multivalued, so Rule 1 would otherwise call them ownership.",sel:["Document","Specimen","SpecimenContainer","SpecimenStorageActivity"]},{name:"Self-loops",note:"The five self-owning slots (TimePoint.index_time_point, File.derived_from, Specimen.parent_specimen, ResearchStudy.part_of, SpecimenContainer.parent_container) — loop markers, not routed edges. ResearchStudy also pulls in its TimePoint edges; the loops are the circular arrows on the rows.",sel:["TimePoint","File","Specimen","ResearchStudy","SpecimenContainer"]}]},{heading:"Inheritance (merged sibling boxes)",cases:[{name:"One child, merged with its parent",note:"MeasurementObservation alone. It still merges: the box is titled Observation, its 13 inherited rows sit at the top in black, and MeasurementObservation's own 9 follow under its coloured header. Merging does not wait for a second sibling — a class must not change shape because of what else you happen to select.",sel:["MeasurementObservation"]},{name:"Children that add nothing",note:'SpecimenQuality- and SpecimenQuantityObservation declare no slots of their own. Both still get a header under the shared rows, because "this subclass adds nothing" is the answer to what they are — and without the headers the selection would leave no trace in the box at all.',sel:["SpecimenQualityObservation","SpecimenQuantityObservation"]},{name:"slot_usage — same name, different type",note:"QuestionnaireResponseValue's five children each narrow `value` to a different type (boolean, decimal, integer, TimePoint, and the parent's string). That narrowing is the entire reason the five classes exist, so each keeps its OWN row rather than merging into the parent's — the one place a shared row would be a lie.",sel:["QuestionnaireResponseValueBoolean","QuestionnaireResponseValueDecimal","QuestionnaireResponseValueInteger","QuestionnaireResponseValueString","QuestionnaireResponseValueTimePoint"]},{name:"The full Observation family",note:"All five Observation subclasses plus the parent. One box where there would be six, and the shared rows are stated once. Note each edge leaves in the colour of the child that owns its row; inherited slots' edges are the parent's and are drawn once, not once per child.",sel:["Observation","MeasurementObservation","SdohObservation","DimensionalObservation","SpecimenQualityObservation","SpecimenQuantityObservation"]}]},{heading:"The bare diagonal",cases:[{name:"BodySite 6-way (the original)",note:"The reproducer from the handoff. In ⌙ (bend) the top approach arrives as a straight diagonal with no steps; in ⋙ (near) it keeps its horizontal run. This is the case the fix has to fix.",sel:["BodySite","Condition","Consent","Demography","Exposure","Observation","Procedure","ImagingFile","ImagingStudy","MeasurementObservation","SpecimenCreationActivity"]},{name:"BodySite, owners only",note:"The same convergence with nothing else on canvas — six owners, no unrelated boxes for a diagonal to cut across. Shows whether the degeneracy is about the convergence itself or about crowding.",sel:["BodySite","Condition","ImagingFile","ImagingStudy","MeasurementObservation","Procedure","SpecimenCreationActivity"]},{name:"TimePoint 16-edge",note:"Densest corridor in the schema: 8 owners but 16 slot-edges, since each Specimen*Activity owns date_started and date_ended. Also where the second-from-top edge goes diagonal and pair edges cross.",sel:["TimePoint","Consent","ResearchStudy","TimePeriod","SpecimenCreationActivity","SpecimenProcessingActivity","SpecimenStorageActivity","SpecimenTransportActivity","QuestionnaireResponseValueTimePoint"]},{name:"TimePoint + Person (crossing)",note:"Siggie's repro for the crossing bug: the paired date_started / date_ended edges from different owners cross each other on the way in. Compare pair ordering against the case above.",sel:["TimePoint","Person","Consent","ResearchStudy","TimePeriod","SpecimenCreationActivity","SpecimenProcessingActivity","SpecimenStorageActivity","SpecimenTransportActivity","QuestionnaireResponseValueTimePoint"]}]},{heading:"Pathological convergences",cases:[{name:"Quantity 19-edge (worst case)",note:"The largest convergence in the schema: 16 owning classes, 19 slot-edges. The fan is squeezed hardest here, so ENTITY_FAN_GAP and the merge distance both show their limits.",sel:["Quantity","Activity","Assay","DeviceExposure","DimensionalObservation","DrugExposure","MeasurementObservation","Observation","Procedure","SdohObservation","SpecimenCreationActivity","SpecimenProcessingActivity","SpecimenQualityObservation","SpecimenQuantityObservation","SpecimenStorageActivity","SpecimenTransportActivity","Substance"]},{name:"Context 6-way (uniform owners)",note:"Six owners that are all observation classes — same size, same shape, similar row counts. The controlled comparison for BodySite, whose owners vary wildly in height.",sel:["Context","DimensionalObservation","MeasurementObservation","Observation","SdohObservation","SpecimenQualityObservation","SpecimenQuantityObservation"]},{name:"Two convergences at once",note:"Quantity and TimePoint both converge from the same Specimen activity classes, so two corridors compete for the same space. Where merge distance trades off against crossings.",sel:["Quantity","TimePoint","SpecimenCreationActivity","SpecimenProcessingActivity","SpecimenStorageActivity","SpecimenTransportActivity"]}]},{heading:"Flipped divergences (found via the legend)",cases:[{name:"Participant 22-way (largest fan in the schema)",note:"Bigger than any inbound convergence: 22 edges leaving Participant, 21 of them FLIPPED. Flipped edges keep their attribute-row anchor and must not merge, so this is the fan the merge code deliberately does not touch — and therefore the one nothing has been tuned against.",sel:["Participant","Condition","Consent","Demography","DeviceExposure","DrugExposure","Exposure","File","ImagingStudy","MeasurementObservation","Observation","Procedure","SdohObservation","Specimen","Visit"]},{name:"Visit 19-way",note:"The same shape one size down, and it overlaps Participant heavily — most classes carry both associated_participant and associated_visit, so the two fans run through the same corridor as pairs.",sel:["Visit","Condition","Demography","DeviceExposure","DrugExposure","Exposure","ImagingStudy","MeasurementObservation","Observation","Procedure","QuestionnaireResponse","SdohObservation","TimePeriod"]},{name:"Participant + Visit + Organization",note:"All three FK hubs at once (22 + 19 + 11 edges, nearly all flipped). The densest picture the schema can produce, and the stress test for anything that changes routing.",sel:["Participant","Visit","Organization","Condition","Demography","DimensionalObservation","MeasurementObservation","Observation","ObservationSet","Procedure","SdohObservation","SpecimenQualityObservation","SpecimenQuantityObservation"]},{name:"Converge and diverge at once",note:"MeasurementObservation owns BodySite/Context/Quantity while being owned by Participant/Visit/Organization — edges fan IN and OUT of the same box. Where merged (entity-end) and unmerged (flipped) arrivals sit side by side.",sel:["MeasurementObservation","BodySite","Context","Quantity","Participant","Visit","Organization","MeasurementObservationSet"]}]},{heading:"Normal cases (a fix must not break these)",cases:[{name:"Single edge",note:"One owner, one edge, no convergence at all — merging is a no-op. The floor: if this looks wrong, something basic broke.",sel:["Visit","TimePeriod"]},{name:"Two owners",note:"The smallest real convergence. Two approaches, one arrowhead — the fan is barely a fan, so a merge distance that is too long is obvious here first.",sel:["Participant","Visit","ObservationSet"]},{name:"Specimen chain (deep, not wide)",note:"A long ownership chain rather than a convergence: many layers, few edges per node. Checks that tuning for convergences has not made ordinary edges worse.",sel:["Specimen","SpecimenContainer","SpecimenCreationActivity","SpecimenProcessingActivity","SpecimenStorageActivity","SpecimenTransportActivity","Participant"]},{name:"The known 3-node cycle",note:"Specimen -> SpecimenStorageActivity -> SpecimenContainer -> Specimen: an association plus two ownership edges. Known and deliberately unhandled; here so it stays visible.",sel:["Specimen","SpecimenStorageActivity","SpecimenContainer"]},{name:"Backward ownership (own-bkwd)",note:"Slots drawn backward (performed_by, associated_person, contained_in, related_imaging_study). These keep their attribute-row anchor and must NOT merge — check the arrowheads.",sel:["Organization","Person","Participant","ImagingFile","ImagingStudy","SpecimenContainer","Specimen"]},{name:"Path to root",note:"Path-to-root on from a single deep class, which pulls in every owner up the chain. The biggest graph reachable in one click.",sel:["MeasurementObservation"],roots:!0}]}],Gm=3,mi=40;function Ul(){const[e,t]=b.useState(null),n=b.useCallback(s=>{if(s.button!==0||s.target.closest('button, a, input, select, textarea, [role="button"], [data-no-drag]'))return;const o=(s.currentTarget.closest("[data-draggable]")??s.currentTarget).getBoundingClientRect(),a=s.clientX,c=s.clientY,l={left:o.left,top:o.top},u=s.currentTarget;u.setPointerCapture(s.pointerId);let f=!1;const d=m=>{const w=m.clientX-a,p=m.clientY-c;if(!f&&Math.hypot(w,p)<Gm)return;f=!0;const g={left:Math.max(Math.min(l.left+w,window.innerWidth-mi),mi-o.width),top:Math.min(Math.max(l.top+p,0),window.innerHeight-mi)};t(g)},y=m=>{u.releasePointerCapture(m.pointerId),u.removeEventListener("pointermove",d),u.removeEventListener("pointerup",y),u.removeEventListener("pointercancel",y)};u.addEventListener("pointermove",d),u.addEventListener("pointerup",y),u.addEventListener("pointercancel",y)},[]),i=b.useCallback(()=>t(null),[]);return{offset:e,onPointerDown:n,reset:i}}const Fs={legend:30,cases:26},Um=1,Km=Fs.legend+Um;function Kl({title:e,subtitle:t,onClose:n,offset:i,widthRem:s=Fs.cases,children:r}){const o=Ul();b.useEffect(()=>{const c=l=>{l.key==="Escape"&&n()};return window.addEventListener("keydown",c),()=>window.removeEventListener("keydown",c)},[n]);const a=o.offset!==null;return h.jsxs("div",{"data-draggable":"",style:{resize:"both",width:`${s}rem`,maxWidth:"calc(100vw - 2rem)",maxHeight:o.offset?`calc(100vh - ${o.offset.top}px - 1rem)`:"calc(100vh - 4.5rem)",...o.offset?{position:"fixed",...o.offset,right:"auto"}:!a&&i?{right:`${Km}rem`}:{}},className:`z-30 overflow-y-auto
                  rounded-lg border border-gray-300 dark:border-slate-600
                  bg-white dark:bg-slate-800 shadow-xl
                  text-gray-900 dark:text-gray-100
                  ${a?"":`absolute top-14 ${i?"":"right-4"}`}`,children:[h.jsxs("div",{onPointerDown:o.onPointerDown,className:`sticky top-0 flex items-baseline justify-between gap-2 px-4 py-2
                   border-b border-gray-200 dark:border-slate-700
                   bg-white dark:bg-slate-800 cursor-grab active:cursor-grabbing
                   select-none`,children:[h.jsxs("div",{children:[h.jsx("h2",{className:"text-sm font-semibold",children:e}),t&&h.jsx("p",{className:"text-[11px] text-gray-500 dark:text-gray-400",children:t})]}),h.jsxs("div",{className:"flex items-center gap-1 shrink-0",children:[a&&h.jsx("button",{onClick:o.reset,title:"Put it back",className:`text-gray-400 hover:text-gray-700 dark:hover:text-gray-200
                         text-xs leading-none px-1`,children:"⤺"}),h.jsx("button",{onClick:n,title:"Close (Esc)",className:"text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-lg leading-none",children:"×"})]})]}),h.jsx("div",{className:"px-4 py-2",children:r})]})}function Qm(e,t){return e.sel.length===t.size&&e.sel.every(n=>t.has(n))}function qm({onClose:e,onApply:t,selectedIds:n,dataService:i,offset:s}){const r=b.useMemo(()=>i.getConvergenceRanking(),[i]),o=b.useMemo(()=>i.getDivergenceRanking(),[i]),a=c=>t({name:"ad hoc",note:"",sel:c});return h.jsxs(Kl,{title:"Example cases",subtitle:"Selections worth looking at, simple to dense.",onClose:e,offset:s,children:[h.jsxs("section",{className:"mb-4",children:[h.jsx(Ar,{children:"Biggest fans"}),h.jsx("p",{className:"text-[11px] text-gray-500 dark:text-gray-400 mb-1.5",children:"Counted in slot-edges, not classes: one class owning a target through two slots crowds the corridor twice. Click a row to load just that fan."}),h.jsx("div",{className:"grid grid-cols-2 gap-3",children:[["Converging (in)",r.slice(0,6).map(c=>({entity:c.entity,n:c.edgeCount,peers:c.owners,flipped:0}))],["Diverging (out)",o.slice(0,6).map(c=>({entity:c.entity,n:c.edgeCount,peers:c.owned,flipped:c.flippedCount}))]].map(([c,l])=>h.jsxs("div",{children:[h.jsx("h4",{className:"text-[10px] font-medium text-gray-500 dark:text-gray-400 mb-0.5",children:c}),h.jsx("ul",{className:"space-y-0.5",children:l.map(u=>h.jsx("li",{children:h.jsxs("button",{onClick:()=>a([u.entity,...u.peers]),title:`Select ${u.entity} and all ${u.peers.length} peers`,className:"w-full text-left text-xs hover:bg-gray-50 dark:hover:bg-slate-700 rounded px-1",children:[h.jsx("span",{className:"text-blue-600 dark:text-blue-400",children:u.entity}),h.jsxs("span",{className:"text-gray-400 ml-1",children:[u.n,u.flipped>0?` (${u.flipped} flipped)`:""]})]})},u.entity))})]},c))})]}),zm.map(c=>h.jsxs("section",{className:"mb-3 last:mb-1",children:[h.jsx(Ar,{children:c.heading}),h.jsx("ul",{className:"space-y-1.5",children:c.cases.map(l=>{const u=Qm(l,n);return h.jsx("li",{children:h.jsxs("button",{onClick:()=>t(l),className:`block w-full text-left rounded px-2 py-1 border
                      ${u?"border-blue-500 bg-blue-50 dark:bg-blue-950":"border-transparent hover:bg-gray-50 dark:hover:bg-slate-700"}`,children:[h.jsx("span",{className:`text-xs font-medium ${u?"text-blue-700 dark:text-blue-300":"text-blue-600 dark:text-blue-400"}`,children:l.name}),h.jsxs("span",{className:"ml-1.5 text-[10px] text-gray-400",children:[l.sel.length,l.roots?" ⇱":""]}),h.jsx("p",{className:"text-[11px] leading-snug text-gray-600 dark:text-gray-400 mt-0.5",children:l.note})]})},l.name)})})]},c.heading))]})}function Ar({children:e}){return h.jsx("h3",{className:`text-[11px] font-semibold uppercase tracking-wider
                   text-gray-400 dark:text-gray-500 mb-1`,children:e})}const fn="text-[11px] leading-snug text-gray-500 dark:text-gray-400 mb-2";function Pr({kind:e}){const t=ie.kinds[e];return h.jsxs("span",{className:"flex items-center gap-1.5 my-1 ml-4",children:[h.jsx($n,{kind:e,width:56}),h.jsx("span",{className:"font-medium",style:{color:t.color},children:t.label})]})}const Ym={"own-fwd":Ke.ownFwd,"own-bkwd":Ke.ownBkwd,excluded:void 0},Xm=[{glyph:"⇱ roots",what:"Also draw everything on the path up to a root."},{glyph:"LR / TB",what:"Lay the diagram out left-to-right or top-down."},{glyph:"⋙ ⋙⋙ ⌙ ≡",what:"Where converging edges join before their shared arrowhead — near the box, early, at the last corner, or not at all. Temporary, for picking one by eye."},{glyph:"+ − 1:1 ⛶",what:"Zoom in, out, reset, fit to view."}],Zm=[["0..1","optional, at most one"],["1..1","required, exactly one"],["0..*","optional, any number"],["1..*","required, one or more"]];function Er(e){const t=new Map;for(const n of e){const i=t.get(n.range);i?i.push(n):t.set(n.range,[n])}return[...t.entries()].map(([n,i])=>({entity:n,pairs:i})).sort((n,i)=>n.entity.localeCompare(i.entity))}function pn({n:e,noun:t,open:n,onClick:i}){return h.jsxs("button",{onClick:i,"aria-expanded":n,title:n?`Hide these ${t}`:`List these ${t}`,className:`group cursor-pointer rounded px-1 -mx-1 text-[11px]
                 hover:bg-gray-100 dark:hover:bg-slate-700`,children:[h.jsx("span",{className:"text-gray-600 dark:text-gray-300",children:e}),h.jsxs("span",{className:"ml-1 text-gray-500 dark:text-gray-400",children:[" ",t]}),h.jsx("span",{className:`ml-0.5 text-gray-400 group-hover:text-gray-700
                       dark:group-hover:text-gray-200`,children:n?"⌃":"⌄"})]})}function Dr({entities:e,showAttributes:t,openRows:n,onToggleRow:i,classLink:s}){const r=o=>h.jsxs(h.Fragment,{children:[s(o.declaredOn),h.jsxs("span",{className:"text-gray-400",children:[".",o.slotName]}),h.jsxs("span",{className:"ml-1.5 text-gray-400",children:[" ",Wr(o.required,o.multivalued)]}),o.isLoop&&h.jsx("span",{className:"ml-1",style:{color:He.entity},children:"loop"})]});return h.jsx("ul",{className:`mt-1 mb-1.5 space-y-0.5 font-mono text-[10px]
                   text-gray-600 dark:text-gray-400`,children:e.map(o=>{const a=n.has(o.entity)?!t:t,c=a&&o.pairs.length===1;return h.jsxs("li",{children:[h.jsx("span",{className:"text-gray-500 dark:text-gray-400",children:s(o.entity)}),c&&h.jsxs(h.Fragment,{children:[h.jsx("span",{className:"text-gray-400",children:": "}),r(o.pairs[0])]}),!c&&h.jsxs("button",{onClick:()=>i(o.entity),"aria-expanded":a,title:a?`Hide ${o.entity}'s attributes`:`List ${o.entity}'s attributes`,className:`group cursor-pointer rounded px-1 -mx-0.5 text-[9px] text-gray-400
                           hover:bg-gray-100 dark:hover:bg-slate-700`,children:[" ",o.pairs.length," ",o.pairs.length===1?"attribute":"attributes",h.jsx("span",{className:"ml-0.5 group-hover:text-gray-700 dark:group-hover:text-gray-200",children:a?"⌃":"⌄"})]}),a&&!c&&h.jsx("ul",{className:"ml-3",children:o.pairs.map(l=>h.jsx("li",{children:r(l)},`${l.declaredOn}.${l.slotName}`))})]},o.entity)})})}function Jm({dataService:e,onClose:t,onSelect:n,offset:i}){const s=b.useMemo(()=>e.getOwnershipPairGroups(),[e]),r=s.filter(p=>p.rule!=="child-following-parent"),o=s.find(p=>p.rule==="child-following-parent"),a=o?Er(o.pairs):[],[c,l]=b.useState(()=>new Map),[u,f]=b.useState(()=>new Map),d=(p,g)=>f(k=>{const v=new Map(k),x=new Set(v.get(p)??[]);return x.delete(g)||x.add(g),v.set(p,x),v}),y=new Set,m=(p,g)=>{l(k=>{const v=new Map(k);return v.get(p)===g?v.delete(p):v.set(p,g),v}),f(k=>{const v=new Map(k);return v.delete(p),v})},w=p=>h.jsx("button",{onClick:()=>n([p]),className:"cursor-pointer hover:underline text-blue-600 dark:text-blue-400",title:`Select ${p}`,children:p});return h.jsxs(Kl,{title:"Legend",subtitle:"What the diagram's arrows, colors and buttons mean.",onClose:t,offset:i,widthRem:Fs.legend,children:[h.jsxs("div",{className:"text-xs",children:[h.jsxs(Dt,{title:"Arrow direction and ownership",children:[h.jsx("p",{className:fn,children:"Edges connect entities in ownership (i.e., containment or has-a) relationships. They start at attribute rows that point to other entities and end at the header of the target entity's box."}),h.jsxs("p",{className:fn,children:["An attribute can target an entity that it ",h.jsx("b",{children:"owns"}),h.jsx(Pr,{kind:"own-fwd"}),"in which case, B appears to the right of A and the edge points forward."]}),h.jsxs("p",{className:fn,children:["Or it can target an entity that it ",h.jsx("b",{children:"belongs to"}),h.jsx(Pr,{kind:"own-bkwd"}),"in which case, B appears to the left of A and the edge points backward."]}),h.jsx("p",{className:"text-[11px] text-gray-500 dark:text-gray-400 mb-1.5",children:"An attribute owns the entity it points at, with two kinds of exception. Click a count to list what the rule applies to."}),h.jsx("ul",{className:"space-y-1",children:r.map(p=>{const g=`${p.verdict}/${p.rule}`,k=Ym[p.verdict],v=Er(p.pairs),x=kc(p.rule)!==void 0;return h.jsxs("li",{className:`border-l-2 pl-2 border-gray-200 dark:border-slate-600${x?" ml-4":""}`,children:[h.jsx("div",{className:k?"font-medium":"font-medium text-gray-400",style:k?{color:k}:void 0,children:p.ruleLabel}),h.jsxs("div",{className:"flex gap-3 mt-0.5",children:[h.jsx(pn,{n:v.length,noun:"entities",open:c.get(g)==="entities",onClick:()=>m(g,"entities")}),h.jsx(pn,{n:p.pairs.length,noun:"attributes",open:c.get(g)==="attributes",onClick:()=>m(g,"attributes")})]}),h.jsx("p",{className:"text-[11px] leading-snug text-gray-600 dark:text-gray-400 mt-0.5",children:p.ruleText}),c.has(g)&&h.jsx(Dr,{entities:v,showAttributes:c.get(g)==="attributes",openRows:u.get(g)??y,onToggleRow:C=>d(g,C),classLink:w})]},g)})})]}),o&&h.jsxs(Dt,{title:"Edges with no attribute behind them",children:[h.jsx("p",{className:fn,children:"An attribute whose target has subclasses accepts any of them, so whatever owns the target owns each subclass too. These edges are induced from a declared one rather than read from an attribute of their own — which is why you can see an edge on the diagram that no attribute row points at."}),h.jsxs("div",{className:"flex gap-3",children:[h.jsx(pn,{n:a.length,noun:"entities",open:c.get("induced")==="entities",onClick:()=>m("induced","entities")}),h.jsx(pn,{n:o.pairs.length,noun:"attributes",open:c.get("induced")==="attributes",onClick:()=>m("induced","attributes")})]}),c.has("induced")&&h.jsx(Dr,{entities:a,showAttributes:c.get("induced")==="attributes",openRows:u.get("induced")??y,onToggleRow:p=>d("induced",p),classLink:w})]}),h.jsx(Dt,{title:"Cardinality",children:h.jsx("ul",{className:"flex flex-wrap gap-x-4 gap-y-1",children:Zm.map(([p,g])=>h.jsxs("li",{className:"flex items-center gap-1.5",children:[h.jsx("span",{className:"font-mono text-[11px] text-gray-700 dark:text-gray-300",children:p}),h.jsx("span",{className:"text-[11px] text-gray-500 dark:text-gray-400",children:g})]},p))})}),h.jsxs(Dt,{title:"Colors",children:[h.jsx(Mr,{caption:"A row's dot and its range label say what KIND of thing the attribute points at.",items:[{color:He.entity,label:"another entity"},{color:He.enum,label:"a value set"},{color:He.dataType,label:"a data type"}]}),h.jsxs("p",{className:"text-[11px] leading-snug text-gray-600 dark:text-gray-400 mt-2",children:["A ",h.jsx("b",{children:"filled"})," dot draws an edge; a ",h.jsx("b",{children:"hollow"})," one does not, because what it points at is not on the canvas. Only entity ranges can draw edges at all."]}),h.jsx(Mr,{className:"mt-3",caption:"Inside a merged box, a color says which entity an attribute belongs to.",items:zr.slice(0,4).map((p,g)=>({color:p.text,swatch:p.fill,label:g===0?"the parent":`child ${g}`}))})]}),h.jsx(Dt,{title:"The toolbar",children:h.jsx("ul",{className:"space-y-1",children:Xm.map(p=>h.jsxs("li",{className:"flex gap-2",children:[h.jsx("span",{className:"shrink-0 font-mono text-[11px] text-gray-700 dark:text-gray-300 w-20",children:p.glyph}),h.jsx("span",{className:"text-[11px] leading-snug text-gray-600 dark:text-gray-400",children:p.what})]},p.glyph))})})]}),h.jsxs("p",{className:"text-[10px] text-gray-400 dark:text-gray-500 mt-3",children:["A box's ",h.jsx("b",{children:"“N related”"})," count is of distinct classes"," ",h.jsx("i",{children:"outside"})," it, so selecting a class that folds into a merged box can make the number go ",h.jsx("i",{children:"down"}),". Correct, if counter-intuitive."]})]})}function Dt({title:e,children:t}){return h.jsxs("section",{className:"mb-4 last:mb-1",children:[h.jsx("h3",{className:`text-[11px] font-semibold uppercase tracking-wider
                     text-gray-400 dark:text-gray-500 mb-1`,children:e}),t]})}function Mr({caption:e,items:t,className:n}){return h.jsxs("div",{className:n,children:[h.jsx("p",{className:"text-[11px] text-gray-500 dark:text-gray-400 mb-1",children:e}),h.jsx("ul",{className:"flex flex-wrap gap-x-3 gap-y-1",children:t.map(i=>h.jsxs("li",{className:"flex items-center gap-1",children:[h.jsx("span",{className:"inline-block w-3 h-3 rounded-sm border",style:{background:i.swatch??i.color,borderColor:i.color}}),h.jsx("span",{className:"text-[11px]",style:{color:i.color},children:i.label})]},i.label))})]})}const eg=!1,tg=!1,Ql=b.createContext(null);function ht(){const e=b.useContext(Ql);if(!e)throw new Error("useHelp must be used inside <HelpProvider>");return e}const ng=300,ig=[{id:"graph-canvas-reading",label:"Reading the diagram"},{id:"relation-bar",label:"The relation bar"},{id:"merged-boxes",label:"Inheritance and merged boxes"},{id:"node-dismiss",label:"Closing a box"},{id:"copy-link",label:"Sharing what you see"}];function sg({onOpenLegend:e,onOpenCases:t,legendOpen:n,casesOpen:i,onClosePanels:s,anyPanelOpen:r}){const{showEntry:o,showAddresses:a,toggleAddresses:c}=ht(),[l,u]=b.useState(!1),f=b.useRef(void 0),d=()=>{f.current!==void 0&&(clearTimeout(f.current),f.current=void 0)},y=()=>{d(),f.current=setTimeout(()=>u(!1),ng)};b.useEffect(()=>d,[]),b.useEffect(()=>{if(!l)return;const w=g=>{g.target?.closest("[data-help-menu]")||u(!1)},p=g=>{g.key==="Escape"&&u(!1)};return document.addEventListener("mousedown",w,!0),document.addEventListener("keydown",p),()=>{document.removeEventListener("mousedown",w,!0),document.removeEventListener("keydown",p)}},[l]);const m=w=>()=>{u(!1),w()};return h.jsxs("span",{"data-help-menu":!0,"data-help-id":"help-menu",className:"relative",onMouseEnter:()=>{d(),u(!0)},onMouseLeave:y,children:[h.jsxs("button",{onClick:()=>u(w=>!w),title:"Legend, example cases and help topics",className:`text-sm underline hover:text-white ${l?"text-white":"text-blue-100"}`,children:["Help ",h.jsx("span",{"aria-hidden":!0,className:"opacity-70",children:"▾"})]}),l&&h.jsxs("div",{className:`absolute right-0 top-full mt-1 z-40 w-60 py-1
                     rounded-md border border-gray-300 dark:border-slate-600
                     bg-white dark:bg-slate-800 shadow-xl
                     text-gray-900 dark:text-gray-100`,children:[h.jsxs(mn,{onClick:m(e),children:[n?"Hide ownership legend":"Ownership legend",h.jsx(gi,{children:"every relationship in the schema, by rule"})]}),h.jsxs(mn,{onClick:m(t),children:[i?"Hide example cases":"Example cases",h.jsx(gi,{children:"selections worth looking at"})]}),r&&h.jsxs(mn,{onClick:m(s),children:["Close all panels",h.jsx(gi,{children:"legend, cases and the detail drawer"})]}),h.jsx(og,{}),ig.map(w=>h.jsx(mn,{onClick:m(()=>o(w.id)),children:w.label},w.id)),tg]})]})}function mn({onClick:e,children:t}){return h.jsx("button",{onClick:e,className:`block w-full text-left px-3 py-1.5 text-xs
                 hover:bg-gray-100 dark:hover:bg-slate-700`,children:t})}function gi({children:e}){return h.jsx("span",{className:"block text-[10px] text-gray-400 dark:text-gray-500",children:e})}function og(){return h.jsx("div",{className:"my-1 border-t border-gray-200 dark:border-slate-700"})}function ql(e){const t=Number(e?.trim());return Number.isFinite(t)&&t>=240?t:void 0}function Yl(e){const t=e?.trim().toLowerCase();return t==="dim"||t==="ring"||t==="none"?t:void 0}function Xl(e){const t=e?.trim().toLowerCase();return t==="left"||t==="right"||t==="top"||t==="bottom"?t:void 0}function Zl(e){const t=e?.trim();if(!t)return;const n=Number(t);if(Number.isFinite(n))return{px:n};const i=t.match(/^(-)?(?:anchor|parentBox)\.(width|height)(?:\s*\*\s*(-?[\d.]+))?$/i);if(!i)return;const[,s,r,o]=i,a=o===void 0?1:Number(o);if(Number.isFinite(a))return{of:r.toLowerCase(),times:s?-a:a}}function zt(e,t){const n=e?.trim();if(!n)return{kind:"help-id",arg:t};if(n==="none")return{kind:"none"};const i=n.indexOf(":");return i===-1?{kind:"help-id",arg:n}:{kind:n.slice(0,i).trim(),arg:n.slice(i+1).trim()}}const rg="Format",ag="Walkthrough",lg=new Set([rg,"TODO"]),Jl=/^<\/?(?:details|summary)\b[^>]*>$/i;function xe(e,t){const n=t.toLowerCase();for(const i of e){const s=Pt(i);if(s){if(s.name==="beats"&&n!=="beats")return;if(s.name===n&&!s.parked)return s.value}}}function Pt(e){const t=e.trimStart().match(/^-\s+(.*)$/);if(!t)return;let n=t[1].replace(/\*\*/g,"").trim(),i=!1;if(n.startsWith("~~")){const o=n.indexOf("~~",2);if(o===-1)return;i=!0,n=o===n.length-2?n.slice(2,o):`${n.slice(2,o)}${n.slice(o+2)}`}const s=n.indexOf(":");if(s===-1)return;const r=n.slice(0,s).trim();if(/^[A-Za-z_][A-Za-z0-9_]*$/.test(r))return{name:r.toLowerCase(),value:n.slice(s+1).trim(),parked:i}}const _s=e=>{const t=Pt(e);return t&&!t.parked?t.name:void 0},cg=new Set(["title","description","interactions","shortcut","context","anchor","spotlight","action","once","change","only","highlight","width","position","offsetx","tour","beats"]),ug=new Set(["description","anchor","spotlight","action","change","only","highlight","width","position","offsetx","keep"]),hg=new Set(["tourmetadata","tourabbr","description"]);function ec(e,t,n,i){for(const s of e){if(!Kn(s))continue;const r=Pt(s);!r.parked&&!t.has(r.name)&&i.push(`${n}: unknown field "${r.name}" (a misspelling? to park a field, strike it through: ~~${r.name}:~~)`)}}function Kn(e){return e.length>0&&!/^\s/.test(e)&&Pt(e)!==void 0}function tc(e,t){const n=t.toLowerCase(),i=e.findIndex(l=>_s(l)===n);if(i===-1)return;const s=Pt(e[i]).value,r=[];for(let l=i+1;l<e.length&&!(Kn(e[l])||Jl.test(e[l].trim()));l++)r.push(e[l]);for(;r.length&&r[r.length-1].trim()==="";)r.pop();if(r.length===0)return s;const o=r.filter(l=>l.trim()!=="").map(l=>l.length-l.trimStart().length),a=Math.min(...o),c=r.map(l=>l.slice(a)).join(`
`);return s?`${s}
${c}`:c}function dg(e,t){const n=t.toLowerCase(),i=e.findIndex(r=>_s(r)===n);if(i===-1)return[];const s=[];for(let r=i+1;r<e.length;r++){const o=e[r].trimStart();if(Kn(e[r])||o==="")break;o.startsWith("- ")&&s.push(o.slice(2).trim())}return s}function fg(e,t,n){const i=e.findIndex(a=>_s(a)==="beats");if(i===-1)return;const s=[];let r=null;const o=()=>{r&&s.push(r)};for(let a=i+1;a<e.length;a++){const c=e[a].trimStart();if(Kn(e[a])||e[a].length>0&&!/^\s/.test(e[a])&&/^<\/?[a-z]/i.test(c))break;if(c==="")continue;const l=c.match(/^(\d+)\.\s+(.*)$/);if(l){o(),r={text:l[2].trim()};continue}const u=Pt(c);if(!u?.parked){if(u&&r){const{name:f,value:d}=u;if(!ug.has(f)){n.push(`${t} beat ${s.length+1}: unknown field "${f}" (a misspelling? to park a field, strike it through: ~~${f}:~~)`);continue}if(f==="description"){const y=e[a].length-e[a].trimStart().length,m=[];let w=a+1;for(;w<e.length;w++){if(e[w].trim()===""){m.push("");continue}if(e[w].length-e[w].trimStart().length<=y)break;m.push(e[w])}for(;m.length&&m[m.length-1].trim()==="";)m.pop();if(m.length){const p=m.filter(v=>v.trim()!=="").map(v=>v.length-v.trimStart().length),g=Math.min(...p),k=m.map(v=>v.slice(g)).join(`
`);r.description=d?`${d}
${k}`:k}else r.description=d;a=w-1;continue}f==="anchor"?r.anchor=zt(d,t):f==="spotlight"?r.spotlight=zt(d,t):f==="action"?r.action=d.trim():f==="change"?r.change=d.trim():f==="only"?(r.change=d.trim(),r.replace=!0):f==="highlight"?r.highlight=Yl(d):f==="width"?r.width=ql(d):f==="position"?r.position=Xl(d):f==="offsetx"?r.offsetX=Zl(d):f==="keep"&&(r.keep=d.trim()!=="false");continue}r&&!c.startsWith("-")&&(r.text=`${r.text} ${c}`.trim())}}return o(),s.length>0?s:void 0}function pg(e,t,n){const i=e.split(`
`),r=i[0].match(/^###\s+(.+)$/);if(!r)return null;const o=r[1].trim();ec(i,cg,o,n);const a=xe(i,"Title")??o,c=tc(i,"Description")??"",l=dg(i,"Interactions"),u=xe(i,"Shortcut"),f=xe(i,"Context"),d=zt(xe(i,"Anchor"),o),y=xe(i,"Spotlight"),m=y===void 0?void 0:zt(y,o),w=xe(i,"Action"),p=xe(i,"Once"),g=xe(i,"Only"),k=xe(i,"Change"),v=k??g,x=k===void 0&&g!==void 0?!0:void 0,C=Yl(xe(i,"Highlight")),D=ql(xe(i,"Width")),T=Xl(xe(i,"Position")),P=Zl(xe(i,"OffsetX")),E=fg(i,o,n),L=xe(i,"Tour");return{id:o,title:a,description:c,interactions:l,shortcut:u,context:f,anchor:d,action:w,once:p,change:v,replace:x,highlight:C,width:D,position:T,offsetX:P,tour:L===void 0?void 0:L||ag,order:t,beats:E,...m?{spotlight:m}:{}}}function mg(e,t,n){const i=e.split(`
`),s=i.findIndex(m=>/^##\s+/.test(m)),r=s===-1?null:i[s].match(/^##\s+(.+)$/),o=r?r[1].trim():"Unknown",a=o.toLowerCase().replace(/[^a-z0-9]+/g,"-"),c=[];for(let m=s+1;m<i.length&&!i[m].startsWith("### ");m++)Jl.test(i[m].trim())||c.push(i[m]);const l=c.join(`
`).trim();ec(c,hg,`section "${o}"`,n);const u=xe(c,"TourMetadata"),f=u===void 0?void 0:{name:u||o,description:tc(c,"Description")?.trim()??"",abbr:xe(c,"TourAbbr")?.trim()||void 0},d=[],y=e.split(/(?=^### )/m);for(const m of y){if(!m.startsWith("### "))continue;const w=pg(m.trim(),t(),n);w&&d.push(w)}return{id:a,title:o,body:l,entries:d,tourMeta:f}}function os(e){const t=new Set;for(const n of[...e.entries.values()].sort((i,s)=>i.order-s.order))n.tour&&t.add(n.tour);return[...t]}function nc(e,t){const n=t??os(e)[0];return[...e.entries.values()].filter(i=>i.tour!==void 0&&i.tour===n).sort((i,s)=>i.order-s.order)}function yi(e,t){return t<0?e:`${e} ▸${t+1}`}function bi(e){return`### ${e}`}function rs(e,t){const n=[];return nc(e,t).forEach((i,s)=>{const r=s+1;if(!i.beats||i.beats.length===0){n.push({entry:i,step:r,beatIndex:0,beatCount:0,address:yi(i.id,-1),searchFor:bi(i.id),blocks:[i.description],text:i.description,anchor:i.anchor,...i.spotlight?{spotlight:i.spotlight}:{},action:i.action,change:i.change,replace:i.replace,highlight:i.highlight,width:i.width,position:i.position,offsetX:i.offsetX});return}let o=i.description?[i.description]:[];o.length>0&&n.push({entry:i,step:r,beatIndex:-1,beatCount:i.beats.length,address:yi(i.id,-1),searchFor:bi(i.id),blocks:o,text:o.join(`

`),anchor:i.anchor,...i.spotlight?{spotlight:i.spotlight}:{},action:i.action,change:i.change,replace:i.replace,highlight:i.highlight,width:i.width,position:i.position,offsetX:i.offsetX});let a=i.width;i.beats.forEach((c,l)=>{const u=c.description??"";o=c.keep?[...o,u]:[u],c.width!==void 0&&(a=c.width),n.push({entry:i,step:r,beatIndex:l,beat:c,beatCount:i.beats.length,address:yi(i.id,l),searchFor:bi(i.id),blocks:o,text:o.join(`

`),anchor:c.anchor??i.anchor,...c.spotlight??i.spotlight?{spotlight:c.spotlight??i.spotlight}:{},action:c.action,highlight:c.highlight??i.highlight,width:a,position:c.position??i.position,offsetX:c.offsetX??i.offsetX,change:c.change,replace:c.replace})})}),n}function gg(e){const n=e.replace(/<!--[\s\S]*?-->/g,"").trim().split(/(?=^## )/m).map(c=>c.trim()).filter(Boolean),i=[],s=new Map,r=[];let o=0;for(const c of n){if(!c.match(/^## /m))continue;const l=c.match(/^##\s+(.+)$/m)?.[1].trim();if(l&&lg.has(l))continue;const u=mg(c,()=>o++,r);i.push(u);for(const f of u.entries)s.set(f.id,f)}const a=new Map;for(const c of i)c.tourMeta&&a.set(c.tourMeta.name,c.tourMeta);return r.length&&console.warn(`[help-content] ${r.length} problem(s):
  ${r.join(`
  `)}`),{sections:i,entries:s,tourMeta:a,problems:r}}const yg=/\{\{\s*([a-z][a-z0-9-]*)\s*:\s*([^}]*?)\s*\}\}/gi;function bg(e,t){return!t||!e.includes("{{")?e:e.replace(yg,(n,i,s)=>t[i.toLowerCase()]?.(s)??n)}function Or(e){const t=new Set;return e.map((n,i)=>({p:n,index:i})).filter(({p:n})=>t.has(n.step)?!1:(t.add(n.step),!0)).map(({p:n,index:i})=>({index:i,step:n.step,title:n.entry.title,beatCount:n.beatCount}))}function ic({scope:e,onClose:t}){const{content:n,tours:i,tourMeta:s,tourName:r,tourIndex:o,positions:a,position:c,goToStep:l,startTour:u}=ht();b.useEffect(()=>{const p=g=>{g.key==="Escape"&&(g.stopPropagation(),g.preventDefault(),t())};return window.addEventListener("keydown",p,!0),()=>window.removeEventListener("keydown",p,!0)},[t]);const f=b.useRef(null);b.useEffect(()=>{const p=f.current;if(!(!p||typeof p.showPopover!="function"))return p.showPopover(),()=>{p.matches(":popover-open")&&p.hidePopover()}},[]);const d=b.useMemo(()=>e==="all"?i.map(p=>({name:p,rows:Or(rs(n,p))})):[],[e,i,n]),y=c?.step,m=o===null?void 0:r,w=(p,g,k)=>h.jsxs("button",{onClick:k,"aria-current":g?"step":void 0,className:`help-map-step${g?" help-map-step-here":""}`,children:[h.jsx("span",{className:"help-map-num",children:p.step}),h.jsx("span",{className:"help-map-title",children:p.title}),p.beatCount>0&&h.jsx("span",{className:"help-map-beats",title:`${p.beatCount+1} screens in this step`,children:p.beatCount+1})]},p.index);return _r.createPortal(h.jsx("div",{ref:f,popover:"manual",className:"help-map-backdrop",onMouseDown:t,children:h.jsxs("div",{role:"dialog","aria-label":e==="all"?"All tours":"Tour outline",className:"help-map",onMouseDown:p=>p.stopPropagation(),children:[h.jsxs("div",{className:"help-map-head",children:[h.jsxs("div",{children:[h.jsx("h2",{children:e==="all"?"Tours":m??"This tour"}),h.jsx("p",{children:e==="all"?"Every guided walk, and what is in it. Click any step to start there.":"Click any step to jump to it."})]}),h.jsx("button",{onClick:t,title:"Close (Esc)",className:"help-map-close",children:"✕"})]}),h.jsx("div",{className:"help-map-body",children:e==="tour"?Or(a).map(p=>w(p,p.step===y,()=>{l(p.index),t()})):d.map(({name:p,rows:g})=>h.jsxs("section",{className:"help-map-tour",children:[h.jsx("button",{className:"help-map-tourname",onClick:()=>{u(p),t()},children:p}),s.get(p)?.description&&h.jsx("p",{className:"help-map-blurb",children:s.get(p).description}),g.map(k=>w(k,m===p&&k.step===y,()=>{m===p?l(k.index):u(p,k.index),t()}))]},p))})]})}),document.body)}function wg(){const{tours:e,tourMeta:t,startTour:n}=ht(),[i,s]=b.useState(!1),{overviewOpen:r,setOverviewOpen:o}=ht(),a=b.useRef(null);return b.useEffect(()=>{if(!i)return;const c=u=>{u.target?.closest("[data-tour-chooser]")||s(!1)},l=u=>{u.key==="Escape"&&s(!1)};return document.addEventListener("mousedown",c,!0),document.addEventListener("keydown",l),()=>{document.removeEventListener("mousedown",c,!0),document.removeEventListener("keydown",l)}},[i]),e.length===0?null:h.jsxs("span",{"data-tour-chooser":!0,"data-help-id":"tour-chooser",className:"relative",onMouseEnter:()=>s(!0),children:[h.jsx("button",{onClick:()=>{s(!1),o(!0)},title:"Guided walks through the app and the model; click for the overview",className:`text-sm font-semibold px-2.5 py-1 rounded-full bg-white/95
                   text-blue-700 shadow-sm hover:bg-white hover:shadow`,children:"Guided tours"}),i&&h.jsxs("div",{ref:a,role:"dialog","aria-label":"Guided tours",className:`absolute right-0 top-full mt-1 z-40 w-80 p-1
                     rounded-md border border-gray-300 dark:border-slate-600
                     bg-white dark:bg-slate-800 shadow-xl
                     text-gray-900 dark:text-gray-100`,children:[h.jsxs("p",{className:"px-3 pt-2 pb-1 text-[11px] text-gray-500 dark:text-gray-400",children:["Each one stands on its own. Leave any tour with ",h.jsx("kbd",{children:"Esc"}),"."]}),h.jsxs("button",{"data-tour-overview":!0,onClick:()=>{s(!1),o(!0)},className:`block w-full text-left px-3 py-2 rounded
                       hover:bg-gray-100 dark:hover:bg-slate-700`,children:[h.jsx("span",{className:"block text-xs font-semibold",children:"Overview"}),h.jsxs("span",{className:"block text-[11px] text-gray-500 dark:text-gray-400",children:["All ",e.length," tours and every step in them — start anywhere."]})]}),h.jsx("div",{className:"my-1 border-t border-gray-200 dark:border-slate-700"}),e.map(c=>h.jsxs("button",{onClick:()=>{s(!1),n(c)},className:`block w-full text-left px-3 py-2 rounded
                         hover:bg-gray-100 dark:hover:bg-slate-700`,children:[h.jsx("span",{className:"block text-xs font-semibold",children:c}),t.get(c)?.description&&h.jsx("span",{className:"block text-[11px] text-gray-500 dark:text-gray-400",children:t.get(c).description})]},c))]}),r&&h.jsx(ic,{scope:"all",onClose:()=>o(!1)})]})}const xg="dmvd.help.showAddresses";function vg(){const e=document.activeElement;return e instanceof HTMLInputElement||e instanceof HTMLTextAreaElement||e?.getAttribute("contenteditable")==="true"}function kg(e,t){if(!t)return e;const n=r=>bg(r,t),i=r=>r===void 0?void 0:n(r),s=new Map([...e.entries].map(([r,o])=>[r,{...o,description:n(o.description),interactions:o.interactions.map(n),action:i(o.action),context:i(o.context),beats:o.beats?.map(a=>({...a,description:i(a.description),action:i(a.action)}))}]));return{sections:e.sections.map(r=>({...r,entries:r.entries.map(o=>s.get(o.id)??o),tourMeta:r.tourMeta&&{...r.tourMeta,description:n(r.tourMeta.description)}})),entries:s,tourMeta:new Map([...e.tourMeta].map(([r,o])=>[r,{...o,description:n(o.description)}]))}}function Tg({markdown:e,onPushChange:t,onPopChange:n,onJumpChanges:i,onTourStart:s,onTourEnd:r,textResolvers:o,widgets:a,colors:c,centerOn:l,children:u}){const[f,d]=b.useState(),y=f??o,m=b.useMemo(()=>kg(gg(e),y),[e,y]),[w,p]=b.useState(!1),[g,k]=b.useState(null),[v,x]=b.useState(void 0),[C,D]=b.useState(!1),T=b.useMemo(()=>os(m),[m]),P=b.useMemo(()=>rs(m,v),[m,v]),E=b.useMemo(()=>nc(m,v).length,[m,v]),[L,I]=b.useState(null),[B,O]=b.useState(()=>!1),F=b.useCallback(()=>{O(Q=>{const q=!Q;try{window.localStorage.setItem(xg,q?"1":"0")}catch{}return q})},[]),S=b.useCallback(()=>{p(!1),I(null)},[]),z=b.useCallback(()=>I(null),[]),fe=b.useCallback(Q=>I(Q),[]),N=b.useCallback(Q=>{const q=P[Q];q&&(k(Q),I(q.entry.id),q.change!=null&&t&&t(q.change,q.replace))},[P,t]),G=b.useCallback(Q=>{P[Q+1]?.change!=null&&n&&n();const ne=P[Q];ne&&(k(Q),I(ne.entry.id))},[P,n]),j=b.useCallback(Q=>{if(g===null||Q===g)return;const q=P[Q];if(q&&i){if(Q>g){const ne=P.slice(g+1,Q+1).filter(ae=>ae.change!=null).map(ae=>({query:ae.change,replace:ae.replace}));i(ne,0)}else{const ne=P.slice(Q+1,g+1).filter(ae=>ae.change!=null).length;i([],ne)}k(Q),I(q.entry.id)}},[g,P,i]),X=b.useCallback((Q=os(m)[0],q=0)=>{p(!1),x(Q);const ne=rs(m,Q),ae=Math.min(Math.max(q,0),Math.max(ne.length-1,0)),we=ne[ae];if(!we)return;s?.(),k(ae),I(we.entry.id);const Le=ne.slice(0,ae+1).filter(Ne=>Ne.change!=null).map(Ne=>({query:Ne.change,replace:Ne.replace}));ae>0&&i?i(Le,0):we.change!=null&&t&&t(we.change,we.replace)},[m,t,i,s]),oe=b.useCallback(()=>{k(null),I(null),x(void 0),r?.()},[r]),re=b.useCallback(()=>{g!==null&&(g+1>=P.length?oe():N(g+1))},[g,P.length,N,oe]),Me=b.useCallback(()=>{g!==null&&g>0&&G(g-1)},[g,G]),be=b.useCallback(()=>{g!==null&&oe(),I(null)},[g,oe]),Pe=b.useCallback(Q=>{if(!Q)return null;const{kind:q}=Q;if(q==="none")return null;const{arg:ne}=Q,ae=q==="help-id"?ne:`${q}:${ne}`,we=document.querySelectorAll(`[data-help-id="${CSS.escape(ae)}"]`);return we.length<2?we[0]??null:[...we].find(Le=>Le.getBoundingClientRect().height>0)??we[0]},[]);b.useEffect(()=>(document.body.classList.toggle("help-mode",w),()=>{document.body.classList.remove("help-mode")}),[w]),b.useEffect(()=>{if(w)return window.addEventListener("blur",S),()=>window.removeEventListener("blur",S)},[w,S]),b.useEffect(()=>{if(!w)return;function Q(q){const ne=q.target;if(!ne)return;const ae=ne.closest("[data-help-id]");ae?(q.stopPropagation(),q.preventDefault(),fe(ae.getAttribute("data-help-id"))):ne.closest("[data-help-popover]")||z()}return document.addEventListener("click",Q,!0),()=>document.removeEventListener("click",Q,!0)},[w,fe,z]),b.useEffect(()=>{function Q(q){if(q.key==="?"&&!vg()){q.preventDefault(),g===null?D(ne=>!ne):oe();return}if(q.key==="Escape"&&(w||g!==null||L)){q.preventDefault(),q.stopPropagation(),L&&g===null?z():g!==null?oe():be();return}g!==null&&(q.key==="ArrowRight"&&(q.preventDefault(),re()),q.key==="ArrowLeft"&&(q.preventDefault(),Me()))}return document.addEventListener("keydown",Q,!0),()=>document.removeEventListener("keydown",Q,!0)},[w,g,L,be,z,oe,re,Me]);const ve=b.useCallback(()=>l?Pe(zt(l,l))?.getBoundingClientRect()??null:null,[l,Pe]),Se=b.useMemo(()=>({setTextResolvers:d,helpMode:w,toggleHelpMode:be,exitHelpMode:S,tourIndex:g,startTour:X,endTour:oe,nextStep:re,prevStep:Me,goToStep:j,positions:P,position:g===null?void 0:P[g],stepCount:E,tours:T,tourName:v,tourMeta:m.tourMeta,overviewOpen:C,setOverviewOpen:D,...a?{widgets:a}:{},...c?{colors:c}:{},showAddresses:B,toggleAddresses:F,content:m,activeId:L,showEntry:fe,dismissEntry:z,resolveAnchor:Pe,centerRect:ve}),[w,be,S,g,X,oe,re,Me,j,P,E,T,v,C,a,c,B,F,m,L,fe,z,Pe,ve]);return h.jsx(Ql.Provider,{value:Se,children:u})}function Rr(e,t){const n=String(e);if(typeof t!="string")throw new TypeError("Expected character");let i=0,s=n.indexOf(t);for(;s!==-1;)i++,s=n.indexOf(t,s+t.length);return i}const Sg=["AElig","AMP","Aacute","Acirc","Agrave","Aring","Atilde","Auml","COPY","Ccedil","ETH","Eacute","Ecirc","Egrave","Euml","GT","Iacute","Icirc","Igrave","Iuml","LT","Ntilde","Oacute","Ocirc","Ograve","Oslash","Otilde","Ouml","QUOT","REG","THORN","Uacute","Ucirc","Ugrave","Uuml","Yacute","aacute","acirc","acute","aelig","agrave","amp","aring","atilde","auml","brvbar","ccedil","cedil","cent","copy","curren","deg","divide","eacute","ecirc","egrave","eth","euml","frac12","frac14","frac34","gt","iacute","icirc","iexcl","igrave","iquest","iuml","laquo","lt","macr","micro","middot","nbsp","not","ntilde","oacute","ocirc","ograve","ordf","ordm","oslash","otilde","ouml","para","plusmn","pound","quot","raquo","reg","sect","shy","sup1","sup2","sup3","szlig","thorn","times","uacute","ucirc","ugrave","uml","uuml","yacute","yen","yuml"],jr={0:"�",128:"€",130:"‚",131:"ƒ",132:"„",133:"…",134:"†",135:"‡",136:"ˆ",137:"‰",138:"Š",139:"‹",140:"Œ",142:"Ž",145:"‘",146:"’",147:"“",148:"”",149:"•",150:"–",151:"—",152:"˜",153:"™",154:"š",155:"›",156:"œ",158:"ž",159:"Ÿ"};function sc(e){const t=typeof e=="string"?e.charCodeAt(0):e;return t>=48&&t<=57}function Cg(e){const t=typeof e=="string"?e.charCodeAt(0):e;return t>=97&&t<=102||t>=65&&t<=70||t>=48&&t<=57}function Ag(e){const t=typeof e=="string"?e.charCodeAt(0):e;return t>=97&&t<=122||t>=65&&t<=90}function Lr(e){return Ag(e)||sc(e)}const Pg=["","Named character references must be terminated by a semicolon","Numeric character references must be terminated by a semicolon","Named character references cannot be empty","Numeric character references cannot be empty","Named character references must be known","Numeric character references cannot be disallowed","Numeric character references cannot be outside the permissible Unicode range"];function Hs(e,t){const n=t||{},i=typeof n.additional=="string"?n.additional.charCodeAt(0):n.additional,s=[];let r=0,o=-1,a="",c,l;n.position&&("start"in n.position||"indent"in n.position?(l=n.position.indent,c=n.position.start):c=n.position);let u=(c?c.line:0)||1,f=(c?c.column:0)||1,d=m(),y;for(r--;++r<=e.length;)if(y===10&&(f=(l?l[o]:0)||1),y=e.charCodeAt(r),y===38){const g=e.charCodeAt(r+1);if(g===9||g===10||g===12||g===32||g===38||g===60||Number.isNaN(g)||i&&g===i){a+=String.fromCharCode(y),f++;continue}const k=r+1;let v=k,x=k,C;if(g===35){x=++v;const O=e.charCodeAt(x);O===88||O===120?(C="hexadecimal",x=++v):C="decimal"}else C="named";let D="",T="",P="";const E=C==="named"?Lr:C==="decimal"?sc:Cg;for(x--;++x<=e.length;){const O=e.charCodeAt(x);if(!E(O))break;P+=String.fromCharCode(O),C==="named"&&Sg.includes(P)&&(D=P,T=Xs(P))}let L=e.charCodeAt(x)===59;if(L){x++;const O=C==="named"?Xs(P):!1;O&&(D=P,T=O)}let I=1+x-k,B="";if(!(!L&&n.nonTerminated===!1))if(!P)C!=="named"&&w(4,I);else if(C==="named"){if(L&&!T)w(5,1);else if(D!==P&&(x=v+D.length,I=1+x-v,L=!1),!L){const O=D?1:3;if(n.attribute){const F=e.charCodeAt(x);F===61?(w(O,I),T=""):Lr(F)?T="":w(O,I)}else w(O,I)}B=T}else{L||w(2,I);let O=Number.parseInt(P,C==="hexadecimal"?16:10);if(Eg(O))w(7,I),B="�";else if(O in jr)w(6,I),B=jr[O];else{let F="";Dg(O)&&w(6,I),O>65535&&(O-=65536,F+=String.fromCharCode(O>>>10|55296),O=56320|O&1023),B=F+String.fromCharCode(O)}}if(B){p(),d=m(),r=x-1,f+=x-k+1,s.push(B);const O=m();O.offset++,n.reference&&n.reference.call(n.referenceContext||void 0,B,{start:d,end:O},e.slice(k-1,x)),d=O}else P=e.slice(k-1,x),a+=P,f+=P.length,r=x-1}else y===10&&(u++,o++,f=0),Number.isNaN(y)?p():(a+=String.fromCharCode(y),f++);return s.join("");function m(){return{line:u,column:f,offset:r+((c?c.offset:0)||0)}}function w(g,k){let v;n.warning&&(v=m(),v.column+=k,v.offset+=k,n.warning.call(n.warningContext||void 0,Pg[g],v,g))}function p(){a&&(s.push(a),n.text&&n.text.call(n.textContext||void 0,a,{start:d,end:m()}),a="")}}function Eg(e){return e>=55296&&e<=57343||e>1114111}function Dg(e){return e>=1&&e<=8||e===11||e>=13&&e<=31||e>=127&&e<=159||e>=64976&&e<=65007||(e&65535)===65535||(e&65535)===65534}const Mg=/["&'<>`]/g,Og=/[\uD800-\uDBFF][\uDC00-\uDFFF]/g,Rg=/[\x01-\t\v\f\x0E-\x1F\x7F\x81\x8D\x8F\x90\x9D\xA0-\uFFFF]/g,jg=/[|\\{}()[\]^$+*?.]/g,Nr=new WeakMap;function Lg(e,t){if(e=e.replace(t.subset?Ng(t.subset):Mg,i),t.subset||t.escapeOnly)return e;return e.replace(Og,n).replace(Rg,i);function n(s,r,o){return t.format((s.charCodeAt(0)-55296)*1024+s.charCodeAt(1)-56320+65536,o.charCodeAt(r+2),t)}function i(s,r,o){return t.format(s.charCodeAt(0),o.charCodeAt(r+1),t)}}function Ng(e){let t=Nr.get(e);return t||(t=Vg(e),Nr.set(e,t)),t}function Vg(e){const t=[];let n=-1;for(;++n<e.length;)t.push(e[n].replace(jg,"\\$&"));return new RegExp("(?:"+t.join("|")+")","g")}function Ig(e){return"&#x"+e.toString(16).toUpperCase()+";"}function Bg(e,t){return Lg(e,Object.assign({format:Ig},t))}const $g={}.hasOwnProperty,Fg={},Vr=/^[^\t\n\r "#'.<=>`}]+$/,_g=/^[^\t\n\r "'<=>`}]+$/;function Hg(){return{canContainEols:["textDirective"],enter:{directiveContainer:zg,directiveContainerAttributes:xi,directiveContainerLabel:Kg,directiveLeaf:Gg,directiveLeafAttributes:xi,directiveText:Ug,directiveTextAttributes:xi},exit:{directiveContainer:Ai,directiveContainerAttributeClassValue:ki,directiveContainerAttributeIdValue:vi,directiveContainerAttributeName:Si,directiveContainerAttributeValue:Ti,directiveContainerAttributes:Ci,directiveContainerLabel:Qg,directiveContainerName:wi,directiveLeaf:Ai,directiveLeafAttributeClassValue:ki,directiveLeafAttributeIdValue:vi,directiveLeafAttributeName:Si,directiveLeafAttributeValue:Ti,directiveLeafAttributes:Ci,directiveLeafName:wi,directiveText:Ai,directiveTextAttributeClassValue:ki,directiveTextAttributeIdValue:vi,directiveTextAttributeName:Si,directiveTextAttributeValue:Ti,directiveTextAttributes:Ci,directiveTextName:wi}}}function Wg(e){const t=Fg;if(t.quote!=='"'&&t.quote!=="'"&&t.quote!==null&&t.quote!==void 0)throw new Error("Invalid quote `"+t.quote+"`, expected `'` or `\"`");return n.peek=qg,{handlers:{containerDirective:n,leafDirective:n,textDirective:n},unsafe:[{character:"\r",inConstruct:["leafDirectiveLabel","containerDirectiveLabel"]},{character:`
`,inConstruct:["leafDirectiveLabel","containerDirectiveLabel"]},{before:"[^:]",character:":",after:"[A-Za-z]",inConstruct:["phrasing"]},{atBreak:!0,character:":",after:":"}]};function n(r,o,a,c){const l=a.createTracker(c),u=Yg(r),f=a.enter(r.type);let d=l.move(u+(r.name||"")),y;if(r.type==="containerDirective"){const m=(r.children||[])[0];y=Ir(m)?m:void 0}else y=r;if(y&&y.children&&y.children.length>0){const m=a.enter("label"),w=`${r.type}Label`,p=a.enter(w);d+=l.move("["),d+=l.move(a.containerPhrasing(y,{...l.current(),before:d,after:"]"})),d+=l.move("]"),p(),m()}if(d+=l.move(i(r,a)),r.type==="containerDirective"){const m=(r.children||[])[0];let w=r;Ir(m)&&(w=Object.assign({},r,{children:r.children.slice(1)})),w&&w.children&&w.children.length>0&&(d+=l.move(`
`),d+=l.move(a.containerFlow(w,l.current()))),d+=l.move(`
`+u)}return f(),d}function i(r,o){const a=r.attributes||{},c=[];let l,u,f,d;for(d in a)if($g.call(a,d)&&a[d]!==void 0&&a[d]!==null){const y=String(a[d]);if(d==="id")f=t.preferShortcut!==!1&&Vr.test(y)?"#"+y:s("id",y,r,o);else if(d==="class"){const m=y.split(/[\t\n\r ]+/g),w=[],p=[];let g=-1;for(;++g<m.length;)(t.preferShortcut!==!1&&Vr.test(m[g])?p:w).push(m[g]);l=w.length>0?s("class",w.join(" "),r,o):"",u=p.length>0?"."+p.join("."):""}else c.push(s(d,y,r,o))}return l&&c.unshift(l),u&&c.unshift(u),f&&c.unshift(f),c.length>0?"{"+c.join(" ")+"}":""}function s(r,o,a,c){if(t.collapseEmptyAttributes!==!1&&!o)return r;if(t.preferUnquoted&&_g.test(o))return r+"="+o;const l=t.quote||c.options.quote||'"',u=l==='"'?"'":'"',f=t.quoteSmart&&Rr(o,l)>Rr(o,u)?u:l,d=a.type==="textDirective"?[f]:[f,`
`,"\r"];return r+"="+f+Bg(o,{subset:d})+f}}function zg(e){Ws.call(this,"containerDirective",e)}function Gg(e){Ws.call(this,"leafDirective",e)}function Ug(e){Ws.call(this,"textDirective",e)}function Ws(e,t){this.enter({type:e,name:"",attributes:{},children:[]},t)}function wi(e){const t=this.stack[this.stack.length-1];Gr(t.type==="containerDirective"||t.type==="leafDirective"||t.type==="textDirective"),t.name=this.sliceSerialize(e)}function Kg(e){this.enter({type:"paragraph",data:{directiveLabel:!0},children:[]},e)}function Qg(e){this.exit(e)}function xi(){this.data.directiveAttributes=[],this.buffer()}function vi(e){this.data.directiveAttributes.push(["id",Hs(this.sliceSerialize(e),{attribute:!0})])}function ki(e){this.data.directiveAttributes.push(["class",Hs(this.sliceSerialize(e),{attribute:!0})])}function Ti(e){const t=this.data.directiveAttributes;t[t.length-1][1]=Hs(this.sliceSerialize(e),{attribute:!0})}function Si(e){this.data.directiveAttributes.push([this.sliceSerialize(e),""])}function Ci(){const e=this.data.directiveAttributes,t={};let n=-1;for(;++n<e.length;){const s=e[n];s[0]==="class"&&t.class?t.class+=" "+s[1]:t[s[0]]=s[1]}this.data.directiveAttributes=void 0,this.resume();const i=this.stack[this.stack.length-1];Gr(i.type==="containerDirective"||i.type==="leafDirective"||i.type==="textDirective"),i.attributes=t}function Ai(e){this.exit(e)}function qg(){return":"}function Ir(e){return!!(e&&e.type==="paragraph"&&e.data&&e.data.directiveLabel)}function Yg(e){let t=0;return e.type==="containerDirective"?(Tc(e,function(n,i){if(n.type==="containerDirective"){let s=i.length,r=0;for(;s--;)i[s].type==="containerDirective"&&r++;r>t&&(t=r)}}),t+=3):e.type==="leafDirective"?t=2:t=1,":".repeat(t)}function zs(e,t,n,i,s,r,o,a,c,l,u,f,d,y,m){let w,p;return g;function g(S){return e.enter(i),e.enter(s),e.consume(S),e.exit(s),k}function k(S){return S===35?(w=o,v(S)):S===46?(w=a,v(S)):m&&Yn(S)?Ye(e,k,"whitespace")(S):!m&&nt(S)?Jt(e,k)(S):S===null||Ae(S)||Pn(S)||En(S)&&S!==45&&S!==95?F(S):(e.enter(r),e.enter(c),e.consume(S),D)}function v(S){const z=w+"Marker";return e.enter(r),e.enter(w),e.enter(z),e.consume(S),e.exit(z),x}function x(S){if(S===null||S===34||S===35||S===39||S===46||S===60||S===61||S===62||S===96||S===125||nt(S))return n(S);const z=w+"Value";return e.enter(z),e.consume(S),C}function C(S){if(S===null||S===34||S===39||S===60||S===61||S===62||S===96)return n(S);if(S===35||S===46||S===125||nt(S)){const z=w+"Value";return e.exit(z),e.exit(w),e.exit(r),k(S)}return e.consume(S),C}function D(S){return S===null||Ae(S)||Pn(S)||En(S)&&S!==45&&S!==46&&S!==58&&S!==95?(e.exit(c),m&&Yn(S)?Ye(e,T,"whitespace")(S):!m&&nt(S)?Jt(e,T)(S):T(S)):(e.consume(S),D)}function T(S){return S===61?(e.enter(l),e.consume(S),e.exit(l),P):(e.exit(r),k(S))}function P(S){return S===null||S===60||S===61||S===62||S===96||S===125||m&&Ae(S)?n(S):S===34||S===39?(e.enter(u),e.enter(d),e.consume(S),e.exit(d),p=S,L):m&&Yn(S)?Ye(e,P,"whitespace")(S):!m&&nt(S)?Jt(e,P)(S):(e.enter(f),e.enter(y),e.consume(S),p=void 0,E)}function E(S){return S===null||S===34||S===39||S===60||S===61||S===62||S===96?n(S):S===125||nt(S)?(e.exit(y),e.exit(f),e.exit(r),k(S)):(e.consume(S),E)}function L(S){return S===p?(e.enter(d),e.consume(S),e.exit(d),e.exit(u),e.exit(r),O):(e.enter(f),I(S))}function I(S){return S===p?(e.exit(f),L(S)):S===null?n(S):Ae(S)?m?n(S):Jt(e,I)(S):(e.enter(y),e.consume(S),B)}function B(S){return S===p||S===null||Ae(S)?(e.exit(y),I(S)):(e.consume(S),B)}function O(S){return S===125||nt(S)?k(S):F(S)}function F(S){return S===125?(e.enter(s),e.consume(S),e.exit(s),e.exit(i),t):n(S)}}function Gs(e,t,n,i,s,r,o){let a=0,c=0,l;return u;function u(p){return e.enter(i),e.enter(s),e.consume(p),e.exit(s),f}function f(p){return p===93?(e.enter(s),e.consume(p),e.exit(s),e.exit(i),t):(e.enter(r),d(p))}function d(p){if(p===93&&!c)return w(p);const g=e.enter("chunkText",{_contentTypeTextTrailing:!0,contentType:"text",previous:l});return l&&(l.next=g),l=g,y(p)}function y(p){return p===null||a>999||p===91&&++c>32?n(p):p===93&&!c--?(e.exit("chunkText"),w(p)):Ae(p)?o?n(p):(e.consume(p),e.exit("chunkText"),d):(e.consume(p),p===92?m:y)}function m(p){return p===91||p===92||p===93?(e.consume(p),a++,y):y(p)}function w(p){return e.exit(r),e.enter(s),e.consume(p),e.exit(s),e.exit(i),t}}function Us(e,t,n,i){const s=this;return r;function r(a){return a===null||Ae(a)||En(a)||Pn(a)?n(a):(e.enter(i),e.consume(a),o)}function o(a){return a===null||Ae(a)||Pn(a)||En(a)&&a!==45&&a!==95?(e.exit(i),s.previous===45||s.previous===95?n(a):t(a)):(e.consume(a),o)}}const Xg={tokenize:ey,concrete:!0},Zg={tokenize:ty,partial:!0},Jg={tokenize:ny,partial:!0},gn={tokenize:iy,partial:!0};function ey(e,t,n){const i=this,s=i.events[i.events.length-1],r=s&&s[1].type==="linePrefix"?s[2].sliceSerialize(s[1],!0).length:0;let o=0,a;return c;function c(E){return e.enter("directiveContainer"),e.enter("directiveContainerFence"),e.enter("directiveContainerSequence"),l(E)}function l(E){return E===58?(e.consume(E),o++,l):o<3?n(E):(e.exit("directiveContainerSequence"),Us.call(i,e,u,n,"directiveContainerName")(E))}function u(E){return E===91?e.attempt(Zg,f,f)(E):f(E)}function f(E){return E===123?e.attempt(Jg,d,d)(E):d(E)}function d(E){return Ye(e,y,"whitespace")(E)}function y(E){return e.exit("directiveContainerFence"),E===null?T(E):Ae(E)?i.interrupt?t(E):e.attempt(gn,m,T)(E):n(E)}function m(E){return E===null?T(E):Ae(E)?e.check(gn,v,T)(E):(e.enter("directiveContainerContent"),w(E))}function w(E){return e.attempt({tokenize:P,partial:!0},D,r?Ye(e,p,"linePrefix",r+1):p)(E)}function p(E){return E===null?D(E):Ae(E)?e.check(gn,k,D)(E):k(E)}function g(E){if(E===null){const L=e.exit("chunkDocument");return i.parser.lazy[L.start.line]=!1,D(E)}return Ae(E)?e.check(gn,x,C)(E):(e.consume(E),g)}function k(E){const L=e.enter("chunkDocument",{contentType:"document",previous:a});return a&&(a.next=L),a=L,g(E)}function v(E){return e.enter("directiveContainerContent"),w(E)}function x(E){e.consume(E);const L=e.exit("chunkDocument");return i.parser.lazy[L.start.line]=!1,w}function C(E){const L=e.exit("chunkDocument");return i.parser.lazy[L.start.line]=!1,D(E)}function D(E){return e.exit("directiveContainerContent"),T(E)}function T(E){return e.exit("directiveContainer"),t(E)}function P(E,L,I){let B=0;return Ye(E,O,"linePrefix",i.parser.constructs.disable.null.includes("codeIndented")?void 0:4);function O(z){return E.enter("directiveContainerFence"),E.enter("directiveContainerSequence"),F(z)}function F(z){return z===58?(E.consume(z),B++,F):B<o?I(z):(E.exit("directiveContainerSequence"),Ye(E,S,"whitespace")(z))}function S(z){return z===null||Ae(z)?(E.exit("directiveContainerFence"),L(z)):I(z)}}}function ty(e,t,n){return Gs(e,t,n,"directiveContainerLabel","directiveContainerLabelMarker","directiveContainerLabelString",!0)}function ny(e,t,n){return zs(e,t,n,"directiveContainerAttributes","directiveContainerAttributesMarker","directiveContainerAttribute","directiveContainerAttributeId","directiveContainerAttributeClass","directiveContainerAttributeName","directiveContainerAttributeInitializerMarker","directiveContainerAttributeValueLiteral","directiveContainerAttributeValue","directiveContainerAttributeValueMarker","directiveContainerAttributeValueData",!0)}function iy(e,t,n){const i=this;return s;function s(o){return e.enter("lineEnding"),e.consume(o),e.exit("lineEnding"),r}function r(o){return i.parser.lazy[i.now().line]?n(o):t(o)}}const sy={tokenize:ay},oy={tokenize:ly,partial:!0},ry={tokenize:cy,partial:!0};function ay(e,t,n){const i=this;return s;function s(u){return e.enter("directiveLeaf"),e.enter("directiveLeafSequence"),e.consume(u),r}function r(u){return u===58?(e.consume(u),e.exit("directiveLeafSequence"),Us.call(i,e,o,n,"directiveLeafName")):n(u)}function o(u){return u===91?e.attempt(oy,a,a)(u):a(u)}function a(u){return u===123?e.attempt(ry,c,c)(u):c(u)}function c(u){return Ye(e,l,"whitespace")(u)}function l(u){return u===null||Ae(u)?(e.exit("directiveLeaf"),t(u)):n(u)}}function ly(e,t,n){return Gs(e,t,n,"directiveLeafLabel","directiveLeafLabelMarker","directiveLeafLabelString",!0)}function cy(e,t,n){return zs(e,t,n,"directiveLeafAttributes","directiveLeafAttributesMarker","directiveLeafAttribute","directiveLeafAttributeId","directiveLeafAttributeClass","directiveLeafAttributeName","directiveLeafAttributeInitializerMarker","directiveLeafAttributeValueLiteral","directiveLeafAttributeValue","directiveLeafAttributeValueMarker","directiveLeafAttributeValueData",!0)}const uy={tokenize:py,previous:fy},hy={tokenize:my,partial:!0},dy={tokenize:gy,partial:!0};function fy(e){return e!==58||this.events[this.events.length-1][1].type==="characterEscape"}function py(e,t,n){const i=this;return s;function s(c){return e.enter("directiveText"),e.enter("directiveTextMarker"),e.consume(c),e.exit("directiveTextMarker"),Us.call(i,e,r,n,"directiveTextName")}function r(c){return c===58?n(c):c===91?e.attempt(hy,o,o)(c):o(c)}function o(c){return c===123?e.attempt(dy,a,a)(c):a(c)}function a(c){return e.exit("directiveText"),t(c)}}function my(e,t,n){return Gs(e,t,n,"directiveTextLabel","directiveTextLabelMarker","directiveTextLabelString")}function gy(e,t,n){return zs(e,t,n,"directiveTextAttributes","directiveTextAttributesMarker","directiveTextAttribute","directiveTextAttributeId","directiveTextAttributeClass","directiveTextAttributeName","directiveTextAttributeInitializerMarker","directiveTextAttributeValueLiteral","directiveTextAttributeValue","directiveTextAttributeValueMarker","directiveTextAttributeValueData")}function yy(){return{text:{58:uy},flow:{58:[Xg,sy]}}}function by(){const t=this.data(),n=t.micromarkExtensions||(t.micromarkExtensions=[]),i=t.fromMarkdownExtensions||(t.fromMarkdownExtensions=[]),s=t.toMarkdownExtensions||(t.toMarkdownExtensions=[]);n.push(yy()),i.push(Hg()),s.push(Wg())}const Br={size:e=>`font-size:${e}`,color:e=>`color:${e}`,bg:e=>`background-color:${e}`,opacity:e=>`opacity:${e}`,nowrap:()=>"white-space:nowrap",center:()=>"text-align:center"},wy=new Set(["center"]),xy="s",vy=/^[\w.#%(),\s-]*$/,ky=new Set(["color","bg"]);function Ty(e,t=!1,n){const i=[];for(const[s,r]of Object.entries(e??{})){if(!(s in Br)||t&&wy.has(s))continue;let o=(r??"").trim();ky.has(s)&&(o=n?.[o]??o),!(!vy.test(o)||/url\s*\(/i.test(o))&&i.push(Br[s](o))}return i.join(";")}const Sy=new Set(["textDirective","leafDirective","containerDirective"]);function oc(e,t){if(Sy.has(e.type)){const n=e.type==="textDirective",i=e.name===xy?Ty(e.attributes,n,t):"";e.data={...e.data,hName:n?"span":"div",hProperties:i?{style:i,className:"help-styled"}:{}}}for(const n of e.children??[])oc(n,t)}function Cy(e={}){return t=>{oc(t,e.colors)}}const Ay=e=>[by,[Cy,{colors:e}]],as={a:({href:e,children:t})=>h.jsx("a",{href:e,target:"_blank",rel:"noreferrer",children:t}),blockquote:({children:e})=>h.jsxs("div",{className:"help-popover-alert",role:"note",children:[h.jsx("span",{className:"help-popover-alert-mark","aria-hidden":"true",children:"!"}),h.jsx("div",{children:e})]})},ls="widget:",Py=e=>e.startsWith(ls)?e:Sc(e);function Ey(e){return function({src:n,alt:i}){if(n?.startsWith(ls)){const s=n.slice(ls.length),r=s.indexOf(":"),o=r===-1?s:s.slice(0,r),a=r===-1?"":s.slice(r+1);return e?.[o]?.(a)??h.jsx("span",{children:i})}return h.jsx("img",{src:n,alt:i})}}function Dy(e){try{return localStorage.getItem(e)}catch{return null}}function My(e,t){try{localStorage.setItem(e,t)}catch{}}const rc="help-once-",Pi="data-help-anchor",Ei="data-help-spotlight",$r="data-help-hint",Oy="--help-hint",Ry=40;function jy(e){return e.split(`
`).filter(t=>!/^\s{0,3}>/.test(t)).join(`
`).replace(/\n{3,}/g,`

`).trim()}function Ly(e){return Dy(rc+e)==="1"}function Ny(e){My(rc+e,"1")}function Vy(e){return{...as,blockquote:({children:t})=>h.jsxs("div",{className:"help-popover-alert",role:"note",children:[h.jsx("span",{className:"help-popover-alert-mark","aria-hidden":"true",children:"!"}),h.jsxs("div",{children:[t,h.jsxs("label",{className:"help-popover-alert-once",children:[h.jsx("input",{type:"checkbox",onChange:e}),"Don't show this again"]})]})]})}}function Iy(){const{helpMode:e,tourIndex:t,position:n,positions:i,stepCount:s,content:r,activeId:o,dismissEntry:a,nextStep:c,prevStep:l,endTour:u,showEntry:f,resolveAnchor:d,centerRect:y,showAddresses:m,tourName:w,tourMeta:p,widgets:g,colors:k}=ht(),v=b.useMemo(()=>Ay(k),[k]),x=w===void 0?void 0:p.get(w)?.abbr??w,[C,D]=b.useState(!1),T=t!==null;b.useEffect(()=>{T||D(!1)},[T]);const P=o?r.entries.get(o):void 0,E=Ul(),L=d,I=T?n?.anchor:P?.anchor,B=T?n?.spotlight:P?.spotlight,O=(T?n?.highlight:P?.highlight)??"dim",F=()=>{if(!n||n.beatCount===0)return null;const U=n.beatIndex+1;return h.jsx("span",{className:"help-tour-dots",title:`Screen ${U+1} of ${n.beatCount+1} in this step`,children:Array.from({length:n.beatCount},(J,pe)=>h.jsx("span",{className:pe<U?"help-dot help-dot-on":"help-dot"},pe))})},[S,z]=b.useState(!1),[fe,N]=b.useState(!1),[G,j]=b.useState(void 0),[X,oe]=b.useState(!1),re=b.useRef(null),[,Me]=b.useState(0),be=P?.once,Pe=be!==void 0&&Ly(be),ve=b.useMemo(()=>({...be===void 0?as:Vy(()=>{Ny(be),Me(U=>U+1)}),img:Ey(g)}),[be,g]),Se=(T?n?.blocks??[]:[P?.description??""]).map(U=>Pe?jy(U):U).filter(Boolean),Q=(T?n?.width:void 0)??Math.max(zy(Se.join(`

`)),T?Gy():0),q=b.useRef(!1);b.useEffect(()=>{q.current=!1},[o,I]);const ne=E.reset;b.useEffect(()=>{ne()},[o,t,ne]),b.useLayoutEffect(()=>{if(!o){z(!1),j(void 0);return}let U=null;const J=()=>{const me=L(I);me!==U&&(U?.removeAttribute(Pi),U=me,z(!!me),j(me?.closest("[data-graph-direction]")?.getAttribute("data-graph-direction")==="RIGHT"?"below":void 0),me&&(me.setAttribute(Pi,""),q.current||(q.current=!0,me.scrollIntoView({block:"center",behavior:"smooth"}))))};J();const pe=new MutationObserver(J);return pe.observe(document.body,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["data-help-id"]}),()=>{pe.disconnect(),U?.removeAttribute(Pi),z(!1),j(void 0)}},[o,I,L]),b.useLayoutEffect(()=>{if(!o||!B){N(!1);return}let U=null;const J=()=>{const me=L(B);me!==U&&(U?.removeAttribute(Ei),U=me,N(!!me),me?.setAttribute(Ei,""))};J();const pe=new MutationObserver(J);return pe.observe(document.body,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["data-help-id"]}),()=>{pe.disconnect(),U?.removeAttribute(Ei),N(!1)}},[o,B,L]);const ae=600,we=T&&n?.change!=null&&I!==void 0&&I.kind!=="none",[Le,Ne]=b.useState(!1);b.useEffect(()=>{if(!we){Ne(!0);return}Ne(!1);const U=window.setTimeout(()=>Ne(!0),ae);return()=>window.clearTimeout(U)},[we,t]);const dt=Le||S,ft=T?n?.address??"tour":o??"none";b.useEffect(()=>{const U=re.current;U&&(P&&dt?U.matches(":popover-open")||U.showPopover():U.matches(":popover-open")&&U.hidePopover())},[P,dt,ft]),b.useEffect(()=>{(!e||T)&&oe(!1)},[e,T]);const pt=b.useMemo(()=>e&&!T?[...r.entries.values()].filter(U=>L(U.anchor)).slice(0,Ry).map((U,J)=>({id:U.id,title:U.title,name:`${Oy}-${J}`})):[],[e,T,r,L]);return b.useLayoutEffect(()=>{const U=pt.map(J=>{const pe=L(r.entries.get(J.id)?.anchor);return pe?.setAttribute($r,J.name),pe}).filter(Boolean);return()=>U.forEach(J=>J.removeAttribute($r))},[pt,r,L]),h.jsxs(h.Fragment,{children:[(fe||S)&&o&&O!=="none"&&h.jsx("div",{className:`help-spotlight${O==="ring"?" help-spotlight-ring":""}`,"data-on-spotlight":fe?"":void 0}),pt.map(({id:U,title:J,name:pe})=>h.jsx("button",{className:"help-hint",title:J??U,style:{positionAnchor:pe},onMouseEnter:()=>{X||f(U)},onMouseLeave:()=>{X||a()},onClick:me=>{me.stopPropagation(),oe(!0),f(U)},children:"?"},U)),h.jsx("div",{ref:re,popover:"manual","data-help-popover":"","data-anchored":S&&!E.offset?"":void 0,className:"help-popover",style:{...Uy(S,T?n?.position:void 0,T?n?.offsetX:void 0,Q,S?null:y(),G),...E.offset?{positionArea:"none",left:E.offset.left,top:E.offset.top,right:"auto",bottom:"auto",margin:0,transform:"none"}:{}},children:P&&h.jsxs(h.Fragment,{children:[h.jsxs("h4",{className:"help-popover-title",onPointerDown:E.onPointerDown,style:{cursor:E.offset?"grabbing":"grab",userSelect:"none"},title:"Drag to move",children:[T&&x&&h.jsx("span",{className:"help-popover-tour",children:x}),P.title]}),T&&n?.action&&h.jsxs("div",{className:"help-popover-action",children:[h.jsx("span",{className:"help-popover-action-mark","aria-hidden":"true",children:"✓"}),h.jsx("div",{children:h.jsx(en,{children:n.action})})]}),Se.length>0&&h.jsx("div",{className:"help-popover-body",children:Se.map((U,J,pe)=>h.jsx("div",{className:J===pe.length-1?void 0:"help-beat-past",children:h.jsx(en,{components:ve,urlTransform:Py,remarkPlugins:v,children:U})},J))}),P.interactions.length>0&&h.jsx("ul",{className:"help-popover-interactions",children:P.interactions.map((U,J)=>h.jsx("li",{children:h.jsx(en,{components:as,children:U})},J))}),P.shortcut&&h.jsxs("p",{className:"help-popover-shortcut",children:["Shortcut: ",h.jsx("kbd",{children:P.shortcut})]}),P.context&&h.jsx("div",{className:"help-popover-context",children:h.jsx(en,{children:P.context})}),T?h.jsxs("div",{className:"help-tour-nav",children:[h.jsxs("span",{className:"help-tour-count",title:`Position ${t+1} of ${i.length}`,children:[n?.step," / ",s]}),F(),h.jsx("button",{className:"help-tour-map-btn",onClick:()=>D(U=>!U),"aria-expanded":C,title:"Show the tour outline",children:"⊞"}),h.jsx("span",{className:"help-tour-spacer"}),h.jsx("button",{onClick:l,disabled:t===0,title:"Previous (← arrow key)",children:"← back"}),h.jsx("button",{onClick:c,className:"help-tour-next",title:"Next (→ arrow key)",children:t+1===i.length?"done":"next →"}),h.jsx("button",{onClick:u,title:"End the tour and undo what it added (Esc)",children:"✕"})]}):h.jsxs("div",{className:"help-tour-nav",children:[h.jsx("span",{className:"help-tour-spacer"}),h.jsx("button",{onClick:()=>{oe(!1),a()},children:"close"})]}),m&&h.jsx(By,{address:T?n?.address:P.id,searchFor:T?n?.searchFor:`### ${P.id}`})]})},ft),C&&T&&h.jsx(ic,{scope:"tour",onClose:()=>D(!1)})]})}function By({address:e,searchFor:t}){const[n,i]=b.useState(!1);return b.useEffect(()=>{if(!n)return;const s=setTimeout(()=>i(!1),1200);return()=>clearTimeout(s)},[n]),!e||!t?null:h.jsxs("button",{type:"button",className:"help-popover-address",title:`Copy “${t}” — search help-content.md for it`,onClick:()=>{navigator.clipboard?.writeText(t).then(()=>i(!0),()=>{})},children:[e,n?" ✓":""]})}const ac=320,$y=320,Fy=800,_y=8,Hy=24,Wy=3;function zy(e){const t=e.trim().length;return t===0?ac:Math.round(Math.min(Fy,Math.max($y,Math.sqrt(t*_y*Hy*Wy))))}function Gy(){return 393}function Uy(e,t,n,i,s,r){const o=window.innerWidth,a=window.innerHeight,c=Math.min(i??ac,o-16);if(!e){const u=s??new DOMRect(0,0,o,a),f=u.left+u.width/2;return{left:Math.max(8,Math.min(f-c/2,o-c-8)),top:"50%",transform:"translateY(-50%)",maxHeight:`${a-16}px`,width:c}}return{positionArea:t?{right:"inline-end span-block-end",left:"inline-start span-block-end",top:"block-start span-inline-end",bottom:"block-end span-inline-end"}[t]:r==="below"?"block-end span-inline-end":"inline-end span-block-end",width:c,...Ky(n)}}function Ky(e){return e?{marginLeft:"px"in e?`${e.px}px`:`calc(anchor-size(${e.of}) * ${e.times})`}:{}}const Di=e=>e&&e.trim()?e.trim():void 0;function Qy(e){return{"model-description":t=>Di(e.getClassDescription(t)),"enum-description":t=>Di(e.getEnumDetail(t)?.description),"category-label":t=>Di(Hr.find(n=>n.id===t)?.label),edge:t=>t in ie.kinds?`![${ie.kinds[t].label}](widget:edge:${t})`:void 0,relation:t=>{const n=lc(t);return n?`![${n.left} ${n.right}](widget:relation:${t})`:void 0}}}function lc(e){const[t,n,i]=e.split(":");return t&&t in ie.kinds&&n&&i?{kind:t,left:n,right:i}:void 0}const qy={edge:e=>e in ie.kinds?h.jsx($n,{kind:e,width:40,className:"help-inline-widget"}):null,relation:e=>{const t=lc(e);return t?h.jsxs("span",{className:"help-inline-relation",children:[h.jsx("code",{children:t.left}),h.jsx($n,{kind:t.kind,width:40,className:"help-inline-widget"}),h.jsx("code",{children:t.right})]}):null}},Yy={...Object.fromEntries(Object.entries(ie.kinds).map(([e,t])=>[e,t.color])),entity:He.entity,enum:He.enum,"data-type":He.dataType,variable:He.variable,slot:He.slot,...Object.fromEntries(zr.flatMap((e,t)=>[[`sibling-${t}`,e.text],[`sibling-${t}-fill`,e.fill]]))},Xy=`# BDCHM Explorer help

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

The structure, which the steps below now follow:
- explain ownership, why it's needed, the two edge types
  - (association edges can be explained in a commented-out appendix, or not)
- explain the rule and its exceptions, in this order:
  - the default: an attribute owns what it points at -- owns-target-forward-by-default
    - Exception, by entity: referred-to entities -- belongs-to-target-backward-by-entity
    - Exception, by attribute: named back-pointers -- belongs-to-target-backward-by-attribute
  - the induced pass, which is not a slot rule -- child-following-parent

The rule steps below are drafted against the LIVE classifier (re-probed
2026-09-13): 89 forward, 55 by-entity exception, 5 by-attribute exception, 10
induced. They use the legend's own \`label\` strings from \`OWNERSHIP_RULES\`, so
tour, legend and classifier say one thing; if a label changes there, change it
here. ⚠️ The counts are hand-copied and a schema sync falsifies them silently —
TASKS \`markdown-everywhere\` (c) is the fix.
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
  these relationships — so the Explorer works them out, and this tour is about
  how.
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
- **Anchor:** node-box:BodySite
- Position: bottom
- Spotlight: slot-row:Condition.affected_body_site
- **Description:**
  When the Explorer reads an attribute as :s[owning]{color=own-fwd} what it
  points at, it draws the target to the **right** and gives the line a
  forward-pointing arrow {{edge:own-fwd}}.
  :::s{center color=entity}
    {{relation:own-fwd:Condition.affected_body_site:BodySite}}
  :::
- Beats:
  1. backwards
     - Keep: true
     - **Anchor:** node-box:Participant
     - Spotlight: slot-row:Condition.associated_participant
     - Description:
       When it reads the attribute the other way — the entity declaring it
       :s[belongs to]{color=own-bkwd} the target — it draws the target to the
       **left** and points the arrow back at it {{edge:own-bkwd}}.
       :::s{center color=entity}
         {{relation:own-bkwd:Condition.associated_participant:Participant}}
       :::

       Those two are the only kinds of line on the canvas. Everything that
       follows is about which one an attribute gets.

### the-legend

- **Title:** One rule, and where to check it
- **Tour:** Ownership
- Only: sel=Participant~Condition~BodySite&legend=1
- **Action:** Opened the Legend panel — it is always in the Help menu.
- **Anchor:** none
- Highlight: none
- **Width:** 560
- **Description:**
  The schema doesn't say which end owns which, so the Explorer decides. It
  decides by **one rule with two exceptions**, listed in the **Legend**, which
  is open now and always available from the Help menu.

  Each entry shows how many attributes it decided, and opening one lists them
  — so when a line looks wrong, the Legend is where to go and find out why it
  was drawn that way.

### owns-target-forward-by-default

- **Title:** The rule: an attribute owns what it points at
- **Tour:** Ownership
- **Only:** sel=Questionnaire~QuestionnaireItem&legend=0
- **Action:** Drew Questionnaire and the items it holds.
- **Anchor:** node-box:Questionnaire
- **Spotlight:** slot-row:Questionnaire.items
- Highlight: ring
- **Width:** 560
- **Description:**
  **:s[Owns target / forward arrow / by default]{color=own-fwd}** — 89
  attributes, and the default for every one of them.

  If an entity declares an attribute pointing at another entity, the thing it
  points at is taken to be **part of it**. \`items\` holds QuestionnaireItems, so
  the Questionnaire owns them: target on the right, arrow forward.
  :::s{center color=entity}
    {{relation:own-fwd:Questionnaire.items:QuestionnaireItem}}
  :::
- Beats:
  1. not about cardinality
     - Only: sel=Observation~Quantity&legend=0
     - Action: Drew an Observation and a Quantity.
     - Anchor: node-box:Quantity
     - Spotlight: slot-row:Observation.value_quantity
     - Description:
       It has nothing to do with how many. \`value_quantity\` holds exactly one
       Quantity (\`0..1\`) and is owned just the same — a Quantity is a fact
       *about* the observation holding it, with no life of its own.

       This rule is **total**: on its own it would decide every attribute in
       the model. The next two steps are the only places it doesn't hold.

### belongs-to-target-backward-by-entity

- **Title:** Exception: entities that are referred to
- **Tour:** Ownership
- **Only:** sel=Participant~Specimen&legend=0
- **Action:** Drew Specimen and the Participant it came from.
- **Anchor:** node-box:Participant
- **Spotlight:** slot-row:Specimen.source_participant
- Highlight: ring
- Position: bottom
- **Width:** 580
- **Description:**
  **:s[Belongs to target / backward arrow / by entity]{color=own-bkwd}** — 55
  attributes.

  Five entities in this model are **referred to** rather than contained:
  **Participant**, **Visit**, **Organization**, **ImagingStudy** and
  **Person**. Each exists in its own right and is looked up, not held, so
  pointing at one means belonging to it.
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
  2. said about the entity
     - Description:
       This exception is stated about the **entity**, not the attribute: name
       Participant once and every one of the 21 attributes pointing at it
       flips, including ones nobody has written yet.

       The schema can't tell us which five — nothing in it distinguishes them
       — so the list is recorded in the Explorer by hand, and it is a
       judgement that can be argued with.

### belongs-to-target-backward-by-attribute

- **Title:** Exception: attributes that point back
- **Tour:** Ownership
- **Only:** sel=Questionnaire~QuestionnaireItem~QuestionnaireResponseItem&legend=0
- **Action:** Drew a Questionnaire, its items, and a response item.
- **Anchor:** node-box:QuestionnaireItem
- **Spotlight:** slot-row:QuestionnaireResponseItem.has_questionnaire_item
- Highlight: ring
- **Width:** 580
- **Description:**
  **:s[Belongs to target / backward arrow / by attribute]{color=own-bkwd}** —
  5 attributes, named one at a time.

  \`has_questionnaire_item\` points at a **QuestionnaireItem** to say which
  question was answered. It isn't holding that item: the item belongs to the
  **Questionnaire**, which is still drawn owning it from the left.
  :::s{center color=entity}
    {{relation:own-bkwd:QuestionnaireResponseItem.has_questionnaire_item:QuestionnaireItem}}
  :::
- Beats:
  1. why not by entity
     - Description:
       So this exception can't be said about the entity the way the last one
       was. QuestionnaireItem **is** owned — by \`Questionnaire.items\` — and
       calling it referred-to would strip it of that. The same holds for
       **ResearchStudy**, owned by \`ResearchStudyCollection.entries\`.

       These five are named as \`Entity.attribute\` pairs for the same reason:
       two of them are called \`part_of\`, declared on different entities, and a
       bare attribute name would flip any future third one silently.

### child-following-parent

- **Title:** Edges with no attribute behind them
- **Tour:** Ownership
- **Only:** sel=QuestionnaireResponseItem~QuestionnaireResponseValue&legend=0
- **Action:** Drew QuestionnaireResponseItem and the value it holds.
- **Anchor:** node-box:QuestionnaireResponseValue
- **Spotlight:** slot-row:QuestionnaireResponseItem.response_value
- **Width:** 600
- **Description:**
  **:s[Owns target / forward arrow / induced]{color=own-fwd}** — 10 edges, and
  not a rule about attributes at all.

  \`response_value\` points at QuestionnaireResponseValue, which the rule above
  says the item owns. But an attribute whose target has **subclasses** accepts
  any of them too — and this one has five.
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
       rather than on any one child, and why the Legend lists them separately
       from the three rules.

### bar-sides

- **Title:** One side, two reasons
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
       Participant, Visit and Organization are on the left because they are
       **referred-to entities**: Observation points at each of them, so each
       one flipped. ObservationSet is on the left because of the **default
       rule** running normally — its \`observations\` list collects Observations,
       so it owns them.

       Position alone doesn't tell you which — that is what the Legend is for.
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
  One rule and two exceptions decide every line on the canvas:

  - An attribute :s[owns]{color=own-fwd} the entity it points at.
  - Except when that entity is one of the five that are only ever
    **referred to**, and then the attribute's own entity
    :s[belongs to]{color=own-bkwd} it instead.
  - Except when the attribute is one of the five named **back-pointers**,
    which point at an owner rather than down at something owned.

  And separately, an edge into an entity with subclasses is repeated into each
  of them.

  The Legend counts all four against the live schema every time it opens, so
  when a line looks wrong, that is where to have the argument.

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

  It is what a schema needs when the default rule would overclaim — when one
  entity points at another (so it would be read as owning it) but the target
  plainly outlives it and is reachable on its own, and no exception fits
  because the claim is about this one pairing rather than about either end.
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
`,Ks={inTour:!1,held:[],tempHeld:[],tour:[],region:0,tourStates:[],scalars:{}},Zy="~";function Fr(e,t){return e&&t.includes(e)?e:null}function cc(e,t=!1){const n=new URLSearchParams(e),i={};if(n.get("panels")==="0"){for(const c of Ll)i[c]=!1;i.detail=null}n.has("detail")&&(i.detail=n.get("detail")||null),n.has("roots")&&(i.roots=n.get("roots")==="1"),n.has("sibs")&&(i.sibs=n.get("sibs")==="1"),n.has("legend")&&(i.legend=n.get("legend")==="1"),n.has("cases")&&(i.cases=n.get("cases")==="1");const s=Fr(n.get("dir"),["RIGHT","DOWN"]);s&&(i.dir=s);const r=Fr(n.get("merge"),["near","far","bend","off"]);r&&(i.merge=r);const o=n.get("sel"),a=o?o.split(Zy).filter(Boolean):Nl(n);return t?{sel:a,scalars:i,replace:!0}:{sel:a,scalars:i}}function $t(e,t){return[...new Set([...e,...t])]}function Jy(e){return{...Ks,inTour:!0,held:[...e]}}function eb(){return Ks}function tb(e){return $t(e.held,e.tempHeld)}function uc(e,t){const n=t.replace?e.region+1:e.region,i=t.replace?[...t.sel]:$t(e.tour,t.sel),s={...e.scalars,...t.scalars};return{...e,tour:i,region:n,scalars:s,tourStates:[...e.tourStates,{sel:i,scalars:s,region:n}]}}function hc(e){if(e.tourStates.length===0)return e;const t=e.tourStates.slice(0,-1),n=t[t.length-1];return{...e,tourStates:t,tour:n?n.sel:[],region:n?n.region:0}}function Qs(e){return e.region>0}function nb(e,t){if(!e.inTour)return e;const n=Qs(e)?"tempHeld":"held";return e[n].includes(t)?e:{...e,[n]:[...e[n],t]}}function ib(e,t){if(!e.inTour)return e;const n=i=>i.filter(s=>s!==t);return{...e,tour:n(e.tour),tempHeld:n(e.tempHeld),held:Qs(e)?e.held:n(e.held)}}function qs(e,t){if(!t.inTour)return e;const n=Qs(t)?$t(t.tour,t.tempHeld):$t($t(t.tour,t.tempHeld),t.held);return{...e,...t.scalars,sel:n}}function sb(){const{modelData:e,loading:t,error:n}=Cc(),i=b.useMemo(()=>e?new Ac(e):null,[e]),{setTextResolvers:s}=ht(),r=b.useMemo(()=>i?Qy(i):void 0,[i]);b.useEffect(()=>s(r),[r,s]);const o=b.useMemo(()=>We(),[]),[a,c]=b.useState(()=>new Set(o.sel)),[l,u]=b.useState(o.detail),[f,d]=b.useState(!1),y=b.useRef(!1),[m,w]=b.useState(o.roots),[p,g]=b.useState(o.sibs),[k,v]=b.useState(o.dir),[x,C]=b.useState(o.merge),[D,T]=b.useState(o.cases),[P,E]=b.useState(o.legend),[L,I]=b.useState(!1),B=b.useCallback(N=>{c(new Set(N.sel)),w(!!N.roots),u(null)},[]);b.useEffect(()=>{const N=()=>{const G=We();c(new Set(G.sel)),u(G.detail),w(G.roots),g(G.sibs),v(G.dir),C(G.merge),E(G.legend),T(G.cases)};return window.addEventListener("popstate",N),window.addEventListener("explore:state-from-url",N),()=>{window.removeEventListener("popstate",N),window.removeEventListener("explore:state-from-url",N)}},[]),b.useEffect(()=>{const N={sel:[...a],detail:l,roots:m,sibs:p,dir:k,merge:x,legend:P,cases:D},G=y.current;y.current=!1,Vl(N,{push:G})},[a,l,m,p,k,x,P,D]);const O=b.useCallback(N=>{yt(N,!We().sel.includes(N)),c(G=>{const j=new Set(G);return j.has(N)?j.delete(N):j.add(N),j})},[]),F=b.useCallback(N=>{yt(N,!0),c(G=>G.has(N)?G:new Set(G).add(N))},[]),S=b.useCallback(N=>{yt(N,!1),c(G=>{if(!G.has(N))return G;const j=new Set(G);return j.delete(N),j})},[]),z=b.useCallback(N=>{c(j=>j.size===N.length&&N.every(X=>j.has(X))?j:(y.current=!0,new Set(N)));const G=new Set(N);for(const j of We().sel)G.has(j)||yt(j,!1);for(const j of N)yt(j,!0)},[]),fe=b.useCallback(()=>{for(const N of We().sel)yt(N,!1);c(new Set),u(null),d(!1),w(!1),E(!1),T(!1)},[]);return n?h.jsxs("div",{className:"p-8 text-red-600",children:["Failed to load model data: ",String(n)]}):t||!i?h.jsx("div",{className:"p-8 text-gray-400",children:"Loading model…"}):h.jsxs("div",{className:"relative flex flex-col h-screen bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100",children:[h.jsxs("header",{className:"flex items-center justify-between px-4 py-2 bg-blue-600 text-white shrink-0",children:[h.jsxs("div",{children:[h.jsx("h1",{"data-help-id":"app-title",className:"text-lg font-bold leading-tight cursor-pointer hover:opacity-80 transition-opacity",onClick:fe,title:"Click to clear the selection and reset the view",children:"BDCHM Explorer"}),h.jsx("p",{className:"text-xs text-blue-100",children:"BioData Catalyst Harmonized Model"})]}),h.jsxs("div",{className:"flex items-center gap-4",children:[h.jsx(hb,{}),h.jsx(wg,{}),h.jsx(sg,{onOpenLegend:()=>E(N=>!N),onOpenCases:()=>T(N=>!N),legendOpen:P,casesOpen:D,anyPanelOpen:P||D||l!==null,onClosePanels:()=>{E(!1),T(!1),u(null)}}),h.jsx("button",{onClick:async()=>{const N=Sm({sel:[...a],detail:l,roots:m,sibs:p,dir:k,merge:x,legend:P,cases:D});try{await navigator.clipboard.writeText(N),I(!0),window.setTimeout(()=>I(!1),1500)}catch{I(!1),window.prompt("Copy this link:",N)}},"data-help-id":"copy-link",className:"text-sm underline text-blue-100 hover:text-white",title:"Copy a link that reproduces exactly this view, settings included",children:L?"✓ copied":"copy link"}),h.jsx("a",{href:"/dynamic-model-var-docs/previous.html",className:"text-sm underline text-blue-100 hover:text-white",children:"previous views"}),h.jsx("a",{href:"https://github.com/Sigfried/dynamic-model-var-docs",target:"_blank",rel:"noopener noreferrer",className:"text-blue-100 hover:text-white",title:"Source code on GitHub","aria-label":"Source code on GitHub",children:h.jsx("svg",{viewBox:"0 0 16 16",width:"18",height:"18",fill:"currentColor","aria-hidden":!0,children:h.jsx("path",{d:"M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"})})})]})]}),P&&h.jsx(Jm,{onClose:()=>E(!1),onSelect:N=>N.forEach(F),dataService:i}),D&&h.jsx(qm,{onClose:()=>T(!1),onApply:B,selectedIds:a,dataService:i,offset:P}),h.jsxs("div",{className:"flex-1 flex min-h-0",children:[f?h.jsxs("button",{onClick:()=>d(!1),title:"Show entity selection",className:`shrink-0 w-8 border-r border-gray-200 dark:border-slate-700
                       bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700
                       flex flex-col items-center gap-2 py-2 text-gray-400`,children:[h.jsx("span",{className:"text-xs",children:"▶"}),h.jsxs("span",{className:"text-[10px] uppercase tracking-wider [writing-mode:vertical-rl]",children:[i.getConceptLabel("entity",!0),a.size>0?` (${a.size})`:""]})]}):h.jsxs("div",{className:"w-80 shrink-0 flex flex-col min-h-0 border-r border-gray-200 dark:border-slate-700",children:[h.jsx("div",{className:"flex-1 overflow-y-auto min-h-0","data-help-id":"selection-tree",children:h.jsx(Vc,{dataService:i,selectedIds:a,onToggle:O,onShowCategory:z})}),h.jsx("button",{onClick:()=>d(!0),title:"Hide entity selection",className:`shrink-0 px-3 py-1 text-xs text-gray-400 border-t border-gray-200
                         dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 text-left`,children:"◀ Hide"})]}),h.jsx("div",{className:"flex-1 min-w-0","data-help-id":"graph-canvas",children:a.size===0?h.jsx("div",{className:"h-full flex items-center justify-center text-sm text-gray-400 p-8",children:"Select entities on the left to build the ownership subgraph."}):h.jsx(_m,{dataService:i,selectedIds:a,onNodeClick:u,onAdd:F,onRemove:S,pathToRoot:m,onTogglePathToRoot:()=>w(N=>!N),direction:k,setDirection:v,mergeMode:x,setMergeMode:C,mergeSibs:p,setMergeSibs:g})}),l&&h.jsx(Hm,{classId:l,dataService:i,onClose:()=>u(null),onNavigate:u,isSelected:a.has(l),onToggleSelect:O})]})]})}let de=Ks;function yt(e,t){de=t?nb(de,e):ib(de,e)}function Qn(e){Vl(e),window.dispatchEvent(new Event("explore:state-from-url"))}function ob(){de=Jy(We().sel)}function rb(){if(!de.inTour)return;const e=tb(de),t=We();de=eb(),Qn({...t,sel:e})}function ab(e,t=!1){de=uc(de,cc(e,t)),Qn(qs(We(),de))}function lb(){de=hc(de),Qn(qs(We(),de))}function cb(e,t){for(let n=0;n<t;n++)de=hc(de);for(const n of e)de=uc(de,cc(n.query,n.replace));Qn(qs(We(),de))}function ub(){return h.jsxs(Tg,{markdown:Xy,widgets:qy,colors:Yy,onPushChange:ab,onPopChange:lb,onJumpChanges:cb,onTourStart:ob,onTourEnd:rb,children:[h.jsx(sb,{}),h.jsx(Iy,{})]})}function hb(){const{helpMode:e,toggleHelpMode:t,startTour:n}=ht();return b.useEffect(()=>{vm()&&n()},[]),h.jsx("span",{className:"flex items-center gap-2","data-help-id":"help-button",children:eg})}Pc.createRoot(document.getElementById("root")).render(h.jsx(b.StrictMode,{children:h.jsx(ub,{})}));
