import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { BrewTwinForm } from "@/components/brew-twin-form";

export const metadata = {
  title: "Ny simulering — Brew Twin",
};

export default async function NySimuleringPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/brew-twin");

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <header className="mb-8">
        <p className="text-xs text-primary font-bold tracking-wider uppercase mb-2">
          <Link href="/brew-twin" className="hover:underline">Brew Twin</Link>
        </p>
        <h1 className="text-3xl font-bold">Ny simulering</h1>
        <p className="text-muted-foreground mt-2">
          Sett inn gjær, OG og temperatur — modellen beregner fermentasjonskurven og flagger smaksrisiko.
        </p>
      </header>
      <BrewTwinForm />
    </div>
  );
}
