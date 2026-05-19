import type { MoodAnalysis } from "@/lib/types";
import { SYSTEM_PROMPT, extractJSON, validateAnalysis, sleep } from "./utils";

const RETRY_DELAYS = [2000, 5000];
const OPENROUTER_MODEL = "openrouter/free";

export async function attemptOpenRouterAnalysis(content: string): Promise<MoodAnalysis | null> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    console.warn("[MindGuard] OPENROUTER_API_KEY is not set.");
    return null;
  }

  for (let attempt = 0; attempt <= RETRY_DELAYS.length; attempt++) {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          // OpenRouter specific headers for metadata
          "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "https://mindguard-ai.vercel.app",
          "X-Title": "MindGuard AI"
        },
        body: JSON.stringify({
          model: OPENROUTER_MODEL,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: content }
          ],
          response_format: { type: "json_object" },
          temperature: 0.7,
        }),
        // Add a 15-second timeout
        signal: AbortSignal.timeout(15000),
      });

      if (response.status === 429 && attempt < RETRY_DELAYS.length) {
        const delay = RETRY_DELAYS[attempt];
        console.warn(`[MindGuard] OpenRouter rate limited (429). Retrying in ${delay}ms... (attempt ${attempt + 1})`);
        await sleep(delay);
        continue;
      }

      if (!response.ok) {
        console.error(`[MindGuard] OpenRouter failed with status: ${response.status}`);
        const text = await response.text().catch(() => "");
        console.error(`[MindGuard] OpenRouter response: ${text.slice(0, 150)}`);
        if (attempt < RETRY_DELAYS.length) {
            const delay = RETRY_DELAYS[attempt];
            await sleep(delay);
            continue;
        }
        break;
      }

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content ?? "";

      if (process.env.NODE_ENV === "development") {
        console.log(`[MindGuard] OpenRouter raw response (${text.length} chars):`, text.slice(0, 300));
      }

      if (!text) return null;

      const parsed = extractJSON(text);
      if (!parsed) {
        console.error(`[MindGuard] JSON extraction failed from OpenRouter:`, text.slice(0, 200));
        return null;
      }

      const result = validateAnalysis(parsed, "OpenRouter");

      if (result.emotionalSummary && result.emotionalSummary.length > 10) {
        return result;
      }

      return null;
    } catch (error: unknown) {
      console.error(`[MindGuard] OpenRouter attempt failed:`, error instanceof Error ? error.message : "Unknown error");
      if (attempt < RETRY_DELAYS.length) {
        const delay = RETRY_DELAYS[attempt];
        await sleep(delay);
        continue;
      }
      break;
    }
  }

  return null;
}
