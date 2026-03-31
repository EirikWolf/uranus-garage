import { IngredientsDatabase } from "@/components/ingredients-database";
import { ImportIngredientsButton } from "@/components/import-ingredients-button";
import { getFermentables, getHops, getYeasts } from "@/lib/ingredients";
import { auth } from "@/lib/auth";

export const metadata = {
  title: "Ingrediensdatabase — Uranus Garage",
  description:
    "Søk i malt, humle og gjær. Data fra BeerAPI med hundrevis av ingredienser.",
};

export default async function IngredientsPage() {
  const [fermentables, hops, yeasts, session] = await Promise.all([
    getFermentables(),
    getHops(),
    getYeasts(),
    auth(),
  ]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Ingrediensdatabase</h1>
          <p className="text-muted-foreground">
            Søk og filtrer i malt, humle og gjær. Klikk på en ingrediens for
            alle detaljer.
          </p>
        </div>
        {session?.user && (
          <ImportIngredientsButton
            counts={{ fermentables: fermentables.length, hops: hops.length, yeasts: yeasts.length }}
          />
        )}
      </div>

      {fermentables.length === 0 && hops.length === 0 && yeasts.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <p className="text-lg mb-2">Ingen data importert ennå.</p>
          {session?.user ? (
            <p className="text-sm">Bruk knappen øverst til høyre for å importere fra BeerAPI.</p>
          ) : (
            <p className="text-sm">Logg inn for å importere data.</p>
          )}
        </div>
      ) : (
        <IngredientsDatabase
          fermentables={fermentables}
          hops={hops}
          yeasts={yeasts}
        />
      )}
    </div>
  );
}
