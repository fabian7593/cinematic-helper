/* ===== términos añadidos ===== */
const cssCycle=(t,per,list)=>list[Math.floor(t/per)%list.length];

/* ENCUADRE (más tamaños) */
add({id:'full',cat:'encuadre',es:'Plano entero',en:'full shot, full body',dur:6,what:'El personaje de la cabeza a los pies, llenando el cuadro.',look:'Casi no sobra aire arriba ni abajo. Comparalo con el plano general, donde manda el entorno.',
  fn(t,S){setCam(S,{p:[0,1.05,3.25],t:[0,.95,0],fov:38});S.A.wave=pp(t,6,.3)}});
add({id:'cowboy',cat:'encuadre',es:'Plano americano',en:'cowboy shot, medium wide shot',dur:6,what:'Desde medio muslo hacia arriba. Nació en los westerns para que se viera la pistola en la cintura.',look:'Entran las manos y la cadera. Es útil cuando el personaje sostiene o hace algo.',
  fn(t,S){setCam(S,{p:[0,1.3,2.1],t:[0,1.25,0],fov:38});S.A.talk=1}});
add({id:'mcu',cat:'encuadre',es:'Plano medio corto',en:'medium close-up',dur:6,what:'Del pecho hacia arriba. Es el plano más usado en diálogos de series.',look:'La cara ya domina, pero todavía se ven los hombros.',
  fn(t,S){setCam(S,{p:[0,1.54,1.1],t:[0,1.53,0],fov:38});S.A.talk=1}});
add({id:'twoshot',cat:'encuadre',es:'Two-shot',en:'two-shot',dur:6,what:'Dos personajes en el mismo cuadro.',look:'Muestra la relación entre los dos: distancia, quién mira a quién, quién ocupa más espacio.',
  fn(t,S){conv(S);setCam(S,{p:[0,1.45,3.0],t:[0,1.3,0],fov:38});const a=Math.floor(t/2)%2===0;S.A.talk=a?1:0;S.B.talk=a?0:1}});

/* ÁNGULO (más) */
add({id:'worm',cat:'angulo',es:'Nadir',en:'worm\'s-eye view',dur:6,what:'La cámara está en el piso y mira casi recto hacia arriba.',look:'Es el contrapicado llevado al extremo: el personaje parece un gigante contra el cielo.',
  fn(t,S){setCam(S,{p:[.12*Math.sin(t),.06,.6],t:[0,1.6,0],fov:52});S.A.headYaw=0;S.A.nod=.5}});
add({id:'ground',cat:'angulo',es:'A ras del suelo',en:'ground-level shot',dur:6,what:'La cámara está a la altura del piso y mira en horizontal.',look:'Los pies y el suelo ganan protagonismo. Sirve para pasos, persecuciones y llegadas.',
  fn(t,S){setCam(S,{p:[0,.09,3.4],t:[0,.42,0],fov:38});walkX(S.A,t,6,-4,4)}});
add({id:'profile',cat:'angulo',es:'Perfil',en:'profile shot, side view',dur:6,what:'La cámara mira al personaje exactamente de lado.',look:'Se ve la dirección de la mirada pero no la expresión completa. Da distancia y observación.',
  fn(t,S){setCam(S,{p:[3.6,1.5,.1],t:[0,1.3,0],fov:36});S.A.headYaw=0;S.A.talk=1}});
add({id:'behind',cat:'angulo',es:'De espaldas',en:'shot from behind, back view',dur:7,what:'La cámara mira al personaje desde atrás.',look:'No se ve la cara: vemos lo que el personaje tiene delante. Genera misterio o acompaña una llegada.',
  fn(t,S){const z=lerp(1,-3,t/7);S.A.z=z;S.A.ry=PI;S.A.walk=z*3.7;S.A.amp=1;S.A.headYaw=0;setCam(S,{p:[.3,1.65,z+2.6],t:[0,1.35,z-2],fov:38})}});

/* COMPOSICIÓN */
add({id:'thirds',cat:'composicion',es:'Regla de los tercios',en:'rule of thirds composition',dur:8,what:'El cuadro se divide en tres partes a lo ancho y a lo alto. El sujeto va sobre una de las líneas, no en el centro.',look:'Primero centrado, después sobre la línea de un tercio. El cuadro respira y la mirada del personaje tiene adónde ir.',
  fn(t,S){const k=t<3?0:t<3.9?ss((t-3)/.9):t<7.2?1:1-ss((t-7.2)/.8);setCam(S,{p:[0,1.5,3.2],t:[0,1.35,0],fov:38});third(S,-.34*k);S.A.headYaw=.55*k;S.cap=k<.5?_t('Centrado'):_t('Sobre el tercio');S.hud=thirdsGrid}});
