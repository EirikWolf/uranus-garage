import { getAllRecipes } from "@/lib/sanity";
import { RecipeFilter } from "@/components/recipe-filter";

export const revalidate = 60;

export const metadata = {
  title: "Oppskrifter — Uranus Garage",
  description: "Oppskriftsarkiv fra Uranus Garage. Søk, filtrer og skaler.",
};

export default async function RecipeArchivePage() {
  const recipes = await getAllRecipes();

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Oppskrifter</h1>
      <p className="text-muted-foreground mb-8">
        Alle våre oppskrifter — med volumskalering og vanskelighetsgrad.
      </p>
      {recipes.length === 0 ? (
        <p className="text-muted-foreground">Ingen oppskrifter ennå.</p>
      ) : (
        <RecipeFilter recipes={recipes} />
      )}
    </div>
  );
}
