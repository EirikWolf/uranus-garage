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

function slug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[æ]/g, "ae")
    .replace(/[ø]/g, "o")
    .replace(/[å]/g, "a")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function blockText(text: string) {
  return text.split("\n\n").map((paragraph) => ({
    _type: "block",
    _key: uuid().slice(0, 8),
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: uuid().slice(0, 8),
        text: paragraph.trim(),
        marks: [],
      },
    ],
  }));
}

// ─── ARTICLES ────────────────────────────────────────────────────────────────

const articles = [
  // --- Råvarefokus ---
  {
    _id: "article-citra-humle",
    title: "Citra — Kongen av moderne humle",
    category: "ravarefokus",
    publishedAt: "2024-09-01T10:00:00Z",
    tags: ["humle", "citra", "IPA", "pale ale"],
    seoDescription:
      "Alt du trenger å vite om Citra-humle — aroma, bruksområder og tips.",
    body: blockText(
      `Citra er en av de mest brukte og gjenkjennbare humlesortene i moderne hjemmebrygging. Den ble utviklet av Hop Breeding Company og sluppet kommersielt rundt 2008. Navnet er en forenkling av "citrus aroma", og det sier det meste: denne humlen bringer intense tropiske og sitrusaktige toner som passer perfekt i moderne IPAer og pale aleser.

Aromaprofilen er dominert av grapefrukt, limeskall, pasjonsfrukt og litt ananas. Alfasyreinnholdet ligger typisk rundt 11–13 %, noe som gjør den egnet til bittersetting, men der den virkelig skinner er som tørr-humle og i whirlpool. Ved temperaturer rundt 80 °C under hopstand frigjøres store mengder aromaoljer uten at bitterheten blir for hard.

Citra fungerer godt alene, men mange bryggere foretrekker å kombinere den med andre moderne sorter. Mosaic gir den en jordnær, bærlik kompleksitet, Galaxy tilfører mer mango og persika, mens Simcoe bidrar med en lett harpiksaktig dybde. En klassisk kombinasjon for NEIPA er Citra og Mosaic i like mengder på tørr-humling.

Anbefalt bruk er 20–50 g/liter for tørr-humling i hazy IPA, og 15–30 g/liter i whirlpool for West Coast IPA eller American Pale Ale. Vær forsiktig med tidlige tilsetninger — i store mengder tidlig i koket kan Citra gi en litt skarp, ubehagelig bitterhet. Hold de store dosene til flameout og etterpå.`
    ),
  },
  {
    _id: "article-maris-otter",
    title: "Maris Otter — Den engelske klassikeren",
    category: "ravarefokus",
    publishedAt: "2024-09-08T10:00:00Z",
    tags: ["malt", "maris otter", "pale ale", "engelsk"],
    seoDescription:
      "Maris Otter er basemalt-kongen. Lær om profil, bruk og hvorfor den er favoritt.",
    body: blockText(
      `Maris Otter er en historisk byggvarietet som har vært dyrket i England siden 1960-tallet. Den regnes av mange engelske bryggere som den ypperste basemalt for ales, og er kjent for sin karakteristiske smak av kjeks, nøtter og lett toast. Sammenliknet med mer nøytrale basimalter som Pilsner Malt eller standard Pale Ale Malt, gir Maris Otter mer maltkarakter allerede fra grunnen av.

Enzymatisk sett er Maris Otter fullt modifisert og har rikelig med diastatisk kraft til å meskifisere seg selv og en liten andel adjunkter. Fargeskalaen ligger rundt 3–4 Lovibond, noe som gir den brygget en lys gyllen til ambra farge avhengig av mesketemperatur og kornblandingen for øvrig.

Der Pilsner Malt gir et nøytralt lerret og American 2-row er mildere og hveteaktig, er Maris Otter godt egnet der du ønsker at malten selv skal snakke. Den passer ypperlig som basemalt i engelske stiler som ESB, Best Bitter, Porter og Stout. Brukes gjerne som 90–100 % av kornblandingen, eventuelt supplert med Crystal Malt for søthet og litt karamellton.

Praktisk tips: Maris Otter responderer godt på en litt høyere mesketemperatur (67–68 °C) som gir mer dextrin og fylde i kroppen. Det harmonerer bra med engelske gjærstammer som tilfører fruktestere. Mange bryggere sverger til at ølet allerede etter én ukes gjæring har en rund, behagelig smak som tar seg enda bedre ut etter noen ukers kondisjonering på flaske eller fat.`
    ),
  },
  {
    _id: "article-saaz-humle",
    title: "Saaz — Europas edleste humle",
    category: "ravarefokus",
    publishedAt: "2024-09-15T10:00:00Z",
    tags: ["humle", "saaz", "pilsner", "lager", "tsjekkisk"],
    seoDescription:
      "Saaz-humle er hjertet i tsjekkisk pilsner. Her er alt om profil og bruk.",
    body: blockText(
      `Saaz er en av de fire klassiske edelhumlesortene fra Europa, og stammer fra Žatec-regionen i Tsjekkia. Humlen har vært dyrket der i hundrevis av år og er livsnerven i Bohemian Pilsner, den ølstilen som ga verden mal for moderne lager. Ingen annen humle klarer å gi akkurat den krydrete, jordlige og mildt urteaktige aromaen som kjennetegner en god tsjekkisk pilsner.

Alfasyreinnholdet i Saaz er lavt — typisk 2,5–4,5 % — noe som betyr at du trenger relativt store mengder for å oppnå god bitterhet. Derfor brukes den gjerne i 90-minutters kok der de bittre alfasyrene isomeriseres grundig. Tre separate tilsetninger gjennom koket er vanlig: en tidlig for bitterhet, en midt i for smak, og en sent eller ved flameout for aroma.

Bortsett fra tsjekkisk pilsner fungerer Saaz godt i belgiske ales, tyske Kölsch og Helles, og i andre lette lagertyper der du ønsker en diskret, klassisk europafeel. Kombinert med Hallertau Mittelfrüh eller Tettnanger får du en rund, klassisk europeisk humleprofil som egner seg godt til delikat maltfokuserte øl.

Oppbevaring er ekstra viktig for Saaz siden de flyktige aromaoljene er sårbare for oksidasjon. Kjøp ferske pellets, vakkumforseglet, og oppbevar dem i fryseren. Hos Uranus Garage er Saaz en fast ingrediens i Uranus Pilz-serien, og erfaringen er at friske humler fra ny sesong alltid gir et markant løft i aromakvaliteten.`
    ),
  },
  {
    _id: "article-munich-malt",
    title: "Munich Malt — Ryggraden i tyske øl",
    category: "ravarefokus",
    publishedAt: "2024-09-22T10:00:00Z",
    tags: ["malt", "munich", "lager", "oktoberfest", "tysk"],
    seoDescription:
      "Munich Malt gir rik maltkarakter. Perfekt for Märzen, Bock og Vienna Lager.",
    body: blockText(
      `Munich Malt er en kilnetørket spesialmalt med rik, brødaktig og lett toastet smak. Den produseres ved å kilne bygget på høyere temperatur enn vanlig basemalt, noe som aktiverer Maillard-reaksjonene og gir de karakteristiske aromane av brød, kjeks og honning. Fargen ligger typisk mellom 8 og 10 Lovibond for lys Munich, og opptil 20 Lovibond for mørk Munich.

Det unike med Munich Malt er at den har nok enzymatisk aktivitet til å brukes som 100 % basemalt i noen ølstiler, selv om det er vanlig å blande den med pilsnermalt. I en Märzen eller Oktoberfest-øl er 40–60 % Munich Malt vanlig praksis og gir nettopp den maltrike, fyldige karakteren som stilen er kjent for. I Vienna Lager er Munich Malt gjerne 20–30 % av kornblandingen, kombinert med Vienna-malt som base.

For Bock og Doppelbock kan du bruke opp til 80–90 % Munich Malt uten problemer. Da er det viktig å passe på mesketemperaturen: 65–66 °C gir et mer vergærbart vørter, mens 68–70 °C gir mer fylde og kropp. Sistnevnte passer godt for de tyngre tyske stilene.

Praktiske tips: Munich Malt krever litt mer vann enn pilsnermalt på grunn av den tettere meskstrukturen. Sett pH til 5,3–5,4 for best enzymatisk effektivitet. Kjøl ned vørteren raskt for lager, og bruk en god lagergjær som Saflager 34/70 ved 10–12 °C. Resultatet er et øl med dybde og varme som umiddelbart minner om Bayern om høsten.`
    ),
  },

  // --- Akademiet ---
  {
    _id: "article-kom-i-gang-hjemmebrygging",
    title: "Kom i gang med hjemmebrygging",
    category: "akademiet",
    publishedAt: "2024-10-01T10:00:00Z",
    tags: ["nybegynner", "utstyr", "guide", "all-grain"],
    seoDescription:
      "Komplett nybegynnerguide til hjemmebrygging. Fra utstyr til ferdig øl.",
    body: blockText(
      `Hjemmebrygging er en fantastisk hobby som kombinerer vitenskap, håndverk og kreativitet. Det finnes ingen fasit på hva du trenger for å starte, men noen grunnleggende komponenter er uunnværlige: en bryggekjele på minst 30–40 liter, en gjæringsbeholder med lufting, et termometer, et hydrometer for å måle tetthet, og et godt sanitiseringsmiddel. Sanitering er faktisk det viktigste enkeltsteget i hele prosessen — en ren gjæring er halvparten av jobben.

Den grunnleggende brygge­prosessen består av fire faser. Mesking (mash) innebærer å blande knust malt med varmt vann ved ca 65–68 °C slik at enzymer omdanner stivelse til gjærbart sukker. Deretter siler du av vørteren og koker den i 60–90 minutter mens du tilsetter humle på ulike tidspunkt. Etter koket kjøler du ned vørteren raskt til gjæringstemperatur og pitcher gjær. Gjæringsfasen tar vanligvis 1–2 uker.

For ditt første brygg anbefaler vi en enkel American Pale Ale eller en Irish Stout. Disse stilene er tilgivende, billige å brygge, og gir rask belønning. En APA med Safale US-05 og litt Cascade-humle er et klassisk startpunkt. Unngå kompliserte multi-step-mesk-programmer og belgiske gjærstammer som krever nøyaktig temperaturkontroll — hold det enkelt til du er komfortabel med utstyret.

Gjæring er en biologisk prosess, og det viktigste er å gi gjæren gode arbeidsforhold: riktig temperatur (18–20 °C for de fleste ale-gjær), nok næring i form av vørter, og et rent, oksygenfritt miljø etter pitching. Mange nybegynnere åpner lokket for ofte og introduserer oksygen eller smitte. Stol på gjæren — den vet hva den gjør.

Etter gjæring kan du enten flasketappe med litt primingssukker for karbonering, eller koble til fat. Flasketapping er enklest å starte med. Bruk ca 7–8 g sukker per liter, bland grundig, fyll flaskene, og vent 2–3 uker ved romtemperatur. Vanlige nybegynnerfeil inkluderer for tidlig tapping (for høy FG), for lite sanitering, og feil mesketemperatur. Mål alltid gravity med hydromeret ditt — da vet du eksakt hva som skjer.`
    ),
  },
  {
    _id: "article-mestring-av-mesking",
    title: "Mestring av mesking",
    category: "akademiet",
    publishedAt: "2024-10-08T10:00:00Z",
    tags: ["mesking", "temperatur", "pH", "utbytte", "all-grain"],
    seoDescription:
      "Lær å mestre meskeprosessen — temperatur, pH, og utbytte for bedre øl.",
    body: blockText(
      `Mesking er hjertet i all-grain brygging. Det er her stivelsen i malten omdannes til gjærbart sukker gjennom enzymatisk aktivitet. De to viktigste enzymene er beta-amylase og alfa-amylase. Beta-amylase er mest aktiv ved 60–65 °C og produserer de enkle sukrene som gjæren fortærer helt — dette gir et tørt, lett øl. Alfa-amylase jobber best ved 68–72 °C og kutter stivelsen i lengre kjeder som gjæren ikke bryter ned — disse bidrar til kropp og fylde.

pH i meskevæsken er nesten like viktig som temperaturen. Det optimale området er 5,2–5,6 (målt ved romtemperatur). Utenfor dette området jobber enzymene tregere, utbyttet synker og smaken kan bli skarp eller flat. Norsk ledningsvann er ofte alkalisk og krever justering med melkesyre eller calciumklorid. Invester i et pH-meter — det er en av de beste oppgraderingene du kan gjøre.

Vann-til-korn-forholdet i mesken bør ligge på 3–4 liter per kilo malt for en enkelt infusjonsmesk. Tynnere mesk gir litt mer effektivitet og bedre enzymaktivitet, mens tykkere mesk gir noe mer kropp. For step-mashing (flertemperaturmesk) er et noe tynnere startforhold praktisk siden du skal tilsette varmt vann underveis.

Utbytte, eller meskeffektivitet, er et mål på hvor mye sukker du henter ut av malten sammenliknet med det teoretisk mulige. 70–75 % er et godt mål for hjemmebryggere. Lav effektivitet skyldes ofte dårlig maling av malten, for lav mesketemperatur, for kort mesketid, eller en pH utenfor optimalt område. Sparg-steget — skylling av kornsengen etter mesking — bidrar typisk 10–15 % til den totale effektiviteten.

Praktisk tips: Mål alltid pre-boil-gravity og sammenlign med forventet verdi. Da oppdager du problemer tidlig og kan kompensere med litt ekstra spraymalt eller ved å forlenge koketiden. Skriv ned alt i bryggeloggen din, og justér oppskriften neste gang basert på faktiske tall.`
    ),
  },
  {
    _id: "article-gjaeringskontroll",
    title: "Gjæringskontroll — Nøkkelen til godt øl",
    category: "akademiet",
    publishedAt: "2024-10-15T10:00:00Z",
    tags: ["gjæring", "temperatur", "off-flavor", "gjær"],
    seoDescription:
      "Gjæringskontroll er det viktigste du kan gjøre for ølet ditt. Her er guiden.",
    body: blockText(
      `Av alle variablene i bryggeprosessen er gjæringstemperaturen den som har størst innvirkning på smaken av det ferdige ølet. Gjær er ikke bare en sukkerspiser — den er en levende organisme som produserer hundrevis av smaksforbindelser avhengig av temperaturstress, næring og oksygentilgang. Kontrollerer du temperaturen, kontrollerer du smaksprofilen.

Ale-gjær trives generelt mellom 18–22 °C, men de fleste moderne tørrgjærene som US-05 og S-04 jobber best i nedre del av dette området (18–20 °C) for et rent resultat. Lagergjær som Saflager 34/70 fermenteres tradisjonelt ved 10–12 °C, men kan også brukes ved romtemperatur med litt mer esterproduksjon. Husk at gjæringsvarme er en kjemisk prosess som kan heve temperaturen i fermenteringskaret 2–5 °C over omgivelsestemperaturen.

Gjæringen går gjennom tre faser. I lagfasen (de første 12–24 timene) akklimatiserer gjæren seg. Aktiv gjæring varer typisk 3–7 dager med kraftig CO₂-produksjon. Deretter kommer kondisjonering der gjæren rydder opp etter seg — den reabsorberer diacetyl og andre biprodukter. Etter denne fasen er ølet teknisk ferdig, men mange øl har godt av ekstra tid i kaldt.

Vanlige off-flavors fra dårlig temperaturkontroll inkluderer esters (fruktaktig, banansmak ved for høy temp), fuselalkohoer (varm, brennende finish ved stor temperaturtopp tidlig), og diacetyl (smøraktig, en klar indikasjon på for tidlig kulding eller pitching av for lite gjær). Diacetyl kan rettes ved å heve temperaturen til 20 °C et par dager mot slutten av gjæringen — den såkalte diacetyl-resten.

Praktisk temperaturkontroll trenger ikke å være dyrt. En gammel kjøleskap med en Inkbird ITC-308-kontroller og en varmematte er alt som trengs for presis styring gjennom hele gjæringen. Alternativt fungerer en bøtte med kaldt vann og is (swamp cooler) godt om sommeren. Uansett metode: noter temperaturen daglig i bryggeloggen, så ser du mønstrene og kan justere til neste batch.`
    ),
  },

  // --- DIY ---
  {
    _id: "article-fermentorkjoeler",
    title: "Bygg din egen fermentorkjøler",
    category: "diy",
    publishedAt: "2024-11-01T10:00:00Z",
    tags: ["temperaturkontroll", "fermentor", "inkbird", "DIY"],
    seoDescription:
      "Bygg en billig fermentorkjøler med Inkbird-kontroller for perfekt gjæring.",
    body: blockText(
      `Temperaturkontroll er den enkeltfaktoren som gir størst kvalitetsløft i hjemmebryggingen. Uten kontroll er du prisgitt rommets temperatur, som varierer med årstidene og kan ødelegge en ellers god batch. Løsningen er å bygge en enkel fermentorkjøler — et gammelt kjøleskap eller fryseboks med en elektronisk termostat som holder gjæren i akkurat riktig temperaturrange.

Utstyrsliste: Et gammelt kjøleskap eller liten fryseboks (gratis eller billig fra Finn.no), en Inkbird ITC-308 dual-outlet-termostat (ca 200–300 kr), og en 25W varmematte til reptiler eller en liten varmepære for vintersituasjoner. ITC-308 har to stikkontakter — én for kjøling, én for varme — og en probe som måles inne i skapet.

Koblingen er enkel: Proben festes inne i skapet (eller ned i vørteren via et termometerlomme). Kjøleskapets støpsel kobles i cooling-kontakten. Varmematten kobles i heating-kontakten. Sett ønsket temperatur, sett differansetoleransen til ±0,5 °C, og du er i gang. Systemet slår kjøling eller varme på og av automatisk for å holde stabil temperatur.

Resultatet er dramatisk. Batches som tidligere hadde en utilsiktet topp på 24–25 °C i aktiv gjæring holder seg nå rolig på 18–19 °C gjennom hele prosessen. Fuselalkoholer forsvinner, esterprofilen rydder seg opp, og smaken blir renere og mer definert. Investeringen er beskjeden, og kjøleentret tar liten plass i garasjen.`
    ),
  },
  {
    _id: "article-hopstand-slange",
    title: "Lag en billig hopstand-slange",
    category: "diy",
    publishedAt: "2024-11-08T10:00:00Z",
    tags: ["whirlpool", "humle", "DIY", "hopstand"],
    seoDescription:
      "Lag din egen hopstand-slange for bedre humlearoma uten dyr pumpe.",
    body: blockText(
      `En hopstand, eller whirlpool-tilsetning, er en teknikk der humle tilsettes vørteren etter at koket er avsluttet og temperaturen har sunket til 75–85 °C. Ved disse temperaturene isomeriseres lite alfasyre (dvs. lite bitterhet), men aromaoljene frigjøres effektivt uten å dampe bort. Resultatet er en intens, fruktig og aromatisk humleprofil som er umulig å oppnå med bare kettle-tilsetninger.

Du trenger ikke en dyr sirkulasjonspumpe for å gjøre dette. En enkel gravitetsbasert løsning fungerer utmerket for de fleste hjemmebryggere. Alt du trenger er en silikonslange (3/8" indre diameter), en enkel kulekran med mattegjenget uttak, og et rørskjøte for å koble til bryggekjelen. Total kostnad: under 200 kr fra en jernvarehandel.

Slik bruker du det: Etter flammeout, la vørteren kjøle seg ned til 80 °C. Tilsett humlen direkte i kjelen og la den steep i 20 minutter. Rør forsiktig hvert 5. minutt. Deretter åpner du kulekranen og lar vørteren renne ned i kjølespiralen eller en bøtte for videre kjøling. Humleresidiumet samler seg i bunnen av kjelen og fanger opp mye av det faste materialet.

Sammenliknet med kommersielle whirlpool-oppsett er denne løsningen lite effektiv til å sentrere sediment, men til humlearoma er den mer enn god nok. Prøv 50–100 g Citra eller Galaxy i 20 minutters hopstand til din neste IPA, og du vil ikke gå tilbake.`
    ),
  },
  {
    _id: "article-3d-printet-tappekran",
    title: "3D-printet tappekran-håndtak",
    category: "diy",
    publishedAt: "2024-11-15T10:00:00Z",
    tags: ["3D-print", "tappekran", "kegging", "DIY"],
    seoDescription:
      "Design og print dine egne tappekran-håndtak med logo og ølnavn.",
    body: blockText(
      `En av de morsomste DIY-prosjektene for hjemmebryggere med tilgang til 3D-printer er å lage egne tappekran-håndtak. Standardhåndtakene som følger med billige keggingtapper er funksjonelle men upersonlige. Et håndtrykt håndtak med bryggerilogoen din eller ølnavnet gir keezer-en en profesjonell touch.

Du trenger enten en 3D-printer selv (FDM med minst 200 mm build volume) eller tilgang til en print-on-demand-tjeneste som JLCPCB, Craftcloud eller lokale makerspaces. Designprogrammer som Fusion 360 (gratis for hobbybruk) eller TinkerCAD (nettleserbasert og enklere) gjør jobben. Standardgjengene på europeiske tappekraner er 3/8"-16 UNC, og du finner dimensjonsdata fra leverandørens nettside.

Materialvalg: PLA er enklest å printe og gir skarp detaljgjengivelse, men er sprøtt og ikke ideelt for våte miljøer over tid. PETG er bedre valg — det tåler fuktighet, er mer slagfast, og er fremdeles lett å printe. ASA eller ABS er mest holdbart men krever mer avansert printer-oppsett. For et barlock bak i garasjen er PETG mer enn godt nok.

Etterbehandling og maling: Skur ned eventuell stripelaget med 400-grit sandpapir, primer med plastprimer, og mål med spraylakk eller penselfarger. Bruk malerteip for å lage skarpe linjer mellom farger. Avslutt med blank klarlakk for beskyttelse. Med litt tålmodighet ender du opp med et håndtak du er stolt av å vise frem.`
    ),
  },
  {
    _id: "article-keezer-bygg",
    title: "Keezer-bygg for hjemmebryggeren",
    category: "diy",
    publishedAt: "2024-11-22T10:00:00Z",
    tags: ["keezer", "fat", "kegging", "DIY", "bygg"],
    seoDescription:
      "Bygg en keezer — fra fryseboks til komplett fat-system med tappetårn.",
    body: blockText(
      `En keezer er en fryseboks ombygget til å servere øl direkte på fat. Navnet er en sammentrekning av "kegerator" (kjøleskap for fat) og "freezer" (fryseboks). Frysebokser er populære fremfor kjøleskap fordi de gir mer horisontal plass til Cornelius-fat og er lettere å isolere og modifisere. Resultatet er et system der du alltid har fersk, karbonert øl klar til tapping.

Utstyrsliste: En fryseboks på minst 200 liter (secondhand er perfekt), trevirke til halskrage (collar) rundt åpningen, en eller flere tappetårn eller shanks, en CO₂-regulator med manifold, Cornelius-fat (19 liter), ølslanger og koblinger, og en Inkbird-termostat for temperaturkontroll. Budsjett: 3000–8000 kr avhengig av antall tapper og om du kjøper nytt.

Byggetrinnene: Mål insiden av fryseboksen og bygg en treramme (collar) av 5×10 cm bord som legges mellom lokket og boksen. Dette gir høyde til fat og CO₂-tank, og er der du borer hull for tappehaner eller shanks. Tett alle sprekker med silikontetningsmasse. Monter tapper med standard beer-line-kobling (3/16" ID slangesett), tilkoble keg-couplers, og sett på gas.

Kapasitetsplanlegging: En standard 200-liters fryseboks rommer 3–4 Cornelius-fat på 19 liter pluss en 6-kg CO₂-flaske. Bruker du tappetårn på collaren, kan du ha opptil 6 tapper. Gassprogrammering er enkelt: sett regulatoren til 0,8–1,2 bar for normal karbonering av ale (ca 2,5 volum CO₂), eller høyere for belgisk eller hveteøl. Kontroller alltid at det ikke er gasslekkasje med såpevann på alle koblinger.`
    ),
  },
  {
    _id: "article-rapt-temperaturlogging",
    title: "Automatisk temperaturlogging med RAPT",
    category: "diy",
    publishedAt: "2024-11-29T10:00:00Z",
    tags: ["RAPT", "sensor", "temperatur", "gravity", "IoT"],
    seoDescription:
      "Sett opp automatisk temperatur- og gravity-logging med RAPT-hydrometer.",
    body: blockText(
      `RAPT Pill er KegLands trådløse hydrometer som flyter i vørteren under gjæring og sender kontinuerlige målinger av temperatur og gravity via WiFi til en skybasert app. I motsetning til tradisjonelle hydrometere som krever at du tar ut en prøve, gir RAPT deg en kontinuerlig kurve av hele gjæringen — fra OG til FG — uten å åpne gjæringskaret.

Oppsett er enkelt: Lad RAPT-pillen fullt (tar ca 2 timer), kalibrer den ved å legge den i rent vann og justere til 1.000 i appen, koble enheten til WiFi-nettverket ditt via Bluetooth-oppsettmodus, og slipp den ned i vørteren like etter pitching. Den rapporterer hvert 15. minutt som standard, men dette kan justeres.

Dataene er tilgjengelige i RAPT-portalen på nett og i mobilappen. Du ser en graf over gravitetsfall og temperatur i sanntid. Dette er uvurderlig for å fange opp problemer tidlig — stoppet gjæring, uventet temperaturtopp, eller bekreftet FG. Hos Uranus Garage integreres RAPT-dataene med Bryggelab-dashbordet via cloud-APIet som KegLand tilbyr.

Noen praktiske tips: RAPT er kalibrert for temperatur-kompensert gravity-lesing, men avviket fra traditionelt hydrometer kan variere med 0,002–0,005 enheter — les alltid av med vanlig hydrometer på siste dag for å bekrefte FG. Vask RAPT-pillen grundig med PBW etter bruk og oppbevar den i et rent, tørt miljø. Batterilevetiden er typisk 3–4 bruk per full lading under normale gjæringsforhold.`
    ),
  },
];

