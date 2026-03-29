import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import { SENSORY_MIRROR_SYSTEM_PROMPT } from "@/lib/ai-prompts";
import { rateLimit, getRateLimitKey } from "@/lib/rate-limit";

const MAX_FIELD_LENGTH = 500;

export async function POST(request: Request) {
  // Rate limit: 10 requests per minute per IP
  const key = `sensory:${getRateLimitKey(request)}`;
  const limit = rateLimit(key, 10, 60_000);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "For mange forespørsler. Vent litt og prøv igjen." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(limit.resetIn / 1000)) } },
    );
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "AI-tjenesten er ikke konfigurert." }, { status: 503 });
  }

  try {
    const body = await request.json();

    if (!body.offFlavor || typeof body.offFlavor !== "string") {
      return NextResponse.json({ error: "Bismak er påkrevd." }, { status: 400 });
    }

    const safe = (val: unknown, max = MAX_FIELD_LENGTH): string =>
      typeof val === "string" ? val.slice(0, max) : "";
    const safeNum = (val: unknown): number | null =>
      typeof val === "number" && isFinite(val) ? val : null;

    const dataParts: string[] = [];
    dataParts.push(`Bismak/problem: ${safe(body.offFlavor)}`);
    if (body.description) dataParts.push(`Beskrivelse: ${safe(body.description)}`);
    const og = safeNum(body.og);
    if (og !== null) dataParts.push(`OG: ${og}`);
    const fg = safeNum(body.fg);
    if (fg !== null) dataParts.push(`FG: ${fg}`);
    const mashTemp = safeNum(body.mashTemp);
    if (mashTemp !== null) dataParts.push(`Mesketemperatur: ${mashTemp}°C`);
    const fermentTemp = safeNum(body.fermentTemp);
    if (fermentTemp !== null) dataParts.push(`Gjæringstemperatur: ${fermentTemp}°C`);
    if (body.yeast) dataParts.push(`Gjærstamme: ${safe(body.yeast, 100)}`);
    if (body.grainBill) dataParts.push(`Maltbase: ${safe(body.grainBill, 200)}`);
    const ph = safeNum(body.ph);
    if (ph !== null) dataParts.push(`pH: ${ph}`);

    const userMessage = dataParts.join("\n");

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userMessage,
      config: {
        systemInstruction: SENSORY_MIRROR_SYSTEM_PROMPT,
      },
    });

    const text = response.text;
    if (!text) {
      return NextResponse.json({ error: "Ingen respons fra AI." }, { status: 500 });
    }

    return NextResponse.json({ analysis: text });
  } catch (error) {
    console.error("Sensory mirror error:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json(
      { error: "Kunne ikke analysere. Prøv igjen." },
      { status: 500 },
    );
  }
}
