"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { AssessmentForm } from "@/components/AssessmentForm";
import { FileText, Clock, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { CrisisOverlay } from "@/components/CrisisOverlay";
import { ConsentBridge } from "@/components/ConsentBridge";
import { formatDistanceToNow } from "date-fns";

export default function AssessmentPage() {
  const [activeAssessment, setActiveAssessment] = useState<"PHQ-9" | "GAD-7" | "PSS-10" | null>(null);
  const [showCrisis, setShowCrisis] = useState(false);
  const [showConsentBridge, setShowConsentBridge] = useState(false);
  const [recentScore, setRecentScore] = useState<number | undefined>();
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/assessment")
      .then((res) => res.json())
      .then((data) => {
        if (data.assessments) {
          setHistory(data.assessments);
        }
      });
  }, []);

  const getLatest = (type: string) => {
    return history.find((a) => a.type === type);
  };

  const handleComplete = (score: number, isCritical: boolean, type: string) => {
    toast.success("Assessment Complete", {
      description: `Your ${type} score of ${score} has been saved.`,
    });
    
    // Refresh history
    fetch("/api/assessment")
      .then((res) => res.json())
      .then((data) => setHistory(data.assessments || []));
    
    if (isCritical) {
      setRecentScore(score);
      setShowConsentBridge(true);
      setShowCrisis(true);
    }
  };


  return (
    <div className="space-y-8 pb-12">
      <CrisisOverlay isTriggered={showCrisis} onClose={() => setShowCrisis(false)} />
      <ConsentBridge 
        isOpen={showConsentBridge} 
        onConsent={() => setShowConsentBridge(false)} 
        onDecline={() => setShowConsentBridge(false)} 
        score={recentScore}
      />
      
      <div>
        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl sm:text-4xl font-heading font-bold text-slate-900 dark:text-white"
        >
          Clinical Assessments
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-slate-500 dark:text-slate-400 mt-2 max-w-2xl"
        >
          Standardized screening tools to help track your mental wellness over time. 
          Your results are entirely confidential.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* PHQ-9 Card */}
        <Sheet>
          <Card className="border-0 shadow-lg bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl relative overflow-hidden group hover:shadow-xl transition-all">
            <div className="absolute top-0 left-0 w-1 h-full bg-rose-500" />
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <div className="p-2 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-lg">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="flex items-center text-xs font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">
                  <Clock className="w-3 h-3 mr-1" /> 3 mins
                </div>
              </div>
              <CardTitle className="font-heading text-xl">PHQ-9</CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400 line-clamp-2">
                Patient Health Questionnaire. Screens for depression severity and tracks changes over time.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="text-sm">
                  {getLatest("PHQ9") ? (
                    <>
                      <p className="text-slate-500 text-xs">Last taken</p>
                      <p className="font-medium text-slate-900 dark:text-white">
                        {formatDistanceToNow(new Date(getLatest("PHQ9").createdAt))} ago 
                        <span className="text-rose-500 ml-1">({getLatest("PHQ9").totalScore})</span>
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-slate-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3 text-rose-500"/> Recommended</p>
                      <p className="font-medium text-slate-900 dark:text-white">Not taken yet</p>
                    </>
                  )}
                </div>
                <SheetTrigger>
                  <Button className="bg-rose-600 hover:bg-rose-700 text-white shadow-md">Take Now</Button>
                </SheetTrigger>
              </div>
            </CardContent>
          </Card>
          
          <SheetContent side="right" className="w-full sm:max-w-xl md:max-w-2xl p-0 border-0 bg-transparent sm:bg-slate-50/95 sm:dark:bg-slate-950/95 backdrop-blur-xl overflow-y-auto">
            <div className="min-h-full w-full flex items-center justify-center p-4 py-12 sm:p-8">
              <AssessmentForm type="PHQ-9" onComplete={(score, tier) => handleComplete(score, tier, "PHQ-9")} />
            </div>
          </SheetContent>
        </Sheet>

        {/* GAD-7 Card */}
        <Sheet>
          <Card className="border-0 shadow-lg bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl relative overflow-hidden group hover:shadow-xl transition-all">
            <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <div className="p-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-lg">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="flex items-center text-xs font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">
                  <Clock className="w-3 h-3 mr-1" /> 2 mins
                </div>
              </div>
              <CardTitle className="font-heading text-xl">GAD-7</CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400 line-clamp-2">
                General Anxiety Disorder-7. Measures the severity of various signs of anxiety.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="text-sm">
                  {getLatest("GAD7") ? (
                    <>
                      <p className="text-slate-500 text-xs">Last taken</p>
                      <p className="font-medium text-slate-900 dark:text-white">
                        {formatDistanceToNow(new Date(getLatest("GAD7").createdAt))} ago 
                        <span className="text-amber-500 ml-1">({getLatest("GAD7").totalScore})</span>
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-slate-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3 text-amber-500"/> Recommended</p>
                      <p className="font-medium text-slate-900 dark:text-white">Not taken yet</p>
                    </>
                  )}
                </div>
                <SheetTrigger>
                  <Button className="bg-amber-500 hover:bg-amber-600 text-white shadow-md">Take Now</Button>
                </SheetTrigger>
              </div>
            </CardContent>
          </Card>
          
          <SheetContent side="right" className="w-full sm:max-w-xl md:max-w-2xl p-0 border-0 bg-transparent sm:bg-slate-50/95 sm:dark:bg-slate-950/95 backdrop-blur-xl overflow-y-auto">
            <div className="min-h-full w-full flex items-center justify-center p-4 py-12 sm:p-8">
              <AssessmentForm type="GAD-7" onComplete={(score, tier) => handleComplete(score, tier, "GAD-7")} />
            </div>
          </SheetContent>
        </Sheet>

        {/* PSS-10 Card */}
        <Sheet>
          <Card className="border-0 shadow-lg bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl relative overflow-hidden group hover:shadow-xl transition-all">
            <div className="absolute top-0 left-0 w-1 h-full bg-teal-500" />
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <div className="p-2 bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-lg">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="flex items-center text-xs font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">
                  <Clock className="w-3 h-3 mr-1" /> 4 mins
                </div>
              </div>
              <CardTitle className="font-heading text-xl">PSS-10</CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400 line-clamp-2">
                Perceived Stress Scale. The most widely used psychological instrument for measuring the perception of stress.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="text-sm">
                  {getLatest("PSS10") ? (
                    <>
                      <p className="text-slate-500 text-xs">Last taken</p>
                      <p className="font-medium text-slate-900 dark:text-white">
                        {formatDistanceToNow(new Date(getLatest("PSS10").createdAt))} ago 
                        <span className="text-teal-500 ml-1">({getLatest("PSS10").totalScore})</span>
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-slate-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3 text-teal-500"/> Recommended</p>
                      <p className="font-medium text-slate-900 dark:text-white">Not taken yet</p>
                    </>
                  )}
                </div>
                <SheetTrigger>
                  <Button className="bg-teal-600 hover:bg-teal-700 text-white shadow-md">Take Now</Button>
                </SheetTrigger>
              </div>
            </CardContent>
          </Card>
          
          <SheetContent side="right" className="w-full sm:max-w-xl md:max-w-2xl p-0 border-0 bg-transparent sm:bg-slate-50/95 sm:dark:bg-slate-950/95 backdrop-blur-xl overflow-y-auto">
            <div className="min-h-full w-full flex items-center justify-center p-4 py-12 sm:p-8">
              <AssessmentForm type="PSS-10" onComplete={(score, tier) => handleComplete(score, tier, "PSS-10")} />
            </div>
          </SheetContent>
        </Sheet>

      </div>
    </div>
  );
}
