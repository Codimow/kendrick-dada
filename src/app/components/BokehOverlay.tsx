"use client";

import { motion, useTransform, MotionValue } from "framer-motion";

export default function BokehOverlay({ smoothProgress }: { smoothProgress: MotionValue<number> }) {
  // Intensity increases as we reach the mega-zoom
  const opacity = useTransform(smoothProgress, [0.7, 0.95], [0, 0.4]);
  const scale = useTransform(smoothProgress, [0.7, 1], [1, 2]);

  return (
    <motion.div 
      style={{ opacity, scale }}
      className="fixed inset-0 z-[40] pointer-events-none"
    >
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/20 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-zinc-400/10 blur-[150px] rounded-full" />
      <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-white/5 blur-[100px] rounded-full animate-bounce" style={{ animationDuration: '8s' }} />
    </motion.div>
  );
}
