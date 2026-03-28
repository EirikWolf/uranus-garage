import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Ikke innlogget" }, { status: 401 });
  }

  const body = await request.json();
  const { title, description, type, price, location } = body;

  if (!title || !description || !type || !location) {
    return NextResponse.json({ error: "Mangler påkrevde felt" }, { status: 400 });
  }

  const listing = await prisma.listing.create({
    data: {
      title,
      description,
      type,
      price: price || null,
      location,
      userId: session.user.id,
    },
    include: { user: { select: { id: true, name: true, image: true } } },
  });

  return NextResponse.json({ listing }, { status: 201 });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const search = searchParams.get("search");

  const where: Record<string, unknown> = { isActive: true };
  if (type && type !== "all") where.type = type;
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { location: { contains: search, mode: "insensitive" } },
    ];
  }

  const listings = await prisma.listing.findMany({
    where,
    include: { user: { select: { id: true, name: true, image: true } } },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return NextResponse.json({ listings });
}
