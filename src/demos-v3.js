
/* ---------- capas 2D para estilos y métodos de IA ---------- */
const hsh=i=>{const x=Math.sin(i*127.1+311.7)*43758.5453;return x-Math.floor(x)};
const fpx=(w,f)=>Math.max(11,w*f);
function label(c,w,txt,x,y,align,size){c.font='600 '+fpx(w,size||.024)+'px "Barlow Condensed","Arial Narrow",sans-serif';c.textAlign=align||'left';c.textBaseline='top';c.lineWidth=4;c.strokeStyle='rgba(0,0,0,.75)';c.strokeText(txt,x,y);c.fillStyle='#fff';c.fillText(txt,x,y)}
function rainHud(t,n){return (c,w,h)=>{c.save();c.strokeStyle='rgba(200,215,255,.45)';c.lineWidth=Math.max(1,w/1000);c.beginPath();const N=n||150,L=h*.08;
  for(let i=0;i<N;i++){const x=hsh(i)*w*1.15-w*.05,sp=.85+hsh(i+50)*.5,y=((hsh(i+99)+t*sp*1.3)%1)*(h+L)-L;c.moveTo(x,y);c.lineTo(x-L*.16,y+L)}c.stroke();c.restore()}}
function dustHud(t){return (c,w,h)=>{c.save();for(let i=0;i<60;i++){const x=((hsh(i)+Math.sin(t*.3+i)*.02+t*.01*(hsh(i+7)-.5))%1+1)%1*w,y=((hsh(i+30)-t*.012*(.5+hsh(i+3)))%1+1)%1*h,r=w*(.0015+.003*hsh(i+11));
  c.fillStyle='rgba(255,244,220,'+(.25+.35*hsh(i+17)).toFixed(2)+')';c.beginPath();c.arc(x,y,r,0,PI*2);c.fill()}c.restore()}}
function leavesHud(t){return (c,w,h)=>{c.save();for(let i=0;i<22;i++){const sp=.07+.05*hsh(i+4),y=((hsh(i+60)+t*sp)%1)*h*1.1-h*.05,x=(hsh(i+80)*w+Math.sin(t*1.3+i)*w*.03),r=w*.007;
  c.save();c.translate(x,y);c.rotate(t*2+i);c.fillStyle=['#d9822b','#c25a1f','#e0b23a'][i%3];c.beginPath();c.ellipse(0,0,r*1.8,r,0,0,PI*2);c.fill();c.restore()}c.restore()}}
function blindsHud(){return (c,w,h)=>{c.save();c.translate(w*.62,-h*.1);c.rotate(-.32);c.fillStyle='rgba(0,0,0,.52)';for(let i=0;i<12;i++)c.fillRect(-w*.35,i*h*.09,w*.8,h*.045);c.restore()}}
function gear(c,x,y,r,n,a,col){c.save();c.translate(x,y);c.rotate(a);c.beginPath();for(let i=0;i<n;i++){const a0=i*2*PI/n;[[-.32,.8],[-.2,1],[.2,1],[.32,.8]].forEach(q=>{const aa=a0+q[0]*PI/n*1.6;c.lineTo(Math.cos(aa)*r*q[1],Math.sin(aa)*r*q[1])})}
  c.closePath();c.fillStyle=col;c.fill();c.globalCompositeOperation='destination-out';c.beginPath();c.arc(0,0,r*.28,0,PI*2);c.fill();c.restore()}
function gearsHud(t){return (c,w,h)=>{gear(c,w*.05,h*.93,w*.11,12,t*.4,'rgba(58,38,18,.93)');gear(c,w*.165,h*1.0,w*.07,8,-t*.4*12/8+.2,'rgba(96,66,30,.93)');gear(c,w*.97,h*.04,w*.09,10,t*.3,'rgba(58,38,18,.9)')}}
function vhsHud(t){return (c,w,h)=>{c.save();c.fillStyle='rgba(0,0,0,.16)';const g=Math.max(2,Math.round(h/180));for(let y=0;y<h;y+=g*2)c.fillRect(0,y,w,g);
  const by=((t*.23)%1)*h*1.2-h*.1,bh=h*.06,gr=c.createLinearGradient(0,by,0,by+bh);gr.addColorStop(0,'rgba(255,255,255,0)');gr.addColorStop(.5,'rgba(255,255,255,.2)');gr.addColorStop(1,'rgba(255,255,255,0)');c.fillStyle=gr;c.fillRect(0,by,w,bh);
  const f=Math.floor(t*24);for(let i=0;i<40;i++){c.fillStyle='rgba(255,255,255,'+(.15+.3*hsh(i+f*3)).toFixed(2)+')';c.fillRect(hsh(i*7+f)*w,by+hsh(i*3)*bh,w*.02*hsh(i+5),1.5)}
  const vw=Math.min(w,h*4/3),x0=(w-vw)/2,fs=fpx(w,.028);c.font='500 '+fs+'px "IBM Plex Mono",monospace';c.textBaseline='top';c.shadowColor='rgba(0,0,0,.8)';c.shadowBlur=3;
  c.textAlign='left';c.fillStyle='#fff';c.fillText(_t('PLAY'),x0+vw*.05,h*.06);if(Math.floor(t*2)%2===0){c.fillStyle='#ff3b30';c.fillText(_t('REC'),x0+vw*.05,h*.06+fs*1.3)}
  c.fillStyle='#fff';c.textAlign='right';c.fillText(_t('OCT 15 1994'),x0+vw*.95,h*.84);c.fillText('11:47:'+String(Math.floor(t)%60).padStart(2,'0')+_t(' PM'),x0+vw*.95,h*.84+fs*1.25);c.restore()}}
const symHud=(c,w,h)=>{c.save();c.strokeStyle='rgba(255,255,255,.4)';c.setLineDash([6,6]);c.lineWidth=Math.max(1,w/1000);c.beginPath();c.moveTo(w/2,0);c.lineTo(w/2,h);c.stroke();c.restore()};
const vpHud=(c,w,h)=>{c.save();c.strokeStyle='rgba(255,90,79,.6)';c.lineWidth=Math.max(1,w/900);c.beginPath();[[0,0],[w,0],[0,h],[w,h],[0,h*.5],[w,h*.5]].forEach(p=>{c.moveTo(p[0],p[1]);c.lineTo(w/2,h*.5)});c.stroke();c.restore()};
function beatHud(t,bpm,cuts,total){return (c,w,h)=>{const bt=60/bpm,ph=(t%bt)/bt,r=w*.022*(1+.6*(1-ph)),cx=w*.07,cy=h*.68;c.fillStyle='rgba(255,90,79,'+(.35+.6*(1-ph)).toFixed(2)+')';c.beginPath();c.arc(cx,cy,r,0,PI*2);c.fill();
  label(c,w,_t('TIEMPO ')+(Math.floor(t/bt)%4+1),cx+w*.05,cy-fpx(w,.024)/2,'left');strip(cuts,total,t)(c,w,h);
  const x0=w*.04,x1=w*.96,y=h*.8;c.fillStyle='rgba(255,255,255,.9)';for(let b=0;b<=total+1e-6;b+=bt){const x=x0+(x1-x0)*b/total;c.fillRect(x-1,y-13,2,9)}}}
const safeHud=(c,w,h)=>{const vw=h*9/16,x0=(w-vw)/2;c.save();c.fillStyle='rgba(255,59,48,.25)';c.fillRect(x0,0,vw,h*.1);c.fillRect(x0,h*.78,vw,h*.22);c.fillRect(x0+vw*.82,h*.3,vw*.18,h*.48);
  c.fillStyle='rgba(255,255,255,.9)';for(let i=0;i<4;i++){c.beginPath();c.arc(x0+vw*.91,h*(.38+i*.1),vw*.035,0,PI*2);c.fill()}
  c.fillRect(x0+vw*.05,h*.83,vw*.5,h*.018);c.fillRect(x0+vw*.05,h*.87,vw*.65,h*.014);c.fillRect(x0+vw*.05,h*.9,vw*.4,h*.014);
  c.strokeStyle='rgba(95,211,152,.95)';c.setLineDash([5,4]);c.lineWidth=2;c.strokeRect(x0+vw*.06,h*.12,vw*.74,h*.64);c.restore();label(c,w,_t('Zona segura'),x0+vw*.09,h*.13,'left',.02)};
function noiseHud(a){return (c,w,h)=>{if(a<=.01)return;c.fillStyle='rgba(120,120,124,'+(a*.55).toFixed(2)+')';c.fillRect(0,0,w,h);c.globalAlpha=Math.min(1,a*1.4);const sz=Math.max(80,w/6),f=Math.floor(T*24),ox=-hsh(f)*sz,oy=-hsh(f+7)*sz;
  for(let y=oy;y<h;y+=sz)for(let x=ox;x<w;x+=sz)c.drawImage(noise,x,y,sz,sz);c.globalAlpha=1}}
function typeHud(txt,k,cover){return (c,w,h)=>{if(cover>0){c.fillStyle='rgba(12,13,17,'+cover.toFixed(2)+')';c.fillRect(0,0,w,h)}if(cover<.05)return;c.globalAlpha=Math.min(1,cover*1.2);
  const fs=fpx(w,.025),bw=Math.min(w*.84,w-24),x=(w-bw)/2,pad=fs*.9;c.font='500 '+fs+'px "IBM Plex Mono",monospace';c.textAlign='left';c.textBaseline='top';
  const lines=[];let line='';txt.split(' ').forEach(wd=>{const tl=line?line+' '+wd:wd;if(c.measureText(tl).width>bw-pad*2&&line){lines.push(line);line=wd}else line=tl});lines.push(line);
  const bh=pad*2+fs*1.6+lines.length*fs*1.45,y=Math.max(8,(h-bh)/2);c.fillStyle='rgba(30,33,40,.95)';c.fillRect(x,y,bw,bh);c.strokeStyle='rgba(255,255,255,.28)';c.lineWidth=1;c.strokeRect(x+.5,y+.5,bw-1,bh-1);
  c.globalAlpha=Math.min(1,cover*1.2);label(c,w,'PROMPT',x+pad,y+pad*.7,'left',.018);let left=Math.floor(txt.length*clamp(k,0,1));c.font='500 '+fs+'px "IBM Plex Mono",monospace';c.fillStyle='#e8ebf0';c.textBaseline='top';
  lines.forEach((l,i)=>{if(left<=0)return;const part=l.slice(0,left);left-=l.length+1;c.fillText(part+(left<0&&k<1&&Math.floor(T*3)%2?'_':''),x+pad,y+pad+fs*1.6+i*fs*1.45)});c.globalAlpha=1}}
function frameHud(txt,still){return (c,w,h)=>{if(still){const lw=Math.max(3,w/240);c.strokeStyle='rgba(255,210,74,.95)';c.lineWidth=lw;c.strokeRect(lw/2,lw/2,w-lw,h-lw)}label(c,w,txt,w*.03,h*.86,'left',.026)}}
function twoLabels(a,b){return (c,w,h)=>{label(c,w,a,w*.03,h*.88,'left',.024);label(c,w,b,w*.97,h*.88,'right',.024)}}

/* ESTILOS Y REFERENCIAS */
add({id:'noir',cat:'estilo',es:'Cine negro',en:'film noir, black and white, high-contrast low-key lighting, venetian blind shadows, smoky haze, 1940s',dur:8,
  what:'El policial de los años 40 y 50: blanco y negro, sombras duras y personajes moralmente ambiguos.',
  look:'Una sola luz dura de costado deja media cara en negro y las franjas de una persiana cruzan el cuadro. El humo le da textura al aire.',
  ref:'El halcón maltés (1941), Pacto de sangre (1944)',alias:'film noir',
  fn(t,S){S.look=mk(Object.assign({},LOOKS.studio,{sun:1.8,sunP:[2.4,2.2,3.2],hemi:.05,fog:'#121317',fogD:.04,ground:'#3a3b40'}));S.props.set=false;S.A.hat='#26272b';S.A.shirt='#6b6d73';S.A.headYaw=.12+.06*Math.sin(t*.6);
    const k=ss(t/8);setCam(S,{p:[lerp(-.95,-.55,k),1.62,lerp(2.7,1.75,k)],t:[0,1.52,0],fov:30,roll:.07});S.post.css={filter:'grayscale(1) contrast(1.45) brightness(1.05)'};S.post.grain=.45;S.post.vig=.6;S.hud=blindsHud()}});
add({id:'western',cat:'estilo',es:'Western',en:'western, dusty desert, harsh midday sun, warm desaturated tones, standoff, wide shot then extreme close-up on the eyes, 2.39:1',dur:9,
  what:'La frontera, el duelo y el paisaje enorme. Alterna planos muy abiertos con primerísimos primeros planos.',
  look:'Dos personajes chiquitos en un paisaje enorme y después solo sus ojos. El salto de escala arma la tensión del duelo.',
  ref:'El bueno, el malo y el feo (1966), Los imperdonables (1992)',alias:'spaghetti western duelo',
  fn(t,S){S.look=mk(Object.assign({},PAL[0].look,{sun:1.45,sunP:[1.2,7,2],sunC:'#fff0d4',hemi:.75}));S.A.x=-3.2;S.A.ry=PI/2;S.A.headYaw=0;S.A.hat='#6b4a2e';S.A.shirt='#8a5a3a';S.B.vis=true;S.B.x=3.2;S.B.ry=-PI/2;S.B.headYaw=0;S.B.hat='#2b2018';S.B.shirt='#4a4a52';
    const i=t<4?0:t<6.5?1:2;if(i===0)setCam(S,{p:[0,.4,10],t:[0,1.3,0],fov:30});else if(i===1)setCam(S,{p:[-3.2+.46,1.655,0],t:[-3.2,1.655,0],fov:20});else setCam(S,{p:[3.2-.46,1.655,0],t:[3.2,1.655,0],fov:20});
    S.post.mask=2.39;S.post.css={filter:'sepia(.3) saturate(.85) contrast(1.18)'};S.post.grain=.35;S.cap=[_t('El duelo'),_t('Los ojos de A'),_t('Los ojos de B')][i]}});
