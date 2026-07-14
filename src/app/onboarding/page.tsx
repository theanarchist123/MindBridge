"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Lock, Shield, Sparkles, ArrowRight, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// Floating particle for ambient background
function Particle({ delay, x, y, size }: { delay: number; x: number; y: number; size: number }) {
  return (
    <motion.div
      className="absolute rounded-full bg-teal-400/20 dark:bg-teal-300/10 pointer-events-none"
      style={{ left: `${x}%`, top: `${y}%`, width: size, height: size }}
      animate={{ y: [0, -20, 0], opacity: [0.3, 0.8, 0.3] }}
      transition={{ duration: 3 + delay, delay, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

const particles = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  delay: i * 0.3,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: 8 + Math.random() * 24,
}));

const STEPS = [
  {
    id: "notalone",
    gradient: "from-slate-900 via-teal-950 to-slate-900",
    accentColor: "teal",
  },
  {
    id: "privacy",
    gradient: "from-slate-900 via-indigo-950 to-slate-900",
    accentColor: "indigo",
  },
  {
    id: "checkin",
    gradient: "from-slate-900 via-rose-950 to-slate-900",
    accentColor: "rose",
  },
  {
    id: "start",
    gradient: "from-slate-900 via-emerald-950 to-slate-900",
    accentColor: "emerald",
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [step, setStep] = useState(0);
  const [isLeaving, setIsLeaving] = useState(false);

  const pseudonym = session?.user?.name || "Friend";

  // Deterministic gradient from pseudonym string
  const pseudonymColor = (() => {
    let hash = 0;
    for (let i = 0; i < pseudonym.length; i++) {
      hash = pseudonym.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash) % 360;
    return `hsl(${hue}, 70%, 60%)`;
  })();

  const markDone = async () => {
    await fetch("/api/auth/onboarding-done", { method: "PATCH" });
  };

  const handleFinish = async () => {
    setIsLeaving(true);
    await markDone();
    router.push("/assessment");
  };

  const handleSkip = async () => {
    await markDone();
    router.push("/home");
  };

  const nextStep = () => {
    if (step < STEPS.length - 1) setStep(step + 1);
    else handleFinish();
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col">
      {/* Dynamic background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className={`absolute inset-0 bg-gradient-to-br ${STEPS[step].gradient}`}
        />
      </AnimatePresence>

      {/* Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((p) => (
          <Particle key={p.id} {...p} />
        ))}
      </div>

      {/* Skip button */}
      <div className="relative z-10 flex justify-end p-6">
        <button
          onClick={handleSkip}
          className="text-white/40 hover:text-white/80 text-sm transition-colors"
        >
          Skip for now
        </button>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pb-20 max-w-lg mx-auto w-full">
        <AnimatePresence mode="wait">

          {/* Step 0 — You Are Not Alone */}
          {step === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-center space-y-8"
            >
              <motion.div
                animate={{ scale: [1, 1.05, 1], rotate: [0, 2, -2, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="text-8xl mx-auto"
              >
                🫂
              </motion.div>

              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl font-bold text-white font-heading leading-tight">
                  You are{" "}
                  <span className="text-teal-400">not alone</span>
                </h1>
                <p className="text-white/60 text-lg leading-relaxed max-w-sm mx-auto">
                  1 in 4 Indian college students experience mental health challenges. MindBridge exists so no one has to face it in silence.
                </p>
              </div>

              <div className="flex justify-center gap-3 text-white/40 text-sm">
                <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
                <span>Built for students, by people who care</span>
              </div>
            </motion.div>
          )}

          {/* Step 1 — Privacy + Pseudonym Reveal */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.6 }}
              className="text-center space-y-8 w-full"
            >
              <div className="space-y-2">
                <h2 className="text-3xl sm:text-4xl font-bold text-white font-heading">
                  Your identity is{" "}
                  <span className="text-indigo-400">protected</span>
                </h2>
                <p className="text-white/60 text-base max-w-sm mx-auto">
                  You signed up with a pseudonym — your real identity is never stored or shared.
                </p>
              </div>

              {/* Pseudonym reveal card */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="mx-auto max-w-xs"
              >
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 flex flex-col items-center gap-4">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                  >
                    <Sparkles className="w-8 h-8 text-indigo-300" />
                  </motion.div>
                  <p className="text-white/50 text-xs uppercase tracking-widest">Your identity</p>
                  <motion.div
                    className="text-3xl font-bold font-heading"
                    style={{ color: pseudonymColor }}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                  >
                    {pseudonym}
                  </motion.div>
                  <p className="text-white/40 text-xs">This is how you appear in MindBridge</p>
                </div>
              </motion.div>

              <div className="grid grid-cols-1 gap-2 text-left max-w-sm mx-auto">
                {[
                  { icon: Lock, text: "No real name, email, or ID stored" },
                  { icon: Shield, text: "Assessment data is anonymous by default" },
                  { icon: Heart, text: "You control what counsellors see" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3">
                    <Icon className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                    <span className="text-white/70 text-sm">{text}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 2 — First Mood Check-in Preview */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.6 }}
              className="text-center space-y-8 w-full"
            >
              <div className="space-y-2">
                <h2 className="text-3xl sm:text-4xl font-bold text-white font-heading">
                  Check in{" "}
                  <span className="text-rose-400">daily</span>
                </h2>
                <p className="text-white/60 text-base max-w-sm mx-auto">
                  30 seconds a day. That's all it takes to track your mental wellbeing over time.
                </p>
              </div>

              {/* Mood preview — interactive but non-functional to show the UI */}
              <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-6 max-w-sm mx-auto w-full">
                <p className="text-white/60 text-sm text-center mb-5">How are you feeling right now?</p>
                <div className="flex justify-between">
                  {[
                    { emoji: "😭", label: "Awful", color: "rose" },
                    { emoji: "😔", label: "Bad", color: "orange" },
                    { emoji: "😐", label: "Neutral", color: "amber" },
                    { emoji: "🙂", label: "Good", color: "teal" },
                    { emoji: "😄", label: "Great", color: "emerald" },
                  ].map((mood, i) => (
                    <motion.div
                      key={mood.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * i }}
                      whileHover={{ scale: 1.1 }}
                      className="flex flex-col items-center gap-1.5 cursor-default"
                    >
                      <span className="text-3xl">{mood.emoji}</span>
                      <span className="text-white/50 text-[10px]">{mood.label}</span>
                    </motion.div>
                  ))}
                </div>
                <p className="text-center text-white/30 text-xs mt-4">You'll do this for real after onboarding</p>
              </div>

              <p className="text-white/40 text-sm max-w-xs mx-auto">
                Your mood data builds a picture of your mental health over time — patterns you might not notice day-to-day.
              </p>
            </motion.div>
          )}

          {/* Step 3 — Journey Starts Here */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.6 }}
              className="text-center space-y-8 w-full"
            >
              <motion.div
                animate={{
                  boxShadow: [
                    "0 0 0 0 rgba(52,211,153,0)",
                    "0 0 0 20px rgba(52,211,153,0.1)",
                    "0 0 0 0 rgba(52,211,153,0)",
                  ],
                }}
                transition={{ duration: 2.5, repeat: Infinity }}
                className="w-24 h-24 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center"
              >
                <Heart className="w-12 h-12 text-emerald-400 fill-emerald-400" />
              </motion.div>

              <div className="space-y-3">
                <h2 className="text-3xl sm:text-4xl font-bold text-white font-heading">
                  Your journey starts here,{" "}
                  <span style={{ color: pseudonymColor }}>{pseudonym}</span>
                </h2>
                <p className="text-white/60 text-base max-w-sm mx-auto">
                  We recommend starting with a quick mental health assessment — it takes 5 minutes and gives you a clear baseline.
                </p>
              </div>

              <div className="flex flex-col gap-3 max-w-xs mx-auto w-full">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleFinish}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transition-colors"
                >
                  Take My First Assessment <ArrowRight className="w-5 h-5" />
                </motion.button>
                <button
                  onClick={handleSkip}
                  className="text-white/40 hover:text-white/70 text-sm transition-colors py-2"
                >
                  Explore dashboard first
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Bottom: step dots + next button */}
      <div className="relative z-10 p-6 flex items-center justify-between max-w-lg mx-auto w-full">
        {/* Step dots */}
        <div className="flex gap-2">
          {STEPS.map((_, i) => (
            <motion.button
              key={i}
              onClick={() => setStep(i)}
              animate={{ width: i === step ? 24 : 8 }}
              transition={{ type: "spring", stiffness: 300 }}
              className={`h-2 rounded-full transition-colors ${
                i === step ? "bg-white" : "bg-white/25"
              }`}
            />
          ))}
        </div>

        {/* Next button */}
        {step < 3 && (
          <Button
            onClick={nextStep}
            className="bg-white/20 hover:bg-white/30 text-white border-0 rounded-xl backdrop-blur"
          >
            Next <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        )}
      </div>
    </div>
  );
}
