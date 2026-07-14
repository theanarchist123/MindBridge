"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronRight, ChevronLeft, CheckCircle, Clock, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getResourceById, FILTER_LABELS } from "@/lib/resources";

export default function ResourceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const resource = getResourceById(params.id as string);

  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [isStarted, setIsStarted] = useState(false);

  if (!resource) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 text-slate-400">
        <span className="text-5xl">🔍</span>
        <p className="text-sm">Resource not found.</p>
        <Button variant="outline" onClick={() => router.push("/resources")}>
          Back to Toolkit
        </Button>
      </div>
    );
  }

  const steps = resource.steps || [];
  const isLastStep = currentStep === steps.length - 1;
  const allDone = completedSteps.size === steps.length;
  const filterInfo = FILTER_LABELS[resource.category];

  const markComplete = (index: number) => {
    setCompletedSteps((prev) => new Set([...prev, index]));
  };

  const goNext = () => {
    if (typeof window !== "undefined" && navigator.vibrate) {
      if (isLastStep) navigator.vibrate([100, 50, 100]); // Celebration buzz
      else navigator.vibrate(50); // Small tap
    }
    markComplete(currentStep);
    if (!isLastStep) setCurrentStep((s) => s + 1);
  };

  const goPrev = () => {
    if (typeof window !== "undefined" && navigator.vibrate) navigator.vibrate(30);
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  };

  return (
    <div className="max-w-2xl mx-auto pb-20 space-y-6">
      {/* Back nav */}
      <button
        onClick={() => router.push("/resources")}
        className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        Back to Toolkit
      </button>

      {/* Resource header */}
      <div className="bg-white dark:bg-slate-900/70 backdrop-blur rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xl">
        {/* Gradient top */}
        <div className={`h-2 w-full ${
          resource.type === "interactive" ? "bg-gradient-to-r from-teal-400 to-emerald-400" :
          resource.type === "guide"       ? "bg-gradient-to-r from-indigo-400 to-purple-400" :
          resource.type === "external"    ? "bg-gradient-to-r from-rose-400 to-pink-400" :
                                            "bg-gradient-to-r from-amber-400 to-orange-400"
        }`} />

        <div className="p-6 sm:p-8">
          <div className="flex items-start gap-4 mb-4">
            <span className="text-5xl">{resource.emoji}</span>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                  {filterInfo.emoji} {filterInfo.label}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {resource.duration}
                </span>
              </div>
              <h1 className="text-2xl font-heading font-bold text-slate-900 dark:text-white">
                {resource.title}
              </h1>
            </div>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
            {resource.description}
          </p>

          {resource.type === "external" && resource.link && (
            <a
              href={resource.link}
              className="mt-4 inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              {resource.externalLabel || "Open Resource"}
            </a>
          )}
        </div>
      </div>

      {/* Step-by-step guide */}
      {steps.length > 0 && (
        <div className="space-y-4">
          {!isStarted ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-900/70 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 text-center space-y-5 shadow-lg"
            >
              <div className="text-5xl">🎯</div>
              <div>
                <h2 className="font-heading font-bold text-slate-900 dark:text-white text-lg">
                  Ready to start?
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {steps.length} steps · ~{resource.duration}
                </p>
              </div>
              <Button
                onClick={() => {
                  if (typeof window !== "undefined" && navigator.vibrate) navigator.vibrate([50, 50]);
                  setIsStarted(true);
                }}
                className="bg-teal-600 hover:bg-teal-700 text-white px-8 rounded-xl"
              >
                Begin Guide
              </Button>
            </motion.div>
          ) : allDone ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-emerald-50 dark:bg-emerald-950/30 rounded-3xl border border-emerald-200 dark:border-emerald-800 p-8 text-center space-y-5"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, repeat: 3 }}
                className="text-5xl"
              >
                🎉
              </motion.div>
              <div>
                <h2 className="font-heading font-bold text-emerald-800 dark:text-emerald-300 text-xl">
                  You completed it!
                </h2>
                <p className="text-sm text-emerald-700 dark:text-emerald-400 mt-1">
                  Great work. Take a moment to notice how you feel now compared to when you started.
                </p>
              </div>
              <div className="flex gap-3 justify-center">
                <Button
                  variant="outline"
                  onClick={() => { setCurrentStep(0); setCompletedSteps(new Set()); }}
                  className="border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300"
                >
                  Do it again
                </Button>
                <Button
                  onClick={() => router.push("/resources")}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  Back to Toolkit
                </Button>
              </div>
            </motion.div>
          ) : (
            <>
              {/* Progress bar */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-teal-500 rounded-full"
                    animate={{ width: `${((completedSteps.size) / steps.length) * 100}%` }}
                    transition={{ type: "spring", stiffness: 100 }}
                  />
                </div>
                <span className="text-xs text-slate-400 shrink-0">
                  {completedSteps.size}/{steps.length}
                </span>
              </div>

              {/* Step dots */}
              <div className="flex gap-1.5 justify-center">
                {steps.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentStep(i)}
                    className={`transition-all rounded-full ${
                      completedSteps.has(i)
                        ? "w-5 h-2 bg-teal-500"
                        : i === currentStep
                        ? "w-5 h-2 bg-slate-700 dark:bg-slate-300"
                        : "w-2 h-2 bg-slate-300 dark:bg-slate-700"
                    }`}
                  />
                ))}
              </div>

              {/* Active step card */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white dark:bg-slate-900/70 backdrop-blur rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-teal-500/10 to-emerald-500/10 dark:from-teal-500/5 dark:to-emerald-500/5 px-6 pt-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-2">
                      <span className="bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400 px-2 py-0.5 rounded-full">
                        Step {currentStep + 1} of {steps.length}
                      </span>
                    </div>
                    <h2 className="font-heading font-bold text-slate-900 dark:text-white text-xl">
                      {steps[currentStep].title}
                    </h2>
                  </div>
                  <div className="px-6 py-6">
                    <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
                      {steps[currentStep].body}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              <div className="flex gap-3 justify-between">
                <Button
                  variant="outline"
                  onClick={goPrev}
                  disabled={currentStep === 0}
                  className="rounded-xl gap-1"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </Button>
                <Button
                  onClick={goNext}
                  className={`rounded-xl gap-1 flex-1 max-w-[200px] ${
                    isLastStep
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                      : "bg-teal-600 hover:bg-teal-700 text-white"
                  }`}
                >
                  {isLastStep ? (
                    <><CheckCircle className="w-4 h-4" /> Complete</>
                  ) : (
                    <>Next <ChevronRight className="w-4 h-4" /></>
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
