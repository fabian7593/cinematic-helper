/* ---------- modo manual ---------- */
const MDEF={dist:4,height:1.5,aim:1.25,orbit:0,shift:0,roll:0,move:'none',mm:35,fstop:8,focus:'subject',fg:false,lights:false,shutter:48,fps:24,aspect:0,ev:0,
  amb:'day',keyAz:40,keyEl:45,keyInt:.85,hard:true,fill:0,rim:0,kelvin:5600,fog:0,lamp:0,sat:0,con:0,lut:'none',vig:0,grain:0,action:'idle',second:false,style:'none',fmt:'generic'};
const MAN=Object.assign({},MDEF);
const AMB={day:{keyInt:.85,keyAz:40,keyEl:45,kelvin:5600},golden:{keyInt:1.25,keyAz:-60,keyEl:14,kelvin:3000},blue:{keyInt:0,keyAz:40,keyEl:45,kelvin:8000,lamp:1.5},
  night:{keyInt:0,keyAz:-40,keyEl:60,kelvin:8500,lamp:2.3},studio:{keyInt:1.3,keyAz:65,keyEl:38,kelvin:5200},highkey:{keyInt:.5,keyAz:25,keyEl:50,kelvin:5600,fill:.5},sil:{keyInt:0,keyAz:180,keyEl:10,kelvin:3000}};
let manInfo={H:2,pitch:0,bg:0,frac:.5,rel:0,mm:35};
function manualFn(t,S){const m=MAN,L=mk(LOOKS[m.amb]),P=S.post;
  /* sujeto */
  if(m.action==='walk')walkX(S.A,t,8,-2.6,2.6);else if(m.action==='talk')S.A.talk=1;else if(m.action==='wave')S.A.wave=1;else if(m.action==='dance')S.A.dance=1;
  if(m.second){S.B.vis=true;S.B.x=S.A.x+1.4;S.B.z=-.35;S.B.ry=-.45;S.B.talk=m.action==='talk'?0:.0}
  /* luz */
  const az=m.keyAz*PI/180,el=Math.max(4,m.keyEl)*PI/180,o0=m.orbit*PI/180;
  L.sunP=[Math.sin(az)*Math.cos(el),Math.sin(el),Math.cos(az)*Math.cos(el)];L.sun=m.keyInt;L.sunC=kcol(m.kelvin);L.soft=m.hard?0:1;if(!m.hard)L.hemi=Math.min(1.05,L.hemi+.16);
  const faz=2*o0-az;L.fillP=[Math.sin(faz)*.94,.34,Math.cos(faz)*.94];L.fill=m.fill;L.fillC='#e6ecff';
  const raz=o0+PI+.45;L.rimP=[Math.sin(raz)*.86,.5,Math.cos(raz)*.86];L.rim=m.rim;
  L.fogD=L.fogD+m.fog;L.lamp=m.lamp;if(m.lamp>.05)L.win=1;S.look=L;
  S.props.cone=m.lamp>.3&&L.fogD>.045;S.props.lg=true;S.props.set=!(m.amb==='studio'||m.amb==='highkey');S.props.lights=m.lights;
  /* cámara */
  let d=m.dist,mm=m.mm,h=m.height,aim=m.aim,o=o0,roll=m.roll*PI/180,cx0=0,px=0;const k=pp(t,8,.06);
  switch(m.move){case 'dolly':d*=lerp(1,.42,k);break;case 'zoom':mm*=lerp(1,2.8,k);break;case 'dollyzoom':{const f=lerp(1,.38,k);d*=f;mm*=f;break}
    case 'orbit':o+=t/8*PI*2;break;case 'crane':h+=4.5*k;break;case 'tilt':aim=lerp(.1,1.85,k);break;
    case 'truck':cx0=m.action==='walk'?S.A.x:2.4*(2*k-1);break;case 'pan':px=m.action==='walk'?S.A.x:d*.45*Math.sin(t/8*PI*2);break}
  const sx=Math.sin(o),cz=Math.cos(o),rx=cz,rz=-sx;
  let p=[cx0*(m.move==='truck'&&m.action!=='walk'?rx:1)+sx*d,h,(m.move==='truck'&&m.action!=='walk'?cx0*rz:0)+cz*d];
  let tg=[m.move==='truck'?(m.action==='walk'?cx0:cx0*rx):0,aim,m.move==='truck'&&m.action!=='walk'?cx0*rz:0];
  if(m.move==='pan'){if(m.action==='walk'){tg[0]=px}else{tg[0]+=rx*px;tg[2]+=rz*px}}
  if(m.move==='handheld'){const n=s=>Math.sin(t*2.3+s)*.5+Math.sin(t*5.1+s*2.1)*.3+Math.sin(t*9.7+s*3.3)*.2;p[0]+=.05*n(1);p[1]+=.04*n(2);p[2]+=.04*n(3);tg[0]+=.07*n(4);tg[1]+=.06*n(5);roll+=.018*n(6)}
  p[1]=Math.max(.05,p[1]);
  setCam(S,{p,t:tg,fov:mm2fov(mm),roll});third(S,m.shift*.62);
  /* profundidad de campo: círculo de confusión de lente delgada, en mm sobre un sensor de 36 mm */
  const s=Math.max(.3,Math.hypot(d,h-aim)),far=26,near=.38*s,N=m.fstop;
  const fs=m.focus==='fg'?near:m.focus==='bg'?far:s;
  const coc=dl=>clamp((mm*mm/(N*Math.max(1,fs*1000-mm)))*Math.abs(dl-fs)/dl/36*960,0,26);
  const bl={fg:m.fg?coc(near):0,mid:coc(s),bg:coc(far)};
  if(m.fg){const cp=S.cam.p,ct=S.cam.t;S.props.fg=true;const hw=near*Math.tan(S.cam.fov*PI/360)*16/9;const L2=Math.hypot(ct[0]-cp[0],ct[2]-cp[2])||1,fx=(ct[0]-cp[0])/L2,fz=(ct[2]-cp[2])/L2;
    S.props.fgPos=[cp[0]+fx*near*.98-(-fz)*hw*.62,cp[2]+fz*near*.98-fx*hw*.62]}
  const dofOn=Math.max(bl.fg,bl.mid,bl.bg)>.7;
  if(dofOn){P.blur=bl;P.bokeh=m.lights}
  /* tiempo: cuadros por segundo y obturación */
  const fpsEff=m.fps>=60?60:m.fps;P.fps=m.fps>=60?0:m.fps;const frac=fpsEff/m.shutter;
  if(!dofOn&&frac>.13){P.sub=frac>1?14:10;P.shutter=frac}
  P.mask=m.aspect;P.vig=m.vig;P.grain=m.grain;
  /* color */
  const f=[];if(m.ev)f.push('brightness('+Math.pow(2,m.ev).toFixed(3)+')');if(m.con)f.push('contrast('+(1+m.con*(m.con>0?.8:.5)).toFixed(3)+')');if(m.sat)f.push('saturate('+(1+m.sat*(m.sat>0?1.1:.9)).toFixed(3)+')');
  const css={filter:'',mul:null,scr:null};
  if(m.lut==='noir')f.push('grayscale(1) contrast(1.25)');else if(m.lut==='vint'){f.push('sepia(.38) saturate(1.15)');css.mul='#ffe9c4'}else if(m.lut==='teal'){f.push('contrast(1.14)');css.mul='#ffd6a6';css.scr='#0a4753'}
  css.filter=f.join(' ');P.css=css;
  S.lensNote='f/'+m.fstop;
  const sty=STY[m.style];if(sty&&sty.fx)sty.fx(S,t);
  manInfo={H:2*s*Math.tan(mm2fov(mm)*PI/360),pitch:Math.atan2(h-aim,Math.max(.01,d))*180/PI,bg:bl.bg,fgb:bl.mid,frac,mm,dofOn};
}
const MANUAL={id:'manual',cat:'manual',dur:8,fn:manualFn};

