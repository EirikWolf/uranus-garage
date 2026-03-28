import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Timeline } from "@/components/timeline";
import { getAllBrewers } from "@/lib/sanity";
import { urlFor } from "../../../sanity/lib/client";

export const revalidate = 60;

export const metadata = {
  title: "Om oss — Uranus Garage",
  description: "Historien bak Uranus Garage — bryggerne og garasjen.",
};

export default async function AboutPage() {
  const brewers = await getAllBrewers();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Om Uranus Garage</h1>
      <p className="text-lg text-muted-foreground mb-12">
        Great beer and no cars!
      </p>

      <section className="mb-16">
        <p className="leading-relaxed mb-4">
          Uranus Garage er et hjemmebryggeri som holder til i en helt vanlig
          garasje. Her brygger vi øl fordi vi elsker det — fra enkle kit-brygg
          til avanserte eksperimenter med vannjustering og trykkfermentering.
        </p>
        <p className="leading-relaxed">
          Vi dokumenterer alt vi gjør, deler oppskriftene våre åpent, og
          inviterer gjerne til smakskvelder. Velkommen inn i garasjen.
        </p>
      </section>

      {brewers.length > 0 && (
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Bryggerne</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {brewers.map((brewer) => (
              <Card key={brewer._id} className="bg-card">
                <CardContent className="pt-6 flex items-start gap-4">
                  {brewer.image && (
                    <Image
                      src={urlFor(brewer.image).width(80).height(80).url()}
                      alt={brewer.name}
                      width={80}
                      height={80}
                      className="rounded-full flex-shrink-0"
                    />
                  )}
                  <div>
                    <h3 className="font-bold">{brewer.name}</h3>
                    {brewer.role && (
                      <p className="text-sm text-primary">{brewer.role}</p>
                    )}
                    {brewer.bio && (
                      <p className="text-sm text-muted-foreground mt-2">
                        {brewer.bio}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-2xl font-bold mb-6">Vår historie</h2>
        <Timeline />
      </section>
    </div>
  );
}
