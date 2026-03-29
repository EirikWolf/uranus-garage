"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, UserPlus } from "lucide-react";

export function JoinSwapButton({ swapId }: { swapId: string }) {
  const router = useRouter();
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  async function handleJoin() {
    setLoading(true);
    try {
      const res = await fetch(`/api/brew-swap/${swapId}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: plan || null }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Kunne ikke melde på");
      }
      router.refresh();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Kunne ikke melde på");
    } finally {
      setLoading(false);
    }
  }

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="mb-6 inline-flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg bg-primary text-primary-foreground hover:bg-primary/80 transition-colors"
      >
        <UserPlus className="h-4 w-4" /> Meld deg på
      </button>
    );
  }

  return (
    <div className="mb-6 p-4 bg-card rounded-lg border border-border space-y-3">
      <label className="text-sm font-medium">Hva vil du gjøre med din porsjon? (valgfritt)</label>
      <textarea
        value={plan}
        onChange={(e) => setPlan(e.target.value)}
        rows={2}
        placeholder="F.eks: Gjære med Kveik og dry-hoppe med Nelson Sauvin..."
        className="w-full bg-secondary border border-border rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
      />
      <button
        onClick={handleJoin}
        disabled={loading}
        className="inline-flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg bg-primary text-primary-foreground hover:bg-primary/80 transition-colors disabled:opacity-50"
      >
        {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Melder på...</> : "Bekreft påmelding"}
      </button>
    </div>
  );
}
