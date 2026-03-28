import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { DifficultyBadge } from "./difficulty-badge";
import { urlFor } from "../../sanity/lib/client";
import type { Beer } from "@/lib/types";

export function BeerCard({ beer }: { beer: Beer }) {
  return (
    <Link href={`/ol/${beer.slug.current}`}>
      <Card className="bg-card hover:bg-accent transition-colors h-full overflow-hidden">
        {beer.image && (
          <div className="h-48 overflow-hidden">
            <Image
              src={urlFor(beer.image).width(400).height(300).url()}
              alt={beer.name}
              width={400}
              height={300}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <CardContent className="pt-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-lg">{beer.name}</h3>
            {beer.difficulty && <DifficultyBadge difficulty={beer.difficulty} />}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {beer.style}
            {beer.abv ? ` — ${beer.abv}%` : ""}
          </p>
          {beer.flavorTags && beer.flavorTags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {beer.flavorTags.map((tag) => (
                <span key={tag} className="text-xs bg-secondary px-2 py-0.5 rounded">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
