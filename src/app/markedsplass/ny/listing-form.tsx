"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const TYPES = [
  { value: "selger", label: "Selger" },
  { value: "kjoper", label: "Kjøper" },
  { value: "bytter", label: "Bytter" },
];

export function ListingForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("selger");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit() {
    if (!title.trim() || !description.trim() || !location.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, type, price: price || null, location }),
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      router.push(`/markedsplass/${data.listing.id}`);
    } catch {
      alert("Kunne ikke opprette annonse. Prøv igjen.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="bg-card border-border">
      <CardContent className="pt-6 space-y-4">
        <div>
          <label className="text-sm font-medium">Tittel</label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="F.eks: Grainfather G30 til salgs" className="bg-secondary border-border mt-1" />
        </div>

        <div>
          <label className="text-sm font-medium">Beskrivelse</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} placeholder="Beskriv utstyret, tilstand, osv." className="w-full bg-secondary border border-border rounded-lg p-3 text-sm mt-1 resize-none focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>

        <div>
          <label className="text-sm font-medium">Type</label>
          <div className="flex gap-2 mt-1">
            {TYPES.map((t) => (
              <button
                key={t.value}
                onClick={() => setType(t.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  type === t.value ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Pris</label>
            <Input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="F.eks: 5000kr, Gratis, Bytte" className="bg-secondary border-border mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium">Lokasjon</label>
            <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="F.eks: Oslo, Bergen" className="bg-secondary border-border mt-1" />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={saving || !title.trim() || !description.trim() || !location.trim()}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/80 transition-colors disabled:opacity-50"
        >
          {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Oppretter...</> : "Opprett annonse"}
        </button>
      </CardContent>
    </Card>
  );
}
