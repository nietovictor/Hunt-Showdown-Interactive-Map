let map;
let activeMapId = null;
let overlay;
let currentLanguage = 'es';
const markerLayersByType = {};
let compoundNamesLayer;
const imageSizeCache = new Map();
const completedPoisByMap = new Map();
const poiMarkersByMap = new Map();
const selectedSpawnByMap = new Map();
const allSpawnMarkersByMap = new Map();
const spawnTextMarkerByMap = new Map();
let currentMapBounds = null;
const drawingsLayerByMap = new Map();
const drawingHistoryByMap = new Map();
let drawingGlobalListenersBound = false;
const drawingState = {
  mode: 'none',
  isFreehandDrawing: false,
  freehandPoints: [],
  freehandPreviewLayer: null,
  isLineDrawing: false,
  lineDraftStart: null,
  linePreviewLayer: null
};

const DRAW_MODES = {
  none: 'none',
  freehand: 'freehand',
  line: 'line',
  circle: 'circle',
  erase: 'erase'
};

const STORAGE_KEYS = {
  activeMap: 'hunt_active_map',
  typePrefix: 'hunt_type_',
  compoundNames: 'hunt_compound_names',
  language: 'hunt_language',
  typeDefaultsVersion: 'hunt_type_defaults_v1'
};

const DEFAULT_VISIBLE_TYPES = new Set(['spawn', 'tower', 'big_tower', 'workbench']);

function getUIText(key) {
  if (typeof getUITextTranslation === 'function') {
    return getUITextTranslation(key, currentLanguage, key);
  }

  return key;
}

function applyStaticTranslations() {
  document.documentElement.lang = currentLanguage;

  const languageLabel = document.getElementById('languageLabel');
  if (languageLabel) {
    languageLabel.textContent = getUIText('language');
  }

  const toggleLegendBtn = document.getElementById('toggleLegendBtn');
  if (toggleLegendBtn) {
    toggleLegendBtn.textContent = getUIText('legend');
  }

  const resetPoisBtn = document.getElementById('resetPoisBtn');
  if (resetPoisBtn) {
    resetPoisBtn.textContent = getUIText('resetMatch');
  }

  const legendAll = document.getElementById('legendAll');
  if (legendAll) {
    legendAll.textContent = getUIText('all');
  }

  const legendNone = document.getElementById('legendNone');
  if (legendNone) {
    legendNone.textContent = getUIText('none');
  }

  const compoundNamesLabel = document.getElementById('compoundNamesLabel');
  if (compoundNamesLabel) {
    compoundNamesLabel.textContent = getUIText('compoundNames');
  }

  const fitMapBtn = document.querySelector('.leaflet-control-fit-map');
  if (fitMapBtn) {
    fitMapBtn.title = getUIText('fitMap');
  }

  const drawFreehandBtn = document.getElementById('drawFreehandBtn');
  if (drawFreehandBtn) {
    drawFreehandBtn.textContent = getUIText('drawFreehand');
  }

  const drawMeasureLineBtn = document.getElementById('drawMeasureLineBtn');
  if (drawMeasureLineBtn) {
    drawMeasureLineBtn.textContent = getUIText('drawMeasureLine');
  }

  const drawCircle150Btn = document.getElementById('drawCircle150Btn');
  if (drawCircle150Btn) {
    drawCircle150Btn.textContent = getUIText('drawCircle150');
  }

  const drawEraseBtn = document.getElementById('drawEraseBtn');
  if (drawEraseBtn) {
    drawEraseBtn.textContent = getUIText('drawErase');
  }

  const drawUndoBtn = document.getElementById('drawUndoBtn');
  if (drawUndoBtn) {
    drawUndoBtn.textContent = getUIText('drawUndo');
  }

  const drawClearBtn = document.getElementById('drawClearBtn');
  if (drawClearBtn) {
    drawClearBtn.textContent = getUIText('drawClear');
  }
}

function getSavedLanguage() {
  const value = localStorage.getItem(STORAGE_KEYS.language);
  if (value === 'es' || value === 'en') {
    return value;
  }

  const browserLanguage = (navigator.language || navigator.userLanguage || '').toLowerCase();
  return browserLanguage.startsWith('es') ? 'es' : 'en';
}

function setSavedLanguage(language) {
  currentLanguage = language === 'en' ? 'en' : 'es';
  localStorage.setItem(STORAGE_KEYS.language, currentLanguage);
}

function getMapName(entry) {
  if (typeof getMapDisplayName === 'function') {
    return getMapDisplayName(entry.id, entry.name, currentLanguage);
  }
  return entry.name;
}

function getPoiTypeLabel(type, fallbackLabel) {
  if (typeof getPoiTypeDisplayName === 'function') {
    return getPoiTypeDisplayName(type, fallbackLabel, currentLanguage);
  }
  return fallbackLabel;
}

function getCompoundName(mapId, compound) {
  if (typeof getCompoundDisplayName === 'function') {
    return getCompoundDisplayName(mapId, compound.key, compound.name, currentLanguage);
  }
  return compound.name;
}

function refreshLanguageUI() {
  applyStaticTranslations();
  createMapButtons();
  buildLegend();
  renderMapData();
}

function getMapConfig(mapId) {
  return MAPS.find((entry) => entry.id === mapId) || MAPS[0] || null;
}

