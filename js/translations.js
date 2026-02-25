// ============ TRANSLATIONS CONFIGURATION ============
// Configuración centralizada de idiomas (ES/EN) para mapas, tipos de POI y compuestos

const TRANSLATIONS = {
  ui: {
    language: { es: 'Idioma', en: 'Language' },
    legend: { es: 'Leyenda', en: 'Legend' },
    resetMatch: { es: 'Resetear marcadores', en: 'Reset markers' },
    all: { es: 'Todo', en: 'All' },
    none: { es: 'Nada', en: 'None' },
    compoundNames: { es: 'Nombres de zonas', en: 'Compound names' },
    type: { es: 'Tipo', en: 'Type' },
    spawnMessage: { es: 'APARECISTE AQUÍ', en: 'YOU SPAWNED HERE' },
    fitMap: { es: 'Ajustar mapa a pantalla', en: 'Fit map to screen' },
    drawFreehand: { es: 'Dibujo libre', en: 'Freehand' },
    drawMeasureLine: { es: 'Medir distancia', en: 'Measure distance' },
    drawCircle150: { es: 'Rango de vision oscura', en: 'Darksight range' },
    drawErase: { es: 'Goma de borrar', en: 'Eraser' },
    drawUndo: { es: 'Atrás', en: 'Undo' },
    drawClear: { es: 'Limpiar', en: 'Clear' },
    sessionIdPlaceholder: { es: 'ID sesión', en: 'Session ID' },
    createSession: { es: 'Crear', en: 'Create' },
    joinSession: { es: 'Unirse', en: 'Join' },
    leaveSession: { es: 'Salir', en: 'Leave' },
    noSession: { es: 'Sin sesión', en: 'No session' },
    sessionPrefix: { es: 'Sesión', en: 'Session' },
    invalidSessionId: { es: 'ID inválida', en: 'Invalid ID' },
    coopUnavailable: { es: 'Coop no disponible', en: 'Co-op unavailable' }
  },
  mapNames: {
    stillwater: { es: 'Pantano de Stillwater', en: 'Stillwater Bayou' },
    lawson: { es: 'Delta del Lawson', en: 'Lawson Delta' },
    desalle: { es: 'DeSalle', en: 'DeSalle' },
    mammoths: { es: 'Barranco de Amon', en: 'Mammoth\'s Gulch' }
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
    tarot_cards: { es: 'Cartas de tarot', en: 'Tarot cards' }
  },
  compounds: {
    stillwater: {
      alain_son_s_fish: { es: 'Pescadería Alain e Hijo', en: 'Alain & Son\'s Fish' },
      reynard_mill_lumber: { es: 'Serrería Reynard', en: 'Reynard Mill & Lumber' },
      port_reeker: { es: 'Puerto Reeker', en: 'Port Reeker' },
      scupper_lake: { es: 'Lago Scupper', en: 'Scupper Lake' },
      darrow_livestock: { es: 'Ganadería Darrow', en: 'Darrow Livestock' },
      blanchett_graves: { es: 'Cementerio de Blanchett', en: 'Blanchett Graves' },
      alice_farm: { es: 'Granja de Alice', en: 'Alice Farm' },
      the_chapel_of_madonna_noire: { es: 'Capilla de Madonna Noire', en: 'The Chapel of Madonna Noire' },
      lockbay_docks: { es: 'Embarcadero de Lockbay', en: 'Lockbay Docks' },
      stillwater_bend: { es: 'Cruce de Stillwater', en: 'Stillwater Bend' },
      pitching_crematorium: { es: 'Crematorio Pitching', en: 'Pitching Crematorium' },
      healing_waters_church: { es: 'Iglesia de Healing Waters', en: 'Healing-Waters Church' },
      cyprus_huts: { es: 'Chozas de Cypress', en: 'Cyprus Huts' },
      davant_ranch: { es: 'Rancho Davant', en: 'Davant Ranch' },
      the_slaughterhouse: { es: 'Matadero', en: 'The Slaughterhouse' },
      catfish_grove: { es: 'Arboleda de Catfish', en: 'Catfish Grove' }
    },
    lawson: {
      godard_docks: { es: 'Embarcadero de Godard', en: 'Godard Docks' },
      blanc_brinery: { es: 'Conservera Blanc', en: 'Blanc Brinery' },
      golden_acres: { es: 'Golden Acres', en: 'Golden Acres' },
      salter_s_pork: { es: 'Granja Porcina de Salter', en: 'Salter\'s Pork' },
      lawson_station: { es: 'Estación de Lawson', en: 'Lawson Station' },
      maw_battery: { es: 'Fortificación Maw', en: 'Maw Battery' },
      arden_parish: { es: 'Parroquia de Arden', en: 'Arden Parish' },
      sweetbell_flour: { es: 'Harinas Sweetbell', en: 'Sweetbell Flour' },
      windy_run: { es: 'Windy Run', en: 'Windy Run' },
      iron_works: { es: 'Siderurgia', en: 'Iron Works' },
      fort_carmick: { es: 'Fuerte Carmick', en: 'Fort Carmick' },
      nicholls_prison: { es: 'Prisión Nicholls', en: 'Nicholls Prison' },
      wolfshead_arsenal: { es: 'Arsenal de Wolfshead', en: 'Wolfshead Arsenal' },
      bradley_craven_brickworks: { es: 'Ladrillera Bradley & Craven', en: 'Bradley & Craven Brickworks' },
      c_a_lumber: { es: 'Aserradero C&A', en: 'C&A Lumber' },
      hemlock_and_hide: { es: 'Hemlock & Hide', en: 'Hemlock and Hide' }
    },
    desalle: {
      kingsnake_mine: { es: 'Mina de Kingsnake', en: 'Kingsnake Mine' },
      stanley_coal_company: { es: 'Carbonera Stanley', en: 'Stanley Coal Company' },
      heritage_pork: { es: 'Granja Porcina', en: 'Heritage Pork' },
      pearl_plantation: { es: 'Plantación La Perla', en: 'Pearl Plantation' },
      moses_poultry: { es: 'Granja Avícola Moses', en: 'Moses Poultry' },
      weeping_stone_mill: { es: 'Molino de Weeping Stone', en: 'Weeping Stone Mill' },
      ash_creek_lumber: { es: 'Serrería de Ash Creek', en: 'Ash Creek Lumber' },
      forked_river_fishery: { es: 'Pesquería de Forked River', en: 'Forked River Fishery' },
      seven_sisters_estate: { es: 'Finca Seven Sisters', en: 'Seven Sisters Estate' },
      pelican_island_prison: { es: 'Prisión de Isla Pelícano', en: 'Pelican Island Prison' },
      first_testimonial_church: { es: 'Iglesia First Testimonial', en: 'First Testimonial Church' },
      upper_desalle: { es: 'DeSalle alto', en: 'Upper DeSalle' },
      fort_bolden: { es: 'Fuerte Bolden', en: 'Fort Bolden' },
      darin_shipyard: { es: 'Astillero de Darin', en: 'Darin Shipyard' },
      reeves_quarry: { es: 'Cantera Reeves', en: 'Reeves Quarry' },
      lower_desalle: { es: 'DeSalle bajo', en: 'Lower DeSalle' }
    },
    mammoths: {
      blackthorn_stockyard: { es: 'Granja Blackthorn', en: 'Blackthorn Stockyard' },
      the_gasworks: { es: 'Fábrica de gas', en: 'The Gasworks' },
      terminus_railyard: { es: 'Estación ferroviaria de Terminus', en: 'Terminus Railyard' },
      east_mountain_corn: { es: 'Maizal de East Mountain', en: 'East Mountain Corn' },
      monteros_malt: { es: 'Cervecería Monteros', en: 'Monteros Malt' },
      grizzly_lodge: { es: 'Refugio Grizzly', en: 'Grizzly Lodge' },
      o_donovan_stone: { es: 'Piedra O\'Donovan', en: 'O\'Donovan Stone' },
      split_river_mill: { es: 'Molino de Split River', en: 'Split River Mill' },
      machine_gorge: { es: 'Desfiladero Machine', en: 'Machine Gorge' },
      oro_gordo_mine: { es: 'Mina de Oro Gordo', en: 'Oro Gordo Mine' },
      la_plata_mine: { es: 'Mina de La Plata', en: 'La Plata Mine' },
      deadfall_timber: { es: 'Explotación maderera Deadfall', en: 'Deadfall Timber' },
      preston_oil: { es: 'Campo petrolífero Preston', en: 'Preston Oil' },
      kingfisher_foundry: { es: 'Fundición Kingfisher', en: 'Kingfisher Foundry' },
      graystone_pit: { es: 'Cantera Graystone', en: 'Graystone Pit' },
      miner_s_folly: { es: 'Miner\'s Folly', en: 'Miner\'s Folly' }
    }
  }
};

// ============ HELPER FUNCTIONS ============

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
  return getTranslation(TRANSLATIONS.mapNames[mapId], language, fallbackName);
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
    const translation = TRANSLATIONS.poiTypes[candidate];
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
  const mapTranslations = TRANSLATIONS.compounds[mapId];
  if (!mapTranslations) {
    return fallbackName;
  }

  return getTranslation(mapTranslations[compoundKey], language, fallbackName);
}

function getUITextTranslation(key, language, fallback = key) {
  return getTranslation(TRANSLATIONS.ui?.[key], language, fallback);
}
