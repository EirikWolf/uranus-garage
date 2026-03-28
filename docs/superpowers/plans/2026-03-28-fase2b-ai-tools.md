# Fase 2B: AI-verktøy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add AI-powered brewing tools — a recipe generator and a sensory/flavor troubleshooter (Sensory AI Mirror) — both using the Claude API via Next.js API routes.

**Architecture:** Two API routes call Claude API with specialized system prompts. Frontend components stream responses. The recipe generator accepts freetext or structured parameters and returns a formatted recipe. The Sensory AI Mirror accepts measurements + off-flavor descriptions and returns diagnosis + recommendations.

**Tech Stack:** TypeScript, @anthropic-ai/sdk, Next.js API routes (streaming), React, Tailwind CSS

**Spec:** `docs/superpowers/specs/2026-03-28-fase2-design.md`

---

## File Structure

```
src/
├── lib/
│   └── ai-prompts.ts              # System prompts for both AI tools
├── app/
│   ├── api/
│   │   └── ai/
│   │       ├── recipe-generator/
│   │       │   └── route.ts        # Claude API route for recipe generation
│   │       └── sensory-mirror/
│   │           └── route.ts        # Claude API route for flavor troubleshooting
│   └── verktoy/
│       ├── oppskriftsgenerator/
│       │   └── page.tsx            # Recipe generator page
│       └── smaksassistent/
│           └── page.tsx            # Sensory AI Mirror page
├── components/
│   ├── ai/
│   │   ├── recipe-generator-form.tsx   # Input form for recipe generator
│   │   ├── recipe-result.tsx           # Display generated recipe
│   │   ├── sensory-mirror-form.tsx     # Input form for sensory mirror
│   │   └── sensory-result.tsx          # Display diagnosis
│   └── navigation.tsx              # Modified: remove "coming soon" from tools
```

---

## Task 1: Install Anthropic SDK + Environment Setup

**Files:**
- Modify: `package.json` (via npm install)
- Modify: `.env.local.example`

- [ ] **Step 1: Install Anthropic SDK**

```bash
cd /c/dev/uranus-garage
npm install @anthropic-ai/sdk
```

- [ ] **Step 2: Add API key to .env.local.example**

Read `.env.local.example` and add:

```
# Claude API
ANTHROPIC_API_KEY=your_anthropic_api_key
```

- [ ] **Step 3: Commit**

```bash
cd /c/dev/uranus-garage
git add package.json package-lock.json .env.local.example
git commit -m "chore: add Anthropic SDK dependency"
```

Note: The user must add their actual `ANTHROPIC_API_KEY` to `.env.local`. The API routes will fail without it — this is expected.

---

## Task 2: AI System Prompts

**Files:**
- Create: `src/lib/ai-prompts.ts`

- [ ] **Step 1: Create system prompts file**

Create `src/lib/ai-prompts.ts`:

```typescript
export const RECIPE_GENERATOR_SYSTEM_PROMPT = `Du er en erfaren hjemmebrygger og oppskriftsdesigner for Uranus Garage, et norsk hjemmebryggeri.

Når du får en forespørsel om å lage en øloppskrift, generer en komplett oppskrift i følgende JSON-format:

{
  "name": "Oppskriftsnavn",
  "style": "Ølstil",
  "description": "Kort beskrivelse av ølet",
  "difficulty": "nybegynner" | "middels" | "avansert",
  "batchSize": tall i liter,
  "estimatedOG": tall (f.eks. 1.055),
  "estimatedFG": tall (f.eks. 1.012),
  "estimatedABV": tall i prosent,
  "estimatedIBU": tall,
  "estimatedSRM": tall,
  "grains": [
    { "name": "Maltnavn", "amount": tall, "unit": "kg" | "g" }
  ],
  "hops": [
    { "name": "Humlenavn", "amount": tall i gram, "time": tall i minutter (-1 for dry hop), "alphaAcid": tall i prosent }
  ],
  "yeast": { "name": "Gjærnavn", "amount": "mengde", "type": "Tørrgjær" | "Flytende gjær" },
  "additions": [
    { "name": "Tilsetning", "amount": "mengde med enhet", "time": tall i minutter }
  ],
  "process": [
    { "step": "Stegnavn", "description": "Beskrivelse", "temp": tall i celsius, "duration": tall i minutter }
  ],
  "tips": "Valgfrie tips til bryggeren"
}

