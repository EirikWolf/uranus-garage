import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sparkles,
  Stethoscope,
  Leaf,
  Droplets,
  Percent,
  FlaskConical,
  Palette,
  Microscope,
  Waves,
  Thermometer,
  Flame,
  DatabaseZap,
} from "lucide-react";

export const metadata = {
  title: "Verktøy — Uranus Garage",
  description: "Bryggeverktøy: kalkulatorer, AI-oppskriftsgenerator og smaksassistent.",
};

const tools = [
  {
    href: "/verktoy/abv",
    icon: Percent,
    title: "ABV",
    description: "Alkoholprosent fra OG og FG",
  },
  {
    href: "/verktoy/ibu",
    icon: FlaskConical,
    title: "IBU",
    description: "Bitterhet etter Tinseth-formelen",
  },
  {
    href: "/verktoy/srm",
    icon: Palette,
    title: "SRM-farge",
    description: "Ølfarge fra kornliste (Morey)",
  },
  {
    href: "/verktoy/gjermengde",
    icon: Microscope,
    title: "Gjærmengde",
    description: "Pitch rate for ale og lager",
  },
  {
    href: "/verktoy/karbonering",
    icon: Waves,
    title: "Karbonering",
    description: "Priming-sukker eller CO₂-trykk",
  },
  {
    href: "/verktoy/hydrometer",
    icon: Thermometer,
    title: "Hydrometer",
    description: "Temperaturkorreksjon av SG",
  },
  {
    href: "/verktoy/innmesking",
    icon: Flame,
    title: "Innmesking",
    description: "Strike water-temperatur (Palmer)",
  },
  {
    href: "/verktoy/vannkjemi",
    icon: Droplets,
    title: "Vannkjemi",
    description: "Mineraliltsetninger til målprofil",
  },
  {
    href: "/verktoy/oppskriftsgenerator",
    icon: Sparkles,
    title: "AI Oppskriftsgenerator",
    description: "Generer oppskrifter med kunstig intelligens",
  },
  {
    href: "/verktoy/smaksassistent",
    icon: Stethoscope,
    title: "Smaksassistenten",
    description: "AI-drevet feilsøking av bismak",
  },
  {
    href: "/verktoy/humle-erstatning",
    icon: Leaf,
    title: "Humle-erstatning",
    description: "Finn alternativer når du mangler en humlesort",
  },
  {
    href: "/verktoy/ingredienser",
    icon: DatabaseZap,
    title: "Ingrediensdatabase",
    description: "Søk i malt, humle og gjær",
  },
];

export default function ToolsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Verktøy</h1>
      <p className="text-muted-foreground mb-8">Nyttige verktøy for hjemmebryggere.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link key={tool.href} href={tool.href}>
              <Card className="bg-card hover:bg-accent transition-colors h-full">
                <CardContent className="pt-6 text-center">
                  <Icon className="h-10 w-10 text-primary mx-auto mb-3" />
                  <h3 className="font-bold text-lg">{tool.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{tool.description}</p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
