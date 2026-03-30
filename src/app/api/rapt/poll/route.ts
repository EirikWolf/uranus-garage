import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { scrapeCurrentReadings } from "@/lib/rapt-scraper";

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && request.headers.get("x-cron-secret") !== cronSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const readings = await scrapeCurrentReadings();
    let saved = 0;

    const activeSessions = await prisma.brewSession.findMany({
      where: { isActive: true },
    });

    for (const reading of readings) {
      if (!reading.timestamp) continue;

      const session = activeSessions.find(
        (s) =>
          s.deviceName &&
          s.deviceName.toLowerCase() === reading.deviceName.toLowerCase(),
      );
      if (!session) continue;

      const timestamp = new Date(reading.timestamp);
      if (isNaN(timestamp.getTime())) continue;

      try {
        await prisma.sensorReading.create({
          data: {
            sessionId: session.id,
            timestamp,
            temperature: reading.temperature,
            gravity: reading.gravity,
            pressure: reading.pressure,
            battery: reading.battery,
            rssi: reading.rssi,
          },
        });
        saved++;
      } catch (e: unknown) {
        // Skip duplicate readings (@@unique constraint on sessionId + timestamp)
        if ((e as { code?: string }).code !== "P2002") throw e;
      }
    }

    return NextResponse.json({ saved });
  } catch (error) {
    console.error("RAPT poll error:", error);
    return NextResponse.json({ error: "Poll feilet" }, { status: 500 });
  }
}
