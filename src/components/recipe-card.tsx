import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { DifficultyBadge } from "./difficulty-badge";
import type { Recipe } from "@/lib/types";

export function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <Link href={`/oppskrifter/${recipe.slug.current}`}>
      <Card className="bg-card hover:bg-accent transition-colors h-full">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-lg">{recipe.name}</h3>
            {recipe.difficulty && (
              <DifficultyBadge difficulty={recipe.difficulty} />
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {recipe.style} — {recipe.batchSize}L
          </p>
          {recipe.description && (
            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
              {recipe.description}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
