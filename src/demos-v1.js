/* ENCUADRE */
add({id:'ews',cat:'encuadre',es:'Gran plano general',en:'extreme wide shot',dur:9,what:'El lugar domina el cuadro y el personaje se ve pequeño.',look:'El personaje casi se pierde entre los árboles. Sirve para ubicar, dar escala o mostrar soledad.',
  fn(t,S){setCam(S,{p:[0,2.4,34],t:[0,2.6,0],fov:30});walkX(S.A,t,9,-3,3)}});
add({id:'wide',cat:'encuadre',es:'Plano general',en:'wide shot',dur:6,what:'Cuerpo entero con su entorno.',look:'Se ve de la cabeza a los pies y queda aire alrededor. Presenta la escena y la acción.',
  fn(t,S){setCam(S,{p:[0,1.3,6.4],t:[0,1.05,0],fov:38});S.A.wave=pp(t,6,.3)}});
add({id:'medium',cat:'encuadre',es:'Plano medio',en:'medium shot',dur:6,what:'De la cintura hacia arriba. Es el plano neutro del diálogo.',look:'Se leen los gestos de brazos y cara a la vez.',
  fn(t,S){setCam(S,{p:[0,1.38,2.0],t:[0,1.34,0],fov:38});S.A.talk=1}});
add({id:'closeup',cat:'encuadre',es:'Primer plano',en:'close-up',dur:6,what:'El rostro llena el cuadro.',look:'El fondo deja de importar: todo es la expresión.',
  fn(t,S){setCam(S,{p:[0,1.63,.98],t:[0,1.63,0],fov:30})}});
add({id:'ecu',cat:'encuadre',es:'Primerísimo primer plano',en:'extreme close-up',dur:6,what:'Un solo detalle: los ojos, una mano, un objeto.',look:'Solo caben los ojos. Se usa para tensión o énfasis.',
  fn(t,S){setCam(S,{p:[0,1.655,.44],t:[0,1.655,0],fov:22});S.A.headYaw=.07*Math.sin(t*1.1)}});
add({id:'insert',cat:'encuadre',es:'Plano detalle',en:'insert shot',dur:6,what:'Un objeto ocupa todo el cuadro para dar una información clave.',look:'La taza es el único sujeto. En un guion sería la carta, el arma o el reloj.',
  fn(t,S){S.props.mug=true;const k=t/6;setCam(S,{p:[1.3-.1*k,1.22,1.35-.2*k],t:[.85,.82,.3],fov:24})}});
add({id:'ots',cat:'encuadre',es:'Over the shoulder',en:'over-the-shoulder shot',dur:6,what:'La cámara mira por encima del hombro de un personaje hacia el otro.',look:'El hombro y la nuca de uno enmarcan al que habla. Es el plano clásico de conversación.',
  fn(t,S){conv(S);setCam(S,SH.ots);S.A.talk=1}});
add({id:'pov',cat:'encuadre',es:'Plano subjetivo',en:'POV shot',dur:6,what:'Lo que ve el personaje con sus propios ojos.',look:'En la vista del set la cámara ocupa el lugar de la cabeza del personaje A.',
  fn(t,S){conv(S);S.A.vis=false;S.B.talk=1;setCam(S,{p:[-.7,1.6+.012*Math.sin(t*3.1),.02*Math.sin(t*1.7)],t:[.8+.0,1.55,.06*Math.sin(t*.9)],fov:50});S.cap='Lo que ve el personaje A'}});
add({id:'establishing',cat:'encuadre',es:'Establishing shot',en:'establishing shot',dur:7,what:'Vista amplia del lugar al abrir una escena.',look:'Antes de entrar a la casa, se muestra la casa. Le dice al espectador dónde y cuándo estamos.',
  fn(t,S){const k=ss(t/7);S.A.vis=false;setCam(S,{p:[1.5-1.2*k,2.7-.3*k,9.5-2*k],t:[-5.6,1.7,-8],fov:42});S.cap='Ext. casa, día'}});

/* ÁNGULO */
add({id:'eye',cat:'angulo',es:'A nivel de ojos',en:'eye-level shot',dur:7,what:'La cámara está a la altura de los ojos del personaje.',look:'Es el ángulo neutro: no opina sobre el personaje.',
  fn(t,S){setCam(S,ANG);S.cam.p[0]=.5*Math.sin(t*PI*2/7)}});
add({id:'high',cat:'angulo',es:'Picado',en:'high angle shot',dur:7,what:'La cámara está arriba y mira hacia abajo.',look:'El personaje se ve más pequeño y vulnerable.',
  fn(t,S){camLerp(S,ANG,{p:[0,4.3,2.5],t:[0,.95,0],fov:38},angK(t))}});
add({id:'low',cat:'angulo',es:'Contrapicado',en:'low angle shot',dur:7,what:'La cámara está abajo y mira hacia arriba.',look:'El personaje crece contra el cielo: poder o amenaza.',
  fn(t,S){camLerp(S,ANG,{p:[0,.22,2.5],t:[0,1.35,0],fov:38},angK(t))}});
add({id:'topdown',cat:'angulo',es:'Cenital',en:'top-down shot',dur:7,what:'La cámara mira justo desde arriba.',look:'El personaje se vuelve una forma sobre el piso. Da geometría y distancia.',
  fn(t,S){camLerp(S,ANG,{p:[0,7.2,.04],t:[0,0,0],fov:38},angK(t));S.A.wave=.5}});
add({id:'dutch',cat:'angulo',es:'Plano holandés',en:'dutch angle',dur:7,what:'La cámara se inclina y el horizonte queda torcido.',look:'El horizonte deja de estar nivelado. Comunica inestabilidad.',
  fn(t,S){camLerp(S,ANG,Object.assign({},ANG,{roll:.4}),angK(t))}});

