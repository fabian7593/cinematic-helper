
/* ================= v4: producción, funciones de herramientas y biblioteca de estilos ================= */
/* cat:'x' = no entra al glosario; vive en Producción, Herramientas y Estilos */
function wrapL(c,txt,mw){const out=[];String(txt).split('\n').forEach(par=>{let line='';par.split(' ').forEach(wd=>{const tl=line?line+' '+wd:wd;if(c.measureText(tl).width>mw&&line){out.push(line);line=wd}else line=tl});out.push(line)});return out}
const mono=(c,fs,wt)=>{c.font=(wt||500)+' '+fs+'px "IBM Plex Mono",monospace';c.textBaseline='top';c.textAlign='left'};
/* tarjetas de texto que aparecen una por una; pick resalta la elegida */
function cardsHud(head,items,k,pick,cover){return (c,w,h)=>{if(cover>0){c.fillStyle='rgba(12,13,17,'+cover.toFixed(2)+')';c.fillRect(0,0,w,h)}if(cover<.05)return;c.globalAlpha=Math.min(1,cover*1.2);
  const fs=fpx(w,.023),bw=Math.min(w*.82,w-24),x=(w-bw)/2,pad=fs*.8,gap=fs*.8;mono(c,fs);
  const L=items.map(s=>wrapL(c,s,bw-pad*2-fs*2.2)),hs=L.map(l=>pad*2+l.length*fs*1.4-fs*.4),tot=hs.reduce((a,b)=>a+b,0)+gap*(items.length-1)+fs*2.2;let y=Math.max(h*.14,(h-tot)/2);
  label(c,w,head,x,y,'left',.02);y+=fs*2.2;const per=1/items.length;
  items.forEach((s,i)=>{const kk=clamp((k-i*per)/per,0,1);if(kk<=0){y+=hs[i]+gap;return}const on=pick===i;
    c.fillStyle=on?'rgba(255,90,79,.18)':'rgba(30,33,40,.95)';c.fillRect(x,y,bw,hs[i]);c.strokeStyle=on?'#ff5a4f':'rgba(255,255,255,.25)';c.lineWidth=on?2:1;c.strokeRect(x+.5,y+.5,bw-1,hs[i]-1);
    mono(c,fs,600);c.fillStyle=on?'#ff5a4f':'#8c93a1';c.fillText(String(i+1),x+pad,y+pad);mono(c,fs);c.fillStyle='#e8ebf0';let left=Math.floor(s.length*kk);
    L[i].forEach((l,j)=>{if(left<=0)return;c.fillText(l.slice(0,left),x+pad+fs*2.2,y+pad+j*fs*1.4);left-=l.length+1});
    if(on){c.font='600 '+fs*.85+'px "IBM Plex Mono",monospace';c.textAlign='right';c.fillStyle='#ff5a4f';c.fillText('ELEGIDA',x+bw-pad,y+pad);c.textAlign='left'}y+=hs[i]+gap});c.globalAlpha=1}}
/* página de guion con formato estándar */
function scriptHud(lines,k,cover){return (c,w,h)=>{if(cover<=.01)return;c.globalAlpha=Math.min(1,cover);const pw=Math.min(w*.5,h*.95*.78),ph=h*.9,x=w*.05,y=h*.05,fs=Math.max(10,pw*.034);
  c.fillStyle='#f5f2ea';c.fillRect(x,y,pw,ph);c.fillStyle='rgba(0,0,0,.25)';c.fillRect(x+pw,y+6,6,ph);mono(c,fs);let yy=y+fs*2,left=Math.floor(lines.reduce((a,l)=>a+l.t.length,0)*clamp(k,0,1));
  lines.forEach(l=>{if(left<=0)return;const ind=l.s==='char'?.36:l.s==='paren'?.28:l.s==='dia'?.18:0,mw=l.s==='dia'?pw*.6:pw*.84;c.font=(l.s==='slug'||l.s==='char'?700:500)+' '+fs+'px "IBM Plex Mono",monospace';
    const ls=wrapL(c,l.t,mw);ls.forEach(s=>{if(left<=0)return;c.fillStyle='#16181d';c.fillText(s.slice(0,left),x+pw*.08+pw*ind,yy);left-=s.length+1;yy+=fs*1.35});yy+=l.s==='char'||l.s==='paren'?0:fs*.8});c.globalAlpha=1}}
/* imagen de baja resolución: toma el cuadro compuesto y lo achica */
const LR=document.createElement('canvas'),lrx=LR.getContext('2d');
function lowresHud(f,x0,x1,smooth,filt){return (c,w,h)=>{const W=cBg.width,H=cBg.height,sx=Math.round(W*x0),sw=Math.max(1,Math.round(W*(x1-x0))),lw=Math.max(2,Math.round(sw*f)),lh=Math.max(2,Math.round(H*f));
  LR.width=lw;LR.height=lh;lrx.imageSmoothingEnabled=true;lrx.filter=filt||'none';lrx.drawImage(cBg,sx,0,sw,H,0,0,lw,lh);lrx.filter='none';c.save();c.imageSmoothingEnabled=!!smooth;c.drawImage(LR,0,0,lw,lh,w*x0,0,w*(x1-x0),h);c.restore()}}
function halftoneHud(a){return (c,w,h)=>{const s=Math.max(5,w/150);c.save();c.globalCompositeOperation='multiply';c.fillStyle='rgba(20,20,40,'+a+')';for(let y=0;y<h;y+=s)for(let x=(y/s)%2?s/2:0;x<w;x+=s){c.beginPath();c.arc(x,y,s*.28,0,PI*2);c.fill()}c.restore();
  const b=Math.max(6,w*.012);c.fillStyle='#fbf8ef';c.fillRect(0,0,w,b);c.fillRect(0,h-b,w,b);c.fillRect(0,0,b,h);c.fillRect(w-b,0,b,h);c.strokeStyle='#111';c.lineWidth=Math.max(2,w/320);c.strokeRect(b,b,w-2*b,h-2*b)}}
function irisHud(t){return (c,w,h)=>{const g=c.createRadialGradient(w/2,h/2,h*.3,w/2,h/2,h*.72);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,.95)');c.fillStyle=g;c.fillRect(0,0,w,h);
  const f=Math.floor(t*16);c.strokeStyle='rgba(255,255,255,.35)';c.lineWidth=1;for(let i=0;i<3;i++){if(hsh(f*3+i)<.5)continue;const x=hsh(f+i*11)*w;c.beginPath();c.moveTo(x,0);c.lineTo(x+(hsh(f+i)-.5)*8,h);c.stroke()}
  c.fillStyle='rgba(255,255,255,'+(.04*hsh(f)).toFixed(3)+')';c.fillRect(0,0,w,h)}}
function leakHud(t){return (c,w,h)=>{c.save();c.globalCompositeOperation='screen';const x=w*(1.05+.12*Math.sin(t*.9)),g=c.createRadialGradient(x,h*.3,0,x,h*.3,w*.55);g.addColorStop(0,'rgba(255,140,40,.55)');g.addColorStop(.5,'rgba(255,60,30,.18)');g.addColorStop(1,'rgba(255,60,30,0)');c.fillStyle=g;c.fillRect(0,0,w,h);c.restore();
  const r=w*.05;c.fillStyle='#000';[[0,0,1,1],[w,0,-1,1],[0,h,1,-1],[w,h,-1,-1]].forEach(q=>{c.beginPath();c.moveTo(q[0],q[1]);c.lineTo(q[0]+q[2]*r,q[1]);c.quadraticCurveTo(q[0],q[1],q[0],q[1]+q[3]*r);c.closePath();c.fill()})}}
