"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export function SwapForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [baseRecipe, setBaseRecipe] = useState("");
  const [totalLiters, setTotalLiters] = useState("50");
  const [portionSize, setPortionSize] = useState("10");
  const [maxParticipants, setMaxParticipants] = useState("5");
  const [brewDate, setBrewDate] = useState("");
  const [location, setLocation] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit() {
    if (!title.trim() || !brewDate || !location.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/brew-swap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title, description, baseRecipe: baseRecipe || null,
          totalLiters, portionSize, maxParticipants, brewDate, location,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      router.push(`/brew-swap/${data.swap.id}`);
    } catch {
      alert("Kunne ikke opprette swap. Prøv igjen.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="bg-card border-border">
      <CardContent className="pt-6 space-y-4">
        <div>
          <label className="text-sm font-medium">Tittel</label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="F.eks: Vørter-deling — Nøytral Pale Ale base" className="bg-secondary border-border mt-1" />
        </div>

        <div>
          <label className="text-sm font-medium">Beskrivelse</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Hva er planen? Hva slags base-vørter brygger du?" className="w-full bg-secondary border border-border rounded-lg p-3 text-sm mt-1 resize-none focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>

        <div>
          <label className="text-sm font-medium">Base-oppskrift (valgfritt)</label>
          <textarea value={baseRecipe} onChange={(e) => setBaseRecipe(e.target.value)} rows={2} placeholder="Kort beskrivelse av maltbase, eventuell humle i koket..." className="w-full bg-secondary border border-border rounded-lg p-3 text-sm mt-1 resize-none focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium">Totalt volum (L)</label>
            <Input type="number" value={totalLiters} onChange={(e) => setTotalLiters(e.target.value)} className="bg-secondary border-border mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium">Per deltaker (L)</label>
            <Input type="number" value={portionSize} onChange={(e) => setPortionSize(e.target.value)} className="bg-secondary border-border mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium">Maks deltakere</label>
            <Input type="number" value={maxParticipants} onChange={(e) => setMaxParticipants(e.target.value)} className="bg-secondary border-border mt-1" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Bryggedato</label>
            <Input type="date" value={brewDate} onChange={(e) => setBrewDate(e.target.value)} className="bg-secondary border-border mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium">Lokasjon</label>
            <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="F.eks: Garasjen, Oslo" className="bg-secondary border-border mt-1" />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={saving || !title.trim() || !brewDate || !location.trim()}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/80 transition-colors disabled:opacity-50"
        >
          {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Oppretter...</> : "Opprett Brew-Swap"}
        </button>
      </CardContent>
    </Card>
  );
}
