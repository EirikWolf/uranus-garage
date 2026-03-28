"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { GitFork, Loader2, LogIn } from "lucide-react";
import Link from "next/link";

interface ForkButtonProps {
  recipeName: string;
  parentSanityId?: string;
  parentForkId?: string;
  recipeData: {
    style?: string;
    difficulty?: string;
    batchSize: number;
    grains: unknown[];
    hops: unknown[];
    yeast: unknown;
    additions?: unknown[];
    process?: unknown[];
  };
}

export function ForkButton({ recipeName, parentSanityId, parentForkId, recipeData }: ForkButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  if (!session) {
    return (
      <Link
        href="/logg-inn"
        className="inline-flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg bg-primary text-primary-foreground hover:bg-primary/80 transition-colors"
      >
        <LogIn className="h-4 w-4" />
        Logg inn for å forke
      </Link>
    );
  }

  async function handleFork() {
    setLoading(true);
    try {
      const res = await fetch("/api/forks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${recipeName} (fork)`,
          parentSanityId,
          parentForkId,
          ...recipeData,
        }),
      });

      if (!res.ok) throw new Error("Fork failed");

      const data = await res.json();
      router.push(`/forks/${data.fork.id}/rediger`);
    } catch {
      alert("Kunne ikke opprette fork. Prøv igjen.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleFork}
      disabled={loading}
      className="inline-flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg bg-primary text-primary-foreground hover:bg-primary/80 transition-colors disabled:opacity-50"
    >
      {loading ? (
        <><Loader2 className="h-4 w-4 animate-spin" /> Forker...</>
      ) : (
        <><GitFork className="h-4 w-4" /> Fork This Brew</>
      )}
    </button>
  );
}