Regler:
- Svar ALLTID med gyldig JSON, ingen annen tekst
- Bruk realistiske ingredienser tilgjengelig i Norge/Skandinavia
- Inkluder alltid mesking, koking, gjæring, og eventuelt dry hop som prosess-steg
- Batchstørrelse default til 20 liter med mindre brukeren spesifiserer annet
- Vanskelighetsgrad: nybegynner for kit/enkle brygg, middels for standard all-grain, avansert for vannjustering/trykkfermentering
- Gi norske stegnavn i prosessen`;

export const SENSORY_MIRROR_SYSTEM_PROMPT = `Du er en erfaren bryggetekniker og sensorisk analytiker for Uranus Garage, et norsk hjemmebryggeri. Du hjelper hjemmebryggere med å identifisere og løse smaksproblemer i ølet deres.

Du har dyp kunnskap om:
- Off-flavors og deres kjemiske årsaker (diacetyl, acetaldehyd, DMS, fenolisk, oksidert, osv.)
- Gjæringsproblemer (under/over-pitching, temperaturkontroll, autolysis)
- Meskeproblemer (pH, temperatur, tanninekstraksjon)
- Infeksjoner og kontaminering
- Vannkjemi og dens påvirkning på smak
- Humle- og maltrelaterte off-flavors

Når en brygger beskriver et problem:

1. IDENTIFISER den mest sannsynlige off-flavoren basert på beskrivelsen
2. FORKLAR den kjemiske/biologiske årsaken kort og forståelig
3. ANALYSER bryggeprosess-dataene de har oppgitt for å finne den spesifikke årsaken i DERES brygg
4. GI 2-3 konkrete, prioriterte anbefalinger for neste brygg
5. Nevn om det finnes en rask fiks for dette brygget (f.eks. diacetyl-rast, kald lagring)

Svar på norsk. Vær spesifikk og praktisk — ikke generell. Referer til deres konkrete data når mulig.

Vanlige off-flavors og årsaker:
- Diacetyl (smør/butterscotch): For lav gjæringstemperatur, for tidlig tapping, utilstrekkelig gjær
- Acetaldehyd (grønt eple): Umoden øl, for tidlig tapping, utilstrekkelig gjær
- DMS (kokt mais/grønnsak): Utilstrekkelig koketid, langsom avkjøling, pilsnermalt uten lang nok kok
- Fenolisk (medisinsk/plastaktig): Villgjær, klorinert vann, overknust malt
- Oksidert (papp/sherry): Oksygeneksponering etter gjæring, for varmt lagring
- Astringent (tannin): For høy mesketemperatur, for mye skylling, knust korn
- Eddiksyre (eddik): Acetobacter-infeksjon, oksygeneksponering
- Løsemiddel (fusel): For høy gjæringstemperatur, underpitching
- Svovel (egg): Lagergjær (normalt), stresset gjær, autolysis
- Metallisk: Vann med høyt jerninnhold, utstyr av dårlig kvalitet

Svar i følgende format:

## Diagnose: [Off-flavor navn]

**Sannsynlig årsak:** [kort forklaring]

**Basert på dine data:** [spesifikk analyse av deres bryggeprosess]

**Anbefalinger for neste brygg:**
1. [Mest viktige endring]
2. [Andre viktige endring]
3. [Eventuell tredje anbefaling]

**Kan dette brygget reddes?** [Ja/nei med forklaring]`;
```

- [ ] **Step 2: Run typecheck**

```bash
cd /c/dev/uranus-garage && npm run typecheck
```

- [ ] **Step 3: Commit**

```bash
cd /c/dev/uranus-garage
git add src/lib/ai-prompts.ts
git commit -m "feat: add AI system prompts for recipe generator and sensory mirror"
```

---

## Task 3: API Routes for AI Tools

**Files:**
- Create: `src/app/api/ai/recipe-generator/route.ts`
- Create: `src/app/api/ai/sensory-mirror/route.ts`

- [ ] **Step 1: Create recipe generator API route**

Create `src/app/api/ai/recipe-generator/route.ts`:

```typescript
import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { RECIPE_GENERATOR_SYSTEM_PROMPT } from "@/lib/ai-prompts";

const anthropic = new Anthropic();

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

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2048,
      system: RECIPE_GENERATOR_SYSTEM_PROMPT,
      messages: [{ role: "user", content: userMessage }],
    });

    const textBlock = message.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      return NextResponse.json({ error: "No response from AI" }, { status: 500 });
    }

    const recipe = JSON.parse(textBlock.text);
    return NextResponse.json({ recipe });
  } catch (error) {
    console.error("Recipe generator error:", error);
    return NextResponse.json(
      { error: "Kunne ikke generere oppskrift. Prøv igjen." },
      { status: 500 },
    );
  }
}
```

