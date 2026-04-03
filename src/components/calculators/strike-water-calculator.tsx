"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { calculateStrikeTemp } from "@/lib/calculators"

export function StrikeWaterCalculator() {
  const [mashTemp, setMashTemp] = useState("")
  const [grainTemp, setGrainTemp] = useState("")
  const [ratio, setRatio] = useState("")

  const mashNum = parseFloat(mashTemp)
  const grainNum = parseFloat(grainTemp)
  const ratioNum = parseFloat(ratio)

  const strike =
    !isNaN(mashNum) && !isNaN(grainNum) && !isNaN(ratioNum) && ratioNum > 0
      ? calculateStrikeTemp(mashNum, grainNum, ratioNum)
      : null

  return (
    <Card>
      <CardHeader>
        <CardTitle>Innmeskingstemperatur</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-xs text-muted-foreground -mt-2">
          Palmers formel — beregner starttemperatur på meskevannet
        </p>
        <div className="grid grid-cols-3 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground">Mål-mesketemperatur (°C)</label>
            <Input
              type="number"
              step="0.5"
              placeholder="67"
              value={mashTemp}
              onChange={(e) => setMashTemp(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground">Korntemperatur (°C)</label>
            <Input
              type="number"
              step="0.5"
              placeholder="20"
              value={grainTemp}
              onChange={(e) => setGrainTemp(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground">Vann/malt-ratio (L/kg)</label>
            <Input
              type="number"
              step="0.1"
              placeholder="3.0"
              value={ratio}
              onChange={(e) => setRatio(e.target.value)}
            />
          </div>
        </div>
        <div className="rounded-lg bg-secondary px-4 py-3 text-center">
          {strike !== null ? (
            <>
              <span className="text-3xl font-bold text-primary">{strike}</span>
              <span className="ml-1 text-lg text-muted-foreground">°C innmeskingstemperatur</span>
            </>
          ) : (
            <span className="text-muted-foreground">Fyll inn alle tre verdier</span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
