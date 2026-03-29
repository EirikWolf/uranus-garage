import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateSimulationSchema } from "@/lib/validations";
import { simulateFermentation } from "@/lib/fermentation-model";
import type { SimulationParams } from "@/lib/types";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const simulation = await prisma.simulation.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, image: true } },
      fork: { select: { id: true, name: true } },
    },
  });

  if (!simulation) {
    return NextResponse.json({ error: "Simulering ikke funnet" }, { status: 404 });
  }

  if (!simulation.isPublic) {
    const session = await auth();
    if (session?.user?.id !== simulation.userId) {
      return NextResponse.json({ error: "Simulering ikke funnet" }, { status: 404 });
    }
  }

  return NextResponse.json({ simulation });
}

export async function PATCH(
  request: Request,
  { params: routeParams }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Ikke innlogget" }, { status: 401 });
  }

  const { id } = await routeParams;
  const existing = await prisma.simulation.findUnique({
    where: { id },
    select: { userId: true, params: true },
  });

  if (!existing || existing.userId !== session.user.id) {
    return NextResponse.json({ error: "Ikke autorisert" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const parsed = updateSimulationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Ugyldig data" },
        { status: 400 },
      );
    }

    const updates = parsed.data;
    const oldParams = existing.params as unknown as SimulationParams;

    // Re-run simulation if params changed
    const hasParamChanges = updates.og || updates.fermentationTempC ||
      updates.yeast || updates.batchSizeLiters || updates.pitchRateBillionCells;

    const newParams: SimulationParams = {
      og: updates.og ?? oldParams.og,
      fermentationTempC: updates.fermentationTempC ?? oldParams.fermentationTempC,
      yeast: updates.yeast ?? oldParams.yeast,
      batchSizeLiters: updates.batchSizeLiters ?? oldParams.batchSizeLiters,
      pitchRateBillionCells: updates.pitchRateBillionCells ?? oldParams.pitchRateBillionCells,
    };

    const data: Record<string, unknown> = {};
    if (updates.name) data.name = updates.name;
    if (updates.isPublic !== undefined) data.isPublic = updates.isPublic;
    if (hasParamChanges) {
      const result = simulateFermentation(newParams);
      data.params = JSON.parse(JSON.stringify(newParams));
      data.result = JSON.parse(JSON.stringify(result));
    }

    const simulation = await prisma.simulation.update({
      where: { id },
      data,
    });

    return NextResponse.json({ simulation });
  } catch (error) {
    console.error("Update simulation error:", error);
    return NextResponse.json({ error: "Kunne ikke oppdatere simulering" }, { status: 500 });
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
  const existing = await prisma.simulation.findUnique({
    where: { id },
    select: { userId: true },
  });

  if (!existing || existing.userId !== session.user.id) {
    return NextResponse.json({ error: "Ikke autorisert" }, { status: 403 });
  }

  await prisma.simulation.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
