// Translates common English brewing process step names to Norwegian.
// Handles data from Sanity CMS and AI-generated recipes where step
// names may be in English while the rest of the UI is Norwegian.

const stepTranslations: Record<string, string> = {
  // Mashing
  "mashing": "Mesking",
  "mash": "Mesking",
  "mash in": "Innmesking",
  "mash out": "Utmesking",
  "mashout": "Utmesking",
  "mash rest": "Meskerast",
  "protein rest": "Proteinrast",
  "saccharification": "Forsukring",
  "saccharification rest": "Forsukringsrast",
  "acid rest": "Syrerast",

  // Boil
  "boil": "Koking",
  "boiling": "Koking",
  "pre-boil": "Forkoking",

  // Hop additions
  "whirlpool": "Whirlpool",
  "hop stand": "Humlerast",
  "hopstand": "Humlerast",
  "dry hop": "Tørrhumling",
  "dry hopping": "Tørrhumling",

  // Fermentation
  "fermentation": "Gjæring",
  "fermenting": "Gjæring",
  "primary fermentation": "Primærgjæring",
  "secondary fermentation": "Sekundærgjæring",
  "primary": "Primærgjæring",
  "secondary": "Sekundærgjæring",
  "conditioning": "Ettermodning",
  "cold conditioning": "Kaldmodning",
  "lagering": "Lagring",
  "diacetyl rest": "Diacetylrast",

  // Cooling / transfer
  "cooling": "Nedkjøling",
  "cool down": "Nedkjøling",
  "chilling": "Nedkjøling",
  "transfer": "Overføring",
  "racking": "Tapping",

  // Packaging
  "bottling": "Flasking",
  "kegging": "Fatlegging",
  "carbonation": "Karbonering",
  "packaging": "Pakking",

  // Water
  "water treatment": "Vannbehandling",
  "water chemistry": "Vannkjemi",

  // Sparge
  "sparge": "Skylling",
  "sparging": "Skylling",
  "fly sparge": "Flyskyling",
  "batch sparge": "Batchskyling",
  "vorlauf": "Vorlauf",
  "lautering": "Utlaking",
};

export function translateStep(step: string): string {
  const lower = step.toLowerCase().trim();
  return stepTranslations[lower] ?? step;
}
