import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import { RECIPE_GENERATOR_SYSTEM_PROMPT } from "@/lib/ai-prompts";
import { rateLimit, getRateLimitKey } from "@/lib/rate-limit";

const MAX_PROMPT_LENGTH = 2000;

export async function POST(request: Request) {
  // Rate limit: 10 requests per minute per IP
  const key = `recipe-gen:${getRateLimitKey(request)}`;
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

    let userMessage: string;
    if (body.prompt) {
      if (typeof body.prompt !== "string" || body.prompt.length > MAX_PROMPT_LENGTH) {
        return NextResponse.json(
          { error: `Prompt kan ikke være lengre enn ${MAX_PROMPT_LENGTH} tegn.` },
          { status: 400 },
        );
      }
      userMessage = body.prompt;
    } else {
      const parts: string[] = [];
      if (body.style) parts.push(`Stil: ${String(body.style).slice(0, 50)}`);
      if (body.abvTarget) parts.push(`ABV-mål: ${String(body.abvTarget).slice(0, 20)}`);
      if (body.batchSize) parts.push(`Batchstørrelse: ${Number(body.batchSize) || 20} liter`);
      if (body.flavorProfile) parts.push(`Smaksprofil: ${String(body.flavorProfile).slice(0, 200)}`);
      userMessage = parts.length > 0
        ? `Lag en oppskrift med disse parameterne:\n${parts.join("\n")}`
        : "Lag en god og interessant øloppskrift.";
    }

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userMessage,
      config: {
        systemInstruction: RECIPE_GENERATOR_SYSTEM_PROMPT,
      },
    });

    const text = response.text;
    if (!text) {
      return NextResponse.json({ error: "Ingen respons fra AI." }, { status: 500 });
    }

    const cleanJson = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const recipe = JSON.parse(cleanJson);
    return NextResponse.json({ recipe });
  } catch (error) {
    console.error("Recipe generator error:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json(
      { error: "Kunne ikke generere oppskrift. Prøv igjen." },
      { status: 500 },
    );
  }
}