add({id:'scifi',cat:'estilo',es:'Ciencia ficción',en:'science fiction, sterile white futuristic set, perfect symmetry, cool clean light, slow push-in',dur:8,
  what:'Futuro, tecnología y espacio. Una de sus caras más reconocibles es el set blanco, frío y perfectamente ordenado.',
  look:'Todo es blanco y simétrico, la luz no tiene calidez y la cámara avanza sin prisa. El único color fuerte es el traje.',
  ref:'2001: Odisea del espacio (1968), Blade Runner (1982)',alias:'sci-fi',
  fn(t,S){S.look=mk(Object.assign({},LOOKS.highkey,{sunC:'#e3ecff',hemiSky:'#eef3ff',skyTop:'#e6ecf4',skyBot:'#f3f6fa',fog:'#edf1f7',ground:'#dfe5ee',sunP:[0,6,4]}));S.props.set=false;S.A.shirt='#e2582c';S.A.headYaw=0;
    const k=ss(t/8);setCam(S,{p:[0,1.45,lerp(7.5,3.2,k)],t:[0,1.3,0],fov:34});S.post.css={filter:'saturate(.7) contrast(1.06)',mul:'#e3ecff'};S.hud=symHud}});
add({id:'melodrama',cat:'estilo',es:'Melodrama Technicolor',en:'1950s Technicolor melodrama, lush saturated colors, soft glamorous light, pink and blue colored lighting',dur:8,
  what:'El drama romántico de los 50: emoción alta, colores intensos y una luz que embellece.',
  look:'Los colores están exagerados a propósito, la luz es suave y viene teñida de rosa por un lado y de azul por el otro. Un brillo leve suaviza todo.',
  ref:'Solo el cielo lo sabe (1955)',alias:'douglas sirk technicolor',
  fn(t,S){conv(S);S.look=mk({skyTop:'#5a7fd6',skyBot:'#f2b6c8',fog:'#e9b3c6',fogD:.014,hemi:.85,hemiSky:'#ffd6e4',hemiGnd:'#6a5a8a',sun:.9,sunC:'#ffc9a8',sunP:[-2,5,6],fill:.75,fillC:'#8fb0ff',fillP:[4,1.5,2],soft:1,ground:'#7a9a5a',foliage:'#3f7a4a'});
    S.A.shirt='#c9356b';S.B.shirt='#2f6f9e';S.A.talk=t<4?1:0;S.B.talk=t<4?0:1;const k=ss(t/8);setCam(S,{p:[lerp(1.2,.4,k),1.5,lerp(4.6,3.2,k)],t:[0,1.35,0],fov:34});S.post.css={filter:'saturate(1.75) contrast(1.05) brightness(1.03)'};S.post.bloom=.35}});
add({id:'eighties',cat:'estilo',es:'Estética de los 80',en:'1980s cinematic style, neon magenta and cyan light, hazy smoke, glowing lights, synthwave sunset, film grain',dur:8,
  what:'El cine de los 80: neón, humo, contraluces y atardeceres saturados.',
  look:'Cielo de atardecer rosa y violeta, luz magenta de un lado y cian del otro, humo en el aire y un resplandor alrededor de cada luz.',
  ref:'Blade Runner (1982)',alias:'80s 1980s synthwave retrowave',
  fn(t,S){S.look=mk(Object.assign({},LOOKS.sil,{skyTop:'#2a1250',skyMid:'#ff4fa3',skyBot:'#ffb26b',fog:'#7a2f86',fogD:.03,hemi:.35,hemiSky:'#ff7bd0',hemiGnd:'#1a0b2e',sun:.8,sunC:'#ff3d9a',sunP:[-4,2,3],fill:.85,fillC:'#29d3ff',fillP:[4,2,2],ground:'#2a1640',foliage:'#2a1446'}));
    S.props.lights=true;S.A.shirt='#f0f0ff';S.A.wave=pp(t,8,.3);setCam(S,{p:[Math.sin(t/8*PI*2)*.8,1.4,4],t:[0,1.35,0],fov:36});S.post.css={filter:'saturate(1.3) contrast(1.1)'};S.post.bloom=.55;S.post.grain=.35}});
add({id:'retro',cat:'estilo',es:'Look retro',en:'retro 1970s film look, warm faded colors, soft focus, heavy film grain, vignette',dur:9,
  what:'Imagen que imita el cine de los 50 a los 80: paleta cálida, grano, foco suave y colores lavados.',
  look:'Todo tira a ámbar, los negros no llegan a negro, hay grano visible y las esquinas se oscurecen. El foco es un poco blando.',
  ref:'Los Goonies (1985)',alias:'vintage',
  fn(t,S){S.look=mk(Object.assign({},LOOKS.golden,{sun:1,fogD:.016}));walkX(S.A,t,9,-3,3);S.A.z=.5;setCam(S,{p:[0,1.4,6],t:[S.A.x*.6,1.15,0],fov:36});
    S.post.css={filter:'sepia(.4) saturate(.9) contrast(.88) brightness(1.06)',mul:'#ffe2b0'};S.post.grain=.75;S.post.vig=.65;S.post.blur={fg:0,mid:.9,bg:2.2}}});
add({id:'cyberpunk',cat:'estilo',es:'Cyberpunk',en:'cyberpunk, rain-soaked city at night, neon magenta and cyan signs, wet reflective ground, holographic glow, low angle',dur:8,
  what:'Futuro urbano decadente: alta tecnología, mala vida, lluvia y neón.',
  look:'Noche, lluvia constante, luces magenta y cian que reemplazan el color real y un fondo lleno de luces desenfocadas. La cámara baja sigue al personaje.',
  ref:'Blade Runner (1982), Ghost in the Shell (1995), Matrix (1999)',alias:'neon noir',
  fn(t,S){S.look=mk({skyTop:'#05040d',skyBot:'#1a0f33',fog:'#1b1238',fogD:.035,hemi:.12,hemiSky:'#6a4dff',hemiGnd:'#0b0616',sun:1.2,sunC:'#ff2e88',sunP:[-4,2.2,2.6],fill:1.0,fillC:'#18d5e6',fillP:[4,1.8,1.6],ground:'#121022',foliage:'#141a30',lamp:1.2,win:1});
    S.props.lights=true;walkX(S.A,t,8,-2.5,2.5);S.A.shirt='#2b2b3a';S.A.hat='#18d5e6';setCam(S,{p:[S.A.x-1.2,.45,2.6],t:[S.A.x,1.3,0],fov:34});S.post.blur={fg:0,mid:0,bg:5};S.post.bokeh=true;
    S.post.css={filter:'saturate(1.35) contrast(1.15)'};S.hud=rainHud(t)}});
add({id:'steampunk',cat:'estilo',es:'Steampunk',en:'steampunk, Victorian era, brass and copper tones, warm gaslight, smoky haze, top hats, clockwork',dur:8,
  what:'Época victoriana con tecnología de vapor y engranajes que nunca existió.',
  look:'Luz de farol de gas, humo cálido, todo en tonos de bronce y cobre. Los engranajes del primer término marcan el mundo mecánico.',
  ref:'Sherlock Holmes (2009), La brújula dorada (2007), Steamboy (2004)',
  fn(t,S){S.look=mk(Object.assign({},LOOKS.night,{skyTop:'#2a1c12',skyBot:'#6a4a2a',fog:'#5a4028',fogD:.045,hemi:.35,hemiSky:'#d9a066',hemiGnd:'#2a1a0e',lamp:2.6,win:1,ground:'#4a3a2a',foliage:'#3a3020'}));
    S.A.x=LAMP[0]+.9;S.A.z=LAMP[1]+.2;S.A.ry=-.6;S.A.hat='#2a1d14';S.A.shirt='#7a4a26';S.B.vis=true;S.B.x=LAMP[0]-.5;S.B.z=LAMP[1]+.9;S.B.ry=.5;S.B.hat='#3a2a1e';S.B.shirt='#4a5a3a';S.A.talk=1;
    const k=ss(t/8);setCam(S,{p:[1.4+.5*k,1.45,1.2-.3*k],t:[3.1,1.4,-2.7],fov:38});S.post.css={filter:'sepia(.55) saturate(1.25) contrast(1.12)',mul:'#ffd99a'};S.post.vig=.5;S.post.grain=.25;S.hud=gearsHud(t)}});
add({id:'documentary',cat:'estilo',es:'Estilo documental',en:'documentary style, handheld camera, natural light, observational, follows the subject, quick zoom adjustments',dur:8,
  what:'Busca que parezca real: luz natural, cámara en mano y una mirada que observa sin intervenir.',
  look:'La cámara sigue al personaje como puede, tiembla un poco y a mitad del plano corrige con un zoom. No hay luz puesta ni color exagerado.',
  ref:'The Act of Killing (2012), Enmienda XIII (2016)',alias:'documental observacional',
  fn(t,S){walkX(S.A,t,8,-2.5,2.5);const n=s=>Math.sin(t*2.3+s)*.5+Math.sin(t*5.1+s*2.1)*.3+Math.sin(t*9.7+s*3.3)*.2;const z=t>4.2&&t<4.7?ss((t-4.2)/.5):t>=4.7?1:0;
    setCam(S,{p:[S.A.x*.7+.05*n(1),1.55+.04*n(2),3.6+.05*n(3)],t:[S.A.x+.08*n(4),1.3+.06*n(5),0],fov:lerp(40,28,z),roll:.02*n(6)})}});
add({id:'expressionism',cat:'estilo',es:'Expresionismo / surrealismo',en:'German expressionism, distorted angular set, exaggerated long shadows, harsh contrast, black and white, dutch angle, dreamlike',dur:8,
  what:'Muestra estados mentales con imágenes deformadas: decorados torcidos, sombras enormes y contraste exagerado.',
  look:'La luz rasante estira la sombra por el piso, el horizonte está inclinado y el cuadro entero se deforma despacio, como en una pesadilla.',
  ref:'El gabinete del doctor Caligari (1920), Eraserhead (1977)',alias:'surrealismo expresionista',
  fn(t,S){S.look=mk(Object.assign({},LOOKS.studio,{skyTop:'#151515',skyBot:'#3a3a3a',fog:'#2a2a2a',fogD:.008,sun:2.3,sunP:[4,.85,1.1],hemi:.28,hemiSky:'#ffffff',hemiGnd:'#555555',ground:'#b4b4b4'}));S.props.set=false;S.A.headYaw=-.4;
    setCam(S,{p:[-1.7,2.1,4.4],t:[-.3,.8,0],fov:40,roll:-.2});S.post.css={filter:'grayscale(1) contrast(1.7) brightness(.9)'};S.post.warp='skewX('+(-9+4*Math.sin(t*.8)).toFixed(2)+'deg) skewY(3deg) scale(1.16)';S.post.vig=.75;S.post.grain=.4}});
add({id:'horror',cat:'estilo',es:'Terror',en:'horror, dark foggy night, lit from below, desaturated green tint, slow handheld push-in, a figure appears in the background',dur:9,
  what:'Miedo por lo que no se ve: oscuridad, niebla, luz rara y una cámara que se acerca demasiado despacio.',
  look:'La luz viene de abajo, el color está apagado y verdoso, y algo aparece en el fondo mientras mirás la cara.',
  ref:'El conjuro (2013), Hereditary (2018)',alias:'horror miedo',
  fn(t,S){S.look=mk(Object.assign({},LOOKS.night,{skyTop:'#020304',skyBot:'#0b1410',fog:'#0d1712',fogD:.07,hemi:.07,lamp:0,win:0,sun:0,fill:1.35,fillC:'#d6ecd6',fillP:[.25,-2.4,1.6]}));
    const n=s=>Math.sin(t*1.7+s)*.6+Math.sin(t*3.9+s*2.1)*.4,k=ss(t/9);S.A.headYaw=.25*Math.sin(t*.5);setCam(S,{p:[.03*n(1),1.58+.02*n(2),lerp(3.2,1.6,k)],t:[.04*n(3),1.52,0],fov:32,roll:.012*n(4)});
    S.B.vis=t>5.2;S.B.x=1.1;S.B.z=-4.5;S.B.ry=0;S.B.headYaw=0;S.B.shirt='#1a1d1a';S.post.css={filter:'saturate(.45) contrast(1.3)',mul:'#cfe8c8'};S.post.vig=.85;S.post.grain=.5}});
add({id:'vhs',cat:'estilo',es:'VHS / found footage',en:'found footage, 1990s VHS camcorder, 4:3, scan lines, tracking noise, date stamp, shaky handheld',dur:8,
  what:'Imagen de cámara casera de los 90, como si alguien hubiera encontrado la cinta.',
  look:'Formato 4:3, líneas de barrido, una franja de ruido que sube y la fecha en la esquina. La cámara tiembla porque la lleva alguien.',
  ref:'El proyecto de la bruja de Blair (1999), REC (2007)',alias:'camcorder found footage',
  fn(t,S){S.look=mk(LOOKS.blue);walkX(S.A,t,8,-2.2,2.2);const n=s=>Math.sin(t*2.6+s)*.5+Math.sin(t*6.1+s*2.1)*.3+Math.sin(t*11+s*3.3)*.2;
    setCam(S,{p:[S.A.x*.5+.07*n(1),1.6+.06*n(2),3.4+.05*n(3)],t:[S.A.x+.1*n(4),1.25+.08*n(5),0],fov:44,roll:.03*n(6)});S.post.mask=4/3;S.post.css={filter:'saturate(1.4) contrast(1.15) blur(.6px)'};S.hud=vhsHud(t)}});
