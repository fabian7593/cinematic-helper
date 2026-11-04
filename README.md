# Cinematic Helper

Cine y producción de video con IA, explicado con animaciones. En español, inglés y portugués.

*Film language and AI video production, explained with animations. Available in Spanish, English and Portuguese.*

**Sitio:** https://fabian7593.github.io/cinematic-helper/

Antes se llamaba *Plano a Plano*.

Proyecto open source con [licencia MIT](LICENSE), creado por **Arcane Coder** (Fabian Rosales) · [GitHub](https://github.com/fabian7593) · [LinkedIn](https://www.linkedin.com/in/frosales-softdev/)

Creado e investigado con [Claude](https://claude.ai), la IA de Anthropic.

Qué incluye:

- un glosario de cine con una animación 3D en cada término;
- el flujo de producción paso a paso;
- herramientas de video e imagen con IA;
- una biblioteca de 44 estilos, con una imagen de ejemplo de cada uno;
- videos de producto y publicidad: guía, plantillas y planos de producto;
- un generador de prompts para cada herramienta, que:
  - acepta personajes, lugares y productos escritos una sola vez, para mantener la consistencia (opcional);
  - traduce del español al inglés;
  - sugiere el plano siguiente.

Cada prompt tiene dos pestañas: en inglés, para pegar en la herramienta, y en español (o portugués), para entender qué dice.

## Idiomas

El sitio abre en inglés. El selector de arriba a la derecha cambia entre inglés, español y portugués, y la elección queda guardada. También se puede abrir directo en un idioma con `?lang=en`, `?lang=es` o `?lang=pt`.

Las traducciones están en `src/i18n/`:

- `dict.json`: cada texto en español con su versión en inglés y en portugués;
- `ovr.json`: correcciones puntuales, que ganan sobre `dict.json`;
- `ph.json`: los marcadores entre corchetes de las plantillas de prompt, como `[sujeto]` → `[subject]`.

`src/i18n_rt.js` aplica la traducción al cargar la página.

## Cómo está armado

- `index.html` es el sitio completo, en un solo archivo. Lleva adentro los personajes 3D, las animaciones y todos los textos.
- `img/` tiene las imágenes de ejemplo. El botón **Imagen** aparece solo en los ejemplos que tienen foto en esta carpeta.
- `src/` tiene las piezas con las que se arma `index.html`:
  - estilos;
  - estructura de la página;
  - motor 3D;
  - demos;
  - datos de producción, herramientas y estilos;
  - traducciones.

Necesita conexión a internet para cargar three.js y las fuentes desde CDN.

Las traducciones de los prompts están en `src/es.json`: cada texto en inglés apunta a su versión en español.

El generador traduce lo que escribás en español usando, en este orden:

1. el traductor integrado de Chrome, que funciona en el equipo;
2. Claude, cuando la página se abre dentro de Claude;
3. MyMemory, un servicio gratis de unos 5000 caracteres por día, que solo se usa al tocar "Traducir al inglés".

El proyecto del generador se guarda en el navegador de cada persona.

## Editar

1. Cambiá lo que necesités dentro de `src/`.
2. Regenerá el sitio:

   ```
   python src/build.py
   ```

   Ese comando vuelve a escribir `index.html` y registra las imágenes que haya en `img/`.

Los personajes 3D no están como archivos sueltos en el repositorio, porque las condiciones de Mixamo no permiten distribuirlos así. El build reutiliza los que ya vienen dentro de `index.html`. Si querés cambiarlos, descargalos de Mixamo y guardalos como `src/models/mujer.glb` y `src/models/ninja.glb`; esa carpeta está en `.gitignore`.

Para agregar una imagen, guardala en `img/` como `.webp` con el nombre del término o del estilo. Por ejemplo, `img/dolly.webp` o `img/estilo-noir.webp`. Después corré el build.

## Publicar en GitHub Pages

En **Settings → Pages**, elegí **Deploy from a branch**, rama `main` y carpeta `/ (root)`.

## Licencia

El código y los textos del sitio están bajo la [licencia MIT](LICENSE): podés usarlos, copiarlos, modificarlos y publicarlos, siempre que mantengas el aviso de copyright.

Quedan fuera de la licencia MIT:

- los personajes y animaciones 3D de [Mixamo](https://www.mixamo.com/) (Adobe), que van dentro de `index.html` y se usan bajo las condiciones de Adobe;
- [three.js](https://threejs.org/) (licencia MIT propia) y las fuentes de Google Fonts (SIL Open Font License), que se cargan desde CDN.

## Créditos

- Creado por Arcane Coder (Fabian Rosales): [GitHub](https://github.com/fabian7593) · [LinkedIn](https://www.linkedin.com/in/frosales-softdev/).
- Creado e investigado con [Claude](https://claude.ai), la IA de Anthropic.
- Animaciones con [three.js](https://threejs.org/).
- Personajes y animaciones 3D de [Mixamo](https://www.mixamo.com/) (Adobe).
- Imágenes de ejemplo generadas con ChatGPT.
