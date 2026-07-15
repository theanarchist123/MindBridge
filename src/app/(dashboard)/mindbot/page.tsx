"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BrainCircuit, Play, Flame, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ThoughtDetangler } from "@/components/ai/ThoughtDetangler";
import { SimulationSandbox } from "@/components/ai/SimulationSandbox";
import { VentBox } from "@/components/ai/VentBox";

type AITool = "hub" | "detangle" | "simulate" | "vent";

export default function MindBotPage() {
  const [activeTool, setActiveTool] = useState<AITool>("hub");

  return (
    <div className="fixed inset-0" style={{ zIndex: 0 }}>
      <AnimatePresence mode="wait">
        {activeTool === "hub" && (
          <motion.div
            key="hub"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full w-full overflow-y-auto overflow-x-hidden bg-slate-50 dark:bg-slate-950 pb-20 custom-scrollbar"
          >
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-500/10 dark:bg-teal-500/5 blur-[120px] pointer-events-none rounded-full" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-rose-500/10 dark:bg-rose-500/5 blur-[120px] pointer-events-none rounded-full" />

            <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-8 pt-12 sm:pt-20">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-xl">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h1 className="text-3xl sm:text-4xl font-heading font-bold text-slate-900 dark:text-white">AI Tools</h1>
              </div>
              <p className="text-slate-600 dark:text-slate-400 max-w-2xl text-lg mb-12">
                Practical, interactive AI exercises designed to help you untangle your thoughts, practice difficult conversations, and organize your mind.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* Option 1: Thought Detangler */}
                <Card 
                  onClick={() => setActiveTool("detangle")}
                  className="group cursor-pointer border-0 shadow-lg bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden relative"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-rose-500 group-hover:w-2 transition-all"></div>
                  <CardContent className="p-6 sm:p-8">
                    <div className="mb-6 p-4 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-2xl inline-block group-hover:scale-110 transition-transform">
                      <BrainCircuit className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-heading font-bold text-slate-900 dark:text-white mb-2">Thought Detangler</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                      Type an anxious thought. The AI will break it apart, identify cognitive distortions, and restructure it into a balanced perspective.
                    </p>
                  </CardContent>
                </Card>

                {/* Option 2: Simulation Sandbox */}
                <Card 
                  onClick={() => setActiveTool("simulate")}
                  className="group cursor-pointer border-0 shadow-lg bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden relative"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 group-hover:w-2 transition-all"></div>
                  <CardContent className="p-6 sm:p-8">
                    <div className="mb-6 p-4 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl inline-block group-hover:scale-110 transition-transform">
                      <Play className="w-8 h-8 ml-1" />
                    </div>
                    <h3 className="text-xl font-heading font-bold text-slate-900 dark:text-white mb-2">Simulation Sandbox</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                      Practice difficult conversations (roommates, professors). The AI roleplays the other person based on the scenario you set.
                    </p>
                  </CardContent>
                </Card>

                {/* Option 3: Vent Box */}
                <Card 
                  onClick={() => setActiveTool("vent")}
                  className="group cursor-pointer border-0 shadow-lg bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden relative"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-orange-500 group-hover:w-2 transition-all"></div>
                  <CardContent className="p-6 sm:p-8">
                    <div className="mb-6 p-4 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-2xl inline-block group-hover:scale-110 transition-transform">
                      <Flame className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-heading font-bold text-slate-900 dark:text-white mb-2">The Vent Box</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                      Brain dump everything stressing you out. The AI acts as an executive function assistant, identifying 1 or 2 actionable items.
                    </p>
                  </CardContent>
                </Card>

              </div>
            </div>
          </motion.div>
        )}

        {/* Tools */}
        {activeTool === "detangle" && (
          <motion.div key="detangle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full w-full bg-slate-50 dark:bg-slate-950 absolute inset-0 z-50">
            <ThoughtDetangler onBack={() => setActiveTool("hub")} />
          </motion.div>
        )}

        {activeTool === "simulate" && (
          <motion.div key="simulate" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full w-full bg-slate-50 dark:bg-slate-950 absolute inset-0 z-50">
            <SimulationSandbox onBack={() => setActiveTool("hub")} />
          </motion.div>
        )}

        {activeTool === "vent" && (
          <motion.div key="vent" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full w-full bg-[#0a0a0a] absolute inset-0 z-50">
            <VentBox onBack={() => setActiveTool("hub")} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