/* ---------- lienzos ---------- */
const cBg=$('#c-bg'),cBk=$('#c-bokeh'),cMid=$('#c-mid'),cFg=$('#c-fg'),cHud=$('#c-hud'),cSet=$('#c-set'),gMul=$('#g-mul'),gScr=$('#g-scr');
const xBg=cBg.getContext('2d'),xBk=cBk.getContext('2d'),xMid=cMid.getContext('2d'),xFg=cFg.getContext('2d'),xHud=cHud.getContext('2d'),xSet=cSet.getContext('2d');
const tmp=document.createElement('canvas'),xTmp=tmp.getContext('2d');
const noise=document.createElement('canvas');noise.width=noise.height=160;(function(){const x=noise.getContext('2d'),im=x.createImageData(160,160),r=rng(99);for(let i=0;i<im.data.length;i+=4){const v=r()*255|0;im.data[i]=im.data[i+1]=im.data[i+2]=v;im.data[i+3]=(r()*150)|0}x.putImageData(im,0,0)})();
let GW=960,GH=540,W2=420,H2=315,cssW=960,dpr=1,layersDirty=false;
function resize(){
  const r=stage.getBoundingClientRect(); cssW=Math.max(200,r.width); dpr=Math.min(window.devicePixelRatio||1,2);
  GW=Math.round(Math.min(1280,cssW*Math.min(dpr,1.5))/2)*2; GH=Math.round(GW*9/16);
  W2=Math.round(Math.min(600,GW*.74)); H2=Math.round(W2*.75);
  R.setSize(GW,GH,false);
  [cBg,cBk,cMid,cFg,tmp].forEach(c=>{c.width=GW;c.height=GH});
  cHud.width=Math.round(cssW*dpr); cHud.height=Math.round(cssW*9/16*dpr);
  cSet.width=W2; cSet.height=H2;
}
const stCache=new WeakMap();
function st(el,prop,val){let c=stCache.get(el);if(!c){c={};stCache.set(el,c)}if(c[prop]!==val){c[prop]=val;el.style[prop]=val}}
/* nubes: una máscara blanda que se tiñe con el color del cielo y se mueve despacio */
const CLOUD=document.createElement('canvas');CLOUD.width=1024;CLOUD.height=256;(function(){const x=CLOUD.getContext('2d'),r=rng(44);
  for(let i=0;i<85;i++){const cx=r()*1024,cy=30+r()*190,rw=36+r()*130,f=.22+r()*.22;const g=x.createRadialGradient(cx,cy,0,cx,cy,rw);g.addColorStop(0,'rgba(255,255,255,.5)');g.addColorStop(.55,'rgba(255,255,255,.2)');g.addColorStop(1,'rgba(255,255,255,0)');
    x.save();x.translate(cx,cy);x.scale(1,f);x.translate(-cx,-cy);x.fillStyle=g;x.fillRect(cx-rw,cy-rw,rw*2,rw*2);x.restore()}})();
const CT=document.createElement('canvas');CT.width=1024;CT.height=256;const ctx2=CT.getContext('2d');
const lumH=h=>{const c=new THREE.Color(h);return .3*c.r+.59*c.g+.11*c.b};
function drawSky(x,L){const g=x.createLinearGradient(0,0,0,GH*.62);g.addColorStop(0,L.skyTop);if(L.skyMid)g.addColorStop(.72,L.skyMid);g.addColorStop(1,L.skyBot);x.globalAlpha=1;x.globalCompositeOperation='source-over';x.fillStyle=L.skyBot;x.fillRect(0,0,GW,GH);x.fillStyle=g;x.fillRect(0,0,GW,GH*.62);
  const lt=lumH(L.skyTop),lb=lumH(L.skyBot),a=Math.abs(lt-lb)<.06?0:clamp((lt+lb)*.75-.42,0,.8);if(a<=.01)return;
  ctx2.globalCompositeOperation='source-over';ctx2.clearRect(0,0,1024,256);ctx2.drawImage(CLOUD,0,0);ctx2.globalCompositeOperation='source-in';ctx2.fillStyle=mixC('#ffffff',L.skyMid||L.skyBot,.32);ctx2.fillRect(0,0,1024,256);
  const W=GW*1.7,off=((T*GW*.004)%W+W)%W;x.globalAlpha=a;x.drawImage(CT,-off,GH*.02,W,GH*.42);x.drawImage(CT,W-off,GH*.02,W,GH*.42);x.globalAlpha=1}
function setScene(S,t){
  const tt=S.tt==null?t:S.tt; pose(PA,S.A,tt); pose(PB,S.B,tt);
  const p=S.props; gSet.visible=p.set; gTable.visible=p.mug; gTable.position.set(p.table[0],0,p.table[1]);
  gPlant.visible=p.fg; gPlant.position.set(p.fgPos[0],0,p.fgPos[1]); gLights.visible=p.lights; moon.visible=p.moon; cone.visible=cone2.visible=p.cone;
  gAvenue.visible=p.avenue; gDoor.visible=p.door; pathM.visible=p.set||p.avenue;
  applyLook(S.look,S.A.x,S.A.z); applyCam(S.cam);
}
const sunV=new V3();
function sunScreen(S,w,h){const P=S.look.sunP,k=400/Math.hypot(P[0],P[1],P[2]);sunV.set(cam.position.x+P[0]*k,cam.position.y+P[1]*k,cam.position.z+P[2]*k);return project(sunV,cam,w,h)}
/* ojo de pez: se renderiza a una textura y se curva con una proyección equidistante */
let fishK=0,fishRT=null;
const fishScene=new THREE.Scene(),fishCam=new THREE.OrthographicCamera(-1,1,1,-1,0,1);
const fishMat=new THREE.ShaderMaterial({uniforms:{tex:{value:null},asp:{value:16/9},tmax:{value:1.22}},blending:THREE.NoBlending,depthTest:false,depthWrite:false,
  vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}',
  fragmentShader:'uniform sampler2D tex;uniform float asp;uniform float tmax;varying vec2 vUv;void main(){vec2 p=vUv*2.-1.;p.x*=asp;float dg=length(vec2(asp,1.));float r=length(p)/dg;float rs=tan(r*tmax)/tan(tmax);vec2 q=r>1e-5?p*(rs/r):p;q.x/=asp;gl_FragColor=texture2D(tex,q*.5+.5);}'});
