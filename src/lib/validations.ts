import { z } from "zod";

// --- Shared ingredient schemas ---
const grainSchema = z.object({
  name: z.string().max(200),
  amount: z.number().nonnegative().max(10_000),
  unit: z.enum(["kg", "g"]),
});

const hopSchema = z.object({
  name: z.string().max(200),
  amount: z.number().nonnegative().max(100_000),
  time: z.number().min(-1).max(10_080),
  alphaAcid: z.number().nonnegative().max(100),
});

const yeastSchema = z.object({
  name: z.string().max(200),
  amount: z.string().max(100),
  type: z.string().max(100),
}).partial().default({});

const additionSchema = z.object({
  name: z.string().max(200),
  amount: z.string().max(100),
  time: z.number().min(-1).max(10_080),
});

const processStepSchema = z.object({
  step: z.string().max(200),
  description: z.string().max(2000),
  temp: z.number().min(-20).max(200),
  duration: z.number().nonnegative().max(100_000),
});

// --- Fork ---
export const createForkSchema = z.object({
  name: z.string().min(1, "Navn er påkrevd").max(200),
  description: z.string().max(2000).nullable().optional(),
  parentSanityId: z.string().max(100).nullable().optional(),
  parentForkId: z.string().max(100).nullable().optional(),
  style: z.string().max(50).nullable().optional(),
  difficulty: z.enum(["nybegynner", "middels", "avansert"]).nullable().optional(),
  batchSize: z.number().positive().max(1000).default(20),
  grains: z.array(grainSchema).default([]),
  hops: z.array(hopSchema).default([]),
  yeast: yeastSchema,
  additions: z.array(additionSchema).default([]),
  process: z.array(processStepSchema).default([]),
  changeNotes: z.string().max(2000).nullable().optional(),
});

export const updateForkSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).nullable().optional(),
  style: z.string().max(50).nullable().optional(),
  difficulty: z.enum(["nybegynner", "middels", "avansert"]).nullable().optional(),
  batchSize: z.number().positive().max(1000).optional(),
  grains: z.array(grainSchema).optional(),
  hops: z.array(hopSchema).optional(),
  yeast: yeastSchema.optional(),
  additions: z.array(additionSchema).optional(),
  process: z.array(processStepSchema).optional(),
  changeNotes: z.string().max(2000).nullable().optional(),
  brewDate: z.string().nullable().optional(),
  og: z.number().min(0.99).max(1.2).nullable().optional(),
  fg: z.number().min(0.99).max(1.1).nullable().optional(),
  tastingNotes: z.string().max(5000).nullable().optional(),
  isPublic: z.boolean().optional(),
});

export const ratingSchema = z.object({
  value: z.number().int().min(1).max(5),
  comment: z.string().max(1000).nullable().optional(),
});

// --- Listing ---
export const createListingSchema = z.object({
  title: z.string().min(1, "Tittel er påkrevd").max(200),
  description: z.string().min(1, "Beskrivelse er påkrevd").max(5000),
  type: z.enum(["selger", "kjoper", "bytter"]),
  price: z.string().max(50).nullable().optional(),
  location: z.string().min(1, "Lokasjon er påkrevd").max(100),
});

// --- Brew Swap ---
export const createSwapSchema = z.object({
  title: z.string().min(1, "Tittel er påkrevd").max(200),
  description: z.string().max(5000).default(""),
  baseRecipe: z.string().max(5000).nullable().optional(),
  totalLiters: z.coerce.number().positive("Må være positivt").max(1000),
  portionSize: z.coerce.number().positive("Må være positivt").max(200),
  maxParticipants: z.coerce.number().int().positive().max(50),
  brewDate: z.string().refine((d) => new Date(d) > new Date(), {
    message: "Bryggedato må være i fremtiden",
  }),
  location: z.string().min(1, "Lokasjon er påkrevd").max(100),
});

export const joinSwapSchema = z.object({
  plan: z.string().max(2000).nullable().optional(),
});

// --- Listing update ---
export const updateListingSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().min(1).max(5000).optional(),
  type: z.enum(["selger", "kjoper", "bytter"]).optional(),
  price: z.string().max(50).nullable().optional(),
  location: z.string().min(1).max(100).optional(),
  isActive: z.boolean().optional(),
});

// --- Simulation (Brew Twin) ---
const yeastProfileSchema = z.object({
  name: z.string().max(200),
  attenuation: z.number().min(0.5).max(1),
  tempRangeLow: z.number().min(-5).max(50),
  tempRangeHigh: z.number().min(-5).max(50),
  tempOptimal: z.number().min(-5).max(50),
  flocculationRate: z.number().min(0).max(1),
  type: z.enum(["ale", "lager", "wild"]),
});

export const createSimulationSchema = z.object({
  name: z.string().min(1, "Navn er påkrevd").max(200),
  forkId: z.string().max(100).nullable().optional(),
  brewLogSanityId: z.string().max(100).nullable().optional(),
  og: z.number().min(1.01).max(1.2),
  fermentationTempC: z.number().min(-5).max(50),
  yeast: yeastProfileSchema,
  batchSizeLiters: z.number().positive().max(1000),
  pitchRateBillionCells: z.number().positive().max(10000),
});

export const updateSimulationSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  og: z.number().min(1.01).max(1.2).optional(),
  fermentationTempC: z.number().min(-5).max(50).optional(),
  yeast: yeastProfileSchema.optional(),
  batchSizeLiters: z.number().positive().max(1000).optional(),
  pitchRateBillionCells: z.number().positive().max(10000).optional(),
  isPublic: z.boolean().optional(),
});

// --- Newsletter ---
export const newsletterSchema = z.object({
  email: z.string().email("Ugyldig e-postadresse"),
});
