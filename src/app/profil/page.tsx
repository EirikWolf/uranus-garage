import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "Min profil — Uranus Garage",
};

export default async function ProfilePage() {
  const session = await auth();
  if (!session) redirect("/logg-inn");

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Min profil</h1>

      <Card className="bg-card border-border mb-8">
        <CardContent className="pt-6 flex items-center gap-6">
          {session.user?.image && (
            <Image
              src={session.user.image}
              alt={session.user.name || "Profil"}
              width={80}
              height={80}
              className="rounded-full"
            />
          )}
          <div>
            <h2 className="text-xl font-bold">{session.user?.name}</h2>
            <p className="text-muted-foreground">{session.user?.email}</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-2">Mine oppskrifter</h3>
            <p className="text-sm text-muted-foreground">
              Du har ingen lagrede oppskrifter ennå.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Bruk AI-oppskriftsgeneratoren eller fork en eksisterende oppskrift for å komme i gang.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-2">Mine forks</h3>
            <p className="text-sm text-muted-foreground">
              Du har ingen forks ennå.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Gå til en oppskrift og klikk &quot;Fork This Brew&quot; for å lage din versjon.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
