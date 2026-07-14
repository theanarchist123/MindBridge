"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Shield, HeartHandshake, ChevronRight, Lock, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface ConsentBridgeProps {
  isOpen: boolean;
  onConsent: () => void;
  onDecline: () => void;
  assessmentType?: string;
  score?: number;
}

export function ConsentBridge({ isOpen, onConsent, onDecline, assessmentType, score }: ConsentBridgeProps) {
  const [phase, setPhase] = useState<"intro" | "confirm">("intro");
  const [isLoading, setIsLoading] = useState(false);

  const handleBuildBridge = async () => {
    setIsLoading(true);
    try {
      await fetch("/api/counsellor/consent", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ consentToContact: true, assessmentType, score }),
      });
      toast.success("Your counsellor has been notified", {
        description: "They'll reach out to you confidentially. You're brave for asking for help.",
      });
      onConsent();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="consent-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl"
        >
          <AnimatePresence mode="wait">
            {phase === "intro" ? (
              <motion.div
                key="intro"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Visual: The Bridge */}
                <div className="relative bg-gradient-to-br from-teal-500 to-slate-800 p-10 flex flex-col items-center overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_120%,rgba(45,212,191,0.3),transparent_70%)]" />
                  
                  {/* Bridge visual */}
                  <div className="relative flex items-center gap-4 mb-6">
                    {/* Student side */}
                    <motion.div
                      animate={{ x: [0, 2, 0] }}
                      transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                      className="flex flex-col items-center gap-2"
                    >
                      <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-2xl">
                        🧑‍🎓
                      </div>
                      <span className="text-white/60 text-xs font-medium">You</span>
                    </motion.div>

                    {/* Bridge arc */}
                    <div className="flex flex-col items-center gap-1">
                      <motion.div
                        className="flex gap-1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        {[0,1,2,3,4].map((i) => (
                          <motion.div
                            key={i}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.1 * i, type: "spring" }}
                            className="w-2 h-2 rounded-full bg-teal-300"
                          />
                        ))}
                      </motion.div>
                      <span className="text-teal-200 text-[10px] tracking-widest uppercase">Bridge</span>
                    </div>

                    {/* Counsellor side */}
                    <motion.div
                      animate={{ x: [0, -2, 0] }}
                      transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                      className="flex flex-col items-center gap-2"
                    >
                      <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-2xl">
                        🧑‍⚕️
                      </div>
                      <span className="text-white/60 text-xs font-medium">Counsellor</span>
                    </motion.div>
                  </div>

                  <h2 className="text-white text-xl font-bold text-center font-heading">
                    Would you like professional support?
                  </h2>
                  <p className="text-white/70 text-sm text-center mt-2 max-w-xs">
                    Your college counsellor can reach out to you. This is entirely your choice.
                  </p>
                </div>

                {/* Privacy Promise */}
                <div className="p-6 space-y-4">
                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 space-y-2">
                    {[
                      "Your pseudonym protects your identity",
                      "Only your college's counsellor sees this",
                      "You can withdraw consent anytime",
                    ].map((promise) => (
                      <div key={promise} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                        <Lock className="w-3.5 h-3.5 text-teal-500 flex-shrink-0" />
                        {promise}
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="ghost"
                      className="flex-1 text-slate-500"
                      onClick={onDecline}
                    >
                      Stay Anonymous
                    </Button>
                    <Button
                      className="flex-1 bg-teal-600 hover:bg-teal-700 text-white rounded-xl"
                      onClick={() => setPhase("confirm")}
                    >
                      Continue <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="p-8 flex flex-col items-center text-center gap-6"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
                  className="w-20 h-20 rounded-full bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center"
                >
                  <HeartHandshake className="w-10 h-10 text-teal-600 dark:text-teal-400" />
                </motion.div>

                <div>
                  <h2 className="text-xl font-bold font-heading text-slate-900 dark:text-white">
                    Build the Bridge
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 max-w-xs">
                    Your counsellor will see your assessment result and reach out confidentially. This takes courage.
                  </p>
                </div>

                <div className="w-full flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setPhase("intro")}
                  >
                    Go back
                  </Button>
                  <Button
                    className="flex-1 bg-teal-600 hover:bg-teal-700 text-white rounded-xl"
                    onClick={handleBuildBridge}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Shield className="w-4 h-4" /> Build the Bridge
                      </span>
                    )}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
