"use client";

import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Heart, Sparkles, MessageCircle } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex-1 w-full bg-slate-50 dark:bg-slate-950 flex flex-col relative overflow-x-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-50 dark:opacity-20 pointer-events-none" />
      
      {/* Navigation */}
      <nav className="relative z-10 p-4 sm:p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-rose-500 fill-rose-500" />
          <span className="font-heading text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">MindBridge</span>
        </div>
        <div className="flex gap-2 sm:gap-4">
          <Link href="/auth/signin" className={buttonVariants({ variant: "ghost", size: "sm", className: "sm:text-base" })}>
            Log in
          </Link>
          <Link href="/auth/signup" className={buttonVariants({ size: "sm", className: "bg-teal-600 hover:bg-teal-700 text-white rounded-full px-4 sm:px-6 sm:text-base" })}>
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 relative z-10 pb-20 pt-10">
        <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          
          <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-rose-100/50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/30 text-xs sm:text-sm font-medium mb-2 sm:mb-4">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>A confidential space for university students</span>
          </div>
          
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-heading font-bold text-slate-900 dark:text-white leading-[1.1] tracking-tight">
            Mental wellness,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-teal-300">without the wait.</span>
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-sans leading-relaxed px-2">
            Assess your mood, chat confidentially with our AI listener, and connect with peers who understand what you're going through.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center pt-2 sm:pt-4 w-full sm:w-auto px-4 sm:px-0">
            <Link href="/auth/signup" className={buttonVariants({ size: "lg", className: "w-full sm:w-auto h-12 sm:h-14 px-8 text-base sm:text-lg rounded-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 dark:text-slate-900 shadow-xl" })}>
              Start your journey <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
            <Link href="/about" className={buttonVariants({ size: "lg", variant: "outline", className: "w-full sm:w-auto h-12 sm:h-14 px-8 text-base sm:text-lg rounded-full bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200 dark:border-slate-800" })}>
              Learn more
            </Link>
          </div>
          
          <div className="pt-8 sm:pt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-left max-w-3xl mx-auto px-2 sm:px-0">
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-2">
              <div className="p-2 sm:p-3 bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-2xl w-fit">
                <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white">100% Confidential</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Your AI chats are never saved or sent to any server.</p>
            </div>
            
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-2">
              <div className="p-2 sm:p-3 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-2xl w-fit">
                <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white">Clinical Tools</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Standardized PHQ-9 and GAD-7 assessments built-in.</p>
            </div>
            
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-2">
              <div className="p-2 sm:p-3 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-2xl w-fit">
                <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white">Peer Support</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Anonymous live chat rooms with peers going through the same.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
