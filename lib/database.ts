import { createClient } from "@/lib/supabase/server";
import type { JournalEntry, MoodAnalysis } from "@/lib/types";

/**
 * Save a journal entry with its AI analysis to Supabase.
 */
export async function saveJournalEntry(
  userId: string,
  content: string,
  aiAnalysis: MoodAnalysis
): Promise<JournalEntry> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("journal_entries")
    .insert({
      user_id: userId,
      content,
      ai_analysis: aiAnalysis,
    })
    .select()
    .single();

  if (error) {
    console.error("Supabase insert error:", error);
    throw new Error(`Failed to save journal entry: ${error.message}`);
  }

  return data as JournalEntry;
}

/**
 * Fetch journal entries for a user, ordered by most recent first.
 */
export async function getJournalEntries(
  userId: string,
  limit: number = 10
): Promise<JournalEntry[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("journal_entries")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Supabase fetch error:", error);
    throw new Error(`Failed to fetch journal entries: ${error.message}`);
  }

  return (data ?? []) as JournalEntry[];
}

/**
 * Get the latest journal entry with AI analysis for a user.
 */
export async function getLatestAnalysis(
  userId: string
): Promise<JournalEntry | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("journal_entries")
    .select("*")
    .eq("user_id", userId)
    .not("ai_analysis", "is", null)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== "PGRST116") {
    // PGRST116 = no rows found (OK)
    console.error("Supabase latest analysis error:", error);
    return null;
  }

  return (data as JournalEntry) ?? null;
}
