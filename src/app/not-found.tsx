import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4 text-center">
      <h2 className="text-2xl font-bold">404 — Siden finnes ikke</h2>
      <p className="text-muted-foreground max-w-md">
        Vi fant ikke det du lette etter. Kanskje det ble flyttet eller slettet?
      </p>
      <Link
        href="/"
        className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
      >
        Tilbake til forsiden
      </Link>
    </div>
  );
}
