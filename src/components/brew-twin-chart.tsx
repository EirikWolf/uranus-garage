"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import type { SimulationPoint } from "@/lib/types";

const PHASE_COLORS: Record<string, string> = {
  lag: "#888",
  aktiv: "#5aaa5a",
  nedbremsing: "#e0a030",
  ettermodning: "#4a90d9",
};

const PHASE_LABELS: Record<string, string> = {
  lag: "Lagfase",
  aktiv: "Aktiv gjæring",
  nedbremsing: "Nedbremsing",
  ettermodning: "Ettermodning",
};

interface BrewTwinChartProps {
  curve: SimulationPoint[];
  predictedFg: number;
}

export function BrewTwinChart({ curve, predictedFg }: BrewTwinChartProps) {
  // Sample every 6 hours to keep chart clean
  const data = curve
    .filter((p) => p.hoursSinceStart % 6 === 0)
    .map((p) => ({
      dag: `Dag ${Math.floor(p.hoursSinceStart / 24)}${p.hoursSinceStart % 24 !== 0 ? `+${p.hoursSinceStart % 24}t` : ""}`,
      timer: p.hoursSinceStart,
      gravity: p.gravity,
      fase: p.phase,
    }));

  // Find phase transition points for reference lines
  const transitions: { hour: number; phase: string }[] = [];
  for (let i = 1; i < curve.length; i++) {
    if (curve[i].phase !== curve[i - 1].phase) {
      transitions.push({ hour: curve[i].hoursSinceStart, phase: curve[i].phase });
    }
  }

  const CustomDot = (props: { cx?: number; cy?: number; payload?: { fase: string } }) => {
    const { cx, cy, payload } = props;
    if (!cx || !cy || !payload) return null;
    return <circle cx={cx} cy={cy} r={3} fill={PHASE_COLORS[payload.fase] ?? "#888"} />;
  };

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { payload: { timer: number; gravity: number; fase: string } }[] }) => {
    if (!active || !payload?.length) return null;
    const p = payload[0].payload;
    return (
      <div className="bg-card border border-border rounded-lg px-3 py-2 text-sm shadow-lg">
        <p className="text-muted-foreground">{Math.floor(p.timer / 24)}d {p.timer % 24}t</p>
        <p className="font-mono font-bold">SG {p.gravity.toFixed(4)}</p>
        <p style={{ color: PHASE_COLORS[p.fase] }}>{PHASE_LABELS[p.fase]}</p>
      </div>
    );
  };

  return (
    <Card className="bg-card border-border">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Fermentasjonskurve</h3>
          <div className="flex gap-3 flex-wrap">
            {Object.entries(PHASE_LABELS).map(([key, label]) => (
              <span key={key} className="flex items-center gap-1 text-xs text-muted-foreground">
                <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: PHASE_COLORS[key] }} />
                {label}
              </span>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={data} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis
              dataKey="dag"
              stroke="#666"
              tick={{ fontSize: 11 }}
              interval={Math.floor(data.length / 7)}
            />
            <YAxis
              stroke="#666"
              tick={{ fontSize: 11 }}
              domain={["auto", "auto"]}
              tickFormatter={(v: number) => v.toFixed(3)}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine
              y={predictedFg}
              stroke="#4a90d9"
              strokeDasharray="6 3"
              label={{ value: `FG ${predictedFg.toFixed(3)}`, fill: "#4a90d9", fontSize: 11, position: "right" }}
            />
            {transitions.map((t) => {
              const point = data.find((d) => d.timer >= t.hour);
              if (!point) return null;
              return (
                <ReferenceLine
                  key={t.hour}
                  x={point.dag}
                  stroke={PHASE_COLORS[t.phase]}
                  strokeDasharray="3 3"
                  strokeOpacity={0.5}
                />
              );
            })}
            <Line
              type="monotone"
              dataKey="gravity"
              stroke="#9b6bc7"
              strokeWidth={2.5}
              dot={<CustomDot />}
              activeDot={{ r: 5 }}
              name="Gravity"
            />
            <Legend
              formatter={() => "SG over tid"}
              wrapperStyle={{ fontSize: 12, color: "#999" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
