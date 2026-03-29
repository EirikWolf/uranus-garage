"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Save, Plus, Trash2, Loader2 } from "lucide-react";
import type { ForkYeast } from "@/lib/prisma-types";

interface Grain { name: string; amount: number; unit: string; }
interface Hop { name: string; amount: number; time: number; alphaAcid: number; }

interface ForkData {
  id: string;
  name: string;
  description: string | null;
  style: string | null;
  difficulty: string | null;
  batchSize: number;
  grains: Grain[];
  hops: Hop[];
  yeast: { name?: string; amount?: string; type?: string };
  changeNotes: string | null;
  brewDate: string | null;
  og: number | null;
  fg: number | null;
  tastingNotes: string | null;
}

export function ForkEditor({ fork }: { fork: ForkData }) {
  const router = useRouter();
  const [name, setName] = useState(fork.name);
  const [description, setDescription] = useState(fork.description || "");
  const [batchSize, setBatchSize] = useState(String(fork.batchSize));
  const [grains, setGrains] = useState<Grain[]>(fork.grains || []);
  const [hops, setHops] = useState<Hop[]>(fork.hops || []);
  const [yeastName, setYeastName] = useState((fork.yeast as ForkYeast)?.name || "");
  const [yeastAmount, setYeastAmount] = useState((fork.yeast as ForkYeast)?.amount || "");
  const [changeNotes, setChangeNotes] = useState(fork.changeNotes || "");
  const [og, setOg] = useState(fork.og ? String(fork.og) : "");
  const [fg, setFg] = useState(fork.fg ? String(fork.fg) : "");
  const [tastingNotes, setTastingNotes] = useState(fork.tastingNotes || "");
  const [saving, setSaving] = useState(false);

  function addGrain() {
    setGrains([...grains, { name: "", amount: 0, unit: "kg" }]);
  }
  function removeGrain(i: number) {
    setGrains(grains.filter((_, idx) => idx !== i));
  }
  function updateGrain(i: number, field: keyof Grain, value: string | number) {
    setGrains(grains.map((g, idx) => idx === i ? { ...g, [field]: value } : g));
  }

  function addHop() {
    setHops([...hops, { name: "", amount: 0, time: 60, alphaAcid: 0 }]);
  }
  function removeHop(i: number) {
    setHops(hops.filter((_, idx) => idx !== i));
  }
  function updateHop(i: number, field: keyof Hop, value: string | number) {
    setHops(hops.map((h, idx) => idx === i ? { ...h, [field]: value } : h));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch(`/api/forks/${fork.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description: description || null,
          batchSize: parseFloat(batchSize) || 20,
          grains,
          hops,
          yeast: { name: yeastName, amount: yeastAmount, type: "Tørrgjær" },
          changeNotes: changeNotes || null,
          og: og ? parseFloat(og) : null,
          fg: fg ? parseFloat(fg) : null,
          tastingNotes: tastingNotes || null,
        }),
      });

      if (!res.ok) throw new Error("Save failed");
      router.push(`/forks/${fork.id}`);
    } catch {
      alert("Kunne ikke lagre. Prøv igjen.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Basic info */}
      <Card className="bg-card border-border">
        <CardContent className="pt-6 space-y-4">
          <div>
            <label className="text-sm font-medium">Navn</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} className="bg-secondary border-border mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium">Beskrivelse</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="w-full bg-secondary border border-border rounded-lg p-3 text-sm mt-1 resize-none focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="text-sm font-medium">Batchstørrelse (L)</label>
            <Input type="number" value={batchSize} onChange={(e) => setBatchSize(e.target.value)} className="bg-secondary border-border mt-1 max-w-[120px]" />
          </div>
        </CardContent>
      </Card>

      {/* Grains */}
      <Card className="bg-card border-border">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-3">Malt</h3>
          <div className="space-y-2">
            {grains.map((g, i) => (
              <div key={i} className="grid grid-cols-4 gap-2 items-end">
                <div><Input placeholder="Maltnavn" value={g.name} onChange={(e) => updateGrain(i, "name", e.target.value)} className="bg-secondary border-border" /></div>
                <div><Input type="number" step="0.1" placeholder="Mengde" value={g.amount} onChange={(e) => updateGrain(i, "amount", parseFloat(e.target.value) || 0)} className="bg-secondary border-border" /></div>
                <div>
                  <select value={g.unit} onChange={(e) => updateGrain(i, "unit", e.target.value)} className="w-full bg-secondary border border-border rounded-lg p-2 text-sm">
                    <option value="kg">kg</option>
                    <option value="g">g</option>
                  </select>
                </div>
                <button onClick={() => removeGrain(i)} className="text-muted-foreground hover:text-foreground p-2"><Trash2 className="h-4 w-4" /></button>
              </div>
            ))}
          </div>
          <button onClick={addGrain} className="mt-3 inline-flex items-center gap-1 text-sm text-primary hover:underline"><Plus className="h-4 w-4" /> Legg til malt</button>
        </CardContent>
      </Card>

      {/* Hops */}
      <Card className="bg-card border-border">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-3">Humle</h3>
          <div className="space-y-2">
            {hops.map((h, i) => (
              <div key={i} className="grid grid-cols-5 gap-2 items-end">
                <div><Input placeholder="Humlenavn" value={h.name} onChange={(e) => updateHop(i, "name", e.target.value)} className="bg-secondary border-border" /></div>
                <div><Input type="number" placeholder="g" value={h.amount} onChange={(e) => updateHop(i, "amount", parseFloat(e.target.value) || 0)} className="bg-secondary border-border" /></div>
                <div><Input type="number" placeholder="min" value={h.time} onChange={(e) => updateHop(i, "time", parseFloat(e.target.value) || 0)} className="bg-secondary border-border" /></div>
                <div><Input type="number" step="0.1" placeholder="AA%" value={h.alphaAcid} onChange={(e) => updateHop(i, "alphaAcid", parseFloat(e.target.value) || 0)} className="bg-secondary border-border" /></div>
                <button onClick={() => removeHop(i)} className="text-muted-foreground hover:text-foreground p-2"><Trash2 className="h-4 w-4" /></button>
              </div>
            ))}
          </div>
          <button onClick={addHop} className="mt-3 inline-flex items-center gap-1 text-sm text-primary hover:underline"><Plus className="h-4 w-4" /> Legg til humle</button>
        </CardContent>
      </Card>

      {/* Yeast */}
      <Card className="bg-card border-border">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-3">Gjær</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-muted-foreground">Navn</label>
              <Input value={yeastName} onChange={(e) => setYeastName(e.target.value)} className="bg-secondary border-border mt-1" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Mengde</label>
              <Input value={yeastAmount} onChange={(e) => setYeastAmount(e.target.value)} className="bg-secondary border-border mt-1" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Change notes */}
      <Card className="bg-card border-border border-l-4 border-l-primary">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-2">Hva endret du?</h3>
          <p className="text-xs text-muted-foreground mb-3">Beskriv eksperimentet ditt — dette vises i diff-visningen.</p>
          <textarea value={changeNotes} onChange={(e) => setChangeNotes(e.target.value)} rows={3} placeholder="F.eks: Byttet Citra med Nelson Sauvin for mer drueaktig karakter..." className="w-full bg-secondary border border-border rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring" />
        </CardContent>
      </Card>

      {/* Brew results (optional) */}
      <Card className="bg-card border-border">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-3">Bryggeresultater (valgfritt)</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs text-muted-foreground">OG</label>
              <Input type="number" step="0.001" placeholder="1.050" value={og} onChange={(e) => setOg(e.target.value)} className="bg-secondary border-border mt-1" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">FG</label>
              <Input type="number" step="0.001" placeholder="1.010" value={fg} onChange={(e) => setFg(e.target.value)} className="bg-secondary border-border mt-1" />
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Smaksnotater</label>
            <textarea value={tastingNotes} onChange={(e) => setTastingNotes(e.target.value)} rows={3} placeholder="Hvordan smakte ølet?" className="w-full bg-secondary border border-border rounded-lg p-3 text-sm mt-1 resize-none focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
        </CardContent>
      </Card>

      {/* Save button */}
      <button
        onClick={handleSave}
        disabled={saving || !name.trim()}
        className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/80 transition-colors disabled:opacity-50"
      >
        {saving ? (
          <><Loader2 className="h-4 w-4 animate-spin" /> Lagrer...</>
        ) : (
          <><Save className="h-4 w-4" /> Lagre endringer</>
        )}
      </button>
    </div>
  );
}
