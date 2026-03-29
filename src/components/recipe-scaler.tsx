"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { scaleGrains, scaleHops } from "@/lib/scaling";
import { translateStep } from "@/lib/process-i18n";
import type { Recipe } from "@/lib/types";

export function RecipeScaler({ recipe }: { recipe: Recipe }) {
  const [batchSize, setBatchSize] = useState(recipe.batchSize);

  const scaledGrains = scaleGrains(recipe.grains ?? [], recipe.batchSize, batchSize);
  const scaledHops = scaleHops(recipe.hops ?? [], recipe.batchSize, batchSize);

  return (
    <div>
      {/* Scaler control */}
      <div className="flex items-center gap-3 mb-8 p-4 bg-card rounded-lg border border-border">
        <label className="text-sm font-medium whitespace-nowrap">
          Batchstørrelse:
        </label>
        <Input
          type="number"
          min={1}
          max={200}
          value={batchSize}
          onChange={(e) => setBatchSize(Number(e.target.value) || 1)}
          className="w-24 bg-secondary border-border"
        />
        <span className="text-sm text-muted-foreground">liter</span>
        {batchSize !== recipe.batchSize && (
          <button
            onClick={() => setBatchSize(recipe.batchSize)}
            className="text-xs text-primary hover:underline"
          >
            Tilbakestill ({recipe.batchSize}L)
          </button>
        )}
      </div>

      {/* Grains */}
      {scaledGrains.length > 0 && (
        <section className="mb-8">
          <h3 className="text-lg font-semibold mb-3">Malt</h3>
          <div className="space-y-2">
            {scaledGrains.map((grain, i) => (
              <div
                key={i}
                className="flex justify-between items-center p-3 bg-card rounded border border-border"
              >
                <span>{grain.name}</span>
                <span className="font-mono text-primary">
                  {grain.amount} {grain.unit}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Hops */}
      {scaledHops.length > 0 && (
        <section className="mb-8">
          <h3 className="text-lg font-semibold mb-3">Humle</h3>
          <div className="space-y-2">
            {scaledHops.map((hop, i) => (
              <div
                key={i}
                className="flex justify-between items-center p-3 bg-card rounded border border-border"
              >
                <div>
                  <span>{hop.name}</span>
                  <span className="text-xs text-muted-foreground ml-2">
                    ({hop.alphaAcid}% AA)
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-mono text-primary">{hop.amount}g</span>
                  <span className="text-xs text-muted-foreground ml-2">
                    @ {hop.time} min
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Yeast */}
      {recipe.yeast && (
        <section className="mb-8">
          <h3 className="text-lg font-semibold mb-3">Gjær</h3>
          <div className="p-3 bg-card rounded border border-border">
            <span>{recipe.yeast.name}</span>
            {recipe.yeast.amount && (
              <span className="text-muted-foreground ml-2">
                — {recipe.yeast.amount}
              </span>
            )}
            {recipe.yeast.type && (
              <span className="text-xs text-muted-foreground ml-2">
                ({recipe.yeast.type})
              </span>
            )}
          </div>
        </section>
      )}

      {/* Additions */}
      {recipe.additions && recipe.additions.length > 0 && (
        <section className="mb-8">
          <h3 className="text-lg font-semibold mb-3">Tilsetninger</h3>
          <div className="space-y-2">
            {recipe.additions.map((addition, i) => (
              <div
                key={i}
                className="flex justify-between items-center p-3 bg-card rounded border border-border"
              >
                <span>{addition.name}</span>
                <div className="text-right">
                  <span className="font-mono">{addition.amount}</span>
                  {addition.time != null && (
                    <span className="text-xs text-muted-foreground ml-2">
                      @ {addition.time} min
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Process */}
      {recipe.process && recipe.process.length > 0 && (
        <section className="mb-8">
          <h3 className="text-lg font-semibold mb-3">Prosess</h3>
          <div className="space-y-3">
            {recipe.process.map((step, i) => (
              <div
                key={i}
                className="p-4 bg-card rounded border border-border"
              >
                <div className="flex items-center gap-3 mb-1">
                  <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                    {i + 1}
                  </span>
                  <span className="font-semibold">{translateStep(step.step)}</span>
                  <span className="text-xs text-muted-foreground ml-auto">
                    {step.temp}°C — {step.duration} min
                  </span>
                </div>
                {step.description && (
                  <p className="text-sm text-muted-foreground ml-9">
                    {step.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