function camcorderHud(t){return (c,w,h)=>{const fs=fpx(w,.034);c.font='700 '+fs+'px "IBM Plex Mono",monospace';c.textBaseline='top';c.shadowColor='rgba(0,0,0,.7)';c.shadowBlur=2;c.fillStyle='#ffb02e';c.textAlign='right';
  c.fillText('08 14 2003',w*.95,h*.82);c.fillText('4:31:'+String(10+Math.floor(t)%50)+' PM',w*.95,h*.82+fs*1.15);c.textAlign='left';c.fillText('▶ '+(Math.floor(t*2)%2?'':'●'),w*.05,h*.06);c.shadowBlur=0}}
function gridHud(c,w,h){c.save();c.strokeStyle='rgba(255,92,205,.55)';c.lineWidth=Math.max(1,w/700);const hy=h*.62;for(let i=-12;i<=12;i++){c.beginPath();c.moveTo(w/2+i*w*.02,hy);c.lineTo(w/2+i*w*.22,h);c.stroke()}for(let j=0;j<9;j++){const k=Math.pow((j+((T*.6)%1))/9,2.2),y=hy+(h-hy)*k;c.beginPath();c.moveTo(0,y);c.lineTo(w,y);c.stroke()}c.restore()}
function boardHud(n,txt,arrow,sketch){return (c,w,h)=>{const b=Math.max(8,w*.016);c.fillStyle=sketch?'#f2efe6':'#111';c.fillRect(0,0,w,b);c.fillRect(0,h-b*3.2,w,b*3.2);c.fillRect(0,0,b,h);c.fillRect(w-b,0,b,h);
  c.strokeStyle=sketch?'#222':'#ffd24a';c.lineWidth=Math.max(2,w/400);c.strokeRect(b,b,w-2*b,h-b*4.2);c.font='600 '+fpx(w,.026)+'px "Barlow Condensed","Arial Narrow",sans-serif';c.textBaseline='middle';c.fillStyle=sketch?'#222':'#fff';c.textAlign='left';
  c.fillText((sketch?'PANEL ':'FRAME ')+n,b*1.4,h-b*1.6);c.textAlign='right';c.fillText(txt,w-b*1.4,h-b*1.6);if(!arrow)return;
  c.strokeStyle='#ff3b30';c.fillStyle='#ff3b30';c.lineWidth=Math.max(3,w/220);const ah=w*.022,arr=(x0,y0,x1,y1)=>{c.beginPath();c.moveTo(x0,y0);c.lineTo(x1,y1);c.stroke();const a=Math.atan2(y1-y0,x1-x0);c.beginPath();c.moveTo(x1,y1);c.lineTo(x1-ah*Math.cos(a-.45),y1-ah*Math.sin(a-.45));c.lineTo(x1-ah*Math.cos(a+.45),y1-ah*Math.sin(a+.45));c.closePath();c.fill()};
  const cx=w/2,cy=(h-b*3.2)/2;if(arrow==='in'){[[.12,.14],[.88,.14],[.12,.72],[.88,.72]].forEach(p=>arr(w*p[0],h*p[1],w*(p[0]+(.5-p[0])*.3),h*(p[1]+(.43-p[1])*.3)))}
  else if(arrow==='right')arr(w*.3,cy,w*.7,cy);else if(arrow==='up')arr(w*.9,h*.66,w*.9,h*.16);else if(arrow==='orbit'){c.beginPath();c.ellipse(cx,h*.7,w*.3,h*.06,0,.2,PI-.2);c.stroke();arr(cx-w*.27,h*.72,cx-w*.3,h*.69)}}}
/* línea de tiempo con bloques y marcas */
function tlHud(blocks,total,now,marks){return (c,w,h)=>{const x0=w*.05,x1=w*.95,y=h*.84,bh=Math.max(10,h*.035),X=v=>x0+(x1-x0)*v/total;c.fillStyle='rgba(0,0,0,.6)';c.fillRect(x0-8,y-fpx(w,.02)*1.6-8,x1-x0+16,bh+fpx(w,.02)*1.6+18);
  blocks.forEach(b=>{const e=Math.min(b[1],b.grow?Math.max(b[0],now):b[1]);c.fillStyle=b[3]||'#8d95a3';c.fillRect(X(b[0]),y,X(e)-X(b[0])-2,bh);label(c,w,b[2],X(b[0])+4,y-fpx(w,.02)*1.4,'left',.019)});
  (marks||[]).forEach(m=>{const x=X(m);c.fillStyle='#ffd24a';c.beginPath();c.moveTo(x,y-5);c.lineTo(x+7,y+bh/2);c.lineTo(x,y+bh+5);c.lineTo(x-7,y+bh/2);c.closePath();c.fill()});
  c.fillStyle='#ff5a4f';c.fillRect(X(Math.min(now,total))-1,y-7,3,bh+14)}}

/* ---------- producción ---------- */
const IDEAS=['Alguien espera bajo un farol una señal que nunca llega.','Un farol que solo se enciende cuando pasa una persona.','La última noche de un parque antes de que lo cierren.'];
add({id:'idea',cat:'x',es:'De la premisa a la idea',en:'Give me 10 short film ideas about [tema], each in one sentence: who wants what, and what stops them.',dur:11,
  what:'Se generan muchas ideas cortas, se elige una y se convierte en imagen. La IA propone; la elección es tuya.',
  look:'Tres ideas aparecen escritas, se elige la segunda y el plano la muestra.',
  fn(t,S){S.look=mk(Object.assign({},LOOKS.blue,{lamp:t>8.2?lerp(.2,2.3,ss((t-8.2)/.6)):.2}));S.A.x=LAMP[0]+.8;S.A.z=LAMP[1]+.3;S.A.ry=-.6;S.A.headYaw=t>8.6?-.3:.2*Math.sin(t);S.A.wave=t>9?pp(t-9,2,.2):0;
    setCam(S,{p:[1.2,1.5,1.7],t:[3.4,1.35,-2.8],fov:40});const cov=t<6.4?1:1-ss((t-6.4)/.8);S.cap=t<5.2?'1. Muchas ideas':t<6.6?'2. Elegir una':'3. Verla';
    S.hud=cardsHud('IDEAS',IDEAS,t/4.6,t>5.2?1:-1,cov)}});
