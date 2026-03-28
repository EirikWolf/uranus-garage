import { Card, CardContent } from "@/components/ui/card";

interface Grain { name: string; amount: number; unit: string; }
interface Hop { name: string; amount: number; time: number; alphaAcid: number; }

interface DiffProps {
  parentGrains: Grain[];
  parentHops: Hop[];
  parentYeast: { name?: string; amount?: string; type?: string };
  parentBatchSize: number;
  forkGrains: Grain[];
  forkHops: Hop[];
  forkYeast: { name?: string; amount?: string; type?: string };
  forkBatchSize: number;
  changeNotes?: string | null;
}

function GrainDiff({ parent, fork }: { parent: Grain[]; fork: Grain[] }) {
  const parentMap = new Map(parent.map((g) => [g.name, g]));
  const forkMap = new Map(fork.map((g) => [g.name, g]));
  const allNames = new Set([...parentMap.keys(), ...forkMap.keys()]);

  const rows = Array.from(allNames).map((name) => {
    const p = parentMap.get(name);
    const f = forkMap.get(name);

    if (!p && f) return { name, type: "added" as const, fork: f };
    if (p && !f) return { name, type: "removed" as const, parent: p };
    if (p && f && (p.amount !== f.amount || p.unit !== f.unit))
      return { name, type: "changed" as const, parent: p, fork: f };
    return { name, type: "unchanged" as const, parent: p };
  });

  if (rows.every((r) => r.type === "unchanged")) return null;

  return (
    <div className="space-y-1">
      <h4 className="text-sm font-semibold mb-2">Malt</h4>
      {rows.map((row) => (
        <div key={row.name} className={`flex justify-between text-sm px-3 py-1.5 rounded ${
          row.type === "added" ? "bg-green-900/30 text-green-300" :
          row.type === "removed" ? "bg-red-900/30 text-red-300 line-through" :
          row.type === "changed" ? "bg-yellow-900/20 text-yellow-300" :
          "text-muted-foreground"
        }`}>
          <span>
            {row.type === "added" && "+ "}
            {row.type === "removed" && "- "}
            {row.name}
          </span>
          <span className="font-mono">
            {row.type === "changed" && row.parent && row.fork ? (
              <><span className="line-through text-red-400">{row.parent.amount} {row.parent.unit}</span> → <span className="text-green-400">{row.fork.amount} {row.fork.unit}</span></>
            ) : row.type === "added" && row.fork ? (
              `${row.fork.amount} ${row.fork.unit}`
            ) : row.type === "removed" && row.parent ? (
              `${row.parent.amount} ${row.parent.unit}`
            ) : row.parent ? (
              `${row.parent.amount} ${row.parent.unit}`
            ) : null}
          </span>
        </div>
      ))}
    </div>
  );
}

function HopDiff({ parent, fork }: { parent: Hop[]; fork: Hop[] }) {
  const parentMap = new Map(parent.map((h) => [`${h.name}@${h.time}`, h]));
  const forkMap = new Map(fork.map((h) => [`${h.name}@${h.time}`, h]));
  const allKeys = new Set([...parentMap.keys(), ...forkMap.keys()]);

  const rows = Array.from(allKeys).map((key) => {
    const p = parentMap.get(key);
    const f = forkMap.get(key);

    if (!p && f) return { key, type: "added" as const, fork: f };
    if (p && !f) return { key, type: "removed" as const, parent: p };
    if (p && f && p.amount !== f.amount)
      return { key, type: "changed" as const, parent: p, fork: f };
    return { key, type: "unchanged" as const, parent: p };
  });

  if (rows.every((r) => r.type === "unchanged")) return null;

  return (
    <div className="space-y-1">
      <h4 className="text-sm font-semibold mb-2">Humle</h4>
      {rows.map((row) => {
        const hop = row.type === "removed" ? row.parent! : (row.type === "added" ? row.fork! : row.parent!);
        return (
          <div key={row.key} className={`flex justify-between text-sm px-3 py-1.5 rounded ${
            row.type === "added" ? "bg-green-900/30 text-green-300" :
            row.type === "removed" ? "bg-red-900/30 text-red-300 line-through" :
            row.type === "changed" ? "bg-yellow-900/20 text-yellow-300" :
            "text-muted-foreground"
          }`}>
            <span>
              {row.type === "added" && "+ "}
              {row.type === "removed" && "- "}
              {hop.name} @ {hop.time === -1 ? "dry hop" : `${hop.time} min`}
            </span>
            <span className="font-mono">
              {row.type === "changed" && row.parent && row.fork ? (
                <><span className="line-through text-red-400">{row.parent.amount}g</span> → <span className="text-green-400">{row.fork.amount}g</span></>
              ) : row.type === "added" && row.fork ? (
                `${row.fork.amount}g`
              ) : row.type === "removed" && row.parent ? (
                `${row.parent.amount}g`
              ) : row.parent ? (
                `${row.parent.amount}g`
              ) : null}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function RecipeDiff({
  parentGrains, parentHops, parentYeast, parentBatchSize,
  forkGrains, forkHops, forkYeast, forkBatchSize,
  changeNotes,
}: DiffProps) {
  const batchChanged = parentBatchSize !== forkBatchSize;
  const yeastChanged = parentYeast?.name !== forkYeast?.name;

  const grainDiff = GrainDiff({ parent: parentGrains, fork: forkGrains });
  const hopDiff = HopDiff({ parent: parentHops, fork: forkHops });

  const hasChanges = grainDiff || hopDiff || batchChanged || yeastChanged;

  if (!hasChanges && !changeNotes) {
    return <p className="text-sm text-muted-foreground">Ingen endringer fra originalen.</p>;
  }

  return (
    <Card className="bg-card border-border">
      <CardContent className="pt-6 space-y-4">
        <h3 className="font-semibold">Endringer fra original</h3>

        {changeNotes && (
          <p className="text-sm italic text-muted-foreground border-l-2 border-primary pl-3">
            &ldquo;{changeNotes}&rdquo;
          </p>
        )}

        {batchChanged && (
          <div className="text-sm px-3 py-1.5 rounded bg-yellow-900/20 text-yellow-300">
            Batchstørrelse: <span className="line-through text-red-400">{parentBatchSize}L</span> → <span className="text-green-400">{forkBatchSize}L</span>
          </div>
        )}

        {grainDiff}
        {hopDiff}

        {yeastChanged && (
          <div className="space-y-1">
            <h4 className="text-sm font-semibold mb-2">Gjær</h4>
            <div className="text-sm px-3 py-1.5 rounded bg-yellow-900/20 text-yellow-300">
              <span className="line-through text-red-400">{parentYeast?.name || "Ingen"}</span> → <span className="text-green-400">{forkYeast?.name || "Ingen"}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
