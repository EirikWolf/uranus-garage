import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { getLatestBrewLog, getFeaturedBeers } from "@/lib/sanity";
import { urlFor } from "../../sanity/lib/client";
import { BrewFeed } from "@/components/brew-feed";

export const revalidate = 60;

export default async function Home() {
  const [latestLog, featuredBeers] = await Promise.all([
    getLatestBrewLog(),
    getFeaturedBeers(),
  ]);

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-background via-card to-background py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Image
            src="/logo.svg"
            alt="Uranus Garage"
            width={400}
            height={80}
            className="mx-auto mb-4"
            priority
          />
          <p className="text-primary text-lg tracking-widest uppercase mb-8">
            Great beer and no cars!
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/ol"
              className="inline-flex items-center justify-center h-9 px-4 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/80 transition-all"
            >
              Se våre øl
            </Link>
            <Link
              href="/bryggelogg"
              className="inline-flex items-center justify-center h-9 px-4 rounded-lg border border-border bg-background text-foreground font-medium text-sm hover:bg-muted transition-all"
            >
              Siste bryggelogg
            </Link>
          </div>
        </div>
      </section>

      {/* Featured beers */}
      {featuredBeers.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-16">
          <h2 className="text-2xl font-bold mb-8">Våre øl</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredBeers.map((beer) => (
              <Link key={beer._id} href={`/ol/${beer.slug.current}`}>
                <Card className="bg-card hover:bg-accent transition-colors h-full">
                  {beer.image && (
                    <div className="h-48 overflow-hidden rounded-t-lg">
                      <Image
                        src={urlFor(beer.image).width(400).height(300).url()}
                        alt={beer.name}
                        width={400}
                        height={300}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardContent className="pt-4">
                    <h3 className="font-bold text-lg">{beer.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {beer.style} — {beer.abv}%
                    </p>
                    {beer.flavorTags && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {beer.flavorTags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs bg-secondary px-2 py-0.5 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Latest brew log */}
      {latestLog && (
        <section className="max-w-6xl mx-auto px-4 py-16">
          <h2 className="text-2xl font-bold mb-8">Siste brygg</h2>
          <Link href={`/bryggelogg/${latestLog.slug.current}`}>
            <Card className="bg-card hover:bg-accent transition-colors p-6">
              <h3 className="text-xl font-bold">{latestLog.title}</h3>
              <p className="text-muted-foreground">{latestLog.date}</p>
            </Card>
          </Link>
        </section>
      )}

      <BrewFeed />
    </div>
  );
}