function getSavedTypeState(type) {
  const value = localStorage.getItem(`${STORAGE_KEYS.typePrefix}${type}`);
  return value === null ? DEFAULT_VISIBLE_TYPES.has(type) : value === 'true';
}

function setSavedTypeState(type, checked) {
  localStorage.setItem(`${STORAGE_KEYS.typePrefix}${type}`, String(checked));
}

function getSavedCompoundNameState() {
  const value = localStorage.getItem(STORAGE_KEYS.compoundNames);
  return value === null ? true : value === 'true';
}

function getMapCompletionSet(mapId) {
  if (!completedPoisByMap.has(mapId)) {
    completedPoisByMap.set(mapId, new Set());
  }

  return completedPoisByMap.get(mapId);
}

function getPoiId(mapId, index) {
  return `${mapId}:${index}`;
}

function getDistanceBetweenCoordinates(coord1, coord2) {
  const [y1, x1] = coord1;
  const [y2, x2] = coord2;
  return Math.hypot(y2 - y1, x2 - x1);
}

function getDrawingHistory(mapId) {
  if (!drawingHistoryByMap.has(mapId)) {
    drawingHistoryByMap.set(mapId, []);
  }
  return drawingHistoryByMap.get(mapId);
}

function getDrawingsLayer(mapId) {
  if (!drawingsLayerByMap.has(mapId)) {
    drawingsLayerByMap.set(mapId, L.layerGroup());
  }
  return drawingsLayerByMap.get(mapId);
}

function addDrawLayerToHistory(layer) {
  if (!activeMapId || !layer) {
    return;
  }

  getDrawingsLayer(activeMapId).addLayer(layer);
  getDrawingHistory(activeMapId).push(layer);
}

function clearLinePreview() {
  if (drawingState.linePreviewLayer && map?.hasLayer(drawingState.linePreviewLayer)) {
    map.removeLayer(drawingState.linePreviewLayer);
  }

  drawingState.linePreviewLayer = null;
  drawingState.lineDraftStart = null;
  drawingState.isLineDrawing = false;
}

function setDrawingInputLock(enabled) {
  const body = document.body;
  if (body) {
    body.classList.toggle('drawing-input-lock', Boolean(enabled));
  }
}

function stopActiveDrawingSession() {
  const wasFreehandDrawing = drawingState.isFreehandDrawing;
  const wasLineDrawing = drawingState.isLineDrawing;

  drawingState.isFreehandDrawing = false;
  drawingState.freehandPoints = [];

  if (drawingState.freehandPreviewLayer && map?.hasLayer(drawingState.freehandPreviewLayer)) {
    map.removeLayer(drawingState.freehandPreviewLayer);
  }
  drawingState.freehandPreviewLayer = null;

  clearLinePreview();
  setDrawingInputLock(false);

  if ((wasFreehandDrawing || wasLineDrawing) && map) {
    syncMapDraggingWithDrawMode();
  }
}

function resetTransientDrawingState() {
  stopActiveDrawingSession();
}

function updateDrawModeButtons() {
  const freehandBtn = document.getElementById('drawFreehandBtn');
  const measureBtn = document.getElementById('drawMeasureLineBtn');
  const circleBtn = document.getElementById('drawCircle150Btn');
  const eraseBtn = document.getElementById('drawEraseBtn');

  if (freehandBtn) {
    freehandBtn.classList.toggle('active', drawingState.mode === DRAW_MODES.freehand);
  }
  if (measureBtn) {
    measureBtn.classList.toggle('active', drawingState.mode === DRAW_MODES.line);
  }
  if (circleBtn) {
    circleBtn.classList.toggle('active', drawingState.mode === DRAW_MODES.circle);
  }
  if (eraseBtn) {
    eraseBtn.classList.toggle('active', drawingState.mode === DRAW_MODES.erase);
  }
}

function updateMapDrawCursor() {
  const mapElement = document.getElementById('map');
  if (!mapElement) {
    return;
  }

  const hasActiveDrawMode = drawingState.mode !== DRAW_MODES.none;
  mapElement.classList.toggle('drawing-active', hasActiveDrawMode);
}

function updateMapInteractionLockForDraw() {
  const mapElement = document.getElementById('map');
  if (!mapElement) {
    return;
  }

  const shouldLockOverlayInteraction = drawingState.mode === DRAW_MODES.freehand
    || drawingState.mode === DRAW_MODES.line
    || drawingState.mode === DRAW_MODES.erase;
  mapElement.classList.toggle('drawing-lock-overlays', shouldLockOverlayInteraction);
}

function syncMapDraggingWithDrawMode() {
  if (!map?.dragging) {
    return;
  }

  const shouldDisableDragging = drawingState.mode === DRAW_MODES.line
    || drawingState.mode === DRAW_MODES.circle
    || drawingState.mode === DRAW_MODES.erase;

  if (shouldDisableDragging && map.dragging.enabled()) {
    map.dragging.disable();
    return;
  }

  if (!shouldDisableDragging && !map.dragging.enabled()) {
    map.dragging.enable();
  }
}

function setDrawingMode(mode) {
  drawingState.mode = drawingState.mode === mode ? DRAW_MODES.none : mode;
  resetTransientDrawingState();
  updateDrawModeButtons();
  updateMapDrawCursor();
  updateMapInteractionLockForDraw();
  syncMapDraggingWithDrawMode();
}

