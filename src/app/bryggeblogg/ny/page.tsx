import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { BrewPostForm } from "@/components/brew-post-form";

export const metadata = {
  title: "Nytt bryggeblogg-innlegg — Uranus Garage",
};

export default async function NewBrewPostPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/logg-inn");
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Del en bryggedag</h1>
      <p className="text-muted-foreground mb-8">
        Skriv om dagens brygging, last opp bilder og del med fellesskapet.
      </p>
      <BrewPostForm />
    </div>
  );
}
