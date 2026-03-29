import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SwapForm } from "./swap-form";

export const metadata = { title: "Ny Brew-Swap — Uranus Garage" };

export default async function NewSwapPage() {
  const session = await auth();
  if (!session) redirect("/logg-inn");

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Ny Brew-Swap</h1>
      <p className="text-muted-foreground mb-8">Planlegg en splittet batch og inviter andre bryggere.</p>
      <SwapForm />
    </div>
  );
}
