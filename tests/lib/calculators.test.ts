import { describe, it, expect } from "vitest";
import {
  calculateAbv,
  calculateIbu,
  calculateSrm,
  calculatePitchRate,
  calculateCarbonation,
} from "@/lib/calculators";

describe("calculateAbv", () => {
  it("calculates ABV from OG and FG", () => {
    expect(calculateAbv(1.050, 1.010)).toBeCloseTo(5.25, 1);
  });

  it("returns 0 when OG equals FG", () => {
    expect(calculateAbv(1.050, 1.050)).toBe(0);
  });

  it("handles high-gravity beers", () => {
    expect(calculateAbv(1.090, 1.015)).toBeCloseTo(9.84, 1);
  });
});

describe("calculateIbu", () => {
  it("calculates IBU for a single hop addition using Tinseth formula", () => {
    const ibu = calculateIbu(
      [{ amountGrams: 30, alphaAcid: 10, boilMinutes: 60 }],
      20,
      1.050,
    );
    expect(ibu).toBeGreaterThan(30);
    expect(ibu).toBeLessThan(50);
  });

  it("returns 0 for no hops", () => {
    expect(calculateIbu([], 20, 1.050)).toBe(0);
  });

  it("sums IBU from multiple additions", () => {
    const single = calculateIbu(
      [{ amountGrams: 30, alphaAcid: 10, boilMinutes: 60 }],
      20,
      1.050,
    );
    const double = calculateIbu(
      [
        { amountGrams: 30, alphaAcid: 10, boilMinutes: 60 },
        { amountGrams: 20, alphaAcid: 5, boilMinutes: 15 },
      ],
      20,
      1.050,
    );
    expect(double).toBeGreaterThan(single);
  });

  it("0-minute additions contribute minimal IBU", () => {
    const ibu = calculateIbu(
      [{ amountGrams: 50, alphaAcid: 12, boilMinutes: 0 }],
      20,
      1.050,
    );
    expect(ibu).toBeLessThan(5);
  });
});

describe("calculateSrm", () => {
  it("calculates SRM from grain bill using Morey equation", () => {
    const srm = calculateSrm(
      [{ weightKg: 5, lovibond: 3 }],
      20,
    );
    expect(srm).toBeGreaterThan(3);
    expect(srm).toBeLessThan(8);
  });

  it("returns 0 for no grains", () => {
    expect(calculateSrm([], 20)).toBe(0);
  });

  it("dark malts increase SRM significantly", () => {
    const light = calculateSrm([{ weightKg: 5, lovibond: 3 }], 20);
    const dark = calculateSrm(
      [
        { weightKg: 5, lovibond: 3 },
        { weightKg: 0.5, lovibond: 500 },
      ],
      20,
    );
    expect(dark).toBeGreaterThan(light * 2);
  });
});

describe("calculatePitchRate", () => {
  it("calculates yeast cells needed for ale", () => {
    const result = calculatePitchRate(1.050, 20, "ale");
    expect(result.billionCells).toBeGreaterThan(150);
    expect(result.billionCells).toBeLessThan(250);
    expect(result.dryYeastGrams).toBeGreaterThan(0);
    expect(result.starterLiters).toBeGreaterThan(0);
  });

  it("lager needs more yeast than ale", () => {
    const ale = calculatePitchRate(1.050, 20, "ale");
    const lager = calculatePitchRate(1.050, 20, "lager");
    expect(lager.billionCells).toBeGreaterThan(ale.billionCells);
  });

  it("higher gravity needs more yeast", () => {
    const low = calculatePitchRate(1.040, 20, "ale");
    const high = calculatePitchRate(1.080, 20, "ale");
    expect(high.billionCells).toBeGreaterThan(low.billionCells);
  });
});

describe("calculateCarbonation", () => {
  it("calculates priming sugar for target CO2 volumes", () => {
    const result = calculateCarbonation(2.4, 20, 20);
    expect(result.sugarGrams).toBeGreaterThan(100);
    expect(result.sugarGrams).toBeLessThan(200);
    expect(result.sugarGramsPerLiter).toBeGreaterThan(4);
    expect(result.psi).toBeGreaterThan(8);
  });

  it("cold beer needs less sugar (more residual CO2)", () => {
    const warm = calculateCarbonation(2.4, 20, 20);
    const cold = calculateCarbonation(2.4, 20, 4);
    expect(cold.sugarGrams).toBeLessThan(warm.sugarGrams);
  });

  it("higher CO2 target needs more sugar", () => {
    const low = calculateCarbonation(2.0, 20, 20);
    const high = calculateCarbonation(3.0, 20, 20);
    expect(high.sugarGrams).toBeGreaterThan(low.sugarGrams);
  });
});