add({id:'beats',cat:'x',es:'Estructura de la historia',en:'setup, inciting incident, rising conflict, climax, resolution',dur:12.5,
  what:'Cada historia corta sube de tensión hasta un clímax y se resuelve. La curva de abajo marca en qué parte va.',
  look:'Planteamiento de día y en calma, el detonante cambia la luz, el conflicto llega con lluvia, el clímax es el farol que se enciende y la resolución es el amanecer.',
  fn(t,S){const B=[0,2.5,5,8,10.2,12.5],i=B.findIndex((b,j)=>t>=b&&t<B[j+1]),l=t-B[Math.max(0,i)];
    if(i<=0){S.look=mk(LOOKS.day);walkX(S.A,t,10,-2.4,0);S.A.z=.4;setCam(S,{p:[0,1.5,5.4],t:[S.A.x*.5,1.15,0],fov:36})}
    else if(i===1){S.look=mixLook(mk(LOOKS.day),mk(LOOKS.blue),ss(l/2.5));S.A.x=-1.2;S.A.z=.4;S.A.ry=.5;S.A.headYaw=-.5;setCam(S,{p:[.4,1.5,lerp(5,3.6,ss(l/2.5))],t:[-1.2,1.3,0],fov:36})}
    else if(i===2){S.look=mk(Object.assign({},LOOKS.night,{fogD:.03}));walkX(S.A,l,3,-1.2,LAMP[0]-.2);S.A.z=lerp(.4,LAMP[1]+.4,ss(l/3));setCam(S,{p:[S.A.x+.6+.06*Math.sin(t*9),1.4+.04*Math.sin(t*7),S.A.z+2.4],t:[S.A.x,1.3,S.A.z],fov:36});S.hud=rainHud(t)}
    else if(i===3){S.look=mk(Object.assign({},LOOKS.night,{lamp:lerp(.2,3,ss(l/.5))}));S.A.x=LAMP[0]-.2;S.A.z=LAMP[1]+.4;S.A.ry=.3;S.A.headYaw=.4;setCam(S,{p:[S.A.x+Math.sin(.6)*1.5,1.6,S.A.z+Math.cos(.6)*1.5],t:[S.A.x,1.55,S.A.z],fov:32})}
    else{S.look=mk(Object.assign({},LOOKS.golden,{sunP:[8,1.5,-4]}));S.A.x=LAMP[0]-.2;S.A.z=LAMP[1]+.4;S.A.ry=-.4;S.A.wave=pp(l,2.3,.2);setCam(S,{p:[0,2.6,7],t:[2,1,-2],fov:40})}
    const names=['Planteamiento','Detonante','Conflicto','Clímax','Resolución'];S.cap=names[Math.max(0,i)];const prev=S.hud;
    S.hud=hudAll(prev,(c,w,h)=>{const x0=w*.06,x1=w*.94,yb=h*.93,ht=h*.16,X=v=>x0+(x1-x0)*v/12.5,Y=v=>yb-ht*v,pts=[[0,.12],[2.5,.3],[5,.5],[8,.78],[10.2,1],[11,.35],[12.5,.15]];
      c.fillStyle='rgba(0,0,0,.5)';c.fillRect(x0-10,yb-ht-14,x1-x0+20,ht+22);c.strokeStyle='rgba(255,255,255,.85)';c.lineWidth=Math.max(2,w/450);c.beginPath();pts.forEach((p,j)=>j?c.lineTo(X(p[0]),Y(p[1])):c.moveTo(X(p[0]),Y(p[1])));c.stroke();
      let v=0;for(let j=0;j<pts.length-1;j++)if(t>=pts[j][0]&&t<=pts[j+1][0])v=lerp(pts[j][1],pts[j+1][1],(t-pts[j][0])/(pts[j+1][0]-pts[j][0]));c.fillStyle='#ff5a4f';c.beginPath();c.arc(X(t),Y(v),Math.max(4,w*.007),0,PI*2);c.fill()})}});
const SCRIPT=[{s:'slug',t:'EXT. PARQUE – ANOCHECER'},{s:'act',t:'Una persona espera junto al farol apagado. Mira el reloj.'},{s:'char',t:'PERSONA'},{s:'paren',t:'(en voz baja)'},{s:'dia',t:'Siempre llegás tarde.'},{s:'act',t:'El farol se enciende. Sonríe.'}];
add({id:'script',cat:'x',es:'Guion de una escena',en:'Write the scene in screenplay format: scene heading, action, character, dialogue. One page = about one minute.',dur:11,
  what:'El guion dice lugar y hora, lo que se ve, quién habla y qué dice. Una página en este formato dura más o menos un minuto en pantalla.',
  look:'La página se escribe con su formato: encabezado de escena, acción, personaje y diálogo. Después la misma escena se ve en el monitor.',
  fn(t,S){S.look=mk(Object.assign({},LOOKS.blue,{lamp:t>8.6?lerp(.2,2.3,ss((t-8.6)/.5)):.2}));S.A.x=LAMP[0]+.8;S.A.z=LAMP[1]+.3;S.A.ry=-.6;S.A.talk=t>7.4&&t<8.6?1:0;S.A.headYaw=t>8.8?-.2:.1;
    setCam(S,{p:[1.2,1.5,1.7],t:[3.4,1.35,-2.8],fov:40});S.post.css=t<6.4?{filter:'brightness(.55) saturate(.6)'}:null;const cov=t<6.2?1:1-ss((t-6.2)/.6);S.cap=t<6.2?'La página':'La escena';S.hud=scriptHud(SCRIPT,t/5.6,cov)}});
const CSCRIPT=[{n:'Acto 1 · cálido',look:Object.assign({},LOOKS.golden),sw:['#f7b56d','#a18a5b','#b4482f']},{n:'Acto 2 · frío',look:Object.assign({},LOOKS.blue,{lamp:.2}),sw:['#131f45','#56648f','#7482b3']},
  {n:'Clímax · rojo',look:{skyTop:'#120406',skyBot:'#3a0c12',fog:'#2a0a10',fogD:.035,hemi:.12,hemiSky:'#ff4a4a',hemiGnd:'#100406',sun:1.3,sunC:'#ff2a2a',sunP:[-4,2,2.6],fill:.6,fillC:'#ff8a3a',ground:'#2a1416',foliage:'#1e0c10',lamp:1.2,win:1},sw:['#3a0c12','#ff2a2a','#ff8a3a']},
  {n:'Final · pastel',look:{skyTop:'#9ec3e6',skyBot:'#f8d9c4',fog:'#f2dccc',fogD:.016,hemi:.85,hemiSky:'#fff0e6',hemiGnd:'#b9a69a',sun:.7,sunC:'#ffe0c8',sunP:[6,3,5],ground:'#c9b8a0',foliage:'#9fb59a'},sw:['#9ec3e6','#f8d9c4','#9fb59a']}];
add({id:'colorscript',cat:'x',es:'Guion de color',en:'color script: act 1 warm amber, act 2 cold desaturated blue, climax saturated red, ending soft pastel',dur:12,
  what:'Un guion de color asigna una paleta a cada parte de la historia, para que el color cuente cómo cambia el ánimo.',
  look:'La misma escena cambia de paleta en cada acto. Abajo se arma la tira de color de todo el corto, como la hacen los estudios de animación.',
  fn(t,S){const i=Math.min(3,Math.floor(t/3)),l=t-i*3,p=CSCRIPT[i],q=CSCRIPT[Math.max(0,i-1)];S.look=mixLook(mk(q.look),mk(p.look),i?ss(l/.7):1);conv(S);S.B.vis=i!==1&&i!==3?true:false;S.A.ry=i===1?0:PI/2;S.A.headYaw=i===1?.4:0;
    setCam(S,{p:[Math.sin(t*.25)*.6,1.5,5],t:[0,1.15,0],fov:36});if(i===2){S.post.css={filter:'saturate(1.3) contrast(1.1)'}}S.cap=p.n;
    S.hud=(c,w,h)=>{const x0=w*.05,x1=w*.95,sw=(x1-x0)/4,y=h*.82,bh=h*.09;c.fillStyle='rgba(0,0,0,.55)';c.fillRect(x0-8,y-8,x1-x0+16,bh+16);
      CSCRIPT.forEach((s,j)=>{const on=j<=i;s.sw.forEach((col,m)=>{c.globalAlpha=on?1:.18;c.fillStyle=col;c.fillRect(x0+j*sw+m*(sw/3)+2,y,sw/3-4,bh)});c.globalAlpha=1;if(j===i){c.strokeStyle='#fff';c.lineWidth=2;c.strokeRect(x0+j*sw+1,y-3,sw-2,bh+6)}})}}});
