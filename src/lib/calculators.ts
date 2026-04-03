// --- ABV Calculator ---
// Standard formula: (OG - FG) * 131.25
export function calculateAbv(og: number, fg: number): number {
  return Math.round((og - fg) * 131.25 * 100) / 100;
}

// --- IBU Calculator (Tinseth formula) ---
export interface HopAddition {
  amountGrams: number;
  alphaAcid: number;
  boilMinutes: number;
}

export function calculateIbu(
  hops: HopAddition[],
  batchLiters: number,
  og: number,
): number {
  if (hops.length === 0 || batchLiters <= 0) return 0;

  const totalIbu = hops.reduce((sum, hop) => {
    const bignessFactor = 1.65 * Math.pow(0.000125, og - 1);
    const boilTimeFactor = (1 - Math.exp(-0.04 * hop.boilMinutes)) / 4.15;
    const utilization = bignessFactor * boilTimeFactor;
    const mgPerLiter = (hop.alphaAcid / 100) * hop.amountGrams * 1000;
    const ibu = (utilization * mgPerLiter) / batchLiters;
    return sum + ibu;
  }, 0);

  return Math.round(totalIbu * 10) / 10;
}

// --- SRM Calculator (Morey equation) ---
export interface GrainBill {
  weightKg: number;
  lovibond: number;
}

export function calculateSrm(grains: GrainBill[], batchLiters: number): number {
  if (grains.length === 0 || batchLiters <= 0) return 0;

  const batchGallons = batchLiters / 3.78541;
  const mcu = grains.reduce((sum, g) => {
    const weightLbs = g.weightKg * 2.20462;
    return sum + (weightLbs * g.lovibond) / batchGallons;
  }, 0);

  const srm = 1.4922 * Math.pow(mcu, 0.6859);
  return Math.round(srm * 10) / 10;
}

// --- Pitch Rate Calculator ---
export interface PitchRateResult {
  billionCells: number;
  dryYeastGrams: number;
  liquidYeastPacks: number;
  starterLiters: number;
}

export function calculatePitchRate(
  og: number,
  volumeLiters: number,
  type: "ale" | "lager",
): PitchRateResult {
  const rate = type === "ale" ? 0.75 : 1.5;
  const plato = ((og - 1) * 1000) / 4;
  const millionCellsPerMl = rate * plato;
  // million cells/mL * mL per liter * liters / 1000 = billion cells
  const billionCells = Math.round(millionCellsPerMl * volumeLiters * 10) / 10;

  const dryYeastGrams = Math.round((billionCells / 20) * 10) / 10;
  const liquidYeastPacks = Math.ceil(billionCells / 100);
  const starterLiters = Math.round(Math.max(0, (billionCells - 100) / 100) * 10) / 10;

  return { billionCells, dryYeastGrams, liquidYeastPacks, starterLiters };
}

// --- Hydrometer Temperature Correction ---
// Standard correction for a hydrometer calibrated at 20°C (68°F)
export function correctHydrometer(
  measuredSg: number,
  beerTempCelsius: number,
): number {
  const tempF = beerTempCelsius * 1.8 + 32;
  const correction =
    1.313454 -
    0.132674 * tempF +
    2.057793e-3 * tempF ** 2 -
    2.627634e-6 * tempF ** 3;
  return Math.round((measuredSg + correction / 1000) * 10000) / 10000;
}

// --- Strike Water Temperature (Palmer's formula) ---
export function calculateStrikeTemp(
  targetMashTemp: number,   // °C
  grainTempCelsius: number, // °C
  waterToGrainRatio: number, // L/kg
): number {
  // Palmer: Tw = (0.41/r)(T2 - T1) + T2, where r is quarts/lb
  // Convert L/kg → qt/lb: 1 L/kg ≈ 0.4796 qt/lb
  const r = waterToGrainRatio * 0.4796;
  const strikeTemp = (0.41 / r) * (targetMashTemp - grainTempCelsius) + targetMashTemp;
  return Math.round(strikeTemp * 10) / 10;
}

// --- Water Chemistry Calculator ---

export interface WaterIons {
  calcium: number;
  magnesium: number;
  sodium: number;
  chloride: number;
  sulfate: number;
  bicarbonate: number;
}

// Ion contribution per gram per liter (ppm per g/L)
const MINERAL_PPM_PER_G_PER_L: Record<string, Partial<WaterIons>> = {
  gypsum:  { calcium: 61.5, sulfate: 147.4 },          // CaSO₄·2H₂O
  cacl2:   { calcium: 72.0, chloride: 127.5 },          // CaCl₂ (anhydrous)
  epsom:   { magnesium: 26.1, sulfate: 103.0 },         // MgSO₄·7H₂O
  nacl:    { sodium: 104.0, chloride: 160.3 },           // NaCl
  nahco3:  { sodium: 75.3, bicarbonate: 189.6 },        // NaHCO₃
  chalk:   { calcium: 105.8, bicarbonate: 158.4 },      // CaCO₃
};

export const WATER_STYLE_PROFILES: Record<string, WaterIons> = {
  distilled: { calcium: 0,   magnesium: 0,  sodium: 0,   chloride: 0,   sulfate: 0,   bicarbonate: 0   },
  pilsen:    { calcium: 7,   magnesium: 3,  sodium: 2,   chloride: 5,   sulfate: 5,   bicarbonate: 15  },
  munich:    { calcium: 75,  magnesium: 18, sodium: 2,   chloride: 2,   sulfate: 10,  bicarbonate: 295 },
  burton:    { calcium: 352, magnesium: 24, sodium: 44,  chloride: 16,  sulfate: 820, bicarbonate: 320 },
  london:    { calcium: 52,  magnesium: 32, sodium: 86,  chloride: 34,  sulfate: 32,  bicarbonate: 104 },
  dublin:    { calcium: 118, magnesium: 4,  sodium: 12,  chloride: 19,  sulfate: 54,  bicarbonate: 319 },
  oslo:      { calcium: 12,  magnesium: 2,  sodium: 7,   chloride: 13,  sulfate: 12,  bicarbonate: 28  },
};