- [ ] **Step 2: Create sensory mirror API route**

Create `src/app/api/ai/sensory-mirror/route.ts`:

```typescript
import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { SENSORY_MIRROR_SYSTEM_PROMPT } from "@/lib/ai-prompts";

const anthropic = new Anthropic();

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

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
      system: SENSORY_MIRROR_SYSTEM_PROMPT,
      messages: [{ role: "user", content: userMessage }],
    });

    const textBlock = message.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      return NextResponse.json({ error: "No response from AI" }, { status: 500 });
    }

    return NextResponse.json({ analysis: textBlock.text });
  } catch (error) {
    console.error("Sensory mirror error:", error);
    return NextResponse.json(
      { error: "Kunne ikke analysere. Prøv igjen." },
      { status: 500 },
    );
  }
}
```

- [ ] **Step 3: Run typecheck**

```bash
cd /c/dev/uranus-garage && npm run typecheck
```

- [ ] **Step 4: Commit**

```bash
cd /c/dev/uranus-garage
git add src/app/api/ai/
git commit -m "feat: add API routes for AI recipe generator and sensory mirror"
```

---

## Task 4: Recipe Generator UI

**Files:**
- Create: `src/components/ai/recipe-generator-form.tsx`
- Create: `src/components/ai/recipe-result.tsx`
- Create: `src/app/verktoy/oppskriftsgenerator/page.tsx`

- [ ] **Step 1: Create recipe result display component**

Create `src/components/ai/recipe-result.tsx`:

```tsx
import { Card, CardContent } from "@/components/ui/card";

interface GeneratedRecipe {
  name: string;
  style: string;
  description: string;
  difficulty: string;
  batchSize: number;
  estimatedOG: number;
  estimatedFG: number;
  estimatedABV: number;
  estimatedIBU: number;
  estimatedSRM: number;
  grains: { name: string; amount: number; unit: string }[];
  hops: { name: string; amount: number; time: number; alphaAcid: number }[];
  yeast: { name: string; amount: string; type: string };
  additions: { name: string; amount: string; time: number }[];
  process: { step: string; description: string; temp: number; duration: number }[];
  tips?: string;
}

export function RecipeResult({ recipe }: { recipe: GeneratedRecipe }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">{recipe.name}</h2>
        <p className="text-muted-foreground">{recipe.style} — {recipe.batchSize}L</p>
        <p className="mt-2">{recipe.description}</p>
      </div>

      <div className="grid grid-cols-5 gap-3">
        {[
          { label: "OG", value: recipe.estimatedOG },
          { label: "FG", value: recipe.estimatedFG },
          { label: "ABV", value: `${recipe.estimatedABV}%` },
          { label: "IBU", value: recipe.estimatedIBU },
          { label: "SRM", value: recipe.estimatedSRM },
        ].map((stat) => (
          <div key={stat.label} className="bg-background rounded-lg p-3 text-center border border-border">
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className="text-lg font-bold text-primary">{stat.value}</p>
          </div>
        ))}
      </div>

      {recipe.grains.length > 0 && (
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-3">Malt</h3>
            <div className="space-y-2">
              {recipe.grains.map((g, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span>{g.name}</span>
                  <span className="text-primary font-mono">{g.amount} {g.unit}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {recipe.hops.length > 0 && (
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-3">Humle</h3>
            <div className="space-y-2">
              {recipe.hops.map((h, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span>{h.name} <span className="text-muted-foreground">({h.alphaAcid}% AA)</span></span>
                  <span className="text-primary font-mono">{h.amount}g @ {h.time === -1 ? "dry hop" : `${h.time} min`}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {recipe.yeast && (
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-3">Gjær</h3>
            <p className="text-sm">{recipe.yeast.name} — {recipe.yeast.amount} ({recipe.yeast.type})</p>
          </CardContent>
        </Card>
      )}

      {recipe.process.length > 0 && (
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-3">Prosess</h3>
            <div className="space-y-3">
              {recipe.process.map((step, i) => (
                <div key={i} className="flex gap-3">
                  <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-medium text-sm">{step.step} <span className="text-muted-foreground">({step.temp}°C, {step.duration} min)</span></p>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {recipe.tips && (
        <Card className="bg-card border-border border-l-4 border-l-primary">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-2">Tips</h3>
            <p className="text-sm text-muted-foreground">{recipe.tips}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Create recipe generator form**

Create `src/components/ai/recipe-generator-form.tsx`:

```tsx
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Loader2 } from "lucide-react";
import { RecipeResult } from "./recipe-result";