add({id:'bleach',cat:'estilo',es:'Bleach bypass',en:'bleach bypass look, desaturated, high contrast, silvery highlights, gritty',dur:8,
  what:'Un proceso del negativo que deja la imagen casi sin color y con mucho contraste. Hoy se imita en el color grading.',
  look:'El color casi desaparece, los negros se cierran y las luces quedan plateadas. Se siente áspero y sin glamour.',
  ref:'Rescatando al soldado Ryan (1998), Seven (1995)',
  fn(t,S){S.look=mk({skyTop:'#8f989e',skyBot:'#c4c9cc',fog:'#b9bfc2',fogD:.016,sun:1.0,hemi:.6});walkX(S.A,t,8,-2.6,2.6);setCam(S,{p:[S.A.x*.6+.6,1.5,4],t:[S.A.x,1.25,0],fov:36});
    S.post.css={filter:'saturate(.3) contrast(1.6) brightness(1.03)'};S.post.grain=.45}});
add({id:'dayfornight',cat:'estilo',es:'Noche americana',en:'day for night, shot in daylight and graded dark blue to look like night',dur:9,
  what:'Filmar de día y oscurecer la imagen en el color para que parezca de noche.',
  look:'A la izquierda de la línea, la toma como se filmó. A la derecha, corregida: azul, oscura y con poco color. Las sombras duras delatan que hay sol.',
  ref:'Mad Max: Furia en el camino (2015)',alias:'day for night',
  fn(t,S){walkX(S.A,t,9,-2.6,2.6);setCam(S,{p:[.6,1.45,4.2],t:[S.A.x*.5,1.2,0],fov:36});S.post.grade=[{op:'multiply',c:'#2f4a8a',a:1},{op:'saturation',c:'#808080',a:.5},{op:'multiply',c:'#9aa6c0',a:.6}];S.post.gradeBase=[];S.post.wipe=lerp(.3,.7,pp(t,9,.05));
    S.hud=(c,w,h)=>{const x=w*S.post.wipe;c.fillStyle='#fff';c.fillRect(x-1,0,2,h);label(c,w,_t('Filmado de día'),x-w*.015,h*.86,'right',.022);label(c,w,_t('Corregido a noche'),x+w*.015,h*.86,'left',.022)}}});
add({id:'stopmotion',cat:'estilo',es:'Stop motion',en:'stop-motion animation, handmade miniature set, choppy 10 fps, slight frame-to-frame jitter, tilt-shift look',dur:8,
  what:'Animación cuadro a cuadro de muñecos reales. Se reconoce por el movimiento entrecortado y la escala de maqueta.',
  look:'El personaje se mueve a saltitos porque hay pocos cuadros por segundo, y cada cuadro tiembla un poco. El desenfoque arriba y abajo achica el set.',
  ref:'Coraline (2009), Isla de perros (2018)',alias:'claymation plastilina',
  fn(t,S){S.post.fps=10;const f=Math.floor(t*10);S.look=mk(Object.assign({},LOOKS.golden,{soft:1,sun:1}));S.A.wave=pp(t,8,.3);S.A.x=(hsh(f)-.5)*.03;S.A.headYaw=.3*Math.sin(f/10*1.4);
    setCam(S,{p:[1.5,2.5,5.6],t:[0,1,0],fov:30});S.post.tilt=1;S.post.css={filter:'saturate(1.25) contrast(1.05)'}}});
add({id:'cel',cat:'estilo',es:'Cel shading / anime',en:'cel-shaded anime style, flat color bands instead of gradients, bold saturated colors, clean shapes',dur:8,
  what:'Sombreado por bandas planas en vez de degradados, como el dibujo animado. Lo usan el anime y el 3D que imita la ilustración.',
  look:'Las sombras dejan de ser suaves y se cortan en escalones de color. El cielo y la ropa parecen pintados con pocos tonos.',
  ref:'Arcane (2021), Spider-Man: un nuevo universo (2018)',alias:'toon anime cartoon',
  fn(t,S){S.look=mk({skyTop:'#2f7fe0',skyBot:'#9fd4ff',fog:'#a9d6ff',fogD:.01,sun:1.2,sunP:[4,6,5],hemi:.7,ground:'#5fbf5a',foliage:'#2f9a52'});walkX(S.A,t,8,-2.4,2.4);S.A.hat='#ffd23f';
    setCam(S,{p:[S.A.x+1.4,1.2,3.6],t:[S.A.x,1.25,0],fov:36});S.post.css={filter:'url(#poster) saturate(1.5) contrast(1.08)'}}});
add({id:'stylized3d',cat:'estilo',es:'Animación 3D estilizada',en:'stylized 3D animation, soft global illumination, warm key light and bright rim light, vibrant saturated colors, smooth expressive motion',dur:8,
  what:'El look de las películas de animación 3D: formas simples, luz suave que rebota y colores vivos.',
  look:'Una key cálida y suave, un rim brillante que recorta la silueta y un resplandor leve. Nada se ve áspero ni sucio.',
  ref:'Intensa-Mente (2015), Soul (2020)',alias:'3d animado cgi cartoon',
  fn(t,S){S.look=mk({skyTop:'#7fb4ff',skyBot:'#ffe2c4',fog:'#f6d9c2',fogD:.012,hemi:.95,hemiSky:'#ffe9d6',hemiGnd:'#7a9a6a',sun:.95,sunC:'#ffd9a8',sunP:[-3,4,5],soft:1,rim:2.2,rimC:'#fff4e0',ground:'#8fbf6a',foliage:'#4f9a5a',fogD:.006,skyBot:'#ffd0a8'});
    S.A.dance=.55;S.A.shirt='#ff5a3c';S.A.hat='#3a7bd5';const a=t/8*PI*2;setCam(S,{p:[Math.sin(a)*2.6,1.35,Math.cos(a)*2.6],t:[0,1.2,0],fov:36});S.post.css={filter:'saturate(1.3)'};S.post.bloom=.22}});
add({id:'dreamy',cat:'estilo',es:'Onírico / etéreo',en:'dreamy ethereal look, soft glow, hazy backlight, pastel tones, floating dust particles, slow motion',dur:8,
  what:'Imagen de sueño o de recuerdo: suave, luminosa y un poco irreal.',
  look:'Contraluz cálido, un resplandor que se come los bordes, polvo flotando y un movimiento lento.',
  ref:'El árbol de la vida (2011)',alias:'ethereal sueño',
  fn(t,S){S.look=mk(Object.assign({},LOOKS.golden,{sunP:[-2,1.6,-6],sun:1.2,hemi:.85,fogD:.03,rim:1.6,rimC:'#ffd9a0'}));S.A.x=lerp(-1.2,1.2,t/8);S.A.walk=S.A.x*3.7;S.A.amp=.6;S.A.ry=PI/2;S.A.headYaw=0;
    setCam(S,{p:[.4,1.3,3.6],t:[S.A.x*.6,1.3,0],fov:34});S.props.sunDisc=true;S.post.css={filter:'brightness(1.12) saturate(.8) contrast(.82)'};S.post.bloom=.7;S.hud=dustHud(t)}});
add({id:'musicvideo',cat:'estilo',es:'Estética de videoclip',en:'music video aesthetic, performance shot, colored stage lights changing on the beat, strobe flashes, fast cuts, dynamic angles, haze',dur:8,
  what:'El lenguaje del videoclip: la imagen se mueve al ritmo de la música.',
  look:'Cada dos tiempos cambia el plano y en cada tiempo cambia el color de la luz. Los destellos marcan el primer tiempo de cada compás.',
  alias:'music video performance',
  fn(t,S){const bt=.5,b=Math.floor(t/bt),ph=(t%bt)/bt,cols=['#ff2e88','#18d5e6','#ffd23f','#7a4dff'];
    S.look=mk({skyTop:'#05040b',skyBot:'#140c24',fog:'#140c24',fogD:.045,hemi:.08,hemiSky:'#ffffff',hemiGnd:'#05040b',sun:1.4,sunC:cols[b%4],sunP:[-3,2.5,2],fill:1,fillC:cols[(b+2)%4],fillP:[3,2,1],rim:2,rimC:'#ffffff',ground:'#16121f',foliage:'#120f1c'});
    S.props.set=false;S.props.lights=true;S.A.dance=1;S.A.shirt='#f0f0f0';const V=[{p:[0,1.3,4.2],t:[0,1.15,0],fov:36},{p:[1.6,.4,2.2],t:[0,1.3,0],fov:30},{p:[-.7,1.62,1.1],t:[0,1.58,0],fov:30},{p:[0,4.2,2.6],t:[0,1,0],fov:40}];setCam(S,V[Math.floor(t)%4]);
    S.post.grain=.25;S.hud=(c,w,h)=>{if(b%4===0&&ph<.18){c.fillStyle='rgba(255,255,255,'+(.55*(1-ph/.18)).toFixed(2)+')';c.fillRect(0,0,w,h)}}}});
add({id:'commercial',cat:'estilo',es:'Comercial de producto',en:'premium product commercial, slow orbit around the product, black studio, soft key light, bright rim light, glossy reflections, shallow depth of field',dur:9,
  what:'El plano de anuncio: el producto es el protagonista y la luz lo recorta del fondo.',
  look:'La cámara gira despacio alrededor de la taza. Fondo negro, una luz suave de frente y un borde brillante que dibuja la forma.',
  alias:'producto anuncio advertising',
  fn(t,S){S.look=mk(Object.assign({},LOOKS.studio,{sun:1.1,sunP:[2,3,3],soft:1,rim:2.6,rimC:'#ffffff',rimP:[-1,1.2,-3],hemi:.06}));S.props.set=false;S.A.vis=false;S.props.mug=true;S.props.table=[0,0];
    const a=t/9*PI*1.2-.6;setCam(S,{p:[Math.sin(a)*1.0,1.05,Math.cos(a)*1.0],t:[.05,.84,.05],fov:24});S.post.blur={fg:0,mid:0,bg:6}}});
add({id:'wes',cat:'estilo',es:'Al estilo Wes Anderson',en:'in the style of Wes Anderson: perfectly centered symmetrical composition, flat frontal framing, pastel pink and mustard palette, deadpan characters, quick lateral camera move',dur:8,
  what:'Simetría casi obsesiva, paletas pastel muy definidas, humor seco y cámara que se mueve en líneas rectas.',
  look:'Cada personaje queda clavado al centro, mirando a cámara y sin expresión. La cámara no gira: se desliza de lado como sobre un riel.',
  ref:'El Gran Hotel Budapest (2014), La maravillosa historia de Henry Sugar (2023)',alias:'simetría pastel',
  fn(t,S){S.look=mk({skyTop:'#f4b9c4',skyBot:'#fde3b4',fog:'#f7d4bd',fogD:.02,hemi:1,hemiSky:'#fff1e6',hemiGnd:'#d9a7a0',sun:.6,sunC:'#fff2dc',sunP:[0,8,3],ground:'#e5b19f',foliage:'#d98f8f'});S.props.set=false;
    S.A.x=-1.8;S.A.ry=0;S.A.headYaw=0;S.A.shirt='#d9a13a';S.A.hat='#c0392b';S.B.vis=true;S.B.x=1.8;S.B.ry=0;S.B.headYaw=0;S.B.shirt='#6a8fb8';S.B.hat='#d9a13a';
    const k=t<3.4?0:t<4?ss((t-3.4)/.6):t<7.4?1:1-ss((t-7.4)/.6),cx=lerp(-1.8,1.8,k);setCam(S,{p:[cx,1.32,3.6],t:[cx,1.22,0],fov:36});S.post.css={filter:'saturate(1.15)'};S.hud=symHud}});
add({id:'kubrick',cat:'estilo',es:'Al estilo Kubrick',en:'in the style of Stanley Kubrick: one-point perspective, perfectly symmetrical corridor, slow steady push-in, wide-angle lens, cold unsettling mood',dur:9,
  what:'Composiciones simétricas con un solo punto de fuga, movimientos lentos y controlados, y una frialdad que inquieta.',
  look:'Todas las líneas del pasillo de árboles van al mismo punto, donde espera el personaje. La cámara avanza recta y sin pausa con un gran angular.',
  ref:'El resplandor (1980), 2001: Odisea del espacio (1968)',alias:'one-point perspective punto de fuga',
  fn(t,S){S.props.set=false;S.props.avenue=true;S.look=mk({skyTop:'#9fb2c8',skyBot:'#dfe6ee',fog:'#d7dee6',fogD:.02,sun:.55,sunP:[0,8,2],hemi:.85,ground:'#8a8f86',foliage:'#3e5a48'});
    S.A.z=-14;S.A.headYaw=0;S.A.shirt='#2f4f7f';const k=ss(t/9);setCam(S,{p:[0,1.5,lerp(10,1,k)],t:[0,1.5,-14],fov:mm2fov(18)});S.post.css={filter:'saturate(.8) contrast(1.1)'};S.hud=vpHud}});
