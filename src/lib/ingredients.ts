import { prisma } from "./prisma";

export async function getFermentables(filters?: {
  category?: string;
  country?: string;
}) {
  return prisma.fermentable.findMany({
    where: {
      ...(filters?.category ? { category: filters.category } : {}),
      ...(filters?.country ? { country: filters.country } : {}),
    },
    orderBy: { name: "asc" },
  });
}

export async function getHops(filters?: {
  category?: string;
  country?: string;
  purpose?: string;
}) {
  return prisma.hop.findMany({
    where: {
      ...(filters?.category ? { category: filters.category } : {}),
      ...(filters?.country ? { country: filters.country } : {}),
      ...(filters?.purpose ? { purpose: filters.purpose } : {}),
    },
    orderBy: { name: "asc" },
  });
}

export async function getYeasts(filters?: {
  manufacturer?: string;
  type?: string;
  flocculation?: string;
}) {
  return prisma.yeast.findMany({
    where: {
      ...(filters?.manufacturer ? { manufacturer: filters.manufacturer } : {}),
      ...(filters?.type ? { type: filters.type } : {}),
      ...(filters?.flocculation ? { flocculation: filters.flocculation } : {}),
    },
    orderBy: { name: "asc" },
  });
}
