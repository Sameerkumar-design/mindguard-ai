// ── AI Analysis Types ─────────────────────────────────────────────────────────

export interface MoodAnalysis {
  emotionalSummary: string;
  stressLevel: "Low" | "Moderate" | "High" | "Critical";
  anxietyIndicators: string[];
  burnoutRisk: number; // 0–100
  positivityScore: number; // 0–100
  emotionalTone: string;
  wellnessInsights: string[];
  suggestions: string[];
  calmingRecommendations: string[];
}

// ── Database Types ────────────────────────────────────────────────────────────

export interface JournalEntry {
  id: string;
  user_id: string;
  content: string;
  ai_analysis: MoodAnalysis | null;
  created_at: string;
}

// ── API Types ─────────────────────────────────────────────────────────────────

export interface JournalApiResponse {
  success: boolean;
  entry?: JournalEntry;
  error?: string;
}

export interface JournalListResponse {
  success: boolean;
  entries?: JournalEntry[];
  error?: string;
}
