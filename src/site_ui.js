
/* ================= sitio web ================= */
const CAT_DESC={encuadre:'Cuánto del sujeto entra en el cuadro.',angulo:'Desde dónde mira la cámara.',composicion:'Dónde va cada cosa dentro del cuadro.',mov:'Cómo se mueve la cámara durante el plano.',
  lente:'Qué lente se usa y cómo entra la luz.',tiempo:'Cómo se estira, se congela o se acelera el tiempo.',luz:'De dónde viene la luz y qué tan dura es.',color:'Paleta, temperatura y tratamiento del color.',
  estilo:'Looks completos de género, época y director.',edicion:'Cómo se unen los planos y el sonido.',direccion:'Cómo se planea y se cubre una escena.',ia:'Cómo se genera video con IA y qué falla.'};
const CAT_THUMB={encuadre:'ots',angulo:'low',composicion:'symmetry',mov:'dollyzoom',lente:'bokeh',tiempo:'bullettime',luz:'neon',color:'complementary',estilo:'noir',edicion:'splitscreen',direccion:'coverage',ia:'motiontransfer'};
const CATN=Object.fromEntries(CATS),CATI=Object.fromEntries(CATS.map((c,i)=>[c[0],i]));
const byCat=c=>order.filter(d=>d.cat===c);
const pad2=n=>String(n).padStart(2,'0');
const norm=s=>String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');
const reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* datos de producción, herramientas y estilos */
const PCH=PROD_CH.map(c=>({id:c[0],num:c[1],n:c[2],d:c[3]})),PCHB=Object.fromEntries(PCH.map(c=>[c.id,c]));
const PBY=Object.fromEntries(PROD.map(p=>[p.id,p]));
const TBY=Object.fromEntries(TOOLS.map(t=>[t.id,t]));
const SBY=Object.fromEntries(STYLES.map(s=>[s.id,s])),SGN=Object.fromEntries(STYLE_GROUPS);
const KINDS=[['video','Video'],['imagen','Imagen'],['audio','Audio'],['post','Edición y acabado'],['plataforma','Plataformas'],['retirada','Retiradas']],KINDN=Object.fromEntries(KINDS);
const FK=Object.keys(FEATS);
const demoOf=id=>byId[id]||byId.t2v;
const shortVer=t=>t&&t.ver?String(t.ver).split('·')[0].trim():'';
const toolName=id=>id==='generic'?'Genérico':TBY[id]?TBY[id].n:id;
const toolLabel=id=>{const t=TBY[id];return t?t.n+(shortVer(t)?' '+shortVer(t):''):toolName(id)};
const store={get:k=>{try{return localStorage.getItem('pap.'+k)}catch(e){return null}},set:(k,v)=>{try{localStorage.setItem('pap.'+k,v)}catch(e){}}};
const kindOf=k=>TBY[k]?TBY[k].kind:'video';
const PREF={video:store.get('tool.video')||'kling',imagen:store.get('tool.imagen')||'',audio:store.get('tool.audio')||''};

/* el monitor es uno solo y se mueve entre el inicio, el reproductor y un soporte fuera de pantalla para sacar miniaturas */
const rig=$('#rig'),heroSlot=$('#hero-stage'),playerSlot=$('#player-stage');
let stageLive=true;
function mountStage(slot){if(stage.parentNode!==slot){slot.appendChild(stage);resize()}}

/* miniaturas: se renderiza cada demo con el mismo motor y se compone en un canvas chico */
const THUMBS=new Map(),tq=[];
function compositeTo(x,W,H){const f=W/cssW,sc=s=>(s&&s!=='none')?s.replace(/blur\(([\d.]+)px\)/g,(m,v)=>'blur('+(v*f).toFixed(2)+'px)'):'none';
  x.fillStyle='#0b0c10';x.fillRect(0,0,W,H);
  const lay=c=>{if(c.style.visibility==='hidden')return;x.save();x.filter=sc(c.style.filter);x.globalAlpha=c.style.opacity?+c.style.opacity:1;x.globalCompositeOperation=c.style.mixBlendMode==='screen'?'screen':'source-over';x.drawImage(c,0,0,W,H);x.restore()};
  lay(cBg);lay(cBk);lay(cMid);if(!cFg.style.maskImage||cFg.style.maskImage==='none')lay(cFg);
  [[gMul,'multiply'],[gScr,'screen']].forEach(([g,op])=>{if(g.style.display==='block'){x.save();x.globalCompositeOperation=op;x.fillStyle=g.style.background||g.style.backgroundColor;x.fillRect(0,0,W,H);x.restore()}});
  if(cHud.style.visibility!=='hidden')x.drawImage(cHud,0,0,W,H)}
function snapshot(key){let id=key,t=null;const at=key.indexOf('@');if(at>0){id=key.slice(0,at);t=parseFloat(key.slice(at+1))}
  const d=id==='manual'?MANUAL:byId[id];if(!d)return null;const pc=cur,pT=T;cur=d;T=t!=null?t:d.dur*.45;
  let url=null;try{render();const W=384,H=216,c=document.createElement('canvas');c.width=W;c.height=H;compositeTo(c.getContext('2d'),W,H);url=c.toDataURL('image/jpeg',.82)}catch(e){url=null}
  cur=pc;T=pT;return url}
function fillThumb(el,u){el.style.backgroundImage='url("'+u+'")';el.classList.add('ready')}
const photoIO='IntersectionObserver' in window?new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){fillThumb(en.target,'img/'+en.target.dataset.photo+'.webp');photoIO.unobserve(en.target)}}),{rootMargin:'300px'}):null;
function queuePhotos(root){root.querySelectorAll('[data-photo]:not(.ready)').forEach(el=>photoIO?photoIO.observe(el):fillThumb(el,'img/'+el.dataset.photo+'.webp'))}
function queueThumbs(root){queuePhotos(root);root.querySelectorAll('[data-thumb]').forEach(el=>{const u=THUMBS.get(el.dataset.thumb);if(u)fillThumb(el,u);else tq.push(el)})}
function pumpThumbs(){const t0=performance.now();while(tq.length&&performance.now()-t0<12){const el=tq.shift();if(!el.isConnected||el.classList.contains('ready'))continue;const k=el.dataset.thumb;let u=THUMBS.get(k);
  if(!u){u=snapshot(k);if(u)THUMBS.set(k,u)}if(u)document.querySelectorAll('[data-thumb]').forEach(e=>{if(e.dataset.thumb===k)fillThumb(e,u)})}}

/* carrete del inicio */
const REEL=['dolly','orbit','dollyzoom','golden','neon','fisheye','stylized3d','motiontransfer','cyberpunk','animemodern','kubrick','fight','bullettime','storyboard','t2v'].map(id=>byId[id]).filter(Boolean),RL=3.4;
const HOMEREEL={id:'homereel',cat:'ia',dur:RL*REEL.length,fn(t,S,S2){const i=Math.floor(t/RL)%REEL.length,d=REEL[i];d.fn(Math.min(d.dur-1e-3,d.dur*.25+(t%RL)),S,S2);S.cap=d.es;S.badge=''}};
const reelLink=d=>{const s=STYLES.find(x=>x.demo===d.id);if(CATN[d.cat])return ['#'+d.id,d.es,'glosario, capítulo '+pad2(CATI[d.cat]+1)];if(s)return ['#e-'+s.id,s.n,'estilos'];const p=PROD.find(x=>x.demo===d.id);if(p)return ['#p-'+p.id,p.t,'producción'];return null};
let nowIdx=-1;
function updateNow(){const i=Math.floor((((T%HOMEREEL.dur)+HOMEREEL.dur)%HOMEREEL.dur)/RL)%REEL.length;if(i===nowIdx)return;nowIdx=i;const L=reelLink(REEL[i]);
  $('#now').innerHTML=L?'Ahora en el monitor: <a href="'+L[0]+'" data-r="'+L[0].slice(1)+'">'+esc(L[1])+'</a> · '+esc(L[2]):''}

/* bucle: primero miniaturas pendientes, después el monitor visible */
function onRigReady(){if(!rigOn)return;refreshThumbs();if(stageLive)render()}
function loop(now){const dt=Math.min(.1,(now-last)/1000||0);last=now;const pumped=tq.length>0&&(rigReady||!rigOn||now>9000);if(pumped)pumpThumbs();
  if(stageLive&&(playing||pumped)){if(playing)T+=dt;render();if(view==='home')updateNow()}requestAnimationFrame(loop)}

