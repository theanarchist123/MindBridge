"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MoodChart } from "@/components/MoodChart";
import { MoodJournalEntry } from "@/components/MoodJournalEntry";
import { MoodLogger } from "@/components/MoodLogger";
import { Flame, CloudSun, Calendar, BarChart2 } from "lucide-react";

interface MoodLog {
  _id: string;
  score: number;
  emoji: string;
  note?: string;
  tags?: string[];
  createdAt: string;
}

interface MoodData {
  logs: MoodLog[];
  streak: number;
  totalLogs: number;
}

const WEATHER_MAP: Record<number, { icon: string; label: string }> = {
  1: { icon: "⛈️", label: "Stormy" },
  2: { icon: "🌧️", label: "Rainy" },
  3: { icon: "⛅", label: "Cloudy" },
  4: { icon: "🌤️", label: "Breezy" },
  5: { icon: "☀️", label: "Sunny" },
};

function WeeklyForecast({ logs }: { logs: MoodLog[] }) {
  // Build last 7 days forecast
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    d.setHours(0, 0, 0, 0);
    const dayEnd = new Date(d);
    dayEnd.setHours(23, 59, 59, 999);

    const log = logs.find((l) => {
      const ld = new Date(l.createdAt);
      return ld >= d && ld <= dayEnd;
    });

    return { date: d, log };
  });

  return (
    <div className="flex justify-between gap-1">
      {days.map(({ date, log }, i) => {
        const isToday = i === 6;
        const weather = log ? WEATHER_MAP[log.score] : null;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`flex-1 flex flex-col items-center gap-1.5 p-2 rounded-xl ${
              isToday
                ? "bg-teal-50 dark:bg-teal-900/20 ring-1 ring-teal-300 dark:ring-teal-700"
                : "bg-slate-50 dark:bg-slate-900/40"
            }`}
          >
            <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">
              {date.toLocaleDateString("en", { weekday: "short" })}
            </span>
            <span className="text-lg">
              {weather ? weather.icon : <span className="text-slate-200 dark:text-slate-700 text-base">—</span>}
            </span>
            <span className={`text-[9px] font-medium ${log ? "text-slate-600 dark:text-slate-400" : "text-slate-300 dark:text-slate-700"}`}>
              {weather?.label || "None"}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}

export default function MoodPage() {
  const [data, setData] = useState<MoodData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<"7d" | "30d">("7d");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchMoodData = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/mood/history?limit=${view === "7d" ? 7 : 30}`);
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (e) {
        console.error("Failed to load mood data", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMoodData();
  }, [view, refreshKey]);

  const chartData = (data?.logs || []).map((l) => ({
    date: l.createdAt,
    score: l.score,
    emoji: l.emoji,
    note: l.note,
    tags: l.tags,
  }));

  const avgScore = data?.logs.length
    ? (data.logs.reduce((s, l) => s + l.score, 0) / data.logs.length)
    : null;

  const currentWeather = avgScore
    ? WEATHER_MAP[Math.round(avgScore)]
    : null;

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl font-heading font-bold text-slate-900 dark:text-white flex items-center gap-3"
          >
            {currentWeather && <span className="text-4xl">{currentWeather.icon}</span>}
            Your Emotional Weather
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 dark:text-slate-400 mt-1"
          >
            {currentWeather
              ? `Your recent forecast: ${currentWeather.label}. Keep tracking to see patterns.`
              : "Start checking in daily to see your emotional forecast."}
          </motion.p>
        </div>

        {/* Period toggle */}
        <div className="flex bg-slate-100 dark:bg-slate-800 rounded-full p-1 gap-1 self-start sm:self-auto">
          {(["7d", "30d"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                view === v
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              {v === "7d" ? "7 Days" : "30 Days"}
            </button>
          ))}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          {
            icon: Flame,
            label: "Day Streak",
            value: data?.streak ?? "—",
            suffix: data?.streak === 1 ? " day" : " days",
            color: "text-orange-500",
            bg: "bg-orange-50 dark:bg-orange-950/30",
          },
          {
            icon: CloudSun,
            label: "Avg Mood",
            value: currentWeather?.icon ?? "—",
            suffix: "",
            color: "text-teal-500",
            bg: "bg-teal-50 dark:bg-teal-950/30",
          },
          {
            icon: Calendar,
            label: "Total Logs",
            value: data?.totalLogs ?? "—",
            suffix: "",
            color: "text-indigo-500",
            bg: "bg-indigo-50 dark:bg-indigo-950/30",
          },
        ].map(({ icon: Icon, label, value, suffix, color, bg }) => (
          <Card key={label} className="border-0 shadow-md">
            <CardContent className={`p-4 rounded-xl ${bg}`}>
              <Icon className={`w-4 h-4 ${color} mb-2`} />
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {isLoading ? (
                  <div className="h-7 w-12 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                ) : (
                  <span>{value}{suffix && <span className="text-sm font-normal text-slate-400 ml-1">{suffix}</span>}</span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 7-day forecast pills */}
      <Card className="border-0 shadow-xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-teal-500" /> 7-Day Forecast
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex gap-1">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="flex-1 h-20 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
              ))}
            </div>
          ) : (
            <WeeklyForecast logs={data?.logs || []} />
          )}
        </CardContent>
      </Card>

      {/* Chart */}
      <Card className="border-0 shadow-xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Mood Trend</CardTitle>
          <CardDescription>
            {view === "7d" ? "Last 7 days" : "Last 30 days"} · Weather icons show your check-in mood
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-64 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
          ) : (
            <MoodChart data={chartData} />
          )}
        </CardContent>
      </Card>

      {/* Today's check-in */}
      <Card className="border-0 shadow-xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Today's Check-in</CardTitle>
        </CardHeader>
        <CardContent>
          <MoodLogger onLogged={() => setRefreshKey((k) => k + 1)} />
        </CardContent>
      </Card>

      {/* Journal / Field Notes */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          📓 Field Notes
          <span className="text-sm font-normal text-slate-400">({data?.logs.length || 0} entries)</span>
        </h2>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
            ))}
          </div>
        ) : data && data.logs.length > 0 ? (
          <div className="space-y-3">
            <AnimatePresence>
              {[...data.logs].reverse().map((log, i) => (
                <MoodJournalEntry
                  key={log._id}
                  score={log.score}
                  emoji={log.emoji}
                  note={log.note}
                  tags={log.tags}
                  createdAt={log.createdAt}
                  index={i}
                />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-12 text-slate-400">
            <div className="text-5xl mb-3">📭</div>
            <p className="text-sm">No field notes yet. Start checking in to build your weather journal.</p>
          </div>
        )}
      </div>
    </div>
  );
}
