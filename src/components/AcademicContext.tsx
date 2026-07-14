"use client";

import { useEffect, useState } from "react";
import { BookOpen, GraduationCap, Briefcase } from "lucide-react";
import { motion } from "framer-motion";
import { AcademicEvent } from "@/lib/academicCalendars";

export function AcademicContext() {
  const [data, setData] = useState<{ period: AcademicEvent | null, college?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAcademic() {
      try {
        const res = await fetch("/api/context/academic");
        if (!res.ok) throw new Error("Failed");
        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error("Failed to check academic context:", error);
      } finally {
        setLoading(false);
      }
    }

    checkAcademic();
  }, []);

  if (loading || !data?.period) return null;

  const { period, college } = data;
  
  const icon = 
    period.type === "placements" ? <Briefcase className="w-5 h-5 text-indigo-600 dark:text-indigo-300" /> :
    period.type === "finals" ? <GraduationCap className="w-5 h-5 text-indigo-600 dark:text-indigo-300" /> :
    <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-300" />;

  const message = period.type === "placements" 
    ? `It's Placement Season at ${college}. Rejection and stress run high right now. Remember that your worth is not tied to a job offer.`
    : `Looks like it's ${period.name} at ${college}. It's completely normal to feel overwhelmed right now. Remember to prioritize sleep — your brain needs it to encode what you've studied.`;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl p-4 mb-6 flex items-start gap-4 border border-indigo-100 dark:border-indigo-800/50"
    >
      <div className="bg-indigo-100 dark:bg-indigo-800/60 p-2 rounded-full shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-sm text-indigo-900 dark:text-indigo-200 leading-relaxed font-medium">
          {message}
        </p>
      </div>
    </motion.div>
  );
}
