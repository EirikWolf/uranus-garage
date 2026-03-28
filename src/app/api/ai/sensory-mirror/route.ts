import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import { SENSORY_MIRROR_SYSTEM_PROMPT } from "@/lib/ai-prompts";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

interface SensoryRequest {
  offFlavor: string;
  description: string;
  og?: number;
  fg?: number;
  mashTemp?: number;
  fermentTemp?: number;
  yeast?: string;
  grainBill?: string;
  ph?: number;
}

export async function POST(request: Request) {
  try {
    const body: SensoryRequest = await request.json();

    const dataParts: string[] = [];
    dataParts.push(`Bismak/problem: ${body.offFlavor}`);
    if (body.description) dataParts.push(`Beskrivelse: ${body.description}`);
    if (body.og) dataParts.push(`OG: ${body.og}`);
    if (body.fg) dataParts.push(`FG: ${body.fg}`);
    if (body.mashTemp) dataParts.push(`Mesketemperatur: ${body.mashTemp}°C`);
    if (body.fermentTemp) dataParts.push(`Gjæringstemperatur: ${body.fermentTemp}°C`);
    if (body.yeast) dataParts.push(`Gjærstamme: ${body.yeast}`);
    if (body.grainBill) dataParts.push(`Maltbase: ${body.grainBill}`);
    if (body.ph) dataParts.push(`pH: ${body.ph}`);

    const userMessage = dataParts.join("\n");

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userMessage,
      config: {
        systemInstruction: SENSORY_MIRROR_SYSTEM_PROMPT,
      },
    });

    const text = response.text;
    if (!text) {
      return NextResponse.json({ error: "No response from AI" }, { status: 500 });
    }

    return NextResponse.json({ analysis: text });
  } catch (error) {
    console.error("Sensory mirror error:", error);
    return NextResponse.json(
      { error: "Kunne ikke analysere. Prøv igjen." },
      { status: 500 },
    );
  }
}
