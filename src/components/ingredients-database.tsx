"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, ChevronDown, ChevronUp } from "lucide-react";
import type {
  Fermentable,
  Hop,
  Yeast,
} from "@prisma/client";

// ─── Norwegian labels ────────────────────────────────────────────────────────

const CATEGORY_NO: Record<string, string> = {
  Grain: "Korn",
  Fruit: "Frukt",
  Sugar: "Sukker",
  Adjunct: "Tilsetning",
  "Dry Extract": "Tørrextrakt",
  "Liquid Extract": "Flytende ekstrakt",
  Extract: "Ekstrakt",
};

const PURPOSE_NO: Record<string, string> = {
  Bittering: "Bittersetting",
  Aroma: "Aroma",
  "Bittering & Aroma": "Bitter & aroma",
  Dual: "Dobbel",
  "Dual Purpose": "Dobbel",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function unique(arr: (string | null | undefined)[]): string[] {
  return [...new Set(arr.filter(Boolean) as string[])].sort();
}

function matchesSearch(name: string, q: string): boolean {
  return name.toLowerCase().includes(q.toLowerCase());
}

// ─── Shared filter row ────────────────────────────────────────────────────────

function FilterSelect({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-secondary border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
    >
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}

// ─── Expandable detail row ────────────────────────────────────────────────────

function DetailRow({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <div className="flex gap-2 text-xs">
      <span className="text-muted-foreground min-w-[120px]">{label}</span>
      <span className="text-foreground">{value}</span>
    </div>
  );
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────

type Tab = "malt" | "humle" | "gjaer";

// ─── Fermentables tab ─────────────────────────────────────────────────────────

function FermentablesTab({ items }: { items: Fermentable[] }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [country, setCountry] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const categories = unique(items.map((i) => i.category));
  const countries = unique(items.map((i) => i.country));

  const filtered = items.filter(
    (i) =>
      matchesSearch(i.name, search) &&
      (!category || i.category === category) &&
      (!country || i.country === country)
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Søk etter malt eller gjærbar..."
            className="w-full bg-secondary border border-border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <FilterSelect
          value={category}
          onChange={setCategory}
          options={categories}
          placeholder="Alle kategorier"
        />
        <FilterSelect
          value={country}
          onChange={setCountry}
          options={countries}
          placeholder="Alle land"
        />
      </div>

      <p className="text-xs text-muted-foreground">
        Viser {filtered.length} av {items.length} ingredienser
      </p>

      <div className="space-y-2">
        {filtered.map((item) => (
          <Card
            key={item.id}
            className="bg-card border-border cursor-pointer hover:border-muted-foreground/40 transition-colors"
            onClick={() => setExpanded(expanded === item.id ? null : item.id)}
          >
            <CardContent className="pt-4 pb-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{item.name}</span>
                    {item.category && (
                      <Badge variant="outline" className="text-xs">
                        {CATEGORY_NO[item.category] ?? item.category}
                      </Badge>
                    )}
                    {item.country && (
                      <span className="text-xs text-muted-foreground">{item.country}</span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                    {item.type && <span>{item.type}</span>}
                    {item.colorLovibond != null && (
                      <span>{item.colorLovibond} °L</span>
                    )}
                    {item.ppg != null && <span>PPG {item.ppg}</span>}
                    {item.recipesCount != null && (
                      <span>{item.recipesCount.toLocaleString("nb-NO")} oppskrifter</span>
                    )}
                  </div>
                </div>
                {expanded === item.id ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                )}
              </div>

              {expanded === item.id && (
                <div className="mt-3 pt-3 border-t border-border space-y-1">
                  <DetailRow label="Produsent" value={item.manufacturer} />
                  <DetailRow label="Kategori" value={item.category} />
                  <DetailRow label="Type" value={item.type} />
                  <DetailRow
                    label="Farge"
                    value={item.colorLovibond != null ? `${item.colorLovibond} °L` : null}
                  />
                  <DetailRow label="PPG" value={item.ppg != null ? String(item.ppg) : null} />
                  <DetailRow label="Land" value={item.country} />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── Hops tab ─────────────────────────────────────────────────────────────────

function HopsTab({ items }: { items: Hop[] }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [country, setCountry] = useState("");
  const [purpose, setPurpose] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const categories = unique(items.map((i) => i.category));
  const countries = unique(items.map((i) => i.country));
  const purposes = unique(items.map((i) => i.purpose));

  const filtered = items.filter(
    (i) =>
      matchesSearch(i.name, search) &&
      (!category || i.category === category) &&
      (!country || i.country === country) &&
      (!purpose || i.purpose === purpose)
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Søk etter humle..."
            className="w-full bg-secondary border border-border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <FilterSelect
          value={category}
          onChange={setCategory}
          options={categories}
          placeholder="Alle kategorier"
        />
        <FilterSelect
          value={country}
          onChange={setCountry}
          options={countries}
          placeholder="Alle land"
        />
        <FilterSelect
          value={purpose}
          onChange={setPurpose}
          options={purposes}
          placeholder="Alle bruksområder"
        />
      </div>

      <p className="text-xs text-muted-foreground">
        Viser {filtered.length} av {items.length} humlesorter
      </p>

      <div className="space-y-2">
        {filtered.map((item) => (
          <Card
            key={item.id}
            className="bg-card border-border cursor-pointer hover:border-muted-foreground/40 transition-colors"
            onClick={() => setExpanded(expanded === item.id ? null : item.id)}
          >
            <CardContent className="pt-4 pb-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{item.name}</span>
                    {item.purpose && (
                      <Badge variant="outline" className="text-xs">
                        {PURPOSE_NO[item.purpose] ?? item.purpose}
                      </Badge>
                    )}
                    {item.country && (
                      <span className="text-xs text-muted-foreground">{item.country}</span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                    {item.alphaAcid && <span>α {item.alphaAcid}</span>}
                    {item.characteristics && (
                      <span className="line-clamp-1">{item.characteristics}</span>
                    )}
                  </div>
                </div>
                {expanded === item.id ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                )}
              </div>

              {expanded === item.id && (
                <div className="mt-3 pt-3 border-t border-border space-y-1">
                  <DetailRow label="Kategori" value={item.category} />
                  <DetailRow label="Bruksområde" value={item.purpose} />
                  <DetailRow label="Land" value={item.country} />
                  <DetailRow label="Alfasyre" value={item.alphaAcid} />
                  <DetailRow label="Betasyre" value={item.betaAcid} />
                  <DetailRow label="Egenskaper" value={item.characteristics} />
                  <DetailRow label="Erstatninger" value={item.substitutes} />
                  <DetailRow label="Stilguide" value={item.styleGuide} />
                  <DetailRow label="Total olje" value={item.totalOil} />
                  <DetailRow label="Myrcen" value={item.myrcene} />
                  <DetailRow label="Humulen" value={item.humulene} />
                  {item.description && (
                    <p className="text-xs text-muted-foreground mt-2 pt-2 border-t border-border">
                      {item.description}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── Yeasts tab ───────────────────────────────────────────────────────────────

const FLOC_NO: Record<string, string> = {
  Low: "Lav",
  "Low/Med": "Lav/middels",
  Medium: "Middels",
  "Med/High": "Middels/høy",
  High: "Høy",
  "Very High": "Svært høy",
};

function YeastsTab({ items }: { items: Yeast[] }) {
  const [search, setSearch] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [type, setType] = useState("");
  const [flocculation, setFlocculation] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const manufacturers = unique(items.map((i) => i.manufacturer));
  const types = unique(items.map((i) => i.type));
  const flocLevels = unique(items.map((i) => i.flocculation));

  const filtered = items.filter(
    (i) =>
      (matchesSearch(i.name, search) ||
        matchesSearch(i.displayName ?? "", search)) &&
      (!manufacturer || i.manufacturer === manufacturer) &&
      (!type || i.type === type) &&
      (!flocculation || i.flocculation === flocculation)
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Søk etter gjær..."
            className="w-full bg-secondary border border-border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <FilterSelect
          value={manufacturer}
          onChange={setManufacturer}
          options={manufacturers}
          placeholder="Alle produsenter"
        />
        <FilterSelect
          value={type}
          onChange={setType}
          options={types}
          placeholder="Alle typer"
        />
        <FilterSelect
          value={flocculation}
          onChange={setFlocculation}
          options={flocLevels}
          placeholder="Alle flokkuleringsnivåer"
        />
      </div>

      <p className="text-xs text-muted-foreground">
        Viser {filtered.length} av {items.length} gjærstammer
      </p>

      <div className="space-y-2">
        {filtered.map((item) => (
          <Card
            key={item.id}
            className="bg-card border-border cursor-pointer hover:border-muted-foreground/40 transition-colors"
            onClick={() => setExpanded(expanded === item.id ? null : item.id)}
          >
            <CardContent className="pt-4 pb-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-medium text-sm">
                      {item.displayName ?? item.name}
                    </span>
                    {item.type && (
                      <Badge variant="outline" className="text-xs">
                        {item.type === "Liquid" ? "Flytende" : item.type === "Dry" ? "Tørr" : item.type}
                      </Badge>
                    )}
                    {item.manufacturer && (
                      <span className="text-xs text-muted-foreground">
                        {item.manufacturer}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                    {item.flocculation && (
                      <span>
                        Flokkulering: {FLOC_NO[item.flocculation] ?? item.flocculation}
                      </span>
                    )}
                    {item.attenuation && <span>Attenuering: {item.attenuation}</span>}
                    {item.temperature && <span>{item.temperature}</span>}
                  </div>
                </div>
                {expanded === item.id ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                )}
              </div>

              {expanded === item.id && (
                <div className="mt-3 pt-3 border-t border-border space-y-1">
                  <DetailRow label="Produsent" value={item.manufacturer} />
                  <DetailRow label="Kode" value={item.code} />
                  <DetailRow label="Kategori" value={item.category} />
                  <DetailRow label="Type" value={item.type} />
                  <DetailRow
                    label="Flokkuleringsnivå"
                    value={
                      item.flocculation
                        ? (FLOC_NO[item.flocculation] ?? item.flocculation)
                        : null
                    }
                  />
                  <DetailRow label="Attenuering" value={item.attenuation} />
                  <DetailRow label="Temperatur" value={item.temperature} />
                  {item.description && (
                    <p className="text-xs text-muted-foreground mt-2 pt-2 border-t border-border">
                      {item.description}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

const TAB_LABELS: Record<Tab, string> = {
  malt: "Malt & gjærbare",
  humle: "Humle",
  gjaer: "Gjær",
};

export function IngredientsDatabase({
  fermentables,
  hops,
  yeasts,
}: {
  fermentables: Fermentable[];
  hops: Hop[];
  yeasts: Yeast[];
}) {
  const [tab, setTab] = useState<Tab>("malt");

  return (
    <div className="space-y-6">
      {/* Tab bar */}
      <div className="flex border-b border-border">
        {(["malt", "humle", "gjaer"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              tab === t
                ? "border-foreground text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {TAB_LABELS[t]}
            <span className="ml-2 text-xs text-muted-foreground">
              (
              {t === "malt"
                ? fermentables.length
                : t === "humle"
                  ? hops.length
                  : yeasts.length}
              )
            </span>
          </button>
        ))}
      </div>

      {tab === "malt" && <FermentablesTab items={fermentables} />}
      {tab === "humle" && <HopsTab items={hops} />}
      {tab === "gjaer" && <YeastsTab items={yeasts} />}
    </div>
  );
}