add({id:'headroom',cat:'composicion',es:'Headroom',en:'proper headroom',dur:9,what:'El espacio entre la cabeza del personaje y el borde superior del cuadro.',look:'Con demasiado aire el personaje se hunde; sin aire la cabeza queda cortada. Lo correcto es un margen pequeño.',
  fn(t,S){const i=Math.floor(t/3)%3,p=(i+2)%3,O=[.32,-.27,.03],k=ss((t-i*3)/.6),o=lerp(O[p],O[i],k);setCam(S,{p:[0,1.5+o,1.3],t:[0,1.5+o,0],fov:38});
    S.cap=[_t('Demasiado aire arriba'),_t('Cabeza cortada'),_t('Headroom correcto')][i];S.badge=i===2?_t('Correcto'):_t('Evitar');S.badgeKind=i===2?'ok':'bad'}});
add({id:'leadroom',cat:'composicion',es:'Aire de mirada',en:'lead room, looking room',dur:8,what:'El espacio libre delante del personaje, hacia donde mira o se mueve.',look:'Si camina contra el borde del cuadro, se siente encerrado. Con espacio por delante, el movimiento se lee natural.',
  fn(t,S){walkX(S.A,t,8,-5,5);const i=t<4?0:1,k=t<4?1-ss((t-3.5)/.5)*0:ss((t-4)/.6);setCam(S,{p:[S.A.x,1.4,5],t:[S.A.x,1.1,0],fov:38});third(S,lerp(.42,-.36,i?k:0));
    S.cap=i?_t('Con aire por delante'):_t('Sin aire por delante');S.badge=i?_t('Correcto'):_t('Evitar');S.badgeKind=i?'ok':'bad'}});
add({id:'symmetry',cat:'composicion',es:'Simetría',en:'symmetrical composition, centered framing',dur:7,what:'Las dos mitades del cuadro se reflejan y el sujeto queda al centro.',look:'Acá el centro sí funciona, porque todo el cuadro está ordenado alrededor de él. Da orden, solemnidad o inquietud.',
  fn(t,S){S.props.avenue=true;S.props.set=false;S.A.headYaw=0;const k=ss(t/7);setCam(S,{p:[0,1.3,lerp(8,6,k)],t:[0,1.3,0],fov:34});
    S.hud=(c,w,h)=>{c.strokeStyle='rgba(255,255,255,.55)';c.setLineDash([w*.012,w*.012]);c.lineWidth=Math.max(1,w/900);c.beginPath();c.moveTo(w/2,0);c.lineTo(w/2,h);c.stroke();c.setLineDash([])}}});
add({id:'leading',cat:'composicion',es:'Líneas guía',en:'leading lines composition',dur:7,what:'Líneas del lugar que llevan el ojo hacia el sujeto: un camino, una cerca, una fila de árboles.',look:'El camino y las dos filas de árboles apuntan al personaje, aunque se vea pequeño.',
  fn(t,S){S.props.avenue=true;S.props.set=false;S.A.z=-6;S.A.headYaw=0;const k=ss(t/7);setCam(S,{p:[0,lerp(.45,.7,k),lerp(9.5,8.5,k)],t:[0,1.2,-6],fov:30});
    S.hud=(c,w,h)=>{const a=project(new V3(0,1.2,-6),cam,w,h);c.strokeStyle='rgba(255,210,74,.85)';c.lineWidth=Math.max(1.5,w/600);c.beginPath();[[-.85,0,8],[.85,0,8],[-2.6,3.4,6],[2.6,3.4,6]].forEach(p=>{const s=project(new V3(p[0],p[1],p[2]),cam,w,h);c.moveTo(s[0],s[1]);c.lineTo(lerp(s[0],a[0],.88),lerp(s[1],a[1],.88))});c.stroke()}}});
add({id:'frameinframe',cat:'composicion',es:'Marco dentro del marco',en:'frame within a frame, shot through a doorway',dur:7,what:'Un elemento del lugar enmarca al sujeto dentro del cuadro: una puerta, una ventana, un arco.',look:'La puerta oscurece los bordes y concentra la atención en el personaje del fondo.',
  fn(t,S){S.props.door=true;const k=ss(t/7);setCam(S,{p:[.15*Math.sin(t*.6),1.45,lerp(6.4,5.2,k)],t:[0,1.2,0],fov:34});S.A.wave=pp(t,7,.3)}});
add({id:'negative',cat:'composicion',es:'Espacio negativo',en:'negative space composition',dur:7,what:'Una zona grande y vacía del cuadro que rodea al sujeto.',look:'El personaje ocupa una esquina y el resto es cielo. Comunica soledad, calma o pequeñez.',
  fn(t,S){S.props.set=false;S.A.headYaw=.5;setCam(S,{p:[0,.7,7.5],t:[0,3.3,0],fov:40});third(S,-.5+.04*Math.sin(t*.8))}});
