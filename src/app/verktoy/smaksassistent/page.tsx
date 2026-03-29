import { SensoryMirrorForm } from "@/components/ai/sensory-mirror-form";
import { getTranslations } from "next-intl/server";

export const metadata = {
  title: "Smaksassistenten — Uranus Garage",
  description: "AI-drevet feilsøking av bismak i hjemmebrygget øl.",
};

export default async function SensoryMirrorPage() {
  const t = await getTranslations("ai.sensory");

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">{t("title")}</h1>
      <p className="text-muted-foreground mb-8">
        {t("subtitle")}
      </p>
      <SensoryMirrorForm />
    </div>
  );
}
