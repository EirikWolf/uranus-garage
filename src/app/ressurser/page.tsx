import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Globe, Store, ShoppingBag } from "lucide-react";

export const metadata = {
  title: "Råvarer og utstyr — Uranus Garage",
  description: "Oversikt over norske butikker og nettbutikker for hjemmebrygging.",
};

interface Supplier {
  name: string;
  url: string;
  type: "nettbutikk" | "fysisk" | "begge";
  location?: string;
  address?: string;
  description: string;
}

const onlineShops: Supplier[] = [
  {
    name: "Bryggselv.no",
    url: "https://bryggselv.no",
    type: "nettbutikk",
    description: "En av de mest kjente aktørene i det norske hjemmebryggemarkedet. Bredt utvalg av råvarer og utstyr.",
  },
  {
    name: "Strømmen Hjemmebrygg (Homebrew.no)",
    url: "https://homebrew.no",
    type: "begge",
    location: "Strømmen",
    description: "Stort utvalg av både startsett og avansert utstyr. Også fysisk butikk i Strømsveien 80.",
  },
  {
    name: "Litebrygg.no",
    url: "https://litebrygg.no",
    type: "nettbutikk",
    description: "Spesialiserer seg på bryggeutstyr og reservedeler.",
  },
];

const physicalShops: Supplier[] = [
  {
    name: "Brewshop.no",
    url: "https://brewshop.no",
    type: "begge",
    location: "Trondheim",
    address: "Bratsbergvegen 2",
    description: "En av landets største butikker for hjemmebryggere. Svært bredt utvalg av alt fra bryggemaskiner til fersk malt og humle.",
  },
  {
    name: "Ølbrygging AS",
    url: "https://olbrygging.no",
    type: "begge",
    location: "Grimstad",
    address: "Østerskogen 55",
    description: "Kjent for å ha et enormt utvalg av både utstyr og ingredienser.",
  },
  {
    name: "Holm Brew",
    url: "https://holmbrew.no",
    type: "begge",
    location: "Rud / Bærum",
    address: "Rudssletta 68",
    description: "Populær butikk for bryggere i Oslo-området. Tidligere Bryggselv-lokalene.",
  },
  {
    name: "Vestbrygg",
    url: "https://vestbrygg.no",
    type: "begge",
    location: "Bergen",
    address: "Eikeveien 1",
    description: "Spesialbutikk som betjener bryggere på Vestlandet med alt av råvarer og utstyr.",
  },
  {
    name: "Strømmen Hjemmebrygg",
    url: "https://homebrew.no",
    type: "begge",
    location: "Strømmen",
    address: "Strømsveien 80",
    description: "Godt utvalg for hjemmebryggere på Romerike.",
  },
  {
    name: "Borrebrygg",
    url: "https://borrebrygg.no",
    type: "fysisk",
    location: "Horten",
    address: "Thuegata 2",
    description: "Velutstyrt butikk som dekker behovene til bryggere i Vestfold.",
  },
  {
    name: "Tapp & Kork",
    url: "https://tappogkork.no",
    type: "fysisk",
    location: "Molde",
    description: "Lokal butikk for bryggere i Møre og Romsdal.",
  },
];

const otherShops: Supplier[] = [
  {
    name: "Gulating Ølutsalg",
    url: "https://gulating.no",
    type: "fysisk",
    location: "Flere steder",
    description: "Enkelte Gulating-butikker (som på Strømmen eller i Drammen) fører bryggeutstyr og ingredienser i tillegg til ferdigøl.",
  },
  {
    name: "Europris",
    url: "https://europris.no",
    type: "fysisk",
    location: "Landsdekkende",
    description: "For nybegynnere — har ofte enkle startsett for øl- og vinlegging, samt konsentrerte ølsett (ekstraktsett).",
  },
];

function SupplierCard({ supplier }: { supplier: Supplier }) {
  const typeLabel =
    supplier.type === "nettbutikk"
      ? "Nettbutikk"
      : supplier.type === "fysisk"
        ? "Fysisk butikk"
        : "Nett + Fysisk";
  const typeColor =
    supplier.type === "nettbutikk"
      ? "bg-blue-900/50 text-blue-300 border-blue-700"
      : supplier.type === "fysisk"
        ? "bg-green-900/50 text-green-300 border-green-700"
        : "bg-purple-900/50 text-purple-300 border-purple-700";
  const TypeIcon =
    supplier.type === "nettbutikk"
      ? Globe
      : supplier.type === "fysisk"
        ? Store
        : ShoppingBag;

  return (
    <a href={supplier.url} target="_blank" rel="noopener noreferrer">
      <Card className="bg-card hover:bg-accent transition-colors h-full">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-bold text-lg">{supplier.name}</h3>
            <Badge variant="outline" className={typeColor}>
              <TypeIcon className="h-3 w-3 mr-1" />
              {typeLabel}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mb-3">{supplier.description}</p>
          {(supplier.location || supplier.address) && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {supplier.address
                ? `${supplier.address}, ${supplier.location}`
                : supplier.location}
            </div>
          )}
        </CardContent>
      </Card>
    </a>
  );
}

export default function SupplierDirectoryPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Råvarer og utstyr</h1>
      <p className="text-muted-foreground mb-12">
        Hvor hjemmebryggere i Norge kan få tak i malt, humle, gjær og utstyr.
      </p>

      {/* Online shops */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <Globe className="h-6 w-6 text-primary" />
          Nettbutikker
        </h2>
        <p className="text-muted-foreground mb-6">Bestill råvarer og utstyr på nett — levert hjem.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {onlineShops.map((shop) => (
            <SupplierCard key={shop.name} supplier={shop} />
          ))}
        </div>
      </section>

      {/* Physical shops */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <Store className="h-6 w-6 text-primary" />
          Fysiske butikker
        </h2>
        <p className="text-muted-foreground mb-6">Besøk en butikk og få råd ansikt til ansikt.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {physicalShops.map((shop) => (
            <SupplierCard key={shop.name + shop.location} supplier={shop} />
          ))}
        </div>
      </section>

      {/* Other shops */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <ShoppingBag className="h-6 w-6 text-primary" />
          Andre utsalgssteder
        </h2>
        <p className="text-muted-foreground mb-6">Butikker som fører noe bryggeutstyr ved siden av andre varer.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {otherShops.map((shop) => (
            <SupplierCard key={shop.name} supplier={shop} />
          ))}
        </div>
      </section>

      {/* Tip box */}
      <Card className="bg-card border-border border-l-4 border-l-primary">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-2">Tips til nybegynnere</h3>
          <p className="text-sm text-muted-foreground">
            Starter du med hjemmebrygging? Vi anbefaler å kjøpe et startsett fra en nettbutikk som Bryggselv eller Brewshop.
            De inkluderer alt du trenger for første brygg. Når du later vil ha spesialingredienser eller rask levering,
            er det greit å ha en fysisk butikk i nærheten. Sjekk også ut vår guide
            &quot;Kom i gang med hjemmebrygging&quot; under Akademiet!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
