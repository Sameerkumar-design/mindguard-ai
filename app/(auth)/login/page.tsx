"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Brain, ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative z-10 w-full max-w-md mx-4"
    >
      {/* Card */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-2xl shadow-2xl p-8 md:p-10">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 mb-8 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-600 to-blue-500 shadow-lg shadow-purple-500/20 transition-transform group-hover:scale-105">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
            MindGuard AI
          </span>
        </Link>

        <h1 className="text-2xl font-bold text-white mb-2">Welcome back</h1>
        <p className="text-zinc-400 text-sm mb-8">
          Sign in to your account to continue
        </p>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="login-email" className="text-zinc-300">
              Email address
            </Label>
            <Input
              id="login-email"
              type="email"
              placeholder="you@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-11 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus-visible:border-purple-500 focus-visible:ring-purple-500/30"
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="login-password" className="text-zinc-300">
                Password
              </Label>
              <Link
                href="#"
                className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="login-password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-zinc-500 pr-10 focus-visible:border-purple-500 focus-visible:ring-purple-500/30"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-red-400"
            >
              {error}
            </motion.p>
          )}

          {/* Submit */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-xl bg-white text-black font-semibold hover:bg-zinc-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] cursor-pointer"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                Sign in <ArrowRight className="h-4 w-4 ml-1" />
              </>
            )}
          </Button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-xs text-zinc-500 uppercase tracking-wider">
            or
          </span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        {/* Social login placeholder */}
        <Button
          variant="outline"
          className="w-full h-11 rounded-xl border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
        >
          Continue with Google
        </Button>

        {/* Sign-up redirect */}
        <p className="text-center text-sm text-zinc-500 mt-6">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
          >
            Create one
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
