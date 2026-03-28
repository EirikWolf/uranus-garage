# Fase 2A: Kalkulatorer + BeerXML Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 5 brewing calculators (ABV, IBU, SRM, Pitch Rate, Carbonation), a BeerXML export feature, and a tools navigation section to the Uranus Garage website.

**Architecture:** All calculators are pure client-side TypeScript functions with React UI components. BeerXML is generated client-side from recipe JSON data. No backend APIs needed. Calculator logic lives in `src/lib/calculators.ts` (testable), UI in `src/components/calculators/`. Navigation updated with Verktøy dropdown.

**Tech Stack:** TypeScript, React, Vitest (testing), Tailwind CSS, shadcn/ui components

**Spec:** `docs/superpowers/specs/2026-03-28-fase2-design.md`

---

## File Structure

```
src/
├── lib/
│   ├── calculators.ts          # All calculator functions (ABV, IBU, SRM, pitch rate, carbonation)
│   └── beerxml.ts              # BeerXML generation from Recipe type
├── components/
│   ├── calculators/
│   │   ├── abv-calculator.tsx
│   │   ├── ibu-calculator.tsx
│   │   ├── srm-calculator.tsx
│   │   ├── pitch-rate-calculator.tsx
│   │   └── carbonation-calculator.tsx
│   ├── beerxml-export-button.tsx
│   └── navigation.tsx          # Modified: add Verktøy + Lær dropdowns
├── app/
│   ├── verktoy/
│   │   ├── page.tsx            # Tools overview
│   │   └── kalkulatorer/
│   │       └── page.tsx        # All calculators on one page
│   └── oppskrifter/
│       └── [slug]/
│           └── page.tsx        # Modified: add BeerXML export button
tests/
├── lib/
│   ├── calculators.test.ts
│   └── beerxml.test.ts
```

---

## Task 1: Calculator Logic (TDD)

**Files:**
- Create: `src/lib/calculators.ts`
- Create: `tests/lib/calculators.test.ts`

- [ ] **Step 1: Write failing tests for all 5 calculators**

Create `tests/lib/calculators.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import {
  calculateAbv,
  calculateIbu,
  calculateSrm,
  calculatePitchRate,
  calculateCarbonation,
} from "@/lib/calculators";

describe("calculateAbv", () => {
  it("calculates ABV from OG and FG", () => {
    expect(calculateAbv(1.050, 1.010)).toBeCloseTo(5.25, 1);
  });

  it("returns 0 when OG equals FG", () => {
    expect(calculateAbv(1.050, 1.050)).toBe(0);
  });

  it("handles high-gravity beers", () => {
    expect(calculateAbv(1.090, 1.015)).toBeCloseTo(9.84, 1);
  });
});

describe("calculateIbu", () => {
  it("calculates IBU for a single hop addition using Tinseth formula", () => {
    const ibu = calculateIbu(
      [{ amountGrams: 30, alphaAcid: 10, boilMinutes: 60 }],
      20,
      1.050,
    );
    expect(ibu).toBeGreaterThan(30);
    expect(ibu).toBeLessThan(50);
  });

  it("returns 0 for no hops", () => {
    expect(calculateIbu([], 20, 1.050)).toBe(0);
  });

  it("sums IBU from multiple additions", () => {
    const single = calculateIbu(
      [{ amountGrams: 30, alphaAcid: 10, boilMinutes: 60 }],
      20,
      1.050,
    );
    const double = calculateIbu(
      [
        { amountGrams: 30, alphaAcid: 10, boilMinutes: 60 },
        { amountGrams: 20, alphaAcid: 5, boilMinutes: 15 },
      ],
      20,
      1.050,
    );
    expect(double).toBeGreaterThan(single);
  });

  it("0-minute additions contribute minimal IBU", () => {
    const ibu = calculateIbu(
      [{ amountGrams: 50, alphaAcid: 12, boilMinutes: 0 }],
      20,
      1.050,
    );
    expect(ibu).toBeLessThan(5);
  });
});

describe("calculateSrm", () => {
  it("calculates SRM from grain bill using Morey equation", () => {
    const srm = calculateSrm(
      [{ weightKg: 5, lovibond: 3 }],
      20,
    );
    expect(srm).toBeGreaterThan(3);
    expect(srm).toBeLessThan(8);
  });

  it("returns 0 for no grains", () => {
    expect(calculateSrm([], 20)).toBe(0);
  });

  it("dark malts increase SRM significantly", () => {
    const light = calculateSrm([{ weightKg: 5, lovibond: 3 }], 20);
    const dark = calculateSrm(
      [
        { weightKg: 5, lovibond: 3 },
        { weightKg: 0.5, lovibond: 500 },
      ],
      20,
    );
    expect(dark).toBeGreaterThan(light * 2);
  });
});

describe("calculatePitchRate", () => {
  it("calculates yeast cells needed for ale", () => {
    const result = calculatePitchRate(1.050, 20, "ale");
    expect(result.billionCells).toBeGreaterThan(150);
    expect(result.billionCells).toBeLessThan(250);
    expect(result.dryYeastGrams).toBeGreaterThan(0);
    expect(result.starterLiters).toBeGreaterThan(0);
  });

  it("lager needs more yeast than ale", () => {
    const ale = calculatePitchRate(1.050, 20, "ale");
    const lager = calculatePitchRate(1.050, 20, "lager");
    expect(lager.billionCells).toBeGreaterThan(ale.billionCells);
  });

  it("higher gravity needs more yeast", () => {
    const low = calculatePitchRate(1.040, 20, "ale");
    const high = calculatePitchRate(1.080, 20, "ale");
    expect(high.billionCells).toBeGreaterThan(low.billionCells);
  });
});

describe("calculateCarbonation", () => {
  it("calculates priming sugar for target CO2 volumes", () => {
    const result = calculateCarbonation(2.4, 20, 20);
    expect(result.sugarGrams).toBeGreaterThan(100);
    expect(result.sugarGrams).toBeLessThan(200);
    expect(result.sugarGramsPerLiter).toBeGreaterThan(4);
    expect(result.psi).toBeGreaterThan(8);
  });

  it("cold beer needs less sugar (more residual CO2)", () => {
    const warm = calculateCarbonation(2.4, 20, 20);
    const cold = calculateCarbonation(2.4, 20, 4);
    expect(cold.sugarGrams).toBeLessThan(warm.sugarGrams);
  });

  it("higher CO2 target needs more sugar", () => {
    const low = calculateCarbonation(2.0, 20, 20);
    const high = calculateCarbonation(3.0, 20, 20);
    expect(high.sugarGrams).toBeGreaterThan(low.sugarGrams);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
cd /c/dev/uranus-garage && npx vitest run tests/lib/calculators.test.ts
```

