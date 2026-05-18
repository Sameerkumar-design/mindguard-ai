"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Brain,
  Activity,
  TrendingUp,
  BookOpen,
  Calendar,
  Bell,
  Settings,
  ChevronRight,
  Flame,
  Moon,
  Heart,
  Sparkles,
  BarChart3,
  Clock,
  PenLine,
  LogOut,
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

// ── animation helpers ────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.45 },
  }),
};

// ── mock data ────────────────────────────────────────────────────────
const MOCK_SCORE = 72;

const QUICK_STATS = [
  {
    label: "Stress Level",
    value: "Moderate",
    icon: Flame,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
  {
    label: "Sleep Quality",
    value: "Good",
    icon: Moon,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
  {
    label: "Mood Today",
    value: "Balanced",
    icon: Heart,
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
  },
  {
    label: "Focus Score",
    value: "78%",
    icon: Sparkles,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
  },
];

const RECENT_INSIGHTS = [
  {
    title: "Assignment clustering detected",
    description:
      "3 major deadlines within 48 hours next week. Consider spreading your workload.",
    time: "2h ago",
    icon: Calendar,
    color: "text-amber-400",
  },
  {
    title: "Sleep pattern shift noticed",
    description:
      "Your average bedtime has moved 1.5 hours later this week. This could impact focus.",
    time: "5h ago",
    icon: Moon,
    color: "text-blue-400",
  },
  {
    title: "Positive trend: Exercise",
    description:
      "You've been consistently active 4 days/week. Great for mental resilience!",
    time: "1d ago",
    icon: TrendingUp,
    color: "text-emerald-400",
  },
];

const JOURNAL_ENTRIES = [
  {
    date: "Today",
    excerpt: "Feeling a bit overwhelmed with midterms approaching…",
    mood: "Anxious",
  },
  {
    date: "Yesterday",
    excerpt: "Had a great study session. Nailed the practice exam.",
    mood: "Confident",
  },
  {
    date: "May 15",
    excerpt: "Group project is going well, team synced up nicely.",
    mood: "Happy",
  },
];

// ── score ring component ─────────────────────────────────────────────
function ScoreRing({
  score,
  size = 140,
}: {
  score: number;
  size?: number;
}) {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  let color = "stroke-emerald-400";
  if (score < 50) color = "stroke-red-400";
  else if (score < 75) color = "stroke-amber-400";

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="stroke-white/5"
          fill="none"
          strokeWidth={8}
        />
        <motion.circle
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className={color}
          fill="none"
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={circumference}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-white">{score}</span>
        <span className="text-xs text-zinc-400">Wellness</span>
      </div>
    </div>
  );
}

// ── main dashboard ───────────────────────────────────────────────────
export default function DashboardPage() {
  const [journalText, setJournalText] = useState("");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    async function getUser() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUserEmail(user?.email ?? null);
    }
    getUser();
  }, []);

  async function handleLogout() {
    setLoggingOut(true);
    await logout();
  }

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
            <Button
              variant="outline"
              size="icon"
              className="rounded-xl border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10 cursor-pointer"
            >
              <Bell className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-xl border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10 cursor-pointer"
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

        {/* ── Top Row: Welcome + Score ────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Welcome card */}
          <motion.div
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="lg:col-span-2"
          >
            <Card className="rounded-3xl border-white/10 bg-white/[0.03] backdrop-blur-md overflow-hidden">
              <div className="relative p-6 md:p-8">
                {/* Inner accent glow */}
                <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-purple-600/10 blur-3xl pointer-events-none" />

                <div className="flex flex-col md:flex-row items-start md:items-center gap-6 relative z-10">
                  <div className="flex-1">
                    <Badge className="mb-4 bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20">
                      <Activity className="h-3 w-3 mr-1" /> Status: Active
                    </Badge>
                    <h2 className="text-xl font-semibold text-white mb-2">
                      Your mental wellness is looking{" "}
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">
                        moderate
                      </span>{" "}
                      today
                    </h2>
                    <p className="text-zinc-400 text-sm leading-relaxed max-w-lg">
                      Based on your recent activity, sleep patterns, and
                      assignment load, we recommend taking short breaks between
                      study sessions. Your burnout risk is slightly elevated.
                    </p>
                    <Button className="mt-5 rounded-xl bg-white/10 border border-white/10 text-white hover:bg-white/20 cursor-pointer">
                      View Full Report <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                  <ScoreRing score={MOCK_SCORE} />
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Stress Score Card */}
          <motion.div custom={1} variants={fadeUp} initial="hidden" animate="show">
            <Card className="rounded-3xl border-white/10 bg-white/[0.03] backdrop-blur-md h-full">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-purple-400" />
                  Burnout Risk
                </CardTitle>
                <CardDescription className="text-zinc-400">
                  7-day rolling average
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Mini bar chart placeholder */}
                <div className="flex items-end gap-2 h-28">
                  {[35, 42, 55, 48, 62, 58, 52].map((val, i) => (
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
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                  <span>Sun</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* ── Quick Stats Row ────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {QUICK_STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              custom={i + 2}
              variants={fadeUp}
              initial="hidden"
              animate="show"
            >
              <Card className="rounded-2xl border-white/10 bg-white/[0.03] backdrop-blur-md hover:bg-white/[0.05] transition-colors">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.border} border flex items-center justify-center`}
                    >
                      <stat.icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                  </div>
                  <p className="text-xs text-zinc-500 mb-0.5">{stat.label}</p>
                  <p className="text-lg font-semibold text-white">
                    {stat.value}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* ── Bottom Row: Insights + Journal ─────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* AI Insights */}
          <motion.div
            custom={6}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="lg:col-span-3"
          >
            <Card className="rounded-3xl border-white/10 bg-white/[0.03] backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-400" />
                  AI Insights
                </CardTitle>
                <CardDescription className="text-zinc-400">
                  Personalised observations from MindGuard
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {RECENT_INSIGHTS.map((insight, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.12 }}
                    className="flex gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors group cursor-pointer"
                  >
                    <div className="mt-0.5">
                      <insight.icon
                        className={`h-5 w-5 ${insight.color}`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-medium text-white group-hover:text-purple-300 transition-colors">
                          {insight.title}
                        </h4>
                        <span className="text-[10px] text-zinc-500 whitespace-nowrap flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {insight.time}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                        {insight.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Journal */}
          <motion.div
            custom={7}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="lg:col-span-2"
          >
            <Card className="rounded-3xl border-white/10 bg-white/[0.03] backdrop-blur-md h-full flex flex-col">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-400" />
                  Journal
                </CardTitle>
                <CardDescription className="text-zinc-400">
                  Log your thoughts
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col gap-4">
                {/* Quick entry */}
                <div className="relative">
                  <textarea
                    value={journalText}
                    onChange={(e) => setJournalText(e.target.value)}
                    placeholder="How are you feeling right now?"
                    className="w-full h-24 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-zinc-500 p-3 text-sm resize-none focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 transition-all"
                  />
                  <Button
                    size="sm"
                    className="absolute bottom-3 right-3 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs cursor-pointer"
                  >
                    <PenLine className="h-3 w-3 mr-1" /> Save
                  </Button>
                </div>

                {/* Past entries */}
                <div className="space-y-3 flex-1">
                  {JOURNAL_ENTRIES.map((entry, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-zinc-400">
                          {entry.date}
                        </span>
                        <Badge
                          variant="secondary"
                          className="text-[10px] bg-white/5 border-white/10 text-zinc-400"
                        >
                          {entry.mood}
                        </Badge>
                      </div>
                      <p className="text-xs text-zinc-300 leading-relaxed truncate">
                        {entry.excerpt}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
