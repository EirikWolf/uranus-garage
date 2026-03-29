// Validates required environment variables at import time.
// Import this in layout.tsx to catch missing vars early.

const required = [
  "NEXT_PUBLIC_SANITY_PROJECT_ID",
  "NEXT_PUBLIC_SANITY_DATASET",
  "DATABASE_URL",
] as const;

const optional = [
  "GEMINI_API_KEY",
  "SANITY_API_TOKEN",
  "NEXTAUTH_SECRET",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "GITHUB_CLIENT_ID",
  "GITHUB_CLIENT_SECRET",
  "RAPT_API_TOKEN",
  "RESEND_API_KEY",
] as const;

const missing = required.filter((key) => !process.env[key]);

if (missing.length > 0 && process.env.NODE_ENV !== "test") {
  const message = `[Uranus Garage] Missing required environment variables:\n${missing.map((k) => `  - ${k}`).join("\n")}\n\nAdd them to .env.local (local) or Vercel environment variables (production).`;
  if (process.env.NODE_ENV === "production") {
    throw new Error(message);
  }
  console.error(`\n${message}\n`);
}

// Log optional vars status in development
if (process.env.NODE_ENV === "development") {
  const missingOptional = optional.filter((key) => !process.env[key]);
  if (missingOptional.length > 0) {
    console.warn(
      `[Uranus Garage] Optional env vars not set (some features disabled): ${missingOptional.join(", ")}`,
    );
  }
}