Expected: FAIL — functions not found.

- [ ] **Step 3: Implement all calculator functions**

Create `src/lib/calculators.ts`:

```typescript
// --- ABV Calculator ---
// Standard formula: (OG - FG) * 131.25
export function calculateAbv(og: number, fg: number): number {
  return Math.round((og - fg) * 131.25 * 100) / 100;
}

// --- IBU Calculator (Tinseth formula) ---
export interface HopAddition {
  amountGrams: number;
  alphaAcid: number; // percentage, e.g. 10 for 10%
  boilMinutes: number;
}

export function calculateIbu(
  hops: HopAddition[],
  batchLiters: number,
  og: number,
): number {
  if (hops.length === 0 || batchLiters <= 0) return 0;

  const totalIbu = hops.reduce((sum, hop) => {
    const bignessFactor = 1.65 * Math.pow(0.000125, og - 1);
    const boilTimeFactor =
      (1 - Math.exp(-0.04 * hop.boilMinutes)) / 4.15;
    const utilization = bignessFactor * boilTimeFactor;
    const mgPerLiter =
      (hop.alphaAcid / 100) * hop.amountGrams * 1000;
    const ibu = (utilization * mgPerLiter) / batchLiters;
    return sum + ibu;
  }, 0);

  return Math.round(totalIbu * 10) / 10;
}

// --- SRM Calculator (Morey equation) ---
export interface GrainBill {
  weightKg: number;
  lovibond: number;
}

export function calculateSrm(
  grains: GrainBill[],
  batchLiters: number,
): number {
  if (grains.length === 0 || batchLiters <= 0) return 0;

  const batchGallons = batchLiters / 3.78541;
  const mcu = grains.reduce((sum, g) => {
    const weightLbs = g.weightKg * 2.20462;
    return sum + (weightLbs * g.lovibond) / batchGallons;
  }, 0);

  const srm = 1.4922 * Math.pow(mcu, 0.6859);
  return Math.round(srm * 10) / 10;
}

// --- Pitch Rate Calculator ---
export interface PitchRateResult {
  billionCells: number;
  dryYeastGrams: number;
  liquidYeastPacks: number;
  starterLiters: number;
}

export function calculatePitchRate(
  og: number,
  volumeLiters: number,
  type: "ale" | "lager",
): PitchRateResult {
  // Pitch rate: 0.75 million cells/mL/°P for ales, 1.5 for lagers
  const rate = type === "ale" ? 0.75 : 1.5;
  const plato = (og - 1) * 1000 / 4; // approximate °P
  const millionCellsPerMl = rate * plato;
  const billionCells = Math.round((millionCellsPerMl * volumeLiters) / 10) / 100;

  // Dry yeast: ~20 billion cells per gram
  const dryYeastGrams = Math.round(billionCells / 20 * 10) / 10;

  // Liquid yeast: ~100 billion cells per pack
  const liquidYeastPacks = Math.ceil(billionCells / 100);

  // Starter: 1L starter with 100g DME yields ~100 billion additional cells
  const starterLiters = Math.round(Math.max(0, (billionCells - 100) / 100) * 10) / 10;

  return { billionCells, dryYeastGrams, liquidYeastPacks, starterLiters };
}

// --- Carbonation Calculator ---
export interface CarbonationResult {
  sugarGrams: number;
  sugarGramsPerLiter: number;
  psi: number;
}

export function calculateCarbonation(
  targetCo2Volumes: number,
  volumeLiters: number,
  beerTempCelsius: number,
): CarbonationResult {
  // Residual CO2 from fermentation (based on beer temperature)
  const residualCo2 =
    3.0378 -
    0.050062 * beerTempCelsius +
    0.00026555 * beerTempCelsius * beerTempCelsius;

  const co2Needed = Math.max(0, targetCo2Volumes - residualCo2);

  // Grams of sucrose per liter to achieve desired CO2 volumes
  // ~4g sucrose per liter per volume of CO2
  const sugarGramsPerLiter = Math.round(co2Needed * 4 * 10) / 10;
  const sugarGrams = Math.round(sugarGramsPerLiter * volumeLiters);

  // PSI for forced carbonation (Henry's law approximation)
  // PSI ≈ targetCo2 * (temperature_factor)
  const tempF = beerTempCelsius * 1.8 + 32;
  const psi = Math.round(
    (targetCo2Volumes - residualCo2) * (-16.6999 + 0.0101059 * tempF * tempF + 0.00116512 * tempF * tempF * tempF > 0
      ? -16.6999 + 0.0101059 * tempF * tempF + 0.00116512 * tempF * tempF * tempF
      : targetCo2Volumes * 5) * 10,
  ) / 10;

  // Simpler PSI approximation: use standard carbonation chart formula
  const psiSimple = Math.round(
    (-16.6999 + 0.0101059 * tempF * tempF + 0.00116512 * Math.pow(tempF, 3)) *
    (targetCo2Volumes / 3.0) * 10
  ) / 10;

  return {
    sugarGrams,
    sugarGramsPerLiter,
    psi: Math.max(0, psiSimple),
  };
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
cd /c/dev/uranus-garage && npx vitest run tests/lib/calculators.test.ts
```