/* MOVIMIENTO */
add({id:'static',cat:'mov',es:'Cámara fija',en:'static shot, locked-off camera',dur:5.5,what:'La cámara no se mueve; el movimiento lo pone el personaje.',look:'El personaje entra y sale del cuadro. Es lo más estable al generar video con IA.',
  fn(t,S){setCam(S,{p:[0,1.4,6],t:[0,1.1,0],fov:38});walkX(S.A,t,5.5,-5.5,5.5)}});
add({id:'pan',cat:'mov',es:'Paneo',en:'pan left / pan right',dur:7,what:'La cámara gira horizontalmente sobre su propio eje, sin cambiar de lugar.',look:'En la vista del set la cámara rota como una cabeza que dice que no; no se desplaza.',
  fn(t,S){walkX(S.A,t,7,-5,5);setCam(S,{p:[0,1.5,5.5],t:[S.A.x,1.1,0],fov:34})}});
add({id:'tilt',cat:'mov',es:'Tilt',en:'tilt up / tilt down',dur:6,what:'La cámara gira verticalmente sobre su eje.',look:'Recorre al personaje de los pies a la cabeza sin subir ni bajar de altura.',
  fn(t,S){setCam(S,{p:[0,1.2,2.4],t:[0,lerp(.12,1.78,pp(t,6)),0],fov:28})}});
add({id:'dolly',cat:'mov',es:'Dolly in / dolly out',en:'dolly in, slow push-in',dur:7,what:'La cámara se acerca o se aleja físicamente del sujeto.',look:'El fondo cambia de tamaño a un ritmo distinto que el personaje: hay paralaje. Comparalo con el zoom.',
  fn(t,S){setCam(S,{p:[0,1.45,lerp(7,2.2,pp(t,7))],t:[0,1.3,0],fov:38})}});
add({id:'zoom',cat:'mov',es:'Zoom',en:'zoom in / zoom out',dur:7,what:'La cámara no se mueve; cambia la distancia focal del lente.',look:'En la vista del set la cámara queda quieta y solo se cierra el encuadre. Todo se agranda parejo, sin paralaje.',
  fn(t,S){setCam(S,{p:[0,1.45,7],t:[0,1.3,0],fov:lerp(38,10.5,pp(t,7))})}});
add({id:'tracking',cat:'mov',es:'Tracking / travelling',en:'tracking shot, truck left / right',dur:7,what:'La cámara se desplaza acompañando al personaje.',look:'El personaje se queda en el mismo lugar del cuadro y lo que pasa es el fondo.',
  fn(t,S){walkX(S.A,t,7,-5,5);setCam(S,{p:[S.A.x,1.4,5],t:[S.A.x,1.1,0],fov:38})}});
add({id:'crane',cat:'mov',es:'Grúa',en:'crane shot, pedestal up',dur:7,what:'La cámara sube o baja por el aire.',look:'Arranca a ras del piso y termina arriba mirando hacia abajo. Da escala y cierra o abre escenas.',
  fn(t,S){const k=pp(t,7);setCam(S,{p:[0,lerp(.5,6.2,k),lerp(6,4.4,k)],t:[0,1.1,0],fov:38})}});
add({id:'orbit',cat:'mov',es:'Órbita',en:'orbit shot, arc shot',dur:9,what:'La cámara gira alrededor del sujeto.',look:'El personaje queda en el centro y el fondo da toda la vuelta.',
  fn(t,S){const a=t/9*PI*2;setCam(S,{p:[Math.sin(a)*3.6,1.6,Math.cos(a)*3.6],t:[0,1.2,0],fov:38});S.A.headYaw=0}});
add({id:'handheld',cat:'mov',es:'Cámara en mano',en:'handheld camera',dur:6,what:'La cámara la sostiene una persona y tiembla un poco.',look:'El encuadre respira y nunca queda quieto. Da realismo o urgencia.',
  fn(t,S){const n=(s)=>Math.sin(t*2.3+s)*.5+Math.sin(t*5.1+s*2.1)*.3+Math.sin(t*9.7+s*3.3)*.2;
    setCam(S,{p:[.05*n(1),1.5+.04*n(2),2.6+.04*n(3)],t:[.07*n(4),1.33+.06*n(5),0],fov:38,roll:.018*n(6)});S.A.talk=1}});
add({id:'steadicam',cat:'mov',es:'Steadicam / gimbal',en:'steadicam shot, smooth follow',dur:8,what:'La cámara sigue al personaje con un movimiento fluido, sin temblor.',look:'Va detrás del personaje por un camino con curvas y el cuadro se mantiene estable.',
  fn(t,S){const path=z=>[1.2*Math.sin(z*.45),z];const z=lerp(4,-9,t/8);const a=path(z),b=path(z-.1),c=path(z+2.5);
    S.A.x=a[0];S.A.z=a[1];S.A.ry=Math.atan2(b[0]-a[0],b[1]-a[1]);S.A.walk=z*3.7;S.A.amp=1;S.A.headYaw=0;setCam(S,{p:[c[0],1.6,c[1]],t:[a[0],1.25,a[1]],fov:42})}});
add({id:'drone',cat:'mov',es:'Dron / aéreo',en:'drone shot, aerial shot',dur:9,what:'Vista aérea en movimiento.',look:'La cámara avanza y desciende sobre el set. Se usa para abrir con escala.',
  fn(t,S){const k=ss(t/9);walkX(S.A,t,9,-2,2);setCam(S,{p:[lerp(-16,5,k),lerp(15,4.5,k),lerp(24,7.5,k)],t:[lerp(0,0,k),lerp(0,1,k),lerp(-4,0,k)],fov:45})}});
