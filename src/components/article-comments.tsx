"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface CommentUser {
  id: string;
  name: string | null;
  image: string | null;
}

interface Comment {
  id: string;
  body: string;
  createdAt: string;
  user: CommentUser;
}

interface Props {
  articleId: string;
  currentUserId?: string | null;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "nettopp";
  if (minutes < 60) return `${minutes} min siden`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}t siden`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d siden`;
  return new Date(dateStr).toLocaleDateString("no", { day: "numeric", month: "short", year: "numeric" });
}

export function ArticleComments({ articleId, currentUserId }: Props) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = useCallback(async () => {
    const res = await fetch(`/api/comments?articleId=${encodeURIComponent(articleId)}`);
    if (res.ok) setComments(await res.json());
  }, [articleId]);

  useEffect(() => { fetchComments(); }, [fetchComments]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articleId, body }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Noe gikk galt");
      } else {
        setBody("");
        await fetchComments();
      }
    } catch {
      setError("Noe gikk galt. Prøv igjen.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mt-12 pt-8 border-t border-border">
      <h2 className="text-xl font-bold mb-6">
        Kommentarer{comments.length > 0 && <span className="text-muted-foreground font-normal ml-2 text-base">({comments.length})</span>}
      </h2>

      {comments.length === 0 && (
        <p className="text-muted-foreground text-sm mb-6">Ingen kommentarer ennå. Vær den første!</p>
      )}

      <div className="space-y-4 mb-8">
        {comments.map((c) => (
          <div key={c.id} className="flex gap-3">
            {c.user.image ? (
              <Image src={c.user.image} alt={c.user.name ?? ""} width={36} height={36} className="rounded-full flex-shrink-0 mt-0.5" />
            ) : (
              <div className="w-9 h-9 rounded-full bg-secondary flex-shrink-0 mt-0.5 flex items-center justify-center text-xs font-bold text-muted-foreground">
                {(c.user.name ?? "?")[0].toUpperCase()}
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-medium">{c.user.name ?? "Anonym"}</span>
                <span className="text-xs text-muted-foreground">{timeAgo(c.createdAt)}</span>
              </div>
              <p className="text-sm mt-1 leading-relaxed whitespace-pre-wrap">{c.body}</p>
            </div>
          </div>
        ))}
      </div>

      {currentUserId ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Textarea
            placeholder="Skriv en kommentar…"
            value={body}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setBody(e.target.value)}
            rows={3}
            maxLength={2000}
            className="resize-none"
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex justify-end">
            <Button type="submit" disabled={submitting || !body.trim()} size="sm">
              {submitting ? "Sender…" : "Send kommentar"}
            </Button>
          </div>
        </form>
      ) : (
        <p className="text-sm text-muted-foreground">
          <a href="/logg-inn" className="text-primary hover:underline">Logg inn</a> for å kommentere.
        </p>
      )}
    </section>
  );
}
