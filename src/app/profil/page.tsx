import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { GitFork } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Min profil — Uranus Garage",
};

export default async function ProfilePage() {
  const session = await auth();
  if (!session || !session.user) redirect("/logg-inn");

  const forks = await prisma.recipeFork.findMany({
    where: { userId: session.user.id },
    include: {
      ratings: { select: { value: true } },
      _count: { select: { children: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Min profil</h1>

      <Card className="bg-card border-border mb-8">
        <CardContent className="pt-6 flex items-center gap-6">
          {session.user?.image && (
            <Image
              src={session.user.image}
              alt={session.user.name || "Profil"}
              width={80}
              height={80}
              className="rounded-full"
            />
          )}
          <div>
            <h2 className="text-xl font-bold">{session.user?.name}</h2>
            <p className="text-muted-foreground">{session.user?.email}</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-2">Mine oppskrifter</h3>
            <p className="text-sm text-muted-foreground">
              Lagrede oppskrifter fra AI-generatoren kommer snart.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-3">
              <GitFork className="inline h-4 w-4 mr-1" />
              Mine forks ({forks.length})
            </h3>
            {forks.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Du har ingen forks ennå. Gå til en oppskrift og klikk &quot;Fork This Brew&quot;.
              </p>
            ) : (
              <div className="space-y-2">
                {forks.map((fork) => (
                  <Link key={fork.id} href={`/forks/${fork.id}`} className="block">
                    <div className="p-3 rounded-lg bg-secondary hover:bg-accent transition-colors">
                      <p className="font-medium text-sm">{fork.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {fork.style || "Ukjent stil"} — {fork.batchSize}L
                        {fork._count.children > 0 && ` — ${fork._count.children} forks`}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
