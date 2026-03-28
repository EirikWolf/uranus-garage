import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Ikke innlogget" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      name, description, parentSanityId, parentForkId,
      style, difficulty, batchSize, grains, hops, yeast,
      additions, process, changeNotes,
    } = body;

    if (!name) {
      return NextResponse.json({ error: "Navn er påkrevd" }, { status: 400 });
    }

    const fork = await prisma.recipeFork.create({
      data: {
        name,
        description: description || null,
        parentSanityId: parentSanityId || null,
        parentForkId: parentForkId || null,
        style: style || null,
        difficulty: difficulty || null,
        batchSize: batchSize || 20,
        grains: grains || [],
        hops: hops || [],
        yeast: yeast || {},
        additions: additions || [],
        process: process || [],
        changeNotes: changeNotes || null,
        userId: session.user.id,
      },
      include: {
        user: { select: { id: true, name: true, image: true } },
      },
    });

    return NextResponse.json({ fork }, { status: 201 });
  } catch (error) {
    console.error("Create fork error:", error);
    return NextResponse.json({ error: "Kunne ikke opprette fork" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parentSanityId = searchParams.get("parentSanityId");
  const parentForkId = searchParams.get("parentForkId");
  const userId = searchParams.get("userId");

  try {
    const where: Record<string, unknown> = { isPublic: true };
    if (parentSanityId) where.parentSanityId = parentSanityId;
    if (parentForkId) where.parentForkId = parentForkId;
    if (userId) {
      where.userId = userId;
      delete where.isPublic; // Show all forks for the owner
    }

    const forks = await prisma.recipeFork.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, image: true } },
        ratings: { select: { value: true } },
        _count: { select: { children: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    // Add average rating
    const forksWithRating = forks.map((fork) => {
      const avgRating = fork.ratings.length > 0
        ? Math.round((fork.ratings.reduce((sum, r) => sum + r.value, 0) / fork.ratings.length) * 10) / 10
        : null;
      return {
        ...fork,
        avgRating,
        ratingCount: fork.ratings.length,
        forkCount: fork._count.children,
      };
    });

    return NextResponse.json({ forks: forksWithRating });
  } catch (error) {
    console.error("List forks error:", error);
    return NextResponse.json({ error: "Kunne ikke hente forks" }, { status: 500 });
  }
}
