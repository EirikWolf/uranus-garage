"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { calculatePitchRate } from "@/lib/calculators"

type YeastType = "ale" | "lager"

export function PitchRateCalculator() {
  const t = useTranslations("calculators.pitchRate")
  const [og, setOg] = useState("")
  const [volume, setVolume] = useState("")
  const [type, setType] = useState<YeastType>("ale")

  const ogNum = parseFloat(og)
  const volumeNum = parseFloat(volume)
  const result =
    !isNaN(ogNum) && !isNaN(volumeNum) && ogNum > 1 && volumeNum > 0
      ? calculatePitchRate(ogNum, volumeNum, type)
      : null

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground">{t("og")}</label>
            <Input
              type="number"
              step="0.001"
              placeholder="1.060"
              value={og}
              onChange={(e) => setOg(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground">{t("volume")}</label>
            <Input
              type="number"
              placeholder="20"
              value={volume}
              onChange={(e) => setVolume(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setType("ale")}
            className={[
              "flex-1 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors",
              type === "ale"
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-background text-muted-foreground hover:bg-muted",
            ].join(" ")}
          >
            {t("ale")}
          </button>
          <button
            onClick={() => setType("lager")}
            className={[
              "flex-1 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors",
              type === "lager"
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-background text-muted-foreground hover:bg-muted",
            ].join(" ")}
          >
            {t("lager")}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { key: "billionCells", value: result?.billionCells, unit: "B" },
            { key: "dryYeast", value: result?.dryYeastGrams, unit: "g" },
            { key: "liquidPacks", value: result?.liquidYeastPacks, unit: "packs" },
            { key: "starter", value: result?.starterLiters, unit: "L" },
          ].map(({ key, value, unit }) => (
            <div key={key} className="rounded-lg bg-secondary px-3 py-2 flex flex-col gap-0.5">
              <span className="text-xs text-muted-foreground">{t(key as "billionCells" | "dryYeast" | "liquidPacks" | "starter")}</span>
              {value !== undefined ? (
                <div>
                  <span className="text-xl font-bold text-primary">{value}</span>
                  <span className="ml-1 text-sm text-muted-foreground">{unit}</span>
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">—</span>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