const STYLE_OPTIONS = [
  "IPA", "Pale Ale", "Stout", "Porter", "Lager", "Pilsner",
  "Wheat", "Sour", "Belgian", "Brown Ale", "Red Ale", "Saison", "ESB",
];

export function RecipeGeneratorForm() {
  const [mode, setMode] = useState<"freetext" | "params">("freetext");
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("");
  const [abvTarget, setAbvTarget] = useState("");
  const [batchSize, setBatchSize] = useState("20");
  const [flavorProfile, setFlavorProfile] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<any>(null);

  async function handleGenerate() {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const body = mode === "freetext"
        ? { prompt }
        : { style, abvTarget, batchSize: parseInt(batchSize), flavorProfile };

      const res = await fetch("/api/ai/recipe-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Noe gikk galt");
      }

      const data = await res.json();
      setResult(data.recipe);
    } catch (err: any) {
      setError(err.message || "Kunne ikke generere oppskrift.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Mode toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setMode("freetext")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            mode === "freetext" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
          }`}
        >
          Fritekst
        </button>
        <button
          onClick={() => setMode("params")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            mode === "params" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
          }`}
        >
          Parametere
        </button>
      </div>

      <Card className="bg-card border-border">
        <CardContent className="pt-6">
          {mode === "freetext" ? (
            <div>
              <label className="text-sm font-medium mb-2 block">Beskriv ølet du vil brygge</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="F.eks: Lag en frisk session IPA med tropisk humlekarakter, lav bitterhet, og ca 4.5% ABV. Batchstørrelse 20 liter."
                rows={4}
                className="w-full bg-secondary border border-border rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground">Stil</label>
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  className="w-full bg-secondary border border-border rounded-lg p-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Velg stil...</option>
                  {STYLE_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">ABV-mål</label>
                <Input
                  placeholder="F.eks: 4.5-5.5%"
                  value={abvTarget}
                  onChange={(e) => setAbvTarget(e.target.value)}
                  className="bg-secondary border-border mt-1"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Batchstørrelse (L)</label>
                <Input
                  type="number"
                  value={batchSize}
                  onChange={(e) => setBatchSize(e.target.value)}
                  className="bg-secondary border-border mt-1"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Smaksprofil</label>
                <Input
                  placeholder="F.eks: tropisk, sitrus, malt"
                  value={flavorProfile}
                  onChange={(e) => setFlavorProfile(e.target.value)}
                  className="bg-secondary border-border mt-1"
                />
              </div>
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={loading || (mode === "freetext" && !prompt.trim())}
            className="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Genererer...</>
            ) : (
              <><Sparkles className="h-4 w-4" /> Generer oppskrift</>
            )}
          </button>
        </CardContent>
      </Card>

      {error && (
        <p className="text-red-400 text-sm">{error}</p>
      )}

      {result && <RecipeResult recipe={result} />}
    </div>
  );
}
```

- [ ] **Step 3: Create recipe generator page**

Create `src/app/verktoy/oppskriftsgenerator/page.tsx`:

```tsx
import { RecipeGeneratorForm } from "@/components/ai/recipe-generator-form";

export const metadata = {
  title: "AI Oppskriftsgenerator — Uranus Garage",
  description: "Generer øloppskrifter med kunstig intelligens.",
};

export default function RecipeGeneratorPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">AI Oppskriftsgenerator</h1>
      <p className="text-muted-foreground mb-8">
        Beskriv ølet du drømmer om, så lager AI-en en komplett oppskrift for deg.
      </p>
      <RecipeGeneratorForm />
    </div>
  );
}
```

- [ ] **Step 4: Run typecheck**

```bash
cd /c/dev/uranus-garage && npm run typecheck
```

- [ ] **Step 5: Commit**

```bash
cd /c/dev/uranus-garage
git add src/components/ai/recipe-generator-form.tsx src/components/ai/recipe-result.tsx src/app/verktoy/oppskriftsgenerator/
git commit -m "feat: add AI recipe generator with form and result display"
```

---

## Task 5: Sensory AI Mirror UI

**Files:**
- Create: `src/components/ai/sensory-mirror-form.tsx`
- Create: `src/components/ai/sensory-result.tsx`
- Create: `src/app/verktoy/smaksassistent/page.tsx`

- [ ] **Step 1: Create sensory result display**

Create `src/components/ai/sensory-result.tsx`:

```tsx
interface SensoryResultProps {
  analysis: string;
}

