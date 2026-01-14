"use client";

import { motion, useTransform, MotionValue } from "framer-motion";

export default function PerspectiveGrid({ smoothProgress }: { smoothProgress: MotionValue<number> }) {
  // Grid moves towards the camera
  const z = useTransform(smoothProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(smoothProgress, [0.8, 0.95], [0.1, 0]);

  return (
    <motion.div 
      style={{ opacity }}
      className="fixed inset-0 z-0 pointer-events-none perspective-[1000px]"
    >
      {/* Floor Grid */}
      <motion.div 
        style={{ backgroundPosition: `0px ${z}` }}
        className="absolute bottom-0 w-full h-[50vh] origin-bottom [transform:rotateX(80deg)] bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:100px_100px]"
      />
      
      {/* Ceiling Grid */}
      <motion.div 
        style={{ backgroundPosition: `0px ${z}` }}
        className="absolute top-0 w-full h-[50vh] origin-top [transform:rotateX(-80deg)] bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:100px_100px]"
      />
      
      {/* Side Atmosphere */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />
    </motion.div>
  );
}
