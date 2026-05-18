"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  PenLine,
  Loader2,
  Sparkles,
  AlertCircle,
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
import type { JournalEntry, MoodAnalysis } from "@/lib/types";

interface JournalPanelProps {
  entries: JournalEntry[];
  onNewEntry: (entry: JournalEntry) => void;
  onAnalysisUpdate: (analysis: MoodAnalysis) => void;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getMoodColor(tone: string): string {
  const t = tone.toLowerCase();
  if (t.includes("happy") || t.includes("hopeful") || t.includes("positive"))
    return "text-emerald-400";
  if (t.includes("anxious") || t.includes("worried") || t.includes("stress"))
    return "text-amber-400";
  if (
    t.includes("sad") ||
    t.includes("overwhelm") ||
    t.includes("critical") ||
    t.includes("depress")
  )
    return "text-red-400";
  if (t.includes("confident") || t.includes("motivated"))
    return "text-blue-400";
  return "text-zinc-400";
}

export function JournalPanel({
  entries,
  onNewEntry,
  onAnalysisUpdate,
}: JournalPanelProps) {
  const [journalText, setJournalText] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSave() {
    const text = journalText.trim();
    if (text.length < 5) {
      setError("Write at least 5 characters.");
      return;
    }

    setError("");
    setSaving(true);

    try {
      const res = await fetch("/api/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error || "Failed to save.");
        return;
      }

      setJournalText("");
      onNewEntry(data.entry);

      if (data.entry.ai_analysis) {
        onAnalysisUpdate(data.entry.ai_analysis);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="rounded-3xl border-white/10 bg-white/[0.03] backdrop-blur-md h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-blue-400" />
          Journal
        </CardTitle>
        <CardDescription className="text-zinc-400">
          Log your thoughts — AI will analyze your mood
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4">
        {/* Input */}
        <div className="relative">
          <textarea
            value={journalText}
            onChange={(e) => setJournalText(e.target.value)}
            placeholder="How are you feeling right now?"
            disabled={saving}
            maxLength={5000}
            aria-label="Journal entry"
            className="w-full h-24 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-zinc-500 p-3 text-sm resize-none focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 transition-all disabled:opacity-50"
          />
          <Button
            size="sm"
            onClick={handleSave}
            disabled={saving || journalText.trim().length < 5}
            className="absolute bottom-3 right-3 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="h-3 w-3 mr-1 animate-spin" /> Analyzing…
              </>
            ) : (
              <>
                <Sparkles className="h-3 w-3 mr-1" /> Analyze & Save
              </>
            )}
          </Button>
        </div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-2 text-xs text-red-400"
            >
              <AlertCircle className="h-3 w-3" /> {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Entries list */}
        <div className="space-y-3 flex-1 overflow-y-auto max-h-64 pr-1">
          {entries.length === 0 && (
            <div className="text-center py-8">
              <PenLine className="h-8 w-8 text-zinc-600 mx-auto mb-3" />
              <p className="text-sm text-zinc-500">
                No entries yet. Write your first journal entry above.
              </p>
            </div>
          )}
          {entries.map((entry) => {
            const tone = entry.ai_analysis?.emotionalTone ?? "Neutral";
            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-zinc-400">
                    {formatDate(entry.created_at)}
                  </span>
                  <Badge
                    variant="secondary"
                    className={`text-[10px] bg-white/5 border-white/10 ${getMoodColor(tone)}`}
                  >
                    {tone}
                  </Badge>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed truncate">
                  {entry.content}
                </p>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
