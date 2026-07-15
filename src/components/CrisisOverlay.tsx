"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { Phone, AlertTriangle, HeartPulse, CheckCircle2 } from "lucide-react";

export function CrisisOverlay({ isTriggered, onClose }: { isTriggered: boolean; onClose: () => void }) {
  const [isOpen, setIsOpen] = useState(isTriggered);

  useEffect(() => {
    setIsOpen(isTriggered);
  }, [isTriggered]);

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => {
        // Prevent accidental closing by only allowing state updates via explicit buttons
      }}
    >
      <DialogContent 
        className="sm:max-w-2xl border-rose-500 bg-rose-50 dark:bg-slate-950 shadow-[0_0_100px_rgba(225,29,72,0.2)] overflow-hidden"
        // @ts-ignore
        onInteractOutside={(e: any) => e.preventDefault()}
        // @ts-ignore
        onEscapeKeyDown={(e: any) => e.preventDefault()}
      >
        <DialogHeader className="mb-4">
          <DialogTitle className="flex items-center text-3xl font-heading text-rose-600 dark:text-rose-400 gap-3">
            <AlertTriangle className="h-8 w-8" />
            We are here for you.
          </DialogTitle>
          <DialogDescription className="text-base text-slate-700 dark:text-slate-300 mt-2">
            Our system noticed you might be going through a really difficult time right now. Please know you are not alone, and there is immediate, free, and confidential support available right this second.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Left Column - Helplines */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-rose-100 dark:border-rose-900/50 shadow-sm space-y-4">
              
              <div className="flex flex-col gap-3">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Tele-MANAS (Govt. of India)</h4>
                  <p className="text-xs text-slate-500">24/7 National Toll-Free Mental Health Helpline</p>
                </div>
                <a href="tel:14416" className={buttonVariants({ variant: "default", className: "bg-rose-600 hover:bg-rose-700 text-white w-full h-12 text-lg font-semibold" })}>
                  <Phone className="mr-2 h-5 w-5" />
                  14416
                </a>
              </div>
              
              <div className="w-full h-px bg-slate-100 dark:bg-slate-800 my-2" />

              <div className="flex flex-col gap-3">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Vandrevala Foundation</h4>
                  <p className="text-xs text-slate-500">24/7 Multilingual Crisis Support</p>
                </div>
                <a href="tel:9999666555" className={buttonVariants({ variant: "outline", className: "w-full h-12 text-lg font-semibold border-rose-200 text-rose-700 hover:bg-rose-50 dark:border-rose-900/50 dark:text-rose-400 dark:hover:bg-rose-950/50" })}>
                  <Phone className="mr-2 h-5 w-5" />
                  9999 666 555
                </a>
              </div>
            </div>
          </div>

          {/* Right Column - Breathing Exercise */}
          <div className="flex flex-col items-center justify-center bg-teal-50 dark:bg-teal-950/20 p-6 rounded-2xl border border-teal-100 dark:border-teal-900/50">
            <h4 className="text-teal-800 dark:text-teal-400 font-semibold mb-6 text-center">Breathe with this circle</h4>
            
            <div className="relative w-32 h-32 flex items-center justify-center mb-6">
              <motion.div
                animate={{
                  scale: [1, 1.8, 1.8, 1],
                  opacity: [0.5, 0.2, 0.2, 0.5],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut",
                  times: [0, 0.4, 0.6, 1] // Inhale 4s, Hold 2s, Exhale 4s
                }}
                className="absolute inset-0 bg-teal-400 rounded-full"
              />
              <motion.div
                animate={{
                  scale: [1, 1.5, 1.5, 1],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut",
                  times: [0, 0.4, 0.6, 1]
                }}
                className="absolute w-20 h-20 bg-teal-500 rounded-full shadow-[0_0_30px_rgba(20,184,166,0.6)]"
              />
              <HeartPulse className="w-8 h-8 text-white z-10 relative" />
            </div>

            <p className="text-sm text-teal-700 dark:text-teal-500 text-center font-medium">
              Inhale deeply... and exhale slowly. Focus on the movement.
            </p>
          </div>
        </div>
        
        <div className="flex justify-end pt-4 mt-2 border-t border-slate-200 dark:border-slate-800">
          <Button 
            variant="ghost" 
            onClick={() => {
              setIsOpen(false);
              onClose();
            }} 
            className="text-slate-500 hover:text-slate-900 dark:hover:text-white"
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            I am safe now, close this
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