export function SensoryResult({ analysis }: SensoryResultProps) {
  // Parse markdown-like headings and format
  const sections = analysis.split("\n").map((line, i) => {
    if (line.startsWith("## ")) {
      return <h2 key={i} className="text-xl font-bold mt-6 mb-2 text-primary">{line.replace("## ", "")}</h2>;
    }
    if (line.startsWith("**") && line.endsWith("**")) {
      return <p key={i} className="font-semibold mt-4 mb-1">{line.replace(/\*\*/g, "")}</p>;
    }
    if (line.startsWith("- ") || line.startsWith("* ")) {
      return <li key={i} className="ml-4 text-sm text-muted-foreground">{line.replace(/^[-*] /, "")}</li>;
    }
    if (line.match(/^\d+\. /)) {
      return <li key={i} className="ml-4 text-sm list-decimal">{line.replace(/^\d+\. /, "")}</li>;
    }
    if (line.trim() === "") {
      return <br key={i} />;
    }
    return <p key={i} className="text-sm leading-relaxed">{line}</p>;
  });

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      {sections}
    </div>
  );
}
```

- [ ] **Step 2: Create sensory mirror form**

Create `src/components/ai/sensory-mirror-form.tsx`:

```tsx
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Stethoscope, Loader2 } from "lucide-react";
import { SensoryResult } from "./sensory-result";

const OFF_FLAVORS = [
  { value: "diacetyl", label: "Smør / Butterscotch (Diacetyl)" },
  { value: "acetaldehyd", label: "Grønt eple (Acetaldehyd)" },
  { value: "dms", label: "Kokt mais (DMS)" },
  { value: "fenolisk", label: "Medisinsk / Plastaktig (Fenolisk)" },
  { value: "oksidert", label: "Våt papp / Sherry (Oksidert)" },
  { value: "astringent", label: "Astringent / Tørt (Tannin)" },
  { value: "eddik", label: "Eddik / Sur (Eddiksyre)" },
  { value: "losemiddel", label: "Løsemiddel / Sterk alkohol (Fusel)" },
  { value: "svovel", label: "Svovel / Egg" },
  { value: "metallisk", label: "Metallisk" },
  { value: "annet", label: "Annet..." },
];

