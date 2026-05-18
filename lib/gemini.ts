import { GoogleGenAI } from "@google/genai";
import type { MoodAnalysis } from "@/lib/types";

const genai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const SYSTEM_PROMPT = `You are MindGuard AI, a compassionate mental wellness assistant for university students. 
Analyze the following journal entry and provide a structured mental health assessment.

You MUST respond with ONLY a valid JSON object (no markdown, no code fences, no extra text) matching this exact schema:

{
  "emotionalSummary": "A 1-2 sentence summary of the user's emotional state",
  "stressLevel": "Low" | "Moderate" | "High" | "Critical",
  "anxietyIndicators": ["list of specific anxiety indicators found in the text"],
  "burnoutRisk": <number 0-100>,
  "positivityScore": <number 0-100>,
  "emotionalTone": "The dominant emotional tone (e.g., Hopeful, Anxious, Neutral, Overwhelmed, etc.)",
  "wellnessInsights": ["2-3 behavioral or emotional observations"],
  "suggestions": ["2-3 actionable wellness suggestions personalized to the entry"],
  "calmingRecommendations": ["2-3 specific calming activities or techniques"]
}

Be empathetic, non-judgmental, and evidence-based in your analysis. 
If the entry is very short or vague, make reasonable inferences but note lower confidence.
Focus on being genuinely helpful rather than alarmist.`;

export async function analyzeJournalEntry(
  content: string
): Promise<MoodAnalysis> {
  try {
    const response = await genai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: content,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.4,
        maxOutputTokens: 1024,
      },
    });

    const text = response.text ?? "";

    // Strip possible markdown code fences
    const cleaned = text
      .replace(/```json\s*/gi, "")
      .replace(/```\s*/g, "")
      .trim();

    const analysis: MoodAnalysis = JSON.parse(cleaned);

    // Clamp numeric values
    analysis.burnoutRisk = Math.max(0, Math.min(100, analysis.burnoutRisk));
    analysis.positivityScore = Math.max(
      0,
      Math.min(100, analysis.positivityScore)
    );

    return analysis;
  } catch (error) {
    console.error("Gemini analysis failed:", error);

    // Return a safe fallback
    return {
      emotionalSummary:
        "Unable to fully analyze this entry. Please try again or write a bit more.",
      stressLevel: "Moderate",
      anxietyIndicators: [],
      burnoutRisk: 50,
      positivityScore: 50,
      emotionalTone: "Neutral",
      wellnessInsights: [
        "Consider writing more detail for a deeper analysis.",
      ],
      suggestions: [
        "Try journaling about specific events or feelings.",
        "Take a short break and revisit your thoughts.",
      ],
      calmingRecommendations: [
        "Try 5 minutes of deep breathing.",
        "Listen to calming music.",
      ],
    };
  }
}