const BOARDS=[{n:1,txt:'PG · fijo',a:null,cam:S=>setCam(S,{p:[0,2.4,9],t:[2,1,-2],fov:40})},{n:2,txt:'PM · travelling',a:'right',cam:(S,l)=>{walkX(S.A,l,2.2,-1.6,.4);setCam(S,{p:[S.A.x+.2,1.4,3],t:[S.A.x,1.25,0],fov:38})}},
  {n:3,txt:'Contrapicado · tilt up',a:'up',cam:S=>{S.A.x=LAMP[0]-.3;S.A.z=LAMP[1]+.5;setCam(S,{p:[LAMP[0]+.6,.35,LAMP[1]+2.6],t:[LAMP[0],2.6,LAMP[1]],fov:40})}},{n:4,txt:'PP · dolly in',a:'in',cam:(S,l)=>{S.A.x=LAMP[0]-.3;S.A.z=LAMP[1]+.5;S.A.ry=.3;setCam(S,{p:[S.A.x+Math.sin(.6)*lerp(2.1,1.45,ss(l/2.2)),1.6,S.A.z+Math.cos(.6)*lerp(2.1,1.45,ss(l/2.2))],t:[S.A.x,1.56,S.A.z],fov:32})}}];
add({id:'storyboard',cat:'x',es:'Storyboard',en:'storyboard panel, rough pencil sketch, black and white, camera arrows, shot number and shot type',dur:12,
  what:'El storyboard dibuja cada plano antes de generar: encuadre, ángulo y hacia dónde se mueve la cámara. Con IA, cada cuadro se vuelve el frame inicial del plano.',
  look:'Cuatro paneles en boceto con su número, el tipo de plano y la flecha del movimiento. Al final el último panel pasa a frame terminado.',
  fn(t,S){S.look=mk(Object.assign({},LOOKS.blue,{lamp:2}));S.A.x=-1;S.A.ry=PI/2;S.A.headYaw=0;const fin=t>=8.8,i=fin?3:Math.floor(t/2.2),l=fin?2.2:t-i*2.2,b=BOARDS[i];b.cam(S,l);
    S.tt=fin?null:0;S.post.css=fin?null:{filter:'grayscale(1) url(#poster) contrast(1.5) brightness(1.2)'};S.cap=fin?'Del boceto al frame':'Panel '+b.n+' de 4';S.hud=boardHud(b.n,b.txt,fin?null:b.a,!fin)}});
const IMGP='Film still, a person in a red shirt standing under a street lamp in a park at blue hour, soft haze, 35mm, shallow depth of field, 16:9';
add({id:'imagegen',cat:'x',es:'Generar la imagen',en:IMGP,dur:10.5,
  what:'Para un plano con personaje se genera primero la imagen: varias variantes del mismo prompt, se elige una y esa es el frame inicial del video.',
  look:'Después del prompt salen cuatro variantes, cada una con detalles distintos. Se elige una y queda marcada como frame inicial.',
  fn(t,S){S.look=mk(Object.assign({},LOOKS.blue,{lamp:2}));S.A.x=LAMP[0]+.7;S.A.z=LAMP[1]+.3;S.A.ry=-.5;S.A.headYaw=0;S.tt=0;const V=[{s:'#b4482f',h:null,c:[1.2,1.5,1.7]},{s:'#b4482f',h:'#2a2a2a',c:[.6,1.3,2.2]},{s:'#c0392b',h:null,c:[1.8,1.7,1.2]},{s:'#9a3324',h:'#c0392b',c:[1,1.4,2.6]}];
    const g=t<2.4?0:t<3.4?ss((t-2.4)):1,vi=t<3.4?1:t<7.4?Math.floor((t-3.4))%4:1,v=V[vi];S.A.shirt=v.s;S.A.hat=v.h;setCam(S,{p:v.c,t:[3.4,1.35,-2.8],fov:40});if(g<1)S.post.css={filter:'blur('+(14*(1-g)).toFixed(1)+'px)'};
    S.cap=t<2.4?'El prompt de imagen':t<7.4?'Variante '+(vi+1)+' de 4':'Elegida: frame inicial';if(t>=7.4){S.badge='Frame inicial';S.badgeKind='ok'}
    S.hud=hudAll(noiseHud(t<2.4?1:1-g),t<2.9?typeHud(IMGP,t/2,t<2.4?1:1-ss((t-2.4)/.5)):null,t>=7.4?frameHud('IMAGEN',true):null)}});
add({id:'upscale',cat:'x',es:'Reescalado',en:'upscale to 4K, add fine detail, keep the original motion and colors',dur:9,
  what:'Las IA de video entregan muchas veces 720p o 1080p. El reescalado lleva el clip a 4K y recupera detalle sin cambiar el movimiento.',
  look:'La línea separa el original de baja resolución, a la derecha, del resultado reescalado, a la izquierda.',
  fn(t,S){S.look=mk(LOOKS.golden);walkX(S.A,t,9,-1.8,1.8);S.A.z=.5;setCam(S,{p:[S.A.x*.4,1.4,lerp(4.6,3.8,t/9)],t:[S.A.x,1.25,0],fov:36});const m=lerp(.3,.7,.5+.5*Math.sin(t*1.1));
    S.hud=hudAll(lowresHud(.085,m,1,true),(c,w,h)=>{c.fillStyle='#fff';c.fillRect(w*m-1,0,2,h)},twoLabels('4K reescalado','720p original'))}});
add({id:'lipsync',cat:'x',es:'Lip sync y avatar',en:'The person looks into the camera and says: "We leave at dawn." Natural lip sync, subtle head movement.',dur:9,
  what:'Con una foto o un clip y un audio, la IA mueve la boca y la cara al ritmo de la voz. Así se hacen los avatares que hablan.',
  look:'Primero la foto quieta con la pista de voz. Después habla: la boca sigue las sílabas y la cabeza se mueve apenas.',
  fn(t,S){S.look=mk(Object.assign({},LOOKS.golden,{soft:1}));const live=t>=2.5,l=t-2.5;S.A.ry=0;S.A.headYaw=live?.08*Math.sin(t*1.7):0;S.A.nod=live?.05*Math.sin(t*2.3):0;
    const syl=live?(Math.sin(l*11)>-.2&&(l%2.2)<1.7?1:0):0;S.A.talk=syl;if(!live)S.tt=0;setCam(S,{p:[.15,1.62,1.05],t:[0,1.58,0],fov:30});S.cap=live?'Habla con la voz del audio':'Foto + audio';
    const txt='We leave at dawn.',sub=live?txt.slice(0,Math.floor(clamp(l/2.2,0,1)*txt.length)):'';
    S.hud=(c,w,h)=>{const x0=w*.1,x1=w*.9,y=h*.86,N=80,bw=(x1-x0)/N,ph=live?clamp(l/6.5,0,1):0;c.fillStyle='rgba(0,0,0,.55)';c.fillRect(x0-8,y-h*.06,x1-x0+16,h*.12);
      for(let k=0;k<N;k++){const a=(k%27<20)?.2+.8*hsh(k*1.7):.05;c.fillStyle=k/N<ph?'#ffd24a':'rgba(255,255,255,.45)';c.fillRect(x0+k*bw,y-a*h*.04,bw*.6,a*h*.08)}
      c.fillStyle='#ff5a4f';c.fillRect(x0+(x1-x0)*ph-1,y-h*.055,2,h*.11);if(sub)label(c,w,sub,w/2,h*.72,'center',.032)}}});
