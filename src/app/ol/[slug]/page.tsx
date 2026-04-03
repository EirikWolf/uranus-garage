import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { DifficultyBadge } from "@/components/difficulty-badge";
import { getAllBeers, getBeerBySlug } from "@/lib/sanity";
import { RecipeDetail } from "@/components/recipe-detail";
import { urlFor } from "../../../../sanity/lib/client";

export const revalidate = 60;

export async function generateStaticParams() {
  const beers = await getAllBeers();
  return beers.map((beer) => ({ slug: beer.slug.current }));
}

export default async function BeerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const beer = await getBeerBySlug(slug);
  if (!beer) notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        {beer.image && (
          <div className="md:w-1/3">
            <Image
              src={urlFor(beer.image).width(400).height(400).url()}
              alt={beer.name}
              width={400}
              height={400}
              className="rounded-lg w-full"
            />
          </div>
        )}
        <div className="flex-1">
          <div className="flex items-start gap-3 mb-2">
            <h1 className="text-3xl font-bold">{beer.name}</h1>
            {beer.difficulty && <DifficultyBadge difficulty={beer.difficulty} />}
          </div>
          <p className="text-lg text-muted-foreground mb-4">{beer.style}</p>

          {beer.description && (
            <p className="mb-6 leading-relaxed">{beer.description}</p>
          )}

          <div className="grid grid-cols-3 gap-4 mb-6">
            {beer.abv != null && (
              <div className="bg-card rounded-lg p-4 text-center border border-border">
                <p className="text-2xl font-bold text-primary">{beer.abv}%</p>
                <p className="text-xs text-muted-foreground">ABV</p>
              </div>
            )}
            {beer.ibu != null && (
              <div className="bg-card rounded-lg p-4 text-center border border-border">
                <p className="text-2xl font-bold text-primary">{beer.ibu}</p>
                <p className="text-xs text-muted-foreground">IBU</p>
              </div>
            )}
            {beer.srm != null && (
              <div className="bg-card rounded-lg p-4 text-center border border-border">
                <p className="text-2xl font-bold text-primary">{beer.srm}</p>
                <p className="text-xs text-muted-foreground">SRM</p>
              </div>
            )}
          </div>

          {beer.flavorTags && beer.flavorTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {beer.flavorTags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <Badge variant="outline" className="capitalize">
            {beer.status === "gjaerer"
              ? "Gjærer"
              : beer.status === "ferdig"
                ? "Ferdig"
                : beer.status === "planlagt"
                  ? "Planlagt"
                  : "Arkivert"}
          </Badge>
        </div>
      </div>

      {/* Linked recipe */}
      {beer.recipe && (
        <section className="mt-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Oppskrift</h2>
            <Link
              href={`/oppskrifter/${beer.recipe.slug.current}`}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Se full oppskrift →
            </Link>
          </div>
          <Card className="bg-card">
            <CardContent className="pt-6">
              <RecipeDetail recipe={beer.recipe} />
            </CardContent>
          </Card>
        </section>
      )}

      {/* Linked brew logs */}
      {beer.brewLogs && beer.brewLogs.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Bryggelogger</h2>
          <div className="space-y-3">
            {beer.brewLogs.map((log) => (
              <Link key={log._id} href={`/bryggelogg/${log.slug.current}`}>
                <Card className="bg-card hover:bg-accent transition-colors">
                  <CardContent className="pt-6">
                    <h3 className="font-bold">{log.title}</h3>
                    <p className="text-sm text-muted-foreground">{log.date}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
