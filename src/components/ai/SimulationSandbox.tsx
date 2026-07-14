"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, ArrowLeft, Send, Sparkles, User, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type Message = { id: string; role: "user" | "assistant"; content: string };

export function SimulationSandbox({ onBack }: { onBack: () => void }) {
  const [scenario, setScenario] = useState("");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [hasStarted, setHasStarted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleStart = () => {
    if (!scenario.trim()) return;
    setHasStarted(true);
    setMessages([
      {
        id: "sys",
        role: "assistant",
        content: `*Simulation Started.*\nI am playing the role of the person in your scenario.\nDifficulty: ${difficulty.toUpperCase()}.\n\nYou can start the conversation whenever you're ready.`,
      },
    ]);
  };

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenario,
          difficulty,
          messages: [...messages, userMsg].filter((m) => m.id !== "sys").map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok) throw new Error("Failed");

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let botContent = "";
      const botId = (Date.now() + 1).toString();
      setMessages((prev) => [...prev, { id: botId, role: "assistant", content: "" }]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          botContent += decoder.decode(value, { stream: true });
          setMessages((prev) =>
            prev.map((m) => (m.id === botId ? { ...m, content: botContent } : m))
          );
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), role: "assistant", content: "Error connecting to simulation." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!hasStarted) {
    return (
      <div className="flex flex-col h-full bg-indigo-950 text-indigo-100">
        <div className="flex items-center p-4 border-b border-indigo-900">
          <Button variant="ghost" size="icon" onClick={onBack} className="text-indigo-400 hover:text-white rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="ml-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <h2 className="font-heading font-semibold text-white">Simulation Sandbox</h2>
          </div>
        </div>

        <div className="flex-1 p-6 sm:p-12 max-w-2xl mx-auto w-full space-y-8">
          <div>
            <h1 className="text-3xl font-heading text-white mb-2">Configure Scenario</h1>
            <p className="text-indigo-300">Set the stage for a difficult conversation you want to practice.</p>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-semibold text-indigo-300 uppercase tracking-wider">What's the situation?</label>
            <Textarea 
              value={scenario}
              onChange={(e) => setScenario(e.target.value)}
              placeholder="e.g. I need to tell my roommate to stop bringing people over at 2 AM on weekdays."
              className="bg-indigo-900/50 border-indigo-800 focus-visible:ring-indigo-500 text-white placeholder:text-indigo-400/50 min-h-[120px] resize-none text-lg p-4"
            />
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-semibold text-indigo-300 uppercase tracking-wider">Defensiveness Level</label>
            <div className="flex gap-3">
              {(["easy", "medium", "hard"] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setDifficulty(level)}
                  className={`flex-1 py-3 px-4 rounded-xl capitalize font-medium transition-all ${
                    difficulty === level 
                      ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20" 
                      : "bg-indigo-900/50 text-indigo-300 hover:bg-indigo-800/50 border border-indigo-800"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <Button 
            onClick={handleStart}
            disabled={!scenario.trim()}
            className="w-full h-14 text-lg bg-white text-indigo-950 hover:bg-indigo-100 rounded-xl font-bold"
          >
            <Play className="w-5 h-5 mr-2" />
            Enter Simulation
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-300 relative">
      <div className="flex items-center p-4 border-b border-white/5 relative z-10 bg-slate-900/50 backdrop-blur-md">
        <Button variant="ghost" size="icon" onClick={() => setHasStarted(false)} className="text-slate-400 hover:text-white rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="ml-3 flex flex-col">
          <h2 className="font-heading font-semibold text-white text-sm">Simulation Active</h2>
          <p className="text-[10px] text-indigo-400">{difficulty.toUpperCase()} MODE</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        <AnimatePresence>
          {messages.map((msg) => {
            const isUser = msg.role === "user";
            const isSys = msg.id === "sys";
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-end gap-3 ${isUser ? "justify-end" : "justify-start"}`}
              >
                {!isUser && !isSys && (
                  <div className="w-8 h-8 rounded-full bg-indigo-900 flex items-center justify-center shrink-0">
                    <UserX className="w-4 h-4 text-indigo-400" />
                  </div>
                )}
                
                <div className={`max-w-[85%] sm:max-w-[70%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                  isSys ? "bg-slate-900 border border-indigo-500/30 text-indigo-300 italic w-full text-center" :
                  isUser ? "bg-indigo-600 text-white rounded-br-sm" : "bg-slate-800 text-slate-200 rounded-tl-sm"
                }`}>
                  {msg.content || <span className="animate-pulse">...</span>}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {isLoading && (
          <div className="flex items-center gap-2 text-indigo-400 text-xs ml-12">
            <span className="animate-bounce">●</span>
            <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>●</span>
            <span className="animate-bounce" style={{ animationDelay: "0.4s" }}>●</span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="p-4 bg-slate-900 border-t border-white/5">
        <form onSubmit={handleSend} className="flex gap-2 relative">
          <Textarea 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
            }}
            placeholder="Your response..."
            className="min-h-[50px] max-h-[150px] resize-none bg-slate-800 border-slate-700 text-white rounded-xl focus-visible:ring-indigo-500"
          />
          <Button type="submit" disabled={!input.trim() || isLoading} className="bg-indigo-600 hover:bg-indigo-700 text-white h-12 w-12 rounded-xl shrink-0 self-end">
            <Send className="w-5 h-5" />
          </Button>
        </form>
      </div>
    </div>
  );
}
