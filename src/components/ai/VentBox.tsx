"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function VentBox({ onBack }: { onBack: () => void }) {
  const [ventText, setVentText] = useState("");
  const [status, setStatus] = useState<"typing" | "processing" | "done">("typing");
  const [summary, setSummary] = useState("");

  const handleProcess = async () => {
    if (!ventText.trim()) return;
    setStatus("processing");

    try {
      const res = await fetch("/api/ai/vent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: ventText }),
      });

      if (!res.ok) throw new Error("Failed to process");
      const data = await res.json();
      setSummary(data.summary);
      setStatus("done");
    } catch (err) {
      console.error(err);
      setSummary("Something went wrong. But just writing it out often helps. Take a deep breath.");
      setStatus("done");
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] text-slate-300 relative overflow-hidden">
      
      {/* Header */}
      <div className="flex items-center p-4 border-b border-white/10 relative z-10">
        <Button variant="ghost" size="icon" onClick={onBack} className="text-slate-400 hover:text-white hover:bg-white/10 rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="ml-3 flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-500" />
          <h2 className="font-heading font-semibold text-white">The Vent Box</h2>
        </div>
      </div>

      <div className="flex-1 relative p-4 sm:p-8 flex flex-col max-w-3xl mx-auto w-full z-10">
        <AnimatePresence mode="wait">
          
          {status === "typing" && (
            <motion.div
              key="typing"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
              transition={{ duration: 0.5 }}
              className="flex flex-col h-full"
            >
              <p className="text-slate-400 mb-4 text-sm">
                Get it all out. Don't worry about grammar, punctuation, or making sense. Just brain dump everything stressing you out right now.
              </p>
              
              <textarea
                value={ventText}
                onChange={(e) => setVentText(e.target.value)}
                placeholder="I am so overwhelmed because..."
                className="flex-1 w-full bg-transparent border-0 focus:ring-0 text-xl sm:text-2xl font-serif text-slate-300 placeholder:text-slate-700 resize-none custom-scrollbar"
                autoFocus
              />

              <div className="pt-4 flex justify-end">
                <Button 
                  onClick={handleProcess}
                  disabled={!ventText.trim()}
                  className="bg-orange-600 hover:bg-orange-700 text-white rounded-full px-6 shadow-[0_0_20px_rgba(234,88,12,0.3)]"
                >
                  <Flame className="w-4 h-4 mr-2" />
                  Burn & Process
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
              className="flex flex-col items-center justify-center h-full space-y-6"
            >
              <motion.div 
                animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="relative"
              >
                <div className="absolute inset-0 bg-orange-500 blur-[40px] opacity-40 rounded-full"></div>
                <Flame className="w-16 h-16 text-orange-500 relative z-10" />
              </motion.div>
              <div className="text-center">
                <h3 className="text-xl font-heading text-white">Incinerating the noise...</h3>
                <p className="text-slate-400 mt-2">Extracting only what matters.</p>
              </div>
            </motion.div>
          )}

          {status === "done" && (
            <motion.div
              key="done"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col h-full items-center justify-center max-w-xl mx-auto w-full"
            >
              <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl w-full shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-rose-500"></div>
                
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-emerald-500/20 p-2 rounded-full">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-heading text-white font-semibold">Signal from the Noise</h3>
                </div>

                <div className="prose prose-invert prose-orange max-w-none text-slate-300">
                  {summary.split('\n').map((line, i) => (
                    <p key={i} className="mb-2">{line}</p>
                  ))}
                </div>

                <Button 
                  onClick={onBack}
                  className="w-full mt-8 bg-slate-800 hover:bg-slate-700 text-white rounded-xl"
                >
                  I've got this
                </Button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
