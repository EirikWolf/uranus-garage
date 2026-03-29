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

// ─── 9 NEW ARTICLES ──────────────────────────────────────────────────────────

const articles = [
  // ─── Råvarefokus ─────────────────────────────────────────────────────────

  {
    _id: "article-mosaic-humle",
    title: "Mosaic — Allrounderen blant humler",
    slugOverride: "mosaic-allrounderen-blant-humler",
    category: "ravarefokus",
    publishedAt: "2025-06-15T10:00:00Z",
    tags: ["humle", "mosaic", "IPA", "pale ale", "allround"],
    seoDescription:
      "Mosaic er humlen som gjor alt riktig. Baer, tropisk frukt og urter — i en og samme kongle.",
    body: blockText(
      `Jeg husker fortsatt den forste gangen jeg smakte en single-hop IPA brygget utelukkende med Mosaic. Jeg tok en slurk, satte glasset ned, og lurte genuint pa om bartenderen hadde tullet med meg. Bringerbaer, mango, melon, et hint av urter — alt i ett glass. Det hortes ut som en fruktsalat, men smakte som den best balanserte IPAen jeg noensinne hadde drukket. Det var den dagen Mosaic gikk fra a vaere «en humle jeg hadde hort om» til a bli en fast gjest i alle oppskriftene mine.

Det som gjor Mosaic sa spesiell er bredden i aromaprofilen. De fleste humler har en eller to ting de er gode pa — Citra gir deg tropisk frukt, Centennial gir deg sitrus, og Cascade er blomstrete. Mosaic? Den gjor alt. Du far blabaer og bringerbaer, tropisk frukt som mango og pasjonsfrukt, og sa en jordlig, urteaktig undertone som holder det hele fra a bli for sotsuppete. Alfasyren ligger pa 11-13%, noe som betyr at den fungerer som bittersetter ogsa, selv om det er i aroma og smak den virkelig skinner.

Det geniale med Mosaic er at du kan kaste den inn i naermest hva som helst. IPA? Selvsagt. Pale Ale? Perfekt. Men den fungerer ogsa overraskende godt i morke ol som porter og stout, der den tilforer et lag av baerfrukt som komplementerer de rostede malttonene. Jeg har til og med brukt den i en belgisk blonde med god effekt — den urteaktige siden av Mosaic spiller pa lag med belgiske gjaerestere.

Snakker vi kombinasjoner, finnes det en grunn til at Mosaic og Citra blir kalt «dream team» i hjemmebryggemiljoet. Citra bringer den rene tropiske slagkraften, mens Mosaic legger til dybde og kompleksitet. Like mengder av begge i torrhumling gir en NEIPA som far folk til a sporre hva i alle dager du har puttet oppi. Andre gode partnere er Simcoe for harpiks og barskog, og Galaxy for ekstra mango og persika.

Men her kommer advarselen, og dette er viktig: Mosaic kan bli rar om du bruker for mye av den tidlig i koket. Store tilsetninger i de forste 60 minuttene kan gi en merkelig kattepiss-aktig smak som ikke er noe du vil ha i glasset ditt. Ja, du leste riktig — kattepiss. Det hores dramatisk ut, men spor en hvilken som helst erfaren brygger, og de vil nikke gjenkjennende. Losningen er enkel: hold Mosaic til sene tilsetninger, whirlpool og torrhumling. Der er det den horer hjemme, og der gir den magi.

Praktisk anbefaling: Start med 3-5 g/liter i torrhumling for en subtil Mosaic-karakter, eller ga opp til 8-10 g/liter om du vil ha en ordentlig Mosaic-bombe. I whirlpool ved 80°C er 5-8 g/liter et godt utgangspunkt. Og om du bare skal prove en humlesort for forste gang og vil bli imponert — brygg en enkel pale ale med Mosaic som eneste humle. Du kommer ikke til a angre.`
    ),
  },

  {
    _id: "article-golden-promise",
    title: "Golden Promise — Skottlands stolthet",
    slugOverride: "golden-promise-skottlands-stolthet",
    category: "ravarefokus",
    publishedAt: "2025-08-01T10:00:00Z",
    tags: ["malt", "golden promise", "skotsk", "pale ale", "whisky"],
    seoDescription:
      "Golden Promise er maltens svar pa single malt whisky — rik, sotlig og full av karakter.",
    body: blockText(
      `Her er en morsom fact som alltid imponerer pa bryggekvelden: Golden Promise er det samme byggkornet som brukes til Macallan single malt whisky. Ja, den Macallan — den som koster mer per flaske enn hele hjemmebryggeutstyret ditt. Samme korn, bare at vi bruker det til noe langt mer fornuftig, nemlig ol. Og akkurat som whiskyen, har Golden Promise en karakter som er umulig a ignorere nar du forst har smakt den.

Golden Promise er Skottlands svar pa Englands Maris Otter, og det er fristende a sammenligne de to direkte. Begge er tradisjonelle byggorter med masse karakter, men der Maris Otter gir deg kjeks og notter, lener Golden Promise seg mer mot honning, lett karamell og en rund sotme som kler munnen pa en helt annen mate. Munnfolelsen er ogsa litt fyldigere — olet far en naermest foyelsesrik kropp som gjor at du automatisk tar en slurk til.

BrewDog brukte Golden Promise som basemalt i sine tidlige versjoner av Punk IPA, og det var neppe tilfeldig. Malten gir en rikere maltrygg enn standard pale ale malt, noe som balanserer aggressive humletilsetninger uten a konkurrere med dem. Det er som en god bassist i et rockeband — du legger kanskje ikke merke til den forst, men uten den faller alt sammen.

Stilmessig er Golden Promise en opplagt favoritt for skotske ales, der maltkarakter er kongen og humle bare er med for a vise at den finnes. Men den er minst like god i IPAer og pale ales der du vil ha noe mer enn bare et noytral lerret. Bruk den som 80-100% av basemaltblandingen og suppler med litt Crystal eller Munich for ekstra dybde om du foler for det.

Elefanten i rommet er selvfolgelig prisen. Golden Promise er noe av det dyreste du kan kjope nar det gjelder basemalt — gjerne 30-50% mer enn vanlig pale ale malt. Og akkurat som med skotsk whisky, er det sann at nar du forst har prove det, er det vanskelig a ga tilbake. Du vil smake forskjellen, og du vil irritere deg over det hver gang du bruker billigere malt. Considerer deg selv advart — Golden Promise er en inngangsport det er vanskelig a snu fra.

Et siste tips: Golden Promise responderer fantastisk pa en litt lavere mesketemperatur (64-65°C) om du vil ha et torrere, mer drikkbart ol. Sotmen i malten kommer gjennom uansett, sa du ender ikke opp med noe tynt og karakterlost selv om du mesker lavt. Det er en av de tingene som gjor denne malten sa allsidig — den leverer smak uansett hva du gjor med den.`
    ),
  },

  {
    _id: "article-us-05-gjaer",
    title: "US-05 — Gjaeren som aldri svikter",
    slugOverride: "us-05-gjaren-som-aldri-svikter",
    category: "ravarefokus",
    publishedAt: "2025-10-10T10:00:00Z",
    tags: ["gjaer", "US-05", "fermentering", "ale", "palitelig"],
    seoDescription:
      "Safale US-05 er hjemmebryggernes Toyota Corolla. Den starter alltid, gjor jobben, og klager aldri.",
    body: blockText(
      `Om hjemmebrygging hadde en «default setting», ville det vaert US-05. Denne gjaeren er det naermeste vi kommer en universallim for ol — den fester seg til alt, gjor jobben uten a klage, og etterlater seg et rent og presentabelt resultat. Den er ikke sexy, den er ikke spennende, men den er der for deg nar ingenting annet funker. Safale US-05 er hjemmebryggernes Toyota Corolla.

La oss snakke tall: US-05 attenuerer typisk rundt 81%, noe som betyr at den spiser mesteparten av sukkeret og gir et temmelig tort, rent ol. Flokkulasjonen er middels til hoy, sa den rydder opp etter seg uten at du trenger a finne pa noe spesielt. Det beste er temperaturtoleransen. Offisielt er den oppgitt til 15-24°C, men sweet spot er 18-20°C. I det omradet far du en naermest noytral fermentering med minimalt av estere og ingen fusel.

Her ma jeg innromme noe: Jeg har en gang i desperasjon pitchet US-05 i en vort som fortsatt var 30°C fordi jeg var utolmodig og det var sent pa kvelden. Alle reglene sier at du ikke skal gjore dette. Gjaeren skal stresses, den skal produsere off-flavors, og du skal sitte igjen med noe som smaker som bananmuffins dyppet i lakkfjerner. Men vet du hva? Olet ble faktisk helt greit. Ikke fantastisk, men drikkbart og til og med litt godt etter noen uker pa flaske. Jeg anbefaler det absolutt ikke, men det sier noe om hvor bombesikker denne gjaeren er.

Sammenligner vi med andre populaere torrgjaeralternativer, sa har S-04 (Safale sin engelske variant) mer karakter — den gir litt fruktestere og en rund, brodeig finish som passer engelske stiler. Nottingham fra Lallemand er en annen poverdi arbeidshest med hoy attenuasjon, men den kan vaere litt mer temperamentsfull pa temperatur. Begge er gode gjaer, men ingen av dem matcher US-05 nar det gjelder ren palitelighet.

US-05 fungerer i nesten alt: American Pale Ale, IPA, NEIPA, blonde ale, amber ale, og til og med stout og porter der du vil la malten og humlen snakke. Den er ogsa utmerket som en noytral base nar du eksperimenterer med nye humlekombinjasjoner, fordi den ikke legger til sin egen signatur. Du smaker ravarene, ikke gjaeren — og det er ofte akkurat det du vil.

Fancy gjaerstammer er moro — belgiske fenotyper, norsk kveik, engelske esterbomber — alt har sin plass. Men nar bryggevennen din spor hva slags gjaer de skal bruke til sitt forste brygg, er svaret alltid det samme. Det har alltid vaert det samme. Og det kommer alltid til a vaere det samme.`
    ),
  },

  // ─── Akademiet ───────────────────────────────────────────────────────────

  {
    _id: "article-vannkjemi",
    title: "Vannkjemi for hjemmebryggere",
    slugOverride: "vannkjemi-for-hjemmebryggere",
    category: "akademiet",
    publishedAt: "2025-11-20T10:00:00Z",
    tags: ["vannkjemi", "mineraler", "pH", "sulfat", "klorid"],
    seoDescription:
      "Vannkjemi hores kjedelig ut. Men det er forskjellen mellom en OK IPA og en fantastisk IPA.",
    body: blockText(
      `La oss vaere aerlige: vannkjemi hores utrolig kjedelig ut. Mineraler, ioner, pH-buffere — det lyder som en kjemiforelesning du skulket pa universitetet. Og det er kjedelig. Helt til du innser at det er den enkeltfaktoren som gjor storst forskjell etter at du har fatt temperaturkontroll pa plass. Plutselig smaker IPAen din skarpere og mer definert, stouten far en mykere, rundere kropp, og pilsneren din gar fra «helt grei» til «vent, lagde du virkelig denne selv?»

Kjernen i vannkjemi for bryggere koker ned til ett nøkkeltall: forholdet mellom sulfat og klorid. Hoyt sulfat (SO4) gir et tort, bittert og skarpt inntrykk som far humlen til a poppe — perfekt for IPA og pale ale. Hoyt klorid (Cl) gir en mykere, rundere, maltfokusert karakter som passer stout, porter og maltfokuserte lagers. En IPA vil du typisk ha et sulfat:klorid-forhold pa 2:1 eller 3:1, mens en stout gjerne har 1:2 eller 1:3.

De tre beroemte vannprofilene som alle hjemmebryggere bor kjenne til er Burton-on-Trent (ekstremt hoyt sulfat, legendisk for IPAer), Dublin (hoyt bikarbonat og klorid, perfekt for moerke ol som stout), og Pilsen (naermest destillert vann — ekstremt mykt, ideelt for bohmisk pilsner). Du trenger ikke matche disse profilene eksakt, men de gir deg en pekepinn pa hvilken retning du bor justere vannet ditt.

I praksis betyr dette at du tilforer bryggesalter til meskevannet. CaSO4 (gips/gypsum) oker sulfat og kalsium. CaCl2 (kalsiumklorid) oker klorid og kalsium. Begge senker ogsa pH, noe som er en bonus. For de fleste norske bryggere med middels hardt springvann er 5-10 gram gips i en IPA-batch pa 25 liter et godt utgangspunkt. Kalsiumklorid i tilsvarende mengder for maltfokuserte stiler.

Sa har vi pH. Optimal meske-pH er 5,2-5,6 malt ved romtemperatur. Utenfor dette omradet jobber enzymene tregere, og du mister bade utbytte og smaksbalanse. De fleste moerke kornblandinger senker pH naturlig (rostede malter er sure), mens lyse kornblandinger ofte trenger litt hjelp med syrnejustering. Et par milliliter melkesyre i mesken er vanligvis nok.

Jeg har en kompis som en gang bestemte seg for at han skulle «matche Burton-vannprofilen eksakt» pa sitt forste forsok med vannkjemi. Han helte i sa mye gips at vannet bokstavelig talt smakte som om du slikket pa en kalksteinsvegg. IPAen ble sa mineraltung at ingen klarte a drikke den. Laerdommen er enkel: start forsiktig. Juster sulfat:klorid-forholdet for stilen du brygger, sjekk meske-pH, og la det vaere med det. Du kan alltid gjore mer neste gang, men du kan ikke fjerne salter du allerede har tilsatt.

Mitt radgivning for nybegynnere: Kjop en pose CaSO4 og en pose CaCl2 fra bryggeshopen. Neste gang du brygger en IPA, tilsett 8 gram gips i meskevannet. Neste gang du brygger en stout, tilsett 8 gram kalsiumklorid i stedet. Smak forskjellen. Du kommer til a bli overrasket over hvor mye det betyr — og sa er du hooked pa vannkjemi for alltid.`
    ),
  },

  {
    _id: "article-toerrhumling",
    title: "Toerrhumling — Den komplette guiden",
    slugOverride: "toerrhumling-den-komplette-guiden",
    category: "akademiet",
    publishedAt: "2026-01-05T10:00:00Z",
    tags: ["toerrhumling", "dry hop", "humle", "aroma", "IPA"],
    seoDescription:
      "Toerrhumling er magi. Men gjor du det feil, ender du med gressklipp i glasset.",
    body: blockText(
      `Toerrhumling er der gode IPAer blir fantastiske IPAer — og der fantastiske IPAer blir gressklipp-katastrofer. Det er en teknikk som hores enkel ut pa papiret (putt humle i olet etter koket, la det sta, ta det ut igjen), men som har nok nyanser til a fylle en hel bok. Og som med det meste i brygging: det er minst like viktig a vite hva du ikke skal gjore som hva du skal gjore.

Timing er det forste du ma ta stilling til, og her er det to hovedskoler. Den «tradisjonelle» metoden er a torrhumle etter at gjaringen er ferdig — du venter til FG er stabil, tilforer humle, og lar det sta i 2-4 dager for ren aroma. Den nyere metoden, kalt biotransformasjon, innebarer a tilsette humle under aktiv gjaering (typisk nar du er omtrent halvveis til FG). Gjaeren omdanner da humlens aromaoljer til nye forbindelser som gir en enda saftigere, mer tropisk karakter. NEIPA-stilen er naermest avhengig av biotransformasjon for a fa den ikoniske juicy-profilen.

Mengde er neste sporsmalet, og her er fasiten overraskende bred. For en subtil humlearoma i en pale ale holder 3-5 g/liter fint. For en typisk West Coast IPA er 5-8 g/liter vanlig. Og for en skikkelig humlebombe-NEIPA? Da snakker vi 8-12 g/liter, noen ganger mer. Men mer er ikke alltid bedre — etter et visst punkt begynner du a fa en grasete, vegetabilsk karakter som ingen onsker. Det er ogsa rett og slett bortkastet humle nar du passerer metningspunktet.

Varighet er der mange gjor den klassiske feilen. Det er fristende a tenke at «mer tid = mer aroma», men sannheten er at mesteparten av aromaekstraksjonen skjer i lopet av de forste 24-48 timene. Etter 3-4 dager er du i praksis ferdig. La humlen sta lenger enn en uke, og du risikerer grasete, hoyaktige toner som odeegger hele poenget. Temperatur spiller ogsa inn: romtemperatur (18-20°C) for ales gir rask ekstraksjon, mens kaldere temperaturer (under 10°C) gir en roligere, mer kontrollert prosess med mindre risiko for vegetabilske toner.

Sa ma vi snakke om det skumle fenomenet «dry hop creep». Humle inneholder enzymer som kan bryte ned dekstriner (komplekse sukkerarter som normalt ikke gjaerer) til enklere sukkerarter som gjaeren spiser. Resultatet? En sakte, uventet refermentering som kan overkarbonere flaskene dine. Mange eksploderende flasker har sin opprinnelse i nettopp dette. Losningen er a la olet sta noen dager etter at du har fjernet humlen for a sjekke at graviteten er stabil for du tapper.

Det absolutt viktigste med toerrhumling er a minimere oksygeneksponering. Oksygen er fiende nummer en for humlede ol — det bryter ned aromaoljene og gir en pappaktig, doev smak som kan odelegge en ellers perfekt batch pa dager. Bruk en lukket overforing om mulig, purge fermenteringskaret med CO2 for du apner, og vurder torrhumling i en CO2-spylt bag som du senker ned gjennom en liten apning. Ja, det er ekstra styr. Nei, det er ikke valgfritt om du bryr deg om resultatet.`
    ),
  },

  {
    _id: "article-feilsoeking",
    title: "Feilsoking — Nar brygget ikke ble som planlagt",
    slugOverride: "feilsoeking-nar-brygget-ikke-ble-som-planlagt",
    category: "akademiet",
    publishedAt: "2026-03-01T10:00:00Z",
    tags: ["feilsoking", "problemer", "off-flavor", "stuck fermentation"],
    seoDescription:
      "Alt som kan ga galt i hjemmebrygging, og hvordan du fikser det. Basert pa mange, mange feil.",
    body: blockText(
      `Alle hjemmebryggere har en batch de ikke snakker om. Den batchen som ble helt pa utslagsvasken mens ingen sa pa. Den som fikk en smak du ikke klarer a beskrive med ord, bortsett fra kanskje «nei». Hvis du ikke har hatt en slik batch enna, bare vent — den kommer. Og nar den gjor det, er det ikke slutten pa verdenen. Det er bare larepenger for Bryggeskolen.

Problem nummer en: Stuck fermentation. Du har pitchet gjaer, det har gaatt tre dager, og ingenting skjer. Ingen bobler i airlocken, ingen krauskring, ingenting. Forst: sjekk temperaturen. Gjaer som er for kald gar i dvale, saerlig laggerjaer under 8°C. Er temperaturen ok? Sjekk at gjaeren din faktisk var levende — toerrgjaren har lang holdbarhet, men ikke evig. Var datoen utlopt? Ble den oppbevart varmt? Losning: Hev temperaturen et par grader, gi fermenteringskaret en forsiktig omroring, og om nodvendig — pitch ny gjaer. Det er ingen skam i a double-pitche.

Problem nummer to: Infeksjon. Du tar en smaking og olet smaker surt, funky, eller har en tynn, vinaktig karakter som ikke var planen. Gratulerer, du har sannsynligvis en infeksjon. Den vanligste arsaken er darlig sanitering, og det er hjemmebryggernes dodssynd. Alt som kommer i kontakt med olet etter koket ma vaere desinfisert — slanger, fermenteringskar, airlock, hevelror, tappekran, ALT. Et spesielt populaert sted for bakterier a gjemme seg er i riper og skraper pa plastfermenteringskar. Plast som har vaert i bruk noen ar bor byttes ut.

Problem nummer tre: Off-flavors. Olet smaker rart, men du vet ikke hva det er. Her er din guide: Smorsmak (diacetyl) — olet smaker som mikropoppkorn. Arsak: gjaeren fikk ikke tid til a rydde opp. Losning: diacetyl-rest pa 20°C i to dager for nedkjoling. Gronne epler (acetaldehyd) — olet smaker skarpt og umodent. Arsak: gjaeren er ikke ferdig. Losning: tolmodighet, la det sta lenger. Plaster/bandasje (klorofenoler) — arsak: klor i vannet som reagerer med fenolforbindelser. Losning: bruk campden-tabletter (kaliummetabisulfitt) i vannet for du brygger. En halv tablett per 25 liter noeytraliserer alt klor pa sekunder.

Jeg kjenner en fyr som en gang saniterte absolutt alt perfekt. Kjelen, slangene, fermenteringskaret, airlocket — alt badet i StarSan i 20 minutter. Sa tok han en gravity-maling med et hydrometer han hentet fra en skitten skuff uten a tenke seg om. Han brukte en skje til a rore — en skje som hadde ligget pa benken. Batchen ble infisert. Det er alltid den ene tingen du glemmer. Alltid.

Her er en liten sjekkliste som kan redde deg: (1) Maal alltid OG og FG for a vite om gjaringen fungerte. (2) Ta en lukt- og smakstest for du tapper — om det er noe galt, er det bedre a vite na enn om to uker. (3) Sjekk at all utstyr er sanitert, inkludert ting du «sikkert» har rengjort. (4) Hold dagbok — skriv ned hva du gjorde og hva som skjedde, sa kan du spore problemet tilbake til kilden.

Darlige batcher er ikke nederlag. De er undervisningsavgifter for Bryggeskolen. Og spoer du enhver erfaren brygger, vil de fortelle deg at de laerte mer av de mislkykkede batchene enn av de vellykkede. Sa neste gang noe gar galt: ta en dyp pust, hell ut olet om noedvendig, og skriv ned hva som skjedde. Neste batch blir bedre. Den blir alltid bedre.`
    ),
  },

  // ─── DIY-hjornet ─────────────────────────────────────────────────────────

  {
    _id: "article-spunding-ventil",
    title: "Bygg en spunding-ventil",
    slugOverride: "bygg-en-spunding-ventil",
    category: "diy",
    publishedAt: "2025-07-10T10:00:00Z",
    tags: ["spunding", "karbonering", "trykkfermentering", "DIY"],
    seoDescription:
      "Naturlig karbonering rett i gjaertanken? Ja, med en spunding-ventil til under 300 kroner.",
    body: blockText(
      `En spunding-ventil er en av de smarteste DIY-prosjektene du kan bygge som hjemmebrygger, og en av de minst forstatte. Kort forklart er det en justerbar trykkventil som sitter pa fermenteringskaret ditt og kontrollerer CO2-trykket under gjaering. I stedet for at all CO2 gjaeren produserer slipper ut gjennom airlocket, fanger du den opp og bruker den til a karbonere olet naturlig. Ingen primingssukker, ingen CO2-flaske, ingen ventetid — olet er ferdig karbonert nar gjaringen er over.

Delelisten er overraskende kort og billig: En justerbar trykkavlastningsventil (PRV), en ball lock-post (vanligvis den graa/svarte gass-posten), en trykkmaaler (0-30 PSI), og en T-kobling for a sette det hele sammen. Totalkostnad: rundt 250 kroner om du handler smart, mot 800+ kroner for en kommersiell spunding-ventil. Du finner delene pa AliExpress, Amazon, eller hos spesialforhandlere for ol.

Monteringen er naermest dumt enkel. Skru T-koblingen sammen med ball lock-posten pa den ene siden, trykkmaaleren pa den andre, og PRV-ventilen pa toppen. Test for lekkasje med sapevann for bruk. Hele prosjektet tar omtrent 15 minutter om du har verktoy liggende, og resultatet ser ut som noe du kjopte i en profesjonell bryggeshop.

Nar det gjelder bruk, setter du typisk ventilen til 10-15 PSI for normal ale-karbonering ved 20°C. Lager pa kaldere temperaturer kan trenge litt hoyere trykk. Start med lavt trykk og juster oppover — det er mye lettere a legge til CO2 enn a fjerne den. Sett ventilen pa fermenteringskaret nar gjaringen er ca 75% ferdig (typisk etter 3-4 dager for en ale), sa fanger du opp nok CO2 til full karbonering uten a skape et farlig hoeyt trykk tidlig.

Forste gang jeg provde dette, glemte jeg a stille inn trykkavlastningen og gikk og la meg. Neste morgen sa fermenteringskaret ut som det forberedte seg pa a bli skutt ut i verdensrommet — sidene bulet ut, og lokket hevet seg truende. Heldigvis holdt det, men det var en effektiv paliminnelse om at trykk og gjaering er en kombinasjon som krever respekt. Still alltid inn PRV-ventilen for du setter den pa karet.

Viktig advarsel: dette fungerer kun med trykkrated fermenteringskar. En vanlig plastbotte med snapplokk er IKKE laget for trykk og kan bokstavelig talt eksplodere. Bruk en Fermzilla, en Kegmenter, et Corny-fat, eller et annet kar som er testet for minst 15-20 PSI. Bestemors syltebotte er absolutt ikke egnet, uansett hvor solid den ser ut. Med riktig utstyr og litt forsiktighet er spunding-ventilen en game-changer som fjerner et helt steg fra bryggeprosessen din.`
    ),
  },

  {
    _id: "article-hop-spider",
    title: "Lag din egen hop spider",
    slugOverride: "lag-din-egen-hop-spider",
    category: "diy",
    publishedAt: "2025-12-01T10:00:00Z",
    tags: ["hop spider", "humle", "filter", "DIY", "kok"],
    seoDescription:
      "Slutt a fiske humlegrot ut av kjelen. Bygg en hop spider for 200 kroner.",
    body: blockText(
      `Hvis du noensinne har statt over en bryggekjele etter 60 minutters kok og forsøkt a helle vorten gjennom en sil mens gronne humlerester tetter igjen alt de kan, sa vet du akkurat hvorfor en hop spider finnes. Det er en enkel innretning — en finmasket kurv som henger inne i kjelen og holder humlen pa plass — men den forandrer brew day fra en gronn suppe-katastrofe til en ren og elegant affaere.

Det du trenger er 300-mesh rustfritt stalnaetting (food-grade 304 eller 316 — dette er viktig), et par slangeklemmer, og en ramme a henge den pa. Rammen kan vaere sa enkel som en rustfri stalstang boeyd i en sirkel som hviler pa kanten av kjelen, eller om du er kreativ, et metalkleshenger boeyd til riktig form. Naettingen sys eller klemmes til en pose som henger fritt i vorten under kok. Totalkostnad: rundt 200 kroner.

Et viktig poeng om materialer: bruk absolutt ikke tilfeldig naetting fra jernvaren. Jeg hørte om en fyr som kjopte en finmasket pose ment for a filtrere maling, og olet hans smakte maskinolje i flere uker. Food-grade rustfritt stal er ikke dyrt, men det er helt essensielt. Se etter «304 stainless» eller «316 stainless» pa produktbeskrivelsen. Om det ikke star noe om materialtype, hold deg unna.

Fordelene med en hop spider er opplagte: renere vort som ikke tetter igjen chiilleren din, mye enklere opprydding etter kok (bare loft ut posen og kast innholdet i komposten), og muligheten til a fjerne humlen midt i koket om du vil. Den siste biten er spesielt nyttig om du eksperimenterer med koketider og vil dra ut humlen etter noyaktig 15 minutter for eksempel.

Ulempen er at hop spideren kan redusere humleutnyttelsen noe — humlen er litt mer innelukket og har mindre kontakt med den kokende vorten enn nar den flyter fritt. Kompenser ved a legge til ca 10% mer humle enn oppskriften sier. I praksis merker de fleste hjemmebryggere minimal forskjell, saerlig pa sene tilsetninger og torrhumling der utvinning av bitterhet ikke er maalet.

Kommer en hop spider til a forandre livet ditt? Nei, neppe. Men kommer den til a spare deg 30 minutter med opprydding og frustrasjon hver eneste bryggedag? Absolutt. Og i en hobby der brew day allerede tar 5-6 timer, er en halvtime spart en halvtime du kan bruke pa noe mye bedre — som a drikke det forrige brygget ditt mens du venter pa at det nye skal koke ferdig.`
    ),
  },

  {
    _id: "article-gjaeringskap",
    title: "Gjaeringsskap fra gammelt kjoleskap",
    slugOverride: "gjaeringsskap-fra-gammelt-kjoleskap",
    category: "diy",
    publishedAt: "2026-02-15T10:00:00Z",
    tags: ["gjaeringsskap", "temperaturkontroll", "kjoleskap", "DIY", "fermentering"],
    seoDescription:
      "Det gamle kjoleskapet pa Finn.no kan bli din beste bryggeinvestering noensinne.",
    body: blockText(
      `Det beste utstyret du kan eie som hjemmebrygger er ikke en skinnende bryggekjele til 8000 kroner eller en fancy konisk fermenteringstank med butterfly-ventil. Det er et brukt kjoleskap fra Finn.no til 500 kroner. Hør meg ut, for dette er det naermeste vi kommer en juksekode i hjemmebrygging.

Temperaturkontroll er den absolutt storste kvalitetsforbedringen du kan gjore som hjemmebrygger etter at du har laert deg grunnleggende sanitering. Uten kontroll er du prisgitt romtemperaturen, som i Norge kan variere fra 15°C i en kald garasje om vinteren til 28°C pa et soverom om sommeren. Gjaer bryr seg veldig om temperatur — bare noen fa grader for hoyt gir fuselalkohoer som smaker losemiddel, og for lavt far gjaeren til a ga i streik.

Bygget er enkelt: Skaff et gammelt kjoleskap eller en fryseboks (Finn.no, Facebook Marketplace, eller spor naboene). Fjern hyllene inne, men ta vare pa hylleskinnene — de er nyttige for a henge inn sensorer eller sette inn en liten vifte senere. Koble til en Inkbird ITC-308 temperaturkontroller (ca 300-400 kr) mellom stikkontakten og kjoleskapet. Inkbird-proben festes med teip pa siden av fermenteringskaret, gjerne med litt isolasjon rundt for a maaltemperaturen i olet heller enn luften. Legg til en liten PC-vifte for luftsirkulasjon sa du unngaar kalde soner.

Nøkkelen er Inkbird-kontrolleren. Om du bruker et kjoleskap, holder den temperaturen stabil ved a sla kompressoren av og pa. Om du bruker en fryseboks, hindrer den fryseren fra faktisk a fryse — den sykler bare kompressoren for a holde maltemperaturen din. Det betyr at en fryseboks pa 200 liter plutselig er verdens beste gjaeringskammer. Og senere, nar du gar over til fatol, kan den samme fryseboksen bli en keezer med tappetarn. To for en.

Storrelsesguide: Et standard underbenk-kjoleskap rommer vanligvis en fermenteringstank med litt klaring. En brystfryser pa 200+ liter kan romme 2-3 fermenteringskar og en CO2-flaske. Om du har plass og ambisjoner, ga for fryseboksen — fleksibiliteten er verdt det.

Jeg provde en gang a brygge en IPA midt pa sommeren uten temperaturkontroll. Rommet holdt 26°C, og gjaeringsvarmen la pa ytterligere 4-5 grader. Resultatet smakte som noen hadde blandet bananmilkshake med neglelakkfjerner — en perfekt storm av estere og fuselalkohoer. Det var den batchen som overbeviste meg om at et gjaeringskap ikke er et «nice to have», men et «ma ha».

En liten advarsel om brukte kjoleskap: sjekk at det ikke lekker kjolemedium. Stikk nesen inn og sniff etter en sot, kjemisk lukt. Om det lukter rart, ga videre til neste annonse. Sjekk ogsa at pakningen i doren er tett og at kompressoren faktisk starter. Med det sagt: de fleste brukte kjoleskap fra de siste 10-15 arene fungerer helt fint.

La oss snakke ekte tall: 500 kroner for kjoleskapet, 350 kroner for Inkbird-en, kanskje 100 kroner for en vifte og noe teip. Under tusenlappen totalt, og plutselig er hver eneste batch du brygger merkbart bedre. Smaken er renere, gjaeringen er mer forutsigbar, og du har full kontroll. Det er den beste investeringen du kan gjore i denne hobbyen, og det er ikke engang i naerheten.`
    ),
  },
];

// ─── SEED FUNCTION ───────────────────────────────────────────────────────────

async function seed() {
  console.log("Seeder 9 nye artikler...\n");

  for (const article of articles) {
    const { slugOverride, ...rest } = article;
    const doc = {
      ...rest,
      _type: "article" as const,
      slug: {
        _type: "slug" as const,
        current: slugOverride ?? slug(article.title),
      },
      author: { _type: "reference" as const, _ref: "brewer-eirik" },
    };
    await client.createOrReplace(doc);
    console.log(`  OK ${article.title}`);
  }

  console.log(`\nFerdig! Seedet ${articles.length} artikler.`);
}

seed().catch(console.error);
