import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { SimulationParams } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Brew Twin — Uranus Garage",
  description: "Simuler gjæringsprosessen og forutsi smaksrisiko før du brygger.",
};

export default async function BrewTwinPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-3">Brew Twin</h1>
        <p className="text-muted-foreground mb-6">
          Simuler gjæringsprosessen og forutsi smaksrisiko — før du brygger.
        </p>
        <p className="text-sm text-muted-foreground">
          Du må være innlogget for å bruke Brew Twin.
        </p>
      </div>
    );
  }

  const simulations = await prisma.simulation.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, params: true, createdAt: true },
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-bold">Brew Twin</h1>
        <Link
          href="/brew-twin/ny"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/80 transition-colors"
        >
          + Ny simulering
        </Link>
      </div>
      <p className="text-muted-foreground mb-8">
        Simuler gjæringsprosessen og forutsi smaksrisiko basert på gjær, temperatur og OG.
      </p>

      {simulations.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border rounded-xl">
          <p className="text-muted-foreground mb-4">Ingen simuleringer ennå.</p>
          <Link
            href="/brew-twin/ny"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/80 transition-colors"
          >
            Kjør din første simulering →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {simulations.map((s) => {
            const p = s.params as unknown as SimulationParams;
            const fg = p.og - (p.og - 1) * p.yeast.attenuation;
            const abv = ((p.og - fg) * 131.25).toFixed(1);
            return (
              <Link key={s.id} href={`/brew-twin/${s.id}`}>
                <Card className="bg-card hover:bg-accent transition-colors">
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h3 className="font-semibold">{s.name}</h3>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {p.yeast.name} · {p.fermentationTempC}°C · {p.batchSizeLiters}L
                        </p>
                      </div>
                      <div className="flex gap-4 shrink-0 text-center">
                        <div>
                          <p className="text-xs text-muted-foreground">OG</p>
                          <p className="font-mono text-sm">{p.og.toFixed(3)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">FG</p>
                          <p className="font-mono text-sm">{fg.toFixed(3)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">ABV</p>
                          <p className="font-mono text-sm text-primary">{abv}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Dato</p>
                          <p className="text-sm">{new Date(s.createdAt).toLocaleDateString("no")}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
