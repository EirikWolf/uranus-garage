import Image from "next/image";

const illustrations: Record<string, { src: string; alt: string }> = {
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
};

export function DiyIllustration({ slug }: { slug: string }) {
  const illustration = illustrations[slug];
  if (!illustration) return null;

  return (
    <figure className="my-8 rounded-lg overflow-hidden border border-border">
      <Image
        src={illustration.src}
        alt={illustration.alt}
        width={800}
        height={500}
        className="w-full h-auto"
        priority
      />
      <figcaption className="text-xs text-muted-foreground text-center py-2 bg-card">
        {illustration.alt}
      </figcaption>
    </figure>
  );
}