add({id:'whip',cat:'mov',es:'Whip pan',en:'whip pan',dur:4,what:'Un paneo tan rápido que la imagen se barre. Se usa como transición.',look:'Entre un personaje y el otro solo se ve un barrido.',
  fn(t,S){S.A.x=-3.2;S.B.vis=true;S.B.x=3.2;const k=t<1.6?0:t<1.84?ss((t-1.6)/.24):t<3.6?1:1-ss((t-3.6)/.24);
    setCam(S,{p:[0,1.5,5.5],t:[lerp(-3.2,3.2,k),1.3,0],fov:30});S.post.sub=12;S.post.shutter=.9}});
add({id:'dollyzoom',cat:'mov',es:'Dolly zoom',en:'dolly zoom',dur:6,what:'La cámara avanza mientras el lente se abre, o al revés.',look:'El personaje no cambia de tamaño, pero el fondo se estira o se le viene encima. Es el efecto vértigo.',
  fn(t,S){const d=lerp(7,1.9,pp(t,6,.05)),f=2*Math.atan(1.1/ d)*180/PI;setCam(S,{p:[0,1.42,d],t:[0,1.38,0],fov:f})}});
add({id:'rack',cat:'mov',es:'Rack focus',en:'rack focus',dur:7,what:'El foco pasa de un objeto a otro dentro del mismo plano.',look:'Primero está nítida la planta de adelante y después el personaje. La cámara no se mueve.',
  fn(t,S){S.props.fg=true;setCam(S,{p:[-.25,1.5,3.2],t:[0,1.42,0],fov:26});const k=t<2?0:t<3?ss(t-2):t<5.6?1:1-ss((t-5.6)/1.2);
    S.post.blur={fg:lerp(0,11,k),mid:lerp(7,0,k),bg:lerp(13,7,k)};S.cap=k<.5?'Foco en la planta':'Foco en el personaje'}});

/* LENTE */
add({id:'focal',cat:'lente',es:'Distancia focal',en:'16mm wide-angle lens / 85mm lens',dur:12,what:'Define cuánto abarca el lente. Gran angular abarca mucho y exagera el espacio; teleobjetivo abarca poco y aplana.',look:'El personaje mide lo mismo en los cuatro lentes porque la cámara se aleja. Mirá cómo el fondo se acerca y se agranda.',
  fn(t,S){const F=[16,35,85,200],N=['gran angular','normal','teleobjetivo','teleobjetivo largo'];const i=Math.floor(t/3)%4,l=t-i*3,p=(i+3)%4;
    const mm=Math.exp(lerp(Math.log(F[p]),Math.log(F[i]),ss(l/.9)));const d=.85*mm/12;setCam(S,{p:[0,1.3,d],t:[0,1.3,0],fov:mm2fov(mm)});S.cap=F[i]+' mm, '+N[i];S.A.headYaw=0}});
add({id:'aperture',cat:'lente',es:'Apertura',en:'f/1.8 aperture',dur:10,what:'El tamaño de la abertura del lente. Número f bajo deja entrar más luz y desenfoca más el fondo.',look:'A f/1.8 solo el personaje está nítido. A f/16 todo está en foco. La exposición está compensada para que solo cambie el desenfoque.',
  fn(t,S){S.props.fg=true;setCam(S,{p:[-.25,1.5,3.2],t:[0,1.42,0],fov:26});const N=['f/1.8','f/4','f/8','f/16'],B=[14,7,3,0],G=[11,5.5,2,0];
    const i=Math.floor(t/2.5)%4,l=t-i*2.5,p=(i+3)%4,k=ss(l/.7);S.post.blur={fg:lerp(G[p],G[i],k),mid:0,bg:lerp(B[p],B[i],k)};S.cap=N[i];S.lensNote=N[i]}});
add({id:'dof',cat:'lente',es:'Profundidad de campo',en:'shallow depth of field / deep focus',dur:8,what:'Cuánta parte de la imagen está en foco, de adelante hacia atrás.',look:'Con poca profundidad el fondo se disuelve y el personaje se separa. Con mucha, el lugar se lee completo.',
  fn(t,S){setCam(S,{p:[.2,1.52,2.6],t:[0,1.45,0],fov:28});const k=t<3?1:t<4?1-ss(t-3):t<7?0:ss(t-7);S.post.blur={fg:0,mid:0,bg:13*k};S.cap=k>.5?'Shallow depth of field':'Deep focus'}});
add({id:'bokeh',cat:'lente',es:'Bokeh',en:'soft bokeh background',dur:7,what:'La forma que toman las luces desenfocadas del fondo.',look:'Cada punto de luz se convierte en un disco suave a medida que el fondo sale de foco.',
  fn(t,S){S.look=mk(Object.assign({},LOOKS.night,{fill:1.15,fillC:'#ffd9b0',fillP:[1.5,1.2,3],lamp:0,hemi:.3}));S.props.lights=true;setCam(S,{p:[.15,1.6,1.3],t:[0,1.6,0],fov:30});
    S.post.blur={fg:0,mid:0,bg:15*pp(t,7,.1)};S.post.bokeh=true}});
add({id:'fps',cat:'lente',es:'Cuadros por segundo',en:'24 fps',dur:12,what:'Cuántas imágenes se muestran por segundo. 24 es el estándar de cine.',look:'A 12 el movimiento se ve entrecortado, a 24 se ve como cine y a 60 muy fluido. Filmar a 60 o más sirve para cámara lenta.',
  fn(t,S){const i=Math.floor(t/4)%3;setCam(S,{p:[0,1.4,6],t:[0,1.1,0],fov:36});walkX(S.A,t,2.2,-4,4);S.post.fps=[12,24,0][i];S.cap=['12 fps: entrecortado','24 fps: cine','60 fps: fluido'][i]}});
