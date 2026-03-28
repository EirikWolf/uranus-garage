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
                <Input placeholder="F.eks: 4.5-5.5%" value={abvTarget} onChange={(e) => setAbvTarget(e.target.value)} className="bg-secondary border-border mt-1" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Batchstørrelse (L)</label>
                <Input type="number" value={batchSize} onChange={(e) => setBatchSize(e.target.value)} className="bg-secondary border-border mt-1" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Smaksprofil</label>
                <Input placeholder="F.eks: tropisk, sitrus, malt" value={flavorProfile} onChange={(e) => setFlavorProfile(e.target.value)} className="bg-secondary border-border mt-1" />
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

      {error && <p className="text-red-400 text-sm">{error}</p>}
      {result && <RecipeResult recipe={result} />}
    </div>
  );
}
