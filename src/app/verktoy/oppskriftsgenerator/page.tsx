import { RecipeGeneratorForm } from "@/components/ai/recipe-generator-form";

export const metadata = {
  title: "AI Oppskriftsgenerator — Uranus Garage",
  description: "Generer øloppskrifter med kunstig intelligens.",
};

export default function RecipeGeneratorPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">AI Oppskriftsgenerator</h1>
      <p className="text-muted-foreground mb-8">
        Beskriv ølet du drømmer om, så lager AI-en en komplett oppskrift for deg.
      </p>
      <RecipeGeneratorForm />
    </div>
  );
}
