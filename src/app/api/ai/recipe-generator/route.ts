import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import { RECIPE_GENERATOR_SYSTEM_PROMPT } from "@/lib/ai-prompts";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

interface RecipeRequest {
  prompt?: string;
  style?: string;
  abvTarget?: string;
  batchSize?: number;
  flavorProfile?: string;
}

export async function POST(request: Request) {
  try {
    const body: RecipeRequest = await request.json();

    let userMessage: string;
    if (body.prompt) {
      userMessage = body.prompt;
    } else {
      const parts: string[] = [];
      if (body.style) parts.push(`Stil: ${body.style}`);
      if (body.abvTarget) parts.push(`ABV-mål: ${body.abvTarget}`);
      if (body.batchSize) parts.push(`Batchstørrelse: ${body.batchSize} liter`);
      if (body.flavorProfile) parts.push(`Smaksprofil: ${body.flavorProfile}`);
      userMessage = parts.length > 0
        ? `Lag en oppskrift med disse parameterne:\n${parts.join("\n")}`
        : "Lag en god og interessant øloppskrift.";
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userMessage,
      config: {
        systemInstruction: RECIPE_GENERATOR_SYSTEM_PROMPT,
      },
    });

    const text = response.text;
    if (!text) {
      return NextResponse.json({ error: "No response from AI" }, { status: 500 });
    }

    // Parse JSON from response — strip any markdown code fences if present
    const cleanJson = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const recipe = JSON.parse(cleanJson);
    return NextResponse.json({ recipe });
  } catch (error) {
    console.error("Recipe generator error:", error);
    return NextResponse.json(
      { error: "Kunne ikke generere oppskrift. Prøv igjen." },
      { status: 500 },
    );
  }
}
