import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { GitFork, Star } from "lucide-react";

export async function BrewFeed() {
  const recentForks = await prisma.recipeFork.findMany({
    where: {
      isPublic: true,
      OR: [
        { tastingNotes: { not: null } },
        { brewDate: { not: null } },
        { changeNotes: { not: null } },
      ],
    },
    include: {
      user: { select: { name: true, image: true } },
      ratings: { select: { value: true } },
    },
    orderBy: { updatedAt: "desc" },
    take: 5,
  });

  if (recentForks.length === 0) return null;

  return (
    <section className="max-w-4xl mx-auto px-4 py-16">
      <h2 className="text-2xl font-bold mb-6">
        <GitFork className="inline h-5 w-5 mr-2" />
        Siste fra community
      </h2>
      <div className="space-y-3">
        {recentForks.map((fork) => {
          const avgRating = fork.ratings.length > 0
            ? Math.round((fork.ratings.reduce((s, r) => s + r.value, 0) / fork.ratings.length) * 10) / 10
            : null;

          const abv = fork.og && fork.fg
            ? ((fork.og - fork.fg) * 131.25).toFixed(1)
            : null;

          return (
            <Link key={fork.id} href={`/forks/${fork.id}`}>
              <Card className="bg-card hover:bg-accent transition-colors">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    {fork.user.image && (
                      <Image
                        src={fork.user.image}
                        alt={fork.user.name || ""}
                        width={32}
                        height={32}
                        className="rounded-full flex-shrink-0 mt-0.5"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">
                        <span className="font-semibold">{fork.user.name}</span>
                        {fork.brewDate ? (
                          <span className="text-muted-foreground"> brygget </span>
                        ) : (
                          <span className="text-muted-foreground"> forket </span>
                        )}
                        <span className="font-medium text-primary">{fork.name}</span>
                      </p>

                      {fork.changeNotes && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                          &ldquo;{fork.changeNotes}&rdquo;
                        </p>
                      )}

                      {fork.tastingNotes && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                          Smaksnotater: {fork.tastingNotes}
                        </p>
                      )}

                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        {abv && <span>ABV: {abv}%</span>}
                        {fork.style && <span>{fork.style}</span>}
                        {avgRating && (
                          <span className="flex items-center gap-0.5">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            {avgRating}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
