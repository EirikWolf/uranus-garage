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
