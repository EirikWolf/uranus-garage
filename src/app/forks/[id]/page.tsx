import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RecipeDiff } from "@/components/recipe-diff";
import { ForkButton } from "@/components/fork-button";
import { RatingForm } from "@/components/rating-form";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { GitFork, Star } from "lucide-react";
import type { ForkGrain, ForkHop, ForkYeast, ForkAddition, ForkProcessStep } from "@/lib/prisma-types";
import { ForkScaler } from "@/components/fork-scaler";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const fork = await prisma.recipeFork.findUnique({ where: { id }, select: { name: true } });
  return { title: fork ? `${fork.name} — Uranus Garage` : "Fork — Uranus Garage" };
}

export default async function ForkDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  const fork = await prisma.recipeFork.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, image: true } },
      parentFork: {
        select: {
          id: true, name: true, grains: true, hops: true, yeast: true, batchSize: true,
          user: { select: { name: true } },
        },
      },
      children: {
        where: { isPublic: true },
        include: {
          user: { select: { id: true, name: true, image: true } },
          ratings: { select: { value: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
      ratings: {
        include: { user: { select: { id: true, name: true, image: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!fork) notFound();
  if (!fork.isPublic && session?.user?.id !== fork.userId) notFound();

  const grains = (fork.grains as unknown as ForkGrain[]) || [];
  const hops = (fork.hops as unknown as ForkHop[]) || [];
  const yeast = (fork.yeast as ForkYeast) || {};
  const process = (fork.process as unknown as ForkProcessStep[]) || [];

  const parentGrains = fork.parentFork ? (fork.parentFork.grains as unknown as ForkGrain[]) || [] : [];
  const parentHops = fork.parentFork ? (fork.parentFork.hops as unknown as ForkHop[]) || [] : [];
  const parentYeast = fork.parentFork ? (fork.parentFork.yeast as ForkYeast) || {} : {};
  const parentBatchSize = fork.parentFork?.batchSize || fork.batchSize;

  const userRating = session?.user?.id
    ? fork.ratings.find((r) => r.user.id === session.user!.id)
    : null;

  const avgRating = fork.ratings.length > 0
    ? Math.round((fork.ratings.reduce((sum: number, r) => sum + r.value, 0) / fork.ratings.length) * 10) / 10
    : null;

  const abv = fork.og && fork.fg ? ((fork.og - fork.fg) * 131.25).toFixed(1) : null;
  const isOwner = session?.user?.id === fork.userId;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-1">{fork.name}</h1>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              {fork.user.image && (
                <Image src={fork.user.image} alt={fork.user.name || ""} width={24} height={24} className="rounded-full" />
              )}
              <span>av {fork.user.name}</span>
              {avgRating && (
                <span className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  {avgRating} ({fork.ratings.length})
                </span>
              )}
              <span>{fork.children.length} forks</span>
            </div>
          </div>
          <div className="flex gap-2">
            <ForkButton
              recipeName={fork.name}
              parentForkId={fork.id}
              recipeData={{
                style: fork.style || undefined,
                difficulty: fork.difficulty || undefined,
                batchSize: fork.batchSize,
                grains, hops, yeast,
                additions: (fork.additions as unknown as ForkAddition[]) || [],
                process,
              }}
            />
            <Link
              href={`/forks/${fork.id}/slektstre`}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg border border-border bg-secondary text-secondary-foreground hover:bg-muted transition-colors"
            >
              Se slektstre
            </Link>
            {isOwner && (
              <Link
                href={`/forks/${fork.id}/rediger`}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg border border-border bg-secondary text-secondary-foreground hover:bg-muted transition-colors"
              >
                Rediger
              </Link>
            )}
          </div>
        </div>

        {fork.description && <p className="mt-4">{fork.description}</p>}

        {/* Parent info */}
        {fork.parentFork && (
          <p className="text-sm text-muted-foreground mt-2">
            Forket fra{" "}
            <Link href={`/forks/${fork.parentFork.id}`} className="text-primary hover:underline">
              {fork.parentFork.name}
            </Link>
            {" "}av {fork.parentFork.user.name}
          </p>
        )}
        {fork.parentSanityId && !fork.parentForkId && (
          <p className="text-sm text-muted-foreground mt-2">
            Forket fra en Uranus Garage-oppskrift
          </p>
        )}

        <div className="flex gap-2 mt-3">
          {fork.style && <Badge variant="outline">{fork.style}</Badge>}
          {fork.difficulty && <Badge variant="outline" className="capitalize">{fork.difficulty}</Badge>}
          <Badge variant="outline">{fork.batchSize}L</Badge>
        </div>
      </header>

      {/* Diff from parent */}
      {fork.parentFork && (
        <div className="mb-8">
          <RecipeDiff
            parentGrains={parentGrains}
            parentHops={parentHops}
            parentYeast={parentYeast}
            parentBatchSize={parentBatchSize}
            forkGrains={grains}
            forkHops={hops}
            forkYeast={yeast}
            forkBatchSize={fork.batchSize}
            changeNotes={fork.changeNotes}
          />
        </div>
      )}

      {/* Brew results */}
      {(fork.og || fork.fg || fork.tastingNotes) && (
        <Card className="bg-card border-border mb-8">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-3">Bryggeresultater</h3>
            <div className="flex gap-8 mb-4">
              {fork.og != null && (
                <div>
                  <p className="text-xs text-muted-foreground">OG</p>
                  <p className="text-xl font-bold">{fork.og}</p>
                </div>
              )}
              {fork.fg != null && (
                <div>
                  <p className="text-xs text-muted-foreground">FG</p>
                  <p className="text-xl font-bold">{fork.fg}</p>
                </div>
              )}
              {abv && (
                <div>
                  <p className="text-xs text-muted-foreground">ABV</p>
                  <p className="text-xl font-bold text-primary">{abv}%</p>
                </div>
              )}
            </div>
            {fork.tastingNotes && (
              <p className="text-sm text-muted-foreground">{fork.tastingNotes}</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Ingredients with scaling + BeerXML export */}
      <div className="mb-8">
        <ForkScaler
          forkName={fork.name}
          style={fork.style}
          originalBatchSize={fork.batchSize}
          grains={grains}
          hops={hops}
          yeast={yeast}
        />
      </div>

      {/* Child forks */}
      {fork.children.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4">
            <GitFork className="inline h-5 w-5 mr-1" />
            Forks ({fork.children.length})
          </h3>
          <div className="space-y-3">
            {fork.children.map((child) => {
              const childAvg = child.ratings.length > 0
                ? Math.round((child.ratings.reduce((s: number, r) => s + r.value, 0) / child.ratings.length) * 10) / 10
                : null;
              return (
                <Link key={child.id} href={`/forks/${child.id}`}>
                  <Card className="bg-card hover:bg-accent transition-colors">
                    <CardContent className="pt-4 flex items-center gap-3">
                      {child.user.image && (
                        <Image src={child.user.image} alt="" width={24} height={24} className="rounded-full" />
                      )}
                      <div className="flex-1">
                        <span className="font-medium text-sm">{child.name}</span>
                        <span className="text-xs text-muted-foreground ml-2">av {child.user.name}</span>
                      </div>
                      {childAvg && (
                        <span className="flex items-center gap-1 text-sm">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          {childAvg}
                        </span>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Rate this fork */}
      <Card className="bg-card border-border mb-4">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-3">Gi din vurdering</h3>
          <RatingForm
            forkId={fork.id}
            forkOwnerId={fork.userId}
            existingRating={userRating ? { value: userRating.value, comment: userRating.comment } : null}
          />
        </CardContent>
      </Card>

      {/* Ratings */}
      {fork.ratings.length > 0 && (
        <div>
          <h3 className="text-xl font-bold mb-4">Vurderinger ({fork.ratings.length})</h3>
          <div className="space-y-3">
            {fork.ratings.map((rating) => (
              <Card key={rating.id} className="bg-card border-border">
                <CardContent className="pt-4 flex items-start gap-3">
                  {rating.user.image && (
                    <Image src={rating.user.image} alt="" width={24} height={24} className="rounded-full" />
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{rating.user.name}</span>
                      <span className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`h-3 w-3 ${i < rating.value ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />
                        ))}
                      </span>
                    </div>
                    {rating.comment && (
                      <p className="text-sm text-muted-foreground mt-1">{rating.comment}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
