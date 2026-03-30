"use client";

import { useState } from "react";
import { RefreshCw, Download } from "lucide-react";

export function BrewLabAdmin() {
  const [importing, setImporting] = useState(false);
  const [polling, setPolling] = useState(false);
  const [importMsg, setImportMsg] = useState<string | null>(null);
  const [pollMsg, setPollMsg] = useState<string | null>(null);

  async function handleImport() {
    setImporting(true);
    setImportMsg(null);
    try {
      const res = await fetch("/api/rapt/import", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Feil");
      setImportMsg(`Importert: ${data.imported}, allerede lagret: ${data.skipped}`);
    } catch (e) {
      setImportMsg(`Feil: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setImporting(false);
    }
  }

  async function handlePoll() {
    setPolling(true);
    setPollMsg(null);
    try {
      const res = await fetch("/api/rapt/poll");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Feil");
      setPollMsg(`Lagret ${data.saved} nye avlesninger`);
    } catch (e) {
      setPollMsg(`Feil: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setPolling(false);
    }
  }

  return (
    <div className="flex flex-wrap gap-3 items-center mb-8 p-4 bg-secondary rounded-lg border border-border">
      <span className="text-xs text-muted-foreground font-medium">Admin:</span>
      <button
        onClick={handleImport}
        disabled={importing}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg bg-primary text-primary-foreground hover:bg-primary/80 disabled:opacity-50 transition-colors"
      >
        <Download className="h-3.5 w-3.5" />
        {importing ? "Importerer..." : "Importer historikk"}
      </button>
      <button
        onClick={handlePoll}
        disabled={polling}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border border-border bg-background hover:bg-muted disabled:opacity-50 transition-colors"
      >
        <RefreshCw className="h-3.5 w-3.5" />
        {polling ? "Synker..." : "Synk nå"}
      </button>
      {importMsg && <span className="text-xs text-muted-foreground">{importMsg}</span>}
      {pollMsg && <span className="text-xs text-muted-foreground">{pollMsg}</span>}
    </div>
  );
}
