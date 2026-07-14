"use client";

import { useEffect } from "react";

export function HapticsProvider() {
  useEffect(() => {
    // Only run on client
    if (typeof window === "undefined" || !navigator.vibrate) return;

    const handlePointerDown = (e: PointerEvent) => {
      // Find the closest clickable element (button, anchor, or anything with role=button)
      const target = e.target as HTMLElement;
      const clickable = target.closest("button, a, [role='button'], [role='tab'], input[type='submit']");
      
      if (clickable) {
        // Trigger a very light haptic tick (10ms)
        try {
          navigator.vibrate(10);
        } catch (err) {
          // Ignore if the browser blocks it
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
