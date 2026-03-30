"use client";

import { useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Download, Scale } from "lucide-react";
import { generateBeerXml } from "@/lib/beerxml";
import type { ForkGrain, ForkHop, ForkYeast } from "@/lib/prisma-types";

interface Props {
  forkName: string;
  style: string | null;
  originalBatchSize: number;
  grains: ForkGrain[];
  hops: ForkHop[];
  yeast: ForkYeast;
}

export function ForkScaler({ forkName, style, originalBatchSize, grains, hops, yeast }: Props) {
  const [batchSize, setBatchSize] = useState(String(originalBatchSize));
  const [scaledGrains, setScaledGrains] = useState<ForkGrain[]>(grains);
  const [scaledHops, setScaledHops] = useState<ForkHop[]>(hops);
  const [scalePending, setScalePending] = useState(false);
  const lastScaled = useRef(originalBatchSize);

  function handleBatchChange(val: string) {
    setBatchSize(val);
    const newSize = parseFloat(val);
    setScalePending(newSize > 0 && newSize !== lastScaled.current);
  }

  function applyScaling() {
    const newSize = parseFloat(batchSize);
    if (!newSize || newSize <= 0) return;
    const factor = newSize / lastScaled.current;
    setScaledGrains(grains.map((g) => ({
      ...g,
      amount: Math.round(g.amount * factor * 100) / 100,
    })));
    setScaledHops(hops.map((h) => ({
      ...h,
      amount: Math.round(h.amount * factor * 10) / 10,
    })));
    lastScaled.current = newSize;
    setScalePending(false);
  }

  function handleBeerXmlExport() {
    const currentSize = parseFloat(batchSize) || originalBatchSize;
    const xml = generateBeerXml({
      _id: "fork",
      name: forkName,
      slug: { current: "" },
      style: style || "",
      description: "",
      difficulty: "middels",
      batchSize: currentSize,
      grains: scaledGrains.map((g) => ({ name: g.name, amount: g.amount, unit: g.unit as "kg" | "g" })),
      hops: scaledHops.map((h) => ({ name: h.name, amount: h.amount, time: h.time, alphaAcid: h.alphaAcid })),
      yeast: { name: yeast.name || "", amount: yeast.amount || "", type: yeast.type || "" },
      additions: [],
      process: [],
    });
    const blob = new Blob([xml], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${forkName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.xml`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      {/* Batch size scaler */}
      <Card className="bg-card border-border mb-6">
        <CardContent className="pt-4 pb-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium whitespace-nowrap">Batchstørrelse (L)</label>
              <Input
                type="number"
                value={batchSize}
                onChange={(e) => handleBatchChange(e.target.value)}
                className="bg-secondary border-border w-24"
              />
            </div>
            {scalePending && (
              <button
                onClick={applyScaling}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg bg-primary text-primary-foreground hover:bg-primary/80 transition-colors"
              >
                <Scale className="h-4 w-4" />
                Skaler ingredienser
              </button>
            )}
            <button
              onClick={handleBeerXmlExport}
              className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border border-border bg-secondary text-secondary-foreground hover:bg-muted transition-colors"
            >
              <Download className="h-4 w-4" />
              Last ned BeerXML
            </button>
          </div>
          {scalePending && (
            <p className="text-xs text-muted-foreground mt-2">
              Klikk for å skalere fra {lastScaled.current} L → {batchSize} L
            </p>
          )}
        </CardContent>
      </Card>

      {/* Scaled ingredients */}
      {scaledGrains.length > 0 && (
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-3">Malt</h3>
            <div className="space-y-2">
              {scaledGrains.map((g, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span>{g.name}</span>
                  <span className="text-primary font-mono">{g.amount} {g.unit}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {scaledHops.length > 0 && (
        <Card className="bg-card border-border mt-6">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-3">Humle</h3>
            <div className="space-y-2">
              {scaledHops.map((h, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span>{h.name} ({h.alphaAcid}% AA)</span>
                  <span className="text-primary font-mono">
                    {h.amount}g @ {h.time === -1 ? "dry hop" : `${h.time} min`}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {yeast?.name && (
        <Card className="bg-card border-border mt-6">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-3">Gjær</h3>
            <p className="text-sm">{yeast.name} — {yeast.amount}</p>
          </CardContent>
        </Card>
      )}
    </>
  );
}
