"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Lock, User, ShieldCheck, Dice5, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { toast } from "sonner";

// Helper to generate a random pseudonym
const adjectives = ["Blue", "Silent", "Neon", "Wandering", "Cosmic", "Hidden", "Echo", "Crimson"];
const nouns = ["Falcon", "Pine", "Wave", "Owl", "Comet", "Fox", "River", "Pulse"];
const generatePseudonym = () => {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const num = Math.floor(Math.random() * 99) + 1;
  return `${adj}${noun}${num}`;
};

export default function SignUpPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [college, setCollege] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // In a real app, this calls our /api/auth/register endpoint
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, role, college, inviteCode }),
      });

      if (res.ok) {
        toast.success("Identity Secured", { description: "Your pseudonym has been registered." });
        router.push("/auth/signin");
      } else {
        const error = await res.text();
        toast.error("Registration Failed", { description: error });
      }
    } catch (error) {
      toast.error("Network Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-mesh opacity-30 pointer-events-none" />

      {/* Left Side */}
      <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center relative z-10 hidden md:flex border-r border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/20 backdrop-blur-3xl">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-md mx-auto space-y-8"
        >
          <div className="flex items-center gap-3 mb-12">
            <div className="p-3 bg-teal-100 dark:bg-teal-900/30 rounded-2xl">
              <ShieldCheck className="w-8 h-8 text-teal-600 fill-teal-600/20" />
            </div>
            <span className="font-heading text-3xl font-bold text-slate-900 dark:text-white">Total Anonymity</span>
          </div>

          <h1 className="text-4xl lg:text-5xl font-heading font-bold text-slate-900 dark:text-white leading-tight">
            We don't want your real name.
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            MindBridge is designed to be a safe space. We never ask for your email, phone number, or student ID.
          </p>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Choose a pseudonym and a password you won't forget. That's all we need.
          </p>
        </motion.div>
      </div>

      {/* Right Side */}
      <div className="w-full md:w-1/2 p-6 md:p-16 flex items-center justify-center relative z-10">
        <div className="w-full max-w-md">
          <div className="md:hidden flex items-center gap-2 mb-8 justify-center">
            <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
            <span className="font-heading text-xl font-bold text-slate-900 dark:text-white">MindBridge</span>
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-1/2 h-1.5 rounded-full transition-colors duration-500 ${step >= 1 ? 'bg-teal-500' : 'bg-slate-200 dark:bg-slate-800'}`} />
              <div className={`w-1/2 h-1.5 rounded-full transition-colors duration-500 ${step >= 2 ? 'bg-teal-500' : 'bg-slate-200 dark:bg-slate-800'}`} />
            </div>
            <h2 className="text-3xl font-heading font-bold text-slate-900 dark:text-white">
              {step === 1 ? "Choose Identity" : "Secure Account"}
            </h2>
          </div>

          <Card className="border-0 shadow-2xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl relative overflow-hidden">
            <CardContent className="pt-6">
              <form onSubmit={handleRegister} className="space-y-6">
                <div className="space-y-6">
                  {step === 1 ? (
                    <div
                      key="step1"
                      className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500"
                    >
                      <div className="space-y-3">
                        <Label htmlFor="username" className="text-slate-700 dark:text-slate-300">Your Pseudonym</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <Input
                            id="username"
                            type="text"
                            placeholder="e.g. NeonOwl44"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="pl-10 pr-12 h-14 text-lg font-medium bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800"
                            required
                          />
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon" 
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-teal-600 hover:text-teal-700 hover:bg-teal-50 dark:hover:bg-teal-900/30"
                            onClick={() => setUsername(generatePseudonym())}
                            title="Generate random pseudonym"
                          >
                            <Dice5 className="w-5 h-5" />
                          </Button>
                        </div>
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" /> This will be your display name in Peer Chat.
                        </p>
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="college" className="text-slate-700 dark:text-slate-300">Your College</Label>
                        <select
                          id="college"
                          value={college}
                          onChange={(e) => setCollege(e.target.value)}
                          className="w-full h-14 px-4 text-lg font-medium rounded-md bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                          required
                        >
                          <option value="" disabled>Select College</option>
                          <option value="Generic University">Generic University</option>
                          <option value="Mumbai University">Mumbai University</option>
                          <option value="Delhi University">Delhi University</option>
                          <option value="IIT Bombay">IIT Bombay</option>
                        </select>
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="role" className="text-slate-700 dark:text-slate-300">I am a...</Label>
                        <select
                          id="role"
                          value={role}
                          onChange={(e) => setRole(e.target.value)}
                          className="w-full h-14 px-4 text-lg font-medium rounded-md bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                          required
                        >
                          <option value="student">Student</option>
                          <option value="counsellor">College Counsellor</option>
                        </select>
                      </div>

                      {role === "counsellor" && (
                        <div className="space-y-3">
                          <Label htmlFor="inviteCode" className="text-slate-700 dark:text-slate-300">Counsellor Invite Code</Label>
                          <Input
                            id="inviteCode"
                            type="password"
                            placeholder="Enter administrative invite code"
                            value={inviteCode}
                            onChange={(e) => setInviteCode(e.target.value)}
                            className="h-14 text-lg font-medium bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800"
                            required
                          />
                        </div>
                      )}
                      
                      <Button type="button" onClick={() => { if (username && college && (role !== "counsellor" || inviteCode)) setStep(2); }} className="w-full h-12 text-base font-medium rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 dark:text-slate-900 shadow-lg group">
                        Next Step <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  ) : (
                    <div
                      key="step2"
                      className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500"
                    >
                      <div className="p-4 rounded-xl bg-teal-50 dark:bg-teal-900/20 border border-teal-100 dark:border-teal-900/30 flex items-center justify-between mb-4">
                        <span className="text-sm font-medium text-teal-800 dark:text-teal-300">Identity: <span className="font-bold">{username}</span></span>
                        <button type="button" onClick={() => setStep(1)} className="text-xs text-teal-600 hover:underline">Change</button>
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="password" className="text-slate-700 dark:text-slate-300">Create Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <Input
                            id="password"
                            type="password"
                            placeholder="Must be memorable"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pl-10 h-14 text-lg bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800"
                            required
                            minLength={6}
                          />
                        </div>
                        <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                          Warning: Since we don't have your email, passwords CANNOT be reset. Write this down.
                        </p>
                      </div>

                      <Button 
                        type="submit" 
                        disabled={loading}
                        className="w-full h-12 text-base font-medium rounded-xl bg-teal-600 hover:bg-teal-700 text-white shadow-lg group"
                      >
                        {loading ? "Securing Account..." : "Complete Registration"}
                      </Button>
                    </div>
                  )}
                </div>
                
              </form>
            </CardContent>
          </Card>

          <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
            Already have a pseudonym?{" "}
            <Link href="/auth/signin" className="font-semibold text-teal-600 dark:text-teal-400 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
