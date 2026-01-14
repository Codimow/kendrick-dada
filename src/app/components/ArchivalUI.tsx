"use client";

import { useState, useEffect } from "react";

export default function ArchivalUI() {
  const [time, setTime] = useState("");
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-[60] pointer-events-none p-6 md:p-10 flex flex-col justify-between mix-blend-difference font-mono text-[10px] tracking-[0.3em] text-white uppercase opacity-60">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <p>REF: OKLAMA_ARCHIVE</p>
          <p>STATUS: SYSTEM_SYNC</p>
        </div>
        <div className="text-right space-y-1">
          <p>{time || "00:00:00"}</p>
          <p>33.8958° N, 118.2201° W</p>
        </div>
      </div>
      <div className="flex justify-between items-end">
        <p>© 2024 PGLANG COLLECTIVE</p>
        <p>MOD: GNX_VERSION_01</p>
      </div>
    </div>
  );
}
