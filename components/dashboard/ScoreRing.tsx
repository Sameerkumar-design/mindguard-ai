"use client";

import { motion } from "framer-motion";

export function ScoreRing({
  score,
  size = 140,
  label = "Wellness",
}: {
  score: number;
  size?: number;
  label?: string;
}) {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  let color = "stroke-emerald-400";
  if (score < 50) color = "stroke-red-400";
  else if (score < 75) color = "stroke-amber-400";

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="stroke-white/5"
          fill="none"
          strokeWidth={8}
        />
        <motion.circle
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className={color}
          fill="none"
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={circumference}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-white">{score}</span>
        <span className="text-xs text-zinc-400">{label}</span>
      </div>
    </div>
  );
}
