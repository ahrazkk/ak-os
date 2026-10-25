/* core: utilities, design-lab settings, theme tokens, visibility polling, frame loop */
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const root=document.documentElement,RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const C={};let DARK=false,MONO='"Geist Mono", ui-monospace, monospace',SANS='Geist, "Helvetica Neue", Arial, sans-serif',F10='500 10px '+MONO,F95='500 9.5px '+MONO;
const rnd=(a,b)=>a+Math.random()*(b-a),clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v)),lerp=(a,b,t)=>a+(b-a)*t;
const eio=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2,eo=t=>1-Math.pow(1-t,3);
function mulberry(a){return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function hex2rgb(c){c=(c||'#000').trim();if(c[0]==='#'){let h=c.slice(1);if(h.length===3)h=[...h].map(v=>v+v).join('');const n=parseInt(h.slice(0,6),16);return[(n>>16&255)/255,(n>>8&255)/255,(n&255)/255];}const m=c.match(/[\d.]+/g);return m&&m.length>2?[m[0]/255,m[1]/255,m[2]/255]:[0,0,0];}
function A(c,a){const[r,g,b]=hex2rgb(c);return `rgba(${Math.round(r*255)},${Math.round(g*255)},${Math.round(b*255)},${a})`;}
function F(x,f,c){x.font=f;x.fillStyle=c;}
function hexP(x,cx,cy,r){x.beginPath();for(let i=0;i<6;i++){const a=Math.PI/6+i*Math.PI/3;x[i?'lineTo':'moveTo'](cx+Math.cos(a)*r,cy+Math.sin(a)*r);}x.closePath();}
function arrow(x,x1,y1,x2,y2,s,col){const a=Math.atan2(y2-y1,x2-x1);x.fillStyle=col;x.beginPath();x.moveTo(x2,y2);x.lineTo(x2-Math.cos(a-.45)*s,y2-Math.sin(a-.45)*s);x.lineTo(x2-Math.cos(a+.45)*s,y2-Math.sin(a+.45)*s);x.closePath();x.fill();}
function rrect(x,X,Y,W,H,r){x.beginPath();x.moveTo(X+r,Y);x.lineTo(X+W-r,Y);x.arc(X+W-r,Y+r,r,-Math.PI/2,Math.PI/2);x.lineTo(X+r,Y+H);x.arc(X+r,Y+r,r,Math.PI/2,Math.PI*1.5);x.closePath();}
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(t._h);t._h=setTimeout(()=>t.classList.remove('show'),3800);}

