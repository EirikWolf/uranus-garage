"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4 text-center">
      <h2 className="text-2xl font-bold">Noe gikk galt</h2>
      <p className="text-muted-foreground max-w-md">
        {error.message || "En uventet feil oppstod. Prøv igjen."}
      </p>
      <button
        onClick={reset}
        className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
      >
        Prøv igjen
      </button>
    </div>
  );
}