add({id:'tarantino',cat:'estilo',es:'Al estilo Tarantino',en:'in the style of Quentin Tarantino: trunk shot from inside a car trunk, extreme low angle looking up at two characters in black suits, then a crash zoom, saturated 1970s colors, film grain',dur:8,
  what:'Diálogos largos, violencia con humor negro y homenajes al cine de género. Visualmente tiene planos firma, como el plano desde la cajuela.',
  look:'La cámara está en el fondo de una cajuela y los dos personajes se asoman mirando hacia abajo. Después, un crash zoom a una cara.',
  ref:'Perros de reserva (1992), Pulp Fiction (1994)',alias:'trunk shot cajuela',
  fn(t,S){S.look=mk({skyTop:'#2f7fd6',skyBot:'#a8d4ff',fog:'#b8dcff',fogD:.008,sun:1.2,sunP:[2,7,3],hemi:.8});S.props.set=false;
    S.A.x=-.42;S.A.z=-.75;S.A.ry=.25;S.A.nod=.55;S.A.headYaw=0;S.A.shirt='#16171a';S.B.vis=true;S.B.x=.42;S.B.z=-.75;S.B.ry=-.25;S.B.nod=.55;S.B.shirt='#16171a';S.B.talk=t<5?1:0;
    const z=t<5?0:ss((t-5)/.35);camLerp(S,{p:[0,.35,.15],t:[0,1.75,-.85],fov:62},{p:[0,.35,.15],t:[-.42,1.72,-.7],fov:18},z);S.post.css={filter:'saturate(1.35) contrast(1.15) sepia(.1)'};S.post.grain=.3;
    S.hud=(c,w,h)=>{c.fillStyle='rgba(8,8,10,.96)';c.beginPath();c.moveTo(0,h);c.lineTo(0,h*.78);c.lineTo(w*.18,h*.86);c.lineTo(w*.82,h*.86);c.lineTo(w,h*.78);c.lineTo(w,h);c.fill();c.fillRect(0,0,w,h*.06)}}});

/* LENTE, MOVIMIENTO, EDICIÓN Y COMPOSICIÓN (más) */
add({id:'fisheye',cat:'lente',es:'Ojo de pez',en:'fisheye lens, ultra-wide curved distortion, low angle close to the subject',dur:8,
  what:'Un lente ultra gran angular que curva las líneas rectas. Exagera lo que está cerca y aleja lo demás.',
  look:'El horizonte y los árboles se doblan, el centro se agranda y los bordes se comprimen. Es típico de videos de skate y de escenas raras o incómodas.',
  ref:'Pobres criaturas (2023), La favorita (2018)',alias:'fish-eye fisheye',
  fn(t,S){walkX(S.A,t,8,-1.6,1.6);const K=1.22;setCam(S,{p:[S.A.x*.4,.32,1.5],t:[S.A.x*.8,1.05,0],fov:fishFov(K)});S.post.fish=K;S.mm=8}});
add({id:'bloom',cat:'lente',es:'Halación / bloom',en:'soft bloom, halation around bright lights, glowing highlights',dur:8,
  what:'El resplandor que se forma alrededor de las luces fuertes. En película se llama halación; en digital se agrega como bloom.',
  look:'Las luces del fondo y el farol se abren en un halo suave. Sin él la imagen se ve más dura y más digital.',
  alias:'halation glow resplandor',
  fn(t,S){S.look=mk(Object.assign({},LOOKS.night,{lamp:2.6}));S.props.lights=true;S.A.x=LAMP[0]+.85;S.A.z=LAMP[1]-.25;S.A.ry=-.75;setCam(S,{p:[1.2,1.5,.6],t:[3.4,1.6,-3.6],fov:40});
    const k=t<3?0:t<4?ss(t-3):t<7?1:1-ss(t-7);S.post.bloom=.85*k;S.cap=k<.5?_t('Sin bloom'):_t('Con bloom')}});
add({id:'reveal',cat:'mov',es:'Plano de revelación',en:'reveal shot, the camera slides out from behind a wall to reveal the subject',dur:8,
  what:'La cámara empieza tapada por algo del primer término y se mueve para descubrir al sujeto o el lugar.',
  look:'La pared llena el cuadro y el movimiento lateral destapa al personaje a través de la puerta. La información llega con el movimiento.',
  alias:'reveal revelación',
  fn(t,S){S.props.door=true;const k=ss((t-1)/4.5);setCam(S,{p:[lerp(-2.6,0,k),1.35,5.4],t:[lerp(-1.4,0,k),1.25,0],fov:38});S.A.wave=k>.8?pp(t,8,.3):0}});
add({id:'kuleshov',cat:'edicion',es:'Efecto Kuleshov',en:'reaction shot intercut with what the character sees',dur:10,
  what:'El público le da significado a una cara neutra según el plano que va al lado.',
  look:'Es exactamente el mismo primer plano las dos veces. Junto a la taza parece antojo; junto a alguien que saluda, alegría.',
  ref:'Experimento de Lev Kuleshov (década de 1920)',alias:'kuleshov montaje',
  fn(t,S){S.props.mug=true;S.props.table=[1.6,1.4];S.B.vis=true;S.B.x=-3;S.B.z=3;S.B.ry=PI*.75;S.B.wave=1;S.A.headYaw=0;S.A.nod=0;
    const i=Math.floor(t/1.67)%6,face={p:[0,1.65,.95],t:[0,1.64,0],fov:30};
    if(i===1)setCam(S,{p:[1.08,1.15,.88],t:[1.65,.84,1.45],fov:24});else if(i===4)setCam(S,{p:[-1.5,1.55,.8],t:[-3,1.3,3],fov:34});else setCam(S,face);
    S.cap=[_t('Cara neutra'),_t('+ una taza'),'= antojo',_t('Cara neutra'),_t('+ alguien que saluda'),_t('= alegría')][i]}});
add({id:'screendir',cat:'edicion',es:'Dirección de pantalla',en:'consistent screen direction: the character exits frame right and enters the next shot from frame left',dur:9,
  what:'Si un personaje sale del cuadro por la derecha, en el plano siguiente debe entrar por la izquierda para que siga yendo hacia el mismo lado.',
  look:'Primero la versión correcta, donde sigue avanzando. Después la incorrecta: entra por el lado por donde salió y parece que se devuelve.',
  alias:'screen direction continuidad dirección',
  fn(t,S){const i=t<3?0:t<6?1:2,l=i===0?t:i===1?t-3:t-6;
    if(i===0){walkX(S.A,l,3,-1.2,4.4);setCam(S,{p:[0,1.4,4.6],t:[0,1.15,0],fov:38});S.cap=_t('Plano 1: sale por la derecha')}
    else{const ok=i===1;walkX(S.A,l,3,ok?-4.4:4.4,ok?1.2:-1.2);S.A.z=-3;setCam(S,{p:[0,1.4,1.4],t:[0,1.15,-3],fov:38});S.badge=ok?_t('Correcto'):_t('Incorrecto');S.badgeKind=ok?'ok':'bad';S.cap=ok?_t('Plano 2: entra por la izquierda'):_t('Plano 2: entra por la derecha')}}});
add({id:'beatcut',cat:'edicion',es:'Corte al ritmo',en:'fast cuts synced to the beat of the music',dur:8,
  what:'Los cortes caen justo en los tiempos de la música. Es la base del videoclip y de mucho contenido para redes.',
  look:'Mirá el círculo que late con la música. En la primera mitad cada corte cae en un tiempo y se siente limpio; en la segunda llegan un poco tarde y molestan aunque no sepas por qué.',
  alias:'beat sync edición al beat cortes al ritmo',
  fn(t,S){const off=t>=4;S.A.dance=1;S.props.lights=true;S.look=mk(Object.assign({},LOOKS.blue,{lamp:2,sun:.7,sunC:'#ff5aa0',sunP:[2,3,4],fill:.6,fillC:'#5ad1ff',fillP:[-3,2,3]}));const cuts=[];for(let c=1;c<8;c++)cuts.push(c+(c>=4?.22:0));
    let n=0;cuts.forEach(c=>{if(t>=c)n++});const V=[SH.wide,{p:[1.4,.5,2.3],t:[0,1.3,0],fov:32},{p:[-.6,1.6,1.2],t:[0,1.55,0],fov:30},{p:[0,3.6,3],t:[0,1,0],fov:38}];setCam(S,V[n%4]);
    S.badge=off?_t('Fuera del tiempo'):_t('En el tiempo');S.badgeKind=off?'bad':'ok';S.hud=beatHud(t,120,cuts,8)}});
add({id:'safezone',cat:'composicion',es:'Zona segura en vertical',en:'vertical 9:16 video, subject centered, key action kept away from the top and bottom edges',dur:7,
  what:'En Reels, TikTok y Shorts la interfaz tapa la parte de arriba, la de abajo y la columna derecha. Lo importante va en el rectángulo del centro.',
  look:'Las zonas rojas quedan debajo de botones y textos de la app. La cara y la acción tienen que caer dentro del recuadro verde.',
  alias:'reels tiktok shorts vertical 9:16 safe zone',
  fn(t,S){S.A.wave=pp(t,7,.3);setCam(S,{p:[0,1.45,2.6],t:[0,1.35,0],fov:52});S.post.mask=9/16;S.hud=safeHud}});

/* MÉTODOS DE IA */
const T2V='Wide tracking shot of a person in a red shirt walking through a park at golden hour, warm light, long shadows, cinematic';
add({id:'t2v',cat:'ia',es:'Texto a video',en:T2V,dur:13,
  what:'Escribís el plano y la IA genera el clip entero. Es el método más rápido.',
  look:'Primero el prompt, después la imagen que se arma desde el ruido y al final el clip. La segunda generación con el mismo texto sale con otro personaje: por eso sirve para planos donde la continuidad no importa.',
  alias:'text to video t2v',
  fn(t,S){S.look=mk(LOOKS.golden);const g=t<3.6?0:t<5.4?ss((t-3.6)/1.8):1,tw=t>=9.2,lt=tw?t-9.2:Math.max(0,t-3.6);
    walkX(S.A,lt,6,-2.4,2.4);S.A.z=.4;if(tw){S.A.shirt='#2f6fb4';S.A.hat='#2a2a2a'}setCam(S,{p:[S.A.x+.3,1.35,5.4],t:[S.A.x,1.15,0],fov:36});
    if(g<1)S.post.css={filter:'blur('+(14*(1-g)).toFixed(1)+'px)'};
    S.cap=t<3.6?_t('1. El prompt'):t<5.4?_t('2. La IA genera desde el ruido'):tw?_t('4. Otra generación, mismo prompt'):_t('3. El clip');if(tw){S.badge=_t('El personaje cambió');S.badgeKind='bad'}
    S.hud=hudAll(noiseHud(t<3.6?1:1-g),t<4.2?typeHud(T2V,t/3.2,t<3.6?1:1-ss((t-3.6)/.6)):null)}});
add({id:'i2v',cat:'ia',es:'Imagen a video',en:'Use the image as the first frame. The person turns toward the camera and waves, slow push-in.',dur:9,
  what:'Primero se genera o se pinta la imagen y después la IA la anima. El personaje, la ropa y el lugar quedan fijados por la imagen.',
  look:'Los primeros segundos son una foto quieta: la imagen de referencia. Después cobra vida sin cambiar de ropa ni de lugar, porque la imagen manda.',
  alias:'image to video i2v',
  fn(t,S){S.look=mk(LOOKS.golden);const still=t<3,lt=still?0:t-3,k=ss(lt/6);S.A.ry=lerp(.9,0,ss(lt/1.5));S.A.headYaw=lerp(.6,0,ss(lt/1.5));S.A.wave=still?0:pp(lt,6,.25);
    setCam(S,{p:[.4,1.45,lerp(4.4,2.6,k)],t:[0,1.3,0],fov:34});S.tt=still?0:null;S.cap=still?_t('La imagen de referencia'):_t('La IA la anima');S.hud=frameHud(still?_t('IMAGEN'):'VIDEO',still)}});
add({id:'v2v',cat:'ia',es:'Video a video',en:'Restyle this video as a neon night scene, keep the original motion and framing / Change the shirt to yellow',dur:10,
  what:'Se sube un video y la IA le cambia el estilo, el lugar o el vestuario. El movimiento y el encuadre se conservan.',
  look:'La línea separa el original, a la derecha, del resultado, a la izquierda. Los dos se mueven igual porque el movimiento viene del original.',
  alias:'video to video v2v restyle',
  fn(t,S,S2){const ph=t<5?0:1;[S,S2].forEach(s=>{s.A.dance=.8;setCam(s,{p:[.5,1.35,3.6],t:[0,1.2,0],fov:36})});S.look=mk(Object.assign({},LOOKS.day,{hemi:.9,sun:.6}));S.A.shirt='#8d929b';
    if(ph===0){S2.look=mk({skyTop:'#070512',skyBot:'#1c1038',fog:'#150c2b',fogD:.03,hemi:.14,hemiSky:'#6a4dff',hemiGnd:'#0b0616',sun:1.25,sunC:'#ff2e88',sunP:[-4,2.2,2.6],fill:1.05,fillC:'#18d5e6',fillP:[4,1.8,1.6],ground:'#1c1830',foliage:'#1a2440',lamp:1.5,win:1});S2.props.lights=true;S2.A.shirt='#20202a';S2.A.hat='#18d5e6'}
    else{S2.look=S.look;S2.A.shirt='#f2c230'}
    S.post.wipeMix=lerp(.3,.7,.5+.5*Math.sin(t*1.3));S.cap=ph===0?_t('Cambio de estilo'):_t('Cambio de vestuario');S.hud=twoLabels(_t('Resultado'),_t('Original'))}});