add({id:'extend',cat:'x',es:'Extender un clip',en:'Extend the video: continue from the last frame, the person keeps walking to the lamp.',dur:10,
  what:'La extensión toma el último frame de un clip y genera la continuación. Sirve para alargar un plano sin cortar.',
  look:'El primer bloque es el clip original. En la marca empieza la extensión y el personaje sigue caminando sin salto.',
  fn(t,S){S.look=mk(LOOKS.blue);S.A.x=lerp(-3,LAMP[0]-.3,t/10);S.A.z=lerp(.4,LAMP[1]+.5,ss(t/10));S.A.ry=2.2;S.A.walk=t*6;S.A.amp=1;S.A.headYaw=0;S.look.lamp=t>8.6?lerp(.3,2.2,ss((t-8.6)/.6)):.3;
    setCam(S,{p:[S.A.x+.6,1.45,S.A.z+3.2],t:[S.A.x,1.25,S.A.z],fov:38});S.cap=t<5?'Clip original · 5 s':'Extensión · +5 s';if(t>=5){S.badge='Continúa desde el último frame';S.badgeKind='ok'}
    S.hud=tlHud([[0,5,'Clip','#8d95a3'],[5,10,'Extensión','#5fd398',1].map((x,j)=>j===4?undefined:x)].map(b=>b.length>3?b:b),10,t,[5])}});
(function(){const d=D[D.length-1];d.fn=function(t,S){S.look=mk(LOOKS.blue);S.A.x=lerp(-3,LAMP[0]-.3,t/10);S.A.z=lerp(.4,LAMP[1]+.5,ss(t/10));S.A.ry=2.2;S.A.walk=t*6;S.A.amp=1;S.A.headYaw=0;S.look.lamp=t>8.6?lerp(.3,2.2,ss((t-8.6)/.6)):.3;
  setCam(S,{p:[S.A.x+.6,1.45,S.A.z+3.2],t:[S.A.x,1.25,S.A.z],fov:38});S.cap=t<5?'Clip original · 5 s':'Extensión · +5 s';if(t>=5){S.badge='Sigue desde el último frame';S.badgeKind='ok'}
  const bl=[[0,5,'Clip','#8d95a3']];if(t>=5){const b=[5,10,'Extensión','#5fd398'];b.grow=true;bl.push(b)}S.hud=tlHud(bl,10,t,[5])}})();
const KF=[{p:[-2,3,9],t:[1,1,-1],fov:42},{p:[4.5,1.6,2.5],t:[LAMP[0],1.3,LAMP[1]],fov:38},{p:[LAMP[0]+.4,.35,LAMP[1]+2.4],t:[LAMP[0],2.2,LAMP[1]],fov:40},{p:[LAMP[0]+Math.sin(-.4)*1,1.64,LAMP[1]+.4+Math.cos(-.4)*1],t:[LAMP[0]+.1,1.64,LAMP[1]+.4],fov:30}];
add({id:'keyframes',cat:'x',es:'Varios keyframes',en:'Keyframe 1 at 0s: wide shot. Keyframe 2 at 3s: side view. Keyframe 3 at 6s: low angle. Keyframe 4 at 9s: close-up. Smooth camera move through all of them.',dur:10.5,
  what:'Algunas herramientas aceptan más de dos imágenes clave por clip. La IA pasa por cada una en el momento indicado y arma el recorrido.',
  look:'Las marcas amarillas son los keyframes. La cámara pasa por cada uno: general, lateral, contrapicado y primer plano.',
  fn(t,S){S.look=mk(Object.assign({},LOOKS.blue,{lamp:2}));S.A.x=LAMP[0]+.1;S.A.z=LAMP[1]+.4;S.A.ry=-.4;S.A.headYaw=0;const tm=[0,3,6,9],i=Math.min(2,Math.floor(t/3)),k=t>=9?1:ss((t-tm[i])/3);
    camLerp(S,KF[t>=9?2:i],KF[t>=9?3:i+1],k);S.cap=t>=9?'Keyframe 4':'Hacia el keyframe '+(i+2);S.hud=tlHud([[0,10.5,'Clip','#8d95a3']],10.5,t,tm)}});
add({id:'newangle',cat:'x',es:'Otro ángulo del mismo plano',en:'Generate the same scene from a low angle, keep the action, timing and lighting.',dur:9,
  what:'Algunas herramientas de video a video regeneran el mismo plano desde otra posición de cámara, con la misma acción y la misma luz.',
  look:'A la izquierda el original a la altura de los ojos. A la derecha la misma acción desde abajo y girando.',
  fn(t,S,S2){[S,S2].forEach(s=>{s.look=mk(LOOKS.golden);s.A.wave=pp(t,4.5,.2);s.A.headYaw=.2*Math.sin(t)});setCam(S,{p:[0,1.45,3.8],t:[0,1.2,0],fov:36});const a=-.6+t*.12;setCam(S2,{p:[Math.sin(a)*2.6,.35,Math.cos(a)*2.6],t:[0,1.35,0],fov:40});
    S.post.split=true;S.hud=twoLabels('Original','Otro ángulo')}});
add({id:'regionedit',cat:'x',es:'Editar una zona del video',en:'Change the shirt to yellow. Keep the face, the motion and the background unchanged.',dur:9,
  what:'La edición por zona cambia solo una parte del video, por ejemplo la ropa, y deja igual todo lo demás.',
  look:'Se marca la camisa, la marca sigue al personaje y solo ahí cambia el color. La cara, el fondo y el movimiento no se tocan.',
  fn(t,S){S.look=mk(LOOKS.day);S.A.dance=.6;S.A.headYaw=0;setCam(S,{p:[.3,1.35,3.4],t:[0,1.15,0],fov:36});const k=ss((t-4)/1.2);S.A.shirt=mixC('#b4482f','#f2c230',k);S.cap=t<2?'El clip original':t<4?'Marcás la zona':'Solo cambia lo marcado';
    S.hud=(c,w,h)=>{if(t<2)return;const a=project(new V3(S.A.x-.36,1.5,S.A.z),cam,w,h),b=project(new V3(S.A.x+.36,.78,S.A.z),cam,w,h),x=Math.min(a[0],b[0]),y=Math.min(a[1],b[1]),ww=Math.abs(b[0]-a[0]),hh=Math.abs(b[1]-a[1]);
      if(t<4){c.fillStyle='rgba(255,90,79,.28)';c.fillRect(x,y,ww,hh)}c.save();c.strokeStyle='#ff5a4f';c.setLineDash([7,5]);c.lineWidth=Math.max(2,w/400);c.strokeRect(x,y,ww,hh);c.restore()}}});
let presetCache=null;
add({id:'presetreel',cat:'x',es:'Presets de cámara',en:'camera motion presets: crash zoom, dolly zoom, orbit, FPV drone, crane up, whip pan',dur:12,cuts:true,
  what:'Algunas plataformas traen movimientos de cámara listos para elegir en vez de escribirlos. Cada preset es un término del glosario.',
  look:'Seis presets seguidos, dos segundos cada uno, con su nombre en inglés tal como aparece en las herramientas.',
  fn(t,S,S2){if(!presetCache)presetCache=[['crashzoom','Crash zoom'],['dollyzoom','Dolly zoom'],['orbit','Orbit'],['fpv','FPV drone'],['crane','Crane up'],['whip','Whip pan']].map(x=>[D.find(d=>d.id===x[0]),x[1]]);
    const i=Math.floor(t/2)%6,p=presetCache[i];p[0].fn(p[0].dur*.2+(t%2)*p[0].dur/3,S,S2);S.cap='Preset: '+p[1];S.badge=(i+1)+' / 6';S.badgeKind=''}});

