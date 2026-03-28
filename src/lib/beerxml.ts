import type { Recipe, Grain } from "./types";

function grainAmountKg(grain: Grain): number {
  return grain.unit === "g" ? grain.amount / 1000 : grain.amount;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function generateBeerXml(recipe: Recipe): string {
  const fermentables = (recipe.grains ?? [])
    .map(
      (g) => `      <FERMENTABLE>
        <NAME>${escapeXml(g.name)}</NAME>
        <AMOUNT>${grainAmountKg(g)}</AMOUNT>
        <TYPE>Grain</TYPE>
        <YIELD>75</YIELD>
        <COLOR>3</COLOR>
      </FERMENTABLE>`,
    )
    .join("\n");

  const hops = (recipe.hops ?? [])
    .map(
      (h) => `      <HOP>
        <NAME>${escapeXml(h.name)}</NAME>
        <AMOUNT>${h.amount / 1000}</AMOUNT>
        <TIME>${h.time}</TIME>
        <ALPHA>${h.alphaAcid}</ALPHA>
        <USE>${h.time > 0 ? "Boil" : h.time === 0 ? "Aroma" : "Dry Hop"}</USE>
      </HOP>`,
    )
    .join("\n");

  const yeastSection = recipe.yeast
    ? `    <YEASTS>
      <YEAST>
        <NAME>${escapeXml(recipe.yeast.name)}</NAME>
        <TYPE>${recipe.yeast.type || "Ale"}</TYPE>
        <FORM>${recipe.yeast.type?.includes("Tørr") ? "Dry" : "Liquid"}</FORM>
        <AMOUNT>${recipe.yeast.amount || "1"}</AMOUNT>
      </YEAST>
    </YEASTS>`
    : "";

  return `<?xml version="1.0" encoding="UTF-8"?>
<RECIPES>
  <RECIPE>
    <NAME>${escapeXml(recipe.name)}</NAME>
    <VERSION>1</VERSION>
    <TYPE>All Grain</TYPE>
    <BREWER>Uranus Garage</BREWER>
    <BATCH_SIZE>${recipe.batchSize}</BATCH_SIZE>
    <BOIL_SIZE>${Math.round(recipe.batchSize * 1.2)}</BOIL_SIZE>
    <BOIL_TIME>60</BOIL_TIME>
    <STYLE>
      <NAME>${escapeXml(recipe.style || "")}</NAME>
    </STYLE>
    <FERMENTABLES>
${fermentables}
    </FERMENTABLES>
    <HOPS>
${hops}
    </HOPS>
${yeastSection}
  </RECIPE>
</RECIPES>`;
}