add({id:'motiontransfer',cat:'ia',es:'Transferencia de movimiento',en:'motion control: character image + reference video; the character performs the same dance, single subject, full body, steady camera, no cuts',dur:8,
  what:'Se le da a la IA una imagen del personaje y un video de alguien haciendo el movimiento. El personaje copia el movimiento con su propio aspecto.',
  look:'A la izquierda, la referencia grabada en un cuarto cualquiera. A la derecha, el personaje en su mundo con el mismo baile. La referencia funciona mejor con un solo cuerpo entero, cámara quieta y sin cortes.',
  alias:'motion control kling baile dance motion transfer',
  fn(t,S,S2){[S,S2].forEach(s=>{s.A.dance=1;s.A.headYaw=0;setCam(s,{p:[0,1.05,4.3],t:[0,1.0,0],fov:36})});
    S.look=mk(Object.assign({},LOOKS.highkey,{skyTop:'#c9ccd2',skyBot:'#dcdfe4',fog:'#d6d9de',ground:'#b9bcc2'}));S.props.set=false;S.A.shirt='#7d828c';
    S2.look=mk(LOOKS.golden);S2.A.vis=false;S2.B.vis=true;S2.B.x=0;S2.B.z=0;S2.B.ry=0;S2.B.dance=1;S2.B.headYaw=0;S.post.split=true;S.hud=twoLabels(_t('Video de referencia'),_t('Personaje animado'))},
  fnS(t,S,S2){[S,S2].forEach(s=>{s.A.dance=1;s.A.headYaw=0;setCam(s,{p:[0,1.05,4.3],t:[0,1.0,0],fov:36})});
    S.look=mk(Object.assign({},LOOKS.highkey,{skyTop:'#c9ccd2',skyBot:'#dcdfe4',fog:'#d6d9de',ground:'#b9bcc2'}));S.props.set=false;S.A.shirt='#7d828c';
    S2.look=mk(LOOKS.golden);S2.A.shirt='#c0392b';S2.A.hat='#f2c230';S.post.split=true;S.hud=twoLabels(_t('Video de referencia'),_t('Personaje animado'))}});
add({id:'elements',cat:'ia',es:'Referencias combinadas',en:'Character reference + location reference + object reference: the person walks to the table and picks up the yellow mug',dur:10,
  what:'Se suben referencias separadas del personaje, del lugar y de un objeto, y la IA las junta en un mismo plano. Kling las llama elementos.',
  look:'Primero cada referencia sola, sobre fondo neutro o vacía. Después el plano final, donde aparecen las tres sin cambiar.',
  alias:'elements elementos ingredientes referencias',
  fn(t,S){const i=t<1.6?0:t<3.2?1:t<4.8?2:3;
    if(i===0){S.look=mk(LOOKS.highkey);S.props.set=false;S.A.ry=.5;setCam(S,{p:[0,1.2,4.6],t:[0,1,0],fov:34});S.cap=_t('Referencia 1: personaje')}
    else if(i===1){S.A.vis=false;setCam(S,{p:[2,2.6,9],t:[-2,1,-4],fov:44});S.cap=_t('Referencia 2: lugar')}
    else if(i===2){S.look=mk(LOOKS.highkey);S.props.set=false;S.A.vis=false;S.props.mug=true;S.props.table=[0,0];setCam(S,{p:[.5,1.15,.9],t:[.05,.84,.05],fov:26});S.cap=_t('Referencia 3: objeto')}
    else{const l=t-4.8;S.props.mug=true;S.props.table=[.9,.2];S.A.x=lerp(-2.4,.35,ss(l/3.2));S.A.walk=S.A.x*3.7;S.A.amp=l<3.2?1:0;S.A.ry=PI/2;S.A.headYaw=0;S.A.wave=l>3.6?.35:0;setCam(S,{p:[.2,1.5,4.6],t:[-.2,1.05,0],fov:38});S.cap=_t('Resultado: las tres en un plano')}
    S.badge=i<3?(i+1)+' / 3':''}});
add({id:'startend',cat:'ia',es:'Frame inicial y final',en:'Start frame: wide shot of the person under the street lamp. End frame: close-up of the face. Slow push-in between them.',dur:9,
  what:'Se le dan a la IA dos imágenes, la primera y la última, y ella inventa el movimiento del medio.',
  look:'El plano arranca en el frame inicial y termina exacto en el final. La barra de abajo muestra que la IA rellena todo lo que está entre los dos.',
  alias:'start frame end frame first last keyframes interpolación',
  fn(t,S){S.look=mk(Object.assign({},LOOKS.blue,{lamp:2}));S.A.x=LAMP[0]+.7;S.A.z=LAMP[1]+.3;S.A.ry=-.5;S.A.headYaw=0;
    const A0={p:[S.A.x-2.2,1.5,S.A.z+6.5],t:[S.A.x,1.25,S.A.z],fov:38},B0={p:[S.A.x+Math.sin(-.5)*.9,1.64,S.A.z+Math.cos(-.5)*.9],t:[S.A.x,1.64,S.A.z],fov:30};
    const k=t<1.8?0:t<7.2?ss((t-1.8)/5.4):1;camLerp(S,A0,B0,k);S.cap=t<1.8?_t('Frame inicial'):t<7.2?_t('La IA genera el movimiento'):_t('Frame final');
    S.hud=(c,w,h)=>{const x0=w*.1,x1=w*.9,y=h*.9;c.fillStyle='rgba(0,0,0,.55)';c.fillRect(x0-10,y-14,x1-x0+20,28);c.fillStyle='#ffd24a';c.fillRect(x0-4,y-8,8,16);c.fillRect(x1-4,y-8,8,16);c.fillStyle='rgba(255,255,255,.35)';c.fillRect(x0+6,y-2,x1-x0-12,4);c.fillStyle='#ff5a4f';c.fillRect(x0+6,y-2,(x1-x0-12)*k,4)}}});
add({id:'multishot',cat:'ia',es:'Varios planos en un prompt',en:'9s, 3 shots, 16:9. Shot 1: wide establishing shot of the park at dusk. Shot 2: medium tracking shot as the person walks to the lamp. Shot 3: close-up of the face as the lamp turns on.',dur:9,
  what:'Algunas herramientas, como Seedance o el Multi-Shot de Kling, generan varios planos seguidos con un solo prompt. Se escribe la duración, el número de planos y cada plano por separado.',
  look:'Arriba a la derecha va el encabezado del prompt. Cada plano dura lo que dice el texto y la barra marca dónde corta.',
  alias:'multi-shot multishot seedance plano por plano',
  fn(t,S){S.look=mk(LOOKS.blue);const i=t<3?0:t<6?1:2;S.look.lamp=i===2?lerp(.3,2.2,ss((t-6)/.8)):.3;
    if(i===0){S.A.x=-3;S.A.ry=PI/2;setCam(S,{p:[1,3,12],t:[-1,1,-3],fov:42})}
    else if(i===1){const k=ss((t-3)/3);S.A.x=lerp(-1.6,LAMP[0]-.3,k);S.A.z=lerp(0,LAMP[1]+.4,k);S.A.ry=2.1;S.A.walk=t*6;S.A.amp=1;S.A.headYaw=0;setCam(S,{p:[S.A.x+.4,1.4,S.A.z+2.6],t:[S.A.x,1.25,S.A.z],fov:38})}
    else{S.A.x=LAMP[0]-.3;S.A.z=LAMP[1]+.4;S.A.ry=.3;S.A.headYaw=.3;setCam(S,{p:[S.A.x+Math.sin(.6)*.95,1.64,S.A.z+Math.cos(.6)*.95],t:[S.A.x,1.64,S.A.z],fov:30})}
    S.cap='Shot '+(i+1)+_t(' de 3');S.hud=hudAll(strip([3,6],9,t),(c,w,h)=>label(c,w,'9s · 3 shots · 16:9',w*.97,h*.03,'right',.022))}});
add({id:'motion3',cat:'ia',es:'Sujeto, cámara y entorno',en:'Subject motion: the person walks forward. Camera motion: slow push-in. Scene motion: leaves falling, dust floating.',dur:12,
  what:'Un clip tiene tres fuentes de movimiento: el sujeto, la cámara y el entorno. Runway pide las tres por separado y las demás herramientas también responden mejor así.',
  look:'Primero se mueve solo el personaje, después solo la cámara, después solo el entorno y al final las tres cosas juntas. Si el prompt no menciona una, la IA la decide sola.',
  alias:'subject motion camera motion scene motion runway',
  fn(t,S){const i=Math.floor(t/3)%4,l=t%3,sub=i===0||i===3,camM=i===1||i===3,env=i===2||i===3;S.look=mk(Object.assign({},LOOKS.golden,{fogD:env?.02+.012*Math.sin(t*1.5):.013}));
    if(sub){S.A.x=lerp(-1,1,l/3);S.A.walk=S.A.x*3.7;S.A.amp=1;S.A.ry=PI/2;S.A.headYaw=0}else S.A.headYaw=0;
    const k=camM?ss(l/3):0;setCam(S,{p:[0,1.4,lerp(5,3,k)],t:[0,1.2,0],fov:36});S.cap=[_t('Solo el sujeto'),_t('Solo la cámara'),_t('Solo el entorno'),_t('Las tres juntas')][i];if(env)S.hud=hudAll(dustHud(t),leavesHud(t))}});
add({id:'charsheet',cat:'ia',es:'Hoja de personaje',en:'character reference sheet, full body, front view, three-quarter view, profile and back view, same outfit, neutral white background',dur:10,
  what:'La ficha visual del personaje: el mismo cuerpo y la misma ropa desde varios ángulos, sobre fondo neutro. Es la referencia que se reutiliza en cada plano.',
  look:'El personaje gira y se detiene de frente, en tres cuartos, de perfil y de espaldas. Fondo blanco, luz pareja y nada que distraiga.',
  alias:'character sheet turnaround model sheet ficha',
  fn(t,S){S.look=mk(LOOKS.highkey);S.props.set=false;S.A.hat='#c0392b';S.A.headYaw=0;const st=[0,PI/4,PI/2,PI],i=Math.floor(t/2.5)%4,l=t%2.5,nx=i===3?2*PI:st[i+1];
    S.A.ry=l<1.9?st[i]:lerp(st[i],nx,ss((l-1.9)/.6));setCam(S,{p:[0,1.0,4.4],t:[0,.95,0],fov:34});S.cap=[_t('Frente'),_t('Tres cuartos'),_t('Perfil'),_t('Espalda')][i]}});
add({id:'consistency',cat:'ia',es:'Consistencia de personaje',en:'the same person in the same red shirt and red cap in every shot',dur:12,
  what:'Que el personaje se vea igual en todos los planos: cara, ropa, colores y accesorios.',
  look:'Primero cuatro planos con el mismo vestuario. Después los mismos cuatro planos generados sin referencia: la camisa y la gorra cambian y parece otra persona.',
  alias:'character consistency continuidad',
  fn(t,S){conv(S);S.B.vis=false;S.A.x=0;S.A.ry=0;S.A.headYaw=0;const bad=t>=6,i=Math.floor((t%6)/1.5);const V=[SH.wide,{p:[.4,1.45,2],t:[0,1.35,0],fov:38},{p:[2,1.5,.4],t:[0,1.45,0],fov:32},{p:[0,1.64,.95],t:[0,1.62,0],fov:30}];setCam(S,V[i]);
    const shirts=['#b4482f','#2f6fb4','#b4482f','#3f8a4a'],hats=['#c0392b',null,'#2a2a2a','#c0392b'];S.A.shirt=bad?shirts[i]:'#b4482f';S.A.hat=bad?hats[i]:'#c0392b';
    S.badge=bad?_t('Inconsistente'):_t('Consistente');S.badgeKind=bad?'bad':'ok';S.cap=_t('Plano ')+(i+1)}});
add({id:'drift',cat:'ia',es:'Deriva y morphing',en:'keep the same person, the same red shirt and the same cap from the first frame to the last',dur:9,
  what:'El personaje o un objeto se transforma poco a poco dentro del mismo clip. Pasa más en clips largos porque los errores pequeños se acumulan.',
  look:'Es un solo plano sin cortes: la camisa pasa de roja a azul y la gorra desaparece. Para evitarlo, clips cortos, una imagen de referencia y la misma descripción en cada prompt.',
  alias:'morphing drift identity drift',
  fn(t,S){walkX(S.A,t,9,-2.6,2.6);const k=ss((t-2)/5);S.A.shirt=mixC('#b4482f','#2f6fb4',k);S.A.hat=k<.55?'#c0392b':null;setCam(S,{p:[S.A.x*.5,1.45,4.2],t:[S.A.x,1.2,0],fov:36});
    S.badge=k>.15?_t('Deriva'):'';S.badgeKind='bad';S.cap=k<.1?_t('Segundo 0'):k<.9?_t('Cambia sin cortar'):_t('Ya parece otra persona')}});

/* referencias y sinónimos para términos que ya estaban */
const EXTRA={golden:{ref:'La La Land (2016), Llámame por tu nombre (2017)'},bluehour:{ref:'Drive (2011), Moonlight (2016)'},
  dof:{ref:'Foco profundo: Ciudadano Kane (1941). Poca profundidad: Taxi Driver (1976)',alias:'deep focus shallow depth of field blurred background fondo desenfocado'},
  symmetry:{ref:'El Gran Hotel Budapest (2014), El resplandor (1980)'},lowkey:{ref:'El padrino (1972)'},
  dolly:{alias:'push-in push in pull back acercamiento'},drone:{alias:'aerial aéreo'},pov:{alias:'first-person primera persona'},rack:{alias:'cambio de foco'},profile:{alias:'side profile'},
  tracking:{alias:'follow seguimiento'},orbit:{alias:'camera orbit circular 360 arc'},crashzoom:{alias:'fast push-in'},volumetric:{alias:'god rays niebla bruma mist'},handheld:{alias:'shaky cam'},
  establishing:{alias:'plano de situación'},anamorphic:{alias:'cinemascope'},slowmo:{alias:'slow motion'},palette:{alias:'moodboard paleta'}};