/* ---------- biblioteca de estilos ---------- */
add({id:'anime90',cat:'x',es:'Anime de los 90',en:'1990s hand-drawn cel anime, painted backgrounds, muted film palette, soft grain, animated on twos',dur:8,
  what:'El anime dibujado a mano y filmado en película: fondos pintados, colores algo apagados y movimiento a doce dibujos por segundo.',
  look:'Sombras en bandas planas, grano suave y un movimiento un poco entrecortado porque cada dibujo dura dos cuadros.',
  fn(t,S){S.post.fps=12;S.look=mk({skyTop:'#5f8fc4',skyBot:'#f1d9b5',fog:'#e9d4b8',fogD:.012,sun:1.1,sunC:'#ffe6c4',sunP:[-5,4,5],hemi:.62,ground:'#7d9a5e',foliage:'#4f7a4a'});walkX(S.A,t,8,-2,2);S.A.hat='#2a2a3a';
    setCam(S,{p:[S.A.x+1.6,1.3,3.8],t:[S.A.x,1.25,0],fov:34});S.post.css={filter:'url(#poster) saturate(.85) contrast(1.05) sepia(.12)'};S.post.grain=.45;S.post.vig=.35}});
add({id:'animemodern',cat:'x',es:'Anime moderno',en:'modern digital anime, vibrant saturated colors, detailed sky with towering clouds, glowing light bloom, lens flare, smooth camera',dur:8,
  what:'El anime digital de hoy: colores muy saturados, cielos detallados, mucho brillo y destellos de lente.',
  look:'Bandas de color limpias, un cielo intenso, resplandor alrededor de las luces y un destello que cruza el cuadro.',
  fn(t,S){S.look=mk({skyTop:'#1d63d8',skyMid:'#5ea8ff',skyBot:'#ffd7a8',fog:'#ffd2b0',fogD:.008,sun:1.3,sunC:'#fff0d8',sunP:[-6,2.6,4],hemi:.7,ground:'#58b85a',foliage:'#2c9a58'});S.A.headYaw=.3;S.A.ry=.4;
    const a=-.5+t*.08;setCam(S,{p:[Math.sin(a)*3.6,1.1,Math.cos(a)*3.6],t:[0,1.35,0],fov:36});S.post.css={filter:'url(#poster) saturate(1.6) contrast(1.06)'};S.post.bloom=.5;S.post.flare=true}});
add({id:'animepastoral',cat:'x',es:'Anime pastoral pintado',en:'hand-painted pastoral anime, watercolor backgrounds, lush green fields, soft summer light, gentle wind in the grass, nostalgic',dur:9,
  what:'Anime de campo y verano con fondos de acuarela, luz suave y viento. Se pide describiendo los rasgos y no el nombre del estudio.',
  look:'Verde intenso, cielo claro con nubes, hojas que vuelan y un movimiento tranquilo a doce dibujos por segundo.',
  fn(t,S){S.post.fps=12;S.look=mk({skyTop:'#6fb3ee',skyBot:'#f4f1d8',fog:'#e7f0d8',fogD:.01,sun:1,sunC:'#fff4d6',sunP:[5,6,4],hemi:.8,hemiSky:'#f2f7ff',ground:'#79b85a',foliage:'#3f9a4f'});S.A.shirt='#f2f2ea';S.A.hat='#e9c46a';S.A.headYaw=.25*Math.sin(t*.6);
    setCam(S,{p:[lerp(-1.2,1.2,t/9),1.25,4.4],t:[0,1.25,0],fov:34});S.post.css={filter:'url(#poster) saturate(1.2) brightness(1.05) contrast(.95)'};S.hud=leavesHud(t)}});
add({id:'pixelart',cat:'x',es:'Pixel art',en:'16-bit pixel art, limited color palette, crisp square pixels, side view, retro video game',dur:8,
  what:'Imagen hecha de píxeles grandes y pocos colores, como los videojuegos de 16 bits.',
  look:'Todo se ve en cuadritos nítidos, sin degradados ni desenfoque, y el personaje camina de perfil.',
  fn(t,S){S.post.fps=12;S.look=mk({skyTop:'#3a6fd8',skyBot:'#9fd4ff',fog:'#a9d6ff',fogD:.008,sun:1.1,sunP:[4,6,5],hemi:.75,ground:'#5aa03a',foliage:'#2f7a3a'});walkX(S.A,t,8,-2.4,2.4);S.A.hat='#ffd23f';setCam(S,{p:[0,1.3,6],t:[0,1.15,0],fov:34});
    S.hud=lowresHud(.11,0,1,false,'url(#poster) saturate(1.5) contrast(1.15)')}});
add({id:'watercolor',cat:'x',es:'Acuarela',en:'watercolor illustration, soft bleeding edges, visible paper texture, washed pastel colors, loose brushwork',dur:9,
  what:'Imagen que parece pintada con acuarela: bordes que se corren, colores lavados y textura de papel.',
  look:'Colores suaves y claros, contornos blandos, el blanco del papel en todo el cuadro y un grano parejo.',
  fn(t,S){S.look=mk(Object.assign({},LOOKS.day,{hemi:.9,sun:.6,skyTop:'#9cc3e2',skyBot:'#f3eee0',ground:'#a9bf8a',foliage:'#7fa77a'}));walkX(S.A,t,9,-1.6,1.6);S.A.z=.4;setCam(S,{p:[0,1.5,5.2],t:[S.A.x*.4,1.2,0],fov:36});
    S.post.css={filter:'url(#poster) blur(1.1px) saturate(.8) brightness(1.12) contrast(.9)',mul:'#f6eedb'};S.post.grain=.55;S.post.vig=.25}});
add({id:'papercut',cat:'x',es:'Papel recortado',en:'paper cutout stop-motion animation, layered cardboard shapes, flat colors, visible paper texture, choppy 8 fps',dur:8,
  what:'Animación con figuras de papel o cartón en capas, movidas cuadro a cuadro.',
  look:'Colores planos, textura de papel, capas que se separan por profundidad y movimiento a saltos de ocho cuadros por segundo.',
  fn(t,S){S.post.fps=8;S.look=mk({skyTop:'#f4a259',skyBot:'#f9e0b8',fog:'#f3d8b0',fogD:.012,sun:.9,sunC:'#fff2dc',sunP:[2,6,6],hemi:.9,ground:'#c26a3a',foliage:'#5b8e55'});walkX(S.A,t,8,-2.2,2.2);S.A.shirt='#3d6e9e';
    setCam(S,{p:[0,1.3,6],t:[0,1.15,0],fov:32});S.post.css={filter:'url(#poster) saturate(1.1) contrast(1.15)',mul:'#f5ead6'};S.post.grain=.35}});
