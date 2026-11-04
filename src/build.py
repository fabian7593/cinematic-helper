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

# Personajes 3D de Mixamo: los .glb no se publican en el repositorio (las condiciones de Adobe
# no permiten distribuir los archivos sueltos). Si tenés los .glb en src/models/ se usan;
# si no, se reutilizan los que ya vienen dentro del index.html actual.
if os.path.exists(D + 'models/mujer.glb') and os.path.exists(D + 'models/ninja.glb'):
    b64 = lambda f: base64.b64encode(open(D + 'models/' + f, 'rb').read()).decode()
    rigs = '<script>window.__RIGS={a:"' + b64('mujer.glb') + '",b:"' + b64('ninja.glb') + '"};</script>\n'
else:
    old_html = open(ROOT + 'index.html', encoding='utf-8').read()
    i = old_html.index('<script>window.__RIGS=')
    rigs = old_html[i:old_html.index('</script>', i) + len('</script>')] + '\n'

# las imágenes que existen en img/ activan el botón "Imagen" de cada ejemplo
ui = rd('site_ui.js')
keys = sorted(f[:-5] for f in os.listdir(ROOT + 'img') if f.endswith('.webp'))
if 'const REALIMG=new Set([]);' in ui:
    ui = ui.replace('const REALIMG=new Set([]);', 'const REALIMG=new Set(' + repr(keys).replace("'", '"') + ');')

head = ('<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n'
        '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
        '<title>Cinematic Helper</title>\n'
        '<meta name="description" content="Film language and AI video production explained with animations: film glossary, step-by-step production, tools, style library and prompt generator. In English, Spanish and Portuguese.">\n'
        '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700&family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600&display=swap">\n'
        '<style>body{margin:0;font:14px system-ui}[hidden]{display:none!important}img{max-width:100%}</style>\n'
        '<style>' + rd('base.css') + rd('site.css') + '</style>\n</head>\n<body>\n')
# traducciones al español de los prompts (pestaña Español)
es = '<script>window.__ES=' + rd('es.json').replace('</', '<\\/') + ';</script>\n'
# idiomas: español (original), inglés y portugués; el selector está arriba a la derecha
q = lambda f: rd('i18n/' + f).replace('</', '<\\/')
i18n = ('<script>window.__I18N=' + q('dict.json') + ';window.__I18N_OVR=' + q('ovr.json') + ';window.__I18N_PH=' + q('ph.json') + ';</script>\n'
        '<script>' + rd('i18n_rt.js') + '</script>\n')
walk = "\nif(window.__LANG!=='es'){[D,PROD_CH,PROD,TOOLS,FEATS,SYNTAX,RANK,STYLE_GROUPS,STYLES,STYLE_LOCK,STYLE_TOOLFMT].forEach(o=>{try{_tWalk(o)}catch(e){}})}\n"
body = (rd('markup.html') + i18n + rigs + es + eng + rd('demos-v1.js') + rd('demos-v2.js') + rd('demos-v3.js') + rd('demos-v4.js')
        + rd('data-prod.js') + rd('data-tools.js') + rd('data-styles.js') + walk + tail + ui)
open(ROOT + 'index.html', 'w', encoding='utf-8').write(head + body + '\n</body>\n</html>\n')
print('index.html', len(head + body) // 1024, 'KB ·', len(keys), 'imágenes')
