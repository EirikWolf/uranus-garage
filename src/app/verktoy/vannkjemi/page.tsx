import { WaterChemistryCalculator } from "@/components/calculators/water-chemistry-calculator";

export const metadata = {
  title: "Vannkjemi — Uranus Garage",
  description: "Beregn mineraliltsetninger for å matche historiske vannprofiler som Pilsen, München, Burton og Dublin.",
};

export default function WaterChemistryPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Vannkjemi</h1>
      <p className="text-muted-foreground mb-8">
        Oppgi kildevann og velg en historisk profil — kalkulatoren beregner hvor mye gips,
        kalsiumklorid og andre mineraler du trenger å tilsette meskevann.
      </p>
      <WaterChemistryCalculator />
    </div>
  );
}
