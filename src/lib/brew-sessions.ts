import { prisma } from "@/lib/prisma";

export async function getBrewSessions() {
  return prisma.brewSession.findMany({
    orderBy: { createdOn: "desc" },
    include: { _count: { select: { readings: true } } },
  });
}

export async function getBrewSessionWithReadings(id: string) {
  return prisma.brewSession.findUnique({
    where: { id },
    include: {
      readings: { orderBy: { timestamp: "asc" } },
    },
  });
}
