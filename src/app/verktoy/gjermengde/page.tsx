import { PitchRateCalculator } from "@/components/calculators/pitch-rate-calculator";

export const metadata = {
  title: "Gjærmengde-kalkulator — Uranus Garage",
  description: "Beregn riktig gjærmengde (pitch rate) for ale og lager.",
};

export default function GjermengdePage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Gjærmengde</h1>
      <p className="text-muted-foreground mb-8">
        Beregn anbefalt gjærmengde (pitch rate) for ale og lager basert på OG og volum.
      </p>
      <PitchRateCalculator />
    </div>
  );
}
