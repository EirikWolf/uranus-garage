import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { BrewPostCard } from "@/components/brew-post-card";
import { Button } from "@/components/ui/button";
import { PenLine } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Bryggeblogg — Uranus Garage",
  description: "Del bilder og tekst fra dine bryggedager. En åpen blogg for hjemmebryggere.",
};

export default async function BrewBlogPage() {
  const [session, posts] = await Promise.all([
    auth(),
    prisma.brewPost.findMany({
      take: 20,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, name: true, image: true } },
      },
    }),
  ]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Bryggeblogg</h1>
          <p className="text-muted-foreground">
            Del bilder og historier fra dine bryggedager.
          </p>
        </div>
        {session?.user ? (
          <Link href="/bryggeblogg/ny">
            <Button className="gap-2 flex-shrink-0">
              <PenLine className="h-4 w-4" />
              Nytt innlegg
            </Button>
          </Link>
        ) : (
          <Link href="/logg-inn">
            <Button variant="outline" className="flex-shrink-0">
              Logg inn for å skrive
            </Button>
          </Link>
        )}
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <p className="text-lg mb-2">Ingen innlegg ennå.</p>
          {session?.user ? (
            <Link href="/bryggeblogg/ny" className="text-primary hover:underline">
              Vær den første til å dele!
            </Link>
          ) : (
            <p className="text-sm">Logg inn og del din første bryggedag.</p>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {posts.map((post) => (
            <BrewPostCard
              key={post.id}
              post={{
                ...post,
                brewDate: post.brewDate?.toISOString() ?? null,
                createdAt: post.createdAt.toISOString(),
              }}
              currentUserId={session?.user?.id ?? null}
            />
          ))}
        </div>
      )}
    </div>
  );
}