add({id:'shutter',cat:'lente',es:'Velocidad de obturación',en:'natural motion blur, 24 fps film look',dur:12,what:'Cuánto tiempo se expone cada cuadro. Controla el barrido del movimiento.',look:'A 1/500 cada cuadro sale congelado y el movimiento se ve nervioso. A 1/48 hay un barrido natural. A 1/12 todo se embarra.',
  fn(t,S){const i=Math.floor(t/4)%3;setCam(S,{p:[0,1.4,4.4],t:[0,1.15,0],fov:36});walkX(S.A,t,2.6,-3.2,3.2);S.A.wave=1;S.A.waveF=15;
    S.post.fps=24;S.post.sub=14;S.post.shutter=[.04,.5,2][i];S.cap=['1/500 s: nítido y entrecortado','1/48 s: regla de 180°','1/12 s: barrido'][i]}});
add({id:'aspect',cat:'lente',es:'Relación de aspecto',en:'16:9 / 9:16 / 2.39:1 aspect ratio',dur:12.5,what:'La forma del cuadro: ancho dividido entre alto.',look:'El mismo plano recortado a cada formato. Fijate qué se pierde en vertical y qué gana el panorámico.',
  fn(t,S){conv(S);setCam(S,SH.wide);const R=[[16/9,'16:9, YouTube'],[2.39,'2.39:1, cine panorámico'],[4/3,'4:3, TV clásica'],[1,'1:1, cuadrado'],[9/16,'9:16, Reels y TikTok']];const i=Math.floor(t/2.5)%5;S.post.mask=R[i][0];S.cap=R[i][1];S.A.talk=1}});
add({id:'anamorphic',cat:'lente',es:'Anamórfico',en:'anamorphic lens, horizontal lens flare',dur:8,what:'Lente de cine panorámico que comprime la imagen a lo ancho.',look:'Tres señales: cuadro muy ancho, bokeh ovalado y destellos horizontales azules sobre las luces.',
  fn(t,S){S.look=mk(Object.assign({},LOOKS.night,{fill:1.15,fillC:'#ffd9b0',fillP:[1.5,1.2,3],lamp:0,hemi:.3}));S.props.lights=true;const x=.5*Math.sin(t/8*PI*2);
    setCam(S,{p:[x,1.58,1.9],t:[x*.4,1.56,0],fov:30});S.post.blur={fg:0,mid:0,bg:12};S.post.bokeh=true;S.post.anam=true;S.post.mask=2.39}});

/* LUZ */
add({id:'key',cat:'luz',es:'Key light',en:'key light from the left',dur:6,what:'La luz principal sobre el sujeto.',look:'Una sola luz a 45° modela la cara: un lado iluminado y el otro en sombra.',
  fn(t,S){const k=t<1.2?0:ss((t-1.2)/.6);S.look=mk(Object.assign({},LOOKS.studio,{sun:1.35*k,hemi:.06}));S.props.set=false;S.props.lg=true;setCam(S,LC(t));S.cap=k<.5?'Key light apagada':'Key light encendida'}});
add({id:'fill',cat:'luz',es:'Fill light',en:'soft fill light',dur:7,what:'Luz de relleno, más débil, que suaviza las sombras que deja la principal.',look:'El lado oscuro de la cara recupera detalle sin perder el volumen.',
  fn(t,S){const k=t<2.5?0:t<3.2?ss((t-2.5)/.7):1;S.look=mk(Object.assign({},LOOKS.studio,{fill:.62*k}));S.props.set=false;S.props.lg=true;setCam(S,LC(t));S.cap=k<.5?'Sin fill':'Con fill'}});
add({id:'rim',cat:'luz',es:'Rim light / contraluz',en:'rim light, backlight',dur:7,what:'Luz desde atrás que dibuja un borde brillante en la silueta.',look:'Aparece una línea de luz en hombros y cabeza que separa al personaje del fondo oscuro.',
  fn(t,S){const k=t<2.5?0:t<3.2?ss((t-2.5)/.7):1;S.look=mk(Object.assign({},LOOKS.studio,{sun:.8,rim:2.4*k}));S.props.set=false;S.props.lg=true;setCam(S,LC(t));S.cap=k<.5?'Sin rim':'Con rim'}});
add({id:'highkey',cat:'luz',es:'High-key',en:'high-key lighting',dur:6,what:'Todo iluminado y con pocas sombras.',look:'Poco contraste y fondo claro. Es el look de comedia y comerciales.',
  fn(t,S){S.look=mk(LOOKS.highkey);S.props.set=false;S.props.lg=true;setCam(S,LC(t))}});
add({id:'lowkey',cat:'luz',es:'Low-key',en:'low-key lighting, deep shadows',dur:6,what:'Mucha sombra y mucho contraste, casi sin relleno.',look:'Media cara desaparece en negro. Drama, suspenso, noir.',
  fn(t,S){S.look=mk(Object.assign({},LOOKS.studio,{sun:1.55,sunP:[3.4,1.9,.3],hemi:.02}));S.props.set=false;S.props.lg=true;setCam(S,LC(t))}});
