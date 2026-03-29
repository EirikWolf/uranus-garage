"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Plus, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { calculateIbu, type HopAddition } from "@/lib/calculators"

interface HopRow extends HopAddition {
  id: number
}

let nextId = 1

const defaultHop = (): HopRow => ({
  id: nextId++,
  amountGrams: 0,
  alphaAcid: 0,
  boilMinutes: 60,
})

export function IbuCalculator() {
  const t = useTranslations("calculators.ibu")
  const [hops, setHops] = useState<HopRow[]>([defaultHop()])
  const [batchLiters, setBatchLiters] = useState("")
  const [og, setOg] = useState("")

  const batchNum = parseFloat(batchLiters)
  const ogNum = parseFloat(og)
  const validHops = hops.filter(
    (h) => h.amountGrams > 0 && h.alphaAcid > 0 && h.boilMinutes >= 0
  )
  const ibu =
    !isNaN(batchNum) && !isNaN(ogNum) && batchNum > 0 && ogNum > 1
      ? calculateIbu(validHops, batchNum, ogNum)
      : null

  const addHop = () => setHops((prev) => [...prev, defaultHop()])

  const removeHop = (id: number) =>
    setHops((prev) => prev.filter((h) => h.id !== id))

  const updateHop = (id: number, field: keyof HopAddition, value: string) => {
    const num = parseFloat(value)
    setHops((prev) =>
      prev.map((h) => (h.id === id ? { ...h, [field]: isNaN(num) ? 0 : num } : h))
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 text-xs text-muted-foreground px-1">
            <span>{t("amount")}</span>
            <span>{t("alphaAcid")}</span>
            <span>{t("boilTime")}</span>
            <span className="w-7" />
          </div>
          {hops.map((hop) => (
            <div key={hop.id} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 items-center">
              <Input
                type="number"
                placeholder="28"
                defaultValue={hop.amountGrams || ""}
                onChange={(e) => updateHop(hop.id, "amountGrams", e.target.value)}
              />
              <Input
                type="number"
                step="0.1"
                placeholder="5.5"
                defaultValue={hop.alphaAcid || ""}
                onChange={(e) => updateHop(hop.id, "alphaAcid", e.target.value)}
              />
              <Input
                type="number"
                placeholder="60"
                defaultValue={hop.boilMinutes}
                onChange={(e) => updateHop(hop.id, "boilMinutes", e.target.value)}
              />
              <button
                onClick={() => removeHop(hop.id)}
                disabled={hops.length === 1}
                className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:pointer-events-none disabled:opacity-30"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={addHop} className="mt-1 w-full">
            <Plus className="size-3.5" />
            {t("addHop")}
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground">{t("batchSize")}</label>
            <Input
              type="number"
              placeholder="20"
              value={batchLiters}
              onChange={(e) => setBatchLiters(e.target.value)}
            />
          </div>
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
        </div>

        <div className="rounded-lg bg-secondary px-4 py-3 text-center">
          {ibu !== null ? (
            <>
              <span className="text-3xl font-bold text-primary">{ibu}</span>
              <span className="ml-1 text-lg text-muted-foreground">IBU</span>
            </>
          ) : (
            <span className="text-muted-foreground">Enter batch size and OG to calculate</span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
