# Plano a Plano

Cine y producción de video con IA, explicado con animaciones.

**Sitio:** https://fabian7593.github.io/plano-a-plano/

Qué incluye:

- un glosario de cine con una animación 3D en cada término;
- el flujo de producción paso a paso;
- herramientas de video e imagen con IA;
- una biblioteca de 44 estilos;
- un generador de prompts para cada herramienta.

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