/* ---------- vistas ---------- */
const V={home:$('#v-home'),start:$('#v-start'),gloss:$('#v-gloss'),cat:$('#v-cat'),prod:$('#v-prod'),tools:$('#v-tools'),styles:$('#v-styles'),gen:$('#v-gen'),player:$('#v-player')};
const SEC={home:'inicio',start:'empezar',gloss:'glosario',cat:'glosario',prod:'produccion',tools:'herramientas',styles:'estilos',gen:'generador'};
const PSEC={ex:'glosario',prod:'produccion',tool:'herramientas',feat:'herramientas',style:'estilos',man:'glosario'};
let view='home',curRoute='';
function show(v){for(const k in V)V[k].hidden=k!==v;view=v;document.body.dataset.mode=v==='player'&&mode==='man'?'manual':'';const sec=v==='player'?PSEC[mode]:SEC[v];
  document.querySelectorAll('.mainnav a').forEach(a=>{if(a.dataset.nav===sec)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')})}
function pageMode(v){mode='page';show(v);if(typeof setReal==='function')setReal(null);mountStage(rig);stageLive=false}
const crumbs=(parts)=>parts.map((p,i)=>i<parts.length-1?'<a href="#'+p[1]+'" data-r="'+p[1]+'">'+esc(p[0])+'</a><span aria-hidden="true">›</span>':'<span aria-current="page">'+esc(p[0])+'</span>').join('');
const card=(r,thumb,num,title,txt,meta)=>'<a class="card" href="#'+r+'" data-r="'+r+'"><span class="thumb" data-thumb="'+th(thumb)+'"></span><div class="body">'+(num?'<span class="num">'+esc(num)+'</span>':'')+'<h3>'+esc(title)+'</h3>'+(txt?'<p>'+esc(txt)+'</p>':'')+(meta?'<span class="meta">'+esc(meta)+'</span>':'')+'</div></a>';
const tile=d=>'<a class="card" href="#'+d.id+'" data-r="'+d.id+'"><span class="thumb" data-thumb="'+d.id+'"></span><div class="body"><h3>'+esc(d.es)+'</h3><code>'+esc(d.en)+'</code></div></a>';
const tileR=(r,thumb,title,sub,photo)=>'<a class="card" href="#'+r+'" data-r="'+r+'">'+(photo&&REALIMG.has(photo)?'<span class="thumb photo" data-photo="'+photo+'"></span>':'<span class="thumb" data-thumb="'+th(thumb)+'"></span>')+'<div class="body"><h3>'+esc(title)+'</h3>'+(sub?'<p>'+esc(sub)+'</p>':'')+'</div></a>';
const THUMB_AT={elements:8.4,imagegen:8.6,lipsync:6.5,extend:7,keyframes:4.5,idea:9.5,script:3.5,storyboard:1.2,regionedit:7,startend:5,i2v:6,t2v:7,multishot:7.5};
const th=id=>THUMB_AT[id]!=null&&String(id).indexOf('@')<0?id+'@'+THUMB_AT[id]:id;
const clip=(s,n)=>{s=String(s||'');return s.length>n?s.slice(0,n-1).replace(/\s+\S*$/,'')+'…':s};

/* ---------- piezas de texto para los temas ---------- */
const lbl=t=>'<span class="lbl">'+esc(t)+'</span>';
/* cada prompt en inglés trae su versión en español para entenderlo (pestañas); se copia la pestaña visible */
const ES=window.__ES||{};let PLANG=store.get('plang')==='es'?'es':'en';
const PTABS='<div class="ptabs" role="group" aria-label="Idioma del prompt"><button type="button" data-pl="en">Inglés · para pegar</button><button type="button" data-pl="es">Español · para entender</button></div>';
const bibox=(code,es,cls)=>es&&es!==code?'<div class="prompt long bi'+(cls?' '+cls:'')+'" data-pl="'+PLANG+'">'+PTABS+'<code class="en">'+esc(code)+'</code><code class="es">'+esc(es)+'</code>'+copyBtn+'</div>':'<div class="prompt long'+(cls?' '+cls:'')+'"><code class="en">'+esc(code)+'</code>'+copyBtn+'</div>';
const codeBlock=(h,code,es)=>'<div>'+(h?lbl(h):'')+bibox(code,es||ES[code])+'</div>';
document.addEventListener('click',e=>{const b=e.target.closest('.ptabs button[data-pl]');if(!b)return;PLANG=b.dataset.pl;store.set('plang',PLANG);document.querySelectorAll('.prompt.bi').forEach(x=>x.dataset.pl=PLANG)});
const anatHTML=a=>'<div>'+lbl('Anatomía del prompt')+'<div class="legend">'+a.map((x,i)=>'<span class="seg k'+(i%6+1)+'">'+esc(x[0])+'</span>').join('')+'</div><div class="prompt long"><code>'+a.map((x,i)=>'<span class="seg k'+(i%6+1)+'">'+esc(x[1])+'</span>').join(' ')+'</code>'+copyBtn+'</div></div>';
const listHTML=x=>{const tg=x.ol?'ol':'ul';return '<div>'+lbl(x.h)+'<'+tg+'>'+x.items.map(i=>'<li>'+esc(i)+'</li>').join('')+'</'+tg+'></div>'};
const tblHTML=(head,rows,cls)=>'<div class="tbl'+(cls?' '+cls:'')+(head.length<=2?' two':'')+'"><table><thead><tr>'+head.map(x=>'<th>'+esc(x)+'</th>').join('')+'</tr></thead><tbody>'+rows.map(r=>'<tr>'+r.map(x=>'<td>'+esc(x)+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>';
const srcHTML=src=>src&&src.length?'<p class="src">'+lbl('Fuentes')+src.filter(s=>s&&s[1]).map(s=>'<a href="'+esc(s[1])+'" target="_blank" rel="noopener">'+esc(s[0])+'</a>').join('<span aria-hidden="true"> · </span>')+'</p>':'';
const goRow=ids=>{const bt=(ids||[]).filter(id=>byId[id]&&CATN[byId[id].cat]).map(id=>'<a class="go" href="#'+id+'" data-r="'+id+'">'+esc(byId[id].es)+'</a>');return bt.length?'<div>'+lbl('Ver en el glosario')+'<div class="go-row">'+bt.join('')+'</div></div>':''};
const noteP=(h,t,cls)=>t?'<p'+(cls?' class="'+cls+'"':'')+'>'+(h?lbl(h):'')+esc(t)+'</p>':'';
/* bloques con selector de herramienta: recuerdan la última elegida */
const VARY=[];
function varyHTML(v){if(!v||!v.opts||!v.opts.length)return '';const i=VARY.push(v)-1,sel=v.opts.find(o=>PREF[kindOf(o.k)]===o.k)||v.opts[0];
  return '<div class="vary" data-v="'+i+'"><div class="vary-h">'+lbl(v.h||'Prompt según la herramienta')+'<select data-vary aria-label="Herramienta">'+v.opts.map(o=>'<option value="'+esc(o.k)+'"'+(o===sel?' selected':'')+'>'+esc(o.l)+'</option>').join('')+'</select></div>'+
    bibox(sel.code,sel.es||ES[sel.code])+(sel.how?'<p class="g-note vary-how">'+esc(sel.how)+'</p>':'<p class="g-note vary-how" hidden></p>')+'</div>'}
function setPref(k){const kd=kindOf(k);if(!k||PREF[kd]===k)return;PREF[kd]=k;store.set('tool.'+kd,k)}

/* ---------- imágenes de ejemplo: se muestran solo si existe el archivo en img/ ---------- */
const REALIMG=new Set([]);
const realEl=$('#realimg'),vseg=$('#vseg'),imgBtn=vseg.querySelector('[data-v="img"]');let realKey=null,realOn=store.get('view')==='img',styleImg=store.get('viewStyle')!=='anim';
/* en estilos la imagen es la vista principal; en el resto, la animación (cada sección recuerda su elección) */
const imgOn=()=>mode==='style'?styleImg:realOn;
function setReal(key,alt){realKey=key&&REALIMG.has(key)?key:null;imgBtn.hidden=!realKey;applyReal(alt)}
function applyReal(alt){const on=!!realKey&&imgOn();stage.classList.toggle('showimg',on);realEl.hidden=!on;if(on){realEl.src='img/'+realKey+'.webp';realEl.alt=alt||''}
  vseg.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',on?b.dataset.v==='img':b.dataset.v===(rigOn?'3d':'simple')))}
/* Simple (figuras hechas con código) o 3D (personajes de Mixamo); algunas demos traen su propia versión simple en fnS */
function refreshThumbs(){THUMBS.clear();document.querySelectorAll('[data-thumb].ready').forEach(e=>{e.classList.remove('ready');tq.push(e)})}
function setFigMode(on,quiet){rigOn=on;D.forEach(d=>{if(d.fnS){if(!d.fnR)d.fnR=d.fn;d.fn=on?d.fnR:d.fnS}});if(quiet)return;refreshThumbs();if(cur&&mode!=='page')fitWitness(cur);if(stageLive)render()}
setFigMode(store.get('fig')!=='simple',true);
vseg.addEventListener('click',e=>{const b=e.target.closest('button[data-v]');if(!b)return;const v=b.dataset.v,wantImg=v==='img';if(mode==='style'){styleImg=wantImg;store.set('viewStyle',wantImg?'img':'anim')}else{realOn=wantImg;store.set('view',wantImg?'img':'anim')}
  if(!wantImg&&(v==='3d')!==rigOn){store.set('fig',v);setFigMode(v==='3d')}applyReal(realEl.alt)});

/* ---------- guía para empezar ---------- */
const START=[
  {id:'funciona',t:'Entendé cómo funciona',s:'Clips cortos desde texto o imagen, plano por plano.',demo:'i2v',
    txt:'Las IA de video generan clips cortos, de unos segundos hasta 30, a partir de un texto o de una imagen. Una historia no se genera de una vez: se arma plano por plano. Lo más confiable es crear primero la imagen de cada plano y después animarla.',
    do:['Mirá la diferencia entre texto a video e imagen a video.','El mismo prompt da un resultado distinto cada vez: por eso se generan varias versiones y se elige la mejor.'],
    links:[['f-t2v','Texto a video'],['f-i2v','Imagen a video'],['take','Plano y toma']]},
  {id:'palabras',t:'Aprendé diez palabras de cine',s:'Con diez términos ya podés dirigir la cámara.',demo:'dolly',
    txt:'La IA entiende el vocabulario del cine. Con diez términos ya podés decir qué se ve y cómo se mueve la cámara, en vez de pedir «que se vea épico».',
    do:['Abrí cada término y mirá su animación.','Probalos en el laboratorio: movés la cámara y el prompt se escribe solo.'],
    links:[['wide','Plano general'],['medium','Plano medio'],['closeup','Primer plano'],['low','Contrapicado'],['high','Picado'],['dolly','Dolly in'],['pan','Paneo'],['tracking','Travelling'],['golden','Golden hour'],['handheld','Cámara en mano'],['laboratorio','Laboratorio de cámara']]},
  {id:'idea',t:'Escribí la idea en una frase',s:'Quién quiere qué y qué se lo impide.',demo:'idea',
    txt:'Antes de abrir cualquier herramienta, resumí la idea en una frase: quién quiere qué y qué se lo impide. Para el primer video pensá en 15 a 30 segundos, un lugar y uno o dos personajes: cuesta menos y falla menos.',
    do:['Escribí tres versiones de la idea y quedate con la más visual.','Si te trabás, usá los prompts de la etapa Idea para que un LLM te proponga opciones.'],
    links:[['pc-idea','Etapa 01: Idea'],['p-logline','Logline y premisa']]},
  {id:'planos',t:'Partila en planos',s:'Tres a cinco planos alcanzan para empezar.',demo:'coverage',
    txt:'Un video es una suma de planos. Para cada uno anotá qué tipo de plano es, qué hace el personaje, cómo se mueve la cámara y qué se oye. Tres a cinco planos alcanzan para un primer clip.',
    do:['Empezá con un plano general que muestre el lugar.','Después acercate: plano medio y primer plano.','Sumá una reacción o un detalle para que la edición respire.'],
    links:[['pc-guion','Etapa 03: Guion y planos'],['p-lista-planos','Lista de planos'],['pc-storyboard','Etapa 06: Storyboard']]},
  {id:'estilo',t:'Elegí un estilo',s:'Un bloque de texto que se repite en cada prompt.',demo:'stylereel',
    txt:'El estilo es el look: anime, años 80, cine negro, acuarela. Cada estilo de la biblioteca trae un bloque en inglés para pegar igual en todos los prompts, así todos los planos parecen del mismo video.',
    do:['Elegí un solo estilo para todo el video.','Copiá su bloque y no lo cambies entre planos.'],
    links:[['estilos','Biblioteca de estilos'],['pc-estilo','Etapa 04: Estilo y color']]},
  {id:'generador',t:'Armá los prompts en el generador',s:'La sintaxis correcta para cada herramienta.',demo:'storyboard',
    txt:'En el generador escribís la idea, describís al personaje y el lugar, y elegís el plano, el ángulo y el movimiento de cada toma. El prompt sale con la sintaxis de la herramienta que elijas. Si te trabás, cargá una plantilla y cambiala.',
    do:['Describí al personaje una sola vez, con ropa y colores: el generador lo repite en cada plano.','Los campos libres van en inglés; el diálogo puede ir en español.'],
    links:[['generador','Abrir el generador']]},
  {id:'generar',t:'Generá las imágenes y después el video',s:'Primero la imagen de cada plano, después la animás.',demo:'imagegen',
    txt:'Generá primero una imagen por plano y elegí la mejor. Esa imagen es el frame inicial: subila a la herramienta de video y usá imagen a video. Para aprender, quedate con una sola herramienta. Kling y Google Flow son de las más completas; Flow tiene un plan gratis a 720p, según la comparativa de precios de CostGoat.',
    do:['Generá cuatro variantes de cada imagen y elegí una.','Animá cada imagen con una sola acción y un solo movimiento de cámara.'],
    links:[['h-kling','Kling'],['h-flow','Google Flow'],['pc-imagen','Etapa 07: Imágenes'],['pc-video','Etapa 08: Video'],['herramientas','Comparar herramientas']]},
  {id:'sonido',t:'Sumá sonido y editá',s:'Música, voz y efectos aparte; se cortan al ritmo.',demo:'audiolayers',
    txt:'El sonido hace la mitad del resultado. Música, voz y efectos se generan aparte y se mezclan en la edición, donde también se cortan los planos al ritmo. Para empezar alcanza con CapCut; DaVinci Resolve es gratis y más completo. Si vas a publicar, revisá los derechos de la música: en Suno el uso comercial es solo para canciones descargadas en un plan pago.',
    do:['Si es un videoclip, hacé la música primero y cortá al ritmo.','Agregá textos y logos en la edición, no en la IA.'],
    links:[['pc-audio','Etapa 09: Audio'],['pc-edicion','Etapa 10: Edición'],['h-capcut','CapCut'],['h-resolve','DaVinci Resolve'],['h-suno','Suno']]},
  {id:'fallas',t:'Revisá lo que suele fallar',s:'Caras que cambian, manos raras, letras deformes.',demo:'consistency',
    txt:'Caras que cambian entre planos, manos raras, letras deformes: todas las herramientas fallan en lo mismo. Casi siempre la salida es otro método, no un prompt más largo.',
    do:['Si el personaje cambia, usá su ficha como referencia en cada plano.','Si un clip se deforma, hacelo más corto y armá la duración en la edición.'],
    links:[['p-problemas','Problemas y cómo esquivarlos'],['pc-consistencia','Etapa 05: Consistencia']]}];
const START_TIPS=['Probá cada plano en 5 segundos y a la resolución más baja antes de hacerlo largo.','Cada prompt tiene una pestaña en español para entender qué dice; en la herramienta se pega la pestaña en inglés.','En el generador describí tus personajes y lugares una sola vez (en español, si querés): cada plano repite la misma descripción y así no cambian.','Debajo de cada ejemplo podés cambiar la vista: Simple (figuras básicas, carga rápido), 3D (personajes con movimiento real) o Imagen, cuando el ejemplo la tenga.','Aprobá las imágenes antes de pagar el video: una imagen cuesta mucho menos que un clip.',
  'Una acción y un movimiento de cámara por clip. Si pedís tres cosas a la vez, alguna sale mal.','Escribí lo que querés ver, no lo que no querés: las negaciones suelen fallar.',
  'Repetí la misma descripción del personaje en todos los prompts y guardá los que funcionaron.','Dejá textos y logos para la edición: la IA deforma las letras.'];
const PATHS=[{t:'Un clip corto para redes',s:'15 a 30 s, sin personaje fijo.',steps:[['pc-idea','Idea'],['estilos','Estilo'],['p-t2v','Texto a video'],['pc-audio','Audio'],['p-exportar','Exportar en vertical']]},
  {t:'Un corto con personaje',s:'Varias escenas con el mismo protagonista.',steps:[['pc-idea','Idea'],['pc-historia','Historia'],['pc-guion','Guion y planos'],['pc-estilo','Estilo y color'],['pc-consistencia','Consistencia'],['pc-storyboard','Storyboard'],['pc-imagen','Imágenes'],['pc-video','Video'],['pc-audio','Audio'],['pc-edicion','Edición']]},
  {t:'Un videoclip',s:'La imagen sigue a la música.',steps:[['p-orden-audio','Música primero'],['p-videoclip','Concepto o actuación'],['estilos','Estilo'],['pc-storyboard','Storyboard'],['pc-video','Video'],['p-ritmo','Cortar al ritmo']]},
  {t:'Un anuncio de producto',s:'Gancho en los primeros segundos.',steps:[['p-anuncio','Gancho y estructura'],['e-commercial','Estilo comercial'],['pc-imagen','Imágenes'],['pc-video','Video'],['p-exportar','Exportar']]}];
const SECS=[['glosario','dolly','Glosario','El vocabulario de cine en '+CATS.length+' capítulos: cada término con su animación y la frase para el prompt.'],
  ['produccion','pipeline','Producción','De la idea al video final en '+PCH.length+' etapas, con plantillas, prompts para un LLM y los errores típicos.'],
  ['herramientas','motiontransfer','Herramientas','Qué hace cada IA de video, imagen y audio en 2026 y cómo escribirle a cada una.'],
  ['estilos','stylereel','Estilos',STYLES.length+' looks, del anime a los 80, con el bloque de estilo listo para pegar.'],
  ['generador','storyboard','Generador','Idea, estilo y planos: el prompt sale con la sintaxis de Kling, Flow, Seedance, Higgsfield y más.'],
  ['laboratorio','manual','Laboratorio','Mové cámara, lente y luz, y mirá cómo cambia el prompt de ese plano.']];
const linkA=(r,t,cls)=>'<a'+(cls?' class="'+cls+'"':'')+' href="#'+r+'" data-r="'+r+'">'+esc(t)+'</a>';

/* ---------- inicio ---------- */
$('#home-kicker').textContent=order.length+' términos · '+PROD.length+' temas de producción · '+TOOLS.length+' herramientas · '+STYLES.length+' estilos';
$('#home-steps').innerHTML=START.map((s,i)=>'<li><a href="#empezar-'+(i+1)+'" data-r="empezar-'+(i+1)+'"><span class="num">'+pad2(i+1)+'</span><span class="q"><b>'+esc(s.t)+'</b><span>'+esc(s.s)+'</span></span></a></li>').join('');
$('#home-quick').innerHTML=PCH.map(c=>'<li><a href="#pc-'+c.id+'" data-r="pc-'+c.id+'"><span class="num">'+esc(c.num)+'</span><span class="q"><b>'+esc(c.n)+'</b><span>'+esc(c.d)+'</span></span></a></li>').join('');
$('#home-secs').innerHTML=SECS.map(s=>card(s[0],s[1],'',s[2],s[3])).join('');
$('#gloss-intro').textContent=order.length+' términos en '+CATS.length+' capítulos. Están en el orden en que conviene aprenderlos: primero qué se ve en el cuadro, después cómo se mueve, cómo se ilumina, cómo se edita y cómo se pide a la IA.';
$('#foot-src').textContent='Los datos de herramientas, modelos y licencias se revisaron el 3 de noviembre de 2026 y cada ficha trae sus fuentes. Los modelos cambian todos los meses: revisá versión, límites y precio antes de pagar.';
$('#start-intro').textContent='Hacer video con IA se parece más a dirigir que a apretar un botón: vos decidís qué se ve, desde dónde y con qué luz, y la herramienta lo genera. Estos '+START.length+' pasos te llevan de cero a tu primer clip. Cada uno dice qué hacer y adónde ir en el sitio.';
$('#start-steps').innerHTML=START.map((s,i)=>'<li class="gstep" id="empezar-'+(i+1)+'"><a class="gthumb" href="#'+s.links[0][0]+'" data-r="'+s.links[0][0]+'" aria-label="'+esc(s.links[0][1])+'"><span class="thumb" data-thumb="'+th(s.demo)+'"></span></a><div class="gbody"><span class="num">Paso '+(i+1)+' de '+START.length+'</span><h2>'+esc(s.t)+'</h2><p>'+esc(s.txt)+'</p>'+
  (s.do&&s.do.length?'<ul>'+s.do.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul>':'')+'<div class="go-row">'+s.links.map((l,j)=>linkA(l[0],l[1],'go'+(j===0?' solid':''))).join('')+'</div></div></li>').join('');
$('#start-tips').innerHTML=START_TIPS.map(x=>'<li>'+esc(x)+'</li>').join('');
$('#start-paths').innerHTML=PATHS.map(p=>'<div class="path"><h3>'+esc(p.t)+'</h3><p>'+esc(p.s)+'</p><ol>'+p.steps.map(x=>'<li>'+linkA(x[0],x[1])+'</li>').join('')+'</ol></div>').join('');
$('#start-secs').innerHTML=SECS.map(s=>card(s[0],s[1],'',s[2],s[3])).join('');

function showHome(){mode='page';show('home');setReal(null);mountStage(heroSlot);stageLive=true;cur=HOMEREEL;nowIdx=-1;fitWitness(byId.dolly);queueThumbs(V.home);document.title='Plano a Plano'}
function showStart(n){pageMode('start');queueThumbs(V.start);document.title='Empezá acá · Plano a Plano';
  if(n)requestAnimationFrame(()=>{const el=document.getElementById('empezar-'+n);if(el)el.scrollIntoView({block:'start'})})}
let glossBuilt=false;
function showGloss(){pageMode('gloss');
  if(!glossBuilt){glossBuilt=true;$('#gloss-grid').innerHTML=CATS.map((c,i)=>card('c-'+c[0],CAT_THUMB[c[0]],'Capítulo '+pad2(i+1),c[1],CAT_DESC[c[0]],byCat(c[0]).length+' términos')).join('')}
  queueThumbs(V.gloss);document.title='Glosario · Plano a Plano'}
function showCat(c){pageMode('cat');const i=CATI[c],list=byCat(c),pv=CATS[i-1],nx=CATS[i+1];
  $('#cat-head').innerHTML='<nav class="crumbs" aria-label="Ruta">'+crumbs([['Inicio','inicio'],['Glosario','glosario'],[pad2(i+1)+' '+CATN[c],'']])+'</nav><span class="num">Capítulo '+pad2(i+1)+' de '+CATS.length+'</span><h1 id="h-cat">'+esc(CATN[c])+'</h1><p>'+esc(CAT_DESC[c])+' '+list.length+' términos.</p><div class="cta"><a class="btn primary" href="#'+list[0].id+'" data-r="'+list[0].id+'">Empezar con «'+esc(list[0].es)+'»</a></div>';
  $('#cat-tiles').innerHTML=list.map(tile).join('');
  $('#cat-nav').innerHTML=(pv?'<a class="btn" href="#c-'+pv[0]+'" data-r="c-'+pv[0]+'">← '+pad2(i)+' '+esc(pv[1])+'</a>':'<span></span>')+(nx?'<a class="btn" href="#c-'+nx[0]+'" data-r="c-'+nx[0]+'">'+pad2(i+2)+' '+esc(nx[1])+' →</a>':'<a class="btn" href="#produccion" data-r="produccion">Seguir con producción →</a>');
  queueThumbs(V.cat);document.title=CATN[c]+' · Glosario · Plano a Plano'}

/* ---------- índices de las secciones ---------- */
let prodBuilt=false;
function showProdIndex(){pageMode('prod');
  if(!prodBuilt){prodBuilt=true;$('#prod-intro').textContent=PCH.length+' etapas, en el orden en que se produce un video. Cada etapa tiene sus temas, con animación, plantillas en inglés y prompts para pedirle ayuda a un LLM.';
    $('#prod-stages').innerHTML=PCH.map(c=>{const L=PROD.filter(p=>p.ch===c.id);return card('pc-'+c.id,L[0].demo+(L[0].t0?'@'+L[0].t0:''),'Etapa '+c.num,c.n,c.d,L.length+' temas')}).join('')}
  queueThumbs(V.prod);document.title='Producción · Plano a Plano'}
let toolsBuilt=false,toolFilter='all';
function toolCards(){const L=TOOLS.filter(t=>toolFilter==='all'||t.kind===toolFilter);$('#tools-grid').innerHTML=L.map(t=>card('h-'+t.id,t.demo,KINDN[t.kind]+(t.by?' · '+t.by:''),t.n,clip(t.lead,120),t.ver)).join('');queueThumbs($('#tools-grid'))}
function showToolsIndex(){pageMode('tools');
  if(!toolsBuilt){toolsBuilt=true;$('#tools-intro').textContent=TOOLS.length+' herramientas de video, imagen, audio y acabado, revisadas el 3 de noviembre de 2026. Cada ficha dice qué hace, cómo escribirle, qué no está confirmado y de dónde sale cada dato.';
    const kinds=KINDS.filter(k=>TOOLS.some(t=>t.kind===k[0]));$('#tools-filter').innerHTML=[['all','Todas']].concat(kinds).map(k=>'<button type="button" data-f="'+k[0]+'" aria-pressed="'+(k[0]===toolFilter)+'">'+esc(k[1])+'</button>').join('');
    $('#feat-tiles').innerHTML=FK.map(k=>tileR('f-'+k,FEATS[k].demo,FEATS[k].n,clip(FEATS[k].d,80))).join('');
    const vt=TOOLS.filter(t=>t.kind==='video'),fv=['t2v','i2v','startend','keyframes','refs','motion','multishot','v2v','edit','newangle','extend','audio','lipsync','presets','upscale','character'].filter(k=>FEATS[k]);
    $('#matrix-note').textContent='Herramientas de video contra funciones, según las fuentes de cada ficha. Un punto vacío no siempre quiere decir que no lo tenga: puede que no esté documentado.';
    $('#matrix').innerHTML='<table><thead><tr><th>Herramienta</th>'+fv.map(k=>'<th><a href="#f-'+k+'" data-r="f-'+k+'">'+esc(FEATS[k].n)+'</a></th>').join('')+'</tr></thead><tbody>'+
      vt.map(t=>'<tr><td><a href="#h-'+t.id+'" data-r="h-'+t.id+'">'+esc(t.n)+'</a></td>'+fv.map(k=>{const has=t.feats&&k in t.feats;return '<td class="'+(has?'y':'n')+'" title="'+esc(has?(t.feats[k]||FEATS[k].n):'Sin dato')+'">'+(has?'●':'·')+'</td>'}).join('')+'</tr>').join('')+'</tbody></table>';
    if(RANK&&RANK.byJob&&RANK.byJob.length)$('#byjob').outerHTML=tblHTML(RANK.byJob[0],RANK.byJob.slice(1));
    $('#rank-note').textContent=(RANK.note||'')+(RANK.date?' Datos '+RANK.date+'.':'');
    $('#rank').innerHTML=(RANK.boards||[]).map(b=>{const sub=/más abajo/.test(b.h),tg=sub?'ul':'ol';return '<div class="board'+(sub?' sub':'')+'"><h3>'+esc(b.h)+'</h3><'+tg+'>'+b.rows.map(r=>'<li><span>'+esc(r[0])+'</span><span class="meta">'+esc(r[1])+'</span></li>').join('')+'</'+tg+'></div>'}).join('')+srcHTML(RANK.src)}
  toolCards();queueThumbs(V.tools);document.title='Herramientas · Plano a Plano'}
$('#tools-filter').addEventListener('click',e=>{const b=e.target.closest('button[data-f]');if(!b)return;toolFilter=b.dataset.f;$('#tools-filter').querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',x===b));toolCards()});
let stylesBuilt=false,styleFilter='all';
function styleGroups(){$('#styles-groups').innerHTML=STYLE_GROUPS.filter(g=>styleFilter==='all'||g[0]===styleFilter).map(g=>{const L=STYLES.filter(s=>s.g===g[0]);return L.length?'<section class="gsec"><h2>'+esc(g[1])+'</h2><div class="tiles">'+L.map(s=>tileR('e-'+s.id,s.demo,s.n,clip(s.lead,80),'estilo-'+s.id)).join('')+'</div></section>':''}).join('');queueThumbs($('#styles-groups'))}
function showStylesIndex(){pageMode('styles');
  if(!stylesBuilt){stylesBuilt=true;$('#styles-intro').textContent=STYLES.length+' estilos. Cada uno trae sus rasgos de luz, color, textura y cámara, y un bloque en inglés para pegar al final del prompt, adaptado a cada herramienta y con su traducción al español.';
    $('#styles-filter').innerHTML=[['all','Todos']].concat(STYLE_GROUPS).map(g=>'<button type="button" data-f="'+g[0]+'" aria-pressed="'+(g[0]===styleFilter)+'">'+esc(g[1])+'</button>').join('');
    const L=STYLE_LOCK;$('#stylelock').innerHTML='<h2>Mantener un estilo en todo el proyecto</h2><p>'+esc(L.lead||'')+'</p><ol class="steps-ol">'+(L.steps||[]).map(s=>'<li>'+esc(s)+'</li>').join('')+'</ol>'+noteP('Nombres o rasgos',L.policy,'g-note')+noteP('Mezclar dos estilos',L.mix,'g-note')+srcHTML(L.src)}
  styleGroups();queueThumbs(V.styles);document.title='Estilos · Plano a Plano'}
$('#styles-filter').addEventListener('click',e=>{const b=e.target.closest('button[data-f]');if(!b)return;styleFilter=b.dataset.f;$('#styles-filter').querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',x===b));styleGroups()});

/* ---------- reproductor: una parte a la vez, con sus temas en pestañas ---------- */
const gInfo=$('#info-g'),chapHead=$('#chap-head'),ghead=$('#ghead'),tabsEl=$('#tabs'),setFig=$('#setfig');let lastEx=byId.dolly;
const narrow=()=>window.matchMedia('(max-width:900px)').matches;
function enterPlayer(m){mode=m;show('player');setReal(null);mountStage(playerSlot);stageLive=true;const lab=m==='man';V.player.classList.toggle('lab',lab);
  $('#side').hidden=!lab;panel.hidden=!lab;$('#info-ex').hidden=m!=='ex';gInfo.hidden=lab||m==='ex';$('#info-man').hidden=!lab;setFig.hidden=!(m==='ex'||lab);
  ['#b-prev','#b-next','#count'].forEach(s=>$(s).hidden=lab);$('#b-reset').hidden=!lab}
function playDemo(id,t0){cur=demoOf(id);T=(t0||0)+(playing?0:cur.dur*.3);fitWitness(cur);render()}
/* grupos: cada sección se parte en grupos chicos y cada grupo muestra solo sus temas */
const GROUPS={
  ex:CATS.map((c,i)=>({id:c[0],eye:'Glosario · capítulo '+pad2(i+1)+' de '+CATS.length,n:c[1],d:CAT_DESC[c[0]],items:byCat(c[0]).map(d=>[d.id,d.es]),back:['c-'+c[0],'Ver el capítulo con imágenes']})),
  prod:PCH.map(c=>({id:c.id,eye:'Producción · etapa '+c.num+' de '+pad2(PCH.length),n:c.n,d:c.d,items:PROD.filter(p=>p.ch===c.id).map(p=>['p-'+p.id,p.t]),back:['produccion','Ver todas las etapas']})),
  tool:KINDS.filter(k=>TOOLS.some(t=>t.kind===k[0])).map(k=>({id:k[0],eye:'Herramientas',n:k[1],d:'',items:TOOLS.filter(t=>t.kind===k[0]).map(t=>['h-'+t.id,t.n]),back:['herramientas','Ver todas y comparar']}))
    .concat([{id:'feat',eye:'Herramientas',n:'Funciones',d:'Qué puede hacer una IA de video, cada función con su animación.',items:FK.map(k=>['f-'+k,FEATS[k].n]),back:['herramientas','Ver todas y comparar']}]),
  style:STYLE_GROUPS.map(g=>({id:g[0],eye:'Estilos',n:g[1],d:'',items:STYLES.filter(s=>s.g===g[0]).map(s=>['e-'+s.id,s.n]),back:['estilos','Ver la biblioteca']})).filter(g=>g.items.length)};
GROUPS.feat=GROUPS.tool;
function groupOf(kind,r){const G=GROUPS[kind];for(let i=0;i<G.length;i++)if(G[i].items.some(x=>x[0]===r))return [G,i];return [G,0]}
let headKey='';
function openItem(kind,r){enterPlayer(kind);const [G,gi]=groupOf(kind,r),g=G[gi],pv=G[gi-1],nx=G[gi+1],k=kind+':'+g.id;
  if(headKey!==k){headKey=k;
    ghead.innerHTML='<div class="gh-txt"><span class="eyebrow2">'+esc(g.eye)+'</span><h1>'+esc(g.n)+'</h1>'+(g.d?'<p>'+esc(g.d)+'</p>':'')+'</div><div class="gh-nav">'+
      (pv?linkA(pv.items[0][0],'← '+pv.n,'btn'):'')+(nx?linkA(nx.items[0][0],nx.n+' →','btn'):'')+linkA(g.back[0],g.back[1],'more')+'</div>';
    tabsEl.innerHTML='<span class="lbl">'+(kind==='prod'?'En esta etapa':kind==='ex'?'En este capítulo':'En este grupo')+'</span><ol>'+g.items.map((x,i)=>'<li><a href="#'+x[0]+'" data-r="'+x[0]+'"><span class="n">'+(i+1)+'</span>'+esc(x[1])+'</a></li>').join('')+'</ol>'}
  let on=null;tabsEl.querySelectorAll('a').forEach(a=>{if(a.dataset.r===r){a.setAttribute('aria-current','true');on=a}else a.removeAttribute('aria-current')});
  if(on){const ol=on.closest('ol');if(ol.scrollWidth>ol.clientWidth+2)ol.scrollLeft=on.offsetLeft-ol.clientWidth/2+on.offsetWidth/2}
  const i=g.items.findIndex(x=>x[0]===r);$('#count').textContent=(i+1)+' / '+g.items.length}
const SEQ={ex:order.map(d=>[d.id,d.es]),prod:PROD.map(p=>['p-'+p.id,p.t]),tool:TOOLS.map(t=>['h-'+t.id,t.n]).concat(FK.map(k=>['f-'+k,FEATS[k].n])),style:STYLES.map(s=>['e-'+s.id,s.n])};SEQ.feat=SEQ.tool;
const SEQEND={ex:['produccion','Seguir con producción'],prod:['herramientas','Seguir con las herramientas'],tool:['estilos','Seguir con los estilos'],feat:['estilos','Seguir con los estilos'],style:['generador','Armar prompts en el generador']};
function seqFoot(kind,r){const L=SEQ[kind],i=L.findIndex(x=>x[0]===r),nx=L[i+1],[G,gi]=groupOf(kind,r),ng=nx&&groupOf(kind,nx[0])[1]!==gi?groupOf(kind,nx[0]):null;
  return '<p class="nextup">'+(nx?'<span class="lbl">Sigue</span>'+linkA(nx[0],nx[1]+' →')+(ng?'<span class="meta">empieza '+esc(G[ng[1]].n)+'</span>':''):'<span class="lbl">Fin de la sección</span>'+linkA(SEQEND[kind][0],SEQEND[kind][1]+' →'))+'</p>'}

function showTerm(id){const d=byId[id];openItem('ex',id);const i=CATI[d.cat],gi=order.indexOf(d);
  $('#crumbs').innerHTML=crumbs([['Inicio','inicio'],['Glosario','glosario'],[pad2(i+1)+' '+CATN[d.cat],'c-'+d.cat],[d.es,'']]);
  $('#i-cat').hidden=true;$('#i-es').textContent=d.es;$('#i-what').textContent=d.what;$('#i-look').textContent=d.look;$('#i-prompt').textContent=d.en;{const es=ES[d.en],pb=$('#i-pbox');$('#i-prompt-es').textContent=es||'';pb.classList.toggle('bi',!!es);pb.dataset.pl=es?PLANG:'en'}
  $('#i-ref').textContent=d.ref||'';$('#i-refw').hidden=!d.ref;$('#nextup').outerHTML=seqFoot('ex',id).replace('<p class="nextup">','<p class="nextup" id="nextup">');
  setReal(d.id,'Ejemplo de '+d.es);cur=d;lastEx=d;T=playing?0:d.dur*.45;fitWitness(d);document.title=d.es+' · Plano a Plano';render()}
function prodHTML(p){const o=['<h2>'+esc(p.t)+'</h2><p>'+esc(p.lead)+'</p>'];
  if(p.anat)o.push(anatHTML(p.anat));(p.tpl||[]).forEach(x=>o.push(codeBlock(x.h,x.code)));if(p.vary)o.push(varyHTML(p.vary));
  (p.llm||[]).forEach(x=>o.push('<div class="llmb">'+codeBlock(/claude|chatgpt|gemini|llm/i.test(x.h||'')?x.h:(x.h||'Prompt')+' · para Claude, ChatGPT o Gemini',x.code)+'</div>'));
  (p.lists||[]).forEach(x=>o.push(listHTML(x)));if(p.tbl)o.push(tblHTML(p.tbl.head,p.tbl.rows));
  o.push(noteP('Límite',p.lim),noteP('Error típico',p.err),noteP('',p.note,'g-note'),goRow(p.go),srcHTML(p.src));return o.join('')}
function showProd(id){const p=PBY[id],c=PCHB[p.ch],r='p-'+id;openItem('prod',r);
  $('#crumbs').innerHTML=crumbs([['Inicio','inicio'],['Producción','produccion'],[c.num+' '+c.n,'pc-'+c.id],[p.t,'']]);
  gInfo.innerHTML=prodHTML(p)+seqFoot('prod',r);playDemo(p.demo,p.t0);document.title=p.t+' · Producción · Plano a Plano'}
function toolHTML(t){const o=['<h2>'+esc(t.n)+'</h2>'+((t.by||t.ver)?'<p class="meta">'+esc([t.by,t.ver].filter(Boolean).join(' · '))+'</p>':'')+'<p>'+esc(t.lead)+'</p>'];
  const fk=Object.keys(t.feats||{}).filter(k=>FEATS[k]);
  if(fk.length)o.push('<div>'+lbl('Qué puede hacer · tocá una para verla en el monitor')+'<div class="go-row feat-row">'+fk.map(k=>'<button type="button" class="go" data-feat="'+k+'" aria-pressed="false">'+esc(FEATS[k].n)+'</button>').join('')+'</div><p class="g-note featline" hidden></p></div>');
  if(t.best&&t.best.length)o.push(listHTML({h:'Conviene para',items:t.best}));
  if(t.specs&&t.specs.length)o.push(tblHTML(['Dato','Valor'],t.specs,'kv'));
  if(t.anat)o.push(anatHTML(t.anat));(t.tpl||[]).forEach(x=>o.push(codeBlock(x.h,x.code)));
  if(t.tips&&t.tips.length)o.push(listHTML({h:'Consejos',items:t.tips}));
  o.push(noteP('Error típico',t.err),noteP('Sin confirmar',t.watch,'g-note warn'));
  if(GEN_ALL.includes(t.id))o.push('<div class="go-row"><a class="go solid" href="#generador" data-gen="tool:'+t.id+'">Armar prompts para '+esc(t.n)+' en el generador</a></div>');
  o.push(srcHTML(t.src));return o.join('')}
function showTool(id){const t=TBY[id],r='h-'+id;openItem('tool',r);
  $('#crumbs').innerHTML=crumbs([['Inicio','inicio'],['Herramientas','herramientas'],[t.n,'']]);
  gInfo.innerHTML=toolHTML(t)+seqFoot('tool',r);playDemo(t.demo);document.title=t.n+' · Herramientas · Plano a Plano'}
function featHTML(k){const f=FEATS[k],has=TOOLS.filter(t=>t.feats&&k in t.feats);const o=['<h2>'+esc(f.n)+'</h2><p>'+esc(f.d)+'</p>',noteP('Cómo se pide',f.how)];
  if(f.tpl)o.push(codeBlock('Plantilla',f.tpl));
  if(has.length)o.push('<div>'+lbl('Quién la tiene')+'<ul class="has">'+has.map(t=>'<li><a href="#h-'+t.id+'" data-r="h-'+t.id+'">'+esc(t.n)+'</a>'+(t.feats[k]?' <span>'+esc(t.feats[k])+'</span>':'')+'</li>').join('')+'</ul></div>');return o.join('')}
function showFeat(k){const r='f-'+k;openItem('feat',r);
  $('#crumbs').innerHTML=crumbs([['Inicio','inicio'],['Herramientas','herramientas'],['Funciones','herramientas'],[FEATS[k].n,'']]);
  gInfo.innerHTML=featHTML(k)+seqFoot('feat',r);playDemo(FEATS[k].demo);document.title=FEATS[k].n+' · Herramientas · Plano a Plano'}
const PP_ES=[[' in [',' en ['],['[personaje] says:','[personaje] dice:'],['Ambient noise:','Ruido ambiente:'],[' shots, ',' planos, '],['Shot 1:','Plano 1:'],['Shot 2:','Plano 2:'],['Restyle this video: ','Reestilizá este video: '],['Keep the original motion, timing and framing.','Mantené el movimiento, los tiempos y el encuadre originales.'],['A [plano] of [sujeto]','Un [plano] de [sujeto]'],['Style: ','Estilo: '],['This image is the start frame for a video shot, 16:9.','Esta imagen es el frame inicial de un plano de video, 16:9.']];
const ppES=t=>PP_ES.reduce((a,[x,y])=>a.split(x).join(y),String(t||''));
function styleVary(s){const opts=Object.keys(STYLE_TOOLFMT).map(k=>{const f=STYLE_TOOLFMT[k],eb=ES[s.block];return {k,l:toolName(k),code:((f.pre||'')+s.block+(f.post||'')).trim(),es:eb?(ppES(f.pre)+eb+ppES(f.post)).trim():null,how:f.how}});return varyHTML({h:'Bloque de estilo para pegar',opts})}
function styleHTML(s){const o=['<h2>'+esc(s.n)+'</h2><p>'+esc(s.lead)+'</p>'];
  if(s.traits&&s.traits.length)o.push(tblHTML(['Rasgo','Cómo se ve'],s.traits,'kv'));
  o.push(styleVary(s));if(s.avoid)o.push(codeBlock('Para esquivar la falla típica, sumá',s.avoid));
  if(s.kw&&s.kw.length)o.push('<div>'+lbl('Palabras clave')+'<div class="kw">'+s.kw.map(k=>'<code>'+esc(k)+'</code>').join('')+'</div></div>');
  if(s.fix&&s.fix.length)o.push(tblHTML(['Problema','Solución'],s.fix));
  o.push(noteP('Herramientas',s.tools),noteP('Para estudiar',s.refs),noteP('Sin confirmar',s.watch,'g-note warn'));
  o.push('<div class="go-row"><a class="go solid" href="#generador" data-gen="style:'+s.id+'">Usar este estilo en el generador</a>'+(byId[s.demo]&&CATN[byId[s.demo].cat]?'<a class="go" href="#'+s.demo+'" data-r="'+s.demo+'">Ver en el glosario</a>':'')+'</div>',srcHTML(s.src));return o.join('')}
function showStyle(id){const s=SBY[id],r='e-'+id;openItem('style',r);
  $('#crumbs').innerHTML=crumbs([['Inicio','inicio'],['Estilos','estilos'],[s.n,'']]);
  gInfo.innerHTML=styleHTML(s)+seqFoot('style',r);setReal('estilo-'+s.id,'Ejemplo de '+s.n);playDemo(s.demo);document.title=s.n+' · Estilos · Plano a Plano'}

function showLab(){enterPlayer('man');headKey='';show('player');chapHead.innerHTML='<span class="lbl">Laboratorio</span><p>Elegí un estilo y un formato de prompt, y después mové la cámara, el lente y la luz.</p>';
  $('#crumbs').innerHTML=crumbs([['Inicio','inicio'],['Glosario','glosario'],['Laboratorio','']]);cur=MANUAL;T=0;syncPanel();fitWitness(MANUAL);const S=fresh(0);manualFn(0,S,fresh(0));describe();document.title='Laboratorio · Plano a Plano';render()}

/* ---------- generador ---------- */
const GV={
  shot:[['ews','extreme wide shot'],['wide','wide shot'],['establishing','establishing shot'],['full','full shot'],['cowboy','cowboy shot'],['medium','medium shot'],['mcu','medium close-up'],['closeup','close-up'],['ecu','extreme close-up'],['insert','insert shot'],['twoshot','two-shot'],['ots','over-the-shoulder shot'],['pov','POV shot']],
  angle:[['eye','eye-level'],['high','high angle'],['low','low angle'],['topdown','top-down overhead shot'],['worm',"worm's-eye view"],['ground','ground-level'],['dutch','Dutch angle'],['profile','profile view'],['behind','from behind']],
  move:[['static','static camera'],['pan','slow pan'],['tilt','slow tilt up'],['pedestal','pedestal up'],['dolly','slow dolly in'],['pullout','slow pull-out reveal'],['zoom','slow zoom in'],['crashzoom','crash zoom in'],['dollyzoom','dolly zoom'],['tracking','tracking shot following the subject'],['leadingshot','leading shot, camera moving backward ahead of the subject'],['steadicam','smooth gimbal follow'],['handheld','handheld camera'],['crane','crane up'],['orbit','slow orbit around the subject'],['drone','aerial drone shot'],['fpv','FPV drone flythrough'],['whip','whip pan'],['rack','rack focus']],
  lens:[['','Sin indicar'],['24','24mm wide-angle lens'],['35','35mm lens'],['50','50mm lens'],['85','85mm portrait lens'],['macro','macro lens'],['anam','anamorphic lens']],
  light:[['','Sin indicar'],['golden','golden hour light'],['bluehour','blue hour light'],['highkey','bright high-key lighting'],['lowkey','low-key lighting, deep shadows'],['hardsoft','soft diffused light'],['neon','neon lighting'],['moonlight','cool moonlight'],['practical','practical lights in the scene'],['silhouette','backlit silhouette'],['volumetric','volumetric light through haze'],['rim','strong rim light'],['split','split lighting'],['toplight','hard top light'],['under','underlighting']]};
const GVM={};for(const k in GV)GVM[k]=Object.fromEntries(GV[k]);
const LENS_ES={'':'Sin indicar','24':'24 mm gran angular','35':'35 mm','50':'50 mm','85':'85 mm retrato','macro':'Macro','anam':'Anamórfico'};
const gvLabel=(k,id)=>k==='lens'?LENS_ES[id]:id===''?'Sin indicar':(byId[id]?byId[id].es:id);
const ARS=[['16:9','16:9 horizontal'],['9:16','9:16 vertical'],['1:1','1:1 cuadrado'],['2.39:1','2.39:1 cinemascope'],['4:3','4:3']];
const GEN_VIDEO=['kling','flow','seedance','higgsfield','runway','wan','hailuo','generic'],GEN_IMG=['nanobanana','midjourney','gptimage','seedream','flux'],GEN_ALL=GEN_VIDEO.concat(GEN_IMG);
const newShot=o=>Object.assign({shot:'wide',angle:'eye',move:'static',lens:'',action:'',dialogue:'',sound:'',dur:4,who:0,with:-1,where:0},o||{});
const pick=(k,v,d)=>GVM[k]&&Object.prototype.hasOwnProperty.call(GVM[k],v)?v:d;
const newEnt=o=>Object.assign({n:'',d:'',ref:false,img:''},o||{});
const GS={idea:'',cast:[newEnt()],locs:[newEnt()],light:'',mood:'',style:'',ar:'16:9',tool:GEN_VIDEO.includes(PREF.video)?PREF.video:'kling',shots:[newShot()]};
const loadPreset=p=>Object.assign(GS,{idea:p.idea,cast:p.cast.map(newEnt),locs:p.locs.map(newEnt),light:p.light,mood:p.mood,shots:p.shots.map(s=>newShot(s))});
const P_ANA='a woman in her late twenties with shoulder-length dark brown hair and light-tan skin, wearing a plain red crew-neck t-shirt, dark blue jeans and white sneakers',
  P_LEO='a man in his thirties with short black hair, wearing a teal t-shirt and gray trousers',
  P_PARK='a small quiet park with tall pine trees, a light gravel path, a vintage black street lamp and a small cream-colored house with a dark red roof';
const PRESETS=[
  {n:'Corto con dos personajes',idea:'Ana espera bajo el farol del parque. Cuando la luz se enciende, llega Leo, tarde como siempre.',light:'bluehour',mood:'quiet, hopeful, a little playful',
    cast:[{n:'Ana',d:P_ANA,ref:true,img:'ref-personaje-a'},{n:'Leo',d:P_LEO,ref:true,img:'ref-personaje-b'}],locs:[{n:'Parque',d:P_PARK,ref:true,img:'ref-parque'}],
    shots:[{shot:'establishing',who:-1,action:'the street lamp flickers in the empty park as night falls',sound:'crickets, distant traffic',dur:3},
      {shot:'wide',who:0,action:'waits alone under the unlit street lamp and checks her watch',dur:4},
      {shot:'full',move:'tracking',who:1,action:'hurries along the gravel path toward the lamp',sound:'footsteps on gravel',dur:3},
      {shot:'ots',lens:'50',who:0,with:1,action:'looks at him over his shoulder, trying not to smile',dialogue:'(softly) Siempre llegás tarde.',dur:4},
      {shot:'closeup',move:'dolly',lens:'85',who:1,action:'smiles, a little embarrassed',dialogue:'(laughing) Pero llegué.',dur:3},
      {shot:'wide',move:'pullout',who:0,with:1,action:'the lamp turns on above them as they walk away together',sound:'electric hum of the lamp, soft music',dur:4}]},
  {n:'Escena con diálogo',idea:'Alguien espera bajo un farol; cuando la luz se enciende, llega la persona que esperaba.',light:'bluehour',mood:'quiet, hopeful',
    cast:[{n:'Ana',d:'a young woman in a red shirt and a red cap'}],locs:[{n:'Parque',d:'a quiet park at dusk with pine trees and a single street lamp'}],
    shots:[{shot:'wide',move:'static',action:'stands alone under the unlit street lamp and checks her watch',sound:'distant traffic, crickets',dur:4},{shot:'closeup',move:'dolly',lens:'50',action:'looks up as the lamp flickers on and smiles',dialogue:'(softly) Siempre llegás tarde.',sound:'electric hum of the lamp',dur:4}]},
  {n:'Videoclip',idea:'Una bailarina sola en un parque de noche; cada golpe de la música cambia la luz.',light:'neon',mood:'energetic, hypnotic',
    cast:[{n:'Bailarina',d:'a dancer in a white tank top and black trousers'}],locs:[{n:'Parque de noche',d:'an empty park at night with wet pavement and neon reflections'}],
    shots:[{shot:'wide',angle:'low',move:'crane',action:'starts dancing in the center of the frame',sound:'deep bass hit',dur:3},{shot:'medium',move:'orbit',action:'spins with arms open, hair flying',dur:3},{shot:'closeup',move:'handheld',action:'stops and stares into the lens, breathing',dur:2},{shot:'ews',angle:'topdown',move:'drone',action:'dances alone, a tiny figure on the wet ground',dur:4}]},
  {n:'Tráiler',idea:'Un pueblo donde los faroles se apagan uno por uno y alguien decide averiguar por qué.',light:'lowkey',mood:'mysterious, tense',
    cast:[{n:'Tomás',d:'a man in his 40s in a dark wool coat'}],locs:[{n:'Pueblo',d:'a small foggy town at night with old street lamps'}],
    shots:[{shot:'ews',move:'drone',who:-1,action:'street lamps go dark one by one across the town',sound:'low drone, wind',dur:4},{shot:'medium',move:'tracking',action:'walks fast down an empty street, looking back',sound:'footsteps on cobblestones',dur:3},{shot:'insert',move:'static',lens:'macro',who:-1,action:'a lamp bulb flickers and dies',sound:'electric crackle',dur:2},{shot:'closeup',angle:'low',move:'dolly',action:'looks up at the last lit lamp',dialogue:'No es casualidad.',dur:3},{shot:'wide',move:'pullout',action:'stands alone as the last lamp goes out',sound:'silence, then a deep hit',dur:4}]},
  {n:'Producto',idea:'Una taza amarilla que mantiene el café caliente toda la mañana.',light:'hardsoft',mood:'warm, calm, premium',
    cast:[{n:'Taza',d:'a matte yellow ceramic mug with steam rising'}],locs:[{n:'Mesa',d:'a wooden table by a window in the early morning'}],
    shots:[{shot:'insert',move:'orbit',lens:'macro',action:'steam curls up from the coffee in slow motion',sound:'soft pour, ceramic clink',dur:4},{shot:'medium',move:'dolly',lens:'85',action:'a hand lifts the mug from the table',dur:3},{shot:'closeup',move:'static',lens:'50',action:'the mug rests on the table, morning light across it',dur:3}]}];

/* traducción: el texto se puede escribir en español; antes de armar el prompt se pasa al inglés.
   Orden: traductor integrado de Chrome (en tu equipo), Claude (si la página corre dentro de Claude) y MyMemory (servicio gratis, unos 5000 caracteres por día) */
const isES=t=>{t=' '+String(t||'').toLowerCase().replace(/[.,;:!?()"]/g,' ')+' ';if(/[áéíóúñ¿¡]/.test(t))return true;
  const es=(t.match(/\s(el|la|los|las|un|una|unos|unas|del|con|que|en|y|se|su|sus|por|para|mira|camina|corre|lleva|pelo|cabello|mujer|hombre|chica|chico|noche|calle|parque|casa|camisa|pantalón|ojos|cerca|lejos|hacia|sobre|bajo|entre|muy|luz|al|lo|le|es|está|pequeño|pequeña|viejo|vieja|joven)(?=\s)/g)||[]).length,
    en=(t.match(/\s(the|and|with|of|a|an|is|his|her|in|on|at|wearing|looks|walks|toward|light|from|into|by)(?=\s)/g)||[]).length;return es>=2&&es>en};
const TRC=(()=>{try{return JSON.parse(store.get('tr')||'{}')||{}}catch(e){return {}}})();
const saveTRC=()=>{try{const k=Object.keys(TRC);k.slice(0,Math.max(0,k.length-400)).forEach(x=>delete TRC[x]);store.set('tr',JSON.stringify(TRC))}catch(e){}};
const trKey=(f,t,x)=>f+'>'+t+'|'+String(x).trim();
const EN=x=>{const v=String(x||'').trim();return isES(v)&&TRC[trKey('es','en',v)]?TRC[trKey('es','en',v)]:v};
const decodeHTML=s=>{const t=document.createElement('textarea');t.innerHTML=s;return t.value};
function chunks(t,max){const out=[];let cur='';String(t).split(/(?<=[.!?;,])\s+/).forEach(p=>{const n=cur?cur+' '+p:p;if(new TextEncoder().encode(n).length>max&&cur){out.push(cur);cur=p}else cur=n});if(cur)out.push(cur);return out}
async function mmTr(t,f,to){const o=[];for(const c of chunks(t,450)){const r=await fetch('https://api.mymemory.translated.net/get?q='+encodeURIComponent(c)+'&langpair='+f+'|'+to);if(!r.ok)throw new Error('mm '+r.status);
  const j=await r.json(),x=j&&j.responseData&&j.responseData.translatedText;if(+j.responseStatus!==200||!x||/MYMEMORY WARNING|QUERY LENGTH LIMIT/i.test(x))throw new Error('mm');o.push(decodeHTML(x))}return o.join(' ')}
async function translate(texts,f,to,localOnly){const res=texts.map(x=>TRC[trKey(f,to,x)]);const todo=texts.map((x,i)=>res[i]==null?i:-1).filter(i=>i>=0);let via='';
  const put=(i,v)=>{v=String(v||'').trim();if(v){res[i]=v;TRC[trKey(f,to,texts[i])]=v}};
  if(todo.length&&'Translator' in self){try{const av=await Translator.availability({sourceLanguage:f,targetLanguage:to});if(av&&av!=='unavailable'){const tr=await Translator.create({sourceLanguage:f,targetLanguage:to});for(const i of todo)put(i,await tr.translate(texts[i]));via='el traductor de Chrome'}}catch(e){}}
  let left=todo.filter(i=>res[i]==null);
  if(left.length&&sampleFn){try{const o=await sampleFn.json('Translate each '+(f==='es'?'Spanish':'English')+' string into natural '+(to==='en'?'English':'Spanish')+' for an AI video prompt. Keep names, numbers and anything in quotes as they are. Reply with only a JSON array of strings, same order and length.\n'+JSON.stringify(left.map(i=>texts[i])),{modelTier:'quick'});
    if(Array.isArray(o))left.forEach((i,k)=>put(i,o[k]));if(!via)via='Claude'}catch(e){}}
  left=todo.filter(i=>res[i]==null);
  if(left.length&&!localOnly){try{for(const i of left)put(i,await mmTr(texts[i],f,to));if(!via)via='MyMemory'}catch(e){}}
  saveTRC();return {res,via,missing:todo.filter(i=>res[i]==null).map(i=>texts[i])}}

/* piezas del prompt */
const cap1=s=>s?s.charAt(0).toUpperCase()+s.slice(1):'';
const trimEnd=s=>String(s||'').trim().replace(/[\s.,;]+$/,'');
const sent=s=>{s=trimEnd(s);return s?cap1(s)+'.':''};
const J=(...a)=>a.filter(x=>x&&String(x).trim()).join(' ');
const CL=(...a)=>a.map(trimEnd).filter(Boolean).join(', ');
const pascal=s=>String(s||'').normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^A-Za-z0-9]+(.)?/g,(m,c)=>c?c.toUpperCase():'').replace(/^./,c=>c.toUpperCase());
const slug=s=>String(s||'').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'');
function shortWho(d){const s=trimEnd(EN(d)||'the character').replace(/^(a|an|the)\s+/i,'');return cap1(s.split(/\s+(?:in|with|wearing|who|holding)\s+/i)[0].split(/\s+/).slice(0,4).join(' '))}
const entOk=e=>e&&String(e.d||'').trim()?e:null;
const castAt=(G,i)=>i>=0?entOk(G.cast[i]):null,locAt=(G,i)=>i>=0?entOk(G.locs[i]):null;
const entName=(e,isLoc)=>trimEnd(e.n)||(isLoc?'Location':shortWho(e.d));
function refList(G){return G.cast.filter(c=>c.ref&&entOk(c)).concat(G.locs.filter(l=>l.ref&&entOk(l)))}
const TAG_TOOLS=['seedance','runway','higgsfield'],IMGN_TOOLS=['generic','nanobanana','gptimage','seedream'];
function refTok(G,e,R){const k=R.indexOf(e)+1;if(!e.ref||!k)return '';const t=G.tool,isLoc=G.locs.includes(e);
  if(t==='seedance')return '@Image'+k;if(t==='runway')return '@'+pascal(entName(e,isLoc));if(t==='higgsfield')return '@'+slug(entName(e,isLoc));if(t==='kling')return '[@'+pascal(entName(e,isLoc))+']';return ''}
function textOf(G,e,R){const d=trimEnd(EN(e.d)),tok=refTok(G,e,R),k=R.indexOf(e)+1;
  if(tok&&TAG_TOOLS.includes(G.tool))return tok;if(e.ref&&k&&IMGN_TOOLS.includes(G.tool))return d+' (Image '+k+')';return d}
function declOf(G,ents,R){const used=R.filter(e=>ents.includes(e));if(!used.length)return '';
  if(G.tool==='seedance')return used.map(e=>refTok(G,e,R)+' is '+sent(EN(e.d))).join(' ');
  if(IMGN_TOOLS.includes(G.tool))return used.map(e=>'Image '+(R.indexOf(e)+1)+': '+(G.locs.includes(e)?'location':'character')+' reference for '+entName(e,G.locs.includes(e))+'.').join(' ');return ''}
function parts(G,s,R){R=R||refList(G);const st=G.style&&SBY[G.style]?SBY[G.style].block:'';
  const c1=castAt(G,s.who),c2=s.with!==s.who?castAt(G,s.with):null,cs=[c1,c2].filter(Boolean),L=locAt(G,s.where),noOne=s.who<0&&!c2;
  const subj=cs.length?cs.map(e=>textOf(G,e,R)).join(' and '):(noOne?'':'the character');
  const tags=cs.length?cs.map(e=>R.includes(e)?refTok({tool:'kling',locs:G.locs},e,R):'['+entName(e)+': '+trimEnd(EN(e.d))+']').join(' and '):'';
  const sp=c1||c2;
  return {shot:GVM.shot[s.shot]||'',angle:GVM.angle[s.angle]||'',move:GVM.move[s.move]||'',lens:GVM.lens[s.lens]&&s.lens?GVM.lens[s.lens]:'',
    subj,tags,spk:sp?textOf(G,sp,R):'',act:trimEnd(EN(s.action)),scene:L?textOf(G,L,R):'',light:s.light?GVM.light[s.light]:(G.light?GVM.light[G.light]:''),mood:trimEnd(EN(G.mood)),style:trimEnd(st),
    dlg:String(s.dialogue||'').trim().replace(/^\([^)]*\)\s*/,'').replace(/^["“]|["”]$/g,''),tone:EN((String(s.dialogue||'').trim().match(/^\(([^)]*)\)/)||[])[1]||''),snd:trimEnd(EN(s.sound)),dur:Math.max(1,+s.dur||4),
    who:sp?entName(sp):'the character',named:!!(sp&&trimEnd(sp.n)),decl:declOf(G,cs.concat(L?[L]:[]),R),ents:cs.concat(L?[L]:[]),s}}
const kd=P=>'['+P.who+(P.tone?', '+P.tone:'')+']: "'+P.dlg+'"';
const tot=G=>G.shots.reduce((a,s)=>a+Math.max(1,+s.dur||4),0);
const ts=x=>'00:'+pad2(Math.floor(x));
const mjAr=ar=>ar==='2.39:1'?'239:100':ar;
const theW=P=>P.named?P.who:'the '+P.who.toLowerCase();
const saysT=P=>cap1(theW(P))+' says'+(P.tone?', '+P.tone:'')+': "'+P.dlg+'"';
const frm=P=>CL(cap1(P.shot),P.angle==='eye-level'?'':P.angle);
const mv=P=>CL(cap1(P.move),P.lens);
const moodS=P=>P.mood?sent(cap1(P.mood)+' mood'):'';
const SA=(P,pre)=>pre?pre+' '+sent(P.snd):sent(P.snd);
const klS=P=>P.tags?P.tags+(P.act?' '+trimEnd(P.act)+'.':'.'):sent(P.act);
const sdA=P=>J(P.subj,P.act||(P.subj?'holds still':''));
const uniqDecl=(G,L,R)=>declOf(G,[...new Set([].concat(...L.map(P=>P.ents)))],R);
const FMT={
  generic:{one:(G,P)=>J(sent(J(P.subj,P.act)+(P.scene?' in '+P.scene:'')),sent(CL(frm(P),P.move,P.lens)),sent(P.light),sent(P.style),moodS(P),P.snd?SA(P,'SFX:'):'',P.dlg?saysT(P):''),
    all:(G,L)=>J(L.map((P,i)=>'Shot '+(i+1)+': '+J(sent(frm(P)+(P.scene&&(i===0||P.scene!==L[i-1].scene)?' of '+P.scene:'')),sent(J(P.subj,P.act)),sent(mv(P)),i===0?sent(P.light):'',P.snd?SA(P,'SFX:'):'',P.dlg?saysT(P):'')).join(' '),sent(L[0].style),moodS(L[0]))},
  kling:{one:(G,P)=>J(sent(CL(P.scene,P.light)),P.snd?sent(P.snd):'',klS(P),P.dlg?kd(P):'',sent(CL(frm(P),P.move,P.lens)),sent(P.style),moodS(P)),
    all:(G,L)=>J(L.map((P,i)=>'Shot '+(i+1)+' (Duration: '+P.dur+' seconds): '+J(sent(CL(frm(P)+(P.scene&&(i===0||P.scene!==L[i-1].scene)?' of '+P.scene:''),i===0?P.light:'')),klS(P),P.dlg?kd(P):'',P.snd?sent(P.snd):'',sent(mv(P)))).join(' '),sent(L[0].style),moodS(L[0]))},
  flow:{one:(G,P)=>J(sent(CL(frm(P)+(P.scene?' of '+P.scene:''),P.move,P.lens)),sent(J(P.subj,P.act)),sent(CL(P.light,P.style)),moodS(P),P.snd?SA(P,'SFX:'):'',P.dlg?saysT(P):''),
    all:(G,L)=>{let t=0;return J(L.map((P,i)=>{const a=t;t+=P.dur;return '['+ts(a)+'-'+ts(t)+'] '+J(sent(CL(frm(P)+(P.scene&&(i===0||P.scene!==L[i-1].scene)?' of '+P.scene:''),P.move,P.lens)),sent(J(P.subj,P.act)),i===0?sent(P.light):'',P.snd?SA(P,'SFX:'):'',P.dlg?saysT(P):'')}).join(' '),sent(L[0].style),moodS(L[0]))}},
  seedance:{one:(G,P)=>J(P.decl,P.style?'Style: '+sent(P.style):'',sent(CL(frm(P)+': '+sdA(P)+(P.scene?' in '+P.scene:''),P.move,P.lens,P.light)),P.dlg?(P.spk||cap1(theW(P)))+' says'+(P.tone?', '+P.tone:'')+': "'+P.dlg+'". Only one person speaks.':'',P.snd?SA(P,'Sound:'):''),
    all:(G,L,R)=>{let t=0;const P0=L[0];return J(uniqDecl(G,L,R),P0.style?'Style: '+sent(P0.style):'',
      L.map((P,i)=>{const a=t;t+=P.dur;return '['+ts(a)+'-'+ts(t)+'] '+J(sent(CL(frm(P)+': '+sdA(P)+(P.scene&&(i===0||P.scene!==L[i-1].scene)?' in '+P.scene:''),P.move,P.lens,i===0?P.light:'')),P.dlg?(P.spk||cap1(theW(P)))+' says'+(P.tone?', '+P.tone:'')+': "'+P.dlg+'"':'',P.snd?SA(P,'Sound:'):'')}).join(' '),L.some(P=>P.dlg)?'Only one person speaks at a time.':'',moodS(P0))}},
  higgsfield:{one:(G,P)=>J('[UI: '+hfUI(P)+']',sent(J(P.subj,P.act)+(P.scene?' in '+P.scene:'')),P.dlg?saysT(P):'',P.snd?sent(P.snd):'',sent(P.style),moodS(P)),
    all:(G,L)=>L.map((P,i)=>'Shot '+(i+1)+' [UI: '+hfUI(P)+']: '+J(sent(J(P.subj,P.act)+(P.scene&&(i===0||P.scene!==L[i-1].scene)?' in '+P.scene:'')),P.dlg?saysT(P):'',P.snd?sent(P.snd):'')).join('\n')+(L[0].style?'\n'+sent(L[0].style):'')},
  runway:{one:(G,P)=>J(sent(CL(frm(P),P.move,P.lens)),sent(J(P.subj,P.act)+(P.scene?' in '+P.scene:'')),sent(CL(P.light,P.style)),moodS(P),P.dlg?cap1(theW(P))+' mouths the words "'+P.dlg+'".':'')},
  wan:{one:(G,P)=>J(sent(frm(P)+(P.scene?' of '+P.scene:'')),sent(J(P.subj,P.act)),sent(mv(P)),sent(P.light),sent(P.style),moodS(P),P.snd?SA(P,'Sound:'):'',P.dlg?saysT(P):'')},
  hailuo:{one:(G,P)=>J(sent(J(P.subj,P.act)+(P.scene?' in '+P.scene:'')),sent(CL(frm(P),P.move,P.lens)),sent(CL(P.light,P.style)),moodS(P),P.dlg?saysT(P):'',P.snd?SA(P,'Audio:'):'')},
  nanobanana:{img:1,one:(G,P)=>J(P.decl,sent(cap1(J(P.subj,P.act))+(P.scene?' in '+P.scene:'')),sent(CL(cap1(P.shot),P.angle,P.lens)),sent(CL(P.light,P.style,'cinematic film still',G.ar)))},
  midjourney:{img:1,one:(G,P)=>CL(cap1(J(P.subj,P.act))+(P.scene?' in '+P.scene:''),P.shot,P.angle==='eye-level'?'':P.angle,P.style,P.mood?P.mood+' mood':'',P.light,P.lens,'cinematic still')+' --ar '+mjAr(G.ar)+' --raw'},
  gptimage:{img:1,one:(G,P)=>J(P.decl,P.scene?'Scene: '+sent(CL(P.scene,P.light)):'',P.subj||P.act?'Subject: '+sent(J(P.subj,P.act)):'','Composition: '+sent(CL(P.shot,P.angle,P.lens)),P.style?'Style: '+sent(P.style):'','Use: start frame for a '+G.ar+' film shot, cinematic still.','Constraints: no text, no watermark.')},
  seedream:{img:1,one:(G,P)=>J(P.decl,sent(cap1(J(P.subj,P.act))+(P.scene?' in '+P.scene:'')),sent(CL(P.shot,P.angle,P.lens,P.light)),sent(CL(P.style,'cinematic still',G.ar)))},
  flux:{img:1,one:(G,P)=>J(sent(cap1(J(P.subj,P.act))+(P.scene?' in '+P.scene:'')),sent(CL(P.shot,P.angle,P.lens)),sent(CL(P.light,P.style,'cinematic film still')),'Aspect ratio '+G.ar+'.')}};
FMT.generic.oneD=(G,P)=>J(P.decl,FMT.generic.one(G,P));
const HF_MOVE={static:'Static',pan:'Pan',tilt:'Tilt up',pedestal:'Pedestal up',dolly:'Dolly in',pullout:'Dolly out',zoom:'Zoom in',crashzoom:'Crash zoom',dollyzoom:'Dolly zoom',tracking:'Tracking',leadingshot:'Leading shot',steadicam:'Gimbal follow',handheld:'Handheld',crane:'Crane up',orbit:'Orbit',drone:'Drone',fpv:'FPV',whip:'Whip pan',rack:'Rack focus'};
const hfUI=P=>CL(cap1(P.shot),P.lens||'',P.s&&HF_MOVE[P.s.move]?HF_MOVE[P.s.move]:'',P.light?cap1(P.light):'');
const GEN_HINT={generic:'Formato neutro para cualquier herramienta: un plano, una acción y una cámara por prompt, con la misma descripción del personaje en todos.',
  kling:'Kling 4.0: escena y luz, sonido, el sujeto con etiqueta [Nombre: descripción], el diálogo como [Nombre, tono]: "línea" y al final la cámara. Con varios planos, cada uno lleva "Shot n (Duration: n seconds)". Los elementos guardados se citan como [@Elemento].',
  flow:'Flow (Veo 3.1 u Omni): los bloques [00:00-00:04] cortan dentro de un mismo clip, SFX: marca los efectos y el diálogo va con says. Veo 3.1 dura 4, 6 u 8 s y Omni hasta 10 s: si la suma se pasa, generá cada plano aparte.',
  seedance:'Seedance 2.5: cada imagen de referencia que subas se cita como @Image1, @Image2… en el orden en que la subís. Un cambio principal por bloque de tiempo y, si hay diálogo, que hable una sola persona por vez.',
  higgsfield:'Higgsfield Cinema Studio 4.0: plano, lente, movimiento y luz se eligen en los controles. Lo que está entre [UI: …] es lo que tenés que marcar ahí; no lo pegues en el texto.',
  runway:'Runway Gen-4.5: un plano por prompt, con la cámara primero y la acción en secuencia. Es mudo: el diálogo queda como "mouths the words" y el sonido se hace aparte.',
  wan:'Wan 3.0: un párrafo por plano, de la escena a la cámara, con Sound: para el ambiente y el diálogo con says.',hailuo:'Hailuo / MiniMax H3: un plano por prompt de 4 a 15 s, con Audio: para diálogo y efectos.',
  nanobanana:'Nano Banana: oraciones completas, no listas. Para el plano siguiente conviene editar el frame anterior y decir qué se mantiene igual.',midjourney:'Midjourney V8.2: frases naturales con los parámetros al final. Para fijar el estilo del proyecto sumá --sref con tu código y --sw.',
  gptimage:'GPT Image: bloques cortos con etiqueta (Scene, Subject, Composition, Use, Constraints).',seedream:'Seedream 5.0: de 30 a 80 palabras por imagen, con posiciones y luz concretas.',flux:'FLUX: lenguaje natural, del sujeto al encuadre.'};
function syntaxNote(tool){return GEN_HINT[tool]||''}
/* cómo subir las referencias en cada herramienta */
const REF_HOW={kling:'En Kling guardá cada ficha como elemento con ese mismo nombre; el prompt los cita como [@Nombre].',seedance:'En Seedance subí las imágenes en este orden: el prompt las cita como @Image1, @Image2…',
  runway:'En Runway subí cada ficha como referencia y nombrala igual que en el prompt (@Nombre).',higgsfield:'En Higgsfield creá el personaje con ese nombre; el prompt lo cita con @nombre.',
  flow:'En Flow subí las fichas como ingredientes (referencias) del plano; la descripción va completa en el texto.',generic:'Subí las imágenes en este orden: el prompt las nombra Image 1, Image 2…',
  nanobanana:'En Nano Banana subí las imágenes en este orden: el prompt las nombra Image 1, Image 2…',gptimage:'En ChatGPT subí las imágenes en este orden: el prompt las nombra Image 1, Image 2…',seedream:'En Seedream subí las imágenes en este orden: el prompt las nombra Image 1, Image 2…',
  midjourney:'Midjourney no las cita en el texto: usá la referencia de personaje o de estilo en la interfaz.',wan:'Wan: subí la ficha como imagen inicial o de referencia; la descripción va completa en el texto.',hailuo:'Hailuo: subí la ficha como referencia de sujeto; la descripción va completa en el texto.',flux:'FLUX: usá la ficha como imagen de referencia; la descripción va completa en el texto.'};

/* lectura en español de cada prompt */
const lower=s=>String(s||'').charAt(0).toLowerCase()+String(s||'').slice(1);
function lect(G,s,i){const c1=castAt(G,s.who),c2=s.with!==s.who?castAt(G,s.with):null,cs=[c1,c2].filter(Boolean),L=locAt(G,s.where),lt=s.light||G.light;
  return ['Plano '+(i+1)+': '+gvLabel('shot',s.shot)+' · '+Math.max(1,+s.dur||4)+' s',
    'Cámara: '+[s.angle&&s.angle!=='eye'?'ángulo '+lower(gvLabel('angle',s.angle)):'a la altura de los ojos',lower(gvLabel('move',s.move)),s.lens?'lente '+LENS_ES[s.lens]:''].filter(Boolean).join(', '),
    cs.length?'Quién: '+cs.map(e=>(trimEnd(e.n)||'Personaje')+' ('+trimEnd(e.d)+')'+(e.ref?', con imagen de referencia':'')).join(' y '):'Sin personajes en cuadro',
    s.action?'Acción: '+trimEnd(s.action):'',L?'Dónde: '+(trimEnd(L.n)||'Lugar')+' ('+trimEnd(L.d)+')':'',lt?'Luz: '+lower(gvLabel('light',lt)):'',G.style&&SBY[G.style]?'Estilo: '+SBY[G.style].n:'',
    G.mood?'Ánimo: '+trimEnd(G.mood):'',s.sound?'Sonido: '+trimEnd(s.sound):'',s.dialogue?'Diálogo: '+String(s.dialogue).trim():''].filter(Boolean).join('\n')}
const lectNote='(Lo que dice el prompt, explicado en español con tus propias palabras. Para pegar en la herramienta usá la pestaña en inglés.)';

/* sugerencias de plano siguiente, con la gramática clásica de cobertura */
const SG={
  est:[['medium','Presentá al personaje','Ya se sabe dónde estamos: ahora mostrá quién está.',{lens:'50'}],['full','La acción completa','El cuerpo entero haciendo algo, todavía con el lugar alrededor.',{}],['insert','Un detalle del lugar','Un objeto que cuente algo del lugar o de la historia.',{lens:'macro',who:-1}]],
  wide:[['medium','Acercate','Después del general, el paso natural es acercarse al personaje.',{lens:'50'}],['closeup','Saltá a la emoción','Un salto grande de tamaño marca un momento importante.',{lens:'85',move:'dolly'}],['insert','El objeto clave','Lo que el personaje mira o toca.',{lens:'macro'}]],
  full:[['medium','Más cerca','Plano medio para ver gestos y manos.',{lens:'50'}],['closeup','La emoción','La cara cuenta lo que siente.',{lens:'85'}],['ots','Sobre el hombro','Si hay alguien enfrente, mostralo por encima del hombro del otro.',{lens:'50',both:1}]],
  medium:[['closeup','La emoción','El momento importante se cuenta en la cara.',{lens:'85',move:'dolly'}],['ots','Contraplano','En un diálogo, alterná el punto de vista sobre el hombro.',{lens:'50',both:1,swap:1}],['insert','Lo que mira o toca','Un inserto del objeto que importa.',{lens:'macro'}]],
  closeup:[['closeup','La reacción','Primer plano del otro personaje: cómo recibe lo que pasó.',{lens:'85',other:1}],['pov','Lo que ve','La cámara toma su mirada.',{}],['wide','Respirar','Volvé al general para ubicar después de un momento intenso.',{lens:'24',move:'pullout'}]],
  ecu:[['closeup','Abrí un poco','Del detalle a la cara completa.',{lens:'85'}],['wide','Cerrar la escena','Abrí al general para terminar.',{move:'pullout'}]],
  ots:[['ots','El otro lado','Contraplano sobre el otro hombro; cada uno queda siempre del mismo lado de la pantalla.',{lens:'50',both:1,swap:1}],['closeup','El que escucha','La reacción suele contar más que quien habla.',{lens:'85',other:1}],['twoshot','Los dos','Los dos en cuadro para mostrar la relación.',{both:1}]],
  twoshot:[['ots','Sobre el hombro','Entrá al diálogo por encima del hombro de uno.',{lens:'50',both:1}],['closeup','El que habla','Primer plano de quien tiene el momento.',{lens:'85'}],['wide','Volver al general','Para cerrar o cambiar de momento.',{}]],
  insert:[['closeup','La reacción al objeto','Primer plano de quien lo mira.',{lens:'85'}],['medium','Volver a la acción','Seguí la escena en plano medio.',{}]],
  pov:[['closeup','Quién mira','El primer plano de quien mira cierra el subjetivo.',{lens:'85'}],['insert','Más cerca de lo que ve','Un inserto del objeto que está mirando.',{lens:'macro'}]]};
const SGK={ews:'est',establishing:'est',wide:'wide',full:'full',cowboy:'full',medium:'medium',mcu:'medium',closeup:'closeup',ecu:'ecu',insert:'insert',twoshot:'twoshot',ots:'ots',pov:'pov'};
function suggestions(G){const l=G.shots[G.shots.length-1];if(!l)return [];const live=G.cast.map((c,i)=>entOk(c)?i:-1).filter(i=>i>=0);
  const other=w=>live.find(i=>i!==w);return (SG[SGK[l.shot]]||SG.medium).map(([shot,t,why,o])=>{const s={shot,angle:'eye',move:o.move||'static',lens:o.lens||'',where:l.where,dur:shot==='closeup'||shot==='insert'||shot==='ecu'?3:4};
    let w=l.who>=0?l.who:(live[0]!=null?live[0]:-1);if(o.who===-1)w=-1;if(o.other&&other(w)!=null)w=other(w);if(o.swap&&l.with>=0){s.who=l.with;s.with=l.who}else{s.who=w;s.with=o.both&&other(w)!=null?other(w):-1}
    if((o.other||o.swap||o.both)&&live.length<2&&shot!=='closeup'&&o.both)return null;return {t,why,s,term:shot}}).filter(Boolean)}
function suggHTML(){const L=suggestions(GS),two=GS.cast.filter(entOk).length>1;if(!L.length)return '';
  return '<div class="sugg"><span class="lbl">¿Qué plano sigue?</span><div class="sg-row">'+L.map((x,i)=>'<button type="button" class="sg" data-sg="'+i+'"><b>'+esc(gvLabel('shot',x.s.shot))+' · '+esc(x.t)+'</b><span>'+esc(x.why)+'</span></button>').join('')+'</div>'+
    '<p class="g-note">'+(two?'Regla de los 180°: dejá a cada personaje siempre del mismo lado de la pantalla. ':'')+'Entre dos planos seguidos del mismo personaje, cambiá el tamaño o el ángulo para que el corte no salte. Para ideas más libres, usá el prompt para un LLM de la derecha'+(sampleFn?' o "Proponer planos con Claude"':'')+'.</p></div>'}

/* formulario */
const gForm=$('#gen-form'),gShots=$('#g-shots'),gRes=$('#g-result');
const opt=(v,t,sel)=>'<option value="'+esc(v)+'"'+(String(v)===String(sel)?' selected':'')+'>'+esc(t)+'</option>';
const gvOpts=(k,sel)=>GV[k].map(x=>opt(x[0],x[0]===''?'Sin indicar':gvLabel(k,x[0]),sel)).join('');
const castOpts=(sel,none)=>opt(-1,none,sel)+GS.cast.map((c,i)=>opt(i,trimEnd(c.n)||('Personaje '+(i+1)),sel)).join('');
const locOpts=sel=>opt(-1,'Sin lugar',sel)+GS.locs.map((l,i)=>opt(i,trimEnd(l.n)||('Lugar '+(i+1)),sel)).join('');
const enh=k=>'<small class="enh" data-enh="'+k+'"></small>';
function entRow(e,i,kind){const isC=kind==='c';return '<div class="ent" data-'+kind+'="'+i+'">'+(e.img&&REALIMG.has(e.img)?'<img class="ent-img" src="img/'+esc(e.img)+'.webp" alt="Ficha de '+esc(e.n||'')+'" loading="lazy">':'')+
  '<div class="ent-b"><div class="fld2"><label class="fld"><span>'+(isC?'Nombre':'Nombre del lugar')+'</span><input data-ek="n" value="'+esc(e.n)+'" placeholder="'+(isC?'Ana':'Parque')+'"></label>'+
  '<label class="chk"><input type="checkbox" data-ek="ref"'+(e.ref?' checked':'')+'> Tengo imagen de referencia</label></div>'+
  '<label class="fld"><span>'+(isC?'Cómo se ve: edad, pelo, ropa y colores':'Cómo es el lugar')+'</span><textarea rows="2" data-ek="d" placeholder="'+(isC?'mujer de unos 30 años, pelo negro corto, chaqueta roja, pantalón negro':'parque pequeño con pinos altos, un camino de grava y un farol negro antiguo')+'">'+esc(e.d)+'</textarea></label>'+enh('d')+
  ((isC?GS.cast:GS.locs).length>1?'<button type="button" class="linkbtn" data-delent>Quitar</button>':'')+'</div></div>'}
function shotRow(s,i){return '<div class="shot" data-i="'+i+'"><div class="shot-h"><b>Plano '+(i+1)+'</b><label class="dur">Duración <input type="number" min="1" max="30" step="1" data-k="dur" value="'+esc(s.dur)+'"> s</label>'+(GS.shots.length>1?'<button type="button" class="linkbtn" data-del>Quitar</button>':'')+'</div>'+
  '<div class="fld4"><label class="fld"><span>Plano</span><select data-k="shot">'+gvOpts('shot',s.shot)+'</select></label><label class="fld"><span>Ángulo</span><select data-k="angle">'+gvOpts('angle',s.angle)+'</select></label>'+
  '<label class="fld"><span>Movimiento</span><select data-k="move">'+gvOpts('move',s.move)+'</select></label><label class="fld"><span>Lente</span><select data-k="lens">'+gvOpts('lens',s.lens)+'</select></label></div>'+
  '<div class="fld4 who"><label class="fld"><span>Quién</span><select data-k="who">'+castOpts(s.who,'Nadie')+'</select></label><label class="fld"><span>Con</span><select data-k="with">'+castOpts(s.with,'Solo')+'</select></label><label class="fld"><span>Dónde</span><select data-k="where">'+locOpts(s.where)+'</select></label></div>'+
  '<label class="fld"><span>Acción (en español o inglés)</span><input data-k="action" value="'+esc(s.action)+'" placeholder="mira hacia arriba cuando se enciende el farol"></label>'+enh('action')+
  '<div class="fld2"><label class="fld"><span>Diálogo · tono opcional entre paréntesis</span><input data-k="dialogue" value="'+esc(s.dialogue)+'" placeholder="(en voz baja) Siempre llegás tarde."></label><label class="fld"><span>Sonido</span><input data-k="sound" value="'+esc(s.sound)+'" placeholder="zumbido eléctrico, grillos"></label></div>'+enh('sound')+'</div>'}
function drawCast(){$('#g-cast').innerHTML=GS.cast.map((e,i)=>entRow(e,i,'c')).join('');$('#g-locs').innerHTML=GS.locs.map((e,i)=>entRow(e,i,'l')).join('')}
function drawShots(){gShots.innerHTML=GS.shots.map(shotRow).join('')+suggHTML()}
function fillForm(){$('#g-idea').value=GS.idea;$('#g-mood').value=GS.mood;
  $('#g-light').innerHTML=gvOpts('light',GS.light);$('#g-ar').innerHTML=ARS.map(a=>opt(a[0],a[1],GS.ar)).join('');
  $('#g-style').innerHTML=opt('','Sin estilo',GS.style)+STYLE_GROUPS.map(g=>{const L=STYLES.filter(s=>s.g===g[0]);return L.length?'<optgroup label="'+esc(g[1])+'">'+L.map(s=>opt(s.id,s.n,GS.style)).join('')+'</optgroup>':''}).join('');
  $('#g-tool').innerHTML='<optgroup label="Video">'+GEN_VIDEO.map(k=>opt(k,toolLabel(k),GS.tool)).join('')+'</optgroup><optgroup label="Imagen para el frame inicial">'+GEN_IMG.map(k=>opt(k,toolLabel(k),GS.tool)).join('')+'</optgroup>';drawCast();drawShots()}
/* textos libres que pasan al prompt (se traducen si están en español) */
function freeTexts(){const L=[];GS.cast.concat(GS.locs).forEach(e=>L.push(e.d));L.push(GS.mood);GS.shots.forEach(s=>{L.push(s.action,s.sound);const t=(String(s.dialogue||'').match(/^\(([^)]*)\)/)||[])[1];if(t)L.push(t)});return L.map(x=>String(x||'').trim()).filter(x=>x&&isES(x))}
/* las acciones se traducen como "La persona …" para que salgan en tercera persona y no como orden */
function trItems(){const L=[];GS.cast.concat(GS.locs).forEach(e=>L.push([e.d,0]));L.push([GS.mood,0]);GS.shots.forEach(s=>{L.push([s.action,1],[s.sound,0]);const t=(String(s.dialogue||'').match(/^\(([^)]*)\)/)||[])[1];if(t)L.push([t,0])});
  const seen=new Set();return L.map(([x,a])=>[String(x||'').trim(),a]).filter(([x])=>x&&isES(x)&&!TRC[trKey('es','en',x)]&&!seen.has(x)&&seen.add(x))}
async function trFields(localOnly){const L=trItems();if(!L.length)return {missing:[],via:''};const qs=L.map(([x,a])=>a?'La persona '+x.charAt(0).toLowerCase()+x.slice(1):x);
  const r=await translate(qs,'es','en',localOnly),missing=[];L.forEach(([x,a],i)=>{let v=r.res[i];if(v){if(a)v=v.replace(/^(the|a|this)\s+person\s+/i,'');TRC[trKey('es','en',x)]=v}else missing.push(x)});saveTRC();return {missing,via:r.via}}
function updHints(){const put=(el,v)=>{if(!el)return;const t=String(v||'').trim(),tr=isES(t)?TRC[trKey('es','en',t)]:'';el.textContent=tr?'En inglés: '+tr:'';el.hidden=!tr};
  $('#g-cast').querySelectorAll('.ent').forEach(r=>put(r.querySelector('[data-enh="d"]'),(GS.cast[+r.dataset.c]||{}).d));$('#g-locs').querySelectorAll('.ent').forEach(r=>put(r.querySelector('[data-enh="d"]'),(GS.locs[+r.dataset.l]||{}).d));
  gShots.querySelectorAll('.shot').forEach(r=>{const s=GS.shots[+r.dataset.i]||{};put(r.querySelector('[data-enh="action"]'),s.action);put(r.querySelector('[data-enh="sound"]'),s.sound)});
  const m=$('#g-mood-en');if(m)put(m,GS.mood)}
function metaPrompt(G){const sy=typeof SYNTAX!=='undefined'&&SYNTAX[G.tool],st=G.style&&SBY[G.style]?SBY[G.style].block:'',img=FMT[G.tool]&&FMT[G.tool].img,cs=G.cast.filter(entOk),ls=G.locs.filter(entOk);
  return J('You are a film director and an expert prompt writer for '+toolLabel(G.tool)+'.','Turn the idea below into a shot list of '+(G.shots.length>1?G.shots.length+' shots':'3 to 5 shots')+' for a '+tot(G)+'-second video, aspect ratio '+G.ar+'.',
    'Idea: '+(G.idea||'[tu idea]'),cs.length?'Characters, keep each description identical in every shot where they appear: '+cs.map(c=>entName(c)+': '+trimEnd(EN(c.d))).join('; ')+'.':'',ls.length?'Locations: '+ls.map(l=>entName(l,1)+': '+trimEnd(EN(l.d))).join('; ')+'.':'',
    st?'Visual style, paste it unchanged at the end of every prompt: '+sent(st):'',
    'For each shot give: shot size, camera angle, camera movement, lens, who is in frame, action, dialogue if any, sound and duration. Cover the scene like a film: establish the place, move closer, and add a reaction or an insert when it helps the cut. Keep screen direction consistent (180-degree rule).',
    img?'Then write one image prompt per shot to generate its start frame.':'Then write the final video prompt for each shot.',
    sy?'Follow this tool syntax. Order: '+(sy.order||[]).join(', ')+'.'+(sy.dialogue?' Dialogue: '+sy.dialogue+'.':'')+(sy.multishot?' Several shots in one prompt: '+sy.multishot+'.':'')+(sy.refs?' References: '+sy.refs+'.':'')+(sy.negative?' Negatives: '+sy.negative+'.':''):'',
    'Write the prompts in English even if the idea is in Spanish, keep dialogue in its original language, and use positive phrasing: describe what should be on screen, not what should not.')}
function metaPromptES(G){const st=G.style&&SBY[G.style]?SBY[G.style]:null,img=FMT[G.tool]&&FMT[G.tool].img,cs=G.cast.filter(entOk),ls=G.locs.filter(entOk);
  return ['Sos director de cine y experto en escribir prompts para '+toolLabel(G.tool)+'.','Convertí la idea de abajo en una lista de '+(G.shots.length>1?G.shots.length+' planos':'3 a 5 planos')+' para un video de '+tot(G)+' segundos, formato '+G.ar+'.',
    'Idea: '+(G.idea||'[tu idea]'),cs.length?'Personajes (la descripción va idéntica en cada plano donde aparecen): '+cs.map(c=>entName(c)+': '+trimEnd(c.d)).join('; ')+'.':'',ls.length?'Lugares: '+ls.map(l=>entName(l,1)+': '+trimEnd(l.d)).join('; ')+'.':'',
    st?'Estilo visual ('+st.n+'): pegalo sin cambios al final de cada prompt.':'',
    'Para cada plano indicá: tamaño, ángulo, movimiento de cámara, lente, quién está en cuadro, acción, diálogo si hay, sonido y duración. Cubrí la escena como en el cine: ubicá el lugar, acercate y sumá una reacción o un inserto cuando ayude al corte. Mantené la dirección en pantalla (regla de los 180°).',
    img?'Después escribí un prompt de imagen por plano para generar su frame inicial.':'Después escribí el prompt final de video de cada plano.','Seguí la sintaxis de la herramienta (orden, diálogo, varios planos, referencias).',
    'Escribí los prompts en inglés aunque la idea esté en español, dejá los diálogos en su idioma original y describí en positivo lo que se ve, no lo que no se ve.'].filter(Boolean).join(' ')}
function bibleTxt(G,es){const L=[];G.cast.forEach(c=>{if(entOk(c))L.push((es?'Personaje · ':'Character · ')+entName(c)+': '+trimEnd(es?c.d:EN(c.d))+'.')});G.locs.forEach(l=>{if(entOk(l))L.push((es?'Lugar · ':'Location · ')+entName(l,1)+': '+trimEnd(es?l.d:EN(l.d))+'.')});
  if(G.style&&SBY[G.style])L.push((es?'Estilo · ':'Style · ')+SBY[G.style].n+': '+(es?(ES[SBY[G.style].block]||SBY[G.style].block):SBY[G.style].block));return L.join('\n')}
function renderGen(){const tool=GS.tool,F=FMT[tool]||FMT.generic,R=refList(GS),L=GS.shots.map(s=>parts(GS,s,R)),img=!!F.img,one=tool==='generic'?F.oneD:F.one;let h='';
  const pend=freeTexts().filter(x=>!TRC[trKey('es','en',x)]);
  if(pend.length)h+='<div class="trbar"><p><b>Hay texto en español.</b> Las herramientas de video entienden mejor el inglés: traducilo antes de copiar.</p><button type="button" class="btn primary" id="g-tr">Traducir al inglés</button><span class="g-note" id="g-tr-st"></span></div>';
  if(R.length)h+='<div class="refs-note"><span class="lbl">Imágenes de referencia</span><p>'+R.map((e,k)=>esc((k+1)+'. '+(trimEnd(e.n)||'Sin nombre'))).join(' · ')+'</p><p class="g-note">'+esc(REF_HOW[tool]||'')+' <a href="#p-referencias" data-r="p-referencias">Cómo combinar referencias →</a></p></div>';
  if(!img&&F.all&&L.length>1)h+='<div class="gblock">'+codeBlock('Todo en un prompt · '+L.length+' planos · '+tot(GS)+' s',(tool==='generic'?J(uniqDecl(GS,L,R),F.all(GS,L,R)):F.all(GS,L,R)),lectNote+'\n\n'+GS.shots.map((s,i)=>lect(GS,s,i)).join('\n\n'))+'</div>';
  h+=L.map((P,i)=>{const s=GS.shots[i];return '<div class="gshot"><span class="thumb" data-thumb="'+s.shot+'"></span><div class="gshot-b">'+codeBlock((img?'Frame inicial · plano ':'Plano ')+(i+1)+' · '+gvLabel('shot',s.shot)+(img?'':' · '+P.dur+' s'),one(GS,P,i),lect(GS,s,i))+
    '</div></div>'}).join('');
  if(!GS.shots.some(s=>s.action))h='<p class="g-note">Escribí la acción de al menos un plano o cargá una plantilla.</p>'+h;
  const bib=bibleTxt(GS,false);if(bib)h+='<details class="llm bible"><summary>Fichas del proyecto</summary><p class="g-note">Las mismas descripciones para pegar en cualquier herramienta, en un LLM o en tu guía de estilo.</p>'+bibox(bib,bibleTxt(GS,true))+'</details>';
  gRes.innerHTML=h;queueThumbs(gRes);$('#g-hint').textContent=syntaxNote(tool);$('#g-llmbox').innerHTML=bibox(metaPrompt(GS),metaPromptES(GS));updHints();saveGen()}
let saveT=0;function saveGen(){clearTimeout(saveT);saveT=setTimeout(()=>{try{store.set('gen',JSON.stringify(GS))}catch(e){}},400)}
function loadSaved(){try{const o=JSON.parse(store.get('gen')||'null');if(!o||!Array.isArray(o.shots)||!Array.isArray(o.cast)||!Array.isArray(o.locs)||!o.shots.length)return false;
  Object.assign(GS,{idea:String(o.idea||''),cast:o.cast.slice(0,8).map(e=>newEnt({n:String(e.n||''),d:String(e.d||''),ref:!!e.ref,img:String(e.img||'')})),locs:o.locs.slice(0,8).map(e=>newEnt({n:String(e.n||''),d:String(e.d||''),ref:!!e.ref,img:String(e.img||'')})),
    light:pick('light',o.light,''),mood:String(o.mood||''),style:SBY[o.style]?o.style:'',ar:ARS.some(a=>a[0]===o.ar)?o.ar:'16:9',
    shots:o.shots.slice(0,20).map(s=>newShot({shot:pick('shot',s.shot,'medium'),angle:pick('angle',s.angle,'eye'),move:pick('move',s.move,'static'),lens:pick('lens',String(s.lens||''),''),action:String(s.action||''),dialogue:String(s.dialogue||''),sound:String(s.sound||''),dur:Math.max(1,Math.min(30,+s.dur||4)),who:+s.who|0,with:s.with==null?-1:+s.with|0,where:s.where==null?0:+s.where|0}))});
  if(o.tool&&GEN_ALL.includes(o.tool))GS.tool=o.tool;return true}catch(e){return false}}
gForm.addEventListener('input',e=>{const el=e.target,row=el.closest('.shot'),ent=el.closest('.ent');
  if(row){const s=GS.shots[+row.dataset.i],k=el.dataset.k;if(!s||!k)return;s[k]=k==='dur'?Math.max(1,Math.min(30,+el.value||4)):['who','with','where'].includes(k)?+el.value:el.value}
  else if(ent){const isC=ent.dataset.c!=null,arr=isC?GS.cast:GS.locs,e2=arr[+(isC?ent.dataset.c:ent.dataset.l)],k=el.dataset.ek;if(!e2||!k)return;e2[k]=k==='ref'?el.checked:el.value;
    if(k==='n')gShots.querySelectorAll('select[data-k="'+(isC?'who':'where')+'"],'+(isC?'select[data-k="with"]':'x')).forEach(sel=>{const v=sel.value;sel.innerHTML=isC?castOpts(v,sel.dataset.k==='who'?'Nadie':'Solo'):locOpts(v)})}
  else{const m={'g-idea':'idea','g-mood':'mood','g-light':'light','g-style':'style','g-ar':'ar'}[el.id];if(m)GS[m]=el.value}
  renderGen();if(row&&['shot','who','with'].includes(el.dataset.k)){const sg=gShots.querySelector('.sugg');if(sg)sg.outerHTML=suggHTML()||''}});
gForm.addEventListener('submit',e=>e.preventDefault());
/* al salir de un campo en español se traduce solo con el traductor del navegador o con Claude; MyMemory (servicio externo) solo con el botón */
let autoBusy=false;gForm.addEventListener('change',async e=>{if(autoBusy||!e.target.matches('textarea[data-ek="d"],input[data-k="action"],input[data-k="sound"],#g-mood'))return;
  if(!trItems().length)return;autoBusy=true;try{const r=await trFields(true);if(r.via)renderGen()}catch(err){}finally{autoBusy=false}});
gForm.addEventListener('click',e=>{const d=e.target.closest('[data-del]'),de=e.target.closest('[data-delent]'),sg=e.target.closest('[data-sg]');
  if(d){GS.shots.splice(+d.closest('.shot').dataset.i,1);drawShots();renderGen()}
  else if(de){const r=de.closest('.ent'),isC=r.dataset.c!=null,i=+(isC?r.dataset.c:r.dataset.l),arr=isC?GS.cast:GS.locs;arr.splice(i,1);
    GS.shots.forEach(s=>{const fix=k=>{if(s[k]===i)s[k]=k==='where'?0:-1;else if(s[k]>i)s[k]--};if(isC){fix('who');fix('with')}else fix('where')});drawCast();drawShots();renderGen()}
  else if(sg){const x=suggestions(GS)[+sg.dataset.sg];if(!x)return;GS.shots.push(newShot(x.s));drawShots();renderGen();const rows=gShots.querySelectorAll('.shot');const last=rows[rows.length-1];if(last){last.scrollIntoView({block:'nearest'});const a=last.querySelector('[data-k="action"]');if(a)a.focus({preventScroll:true})}}});
$('#g-add').addEventListener('click',()=>{const l=GS.shots[GS.shots.length-1];GS.shots.push(newShot({shot:l&&l.shot==='wide'?'closeup':'medium',angle:'eye',move:'static',who:l?l.who:0,with:l?l.with:-1,where:l?l.where:0}));drawShots();renderGen()});
$('#g-addcast').addEventListener('click',()=>{if(GS.cast.length>=8)return;GS.cast.push(newEnt());drawCast();drawShots();renderGen();const r=$('#g-cast').lastElementChild;if(r)r.querySelector('input').focus()});
$('#g-addloc').addEventListener('click',()=>{if(GS.locs.length>=8)return;GS.locs.push(newEnt());drawCast();drawShots();renderGen();const r=$('#g-locs').lastElementChild;if(r)r.querySelector('input').focus()});
$('#g-tool').addEventListener('change',e=>{GS.tool=e.target.value;setPref(GS.tool);renderGen()});
$('#gen-presets').innerHTML=PRESETS.map((p,i)=>'<button type="button" class="go" data-p="'+i+'">'+esc(p.n)+'</button>').join('')+'<button type="button" class="go" data-p="clear">Proyecto nuevo</button>';
$('#gen-presets').addEventListener('click',e=>{const b=e.target.closest('[data-p]');if(!b)return;const k=b.dataset.p;
  if(k==='clear')Object.assign(GS,{idea:'',cast:[newEnt()],locs:[newEnt()],light:'',mood:'',style:'',shots:[newShot()]});else loadPreset(PRESETS[+k]);
  fillForm();renderGen()});
gRes.addEventListener('click',async e=>{const b=e.target.closest('#g-tr');if(!b)return;const st=$('#g-tr-st');b.disabled=true;st.textContent='Traduciendo…';
  try{const r=await trFields(false);if(r.missing.length){const u='https://translate.google.com/?sl=es&tl=en&op=translate&text='+encodeURIComponent(r.missing.join('\n'));
      st.innerHTML='No se pudo traducir todo desde acá. <a href="'+u+'" target="_blank" rel="noopener">Abrilo en el Traductor de Google</a> y pegá el resultado en los campos.';b.disabled=false;renderGen()}
    else{renderGen();const s2=$('#g-tr-st');if(s2)s2.textContent='Traducido con '+r.via+'.'}}catch(err){st.textContent='No se pudo traducir. Probá de nuevo.';b.disabled=false}});
$('#g-copyall').addEventListener('click',e=>{const t=[...gRes.querySelectorAll('.gblock code.en, .gshot code.en')].map(c=>c.textContent).join('\n\n');const b=e.currentTarget;try{navigator.clipboard.writeText(t).then(()=>{b.textContent='Copiado';setTimeout(()=>b.textContent='Copiar todo',1400)},()=>{})}catch(err){}});
$('#g-jump').addEventListener('click',()=>$('#gen-out').scrollIntoView({block:'start'}));
let genBuilt=false;if(!loadSaved())loadPreset(PRESETS[0]);
function showGen(){pageMode('gen');if(!genBuilt){genBuilt=true;fillForm()}else{$('#g-tool').value=GS.tool;$('#g-style').value=GS.style}renderGen();document.title='Generador · Plano a Plano'}

/* proponer planos con Claude, solo dentro de un visor de Claude */
let sampleFn=null,aiCtl=null;
const AI_ERR={rate_limited:'Demasiadas solicitudes seguidas. Probá de nuevo en un rato.',invalid_json:'La respuesta no vino en el formato esperado. Probá de nuevo.',refused:'Claude no respondió a esa idea. Cambiá la idea y probá otra vez.',
  session_expired:'Tenés que volver a iniciar sesión en Claude.',empty_completion:'No llegó respuesta. Probá con una idea más concreta.',prompt_too_large:'La idea es demasiado larga. Resumila.'};
const AI_HIDE=['not_granted','sampling_disabled','not_declared','capability_disabled','capability_removed'];
function aiPrompt(){const ids=k=>GV[k].map(x=>x[0]).filter(Boolean).join(', ');const n=GS.shots.length>1?GS.shots.length:0;
  return ['You turn a short video idea into a shot list for an AI video generator. Reply with only one JSON object and no other text, shaped like:',
    '{"subject":"...","setting":"...","light":"bluehour","mood":"...","shots":[{"shot":"wide","angle":"eye","move":"static","lens":"","action":"...","dialogue":"","sound":"...","dur":4}]}',
    'Rules:','- subject: one English description of the main character (age, clothing and colors) that will be repeated unchanged in every shot.'+(entOk(GS.cast[0])?' Use this one: '+EN(GS.cast[0].d):''),
    '- setting: one English description of the location.'+(entOk(GS.locs[0])?' Use this one: '+EN(GS.locs[0].d):''),'- light: one of: '+ids('light')+'.','- mood: two or three English words.',
    '- shot: one of: '+ids('shot')+'. angle: one of: '+ids('angle')+'. move: one of: '+ids('move')+'. lens: "" or one of: '+ids('lens')+'.',
    '- action and sound: English, present tense, one clear filmable action per shot.','- dialogue: short, in the language the idea is written in, or "" when nobody speaks.',
    '- dur: seconds per shot, between 3 and 10.',n?'- Use exactly '+n+' shots.':'- Use 3 to 5 shots.',
    '- Cover the scene like a film: establish the place, move closer, and include a reaction or an insert when it helps the cut.',
    GS.style&&SBY[GS.style]?'- The visual style is: '+SBY[GS.style].n+'. Choose shots and moves that suit it.':'',
    'Idea: """'+String(GS.idea).slice(0,3000)+'"""'].filter(Boolean).join('\n')}
function applyAI(o){if(!o||typeof o!=='object'||!Array.isArray(o.shots)||!o.shots.length)throw {code:'invalid_json'};
  if(o.subject){if(!GS.cast.length)GS.cast.push(newEnt());GS.cast[0].d=String(o.subject)}if(o.setting){if(!GS.locs.length)GS.locs.push(newEnt());GS.locs[0].d=String(o.setting)}GS.light=pick('light',o.light,GS.light);if(o.mood)GS.mood=String(o.mood);
  GS.shots=o.shots.slice(0,10).map(s=>newShot({shot:pick('shot',s.shot,'medium'),angle:pick('angle',s.angle,'eye'),move:pick('move',s.move,'static'),lens:pick('lens',String(s.lens||''),''),action:String(s.action||''),dialogue:String(s.dialogue||''),sound:String(s.sound||''),dur:Math.max(1,Math.min(15,Math.round(+s.dur||4))),who:0,where:0}));
  fillForm();renderGen()}
async function runAI(){const st=$('#g-ai-status'),b=$('#g-ai'),stop=$('#g-ai-stop');if(!GS.idea.trim()){st.textContent='Escribí primero la idea.';$('#g-idea').focus();return}
  aiCtl=new AbortController();b.disabled=true;stop.hidden=false;st.textContent='Pensando…';
  try{const o=await sampleFn.json(aiPrompt(),{signal:aiCtl.signal,onText:()=>{st.textContent='Escribiendo los planos…'}});applyAI(o);st.textContent='Listo. Revisá los planos y ajustá lo que quieras.'}
  catch(e){const c=e&&e.code;if(AI_HIDE.includes(c)){$('#gen-ai').hidden=true;sampleFn=null}st.textContent=c==='cancelled'?'Detenido.':(AI_ERR[c]||'No se pudo completar. Probá de nuevo.')}
  finally{b.disabled=false;stop.hidden=true;aiCtl=null}}
$('#g-ai').addEventListener('click',()=>{if(sampleFn)runAI()});$('#g-ai-stop').addEventListener('click',()=>{if(aiCtl)aiCtl.abort()});
try{if(window.claude&&typeof window.claude.use==='function')window.claude.use('sample').then(s=>{if(s){sampleFn=s;$('#gen-ai').hidden=false}}).catch(()=>{})}catch(e){}

/* ---------- rutas ---------- */
function route0(h){h=(h||'').replace(/^#/,'')||'inicio';curRoute=h;
  if(h==='inicio')showHome();else if(h==='empezar')showStart();else if(/^empezar-\d+$/.test(h))showStart(+h.slice(8));else if(h==='glosario')showGloss();else if(h.indexOf('c-')===0&&CATN[h.slice(2)])showCat(h.slice(2));
  else if(h==='laboratorio'||h==='manual')showLab();
  else if(h==='produccion'||h==='guia')showProdIndex();else if(h.indexOf('pc-')===0&&PCHB[h.slice(3)]){const f=PROD.find(p=>p.ch===h.slice(3));curRoute='p-'+f.id;showProd(f.id)}else if(h.indexOf('p-')===0&&PBY[h.slice(2)])showProd(h.slice(2));
  else if(h.indexOf('guia-')===0){const id=h.slice(5);if(PBY[id])showProd(id);else if(TBY[id])showTool(id);else showProdIndex()}
  else if(h==='herramientas')showToolsIndex();else if(h.indexOf('h-')===0&&TBY[h.slice(2)])showTool(h.slice(2));else if(h.indexOf('f-')===0&&FEATS[h.slice(2)])showFeat(h.slice(2));
  else if(h==='estilos')showStylesIndex();else if(h.indexOf('e-')===0&&SBY[h.slice(2)])showStyle(h.slice(2));
  else if(h==='generador')showGen();else if(byId[h]&&CATN[byId[h].cat])showTerm(h);else showHome()}
function route(h){route0(h);updBack()}
/* historial: atrás del navegador, botón Volver y posición de scroll. Si el navegador no deja escribir el historial (algunos visores), se usa una pila propia */
let pushOK=true;const NAV=[];
try{history.replaceState(Object.assign({},history.state,{d:0}),'')}catch(e){pushOK=false}
function saveY(){try{history.replaceState(Object.assign({},history.state,{y:window.scrollY}),'')}catch(e){}}
function go(h,keepScroll,replace){
  if(replace){try{history.replaceState({d:(history.state&&history.state.d)||0},'','#'+h)}catch(e){}}
  else{NAV.push({h:curRoute,y:window.scrollY});saveY();try{history.pushState({d:NAV.length},'','#'+h)}catch(e){pushOK=false}}
  route(h);if(!keepScroll&&!/^empezar-/.test(h))window.scrollTo(0,0)}
window.addEventListener('popstate',e=>{const st=e.state||{};if(typeof st.d==='number'&&NAV.length>st.d)NAV.length=st.d;route(location.hash);const y=st.y||0;requestAnimationFrame(()=>requestAnimationFrame(()=>window.scrollTo(0,y)))});
function parentRoute(){const n=activeCrumbs(),a=n&&[...n.querySelectorAll('a[data-r]')].pop();return a?a.dataset.r:'inicio'}
function back(){if(pushOK&&history.state&&history.state.d>0){history.back();return}
  if(NAV.length){const p=NAV.pop();route(p.h);requestAnimationFrame(()=>requestAnimationFrame(()=>window.scrollTo(0,p.y||0)));return}
  if(curRoute!=='inicio')go(parentRoute())}
const BK='<button type="button" class="bk" aria-label="Volver a la página anterior">← Volver</button>';
const pathbar=$('#pathbar'),pathnav=pathbar.querySelector('nav');let pbAct=null,pbTick=false;
function activeCrumbs(){return [...document.querySelectorAll('nav.crumbs')].find(n=>!n.closest('#pathbar')&&n.offsetParent)}
function setTopH(){document.documentElement.style.setProperty('--toph',(document.querySelector('.topbar').offsetHeight+(pathbar.hidden?0:pathbar.offsetHeight))+'px')}
function pbCheck(){pbTick=false;const top=document.querySelector('.topbar').offsetHeight;const hide=!pbAct||!pbAct.isConnected||pbAct.getBoundingClientRect().bottom>top;if(pathbar.hidden!==hide){pathbar.hidden=hide;setTopH()}}
function updBack(){requestAnimationFrame(()=>{document.querySelectorAll('nav.crumbs').forEach(n=>{if(!n.closest('#pathbar')&&!n.querySelector('.bk'))n.insertAdjacentHTML('afterbegin',BK)});
  pbAct=activeCrumbs();pathnav.innerHTML=pbAct?pbAct.innerHTML:'';pbCheck();setTopH()})}
window.addEventListener('scroll',()=>{if(!pbTick){pbTick=true;requestAnimationFrame(pbCheck)}},{passive:true});
document.addEventListener('click',e=>{if(e.target.closest('.bk')){e.preventDefault();back()}});
document.addEventListener('keydown',e=>{if(e.target.closest&&e.target.closest('input,textarea,select,[contenteditable="true"]'))return;
  if(e.key==='Backspace'&&!e.altKey&&!e.ctrlKey&&!e.metaKey){e.preventDefault();back()}else if(!pushOK&&e.altKey&&e.key==='ArrowLeft'){e.preventDefault();back()}});
window.addEventListener('mouseup',e=>{if(!pushOK&&e.button===3){e.preventDefault();back()}});
window.addEventListener('resize',setTopH);
document.addEventListener('click',e=>{const a=e.target.closest('a[data-r],a[data-gen]');if(!a||e.defaultPrevented||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||e.button)return;e.preventDefault();closeSearch();
  if(a.dataset.gen){const [k,v]=a.dataset.gen.split(':');if(k==='tool'){GS.tool=v;setPref(v)}else if(k==='style')GS.style=v;go('generador');return}go(a.dataset.r,false,!!a.closest('#tabs'))});

/* ---------- controles ---------- */
const bPlay=$('#b-play');
function setPlaying(p){playing=p;bPlay.textContent=p?'Pausar':'Reproducir'}
bPlay.addEventListener('click',()=>setPlaying(!playing));
$('#b-restart').addEventListener('click',()=>{T=0;render()});
function step(n){if(SEQ[mode]){const L=SEQ[mode],i=L.findIndex(x=>x[0]===curRoute);go(L[(i+n+L.length)%L.length][0],false,true)}}
$('#b-prev').addEventListener('click',()=>step(-1));$('#b-next').addEventListener('click',()=>step(1));
$('#b-reset').addEventListener('click',()=>{Object.assign(MAN,MDEF);syncPanel();manualChanged()});
document.addEventListener('keydown',e=>{if(e.target.closest&&e.target.closest('input,textarea,select'))return;if(view!=='player')return;
  if(mode!=='man'&&e.key==='ArrowRight'){step(1);e.preventDefault()}else if(mode!=='man'&&e.key==='ArrowLeft'){step(-1);e.preventDefault()}else if(e.key===' '&&e.target===document.body){setPlaying(!playing);e.preventDefault()}});
function copyFrom(elSel,btnSel){const b=$(btnSel);b.addEventListener('click',()=>copyText($(elSel),b))}
$('#b-copy').addEventListener('click',()=>{const pb=$('#i-pbox');copyText(pb.querySelector('code.'+(pb.classList.contains('bi')?pb.dataset.pl:'en')),$('#b-copy'))});copyFrom('#m-prompt','#b-copy2');
document.addEventListener('click',e=>{const b=e.target.closest('button[data-copy]');if(!b)return;const box=b.closest('.prompt');copyText(box&&box.classList.contains('bi')?box.querySelector('code.'+box.dataset.pl):b.previousElementSibling,b)});
gInfo.addEventListener('click',e=>{const b=e.target.closest('button[data-feat]');if(!b)return;const k=b.dataset.feat,t=TBY[curRoute.slice(2)];
  gInfo.querySelectorAll('button[data-feat]').forEach(x=>x.setAttribute('aria-pressed',x===b));const fl=gInfo.querySelector('.featline');
  if(fl){fl.hidden=false;fl.innerHTML='<b>'+esc(FEATS[k].n)+'.</b> '+esc((t&&t.feats[k])||FEATS[k].d)+' <a href="#f-'+k+'" data-r="f-'+k+'">Ver la función</a>'}playDemo(FEATS[k].demo);if(!playing)setPlaying(true)});
document.addEventListener('change',e=>{const s=e.target.closest('select[data-vary]');if(!s)return;const box=s.closest('.vary'),v=VARY[+box.dataset.v],o=v&&v.opts.find(x=>x.k===s.value);if(!o)return;
  const pb=box.querySelector('.prompt');if(pb)pb.outerHTML=bibox(o.code,o.es||ES[o.code]);const hw=box.querySelector('.vary-how');if(hw){hw.textContent=o.how||'';hw.hidden=!o.how}setPref(o.k)});

/* ---------- búsqueda ---------- */
const qIn=$('#q'),qRes=$('#qres');
const SIDX=[].concat(CATS.map((c,i)=>({k:norm(c[1]),t:pad2(i+1)+' '+c[1],s:'Capítulo del glosario',r:'c-'+c[0]})),
  order.map(d=>({k:norm(d.es+' '+d.en+' '+(d.alias||'')+' '+(d.ref||'')),t:d.es,s:'Glosario · '+CATN[d.cat],r:d.id})),
  PCH.map(c=>({k:norm(c.n+' '+c.d),t:c.num+' '+c.n,s:'Etapa de producción',r:'pc-'+c.id})),
  PROD.map(p=>({k:norm(p.t+' '+p.lead+' '+PCHB[p.ch].n),t:p.t,s:'Producción · '+PCHB[p.ch].n,r:'p-'+p.id})),
  TOOLS.map(t=>({k:norm(t.n+' '+(t.by||'')+' '+(t.ver||'')+' '+t.lead+' '+t.id),t:t.n,s:'Herramienta · '+KINDN[t.kind],r:'h-'+t.id})),
  FK.map(k=>({k:norm(FEATS[k].n+' '+FEATS[k].d+' '+k),t:FEATS[k].n,s:'Función de las herramientas',r:'f-'+k})),
  STYLES.map(s=>({k:norm(s.n+' '+s.lead+' '+(s.kw||[]).join(' ')+' '+(SGN[s.g]||'')),t:s.n,s:'Estilo · '+(SGN[s.g]||''),r:'e-'+s.id})),
  [{k:norm('empezar guia primeros pasos principiante como empezar'),t:'Empezá acá: tu primer video',s:'Guía',r:'empezar'},{k:norm('generador prompts idea planos'),t:'Generador de prompts',s:'Sección',r:'generador'},{k:norm('laboratorio manual camara'),t:'Laboratorio',s:'Sección',r:'laboratorio'}]);
let qHits=[];
function closeSearch(){qRes.hidden=true}
function runSearch(){const q=norm(qIn.value.trim());if(!q){closeSearch();return}
  qHits=SIDX.map(x=>({x,sc:norm(x.t).indexOf(q)===0?0:norm(x.t).indexOf(q)>=0?1:x.k.indexOf(q)>=0?2:9})).filter(o=>o.sc<9).sort((a,b)=>a.sc-b.sc).slice(0,14).map(o=>o.x);
  qRes.innerHTML=qHits.length?qHits.map((x,i)=>'<a href="#'+x.r+'" data-r="'+x.r+'"'+(i===0?' class="on"':'')+'><span>'+esc(x.t)+'</span><small>'+esc(x.s)+'</small></a>').join(''):'<div class="none">No hay resultados para esa búsqueda.</div>';qRes.hidden=false}
qIn.addEventListener('input',runSearch);qIn.addEventListener('focus',runSearch);
qIn.addEventListener('keydown',e=>{if(e.key==='Enter'&&qHits[0]){e.preventDefault();closeSearch();qIn.value='';qIn.blur();go(qHits[0].r)}else if(e.key==='Escape'){closeSearch();qIn.blur()}});
document.addEventListener('click',e=>{if(!e.target.closest('.search'))closeSearch()});
qRes.addEventListener('click',()=>{qIn.value=''});

/* ---------- arranque ---------- */
if(window.ResizeObserver)new ResizeObserver(()=>{resize();if(stageLive)render()}).observe(stage);else window.addEventListener('resize',()=>{resize();render()});
resize();
if(reduced)setPlaying(false);
route(location.hash);
window.__glosario={D,order,go,route,back,navDepth:()=>NAV.length,GS,renderGen,rigReady:()=>rigReady,setFig:setFigMode,rigOn:()=>rigOn,rig:()=>RIG,addReal:k=>REALIMG.add(k),play:(id,t)=>{cur=byId[id];T=t;fitWitness(cur);render()},setT:v=>{T=v;render()},pause:()=>setPlaying(false),manual:o=>{if(mode!=='man')go('laboratorio');if(o&&o.style)applyStyle(o.style);Object.assign(MAN,o||{});if(o&&o.amb)Object.assign(MAN,{fill:0,rim:0,fog:0,lamp:0},AMB[o.amb],o);syncPanel();manualChanged();render()},thumbsLeft:()=>tq.length};
requestAnimationFrame(loop);
})();
</script>
