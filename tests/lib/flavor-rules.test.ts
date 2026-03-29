import { describe, it, expect } from "vitest";
import { evaluateFlavorRisks } from "@/lib/flavor-rules";
import type { SimulationParams, SimulationPoint, YeastProfile } from "@/lib/types";

const baseYeast: YeastProfile = {
  name: "Test Ale",
  attenuation: 0.80,
  tempRangeLow: 15,
  tempRangeHigh: 24,
  tempOptimal: 18,
  flocculationRate: 0.6,
  type: "ale",
};

function makeParams(overrides: Partial<SimulationParams> = {}): SimulationParams {
  return {
    og: 1.055,
    fermentationTempC: 18,
    yeast: baseYeast,
    batchSizeLiters: 20,
    pitchRateBillionCells: 150,
    ...overrides,
  };
}

function makeCurve(finalGravity: number): SimulationPoint[] {
  return [
    { hoursSinceStart: 0, gravity: 1.055, temperature: 18, co2VolumeProduced: 0, phase: "lag" },
    { hoursSinceStart: 336, gravity: finalGravity, temperature: 18, co2VolumeProduced: 2, phase: "ettermodning" },
  ];
}

describe("evaluateFlavorRisks", () => {
  it("returns no flags for ideal conditions", () => {
    const params = makeParams();
    const curve = makeCurve(1.011);
    const flags = evaluateFlavorRisks(params, curve);
    expect(flags).toHaveLength(0);
  });

  it("flags diacetyl risk when temp below yeast minimum", () => {
    const params = makeParams({ fermentationTempC: 12 });
    const curve = makeCurve(1.011);
    const flags = evaluateFlavorRisks(params, curve);
    const diacetyl = flags.find((f) => f.compound === "diacetyl");
    expect(diacetyl).toBeDefined();
    expect(diacetyl?.risk).toBe("hoy");
  });

  it("flags fusel alcohols when temp exceeds yeast max by >3°C", () => {
    const params = makeParams({ fermentationTempC: 30 });
    const curve = makeCurve(1.011);
    const flags = evaluateFlavorRisks(params, curve);
    const fusel = flags.find((f) => f.compound === "fusel-alkoholer");
    expect(fusel).toBeDefined();
    expect(fusel?.risk).toBe("hoy");
  });

  it("flags acetaldehyde when attenuation is very low", () => {
    const params = makeParams();
    const curve = makeCurve(1.045); // barely fermented
    const flags = evaluateFlavorRisks(params, curve);
    const acet = flags.find((f) => f.compound === "acetaldehyd");
    expect(acet).toBeDefined();
    expect(acet?.risk).toBe("hoy");
  });

  it("flags underpitching when pitch rate is very low", () => {
    const params = makeParams({ pitchRateBillionCells: 10 });
    const curve = makeCurve(1.011);
    const flags = evaluateFlavorRisks(params, curve);
    const stress = flags.find((f) => f.compound === "stresset gjær");
    expect(stress).toBeDefined();
  });

  it("flags phenolics for Belgian yeast at high temp", () => {
    const belgianYeast: YeastProfile = {
      ...baseYeast,
      name: "Belgisk Abbey",
      tempOptimal: 22,
      tempRangeHigh: 28,
    };
    const params = makeParams({ yeast: belgianYeast, fermentationTempC: 30 });
    const curve = makeCurve(1.011);
    const flags = evaluateFlavorRisks(params, curve);
    const phenol = flags.find((f) => f.compound === "fenoler");
    expect(phenol).toBeDefined();
  });

  it("does not flag phenolics for clean ale yeast", () => {
    const params = makeParams({ fermentationTempC: 25 });
    const curve = makeCurve(1.011);
    const flags = evaluateFlavorRisks(params, curve);
    const phenol = flags.find((f) => f.compound === "fenoler");
    expect(phenol).toBeUndefined();
  });
});
