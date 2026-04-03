import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const cursor = req.nextUrl.searchParams.get("cursor");
  const limit = 20;

  const posts = await prisma.brewPost.findMany({
    take: limit + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { id: true, name: true, image: true } },
    },
  });

  const hasMore = posts.length > limit;
  const items = hasMore ? posts.slice(0, limit) : posts;
  const nextCursor = hasMore ? items[items.length - 1].id : null;

  return NextResponse.json({ items, nextCursor });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Ikke innlogget" }, { status: 401 });
  }

  const body = await req.json();
  const { title, text, images, brewDate, tags } = body;

  if (!title || typeof title !== "string" || title.trim().length < 2) {
    return NextResponse.json({ error: "Tittel er påkrevd (min. 2 tegn)" }, { status: 400 });
  }
  if (!text || typeof text !== "string" || text.trim().length < 10) {
    return NextResponse.json({ error: "Tekst er påkrevd (min. 10 tegn)" }, { status: 400 });
  }

  const post = await prisma.brewPost.create({
    data: {
      title: title.trim(),
      body: text.trim(),
      images: Array.isArray(images) ? images.filter((u: string) => typeof u === "string" && u.startsWith("http")) : [],
      brewDate: brewDate ? new Date(brewDate) : null,
      tags: Array.isArray(tags) ? tags.filter((t: string) => typeof t === "string") : [],
      source: "web",
      userId: session.user.id,
    },
    include: {
      user: { select: { id: true, name: true, image: true } },
    },
  });

  return NextResponse.json(post, { status: 201 });
}
