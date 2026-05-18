<div align="center">

# 🧠 MindGuard AI

### AI-Powered Student Mental Wellness & Burnout Detection Platform

[![Next.js](https://img.shields.io/badge/Next.js_16-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)
[![Gemini AI](https://img.shields.io/badge/Gemini_2.0-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev)

*Built for Hackathon 2026 — Empowering students to take control of their mental health*

</div>

---

## ✨ Features

- 🔐 **Full Authentication** — Supabase email/password auth with session persistence, middleware protection, and secure cookie management
- 📓 **AI Mood Journal** — Write entries and get instant Gemini 2.0 Flash analysis of stress, burnout risk, emotional tone, and positivity
- 📊 **Live Wellness Dashboard** — Real-time score ring, burnout chart, quick stats, and AI insight cards — all driven by your journal data
- 💡 **Personalized Suggestions** — AI generates calming recommendations and wellness tips tailored to each entry
- 🛡️ **Production-Grade Security** — Row-Level Security, prompt injection resistance, input validation, security headers, and edge middleware
- 🎨 **Premium UI** — Glassmorphism dark design, Framer Motion animations, fully responsive

---

## 🖼️ Screenshots

| Landing Page | Dashboard | Journal Analysis |
|---|---|---|
| Premium animated hero, feature cards, testimonials | Live AI wellness score, burnout risk chart | AI mood breakdown with suggestions |

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 App Router |
| **Language** | TypeScript 5 |
| **Styling** | TailwindCSS v4 + shadcn/ui |
| **Animations** | Framer Motion |
| **Auth + DB** | Supabase (SSR + RLS) |
| **AI** | Google Gemini 2.0 Flash (`@google/genai`) |
| **Icons** | Lucide React |

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Sameerkumar-design/mindguard-ai.git
cd mindguard-ai
npm install
```

### 2. Configure environment variables

Create a `.env.local` file in the root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_google_gemini_api_key
```

- **Supabase** → [supabase.com](https://supabase.com) → New Project → Settings → API
- **Gemini API Key** → [aistudio.google.com](https://aistudio.google.com/app/apikey)

### 3. Set up the database

Run this SQL in your **Supabase SQL Editor**:

```sql
CREATE TABLE IF NOT EXISTS journal_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  ai_analysis JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own entries"
  ON journal_entries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own entries"
  ON journal_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_journal_entries_user_id
  ON journal_entries(user_id, created_at DESC);
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## 📁 Project Structure

```
mindguard-ai/
├── app/
│   ├── (auth)/            # Login & Signup pages
│   ├── (main)/            # Dashboard (protected)
│   ├── api/journal/       # REST API — POST & GET journal entries
│   └── actions/auth.ts    # Server Action — logout
├── components/
│   ├── dashboard/         # ScoreRing, AiInsightCard, JournalPanel
│   ├── landing/           # Hero, Features, Testimonials, CTA
│   └── layout/            # Navbar, Footer
├── lib/
│   ├── supabase/          # client.ts, server.ts, middleware.ts
│   ├── gemini.ts          # Gemini AI utility with validation
│   ├── database.ts        # Supabase CRUD helpers
│   └── types.ts           # Shared TypeScript interfaces
└── middleware.ts           # Edge route protection
```

---

## 🔒 Security Highlights

- ✅ **Row-Level Security** — users can only access their own journal data
- ✅ **Server-side API key** — `GEMINI_API_KEY` never exposed to the browser
- ✅ **Prompt injection resistance** — system prompt instructs Gemini to ignore embedded instructions
- ✅ **Input validation** — 5000-char cap, type checks, malformed JSON guard
- ✅ **Edge middleware** — unauthenticated requests to `/dashboard` and `/api/journal` rejected before reaching route handlers
- ✅ **Security headers** — X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy

---

## 🧠 How the AI Analysis Works

```
User writes journal entry
        ↓
POST /api/journal (auth checked at edge + route handler)
        ↓
Content validated (5–5000 chars, string type)
        ↓
Gemini 2.0 Flash analyzes with structured prompt
        ↓
Response validated & typed (stressLevel enum, numeric clamping)
        ↓
Saved to Supabase journal_entries (JSONB ai_analysis column)
        ↓
Dashboard updates live — score ring, stats, insights, suggestions
```

**AI Analysis Output:**
- Emotional summary
- Stress level (Low / Moderate / High / Critical)
- Burnout risk percentage (0–100)
- Positivity score (0–100)
- Emotional tone
- Anxiety indicators
- Wellness insights
- Personalized suggestions
- Calming recommendations

---

## 📜 License

MIT © 2026 [Sameer Kumar](https://github.com/Sameerkumar-design)

---

<div align="center">
  Built with ❤️ for student mental wellness
</div>