add({id:'depth',cat:'composicion',es:'Capas de profundidad',en:'foreground, midground and background layers',dur:8,what:'Componer con algo cerca, el sujeto en medio y un fondo lejos.',look:'Al moverse la cámara, cada capa se desplaza a distinta velocidad. Eso es lo que hace que una imagen plana se sienta profunda.',
  fn(t,S){S.props.fg=true;const x=.55*Math.sin(t/8*PI*2);S.props.fgPos=[-.85,2.3];setCam(S,{p:[x,1.5,3.7],t:[.1,1.35,0],fov:30});
    S.hud=(c,w,h)=>{[[new V3(-.85,1.25,2.3),_t('Primer término')],[new V3(0,1.95,0),_t('Sujeto')],[new V3(-7,4.6,-9),_t('Fondo')]].forEach(e=>{const s=project(e[0],cam,w,h);if(s[2]<1&&s[0]>w*.05&&s[0]<w*.95)hudText(c,w,e[1],clamp(s[0],w*.12,w*.88),Math.max(h*.2,s[1]))})}}});

/* MOVIMIENTO (más) */
add({id:'pedestal',cat:'mov',es:'Pedestal',en:'pedestal up / pedestal down',dur:6,what:'La cámara sube o baja en vertical sin inclinarse.',look:'A diferencia del tilt, la cámara cambia de altura y sigue mirando al frente.',
  fn(t,S){const y=lerp(.45,2.2,pp(t,6));setCam(S,{p:[0,y,3.4],t:[0,y,0],fov:38})}});
add({id:'crashzoom',cat:'mov',es:'Crash zoom',en:'crash zoom, snap zoom',dur:4.6,what:'Un zoom muy rápido hacia el sujeto.',look:'En una fracción de segundo pasa de plano general a primer plano. Es un golpe de énfasis, muy usado en comedia y acción.',
  fn(t,S){const k=t<1.6?0:t<1.8?ss((t-1.6)/.2):t<3.8?1:1-ss((t-3.8)/.6);setCam(S,{p:[0,1.5,6.5],t:[0,lerp(1.2,1.6,k),0],fov:lerp(38,6.5,k)});S.post.sub=8;S.post.shutter=.8}});
add({id:'pullout',cat:'mov',es:'Pull-out reveal',en:'pull back to reveal',dur:8,what:'La cámara arranca cerca y retrocede hasta mostrar el contexto.',look:'Empieza en la cara y al abrirse descubre con quién está y dónde. La información nueva llega con el movimiento.',
  fn(t,S){S.B.vis=true;S.B.x=1.5;S.B.z=-.5;S.B.ry=-.5;S.B.wave=pp(t,8,.35);const k=ss((t-.8)/5.2);setCam(S,{p:[lerp(0,2.2,k),lerp(1.63,3.4,k),lerp(.95,9.5,k)],t:[lerp(0,.6,k),lerp(1.63,1.1,k),0],fov:34})}});
add({id:'camroll',cat:'mov',es:'Roll de cámara',en:'camera roll, barrel roll',dur:6,what:'La cámara gira sobre el eje del lente.',look:'El horizonte da una vuelta completa mientras la cámara avanza. Se usa para desorientar o para sueños y transiciones.',
  fn(t,S){const k=ss(t/6);setCam(S,{p:[0,1.5,lerp(6,2.8,k)],t:[0,1.3,0],fov:38,roll:k*PI*2})}});
add({id:'leadingshot',cat:'mov',es:'Travelling de retroceso',en:'leading shot, camera moving backward in front of the subject',dur:8,what:'La cámara va delante del personaje y retrocede mientras él avanza.',look:'Le vemos la cara todo el tiempo mientras camina. Es el opuesto del seguimiento por la espalda.',
  fn(t,S){const z=lerp(-9,3,t/8);S.A.z=z;S.A.walk=z*3.7;S.A.amp=1;S.A.headYaw=0;setCam(S,{p:[.2,1.5,z+3.2],t:[0,1.3,z],fov:40})}});
add({id:'fpv',cat:'mov',es:'Dron FPV',en:'FPV drone shot',dur:8,what:'Un dron de carreras que vuela rápido, bajo y con giros inclinados.',look:'La cámara se ladea en las curvas y pasa rozando al personaje. Da velocidad y vértigo.',
  fn(t,S){const P=u=>[2.3*Math.sin(u*9),1.7+1.1*Math.sin(u*7+1),lerp(32,-20,u)];const u=t/8,a=P(u),b=P(u+.03);S.A.wave=1;setCam(S,{p:a,t:b,fov:74,roll:-.5*Math.cos(u*9)})}});

/* LENTE (más) */
add({id:'macro',cat:'lente',es:'Macro',en:'macro shot, extreme detail',dur:7,what:'Un lente que enfoca a muy pocos centímetros y agranda objetos pequeños.',look:'La taza llena el cuadro y todo lo que no está a su distancia se desenfoca.',
  fn(t,S){S.props.mug=true;S.A.vis=false;const a=.5*Math.sin(t/7*PI*2);setCam(S,{p:[.85+.42*Math.sin(.6+a*.4),.9,.3+.42*Math.cos(.6+a*.4)],t:[.86,.83,.3],fov:22});S.post.blur={fg:0,mid:0,bg:17}}});
