import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { urlFor } from "../../sanity/lib/client";
import type { BrewLog } from "@/lib/types";

export function BrewLogCard({ log }: { log: BrewLog }) {
  return (
    <Link href={`/bryggelogg/${log.slug.current}`}>
      <Card className="bg-card hover:bg-accent transition-colors overflow-hidden">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            {log.beer?.image && (
              <Image
                src={urlFor(log.beer.image).width(80).height(80).url()}
                alt={log.beer.name}
                width={80}
                height={80}
                className="rounded-lg object-cover flex-shrink-0"
              />
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg">{log.title}</h3>
              <p className="text-sm text-muted-foreground">{log.date}</p>
              {log.beer && (
                <p className="text-sm text-primary mt-1">{log.beer.name}</p>
              )}
              {log.brewers && log.brewers.length > 0 && (
                <p className="text-xs text-muted-foreground mt-2">
                  Bryggere: {log.brewers.map((b) => b.name).join(", ")}
                </p>
              )}
              {(log.og || log.fg) && (
                <p className="text-xs text-muted-foreground mt-1">
                  {log.og && `OG: ${log.og}`}
                  {log.og && log.fg && " | "}
                  {log.fg && `FG: ${log.fg}`}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