for(const id in EXTRA){const d=D.find(x=>x.id===id);if(d)Object.assign(d,EXTRA[id])}

/* estilos para el modo manual: cargan valores y agregan efectos */
const STY={
  none:{n:'Sin estilo'},
  noir:{n:'Cine negro',en:'film noir, black and white, venetian blind shadows, smoky haze',mood:'tense, mysterious',man:{amb:'studio',lut:'noir',con:.3,grain:.45,vig:.5,keyAz:55,keyEl:30,keyInt:1.6,fog:.012},fx:S=>{S.hud=blindsHud()}},
  western:{n:'Western',en:'western, dusty desert, harsh sun, warm desaturated tones',mood:'tense, epic',env:'dust blowing across the ground',amb:'dry wind',man:{amb:'day',kelvin:4300,sat:-.3,con:.35,grain:.35,aspect:2.39,keyEl:70,keyInt:1.3},
    fx:S=>{const p=PAL[0].look;Object.assign(S.look,{skyTop:p.skyTop,skyBot:p.skyBot,fog:p.fog,ground:p.ground,foliage:p.foliage});S.A.hat='#6b4a2e'}},
  scifi:{n:'Ciencia ficción',en:'science fiction, sterile white futuristic set, perfect symmetry, cool clean light',mood:'cold, sterile',place:'in a sterile white futuristic room',man:{amb:'highkey',kelvin:8000,sat:-.4}},
  melodrama:{n:'Melodrama Technicolor',en:'1950s Technicolor melodrama, lush saturated colors, soft glamorous light',mood:'romantic, emotional',man:{amb:'day',hard:false,sat:.7,fill:.6,kelvin:4800},fx:S=>{S.post.bloom=.3}},
  eighties:{n:'Estética de los 80',en:'1980s cinematic style, neon magenta and cyan, hazy, glowing lights, film grain',mood:'nostalgic',man:{amb:'night',lights:true,fog:.03,grain:.4,sat:.3},
    fx:S=>{Object.assign(S.look,{sunC:'#ff3d9a',sun:Math.max(S.look.sun,.8),fill:Math.max(S.look.fill,.8),fillC:'#29d3ff'});S.post.bloom=.45}},
  retro:{n:'Look retro',en:'retro 1970s film look, warm faded colors, soft focus, heavy film grain',mood:'nostalgic',man:{amb:'golden',lut:'vint',grain:.7,vig:.6,con:-.3}},
  cyberpunk:{n:'Cyberpunk',en:'cyberpunk, rain, neon magenta and cyan signs, wet reflective ground',mood:'gritty, futuristic',env:'rain falling, neon signs flickering',amb:'heavy rain and a distant city hum',man:{amb:'night',lights:true,fog:.03,sat:.4,con:.3},
    fx:(S,t)=>{Object.assign(S.look,{sunC:'#ff2e88',sun:Math.max(S.look.sun,.9),fill:Math.max(S.look.fill,.9),fillC:'#18d5e6',ground:'#121022'});S.hud=rainHud(t)}},
  steampunk:{n:'Steampunk',en:'steampunk, Victorian era, brass and copper tones, warm gaslight, smoky haze',mood:'adventurous',man:{amb:'night',lamp:2.6,fog:.035,lut:'vint',sat:.2,grain:.3,vig:.5},fx:(S,t)=>{S.A.hat='#2a1d14';S.hud=gearsHud(t)}},
  documentary:{n:'Documental',en:'documentary style, handheld, natural light, observational',mood:'honest, observational',man:{amb:'day',move:'handheld',action:'walk'}},
  expressionism:{n:'Expresionismo',en:'German expressionism, distorted angular set, long exaggerated shadows, black and white',mood:'nightmarish',man:{amb:'studio',lut:'noir',con:.7,roll:-14,keyEl:8,keyAz:75,keyInt:1.6,vig:.7,grain:.4},
    fx:(S,t)=>{S.post.warp='skewX('+(-8+3*Math.sin(t*.8)).toFixed(2)+'deg) skewY(2deg) scale(1.14)'}},
  horror:{n:'Terror',en:'horror, dark foggy night, lit from below, desaturated green tint',mood:'dread',env:'fog creeping along the ground',amb:'a low drone and a distant creak',man:{amb:'night',fog:.06,move:'handheld',sat:-.55,con:.35,vig:.8,grain:.5,keyInt:0},
    fx:S=>{Object.assign(S.look,{fill:1.3,fillC:'#d6ecd6',fillP:[.25,-2.4,1.6],lamp:0,win:0});S.post.css.mul='#cfe8c8'}},
  vhs:{n:'VHS / found footage',en:'found footage, 1990s VHS camcorder, scan lines, date stamp',mood:'raw, unsettling',man:{amb:'blue',move:'handheld',aspect:1.3333,sat:.35,con:.2},fx:(S,t)=>{S.hud=vhsHud(t);S.post.css.filter=(S.post.css.filter+' blur(.6px)').trim()}},
  bleach:{n:'Bleach bypass',en:'bleach bypass look, desaturated, high contrast, silvery highlights',mood:'gritty',man:{amb:'day',sat:-.65,con:.65,grain:.45}},
  dayfornight:{n:'Noche americana',en:'day for night, daylight graded dark blue to look like night',mood:'quiet, tense',man:{amb:'day',ev:-1.3,kelvin:9000,sat:-.4},fx:S=>{S.post.css.mul='#7d95cf'}},
  stopmotion:{n:'Stop motion',en:'stop-motion animation, handmade miniature set, choppy frame rate',mood:'handcrafted, charming',man:{amb:'golden',fps:12,shutter:1000,hard:false},fx:S=>{S.post.tilt=1}},
  cel:{n:'Cel shading / anime',en:'cel-shaded anime style, flat color bands, bold saturated colors',mood:'energetic',man:{amb:'day',sat:.5},fx:S=>{S.post.css.filter=('url(#poster) '+S.post.css.filter).trim()}},
  stylized3d:{n:'Animación 3D estilizada',en:'stylized 3D animation, soft global illumination, bright rim light, vibrant colors',mood:'playful, warm',man:{amb:'day',hard:false,rim:2,fill:.5,sat:.4,kelvin:4800},fx:S=>{S.post.bloom=.3}},
  dreamy:{n:'Onírico',en:'dreamy ethereal look, soft glow, hazy backlight, floating dust',mood:'dreamlike',env:'dust particles floating in the light',man:{amb:'golden',hard:false,ev:.5,con:-.4,sat:-.2,fog:.02},fx:(S,t)=>{S.post.bloom=.7;S.hud=dustHud(t)}},
  musicvideo:{n:'Videoclip',en:'music video aesthetic, colored stage lights changing on the beat, strobe flashes, haze',mood:'energetic',amb:'the song playing loud',man:{amb:'studio',lights:true,action:'dance',fog:.03,rim:2},
    fx:(S,t)=>{const b=Math.floor(t/.5),ph=(t%.5)/.5,cols=['#ff2e88','#18d5e6','#ffd23f','#7a4dff'];S.look.sunC=cols[b%4];S.look.fill=Math.max(S.look.fill,.8);S.look.fillC=cols[(b+2)%4];
      if(b%4===0&&ph<.18){const a=.5*(1-ph/.18);S.hud=(c,w,h)=>{c.fillStyle='rgba(255,255,255,'+a.toFixed(2)+')';c.fillRect(0,0,w,h)}}}},
  wes:{n:'Al estilo Wes Anderson',en:'in the style of Wes Anderson: centered symmetrical composition, flat frontal framing, pastel palette, deadpan',mood:'whimsical, deadpan',man:{amb:'day',orbit:0,shift:0,roll:0,height:1.45,aim:1.3,mm:40,sat:.35,hard:false,move:'none'},
    fx:S=>{Object.assign(S.look,{skyTop:'#f4b9c4',skyBot:'#fde3b4',fog:'#f7d4bd',ground:'#e5b19f',foliage:'#d98f8f'});S.hud=symHud}},
  kubrick:{n:'Al estilo Kubrick',en:'in the style of Stanley Kubrick: one-point perspective, perfect symmetry, slow steady push-in, wide-angle lens',mood:'cold, unsettling',place:'on a straight path between two perfectly aligned rows of trees',
    man:{amb:'day',orbit:0,shift:0,roll:0,mm:18,move:'dolly',height:1.5,aim:1.45,sat:-.2,dist:9},fx:S=>{S.props.avenue=true;S.props.set=false;S.hud=vpHud}},
  tarantino:{n:'Al estilo Tarantino',en:'in the style of Quentin Tarantino: extreme low angle from the ground, saturated 1970s colors, film grain',mood:'tense, darkly funny',man:{amb:'day',height:.15,aim:1.7,dist:1.4,mm:20,sat:.35,con:.25,grain:.3,second:true}}
};

/* demos que acompañan a la guía */
let reelCache=null;
add({id:'stylereel',cat:'estilo',es:'Muestrario de estilos',en:'the same scene as film noir, western, cyberpunk, retro, cel-shaded anime and Wes Anderson',dur:15,cuts:true,
  what:'Seis estilos seguidos para comparar cómo cambia todo: luz, color, textura y cámara.',
  look:'Cada dos segundos y medio cambia el estilo. No cambia solo el color: cada uno trae su propia luz y su propio movimiento de cámara.',
  alias:'estilos muestrario',
  fn(t,S,S2){if(!reelCache)reelCache=['noir','western','cyberpunk','retro','cel','wes'].map(id=>D.find(x=>x.id===id));const i=Math.floor(t/2.5)%6,d=reelCache[i];d.fn(d.dur*.3+(t%2.5),S,S2);S.cap=d.es;S.badge=(i+1)+' / 6';S.badgeKind=''}});
add({id:'audiolayers',cat:'edicion',es:'Capas de sonido',en:'music, dialogue, sound effects and final mix',dur:10,
  what:'El audio de un video se arma en capas: música, voz, efectos y la mezcla que las equilibra.',
  look:'Las pistas se suman una por una. En la mezcla final la música baja cuando hay voz, para que se entienda.',
  alias:'audio mezcla sonido capas',
  fn(t,S){conv(S);S.A.talk=t>=2.5&&t<7.5?1:0;setCam(S,SH.wide);const n=t<2.5?1:t<5?2:t<7.5?3:4;S.cap=[_t('Música'),_t('+ voz'),'+ efectos',_t('Mezcla final')][n-1];
    S.hud=(c,w,h)=>{const x0=w*.04,x1=w*.96,y0=h*.55,rh=h*.09,bx=x0+w*.13,N=56,bw=(x1-bx)/N,f=Math.floor(t*14);c.fillStyle='rgba(8,9,12,.74)';c.fillRect(x0-8,y0-10,x1-x0+16,rh*4+14);
      const names=[_t('Música'),_t('Voz'),_t('Efectos'),_t('Mezcla')],cols=['#8c9bff','#ffd24a','#5fd398','#ff5a4f'];
      for(let r=0;r<4;r++){const on=r<n,y=y0+r*rh+rh/2;c.globalAlpha=on?1:.22;label(c,w,names[r],x0,y-fpx(w,.02)/2,'left',.02);c.fillStyle=cols[r];
        for(let i=0;i<N;i++){const k=i+f,talk=Math.sin(k*.22)>-.1,mus=.3+.45*hsh(k*1.3),voc=talk?.25+.65*hsh(k+50):.04,sfx=k%13===0?.95:k%13===1?.5:.03;
          let a=r===0?mus:r===1?voc:r===2?sfx:Math.min(1,mus*(talk?.45:1)+voc*.9+sfx*.8);if(r===3&&n<4)a=.05;const hh=Math.max(1,a*rh*.42);c.fillRect(bx+i*bw,y-hh,bw*.62,hh*2)}}
      c.globalAlpha=1}}});
add({id:'textlogo',cat:'ia',es:'Texto y logos',en:'leave the sign blank, add the text in editing',dur:8,
  what:'La IA deforma letras y logos y los cambia entre cuadros. El texto que tiene que leerse se agrega en la edición.',
  look:'Primero el letrero como lo dejaría la IA: letras que tiemblan y cambian. Después el mismo letrero puesto en la edición: quieto y legible.',
  alias:'texto letrero logo tipografía',
  fn(t,S){S.A.x=-5.4;S.A.z=-5.9;S.A.ry=.5;setCam(S,{p:[-3.4+.3*Math.sin(t*.4),1.8,-1.4],t:[-6.7,1.9,-7],fov:40});const ai=t<4;S.badge=ai?_t('Generado por la IA'):_t('Agregado en la edición');S.badgeKind=ai?'bad':'ok';
    S.hud=(c,w,h)=>{const P=project(new V3(-6.8,2.62,-6.95),cam,w,h);if(P[2]>1)return;const sw=w*.21,sh=w*.06,x=P[0]-sw/2,y=P[1]-sh/2;c.fillStyle='#f4ead2';c.fillRect(x,y,sw,sh);c.strokeStyle='#3a2a1e';c.lineWidth=Math.max(2,w/300);c.strokeRect(x,y,sw,sh);
      const txt=_t('CAFÉ LUNA'),f=Math.floor(t*8);c.font='700 '+(sh*.6)+'px "Barlow Condensed","Arial Narrow",sans-serif';c.textBaseline='middle';c.fillStyle='#3a2a1e';
      if(ai){const gl=_t('CAFELUNAÉOQ8RBG');c.textAlign='left';const wd=c.measureText(txt).width;let cx=P[0]-wd/2;for(let i=0;i<txt.length;i++){let ch=txt[i];const cw=c.measureText(ch).width;if(ch!==' '&&hsh(i*7+f)<.35)ch=gl[Math.floor(hsh(i+f*3)*gl.length)];
        c.save();c.translate(cx,P[1]+(hsh(i+f)-.5)*sh*.14);c.rotate((hsh(i*3+f)-.5)*.4);c.scale(1+(hsh(i+f*5)-.5)*.35,1);c.fillText(ch,0,0);c.restore();cx+=cw}}
      else{c.textAlign='center';c.fillText(txt,P[0],P[1])}}}});