function getMetersPerMapUnit() {
  if (!currentMapBounds || !Array.isArray(currentMapBounds) || currentMapBounds.length !== 2) {
    return 1;
  }

  const heightUnits = Math.abs(currentMapBounds[1][0] - currentMapBounds[0][0]);
  const widthUnits = Math.abs(currentMapBounds[1][1] - currentMapBounds[0][1]);

  if (!Number.isFinite(heightUnits) || !Number.isFinite(widthUnits) || !heightUnits || !widthUnits) {
    return 1;
  }

  const averageUnits = (heightUnits + widthUnits) / 2;
  return 1000 / averageUnits;
}

function getMidPoint(start, end) {
  return [
    (start[0] + end[0]) / 2,
    (start[1] + end[1]) / 2
  ];
}

function formatDistanceMeters(meters) {
  return `${Math.round(meters)} m`;
}

function createDistanceLine(start, end) {
  const line = L.polyline([start, end], {
    color: '#ff3b3b',
    weight: 3,
    opacity: 0.95
  });

  const mapUnitsDistance = getDistanceBetweenCoordinates(start, end);
  const metersDistance = mapUnitsDistance * getMetersPerMapUnit();
  line.bindTooltip(formatDistanceMeters(metersDistance), {
    permanent: true,
    className: 'draw-distance-tooltip',
    direction: 'center',
    interactive: false
  });

  line.openTooltip(getMidPoint(start, end));
  return line;
}

function createCirclePolygon(center, radiusMeters) {
  const metersPerMapUnit = getMetersPerMapUnit();
  const radiusUnits = radiusMeters / metersPerMapUnit;
  const points = [];
  const segments = 48;

  for (let index = 0; index < segments; index += 1) {
    const angle = (Math.PI * 2 * index) / segments;
    const y = center[0] + (Math.sin(angle) * radiusUnits);
    const x = center[1] + (Math.cos(angle) * radiusUnits);
    points.push([y, x]);
  }

  return L.polygon(points, {
    color: '#ff3b3b',
    weight: 2,
    fillColor: '#ff3b3b',
    fillOpacity: 0.08
  });
}

function getLatLngGroups(layer) {
  const latLngs = layer.getLatLngs?.();
  if (!Array.isArray(latLngs) || latLngs.length === 0) {
    return [];
  }

  if (Array.isArray(latLngs[0])) {
    return latLngs;
  }

  return [latLngs];
}

function getPointToSegmentDistance(point, segmentStart, segmentEnd) {
  const abX = segmentEnd.x - segmentStart.x;
  const abY = segmentEnd.y - segmentStart.y;
  const apX = point.x - segmentStart.x;
  const apY = point.y - segmentStart.y;
  const abSquare = (abX * abX) + (abY * abY);

  if (abSquare === 0) {
    return Math.hypot(apX, apY);
  }

  const t = Math.max(0, Math.min(1, ((apX * abX) + (apY * abY)) / abSquare));
  const closestX = segmentStart.x + (abX * t);
  const closestY = segmentStart.y + (abY * t);
  return Math.hypot(point.x - closestX, point.y - closestY);
}

function getDistanceToLayerInPixels(layer, clickLatLng) {
  if (!map || !layer || !clickLatLng || !layer.getLatLngs) {
    return Number.POSITIVE_INFINITY;
  }

  const clickPoint = map.latLngToLayerPoint(clickLatLng);
  const groups = getLatLngGroups(layer);
  let minDistance = Number.POSITIVE_INFINITY;

  groups.forEach((group) => {
    if (!Array.isArray(group) || group.length < 2) {
      return;
    }

    for (let index = 0; index < group.length - 1; index += 1) {
      const startPoint = map.latLngToLayerPoint(group[index]);
      const endPoint = map.latLngToLayerPoint(group[index + 1]);
      const distance = getPointToSegmentDistance(clickPoint, startPoint, endPoint);
      minDistance = Math.min(minDistance, distance);
    }

    if (layer instanceof L.Polygon && group.length > 2) {
      const startPoint = map.latLngToLayerPoint(group.at(-1));
      const endPoint = map.latLngToLayerPoint(group[0]);
      const distance = getPointToSegmentDistance(clickPoint, startPoint, endPoint);
      minDistance = Math.min(minDistance, distance);
    }
  });

  return minDistance;
}

function removeLayerFromHistory(mapId, layerToRemove) {
  const history = getDrawingHistory(mapId);
  const filteredHistory = history.filter((layer) => layer !== layerToRemove);
  drawingHistoryByMap.set(mapId, filteredHistory);
}

function eraseNearestDrawing(clickLatLng) {
  if (!activeMapId) {
    return;
  }

  const drawLayer = getDrawingsLayer(activeMapId);
  const ERASE_THRESHOLD_PX = 14;
  let nearestLayer = null;
  let nearestDistance = Number.POSITIVE_INFINITY;

  drawLayer.eachLayer((layer) => {
    if (!(layer instanceof L.Polyline || layer instanceof L.Polygon)) {
      return;
    }

    const distance = getDistanceToLayerInPixels(layer, clickLatLng);
    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestLayer = layer;
    }
  });

  if (!nearestLayer || nearestDistance > ERASE_THRESHOLD_PX) {
    return;
  }

  drawLayer.removeLayer(nearestLayer);
  removeLayerFromHistory(activeMapId, nearestLayer);
}

