import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { analyzeJournalEntry } from "@/lib/gemini";
import { saveJournalEntry, getJournalEntries } from "@/lib/database";

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

    // 2. Parse request body
    const body = await request.json();
    const content = body.content?.trim();

    if (!content || content.length < 5) {
      return NextResponse.json(
        {
          success: false,
          error: "Journal entry must be at least 5 characters.",
        },
        { status: 400 }
      );
    }

    // 3. Analyze with Gemini AI
    const aiAnalysis = await analyzeJournalEntry(content);

    // 4. Save to Supabase
    const entry = await saveJournalEntry(user.id, content, aiAnalysis);

    return NextResponse.json({ success: true, entry }, { status: 201 });
  } catch (error) {
    console.error("Journal POST error:", error);
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
    console.error("Journal GET error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch journal entries." },
      { status: 500 }
    );
  }
}
