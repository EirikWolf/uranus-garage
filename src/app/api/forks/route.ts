import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createForkSchema } from "@/lib/validations";
import { paginationParams, paginationMeta } from "@/lib/api-utils";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Ikke innlogget" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = createForkSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Ugyldig data" },
        { status: 400 },
      );
    }
    const data = parsed.data;

    const fork = await prisma.recipeFork.create({
      data: {
        name: data.name,
        description: data.description ?? null,
        parentSanityId: data.parentSanityId ?? null,
        parentForkId: data.parentForkId ?? null,
        style: data.style ?? null,
        difficulty: data.difficulty ?? null,
        batchSize: data.batchSize,
        grains: data.grains,
        hops: data.hops,
        yeast: data.yeast,
        additions: data.additions,
        process: data.process,
        changeNotes: data.changeNotes ?? null,
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
  const { page, limit, skip } = paginationParams(request);

  try {
    const session = await auth();
    const where: Record<string, unknown> = { isPublic: true };
    if (parentSanityId) where.parentSanityId = parentSanityId;
    if (parentForkId) where.parentForkId = parentForkId;
    if (userId) {
      where.userId = userId;
      // Only show private forks if the requester is the owner
      if (session?.user?.id === userId) {
        delete where.isPublic;
      }
    }

    const [forks, total] = await Promise.all([
      prisma.recipeFork.findMany({
        where,
        include: {
          user: { select: { id: true, name: true, image: true } },
          _count: { select: { children: true, ratings: true } },
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip,
      }),
      prisma.recipeFork.count({ where }),
    ]);

    // Batch-fetch average ratings for all forks in one query
    const forkIds = forks.map((f) => f.id);
    const avgRatings = forkIds.length > 0
      ? await prisma.rating.groupBy({
          by: ["forkId"],
          where: { forkId: { in: forkIds } },
          _avg: { value: true },
        })
      : [];
    const ratingMap = new Map(
      avgRatings.map((r) => [r.forkId, r._avg.value ? Math.round(r._avg.value * 10) / 10 : null]),
    );

    const forksWithRating = forks.map((fork) => ({
      ...fork,
      avgRating: ratingMap.get(fork.id) ?? null,
      ratingCount: fork._count.ratings,
      forkCount: fork._count.children,
    }));

    return NextResponse.json({
      forks: forksWithRating,
      pagination: paginationMeta(page, limit, total),
    });
  } catch (error) {
    console.error("List forks error:", error);
    return NextResponse.json({ error: "Kunne ikke hente forks" }, { status: 500 });
  }
}
