let map;
let activeMapId = null;
let overlay;
let currentLanguage = 'es';
const markerLayersByType = {};
let compoundNamesLayer;
const imageSizeCache = new Map();

const STORAGE_KEYS = {
  activeMap: 'hunt_mvp_active_map',
  typePrefix: 'hunt_mvp_type_',
  compoundNames: 'hunt_mvp_compound_names',
  language: 'hunt_mvp_language'
};

const UI_TEXT = {
  es: {
    language: 'Idioma',
    legend: 'Leyenda',
    all: 'Todo',
    none: 'Nada',
    compoundNames: 'Nombres de zonas',
    type: 'Tipo'
  },
  en: {
    language: 'Language',
    legend: 'Legend',
    all: 'All',
    none: 'None',
    compoundNames: 'Compound names',
    type: 'Type'
  }
};

function getUIText(key) {
  return UI_TEXT[currentLanguage]?.[key] || UI_TEXT.es[key] || key;
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
}

function getSavedLanguage() {
  const value = localStorage.getItem(STORAGE_KEYS.language);
  return value === 'en' ? 'en' : 'es';
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
  return value === null ? true : value === 'true';
}

function setSavedTypeState(type, checked) {
  localStorage.setItem(`${STORAGE_KEYS.typePrefix}${type}`, String(checked));
}

function getSavedCompoundNameState() {
  const value = localStorage.getItem(STORAGE_KEYS.compoundNames);
  return value === null ? true : value === 'true';
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
  Object.values(markerLayersByType).forEach((layer) => {
    if (map.hasLayer(layer)) {
      map.removeLayer(layer);
    }
  });

  Object.keys(markerLayersByType).forEach((key) => {
    delete markerLayersByType[key];
  });

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
  map.fitBounds(bounds);
}

function renderPOIs(mapConfig) {
  mapConfig.pois.forEach((poi) => {
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

    const translatedTypeLabel = getPoiTypeLabel(poi.type, style.label);

    const marker = L.circleMarker(poi.coordinates, {
      radius: style.radius,
      color: style.borderColor,
      fillColor: levelColor,
      fillOpacity: 0.85,
      weight: 2
    });

    marker.bindPopup(`<strong>${poi.name}</strong><br/>${getUIText('type')}: ${translatedTypeLabel}`);
    markerLayersByType[poi.type].addLayer(marker);
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
}

function bindUI() {
  const toggleMenuBtn = document.getElementById('toggleMenuBtn');
  const sideMenu = document.getElementById('sideMenu');
  const toggleLegendBtn = document.getElementById('toggleLegendBtn');
  const legend = document.getElementById('legend');
  const legendAll = document.getElementById('legendAll');
  const legendNone = document.getElementById('legendNone');
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
        minZoom: -2,
        maxZoom: 2,
        zoomSnap: 0.25,
        attributionControl: false
      });

      createMapButtons();
      buildLegend();
      bindUI();
      applyStaticTranslations();
      renderMapData();
    })
    .catch((error) => {
      showLoadError(error);
    });
}

init();
