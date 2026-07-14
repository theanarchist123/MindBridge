"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Sparkles, BrainCircuit, RefreshCw, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThoughtDetangler({ onBack }: { onBack: () => void }) {
  const [thought, setThought] = useState("");
  const [status, setStatus] = useState<"input" | "processing" | "result">("input");
  const [result, setResult] = useState<{
    distortionType: string;
    rationale: string;
    balancedThought: string;
  } | null>(null);

  const handleProcess = async () => {
    if (!thought.trim()) return;
    setStatus("processing");

    try {
      const res = await fetch("/api/ai/detangle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ thought }),
      });

      if (!res.ok) throw new Error("Failed to process");
      const data = await res.json();
      setResult(data);
      setStatus("result");
    } catch (err) {
      console.error(err);
      // Fallback
      setResult({
        distortionType: "Negative Filter",
        rationale: "We sometimes focus exclusively on the negative aspects of a situation while ignoring the positive.",
        balancedThought: "This is tough, but I have handled tough things before."
      });
      setStatus("result");
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 relative">
      <div className="flex items-center p-4 border-b border-slate-200 dark:border-slate-800 relative z-10 bg-white/50 dark:bg-slate-950/50 backdrop-blur-xl">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="ml-3 flex items-center gap-2 text-rose-500">
          <BrainCircuit className="w-5 h-5" />
          <h2 className="font-heading font-semibold text-slate-900 dark:text-white">Thought Detangler</h2>
        </div>
      </div>

      <div className="flex-1 p-4 sm:p-8 max-w-3xl mx-auto w-full flex flex-col justify-center relative">
        <AnimatePresence mode="wait">
          
          {status === "input" && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
              className="space-y-6 w-full"
            >
              <div className="text-center space-y-2 mb-8">
                <h1 className="text-3xl font-heading text-slate-900 dark:text-white">What's on your mind?</h1>
                <p className="text-slate-500">Type a negative or anxious thought you're having right now.</p>
              </div>

              <div className="relative">
                <textarea
                  value={thought}
                  onChange={(e) => setThought(e.target.value)}
                  placeholder="e.g. I'm going to fail this exam and my life is over..."
                  className="w-full min-h-[160px] bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 focus:border-rose-400 dark:focus:border-rose-500 rounded-3xl p-6 text-xl sm:text-2xl font-serif text-slate-700 dark:text-slate-300 placeholder:text-slate-400 dark:placeholder:text-slate-600 resize-none shadow-sm transition-all focus:ring-4 focus:ring-rose-500/10"
                  autoFocus
                />
              </div>

              <div className="flex justify-center pt-4">
                <Button 
                  onClick={handleProcess}
                  disabled={!thought.trim()}
                  className="bg-rose-500 hover:bg-rose-600 text-white rounded-full px-8 py-6 h-auto text-lg shadow-xl shadow-rose-500/20 group"
                >
                  <Sparkles className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                  Detangle Thought
                </Button>
              </div>
            </motion.div>
          )}

          {status === "processing" && (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center space-y-6"
            >
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              >
                <RefreshCw className="w-12 h-12 text-rose-400 opacity-50" />
              </motion.div>
              <h3 className="text-xl font-heading text-slate-600 dark:text-slate-300">Restructuring...</h3>
            </motion.div>
          )}

          {status === "result" && result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full space-y-8"
            >
              {/* Original Thought (Shattered / crossed out visually) */}
              <div className="relative p-6 rounded-3xl bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 opacity-60">
                <p className="text-lg font-serif italic text-slate-500 line-through decoration-rose-500/50 decoration-2">
                  "{thought}"
                </p>
              </div>

              {/* Cognitive Distortion Analysis */}
              <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-rose-500"></div>
                <h3 className="text-sm font-bold text-rose-500 uppercase tracking-widest mb-1">Cognitive Distortion Detected</h3>
                <h2 className="text-2xl font-heading text-slate-900 dark:text-white mb-4">{result.distortionType}</h2>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {result.rationale}
                </p>
              </div>

              {/* Balanced Thought */}
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-8 rounded-3xl shadow-xl shadow-emerald-500/20 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <CheckCircle className="w-32 h-32" />
                </div>
                <h3 className="text-sm font-bold text-emerald-100 uppercase tracking-widest mb-4 relative z-10">Balanced Perspective</h3>
                <p className="text-2xl font-serif leading-tight relative z-10">
                  "{result.balancedThought}"
                </p>
              </div>

              <div className="flex justify-center pt-8">
                <Button 
                  onClick={() => {
                    setThought("");
                    setStatus("input");
                    setResult(null);
                  }}
                  variant="outline"
                  className="rounded-full px-8 py-6 h-auto text-lg"
                >
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Detangle Another
                </Button>
              </div>

            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