add({id:'pipeline',cat:'ia',es:'Flujo de producción',en:'idea, script, style guide, storyboard, audio, images, video, upscale, edit',dur:13.5,
  what:'Las etapas de un video con IA de principio a fin. Lo que se decide en cada una se arrastra a todas las siguientes.',
  look:'Abajo se marca la etapa. El mismo plano pasa de idea en texto a boceto, a imagen quieta, a video y a montaje.',
  alias:'workflow flujo etapas producción',
  fn(t,S){const st=[_t('Idea'),_t('Guion'),_t('Guía de estilo'),_t('Storyboard'),_t('Audio'),_t('Imágenes'),'Video',_t('Reescalado'),_t('Edición')],i=Math.min(8,Math.floor(t/1.5)),l=t-i*1.5;
    S.look=mk(Object.assign({},LOOKS.blue,{lamp:2}));S.A.x=LAMP[0]+.8;S.A.z=LAMP[1]+.3;S.A.ry=-.6;S.A.headYaw=0;setCam(S,{p:[1.2,1.5,1.6],t:[3.4,1.35,-2.8],fov:40});
    if(i>=6){S.A.wave=pp(i===6?l:l+.75,1.5,.2);S.A.headYaw=.15*Math.sin(t*1.3)}else S.tt=0;
    const css={filter:''};if(i===2)css.filter='saturate(.35)';if(i===3)css.filter='grayscale(1) url(#poster) contrast(1.4)';if(i===4)css.filter='saturate(.6) brightness(.75)';if(i===7)css.filter='blur('+(4*(1-ss(l/1.2))).toFixed(1)+'px)';S.post.css=css;
    S.cap=(i+1)+'. '+st[i];
    S.hud=(c,w,h)=>{const mono=fs=>{c.font='500 '+fs+'px "IBM Plex Mono",monospace';c.textBaseline='top';c.textAlign='center';c.fillStyle='#e8ebf0'};
      if(i<=1){c.fillStyle='rgba(12,13,17,.93)';c.fillRect(0,0,w,h);const fs=fpx(w,.026);mono(fs);const L=i===0?[_t('Alguien espera bajo un farol'),_t('y la luz se enciende.')]:[_t('EXT. PARQUE – ANOCHECER'),_t('Una persona espera junto al farol.'),_t('La luz se enciende. Saluda.')];L.forEach((x,j)=>c.fillText(x,w/2,h*.36+j*fs*1.6))}
      if(i===2)swatches(['#1b2440','#56648f','#ffd9a0','#b4482f','#e9e3d0'])(c,w,h);
      if(i===4){const y=h*.62,N=70,bw=w*.8/N;c.fillStyle='#ffd24a';for(let k=0;k<N;k++){const a=.15+.8*hsh(k+Math.floor(t*14));c.fillRect(w*.1+k*bw,y-a*h*.08,bw*.6,a*h*.16)}}
      if(i===5){const lw=Math.max(3,w/240);c.strokeStyle='rgba(255,210,74,.95)';c.lineWidth=lw;c.strokeRect(lw/2,lw/2,w-lw,h-lw)}
      if(i===7)label(c,w,l<1.2?'720p':'4K',w*.97,h*.06,'right',.03);
      if(i===8)strip([.5,1.0],1.5,l)(c,w,h);
      const x0=w*.04,bw=(w*.92)/9,y=h*.9;for(let k=0;k<9;k++){c.fillStyle=k===i?'#ff5a4f':k<i?'rgba(255,255,255,.55)':'rgba(255,255,255,.2)';c.fillRect(x0+k*bw+2,y,bw-4,Math.max(4,h*.012))}}}});
['western','musicvideo','stylereel','multishot','consistency','elements','t2v','v2v','motiontransfer','tarantino','beatcut'].forEach(id=>{const d=D.find(x=>x.id===id);if(d)d.cuts=true});

