"use client";

import { useEffect, useState } from "react";
import { pusherClient } from "@/lib/pusher-client";
import { Users } from "lucide-react";
import { motion } from "framer-motion";

export function LiveActiveUsers() {
  const [activeCount, setActiveCount] = useState(0);

  useEffect(() => {
    const channel = pusherClient.subscribe("presence-global");

    channel.bind("pusher:subscription_succeeded", (members: any) => {
      setActiveCount(members.count);
    });

    channel.bind("pusher:member_added", (member: any) => {
      setActiveCount(channel.members.count);
    });

    channel.bind("pusher:member_removed", (member: any) => {
      setActiveCount(channel.members.count);
    });

    return () => {
      pusherClient.unsubscribe("presence-global");
    };
  }, []);

  return (
    <div className="flex items-center gap-2 bg-slate-900 dark:bg-slate-800 text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-sm">
      <div className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
      </div>
      <Users className="w-3 h-3 text-slate-300" />
      <span>{activeCount} active now</span>
    </div>
  );
}
