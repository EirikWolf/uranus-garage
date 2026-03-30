import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { scrapeBrewSessions } from "@/lib/rapt-scraper";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Ikke innlogget" }, { status: 401 });
  }

  try {
    const rawSessions = await scrapeBrewSessions();
    let imported = 0;
    let skipped = 0;

    for (const s of rawSessions) {
      const existing = await prisma.brewSession.findUnique({
        where: { name: s.name },
      });
      if (existing) {
        skipped++;
        continue;
      }

      await prisma.brewSession.create({
        data: {
          name: s.name,
          createdOn: new Date(s.createdOn),
          endingOn: s.endingOn ? new Date(s.endingOn) : null,
          og: s.og,
          fg: s.fg,
          abv: s.abv,
          numDays: s.numDays,
          isActive: !s.endingOn,
        },
      });
      imported++;
    }

    return NextResponse.json({ imported, skipped });
  } catch (error) {
    console.error("RAPT import error:", error);
    return NextResponse.json({ error: "Import feilet" }, { status: 500 });
  }
}
