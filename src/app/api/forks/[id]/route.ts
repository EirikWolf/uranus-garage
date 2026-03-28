import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const fork = await prisma.recipeFork.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, image: true } },
        parentFork: {
          select: { id: true, name: true, user: { select: { name: true } } },
        },
        children: {
          include: {
            user: { select: { id: true, name: true, image: true } },
            ratings: { select: { value: true } },
          },
          orderBy: { createdAt: "desc" },
          take: 20,
        },
        ratings: {
          include: {
            user: { select: { id: true, name: true, image: true } },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!fork) {
      return NextResponse.json({ error: "Fork ikke funnet" }, { status: 404 });
    }

    if (!fork.isPublic) {
      const session = await auth();
      if (session?.user?.id !== fork.userId) {
        return NextResponse.json({ error: "Fork ikke funnet" }, { status: 404 });
      }
    }

    const avgRating = fork.ratings.length > 0
      ? Math.round((fork.ratings.reduce((sum, r) => sum + r.value, 0) / fork.ratings.length) * 10) / 10
      : null;

    return NextResponse.json({
      fork: { ...fork, avgRating, ratingCount: fork.ratings.length },
    });
  } catch (error) {
    console.error("Get fork error:", error);
    return NextResponse.json({ error: "Kunne ikke hente fork" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Ikke innlogget" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const existing = await prisma.recipeFork.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existing || existing.userId !== session.user.id) {
      return NextResponse.json({ error: "Ikke autorisert" }, { status: 403 });
    }

    const body = await request.json();
    const allowedFields = [
      "name", "description", "style", "difficulty", "batchSize",
      "grains", "hops", "yeast", "additions", "process",
      "changeNotes", "brewDate", "og", "fg", "tastingNotes", "isPublic",
    ];

    const data: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        data[field] = body[field];
      }
    }

    const fork = await prisma.recipeFork.update({
      where: { id },
      data,
      include: {
        user: { select: { id: true, name: true, image: true } },
      },
    });

    return NextResponse.json({ fork });
  } catch (error) {
    console.error("Update fork error:", error);
    return NextResponse.json({ error: "Kunne ikke oppdatere fork" }, { status: 500 });
  }
}