add({id:'hardsoft',cat:'luz',es:'Luz dura / luz suave',en:'hard light / soft diffused light',dur:8,what:'La luz dura viene de una fuente pequeña y deja sombras de borde marcado. La suave viene de una fuente grande y las difumina.',look:'Mirá el borde de la sombra en el piso y qué tan oscura queda.',
  fn(t,S){const k=t<3?0:t<4?ss(t-3):t<7?1:1-ss(t-7);S.look=mk({sunP:[4,6,3],sun:lerp(1.15,.5,k),hemi:lerp(.3,.9,k),soft:k});setCam(S,{p:[1.6,1.9,4.4],t:[0,.85,0],fov:36});S.cap=k<.5?'Hard light':'Soft light'}});
add({id:'golden',cat:'luz',es:'Golden hour',en:'golden hour lighting',dur:7,what:'La luz baja y cálida de la hora antes del atardecer.',look:'Sombras largas, luz naranja de costado y cielo cálido en el horizonte.',
  fn(t,S){S.look=mk(LOOKS.golden);const k=ss(t/7);setCam(S,{p:[1.6,1.3,lerp(6.8,5.6,k)],t:[0,1.1,0],fov:38})}});
add({id:'bluehour',cat:'luz',es:'Blue hour',en:'blue hour lighting',dur:7,what:'La luz azul y pareja justo después de que se pone el sol.',look:'Ya no hay sombras duras, el ambiente es azul y se encienden las luces del lugar.',
  fn(t,S){S.look=mk(LOOKS.blue);const k=ss(t/7);setCam(S,{p:[1.6,1.3,lerp(6.8,5.6,k)],t:[0,1.1,0],fov:38})}});
add({id:'practical',cat:'luz',es:'Luz práctica',en:'practical light, lit by a street lamp',dur:7,what:'Una luz que se ve dentro del plano: lámpara, rótulo, vela, farol.',look:'El farol está en cuadro y es la fuente que ilumina al personaje.',
  fn(t,S){S.look=mk(Object.assign({},LOOKS.night,{lamp:2.6}));S.A.x=LAMP[0]+.85;S.A.z=LAMP[1]-.25;S.A.ry=-.75;const k=ss(t/7);setCam(S,{p:[1.0+.3*k,1.5,.5-.4*k],t:[3.5,1.5,-3.1],fov:38})}});
add({id:'silhouette',cat:'luz',es:'Silueta',en:'silhouette against the sunset',dur:6,what:'El sujeto queda en negro contra un fondo brillante.',look:'No hay luz de frente: solo se lee el contorno.',
  fn(t,S){S.look=mk(LOOKS.sil);setCam(S,{p:[.4*Math.sin(t),.5,4.2],t:[0,1.5,0],fov:36});S.A.wave=pp(t,6,.25)}});
add({id:'volumetric',cat:'luz',es:'Luz volumétrica',en:'volumetric light, light rays through fog',dur:7,what:'Rayos de luz que se vuelven visibles al atravesar humo o niebla.',look:'El haz del farol se dibuja en el aire y el fondo se pierde en la niebla.',
  fn(t,S){S.look=mk(Object.assign({},LOOKS.night,{skyTop:'#0a0e1a',skyBot:'#1b2436',fog:'#1b2436',fogD:.07,lamp:3.2,hemi:.2}));S.props.cone=true;S.A.x=LAMP[0]+.5;S.A.z=LAMP[1]+.35;S.A.ry=-.7;
    const k=ss(t/7);setCam(S,{p:[.9+.3*k,1.4,.6-.3*k],t:[3.4,1.45,-3.0],fov:40})}});

/* COLOR */
function swatches(cols){return (c,w,h)=>{const s=Math.max(18,w*.04),x0=w*.02,y0=h-s-h*.1;cols.forEach((col,i)=>{c.fillStyle=col;c.fillRect(x0+i*(s+4),y0,s,s);c.strokeStyle='rgba(255,255,255,.7)';c.lineWidth=1;c.strokeRect(x0+i*(s+4)+.5,y0+.5,s-1,s-1)})}}
function wheel(hues){return (c,w,h)=>{const r=Math.max(34,w*.07),cx=w-r-w*.03,cy=h-r-h*.12;for(let i=0;i<72;i++){c.beginPath();c.strokeStyle='hsl('+i*5+',85%,55%)';c.lineWidth=r*.34;c.arc(cx,cy,r*.83,(i*5-91)*PI/180,(i*5-85)*PI/180);c.stroke()}
  hues.forEach(hu=>{const a=(hu-90)*PI/180;c.beginPath();c.fillStyle='#fff';c.strokeStyle='#111';c.lineWidth=2;c.arc(cx+Math.cos(a)*r*.83,cy+Math.sin(a)*r*.83,r*.14,0,PI*2);c.fill();c.stroke()})}}
const PAL=[
  {n:'Desierto cálido',sw:['#f0d3a2','#e3a468','#c59b62','#b5452c','#5a4a3a'],look:{skyTop:'#e8b97e',skyBot:'#f6e2bd',fog:'#f0d6ac',fogD:.014,hemiSky:'#ffe9c4',hemiGnd:'#a67c52',sunC:'#ffd9a0',ground:'#c9a26b',foliage:'#8a7a45'},a:'#b5452c',b:'#5a4a3a'},
  {n:'Noche neón',sw:['#0b0620','#27104a','#ff3d81','#19c3d6','#f4e9ff'],look:{skyTop:'#0b0620',skyBot:'#2c1454',fog:'#22103f',fogD:.02,hemi:.45,hemiSky:'#7a4dff',hemiGnd:'#12051f',sun:.9,sunC:'#ff3d81',sunP:[-4,3,3],fill:.7,fillC:'#19c3d6',fillP:[4,2,2],ground:'#241d47',foliage:'#16606e'},a:'#f4e9ff',b:'#ff3d81'},
  {n:'Bosque frío',sw:['#cfe3e6','#7fa6a8','#5c7a66','#2f5d50','#e9e3d0'],look:{skyTop:'#8fb3b8',skyBot:'#d6e7e8',fog:'#c5dadb',fogD:.02,hemi:.8,hemiSky:'#dff0f0',hemiGnd:'#4e6a5a',sun:.5,sunC:'#eaf6ff',ground:'#5f7d69',foliage:'#2f5d50'},a:'#e9e3d0',b:'#7fa6a8'}];
