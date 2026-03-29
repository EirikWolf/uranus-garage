import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Calculator, Sparkles, Stethoscope, Leaf } from "lucide-react";
import { getTranslations } from "next-intl/server";

export const metadata = {
  title: "Verktøy — Uranus Garage",
  description: "Bryggeverktøy: kalkulatorer, AI-oppskriftsgenerator og smaksassistent.",
};

export default async function ToolsPage() {
  const t = await getTranslations("tools");

  const tools = [
    {
      href: "/verktoy/kalkulatorer",
      icon: Calculator,
      title: t("calculators.title"),
      description: t("calculators.description"),
    },
    {
      href: "/verktoy/oppskriftsgenerator",
      icon: Sparkles,
      title: t("recipeGenerator.title"),
      description: t("recipeGenerator.description"),
    },
    {
      href: "/verktoy/smaksassistent",
      icon: Stethoscope,
      title: t("sensoryMirror.title"),
      description: t("sensoryMirror.description"),
    },
    {
      href: "/verktoy/humle-erstatning",
      icon: Leaf,
      title: "Humle-erstatning",
      description: "Finn alternativer når du mangler en humlesort",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">{t("title")}</h1>
      <p className="text-muted-foreground mb-8">
        {t("subtitle")}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link key={tool.href} href={tool.href}>
              <Card className="bg-card hover:bg-accent transition-colors h-full">
                <CardContent className="pt-6 text-center">
                  <Icon className="h-10 w-10 text-primary mx-auto mb-3" />
                  <h3 className="font-bold text-lg">{tool.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {tool.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
