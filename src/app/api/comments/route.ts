import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const articleId = req.nextUrl.searchParams.get("articleId");
  if (!articleId) {
    return NextResponse.json({ error: "articleId er påkrevd" }, { status: 400 });
  }

  const comments = await prisma.articleComment.findMany({
    where: { sanityArticleId: articleId },
    orderBy: { createdAt: "asc" },
    include: {
      user: { select: { id: true, name: true, image: true } },
    },
  });

  return NextResponse.json(comments);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Ikke innlogget" }, { status: 401 });
  }

  const { articleId, body } = await req.json();
  if (!articleId || typeof body !== "string" || body.trim().length < 2) {
    return NextResponse.json({ error: "Ugyldig forespørsel" }, { status: 400 });
  }
  if (body.length > 2000) {
    return NextResponse.json({ error: "Kommentar er for lang (maks 2000 tegn)" }, { status: 400 });
  }

  const comment = await prisma.articleComment.create({
    data: {
      sanityArticleId: articleId,
      userId: session.user.id,
      body: body.trim(),
    },
    include: {
      user: { select: { id: true, name: true, image: true } },
    },
  });

  return NextResponse.json(comment, { status: 201 });
}
