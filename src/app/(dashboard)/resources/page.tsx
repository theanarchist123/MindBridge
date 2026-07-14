"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ResourceCard } from "@/components/ResourceCard";
import { RESOURCES, FILTER_LABELS, type ResourceCategory } from "@/lib/resources";

const FILTERS: ResourceCategory[] = ["right-now", "tonight", "this-week"];

export default function ResourcesPage() {
  const [activeFilter, setActiveFilter] = useState<ResourceCategory>("right-now");

  const filtered = RESOURCES.filter((r) => r.category === activeFilter);
  const filterInfo = FILTER_LABELS[activeFilter];

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl sm:text-4xl font-heading font-bold text-slate-900 dark:text-white"
        >
          🧰 The Toolkit
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-slate-500 dark:text-slate-400 mt-1.5 max-w-xl"
        >
          Evidence-based tools, techniques, and resources — picked for Indian college students.
        </motion.p>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex gap-2 flex-wrap">
          {FILTERS.map((filter) => {
            const info = FILTER_LABELS[filter];
            const isActive = filter === activeFilter;
            return (
              <motion.button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                whileTap={{ scale: 0.97 }}
                className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg"
                    : "bg-white dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                <span>{info.emoji}</span>
                <span>{info.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="filter-underline"
                    className="absolute inset-0 rounded-xl ring-2 ring-slate-900/10 dark:ring-white/10"
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Category description */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeFilter}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 10 }}
          transition={{ duration: 0.25 }}
          className="flex items-center gap-3 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3"
        >
          <span className="text-2xl">{filterInfo.emoji}</span>
          <div>
            <p className="font-semibold text-slate-900 dark:text-white text-sm">{filterInfo.label}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{filterInfo.desc}</p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Resource grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeFilter}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {filtered.map((resource, i) => (
            <ResourceCard key={resource.id} resource={resource} index={i} />
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Bottom nudge */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center py-6 border-t border-slate-200 dark:border-slate-800"
      >
        <p className="text-sm text-slate-400 dark:text-slate-500">
          Need immediate professional help?{" "}
          <a
            href="tel:9152987821"
            className="font-semibold text-teal-600 dark:text-teal-400 hover:underline"
          >
            Call iCall: 9152987821
          </a>{" "}
          · Mon–Sat, 8am–10pm
        </p>
      </motion.div>
    </div>
  );
}
