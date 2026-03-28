import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { email } = await request.json();

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  // Resend integration will be added when API key is configured
  console.log(`Newsletter signup: ${email}`);

  return NextResponse.json({ success: true });
}
