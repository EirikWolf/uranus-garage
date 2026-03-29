import { config } from "dotenv";
config({ path: ".env.local" });
import { createClient } from "@sanity/client";
import { v4 as uuid } from "uuid";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_TOKEN!,
  useCdn: false,
});

function blockText(text: string) {
  return text.split("\n\n").map((p) => ({
    _type: "block",
    _key: uuid().slice(0, 8),
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: uuid().slice(0, 8),
        text: p.trim(),
        marks: [],
      },
    ],
  }));
}

async function main() {
  await client.createOrReplace({
    _id: "article-vic-secret",
    _type: "article",
    title: "Vic Secret — Australias hemmelige våpen",
    slug: {
      _type: "slug",
      current: "vic-secret-australias-hemmelige-vapen",
    },
    category: "ravarefokus",
    publishedAt: "2026-03-29T10:00:00Z",
    author: { _type: "reference", _ref: "brewer-eirik" },
    tags: ["humle", "vic secret", "australia", "IPA", "tropisk", "ananas"],
    seoDescription:
      "Vic Secret er humlen du ikke visste du trengte. Ananas, pasjonsfrukt og furu — rett fra Australia.",
    body: blockText(
      `Når du første gang hører "Vic Secret", er det lett å forestille seg noe fra en kjent undertøyskjede. Men nei — dette er ikke en ny push-up-modell. Vic Secret er faktisk oppkalt etter delstaten Victoria i Australia, og det morsomste av alt: sorten ble holdt hemmelig i årevis under utvikling. Bokstavelig talt. "Vic" for Victoria, "Secret" fordi ingen fikk vite om den. Det er den typen origin story som gjør at du respekterer en humle litt ekstra.

Aromaprofilen er kortfattet beskrevet som: ananas på steroider. Ingen annen kommersiell humle banker opp ananaskarakteren slik Vic Secret gjør. Under der finner du pasjonsfrukt, fersken og en frisk, harpiksholdig furutopp som holder deg jordet. Og så er det den lille «dank»-tonen som noen beskriver som urteaktig, andre som noe litt mer … botanisk. Du vet. Det er ikke en feil — det er karakter.

Alfasyreinnholdet ligger på 14–17 %, noe som gjør Vic Secret til en dual-purpose-beast. Den kan brukes til bittersetting OG aroma. Men la oss være ærlige: å bruke denne humlen tidlig i koket er litt som å fylle en Ferrari med dieselolje. Teknisk mulig. Fullstendig bortkastet. De tropiske aromaforbindelsene er flyktige, og høy varme i 60 minutter sender dem rett ut av kjelen og inn i atmosfæren der de fortjener en bedre skjebne.

Historisk sett ble Vic Secret utviklet av Hop Products Australia som et kryss mellom en unavngitt australsk sort og en tysk hannhumle. Ikke akkurat den mest glamorøse opprinnelsen, men resultatet snakker for seg selv. Sorten ble kommersielt lansert rundt 2013 og har siden spredt seg som ild i tørt gress — eller som ananasjuice i et bryggeri, om du vil.

Til tross for australsk opprinnelse har Vic Secret gjort seg svært godt likt i norske og skandinaviske bryggerier. Lervig, Amundsen og en rekke andre håndbryggerier på topp ti-listene bruker den jevnlig. Det er litt poetisk: en australsk humle som trives like godt i Stavanger som i Sydney. Sammenligner du med Galaxy — den andre store australske stjerna — er Galaxy mer sitrus og fersken, mens Vic Secret er mer ananas og furu. Tilsammen er de «the Australian dream team» på humlekortet. Bruk dem begge og noen vil sannsynligvis spørre om du har tilsatt fruktsaft.

Bruker du Vic Secret riktig, betyr det: whirlpool og tørrhumling. Ingenting annet. Tenk på det som dyrt parfyme — du koker ikke middag med Chanel No. 5, og du kaster ikke Vic Secret i koket ved 60-minuttersmerket. Tilsett den under whirlpool når temperaturen er nede under 80 °C, og legg på ordentlig med tørrhumle i fermenteringstanken. Da får du alt det humlen har å gi.

En siste advarsel, formulert som en betryggende observasjon: hvis ferdigbrygget NEIPA lukter som en piña colada, er det høyst sannsynlig at du har brukt Vic Secret. Dette er ikke en klage. Dette er en suksessmelding. Start med 3–5 g/L i tørrhumling — humlen er konsentrert og potent. Du kan alltid øke dosen neste brygg, men du kan ikke ta ut ananassmaken når den først er der. Og det er egentlig greit.`
    ),
  });

  console.log("Article 'article-vic-secret' created/replaced successfully.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
