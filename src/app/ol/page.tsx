import { getAllBeers } from "@/lib/sanity";
import { BeerFilters } from "@/components/beer-filters";

export const revalidate = 60;

export const metadata = {
  title: "Ølkatalog — Uranus Garage",
  description: "Alle øl brygget av Uranus Garage.",
};

export default async function BeerCatalogPage() {
  const beers = await getAllBeers();

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Våre øl</h1>
      <p className="text-muted-foreground mb-8">
        Alt vi har brygget i garasjen.
      </p>
      <BeerFilters beers={beers} />
    </div>
  );
}