add({id:'comic',cat:'x',es:'Cómic / novela gráfica',en:'comic book style, bold ink outlines, halftone dot shading, flat saturated colors, dramatic angles, panel border',dur:8,
  what:'Imagen de historieta: tinta, sombra con puntos de semitono y colores planos dentro de una viñeta.',
  look:'Puntos de semitono sobre todo el cuadro, colores planos y fuertes, y el borde de viñeta alrededor.',
  fn(t,S){S.look=mk({skyTop:'#ffcc33',skyBot:'#ff8a33',fog:'#ff9a44',fogD:.01,sun:1.4,sunC:'#ffffff',sunP:[4,3,4],hemi:.4,ground:'#3a5aa8',foliage:'#1f6a4a'});S.A.ry=.5;S.A.wave=pp(t,8,.25);S.A.shirt='#d62828';
    setCam(S,{p:[1.6,.45,2.6],t:[0,1.45,0],fov:38,roll:.12});S.post.css={filter:'url(#poster) saturate(1.5) contrast(1.35)'};S.hud=halftoneHud(.3)}});
add({id:'silent',cat:'x',es:'Cine mudo',en:'1920s silent film, black and white with slight sepia, 16 fps flicker, iris vignette, scratches and dust',dur:8,
  what:'El cine de los años 20: blanco y negro, parpadeo de proyección, viñeta de iris y rayas en la película.',
  look:'Movimiento a 16 cuadros por segundo, el brillo tiembla, las esquinas se cierran en negro y aparecen rayas verticales.',
  fn(t,S){S.post.fps=16;S.look=mk(LOOKS.day);walkX(S.A,t,8,-2,2);S.A.hat='#222';setCam(S,{p:[0,1.5,5],t:[0,1.2,0],fov:36});const f=Math.floor(t*16);
    S.post.css={filter:'grayscale(1) sepia(.3) contrast(1.3) brightness('+(1+.08*(hsh(f)-.5)).toFixed(3)+')'};S.post.grain=.8;S.hud=irisHud(t)}});
add({id:'super8',cat:'x',es:'Súper 8 casero',en:'Super 8 home movie, warm faded colors, heavy grain, light leaks, gate weave, rounded frame corners, 18 fps',dur:8,
  what:'Película casera de los 60 y 70: colores cálidos y lavados, mucho grano, fugas de luz y un cuadro que baila.',
  look:'El cuadro tiembla un poco, entra luz naranja por un costado, las esquinas son redondeadas y el grano es grueso.',
  fn(t,S){S.post.fps=18;const f=Math.floor(t*18);S.look=mk(LOOKS.golden);S.A.wave=pp(t,8,.25);S.A.headYaw=.3*Math.sin(t*.8);setCam(S,{p:[.4+(hsh(f)-.5)*.03,1.4+(hsh(f+3)-.5)*.03,3.6],t:[0,1.25,0],fov:36});
    S.post.css={filter:'sepia(.35) saturate(1.1) contrast(.9) brightness(1.05)',mul:'#ffe0b0'};S.post.grain=1;S.post.vig=.6;S.hud=leakHud(t)}});
add({id:'y2k',cat:'x',es:'Cámara digital de los 2000',en:'early 2000s digital camcorder footage, oversaturated colors, blown highlights, slight fisheye, orange date stamp',dur:8,
  what:'El video digital barato de principios de los 2000: colores pasados, altas luces quemadas y la fecha en naranja.',
  look:'Todo muy saturado y brillante, el lente deforma un poco las orillas y la fecha queda abajo a la derecha.',
  fn(t,S){S.look=mk(Object.assign({},LOOKS.day,{sun:1.2}));S.A.dance=.7;setCam(S,{p:[.3+.08*Math.sin(t*3),1.5+.05*Math.sin(t*5),2.8],t:[0,1.25,0],fov:44});S.post.fish=.35;
    S.post.css={filter:'saturate(1.5) contrast(1.15) brightness(1.12) hue-rotate(-6deg)'};S.hud=camcorderHud(t)}});
add({id:'vaporwave',cat:'x',es:'Vaporwave',en:'vaporwave aesthetic, pastel pink and teal, magenta grid floor, sunset gradient, VHS scan lines, dreamy slow motion',dur:9,
  what:'Estética de internet de los 2010 que recicla los 80 y 90: rosa y turquesa pastel, cuadrícula, atardecer y VHS.',
  look:'Cielo de degradado rosa a turquesa, una cuadrícula magenta en el piso, líneas de VHS y movimiento lento.',
  fn(t,S){S.look=mk({skyTop:'#3fd6d0',skyMid:'#ff9ad5',skyBot:'#ffd1e8',fog:'#e6a6ff',fogD:.02,hemi:.6,hemiSky:'#ffc6ee',hemiGnd:'#3a1a5a',sun:.9,sunC:'#ff6ad5',sunP:[-4,2,3],fill:.8,fillC:'#4ff0ff',fillP:[4,2,2],ground:'#2a1a4a',foliage:'#5a2a7a'});
    S.A.shirt='#f4f4ff';S.A.ry=.3*Math.sin(t*.4);setCam(S,{p:[0,1.2,4.6],t:[0,1.3,0],fov:36});S.post.css={filter:'saturate(1.15) contrast(1.05)'};S.post.bloom=.35;S.hud=hudAll(gridHud,vhsHud(t))}});
add({id:'giallo',cat:'x',es:'Giallo',en:'1970s Italian giallo, saturated red key light and green fill, deep shadows, extreme close-ups, film grain',dur:8,
  what:'El thriller italiano de los 70: luces rojas y verdes muy saturadas, sombras profundas y primerísimos planos.',
  look:'Un lado de la cara en rojo y el otro en verde, fondo casi negro, empuje lento hacia el rostro y grano de película.',
  fn(t,S){S.look=mk({skyTop:'#050206',skyBot:'#12060c',fog:'#0c0408',fogD:.04,hemi:.05,hemiSky:'#ff3355',hemiGnd:'#000',sun:1.5,sunC:'#ff1f3d',sunP:[-3,1.8,1.5],fill:1.1,fillC:'#2bff8a',fillP:[3,1.6,1.2],ground:'#140a0e',foliage:'#0a0c0a'});
    S.A.ry=.2;S.A.headYaw=-.2;setCam(S,{p:[.2,1.62,lerp(1.6,.95,ss(t/8))],t:[0,1.6,0],fov:30});S.post.css={filter:'saturate(1.4) contrast(1.2)'};S.post.grain=.5;S.post.vig=.5}});
add({id:'fantasy',cat:'x',es:'Fantasía épica',en:'epic fantasy, golden god rays through mist, floating dust motes, lush ancient landscape, crane up reveal, majestic',dur:9,
  what:'La fantasía de gran escala: niebla, rayos de luz dorada, polvo que flota y planos que revelan el paisaje.',
  look:'La grúa sube desde el personaje hasta mostrar el lugar, con niebla cálida, brillo y partículas en el aire.',
  fn(t,S){S.look=mk(Object.assign({},LOOKS.golden,{fogD:.035,fog:'#f0c48a',sunP:[-6,3,-6],sun:1.4}));S.A.ry=PI;S.A.headYaw=0;const k=ss(t/9);setCam(S,{p:[0,lerp(1.3,5.5,k),lerp(2.2,6.5,k)],t:[0,lerp(1.4,1,k),lerp(0,-4,k)],fov:40});
    S.post.css={filter:'saturate(1.2) contrast(1.05)'};S.post.bloom=.55;S.hud=dustHud(t)}});
