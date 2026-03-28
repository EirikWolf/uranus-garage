# Uranus Garage Fase 4 — Brew-Swap + Markedsplass Design Spec

## Oversikt

To community-features: Brew-Swap for koordinerte splittede batcher, og en Markedsplass for kjøp/salg/bytte av bryggeutstyr. Begge krever innlogging (auth fra Fase 3A).

## 4A: Markedsplassen

### Konsept

Innloggede brukere oppretter annonser for utstyr de vil selge, kjøpe, eller bytte. Andre brukere kan se og kontakte annonsøren.

### Prisma-modell

```prisma
model Listing {
  id          String   @id @default(cuid())
  title       String
  description String
  type        String   // "selger", "kjoper", "bytter"
  price       String?  // Fritekst: "500kr", "Gratis", "Bytte"
  location    String   // Fritekst by/område
  imageUrl    String?  // URL til bilde
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### Sider

- `/markedsplass` — Liste over aktive annonser (filtrer på type, søk)
- `/markedsplass/ny` — Opprett ny annonse (krever auth)
- `/markedsplass/[id]` — Annonse-detaljside med kontaktinfo

### Funksjoner

- Opprett annonse: tittel, beskrivelse, type (selger/kjøper/bytter), pris, lokasjon
- Se alle aktive annonser med filtrering
- Annonsøren kan deaktivere/slette sine egne annonser
- Kontakt via e-post (brukerens registrerte e-post)

## 4B: Brew-Swap (Crowd-Brewing)

### Konsept

En bruker planlegger å brygge en stor batch (f.eks. 50L vørter). De legger ut et "swap" der andre bryggere kan melde seg på for å hente en porsjon og gjære med sin egen vri.

### Prisma-modell

```prisma
model BrewSwap {
  id            String         @id @default(cuid())
  title         String
  description   String
  baseRecipe    String?        // Beskrivelse av base-vørteren
  totalLiters   Float
  portionSize   Float          // Liter per deltaker
  maxParticipants Int
  brewDate      DateTime
  location      String         // Fritekst
  status        String         @default("planlagt") // planlagt, aktiv, fullfort, avlyst
  userId        String
  user          User           @relation(fields: [userId], references: [id])
  participants  SwapParticipant[]
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
}

model SwapParticipant {
  id          String   @id @default(cuid())
  swapId      String
  swap        BrewSwap @relation(fields: [swapId], references: [id], onDelete: Cascade)
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  plan        String?  // "Hva vil du gjøre med din porsjon?"
  result      String?  // Smaksnotater etter brygging
  forkId      String?  // Referanse til RecipeFork hvis de lagret oppskriften
  createdAt   DateTime @default(now())

  @@unique([swapId, userId])
}
```

### Sider

- `/brew-swap` — Liste over kommende og pågående swaps
- `/brew-swap/ny` — Opprett ny swap (krever auth)
- `/brew-swap/[id]` — Swap-detaljside med påmelding og resultater

### Funksjoner

- Opprett swap: tittel, beskrivelse, base-oppskrift, totalliter, porsjonsstørrelse, maks deltakere, dato, lokasjon
- Meld deg på: beskriv hva du vil gjøre med din porsjon (gjærstamme, humle, osv.)
- Etter brygging: deltakere legger inn resultater og smaksnotater
- Status-flow: planlagt → aktiv → fullført
- Arrangøren kan avlyse

## Navigasjon

Oppdater Community-dropdown:
```
├── COMMUNITY ▾
│   ├── Forks
│   ├── Brew-Swap
│   ├── Markedsplassen
│   └── Events
```
