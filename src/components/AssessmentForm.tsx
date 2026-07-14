"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

// Simulated question banks based on type
const questionsData: Record<string, string[]> = {
  "PHQ-9": [
    "Little interest or pleasure in doing things",
    "Feeling down, depressed, or hopeless",
    "Trouble falling or staying asleep, or sleeping too much",
    "Feeling tired or having little energy",
    "Poor appetite or overeating",
    "Feeling bad about yourself - or that you are a failure or have let yourself or your family down",
    "Trouble concentrating on things, such as reading the newspaper or watching television",
    "Moving or speaking so slowly that other people could have noticed",
    "Thoughts that you would be better off dead, or of hurting yourself in some way",
  ],
  "GAD-7": [
    "Feeling nervous, anxious or on edge",
    "Not being able to stop or control worrying",
    "Worrying too much about different things",
    "Trouble relaxing",
    "Being so restless that it is hard to sit still",
    "Becoming easily annoyed or irritable",
    "Feeling afraid as if something awful might happen",
  ],
  "PSS-10": [
    "In the last month, how often have you been upset because of something that happened unexpectedly?",
    "In the last month, how often have you felt that you were unable to control the important things in your life?",
    "In the last month, how often have you felt nervous and 'stressed'?",
    "In the last month, how often have you felt confident about your ability to handle your personal problems?",
    "In the last month, how often have you felt that things were going your way?",
    "In the last month, how often have you found that you could not cope with all the things that you had to do?",
    "In the last month, how often have you been able to control irritations in your life?",
    "In the last month, how often have you felt that you were on top of things?",
    "In the last month, how often have you been angered because of things that were outside of your control?",
    "In the last month, how often have you felt difficulties were piling up so high that you could not overcome them?",
  ],
};

const standardOptions = [
  { value: 0, label: "Not at all" },
  { value: 1, label: "Several days" },
  { value: 2, label: "More than half the days" },
  { value: 3, label: "Nearly every day" },
];

const pssOptions = [
  { value: 0, label: "Never" },
  { value: 1, label: "Almost Never" },
  { value: 2, label: "Sometimes" },
  { value: 3, label: "Fairly Often" },
  { value: 4, label: "Very Often" },
];

export function AssessmentForm({ type, onComplete }: { type: "PHQ-9" | "GAD-7" | "PSS-10"; onComplete?: (score: number, isCritical: boolean) => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const questions = questionsData[type] || [];
  const progress = ((currentStep) / questions.length) * 100;
  
  // PSS-10 has 4 positively stated items (4, 5, 7, 8) that are reverse scored
  // Note: Question numbers are 1-indexed in docs, 0-indexed here (indices 3, 4, 6, 7)
  const isReverseScored = (index: number) => type === "PSS-10" && [3, 4, 6, 7].includes(index);
  
  const options = type === "PSS-10" ? pssOptions : standardOptions;

  const handleAnswer = async (value: number) => {
    // Apply reverse scoring if applicable
    const finalValue = isReverseScored(currentStep) ? 4 - value : value;
    const newAnswers = [...answers, finalValue];
    
    if (currentStep < questions.length - 1) {
      setAnswers(newAnswers);
      setCurrentStep(currentStep + 1);
    } else {
      setIsSubmitting(true);
      const totalScore = newAnswers.reduce((a, b) => a + b, 0);

      try {
        const res = await fetch("/api/assessment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type, answers: newAnswers, totalScore }),
        });
        
        if (res.ok) {
          const data = await res.json();
          if (onComplete) onComplete(totalScore, !!data.isCritical);
        } else {
          console.error("Failed to save assessment");
          if (onComplete) onComplete(totalScore, false); // fallback
        }
      } catch (err) {
        console.error(err);
        if (onComplete) onComplete(totalScore, false); // fallback
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (questions.length === 0) return <div>Invalid Assessment Type</div>;

  if (currentStep >= questions.length && isSubmitting) {
    return (
      <Card className="w-full max-w-2xl mx-auto p-12 text-center border-0 shadow-lg bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-4"
        >
          <div className="w-16 h-16 border-4 border-t-teal-500 border-r-teal-500 border-b-rose-500 border-l-rose-500 rounded-full animate-spin mx-auto"></div>
          <h3 className="text-xl font-heading text-slate-800 dark:text-slate-200">Analyzing responses...</h3>
        </motion.div>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto overflow-hidden border-0 shadow-2xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl">
      <div className="h-2 bg-slate-100 dark:bg-slate-800 w-full relative">
        <motion.div 
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-teal-400 to-rose-400"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      
      <CardContent className="p-8 sm:p-12">
        <div className="mb-8">
          <span className="text-sm font-medium text-teal-600 dark:text-teal-400 uppercase tracking-wider">
            {type} • Question {currentStep + 1} of {questions.length}
          </span>
          <div className="text-base sm:text-lg font-medium text-slate-600 dark:text-slate-400 mt-4 leading-tight">
            {type === "PSS-10" 
              ? "Please choose the option that best describes how often you felt or thought a certain way:"
              : "Over the last 2 weeks, how often have you been bothered by:"}
          </div>
          <h2 className="text-2xl sm:text-3xl font-heading text-rose-500 font-serif italic mt-4 leading-tight">
            "{questions[currentStep]}"
          </h2>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="grid gap-3"
          >
            {options.map((option) => (
              <Button
                key={option.value}
                variant="outline"
                className="w-full justify-start h-auto py-4 px-6 text-left text-base sm:text-lg rounded-xl border-slate-200 dark:border-slate-800 hover:border-teal-500 dark:hover:border-teal-500 hover:bg-teal-50 dark:hover:bg-teal-950/30 transition-all"
                onClick={() => handleAnswer(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
