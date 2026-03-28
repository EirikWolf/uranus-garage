import { notFound } from "next/navigation";
import Link from "next/link";
import { DifficultyBadge } from "@/components/difficulty-badge";
import { RecipeScaler } from "@/components/recipe-scaler";
import { getAllRecipes, getRecipeBySlug } from "@/lib/sanity";
import { BeerXmlExportButton } from "@/components/beerxml-export-button";

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
        <div className="mt-4">
          <BeerXmlExportButton recipe={recipe} />
        </div>
      </header>

      <RecipeScaler recipe={recipe} />
    </div>
  );
}
