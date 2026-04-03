"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { correctHydrometer } from "@/lib/calculators"

export function HydrometerCalculator() {
  const [sg, setSg] = useState("")
  const [temp, setTemp] = useState("")

  const sgNum = parseFloat(sg)
  const tempNum = parseFloat(temp)
  const corrected =
    !isNaN(sgNum) && !isNaN(tempNum) && sgNum > 0.9 && sgNum < 1.2
      ? correctHydrometer(sgNum, tempNum)
      : null

  const diff = corrected !== null ? Math.round((corrected - sgNum) * 10000) : null

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hydrometerjustering</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-xs text-muted-foreground -mt-2">
          Korrigerer for hydrometerkalibrert ved 20°C
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground">Avlest SG</label>
            <Input
              type="number"
              step="0.001"
              placeholder="1.060"
              value={sg}
              onChange={(e) => setSg(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground">Øltemperatur (°C)</label>
            <Input
              type="number"
              step="0.5"
              placeholder="25"
              value={temp}
              onChange={(e) => setTemp(e.target.value)}
            />
          </div>
        </div>
        <div className="rounded-lg bg-secondary px-4 py-3 text-center">
          {corrected !== null ? (
            <div className="flex flex-col items-center gap-0.5">
              <div>
                <span className="text-3xl font-bold text-primary">{corrected.toFixed(4)}</span>
                <span className="ml-1 text-lg text-muted-foreground">SG</span>
              </div>
              {diff !== null && diff !== 0 && (
                <span className="text-xs text-muted-foreground">
                  {diff > 0 ? "+" : ""}{diff} poeng korrigert
                </span>
              )}
            </div>
          ) : (
            <span className="text-muted-foreground">Oppgi avlest SG og temperatur</span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
