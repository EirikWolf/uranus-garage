"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import type { Measurement } from "@/lib/types";

interface BrewLabChartProps {
  measurements: Measurement[];
}

export function BrewLabChart({ measurements }: BrewLabChartProps) {
  const tempData = measurements
    .filter((m) => m.type === "temperature")
    .map((m) => ({
      time: new Date(m.timestamp).toLocaleString("no", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      value: m.value,
    }));

  const gravityData = measurements
    .filter((m) => m.type === "gravity")
    .map((m) => ({
      time: new Date(m.timestamp).toLocaleString("no", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      value: m.value,
    }));

  const phData = measurements
    .filter((m) => m.type === "ph")
    .map((m) => ({
      time: new Date(m.timestamp).toLocaleString("no", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      value: m.value,
    }));

  if (measurements.length === 0) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="pt-6 text-center text-muted-foreground">
          <p>Ingen målinger registrert ennå.</p>
          <p className="text-sm mt-2">Koble til RAPT-hydrometeret eller legg inn data manuelt i Sanity Studio.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {tempData.length > 0 && (
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-4">Temperatur (°C)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={tempData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="time" stroke="#999" tick={{ fontSize: 12 }} />
                <YAxis stroke="#999" tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#2d2d2d",
                    border: "1px solid #444",
                    borderRadius: 8,
                    color: "#f5f5f5",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#dd3333"
                  strokeWidth={2}
                  dot={{ fill: "#dd3333", r: 3 }}
                  name="Temperatur"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {gravityData.length > 0 && (
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-4">Gravity (SG)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={gravityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="time" stroke="#999" tick={{ fontSize: 12 }} />
                <YAxis stroke="#999" tick={{ fontSize: 12 }} domain={["auto", "auto"]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#2d2d2d",
                    border: "1px solid #444",
                    borderRadius: 8,
                    color: "#f5f5f5",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#4a90d9"
                  strokeWidth={2}
                  dot={{ fill: "#4a90d9", r: 3 }}
                  name="Gravity"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {phData.length > 0 && (
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-4">pH</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={phData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="time" stroke="#999" tick={{ fontSize: 12 }} />
                <YAxis stroke="#999" tick={{ fontSize: 12 }} domain={[3, 7]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#2d2d2d",
                    border: "1px solid #444",
                    borderRadius: 8,
                    color: "#f5f5f5",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#5aaa5a"
                  strokeWidth={2}
                  dot={{ fill: "#5aaa5a", r: 3 }}
                  name="pH"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
