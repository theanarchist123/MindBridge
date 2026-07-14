"use client";

import { motion } from "framer-motion";
import { format } from "date-fns";
import { Tag } from "lucide-react";

interface JournalEntryProps {
  score: number;
  emoji: string;
  note?: string;
  tags?: string[];
  createdAt: string;
  index: number;
}

const TAG_COLORS: Record<string, string> = {
  "exam-stress": "bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300",
  "sleep-issues": "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300",
  "social": "bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300",
  "family": "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300",
  "academic": "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300",
  "other": "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400",
};

export function MoodJournalEntry({ score, emoji, note, tags, createdAt, index }: JournalEntryProps) {
  const date = new Date(createdAt);

  const borderColor = score >= 4 ? "border-l-emerald-400" :
    score === 3 ? "border-l-amber-400" :
    score === 2 ? "border-l-orange-400" :
    "border-l-rose-400";

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04 }}
      className={`bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-100 dark:border-slate-800 border-l-4 ${borderColor} p-4 group hover:shadow-md transition-shadow`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-2xl flex-shrink-0">{emoji}</span>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {format(date, "EEEE, MMM d")}
              </p>
              <span className="text-[10px] text-slate-300 dark:text-slate-600">
                {format(date, "h:mm a")}
              </span>
            </div>
            {note ? (
              <p className="text-sm text-slate-700 dark:text-slate-300 mt-0.5 leading-relaxed line-clamp-2 italic">
                "{note}"
              </p>
            ) : (
              <p className="text-xs text-slate-400 mt-0.5 italic">No field notes</p>
            )}
          </div>
        </div>
      </div>

      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {tags.map((tag) => (
            <span
              key={tag}
              className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${TAG_COLORS[tag] || TAG_COLORS["other"]}`}
            >
              {tag.replace(/-/g, " ")}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}
