import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { joinSwapSchema } from "@/lib/validations";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Ikke innlogget" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const parsed = joinSwapSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Ugyldig data" },
      { status: 400 },
    );
  }
  const { plan } = parsed.data;

  const swap = await prisma.brewSwap.findUnique({
    where: { id },
    include: { _count: { select: { participants: true } } },
  });

  if (!swap) {
    return NextResponse.json({ error: "Swap ikke funnet" }, { status: 404 });
  }

  if (swap.status !== "planlagt") {
    return NextResponse.json({ error: "Kan ikke melde seg på denne swappen" }, { status: 400 });
  }

  if (swap._count.participants >= swap.maxParticipants) {
    return NextResponse.json({ error: "Fullt! Alle plasser er tatt." }, { status: 400 });
  }

  if (swap.userId === session.user.id) {
    return NextResponse.json({ error: "Du er arrangør og allerede med" }, { status: 400 });
  }

  const participant = await prisma.swapParticipant.upsert({
    where: {
      swapId_userId: { swapId: id, userId: session.user.id },
    },
    update: { plan: plan ?? null },
    create: {
      swapId: id,
      userId: session.user.id,
      plan: plan ?? null,
    },
    include: { user: { select: { id: true, name: true, image: true } } },
  });

  return NextResponse.json({ participant });
}