const fishQ=new THREE.Mesh(new THREE.PlaneGeometry(2,2),fishMat);fishQ.frustumCulled=false;fishScene.add(fishQ);
const fishFov=k=>2*Math.atan(Math.tan(k)/Math.hypot(16/9,1))*180/PI;
function gl(shadow){R.setScissorTest(false);R.setViewport(0,0,GW,GH);R.setClearColor(0x000000,0);if(shadow)R.shadowMap.needsUpdate=true;
  if(fishK){const w=Math.round(GW*1.5),h=Math.round(GH*1.5);if(!fishRT||fishRT.width!==w||fishRT.height!==h){if(fishRT)fishRT.dispose();fishRT=new THREE.WebGLRenderTarget(w,h)}
    R.setRenderTarget(fishRT);R.clear();R.render(scene,cam);R.setRenderTarget(null);R.setViewport(0,0,GW,GH);fishMat.uniforms.tex.value=fishRT.texture;fishMat.uniforms.tmax.value=fishK;R.clear();R.render(fishScene,fishCam)}
  else{R.clear();R.render(scene,cam)}}
function compose(x,S,t,shadow){drawSky(x,S.look);setScene(S,t);
  if(S.props.sunDisc){const s=sunScreen(S,GW,GH);if(s[2]<1){const r=GW*.2,g=x.createRadialGradient(s[0],s[1],0,s[0],s[1],r);g.addColorStop(0,'rgba(255,250,235,1)');g.addColorStop(.09,'rgba(255,244,214,1)');g.addColorStop(.16,'rgba(255,214,150,.55)');g.addColorStop(1,'rgba(255,190,120,0)');x.fillStyle=g;x.fillRect(s[0]-r,s[1]-r,r*2,r*2)}}
  gl(shadow);x.drawImage(R.domElement,0,0)}
function grade(x,ops,x0,x1){if(!ops)return;x.save();x.beginPath();x.rect(x0,0,x1-x0,GH);x.clip();
  ops.forEach(o=>{x.globalAlpha=o.a;if(o.self){x.globalCompositeOperation=o.self;x.drawImage(x.canvas,0,0)}else{x.globalCompositeOperation=o.op;x.fillStyle=o.c;x.fillRect(0,0,GW,GH)}});x.restore();x.globalAlpha=1;x.globalCompositeOperation='source-over'}

/* ---------- vista del set ---------- */
let gizScale=1,showPath=false;const wGoal=new V3(),wCtr=new V3(),wCtrNow=new V3();let wSnap=true;
function fitWitness(d,smooth){
  const box=new THREE.Box3(),pa=pathGeo.attributes.position,N=64;let len=0,prev=null;
  for(let i=0;i<N;i++){const S=fresh(0),S2=fresh(0);const t=d.dur*i/N;d.fn(t,S,S2);const p=new V3(S.cam.p[0],S.cam.p[1],S.cam.p[2]),tt=new V3(S.cam.t[0],S.cam.t[1],S.cam.t[2]),dir=tt.sub(p),L=Math.min(dir.length(),5);dir.normalize();
    box.expandByPoint(p);box.expandByPoint(p.clone().addScaledVector(dir,L));if(S.A.vis)box.expandByPoint(new V3(S.A.x,1,S.A.z));if(S.B.vis)box.expandByPoint(new V3(S.B.x,1,S.B.z));
    pa.setXYZ(i,p.x,p.y,p.z);if(prev)len+=prev.distanceTo(p);prev=p}
  pa.needsUpdate=true;showPath=len>.4&&d.cat!=='edicion'&&d.cat!=='direccion'&&!d.cuts&&d.id!=='timelapse';
  box.getCenter(wCtr);const r=Math.max(box.getSize(new V3()).length()/2,2.4),dist=r/Math.sin(17*PI/180)*1.02;
  wGoal.copy(wCtr).addScaledVector(new V3(.6,.52,.6).normalize(),dist);gizScale=clamp(dist/11,1,5);wSnap=!smooth;
}
const fwd=new V3(),tgt=new V3();
function drawSet(S){
  if(wSnap){wcam.position.copy(wGoal);wCtrNow.copy(wCtr);wSnap=false}else{wcam.position.lerp(wGoal,.14);wCtrNow.lerp(wCtr,.14)}
  wcam.lookAt(wCtrNow);wcam.updateMatrixWorld();
  gCam.position.copy(cam.position);gCam.quaternion.copy(cam.quaternion);gCam.scale.setScalar(gizScale);
  tgt.set(S.cam.t[0],S.cam.t[1],S.cam.t[2]);const Dd=clamp(cam.position.distanceTo(tgt),.8,5.5),hh=Dd*Math.tan(cam.fov*PI/360),hw=hh*16/9,a=frGeo.attributes.position;
  const cs=[[-hw,hh],[hw,hh],[hw,-hh],[-hw,-hh]];let n=0;const o=cam.position,q=cam.quaternion,vv=new V3(),W=[];
  cs.forEach(c=>{vv.set(c[0],c[1],-Dd).applyQuaternion(q).add(o);W.push(vv.clone())});
  W.forEach((w,i)=>{a.setXYZ(n++,o.x,o.y,o.z);a.setXYZ(n++,w.x,w.y,w.z);const w2=W[(i+1)%4];a.setXYZ(n++,w.x,w.y,w.z);a.setXYZ(n++,w2.x,w2.y,w2.z)});a.needsUpdate=true;
  fwd.set(0,0,-Dd).applyQuaternion(q).add(o);frFill.position.copy(fwd);frFill.quaternion.copy(q);frFill.scale.set(hw*2,hh*2,1);
  pathLine.visible=showPath;axisLine.visible=S.props.axis;
  const L=S.look,fx=S.A.x,fz=S.A.z;[[_t('Key'),L.sunP,L.sun],[_t('Fill'),L.fillP,L.fill],[_t('Rim'),L.rimP,L.rim]].forEach(e=>{const z=lgz[e[0]],on=S.props.lg&&e[2]>.05;z.g.visible=z.ln.visible=on;if(on){const k=2.7/Math.hypot(e[1][0],e[1][1],e[1][2]);z.pos.set(fx+e[1][0]*k,Math.max(.15,1.3+e[1][1]*k),fz+e[1][2]*k);z.g.position.copy(z.pos);const la=z.ln.geometry.attributes.position;la.setXYZ(0,z.pos.x,z.pos.y,z.pos.z);la.setXYZ(1,fx,1.3,fz);la.needsUpdate=true}});
  /* luz de trabajo para que el set se lea aunque la escena sea oscura */
  hemi.intensity=clamp(L.hemi,.5,.62);hemi.color.set('#ffffff');hemi.groundColor.set('#8a8f98');scene.fog.density=0;sun.intensity=Math.min(L.sun,.5);fillL.intensity=Math.min(L.fill,.25);rimL.intensity=Math.min(L.rim,.25);
  gBg.visible=gMid.visible=gFg.visible=true;moon.visible=false;cone.visible=cone2.visible=false;gDoor.visible=false;
  R.setScissorTest(true);R.setScissor(0,0,W2,H2);R.setViewport(0,0,W2,H2);R.setClearColor(0x20242c,1);R.clear();R.render(scene,wcam);R.setScissorTest(false);
  xSet.drawImage(R.domElement,0,GH-H2,W2,H2,0,0,W2,H2);
  xSet.font='600 '+Math.round(W2*.036)+'px "Barlow Condensed","Arial Narrow",sans-serif';xSet.textAlign='center';xSet.textBaseline='bottom';xSet.lineWidth=3;xSet.strokeStyle='rgba(0,0,0,.75)';xSet.fillStyle='#fff';
  const lab=(v,txt,dy)=>{const s=project(v,wcam,W2,H2);if(s[2]<1){xSet.strokeText(txt,s[0],s[1]-dy);xSet.fillText(txt,s[0],s[1]-dy)}};
  lab(cam.position,_t('CÁMARA'),W2*.03);[_t('Key'),_t('Fill'),_t('Rim')].forEach(k=>{if(lgz[k].g.visible)lab(lgz[k].pos,k.toUpperCase(),W2*.022)});
}

