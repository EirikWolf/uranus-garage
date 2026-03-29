import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// RAPT Cloud API proxy
// When configured, this route fetches telemetry data from RAPT hydrometers
// and can store it in Sanity as brewLabEntry documents.
//
// RAPT API docs: https://api.rapt.io/docs (requires KegLand account)
// The user needs to set RAPT_API_TOKEN in .env.local

const RAPT_API_BASE = "https://api.rapt.io/api";

interface RaptTelemetry {
  timestamp: string;
  temperature: number;
  gravity: number;
  battery: number;
}

export async function GET(request: Request) {
  const token = process.env.RAPT_API_TOKEN;

  if (!token) {
    return NextResponse.json(
      {
        error: "RAPT API not configured",
        message: "Set RAPT_API_TOKEN in .env.local to enable RAPT integration.",
        docs: "https://api.rapt.io/docs",
      },
      { status: 503 },
    );
  }

  const { searchParams } = new URL(request.url);
  const hydrometerId = searchParams.get("hydrometerId");

  if (!hydrometerId) {
    return NextResponse.json(
      { error: "Missing hydrometerId query parameter" },
      { status: 400 },
    );
  }

  try {
    // Fetch telemetry from RAPT Cloud API
    const response = await fetch(
      `${RAPT_API_BASE}/Hydrometers/GetTelemetry/${hydrometerId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("RAPT API error:", response.status, errorText);
      return NextResponse.json(
        { error: "Failed to fetch from RAPT API", status: response.status },
        { status: response.status },
      );
    }

    const data: RaptTelemetry[] = await response.json();

    // Transform to our measurement format
    const measurements = data.map((entry) => ({
      timestamp: entry.timestamp,
      temperature: entry.temperature,
      gravity: entry.gravity,
    }));

    return NextResponse.json({ measurements });
  } catch (error) {
    console.error("RAPT sync error:", error);
    return NextResponse.json(
      { error: "Failed to sync with RAPT" },
      { status: 500 },
    );
  }
}

// POST endpoint to manually add measurements (for non-RAPT users)
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Ikke innlogget" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { measurements } = body;

    if (!measurements || !Array.isArray(measurements)) {
      return NextResponse.json(
        { error: "Missing measurements array" },
        { status: 400 },
      );
    }

    // Validate measurement format
    for (const m of measurements) {
      if (!m.timestamp || !m.type || m.value === undefined) {
        return NextResponse.json(
          { error: "Each measurement needs timestamp, type, and value" },
          { status: 400 },
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: "Measurements received. Store in Sanity via Studio or API.",
      count: measurements.length,
    });
  } catch (error) {
    console.error("Measurement POST error:", error);
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }
}
