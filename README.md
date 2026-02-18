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

1. En la carpeta del proyecto, ejecuta:
   - `python -m http.server 8080`
2. Abre:
   - `http://localhost:8080`


## Personalización

- Para añadir/quitar categorías: edita `POI_TYPES` en `data.js`.
- Para cambiar mapas y marcadores: edita `MAPS` en `data.js`.
- Para cambiar aspecto: edita `styles.css`.

## Idiomas (ES / EN)

- El selector de idioma está en la esquina superior derecha.
- Las traducciones se definen en el objeto `I18N` dentro de `data.js`.
- Secciones del objeto `I18N`:
   - `mapNames`: nombres de mapas por `mapId`.
   - `poiTypes`: nombres de tipos de marcador (leyenda) por `type`.
   - `compounds`: nombres de compuestos por `mapId` y `compoundKey`.

Si falta una traducción, la app usa el texto original como fallback.
