import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * SynthIQ API — motta bryggeblogg-innlegg fra syntetiske brukere.
 *
 * Autentisering: Bearer-token i Authorization-header.
 * Token valideres mot env-variabelen SYNTHIQ_API_KEY.
 *
 * Rate limiting: maks 1 innlegg per authorName per 6 timer.
 *
 * POST /api/synthiq/posts
 * Body (JSON):
 *   title        string   required  — tittel (maks 120 tegn)
 *   body         string   required  — innholdstekst (maks 4000 tegn)
 *   authorName   string   required  — visningsnavn på den syntetiske brukeren
 *   authorAvatar string?  optional  — URL til avatar-bilde
 *   brewDate     string?  optional  — ISO 8601-dato for brygging (f.eks. "2026-04-03")
 *   tags         string[] optional  — tagger, f.eks. ["IPA", "tørr-humle"] (maks 8)
 *   images       string[] optional  — liste med bilde-URLer (maks 6)
 */

const RATE_LIMIT_HOURS = 6;
const MAX_TITLE_LENGTH = 120;
const MAX_BODY_LENGTH = 4000;
const MAX_TAGS = 8;
const MAX_IMAGES = 6;

export async function POST(req: NextRequest) {
  // --- Autentisering ---
  const apiKey = process.env.SYNTHIQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "SYNTHIQ_API_KEY ikke konfigurert på serveren" },
      { status: 500 },
    );
  }

  const authHeader = req.headers.get("authorization") ?? "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  if (token !== apiKey) {
    return NextResponse.json({ error: "Ugyldig API-nøkkel" }, { status: 401 });
  }

  // --- Parse body ---
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Ugyldig JSON" }, { status: 400 });
  }

  const {
    title,
    body: text,
    authorName,
    authorAvatar,
    brewDate,
    tags,
    images,
  } = body as Record<string, unknown>;

  // --- Validering ---
  if (!title || typeof title !== "string" || title.trim().length < 2) {
    return NextResponse.json(
      { error: "title er påkrevd (min. 2 tegn)" },
      { status: 400 },
    );
  }
  if (title.length > MAX_TITLE_LENGTH) {
    return NextResponse.json(
      { error: `title er for lang (maks ${MAX_TITLE_LENGTH} tegn)` },
      { status: 400 },
    );
  }
  if (!text || typeof text !== "string" || text.trim().length < 10) {
    return NextResponse.json(
      { error: "body er påkrevd (min. 10 tegn)" },
      { status: 400 },
    );
  }
  if (text.length > MAX_BODY_LENGTH) {
    return NextResponse.json(
      { error: `body er for lang (maks ${MAX_BODY_LENGTH} tegn)` },
      { status: 400 },
    );
  }
  if (!authorName || typeof authorName !== "string" || !authorName.trim()) {
    return NextResponse.json(
      { error: "authorName er påkrevd" },
      { status: 400 },
    );
  }

  // --- Rate limiting: 1 innlegg per profil per RATE_LIMIT_HOURS ---
  const since = new Date(Date.now() - RATE_LIMIT_HOURS * 60 * 60 * 1000);
  const recentPost = await prisma.brewPost.findFirst({
    where: {
      authorName: authorName.trim(),
      source: "synthiq",
      createdAt: { gte: since },
    },
    select: { id: true, createdAt: true },
  });

  if (recentPost) {
    const nextAllowed = new Date(
      recentPost.createdAt.getTime() + RATE_LIMIT_HOURS * 60 * 60 * 1000,
    );
    return NextResponse.json(
      {
        error: `Rate limit: ${authorName} kan poste igjen etter ${nextAllowed.toISOString()}`,
        retryAfter: nextAllowed.toISOString(),
      },
      {
        status: 429,
        headers: { "Retry-After": String(Math.ceil((nextAllowed.getTime() - Date.now()) / 1000)) },
      },
    );
  }

  // --- Sanitering ---
  const cleanTags = Array.isArray(tags)
    ? (tags as unknown[])
        .filter((t): t is string => typeof t === "string" && t.trim().length > 0)
        .slice(0, MAX_TAGS)
    : [];

  const cleanImages = Array.isArray(images)
    ? (images as unknown[])
        .filter((u): u is string => typeof u === "string" && u.startsWith("http"))
        .slice(0, MAX_IMAGES)
    : [];

  // --- Opprett innlegg ---
  const post = await prisma.brewPost.create({
    data: {
      title: title.trim(),
      body: text.trim(),
      authorName: authorName.trim(),
      authorAvatar: typeof authorAvatar === "string" ? authorAvatar : null,
      images: cleanImages,
      brewDate: brewDate && typeof brewDate === "string" ? new Date(brewDate) : null,
      tags: cleanTags,
      source: "synthiq",
    },
  });

  return NextResponse.json(post, { status: 201 });
}
