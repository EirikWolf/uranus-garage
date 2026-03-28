# Uranus Garage Fase 2 — Verktøy + Innhold Design Spec

## Oversikt

Fase 2 utvider Uranus Garage med interaktive bryggeverktøy (inkludert AI), redaksjonelt innhold, og en bryggelab med RAPT-integrasjon.

## Scope

### Verktøy (interaktive sider under /verktoy)

**AI Oppskriftsgenerator:**
- To-delt layout: fritekst-prompt ELLER strukturerte parametere (stil, ABV-mål, batchstørrelse, smaksprofil)
- Genererer komplett oppskrift via Claude API
- Mulighet for å laste ned BeerXML
- API-route i Next.js kaller Claude API med bryggeri-kontekst og oppskriftsformat

**Sensory AI Mirror (Digital Smaksassistent):**
- Eget verktøy under /verktoy/smaksassistent
- Bruker taster inn: målinger (OG, FG, pH, mesketemperatur, gjæringstemperatur), maltbase, gjærstamme, og beskriver en bismak (fritekst eller velg fra liste: diacetyl/smør, acetaldehyd/grønt eple, DMS/kokt mais, oksidert/våt papp, fenolisk/medisinsk, osv.)
- AI-en analyserer input og returnerer: sannsynlig årsak, forklaring, og konkret anbefaling for neste brygg
- Bruker Claude API med en system-prompt som inneholder BJCP off-flavor guide-kunnskap og bryggeteknisk kontekst
- Kan ikke erstatte profesjonell sensorisk analyse, men er en nyttig mentor

**Kalkulatorer (klient-side):**
- ABV-kalkulator: OG + FG → alkoholprosent
- IBU-kalkulator: Humletilsetninger (vekt, tid, alfa-syre, vørtervolum, OG) → estimert IBU (Tinseth-formel)
- SRM Fargeguide: Maltsammensetning (vekt, farge-lovibond) → estimert farge med visuelt spekter
- Pitch Rate & Starter-kalkulator: OG, volum, gjærtype (tørr/flytende), gjæringstype (ale/lager) → anbefalt mengde gjær + eventuell starter
- Karboneringskalkulator: Ønsket CO2-volum, øltemperatur, volum → gram sukker (priming) eller PSI (forced carbonation)

**BeerXML-eksport:**
- Generer BeerXML fra oppskriftdata i Sanity
- Nedlastbar fil fra oppskrift-detaljsiden
- Klient-side generering basert på oppskrift-JSON

### Innhold (Sanity CMS)

**Sanity-skjema: article**
- Brukes for Akademiet, Råvarefokus, og DIY-hjørnet
- Felt: title, slug, category (akademiet/ravarefokus/diy), publishedAt, author (ref → brewer), body (portable text med bilder og video-embeds), tags, seoDescription

**Akademiet (/laer/akademiet):**
- "Slik gjør du det"-guider for hjemmebryggere
- Kategorisert etter tema (gjæring, humling, vannjustering, utstyr)
- SEO-optimalisert med meta-beskrivelser

**Råvarefokus (/laer/ravarefokus):**
- Månedens humle eller malt
- Dybdeartikler om profil, bruksområder, anbefalte stiler

**DIY-hjørnet (/laer/diy):**
- Artikler om utstyrsbygg og modifikasjoner
- Bildetungt innhold

### Bryggelaben

**RAPT-integrasjon:**
- Henter data fra RAPT Cloud API (KegLand)
- API-route som proxy: klient → Next.js API-route → RAPT API
- Lagrer tidsserie-data (temperatur, gravity) som brewLabEntry i Sanity
- Kobles til bryggelogg-dokumenter

**Grafvisning:**
- Temperatur- og gravitykurver over tid
- Bruker Recharts (lettvekts React chart-bibliotek)
- Vises på bryggelogg-detaljsiden og egen /bryggelaben-side

**Sanity-skjema: brewLabEntry**
- brewLog (ref → brewLog)
- measurements: array of { timestamp, type (temperature/gravity/ph), value, unit }

## Tekniske detaljer

**Nye avhengigheter:**
- `@anthropic-ai/sdk` — Claude API for AI-verktøy
- `recharts` — grafer for Bryggelaben
- Ingen nye CMS-avhengigheter (Sanity allerede installert)

**Nye API-routes:**
- `/api/ai/recipe-generator` — Claude API for oppskriftsgenerering
- `/api/ai/sensory-mirror` — Claude API for smaksassistent
- `/api/rapt/sync` — Henter data fra RAPT Cloud API

**Nye sider:**
- `/verktoy` — Oversiktsside med alle verktøy
- `/verktoy/oppskriftsgenerator` — AI oppskriftsgenerator
- `/verktoy/smaksassistent` — Sensory AI Mirror
- `/verktoy/kalkulatorer` — Alle kalkulatorer på én side
- `/laer/akademiet` — Artikkel-liste
- `/laer/ravarefokus` — Artikkel-liste
- `/laer/diy` — Artikkel-liste
- `/laer/[category]/[slug]` — Artikkel-detaljside
- `/bryggelaben` — Oversikt over alle brygg med data
- `/bryggelaben/[slug]` — Detaljside med grafer

## Navigasjonsendringer

Oppdater navigasjon med nye dropdown-grupper:
```
├── VERKTØY ▾
│   ├── AI Oppskriftsgenerator
│   ├── Smaksassistenten
│   └── Kalkulatorer
├── LÆR ▾
│   ├── Akademiet
│   ├── Råvarefokus
│   └── DIY-hjørnet
├── BRYGGING ▾ (eksisterende)
│   ├── Bryggelogg
│   ├── Oppskriftsarkiv
│   └── Bryggelaben (ny)
```

## Fremtidig roadmap

**Fase 3: Recipe Fork ("GitHub for øl")**
- Brukerautentisering
- Fork-funksjonalitet for oppskrifter
- Diff-visning (hva er endret)
- Slektstre-visualisering
- Rating-system

**Fase 4: Community**
- Brew-Swap & Crowd-Brewing
- Markedsplassen
- Utvidet community-features
