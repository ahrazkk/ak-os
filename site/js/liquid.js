/* liquid: WebGL metaball + text-field engine (flat 2D, satin 3D, chrome 3D), magnetic hero, intro */
const LIQ_VS='attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}';
function liqFS(M){return `#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 uRes;uniform float uPx;uniform vec4 uB[${M}];uniform int uN;uniform sampler2D uT;uniform vec4 uTR;uniform float uTA;uniform vec3 uMag;uniform float uPull;uniform float uMetal;uniform float uDepth;uniform vec3 uCol;uniform float uLX;uniform float uTime;uniform float uTh;
void main(){vec2 p=vec2(gl_FragCoord.x,uRes.y-gl_FragCoord.y)/uPx;float f=0.;vec2 g=vec2(0.);
for(int i=0;i<${M};i++){if(i>=uN)break;vec4 b=uB[i];vec2 d=p-b.xy;float d2=dot(d,d)+1.;float r=b.z;
 if(b.w>0.){float th=atan(d.y,d.x+.0001);float s=pow(abs(cos(th*11.+uTime*.6)),6.)*(.7+.3*sin(th*3.+uTime));r*=1.+b.w*s;}
 float r2=r*r;f+=r2/d2;g+=-2.*r2*d/(d2*d2);}
if(uTR.z>0.&&uTA>0.){vec2 q=p;vec2 md=uMag.xy-p;float ml=length(md)+.001;q-=md/ml*uPull*uMag.z*exp(-ml*ml/16200.);vec2 uv=(q-uTR.xy)/uTR.zw;
 if(uv.x>-.02&&uv.x<1.02&&uv.y>-.02&&uv.y<1.02){vec2 e=vec2(1.5)/uTR.zw;float t0=texture2D(uT,uv).a;float tx=texture2D(uT,uv+vec2(e.x,0.)).a-texture2D(uT,uv-vec2(e.x,0.)).a;float ty=texture2D(uT,uv+vec2(0.,e.y)).a-texture2D(uT,uv-vec2(0.,e.y)).a;f+=t0*1.7*uTA;g+=vec2(tx,ty)/3.*1.7*uTA;}}
float aa=length(g)*.85/uPx+.003;float al=smoothstep(uTh-aa,uTh+aa,f);if(al<.003){gl_FragColor=vec4(0.);return;}
vec3 col=uCol;
if(uDepth>0.){vec2 gn=-g*7./(f*f+.35);float gl=length(gn);if(gl>2.2)gn*=2.2/gl;vec3 n=normalize(vec3(gn,1.));
 vec3 L=normalize(vec3(uLX,-.62,.75));vec3 R=reflect(-L,n);float sp=pow(max(R.z,0.),70.);float sp2=pow(max(R.z,0.),12.);float fr=pow(1.-n.z,2.);float dif=max(dot(n,L),0.);
 vec3 sat=uCol*(.55+.45*dif)+vec3(1.)*(sp*.95+sp2*.07)+fr*.10;
 float sky=smoothstep(-.55,.75,-n.y*.85-n.x*.15);vec3 env=mix(vec3(.13,.14,.16),vec3(.95,.96,.98),sky);env+=.22*exp(-pow((n.y+.12)*7.,2.));
 vec3 chr=env*(.72+.28*n.z)*mix(vec3(1.),uCol,.25)+vec3(1.)*sp*1.1;
 col=mix(uCol,mix(sat,chr,uMetal),uDepth);}
gl_FragColor=vec4(col*al,al);}`;}
function Liquid(cv,want){const gl=cv.getContext('webgl',{premultipliedAlpha:true,alpha:true,antialias:false});if(!gl)return null;
  const cap=Math.max(8,(gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS)||64)-24),MAXB=Math.min(want,cap);
  const sh=(t,s)=>{const o=gl.createShader(t);gl.shaderSource(o,s);gl.compileShader(o);if(!gl.getShaderParameter(o,gl.COMPILE_STATUS)){console.warn(gl.getShaderInfoLog(o));return null;}return o;};
  const vs=sh(gl.VERTEX_SHADER,LIQ_VS),fs=sh(gl.FRAGMENT_SHADER,liqFS(MAXB));if(!vs||!fs)return null;
  const pr=gl.createProgram();gl.attachShader(pr,vs);gl.attachShader(pr,fs);gl.linkProgram(pr);if(!gl.getProgramParameter(pr,gl.LINK_STATUS))return null;gl.useProgram(pr);
  const buf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buf);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);const al=gl.getAttribLocation(pr,'a');gl.enableVertexAttribArray(al);gl.vertexAttribPointer(al,2,gl.FLOAT,false,0,0);
  const U={};['uRes','uPx','uN','uT','uTR','uTA','uMag','uPull','uMetal','uDepth','uCol','uLX','uTime','uTh'].forEach(k=>U[k]=gl.getUniformLocation(pr,k));U.uB=gl.getUniformLocation(pr,'uB[0]')||gl.getUniformLocation(pr,'uB');
  const tex=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,tex);[[gl.TEXTURE_MIN_FILTER,gl.LINEAR],[gl.TEXTURE_MAG_FILTER,gl.LINEAR],[gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE],[gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE]].forEach(([k,v])=>gl.texParameteri(gl.TEXTURE_2D,k,v));
  gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,1,1,0,gl.RGBA,gl.UNSIGNED_BYTE,new Uint8Array(4));gl.uniform1i(U.uT,0);
  const B=new Float32Array(MAXB*4),S={n:0,tr:[0,0,0,0],ta:0,mag:[-1e4,-1e4,0],pull:0,metal:0,depth:0,col:[1,1,1],lx:-.45,time:0,th:1};let px=1;
  return{gl,B,S,MAXB,
    size(q,capPx){const r=cv.getBoundingClientRect();px=Math.min(Math.min(devicePixelRatio||1,2)*q,capPx||9);cv.width=Math.max(1,Math.round(r.width*px));cv.height=Math.max(1,Math.round(r.height*px));gl.viewport(0,0,cv.width,cv.height);return[r.width,r.height];},
    setText(c){gl.bindTexture(gl.TEXTURE_2D,tex);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,c);},
    render(){gl.useProgram(pr);gl.uniform2f(U.uRes,cv.width,cv.height);gl.uniform1f(U.uPx,px);gl.uniform4fv(U.uB,B);gl.uniform1i(U.uN,S.n);gl.uniform4f(U.uTR,S.tr[0],S.tr[1],S.tr[2],S.tr[3]);gl.uniform1f(U.uTA,S.ta);gl.uniform3f(U.uMag,S.mag[0],S.mag[1],S.mag[2]);gl.uniform1f(U.uPull,S.pull);gl.uniform1f(U.uMetal,S.metal);gl.uniform1f(U.uDepth,S.depth);gl.uniform3f(U.uCol,S.col[0],S.col[1],S.col[2]);gl.uniform1f(U.uLX,S.lx);gl.uniform1f(U.uTime,S.time);gl.uniform1f(U.uTh,S.th);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);gl.drawArrays(gl.TRIANGLES,0,3);}};}
