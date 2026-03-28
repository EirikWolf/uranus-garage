"use client"

import { useState } from "react"
import { Plus, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { calculateSrm, type GrainBill } from "@/lib/calculators"

const SRM_COLORS = [
  "#F8F753", "#F6F513", "#ECE61A", "#D5BC26", "#BF923B",
  "#A36629", "#8D4C32", "#7C3D22", "#6B2D1A", "#5D341A",
  "#4E2A0C", "#3F2307", "#361F04", "#2C1503", "#261716",
  "#1F120B", "#19100A", "#120D07", "#0F0B0A", "#080707",
]

function srmToColor(srm: number): string {
  const index = Math.min(Math.max(0, Math.round(srm / 2) - 1), SRM_COLORS.length - 1)
  return SRM_COLORS[index] ?? SRM_COLORS[SRM_COLORS.length - 1]!
}

interface GrainRow extends GrainBill {
  id: number
}

let nextId = 1

const defaultGrain = (): GrainRow => ({
  id: nextId++,
  weightKg: 0,
  lovibond: 0,
})

export function SrmCalculator() {
  const [grains, setGrains] = useState<GrainRow[]>([defaultGrain()])
  const [batchLiters, setBatchLiters] = useState("")

  const batchNum = parseFloat(batchLiters)
  const validGrains = grains.filter((g) => g.weightKg > 0 && g.lovibond > 0)
  const srm =
    !isNaN(batchNum) && batchNum > 0 && validGrains.length > 0
      ? calculateSrm(validGrains, batchNum)
      : null

  const addGrain = () => setGrains((prev) => [...prev, defaultGrain()])

  const removeGrain = (id: number) =>
    setGrains((prev) => prev.filter((g) => g.id !== id))

  const updateGrain = (id: number, field: keyof GrainBill, value: string) => {
    const num = parseFloat(value)
    setGrains((prev) =>
      prev.map((g) => (g.id === id ? { ...g, [field]: isNaN(num) ? 0 : num } : g))
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>SRM Color Calculator</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-[1fr_1fr_auto] gap-2 text-xs text-muted-foreground px-1">
            <span>Weight (kg)</span>
            <span>Lovibond (°L)</span>
            <span className="w-7" />
          </div>
          {grains.map((grain) => (
            <div key={grain.id} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-center">
              <Input
                type="number"
                step="0.1"
                placeholder="4.0"
                defaultValue={grain.weightKg || ""}
                onChange={(e) => updateGrain(grain.id, "weightKg", e.target.value)}
              />
              <Input
                type="number"
                step="0.5"
                placeholder="2"
                defaultValue={grain.lovibond || ""}
                onChange={(e) => updateGrain(grain.id, "lovibond", e.target.value)}
              />
              <button
                onClick={() => removeGrain(grain.id)}
                disabled={grains.length === 1}
                className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:pointer-events-none disabled:opacity-30"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={addGrain} className="mt-1 w-full">
            <Plus className="size-3.5" />
            Add Grain
          </Button>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground">Batch Size (L)</label>
          <Input
            type="number"
            placeholder="20"
            value={batchLiters}
            onChange={(e) => setBatchLiters(e.target.value)}
          />
        </div>

        <div className="rounded-lg bg-secondary px-4 py-3 flex items-center justify-between gap-4">
          {srm !== null ? (
            <>
              <div>
                <span className="text-3xl font-bold text-primary">{srm}</span>
                <span className="ml-1 text-lg text-muted-foreground">SRM</span>
              </div>
              <div
                className="size-12 rounded-full border border-border shrink-0"
                style={{ backgroundColor: srmToColor(srm) }}
                title={`SRM ${srm} color`}
              />
            </>
          ) : (
            <span className="text-muted-foreground">Enter grain bill and batch size</span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
