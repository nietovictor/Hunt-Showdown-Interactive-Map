let POI_TYPES = {};
let MAPS = [];

const DEFAULT_MAP_IDS = {
  1: 'stillwater',
  2: 'lawson',
  3: 'desalle',
  4: 'mammon'
};

const DEFAULT_MAP_IMAGES = {
  1: 'assets/pantano_de_stillwater.webp',
  2: 'assets/delta_del_lawson.webp',
  3: 'assets/desalle.webp',
  4: 'assets/4.webp'
};

const AUTO_STYLE_PALETTE = [
  { color: '#5b8def', borderColor: '#2f5fb8' },
  { color: '#f39c12', borderColor: '#b86f00' },
  { color: '#9b59b6', borderColor: '#6f2e92' },
  { color: '#27ae60', borderColor: '#1f7d46' },
  { color: '#e74c3c', borderColor: '#b73428' },
  { color: '#16a085', borderColor: '#0f7460' },
  { color: '#d35400', borderColor: '#9c3d00' }
];

function normalizeCoordinates(value, mapHeight) {
  if (!Array.isArray(value) || value.length < 2) {
    return null;
  }

  const [y, x] = value;  // Primera coord = Y (vertical), segunda = X (horizontal)
  if (typeof x !== 'number' || typeof y !== 'number') {
    return null;
  }

  // Datos: [y, x] donde y=0 es abajo, y=4098 es arriba
  // Leaflet: [lat, lng] donde lat=0 es arriba, lat=maxHeight es abajo
  // Inversión necesaria: latLeaflet = mapHeight - yDatos
  return [mapHeight - y, x];
}

function toLabelFromCategory(category) {
  return category
    .replaceAll('_', ' ')
    .replaceAll(/\b\w/g, (match) => match.toUpperCase());
}

function typeFromCategory(category) {
  let normalized = category.toLowerCase().replaceAll(/[^a-z0-9]+/g, '_');
  if (normalized.endsWith('ies')) {
    normalized = `${normalized.slice(0, -3)}y`;
  } else if (normalized.endsWith('s')) {
    normalized = normalized.slice(0, -1);
  }
  return normalized;
}

function normalizePoiTypes(rawPoiTypes) {
  const normalized = {};

  Object.entries(rawPoiTypes || {}).forEach(([type, config]) => {
    const category = config?.categories || `${type}s`;
    normalized[type] = {
      type,
      label: config?.label || toLabelFromCategory(category),
      categories: category,
      color: config?.fillColor || config?.color || '#777777',
      borderColor: config?.borderColor || '#ffffff',
      radius: Number(config?.radius) || 8,
      levels: config?.levels || null
    };
  });

  return normalized;
}

function collectPoiCategories(rawMaps) {
  const categories = new Set();

  rawMaps.forEach((rawMap) => {
    Object.entries(rawMap || {}).forEach(([key, value]) => {
      if (key === 'compounds' || key === 'i' || key === 'n' || key === 'm' || key === 'o') {
        return;
      }

      if (!Array.isArray(value) || value.length === 0) {
        return;
      }

      if (value.some((entry) => Array.isArray(entry?.c))) {
        categories.add(key);
      }
    });
  });

  return categories;
}

function addMissingPoiTypes(baseTypes, rawMaps) {
  const existingCategories = new Set(Object.values(baseTypes).map((entry) => entry.categories));
  let colorIndex = 0;

  collectPoiCategories(rawMaps).forEach((category) => {
    if (existingCategories.has(category)) {
      return;
    }

    const style = AUTO_STYLE_PALETTE[colorIndex % AUTO_STYLE_PALETTE.length];
    colorIndex += 1;

    let type = typeFromCategory(category);
    while (baseTypes[type]) {
      type = `${type}_poi`;
    }

    baseTypes[type] = {
      type,
      label: toLabelFromCategory(category),
      categories: category,
      color: style.color,
      borderColor: style.borderColor,
      radius: 8,
      levels: null
    };
  });

  return baseTypes;
}

