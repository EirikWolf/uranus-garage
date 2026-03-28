import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PortableTextContent } from "@/components/portable-text";
import { getAllBrewLogs, getBrewLogBySlug } from "@/lib/sanity";
import { urlFor } from "../../../../sanity/lib/client";

export const revalidate = 60;

export async function generateStaticParams() {
  const logs = await getAllBrewLogs();
  return logs.map((log) => ({ slug: log.slug.current }));
}

export default async function BrewLogPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const log = await getBrewLogBySlug(slug);
  if (!log) notFound();

  const abv =
    log.og && log.fg
      ? ((log.og - log.fg) * 131.25).toFixed(1)
      : null;

  return (
    <article className="max-w-4xl mx-auto px-4 py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{log.title}</h1>
        <p className="text-muted-foreground">{log.date}</p>

        {log.brewers && log.brewers.length > 0 && (
          <div className="flex items-center gap-3 mt-4">
            {log.brewers.map((brewer) => (
              <div key={brewer._id} className="flex items-center gap-2">
                {brewer.image && (
                  <Image
                    src={urlFor(brewer.image).width(32).height(32).url()}
                    alt={brewer.name}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                )}
                <span className="text-sm">{brewer.name}</span>
              </div>
            ))}
          </div>
        )}
      </header>

      {/* Measurements */}
      {(log.og || log.fg) && (
        <Card className="bg-card mb-8">
          <CardContent className="pt-6">
            <div className="flex gap-8">
              {log.og != null && (
                <div>
                  <p className="text-xs text-muted-foreground">OG</p>
                  <p className="text-xl font-bold">{log.og}</p>
                </div>
              )}
              {log.fg != null && (
                <div>
                  <p className="text-xs text-muted-foreground">FG</p>
                  <p className="text-xl font-bold">{log.fg}</p>
                </div>
              )}
              {abv && (
                <div>
                  <p className="text-xs text-muted-foreground">ABV</p>
                  <p className="text-xl font-bold text-primary">{abv}%</p>
                </div>
              )}
            </div>
            {log.tempNotes && (
              <p className="text-sm text-muted-foreground mt-4">
                {log.tempNotes}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Body */}
      {log.body && (
        <div className="prose-invert max-w-none">
          <PortableTextContent value={log.body} />
        </div>
      )}

      <Separator className="my-12" />

      {/* Links */}
      <div className="flex gap-4">
        {log.beer && (
          <Link
            href={`/ol/${log.beer.slug.current}`}
            className="text-primary hover:underline text-sm"
          >
            Se ølet: {log.beer.name} →
          </Link>
        )}
        {log.recipe && (
          <Link
            href={`/oppskrifter/${log.recipe.slug.current}`}
            className="text-primary hover:underline text-sm"
          >
            Se oppskriften →
          </Link>
        )}
      </div>
    </article>
  );
}
