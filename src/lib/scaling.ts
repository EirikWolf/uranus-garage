import type { Grain, Hop, Addition } from "./types";

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function scaleGrains(
  grains: Grain[],
  originalBatchSize: number,
  newBatchSize: number,
): Grain[] {
  const factor = newBatchSize / originalBatchSize;
  return grains.map((g) => ({
    ...g,
    amount: round2(g.amount * factor),
  }));
}

export function scaleHops(
  hops: Hop[],
  originalBatchSize: number,
  newBatchSize: number,
): Hop[] {
  const factor = newBatchSize / originalBatchSize;
  return hops.map((h) => ({
    ...h,
    amount: round2(h.amount * factor),
  }));
}

export function scaleAdditions(
  additions: Addition[],
  originalBatchSize: number,
  newBatchSize: number,
): Addition[] {
  const factor = newBatchSize / originalBatchSize;
  return additions.map((a) => {
    // Try to scale numeric amounts in the string (e.g. "10 g" -> "20 g")
    const scaled = a.amount.replace(/(\d+(?:\.\d+)?)/g, (match) => {
      return String(round2(parseFloat(match) * factor));
    });
    return { ...a, amount: scaled };
  });
}
