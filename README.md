# Hunt: Showdown 1896 - Interactive Map

## Features
- Map with background image (`CRS.Simple`)
- Map selector buttons
- Legend with POI type filters
- Select all / none actions
- Toggleable compound names
- Filter persistence with `localStorage`
- Marker popups

## Project Structure

- `index.html`: main application layout
- `pages/about.html`: secondary page (base)
- `pages/guide.html`: secondary page (base)
- `css/styles.css`: styles
- `js/data.js`: data normalization and loading
- `js/app.js`: map and UI logic
- `js/translations.js`: ES/EN translations
- `data/poiData.json`: map and point data
- `data/poiIcons.json`: POI type configuration
- `assets/maps/`: base map images
- `assets/images/`: future project images

## Run Locally

1. In the project folder, run:
   - `python -m http.server 8080`
2. Open:
   - `http://localhost:8080`
3. Available views:
   - `http://localhost:8080/index.html`
   - `http://localhost:8080/pages/about.html`
   - `http://localhost:8080/pages/guide.html`

## Multi-HTML Mode

- To add new views, create additional files inside `pages/`.
- Keep shared resources in `css/`, `js/`, `data/`, and `assets/`.
- From files inside `pages/`, use `../` relative paths to access root-level folders.

## Customization

- To add/remove categories: edit `POI_TYPES` in `js/data.js`.
- To update maps and markers: review data loading in `js/data.js` and the JSON files in `data/`.
- To change styling: edit `css/styles.css`.

## Languages (ES / EN)

- The language selector is in the top-right corner.
- Translations are defined in `js/translations.js`.
- `I18N` sections:
  - `mapNames`: map names by `mapId`.
  - `poiTypes`: marker/legend type names by `type`.
  - `compounds`: compound names by `mapId` and `compoundKey`.

If a translation is missing, the app falls back to the original text.
