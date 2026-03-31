"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export function ImportIngredientsButton({
  counts,
}: {
  counts: { fermentables: number; hops: number; yeasts: number };
}) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    fermentables: number;
    hops: number;
    yeasts: number;
  } | null>(null);

  const hasData =
    counts.fermentables > 0 || counts.hops > 0 || counts.yeasts > 0;

  async function handleImport() {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/ingredients/import", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setResult(data);
        // Reload page to show fresh data
        window.location.reload();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1 shrink-0">
      <Button
        onClick={handleImport}
        disabled={loading}
        variant="outline"
        size="sm"
        className="gap-2"
      >
        <Download className="h-4 w-4" />
        {loading
          ? "Importerer..."
          : hasData
            ? "Synkroniser fra BeerAPI"
            : "Importer fra BeerAPI"}
      </Button>
      {result && (
        <p className="text-xs text-muted-foreground">
          Importert: {result.fermentables} malt · {result.hops} humle ·{" "}
          {result.yeasts} gjær
        </p>
      )}
    </div>
  );
}
