import { Card, CardContent } from "@/components/ui/card";

interface GeneratedRecipe {
  name: string;
  style: string;
  description: string;
  difficulty: string;
  batchSize: number;
  estimatedOG: number;
  estimatedFG: number;
  estimatedABV: number;
  estimatedIBU: number;
  estimatedSRM: number;
  grains: { name: string; amount: number; unit: string }[];
  hops: { name: string; amount: number; time: number; alphaAcid: number }[];
  yeast: { name: string; amount: string; type: string };
  additions: { name: string; amount: string; time: number }[];
  process: { step: string; description: string; temp: number; duration: number }[];
  tips?: string;
}

export function RecipeResult({ recipe }: { recipe: GeneratedRecipe }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">{recipe.name}</h2>
        <p className="text-muted-foreground">{recipe.style} — {recipe.batchSize}L</p>
        <p className="mt-2">{recipe.description}</p>
      </div>

      <div className="grid grid-cols-5 gap-3">
        {[
          { label: "OG", value: recipe.estimatedOG },
          { label: "FG", value: recipe.estimatedFG },
          { label: "ABV", value: `${recipe.estimatedABV}%` },
          { label: "IBU", value: recipe.estimatedIBU },
          { label: "SRM", value: recipe.estimatedSRM },
        ].map((stat) => (
          <div key={stat.label} className="bg-background rounded-lg p-3 text-center border border-border">
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className="text-lg font-bold text-primary">{stat.value}</p>
          </div>
        ))}
      </div>

      {recipe.grains.length > 0 && (
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-3">Malt</h3>
            <div className="space-y-2">
              {recipe.grains.map((g, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span>{g.name}</span>
                  <span className="text-primary font-mono">{g.amount} {g.unit}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {recipe.hops.length > 0 && (
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-3">Humle</h3>
            <div className="space-y-2">
              {recipe.hops.map((h, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span>{h.name} <span className="text-muted-foreground">({h.alphaAcid}% AA)</span></span>
                  <span className="text-primary font-mono">{h.amount}g @ {h.time === -1 ? "dry hop" : `${h.time} min`}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {recipe.yeast && (
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-3">Gjær</h3>
            <p className="text-sm">{recipe.yeast.name} — {recipe.yeast.amount} ({recipe.yeast.type})</p>
          </CardContent>
        </Card>
      )}

      {recipe.process.length > 0 && (
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-3">Prosess</h3>
            <div className="space-y-3">
              {recipe.process.map((step, i) => (
                <div key={i} className="flex gap-3">
                  <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-medium text-sm">{step.step} <span className="text-muted-foreground">({step.temp}°C, {step.duration} min)</span></p>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {recipe.tips && (
        <Card className="bg-card border-border border-l-4 border-l-primary">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-2">Tips</h3>
            <p className="text-sm text-muted-foreground">{recipe.tips}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
