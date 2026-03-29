import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateListingSchema } from "@/lib/validations";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const listing = await prisma.listing.findUnique({
    where: { id },
    include: { user: { select: { id: true, name: true, image: true } } },
  });

  if (!listing || !listing.isActive) {
    return NextResponse.json({ error: "Annonse ikke funnet" }, { status: 404 });
  }

  return NextResponse.json({ listing });
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
  const existing = await prisma.listing.findUnique({ where: { id }, select: { userId: true } });
  if (!existing || existing.userId !== session.user.id) {
    return NextResponse.json({ error: "Ikke autorisert" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const parsed = updateListingSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Ugyldig data" },
        { status: 400 },
      );
    }

    const listing = await prisma.listing.update({
      where: { id },
      data: parsed.data,
    });

    return NextResponse.json({ listing });
  } catch (error) {
    console.error("Update listing error:", error);
    return NextResponse.json({ error: "Kunne ikke oppdatere annonse" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Ikke innlogget" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await prisma.listing.findUnique({ where: { id }, select: { userId: true } });
  if (!existing || existing.userId !== session.user.id) {
    return NextResponse.json({ error: "Ikke autorisert" }, { status: 403 });
  }

  await prisma.listing.update({ where: { id }, data: { isActive: false } });
  return NextResponse.json({ success: true });
}
