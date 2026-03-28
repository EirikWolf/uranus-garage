import { SensoryMirrorForm } from "@/components/ai/sensory-mirror-form";

export const metadata = {
  title: "Smaksassistenten — Uranus Garage",
  description: "AI-drevet feilsøking av bismak i hjemmebrygget øl.",
};

export default function SensoryMirrorPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Smaksassistenten</h1>
      <p className="text-muted-foreground mb-8">
        Beskriv hva som smaker galt, oppgi bryggeprosess-data, og få en AI-drevet diagnose med konkrete anbefalinger.
      </p>
      <SensoryMirrorForm />
    </div>
  );
}
