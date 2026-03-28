import { Badge } from "@/components/ui/badge";
import type { Difficulty } from "@/lib/types";

const difficultyConfig: Record<
  Difficulty,
  { label: string; className: string }
> = {
  nybegynner: {
    label: "Nybegynner",
    className: "bg-green-900/50 text-green-300 border-green-700",
  },
  middels: {
    label: "Middels",
    className: "bg-yellow-900/50 text-yellow-300 border-yellow-700",
  },
  avansert: {
    label: "Avansert",
    className: "bg-red-900/50 text-red-300 border-red-700",
  },
};

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  const config = difficultyConfig[difficulty];
  if (!config) return null;

  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
}