/* ---------- design lab settings ---------- */
const DEF={theme:'auto',accent:'mono',accentCustom:'#2F6BFF',dFont:'Michroma',uiFont:'Geist Mono',bodyFont:'Geist',liqColor:'auto',liqStyle:'flat',magnet:1,spikes:1,pull:1,drops:24,intro:'on',tlStyle:'flow',corners:'chamfer',grid:'on',gridSize:48,width:'wide'};
let SET=Object.assign({},DEF);try{Object.assign(SET,JSON.parse(localStorage.getItem('akos3')||'{}'));}catch(e){}
function saveSet(){try{localStorage.setItem('akos3',JSON.stringify(SET));}catch(e){}}
const DFONTS=[['Michroma',400,1],['Syncopate',700],['Orbitron',700],['Unbounded',600],['Audiowide',400,1],['Oxanium',700],['Chakra Petch',600],['Bebas Neue',400,1],['Major Mono Display',400,1],['Space Grotesk',600],['Geist',600]];
const MFONTS=[['Geist Mono','400;500'],['JetBrains Mono','400;500'],['IBM Plex Mono','400;500'],['Space Mono','400;700']];
const BFONTS=[['Geist','400;500;600'],['IBM Plex Sans','400;500;600'],['Manrope','400;500;600']];
const WIDTHS={standard:'1320px',wide:'1680px',ultra:'2200px',full:'100%'};
const FONTLINKED=new Set(['Michroma','Geist','Geist Mono']);
function fontLink(fam,wts){if(FONTLINKED.has(fam))return;FONTLINKED.add(fam);const l=document.createElement('link');l.rel='stylesheet';l.href='https://fonts.googleapis.com/css2?family='+fam.replace(/ /g,'+')+(wts?':wght@'+wts:'')+'&display=swap';document.head.append(l);}
function loadFont(fam,w,wts){fontLink(fam,wts);return Promise.race([document.fonts.load(`${w} 64px "${fam}"`),new Promise(r=>setTimeout(r,3000))]).catch(()=>{});}
function applySet(k){const s=SET;
  if(s.accent==='custom'){root.setAttribute('data-accent','custom');root.style.setProperty('--acc',s.accentCustom);const[r,g,b]=hex2rgb(s.accentCustom),lum=.2126*r+.7152*g+.0722*b;root.style.setProperty('--on-acc',lum>.5?'#111214':'#FFFFFF');root.style.setProperty('--acc-text',`color-mix(in oklab, ${s.accentCustom} 72%, var(--ink))`);}
  else{['--acc','--on-acc','--acc-text'].forEach(v=>root.style.removeProperty(v));if(s.accent==='mono')root.removeAttribute('data-accent');else root.setAttribute('data-accent',s.accent);}
  const df=DFONTS.find(f=>f[0]===s.dFont)||DFONTS[0],mf=MFONTS.find(f=>f[0]===s.uiFont)||MFONTS[0],bf=BFONTS.find(f=>f[0]===s.bodyFont)||BFONTS[0];
  root.style.setProperty('--f-display',`"${df[0]}", "Michroma", "Arial Black", sans-serif`);root.style.setProperty('--f-display-w',String(df[1]));
  MONO=`"${mf[0]}", "Geist Mono", ui-monospace, monospace`;SANS=`"${bf[0]}", Geist, "Helvetica Neue", Arial, sans-serif`;F10='500 10px '+MONO;F95='500 9.5px '+MONO;
  root.style.setProperty('--f-mono',MONO);root.style.setProperty('--f-body',SANS);
  root.dataset.corners=s.corners;root.dataset.grid=s.grid;root.style.setProperty('--grid-size',s.gridSize+'px');root.style.setProperty('--maxw',WIDTHS[s.width]||WIDTHS.wide);
  root.classList.toggle('tl-line',s.tlStyle==='line');
  readC();
  const fl=[loadFont(df[0],df[1],df[2]?'':String(df[1])),loadFont(mf[0],400,mf[1]),loadFont(bf[0],400,bf[1])];
  if(k==='dFont'||k==='drops'||k==='reset'||k==='init')Promise.all(fl).then(()=>{if(typeof heroLayout==='function')heroLayout();});}
function readC(){const cs=getComputedStyle(root);for(const k of['bg','panel','panel-2','ink','mut','faint','line','line-soft','sig','boot','acc'])C[k]=cs.getPropertyValue('--'+k).trim();DARK=hex2rgb(C.bg)[0]<.3;if(RM)setTimeout(()=>{if(typeof staticAll==='function')staticAll();},0);}
function liqRGB(){const s=SET.liqColor;if(s==='white')return[1,1,1];if(s==='ink')return hex2rgb(C.ink);if(s==='accent')return hex2rgb(C.acc);if(s==='silver')return[.78,.8,.84];return DARK?[1,1,1]:hex2rgb(C.ink);}
function liqMat(){return SET.liqStyle==='flat'?[0,0]:SET.liqStyle==='chrome'?[1,1]:[1,0];}

/* ---------- visibility polling + frame loop ---------- */
const live=[],FRAMERS=[],VISREG=new Set();
function regVis(el,o){VISREG.add({el,o});}
function visTick(){const vh=innerHeight;for(const r of VISREG){if(r.o.dead){VISREG.delete(r);continue;}const b=r.el.getBoundingClientRect();r.o.vis=b.width>0&&b.bottom>-140&&b.top<vh+140;}}
setInterval(visTick,200);addEventListener('scroll',visTick,{passive:true});addEventListener('resize',visTick);
function loop(t){for(const f of FRAMERS)f(t);for(let i=live.length-1;i>=0;i--){const o=live[i];if(o.dead){live.splice(i,1);continue;}o.frame(t);}requestAnimationFrame(loop);}
function staticAll(){const t=performance.now();for(const f of FRAMERS)f(t,true);live.forEach(o=>o.frame(t,true));}
const fontsReady=Promise.race([Promise.all([document.fonts.load('400 120px Michroma'),document.fonts.load('500 14px "Geist Mono"'),document.fonts.load('400 14px Geist')]).then(()=>document.fonts.ready),new Promise(r=>setTimeout(r,2500))]).catch(()=>{});
