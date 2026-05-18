import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { analyzeJournalEntry } from "@/lib/gemini";
import { saveJournalEntry, getJournalEntries } from "@/lib/database";

// ── Constants ────────────────────────────────────────────────────────
const MIN_CONTENT_LENGTH = 5;
const MAX_CONTENT_LENGTH = 5000;

/**
 * POST /api/journal — Create a new journal entry with AI analysis
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate user
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2. Parse request body (guard against malformed JSON)
    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON body." },
        { status: 400 }
      );
    }

    // 3. Validate content
    if (typeof body.content !== "string") {
      return NextResponse.json(
        { success: false, error: "Content must be a string." },
        { status: 400 }
      );
    }

    const content = body.content.trim().slice(0, MAX_CONTENT_LENGTH);

    if (content.length < MIN_CONTENT_LENGTH) {
      return NextResponse.json(
        {
          success: false,
          error: `Journal entry must be at least ${MIN_CONTENT_LENGTH} characters.`,
        },
        { status: 400 }
      );
    }

    // 4. Analyze with Gemini AI
    const aiAnalysis = await analyzeJournalEntry(content);

    // 5. Save to Supabase
    const entry = await saveJournalEntry(user.id, content, aiAnalysis);

    return NextResponse.json({ success: true, entry }, { status: 201 });
  } catch (error) {
    console.error("[API] Journal POST error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process journal entry." },
      { status: 500 }
    );
  }
}

/**
 * GET /api/journal — Fetch journal entries for the authenticated user
 */
export async function GET() {
  try {
    // 1. Authenticate user
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2. Fetch entries
    const entries = await getJournalEntries(user.id, 20);

    return NextResponse.json({ success: true, entries });
  } catch (error) {
    console.error("[API] Journal GET error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch journal entries." },
      { status: 500 }
    );
  }
}
