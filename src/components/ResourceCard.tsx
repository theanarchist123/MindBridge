"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Clock, Zap, BookOpen, ExternalLink, Dumbbell } from "lucide-react";
import { type Resource } from "@/lib/resources";

const TYPE_CONFIG = {
  interactive: { icon: Zap,          label: "Interactive",  bg: "bg-teal-50 dark:bg-teal-900/20",   text: "text-teal-600 dark:text-teal-300",   border: "border-teal-200/60 dark:border-teal-700/30" },
  guide:       { icon: BookOpen,     label: "Guide",        bg: "bg-indigo-50 dark:bg-indigo-900/20", text: "text-indigo-600 dark:text-indigo-300", border: "border-indigo-200/60 dark:border-indigo-700/30" },
  exercise:    { icon: Dumbbell,     label: "Exercise",     bg: "bg-amber-50 dark:bg-amber-900/20",   text: "text-amber-600 dark:text-amber-300",   border: "border-amber-200/60 dark:border-amber-700/30" },
  external:    { icon: ExternalLink, label: "External",     bg: "bg-rose-50 dark:bg-rose-900/20",     text: "text-rose-600 dark:text-rose-300",     border: "border-rose-200/60 dark:border-rose-700/30" },
};

interface ResourceCardProps {
  resource: Resource;
  index: number;
}

export function ResourceCard({ resource, index }: ResourceCardProps) {
  const typeConfig = TYPE_CONFIG[resource.type];
  const TypeIcon = typeConfig.icon;

  const cardContent = (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="group relative bg-white dark:bg-slate-900/70 backdrop-blur rounded-2xl border border-slate-200/70 dark:border-slate-800/70 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-slate-950/50 transition-all duration-300 cursor-pointer h-full flex flex-col"
    >
      {/* Top accent bar */}
      <div className={`h-1 w-full ${
        resource.type === "interactive" ? "bg-gradient-to-r from-teal-400 to-emerald-400" :
        resource.type === "guide"       ? "bg-gradient-to-r from-indigo-400 to-purple-400" :
        resource.type === "external"    ? "bg-gradient-to-r from-rose-400 to-pink-400" :
                                          "bg-gradient-to-r from-amber-400 to-orange-400"
      }`} />

      <div className="p-5 flex flex-col gap-4 flex-1">
        {/* Emoji + Type badge row */}
        <div className="flex items-start justify-between">
          <motion.div
            whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
            transition={{ duration: 0.4 }}
            className="text-4xl select-none"
          >
            {resource.emoji}
          </motion.div>
          <div className={`flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full border ${typeConfig.bg} ${typeConfig.text} ${typeConfig.border}`}>
            <TypeIcon className="w-2.5 h-2.5" />
            {typeConfig.label}
          </div>
        </div>

        {/* Title + description */}
        <div className="flex-1">
          <h3 className="font-heading font-bold text-slate-900 dark:text-white text-sm sm:text-base leading-snug mb-1.5 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
            {resource.title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
            {resource.shortDesc}
          </p>
        </div>

        {/* Footer: duration + CTA */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/60">
          <div className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
            <Clock className="w-3 h-3" />
            {resource.duration}
          </div>
          <div className={`flex items-center gap-1 text-xs font-semibold ${typeConfig.text} group-hover:gap-2 transition-all`}>
            {resource.type === "external" ? "Open" : "Start"}
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </motion.div>
  );

  if (resource.type === "external" && resource.link) {
    return (
      <a href={resource.link} target="_blank" rel="noopener noreferrer" className="h-full block">
        {cardContent}
      </a>
    );
  }

  return (
    <Link href={`/resources/${resource.id}`} className="h-full block">
      {cardContent}
    </Link>
  );
}
