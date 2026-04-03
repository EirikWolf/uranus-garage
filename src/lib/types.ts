import type { PortableTextBlock } from "@portabletext/types";

export type Difficulty = "nybegynner" | "middels" | "avansert";
export type BeerStatus = "planlagt" | "gjaerer" | "ferdig" | "arkivert";

export interface SanityImage {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
  };
}

export interface Brewer {
  _id: string;
  name: string;
  slug: { current: string };
  bio: string;
  image: SanityImage;
  role: string;
}

export interface Beer {
  _id: string;
  name: string;
  slug: { current: string };
  style: string;
  description: string;
  image: SanityImage;
  abv: number;
  ibu: number;
  srm: number;
  flavorTags: string[];
  difficulty: Difficulty;
  status: BeerStatus;
  recipe?: Recipe;
  brewLogs?: BrewLog[];
}

export interface Grain {
  name: string;
  amount: number;
  unit: "kg" | "g";
}

export interface Hop {
  name: string;
  amount: number;
  time: number;
  alphaAcid: number;
}

export interface Yeast {
  name: string;
  amount: string;
  type: string;
}

export interface Addition {
  name: string;
  amount: string;
  time: number;
}

export interface ProcessStep {
  step: string;
  description: string;
  temp: number;
  duration: number;
}

export interface WaterProfile {
  calcium?: number;
  magnesium?: number;
  sodium?: number;
  chloride?: number;
  sulfate?: number;
  bicarbonate?: number;
  ph?: number;
  notes?: string;
}

export interface FermentationStep {
  day: number;
  temp: number;
  description?: string;
}

export interface Recipe {
  _id: string;
  name: string;
  slug: { current: string };
  style: string;
  description: string;
  difficulty: Difficulty;
  batchSize: number;
  grains: Grain[];
  hops: Hop[];
  yeast: Yeast;
  additions: Addition[];
  process: ProcessStep[];
  waterProfile?: WaterProfile;
  fermentationProfile?: FermentationStep[];
  beer?: Beer;
  isClassic?: boolean;
  sourceAuthor?: string;
  sourceBook?: string;
  sourceUrl?: string;
  sourceNote?: string;
}

export interface BrewLog {
  _id: string;
  title: string;
  slug: { current: string };
  date: string;
  brewers: Brewer[];
  body: PortableTextBlock[];
  og: number;
  fg: number;
  tempNotes: string;
  beer?: Beer;
  recipe?: Recipe;
}

export type ArticleCategory = "akademiet" | "ravarefokus" | "diy";

export interface Article {
  _id: string;
  title: string;
  slug: { current: string };
  category: ArticleCategory;
  publishedAt: string;
  author?: Brewer;
  body: PortableTextBlock[];
  tags: string[];
  seoDescription: string;
  readTimeMinutes?: number;
}

export interface Measurement {
  timestamp: string;
  type: "temperature" | "gravity" | "ph";
  value: number;
  unit: string;
}

export interface BrewLabEntry {
  _id: string;
  brewLog: BrewLog;
  measurements: Measurement[];
}

// --- Brew Twin types ---

export interface YeastProfile {
  name: string;
  attenuation: number;       // 0.70-0.85 typical
  tempRangeLow: number;      // Celsius
  tempRangeHigh: number;     // Celsius
  tempOptimal: number;       // Celsius
  flocculationRate: number;  // 0-1, higher = faster clearing
  type: "ale" | "lager" | "wild";
}

export interface SimulationParams {
  og: number;
  fermentationTempC: number;
  yeast: YeastProfile;
  batchSizeLiters: number;
  pitchRateBillionCells: number;
}

export type FermentationPhase = "lag" | "aktiv" | "nedbremsing" | "ettermodning";

export interface SimulationPoint {
  hoursSinceStart: number;
  gravity: number;
  temperature: number;
  co2VolumeProduced: number;
  phase: FermentationPhase;
}

export interface FlavorFlag {
  compound: string;
  risk: "lav" | "middels" | "hoy";
  reason: string;
  recommendation: string;
}

export interface SimulationResult {
  params: SimulationParams;
  curve: SimulationPoint[];
  predictedFg: number;
  predictedAbv: number;
  durationHours: number;
  flavorFlags: FlavorFlag[];
}
