import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Ikke innlogget" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const { value, comment } = body;

    if (!value || value < 1 || value > 5) {
      return NextResponse.json({ error: "Rating må være 1-5" }, { status: 400 });
    }

    // Check fork exists
    const fork = await prisma.recipeFork.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!fork) {
      return NextResponse.json({ error: "Fork ikke funnet" }, { status: 404 });
    }

    // Can't rate your own fork
    if (fork.userId === session.user.id) {
      return NextResponse.json({ error: "Du kan ikke rate din egen fork" }, { status: 400 });
    }

    // Upsert rating (one per user per fork)
    const rating = await prisma.rating.upsert({
      where: {
        userId_forkId: {
          userId: session.user.id,
          forkId: id,
        },
      },
      update: { value, comment: comment || null },
      create: {
        value,
        comment: comment || null,
        userId: session.user.id,
        forkId: id,
      },
    });

    return NextResponse.json({ rating });
  } catch (error) {
    console.error("Rate fork error:", error);
    return NextResponse.json({ error: "Kunne ikke rate fork" }, { status: 500 });
  }
}
