import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface TreeNode {
  id: string;
  name: string;
  userName: string;
  userImage: string | null;
  parentId: string | null;
  avgRating: number | null;
  childCount: number;
}

async function getAncestors(forkId: string): Promise<TreeNode[]> {
  const ancestors: TreeNode[] = [];
  let currentId: string | null = forkId;

  while (currentId) {
    const nextId: string = currentId;
    const fork = await prisma.recipeFork.findUnique({
      where: { id: nextId },
      include: {
        user: { select: { name: true, image: true } },
        ratings: { select: { value: true } },
        _count: { select: { children: true } },
      },
    });

    if (!fork) break;

    const avg = fork.ratings.length > 0
      ? Math.round((fork.ratings.reduce((s: number, r: { value: number }) => s + r.value, 0) / fork.ratings.length) * 10) / 10
      : null;

    ancestors.push({
      id: fork.id,
      name: fork.name,
      userName: fork.user.name || "Ukjent",
      userImage: fork.user.image,
      parentId: fork.parentForkId,
      avgRating: avg,
      childCount: fork._count.children,
    });

    currentId = fork.parentForkId;
  }

  return ancestors;
}

async function getDescendants(forkId: string): Promise<TreeNode[]> {
  const descendants: TreeNode[] = [];

  async function traverse(parentId: string) {
    const children = await prisma.recipeFork.findMany({
      where: { parentForkId: parentId, isPublic: true },
      include: {
        user: { select: { name: true, image: true } },
        ratings: { select: { value: true } },
        _count: { select: { children: true } },
      },
    });

    for (const child of children) {
      const avg = child.ratings.length > 0
        ? Math.round((child.ratings.reduce((s: number, r: { value: number }) => s + r.value, 0) / child.ratings.length) * 10) / 10
        : null;

      descendants.push({
        id: child.id,
        name: child.name,
        userName: child.user.name || "Ukjent",
        userImage: child.user.image,
        parentId: child.parentForkId,
        avgRating: avg,
        childCount: child._count.children,
      });

      await traverse(child.id);
    }
  }

  await traverse(forkId);
  return descendants;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const ancestors = await getAncestors(id);
    const descendants = await getDescendants(id);

    // Combine: ancestors (reversed to root first) + descendants
    const allNodes = [...ancestors.reverse(), ...descendants];

    // Deduplicate by id
    const seen = new Set<string>();
    const nodes = allNodes.filter((n) => {
      if (seen.has(n.id)) return false;
      seen.add(n.id);
      return true;
    });

    return NextResponse.json({ nodes, focusId: id });
  } catch (error) {
    console.error("Lineage error:", error);
    return NextResponse.json({ error: "Kunne ikke hente slektstre" }, { status: 500 });
  }
}
