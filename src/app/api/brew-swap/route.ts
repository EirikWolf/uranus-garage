import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Ikke innlogget" }, { status: 401 });
  }

  const body = await request.json();
  const { title, description, baseRecipe, totalLiters, portionSize, maxParticipants, brewDate, location } = body;

  if (!title || !totalLiters || !portionSize || !maxParticipants || !brewDate || !location) {
    return NextResponse.json({ error: "Mangler påkrevde felt" }, { status: 400 });
  }

  const swap = await prisma.brewSwap.create({
    data: {
      title,
      description: description || "",
      baseRecipe: baseRecipe || null,
      totalLiters: parseFloat(totalLiters),
      portionSize: parseFloat(portionSize),
      maxParticipants: parseInt(maxParticipants),
      brewDate: new Date(brewDate),
      location,
      userId: session.user.id,
    },
    include: { user: { select: { id: true, name: true, image: true } } },
  });

  return NextResponse.json({ swap }, { status: 201 });
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
