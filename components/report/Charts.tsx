"use client";

import {
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { JournalEntry } from "@/lib/types";

// ── Shared config ────────────────────────────────────────────────────
const GRID = { stroke: "rgba(255,255,255,0.04)" };
const AXIS = { stroke: "rgba(255,255,255,0.1)", fontSize: 11, fill: "#71717a" };
const tooltipStyle = {
  contentStyle: { backgroundColor: "#18181b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 12, color: "#fff" },
  itemStyle: { color: "#a78bfa" },
  cursor: { stroke: "rgba(255,255,255,0.1)" },
};

// ── Transform helpers ────────────────────────────────────────────────
function buildTrendData(entries: JournalEntry[]) {
  return [...entries]
    .filter((e) => e.ai_analysis)
    .reverse()
    .slice(-7)
    .map((e, i) => {
      const a = e.ai_analysis!;
      const d = new Date(e.created_at);
      return {
        name: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        wellness: a.positivityScore,
        burnout: a.burnoutRisk,
        positivity: a.positivityScore,
        index: i,
      };
    });
}

function buildMoodDistribution(entries: JournalEntry[]) {
  const toneMap: Record<string, number> = {};
  entries.forEach((e) => {
    const tone = e.ai_analysis?.emotionalTone ?? "Neutral";
    toneMap[tone] = (toneMap[tone] || 0) + 1;
  });
  const COLORS = ["#a78bfa", "#60a5fa", "#34d399", "#fbbf24", "#f87171", "#fb923c", "#818cf8"];
  return Object.entries(toneMap).map(([name, value], i) => ({
    name,
    value,
    color: COLORS[i % COLORS.length],
  }));
}

// ── Empty state ──────────────────────────────────────────────────────
function EmptyChart({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center h-48">
      <p className="text-sm text-zinc-500">{message}</p>
    </div>
  );
}

// ── A. Wellness Score Trend ──────────────────────────────────────────
export function WellnessTrendChart({ entries }: { entries: JournalEntry[] }) {
  const data = buildTrendData(entries);
  return (
    <Card className="rounded-3xl border-white/10 bg-white/[0.03] backdrop-blur-md">
      <CardHeader>
        <CardTitle className="text-white text-base">Wellness Score Trend</CardTitle>
        <CardDescription className="text-zinc-500">Last {data.length || 7} journal entries</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length < 2 ? (
          <EmptyChart message="Write 2+ journal entries to see trends" />
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data}>
              <CartesianGrid {...GRID} />
              <XAxis dataKey="name" {...AXIS} />
              <YAxis domain={[0, 100]} {...AXIS} />
              <Tooltip {...tooltipStyle} />
              <Line
                type="monotone"
                dataKey="wellness"
                stroke="#a78bfa"
                strokeWidth={2.5}
                dot={{ r: 4, fill: "#a78bfa", stroke: "#18181b", strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}

// ── B. Burnout Risk Trend ────────────────────────────────────────────
export function BurnoutTrendChart({ entries }: { entries: JournalEntry[] }) {
  const data = buildTrendData(entries);
  return (
    <Card className="rounded-3xl border-white/10 bg-white/[0.03] backdrop-blur-md">
      <CardHeader>
        <CardTitle className="text-white text-base">Burnout Risk Trend</CardTitle>
        <CardDescription className="text-zinc-500">Track your burnout risk over time</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length < 2 ? (
          <EmptyChart message="Write 2+ journal entries to see trends" />
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="burnoutGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f87171" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid {...GRID} />
              <XAxis dataKey="name" {...AXIS} />
              <YAxis domain={[0, 100]} {...AXIS} />
              <Tooltip {...tooltipStyle} />
              <Area
                type="monotone"
                dataKey="burnout"
                stroke="#f87171"
                strokeWidth={2.5}
                fill="url(#burnoutGradient)"
                dot={{ r: 4, fill: "#f87171", stroke: "#18181b", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}

// ── C. Positivity Trend ──────────────────────────────────────────────
export function PositivityTrendChart({ entries }: { entries: JournalEntry[] }) {
  const data = buildTrendData(entries);
  return (
    <Card className="rounded-3xl border-white/10 bg-white/[0.03] backdrop-blur-md">
      <CardHeader>
        <CardTitle className="text-white text-base">Positivity Trend</CardTitle>
        <CardDescription className="text-zinc-500">How your positivity changes over time</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length < 2 ? (
          <EmptyChart message="Write 2+ journal entries to see trends" />
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="positivityGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#34d399" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid {...GRID} />
              <XAxis dataKey="name" {...AXIS} />
              <YAxis domain={[0, 100]} {...AXIS} />
              <Tooltip {...tooltipStyle} />
              <Area
                type="monotone"
                dataKey="positivity"
                stroke="#34d399"
                strokeWidth={2.5}
                fill="url(#positivityGradient)"
                dot={{ r: 4, fill: "#34d399", stroke: "#18181b", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}

// ── D. Mood Distribution ─────────────────────────────────────────────
export function MoodDistributionChart({ entries }: { entries: JournalEntry[] }) {
  const data = buildMoodDistribution(entries);
  return (
    <Card className="rounded-3xl border-white/10 bg-white/[0.03] backdrop-blur-md">
      <CardHeader>
        <CardTitle className="text-white text-base">Mood Distribution</CardTitle>
        <CardDescription className="text-zinc-500">Emotional tone breakdown</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <EmptyChart message="No mood data yet" />
        ) : (
          <div className="flex flex-col md:flex-row items-center gap-6">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                  animationBegin={200}
                  animationDuration={800}
                >
                  {data.map((entry, i) => (
                    <Cell key={i} fill={entry.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip {...tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-3 justify-center">
              {data.map((d) => (
                <div key={d.name} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-xs text-zinc-400">{d.name} ({d.value})</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
