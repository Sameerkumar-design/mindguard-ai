"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Brain,
  Activity,
  TrendingUp,
  Calendar,
  Bell,
  Settings,
  ChevronRight,
  Flame,
  Moon,
  Heart,
  Sparkles,
  BarChart3,
  LogOut,
  ShieldCheck,
  Lightbulb,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import { logout } from "@/app/actions/auth";
import type { JournalEntry, MoodAnalysis } from "@/lib/types";
import { ScoreRing } from "@/components/dashboard/ScoreRing";
import { AiInsightCard } from "@/components/dashboard/AiInsightCard";
import { JournalPanel } from "@/components/dashboard/JournalPanel";

// ── animation helpers ────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.45 },
  }),
};

// ── fallback data (used when no AI analysis exists yet) ──────────────
const DEFAULT_STATS = [
  {
    label: "Stress Level",
    value: "—",
    icon: Flame,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
  {
    label: "Burnout Risk",
    value: "—",
    icon: Moon,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
  {
    label: "Mood",
    value: "—",
    icon: Heart,
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
  },
  {
    label: "Positivity",
    value: "—",
    icon: Sparkles,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
  },
];

function buildStats(a: MoodAnalysis | null) {
  if (!a) return DEFAULT_STATS;
  return [
    { ...DEFAULT_STATS[0], value: a.stressLevel },
    { ...DEFAULT_STATS[1], value: `${a.burnoutRisk}%` },
    { ...DEFAULT_STATS[2], value: a.emotionalTone },
    { ...DEFAULT_STATS[3], value: `${a.positivityScore}%` },
  ];
}

function getWellnessLabel(score: number) {
  if (score >= 75) return { text: "good", gradient: "from-emerald-400 to-green-300" };
  if (score >= 50) return { text: "moderate", gradient: "from-amber-400 to-yellow-300" };
  return { text: "needs attention", gradient: "from-red-400 to-orange-300" };
}

// ── main dashboard ───────────────────────────────────────────────────
export default function DashboardPage() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [latestAnalysis, setLatestAnalysis] = useState<MoodAnalysis | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user + journal entries on mount
  useEffect(() => {
    async function init() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setUserEmail(user?.email ?? null);

      try {
        const res = await fetch("/api/journal");
        const data = await res.json();
        if (data.success && data.entries) {
          setEntries(data.entries);
          const withAnalysis = data.entries.find(
            (e: JournalEntry) => e.ai_analysis
          );
          if (withAnalysis) setLatestAnalysis(withAnalysis.ai_analysis);
        }
      } catch (err) {
        console.error("Failed to fetch entries:", err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  const handleNewEntry = useCallback((entry: JournalEntry) => {
    setEntries((prev) => [entry, ...prev]);
  }, []);

  const handleAnalysisUpdate = useCallback((analysis: MoodAnalysis) => {
    setLatestAnalysis(analysis);
  }, []);

  async function handleLogout() {
    setLoggingOut(true);
    await logout();
  }

  const wellnessScore = latestAnalysis ? latestAnalysis.positivityScore : 72;
  const wellnessInfo = getWellnessLabel(wellnessScore);
  const quickStats = buildStats(latestAnalysis);

  // Build insight cards from AI analysis
  const insightCards = latestAnalysis
    ? [
        ...(latestAnalysis.wellnessInsights || []).map((insight, i) => ({
          title: i === 0 ? "Behavioral Observation" : `Insight ${i + 1}`,
          description: insight,
          time: "Just now",
          icon: i === 0 ? Calendar : i === 1 ? Moon : TrendingUp,
          color: i === 0 ? "text-amber-400" : i === 1 ? "text-blue-400" : "text-emerald-400",
        })),
      ]
    : [
        {
          title: "Write your first entry",
          description: "Journal about your day to receive AI-powered wellness insights.",
          time: "—",
          icon: Lightbulb,
          color: "text-purple-400",
        },
      ];

  return (
    <div className="min-h-screen bg-black pt-24 pb-16">
      {/* Background decorations */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-purple-900/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-blue-900/8 blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        {/* ── Header Row ─────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-white">
              Good morning{userEmail ? `, ${userEmail.split("@")[0]}` : ""} 👋
            </h1>
            <p className="text-zinc-400 mt-1">
              Here&apos;s your wellness overview for today.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" className="rounded-xl border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10 cursor-pointer">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-xl border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10 cursor-pointer">
              <Settings className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              onClick={handleLogout}
              disabled={loggingOut}
              className="rounded-xl border-white/10 bg-white/5 text-zinc-300 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30 cursor-pointer gap-2"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </motion.div>

        {/* ── Top Row: Welcome + Burnout Risk ────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Welcome card */}
          <motion.div custom={0} variants={fadeUp} initial="hidden" animate="show" className="lg:col-span-2">
            <Card className="rounded-3xl border-white/10 bg-white/[0.03] backdrop-blur-md overflow-hidden">
              <div className="relative p-6 md:p-8">
                <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-purple-600/10 blur-3xl pointer-events-none" />
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6 relative z-10">
                  <div className="flex-1">
                    <Badge className="mb-4 bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20">
                      <Activity className="h-3 w-3 mr-1" /> Status: Active
                    </Badge>
                    <h2 className="text-xl font-semibold text-white mb-2">
                      Your mental wellness is looking{" "}
                      <span className={`text-transparent bg-clip-text bg-gradient-to-r ${wellnessInfo.gradient}`}>
                        {wellnessInfo.text}
                      </span>{" "}
                      today
                    </h2>
                    <p className="text-zinc-400 text-sm leading-relaxed max-w-lg">
                      {latestAnalysis
                        ? latestAnalysis.emotionalSummary
                        : "Write a journal entry to get personalized AI-powered wellness insights and burnout risk assessment."}
                    </p>
                    <Button className="mt-5 rounded-xl bg-white/10 border border-white/10 text-white hover:bg-white/20 cursor-pointer">
                      View Full Report <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                  <ScoreRing score={wellnessScore} />
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Burnout Risk Card */}
          <motion.div custom={1} variants={fadeUp} initial="hidden" animate="show">
            <Card className="rounded-3xl border-white/10 bg-white/[0.03] backdrop-blur-md h-full">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-purple-400" />
                  Burnout Risk
                </CardTitle>
                <CardDescription className="text-zinc-400">
                  {latestAnalysis ? "Based on your latest entry" : "7-day rolling average"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-end gap-2 h-28">
                  {(latestAnalysis
                    ? [
                        Math.max(10, latestAnalysis.burnoutRisk - 15),
                        Math.max(10, latestAnalysis.burnoutRisk - 8),
                        Math.max(10, latestAnalysis.burnoutRisk + 5),
                        latestAnalysis.burnoutRisk,
                        Math.max(10, latestAnalysis.burnoutRisk - 3),
                        Math.max(10, latestAnalysis.burnoutRisk + 8),
                        latestAnalysis.burnoutRisk,
                      ]
                    : [35, 42, 55, 48, 62, 58, 52]
                  ).map((val, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${val}%` }}
                      transition={{ duration: 0.6, delay: 0.3 + i * 0.08 }}
                      className={`flex-1 rounded-lg ${
                        val > 60
                          ? "bg-gradient-to-t from-red-500/60 to-red-400/30"
                          : val > 45
                            ? "bg-gradient-to-t from-amber-500/60 to-amber-400/30"
                            : "bg-gradient-to-t from-emerald-500/60 to-emerald-400/30"
                      }`}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-[10px] text-zinc-500 mt-2">
                  <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* ── Quick Stats Row ────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {quickStats.map((stat, i) => (
            <motion.div key={stat.label} custom={i + 2} variants={fadeUp} initial="hidden" animate="show">
              <Card className="rounded-2xl border-white/10 bg-white/[0.03] backdrop-blur-md hover:bg-white/[0.05] transition-colors">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.border} border flex items-center justify-center`}>
                      <stat.icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                  </div>
                  <p className="text-xs text-zinc-500 mb-0.5">{stat.label}</p>
                  <p className="text-lg font-semibold text-white">{stat.value}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* ── Suggestions Row (shown when AI analysis exists) ───── */}
        {latestAnalysis && latestAnalysis.suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-6"
          >
            <Card className="rounded-3xl border-white/10 bg-white/[0.03] backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-emerald-400" />
                  Wellness Suggestions
                </CardTitle>
                <CardDescription className="text-zinc-400">
                  Personalized recommendations from your latest analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[...latestAnalysis.suggestions, ...latestAnalysis.calmingRecommendations]
                    .slice(0, 3)
                    .map((s, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                            <Lightbulb className="w-4 h-4 text-emerald-400" />
                          </div>
                          <p className="text-sm text-zinc-300 leading-relaxed">{s}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* ── Bottom Row: Insights + Journal ─────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* AI Insights */}
          <motion.div custom={6} variants={fadeUp} initial="hidden" animate="show" className="lg:col-span-3">
            <Card className="rounded-3xl border-white/10 bg-white/[0.03] backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-400" />
                  AI Insights
                </CardTitle>
                <CardDescription className="text-zinc-400">
                  {latestAnalysis
                    ? "Personalised observations from MindGuard"
                    : "Write a journal entry to unlock AI insights"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="h-6 w-6 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : (
                  insightCards.map((insight, i) => (
                    <AiInsightCard key={i} index={i} {...insight} />
                  ))
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Journal */}
          <motion.div custom={7} variants={fadeUp} initial="hidden" animate="show" className="lg:col-span-2">
            <JournalPanel
              entries={entries}
              onNewEntry={handleNewEntry}
              onAnalysisUpdate={handleAnalysisUpdate}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
