import { describe, it, expect } from "vitest";
import { generateBeerXml } from "@/lib/beerxml";
import type { Recipe } from "@/lib/types";

const mockRecipe: Recipe = {
  _id: "test-1",
  name: "Test IPA",
  slug: { current: "test-ipa" },
  style: "IPA",
  description: "A test IPA recipe",
  difficulty: "middels",
  batchSize: 20,
  grains: [
    { name: "Pale Ale Malt", amount: 5, unit: "kg" },
    { name: "Carapils", amount: 300, unit: "g" },
  ],
  hops: [
    { name: "Citra", amount: 30, time: 60, alphaAcid: 12 },
    { name: "Mosaic", amount: 50, time: 0, alphaAcid: 11.5 },
  ],
  yeast: { name: "US-05", amount: "1 pakke", type: "Tørrgjær" },
  additions: [],
  process: [
    { step: "Mashing", description: "Mash at 66C", temp: 66, duration: 60 },
  ],
};

describe("generateBeerXml", () => {
  it("generates valid XML with recipe name", () => {
    const xml = generateBeerXml(mockRecipe);
    expect(xml).toContain("<?xml");
    expect(xml).toContain("<RECIPES>");
    expect(xml).toContain("<NAME>Test IPA</NAME>");
  });

  it("includes all grains as fermentables", () => {
    const xml = generateBeerXml(mockRecipe);
    expect(xml).toContain("<NAME>Pale Ale Malt</NAME>");
    expect(xml).toContain("<AMOUNT>5</AMOUNT>");
    expect(xml).toContain("<NAME>Carapils</NAME>");
    expect(xml).toContain("<AMOUNT>0.3</AMOUNT>");
  });

  it("includes all hops", () => {
    const xml = generateBeerXml(mockRecipe);
    expect(xml).toContain("<NAME>Citra</NAME>");
    expect(xml).toContain("<ALPHA>12</ALPHA>");
    expect(xml).toContain("<NAME>Mosaic</NAME>");
  });

  it("includes yeast", () => {
    const xml = generateBeerXml(mockRecipe);
    expect(xml).toContain("<NAME>US-05</NAME>");
  });

  it("includes batch size in liters", () => {
    const xml = generateBeerXml(mockRecipe);
    expect(xml).toContain("<BATCH_SIZE>20</BATCH_SIZE>");
  });
});
