import { CarbonationCalculator } from "@/components/calculators/carbonation-calculator";

export const metadata = {
  title: "Karboneringskalulator — Uranus Garage",
  description: "Beregn sukkermengde for priming eller trykk for force carbonation.",
};

export default function KarboneringPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Karbonering</h1>
      <p className="text-muted-foreground mb-8">
        Beregn sukkermengde for priming eller CO₂-trykk for force carbonation.
      </p>
      <CarbonationCalculator />
    </div>
  );
}
