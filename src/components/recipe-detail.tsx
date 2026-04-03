"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Recipe } from "@/lib/types";

interface Props {
  recipe: Recipe;
}

export function RecipeDetail({ recipe }: Props) {
  const tabs = [
    { value: "malt", label: "Malt", show: recipe.grains && recipe.grains.length > 0 },
    { value: "humle", label: "Humle", show: recipe.hops && recipe.hops.length > 0 },
    { value: "gjaer", label: "Gjær", show: !!recipe.yeast?.name },
    { value: "prosess", label: "Prosess", show: recipe.process && recipe.process.length > 0 },
    { value: "vann", label: "Vann", show: !!recipe.waterProfile && Object.values(recipe.waterProfile).some(Boolean) },
    { value: "gjaering", label: "Gjæring", show: !!recipe.fermentationProfile && recipe.fermentationProfile.length > 0 },
  ].filter((t) => t.show);

  if (tabs.length === 0) return null;

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-muted-foreground">
          {recipe.batchSize}L batch
          {recipe.additions && recipe.additions.length > 0 && ` · ${recipe.additions.length} tilsetning${recipe.additions.length > 1 ? "er" : ""}`}
        </p>
      </div>
      <Tabs defaultValue={tabs[0].value}>
        <TabsList className="flex flex-wrap h-auto gap-1 mb-4">
          {tabs.map((t) => (
            <TabsTrigger key={t.value} value={t.value}>
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Malt */}
        {recipe.grains && recipe.grains.length > 0 && (
          <TabsContent value="malt">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="pb-2 font-medium">Malt</th>
                  <th className="pb-2 font-medium text-right">Mengde</th>
                </tr>
              </thead>
              <tbody>
                {recipe.grains.map((g, i) => (
                  <tr key={i} className="border-b border-border/50 last:border-0">
                    <td className="py-2">{g.name}</td>
                    <td className="py-2 text-right text-muted-foreground">
                      {g.amount} {g.unit}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TabsContent>
        )}

        {/* Humle */}
        {recipe.hops && recipe.hops.length > 0 && (
          <TabsContent value="humle">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="pb-2 font-medium">Humle</th>
                  <th className="pb-2 font-medium text-right">Mengde</th>
                  <th className="pb-2 font-medium text-right">Tid</th>
                  <th className="pb-2 font-medium text-right">AA%</th>
                </tr>
              </thead>
              <tbody>
                {recipe.hops.map((h, i) => (
                  <tr key={i} className="border-b border-border/50 last:border-0">
                    <td className="py-2">{h.name}</td>
                    <td className="py-2 text-right text-muted-foreground">{h.amount}g</td>
                    <td className="py-2 text-right text-muted-foreground">
                      {h.time === 0 ? "Flameout" : `${h.time} min`}
                    </td>
                    <td className="py-2 text-right text-muted-foreground">
                      {h.alphaAcid != null ? `${h.alphaAcid}%` : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TabsContent>
        )}

        {/* Gjær */}
        {recipe.yeast?.name && (
          <TabsContent value="gjaer">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground">Stamme</span>
                <span className="font-medium">{recipe.yeast.name}</span>
              </div>
              {recipe.yeast.amount && (
                <div className="flex justify-between py-2 border-b border-border/50">
                  <span className="text-muted-foreground">Mengde</span>
                  <span>{recipe.yeast.amount}</span>
                </div>
              )}
              {recipe.yeast.type && (
                <div className="flex justify-between py-2 border-b border-border/50">
                  <span className="text-muted-foreground">Type</span>
                  <span className="capitalize">{recipe.yeast.type}</span>
                </div>
              )}
              {recipe.additions && recipe.additions.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Tilsetninger</p>
                  {recipe.additions.map((a, i) => (
                    <div key={i} className="flex justify-between py-2 border-b border-border/50 last:border-0">
                      <span>{a.name}</span>
                      <span className="text-muted-foreground">
                        {a.amount}{a.time != null ? ` @ ${a.time === 0 ? "flameout" : `${a.time} min`}` : ""}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        )}

        {/* Prosess */}
        {recipe.process && recipe.process.length > 0 && (
          <TabsContent value="prosess">
            <ol className="space-y-3">
              {recipe.process.map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-bold mt-0.5">
                    {i + 1}
                  </span>
                  <div className="flex-1 text-sm">
                    <div className="flex items-center gap-2 font-medium">
                      {step.step}
                      {step.temp != null && (
                        <span className="text-xs text-muted-foreground font-normal">
                          {step.temp}°C
                        </span>
                      )}
                      {step.duration != null && (
                        <span className="text-xs text-muted-foreground font-normal">
                          · {step.duration} min
                        </span>
                      )}
                    </div>
                    {step.description && (
                      <p className="text-muted-foreground mt-0.5">{step.description}</p>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </TabsContent>
        )}

        {/* Vann */}
        {recipe.waterProfile && (
          <TabsContent value="vann">
            <div className="grid grid-cols-2 gap-x-8 text-sm">
              {[
                { label: "Kalsium Ca²⁺", value: recipe.waterProfile.calcium, unit: "ppm" },
                { label: "Magnesium Mg²⁺", value: recipe.waterProfile.magnesium, unit: "ppm" },
                { label: "Natrium Na⁺", value: recipe.waterProfile.sodium, unit: "ppm" },
                { label: "Klorid Cl⁻", value: recipe.waterProfile.chloride, unit: "ppm" },
                { label: "Sulfat SO₄²⁻", value: recipe.waterProfile.sulfate, unit: "ppm" },
                { label: "Bikarbonat HCO₃⁻", value: recipe.waterProfile.bicarbonate, unit: "ppm" },
                { label: "pH meskevann", value: recipe.waterProfile.ph, unit: "" },
              ]
                .filter((row) => row.value != null)
                .map((row, i) => (
                  <div key={i} className="flex justify-between py-2 border-b border-border/50">
                    <span className="text-muted-foreground">{row.label}</span>
                    <span className="font-medium">
                      {row.value}
                      {row.unit && <span className="text-muted-foreground ml-1 font-normal">{row.unit}</span>}
                    </span>
                  </div>
                ))}
            </div>
            {recipe.waterProfile.notes && (
              <p className="text-sm text-muted-foreground mt-3 italic">{recipe.waterProfile.notes}</p>
            )}
            {recipe.waterProfile.sulfate != null && recipe.waterProfile.chloride != null && recipe.waterProfile.chloride > 0 && (
              <p className="text-xs text-muted-foreground mt-2">
                SO₄:Cl-ratio:{" "}
                <span className="text-foreground font-medium">
                  {(recipe.waterProfile.sulfate / recipe.waterProfile.chloride).toFixed(1)}:1
                </span>
              </p>
            )}
          </TabsContent>
        )}

        {/* Gjæringsprofil */}
        {recipe.fermentationProfile && recipe.fermentationProfile.length > 0 && (
          <TabsContent value="gjaering">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="pb-2 font-medium">Dag</th>
                  <th className="pb-2 font-medium">Temp</th>
                  <th className="pb-2 font-medium">Merknad</th>
                </tr>
              </thead>
              <tbody>
                {recipe.fermentationProfile.map((step, i) => (
                  <tr key={i} className="border-b border-border/50 last:border-0">
                    <td className="py-2 font-medium">{step.day}</td>
                    <td className="py-2">{step.temp}°C</td>
                    <td className="py-2 text-muted-foreground">{step.description ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
