"use client";

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";
import { format, parseISO } from "date-fns";

interface MoodDataPoint {
  date: string;
  score: number;
  emoji: string;
  note?: string;
  tags?: string[];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
}

const WEATHER_MAP: Record<number, { icon: string; label: string; bg: string }> = {
  1: { icon: "⛈️", label: "Storm",   bg: "from-rose-500 to-rose-700" },
  2: { icon: "🌧️", label: "Rainy",   bg: "from-orange-400 to-orange-600" },
  3: { icon: "⛅", label: "Cloudy",  bg: "from-amber-400 to-amber-500" },
  4: { icon: "🌤️", label: "Breezy",  bg: "from-teal-400 to-teal-600" },
  5: { icon: "☀️", label: "Sunny",   bg: "from-emerald-400 to-emerald-600" },
};

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload as MoodDataPoint;
  const weather = WEATHER_MAP[d.score] || WEATHER_MAP[3];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 shadow-xl text-sm max-w-[200px]">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-2xl">{d.emoji}</span>
        <div>
          <p className="font-semibold text-slate-900 dark:text-white">{weather.label}</p>
          <p className="text-xs text-slate-400">
            {format(parseISO(d.date), "MMM d, yyyy")}
          </p>
        </div>
      </div>
      {d.note && (
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 italic border-t border-slate-100 dark:border-slate-800 pt-1 line-clamp-2">
          "{d.note}"
        </p>
      )}
      {d.tags && d.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1">
          {d.tags.map((tag) => (
            <span key={tag} className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// Gradient definition by score band
function getGradientColors(avgScore: number) {
  if (avgScore >= 4.5) return { top: "#10b981", bottom: "#34d399" };
  if (avgScore >= 3.5) return { top: "#14b8a6", bottom: "#2dd4bf" };
  if (avgScore >= 2.5) return { top: "#f59e0b", bottom: "#fbbf24" };
  if (avgScore >= 1.5) return { top: "#f97316", bottom: "#fb923c" };
  return { top: "#f43f5e", bottom: "#fb7185" };
}

export function MoodChart({ data }: { data: MoodDataPoint[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-slate-400 gap-3">
        <span className="text-4xl">🌫️</span>
        <p className="text-sm text-center max-w-xs">No mood data yet. Start checking in daily to see your emotional weather patterns.</p>
      </div>
    );
  }

  const avg = data.reduce((sum, d) => sum + d.score, 0) / data.length;
  const colors = getGradientColors(avg);

  const chartData = data.map((d) => ({
    ...d,
    date: d.date.slice(0, 10), // Ensure ISO date string
  }));

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={colors.top} stopOpacity={0.35} />
              <stop offset="95%" stopColor={colors.bottom} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: "#94a3b8" }}
            tickFormatter={(v) => format(parseISO(v), "MMM d")}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={[1, 5]}
            ticks={[1, 2, 3, 4, 5]}
            tick={{ fontSize: 10, fill: "#94a3b8" }}
            tickFormatter={(v) => WEATHER_MAP[v]?.icon || ""}
            axisLine={false}
            tickLine={false}
            width={28}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={avg} stroke={colors.top} strokeDasharray="4 4" strokeOpacity={0.5} />
          <Area
            type="monotone"
            dataKey="score"
            stroke={colors.top}
            strokeWidth={2.5}
            fill="url(#moodGradient)"
            dot={{ r: 3, fill: colors.top, strokeWidth: 0 }}
            activeDot={{ r: 5, fill: colors.top, strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