function undoLastDrawing() {
  if (!activeMapId) {
    return;
  }

  const history = getDrawingHistory(activeMapId);
  const layer = history.pop();
  if (!layer) {
    return;
  }

  const drawLayer = getDrawingsLayer(activeMapId);
  drawLayer.removeLayer(layer);
}

function clearAllDrawings() {
  if (!activeMapId) {
    return;
  }

  const drawLayer = getDrawingsLayer(activeMapId);
  drawLayer.clearLayers();
  drawingHistoryByMap.set(activeMapId, []);
  resetTransientDrawingState();
}

function onMapMouseDown(event) {
  if (event?.originalEvent?.button !== undefined && event.originalEvent.button !== 0) {
    return;
  }

  if (!event?.latlng) {
    return;
  }

  if (drawingState.mode === DRAW_MODES.line) {
    if (event?.originalEvent) {
      event.originalEvent.preventDefault();
      event.originalEvent.stopPropagation();
    }

    setDrawingInputLock(true);

    if (map?.dragging?.enabled()) {
      map.dragging.disable();
    }

    drawingState.isLineDrawing = true;
    drawingState.lineDraftStart = [event.latlng.lat, event.latlng.lng];
    clearLinePreview();
    drawingState.isLineDrawing = true;
    drawingState.lineDraftStart = [event.latlng.lat, event.latlng.lng];
    drawingState.linePreviewLayer = L.polyline([
      drawingState.lineDraftStart,
      drawingState.lineDraftStart
    ], {
      color: '#ff3b3b',
      weight: 3,
      opacity: 0.65,
      dashArray: '8,6'
    }).addTo(map);
    return;
  }

  if (drawingState.mode !== DRAW_MODES.freehand) {
    return;
  }

  if (event?.originalEvent) {
    event.originalEvent.preventDefault();
    event.originalEvent.stopPropagation();
  }

  setDrawingInputLock(true);

  drawingState.isFreehandDrawing = true;
  drawingState.freehandPoints = [event.latlng];

  if (drawingState.freehandPreviewLayer && map.hasLayer(drawingState.freehandPreviewLayer)) {
    map.removeLayer(drawingState.freehandPreviewLayer);
  }

  drawingState.freehandPreviewLayer = L.polyline(drawingState.freehandPoints, {
    color: '#ff3b3b',
    weight: 3,
    opacity: 0.95
  }).addTo(map);

  if (map?.dragging?.enabled()) {
    map.dragging.disable();
  }
}

function onMapMouseMove(event) {
  if (!event?.latlng) {
    return;
  }

  if (drawingState.mode === DRAW_MODES.line && drawingState.isLineDrawing && drawingState.linePreviewLayer && drawingState.lineDraftStart) {
    drawingState.linePreviewLayer.setLatLngs([
      drawingState.lineDraftStart,
      [event.latlng.lat, event.latlng.lng]
    ]);
    return;
  }

  if (drawingState.mode !== DRAW_MODES.freehand || !drawingState.isFreehandDrawing) {
    return;
  }

  drawingState.freehandPoints.push(event.latlng);
  if (drawingState.freehandPreviewLayer) {
    drawingState.freehandPreviewLayer.setLatLngs(drawingState.freehandPoints);
  }
}

function onMapMouseUp(event) {
  if (drawingState.mode === DRAW_MODES.line) {
    if (!drawingState.isLineDrawing || !drawingState.lineDraftStart) {
      return;
    }

    const start = drawingState.lineDraftStart;
    const end = event?.latlng ? [event.latlng.lat, event.latlng.lng] : start;
    const hasDistance = getDistanceBetweenCoordinates(start, end) > 0;

    clearLinePreview();
    setDrawingInputLock(false);
    syncMapDraggingWithDrawMode();

    if (hasDistance) {
      const line = createDistanceLine(start, end);
      addDrawLayerToHistory(line);
    }
    return;
  }

  if (drawingState.mode !== DRAW_MODES.freehand || !drawingState.isFreehandDrawing) {
    return;
  }

  drawingState.isFreehandDrawing = false;
  if (drawingState.freehandPoints.length > 1) {
    const line = L.polyline(drawingState.freehandPoints, {
      color: '#ff3b3b',
      weight: 3,
      opacity: 0.95
    });
    addDrawLayerToHistory(line);
  }

  if (drawingState.freehandPreviewLayer && map.hasLayer(drawingState.freehandPreviewLayer)) {
    map.removeLayer(drawingState.freehandPreviewLayer);
  }
  drawingState.freehandPreviewLayer = null;
  drawingState.freehandPoints = [];
  setDrawingInputLock(false);

  syncMapDraggingWithDrawMode();
}

function onGlobalPointerUpForDraw() {
  if (!drawingState.isFreehandDrawing && !drawingState.isLineDrawing) {
    setDrawingInputLock(false);
    return;
  }

  stopActiveDrawingSession();
}

function onMapClickForDraw(event) {
  if (!event?.latlng || !activeMapId) {
    return;
  }

  const point = [event.latlng.lat, event.latlng.lng];

  if (drawingState.mode === DRAW_MODES.erase) {
    eraseNearestDrawing(event.latlng);
    return;
  }

  if (drawingState.mode === DRAW_MODES.circle) {
    const circlePolygon = createCirclePolygon(point, 150);
    addDrawLayerToHistory(circlePolygon);
  }
}

