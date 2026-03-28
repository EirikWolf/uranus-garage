"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { calculateAbv } from "@/lib/calculators"

export function AbvCalculator() {
  const [og, setOg] = useState("")
  const [fg, setFg] = useState("")

  const ogNum = parseFloat(og)
  const fgNum = parseFloat(fg)
  const abv =
    !isNaN(ogNum) && !isNaN(fgNum) && ogNum > fgNum
      ? calculateAbv(ogNum, fgNum)
      : null

  return (
    <Card>
      <CardHeader>
        <CardTitle>ABV Calculator</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground">Original Gravity (OG)</label>
            <Input
              type="number"
              step="0.001"
              placeholder="1.060"
              value={og}
              onChange={(e) => setOg(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground">Final Gravity (FG)</label>
            <Input
              type="number"
              step="0.001"
              placeholder="1.012"
              value={fg}
              onChange={(e) => setFg(e.target.value)}
            />
          </div>
        </div>
        <div className="rounded-lg bg-secondary px-4 py-3 text-center">
          {abv !== null ? (
            <>
              <span className="text-3xl font-bold text-primary">{abv}</span>
              <span className="ml-1 text-lg text-muted-foreground">% ABV</span>
            </>
          ) : (
            <span className="text-muted-foreground">Enter OG and FG to calculate</span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
