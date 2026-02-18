let POI_TYPES = {};
let MAPS = [];

const I18N = {
  mapNames: {
    stillwater: { es: 'Pantano de Stillwater', en: 'Stillwater Bayou' },
    lawson: { es: 'Delta del Lawson', en: 'Lawson Delta' },
    desalle: { es: 'Desalle', en: 'Desalle' },
    mammon: { es: 'Barranco de Amon', en: 'Mammoth\'s Gulch' }
  },
  poiTypes: {
    spawn: { es: 'Spawns', en: 'Spawns' },
    armory: { es: 'Arsenal', en: 'Armory' },
    tower: { es: 'Torre de caza', en: 'Hunting tower' },
    big_tower: { es: 'Torre de vigia', en: 'Watch tower' },
    workbench: { es: 'Mesa de trabajo', en: 'Workbench' },
    wild_target: { es: 'Objetivo salvaje', en: 'Wild Target' },
    brute: { es: 'Mole', en: 'Brute' },
    beetle: { es: 'Escarabajos', en: 'Beetles' },
    easter_egg: { es: 'Easter eggs', en: 'Easter eggs' },
    melee_weapon: { es: 'Armas cuerpo a cuerpo', en: 'Melee weapons' },
    cash_register: { es: 'Caja registradora', en: 'Cash register' },
    tarot_cards: { es: 'Cartas de tarot', en: 'Tarot cards' },
  },
  compounds: {
    stillwater: {
      alain_son_s_fish: { es: '', en: 'Alain & Son\'s Fish' },
      reynard_mill_lumber: { es: '', en: 'Reynard Mill & Lumber' },
      port_reeker: { es: '', en: 'Port Reeker' },
      scupper_lake: { es: '', en: 'Scupper Lake' },
      darrow_livestock: { es: '', en: 'Darrow Livestock' },
      blanchett_graves: { es: '', en: 'Blanchett Graves' },
      alice_farm: { es: '', en: 'Alice Farm' },
      the_chapel_of_madonna_noire: { es: '', en: 'The Chapel of Madonna Noire' },
      lockbay_docks: { es: '', en: 'Lockbay Docks' },
      stillwater_bend: { es: '', en: 'Stillwater Bend' },
      pitching_crematorium: { es: '', en: 'Pitching Crematorium' },
      healing_waters_church: { es: '', en: 'Healing-Waters Church' },
      cyprus_huts: { es: '', en: 'Cyprus Huts' },
      davant_ranch: { es: '', en: 'Davant Ranch' },
      the_slaughterhouse: { es: '', en: 'The Slaughterhouse' },
      catfish_grove: { es: '', en: 'Catfish Grove' }
    },
    lawson: {
      godard_docks: { es: '', en: 'Godard Docks' },
      blanc_brinery: { es: '', en: 'Blanc Brinery' },
      golden_acres: { es: '', en: 'Golden Acres' },
      salter_s_pork: { es: '', en: 'Salter\'s Pork' },
      lawson_station: { es: '', en: 'Lawson Station' },
      maw_battery: { es: '', en: 'Maw Battery' },
      arden_parish: { es: '', en: 'Arden Parish' },
      sweetbell_flour: { es: '', en: 'Sweetbell Flour' },
      windy_run: { es: '', en: 'Windy Run' },
      iron_works: { es: '', en: 'Iron Works' },
      fort_carmick: { es: '', en: 'Fort Carmick' },
      nicholls_prison: { es: '', en: 'Nicholls Prison' },
      wolfshead_arsenal: { es: '', en: 'Wolfshead Arsenal' },
      bradley_craven_brickworks: { es: '', en: 'Bradley & Craven Brickworks' },
      c_a_lumber: { es: '', en: 'C&A Lumber' },
      hemlock_and_hide: { es: '', en: 'Hemlock and Hide' }
    },
    desalle: {
      kingsnake_mine: { es: '', en: 'Kingsnake Mine' },
      stanley_coal_company: { es: '', en: 'Stanley Coal Company' },
      heritage_pork: { es: '', en: 'Heritage Pork' },
      pearl_plantation: { es: '', en: 'Pearl Plantation' },
      moses_poultry: { es: '', en: 'Moses Poultry' },
      weeping_stone_mill: { es: '', en: 'Weeping Stone Mill' },
      ash_creek_lumber: { es: '', en: 'Ash Creek Lumber' },
      forked_river_fishery: { es: '', en: 'Forked River Fishery' },
      seven_sisters_estate: { es: '', en: 'Seven Sisters Estate' },
      pelican_island_prison: { es: '', en: 'Pelican Island Prison' },
      first_testimonial_church: { es: '', en: 'First Testimonial Church' },
      upper_desalle: { es: '', en: 'Upper DeSalle' },
      fort_bolden: { es: '', en: 'Fort Bolden' },
      darin_shipyard: { es: '', en: 'Darin Shipyard' },
      reeves_quarry: { es: '', en: 'Reeves Quarry' },
      lower_desalle: { es: '', en: 'Lower DeSalle' }
    },
    mammon: {
      blackthorn_stockyard: { es: '', en: 'Blackthorn Stockyard' },
      the_gasworks: { es: '', en: 'The Gasworks' },
      terminus_railyard: { es: '', en: 'Terminus Railyard' },
      east_mountain_corn: { es: '', en: 'East Mountain Corn' },
      monteros_malt: { es: '', en: 'Monteros Malt' },
      grizzly_lodge: { es: '', en: 'Grizzly Lodge' },
      o_donovan_stone: { es: '', en: 'O\'Donovan Stone' },
      split_river_mill: { es: '', en: 'Split River Mill' },
      machine_gorge: { es: '', en: 'Machine Gorge' },
      oro_gordo_mine: { es: '', en: 'Oro Gordo Mine' },
      la_plata_mine: { es: '', en: 'La Plata Mine' },
      deadfall_timber: { es: '', en: 'Deadfall Timber' },
      preston_oil: { es: '', en: 'Preston Oil' },
      kingfisher_foundry: { es: '', en: 'Kingfisher Foundry' },
      graystone_pit: { es: '', en: 'Graystone Pit' },
      miner_s_folly: { es: '', en: 'Miner\'s Folly' }
    }
  }
};

