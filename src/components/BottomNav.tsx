"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, FileText, Bot, Users, BarChart2, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/home",       icon: Home,      label: "Home" },
  { href: "/assessment", icon: FileText,  label: "Assess" },
  { href: "/mindbot",    icon: Bot,       label: "MindBot" },
  { href: "/peer",       icon: Users,     label: "Peer" },
  { href: "/resources",  icon: BookOpen,  label: "Toolkit" },
  { href: "/mood",       icon: BarChart2, label: "Mood" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      {/* Frosted glass bar */}
      <div className="bg-white/80 dark:bg-slate-950/90 backdrop-blur-2xl border-t border-slate-200/60 dark:border-slate-800/60 shadow-[0_-8px_32px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-start sm:justify-center overflow-x-auto [&::-webkit-scrollbar]:hidden w-full px-4 pb-safe gap-2 sm:gap-6">
          {tabs.map((tab) => {
            const isActive = pathname.startsWith(tab.href);
            const Icon = tab.icon;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className="relative flex flex-col items-center justify-center py-4 px-2 min-w-[72px] shrink-0 group"
              >
                {/* Active indicator pill */}
                {isActive && (
                  <motion.div
                    layoutId="bottom-nav-indicator"
                    className="absolute inset-x-1 top-2 h-10 rounded-full bg-teal-500/10 dark:bg-teal-400/10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}

                <div className="relative flex flex-col items-center gap-1">
                  {/* Glow blob behind active icon */}
                  {isActive && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="absolute inset-0 rounded-full blur-md bg-teal-400/30 dark:bg-teal-400/20 scale-150"
                    />
                  )}
                  <Icon
                    className={cn(
                      "relative w-6 h-6 transition-all duration-200",
                      isActive
                        ? "text-teal-600 dark:text-teal-400"
                        : "text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-400"
                    )}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  <span
                    className={cn(
                      "text-xs font-medium tracking-tight transition-all duration-200",
                      isActive
                        ? "text-teal-600 dark:text-teal-400"
                        : "text-slate-400 dark:text-slate-500"
                    )}
                  >
                    {tab.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
