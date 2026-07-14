"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const MOODS = [
  { value: 1, label: "Awful",   emoji: "😭", ring: "ring-rose-300 dark:ring-rose-700",   bg: "bg-rose-50 dark:bg-rose-900/20",    text: "text-rose-500" },
  { value: 2, label: "Bad",     emoji: "😔", ring: "ring-orange-300 dark:ring-orange-700", bg: "bg-orange-50 dark:bg-orange-900/20", text: "text-orange-500" },
  { value: 3, label: "Neutral", emoji: "😐", ring: "ring-amber-300 dark:ring-amber-700",   bg: "bg-amber-50 dark:bg-amber-900/20",   text: "text-amber-500" },
  { value: 4, label: "Good",    emoji: "🙂", ring: "ring-teal-300 dark:ring-teal-700",     bg: "bg-teal-50 dark:bg-teal-900/20",     text: "text-teal-500" },
  { value: 5, label: "Great",   emoji: "😄", ring: "ring-emerald-300 dark:ring-emerald-700", bg: "bg-emerald-50 dark:bg-emerald-900/20", text: "text-emerald-500" },
];

const TAGS = [
  { id: "exam-stress",  label: "Exam stress",   emoji: "📚" },
  { id: "sleep-issues", label: "Sleep issues",  emoji: "🌙" },
  { id: "social",       label: "Social",        emoji: "👥" },
  { id: "family",       label: "Family",        emoji: "🏠" },
  { id: "academic",     label: "Academic",      emoji: "🎓" },
  { id: "health",       label: "Health",        emoji: "🩺" },
  { id: "money",        label: "Money",         emoji: "💸" },
  { id: "relationships",label: "Relationships", emoji: "💛" },
];

const NOTE_QUOTES = [
  { min: 0,   max: 0,   text: "Write a note to your future self…" },
  { min: 1,   max: 49,  text: "Keep going…" },
  { min: 50,  max: 149, text: "You're doing great." },
  { min: 150, max: 299, text: "This is good. Let it out." },
  { min: 300, max: 500, text: "Beautiful. ✨" },
];

function getQuote(len: number) {
  return NOTE_QUOTES.find((q) => len >= q.min && (len <= q.max || q.max === 500))?.text ?? "";
}

export function MoodLogger({ onLogged }: { onLogged?: (mood: string) => void }) {
  const [phase, setPhase] = useState<"emoji" | "detail" | "done">("emoji");
  const [selectedMood, setSelectedMood] = useState<typeof MOODS[0] | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isReadyToSubmit = selectedMood !== null;
  const noteLen = note.length;

  const selectMood = (mood: typeof MOODS[0]) => {
    setSelectedMood(mood);
    // Bloom open phase 2 after a brief delay
    setTimeout(() => setPhase("detail"), 100);
  };

  const toggleTag = (id: string) => {
    setSelectedTags((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    if (!selectedMood || isSubmitting) return;
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/mood/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          score: selectedMood.value,
          emoji: selectedMood.emoji,
          tags: selectedTags,
          note: note.trim() || undefined,
        }),
      });

      if (!res.ok) throw new Error("Failed");

      setPhase("done");
      toast.success("Check-in saved 🌤️", {
        description: "Your mood has been logged. See you tomorrow.",
      });
      onLogged?.(selectedMood.label);

      // Reset after 2.5s
      setTimeout(() => {
        setPhase("emoji");
        setSelectedMood(null);
        setSelectedTags([]);
        setNote("");
      }, 2500);
    } catch {
      toast.error("Couldn't save your check-in. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      {/* ── Phase: Done ── */}
      <AnimatePresence>
        {phase === "done" && (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center gap-3 py-8 text-center"
          >
            <motion.div
              animate={{ scale: [1, 1.25, 1] }}
              transition={{ duration: 0.5, repeat: 2 }}
            >
              <CheckCircle className="w-12 h-12 text-emerald-500" />
            </motion.div>
            <p className="font-semibold text-slate-800 dark:text-white">Check-in saved!</p>
            <p className="text-xs text-slate-400">See you tomorrow{selectedMood ? ` ${selectedMood.emoji}` : ""}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {phase !== "done" && (
        <div className="space-y-5">
          {/* ── Emoji row — always visible ── */}
          <div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-3 text-center">
              How are you feeling right now?
            </p>
            <div className="flex justify-between gap-1">
              {MOODS.map((mood) => {
                const isSelected = selectedMood?.value === mood.value;
                return (
                  <motion.button
                    key={mood.value}
                    whileHover={{ scale: 1.08, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => selectMood(mood)}
                    className={`flex flex-col items-center justify-center p-2 sm:p-3 rounded-2xl transition-all duration-200 flex-1 ${
                      isSelected
                        ? `ring-2 ${mood.ring} ${mood.bg} shadow-md`
                        : "hover:bg-slate-100 dark:hover:bg-slate-800/60"
                    }`}
                  >
                    <span className={`text-2xl sm:text-3xl mb-1 transition-transform ${isSelected ? "scale-110" : ""}`}>
                      {mood.emoji}
                    </span>
                    <span className={`text-[10px] font-medium transition-colors ${isSelected ? mood.text : "text-slate-400"}`}>
                      {mood.label}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* ── Phase 2: Blooms open after emoji selected ── */}
          <AnimatePresence>
            {phase === "detail" && (
              <motion.div
                key="detail"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden space-y-5"
              >
                {/* Tags */}
                <div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2.5">
                    What's affecting your mood? <span className="text-slate-400">(optional)</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {TAGS.map((tag, i) => {
                      const isActive = selectedTags.includes(tag.id);
                      return (
                        <motion.button
                          key={tag.id}
                          initial={{ opacity: 0, y: 8, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ delay: i * 0.035, type: "spring", stiffness: 300 }}
                          onClick={() => toggleTag(tag.id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                            isActive
                              ? "bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 ring-1 ring-teal-400/50 shadow-sm"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                          }`}
                        >
                          <span>{tag.emoji}</span>
                          {tag.label}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Journal note */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      Field note <span className="text-slate-400">(optional)</span>
                    </p>
                    <motion.p
                      key={getQuote(noteLen)}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-[10px] text-slate-400 italic"
                    >
                      {getQuote(noteLen)}
                    </motion.p>
                  </div>
                  <Textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="What's on your mind today?"
                    maxLength={500}
                    rows={3}
                    className="resize-none text-sm rounded-xl bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus-visible:ring-teal-500/40"
                  />
                  <div className="flex justify-end mt-1">
                    <span className="text-[10px] text-slate-300 dark:text-slate-600">
                      {noteLen}/500
                    </span>
                  </div>
                </div>

                {/* Submit */}
                <motion.div
                  animate={isReadyToSubmit ? { scale: [1, 1.01, 1] } : { scale: 1 }}
                  transition={{ duration: 1, repeat: isReadyToSubmit ? Infinity : 0 }}
                >
                  <Button
                    onClick={handleSubmit}
                    disabled={!isReadyToSubmit || isSubmitting}
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white rounded-xl h-12 text-sm font-semibold shadow-lg shadow-teal-900/10 disabled:opacity-40"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Saving…
                      </span>
                    ) : (
                      `Log my check-in ${selectedMood?.emoji ?? ""}`
                    )}
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
