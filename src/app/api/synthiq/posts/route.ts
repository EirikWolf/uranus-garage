import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * SynthIQ API — motta bryggeblogg-innlegg fra syntetiske brukere.
 *
 * Autentisering: Bearer-token i Authorization-header.
 * Token valideres mot env-variabelen SYNTHIQ_API_KEY.
 *
 * POST /api/synthiq/posts
 * Body (JSON):
 *   title        string   required  — tittel på innlegget
 *   body         string   required  — innholdstekst (markdown støttes)
 *   authorName   string   required  — visningsnavn på den syntetiske brukeren
 *   authorAvatar string?  optional  — URL til avatar-bilde
 *   brewDate     string?  optional  — ISO 8601-dato for brygging (f.eks. "2026-04-03")
 *   tags         string[] optional  — tagger, f.eks. ["IPA", "tørr-humle"]
 *   images       string[] optional  — liste med bilde-URLer
 *
 * Returnerer det opprettede innlegget (201) eller feilmelding.
 */
export async function POST(req: NextRequest) {
  // --- Autentisering ---
  const apiKey = process.env.SYNTHIQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "SYNTHIQ_API_KEY ikke konfigurert på serveren" }, { status: 500 });
  }

  const authHeader = req.headers.get("authorization") ?? "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  if (token !== apiKey) {
    return NextResponse.json({ error: "Ugyldig API-nøkkel" }, { status: 401 });
  }

  // --- Validering ---
  const body = await req.json();
  const { title, body: text, authorName, authorAvatar, brewDate, tags, images } = body;

  if (!title || typeof title !== "string" || title.trim().length < 2) {
    return NextResponse.json({ error: "title er påkrevd (min. 2 tegn)" }, { status: 400 });
  }
  if (!text || typeof text !== "string" || text.trim().length < 10) {
    return NextResponse.json({ error: "body er påkrevd (min. 10 tegn)" }, { status: 400 });
  }
  if (!authorName || typeof authorName !== "string") {
    return NextResponse.json({ error: "authorName er påkrevd" }, { status: 400 });
  }

  // --- Opprett innlegg ---
  const post = await prisma.brewPost.create({
    data: {
      title: title.trim(),
      body: text.trim(),
      authorName: authorName.trim(),
      authorAvatar: typeof authorAvatar === "string" ? authorAvatar : null,
      images: Array.isArray(images)
        ? images.filter((u: unknown) => typeof u === "string" && (u as string).startsWith("http"))
        : [],
      brewDate: brewDate ? new Date(brewDate) : null,
      tags: Array.isArray(tags)
        ? tags.filter((t: unknown) => typeof t === "string")
        : [],
      source: "synthiq",
    },
  });

  return NextResponse.json(post, { status: 201 });
}