function bindDrawingTools() {
  map.on('mousedown', onMapMouseDown);
  map.on('mousemove', onMapMouseMove);
  map.on('mouseup', onMapMouseUp);
  map.on('mouseout', onMapMouseUp);
  map.on('click', onMapClickForDraw);

  if (!drawingGlobalListenersBound) {
    globalThis.addEventListener('mouseup', onGlobalPointerUpForDraw);
    globalThis.addEventListener('blur', onGlobalPointerUpForDraw);
    drawingGlobalListenersBound = true;
  }

  const drawFreehandBtn = document.getElementById('drawFreehandBtn');
  const drawMeasureLineBtn = document.getElementById('drawMeasureLineBtn');
  const drawCircle150Btn = document.getElementById('drawCircle150Btn');
  const drawEraseBtn = document.getElementById('drawEraseBtn');
  const drawUndoBtn = document.getElementById('drawUndoBtn');
  const drawClearBtn = document.getElementById('drawClearBtn');

  if (drawFreehandBtn) {
    drawFreehandBtn.addEventListener('click', () => {
      setDrawingMode(DRAW_MODES.freehand);
    });
  }

  if (drawMeasureLineBtn) {
    drawMeasureLineBtn.addEventListener('click', () => {
      setDrawingMode(DRAW_MODES.line);
    });
  }

  if (drawCircle150Btn) {
    drawCircle150Btn.addEventListener('click', () => {
      setDrawingMode(DRAW_MODES.circle);
    });
  }

  if (drawEraseBtn) {
    drawEraseBtn.addEventListener('click', () => {
      setDrawingMode(DRAW_MODES.erase);
    });
  }

  if (drawUndoBtn) {
    drawUndoBtn.addEventListener('click', () => {
      undoLastDrawing();
    });
  }

  if (drawClearBtn) {
    drawClearBtn.addEventListener('click', () => {
      clearAllDrawings();
    });
  }

  updateDrawModeButtons();
  updateMapDrawCursor();
  updateMapInteractionLockForDraw();
  syncMapDraggingWithDrawMode();
}

function attachCurrentMapDrawings() {
  if (!activeMapId) {
    return;
  }

  const layer = getDrawingsLayer(activeMapId);
  if (!map.hasLayer(layer)) {
    layer.addTo(map);
  }
}