/* ---------- bucle ---------- */
let cur=D[0],T=0,playing=true,last=0,lastCap=null,lastBadge=null,lastLens=null,lastTc=null,mode='ex';
const elCap=$('#cap'),elBadge=$('#badge'),elTc=$('#tc'),elLens=$('#lens'),elProg=$('#prog');
function render(){
  const t=((T%cur.dur)+cur.dur)%cur.dur; const S=fresh(t),S2=fresh(t); cur.fn(t,S,S2); const P=S.post, k=cssW/960; fishK=P.fish||0;
  let ts=t; if(P.fps)ts=Math.floor(t*P.fps+1e-6)/P.fps;
  const at=tt=>{if(tt===t)return S;const s=fresh(tt),s2=fresh(tt);cur.fn(clamp(tt,0,cur.dur-1e-4),s,s2);return s};
  const blurOn=!!P.blur, cssF=(P.css&&P.css.filter&&P.css.filter!=='none')?P.css.filter:'';
  const filt=b=>{const s=(b>.2?'blur('+(b*k).toFixed(1)+'px) ':'')+cssF;return s.trim()||'none'};
  if(blurOn){
    const Sx=at(ts);setScene(Sx,ts);gMid.visible=false;gFg.visible=false;gBg.visible=true;drawSky(xBg,Sx.look);gl(true);xBg.drawImage(R.domElement,0,0);
    if(P.accent){xBg.globalCompositeOperation='saturation';xBg.globalAlpha=.9;xBg.fillStyle='#808080';xBg.fillRect(0,0,GW,GH);xBg.globalAlpha=1;xBg.globalCompositeOperation='source-over'}
    gBg.visible=false;gMid.visible=true;xMid.clearRect(0,0,GW,GH);gl(false);xMid.drawImage(R.domElement,0,0);
    xFg.clearRect(0,0,GW,GH);if(Sx.props.fg){gMid.visible=false;gFg.visible=true;gl(false);xFg.drawImage(R.domElement,0,0)}
    gBg.visible=gMid.visible=gFg.visible=true;
    xBk.clearRect(0,0,GW,GH);
    if(P.bokeh){xBk.globalCompositeOperation='lighter';const rr=(2.5+P.blur.bg*1.9)*GW/960;LIGHTS.forEach(l=>{const s=project(l.p,cam,GW,GH);if(s[2]>1)return;xBk.globalAlpha=clamp(.95-P.blur.bg*.03,.45,.95);xBk.fillStyle=l.c;xBk.beginPath();xBk.ellipse(s[0],s[1],rr*(P.anam?.6:1),rr,0,0,PI*2);xBk.fill()});xBk.globalAlpha=1;xBk.globalCompositeOperation='source-over'}
    st(cBg,'filter',filt(P.blur.bg));st(cMid,'filter',filt(P.blur.mid));st(cFg,'filter',filt(P.blur.fg));st(cBk,'filter',cssF||'none');
    st(cBk,'mixBlendMode','normal');st(cBk,'opacity','1');
    st(cMid,'visibility','visible');st(cBk,'visibility',P.bokeh?'visible':'hidden');st(cFg,'visibility',Sx.props.fg?'visible':'hidden');
    const sc=Math.max(P.blur.bg,P.blur.mid,P.blur.fg)>.2?'scale(1.06)':'none';[cBg,cBk,cMid,cFg].forEach(c=>{st(c,'transform',sc);st(c,'maskImage','none');st(c,'webkitMaskImage','none')});layersDirty=true;
  }else{
    if(layersDirty){[xBk,xMid,xFg].forEach(x=>x.clearRect(0,0,GW,GH));[cBg,cBk,cMid,cFg].forEach(c=>{st(c,'transform','none');st(c,'maskImage','none');st(c,'webkitMaskImage','none')});layersDirty=false}
    if(P.split){compose(xTmp,S,ts,true);xBg.drawImage(tmp,GW/4,0,GW/2,GH,0,0,GW/2,GH);compose(xTmp,S2,ts,true);xBg.drawImage(tmp,GW/4,0,GW/2,GH,GW/2,0,GW/2,GH)}
    else if(P.sub>1&&P.shutter>0){const span=P.shutter/(P.fps||24);for(let i=0;i<P.sub;i++){const tt=ts+span*i/P.sub;compose(xTmp,at(tt),tt,i===0);xBg.globalAlpha=1/(i+1);xBg.drawImage(tmp,0,0)}xBg.globalAlpha=1}
    else{compose(xBg,at(ts),ts,true)}
    if(P.mix>0){compose(xTmp,S2,ts,true);xBg.globalAlpha=P.mix;xBg.drawImage(tmp,0,0);xBg.globalAlpha=1}
    if(P.wipeMix>0){compose(xTmp,S2,ts,true);const wx=Math.round(GW*P.wipeMix);if(wx>0)xBg.drawImage(tmp,0,0,wx,GH,0,0,wx,GH)}
    if(P.grade){const xw=Math.round(GW*P.wipe);if(P.gradeBase){grade(xBg,P.gradeBase,0,xw);grade(xBg,P.grade,xw,GW)}else grade(xBg,P.grade,0,GW)}
    st(cBg,'filter',filt(0));st(cBg,'transform',P.warp||'none');
    if(P.bloom>0){xBk.clearRect(0,0,GW,GH);xBk.drawImage(cBg,0,0);st(cBk,'filter',(cssF?cssF+' ':'')+'brightness(.8) contrast(2.6) blur('+(18*k).toFixed(1)+'px)');st(cBk,'mixBlendMode','screen');st(cBk,'opacity',P.bloom.toFixed(2));st(cBk,'transform',P.warp||'none');layersDirty=true}
    st(cMid,'visibility','hidden');st(cBk,'visibility',P.bloom>0?'visible':'hidden');st(cFg,'visibility',P.tilt?'visible':'hidden');
    if(P.tilt){xFg.clearRect(0,0,GW,GH);xFg.drawImage(cBg,0,0);st(cFg,'filter',filt(9));const m='linear-gradient(to bottom,#000 0%,#000 24%,transparent 44%,transparent 60%,#000 82%,#000 100%)';st(cFg,'maskImage',m);st(cFg,'webkitMaskImage',m);layersDirty=true}
    else st(cFg,'filter','none');
  }
  const css=P.css||{};
  st(gMul,'display',css.mul?'block':'none');if(css.mul)st(gMul,'background',css.mul);st(gScr,'display',css.scr?'block':'none');if(css.scr)st(gScr,'background',css.scr);
  /* deja la escena en el estado mostrado para el HUD y la vista del set */
  const Sn=at(ts); if(blurOn||P.sub>1||P.mix>0||P.wipeMix>0||P.split)setScene(Sn,ts);
  /* HUD */
  const hudNow=!!(P.anam||P.flare||P.vig>0||P.grain>0||P.fade>0||P.split||(P.wipeMix>0&&P.wipeMix<1)||P.mask||S.hud);
  st(cHud,'visibility',hudNow?'visible':'hidden'); /* oculta el lienzo cuando no se usa */
  const w=cHud.width,h=cHud.height,c=xHud;c.clearRect(0,0,w,h);
  if(P.anam){c.globalCompositeOperation='lighter';[0,3,7,12].forEach(i=>{const s=project(LIGHTS[i].p,cam,w,h);if(s[2]>1)return;const g=c.createLinearGradient(s[0]-w*.32,0,s[0]+w*.32,0);g.addColorStop(0,'rgba(70,150,255,0)');g.addColorStop(.5,'rgba(110,180,255,.6)');g.addColorStop(1,'rgba(70,150,255,0)');c.fillStyle=g;c.fillRect(s[0]-w*.32,s[1]-h*.006,w*.64,h*.012)});c.globalCompositeOperation='source-over'}
  if(P.flare){const s=sunScreen(Sn,w,h);if(s[2]<1&&s[0]>-w*.2&&s[0]<w*1.2&&s[1]>-h*.3&&s[1]<h*1.2){c.globalCompositeOperation='lighter';const cx=w/2,cy=h/2;
    const g=c.createRadialGradient(s[0],s[1],0,s[0],s[1],w*.34);g.addColorStop(0,'rgba(255,236,190,.55)');g.addColorStop(.25,'rgba(255,200,130,.16)');g.addColorStop(1,'rgba(255,180,110,0)');c.fillStyle=g;c.fillRect(0,0,w,h);
    [[.35,.035,'255,200,120',.22],[.62,.06,'120,220,200',.14],[1.0,.022,'255,255,255',.25],[1.35,.09,'255,150,90',.12],[1.7,.05,'140,170,255',.16],[2.05,.13,'255,210,150',.08]].forEach(e=>{c.beginPath();c.fillStyle='rgba('+e[2]+','+e[3]+')';c.arc(s[0]+(cx-s[0])*e[0],s[1]+(cy-s[1])*e[0],w*e[1],0,PI*2);c.fill()});c.globalCompositeOperation='source-over'}}
  if(P.vig>0){const g=c.createRadialGradient(w/2,h/2,h*.32,w/2,h/2,w*.62);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,'+(.82*P.vig).toFixed(3)+')');c.fillStyle=g;c.fillRect(0,0,w,h)}
  if(P.grain>0){c.globalAlpha=.26*P.grain;const sz=160*Math.max(1.4,dpr*1.1),ox=-((T*977)%1)*sz,oy=-((T*613)%1)*sz;for(let y=oy;y<h;y+=sz)for(let x=ox;x<w;x+=sz)c.drawImage(noise,x,y,sz,sz);c.globalAlpha=1}
  if(P.fade>0){c.fillStyle='rgba(0,0,0,'+P.fade+')';c.fillRect(0,0,w,h)}
  if(P.split){c.fillStyle='#0b0c10';c.fillRect(w/2-Math.max(2,w*.003),0,Math.max(4,w*.006),h)}
  if(P.wipeMix>0&&P.wipeMix<1){c.fillStyle='#fff';c.fillRect(w*P.wipeMix-1,0,2,h)}
  if(P.mask){c.fillStyle='rgba(4,5,7,.93)';const ar=w/h;if(P.mask>ar+.01){const vh=w/P.mask,b=(h-vh)/2;c.fillRect(0,0,w,b);c.fillRect(0,h-b,w,b)}else if(P.mask<ar-.01){const vw=h*P.mask,b=(w-vw)/2;c.fillRect(0,0,b,h);c.fillRect(w-b,0,b,h)}}
  if(S.hud)S.hud(c,w,h);
  drawSet(Sn);
  /* textos */
  if(S.cap!==lastCap){elCap.textContent=S.cap;lastCap=S.cap}
  const bk=S.badge+'|'+S.badgeKind;if(bk!==lastBadge){elBadge.hidden=!S.badge;elBadge.textContent=S.badge;elBadge.className='badge '+S.badgeKind;lastBadge=bk}
  const f=Math.floor(t*24),tc='00:00:'+String(Math.floor(f/24)).padStart(2,'0')+':'+String(f%24).padStart(2,'0');if(tc!==lastTc){elTc.textContent=tc;lastTc=tc}
  const ln=Math.round(S.mm||fov2mm(S.cam.fov))+' mm'+(S.lensNote?'  '+S.lensNote:'');if(ln!==lastLens){elLens.textContent=ln;lastLens=ln}
  st(elProg,'width',(t/cur.dur*100).toFixed(1)+'%');
}
function loop(now){const dt=Math.min(.1,(now-last)/1000||0);last=now;if(playing){T+=dt;render()}requestAnimationFrame(loop)}

