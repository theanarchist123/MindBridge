"use client";

import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Heart, Sparkles, MessageCircle, Lock, Zap } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { Outfit } from "next/font/google";

const outfit = Outfit({ subsets: ["latin"] });

export default function LandingPage() {
  return (
    <div className={`flex-1 w-full bg-[#0a0f1c] text-white flex flex-col relative overflow-x-hidden ${outfit.className}`}>
      {/* Dynamic Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-teal-500/20 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-rose-500/20 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute top-[40%] left-[50%] w-[30%] h-[30%] bg-indigo-500/20 rounded-full blur-[100px] mix-blend-screen -translate-x-1/2" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518655048521-f130df041f66?auto=format&fit=crop&q=80&w=2000')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
      </div>
      
      {/* Navigation */}
      <nav className="relative z-10 px-6 py-6 flex justify-between items-center max-w-7xl mx-auto w-full">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-rose-400 flex items-center justify-center shadow-lg">
            <Heart className="w-6 h-6 text-white fill-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight">MindBridge</span>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex gap-4 items-center"
        >
          <Link href="/auth/signin" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
            Log in
          </Link>
          <Link href="/auth/signup" className="text-sm font-semibold bg-white text-slate-950 px-5 py-2.5 rounded-full hover:bg-slate-200 transition-transform hover:scale-105 active:scale-95">
            Get Started
          </Link>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 relative z-10 pt-20 pb-32 min-h-[85vh]">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 hover:bg-white/10 transition-colors cursor-default"
        >
          <Sparkles className="w-4 h-4 text-teal-400" />
          <span className="text-sm font-medium text-teal-100">The first AI-powered confidential space for students</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-5xl sm:text-7xl md:text-8xl font-bold leading-[1.05] tracking-tighter max-w-5xl mx-auto"
        >
          Mental wellness,<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-emerald-300 to-teal-400 animate-gradient-x">
            without the wait.
          </span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-lg sm:text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto font-light leading-relaxed"
        >
          Assess your mood, chat confidentially with our empathetic AI, and connect with peers who truly understand what you're going through.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-10 w-full sm:w-auto"
        >
          <Link href="/auth/signup" className="group relative w-full sm:w-auto h-14 px-8 flex items-center justify-center text-lg font-medium rounded-full bg-teal-500 text-slate-950 overflow-hidden transition-transform hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(20,184,166,0.3)] hover:shadow-[0_0_60px_rgba(20,184,166,0.5)]">
            <span className="relative z-10 flex items-center gap-2">
              Start your journey <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        </motion.div>

        {/* Feature Cards Showcase */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto px-4 w-full">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="group p-8 rounded-3xl bg-white/[0.02] border border-white/10 hover:bg-white/[0.04] transition-all hover:-translate-y-2 backdrop-blur-sm"
          >
            <div className="w-14 h-14 rounded-2xl bg-teal-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Lock className="w-7 h-7 text-teal-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-white">100% Confidential</h3>
            <p className="text-slate-400 leading-relaxed text-sm">Your AI chats are end-to-end anonymized. We never save or send them to any server. Your privacy is absolute.</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="group p-8 rounded-3xl bg-white/[0.02] border border-white/10 hover:bg-white/[0.04] transition-all hover:-translate-y-2 backdrop-blur-sm"
          >
            <div className="w-14 h-14 rounded-2xl bg-rose-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Zap className="w-7 h-7 text-rose-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-white">Clinical Tools</h3>
            <p className="text-slate-400 leading-relaxed text-sm">Access standardized PHQ-9 and GAD-7 assessments built directly into your dashboard to track your mental health over time.</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="group p-8 rounded-3xl bg-white/[0.02] border border-white/10 hover:bg-white/[0.04] transition-all hover:-translate-y-2 backdrop-blur-sm"
          >
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <MessageCircle className="w-7 h-7 text-indigo-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-white">Peer Support</h3>
            <p className="text-slate-400 leading-relaxed text-sm">Join anonymous, live chat rooms with peers going through the exact same stressors, moderated for your safety.</p>
          </motion.div>
        </div>

      </main>
    </div>
  );
}
