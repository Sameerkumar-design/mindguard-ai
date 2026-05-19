"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  Brain,
  Flame,
  Heart,
  Moon,
  Sparkles,
  Activity,
  BookOpen,
  Calendar,
  ShieldCheck,
  Lightbulb,
  AlertTriangle,
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
import type { JournalEntry, MoodAnalysis } from "@/lib/types";
import { ScoreRing } from "@/components/dashboard/ScoreRing";
import {
  WellnessTrendChart,
  BurnoutTrendChart,
  PositivityTrendChart,
  MoodDistributionChart,
} from "@/components/report/Charts";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.4 },
  }),
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
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

export default function ReportPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [latestAnalysis, setLatestAnalysis] = useState<MoodAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);

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

  const analyzedEntries = entries.filter((e) => e.ai_analysis);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-24 pb-16">
      {/* Background */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-purple-900/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-blue-900/8 blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" className="text-zinc-400 hover:text-white mb-4 -ml-2 cursor-pointer">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
            </Button>
          </Link>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <Brain className="h-8 w-8 text-purple-400" />
                Wellness Report
              </h1>
              <p className="text-zinc-400 mt-1">
                {userEmail ? `Comprehensive analysis for ${userEmail.split("@")[0]}` : "Your complete mental wellness analysis"}
              </p>
            </div>
            <div className="flex flex-col gap-2 self-start md:self-auto md:items-end">
              <Badge className="bg-purple-500/10 border-purple-500/20 text-purple-400">
                <Activity className="h-3 w-3 mr-1" /> {analyzedEntries.length} entries analyzed
              </Badge>
              {latestAnalysis?.provider && (
                <Badge variant="secondary" className="bg-white/5 border-white/10 text-zinc-500 text-[10px]">
                  Analyzed with {latestAnalysis.provider}
                </Badge>
              )}
            </div>
          </div>
        </motion.div>

        {/* Summary Cards Row */}
        {latestAnalysis && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Stress Level", value: latestAnalysis.stressLevel, icon: Flame, badgeClass: getStressColor(latestAnalysis.stressLevel) },
              { label: "Burnout Risk", value: `${latestAnalysis.burnoutRisk}%`, icon: Moon, badgeClass: latestAnalysis.burnoutRisk >= 60 ? "text-red-400 bg-red-500/10 border-red-500/20" : "text-blue-400 bg-blue-500/10 border-blue-500/20" },
              { label: "Emotional Tone", value: latestAnalysis.emotionalTone, icon: Heart, badgeClass: "text-rose-400 bg-rose-500/10 border-rose-500/20" },
              { label: "Positivity", value: `${latestAnalysis.positivityScore}%`, icon: Sparkles, badgeClass: latestAnalysis.positivityScore >= 60 ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" : "text-amber-400 bg-amber-500/10 border-amber-500/20" },
            ].map((stat, i) => (
              <motion.div key={stat.label} custom={i} variants={fadeUp} initial="hidden" animate="show">
                <Card className="rounded-2xl border-white/10 bg-white/[0.03] backdrop-blur-md">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <Badge className={`${stat.badgeClass} border text-[10px]`}>Latest</Badge>
                      <stat.icon className="h-4 w-4 text-zinc-500" />
                    </div>
                    <p className="text-xs text-zinc-500 mb-0.5">{stat.label}</p>
                    <p className="text-xl font-bold text-white">{stat.value}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Latest AI Summary */}
        {latestAnalysis && (
          <motion.div custom={4} variants={fadeUp} initial="hidden" animate="show" className="mb-8">
            <Card className="rounded-3xl border-white/10 bg-white/[0.03] backdrop-blur-md overflow-hidden">
              <div className="relative p-6 md:p-8">
                <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-purple-600/10 blur-3xl pointer-events-none" />
                <div className="flex flex-col md:flex-row items-start gap-8 relative z-10">
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                      <Brain className="h-5 w-5 text-purple-400" />
                      Emotional Summary
                    </h2>
                    <p className="text-zinc-300 leading-relaxed mb-6">{latestAnalysis.emotionalSummary}</p>

                    {latestAnalysis.anxietyIndicators.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" /> Anxiety Indicators
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {latestAnalysis.anxietyIndicators.map((indicator, i) => (
                            <Badge key={i} variant="secondary" className="bg-amber-500/10 border-amber-500/20 text-amber-400 text-xs">
                              {indicator}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <ScoreRing score={latestAnalysis.positivityScore} label="Positivity" />
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Charts Grid */}
        <motion.div custom={5} variants={fadeUp} initial="hidden" animate="show" className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Activity className="h-5 w-5 text-purple-400" />
            Analytics
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <WellnessTrendChart entries={entries} />
            <BurnoutTrendChart entries={entries} />
            <PositivityTrendChart entries={entries} />
            <MoodDistributionChart entries={entries} />
          </div>
        </motion.div>

        {/* Recommendations */}
        {latestAnalysis && (
          <motion.div custom={6} variants={fadeUp} initial="hidden" animate="show" className="mb-8">
            <Card className="rounded-3xl border-white/10 bg-white/[0.03] backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-emerald-400" />
                  AI Recommendations
                </CardTitle>
                <CardDescription className="text-zinc-400">Personalized wellness suggestions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[...latestAnalysis.suggestions, ...latestAnalysis.calmingRecommendations].map((s, i) => (
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
        )}

        {/* Journal History */}
        <motion.div custom={7} variants={fadeUp} initial="hidden" animate="show">
          <Card className="rounded-3xl border-white/10 bg-white/[0.03] backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-400" />
                Journal History
              </CardTitle>
              <CardDescription className="text-zinc-400">{entries.length} total entries</CardDescription>
            </CardHeader>
            <CardContent>
              {entries.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="h-10 w-10 text-zinc-600 mx-auto mb-3" />
                  <p className="text-zinc-500">No journal entries yet. Write your first one on the dashboard!</p>
                  <Link href="/dashboard">
                    <Button className="mt-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white cursor-pointer">
                      Go to Dashboard
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                  {entries.map((entry) => {
                    const a = entry.ai_analysis;
                    return (
                      <div key={entry.id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-zinc-500 flex items-center gap-1">
                            <Calendar className="h-3 w-3" /> {formatDate(entry.created_at)}
                          </span>
                          {a && (
                            <div className="flex items-center gap-2">
                              {a.provider && (
                                <Badge variant="secondary" className="text-[10px] bg-white/5 border-white/10 text-zinc-500">
                                  {a.provider}
                                </Badge>
                              )}
                              <Badge variant="secondary" className="text-[10px] bg-white/5 border-white/10 text-zinc-300">
                                {a.emotionalTone}
                              </Badge>
                              <Badge variant="secondary" className={`text-[10px] border ${getStressColor(a.stressLevel)}`}>
                                {a.stressLevel}
                              </Badge>
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-zinc-300 leading-relaxed line-clamp-2">{entry.content}</p>
                        <div className="flex items-center justify-between mt-3">
                          {a ? (
                            <div className="flex items-center gap-4 text-[10px] text-zinc-500">
                              <span>Burnout: {a.burnoutRisk}%</span>
                              <span>Positivity: {a.positivityScore}%</span>
                            </div>
                          ) : (
                            <span className="text-[10px] text-zinc-600">No analysis</span>
                          )}
                          <Link href={`/report/${entry.id}`}>
                            <Button variant="ghost" size="sm" className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 text-xs h-7 px-3 cursor-pointer">
                              View Report →
                            </Button>
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
