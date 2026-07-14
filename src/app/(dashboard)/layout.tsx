"use client";

import { signOut, useSession } from "next-auth/react";
import { Heart, Home, FileText, Bot, Users, BarChart2, BookOpen, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { BottomNav } from "@/components/BottomNav";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/home",       icon: Home,      label: "Home" },
  { href: "/assessment", icon: FileText,  label: "Assessments" },
  { href: "/mindbot",    icon: Bot,       label: "MindBot" },
  { href: "/peer",       icon: Users,     label: "Peer Support" },
  { href: "/mood",       icon: BarChart2, label: "Mood" },
  { href: "/resources",  icon: BookOpen,  label: "Resources" },
];

// Generate a deterministic gradient color from a string (pseudonym)
function getPseudonymColors(name: string): { bg: string; text: string } {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return {
    bg: `hsl(${hue}, 60%, 88%)`,
    text: `hsl(${hue}, 60%, 35%)`,
  };
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const pseudonym = session?.user?.name || "...";
  const colors = getPseudonymColors(pseudonym);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-mesh opacity-30 pointer-events-none" />

      {/* Desktop top header */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl">
        <div className="flex h-16 items-center px-6 max-w-7xl mx-auto w-full justify-between">
          <Link href="/home" className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
            <span className="font-heading text-xl font-bold text-slate-900 dark:text-white">MindBridge</span>
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, icon: Icon, label }) => {
              const isActive = pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                    isActive
                      ? "bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300"
                      : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            {/* Pseudonym avatar */}
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold select-none"
              style={{ background: colors.bg, color: colors.text }}
              title={pseudonym}
            >
              {pseudonym.slice(0, 2).toUpperCase()}
            </div>

            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "text-slate-600 dark:text-slate-400"
              )}
            >
              <LogOut className="w-4 h-4 mr-2" /> Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Page content — bottom padding on mobile for bottom nav */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-6 relative z-10 pb-24 md:pb-6">
        {children}
      </main>

      {/* Mobile bottom tab bar */}
      <BottomNav />
    </div>
  );
}
