import { NextResponse } from "next/server";
import { newsletterSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = newsletterSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Ugyldig data" },
        { status: 400 },
      );
    }
    const { email } = parsed.data;

    // Resend integration will be added when API key is configured
    console.log(`Newsletter signup: ${email}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Newsletter signup error:", error);
    return NextResponse.json({ error: "Kunne ikke registrere e-post" }, { status: 500 });
  }
}