add({id:'palette',cat:'color',es:'Paleta de color',en:'color palette: desaturated teal, warm amber, off-white',dur:12,what:'Los tres a cinco colores que dominan todo el corto. Se define una vez y se repite en cada prompt.',look:'El mismo plano con tres paletas. Cada una cambia el género de la historia sin tocar la cámara.',
  fn(t,S){conv(S);setCam(S,SH.wide);const i=Math.floor(t/4)%3,p=(i+2)%3,k=ss((t-i*4)/.8);const la=mk(PAL[p].look),lb=mk(PAL[i].look);S.look=mixLook(la,lb,k);
    S.A.shirt=mixC(PAL[p].a,PAL[i].a,k);S.B.shirt=mixC(PAL[p].b,PAL[i].b,k);S.cap=PAL[i].n;S.hud=swatches(PAL[i].sw)}});
add({id:'temp',cat:'color',es:'Temperatura de color',en:'warm color temperature / cool color temperature',dur:9,what:'Qué tan cálida (naranja) o fría (azul) es la luz. Se mide en kelvin.',look:'La misma escena pasa de luz de bombillo a luz de día y a sombra azul. Los números bajos son cálidos.',
  fn(t,S){const u=pp(t,9,.04)*(KELV.length-1),i=Math.min(KELV.length-2,Math.floor(u)),k=u-i;const col=mixC(KELV[i][1],KELV[i+1][1],k),K=Math.round(lerp(KELV[i][0],KELV[i+1][0],k)/100)*100;
    S.look=mk({sunC:col,hemiSky:col,sun:1,skyBot:mixC('#cfe0ee',col,.5),fog:mixC('#cfe0ee',col,.5)});setCam(S,{p:[.8,1.45,3.2],t:[0,1.25,0],fov:36});S.cap=K+' K'}});
add({id:'complementary',cat:'color',es:'Colores complementarios',en:'teal and orange color scheme',dur:6,what:'Dos colores opuestos en el círculo cromático. El clásico es teal and orange.',look:'El personaje naranja salta contra el fondo azul verdoso. Los opuestos dan el máximo contraste.',
  fn(t,S){S.look=mk({skyTop:'#0c3440',skyBot:'#2f7d86',fog:'#2a6f78',fogD:.018,hemi:.5,hemiSky:'#59c2c9',hemiGnd:'#0f3038',sun:1.15,sunC:'#ff9a3c',sunP:[4,3,4],ground:'#1f5961',foliage:'#1c6a70'});
    S.A.shirt='#ff8a2a';setCam(S,{p:[.6*Math.sin(t*PI/3),1.45,3.4],t:[0,1.25,0],fov:36});S.hud=wheel([28,205])}});
add({id:'analogous',cat:'color',es:'Análogos / monocromático',en:'analogous color scheme / monochromatic blue',dur:10,what:'Análogos son colores vecinos en el círculo. Monocromático es un solo tono en varias intensidades.',look:'Las dos opciones dan armonía y atmósfera en vez de contraste.',
  fn(t,S){const an=mk({skyTop:'#b8452c',skyBot:'#ffc15a',fog:'#f2a24e',fogD:.016,hemi:.5,hemiSky:'#ffd08a',hemiGnd:'#8a3a1c',sun:1.1,sunC:'#ff9d4a',sunP:[-5,3,3],ground:'#b5642f',foliage:'#c9862f'});
    const mo=mk({skyTop:'#0f2247',skyBot:'#6f93d6',fog:'#5578bf',fogD:.018,hemi:.6,hemiSky:'#9db8ee',hemiGnd:'#14254a',sun:.9,sunC:'#bcd0ff',sunP:[-5,3,3],ground:'#28427a',foliage:'#1b3566'});
    const k=t<4?0:t<5?ss(t-4):t<9?1:1-ss(t-9);S.look=mixLook(an,mo,k);S.A.shirt=mixC('#ffd23f','#9db8ee',k);setCam(S,{p:[.5,1.45,3.6],t:[0,1.2,0],fov:36});S.cap=k<.5?'Análogos':'Monocromático';S.hud=wheel(k<.5?[8,30,52]:[220])}});
add({id:'grading',cat:'color',es:'Color grading',en:'cinematic color grade',dur:8,what:'El ajuste de color final que unifica todos los planos y les da el look.',look:'A la izquierda de la línea, la imagen plana como sale de cámara. A la derecha, corregida.',
  fn(t,S){conv(S);setCam(S,SH.wide);S.post.grade=GR.teal;S.post.gradeBase=GR.flat;S.post.wipe=lerp(.12,.88,pp(t,8,.05));
    S.hud=(c,w,h)=>{const x=w*S.post.wipe;c.fillStyle='#fff';c.fillRect(x-1,0,2,h);c.font='500 '+Math.max(12,w*.021)+'px "IBM Plex Mono",monospace';c.textBaseline='bottom';c.shadowColor='rgba(0,0,0,.9)';c.shadowBlur=4;
      c.textAlign='right';c.fillText('Sin corregir',x-10,h*.88);c.textAlign='left';c.fillText('Con grading',x+10,h*.88);c.shadowBlur=0}}});