function estimateMapSize(rawMap) {
  let maxX = 0;
  let maxY = 0;

  Object.values(rawMap || {}).forEach((entry) => {
    if (!Array.isArray(entry)) {
      return;
    }

    entry.forEach((point) => {
      if (!Array.isArray(point?.c) || point.c.length < 2) {
        return;
      }

      const [y, x] = point.c;  // Primera coord = Y, segunda = X
      if (typeof x === 'number' && typeof y === 'number') {
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    });
  });

  // Primera coordenada es Y (altura), segunda es X (ancho)
  // Retornar [height, width] para Leaflet bounds
  return [Math.max(1024, maxY + 10), Math.max(1024, maxX + 10)];
}

function normalizeMapImage(rawMap) {
  if (DEFAULT_MAP_IMAGES[rawMap?.i]) {
    return DEFAULT_MAP_IMAGES[rawMap.i];
  }

  if (typeof rawMap?.m === 'string' && rawMap.m.trim()) {
    return rawMap.m.replace(/^\.\//, '');
  }

  return '';
}

function normalizeCompounds(rawMap, mapHeight) {
  if (!Array.isArray(rawMap?.compounds)) {
    return [];
  }

  return rawMap.compounds
    .map((compound) => {
      const coordinates = normalizeCoordinates(compound?.c, mapHeight);
      if (!coordinates) {
        return null;
      }

      return {
        name: compound?.n || 'Compound',
        coordinates
      };
    })
    .filter(Boolean);
}

function normalizePois(rawMap, poiTypes, mapHeight) {
  const pois = [];

  Object.entries(poiTypes).forEach(([type, style]) => {
    const rawCategoryPoints = rawMap?.[style.categories];
    if (!Array.isArray(rawCategoryPoints)) {
      return;
    }

    rawCategoryPoints.forEach((point, index) => {
      const coordinates = normalizeCoordinates(point?.c, mapHeight);
      if (!coordinates) {
        return;
      }

      let suggestedName = `${style.label} ${index + 1}`;

      if (typeof point?.n === 'string' && point.n.trim()) {
        suggestedName = point.n.trim();
      } else if (typeof point?.d === 'string' && point.d.trim()) {
        suggestedName = point.d.trim();
      }

      pois.push({
        type,
        name: suggestedName,
        coordinates,
        level: point?.level ?? null
      });
    });
  });

  return pois;
}

function normalizeMaps(rawMaps, poiTypes) {
  return (rawMaps || []).map((rawMap, index) => {
    const mapIndex = rawMap?.i || index + 1;
    const mapId = DEFAULT_MAP_IDS[mapIndex] || `map-${mapIndex}`;
    const mapSize = estimateMapSize(rawMap);
    const mapHeight = mapSize[0]; // [height, width]

    return {
      id: mapId,
      name: rawMap?.n || `Mapa ${mapIndex}`,
      image: normalizeMapImage(rawMap),
      size: mapSize,
      compounds: normalizeCompounds(rawMap, mapHeight),
      pois: normalizePois(rawMap, poiTypes, mapHeight)
    };
  });
}

async function loadMapAndPoiData() {
  const [mapsResponse, poiResponse] = await Promise.all([
    fetch('new_data.json'),
    fetch('poiData.json')
  ]);

  if (!mapsResponse.ok) {
    throw new Error('No se pudo cargar new_data.json');
  }

  if (!poiResponse.ok) {
    throw new Error('No se pudo cargar poiData.json');
  }

  const rawMaps = await mapsResponse.json();
  const rawPoiTypes = await poiResponse.json();

  const poiTypes = addMissingPoiTypes(normalizePoiTypes(rawPoiTypes), rawMaps);
  POI_TYPES = poiTypes;
  MAPS = normalizeMaps(rawMaps, poiTypes);
}
