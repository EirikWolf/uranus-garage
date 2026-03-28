import { describe, it, expect } from "vitest";
import { scaleGrains, scaleHops, scaleAdditions } from "@/lib/scaling";
import type { Grain, Hop, Addition } from "@/lib/types";

describe("scaleGrains", () => {
  const grains: Grain[] = [
    { name: "Maris Otter", amount: 5, unit: "kg" },
    { name: "Carapils", amount: 200, unit: "g" },
  ];

  it("scales grains proportionally to new batch size", () => {
    const scaled = scaleGrains(grains, 20, 40);
    expect(scaled[0].amount).toBe(10);
    expect(scaled[0].unit).toBe("kg");
    expect(scaled[1].amount).toBe(400);
    expect(scaled[1].unit).toBe("g");
  });

  it("scales down correctly", () => {
    const scaled = scaleGrains(grains, 20, 10);
    expect(scaled[0].amount).toBe(2.5);
    expect(scaled[1].amount).toBe(100);
  });

  it("returns same amounts when batch size unchanged", () => {
    const scaled = scaleGrains(grains, 20, 20);
    expect(scaled[0].amount).toBe(5);
    expect(scaled[1].amount).toBe(200);
  });

  it("rounds to 2 decimal places", () => {
    const scaled = scaleGrains(grains, 20, 15);
    expect(scaled[0].amount).toBe(3.75);
    expect(scaled[1].amount).toBe(150);
  });
});

describe("scaleHops", () => {
  const hops: Hop[] = [
    { name: "Citra", amount: 30, time: 60, alphaAcid: 12 },
    { name: "Mosaic", amount: 50, time: 0, alphaAcid: 11.5 },
  ];

  it("scales hop amounts but preserves time and alpha acid", () => {
    const scaled = scaleHops(hops, 20, 40);
    expect(scaled[0].amount).toBe(60);
    expect(scaled[0].time).toBe(60);
    expect(scaled[0].alphaAcid).toBe(12);
    expect(scaled[1].amount).toBe(100);
    expect(scaled[1].time).toBe(0);
  });
});

describe("scaleAdditions", () => {
  const additions: Addition[] = [
    { name: "Irish Moss", amount: "5g", time: 15 },
  ];

  it("returns additions unchanged (string amounts not scalable)", () => {
    const scaled = scaleAdditions(additions, 20, 40);
    expect(scaled[0].amount).toBe("5g");
    expect(scaled[0].time).toBe(15);
  });
});