add({id:'lut',cat:'color',es:'LUT',en:'teal and orange LUT / black and white film look',dur:9,what:'Un preset de color que se aplica de un golpe en el editor.',look:'El mismo plano con tres LUT distintos. Son un punto de partida, no el grading completo.',
  fn(t,S){conv(S);setCam(S,SH.wide);const i=Math.floor(t/3)%3;S.post.grade=[GR.teal,GR.noir,GR.vint][i];S.cap='LUT: '+['teal and orange','blanco y negro','vintage cálido'][i]}});

/* EDICIÓN */
function strip(cuts,total,now,labels){return (c,w,h)=>{const x0=w*.04,x1=w*.96,y=h*.8,bh=Math.max(8,h*.03);c.fillStyle='rgba(0,0,0,.55)';c.fillRect(x0-8,y-10,x1-x0+16,bh+20);
  let prev=0;cuts.concat([total]).forEach((ct,i)=>{c.fillStyle=i%2?'#c9ced8':'#8d95a3';c.fillRect(x0+(x1-x0)*prev/total,y,(x1-x0)*(ct-prev)/total-2,bh);prev=ct});
  c.fillStyle='#ff5a4f';c.fillRect(x0+(x1-x0)*now/total-1,y-6,2,bh+12)}}
add({id:'cut',cat:'edicion',es:'Corte',en:'hard cut',dur:6,what:'El paso directo de un plano al siguiente, sin transición.',look:'De plano general a primer plano en un instante. En la vista del set la cámara salta de lugar.',
  fn(t,S){conv(S);S.A.talk=1;const i=t<3?0:1;setCam(S,i?SH.a:SH.wide);S.cap='Plano '+(i+1)}});
add({id:'matchcut',cat:'edicion',es:'Match cut',en:'match cut',dur:7,what:'Un corte que une dos planos por una forma o un movimiento parecido.',look:'La cabeza y la luna ocupan el mismo lugar y tamaño en el cuadro, así que el ojo las conecta.',
  fn(t,S){if(t<3.5){const k=t/3.5;setCam(S,{p:[0,1.632,1.0-.06*k],t:[0,1.632,0],fov:30});S.A.headYaw=0}
    else{const k=(t-3.5)/3.5;S.look=mk(Object.assign({},LOOKS.night,{lamp:0}));S.props.moon=true;setCam(S,{p:[0,1.5,6],t:[0,16,-18.5],fov:30-1.6*k})}}});
add({id:'jumpcut',cat:'edicion',es:'Jump cut',en:'jump cut',dur:5.4,what:'Un corte brusco dentro de la misma acción y con el mismo encuadre.',look:'La cámara no cambia, pero el personaje salta de lugar: se nota que falta tiempo en medio.',
  fn(t,S){const i=Math.floor(t/.9)%6;setCam(S,{p:[0,1.4,5],t:[0,1.1,0],fov:36});S.A.x=[-1.7,-.5,.8,1.8,.2,-1.0][i];S.A.wave=[0,.7,0,1,.3,0][i];S.A.headYaw=[.3,-.2,0,.4,-.4,.1][i];S.A.ry=[.3,0,-.3,.2,0,-.2][i]}});
add({id:'jlcut',cat:'edicion',es:'J-cut / L-cut',en:'J-cut, L-cut',dur:12,what:'En el J-cut el audio del plano siguiente entra antes que su imagen. En el L-cut el audio del plano anterior sigue sobre la imagen nueva.',look:'Abajo, la pista de video y la de audio. El corte de una no coincide con el de la otra, y por eso el diálogo fluye.',
  fn(t,S){conv(S);const J=t<6,l=J?t:t-6,vc=J?3.6:2.4,ac=J?2.2:3.8;const onB=l>=vc,spB=l>=ac;setCam(S,onB?SH.b:SH.a);S.A.talk=spB?0:1;S.B.talk=spB?1:0;S.cap=J?'J-cut: primero se oye, después se ve':'L-cut: se sigue oyendo al anterior';
    S.hud=(c,w,h)=>{const x0=w*.14,x1=w*.96,bh=Math.max(10,h*.035),y=h*.74;c.fillStyle='rgba(0,0,0,.6)';c.fillRect(w*.02,y-8,w*.96,bh*2+22);c.font='500 '+Math.max(11,w*.019)+'px "IBM Plex Mono",monospace';c.fillStyle='#e9ecf1';c.textBaseline='middle';c.textAlign='left';
      c.fillText('Video',w*.035,y+bh/2);c.fillText('Audio',w*.035,y+bh*1.5+6);const X=s=>x0+(x1-x0)*s/6;
      c.fillStyle='#b4482f';c.fillRect(X(0),y,X(vc)-X(0)-1,bh);c.fillRect(X(0),y+bh+6,X(ac)-X(0)-1,bh);c.fillStyle='#2f7f86';c.fillRect(X(vc),y,X(6)-X(vc),bh);c.fillRect(X(ac),y+bh+6,X(6)-X(ac),bh);
      c.fillStyle='#fff';c.fillRect(X(l)-1,y-4,2,bh*2+14)}}});
add({id:'cutaway',cat:'edicion',es:'Cutaway / B-roll',en:'cutaway shot, B-roll',dur:8,what:'Un plano de apoyo que se inserta sobre la acción principal.',look:'El personaje sigue hablando mientras se muestra la taza. Sirve para ilustrar y para esconder cortes.',
  fn(t,S){S.props.mug=true;S.A.talk=1;const b=t>=3&&t<5;setCam(S,b?{p:[1.25,1.2,1.25],t:[.85,.82,.3],fov:24}:{p:[-.1,1.42,2.3],t:[0,1.34,0],fov:36});S.cap=b?'Cutaway':'Plano principal'}});
