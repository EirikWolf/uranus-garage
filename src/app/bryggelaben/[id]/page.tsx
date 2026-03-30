import { notFound } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { BrewLabChart } from "@/components/brew-lab-chart";
import { getBrewSessionWithReadings } from "@/lib/brew-sessions";
import type { Measurement } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function BrewSessionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getBrewSessionWithReadings(id);
  if (!session) notFound();

  // Convert SensorReadings to Measurement[] for BrewLabChart
  const measurements: Measurement[] = [];
  for (const r of session.readings) {
    const ts = r.timestamp.toISOString();
    if (r.temperature != null)
      measurements.push({ timestamp: ts, type: "temperature", value: r.temperature, unit: "°C" });
    if (r.gravity != null)
      measurements.push({ timestamp: ts, type: "gravity", value: r.gravity, unit: "SG" });
  }

  const abv =
    session.og && session.fg
      ? ((session.og - session.fg) * 131.25).toFixed(1)
      : session.abv?.toFixed(1) ?? null;

  const lastReading = session.readings.at(-1);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <header className="mb-8">
        <p className="text-xs text-primary font-bold tracking-wider uppercase mb-2">
          <Link href="/bryggelaben" className="hover:underline">Bryggelaben</Link>
        </p>
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-3xl font-bold">{session.name}</h1>
          {session.isActive && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-sm font-medium bg-green-500/20 text-green-400 border border-green-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Aktiv
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-2">
          <span>{new Date(session.createdOn).toLocaleDateString("no")}</span>
          {session.endingOn && (
            <span>→ {new Date(session.endingOn).toLocaleDateString("no")}</span>
          )}
          {session.deviceName && <span>Enhet: {session.deviceName}</span>}
          {lastReading && (
            <span>
              Sist oppdatert:{" "}
              {new Date(lastReading.timestamp).toLocaleString("no", {
                day: "numeric",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          )}
        </div>
      </header>

      {(session.og || session.fg || abv) && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          {session.og != null && (
            <Card className="bg-card border-border">
              <CardContent className="pt-4 text-center">
                <p className="text-xs text-muted-foreground">OG</p>
                <p className="text-2xl font-bold">{session.og.toFixed(3)}</p>
              </CardContent>
            </Card>
          )}
          {session.fg != null && (
            <Card className="bg-card border-border">
              <CardContent className="pt-4 text-center">
                <p className="text-xs text-muted-foreground">FG</p>
                <p className="text-2xl font-bold">{session.fg.toFixed(3)}</p>
              </CardContent>
            </Card>
          )}
          {abv && (
            <Card className="bg-card border-border">
              <CardContent className="pt-4 text-center">
                <p className="text-xs text-muted-foreground">ABV</p>
                <p className="text-2xl font-bold text-primary">{abv}%</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <BrewLabChart measurements={measurements} />

      {session.brewLogSlug && (
        <div className="mt-8">
          <Link
            href={`/bryggelogg/${session.brewLogSlug}`}
            className="text-primary hover:underline text-sm"
          >
            Se full bryggelogg →
          </Link>
        </div>
      )}
    </div>
  );
}