Expected: All tests PASS. If any fail, adjust the implementation formulas until the expected ranges match.

- [ ] **Step 5: Run typecheck**

```bash
cd /c/dev/uranus-garage && npm run typecheck
```

- [ ] **Step 6: Commit**

```bash
cd /c/dev/uranus-garage
git add src/lib/calculators.ts tests/lib/calculators.test.ts
git commit -m "feat: add brewing calculator functions (ABV, IBU, SRM, pitch rate, carbonation)"
```

---

## Task 2: BeerXML Export (TDD)

**Files:**
- Create: `src/lib/beerxml.ts`
- Create: `tests/lib/beerxml.test.ts`

- [ ] **Step 1: Write failing tests**

Create `tests/lib/beerxml.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { generateBeerXml } from "@/lib/beerxml";
import type { Recipe } from "@/lib/types";

const mockRecipe: Recipe = {
  _id: "test-1",
  name: "Test IPA",
  slug: { current: "test-ipa" },
  style: "IPA",
  description: "A test IPA recipe",
  difficulty: "middels",
  batchSize: 20,
  grains: [
    { name: "Pale Ale Malt", amount: 5, unit: "kg" },
    { name: "Carapils", amount: 300, unit: "g" },
  ],
  hops: [
    { name: "Citra", amount: 30, time: 60, alphaAcid: 12 },
    { name: "Mosaic", amount: 50, time: 0, alphaAcid: 11.5 },
  ],
  yeast: { name: "US-05", amount: "1 pakke", type: "Tørrgjær" },
  additions: [],
  process: [
    { step: "Mashing", description: "Mash at 66C", temp: 66, duration: 60 },
  ],
};

describe("generateBeerXml", () => {
  it("generates valid XML with recipe name", () => {
    const xml = generateBeerXml(mockRecipe);
    expect(xml).toContain("<?xml");
    expect(xml).toContain("<RECIPES>");
    expect(xml).toContain("<NAME>Test IPA</NAME>");
  });

  it("includes all grains as fermentables", () => {
    const xml = generateBeerXml(mockRecipe);
    expect(xml).toContain("<NAME>Pale Ale Malt</NAME>");
    expect(xml).toContain("<AMOUNT>5</AMOUNT>");
    expect(xml).toContain("<NAME>Carapils</NAME>");
    expect(xml).toContain("<AMOUNT>0.3</AMOUNT>");
  });

  it("includes all hops", () => {
    const xml = generateBeerXml(mockRecipe);
    expect(xml).toContain("<NAME>Citra</NAME>");
    expect(xml).toContain("<ALPHA>12</ALPHA>");
    expect(xml).toContain("<NAME>Mosaic</NAME>");
  });

  it("includes yeast", () => {
    const xml = generateBeerXml(mockRecipe);
    expect(xml).toContain("<NAME>US-05</NAME>");
  });

  it("includes batch size in liters", () => {
    const xml = generateBeerXml(mockRecipe);
    expect(xml).toContain("<BATCH_SIZE>20</BATCH_SIZE>");
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
cd /c/dev/uranus-garage && npx vitest run tests/lib/beerxml.test.ts
```

