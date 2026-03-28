import { config } from "dotenv";
config({ path: ".env.local" });

import { createClient } from "@sanity/client";
import { v4 as uuid } from "uuid";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_TOKEN!,
  useCdn: false,
});

function slug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[æ]/g, "ae")
    .replace(/[ø]/g, "o")
    .replace(/[å]/g, "a")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function blockText(text: string) {
  return text.split("\n\n").map((paragraph) => ({
    _type: "block",
    _key: uuid().slice(0, 8),
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: uuid().slice(0, 8),
        text: paragraph.trim(),
        marks: [],
      },
    ],
  }));
}

async function seed() {
  console.log("Seeding Uranus Garage...");

  // --- BREWERS ---
  const brewers = [
    { _id: "brewer-eirik", name: "Eirik", role: "Grunnlegger", bio: "Grunnlegger av Uranus Garage. Brygger alt fra IPA til lager." },
    { _id: "brewer-rune", name: "Rune", role: "Oppskriftsansvarlig", bio: "Mesteren bak oppskriftene. Lager de beste IPA-ene i garasjen." },
    { _id: "brewer-david", name: "David", role: "Brygger", bio: "Fast brygger i garasjen." },
    { _id: "brewer-bjornar", name: "Bjørnar", role: "Brygger", bio: "Tålmodig brygger med sans for detaljer." },
    { _id: "brewer-tormod", name: "Tormod", role: "Brygger", bio: "Nykomling med erfaring fra FWK-brygging." },
  ];

  for (const b of brewers) {
    await client.createOrReplace({
      ...b,
      _type: "brewer",
      slug: { _type: "slug", current: slug(b.name) },
    });
    console.log(`  Brewer: ${b.name}`);
  }

  // --- RECIPES ---
  const recipes = [
    {
      _id: "recipe-lucky-jack",
      name: "Lucky Jack IPA",
      style: "IPA",
      description: "Uranus Garage sin hus-IPA. Brygges jevnlig og er den mest populære ølen fra garasjen. Frisk og humlefokusert.",
      difficulty: "middels",
      batchSize: 25,
      grains: [
        { _key: "g1", name: "Pale Ale Malt", amount: 5, unit: "kg" },
        { _key: "g2", name: "Carapils", amount: 300, unit: "g" },
        { _key: "g3", name: "Munich Malt", amount: 500, unit: "g" },
      ],
      hops: [
        { _key: "h1", name: "Centennial", amount: 20, time: 60, alphaAcid: 10 },
        { _key: "h2", name: "Citra", amount: 30, time: 10, alphaAcid: 12 },
        { _key: "h3", name: "Mosaic", amount: 40, time: 0, alphaAcid: 11.5 },
        { _key: "h4", name: "Citra", amount: 50, time: -1, alphaAcid: 12 },
      ],
      yeast: { name: "Safale US-05", amount: "2 pakker", type: "Tørrgjær" },
      additions: [],
      process: [
        { _key: "p1", step: "Mashing", description: "Innmesking ved 66°C", temp: 66, duration: 60 },
        { _key: "p2", step: "Mash out", description: "Hev til 76°C for utlaking", temp: 76, duration: 10 },
        { _key: "p3", step: "Koking", description: "60 minutter kok med humletilsetninger", temp: 100, duration: 60 },
        { _key: "p4", step: "Whirlpool", description: "Whirlpool med Mosaic ved flameout", temp: 80, duration: 15 },
        { _key: "p5", step: "Gjæring", description: "Gjær ved 18-20°C i 7-10 dager", temp: 19, duration: 10080 },
        { _key: "p6", step: "Dry hop", description: "Dry hop med Citra etter 4 dager", temp: 19, duration: 4320 },
      ],
    },
    {
      _id: "recipe-vienna-calling",
      name: "Vienna Calling",
      style: "Lager",
      description: "Runes Vienna Lager-oppskrift. Klassisk og maltfokusert med europeisk humle.",
      difficulty: "avansert",
      batchSize: 50,
      grains: [
        { _key: "g1", name: "Vienna Malt", amount: 11, unit: "kg" },
        { _key: "g2", name: "Pilsner Malt", amount: 1.8, unit: "kg" },
        { _key: "g3", name: "Crystal Light", amount: 1.2, unit: "kg" },
      ],
      hops: [
        { _key: "h1", name: "Hersbrucker", amount: 75, time: 60, alphaAcid: 3.5 },
        { _key: "h2", name: "Saaz", amount: 50, time: 15, alphaAcid: 3.5 },
        { _key: "h3", name: "Saaz", amount: 25, time: 5, alphaAcid: 3.5 },
      ],
      yeast: { name: "Lager-gjær", amount: "2 pakker", type: "Tørrgjær" },
      additions: [],
      process: [
        { _key: "p1", step: "Mashing", description: "Innmesking ved 65°C", temp: 65, duration: 60 },
        { _key: "p2", step: "Koking", description: "60 minutter kok", temp: 100, duration: 60 },
        { _key: "p3", step: "Gjæring", description: "Kald gjæring ved 10-12°C i 14 dager", temp: 11, duration: 20160 },
        { _key: "p4", step: "Lagring", description: "Lagring ved 2°C i 4 uker", temp: 2, duration: 40320 },
      ],
    },
    {
      _id: "recipe-zombie-porter",
      name: "Zombie Porter",
      style: "Porter",
      description: "Mørk og fyldig porter med kaffe- og sjokoladetoner. En oppskrift som ble lagt på hylla et år før den ble brygget.",
      difficulty: "middels",
      batchSize: 48,
      grains: [
        { _key: "g1", name: "Maris Otter", amount: 6, unit: "kg" },
        { _key: "g2", name: "Chocolate Malt", amount: 500, unit: "g" },
        { _key: "g3", name: "Crystal 60", amount: 400, unit: "g" },
        { _key: "g4", name: "Black Patent", amount: 200, unit: "g" },
        { _key: "g5", name: "Flaked Oats", amount: 300, unit: "g" },
      ],
      hops: [
        { _key: "h1", name: "East Kent Goldings", amount: 40, time: 60, alphaAcid: 5 },
        { _key: "h2", name: "Fuggle", amount: 30, time: 15, alphaAcid: 4.5 },
      ],
      yeast: { name: "Safale S-04", amount: "1 pakke", type: "Tørrgjær" },
      additions: [],
      process: [
        { _key: "p1", step: "Mashing", description: "Innmesking ved 67°C for fyldig kropp", temp: 67, duration: 60 },
        { _key: "p2", step: "Koking", description: "60 minutter kok", temp: 100, duration: 60 },
        { _key: "p3", step: "Gjæring", description: "Gjæring ved 18°C i 10-14 dager", temp: 18, duration: 14400 },
      ],
    },
    {
      _id: "recipe-bells-two-hearted",
      name: "Bell's Two Hearted Clone",
      style: "IPA",
      description: "Klone av den klassiske amerikanske IPA-en. Brew-in-a-bag med heftig dry hop.",
      difficulty: "middels",
      batchSize: 35,
      grains: [
        { _key: "g1", name: "Pale Ale Malt", amount: 6.5, unit: "kg" },
        { _key: "g2", name: "Caramel 40L", amount: 300, unit: "g" },
      ],
      hops: [
        { _key: "h1", name: "Centennial", amount: 30, time: 60, alphaAcid: 10 },
        { _key: "h2", name: "Centennial", amount: 30, time: 15, alphaAcid: 10 },
        { _key: "h3", name: "Centennial", amount: 40, time: 0, alphaAcid: 10 },
        { _key: "h4", name: "Centennial", amount: 200, time: -1, alphaAcid: 10 },
      ],
      yeast: { name: "Safale US-05", amount: "1 pakke", type: "Tørrgjær" },
      additions: [],
      process: [
        { _key: "p1", step: "Mashing (BIAB)", description: "Brew-in-a-bag, mesking ved 66°C", temp: 66, duration: 60 },
        { _key: "p2", step: "Koking", description: "60 minutter kok med Centennial", temp: 100, duration: 60 },
        { _key: "p3", step: "Gjæring", description: "Gjæring ved 18-20°C", temp: 19, duration: 10080 },
        { _key: "p4", step: "Dry hop", description: "200g Centennial dry hop", temp: 19, duration: 5760 },
      ],
    },
    {
      _id: "recipe-five-oclock-esb",
      name: "Five o'clock ESB",
      style: "Brown Ale",
      description: "Klassisk engelsk Extra Special Bitter. Balansert malt og humle med en fin bitterhet.",
      difficulty: "nybegynner",
      batchSize: 23,
      grains: [
        { _key: "g1", name: "Maris Otter", amount: 4.5, unit: "kg" },
        { _key: "g2", name: "Crystal 60", amount: 300, unit: "g" },
        { _key: "g3", name: "Biscuit Malt", amount: 200, unit: "g" },
      ],
      hops: [
        { _key: "h1", name: "East Kent Goldings", amount: 30, time: 60, alphaAcid: 5 },
        { _key: "h2", name: "Fuggle", amount: 20, time: 15, alphaAcid: 4.5 },
        { _key: "h3", name: "East Kent Goldings", amount: 15, time: 0, alphaAcid: 5 },
      ],
      yeast: { name: "Safale S-04", amount: "1 pakke", type: "Tørrgjær" },
      additions: [],
      process: [
        { _key: "p1", step: "Mashing", description: "Innmesking ved 67°C", temp: 67, duration: 60 },
        { _key: "p2", step: "Koking", description: "60 minutter kok", temp: 100, duration: 60 },
        { _key: "p3", step: "Gjæring", description: "Gjæring ved 18°C i 7-10 dager", temp: 18, duration: 10080 },
      ],
    },
  ];

  for (const r of recipes) {
    await client.createOrReplace({
      ...r,
      _type: "recipe",
      slug: { _type: "slug", current: slug(r.name) },
    });
    console.log(`  Recipe: ${r.name}`);
  }

  // --- BEERS ---
  const beers = [
    {
      _id: "beer-lucky-jack",
      name: "Lucky Jack",
      style: "IPA",
      description: "Hus-IPAen til Uranus Garage. Frisk, humlebombet og alltid populær. Brygges flere ganger i året.",
      abv: 5.0,
      ibu: 45,
      srm: 6,
      flavorTags: ["humle", "sitrus", "tropisk", "frisk"],
      difficulty: "middels",
      status: "ferdig",
      recipe: { _type: "reference", _ref: "recipe-lucky-jack" },
    },
    {
      _id: "beer-vienna-calling",
      name: "Vienna Calling",
      style: "Lager",
      description: "Runes klassiske Vienna Lager. Maltfokusert med fin balanse fra europeisk humle.",
      abv: 5.1,
      ibu: 25,
      srm: 10,
      flavorTags: ["malt", "brød", "karamell", "ren"],
      difficulty: "avansert",
      status: "ferdig",
      recipe: { _type: "reference", _ref: "recipe-vienna-calling" },
    },
    {
      _id: "beer-zombie-porter",
      name: "Zombie Porter",
      style: "Porter",
      description: "Mørk og fyldig porter med kaffe- og sjokoladetoner. Gjenoppstått etter et år på hylla.",
      abv: 4.6,
      ibu: 30,
      srm: 30,
      flavorTags: ["kaffe", "sjokolade", "mørk", "fyldig"],
      difficulty: "middels",
      status: "ferdig",
      recipe: { _type: "reference", _ref: "recipe-zombie-porter" },
    },
    {
      _id: "beer-bells-two-hearted",
      name: "Bell's Two Hearted Clone",
      style: "IPA",
      description: "Klone av den klassiske Bell's Two Hearted Ale. Centennial-humle fra start til slutt.",
      abv: 6.0,
      ibu: 55,
      srm: 8,
      flavorTags: ["humle", "blomster", "sitrus", "balansert"],
      difficulty: "middels",
      status: "ferdig",
      recipe: { _type: "reference", _ref: "recipe-bells-two-hearted" },
    },
    {
      _id: "beer-five-oclock-esb",
      name: "Five o'clock ESB",
      style: "Brown Ale",
      description: "Klassisk engelsk bitter. Perfekt til ettermiddagste — eller i stedet for.",
      abv: 4.2,
      ibu: 35,
      srm: 14,
      flavorTags: ["malt", "jordig", "bitter", "engelsk"],
      difficulty: "nybegynner",
      status: "ferdig",
      recipe: { _type: "reference", _ref: "recipe-five-oclock-esb" },
    },
    {
      _id: "beer-diamond-czech-lager",
      name: "Diamond Czech Lager",
      style: "Pilsner",
      description: "FWK Czech Pilsner med Saaz-humle. Sprø og ren.",
      abv: 4.9,
      ibu: 35,
      srm: 4,
      flavorTags: ["humle", "Saaz", "sprø", "ren"],
      difficulty: "nybegynner",
      status: "ferdig",
    },
  ];

  for (const b of beers) {
    await client.createOrReplace({
      ...b,
      _type: "beer",
      slug: { _type: "slug", current: slug(b.name) },
    });
    console.log(`  Beer: ${b.name}`);
  }

  // --- BREW LOGS ---
  const brewLogs = [
    {
      _id: "log-lucky-jack-mars-2026",
      title: "Lucky Jack – Mars 2026",
      date: "2026-03-21",
      og: 1.050,
      fg: 1.013,
      tempNotes: "Gjæring ved ca 19°C",
      beer: { _type: "reference", _ref: "beer-lucky-jack" },
      recipe: { _type: "reference", _ref: "recipe-lucky-jack" },
      brewers: [{ _type: "reference", _ref: "brewer-eirik", _key: "b1" }],
      body: blockText("Ny batch Lucky Jack med besøk fra Hollingbrygg og Hagelaget. Fin bryggedag med godt selskap i garasjen.\n\nDry hoppet fire dager senere, den 25. mars. OG på 1.050 som forventet."),
    },
    {
      _id: "log-vienna-calling-feb-2026",
      title: "Vienna Calling februar 2026",
      date: "2026-02-07",
      og: 1.041,
      fg: null,
      tempNotes: "Kald gjæring ved 10-12°C",
      beer: { _type: "reference", _ref: "beer-vienna-calling" },
      recipe: { _type: "reference", _ref: "recipe-vienna-calling" },
      brewers: [
        { _type: "reference", _ref: "brewer-eirik", _key: "b1" },
        { _type: "reference", _ref: "brewer-david", _key: "b2" },
      ],
      body: blockText("Eirik og David brygget Runes Vienna Lager-oppskrift. Endte opp med 10 liter mindre vørter enn planlagt, noe som ga lavere OG enn forventet på 1.041.\n\nAsbjørn og Bjørnar var fraværende denne gangen."),
    },
    {
      _id: "log-lucky-jack-okt-2025",
      title: "Lucky Jack Oktober 2025",
      date: "2025-10-25",
      og: null,
      fg: null,
      tempNotes: "Gravity logget via RAPT-systemet",
      beer: { _type: "reference", _ref: "beer-lucky-jack" },
      recipe: { _type: "reference", _ref: "recipe-lucky-jack" },
      brewers: [{ _type: "reference", _ref: "brewer-rune", _key: "b1" }],
      body: blockText("Brygget 64 liter Lucky Jack med en oppskalert versjon av Runes oppskrift. Noen ingrediensendringer denne gangen — utelot Mosaic-humle.\n\nGravity ble sporet med RAPT-systemet gjennom hele gjæringen."),
    },
    {
      _id: "log-zombie-porter-2025",
      title: "Zombie Porter 2025",
      date: "2025-09-20",
      og: 1.055,
      fg: 1.020,
      tempNotes: "Gjæring ved 18°C",
      beer: { _type: "reference", _ref: "beer-zombie-porter" },
      recipe: { _type: "reference", _ref: "recipe-zombie-porter" },
      brewers: [{ _type: "reference", _ref: "brewer-eirik", _key: "b1" }],
      body: blockText("Hollingbrygg var på besøk da vi gjenopptok en porter-oppskrift som hadde ligget på hylla i et helt år.\n\nGlemte humlesamleren, men whirlpoolen konsentrerte sedimentet effektivt. Endte opp med 48 liter vørter. OG 1.055, FG 1.020."),
    },
    {
      _id: "log-bells-two-hearted-2025",
      title: "Bell's Two Hearted",
      date: "2025-06-17",
      og: 1.060,
      fg: null,
      tempNotes: "Mesket ved 66°C i én time",
      beer: { _type: "reference", _ref: "beer-bells-two-hearted" },
      recipe: { _type: "reference", _ref: "recipe-bells-two-hearted" },
      brewers: [{ _type: "reference", _ref: "brewer-rune", _key: "b1" }],
      body: blockText("Rune brygget en Bell's Two Hearted-klone med brew-in-a-bag på Hollingen. Mesket ved 66°C i én time.\n\nFikk ut ca 35 liter med en heftig dry hop på 200g. OG 1.060."),
    },
    {
      _id: "log-lucky-jack-mai-2025",
      title: "Lucky Jack – Mai 2025",
      date: "2025-05-10",
      og: 1.040,
      fg: null,
      tempNotes: "Høyere koketemperatur enn forventet",
      beer: { _type: "reference", _ref: "beer-lucky-jack" },
      recipe: { _type: "reference", _ref: "recipe-lucky-jack" },
      brewers: [{ _type: "reference", _ref: "brewer-bjornar", _key: "b1" }],
      body: blockText("Første brygg på omtrent 9 måneder! Produserte to batcher på totalt ca 25 liter.\n\nHøyere koketemperatur enn forventet førte til mye humlesediment. OG endte på 1.040."),
    },
    {
      _id: "log-fwk-diamond-2025",
      title: "FWK Diamond Czech Lager",
      date: "2025-04-01",
      og: 1.046,
      fg: null,
      tempNotes: "Kald gjæring med Diamond lager-gjær",
      beer: { _type: "reference", _ref: "beer-diamond-czech-lager" },
      brewers: [{ _type: "reference", _ref: "brewer-tormod", _key: "b1" }],
      body: blockText("Fresh Wort Kit-brygg som bare krevde gjærpitching i ferdiglagd vørter. Mål: ca 4.9% ABV, ~35 IBU Czech Pilsner med Saaz-humle.\n\nBrukte Lallemand Diamond Lager-gjær. OG 1.046."),
    },
    {
      _id: "log-vienna-calling-jul-2024",
      title: "Vienna Calling Juli 2024",
      date: "2024-07-26",
      og: 1.051,
      fg: null,
      tempNotes: "Brix 13.2",
      beer: { _type: "reference", _ref: "beer-vienna-calling" },
      recipe: { _type: "reference", _ref: "recipe-vienna-calling" },
      brewers: [{ _type: "reference", _ref: "brewer-eirik", _key: "b1" }],
      body: blockText("All-grain Vienna Lager med 11 kg Vienna-malt som base, støttet av Pils og Crystal Light. Humpet med Hersbrucker og Saaz.\n\nBrix-avlesning på 13.2 ga OG 1.051."),
    },
    {
      _id: "log-five-oclock-esb-2024",
      title: "Five o'clock ESB",
      date: "2024-07-04",
      og: 1.042,
      fg: null,
      tempNotes: "",
      beer: { _type: "reference", _ref: "beer-five-oclock-esb" },
      recipe: { _type: "reference", _ref: "recipe-five-oclock-esb" },
      brewers: [{ _type: "reference", _ref: "brewer-eirik", _key: "b1" }],
      body: blockText("Brygget en ESB med noe lav OG på 1.042, men vørteren smakte godt og bittert.\n\nFornøyd til tross for at det allerede var rikelig med øl på lager."),
    },
    {
      _id: "log-lucky-jack-jun-2024",
      title: "Lucky Jack Juni 2024",
      date: "2024-06-07",
      og: null,
      fg: null,
      tempNotes: "Dry hoppet med Citra 21. juni",
      beer: { _type: "reference", _ref: "beer-lucky-jack" },
      recipe: { _type: "reference", _ref: "recipe-lucky-jack" },
      brewers: [{ _type: "reference", _ref: "brewer-eirik", _key: "b1" }],
      body: blockText("Brygget ca 65 liter fordelt på tre gjæringsbeholdere. Hadde for lite gjær — bare to pakker US-05 til tre kar.\n\nDry hoppet med Citra den 21. juni."),
    },
  ];

  for (const log of brewLogs) {
    await client.createOrReplace({
      ...log,
      _type: "brewLog",
      slug: { _type: "slug", current: slug(log.title) },
    });
    console.log(`  BrewLog: ${log.title}`);
  }

  // --- Link beers to brew logs ---
  const luckyJackLogs = brewLogs
    .filter((l) => l.beer?._ref === "beer-lucky-jack")
    .map((l, i) => ({ _type: "reference", _ref: l._id, _key: `bl${i}` }));

  await client
    .patch("beer-lucky-jack")
    .set({ brewLogs: luckyJackLogs })
    .commit();

  const viennaLogs = brewLogs
    .filter((l) => l.beer?._ref === "beer-vienna-calling")
    .map((l, i) => ({ _type: "reference", _ref: l._id, _key: `bl${i}` }));

  await client
    .patch("beer-vienna-calling")
    .set({ brewLogs: viennaLogs })
    .commit();

  console.log("\nDone! Seeded 5 brewers, 5 recipes, 6 beers, and 10 brew logs.");
}

seed().catch(console.error);
