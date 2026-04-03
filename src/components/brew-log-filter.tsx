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
import { BrewLogCard } from "@/components/brew-log-card";
import type { BrewLog } from "@/lib/types";

interface Props {
  logs: BrewLog[];
}

export function BrewLogFilter({ logs }: Props) {
  const [search, setSearch] = useState("");
  const [styleFilter, setStyleFilter] = useState("alle");
  const [yearFilter, setYearFilter] = useState("alle");

  const styles = useMemo(() => {
    const set = new Set<string>();
    logs.forEach((l) => { if (l.beer?.style) set.add(l.beer.style); });
    return Array.from(set).sort();
  }, [logs]);

  const years = useMemo(() => {
    const set = new Set<string>();
    logs.forEach((l) => { if (l.date) set.add(l.date.slice(0, 4)); });
    return Array.from(set).sort((a, b) => b.localeCompare(a));
  }, [logs]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return logs.filter((l) => {
      const matchesSearch =
        !q ||
        l.title.toLowerCase().includes(q) ||
        l.brewers?.some((b) => b.name.toLowerCase().includes(q)) ||
        l.beer?.name.toLowerCase().includes(q);
      const matchesStyle =
        styleFilter === "alle" || l.beer?.style === styleFilter;
      const matchesYear =
        yearFilter === "alle" || l.date?.startsWith(yearFilter);
      return matchesSearch && matchesStyle && matchesYear;
    });
  }, [logs, search, styleFilter, yearFilter]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <Input
          placeholder="Søk etter brygg, øl eller brygger…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1"
        />
        <Select value={styleFilter} onValueChange={(v) => setStyleFilter(v ?? "alle")}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Ølstil" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="alle">Alle stiler</SelectItem>
            {styles.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={yearFilter} onValueChange={(v) => setYearFilter(v ?? "alle")}>
          <SelectTrigger className="w-full sm:w-32">
            <SelectValue placeholder="År" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="alle">Alle år</SelectItem>
            {years.map((y) => (
              <SelectItem key={y} value={y}>{y}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <p className="text-muted-foreground">Ingen bryggelogger matcher søket.</p>
      ) : (
        <div className="space-y-4">
          {filtered.length < logs.length && (
            <p className="text-sm text-muted-foreground">
              Viser {filtered.length} av {logs.length} brygg
            </p>
          )}
          {filtered.map((log) => (
            <BrewLogCard key={log._id} log={log} />
          ))}
        </div>
      )}
    </div>
  );
}
