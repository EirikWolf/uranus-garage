interface SensoryResultProps {
  analysis: string;
}

export function SensoryResult({ analysis }: SensoryResultProps) {
  const sections = analysis.split("\n").map((line, i) => {
    if (line.startsWith("## ")) {
      return <h2 key={i} className="text-xl font-bold mt-6 mb-2 text-primary">{line.replace("## ", "")}</h2>;
    }
    if (line.startsWith("**") && line.endsWith("**")) {
      return <p key={i} className="font-semibold mt-4 mb-1">{line.replace(/\*\*/g, "")}</p>;
    }
    if (line.startsWith("- ") || line.startsWith("* ")) {
      return <li key={i} className="ml-4 text-sm text-muted-foreground">{line.replace(/^[-*] /, "")}</li>;
    }
    if (line.match(/^\d+\. /)) {
      return <li key={i} className="ml-4 text-sm list-decimal">{line.replace(/^\d+\. /, "")}</li>;
    }
    if (line.trim() === "") {
      return <br key={i} />;
    }
    return <p key={i} className="text-sm leading-relaxed">{line}</p>;
  });

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      {sections}
    </div>
  );
}