// ─── BREW LOGS ────────────────────────────────────────────────────────────────

interface BrewLogData {
  _id: string;
  title: string;
  date: string;
  og: number | null;
  fg: number | null;
  tempNotes: string;
  bodyText: string;
  brewerRefs: string[];
}

const brewLogData: BrewLogData[] = [
  // 2024
  {
    _id: "log-esb-april-2024",
    title: "ESB april 2024",
    date: "2024-04-01",
    og: 1.058,
    fg: null,
    tempNotes: "",
    bodyText:
      "Brygget en ESB med Mangrove Jack M42-gjær. Kraftig gjæring fra starten.",
    brewerRefs: ["brewer-eirik"],
  },
  {
    _id: "log-zombie-porter-mars-2024",
    title: "Zombie Porter mars 24",
    date: "2024-03-20",
    og: 1.055,
    fg: null,
    tempNotes: "",
    bodyText:
      "Brygget porter og tappet Uranus Pilz samtidig. Fikk 57 liter vørter.",
    brewerRefs: ["brewer-eirik"],
  },
  {
    _id: "log-uranus-pilz-7",
    title: "Uranus Pilz 7",
    date: "2024-03-06",
    og: 1.053,
    fg: null,
    tempNotes: "",
    bodyText: "Pilsner med 12 kg pilsnermalt og Saaz-humle.",
    brewerRefs: ["brewer-eirik"],
  },
  {
    _id: "log-lucky-jack-ug-2024",
    title: "Lucky Jack UG",
    date: "2024-02-14",
    og: 1.053,
    fg: null,
    tempNotes: "",
    bodyText:
      "Blonde ale med Cara-malt og humle som Amarillo, Chinook og Citra.",
    brewerRefs: ["brewer-eirik"],
  },
  {
    _id: "log-vienna-calling-jan-2024",
    title: "Vienna Calling jan 2024",
    date: "2024-01-19",
    og: 1.055,
    fg: 1.012,
    tempNotes: "",
    bodyText:
      "Brygget for fylkesmesterskapet i Møre og Romsdal. Vienna-malt med Hallertau og Saaz.",
    brewerRefs: ["brewer-eirik", "brewer-rune"],
  },
  {
    _id: "log-vienna-kolch-2024",
    title: "Vienna Kölch",
    date: "2024-01-05",
    og: 1.045,
    fg: null,
    tempNotes: "",
    bodyText:
      "Manglet lagergjær, brukte Kölsch-gjær i stedet. 60 liter til kok.",
    brewerRefs: ["brewer-eirik"],
  },
  // 2023
  {
    _id: "log-lucky-jack-2023",
    title: "Lucky Jack 2023",
    date: "2023-11-15",
    og: null,
    fg: null,
    tempNotes: "",
    bodyText:
      "To batcher Lucky Jack brygget, denne beregnet til jul.",
    brewerRefs: ["brewer-eirik", "brewer-rune"],
  },
  {
    _id: "log-uranus-pilz-6",
    title: "Uranus Pilz 6",
    date: "2023-10-28",
    og: null,
    fg: 1.027,
    tempNotes: "",
    bodyText:
      "Pilsner med 14 kg pilsnermalt og Saaz-humle, 90 minutters kok.",
    brewerRefs: ["brewer-eirik"],
  },
  {
    _id: "log-svarte-katta-2023",
    title: "Svarte KATTA 2023",
    date: "2023-09-08",
    og: 1.038,
    fg: null,
    tempNotes: "",
    bodyText:
      "Siderproduksjon med 60 liter eplejuice og 80 liter sider.",
    brewerRefs: ["brewer-eirik"],
  },
  {
    _id: "log-cream-of-uranus",
    title: "Cream of Uranus",
    date: "2023-08-04",
    og: null,
    fg: 1.007,
    tempNotes: "",
    bodyText:
      "Cream ale med Viking pilsner-malt og Saaz-humle.",
    brewerRefs: ["brewer-eirik"],
  },
  {
    _id: "log-uranus-alesner",
    title: "Uranus Alesner",
    date: "2023-07-14",
    og: 1.045,
    fg: 1.006,
    tempNotes: "",
    bodyText:
      "Festivaløl brygget for Austgårdfestivalen. Best Pilzner-malt med Tettnang og Saaz.",
    brewerRefs: ["brewer-eirik", "brewer-rune"],
  },
  {
    _id: "log-darwin-ipa-2023",
    title: "Darwin IPA 2023",
    date: "2023-07-02",
    og: 1.052,
    fg: 1.004,
    tempNotes: "",
    bodyText:
      "Spesielt vellykket batch. Hopstand ved 80 grader i 20 minutter.",
    brewerRefs: ["brewer-eirik"],
  },
  {
    _id: "log-vestkyst-kinn",
    title: "Vestkyst Kinn",
    date: "2023-07-01",
    og: 1.062,
    fg: 1.005,
    tempNotes: "",
    bodyText:
      "Kinn-bryggeri-klon med temperatursensorfeil i gjærtanken.",
    brewerRefs: ["brewer-eirik"],
  },
  {
    _id: "log-uranus-pilz-5",
    title: "Uranus Pilz 5",
    date: "2023-06-08",
    og: 1.048,
    fg: 1.005,
    tempNotes: "",
    bodyText:
      "Pilsner med 12 kg pilsnermalt, Tettnang og Saaz-humle.",
    brewerRefs: ["brewer-eirik"],
  },
  {
    _id: "log-vi-enna-in-ur-anus",
    title: "Vi Enna in ur anus",
    date: "2023-05-19",
    og: null,
    fg: null,
    tempNotes: "",
    bodyText:
      "Vienna lager brygget med gjenbrukt gjær fra Uranus Pilz-batchen.",
    brewerRefs: ["brewer-eirik"],
  },
  {
    _id: "log-uranus-pilz-4",
    title: "Uranus Pilz 4",
    date: "2023-04-28",
    og: 1.040,
    fg: 1.008,
    tempNotes: "",
    bodyText:
      "Pilsner med 9.6 kg Viking pilsnermalt og Tettnang-humle.",
    brewerRefs: ["brewer-eirik"],
  },
  {
    _id: "log-lucky-jack-3",
    title: "Lucky Jack 3",
    date: "2023-03-18",
    og: 1.043,
    fg: null,
    tempNotes: "",
    bodyText:
      "Favorittoppskrift brygget på nytt. Brygget av Asbjørn, Rune og Roger.",
    brewerRefs: ["brewer-rune"],
  },
  {
    _id: "log-vi-enna-in-uranus-feb-2023",
    title: "Vi Enna in UrAnus",
    date: "2023-02-22",
    og: 1.046,
    fg: null,
    tempNotes: "",
    bodyText:
      "Vienna lager med 8.6 kg Vienna-malt. Hallertau-humle og Saflager 34/70.",
    brewerRefs: ["brewer-eirik"],
  },
  {
    _id: "log-ink-and-dagger",
    title: "INK and Dagger",
    date: "2023-01-21",
    og: 1.060,
    fg: null,
    tempNotes: "",
    bodyText:
      "OG målt til 1.060, men Rune hevdet 1.045. Humoristisk uenighet.",
    brewerRefs: ["brewer-eirik", "brewer-rune"],
  },
  {
    _id: "log-lucky-jack-2-jan-2023",
    title: "Lucky Jack 2",
    date: "2023-01-05",
    og: 1.043,
    fg: 1.008,
    tempNotes: "",
    bodyText:
      "American Pale Ale på 60 liter med 4.17% ABV. Tørr finish.",
    brewerRefs: ["brewer-eirik"],
  },
  // 2022
  {
    _id: "log-smaatos",
    title: "Småtøs",
    date: "2022-11-02",
    og: 1.046,
    fg: 1.002,
    tempNotes: "",
    bodyText:
      "7 Fjell-oppskrift med fruktig smak. Rune sølt 3 dl vørter.",
    brewerRefs: ["brewer-eirik", "brewer-rune"],
  },
  {
    _id: "log-spitfire",
    title: "Spitfire",
    date: "2022-10-26",
    og: 1.044,
    fg: 1.010,
    tempNotes: "",
    bodyText:
      "Klon av Shepherd Neame Spitfire. Ca 4% ABV.",
    brewerRefs: ["brewer-eirik"],
  },
  {
    _id: "log-summer-kolsch",
    title: "Summer Kölsch",
    date: "2022-09-18",
    og: 1.040,
    fg: 1.015,
    tempNotes: "",
    bodyText:
      "Første kölsch brygget i Uranus Garage. Lallemand Köln-gjær.",
    brewerRefs: ["brewer-eirik"],
  },
  {
    _id: "log-svarte-katta-2022",
    title: "Svarte KATTA 2022",
    date: "2022-09-16",
    og: null,
    fg: null,
    tempNotes: "",
    bodyText:
      "Siderproduksjon med epler fra tre steder.",
    brewerRefs: ["brewer-eirik"],
  },
  {
    _id: "log-mango-oel-2022",
    title: "MANGO ØL",
    date: "2022-07-03",
    og: 1.057,
    fg: 1.010,
    tempNotes: "",
    bodyText:
      "Sommerlager med mangosmak, 5.78% ABV.",
    brewerRefs: ["brewer-eirik"],
  },
  {
    _id: "log-ingen-fer-oel",
    title: "INGEN FER ØL",
    date: "2022-07-03",
    og: 1.062,
    fg: 1.010,
    tempNotes: "",
    bodyText:
      "6.83% ABV med utfordringer — måtte tømme tanken to ganger.",
    brewerRefs: ["brewer-eirik"],
  },
  {
    _id: "log-lervig-lucky-jack",
    title: "Lervig Lucky Jack",
    date: "2022-05-25",
    og: 1.042,
    fg: 1.008,
    tempNotes: "",
    bodyText:
      "Kommersiell APA-oppskrift fra Lervig via bryggekitt.",
    brewerRefs: ["brewer-eirik"],
  },
  {
    _id: "log-7fjell-floyen-ipa",
    title: "7Fjell Fløyen IPA",
    date: "2022-05-25",
    og: 1.055,
    fg: 1.005,
    tempNotes: "",
    bodyText:
      "7Fjell-oppskrift. Gravitetsdata rapportert av Asbjørn.",
    brewerRefs: ["brewer-eirik"],
  },
  {
    _id: "log-darwin-ipa-monkey-brew",
    title: "DARWIN IPA monkey brew",
    date: "2022-05-01",
    og: 1.053,
    fg: 1.010,
    tempNotes: "",
    bodyText:
      "Fyldig NEIPA med tropisk frukt, 5.6% ABV. Dobbel tørrhumling.",
    brewerRefs: ["brewer-eirik"],
  },
  {
    _id: "log-uranus-pilz-3",
    title: "Uranus Pilz 3",
    date: "2022-04-02",
    og: null,
    fg: null,
    tempNotes: "",
    bodyText:
      "Signaturpilsner med kun pilsnermalt og Saaz-humle. Ca 50 liter.",
    brewerRefs: ["brewer-eirik"],
  },
  {
    _id: "log-vienna-lager-feb-2022",
    title: "Vienna Lager feb 2022",
    date: "2022-02-24",
    og: 1.045,
    fg: 1.005,
    tempNotes: "",
    bodyText:
      "Vienna-klassiker, besøk fra Våga bryggeri. Ca 5.25% ABV.",
    brewerRefs: ["brewer-eirik"],
  },
  {
    _id: "log-jungle-juice-2",
    title: "Jungle Juice 2",
    date: "2022-02-05",
    og: 1.055,
    fg: 1.010,
    tempNotes: "",
    bodyText:
      "Cerveciam bryggekitt. Tørrhumlet dag 4 og 8. Ca 5.91% ABV.",
    brewerRefs: ["brewer-eirik"],
  },
  {
    _id: "log-uranus-pilz-2",
    title: "Uranus Pilz 2",
    date: "2022-01-23",
    og: 1.050,
    fg: 1.008,
    tempNotes: "",
    bodyText:
      "Enkel pilsner med Saaz og finsk Viking pilsnermalt, 5.51% ABV.",
    brewerRefs: ["brewer-eirik"],
  },
  {
    _id: "log-twelve-fifty",
    title: "Twelve Fifty",
    date: "2022-01-07",
    og: 1.053,
    fg: 1.009,
    tempNotes: "",
    bodyText:
      "Odd Island Brewing-kitt. Ny kondenser med doble vifter installert. 5.80% ABV.",
    brewerRefs: ["brewer-eirik"],
  },
  // 2021
  {
    _id: "log-english-special-bitter-2021",
    title: "English Special Bitter",
    date: "2021-11-07",
    og: 1.040,
    fg: null,
    tempNotes: "",
    bodyText:
      "ESB med East Kent Golding-humle. 63 liter preboil-volum.",
    brewerRefs: ["brewer-eirik"],
  },
  {
    _id: "log-belgisk-blonde-2021",
    title: "Belgisk Blonde",
    date: "2021-10-24",
    og: 1.054,
    fg: null,
    tempNotes: "",
    bodyText:
      "Belgisk blonde ale med Belle Saison-gjær. Beskrevet som total suksess.",
    brewerRefs: ["brewer-eirik"],
  },
  {
    _id: "log-zombie-porter-okt-2021",
    title: "Zombie Porter okt 2021",
    date: "2021-10-17",
    og: 1.045,
    fg: 1.029,
    tempNotes: "",
    bodyText:
      "Porter av eksepsjonelt høy kvalitet.",
    brewerRefs: ["brewer-eirik"],
  },
  {
    _id: "log-lucky-jack-okt-2021",
    title: "Lucky Jack okt 2021",
    date: "2021-10-17",
    og: null,
    fg: null,
    tempNotes: "",
    bodyText:
      "Hjemmebrygget versjon av Lervig Lucky Jack.",
    brewerRefs: ["brewer-eirik"],
  },
  {
    _id: "log-uranus-pilz-1",
    title: "Uranus Pilz 1",
    date: "2021-10-08",
    og: null,
    fg: null,
    tempNotes: "",
    bodyText:
      "Brygget av Rune mens Eirik og Asbjørn presset epler.",
    brewerRefs: ["brewer-rune"],
  },
  {
    _id: "log-brunst-3",
    title: "Brunst 3",
    date: "2021-09-28",
    og: 1.055,
    fg: null,
    tempNotes: "",
    bodyText:
      "Tredje brygg fra Stjørdal. 43 liter til gjæring.",
    brewerRefs: ["brewer-eirik"],
  },
  {
    _id: "log-svarte-katta-sider-2021",
    title: "Svarte katta sider 2021",
    date: "2021-09-18",
    og: 1.042,
    fg: 1.015,
    tempNotes: "",
    bodyText:
      "8 timer med eplepressing ga 40 liter ravjuice.",
    brewerRefs: ["brewer-eirik"],
  },
  {
    _id: "log-extraciderbrok",
    title: "ExtraCiderBrok",
    date: "2021-07-08",
    og: null,
    fg: null,
    tempNotes: "",
    bodyText:
      "Sider laget med XTRA eplejuice og belgisk gjær.",
    brewerRefs: ["brewer-eirik"],
  },
  {
    _id: "log-ur-apa-in-yer-nus",
    title: "UR Apa in yer NUS",
    date: "2021-06-23",
    og: 1.075,
    fg: null,
    tempNotes: "",
    bodyText:
      "Pale ale med høy OG på 1.075.",
    brewerRefs: ["brewer-eirik"],
  },
  {
    _id: "log-mango-oel-2021",
    title: "Mango øl 2021",
    date: "2021-06-12",
    og: null,
    fg: null,
    tempNotes: "",
    bodyText:
      "Brygget uten mango opprinnelig, løst med frosne mangobiter.",
    brewerRefs: ["brewer-eirik"],
  },
  {
    _id: "log-ingefoeroel",
    title: "Ingefærøl",
    date: "2021-06-06",
    og: null,
    fg: null,
    tempNotes: "",
    bodyText:
      "Ingefærøl med fersk ingefærrot. Burde vært kuttet for å unngå pumpeblokkeringer.",
    brewerRefs: ["brewer-eirik"],
  },
  {
    _id: "log-finest-uranus-pils-2021",
    title: "Finest Uranus Pils",
    date: "2021-04-11",
    og: null,
    fg: null,
    tempNotes: "",
    bodyText:
      "1.5 kg Munich og 14 kg pils, Saaz og Tettnang. Gjæringsproblemer krevde ekstra tørrgjær.",
    brewerRefs: ["brewer-eirik"],
  },
  {
    _id: "log-uranus-pils-mars-2021",
    title: "Uranus Pils mars 2021",
    date: "2021-03-30",
    og: 1.060,
    fg: null,
    tempNotes: "",
    bodyText:
      "12 kg pilsner og 4 kg pale malt, tre addisjoner Saaz-humle.",
    brewerRefs: ["brewer-eirik"],
  },
  {
    _id: "log-vossaoel-2021",
    title: "Vossaøl 2021",
    date: "2021-03-18",
    og: null,
    fg: null,
    tempNotes: "",
    bodyText:
      "Tradisjonell gårdsøl inspirert av Lars Garshols oppskrift.",
    brewerRefs: ["brewer-eirik"],
  },
  {
    _id: "log-vienna-lager-mars-2021",
    title: "Vienna Lager mars 2021",
    date: "2021-03-10",
    og: 1.045,
    fg: null,
    tempNotes: "",
    bodyText:
      "Spontan bryggekveld. Inspirert av nostalgi for Frydenlund Vienna Lager.",
    brewerRefs: ["brewer-eirik"],
  },
  {
    _id: "log-russian-roulette-stout",
    title: "Russian Roulette Stout",
    date: "2021-02-23",
    og: 1.090,
    fg: null,
    tempNotes: "",
    bodyText:
      "Imperial stout med 500g kandissukker. Fantastisk etter åtte måneders lagring.",
    brewerRefs: ["brewer-eirik"],
  },
  {
    _id: "log-petit-blonde",
    title: "Petit Blonde",
    date: "2021-01-23",
    og: null,
    fg: null,
    tempNotes: "",
    bodyText:
      "Blonde ale med lang mesk og lang kok. Noe av det beste fra UG.",
    brewerRefs: ["brewer-eirik"],
  },
  {
    _id: "log-finest-pilz-2021",
    title: "Finest Pilz",
    date: "2021-01-03",
    og: 1.050,
    fg: null,
    tempNotes: "",
    bodyText:
      "Første ordentlige pilsnerforsøk.",
    brewerRefs: ["brewer-eirik"],
  },
  // 2020
  {
    _id: "log-pandemonium",
    title: "Pandemonium",
    date: "2020-12-21",
    og: null,
    fg: null,
    tempNotes: "",
    bodyText:
      "NEIPA brygget like før jul. Tørrhumlet 25. og 28. desember.",
    brewerRefs: ["brewer-eirik"],
  },
  {
    _id: "log-salikatt-juniten",
    title: "Salikatt Juniten",
    date: "2020-11-27",
    og: null,
    fg: null,
    tempNotes: "",
    bodyText:
      "Amerikansk IPA.",
    brewerRefs: ["brewer-eirik"],
  },
  {
    _id: "log-ekstrakt-brygg",
    title: "Ekstrakt brygg",
    date: "2020-11-13",
    og: null,
    fg: null,
    tempNotes: "",
    bodyText:
      "Eksperimentering med ekstraktbaserte bryggekitt.",
    brewerRefs: ["brewer-eirik"],
  },
  {
    _id: "log-engelsk-bitter-2020",
    title: "Engelsk bitter 2020",
    date: "2020-11-10",
    og: 1.050,
    fg: 1.010,
    tempNotes: "",
    bodyText:
      "Seks kasser, 5.25% ABV. Challenger-humle ga skarp finish.",
    brewerRefs: ["brewer-eirik"],
  },
  {
    _id: "log-julepils",
    title: "Julepils",
    date: "2020-10-13",
    og: 1.042,
    fg: null,
    tempNotes: "",
    bodyText:
      "Juleøl-bryggekitt med Hersbrucker-humle.",
    brewerRefs: ["brewer-eirik"],
  },
  {
    _id: "log-brunst-oktober-2020",
    title: "Brunst Oktober 2020",
    date: "2020-09-30",
    og: null,
    fg: null,
    tempNotes: "",
    bodyText:
      "Andre batch av Brunst NEIPA. Ca 6.5% ABV.",
    brewerRefs: ["brewer-eirik"],
  },
  {
    _id: "log-road-trip",
    title: "Road Trip",
    date: "2020-09-25",
    og: 1.060,
    fg: 1.010,
    tempNotes: "",
    bodyText:
      "IPA-bryggedag med nye oppgraderinger i garasjen. 6.5% ABV.",
    brewerRefs: ["brewer-eirik"],
  },
  {
    _id: "log-brunst-2",
    title: "Brunst 2",
    date: "2020-09-21",
    og: null,
    fg: null,
    tempNotes: "",
    bodyText:
      "15 kg korn malt med improvisert oppsett.",
    brewerRefs: ["brewer-eirik"],
  },
  {
    _id: "log-black-russian-imperial-stout",
    title: "Black Russian Imperial Stout",
    date: "2020-08-02",
    og: null,
    fg: null,
    tempNotes: "",
    bodyText:
      "Tjæresort og robust stout med lakrisnoter.",
    brewerRefs: ["brewer-eirik"],
  },
  {
    _id: "log-zombie-porter-juni-2020",
    title: "Zombie Porter juni 2020",
    date: "2020-06-05",
    og: null,
    fg: null,
    tempNotes: "",
    bodyText:
      "Temperaturproblemer under mesking. 11.5 kg korn.",
    brewerRefs: ["brewer-eirik"],
  },
  {
    _id: "log-bells-two-hearted-2020",
    title: "Bell's Two Hearted 2020",
    date: "2020-06-02",
    og: 1.045,
    fg: 1.005,
    tempNotes: "",
    bodyText:
      "Klonbrygg med uventet lav OG, reddet med spraymalt.",
    brewerRefs: ["brewer-eirik"],
  },
  {
    _id: "log-hausten-vs-zombie",
    title: "Hausten vs Zombie",
    date: "2020-05-21",
    og: null,
    fg: null,
    tempNotes: "",
    bodyText:
      "Sammenligning mellom Hausten og Zombie Porter. Split batch.",
    brewerRefs: ["brewer-eirik"],
  },
  {
    _id: "log-hausten",
    title: "Hausten",
    date: "2020-04-21",
    og: 1.020,
    fg: null,
    tempNotes: "",
    bodyText:
      "15 kg korn med lav OG. Split-batch med US-04 og US-05 gjær.",
    brewerRefs: ["brewer-eirik"],
  },
  {
    _id: "log-brunst-1",
    title: "Brunst 1",
    date: "2020-04-21",
    og: 1.040,
    fg: null,
    tempNotes: "",
    bodyText:
      "15 kg korn med lavere OG enn forventet.",
    brewerRefs: ["brewer-eirik"],
  },
  {
    _id: "log-jungle-juice-1",
    title: "Jungle Juice 1",
    date: "2020-03-20",
    og: null,
    fg: null,
    tempNotes: "",
    bodyText:
      "15 kg korn ga 45 liter. Kornsengen komprimerte seg.",
    brewerRefs: ["brewer-eirik"],
  },
  {
    _id: "log-zombie-porter-mars-2020",
    title: "Zombie Porter mars 2020",
    date: "2020-03-20",
    og: null,
    fg: null,
    tempNotes: "",
    bodyText:
      "15 kg korn, mye bedre enn forrige gang. 45 liter.",
    brewerRefs: ["brewer-eirik"],
  },
  {
    _id: "log-7fjell-ipa-2020",
    title: "7 Fjell IPA 2020",
    date: "2020-02-20",
    og: null,
    fg: null,
    tempNotes: "",
    bodyText:
      "Første batch på nytt utstyr. Mesken satte seg fast, kun 10 liter utbytte.",
    brewerRefs: ["brewer-eirik"],
  },
];

