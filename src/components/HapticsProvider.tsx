"use client";

import { useEffect } from "react";
import { Haptics, ImpactStyle } from "@capacitor/haptics";

export function HapticsProvider() {
  useEffect(() => {
    // Only run on client
    if (typeof window === "undefined") return;

    const handlePointerDown = async (e: PointerEvent) => {
      // Find the closest clickable element (button, anchor, or anything with role=button)
      const target = e.target as HTMLElement;
      const clickable = target.closest("button, a, [role='button'], [role='tab'], input[type='submit']");
      
      if (clickable) {
        // Trigger a native system-level haptic tick
        try {
          await Haptics.impact({ style: ImpactStyle.Light });
        } catch (err) {
          // Ignore if running on a platform that doesn't support it or if it fails
        }
      }
    };

    // Use pointerdown for immediate feedback before the click event fires
    document.addEventListener("pointerdown", handlePointerDown, { passive: true });

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  return null; // This component doesn't render anything
}
