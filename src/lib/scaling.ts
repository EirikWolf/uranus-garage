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
  _originalBatchSize: number,
  _newBatchSize: number,
): Addition[] {
  return additions.map((a) => ({ ...a }));
}
