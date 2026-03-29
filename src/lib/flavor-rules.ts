import type { SimulationParams, SimulationPoint, FlavorFlag } from "./types";

/** Check diacetyl risk: temp too low during active fermentation */
function checkDiacetyl(params: SimulationParams): FlavorFlag | null {
  const { fermentationTempC, yeast } = params;
  if (fermentationTempC < yeast.tempRangeLow) {
    return {
      compound: "diacetyl",
      risk: "hoy",
      reason: `Gjæringstemperatur (${fermentationTempC}°C) er under gjærens minimumsrange (${yeast.tempRangeLow}°C). Gjæren vil slite med å reabsorbere diacetyl.`,
      recommendation: "Hev temperaturen til minst gjærens anbefalt område, eller gjør en diacetylrast på 18-20°C i 2-3 dager mot slutten.",
    };
  }
  if (fermentationTempC < yeast.tempOptimal - 3) {
    return {
      compound: "diacetyl",
      risk: "middels",
      reason: `Gjæringstemperatur (${fermentationTempC}°C) er godt under optimal (${yeast.tempOptimal}°C). Diacetyl kan forbli i ølet.`,
      recommendation: "Vurder en diacetylrast: hev til 18-20°C de siste 2-3 dagene av gjæringen.",
    };
  }
  return null;
}

/** Check fusel alcohol risk: temp too high */
function checkFuselAlcohols(params: SimulationParams): FlavorFlag | null {
  const { fermentationTempC, yeast } = params;
  const overRange = fermentationTempC - yeast.tempRangeHigh;
  if (overRange > 3) {
    return {
      compound: "fusel-alkoholer",
      risk: "hoy",
      reason: `Gjæringstemperatur (${fermentationTempC}°C) er ${overRange}°C over gjærens maks (${yeast.tempRangeHigh}°C). Høy risiko for løsemiddel- og fuselsmak.`,
      recommendation: "Senk gjæringstemperaturen umiddelbart. Bruk gjæringskjøler eller flytt til kaldere rom.",
    };
  }
  if (overRange > 0) {
    return {
      compound: "fusel-alkoholer",
      risk: "middels",
      reason: `Gjæringstemperatur (${fermentationTempC}°C) er over gjærens maks (${yeast.tempRangeHigh}°C). Mulig fuselsmak.`,
      recommendation: "Prøv å senke temperaturen 2-3°C for renere gjæringsprofil.",
    };
  }
  return null;
}

/** Check acetaldehyde risk: poor attenuation */
function checkAcetaldehyde(
  params: SimulationParams,
  curve: SimulationPoint[],
): FlavorFlag | null {
  const lastPoint = curve[curve.length - 1];
  if (!lastPoint) return null;
  const apparentAttenuation = (params.og - lastPoint.gravity) / (params.og - 1);
  if (apparentAttenuation < 0.55) {
    return {
      compound: "acetaldehyd",
      risk: "hoy",
      reason: `Lav predikert attenuation (${Math.round(apparentAttenuation * 100)}%). Grønt eple-smak er sannsynlig.`,
      recommendation: "Sjekk pitch rate og gjærhelse. Vurder å øke temperatur eller pitch rate.",
    };
  }
  if (apparentAttenuation < 0.65) {
    return {
      compound: "acetaldehyd",
      risk: "middels",
      reason: `Moderat attenuation (${Math.round(apparentAttenuation * 100)}%). Noe acetaldehyd kan være til stede.`,
      recommendation: "La gjæringen gå lenger (14+ dager) for å gi gjæren tid til å rydde opp.",
    };
  }
  return null;
}

/** Check phenolic off-flavor risk for certain yeast types at high temps */
function checkPhenolics(params: SimulationParams): FlavorFlag | null {
  const { fermentationTempC, yeast } = params;
  // POF+ yeast (Belgian, wheat, wild) at high temps
  const isPofPositive = yeast.type === "wild" ||
    yeast.name.toLowerCase().includes("belgi") ||
    yeast.name.toLowerCase().includes("hvete") ||
    yeast.name.toLowerCase().includes("hefe");

  if (isPofPositive && fermentationTempC > yeast.tempOptimal + 5) {
    return {
      compound: "fenoler",
      risk: "middels",
      reason: `Denne gjæren produserer fenoler. Høy temperatur (${fermentationTempC}°C) forsterker medisinsk/krydret smak.`,
      recommendation: "Senk temperaturen til nærmere optimal for renere profil, eller behold om du ønsker belgisk karakter.",
    };
  }
  return null;
}

/** Check underpitching risk */
function checkUnderpitching(params: SimulationParams): FlavorFlag | null {
  const { pitchRateBillionCells, batchSizeLiters, og } = params;
  const plato = ((og - 1) * 1000) / 4;
  const recommendedRate = params.yeast.type === "lager" ? 1.5 : 0.75;
  // million cells/mL * mL/L * liters / 1000 = billion cells
  const recommended = recommendedRate * plato * batchSizeLiters;

  if (pitchRateBillionCells < recommended * 0.5) {
    return {
      compound: "stresset gjær",
      risk: "hoy",
      reason: `Pitch rate (${pitchRateBillionCells}B celler) er under halvparten av anbefalt (${Math.round(recommended)}B). Stresset gjær gir off-flavors.`,
      recommendation: `Øk pitch rate til minst ${Math.round(recommended)}B celler, eller lag en starter.`,
    };
  }
  return null;
}

/** Evaluate all flavor risks for a simulation */
export function evaluateFlavorRisks(
  params: SimulationParams,
  curve: SimulationPoint[],
): FlavorFlag[] {
  const checks = [
    checkDiacetyl(params),
    checkFuselAlcohols(params),
    checkAcetaldehyde(params, curve),
    checkPhenolics(params),
    checkUnderpitching(params),
  ];
  return checks.filter((f): f is FlavorFlag => f !== null);
}