add({id:'fade',cat:'edicion',es:'Fundido / disolvencia',en:'dissolve, fade to black',dur:10,what:'Transiciones graduales: una imagen se mezcla con la siguiente, o se va a negro.',look:'Primero una disolvencia entre dos planos y después un fundido a negro. Suelen indicar paso de tiempo.',
  fn(t,S,S2){setCam(S,{p:[0,1.3,6.4],t:[0,1.05,0],fov:38});setCam(S2,{p:[0,1.63,1.0],t:[0,1.63,0],fov:30});
    if(t<2.5){S.cap='Plano 1'}else if(t<4){S.post.mix=ss((t-2.5)/1.5);S.cap='Dissolve'}else if(t<6){S.post.mix=1;S.cap='Plano 2'}else if(t<7){S.post.mix=1;S.post.fade=ss(t-6);S.cap='Fade to black'}
    else if(t<8){S.post.fade=1-ss(t-7);S.cap='Fade in'}else{S.cap='Plano 1'}}});
const ASLS=[SH.wide,SH.a,SH.b,SH.ots,SH.hi,SH.lo];
add({id:'asl',cat:'edicion',es:'Duración media de plano (ASL)',en:'fast-paced editing / long take',dur:34,what:'El promedio de segundos que dura cada plano. Es la medida del ritmo.',look:'El mismo diálogo cortado a tres ritmos reales. La barra de abajo marca cada corte.',
  fn(t,S){conv(S);S.A.talk=1;const P=[[12,10,'Hollywood 1930-1960: un plano cada 10 s'],[12,4,'Después del 2000: cada 4 s'],[10,1.7,'Videoclip: cada 1.7 s']];let i=0,l=t;while(i<2&&l>=P[i][0]){l-=P[i][0];i++}
    const n=Math.floor(l/P[i][1]);setCam(S,ASLS[(n+i*2)%ASLS.length]);S.cap=P[i][2];const cuts=[];for(let c=P[i][1];c<P[i][0]-.01;c+=P[i][1])cuts.push(c);S.hud=strip(cuts,P[i][0],l)}});
add({id:'axis',cat:'edicion',es:'Regla de los 180° (eje)',en:'shot / reverse shot',dur:12,what:'Entre dos personajes hay una línea imaginaria. Todas las cámaras se quedan del mismo lado.',look:'Bien hecho, uno mira a la derecha y el otro a la izquierda. Al cruzar la línea roja, los dos miran al mismo lado y parece que ya no se hablan.',
  fn(t,S){conv(S);S.props.axis=true;const i=Math.floor(t/3)%4;setCam(S,[SH.a,SH.b,SH.a,SH.bx][i]);S.A.talk=i%2?0:1;S.B.talk=i%2?1:0;
    if(i===1){S.badge='Correcto';S.badgeKind='ok'}if(i===3){S.badge='Eje cruzado';S.badgeKind='bad'}S.cap=['A mira a la derecha','B mira a la izquierda','A mira a la derecha','B también mira a la derecha'][i]}});
add({id:'raccord',cat:'edicion',es:'Continuidad / raccord',en:'consistent wardrobe and props across shots',dur:10,what:'Que ropa, objetos, luz y posiciones coincidan entre un plano y el siguiente.',look:'En el primer corte la gorra cambia de color: error de continuidad. En el segundo coincide.',
  fn(t,S){S.props.mug=true;const i=Math.floor(t/2.5)%4,cu=i%2===1;S.A.hat=(i===1)?'#2b6cc0':'#c0392b';setCam(S,cu?{p:[.25,1.64,1.15],t:[0,1.66,0],fov:30}:{p:[.4,1.45,3.8],t:[.2,1.15,0],fov:36});
    S.cap=cu?'Primer plano':'Plano general';if(cu){S.badge=i===1?'Error de continuidad':'Continuidad correcta';S.badgeKind=i===1?'bad':'ok'}}});

/* ESTRUCTURA */
add({id:'frame',cat:'direccion',es:'Frame / cuadro',en:'24 fps',dur:10,what:'Una sola imagen fija. El video es una fila de cuadros que pasan rápido.',look:'A 3 cuadros por segundo se ven las imágenes sueltas. A 24, el ojo las funde en movimiento.',
  fn(t,S){const slow=t<5;setCam(S,{p:[0,1.4,5.2],t:[0,1.1,0],fov:36});walkX(S.A,t,5,-3,3);S.post.fps=slow?3:24;S.cap=slow?'3 cuadros por segundo, cuadro '+(Math.floor(t*3)+1):'24 cuadros por segundo'}});
add({id:'take',cat:'direccion',es:'Plano y toma',en:'single continuous shot',dur:9,what:'El plano es lo que se ve entre dos cortes. La toma es cada intento de filmar o generar ese plano.',look:'Tres tomas del mismo plano: mismo encuadre, pequeñas diferencias. En IA, cada generación es una toma.',
  fn(t,S){const i=Math.floor(t/3)%3,l=t-i*3;setCam(S,{p:[0,1.4,6],t:[0,1.1,0],fov:38});const stop=[0,.9,-.6][i],sp=[1.7,1.9,1.3][i],k=clamp(l/sp,0,1);
    S.A.x=lerp(-4.5,stop,k);S.A.ry=k<1?PI/2:0;S.A.walk=S.A.x*3.7;S.A.amp=k<1?1:0;S.A.headYaw=0;S.A.wave=k<1?0:[1,0,.8][i]*ss((l-sp)/.3);if(k>=1&&i===1)S.A.headYaw=.5*Math.sin((l-sp)*4);S.cap='Toma '+(i+1)}});

/* ---------- lienzos ---------- */
