import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ListingForm } from "./listing-form";

export const metadata = { title: "Ny annonse — Uranus Garage" };

export default async function NewListingPage() {
  const session = await auth();
  if (!session) redirect("/logg-inn");

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Ny annonse</h1>
      <p className="text-muted-foreground mb-8">Legg ut utstyr du vil selge, kjøpe, eller bytte.</p>
      <ListingForm />
    </div>
  );
}