/* ---------- guía para la IA: cada tema con su animación ---------- */
const SRCNOTE='Resumen propio de las páginas públicas de AI Video School y de la guía oficial de Motion Control de Kling, leídas el 15 de octubre de 2026.';
const GUIDE=[
 {g:'Qué se puede hacer',id:'texto',t:'Texto a video',demo:'t2v',lead:'Escribís el plano y la IA genera el clip completo, sin imagen previa. Es el método más rápido.',
  lists:[{h:'Sirve para',items:['Establishing shots y planos de ambiente','B-roll, transiciones e inserts','Probar una idea antes de invertir en imágenes','Clips cortos para redes']}],
  lim:'El personaje sale distinto en cada generación. Funciona mejor cuando no se le ve la cara o no tiene que repetirse.',tpl:[{h:'El prompt de la animación',code:T2V}],go:['take','establishing','cutaway']},
 {id:'imagen',t:'Imagen a video',demo:'i2v',lead:'Primero hacés la imagen y después la IA la anima. La imagen fija el personaje, la ropa y el lugar; por eso es el método más usado para historias.',
  lists:[{h:'Sirve para',items:['El mismo personaje de principio a fin','Animar cada cuadro del storyboard','Movimientos exactos entre un frame inicial y uno final','Juntar personaje, set y objeto en un plano']}],
  lim:'Pide más preparación: cada plano necesita su imagen antes del video.',tpl:[{h:'Plantilla',code:'Use the image as the first frame. [movimiento del sujeto], [movimiento de cámara]. Keep the character, clothing and background unchanged.'}],go:['charsheet','startend']},
 {id:'video',t:'Video a video',demo:'v2v',lead:'Subís un video y la IA le cambia el estilo, el lugar o el vestuario. El movimiento y el encuadre se conservan.',
  lists:[{h:'Sirve para',items:['Pasar un video del celular a animación 3D o anime','Cambiar vestuario, hora del día o clima','Reestilizar un clip ya generado']}],
  lim:'Necesitás el video de origen, y el resultado no se aleja mucho de su encuadre.',
  tpl:[{h:'Cambiar el estilo',code:'Restyle this video as [estilo]. Keep the original motion, timing and framing.'},{h:'Cambiar un detalle',code:'Change [qué] to [cómo]. Keep everything else unchanged.'}],go:['motiontransfer','lut']},
 {id:'movimiento',t:'Transferencia de movimiento',demo:'motiontransfer',lead:'Le das a la IA una imagen del personaje y un video de alguien haciendo el movimiento. El personaje copia el baile o la pelea con su propio aspecto. En Kling se llama Motion Control.',
  lists:[{h:'Cómo grabar la referencia',items:['Un solo personaje en el video','Cuerpo entero y bien visible','Cámara quieta, sin cortes ni cambios de plano','Proporciones parecidas entre la imagen y la persona del video','Sin movimientos demasiado rápidos ni objetos que tapen el cuerpo']}],
  tpl:[{h:'El prompt describe solo el mundo',code:'[lugar], [luz], [estilo]. The character follows the motion of the reference video.'}],note:'Las recomendaciones de la referencia salen de la guía oficial de Motion Control de Kling.',go:['beatcut','musicvideo']},
 {id:'referencias',t:'Referencias combinadas',demo:'elements',lead:'Subís referencias separadas del personaje, del lugar y de un objeto, y la IA las junta en un plano sin cambiarlas. Kling las llama elementos.',
  lists:[{h:'Para que funcione',items:['Cada referencia sola, sobre fondo neutro o sin personas','El mismo nombre para cada referencia en todos los prompts','Una acción simple que conecte a los tres']}],
  tpl:[{h:'Plantilla',code:'Using the character, location and object references: [acción]. [plano y movimiento], [luz].'}],go:['charsheet','consistency']},
 {id:'frames',t:'Frame inicial y final',demo:'startend',lead:'Das la primera y la última imagen del plano y la IA inventa el movimiento del medio. Es la forma más precisa de controlar un movimiento de cámara.',
  lists:[{h:'Para que funcione',items:['Los dos frames con la misma referencia de personaje y la misma luz','Un movimiento posible entre ambos, sin saltar al otro lado del eje','Si el movimiento es largo, partilo en dos planos']}],
  tpl:[{h:'Plantilla',code:'Start frame: [plano inicial]. End frame: [plano final]. [movimiento de cámara] between them.'}],note:'Kling anunció el 30 de septiembre de 2026 que su versión 4.0 acepta hasta 10 keyframes por clip.',go:['dolly','axis']},

 {g:'Fórmulas por herramienta',id:'kling',t:'Kling',demo:'golden',lead:'Kling responde mejor a una fórmula fija, una frase por bloque. Pensá cada prompt como un clip corto: una escena, una acción, un ánimo.',
  anat:[['Sujeto','A person in a red shirt'],['Movimiento','stands still, glancing around,'],['Escena','in a park with pine trees and a small house.'],['Cámara','Wide shot, slow dolly in, 35mm lens.'],['Luz','Golden hour, low warm side light, long shadows.'],['Atmósfera','Calm, nostalgic atmosphere.']],
  lists:[{h:'Lo que más pesa',items:['Si sale genérico, describí más la ropa, el entorno y el ánimo','El modo Professional da mejor calidad que el Standard','Palabras de atmósfera: cinematic, emotional, peaceful, epic, nostalgic, mysterious, melancholic, suspenseful. Una o dos, no diez']}],
  err:'Varias acciones en un mismo clip, o no decir cámara ni luz.',man:'kling',go:['dolly','golden']},
 {id:'veo',t:'Veo en Flow',demo:'ots',lead:'Veo pide pensar como director, director de fotografía y sonidista a la vez. El audio va en el mismo prompt.',
  anat:[['Cinematografía','Over-the-shoulder shot, eye level:'],['Sujeto','a person in a red shirt'],['Acción','talks and gestures to a friend in a teal shirt'],['Contexto','in a park during the day.'],['Estilo y ambiente','Natural daylight, cinematic realism.'],['Audio','The person in red says calmly: "We leave at dawn." Ambient: birds, light breeze.']],
  lists:[{h:'Lo que más pesa',items:['Diálogo entre comillas y cómo se dice: calmado, enojado, con acento','Efectos como SFX y ambiente por separado','Describí lo que querés, no lo que no querés','Si el prompt queda corto, pedile a Gemini o a Claude que lo expanda con detalle de cine']}],
  err:'Pedir “que sea dramático” sin decir con qué plano ni qué luz.',note:'Según la fuente, escribir el diálogo dentro del prompt de Veo da mejor sincronía de labios que las herramientas de lip sync aparte.',man:'veo',go:['ots','jlcut']},
 {id:'runway',t:'Runway',demo:'motion3',lead:'Runway lee el prompt como movimiento, no como descripción. Separá lo que mueve el personaje, lo que mueve la cámara y lo que se mueve en el entorno.',
  anat:[['Sujeto','The person walks forward.'],['Cámara','Slow push-in.'],['Entorno','Leaves falling, dust floating in the light.'],['Estilo','Cinematic live action, golden hour.']],
  lists:[{h:'Lo que más pesa',items:['Arrancá con el movimiento clave y sumá un detalle por vuelta','No reescribas todo en cada intento: Runway está pensado para iterar','Si partís de una imagen, no describas de nuevo cómo se ve']}],
  err:'Describir cómo se ve y no cómo se mueve.',man:'runway',go:['motion3','tracking']},
 {id:'seedance',t:'Seedance',demo:'multishot',lead:'Seedance genera varios planos seguidos. La regla de oro: duración, cantidad de planos y formato van primero.',
  anat:[['Encabezado','9s, 3 shots, 16:9.'],['Estilo','Cinematic, blue hour, soft haze.'],['Escena','A person in a red shirt in a park at dusk.'],['Plano por plano','Shot 1: wide establishing shot. Shot 2: medium tracking shot as the person walks to the lamp. Shot 3: close-up of the face.'],['Progresión','The street lamp turns on at the end.']],
  lists:[{h:'Lo que más pesa',items:['Describí cada plano por separado, con cámara y movimiento','Inicio, conflicto y cierre en una secuencia corta','Para realismo puro sumá “No 3D, no cartoon”']}],
  err:'Olvidar la duración o los planos, o meter la historia entera en un prompt.',man:'seedance',go:['coverage','establishing']},
 {id:'midjourney',t:'Midjourney Video',demo:'i2v',lead:'Midjourney Video anima una imagen. La imagen ya trae personaje, ropa, luz y lugar, así que el prompt solo describe movimiento.',
  anat:[['Sujeto','The person turns toward the camera and waves,'],['Cámara','slow push-in'],['Parámetro','--motion low']],
  lists:[{h:'Lo que más pesa',items:['Empezá con --motion low y subí a high solo para acción','--loop hace un loop sin corte y --raw le da más peso al texto','Los clips se pueden extender hasta 21 segundos']}],
  err:'Párrafos largos o high motion para todo.',man:'mjv',go:['i2v']},
 {id:'suno',t:'Suno',demo:'beatcut',lead:'Suno se escribe como un brief para un productor: el sonido, no la historia.',
  anat:[['Género','Dark synthwave,'],['Ánimo','tense and driving,'],['Instrumentos','analog synths, punchy drums, deep bass,'],['Voces','instrumental,'],['Uso','for a 60-second music video.']],
  lists:[{h:'Lo que más pesa',items:['En modo Custom, el estilo va en una línea y la letra en su propio campo','Estructura con etiquetas [Verse], [Chorus], [Bridge], [Outro]','Escribí “Instrumental” o “No vocals” si no lleva voz','Generá varias versiones y ajustá el estilo']}],
  err:'Dar solo el género y olvidar para qué es.',go:['beatcut','musicvideo']},
 {id:'comparativa',t:'Todas de un vistazo',demo:'take',lead:'Todas entienden el mismo vocabulario del glosario; cambia el orden. Y todas varían: el mismo prompt da tomas distintas, por eso se generan varias y se elige.',
  tbl:{head:['Herramienta','Orden del prompt'],rows:[['Kling','Sujeto · movimiento · escena · cámara · luz · atmósfera'],['Veo en Flow','Cinematografía · sujeto · acción · contexto · estilo y ambiente · audio'],['Runway','Sujeto · cámara · entorno · estilo, todo como movimiento'],['Seedance','Duración, planos y formato · estilo · escena · plano por plano'],['Midjourney Video','Movimiento del sujeto · cámara · --motion'],['Grok y Meta AI','Sujeto · acción · lugar · cámara · estilo, en lenguaje natural'],['Suno','Género · ánimo · instrumentos · voces · uso']]},
  man:'generic',go:['take']},

 {g:'Imágenes y frames',id:'imagen-prompt',t:'Prompt de imagen',demo:'wide',lead:'Las herramientas de imagen describen lo que se ve. Nada de instrucciones como si fuera un chat.',
  anat:[['Sujeto','A person in a red shirt standing'],['Entorno','in a park with pine trees and a small house,'],['Luz','soft daylight,'],['Estilo','cinematic film still,'],['Composición','wide shot, full body, 35mm'],['Formato','--ar 16:9']],
  tbl:{head:['Herramienta','Cómo escribirle'],rows:[['Midjourney','Palabras visuales: sujeto, entorno, luz, estilo, ánimo, color y composición, más --ar.'],['Nano Banana','Oraciones claras en orden: sujeto, entorno, acción, estilo, luz y composición, más el uso: frame de storyboard, still de cine o miniatura.'],['Kling imagen','Sujeto + entorno + acción + estilo + luz + composición + detalles.']]},
  err:'Escribirle como a un chat o mezclar varias ideas en una imagen.',man:'img',go:['wide','full']},
 {id:'editar',t:'Editar una imagen',demo:'v2v',t0:5.2,lead:'Para corregir una imagen sin rehacerla, decí qué se queda igual, qué cambia y cómo queda.',
  tpl:[{h:'Plantilla',code:"Keep everything else unchanged. Change [qué] to [cómo]. Keep the subject's position and pose."},{h:'Para mantener una cara',code:'Keep the facial features. [pelo], [ropa], [acción], [fondo], [luz], [ánimo].'}],
  err:'Editar sin decir qué no se toca: la IA cambia también lo que estaba bien.',go:['v2v']},
 {id:'storyboard',t:'Frame de storyboard',demo:'coverage',lead:'Con imagen a video, el storyboard ya es material final: cada cuadro es el frame inicial de un plano.',
  tpl:[{h:'Plantilla',code:'Using the uploaded character reference, [plano y ángulo], [sujeto y acción], [entorno], [luz y atmósfera], [estilo y calidad], 16:9'}],
  lists:[{h:'Pasos',ol:true,items:['Pedile a un LLM un prompt de imagen por cada plano de la lista','Generá un cuadro por plano con la misma referencia de personaje','Para los planos con movimiento, generá frame inicial y final','Revisá la secuencia completa buscando planos que falten']}],go:['coverage','startend']},

 {g:'Consistencia',id:'ficha',t:'Ficha de personaje',demo:'charsheet',lead:'Antes de generar escenas, definí cada personaje en una hoja de referencia. Es lo que vas a subir en cada plano.',
  tpl:[{h:'Plantilla',code:'[nombre], [edad], [rol]. [cara y piel], [pelo]. Wearing [prenda base], [abrigo], [accesorios]. [estética]. Character reference sheet: front, three-quarter, profile and back views, full body, neutral white background, 16:9.'}],
  lists:[{h:'Guardá tres referencias',items:['La hoja de personaje','Un primer plano de la cara','La lista de rasgos que lo definen']}],go:['charsheet']},
 {id:'candado',t:'Candado de consistencia',demo:'consistency',lead:'Un bloque de texto que se repite igual en cada prompt del mismo personaje. Si cambia una palabra, puede cambiar la ropa.',
  tpl:[{h:'Copialo tal cual',code:'Keep the same face, hairstyle, clothing, age, proportions and accessories in every scene and camera angle. Do not change the clothing, hair color, facial structure or accessories.'}],
  lim:'Con texto a video no alcanza: para consistencia real usá imagen a video con la ficha.',go:['raccord','consistency']},
 {id:'deriva',t:'Deriva y morphing',demo:'drift',lead:'El personaje cambia dentro del mismo clip. Los errores chicos se acumulan, así que pasa más en clips largos.',
  lists:[{h:'Cómo evitarlo',items:['Clips cortos; la duración se arma en la edición','Imagen a video con referencia en vez de texto a video','La misma descripción del personaje en cada prompt']}],go:['drift']},
 {id:'sets',t:'Sets y lugares',demo:'establishing',lead:'Los lugares también necesitan referencia. Generalos vacíos y en sus variantes antes de poner personajes.',
  tpl:[{h:'Exterior',code:'[lugar] with [estado y vegetación], [suelo y reflejos], [luz y paleta], [clima], [estilo], highly detailed, no people, 16:9'},{h:'Interior',code:'[distribución y tamaño], [materiales], [polvo o desorden], [fuentes de luz y su color], [aire y partículas], [ánimo], [estilo], movie still, no people, 16:9'}],
  lists:[{h:'Variantes del mismo lugar',items:['De día y de noche','Intacto y dañado','Vacío y con gente']}],go:['establishing','depth']},
 {id:'direccion',t:'Dirección de pantalla',demo:'screendir',lead:'Cada generación decide sola hacia dónde camina el personaje. Si no lo decís, entre un plano y otro parece que se devuelve.',
  tpl:[{h:'Escribilo en cada plano',code:'The person walks from left to right across the frame.'}],go:['screendir','axis']},

 {g:'Guía de estilo',id:'moodboard',t:'Guía de estilo y moodboard',demo:'palette',lead:'Es el documento que todas las imágenes y videos del proyecto van a respetar. Se arma antes de generar nada.',
  lists:[{h:'En este orden',ol:true,items:['Dirección visual: género, tono y referencias','Moodboard: paleta, texturas, tipografía y fotogramas de referencia','Sets: lugares principales y sus variantes','Personajes: apariencia, ropa y varios ángulos','Lista de planos con cámara, movimiento y emoción','Todo en un documento, con un bloque de estilo para copiar en cada prompt']}],go:['palette','grading','lut']},
 {id:'estilos',t:'Cómo pedir un estilo',demo:'stylereel',lead:'Nombrar el estilo ayuda, pero lo que más controla el resultado son los rasgos visibles: luz, color, textura y cámara.',
  anat:[['Estilo','Film noir,'],['Luz','hard side light, venetian blind shadows,'],['Color','black and white, high contrast,'],['Textura','smoky haze, film grain,'],['Cámara','slow push-in']],
  lists:[{h:'Para que se repita en todo el proyecto',items:['Escribí el bloque de estilo una vez y pegalo igual en cada prompt','Sumá dos o tres películas de referencia a la guía de estilo','Con directores, describí sus rasgos además del nombre: simetría, paleta, tipo de movimiento']}],
  man:'kling',go:['noir','wes','stylized3d','cel']},

 {g:'Del guion al plano',id:'guion',t:'Guion o estructura',demo:'blocking',lead:'El guion va escena por escena con acción, diálogo, cámara y sonido. La estructura solo marca los bloques. Un corto o un videoclip con historia pide guion.',
  lists:[{h:'Tres actos',ol:true,items:['Planteamiento: gancho y contexto','Confrontación: el problema crece','Resolución']},{h:'Cada escena empieza con',items:['Lugar y hora: EXT. PARQUE – ANOCHECER','Acción, sonido y cámara','Una línea de ánimo, estilo y duración']}],go:['blocking','oner']},
 {id:'planos',t:'Lista de planos',demo:'coverage',lead:'Cada escena partida en planos numerados. Es la lista que después se convierte en prompts.',
  tbl:{head:['Campo','Ejemplo'],rows:[['Número y nombre','3. Primer plano, reacción'],['Qué se ve','Sujeto, acción y entorno'],['Cámara','Plano, ángulo y movimiento'],['Sonido','Pasos, respiración, música o silencio'],['Emoción','Tenso, aliviado, sorprendido']]},go:['coverage','insert','closeup']},
 {id:'reaccion',t:'Reacciones e inserts',demo:'kuleshov',lead:'Al revisar un storyboard casi siempre faltan los mismos planos: reacciones e inserts. Son baratos de generar y arreglan la edición.',
  lists:[{h:'Por qué funcionan',items:['El público le da significado a una cara según el plano de al lado','Tapan saltos de continuidad entre dos planos generados','Marcan el ritmo sin depender del diálogo']}],go:['reaction','insert','cutaway']},

 {g:'Sonido',id:'capas',t:'Capas de audio',demo:'audiolayers',lead:'La mitad de la sensación de calidad es el audio. Se arma en capas y se mezcla al final.',
  lists:[{h:'En este orden',ol:true,items:['Música','Voz o diálogo','Efectos','Mezcla final']},{h:'Herramientas',items:['Música: Suno','Voz: ElevenLabs, con texto a voz, cambiador de voz (actuás vos y cambia el timbre), voces de biblioteca o una voz propia','Si la imagen tiene que seguir la música, como en un videoclip, generá el audio primero']}],go:['jlcut','beatcut']},
 {id:'vocab-sonido',t:'Vocabulario de sonido',demo:'jlcut',lead:'Los mismos términos sirven para pedirle sonido a Veo o para ordenar la mezcla.',
  tbl:{head:['Término','Qué es','Cómo pedirlo'],rows:[['Diegético','Existe dentro de la escena: pasos, voces, la radio del cuarto.','SFX: footsteps on wet pavement'],['No diegético','Solo lo oye el público: música de fondo, narración.','Música en Suno, narración en ElevenLabs'],['Foley','Sonidos de acción recreados: ropa, golpes, pasos.','Un efecto por pedido, sincronizado en la edición'],['Ambiente','El fondo constante de un lugar.','Ambient: distant traffic, light wind'],['Puente sonoro','El sonido del plano siguiente entra antes del corte.','En la edición, con J-cut y L-cut']]},go:['jlcut']},
 {id:'ritmo',t:'Cortar al ritmo',demo:'beatcut',lead:'En un videoclip los cortes caen en los tiempos de la música. Un corte un poco tarde se siente mal aunque no se sepa por qué.',
  lists:[{h:'Cómo hacerlo',items:['Marcá los tiempos en la línea de tiempo antes de cortar','Cortes en los tiempos fuertes; golpes y destellos en el primero del compás','Generá clips un poco más largos que el hueco para tener margen']}],go:['beatcut','musicvideo','asl']},

 {g:'Lo que todavía falla',id:'fallas',t:'Problemas y cómo esquivarlos',demo:'consistency',lead:'Todas las herramientas fallan en lo mismo. La salida casi nunca es un mejor prompt sino otro método o la edición.',
  tbl:{head:['Problema','Qué se ve','Qué hacer'],rows:[['Consistencia','Cambian la cara, la ropa o el fondo de un plano a otro.','Imagen a video con referencias del personaje y del set.'],['Deriva o morphing','Algo se transforma dentro del mismo clip.','Clips cortos; la duración se arma en la edición.'],['Artefactos','Dedos de más, objetos que flotan, parpadeos.','Generá varias versiones y elegí.'],['Lip sync','La boca no calza, sobre todo en primer plano.','Diálogo como texto en Veo, voz unificada con ElevenLabs o narración en off.'],['Contacto entre personas','Abrazos, peleas y bailes en pareja se deforman.','Según la fuente, Seedance y Omni manejan bien las peleas. Compará herramientas.'],['Física','Gravedad, agua, pelo y ropa que se mueven raro.','Revisá esos detalles antes de aprobar un clip.'],['Calidad variable','El mismo prompt da un clip bueno y varios malos.','Iterar, usar referencias y probar otra herramienta.']]},go:['drift','take']},
 {id:'texto-logos',t:'Texto y logos',demo:'textlogo',lead:'La IA deforma letras y logos, y los cambia de un cuadro a otro.',
  lists:[{h:'Qué hacer',items:['No pidas texto legible en la generación','Dejá libre la zona donde va el texto o el logo','Agregalo en la edición, con seguimiento de movimiento si la cámara se mueve']}]},

 {g:'Flujo completo',id:'flujo',t:'Del concepto al video',demo:'pipeline',lead:'No hace falta usar todo: un clip rápido es generar y editar. Un corto o un videoclip con personaje pasa por estas etapas.',
  lists:[{h:'Etapas',ol:true,items:['Idea','Guion o estructura','Guía de estilo: moodboard, sets y personajes','Storyboard','Audio: música, voz y efectos','Imágenes finales y frames','Video','Reescalado, si hace falta','Edición y color']}]}
];
(function(){let g='';GUIDE.forEach(e=>{if(e.g)g=e.g;else e.g=g})})();
