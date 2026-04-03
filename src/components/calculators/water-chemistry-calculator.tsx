"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  calculateMineralAdditions,
  WATER_STYLE_PROFILES,
  type WaterIons,
} from "@/lib/calculators"

const SOURCE_PRESETS: Record<string, WaterIons> = {
  oslo: WATER_STYLE_PROFILES.oslo,
  distilled: WATER_STYLE_PROFILES.distilled,
}

const TARGET_PRESETS: Record<string, { label: string; profile: WaterIons }> = {
  pilsen:    { label: "Pilsen (lager)",        profile: WATER_STYLE_PROFILES.pilsen },
  munich:    { label: "München (dunkel/weizen)", profile: WATER_STYLE_PROFILES.munich },
  burton:    { label: "Burton (IPA/bitter)",    profile: WATER_STYLE_PROFILES.burton },
  london:    { label: "London (bitter/ESB)",    profile: WATER_STYLE_PROFILES.london },
  dublin:    { label: "Dublin (stout/porter)",  profile: WATER_STYLE_PROFILES.dublin },
  oslo:      { label: "Oslo (pale ale/lager)",  profile: WATER_STYLE_PROFILES.oslo },
  distilled: { label: "Destillert (nøytralt)",  profile: WATER_STYLE_PROFILES.distilled },
}

const ION_LABELS: { key: keyof WaterIons; label: string }[] = [
  { key: "calcium",     label: "Ca²⁺" },
  { key: "magnesium",   label: "Mg²⁺" },
  { key: "sodium",      label: "Na⁺" },
  { key: "chloride",    label: "Cl⁻" },
  { key: "sulfate",     label: "SO₄²⁻" },
  { key: "bicarbonate", label: "HCO₃⁻" },
]

const MINERAL_LABELS: Record<string, string> = {
  gypsum:  "Gips (CaSO₄)",
  cacl2:   "Kalsiumklorid (CaCl₂)",
  epsom:   "Bittersalt (MgSO₄)",
  nacl:    "Bordsalt (NaCl)",
  nahco3:  "Natron (NaHCO₃)",
}

type SourcePreset = "oslo" | "distilled" | "custom"

const emptyIons = (): WaterIons => ({
  calcium: 0, magnesium: 0, sodium: 0, chloride: 0, sulfate: 0, bicarbonate: 0,
})

