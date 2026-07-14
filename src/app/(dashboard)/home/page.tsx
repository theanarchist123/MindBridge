"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MoodLogger } from "@/components/MoodLogger";
import { TrendChart } from "@/components/TrendChart";
import { MindBotWindow } from "@/components/MindBotWindow";
import { LiveActiveUsers } from "@/components/LiveActiveUsers";
import { SettingsDialog } from "@/components/SettingsDialog";
import { CrisisOverlay } from "@/components/CrisisOverlay";
import { Button, buttonVariants } from "@/components/ui/button";
import { format } from "date-fns";
import { Activity, Calendar, ArrowRight, ShieldCheck, FileText, MessageCircle, Users } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import React, { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";

// Mock data removed in favor of real data

export default function StudentHome() {
  const { data: session, status } = useSession();
  const [showMindBot, setShowMindBot] = useState(false);
  const [showCrisis, setShowCrisis] = useState(false);
  const [greeting, setGreeting] = useState("Good morning");
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/assessment")
      .then((res) => res.json())
      .then((data) => {
        if (data.assessments) {
          setHistory(data.assessments);
        }
      });
  }, []);

  const getLatest = (type: string) => {
    return history.find((a) => a.type === type);
  };

  // Determine greeting based on local time
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  // Format real history data for the trend chart
  // Group by date (e.g. "Jul 12") and take average score or just map each entry
  const trendData = [...history]
    .reverse() // Oldest to newest
    .filter(a => a.type === "PHQ9") // Chart depression trends
    .slice(-10) // Take last 10
    .map(a => ({
      date: format(new Date(a.createdAt), "MMM d"),
      score: a.totalScore
    }));

  // Dynamic Resource logic based on history
  const recommendedResource = React.useMemo(() => {
    if (!history || history.length === 0) {
      return {
        title: "Daily Gratitude Journal",
        desc: "Take 5 minutes to write down three things you are grateful for today.",
        link: "/resources/gratitude",
        colorClass: "bg-teal-50 border-teal-100 dark:bg-teal-900/10 dark:border-teal-900/30",
        textClass: "text-teal-700 dark:text-teal-300",
        badgeClass: "bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300"
      };
    }
    
    // Check recent assessments (last 5) for high severity
    const recent = history.slice(0, 5);
    const hasHighAnxiety = recent.some(a => a.type === "GAD7" && a.tier >= 2);
    const hasHighDepression = recent.some(a => a.type === "PHQ9" && a.tier >= 2);
    const hasHighStress = recent.some(a => a.type === "PSS10" && a.tier >= 2);

    if (hasHighAnxiety) {
      return {
        title: "4-7-8 Breathing Exercise",
        desc: "A quick breathing technique to activate your parasympathetic nervous system and reduce immediate anxiety.",
        link: "/resources/breathing-478",
        colorClass: "bg-rose-50 border-rose-100 dark:bg-rose-900/10 dark:border-rose-900/30",
        textClass: "text-rose-700 dark:text-rose-300",
        badgeClass: "bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300"
      };
    } else if (hasHighDepression) {
      return {
        title: "The 5-Minute Action Rule",
        desc: "When motivation is low, commit to doing one small task for just 5 minutes. It breaks the cycle of avoidance.",
        link: "/resources/5-minute-rule",
        colorClass: "bg-indigo-50 border-indigo-100 dark:bg-indigo-900/10 dark:border-indigo-900/30",
        textClass: "text-indigo-700 dark:text-indigo-300",
        badgeClass: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300"
      };
    } else if (hasHighStress) {
      return {
        title: "Progressive Muscle Relaxation",
        desc: "Relieve physical tension built up from academic stress by systematically tensing and relaxing muscle groups.",
        link: "/resources/pmr",
        colorClass: "bg-amber-50 border-amber-100 dark:bg-amber-900/10 dark:border-amber-900/30",
        textClass: "text-amber-700 dark:text-amber-300",
        badgeClass: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300"
      };
    }

    return {
      title: "Mindful Check-in",
      desc: "A short body scan to help you stay grounded and present in the moment.",
      link: "/resources/body-scan",
      colorClass: "bg-emerald-50 border-emerald-100 dark:bg-emerald-900/10 dark:border-emerald-900/30",
      textClass: "text-emerald-700 dark:text-emerald-300",
      badgeClass: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300"
    };
  }, [history]);

  const pseudonym = session?.user?.name || "Student";

  return (
    <div className="space-y-8 pb-12">
      <CrisisOverlay isTriggered={showCrisis} onClose={() => setShowCrisis(false)} />

      {/* Welcome Section */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl font-heading font-bold text-slate-900 dark:text-white"
          >
            {greeting}, {pseudonym}
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-2 mt-2 text-slate-500 dark:text-slate-400"
          >
            <Calendar className="w-4 h-4" />
            <span>{format(new Date(), "EEEE, MMMM do, yyyy")}</span>
          </motion.div>
        </div>
        
        <div className="flex gap-2 items-center">
          <div className="hidden sm:block">
            <LiveActiveUsers />
          </div>
          <SettingsDialog />
          <Button onClick={() => setShowMindBot(!showMindBot)} className="bg-teal-600 hover:bg-teal-700 text-white rounded-full shadow-md">
            <MessageCircle className="w-4 h-4 mr-2" />
            Talk to MindBot
          </Button>
        </div>
      </section>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {showMindBot ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <MindBotWindow onCrisisDetected={() => setShowCrisis(true)} />
            </motion.div>
          ) : (
            <>
              <MoodLogger />
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="border-0 shadow-lg bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-500 flex justify-between">
                      PHQ-9 Depression
                      <Activity className="w-4 h-4 text-rose-500" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {getLatest("PHQ9") ? (
                      <>
                        <div className="text-3xl font-heading font-bold text-slate-900 dark:text-white">{getLatest("PHQ9").totalScore}</div>
                        <p className="text-xs text-rose-500 font-medium mt-1 capitalize">{getLatest("PHQ9").severity}</p>
                        <p className="text-[10px] text-slate-400 mt-2">Taken {formatDistanceToNow(new Date(getLatest("PHQ9").createdAt))} ago</p>
                      </>
                    ) : (
                      <>
                        <div className="text-3xl font-heading font-bold text-slate-900 dark:text-white">--</div>
                        <p className="text-xs text-slate-400 font-medium mt-1">Not taken yet</p>
                        <p className="text-[10px] text-slate-400 mt-2">Recommended</p>
                      </>
                    )}
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-500 flex justify-between">
                      GAD-7 Anxiety
                      <Activity className="w-4 h-4 text-amber-500" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {getLatest("GAD7") ? (
                      <>
                        <div className="text-3xl font-heading font-bold text-slate-900 dark:text-white">{getLatest("GAD7").totalScore}</div>
                        <p className="text-xs text-amber-500 font-medium mt-1 capitalize">{getLatest("GAD7").severity}</p>
                        <p className="text-[10px] text-slate-400 mt-2">Taken {formatDistanceToNow(new Date(getLatest("GAD7").createdAt))} ago</p>
                      </>
                    ) : (
                      <>
                        <div className="text-3xl font-heading font-bold text-slate-900 dark:text-white">--</div>
                        <p className="text-xs text-slate-400 font-medium mt-1">Not taken yet</p>
                        <p className="text-[10px] text-slate-400 mt-2">Recommended</p>
                      </>
                    )}
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-500 flex justify-between">
                      PSS-10 Stress
                      <Activity className="w-4 h-4 text-teal-500" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {getLatest("PSS10") ? (
                      <>
                        <div className="text-3xl font-heading font-bold text-slate-900 dark:text-white">{getLatest("PSS10").totalScore}</div>
                        <p className="text-xs text-teal-500 font-medium mt-1 capitalize">{getLatest("PSS10").severity}</p>
                        <p className="text-[10px] text-slate-400 mt-2">Taken {formatDistanceToNow(new Date(getLatest("PSS10").createdAt))} ago</p>
                      </>
                    ) : (
                      <>
                        <div className="text-3xl font-heading font-bold text-slate-900 dark:text-white">--</div>
                        <p className="text-xs text-slate-400 font-medium mt-1">Not taken yet</p>
                        <p className="text-[10px] text-slate-400 mt-2">Recommended</p>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="h-[400px]">
                {trendData.length > 0 ? (
                  <TrendChart data={trendData} />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-slate-400">
                    <Activity className="w-8 h-8 mb-2 opacity-50" />
                    <p>Take your first PHQ-9 assessment to see your mood trend.</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <Card className="border-0 shadow-xl bg-slate-900 text-white overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 to-transparent pointer-events-none" />
            <CardHeader>
              <CardTitle className="flex items-center font-heading">
                <ShieldCheck className="w-5 h-5 mr-2 text-teal-400" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/assessment" className="flex items-center justify-between p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors w-full group">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-teal-300" />
                  <span className="font-medium text-sm">Take Assessment</span>
                </div>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/peer" className="flex items-center justify-between p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors w-full group">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-amber-300" />
                  <span className="font-medium text-sm">Peer Support Chat</span>
                </div>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="font-heading text-lg">Resource Spotlight</CardTitle>
              <CardDescription>Based on your recent check-ins</CardDescription>
            </CardHeader>
            <CardContent>
              <div className={`p-4 rounded-xl border ${recommendedResource.colorClass}`}>
                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-3 ${recommendedResource.badgeClass}`}>
                  Recommended
                </div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-2">{recommendedResource.title}</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  {recommendedResource.desc}
                </p>
                <Link href={recommendedResource.link} className={buttonVariants({ variant: "outline", size: "sm", className: "w-full" })}>
                  Start Exercise
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
