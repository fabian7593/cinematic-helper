# Plano a Plano

Cine y producción de video con IA, explicado con animaciones.

**Sitio:** https://fabian7593.github.io/plano-a-plano/

Qué incluye:

- un glosario de cine con una animación 3D en cada término;
- el flujo de producción paso a paso;
- herramientas de video e imagen con IA;
- una biblioteca de 44 estilos, con una imagen de ejemplo de cada uno;
- un generador de prompts para cada herramienta, que:
  - acepta personajes y lugares escritos una sola vez, para mantener la consistencia;
  - traduce del español al inglés;
  - sugiere el plano siguiente.

Cada prompt tiene dos pestañas: en inglés, para pegar en la herramienta, y en español, para entender qué dice.

## Cómo está armado

- `index.html` es el sitio completo, en un solo archivo. Lleva adentro los personajes 3D, las animaciones y todos los textos.
- `img/` tiene las imágenes de ejemplo. El botón **Imagen** aparece solo en los ejemplos que tienen foto en esta carpeta.
- `src/` tiene las piezas con las que se arma `index.html`:
  - estilos;
  - estructura de la página;
  - motor 3D;
  - demos;
  - datos de producción, herramientas y estilos;
  - los modelos `.glb`.

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

Para agregar una imagen, guardala en `img/` como `.webp` con el nombre del término o del estilo. Por ejemplo, `img/dolly.webp` o `img/estilo-noir.webp`. Después corré el build.

## Publicar en GitHub Pages

En **Settings → Pages**, elegí **Deploy from a branch**, rama `main` y carpeta `/ (root)`.

## Créditos

- Animaciones con [three.js](https://threejs.org/).
- Personajes y animaciones 3D de [Mixamo](https://www.mixamo.com/) (Adobe).
- Imágenes de ejemplo generadas con ChatGPT.
