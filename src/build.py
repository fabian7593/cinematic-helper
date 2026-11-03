"""Arma index.html (un solo archivo) a partir de las piezas de esta carpeta.
Uso: python src/build.py   (desde la raíz del repo)"""
import base64, os
D = os.path.dirname(os.path.abspath(__file__)) + '/'
ROOT = os.path.dirname(D.rstrip('/')) + '/'
rd = lambda f: open(D + f, encoding='utf-8').read()

eng = rd('engine_head.js.html')
o = "function fail(t){ msg.hidden=false; msg.textContent=t; }"
assert eng.count(o) == 1
eng = eng.replace(o, "function fail(t){ msg.hidden=false; msg.textContent=t; const h=document.getElementById('hero-stage'); if(h)h.appendChild(stage); }")
tail = rd('tail_engine.js')
old = "function loop(now){const dt=Math.min(.1,(now-last)/1000||0);last=now;if(playing){T+=dt;render()}requestAnimationFrame(loop)}"
assert tail.count(old) == 1
tail = tail.replace(old, '')

b64 = lambda f: base64.b64encode(open(D + 'models/' + f, 'rb').read()).decode()
rigs = '<script>window.__RIGS={a:"' + b64('mujer.glb') + '",b:"' + b64('ninja.glb') + '"};</script>\n'

# las imágenes que existen en img/ activan el botón "Imagen" de cada ejemplo
ui = rd('site_ui.js')
keys = sorted(f[:-5] for f in os.listdir(ROOT + 'img') if f.endswith('.webp'))
if 'const REALIMG=new Set([]);' in ui:
    ui = ui.replace('const REALIMG=new Set([]);', 'const REALIMG=new Set(' + repr(keys).replace("'", '"') + ');')

head = ('<!doctype html>\n<html lang="es">\n<head>\n<meta charset="utf-8">\n'
        '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
        '<title>Plano a Plano</title>\n'
        '<meta name="description" content="Cine y producción de video con IA explicados con animaciones: glosario de cine, flujo de producción paso a paso, herramientas, biblioteca de estilos y generador de prompts.">\n'
        '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700&family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600&display=swap">\n'
        '<style>body{margin:0;font:14px system-ui}[hidden]{display:none!important}img{max-width:100%}</style>\n'
        '<style>' + rd('base.css') + rd('site.css') + '</style>\n</head>\n<body>\n')
body = (rd('markup.html') + rigs + eng + rd('demos-v1.js') + rd('demos-v2.js') + rd('demos-v3.js') + rd('demos-v4.js')
        + rd('data-prod.js') + rd('data-tools.js') + rd('data-styles.js') + tail + ui)
open(ROOT + 'index.html', 'w', encoding='utf-8').write(head + body + '\n</body>\n</html>\n')
print('index.html', len(head + body) // 1024, 'KB ·', len(keys), 'imágenes')
