import Image from "next/image";

const illustrations: Record<string, Record<string, { src: string; alt: string }>> = {
  diy: {
    "bygg-din-egen-fermentorkjoler": {
      src: "/diy/fermentor-cooler.svg",
      alt: "Koblingsskjema for fermentorkjøler med Inkbird ITC-308",
    },
    "lag-en-billig-hopstand-slange": {
      src: "/diy/hopstand-slange.svg",
      alt: "Diagram av gravitasjonsdrevet hopstand/whirlpool-oppsett",
    },
    "3d-printet-tappekran-handtak": {
      src: "/diy/tap-handle-3d.svg",
      alt: "Tverrsnitt av 3D-printet tappekran-håndtak med mål og print-innstillinger",
    },
    "keezer-bygg-for-hjemmebryggeren": {
      src: "/diy/keezer-build.svg",
      alt: "Eksplodert visning av keezer-bygg med fryseboks, trekrage og fat",
    },
    "automatisk-temperaturlogging-med-rapt": {
      src: "/diy/rapt-setup.svg",
      alt: "RAPT hydrometer oppsett og dataflyt fra fermentor til sky",
    },
    "bygg-en-spunding-ventil": {
      src: "/articles/diy/spunding-ventil.svg",
      alt: "Spunding-ventil med trykkregulering for naturlig karbonering",
    },
    "lag-din-egen-hop-spider": {
      src: "/articles/diy/hop-spider.svg",
      alt: "Hop spider — rustfri stålkurv for humle i bryggekjelen",
    },
    "gjaeringsskap-fra-gammelt-kjoleskap": {
      src: "/articles/diy/gjaeringskap.svg",
      alt: "Gjæringsskap bygget fra gammelt kjøleskap med temperaturkontroll",
    },
  },
  ravarefokus: {
    "citra-kongen-av-moderne-humle": {
      src: "/articles/ravarefokus/citra-humle.svg",
      alt: "Citra-humle — aromaprofil med tropisk, sitrus og furu-karakterer",
    },
    "maris-otter-den-engelske-klassikeren": {
      src: "/articles/ravarefokus/maris-otter.svg",
      alt: "Maris Otter maltprofil — biscuit, nøtt og brød-karakterer",
    },
    "saaz-europas-edleste-humle": {
      src: "/articles/ravarefokus/saaz-humle.svg",
      alt: "Saaz noble hop — krydret, urteaktig aroma fra Tsjekkia",
    },
    "munich-malt-ryggraden-i-tyske-ol": {
      src: "/articles/ravarefokus/munich-malt.svg",
      alt: "Munich Malt profil — brød, toast og honning-karakterer",
    },
    "mosaic-allrounderen-blant-humler": {
      src: "/articles/ravarefokus/mosaic-humle.svg",
      alt: "Mosaic-humle — bær, tropisk frukt og urtearoma",
    },
    "golden-promise-skottlands-stolthet": {
      src: "/articles/ravarefokus/golden-promise.svg",
      alt: "Golden Promise malt — skotsk heritage-malt med rik karakter",
    },
    "us-05-gjaren-som-aldri-svikter": {
      src: "/articles/ravarefokus/us-05-gjaer.svg",
      alt: "Safale US-05 gjærprofil — temperatur og fermenteringskurve",
    },
    "vic-secret-australias-hemmelige-vapen": {
      src: "/articles/ravarefokus/vic-secret.svg",
      alt: "Vic Secret humleprofil — ananas, pasjonsfrukt og furu fra Australia",
    },
  },
  akademiet: {
    "kom-i-gang-med-hjemmebrygging": {
      src: "/articles/akademiet/kom-i-gang.svg",
      alt: "Bryggeprosessen steg for steg — fra mesking til tapping",
    },
    "mestring-av-mesking": {
      src: "/articles/akademiet/mesking.svg",
      alt: "Mesketemperatur og enzymaktivitet — beta- og alfa-amylase",
    },
    "gaeringskontroll-nokkelen-til-godt-ol": {
      src: "/articles/akademiet/gaering.svg",
      alt: "Gjæringsfaser og temperaturkontroll for ale og lager",
    },
    "vannkjemi-for-hjemmebryggere": {
      src: "/articles/akademiet/vannkjemi.svg",
      alt: "Vannkjemi — mineralprofiler for ulike ølstiler",
    },
    "toerrhumling-den-komplette-guiden": {
      src: "/articles/akademiet/toerrhumling.svg",
      alt: "Tørrhumling — når, hvor mye, og hvordan",
    },
    "feilsoeking-nar-brygget-ikke-ble-som-planlagt": {
      src: "/articles/akademiet/feilsoeking.svg",
      alt: "Feilsøkingsflytskjema for vanlige bryggeproblemer",
    },
  },
};

export function ArticleIllustration({
  category,
  slug,
}: {
  category: string;
  slug: string;
}) {
  const categoryIllustrations = illustrations[category];
  if (!categoryIllustrations) return null;

  const illustration = categoryIllustrations[slug];
  if (!illustration) return null;

  return (
    <figure className="my-8 rounded-lg overflow-hidden border border-border">
      <Image
        src={illustration.src}
        alt={illustration.alt}
        width={800}
        height={450}
        className="w-full h-auto"
        priority
      />
      <figcaption className="text-xs text-muted-foreground text-center py-2 bg-card">
        {illustration.alt}
      </figcaption>
    </figure>
  );
}
