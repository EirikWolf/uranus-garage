import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createSimulationSchema } from "@/lib/validations";
import { simulateFermentation } from "@/lib/fermentation-model";
import { paginationParams, paginationMeta } from "@/lib/api-utils";
import type { SimulationParams } from "@/lib/types";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Ikke innlogget" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = createSimulationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Ugyldig data" },
        { status: 400 },
      );
    }
    const data = parsed.data;

    const params: SimulationParams = {
      og: data.og,
      fermentationTempC: data.fermentationTempC,
      yeast: data.yeast,
      batchSizeLiters: data.batchSizeLiters,
      pitchRateBillionCells: data.pitchRateBillionCells,
    };

    const result = simulateFermentation(params);

    const simulation = await prisma.simulation.create({
      data: {
        name: data.name,
        forkId: data.forkId ?? null,
        brewLogSanityId: data.brewLogSanityId ?? null,
        params: JSON.parse(JSON.stringify(params)),
        result: JSON.parse(JSON.stringify(result)),
        userId: session.user.id,
      },
    });

    return NextResponse.json({ simulation }, { status: 201 });
  } catch (error) {
    console.error("Create simulation error:", error);
    return NextResponse.json({ error: "Kunne ikke opprette simulering" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Ikke innlogget" }, { status: 401 });
  }

  const { page, limit, skip } = paginationParams(request);

  try {
    const where = { userId: session.user.id };
    const [simulations, total] = await Promise.all([
      prisma.simulation.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: limit,
        skip,
        select: {
          id: true,
          name: true,
          params: true,
          createdAt: true,
          forkId: true,
        },
      }),
      prisma.simulation.count({ where }),
    ]);

    return NextResponse.json({
      simulations,
      pagination: paginationMeta(page, limit, total),
    });
  } catch (error) {
    console.error("List simulations error:", error);
    return NextResponse.json({ error: "Kunne ikke hente simuleringer" }, { status: 500 });
  }
}