function handleSpawnSelection(mapId, selectedPoiId, selectedMarker, baseStyle, poi) {
  const spawnLayer = markerLayersByType.spawn;
  if (!spawnLayer) return;

  const previousSelection = selectedSpawnByMap.get(mapId);
  if (previousSelection && previousSelection.poiId === selectedPoiId) {
    selectedSpawnByMap.delete(mapId);
    applyPoiVisualState(selectedMarker, baseStyle, false);
    const textMarker = spawnTextMarkerByMap.get(mapId);
    if (textMarker && map.hasLayer(textMarker)) {
      map.removeLayer(textMarker);
      spawnTextMarkerByMap.delete(mapId);
    }
    spawnLayer.eachLayer((marker) => {
      if (marker === selectedMarker) return;
      if (marker?.poiState?.mapId === mapId) {
        applyPoiVisualState(marker, marker.poiState.baseStyle, false);
        if (map.hasLayer(spawnLayer)) {
          spawnLayer.addLayer(marker);
        }
      }
    });
    return;
  }

  const allSpawns = [];
  spawnLayer.eachLayer((marker) => {
    if (marker?.poiState?.mapId === mapId) {
      const coords = marker.getLatLng();
      allSpawns.push({
        marker,
        coords: [coords.lat, coords.lng],
        poiId: marker.poiState.poiId,
        baseStyle: marker.poiState.baseStyle
      });
    }
  });

  const spawnDistance = allSpawns
    .filter((s) => s.poiId !== selectedPoiId)
    .map((s) => ({
      ...s,
      distance: getDistanceBetweenCoordinates(poi.coordinates, s.coords)
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 4);

  selectedSpawnByMap.set(mapId, {
    poiId: selectedPoiId,
    marker: selectedMarker,
    closestSpawns: spawnDistance.map((s) => s.poiId)
  });

  selectedMarker.setStyle({
    radius: baseStyle.radius * 1.5,
    color: '#ffffff',
    fillColor: '#ffffff',
    fillOpacity: 0.9,
    weight: 3
  });

  const oldTextMarker = spawnTextMarkerByMap.get(mapId);
  if (oldTextMarker && map.hasLayer(oldTextMarker)) {
    map.removeLayer(oldTextMarker);
  }

  const textMarker = L.marker(poi.coordinates, {
    icon: L.divIcon({
      className: 'spawn-text-marker',
      html: `<div style="font-weight:bold;color:#ffffff;text-shadow:2px 2px 4px #000;font-size:14px;white-space:nowrap;">${getUIText('spawnMessage')}</div>`,
      iconSize: [150, 30],
      iconAnchor: [75, 30]
    }),
    interactive: false
  });
  textMarker.addTo(map);
  spawnTextMarkerByMap.set(mapId, textMarker);

  spawnLayer.eachLayer((marker) => {
    if (marker === selectedMarker) return;
    if (marker?.poiState?.mapId !== mapId) return;

    const isClosest = spawnDistance.some((s) => s.poiId === marker.poiState.poiId);
    if (isClosest) {
      applyPoiVisualState(marker, marker.poiState.baseStyle, false);
      if (map.hasLayer(spawnLayer)) spawnLayer.addLayer(marker);
    } else if (map.hasLayer(spawnLayer)) {
      spawnLayer.removeLayer(marker);
    }
  });
}

function applyPoiVisualState(marker, baseStyle, isCompleted) {
  marker.setStyle({
    radius: isCompleted ? Math.max(3, Math.round(baseStyle.radius * 0.8)) : baseStyle.radius,
    color: isCompleted ? '#c4c4c4' : baseStyle.color,
    fillColor: isCompleted ? '#7b7b7b' : baseStyle.fillColor,
    opacity: isCompleted ? 0.85 : 1,
    fillOpacity: isCompleted ? 0.25 : baseStyle.fillOpacity,
    weight: baseStyle.weight
  });

  marker.redraw();
}

function togglePoiCompletion(mapId, poiId, marker, baseStyle) {
  const completionSet = getMapCompletionSet(mapId);
  const isCompleted = completionSet.has(poiId);

  if (isCompleted) {
    completionSet.delete(poiId);
    applyPoiVisualState(marker, baseStyle, false);
    return;
  }

  completionSet.add(poiId);
  applyPoiVisualState(marker, baseStyle, true);
}

function resetCurrentMapPoiState() {
  if (!activeMapId) {
    return;
  }

  completedPoisByMap.set(activeMapId, new Set());
  selectedSpawnByMap.delete(activeMapId);

  const textMarker = spawnTextMarkerByMap.get(activeMapId);
  if (textMarker && map.hasLayer(textMarker)) {
    map.removeLayer(textMarker);
  }
  spawnTextMarkerByMap.delete(activeMapId);

  const spawnLayer = markerLayersByType.spawn;
  if (spawnLayer && getSavedTypeState('spawn')) {
    const spawnMarkers = allSpawnMarkersByMap.get(activeMapId) || [];
    spawnMarkers.forEach((marker) => {
      spawnLayer.addLayer(marker);
      applyPoiVisualState(marker, marker.poiState.baseStyle, false);
    });
  }

  Object.values(markerLayersByType).forEach((layer) => {
    layer.eachLayer((marker) => {
      if (marker?.poiState?.mapId !== activeMapId) {
        return;
      }

      if (layer !== spawnLayer) {
        applyPoiVisualState(marker, marker.poiState.baseStyle, false);
      }
    });
  });
}

function applyTypeDefaultsOnce() {
  if (localStorage.getItem(STORAGE_KEYS.typeDefaultsVersion) === 'true') {
    return;
  }

  Object.keys(POI_TYPES).forEach((type) => {
    setSavedTypeState(type, DEFAULT_VISIBLE_TYPES.has(type));
  });

  localStorage.setItem(STORAGE_KEYS.typeDefaultsVersion, 'true');
}

function createButton(text, className = 'btn') {
  const button = document.createElement('button');
  button.className = className;
  button.type = 'button';
  button.textContent = text;
  return button;
}

function createMapButtons() {
  const topBar = document.getElementById('topBar');
  topBar.innerHTML = '';

  if (!MAPS.length) {
    const emptyState = document.createElement('span');
    emptyState.textContent = 'No hay mapas disponibles';
    topBar.appendChild(emptyState);
    return;
  }

  MAPS.forEach((entry) => {
    const button = createButton(entry.name);
    button.textContent = getMapName(entry);
    button.classList.toggle('active', entry.id === activeMapId);
    button.addEventListener('click', () => {
      activeMapId = entry.id;
      localStorage.setItem(STORAGE_KEYS.activeMap, activeMapId);
      createMapButtons();
      renderMapData();
    });
    topBar.appendChild(button);
  });
}

function buildLegend() {
  const legendItems = document.getElementById('legendItems');
  legendItems.innerHTML = '';

  Object.entries(POI_TYPES).forEach(([type, settings]) => {
    const wrapper = document.createElement('label');
    wrapper.className = 'legend-item';

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.checked = getSavedTypeState(type);
    input.dataset.type = type;

    const dot = document.createElement('span');
    dot.className = 'dot';
    dot.style.backgroundColor = settings.color;
    dot.style.borderColor = settings.borderColor;

    const text = document.createElement('span');
    text.textContent = getPoiTypeLabel(type, settings.label);

    input.addEventListener('change', () => {
      setSavedTypeState(type, input.checked);
      updateTypeVisibility(type, input.checked);
    });

    wrapper.appendChild(input);
    wrapper.appendChild(dot);
    wrapper.appendChild(text);
    legendItems.appendChild(wrapper);
  });

  const toggleCompoundNames = document.getElementById('toggleCompoundNames');
  toggleCompoundNames.checked = getSavedCompoundNameState();
  toggleCompoundNames.onchange = () => {
    localStorage.setItem(STORAGE_KEYS.compoundNames, String(toggleCompoundNames.checked));
    if (!compoundNamesLayer) {
      return;
    }
    if (toggleCompoundNames.checked) {
      map.addLayer(compoundNamesLayer);
    } else {
      map.removeLayer(compoundNamesLayer);
    }
  };
}

function updateTypeVisibility(type, visible) {
  const layer = markerLayersByType[type];
  if (!layer) {
    return;
  }
  if (visible) {
    map.addLayer(layer);
  } else {
    map.removeLayer(layer);
  }
}

function clearMapLayers() {
  globalThis.resizeMapHandler && globalThis.removeEventListener('resize', globalThis.resizeMapHandler);

  resetTransientDrawingState();

  drawingsLayerByMap.forEach((layer) => {
    if (map.hasLayer(layer)) {
      map.removeLayer(layer);
    }
  });
  
  Object.values(markerLayersByType).forEach((layer) => {
    if (map.hasLayer(layer)) {
      map.removeLayer(layer);
    }
  });

  Object.keys(markerLayersByType).forEach((key) => {
    delete markerLayersByType[key];
  });

  if (activeMapId) {
    allSpawnMarkersByMap.delete(activeMapId);
  }

  if (compoundNamesLayer && map.hasLayer(compoundNamesLayer)) {
    map.removeLayer(compoundNamesLayer);
  }

  if (overlay && map.hasLayer(overlay)) {
    map.removeLayer(overlay);
  }
}

function getImageSize(imagePath) {
  if (imageSizeCache.has(imagePath)) {
    return Promise.resolve(imageSizeCache.get(imagePath));
  }

  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => {
      const size = [image.naturalHeight, image.naturalWidth];
      imageSizeCache.set(imagePath, size);
      resolve(size);
    };
    image.onerror = () => {
      const fallback = [911, 911];
      imageSizeCache.set(imagePath, fallback);
      resolve(fallback);
    };
    image.src = imagePath;
  });
}

