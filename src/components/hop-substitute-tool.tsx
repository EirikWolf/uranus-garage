"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, ArrowRight, Star } from "lucide-react";
import { getAllHopNames, getHopSubstitutes } from "@/lib/hop-substitutes";

const categoryColors: Record<string, string> = {
  american: "bg-blue-900/50 text-blue-300 border-blue-700",
  european: "bg-green-900/50 text-green-300 border-green-700",
  australian: "bg-yellow-900/50 text-yellow-300 border-yellow-700",
  other: "bg-purple-900/50 text-purple-300 border-purple-700",
};

const categoryLabels: Record<string, string> = {
  american: "Amerikansk",
  european: "Europeisk",
  australian: "Australsk",
  other: "Annet",
};

export function HopSubstituteTool() {
  const [selected, setSelected] = useState("");
  const [search, setSearch] = useState("");
  const allHops = getAllHopNames();

  const filtered = search
    ? allHops.filter((h) => h.toLowerCase().includes(search.toLowerCase()))
    : allHops;

  const result = selected ? getHopSubstitutes(selected) : null;

  return (
    <div className="space-y-6">
      {/* Search/Select */}
      <Card className="bg-card border-border">
        <CardContent className="pt-6">
          <label className="text-sm font-medium mb-2 block">Hvilken humle har du gått tom for?</label>
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setSelected(""); }}
              placeholder="Søk etter humle..."
              className="w-full bg-secondary border border-border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {filtered.map((hop) => (
              <button
                key={hop}
                onClick={() => { setSelected(hop); setSearch(""); }}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  selected === hop
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {hop}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <div className="space-y-4">
          {/* Selected hop profile */}
          <Card className="bg-card border-border border-l-4 border-l-primary">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold">{result.profile.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Alfa: {result.profile.alpha} — {result.profile.origin}
                  </p>
                </div>
                <Badge variant="outline" className={categoryColors[result.profile.category] ?? ""}>
                  {categoryLabels[result.profile.category]}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-1 mt-3">
                {result.profile.aroma.map((a) => (
                  <span key={a} className="text-xs bg-secondary px-2 py-0.5 rounded">{a}</span>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Substitutes */}
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <ArrowRight className="h-4 w-4 text-primary" />
            Foreslåtte erstatninger ({result.substitutes.length})
          </h3>

          <div className="space-y-3">
            {result.substitutes
              .sort((a, b) => b.similarity - a.similarity)
              .map((sub) => (
                <Card key={sub.name} className="bg-card border-border hover:bg-accent transition-colors">
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold">{sub.name}</span>
                          <div className="flex gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${i < sub.similarity ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{sub.notes}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      )}

      {!selected && (
        <p className="text-sm text-muted-foreground text-center py-8">
          Velg humlen du mangler, så foreslår vi alternativer med smaksnotater.
        </p>
      )}
    </div>
  );
}
