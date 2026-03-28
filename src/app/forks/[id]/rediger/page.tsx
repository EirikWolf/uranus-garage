import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ForkEditor } from "./fork-editor";

export const metadata = {
  title: "Rediger fork — Uranus Garage",
};

export default async function EditForkPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/logg-inn");

  const { id } = await params;

  const fork = await prisma.recipeFork.findUnique({
    where: { id },
  });

  if (!fork || fork.userId !== session.user.id) notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Rediger din fork</h1>
      <p className="text-muted-foreground mb-8">
        Gjør endringene dine og beskriv hva du eksperimenterer med.
      </p>
      <ForkEditor fork={JSON.parse(JSON.stringify(fork))} />
    </div>
  );
}
