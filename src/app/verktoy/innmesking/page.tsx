import { StrikeWaterCalculator } from "@/components/calculators/strike-water-calculator";

export const metadata = {
  title: "Innmeskingstemperatur — Uranus Garage",
  description: "Beregn riktig innmeskingstemperatur (strike water) etter Palmers formel.",
};

export default function InnmeskingPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Innmeskingstemperatur</h1>
      <p className="text-muted-foreground mb-8">
        Beregn hvor varm innmeskingsvannet bør være for å treffe ønsket mesketemperatur (Palmers formel).
      </p>
      <StrikeWaterCalculator />
    </div>
  );
}
