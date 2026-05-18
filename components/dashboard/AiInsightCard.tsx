"use client";

import { motion } from "framer-motion";
import { Clock, type LucideIcon } from "lucide-react";

interface AiInsightCardProps {
  title: string;
  description: string;
  time: string;
  icon: LucideIcon;
  color: string;
  index: number;
}

export function AiInsightCard({
  title,
  description,
  time,
  icon: Icon,
  color,
  index,
}: AiInsightCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 + index * 0.12 }}
      className="flex gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors group cursor-pointer"
    >
      <div className="mt-0.5">
        <Icon className={`h-5 w-5 ${color}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-sm font-medium text-white group-hover:text-purple-300 transition-colors">
            {title}
          </h4>
          <span className="text-[10px] text-zinc-500 whitespace-nowrap flex items-center gap-1">
            <Clock className="h-3 w-3" /> {time}
          </span>
        </div>
        <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
          {description}
        </p>
      </div>
    </motion.div>
  );
}
