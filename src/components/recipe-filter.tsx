"use client";

import { useState, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RecipeCard } from "@/components/recipe-card";
import type { Recipe } from "@/lib/types";

interface Props {
  recipes: Recipe[];
}

export function RecipeFilter({ recipes }: Props) {
  const [styleFilter, setStyleFilter] = useState("alle");
  const [difficultyFilter, setDifficultyFilter] = useState("alle");

  const styles = useMemo(() => {
    const set = new Set<string>();
    recipes.forEach((r) => { if (r.style) set.add(r.style); });
    return Array.from(set).sort();
  }, [recipes]);

  const filtered = useMemo(() => {
    return recipes.filter((r) => {
      const matchesStyle = styleFilter === "alle" || r.style === styleFilter;
      const matchesDifficulty = difficultyFilter === "alle" || r.difficulty === difficultyFilter;
      return matchesStyle && matchesDifficulty;
    });
  }, [recipes, styleFilter, difficultyFilter]);

  const difficultyLabels: Record<string, string> = {
    nybegynner: "Nybegynner",
    middels: "Middels",
    avansert: "Avansert",
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <Select value={styleFilter} onValueChange={(v) => setStyleFilter(v ?? "alle")}>
          <SelectTrigger className="w-full sm:w-52">
            <SelectValue placeholder="Øltype" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="alle">Alle øltyper</SelectItem>
            {styles.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={difficultyFilter} onValueChange={(v) => setDifficultyFilter(v ?? "alle")}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Vanskelighetsgrad" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="alle">Alle nivåer</SelectItem>
            {["nybegynner", "middels", "avansert"].map((d) => (
              <SelectItem key={d} value={d}>{difficultyLabels[d]}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {(styleFilter !== "alle" || difficultyFilter !== "alle") && (
          <button
            onClick={() => { setStyleFilter("alle"); setDifficultyFilter("alle"); }}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors self-center"
          >
            Nullstill filter
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <p className="text-muted-foreground">Ingen oppskrifter matcher filteret.</p>
      ) : (
        <div>
          {(styleFilter !== "alle" || difficultyFilter !== "alle") && (
            <p className="text-sm text-muted-foreground mb-4">
              Viser {filtered.length} av {recipes.length} oppskrifter
            </p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((recipe) => (
              <RecipeCard key={recipe._id} recipe={recipe} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
