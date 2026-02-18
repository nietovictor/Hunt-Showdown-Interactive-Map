// ============ TRANSLATIONS CONFIGURATION ============
// Configuración centralizada de idiomas (ES/EN) para mapas, tipos de POI y compuestos

const TRANSLATIONS = {
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
    tarot_cards: { es: 'Cartas de tarot', en: 'Tarot cards' }
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
