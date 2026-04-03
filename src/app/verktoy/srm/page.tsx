import { SrmCalculator } from "@/components/calculators/srm-calculator";

export const metadata = {
  title: "SRM-fargekalkulator — Uranus Garage",
  description: "Beregn ølfargen i SRM (Standard Reference Method) fra kornlisten.",
};

export default function SrmPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">SRM-fargekalkulator</h1>
      <p className="text-muted-foreground mb-8">
        Beregn ølfargen i SRM fra kornliste og batchstørrelse (Morey-likningen).
      </p>
      <SrmCalculator />
    </div>
  );
}
