"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  Brain,
  Flame,
  Heart,
  Moon,
  Sparkles,
  Calendar,
  ShieldCheck,
  Lightbulb,
  AlertTriangle,
  BookOpen,
  Activity,
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
import { ScoreRing } from "@/components/dashboard/ScoreRing";
import type { JournalEntry } from "@/lib/types";

function formatFullDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getStressColor(level: string) {
  switch (level) {
    case "Low": return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
    case "Moderate": return "text-amber-400 bg-amber-500/10 border-amber-500/20";
    case "High": return "text-orange-400 bg-orange-500/10 border-orange-500/20";
    case "Critical": return "text-red-400 bg-red-500/10 border-red-500/20";
    default: return "text-zinc-400 bg-zinc-500/10 border-zinc-500/20";
  }
}

function getBurnoutColor(risk: number) {
  if (risk >= 70) return "from-red-400 to-orange-300";
  if (risk >= 45) return "from-amber-400 to-yellow-300";
  return "from-emerald-400 to-green-300";
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.4 },
  }),
};

export default function HistoricalReportPage() {
  const params = useParams<{ id: string }>();
  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchEntry() {
      try {
        const res = await fetch(`/api/journal/${params.id}`);
        const data = await res.json();
        if (data.success && data.entry) {
          setEntry(data.entry);
        } else {
          setError(data.error || "Entry not found.");
        }
      } catch {
        setError("Failed to load entry.");
      } finally {
        setLoading(false);
      }
    }
    if (params.id) fetchEntry();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !entry) {
    return (
      <div className="min-h-screen bg-black pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl text-center">
          <BookOpen className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Entry Not Found</h1>
          <p className="text-zinc-400 mb-6">{error || "This journal entry doesn't exist or you don't have access."}</p>
          <Link href="/report">
            <Button className="rounded-xl bg-purple-600 hover:bg-purple-500 text-white cursor-pointer">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Report
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const a = entry.ai_analysis;

  return (
    <div className="min-h-screen bg-black pt-24 pb-16">
      {/* Background */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-purple-900/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-blue-900/8 blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Link href="/report">
            <Button variant="ghost" className="text-zinc-400 hover:text-white mb-4 -ml-2 cursor-pointer">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Full Report
            </Button>
          </Link>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
                <Brain className="h-7 w-7 text-purple-400" />
                Journal Entry Report
              </h1>
              <p className="text-zinc-500 mt-1 flex items-center gap-1.5 text-sm">
                <Calendar className="h-3.5 w-3.5" /> {formatFullDate(entry.created_at)}
              </p>
            </div>
            {a && (
              <Badge className={`${getStressColor(a.stressLevel)} border self-start md:self-auto`}>
                <Activity className="h-3 w-3 mr-1" /> Stress: {a.stressLevel}
              </Badge>
            )}
          </div>
        </motion.div>

        {/* Original Journal Text */}
        <motion.div custom={0} variants={fadeUp} initial="hidden" animate="show" className="mb-6">
          <Card className="rounded-3xl border-white/10 bg-white/[0.03] backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2 text-base">
                <BookOpen className="h-5 w-5 text-blue-400" />
                Your Journal Entry
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap">{entry.content}</p>
            </CardContent>
          </Card>
        </motion.div>

        {a ? (
          <>
            {/* Score Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { label: "Stress Level", value: a.stressLevel, icon: Flame, cls: getStressColor(a.stressLevel) },
                { label: "Burnout Risk", value: `${a.burnoutRisk}%`, icon: Moon, cls: a.burnoutRisk >= 60 ? "text-red-400 bg-red-500/10 border-red-500/20" : "text-blue-400 bg-blue-500/10 border-blue-500/20" },
                { label: "Emotional Tone", value: a.emotionalTone, icon: Heart, cls: "text-rose-400 bg-rose-500/10 border-rose-500/20" },
                { label: "Positivity", value: `${a.positivityScore}%`, icon: Sparkles, cls: a.positivityScore >= 60 ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" : "text-amber-400 bg-amber-500/10 border-amber-500/20" },
              ].map((stat, i) => (
                <motion.div key={stat.label} custom={i + 1} variants={fadeUp} initial="hidden" animate="show">
                  <Card className="rounded-2xl border-white/10 bg-white/[0.03] backdrop-blur-md">
                    <CardContent className="p-5">
                      <stat.icon className="h-5 w-5 text-zinc-500 mb-3" />
                      <p className="text-xs text-zinc-500 mb-0.5">{stat.label}</p>
                      <p className="text-lg font-bold text-white">{stat.value}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Emotional Summary + Score Ring */}
            <motion.div custom={5} variants={fadeUp} initial="hidden" animate="show" className="mb-6">
              <Card className="rounded-3xl border-white/10 bg-white/[0.03] backdrop-blur-md overflow-hidden">
                <div className="relative p-6 md:p-8">
                  <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-purple-600/10 blur-3xl pointer-events-none" />
                  <div className="flex flex-col md:flex-row items-start gap-8 relative z-10">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                        <Brain className="h-5 w-5 text-purple-400" />
                        Emotional Summary
                      </h3>
                      <p className="text-zinc-300 leading-relaxed mb-4">{a.emotionalSummary}</p>

                      {a.anxietyIndicators.length > 0 && (
                        <div>
                          <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" /> Anxiety Indicators
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {a.anxietyIndicators.map((ind, i) => (
                              <Badge key={i} variant="secondary" className="bg-amber-500/10 border-amber-500/20 text-amber-400 text-xs">
                                {ind}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <ScoreRing score={a.positivityScore} label="Positivity" />
                      <p className={`text-xs font-medium text-transparent bg-clip-text bg-gradient-to-r ${getBurnoutColor(a.burnoutRisk)}`}>
                        Burnout Risk: {a.burnoutRisk}%
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Wellness Insights */}
            {a.wellnessInsights.length > 0 && (
              <motion.div custom={6} variants={fadeUp} initial="hidden" animate="show" className="mb-6">
                <Card className="rounded-3xl border-white/10 bg-white/[0.03] backdrop-blur-md">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2 text-base">
                      <Brain className="h-5 w-5 text-purple-400" /> Wellness Insights
                    </CardTitle>
                    <CardDescription className="text-zinc-500">Behavioral observations from this entry</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {a.wellnessInsights.map((insight, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                        <div className="w-6 h-6 rounded-md bg-purple-500/10 flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-[10px] font-bold text-purple-400">{i + 1}</span>
                        </div>
                        <p className="text-sm text-zinc-300 leading-relaxed">{insight}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Recommendations */}
            <motion.div custom={7} variants={fadeUp} initial="hidden" animate="show">
              <Card className="rounded-3xl border-white/10 bg-white/[0.03] backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2 text-base">
                    <ShieldCheck className="h-5 w-5 text-emerald-400" /> Recommendations
                  </CardTitle>
                  <CardDescription className="text-zinc-500">Personalized suggestions and calming activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[...a.suggestions, ...a.calmingRecommendations].map((s, i) => (
                      <div key={i} className="flex items-start gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                          <Lightbulb className="w-4 h-4 text-emerald-400" />
                        </div>
                        <p className="text-sm text-zinc-300 leading-relaxed">{s}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </>
        ) : (
          <motion.div custom={1} variants={fadeUp} initial="hidden" animate="show">
            <Card className="rounded-3xl border-white/10 bg-white/[0.03] backdrop-blur-md">
              <CardContent className="p-8 text-center">
                <Brain className="h-10 w-10 text-zinc-600 mx-auto mb-3" />
                <p className="text-zinc-400">No AI analysis available for this entry.</p>
                <p className="text-zinc-500 text-sm mt-1">This may happen if the AI service was unavailable when the entry was created.</p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