add({id:'tiltshift',cat:'lente',es:'Tilt-shift',en:'tilt-shift miniature effect',dur:8,what:'Un lente que inclina el plano de foco. Deja nítida solo una franja y hace que todo parezca una maqueta.',look:'Arriba y abajo quedan borrosos y los colores van saturados: el set parece de juguete.',
  fn(t,S){S.tt=t*2.4;walkX(S.A,t,4,-4,4);S.B.vis=true;S.B.z=-3;walkX(S.B,t+2,5,5,-5);S.B.z=-3;const k=t/8;setCam(S,{p:[6-1.5*k,9,14],t:[-2,0,-4],fov:30});S.post.tilt=1;S.post.css={filter:'saturate(1.55) contrast(1.08)'}}});
add({id:'flare',cat:'lente',es:'Lens flare',en:'lens flare, shooting into the sun',dur:7,what:'Destellos y círculos de luz que aparecen cuando una fuente fuerte pega directo en el lente.',look:'El sol está dentro del cuadro y deja una fila de reflejos que se mueve con la cámara.',
  fn(t,S){S.look=mk(Object.assign({},LOOKS.golden,{sunP:[-2.4,1.9,-8],hemi:.62}));S.props.sunDisc=true;S.post.flare=true;const x=1.1*Math.sin(t/7*PI*2);setCam(S,{p:[.6+x,1.25,4.2],t:[0,1.5,0],fov:36})}});
add({id:'vignette',cat:'lente',es:'Viñeta',en:'subtle vignette',dur:7,what:'Las esquinas del cuadro se oscurecen.',look:'El ojo se va al centro. Muy marcada se ve antigua; suave casi no se nota, pero ordena la imagen.',
  fn(t,S){setCam(S,{p:[.3,1.45,3.4],t:[0,1.25,0],fov:36});const k=t<2.5?0:t<3.3?ss((t-2.5)/.8):1;S.post.vig=k;S.cap=k<.5?_t('Sin viñeta'):_t('Con viñeta')}});
add({id:'grain',cat:'lente',es:'Grano de película',en:'35mm film grain',dur:7,what:'La textura granulada de la película fotográfica o de un sensor con mucha sensibilidad.',look:'Una capa de puntos que cambia en cada cuadro. Quita el aspecto demasiado limpio del video digital.',
  fn(t,S){setCam(S,{p:[.3,1.45,3.4],t:[0,1.25,0],fov:36});const on=t>=3;S.post.grain=on?1:0;S.cap=on?_t('Con grano'):_t('Sin grano')}});
add({id:'exposure',cat:'lente',es:'Exposición',en:'underexposed / overexposed',dur:9,what:'Cuánta luz registra la imagen. La deciden la apertura, la obturación y la sensibilidad.',look:'Subexpuesta pierde detalle en las sombras; sobreexpuesta quema el cielo y las zonas claras.',
  fn(t,S){setCam(S,{p:[.3,1.45,3.4],t:[0,1.25,0],fov:36});const i=Math.floor(t/3)%3,p=(i+2)%3,E=[-1.6,0,1.5],k=ss((t-i*3)/.6),e=lerp(E[p],E[i],k);S.post.css={filter:'brightness('+Math.pow(2,e).toFixed(3)+')'};S.cap=[_t('Subexpuesta'),_t('Exposición correcta'),_t('Sobreexpuesta')][i]}});

/* TIEMPO */
function integ(t,speed){let s=0;const n=48,dt=t/n;for(let i=0;i<n;i++)s+=speed((i+.5)*dt)*dt;return s}
add({id:'slowmo',cat:'tiempo',es:'Cámara lenta',en:'slow motion',dur:9,what:'La acción se ve más lenta que en la realidad. Se filma a muchos cuadros por segundo y se reproduce a 24.',look:'La misma acción, primero a velocidad normal y después al 25 %. El gesto se vuelve legible y pesa más.',
  fn(t,S){const nrm=t<3,kt=nrm?Math.min(.3+t,2.1):.5+(t-3)*.25;S.A.act=['roundhouse',kt];S.A.ry=PI/2;setCam(S,{p:[.3,1.25,4.3],t:[0,1.05,0],fov:38});S.cap=nrm?_t('Velocidad normal'):_t('Cámara lenta: 25 %')},
  fnS(t,S){const tau=t<3?t:3+(t-3)*.25;S.tt=tau;setCam(S,{p:[0,1.4,5.2],t:[0,1.1,0],fov:36});walkX(S.A,tau,3,-3.6,3.6);S.A.wave=1;S.cap=t<3?_t('Velocidad normal'):_t('Cámara lenta: 25 %')}});
