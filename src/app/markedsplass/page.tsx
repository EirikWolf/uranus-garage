import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { Plus, ShoppingBag } from "lucide-react";
import { auth } from "@/lib/auth";

export const metadata = {
  title: "Markedsplassen — Uranus Garage",
  description: "Kjøp, selg og bytt bryggeutstyr.",
};

const typeLabels: Record<string, string> = {
  selger: "Selger",
  kjoper: "Kjøper",
  bytter: "Bytter",
};

const typeColors: Record<string, string> = {
  selger: "bg-green-900/50 text-green-300 border-green-700",
  kjoper: "bg-blue-900/50 text-blue-300 border-blue-700",
  bytter: "bg-yellow-900/50 text-yellow-300 border-yellow-700",
};

export default async function MarketplacePage() {
  const session = await auth();
  const listings = await prisma.listing.findMany({
    where: { isActive: true },
    include: { user: { select: { id: true, name: true, image: true } } },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            <ShoppingBag className="inline h-7 w-7 mr-2" />
            Markedsplassen
          </h1>
          <p className="text-muted-foreground">Kjøp, selg og bytt bryggeutstyr.</p>
        </div>
        {session && (
          <Link
            href="/markedsplass/ny"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg bg-primary text-primary-foreground hover:bg-primary/80 transition-colors"
          >
            <Plus className="h-4 w-4" /> Ny annonse
          </Link>
        )}
      </div>

      {listings.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-2">Ingen annonser ennå.</p>
          {session ? (
            <Link href="/markedsplass/ny" className="text-primary hover:underline text-sm">
              Opprett den første annonsen →
            </Link>
          ) : (
            <Link href="/logg-inn" className="text-primary hover:underline text-sm">
              Logg inn for å legge ut en annonse →
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <Link key={listing.id} href={`/markedsplass/${listing.id}`}>
              <Card className="bg-card hover:bg-accent transition-colors h-full">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-bold">{listing.title}</h3>
                    <Badge variant="outline" className={typeColors[listing.type] || ""}>
                      {typeLabels[listing.type] || listing.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {listing.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      {listing.user.image && (
                        <Image src={listing.user.image} alt="" width={16} height={16} className="rounded-full" />
                      )}
                      <span>{listing.user.name}</span>
                    </div>
                    <span>{listing.location}</span>
                  </div>
                  {listing.price && (
                    <p className="text-primary font-bold mt-2">{listing.price}</p>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
