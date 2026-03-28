import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { getBrewLabEntries } from "@/lib/sanity";

export const revalidate = 60;

export const metadata = {
  title: "Bryggelaben — Uranus Garage",
  description: "Logger, grafer og sanntidsdata fra bryggingene våre.",
};

export default async function BrewLabPage() {
  const entries = await getBrewLabEntries();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Bryggelaben</h1>
      <p className="text-muted-foreground mb-8">
        Logger, grafer og data fra bryggingene våre. Temperatur, gravity og mer — sporert med RAPT-hydrometer.
      </p>
      {entries.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-2">Ingen bryggelab-data ennå.</p>
          <p className="text-sm text-muted-foreground">
            Koble til RAPT-hydrometeret eller legg inn data via Sanity Studio.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {entries.map((entry) => (
            <Link key={entry._id} href={`/bryggelaben/${entry.brewLog?.slug?.current}`}>
              <Card className="bg-card hover:bg-accent transition-colors">
                <CardContent className="pt-6">
                  <h3 className="font-bold text-lg">
                    {entry.brewLog?.title || "Ukjent brygg"}
                  </h3>
                  <div className="flex gap-4 mt-1 text-sm text-muted-foreground">
                    {entry.brewLog?.date && <span>{entry.brewLog.date}</span>}
                    {entry.brewLog?.beer && (
                      <span className="text-primary">{entry.brewLog.beer.name}</span>
                    )}
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
