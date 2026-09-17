import{i as Ii,p as Pc,r as b,j as d,E as Qe,O as io,g as Ec,a as qr,b as Yr,S as Dc,c as Xr,d as Mc,s as Oc,w as Rc,R as He,e as jc,f as Lc,m as Nc,h as Ic,k as so,o as Zr,v as Vc,l as ei,n as Je,q as rt,t as on,u as Ae,x as Mn,y as On,z as $c,M as It,A as Jr,B as Bc,D as Fc,C as _c}from"./index-VeeOp3t1.js";function ea(e){return[...new Set([...e.classIds,...e.pins])]}const Hc=e=>`entity-row:${e}`,Wc=e=>`entity-checkbox:${e}`,zc=e=>`category-row:${e}`,Uc=e=>`node-box:${e}`,Gc=e=>`child-header:${e}`,Kc=(e,t)=>`slot-row:${e}.${t}`,ta=e=>Ii(e.id)?Pc(e.id):e.id,Qc=e=>Uc(ta(e)),qc=(e,t)=>Kc(t.declaringClass??ta(e),t.slot);function Yc({dataService:e,selectedIds:t,onToggle:n,onShowCategory:i}){const s=b.useMemo(()=>e.getCategoryTrees(),[e]),[r,o]=b.useState(new Set),a=l=>o(u=>{const f=new Set(u);return f.has(l)?f.delete(l):f.add(l),f}),c=s.reduce((l,u)=>l+u.classIds.length,0);return d.jsxs("div",{className:"text-sm",children:[d.jsx("div",{className:"flex items-baseline gap-2 px-3 py-2 border-b border-gray-200 dark:border-slate-700",children:d.jsxs("span",{className:"font-semibold flex-1",children:[e.getConceptLabel("entity",!0)," (",c,")"]})}),s.map(l=>{const u=r.has(l.id),f=l.classIds.filter(h=>t.has(h)).length;return d.jsxs("div",{children:[d.jsxs("div",{"data-help-id":zc(l.id),className:`w-full flex items-stretch font-medium
                         bg-gray-50 dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700`,children:[d.jsxs("button",{type:"button",onClick:()=>a(l.id),className:`flex-1 min-w-0 flex items-center gap-2 px-3 py-1.5 text-left
                           hover:bg-gray-100 dark:hover:bg-slate-700`,children:[d.jsx("span",{className:"text-xs text-gray-400",children:u?"▶":"▼"}),d.jsx("span",{className:"flex-1 truncate",children:l.label}),f>0&&d.jsxs("span",{className:"text-xs text-gray-400",children:[f," / ",l.classIds.length]})]}),i&&d.jsx("button",{type:"button","data-show-category":l.id,title:`Draw the ${l.label} content view — replaces the canvas`,onClick:()=>i(ea(l)),className:`px-2.5 shrink-0 text-gray-400 border-l border-gray-100
                             dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700
                             hover:text-blue-600 dark:hover:text-sky-400`,children:"⊞"})]}),!u&&l.roots.map(h=>d.jsx(na,{node:h,depth:0,selectedIds:t,onToggle:n},h.classId))]},l.id)})]})}function na({node:e,depth:t,selectedIds:n,onToggle:i}){const{classId:s}=e;return d.jsxs(d.Fragment,{children:[d.jsxs("label",{"data-class-row":s,"data-help-id":Hc(s),className:`flex items-center gap-2 pr-3 py-1 cursor-pointer
                    hover:bg-blue-50 dark:hover:bg-slate-800
                    ${n.has(s)?"bg-blue-50 dark:bg-slate-800":""}`,style:{paddingLeft:`${.75+t*1}rem`},children:[d.jsx("input",{type:"checkbox","data-help-id":Wc(s),checked:n.has(s),onChange:()=>i(s)}),d.jsxs("span",{className:"flex-1 min-w-0 truncate",children:[d.jsx("span",{className:"font-mono text-xs",children:s}),e.outOfCategoryParent&&d.jsxs("span",{className:"ml-1 text-[10px] text-gray-400 dark:text-slate-500",title:`Extends ${e.outOfCategoryParent}, which is in another category`,children:["↳ ",e.outOfCategoryParent]})]})]}),e.children.map(r=>d.jsx(na,{node:r,depth:t+1,selectedIds:n,onToggle:i},r.classId))]})}const ps=b.createContext({});function ms(e){const t=b.useRef(null);return t.current===null&&(t.current=e()),t.current}const Xc=typeof window<"u",Rn=Xc?b.useLayoutEffect:b.useEffect,Wn=b.createContext(null);function gs(e,t){e.indexOf(t)===-1&&e.push(t)}function jn(e,t){const n=e.indexOf(t);n>-1&&e.splice(n,1)}const Ue=(e,t,n)=>n>t?t:n<e?e:n;let zn=()=>{};const tt={},ia=e=>/^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(e),sa=e=>typeof e=="object"&&e!==null,oa=e=>/^0[^.\s]+$/u.test(e);function ra(e){let t;return()=>(t===void 0&&(t=e()),t)}const Le=e=>e,Zt=(...e)=>e.reduce((t,n)=>i=>n(t(i))),Qt=(e,t,n)=>{const i=t-e;return i?(n-e)/i:1};class ys{constructor(){this.subscriptions=[]}add(t){return gs(this.subscriptions,t),()=>jn(this.subscriptions,t)}notify(t,n,i){const s=this.subscriptions.length;if(s)if(s===1)this.subscriptions[0](t,n,i);else for(let r=0;r<s;r++){const o=this.subscriptions[r];o&&o(t,n,i)}}getSize(){return this.subscriptions.length}clear(){this.subscriptions.length=0}}const Ne=e=>e*1e3,je=e=>e/1e3,aa=(e,t)=>t?e*(1e3/t):0,la=(e,t,n)=>(((1-3*n+3*t)*e+(3*n-6*t))*e+3*t)*e,Zc=1e-7,Jc=12;function eu(e,t,n,i,s){let r,o,a=0;do o=t+(n-t)/2,r=la(o,i,s)-e,r>0?n=o:t=o;while(Math.abs(r)>Zc&&++a<Jc);return o}function Jt(e,t,n,i){if(e===t&&n===i)return Le;const s=r=>eu(r,0,1,e,n);return r=>r===0||r===1?r:la(s(r),t,i)}const ca=e=>t=>t<=.5?e(2*t)/2:(2-e(2*(1-t)))/2,ua=e=>t=>1-e(1-t),da=Jt(.33,1.53,.69,.99),ws=ua(da),ha=ca(ws),fa=e=>e>=1?1:(e*=2)<1?.5*ws(e):.5*(2-Math.pow(2,-10*(e-1))),bs=e=>1-Math.sin(Math.acos(e)),pa=ua(bs),ma=ca(bs),tu=Jt(.42,0,1,1),nu=Jt(0,0,.58,1),ga=Jt(.42,0,.58,1),iu=e=>Array.isArray(e)&&typeof e[0]!="number",ya=e=>Array.isArray(e)&&typeof e[0]=="number",su={linear:Le,easeIn:tu,easeInOut:ga,easeOut:nu,circIn:bs,circInOut:ma,circOut:pa,backIn:ws,backInOut:ha,backOut:da,anticipate:fa},ou=e=>typeof e=="string",oo=e=>{if(ya(e)){zn(e.length===4);const[t,n,i,s]=e;return Jt(t,n,i,s)}else if(ou(e))return su[e];return e},rn=["setup","read","resolveKeyframes","preUpdate","update","preRender","render","postRender"];function ru(e){let t=new Set,n=new Set,i=!1,s=!1;const r=new WeakSet;let o={delta:0,timestamp:0,isProcessing:!1};function a(l){r.has(l)&&(c.schedule(l),e()),l(o)}const c={schedule:(l,u=!1,f=!1)=>{const y=f&&i?t:n;return u&&r.add(l),y.add(l),l},cancel:l=>{n.delete(l),r.delete(l)},process:l=>{if(o=l,i){s=!0;return}i=!0;const u=t;t=n,n=u,t.forEach(a),t.clear(),i=!1,s&&(s=!1,c.process(l))}};return c}const au=40;function wa(e,t){let n=!1,i=!0;const s={delta:0,timestamp:0,isProcessing:!1},r=()=>n=!0,o=rn.reduce((v,x)=>(v[x]=ru(r),v),{}),{setup:a,read:c,resolveKeyframes:l,preUpdate:u,update:f,preRender:h,render:y,postRender:p}=o,g=()=>{const v=tt.useManualTiming,x=v?s.timestamp:performance.now();n=!1,v||(s.delta=i?1e3/60:Math.max(Math.min(x-s.timestamp,au),1)),s.timestamp=x,s.isProcessing=!0,a.process(s),c.process(s),l.process(s),u.process(s),f.process(s),h.process(s),y.process(s),p.process(s),s.isProcessing=!1,n&&t&&(i=!1,e(g))},m=()=>{n=!0,i=!0,s.isProcessing||e(g)};return{schedule:rn.reduce((v,x)=>{const T=o[x];return v[x]=(D,S=!1,P=!1)=>(n||m(),T.schedule(D,S,P)),v},{}),cancel:v=>{for(let x=0;x<rn.length;x++)o[rn[x]].cancel(v)},state:s,steps:o}}const{schedule:te,cancel:nt,state:ye,steps:ti}=wa(typeof requestAnimationFrame<"u"?requestAnimationFrame:Le,!0);let xn;function lu(){xn=void 0}const ke={now:()=>(xn===void 0&&ke.set(ye.isProcessing||tt.useManualTiming?ye.timestamp:performance.now()),xn),set:e=>{xn=e,queueMicrotask(lu)}},ba=e=>t=>typeof t=="string"&&t.startsWith(e),xa=ba("--"),cu=ba("var(--"),xs=e=>cu(e)?uu.test(e.split("/*")[0].trim()):!1,uu=/var\(--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)$/iu;function ro(e){return typeof e!="string"?!1:e.split("/*")[0].includes("var(--")}const Dt={test:e=>typeof e=="number",parse:parseFloat,transform:e=>e},qt={...Dt,transform:e=>Ue(0,1,e)},an={...Dt,default:1},Ft=e=>Math.round(e*1e5)/1e5,vs=/-?(?:\d+(?:\.\d+)?|\.\d+)/gu;function du(e){return e==null}const hu=/^(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))$/iu,ks=(e,t)=>n=>!!(typeof n=="string"&&hu.test(n)&&n.startsWith(e)||t&&!du(n)&&Object.prototype.hasOwnProperty.call(n,t)),va=(e,t,n)=>i=>{if(typeof i!="string")return i;const[s,r,o,a]=i.match(vs);return{[e]:parseFloat(s),[t]:parseFloat(r),[n]:parseFloat(o),alpha:a!==void 0?parseFloat(a):1}},fu=e=>Ue(0,255,e),ni={...Dt,transform:e=>Math.round(fu(e))},ut={test:ks("rgb","red"),parse:va("red","green","blue"),transform:({red:e,green:t,blue:n,alpha:i=1})=>"rgba("+ni.transform(e)+", "+ni.transform(t)+", "+ni.transform(n)+", "+Ft(qt.transform(i))+")"};function pu(e){let t="",n="",i="",s="";return e.length>5?(t=e.substring(1,3),n=e.substring(3,5),i=e.substring(5,7),s=e.substring(7,9)):(t=e.substring(1,2),n=e.substring(2,3),i=e.substring(3,4),s=e.substring(4,5),t+=t,n+=n,i+=i,s+=s),{red:parseInt(t,16),green:parseInt(n,16),blue:parseInt(i,16),alpha:s?parseInt(s,16)/255:1}}const Vi={test:ks("#"),parse:pu,transform:ut.transform},en=e=>({test:t=>typeof t=="string"&&t.endsWith(e)&&t.split(" ").length===1,parse:parseFloat,transform:t=>`${t}${e}`}),Ke=en("deg"),ze=en("%"),B=en("px"),mu=en("vh"),gu=en("vw"),ao={...ze,parse:e=>ze.parse(e)/100,transform:e=>ze.transform(e*100)},St={test:ks("hsl","hue"),parse:va("hue","saturation","lightness"),transform:({hue:e,saturation:t,lightness:n,alpha:i=1})=>"hsla("+Math.round(e)+", "+ze.transform(Ft(t))+", "+ze.transform(Ft(n))+", "+Ft(qt.transform(i))+")"},ce={test:e=>ut.test(e)||Vi.test(e)||St.test(e),parse:e=>ut.test(e)?ut.parse(e):St.test(e)?St.parse(e):Vi.parse(e),transform:e=>typeof e=="string"?e:e.hasOwnProperty("red")?ut.transform(e):St.transform(e),getAnimatableNone:e=>{const t=ce.parse(e);return t.alpha=0,ce.transform(t)}},yu=/(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))/giu;function wu(e){return isNaN(e)&&typeof e=="string"&&(e.match(vs)?.length||0)+(e.match(yu)?.length||0)>0}const ka="number",Sa="color",bu="var",xu="var(",lo="${}",vu=/var\s*\(\s*--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)|#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\)|-?(?:\d+(?:\.\d+)?|\.\d+)/giu;function At(e){const t=e.toString(),n=[],i={color:[],number:[],var:[]},s=[];let r=0;const a=t.replace(vu,c=>(ce.test(c)?(i.color.push(r),s.push(Sa),n.push(ce.parse(c))):c.startsWith(xu)?(i.var.push(r),s.push(bu),n.push(c)):(i.number.push(r),s.push(ka),n.push(parseFloat(c))),++r,lo)).split(lo);return{values:n,split:a,indexes:i,types:s}}function ku(e){return At(e).values}function Ta({split:e,types:t}){const n=e.length;return i=>{let s="";for(let r=0;r<n;r++)if(s+=e[r],i[r]!==void 0){const o=t[r];o===ka?s+=Ft(i[r]):o===Sa?s+=ce.transform(i[r]):s+=i[r]}return s}}function Su(e){return Ta(At(e))}const Tu=e=>typeof e=="number"?0:ce.test(e)?ce.getAnimatableNone(e):e,Cu=(e,t)=>typeof e=="number"?t?.trim().endsWith("/")?e:0:Tu(e);function Au(e){const t=At(e);return Ta(t)(t.values.map((i,s)=>Cu(i,t.split[s])))}const Be={test:wu,parse:ku,createTransformer:Su,getAnimatableNone:Au};function ii(e,t,n){return n<0&&(n+=1),n>1&&(n-=1),n<1/6?e+(t-e)*6*n:n<1/2?t:n<2/3?e+(t-e)*(2/3-n)*6:e}function Pu({hue:e,saturation:t,lightness:n,alpha:i}){e/=360,t/=100,n/=100;let s=0,r=0,o=0;if(!t)s=r=o=n;else{const a=n<.5?n*(1+t):n+t-n*t,c=2*n-a;s=ii(c,a,e+1/3),r=ii(c,a,e),o=ii(c,a,e-1/3)}return{red:Math.round(s*255),green:Math.round(r*255),blue:Math.round(o*255),alpha:i}}function Ln(e,t){return n=>n>0?t:e}const ee=(e,t,n)=>e+(t-e)*n,si=(e,t,n)=>{const i=e*e,s=n*(t*t-i)+i;return s<0?0:Math.sqrt(s)},Eu=[Vi,ut,St],Du=e=>Eu.find(t=>t.test(e));function co(e){const t=Du(e);if(!t)return!1;let n=t.parse(e);return t===St&&(n=Pu(n)),n}const uo=(e,t)=>{const n=co(e),i=co(t);if(!n||!i)return Ln(e,t);const s={...n};return r=>(s.red=si(n.red,i.red,r),s.green=si(n.green,i.green,r),s.blue=si(n.blue,i.blue,r),s.alpha=ee(n.alpha,i.alpha,r),ut.transform(s))},$i=new Set(["none","hidden"]);function Mu(e,t){return $i.has(e)?n=>n<=0?e:t:n=>n>=1?t:e}function Ou(e,t){return n=>ee(e,t,n)}function Ss(e){return typeof e=="number"?Ou:typeof e=="string"?xs(e)?Ln:ce.test(e)?uo:Lu:Array.isArray(e)?Ca:typeof e=="object"?ce.test(e)?uo:Ru:Ln}function Ca(e,t){const n=[...e],i=n.length,s=e.map((r,o)=>Ss(r)(r,t[o]));return r=>{for(let o=0;o<i;o++)n[o]=s[o](r);return n}}function Ru(e,t){const n={...e,...t},i={};for(const s in n)e[s]!==void 0&&t[s]!==void 0&&(i[s]=Ss(e[s])(e[s],t[s]));return s=>{for(const r in i)n[r]=i[r](s);return n}}function ju(e,t){const n=[],i={color:0,var:0,number:0};for(let s=0;s<t.values.length;s++){const r=t.types[s],o=e.indexes[r][i[r]],a=e.values[o]??0;n[s]=a,i[r]++}return n}const Lu=(e,t)=>{const n=Be.createTransformer(t),i=At(e),s=At(t);return i.indexes.var.length===s.indexes.var.length&&i.indexes.color.length===s.indexes.color.length&&i.indexes.number.length>=s.indexes.number.length?$i.has(e)&&!s.values.length||$i.has(t)&&!i.values.length?Mu(e,t):Zt(Ca(ju(i,s),s.values),n):Ln(e,t)};function Aa(e,t,n){return typeof e=="number"&&typeof t=="number"&&typeof n=="number"?ee(e,t,n):Ss(e)(e,t)}const Nu=e=>{const t=({timestamp:n})=>e(n);return{start:(n=!0)=>te.update(t,n),stop:()=>nt(t),now:()=>ye.isProcessing?ye.timestamp:ke.now()}},Pa=(e,t,n=10)=>{let i="";const s=Math.max(Math.round(t/n),2);for(let r=0;r<s;r++)i+=Math.round(e(r/(s-1))*1e4)/1e4+", ";return`linear(${i.substring(0,i.length-2)})`},Ts=2e4;function Cs(e,t=50,n=Ts,i){let s=0,r=e.next(s);for(;!r.done&&s<n;)s+=t,r=e.next(s);return s>=n?1/0:s}function Iu(e,t=100,n){const i=n({...e,keyframes:[0,t]}),s=Math.min(Cs(i),Ts);return{type:"keyframes",ease:r=>i.next(s*r).value/t,duration:je(s)}}const oe={stiffness:100,damping:10,mass:1,velocity:0,duration:800,bounce:.3,visualDuration:.3,restSpeed:{granular:.01,default:2},restDelta:{granular:.005,default:.5},minDuration:.01,maxDuration:10,minDamping:.05,maxDamping:1};function Bi(e,t){return e*Math.sqrt(1-t*t)}const Vu=12;function $u(e,t,n){let i=n;for(let s=1;s<Vu;s++)i=i-e(i)/t(i);return i}const oi=.001;function Bu({duration:e=oe.duration,bounce:t=oe.bounce,velocity:n=oe.velocity,mass:i=oe.mass}){let s,r,o=1-t;o=Ue(oe.minDamping,oe.maxDamping,o),e=Ue(oe.minDuration,oe.maxDuration,je(e)),o<1?(s=l=>{const u=l*o,f=u*e,h=u-n,y=Bi(l,o),p=Math.exp(-f);return oi-h/y*p},r=l=>{const f=l*o*e,h=f*n+n,y=o*o*l*l*e,p=Math.exp(-f),g=Bi(l*l,o);return(-s(l)+oi>0?-1:1)*((h-y)*p)/g}):(s=l=>{const u=Math.exp(-l*e),f=(l-n)*e+1;return-oi+u*f},r=l=>{const u=Math.exp(-l*e),f=(n-l)*(e*e);return u*f});const a=5/e,c=$u(s,r,a);if(e=Ne(e),isNaN(c))return{stiffness:oe.stiffness,damping:oe.damping,duration:e};{const l=c*c*i;return{stiffness:l,damping:o*2*Math.sqrt(i*l),duration:e}}}const Fu=["duration","bounce"],_u=["stiffness","damping","mass"];function ho(e,t){return t.some(n=>e[n]!==void 0)}function Hu(e){let t={velocity:oe.velocity,stiffness:oe.stiffness,damping:oe.damping,mass:oe.mass,isResolvedFromDuration:!1,...e};if(!ho(e,_u)&&ho(e,Fu))if(t.velocity=0,e.visualDuration){const n=e.visualDuration,i=2*Math.PI/(n*1.2),s=i*i,r=2*Ue(.05,1,1-(e.bounce||0))*Math.sqrt(s);t={...t,mass:oe.mass,stiffness:s,damping:r}}else{const n=Bu({...e,velocity:0});t={...t,...n,mass:oe.mass},t.isResolvedFromDuration=!0}return t}function Nn(e=oe.visualDuration,t=oe.bounce){const n=typeof e!="object"?{visualDuration:e,keyframes:[0,1],bounce:t}:e;let{restSpeed:i,restDelta:s}=n;const r=n.keyframes[0],o=n.keyframes[n.keyframes.length-1],a={done:!1,value:r},{stiffness:c,damping:l,mass:u,duration:f,velocity:h,isResolvedFromDuration:y}=Hu({...n,velocity:-je(n.velocity||0)}),p=h||0,g=l/(2*Math.sqrt(c*u)),m=o-r,w=je(Math.sqrt(c/u)),k=g*w,v=Math.abs(m)<5;i||(i=v?oe.restSpeed.granular:oe.restSpeed.default),s||(s=v?oe.restDelta.granular:oe.restDelta.default);let x,T;if(g<1){const S=Bi(w,g),P=(p+k*m)/S,E=k*P+m*S,N=k*m-P*S;let V=-1,$=0,O=0;const F=C=>{if(C!==V){V=C;const U=Math.exp(-k*C),pe=Math.sin(S*C),L=Math.cos(S*C);$=o-U*(P*pe+m*L),O=U*(E*pe+N*L)}};x=C=>(F(C),$),T=C=>(F(C),O)}else if(g===1){x=P=>o-Math.exp(-w*P)*(m+(p+w*m)*P);const S=p+w*m;T=P=>Math.exp(-w*P)*(w*S*P-p)}else{const S=w*Math.sqrt(g*g-1);x=V=>{const $=Math.exp(-k*V),O=Math.min(S*V,300);return o-$*((p+k*m)*Math.sinh(O)+S*m*Math.cosh(O))/S};const P=(p+k*m)/S,E=k*P-m*S,N=k*m-P*S;T=V=>{const $=Math.exp(-k*V),O=Math.min(S*V,300);return $*(E*Math.sinh(O)+N*Math.cosh(O))}}const D={calculatedDuration:y&&f||null,velocity:S=>Ne(T(S)),next:S=>{const P=x(S);if(y)a.done=S>=f;else{const E=Ne(T(S));a.done=Math.abs(E)<=i&&Math.abs(o-P)<=s}return a.value=a.done?o:P,a},toString:()=>{const S=Math.min(Cs(D),Ts),P=Pa(E=>D.next(S*E).value,S,30);return S+"ms "+P},toTransition:()=>{}};return D}Nn.applyToOptions=e=>{const t=Iu(e,100,Nn);return e.ease=t.ease,e.duration=Ne(t.duration),e.type="keyframes",e};function Fi({keyframes:e,velocity:t=0,power:n=.8,timeConstant:i=325,bounceDamping:s=10,bounceStiffness:r=500,modifyTarget:o,min:a,max:c,restDelta:l=.5,restSpeed:u}){const f=e[0],h={done:!1,value:f},y=S=>S<a||S>c,p=S=>a===void 0?c:c===void 0||Math.abs(a-S)<Math.abs(c-S)?a:c;let g=n*t;const m=f+g,w=o===void 0?m:o(m);w!==m&&(g=w-f);const k=S=>-g*Math.exp(-S/i),v=S=>{const P=k(S);h.done=Math.abs(P)<=l,h.value=h.done?w:w+P};let x,T;const D=S=>{y(h.value)&&(x=S,T=Nn({keyframes:[h.value,p(h.value)],velocity:-k(S)/i*1e3,damping:s,stiffness:r,restDelta:l,restSpeed:u}))};return D(0),{calculatedDuration:null,next:S=>{let P=!1;return!T&&x===void 0&&(P=!0,v(S),D(S)),x!==void 0&&S>=x?T.next(S-x):(!P&&v(S),h)}}}function Wu(e,t,n){const i=[],s=n||tt.mix||Aa,r=e.length-1;for(let o=0;o<r;o++){let a=s(e[o],e[o+1]);if(t){const c=Array.isArray(t)?t[o]||Le:t;a=Zt(c,a)}i.push(a)}return i}function zu(e,t,{clamp:n=!0,ease:i,mixer:s}={}){const r=e.length;if(zn(r===t.length),r===1)return()=>t[0];if(r===2&&t[0]===t[1])return()=>t[1];const o=e[0]===e[1];e[0]>e[r-1]&&(e=[...e].reverse(),t=[...t].reverse());const a=Wu(t,i,s),c=a.length,l=u=>{if(o&&u<e[0])return t[0];let f=0;if(c>1)for(;f<e.length-2&&!(u<e[f+1]);f++);const h=Qt(e[f],e[f+1],u);return a[f](h)};return n?u=>l(Ue(e[0],e[r-1],u)):l}function Uu(e,t){const n=e[e.length-1];for(let i=1;i<=t;i++){const s=Qt(0,t,i);e.push(ee(n,1,s))}}function Gu(e){const t=[0];return Uu(t,e.length-1),t}function Ku(e,t){return e.map(n=>n*t)}function Qu(e,t){return e.map(()=>t||ga).splice(0,e.length-1)}function _t({duration:e=300,keyframes:t,times:n,ease:i="easeInOut"}){const s=iu(i)?i.map(oo):oo(i),r={done:!1,value:t[0]},o=Ku(n&&n.length===t.length?n:Gu(t),e),a=zu(o,t,{ease:Array.isArray(s)?s:Qu(t,s)});return{calculatedDuration:e,next:c=>(r.value=a(c),r.done=c>=e,r)}}const qu=5;function Yu(e,t,n){const i=Math.max(t-qu,0);return aa(n-e(i),t-i)}const Xu=e=>e!==null;function Un(e,{repeat:t,repeatType:n="loop"},i,s=1){const r=e.filter(Xu),a=s<0||t&&n!=="loop"&&t%2===1?0:r.length-1;return!a||i===void 0?r[a]:i}const Zu={decay:Fi,inertia:Fi,tween:_t,keyframes:_t,spring:Nn};function Ea(e){typeof e.type=="string"&&(e.type=Zu[e.type])}class As{constructor(){this.updateFinished()}get finished(){return this._finished}updateFinished(){this._finished=new Promise(t=>{this.resolve=t})}notifyFinished(){this.resolve()}then(t,n){return this.finished.then(t,n)}}const Ju=e=>e/100;class In extends As{constructor(t){super(),this.state="idle",this.startTime=null,this.isStopped=!1,this.currentTime=0,this.holdTime=null,this.playbackSpeed=1,this.delayState={done:!1,value:void 0},this.stop=()=>{const{motionValue:n}=this.options;n&&n.updatedAt!==ke.now()&&this.tick(ke.now()),this.isStopped=!0,this.state!=="idle"&&(this.teardown(),this.options.onStop?.())},this.options=t,this.initAnimation(),this.play(),t.autoplay===!1&&this.pause()}initAnimation(){const{options:t}=this;Ea(t);const{type:n=_t,repeat:i=0,repeatDelay:s=0,repeatType:r,velocity:o=0}=t;let{keyframes:a}=t;const c=n||_t;c!==_t&&typeof a[0]!="number"&&(this.mixKeyframes=Zt(Ju,Aa(a[0],a[1])),a=[0,100]);const l=c({...t,keyframes:a});r==="mirror"&&(this.mirroredGenerator=c({...t,keyframes:[...a].reverse(),velocity:-o})),l.calculatedDuration===null&&(l.calculatedDuration=Cs(l));const{calculatedDuration:u}=l;this.calculatedDuration=u,this.resolvedDuration=u+s,this.totalDuration=this.resolvedDuration*(i+1)-s,this.generator=l}updateTime(t){const n=Math.round(t-this.startTime)*this.playbackSpeed;this.holdTime!==null?this.currentTime=this.holdTime:this.currentTime=n}tick(t,n=!1){const{generator:i,totalDuration:s,mixKeyframes:r,mirroredGenerator:o,resolvedDuration:a,calculatedDuration:c}=this;if(this.startTime===null)return i.next(0);const{delay:l=0,keyframes:u,repeat:f,repeatType:h,repeatDelay:y,type:p,onUpdate:g,finalKeyframe:m}=this.options;this.speed>0?this.startTime=Math.min(this.startTime,t):this.speed<0&&(this.startTime=Math.min(t-s/this.speed,this.startTime)),n?this.currentTime=t:this.updateTime(t);const w=this.currentTime-l*(this.playbackSpeed>=0?1:-1),k=this.playbackSpeed>=0?w<0:w>s;this.currentTime=Math.max(w,0),this.state==="finished"&&this.holdTime===null&&(this.currentTime=s);let v=this.currentTime,x=i;if(f){const P=Math.min(this.currentTime,s)/a;let E=Math.floor(P),N=P%1;!N&&P>=1&&(N=1),N===1&&E--,E=Math.min(E,f+1),E%2&&(h==="reverse"?(N=1-N,y&&(N-=y/a)):h==="mirror"&&(x=o)),v=Ue(0,1,N)*a}let T;k?(this.delayState.value=u[0],T=this.delayState):T=x.next(v),r&&!k&&(T.value=r(T.value));let{done:D}=T;!k&&c!==null&&(D=this.playbackSpeed>=0?this.currentTime>=s:this.currentTime<=0);const S=this.holdTime===null&&(this.state==="finished"||this.state==="running"&&D);return S&&p!==Fi&&(T.value=Un(u,this.options,m,this.speed)),g&&g(T.value),S&&this.finish(),T}then(t,n){return this.finished.then(t,n)}get duration(){return je(this.calculatedDuration)}get iterationDuration(){const{delay:t=0}=this.options||{};return this.duration+je(t)}get time(){return je(this.currentTime)}set time(t){t=Ne(t),this.currentTime=t,this.startTime===null||this.holdTime!==null||this.playbackSpeed===0?this.holdTime=t:this.driver&&(this.startTime=this.driver.now()-t/this.playbackSpeed),this.driver?this.driver.start(!1):(this.startTime=0,this.state="paused",this.holdTime=t,this.tick(t))}getGeneratorVelocity(){const t=this.currentTime;if(t<=0)return this.options.velocity||0;if(this.generator.velocity)return this.generator.velocity(t);const n=this.generator.next(t).value;return Yu(i=>this.generator.next(i).value,t,n)}get speed(){return this.playbackSpeed}set speed(t){const n=this.playbackSpeed!==t;n&&this.driver&&this.updateTime(ke.now()),this.playbackSpeed=t,n&&this.driver&&(this.time=je(this.currentTime))}play(){if(this.isStopped)return;const{driver:t=Nu,startTime:n}=this.options;this.driver||(this.driver=t(s=>this.tick(s))),this.options.onPlay?.();const i=this.driver.now();this.state==="finished"?(this.updateFinished(),this.startTime=i):this.holdTime!==null?this.startTime=i-this.holdTime:this.startTime||(this.startTime=n??i),this.state==="finished"&&this.speed<0&&(this.startTime+=this.calculatedDuration),this.holdTime=null,this.state="running",this.driver.start()}pause(){this.state="paused",this.updateTime(ke.now()),this.holdTime=this.currentTime}complete(){this.state!=="running"&&this.play(),this.state="finished",this.holdTime=null}finish(){this.notifyFinished(),this.teardown(),this.state="finished",this.options.onComplete?.()}cancel(){this.holdTime=null,this.startTime=0,this.tick(0),this.teardown(),this.options.onCancel?.()}teardown(){this.state="idle",this.stopDriver(),this.startTime=this.holdTime=null}stopDriver(){this.driver&&(this.driver.stop(),this.driver=void 0)}sample(t){return this.startTime=0,this.tick(t,!0)}attachTimeline(t){return this.options.allowFlatten&&(this.options.type="keyframes",this.options.ease="linear",this.initAnimation()),this.driver?.stop(),t.observe(this)}}function ed(e){for(let t=1;t<e.length;t++)e[t]??(e[t]=e[t-1])}const dt=e=>e*180/Math.PI,_i=e=>{const t=dt(Math.atan2(e[1],e[0]));return Hi(t)},td={x:4,y:5,translateX:4,translateY:5,scaleX:0,scaleY:3,scale:e=>(Math.abs(e[0])+Math.abs(e[3]))/2,rotate:_i,rotateZ:_i,skewX:e=>dt(Math.atan(e[1])),skewY:e=>dt(Math.atan(e[2])),skew:e=>(Math.abs(e[1])+Math.abs(e[2]))/2},Hi=e=>(e=e%360,e<0&&(e+=360),e),fo=_i,po=e=>Math.sqrt(e[0]*e[0]+e[1]*e[1]),mo=e=>Math.sqrt(e[4]*e[4]+e[5]*e[5]),nd={x:12,y:13,z:14,translateX:12,translateY:13,translateZ:14,scaleX:po,scaleY:mo,scale:e=>(po(e)+mo(e))/2,rotateX:e=>Hi(dt(Math.atan2(e[6],e[5]))),rotateY:e=>Hi(dt(Math.atan2(-e[2],e[0]))),rotateZ:fo,rotate:fo,skewX:e=>dt(Math.atan(e[4])),skewY:e=>dt(Math.atan(e[1])),skew:e=>(Math.abs(e[1])+Math.abs(e[4]))/2};function Wi(e){return e.includes("scale")?1:0}function zi(e,t){if(!e||e==="none")return Wi(t);const n=e.match(/^matrix3d\(([-\d.e\s,]+)\)$/u);let i,s;if(n)i=nd,s=n;else{const a=e.match(/^matrix\(([-\d.e\s,]+)\)$/u);i=td,s=a}if(!s)return Wi(t);const r=i[t],o=s[1].split(",").map(sd);return typeof r=="function"?r(o):o[r]}const id=(e,t)=>{const{transform:n="none"}=getComputedStyle(e);return zi(n,t)};function sd(e){return parseFloat(e.trim())}const Mt=["transformPerspective","x","y","z","translateX","translateY","translateZ","scale","scaleX","scaleY","rotate","rotateX","rotateY","rotateZ","skew","skewX","skewY"],Ot=new Set([...Mt,"pathRotation"]),go=e=>e===Dt||e===B,od=new Set(["x","y","z"]),rd=Mt.filter(e=>!od.has(e));function ad(e){const t=[];return rd.forEach(n=>{const i=e.getValue(n);i!==void 0&&(t.push([n,i.get()]),i.set(n.startsWith("scale")?1:0))}),t}const et={width:({x:e},{paddingLeft:t="0",paddingRight:n="0",boxSizing:i})=>{const s=e.max-e.min;return i==="border-box"?s:s-parseFloat(t)-parseFloat(n)},height:({y:e},{paddingTop:t="0",paddingBottom:n="0",boxSizing:i})=>{const s=e.max-e.min;return i==="border-box"?s:s-parseFloat(t)-parseFloat(n)},top:(e,{top:t})=>parseFloat(t),left:(e,{left:t})=>parseFloat(t),bottom:({y:e},{top:t})=>parseFloat(t)+(e.max-e.min),right:({x:e},{left:t})=>parseFloat(t)+(e.max-e.min),x:(e,{transform:t})=>zi(t,"x"),y:(e,{transform:t})=>zi(t,"y")};et.translateX=et.x;et.translateY=et.y;const ht=new Set;let Ui=!1,Gi=!1,Ki=!1;function Da(){if(Gi){const e=Array.from(ht).filter(i=>i.needsMeasurement),t=new Set(e.map(i=>i.element)),n=new Map;t.forEach(i=>{const s=ad(i);s.length&&(n.set(i,s),i.render())}),e.forEach(i=>i.measureInitialState()),t.forEach(i=>{i.render();const s=n.get(i);s&&s.forEach(([r,o])=>{i.getValue(r)?.set(o)})}),e.forEach(i=>i.measureEndState()),e.forEach(i=>{i.suspendedScrollY!==void 0&&window.scrollTo(0,i.suspendedScrollY)})}Gi=!1,Ui=!1,ht.forEach(e=>e.complete(Ki)),ht.clear()}function Ma(){ht.forEach(e=>{e.readKeyframes(),e.needsMeasurement&&(Gi=!0)})}function ld(){Ki=!0,Ma(),Da(),Ki=!1}class Ps{constructor(t,n,i,s,r,o=!1){this.state="pending",this.isAsync=!1,this.needsMeasurement=!1,this.unresolvedKeyframes=[...t],this.onComplete=n,this.name=i,this.motionValue=s,this.element=r,this.isAsync=o}scheduleResolve(){this.state="scheduled",this.isAsync?(ht.add(this),Ui||(Ui=!0,te.read(Ma),te.resolveKeyframes(Da))):(this.readKeyframes(),this.complete())}readKeyframes(){const{unresolvedKeyframes:t,name:n,element:i,motionValue:s}=this;if(t[0]===null){const r=s?.get(),o=t[t.length-1];if(r!==void 0)t[0]=r;else if(i&&n){const a=i.readValue(n,o);a!=null&&(t[0]=a)}t[0]===void 0&&(t[0]=o),s&&r===void 0&&s.set(t[0])}ed(t)}setFinalKeyframe(){}measureInitialState(){}renderEndStyles(){}measureEndState(){}complete(t=!1){this.state="complete",this.onComplete(this.unresolvedKeyframes,this.finalKeyframe,t),ht.delete(this)}cancel(){this.state==="scheduled"&&(ht.delete(this),this.state="pending")}resume(){this.state==="pending"&&this.scheduleResolve()}}const cd=e=>e.startsWith("--");function Oa(e,t,n){cd(t)?e.style.setProperty(t,n):e.style[t]=n}const ud={};function Ra(e,t){const n=ra(e);return()=>ud[t]??n()}const dd=Ra(()=>window.ScrollTimeline!==void 0,"scrollTimeline"),ja=Ra(()=>{try{document.createElement("div").animate({opacity:0},{easing:"linear(0, 1)"})}catch{return!1}return!0},"linearEasing"),Vt=([e,t,n,i])=>`cubic-bezier(${e}, ${t}, ${n}, ${i})`,yo={linear:"linear",ease:"ease",easeIn:"ease-in",easeOut:"ease-out",easeInOut:"ease-in-out",circIn:Vt([0,.65,.55,1]),circOut:Vt([.55,0,1,.45]),backIn:Vt([.31,.01,.66,-.59]),backOut:Vt([.33,1.53,.69,.99])};function La(e,t){if(e)return typeof e=="function"?ja()?Pa(e,t):"ease-out":ya(e)?Vt(e):Array.isArray(e)?e.map(n=>La(n,t)||yo.easeOut):yo[e]}function hd(e,t,n,{delay:i=0,duration:s=300,repeat:r=0,repeatType:o="loop",ease:a="easeOut",times:c}={},l=void 0){const u={[t]:n};c&&(u.offset=c);const f=La(a,s);Array.isArray(f)&&(u.easing=f);const h={delay:i,duration:s,easing:Array.isArray(f)?"linear":f,fill:"both",iterations:r+1,direction:o==="reverse"?"alternate":"normal"};return l&&(h.pseudoElement=l),e.animate(u,h)}function Na(e){return typeof e=="function"&&"applyToOptions"in e}function fd({type:e,...t}){return Na(e)&&ja()?e.applyToOptions(t):(t.duration??(t.duration=300),t.ease??(t.ease="easeOut"),t)}class Ia extends As{constructor(t){if(super(),this.finishedTime=null,this.isStopped=!1,this.manualStartTime=null,!t)return;const{element:n,name:i,keyframes:s,pseudoElement:r,allowFlatten:o=!1,finalKeyframe:a,onComplete:c}=t;this.isPseudoElement=!!r,this.allowFlatten=o,this.options=t,zn(typeof t.type!="string");const l=fd(t);this.animation=hd(n,i,s,l,r),l.autoplay===!1&&this.animation.pause(),this.animation.onfinish=()=>{if(this.finishedTime=this.time,!r){const u=Un(s,this.options,a,this.speed);this.updateMotionValue&&this.updateMotionValue(u),Oa(n,i,u),this.animation.cancel()}c?.(),this.notifyFinished()}}play(){this.isStopped||(this.manualStartTime=null,this.animation.play(),this.state==="finished"&&this.updateFinished())}pause(){this.animation.pause()}complete(){this.animation.finish?.()}cancel(){try{this.animation.cancel()}catch{}}stop(){if(this.isStopped)return;this.isStopped=!0;const{state:t}=this;t==="idle"||t==="finished"||(this.updateMotionValue?this.updateMotionValue():this.commitStyles(),this.isPseudoElement||this.cancel())}commitStyles(){const t=this.options?.element;!this.isPseudoElement&&t?.isConnected&&this.animation.commitStyles?.()}get duration(){const t=this.animation.effect?.getComputedTiming?.().duration||0;return je(Number(t))}get iterationDuration(){const{delay:t=0}=this.options||{};return this.duration+je(t)}get time(){return je(Number(this.animation.currentTime)||0)}set time(t){const n=this.finishedTime!==null;this.manualStartTime=null,this.finishedTime=null,this.animation.currentTime=Ne(t),n&&this.animation.pause()}get speed(){return this.animation.playbackRate}set speed(t){t<0&&(this.finishedTime=null),this.animation.playbackRate=t}get state(){return this.finishedTime!==null?"finished":this.animation.playState}get startTime(){return this.manualStartTime??Number(this.animation.startTime)}set startTime(t){this.manualStartTime=this.animation.startTime=t}attachTimeline({timeline:t,rangeStart:n,rangeEnd:i,observe:s}){return this.allowFlatten&&this.animation.effect?.updateTiming({easing:"linear"}),this.animation.onfinish=null,t&&dd()?(this.animation.timeline=t,n&&(this.animation.rangeStart=n),i&&(this.animation.rangeEnd=i),Le):s(this)}}const Va={anticipate:fa,backInOut:ha,circInOut:ma};function pd(e){return e in Va}function md(e){typeof e.ease=="string"&&pd(e.ease)&&(e.ease=Va[e.ease])}const ri=10;class gd extends Ia{constructor(t){md(t),Ea(t),super(t),t.startTime!==void 0&&t.autoplay!==!1&&(this.startTime=t.startTime),this.options=t}updateMotionValue(t){const{motionValue:n,onUpdate:i,onComplete:s,element:r,...o}=this.options;if(!n)return;if(t!==void 0){n.set(t);return}const a=new In({...o,autoplay:!1}),c=Math.max(ri,ke.now()-this.startTime),l=Ue(0,ri,c-ri),u=a.sample(c).value,{name:f}=this.options;r&&f&&Oa(r,f,u),n.setWithVelocity(a.sample(Math.max(0,c-l)).value,u,l),a.stop()}}const wo=(e,t)=>t==="zIndex"?!1:!!(typeof e=="number"||Array.isArray(e)||typeof e=="string"&&(Be.test(e)||e==="0")&&!e.startsWith("url("));function yd(e){const t=e[0];if(e.length===1)return!0;for(let n=0;n<e.length;n++)if(e[n]!==t)return!0}function wd(e,t,n,i){const s=e[0];if(s===null)return!1;if(t==="display"||t==="visibility")return!0;const r=e[e.length-1],o=wo(s,t),a=wo(r,t);return!o||!a?!1:yd(e)||(n==="spring"||Na(n))&&i}function Qi(e){e.duration=0,e.type="keyframes"}const $a=new Set(["opacity","clipPath","filter","transform","backgroundColor"]),bd=/^(?:oklch|oklab|lab|lch|color|color-mix|light-dark)\(/;function xd(e){for(let t=0;t<e.length;t++)if(typeof e[t]=="string"&&bd.test(e[t]))return!0;return!1}const vd=new Set(["color","backgroundColor","outlineColor","fill","stroke","borderColor","borderTopColor","borderRightColor","borderBottomColor","borderLeftColor"]),kd=ra(()=>Object.hasOwnProperty.call(Element.prototype,"animate"));function Sd(e){const{motionValue:t,name:n,repeatDelay:i,repeatType:s,damping:r,type:o,keyframes:a}=e,c=t?.owner?.current;if(!(c instanceof HTMLElement)&&!(c instanceof SVGElement))return!1;const{onUpdate:l,transformTemplate:u}=t.owner.getProps();return kd()&&n&&($a.has(n)||vd.has(n)&&xd(a))&&(n!=="transform"||!u)&&!l&&!i&&s!=="mirror"&&r!==0&&o!=="inertia"}const Td=40;class Cd extends As{constructor({autoplay:t=!0,delay:n=0,type:i="keyframes",repeat:s=0,repeatDelay:r=0,repeatType:o="loop",keyframes:a,name:c,motionValue:l,element:u,...f}){super(),this.stop=()=>{this._animation&&(this._animation.stop(),this.stopTimeline?.()),this.keyframeResolver?.cancel()},this.createdAt=ke.now();const h={autoplay:t,delay:n,type:i,repeat:s,repeatDelay:r,repeatType:o,name:c,motionValue:l,element:u,...f},y=u?.KeyframeResolver||Ps;this.keyframeResolver=new y(a,(p,g,m)=>this.onKeyframesResolved(p,g,h,!m),c,l,u),this.keyframeResolver?.scheduleResolve()}onKeyframesResolved(t,n,i,s){this.keyframeResolver=void 0;const{name:r,type:o,velocity:a,delay:c,isHandoff:l,onUpdate:u}=i;this.resolvedAt=ke.now();let f=!0;wd(t,r,o,a)||(f=!1,(tt.instantAnimations||!c)&&u?.(Un(t,i,n)),t[0]=t[t.length-1],Qi(i),i.repeat=0);const y={startTime:s?this.resolvedAt?this.resolvedAt-this.createdAt>Td?this.resolvedAt:this.createdAt:this.createdAt:void 0,finalKeyframe:n,...i,keyframes:t},p=f&&!l&&Sd(y),g=y.motionValue?.owner?.current;let m;if(p)try{m=new gd({...y,element:g})}catch{m=new In(y)}else m=new In(y);m.finished.then(()=>{this.notifyFinished()}).catch(Le),this.pendingTimeline&&(this.stopTimeline=m.attachTimeline(this.pendingTimeline),this.pendingTimeline=void 0),this._animation=m}get finished(){return this._animation?this.animation.finished:this._finished}then(t,n){return this.finished.finally(t).then(()=>{})}get animation(){return this._animation||(this.keyframeResolver?.resume(),ld()),this._animation}get duration(){return this.animation.duration}get iterationDuration(){return this.animation.iterationDuration}get time(){return this.animation.time}set time(t){this.animation.time=t}get speed(){return this.animation.speed}get state(){return this.animation.state}set speed(t){this.animation.speed=t}get startTime(){return this.animation.startTime}attachTimeline(t){return this._animation?this.stopTimeline=this.animation.attachTimeline(t):this.pendingTimeline=t,()=>this.stop()}play(){this.animation.play()}pause(){this.animation.pause()}complete(){this.animation.complete()}cancel(){this._animation&&this.animation.cancel(),this.keyframeResolver?.cancel()}}function Ba(e,t,n,i=0,s=1){const r=Array.from(e).sort((l,u)=>l.sortNodePosition(u)).indexOf(t),o=e.size,a=(o-1)*i;return typeof n=="function"?n(r,o):s===1?r*i:a-r*i}const bo=30,Ad=e=>!isNaN(parseFloat(e));class Pd{constructor(t,n={}){this.canTrackVelocity=null,this.events={},this.updateAndNotify=i=>{const s=ke.now();if(this.updatedAt!==s&&this.setPrevFrameValue(),this.prev=this.current,this.setCurrent(i),this.current!==this.prev&&(this.events.change?.notify(this.current),this.dependents))for(const r of this.dependents)r.dirty()},this.hasAnimated=!1,this.setCurrent(t),this.owner=n.owner}setCurrent(t){this.current=t,this.updatedAt=ke.now(),this.canTrackVelocity===null&&t!==void 0&&(this.canTrackVelocity=Ad(this.current))}setPrevFrameValue(t=this.current){this.prevFrameValue=t,this.prevUpdatedAt=this.updatedAt}onChange(t){return this.on("change",t)}on(t,n){this.events[t]||(this.events[t]=new ys);const i=this.events[t].add(n);return t==="change"?()=>{i(),te.read(()=>{this.events.change.getSize()||this.stop()})}:i}clearListeners(){for(const t in this.events)this.events[t].clear()}attach(t,n){this.passiveEffect=t,this.stopPassiveEffect=n}set(t){this.passiveEffect?this.passiveEffect(t,this.updateAndNotify):this.updateAndNotify(t)}setWithVelocity(t,n,i){this.set(n),this.prev=void 0,this.prevFrameValue=t,this.prevUpdatedAt=this.updatedAt-i}jump(t,n=!0){this.updateAndNotify(t),this.prev=t,this.prevUpdatedAt=this.prevFrameValue=void 0,n&&this.stop(),this.stopPassiveEffect&&this.stopPassiveEffect()}dirty(){this.events.change?.notify(this.current)}addDependent(t){this.dependents||(this.dependents=new Set),this.dependents.add(t)}removeDependent(t){this.dependents&&this.dependents.delete(t)}get(){return this.current}getPrevious(){return this.prev}getVelocity(){const t=ke.now();if(!this.canTrackVelocity||this.prevFrameValue===void 0||t-this.updatedAt>bo)return 0;const n=Math.min(this.updatedAt-this.prevUpdatedAt,bo);return aa(parseFloat(this.current)-parseFloat(this.prevFrameValue),n)}start(t){return this.stop(),new Promise(n=>{this.hasAnimated=!0,this.animation=t(n),this.events.animationStart&&this.events.animationStart.notify()}).then(()=>{this.events.animationComplete&&this.events.animationComplete.notify(),this.clearAnimation()})}stop(){this.animation&&(this.animation.stop(),this.events.animationCancel&&this.events.animationCancel.notify()),this.clearAnimation()}isAnimating(){return!!this.animation}clearAnimation(){delete this.animation}destroy(){this.dependents?.clear(),this.events.destroy?.notify(),this.clearListeners(),this.stop(),this.stopPassiveEffect&&this.stopPassiveEffect()}}function Pt(e,t){return new Pd(e,t)}function Fa(e,t){if(e?.inherit&&t){const{inherit:n,...i}=e;return{...t,...i}}return e}function Es(e,t){const n=e?.[t]??e?.default??e;return n!==e?Fa(n,e):n}const Ed={type:"spring",stiffness:500,damping:25,restSpeed:10},Dd=e=>({type:"spring",stiffness:550,damping:e===0?2*Math.sqrt(550):30,restSpeed:10}),Md={type:"keyframes",duration:.8},Od={type:"keyframes",ease:[.25,.1,.35,1],duration:.3},Rd=(e,{keyframes:t})=>t.length>2?Md:Ot.has(e)?e.startsWith("scale")?Dd(t[1]):Ed:Od,jd=new Set(["when","delay","delayChildren","staggerChildren","staggerDirection","repeat","repeatType","repeatDelay","from","elapsed"]);function Ld(e){for(const t in e)if(!jd.has(t))return!0;return!1}const Ds=(e,t,n,i={},s,r)=>o=>{const a=Es(i,e)||{},c=a.delay||i.delay||0;let{elapsed:l=0}=i;l=l-Ne(c);const u={keyframes:Array.isArray(n)?n:[null,n],ease:"easeOut",velocity:t.getVelocity(),...a,delay:-l,onUpdate:h=>{t.set(h),a.onUpdate&&a.onUpdate(h)},onComplete:()=>{o(),a.onComplete&&a.onComplete()},name:e,motionValue:t,element:r?void 0:s};Ld(a)||Object.assign(u,Rd(e,u)),u.duration&&(u.duration=Ne(u.duration)),u.repeatDelay&&(u.repeatDelay=Ne(u.repeatDelay)),u.from!==void 0&&(u.keyframes[0]=u.from);let f=!1;if((u.type===!1||u.duration===0&&!u.repeatDelay)&&(Qi(u),u.delay===0&&(f=!0)),(tt.instantAnimations||tt.skipAnimations||s?.shouldSkipAnimations||a.skipAnimations)&&(f=!0,Qi(u),u.delay=0),u.allowFlatten=!a.type&&!a.ease,f&&!r&&t.get()!==void 0){const h=Un(u.keyframes,a);if(h!==void 0){te.update(()=>{u.onUpdate(h),u.onComplete()});return}}return a.isSync?new In(u):new Cd(u)},Nd=/^var\(--(?:([\w-]+)|([\w-]+), ?([a-zA-Z\d ()%#.,-]+))\)/u;function Id(e){const t=Nd.exec(e);if(!t)return[,];const[,n,i,s]=t;return[`--${n??i}`,s]}function _a(e,t,n=1){const[i,s]=Id(e);if(!i)return;const r=window.getComputedStyle(t).getPropertyValue(i);if(r){const o=r.trim();return ia(o)?parseFloat(o):o}return xs(s)?_a(s,t,n+1):s}function xo(e){const t=[{},{}];return e?.values.forEach((n,i)=>{t[0][i]=n.get(),t[1][i]=n.getVelocity()}),t}function Ms(e,t,n,i){if(typeof t=="function"){const[s,r]=xo(i);t=t(n!==void 0?n:e.custom,s,r)}if(typeof t=="string"&&(t=e.variants&&e.variants[t]),typeof t=="function"){const[s,r]=xo(i);t=t(n!==void 0?n:e.custom,s,r)}return t}function ft(e,t,n){const i=e.getProps();return Ms(i,t,n!==void 0?n:i.custom,e)}const Ha=new Set(["width","height","top","left","right","bottom",...Mt]),qi=e=>Array.isArray(e);function Vd(e,t,n){e.hasValue(t)?e.getValue(t).set(n):e.addValue(t,Pt(n))}function $d(e){return qi(e)?e[e.length-1]||0:e}function Bd(e,t){const n=ft(e,t);let{transitionEnd:i={},transition:s={},...r}=n||{};r={...r,...i};for(const o in r){const a=$d(r[o]);Vd(e,o,a)}}const we=e=>!!(e&&e.getVelocity);function Fd(e){return!!(we(e)&&e.add)}function Yi(e,t){const n=e.getValue("willChange");if(Fd(n))return n.add(t);if(!n&&tt.WillChange){const i=new tt.WillChange("auto");e.addValue("willChange",i),i.add(t)}}function Os(e){return e.replace(/([A-Z])/g,t=>`-${t.toLowerCase()}`)}const _d="framerAppearId",Wa="data-"+Os(_d);function za(e){return e.props[Wa]}const Hd=typeof window<"u";function Wd({protectedKeys:e,needsAnimating:t},n){const i=e.hasOwnProperty(n)&&t[n]!==!0;return t[n]=!1,i}function Ua(e,t,{delay:n=0,transitionOverride:i,type:s}={}){let{transition:r,transitionEnd:o,...a}=t;const c=e.getDefaultTransition();r=r?Fa(r,c):c;const l=r?.reduceMotion,u=r?.skipAnimations;i&&(r=i);const f=[],h=s&&e.animationState&&e.animationState.getState()[s],y=r?.path;y&&y.animateVisualElement(e,a,r,n,f);for(const p in a){const g=e.getValue(p,e.latestValues[p]??null),m=a[p];if(m===void 0||h&&Wd(h,p))continue;const w={delay:n,...Es(r||{},p)};u&&(w.skipAnimations=!0);const k=g.get();if(k!==void 0&&!g.isAnimating()&&!Array.isArray(m)&&m===k&&!w.velocity){te.update(()=>g.set(m));continue}let v=!1;if(Hd&&window.MotionHandoffAnimation){const D=za(e);if(D){const S=window.MotionHandoffAnimation(D,p,te);S!==null&&(w.startTime=S,v=!0)}}Yi(e,p);const x=l??e.shouldReduceMotion;g.start(Ds(p,g,m,x&&Ha.has(p)?{type:!1}:w,e,v));const T=g.animation;T&&f.push(T)}if(o){const p=()=>te.update(()=>{o&&Bd(e,o)});f.length?Promise.all(f).then(p):p()}return f}function Xi(e,t,n={}){const i=ft(e,t,n.type==="exit"?e.presenceContext?.custom:void 0);let{transition:s=e.getDefaultTransition()||{}}=i||{};n.transitionOverride&&(s=n.transitionOverride);const r=i?()=>Promise.all(Ua(e,i,n)):()=>Promise.resolve(),o=e.variantChildren&&e.variantChildren.size?(c=0)=>{const{delayChildren:l=0,staggerChildren:u,staggerDirection:f}=s;return zd(e,t,c,l,u,f,n)}:()=>Promise.resolve(),{when:a}=s;if(a){const[c,l]=a==="beforeChildren"?[r,o]:[o,r];return c().then(()=>l())}else return Promise.all([r(),o(n.delay)])}function zd(e,t,n=0,i=0,s=0,r=1,o){const a=[];for(const c of e.variantChildren)c.notify("AnimationStart",t),a.push(Xi(c,t,{...o,delay:n+(typeof i=="function"?0:i)+Ba(e.variantChildren,c,i,s,r)}).then(()=>c.notify("AnimationComplete",t)));return Promise.all(a)}function Ud(e,t,n={}){e.notify("AnimationStart",t);let i;if(Array.isArray(t)){const s=t.map(r=>Xi(e,r,n));i=Promise.all(s)}else if(typeof t=="string")i=Xi(e,t,n);else{const s=typeof t=="function"?ft(e,t,n.custom):t;i=Promise.all(Ua(e,s,n))}return i.then(()=>{e.notify("AnimationComplete",t)})}const Gd={test:e=>e==="auto",parse:e=>e},Ga=e=>t=>t.test(e),Ka=[Dt,B,ze,Ke,gu,mu,Gd],vo=e=>Ka.find(Ga(e));function Kd(e){return typeof e=="number"?e===0:e!==null?e==="none"||e==="0"||oa(e):!0}const Qd=new Set(["brightness","contrast","saturate","opacity"]);function qd(e){const[t,n]=e.slice(0,-1).split("(");if(t==="drop-shadow")return e;const[i]=n.match(vs)||[];if(!i)return e;const s=n.replace(i,"");let r=Qd.has(t)?1:0;return i!==n&&(r*=100),t+"("+r+s+")"}const Yd=/\b([a-z-]*)\(.*?\)/gu,Zi={...Be,getAnimatableNone:e=>{const t=e.match(Yd);return t?t.map(qd).join(" "):e}},Ji={...Be,getAnimatableNone:e=>{const t=Be.parse(e);return Be.createTransformer(e)(t.map(i=>typeof i=="number"?0:typeof i=="object"?{...i,alpha:1}:i))}},ko={...Dt,transform:Math.round},Xd={rotate:Ke,pathRotation:Ke,rotateX:Ke,rotateY:Ke,rotateZ:Ke,scale:an,scaleX:an,scaleY:an,scaleZ:an,skew:Ke,skewX:Ke,skewY:Ke,distance:B,translateX:B,translateY:B,translateZ:B,x:B,y:B,z:B,perspective:B,transformPerspective:B,opacity:qt,originX:ao,originY:ao,originZ:B},Vn={borderWidth:B,borderTopWidth:B,borderRightWidth:B,borderBottomWidth:B,borderLeftWidth:B,borderRadius:B,borderTopLeftRadius:B,borderTopRightRadius:B,borderBottomRightRadius:B,borderBottomLeftRadius:B,width:B,maxWidth:B,height:B,maxHeight:B,top:B,right:B,bottom:B,left:B,inset:B,insetBlock:B,insetBlockStart:B,insetBlockEnd:B,insetInline:B,insetInlineStart:B,insetInlineEnd:B,padding:B,paddingTop:B,paddingRight:B,paddingBottom:B,paddingLeft:B,paddingBlock:B,paddingBlockStart:B,paddingBlockEnd:B,paddingInline:B,paddingInlineStart:B,paddingInlineEnd:B,margin:B,marginTop:B,marginRight:B,marginBottom:B,marginLeft:B,marginBlock:B,marginBlockStart:B,marginBlockEnd:B,marginInline:B,marginInlineStart:B,marginInlineEnd:B,fontSize:B,backgroundPositionX:B,backgroundPositionY:B,...Xd,zIndex:ko,fillOpacity:qt,strokeOpacity:qt,numOctaves:ko},Zd={...Vn,color:ce,backgroundColor:ce,outlineColor:ce,fill:ce,stroke:ce,borderColor:ce,borderTopColor:ce,borderRightColor:ce,borderBottomColor:ce,borderLeftColor:ce,filter:Zi,WebkitFilter:Zi,mask:Ji,WebkitMask:Ji},Qa=e=>Zd[e],Jd=new Set([Zi,Ji]);function qa(e,t){let n=Qa(e);return Jd.has(n)||(n=Be),n.getAnimatableNone?n.getAnimatableNone(t):void 0}const eh=new Set(["auto","none","0"]);function th(e,t,n){let i=0,s;for(;i<e.length&&!s;){const r=e[i];typeof r=="string"&&!eh.has(r)&&At(r).values.length&&(s=e[i]),i++}if(s&&n)for(const r of t)e[r]=qa(n,s)}class nh extends Ps{constructor(t,n,i,s,r){super(t,n,i,s,r,!0)}readKeyframes(){const{unresolvedKeyframes:t,element:n,name:i}=this;if(!n||!n.current)return;super.readKeyframes();for(let u=0;u<t.length;u++){let f=t[u];if(typeof f=="string"&&(f=f.trim(),xs(f))){const h=_a(f,n.current);h!==void 0&&(t[u]=h),u===t.length-1&&(this.finalKeyframe=f)}}if(this.resolveNoneKeyframes(),!Ha.has(i)||t.length!==2)return;const[s,r]=t,o=vo(s),a=vo(r),c=ro(s),l=ro(r);if(c!==l&&et[i]){this.needsMeasurement=!0;return}if(o!==a)if(go(o)&&go(a))for(let u=0;u<t.length;u++){const f=t[u];typeof f=="string"&&(t[u]=parseFloat(f))}else et[i]&&(this.needsMeasurement=!0)}resolveNoneKeyframes(){const{unresolvedKeyframes:t,name:n}=this,i=[];for(let s=0;s<t.length;s++)(t[s]===null||Kd(t[s]))&&i.push(s);i.length&&th(t,i,n)}measureInitialState(){const{element:t,unresolvedKeyframes:n,name:i}=this;if(!t||!t.current)return;i==="height"&&(this.suspendedScrollY=window.pageYOffset),this.measuredOrigin=et[i](t.measureViewportBox(),window.getComputedStyle(t.current)),n[0]=this.measuredOrigin;const s=n[n.length-1];s!==void 0&&t.getValue(i,s).jump(s,!1)}measureEndState(){const{element:t,name:n,unresolvedKeyframes:i}=this;if(!t||!t.current)return;const s=t.getValue(n);s&&s.jump(this.measuredOrigin,!1);const r=i.length-1,o=i[r];i[r]=et[n](t.measureViewportBox(),window.getComputedStyle(t.current)),o!==null&&this.finalKeyframe===void 0&&(this.finalKeyframe=o),this.removedTransforms?.length&&this.removedTransforms.forEach(([a,c])=>{t.getValue(a).set(c)}),this.resolveNoneKeyframes()}}const Rs=["borderTopLeftRadius","borderTopRightRadius","borderBottomRightRadius","borderBottomLeftRadius"];function Ya(e,t,n){if(e==null)return[];if(e instanceof EventTarget)return[e];if(typeof e=="string"){let i=document;const s=n?.[e]??i.querySelectorAll(e);return s?Array.from(s):[]}return Array.from(e).filter(i=>i!=null)}const es=(e,t)=>t&&typeof e=="number"?t.transform(e):e;function vn(e){return sa(e)&&"offsetHeight"in e&&!("ownerSVGElement"in e)}const{schedule:js}=wa(queueMicrotask,!1),$e={x:!1,y:!1};function Xa(){return $e.x||$e.y}function ih(e){return e==="x"||e==="y"?$e[e]?null:($e[e]=!0,()=>{$e[e]=!1}):$e.x||$e.y?null:($e.x=$e.y=!0,()=>{$e.x=$e.y=!1})}function Za(e,t){const n=Ya(e),i=new AbortController,s={passive:!0,...t,signal:i.signal};return[n,s,()=>i.abort()]}function sh(e){return!(e.pointerType==="touch"||Xa())}function oh(e,t,n={}){const[i,s,r]=Za(e,n);return i.forEach(o=>{let a=!1,c=!1,l;const u=()=>{o.removeEventListener("pointerleave",p)},f=m=>{l&&(l(m),l=void 0),u()},h=m=>{a=!1,window.removeEventListener("pointerup",h),window.removeEventListener("pointercancel",h),c&&(c=!1,f(m))},y=()=>{a=!0,window.addEventListener("pointerup",h,s),window.addEventListener("pointercancel",h,s)},p=m=>{if(m.pointerType!=="touch"){if(a){c=!0;return}f(m)}},g=m=>{if(!sh(m))return;c=!1;const w=t(o,m);typeof w=="function"&&(l=w,o.addEventListener("pointerleave",p,s))};o.addEventListener("pointerenter",g,s),o.addEventListener("pointerdown",y,s)}),r}const Ja=(e,t)=>t?e===t?!0:Ja(e,t.parentElement):!1,Ls=e=>e.pointerType==="mouse"?typeof e.button!="number"||e.button<=0:e.isPrimary!==!1,rh=new Set(["BUTTON","INPUT","SELECT","TEXTAREA","A"]);function ah(e){return rh.has(e.tagName)||e.isContentEditable===!0}const lh=new Set(["INPUT","SELECT","TEXTAREA"]);function ch(e){return lh.has(e.tagName)||e.isContentEditable===!0}const kn=new WeakSet;function So(e){return t=>{t.key==="Enter"&&e(t)}}function ai(e,t){e.dispatchEvent(new PointerEvent("pointer"+t,{isPrimary:!0,bubbles:!0}))}const uh=(e,t)=>{const n=e.currentTarget;if(!n)return;const i=So(()=>{if(kn.has(n))return;ai(n,"down");const s=So(()=>{ai(n,"up")}),r=()=>ai(n,"cancel");n.addEventListener("keyup",s,t),n.addEventListener("blur",r,t)});n.addEventListener("keydown",i,t),n.addEventListener("blur",()=>n.removeEventListener("keydown",i),t)};function To(e){return Ls(e)&&!Xa()}const Co=new WeakSet;function dh(e,t,n={}){const[i,s,r]=Za(e,n),o=a=>{const c=a.currentTarget;if(!To(a)||Co.has(a))return;kn.add(c),n.stopPropagation&&Co.add(a);const l=t(c,a),u={...s,capture:!0},f=(p,g)=>{window.removeEventListener("pointerup",h,u),window.removeEventListener("pointercancel",y,u),kn.has(c)&&kn.delete(c),To(p)&&typeof l=="function"&&l(p,{success:g})},h=p=>{f(p,c===window||c===document||n.useGlobalTarget||Ja(c,p.target))},y=p=>{f(p,!1)};window.addEventListener("pointerup",h,u),window.addEventListener("pointercancel",y,u)};return i.forEach(a=>{(n.useGlobalTarget?window:a).addEventListener("pointerdown",o,s),vn(a)&&(a.addEventListener("focus",l=>uh(l,s)),!ah(a)&&!a.hasAttribute("tabindex")&&(a.tabIndex=0))}),r}function Ns(e){return sa(e)&&"ownerSVGElement"in e}const Sn=new WeakMap;let Tn;const el=(e,t,n)=>(i,s)=>s&&s[0]?s[0][e+"Size"]:Ns(i)&&"getBBox"in i?i.getBBox()[t]:i[n],hh=el("inline","width","offsetWidth"),fh=el("block","height","offsetHeight");function ph({target:e,borderBoxSize:t}){Sn.get(e)?.forEach(n=>{n(e,{get width(){return hh(e,t)},get height(){return fh(e,t)}})})}function mh(e){e.forEach(ph)}function gh(){typeof ResizeObserver>"u"||(Tn=new ResizeObserver(mh))}function yh(e,t){Tn||gh();const n=Ya(e);return n.forEach(i=>{let s=Sn.get(i);s||(s=new Set,Sn.set(i,s)),s.add(t),Tn?.observe(i)}),()=>{n.forEach(i=>{const s=Sn.get(i);s?.delete(t),s?.size||Tn?.unobserve(i)})}}const Cn=new Set;let Tt;function wh(){Tt=()=>{const e={get width(){return window.innerWidth},get height(){return window.innerHeight}};Cn.forEach(t=>t(e))},window.addEventListener("resize",Tt)}function bh(e){return Cn.add(e),Tt||wh(),()=>{Cn.delete(e),!Cn.size&&typeof Tt=="function"&&(window.removeEventListener("resize",Tt),Tt=void 0)}}function Ao(e,t){return typeof e=="function"?bh(e):yh(e,t)}function xh(e){return Ns(e)&&e.tagName==="svg"}const vh=[...Ka,ce,Be],kh=e=>vh.find(Ga(e)),Po=()=>({translate:0,scale:1,origin:0,originPoint:0}),Ct=()=>({x:Po(),y:Po()}),Eo=()=>({min:0,max:0}),he=()=>({x:Eo(),y:Eo()}),Sh=new WeakMap;function Gn(e){return e!==null&&typeof e=="object"&&typeof e.start=="function"}function Yt(e){return typeof e=="string"||Array.isArray(e)}const Is=["animate","whileInView","whileFocus","whileHover","whileTap","whileDrag","exit"],Vs=["initial",...Is];function Kn(e){return Gn(e.animate)||Vs.some(t=>Yt(e[t]))}function tl(e){return!!(Kn(e)||e.variants)}function Th(e,t,n){for(const i in t){const s=t[i],r=n[i];if(we(s))e.addValue(i,s);else if(we(r))e.addValue(i,Pt(s,{owner:e}));else if(r!==s)if(e.hasValue(i)){const o=e.getValue(i);o.liveStyle===!0?o.jump(s):o.hasAnimated||o.set(s)}else{const o=e.getStaticValue(i);e.addValue(i,Pt(o!==void 0?o:s,{owner:e}))}}for(const i in n)t[i]===void 0&&e.removeValue(i);return t}const ts={current:null},nl={current:!1},Ch=typeof window<"u";function Ah(){if(nl.current=!0,!!Ch)if(window.matchMedia){const e=window.matchMedia("(prefers-reduced-motion)"),t=()=>ts.current=e.matches;e.addEventListener("change",t),t()}else ts.current=!1}const Do=["AnimationStart","AnimationComplete","Update","BeforeLayoutMeasure","LayoutMeasure","LayoutAnimationStart","LayoutAnimationComplete"];let $n={};function il(e){$n=e}function Ph(){return $n}class Eh{scrapeMotionValuesFromProps(t,n,i){return{}}constructor({parent:t,props:n,presenceContext:i,reducedMotionConfig:s,skipAnimations:r,blockInitialAnimation:o,visualState:a},c={}){this.current=null,this.children=new Set,this.isVariantNode=!1,this.isControllingVariants=!1,this.shouldReduceMotion=null,this.shouldSkipAnimations=!1,this.values=new Map,this.KeyframeResolver=Ps,this.features={},this.valueSubscriptions=new Map,this.prevMotionValues={},this.hasBeenMounted=!1,this.events={},this.propEventSubscriptions={},this.notifyUpdate=()=>this.notify("Update",this.latestValues),this.render=()=>{this.current&&(this.triggerBuild(),this.renderInstance(this.current,this.renderState,this.props.style,this.projection))},this.renderScheduledAt=0,this.scheduleRender=()=>{const y=ke.now();this.renderScheduledAt<y&&(this.renderScheduledAt=y,te.render(this.render,!1,!0))};const{latestValues:l,renderState:u}=a;this.latestValues=l,this.baseTarget={...l},this.initialValues=n.initial?{...l}:{},this.renderState=u,this.parent=t,this.props=n,this.presenceContext=i,this.depth=t?t.depth+1:0,this.reducedMotionConfig=s,this.skipAnimationsConfig=r,this.options=c,this.blockInitialAnimation=!!o,this.isControllingVariants=Kn(n),this.isVariantNode=tl(n),this.isVariantNode&&(this.variantChildren=new Set),this.manuallyAnimateOnMount=!!(t&&t.current);const{willChange:f,...h}=this.scrapeMotionValuesFromProps(n,{},this);for(const y in h){const p=h[y];l[y]!==void 0&&we(p)&&p.set(l[y])}}mount(t){if(this.hasBeenMounted)for(const n in this.initialValues)this.values.get(n)?.jump(this.initialValues[n]),this.latestValues[n]=this.initialValues[n];this.current=t,Sh.set(t,this),this.projection&&!this.projection.instance&&this.projection.mount(t),this.parent&&this.isVariantNode&&!this.isControllingVariants&&(this.removeFromVariantTree=this.parent.addVariantChild(this)),this.values.forEach((n,i)=>this.bindToMotionValue(i,n)),this.reducedMotionConfig==="never"?this.shouldReduceMotion=!1:this.reducedMotionConfig==="always"?this.shouldReduceMotion=!0:(nl.current||Ah(),this.shouldReduceMotion=ts.current),this.shouldSkipAnimations=this.skipAnimationsConfig??!1,this.parent?.addChild(this),this.update(this.props,this.presenceContext),this.hasBeenMounted=!0}unmount(){this.projection&&this.projection.unmount(),nt(this.notifyUpdate),nt(this.render),this.valueSubscriptions.forEach(t=>t()),this.valueSubscriptions.clear(),this.removeFromVariantTree&&this.removeFromVariantTree(),this.parent?.removeChild(this);for(const t in this.events)this.events[t].clear();for(const t in this.features){const n=this.features[t];n&&(n.unmount(),n.isMounted=!1)}this.current=null}addChild(t){this.children.add(t),this.enteringChildren??(this.enteringChildren=new Set),this.enteringChildren.add(t)}removeChild(t){this.children.delete(t),this.enteringChildren&&this.enteringChildren.delete(t)}bindToMotionValue(t,n){if(this.valueSubscriptions.has(t)&&this.valueSubscriptions.get(t)(),n.accelerate&&$a.has(t)&&this.current instanceof HTMLElement){const{factory:o,keyframes:a,times:c,ease:l,duration:u}=n.accelerate,f=new Ia({element:this.current,name:t,keyframes:a,times:c,ease:l,duration:Ne(u)}),h=o(f);this.valueSubscriptions.set(t,()=>{h(),f.cancel()});return}const i=Ot.has(t);i&&this.onBindTransform&&this.onBindTransform();const s=n.on("change",o=>{this.latestValues[t]=o,this.props.onUpdate&&te.preRender(this.notifyUpdate),i&&this.projection&&(this.projection.isTransformDirty=!0),this.scheduleRender()});let r;typeof window<"u"&&window.MotionCheckAppearSync&&(r=window.MotionCheckAppearSync(this,t,n)),this.valueSubscriptions.set(t,()=>{s(),r&&r()})}sortNodePosition(t){return!this.current||!this.sortInstanceNodePosition||this.type!==t.type?0:this.sortInstanceNodePosition(this.current,t.current)}updateFeatures(){let t="animation";for(t in $n){const n=$n[t];if(!n)continue;const{isEnabled:i,Feature:s}=n;if(!this.features[t]&&s&&i(this.props)&&(this.features[t]=new s(this)),this.features[t]){const r=this.features[t];r.isMounted?r.update():(r.mount(),r.isMounted=!0)}}}triggerBuild(){this.build(this.renderState,this.latestValues,this.props)}measureViewportBox(){return this.current?this.measureInstanceViewportBox(this.current,this.props):he()}getStaticValue(t){return this.latestValues[t]}setStaticValue(t,n){this.latestValues[t]=n}update(t,n){(t.transformTemplate||this.props.transformTemplate)&&this.scheduleRender(),this.prevProps=this.props,this.props=t,this.prevPresenceContext=this.presenceContext,this.presenceContext=n;for(let i=0;i<Do.length;i++){const s=Do[i];this.propEventSubscriptions[s]&&(this.propEventSubscriptions[s](),delete this.propEventSubscriptions[s]);const r="on"+s,o=t[r];o&&(this.propEventSubscriptions[s]=this.on(s,o))}this.prevMotionValues=Th(this,this.scrapeMotionValuesFromProps(t,this.prevProps||{},this),this.prevMotionValues),this.handleChildMotionValue&&this.handleChildMotionValue()}getProps(){return this.props}getVariant(t){return this.props.variants?this.props.variants[t]:void 0}getDefaultTransition(){return this.props.transition}getTransformPagePoint(){return this.props.transformPagePoint}getClosestVariantNode(){return this.isVariantNode?this:this.parent?this.parent.getClosestVariantNode():void 0}addVariantChild(t){const n=this.getClosestVariantNode();if(n)return n.variantChildren&&n.variantChildren.add(t),()=>n.variantChildren.delete(t)}addValue(t,n){const i=this.values.get(t);n!==i&&(i&&this.removeValue(t),this.bindToMotionValue(t,n),this.values.set(t,n),this.latestValues[t]=n.get())}removeValue(t){this.values.delete(t);const n=this.valueSubscriptions.get(t);n&&(n(),this.valueSubscriptions.delete(t)),delete this.latestValues[t],this.removeValueFromRenderState(t,this.renderState)}hasValue(t){return this.values.has(t)}getValue(t,n){if(this.props.values&&this.props.values[t])return this.props.values[t];let i=this.values.get(t);return i===void 0&&n!==void 0&&(i=Pt(n===null?void 0:n,{owner:this}),this.addValue(t,i)),i}readValue(t,n){let i=this.latestValues[t]!==void 0||!this.current?this.latestValues[t]:this.getBaseTargetFromProps(this.props,t)??this.readValueFromInstance(this.current,t,this.options);return i!=null&&(typeof i=="string"&&(ia(i)||oa(i))?i=parseFloat(i):!kh(i)&&Be.test(n)&&(i=qa(t,n)),this.setBaseTarget(t,we(i)?i.get():i)),we(i)?i.get():i}setBaseTarget(t,n){this.baseTarget[t]=n}getBaseTarget(t){const{initial:n}=this.props;let i;if(typeof n=="string"||typeof n=="object"){const r=Ms(this.props,n,this.presenceContext?.custom);r&&(i=r[t])}if(n&&i!==void 0)return i;const s=this.getBaseTargetFromProps(this.props,t);return s!==void 0&&!we(s)?s:this.initialValues[t]!==void 0&&i===void 0?void 0:this.baseTarget[t]}on(t,n){return this.events[t]||(this.events[t]=new ys),this.events[t].add(n)}notify(t,...n){this.events[t]&&this.events[t].notify(...n)}scheduleRenderMicrotask(){js.render(this.render)}}class sl extends Eh{constructor(){super(...arguments),this.KeyframeResolver=nh}sortInstanceNodePosition(t,n){return t.compareDocumentPosition(n)&2?1:-1}getBaseTargetFromProps(t,n){const i=t.style;return i?i[n]:void 0}removeValueFromRenderState(t,{vars:n,style:i}){delete n[t],delete i[t]}handleChildMotionValue(){this.childSubscription&&(this.childSubscription(),delete this.childSubscription);const{children:t}=this.props;we(t)&&(this.childSubscription=t.on("change",n=>{this.current&&(this.current.textContent=`${n}`)}))}}class it{constructor(t){this.isMounted=!1,this.node=t}update(){}}function ol({top:e,left:t,right:n,bottom:i}){return{x:{min:t,max:n},y:{min:e,max:i}}}function Dh({x:e,y:t}){return{top:t.min,right:e.max,bottom:t.max,left:e.min}}function Mh(e,t){if(!t)return e;const n=t({x:e.left,y:e.top}),i=t({x:e.right,y:e.bottom});return{top:n.y,left:n.x,bottom:i.y,right:i.x}}function li(e){return e===void 0||e===1}function ns({scale:e,scaleX:t,scaleY:n}){return!li(e)||!li(t)||!li(n)}function ct(e){return ns(e)||rl(e)||e.z||e.rotate||e.rotateX||e.rotateY||e.skewX||e.skewY}function rl(e){return Mo(e.x)||Mo(e.y)}function Mo(e){return e&&e!=="0%"}function Bn(e,t,n){const i=e-n,s=t*i;return n+s}function Oo(e,t,n,i,s){return s!==void 0&&(e=Bn(e,s,i)),Bn(e,n,i)+t}function is(e,t=0,n=1,i,s){e.min=Oo(e.min,t,n,i,s),e.max=Oo(e.max,t,n,i,s)}function al(e,{x:t,y:n}){is(e.x,t.translate,t.scale,t.originPoint),is(e.y,n.translate,n.scale,n.originPoint)}const Ro=.999999999999,jo=1.0000000000001;function Oh(e,t,n,i=!1){const s=n.length;if(!s)return;t.x=t.y=1;let r,o;for(let a=0;a<s;a++){r=n[a],o=r.projectionDelta;const{visualElement:c}=r.options;c&&c.props.style&&c.props.style.display==="contents"||(i&&r.options.layoutScroll&&r.scroll&&r!==r.root&&(_e(e.x,-r.scroll.offset.x),_e(e.y,-r.scroll.offset.y)),o&&(t.x*=o.x.scale,t.y*=o.y.scale,al(e,o)),i&&ct(r.latestValues)&&An(e,r.latestValues,r.layout?.layoutBox))}t.x<jo&&t.x>Ro&&(t.x=1),t.y<jo&&t.y>Ro&&(t.y=1)}function _e(e,t){e.min+=t,e.max+=t}function Lo(e,t,n,i,s=.5){const r=ee(e.min,e.max,s);is(e,t,n,r,i)}function No(e,t){return typeof e=="string"?parseFloat(e)/100*(t.max-t.min):e}function An(e,t,n){const i=n??e;Lo(e.x,No(t.x,i.x),t.scaleX,t.scale,t.originX),Lo(e.y,No(t.y,i.y),t.scaleY,t.scale,t.originY)}function ll(e,t){return ol(Mh(e.getBoundingClientRect(),t))}function Rh(e,t,n){const i=ll(e,n),{scroll:s}=t;return s&&(_e(i.x,s.offset.x),_e(i.y,s.offset.y)),i}const jh={x:"translateX",y:"translateY",z:"translateZ",transformPerspective:"perspective"},Lh=Mt.length;function Nh(e,t,n){let i="",s=!0;for(let o=0;o<Lh;o++){const a=Mt[o],c=e[a];if(c===void 0)continue;let l=!0;if(typeof c=="number")l=c===(a.startsWith("scale")?1:0);else{const u=parseFloat(c);l=a.startsWith("scale")?u===1:u===0}if(!l||n){const u=es(c,Vn[a]);if(!l){s=!1;const f=jh[a]||a;i+=`${f}(${u}) `}n&&(t[a]=u)}}const r=e.pathRotation;return r&&(s=!1,i+=`rotate(${es(r,Vn.pathRotation)}) `),i=i.trim(),n?i=n(t,s?"":i):s&&(i="none"),i}function $s(e,t,n){const{style:i,vars:s,transformOrigin:r}=e;let o=!1,a=!1;for(const c in t){const l=t[c];if(Ot.has(c)){o=!0;continue}else if(xa(c)){s[c]=l;continue}else{const u=es(l,Vn[c]);c.startsWith("origin")?(a=!0,r[c]=u):i[c]=u}}if(t.transform||(o||n?i.transform=Nh(t,e.transform,n):i.transform&&(i.transform="none")),a){const{originX:c="50%",originY:l="50%",originZ:u=0}=r;i.transformOrigin=`${c} ${l} ${u}`}}function cl(e,{style:t,vars:n},i,s){const r=e.style;let o;for(o in t)r[o]=t[o];s?.applyProjectionStyles(r,i);for(o in n)r.setProperty(o,n[o])}function Io(e,t){return t.max===t.min?0:e/(t.max-t.min)*100}const Lt={correct:(e,t)=>{if(!t.target)return e;if(typeof e=="string")if(B.test(e))e=parseFloat(e);else return e;const n=Io(e,t.target.x),i=Io(e,t.target.y);return`${n}% ${i}%`}},Ih={correct:(e,{treeScale:t,projectionDelta:n})=>{const i=e,s=Be.parse(e);if(s.length>5)return i;const r=Be.createTransformer(e),o=typeof s[0]!="number"?1:0,a=n.x.scale*t.x,c=n.y.scale*t.y;s[0+o]/=a,s[1+o]/=c;const l=ee(a,c,.5);return typeof s[2+o]=="number"&&(s[2+o]/=l),typeof s[3+o]=="number"&&(s[3+o]/=l),r(s)}},ss={borderRadius:{...Lt,applyTo:[...Rs]},borderTopLeftRadius:Lt,borderTopRightRadius:Lt,borderBottomLeftRadius:Lt,borderBottomRightRadius:Lt,boxShadow:Ih};function ul(e,{layout:t,layoutId:n}){return Ot.has(e)||e.startsWith("origin")||(t||n!==void 0)&&(!!ss[e]||e==="opacity")}function Bs(e,t,n){const i=e.style,s=t?.style,r={};if(!i)return r;for(const o in i)(we(i[o])||s&&we(s[o])||ul(o,e)||n?.getValue(o)?.liveStyle!==void 0)&&(r[o]=i[o]);return r}function Vh(e){return window.getComputedStyle(e)}class $h extends sl{constructor(){super(...arguments),this.type="html",this.renderInstance=cl}mount(t){zn(!!t.style),super.mount(t)}readValueFromInstance(t,n){if(Ot.has(n))return this.projection?.isProjecting?Wi(n):id(t,n);{const i=Vh(t),s=(xa(n)?i.getPropertyValue(n):i[n])||0;return typeof s=="string"?s.trim():s}}measureInstanceViewportBox(t,{transformPagePoint:n}){return ll(t,n)}build(t,n,i){$s(t,n,i.transformTemplate)}scrapeMotionValuesFromProps(t,n,i){return Bs(t,n,i)}}const Bh={offset:"stroke-dashoffset",array:"stroke-dasharray"},Fh={offset:"strokeDashoffset",array:"strokeDasharray"};function _h(e,t,n=1,i=0,s=!0){e.pathLength=1;const r=s?Bh:Fh;e[r.offset]=`${-i}`,e[r.array]=`${t} ${n}`}const dl=["transform","opacity","offsetDistance","offsetPath","offsetRotate","offsetAnchor"];function hl(e,{attrX:t,attrY:n,attrScale:i,pathLength:s,pathSpacing:r=1,pathOffset:o=0,...a},c,l,u){if($s(e,a,l),c){e.style.viewBox&&(e.attrs.viewBox=e.style.viewBox);return}e.attrs=e.style,e.style={};const{attrs:f,style:h}=e;for(const y of dl)f[y]!==void 0&&(h[y]=f[y],delete f[y]);(h.transform||f.transformOrigin)&&(h.transformOrigin=f.transformOrigin??"50% 50%",delete f.transformOrigin),h.transform&&(h.transformBox=u?.transformBox??"fill-box",delete f.transformBox),t!==void 0&&(f.x=t),n!==void 0&&(f.y=n),i!==void 0&&(f.scale=i),s!==void 0&&_h(f,s,r,o,!1)}const fl=new Set(["baseFrequency","diffuseConstant","kernelMatrix","kernelUnitLength","keySplines","keyTimes","limitingConeAngle","markerHeight","markerWidth","numOctaves","targetX","targetY","surfaceScale","specularConstant","specularExponent","stdDeviation","tableValues","viewBox","gradientTransform","pathLength","startOffset","textLength","lengthAdjust"]),pl=e=>typeof e=="string"&&e.toLowerCase()==="svg";function Hh(e,t,n,i){cl(e,t,void 0,i);for(const s in t.attrs)e.setAttribute(fl.has(s)?s:Os(s),t.attrs[s])}function ml(e,t,n){const i=Bs(e,t,n);for(const s in e)if(we(e[s])||we(t[s])){const r=Mt.indexOf(s)!==-1?"attr"+s.charAt(0).toUpperCase()+s.substring(1):s;i[r]=e[s]}return i}class Wh extends sl{constructor(){super(...arguments),this.type="svg",this.isSVGTag=!1,this.measureInstanceViewportBox=he}getBaseTargetFromProps(t,n){return t[n]}readValueFromInstance(t,n){if(Ot.has(n)){const i=Qa(n);return i&&i.default||0}if(dl.includes(n)){const s=getComputedStyle(t)[n];if(typeof s=="string"&&s)return s.trim()}return n=fl.has(n)?n:Os(n),t.getAttribute(n)}scrapeMotionValuesFromProps(t,n,i){return ml(t,n,i)}build(t,n,i){hl(t,n,this.isSVGTag,i.transformTemplate,i.style)}renderInstance(t,n,i,s){Hh(t,n,i,s)}mount(t){this.isSVGTag=pl(t.tagName),super.mount(t)}}const zh=Vs.length;function gl(e){if(!e)return;if(!e.isControllingVariants){const n=e.parent?gl(e.parent)||{}:{};return e.props.initial!==void 0&&(n.initial=e.props.initial),n}const t={};for(let n=0;n<zh;n++){const i=Vs[n],s=e.props[i];(Yt(s)||s===!1)&&(t[i]=s)}return t}function yl(e,t){if(!Array.isArray(t))return!1;const n=t.length;if(n!==e.length)return!1;for(let i=0;i<n;i++)if(t[i]!==e[i])return!1;return!0}const Uh=[...Is].reverse(),Gh=Is.length;function Kh(e){return t=>Promise.all(t.map(({animation:n,options:i})=>Ud(e,n,i)))}function Qh(e){let t=Kh(e),n=Vo(),i=!0,s=!1;const r=l=>(u,f)=>{const h=ft(e,f,l==="exit"?e.presenceContext?.custom:void 0);if(h){const{transition:y,transitionEnd:p,...g}=h;u={...u,...g,...p}}return u};function o(l){t=l(e)}function a(l){const{props:u}=e,f=gl(e.parent)||{},h=[],y=new Set;let p={},g=1/0;for(let w=0;w<Gh;w++){const k=Uh[w],v=n[k],x=u[k]!==void 0?u[k]:f[k],T=Yt(x),D=k===l?v.isActive:null;D===!1&&(g=w);let S=x===f[k]&&x!==u[k]&&T;if(S&&(i||s)&&e.manuallyAnimateOnMount&&(S=!1),v.protectedKeys={...p},!v.isActive&&D===null||!x&&!v.prevProp||Gn(x)||typeof x=="boolean")continue;if(k==="exit"&&v.isActive&&D!==!0){v.prevResolvedValues&&(p={...p,...v.prevResolvedValues});continue}const P=qh(v.prevProp,x);let E=P||k===l&&v.isActive&&!S&&T||w>g&&T,N=!1;const V=Array.isArray(x)?x:[x];let $=V.reduce(r(k),{});D===!1&&($={});const{prevResolvedValues:O={}}=v,F={...O,...$},C=L=>{E=!0,y.has(L)&&(N=!0,y.delete(L)),v.needsAnimating[L]=!0;const G=e.getValue(L);G&&(G.liveStyle=!1)};for(const L in F){const G=$[L],j=O[L];if(p.hasOwnProperty(L))continue;let X=!1;qi(G)&&qi(j)?X=!yl(G,j)||P:X=G!==j,X?G!=null?C(L):y.add(L):G!==void 0&&y.has(L)?C(L):v.protectedKeys[L]=!0}v.prevProp=x,v.prevResolvedValues=$,v.isActive&&(p={...p,...$}),(i||s)&&e.blockInitialAnimation&&(E=!1);const U=S&&P;E&&(!U||N)&&h.push(...V.map(L=>{const G={type:k};if(typeof L=="string"&&(i||s)&&!U&&e.manuallyAnimateOnMount&&e.parent){const{parent:j}=e,X=ft(j,L);if(j.enteringChildren&&X){const{delayChildren:ae}=X.transition||{};G.delay=Ba(j.enteringChildren,e,ae)}}return{animation:L,options:G}}))}if(y.size){const w={};if(typeof u.initial!="boolean"){const k=ft(e,Array.isArray(u.initial)?u.initial[0]:u.initial);k&&k.transition&&(w.transition=k.transition)}y.forEach(k=>{const v=e.getBaseTarget(k),x=e.getValue(k);x&&(x.liveStyle=!0),w[k]=v??null}),h.push({animation:w})}let m=!!h.length;return i&&(u.initial===!1||u.initial===u.animate)&&!e.manuallyAnimateOnMount&&(m=!1),i=!1,s=!1,m?t(h):Promise.resolve()}function c(l,u){if(n[l].isActive===u)return Promise.resolve();e.variantChildren?.forEach(h=>h.animationState?.setActive(l,u)),n[l].isActive=u;const f=a(l);for(const h in n)n[h].protectedKeys={};return f}return{animateChanges:a,setActive:c,setAnimateFunction:o,getState:()=>n,reset:()=>{n=Vo(),s=!0}}}function qh(e,t){return typeof t=="string"?t!==e:Array.isArray(t)?!yl(t,e):!1}function at(e=!1){return{isActive:e,protectedKeys:{},needsAnimating:{},prevResolvedValues:{}}}function Vo(){return{animate:at(!0),whileInView:at(),whileHover:at(),whileTap:at(),whileDrag:at(),whileFocus:at(),exit:at()}}function os(e,t){e.min=t.min,e.max=t.max}function Ve(e,t){os(e.x,t.x),os(e.y,t.y)}function $o(e,t){e.translate=t.translate,e.scale=t.scale,e.originPoint=t.originPoint,e.origin=t.origin}const wl=1e-4,Yh=1-wl,Xh=1+wl,bl=.01,Zh=0-bl,Jh=0+bl;function Se(e){return e.max-e.min}function ef(e,t,n){return Math.abs(e-t)<=n}function Bo(e,t,n,i=.5){e.origin=i,e.originPoint=ee(t.min,t.max,e.origin),e.scale=Se(n)/Se(t),e.translate=ee(n.min,n.max,e.origin)-e.originPoint,(e.scale>=Yh&&e.scale<=Xh||isNaN(e.scale))&&(e.scale=1),(e.translate>=Zh&&e.translate<=Jh||isNaN(e.translate))&&(e.translate=0)}function Ht(e,t,n,i){Bo(e.x,t.x,n.x,i?i.originX:void 0),Bo(e.y,t.y,n.y,i?i.originY:void 0)}function Fo(e,t,n,i=0){const s=i?ee(n.min,n.max,i):n.min;e.min=s+t.min,e.max=e.min+Se(t)}function tf(e,t,n,i){Fo(e.x,t.x,n.x,i?.x),Fo(e.y,t.y,n.y,i?.y)}function _o(e,t,n,i=0){const s=i?ee(n.min,n.max,i):n.min;e.min=t.min-s,e.max=e.min+Se(t)}function Fn(e,t,n,i){_o(e.x,t.x,n.x,i?.x),_o(e.y,t.y,n.y,i?.y)}function Ho(e,t,n,i,s){return e-=t,e=Bn(e,1/n,i),s!==void 0&&(e=Bn(e,1/s,i)),e}function nf(e,t=0,n=1,i=.5,s,r=e,o=e){if(ze.test(t)&&(t=parseFloat(t),t=ee(o.min,o.max,t/100)-o.min),typeof t!="number")return;let a=ee(r.min,r.max,i);e===r&&(a-=t),e.min=Ho(e.min,t,n,a,s),e.max=Ho(e.max,t,n,a,s)}function Wo(e,t,[n,i,s],r,o){nf(e,t[n],t[i],t[s],t.scale,r,o)}const sf=["x","scaleX","originX"],of=["y","scaleY","originY"];function zo(e,t,n,i){Wo(e.x,t,sf,n?n.x:void 0,i?i.x:void 0),Wo(e.y,t,of,n?n.y:void 0,i?i.y:void 0)}function Uo(e){return e.translate===0&&e.scale===1}function xl(e){return Uo(e.x)&&Uo(e.y)}function Go(e,t){return e.min===t.min&&e.max===t.max}function rf(e,t){return Go(e.x,t.x)&&Go(e.y,t.y)}function Ko(e,t){return Math.round(e.min)===Math.round(t.min)&&Math.round(e.max)===Math.round(t.max)}function vl(e,t){return Ko(e.x,t.x)&&Ko(e.y,t.y)}function Qo(e){return Se(e.x)/Se(e.y)}function qo(e,t){return e.translate===t.translate&&e.scale===t.scale&&e.originPoint===t.originPoint}function Fe(e){return[e("x"),e("y")]}function af(e,t,n){let i="";const s=e.x.translate/t.x,r=e.y.translate/t.y,o=n?.z||0;if((s||r||o)&&(i=`translate3d(${s}px, ${r}px, ${o}px) `),(t.x!==1||t.y!==1)&&(i+=`scale(${1/t.x}, ${1/t.y}) `),n){const{transformPerspective:l,rotate:u,pathRotation:f,rotateX:h,rotateY:y,skewX:p,skewY:g}=n;l&&(i=`perspective(${l}px) ${i}`),u&&(i+=`rotate(${u}deg) `),f&&(i+=`rotate(${f}deg) `),h&&(i+=`rotateX(${h}deg) `),y&&(i+=`rotateY(${y}deg) `),p&&(i+=`skewX(${p}deg) `),g&&(i+=`skewY(${g}deg) `)}const a=e.x.scale*t.x,c=e.y.scale*t.y;return(a!==1||c!==1)&&(i+=`scale(${a}, ${c})`),i||"none"}const lf=Rs.length,Yo=e=>typeof e=="string"?parseFloat(e):e,Xo=e=>typeof e=="number"||B.test(e);function cf(e,t,n,i,s,r){s?(e.opacity=ee(0,n.opacity??1,uf(i)),e.opacityExit=ee(t.opacity??1,0,df(i))):r&&(e.opacity=ee(t.opacity??1,n.opacity??1,i));for(let o=0;o<lf;o++){const a=Rs[o];let c=Zo(t,a),l=Zo(n,a);if(c===void 0&&l===void 0)continue;c||(c=0),l||(l=0),c===0||l===0||Xo(c)===Xo(l)?(e[a]=Math.max(ee(Yo(c),Yo(l),i),0),(ze.test(l)||ze.test(c))&&(e[a]+="%")):e[a]=l}(t.rotate||n.rotate)&&(e.rotate=ee(t.rotate||0,n.rotate||0,i))}function Zo(e,t){return e[t]!==void 0?e[t]:e.borderRadius}const uf=kl(0,.5,pa),df=kl(.5,.95,Le);function kl(e,t,n){return i=>i<e?0:i>t?1:n(Qt(e,t,i))}function hf(e,t,n){const i=we(e)?e:Pt(e);return i.start(Ds("",i,t,n)),i.animation}function Xt(e,t,n,i={passive:!0}){return e.addEventListener(t,n,i),()=>e.removeEventListener(t,n,i)}const ff=(e,t)=>e.depth-t.depth;class pf{constructor(){this.children=[],this.isDirty=!1}add(t){gs(this.children,t),this.isDirty=!0}remove(t){jn(this.children,t),this.isDirty=!0}forEach(t){this.isDirty&&this.children.sort(ff),this.isDirty=!1,this.children.forEach(t)}}function mf(e,t){const n=ke.now(),i=({timestamp:s})=>{const r=s-n;r>=t&&(nt(i),e(r-t))};return te.setup(i,!0),()=>nt(i)}function Pn(e){return we(e)?e.get():e}class gf{constructor(){this.members=[]}add(t){gs(this.members,t);for(let n=this.members.length-1;n>=0;n--){const i=this.members[n];if(i===t||i===this.lead||i===this.prevLead)continue;const s=i.instance;(!s||s.isConnected===!1)&&!i.snapshot&&(jn(this.members,i),i.unmount())}t.scheduleRender()}remove(t){if(jn(this.members,t),t===this.prevLead&&(this.prevLead=void 0),t===this.lead){const n=this.members[this.members.length-1];n&&this.promote(n)}}relegate(t){for(let n=this.members.indexOf(t)-1;n>=0;n--){const i=this.members[n];if(i.isPresent!==!1&&i.instance?.isConnected!==!1)return this.promote(i),!0}return!1}promote(t,n){const i=this.lead;if(t!==i&&(this.prevLead=i,this.lead=t,t.show(),i)){i.updateSnapshot(),t.scheduleRender();const{layoutDependency:s}=i.options,{layoutDependency:r}=t.options;(s===void 0||s!==r)&&(t.resumeFrom=i,n&&(i.preserveOpacity=!0),i.snapshot&&(t.snapshot=i.snapshot,t.snapshot.latestValues=i.animationValues||i.latestValues),t.root?.isUpdating&&(t.isLayoutDirty=!0)),t.options.crossfade===!1&&i.hide()}}exitAnimationComplete(){this.members.forEach(t=>{t.options.onExitComplete?.(),t.resumingFrom?.options.onExitComplete?.()})}scheduleRender(){this.members.forEach(t=>t.instance&&t.scheduleRender(!1))}removeLeadSnapshot(){this.lead?.snapshot&&(this.lead.snapshot=void 0)}}const En={hasAnimatedSinceResize:!0,hasEverUpdated:!1},ci=["","X","Y","Z"],yf=1e3;let wf=0;function ui(e,t,n,i){const{latestValues:s}=t;s[e]&&(n[e]=s[e],t.setStaticValue(e,0),i&&(i[e]=0))}function Sl(e){if(e.hasCheckedOptimisedAppear=!0,e.root===e)return;const{visualElement:t}=e.options;if(!t)return;const n=za(t);if(window.MotionHasOptimisedAnimation(n,"transform")){const{layout:s,layoutId:r}=e.options;window.MotionCancelOptimisedAnimation(n,"transform",te,!(s||r))}const{parent:i}=e;i&&!i.hasCheckedOptimisedAppear&&Sl(i)}function Tl({attachResizeListener:e,defaultParent:t,measureScroll:n,checkIsScrollRoot:i,resetTransform:s}){return class{constructor(o={},a=t?.()){this.id=wf++,this.animationId=0,this.animationCommitId=0,this.children=new Set,this.options={},this.isTreeAnimating=!1,this.isAnimationBlocked=!1,this.isLayoutDirty=!1,this.isProjectionDirty=!1,this.isSharedProjectionDirty=!1,this.isTransformDirty=!1,this.updateManuallyBlocked=!1,this.updateBlockedByResize=!1,this.isUpdating=!1,this.isSVG=!1,this.needsReset=!1,this.shouldResetTransform=!1,this.hasCheckedOptimisedAppear=!1,this.treeScale={x:1,y:1},this.eventHandlers=new Map,this.hasTreeAnimated=!1,this.layoutVersion=0,this.updateScheduled=!1,this.scheduleUpdate=()=>this.update(),this.projectionUpdateScheduled=!1,this.checkUpdateFailed=()=>{this.isUpdating&&(this.isUpdating=!1,this.clearAllSnapshots())},this.updateProjection=()=>{this.projectionUpdateScheduled=!1,this.nodes.forEach(vf),this.nodes.forEach(Pf),this.nodes.forEach(Ef),this.nodes.forEach(kf)},this.resolvedRelativeTargetAt=0,this.linkedParentVersion=0,this.hasProjected=!1,this.isVisible=!0,this.animationProgress=0,this.sharedNodes=new Map,this.latestValues=o,this.root=a?a.root||a:this,this.path=a?[...a.path,a]:[],this.parent=a,this.depth=a?a.depth+1:0;for(let c=0;c<this.path.length;c++)this.path[c].shouldResetTransform=!0;this.root===this&&(this.nodes=new pf)}addEventListener(o,a){return this.eventHandlers.has(o)||this.eventHandlers.set(o,new ys),this.eventHandlers.get(o).add(a)}notifyListeners(o,...a){const c=this.eventHandlers.get(o);c&&c.notify(...a)}hasListeners(o){return this.eventHandlers.has(o)}mount(o){if(this.instance)return;this.isSVG=Ns(o)&&!xh(o),this.instance=o;const{layoutId:a,layout:c,visualElement:l}=this.options;if(l&&!l.current&&l.mount(o),this.root.nodes.add(this),this.parent&&this.parent.children.add(this),this.root.hasTreeAnimated&&(c||a)&&(this.isLayoutDirty=!0),e){let u,f=0;const h=()=>this.root.updateBlockedByResize=!1;te.read(()=>{f=window.innerWidth}),e(o,()=>{const y=window.innerWidth;y!==f&&(f=y,this.root.updateBlockedByResize=!0,u&&u(),u=mf(h,250),En.hasAnimatedSinceResize&&(En.hasAnimatedSinceResize=!1,this.nodes.forEach(tr)))})}a&&this.root.registerSharedNode(a,this),this.options.animate!==!1&&l&&(a||c)&&this.addEventListener("didUpdate",({delta:u,hasLayoutChanged:f,hasRelativeLayoutChanged:h,layout:y})=>{if(this.isTreeAnimationBlocked()){this.target=void 0,this.relativeTarget=void 0;return}const p=this.options.transition||l.getDefaultTransition()||jf,{onLayoutAnimationStart:g,onLayoutAnimationComplete:m}=l.getProps(),w=!this.targetLayout||!vl(this.targetLayout,y),k=!f&&h;if(this.options.layoutRoot||this.resumeFrom||k||f&&(w||!this.currentAnimation)){this.resumeFrom&&(this.resumingFrom=this.resumeFrom,this.resumingFrom.resumingFrom=void 0);const v={...Es(p,"layout"),onPlay:g,onComplete:m};(l.shouldReduceMotion||this.options.layoutRoot)&&(v.delay=0,v.type=!1),this.startAnimation(v),this.setAnimationOrigin(u,k,v.path)}else f||tr(this),this.isLead()&&this.options.onExitComplete&&this.options.onExitComplete();this.targetLayout=y})}unmount(){this.options.layoutId&&this.willUpdate(),this.root.nodes.remove(this);const o=this.getStack();o&&o.remove(this),this.parent&&this.parent.children.delete(this),this.instance=void 0,this.eventHandlers.clear(),nt(this.updateProjection)}blockUpdate(){this.updateManuallyBlocked=!0}unblockUpdate(){this.updateManuallyBlocked=!1}isUpdateBlocked(){return this.updateManuallyBlocked||this.updateBlockedByResize}isTreeAnimationBlocked(){return this.isAnimationBlocked||this.parent&&this.parent.isTreeAnimationBlocked()||!1}startUpdate(){this.isUpdateBlocked()||(this.isUpdating=!0,this.nodes&&this.nodes.forEach(Df),this.animationId++)}getTransformTemplate(){const{visualElement:o}=this.options;return o&&o.getProps().transformTemplate}willUpdate(o=!0){if(this.root.hasTreeAnimated=!0,this.root.isUpdateBlocked()){this.options.onExitComplete&&this.options.onExitComplete();return}if(window.MotionCancelOptimisedAnimation&&!this.hasCheckedOptimisedAppear&&Sl(this),!this.root.isUpdating&&this.root.startUpdate(),this.isLayoutDirty)return;this.isLayoutDirty=!0;for(let u=0;u<this.path.length;u++){const f=this.path[u];f.shouldResetTransform=!0,(typeof f.latestValues.x=="string"||typeof f.latestValues.y=="string")&&(f.isLayoutDirty=!0),f.updateScroll("snapshot"),f.options.layoutRoot&&f.willUpdate(!1)}const{layoutId:a,layout:c}=this.options;if(a===void 0&&!c)return;const l=this.getTransformTemplate();this.prevTransformTemplateValue=l?l(this.latestValues,""):void 0,this.updateSnapshot(),o&&this.notifyListeners("willUpdate")}update(){if(this.updateScheduled=!1,this.isUpdateBlocked()){const c=this.updateBlockedByResize;this.unblockUpdate(),this.updateBlockedByResize=!1,this.clearAllSnapshots(),c&&this.nodes.forEach(Tf),this.nodes.forEach(Jo);return}if(this.animationId<=this.animationCommitId){this.nodes.forEach(er);return}this.animationCommitId=this.animationId,this.isUpdating?(this.isUpdating=!1,this.nodes.forEach(Cf),this.nodes.forEach(Af),this.nodes.forEach(bf),this.nodes.forEach(xf)):this.nodes.forEach(er),this.clearAllSnapshots();const a=ke.now();ye.delta=Ue(0,1e3/60,a-ye.timestamp),ye.timestamp=a,ye.isProcessing=!0,ti.update.process(ye),ti.preRender.process(ye),ti.render.process(ye),ye.isProcessing=!1}didUpdate(){this.updateScheduled||(this.updateScheduled=!0,js.read(this.scheduleUpdate))}clearAllSnapshots(){this.nodes.forEach(Sf),this.sharedNodes.forEach(Mf)}scheduleUpdateProjection(){this.projectionUpdateScheduled||(this.projectionUpdateScheduled=!0,te.preRender(this.updateProjection,!1,!0))}scheduleCheckAfterUnmount(){te.postRender(()=>{this.isLayoutDirty?this.root.didUpdate():this.root.checkUpdateFailed()})}updateSnapshot(){this.snapshot||!this.instance||(this.snapshot=this.measure(),this.snapshot&&!Se(this.snapshot.measuredBox.x)&&!Se(this.snapshot.measuredBox.y)&&(this.snapshot=void 0))}updateLayout(){if(!this.instance||(this.updateScroll(),!(this.options.alwaysMeasureLayout&&this.isLead())&&!this.isLayoutDirty))return;if(this.resumeFrom&&!this.resumeFrom.instance)for(let c=0;c<this.path.length;c++)this.path[c].updateScroll();const o=this.layout;this.layout=this.measure(!1),this.layoutVersion++,this.layoutCorrected||(this.layoutCorrected=he()),this.isLayoutDirty=!1,this.projectionDelta=void 0,this.notifyListeners("measure",this.layout.layoutBox);const{visualElement:a}=this.options;a&&a.notify("LayoutMeasure",this.layout.layoutBox,o?o.layoutBox:void 0)}updateScroll(o="measure"){let a=!!(this.options.layoutScroll&&this.instance);if(this.scroll&&this.scroll.animationId===this.root.animationId&&this.scroll.phase===o&&(a=!1),a&&this.instance){const c=i(this.instance);this.scroll={animationId:this.root.animationId,phase:o,isRoot:c,offset:n(this.instance),wasRoot:this.scroll?this.scroll.isRoot:c}}}resetTransform(){if(!s)return;const o=this.isLayoutDirty||this.shouldResetTransform||this.options.alwaysMeasureLayout,a=this.projectionDelta&&!xl(this.projectionDelta),c=this.getTransformTemplate(),l=c?c(this.latestValues,""):void 0,u=l!==this.prevTransformTemplateValue;o&&this.instance&&(a||ct(this.latestValues)||u)&&(s(this.instance,l),this.shouldResetTransform=!1,this.scheduleRender())}measure(o=!0){const a=this.measurePageBox();let c=this.removeElementScroll(a);return o&&(c=this.removeTransform(c)),Lf(c),{animationId:this.root.animationId,measuredBox:a,layoutBox:c,latestValues:{},source:this.id}}measurePageBox(){const{visualElement:o}=this.options;if(!o)return he();const a=o.measureViewportBox();if(!(this.scroll?.wasRoot||this.path.some(Nf))){const{scroll:l}=this.root;l&&(_e(a.x,l.offset.x),_e(a.y,l.offset.y))}return a}removeElementScroll(o){const a=he();if(Ve(a,o),this.scroll?.wasRoot)return a;for(let c=0;c<this.path.length;c++){const l=this.path[c],{scroll:u,options:f}=l;l!==this.root&&u&&f.layoutScroll&&(u.wasRoot&&Ve(a,o),_e(a.x,u.offset.x),_e(a.y,u.offset.y))}return a}applyTransform(o,a=!1,c){const l=c||he();Ve(l,o);for(let u=0;u<this.path.length;u++){const f=this.path[u];!a&&f.options.layoutScroll&&f.scroll&&f!==f.root&&(_e(l.x,-f.scroll.offset.x),_e(l.y,-f.scroll.offset.y)),ct(f.latestValues)&&An(l,f.latestValues,f.layout?.layoutBox)}return ct(this.latestValues)&&An(l,this.latestValues,this.layout?.layoutBox),l}removeTransform(o){const a=he();Ve(a,o);for(let c=0;c<this.path.length;c++){const l=this.path[c];if(!ct(l.latestValues))continue;let u;l.instance&&(ns(l.latestValues)&&l.updateSnapshot(),u=he(),Ve(u,l.measurePageBox())),zo(a,l.latestValues,l.snapshot?.layoutBox,u)}return ct(this.latestValues)&&zo(a,this.latestValues),a}setTargetDelta(o){this.targetDelta=o,this.root.scheduleUpdateProjection(),this.isProjectionDirty=!0}setOptions(o){this.options={...this.options,...o,crossfade:o.crossfade!==void 0?o.crossfade:!0}}clearMeasurements(){this.scroll=void 0,this.layout=void 0,this.snapshot=void 0,this.prevTransformTemplateValue=void 0,this.targetDelta=void 0,this.target=void 0,this.isLayoutDirty=!1}forceRelativeParentToResolveTarget(){this.relativeParent&&this.relativeParent.resolvedRelativeTargetAt!==ye.timestamp&&this.relativeParent.resolveTargetDelta(!0)}resolveTargetDelta(o=!1){const a=this.getLead();this.isProjectionDirty||(this.isProjectionDirty=a.isProjectionDirty),this.isTransformDirty||(this.isTransformDirty=a.isTransformDirty),this.isSharedProjectionDirty||(this.isSharedProjectionDirty=a.isSharedProjectionDirty);const c=!!this.resumingFrom||this!==a;if(!(o||c&&this.isSharedProjectionDirty||this.isProjectionDirty||this.parent?.isProjectionDirty||this.attemptToResolveRelativeTarget||this.root.updateBlockedByResize))return;const{layout:u,layoutId:f}=this.options;if(!this.layout||!(u||f))return;this.resolvedRelativeTargetAt=ye.timestamp;const h=this.getClosestProjectingParent();h&&this.linkedParentVersion!==h.layoutVersion&&!h.options.layoutRoot&&this.removeRelativeTarget(),!this.targetDelta&&!this.relativeTarget&&(this.options.layoutAnchor!==!1&&h&&h.layout?this.createRelativeTarget(h,this.layout.layoutBox,h.layout.layoutBox):this.removeRelativeTarget()),!(!this.relativeTarget&&!this.targetDelta)&&(this.target||(this.target=he(),this.targetWithTransforms=he()),this.relativeTarget&&this.relativeTargetOrigin&&this.relativeParent&&this.relativeParent.target?(this.forceRelativeParentToResolveTarget(),tf(this.target,this.relativeTarget,this.relativeParent.target,this.options.layoutAnchor||void 0)):this.targetDelta?(this.resumingFrom?this.applyTransform(this.layout.layoutBox,!1,this.target):Ve(this.target,this.layout.layoutBox),al(this.target,this.targetDelta)):Ve(this.target,this.layout.layoutBox),this.attemptToResolveRelativeTarget&&(this.attemptToResolveRelativeTarget=!1,this.options.layoutAnchor!==!1&&h&&!!h.resumingFrom==!!this.resumingFrom&&!h.options.layoutScroll&&h.target&&this.animationProgress!==1?this.createRelativeTarget(h,this.target,h.target):this.relativeParent=this.relativeTarget=void 0))}getClosestProjectingParent(){if(!(!this.parent||ns(this.parent.latestValues)||rl(this.parent.latestValues)))return this.parent.isProjecting()?this.parent:this.parent.getClosestProjectingParent()}isProjecting(){return!!((this.relativeTarget||this.targetDelta||this.options.layoutRoot)&&this.layout)}createRelativeTarget(o,a,c){this.relativeParent=o,this.linkedParentVersion=o.layoutVersion,this.forceRelativeParentToResolveTarget(),this.relativeTarget=he(),this.relativeTargetOrigin=he(),Fn(this.relativeTargetOrigin,a,c,this.options.layoutAnchor||void 0),Ve(this.relativeTarget,this.relativeTargetOrigin)}removeRelativeTarget(){this.relativeParent=this.relativeTarget=void 0}calcProjection(){const o=this.getLead(),a=!!this.resumingFrom||this!==o;let c=!0;if((this.isProjectionDirty||this.parent?.isProjectionDirty)&&(c=!1),a&&(this.isSharedProjectionDirty||this.isTransformDirty)&&(c=!1),this.resolvedRelativeTargetAt===ye.timestamp&&(c=!1),c)return;const{layout:l,layoutId:u}=this.options;if(this.isTreeAnimating=!!(this.parent&&this.parent.isTreeAnimating||this.currentAnimation||this.pendingAnimation),this.isTreeAnimating||(this.targetDelta=this.relativeTarget=void 0),!this.layout||!(l||u))return;Ve(this.layoutCorrected,this.layout.layoutBox);const f=this.treeScale.x,h=this.treeScale.y;Oh(this.layoutCorrected,this.treeScale,this.path,a),o.layout&&!o.target&&(this.treeScale.x!==1||this.treeScale.y!==1)&&(o.target=o.layout.layoutBox,o.targetWithTransforms=he());const{target:y}=o;if(!y){this.prevProjectionDelta&&(this.createProjectionDeltas(),this.scheduleRender());return}!this.projectionDelta||!this.prevProjectionDelta?this.createProjectionDeltas():($o(this.prevProjectionDelta.x,this.projectionDelta.x),$o(this.prevProjectionDelta.y,this.projectionDelta.y)),Ht(this.projectionDelta,this.layoutCorrected,y,this.latestValues),(this.treeScale.x!==f||this.treeScale.y!==h||!qo(this.projectionDelta.x,this.prevProjectionDelta.x)||!qo(this.projectionDelta.y,this.prevProjectionDelta.y))&&(this.hasProjected=!0,this.scheduleRender(),this.notifyListeners("projectionUpdate",y))}hide(){this.isVisible=!1}show(){this.isVisible=!0}scheduleRender(o=!0){if(this.options.visualElement?.scheduleRender(),o){const a=this.getStack();a&&a.scheduleRender()}this.resumingFrom&&!this.resumingFrom.instance&&(this.resumingFrom=void 0)}createProjectionDeltas(){this.prevProjectionDelta=Ct(),this.projectionDelta=Ct(),this.projectionDeltaWithTransform=Ct()}setAnimationOrigin(o,a=!1,c){const l=this.snapshot,u=l?l.latestValues:{},f={...this.latestValues},h=Ct();(!this.relativeParent||!this.relativeParent.options.layoutRoot)&&(this.relativeTarget=this.relativeTargetOrigin=void 0),this.attemptToResolveRelativeTarget=!a;const y=he(),p=l?l.source:void 0,g=this.layout?this.layout.source:void 0,m=p!==g,w=this.getStack(),k=!w||w.members.length<=1,v=!!(m&&!k&&this.options.crossfade===!0&&!this.path.some(Rf));this.animationProgress=0;let x;const T=c?.interpolateProjection(o);this.mixTargetDelta=D=>{const S=D/1e3,P=T?.(S);P?(h.x.translate=P.x,h.x.scale=ee(o.x.scale,1,S),h.x.origin=o.x.origin,h.x.originPoint=o.x.originPoint,h.y.translate=P.y,h.y.scale=ee(o.y.scale,1,S),h.y.origin=o.y.origin,h.y.originPoint=o.y.originPoint):(nr(h.x,o.x,S),nr(h.y,o.y,S)),this.setTargetDelta(h),this.relativeTarget&&this.relativeTargetOrigin&&this.layout&&this.relativeParent&&this.relativeParent.layout&&(Fn(y,this.layout.layoutBox,this.relativeParent.layout.layoutBox,this.options.layoutAnchor||void 0),Of(this.relativeTarget,this.relativeTargetOrigin,y,S),x&&rf(this.relativeTarget,x)&&(this.isProjectionDirty=!1),x||(x=he()),Ve(x,this.relativeTarget)),m&&(this.animationValues=f,cf(f,u,this.latestValues,S,v,k)),P&&P.rotate!==void 0&&(this.animationValues||(this.animationValues=f),this.animationValues.pathRotation=P.rotate),this.root.scheduleUpdateProjection(),this.scheduleRender(),this.animationProgress=S},this.mixTargetDelta(this.options.layoutRoot?1e3:0)}startAnimation(o){this.notifyListeners("animationStart"),this.currentAnimation?.stop(),this.resumingFrom?.currentAnimation?.stop(),this.pendingAnimation&&(nt(this.pendingAnimation),this.pendingAnimation=void 0),this.pendingAnimation=te.update(()=>{En.hasAnimatedSinceResize=!0,this.motionValue||(this.motionValue=Pt(0)),this.motionValue.jump(0,!1),this.currentAnimation=hf(this.motionValue,[0,1e3],{...o,velocity:0,isSync:!0,onUpdate:a=>{this.mixTargetDelta(a),o.onUpdate&&o.onUpdate(a)},onComplete:()=>{o.onComplete&&o.onComplete(),this.completeAnimation()}}),this.resumingFrom&&(this.resumingFrom.currentAnimation=this.currentAnimation),this.pendingAnimation=void 0})}completeAnimation(){this.resumingFrom&&(this.resumingFrom.currentAnimation=void 0,this.resumingFrom.preserveOpacity=void 0);const o=this.getStack();o&&o.exitAnimationComplete(),this.resumingFrom=this.currentAnimation=this.animationValues=void 0,this.notifyListeners("animationComplete")}finishAnimation(){this.currentAnimation&&(this.mixTargetDelta&&this.mixTargetDelta(yf),this.currentAnimation.stop()),this.completeAnimation()}applyTransformsToTarget(){const o=this.getLead();let{targetWithTransforms:a,target:c,layout:l,latestValues:u}=o;if(!(!a||!c||!l)){if(this!==o&&this.layout&&l&&Cl(this.options.animationType,this.layout.layoutBox,l.layoutBox)){c=this.target||he();const f=Se(this.layout.layoutBox.x);c.x.min=o.target.x.min,c.x.max=c.x.min+f;const h=Se(this.layout.layoutBox.y);c.y.min=o.target.y.min,c.y.max=c.y.min+h}Ve(a,c),An(a,u),Ht(this.projectionDeltaWithTransform,this.layoutCorrected,a,u)}}registerSharedNode(o,a){this.sharedNodes.has(o)||this.sharedNodes.set(o,new gf),this.sharedNodes.get(o).add(a);const l=a.options.initialPromotionConfig;a.promote({transition:l?l.transition:void 0,preserveFollowOpacity:l&&l.shouldPreserveFollowOpacity?l.shouldPreserveFollowOpacity(a):void 0})}isLead(){const o=this.getStack();return o?o.lead===this:!0}getLead(){const{layoutId:o}=this.options;return o?this.getStack()?.lead||this:this}getPrevLead(){const{layoutId:o}=this.options;return o?this.getStack()?.prevLead:void 0}getStack(){const{layoutId:o}=this.options;if(o)return this.root.sharedNodes.get(o)}promote({needsReset:o,transition:a,preserveFollowOpacity:c}={}){const l=this.getStack();l&&l.promote(this,c),o&&(this.projectionDelta=void 0,this.needsReset=!0),a&&this.setOptions({transition:a})}relegate(){const o=this.getStack();return o?o.relegate(this):!1}resetSkewAndRotation(){const{visualElement:o}=this.options;if(!o)return;let a=!1;const{latestValues:c}=o;if((c.z||c.rotate||c.rotateX||c.rotateY||c.rotateZ||c.skewX||c.skewY)&&(a=!0),!a)return;const l={};c.z&&ui("z",o,l,this.animationValues);for(let u=0;u<ci.length;u++)ui(`rotate${ci[u]}`,o,l,this.animationValues),ui(`skew${ci[u]}`,o,l,this.animationValues);o.render();for(const u in l)o.setStaticValue(u,l[u]),this.animationValues&&(this.animationValues[u]=l[u]);o.scheduleRender()}applyProjectionStyles(o,a){if(!this.instance||this.isSVG)return;if(!this.isVisible){o.visibility="hidden";return}const c=this.getTransformTemplate();if(this.needsReset){this.needsReset=!1,o.visibility="",o.opacity="",o.pointerEvents=Pn(a?.pointerEvents)||"",o.transform=c?c(this.latestValues,""):"none";return}const l=this.getLead();if(!this.projectionDelta||!this.layout||!l.target){this.options.layoutId&&(o.opacity=this.latestValues.opacity!==void 0?this.latestValues.opacity:1,o.pointerEvents=Pn(a?.pointerEvents)||""),this.hasProjected&&!ct(this.latestValues)&&(o.transform=c?c({},""):"none",this.hasProjected=!1);return}o.visibility="";const u=l.animationValues||l.latestValues;this.applyTransformsToTarget();let f=af(this.projectionDeltaWithTransform,this.treeScale,u);c&&(f=c(u,f)),o.transform=f;const{x:h,y}=this.projectionDelta;o.transformOrigin=`${h.origin*100}% ${y.origin*100}% 0`,l.animationValues?o.opacity=l===this?u.opacity??this.latestValues.opacity??1:this.preserveOpacity?this.latestValues.opacity:u.opacityExit:o.opacity=l===this?u.opacity!==void 0?u.opacity:"":u.opacityExit!==void 0?u.opacityExit:0;for(const p in ss){if(u[p]===void 0)continue;const{correct:g,applyTo:m,isCSSVariable:w}=ss[p],k=f==="none"?u[p]:g(u[p],l);if(m){const v=m.length;for(let x=0;x<v;x++)o[m[x]]=k}else w?this.options.visualElement.renderState.vars[p]=k:o[p]=k}this.options.layoutId&&(o.pointerEvents=l===this?Pn(a?.pointerEvents)||"":"none")}clearSnapshot(){this.resumeFrom=this.snapshot=void 0}resetTree(){this.root.nodes.forEach(o=>o.currentAnimation?.stop()),this.root.nodes.forEach(Jo),this.root.sharedNodes.clear()}}}function bf(e){e.updateLayout()}function xf(e){const t=e.resumeFrom?.snapshot||e.snapshot;if(e.isLead()&&e.layout&&t&&e.hasListeners("didUpdate")){const{layoutBox:n,measuredBox:i}=e.layout,{animationType:s}=e.options,r=t.source!==e.layout.source;if(s==="size")Fe(u=>{const f=r?t.measuredBox[u]:t.layoutBox[u],h=Se(f);f.min=n[u].min,f.max=f.min+h});else if(s==="x"||s==="y"){const u=s==="x"?"y":"x";os(r?t.measuredBox[u]:t.layoutBox[u],n[u])}else Cl(s,t.layoutBox,n)&&Fe(u=>{const f=r?t.measuredBox[u]:t.layoutBox[u],h=Se(n[u]);f.max=f.min+h,e.relativeTarget&&!e.currentAnimation&&(e.isProjectionDirty=!0,e.relativeTarget[u].max=e.relativeTarget[u].min+h)});const o=Ct();Ht(o,n,t.layoutBox);const a=Ct();r?Ht(a,e.applyTransform(i,!0),t.measuredBox):Ht(a,n,t.layoutBox);const c=!xl(o);let l=!1;if(!e.resumeFrom){const u=e.getClosestProjectingParent();if(u&&!u.resumeFrom){const{snapshot:f,layout:h}=u;if(f&&h){const y=e.options.layoutAnchor||void 0,p=he();Fn(p,t.layoutBox,f.layoutBox,y);const g=he();Fn(g,n,h.layoutBox,y),vl(p,g)||(l=!0),u.options.layoutRoot&&(e.relativeTarget=g,e.relativeTargetOrigin=p,e.relativeParent=u)}}}e.notifyListeners("didUpdate",{layout:n,snapshot:t,delta:a,layoutDelta:o,hasLayoutChanged:c,hasRelativeLayoutChanged:l})}else if(e.isLead()){const{onExitComplete:n}=e.options;n&&n()}e.options.transition=void 0}function vf(e){e.parent&&(e.isProjecting()||(e.isProjectionDirty=e.parent.isProjectionDirty),e.isSharedProjectionDirty||(e.isSharedProjectionDirty=!!(e.isProjectionDirty||e.parent.isProjectionDirty||e.parent.isSharedProjectionDirty)),e.isTransformDirty||(e.isTransformDirty=e.parent.isTransformDirty))}function kf(e){e.isProjectionDirty=e.isSharedProjectionDirty=e.isTransformDirty=!1}function Sf(e){e.clearSnapshot()}function Jo(e){e.clearMeasurements()}function Tf(e){e.isLayoutDirty=!0,e.updateLayout()}function er(e){e.isLayoutDirty=!1}function Cf(e){e.isAnimationBlocked&&e.layout&&!e.isLayoutDirty&&(e.snapshot=e.layout,e.isLayoutDirty=!0)}function Af(e){const{visualElement:t}=e.options;t&&t.getProps().onBeforeLayoutMeasure&&t.notify("BeforeLayoutMeasure"),e.resetTransform()}function tr(e){e.finishAnimation(),e.targetDelta=e.relativeTarget=e.target=void 0,e.isProjectionDirty=!0}function Pf(e){e.resolveTargetDelta()}function Ef(e){e.calcProjection()}function Df(e){e.resetSkewAndRotation()}function Mf(e){e.removeLeadSnapshot()}function nr(e,t,n){e.translate=ee(t.translate,0,n),e.scale=ee(t.scale,1,n),e.origin=t.origin,e.originPoint=t.originPoint}function ir(e,t,n,i){e.min=ee(t.min,n.min,i),e.max=ee(t.max,n.max,i)}function Of(e,t,n,i){ir(e.x,t.x,n.x,i),ir(e.y,t.y,n.y,i)}function Rf(e){return e.animationValues&&e.animationValues.opacityExit!==void 0}const jf={duration:.45,ease:[.4,0,.1,1]},sr=e=>typeof navigator<"u"&&navigator.userAgent&&navigator.userAgent.toLowerCase().includes(e),or=sr("applewebkit/")&&!sr("chrome/")?Math.round:Le;function rr(e){e.min=or(e.min),e.max=or(e.max)}function Lf(e){rr(e.x),rr(e.y)}function Cl(e,t,n){return e==="position"||e==="preserve-aspect"&&!ef(Qo(t),Qo(n),.2)}function Nf(e){return e!==e.root&&e.scroll?.wasRoot}const If=Tl({attachResizeListener:(e,t)=>Xt(e,"resize",t),measureScroll:()=>({x:document.documentElement.scrollLeft||document.body?.scrollLeft||0,y:document.documentElement.scrollTop||document.body?.scrollTop||0}),checkIsScrollRoot:()=>!0}),di={current:void 0},Al=Tl({measureScroll:e=>({x:e.scrollLeft,y:e.scrollTop}),defaultParent:()=>{if(!di.current){const e=new If({});e.mount(window),e.setOptions({layoutScroll:!0}),di.current=e}return di.current},resetTransform:(e,t)=>{e.style.transform=t!==void 0?t:"none"},checkIsScrollRoot:e=>window.getComputedStyle(e).position==="fixed"}),Fs=b.createContext({transformPagePoint:e=>e,isStatic:!1,reducedMotion:"never"});function ar(e,t){if(typeof e=="function")return e(t);e!=null&&(e.current=t)}function Vf(...e){return t=>{let n=!1;const i=e.map(s=>{const r=ar(s,t);return!n&&typeof r=="function"&&(n=!0),r});if(n)return()=>{for(let s=0;s<i.length;s++){const r=i[s];typeof r=="function"?r():ar(e[s],null)}}}}function $f(...e){return b.useCallback(Vf(...e),e)}class Bf extends b.Component{getSnapshotBeforeUpdate(t){const n=this.props.childRef.current;if(vn(n)&&t.isPresent&&!this.props.isPresent&&this.props.pop!==!1){const i=n.offsetParent,s=vn(i)&&i.offsetWidth||0,r=vn(i)&&i.offsetHeight||0,o=getComputedStyle(n),a=this.props.sizeRef.current;a.height=parseFloat(o.height),a.width=parseFloat(o.width),a.top=n.offsetTop,a.left=n.offsetLeft,a.right=s-a.width-a.left,a.bottom=r-a.height-a.top,a.direction=o.direction}return null}componentDidUpdate(){}render(){return this.props.children}}function Ff({children:e,isPresent:t,anchorX:n,anchorY:i,root:s,pop:r}){const o=b.useId(),a=b.useRef(null),c=b.useRef({width:0,height:0,top:0,left:0,right:0,bottom:0,direction:"ltr"}),{nonce:l}=b.useContext(Fs),u=r!==!1?e.props?.ref??e?.ref:void 0,f=$f(a,u);return b.useInsertionEffect(()=>{const{width:h,height:y,top:p,left:g,right:m,bottom:w,direction:k}=c.current;if(t||r===!1||!a.current||!h||!y)return;const v=k==="rtl",x=n==="left"?v?`right: ${m}`:`left: ${g}`:v?`left: ${g}`:`right: ${m}`,T=i==="bottom"?`bottom: ${w}`:`top: ${p}`;a.current.dataset.motionPopId=o;const D=document.createElement("style");l&&(D.nonce=l);const S=s??document.head;return S.appendChild(D),D.sheet&&D.sheet.insertRule(`
          [data-motion-pop-id="${o}"] {
            position: absolute !important;
            width: ${h}px !important;
            height: ${y}px !important;
            ${x}px !important;
            ${T}px !important;
          }
        `),()=>{a.current?.removeAttribute("data-motion-pop-id"),S.contains(D)&&S.removeChild(D)}},[t]),d.jsx(Bf,{isPresent:t,childRef:a,sizeRef:c,pop:r,children:r===!1?e:b.cloneElement(e,{ref:f})})}const _f=({children:e,initial:t,isPresent:n,onExitComplete:i,custom:s,presenceAffectsLayout:r,mode:o,anchorX:a,anchorY:c,root:l})=>{const u=ms(Hf),f=b.useId(),h=b.useRef(n),y=b.useRef(i);Rn(()=>{h.current=n,y.current=i});let p=!0,g=b.useMemo(()=>(p=!1,{id:f,initial:t,isPresent:n,custom:s,onExitComplete:m=>{u.set(m,!0);for(const w of u.values())if(!w)return;i&&i()},register:m=>(u.set(m,!1),()=>{u.delete(m),!h.current&&!u.size&&y.current?.()})}),[n,u,i]);return r&&p&&(g={...g}),b.useMemo(()=>{u.forEach((m,w)=>u.set(w,!1))},[n]),b.useEffect(()=>{!n&&!u.size&&i&&i()},[n]),e=d.jsx(Ff,{pop:o==="popLayout",isPresent:n,anchorX:a,anchorY:c,root:l,children:e}),d.jsx(Wn.Provider,{value:g,children:e})};function Hf(){return new Map}function Pl(e=!0){const t=b.useContext(Wn);if(t===null)return[!0,null];const{isPresent:n,onExitComplete:i,register:s}=t,r=b.useId();b.useEffect(()=>{if(e)return s(r)},[e]);const o=b.useCallback(()=>e&&i&&i(r),[r,i,e]);return!n&&i?[!1,o]:[!0]}const ln=e=>e.key||"";function lr(e){const t=[];return b.Children.forEach(e,n=>{b.isValidElement(n)&&t.push(n)}),t}const Wf=({children:e,custom:t,initial:n=!0,onExitComplete:i,presenceAffectsLayout:s=!0,mode:r="sync",propagate:o=!1,anchorX:a="left",anchorY:c="top",root:l})=>{const[u,f]=Pl(o),h=b.useMemo(()=>lr(e),[e]),y=o&&!u?[]:h.map(ln),p=b.useRef(!0),g=b.useRef(h),m=ms(()=>new Map),w=b.useRef(new Set),[k,v]=b.useState(h),[x,T]=b.useState(h);Rn(()=>{o&&!u&&!x.length&&f?.()},[u,o,x.length,f]),Rn(()=>{p.current=!1,g.current=h;for(let P=0;P<x.length;P++){const E=ln(x[P]);y.includes(E)?(m.delete(E),w.current.delete(E)):m.get(E)!==!0&&m.set(E,!1)}},[x,y.length,y.join("-")]);const D=[];if(h!==k){let P=[...h],E=0;for(const N of x){const V=y.indexOf(ln(N));V===-1?(P.splice(E++,0,N),D.push(N)):E=V+D.length+1}return r==="wait"&&D.length&&(P=D),T(lr(P)),v(h),null}const{forceRender:S}=b.useContext(ps);return d.jsx(d.Fragment,{children:x.map(P=>{const E=ln(P),N=o&&!u?!1:h===x||y.includes(E),V=()=>{if(w.current.has(E))return;if(m.has(E))w.current.add(E),m.set(E,!0);else return;let $=!0;m.forEach(O=>{O||($=!1)}),$&&(S?.(),T(g.current),o&&f?.(),i&&i())};return d.jsx(_f,{isPresent:N,initial:!p.current||n?void 0:!1,custom:t,presenceAffectsLayout:s,mode:r,root:l,onExitComplete:N?void 0:V,anchorX:a,anchorY:c,children:P},E)})})},El=b.createContext({strict:!1}),cr={animation:["animate","variants","whileHover","whileTap","exit","whileInView","whileFocus","whileDrag"],exit:["exit"],drag:["drag","dragControls"],focus:["whileFocus"],hover:["whileHover","onHoverStart","onHoverEnd"],tap:["whileTap","onTap","onTapStart","onTapCancel"],pan:["onPan","onPanStart","onPanSessionStart","onPanEnd"],inView:["whileInView","onViewportEnter","onViewportLeave"],layout:["layout","layoutId"]};let ur=!1;function zf(){if(ur)return;const e={};for(const t in cr)e[t]={isEnabled:n=>cr[t].some(i=>!!n[i])};il(e),ur=!0}function Dl(){return zf(),Ph()}function Uf(e){const t=Dl();for(const n in e)t[n]={...t[n],...e[n]};il(t)}const Qn=b.createContext({});function Gf(e,t){if(Kn(e)){const{initial:n,animate:i}=e;return{initial:n===!1||Yt(n)?n:void 0,animate:Yt(i)?i:void 0}}return e.inherit!==!1?t:{}}function Kf(e){const{initial:t,animate:n}=Gf(e,b.useContext(Qn));return b.useMemo(()=>({initial:t,animate:n}),[dr(t),dr(n)])}function dr(e){return Array.isArray(e)?e.join(" "):e}const _s=()=>({style:{},transform:{},transformOrigin:{},vars:{}});function Ml(e,t,n){for(const i in t)!we(t[i])&&!ul(i,n)&&(e[i]=t[i])}function Qf({transformTemplate:e},t){return b.useMemo(()=>{const n=_s();return $s(n,t,e),Object.assign({},n.vars,n.style)},[t])}function qf(e,t){const n=e.style||{},i={};return Ml(i,n,e),Object.assign(i,Qf(e,t)),i}function Yf(e,t){const n={},i=qf(e,t);return e.drag&&e.dragListener!==!1&&(n.draggable=!1,i.userSelect=i.WebkitUserSelect=i.WebkitTouchCallout="none",i.touchAction=e.drag===!0?"none":`pan-${e.drag==="x"?"y":"x"}`),e.tabIndex===void 0&&(e.onTap||e.onTapStart||e.whileTap)&&(n.tabIndex=0),n.style=i,n}const Ol=()=>({..._s(),attrs:{}});function Xf(e,t,n,i){const s=b.useMemo(()=>{const r=Ol();return hl(r,t,pl(i),e.transformTemplate,e.style),{...r.attrs,style:{...r.style}}},[t]);if(e.style){const r={};Ml(r,e.style,e),s.style={...r,...s.style}}return s}const Zf=new Set(["animate","exit","variants","initial","style","values","variants","transition","transformTemplate","custom","inherit","onBeforeLayoutMeasure","onAnimationStart","onAnimationComplete","onUpdate","onDragStart","onDrag","onDragEnd","onMeasureDragConstraints","onDirectionLock","onDragTransitionEnd","_dragX","_dragY","onHoverStart","onHoverEnd","onViewportEnter","onViewportLeave","globalTapTarget","propagate","ignoreStrict","viewport"]);function _n(e){return e.startsWith("while")||e.startsWith("drag")&&e!=="draggable"||e.startsWith("layout")||e.startsWith("onTap")||e.startsWith("onPan")||e.startsWith("onLayout")||Zf.has(e)}function Jf(e,t){return e.startsWith("on")?!_n(e):t?.(e)??!_n(e)}function ep(e,t,n,i){const s={};for(const r in e)r==="values"&&typeof e.values=="object"||we(e[r])||(Jf(r,i)||n===!0&&_n(r)||!t&&!_n(r)||e.draggable&&r.startsWith("onDrag"))&&(s[r]=e[r]);return s}const tp=["animate","circle","defs","desc","ellipse","g","image","line","filter","marker","mask","metadata","path","pattern","polygon","polyline","rect","stop","switch","symbol","svg","text","tspan","use","view"];function Hs(e){return typeof e!="string"||e.includes("-")?!1:!!(tp.indexOf(e)>-1||/[A-Z]/u.test(e))}function np(e,t,n,{latestValues:i},s,r=!1,o,a){const l=(o??Hs(e)?Xf:Yf)(t,i,s,e),u=ep(t,typeof e=="string",r,a),f=e!==b.Fragment?{...u,...l,ref:n}:{},{children:h}=t,y=b.useMemo(()=>we(h)?h.get():h,[h]);return b.createElement(e,{...f,children:y})}function ip({scrapeMotionValuesFromProps:e,createRenderState:t},n,i,s){return{latestValues:sp(n,i,s,e),renderState:t()}}function sp(e,t,n,i){const s={},r=i(e,{});for(const h in r)s[h]=Pn(r[h]);let{initial:o,animate:a}=e;const c=Kn(e),l=tl(e);t&&l&&!c&&e.inherit!==!1&&(o===void 0&&(o=t.initial),a===void 0&&(a=t.animate));let u=n?n.initial===!1:!1;u=u||o===!1;const f=u?a:o;if(f&&typeof f!="boolean"&&!Gn(f)){const h=Array.isArray(f)?f:[f];for(let y=0;y<h.length;y++){const p=Ms(e,h[y]);if(p){const{transitionEnd:g,transition:m,...w}=p;for(const k in w){let v=w[k];if(Array.isArray(v)){const x=u?v.length-1:0;v=v[x]}v!==null&&(s[k]=v)}for(const k in g)s[k]=g[k]}}}return s}const Rl=e=>(t,n)=>{const i=b.useContext(Qn),s=b.useContext(Wn),r=()=>ip(e,t,i,s);return n?r():ms(r)},op=Rl({scrapeMotionValuesFromProps:Bs,createRenderState:_s}),rp=Rl({scrapeMotionValuesFromProps:ml,createRenderState:Ol}),ap=Symbol.for("motionComponentSymbol");function lp(e,t,n){const i=b.useRef(n);b.useInsertionEffect(()=>{i.current=n});const s=b.useRef(null);return b.useCallback(r=>{r&&e.onMount?.(r),t&&(r?t.mount(r):t.unmount());const o=i.current;if(typeof o=="function")if(r){const a=o(r);typeof a=="function"&&(s.current=a)}else s.current?(s.current(),s.current=null):o(r);else o&&(o.current=r)},[t])}const jl=b.createContext({});function kt(e){return e&&typeof e=="object"&&Object.prototype.hasOwnProperty.call(e,"current")}function cp(e,t,n,i,s,r){const{visualElement:o}=b.useContext(Qn),a=b.useContext(El),c=b.useContext(Wn),l=b.useContext(Fs),u=l.reducedMotion,f=l.skipAnimations,h=b.useRef(null),y=b.useRef(!1);i=i||a.renderer,!h.current&&i&&(h.current=i(e,{visualState:t,parent:o,props:n,presenceContext:c,blockInitialAnimation:c?c.initial===!1:!1,reducedMotionConfig:u,skipAnimations:f,isSVG:r}),y.current&&h.current&&(h.current.manuallyAnimateOnMount=!0));const p=h.current,g=b.useContext(jl);p&&!p.projection&&s&&(p.type==="html"||p.type==="svg")&&up(h.current,n,s,g);const m=b.useRef(!1);b.useInsertionEffect(()=>{p&&m.current&&p.update(n,c)});const w=n[Wa],k=b.useRef(!!w&&typeof window<"u"&&!window.MotionHandoffIsComplete?.(w)&&window.MotionHasOptimisedAnimation?.(w));return Rn(()=>{y.current=!0,p&&(m.current=!0,window.MotionIsMounted=!0,p.updateFeatures(),p.scheduleRenderMicrotask(),k.current&&p.animationState&&p.animationState.animateChanges())}),b.useEffect(()=>{p&&(!k.current&&p.animationState&&p.animationState.animateChanges(),k.current&&(queueMicrotask(()=>{window.MotionHandoffMarkAsComplete?.(w)}),k.current=!1),p.enteringChildren=void 0)}),p}function up(e,t,n,i){const{layoutId:s,layout:r,drag:o,dragConstraints:a,layoutScroll:c,layoutRoot:l,layoutAnchor:u,layoutCrossfade:f}=t;e.projection=new n(e.latestValues,t["data-framer-portal-id"]?void 0:Ll(e.parent)),e.projection.setOptions({layoutId:s,layout:r,alwaysMeasureLayout:!!o||a&&kt(a),visualElement:e,animationType:typeof r=="string"?r:"both",initialPromotionConfig:i,crossfade:f,layoutScroll:c,layoutRoot:l,layoutAnchor:u})}function Ll(e){if(e)return e.options.allowProjection!==!1?e.projection:Ll(e.parent)}function hi(e,{forwardMotionProps:t=!1,type:n}={},i,s){i&&Uf(i);const r=n?n==="svg":Hs(e),o=r?rp:op;function a(l,u){let f;const h={...b.useContext(Fs),...l,layoutId:dp(l)},{isStatic:y,isValidProp:p}=h,g=Kf(l),m=o(l,y);if(!y&&typeof window<"u"){hp();const w=fp(h);f=w.MeasureLayout,g.visualElement=cp(e,m,h,s,w.ProjectionNode,r)}return d.jsxs(Qn.Provider,{value:g,children:[f&&g.visualElement?d.jsx(f,{visualElement:g.visualElement,...h}):null,np(e,l,lp(m,g.visualElement,u),m,y,t,r,p)]})}a.displayName=`motion.${typeof e=="string"?e:`create(${e.displayName??e.name??""})`}`;const c=b.forwardRef(a);return c[ap]=e,c}function dp({layoutId:e}){const t=b.useContext(ps).id;return t&&e!==void 0?t+"-"+e:e}function hp(e,t){b.useContext(El).strict}function fp(e){const t=Dl(),{drag:n,layout:i}=t;if(!n&&!i)return{};const s={...n,...i};return{MeasureLayout:n?.isEnabled(e)||i?.isEnabled(e)?s.MeasureLayout:void 0,ProjectionNode:s.ProjectionNode}}function pp(e,t){if(typeof Proxy>"u")return hi;const n=new Map,i=(r,o)=>hi(r,o,e,t),s=(r,o)=>i(r,o);return new Proxy(s,{get:(r,o)=>o==="create"?i:(n.has(o)||n.set(o,hi(o,void 0,e,t)),n.get(o))})}const mp=(e,t)=>t.isSVG??Hs(e)?new Wh(t):new $h(t,{allowProjection:e!==b.Fragment});class gp extends it{constructor(t){super(t),t.animationState||(t.animationState=Qh(t))}updateAnimationControlsSubscription(){const{animate:t}=this.node.getProps();Gn(t)&&(this.unmountControls=t.subscribe(this.node))}mount(){this.updateAnimationControlsSubscription()}update(){const{animate:t}=this.node.getProps(),{animate:n}=this.node.prevProps||{};t!==n&&this.updateAnimationControlsSubscription()}unmount(){this.node.animationState.reset(),this.unmountControls?.()}}let yp=0;class wp extends it{constructor(){super(...arguments),this.id=yp++,this.isExitComplete=!1}update(){if(!this.node.presenceContext)return;const{isPresent:t,onExitComplete:n}=this.node.presenceContext,{isPresent:i}=this.node.prevPresenceContext||{};if(!this.node.animationState||t===i)return;if(t&&i===!1){if(this.isExitComplete){const{initial:r,custom:o}=this.node.getProps();if(typeof r=="string"||typeof r=="object"&&r!==null&&!Array.isArray(r)){const a=ft(this.node,r,o);if(a){const{transition:c,transitionEnd:l,...u}=a;for(const f in u)this.node.getValue(f)?.jump(u[f])}}this.node.animationState.reset(),this.node.animationState.animateChanges()}else this.node.animationState.setActive("exit",!1);this.isExitComplete=!1;return}const s=this.node.animationState.setActive("exit",!t);n&&!t&&s.then(()=>{this.isExitComplete=!0,n(this.id)})}mount(){const{register:t,onExitComplete:n}=this.node.presenceContext||{};n&&n(this.id),t&&(this.unmount=t(this.id))}unmount(){}}const bp={animation:{Feature:gp},exit:{Feature:wp}};function tn(e){return{point:{x:e.pageX,y:e.pageY}}}const xp=e=>t=>Ls(t)&&e(t,tn(t));function Wt(e,t,n,i){return Xt(e,t,xp(n),i)}const Nl=({current:e})=>e?e.ownerDocument.defaultView:null,hr=(e,t)=>Math.abs(e-t);function vp(e,t){const n=hr(e.x,t.x),i=hr(e.y,t.y);return Math.sqrt(n**2+i**2)}const fr=new Set(["auto","scroll"]);class Il{constructor(t,n,{transformPagePoint:i,contextWindow:s=window,dragSnapToOrigin:r=!1,distanceThreshold:o=3,element:a}={}){if(this.startEvent=null,this.lastMoveEvent=null,this.lastMoveEventInfo=null,this.lastRawMoveEventInfo=null,this.handlers={},this.contextWindow=window,this.scrollPositions=new Map,this.removeScrollListeners=null,this.onElementScroll=p=>{this.handleScroll(p.target)},this.onWindowScroll=()=>{this.handleScroll(window)},this.updatePoint=()=>{if(!(this.lastMoveEvent&&this.lastMoveEventInfo))return;this.lastRawMoveEventInfo&&(this.lastMoveEventInfo=cn(this.lastRawMoveEventInfo,this.transformPagePoint));const p=fi(this.lastMoveEventInfo,this.history),g=this.startEvent!==null,m=vp(p.offset,{x:0,y:0})>=this.distanceThreshold;if(!g&&!m)return;const{point:w}=p,{timestamp:k}=ye;this.history.push({...w,timestamp:k});const{onStart:v,onMove:x}=this.handlers;g||(v&&v(this.lastMoveEvent,p),this.startEvent=this.lastMoveEvent),x&&x(this.lastMoveEvent,p)},this.handlePointerMove=(p,g)=>{this.lastMoveEvent=p,this.lastRawMoveEventInfo=g,this.lastMoveEventInfo=cn(g,this.transformPagePoint),te.update(this.updatePoint,!0)},this.handlePointerUp=(p,g)=>{this.end();const{onEnd:m,onSessionEnd:w,resumeAnimation:k}=this.handlers;if((this.dragSnapToOrigin||!this.startEvent)&&k&&k(),!(this.lastMoveEvent&&this.lastMoveEventInfo))return;const v=fi(p.type==="pointercancel"?this.lastMoveEventInfo:cn(g,this.transformPagePoint),this.history);this.startEvent&&m&&m(p,v),w&&w(p,v)},!Ls(t))return;this.dragSnapToOrigin=r,this.handlers=n,this.transformPagePoint=i,this.distanceThreshold=o,this.contextWindow=s||window;const c=tn(t),l=cn(c,this.transformPagePoint),{point:u}=l,{timestamp:f}=ye;this.history=[{...u,timestamp:f}];const{onSessionStart:h}=n;h&&h(t,fi(l,this.history));const y={passive:!0,capture:!0};this.removeListeners=Zt(Wt(this.contextWindow,"pointermove",this.handlePointerMove,y),Wt(this.contextWindow,"pointerup",this.handlePointerUp,y),Wt(this.contextWindow,"pointercancel",this.handlePointerUp,y)),a&&this.startScrollTracking(a)}startScrollTracking(t){let n=t.parentElement;for(;n;){const i=getComputedStyle(n);(fr.has(i.overflowX)||fr.has(i.overflowY))&&this.scrollPositions.set(n,{x:n.scrollLeft,y:n.scrollTop}),n=n.parentElement}this.scrollPositions.set(window,{x:window.scrollX,y:window.scrollY}),window.addEventListener("scroll",this.onElementScroll,{capture:!0}),window.addEventListener("scroll",this.onWindowScroll),this.removeScrollListeners=()=>{window.removeEventListener("scroll",this.onElementScroll,{capture:!0}),window.removeEventListener("scroll",this.onWindowScroll)}}handleScroll(t){const n=this.scrollPositions.get(t);if(!n)return;const i=t===window,s=i?{x:window.scrollX,y:window.scrollY}:{x:t.scrollLeft,y:t.scrollTop},r={x:s.x-n.x,y:s.y-n.y};r.x===0&&r.y===0||(i?this.lastMoveEventInfo&&(this.lastMoveEventInfo.point.x+=r.x,this.lastMoveEventInfo.point.y+=r.y):this.history.length>0&&(this.history[0].x-=r.x,this.history[0].y-=r.y),this.scrollPositions.set(t,s),te.update(this.updatePoint,!0))}updateHandlers(t){this.handlers=t}end(){this.removeListeners&&this.removeListeners(),this.removeScrollListeners&&this.removeScrollListeners(),this.scrollPositions.clear(),nt(this.updatePoint)}}function cn(e,t){return t?{point:t(e.point)}:e}function pr(e,t){return{x:e.x-t.x,y:e.y-t.y}}function fi({point:e},t){return{point:e,delta:pr(e,Vl(t)),offset:pr(e,kp(t)),velocity:Sp(t,.1)}}function kp(e){return e[0]}function Vl(e){return e[e.length-1]}function Sp(e,t){if(e.length<2)return{x:0,y:0};let n=e.length-1,i=null;const s=Vl(e);for(;n>=0&&(i=e[n],!(s.timestamp-i.timestamp>Ne(t)));)n--;if(!i)return{x:0,y:0};i===e[0]&&e.length>2&&s.timestamp-i.timestamp>Ne(t)*2&&(i=e[1]);const r=je(s.timestamp-i.timestamp);if(r===0)return{x:0,y:0};const o={x:(s.x-i.x)/r,y:(s.y-i.y)/r};return o.x===1/0&&(o.x=0),o.y===1/0&&(o.y=0),o}function Tp(e,{min:t,max:n},i){return t!==void 0&&e<t?e=i?ee(t,e,i.min):Math.max(e,t):n!==void 0&&e>n&&(e=i?ee(n,e,i.max):Math.min(e,n)),e}function mr(e,t,n){return{min:t!==void 0?e.min+t:void 0,max:n!==void 0?e.max+n-(e.max-e.min):void 0}}function Cp(e,{top:t,left:n,bottom:i,right:s}){return{x:mr(e.x,n,s),y:mr(e.y,t,i)}}function gr(e,t){let n=t.min-e.min,i=t.max-e.max;return t.max-t.min<e.max-e.min&&([n,i]=[i,n]),{min:n,max:i}}function Ap(e,t){return{x:gr(e.x,t.x),y:gr(e.y,t.y)}}function Pp(e,t){let n=.5;const i=Se(e),s=Se(t);return s>i?n=Qt(t.min,t.max-i,e.min):i>s&&(n=Qt(e.min,e.max-s,t.min)),Ue(0,1,n)}function Ep(e,t){const n={};return t.min!==void 0&&(n.min=t.min-e.min),t.max!==void 0&&(n.max=t.max-e.min),n}const rs=.35;function Dp(e=rs){return e===!1?e=0:e===!0&&(e=rs),{x:yr(e,"left","right"),y:yr(e,"top","bottom")}}function yr(e,t,n){return{min:wr(e,t),max:wr(e,n)}}function wr(e,t){return typeof e=="number"?e:e[t]||0}const Mp=new WeakMap;class Op{constructor(t){this.openDragLock=null,this.isDragging=!1,this.currentDirection=null,this.originPoint={x:0,y:0},this.constraints=!1,this.hasMutatedConstraints=!1,this.elastic=he(),this.latestPointerEvent=null,this.latestPanInfo=null,this.visualElement=t}start(t,{snapToCursor:n=!1,distanceThreshold:i}={}){const{presenceContext:s}=this.visualElement;if(s&&s.isPresent===!1)return;const r=f=>{n&&this.snapToCursor(tn(f).point),this.stopAnimation()},o=(f,h)=>{const{drag:y,dragPropagation:p,onDragStart:g}=this.getProps();if(y&&!p&&(this.openDragLock&&this.openDragLock(),this.openDragLock=ih(y),!this.openDragLock))return;this.latestPointerEvent=f,this.latestPanInfo=h,this.isDragging=!0,this.currentDirection=null,this.resolveConstraints(),this.visualElement.projection&&(this.visualElement.projection.isAnimationBlocked=!0,this.visualElement.projection.target=void 0),Fe(w=>{let k=this.getAxisMotionValue(w).get()||0;if(ze.test(k)){const{projection:v}=this.visualElement;if(v&&v.layout){const x=v.layout.layoutBox[w];x&&(k=Se(x)*(parseFloat(k)/100))}}this.originPoint[w]=k}),g&&te.update(()=>g(f,h),!1,!0),Yi(this.visualElement,"transform");const{animationState:m}=this.visualElement;m&&m.setActive("whileDrag",!0)},a=(f,h)=>{this.latestPointerEvent=f,this.latestPanInfo=h;const{dragPropagation:y,dragDirectionLock:p,onDirectionLock:g,onDrag:m}=this.getProps();if(!y&&!this.openDragLock)return;const{offset:w}=h;if(p&&this.currentDirection===null){this.currentDirection=jp(w),this.currentDirection!==null&&g&&g(this.currentDirection);return}this.updateAxis("x",h.point,w),this.updateAxis("y",h.point,w),this.visualElement.render(),m&&te.update(()=>m(f,h),!1,!0)},c=(f,h)=>{this.latestPointerEvent=f,this.latestPanInfo=h,this.stop(f,h),this.latestPointerEvent=null,this.latestPanInfo=null},l=()=>{const{dragSnapToOrigin:f}=this.getProps();(f||this.constraints)&&this.startAnimation({x:0,y:0})},{dragSnapToOrigin:u}=this.getProps();this.panSession=new Il(t,{onSessionStart:r,onStart:o,onMove:a,onSessionEnd:c,resumeAnimation:l},{transformPagePoint:this.visualElement.getTransformPagePoint(),dragSnapToOrigin:u,distanceThreshold:i,contextWindow:Nl(this.visualElement),element:this.visualElement.current})}stop(t,n){const i=t||this.latestPointerEvent,s=n||this.latestPanInfo,r=this.isDragging;if(this.cancel(),!r||!s||!i)return;const{velocity:o}=s;this.startAnimation(o);const{onDragEnd:a}=this.getProps();a&&te.postRender(()=>a(i,s))}cancel(){this.isDragging=!1;const{projection:t,animationState:n}=this.visualElement;t&&(t.isAnimationBlocked=!1),this.endPanSession();const{dragPropagation:i}=this.getProps();!i&&this.openDragLock&&(this.openDragLock(),this.openDragLock=null),n&&n.setActive("whileDrag",!1)}endPanSession(){this.panSession&&this.panSession.end(),this.panSession=void 0}updateAxis(t,n,i){const{drag:s}=this.getProps();if(!i||!un(t,s,this.currentDirection))return;const r=this.getAxisMotionValue(t);let o=this.originPoint[t]+i[t];this.constraints&&this.constraints[t]&&(o=Tp(o,this.constraints[t],this.elastic[t])),r.set(o)}resolveConstraints(){const{dragConstraints:t,dragElastic:n}=this.getProps(),i=this.visualElement.projection&&!this.visualElement.projection.layout?this.visualElement.projection.measure(!1):this.visualElement.projection?.layout,s=this.constraints;t&&kt(t)?this.constraints||(this.constraints=this.resolveRefConstraints()):t&&i?this.constraints=Cp(i.layoutBox,t):this.constraints=!1,this.elastic=Dp(n),s!==this.constraints&&!kt(t)&&i&&this.constraints&&!this.hasMutatedConstraints&&Fe(r=>{this.constraints!==!1&&this.getAxisMotionValue(r)&&(this.constraints[r]=Ep(i.layoutBox[r],this.constraints[r]))})}resolveRefConstraints(){const{dragConstraints:t,onMeasureDragConstraints:n}=this.getProps();if(!t||!kt(t))return!1;const i=t.current,{projection:s}=this.visualElement;if(!s||!s.layout)return!1;s.root&&(s.root.scroll=void 0,s.root.updateScroll());const r=Rh(i,s.root,this.visualElement.getTransformPagePoint());let o=Ap(s.layout.layoutBox,r);if(n){const a=n(Dh(o));this.hasMutatedConstraints=!!a,a&&(o=ol(a))}return o}startAnimation(t){const{drag:n,dragMomentum:i,dragElastic:s,dragTransition:r,dragSnapToOrigin:o,onDragTransitionEnd:a}=this.getProps(),c=this.constraints||{},l=Fe(u=>{if(!un(u,n,this.currentDirection))return;let f=c&&c[u]||{};(o===!0||o===u)&&(f={min:0,max:0});const h=s?200:1e6,y=s?40:1e7,p={type:"inertia",velocity:i?t[u]:0,bounceStiffness:h,bounceDamping:y,timeConstant:750,restDelta:1,restSpeed:10,...r,...f};return this.startAxisValueAnimation(u,p)});return Promise.all(l).then(a)}startAxisValueAnimation(t,n){const i=this.getAxisMotionValue(t);return Yi(this.visualElement,t),i.start(Ds(t,i,0,n,this.visualElement,!1))}stopAnimation(){Fe(t=>this.getAxisMotionValue(t).stop())}getAxisMotionValue(t){const n=`_drag${t.toUpperCase()}`,s=this.visualElement.getProps()[n];return s||this.visualElement.getValue(t,this.visualElement.latestValues[t]??0)}snapToCursor(t){Fe(n=>{const{drag:i}=this.getProps();if(!un(n,i,this.currentDirection))return;const{projection:s}=this.visualElement,r=this.getAxisMotionValue(n);if(s&&s.layout){const{min:o,max:a}=s.layout.layoutBox[n],c=r.get()||0;r.set(t[n]-ee(o,a,.5)+c)}})}scalePositionWithinConstraints(){if(!this.visualElement.current)return;const{drag:t,dragConstraints:n}=this.getProps(),{projection:i}=this.visualElement;if(!kt(n)||!i||!this.constraints)return;this.stopAnimation();const s={x:0,y:0};Fe(o=>{const a=this.getAxisMotionValue(o);if(a&&this.constraints!==!1){const c=a.get();s[o]=Pp({min:c,max:c},this.constraints[o])}});const{transformTemplate:r}=this.visualElement.getProps();this.visualElement.current.style.transform=r?r({},""):"none",i.root&&i.root.updateScroll(),i.updateLayout(),this.constraints=!1,this.resolveConstraints(),Fe(o=>{if(!un(o,t,null))return;const a=this.getAxisMotionValue(o),{min:c,max:l}=this.constraints[o];a.set(ee(c,l,s[o]))}),this.visualElement.render()}addListeners(){if(!this.visualElement.current)return;Mp.set(this.visualElement,this);const t=this.visualElement.current,n=Wt(t,"pointerdown",l=>{const{drag:u,dragListener:f=!0}=this.getProps(),h=l.target,y=h!==t&&ch(h);u&&f&&!y&&this.start(l)});let i;const s=()=>{const{dragConstraints:l}=this.getProps();kt(l)&&l.current&&(this.constraints=this.resolveRefConstraints(),i||(i=Rp(t,l.current,()=>this.scalePositionWithinConstraints())))},{projection:r}=this.visualElement,o=r.addEventListener("measure",s);r&&!r.layout&&(r.root&&r.root.updateScroll(),r.updateLayout()),te.read(s);const a=Xt(window,"resize",()=>this.scalePositionWithinConstraints()),c=r.addEventListener("didUpdate",(({delta:l,hasLayoutChanged:u})=>{this.isDragging&&u&&(Fe(f=>{const h=this.getAxisMotionValue(f);h&&(this.originPoint[f]+=l[f].translate,h.set(h.get()+l[f].translate))}),this.visualElement.render())}));return()=>{a(),n(),o(),c&&c(),i&&i()}}getProps(){const t=this.visualElement.getProps(),{drag:n=!1,dragDirectionLock:i=!1,dragPropagation:s=!1,dragConstraints:r=!1,dragElastic:o=rs,dragMomentum:a=!0}=t;return{...t,drag:n,dragDirectionLock:i,dragPropagation:s,dragConstraints:r,dragElastic:o,dragMomentum:a}}}function br(e){let t=!0;return()=>{if(t){t=!1;return}e()}}function Rp(e,t,n){const i=Ao(e,br(n)),s=Ao(t,br(n));return()=>{i(),s()}}function un(e,t,n){return(t===!0||t===e)&&(n===null||n===e)}function jp(e,t=10){let n=null;return Math.abs(e.y)>t?n="y":Math.abs(e.x)>t&&(n="x"),n}class Lp extends it{constructor(t){super(t),this.removeGroupControls=Le,this.removeListeners=Le,this.controls=new Op(t)}mount(){const{dragControls:t}=this.node.getProps();t&&(this.removeGroupControls=t.subscribe(this.controls)),this.removeListeners=this.controls.addListeners()||Le}update(){const{dragControls:t}=this.node.getProps(),{dragControls:n}=this.node.prevProps||{};t!==n&&(this.removeGroupControls(),t&&(this.removeGroupControls=t.subscribe(this.controls)))}unmount(){this.removeGroupControls(),this.removeListeners(),this.controls.isDragging||this.controls.endPanSession()}}const pi=e=>(t,n)=>{e&&te.update(()=>e(t,n),!1,!0)};class Np extends it{constructor(){super(...arguments),this.removePointerDownListener=Le}onPointerDown(t){this.session=new Il(t,this.createPanHandlers(),{transformPagePoint:this.node.getTransformPagePoint(),contextWindow:Nl(this.node)})}createPanHandlers(){const{onPanSessionStart:t,onPanStart:n,onPan:i,onPanEnd:s}=this.node.getProps();return{onSessionStart:pi(t),onStart:pi(n),onMove:pi(i),onEnd:(r,o)=>{delete this.session,s&&te.postRender(()=>s(r,o))}}}mount(){this.removePointerDownListener=Wt(this.node.current,"pointerdown",t=>this.onPointerDown(t))}update(){this.session&&this.session.updateHandlers(this.createPanHandlers())}unmount(){this.removePointerDownListener(),this.session&&this.session.end()}}let mi=!1;class Ip extends b.Component{componentDidMount(){const{visualElement:t,layoutGroup:n,switchLayoutGroup:i,layoutId:s}=this.props,{projection:r}=t;r&&(n.group&&n.group.add(r),i&&i.register&&s&&i.register(r),mi&&r.root.didUpdate(),r.addEventListener("animationComplete",()=>{this.safeToRemove()}),r.setOptions({...r.options,layoutDependency:this.props.layoutDependency,onExitComplete:()=>this.safeToRemove()})),En.hasEverUpdated=!0}getSnapshotBeforeUpdate(t){const{layoutDependency:n,visualElement:i,drag:s,isPresent:r}=this.props,{projection:o}=i;return o&&(o.isPresent=r,t.layoutDependency!==n&&o.setOptions({...o.options,layoutDependency:n}),mi=!0,s||t.layoutDependency!==n||n===void 0||t.isPresent!==r?o.willUpdate():this.safeToRemove(),t.isPresent!==r&&(r?o.promote():o.relegate()||te.postRender(()=>{const a=o.getStack();(!a||!a.members.length)&&this.safeToRemove()}))),null}componentDidUpdate(){const{visualElement:t,layoutAnchor:n}=this.props,{projection:i}=t;i&&(i.options.layoutAnchor=n,i.root.didUpdate(),js.postRender(()=>{!i.currentAnimation&&i.isLead()&&this.safeToRemove()}))}componentWillUnmount(){const{visualElement:t,layoutGroup:n,switchLayoutGroup:i}=this.props,{projection:s}=t;mi=!0,s&&(s.scheduleCheckAfterUnmount(),n&&n.group&&n.group.remove(s),i&&i.deregister&&i.deregister(s))}safeToRemove(){const{safeToRemove:t}=this.props;t&&t()}render(){return null}}function $l(e){const[t,n]=Pl(),i=b.useContext(ps);return d.jsx(Ip,{...e,layoutGroup:i,switchLayoutGroup:b.useContext(jl),isPresent:t,safeToRemove:n})}const Vp={pan:{Feature:Np},drag:{Feature:Lp,ProjectionNode:Al,MeasureLayout:$l}};function xr(e,t,n){const{props:i}=e;e.animationState&&i.whileHover&&e.animationState.setActive("whileHover",n==="Start");const s="onHover"+n,r=i[s];r&&te.postRender(()=>r(t,tn(t)))}class $p extends it{mount(){const{current:t}=this.node;t&&(this.unmount=oh(t,(n,i)=>(xr(this.node,i,"Start"),s=>xr(this.node,s,"End"))))}unmount(){}}class Bp extends it{constructor(){super(...arguments),this.isActive=!1}onFocus(){let t=!1;try{t=this.node.current.matches(":focus-visible")}catch{t=!0}!t||!this.node.animationState||(this.node.animationState.setActive("whileFocus",!0),this.isActive=!0)}onBlur(){!this.isActive||!this.node.animationState||(this.node.animationState.setActive("whileFocus",!1),this.isActive=!1)}mount(){this.unmount=Zt(Xt(this.node.current,"focus",()=>this.onFocus()),Xt(this.node.current,"blur",()=>this.onBlur()))}unmount(){}}function vr(e,t,n){const{props:i}=e;if(e.current instanceof HTMLButtonElement&&e.current.disabled)return;e.animationState&&i.whileTap&&e.animationState.setActive("whileTap",n==="Start");const s="onTap"+(n==="End"?"":n),r=i[s];r&&te.postRender(()=>r(t,tn(t)))}class Fp extends it{mount(){const{current:t}=this.node;if(!t)return;const{globalTapTarget:n,propagate:i}=this.node.props;this.unmount=dh(t,(s,r)=>(vr(this.node,r,"Start"),(o,{success:a})=>vr(this.node,o,a?"End":"Cancel")),{useGlobalTarget:n,stopPropagation:i?.tap===!1})}unmount(){}}const as=new WeakMap,gi=new WeakMap,_p=e=>{const t=as.get(e.target);t&&t(e)},Hp=e=>{e.forEach(_p)};function Wp({root:e,...t}){const n=e||document;gi.has(n)||gi.set(n,{});const i=gi.get(n),s=JSON.stringify(t);return i[s]||(i[s]=new IntersectionObserver(Hp,{root:e,...t})),i[s]}function zp(e,t,n){const i=Wp(t);return as.set(e,n),i.observe(e),()=>{as.delete(e),i.unobserve(e)}}const Up={some:0,all:1};class Gp extends it{constructor(){super(...arguments),this.hasEnteredView=!1,this.isInView=!1}startObserver(){this.stopObserver?.();const{viewport:t={}}=this.node.getProps(),{root:n,margin:i,amount:s="some",once:r}=t,o={root:n?n.current:void 0,rootMargin:i,threshold:typeof s=="number"?s:Up[s]},a=c=>{const{isIntersecting:l}=c;if(this.isInView===l||(this.isInView=l,r&&!l&&this.hasEnteredView))return;l&&(this.hasEnteredView=!0),this.node.animationState&&this.node.animationState.setActive("whileInView",l);const{onViewportEnter:u,onViewportLeave:f}=this.node.getProps(),h=l?u:f;h&&h(c)};this.stopObserver=zp(this.node.current,o,a)}mount(){this.startObserver()}update(){if(typeof IntersectionObserver>"u")return;const{props:t,prevProps:n}=this.node;["amount","margin","root"].some(Kp(t,n))&&this.startObserver()}unmount(){this.stopObserver?.(),this.hasEnteredView=!1,this.isInView=!1}}function Kp({viewport:e={}},{viewport:t={}}={}){return n=>e[n]!==t[n]}const Qp={inView:{Feature:Gp},tap:{Feature:Fp},focus:{Feature:Bp},hover:{Feature:$p}},qp={layout:{ProjectionNode:Al,MeasureLayout:$l}},Yp={...bp,...Qp,...Vp,...qp},Xp=pp(Yp,mp),Zp=Xp,ie={head:{len:18,span:12},secondaryScale:.85,gap:0,stroke:{own:1.4,ownHover:2.6,refFactor:.75},dash:"5 4",kinds:{"own-fwd":io["own-fwd"],"own-bkwd":io["own-bkwd"],association:{color:Qe.association,heads:"both",headDirection:"forward",dashed:!0,secondary:!0,label:"A and B are associated"}}};function Jp(e){return e==="forward"?"M0,0 L10,3.5 L0,7 Z":"M10,0 L0,3.5 L10,7 Z"}function Dn(e,t=1){const{len:n,span:i}=ie.head;return{viewBox:"0 0 10 7",refX:0,refY:3.5,markerWidth:n*t,markerHeight:i*t,markerUnits:"userSpaceOnUse",orient:"auto-start-reverse",d:Jp(e)}}function kr(e){const t=ie.kinds[e].secondary?ie.secondaryScale:1;return ie.head.len*t+ie.gap}function dn(e){throw new Error('Could not dynamically require "'+e+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var yi={exports:{}},Sr;function em(){return Sr||(Sr=1,(function(e,t){(function(n){e.exports=n()})(function(){return(function(){function n(i,s,r){function o(l,u){if(!s[l]){if(!i[l]){var f=typeof dn=="function"&&dn;if(!u&&f)return f(l,!0);if(a)return a(l,!0);var h=new Error("Cannot find module '"+l+"'");throw h.code="MODULE_NOT_FOUND",h}var y=s[l]={exports:{}};i[l][0].call(y.exports,function(p){var g=i[l][1][p];return o(g||p)},y,y.exports,n,i,s,r)}return s[l].exports}for(var a=typeof dn=="function"&&dn,c=0;c<r.length;c++)o(r[c]);return o}return n})()({1:[function(n,i,s){Object.defineProperty(s,"__esModule",{value:!0}),s.default=void 0;function r(h){"@babel/helpers - typeof";return r=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(y){return typeof y}:function(y){return y&&typeof Symbol=="function"&&y.constructor===Symbol&&y!==Symbol.prototype?"symbol":typeof y},r(h)}function o(h,y){if(!(h instanceof y))throw new TypeError("Cannot call a class as a function")}function a(h,y){for(var p=0;p<y.length;p++){var g=y[p];g.enumerable=g.enumerable||!1,g.configurable=!0,"value"in g&&(g.writable=!0),Object.defineProperty(h,l(g.key),g)}}function c(h,y,p){return y&&a(h.prototype,y),Object.defineProperty(h,"prototype",{writable:!1}),h}function l(h){var y=u(h,"string");return r(y)=="symbol"?y:y+""}function u(h,y){if(r(h)!="object"||!h)return h;var p=h[Symbol.toPrimitive];if(p!==void 0){var g=p.call(h,y);if(r(g)!="object")return g;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(h)}s.default=(function(){function h(){var y=this,p=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},g=p.defaultLayoutOptions,m=g===void 0?{}:g,w=p.algorithms,k=w===void 0?["layered","stress","mrtree","radial","force","disco","sporeOverlap","sporeCompaction","rectpacking"]:w,v=p.workerFactory,x=p.workerUrl;if(o(this,h),this.defaultLayoutOptions=m,this.initialized=!1,typeof x>"u"&&typeof v>"u")throw new Error("Cannot construct an ELK without both 'workerUrl' and 'workerFactory'.");var T=v;typeof x<"u"&&typeof v>"u"&&(T=function(P){return new Worker(P)});var D=T(x);if(typeof D.postMessage!="function")throw new TypeError("Created worker does not provide the required 'postMessage' function.");this.worker=new f(D),this.worker.postMessage({cmd:"register",algorithms:k}).then(function(S){return y.initialized=!0}).catch(console.err)}return c(h,[{key:"layout",value:function(p){var g=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},m=g.layoutOptions,w=m===void 0?this.defaultLayoutOptions:m,k=g.logging,v=k===void 0?!1:k,x=g.measureExecutionTime,T=x===void 0?!1:x;return p?this.worker.postMessage({cmd:"layout",graph:p,layoutOptions:w,options:{logging:v,measureExecutionTime:T}}):Promise.reject(new Error("Missing mandatory parameter 'graph'."))}},{key:"knownLayoutAlgorithms",value:function(){return this.worker.postMessage({cmd:"algorithms"})}},{key:"knownLayoutOptions",value:function(){return this.worker.postMessage({cmd:"options"})}},{key:"knownLayoutCategories",value:function(){return this.worker.postMessage({cmd:"categories"})}},{key:"terminateWorker",value:function(){this.worker&&this.worker.terminate()}}])})();var f=(function(){function h(y){var p=this;if(o(this,h),y===void 0)throw new Error("Missing mandatory parameter 'worker'.");this.resolvers={},this.worker=y,this.worker.onmessage=function(g){setTimeout(function(){p.receive(p,g)},0)}}return c(h,[{key:"postMessage",value:function(p){var g=this.id||0;this.id=g+1,p.id=g;var m=this;return new Promise(function(w,k){m.resolvers[g]=function(v,x){v?(m.convertGwtStyleError(v),k(v)):w(x)},m.worker.postMessage(p)})}},{key:"receive",value:function(p,g){var m=g.data,w=p.resolvers[m.id];w&&(delete p.resolvers[m.id],m.error?w(m.error):w(null,m.data))}},{key:"terminate",value:function(){this.worker&&this.worker.terminate()}},{key:"convertGwtStyleError",value:function(p){if(p){var g=p.__java$exception;g&&(g.cause&&g.cause.backingJsObject&&(p.cause=g.cause.backingJsObject,this.convertGwtStyleError(p.cause)),delete p.__java$exception)}}}])})()},{}],2:[function(n,i,s){var r=n("./elk-api.js").default;Object.defineProperty(i.exports,"__esModule",{value:!0}),i.exports=r,r.default=r},{"./elk-api.js":1}]},{},[2])(2)})})(yi)),yi.exports}var tm=em();const nm=Ec(tm),im="/dynamic-model-var-docs/assets/elk-worker.min-r_yRvuMO.js";class sm{elk=null;ensure(){return this.elk||(this.elk=new nm({workerUrl:im})),this.elk}async layout(t,n={}){const{direction:i="DOWN",nodeSpacing:s=32,layerSpacing:r=56,usePartitions:o=!1,extraLayoutOptions:a={}}=n,c={id:"root",layoutOptions:{"elk.algorithm":"layered","elk.direction":i,"elk.spacing.nodeNode":String(s),"elk.layered.spacing.nodeNodeBetweenLayers":String(r),"elk.edgeRouting":"ORTHOGONAL","elk.layered.considerModelOrder.strategy":"NODES_AND_EDGES",...o?{"elk.partitioning.activate":"true"}:{},...a},children:t.nodes.map(m=>({id:m.id,width:m.width,height:m.height,...m.ports?.length?{ports:m.ports.map(w=>({id:w.id,x:w.x,y:w.y,width:0,height:0}))}:{},...o&&m.partition!==void 0||m.ports?.length?{layoutOptions:{...o&&m.partition!==void 0?{"elk.partitioning.partition":String(m.partition)}:{},...m.ports?.length?{"elk.portConstraints":"FIXED_POS"}:{}}}:{}})),edges:t.edges.filter(m=>m.source!==m.target).map(m=>({id:m.id,sources:[m.sourcePort??m.source],targets:[m.targetPort??m.target]}))},l=new Map(t.edges.map(m=>[m.id,m]));this.elk;const u=performance.now(),f=await this.ensure().layout(c);performance.now()-u,t.nodes.length,t.edges.length;const h=(f.children??[]).map(m=>({id:m.id,x:m.x??0,y:m.y??0,width:m.width??0,height:m.height??0})),y=(f.edges??[]).map(m=>{const w=l.get(m.id);if(!w)throw new Error(`ELK returned unknown edge id: ${m.id}`);return{id:m.id,source:w.source,target:w.target,sections:m.sections}}),p=Math.max(0,...h.map(m=>m.x+m.width)),g=Math.max(0,...h.map(m=>m.y+m.height));return{nodes:h,edges:y,width:p,height:g}}cancel(){this.elk&&(this.elk.terminateWorker(),this.elk=null)}dispose(){this.cancel()}}function hn(e){if(!e?.length)return[];const t=e[0];return[t.startPoint,...t.bendPoints??[],t.endPoint]}function Tr(e,t,n){const i=t.x-e.x,s=t.y-e.y,r=Math.hypot(i,s);if(r<1e-6)return{...e};const o=Math.min(n,r/2)/r;return{x:e.x+i*o,y:e.y+s*o}}function om(e,t){if(e.length<2)return rm(e);let n=`M${e[0].x},${e[0].y}`;for(let s=1;s<e.length-1;s++){const r=Tr(e[s],e[s-1],t),o=Tr(e[s],e[s+1],t);n+=`L${r.x},${r.y}Q${e[s].x},${e[s].y} ${o.x},${o.y}`}const i=e[e.length-1];return`${n}L${i.x},${i.y}`}function rm(e){return e.length?e.map((t,n)=>`${n===0?"M":"L"}${t.x},${t.y}`).join(""):""}function am(e,t){let n=0,i=e.length-1,s=e[e.length-1];for(let r=e.length-1;r>0;r--){const o=Math.hypot(e[r].x-e[r-1].x,e[r].y-e[r-1].y);if(n+o>=t){const a=(t-n)/o;s={x:e[r].x+(e[r-1].x-e[r].x)*a,y:e[r].y+(e[r-1].y-e[r].y)*a},i=r-1;break}n+=o,i=r-1}return{cut:i,cutPoint:s}}function lm(e,t,n,i){if(e.length<2||n<=0)return i(e);const{cut:s,cutPoint:r}=am(e,n),o=e.slice(0,s+1),a=o[o.length-1],c=a&&Math.abs(a.x-r.x)<1e-6&&Math.abs(a.y-r.y)<1e-6;return i([...o,...c?[]:[r],t])}function cm(e,t=1.5){if(e.length<3)return e;const n=[e[0]];for(let i=1;i<e.length-1;i++){const s=n[n.length-1],r=e[i],o=e[i+1],a=o.x-s.x,c=o.y-s.y,l=Math.hypot(a,c);(l<1e-6?Math.hypot(r.x-s.x,r.y-s.y):Math.abs(c*r.x-a*r.y+o.x*s.y-o.y*s.x)/l)>t&&n.push(r)}return n.push(e[e.length-1]),n}function um(e,t,n,i){const s=Math.hypot(t.x,t.y)||1,r=t.x/s,o=t.y/s,a=-o,c=r,l=n/2,u={x:e.x+a*l,y:e.y+c*l},f={x:e.x-a*l,y:e.y-c*l},h={x:e.x+r*i,y:e.y+o*i};return`M${u.x},${u.y}L${h.x},${h.y}L${f.x},${f.y}Z`}function dm(e,t,n,i,s=16){const r={x:e.x+n.x*s,y:e.y+n.y*s},o={x:t.x+i.x*s,y:t.y+i.y*s},a=[e,r];if(Math.abs(n.x)>.5){const c=(r.x+o.x)/2;Math.abs(r.y-o.y)>.5&&a.push({x:c,y:r.y},{x:c,y:o.y})}else{const c=(r.y+o.y)/2;Math.abs(r.x-o.x)>.5&&a.push({x:r.x,y:c},{x:o.x,y:c})}return a.push(o,t),cm(a)}function hm(e,t={}){const n=b.useRef(null);n.current||(n.current=new sm);const[i,s]=b.useState(null),[r,o]=b.useState(!1),a=JSON.stringify(t);b.useEffect(()=>{const u=n.current;if(!e||e.nodes.length===0){s(null),o(!1);return}let f=!1;return o(!0),u.layout(e,JSON.parse(a)).then(h=>{f||(s({spec:e,layout:h}),o(!1))},h=>{f||(o(!1),console.error("graph-core layout failed:",h))}),()=>{f=!0,u.cancel()}},[e,a]),b.useEffect(()=>()=>n.current?.dispose(),[]);const c=!!e&&e.nodes.length>0,l=!i||i.spec!==e;return{latest:i,inProgress:(r||l)&&c}}const fm=300,pm=100,mm=200,gm=75,ym=250,wm=120,bm=200,xm=[.65,0,.35,1],fn=e=>e/1e3,vm=()=>typeof window<"u"&&typeof window.matchMedia=="function"&&window.matchMedia("(prefers-reduced-motion: reduce)").matches,nn=e=>()=>vm()?0:e,Bl=nn(fm),Cr=nn(pm),km=nn(mm),Sm=nn(gm),Tm=nn(ym),pn=()=>wm,Ar=.5;function Cm(e={}){const{min:t=.2,max:n=2}=e,i=b.useRef(null),s=b.useRef(null),r=b.useRef(null),o=b.useRef(1),a=b.useRef({w:0,h:0}),c=b.useRef(null),l=b.useRef(null),u=b.useRef(!0),f=b.useRef(!0),h=b.useCallback(()=>{const v=i.current;return v?{x:v.clientWidth*Ar,y:v.clientHeight*Ar}:{x:0,y:0}},[]),y=b.useCallback(v=>{const x=s.current;if(x){const{x:T,y:D}=h();x.style.transition=v?`width ${v}ms, height ${v}ms`:"",x.style.padding=`${D}px ${T}px`,x.style.width=`${a.current.w*o.current+2*T}px`,x.style.height=`${a.current.h*o.current+2*D}px`}},[h]),p=b.useCallback((v,x)=>{o.current=Math.min(n,Math.max(t,v));const T=x?Bl():0;c.current&&cancelAnimationFrame(c.current),c.current=requestAnimationFrame(()=>{c.current=null;const D=r.current;D&&(D.style.transition=T?`transform ${T}ms`:"",D.style.transform=`scale(${o.current})`)}),l.current&&(clearTimeout(l.current),l.current=null),T?y(T):l.current=setTimeout(()=>{l.current=null,y(0)},100)},[t,n,y]),g=b.useCallback((v,x=!0)=>{u.current=!1,p(v,x)},[p]),m=b.useCallback(v=>g(o.current*v),[g]),w=b.useCallback((v,x)=>{a.current={w:v,h:x};const T=r.current;T&&(T.style.width=`${v}px`,T.style.height=`${x}px`,T.style.transformOrigin="0 0",T.style.transform=`scale(${o.current})`),y(0)},[y]),k=b.useCallback(()=>{const v=i.current,{w:x,h:T}=a.current;if(!v||!x||!T)return;u.current=!0;const D=!f.current;f.current=!1,p(Math.min(v.clientWidth/x,v.clientHeight/T,1),D),requestAnimationFrame(()=>{const{x:S,y:P}=h();typeof v.scrollTo=="function"?v.scrollTo({left:S,top:P,behavior:D?"smooth":"auto"}):(v.scrollLeft=S,v.scrollTop=P)})},[p,h]);return b.useEffect(()=>{const v=i.current;if(!v)return;const x=T=>{!T.ctrlKey&&!T.metaKey||(T.preventDefault(),g(o.current*(1-T.deltaY*.005),!1))};return v.addEventListener("wheel",x,{passive:!1}),()=>v.removeEventListener("wheel",x)},[g]),b.useEffect(()=>{const v=i.current;if(!v)return;let x=!1,T=0,D=0,S=0,P=0,E=!1;const N=F=>F instanceof Element&&!F.closest("[data-pan-ignore]"),V=F=>{F.button!==0||!N(F.target)||(x=!0,E=!1,T=F.clientX,D=F.clientY,S=v.scrollLeft,P=v.scrollTop,v.style.cursor="grabbing")},$=F=>{if(!x)return;const C=F.clientX-T,U=F.clientY-D;!E&&Math.hypot(C,U)<3||(E||(E=!0,v.setPointerCapture(F.pointerId)),F.preventDefault(),v.scrollLeft=S-C,v.scrollTop=P-U)},O=F=>{x&&(x=!1,v.style.cursor="",v.hasPointerCapture(F.pointerId)&&v.releasePointerCapture(F.pointerId))};return v.addEventListener("pointerdown",V),v.addEventListener("pointermove",$),v.addEventListener("pointerup",O),v.addEventListener("pointercancel",O),()=>{v.removeEventListener("pointerdown",V),v.removeEventListener("pointermove",$),v.removeEventListener("pointerup",O),v.removeEventListener("pointercancel",O)}},[]),{containerRef:i,spacerRef:s,wrapperRef:r,applyZoom:g,zoomBy:m,zoomToFit:k,getZoom:()=>o.current,isAutoFit:()=>u.current,setContentSize:w}}const Am=2,Pm=.5;function Et({kind:e,width:t=44,flip:n,className:i}){const s=b.useId().replace(/:/g,""),r=ie.kinds[e],o=Pm*(r.secondary?ie.secondaryScale:1),{d:a,...c}=Dn(r.headDirection,o),l=c.markerWidth,u=`es-${s}`,f=r.heads==="both"?1+l:1,h=t-1-l;return d.jsxs("svg",{width:t,height:"14",viewBox:`0 0 ${t} 14`,className:`shrink-0 ${i??""}`,"aria-hidden":!0,style:n?{transform:"scaleX(-1)"}:void 0,children:[d.jsx("defs",{children:d.jsx("marker",{id:u,...c,children:d.jsx("path",{d:a,fill:r.color})})}),d.jsx("line",{x1:f,y1:"7",x2:h,y2:"7",stroke:r.color,strokeWidth:Am,strokeDasharray:r.dashed?ie.dash:void 0,markerStart:r.heads==="both"?`url(#${u})`:void 0,markerEnd:`url(#${u})`})]})}const Fl={"owned-mine":{side:"left",kind:"own-bkwd"},"owned-theirs":{side:"left",kind:"own-fwd"},"owns-mine":{side:"right",kind:"own-fwd"},"owns-theirs":{side:"right",kind:"own-bkwd"},association:{side:"left",kind:"association"}},Em=300,ls=new Set;let zt;function Ws(){zt!==void 0&&(clearTimeout(zt),zt=void 0)}function $t(e){Ws();for(const t of ls)t(e)}function _l(){Ws(),zt=setTimeout(()=>{zt=void 0,$t(null)},Em)}function Dm({label:e,rows:t,onAdd:n,onRemove:i,onInspect:s,colorOf:r,slotOrder:o,parentOf:a}){const[c,l]=b.useState(null),[u,f]=b.useState(null),h=b.useRef(null),y=b.useRef(null),p=b.useId();b.useEffect(()=>{const T=D=>{D!==p&&(l(null),f(null))};return ls.add(T),()=>{ls.delete(T)}},[p]),b.useEffect(()=>{if(!c)return;const T=S=>{S.target?.closest("[data-relation-bar]")||$t(null)},D=S=>{S.key==="Escape"&&$t(null)};return document.addEventListener("mousedown",T,!0),document.addEventListener("keydown",D),()=>{document.removeEventListener("mousedown",T,!0),document.removeEventListener("keydown",D)}},[c]);const g=T=>t.filter(D=>Fl[D.position].side===T),m=T=>new Set(g(T).map(D=>D.other)).size,w=m("left"),k=m("right");if(w===0&&k===0)return null;const v=(T,D)=>{const S=D?.getBoundingClientRect();S&&($t(p),l(T),f({x:S.left,y:S.bottom+2}))},x=(T,D,S)=>{const P=c===T;return d.jsx("button",{ref:S,"data-relation-bar":!0,"data-no-drag":!0,disabled:D===0,"aria-label":T==="left"?`${D} classes ${e} belongs to`:`${D} classes ${e} owns`,onMouseEnter:()=>D>0&&v(T,S.current),onMouseLeave:_l,onClick:E=>{E.stopPropagation(),D!==0&&(P?$t(null):v(T,S.current))},className:`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] leading-none
                    tabular-nums transition-colors
                    ${D===0?"text-gray-300 dark:text-slate-600 cursor-default":P?"bg-sky-200 dark:bg-sky-800 text-sky-900 dark:text-sky-100":"text-sky-800 dark:text-sky-200 hover:bg-sky-100 dark:hover:bg-sky-900"}`,children:T==="left"?d.jsxs(d.Fragment,{children:[d.jsx("span",{"aria-hidden":!0,children:"←"}),D]}):d.jsxs(d.Fragment,{children:[D,d.jsx("span",{"aria-hidden":!0,children:"→"})]})})};return d.jsxs(d.Fragment,{children:[x("left",w,h),d.jsx("span",{className:`flex-1 min-w-0 text-center text-[9px] text-gray-400
                       dark:text-slate-500 truncate select-none`,children:"related"}),x("right",k,y),c&&u&&qr.createPortal(d.jsx(Om,{anchor:u,side:c,label:e,rows:g(c),onAdd:n,onRemove:i,onInspect:s,colorOf:r,slotOrder:o,parentOf:a}),document.body)]})}function Mm(e){const t=b.useRef(null),[n,i]=b.useState(e);return b.useEffect(()=>{const s=t.current;if(!s)return;const r=s.getBoundingClientRect(),o=8;i({x:Math.max(o,Math.min(e.x,window.innerWidth-r.width-o)),y:Math.max(o,Math.min(e.y,window.innerHeight-r.height-o))})},[e]),{ref:t,pos:n}}function Om({anchor:e,side:t,label:n,rows:i,onAdd:s,onRemove:r,onInspect:o,colorOf:a,slotOrder:c,parentOf:l}){const{ref:u,pos:f}=Mm(e),h=x=>{const T=c?.indexOf(x.slot)??-1;return T===-1?Number.MAX_SAFE_INTEGER:T},y=[...i].sort((x,T)=>h(x)-h(T)||x.other.localeCompare(T.other)||x.slot.localeCompare(T.slot)),p=new Map,g=new Set;if(l){const x=new Map(y.map(T=>[`${T.slot}|${T.other}`,T]));for(const T of y){const D=l(T.other),S=D===void 0?void 0:x.get(`${T.slot}|${D}`);if(!S||S===T)continue;g.add(T);const P=`${T.slot}|${D}`;p.set(P,[...p.get(P)??[],T])}}const m=[],w=(x,T)=>{m.push({row:x,depth:T});for(const D of p.get(`${x.slot}|${x.other}`)??[])w(D,T+1)};for(const x of y)g.has(x)||w(x,0);const k=y.every(x=>x.drawn),v=[...new Set(y.map(x=>x.other))];return d.jsxs("div",{ref:u,"data-relation-bar":!0,onMouseEnter:Ws,onMouseLeave:_l,style:{left:f.x,top:f.y},className:`fixed z-50 w-max max-w-[min(46rem,calc(100vw-2rem))] max-h-[60vh]
                 overflow-y-auto overflow-x-hidden py-1
                 rounded-md border border-gray-300 dark:border-slate-600
                 bg-white dark:bg-slate-800 shadow-xl
                 text-gray-900 dark:text-gray-100`,children:[d.jsx("div",{className:"px-3 py-1 border-b border-gray-200 dark:border-slate-700",children:d.jsxs("div",{className:"text-[11px] font-semibold",children:[d.jsx("b",{children:n})," ",t==="left"?"belongs to":"owns"," ",v.length," ",v.length===1?"entity":"distinct entities",y.length!==v.length&&d.jsxs("span",{className:"font-normal text-gray-500 dark:text-slate-400",children:[" ","through ",y.length," attributes"]})]})}),d.jsx("button",{onClick:()=>v.forEach(x=>k?r(x):s(x)),className:`block w-full text-left px-3 py-1 text-[11px]
                   text-blue-600 dark:text-blue-400
                   hover:bg-gray-100 dark:hover:bg-slate-700`,children:k?`hide all ${v.length} entities`:`add all ${v.length} entities`}),d.jsx("table",{className:"w-full text-[11px]",children:d.jsx("tbody",{children:m.map(({row:x,depth:T})=>{const D=Fl[x.position].kind,S=T>0&&d.jsx("span",{"aria-hidden":!0,className:"text-gray-400 dark:text-slate-500 select-none",style:{paddingLeft:`${(T-1)*.75}rem`},children:"↳ "}),P=x.declaredBy===x.other?n:x.declaredBy,E=t==="left"?x.other:P,N=t==="left"?P:x.other;return d.jsxs("tr",{"data-family-depth":T,className:"hover:bg-gray-100 dark:hover:bg-slate-700",children:[d.jsx("td",{className:"pl-2 pr-1 py-0.5",children:d.jsx("button",{onClick:V=>{V.stopPropagation(),(x.drawn?r:s)(x.other)},"aria-label":x.drawn?`Remove ${x.other} from the diagram`:`Add ${x.other} to the diagram`,className:`w-4 h-4 rounded-sm leading-none text-[11px]
                                flex items-center justify-center border
                                ${x.drawn?"border-sky-300 bg-sky-50 text-sky-700 hover:bg-sky-200 dark:border-sky-700 dark:bg-sky-950 dark:text-sky-300":"border-gray-300 text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:border-slate-600 dark:hover:bg-slate-600"}`,children:x.drawn?"−":"+"})}),d.jsxs("td",{className:"pl-1 pr-2 py-0.5 text-right whitespace-nowrap",children:[t==="left"&&S,d.jsx(Pr,{cls:E,row:x,colorOf:a,onInspect:o})]}),d.jsx("td",{className:`px-2 py-0.5 font-mono text-gray-400 dark:text-slate-500
                               whitespace-nowrap tabular-nums text-right`,children:x.cardinality}),d.jsx("td",{className:"px-1 py-0.5 align-middle",children:d.jsx(Et,{kind:D,width:30})}),d.jsxs("td",{className:"pr-3 py-0.5 whitespace-nowrap",children:[t==="right"&&S,d.jsx(Pr,{cls:N,row:x,colorOf:a,onInspect:o})]})]},`${x.declaredBy}.${x.slot}->${x.other}`)})})})]})}function Pr({cls:e,row:t,colorOf:n,onInspect:i}){const s=n?.(e),r=e===t.declaredBy,o=s?{color:s.text}:void 0;return d.jsxs("span",{className:"font-mono",children:[i?d.jsx("button",{onClick:a=>{a.stopPropagation(),i(e)},title:`Open ${e}'s details`,className:"hover:underline",style:o,children:e}):d.jsx("span",{style:o,children:e}),r&&d.jsxs("span",{className:s?"opacity-80":"text-gray-500 dark:text-slate-400",style:o,children:[".",t.slot]})]})}const De={sibs:!0,dir:"RIGHT",merge:"near",legend:!1,cases:!1},Hl=["legend","cases"];function Rm(e,t){if(e.get("panels")!=="0")return t;for(const n of Hl)t[n]=!1;return t.detail=null,t}const Bt={dir:"explore-nl-dir",merge:"explore-nl-merge",sibs:"explore-nl-sibs"},qn="~",jm=["exp","hidden","owners"],Lm=["tour"];let Ut;function Nm(e=window.location.search){return Ut===void 0&&(Ut=new URLSearchParams(e).get("tour")==="1"),Ut}function Im(e,t){const n=e.get(t);return n?n.split(qn).filter(Boolean):[]}function Wl(e){const t=e.get("cat");if(!t)return[];const n=t.split(new RegExp(`[,${qn}]`)).filter(Boolean);return[...new Set(n.flatMap(i=>{const s=Yr.find(r=>r.id===i);return s?ea(s):[]}))]}function mn(e){try{return localStorage.getItem(e)}catch{return null}}function Vm(e,t){try{localStorage.setItem(e,t)}catch{}}function gn(e,t){return e&&t.includes(e)?e:null}function We(e=window.location.search){const t=new URLSearchParams(e),n=gn(t.get("dir"),["RIGHT","DOWN"])??gn(mn(Bt.dir),["RIGHT","DOWN"])??De.dir,i=gn(t.get("merge"),["near","far","bend","off"])??gn(mn(Bt.merge),["near","far","bend","off"])??De.merge,s=t.has("sibs")?t.get("sibs")==="1":mn(Bt.sibs)!==null?mn(Bt.sibs)!=="0":De.sibs,r=Im(t,"sel"),o=Rm(t,{legend:t.get("legend")==="1",cases:t.get("cases")==="1",detail:t.get("detail")||null});return t.has("legend")&&(o.legend=t.get("legend")==="1"),t.has("cases")&&(o.cases=t.get("cases")==="1"),t.has("detail")&&(o.detail=t.get("detail")||null),{sel:r.length?r:Wl(t),detail:o.detail,roots:t.get("roots")==="1",sibs:s,dir:n,merge:i,legend:o.legend,cases:o.cases}}function zl(e,{push:t=!1}={}){const n=new URL(window.location.href),i=n.searchParams,s=(o,a)=>{a.length===0?i.delete(o):i.set(o,[...a].sort().join(qn))},r=(o,a,c)=>{c?i.delete(o):i.set(o,a)};for(const o of jm)i.delete(o);Ut===void 0&&i.has("tour")&&(Ut=i.get("tour")==="1");for(const o of Lm)i.delete(o);s("sel",e.sel),e.detail?i.set("detail",e.detail):i.delete("detail"),r("roots","1",!e.roots),r("sibs",e.sibs?"1":"0",e.sibs===De.sibs),r("dir",e.dir,e.dir===De.dir),r("merge",e.merge,e.merge===De.merge),r("legend","1",e.legend===De.legend),r("cases","1",e.cases===De.cases),i.delete("panels"),i.delete("cat"),t?window.history.pushState(null,"",n):window.history.replaceState(null,"",n)}function Er(e,t){Vm(Bt[e],typeof t=="boolean"?t?"1":"0":String(t))}function $m(e,t=window.location.href){const n=new URL(t),i=new URLSearchParams,s=(r,o)=>i.set(r,o);return e.sel.length&&s("sel",[...e.sel].sort().join(qn)),e.detail&&s("detail",e.detail),e.roots&&s("roots","1"),e.sibs!==De.sibs&&s("sibs",e.sibs?"1":"0"),e.dir!==De.dir&&s("dir",e.dir),e.merge!==De.merge&&s("merge",e.merge),e.legend!==De.legend&&s("legend","1"),e.cases!==De.cases&&s("cases","1"),n.search=i.toString(),n.toString()}const Ce=240,pt=30,Bm=.6,mt=20,Fm=1/0,zs=22,Ul=18,xt=28;function Gl(e,t,n=()=>!1){const i=new Map;for(const s of e){if(n(s.other))continue;const r=s.position,o=i.get(r)??new Map,a=o.get(s.other)??[];a.includes(s.slot)||a.push(s.slot),o.set(s.other,a),i.set(r,o)}return jc.filter(s=>i.has(s)).map(s=>{const r=[...i.get(s)].map(([o,a])=>({other:o,slots:a,drawn:t(o)})).sort((o,a)=>o.other.localeCompare(a.other));return{position:s,label:Lc(s,r.length),items:r}})}function Kl(e,t,n=()=>!1,i){const s=new Set,r=[];for(const a of e){if(n(a.other))continue;const c=`${a.declaredBy}.${a.slot}->${a.other}:${a.position}`;s.has(c)||(s.add(c),r.push({other:a.other,position:a.position,slot:a.slot,declaredBy:a.declaredBy,cardinality:a.cardinality,drawn:t(a.other)}))}if(!i)return r;const o=new Set(r.map(a=>`${a.declaredBy}.${a.slot}->${a.other}:${a.position}`));return r.filter(a=>{const c=new Set([a.declaredBy]);for(let l=i(a.declaredBy);l&&!c.has(l);l=i(l)){if(o.has(`${l}.${a.slot}->${a.other}:${a.position}`))return!1;c.add(l)}return!0})}function ue(e){return e.storageDirection==="flipped"?e.target:e.source}function cs(e){return e.anchorClass??ue(e)}function _m(e,t,n,i,s){const r=new Map,o=new Map,a=[],c=new Set;for(const h of e.edges)h.type==="isa"?(r.set(h.target,[...r.get(h.target)??[],h.source]),o.set(h.source,(o.get(h.source)??0)+1)):h.isLoop||(a.push(h),c.add(`${ue(h)}|${h.slotName}`));const l=new Set(e.nodes.map(h=>h.id)),u=e.nodes.map(h=>{const y=new Map(n(h.id).map((O,F)=>[O.name,F])),p=(O,F)=>(y.get(O.slot)??Number.MAX_SAFE_INTEGER)-(y.get(F.slot)??Number.MAX_SAFE_INTEGER),g=h.slots.map(O=>({...O,connected:O.isLoop||c.has(`${h.id}|${O.slot}`),rangeColor:i(O.range),targetColor:s(O.range)})).sort(p),m=new Set(g.map(O=>O.slot)),w=n(h.id).filter(O=>!m.has(O.name)).map(O=>({slot:O.name,range:O.range,channel:"plain",flipped:!1,cardinality:Xr(O.required,O.multivalued),isLoop:!1,connected:!1,rangeColor:i(O.range)})),k=g.filter(O=>O.connected),v=[...g.filter(O=>!O.connected),...w].sort(p),x=[...k,...v].slice(0,Math.max(Fm,k.length)),T=x.length===k.length+v.length,D=t.has(h.id)||T,S=D?[...k,...v]:x,P=T?0:k.length+v.length-x.length,E=e.hiddenOwners.get(h.id)??[],N=e.hiddenOwned.get(h.id)??[],V=Gl(h.relations,O=>l.has(O),O=>O===h.id),$=Kl(h.relations,O=>l.has(O),O=>O===h.id);return{...h,isaParents:r.get(h.id)??[],subclassCount:o.get(h.id)??0,members:[],hiddenOwners:E,hiddenOwned:N,relationGroups:V,relationRows:$,...Ql(V),rows:S,allRows:[...k,...v],hiddenCount:P,expanded:D,height:ql(S.length,P,V.length>0)}}),f=new Map;for(const h of a){const y=ue(h)===h.source?h.target:h.source,p=s(y);p&&f.set(h.id,p)}return{nodes:u,edges:a,edgeColors:f}}function Ql(e){const t=new Map;for(const n of e)for(const i of n.items)t.set(i.other,(t.get(i.other)??!1)||i.drawn);return{relatedCount:t.size,shownCount:[...t.values()].filter(Boolean).length}}function ql(e,t,n){return pt+(n?zs:0)+e*mt+(t?Ul:0)+(e?5:0)}function Hm(e,t,n,i,s,r,o){const a=Mc(e.nodes.map(w=>w.id),t,n);if(!a.size)return e;const c=new Map(e.nodes.map(w=>[w.id,w])),l=new Set(e.nodes.map(w=>w.id)),u=new Map,f=[],h=new Map;for(const[w,k]of a){const v=Nc(w),x=k.map(j=>({id:j,label:c.get(j)?.label??j,color:Oc(o(j))}));for(const j of x)u.set(j.id,v);const T=c.has(w);T&&u.set(w,v);const D=new Map(x.map(j=>[j.id,j])),S=new Map,P=T?[w,...k]:k;for(const j of P){const X=c.get(j);if(!X)continue;const ae=j===w;for(const se of X.allRows){const Pe=i(j,se.slot),Me=Pe!==void 0&&Pe!==j,me=`${ae||Me?Pe??w:j}|${se.slot}`,xe=S.get(me),Oe=D.get(j),Q=ae||Me?xe?.owners??[]:[...xe?.owners??[],...Oe?[Oe]:[]];S.set(me,{...xe??se,connected:(xe?.connected??!1)||se.connected,owners:Q,declaringClass:me.slice(0,me.indexOf("|"))})}}const E=new Map;for(const j of S.values())if(j.targetColor)for(const X of j.owners??[])E.has(X.id)||E.set(X.id,j.targetColor);for(const j of x){const X=E.get(j.id);X&&(j.color=X)}for(const[j,X]of S)X.targetColor&&h.set(`${v}|${j}`,X.targetColor);const N=[...S.values()],V=j=>{const X=j.owners?.length?j.owners[0].id:w;return r(X,j.slot)};N.sort((j,X)=>V(j)-V(X));const $=Rc(N,x,j=>({slot:`::hdr:${j.id}`,range:"",channel:"plain",flipped:!1,cardinality:"",isLoop:!1,connected:!1,rangeColor:"",header:j})),O=j=>!u.has(j)&&!P.includes(j),F=[...new Set(P.flatMap(j=>c.get(j)?.hiddenOwners??[]))].filter(O),C=[...new Set(P.flatMap(j=>c.get(j)?.hiddenOwned??[]))].filter(O),U=Gl(P.flatMap(j=>c.get(j)?.relations??[]),j=>l.has(j),j=>!O(j)),pe=Kl(P.flatMap(j=>c.get(j)?.relations??[]),j=>l.has(j),j=>!O(j),t),L=c.get(k[0]),G=s(w);f.push({...L,id:v,label:w,description:G.description,abstract:G.abstract,slots:[],members:x,role:P.some(j=>c.get(j)?.role==="selected")?"selected":"context",layer:Math.min(...P.map(j=>c.get(j)?.layer??0)),isaParents:[],subclassCount:x.length,hiddenOwners:F,hiddenOwned:C,relationGroups:U,relationRows:pe,...Ql(U),rows:$,allRows:N,hiddenCount:0,expanded:!0,height:ql($.length,0,U.length>0)})}const y=[...e.nodes.filter(w=>!u.has(w.id)),...f],p=new Set,g=e.edges.map(w=>({...w,source:u.get(w.source)??w.source,target:u.get(w.target)??w.target,entityMember:(()=>{if(w.inducedFrom!==void 0)return;const k=ue(w)===w.source?w.target:w.source;return u.has(k)?k:void 0})(),anchorClass:u.has(ue(w))?i(ue(w),w.slotName)??ue(w):ue(w)})).filter(w=>{if(!Ii(w.source)&&!Ii(w.target))return!0;const k=`${w.source}|${w.target}|${w.anchorClass}|${w.slotName}|${w.storageDirection}`;return p.has(k)?!1:(p.add(k),!0)}).filter(w=>w.source!==w.target),m=new Map(e.edgeColors);for(const w of g){const k=h.get(`${ue(w)}|${cs(w)}|${w.slotName}`);k&&m.set(w.id,k)}return{nodes:y,edges:g,edgeColors:m}}function Wm({title:e}){return d.jsxs("svg",{viewBox:"0 0 16 16",width:"15",height:"15","aria-hidden":"false",className:"shrink-0",style:{color:He.entity},children:[d.jsx("title",{children:e}),d.jsx("path",{d:"M12.33 10.5 A5 5 0 1 1 12.33 5.5",fill:"none",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round"}),d.jsx("path",{d:"M13.7 7.9 L10.6 6.7 L13.7 4.2 Z",fill:"currentColor"})]})}function Yl(e){return pt+(e.relationGroups.length>0?zs:0)}function Xl(e,t,n){const i=e.rows.findIndex(s=>s.slot===t&&!s.header&&(!n||!s.declaringClass||s.declaringClass===n));if(i<0)throw new Error(`No displayed row for ${t} on ${e.id}`);return Yl(e)+i*mt+mt/2}function zm(e,t){const n=e.rows.findIndex(i=>i.header?.id===t);if(!(n<0))return Yl(e)+n*mt+mt/2}function us(e,t){if(e.storageDirection==="flipped"||!t.members.length)return;const n=e.entityMember;return n&&t.members.some(i=>i.id===n)?n:void 0}const Um=4,Gm=10,Km=ie.head.span,Dr=ie.head.len,Qm=ie.gap,qm=ie.secondaryScale,Zl=ie.stroke.own,Jl=ie.stroke.ownHover,Ym=Zl*ie.stroke.refFactor,Xm=Jl*ie.stroke.refFactor;function Mr(e,t){return e?t?Qe.ownBkwd:Qe.ownFwd:Qe.association}function wi(e,t){if(e==="off"||t.length<2)return 0;if(e==="near")return 40;if(e==="far")return 120;const n=t[t.length-1],i=t[t.length-2];return Math.hypot(n.x-i.x,n.y-i.y)}function Or(e,t){return e<2?0:Math.min(Um,t/(e-1))}function Zm(e,t){const n=new Map,i=(l,u,f,h)=>{const y=n.get(l.id)??[];return y.some(p=>p.id===u)||(y.push({id:u,x:f,y:h}),n.set(l.id,y)),u},s=new Map(e.nodes.map(l=>[l.id,l])),r=l=>{const u=s.get(ue(l)===l.source?l.target:l.source);return!!u&&us(l,u)!==void 0},o=new Map;for(const l of e.edges){if(r(l))continue;const u=ue(l)===l.source?l.target:l.source,f=`${u}|${u===l.source?"out":"in"}`;o.set(f,(o.get(f)??0)+1)}const a=new Map,c=e.edges.map(l=>{const u=s.get(ue(l)),f=s.get(ue(l)===l.source?l.target:l.source);if(!u||!f)throw new Error(`Edge ${l.id} endpoint missing from subgraph`);const h=l.storageDirection==="flipped",y=Xl(u,l.slotName,cs(l)),p=i(u,`${u.id}::row:${cs(l)}|${l.slotName}`,h?0:Ce,y),g=f.id===l.source,m=`${f.id}|${g?"out":"in"}`,w=us(l,f),k=w!==void 0?zm(f,w):void 0;let v;if(w!==void 0&&k!==void 0)v=i(f,`${f.id}::mhdr:${g?"out":"in"}:${w}`,t==="RIGHT"?g?Ce:0:Ce/2,t==="RIGHT"?k:g?f.height:0);else{const x=o.get(m)??1,T=a.get(m)??0;a.set(m,T+1);const D=Or(x,pt-4),S=pt/2+(T-(x-1)/2)*D;v=t==="RIGHT"?i(f,`${f.id}::hdr:${g?"out":"in"}:${T}`,g?Ce:0,S):i(f,`${f.id}::hdr:${g?"out":"in"}:${T}`,Ce/2+(T-(x-1)/2)*Or(x,Ce/2),g?f.height:0)}return{id:l.id,source:l.source,target:l.target,sourcePort:h?v:p,targetPort:h?p:v}});return{nodes:e.nodes.map(l=>({id:l.id,width:Ce,height:l.height,partition:l.layer,ports:n.get(l.id)})),edges:c}}function Jm(e,t){if(!e?.length)return e;const n=e[0],i=n.bendPoints?.length?n.bendPoints[n.bendPoints.length-1]:n.startPoint,s=n.endPoint.x-i.x,r=n.endPoint.y-i.y,o=Math.hypot(s,r);if(o<1)return e;const a=Math.min(t,o*.8)/o,c={x:n.endPoint.x-s*a,y:n.endPoint.y-r*a};return[{...n,endPoint:c},...e.slice(1)]}function eg(e,t){if(!e?.length)return e;const n=e[0],i=n.bendPoints?.length?n.bendPoints[0]:n.endPoint,s=i.x-n.startPoint.x,r=i.y-n.startPoint.y,o=Math.hypot(s,r);if(o<1)return e;const a=Math.min(t,o*.8)/o,c={x:n.startPoint.x+s*a,y:n.startPoint.y+r*a};return[{...n,startPoint:c},...e.slice(1)]}function tg({dataService:e,selectedIds:t,onNodeClick:n,onAdd:i,onRemove:s,pathToRoot:r=!1,onTogglePathToRoot:o,direction:a,setDirection:c,mergeMode:l,setMergeMode:u}){const f=b.useId().replace(/[^a-zA-Z0-9]/g,""),h=A=>`${A}-${f}`,[y,p]=b.useState(new Set),g=b.useMemo(()=>e.getOwnershipSubgraph([...t].sort(),{pathToRoot:r}),[e,t,r]),m=b.useCallback(A=>e.getTargetColor(A),[e]),w=b.useMemo(()=>new Map(g.nodes.map(A=>[A.id,e.getClassSummary(A.id)?.slots??[]])),[e,g]),k=b.useMemo(()=>_m(g,y,A=>w.get(A)??[],A=>e.getRangeColor(A),A=>e.getTargetColor(A)),[g,y,w,e]),v=b.useMemo(()=>new Map(g.nodes.map(A=>[A.id,e.getClassSummary(A.id)])),[e,g]),x=b.useMemo(()=>{const A=M=>v.get(M)?.parentId,R=M=>!Ic.has(M),I=(M,_)=>M.range===_.range&&M.multivalued===_.multivalued;return Hm(k,A,R,(M,_)=>{const W=e.getClassSummary(M)?.slots.find(de=>de.name===_);if(!W)return;if(!W.inheritedFrom)return M;const Z=e.getClassSummary(W.inheritedFrom)?.slots.find(de=>de.name===_);return Z&&I(W,Z)?W.inheritedFrom:M},M=>{const _=e.getClassSummary(M);return{description:_?.description??"",abstract:_?.isAbstract??!1}},(M,_)=>{const W=e.getClassSummary(M)?.slots.findIndex(Z=>Z.name===_)??-1;return W<0?Number.MAX_SAFE_INTEGER:W},M=>e.siblingColorIndexOf(M))},[k,v,e]),[T,D]=b.useState(new Map),[S,P]=b.useState(new Map),E=b.useMemo(()=>Zm(x,a),[x,a]),{latest:N,inProgress:V}=hm(E,{direction:a,usePartitions:!0,nodeSpacing:28,layerSpacing:72,extraLayoutOptions:{"elk.spacing.edgeNode":"18","elk.spacing.edgeEdge":"12","elk.layered.spacing.edgeNodeBetweenLayers":"18","elk.layered.spacing.edgeEdgeBetweenLayers":"10"}}),$=N?.spec===E?N.layout:null,O=N?.layout??null,F=Cm(),C=(O?.width??0)+xt*2,U=(O?.height??0)+xt*2;b.useEffect(()=>{$&&(F.setContentSize(C,U),F.isAutoFit()&&F.zoomToFit())},[$,C,U]),b.useEffect(()=>D(new Map),[$]),b.useEffect(()=>P(new Map),[$]);const[pe,L]=b.useState(!1),G=b.useRef(!0);b.useEffect(()=>{if(!$){L(!1),O||(G.current=!0);return}const A=G.current?0:Tm();if(G.current=!1,A===0){L(!0);return}const R=setTimeout(()=>L(!0),A);return()=>clearTimeout(R)},[$,O]);const j=b.useRef(new Map),X=b.useRef(!1),ae=b.useRef(T);ae.current=T;const se=b.useMemo(()=>{const A=new Map((O?.nodes??[]).map(I=>[I.id,I])),R=new Map(S);for(const[I,H]of T)R.set(I,H);for(const[I,{dx:H,dy:K}]of R){const Y=A.get(I);Y&&A.set(I,{...Y,x:Y.x+H,y:Y.y+K})}return j.current=A,A},[O,T,S]),[Pe,Me]=b.useState(!1);b.useEffect(()=>{if(!V){Me(!1);return}const A=setTimeout(()=>Me(!0),bm);return()=>clearTimeout(A)},[V]);const me=b.useCallback((A,R)=>{if(R.button!==0||R.target.closest('button, a, [role="button"], [data-no-drag]'))return;R.stopPropagation();const I=R.clientX,H=R.clientY,K=F.getZoom()||1,Y=T.get(A)??{dx:0,dy:0},M=R.currentTarget;M.setPointerCapture(R.pointerId);let _=!1;const W=de=>{const Ee=(de.clientX-I)/K,Ie=(de.clientY-H)/K;!_&&Math.hypot(Ee,Ie)<3||(_=!0,X.current=!0,D(ot=>new Map(ot).set(A,{dx:Y.dx+Ee,dy:Y.dy+Ie})))},Z=de=>{if(M.releasePointerCapture(de.pointerId),M.removeEventListener("pointermove",W),M.removeEventListener("pointerup",Z),_){const Ee=ae.current.get(A);Ee&&P(Ie=>new Map(Ie).set(A,Ee))}};M.addEventListener("pointermove",W),M.addEventListener("pointerup",Z)},[T]),xe=b.useMemo(()=>new Map(x.nodes.map(A=>[A.id,A.role])),[x]),Oe=b.useMemo(()=>new Map(x.edges.map(A=>[A.id,A])),[x]),Q=b.useMemo(()=>{const A=new Map(x.nodes.map(R=>[R.id,R]));return new Set(x.edges.filter(R=>{const I=A.get(ue(R)===R.source?R.target:R.source);return!!I&&us(R,I)!==void 0}).map(R=>R.id))},[x]),q=b.useMemo(()=>{const A=new Map;if(!$)return A;for(const R of x.edges){const I=ue(R)===R.source?R.target:R.source,H=se.get(I);if(!H||Q.has(R.id))continue;const K=I===R.source,Y=`${I}|${K?"out":"in"}`;if(A.has(Y))continue;const M=K,_=Qm+Dr;A.set(Y,a==="RIGHT"?{base:{x:M?H.x+Ce+_:H.x-_,y:H.y+pt/2},dir:{x:M?-1:1,y:0}}:{base:{x:H.x+Ce/2,y:M?H.y+H.height+_:H.y-_},dir:{x:0,y:M?-1:1}})}return A},[x,se,$,a,Q]),ne=b.useMemo(()=>{const A=new Map,R=new URLSearchParams(window.location.search).has("dbg"),I=new Set([...S.keys(),...T.keys()]);if(!$||I.size===0)return A;R&&console.log(`[drag] moved: ${[...I].join(", ")}`);const H=new Map(x.nodes.map(K=>[K.id,K]));for(const K of x.edges){const Y=ue(K),M=Y===K.source?K.target:K.source;if(!I.has(Y)&&!I.has(M))continue;const _=se.get(Y),W=se.get(M),Z=H.get(Y);if(!_||!W||!Z)continue;const de=K.storageDirection==="flipped",Ee=a==="RIGHT";let Ie;try{Ie=Xl(Z,K.slotName)}catch{R&&console.log(`   SKIP ${Y}.${K.slotName}: row not displayed`);continue}const ot=Ee?{x:_.x+(de?0:Ce),y:_.y+Ie}:{x:_.x+Ce/2,y:_.y+Ie},Xe=Ee?{x:de?-1:1,y:0}:{x:0,y:1},bt=M===K.source,sn=Ee?{x:bt?W.x+Ce:W.x,y:W.y+pt/2}:{x:W.x+Ce/2,y:bt?W.y+W.height:W.y},Jn=Ee?{x:bt?1:-1,y:0}:{x:0,y:bt?1:-1};A.set(K.id,dm(ot,sn,Xe,Jn)),R&&console.log(`   reroute ${Y}.${K.slotName} -> ${M}`)}return R&&console.log(`[drag] rerouted ${A.size} edge(s)`),A},[$,T,S,x,se,a]);b.useEffect(()=>{if(!$||!new URLSearchParams(window.location.search).has("dbg"))return;const A=new Map;for(const R of $.edges){const I=Oe.get(R.id);if(!I)continue;const H=hn(R.sections);if(H.length<2)continue;const K=ue(I)===I.source?I.target:I.source;let Y=0,M=0;for(let W=1;W<H.length;W++){const Z=Math.abs(H[W].x-H[W-1].x),de=Math.abs(H[W].y-H[W-1].y);Z>.5&&de>.5&&M++,W>1&&Y++}const _=ue(I);A.set(K,[...A.get(K)??[],`${_}.${I.slotName}  pts=${H.length} bends=${Y}${M?` DIAGONAL x${M}`:""}  start=(${Math.round(H[0].x)},${Math.round(H[0].y)}) end=(${Math.round(H[H.length-1].x)},${Math.round(H[H.length-1].y)})`])}for(const[R,I]of A){if(I.length<2)continue;console.log(`
=== approaches to ${R} (${I.length}) ===`);const H=se.get(R);H&&console.log(`   box at (${Math.round(H.x)},${Math.round(H.y)}) h=${Math.round(H.height)}`),I.forEach(K=>console.log("   "+K))}},[$,Oe,se]);const re=b.useMemo(()=>{const A=new Map;if(!$)return A;for(const R of $.edges){const I=Oe.get(R.id);if(!I||I.storageDirection==="flipped"||Q.has(R.id)||wi(l,hn(R.sections))<=0)continue;const H=ue(I)===I.source?I.target:I.source,K=`${H}|${H===I.source?"out":"in"}`,Y=q.get(K);if(!Y)continue;const M=I.type==="ownership",_=xe.get(I.source)==="context"||xe.get(I.target)==="context",W=x.edgeColors.get(R.id),Z=A.get(K);A.set(K,Z?{...Z,isOwn:Z.isOwn||M,dimmed:Z.dimmed&&_,edgeIds:[...Z.edgeIds,R.id],...Z.color?.text===W?.text?{}:{color:void 0}}:{...Y,isOwn:M,dimmed:_,edgeIds:[R.id],...W?{color:W}:{}})}return A},[$,Oe,q,l,xe,x,Q]),ve=b.useMemo(()=>new Set(x.nodes.map(A=>A.id)),[x]),Re=b.useCallback(A=>!!i&&A.channel!=="plain"&&!A.isLoop&&!ve.has(A.range),[i,ve]),Ge=b.useRef(null),st=b.useRef(null),yt=b.useRef(void 0),jt=b.useMemo(()=>{const A=new Map,R=new Map;for(const I of x.edges){R.set(I.id,[I.source,I.target]);for(const H of[I.source,I.target])A.set(H,[...A.get(H)??[],I.id])}return{nodeEdges:A,edgeEnds:R}},[x]),wt=b.useRef(jt);wt.current=jt;const z=b.useRef(!1),J=b.useCallback(A=>{z.current&&A||(yt.current=A,st.current===null&&(st.current=requestAnimationFrame(()=>{st.current=null;const R=yt.current;yt.current=void 0;const I=Ge.current,H=F.wrapperRef.current;if(R===void 0||!I||!H)return;let K=null,Y=null;if(R){const{nodeEdges:_,edgeEnds:W}=wt.current;if(R.kind==="node"){K=new Set(_.get(R.id)??[]),Y=new Set([R.id]);for(const Z of K)for(const de of W.get(Z)??[])Y.add(de)}else K=new Set([R.id]),Y=new Set(W.get(R.id)??[])}const M=(_,W,Z)=>{_.style.filter=W===null||W?"":`opacity(${Z})`};I.querySelectorAll("path[data-edge-id]").forEach(_=>{const W=_.dataset.edgeId??"",Z=K?K.has(W):null;M(_,Z,.38),_.style.strokeWidth=Z?String(_.dataset.channel==="association"?Xm:Jl):""}),I.querySelectorAll("path[data-arrowhead]").forEach(_=>{const W=(_.dataset.arrowhead??"").split(" ");M(_,K?W.some(Z=>K.has(Z)):null,.08)}),H.querySelectorAll("[data-node-id]").forEach(_=>{M(_,Y?Y.has(_.dataset.nodeId??""):null,.25)})})))},[]);b.useEffect(()=>{z.current=!0,J(null);const A=()=>{z.current=!1};return window.addEventListener("pointermove",A,{once:!0,passive:!0}),()=>window.removeEventListener("pointermove",A)},[x,$,J]);const ge=A=>p(R=>{const I=new Set(R);return I.has(A)?I.delete(A):I.add(A),I}),le=A=>{Er("dir",A),c(A)},Te=A=>{Er("merge",A),u(A)},qe=e.getConceptLabel("attribute",!0).toLowerCase(),Ye=A=>`px-2 py-0.5 text-xs rounded border ${A?"border-blue-500 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300":"border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700"}`;return d.jsxs("div",{className:"relative w-full h-full",children:[d.jsxs("div",{"data-pan-ignore":!0,className:"absolute top-2 right-2 z-10 flex gap-1 items-center",children:[Pe&&d.jsxs("div",{className:`mr-2 flex items-center gap-2 rounded px-2 py-1
                          text-xs text-gray-500 dark:text-gray-400
                          bg-white/80 dark:bg-slate-900/80 shadow-sm`,children:[d.jsx("span",{className:`inline-block h-3 w-3 animate-spin rounded-full
                             border-2 border-gray-300 border-t-gray-600
                             dark:border-slate-600 dark:border-t-slate-300`}),"Computing layout…"]}),o&&d.jsxs(d.Fragment,{children:[d.jsx("button",{className:Ye(r),title:r?"Hide owners: show only what you selected":"Show every owner up to the root (can pull in most of the schema)",onClick:o,children:"⇱ roots"}),d.jsx("span",{className:"w-px h-4 bg-gray-300 dark:bg-slate-600 mx-1"})]}),d.jsx("button",{className:Ye(a==="RIGHT"),title:"Layout left to right",onClick:()=>le("RIGHT"),children:"LR"}),d.jsx("button",{className:Ye(a==="DOWN"),title:"Layout top down",onClick:()=>le("DOWN"),children:"TB"}),d.jsx("span",{className:"w-px h-4 bg-gray-300 dark:bg-slate-600 mx-1"}),d.jsx("button",{className:Ye(l==="near"),title:"Merge converging edges near the node (~40px)",onClick:()=>Te("near"),children:"⋙"}),d.jsx("button",{className:Ye(l==="far"),title:"Merge converging edges early (~120px)",onClick:()=>Te("far"),children:"⋙⋙"}),d.jsx("button",{className:Ye(l==="bend"),title:"Merge at ELK's last corner",onClick:()=>Te("bend"),children:"⌙"}),d.jsx("button",{className:Ye(l==="off"),title:"No merging — every edge runs to its own port",onClick:()=>Te("off"),children:"≡"}),d.jsx("span",{className:"w-px h-4 bg-gray-300 dark:bg-slate-600 mx-1"}),[["+",()=>F.zoomBy(1.3),"Zoom in"],["−",()=>F.zoomBy(1/1.3),"Zoom out"],["1:1",()=>F.applyZoom(1),"Reset zoom"],["⛶",()=>F.zoomToFit(),"Fit to view"]].map(([A,R,I])=>d.jsx("button",{onClick:R,title:I,className:Ye(!1),children:A},A))]}),d.jsx("div",{ref:F.containerRef,"data-graph-direction":a,className:"w-full h-full overflow-auto cursor-grab",children:d.jsx("div",{ref:F.spacerRef,children:d.jsx("div",{ref:F.wrapperRef,className:"relative",children:O&&d.jsxs(d.Fragment,{children:[d.jsxs("svg",{ref:Ge,className:"absolute top-0 left-0 pointer-events-none",width:C,height:U,children:[d.jsxs("defs",{children:[(()=>{const A=Dn("forward"),{d:R,...I}=A;return d.jsx("marker",{id:h("arrow-own"),...I,children:d.jsx("path",{d:R,fill:Qe.ownFwd})})})(),(()=>{const{d:A,...R}=Dn("backward");return d.jsx("marker",{id:h("arrow-own-back"),...R,children:d.jsx("path",{d:A,fill:Qe.ownBkwd})})})(),(()=>{const{d:A,...R}=Dn("forward",qm);return d.jsx("marker",{id:h("arrow-assoc"),...R,children:d.jsx("path",{d:A,fill:Qe.association})})})()]}),d.jsxs("g",{transform:`translate(${xt}, ${xt})`,style:{opacity:pe?1:0,transition:`opacity ${Sm()}ms`},children:[[...re].map(([A,R])=>d.jsx("path",{"data-arrowhead":R.edgeIds.join(" "),d:um(R.base,R.dir,Km,Dr),fill:R.color?.text??Mr(R.isOwn,!1),opacity:R.dimmed?.4:1,style:{transition:`filter ${pn()}ms`}},`head-${A}`)),($?.edges??[]).map(A=>{const R=Oe.get(A.id);if(!R)throw new Error(`Routed edge ${A.id} missing from view model`);const I=R.storageDirection==="flipped",H=ue(R)===R.source?R.target:R.source,K=I||Q.has(A.id)?void 0:q.get(`${H}|${H===R.source?"out":"in"}`),Y=ne.get(A.id),M=!!K&&wi(l,Y??hn(A.sections))>0,_=R.type!=="ownership",W=M?A.sections:Jm(A.sections,kr(_?"association":"own-fwd")),Z=_?eg(W,kr("association")):W,de=Y??hn(Z),Ee=Jn=>om(Jn,Gm),Ie=wi(l,de),ot=K&&Ie>0?lm(de,K.base,Ie,Ee):Ee(de);if(!ot)return null;const Xe=R.type==="ownership",bt=xe.get(A.source)==="context"||xe.get(A.target)==="context",sn=M?void 0:Xe?I?"arrow-own-back":"arrow-own":"arrow-assoc";return d.jsxs("g",{children:[d.jsx("path",{"data-edge-id":A.id,"data-channel":Xe?"ownership":"association",d:ot,fill:"none",opacity:bt?.4:1,stroke:x.edgeColors.get(A.id)?.text??Mr(Xe,I),strokeWidth:Xe?Zl:Ym,strokeDasharray:Xe?void 0:ie.dash,markerEnd:sn?`url(#${h(sn)})`:void 0,markerStart:!Xe&&!M?`url(#${h("arrow-assoc")})`:void 0,style:{transition:`filter ${pn()}ms, stroke-width ${pn()}ms`}}),d.jsx("path",{d:ot,fill:"none",stroke:"transparent",strokeWidth:11,style:{pointerEvents:"stroke"},onMouseEnter:()=>J({kind:"edge",id:A.id}),onMouseLeave:()=>J(null)})]},A.id)})]})]}),d.jsx(Wf,{initial:!1,children:x.nodes.map(A=>{const R=se.get(A.id);if(!R)return null;const I=A.role==="context",H=R.x+xt,K=R.y+xt,Y={duration:fn(T.has(A.id)?0:Bl()),ease:xm};return d.jsxs(Zp.div,{initial:{opacity:0,x:H,y:K},animate:{opacity:I?Bm:1,x:H,y:K},exit:{opacity:0,transition:{duration:fn(Cr())}},transition:{x:Y,y:Y,opacity:{duration:fn(Cr()),delay:fn(km())}},"data-node-id":A.id,"data-help-id":Qc(A),"data-pan-ignore":!0,"data-pinned":S.has(A.id)?"":void 0,onPointerDown:M=>me(A.id,M),onClick:()=>{if(X.current){X.current=!1;return}n?.(A.members.length?A.label:A.id)},onMouseEnter:()=>J({kind:"node",id:A.id}),onMouseLeave:()=>J(null),className:`absolute rounded-md text-xs bg-white dark:bg-slate-800 cursor-pointer ${I?"border border-dashed border-gray-400 dark:border-slate-500":S.has(A.id)?"border-2 border-amber-500 dark:border-amber-400 shadow-md":"border-2 border-slate-500 dark:border-slate-400 shadow-md"}`,style:{width:Ce,height:A.height,transition:`filter ${pn()}ms`},children:[d.jsxs("div",{className:"flex items-center gap-1 px-2 rounded-t-[4px] bg-slate-700 dark:bg-slate-700 text-white border-b border-slate-800 dark:border-slate-600",style:{height:pt},children:[d.jsx("span",{className:`font-semibold truncate ${A.abstract?"italic":""}`,title:A.description||A.id,children:A.label}),d.jsxs("span",{className:"ml-auto flex gap-1 shrink-0",children:[A.members.length>0&&d.jsxs("span",{title:`${A.members.length} classes that are a ${A.label}, merged into one box`,className:"text-[9px] px-1 rounded bg-sky-100 dark:bg-sky-900 text-sky-800 dark:text-sky-200",children:["⑃ ",A.members.length]}),A.isaParents.map(M=>d.jsxs("span",{title:`is-a ${M}`,className:"text-[9px] px-1 rounded bg-sky-100 dark:bg-sky-900 text-sky-800 dark:text-sky-200",children:["⊳ ",M]},M)),A.subclassCount>0&&A.members.length===0&&d.jsxs("span",{title:`${A.subclassCount} subclasses shown`,className:"text-[9px] px-1 rounded bg-sky-100 dark:bg-sky-900 text-sky-800 dark:text-sky-200",children:["▷ ",A.subclassCount]}),(()=>{const _=(A.members.length?A.members.map(W=>W.id):[A.id]).filter(W=>t.has(W));return _.length?d.jsx("button",{"data-dismiss":A.id,"data-help-id":"node-dismiss",title:_.length>1?`Remove all ${_.length} selected classes in ${A.label}`:`Remove ${A.label} from the canvas`,onClick:W=>{W.stopPropagation(),_.forEach(Z=>s?.(Z))},className:`text-[10px] leading-none px-1 rounded text-gray-400
                                         hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/40`,children:"✕"}):null})()]})]}),A.relationGroups.length>0&&d.jsx("div",{"data-help-id":"relation-bar",className:`flex items-center gap-1 px-2 border-b overflow-hidden
                                     border-gray-200 dark:border-slate-600
                                     bg-sky-50/60 dark:bg-sky-950/30`,style:{height:zs},children:d.jsx(Dm,{label:A.label,rows:A.relationRows,onAdd:M=>i?.(M),onRemove:M=>s?.(M),onInspect:n,colorOf:m,slotOrder:A.allRows.map(M=>M.slot),parentOf:M=>e.getClassSummary(M)?.parentId})}),A.rows.map(M=>M.header?d.jsx("div",{"data-no-drag":!0,"data-help-id":Gc(M.header.id),title:`${M.header.label} — is a ${A.label}; click for details`,onClick:_=>{_.stopPropagation(),n?.(M.header.id)},className:`flex items-center px-2 text-[10px] font-semibold
                                     cursor-pointer hover:brightness-110`,style:{height:mt,background:M.header.color.fill,color:Dc},children:d.jsx("span",{className:"truncate",children:M.header.label})},M.slot):d.jsxs("div",{"data-help-id":qc(A,M),"data-expandable":Re(M)?"":void 0,"data-no-drag":Re(M)?"":void 0,title:(M.channel==="plain"?`${M.slot}: ${M.range}`:`${M.slot} → ${M.range} (${M.cardinality})${M.flipped?" — owner side":""}`+(Re(M)?` — click to add ${M.range}`:""))+((M.owners?.length??0)>1?`
also declared by ${M.owners.slice(1).map(_=>_.label).join(", ")}`:""),onClick:Re(M)?_=>{_.stopPropagation(),i?.(M.range)}:void 0,className:`flex items-center gap-1.5 px-2 text-[11px] ${M.targetColor?"":M.connected?"text-gray-700 dark:text-gray-300":"text-gray-400 dark:text-gray-500"} ${Re(M)?"cursor-pointer hover:bg-sky-50 dark:hover:bg-sky-900/30 hover:text-sky-700 dark:hover:text-sky-300":""}`,style:{height:mt,...M.targetColor?{color:M.targetColor.text}:{}},children:[d.jsx("span",{className:"w-1.5 h-1.5 rounded-full shrink-0 border",style:{borderColor:M.rangeColor,background:M.connected?M.rangeColor:"transparent"}}),d.jsx("span",{className:`truncate ${A.members.length&&!M.owners?.length?`font-semibold ${M.targetColor?"":"text-gray-900 dark:text-gray-100"}`:""}`,children:M.slot}),M.isLoop&&d.jsx(Wm,{title:`self-referential: a ${M.range} can own another ${M.range} via ${M.slot}`}),d.jsxs("span",{className:"ml-auto text-[9px] truncate max-w-[90px]",children:[d.jsx("span",{style:{color:M.rangeColor},children:M.range}),d.jsxs("span",{className:"text-gray-400 dark:text-gray-500",children:[" ",M.cardinality]})]})]},M.declaringClass?`${M.declaringClass}|${M.slot}`:M.slot)),A.hiddenCount>0&&d.jsx("button",{className:"w-full text-left px-2 text-[10px] text-sky-600 dark:text-sky-400 hover:underline",style:{height:Ul},title:`${qe} without an edge on the current canvas, plus plain (non-entity) ${qe}`,onClick:M=>{M.stopPropagation(),ge(A.id)},children:A.expanded?`− fewer ${qe}`:`+ ${A.hiddenCount} more ${qe}`})]},A.id)})})]})})})})]})}function ng({classId:e,dataService:t,onClose:n,onNavigate:i,isSelected:s,onToggleSelect:r}){const o=b.useMemo(()=>t.getClassSummary(e),[e,t]),[a,c]=b.useState([]),l=b.useCallback(h=>{h!==e&&(c(y=>[...y,e]),i(h))},[e,i]),u=b.useCallback(()=>{c(h=>h.length===0?h:(i(h[h.length-1]),h.slice(0,-1)))},[i]);b.useEffect(()=>{const h=y=>{y.key==="Escape"&&n()};return window.addEventListener("keydown",h),()=>window.removeEventListener("keydown",h)},[n]);const f=t.getTypeLabel("slot",!0);return d.jsxs("aside",{className:`w-96 shrink-0 flex flex-col min-h-0 border-l border-gray-200 dark:border-slate-700
                 bg-white dark:bg-slate-900`,"aria-label":"Entity details",children:[d.jsxs("header",{className:`flex items-start gap-2 px-3 py-2 border-b border-gray-200 dark:border-slate-700
                   bg-gray-50 dark:bg-slate-800 shrink-0`,children:[a.length>0&&d.jsx("button",{onClick:u,className:"text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-sm mt-0.5",title:"Back",children:"←"}),d.jsxs("div",{className:"flex-1 min-w-0",children:[d.jsxs("div",{className:"font-semibold text-sm text-blue-700 dark:text-blue-300 break-words",children:[o?.name??e,o?.isAbstract&&d.jsx("span",{className:"ml-1 text-xs text-purple-500 italic",children:"(abstract)"})]}),o?.parentId&&d.jsxs("div",{className:"text-xs text-gray-400",children:["is a"," ",d.jsx("button",{onClick:()=>l(o.parentId),className:"text-blue-600 dark:text-blue-400 hover:underline",children:o.parentId})]})]}),d.jsx("button",{onClick:n,className:"text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-sm px-1",title:"Close (Esc)",children:"✕"})]}),o?d.jsxs("div",{className:"flex-1 overflow-y-auto min-h-0 px-3 py-2 space-y-3",children:[d.jsx("button",{onClick:()=>r(e),className:`w-full px-2 py-1 text-xs rounded border ${s?"border-blue-500 bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300":"border-gray-300 dark:border-slate-600 hover:border-blue-400 text-gray-600 dark:text-gray-300"}`,children:s?"✓ In diagram — click to remove":"+ Add to diagram"}),o.description&&d.jsx("p",{className:"text-xs text-gray-600 dark:text-gray-300 leading-relaxed",children:o.description}),o.referencedBy.length>0&&d.jsxs("section",{children:[d.jsxs(Rr,{children:["Referenced by (",o.referencedBy.length,")"]}),d.jsx("ul",{className:"space-y-0.5",children:o.referencedBy.map((h,y)=>d.jsxs("li",{className:"text-xs",children:[d.jsx("button",{onClick:()=>l(h.classId),className:"text-blue-600 dark:text-blue-400 hover:underline cursor-pointer",children:h.classId}),d.jsxs("span",{className:"text-gray-400",children:[".",h.slotName]})]},`${h.classId}.${h.slotName}-${y}`))})]}),o.slots.length>0&&d.jsxs("section",{children:[d.jsxs(Rr,{children:[f," (",o.slots.length,")"]}),d.jsx("ul",{className:"divide-y divide-gray-100 dark:divide-slate-700",children:o.slots.map((h,y)=>d.jsxs("li",{className:"py-1.5",children:[d.jsxs("div",{className:"flex items-baseline gap-1.5 flex-wrap",children:[d.jsx("span",{className:"text-xs font-medium text-gray-800 dark:text-gray-100",children:h.name}),d.jsx(ig,{range:h.range,onNavigate:l,dataService:t})]}),h.description&&d.jsx("p",{className:"mt-0.5 text-[11px] text-gray-500 dark:text-gray-400 leading-snug break-words",children:h.description})]},`${h.name}-${y}`))})]})]}):d.jsxs("div",{className:"p-3 text-xs text-gray-500",children:["Entity not found: ",e]})]})}function Rr({children:e}){return d.jsx("div",{className:"text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-1",children:e})}function ig({range:e,onNavigate:t,dataService:n}){const i=n.getRangeKind(e),s=i==="class"&&n.itemExists(e),o=`inline-block px-1 py-0 rounded text-[11px] font-medium ${i==="type"?"bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300":i==="enum"?"bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300":"bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"}`;return s?d.jsx("button",{onClick:()=>t(e),className:`${o} hover:underline cursor-pointer`,children:e}):d.jsx("span",{className:o,children:e})}const sg=[{heading:"One rule at a time",cases:[{name:"Rule 1 — multivalued owns forward",note:"A multivalued slot means the owner has-a collection, so ownership runs forward: Questionnaire.items and ResearchStudy.consents. The two `part_of` self-loops are the counterexample — multivalued but drawn backward, because they walk UP a tree.",sel:["ResearchStudy","Consent","Questionnaire","QuestionnaireItem"]},{name:"Rule 2 — single-valued belongs backward",note:"The largest group (70 edges). Participant fans OUT to 22 targets, nearly all reversed: each target declares `associated_participant` and is drawn as belonging to Participant. This is the group that would move if own-bkwd merges into association.",sel:["Participant","Condition","Demography","Exposure","Procedure","Visit"]},{name:"Exception 2a — no independent existence",note:"Single-valued, but forward anyway: Quantity, TimePoint and the like have no identity of their own, so the value belongs to whoever holds it rather than owning the holder.",sel:["SpecimenStorageActivity","Quantity","TimePoint","Activity"]},{name:"Entity-ranged — always forward",note:"The twelve focus / associated_evidence slots range on Entity, the universal root. A pointer AT the root is never a foreign key back to an owner, so these run forward whatever their cardinality. Both single- and multi-valued focus sites are here — all should point AT Entity.",sel:["Observation","ObservationSet","MeasurementObservation","Document","Condition","SdohObservation","Entity"]},{name:"Association — no ownership claim",note:"Both associations in the schema: Document.related_document → Specimen, and SpecimenContainer.container → SpecimenStorageActivity. Slate and dashed, arrowed at both ends. They are listed explicitly because they are multivalued, so Rule 1 would otherwise call them ownership.",sel:["Document","Specimen","SpecimenContainer","SpecimenStorageActivity"]},{name:"Self-loops",note:"The five self-owning slots (TimePoint.index_time_point, File.derived_from, Specimen.parent_specimen, ResearchStudy.part_of, SpecimenContainer.parent_container) — loop markers, not routed edges. ResearchStudy also pulls in its TimePoint edges; the loops are the circular arrows on the rows.",sel:["TimePoint","File","Specimen","ResearchStudy","SpecimenContainer"]}]},{heading:"Inheritance (merged sibling boxes)",cases:[{name:"One child, merged with its parent",note:"MeasurementObservation alone. It still merges: the box is titled Observation, its 13 inherited rows sit at the top in black, and MeasurementObservation's own 9 follow under its coloured header. Merging does not wait for a second sibling — a class must not change shape because of what else you happen to select.",sel:["MeasurementObservation"]},{name:"Children that add nothing",note:'SpecimenQuality- and SpecimenQuantityObservation declare no slots of their own. Both still get a header under the shared rows, because "this subclass adds nothing" is the answer to what they are — and without the headers the selection would leave no trace in the box at all.',sel:["SpecimenQualityObservation","SpecimenQuantityObservation"]},{name:"slot_usage — same name, different type",note:"QuestionnaireResponseValue's five children each narrow `value` to a different type (boolean, decimal, integer, TimePoint, and the parent's string). That narrowing is the entire reason the five classes exist, so each keeps its OWN row rather than merging into the parent's — the one place a shared row would be a lie.",sel:["QuestionnaireResponseValueBoolean","QuestionnaireResponseValueDecimal","QuestionnaireResponseValueInteger","QuestionnaireResponseValueString","QuestionnaireResponseValueTimePoint"]},{name:"The full Observation family",note:"All five Observation subclasses plus the parent. One box where there would be six, and the shared rows are stated once. Note each edge leaves in the colour of the child that owns its row; inherited slots' edges are the parent's and are drawn once, not once per child.",sel:["Observation","MeasurementObservation","SdohObservation","DimensionalObservation","SpecimenQualityObservation","SpecimenQuantityObservation"]}]},{heading:"The bare diagonal",cases:[{name:"BodySite 6-way (the original)",note:"The reproducer from the handoff. In ⌙ (bend) the top approach arrives as a straight diagonal with no steps; in ⋙ (near) it keeps its horizontal run. This is the case the fix has to fix.",sel:["BodySite","Condition","Consent","Demography","Exposure","Observation","Procedure","ImagingFile","ImagingStudy","MeasurementObservation","SpecimenCreationActivity"]},{name:"BodySite, owners only",note:"The same convergence with nothing else on canvas — six owners, no unrelated boxes for a diagonal to cut across. Shows whether the degeneracy is about the convergence itself or about crowding.",sel:["BodySite","Condition","ImagingFile","ImagingStudy","MeasurementObservation","Procedure","SpecimenCreationActivity"]},{name:"TimePoint 16-edge",note:"Densest corridor in the schema: 8 owners but 16 slot-edges, since each Specimen*Activity owns date_started and date_ended. Also where the second-from-top edge goes diagonal and pair edges cross.",sel:["TimePoint","Consent","ResearchStudy","TimePeriod","SpecimenCreationActivity","SpecimenProcessingActivity","SpecimenStorageActivity","SpecimenTransportActivity","QuestionnaireResponseValueTimePoint"]},{name:"TimePoint + Person (crossing)",note:"Siggie's repro for the crossing bug: the paired date_started / date_ended edges from different owners cross each other on the way in. Compare pair ordering against the case above.",sel:["TimePoint","Person","Consent","ResearchStudy","TimePeriod","SpecimenCreationActivity","SpecimenProcessingActivity","SpecimenStorageActivity","SpecimenTransportActivity","QuestionnaireResponseValueTimePoint"]}]},{heading:"Pathological convergences",cases:[{name:"Quantity 19-edge (worst case)",note:"The largest convergence in the schema: 16 owning classes, 19 slot-edges. The fan is squeezed hardest here, so ENTITY_FAN_GAP and the merge distance both show their limits.",sel:["Quantity","Activity","Assay","DeviceExposure","DimensionalObservation","DrugExposure","MeasurementObservation","Observation","Procedure","SdohObservation","SpecimenCreationActivity","SpecimenProcessingActivity","SpecimenQualityObservation","SpecimenQuantityObservation","SpecimenStorageActivity","SpecimenTransportActivity","Substance"]},{name:"Context 6-way (uniform owners)",note:"Six owners that are all observation classes — same size, same shape, similar row counts. The controlled comparison for BodySite, whose owners vary wildly in height.",sel:["Context","DimensionalObservation","MeasurementObservation","Observation","SdohObservation","SpecimenQualityObservation","SpecimenQuantityObservation"]},{name:"Two convergences at once",note:"Quantity and TimePoint both converge from the same Specimen activity classes, so two corridors compete for the same space. Where merge distance trades off against crossings.",sel:["Quantity","TimePoint","SpecimenCreationActivity","SpecimenProcessingActivity","SpecimenStorageActivity","SpecimenTransportActivity"]}]},{heading:"Flipped divergences (found via the legend)",cases:[{name:"Participant 22-way (largest fan in the schema)",note:"Bigger than any inbound convergence: 22 edges leaving Participant, 21 of them FLIPPED. Flipped edges keep their attribute-row anchor and must not merge, so this is the fan the merge code deliberately does not touch — and therefore the one nothing has been tuned against.",sel:["Participant","Condition","Consent","Demography","DeviceExposure","DrugExposure","Exposure","File","ImagingStudy","MeasurementObservation","Observation","Procedure","SdohObservation","Specimen","Visit"]},{name:"Visit 19-way",note:"The same shape one size down, and it overlaps Participant heavily — most classes carry both associated_participant and associated_visit, so the two fans run through the same corridor as pairs.",sel:["Visit","Condition","Demography","DeviceExposure","DrugExposure","Exposure","ImagingStudy","MeasurementObservation","Observation","Procedure","QuestionnaireResponse","SdohObservation","TimePeriod"]},{name:"Participant + Visit + Organization",note:"All three FK hubs at once (22 + 19 + 11 edges, nearly all flipped). The densest picture the schema can produce, and the stress test for anything that changes routing.",sel:["Participant","Visit","Organization","Condition","Demography","DimensionalObservation","MeasurementObservation","Observation","ObservationSet","Procedure","SdohObservation","SpecimenQualityObservation","SpecimenQuantityObservation"]},{name:"Converge and diverge at once",note:"MeasurementObservation owns BodySite/Context/Quantity while being owned by Participant/Visit/Organization — edges fan IN and OUT of the same box. Where merged (entity-end) and unmerged (flipped) arrivals sit side by side.",sel:["MeasurementObservation","BodySite","Context","Quantity","Participant","Visit","Organization","MeasurementObservationSet"]}]},{heading:"Normal cases (a fix must not break these)",cases:[{name:"Single edge",note:"One owner, one edge, no convergence at all — merging is a no-op. The floor: if this looks wrong, something basic broke.",sel:["Visit","TimePeriod"]},{name:"Two owners",note:"The smallest real convergence. Two approaches, one arrowhead — the fan is barely a fan, so a merge distance that is too long is obvious here first.",sel:["Participant","Visit","ObservationSet"]},{name:"Specimen chain (deep, not wide)",note:"A long ownership chain rather than a convergence: many layers, few edges per node. Checks that tuning for convergences has not made ordinary edges worse.",sel:["Specimen","SpecimenContainer","SpecimenCreationActivity","SpecimenProcessingActivity","SpecimenStorageActivity","SpecimenTransportActivity","Participant"]},{name:"The known 3-node cycle",note:"Specimen -> SpecimenStorageActivity -> SpecimenContainer -> Specimen: an association plus two ownership edges. Known and deliberately unhandled; here so it stays visible.",sel:["Specimen","SpecimenStorageActivity","SpecimenContainer"]},{name:"Backward ownership (own-bkwd)",note:"Slots drawn backward (performed_by, associated_person, contained_in, related_imaging_study). These keep their attribute-row anchor and must NOT merge — check the arrowheads.",sel:["Organization","Person","Participant","ImagingFile","ImagingStudy","SpecimenContainer","Specimen"]},{name:"Path to root",note:"Path-to-root on from a single deep class, which pulls in every owner up the chain. The biggest graph reachable in one click.",sel:["MeasurementObservation"],roots:!0}]}],og=3,bi=40;function ec(){const[e,t]=b.useState(null),n=b.useCallback(s=>{if(s.button!==0||s.target.closest('button, a, input, select, textarea, [role="button"], [data-no-drag]'))return;const o=(s.currentTarget.closest("[data-draggable]")??s.currentTarget).getBoundingClientRect(),a=s.clientX,c=s.clientY,l={left:o.left,top:o.top},u=s.currentTarget;u.setPointerCapture(s.pointerId);let f=!1;const h=p=>{const g=p.clientX-a,m=p.clientY-c;if(!f&&Math.hypot(g,m)<og)return;f=!0;const w={left:Math.max(Math.min(l.left+g,window.innerWidth-bi),bi-o.width),top:Math.min(Math.max(l.top+m,0),window.innerHeight-bi)};t(w)},y=p=>{u.releasePointerCapture(p.pointerId),u.removeEventListener("pointermove",h),u.removeEventListener("pointerup",y),u.removeEventListener("pointercancel",y)};u.addEventListener("pointermove",h),u.addEventListener("pointerup",y),u.addEventListener("pointercancel",y)},[]),i=b.useCallback(()=>t(null),[]);return{offset:e,onPointerDown:n,reset:i}}const Us={legend:34,cases:26},rg=1,ag=Us.legend+rg;function tc({title:e,subtitle:t,onClose:n,offset:i,widthRem:s=Us.cases,children:r}){const o=ec();b.useEffect(()=>{const c=l=>{l.key==="Escape"&&n()};return window.addEventListener("keydown",c),()=>window.removeEventListener("keydown",c)},[n]);const a=o.offset!==null;return d.jsxs("div",{"data-draggable":"",style:{resize:"both",width:`${s}rem`,maxWidth:"calc(100vw - 2rem)",maxHeight:o.offset?`calc(100vh - ${o.offset.top}px - 1rem)`:"calc(100vh - 4.5rem)",...o.offset?{position:"fixed",...o.offset,right:"auto"}:!a&&i?{right:`${ag}rem`}:{}},className:`z-30 overflow-y-auto
                  rounded-lg border border-gray-300 dark:border-slate-600
                  bg-white dark:bg-slate-800 shadow-xl
                  text-gray-900 dark:text-gray-100
                  ${a?"":`absolute top-14 ${i?"":"right-4"}`}`,children:[d.jsxs("div",{onPointerDown:o.onPointerDown,className:`sticky top-0 flex items-baseline justify-between gap-2 px-4 py-2
                   border-b border-gray-200 dark:border-slate-700
                   bg-white dark:bg-slate-800 cursor-grab active:cursor-grabbing
                   select-none`,children:[d.jsxs("div",{children:[d.jsx("h2",{className:"text-sm font-semibold",children:e}),t&&d.jsx("p",{className:"text-[11px] text-gray-500 dark:text-gray-400",children:t})]}),d.jsxs("div",{className:"flex items-center gap-1 shrink-0",children:[a&&d.jsx("button",{onClick:o.reset,title:"Put it back",className:`text-gray-400 hover:text-gray-700 dark:hover:text-gray-200
                         text-xs leading-none px-1`,children:"⤺"}),d.jsx("button",{onClick:n,title:"Close (Esc)",className:"text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-lg leading-none",children:"×"})]})]}),d.jsx("div",{className:"px-4 py-2",children:r})]})}function lg(e,t){return e.sel.length===t.size&&e.sel.every(n=>t.has(n))}function cg({onClose:e,onApply:t,selectedIds:n,dataService:i,offset:s}){const r=b.useMemo(()=>i.getConvergenceRanking(),[i]),o=b.useMemo(()=>i.getDivergenceRanking(),[i]),a=c=>t({name:"ad hoc",note:"",sel:c});return d.jsxs(tc,{title:"Example cases",subtitle:"Selections worth looking at, simple to dense.",onClose:e,offset:s,children:[d.jsxs("section",{className:"mb-4",children:[d.jsx(jr,{children:"Biggest fans"}),d.jsx("p",{className:"text-[11px] text-gray-500 dark:text-gray-400 mb-1.5",children:"Counted in slot-edges, not classes: one class owning a target through two slots crowds the corridor twice. Click a row to load just that fan."}),d.jsx("div",{className:"grid grid-cols-2 gap-3",children:[["Converging (in)",r.slice(0,6).map(c=>({entity:c.entity,n:c.edgeCount,peers:c.owners,flipped:0}))],["Diverging (out)",o.slice(0,6).map(c=>({entity:c.entity,n:c.edgeCount,peers:c.owned,flipped:c.flippedCount}))]].map(([c,l])=>d.jsxs("div",{children:[d.jsx("h4",{className:"text-[10px] font-medium text-gray-500 dark:text-gray-400 mb-0.5",children:c}),d.jsx("ul",{className:"space-y-0.5",children:l.map(u=>d.jsx("li",{children:d.jsxs("button",{onClick:()=>a([u.entity,...u.peers]),title:`Select ${u.entity} and all ${u.peers.length} peers`,className:"w-full text-left text-xs hover:bg-gray-50 dark:hover:bg-slate-700 rounded px-1",children:[d.jsx("span",{className:"text-blue-600 dark:text-blue-400",children:u.entity}),d.jsxs("span",{className:"text-gray-400 ml-1",children:[u.n,u.flipped>0?` (${u.flipped} flipped)`:""]})]})},u.entity))})]},c))})]}),sg.map(c=>d.jsxs("section",{className:"mb-3 last:mb-1",children:[d.jsx(jr,{children:c.heading}),d.jsx("ul",{className:"space-y-1.5",children:c.cases.map(l=>{const u=lg(l,n);return d.jsx("li",{children:d.jsxs("button",{onClick:()=>t(l),className:`block w-full text-left rounded px-2 py-1 border
                      ${u?"border-blue-500 bg-blue-50 dark:bg-blue-950":"border-transparent hover:bg-gray-50 dark:hover:bg-slate-700"}`,children:[d.jsx("span",{className:`text-xs font-medium ${u?"text-blue-700 dark:text-blue-300":"text-blue-600 dark:text-blue-400"}`,children:l.name}),d.jsxs("span",{className:"ml-1.5 text-[10px] text-gray-400",children:[l.sel.length,l.roots?" ⇱":""]}),d.jsx("p",{className:"text-[11px] leading-snug text-gray-600 dark:text-gray-400 mt-0.5",children:l.note})]})},l.name)})})]},c.heading))]})}function jr({children:e}){return d.jsx("h3",{className:`text-[11px] font-semibold uppercase tracking-wider
                   text-gray-400 dark:text-gray-500 mb-1`,children:e})}const ug=["owners","attrs","owned","total"],dg={owners:{short:"owners",long:e=>`entities that own (the ${e?"source":"target"})`},attrs:{short:"attrs",long:()=>"distinct attribute names"},owned:{short:"owned",long:e=>`entities that are owned (the ${e?"target":"source"})`},total:{short:"total",long:()=>"attributes in all"}},hg={owners:!0,owned:!0,total:!0},nc={owners:e=>e.owner,attrs:e=>e.slotName,owned:e=>e.owned,total:e=>e.slotName},Ze="Target entity",Nt="Source entity",lt="Attribute name",xi="Source.attribute",fg={owners:{fwd:{levels:["entity"],leaf:["attr","target"],arrow:"leaf",headers:[Nt,lt,Ze]},bkwd:{levels:["entity","attr"],leaf:["source"],arrow:"label:0",headers:[Ze,lt,Nt]}},attrs:{fwd:{levels:["attr"],leaf:["source","target"],arrow:"leaf",headers:[lt,Nt,Ze]},bkwd:{levels:["attr","entity"],leaf:["srcAttr"],arrow:"label:1",headers:[lt,Ze,xi]}},owned:{fwd:{levels:["entity"],leaf:["srcAttr"],arrow:"label:0",rightAlignLabel:!0,headers:[xi,Ze]},bkwd:{levels:["entity"],leaf:["attr","target"],arrow:"leaf",headers:[Nt,lt,Ze]}},total:{fwd:{levels:["attr"],leaf:["source","target"],arrow:"leaf",headers:[lt,Nt,Ze]},bkwd:{levels:["attr","entity"],leaf:["srcAttr"],arrow:"label:1",headers:[lt,Ze,xi]}}},ic=(e,t)=>fg[e][t?"fwd":"bkwd"];function pg(e,t){const n=new Map;for(const i of e){const s=n.get(t(i));s?s.push(i):n.set(t(i),[i])}return[...n.entries()].map(([i,s])=>({key:i,pairs:s})).sort((i,s)=>i.key.localeCompare(s.key))}const mg={entity:e=>e.owner,attr:e=>e.slotName,srcAttr:e=>`${e.declaredOn}.${e.slotName}`,source:e=>e.declaredOn,target:e=>e.range};function gg(e,t){return t==="total"?e.length:new Set(e.map(nc[t])).size}function Lr(e,t,n){const{levels:i}=ic(t,n),s=(r,o)=>{const a=i[o],c=a==="entity"&&o>0&&!n?u=>u.owner:o===0?nc[t]:mg[a],l=pg(r,c);return o===i.length-1?l:l.map(u=>({...u,children:s(u.pairs,o+1)}))};return s(e,0)}const yg=!1,wg=!1,Gs=b.createContext(null);function gt(){const e=b.useContext(Gs);if(!e)throw new Error("useHelp must be used inside <HelpProvider>");return e}function bg(){return b.useContext(Gs)??void 0}function sc(e){const t=Number(e?.trim());return Number.isFinite(t)&&t>=240?t:void 0}function oc(e){const t=e?.trim().toLowerCase();return t==="dim"||t==="ring"||t==="none"?t:void 0}function rc(e){const t=e?.trim().toLowerCase();return t==="left"||t==="right"||t==="top"||t==="bottom"?t:void 0}function ac(e){const t=e?.trim();if(!t)return;const n=Number(t);if(Number.isFinite(n))return{px:n};const i=t.match(/^(-)?(?:anchor|parentBox)\.(width|height)(?:\s*\*\s*(-?[\d.]+))?$/i);if(!i)return;const[,s,r,o]=i,a=o===void 0?1:Number(o);if(Number.isFinite(a))return{of:r.toLowerCase(),times:s?-a:a}}function Yn(e,t){const n=e?.trim();if(!n)return{kind:"help-id",arg:t};if(n==="none")return{kind:"none"};const i=n.indexOf(":");return i===-1?{kind:"help-id",arg:n}:{kind:n.slice(0,i).trim(),arg:n.slice(i+1).trim()}}function lc(e,t){const n=e?.replace(/<!--[\s\S]*?-->/g,"").trim();if(!n)return;const i=n.split(/[,~]/).map(s=>s.trim()).filter(Boolean);return i.length?i.map(s=>Yn(s,t)):void 0}const xg="Format",vg="Walkthrough",kg=new Set([xg,"TODO"]),cc=/^<\/?(?:details|summary)\b[^>]*>$/i;function be(e,t){const n=t.toLowerCase();for(const i of e){const s=Rt(i);if(s){if(s.name==="beats"&&n!=="beats")return;if(s.name===n&&!s.parked)return s.value}}}function Rt(e){const t=e.trimStart().match(/^-\s+(.*)$/);if(!t)return;let n=t[1].replace(/\*\*/g,"").trim(),i=!1;if(n.startsWith("~~")){const o=n.indexOf("~~",2);if(o===-1)return;i=!0,n=o===n.length-2?n.slice(2,o):`${n.slice(2,o)}${n.slice(o+2)}`}const s=n.indexOf(":");if(s===-1)return;const r=n.slice(0,s).trim();if(/^[A-Za-z_][A-Za-z0-9_]*$/.test(r))return{name:r.toLowerCase(),value:n.slice(s+1).trim(),parked:i}}const Ks=e=>{const t=Rt(e);return t&&!t.parked?t.name:void 0},Sg=new Set(["title","description","interactions","shortcut","context","anchor","spotlight","action","once","change","only","highlight","width","position","offsetx","tour","beats"]),Tg=new Set(["description","anchor","spotlight","action","change","only","highlight","width","position","offsetx","keep"]),Cg=new Set(["tourmetadata","tourabbr","description"]);function uc(e,t,n,i){for(const s of e){if(!Xn(s))continue;const r=Rt(s);!r.parked&&!t.has(r.name)&&i.push(`${n}: unknown field "${r.name}" (a misspelling? to park a field, strike it through: ~~${r.name}:~~)`)}}function Xn(e){return e.length>0&&!/^\s/.test(e)&&Rt(e)!==void 0}function dc(e,t){const n=t.toLowerCase(),i=e.findIndex(l=>Ks(l)===n);if(i===-1)return;const s=Rt(e[i]).value,r=[];for(let l=i+1;l<e.length&&!(Xn(e[l])||cc.test(e[l].trim()));l++)r.push(e[l]);for(;r.length&&r[r.length-1].trim()==="";)r.pop();if(r.length===0)return s;const o=r.filter(l=>l.trim()!=="").map(l=>l.length-l.trimStart().length),a=Math.min(...o),c=r.map(l=>l.slice(a)).join(`
`);return s?`${s}
${c}`:c}function Ag(e,t){const n=t.toLowerCase(),i=e.findIndex(r=>Ks(r)===n);if(i===-1)return[];const s=[];for(let r=i+1;r<e.length;r++){const o=e[r].trimStart();if(Xn(e[r])||o==="")break;o.startsWith("- ")&&s.push(o.slice(2).trim())}return s}function Pg(e,t,n){const i=e.findIndex(a=>Ks(a)==="beats");if(i===-1)return;const s=[];let r=null;const o=()=>{r&&s.push(r)};for(let a=i+1;a<e.length;a++){const c=e[a].trimStart();if(Xn(e[a])||e[a].length>0&&!/^\s/.test(e[a])&&/^<\/?[a-z]/i.test(c))break;if(c==="")continue;const l=c.match(/^(\d+)\.\s+(.*)$/);if(l){o(),r={text:l[2].trim()};continue}const u=Rt(c);if(!u?.parked){if(u&&r){const{name:f,value:h}=u;if(!Tg.has(f)){n.push(`${t} beat ${s.length+1}: unknown field "${f}" (a misspelling? to park a field, strike it through: ~~${f}:~~)`);continue}if(f==="description"){const y=e[a].length-e[a].trimStart().length,p=[];let g=a+1;for(;g<e.length;g++){if(e[g].trim()===""){p.push("");continue}if(e[g].length-e[g].trimStart().length<=y)break;p.push(e[g])}for(;p.length&&p[p.length-1].trim()==="";)p.pop();if(p.length){const m=p.filter(v=>v.trim()!=="").map(v=>v.length-v.trimStart().length),w=Math.min(...m),k=p.map(v=>v.slice(w)).join(`
`);r.description=h?`${h}
${k}`:k}else r.description=h;a=g-1;continue}f==="anchor"?r.anchor=Yn(h,t):f==="spotlight"?r.spotlight=lc(h,t):f==="action"?r.action=h.trim():f==="change"?r.change=h.trim():f==="only"?(r.change=h.trim(),r.replace=!0):f==="highlight"?r.highlight=oc(h):f==="width"?r.width=sc(h):f==="position"?r.position=rc(h):f==="offsetx"?r.offsetX=ac(h):f==="keep"&&(r.keep=h.trim()!=="false");continue}r&&!c.startsWith("-")&&(r.text=`${r.text} ${c}`.trim())}}return o(),s.length>0?s:void 0}function Eg(e,t,n){const i=e.split(`
`),r=i[0].match(/^###\s+(.+)$/);if(!r)return null;const o=r[1].trim();uc(i,Sg,o,n);const a=be(i,"Title")??o,c=dc(i,"Description")??"",l=Ag(i,"Interactions"),u=be(i,"Shortcut"),f=be(i,"Context"),h=Yn(be(i,"Anchor"),o),y=lc(be(i,"Spotlight"),o),p=be(i,"Action"),g=be(i,"Once"),m=be(i,"Only"),w=be(i,"Change"),k=w??m,v=w===void 0&&m!==void 0?!0:void 0,x=oc(be(i,"Highlight")),T=sc(be(i,"Width")),D=rc(be(i,"Position")),S=ac(be(i,"OffsetX")),P=Pg(i,o,n),E=be(i,"Tour");return{id:o,title:a,description:c,interactions:l,shortcut:u,context:f,anchor:h,action:p,once:g,change:k,replace:v,highlight:x,width:T,position:D,offsetX:S,tour:E===void 0?void 0:E||vg,order:t,beats:P,...y?{spotlight:y}:{}}}function Dg(e,t,n){const i=e.split(`
`),s=i.findIndex(p=>/^##\s+/.test(p)),r=s===-1?null:i[s].match(/^##\s+(.+)$/),o=r?r[1].trim():"Unknown",a=o.toLowerCase().replace(/[^a-z0-9]+/g,"-"),c=[];for(let p=s+1;p<i.length&&!i[p].startsWith("### ");p++)cc.test(i[p].trim())||c.push(i[p]);const l=c.join(`
`).trim();uc(c,Cg,`section "${o}"`,n);const u=be(c,"TourMetadata"),f=u===void 0?void 0:{name:u||o,description:dc(c,"Description")?.trim()??"",abbr:be(c,"TourAbbr")?.trim()||void 0},h=[],y=e.split(/(?=^### )/m);for(const p of y){if(!p.startsWith("### "))continue;const g=Eg(p.trim(),t(),n);g&&h.push(g)}return{id:a,title:o,body:l,entries:h,tourMeta:f}}function ds(e){const t=new Set;for(const n of[...e.entries.values()].sort((i,s)=>i.order-s.order))n.tour&&t.add(n.tour);return[...t]}function hc(e,t){const n=t??ds(e)[0];return[...e.entries.values()].filter(i=>i.tour!==void 0&&i.tour===n).sort((i,s)=>i.order-s.order)}function vi(e,t){return t<0?e:`${e} ▸${t+1}`}function ki(e){return`### ${e}`}function hs(e,t){const n=[];return hc(e,t).forEach((i,s)=>{const r=s+1;if(!i.beats||i.beats.length===0){n.push({entry:i,step:r,beatIndex:0,beatCount:0,address:vi(i.id,-1),searchFor:ki(i.id),blocks:[i.description],text:i.description,anchor:i.anchor,...i.spotlight?{spotlight:i.spotlight}:{},action:i.action,change:i.change,replace:i.replace,highlight:i.highlight,width:i.width,position:i.position,offsetX:i.offsetX});return}let o=i.description?[i.description]:[];o.length>0&&n.push({entry:i,step:r,beatIndex:-1,beatCount:i.beats.length,address:vi(i.id,-1),searchFor:ki(i.id),blocks:o,text:o.join(`

`),anchor:i.anchor,...i.spotlight?{spotlight:i.spotlight}:{},action:i.action,change:i.change,replace:i.replace,highlight:i.highlight,width:i.width,position:i.position,offsetX:i.offsetX});let a=i.width;i.beats.forEach((c,l)=>{const u=c.description??"";o=c.keep?[...o,u]:[u],c.width!==void 0&&(a=c.width),n.push({entry:i,step:r,beatIndex:l,beat:c,beatCount:i.beats.length,address:vi(i.id,l),searchFor:ki(i.id),blocks:o,text:o.join(`

`),anchor:c.anchor??i.anchor,...c.spotlight??i.spotlight?{spotlight:c.spotlight??i.spotlight}:{},action:c.action,highlight:c.highlight??i.highlight,width:a,position:c.position??i.position,offsetX:c.offsetX??i.offsetX,change:c.change,replace:c.replace})})}),n}function Mg(e){const n=e.replace(/<!--[\s\S]*?-->/g,"").trim().split(/(?=^## )/m).map(c=>c.trim()).filter(Boolean),i=[],s=new Map,r=[];let o=0;for(const c of n){if(!c.match(/^## /m))continue;const l=c.match(/^##\s+(.+)$/m)?.[1].trim();if(l&&kg.has(l))continue;const u=Dg(c,()=>o++,r);i.push(u);for(const f of u.entries)s.set(f.id,f)}const a=new Map;for(const c of i)c.tourMeta&&a.set(c.tourMeta.name,c.tourMeta);return r.length&&console.warn(`[help-content] ${r.length} problem(s):
  ${r.join(`
  `)}`),{sections:i,entries:s,tourMeta:a,problems:r}}const Og=/\{\{\s*([a-z][a-z0-9-]*)\s*:\s*([^}]*?)\s*\}\}/gi;function Qs(e,t){return!t||!e.includes("{{")?e:e.replace(Og,(n,i,s)=>t[i.toLowerCase()]?.(s)??n)}function Nr(e,t){const n=String(e);if(typeof t!="string")throw new TypeError("Expected character");let i=0,s=n.indexOf(t);for(;s!==-1;)i++,s=n.indexOf(t,s+t.length);return i}const Rg=["AElig","AMP","Aacute","Acirc","Agrave","Aring","Atilde","Auml","COPY","Ccedil","ETH","Eacute","Ecirc","Egrave","Euml","GT","Iacute","Icirc","Igrave","Iuml","LT","Ntilde","Oacute","Ocirc","Ograve","Oslash","Otilde","Ouml","QUOT","REG","THORN","Uacute","Ucirc","Ugrave","Uuml","Yacute","aacute","acirc","acute","aelig","agrave","amp","aring","atilde","auml","brvbar","ccedil","cedil","cent","copy","curren","deg","divide","eacute","ecirc","egrave","eth","euml","frac12","frac14","frac34","gt","iacute","icirc","iexcl","igrave","iquest","iuml","laquo","lt","macr","micro","middot","nbsp","not","ntilde","oacute","ocirc","ograve","ordf","ordm","oslash","otilde","ouml","para","plusmn","pound","quot","raquo","reg","sect","shy","sup1","sup2","sup3","szlig","thorn","times","uacute","ucirc","ugrave","uml","uuml","yacute","yen","yuml"],Ir={0:"�",128:"€",130:"‚",131:"ƒ",132:"„",133:"…",134:"†",135:"‡",136:"ˆ",137:"‰",138:"Š",139:"‹",140:"Œ",142:"Ž",145:"‘",146:"’",147:"“",148:"”",149:"•",150:"–",151:"—",152:"˜",153:"™",154:"š",155:"›",156:"œ",158:"ž",159:"Ÿ"};function fc(e){const t=typeof e=="string"?e.charCodeAt(0):e;return t>=48&&t<=57}function jg(e){const t=typeof e=="string"?e.charCodeAt(0):e;return t>=97&&t<=102||t>=65&&t<=70||t>=48&&t<=57}function Lg(e){const t=typeof e=="string"?e.charCodeAt(0):e;return t>=97&&t<=122||t>=65&&t<=90}function Vr(e){return Lg(e)||fc(e)}const Ng=["","Named character references must be terminated by a semicolon","Numeric character references must be terminated by a semicolon","Named character references cannot be empty","Numeric character references cannot be empty","Named character references must be known","Numeric character references cannot be disallowed","Numeric character references cannot be outside the permissible Unicode range"];function qs(e,t){const n=t||{},i=typeof n.additional=="string"?n.additional.charCodeAt(0):n.additional,s=[];let r=0,o=-1,a="",c,l;n.position&&("start"in n.position||"indent"in n.position?(l=n.position.indent,c=n.position.start):c=n.position);let u=(c?c.line:0)||1,f=(c?c.column:0)||1,h=p(),y;for(r--;++r<=e.length;)if(y===10&&(f=(l?l[o]:0)||1),y=e.charCodeAt(r),y===38){const w=e.charCodeAt(r+1);if(w===9||w===10||w===12||w===32||w===38||w===60||Number.isNaN(w)||i&&w===i){a+=String.fromCharCode(y),f++;continue}const k=r+1;let v=k,x=k,T;if(w===35){x=++v;const O=e.charCodeAt(x);O===88||O===120?(T="hexadecimal",x=++v):T="decimal"}else T="named";let D="",S="",P="";const E=T==="named"?Vr:T==="decimal"?fc:jg;for(x--;++x<=e.length;){const O=e.charCodeAt(x);if(!E(O))break;P+=String.fromCharCode(O),T==="named"&&Rg.includes(P)&&(D=P,S=so(P))}let N=e.charCodeAt(x)===59;if(N){x++;const O=T==="named"?so(P):!1;O&&(D=P,S=O)}let V=1+x-k,$="";if(!(!N&&n.nonTerminated===!1))if(!P)T!=="named"&&g(4,V);else if(T==="named"){if(N&&!S)g(5,1);else if(D!==P&&(x=v+D.length,V=1+x-v,N=!1),!N){const O=D?1:3;if(n.attribute){const F=e.charCodeAt(x);F===61?(g(O,V),S=""):Vr(F)?S="":g(O,V)}else g(O,V)}$=S}else{N||g(2,V);let O=Number.parseInt(P,T==="hexadecimal"?16:10);if(Ig(O))g(7,V),$="�";else if(O in Ir)g(6,V),$=Ir[O];else{let F="";Vg(O)&&g(6,V),O>65535&&(O-=65536,F+=String.fromCharCode(O>>>10|55296),O=56320|O&1023),$=F+String.fromCharCode(O)}}if($){m(),h=p(),r=x-1,f+=x-k+1,s.push($);const O=p();O.offset++,n.reference&&n.reference.call(n.referenceContext||void 0,$,{start:h,end:O},e.slice(k-1,x)),h=O}else P=e.slice(k-1,x),a+=P,f+=P.length,r=x-1}else y===10&&(u++,o++,f=0),Number.isNaN(y)?m():(a+=String.fromCharCode(y),f++);return s.join("");function p(){return{line:u,column:f,offset:r+((c?c.offset:0)||0)}}function g(w,k){let v;n.warning&&(v=p(),v.column+=k,v.offset+=k,n.warning.call(n.warningContext||void 0,Ng[w],v,w))}function m(){a&&(s.push(a),n.text&&n.text.call(n.textContext||void 0,a,{start:h,end:p()}),a="")}}function Ig(e){return e>=55296&&e<=57343||e>1114111}function Vg(e){return e>=1&&e<=8||e===11||e>=13&&e<=31||e>=127&&e<=159||e>=64976&&e<=65007||(e&65535)===65535||(e&65535)===65534}const $g=/["&'<>`]/g,Bg=/[\uD800-\uDBFF][\uDC00-\uDFFF]/g,Fg=/[\x01-\t\v\f\x0E-\x1F\x7F\x81\x8D\x8F\x90\x9D\xA0-\uFFFF]/g,_g=/[|\\{}()[\]^$+*?.]/g,$r=new WeakMap;function Hg(e,t){if(e=e.replace(t.subset?Wg(t.subset):$g,i),t.subset||t.escapeOnly)return e;return e.replace(Bg,n).replace(Fg,i);function n(s,r,o){return t.format((s.charCodeAt(0)-55296)*1024+s.charCodeAt(1)-56320+65536,o.charCodeAt(r+2),t)}function i(s,r,o){return t.format(s.charCodeAt(0),o.charCodeAt(r+1),t)}}function Wg(e){let t=$r.get(e);return t||(t=zg(e),$r.set(e,t)),t}function zg(e){const t=[];let n=-1;for(;++n<e.length;)t.push(e[n].replace(_g,"\\$&"));return new RegExp("(?:"+t.join("|")+")","g")}function Ug(e){return"&#x"+e.toString(16).toUpperCase()+";"}function Gg(e,t){return Hg(e,Object.assign({format:Ug},t))}const Kg={}.hasOwnProperty,Qg={},Br=/^[^\t\n\r "#'.<=>`}]+$/,qg=/^[^\t\n\r "'<=>`}]+$/;function Yg(){return{canContainEols:["textDirective"],enter:{directiveContainer:Zg,directiveContainerAttributes:Ti,directiveContainerLabel:ty,directiveLeaf:Jg,directiveLeafAttributes:Ti,directiveText:ey,directiveTextAttributes:Ti},exit:{directiveContainer:Mi,directiveContainerAttributeClassValue:Ai,directiveContainerAttributeIdValue:Ci,directiveContainerAttributeName:Ei,directiveContainerAttributeValue:Pi,directiveContainerAttributes:Di,directiveContainerLabel:ny,directiveContainerName:Si,directiveLeaf:Mi,directiveLeafAttributeClassValue:Ai,directiveLeafAttributeIdValue:Ci,directiveLeafAttributeName:Ei,directiveLeafAttributeValue:Pi,directiveLeafAttributes:Di,directiveLeafName:Si,directiveText:Mi,directiveTextAttributeClassValue:Ai,directiveTextAttributeIdValue:Ci,directiveTextAttributeName:Ei,directiveTextAttributeValue:Pi,directiveTextAttributes:Di,directiveTextName:Si}}}function Xg(e){const t=Qg;if(t.quote!=='"'&&t.quote!=="'"&&t.quote!==null&&t.quote!==void 0)throw new Error("Invalid quote `"+t.quote+"`, expected `'` or `\"`");return n.peek=iy,{handlers:{containerDirective:n,leafDirective:n,textDirective:n},unsafe:[{character:"\r",inConstruct:["leafDirectiveLabel","containerDirectiveLabel"]},{character:`
`,inConstruct:["leafDirectiveLabel","containerDirectiveLabel"]},{before:"[^:]",character:":",after:"[A-Za-z]",inConstruct:["phrasing"]},{atBreak:!0,character:":",after:":"}]};function n(r,o,a,c){const l=a.createTracker(c),u=sy(r),f=a.enter(r.type);let h=l.move(u+(r.name||"")),y;if(r.type==="containerDirective"){const p=(r.children||[])[0];y=Fr(p)?p:void 0}else y=r;if(y&&y.children&&y.children.length>0){const p=a.enter("label"),g=`${r.type}Label`,m=a.enter(g);h+=l.move("["),h+=l.move(a.containerPhrasing(y,{...l.current(),before:h,after:"]"})),h+=l.move("]"),m(),p()}if(h+=l.move(i(r,a)),r.type==="containerDirective"){const p=(r.children||[])[0];let g=r;Fr(p)&&(g=Object.assign({},r,{children:r.children.slice(1)})),g&&g.children&&g.children.length>0&&(h+=l.move(`
`),h+=l.move(a.containerFlow(g,l.current()))),h+=l.move(`
`+u)}return f(),h}function i(r,o){const a=r.attributes||{},c=[];let l,u,f,h;for(h in a)if(Kg.call(a,h)&&a[h]!==void 0&&a[h]!==null){const y=String(a[h]);if(h==="id")f=t.preferShortcut!==!1&&Br.test(y)?"#"+y:s("id",y,r,o);else if(h==="class"){const p=y.split(/[\t\n\r ]+/g),g=[],m=[];let w=-1;for(;++w<p.length;)(t.preferShortcut!==!1&&Br.test(p[w])?m:g).push(p[w]);l=g.length>0?s("class",g.join(" "),r,o):"",u=m.length>0?"."+m.join("."):""}else c.push(s(h,y,r,o))}return l&&c.unshift(l),u&&c.unshift(u),f&&c.unshift(f),c.length>0?"{"+c.join(" ")+"}":""}function s(r,o,a,c){if(t.collapseEmptyAttributes!==!1&&!o)return r;if(t.preferUnquoted&&qg.test(o))return r+"="+o;const l=t.quote||c.options.quote||'"',u=l==='"'?"'":'"',f=t.quoteSmart&&Nr(o,l)>Nr(o,u)?u:l,h=a.type==="textDirective"?[f]:[f,`
`,"\r"];return r+"="+f+Gg(o,{subset:h})+f}}function Zg(e){Ys.call(this,"containerDirective",e)}function Jg(e){Ys.call(this,"leafDirective",e)}function ey(e){Ys.call(this,"textDirective",e)}function Ys(e,t){this.enter({type:e,name:"",attributes:{},children:[]},t)}function Si(e){const t=this.stack[this.stack.length-1];Zr(t.type==="containerDirective"||t.type==="leafDirective"||t.type==="textDirective"),t.name=this.sliceSerialize(e)}function ty(e){this.enter({type:"paragraph",data:{directiveLabel:!0},children:[]},e)}function ny(e){this.exit(e)}function Ti(){this.data.directiveAttributes=[],this.buffer()}function Ci(e){this.data.directiveAttributes.push(["id",qs(this.sliceSerialize(e),{attribute:!0})])}function Ai(e){this.data.directiveAttributes.push(["class",qs(this.sliceSerialize(e),{attribute:!0})])}function Pi(e){const t=this.data.directiveAttributes;t[t.length-1][1]=qs(this.sliceSerialize(e),{attribute:!0})}function Ei(e){this.data.directiveAttributes.push([this.sliceSerialize(e),""])}function Di(){const e=this.data.directiveAttributes,t={};let n=-1;for(;++n<e.length;){const s=e[n];s[0]==="class"&&t.class?t.class+=" "+s[1]:t[s[0]]=s[1]}this.data.directiveAttributes=void 0,this.resume();const i=this.stack[this.stack.length-1];Zr(i.type==="containerDirective"||i.type==="leafDirective"||i.type==="textDirective"),i.attributes=t}function Mi(e){this.exit(e)}function iy(){return":"}function Fr(e){return!!(e&&e.type==="paragraph"&&e.data&&e.data.directiveLabel)}function sy(e){let t=0;return e.type==="containerDirective"?(Vc(e,function(n,i){if(n.type==="containerDirective"){let s=i.length,r=0;for(;s--;)i[s].type==="containerDirective"&&r++;r>t&&(t=r)}}),t+=3):e.type==="leafDirective"?t=2:t=1,":".repeat(t)}function Xs(e,t,n,i,s,r,o,a,c,l,u,f,h,y,p){let g,m;return w;function w(C){return e.enter(i),e.enter(s),e.consume(C),e.exit(s),k}function k(C){return C===35?(g=o,v(C)):C===46?(g=a,v(C)):p&&ei(C)?Je(e,k,"whitespace")(C):!p&&rt(C)?on(e,k)(C):C===null||Ae(C)||Mn(C)||On(C)&&C!==45&&C!==95?F(C):(e.enter(r),e.enter(c),e.consume(C),D)}function v(C){const U=g+"Marker";return e.enter(r),e.enter(g),e.enter(U),e.consume(C),e.exit(U),x}function x(C){if(C===null||C===34||C===35||C===39||C===46||C===60||C===61||C===62||C===96||C===125||rt(C))return n(C);const U=g+"Value";return e.enter(U),e.consume(C),T}function T(C){if(C===null||C===34||C===39||C===60||C===61||C===62||C===96)return n(C);if(C===35||C===46||C===125||rt(C)){const U=g+"Value";return e.exit(U),e.exit(g),e.exit(r),k(C)}return e.consume(C),T}function D(C){return C===null||Ae(C)||Mn(C)||On(C)&&C!==45&&C!==46&&C!==58&&C!==95?(e.exit(c),p&&ei(C)?Je(e,S,"whitespace")(C):!p&&rt(C)?on(e,S)(C):S(C)):(e.consume(C),D)}function S(C){return C===61?(e.enter(l),e.consume(C),e.exit(l),P):(e.exit(r),k(C))}function P(C){return C===null||C===60||C===61||C===62||C===96||C===125||p&&Ae(C)?n(C):C===34||C===39?(e.enter(u),e.enter(h),e.consume(C),e.exit(h),m=C,N):p&&ei(C)?Je(e,P,"whitespace")(C):!p&&rt(C)?on(e,P)(C):(e.enter(f),e.enter(y),e.consume(C),m=void 0,E)}function E(C){return C===null||C===34||C===39||C===60||C===61||C===62||C===96?n(C):C===125||rt(C)?(e.exit(y),e.exit(f),e.exit(r),k(C)):(e.consume(C),E)}function N(C){return C===m?(e.enter(h),e.consume(C),e.exit(h),e.exit(u),e.exit(r),O):(e.enter(f),V(C))}function V(C){return C===m?(e.exit(f),N(C)):C===null?n(C):Ae(C)?p?n(C):on(e,V)(C):(e.enter(y),e.consume(C),$)}function $(C){return C===m||C===null||Ae(C)?(e.exit(y),V(C)):(e.consume(C),$)}function O(C){return C===125||rt(C)?k(C):F(C)}function F(C){return C===125?(e.enter(s),e.consume(C),e.exit(s),e.exit(i),t):n(C)}}function Zs(e,t,n,i,s,r,o){let a=0,c=0,l;return u;function u(m){return e.enter(i),e.enter(s),e.consume(m),e.exit(s),f}function f(m){return m===93?(e.enter(s),e.consume(m),e.exit(s),e.exit(i),t):(e.enter(r),h(m))}function h(m){if(m===93&&!c)return g(m);const w=e.enter("chunkText",{_contentTypeTextTrailing:!0,contentType:"text",previous:l});return l&&(l.next=w),l=w,y(m)}function y(m){return m===null||a>999||m===91&&++c>32?n(m):m===93&&!c--?(e.exit("chunkText"),g(m)):Ae(m)?o?n(m):(e.consume(m),e.exit("chunkText"),h):(e.consume(m),m===92?p:y)}function p(m){return m===91||m===92||m===93?(e.consume(m),a++,y):y(m)}function g(m){return e.exit(r),e.enter(s),e.consume(m),e.exit(s),e.exit(i),t}}function Js(e,t,n,i){const s=this;return r;function r(a){return a===null||Ae(a)||On(a)||Mn(a)?n(a):(e.enter(i),e.consume(a),o)}function o(a){return a===null||Ae(a)||Mn(a)||On(a)&&a!==45&&a!==95?(e.exit(i),s.previous===45||s.previous===95?n(a):t(a)):(e.consume(a),o)}}const oy={tokenize:ly,concrete:!0},ry={tokenize:cy,partial:!0},ay={tokenize:uy,partial:!0},yn={tokenize:dy,partial:!0};function ly(e,t,n){const i=this,s=i.events[i.events.length-1],r=s&&s[1].type==="linePrefix"?s[2].sliceSerialize(s[1],!0).length:0;let o=0,a;return c;function c(E){return e.enter("directiveContainer"),e.enter("directiveContainerFence"),e.enter("directiveContainerSequence"),l(E)}function l(E){return E===58?(e.consume(E),o++,l):o<3?n(E):(e.exit("directiveContainerSequence"),Js.call(i,e,u,n,"directiveContainerName")(E))}function u(E){return E===91?e.attempt(ry,f,f)(E):f(E)}function f(E){return E===123?e.attempt(ay,h,h)(E):h(E)}function h(E){return Je(e,y,"whitespace")(E)}function y(E){return e.exit("directiveContainerFence"),E===null?S(E):Ae(E)?i.interrupt?t(E):e.attempt(yn,p,S)(E):n(E)}function p(E){return E===null?S(E):Ae(E)?e.check(yn,v,S)(E):(e.enter("directiveContainerContent"),g(E))}function g(E){return e.attempt({tokenize:P,partial:!0},D,r?Je(e,m,"linePrefix",r+1):m)(E)}function m(E){return E===null?D(E):Ae(E)?e.check(yn,k,D)(E):k(E)}function w(E){if(E===null){const N=e.exit("chunkDocument");return i.parser.lazy[N.start.line]=!1,D(E)}return Ae(E)?e.check(yn,x,T)(E):(e.consume(E),w)}function k(E){const N=e.enter("chunkDocument",{contentType:"document",previous:a});return a&&(a.next=N),a=N,w(E)}function v(E){return e.enter("directiveContainerContent"),g(E)}function x(E){e.consume(E);const N=e.exit("chunkDocument");return i.parser.lazy[N.start.line]=!1,g}function T(E){const N=e.exit("chunkDocument");return i.parser.lazy[N.start.line]=!1,D(E)}function D(E){return e.exit("directiveContainerContent"),S(E)}function S(E){return e.exit("directiveContainer"),t(E)}function P(E,N,V){let $=0;return Je(E,O,"linePrefix",i.parser.constructs.disable.null.includes("codeIndented")?void 0:4);function O(U){return E.enter("directiveContainerFence"),E.enter("directiveContainerSequence"),F(U)}function F(U){return U===58?(E.consume(U),$++,F):$<o?V(U):(E.exit("directiveContainerSequence"),Je(E,C,"whitespace")(U))}function C(U){return U===null||Ae(U)?(E.exit("directiveContainerFence"),N(U)):V(U)}}}function cy(e,t,n){return Zs(e,t,n,"directiveContainerLabel","directiveContainerLabelMarker","directiveContainerLabelString",!0)}function uy(e,t,n){return Xs(e,t,n,"directiveContainerAttributes","directiveContainerAttributesMarker","directiveContainerAttribute","directiveContainerAttributeId","directiveContainerAttributeClass","directiveContainerAttributeName","directiveContainerAttributeInitializerMarker","directiveContainerAttributeValueLiteral","directiveContainerAttributeValue","directiveContainerAttributeValueMarker","directiveContainerAttributeValueData",!0)}function dy(e,t,n){const i=this;return s;function s(o){return e.enter("lineEnding"),e.consume(o),e.exit("lineEnding"),r}function r(o){return i.parser.lazy[i.now().line]?n(o):t(o)}}const hy={tokenize:my},fy={tokenize:gy,partial:!0},py={tokenize:yy,partial:!0};function my(e,t,n){const i=this;return s;function s(u){return e.enter("directiveLeaf"),e.enter("directiveLeafSequence"),e.consume(u),r}function r(u){return u===58?(e.consume(u),e.exit("directiveLeafSequence"),Js.call(i,e,o,n,"directiveLeafName")):n(u)}function o(u){return u===91?e.attempt(fy,a,a)(u):a(u)}function a(u){return u===123?e.attempt(py,c,c)(u):c(u)}function c(u){return Je(e,l,"whitespace")(u)}function l(u){return u===null||Ae(u)?(e.exit("directiveLeaf"),t(u)):n(u)}}function gy(e,t,n){return Zs(e,t,n,"directiveLeafLabel","directiveLeafLabelMarker","directiveLeafLabelString",!0)}function yy(e,t,n){return Xs(e,t,n,"directiveLeafAttributes","directiveLeafAttributesMarker","directiveLeafAttribute","directiveLeafAttributeId","directiveLeafAttributeClass","directiveLeafAttributeName","directiveLeafAttributeInitializerMarker","directiveLeafAttributeValueLiteral","directiveLeafAttributeValue","directiveLeafAttributeValueMarker","directiveLeafAttributeValueData",!0)}const wy={tokenize:ky,previous:vy},by={tokenize:Sy,partial:!0},xy={tokenize:Ty,partial:!0};function vy(e){return e!==58||this.events[this.events.length-1][1].type==="characterEscape"}function ky(e,t,n){const i=this;return s;function s(c){return e.enter("directiveText"),e.enter("directiveTextMarker"),e.consume(c),e.exit("directiveTextMarker"),Js.call(i,e,r,n,"directiveTextName")}function r(c){return c===58?n(c):c===91?e.attempt(by,o,o)(c):o(c)}function o(c){return c===123?e.attempt(xy,a,a)(c):a(c)}function a(c){return e.exit("directiveText"),t(c)}}function Sy(e,t,n){return Zs(e,t,n,"directiveTextLabel","directiveTextLabelMarker","directiveTextLabelString")}function Ty(e,t,n){return Xs(e,t,n,"directiveTextAttributes","directiveTextAttributesMarker","directiveTextAttribute","directiveTextAttributeId","directiveTextAttributeClass","directiveTextAttributeName","directiveTextAttributeInitializerMarker","directiveTextAttributeValueLiteral","directiveTextAttributeValue","directiveTextAttributeValueMarker","directiveTextAttributeValueData")}function Cy(){return{text:{58:wy},flow:{58:[oy,hy]}}}function Ay(){const t=this.data(),n=t.micromarkExtensions||(t.micromarkExtensions=[]),i=t.fromMarkdownExtensions||(t.fromMarkdownExtensions=[]),s=t.toMarkdownExtensions||(t.toMarkdownExtensions=[]);n.push(Cy()),i.push(Yg()),s.push(Xg())}const _r={size:e=>`font-size:${e}`,color:e=>`color:${e}`,bg:e=>`background-color:${e}`,opacity:e=>`opacity:${e}`,nowrap:()=>"white-space:nowrap",center:()=>"text-align:center"},Py=new Set(["center"]),Hr="s",Ey=/^[\w.#%(),\s-]*$/,Dy=new Set(["color","bg"]);function My(e,t=!1,n){const i=[];for(const[s,r]of Object.entries(e??{})){if(!(s in _r)||t&&Py.has(s))continue;let o=(r??"").trim();Dy.has(s)&&(o=n?.[o]??o),!(!Ey.test(o)||/url\s*\(/i.test(o))&&i.push(_r[s](o))}return i.join(";")}const Oy=new Set(["textDirective","leafDirective","containerDirective"]);function Ry(e){const t=Object.entries(e.attributes??{}).map(([n,i])=>i==null||i===""?n:`${n}=${i}`).join(" ");e.type="text",e.value=`:${e.name??""}${t?`{${t}}`:""}`,delete e.data,delete e.children}function pc(e,t){if(Oy.has(e.type)){const n=e.type==="textDirective";if(e.name!==Hr&&!e.children?.length){Ry(e);return}const i=e.name===Hr?My(e.attributes,n,t):"";e.data={...e.data,hName:n?"span":"div",hProperties:i?{style:i,className:"help-styled"}:{}}}for(const n of e.children??[])pc(n,t)}function jy(e={}){return t=>{pc(t,e.colors)}}const Hn={a:({href:e,children:t})=>d.jsx("a",{href:e,target:"_blank",rel:"noreferrer",children:t}),blockquote:({children:e})=>d.jsxs("div",{className:"help-popover-alert",role:"note",children:[d.jsx("span",{className:"help-popover-alert-mark","aria-hidden":"true",children:"!"}),d.jsx("div",{children:e})]})},fs="widget:",mc=e=>e.startsWith(fs)?e:$c(e);function gc(e){return function({src:n,alt:i}){if(n?.startsWith(fs)){const s=n.slice(fs.length),r=s.indexOf(":"),o=r===-1?s:s.slice(0,r),a=r===-1?"":s.slice(r+1);return e?.[o]?.(a)??d.jsx("span",{children:i})}return d.jsx("img",{src:n,alt:i})}}const yc=e=>[Ay,[jy,{colors:e}]];function Wr({children:e,components:t}){const n=bg(),{widgets:i,colors:s,textResolvers:r}=n??{},o=b.useMemo(()=>yc(s),[s]),a=b.useMemo(()=>({...Hn,img:gc(i),...t}),[i,t]),c=b.useMemo(()=>Qs(e,r),[e,r]);return d.jsx(It,{components:a,urlTransform:mc,remarkPlugins:o,children:c})}const Oi=e=>e&&e.trim()?e.trim():void 0;function wc(e){return{"model-description":t=>Oi(e.getClassDescription(t)),"enum-description":t=>Oi(e.getEnumDetail(t)?.description),"category-label":t=>Oi(Yr.find(n=>n.id===t)?.label),edge:t=>t in ie.kinds?`![${ie.kinds[t].label}](widget:edge:${t})`:void 0,"ownership-count":t=>{const n=e.getOwnershipCounts(),i=t.lastIndexOf(".");if(i===-1){const o=n[t];return typeof o=="number"?String(o):void 0}const s=n.byRule.get(t.slice(0,i)),r=t.slice(i+1);return s&&r in s?String(s[r]):void 0},relation:t=>{const n=bc(t);return n?`![${n.left} ${n.right}](widget:relation:${t})`:void 0}}}function bc(e){const[t,n,i]=e.split(":");return t&&t in ie.kinds&&n&&i?{kind:t,left:n,right:i}:void 0}const Ly={edge:e=>e in ie.kinds?d.jsx(Et,{kind:e,width:40,className:"help-inline-widget"}):null,relation:e=>{const t=bc(e);return t?d.jsxs("span",{className:"help-inline-relation",children:[d.jsx("code",{children:t.left}),d.jsx(Et,{kind:t.kind,width:40,className:"help-inline-widget"}),d.jsx("code",{children:t.right})]}):null}},Ny={...Object.fromEntries(Object.entries(ie.kinds).map(([e,t])=>[e,t.color])),entity:He.entity,enum:He.enum,"data-type":He.dataType,variable:He.variable,slot:He.slot,...Object.fromEntries(Jr.flatMap((e,t)=>[[`sibling-${t}`,e.text],[`sibling-${t}-fill`,e.fill]]))},Ri="text-[11px] leading-snug text-gray-500 dark:text-gray-400 mb-2",Iy=`
Of the {{ownership-count:declared}} attributes in the schema that point from one
entity to another,

- **{{ownership-count:forward}} point forward**, from owner to owned — the default, and
- **{{ownership-count:backward}} point backward**, from owned to owner — in two lists:
  - **{{ownership-count:belongs-to-target-backward-by-entity.total}}** whose target is one of
    **{{ownership-count:belongs-to-target-backward-by-entity.owners}} entities** that are only ever belonged to
  - **{{ownership-count:belongs-to-target-backward-by-attribute.total}}** named individually, because their
    targets are owned by some *other* attribute

Each rule below counts the same pairs four ways. Click a count to group them by
it — always **owner → attribute → owned**, so the top row means the owner in
every list.
`.trim();function zr({kind:e,example:t}){const n=ie.kinds[e];return d.jsxs(d.Fragment,{children:[d.jsxs("span",{className:"flex items-center gap-1.5 my-1 ml-4",children:[d.jsx(Et,{kind:e,width:56}),d.jsx("span",{className:"font-medium",style:{color:n.color},children:n.label})]}),t&&d.jsxs("span",{className:"block ml-4 font-mono text-[10px] text-gray-400",children:["e.g. ",t]})]})}const Vy={"own-fwd":Qe.ownFwd,"own-bkwd":Qe.ownBkwd,excluded:void 0},$y=[{glyph:"⇱ roots",what:"Also draw everything on the path up to a root."},{glyph:"LR / TB",what:"Lay the diagram out left-to-right or top-down."},{glyph:"⋙ ⋙⋙ ⌙ ≡",what:"Where converging edges join before their shared arrowhead — near the box, early, at the last corner, or not at all. Temporary, for picking one by eye."},{glyph:"+ − 1:1 ⛶",what:"Zoom in, out, reset, fit to view."}],By=[["0..1","optional, at most one"],["1..1","required, exactly one"],["0..*","optional, any number"],["1..*","required, one or more"]];function Fy({n:e,pivot:t,forward:n,open:i,onClick:s}){const{short:r,long:o}=dg[t],a=`${e} ${o(n)}`;return d.jsxs("button",{onClick:s,"aria-expanded":i,title:i?`Hide these ${a}`:`List these ${a}`,className:`group cursor-pointer rounded px-1 -mx-1 text-[11px]
                 hover:bg-gray-100 dark:hover:bg-slate-700`,children:[d.jsx("span",{className:"text-gray-600 dark:text-gray-300",children:e}),d.jsxs("span",{className:"ml-1 text-gray-500 dark:text-gray-400",children:[" ",r]}),d.jsx("span",{className:`ml-0.5 text-gray-400 group-hover:text-gray-700
                       dark:group-hover:text-gray-200`,children:i?"⌃":"⌄"})]})}const _y=30;function Gt({kind:e}){return d.jsx(Et,{kind:e,width:_y,className:"lt-edge"})}function Hy(e){const t=e.rightAlignLabel?"0":"16px",n=e.levels.map(()=>t).join(" "),i=e.leaf.length>1||e.rightAlignLabel?"max-content 38px max-content":"max-content";return`${n} ${i}`}function Wy(e,t){const n=e.levels.length;if(e.rightAlignLabel)return String(t===0?n+1:n+3);if(t<n)return`${t+1} / -1`;const i=t-n;return String(i===0?n+1:n+3)}function xc({nodes:e,shape:t,forward:n,isOpen:i,onToggle:s,path:r="",classLink:o}){const a=n?"own-fwd":"own-bkwd",c=(l,u)=>u==="srcAttr"?d.jsxs(d.Fragment,{children:[o(l.declaredOn),d.jsxs("span",{children:[".",l.slotName]})]}):u==="attr"?l.slotName:o(u==="source"?l.declaredOn:l.range);return d.jsx(d.Fragment,{children:e.map(l=>{const u=r?`${r}/${l.key}`:l.key,f=i(u),h=r.split("/").filter(Boolean).length,y=t.arrow===`label:${h}`;return d.jsxs("div",{className:"lt-node",...f?{"data-open":"1"}:{},children:[d.jsxs("div",{className:`lt-label${t.rightAlignLabel?" lt-label-right":""}`,children:[d.jsx("button",{className:"lt-toggle",onClick:()=>s(u),"aria-expanded":f,"aria-label":`${f?"Collapse":"Expand"} ${l.key}`,children:f?"▾":"▸"}),y&&t.rightAlignLabel&&d.jsx("span",{className:"lt-arrow",children:d.jsx(Gt,{kind:a})}),t.levels[h]==="entity"?o(l.key):l.key,y&&!t.rightAlignLabel&&d.jsxs("span",{className:"lt-arrow",children:[" ",d.jsx(Gt,{kind:a})]}),l.pairs.length>1&&d.jsx("span",{className:"lt-count",children:l.pairs.length})]}),d.jsx("div",{className:"lt-kids",children:l.children?d.jsx(xc,{nodes:l.children,shape:t,forward:n,isOpen:i,onToggle:s,path:u,classLink:o}):l.pairs.map(p=>d.jsxs("div",{className:"lt-leaf",children:[d.jsxs("span",{className:"lt-c1",children:[c(p,t.leaf[0]),d.jsx("span",{className:"lt-card",children:Xr(p.required,p.multivalued)}),p.isLoop&&d.jsx("span",{className:"lt-card",style:{color:He.entity},children:" loop"})]}),t.leaf.length>1&&d.jsx("span",{className:"lt-arrow",children:d.jsx(Gt,{kind:a})}),t.leaf.length>1&&d.jsx("span",{className:"lt-c2",children:c(p,t.leaf[1])})]},`${p.declaredOn}.${p.slotName}`))})]},u)})})}function zy({dataService:e,onClose:t,onSelect:n,offset:i}){const r=b.useMemo(()=>e.getOwnershipPairGroups(),[e]).filter(p=>p.rule!=="child-following-parent"),o=b.useMemo(()=>Qs(Iy,wc(e)),[e]),[a,c]=b.useState(()=>new Map),[l,u]=b.useState(()=>new Set),f=(p,g,m)=>{const w=a.get(p)===g;c(k=>{const v=new Map(k);return w?v.delete(p):v.set(p,g),v}),u(k=>{const v=new Set([...k].filter(x=>!x.startsWith(`${p}:`)));if(!w&&hg[g]){const x=(T,D)=>{for(const S of T){const P=D?`${D}/${S.key}`:S.key;v.add(`${p}:${g}:${P}`),S.children&&x(S.children,P)}};x(m,"")}return v})},h=(p,g,m)=>u(w=>{const k=new Set(w),v=`${p}:${g}:${m}`;return k.delete(v)||k.add(v),k}),y=p=>d.jsx("button",{onClick:()=>n([p]),className:"cursor-pointer hover:underline text-blue-600 dark:text-blue-400",title:`Select ${p}`,children:p});return d.jsxs(tc,{title:"Legend",subtitle:"What the diagram's arrows, colors and buttons mean.",onClose:t,offset:i,widthRem:Us.legend,children:[d.jsxs("div",{className:"text-xs",children:[d.jsxs(wn,{title:"Arrow direction and ownership",children:[d.jsx("p",{className:Ri,children:"Edges connect entities in ownership (i.e., containment or has-a) relationships. They start at attribute rows that point to other entities and end at the header of the target entity's box."}),d.jsxs("p",{className:Ri,children:["An attribute can target an entity that it ",d.jsx("b",{children:"owns"}),d.jsx(zr,{kind:"own-fwd",example:"Condition.affected_body_site"}),"in which case, B appears to the right of A and the edge points forward."]}),d.jsxs("p",{className:Ri,children:["Or it can target an entity that it ",d.jsx("b",{children:"belongs to"}),d.jsx(zr,{kind:"own-bkwd",example:"Condition.associated_participant"}),"in which case, B appears to the left of A and the edge points backward."]}),d.jsx("div",{className:"help-prose text-[11px] leading-snug text-gray-500 dark:text-gray-400 mb-2",children:d.jsx(Wr,{children:o})}),d.jsx("ul",{className:"space-y-2.5",children:r.map(p=>{const g=`${p.verdict}/${p.rule}`,m=Vy[p.verdict],w=a.get(g),k=p.verdict==="own-fwd";return d.jsxs("li",{className:"border-l-2 pl-2 border-gray-200 dark:border-slate-600",children:[d.jsxs("div",{className:"flex items-baseline gap-1.5",children:[d.jsx("div",{className:m?"font-medium":"font-medium text-gray-400",style:m?{color:m}:void 0,children:p.ruleLabel}),m&&d.jsx(Et,{kind:p.verdict,width:34})]}),d.jsx("div",{className:"flex flex-wrap items-baseline gap-x-1 mt-0.5",children:ug.map((v,x)=>d.jsxs("span",{className:"flex items-baseline",children:[x>0&&d.jsx("span",{className:"text-gray-300 mx-1",children:" — "}),d.jsx(Fy,{n:gg(p.pairs,v),pivot:v,forward:k,open:w===v,onClick:()=>f(g,v,Lr(p.pairs,v,k))})]},v))}),d.jsx("div",{className:"help-prose text-[11px] leading-snug text-gray-600 dark:text-gray-400 mt-0.5",children:d.jsx(Wr,{children:p.ruleText})}),w&&(()=>{const v=ic(w,k),x=p.verdict;return d.jsxs("div",{className:"lt",style:{gridTemplateColumns:Hy(v)},children:[d.jsxs("div",{className:"lt-head",children:[v.headers.map((T,D)=>d.jsxs("div",{className:"lt-h",style:{gridColumn:Wy(v,D)},children:[T,v.arrow===`label:${D}`&&d.jsxs("span",{className:"lt-arrow",children:[" ",d.jsx(Gt,{kind:x})]})]},T)),v.leaf.length>1&&d.jsx("div",{className:"lt-h lt-h-arrow lt-arrow",style:{gridColumn:v.levels.length+2},children:d.jsx(Gt,{kind:x})})]}),d.jsx(xc,{nodes:Lr(p.pairs,w,k),shape:v,forward:k,isOpen:T=>l.has(`${g}:${w}:${T}`),onToggle:T=>h(g,w,T),classLink:y})]})})()]},g)})})]}),d.jsx(wn,{title:"Cardinality",children:d.jsx("ul",{className:"flex flex-wrap gap-x-4 gap-y-1",children:By.map(([p,g])=>d.jsxs("li",{className:"flex items-center gap-1.5",children:[d.jsx("span",{className:"font-mono text-[11px] text-gray-700 dark:text-gray-300",children:p}),d.jsx("span",{className:"text-[11px] text-gray-500 dark:text-gray-400",children:g})]},p))})}),d.jsxs(wn,{title:"Colors",children:[d.jsx(Ur,{caption:"A row's dot and its range label say what KIND of thing the attribute points at.",items:[{color:He.entity,label:"another entity"},{color:He.enum,label:"a value set"},{color:He.dataType,label:"a data type"}]}),d.jsxs("p",{className:"text-[11px] leading-snug text-gray-600 dark:text-gray-400 mt-2",children:["A ",d.jsx("b",{children:"filled"})," dot draws an edge; a ",d.jsx("b",{children:"hollow"})," one does not, because what it points at is not on the canvas. Only entity ranges can draw edges at all."]}),d.jsx(Ur,{className:"mt-3",caption:"Inside a merged box, a color says which entity an attribute belongs to.",items:Jr.slice(0,4).map((p,g)=>({color:p.text,swatch:p.fill,label:g===0?"the parent":`child ${g}`}))})]}),d.jsx(wn,{title:"The toolbar",children:d.jsx("ul",{className:"space-y-1",children:$y.map(p=>d.jsxs("li",{className:"flex gap-2",children:[d.jsx("span",{className:"shrink-0 font-mono text-[11px] text-gray-700 dark:text-gray-300 w-20",children:p.glyph}),d.jsx("span",{className:"text-[11px] leading-snug text-gray-600 dark:text-gray-400",children:p.what})]},p.glyph))})})]}),d.jsxs("p",{className:"text-[10px] text-gray-400 dark:text-gray-500 mt-3",children:["A box's ",d.jsx("b",{children:"“N related”"})," count is of distinct classes"," ",d.jsx("i",{children:"outside"})," it, so selecting a class that folds into a merged box can make the number go ",d.jsx("i",{children:"down"}),". Correct, if counter-intuitive."]})]})}function wn({title:e,children:t}){return d.jsxs("section",{className:"mb-4 last:mb-1",children:[d.jsx("h3",{className:`text-[11px] font-semibold uppercase tracking-wider
                     text-gray-400 dark:text-gray-500 mb-1`,children:e}),t]})}function Ur({caption:e,items:t,className:n}){return d.jsxs("div",{className:n,children:[d.jsx("p",{className:"text-[11px] text-gray-500 dark:text-gray-400 mb-1",children:e}),d.jsx("ul",{className:"flex flex-wrap gap-x-3 gap-y-1",children:t.map(i=>d.jsxs("li",{className:"flex items-center gap-1",children:[d.jsx("span",{className:"inline-block w-3 h-3 rounded-sm border",style:{background:i.swatch??i.color,borderColor:i.color}}),d.jsx("span",{className:"text-[11px]",style:{color:i.color},children:i.label})]},i.label))})]})}const Uy=300,Gy=[{id:"graph-canvas-reading",label:"Reading the diagram"},{id:"relation-bar",label:"The relation bar"},{id:"merged-boxes",label:"Inheritance and merged boxes"},{id:"node-dismiss",label:"Closing a box"},{id:"copy-link",label:"Sharing what you see"}];function Ky({onOpenLegend:e,onOpenCases:t,legendOpen:n,casesOpen:i,onClosePanels:s,anyPanelOpen:r}){const{showEntry:o,showAddresses:a,toggleAddresses:c}=gt(),[l,u]=b.useState(!1),f=b.useRef(void 0),h=()=>{f.current!==void 0&&(clearTimeout(f.current),f.current=void 0)},y=()=>{h(),f.current=setTimeout(()=>u(!1),Uy)};b.useEffect(()=>h,[]),b.useEffect(()=>{if(!l)return;const g=w=>{w.target?.closest("[data-help-menu]")||u(!1)},m=w=>{w.key==="Escape"&&u(!1)};return document.addEventListener("mousedown",g,!0),document.addEventListener("keydown",m),()=>{document.removeEventListener("mousedown",g,!0),document.removeEventListener("keydown",m)}},[l]);const p=g=>()=>{u(!1),g()};return d.jsxs("span",{"data-help-menu":!0,"data-help-id":"help-menu",className:"relative",onMouseEnter:()=>{h(),u(!0)},onMouseLeave:y,children:[d.jsxs("button",{onClick:()=>u(g=>!g),title:"Legend, example cases and help topics",className:`text-sm underline hover:text-white ${l?"text-white":"text-blue-100"}`,children:["Help ",d.jsx("span",{"aria-hidden":!0,className:"opacity-70",children:"▾"})]}),l&&d.jsxs("div",{className:`absolute right-0 top-full mt-1 z-40 w-60 py-1
                     rounded-md border border-gray-300 dark:border-slate-600
                     bg-white dark:bg-slate-800 shadow-xl
                     text-gray-900 dark:text-gray-100`,children:[d.jsxs(bn,{onClick:p(e),children:[n?"Hide ownership legend":"Ownership legend",d.jsx(ji,{children:"every relationship in the schema, by rule"})]}),d.jsxs(bn,{onClick:p(t),children:[i?"Hide example cases":"Example cases",d.jsx(ji,{children:"selections worth looking at"})]}),r&&d.jsxs(bn,{onClick:p(s),children:["Close all panels",d.jsx(ji,{children:"legend, cases and the detail drawer"})]}),d.jsx(Qy,{}),Gy.map(g=>d.jsx(bn,{onClick:p(()=>o(g.id)),children:g.label},g.id)),wg]})]})}function bn({onClick:e,children:t}){return d.jsx("button",{onClick:e,className:`block w-full text-left px-3 py-1.5 text-xs
                 hover:bg-gray-100 dark:hover:bg-slate-700`,children:t})}function ji({children:e}){return d.jsx("span",{className:"block text-[10px] text-gray-400 dark:text-gray-500",children:e})}function Qy(){return d.jsx("div",{className:"my-1 border-t border-gray-200 dark:border-slate-700"})}function Gr(e){const t=new Set;return e.map((n,i)=>({p:n,index:i})).filter(({p:n})=>t.has(n.step)?!1:(t.add(n.step),!0)).map(({p:n,index:i})=>({index:i,step:n.step,title:n.entry.title,beatCount:n.beatCount}))}function vc({scope:e,onClose:t}){const{content:n,tours:i,tourMeta:s,tourName:r,tourIndex:o,positions:a,position:c,goToStep:l,startTour:u}=gt();b.useEffect(()=>{const m=w=>{w.key==="Escape"&&(w.stopPropagation(),w.preventDefault(),t())};return window.addEventListener("keydown",m,!0),()=>window.removeEventListener("keydown",m,!0)},[t]);const f=b.useRef(null);b.useEffect(()=>{const m=f.current;if(!(!m||typeof m.showPopover!="function"))return m.showPopover(),()=>{m.matches(":popover-open")&&m.hidePopover()}},[]);const h=b.useMemo(()=>e==="all"?i.map(m=>({name:m,rows:Gr(hs(n,m))})):[],[e,i,n]),y=c?.step,p=o===null?void 0:r,g=(m,w,k)=>d.jsxs("button",{onClick:k,"aria-current":w?"step":void 0,className:`help-map-step${w?" help-map-step-here":""}`,children:[d.jsx("span",{className:"help-map-num",children:m.step}),d.jsx("span",{className:"help-map-title",children:m.title}),m.beatCount>0&&d.jsx("span",{className:"help-map-beats",title:`${m.beatCount+1} screens in this step`,children:m.beatCount+1})]},m.index);return qr.createPortal(d.jsx("div",{ref:f,popover:"manual",className:"help-map-backdrop",onMouseDown:t,children:d.jsxs("div",{role:"dialog","aria-label":e==="all"?"All tours":"Tour outline",className:"help-map",onMouseDown:m=>m.stopPropagation(),children:[d.jsxs("div",{className:"help-map-head",children:[d.jsxs("div",{children:[d.jsx("h2",{children:e==="all"?"Tours":p??"This tour"}),d.jsx("p",{children:e==="all"?"Every guided walk, and what is in it. Click any step to start there.":"Click any step to jump to it."})]}),d.jsx("button",{onClick:t,title:"Close (Esc)",className:"help-map-close",children:"✕"})]}),d.jsx("div",{className:"help-map-body",children:e==="tour"?Gr(a).map(m=>g(m,m.step===y,()=>{l(m.index),t()})):h.map(({name:m,rows:w})=>d.jsxs("section",{className:"help-map-tour",children:[d.jsx("button",{className:"help-map-tourname",onClick:()=>{u(m),t()},children:m}),s.get(m)?.description&&d.jsx("p",{className:"help-map-blurb",children:s.get(m).description}),w.map(k=>g(k,p===m&&k.step===y,()=>{p===m?l(k.index):u(m,k.index),t()}))]},m))})]})}),document.body)}function qy(){const{tours:e,tourMeta:t,startTour:n}=gt(),[i,s]=b.useState(!1),{overviewOpen:r,setOverviewOpen:o}=gt(),a=b.useRef(null);return b.useEffect(()=>{if(!i)return;const c=u=>{u.target?.closest("[data-tour-chooser]")||s(!1)},l=u=>{u.key==="Escape"&&s(!1)};return document.addEventListener("mousedown",c,!0),document.addEventListener("keydown",l),()=>{document.removeEventListener("mousedown",c,!0),document.removeEventListener("keydown",l)}},[i]),e.length===0?null:d.jsxs("span",{"data-tour-chooser":!0,"data-help-id":"tour-chooser",className:"relative",onMouseEnter:()=>s(!0),children:[d.jsx("button",{onClick:()=>{s(!1),o(!0)},title:"Guided walks through the app and the model; click for the overview",className:`text-sm font-semibold px-2.5 py-1 rounded-full bg-white/95
                   text-blue-700 shadow-sm hover:bg-white hover:shadow`,children:"Guided tours"}),i&&d.jsxs("div",{ref:a,role:"dialog","aria-label":"Guided tours",className:`absolute right-0 top-full mt-1 z-40 w-80 p-1
                     rounded-md border border-gray-300 dark:border-slate-600
                     bg-white dark:bg-slate-800 shadow-xl
                     text-gray-900 dark:text-gray-100`,children:[d.jsxs("p",{className:"px-3 pt-2 pb-1 text-[11px] text-gray-500 dark:text-gray-400",children:["Each one stands on its own. Leave any tour with ",d.jsx("kbd",{children:"Esc"}),"."]}),d.jsxs("button",{"data-tour-overview":!0,onClick:()=>{s(!1),o(!0)},className:`block w-full text-left px-3 py-2 rounded
                       hover:bg-gray-100 dark:hover:bg-slate-700`,children:[d.jsx("span",{className:"block text-xs font-semibold",children:"Overview"}),d.jsxs("span",{className:"block text-[11px] text-gray-500 dark:text-gray-400",children:["All ",e.length," tours and every step in them — start anywhere."]})]}),d.jsx("div",{className:"my-1 border-t border-gray-200 dark:border-slate-700"}),e.map(c=>d.jsxs("button",{onClick:()=>{s(!1),n(c)},className:`block w-full text-left px-3 py-2 rounded
                         hover:bg-gray-100 dark:hover:bg-slate-700`,children:[d.jsx("span",{className:"block text-xs font-semibold",children:c}),t.get(c)?.description&&d.jsx("span",{className:"block text-[11px] text-gray-500 dark:text-gray-400",children:t.get(c).description})]},c))]}),r&&d.jsx(vc,{scope:"all",onClose:()=>o(!1)})]})}const Yy="dmvd.help.showAddresses";function Xy(){const e=document.activeElement;return e instanceof HTMLInputElement||e instanceof HTMLTextAreaElement||e?.getAttribute("contenteditable")==="true"}function Zy(e,t){if(!t)return e;const n=r=>Qs(r,t),i=r=>r===void 0?void 0:n(r),s=new Map([...e.entries].map(([r,o])=>[r,{...o,description:n(o.description),interactions:o.interactions.map(n),action:i(o.action),context:i(o.context),beats:o.beats?.map(a=>({...a,description:i(a.description),action:i(a.action)}))}]));return{sections:e.sections.map(r=>({...r,entries:r.entries.map(o=>s.get(o.id)??o),tourMeta:r.tourMeta&&{...r.tourMeta,description:n(r.tourMeta.description)}})),entries:s,tourMeta:new Map([...e.tourMeta].map(([r,o])=>[r,{...o,description:n(o.description)}]))}}function Jy({markdown:e,onPushChange:t,onPopChange:n,onJumpChanges:i,onTourStart:s,onTourEnd:r,textResolvers:o,widgets:a,colors:c,centerOn:l,children:u}){const[f,h]=b.useState(),y=f??o,p=b.useMemo(()=>Zy(Mg(e),y),[e,y]),[g,m]=b.useState(!1),[w,k]=b.useState(null),[v,x]=b.useState(void 0),[T,D]=b.useState(!1),S=b.useMemo(()=>ds(p),[p]),P=b.useMemo(()=>hs(p,v),[p,v]),E=b.useMemo(()=>hc(p,v).length,[p,v]),[N,V]=b.useState(null),[$,O]=b.useState(()=>!1),F=b.useCallback(()=>{O(Q=>{const q=!Q;try{window.localStorage.setItem(Yy,q?"1":"0")}catch{}return q})},[]),C=b.useCallback(()=>{m(!1),V(null)},[]),U=b.useCallback(()=>V(null),[]),pe=b.useCallback(Q=>V(Q),[]),L=b.useCallback(Q=>{const q=P[Q];q&&(k(Q),V(q.entry.id),q.change!=null&&t&&t(q.change,q.replace))},[P,t]),G=b.useCallback(Q=>{P[Q+1]?.change!=null&&n&&n();const ne=P[Q];ne&&(k(Q),V(ne.entry.id))},[P,n]),j=b.useCallback(Q=>{if(w===null||Q===w)return;const q=P[Q];if(q&&i){if(Q>w){const ne=P.slice(w+1,Q+1).filter(re=>re.change!=null).map(re=>({query:re.change,replace:re.replace}));i(ne,0)}else{const ne=P.slice(Q+1,w+1).filter(re=>re.change!=null).length;i([],ne)}k(Q),V(q.entry.id)}},[w,P,i]),X=b.useCallback((Q=ds(p)[0],q=0)=>{m(!1),x(Q);const ne=hs(p,Q),re=Math.min(Math.max(q,0),Math.max(ne.length-1,0)),ve=ne[re];if(!ve)return;s?.(),k(re),V(ve.entry.id);const Re=ne.slice(0,re+1).filter(Ge=>Ge.change!=null).map(Ge=>({query:Ge.change,replace:Ge.replace}));re>0&&i?i(Re,0):ve.change!=null&&t&&t(ve.change,ve.replace)},[p,t,i,s]),ae=b.useCallback(()=>{k(null),V(null),x(void 0),r?.()},[r]),se=b.useCallback(()=>{w!==null&&(w+1>=P.length?ae():L(w+1))},[w,P.length,L,ae]),Pe=b.useCallback(()=>{w!==null&&w>0&&G(w-1)},[w,G]),Me=b.useCallback(()=>{w!==null&&ae(),V(null)},[w,ae]),me=b.useCallback(Q=>{if(!Q)return null;const{kind:q}=Q;if(q==="none")return null;const{arg:ne}=Q,re=q==="help-id"?ne:`${q}:${ne}`,ve=document.querySelectorAll(`[data-help-id="${CSS.escape(re)}"]`);return ve.length<2?ve[0]??null:[...ve].find(Re=>Re.getBoundingClientRect().height>0)??ve[0]},[]);b.useEffect(()=>(document.body.classList.toggle("help-mode",g),()=>{document.body.classList.remove("help-mode")}),[g]),b.useEffect(()=>{if(g)return window.addEventListener("blur",C),()=>window.removeEventListener("blur",C)},[g,C]),b.useEffect(()=>{if(!g)return;function Q(q){const ne=q.target;if(!ne)return;const re=ne.closest("[data-help-id]");re?(q.stopPropagation(),q.preventDefault(),pe(re.getAttribute("data-help-id"))):ne.closest("[data-help-popover]")||U()}return document.addEventListener("click",Q,!0),()=>document.removeEventListener("click",Q,!0)},[g,pe,U]),b.useEffect(()=>{function Q(q){if(q.key==="?"&&!Xy()){q.preventDefault(),w===null?D(ne=>!ne):ae();return}if(q.key==="Escape"&&(g||w!==null||N)){q.preventDefault(),q.stopPropagation(),N&&w===null?U():w!==null?ae():Me();return}w!==null&&(q.key==="ArrowRight"&&(q.preventDefault(),se()),q.key==="ArrowLeft"&&(q.preventDefault(),Pe()))}return document.addEventListener("keydown",Q,!0),()=>document.removeEventListener("keydown",Q,!0)},[g,w,N,Me,U,ae,se,Pe]);const xe=b.useCallback(()=>l?me(Yn(l,l))?.getBoundingClientRect()??null:null,[l,me]),Oe=b.useMemo(()=>({setTextResolvers:h,helpMode:g,toggleHelpMode:Me,exitHelpMode:C,tourIndex:w,startTour:X,endTour:ae,nextStep:se,prevStep:Pe,goToStep:j,positions:P,position:w===null?void 0:P[w],stepCount:E,tours:S,tourName:v,tourMeta:p.tourMeta,overviewOpen:T,setOverviewOpen:D,...y?{textResolvers:y}:{},...a?{widgets:a}:{},...c?{colors:c}:{},showAddresses:$,toggleAddresses:F,content:p,activeId:N,showEntry:pe,dismissEntry:U,resolveAnchor:me,centerRect:xe}),[g,Me,C,w,X,ae,se,Pe,j,P,E,S,v,T,y,a,c,$,F,p,N,pe,U,me,xe]);return d.jsx(Gs.Provider,{value:Oe,children:u})}function ew(e){try{return localStorage.getItem(e)}catch{return null}}function tw(e,t){try{localStorage.setItem(e,t)}catch{}}const kc="help-once-",Li="data-help-anchor",Ni="data-help-spotlight",nw="--help-spotlight",iw=8,Kr="data-help-hint",sw="--help-hint",ow=40;function rw(e){return e.split(`
`).filter(t=>!/^\s{0,3}>/.test(t)).join(`
`).replace(/\n{3,}/g,`

`).trim()}function aw(e){return ew(kc+e)==="1"}function lw(e){tw(kc+e,"1")}function cw(e){return{...Hn,blockquote:({children:t})=>d.jsxs("div",{className:"help-popover-alert",role:"note",children:[d.jsx("span",{className:"help-popover-alert-mark","aria-hidden":"true",children:"!"}),d.jsxs("div",{children:[t,d.jsxs("label",{className:"help-popover-alert-once",children:[d.jsx("input",{type:"checkbox",onChange:e}),"Don't show this again"]})]})]})}}function uw(){const{helpMode:e,tourIndex:t,position:n,positions:i,stepCount:s,content:r,activeId:o,dismissEntry:a,nextStep:c,prevStep:l,endTour:u,showEntry:f,resolveAnchor:h,centerRect:y,showAddresses:p,tourName:g,tourMeta:m,widgets:w,colors:k}=gt(),v=b.useMemo(()=>yc(k),[k]),x=g===void 0?void 0:m.get(g)?.abbr??g,[T,D]=b.useState(!1),S=t!==null;b.useEffect(()=>{S||D(!1)},[S]);const P=o?r.entries.get(o):void 0,E=ec(),N=h,V=S?n?.anchor:P?.anchor,$=S?n?.spotlight:P?.spotlight,O=(S?n?.highlight:P?.highlight)??"dim",F=()=>{if(!n||n.beatCount===0)return null;const z=n.beatIndex+1;return d.jsx("span",{className:"help-tour-dots",title:`Screen ${z+1} of ${n.beatCount+1} in this step`,children:Array.from({length:n.beatCount},(J,ge)=>d.jsx("span",{className:ge<z?"help-dot help-dot-on":"help-dot"},ge))})},[C,U]=b.useState(!1),[pe,L]=b.useState(0),G=pe>0,[j,X]=b.useState(void 0),[ae,se]=b.useState(!1),Pe=b.useRef(null),[,Me]=b.useState(0),me=P?.once,xe=me!==void 0&&aw(me),Oe=b.useMemo(()=>({...me===void 0?Hn:cw(()=>{lw(me),Me(z=>z+1)}),img:gc(w)}),[me,w]),Q=(S?n?.blocks??[]:[P?.description??""]).map(z=>xe?rw(z):z).filter(Boolean),q=(S?n?.width:void 0)??Math.max(yw(Q.join(`

`)),S?ww():0),ne=b.useRef(!1);b.useEffect(()=>{ne.current=!1},[o,V]);const re=E.reset;b.useEffect(()=>{re()},[o,t,re]),b.useLayoutEffect(()=>{if(!o){U(!1),X(void 0);return}let z=null;const J=()=>{const le=N(V);le!==z&&(z?.removeAttribute(Li),z=le,U(!!le),X(le?.closest("[data-graph-direction]")?.getAttribute("data-graph-direction")==="RIGHT"?"below":void 0),le&&(le.setAttribute(Li,""),ne.current||(ne.current=!0,le.scrollIntoView({block:"center",behavior:"smooth"}))))};J();const ge=new MutationObserver(J);return ge.observe(document.body,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["data-help-id"]}),()=>{ge.disconnect(),z?.removeAttribute(Li),U(!1),X(void 0)}},[o,V,N]),b.useLayoutEffect(()=>{if(!o||!$?.length){L(0);return}let z=[];const J=()=>{const le=$.map(Te=>N(Te)).filter(Te=>!!Te).slice(0,iw);if(!(le.length===z.length&&le.every((Te,qe)=>Te===z[qe]))){for(const Te of z)Te.removeAttribute(Ni);z=le,le.forEach((Te,qe)=>Te.setAttribute(Ni,`${nw}-${qe}`)),L(le.length)}};J();const ge=new MutationObserver(J);return ge.observe(document.body,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["data-help-id"]}),()=>{ge.disconnect();for(const le of z)le.removeAttribute(Ni);L(0)}},[o,$,N]);const ve=600,Re=S&&n?.change!=null&&V!==void 0&&V.kind!=="none",[Ge,st]=b.useState(!1);b.useEffect(()=>{if(!Re){st(!0);return}st(!1);const z=window.setTimeout(()=>st(!0),ve);return()=>window.clearTimeout(z)},[Re,t]);const yt=Ge||C,jt=S?n?.address??"tour":o??"none";b.useEffect(()=>{const z=Pe.current;z&&(P&&yt?z.matches(":popover-open")||z.showPopover():z.matches(":popover-open")&&z.hidePopover())},[P,yt,jt]),b.useEffect(()=>{(!e||S)&&se(!1)},[e,S]);const wt=b.useMemo(()=>e&&!S?[...r.entries.values()].filter(z=>N(z.anchor)).slice(0,ow).map((z,J)=>({id:z.id,title:z.title,name:`${sw}-${J}`})):[],[e,S,r,N]);return b.useLayoutEffect(()=>{const z=wt.map(J=>{const ge=N(r.entries.get(J.id)?.anchor);return ge?.setAttribute(Kr,J.name),ge}).filter(Boolean);return()=>z.forEach(J=>J.removeAttribute(Kr))},[wt,r,N]),d.jsxs(d.Fragment,{children:[(G||C)&&o&&O!=="none"&&(G?Array.from({length:pe},(z,J)=>d.jsx("div",{className:`help-spotlight${O==="ring"?" help-spotlight-ring":""}`,"data-on-spotlight":J},J)):d.jsx("div",{className:`help-spotlight${O==="ring"?" help-spotlight-ring":""}`})),wt.map(({id:z,title:J,name:ge})=>d.jsx("button",{className:"help-hint",title:J??z,style:{positionAnchor:ge},onMouseEnter:()=>{ae||f(z)},onMouseLeave:()=>{ae||a()},onClick:le=>{le.stopPropagation(),se(!0),f(z)},children:"?"},z)),d.jsx("div",{ref:Pe,popover:"manual","data-help-popover":"","data-anchored":C&&!E.offset?"":void 0,className:"help-popover",style:{...bw(C,S?n?.position:void 0,S?n?.offsetX:void 0,q,C?null:y(),j),...E.offset?{positionArea:"none",left:E.offset.left,top:E.offset.top,right:"auto",bottom:"auto",margin:0,transform:"none"}:{}},children:P&&d.jsxs(d.Fragment,{children:[d.jsxs("h4",{className:"help-popover-title",onPointerDown:E.onPointerDown,style:{cursor:E.offset?"grabbing":"grab",userSelect:"none"},title:"Drag to move",children:[S&&x&&d.jsx("span",{className:"help-popover-tour",children:x}),P.title]}),S&&n?.action&&d.jsxs("div",{className:"help-popover-action",children:[d.jsx("span",{className:"help-popover-action-mark","aria-hidden":"true",children:"✓"}),d.jsx("div",{children:d.jsx(It,{children:n.action})})]}),Q.length>0&&d.jsx("div",{className:"help-popover-body",children:Q.map((z,J,ge)=>d.jsx("div",{className:J===ge.length-1?void 0:"help-beat-past",children:d.jsx(It,{components:Oe,urlTransform:mc,remarkPlugins:v,children:z})},J))}),P.interactions.length>0&&d.jsx("ul",{className:"help-popover-interactions",children:P.interactions.map((z,J)=>d.jsx("li",{children:d.jsx(It,{components:Hn,children:z})},J))}),P.shortcut&&d.jsxs("p",{className:"help-popover-shortcut",children:["Shortcut: ",d.jsx("kbd",{children:P.shortcut})]}),P.context&&d.jsx("div",{className:"help-popover-context",children:d.jsx(It,{children:P.context})}),S?d.jsxs("div",{className:"help-tour-nav",children:[d.jsxs("span",{className:"help-tour-count",title:`Position ${t+1} of ${i.length}`,children:[n?.step," / ",s]}),F(),d.jsx("button",{className:"help-tour-map-btn",onClick:()=>D(z=>!z),"aria-expanded":T,title:"Show the tour outline",children:"⊞"}),d.jsx("span",{className:"help-tour-spacer"}),d.jsx("button",{onClick:l,disabled:t===0,title:"Previous (← arrow key)",children:"← back"}),d.jsx("button",{onClick:c,className:"help-tour-next",title:"Next (→ arrow key)",children:t+1===i.length?"done":"next →"}),d.jsx("button",{onClick:u,title:"End the tour and undo what it added (Esc)",children:"✕"})]}):d.jsxs("div",{className:"help-tour-nav",children:[d.jsx("span",{className:"help-tour-spacer"}),d.jsx("button",{onClick:()=>{se(!1),a()},children:"close"})]}),p&&d.jsx(dw,{address:S?n?.address:P.id,searchFor:S?n?.searchFor:`### ${P.id}`})]})},jt),T&&S&&d.jsx(vc,{scope:"tour",onClose:()=>D(!1)})]})}function dw({address:e,searchFor:t}){const[n,i]=b.useState(!1);return b.useEffect(()=>{if(!n)return;const s=setTimeout(()=>i(!1),1200);return()=>clearTimeout(s)},[n]),!e||!t?null:d.jsxs("button",{type:"button",className:"help-popover-address",title:`Copy “${t}” — search help-content.md for it`,onClick:()=>{navigator.clipboard?.writeText(t).then(()=>i(!0),()=>{})},children:[e,n?" ✓":""]})}const Sc=320,hw=320,fw=800,pw=8,mw=24,gw=3;function yw(e){const t=e.trim().length;return t===0?Sc:Math.round(Math.min(fw,Math.max(hw,Math.sqrt(t*pw*mw*gw))))}function ww(){return 393}function bw(e,t,n,i,s,r){const o=window.innerWidth,a=window.innerHeight,c=Math.min(i??Sc,o-16);if(!e){const u=s??new DOMRect(0,0,o,a),f=u.left+u.width/2;return{left:Math.max(8,Math.min(f-c/2,o-c-8)),top:"50%",transform:"translateY(-50%)",maxHeight:`${a-16}px`,width:c}}return{positionArea:t?{right:"inline-end span-block-end",left:"inline-start span-block-end",top:"block-start span-inline-end",bottom:"block-end span-inline-end"}[t]:r==="below"?"block-end span-inline-end":"inline-end span-block-end",width:c,...xw(n)}}function xw(e){return e?{marginLeft:"px"in e?`${e.px}px`:`calc(anchor-size(${e.of}) * ${e.times})`}:{}}const vw=`# BDCHM Explorer help

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
- **TourAbbr:** BDCHM Data Categories
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
- **Width:** 500
- **Description:** 
  BioData Catalyst ([BDC](https://biodatacatalyst.nhlbi.nih.gov/)) is a cloud-based ecosystem where researchers can find and work
  with [NHLBI](https://www.nhlbi.nih.gov/) data resources. **BDCHM** currently harmonizes nine priority [TOPMed](https://topmed.nhlbi.nih.gov/)
  cohorts (e.g., the Framingham Heart Study and Women's Health Initiative)
  and the [INCLUDE Data Hub](https://portal.includedcc.org/), with more on their way.

### model-categories

- **Title:** Categories of data in the model
- **Tour:** The BioData Catalyst Harmonized Model
- Only: panels=0
- **Anchor:** selection-tree
-  **Position:** right
- **OffsetX:** anchor.width * .3
- **Highlight:** selection-tree
- **Width:** 500
- **Description:** 
  What's in the model?

  The BDCHM schema provides a flexible, general purpose structure
  for storing clinical trials data. BDCHM Explorer categorizes the
  entities specified in the model into six areas to make it easier
  to browse and comprehend. This tour will walk you through each
  category.


### admin-study

- **Title:** 1. Admin / Study
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

- **Title:** 2. Clinical
- **Tour:** The BioData Catalyst Harmonized Model
- **Description:**
  Eight entities record *what happened to a participant medically*. Every one of
  them is a record **of** someone, usually **at** an encounter — which is why Person,
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

- **Title:** 3. Observations / Measurements
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

- **Title:** 4. Laboratory / Biospecimen
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

- **Title:** 5. Survey / Questionnaire
- **Tour:** The BioData Catalyst Harmonized Model
- **Description:**
  This section contains the defining data for surveys
- **Anchor:** category-row:survey
- Only: 
<!-- - **Action:** Drew the whole Survey / Questionnaire category, the same as pressing its ⊞ button. -->
- Beats:
  1. Questionnaire
     - Keep: true
     - Only: cat=survey
     - Description:
       - **Questionnaire** — the title, description, etc.
       - **QuestionnaireItem** — sections, subsections, question text
     - Anchor: node-box:Questionnaire
  1. Questionnaire
     - Keep: true
     - Description:
       and the responses: 
       - **QuestionnaireResponse** — a holder for answers and pointer to the visit
         where the survey was administered
       - **QuestionnaireResponseItem** — a pointer to the QuestionnaireItem definition
       - **QuestionnairResponseValue** — the respondent's answers.
     - Anchor: node-box:Questionnaire
  1. Questionnaire
     - Description:
       ##### Questionnaire
       *{{model-description:Questionnaire}}*
     - Anchor: node-box:Questionnaire
     - Only: cat=survey
  2. QuestionnaireItem
     - Description:
       ##### QuestionnaireItem
       *{{model-description:QuestionnaireItem}}*

       Using \`part_of\`, QuestionnaireItems can serve as sections to
       hold other sections or specific items.
     - Anchor: node-box:QuestionnaireItem
  3. QuestionnaireResponse
     - Description:
       ##### QuestionnaireResponse
       *{{model-description:QuestionnaireResponse}}*
     - Anchor: node-box:QuestionnaireResponse
  4. QuestionnaireResponseItem
     - Description:
       ##### QuestionnaireResponseItem
       *{{model-description:QuestionnaireResponseItem}}*
     - Anchor: node-box:QuestionnaireResponseItem
  5. the typed values
     - Description:
       ##### One answer, five types
       *{{model-description:QuestionnaireResponseValue}}*
     - Anchor: node-box:QuestionnaireResponseValue
  6. SdhohObservations
     - Change: sel=SdohObservation
     - Spotlight: child-header:SdohObservation, node-box:Participant, node-box:QuestionnaireResponse
     - Highlight: ring
     - Anchor: node-box:QuestionnaireItem
     - Description:
       Social Determinants of Health observations can be tied
       to QuestionnaireItems
  6. Visit connection
     - Change: sel=Visit~Participant
     - Anchor: node-box:QuestionnaireResponse
     - Spotlight: node-box:Visit, node-box:QuestionnaireItem
     - Highlight: ring
     - Description:
       Responses must be attached to Participants through **Visits**

### other-files

- **Title:** 6. Files / Other
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



<!--
### linkml-context
- ~~**Title:** BDCHM Explorer:~~
- **Tour:** Getting oriented
- **Description:** <!-- redundant with \`why\` above. fix: figure out what goes where-- >
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
  -- >
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
-->

### bdchm-entities

- **Title:** Using the BDCHM Explorer
- **Tour:** Getting oriented
- Only: panels=0
- **Anchor:** none
- **Highlight:** selection-tree
- **Width:** 800
- **Description:**
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

The induced pass (\`child-following-parent\`) is deliberately NOT a step here,
and is not in the legend either: induced edges serve LAYOUT only, so there is
nothing for a reader to do with them. Documented for maintainers in
OWNERSHIP_CLASSIFICATION.md.

Every count below is LIVE — an \`ownership-count\` placeholder, resolved against
the classifier at render — and the rule names are the legend's own \`label\`
strings from \`OWNERSHIP_RULES\`, so tour, legend and classifier say one thing.
If a label changes there, change it here. Do not hand-type a count.
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
  **:s[Owns target / forward arrow / by default]{color=own-fwd}** —
  {{ownership-count:owns-target-forward-by-default.total}} attributes, and the
  default for every one of them.

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

- **Title:** Exception: entities that are only ever referred to
- **Tour:** Ownership
- **Only:** sel=Participant~Specimen&legend=0
- **Action:** Drew Specimen and the Participant it came from.
- **Anchor:** node-box:Participant
- **Spotlight:** slot-row:Specimen.source_participant
- Highlight: ring
- Position: bottom
- **Width:** 580
- **Description:**
  **:s[Belongs to target / backward arrow / by entity]{color=own-bkwd}** —
  {{ownership-count:belongs-to-target-backward-by-entity.total}} attributes.

  {{ownership-count:belongs-to-target-backward-by-entity.owners}} entities in
  this model are **only ever referred to**, never contained: **Participant**,
  **Visit**, **Organization**, **ImagingStudy** and **Person**. Each exists in
  its own right and is looked up, not held, so *every* attribute pointing at
  one means belonging to it.
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
       Participant once and every attribute pointing at it flips, including
       ones nobody has written yet.

       The schema can't tell us which entities these are — nothing in it
       distinguishes them — so the list is recorded in the Explorer by hand,
       and it is a judgement that can be argued with.

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
  {{ownership-count:belongs-to-target-backward-by-attribute.total}} attributes,
  named one at a time.

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
       putting it on the previous step's list would strip it of that. The same
       holds for **ResearchStudy**, owned by \`ResearchStudyCollection.entries\`.

       Being referred to is a property of the **arrival**, not of the entity:
       one attribute owns a QuestionnaireItem and three others only refer to
       it. That is why the previous step's list can only hold entities *every*
       arrival at which is a reference, and why these have to be named one
       attribute at a time.
     - Anchor: node-box:Questionnaire
     - Spotlight: slot-row:Questionnaire.items
  2. named as pairs
     - Description:
       They are named as \`Entity.attribute\` pairs rather than by attribute
       name alone: two of them are called \`part_of\`, declared on different
       entities, and a bare attribute name would flip any future third one
       silently.

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
  - Except when that entity is one of the
    {{ownership-count:belongs-to-target-backward-by-entity.owners}} that are
    **only ever referred to**, and then the attribute's own entity
    :s[belongs to]{color=own-bkwd} it instead.
  - Except when the attribute is one of the
    {{ownership-count:belongs-to-target-backward-by-attribute.total}} named
    **back-pointers**, which point at an owner rather than down at something
    owned.

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
<summary><b>Inheritance</b></summary>

## Inheritance
- **TourMetadata:**
- **Description:** Subclasses, and the boxes that hold several entities at once

### one-child

- **Title:** An entity and its parent class, one box
- **Tour:** Inheritance
- **Only:** panels=0
- **Action:** Cleared the canvas.
- **Anchor:** entity-row:MeasurementObservation
- **Width:** 420
- **Description:**
  Start from the panel, with nothing drawn. **MeasurementObservation** is the
  entity we are about to tick — watch what the box it draws is called.
- **Beats:**
  1. the box that appears
     - Change: sel=MeasurementObservation
     - Action: Ticked MeasurementObservation for you.
     - Anchor: node-box:Observation
     - Width: 560
     - Description:
       You asked for MeasurementObservation and the box is titled
       **Observation**. MeasurementObservation is a subclass — an Observation
       with a few extra attributes — and the Explorer draws a subclass INSIDE
       its parent's box rather than as a second box joined by a line. The
       \`⑃ 1\` in the header says one subclass is merged in.
  2. inherited rows
     - Description:
       ##### What it inherits
       The bold rows at the top are Observation's: the four \`value_\`
       attributes, who performed it, the participant and the visit.
       MeasurementObservation has all of them.
     - Anchor: slot-row:Observation.associated_participant
  3. the child's header
     - Description:
       ##### What it adds
       Below them a coloured header names the subclass, and the rows under
       it are the ones it adds: a normal range, a body site, the instrument.
       Everything under this header is MeasurementObservation's alone.
     - Anchor: child-header:MeasurementObservation
  4. one is enough
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
`,eo={inTour:!1,held:[],tempHeld:[],tour:[],region:0,tourStates:[],scalars:{}},kw="~";function Qr(e,t){return e&&t.includes(e)?e:null}function Tc(e,t=!1){const n=new URLSearchParams(e),i={};if(n.get("panels")==="0"){for(const c of Hl)i[c]=!1;i.detail=null}n.has("detail")&&(i.detail=n.get("detail")||null),n.has("roots")&&(i.roots=n.get("roots")==="1"),n.has("sibs")&&(i.sibs=n.get("sibs")==="1"),n.has("legend")&&(i.legend=n.get("legend")==="1"),n.has("cases")&&(i.cases=n.get("cases")==="1");const s=Qr(n.get("dir"),["RIGHT","DOWN"]);s&&(i.dir=s);const r=Qr(n.get("merge"),["near","far","bend","off"]);r&&(i.merge=r);const o=n.get("sel"),a=o?o.split(kw).filter(Boolean):Wl(n);return t?{sel:a,scalars:i,replace:!0}:{sel:a,scalars:i}}function Kt(e,t){return[...new Set([...e,...t])]}function Sw(e){return{...eo,inTour:!0,held:[...e]}}function Tw(){return eo}function Cw(e){return Kt(e.held,e.tempHeld)}function Cc(e,t){const n=t.replace?e.region+1:e.region,i=t.replace?[...t.sel]:Kt(e.tour,t.sel),s={...e.scalars,...t.scalars};return{...e,tour:i,region:n,scalars:s,tourStates:[...e.tourStates,{sel:i,scalars:s,region:n}]}}function Ac(e){if(e.tourStates.length===0)return e;const t=e.tourStates.slice(0,-1),n=t[t.length-1];return{...e,tourStates:t,tour:n?n.sel:[],region:n?n.region:0}}function to(e){return e.region>0}function Aw(e,t){if(!e.inTour)return e;const n=to(e)?"tempHeld":"held";return e[n].includes(t)?e:{...e,[n]:[...e[n],t]}}function Pw(e,t){if(!e.inTour)return e;const n=i=>i.filter(s=>s!==t);return{...e,tour:n(e.tour),tempHeld:n(e.tempHeld),held:to(e)?e.held:n(e.held)}}function no(e,t){if(!t.inTour)return e;const n=to(t)?Kt(t.tour,t.tempHeld):Kt(Kt(t.tour,t.tempHeld),t.held);return{...e,...t.scalars,sel:n}}function Ew(){const{modelData:e,loading:t,error:n}=Bc(),i=b.useMemo(()=>e?new Fc(e):null,[e]),{setTextResolvers:s}=gt(),r=b.useMemo(()=>i?wc(i):void 0,[i]);b.useEffect(()=>s(r),[r,s]);const o=b.useMemo(()=>We(),[]),[a,c]=b.useState(()=>new Set(o.sel)),[l,u]=b.useState(o.detail),[f,h]=b.useState(!1),y=b.useRef(!1),[p,g]=b.useState(o.roots),[m,w]=b.useState(o.sibs),[k,v]=b.useState(o.dir),[x,T]=b.useState(o.merge),[D,S]=b.useState(o.cases),[P,E]=b.useState(o.legend),[N,V]=b.useState(!1),$=b.useCallback(L=>{c(new Set(L.sel)),g(!!L.roots),u(null)},[]);b.useEffect(()=>{const L=()=>{const G=We();c(new Set(G.sel)),u(G.detail),g(G.roots),w(G.sibs),v(G.dir),T(G.merge),E(G.legend),S(G.cases)};return window.addEventListener("popstate",L),window.addEventListener("explore:state-from-url",L),()=>{window.removeEventListener("popstate",L),window.removeEventListener("explore:state-from-url",L)}},[]),b.useEffect(()=>{const L={sel:[...a],detail:l,roots:p,sibs:m,dir:k,merge:x,legend:P,cases:D},G=y.current;y.current=!1,zl(L,{push:G})},[a,l,p,m,k,x,P,D]);const O=b.useCallback(L=>{vt(L,!We().sel.includes(L)),c(G=>{const j=new Set(G);return j.has(L)?j.delete(L):j.add(L),j})},[]),F=b.useCallback(L=>{vt(L,!0),c(G=>G.has(L)?G:new Set(G).add(L))},[]),C=b.useCallback(L=>{vt(L,!1),c(G=>{if(!G.has(L))return G;const j=new Set(G);return j.delete(L),j})},[]),U=b.useCallback(L=>{c(j=>j.size===L.length&&L.every(X=>j.has(X))?j:(y.current=!0,new Set(L)));const G=new Set(L);for(const j of We().sel)G.has(j)||vt(j,!1);for(const j of L)vt(j,!0)},[]),pe=b.useCallback(()=>{for(const L of We().sel)vt(L,!1);c(new Set),u(null),h(!1),g(!1),E(!1),S(!1)},[]);return n?d.jsxs("div",{className:"p-8 text-red-600",children:["Failed to load model data: ",String(n)]}):t||!i?d.jsx("div",{className:"p-8 text-gray-400",children:"Loading model…"}):d.jsxs("div",{className:"relative flex flex-col h-screen bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100",children:[d.jsxs("header",{className:"flex items-center justify-between px-4 py-2 bg-blue-600 text-white shrink-0",children:[d.jsxs("div",{children:[d.jsx("h1",{"data-help-id":"app-title",className:"text-lg font-bold leading-tight cursor-pointer hover:opacity-80 transition-opacity",onClick:pe,title:"Click to clear the selection and reset the view",children:"BDCHM Explorer"}),d.jsx("p",{className:"text-xs text-blue-100",children:"BioData Catalyst Harmonized Model"})]}),d.jsxs("div",{className:"flex items-center gap-4",children:[d.jsx(Nw,{}),d.jsx(qy,{}),d.jsx(Ky,{onOpenLegend:()=>E(L=>!L),onOpenCases:()=>S(L=>!L),legendOpen:P,casesOpen:D,anyPanelOpen:P||D||l!==null,onClosePanels:()=>{E(!1),S(!1),u(null)}}),d.jsx("button",{onClick:async()=>{const L=$m({sel:[...a],detail:l,roots:p,sibs:m,dir:k,merge:x,legend:P,cases:D});try{await navigator.clipboard.writeText(L),V(!0),window.setTimeout(()=>V(!1),1500)}catch{V(!1),window.prompt("Copy this link:",L)}},"data-help-id":"copy-link",className:"text-sm underline text-blue-100 hover:text-white",title:"Copy a link that reproduces exactly this view, settings included",children:N?"✓ copied":"copy link"}),d.jsx("a",{href:"/dynamic-model-var-docs/previous.html",className:"text-sm underline text-blue-100 hover:text-white",children:"previous views"}),d.jsx("a",{href:"https://github.com/Sigfried/dynamic-model-var-docs",target:"_blank",rel:"noopener noreferrer",className:"text-blue-100 hover:text-white",title:"Source code on GitHub","aria-label":"Source code on GitHub",children:d.jsx("svg",{viewBox:"0 0 16 16",width:"18",height:"18",fill:"currentColor","aria-hidden":!0,children:d.jsx("path",{d:"M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"})})})]})]}),P&&d.jsx(zy,{onClose:()=>E(!1),onSelect:L=>L.forEach(F),dataService:i}),D&&d.jsx(cg,{onClose:()=>S(!1),onApply:$,selectedIds:a,dataService:i,offset:P}),d.jsxs("div",{className:"flex-1 flex min-h-0",children:[f?d.jsxs("button",{onClick:()=>h(!1),title:"Show entity selection",className:`shrink-0 w-8 border-r border-gray-200 dark:border-slate-700
                       bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700
                       flex flex-col items-center gap-2 py-2 text-gray-400`,children:[d.jsx("span",{className:"text-xs",children:"▶"}),d.jsxs("span",{className:"text-[10px] uppercase tracking-wider [writing-mode:vertical-rl]",children:[i.getConceptLabel("entity",!0),a.size>0?` (${a.size})`:""]})]}):d.jsxs("div",{className:"w-80 shrink-0 flex flex-col min-h-0 border-r border-gray-200 dark:border-slate-700",children:[d.jsx("div",{className:"flex-1 overflow-y-auto min-h-0","data-help-id":"selection-tree",children:d.jsx(Yc,{dataService:i,selectedIds:a,onToggle:O,onShowCategory:U})}),d.jsx("button",{onClick:()=>h(!0),title:"Hide entity selection",className:`shrink-0 px-3 py-1 text-xs text-gray-400 border-t border-gray-200
                         dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 text-left`,children:"◀ Hide"})]}),d.jsx("div",{className:"flex-1 min-w-0","data-help-id":"graph-canvas",children:a.size===0?d.jsx("div",{className:"h-full flex items-center justify-center text-sm text-gray-400 p-8",children:"Select entities on the left to build the ownership subgraph."}):d.jsx(tg,{dataService:i,selectedIds:a,onNodeClick:u,onAdd:F,onRemove:C,pathToRoot:p,onTogglePathToRoot:()=>g(L=>!L),direction:k,setDirection:v,mergeMode:x,setMergeMode:T,mergeSibs:m,setMergeSibs:w})}),l&&d.jsx(ng,{classId:l,dataService:i,onClose:()=>u(null),onNavigate:u,isSelected:a.has(l),onToggleSelect:O})]})]})}let fe=eo;function vt(e,t){fe=t?Aw(fe,e):Pw(fe,e)}function Zn(e){zl(e),window.dispatchEvent(new Event("explore:state-from-url"))}function Dw(){fe=Sw(We().sel)}function Mw(){if(!fe.inTour)return;const e=Cw(fe),t=We();fe=Tw(),Zn({...t,sel:e})}function Ow(e,t=!1){fe=Cc(fe,Tc(e,t)),Zn(no(We(),fe))}function Rw(){fe=Ac(fe),Zn(no(We(),fe))}function jw(e,t){for(let n=0;n<t;n++)fe=Ac(fe);for(const n of e)fe=Cc(fe,Tc(n.query,n.replace));Zn(no(We(),fe))}function Lw(){return d.jsxs(Jy,{markdown:vw,widgets:Ly,colors:Ny,onPushChange:Ow,onPopChange:Rw,onJumpChanges:jw,onTourStart:Dw,onTourEnd:Mw,children:[d.jsx(Ew,{}),d.jsx(uw,{})]})}function Nw(){const{helpMode:e,toggleHelpMode:t,startTour:n}=gt();return b.useEffect(()=>{Nm()&&n()},[]),d.jsx("span",{className:"flex items-center gap-2","data-help-id":"help-button",children:yg})}_c.createRoot(document.getElementById("root")).render(d.jsx(b.StrictMode,{children:d.jsx(Lw,{})}));
