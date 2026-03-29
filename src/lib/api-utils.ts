import { NextResponse } from "next/server";
import { auth } from "./auth";

type AuthenticatedHandler = (
  request: Request,
  context: { userId: string; params?: Promise<Record<string, string>> },
) => Promise<NextResponse>;

export function withAuth(handler: AuthenticatedHandler) {
  return async (request: Request, routeContext?: { params?: Promise<Record<string, string>> }) => {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Ikke innlogget" }, { status: 401 });
    }
    return handler(request, {
      userId: session.user.id,
      params: routeContext?.params,
    });
  };
}

export function paginationParams(request: Request, defaultLimit = 20, maxLimit = 50) {
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(maxLimit, Math.max(1, parseInt(searchParams.get("limit") || String(defaultLimit))));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

export function paginationMeta(page: number, limit: number, total: number) {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
}
