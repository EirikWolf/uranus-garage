import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Calculator, Sparkles, Stethoscope } from "lucide-react";

export const metadata = {
  title: "Verktøy — Uranus Garage",
  description: "Bryggeverktøy: kalkulatorer, AI-oppskriftsgenerator og smaksassistent.",
};

const tools = [
  {
    href: "/verktoy/kalkulatorer",
    icon: Calculator,
    title: "Kalkulatorer",
    description: "ABV, IBU, SRM, Pitch Rate og Karbonering",
  },
  {
    href: "/verktoy/oppskriftsgenerator",
    icon: Sparkles,
    title: "AI Oppskriftsgenerator",
    description: "Generer oppskrifter med kunstig intelligens",
    comingSoon: true,
  },
  {
    href: "/verktoy/smaksassistent",
    icon: Stethoscope,
    title: "Smaksassistenten",
    description: "AI-drevet feilsøking av bismak i ølet ditt",
    comingSoon: true,
  },
];

export default function ToolsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Verktøy</h1>
      <p className="text-muted-foreground mb-8">
        Nyttige verktøy for hjemmebryggere.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => {
          const Icon = tool.icon;
          const content = (
            <Card className={`bg-card hover:bg-accent transition-colors h-full ${tool.comingSoon ? "opacity-60" : ""}`}>
              <CardContent className="pt-6 text-center">
                <Icon className="h-10 w-10 text-primary mx-auto mb-3" />
                <h3 className="font-bold text-lg">{tool.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {tool.description}
                </p>
                {tool.comingSoon && (
                  <span className="text-xs bg-secondary px-2 py-1 rounded mt-3 inline-block">
                    Kommer snart
                  </span>
                )}
              </CardContent>
            </Card>
          );
          return tool.comingSoon ? (
            <div key={tool.href}>{content}</div>
          ) : (
            <Link key={tool.href} href={tool.href}>{content}</Link>
          );
        })}
      </div>
    </div>
  );
}
