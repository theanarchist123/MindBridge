"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  ArrowRight, Heart, Sparkles, MessageCircle, Lock, Zap,
  Brain, ShieldCheck, TrendingUp, Users, Star, CheckCircle,
  Menu, X, ChevronDown, Activity, BookOpen, Moon
} from "lucide-react";
import Link from "next/link";
import { Outfit } from "next/font/google";
import { useRef, useState, useEffect } from "react";

const outfit = Outfit({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800", "900"] });

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how" },
  { label: "For students", href: "#students" },
];

const STATS = [
  { value: "98%", label: "Privacy guaranteed", icon: Lock },
  { value: "24/7", label: "AI support available", icon: Brain },
  { value: "3 min", label: "Avg. check-in time", icon: Activity },
  { value: "10k+", label: "Students supported", icon: Users },
];

const FEATURES = [
  {
    icon: Lock,
    color: "teal",
    gradient: "from-teal-500/20 via-teal-400/5 to-transparent",
    ring: "ring-teal-500/30",
    glow: "rgba(20,184,166,0.15)",
    title: "End-to-end Private",
    desc: "Your conversations are fully anonymized. We never store, sell, or share your data. Total privacy is not a feature — it's our foundation.",
    img: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=600&q=80&auto=format&fit=crop",
  },
  {
    icon: Brain,
    color: "indigo",
    gradient: "from-indigo-500/20 via-indigo-400/5 to-transparent",
    ring: "ring-indigo-500/30",
    glow: "rgba(99,102,241,0.15)",
    title: "Clinical-Grade Tools",
    desc: "PHQ-9, GAD-7, and PSS-10 assessments built right into your dashboard. Track your mental health with the same tools used by clinicians.",
    img: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80&auto=format&fit=crop",
  },
  {
    icon: MessageCircle,
    color: "rose",
    gradient: "from-rose-500/20 via-rose-400/5 to-transparent",
    ring: "ring-rose-500/30",
    glow: "rgba(244,63,94,0.15)",
    title: "Peer Support Circles",
    desc: "Anonymous, moderated peer chat rooms for students facing the same pressures. You are never alone.",
    img: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80&auto=format&fit=crop",
  },
  {
    icon: Moon,
    color: "amber",
    gradient: "from-amber-500/20 via-amber-400/5 to-transparent",
    ring: "ring-amber-500/30",
    glow: "rgba(251,191,36,0.15)",
    title: "Daily Mood Tracking",
    desc: "Log your mood in seconds. Watch your emotional patterns emerge over time with beautiful, insightful visualizations.",
    img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=80&auto=format&fit=crop",
  },
  {
    icon: BookOpen,
    color: "emerald",
    gradient: "from-emerald-500/20 via-emerald-400/5 to-transparent",
    ring: "ring-emerald-500/30",
    glow: "rgba(16,185,129,0.15)",
    title: "Curated Resources",
    desc: "Science-backed exercises — breathing techniques, journaling prompts, body scans — recommended dynamically based on your check-ins.",
    img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80&auto=format&fit=crop",
  },
  {
    icon: TrendingUp,
    color: "sky",
    gradient: "from-sky-500/20 via-sky-400/5 to-transparent",
    ring: "ring-sky-500/30",
    glow: "rgba(14,165,233,0.15)",
    title: "Progress Over Time",
    desc: "Longitudinal charts of your wellbeing journey. Spot trends, celebrate growth, and share reports with a counsellor if you choose.",
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80&auto=format&fit=crop",
  },
];

const HOW_STEPS = [
  {
    num: "01",
    title: "Sign up anonymously",
    desc: "No real name, no student ID. Just a pseudonym and a university email — nothing more.",
    color: "teal",
  },
  {
    num: "02",
    title: "Complete your first check-in",
    desc: "Take a 3-minute mood log and an optional clinical assessment. Your dashboard comes alive instantly.",
    color: "indigo",
  },
  {
    num: "03",
    title: "Chat, explore, breathe",
    desc: "Talk to MindBot, join a peer circle, or explore resources tailored to your current state.",
    color: "rose",
  },
];

const TESTIMONIALS = [
  {
    text: "I finally feel like I have somewhere to go when the pressure gets too much. MindBridge is the first app that actually feels like it understands student life.",
    name: "Anonymous Student",
    role: "Engineering, 2nd Year",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&h=80&q=80&fit=crop&crop=face",
  },
  {
    text: "The PHQ-9 tracking showed me patterns I hadn't noticed. I brought the chart to my counsellor and it transformed our sessions.",
    name: "Anonymous Student",
    role: "Psychology, 3rd Year",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=80&h=80&q=80&fit=crop&crop=face",
  },
  {
    text: "I was skeptical about AI mental health tools. But MindBot doesn't pretend to be a therapist — it's more like a thoughtful friend at 2am when no one else is awake.",
    name: "Anonymous Student",
    role: "Medicine, 4th Year",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&q=80&fit=crop&crop=face",
  },
];

const colorMap: Record<string, string> = {
  teal: "#14b8a6",
  indigo: "#6366f1",
  rose: "#f43f5e",
  amber: "#f59e0b",
  emerald: "#10b981",
  sky: "#0ea5e9",
};

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={`w-full bg-[#060910] text-white flex flex-col relative overflow-x-hidden ${outfit.className}`}>

      {/* AMBIENT BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-15%] left-[-5%] w-[55%] h-[55%] bg-teal-500/10 rounded-full blur-[160px]" />
        <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[160px]" />
        <div className="absolute top-[50%] left-[45%] w-[30%] h-[30%] bg-rose-500/8 rounded-full blur-[120px]" />
        <svg className="absolute inset-0 w-full h-full opacity-[0.025]" xmlns="http://www.w3.org/2000/svg">
          <filter id="grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#grain)" />
        </svg>
      </div>

      {/* NAVBAR */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-[#060910]/80 backdrop-blur-xl border-b border-white/5 py-3" : "py-6"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2.5 group"
          >
            <div className="relative w-9 h-9">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-teal-400 to-indigo-500 blur-md opacity-60 group-hover:opacity-90 transition-opacity" />
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-teal-400 to-indigo-500 flex items-center justify-center shadow-lg">
                <Heart className="w-5 h-5 text-white fill-white" />
              </div>
            </div>
            <span className="text-xl font-bold tracking-tight">MindBridge</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="hidden md:flex items-center gap-8"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden md:flex items-center gap-3"
          >
            <Link href="/auth/signin" className="text-sm font-medium text-slate-400 hover:text-white transition-colors px-3 py-2">
              Sign in
            </Link>
            <Link
              href="/auth/signup"
              className="group text-sm font-semibold bg-white text-slate-950 px-5 py-2.5 rounded-full hover:bg-teal-50 transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)] flex items-center gap-1.5"
            >
              Get started free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </motion.div>

          <button
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-white/5 bg-[#060910]/95 backdrop-blur-xl overflow-hidden"
            >
              <div className="px-4 py-6 flex flex-col gap-4">
                {NAV_LINKS.map((link) => (
                  <a key={link.label} href={link.href} className="text-slate-300 font-medium py-1" onClick={() => setMenuOpen(false)}>
                    {link.label}
                  </a>
                ))}
                <div className="pt-2 flex flex-col gap-3">
                  <Link href="/auth/signin" className="text-center py-3 rounded-xl border border-white/10 text-slate-300 font-medium">Sign in</Link>
                  <Link href="/auth/signup" className="text-center py-3 rounded-xl bg-teal-500 text-slate-950 font-semibold">Get started free</Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* HERO */}
      <div ref={heroRef} className="relative min-h-screen flex flex-col items-center justify-center z-10 overflow-hidden">
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="absolute inset-0 pointer-events-none"
        >
          <img
            src="https://images.unsplash.com/photo-1545389336-cf090694435e?w=1800&q=70&auto=format&fit=crop"
            alt="Peaceful meditation background"
            className="w-full h-full object-cover opacity-[0.07]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#060910]/60 via-transparent to-[#060910]" />
        </motion.div>

        <div className="relative z-10 flex flex-col items-center text-center px-4 pt-36 pb-24 max-w-6xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/20 backdrop-blur-sm mb-10 cursor-default hover:bg-teal-500/15 transition-colors"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
            <span className="text-sm font-medium text-teal-300 tracking-wide">AI-powered mental wellness for students</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, type: "spring", damping: 20 }}
            className="text-6xl sm:text-7xl md:text-8xl lg:text-[96px] font-black leading-[1.0] tracking-[-0.04em] text-white max-w-5xl"
          >
            Your mind
            <br />
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-teal-300 to-emerald-400">
                deserves care.
              </span>
              <span className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-teal-500/0 via-teal-400/60 to-teal-500/0" />
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mt-8 text-lg sm:text-xl md:text-2xl text-slate-400 max-w-2xl leading-relaxed font-light"
          >
            MindBridge is the confidential mental health companion built for the unique pressures of student life.
            Anonymous. Clinical. Always here.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 flex flex-col sm:flex-row gap-4 items-center"
          >
            <Link
              href="/auth/signup"
              className="group relative px-8 py-4 rounded-full bg-teal-500 text-slate-950 font-bold text-base overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_50px_rgba(20,184,166,0.4)] hover:shadow-[0_0_80px_rgba(20,184,166,0.6)] flex items-center gap-2"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-teal-400 to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative flex items-center gap-2">
                Start for free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <Link
              href="/auth/signin"
              className="px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-medium text-base backdrop-blur-sm hover:bg-white/10 transition-all hover:scale-105 active:scale-95"
            >
              Sign in
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-6 text-xs text-slate-600 flex items-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            No real name required · GDPR compliant · End-to-end anonymous
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-20 flex flex-col items-center gap-2 text-slate-600 cursor-pointer hover:text-slate-400 transition-colors"
            onClick={() => document.getElementById("stats")?.scrollIntoView({ behavior: "smooth" })}
          >
            <span className="text-xs tracking-widest uppercase font-medium">Explore</span>
            <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
              <ChevronDown className="w-5 h-5" />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* STATS BAR */}
      <section id="stats" className="relative z-10 border-y border-white/5 bg-white/[0.02] backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center text-center gap-2"
            >
              <stat.icon className="w-5 h-5 text-teal-400 mb-1" />
              <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">{stat.value}</div>
              <div className="text-sm text-slate-500 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="relative z-10 py-32 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <span className="text-sm font-semibold text-teal-400 tracking-widest uppercase">Everything you need</span>
            <h2 className="mt-4 text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-tight">
              Built for the whole you
            </h2>
            <p className="mt-6 text-lg text-slate-400 max-w-xl mx-auto font-light">
              Six carefully designed pillars that work together to support your mental health from every angle.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feat, i) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -6 }}
                className="group relative p-6 rounded-2xl border border-white/8 bg-white/[0.03] hover:bg-white/[0.06] transition-all duration-500 overflow-hidden cursor-default"
                style={{ boxShadow: "0 0 0 0 transparent" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = `0 20px 60px ${feat.glow}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "0 0 0 0 transparent";
                }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

                <div className="relative h-44 rounded-xl overflow-hidden mb-6">
                  <img
                    src={feat.img}
                    alt={feat.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#060910]/80 to-transparent" />
                  <div
                    className="absolute bottom-3 left-3 w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${colorMap[feat.color]}25`, border: `1px solid ${colorMap[feat.color]}40` }}
                  >
                    <feat.icon className="w-5 h-5" style={{ color: colorMap[feat.color] }} />
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white mb-2 relative">{feat.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed relative">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="relative z-10 py-32 px-4 sm:px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <span className="text-sm font-semibold text-indigo-400 tracking-widest uppercase">How it works</span>
                <h2 className="mt-4 text-4xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                  From sign-up to support<br />in under 5 minutes.
                </h2>
                <p className="mt-6 text-slate-400 leading-relaxed font-light max-w-md">
                  No appointment. No waitlist. No judgment. Just open the app and you're already on your way.
                </p>
              </motion.div>

              <div className="mt-12 space-y-8">
                {HOW_STEPS.map((step, i) => (
                  <motion.div
                    key={step.num}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 }}
                    className="flex gap-5"
                  >
                    <div
                      className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-sm font-black"
                      style={{ backgroundColor: `${colorMap[step.color]}20`, color: colorMap[step.color], border: `1px solid ${colorMap[step.color]}30` }}
                    >
                      {step.num}
                    </div>
                    <div className="pt-1">
                      <h3 className="text-lg font-bold text-white mb-1">{step.title}</h3>
                      <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative h-[520px] hidden lg:block"
            >
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=700&q=80&auto=format&fit=crop"
                alt="Students supporting each other"
                className="absolute top-0 left-0 w-[75%] h-[65%] object-cover rounded-2xl shadow-2xl"
              />
              <img
                src="https://images.unsplash.com/photo-1590650153855-d9e808231d41?w=500&q=80&auto=format&fit=crop"
                alt="Student journaling mindfully"
                className="absolute bottom-0 right-0 w-[65%] h-[55%] object-cover rounded-2xl shadow-2xl border-4 border-[#060910]"
              />
              <div className="absolute bottom-28 left-4 bg-[#060910]/90 border border-white/10 backdrop-blur-sm rounded-xl px-4 py-3 flex items-center gap-3 shadow-xl">
                <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                <span className="text-sm font-semibold text-white">24/7 support active</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* IMMERSIVE BANNER */}
      <section id="students" className="relative z-10 my-8 mx-4 sm:mx-6 lg:mx-10 rounded-3xl overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1600&q=80&auto=format&fit=crop"
            alt="University campus life"
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-teal-950/90 via-[#060910]/80 to-indigo-950/90" />
        </div>
        <div className="relative z-10 px-8 sm:px-16 py-24 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <span className="text-sm font-semibold text-teal-400 tracking-widest uppercase">For students, by design</span>
            <h2 className="mt-4 text-4xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              The support system your campus should have.
            </h2>
            <p className="mt-6 text-slate-300 text-lg leading-relaxed max-w-lg font-light">
              Exam pressure. Imposter syndrome. Loneliness. Burnout. MindBridge was designed specifically around the mental health landscape of university students.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {["Anonymous check-ins", "Crisis support links", "Peer-moderated rooms", "CBT-based exercises", "Progress dashboards"].map((tag) => (
                <span key={tag} className="px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-sm font-medium text-white/80">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="flex-shrink-0">
            <Link
              href="/auth/signup"
              className="group px-8 py-4 rounded-full bg-teal-500 text-slate-950 font-bold text-base transition-all hover:scale-105 active:scale-95 shadow-[0_0_50px_rgba(20,184,166,0.5)] flex items-center gap-2"
            >
              Join thousands of students
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="relative z-10 py-32 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="flex justify-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />)}
            </div>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white">Loved by students</h2>
            <p className="mt-4 text-slate-400 max-w-md mx-auto">Real words from real students (shared anonymously with consent)</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="group p-6 rounded-2xl bg-white/[0.03] border border-white/8 hover:bg-white/[0.05] transition-all hover:-translate-y-1"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-slate-300 leading-relaxed text-sm mb-6">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <img src={t.avatar} alt="Student avatar" className="w-10 h-10 rounded-full object-cover opacity-70" />
                  <div>
                    <div className="text-sm font-semibold text-white">{t.name}</div>
                    <div className="text-xs text-slate-500">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative z-10 py-32 px-4 sm:px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-medium text-slate-300">Free for students, always</span>
            </div>
            <h2 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-tight">
              Take the first step.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">
                Your mind will thank you.
              </span>
            </h2>
            <p className="mt-8 text-lg text-slate-400 max-w-xl mx-auto font-light leading-relaxed">
              Sign up in 60 seconds. No real name, no credit card, no judgment. Just a safer space to breathe.
            </p>
            <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/signup"
                className="group px-10 py-5 rounded-full bg-teal-500 text-slate-950 font-bold text-lg transition-all hover:scale-105 active:scale-95 shadow-[0_0_60px_rgba(20,184,166,0.4)] hover:shadow-[0_0_100px_rgba(20,184,166,0.6)] flex items-center gap-2 justify-center"
              >
                Start for free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/auth/signin"
                className="px-10 py-5 rounded-full bg-white/5 border border-white/10 text-white font-medium text-lg hover:bg-white/10 transition-all hover:scale-105 active:scale-95"
              >
                Already have an account
              </Link>
            </div>
            <p className="mt-8 text-sm text-slate-600 flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4 text-teal-700" />
              No credit card · No personal data required · GDPR compliant
            </p>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/5 py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-teal-400 to-indigo-500 flex items-center justify-center">
              <Heart className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="font-bold text-white">MindBridge</span>
          </div>
          <p className="text-sm text-slate-600 text-center">
            © 2026 MindBridge. Built with care for student wellbeing.
          </p>
          <div className="flex items-center gap-6 text-sm text-slate-600">
            <a href="#" className="hover:text-slate-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Terms</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

