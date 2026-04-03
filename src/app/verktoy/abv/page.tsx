import { AbvCalculator } from "@/components/calculators/abv-calculator";

export const metadata = {
  title: "ABV-kalkulator — Uranus Garage",
  description: "Beregn alkoholinnhold (ABV) fra original- og sluttvekt.",
};

export default function AbvPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">ABV-kalkulator</h1>
      <p className="text-muted-foreground mb-8">
        Beregn alkoholprosent fra original- og sluttvekt (OG/FG).
      </p>
      <AbvCalculator />
    </div>
  );
}
