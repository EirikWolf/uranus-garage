import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { GitFork, Star } from "lucide-react";
import { DifficultyBadge } from "@/components/difficulty-badge";
import { RecipeScaler } from "@/components/recipe-scaler";
import { getAllRecipes, getRecipeBySlug } from "@/lib/sanity";
import { BeerXmlExportButton } from "@/components/beerxml-export-button";
import { ForkButton } from "@/components/fork-button";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;

export async function generateStaticParams() {
  const recipes = await getAllRecipes();
  return recipes.map((r) => ({ slug: r.slug.current }));
}

export default async function RecipePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const recipe = await getRecipeBySlug(slug);
  if (!recipe) notFound();

  const forks = await prisma.recipeFork.findMany({
    where: { parentSanityId: recipe._id, isPublic: true },
    include: {
      user: { select: { id: true, name: true, image: true } },
      ratings: { select: { value: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <header className="mb-8">
        <div className="flex items-start gap-3 mb-2">
          <h1 className="text-3xl font-bold">{recipe.name}</h1>
          {recipe.difficulty && (
            <DifficultyBadge difficulty={recipe.difficulty} />
          )}
        </div>
        <p className="text-lg text-muted-foreground">
          {recipe.style} — {recipe.batchSize}L
        </p>
        {recipe.description && (
          <p className="mt-4 leading-relaxed">{recipe.description}</p>
        )}
        {recipe.beer && (
          <Link
            href={`/ol/${recipe.beer.slug.current}`}
            className="text-primary hover:underline text-sm mt-2 inline-block"
          >
            Se ølet: {recipe.beer.name} →
          </Link>
        )}
        <div className="flex gap-3 mt-4">
          <BeerXmlExportButton recipe={recipe} />
          <ForkButton
            recipeName={recipe.name}
            parentSanityId={recipe._id}
            recipeData={{
              style: recipe.style,
              difficulty: recipe.difficulty,
              batchSize: recipe.batchSize,
              grains: recipe.grains || [],
              hops: recipe.hops || [],
              yeast: recipe.yeast || {},
              additions: recipe.additions || [],
              process: recipe.process || [],
            }}
          />
        </div>
      </header>

      <RecipeScaler recipe={recipe} />

      {forks.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-4">
            <GitFork className="inline h-5 w-5 mr-1" />
            Community Forks ({forks.length})
          </h2>
          <div className="space-y-3">
            {forks.map((fork) => {
              const avgRating =
                fork.ratings.length > 0
                  ? Math.round(
                      (fork.ratings.reduce((s, r) => s + r.value, 0) /
                        fork.ratings.length) *
                        10
                    ) / 10
                  : null;
              return (
                <Link key={fork.id} href={`/forks/${fork.id}`}>
                  <div className="flex items-center gap-3 p-4 bg-card rounded-lg border border-border hover:bg-accent transition-colors">
                    {fork.user.image && (
                      <Image
                        src={fork.user.image}
                        alt=""
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                    )}
                    <div className="flex-1">
                      <span className="font-medium text-sm">{fork.name}</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        av {fork.user.name}
                      </span>
                      {fork.changeNotes && (
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                          {fork.changeNotes}
                        </p>
                      )}
                    </div>
                    {avgRating && (
                      <span className="flex items-center gap-1 text-sm">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        {avgRating}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