export function SensoryMirrorForm() {
  const [offFlavor, setOffFlavor] = useState("");
  const [description, setDescription] = useState("");
  const [og, setOg] = useState("");
  const [fg, setFg] = useState("");
  const [mashTemp, setMashTemp] = useState("");
  const [fermentTemp, setFermentTemp] = useState("");
  const [yeast, setYeast] = useState("");
  const [grainBill, setGrainBill] = useState("");
  const [ph, setPh] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<string | null>(null);

  async function handleAnalyze() {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const body: Record<string, any> = { offFlavor, description };
      if (og) body.og = parseFloat(og);
      if (fg) body.fg = parseFloat(fg);
      if (mashTemp) body.mashTemp = parseFloat(mashTemp);
      if (fermentTemp) body.fermentTemp = parseFloat(fermentTemp);
      if (yeast) body.yeast = yeast;
      if (grainBill) body.grainBill = grainBill;
      if (ph) body.ph = parseFloat(ph);

      const res = await fetch("/api/ai/sensory-mirror", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Noe gikk galt");
      }

      const data = await res.json();
      setResult(data.analysis);
    } catch (err: any) {
      setError(err.message || "Kunne ikke analysere.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card className="bg-card border-border">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-4">Hva smaker galt?</h3>

          <div className="mb-4">
            <label className="text-xs text-muted-foreground mb-2 block">Velg bismak</label>
            <div className="flex flex-wrap gap-2">
              {OFF_FLAVORS.map((flavor) => (
                <button
                  key={flavor.value}
                  onClick={() => setOffFlavor(flavor.label)}
                  className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${
                    offFlavor === flavor.label
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {flavor.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="text-xs text-muted-foreground mb-1 block">Beskriv problemet</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="F.eks: Ølet har en tydelig smørsmak som blir sterkere jo varmere det blir..."
              rows={3}
              className="w-full bg-secondary border border-border rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <h3 className="font-semibold mb-3 mt-6">Bryggeprosess-data (valgfritt)</h3>
          <p className="text-xs text-muted-foreground mb-4">Jo mer data du oppgir, jo bedre diagnose.</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="text-xs text-muted-foreground">OG</label>
              <Input type="number" step="0.001" placeholder="1.050" value={og} onChange={(e) => setOg(e.target.value)} className="bg-secondary border-border mt-1" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">FG</label>
              <Input type="number" step="0.001" placeholder="1.010" value={fg} onChange={(e) => setFg(e.target.value)} className="bg-secondary border-border mt-1" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">pH</label>
              <Input type="number" step="0.1" placeholder="5.3" value={ph} onChange={(e) => setPh(e.target.value)} className="bg-secondary border-border mt-1" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Mesketemperatur (°C)</label>
              <Input type="number" placeholder="66" value={mashTemp} onChange={(e) => setMashTemp(e.target.value)} className="bg-secondary border-border mt-1" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Gjæringstemperatur (°C)</label>
              <Input type="number" placeholder="19" value={fermentTemp} onChange={(e) => setFermentTemp(e.target.value)} className="bg-secondary border-border mt-1" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Gjærstamme</label>
              <Input placeholder="US-05" value={yeast} onChange={(e) => setYeast(e.target.value)} className="bg-secondary border-border mt-1" />
            </div>
          </div>

          <div className="mb-4">
            <label className="text-xs text-muted-foreground">Maltbase</label>
            <Input placeholder="F.eks: Pale Ale Malt, Carapils, Munich" value={grainBill} onChange={(e) => setGrainBill(e.target.value)} className="bg-secondary border-border mt-1" />
          </div>

          <button
            onClick={handleAnalyze}
            disabled={loading || !offFlavor}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Analyserer...</>
            ) : (
              <><Stethoscope className="h-4 w-4" /> Analyser smaksproblem</>
            )}
          </button>
        </CardContent>
      </Card>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      {result && <SensoryResult analysis={result} />}
    </div>
  );
}
```

- [ ] **Step 3: Create sensory mirror page**

Create `src/app/verktoy/smaksassistent/page.tsx`:

```tsx
import { SensoryMirrorForm } from "@/components/ai/sensory-mirror-form";

export const metadata = {
  title: "Smaksassistenten — Uranus Garage",
  description: "AI-drevet feilsøking av bismak i hjemmebrygget øl.",
};

export default function SensoryMirrorPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Smaksassistenten</h1>
      <p className="text-muted-foreground mb-8">
        Beskriv hva som smaker galt, oppgi bryggeprosess-data, og få en AI-drevet diagnose med konkrete anbefalinger.
      </p>
      <SensoryMirrorForm />
    </div>
  );
}
```

- [ ] **Step 4: Run typecheck**

```bash
cd /c/dev/uranus-garage && npm run typecheck
```

- [ ] **Step 5: Commit**

```bash
cd /c/dev/uranus-garage
git add src/components/ai/sensory-mirror-form.tsx src/components/ai/sensory-result.tsx src/app/verktoy/smaksassistent/
git commit -m "feat: add Sensory AI Mirror with form and result display"
```

---

## Task 6: Update Navigation + Tools Overview

**Files:**
- Modify: `src/components/navigation.tsx`
- Modify: `src/app/verktoy/page.tsx`

- [ ] **Step 1: Update navigation tools links**

Read `src/components/navigation.tsx`. Update `toolsLinks` to include all three tools:

```typescript
const toolsLinks = [
  { href: "/verktoy/kalkulatorer", label: "Kalkulatorer" },
  { href: "/verktoy/oppskriftsgenerator", label: "AI Oppskriftsgenerator" },
  { href: "/verktoy/smaksassistent", label: "Smaksassistenten" },
];
```

- [ ] **Step 2: Remove "coming soon" from tools overview**

Read `src/app/verktoy/page.tsx`. Remove the `comingSoon: true` property from both AI tools in the `tools` array, so all three tools are clickable links.

- [ ] **Step 3: Run typecheck and tests**

```bash
cd /c/dev/uranus-garage && npm run typecheck && npm test
```

- [ ] **Step 4: Commit and push**

```bash
cd /c/dev/uranus-garage
git add .
git commit -m "feat: enable AI tools in navigation and tools overview"
git push
```