async function renderOverlay(mapConfig) {
  // Priorizar el tamaño real de la imagen para evitar offsets en los marcadores.
  // Si falla la carga, usar el tamaño configurado o un fallback seguro.
  const configuredSize = Array.isArray(mapConfig.size) ? mapConfig.size : null;
  const imageSize = await getImageSize(mapConfig.image);
  const hasValidImageSize = Array.isArray(imageSize)
    && imageSize.length === 2
    && Number.isFinite(imageSize[0])
    && Number.isFinite(imageSize[1])
    && imageSize[0] > 0
    && imageSize[1] > 0;
  const mapSize = hasValidImageSize ? imageSize : (configuredSize || [911, 911]);
  
  // Leaflet: [0,0]=arriba-izq, [height,width]=abajo-der
  // Datos: [0,0]=abajo-izq, [maxY,maxX]=arriba-der
  // Invertir bounds para que la imagen coincida
  const bounds = [
    [0, 0],
    [mapSize[0], mapSize[1]]
  ];

  overlay = L.imageOverlay(mapConfig.image, bounds).addTo(map);
  map.setMaxBounds(bounds);
  
  currentMapBounds = bounds;
  
  globalThis.resizeMapHandler = () => {
    map.fitBounds(currentMapBounds, { animate: false });
  };
  
  globalThis.resizeMapHandler();
  globalThis.addEventListener('resize', globalThis.resizeMapHandler);
}

function renderPOIs(mapConfig) {
  const completionSet = getMapCompletionSet(mapConfig.id);

  mapConfig.pois.forEach((poi, index) => {
    const style = POI_TYPES[poi.type];
    if (!style) {
      return;
    }

    if (!markerLayersByType[poi.type]) {
      markerLayersByType[poi.type] = L.layerGroup();
    }

    const levelColor = style.levels && poi.level !== null && style.levels[String(poi.level)]
      ? style.levels[String(poi.level)]
      : style.color;

    const marker = L.circleMarker(poi.coordinates, {
      radius: style.radius,
      color: style.borderColor,
      fillColor: levelColor,
      fillOpacity: 0.85,
      weight: 2
    });

    const baseStyle = {
      radius: style.radius,
      color: style.borderColor,
      fillColor: levelColor,
      fillOpacity: 0.85,
      weight: 2
    };

    const poiId = getPoiId(mapConfig.id, index);
    marker.poiState = {
      mapId: mapConfig.id,
      poiId,
      baseStyle
    };

    applyPoiVisualState(marker, baseStyle, completionSet.has(poiId));
    let lastToggleAt = 0;
    const handleMarkerInteraction = () => {
      const now = Date.now();
      if (now - lastToggleAt < 120) {
        return;
      }

      lastToggleAt = now;
      if (poi.type === 'spawn') {
        handleSpawnSelection(mapConfig.id, poiId, marker, baseStyle, poi);
      } else {
        togglePoiCompletion(mapConfig.id, poiId, marker, baseStyle);
      }
    };

    marker.on('click', handleMarkerInteraction);
    marker.on('popupopen', handleMarkerInteraction);

    markerLayersByType[poi.type].addLayer(marker);

    if (poi.type === 'spawn') {
      if (!allSpawnMarkersByMap.has(mapConfig.id)) {
        allSpawnMarkersByMap.set(mapConfig.id, []);
      }
      allSpawnMarkersByMap.get(mapConfig.id).push(marker);
    }
  });

  Object.keys(markerLayersByType).forEach((type) => {
    if (getSavedTypeState(type)) {
      markerLayersByType[type].addTo(map);
    }
  });
}