const ORDER={encuadre:['ews','wide','full','cowboy','medium','mcu','closeup','ecu','insert','twoshot','ots','pov','establishing'],
  angulo:['eye','high','low','topdown','worm','ground','dutch','profile','behind'],
  composicion:['thirds','headroom','leadroom','symmetry','leading','frameinframe','negative','depth','safezone'],
  mov:['static','pan','tilt','pedestal','dolly','zoom','crashzoom','dollyzoom','tracking','leadingshot','steadicam','handheld','crane','orbit','pullout','reveal','drone','fpv','whip','camroll','rack'],
  lente:['focal','aperture','dof','bokeh','macro','fisheye','tiltshift','anamorphic','flare','bloom','exposure','shutter','fps','aspect','vignette','grain'],
  tiempo:['slowmo','speedramp','freeze','bullettime','timelapse'],
  luz:['key','fill','rim','threepoint','highkey','lowkey','hardsoft','split','toplight','under','practical','silhouette','volumetric','golden','bluehour','moonlight','neon'],
  color:['palette','temp','complementary','analogous','triadic','accent','saturation','contrast','grading','lut'],
  edicion:['cut','cutaction','matchcut','jumpcut','jlcut','cutaway','eyeline','reaction','kuleshov','axis','screendir','raccord','crosscut','fade','wipe','splitscreen','asl','beatcut','audiolayers'],
  direccion:['frame','take','coverage','blocking','fight','oner'],
  estilo:['stylereel','noir','western','scifi','melodrama','eighties','retro','cyberpunk','steampunk','documentary','expressionism','horror','vhs','bleach','dayfornight','stopmotion','cel','stylized3d','dreamy','musicvideo','commercial','wes','kubrick','tarantino'],
  ia:['t2v','i2v','v2v','motiontransfer','elements','startend','multishot','motion3','charsheet','consistency','drift','textlogo','pipeline']};
