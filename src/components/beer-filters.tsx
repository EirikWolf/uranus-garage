"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BeerCard } from "./beer-card";
import type { Beer } from "@/lib/types";

export function BeerFilters({ beers }: { beers: Beer[] }) {
  const [search, setSearch] = useState("");
  const [styleFilter, setStyleFilter] = useState("all");

  const styles = useMemo(() => {
    const unique = new Set(beers.map((b) => b.style).filter(Boolean));
    return Array.from(unique).sort();
  }, [beers]);

  const filtered = useMemo(() => {
    return beers.filter((beer) => {
      const matchesSearch =
        !search ||
        beer.name.toLowerCase().includes(search.toLowerCase()) ||
        beer.flavorTags?.some((t) =>
          t.toLowerCase().includes(search.toLowerCase()),
        );
      const matchesStyle = styleFilter === "all" || beer.style === styleFilter;
      return matchesSearch && matchesStyle;
    });
  }, [beers, search, styleFilter]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <Input
          placeholder="Søk etter øl eller smak..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-secondary border-border max-w-sm"
        />
        <Select
          value={styleFilter}
          onValueChange={(value) => setStyleFilter(value ?? "all")}
        >
          <SelectTrigger className="w-[180px] bg-secondary border-border">
            <SelectValue placeholder="Alle stiler" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle stiler</SelectItem>
            {styles.map((style) => (
              <SelectItem key={style} value={style}>
                {style}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <p className="text-muted-foreground">Ingen øl funnet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((beer) => (
            <BeerCard key={beer._id} beer={beer} />
          ))}
        </div>
      )}
    </div>
  );
}
