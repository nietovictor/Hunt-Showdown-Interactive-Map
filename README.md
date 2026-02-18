# Hunt Map MVP (estático)

Web estilo "mapa interactivo" inspirada en Hunt Showdown, hecha con HTML/CSS/JS + Leaflet.

## Qué incluye

- Mapa con imagen de fondo (`CRS.Simple`)
- Botones de mapa
- Leyenda con filtros por tipo de POI
- Select all / none
- Nombres de compuestos activables
- Persistencia de filtros en `localStorage`
- Popups por marcador

## Estructura

- `index.html`: layout de la aplicación
- `styles.css`: estilos
- `data.js`: tipos de POI y datos de mapas
- `app.js`: lógica del mapa y controles
- `assets/desalle.webp`: imagen base

## Ejecutar en local

Opción rápida:

1. Abre `index.html` directamente en navegador.

Opción recomendada (servidor local):

1. En la carpeta del proyecto, ejecuta:
   - `python -m http.server 8080`
2. Abre:
   - `http://localhost:8080`

## Lanzarlo (deploy)

Como es estático, puedes usar cualquiera de estos servicios:

- GitHub Pages
- Netlify
- Vercel (Static)
- Cloudflare Pages

Pasos generales:

1. Sube todo el contenido de esta carpeta.
2. Define como carpeta raíz/publicación la carpeta del proyecto.
3. Archivo de entrada: `index.html`.

## Personalización

- Para añadir/quitar categorías: edita `POI_TYPES` en `data.js`.
- Para cambiar mapas y marcadores: edita `MAPS` en `data.js`.
- Para cambiar aspecto: edita `styles.css`.
