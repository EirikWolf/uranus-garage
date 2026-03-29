"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Save, Loader2 } from "lucide-react";
import { generateBeerXml } from "@/lib/beerxml";
import type { Recipe, Grain } from "@/lib/types";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { translateStep } from "@/lib/process-i18n";

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

function toRecipeType(gen: GeneratedRecipe): Recipe {
  const slug = gen.name
    .toLowerCase()
    .replace(/[æ]/g, "ae").replace(/[ø]/g, "o").replace(/[å]/g, "a")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  return {
    _id: `generated-${Date.now()}`,
    name: gen.name,
    slug: { current: slug },
    style: gen.style,
    description: gen.description,
    difficulty: gen.difficulty as Recipe["difficulty"],
    batchSize: gen.batchSize,
    grains: gen.grains.map((g) => ({
      name: g.name,
      amount: g.amount,
      unit: g.unit as Grain["unit"],
    })),
    hops: gen.hops.map((h) => ({
      name: h.name,
      amount: h.amount,
      time: h.time,
      alphaAcid: h.alphaAcid,
    })),
    yeast: gen.yeast,
    additions: gen.additions,
    process: gen.process,
  };
}

export function RecipeResult({ recipe }: { recipe: GeneratedRecipe }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/forks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: recipe.name,
          description: recipe.description,
          style: recipe.style,
          difficulty: recipe.difficulty,
          batchSize: recipe.batchSize,
          grains: recipe.grains,
          hops: recipe.hops,
          yeast: recipe.yeast,
          additions: recipe.additions || [],
          process: recipe.process || [],
          changeNotes: "Generert med AI Oppskriftsgenerator",
        }),
      });

      if (!res.ok) throw new Error("Save failed");
      const data = await res.json();
      router.push(`/forks/${data.fork.id}`);
    } catch {
      alert("Kunne ikke lagre. Er du logget inn?");
    } finally {
      setSaving(false);
    }
  }

  function handleBeerXmlExport() {
    const recipeData = toRecipeType(recipe);
    const xml = generateBeerXml(recipeData);
    const blob = new Blob([xml], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${toRecipeType(recipe).slug.current}.xml`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">{recipe.name}</h2>
          <p className="text-muted-foreground">{recipe.style} — {recipe.batchSize}L</p>
          <p className="mt-2">{recipe.description}</p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={handleBeerXmlExport}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border border-border bg-secondary text-secondary-foreground hover:bg-muted transition-colors"
          >
            <Download className="h-4 w-4" />
            BeerXML
          </button>
          {session && (
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg bg-primary text-primary-foreground hover:bg-primary/80 transition-colors disabled:opacity-50"
            >
              {saving ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Lagrer...</>
              ) : (
                <><Save className="h-4 w-4" /> Lagre oppskrift</>
              )}
            </button>
          )}
        </div>
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
                  <span className="text-primary font-mono">{h.amount}g @ {h.time === -1 ? "tørrhumling" : `${h.time} min`}</span>
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
                    <p className="font-medium text-sm">{translateStep(step.step)} <span className="text-muted-foreground">({step.temp}°C, {step.duration} min)</span></p>
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
