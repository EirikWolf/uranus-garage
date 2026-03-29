import { config } from "dotenv";
config({ path: ".env.local" });

import { createClient } from "@sanity/client";

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

async function seedClassics() {
  console.log("Seeding classic/inspiration recipes...\n");

  // ─── PART 1: Update existing recipes ────────────────────────────────────────

  console.log("Updating existing recipes...");

  await client.patch("recipe-lucky-jack").set({
    isClassic: true,
    sourceAuthor: "Lervig Brewing",
    sourceBook: null,
    sourceUrl: "https://lervig.no",
    sourceNote:
      "Hjemmebrygget versjon inspirert av Lervig Lucky Jack APA. Tilpasset for hjemmebrygging.",
  }).commit();
  console.log("  Updated: Lucky Jack IPA");

  await client.patch("recipe-bells-two-hearted").set({
    isClassic: true,
    sourceAuthor: "Bell's Brewery / Larry Bell",
    sourceBook: null,
    sourceUrl: null,
    sourceNote:
      "Klone av den klassiske Bell's Two Hearted Ale. Centennial-humle gjennom hele oppskriften.",
  }).commit();
  console.log("  Updated: Bell's Two Hearted Clone");

  // ─── PART 2: Create 8 new classic recipes ───────────────────────────────────

  console.log("\nCreating 8 new classic/inspiration recipes...");

  const classicRecipes = [
    // 1. Klassisk West Coast IPA
    {
      _id: "recipe-classic-american-ipa",
      name: "Klassisk West Coast IPA",
      style: "IPA",
      description:
        "En definitivt West Coast IPA med klar bitterhet, sitrus- og furuhumle, og tørr finish. Inspirert av de tidlige San Diego-bryggerienes tilnærming til humleforward aling.",
      difficulty: "middels",
      batchSize: 20,
      isClassic: true,
      sourceAuthor: "Mitch Steele",
      sourceBook:
        "IPA: Brewing Techniques, Recipes and the Evolution of India Pale Ale",
      sourceUrl: null,
      sourceNote:
        "Tilpasset for hjemmebrygging fra prinsipper beskrevet av Mitch Steele.",
      grains: [
        { _key: "g1", name: "Pale Ale Malt", amount: 5, unit: "kg" },
        { _key: "g2", name: "Crystal 40L", amount: 300, unit: "g" },
        { _key: "g3", name: "Munich Malt", amount: 200, unit: "g" },
      ],
      hops: [
        { _key: "h1", name: "Columbus", amount: 15, time: 60, alphaAcid: 14 },
        { _key: "h2", name: "Centennial", amount: 20, time: 15, alphaAcid: 10 },
        { _key: "h3", name: "Cascade", amount: 30, time: 5, alphaAcid: 7 },
        { _key: "h4", name: "Centennial", amount: 40, time: 0, alphaAcid: 10 },
        { _key: "h5", name: "Cascade", amount: 50, time: -1, alphaAcid: 7 },
      ],
      yeast: { name: "Safale US-05", amount: "1 pakke", type: "Tørrgjær" },
      additions: [],
      process: [
        {
          _key: "p1",
          step: "Mesking",
          description: "Meskingtemperatur 66°C for medium kropp og god gjærbarhet",
          temp: 66,
          duration: 60,
        },
        {
          _key: "p2",
          step: "Koking",
          description: "60 minutters kok med humletilsetninger etter skjema",
          temp: 100,
          duration: 60,
        },
        {
          _key: "p3",
          step: "Whirlpool",
          description: "Whirlpool ved 80°C for aromaekstraksjon fra flameout-humle",
          temp: 80,
          duration: 15,
        },
        {
          _key: "p4",
          step: "Gjæring",
          description: "Gjær ved 18°C i 10 dager for ren, tørr fermentering",
          temp: 18,
          duration: 14400,
        },
        {
          _key: "p5",
          step: "Dry hop",
          description: "Cascade dry hop tilsettes på dag 5 av gjæringen",
          temp: 18,
          duration: 7200,
        },
      ],
    },

    // 2. Klassisk Irish Dry Stout
    {
      _id: "recipe-classic-dry-stout",
      name: "Klassisk Irish Dry Stout",
      style: "Stout",
      description:
        "Tørr, kaffeaktig stout med lett kropp og kremet skum. Den ultimate sesjons-mørke ølen — under 4 % men full av karakter.",
      difficulty: "nybegynner",
      batchSize: 20,
      isClassic: true,
      sourceAuthor: "Jamil Zainasheff & John Palmer",
      sourceBook: "Brewing Classic Styles",
      sourceUrl: null,
      sourceNote:
        "Tilpasset for norske forhold og tilgjengelige ingredienser.",
      grains: [
        { _key: "g1", name: "Pale Ale Malt", amount: 3.5, unit: "kg" },
        { _key: "g2", name: "Roasted Barley", amount: 400, unit: "g" },
        { _key: "g3", name: "Flaked Barley", amount: 400, unit: "g" },
        { _key: "g4", name: "Chocolate Malt", amount: 200, unit: "g" },
      ],
      hops: [
        {
          _key: "h1",
          name: "East Kent Goldings",
          amount: 35,
          time: 60,
          alphaAcid: 5,
        },
        {
          _key: "h2",
          name: "East Kent Goldings",
          amount: 15,
          time: 15,
          alphaAcid: 5,
        },
      ],
      yeast: { name: "Safale S-04", amount: "1 pakke", type: "Tørrgjær" },
      additions: [],
      process: [
        {
          _key: "p1",
          step: "Mesking",
          description:
            "Meskingtemperatur 68°C for litt mer dextrin og kremet kropp",
          temp: 68,
          duration: 60,
        },
        {
          _key: "p2",
          step: "Koking",
          description: "60 minutters kok — enkelt og greit",
          temp: 100,
          duration: 60,
        },
        {
          _key: "p3",
          step: "Gjæring",
          description: "Gjær ved 18°C i 7 dager. S-04 gir fin lett fruktig ester",
          temp: 18,
          duration: 10080,
        },
      ],
    },

    // 3. Belgisk Dubbel
    {
      _id: "recipe-classic-belgian-dubbel",
      name: "Belgisk Dubbel",
      style: "Belgian",
      description:
        "Rik og kompleks belgisk ale med mørk frukt, karamell og kryddertoner. Inspirert av trappisttradisjonens klassikere fra klosterbryggeri i Belgia.",
      difficulty: "avansert",
      batchSize: 20,
      isClassic: true,
      sourceAuthor: "Michael Jackson",
      sourceBook: "Great Beers of Belgium",
      sourceUrl: null,
      sourceNote:
        "Basert på generelle prinsipper fra trappisttradisjonen som beskrevet av Michael Jackson.",
      grains: [
        { _key: "g1", name: "Pilsner Malt", amount: 5, unit: "kg" },
        { _key: "g2", name: "Munich Malt", amount: 1, unit: "kg" },
        { _key: "g3", name: "Special B", amount: 300, unit: "g" },
        { _key: "g4", name: "Aromatic Malt", amount: 200, unit: "g" },
      ],
      hops: [
        {
          _key: "h1",
          name: "Styrian Goldings",
          amount: 30,
          time: 60,
          alphaAcid: 5,
        },
        { _key: "h2", name: "Saaz", amount: 15, time: 15, alphaAcid: 3.5 },
      ],
      yeast: {
        name: "Lallemand Abbaye",
        amount: "1 pakke",
        type: "Tørrgjær",
      },
      additions: [
        {
          _key: "a1",
          name: "Dark Candi Sugar",
          amount: "500g",
          time: 15,
        },
      ],
      process: [
        {
          _key: "p1",
          step: "Mesking",
          description:
            "Meskingtemperatur 66°C. Pilsner-malt krever grundig enzymatisk aktivitet",
          temp: 66,
          duration: 90,
        },
        {
          _key: "p2",
          step: "Koking",
          description:
            "90 minutters kok for å drive av DMS fra pilsnermalt. Tilsett candi-sukker ved 15 min",
          temp: 100,
          duration: 90,
        },
        {
          _key: "p3",
          step: "Gjæring",
          description:
            "Start gjæring ved 18°C, hev gradvis til 24°C over 3 dager for belgiske estere",
          temp: 21,
          duration: 20160,
        },
        {
          _key: "p4",
          step: "Lagring",
          description:
            "Minst 4 uker kondisjonering — tålmodighet belønnes i kompleksitet",
          temp: 4,
          duration: 40320,
        },
      ],
    },

    // 4. Klassisk Bøhmisk Pilsner
    {
      _id: "recipe-classic-bohemian-pilsner",
      name: "Klassisk Bøhmisk Pilsner",
      style: "Pilsner",
      description:
        "Den originale pilsneren — gyllen, med rik maltkarakter og elegant Saaz-humle. Krevende å brygge perfekt, men resultatet er uovertruffen forfriskende.",
      difficulty: "avansert",
      batchSize: 20,
      isClassic: true,
      sourceAuthor: "Klassisk tsjekkisk bryggetradisjon",
      sourceBook: null,
      sourceUrl: null,
      sourceNote:
        "Basert på tradisjonell bøhmisk bryggemetode. Trippel-dekokt forenklet til single infusion for hjemmebryggere.",
      grains: [
        {
          _key: "g1",
          name: "Bohemian Pilsner Malt",
          amount: 4.5,
          unit: "kg",
        },
        { _key: "g2", name: "Carapils", amount: 200, unit: "g" },
      ],
      hops: [
        { _key: "h1", name: "Saaz", amount: 40, time: 60, alphaAcid: 3.5 },
        { _key: "h2", name: "Saaz", amount: 30, time: 30, alphaAcid: 3.5 },
        { _key: "h3", name: "Saaz", amount: 20, time: 5, alphaAcid: 3.5 },
      ],
      yeast: {
        name: "Saflager W-34/70",
        amount: "2 pakker",
        type: "Tørrgjær",
      },
      additions: [],
      process: [
        {
          _key: "p1",
          step: "Mesking",
          description:
            "Meskingtemperatur 65°C for tørr, gjærbar vørter. Pilsnermalt trenger 75 minutter",
          temp: 65,
          duration: 75,
        },
        {
          _key: "p2",
          step: "Koking",
          description:
            "90 minutters kok — standard for pilsnermalt for å eliminere DMS",
          temp: 100,
          duration: 90,
        },
        {
          _key: "p3",
          step: "Kald gjæring",
          description:
            "Pitch ved 10°C. Gjær rolig i 14 dager. Ikke stress prosessen",
          temp: 10,
          duration: 20160,
        },
        {
          _key: "p4",
          step: "Lagring",
          description:
            "Lagre ved 4°C i minimum 4 uker. Tid er hemmeligheten bak en god lager",
          temp: 4,
          duration: 40320,
        },
      ],
    },

    // 5. English ESB
    {
      _id: "recipe-classic-english-esb",
      name: "Klassisk English ESB",
      style: "Brown Ale",
      description:
        "Balansert og maltdrevet Extra Special Bitter med karamell, biscuit og jordig humle. Ølet som definerte britisk pub-kultur gjennom generasjoner.",
      difficulty: "middels",
      batchSize: 20,
      isClassic: true,
      sourceAuthor: "Gordon Strong",
      sourceBook: "Modern Homebrew Recipes",
      sourceUrl: null,
      sourceNote:
        "Tilpasset fra prinsipper i Gordon Strongs tilnærming til balanserte britiske ales.",
      grains: [
        { _key: "g1", name: "Maris Otter", amount: 4.5, unit: "kg" },
        { _key: "g2", name: "Crystal 60", amount: 400, unit: "g" },
        { _key: "g3", name: "Biscuit Malt", amount: 200, unit: "g" },
        { _key: "g4", name: "Victory Malt", amount: 150, unit: "g" },
      ],
      hops: [
        { _key: "h1", name: "Target", amount: 20, time: 60, alphaAcid: 11 },
        {
          _key: "h2",
          name: "East Kent Goldings",
          amount: 25,
          time: 15,
          alphaAcid: 5,
        },
        { _key: "h3", name: "Fuggle", amount: 15, time: 5, alphaAcid: 4.5 },
      ],
      yeast: { name: "Safale S-04", amount: "1 pakke", type: "Tørrgjær" },
      additions: [],
      process: [
        {
          _key: "p1",
          step: "Mesking",
          description:
            "Meskingtemperatur 67°C for god maltkarakter og litt fylde",
          temp: 67,
          duration: 60,
        },
        {
          _key: "p2",
          step: "Koking",
          description: "60 minutters kok med tradisjonell britisk humle",
          temp: 100,
          duration: 60,
        },
        {
          _key: "p3",
          step: "Gjæring",
          description:
            "Gjær ved 18°C i 7 dager. S-04 gir autentisk engelsk karakter",
          temp: 18,
          duration: 10080,
        },
        {
          _key: "p4",
          step: "Kondisjonering",
          description: "Én ukes kondisjonering på fat eller flaske for avrunding",
          temp: 12,
          duration: 10080,
        },
      ],
    },

    // 6. Rocky Raccoon's Honey Lager
    {
      _id: "recipe-classic-rocky-raccoon",
      name: "Rocky Raccoon's Honey Lager",
      style: "Lager",
      description:
        "Charlie Papazians legendariske honninglager — lett, forfriskende med et hint av villblomst-honning. En klassiker fra hjemmebryggingens tidlige dager i USA.",
      difficulty: "middels",
      batchSize: 20,
      isClassic: true,
      sourceAuthor: "Charlie Papazian",
      sourceBook: "The Complete Joy of Homebrewing",
      sourceUrl: null,
      sourceNote:
        "Tilpasset fra originaloppskriften. Papazian er grunnleggeren av den moderne hjemmebryggebevegelsen.",
      grains: [
        { _key: "g1", name: "Pale Malt", amount: 3.5, unit: "kg" },
        { _key: "g2", name: "Crystal 20L", amount: 200, unit: "g" },
      ],
      hops: [
        { _key: "h1", name: "Hallertau", amount: 25, time: 60, alphaAcid: 4 },
        { _key: "h2", name: "Cascade", amount: 15, time: 5, alphaAcid: 7 },
      ],
      yeast: { name: "Saflager S-23", amount: "1 pakke", type: "Tørrgjær" },
      additions: [
        {
          _key: "a1",
          name: "Blomsterhonning",
          amount: "500g",
          time: 0,
        },
      ],
      process: [
        {
          _key: "p1",
          step: "Mesking",
          description: "Meskingtemperatur 65°C for tørr, lett kropp",
          temp: 65,
          duration: 60,
        },
        {
          _key: "p2",
          step: "Koking",
          description:
            "60 minutters kok. Tilsett honning ved flameout for å bevare aromaen",
          temp: 100,
          duration: 60,
        },
        {
          _key: "p3",
          step: "Gjæring",
          description:
            "Kald gjæring ved 12°C i 14 dager. Honningen gjæres ut og etterlater bare aromaen",
          temp: 12,
          duration: 20160,
        },
        {
          _key: "p4",
          step: "Lagring",
          description: "Lagre kaldt ved 2°C i 3 uker for en krystallklar lager",
          temp: 2,
          duration: 30240,
        },
      ],
    },

    // 7. 1800-talls London Porter
    {
      _id: "recipe-classic-1800s-porter",
      name: "1800-talls London Porter",
      style: "Porter",
      description:
        "En historisk porter basert på viktoriatidenes London. Røkt, jordig og kompleks med brun malt som gir en særegen karakter du ikke finner i moderne stout.",
      difficulty: "avansert",
      batchSize: 20,
      isClassic: true,
      sourceAuthor: "Ron Pattinson",
      sourceBook: null,
      sourceUrl: "https://barclayperkins.blogspot.com",
      sourceNote:
        "Inspirert av historiske bryggelogger publisert av Ron Pattinson. Forenklet for moderne hjemmebrygging med tilgjengelige ingredienser.",
      grains: [
        { _key: "g1", name: "Maris Otter", amount: 4, unit: "kg" },
        { _key: "g2", name: "Brown Malt", amount: 1, unit: "kg" },
        { _key: "g3", name: "Chocolate Malt", amount: 300, unit: "g" },
        { _key: "g4", name: "Black Patent", amount: 100, unit: "g" },
        { _key: "g5", name: "Crystal 80L", amount: 200, unit: "g" },
      ],
      hops: [
        {
          _key: "h1",
          name: "East Kent Goldings",
          amount: 40,
          time: 60,
          alphaAcid: 5,
        },
        { _key: "h2", name: "Fuggle", amount: 20, time: 15, alphaAcid: 4.5 },
      ],
      yeast: { name: "Safale S-04", amount: "1 pakke", type: "Tørrgjær" },
      additions: [],
      process: [
        {
          _key: "p1",
          step: "Mesking",
          description:
            "Meskingtemperatur 67°C for fyldig kropp. Brun malt bidrar med nøtteaktige, røkte toner",
          temp: 67,
          duration: 60,
        },
        {
          _key: "p2",
          step: "Koking",
          description:
            "90 minutters kok. Historisk var porterkok lange — gir god melanoidin-utvikling",
          temp: 100,
          duration: 90,
        },
        {
          _key: "p3",
          step: "Gjæring",
          description: "Gjær ved 18°C i 10 dager for fullstendig fermentering",
          temp: 18,
          duration: 14400,
        },
        {
          _key: "p4",
          step: "Lagring",
          description:
            "Minst 4 uker kondisjonering — kompleksiteten runder seg av over tid",
          temp: 12,
          duration: 40320,
        },
      ],
    },

    // 8. Klassisk Bayersk Hefeweizen
    {
      _id: "recipe-classic-hefeweizen",
      name: "Klassisk Bayersk Hefeweizen",
      style: "Wheat",
      description:
        "Fruktig og krydret hveteøl med banan- og nellikearoma. Minst 50 % hvete i maltbasen, som Reinheitsgebot og tradisjonen krever.",
      difficulty: "middels",
      batchSize: 20,
      isClassic: true,
      sourceAuthor: "Bayersk bryggetradisjon",
      sourceBook: null,
      sourceUrl: null,
      sourceNote:
        "Basert på det bayerske Reinheitsgebot-prinsippet med tradisjonell hveteøl-gjæring og steg-mesking.",
      grains: [
        { _key: "g1", name: "Wheat Malt", amount: 2.5, unit: "kg" },
        { _key: "g2", name: "Pilsner Malt", amount: 2, unit: "kg" },
        { _key: "g3", name: "Munich Malt", amount: 300, unit: "g" },
      ],
      hops: [
        {
          _key: "h1",
          name: "Hallertau Mittelfrüh",
          amount: 15,
          time: 60,
          alphaAcid: 4,
        },
        { _key: "h2", name: "Tettnang", amount: 10, time: 15, alphaAcid: 4.5 },
      ],
      yeast: {
        name: "Lallemand Munich Classic",
        amount: "1 pakke",
        type: "Tørrgjær",
      },
      additions: [],
      process: [
        {
          _key: "p1",
          step: "Steg-mesking trinn 1",
          description:
            "Start ved 64°C i 30 minutter — ferulic acid rest for nellikproduksjon",
          temp: 64,
          duration: 30,
        },
        {
          _key: "p2",
          step: "Steg-mesking trinn 2",
          description:
            "Hev til 72°C i 20 minutter for alpha-amylase og mer dextrin i kroppen",
          temp: 72,
          duration: 20,
        },
        {
          _key: "p3",
          step: "Koking",
          description: "60 minutters kok med tradisjonell bayersk edelhumle",
          temp: 100,
          duration: 60,
        },
        {
          _key: "p4",
          step: "Gjæring",
          description:
            "Start ved 17°C, hev gradvis til 22°C — temperaturstyring driver balansen mellom banan (isoamyl acetat) og nellik (4-vinyl guaiacol)",
          temp: 19,
          duration: 14400,
        },
      ],
    },
  ];

  for (const recipe of classicRecipes) {
    await client.createOrReplace({
      ...recipe,
      _type: "recipe",
      slug: { _type: "slug", current: slug(recipe.name) },
    });
    console.log(`  Created: ${recipe.name}`);
  }

  console.log(
    "\nDone! Updated 2 existing recipes, created 8 classic/inspiration recipes."
  );
}

seedClassics().catch(console.error);