function renderCompoundLabels(mapConfig) {
  compoundNamesLayer = L.layerGroup();

  mapConfig.compounds.forEach((compound) => {
    const translatedName = getCompoundName(mapConfig.id, compound);

    const marker = L.marker(compound.coordinates, {
      icon: L.divIcon({
        className: 'compound-label',
        html: translatedName,
        iconSize: [0, 0]
      }),
      interactive: false
    });

    compoundNamesLayer.addLayer(marker);
  });

  if (getSavedCompoundNameState()) {
    compoundNamesLayer.addTo(map);
  }
}

async function renderMapData() {
  const mapConfig = getMapConfig(activeMapId);
  if (!mapConfig) {
    clearMapLayers();
    return;
  }
  clearMapLayers();
  await renderOverlay(mapConfig);
  renderPOIs(mapConfig);
  renderCompoundLabels(mapConfig);
  attachCurrentMapDrawings();
}

function bindUI() {
  const toggleMenuBtn = document.getElementById('toggleMenuBtn');
  const sideMenu = document.getElementById('sideMenu');
  const toggleLegendBtn = document.getElementById('toggleLegendBtn');
  const legend = document.getElementById('legend');
  const legendAll = document.getElementById('legendAll');
  const legendNone = document.getElementById('legendNone');
  const resetPoisBtn = document.getElementById('resetPoisBtn');
  const languageSelect = document.getElementById('languageSelect');

  toggleMenuBtn.addEventListener('click', () => {
    sideMenu.classList.toggle('open');
    const isOpen = sideMenu.classList.contains('open');
    sideMenu.setAttribute('aria-hidden', String(!isOpen));
  });

  toggleLegendBtn.addEventListener('click', () => {
    legend.classList.toggle('hidden');
  });

  legendAll.addEventListener('click', () => {
    document.querySelectorAll('#legendItems input[type="checkbox"]').forEach((input) => {
      input.checked = true;
      const type = input.dataset.type;
      setSavedTypeState(type, true);
      updateTypeVisibility(type, true);
    });
  });

  legendNone.addEventListener('click', () => {
    document.querySelectorAll('#legendItems input[type="checkbox"]').forEach((input) => {
      input.checked = false;
      const type = input.dataset.type;
      setSavedTypeState(type, false);
      updateTypeVisibility(type, false);
    });
  });

  if (resetPoisBtn) {
    resetPoisBtn.addEventListener('click', () => {
      resetCurrentMapPoiState();
    });
  }

  if (languageSelect) {
    languageSelect.value = currentLanguage;
    languageSelect.addEventListener('change', () => {
      setSavedLanguage(languageSelect.value);
      refreshLanguageUI();
    });
  }
}

function showLoadError(error) {
  const topBar = document.getElementById('topBar');
  if (topBar) {
    topBar.innerHTML = '';
    const message = document.createElement('span');
    message.textContent = 'Error cargando datos del mapa. Abre el proyecto con servidor local (http://localhost).';
    topBar.appendChild(message);
  }

  const mapElement = document.getElementById('map');
  if (mapElement) {
    mapElement.innerHTML = '<div style="padding:12px;color:#fff;">No se pudieron cargar los ficheros data/poiData.json / data/poiIcons.json.</div>';
  }

  console.error(error);
}

function fitMapToCurrentView() {
  if (currentMapBounds && map) {
    map.fitBounds(currentMapBounds, { animate: true });
  }
}

function createFitMapControl() {
  const FitMapControl = L.Control.extend({
    options: {
      position: 'bottomleft'
    },
    onAdd() {
      const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
      const button = L.DomUtil.create('a', 'leaflet-control-fit-map', container);
      button.href = '#';
      button.title = getUIText('fitMap');
      button.style.width = '38px';
      button.style.height = '38px';
      button.style.display = 'flex';
      button.style.alignItems = 'center';
      button.style.justifyContent = 'center';
      button.style.textDecoration = 'none';
      button.style.cursor = 'pointer';

      const img = document.createElement('img');
      img.src = 'assets/icons/fit-map.png';
      img.alt = getUIText('fitMap');
      img.style.width = '38px';
      img.style.height = '38px';
      img.style.display = 'block';
      button.appendChild(img);

      L.DomEvent.on(button, 'click', (e) => {
        L.DomEvent.preventDefault(e);
        fitMapToCurrentView();
      });

      return container;
    }
  });

  return new FitMapControl();
}

function init() {
  loadMapAndPoiData()
    .then(() => {
      currentLanguage = getSavedLanguage();

      if (!MAPS.length) {
        createMapButtons();
        return;
      }

      activeMapId = MAPS[0].id;
      const savedMap = localStorage.getItem(STORAGE_KEYS.activeMap);
      if (savedMap && MAPS.some((entry) => entry.id === savedMap)) {
        activeMapId = savedMap;
      }

      map = L.map('map', {
        crs: L.CRS.Simple,
        minZoom: -3,
        maxZoom: 2,
        zoomSnap: 0.05,
        attributionControl: false,
        zoomControl: false
      });

      createFitMapControl().addTo(map);
      L.control.zoom({ position: 'bottomleft' }).addTo(map);

      applyTypeDefaultsOnce();
      createMapButtons();
      buildLegend();
      bindUI();
      bindDrawingTools();
      applyStaticTranslations();
      renderMapData();
    })
    .catch((error) => {
      showLoadError(error);
    });
}

init();
