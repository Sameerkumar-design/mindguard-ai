import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * GET /api/journal/[id] — Fetch a single journal entry by ID
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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

    const { data, error } = await supabase
      .from("journal_entries")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { success: false, error: "Entry not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, entry: data });
  } catch (error) {
    console.error("[API] Journal GET [id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch journal entry." },
      { status: 500 }
    );
  }
}
