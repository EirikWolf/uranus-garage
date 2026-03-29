import { describe, it, expect } from "vitest";
import { rateLimit, getRateLimitKey } from "@/lib/rate-limit";

describe("rateLimit", () => {
  it("allows requests within limit", () => {
    const key = `test-allow-${Date.now()}`;
    const result = rateLimit(key, 5, 60_000);
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(4);
  });

  it("blocks requests over limit", () => {
    const key = `test-block-${Date.now()}`;
    for (let i = 0; i < 3; i++) {
      rateLimit(key, 3, 60_000);
    }
    const result = rateLimit(key, 3, 60_000);
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
    expect(result.resetIn).toBeGreaterThan(0);
  });

  it("resets after window expires", async () => {
    const key = `test-reset-${Date.now()}`;
    // Use a short window
    for (let i = 0; i < 3; i++) {
      rateLimit(key, 3, 50); // 50ms window
    }
    // Wait for window to expire
    await new Promise((resolve) => setTimeout(resolve, 60));
    const result = rateLimit(key, 3, 50);
    expect(result.allowed).toBe(true);
  });

  it("tracks remaining correctly", () => {
    const key = `test-remaining-${Date.now()}`;
    expect(rateLimit(key, 5, 60_000).remaining).toBe(4);
    expect(rateLimit(key, 5, 60_000).remaining).toBe(3);
    expect(rateLimit(key, 5, 60_000).remaining).toBe(2);
  });
});

describe("getRateLimitKey", () => {
  it("extracts IP from x-forwarded-for header", () => {
    const request = new Request("http://localhost", {
      headers: { "x-forwarded-for": "1.2.3.4, 5.6.7.8" },
    });
    expect(getRateLimitKey(request)).toBe("1.2.3.4");
  });

  it("returns 'unknown' when no forwarded header", () => {
    const request = new Request("http://localhost");
    expect(getRateLimitKey(request)).toBe("unknown");
  });
});