- [ ] **Step 3: Implement BeerXML generator**

Create `src/lib/beerxml.ts`:

```typescript
import type { Recipe, Grain } from "./types";

function grainAmountKg(grain: Grain): number {
  return grain.unit === "g" ? grain.amount / 1000 : grain.amount;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function generateBeerXml(recipe: Recipe): string {
  const fermentables = (recipe.grains ?? [])
    .map(
      (g) => `      <FERMENTABLE>
        <NAME>${escapeXml(g.name)}</NAME>
        <AMOUNT>${grainAmountKg(g)}</AMOUNT>
        <TYPE>Grain</TYPE>
        <YIELD>75</YIELD>
        <COLOR>3</COLOR>
      </FERMENTABLE>`,
    )
    .join("\n");

  const hops = (recipe.hops ?? [])
    .map(
      (h) => `      <HOP>
        <NAME>${escapeXml(h.name)}</NAME>
        <AMOUNT>${h.amount / 1000}</AMOUNT>
        <TIME>${h.time}</TIME>
        <ALPHA>${h.alphaAcid}</ALPHA>
        <USE>${h.time > 0 ? "Boil" : h.time === 0 ? "Aroma" : "Dry Hop"}</USE>
      </HOP>`,
    )
    .join("\n");

  const yeastSection = recipe.yeast
    ? `    <YEASTS>
      <YEAST>
        <NAME>${escapeXml(recipe.yeast.name)}</NAME>
        <TYPE>${recipe.yeast.type || "Ale"}</TYPE>
        <FORM>${recipe.yeast.type?.includes("Tørr") ? "Dry" : "Liquid"}</FORM>
        <AMOUNT>${recipe.yeast.amount || "1"}</AMOUNT>
      </YEAST>
    </YEASTS>`
    : "";

  return `<?xml version="1.0" encoding="UTF-8"?>
<RECIPES>
  <RECIPE>
    <NAME>${escapeXml(recipe.name)}</NAME>
    <VERSION>1</VERSION>
    <TYPE>All Grain</TYPE>
    <BREWER>Uranus Garage</BREWER>
    <BATCH_SIZE>${recipe.batchSize}</BATCH_SIZE>
    <BOIL_SIZE>${Math.round(recipe.batchSize * 1.2)}</BOIL_SIZE>
    <BOIL_TIME>60</BOIL_TIME>
    <STYLE>
      <NAME>${escapeXml(recipe.style || "")}</NAME>
    </STYLE>
    <FERMENTABLES>
${fermentables}
    </FERMENTABLES>
    <HOPS>
${hops}
    </HOPS>
${yeastSection}
  </RECIPE>
</RECIPES>`;
}
```

- [ ] **Step 4: Run tests**

```bash
cd /c/dev/uranus-garage && npx vitest run tests/lib/beerxml.test.ts
```

Expected: All 5 tests PASS.

- [ ] **Step 5: Commit**

```bash
cd /c/dev/uranus-garage
git add src/lib/beerxml.ts tests/lib/beerxml.test.ts
git commit -m "feat: add BeerXML generation from recipe data"
```

---

## Task 3: Calculator UI Components

**Files:**
- Create: `src/components/calculators/abv-calculator.tsx`
- Create: `src/components/calculators/ibu-calculator.tsx`
- Create: `src/components/calculators/srm-calculator.tsx`
- Create: `src/components/calculators/pitch-rate-calculator.tsx`
- Create: `src/components/calculators/carbonation-calculator.tsx`

- [ ] **Step 1: Create ABV calculator component**

Create `src/components/calculators/abv-calculator.tsx`:

