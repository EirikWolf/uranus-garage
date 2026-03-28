# Fase 3A: Auth + Database Fundament Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Set up user authentication (Google/GitHub OAuth) with NextAuth.js v5 and Neon Postgres database with Prisma ORM, plus a basic user profile page.

**Architecture:** NextAuth.js v5 handles auth flows. Prisma connects to Neon Postgres (serverless). User sessions stored in DB. Profile page shows user info and will later display forks/ratings.

**Tech Stack:** NextAuth.js v5 (Auth.js), Prisma, Neon Postgres, Next.js App Router

**Spec:** `docs/superpowers/specs/2026-03-28-fase3-recipe-fork.md`

---

## File Structure

```
prisma/
└── schema.prisma               # Prisma schema with User, Account, Session models
src/
├── lib/
│   ├── prisma.ts               # Prisma client singleton
│   └── auth.ts                 # NextAuth.js config
├── app/
│   ├── api/
│   │   └── auth/
│   │       └── [...nextauth]/
│   │           └── route.ts    # NextAuth API route
│   ├── profil/
│   │   └── page.tsx            # User profile page
│   └── layout.tsx              # Modified: wrap with SessionProvider
├── components/
│   ├── auth-button.tsx         # Login/logout button
│   ├── session-provider.tsx    # Client-side SessionProvider wrapper
│   └── navigation.tsx          # Modified: add auth button
```

---

## Task 1: Install Dependencies + Neon Setup

- [ ] **Step 1: Install auth and database packages**

```bash
cd /c/dev/uranus-garage
npm install next-auth@beta @prisma/client @auth/prisma-adapter
npm install -D prisma
```

Note: next-auth@beta is v5 (Auth.js). Check the latest version.

- [ ] **Step 2: Initialize Prisma**

```bash
cd /c/dev/uranus-garage
npx prisma init --datasource-provider postgresql
```

This creates `prisma/schema.prisma` and adds `DATABASE_URL` to `.env`.

- [ ] **Step 3: Update .env.local.example**

Add to `.env.local.example`:

```
# Database (Neon Postgres)
DATABASE_URL=postgresql://user:pass@ep-xxx.region.neon.tech/neondb?sslmode=require

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

- [ ] **Step 4: Commit**

```bash
git add . && git commit -m "chore: add auth and database dependencies, initialize Prisma"
```

---

## Task 2: Prisma Schema + Database

- [ ] **Step 1: Write Prisma schema**

Replace `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  bio           String?
  accounts      Account[]
  sessions      Session[]
  createdAt     DateTime  @default(now())
}

model Account {
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

- [ ] **Step 2: Create Prisma client singleton**

Create `src/lib/prisma.ts`:

```typescript
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

- [ ] **Step 3: Generate Prisma client**

```bash
cd /c/dev/uranus-garage && npx prisma generate
```

Note: `npx prisma db push` requires the DATABASE_URL to be set. The user will need to create a Neon project and add the URL to .env.local before this step works. For now, just generate the client.

- [ ] **Step 4: Commit**

```bash
git add . && git commit -m "feat: add Prisma schema with User, Account, Session models"
```

---

## Task 3: NextAuth.js Configuration

- [ ] **Step 1: Create auth config**

Create `src/lib/auth.ts`:

```typescript
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/logg-inn",
  },
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
});
```

- [ ] **Step 2: Create NextAuth API route**

Create `src/app/api/auth/[...nextauth]/route.ts`:

```typescript
import { handlers } from "@/lib/auth";

export const { GET, POST } = handlers;
```

- [ ] **Step 3: Create SessionProvider wrapper**

Create `src/components/session-provider.tsx`:

```tsx
"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";

export function SessionProvider({ children }: { children: React.ReactNode }) {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
}
```

- [ ] **Step 4: Wrap layout with SessionProvider**

Read `src/app/layout.tsx`. Wrap the body content with SessionProvider:

```tsx
// Add import:
import { SessionProvider } from "@/components/session-provider";

// Wrap body content:
<body className={`${inter.className} flex flex-col min-h-screen`}>
  <SessionProvider>
    <Navigation />
    <main className="flex-1">{children}</main>
    <Footer />
  </SessionProvider>
</body>
```

- [ ] **Step 5: Run typecheck**

```bash
cd /c/dev/uranus-garage && npm run typecheck
```

- [ ] **Step 6: Commit**

```bash
git add . && git commit -m "feat: add NextAuth.js v5 config with Google and GitHub providers"
```

---

## Task 4: Auth UI (Login Button + Login Page)

- [ ] **Step 1: Create auth button component**

Create `src/components/auth-button.tsx`:

```tsx
"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { LogIn, LogOut, User } from "lucide-react";