add({id:'speedramp',cat:'tiempo',es:'Speed ramp',en:'speed ramp',dur:7,what:'La velocidad cambia dentro del mismo plano: rápido, lento y rápido otra vez.',look:'La acción arranca rápido, el tiempo se frena en el momento clave y vuelve a acelerar. Muy usado en acción y videoclips.',
  fn(t,S){const sp=x=>lerp(1.5,.12,ss((x-1.6)/.5))+(x>4.4?lerp(0,1.38,ss((x-4.4)/.5)):0);const tau=integ(t,sp);S.A.act=['kick',Math.min(3.35,.2+tau*.55)];S.A.ry=PI/2;setCam(S,{p:[.3,1.25,4.4],t:[0,1.05,0],fov:38});S.cap=sp(t)<.6?_t('Lento'):_t('Rápido')},
  fnS(t,S){const sp=x=>lerp(1.5,.12,ss((x-1.6)/.5))+(x>4.4?lerp(0,1.38,ss((x-4.4)/.5)):0);const tau=integ(t,sp);S.tt=tau;setCam(S,{p:[0,1.3,5.6],t:[0,1.15,0],fov:36});
    S.A.x=lerp(-4,4,tau/4.6);S.A.ry=PI/2;S.A.walk=S.A.x*3.7;S.A.amp=1;S.A.headYaw=0;const j=clamp((tau-2.3)/.5,0,1);S.A.y=4*.42*j*(1-j);S.A.wave=j>0&&j<1?1:0;const slow=sp(t)<.6;S.cap=slow?_t('Lento'):_t('Rápido')}});
add({id:'timelapse',cat:'tiempo',es:'Timelapse',en:'timelapse',dur:10,what:'Se toma un cuadro cada varios segundos y se reproduce a velocidad normal: horas en segundos.',look:'El sol cruza el cielo, las sombras giran, anochece y se encienden las luces, todo en diez segundos.',
  fn(t,S){const u=t/10,K=[[0,LOOKS.day],[.4,LOOKS.day],[.56,LOOKS.golden],[.66,LOOKS.blue],[.76,LOOKS.night],[.9,LOOKS.night],[1,LOOKS.day]];let i=0;while(i<K.length-2&&u>=K[i+1][0])i++;
    const L=mixLook(mk(K[i][1]),mk(K[i+1][1]),ss((u-K[i][0])/(K[i+1][0]-K[i][0])));const a=lerp(2.9,-.25,clamp(u/.62,0,1));L.sunP=[Math.cos(a)*8,Math.max(.25,Math.sin(a)*8),3.5];if(u>.62&&u<.9)L.sun=0;S.look=L;
    S.tt=t*9;walkX(S.A,t,1.1,-5,5);S.B.vis=true;walkX(S.B,t+.4,1.4,5,-5);S.B.z=2;setCam(S,{p:[3,3.4,11.5],t:[-1.2,1.2,-3],fov:40});S.cap=u<.56?_t('Día'):u<.7?_t('Atardecer'):u<.9?_t('Noche'):_t('Amanece')}});
add({id:'freeze',cat:'tiempo',es:'Freeze frame',en:'freeze frame',dur:7,what:'La imagen se congela en un cuadro mientras el tiempo de la película sigue.',look:'El movimiento se detiene de golpe en mitad del gesto. Se usa para presentar a un personaje o cerrar una escena.',
  fn(t,S){const fr=t>=2.4&&t<4.6,tau=t<2.4?t:t<4.6?2.4:t-2.2;S.tt=tau;setCam(S,{p:[0,1.4,5],t:[0,1.1,0],fov:36});walkX(S.A,tau,4.8,-4,4);S.A.wave=1;S.cap=fr?_t('Freeze frame'):'';if(fr)S.post.css={filter:'contrast(1.12) saturate(.75)'}}});
add({id:'bullettime',cat:'tiempo',es:'Bullet time',en:'bullet time, frozen moment with orbiting camera',dur:7,what:'El tiempo se congela, o casi, mientras la cámara sigue moviéndose alrededor.',look:'El personaje queda congelado en plena acción (la patada o el salto) y la cámara lo rodea.',
  fn(t,S){const fr=t>=.32&&t<5.7,kt=t<.32?1.55+t:fr?1.87:1.87+(t-5.7);S.A.act=['kick',kt];S.A.ry=PI/2;S.A.headYaw=0;const a=fr?ss((t-.32)/5.38)*PI*1.7:(t<.32?0:PI*1.7);setCam(S,{p:[Math.sin(a)*3.3,1.3,Math.cos(a)*3.3],t:[0,1.15,0],fov:38});S.cap=fr?_t('Tiempo congelado'):_t('Tiempo normal')},
  fnS(t,S){const fr=t>=.32&&t<5.7,tau=t<.32?t:fr?.32:.32+(t-5.7);const j=clamp(tau/.64,0,1);S.tt=1.1;S.A.y=4*.5*j*(1-j);S.A.wave=1;S.A.walk=1.1;S.A.amp=fr||j<1?1:0;S.A.headYaw=0;
    const a=fr?ss((t-.32)/5.38)*PI*1.7:(t<.32?0:PI*1.7);setCam(S,{p:[Math.sin(a)*3.3,1.25,Math.cos(a)*3.3],t:[0,1.35,0],fov:38});S.cap=fr?_t('Tiempo congelado'):_t('Tiempo normal')}});
