"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import type { YeastProfile } from "@/lib/types";

const YEAST_PRESETS: { label: string; value: YeastProfile }[] = [
  {
    label: "Safale US-05 (Ale, nøytral)",
    value: { name: "US-05", attenuation: 0.81, tempRangeLow: 15, tempRangeHigh: 24, tempOptimal: 19, flocculationRate: 0.7, type: "ale" },
  },
  {
    label: "Safale S-04 (Ale, engelsk)",
    value: { name: "S-04", attenuation: 0.75, tempRangeLow: 15, tempRangeHigh: 24, tempOptimal: 20, flocculationRate: 0.9, type: "ale" },
  },
  {
    label: "Nottingham (Ale, allround)",
    value: { name: "Nottingham", attenuation: 0.80, tempRangeLow: 14, tempRangeHigh: 21, tempOptimal: 17, flocculationRate: 0.85, type: "ale" },
  },
  {
    label: "W-34/70 (Lager, klassisk)",
    value: { name: "W-34/70", attenuation: 0.82, tempRangeLow: 9, tempRangeHigh: 15, tempOptimal: 12, flocculationRate: 0.75, type: "lager" },
  },
  {
    label: "Voss Kveik (Ale, rask + fruktik)",
    value: { name: "Voss Kveik", attenuation: 0.80, tempRangeLow: 25, tempRangeHigh: 42, tempOptimal: 37, flocculationRate: 0.8, type: "ale" },
  },
  {
    label: "LalBrew Verdant IPA (Hazy/NEIPA)",
    value: { name: "Verdant IPA", attenuation: 0.73, tempRangeLow: 17, tempRangeHigh: 23, tempOptimal: 20, flocculationRate: 0.4, type: "ale" },
  },
  {
    label: "WY3724 Belgian Saison",
    value: { name: "Belgian Saison", attenuation: 0.85, tempRangeLow: 20, tempRangeHigh: 35, tempOptimal: 28, flocculationRate: 0.3, type: "wild" },
  },
];

function calcPitchRate(og: number, liters: number, type: "ale" | "lager" | "wild") {
  const plato = ((og - 1) * 1000) / 4;
  const rate = type === "lager" ? 1.5 : 0.75;
  return Math.round(rate * plato * liters);
}

export function BrewTwinForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [og, setOg] = useState(1.055);
  const [tempC, setTempC] = useState(19);
  const [liters, setLiters] = useState(20);
  const [presetIdx, setPresetIdx] = useState(0);
  const [pitchOverride, setPitchOverride] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const preset = YEAST_PRESETS[presetIdx];
  const yeast = preset.value;
  const pitchRate = pitchOverride ?? calcPitchRate(og, liters, yeast.type);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/simulations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name || `${yeast.name} — OG ${og.toFixed(3)}`,
          og,
          fermentationTempC: tempC,
          yeast,
          batchSizeLiters: liters,
          pitchRateBillionCells: pitchRate,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Feil");
      router.push(`/brew-twin/${data.simulation.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Noe gikk galt");
      setLoading(false);
    }
  }

  const tempWarning =
    tempC < yeast.tempRangeLow
      ? `⚠ Under gjærens minimum (${yeast.tempRangeLow}°C)`
      : tempC > yeast.tempRangeHigh
        ? `⚠ Over gjærens maks (${yeast.tempRangeHigh}°C)`
        : null;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name */}
      <div>
        <label className="block text-sm font-medium mb-1">Navn på simulering</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={`${yeast.name} — OG ${og.toFixed(3)}`}
          className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      {/* Yeast preset */}
      <div>
        <label className="block text-sm font-medium mb-1">Gjær</label>
        <select
          value={presetIdx}
          onChange={(e) => {
            setPresetIdx(Number(e.target.value));
            setPitchOverride(null);
            const newYeast = YEAST_PRESETS[Number(e.target.value)].value;
            setTempC(newYeast.tempOptimal);
          }}
          className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
        >
          {YEAST_PRESETS.map((p, i) => (
            <option key={i} value={i}>{p.label}</option>
          ))}
        </select>
        <p className="text-xs text-muted-foreground mt-1">
          Attenuation: {Math.round(yeast.attenuation * 100)}% · Område: {yeast.tempRangeLow}–{yeast.tempRangeHigh}°C · Optimal: {yeast.tempOptimal}°C
        </p>
      </div>

      {/* OG + Liters */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">OG (original gravity)</label>
          <input
            type="number"
            min={1.01}
            max={1.15}
            step={0.001}
            value={og}
            onChange={(e) => { setOg(parseFloat(e.target.value)); setPitchOverride(null); }}
            className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Batchstørrelse (liter)</label>
          <input
            type="number"
            min={1}
            max={500}
            step={1}
            value={liters}
            onChange={(e) => { setLiters(parseFloat(e.target.value)); setPitchOverride(null); }}
            className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Temperature */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Gjæringstemperatur: <span className="font-mono text-primary">{tempC}°C</span>
        </label>
        <input
          type="range"
          min={1}
          max={45}
          step={0.5}
          value={tempC}
          onChange={(e) => setTempC(parseFloat(e.target.value))}
          className="w-full accent-primary"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-0.5">
          <span>1°C</span>
          <span className={tempWarning ? "text-yellow-400 font-medium" : "text-muted-foreground"}>
            {tempWarning ?? `Optimal: ${yeast.tempOptimal}°C`}
          </span>
          <span>45°C</span>
        </div>
      </div>

      {/* Pitch rate */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Pitch rate (milliarder celler)
          <span className="text-xs font-normal text-muted-foreground ml-2">— beregnet automatisk</span>
        </label>
        <input
          type="number"
          min={1}
          max={10000}
          step={1}
          value={pitchRate}
          onChange={(e) => setPitchOverride(Math.round(parseFloat(e.target.value)))}
          className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary"
        />
        {pitchOverride !== null && (
          <button
            type="button"
            onClick={() => setPitchOverride(null)}
            className="text-xs text-primary hover:underline mt-1"
          >
            Tilbakestill til beregnet verdi
          </button>
        )}
      </div>

      {/* Summary card */}
      <Card className="bg-secondary border-border">
        <CardContent className="pt-4 pb-3">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">Forhåndsvisning</p>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-xs text-muted-foreground">Pred. FG</p>
              <p className="font-mono font-bold">{(og - (og - 1) * yeast.attenuation).toFixed(3)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Pred. ABV</p>
              <p className="font-mono font-bold text-primary">
                {((og - (og - (og - 1) * yeast.attenuation)) * 131.25).toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Gjærtype</p>
              <p className="font-mono font-bold capitalize">{yeast.type}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/80 disabled:opacity-50 transition-colors"
      >
        {loading ? "Kjører simulering…" : "Kjør simulering →"}
      </button>
    </form>
  );
}
