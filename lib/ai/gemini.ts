import { GoogleGenAI } from "@google/genai";
import type { MoodAnalysis } from "@/lib/types";
import { SYSTEM_PROMPT, extractJSON, validateAnalysis, sleep } from "./utils";

const RETRY_DELAYS = [2000, 5000, 12000]; // ms between retries
const MODELS = ["gemini-2.0-flash", "gemini-2.0-flash-lite"]; // fallback model chain

if (!process.env.GEMINI_API_KEY) {
  console.warn("[MindGuard] GEMINI_API_KEY is not set.");
}

const genai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
  : null;

async function tryModel(model: string, content: string): Promise<MoodAnalysis | null> {
  if (!genai) return null;

  try {
    const response = await genai.models.generateContent({
      model,
      contents: content,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
        temperature: 0.7,
        maxOutputTokens: 1024,
      },
    });

    const text = response.text ?? "";

    if (!text) {
      console.log(`[AI Log] Provider: Gemini, Model: ${model}, Status: OK, Parsing: Failure (Empty response), Success: No`);
      return null;
    }

    const parsed = extractJSON(text);
    if (!parsed) {
      console.log(`[AI Log] Provider: Gemini, Model: ${model}, Status: OK, Parsing: Failure (Invalid JSON), Success: No`);
      return null;
    }

    const result = validateAnalysis(parsed, "Gemini");
    const providerSuccess = !!(result.emotionalSummary && result.emotionalSummary.length > 0);

    console.log(`[AI Log] Provider: Gemini, Model: ${model}, Status: OK, Parsing: Success, Success: ${providerSuccess ? "Yes" : "No"}`);

    if (providerSuccess) {
      return result;
    }

    return null;
  } catch (error: unknown) {
    const err = error as { status?: number; message?: string };
    const status = err.status ? String(err.status) : "Error";
    console.log(`[AI Log] Provider: Gemini, Model: ${model}, Status: ${status}, Parsing: N/A, Success: No`);
    throw error;
  }
}

export async function attemptGeminiAnalysis(content: string): Promise<MoodAnalysis | null> {
  if (!genai) {
    console.warn("[MindGuard] Gemini client unavailable (no API key).");
    return null;
  }

  for (const model of MODELS) {
    for (let attempt = 0; attempt <= RETRY_DELAYS.length; attempt++) {
      try {
        const result = await tryModel(model, content);
        if (result) return result;
      } catch (error: unknown) {
        const err = error as { status?: number; message?: string };
        const status = err.status ?? 0;
        const msg = err.message ?? "Unknown error";

        if (status === 429 && attempt < RETRY_DELAYS.length) {
          const delay = RETRY_DELAYS[attempt];
          console.warn(`[MindGuard] Gemini ${model} rate limited (429). Retrying in ${delay}ms... (attempt ${attempt + 1})`);
          await sleep(delay);
          continue;
        }

        console.error(`[MindGuard] Gemini ${model} failed (${status}):`, msg.slice(0, 150));
        break; // break retry loop, move to next model
      }
    }
  }

  return null;
}
