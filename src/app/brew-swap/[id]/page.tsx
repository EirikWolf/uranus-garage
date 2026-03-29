import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { ArrowLeft, Calendar, MapPin, Users, Beaker } from "lucide-react";
import { JoinSwapButton } from "./join-button";

const statusColors: Record<string, string> = {
  planlagt: "bg-blue-900/50 text-blue-300 border-blue-700",
  aktiv: "bg-green-900/50 text-green-300 border-green-700",
  fullfort: "bg-muted text-muted-foreground border-border",
  avlyst: "bg-red-900/50 text-red-300 border-red-700",
};

export default async function SwapDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  const swap = await prisma.brewSwap.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, image: true, email: true } },
      participants: {
        include: { user: { select: { id: true, name: true, image: true } } },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!swap) notFound();

  const isOrganizer = session?.user?.id === swap.userId;
  const isParticipant = swap.participants.some((p) => p.userId === session?.user?.id);
  const isFull = swap.participants.length >= swap.maxParticipants;
  const canJoin = session && !isOrganizer && !isParticipant && !isFull && swap.status === "planlagt";

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Link href="/brew-swap" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" /> Tilbake til Brew-Swap
      </Link>

      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">{swap.title}</h1>
          <Badge variant="outline" className={statusColors[swap.status] || ""}>
            {swap.status.charAt(0).toUpperCase() + swap.status.slice(1)}
          </Badge>
        </div>
      </div>

      <p className="leading-relaxed mb-6">{swap.description}</p>

      {swap.baseRecipe && (
        <Card className="bg-card border-border border-l-4 border-l-primary mb-6">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-2">
              <Beaker className="inline h-4 w-4 mr-1" />
              Base-oppskrift
            </h3>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{swap.baseRecipe}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-card rounded-lg p-4 text-center border border-border">
          <Calendar className="h-5 w-5 text-primary mx-auto mb-1" />
          <p className="text-xs text-muted-foreground">Dato</p>
          <p className="font-bold text-sm">{new Date(swap.brewDate).toLocaleDateString("no", { day: "numeric", month: "short", year: "numeric" })}</p>
        </div>
        <div className="bg-card rounded-lg p-4 text-center border border-border">
          <MapPin className="h-5 w-5 text-primary mx-auto mb-1" />
          <p className="text-xs text-muted-foreground">Sted</p>
          <p className="font-bold text-sm">{swap.location}</p>
        </div>
        <div className="bg-card rounded-lg p-4 text-center border border-border">
          <Beaker className="h-5 w-5 text-primary mx-auto mb-1" />
          <p className="text-xs text-muted-foreground">Volum</p>
          <p className="font-bold text-sm">{swap.totalLiters}L ({swap.portionSize}L/pers)</p>
        </div>
        <div className="bg-card rounded-lg p-4 text-center border border-border">
          <Users className="h-5 w-5 text-primary mx-auto mb-1" />
          <p className="text-xs text-muted-foreground">Deltakere</p>
          <p className="font-bold text-sm">{swap.participants.length}/{swap.maxParticipants}</p>
        </div>
      </div>

      {/* Organizer */}
      <div className="flex items-center gap-3 p-4 bg-secondary rounded-lg mb-6">
        {swap.user.image && <Image src={swap.user.image} alt="" width={40} height={40} className="rounded-full" />}
        <div>
          <p className="font-medium text-sm">Arrangør: {swap.user.name}</p>
          {swap.user.email && (
            <a href={`mailto:${swap.user.email}?subject=${encodeURIComponent(`Re: ${swap.title}`)}`} className="text-xs text-primary hover:underline">
              Kontakt via e-post
            </a>
          )}
        </div>
      </div>

      {/* Join button */}
      {canJoin && <JoinSwapButton swapId={swap.id} />}

      {isParticipant && (
        <p className="text-sm text-primary mb-6">Du er påmeldt denne swappen!</p>
      )}

      {isFull && !isParticipant && !isOrganizer && (
        <p className="text-sm text-muted-foreground mb-6">Denne swappen er full.</p>
      )}

      {/* Participants */}
      <h3 className="text-xl font-bold mb-4">Deltakere ({swap.participants.length})</h3>
      {swap.participants.length === 0 ? (
        <p className="text-sm text-muted-foreground">Ingen deltakere ennå. Vær den første!</p>
      ) : (
        <div className="space-y-3">
          {swap.participants.map((p) => (
            <Card key={p.id} className="bg-card border-border">
              <CardContent className="pt-4 flex items-start gap-3">
                {p.user.image && <Image src={p.user.image} alt="" width={32} height={32} className="rounded-full" />}
                <div className="flex-1">
                  <p className="font-medium text-sm">{p.user.name}</p>
                  {p.plan && <p className="text-sm text-muted-foreground mt-1">Plan: {p.plan}</p>}
                  {p.result && <p className="text-sm text-primary mt-1">Resultat: {p.result}</p>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
