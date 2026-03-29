import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { GitFork, Star } from "lucide-react";

export const metadata = {
  title: "Forks — Uranus Garage",
  description: "Se alle community forks av oppskrifter.",
};

export const revalidate = 60;

export default async function ForksPage() {
  const forks = await prisma.recipeFork.findMany({
    where: { isPublic: true },
    include: {
      user: { select: { id: true, name: true, image: true } },
      ratings: { select: { value: true } },
      _count: { select: { children: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">
        <GitFork className="inline h-7 w-7 mr-2" />
        Community Forks
      </h1>
      <p className="text-muted-foreground mb-8">
        Se hvordan andre bryggere har tilpasset og eksperimentert med oppskrifter.
      </p>

      {forks.length === 0 ? (
        <p className="text-muted-foreground">Ingen forks ennå. Vær den første!</p>
      ) : (
        <div className="space-y-4">
          {forks.map((fork) => {
            const avgRating =
              fork.ratings.length > 0
                ? Math.round(
                    (fork.ratings.reduce((s: number, r) => s + r.value, 0) /
                      fork.ratings.length) *
                      10
                  ) / 10
                : null;
            return (
              <Link key={fork.id} href={`/forks/${fork.id}`}>
                <Card className="bg-card hover:bg-accent transition-colors">
                  <CardContent className="pt-6 flex items-start gap-4">
                    {fork.user.image && (
                      <Image
                        src={fork.user.image}
                        alt=""
                        width={32}
                        height={32}
                        className="rounded-full flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold">{fork.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        av {fork.user.name} — {fork.style || "Ukjent stil"} —{" "}
                        {fork.batchSize}L
                      </p>
                      {fork.changeNotes && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {fork.changeNotes}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground flex-shrink-0">
                      {avgRating && (
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          {avgRating}
                        </span>
                      )}
                      {fork._count.children > 0 && (
                        <span className="flex items-center gap-1">
                          <GitFork className="h-3 w-3" />
                          {fork._count.children}
                        </span>
                      )}
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
