"use client";

import { Download } from "lucide-react";
import { generateBeerXml } from "@/lib/beerxml";
import type { Recipe } from "@/lib/types";

export function BeerXmlExportButton({ recipe }: { recipe: Recipe }) {
  function handleExport() {
    const xml = generateBeerXml(recipe);
    const blob = new Blob([xml], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${recipe.slug.current}.xml`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <button
      onClick={handleExport}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border border-border bg-secondary text-secondary-foreground hover:bg-muted transition-colors"
    >
      <Download className="h-4 w-4" />
      Last ned BeerXML
    </button>
  );
}
