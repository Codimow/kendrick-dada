"use client";

import { useEffect, useState } from "react";

export default function SystemMonitor() {
  const [bars, setBars] = useState<number[]>([]);

  useEffect(() => {
    // Simulate a jittery digital waveform
    const interval = setInterval(() => {
      const newBars = Array.from({ length: 40 }, () => Math.random() * 100);
      setBars(newBars);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[60] flex items-end gap-[2px] h-8 opacity-40 pointer-events-none mix-blend-difference">
      {bars.map((height, i) => (
        <div 
          key={i} 
          className="w-[2px] bg-white transition-all duration-100 ease-in-out"
          style={{ height: `${height}%` }}
        />
      ))}
      <div className="absolute -top-6 left-0 w-full flex justify-between font-mono text-[7px] tracking-[0.3em] text-white">
        <span>FRQ_LOW</span>
        <span>SIG_STABLE</span>
        <span>FRQ_HIGH</span>
      </div>
    </div>
  );
}