export interface MineralAdditions {
  gypsum: number;   // g
  cacl2: number;    // g
  epsom: number;    // g
  nacl: number;     // g
  nahco3: number;   // g
  chalk: number;    // g
}

export interface WaterCalcResult {
  additions: MineralAdditions;
  resultingProfile: WaterIons;
}

// Simple difference-based mineral addition calculation (good enough for homebrew).
// Prioritises Ca via gypsum (sulfate path) and CaCl2 (chloride path) before Na salts.
export function calculateMineralAdditions(
  source: WaterIons,
  target: WaterIons,
  volumeLiters: number,
): WaterCalcResult {
  // Work in ppm-difference, then convert to grams for given volume
  const additions: MineralAdditions = { gypsum: 0, cacl2: 0, epsom: 0, nacl: 0, nahco3: 0, chalk: 0 };

  // How many ppm of each ion we still need to add (can be negative = already too much)
  let need = { ...source };
  const caDiff = target.calcium - source.calcium;
  const mgDiff = target.magnesium - source.magnesium;
  const soDiff = target.sulfate - source.sulfate;
  const clDiff = target.chloride - source.chloride;
  const bicarb = target.bicarbonate - source.bicarbonate;

  // Gypsum for Ca + SO4
  if (caDiff > 0 && soDiff > 0) {
    const gByCA = caDiff / 61.5;
    const gBySO = soDiff / 147.4;
    const g = Math.min(gByCA, gBySO);
    additions.gypsum = g;
    need.calcium = target.calcium - source.calcium - g * 61.5;
    need.sulfate = target.sulfate - source.sulfate - g * 147.4;
  }

  // CaCl2 for remaining Ca + Cl
  const caNeed = Math.max(0, target.calcium - source.calcium - additions.gypsum * 61.5);
  const clNeed = Math.max(0, clDiff);
  if (caNeed > 0 || clNeed > 0) {
    const gByCA = caNeed > 0 ? caNeed / 72.0 : Infinity;
    const gByCl = clNeed > 0 ? clNeed / 127.5 : Infinity;
    additions.cacl2 = Math.max(0, Math.min(gByCA, gByCl));
  }

  // Epsom for Mg
  if (mgDiff > 0) additions.epsom = Math.max(0, mgDiff / 26.1);

  // NaHCO3 for alkalinity
  if (bicarb > 0) additions.nahco3 = Math.max(0, bicarb / 189.6);

  // NaCl if Na or Cl still lacking
  const naFromNahco3 = additions.nahco3 * 75.3;
  const naNeed = Math.max(0, target.sodium - source.sodium - naFromNahco3);
  if (naNeed > 0) additions.nacl = Math.max(0, naNeed / 104.0);

  // Scale to volume and round
  const scale = (g: number) => Math.round(g * volumeLiters * 10) / 10;
  const scaledAdditions: MineralAdditions = {
    gypsum: scale(additions.gypsum),
    cacl2: scale(additions.cacl2),
    epsom: scale(additions.epsom),
    nacl: scale(additions.nacl),
    nahco3: scale(additions.nahco3),
    chalk: 0,
  };

  // Calculate resulting profile
  const resulting = { ...source } as Record<string, number>;
  for (const [mineral, grams] of Object.entries(scaledAdditions)) {
    const contrib = MINERAL_PPM_PER_G_PER_L[mineral];
    if (!contrib) continue;
    const gramsPerLiter = grams / volumeLiters;
    for (const [ion, ppmPerGL] of Object.entries(contrib)) {
      resulting[ion] = (resulting[ion] ?? 0) + ppmPerGL * gramsPerLiter;
    }
  }
  const roundIons = (w: Record<string, number>): WaterIons => ({
    calcium: Math.round(w.calcium ?? 0),
    magnesium: Math.round(w.magnesium ?? 0),
    sodium: Math.round(w.sodium ?? 0),
    chloride: Math.round(w.chloride ?? 0),
    sulfate: Math.round(w.sulfate ?? 0),
    bicarbonate: Math.round(w.bicarbonate ?? 0),
  });

  return { additions: scaledAdditions, resultingProfile: roundIons(resulting) };
}

// --- Carbonation Calculator ---
export interface CarbonationResult {
  sugarGrams: number;
  sugarGramsPerLiter: number;
  psi: number;
}

export function calculateCarbonation(
  targetCo2Volumes: number,
  volumeLiters: number,
  beerTempCelsius: number,
): CarbonationResult {
  // Residual CO2 formula uses temperature in Fahrenheit
  const tempF = beerTempCelsius * 1.8 + 32;
  const residualCo2 =
    3.0378 -
    0.050062 * tempF +
    0.00026555 * tempF * tempF;

  const co2Needed = Math.max(0, targetCo2Volumes - residualCo2);
  const sugarGramsPerLiter = Math.round(co2Needed * 4 * 10) / 10;
  const sugarGrams = Math.round(sugarGramsPerLiter * volumeLiters);

  const psiRaw = -16.6999 + 0.0101059 * tempF * tempF + 0.00116512 * Math.pow(tempF, 3);
  const psi = Math.round(Math.max(0, psiRaw * (targetCo2Volumes / 3.0)) * 10) / 10;

  return { sugarGrams, sugarGramsPerLiter, psi };
}
