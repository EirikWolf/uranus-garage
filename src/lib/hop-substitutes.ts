export interface HopProfile {
  name: string;
  alpha: string; // e.g. "11-13%"
  aroma: string[]; // aroma descriptors
  origin: string;
  category: "american" | "european" | "australian" | "other";
}

export interface HopSubstitution {
  name: string;
  similarity: number; // 1-5 (5 = very similar)
  notes: string; // what changes
}

export const hops: Record<string, { profile: HopProfile; substitutes: HopSubstitution[] }> = {
  "Citra": {
    profile: { name: "Citra", alpha: "11-13%", aroma: ["tropisk", "sitrus", "grapefrukt", "mango"], origin: "USA", category: "american" },
    substitutes: [
      { name: "Mosaic", similarity: 4, notes: "Mer bær og urter, mindre ren sitrus. Fungerer utmerket." },
      { name: "Galaxy", similarity: 4, notes: "Mer pasjonsfrukt og fersken. Australsk alternativ." },
      { name: "Simcoe", similarity: 3, notes: "Mer furu og sitrus, mindre tropisk. Gir mer bitterhet." },
      { name: "Amarillo", similarity: 3, notes: "Mer appelsin og blomster. Mildere tropisk karakter." },
      { name: "Vic Secret", similarity: 3, notes: "Mer ananas og furu. Australsk med høyere alfa." },
    ],
  },
  "Mosaic": {
    profile: { name: "Mosaic", alpha: "11-13%", aroma: ["bær", "tropisk", "urter", "jordig"], origin: "USA", category: "american" },
    substitutes: [
      { name: "Citra", similarity: 4, notes: "Mer sitrus, mindre bær/urter. Det klassiske byttet." },
      { name: "Galaxy", similarity: 3, notes: "Mer pasjonsfrukt, mindre kompleks. Fungerer i IPA." },
      { name: "Simcoe", similarity: 3, notes: "Mer furu, mindre frukt. Bidrar med tilsvarende dybde." },
      { name: "Vic Secret", similarity: 3, notes: "Mer ananas, lignende kompleksitet. God erstatning." },
      { name: "El Dorado", similarity: 3, notes: "Mer steinfrukt og karamell. Uvanlig men spennende." },
    ],
  },
  "Cascade": {
    profile: { name: "Cascade", alpha: "5-7%", aroma: ["blomster", "sitrus", "grapefrukt"], origin: "USA", category: "american" },
    substitutes: [
      { name: "Centennial", similarity: 5, notes: "Nesten identisk, bare litt mer intens. Perfekt bytte." },
      { name: "Amarillo", similarity: 4, notes: "Mer appelsin, lignende blomsterkarakter." },
      { name: "Chinook", similarity: 3, notes: "Mer furu og krydder. Sterkere karakter." },
      { name: "Columbus", similarity: 2, notes: "Mye høyere alfa. Brukes som bitterhumle, ikke aroma." },
    ],
  },
  "Centennial": {
    profile: { name: "Centennial", alpha: "9-11%", aroma: ["sitrus", "blomster", "ren bitterhet"], origin: "USA", category: "american" },
    substitutes: [
      { name: "Cascade", similarity: 5, notes: "Klassisk bytte. Litt mildere, men samme karakter." },
      { name: "Chinook", similarity: 3, notes: "Mer furu og krydder. Passer i West Coast IPA." },
      { name: "Amarillo", similarity: 3, notes: "Mer frukt og appelsin. Litt annen karakter." },
      { name: "Columbus", similarity: 3, notes: "Ren bitterhet uten mye aroma. Kun for bittring." },
    ],
  },
  "Simcoe": {
    profile: { name: "Simcoe", alpha: "12-14%", aroma: ["furu", "sitrus", "jordig", "frukt"], origin: "USA", category: "american" },
    substitutes: [
      { name: "Columbus", similarity: 4, notes: "Lignende bitterhet og dybde. Mindre frukt." },
      { name: "Chinook", similarity: 3, notes: "Mer krydder og furu. God for bittring." },
      { name: "Mosaic", similarity: 3, notes: "Mer bær og tropisk, men lignende kompleksitet." },
      { name: "Summit", similarity: 3, notes: "Tilsvarende alfa og jordig karakter." },
    ],
  },
  "Saaz": {
    profile: { name: "Saaz", alpha: "2.5-4.5%", aroma: ["krydder", "urter", "jordig", "blomster"], origin: "Tsjekkia", category: "european" },
    substitutes: [
      { name: "Tettnang", similarity: 5, notes: "Svært lik profil. Perfekt erstatning for edel humle." },
      { name: "Hallertau Mittelfrüh", similarity: 4, notes: "Litt mer blomster, like edel. Klassisk bytte." },
      { name: "Spalt", similarity: 4, notes: "Tysk edel humle. Nesten identisk bruk." },
      { name: "Hersbrucker", similarity: 3, notes: "Mildere og mer frukt. Funker i lager." },
      { name: "Sterling", similarity: 3, notes: "Amerikansk versjon med lignende profil." },
    ],
  },
  "East Kent Goldings": {
    profile: { name: "East Kent Goldings", alpha: "4-6%", aroma: ["krydder", "honning", "jordig", "blomster"], origin: "England", category: "european" },
    substitutes: [
      { name: "Fuggle", similarity: 5, notes: "Den klassiske partneren. Litt mer jordig, like god." },
      { name: "Styrian Goldings", similarity: 4, notes: "Slovensk variant av Fuggle. Mer delikat." },
      { name: "Challenger", similarity: 3, notes: "Mer krydder og bitterhet. Sterkere karakter." },
      { name: "Target", similarity: 2, notes: "Primært bitterhumle. Kun for tidlige addisjoner." },
    ],
  },
  "Fuggle": {
    profile: { name: "Fuggle", alpha: "3.5-5.5%", aroma: ["jordig", "trebark", "urter", "mild frukt"], origin: "England", category: "european" },
    substitutes: [
      { name: "East Kent Goldings", similarity: 5, notes: "Klassisk bytte. Mer honning og blomster." },
      { name: "Willamette", similarity: 4, notes: "Amerikansk klon av Fuggle. Nesten identisk." },
      { name: "Styrian Goldings", similarity: 4, notes: "Slovensk Fuggle-variant. Litt mer delikat." },
      { name: "Challenger", similarity: 3, notes: "Mer bitterhet, men lignende karakter." },
    ],
  },
  "Galaxy": {
    profile: { name: "Galaxy", alpha: "13-15%", aroma: ["pasjonsfrukt", "fersken", "sitrus", "tropisk"], origin: "Australia", category: "australian" },
    substitutes: [
      { name: "Vic Secret", similarity: 4, notes: "Mer ananas, lignende tropisk profil. Perfekt Aussie-bytte." },
      { name: "Citra", similarity: 4, notes: "Mer grapefrukt, mindre pasjon. Den vanligste erstatningen." },
      { name: "Nelson Sauvin", similarity: 3, notes: "Mer vin/druer. Unik, men i samme tropiske familie." },
      { name: "Mosaic", similarity: 3, notes: "Mer bær og urter. Fungerer, men annen karakter." },
    ],
  },
  "Vic Secret": {
    profile: { name: "Vic Secret", alpha: "14-17%", aroma: ["ananas", "furu", "pasjonsfrukt", "urter"], origin: "Australia", category: "australian" },
    substitutes: [
      { name: "Galaxy", similarity: 4, notes: "Mindre ananas, mer pasjon. Nærmeste australske bytte." },
      { name: "Citra", similarity: 3, notes: "Mer sitrus, mindre furu. Amerikaneren som funker." },
      { name: "Mosaic", similarity: 3, notes: "Mer bær, lignende kompleksitet. God allrounder." },
      { name: "Nelson Sauvin", similarity: 3, notes: "Mer vin-aktig. Spennende alternativ." },
    ],
  },
  "Nelson Sauvin": {
    profile: { name: "Nelson Sauvin", alpha: "12-13%", aroma: ["druer", "vin", "krusbær", "tropisk"], origin: "New Zealand", category: "other" },
    substitutes: [
      { name: "Galaxy", similarity: 3, notes: "Mer tropisk, mindre vin. Nærmeste i frukt-familien." },
      { name: "Vic Secret", similarity: 3, notes: "Mer ananas/furu. Tilsvarende intensitet." },
      { name: "Motueka", similarity: 3, notes: "Også fra NZ. Mer sitrus/lime, men lignende DNA." },
    ],
  },
  "Amarillo": {
    profile: { name: "Amarillo", alpha: "8-11%", aroma: ["appelsin", "blomster", "tropisk", "mango"], origin: "USA", category: "american" },
    substitutes: [
      { name: "Cascade", similarity: 4, notes: "Mer grapefrukt, mindre appelsin. Klassisk bytte." },
      { name: "Centennial", similarity: 3, notes: "Mer generell sitrus. Fungerer i de fleste oppskrifter." },
      { name: "Citra", similarity: 3, notes: "Mer intens tropisk. Overskygger kanskje resten." },
      { name: "Mandarina Bavaria", similarity: 3, notes: "Tysk med mandarin-aroma. Uvanlig men godt bytte." },
    ],
  },
  "Chinook": {
    profile: { name: "Chinook", alpha: "12-14%", aroma: ["furu", "krydder", "sitrus", "røyk"], origin: "USA", category: "american" },
    substitutes: [
      { name: "Columbus", similarity: 4, notes: "Nesten identisk bruk. Ren bitterhet og furu." },
      { name: "Simcoe", similarity: 3, notes: "Mer frukt, lignende furu-karakter." },
      { name: "Centennial", similarity: 3, notes: "Mildere, mer sitrus. For aroma-addisjoner." },
      { name: "Nugget", similarity: 3, notes: "Ren bitterhumle. Kun for 60-min addisjoner." },
    ],
  },
  "Hallertau Mittelfrüh": {
    profile: { name: "Hallertau Mittelfrüh", alpha: "3-5%", aroma: ["blomster", "krydder", "urter", "delikat"], origin: "Tyskland", category: "european" },
    substitutes: [
      { name: "Tettnang", similarity: 5, notes: "Nesten identisk. Beste erstatning for edel humle." },
      { name: "Saaz", similarity: 4, notes: "Mer krydder, like edel. Tsjekkisk versjon." },
      { name: "Hersbrucker", similarity: 4, notes: "Mildere og mer frukt. Fungerer i hveteøl." },
      { name: "Liberty", similarity: 3, notes: "Amerikansk Hallertau-klon. Tilsvarende profil." },
    ],
  },
  "Tettnang": {
    profile: { name: "Tettnang", alpha: "3.5-5.5%", aroma: ["krydder", "blomster", "urter", "delikat"], origin: "Tyskland", category: "european" },
    substitutes: [
      { name: "Saaz", similarity: 5, notes: "Nærmeste match. Tsjekkisk edel humle." },
      { name: "Hallertau Mittelfrüh", similarity: 5, notes: "Bayersk edel humle. Perfekt bytte." },
      { name: "Spalt", similarity: 4, notes: "Litt mer krydder. Fungerer i alle lager-stiler." },
      { name: "Hersbrucker", similarity: 3, notes: "Mildere profil. God for Kölsch og hveteøl." },
    ],
  },
};

export function getHopSubstitutes(hopName: string): { profile: HopProfile; substitutes: HopSubstitution[] } | null {
  return hops[hopName] ?? null;
}

export function getAllHopNames(): string[] {
  return Object.keys(hops).sort();
}
