import { getTranslations } from "next-intl/server";
import { AbvCalculator } from "@/components/calculators/abv-calculator";
import { IbuCalculator } from "@/components/calculators/ibu-calculator";
import { SrmCalculator } from "@/components/calculators/srm-calculator";
import { PitchRateCalculator } from "@/components/calculators/pitch-rate-calculator";
import { CarbonationCalculator } from "@/components/calculators/carbonation-calculator";
import { HydrometerCalculator } from "@/components/calculators/hydrometer-calculator";
import { StrikeWaterCalculator } from "@/components/calculators/strike-water-calculator";

export const metadata = {
  title: "Kalkulatorer — Uranus Garage",
  description: "Bryggkalkulatorer: ABV, IBU, SRM, Pitch Rate, Karbonering, Hydrometerjustering og Innmeskingstemperatur.",
};

export default async function CalculatorsPage() {
  const t = await getTranslations("calculators");
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">{t("title")}</h1>
      <p className="text-muted-foreground mb-8">
        {t("subtitle")}
      </p>

      <h2 className="text-lg font-semibold mb-4 text-muted-foreground uppercase tracking-wide text-sm">Resept</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        <AbvCalculator />
        <IbuCalculator />
        <SrmCalculator />
        <PitchRateCalculator />
        <div className="lg:col-span-2">
          <CarbonationCalculator />
        </div>
      </div>

      <h2 className="text-lg font-semibold mb-4 text-muted-foreground uppercase tracking-wide text-sm">Prosess</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HydrometerCalculator />
        <StrikeWaterCalculator />
      </div>
    </div>
  );
}
