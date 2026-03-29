import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createSwapSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Ikke innlogget" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = createSwapSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Ugyldig data" },
        { status: 400 },
      );
    }
    const data = parsed.data;

    const swap = await prisma.brewSwap.create({
      data: {
        title: data.title,
        description: data.description,
        baseRecipe: data.baseRecipe ?? null,
        totalLiters: data.totalLiters,
        portionSize: data.portionSize,
        maxParticipants: data.maxParticipants,
        brewDate: new Date(data.brewDate),
        location: data.location,
        userId: session.user.id,
      },
      include: { user: { select: { id: true, name: true, image: true } } },
    });

    return NextResponse.json({ swap }, { status: 201 });
  } catch (error) {
    console.error("Create swap error:", error);
    return NextResponse.json({ error: "Kunne ikke opprette swap" }, { status: 500 });
  }
}

export async function GET() {
  const swaps = await prisma.brewSwap.findMany({
    where: { status: { not: "avlyst" } },
    include: {
      user: { select: { id: true, name: true, image: true } },
      _count: { select: { participants: true } },
    },
    orderBy: { brewDate: "asc" },
    take: 50,
  });

  return NextResponse.json({ swaps });
}
