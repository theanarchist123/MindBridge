"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, ShieldAlert, Brain, Users } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Alert {
  _id: string;
  severity: "critical" | "high";
  source: "assessment" | "peer_escalation" | "crisis_mode";
  consentGiven: boolean;
  studentHash?: string;
  assessmentType?: string;
  score?: number;
  status: string;
  createdAt: string;
}

interface AlertCardProps {
  alert: Alert;
  onAcknowledge: (id: string) => void;
  index: number;
}

const SOURCE_MAP = {
  assessment: { icon: ShieldAlert, label: "Assessment Flag", color: "text-amber-500" },
  crisis_mode: { icon: Brain, label: "MindBot Crisis Detection", color: "text-rose-500" },
  peer_escalation: { icon: Users, label: "Peer Escalation", color: "text-indigo-500" },
};

export function AlertCard({ alert, onAcknowledge, index }: AlertCardProps) {
  const isCritical = alert.severity === "critical";
  const source = SOURCE_MAP[alert.source] || SOURCE_MAP.assessment;
  const Icon = source.icon;
  const timeAgo = formatDistanceToNow(new Date(alert.createdAt), { addSuffix: true });

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 30, scale: 0.95 }}
      transition={{ delay: index * 0.06 }}
      layout
      className={`relative overflow-hidden rounded-2xl border p-4 ${
        isCritical
          ? "border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/10"
          : "border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/10"
      }`}
    >
      {/* Heartbeat pulse strip */}
      <motion.div
        className={`absolute top-0 left-0 h-1 ${isCritical ? "bg-rose-500" : "bg-amber-500"}`}
        animate={{ width: ["0%", "100%", "0%"] }}
        transition={{ duration: isCritical ? 1.2 : 2, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          {/* Severity indicator */}
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: isCritical ? 1 : 2, repeat: Infinity }}
            className={`mt-0.5 p-2 rounded-xl ${
              isCritical
                ? "bg-rose-100 dark:bg-rose-900/40"
                : "bg-amber-100 dark:bg-amber-900/40"
            }`}
          >
            <Icon className={`w-4 h-4 ${source.color}`} />
          </motion.div>

          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <Badge
                variant="outline"
                className={`text-[10px] font-bold uppercase tracking-wider ${
                  isCritical
                    ? "border-rose-300 text-rose-600 dark:border-rose-700 dark:text-rose-400"
                    : "border-amber-300 text-amber-600 dark:border-amber-700 dark:text-amber-400"
                }`}
              >
                {alert.severity}
              </Badge>
              <span className="text-xs text-slate-500">{source.label}</span>
            </div>

            <div className="text-sm text-slate-700 dark:text-slate-300 space-y-0.5">
              {alert.consentGiven && alert.studentHash ? (
                <p>Student: <span className="font-semibold text-teal-600 dark:text-teal-400">{alert.studentHash}</span></p>
              ) : (
                <p className="text-slate-400 italic">Anonymous student (no consent given)</p>
              )}
              {alert.assessmentType && (
                <p className="text-xs text-slate-500">
                  {alert.assessmentType} · Score: <span className="font-medium">{alert.score}</span>
                </p>
              )}
            </div>

            <div className="flex items-center gap-1 mt-1.5 text-[10px] text-slate-400">
              <Clock className="w-3 h-3" /> {timeAgo}
            </div>
          </div>
        </div>

        <Button
          size="sm"
          variant="outline"
          className={`shrink-0 rounded-xl text-xs ${
            isCritical
              ? "border-rose-200 hover:bg-rose-50 dark:border-rose-800 dark:hover:bg-rose-950/30"
              : "border-amber-200 hover:bg-amber-50 dark:border-amber-800 dark:hover:bg-amber-950/30"
          }`}
          onClick={() => onAcknowledge(alert._id)}
        >
          <CheckCircle className="w-3.5 h-3.5 mr-1.5" /> Acknowledge
        </Button>
      </div>
    </motion.div>
  );
}
