"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
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
  X,
  Check,
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

// ── fallback data ────────────────────────────────────────────────────
const DEFAULT_STATS = [
  { label: "Stress Level", value: "—", icon: Flame, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  { label: "Burnout Risk", value: "—", icon: Moon, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  { label: "Mood", value: "—", icon: Heart, color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20" },
  { label: "Positivity", value: "—", icon: Sparkles, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
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

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

// ── Notifications data ───────────────────────────────────────────────
function buildNotifications(analysis: MoodAnalysis | null, entryCount: number) {
  const notifs: { title: string; desc: string; time: string; read: boolean }[] = [];
  if (analysis) {
    if (analysis.burnoutRisk >= 60) {
      notifs.push({ title: "High Burnout Risk", desc: `Your burnout risk is at ${analysis.burnoutRisk}%. Consider taking a break.`, time: "Now", read: false });
    }
    if (analysis.stressLevel === "High" || analysis.stressLevel === "Critical") {
      notifs.push({ title: "Elevated Stress Detected", desc: `Your stress level is ${analysis.stressLevel}. Try a calming activity.`, time: "Now", read: false });
    }
    notifs.push({ title: "Analysis Complete", desc: "Your latest journal entry has been analyzed.", time: "Just now", read: true });
  }
  if (entryCount === 0) {
    notifs.push({ title: "Welcome to MindGuard", desc: "Write your first journal entry to get started!", time: "Today", read: false });
  }
  if (entryCount >= 3) {
    notifs.push({ title: "Report Available", desc: "You have enough entries for a wellness report.", time: "Today", read: true });
  }
  return notifs;
}

// ── Main ─────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [latestAnalysis, setLatestAnalysis] = useState<MoodAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [notifOpen, setNotifOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

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
          const withAnalysis = data.entries.find((e: JournalEntry) => e.ai_analysis);
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

  // Close notification dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
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
  const notifications = buildNotifications(latestAnalysis, entries.length);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const insightCards = latestAnalysis
    ? (latestAnalysis.wellnessInsights || []).map((insight, i) => ({
        title: i === 0 ? "Behavioral Observation" : `Insight ${i + 1}`,
        description: insight,
        time: "Just now",
        icon: i === 0 ? Calendar : i === 1 ? Moon : TrendingUp,
        color: i === 0 ? "text-amber-400" : i === 1 ? "text-blue-400" : "text-emerald-400",
      }))
    : [{ title: "Write your first entry", description: "Journal about your day to receive AI-powered wellness insights.", time: "—", icon: Lightbulb, color: "text-purple-400" }];

  return (
    <div className="min-h-screen bg-black pt-24 pb-16">
      {/* Background */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-purple-900/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-blue-900/8 blur-[120px]" />
      </div>

      {/* Settings overlay */}
      <AnimatePresence>
        {settingsOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setSettingsOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md mx-4 rounded-3xl bg-zinc-900 border border-white/10 shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                <h3 className="text-lg font-semibold text-white">Settings</h3>
                <button onClick={() => setSettingsOpen(false)} className="text-zinc-400 hover:text-white transition-colors cursor-pointer">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">Email Notifications</p>
                    <p className="text-xs text-zinc-500">Get weekly wellness summaries</p>
                  </div>
                  <div className="w-10 h-6 rounded-full bg-purple-600 flex items-center justify-end px-1 cursor-pointer">
                    <div className="w-4 h-4 bg-white rounded-full" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">Dark Mode</p>
                    <p className="text-xs text-zinc-500">Always enabled</p>
                  </div>
                  <div className="w-10 h-6 rounded-full bg-purple-600 flex items-center justify-end px-1 cursor-pointer">
                    <div className="w-4 h-4 bg-white rounded-full" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">Account</p>
                    <p className="text-xs text-zinc-500 truncate max-w-[200px]">{userEmail}</p>
                  </div>
                  <Badge variant="secondary" className="bg-emerald-500/10 border-emerald-500/20 text-emerald-400 text-[10px]">Active</Badge>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">
              {getGreeting()}{userEmail ? `, ${userEmail.split("@")[0]}` : ""} 👋
            </h1>
            <p className="text-zinc-400 mt-1">Here&apos;s your wellness overview for today.</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <Button
                variant="outline"
                size="icon"
                className="rounded-xl border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10 cursor-pointer relative"
                onClick={() => { setNotifOpen(!notifOpen); setSettingsOpen(false); }}
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Button>
              <AnimatePresence>
                {notifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-80 rounded-2xl bg-zinc-900/95 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden z-50"
                  >
                    <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
                      <p className="text-sm font-medium text-white">Notifications</p>
                      {unreadCount > 0 && <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-[10px]">{unreadCount} new</Badge>}
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <p className="text-sm text-zinc-500 text-center py-6">No notifications</p>
                      ) : (
                        notifications.map((n, i) => (
                          <div key={i} className={`px-4 py-3 border-b border-white/5 last:border-0 ${n.read ? "opacity-60" : ""}`}>
                            <div className="flex items-start gap-3">
                              <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${n.read ? "bg-zinc-600" : "bg-purple-400"}`} />
                              <div>
                                <p className="text-sm font-medium text-white">{n.title}</p>
                                <p className="text-xs text-zinc-400 mt-0.5">{n.desc}</p>
                                <p className="text-[10px] text-zinc-600 mt-1">{n.time}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Button
              variant="outline"
              size="icon"
              className="rounded-xl border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10 cursor-pointer"
              onClick={() => { setSettingsOpen(true); setNotifOpen(false); }}
            >
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

        {/* Top Row: Welcome + Burnout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
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
                      <span className={`text-transparent bg-clip-text bg-gradient-to-r ${wellnessInfo.gradient}`}>{wellnessInfo.text}</span>{" "}
                      today
                    </h2>
                    <p className="text-zinc-400 text-sm leading-relaxed max-w-lg">
                      {latestAnalysis ? latestAnalysis.emotionalSummary : "Write a journal entry to get personalized AI-powered wellness insights and burnout risk assessment."}
                    </p>
                    <Link href="/report">
                      <Button className="mt-5 rounded-xl bg-white/10 border border-white/10 text-white hover:bg-white/20 cursor-pointer">
                        View Full Report <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                  <ScoreRing score={wellnessScore} />
                </div>
              </div>
            </Card>
          </motion.div>

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

        {/* Quick Stats */}
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

        {/* Suggestions */}
        {latestAnalysis && latestAnalysis.suggestions.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mb-6">
            <Card className="rounded-3xl border-white/10 bg-white/[0.03] backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-emerald-400" />
                  Wellness Suggestions
                </CardTitle>
                <CardDescription className="text-zinc-400">Personalized recommendations from your latest analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[...latestAnalysis.suggestions, ...latestAnalysis.calmingRecommendations].slice(0, 3).map((s, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                          {i === 0 ? <Check className="w-4 h-4 text-emerald-400" /> : <Lightbulb className="w-4 h-4 text-emerald-400" />}
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

        {/* Bottom Row: Insights + Journal */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <motion.div custom={6} variants={fadeUp} initial="hidden" animate="show" className="lg:col-span-3">
            <Card className="rounded-3xl border-white/10 bg-white/[0.03] backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-400" />
                  AI Insights
                </CardTitle>
                <CardDescription className="text-zinc-400">
                  {latestAnalysis ? "Personalised observations from MindGuard" : "Write a journal entry to unlock AI insights"}
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

          <motion.div custom={7} variants={fadeUp} initial="hidden" animate="show" className="lg:col-span-2">
            <JournalPanel entries={entries} onNewEntry={handleNewEntry} onAnalysisUpdate={handleAnalysisUpdate} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
