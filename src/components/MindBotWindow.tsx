"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export function MindBotWindow({ onCrisisDetected }: { onCrisisDetected?: () => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isInitializing, setIsInitializing] = useState(true);
  const [memoryEnabled, setMemoryEnabled] = useState<boolean | null>(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch settings and chat history on mount
  useEffect(() => {
    fetch('/api/user/settings')
      .then(res => res.json())
      .then(settings => {
        setMemoryEnabled(settings.mindbotMemoryEnabled);
        
        if (settings.mindbotMemoryEnabled) {
          return fetch("/api/mindbot/chat");
        } else {
          // If disabled, just return empty history
          return { json: () => Promise.resolve({ messages: [] }) } as any;
        }
      })
      .then(res => res.json())
      .then(data => {
        if (data.messages && data.messages.length > 0) {
          setMessages(data.messages.map((m: any, i: number) => ({ id: `hist-${i}`, role: m.role, content: m.content })));
        } else {
          setMessages([{
            id: "1",
            role: "assistant",
            content: "Hi. I'm MindBot. I'm here to listen — not to judge. What's on your mind today? 💙",
          }]);
        }
      })
      .catch(console.error)
      .finally(() => setIsInitializing(false));
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading, isInitializing]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/mindbot/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({ role: m.role, content: m.content }))
        })
      });

      if (!res.ok) throw new Error("Failed to send message");

      if (res.headers.get("X-Crisis-Detected") === "true") {
        if (onCrisisDetected) onCrisisDetected();
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      
      let botContent = "";
      const botMessageId = (Date.now() + 1).toString();
      
      setMessages((prev) => [...prev, { id: botMessageId, role: "assistant", content: "" }]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          botContent += decoder.decode(value, { stream: true });
          
          setMessages((prev) => 
            prev.map(m => m.id === botMessageId ? { ...m, content: botContent } : m)
          );
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-950 shadow-sm">
      <div className="shrink-0 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-teal-100 dark:bg-teal-900/50 p-2 rounded-xl text-teal-600 dark:text-teal-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">MindBot</h3>
            <p className="text-xs text-slate-500">Confidential AI Listener</p>
          </div>
        </div>
      </div>
      
      <ScrollArea className="flex-1 min-h-0 p-4" ref={scrollRef}>
        <div className="space-y-6">
          {isInitializing ? (
            <div className="flex justify-center items-center h-full text-slate-400">
              <Sparkles className="w-5 h-5 animate-pulse mr-2" /> Loading memory...
            </div>
          ) : (
            messages.map((m) => (
              <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`flex max-w-[80%] ${m.role === "user" ? "flex-row-reverse" : "flex-row"} items-start gap-3`}>
                  <Avatar className="w-8 h-8 mt-1 border border-slate-200 dark:border-slate-800">
                    <AvatarFallback className={m.role === "user" ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300"}>
                      {m.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className={`p-4 rounded-2xl ${
                    m.role === "user" 
                      ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-tr-none" 
                      : "bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-200 rounded-tl-none"
                  }`}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.content}</p>
                  </div>
                </div>
              </div>
            ))
          )}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex gap-3">
                <Avatar className="w-8 h-8 border border-slate-200 dark:border-slate-800">
                  <AvatarFallback className="bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300">
                    <Bot className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 rounded-tl-none flex items-center space-x-2">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      
      <div className="shrink-0 p-4 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
        <form onSubmit={handleSend} className="flex gap-2">
          <Input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="rounded-full bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus-visible:ring-teal-500"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            size="icon" 
            className="rounded-full bg-teal-600 hover:bg-teal-700 text-white shrink-0"
            disabled={!input.trim() || isLoading}
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
        <p className="text-[10px] text-center text-slate-400 mt-3 font-mono">
          {memoryEnabled 
            ? "MindBot conversations are confidentially saved to provide a companion experience. You can turn this off in Settings." 
            : "MindBot conversations are entirely client-side and are NEVER saved or stored on our servers. Enable Memory in Settings for a companion experience."}
        </p>
      </div>
    </div>
  );
}
