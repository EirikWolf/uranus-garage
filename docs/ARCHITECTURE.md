# Uranus Garage - Arkitekturskisse

## Systemdiagram

```
                              +------------------+
                              |   Nettleser       |
                              |   (React 19)      |
                              +--------+---------+
                                       |
                              +--------v---------+
                              |  Next.js 16       |
                              |  App Router       |
                              |  (SSR + RSC)      |
                              +----+----+----+---+
                                   |    |    |
                    +--------------+    |    +-------------+
                    |                   |                  |
           +--------v------+  +--------v------+  +--------v------+
           | Sanity CMS    |  | PostgreSQL    |  | Ekstern API   |
           | (Innhold)     |  | via Prisma    |  | (Gemini, RAPT)|
           +---------------+  +---------------+  +---------------+
```

## Teknologistabel

| Lag              | Teknologi                          |
|------------------|------------------------------------|
| Frontend         | React 19, Tailwind CSS 4, shadcn   |
| Rammeverk        | Next.js 16 (App Router, RSC)       |
| CMS              | Sanity v5 (headless, GROQ)         |
| Database         | PostgreSQL via Prisma 7             |
| Auth             | NextAuth 5 (Google, GitHub OAuth)   |
| AI               | Google Gemini 2.5 Flash             |
| E-post           | Resend                             |
| IoT              | RAPT Hydrometer Cloud API          |
| Validering       | Zod 4                              |
| i18n             | next-intl (no/en)                  |
| Visualisering    | Recharts, @xyflow/react            |
| Test             | Vitest + Testing Library           |

## Dataflyt

### Innhold (Sanity -> Next.js)
Redaksjonelt innhold (oppskrifter, artikler, ølprofiler, bryggelogger) administreres i Sanity Studio og hentes via GROQ-spørringer i `src/lib/sanity.ts`. CDN-cachet med `useCdn: true`.

### Brukerdata (PostgreSQL via Prisma)
Bruker-generert innhold (forks, annonser, brew swaps, ratings) lagres i PostgreSQL. Prisma ORM med type-sikre queries. Singleton-moenster i `src/lib/prisma.ts` forhindrer connection pool exhaustion.

### Autentisering
NextAuth 5 med PrismaAdapter. OAuth-flyt via Google/GitHub. Sessions lagres i PostgreSQL. Auth-sjekk skjer per API-route via `auth()`.

## Mappestruktur

```
src/
  app/                    # Next.js App Router
    api/                  # 13 REST API-routes
      ai/                 # Gemini-integrasjoner
      auth/               # NextAuth handler
      brew-swap/          # Brew swap CRUD
      forks/              # Oppskrift-fork CRUD + rating + lineage
      listings/           # Markedsplass CRUD
      newsletter/         # Nyhetsbrev-signup
      rapt/               # Hydrometer-synk
    [feature-pages]/      # ~49 sider
  components/             # React-komponenter
    ai/                   # AI-verktoy UI
    calculators/          # Ølkalkulatorer
    ui/                   # shadcn/ui base-komponenter
  lib/                    # Forretningslogikk og utilities
    validations.ts        # Zod-skjemaer for all input
    rate-limit.ts         # In-memory rate limiter
    calculators.ts        # ABV, IBU, SRM, pitch rate, carbonation
    sanity.ts             # GROQ-queries
    auth.ts               # NextAuth-konfigurasjon
  i18n/                   # Flersprakstotte (no/en)

sanity/                   # CMS-konfigurasjon
  schemas/                # 6 dokumenttyper
prisma/                   # Databaseskjema (8 modeller)
tests/                    # Vitest enhetstester
```

## Database-modell (Prisma)

```
User (1) ---< Account         OAuth-kontoer
     |---< Session            Aktive sesjoner
     |---< RecipeFork (1) ---< Rating
     |         |---< RecipeFork (self-ref: ForkTree)
     |---< Listing            Markedsplass-annonser
     |---< BrewSwap (1) ---< SwapParticipant
     +---< SwapParticipant
```

## API-design

Alle endepunkter folger dette monsteret:
1. Autentisering via `auth()` for skrivekall
2. Input-validering via Zod-skjemaer (`src/lib/validations.ts`)
3. Prisma-query med include/select for minimal data
4. JSON-respons med konsistent feilformat: `{ error: "melding" }`
5. Rate limiting pa AI-endepunkter (10 req/min/IP)

## Sikkerhetstiltak

- Input-validering med typed Zod-skjemaer (grain, hop, yeast, addition, process)
- Rate limiting pa AI-endepunkter
- Auth-sjekk pa alle skriveoperasjoner
- Ownership-sjekk pa PATCH/DELETE (bruker kan kun endre egne ressurser)
- Ingen direkte database-body passthrough (all input filtrert gjennom Zod)
- Environment-variabler validert ved oppstart, feil i prod = krasj
- E-poster skjules i API-responser

## Kjente begrensninger

- Rate limiter er in-memory (per serverless-instans, ikke global)
- Sanity CDN-cache kan gi foreldet innhold (ingen revalidering konfigurert)
- Lineage-traversering er N+1 queries (bor migreres til CTE)
- Kun 3 testfiler (29 tester) — mangler API-route-tester og komponent-tester
- Ingen Next.js middleware for global auth-beskyttelse
- Mangler `error.tsx`/`not-found.tsx`/`loading.tsx` i flere routes
