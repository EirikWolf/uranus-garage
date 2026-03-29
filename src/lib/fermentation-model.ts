import type {
  SimulationParams,
  SimulationPoint,
  SimulationResult,
  FermentationPhase,
} from "./types";
import { calculateAbv } from "./calculators";
import { evaluateFlavorRisks } from "./flavor-rules";

const SIMULATION_HOURS = 336; // 14 days
const STEP_HOURS = 1;

/** Arrhenius-inspired rate constant. Peaks at optimal temp, drops off at extremes. */
export function calculateRateConstant(
  tempC: number,
  optimalTemp: number,
  type: "ale" | "lager" | "wild",
): number {
  const baseRate = type === "lager" ? 0.015 : type === "wild" ? 0.008 : 0.025;
  const deviation = Math.abs(tempC - optimalTemp);
  // Gaussian-like falloff: rate drops 50% at ±5°C from optimal
  const tempFactor = Math.exp(-0.5 * (deviation / 5) ** 2);
  return baseRate * tempFactor;
}

/** Exponential gravity decay: G(t) = FG + (OG - FG) * e^(-k*t) with lag phase */
export function calculateGravityAtTime(
  og: number,
  fg: number,
  rateConstant: number,
  hours: number,
  lagHours: number,
): number {
  if (hours <= lagHours) return og;
  const activeHours = hours - lagHours;
  return fg + (og - fg) * Math.exp(-rateConstant * activeHours);
}

/** Estimate lag phase duration based on pitch rate and yeast health */
export function estimateLagHours(
  pitchRateBillionCells: number,
  batchSizeLiters: number,
): number {
  const cellsPerMl = (pitchRateBillionCells * 1e9) / (batchSizeLiters * 1000);
  // Higher pitch rate = shorter lag. Typical: 6-24 hours
  const base = 18;
  const factor = Math.min(2, Math.max(0.3, 1e6 / cellsPerMl));
  return Math.round(base * factor);
}

/** Classify fermentation phase by gravity change rate */
export function classifyPhase(
  hours: number,
  lagHours: number,
  gravityDeltaPerHour: number,
): FermentationPhase {
  if (hours <= lagHours) return "lag";
  if (Math.abs(gravityDeltaPerHour) > 0.0005) return "aktiv";
  if (Math.abs(gravityDeltaPerHour) > 0.0001) return "nedbremsing";
  return "ettermodning";
}

/** Estimate CO2 production (relative) from gravity drop */
function estimateCo2(og: number, currentGravity: number): number {
  const drop = og - currentGravity;
  // ~0.5 volumes CO2 per 0.010 gravity points dropped
  return Math.max(0, drop * 50);
}

/** Run the full fermentation simulation */
export function simulateFermentation(
  params: SimulationParams,
): SimulationResult {
  const { og, fermentationTempC, yeast, batchSizeLiters, pitchRateBillionCells } = params;
  const fg = og - (og - 1) * yeast.attenuation;
  const rate = calculateRateConstant(fermentationTempC, yeast.tempOptimal, yeast.type);
  const lagHours = estimateLagHours(pitchRateBillionCells, batchSizeLiters);

  const curve: SimulationPoint[] = [];
  let prevGravity = og;

  for (let h = 0; h <= SIMULATION_HOURS; h += STEP_HOURS) {
    const gravity = calculateGravityAtTime(og, fg, rate, h, lagHours);
    const deltaPerHour = h > 0 ? (gravity - prevGravity) / STEP_HOURS : 0;
    const phase = classifyPhase(h, lagHours, deltaPerHour);

    curve.push({
      hoursSinceStart: h,
      gravity: Math.round(gravity * 10000) / 10000,
      temperature: fermentationTempC,
      co2VolumeProduced: Math.round(estimateCo2(og, gravity) * 100) / 100,
      phase,
    });

    prevGravity = gravity;
  }

  const predictedFg = Math.round(fg * 10000) / 10000;
  const predictedAbv = calculateAbv(og, predictedFg);
  const flavorFlags = evaluateFlavorRisks(params, curve);

  // Duration = when gravity change drops below 0.0001/hr
  const donePoint = curve.find(
    (p, i) => i > lagHours && p.phase === "ettermodning",
  );
  const durationHours = donePoint?.hoursSinceStart ?? SIMULATION_HOURS;

  return { params, curve, predictedFg, predictedAbv, durationHours, flavorFlags };
}
