import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const BASE_URL =
  "https://www.problembar.net/uranus/BeerAPI/Render/index.php?name=";

// Extract all <table> blocks from the HTML — each is one ingredient
function parseTables(html: string): Map<string, string>[] {
  const results: Map<string, string>[] = [];
  // Match each <table ...>...</table> block
  const tableRegex = /<table[^>]*>([\s\S]*?)<\/table>/gi;
  let tableMatch: RegExpExecArray | null;

  while ((tableMatch = tableRegex.exec(html)) !== null) {
    const tableHtml = tableMatch[1];
    const fields = new Map<string, string>();

    // Extract caption (ingredient name)
    const captionMatch = /<caption>([\s\S]*?)<\/caption>/i.exec(tableHtml);
    if (!captionMatch) continue;
    fields.set("_caption", captionMatch[1].trim());

    // Extract property/value rows
    const rowRegex =
      /<tr[^>]*>\s*<td>([^<]+)<\/td>\s*<td>([\s\S]*?)<\/td>\s*<\/tr>/gi;
    let rowMatch: RegExpExecArray | null;
    while ((rowMatch = rowRegex.exec(tableHtml)) !== null) {
      const key = rowMatch[1].trim();
      // Decode basic HTML entities
      const value = rowMatch[2]
        .trim()
        .replace(/&amp;/g, "&")
        .replace(/&deg;/g, "°")
        .replace(/&#176;/g, "°")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/â€œ/g, '"')
        .replace(/â€/g, '"')
        .replace(/Â/g, "")
        .trim();
      fields.set(key, value);
    }

    if (fields.size > 1) results.push(fields);
  }

  return results;
}

function parseFloat_(val: string | undefined): number | null {
  if (!val) return null;
  const n = parseFloat(val.replace(/[^0-9.]/g, ""));
  return isNaN(n) ? null : n;
}

function parseInt_(val: string | undefined): number | null {
  if (!val) return null;
  const n = parseInt(val.replace(/[^0-9]/g, ""), 10);
  return isNaN(n) ? null : n;
}

async function importFermentables(): Promise<number> {
  const html = await fetch(`${BASE_URL}Fermentables`).then((r) => r.text());
  const tables = parseTables(html);
  let count = 0;

  for (const fields of tables) {
    const name = fields.get("Name") || fields.get("_caption");
    if (!name) continue;

    await prisma.fermentable.upsert({
      where: { name },
      update: {
        category: fields.get("Category")?.trim() || null,
        type: fields.get("Type")?.trim() || null,
        colorLovibond: parseFloat_(fields.get("Color")),
        ppg: parseFloat_(fields.get("PPG")),
        country: fields.get("Country")?.trim() || null,
        manufacturer: fields.get("Manufacturer")?.trim() || null,
        recipesCount: parseInt_(fields.get("Recipes")),
      },
      create: {
        name,
        category: fields.get("Category")?.trim() || null,
        type: fields.get("Type")?.trim() || null,
        colorLovibond: parseFloat_(fields.get("Color")),
        ppg: parseFloat_(fields.get("PPG")),
        country: fields.get("Country")?.trim() || null,
        manufacturer: fields.get("Manufacturer")?.trim() || null,
        recipesCount: parseInt_(fields.get("Recipes")),
      },
    });
    count++;
  }

  return count;
}

async function importHops(): Promise<number> {
  const html = await fetch(`${BASE_URL}Hops`).then((r) => r.text());
  const tables = parseTables(html);
  let count = 0;

  for (const fields of tables) {
    const name = fields.get("Name") || fields.get("_caption");
    if (!name) continue;

    await prisma.hop.upsert({
      where: { name },
      update: {
        category: fields.get("Category")?.trim() || null,
        purpose: fields.get("Purpose")?.trim() || null,
        country: fields.get("Country")?.trim() || null,
        alphaAcid: fields.get("AlphaAcidComposition")?.trim() || null,
        betaAcid: fields.get("BetaAcidComposition")?.trim() || null,
        characteristics: fields.get("Characteristics")?.trim() || null,
        substitutes: fields.get("Substitutes")?.trim() || null,
        styleGuide: fields.get("StyleGuide")?.trim() || null,
        description: fields.get("Description")?.trim() || null,
        totalOil: fields.get("TotalOilComposition")?.trim() || null,
        myrcene: fields.get("MyrceneOilComposition")?.trim() || null,
        humulene: fields.get("HumuleneOilComposition")?.trim() || null,
      },
      create: {
        name,
        category: fields.get("Category")?.trim() || null,
        purpose: fields.get("Purpose")?.trim() || null,
        country: fields.get("Country")?.trim() || null,
        alphaAcid: fields.get("AlphaAcidComposition")?.trim() || null,
        betaAcid: fields.get("BetaAcidComposition")?.trim() || null,
        characteristics: fields.get("Characteristics")?.trim() || null,
        substitutes: fields.get("Substitutes")?.trim() || null,
        styleGuide: fields.get("StyleGuide")?.trim() || null,
        description: fields.get("Description")?.trim() || null,
        totalOil: fields.get("TotalOilComposition")?.trim() || null,
        myrcene: fields.get("MyrceneOilComposition")?.trim() || null,
        humulene: fields.get("HumuleneOilComposition")?.trim() || null,
      },
    });
    count++;
  }

  return count;
}

async function importYeasts(): Promise<number> {
  const html = await fetch(`${BASE_URL}Yeasts`).then((r) => r.text());
  const tables = parseTables(html);
  let count = 0;

  for (const fields of tables) {
    const name = fields.get("Name") || fields.get("_caption");
    const displayName = fields.get("DisplayName")?.trim() || null;
    if (!name) continue;

    // Use displayName as unique key if available, otherwise name
    const uniqueKey = displayName ?? name;

    await prisma.yeast.upsert({
      where: { displayName: uniqueKey },
      update: {
        name: name.trim(),
        manufacturer: fields.get("Manufacturer")?.trim() || null,
        code: fields.get("Code")?.trim() || null,
        category: fields.get("Category")?.trim() || null,
        type: fields.get("Type")?.trim() || null,
        flocculation: fields.get("Flocculation")?.trim() || null,
        attenuation: fields.get("Attenuation")?.trim() || null,
        temperature: fields.get("Temperature")?.trim() || null,
        description: fields.get("Description")?.trim() || null,
      },
      create: {
        name: name.trim(),
        displayName: uniqueKey,
        manufacturer: fields.get("Manufacturer")?.trim() || null,
        code: fields.get("Code")?.trim() || null,
        category: fields.get("Category")?.trim() || null,
        type: fields.get("Type")?.trim() || null,
        flocculation: fields.get("Flocculation")?.trim() || null,
        attenuation: fields.get("Attenuation")?.trim() || null,
        temperature: fields.get("Temperature")?.trim() || null,
        description: fields.get("Description")?.trim() || null,
      },
    });
    count++;
  }

  return count;
}

export async function POST() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [fermentables, hops, yeasts] = await Promise.all([
    importFermentables(),
    importHops(),
    importYeasts(),
  ]);

  return NextResponse.json({ fermentables, hops, yeasts });
}