function gpuName(gl){try{const e=gl.getExtension('WEBGL_debug_renderer_info');let s=e?gl.getParameter(e.UNMASKED_RENDERER_WEBGL):gl.getParameter(gl.RENDERER);const m=/ANGLE \((.*)\)/.exec(s);if(m){const p=m[1].split(', ');s=p[1]||p[0];}s=String(s).replace(/\s*(Direct3D|vs_\d|ps_\d|OpenGL|Metal|\(0x).*$/i,'').replace(/\((TM|R)\)/gi,'').trim();return(s||'WEBGL').toUpperCase();}catch(e){return 'WEBGL';}}
function nameTex(h1){const r=h1.getBoundingClientRect(),cs=getComputedStyle(h1),fs=parseFloat(cs.fontSize),ls=parseFloat(cs.letterSpacing)||0,pad=Math.round(fs*.4),tq=Math.min(1.5,devicePixelRatio||1);
  const W=Math.ceil((r.width+2*pad)*tq),H=Math.ceil((r.height+2*pad)*tq),c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d',{willReadFrequently:true});
  const OFF=6000;x.setTransform(tq,0,0,tq,0,0);x.font=`${cs.fontWeight} ${fs}px ${cs.fontFamily}`;x.textBaseline='middle';x.fillStyle='#fff';x.shadowColor='#fff';x.shadowBlur=Math.max(3,fs*.055)*tq;x.shadowOffsetX=OFF*tq;
  for(const sp of $$('.ln',h1)){const lr=sp.getBoundingClientRect();let cx=lr.left-r.left+pad-OFF;const cy=lr.top-r.top+pad+lr.height*.52;for(const ch of sp.textContent){x.fillText(ch,cx,cy);cx+=x.measureText(ch).width+ls;}}
  const d=x.getImageData(0,0,W,H).data,pts=[];for(let i=0;i<9000&&pts.length<420;i++){const px=Math.random()*W|0,py=Math.random()*H|0;if(d[(py*W+px)*4+3]>215)pts.push([px/W,py/H]);}
  return{c,rect:[r.left-pad,r.top-pad,r.width+2*pad,r.height+2*pad],pts};}

/* ---------- hero: magnetic liquid name ---------- */
const HERO={};
function heroInit(){const sec=$('#top'),cv=$('#heroGL'),h1=$('#name');const L=Liquid(cv,32);if(!L){root.classList.add('nogl');return false;}
  Object.assign(HERO,{L,sec,cv,h1,drops:[],mag:{x:-200,y:-200,s:0},ptr:{on:false,x:0,y:0,t:0},pulse:0,vis:true,ready:false,textOn:false,prev:0,fps:[],ro:0});
  const pos=e=>{const r=cv.getBoundingClientRect();HERO.ptr={on:true,x:e.clientX-r.left,y:e.clientY-r.top,t:performance.now()};};
  sec.addEventListener('pointermove',e=>{pos(e);$('#hint').classList.add('gone');});sec.addEventListener('pointerleave',()=>{HERO.ptr.on=false;});sec.addEventListener('pointerdown',e=>{pos(e);HERO.pulse=1;});
  regVis(sec,HERO);new ResizeObserver(()=>heroLayout()).observe(sec);FRAMERS.push(heroFrame);
  $('#rGpu').textContent=gpuName(L.gl);if(matchMedia('(pointer:coarse)').matches)$('#hintT').textContent='TOUCH AND DRAG. THE NAME IS MAGNETIC.';return true;}
async function heroLayout(){if(!HERO.L)return;await fontsReady;await document.fonts.ready;const{L,cv,h1}=HERO;L.size(.6,1.05);const t=nameTex(h1),cr=cv.getBoundingClientRect();L.setText(t.c);
  const R=HERO.rect=[t.rect[0]-cr.left,t.rect[1]-cr.top,t.rect[2],t.rect[3]];
  /* scale the magnet to the name, so a phone-width name isn't swallowed by every droplet at once */
  const k=HERO.k=clamp(R[2]/860,.42,1);
  HERO.drops=t.pts.slice(0,clamp(SET.drops|0,0,28)).map(([u,v])=>{const x=R[0]+u*R[2],y=R[1]+v*R[3];return{hx:x,hy:y,x,y,vx:0,vy:0,r:rnd(6,10.5)*k};});
  HERO.ready=true;drawLeaders(HERO.textOn);if(RM)heroFrame(0,true);}
function heroFrame(t,force){const H=HERO;if(!H.ready||(!H.vis&&!force))return;const L=H.L,dt=H.prev?Math.min(50,t-H.prev):16;H.prev=t;
  const R=H.rect,cx=R[0]+R[2]*.5,cy=R[1]+R[3]*.5,now=performance.now();let tx,ty,ts;
  if(H.ptr.on&&now-H.ptr.t<2600){tx=H.ptr.x;ty=H.ptr.y;ts=1;}else{tx=cx+Math.cos(t*.00027)*R[2]*.46;ty=cy+Math.sin(t*.00041)*R[3]*.56;ts=.6;}
  ts*=SET.magnet;if(!H.textOn||RM)ts=0;const m=H.mag;if(m.x<-100){m.x=tx;m.y=ty;}m.x+=(tx-m.x)*.13;m.y+=(ty-m.y)*.13;m.s+=(ts-m.s)*.035;H.pulse*=.95;const S=m.s*(1+H.pulse*.9);
  const B=L.B,k=H.k||1,PR=240*k;let n=0;if(S>.02){B[0]=m.x;B[1]=m.y;B[2]=(12+11*Math.min(S,1.6))*Math.sqrt(k);B[3]=.95*Math.min(S,1.6)*SET.spikes;n=1;}
  for(const d of H.drops){let ax=(d.hx-d.x)*.02,ay=(d.hy-d.y)*.02;const dx=m.x-d.x,dy=m.y-d.y,dd=Math.hypot(dx,dy)+.01;if(dd<PR&&S>.05){const f=1.2*S*SET.pull*(1-dd/PR);ax+=dx/dd*f;ay+=dy/dd*f;}if(H.pulse>.4){ax+=(Math.random()-.5)*H.pulse*2.5;ay+=(Math.random()-.5)*H.pulse*2.5;}
    d.vx=(d.vx+ax)*.86;d.vy=(d.vy+ay)*.86;d.x+=d.vx;d.y+=d.vy;const away=clamp(Math.hypot(d.x-d.hx,d.y-d.hy)/26);if(away>.02&&n<L.MAXB){B[n*4]=d.x;B[n*4+1]=d.y;B[n*4+2]=d.r*away;B[n*4+3]=0;n++;}}
  const[dep,met]=liqMat();Object.assign(L.S,{n,tr:R,ta:H.textOn?1:0,mag:[m.x,m.y,S],pull:18*SET.pull,metal:met,depth:dep,col:liqRGB(),lx:-.45+Math.sin(t*.00023)*.14,time:t*.001,th:1});L.render();
  H.fps.push(dt);if(H.fps.length>30)H.fps.shift();if(now-H.ro>500){H.ro=now;const avg=H.fps.reduce((a,b)=>a+b,0)/H.fps.length;$('#rFps').textContent=`${Math.round(1000/avg)} FPS · ${avg.toFixed(1)} MS`;$('#rMag').textContent=S>.05?`${Math.round(m.x)}, ${Math.round(m.y)} · ${H.ptr.on?'MANUAL':'AUTO'}`:'STANDBY';}}
function drawLeaders(anim){const svg=$('#leaders'),sec=$('#top');if(!svg)return;if(innerWidth<900){svg.innerHTML='';return;}const sr=sec.getBoundingClientRect(),lines=$$('#name .ln');if(!lines.length)return;
  const AN=[[0,.17,.32],[0,.9,.36],[1,.36,.62],[1,.93,.5]],cos=$$('.co',sec);let s='';
  cos.forEach((co,i)=>{const[li,fx,fy]=AN[i],lr=lines[li].getBoundingClientRect(),cr=co.getBoundingClientRect();const ax=lr.left-sr.left+fx*lr.width,ay=lr.top-sr.top+fy*lr.height,bx=cr.left-sr.left-8,by=cr.top-sr.top+cr.height/2,ex=Math.max(ax+20,bx-34);
    s+=`<g style="--d:${i*130}ms"><path d="M${ax+4} ${ay} L${ex} ${ay} L${bx} ${by}" pathLength="1"/><circle cx="${ax}" cy="${ay}" r="3.5"/><text x="${ax}" y="${ay-10}" text-anchor="middle">${String(i+1).padStart(2,'0')}</text></g>`;});
  svg.setAttribute('viewBox',`0 0 ${sr.width} ${sr.height}`);svg.innerHTML=s;if(anim)svg.classList.add('draw');}

/* ---------- intro: drop → droplets → name → glide into hero ---------- */
let bootL=null,booting=false;
function runChecks(gpu){const ul=$('#bChk');ul.innerHTML='';const tz=(()=>{try{return new Intl.DateTimeFormat('en-CA',{hour:'2-digit',minute:'2-digit',timeZoneName:'short'}).format(new Date()).toUpperCase();}catch(e){return '—';}})();
  [['WEBGL','OK'],['GPU',gpu],['TYPEFACE',SET.dFont.toUpperCase()],['VIEWPORT',innerWidth+' × '+innerHeight],['LOCAL TIME',tz],['MOTION','FULL']].forEach(([k,v],i)=>{const li=document.createElement('li');li.innerHTML=`<span>${k}</span><i></i><b></b>`;li.querySelector('b').textContent=v;ul.append(li);setTimeout(()=>li.classList.add('in'),250+i*170);});}
async function boot(){if(booting)return;if(RM||root.classList.contains('nogl')||!HERO.L){endBootQuick();return;}booting=true;try{sessionStorage.setItem('akos-intro','1');}catch(e){}if(typeof closeAllOverlays==='function')closeAllOverlays();scrollTo(0,0);
  const ov=$('#boot');if(!bootL)bootL=Liquid($('#bootGL'),66);if(!bootL){booting=false;endBootQuick();return;}const L=bootL;
  ov.classList.add('on');ov.classList.remove('hud-in','out');ov.style.backgroundColor='';$('#bSub').classList.remove('in');
  document.body.classList.remove('booted');document.body.classList.add('booting');root.classList.remove('preboot');HERO.textOn=false;
  L.size(.5,.75);await fontsReady;await document.fonts.ready;runChecks(gpuName(L.gl));requestAnimationFrame(()=>ov.classList.add('hud-in'));
  const tx=nameTex(HERO.h1);L.setText(tx.c);const R1=tx.rect,vw=innerWidth,vh=innerHeight,sc=Math.min(vw*.86/R1[2],1.35),cy=vh*.47,cx=vw/2,R0=[cx-R1[2]*sc/2,cy-R1[3]*sc/2,R1[2]*sc,R1[3]*sc];
  $('#bSub').style.top=(cy+R0[3]*.36)+'px';
  const N=Math.min(60,L.MAXB-2),drops=tx.pts.slice(0,N).map(([u,v],i)=>{const a=i/N*Math.PI*2+rnd(-.3,.3),sp=rnd(5,13);return{u,v,x:cx,y:cy,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp*.8,r0:rnd(7,12),r:0,del:rnd(150,700),snap:false};});
  const bg0=hex2rgb(C.boot||'#040506').map(v=>Math.round(v*255)).join(',');let T0=performance.now(),done=false,revealed=false,skipped=false;
  const evs=['pointerdown','keydown','wheel','touchstart'],skip=()=>{if(skipped)return;skipped=true;const t=performance.now()-T0;if(t<3250){T0-=3250-t;drops.forEach(d=>{d.snap=true;});}};evs.forEach(v=>addEventListener(v,skip,{passive:true}));
  const sub=$('#bSub'),clk=$('#bClock'),bar=$('#bBar');
  function fr(now){if(done)return;const t=now-T0,hk=eio(clamp((t-3250)/1050)),R=[lerp(R0[0],R1[0],hk),lerp(R0[1],R1[1],hk),lerp(R0[2],R1[2],hk),lerp(R0[3],R1[3],hk)],B=L.B;let n=0;
    if(t<1050){const k=eo(clamp((t-300)/600)),q=.5+.5*Math.sin(t*.025);if(k>0){B[0]=cx;B[1]=cy;B[2]=36*k;B[3]=k*(.35+.45*q);n=1;}}
    else{for(const d of drops){const gx=R[0]+d.u*R[2],gy=R[1]+d.v*R[3],pull=d.snap?1:clamp((t-1050-d.del)/650);
      if(d.snap){d.x+=(gx-d.x)*.35;d.y+=(gy-d.y)*.35;d.r+=(0-d.r)*.25;}else{d.vx+=-(d.y-cy)*.0011*(1-pull);d.vy+=(d.x-cx)*.0011*(1-pull);d.vx=d.vx*(.94-.12*pull)+(gx-d.x)*(.003+.06*pull);d.vy=d.vy*(.94-.12*pull)+(gy-d.y)*(.003+.06*pull);d.x+=d.vx;d.y+=d.vy;const dist=Math.hypot(gx-d.x,gy-d.y);d.r+=(((pull>.9&&dist<10)?0:d.r0)-d.r)*.09;}
      if(d.r>.4&&n<L.MAXB){B[n*4]=d.x;B[n*4+1]=d.y;B[n*4+2]=d.r;B[n*4+3]=0;n++;}}}
    const ta=eo(clamp((t-1500)/850)),lx=t<2350?-.45:t<3250?lerp(-1.3,1.1,eio(clamp((t-2350)/850))):lerp(1.1,-.45,hk),c1=liqRGB(),col=[lerp(1,c1[0],hk),lerp(1,c1[1],hk),lerp(1,c1[2],hk)],[dep,met]=liqMat();
    Object.assign(L.S,{n,tr:R,ta,mag:[-1e4,-1e4,0],pull:0,metal:met,depth:dep,col,lx,time:t*.001,th:1});L.render();
    ov.style.backgroundColor=`rgba(${bg0},${1-hk})`;if(t>2300)sub.classList.add('in');if(t>3250)ov.classList.add('out');
    if(t>3350&&!revealed){revealed=true;document.body.classList.remove('booting');document.body.classList.add('booted');setTimeout(()=>document.body.classList.remove('booted'),1900);}
    clk.textContent='T−'+(Math.max(0,4300-t)/1000).toFixed(1).padStart(4,'0');bar.style.transform=`scaleX(${clamp(t/4300)})`;
    if(t>=4300){finish();return;}requestAnimationFrame(fr);}
  function finish(){done=true;evs.forEach(v=>removeEventListener(v,skip));HERO.textOn=true;HERO.prev=0;heroFrame(performance.now(),true);ov.classList.remove('on');ov.style.backgroundColor='';document.body.classList.remove('booting');booting=false;L.S.n=0;startCounts();drawLeaders(true);}
  requestAnimationFrame(fr);}
function endBootQuick(){root.classList.remove('preboot');$('#boot').classList.remove('on');document.body.classList.remove('booting');HERO.textOn=true;startCounts();fontsReady.then(()=>drawLeaders(true));}
function startCounts(){$$('.co b[data-to]').forEach(el=>{const to=+el.dataset.to,dec=+(el.dataset.dec||0),suf=el.dataset.suf||'',fmt=v=>v.toLocaleString('en-US',{minimumFractionDigits:dec,maximumFractionDigits:dec})+suf;if(RM){el.textContent=fmt(to);return;}const t0=performance.now(),D=1500,f=n=>{const p=Math.min(1,(n-t0)/D),e=1-Math.pow(1-p,4);el.textContent=fmt(dec?to*e:Math.round(to*e));if(p<1)requestAnimationFrame(f);};requestAnimationFrame(f);});}
