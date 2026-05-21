import type { MoodAnalysis } from "@/lib/types";
import { SYSTEM_PROMPT, extractJSON, validateAnalysis, sleep } from "./utils";

const RETRY_DELAYS = [2000, 5000];
const OPENROUTER_MODELS = [
  "deepseek/deepseek-chat-v3-0324:free",
  "meta-llama/llama-3.1-8b-instruct:free"
];

async function tryOpenRouterModel(model: string, content: string): Promise<MoodAnalysis | null> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return null;

  for (let attempt = 0; attempt <= RETRY_DELAYS.length; attempt++) {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "https://mindguard-ai-six.vercel.app",
          "X-Title": "MindGuard AI"
        },
        body: JSON.stringify({
          model: model,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: content }
          ],
          response_format: { type: "json_object" },
          temperature: 0.7,
        }),
        signal: AbortSignal.timeout(15000),
      });

      if (response.status === 429 && attempt < RETRY_DELAYS.length) {
        const delay = RETRY_DELAYS[attempt];
        console.warn(`[MindGuard] OpenRouter ${model} rate limited (429). Retrying in ${delay}ms... (attempt ${attempt + 1})`);
        await sleep(delay);
        continue;
      }

      if (!response.ok) {
        const status = String(response.status);
        const errorText = await response.text().catch(() => "Could not read response body");
        console.log(`[AI Log] Provider: OpenRouter, Model: ${model}, Status: ${status}, Parsing: N/A, Success: No, Error Response: ${errorText}`);
        break; // break retry loop, move to next model
      }

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content ?? "";

      if (!text) {
        console.log(`[AI Log] Provider: OpenRouter, Model: ${model}, Status: ${response.status}, Parsing: Failure (Empty response), Success: No`);
        break;
      }

      const parsed = extractJSON(text);
      if (!parsed) {
        console.log(`[AI Log] Provider: OpenRouter, Model: ${model}, Status: ${response.status}, Parsing: Failure (Invalid JSON), Success: No`);
        break;
      }

      const result = validateAnalysis(parsed, "OpenRouter");
      const providerSuccess = !!(result.emotionalSummary && result.emotionalSummary.length > 0);

      console.log(`[AI Log] Provider: OpenRouter, Model: ${model}, Status: ${response.status}, Parsing: Success, Success: ${providerSuccess ? "Yes" : "No"}`);

      if (providerSuccess) {
        return result;
      }
      break;

    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : "Unknown error";
      console.log(`[AI Log] Provider: OpenRouter, Model: ${model}, Status: Error (${errMsg}), Parsing: N/A, Success: No`);
      
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

export async function attemptOpenRouterAnalysis(content: string): Promise<MoodAnalysis | null> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    console.warn("[MindGuard] OPENROUTER_API_KEY is not set.");
    return null;
  }

  for (const model of OPENROUTER_MODELS) {
    const result = await tryOpenRouterModel(model, content);
    if (result) return result;
  }

  return null;
}
