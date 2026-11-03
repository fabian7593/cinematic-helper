
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
function queueThumbs(root){root.querySelectorAll('[data-thumb]').forEach(el=>{const u=THUMBS.get(el.dataset.thumb);if(u)fillThumb(el,u);else tq.push(el)})}
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
const tileR=(r,thumb,title,sub)=>'<a class="card" href="#'+r+'" data-r="'+r+'"><span class="thumb" data-thumb="'+th(thumb)+'"></span><div class="body"><h3>'+esc(title)+'</h3>'+(sub?'<p>'+esc(sub)+'</p>':'')+'</div></a>';
const THUMB_AT={elements:8.4,imagegen:8.6,lipsync:6.5,extend:7,keyframes:4.5,idea:9.5,script:3.5,storyboard:1.2,regionedit:7,startend:5,i2v:6,t2v:7,multishot:7.5};
const th=id=>THUMB_AT[id]!=null&&String(id).indexOf('@')<0?id+'@'+THUMB_AT[id]:id;
const clip=(s,n)=>{s=String(s||'');return s.length>n?s.slice(0,n-1).replace(/\s+\S*$/,'')+'…':s};

/* ---------- piezas de texto para los temas ---------- */
const lbl=t=>'<span class="lbl">'+esc(t)+'</span>';
const codeBlock=(h,code)=>'<div>'+(h?lbl(h):'')+'<div class="prompt long"><code>'+esc(code)+'</code>'+copyBtn+'</div></div>';
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
    '<div class="prompt long"><code>'+esc(sel.code)+'</code>'+copyBtn+'</div>'+(sel.how?'<p class="g-note vary-how">'+esc(sel.how)+'</p>':'<p class="g-note vary-how" hidden></p>')+'</div>'}
function setPref(k){const kd=kindOf(k);if(!k||PREF[kd]===k)return;PREF[kd]=k;store.set('tool.'+kd,k)}