add({id:'threepoint',cat:'luz',es:'Iluminación de tres puntos',en:'three-point lighting',dur:9,what:'El esquema base: key, fill y rim trabajando juntas.',look:'Las tres luces se encienden una por una. La key da forma, el fill controla el contraste y el rim separa del fondo.',
  fn(t,S){const f=ss((t-3)/.7),r=ss((t-6)/.7);S.look=mk(Object.assign({},LOOKS.studio,{fill:.6*f,rim:2.4*r}));S.props.set=false;S.props.lg=true;setCam(S,LC(t));S.cap=t<3?_t('Key'):t<6?_t('Key + fill'):_t('Key + fill + rim')}});
add({id:'split',cat:'luz',es:'Luz lateral',en:'split lighting, side lighting',dur:6,what:'La luz principal viene de un costado, a 90 grados de la cámara.',look:'La cara queda partida en dos: una mitad iluminada y la otra en sombra. Sugiere conflicto o doble cara.',
  fn(t,S){S.look=mk(Object.assign({},LOOKS.studio,{sunP:[4,1.5,.05],sun:1.5,hemi:.03}));S.props.set=false;S.props.lg=true;setCam(S,{p:[.12*Math.sin(t*.7),1.58,2.1],t:[0,1.45,0],fov:30});S.A.headYaw=0}});
add({id:'under',cat:'luz',es:'Luz desde abajo',en:'underlighting, lit from below',dur:6,what:'La fuente está por debajo de la cara.',look:'Las sombras suben en vez de bajar, al revés de como estamos acostumbrados. Por eso se siente siniestra.',
  fn(t,S){S.look=mk(Object.assign({},LOOKS.studio,{sun:0,fill:1.5,fillC:'#ffd9a8',fillP:[.25,-2.4,1.6],hemi:.03}));S.props.set=false;setCam(S,{p:[.12*Math.sin(t*.7),1.58,2.1],t:[0,1.45,0],fov:30});S.A.headYaw=0}});
add({id:'toplight',cat:'luz',es:'Luz cenital',en:'top light, overhead lighting',dur:6,what:'La luz cae justo desde arriba.',look:'Se iluminan la coronilla y los hombros, y los ojos quedan en sombra. Da un aire de interrogatorio o de mediodía duro.',
  fn(t,S){S.look=mk(Object.assign({},LOOKS.studio,{sunP:[.1,6,.35],sun:1.6,hemi:.03}));S.props.set=false;S.props.lg=true;setCam(S,{p:[.12*Math.sin(t*.7),1.58,2.1],t:[0,1.45,0],fov:30});S.A.headYaw=0}});
add({id:'neon',cat:'luz',es:'Luz de neón',en:'neon lighting, magenta and cyan',dur:7,what:'Dos luces de colores saturados y opuestos, típicas de escenas nocturnas urbanas.',look:'Un lado del personaje es magenta y el otro cian. El color de la luz reemplaza al color real de las cosas.',
  fn(t,S){S.look=mk({skyTop:'#070512',skyBot:'#1c1038',fog:'#150c2b',fogD:.022,hemi:.1,hemiSky:'#6a4dff',hemiGnd:'#0b0616',sun:1.25,sunC:'#ff2e88',sunP:[-4,2.2,2.6],fill:1.05,fillC:'#18d5e6',fillP:[4,1.8,1.6],ground:'#1c1830',foliage:'#1a2440'});
    S.props.lights=true;setCam(S,{p:[.6*Math.sin(t/7*PI*2),1.5,2.7],t:[0,1.4,0],fov:36})}});
add({id:'moonlight',cat:'luz',es:'Luz de luna',en:'moonlight, cool blue night lighting',dur:7,what:'En cine la noche se ilumina con una luz azul y fría que imita la luna.',look:'Hay sombras definidas y todo tira a azul, pero se ve lo suficiente para seguir la acción.',
  fn(t,S){S.look=mk(Object.assign({},LOOKS.night,{lamp:0,sun:.62,sunC:'#a9c0ff',sunP:[-4,7,3],hemi:.17}));const k=ss(t/7);setCam(S,{p:[1.6,1.3,lerp(6.8,5.6,k)],t:[0,1.1,0],fov:38})}});

/* COLOR (más) */
add({id:'saturation',cat:'color',es:'Saturación',en:'desaturated colors / vivid saturated colors',dur:9,what:'Qué tan intensos son los colores, de casi grises a muy vivos.',look:'El mismo plano desaturado, normal y saturado. Menos saturación se siente seria o triste; más, alegre o artificial.',
  fn(t,S){conv(S);setCam(S,SH.wide);const i=Math.floor(t/3)%3;S.post.css={filter:['saturate(.18)','none','saturate(1.9)'][i]};S.cap=[_t('Desaturado'),_t('Normal'),_t('Saturado')][i]}});
add({id:'contrast',cat:'color',es:'Contraste',en:'high contrast / low contrast, flat look',dur:9,what:'La diferencia entre las zonas más claras y las más oscuras.',look:'Con poco contraste todo se ve suave y lavado. Con mucho, los negros se cierran y la imagen se vuelve dura.',
  fn(t,S){conv(S);setCam(S,SH.wide);const i=Math.floor(t/3)%3;S.post.css={filter:['contrast(.58) brightness(1.08)','none','contrast(1.7)'][i]};S.cap=[_t('Bajo contraste'),_t('Normal'),_t('Alto contraste')][i]}});
