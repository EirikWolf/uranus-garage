import { notFound } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { BrewLabChart } from "@/components/brew-lab-chart";
import { getBrewLabEntry, getBrewLabEntries } from "@/lib/sanity";

export const revalidate = 60;

export async function generateStaticParams() {
  const entries = await getBrewLabEntries();
  return entries
    .filter((e) => e.brewLog?.slug?.current)
    .map((e) => ({ slug: e.brewLog.slug.current }));
}

export default async function BrewLabDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = await getBrewLabEntry(slug);
  if (!entry) notFound();

  const abv =
    entry.brewLog?.og && entry.brewLog?.fg
      ? ((entry.brewLog.og - entry.brewLog.fg) * 131.25).toFixed(1)
      : null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <header className="mb-8">
        <p className="text-xs text-primary font-bold tracking-wider uppercase mb-2">
          Bryggelaben
        </p>
        <h1 className="text-3xl font-bold mb-2">
          {entry.brewLog?.title || "Ukjent brygg"}
        </h1>
        <div className="flex gap-4 text-sm text-muted-foreground">
          {entry.brewLog?.date && <span>{entry.brewLog.date}</span>}
          {entry.brewLog?.beer && (
            <Link
              href={`/ol/${entry.brewLog.beer.slug.current}`}
              className="text-primary hover:underline"
            >
              {entry.brewLog.beer.name} ({entry.brewLog.beer.style})
            </Link>
          )}
        </div>
      </header>

      {/* Summary stats */}
      {(entry.brewLog?.og || entry.brewLog?.fg || abv) && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          {entry.brewLog?.og != null && (
            <Card className="bg-card border-border">
              <CardContent className="pt-4 text-center">
                <p className="text-xs text-muted-foreground">OG</p>
                <p className="text-2xl font-bold">{entry.brewLog.og}</p>
              </CardContent>
            </Card>
          )}
          {entry.brewLog?.fg != null && (
            <Card className="bg-card border-border">
              <CardContent className="pt-4 text-center">
                <p className="text-xs text-muted-foreground">FG</p>
                <p className="text-2xl font-bold">{entry.brewLog.fg}</p>
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

      {/* Charts */}
      <BrewLabChart measurements={entry.measurements || []} />

      {/* Link to full brew log */}
      {entry.brewLog?.slug && (
        <div className="mt-8">
          <Link
            href={`/bryggelogg/${entry.brewLog.slug.current}`}
            className="text-primary hover:underline text-sm"
          >
            Se full bryggelogg →
          </Link>
        </div>
      )}
    </div>
  );
}
