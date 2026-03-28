import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { ArrowLeft, Mail, MapPin } from "lucide-react";

const typeLabels: Record<string, string> = { selger: "Selger", kjoper: "Kjøper", bytter: "Bytter" };
const typeColors: Record<string, string> = {
  selger: "bg-green-900/50 text-green-300 border-green-700",
  kjoper: "bg-blue-900/50 text-blue-300 border-blue-700",
  bytter: "bg-yellow-900/50 text-yellow-300 border-yellow-700",
};

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  const listing = await prisma.listing.findUnique({
    where: { id },
    include: { user: { select: { id: true, name: true, image: true, email: true } } },
  });

  if (!listing || !listing.isActive) notFound();

  const isOwner = session?.user?.id === listing.userId;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <Link href="/markedsplass" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" /> Tilbake til markedsplassen
      </Link>

      <Card className="bg-card border-border">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between gap-3 mb-4">
            <h1 className="text-2xl font-bold">{listing.title}</h1>
            <Badge variant="outline" className={typeColors[listing.type] || ""}>
              {typeLabels[listing.type] || listing.type}
            </Badge>
          </div>

          {listing.price && (
            <p className="text-2xl text-primary font-bold mb-4">{listing.price}</p>
          )}

          <p className="leading-relaxed mb-6 whitespace-pre-wrap">{listing.description}</p>

          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <MapPin className="h-4 w-4" />
            {listing.location}
          </div>

          <div className="flex items-center gap-3 p-4 bg-secondary rounded-lg">
            {listing.user.image && (
              <Image src={listing.user.image} alt="" width={40} height={40} className="rounded-full" />
            )}
            <div className="flex-1">
              <p className="font-medium">{listing.user.name}</p>
              {listing.user.email && (
                <a href={`mailto:${listing.user.email}?subject=${encodeURIComponent(`Re: ${listing.title} på Uranus Garage`)}`} className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-1">
                  <Mail className="h-3 w-3" /> Kontakt via e-post
                </a>
              )}
            </div>
          </div>

          {isOwner && (
            <p className="text-xs text-muted-foreground mt-4">
              Dette er din annonse.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
