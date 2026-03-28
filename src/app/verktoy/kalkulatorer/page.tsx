import { AbvCalculator } from "@/components/calculators/abv-calculator";
import { IbuCalculator } from "@/components/calculators/ibu-calculator";
import { SrmCalculator } from "@/components/calculators/srm-calculator";
import { PitchRateCalculator } from "@/components/calculators/pitch-rate-calculator";
import { CarbonationCalculator } from "@/components/calculators/carbonation-calculator";

export const metadata = {
  title: "Kalkulatorer — Uranus Garage",
  description: "Bryggkalkulatorer: ABV, IBU, SRM, Pitch Rate og Karbonering.",
};

export default function CalculatorsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Kalkulatorer</h1>
      <p className="text-muted-foreground mb-8">
        Alt du trenger for å beregne de viktigste verdiene i brygget ditt.
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AbvCalculator />
        <IbuCalculator />
        <SrmCalculator />
        <PitchRateCalculator />
        <div className="lg:col-span-2">
          <CarbonationCalculator />
        </div>
      </div>
    </div>
  );
}
