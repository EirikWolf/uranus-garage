"use client";

import { Badge } from "@/components/ui/badge";
import type { Difficulty } from "@/lib/types";
import { useTranslations } from "next-intl";

const difficultyClassName: Record<Difficulty, string> = {
  nybegynner: "bg-green-900/50 text-green-300 border-green-700",
  middels: "bg-yellow-900/50 text-yellow-300 border-yellow-700",
  avansert: "bg-red-900/50 text-red-300 border-red-700",
};

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  const t = useTranslations("recipes.difficulty");
  const className = difficultyClassName[difficulty];
  if (!className) return null;

  return (
    <Badge variant="outline" className={className}>
      {t(difficulty)}
    </Badge>
  );
}
