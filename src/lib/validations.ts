import { z } from "zod";

// --- Fork ---
export const createForkSchema = z.object({
  name: z.string().min(1, "Navn er påkrevd").max(200),
  description: z.string().max(2000).nullable().optional(),
  parentSanityId: z.string().max(100).nullable().optional(),
  parentForkId: z.string().max(100).nullable().optional(),
  style: z.string().max(50).nullable().optional(),
  difficulty: z.enum(["nybegynner", "middels", "avansert"]).nullable().optional(),
  batchSize: z.number().positive().max(1000).default(20),
  grains: z.array(z.any()).default([]),
  hops: z.array(z.any()).default([]),
  yeast: z.any().default({}),
  additions: z.array(z.any()).default([]),
  process: z.array(z.any()).default([]),
  changeNotes: z.string().max(2000).nullable().optional(),
});

export const updateForkSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).nullable().optional(),
  style: z.string().max(50).nullable().optional(),
  difficulty: z.enum(["nybegynner", "middels", "avansert"]).nullable().optional(),
  batchSize: z.number().positive().max(1000).optional(),
  grains: z.array(z.any()).optional(),
  hops: z.array(z.any()).optional(),
  yeast: z.any().optional(),
  additions: z.array(z.any()).optional(),
  process: z.array(z.any()).optional(),
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

// --- Newsletter ---
export const newsletterSchema = z.object({
  email: z.string().email("Ugyldig e-postadresse"),
});
