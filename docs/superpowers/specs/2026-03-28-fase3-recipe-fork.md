# Uranus Garage Fase 3 — Recipe Fork ("GitHub for Øl") Design Spec

## Oversikt

Implementer versjonskontroll for oppskrifter med brukerautentisering, fork-funksjonalitet, diff-visning, slektstre-visualisering, og rating-system. Brukere kan forke oppskrifter, gjøre endringer, brygge dem, og dele resultatene.

## Arkitektur

**Hybrid datamodell:**
- Sanity: Redaksjonelt innhold (øl, bryggelogg, artikler, originale oppskrifter)
- Postgres (Neon): Brukerprofiler, forks, ratings, lagrede AI-oppskrifter, sessions

**Auth:** NextAuth.js v5 med Google og GitHub providers, Prisma adapter for session/user storage i Postgres.

## Tech Stack

| Komponent | Teknologi |
|---|---|
| Auth | NextAuth.js v5 (Auth.js) |
| Database | Neon Postgres (serverless) |
| ORM | Prisma |
| Providers | Google OAuth, GitHub OAuth |

## Fase 3A: Auth + Database Fundament

### Prisma Schema

```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  bio           String?
  accounts      Account[]
  sessions      Session[]
  forks         RecipeFork[]
  ratings       Rating[]
  createdAt     DateTime  @default(now())
}

model Account {
  // NextAuth standard fields
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime
  @@unique([identifier, token])
}
```

### Sider

- `/profil` — Brukerprofil (mine forks, mine oppskrifter, mine ratings)
- `/logg-inn` — Login-side med Google/GitHub knapper

### Navigasjon

Legg til profil-ikon/login-knapp i navigasjonen (høyre side).

## Fase 3B: Fork-systemet

### Prisma Schema (utvidelse)

```prisma
model RecipeFork {
  id              String    @id @default(cuid())
  name            String
  description     String?
  // Referanse til original oppskrift (Sanity ID eller fork ID)
  parentSanityId  String?   // Hvis forket fra Sanity-oppskrift
  parentForkId    String?   // Hvis forket fra en annen fork
  parentFork      RecipeFork? @relation("ForkTree", fields: [parentForkId], references: [id])
  children        RecipeFork[] @relation("ForkTree")
  // Oppskriftsdata (kopi av original med endringer)
  style           String?
  difficulty      String?
  batchSize       Float     @default(20)
  grains          Json      // Array av Grain
  hops            Json      // Array av Hop
  yeast           Json      // Yeast object
  additions       Json?     // Array av Addition
  process         Json?     // Array av ProcessStep
  // Endringer fra original
  changeNotes     String?   // "Hva endret du?"
  // Brygge-resultater
  brewDate        DateTime?
  og              Float?
  fg              Float?
  tastingNotes    String?
  // Meta
  userId          String
  user            User      @relation(fields: [userId], references: [id])
  ratings         Rating[]
  isPublic        Boolean   @default(true)
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}

model Rating {
  id        String     @id @default(cuid())
  value     Int        // 1-5
  comment   String?
  userId    String
  user      User       @relation(fields: [userId], references: [id])
  forkId    String
  fork      RecipeFork @relation(fields: [forkId], references: [id])
  createdAt DateTime   @default(now())
  @@unique([userId, forkId])
}
```

### Funksjoner

**Fork This Brew-knappen:**
- Vises på oppskrift-detaljsider (både Sanity-oppskrifter og forks)
- Krever innlogging
- Kopierer oppskriften til brukerens profil
- Åpner redigeringsskjema: "Hva vil du endre?"
- Lagrer med changeNotes

**Diff-visning:**
- Sammenligner fork med forelderen
- Fargekoder: rødt for fjernet, grønt for lagt til
- Viser endringer i ingredienser, mengder, prosess

**Fork-info på oppskrift-sider:**
- Antall forks
- "Forket fra [original]" med lenke
- Liste over aktive forks

### Sider

- `/oppskrifter/[slug]` — Utvidet med fork-knapp og fork-liste
- `/forks/[id]` — Fork-detaljside med diff-visning
- `/forks/[id]/rediger` — Redigeringsskjema for fork
- `/profil` — Utvidet med mine forks

## Fase 3C: Lineage + Rating + AI-lagring

### Slektstre-visualisering

- Visuell graf som viser fork-hierarkiet
- Hovednoden er original-oppskriften
- Barnenoder er forks med brukerinfo og rating
- Interaktiv: klikk for å se diff
- Bruk D3.js eller react-flow for visualisering

### Rating-system

- 1-5 stjerner + valgfri kommentar
- Gjennomsnittrating vises på fork-kortet
- Kun innloggede brukere kan rate
- Én rating per bruker per fork

### Lagre AI-oppskrifter

- "Lagre oppskrift"-knapp på AI-genererte oppskrifter
- Lagres som RecipeFork uten forelder (ny oppskrift)
- Vises i brukerens profil
- Kan deles og forkes av andre

### Brygge-feed

- Aktivitets-feed på forsiden: "Ola brygget sin fork og rapporterte..."
- Basert på RecipeFork.brewDate og tastingNotes