add({id:'triadic',cat:'color',es:'Tríada de color',en:'triadic color scheme',dur:6,what:'Tres colores separados por la misma distancia en el círculo cromático.',look:'Rojo, verde y violeta azulado conviven sin que ninguno domine. Es un esquema vistoso, típico de animación.',
  fn(t,S){conv(S);S.look=mk({skyTop:'#3f3aa8',skyBot:'#8a84e6',fog:'#7d77dc',fogD:.016,hemi:.78,hemiSky:'#d9d6ff',hemiGnd:'#3f7a4a',sunP:[-1.5,8,7],ground:'#3fa85a',foliage:'#2c8a48'});S.A.shirt='#e2462e';S.B.shirt='#e2462e';
    setCam(S,{p:[.5*Math.sin(t*PI/3),1.5,4.6],t:[0,1.2,0],fov:36});S.hud=wheel([10,130,250])}});
add({id:'accent',cat:'color',es:'Color de acento',en:'muted palette with a single red accent',dur:7,what:'Todo el cuadro va apagado y un solo elemento lleva un color fuerte.',look:'El fondo pierde el color y el personaje lo conserva. El ojo va directo ahí.',
  fn(t,S){setCam(S,{p:[.6*Math.sin(t/7*PI*2),1.4,5],t:[0,1.15,0],fov:36});S.A.shirt='#e02a1e';S.A.wave=pp(t,7,.3);S.post.blur={fg:0,mid:0,bg:0};S.post.accent=true}});

/* EDICIÓN (más) */
add({id:'cutaction',cat:'edicion',es:'Corte en movimiento',en:'cut on action',dur:5,what:'El corte cae en mitad de un movimiento, que continúa en el plano siguiente.',look:'El brazo empieza a subir en el plano general y termina de subir en el plano medio. El ojo sigue el gesto y no nota el corte.',
  fn(t,S){const w=ss((t-.9)/1.3)*(1-ss((t-4)/.8));S.A.wave=w;S.A.waveF=0;S.A.headYaw=0;const b=t>=1.5&&t<4.2;setCam(S,b?{p:[.2,1.5,2.0],t:[.15,1.45,0],fov:38}:{p:[0,1.3,5.8],t:[0,1.1,0],fov:38});S.cap=b?_t('Plano 2: el gesto continúa'):_t('Plano 1: el gesto empieza')}});
add({id:'eyeline',cat:'edicion',es:'Raccord de mirada',en:'eyeline match',dur:7,what:'Un personaje mira algo fuera de cuadro y el plano siguiente muestra qué mira.',look:'Primero la mirada, después el objeto de la mirada. El espectador une los dos planos sin que nadie se lo explique.',
  fn(t,S){S.B.vis=true;S.B.x=5;S.B.z=2;S.B.ry=-1.2;S.B.wave=1;const b=t>=3.2;S.A.headYaw=.95*ss((t-.6)/.9);
    setCam(S,b?{p:[.5,1.6,.25],t:[5,1.35,2],fov:30}:{p:[-.35,1.62,1.15],t:[0,1.63,0],fov:30});S.cap=b?_t('Lo que mira'):_t('Mira fuera de cuadro')}});
add({id:'reaction',cat:'edicion',es:'Plano de reacción',en:'reaction shot',dur:7,what:'Un plano de quien escucha o recibe la acción, no de quien la hace.',look:'B sigue hablando, pero la cámara se queda con A. Muchas veces la reacción dice más que la frase.',
  fn(t,S){conv(S);const r=t>=3;S.B.talk=1;S.A.nod=r?.1+.09*Math.sin(t*4.5):0;setCam(S,r?SH.a:SH.b);S.cap=r?_t('Reacción: A escucha'):_t('Acción: B habla')}});
add({id:'crosscut',cat:'edicion',es:'Montaje paralelo',en:'cross-cutting between two locations',dur:9.6,what:'Se alternan dos acciones que ocurren al mismo tiempo en lugares distintos.',look:'A viene caminando y B espera junto al farol. Al intercalarlos entendemos que se van a encontrar, y crece la tensión.',
  fn(t,S){const i=Math.floor(t/1.6)%2;S.A.z=4;walkX(S.A,t,9.6,-12,-5);S.A.z=4;S.B.vis=true;S.B.x=LAMP[0]+.8;S.B.z=LAMP[1]+.3;S.B.ry=-.7;S.B.headYaw=.6*Math.sin(t*1.3);
    setCam(S,i?{p:[1.4,1.5,.4],t:[S.B.x,1.4,S.B.z],fov:36}:{p:[S.A.x,1.4,8.2],t:[S.A.x,1.1,4],fov:38});S.cap=i?_t('Lugar 2: B espera'):_t('Lugar 1: A viene en camino')}});