```tsx
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { calculateAbv } from "@/lib/calculators";

export function AbvCalculator() {
  const [og, setOg] = useState("1.050");
  const [fg, setFg] = useState("1.010");

  const ogNum = parseFloat(og) || 0;
  const fgNum = parseFloat(fg) || 0;
  const abv = ogNum > fgNum ? calculateAbv(ogNum, fgNum) : 0;

  return (
    <Card className="bg-card border-border">
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-4">ABV-kalkulator</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-xs text-muted-foreground">Original Gravity (OG)</label>
            <Input
              type="number"
              step="0.001"
              min="0.990"
              max="1.200"
              value={og}
              onChange={(e) => setOg(e.target.value)}
              className="bg-secondary border-border mt-1"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Final Gravity (FG)</label>
            <Input
              type="number"
              step="0.001"
              min="0.990"
              max="1.100"
              value={fg}
              onChange={(e) => setFg(e.target.value)}
              className="bg-secondary border-border mt-1"
            />
          </div>
        </div>
        <div className="bg-background rounded-lg p-4 text-center border border-border">
          <p className="text-xs text-muted-foreground">ABV</p>
          <p className="text-3xl font-bold text-primary">{abv}%</p>
        </div>
      </CardContent>
    </Card>
  );
}
```

- [ ] **Step 2: Create IBU calculator component**

Create `src/components/calculators/ibu-calculator.tsx`:

```tsx
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { calculateIbu, type HopAddition } from "@/lib/calculators";

export function IbuCalculator() {
  const [hops, setHops] = useState<HopAddition[]>([
    { amountGrams: 30, alphaAcid: 10, boilMinutes: 60 },
  ]);
  const [batchSize, setBatchSize] = useState("20");
  const [og, setOg] = useState("1.050");

  const ibu = calculateIbu(hops, parseFloat(batchSize) || 20, parseFloat(og) || 1.050);

  function addHop() {
    setHops([...hops, { amountGrams: 20, alphaAcid: 5, boilMinutes: 15 }]);
  }

  function removeHop(index: number) {
    setHops(hops.filter((_, i) => i !== index));
  }

  function updateHop(index: number, field: keyof HopAddition, value: number) {
    setHops(hops.map((h, i) => (i === index ? { ...h, [field]: value } : h)));
  }

  return (
    <Card className="bg-card border-border">
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-4">IBU-kalkulator</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-xs text-muted-foreground">Batchstørrelse (L)</label>
            <Input type="number" value={batchSize} onChange={(e) => setBatchSize(e.target.value)} className="bg-secondary border-border mt-1" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">OG</label>
            <Input type="number" step="0.001" value={og} onChange={(e) => setOg(e.target.value)} className="bg-secondary border-border mt-1" />
          </div>
        </div>

        <div className="space-y-2 mb-4">
          {hops.map((hop, i) => (
            <div key={i} className="grid grid-cols-4 gap-2 items-end">
              <div>
                <label className="text-xs text-muted-foreground">Mengde (g)</label>
                <Input type="number" value={hop.amountGrams} onChange={(e) => updateHop(i, "amountGrams", parseFloat(e.target.value) || 0)} className="bg-secondary border-border mt-1" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">AA (%)</label>
                <Input type="number" step="0.1" value={hop.alphaAcid} onChange={(e) => updateHop(i, "alphaAcid", parseFloat(e.target.value) || 0)} className="bg-secondary border-border mt-1" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Tid (min)</label>
                <Input type="number" value={hop.boilMinutes} onChange={(e) => updateHop(i, "boilMinutes", parseFloat(e.target.value) || 0)} className="bg-secondary border-border mt-1" />
              </div>
              <Button variant="ghost" size="icon" onClick={() => removeHop(i)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <Button variant="outline" size="sm" onClick={addHop} className="mb-4">
          <Plus className="h-4 w-4 mr-1" /> Legg til humle
        </Button>

        <div className="bg-background rounded-lg p-4 text-center border border-border">
          <p className="text-xs text-muted-foreground">Estimert IBU</p>
          <p className="text-3xl font-bold text-primary">{ibu}</p>
        </div>
      </CardContent>
    </Card>
  );
}
```

- [ ] **Step 3: Create SRM calculator component**

Create `src/components/calculators/srm-calculator.tsx`:

