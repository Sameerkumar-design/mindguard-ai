import type { MoodAnalysis } from "@/lib/types";
import { attemptGeminiAnalysis } from "./gemini";
import { attemptOpenRouterAnalysis } from "./openrouter";
import { getFallbackAnalysis } from "./utils";

const MAX_CONTENT_LENGTH = 5000;

export async function analyzeJournalEntry(content: string): Promise<MoodAnalysis> {
  const sanitized = content.slice(0, MAX_CONTENT_LENGTH).trim();
  
  if (sanitized.length < 3) {
    return getFallbackAnalysis("Entry too short");
  }

  // 1. Try Gemini
  try {
    const geminiResult = await attemptGeminiAnalysis(sanitized);
    if (geminiResult) return geminiResult;
  } catch (error) {
    console.error("[MindGuard] Gemini orchestration error:", error);
  }

  console.warn("[MindGuard] Gemini failed, falling back to OpenRouter...");

  // 2. Try OpenRouter
  try {
    const openRouterResult = await attemptOpenRouterAnalysis(sanitized);
    if (openRouterResult) return openRouterResult;
  } catch (error) {
    console.error("[MindGuard] OpenRouter orchestration error:", error);
  }

  console.error("[MindGuard] All AI providers failed. Returning safe fallback.");
  
  // 3. Final Fallback
  return getFallbackAnalysis("AI service temporarily unavailable. Try again in a few minutes.");
}
