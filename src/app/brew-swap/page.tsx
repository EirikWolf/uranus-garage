import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Plus, Users, Calendar, MapPin } from "lucide-react";

export const metadata = {
  title: "Brew-Swap — Uranus Garage",
  description: "Koordinerte splittede batcher. Meld deg på og eksperimenter!",
};

const statusColors: Record<string, string> = {
  planlagt: "bg-blue-900/50 text-blue-300 border-blue-700",
  aktiv: "bg-green-900/50 text-green-300 border-green-700",
  fullfort: "bg-muted text-muted-foreground border-border",
};

export default async function BrewSwapPage() {
  const session = await auth();
  const swaps = await prisma.brewSwap.findMany({
    where: { status: { not: "avlyst" } },
    include: {
      user: { select: { id: true, name: true, image: true } },
      _count: { select: { participants: true } },
    },
    orderBy: { brewDate: "asc" },
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            <Users className="inline h-7 w-7 mr-2" />
            Brew-Swap
          </h1>
          <p className="text-muted-foreground">Koordinerte splittede batcher — brygg sammen, eksperimenter hver for seg.</p>
        </div>
        {session && (
          <Link
            href="/brew-swap/ny"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg bg-primary text-primary-foreground hover:bg-primary/80 transition-colors"
          >
            <Plus className="h-4 w-4" /> Ny swap
          </Link>
        )}
      </div>

      {swaps.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-2">Ingen brew-swaps ennå.</p>
          {session ? (
            <Link href="/brew-swap/ny" className="text-primary hover:underline text-sm">Opprett den første →</Link>
          ) : (
            <Link href="/logg-inn" className="text-primary hover:underline text-sm">Logg inn for å opprette →</Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {swaps.map((swap) => (
            <Link key={swap.id} href={`/brew-swap/${swap.id}`}>
              <Card className="bg-card hover:bg-accent transition-colors">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-bold text-lg">{swap.title}</h3>
                    <Badge variant="outline" className={statusColors[swap.status] || ""}>
                      {swap.status.charAt(0).toUpperCase() + swap.status.slice(1)}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{swap.description}</p>
                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(swap.brewDate).toLocaleDateString("no", { day: "numeric", month: "long", year: "numeric" })}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {swap.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {swap._count.participants}/{swap.maxParticipants} deltakere
                    </span>
                    <span>{swap.totalLiters}L totalt — {swap.portionSize}L per deltaker</span>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    {swap.user.image && <Image src={swap.user.image} alt="" width={16} height={16} className="rounded-full" />}
                    <span className="text-xs text-muted-foreground">Arrangør: {swap.user.name}</span>
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