const byId=Object.fromEntries(D.map(d=>[d.id,d]));
const order=CATS.flatMap(c=>{const l=ORDER[c[0]].map(id=>byId[id]).filter(Boolean);D.forEach(d=>{if(d.cat===c[0]&&l.indexOf(d)<0)l.push(d)});return l});
/* ---------- interfaz: modo manual ---------- */
const FMT_OPTS=[['generic',_t('Genérico')],['kling',_t('Kling')],['veo',_t('Veo en Flow')],['runway',_t('Runway')],['seedance',_t('Seedance')],['mjv','Midjourney Video'],['img',_t('Imagen para el frame inicial')]];
const CTRL=[
 [_t('Estilo y formato del prompt'),[
  {k:'style',l:_t('Estilo'),opts:Object.keys(STY).map(k=>[k,STY[k].n])},
  {k:'fmt',l:_t('Formato del prompt'),opts:FMT_OPTS}],
  _t('El estilo carga una combinación de luz, color y textura que después podés ajustar. El formato reordena el prompt según la herramienta.')],
 [_t('Cámara'),[
  {k:'dist',l:_t('Distancia al sujeto'),min:.5,max:30,log:true,f:v=>v.toFixed(1)+' m'},
  {k:'height',l:_t('Altura de la cámara'),min:.1,max:8,step:.05,f:v=>v.toFixed(2)+' m'},
  {k:'aim',l:_t('Altura a la que apunta'),min:0,max:2.5,step:.05,f:v=>v.toFixed(2)+' m'},
  {k:'orbit',l:_t('Posición alrededor del sujeto'),min:-180,max:180,step:1,f:v=>v+'°'},
  {k:'shift',l:_t('Sujeto en el cuadro'),min:-1,max:1,step:.02,f:v=>v<-.2?_t('a la izquierda'):v>.2?_t('a la derecha'):_t('al centro')},
  {k:'roll',l:_t('Inclinación del horizonte'),min:-45,max:45,step:1,f:v=>v+'°'},
  {k:'move',l:_t('Movimiento'),opts:[['none',_t('Ninguno: cámara fija')],['dolly','Dolly in / out'],['zoom',_t('Zoom')],['dollyzoom',_t('Dolly zoom')],['truck',_t('Tracking lateral')],['orbit',_t('Órbita')],['crane',_t('Grúa')],['pan',_t('Paneo')],['tilt',_t('Tilt')],['handheld',_t('Cámara en mano')]]}]],
 [_t('Lente y exposición'),[
  {k:'mm',l:_t('Distancia focal'),min:12,max:200,log:true,f:v=>Math.round(v)+' mm'},
  {k:'fstop',l:_t('Apertura'),opts:[[1.4,'f/1.4'],[2,'f/2'],[2.8,'f/2.8'],[4,'f/4'],[5.6,'f/5.6'],[8,'f/8'],[11,'f/11'],[16,'f/16'],[22,'f/22']],num:true},
  {k:'focus',l:_t('Foco en'),opts:[['subject',_t('El sujeto')],['fg',_t('El primer término')],['bg',_t('El fondo')]]},
  {k:'fg',l:_t('Planta en primer término'),check:true},
  {k:'lights',l:_t('Luces de fondo (para ver el bokeh)'),check:true},
  {k:'shutter',l:_t('Velocidad de obturación'),opts:[[12,'1/12 s'],[24,'1/24 s'],[48,'1/48 s'],[100,'1/100 s'],[250,'1/250 s'],[1000,'1/1000 s']],num:true},
  {k:'fps',l:_t('Cuadros por segundo'),opts:[[12,'12'],[24,'24'],[30,'30'],[60,'60']],num:true},
  {k:'ev',l:_t('Exposición'),min:-2,max:2,step:.1,f:v=>(v>0?'+':'')+v.toFixed(1)+_t(' EV')},
  {k:'aspect',l:_t('Relación de aspecto'),opts:[[0,'16:9'],[2.39,'2.39:1'],[1.3333,'4:3'],[1,'1:1'],[.5625,'9:16']],num:true}],
  _t('El barrido de movimiento se ve cuando el fondo está nítido. Con desenfoque de fondo, el monitor muestra solo el desenfoque.')],
 [_t('Luz'),[
  {k:'amb',l:_t('Ambiente'),opts:[['day',_t('Día')],['golden',_t('Golden hour')],['blue',_t('Blue hour')],['night',_t('Noche')],['sil','Atardecer a contraluz'],['studio',_t('Estudio oscuro')],['highkey',_t('Estudio blanco')]]},
  {k:'keyInt',l:_t('Key: intensidad'),min:0,max:2,step:.05,f:v=>v.toFixed(2)},
  {k:'keyAz',l:_t('Key: de dónde viene'),min:-180,max:180,step:5,f:v=>v+'°'},
  {k:'keyEl',l:_t('Key: altura'),min:5,max:88,step:1,f:v=>v+'°'},
  {k:'hard',l:_t('Luz dura (apagado: suave)'),check:true},
  {k:'kelvin',l:_t('Temperatura de color'),min:2500,max:10000,step:100,f:v=>v+_t(' K')},
  {k:'fill',l:_t('Fill: intensidad'),min:0,max:1.5,step:.05,f:v=>v.toFixed(2)},
  {k:'rim',l:_t('Rim: intensidad'),min:0,max:3,step:.05,f:v=>v.toFixed(2)},
  {k:'lamp',l:_t('Farol (luz práctica)'),min:0,max:3.5,step:.1,f:v=>v.toFixed(1)},
  {k:'fog',l:_t('Niebla'),min:0,max:.09,step:.002,f:v=>Math.round(v/.09*100)+' %'}]],
 [_t('Color y textura'),[
  {k:'lut',l:_t('LUT'),opts:[['none',_t('Ninguno')],['teal','Teal and orange'],['noir',_t('Blanco y negro')],['vint',_t('Vintage cálido')]]},
  {k:'sat',l:_t('Saturación'),min:-1,max:1,step:.05,f:v=>(v>0?'+':'')+Math.round(v*100)},
  {k:'con',l:_t('Contraste'),min:-1,max:1,step:.05,f:v=>(v>0?'+':'')+Math.round(v*100)},
  {k:'vig',l:_t('Viñeta'),min:0,max:1,step:.05,f:v=>Math.round(v*100)+' %'},
  {k:'grain',l:_t('Grano'),min:0,max:1,step:.05,f:v=>Math.round(v*100)+' %'}]],
 [_t('Sujeto'),[
  {k:'action',l:_t('Acción'),opts:[['idle',_t('De pie')],['walk',_t('Caminando')],['talk',_t('Hablando')],['wave',_t('Saludando')],['dance',_t('Bailando')]]},
  {k:'second',l:_t('Segundo personaje'),check:true}]]];
const panel=$('#panel'),ctlEls={};
CTRL.forEach(g=>{const fs=document.createElement('fieldset'),lg=document.createElement('legend');lg.textContent=g[0];fs.appendChild(lg);
  g[1].forEach(it=>{const id='m-'+it.k,w=document.createElement('div');w.className='ctl'+(it.check?' check':'');let inp;
    if(it.check){inp=document.createElement('input');inp.type='checkbox';inp.id=id;const lb=document.createElement('label');lb.htmlFor=id;lb.textContent=it.l;w.appendChild(inp);w.appendChild(lb)}
    else{const row=document.createElement('div');row.className='row';const lb=document.createElement('label');lb.htmlFor=id;lb.textContent=it.l;row.appendChild(lb);let out=null;
      if(it.opts){inp=document.createElement('select');it.opts.forEach(o=>{const op=document.createElement('option');op.value=o[0];op.textContent=o[1];inp.appendChild(op)})}
      else{out=document.createElement('output');out.htmlFor=id;row.appendChild(out);inp=document.createElement('input');inp.type='range';if(it.log){inp.min=Math.log(it.min);inp.max=Math.log(it.max);inp.step=.001}else{inp.min=it.min;inp.max=it.max;inp.step=it.step}}
      inp.id=id;w.appendChild(row);w.appendChild(inp);it.out=out}
    inp.addEventListener(it.opts||it.check?'change':'input',()=>{let v;if(it.check)v=inp.checked;else if(it.opts)v=it.num?parseFloat(inp.value):inp.value;else v=it.log?Math.exp(parseFloat(inp.value)):parseFloat(inp.value);MAN[it.k]=v;
      if(it.k==='amb'){Object.assign(MAN,{fill:0,rim:0,fog:0,lamp:0},AMB[v]);syncPanel()}else if(it.k==='style'){applyStyle(v)}else if(it.out)it.out.textContent=it.f(v);manualChanged()});
    it.inp=inp;ctlEls[it.k]=it;fs.appendChild(w)});
  if(g[2]){const h=document.createElement('p');h.className='hint';h.textContent=g[2];fs.appendChild(h)}
  panel.appendChild(fs)});
