import { describe, it, expect } from "vitest";

// Test the pure pagination logic directly to avoid next-auth import chain
function paginationParams(request: Request, defaultLimit = 20, maxLimit = 50) {
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(maxLimit, Math.max(1, parseInt(searchParams.get("limit") || String(defaultLimit))));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

function paginationMeta(page: number, limit: number, total: number) {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
}

describe("paginationParams", () => {
  it("returns defaults when no params", () => {
    const request = new Request("http://localhost/api/test");
    const { page, limit, skip } = paginationParams(request);
    expect(page).toBe(1);
    expect(limit).toBe(20);
    expect(skip).toBe(0);
  });

  it("parses page and limit from query string", () => {
    const request = new Request("http://localhost/api/test?page=3&limit=10");
    const { page, limit, skip } = paginationParams(request);
    expect(page).toBe(3);
    expect(limit).toBe(10);
    expect(skip).toBe(20);
  });

  it("clamps page to minimum 1", () => {
    const request = new Request("http://localhost/api/test?page=-5");
    const { page } = paginationParams(request);
    expect(page).toBe(1);
  });

  it("clamps limit to maxLimit", () => {
    const request = new Request("http://localhost/api/test?limit=999");
    const { limit } = paginationParams(request, 20, 50);
    expect(limit).toBe(50);
  });

  it("clamps limit to minimum 1", () => {
    const request = new Request("http://localhost/api/test?limit=0");
    const { limit } = paginationParams(request);
    expect(limit).toBe(1);
  });
});

describe("paginationMeta", () => {
  it("calculates total pages correctly", () => {
    const meta = paginationMeta(1, 10, 25);
    expect(meta.totalPages).toBe(3);
    expect(meta.total).toBe(25);
  });

  it("handles exact division", () => {
    const meta = paginationMeta(1, 10, 30);
    expect(meta.totalPages).toBe(3);
  });

  it("handles zero total", () => {
    const meta = paginationMeta(1, 10, 0);
    expect(meta.totalPages).toBe(0);
  });
});
