"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Heart, Lock, User, ArrowRight, ShieldCheck, Sparkles, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { toast } from "sonner";

export default function SignInPage() {
  const router = useRouter();
  const { status } = useSession();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [dbError, setDbError] = useState(false);

  // Fix #1 — Clear stale JWT cookies on mount
  // JWT_SESSION_ERROR means old encrypted cookies can't be decrypted (secret changed).
  // Hitting the signout endpoint destroys the bad cookie silently.
  useEffect(() => {
    fetch("/api/auth/signout", { method: "POST" }).catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setDbError(false);

    try {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        // Fix #2 — Distinguish DB timeout from wrong credentials
        // Wrong credentials fail fast (< 1s). DB timeouts take ~5s with our new timeout.
        if (
          result.error !== "CredentialsSignin" &&
          !result.error.toLowerCase().includes("invalid") &&
          !result.error.toLowerCase().includes("credentials")
        ) {
          setDbError(true);
          toast.error("Database connection issue", {
            description: "Cannot reach the server. Check your MongoDB URI and try again.",
          });
        } else {
          toast.error("Invalid pseudonym or password", {
            description: "Double-check your pseudonym and password.",
          });
        }
        setLoading(false);
        return;
      }

      // Fetch fresh session to get role + onboardingDone
      const sessionRes = await fetch("/api/auth/session");
      const sessionData = await sessionRes.json();
      const role = sessionData?.user?.role;
      const onboardingDone = sessionData?.user?.onboardingDone;

      toast.success("Welcome back!", { description: "You are securely signed in." });

      if (role === "counsellor" || role === "admin") {
        router.push("/counsellor/dashboard");
      } else if (!onboardingDone) {
        router.push("/onboarding");
      } else {
        router.push("/home");
      }
    } catch {
      toast.error("Network error — please check your connection.");
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 w-full bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-mesh opacity-30 pointer-events-none" />

      {/* Left Side — Brand */}
      <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center relative z-10 hidden md:flex border-r border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/20 backdrop-blur-3xl">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-md mx-auto space-y-8"
        >
          <div className="flex items-center gap-3 mb-12">
            <div className="p-3 bg-rose-100 dark:bg-rose-900/30 rounded-2xl">
              <Heart className="w-8 h-8 text-rose-500 fill-rose-500" />
            </div>
            <span className="font-heading text-3xl font-bold text-slate-900 dark:text-white">MindBridge</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-heading font-bold text-slate-900 dark:text-white leading-tight">
            Welcome back to your safe space.
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Log in to continue your journey, track your wellness, and connect with peers securely and anonymously.
          </p>
          <div className="pt-8 space-y-4">
            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
              <ShieldCheck className="w-6 h-6 text-teal-500" />
              <span>100% Anonymous & Confidential</span>
            </div>
            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
              <Sparkles className="w-6 h-6 text-amber-500" />
              <span>24/7 AI MindBot Support</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Side — Form */}
      <div className="w-full md:w-1/2 p-6 md:p-16 flex items-center justify-center relative z-10">
        <div className="w-full max-w-md space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
          {/* Mobile logo */}
          <div className="md:hidden flex items-center gap-2 mb-6 justify-center">
            <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
            <span className="font-heading text-xl font-bold text-slate-900 dark:text-white">MindBridge</span>
          </div>

          <div className="text-center md:text-left space-y-2">
            <h2 className="text-3xl font-heading font-bold text-slate-900 dark:text-white">Sign In</h2>
            <p className="text-slate-500 dark:text-slate-400">
              Enter your pseudonym and password to access your dashboard.
            </p>
          </div>

          {/* Fix #2 — DB error banner */}
          {dbError && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-3 text-sm text-amber-700 dark:text-amber-300"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Database unreachable</p>
                <p className="text-xs mt-0.5 text-amber-600 dark:text-amber-400">
                  Check that your MongoDB URI in{" "}
                  <code className="font-mono bg-amber-100 dark:bg-amber-900/40 px-1 rounded">.env.local</code>{" "}
                  is correct and the cluster is running.
                </p>
              </div>
            </motion.div>
          )}

          <Card className="border-0 shadow-2xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl">
            <CardContent className="pt-6">
              {/*
                Fix #3 — suppressHydrationWarning on inputs:
                Browser password-manager extensions (LastPass, Bitwarden, etc.) inject
                fdprocessedid attributes into form fields AFTER the server renders HTML.
                This causes React hydration warnings. suppressHydrationWarning tells
                React to accept the mismatch gracefully instead of erroring.
              */}
              <form onSubmit={handleSubmit} className="space-y-5" autoComplete="on">
                <div className="space-y-2">
                  <Label htmlFor="signin-username" className="text-slate-700 dark:text-slate-300">
                    Pseudonym
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                    <Input
                      id="signin-username"
                      name="username"
                      type="text"
                      placeholder="e.g. BlueFalcon22"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="pl-10 h-12 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800"
                      autoComplete="username"
                      required
                      suppressHydrationWarning
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signin-password" className="text-slate-700 dark:text-slate-300">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                    <Input
                      id="signin-password"
                      name="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 h-12 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800"
                      autoComplete="current-password"
                      required
                      suppressHydrationWarning
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  suppressHydrationWarning
                  className="w-full h-12 text-base font-medium rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 dark:text-slate-900 shadow-lg group transition-all"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full"
                      />
                      Authenticating…
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Access Dashboard
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400">
            Don't have an account?{" "}
            <Link href="/auth/signup" className="font-semibold text-teal-600 dark:text-teal-400 hover:underline">
              Create your pseudonym
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
