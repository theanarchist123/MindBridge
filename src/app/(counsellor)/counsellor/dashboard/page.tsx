"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertCard } from "@/components/AlertCard";
import {
  PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
} from "recharts";
import { ShieldAlert, Users, FileBarChart, Activity } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { Heart } from "lucide-react";
import { signOut } from "next-auth/react";

interface StatsData {
  totalStudents: number;
  assessmentsThisWeek: number;
  activePeerRooms: number;
  alerts: any[];
  severityDistribution: { name: string; value: number; color: string }[];
}

// Placeholder weekly trend — will be wired to real data in a later batch
const weeklyTrendData = [
  { week: "W1", avg: 7 }, { week: "W2", avg: 8.5 }, { week: "W3", avg: 6.5 },
  { week: "W4", avg: 9 }, { week: "W5", avg: 11 }, { week: "W6", avg: 9.5 },
  { week: "W7", avg: 8 }, { week: "W8", avg: 7.5 },
];

export default function CounsellorDashboard() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [statsRes, alertsRes] = await Promise.all([
        fetch("/api/counsellor/stats"),
        fetch("/api/counsellor/alerts"),
      ]);

      if (statsRes.ok) {
        const s = await statsRes.json();
        setStats(s.stats);
      }
      if (alertsRes.ok) {
        const a = await alertsRes.json();
        setAlerts(a.alerts || []);
      }
    } catch (e) {
      console.error("Failed to load counsellor data", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAcknowledge = async (alertId: string) => {
    try {
      const res = await fetch("/api/counsellor/alerts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ alertId, status: "acknowledged" }),
      });
      if (res.ok) {
        setAlerts((prev) => prev.filter((a) => a._id !== alertId));
        toast.success("Alert acknowledged", {
          description: "Moved to outreach queue.",
        });
      }
    } catch {
      toast.error("Failed to acknowledge alert.");
    }
  };

  const statCards = [
    { icon: Users, label: "Total Students", value: stats?.totalStudents, color: "text-teal-500", bg: "bg-teal-50 dark:bg-teal-950/30" },
    { icon: FileBarChart, label: "Assessments This Week", value: stats?.assessmentsThisWeek, color: "text-indigo-500", bg: "bg-indigo-50 dark:bg-indigo-950/30" },
    { icon: ShieldAlert, label: "Open Alerts", value: alerts.length, color: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-950/20" },
    { icon: Activity, label: "Active Peer Rooms", value: stats?.activePeerRooms ?? 0, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-950/30" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl">
        <div className="flex h-16 items-center px-6 max-w-7xl mx-auto justify-between">
          <Link href="/counsellor/dashboard" className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
            <span className="font-heading text-xl font-bold text-slate-900 dark:text-white">MindBridge</span>
            <span className="text-xs bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 px-2 py-0.5 rounded-full font-medium ml-1">Counsellor</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Monitoring
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 space-y-8 pb-20">
        {/* Page title */}
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-heading font-bold text-slate-900 dark:text-white"
          >
            Command Center
          </motion.h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            University-wide mental health monitoring — real data, live alerts.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map(({ icon: Icon, label, value, color, bg }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <Card className="border-0 shadow-lg">
                <CardContent className={`p-5 rounded-xl ${bg}`}>
                  <Icon className={`w-5 h-5 ${color} mb-3`} />
                  <div className="text-3xl font-bold font-heading text-slate-900 dark:text-white">
                    {isLoading ? (
                      <div className="h-8 w-16 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                    ) : (
                      value ?? "—"
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main content: Alerts + Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Open Alerts — takes 2/3 */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-500" />
                Open Alerts
                {alerts.length > 0 && (
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="text-xs bg-rose-500 text-white px-2 py-0.5 rounded-full font-bold"
                  >
                    {alerts.length}
                  </motion.span>
                )}
              </h2>
            </div>

            {isLoading ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="h-24 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
                ))}
              </div>
            ) : alerts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-16 text-slate-400 gap-3 bg-white dark:bg-slate-900/40 rounded-2xl border border-slate-100 dark:border-slate-800"
              >
                <div className="text-5xl">✅</div>
                <p className="text-sm font-medium">No open alerts</p>
                <p className="text-xs max-w-xs text-center">All students appear to be doing well. New alerts will appear here automatically.</p>
              </motion.div>
            ) : (
              <AnimatePresence>
                {alerts.map((alert, i) => (
                  <AlertCard
                    key={alert._id}
                    alert={alert}
                    onAcknowledge={handleAcknowledge}
                    index={i}
                  />
                ))}
              </AnimatePresence>
            )}
          </div>

          {/* Severity Chart — takes 1/3 */}
          <div className="space-y-4">
            <Card className="border-0 shadow-xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Severity Distribution</CardTitle>
                <CardDescription className="text-xs">All-time assessment data</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-48 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
                ) : stats?.severityDistribution && stats.severityDistribution.length > 0 ? (
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={stats.severityDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={70}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {stats.severityDistribution.map((entry, i) => (
                            <Cell key={i} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip
                          formatter={(v: any, name: any) => [`${v} students`, name]}
                          contentStyle={{
                            background: "rgba(15,23,42,0.9)",
                            border: "none",
                            borderRadius: "12px",
                            color: "#e2e8f0",
                            fontSize: 12,
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-48 flex flex-col items-center justify-center text-slate-400 gap-2">
                    <span className="text-3xl">📊</span>
                    <p className="text-xs text-center">No assessment data yet</p>
                  </div>
                )}

                {/* Legend */}
                {stats?.severityDistribution && (
                  <div className="grid grid-cols-2 gap-1.5 mt-2">
                    {stats.severityDistribution.map((item) => (
                      <div key={item.name} className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: item.color }} />
                        <span className="text-[10px] text-slate-500">{item.name}: {item.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Weekly trend */}
            <Card className="border-0 shadow-xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">8-Week Trend</CardTitle>
                <CardDescription className="text-xs">Avg severity score across campus</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={weeklyTrendData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                      <defs>
                        <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" vertical={false} />
                      <XAxis dataKey="week" tick={{ fontSize: 9, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 9, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                      <RechartsTooltip
                        contentStyle={{ background: "rgba(15,23,42,0.9)", border: "none", borderRadius: "10px", color: "#e2e8f0", fontSize: 11 }}
                      />
                      <Area type="monotone" dataKey="avg" stroke="#14b8a6" strokeWidth={2} fill="url(#trendGrad)" dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
