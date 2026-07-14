"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Settings, Moon, Sun, Bell, Bot, Trash2 } from "lucide-react";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export function SettingsDialog() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [counsellorMessages, setCounsellorMessages] = useState(true);
  const [memoryEnabled, setMemoryEnabled] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch settings on mount
  useEffect(() => {
    fetch('/api/user/settings')
      .then(res => res.json())
      .then(data => {
        if (data.mindbotMemoryEnabled !== undefined) {
          setMemoryEnabled(data.mindbotMemoryEnabled);
        }
      })
      .catch(console.error);
      
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotifications(Notification.permission === 'granted');
    }
    setMounted(true);
  }, []);

  const handleNotificationsToggle = async (checked: boolean) => {
    if (checked) {
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          setNotifications(true);
          if ('serviceWorker' in navigator) {
            fetch('/api/notifications/subscribe', { method: 'POST' }).catch(console.error);
          }
        } else {
          setNotifications(false);
          alert("Notification permission was denied.");
        }
      } else {
        alert("Your browser doesn't support notifications.");
        setNotifications(false);
      }
    } else {
      setNotifications(false);
    }
  };

  const handleMemoryToggle = async (checked: boolean) => {
    setMemoryEnabled(checked);
    await fetch('/api/user/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mindbotMemoryEnabled: checked })
    });
  };

  const handleForgetMemory = async () => {
    if (!confirm("Are you sure? This will permanently delete all your MindBot conversations.")) return;
    setIsDeleting(true);
    try {
      await fetch('/api/mindbot/memory', { method: 'DELETE' });
      setMemoryEnabled(false);
      alert("Your MindBot history has been deleted.");
    } catch (e) {
      console.error(e);
      alert("Failed to delete memory.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (!mounted) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-full">
          <Settings className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md border-0 bg-white/90 dark:bg-slate-950/90 backdrop-blur-2xl shadow-2xl">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl flex items-center gap-2">
            <Settings className="w-6 h-6 text-teal-500" />
            Preferences
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-8 py-4">
          {/* Appearance */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Appearance</h4>
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                {theme === "dark" ? <Moon className="w-5 h-5 text-indigo-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
                <div>
                  <Label className="text-base font-medium">Dark Mode</Label>
                  <p className="text-xs text-slate-500">Toggle dark mode interface</p>
                </div>
              </div>
              <Switch
                checked={theme === "dark"}
                onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
              />
            </div>
          </div>

          {/* Notifications */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Notifications</h4>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-rose-500" />
                  <div>
                    <Label className="text-base font-medium">Daily Check-in Reminder</Label>
                    <p className="text-xs text-slate-500">Get a reminder to log your mood</p>
                  </div>
                </div>
                <Switch
                  checked={notifications}
                  onCheckedChange={handleNotificationsToggle}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                <div className="flex flex-col">
                  <Label className="text-base font-medium">Counsellor Messages</Label>
                  <p className="text-xs text-slate-500">Alerts when a counsellor contacts you</p>
                </div>
                <Switch
                  checked={counsellorMessages}
                  onCheckedChange={setCounsellorMessages}
                />
              </div>
            </div>
          </div>

          {/* Privacy & Data */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Privacy & Data</h4>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <Bot className="w-5 h-5 text-indigo-500" />
                  <div>
                    <Label className="text-base font-medium">MindBot Memory</Label>
                    <p className="text-xs text-slate-500">Allow MindBot to securely remember past sessions</p>
                  </div>
                </div>
                <Switch
                  checked={memoryEnabled}
                  onCheckedChange={handleMemoryToggle}
                />
              </div>

              <div className="p-4 rounded-xl border border-rose-100 dark:border-rose-900/30 bg-rose-50/50 dark:bg-rose-900/10 flex flex-col gap-3">
                <div>
                  <Label className="text-base font-medium text-rose-600 dark:text-rose-400">Forget Everything</Label>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Permanently delete your MindBot history and rolling summaries. This action cannot be undone.</p>
                </div>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  className="w-full sm:w-auto" 
                  onClick={handleForgetMemory}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete MindBot History"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
