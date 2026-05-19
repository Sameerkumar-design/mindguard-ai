import type { MoodAnalysis } from "@/lib/types";

export const SYSTEM_PROMPT = `You are MindGuard AI, a mental wellness analyst for university students.

Analyze the journal entry and return a UNIQUE, PERSONALIZED assessment that reflects the EXACT words and feelings described.

Rules:
- Every entry is different. Vary ALL scores based on content.
- Happy/grateful entries: positivityScore 70-95, burnoutRisk 5-25
- Stressed/anxious entries: positivityScore 15-40, burnoutRisk 55-85
- Neutral entries: positivityScore 45-60, burnoutRisk 30-50
- emotionalTone must be ONE specific word matching the entry
- suggestions must reference the student's specific situation
- wellnessInsights must quote or reference specific details from the entry
- Never give generic or templated responses
- YOU MUST RETURN STRICT JSON ONLY. No markdown, no code fences.

Return ONLY this JSON (no other text):
{"emotionalSummary":"1-2 sentences about THIS student","stressLevel":"Low|Moderate|High|Critical","anxietyIndicators":["specific from text"],"burnoutRisk":0,"positivityScore":0,"emotionalTone":"SingleWord","wellnessInsights":["referencing entry details"],"suggestions":["specific to their situation"],"calmingRecommendations":["relevant calming activities"]}`;

export function getFallbackAnalysis(error?: string): MoodAnalysis {
  return {
    emotionalSummary: error
      ? `Analysis temporarily unavailable: ${error}. Your entry has been saved and will be analyzed when the service recovers.`
      : "Unable to analyze this entry. Please try again.",
    stressLevel: "Moderate",
    anxietyIndicators: [],
    burnoutRisk: 50,
    positivityScore: 50,
    emotionalTone: "Neutral",
    wellnessInsights: ["Analysis pending — try again shortly."],
    suggestions: ["Write another entry when AI service recovers."],
    calmingRecommendations: ["Take a few deep breaths while waiting."],
    provider: "Fallback",
  };
}

const VALID_STRESS = ["Low", "Moderate", "High", "Critical"] as const;

export function validateAnalysis(raw: Record<string, unknown>, provider: "Gemini" | "OpenRouter"): MoodAnalysis {
  return {
    emotionalSummary: String(raw.emotionalSummary ?? "").slice(0, 500),
    stressLevel: VALID_STRESS.includes(raw.stressLevel as typeof VALID_STRESS[number])
      ? (raw.stressLevel as MoodAnalysis["stressLevel"])
      : "Moderate",
    anxietyIndicators: Array.isArray(raw.anxietyIndicators)
      ? raw.anxietyIndicators.map((s) => String(s).slice(0, 200)).slice(0, 10)
      : [],
    burnoutRisk: Math.max(0, Math.min(100, Number(raw.burnoutRisk) || 50)),
    positivityScore: Math.max(0, Math.min(100, Number(raw.positivityScore) || 50)),
    emotionalTone: String(raw.emotionalTone ?? "Neutral").slice(0, 50),
    wellnessInsights: Array.isArray(raw.wellnessInsights)
      ? raw.wellnessInsights.map((s) => String(s).slice(0, 300)).slice(0, 5)
      : [],
    suggestions: Array.isArray(raw.suggestions)
      ? raw.suggestions.map((s) => String(s).slice(0, 300)).slice(0, 5)
      : [],
    calmingRecommendations: Array.isArray(raw.calmingRecommendations)
      ? raw.calmingRecommendations.map((s) => String(s).slice(0, 300)).slice(0, 5)
      : [],
    provider,
  };
}

export function extractJSON(text: string): Record<string, unknown> | null {
  try { return JSON.parse(text) as Record<string, unknown>; } catch { /* */ }

  const stripped = text.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
  try { return JSON.parse(stripped) as Record<string, unknown>; } catch { /* */ }

  const start = text.indexOf("{");
  if (start !== -1) {
    let depth = 0;
    for (let i = start; i < text.length; i++) {
      if (text[i] === "{") depth++;
      else if (text[i] === "}") {
        depth--;
        if (depth === 0) {
          try { return JSON.parse(text.slice(start, i + 1)) as Record<string, unknown>; }
          catch { break; }
        }
      }
    }
  }
  return null;
}

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
