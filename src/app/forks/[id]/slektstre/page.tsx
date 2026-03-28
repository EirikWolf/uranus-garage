import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { LineageTree } from "@/components/lineage-tree";
import { ArrowLeft } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const fork = await prisma.recipeFork.findUnique({ where: { id }, select: { name: true } });
  return { title: fork ? `Slektstre: ${fork.name} — Uranus Garage` : "Slektstre — Uranus Garage" };
}

export default async function LineagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const fork = await prisma.recipeFork.findUnique({
    where: { id },
    select: { id: true, name: true, isPublic: true },
  });

  if (!fork || !fork.isPublic) notFound();

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <Link
        href={`/forks/${id}`}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Tilbake til {fork.name}
      </Link>

      <h1 className="text-3xl font-bold mb-2">Oppskriftens slektstre</h1>
      <p className="text-muted-foreground mb-8">
        Se hvordan {fork.name} har utviklet seg gjennom forks og iterasjoner. Klikk på en node for å se detaljer.
      </p>

      <LineageTree forkId={id} />
    </div>
  );
}