export function WaterChemistryCalculator() {
  const [sourcePreset, setSourcePreset] = useState<SourcePreset>("oslo")
  const [customSource, setCustomSource] = useState<WaterIons>(emptyIons())
  const [targetKey, setTargetKey] = useState("pilsen")
  const [volume, setVolume] = useState("20")

  const source: WaterIons =
    sourcePreset === "custom" ? customSource : SOURCE_PRESETS[sourcePreset]

  const target = TARGET_PRESETS[targetKey]?.profile ?? WATER_STYLE_PROFILES.pilsen
  const volumeNum = parseFloat(volume)

  const result = useMemo(() => {
    if (!volumeNum || volumeNum <= 0) return null
    return calculateMineralAdditions(source, target, volumeNum)
  }, [source, target, volumeNum])

  function setIon(key: keyof WaterIons, val: string) {
    const num = parseFloat(val)
    setCustomSource((prev) => ({ ...prev, [key]: isNaN(num) ? 0 : num }))
  }

  const hasAnyAddition = result
    ? Object.entries(result.additions).some(([k, v]) => k !== "chalk" && v > 0)
    : false

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vannkjemi</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <p className="text-xs text-muted-foreground -mt-2">
          Beregner mineraliltsetninger for å matche en målvannprofil
        </p>

        {/* Source */}
        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium">Kildvann</label>
          <div className="flex gap-2 flex-wrap">
            {(["oslo", "distilled", "custom"] as SourcePreset[]).map((p) => (
              <button
                key={p}
                onClick={() => setSourcePreset(p)}
                className={`rounded px-3 py-1 text-xs border transition-colors ${
                  sourcePreset === p
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {p === "oslo" ? "Oslo kranvann" : p === "distilled" ? "Destillert" : "Tilpasset"}
              </button>
            ))}
          </div>

          {sourcePreset === "custom" && (
            <div className="grid grid-cols-3 gap-2 mt-1">
              {ION_LABELS.map(({ key, label }) => (
                <div key={key} className="flex flex-col gap-1">
                  <label className="text-xs text-muted-foreground">{label} ppm</label>
                  <Input
                    type="number"
                    min="0"
                    step="1"
                    placeholder="0"
                    value={customSource[key] || ""}
                    onChange={(e) => setIon(key, e.target.value)}
                  />
                </div>
              ))}
            </div>
          )}

          {sourcePreset !== "custom" && (
            <div className="flex gap-3 flex-wrap text-xs text-muted-foreground">
              {ION_LABELS.map(({ key, label }) => (
                <span key={key}>{label}: {source[key]}</span>
              ))}
            </div>
          )}
        </div>

        {/* Target */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Målprofil</label>
          <select
            value={targetKey}
            onChange={(e) => setTargetKey(e.target.value)}
            className="rounded-md border border-border bg-background px-3 py-2 text-sm"
          >
            {Object.entries(TARGET_PRESETS).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
          <div className="flex gap-3 flex-wrap text-xs text-muted-foreground">
            {ION_LABELS.map(({ key, label }) => (
              <span key={key}>{label}: {target[key]}</span>
            ))}
          </div>
        </div>

        {/* Volume */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Meskevannsvolum (liter)</label>
          <Input
            type="number"
            min="1"
            step="1"
            placeholder="20"
            value={volume}
            onChange={(e) => setVolume(e.target.value)}
            className="max-w-[120px]"
          />
        </div>

        {/* Results */}
        {result && (
          <>
            <div className="rounded-lg bg-secondary p-4">
              <p className="text-sm font-medium mb-3">Mineraliltsetninger</p>
              {hasAnyAddition ? (
                <table className="w-full text-sm">
                  <tbody>
                    {Object.entries(result.additions)
                      .filter(([k, v]) => k !== "chalk" && v > 0)
                      .map(([k, v]) => (
                        <tr key={k} className="border-b border-border/50 last:border-0">
                          <td className="py-1.5 text-muted-foreground">{MINERAL_LABELS[k] ?? k}</td>
                          <td className="py-1.5 text-right font-mono font-semibold text-primary">
                            {v} g
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Ingen tilsetninger nødvendig — kildevann møter allerede målprofilen.
                </p>
              )}
            </div>

            {/* Ion comparison */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-muted-foreground">
                    <th className="text-left pb-2 font-normal">Ion</th>
                    <th className="text-right pb-2 font-normal">Kilde</th>
                    <th className="text-right pb-2 font-normal">Mål</th>
                    <th className="text-right pb-2 font-normal text-primary">Resultat</th>
                  </tr>
                </thead>
                <tbody>
                  {ION_LABELS.map(({ key, label }) => (
                    <tr key={key} className="border-t border-border/40">
                      <td className="py-1.5 text-muted-foreground">{label}</td>
                      <td className="py-1.5 text-right">{source[key]}</td>
                      <td className="py-1.5 text-right">{target[key]}</td>
                      <td className="py-1.5 text-right font-semibold text-primary">
                        {result.resultingProfile[key]}
                      </td>
                    </tr>
                  ))}
                  <tr className="border-t border-border/40">
                    <td className="py-1.5 text-muted-foreground">SO₄:Cl</td>
                    <td className="py-1.5 text-right">
                      {source.chloride > 0 ? (source.sulfate / source.chloride).toFixed(1) : "—"}
                    </td>
                    <td className="py-1.5 text-right">
                      {target.chloride > 0 ? (target.sulfate / target.chloride).toFixed(1) : "—"}
                    </td>
                    <td className="py-1.5 text-right font-semibold text-primary">
                      {result.resultingProfile.chloride > 0
                        ? (result.resultingProfile.sulfate / result.resultingProfile.chloride).toFixed(1)
                        : "—"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
