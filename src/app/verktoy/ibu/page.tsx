import { IbuCalculator } from "@/components/calculators/ibu-calculator";

export const metadata = {
  title: "IBU-kalkulator — Uranus Garage",
  description: "Beregn bitterhet (IBU) etter Tinseth-formelen.",
};

export default function IbuPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">IBU-kalkulator</h1>
      <p className="text-muted-foreground mb-8">
        Beregn humlebitterhet i IBU etter Tinseth-formelen.
      </p>
      <IbuCalculator />
    </div>
  );
}
