"use client";

import { Area, AreaChart, CartesianGrid, XAxis, Tooltip, ResponsiveContainer, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function TrendChart({ data }: { data: any[] }) {
  if (!data || data.length === 0) {
    return (
      <Card className="border-0 shadow-xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="font-heading text-lg">Recent Trends</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center text-slate-500">
          No data available yet
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl h-full">
      <CardHeader>
        <CardTitle className="font-heading text-lg text-slate-800 dark:text-slate-200">
          Assessment & Mood History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 12 }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 12 }}
                dx={-10}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                  border: 'none',
                  borderRadius: '8px',
                  color: '#f8fafc' 
                }} 
                itemStyle={{ color: '#2dd4bf' }}
              />
              <Area
                type="monotone"
                dataKey="score"
                stroke="#14b8a6"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorScore)"
                activeDot={{ r: 6, fill: "#0f766e", stroke: "#fff", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
