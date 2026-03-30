import { notFound } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BrewTwinChart } from "@/components/brew-twin-chart";
import type { SimulationResult } from "@/lib/types";

export const dynamic = "force-dynamic";

const RISK_COLORS = {
  lav: "text-green-400 bg-green-500/10 border-green-500/30",
  middels: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
  hoy: "text-red-400 bg-red-500/10 border-red-500/30",
};

const RISK_LABELS = { lav: "Lav", middels: "Middels", hoy: "Høy" };
const PHASE_LABELS: Record<string, string> = {
  lag: "Lagfase", aktiv: "Aktiv gjæring", nedbremsing: "Nedbremsing", ettermodning: "Ettermodning",
};

export default async function SimuleringPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  const sim = await prisma.simulation.findUnique({
    where: { id },
    include: { user: { select: { name: true } } },
  });

  if (!sim) notFound();
  if (!sim.isPublic && sim.userId !== session?.user?.id) notFound();

  const result = sim.result as unknown as SimulationResult;
  const { params: p, predictedFg, predictedAbv, durationHours, flavorFlags, curve } = result;

  const durationDays = Math.round(durationHours / 24);
  const activePhaseDuration = curve.filter((pt) => pt.phase === "aktiv").length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <header className="mb-8">
        <p className="text-xs text-primary font-bold tracking-wider uppercase mb-2">
          <Link href="/brew-twin" className="hover:underline">Brew Twin</Link>
        </p>
        <h1 className="text-3xl font-bold">{sim.name}</h1>
        <p className="text-sm text-muted-foreground mt-2">
          {p.yeast.name} · {p.fermentationTempC}°C · {p.batchSizeLiters}L ·{" "}
          {new Date(sim.createdAt).toLocaleDateString("no")}
        </p>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: "OG", value: p.og.toFixed(3) },
          { label: "Pred. FG", value: predictedFg.toFixed(3) },
          { label: "Pred. ABV", value: `${predictedAbv}%`, accent: true },
          { label: "Ferdig om", value: `~${durationDays}d` },
        ].map(({ label, value, accent }) => (
          <Card key={label} className="bg-card border-border">
            <CardContent className="pt-4 text-center">
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className={`text-2xl font-bold font-mono ${accent ? "text-primary" : ""}`}>{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart */}
      <div className="mb-8">
        <BrewTwinChart curve={curve} predictedFg={predictedFg} />
      </div>

      {/* Phase summary */}
      <div className="mb-8">
        <h2 className="font-semibold mb-3">Faser</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(["lag", "aktiv", "nedbremsing", "ettermodning"] as const).map((phase) => {
            const count = curve.filter((pt) => pt.phase === phase).length;
            if (count === 0) return null;
            return (
              <div key={phase} className="bg-secondary rounded-lg p-3 text-center">
                <p className="text-xs text-muted-foreground">{PHASE_LABELS[phase]}</p>
                <p className="font-bold">{Math.round(count / 24)}d</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Flavor flags */}
      {flavorFlags.length > 0 ? (
        <div className="mb-8">
          <h2 className="font-semibold mb-3">Smaksrisiko</h2>
          <div className="space-y-3">
            {flavorFlags.map((flag) => (
              <div
                key={flag.compound}
                className={`rounded-lg border p-4 ${RISK_COLORS[flag.risk]}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold capitalize">{flag.compound}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${RISK_COLORS[flag.risk]}`}>
                    {RISK_LABELS[flag.risk]} risiko
                  </span>
                </div>
                <p className="text-sm opacity-90 mb-1">{flag.reason}</p>
                <p className="text-xs opacity-75">💡 {flag.recommendation}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="mb-8 rounded-lg border border-green-500/30 bg-green-500/10 p-4 text-green-400">
          <p className="font-semibold">Ingen smaksrisiko oppdaget</p>
          <p className="text-sm opacity-80 mt-1">Parameterne dine ser gode ut for ren gjæring.</p>
        </div>
      )}

      {/* Params detail */}
      <div className="text-sm text-muted-foreground border-t border-border pt-6 mt-6">
        <h3 className="font-medium text-foreground mb-2">Parametre</h3>
        <div className="grid grid-cols-2 gap-1">
          <span>Gjær:</span><span className="font-mono">{p.yeast.name}</span>
          <span>Attenuation:</span><span className="font-mono">{Math.round(p.yeast.attenuation * 100)}%</span>
          <span>Temperaturområde:</span><span className="font-mono">{p.yeast.tempRangeLow}–{p.yeast.tempRangeHigh}°C</span>
          <span>Aktiv gjæring:</span><span className="font-mono">~{activePhaseDuration}t</span>
          <span>Pitch rate:</span><span className="font-mono">{p.pitchRateBillionCells}B celler</span>
          <span>Batchstørrelse:</span><span className="font-mono">{p.batchSizeLiters}L</span>
        </div>
      </div>
    </div>
  );
}
