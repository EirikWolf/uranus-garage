import { describe, it, expect } from "vitest";
import {
  calculateRateConstant,
  calculateGravityAtTime,
  estimateLagHours,
  classifyPhase,
  simulateFermentation,
} from "@/lib/fermentation-model";
import type { SimulationParams, YeastProfile } from "@/lib/types";

const testYeast: YeastProfile = {
  name: "Test Ale",
  attenuation: 0.80,
  tempRangeLow: 15,
  tempRangeHigh: 24,
  tempOptimal: 18,
  flocculationRate: 0.6,
  type: "ale",
};

describe("calculateRateConstant", () => {
  it("returns highest rate at optimal temperature", () => {
    const atOptimal = calculateRateConstant(18, 18, "ale");
    const away = calculateRateConstant(25, 18, "ale");
    expect(atOptimal).toBeGreaterThan(away);
  });

  it("returns lower base rate for lager yeast", () => {
    const ale = calculateRateConstant(18, 18, "ale");
    const lager = calculateRateConstant(12, 12, "lager");
    expect(ale).toBeGreaterThan(lager);
  });

  it("returns positive rate even at extreme temps", () => {
    const rate = calculateRateConstant(5, 18, "ale");
    expect(rate).toBeGreaterThan(0);
  });
});

describe("calculateGravityAtTime", () => {
  it("returns OG during lag phase", () => {
    const g = calculateGravityAtTime(1.055, 1.011, 0.025, 5, 12);
    expect(g).toBe(1.055);
  });

  it("approaches FG over time", () => {
    const g = calculateGravityAtTime(1.055, 1.011, 0.025, 300, 12);
    expect(g).toBeCloseTo(1.011, 2);
  });

  it("decreases monotonically after lag", () => {
    const g1 = calculateGravityAtTime(1.055, 1.011, 0.025, 24, 12);
    const g2 = calculateGravityAtTime(1.055, 1.011, 0.025, 48, 12);
    const g3 = calculateGravityAtTime(1.055, 1.011, 0.025, 96, 12);
    expect(g1).toBeGreaterThan(g2);
    expect(g2).toBeGreaterThan(g3);
  });
});

describe("estimateLagHours", () => {
  it("returns shorter lag with higher pitch rate", () => {
    const highPitch = estimateLagHours(200, 20);
    const lowPitch = estimateLagHours(50, 20);
    expect(highPitch).toBeLessThan(lowPitch);
  });

  it("returns reasonable range (6-36 hours)", () => {
    const lag = estimateLagHours(150, 20);
    expect(lag).toBeGreaterThanOrEqual(5);
    expect(lag).toBeLessThanOrEqual(40);
  });
});

describe("classifyPhase", () => {
  it("returns lag during lag period", () => {
    expect(classifyPhase(5, 12, 0)).toBe("lag");
  });

  it("returns aktiv during rapid gravity change", () => {
    expect(classifyPhase(24, 12, -0.001)).toBe("aktiv");
  });

  it("returns nedbremsing during slow change", () => {
    expect(classifyPhase(72, 12, -0.0003)).toBe("nedbremsing");
  });

  it("returns ettermodning when gravity stable", () => {
    expect(classifyPhase(200, 12, -0.00001)).toBe("ettermodning");
  });
});

describe("simulateFermentation", () => {
  const params: SimulationParams = {
    og: 1.055,
    fermentationTempC: 18,
    yeast: testYeast,
    batchSizeLiters: 20,
    pitchRateBillionCells: 150,
  };

  it("returns a valid SimulationResult", () => {
    const result = simulateFermentation(params);
    expect(result.params).toBe(params);
    expect(result.curve.length).toBeGreaterThan(0);
    expect(result.predictedFg).toBeLessThan(params.og);
    expect(result.predictedAbv).toBeGreaterThan(0);
  });

  it("curve starts at OG and ends near FG", () => {
    const result = simulateFermentation(params);
    expect(result.curve[0].gravity).toBe(params.og);
    const last = result.curve[result.curve.length - 1];
    expect(last.gravity).toBeCloseTo(result.predictedFg, 2);
  });

  it("gravity never exceeds OG or goes below predicted FG", () => {
    const result = simulateFermentation(params);
    for (const point of result.curve) {
      expect(point.gravity).toBeLessThanOrEqual(params.og + 0.0001);
      expect(point.gravity).toBeGreaterThanOrEqual(result.predictedFg - 0.0001);
    }
  });

  it("CO2 production increases over time", () => {
    const result = simulateFermentation(params);
    const first = result.curve[0].co2VolumeProduced;
    const last = result.curve[result.curve.length - 1].co2VolumeProduced;
    expect(last).toBeGreaterThan(first);
  });

  it("predicts reasonable ABV for a typical IPA", () => {
    const result = simulateFermentation(params);
    expect(result.predictedAbv).toBeGreaterThan(4);
    expect(result.predictedAbv).toBeLessThan(7);
  });
});
