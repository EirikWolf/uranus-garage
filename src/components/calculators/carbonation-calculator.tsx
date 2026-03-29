"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { calculateCarbonation } from "@/lib/calculators"

interface StylePreset {
  label: string
  co2: number
}

const STYLE_PRESETS: StylePreset[] = [
  { label: "British Ales", co2: 1.8 },
  { label: "Stout", co2: 2.0 },
  { label: "American Ales", co2: 2.4 },
  { label: "German Lager", co2: 2.6 },
  { label: "Belgian Ales", co2: 2.8 },
  { label: "Wheat Beer", co2: 3.2 },
  { label: "Belgian Trippel", co2: 3.5 },
]

export function CarbonationCalculator() {
  const t = useTranslations("calculators.carbonation")
  const [co2, setCo2] = useState("")
  const [volume, setVolume] = useState("")
  const [temp, setTemp] = useState("")

  const co2Num = parseFloat(co2)
  const volumeNum = parseFloat(volume)
  const tempNum = parseFloat(temp)
  const result =
    !isNaN(co2Num) && !isNaN(volumeNum) && !isNaN(tempNum) && volumeNum > 0
      ? calculateCarbonation(co2Num, volumeNum, tempNum)
      : null

  const selectPreset = (preset: StylePreset) => {
    setCo2(String(preset.co2))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-1.5">
          {STYLE_PRESETS.map((preset) => (
            <button
              key={preset.label}
              onClick={() => selectPreset(preset)}
              className={[
                "rounded-md border px-2 py-1 text-xs font-medium transition-colors",
                parseFloat(co2) === preset.co2
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-background text-muted-foreground hover:bg-muted",
              ].join(" ")}
            >
              {preset.label} ({preset.co2})
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground">{t("co2Target")}</label>
            <Input
              type="number"
              step="0.1"
              placeholder="2.4"
              value={co2}
              onChange={(e) => setCo2(e.target.value)}
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
          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground">{t("beerTemp")}</label>
            <Input
              type="number"
              placeholder="20"
              value={temp}
              onChange={(e) => setTemp(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { key: "sugarTotal", value: result?.sugarGrams, unit: "g" },
            { key: "sugarPerLiter", value: result?.sugarGramsPerLiter, unit: "g/L" },
            { key: "pressure", value: result?.psi, unit: "PSI" },
          ].map(({ key, value, unit }) => (
            <div key={key} className="rounded-lg bg-secondary px-3 py-2 flex flex-col gap-0.5">
              <span className="text-xs text-muted-foreground">{t(key as "sugarTotal" | "sugarPerLiter" | "pressure")}</span>
              {value !== undefined ? (
                <div>
                  <span className="text-xl font-bold text-primary">{value}</span>
                  <span className="ml-1 text-xs text-muted-foreground">{unit}</span>
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
