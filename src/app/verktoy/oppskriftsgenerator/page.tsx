import { RecipeGeneratorForm } from "@/components/ai/recipe-generator-form";
import { getTranslations } from "next-intl/server";

export const metadata = {
  title: "AI Oppskriftsgenerator — Uranus Garage",
  description: "Generer øloppskrifter med kunstig intelligens.",
};

export default async function RecipeGeneratorPage() {
  const t = await getTranslations("ai.generator");

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">{t("title")}</h1>
      <p className="text-muted-foreground mb-8">
        {t("subtitle")}
      </p>
      <RecipeGeneratorForm />
    </div>
  );
}
