import { describe, it, expect } from "vitest";
import {
  createForkSchema,
  updateForkSchema,
  createListingSchema,
  updateListingSchema,
  createSwapSchema,
  ratingSchema,
  newsletterSchema,
} from "@/lib/validations";

describe("createForkSchema", () => {
  it("accepts valid fork data", () => {
    const result = createForkSchema.safeParse({
      name: "My IPA Fork",
      grains: [{ name: "Maris Otter", amount: 5, unit: "kg" }],
      hops: [{ name: "Citra", amount: 30, time: 60, alphaAcid: 12 }],
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty name", () => {
    const result = createForkSchema.safeParse({ name: "" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid grain structure", () => {
    const result = createForkSchema.safeParse({
      name: "Test",
      grains: [{ name: "Malt", amount: "five", unit: "kg" }],
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid hop structure", () => {
    const result = createForkSchema.safeParse({
      name: "Test",
      hops: [{ name: "Citra", amount: 30, time: 60 }], // missing alphaAcid
    });
    expect(result.success).toBe(false);
  });

  it("rejects arbitrary JSON in grains (z.any replacement)", () => {
    const result = createForkSchema.safeParse({
      name: "Test",
      grains: [{ malicious: true, __proto__: "polluted" }],
    });
    expect(result.success).toBe(false);
  });

  it("rejects negative batch size", () => {
    const result = createForkSchema.safeParse({
      name: "Test",
      batchSize: -5,
    });
    expect(result.success).toBe(false);
  });

  it("defaults batchSize to 20", () => {
    const result = createForkSchema.safeParse({ name: "Test" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.batchSize).toBe(20);
    }
  });
});

describe("updateForkSchema", () => {
  it("accepts partial updates", () => {
    const result = updateForkSchema.safeParse({ name: "New Name" });
    expect(result.success).toBe(true);
  });

  it("validates OG range", () => {
    const tooLow = updateForkSchema.safeParse({ og: 0.5 });
    expect(tooLow.success).toBe(false);

    const tooHigh = updateForkSchema.safeParse({ og: 1.5 });
    expect(tooHigh.success).toBe(false);

    const valid = updateForkSchema.safeParse({ og: 1.055 });
    expect(valid.success).toBe(true);
  });

  it("validates FG range", () => {
    const valid = updateForkSchema.safeParse({ fg: 1.012 });
    expect(valid.success).toBe(true);
  });
});

describe("createListingSchema", () => {
  it("accepts valid listing", () => {
    const result = createListingSchema.safeParse({
      title: "Brukt gjæringsbøtte",
      description: "30L bøtte i god stand",
      type: "selger",
      location: "Oslo",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid type", () => {
    const result = createListingSchema.safeParse({
      title: "Test",
      description: "Test",
      type: "donerer",
      location: "Oslo",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing required fields", () => {
    const result = createListingSchema.safeParse({ title: "Test" });
    expect(result.success).toBe(false);
  });
});

describe("updateListingSchema", () => {
  it("accepts partial updates", () => {
    const result = updateListingSchema.safeParse({ title: "Ny tittel" });
    expect(result.success).toBe(true);
  });

  it("rejects unknown fields (prevents mass assignment)", () => {
    const result = updateListingSchema.safeParse({
      title: "Test",
      userId: "hijacked-user-id",
    });
    // Zod strips unknown keys by default, so parsed.data won't contain userId
    expect(result.success).toBe(true);
    if (result.success) {
      expect("userId" in result.data).toBe(false);
    }
  });

  it("allows toggling isActive", () => {
    const result = updateListingSchema.safeParse({ isActive: false });
    expect(result.success).toBe(true);
  });
});

describe("createSwapSchema", () => {
  it("accepts valid swap", () => {
    const futureDate = new Date(Date.now() + 86400000).toISOString();
    const result = createSwapSchema.safeParse({
      title: "IPA Swap",
      totalLiters: 60,
      portionSize: 5,
      maxParticipants: 6,
      brewDate: futureDate,
      location: "Bergen",
    });
    expect(result.success).toBe(true);
  });

  it("rejects past brew date", () => {
    const result = createSwapSchema.safeParse({
      title: "IPA Swap",
      totalLiters: 60,
      portionSize: 5,
      maxParticipants: 6,
      brewDate: "2020-01-01T00:00:00Z",
      location: "Bergen",
    });
    expect(result.success).toBe(false);
  });
});

describe("ratingSchema", () => {
  it("accepts valid rating 1-5", () => {
    expect(ratingSchema.safeParse({ value: 1 }).success).toBe(true);
    expect(ratingSchema.safeParse({ value: 5 }).success).toBe(true);
  });

  it("rejects out-of-range ratings", () => {
    expect(ratingSchema.safeParse({ value: 0 }).success).toBe(false);
    expect(ratingSchema.safeParse({ value: 6 }).success).toBe(false);
  });

  it("rejects non-integer ratings", () => {
    expect(ratingSchema.safeParse({ value: 3.5 }).success).toBe(false);
  });
});

describe("newsletterSchema", () => {
  it("accepts valid email", () => {
    expect(newsletterSchema.safeParse({ email: "test@example.com" }).success).toBe(true);
  });

  it("rejects invalid email", () => {
    expect(newsletterSchema.safeParse({ email: "not-an-email" }).success).toBe(false);
  });
});