export function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="w-8 h-8 rounded-full bg-secondary animate-pulse" />;
  }

  if (!session) {
    return (
      <button
        onClick={() => signIn()}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg bg-primary text-primary-foreground hover:bg-primary/80 transition-colors"
      >
        <LogIn className="h-4 w-4" />
        Logg inn
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link href="/profil" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
        {session.user?.image ? (
          <Image
            src={session.user.image}
            alt={session.user.name || "Profil"}
            width={32}
            height={32}
            className="rounded-full"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <User className="h-4 w-4 text-primary-foreground" />
          </div>
        )}
      </Link>
      <button
        onClick={() => signOut()}
        className="text-muted-foreground hover:text-foreground transition-colors"
        title="Logg ut"
      >
        <LogOut className="h-4 w-4" />
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Create login page**

Create `src/app/logg-inn/page.tsx`:

```tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LoginButtons } from "./login-buttons";

export const metadata = {
  title: "Logg inn — Uranus Garage",
};

export default async function LoginPage() {
  const session = await auth();
  if (session) redirect("/profil");

  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center">
      <h1 className="text-3xl font-bold mb-2">Logg inn</h1>
      <p className="text-muted-foreground mb-8">
        Logg inn for å lagre oppskrifter, forke andres brygg, og dele dine resultater.
      </p>
      <LoginButtons />
    </div>
  );
}
```

Create `src/app/logg-inn/login-buttons.tsx`:

```tsx
"use client";

import { signIn } from "next-auth/react";

export function LoginButtons() {
  return (
    <div className="space-y-3">
      <button
        onClick={() => signIn("google", { callbackUrl: "/profil" })}
        className="w-full inline-flex items-center justify-center gap-3 px-4 py-3 rounded-lg border border-border bg-card text-foreground hover:bg-accent transition-colors"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        Fortsett med Google
      </button>
      <button
        onClick={() => signIn("github", { callbackUrl: "/profil" })}
        className="w-full inline-flex items-center justify-center gap-3 px-4 py-3 rounded-lg border border-border bg-card text-foreground hover:bg-accent transition-colors"
      >
        <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
        </svg>
        Fortsett med GitHub
      </button>
    </div>
  );
}
```

- [ ] **Step 3: Add AuthButton to navigation**

Read `src/components/navigation.tsx`. Add `AuthButton` to the desktop nav (after nav items, right side) and mobile nav.

```tsx
// Add import:
import { AuthButton } from "./auth-button";

// In desktop nav, after the nav items div:
<AuthButton />

// In mobile nav sheet, at the bottom:
<div className="mt-auto pt-4 border-t border-border">
  <AuthButton />
</div>
```

- [ ] **Step 4: Run typecheck**

```bash
cd /c/dev/uranus-garage && npm run typecheck
```

- [ ] **Step 5: Commit**

```bash
git add . && git commit -m "feat: add login page, auth button, and navigation auth UI"
```

---

## Task 5: Profile Page

- [ ] **Step 1: Create profile page**

Create `src/app/profil/page.tsx`:

```tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "Min profil — Uranus Garage",
};

export default async function ProfilePage() {
  const session = await auth();
  if (!session) redirect("/logg-inn");

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Min profil</h1>

      <Card className="bg-card border-border mb-8">
        <CardContent className="pt-6 flex items-center gap-6">
          {session.user?.image && (
            <Image
              src={session.user.image}
              alt={session.user.name || "Profil"}
              width={80}
              height={80}
              className="rounded-full"
            />
          )}
          <div>
            <h2 className="text-xl font-bold">{session.user?.name}</h2>
            <p className="text-muted-foreground">{session.user?.email}</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-2">Mine oppskrifter</h3>
            <p className="text-sm text-muted-foreground">
              Du har ingen lagrede oppskrifter ennå.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Bruk AI-oppskriftsgeneratoren eller fork en eksisterende oppskrift for å komme i gang.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-2">Mine forks</h3>
            <p className="text-sm text-muted-foreground">
              Du har ingen forks ennå.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Gå til en oppskrift og klikk &quot;Fork This Brew&quot; for å lage din versjon.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Add profile image domain to next.config.ts**

Read `next.config.ts` and add Google and GitHub avatar domains to `images.remotePatterns`:

```typescript
{
  protocol: "https",
  hostname: "lh3.googleusercontent.com",
},
{
  protocol: "https",
  hostname: "avatars.githubusercontent.com",
},
```

- [ ] **Step 3: Run typecheck and tests**

```bash
cd /c/dev/uranus-garage && npm run typecheck && npm test
```

- [ ] **Step 4: Commit and push**

```bash
git add . && git commit -m "feat: add user profile page with placeholder sections for forks and recipes"
git push
```