```tsx
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { calculateSrm, type GrainBill } from "@/lib/calculators";

const SRM_COLORS = [
  "#F8F753", "#F6F513", "#ECE61A", "#D5BC26", "#BF923B",
  "#A36629", "#8D4C32", "#7C3D22", "#6B2D1A", "#5D341A",
  "#4E2A0C", "#3F2307", "#361F04", "#2C1503", "#261716",
  "#1F120B", "#19100A", "#120D07", "#0F0B0A", "#080707",
];

function srmToColor(srm: number): string {
  const index = Math.min(Math.max(0, Math.round(srm / 2) - 1), SRM_COLORS.length - 1);
  return SRM_COLORS[index] || SRM_COLORS[SRM_COLORS.length - 1];
}

export function SrmCalculator() {
  const [grains, setGrains] = useState<GrainBill[]>([
    { weightKg: 5, lovibond: 3 },
  ]);
  const [batchSize, setBatchSize] = useState("20");

  const srm = calculateSrm(grains, parseFloat(batchSize) || 20);

  function addGrain() {
    setGrains([...grains, { weightKg: 1, lovibond: 5 }]);
  }

  function removeGrain(index: number) {
    setGrains(grains.filter((_, i) => i !== index));
  }

  function updateGrain(index: number, field: keyof GrainBill, value: number) {
    setGrains(grains.map((g, i) => (i === index ? { ...g, [field]: value } : g)));
  }

  return (
    <Card className="bg-card border-border">
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-4">SRM Fargeguide</h3>
        <div className="mb-4">
          <label className="text-xs text-muted-foreground">Batchstørrelse (L)</label>
          <Input type="number" value={batchSize} onChange={(e) => setBatchSize(e.target.value)} className="bg-secondary border-border mt-1 max-w-[120px]" />
        </div>

        <div className="space-y-2 mb-4">
          {grains.map((grain, i) => (
            <div key={i} className="grid grid-cols-3 gap-2 items-end">
              <div>
                <label className="text-xs text-muted-foreground">Vekt (kg)</label>
                <Input type="number" step="0.1" value={grain.weightKg} onChange={(e) => updateGrain(i, "weightKg", parseFloat(e.target.value) || 0)} className="bg-secondary border-border mt-1" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Lovibond (°L)</label>
                <Input type="number" value={grain.lovibond} onChange={(e) => updateGrain(i, "lovibond", parseFloat(e.target.value) || 0)} className="bg-secondary border-border mt-1" />
              </div>
              <Button variant="ghost" size="icon" onClick={() => removeGrain(i)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <Button variant="outline" size="sm" onClick={addGrain} className="mb-4">
          <Plus className="h-4 w-4 mr-1" /> Legg til malt
        </Button>

        <div className="bg-background rounded-lg p-4 text-center border border-border">
          <div
            className="w-16 h-16 rounded-full mx-auto mb-2 border border-border"
            style={{ backgroundColor: srmToColor(srm) }}
          />
          <p className="text-xs text-muted-foreground">SRM</p>
          <p className="text-3xl font-bold" style={{ color: srmToColor(srm) }}>{srm}</p>
        </div>
      </CardContent>
    </Card>
  );
}
```

- [ ] **Step 4: Create Pitch Rate calculator component**

Create `src/components/calculators/pitch-rate-calculator.tsx`:

```tsx
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { calculatePitchRate } from "@/lib/calculators";

export function PitchRateCalculator() {
  const [og, setOg] = useState("1.050");
  const [volume, setVolume] = useState("20");
  const [type, setType] = useState<"ale" | "lager">("ale");

  const result = calculatePitchRate(
    parseFloat(og) || 1.050,
    parseFloat(volume) || 20,
    type,
  );

  return (
    <Card className="bg-card border-border">
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-4">Pitch Rate & Starter</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-xs text-muted-foreground">OG</label>
            <Input type="number" step="0.001" value={og} onChange={(e) => setOg(e.target.value)} className="bg-secondary border-border mt-1" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Volum (L)</label>
            <Input type="number" value={volume} onChange={(e) => setVolume(e.target.value)} className="bg-secondary border-border mt-1" />
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setType("ale")}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${type === "ale" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}
          >
            Ale
          </button>
          <button
            onClick={() => setType("lager")}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${type === "lager" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}
          >
            Lager
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-background rounded-lg p-3 text-center border border-border">
            <p className="text-xs text-muted-foreground">Celler behøves</p>
            <p className="text-lg font-bold text-primary">{result.billionCells}B</p>
          </div>
          <div className="bg-background rounded-lg p-3 text-center border border-border">
            <p className="text-xs text-muted-foreground">Tørrgjær</p>
            <p className="text-lg font-bold">{result.dryYeastGrams}g</p>
          </div>
          <div className="bg-background rounded-lg p-3 text-center border border-border">
            <p className="text-xs text-muted-foreground">Flytende pakker</p>
            <p className="text-lg font-bold">{result.liquidYeastPacks} stk</p>
          </div>
          <div className="bg-background rounded-lg p-3 text-center border border-border">
            <p className="text-xs text-muted-foreground">Starter</p>
            <p className="text-lg font-bold">{result.starterLiters}L</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

- [ ] **Step 5: Create Carbonation calculator component**

Create `src/components/calculators/carbonation-calculator.tsx`:

```tsx
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { calculateCarbonation } from "@/lib/calculators";

