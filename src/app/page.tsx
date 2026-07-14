"use client";

import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Heart, Sparkles, MessageCircle } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-50 dark:opacity-20 pointer-events-none" />
      
      {/* Navigation */}
      <nav className="relative z-10 p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <Heart className="w-8 h-8 text-rose-500 fill-rose-500" />
          <span className="font-heading text-2xl font-bold text-slate-900 dark:text-white">MindBridge</span>
        </div>
        <div className="flex gap-4">
          <Link href="/auth/signin" className={buttonVariants({ variant: "ghost" })}>
            Log in
          </Link>
          <Link href="/auth/signup" className={buttonVariants({ className: "bg-teal-600 hover:bg-teal-700 text-white rounded-full px-6" })}>
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 relative z-10 pb-20 pt-10">
        <motion.div 
          className="max-w-4xl mx-auto space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-100/50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/30 text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            <span>A confidential space for university students</span>
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-5xl sm:text-6xl md:text-7xl font-heading font-bold text-slate-900 dark:text-white leading-[1.1] tracking-tight">
            Mental wellness,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-teal-300">without the wait.</span>
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-sans leading-relaxed">
            Assess your mood, chat confidentially with our AI listener, and connect with peers who understand what you're going through.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link href="/auth/signup" className={buttonVariants({ size: "lg", className: "h-14 px-8 text-lg rounded-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 dark:text-slate-900 shadow-xl" })}>
              Start your journey <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link href="/about" className={buttonVariants({ size: "lg", variant: "outline", className: "h-14 px-8 text-lg rounded-full bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200 dark:border-slate-800" })}>
              Learn more
            </Link>
          </motion.div>
          
          <motion.div variants={itemVariants} className="pt-12 grid grid-cols-1 sm:grid-cols-3 gap-8 text-left max-w-3xl mx-auto">
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-2">
              <div className="p-3 bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-2xl w-fit">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white">100% Confidential</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Your AI chats are never saved or sent to any server.</p>
            </div>
            
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-2">
              <div className="p-3 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-2xl w-fit">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white">Clinical Tools</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Standardized PHQ-9 and GAD-7 assessments built-in.</p>
            </div>
            
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-2">
              <div className="p-3 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-2xl w-fit">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white">Peer Support</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Anonymous live chat rooms with peers going through the same.</p>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