add({id:'tealorange',cat:'x',es:'Blockbuster teal and orange',en:'blockbuster teal and orange color grade, warm skin tones against cool shadows, high contrast, anamorphic, orbiting camera',dur:8,
  what:'El grade del cine de acción: piel cálida contra sombras turquesa, mucho contraste y lente anamórfico.',
  look:'El personaje queda naranja y el fondo turquesa, con destellos horizontales azules y la cámara girando alrededor.',
  fn(t,S){S.look=mk(LOOKS.golden);S.A.ry=.3;S.A.headYaw=.2;const a=t*.25;setCam(S,{p:[Math.sin(a)*3,1.2,Math.cos(a)*3],t:[0,1.35,0],fov:34});S.post.grade=GR.teal;S.post.anam=true;S.post.mask=2.39;S.post.css={filter:'contrast(1.12)'}}});
add({id:'postapoc',cat:'x',es:'Postapocalíptico',en:'post-apocalyptic wasteland, dusty orange haze, desaturated bleached colors, wind-blown dust, handheld camera',dur:8,
  what:'El mundo después del desastre: polvo, sol duro, colores gastados y cámara en mano.',
  look:'Neblina naranja de polvo, colores lavados con mucho contraste y partículas que cruzan con el viento.',
  fn(t,S){S.look=mk(Object.assign({},LOOKS.golden,{skyTop:'#8a6a4a',skyBot:'#e0a868',fog:'#c8935a',fogD:.05,foliage:'#5a4a30',ground:'#9a7a50'}));walkX(S.A,t,8,-1.8,1.8);S.A.shirt='#5a4a3a';
    setCam(S,{p:[S.A.x+.8+.05*Math.sin(t*7),1.4+.04*Math.sin(t*9),3.4],t:[S.A.x,1.3,0],fov:36});S.post.css={filter:'saturate(.6) contrast(1.25) sepia(.25)'};S.post.grain=.4;S.hud=dustHud(t*3)}});
add({id:'oil',cat:'x',es:'Pintura al óleo',en:'oil painting in motion, thick visible brushstrokes, impasto texture, rich saturated pigments, canvas weave',dur:9,
  what:'Imagen que parece pintada al óleo y se mueve: pinceladas visibles, empaste y color denso.',
  look:'Colores profundos y cálidos, formas simplificadas en manchas y la trama de la tela sobre todo el cuadro.',
  fn(t,S){S.post.fps=12;S.look=mk(Object.assign({},LOOKS.golden,{skyTop:'#3a5a9a',skyMid:'#e0884a',skyBot:'#f6c27a',fogD:.02}));S.A.ry=.4;S.A.headYaw=.2*Math.sin(t*.7);setCam(S,{p:[lerp(-.6,.6,t/9),1.4,4],t:[0,1.3,0],fov:36});
    S.post.css={filter:'url(#poster) saturate(1.35) contrast(1.12) blur(.7px)',mul:'#f3e2c4'};S.post.grain=.7;S.post.vig=.45}});
add({id:'chibi',cat:'x',es:'Chibi',en:'chibi anime style, super-deformed characters, oversized head, pastel colors, bouncy squash-and-stretch motion',dur:8,
  what:'Personajes de dos o tres cabezas de alto, colores pastel y movimiento elástico.',
  look:'Cámara baja y cercana para agrandar la cabeza, colores suaves en bandas planas y saltitos al ritmo.',
  fn(t,S){S.look=mk({skyTop:'#9fd3ff',skyBot:'#ffe3f0',fog:'#ffe6f2',fogD:.012,sun:.85,sunC:'#fff4f8',sunP:[3,6,5],hemi:.6,ground:'#b8e6a8',foliage:'#7ccf9a'});S.A.shirt='#ff8fb8';S.A.hat='#ffd166';S.A.y=.12*Math.abs(Math.sin(t*4.2));S.A.wave=pp(t,8,.2);
    setCam(S,{p:[.2,1.5,1.7],t:[0,1.35,0],fov:44});S.post.css={filter:'url(#poster) saturate(1.2) brightness(.94) contrast(1.05)'}}});
add({id:'lowpoly',cat:'x',es:'Low poly',en:'low poly 3D, flat-shaded facets, solid pastel colors, simple geometric shapes, isometric-feeling camera',dur:9,
  what:'3D de pocos polígonos con caras planas y colores sólidos, como un diorama de juego indie.',
  look:'Colores sólidos sin degradado, sombras duras, cámara alta que gira lento alrededor de la escena.',
  fn(t,S){S.look=mk({skyTop:'#6ec6d8',skyBot:'#f2e8cf',fog:'#e8e2cf',fogD:.008,sun:.95,sunC:'#fff8e8',sunP:[5,8,3],hemi:.42,hemiGnd:'#4a6a3a',ground:'#5f8f4a',foliage:'#2f7f5a'});S.A.shirt='#e76f51';S.A.hat='#264653';
    const a=-.6+t*.16;setCam(S,{p:[Math.sin(a)*6.5,3.2,Math.cos(a)*6.5],t:[0,1,-.5],fov:34});S.post.css={filter:'url(#poster) saturate(1.2) contrast(1.15)'}}});
add({id:'bwmodern',cat:'x',es:'Blanco y negro moderno',en:'modern black and white digital cinema, crisp detail, deep blacks, bright silver highlights, natural light, static composed frames',dur:8,
  what:'El blanco y negro de hoy: nítido, con negros profundos y luz natural, sin grano de época.',
  look:'Gris rico de punta a punta, contraste alto pero limpio y cuadros quietos muy compuestos.',
  fn(t,S){S.look=mk(Object.assign({},LOOKS.day,{sunP:[-6,4,2],sun:1.3}));S.A.ry=-.5;S.A.headYaw=.25;S.A.x=-.6;setCam(S,{p:[1.2,1.5,lerp(3.8,3.2,t/8)],t:[-.3,1.3,0],fov:32});S.post.css={filter:'grayscale(1) contrast(1.35) brightness(1.02)'};S.post.vig=.2}});
/* acción con los personajes de Mixamo */
add({id:'fight',cat:'direccion',es:'Coreografía de pelea',en:'fight choreography, one strike per shot, the camera changes position at each cut',alias:'pelea accion artes marciales patada golpe fight scene',dur:10,cuts:true,
  what:'Una pelea se planea golpe por golpe: cada plano lleva una sola acción y la cámara cambia de lugar en cada corte. Con IA conviene lo mismo: un golpe por plano y un plano por generación.',
  look:'Tres planos: general de costado, sobre el hombro de ella y contrapicado. En cada uno pasa un solo golpe.',
  fn(t,S){S.look=mk(LOOKS.golden);S.A.x=-.72;S.A.ry=PI/2;S.B.vis=true;S.B.x=.72;S.B.z=0;S.B.ry=-PI/2;
    S.B.act=t<2.4?['punch',.25+t]:t<4.7?['roundhouse',.3+(t-2.4)*.85]:t<7.4?['kick',.7+(t-4.7)*.85]:['boxing',t];
    S.A.act=t<7.4?['boxing',t]:['armada',.1+(t-7.4)*.6];const i=t<3.3?0:t<6.6?1:2;
    if(i===0)setCam(S,{p:[0,1.35,4.6],t:[0,1.05,0],fov:36});else if(i===1)setCam(S,{p:[-2,1.62,.75],t:[.6,1.25,0],fov:34});else{const a=.6+(t-6.6)*.18;setCam(S,{p:[Math.sin(a)*3,.35,Math.cos(a)*3],t:[0,1.2,0],fov:40})}
    S.cap=['Plano 1: general','Plano 2: sobre el hombro','Plano 3: contrapicado'][i];S.hud=strip([3.3,6.6],10,t)}});