const CO2_PRESETS: Record<string, number> = {
  "British Ales": 1.8,
  "Belgian Ales": 2.8,
  "American Ales": 2.4,
  "German Lager": 2.6,
  "Belgian Trippel": 3.5,
  "Stout": 2.0,
  "Wheat Beer": 3.2,
};

export function CarbonationCalculator() {
  const [co2, setCo2] = useState("2.4");
  const [volume, setVolume] = useState("20");
  const [temp, setTemp] = useState("20");

  const result = calculateCarbonation(
    parseFloat(co2) || 2.4,
    parseFloat(volume) || 20,
    parseFloat(temp) || 20,
  );

  return (
    <Card className="bg-card border-border">
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-4">Karboneringskalkulator</h3>

        <div className="flex flex-wrap gap-1 mb-4">
          {Object.entries(CO2_PRESETS).map(([style, val]) => (
            <button
              key={style}
              onClick={() => setCo2(String(val))}
              className={`text-xs px-2 py-1 rounded transition-colors ${
                co2 === String(val)
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {style}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <label className="text-xs text-muted-foreground">CO₂ (vol)</label>
            <Input type="number" step="0.1" value={co2} onChange={(e) => setCo2(e.target.value)} className="bg-secondary border-border mt-1" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Ølvolum (L)</label>
            <Input type="number" value={volume} onChange={(e) => setVolume(e.target.value)} className="bg-secondary border-border mt-1" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Øltemp (°C)</label>
            <Input type="number" value={temp} onChange={(e) => setTemp(e.target.value)} className="bg-secondary border-border mt-1" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-background rounded-lg p-3 text-center border border-border">
            <p className="text-xs text-muted-foreground">Sukker totalt</p>
            <p className="text-xl font-bold text-primary">{result.sugarGrams}g</p>
          </div>
          <div className="bg-background rounded-lg p-3 text-center border border-border">
            <p className="text-xs text-muted-foreground">Per liter</p>
            <p className="text-xl font-bold">{result.sugarGramsPerLiter}g/L</p>
          </div>
          <div className="bg-background rounded-lg p-3 text-center border border-border">
            <p className="text-xs text-muted-foreground">Forced carb</p>
            <p className="text-xl font-bold">{result.psi} PSI</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

- [ ] **Step 6: Run typecheck**

```bash
cd /c/dev/uranus-garage && npm run typecheck
```

Note: Check if Button's `variant`, `size`, `onClick` props work with the base-nova style. If not, adapt to use plain `<button>` elements with Tailwind classes.

- [ ] **Step 7: Commit**

```bash
cd /c/dev/uranus-garage
git add src/components/calculators/
git commit -m "feat: add calculator UI components (ABV, IBU, SRM, pitch rate, carbonation)"
```

---

## Task 4: Tools Pages + BeerXML Export Button

**Files:**
- Create: `src/app/verktoy/page.tsx`
- Create: `src/app/verktoy/kalkulatorer/page.tsx`
- Create: `src/components/beerxml-export-button.tsx`
- Modify: `src/app/oppskrifter/[slug]/page.tsx`

- [ ] **Step 1: Create BeerXML export button**

Create `src/components/beerxml-export-button.tsx`:

```tsx
"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { generateBeerXml } from "@/lib/beerxml";
import type { Recipe } from "@/lib/types";

export function BeerXmlExportButton({ recipe }: { recipe: Recipe }) {
  function handleExport() {
    const xml = generateBeerXml(recipe);
    const blob = new Blob([xml], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${recipe.slug.current}.xml`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Button variant="outline" size="sm" onClick={handleExport}>
      <Download className="h-4 w-4 mr-1" />
      Last ned BeerXML
    </Button>
  );
}
```

- [ ] **Step 2: Create tools overview page**

Create `src/app/verktoy/page.tsx`:

```tsx
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Calculator, Sparkles, Stethoscope } from "lucide-react";

export const metadata = {
  title: "Verktøy — Uranus Garage",
  description: "Bryggeverktøy: kalkulatorer, AI-oppskriftsgenerator og smaksassistent.",
};

const tools = [
  {
    href: "/verktoy/kalkulatorer",
    icon: Calculator,
    title: "Kalkulatorer",
    description: "ABV, IBU, SRM, Pitch Rate og Karbonering",
  },
  {
    href: "/verktoy/oppskriftsgenerator",
    icon: Sparkles,
    title: "AI Oppskriftsgenerator",
    description: "Generer oppskrifter med kunstig intelligens",
    comingSoon: true,
  },
  {
    href: "/verktoy/smaksassistent",
    icon: Stethoscope,
    title: "Smaksassistenten",
    description: "AI-drevet feilsøking av bismak i ølet ditt",
    comingSoon: true,
  },
];

export default function ToolsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Verktøy</h1>
      <p className="text-muted-foreground mb-8">
        Nyttige verktøy for hjemmebryggere.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => {
          const Icon = tool.icon;
          const Wrapper = tool.comingSoon ? "div" : Link;
          return (
            <Wrapper
              key={tool.href}
              href={tool.comingSoon ? undefined! : tool.href}
              className={tool.comingSoon ? "opacity-60" : ""}
            >
              <Card className="bg-card hover:bg-accent transition-colors h-full">
                <CardContent className="pt-6 text-center">
                  <Icon className="h-10 w-10 text-primary mx-auto mb-3" />
                  <h3 className="font-bold text-lg">{tool.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {tool.description}
                  </p>
                  {tool.comingSoon && (
                    <span className="text-xs bg-secondary px-2 py-1 rounded mt-3 inline-block">
                      Kommer snart
                    </span>
                  )}
                </CardContent>
              </Card>
            </Wrapper>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create calculators page**

Create `src/app/verktoy/kalkulatorer/page.tsx`:

```tsx
import { AbvCalculator } from "@/components/calculators/abv-calculator";
import { IbuCalculator } from "@/components/calculators/ibu-calculator";
import { SrmCalculator } from "@/components/calculators/srm-calculator";
import { PitchRateCalculator } from "@/components/calculators/pitch-rate-calculator";
import { CarbonationCalculator } from "@/components/calculators/carbonation-calculator";

export const metadata = {
  title: "Kalkulatorer — Uranus Garage",
  description: "Bryggkalkulatorer: ABV, IBU, SRM, Pitch Rate og Karbonering.",
};

export default function CalculatorsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Kalkulatorer</h1>
      <p className="text-muted-foreground mb-8">
        Alt du trenger for å beregne de viktigste verdiene i brygget ditt.
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AbvCalculator />
        <IbuCalculator />
        <SrmCalculator />
        <PitchRateCalculator />
        <div className="lg:col-span-2">
          <CarbonationCalculator />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Add BeerXML export to recipe detail page**

Read the existing `src/app/oppskrifter/[slug]/page.tsx` and add the `BeerXmlExportButton` in the header section, after the description and before the `RecipeScaler`:

```tsx
// Add import at top:
import { BeerXmlExportButton } from "@/components/beerxml-export-button";

// Add in the header section, after the beer link and before </header>:
<div className="mt-4">
  <BeerXmlExportButton recipe={recipe} />
</div>
```

- [ ] **Step 5: Run typecheck**

```bash
cd /c/dev/uranus-garage && npm run typecheck
```

- [ ] **Step 6: Commit**

```bash
cd /c/dev/uranus-garage
git add .
git commit -m "feat: add tools pages, calculators page, and BeerXML export button"
```

---

## Task 5: Update Navigation

**Files:**
- Modify: `src/components/navigation.tsx`

- [ ] **Step 1: Update navigation with Verktøy and Lær dropdowns**

Read the existing `src/components/navigation.tsx`. Update the `navItems` array to:

```typescript
const toolsLinks = [
  { href: "/verktoy/kalkulatorer", label: "Kalkulatorer" },
];

const brewingLinks = [
  { href: "/bryggelogg", label: "Bryggelogg" },
  { href: "/oppskrifter", label: "Oppskriftsarkiv" },
];

const navItems = [
  { href: "/ol", label: "Øl" },
  { label: "Brygging", children: brewingLinks },
  { label: "Verktøy", children: toolsLinks },
  { href: "/om-oss", label: "Om oss" },
];
```

Note: Lær dropdown will be added in Fase 2C when the article pages exist. For now just Verktøy.

- [ ] **Step 2: Run typecheck**

```bash
cd /c/dev/uranus-garage && npm run typecheck
```

- [ ] **Step 3: Run all tests**

```bash
cd /c/dev/uranus-garage && npm test
```

Expected: All tests pass (scaling + calculator + beerxml).

- [ ] **Step 4: Commit and push**

```bash
cd /c/dev/uranus-garage
git add .
git commit -m "feat: update navigation with Verktøy dropdown"
git push
```

---

## Out of Scope

**Deferred to Fase 2B:** AI Oppskriftsgenerator, Sensory AI Mirror (Claude API integration)
**Deferred to Fase 2C:** Akademiet, Råvarefokus, DIY-hjørnet, Bryggelaben (RAPT), article schema, Lær dropdown