// ─── SEED FUNCTION ────────────────────────────────────────────────────────────

async function seed() {
  console.log("Seeder fase 4 innhold: 12 artikler + 59 bryggelogger\n");

  // --- Articles ---
  console.log("=== ARTIKLER ===");
  for (const article of articles) {
    const doc = {
      ...article,
      _type: "article" as const,
      slug: { _type: "slug" as const, current: slug(article.title) },
      author: { _type: "reference" as const, _ref: "brewer-eirik" },
    };
    await client.createOrReplace(doc);
    console.log(`  ✓ ${article.title}`);
  }

  // --- Brew Logs ---
  console.log("\n=== BRYGGELOGGER ===");
  for (const log of brewLogData) {
    const brewers = log.brewerRefs.map((ref, i) => ({
      _type: "reference" as const,
      _ref: ref,
      _key: `b${i}`,
    }));

    const doc: Record<string, unknown> = {
      _id: log._id,
      _type: "brewLog",
      title: log.title,
      slug: { _type: "slug", current: slug(log.title) },
      date: log.date,
      tempNotes: log.tempNotes,
      brewers,
      body: blockText(log.bodyText),
    };

    if (log.og !== null) doc.og = log.og;
    if (log.fg !== null) doc.fg = log.fg;

    await client.createOrReplace(doc);
    console.log(`  ✓ ${log.title} (${log.date})`);
  }

  console.log(
    `\nFerdig! Seedet ${articles.length} artikler og ${brewLogData.length} bryggelogger.`
  );
}

seed().catch(console.error);
