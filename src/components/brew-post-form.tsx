"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function BrewPostForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [brewDate, setBrewDate] = useState("");
  const [tagsRaw, setTagsRaw] = useState("");
  const [imagesRaw, setImagesRaw] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const images = imagesRaw
      .split("\n")
      .map((u) => u.trim())
      .filter((u) => u.startsWith("http"));

    const tags = tagsRaw
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      const res = await fetch("/api/bryggeblogg", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, text, images, brewDate: brewDate || null, tags }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Noe gikk galt");
        return;
      }

      const post = await res.json();
      router.push(`/bryggeblogg/${post.id}`);
    } catch {
      setError("Noe gikk galt. Prøv igjen.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Del en bryggedag</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Tittel *</label>
            <Input
              placeholder="f.eks. Endelig brygget NEIPA — her er resultatet!"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              minLength={2}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Tekst *</label>
            <Textarea
              placeholder="Fortell om bryggingen — hva gikk bra, hva gikk galt, smaksnotater..."
              value={text}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value)}
              rows={6}
              required
              minLength={10}
              className="resize-y"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Bryggdato</label>
              <Input
                type="date"
                value={brewDate}
                onChange={(e) => setBrewDate(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Tagger</label>
              <Input
                placeholder="IPA, tørr-humle, 23L (komma-separert)"
                value={tagsRaw}
                onChange={(e) => setTagsRaw(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Bilder</label>
            <Textarea
              placeholder={"Lim inn bilde-URLer, én per linje:\nhttps://eksempel.no/bilde1.jpg\nhttps://eksempel.no/bilde2.jpg"}
              value={imagesRaw}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setImagesRaw(e.target.value)}
              rows={3}
              className="resize-none font-mono text-xs"
            />
            <p className="text-xs text-muted-foreground">
              Lim inn offentlige bilde-URLer (én per linje). Tips: last opp til imgur.com eller lignende.
            </p>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Avbryt
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Publiserer…" : "Publiser innlegg"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
