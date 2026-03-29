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

const MAX_DEPTH = 50;
const MAX_NODES = 500;

interface RawTreeRow {
  id: string;
  name: string;
  user_name: string | null;
  user_image: string | null;
  parent_fork_id: string | null;
  avg_rating: number | null;
  child_count: bigint;
  depth: number;
}

async function getLineageTree(forkId: string): Promise<TreeNode[]> {
  // Single recursive CTE that walks both up (ancestors) and down (descendants)
  const rows = await prisma.$queryRaw<RawTreeRow[]>`
    WITH RECURSIVE
      -- Walk up to find ancestors
      ancestors AS (
        SELECT rf.id, rf.name, rf."parentForkId", rf."userId", 0 AS depth
        FROM "RecipeFork" rf WHERE rf.id = ${forkId}
        UNION ALL
        SELECT rf.id, rf.name, rf."parentForkId", rf."userId", a.depth + 1
        FROM "RecipeFork" rf
        JOIN ancestors a ON rf.id = a."parentForkId"
        WHERE a.depth < ${MAX_DEPTH}
      ),
      -- Walk down to find descendants
      descendants AS (
        SELECT rf.id, rf.name, rf."parentForkId", rf."userId", 0 AS depth
        FROM "RecipeFork" rf WHERE rf.id = ${forkId}
        UNION ALL
        SELECT rf.id, rf.name, rf."parentForkId", rf."userId", d.depth + 1
        FROM "RecipeFork" rf
        JOIN descendants d ON rf."parentForkId" = d.id
        WHERE d.depth < ${MAX_DEPTH} AND rf."isPublic" = true
      ),
      -- Combine and deduplicate
      all_nodes AS (
        SELECT DISTINCT id, name, "parentForkId", "userId" FROM ancestors
        UNION
        SELECT DISTINCT id, name, "parentForkId", "userId" FROM descendants
      )
    SELECT
      n.id,
      n.name,
      u.name AS user_name,
      u.image AS user_image,
      n."parentForkId" AS parent_fork_id,
      ROUND(AVG(r.value)::numeric, 1) AS avg_rating,
      (SELECT COUNT(*) FROM "RecipeFork" c WHERE c."parentForkId" = n.id) AS child_count,
      0 AS depth
    FROM all_nodes n
    LEFT JOIN "User" u ON u.id = n."userId"
    LEFT JOIN "Rating" r ON r."forkId" = n.id
    GROUP BY n.id, n.name, n."parentForkId", u.name, u.image
    LIMIT ${MAX_NODES}
  `;

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    userName: row.user_name || "Ukjent",
    userImage: row.user_image,
    parentId: row.parent_fork_id,
    avgRating: row.avg_rating ? Number(row.avg_rating) : null,
    childCount: Number(row.child_count),
  }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const nodes = await getLineageTree(id);
    return NextResponse.json({ nodes, focusId: id });
  } catch (error) {
    console.error("Lineage error:", error);
    return NextResponse.json({ error: "Kunne ikke hente slektstre" }, { status: 500 });
  }
}
