"use client";

import { motion } from "framer-motion";
import { Users, MessagesSquare, ArrowRight, ShieldCheck, Heart, Search } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState } from "react";

const TOPICS = [
  { id: "academic-stress", name: "Academic Stress & Exams", activeUsers: 24, color: "text-rose-500", bg: "bg-rose-100 dark:bg-rose-900/30", badge: "bg-rose-500" },
  { id: "loneliness", name: "Hostel Loneliness", activeUsers: 18, color: "text-indigo-500", bg: "bg-indigo-100 dark:bg-indigo-900/30", badge: "bg-indigo-500" },
  { id: "family-pressure", name: "Family Expectations", activeUsers: 32, color: "text-amber-500", bg: "bg-amber-100 dark:bg-amber-900/30", badge: "bg-amber-500" },
  { id: "relationships", name: "Relationships & Breakups", activeUsers: 14, color: "text-teal-500", bg: "bg-teal-100 dark:bg-teal-900/30", badge: "bg-teal-500" },
  { id: "general-chat", name: "General Check-in", activeUsers: 45, color: "text-slate-500", bg: "bg-slate-100 dark:bg-slate-800", badge: "bg-slate-500" },
];

export default function PeerLobbyPage() {
  const [search, setSearch] = useState("");

  const filteredTopics = TOPICS.filter(t => t.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl font-heading font-bold text-slate-900 dark:text-white flex items-center gap-3"
          >
            Peer Support Rooms
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3 h-3" /> Anonymous
            </span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 dark:text-slate-400 mt-2 max-w-2xl"
          >
            Connect with students going through exactly what you're feeling. 
            All chats are 100% anonymous and moderated by certified peer supporters.
          </motion.p>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <Input 
          placeholder="Search topics..." 
          className="pl-10 h-12 bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 rounded-xl"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTopics.map((topic, i) => (
          <motion.div
            key={topic.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Link href={`/peer/${topic.id}`}>
              <Card className="border-0 shadow-md hover:shadow-xl transition-all cursor-pointer bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl group h-full flex flex-col relative overflow-hidden">
                <div className={`absolute top-0 left-0 w-1 h-full ${topic.badge}`} />
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <div className={`p-3 rounded-2xl ${topic.bg} ${topic.color}`}>
                      <MessagesSquare className="w-6 h-6" />
                    </div>
                    <div className="flex items-center text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
                      {topic.activeUsers} online
                    </div>
                  </div>
                  <CardTitle className="font-heading text-xl">{topic.name}</CardTitle>
                </CardHeader>
                <CardContent className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center group-hover:bg-slate-50 dark:group-hover:bg-slate-800/50 transition-colors">
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Join Room</span>
                  <div className="w-8 h-8 rounded-full bg-slate-900 dark:bg-white flex items-center justify-center text-white dark:text-slate-900 group-hover:scale-110 transition-transform shadow-md">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Certified Peer Section */}
      <Card className="border border-teal-200 dark:border-teal-900/30 bg-teal-50 dark:bg-teal-950/20 shadow-none mt-12">
        <CardContent className="p-6 sm:p-8 flex flex-col md:flex-row items-center gap-6">
          <div className="p-4 bg-teal-100 dark:bg-teal-900/50 rounded-full text-teal-600 dark:text-teal-400 flex-shrink-0">
            <Heart className="w-8 h-8" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white mb-2">Want to become a Certified Peer Supporter?</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm max-w-2xl">
              Complete our 10-hour university-approved training to moderate rooms and help your fellow students in crisis. Looks great on a resume.
            </p>
          </div>
          <Button variant="outline" className="border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white dark:border-teal-500 dark:text-teal-400 dark:hover:bg-teal-500 dark:hover:text-white rounded-full px-6">
            Apply Now
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
