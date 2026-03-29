import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DifficultyBadge } from "./difficulty-badge";
import { Star, Home } from "lucide-react";
import type { Recipe } from "@/lib/types";

export function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <Link href={`/oppskrifter/${recipe.slug.current}`}>
      <Card
        className={`hover:bg-accent transition-colors h-full ${
          recipe.isClassic
            ? "bg-card border-l-4 border-l-yellow-600"
            : "bg-card border-l-4 border-l-primary"
        }`}
      >
        <CardContent className="pt-6">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-bold text-lg">{recipe.name}</h3>
            <div className="flex gap-1 flex-shrink-0">
              {recipe.isClassic ? (
                <Badge variant="outline" className="bg-yellow-900/30 text-yellow-300 border-yellow-700 text-xs">
                  <Star className="h-3 w-3 mr-0.5 fill-yellow-400" />
                  Klassiker
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-primary/20 text-primary border-primary/50 text-xs">
                  <Home className="h-3 w-3 mr-0.5" />
                  Husets
                </Badge>
              )}
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {recipe.style} — {recipe.batchSize}L
          </p>
          {recipe.isClassic && recipe.sourceAuthor && (
            <p className="text-xs text-yellow-400/70 mt-1">
              Inspirert av {recipe.sourceAuthor}
            </p>
          )}
          {recipe.difficulty && (
            <div className="mt-2">
              <DifficultyBadge difficulty={recipe.difficulty} />
            </div>
          )}
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
