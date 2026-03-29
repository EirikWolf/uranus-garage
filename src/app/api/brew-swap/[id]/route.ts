import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const swap = await prisma.brewSwap.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, image: true, email: true } },
      participants: {
        include: { user: { select: { id: true, name: true, image: true } } },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!swap) {
    return NextResponse.json({ error: "Swap ikke funnet" }, { status: 404 });
  }

  return NextResponse.json({ swap });
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
  const existing = await prisma.brewSwap.findUnique({ where: { id }, select: { userId: true } });
  if (!existing || existing.userId !== session.user.id) {
    return NextResponse.json({ error: "Ikke autorisert" }, { status: 403 });
  }

  const body = await request.json();
  const { status } = body;
  if (status && !["planlagt", "aktiv", "fullfort", "avlyst"].includes(status)) {
    return NextResponse.json({ error: "Ugyldig status" }, { status: 400 });
  }

  const swap = await prisma.brewSwap.update({
    where: { id },
    data: { status },
  });

  return NextResponse.json({ swap });
}
