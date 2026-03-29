import { HopSubstituteTool } from "@/components/hop-substitute-tool";

export const metadata = {
  title: "Humle-erstatning — Uranus Garage",
  description: "Gått tom for humle midt i brygget? Finn den beste erstatningen.",
};

export default function HopSubstitutePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Humle-erstatning</h1>
      <p className="text-muted-foreground mb-8">
        Midt i brygget og tom for humle? Velg sorten du mangler, og vi foreslår de beste alternativene.
      </p>
      <HopSubstituteTool />
    </div>
  );
}
