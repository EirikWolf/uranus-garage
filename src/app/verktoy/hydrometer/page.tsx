import { HydrometerCalculator } from "@/components/calculators/hydrometer-calculator";

export const metadata = {
  title: "Hydrometerjustering — Uranus Garage",
  description: "Korriger hydrometeret for temperatur (kalibrert ved 20°C).",
};

export default function HydrometerPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Hydrometerjustering</h1>
      <p className="text-muted-foreground mb-8">
        Korriger avlest SG for temperatur når hydrometeret er kalibrert ved 20°C.
      </p>
      <HydrometerCalculator />
    </div>
  );
}