function syncPanel(){for(const k in ctlEls){const it=ctlEls[k],v=MAN[k];if(it.check)it.inp.checked=!!v;else if(it.opts)it.inp.value=String(v);else{it.inp.value=it.log?Math.log(v):v;if(it.out)it.out.textContent=it.f(v)}}}
const FMT_NOTE={generic:_t('Formato genérico: plano, movimiento, lente, luz y color, en ese orden.'),kling:_t('Kling: sujeto + movimiento + escena + lenguaje de cámara + luz + atmósfera.'),veo:_t('Veo: cinematografía + sujeto + acción + contexto + estilo y ambiente, con el audio aparte.'),
  runway:_t('Runway: movimiento del sujeto + de cámara + del entorno + estilo.'),seedance:_t('Seedance: duración, planos y formato primero; después estilo, escena y plano por plano.'),mjv:_t('Midjourney Video: solo el movimiento. La imagen de partida ya trae personaje, lugar y luz.'),img:_t('Imagen para el frame inicial: lo que se ve, sin instrucciones, con la relación de aspecto al final.')};
const STYLE_BASE={lut:'none',sat:0,con:0,vig:0,grain:0,fog:0,lamp:0,fill:0,rim:0,lights:false,roll:0,ev:0,aspect:0,hard:true,fps:24,shutter:48};
function applyStyle(v){Object.assign(MAN,STYLE_BASE);const pr=(STY[v]&&STY[v].man)||{};if(pr.amb)Object.assign(MAN,{amb:pr.amb},AMB[pr.amb]);Object.assign(MAN,pr);MAN.style=v;syncPanel()}
function describe(){const m=MAN,i=manInfo,H=i.H,sty=STY[m.style]||STY.none;
  const size=H>=12?['extreme wide shot',_t('Gran plano general')]:H>=4?['wide shot',_t('Plano general')]:H>=2.5?['full shot',_t('Plano entero')]:H>=1.6?['cowboy shot',_t('Plano americano')]:H>=1.15?['medium shot',_t('Plano medio')]:H>=.8?['medium close-up',_t('Plano medio corto')]:H>=.4?['close-up',_t('Primer plano')]:['extreme close-up',_t('Primerísimo primer plano')];
  const p=i.pitch,ang=p>=65?['top-down shot',_t('cenital')]:p>=18?['high angle',_t('picado')]:p<=-50?['worm\'s-eye view',_t('nadir')]:p<=-15?['low angle',_t('contrapicado')]:m.height<.5?['ground-level shot',_t('a ras del suelo')]:['eye level',_t('a nivel de ojos')];
  const ao=Math.abs(m.orbit),side=ao<30?null:ao<65?['three-quarter view',_t('tres cuartos')]:ao<115?['profile view',_t('perfil')]:ao<150?['three-quarter back view',_t('tres cuartos de espaldas')]:['shot from behind',_t('de espaldas')];
  const act={idle:'standing',walk:'walking',talk:'talking',wave:'waving',dance:'dancing'}[m.action];
  const verb={idle:'stands still, glancing around',walk:'walks across the frame',talk:'talks, gesturing with one hand',wave:'waves at the camera',dance:'dances with energy, arms up'}[m.action];
  const subj='a person in a red shirt'+(m.second?' with a friend in a teal shirt':'');
  const shotStr=size[0]+', '+ang[0]+(side?', '+side[0]:'')+(Math.abs(m.roll)>=8?', dutch angle':'')+(Math.abs(m.shift)>.2?', subject on the '+(m.shift<0?'left':'right')+' third':'');
  const mv={none:'static camera',dolly:'slow dolly in',zoom:'slow zoom in',dollyzoom:'dolly zoom',truck:'tracking shot',orbit:'orbit shot around the subject',crane:'crane shot rising',pan:'slow pan',tilt:'tilt up',handheld:'handheld camera'}[m.move];
  const mm=Math.round(m.mm);let lens=mm+'mm '+(mm<24?'wide-angle ':mm>70?'telephoto ':'')+'lens, f/'+m.fstop;
  if(i.dofOn&&m.focus==='fg')lens+=', foreground in focus, subject out of focus';else if(i.dofOn&&m.focus==='bg')lens+=', background in focus, subject out of focus';else if(i.bg>7)lens+=', shallow depth of field'+(m.lights?', soft bokeh lights':', soft background');else if(i.bg<1.5)lens+=', deep focus';
  const amb={day:'daylight',golden:'golden hour',blue:'blue hour',night:'night',sil:'sunset sky',studio:'studio lighting',highkey:'high-key lighting'}[m.amb];const li=[amb];
  if(m.keyInt>.15){let rel=((m.keyAz-m.orbit)%360+540)%360-180;const ar=Math.abs(rel);li.push(m.keyEl>=72?'top light':ar<35?'front lighting':ar<115?'side lighting from the '+(rel>0?'right':'left'):'backlit');li.push(m.hard?'hard light, crisp shadows':'soft diffused light')}
  else if(m.fill<.15&&m.rim<.15&&m.lamp<.2&&(m.amb==='sil'||m.amb==='studio'))li.push('silhouette');
  if(m.fill>.25)li.push('soft fill light');if(m.rim>.5)li.push('rim light');
  if(m.keyInt>.9&&m.fill<.15&&(m.amb==='studio'||m.amb==='night'))li.push('low-key, deep shadows');
  if(m.keyInt>.15){if(m.kelvin<4000)li.push('warm light');else if(m.kelvin>7000)li.push('cool blue light')}
  if(m.lamp>.3)li.push('lit by a practical street lamp');if(m.fog>.045)li.push(m.lamp>.3?'fog, volumetric light rays':'thick fog');else if(m.fog>.012)li.push('light haze');
  const light=li.join(', ');
  const co=[];if(m.lut==='teal')co.push('teal and orange color grade');if(m.lut==='noir')co.push('black and white');if(m.lut==='vint')co.push('warm vintage film look');
  if(m.sat<-.4)co.push('desaturated colors');else if(m.sat>.4)co.push('vivid saturated colors');if(m.con>.4)co.push('high contrast');else if(m.con<-.4)co.push('low contrast, flat look');
  if(m.ev<=-1)co.push('underexposed, moody');else if(m.ev>=1)co.push('overexposed, blown highlights');if(m.vig>.3)co.push('vignette');if(m.grain>.3)co.push('35mm film grain');
  const fr=i.frac;const motion=[m.fps===12?'choppy 12 fps look':m.fps>=60?'smooth 60 fps':m.fps+' fps',fr>=1.5?'heavy motion blur':fr>=.35?'natural motion blur':_t('crisp motion, no motion blur')];
  const arS=({2.39:'2.39:1',1.3333:'4:3',1:'1:1',.5625:'9:16'})[m.aspect]||'16:9', arMJ=({2.39:'12:5',1.3333:'4:3',1:'1:1',.5625:'9:16'})[m.aspect]||'16:9';
  const look=co.join(', '), styleEn=sty.en||'', stylePart=[styleEn,look].filter(Boolean).join(', ');
  const place=sty.place||{day:'in a park with pine trees, a small house and a street lamp',golden:'in a park with pine trees at sunset',blue:'in a park at dusk, the street lamp just turned on',night:'in a park at night under a street lamp',sil:'on open ground against a sunset sky',studio:'in a dark studio with a black background',highkey:'in a bright white studio'}[m.amb];
  const mood=sty.mood||{day:'calm',golden:'warm, nostalgic',blue:'quiet, melancholic',night:'mysterious',sil:'epic',studio:'dramatic',highkey:'clean, upbeat'}[m.amb];
  const envMotion=sty.env||(m.fog>.012?'fog drifting slowly':m.lights?'background lights twinkling':(m.amb==='studio'||m.amb==='highkey')?'dust floating in the light':'pine branches swaying in the wind');
  const sfx=m.action==='walk'?'footsteps on gravel':m.action==='dance'?'sneakers squeaking, clothes rustling':m.action==='talk'?'clothes rustling':'a soft breath';
  const ambA=sty.amb||((m.amb==='studio'||m.amb==='highkey')?'quiet room tone':(m.amb==='night'||m.amb==='blue')?'crickets and distant traffic':'birds and a light breeze');
  const hiMotion=m.action==='walk'||m.action==='dance'||['orbit','handheld','truck','crane','dollyzoom'].indexOf(m.move)>=0;
  const C=x=>x.charAt(0).toUpperCase()+x.slice(1);let out;
  switch(m.fmt){
    case 'kling':out=C(subj)+' '+verb+', '+place+'. '+C(shotStr)+', '+mv+', '+lens+'. '+C(light)+'. '+(stylePart?C(stylePart)+', '+mood:C(mood))+' atmosphere.';break;
    case 'veo':out=C(shotStr)+', '+mv+': '+subj+' '+verb+', '+place+'. '+(stylePart?C(stylePart)+', ':'')+light+', '+mood+' mood. SFX: '+sfx+'. Ambient: '+ambA+'.';break;
    case 'runway':out='The person '+verb+'. '+C(mv)+'. '+C(envMotion)+'. '+C(styleEn||'cinematic live action')+', '+light+'.';break;
    case 'seedance':out='8s, 1 shot, '+arS+'. Style: '+(stylePart||'cinematic')+', '+light+'. Scene: '+subj+', '+place+', '+mood+' mood. Shot 1 (0-8s): '+shotStr+', '+mv+'; the person '+verb+'.';break;
    case 'mjv':out='The person '+verb+', '+mv+' --motion '+(hiMotion?'high':'low');break;
    case 'img':out=C(subj)+' '+act+', '+place+', '+shotStr+', '+lens+', '+light+', '+(stylePart?stylePart+', ':'')+'film still --ar '+arMJ;break;
    default:{const en=[shotStr+', of '+subj+' '+act+' '+place,mv,lens,light,co.concat(motion).join(', ')];if(m.aspect)en[4]+=', '+arS+' aspect ratio';if(styleEn)en.push(styleEn);out=en.filter(Boolean).map(C).join('. ')+'.'}
  }
  $('#m-read').textContent=size[1]+', '+ang[1]+(side?', '+side[1]:'');
  $('#m-sub').textContent=_t('Entran ')+(H>=10?Math.round(H):H.toFixed(1))+_t(' m de alto en el cuadro a la distancia del sujeto. Lente de ')+mm+' mm a f/'+m.fstop+(i.dofOn?_t(', con el fondo desenfocado.'):_t(', con todo en foco.'));
  out=out.split('. ').map(x=>{const seen=new Set();return x.split(', ').filter(y=>{const k=y.toLowerCase();if(seen.has(k))return false;seen.add(k);return true}).join(', ')}).join('. ');
  $('#m-prompt').textContent=out;
  $('#m-formula').textContent=FMT_NOTE[m.fmt]+(m.style!=='none'?_t(' Estilo cargado: ')+sty.n+'.':'');
}
let fitPending=false;
function manualChanged(){if(mode!=='man')return;if(!fitPending){fitPending=true;requestAnimationFrame(()=>{fitPending=false;fitWitness(MANUAL,true)})}const S=fresh(0);manualFn(((T%8)+8)%8,S,fresh(0));describe();if(!playing)render()}
const esc=x=>String(x).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const copyBtn=_t('<button type="button" data-copy>Copiar</button>');
function gHTML(g){const o=['<div class="eyebrow">'+esc(g.g)+'</div><h2>'+esc(g.t)+'</h2><p>'+esc(g.lead)+'</p>'];
  if(g.anat)o.push(_t('<div><span class="lbl">Anatomía del prompt</span><div class="legend">')+g.anat.map((a,i)=>'<span class="seg k'+(i%6+1)+'">'+esc(a[0])+'</span>').join('')+'</div><div class="prompt long"><code>'+g.anat.map((a,i)=>'<span class="seg k'+(i%6+1)+'">'+esc(a[1])+'</span>').join(' ')+'</code>'+copyBtn+'</div></div>');
  (g.tpl||[]).forEach(x=>o.push('<div><span class="lbl">'+esc(x.h)+'</span><div class="prompt long"><code>'+esc(x.code)+'</code>'+copyBtn+'</div></div>'));
  (g.lists||[]).forEach(x=>{const tg=x.ol?'ol':'ul';o.push('<div><span class="lbl">'+esc(x.h)+'</span><'+tg+'>'+x.items.map(i=>'<li>'+esc(i)+'</li>').join('')+'</'+tg+'></div>')});
  if(g.tbl)o.push('<div class="tbl"><table><thead><tr>'+g.tbl.head.map(x=>'<th>'+esc(x)+'</th>').join('')+'</tr></thead><tbody>'+g.tbl.rows.map(r=>'<tr>'+r.map(x=>'<td>'+esc(x)+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>');
  if(g.lim)o.push(_t('<p><span class="lbl">Límite</span>')+esc(g.lim)+'</p>');
  if(g.err)o.push(_t('<p><span class="lbl">Error típico</span>')+esc(g.err)+'</p>');
  if(g.note)o.push('<p class="g-note">'+esc(g.note)+'</p>');
  if(g.man)o.push('<div class="go-row"><button type="button" class="go solid" data-man="'+g.man+_t('">Armar este prompt en el modo manual</button></div>'));
  const bt=(g.go||[]).filter(id=>byId[id]).map(id=>'<button type="button" class="go" data-go="'+id+'">'+esc(byId[id].es)+'</button>');
  if(bt.length)o.push(_t('<div><span class="lbl">Ver en el glosario</span><div class="go-row">')+bt.join('')+'</div></div>');
  o.push('<p class="g-note">'+esc(SRCNOTE)+'</p>');return o.join('')}
function copyText(el,b){const done=()=>{b.textContent=_t('Copiado');setTimeout(()=>b.textContent=_t('Copiar'),1400)};const sel=()=>{const r=document.createRange();r.selectNodeContents(el);const s=getSelection();s.removeAllRanges();s.addRange(r);b.textContent=_t('Seleccionado');setTimeout(()=>b.textContent=_t('Copiar'),1400)};
  try{navigator.clipboard.writeText(el.textContent).then(done,sel)}catch(e){sel()}}