add({id:'wipe',cat:'edicion',es:'Cortinilla',en:'wipe transition',dur:8,what:'Una línea recorre la pantalla y el plano nuevo va tapando al anterior.',look:'Es una transición visible, a propósito. Hoy se usa con intención de estilo o de época.',
  fn(t,S,S2){setCam(S,{p:[0,1.3,6.4],t:[0,1.05,0],fov:38});S2.A.vis=false;setCam(S2,{p:[.6,2.5,8],t:[-5.6,1.7,-8],fov:42});const k=t<2.4?0:t<3.8?ss((t-2.4)/1.4):t<6.2?1:1-ss((t-6.2)/1.4);S.post.wipeMix=k;S.cap=k>0&&k<1?_t('Cortinilla'):''}});
add({id:'splitscreen',cat:'edicion',es:'Pantalla dividida',en:'split screen',dur:7,what:'Dos planos distintos se muestran al mismo tiempo, uno al lado del otro.',look:'Cada mitad tiene su propia cámara y su propio lugar. Clásico de llamadas telefónicas y de acciones simultáneas.',
  fn(t,S,S2){[S,S2].forEach(s=>{s.B.vis=true;s.B.x=LAMP[0]+.8;s.B.z=LAMP[1]+.3;s.B.ry=-.3;const a=Math.floor(t/1.75)%2===0;s.A.talk=a?1:0;s.B.talk=a?0:1;s.A.headYaw=0});
    setCam(S,{p:[.2,1.45,2.5],t:[0,1.35,0],fov:38});setCam(S2,{p:[S.B.x-.5,1.45,S.B.z+2.5],t:[S.B.x,1.35,S.B.z],fov:38});S.post.split=true}});

/* DIRECCIÓN */
add({id:'blocking',cat:'direccion',es:'Blocking',en:'the subject walks from the background toward the camera',dur:9,what:'Cómo se mueven los actores dentro del espacio y respecto a la cámara.',look:'La cámara no se mueve ni corta. El personaje camina hacia ella y el mismo plano pasa de general a medio y a primer plano.',
  fn(t,S){const z=lerp(-11,2.1,ss(t/6.5));S.A.z=z;S.A.walk=z*3.7;S.A.amp=t<6.5?1:0;S.A.headYaw=0;setCam(S,{p:[0,1.58,3.2],t:[0,1.45,-4],fov:38});const d=3.2-z;S.cap=d>5.5?_t('Plano general'):d>2.3?_t('Plano medio'):_t('Primer plano')}});
add({id:'coverage',cat:'direccion',es:'Cobertura',en:'master shot, singles and over-the-shoulder shots',dur:12.6,what:'El conjunto de planos que se filman de una misma escena para poder editarla.',look:'La misma conversación desde siete posiciones. En IA es tu lista de planos por escena: master, singles, sobre el hombro y detalle.',
  fn(t,S){conv(S);S.props.mug=true;S.props.table=[0,0];const a=Math.floor(t/1.8)%2===0;S.A.talk=a?1:0;S.B.talk=a?0:1;const i=Math.floor(t/1.8)%7;
    setCam(S,[SH.wide,{p:[0,1.45,3.0],t:[0,1.3,0],fov:38},SH.a,SH.b,SH.ots,SH.otsB,{p:[.25,1.3,1.15],t:[.05,.84,.05],fov:22}][i]);
    S.cap=[_t('Master: plano general'),'Two-shot',_t('Single de A'),_t('Single de B'),_t('Sobre el hombro de B'),_t('Sobre el hombro de A'),_t('Insert: la taza')][i];S.badge=(i+1)+' / 7'}});
add({id:'oner',cat:'direccion',es:'Plano secuencia',en:'long take, one continuous shot, no cuts',dur:15,what:'Una escena completa filmada en un solo plano, sin cortes.',look:'La cámara hace de editor: empieza abierta, acompaña al personaje, pasa por el two-shot y termina en primer plano, todo sin cortar.',
  fn(t,S){conv(S);const ax=lerp(-6.5,-.8,ss(t/6.5));S.A.x=ax;S.A.walk=ax*3.7;S.A.amp=t<6.5?1:0;S.A.talk=t>9?1:0;S.B.headYaw=t<6.5?.5:0;
    const K=[[0,[-7,4.2,8.5],[-6,1,0]],[3.5,[-3.6,1.6,4.6],[-3.4,1.2,0]],[7,[0,1.5,4.4],[0,1.2,0]],[10.5,[1.55,1.64,.35],[-.8,1.48,0]],[13.5,[.75,1.57,.9],[-.8,1.52,0]],[15,[.75,1.57,.9],[-.8,1.52,0]]];
    let i=0;while(i<K.length-2&&t>=K[i+1][0])i++;const k=ss((t-K[i][0])/(K[i+1][0]-K[i][0]));S.cam.p=K[i][1].map((v,j)=>lerp(v,K[i+1][1][j],k));S.cam.t=K[i][2].map((v,j)=>lerp(v,K[i+1][2][j],k));S.cam.fov=36;S.cap=_t('Sin cortes')}});

