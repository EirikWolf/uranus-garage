import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { getBrewSessions } from "@/lib/brew-sessions";
import { auth } from "@/lib/auth";
import { BrewLabAdmin } from "@/components/brew-lab-admin";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Bryggelaben — Uranus Garage",
  description: "Logger, grafer og sanntidsdata fra bryggingene våre.",
};

export default async function BrewLabPage() {
  const [sessions, session] = await Promise.all([getBrewSessions(), auth()]);
  const isLoggedIn = !!session?.user?.id;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Bryggelaben</h1>
      <p className="text-muted-foreground mb-8">
        Logger, grafer og data fra bryggingene våre. Temperatur, gravity og mer — sporet med RAPT-hydrometer.
      </p>

      {isLoggedIn && <BrewLabAdmin />}

      {sessions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-2">Ingen bryggelab-data ennå.</p>
          <p className="text-sm text-muted-foreground">
            Bruk «Importer historikk» for å hente inn data fra RAPT.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sessions.map((s) => (
            <Link key={s.id} href={`/bryggelaben/${s.id}`}>
              <Card className="bg-card hover:bg-accent transition-colors">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-lg">{s.name}</h3>
                      <div className="flex flex-wrap gap-4 mt-1 text-sm text-muted-foreground">
                        <span>{new Date(s.createdOn).toLocaleDateString("no")}</span>
                        {s.endingOn && (
                          <span>→ {new Date(s.endingOn).toLocaleDateString("no")}</span>
                        )}
                        {s.deviceName && <span>{s.deviceName}</span>}
                        <span>{s._count.readings} avlesninger</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      {s.og != null && (
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">OG</p>
                          <p className="font-mono text-sm">{s.og.toFixed(3)}</p>
                        </div>
                      )}
                      {s.fg != null && (
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">FG</p>
                          <p className="font-mono text-sm">{s.fg.toFixed(3)}</p>
                        </div>
                      )}
                      {s.abv != null && (
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">ABV</p>
                          <p className="font-mono text-sm text-primary">{s.abv.toFixed(1)}%</p>
                        </div>
                      )}
                      {s.isActive && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                          Aktiv
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
