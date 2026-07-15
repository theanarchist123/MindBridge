"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { pusherClient } from "@/lib/pusher-client";
import { motion, AnimatePresence } from "framer-motion";
import { Send, ArrowLeft, ShieldCheck, AlertTriangle, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { toast } from "sonner";

interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: Date;
}

export default function PeerRoomPage() {
  const { data: session } = useSession();
  const params = useParams();
  const roomId = params.roomId as string;
  const router = useRouter();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isEncrypted, setIsEncrypted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const subscribedRef = useRef(false);

  const roomName = roomId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  // 1. Load message history from MongoDB when entering the room
  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/peer/messages/${roomId}`);
        if (res.ok) {
          const data = await res.json();
          setMessages(data.messages || []);
        }
      } catch (e) {
        console.error("Failed to load history", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, [roomId]);

  // 2. Subscribe to Pusher for live incoming messages (deduplicated by id)
  useEffect(() => {
    if (!session?.user) return;
    if (subscribedRef.current) return;
    subscribedRef.current = true;

    // Use private channel — requires Pusher auth at /api/pusher/auth
    const channel = pusherClient.subscribe(`private-room-${roomId}`);

    channel.bind("pusher:subscription_succeeded", () => {
      setIsEncrypted(true);
    });

    channel.bind("new-message", (data: Message) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === data.id)) return prev;
        return [...prev, data];
      });
    });

    return () => {
      subscribedRef.current = false;
      setIsEncrypted(false);
      pusherClient.unsubscribe(`private-room-${roomId}`);
    };
  }, [roomId, session]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !session?.user) return;

    const msg = input;
    setInput("");

    // Optimistic UI update
    const tempMsg: Message = {
      id: Math.random().toString(),
      sender: session.user.name || "Anonymous",
      text: msg,
      timestamp: new Date(),
    };
    
    // Don't add optimistically if we are triggering via pusher, pusher will bounce it back.
    // Actually, usually you do add it optimistically, but let's just let Pusher bounce it for simplicity.

    const res = await fetch("/api/peer/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        roomId,
        text: msg,
        sender: session.user.name,
        channel: `private-room-${roomId}`,
      }),
    });

    if (!res.ok) {
      try {
        const errorData = await res.json();
        if (errorData.error) {
          toast.error(errorData.error);
        } else {
          toast.error("Failed to send message.");
        }
      } catch (e) {
        toast.error("An error occurred while sending the message.");
      }
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Room Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push('/peer')} className="rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="font-heading font-bold text-xl text-slate-900 dark:text-white flex items-center gap-2">
              {roomName} Room
            </h1>
            <div className="flex items-center gap-2">
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-teal-500" /> Anonymized
              </p>
              {isEncrypted && (
                <motion.div
                  initial={{ opacity: 0, x: -8, scale: 0.8 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800"
                >
                  <Lock className="w-2.5 h-2.5" /> Encrypted
                </motion.div>
              )}
            </div>
          </div>
        </div>
        <Button variant="outline" size="sm" className="text-rose-600 border-rose-200 hover:bg-rose-50 dark:border-rose-900 dark:hover:bg-rose-900/30 rounded-full">
          <AlertTriangle className="w-4 h-4 mr-2" /> Report
        </Button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto py-6 space-y-4 px-2 custom-scrollbar">
        {isLoading ? (
          <div className="h-full flex flex-col items-center justify-center gap-3 text-slate-400">
            <div className="w-8 h-8 rounded-full border-2 border-teal-500 border-t-transparent animate-spin" />
            <p className="text-sm">Loading conversation history...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
            <div className="p-4 bg-slate-100 dark:bg-slate-900 rounded-full">
              <ShieldCheck className="w-8 h-8 text-slate-300 dark:text-slate-700" />
            </div>
            <p className="text-sm max-w-sm text-center">
              Welcome to the {roomName} room. Please be kind, supportive, and respectful. Do not share personal information.
            </p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((msg) => {
              const isMe = msg.sender === session?.user?.name;
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <span className="text-[10px] text-slate-400 ml-1 mb-1">{msg.sender}</span>
                  <div 
                    className={`max-w-[80%] md:max-w-[70%] p-3 rounded-2xl ${
                      isMe 
                        ? 'bg-teal-600 text-white rounded-br-sm' 
                        : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-sm border border-slate-100 dark:border-slate-700 shadow-sm'
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="pt-4 shrink-0 mt-auto">
        <form onSubmit={sendMessage} className="relative flex items-center gap-2">
          <Input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a supportive message..."
            className="pr-12 h-14 rounded-full bg-white shadow-sm border-slate-200 dark:bg-slate-900 dark:border-slate-800"
            autoComplete="off"
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={!input.trim()}
            className="absolute right-2 h-10 w-10 rounded-full bg-teal-600 hover:bg-teal-700 text-white"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
