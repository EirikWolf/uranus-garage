"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return <p className="text-sm text-primary">Takk! Du er nå påmeldt.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="email"
        placeholder="din@epost.no"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="max-w-[240px] bg-secondary border-border"
      />
      <Button type="submit" disabled={status === "loading"} variant="default">
        {status === "loading" ? "..." : "Meld på"}
      </Button>
      {status === "error" && (
        <p className="text-sm text-red-400 self-center">Noe gikk galt.</p>
      )}
    </form>
  );
}