function normalizeLang(language) {
  return language === 'en' ? 'en' : 'es';
}

function getTranslation(translations, language, fallback) {
  if (!translations || typeof translations !== 'object') {
    return fallback;
  }

  const lang = normalizeLang(language);
  if (typeof translations[lang] === 'string' && translations[lang].trim()) {
    return translations[lang].trim();
  }

  if (lang !== 'en' && typeof translations.en === 'string' && translations.en.trim()) {
    return translations.en.trim();
  }

  if (lang !== 'es' && typeof translations.es === 'string' && translations.es.trim()) {
    return translations.es.trim();
  }

  return fallback;
}

function slugify(value) {
  if (typeof value !== 'string') {
    return '';
  }

  return value
    .normalize('NFD')
    .replaceAll(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/g, '_')
    .replaceAll(/(?:^_+|_+$)/g, '');
}

function getMapDisplayName(mapId, fallbackName, language) {
  return getTranslation(I18N.mapNames[mapId], language, fallbackName);
}

function getPoiTypeDisplayName(type, fallbackName, language) {
  // Intenta encontrar traducción del tipo exactamente y también su variante singular/plural
  const candidates = [type];

  // Añade variante singular o plural
  if (typeof type === 'string' && type.trim()) {
    if (type.endsWith('s')) {
      candidates.push(type.slice(0, -1)); // e.g., tarot_cards -> tarot_card
    } else {
      candidates.push(`${type}s`); // e.g., tarot_card -> tarot_cards
    }
  }

  // Prueba cada candidato hasta encontrar una traducción válida
  for (const candidate of candidates) {
    const translation = I18N.poiTypes[candidate];
    if (translation) {
      const result = getTranslation(translation, language, null);
      if (result !== null) {
        return result;
      }
    }
  }

  // Si nada funcionó, retorna el fallback original
  return fallbackName;
}

function getCompoundDisplayName(mapId, compoundKey, fallbackName, language) {
  const mapTranslations = I18N.compounds[mapId];
  if (!mapTranslations) {
    return fallbackName;
  }

  return getTranslation(mapTranslations[compoundKey], language, fallbackName);
}

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
  return [y, x];
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
    .map((compound, index) => {
      const coordinates = normalizeCoordinates(compound?.c, mapHeight);
      if (!coordinates) {
        return null;
      }

      const name = compound?.n || 'Compound';
      const key = slugify(name) || `compound_${index + 1}`;

      return {
        key,
        name,
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
