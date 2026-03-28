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
      const body: Record<string, unknown> = { offFlavor, description };
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
        throw new Error((data as { error?: string }).error || "Noe gikk galt");
      }

      const data = await res.json();
      setResult((data as { analysis: string }).analysis);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Kunne ikke analysere.");
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
