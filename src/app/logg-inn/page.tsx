import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LoginButtons } from "./login-buttons";

export const metadata = {
  title: "Logg inn — Uranus Garage",
};

export default async function LoginPage() {
  const session = await auth();
  if (session) redirect("/profil");

  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center">
      <h1 className="text-3xl font-bold mb-2">Logg inn</h1>
      <p className="text-muted-foreground mb-8">
        Logg inn for å lagre oppskrifter, forke andres brygg, og dele dine resultater.
      </p>
      <LoginButtons />
    </div>
  );
}
