"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Star, Loader2 } from "lucide-react";
import Link from "next/link";

interface RatingFormProps {
  forkId: string;
  forkOwnerId: string;
  existingRating?: { value: number; comment: string | null } | null;
}

export function RatingForm({ forkId, forkOwnerId, existingRating }: RatingFormProps) {
  const { data: session } = useSession();
  const [hoveredStar, setHoveredStar] = useState(0);
  const [selectedStar, setSelectedStar] = useState(existingRating?.value || 0);
  const [comment, setComment] = useState(existingRating?.comment || "");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!session) {
    return (
      <p className="text-sm text-muted-foreground">
        <Link href="/logg-inn" className="text-primary hover:underline">Logg inn</Link> for å gi din vurdering.
      </p>
    );
  }

  if (session.user?.id === forkOwnerId) {
    return null; // Can't rate own fork
  }

  async function handleSubmit() {
    if (selectedStar === 0) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/forks/${forkId}/rate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: selectedStar, comment: comment || null }),
      });
      if (!res.ok) throw new Error("Rating failed");
      setSubmitted(true);
    } catch {
      alert("Kunne ikke sende vurdering. Prøv igjen.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="flex items-center gap-2 text-sm text-primary">
        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        Takk for din vurdering!
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => {
          const starValue = i + 1;
          const isFilled = starValue <= (hoveredStar || selectedStar);
          return (
            <button
              key={i}
              onMouseEnter={() => setHoveredStar(starValue)}
              onMouseLeave={() => setHoveredStar(0)}
              onClick={() => setSelectedStar(starValue)}
              className="p-0.5 transition-transform hover:scale-110"
            >
              <Star
                className={`h-6 w-6 ${isFilled ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
              />
            </button>
          );
        })}
        {selectedStar > 0 && (
          <span className="text-sm text-muted-foreground ml-2">{selectedStar}/5</span>
        )}
      </div>

      {selectedStar > 0 && (
        <>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Legg til en kommentar (valgfritt)..."
            rows={2}
            className="w-full bg-secondary border border-border rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg bg-primary text-primary-foreground hover:bg-primary/80 transition-colors disabled:opacity-50"
          >
            {loading ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Sender...</>
            ) : (
              "Send vurdering"
            )}
          </button>
        </>
      )}
    </div>
  );
}
