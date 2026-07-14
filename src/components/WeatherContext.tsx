"use client";

import { useEffect, useState } from "react";
import { CloudRain, Cloud } from "lucide-react";
import { motion } from "framer-motion";

export function WeatherContext() {
  const [isGrey, setIsGrey] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkWeather() {
      try {
        // 1. Get real location via IP (no intrusive browser permission prompts)
        const locRes = await fetch("https://ipwho.is/");
        if (!locRes.ok) return; // Silently fail instead of throwing
        const locData = await locRes.json();
        
        if (!locData.success) return; // ipwho.is returns success: false if it fails

        const { latitude, longitude } = locData;

        // 2. Get real weather using Open-Meteo
        const weatherRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
        );
        if (!weatherRes.ok) return;
        const weatherData = await weatherRes.json();
        
        const code = weatherData.current_weather.weathercode;
        
        // WMO Codes: 3 (overcast), 45+ (fog, rain, snow, thunderstorms)
        if (code === 3 || code >= 45) {
          setIsGrey(true);
        }
      } catch (error) {
        // Silently swallow network errors (like adblockers) so it doesn't clutter the console
      } finally {
        setLoading(false);
      }
    }

    checkWeather();
  }, []);

  if (loading || !isGrey) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-100 dark:bg-slate-800/50 rounded-2xl p-4 mb-6 flex items-start gap-4 border border-slate-200 dark:border-slate-700"
    >
      <div className="bg-slate-200 dark:bg-slate-700 p-2 rounded-full shrink-0">
        <CloudRain className="w-5 h-5 text-slate-600 dark:text-slate-300" />
      </div>
      <div>
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          It's looking a bit grey out there today. A lot of people notice their mood dips on days like this — you're not alone in that.
        </p>
      </div>
    </motion.div>
  );
}