/* ---------- imágenes de ejemplo: se muestran solo si existe el archivo en img/ ---------- */
const REALIMG=new Set([]);
const realEl=$('#realimg'),vseg=$('#vseg'),imgBtn=vseg.querySelector('[data-v="img"]');let realKey=null,realOn=store.get('view')==='img';
function setReal(key,alt){realKey=key&&REALIMG.has(key)?key:null;imgBtn.hidden=!realKey;applyReal(alt)}
function applyReal(alt){const on=!!realKey&&realOn;stage.classList.toggle('showimg',on);realEl.hidden=!on;if(on){realEl.src='img/'+realKey+'.webp';realEl.alt=alt||''}
  vseg.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',on?b.dataset.v==='img':b.dataset.v===(rigOn?'3d':'simple')))}
/* Simple (figuras hechas con código) o 3D (personajes de Mixamo); algunas demos traen su propia versión simple en fnS */
function refreshThumbs(){THUMBS.clear();document.querySelectorAll('[data-thumb].ready').forEach(e=>{e.classList.remove('ready');tq.push(e)})}
function setFigMode(on,quiet){rigOn=on;D.forEach(d=>{if(d.fnS){if(!d.fnR)d.fnR=d.fn;d.fn=on?d.fnR:d.fnS}});if(quiet)return;refreshThumbs();if(cur&&mode!=='page')fitWitness(cur);if(stageLive)render()}
setFigMode(store.get('fig')!=='simple',true);
vseg.addEventListener('click',e=>{const b=e.target.closest('button[data-v]');if(!b)return;const v=b.dataset.v;realOn=v==='img';store.set('view',realOn?'img':'anim');
  if(!realOn&&(v==='3d')!==rigOn){store.set('fig',v);setFigMode(v==='3d')}applyReal(realEl.alt)});

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
const START_TIPS=['Probá cada plano en 5 segundos y a la resolución más baja antes de hacerlo largo.','Debajo de cada ejemplo podés cambiar la vista: Simple (figuras básicas, carga rápido), 3D (personajes con movimiento real) o Imagen, cuando el ejemplo la tenga.','Aprobá las imágenes antes de pagar el video: una imagen cuesta mucho menos que un clip.',
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
function styleGroups(){$('#styles-groups').innerHTML=STYLE_GROUPS.filter(g=>styleFilter==='all'||g[0]===styleFilter).map(g=>{const L=STYLES.filter(s=>s.g===g[0]);return L.length?'<section class="gsec"><h2>'+esc(g[1])+'</h2><div class="tiles">'+L.map(s=>tileR('e-'+s.id,s.demo,s.n,clip(s.lead,80))).join('')+'</div></section>':''}).join('');queueThumbs($('#styles-groups'))}
function showStylesIndex(){pageMode('styles');
  if(!stylesBuilt){stylesBuilt=true;$('#styles-intro').textContent=STYLES.length+' estilos. Cada uno trae sus rasgos de luz, color, textura y cámara, y un bloque en inglés para pegar al final del prompt, adaptado a cada herramienta.';
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
  $('#i-cat').hidden=true;$('#i-es').textContent=d.es;$('#i-what').textContent=d.what;$('#i-look').textContent=d.look;$('#i-prompt').textContent=d.en;
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
function styleVary(s){const opts=Object.keys(STYLE_TOOLFMT).map(k=>{const f=STYLE_TOOLFMT[k];return {k,l:toolName(k),code:((f.pre||'')+s.block+(f.post||'')).trim(),how:f.how}});return varyHTML({h:'Bloque de estilo para pegar',opts})}
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
const newShot=o=>Object.assign({shot:'wide',angle:'eye',move:'static',lens:'',action:'',dialogue:'',sound:'',dur:4},o||{});
const GS={idea:'',subject:'',setting:'',light:'',mood:'',style:'',ar:'16:9',tool:GEN_VIDEO.includes(PREF.video)?PREF.video:'kling',shots:[newShot()]};
const loadPreset=p=>Object.assign(GS,{idea:p.idea,subject:p.subject,setting:p.setting,light:p.light,mood:p.mood,shots:p.shots.map(s=>newShot(s))});
const PRESETS=[
  {n:'Escena con diálogo',idea:'Alguien espera bajo un farol; cuando la luz se enciende, llega la persona que esperaba.',subject:'a young woman in a red shirt and a red cap',setting:'a quiet park at dusk with pine trees and a single street lamp',light:'bluehour',mood:'quiet, hopeful',
    shots:[{shot:'wide',move:'static',action:'stands alone under the unlit street lamp and checks her watch',sound:'distant traffic, crickets',dur:4},{shot:'closeup',move:'dolly',lens:'50',action:'looks up as the lamp flickers on and smiles',dialogue:'(softly) Siempre llegás tarde.',sound:'electric hum of the lamp',dur:4}]},
  {n:'Videoclip',idea:'Una bailarina sola en un parque de noche; cada golpe de la música cambia la luz.',subject:'a dancer in a white tank top and black trousers',setting:'an empty park at night with wet pavement and neon reflections',light:'neon',mood:'energetic, hypnotic',
    shots:[{shot:'wide',angle:'low',move:'crane',action:'starts dancing in the center of the frame',sound:'deep bass hit',dur:3},{shot:'medium',move:'orbit',action:'spins with arms open, hair flying',dur:3},{shot:'closeup',move:'handheld',action:'stops and stares into the lens, breathing',dur:2},{shot:'ews',angle:'topdown',move:'drone',action:'dances alone, a tiny figure on the wet ground',dur:4}]},
  {n:'Tráiler',idea:'Un pueblo donde los faroles se apagan uno por uno y alguien decide averiguar por qué.',subject:'a man in his 40s in a dark wool coat',setting:'a small foggy town at night with old street lamps',light:'lowkey',mood:'mysterious, tense',
    shots:[{shot:'ews',move:'drone',action:'street lamps go dark one by one across the town',sound:'low drone, wind',dur:4},{shot:'medium',move:'tracking',action:'walks fast down an empty street, looking back',sound:'footsteps on cobblestones',dur:3},{shot:'insert',move:'static',lens:'macro',action:'a lamp bulb flickers and dies',sound:'electric crackle',dur:2},{shot:'closeup',angle:'low',move:'dolly',action:'looks up at the last lit lamp',dialogue:'No es casualidad.',dur:3},{shot:'wide',move:'pullout',action:'stands alone as the last lamp goes out',sound:'silence, then a deep hit',dur:4}]},
  {n:'Producto',idea:'Una taza amarilla que mantiene el café caliente toda la mañana.',subject:'a matte yellow ceramic mug with steam rising',setting:'a wooden table by a window in the early morning',light:'hardsoft',mood:'warm, calm, premium',
    shots:[{shot:'insert',move:'orbit',lens:'macro',action:'steam curls up from the coffee in slow motion',sound:'soft pour, ceramic clink',dur:4},{shot:'medium',move:'dolly',lens:'85',action:'a hand lifts the mug from the table',dur:3},{shot:'closeup',move:'static',lens:'50',action:'the mug rests on the table, morning light across it',dur:3}]}];

/* piezas del prompt */
const cap1=s=>s?s.charAt(0).toUpperCase()+s.slice(1):'';
const trimEnd=s=>String(s||'').trim().replace(/[\s.,;]+$/,'');
const sent=s=>{s=trimEnd(s);return s?cap1(s)+'.':''};
const J=(...a)=>a.filter(x=>x&&String(x).trim()).join(' ');
const CL=(...a)=>a.map(trimEnd).filter(Boolean).join(', ');
function who(G){const s=trimEnd(G.subject||'the character').replace(/^(a|an|the)\s+/i,'');return cap1(s.split(/\s+(?:in|with|wearing|who|holding)\s+/i)[0].split(/\s+/).slice(0,4).join(' '))}
function parts(G,s){const st=G.style&&SBY[G.style]?SBY[G.style].block:'';return {shot:GVM.shot[s.shot]||'',angle:GVM.angle[s.angle]||'',move:GVM.move[s.move]||'',lens:GVM.lens[s.lens]&&s.lens?GVM.lens[s.lens]:'',
  subj:trimEnd(G.subject)||'the character',act:trimEnd(s.action),scene:trimEnd(G.setting),light:s.light?GVM.light[s.light]:(G.light?GVM.light[G.light]:''),mood:trimEnd(G.mood),style:trimEnd(st),dlg:String(s.dialogue||'').trim().replace(/^\([^)]*\)\s*/,'').replace(/^["“]|["”]$/g,''),tone:(String(s.dialogue||'').trim().match(/^\(([^)]*)\)/)||[])[1]||'',snd:trimEnd(s.sound),dur:Math.max(1,+s.dur||4),who:who(G),s}}
const kd=P=>'['+P.who+(P.tone?', '+P.tone:'')+']: "'+P.dlg+'"',says=P=>P.who+' says'+(P.tone?' '+P.tone:'')+': "'+P.dlg+'"';
const camOf=P=>CL(P.shot,P.angle==='eye-level'?'':P.angle,P.move,P.lens);
const tot=G=>G.shots.reduce((a,s)=>a+Math.max(1,+s.dur||4),0);
const ts=x=>'00:'+pad2(Math.floor(x));
const mjAr=ar=>ar==='2.39:1'?'239:100':ar;
const theW=P=>'the '+P.who.toLowerCase();
const saysT=P=>cap1(theW(P))+' says'+(P.tone?', '+P.tone:'')+': "'+P.dlg+'"';
const frm=P=>CL(cap1(P.shot),P.angle==='eye-level'?'':P.angle);
const mv=P=>CL(cap1(P.move),P.lens);
const moodS=P=>P.mood?sent(cap1(P.mood)+' mood'):'';
const SA=(P,pre)=>pre?pre+' '+sent(P.snd):sent(P.snd);
const FMT={
  generic:{one:(G,P)=>J(sent(J(P.subj,P.act)+(P.scene?' in '+P.scene:'')),sent(CL(frm(P),P.move,P.lens)),sent(P.light),sent(P.style),moodS(P),P.snd?SA(P,'SFX:'):'',P.dlg?saysT(P):''),
    all:(G,L)=>J(L.map((P,i)=>'Shot '+(i+1)+': '+J(sent(frm(P)+(i===0&&P.scene?' of '+P.scene:'')),sent(J(i?'the same '+P.subj.replace(/^(a|an|the)\s+/i,''):P.subj,P.act)),sent(mv(P)),i===0?sent(P.light):'',P.snd?SA(P,'SFX:'):'',P.dlg?saysT(P):'')).join(' '),sent(L[0].style),moodS(L[0]))},
  kling:{one:(G,P)=>J(sent(CL(P.scene,P.light)),P.snd?sent(P.snd):'','['+P.who+': '+P.subj+']'+(P.act?' '+trimEnd(P.act)+'.':'.'),P.dlg?kd(P):'',sent(CL(frm(P),P.move,P.lens)),sent(P.style),moodS(P)),
    all:(G,L)=>J(L.map((P,i)=>'Shot '+(i+1)+' (Duration: '+P.dur+' seconds): '+J(sent(CL(frm(P)+(i===0&&P.scene?' of '+P.scene:''),i===0?P.light:'')),'['+P.who+': '+P.subj+']'+(P.act?' '+trimEnd(P.act)+'.':'.'),P.dlg?kd(P):'',P.snd?sent(P.snd):'',sent(mv(P)))).join(' '),sent(L[0].style),moodS(L[0]))},
  flow:{one:(G,P)=>J(sent(CL(frm(P)+(P.scene?' of '+P.scene:''),P.move,P.lens)),sent(J(P.subj,P.act)),sent(CL(P.light,P.style)),moodS(P),P.snd?SA(P,'SFX:'):'',P.dlg?saysT(P):''),
    all:(G,L)=>{let t=0;return J(L.map((P,i)=>{const a=t;t+=P.dur;return '['+ts(a)+'-'+ts(t)+'] '+J(sent(CL(frm(P)+(i===0&&P.scene?' of '+P.scene:''),P.move,P.lens)),sent(J(P.subj,P.act)),i===0?sent(P.light):'',P.snd?SA(P,'SFX:'):'',P.dlg?saysT(P):'')}).join(' '),sent(L[0].style),moodS(L[0]))}},
  seedance:{one:(G,P)=>J('@Image1 is '+sent(P.subj),P.scene?'@Image2 is '+sent(P.scene):'',P.style?'Style: '+sent(P.style):'',sent(CL(frm(P)+': @Image1 '+(P.act||'holds still')+(P.scene?' in @Image2':''),P.move,P.lens,P.light)),P.dlg?'@Image1 says'+(P.tone?', '+P.tone:'')+': "'+P.dlg+'". Only one person speaks.':'',P.snd?SA(P,'Sound:'):''),
    all:(G,L)=>{let t=0;const P0=L[0];return J('@Image1 is '+sent(P0.subj),P0.scene?'@Image2 is '+sent(P0.scene):'',P0.style?'Style: '+sent(P0.style):'',
      L.map((P,i)=>{const a=t;t+=P.dur;return '['+ts(a)+'-'+ts(t)+'] '+J(sent(CL(frm(P)+': @Image1 '+(P.act||'holds still')+(i===0&&P.scene?' in @Image2':''),P.move,P.lens,i===0?P.light:'')),P.dlg?'@Image1 says'+(P.tone?', '+P.tone:'')+': "'+P.dlg+'"':'',P.snd?SA(P,'Sound:'):'')}).join(' '),L.some(P=>P.dlg)?'Only one person speaks.':'',moodS(P0))}},
  higgsfield:{one:(G,P)=>J('[UI: '+hfUI(P)+']',sent(J(P.subj,P.act)+(P.scene?' in '+P.scene:'')),P.dlg?saysT(P):'',P.snd?sent(P.snd):'',sent(P.style),moodS(P)),
    all:(G,L)=>L.map((P,i)=>'Shot '+(i+1)+' [UI: '+hfUI(P)+']: '+J(sent(J(P.subj,P.act)+(i===0&&P.scene?' in '+P.scene:'')),P.dlg?saysT(P):'',P.snd?sent(P.snd):'')).join('\n')+(L[0].style?'\n'+sent(L[0].style):'')},
  runway:{one:(G,P)=>J(sent(CL(frm(P),P.move,P.lens)),sent(J(P.subj,P.act)+(P.scene?' in '+P.scene:'')),sent(CL(P.light,P.style)),moodS(P),P.dlg?cap1(theW(P))+' mouths the words "'+P.dlg+'".':'')},
  wan:{one:(G,P)=>J(sent(frm(P)+(P.scene?' of '+P.scene:'')),sent(J(P.subj,P.act)),sent(mv(P)),sent(P.light),sent(P.style),moodS(P),P.snd?SA(P,'Sound:'):'',P.dlg?saysT(P):'')},
  hailuo:{one:(G,P)=>J(sent(J(P.subj,P.act)+(P.scene?' in '+P.scene:'')),sent(CL(frm(P),P.move,P.lens)),sent(CL(P.light,P.style)),moodS(P),P.dlg?saysT(P):'',P.snd?SA(P,'Audio:'):'')},
  nanobanana:{img:1,one:(G,P)=>J(sent(cap1(J(P.subj,P.act))+(P.scene?' in '+P.scene:'')),sent(CL(cap1(P.shot),P.angle,P.lens)),sent(CL(P.light,P.style,'cinematic film still',G.ar)))},
  midjourney:{img:1,one:(G,P)=>CL(cap1(J(P.subj,P.act))+(P.scene?' in '+P.scene:''),P.shot,P.angle==='eye-level'?'':P.angle,P.style,P.mood?P.mood+' mood':'',P.light,P.lens,'cinematic still')+' --ar '+mjAr(G.ar)+' --raw'},
  gptimage:{img:1,one:(G,P)=>J(P.scene?'Scene: '+sent(CL(P.scene,P.light)):'','Subject: '+sent(J(P.subj,P.act)),'Composition: '+sent(CL(P.shot,P.angle,P.lens)),P.style?'Style: '+sent(P.style):'','Use: start frame for a '+G.ar+' film shot, cinematic still.','Constraints: no text, no watermark.')},
  seedream:{img:1,one:(G,P)=>J(sent(cap1(J(P.subj,P.act))+(P.scene?' in '+P.scene:'')),sent(CL(P.shot,P.angle,P.lens,P.light)),sent(CL(P.style,'cinematic still',G.ar)))},
  flux:{img:1,one:(G,P)=>J(sent(cap1(J(P.subj,P.act))+(P.scene?' in '+P.scene:'')),sent(CL(P.shot,P.angle,P.lens)),sent(CL(P.light,P.style,'cinematic film still')),'Aspect ratio '+G.ar+'.')}};
const HF_MOVE={static:'Static',pan:'Pan',tilt:'Tilt up',pedestal:'Pedestal up',dolly:'Dolly in',pullout:'Dolly out',zoom:'Zoom in',crashzoom:'Crash zoom',dollyzoom:'Dolly zoom',tracking:'Tracking',leadingshot:'Leading shot',steadicam:'Gimbal follow',handheld:'Handheld',crane:'Crane up',orbit:'Orbit',drone:'Drone',fpv:'FPV',whip:'Whip pan',rack:'Rack focus'};
const hfUI=P=>CL(cap1(P.shot),P.lens||'',P.s&&HF_MOVE[P.s.move]?HF_MOVE[P.s.move]:'',P.light?cap1(P.light):'');
const GEN_HINT={generic:'Formato neutro para cualquier herramienta: un plano, una acción y una cámara por prompt, con la misma descripción del personaje en todos.',
  kling:'Kling 4.0: escena y luz, sonido, el sujeto con etiqueta [Nombre: descripción], el diálogo como [Nombre, tono]: "línea" y al final la cámara. Con varios planos, cada uno lleva "Shot n (Duration: n seconds)". Los elementos guardados se citan como [@Elemento].',
  flow:'Flow (Veo 3.1 u Omni): los bloques [00:00-00:04] cortan dentro de un mismo clip, SFX: marca los efectos y el diálogo va con says. Veo 3.1 dura 4, 6 u 8 s y Omni hasta 10 s: si la suma se pasa, generá cada plano aparte.',
  seedance:'Seedance 2.5: subí la ficha del personaje como @Image1 y el lugar como @Image2; si no tenés imágenes, borrá esas dos líneas. Un cambio principal por bloque de tiempo y, si hay diálogo, que hable una sola persona.',
  higgsfield:'Higgsfield Cinema Studio 4.0: plano, lente, movimiento y luz se eligen en los controles. Lo que está entre [UI: …] es lo que tenés que marcar ahí; no lo pegues en el texto.',
  runway:'Runway Gen-4.5: un plano por prompt, con la cámara primero y la acción en secuencia. Es mudo: el diálogo queda como "mouths the words" y el sonido se hace aparte.',
  wan:'Wan 3.0: un párrafo por plano, de la escena a la cámara, con Sound: para el ambiente y el diálogo con says.',hailuo:'Hailuo / MiniMax H3: un plano por prompt de 4 a 15 s, con Audio: para diálogo y efectos.',
  nanobanana:'Nano Banana: oraciones completas, no listas. Para el plano siguiente conviene editar el frame anterior y decir qué se mantiene igual.',midjourney:'Midjourney V8.2: frases naturales con los parámetros al final. Para fijar el estilo del proyecto sumá --sref con tu código y --sw.',
  gptimage:'GPT Image: bloques cortos con etiqueta (Scene, Subject, Composition, Use, Constraints).',seedream:'Seedream 5.0: de 30 a 80 palabras por imagen, con posiciones y luz concretas.',flux:'FLUX: lenguaje natural, del sujeto al encuadre.'};
function syntaxNote(tool){return GEN_HINT[tool]||''}

const gForm=$('#gen-form'),gShots=$('#g-shots'),gRes=$('#g-result');
const opt=(v,t,sel)=>'<option value="'+esc(v)+'"'+(v===sel?' selected':'')+'>'+esc(t)+'</option>';
const gvOpts=(k,sel)=>GV[k].map(x=>opt(x[0],x[0]===''?'Sin indicar':gvLabel(k,x[0]),sel)).join('');
function shotRow(s,i){return '<div class="shot" data-i="'+i+'"><div class="shot-h"><b>Plano '+(i+1)+'</b><label class="dur">Duración <input type="number" min="1" max="30" step="1" data-k="dur" value="'+esc(s.dur)+'"> s</label>'+(GS.shots.length>1?'<button type="button" class="linkbtn" data-del>Quitar</button>':'')+'</div>'+
  '<div class="fld4"><label class="fld"><span>Plano</span><select data-k="shot">'+gvOpts('shot',s.shot)+'</select></label><label class="fld"><span>Ángulo</span><select data-k="angle">'+gvOpts('angle',s.angle)+'</select></label>'+
  '<label class="fld"><span>Movimiento</span><select data-k="move">'+gvOpts('move',s.move)+'</select></label><label class="fld"><span>Lente</span><select data-k="lens">'+gvOpts('lens',s.lens)+'</select></label></div>'+
  '<label class="fld"><span>Acción (en inglés)</span><input data-k="action" value="'+esc(s.action)+'" placeholder="looks up as the lamp turns on"></label>'+
  '<div class="fld2"><label class="fld"><span>Diálogo · tono opcional entre paréntesis</span><input data-k="dialogue" value="'+esc(s.dialogue)+'" placeholder="(softly) Siempre llegás tarde."></label><label class="fld"><span>Sonido (en inglés)</span><input data-k="sound" value="'+esc(s.sound)+'" placeholder="electric hum, crickets"></label></div></div>'}
function drawShots(){gShots.innerHTML=GS.shots.map(shotRow).join('')}
function fillForm(){$('#g-idea').value=GS.idea;$('#g-subject').value=GS.subject;$('#g-setting').value=GS.setting;$('#g-mood').value=GS.mood;
  $('#g-light').innerHTML=gvOpts('light',GS.light);$('#g-ar').innerHTML=ARS.map(a=>opt(a[0],a[1],GS.ar)).join('');
  $('#g-style').innerHTML=opt('','Sin estilo',GS.style)+STYLE_GROUPS.map(g=>{const L=STYLES.filter(s=>s.g===g[0]);return L.length?'<optgroup label="'+esc(g[1])+'">'+L.map(s=>opt(s.id,s.n,GS.style)).join('')+'</optgroup>':''}).join('');
  $('#g-tool').innerHTML='<optgroup label="Video">'+GEN_VIDEO.map(k=>opt(k,toolLabel(k),GS.tool)).join('')+'</optgroup><optgroup label="Imagen para el frame inicial">'+GEN_IMG.map(k=>opt(k,toolLabel(k),GS.tool)).join('')+'</optgroup>';drawShots()}
function metaPrompt(G){const sy=typeof SYNTAX!=='undefined'&&SYNTAX[G.tool],st=G.style&&SBY[G.style]?SBY[G.style].block:'',img=FMT[G.tool]&&FMT[G.tool].img;
  return J('You are a film director and an expert prompt writer for '+toolLabel(G.tool)+'.','Turn the idea below into a shot list of '+(G.shots.length>1?G.shots.length+' shots':'3 to 5 shots')+' for a '+tot(G)+'-second video, aspect ratio '+G.ar+'.',
    'Idea: '+(G.idea||'[tu idea]'),G.subject?'Main character, keep the description identical in every shot: '+sent(G.subject):'',G.setting?'Location: '+sent(G.setting):'',st?'Visual style, paste it unchanged at the end of every prompt: '+sent(st):'',
    'For each shot give: shot size, camera angle, camera movement, lens, action, dialogue if any, sound and duration. Cover the scene like a film: establish the place, move closer, and add a reaction or an insert when it helps the cut.',
    img?'Then write one image prompt per shot to generate its start frame.':'Then write the final video prompt for each shot.',
    sy?'Follow this tool syntax. Order: '+(sy.order||[]).join(', ')+'.'+(sy.dialogue?' Dialogue: '+sy.dialogue+'.':'')+(sy.multishot?' Several shots in one prompt: '+sy.multishot+'.':'')+(sy.negative?' Negatives: '+sy.negative+'.':''):'',
    'Write the prompts in English, keep dialogue in its original language, and use positive phrasing: describe what should be on screen, not what should not.')}
function renderGen(){const tool=GS.tool,F=FMT[tool]||FMT.generic,L=GS.shots.map(s=>parts(GS,s)),img=!!F.img;let h='';
  if(!img&&F.all&&L.length>1)h+='<div class="gblock">'+codeBlock('Todo en un prompt · '+L.length+' planos · '+tot(GS)+' s',F.all(GS,L))+'</div>';
  h+=L.map((P,i)=>{const s=GS.shots[i];return '<div class="gshot"><span class="thumb" data-thumb="'+s.shot+'"></span><div class="gshot-b">'+codeBlock((img?'Frame inicial · plano ':'Plano ')+(i+1)+' · '+gvLabel('shot',s.shot)+(img?'':' · '+P.dur+' s'),F.one(GS,P,i))+
    '</div></div>'}).join('');
  if(!GS.shots.some(s=>s.action))h='<p class="g-note">Escribí la acción de al menos un plano o cargá una plantilla.</p>'+h;
  gRes.innerHTML=h;queueThumbs(gRes);$('#g-hint').textContent=syntaxNote(tool);$('#g-llm').textContent=metaPrompt(GS)}
gForm.addEventListener('input',e=>{const el=e.target,row=el.closest('.shot');
  if(row){const s=GS.shots[+row.dataset.i],k=el.dataset.k;if(!s||!k)return;s[k]=k==='dur'?Math.max(1,Math.min(30,+el.value||4)):el.value}
  else{const m={'g-idea':'idea','g-subject':'subject','g-setting':'setting','g-mood':'mood','g-light':'light','g-style':'style','g-ar':'ar'}[el.id];if(m)GS[m]=el.value}
  renderGen()});
gForm.addEventListener('submit',e=>e.preventDefault());
gShots.addEventListener('click',e=>{const b=e.target.closest('[data-del]');if(!b)return;GS.shots.splice(+b.closest('.shot').dataset.i,1);drawShots();renderGen()});
$('#g-add').addEventListener('click',()=>{const l=GS.shots[GS.shots.length-1];GS.shots.push(newShot({shot:l&&l.shot==='wide'?'closeup':'medium',angle:'eye',move:'static'}));drawShots();renderGen()});
$('#g-tool').addEventListener('change',e=>{GS.tool=e.target.value;setPref(GS.tool);renderGen()});
$('#gen-presets').innerHTML=PRESETS.map((p,i)=>'<button type="button" class="go" data-p="'+i+'">'+esc(p.n)+'</button>').join('')+'<button type="button" class="go" data-p="clear">Vaciar</button>';
$('#gen-presets').addEventListener('click',e=>{const b=e.target.closest('[data-p]');if(!b)return;const k=b.dataset.p;
  if(k==='clear')Object.assign(GS,{idea:'',subject:'',setting:'',light:'',mood:'',shots:[newShot()]});else loadPreset(PRESETS[+k]);
  fillForm();renderGen()});
$('#g-copyall').addEventListener('click',e=>{const t=[...gRes.querySelectorAll('code')].map(c=>c.textContent).join('\n\n');const b=e.currentTarget;try{navigator.clipboard.writeText(t).then(()=>{b.textContent='Copiado';setTimeout(()=>b.textContent='Copiar todo',1400)},()=>{})}catch(err){}});
$('#g-jump').addEventListener('click',()=>$('#gen-out').scrollIntoView({block:'start'}));
let genBuilt=false;loadPreset(PRESETS[0]);
function showGen(){pageMode('gen');if(!genBuilt){genBuilt=true;fillForm()}else{$('#g-tool').value=GS.tool;$('#g-style').value=GS.style}renderGen();document.title='Generador · Plano a Plano'}

/* proponer planos con Claude, solo dentro de un visor de Claude */
let sampleFn=null,aiCtl=null;
const AI_ERR={rate_limited:'Demasiadas solicitudes seguidas. Probá de nuevo en un rato.',invalid_json:'La respuesta no vino en el formato esperado. Probá de nuevo.',refused:'Claude no respondió a esa idea. Cambiá la idea y probá otra vez.',
  session_expired:'Tenés que volver a iniciar sesión en Claude.',empty_completion:'No llegó respuesta. Probá con una idea más concreta.',prompt_too_large:'La idea es demasiado larga. Resumila.'};
const AI_HIDE=['not_granted','sampling_disabled','not_declared','capability_disabled','capability_removed'];
function aiPrompt(){const ids=k=>GV[k].map(x=>x[0]).filter(Boolean).join(', ');const n=GS.shots.length>1?GS.shots.length:0;
  return ['You turn a short video idea into a shot list for an AI video generator. Reply with only one JSON object and no other text, shaped like:',
    '{"subject":"...","setting":"...","light":"bluehour","mood":"...","shots":[{"shot":"wide","angle":"eye","move":"static","lens":"","action":"...","dialogue":"","sound":"...","dur":4}]}',
    'Rules:','- subject: one English description of the main character (age, clothing and colors) that will be repeated unchanged in every shot.'+(GS.subject?' Use this one: '+GS.subject:''),
    '- setting: one English description of the location.'+(GS.setting?' Use this one: '+GS.setting:''),'- light: one of: '+ids('light')+'.','- mood: two or three English words.',
    '- shot: one of: '+ids('shot')+'. angle: one of: '+ids('angle')+'. move: one of: '+ids('move')+'. lens: "" or one of: '+ids('lens')+'.',
    '- action and sound: English, present tense, one clear filmable action per shot.','- dialogue: short, in the language the idea is written in, or "" when nobody speaks.',
    '- dur: seconds per shot, between 3 and 10.',n?'- Use exactly '+n+' shots.':'- Use 3 to 5 shots.',
    '- Cover the scene like a film: establish the place, move closer, and include a reaction or an insert when it helps the cut.',
    GS.style&&SBY[GS.style]?'- The visual style is: '+SBY[GS.style].n+'. Choose shots and moves that suit it.':'',
    'Idea: """'+String(GS.idea).slice(0,3000)+'"""'].filter(Boolean).join('\n')}
const pick=(k,v,d)=>GVM[k]&&Object.prototype.hasOwnProperty.call(GVM[k],v)?v:d;
function applyAI(o){if(!o||typeof o!=='object'||!Array.isArray(o.shots)||!o.shots.length)throw {code:'invalid_json'};
  if(o.subject)GS.subject=String(o.subject);if(o.setting)GS.setting=String(o.setting);GS.light=pick('light',o.light,GS.light);if(o.mood)GS.mood=String(o.mood);
  GS.shots=o.shots.slice(0,10).map(s=>newShot({shot:pick('shot',s.shot,'medium'),angle:pick('angle',s.angle,'eye'),move:pick('move',s.move,'static'),lens:pick('lens',String(s.lens||''),''),action:String(s.action||''),dialogue:String(s.dialogue||''),sound:String(s.sound||''),dur:Math.max(1,Math.min(15,Math.round(+s.dur||4)))}));
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
function setTopH(){document.documentElement.style.setProperty('--toph',document.querySelector('.topbar').offsetHeight+'px')}
function pbCheck(){pbTick=false;const top=document.querySelector('.topbar').offsetHeight-(pathbar.hidden?0:pathbar.offsetHeight);const hide=!pbAct||!pbAct.isConnected||pbAct.getBoundingClientRect().bottom>top;if(pathbar.hidden!==hide){pathbar.hidden=hide;setTopH()}}
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
copyFrom('#i-prompt','#b-copy');copyFrom('#m-prompt','#b-copy2');
document.addEventListener('click',e=>{const b=e.target.closest('button[data-copy]');if(b)copyText(b.previousElementSibling,b)});
gInfo.addEventListener('click',e=>{const b=e.target.closest('button[data-feat]');if(!b)return;const k=b.dataset.feat,t=TBY[curRoute.slice(2)];
  gInfo.querySelectorAll('button[data-feat]').forEach(x=>x.setAttribute('aria-pressed',x===b));const fl=gInfo.querySelector('.featline');
  if(fl){fl.hidden=false;fl.innerHTML='<b>'+esc(FEATS[k].n)+'.</b> '+esc((t&&t.feats[k])||FEATS[k].d)+' <a href="#f-'+k+'" data-r="f-'+k+'">Ver la función</a>'}playDemo(FEATS[k].demo);if(!playing)setPlaying(true)});
document.addEventListener('change',e=>{const s=e.target.closest('select[data-vary]');if(!s)return;const box=s.closest('.vary'),v=VARY[+box.dataset.v],o=v&&v.opts.find(x=>x.k===s.value);if(!o)return;
  box.querySelector('code').textContent=o.code;const hw=box.querySelector('.vary-how');if(hw){hw.textContent=o.how||'';hw.hidden=!o.how}setPref(o.k)});

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
