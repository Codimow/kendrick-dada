"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";
import { Bebas_Neue } from "next/font/google";

import SmoothScroll from "./components/SmoothScroll";
import AlbumCard from "./components/AlbumCard";
import ArchivalUI from "./components/ArchivalUI";
import PerspectiveGrid from "./components/PerspectiveGrid";
import SystemMonitor from "./components/SystemMonitor";
import BokehOverlay from "./components/BokehOverlay";

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
});

const ALBUMS = [
  { src: "/1.jpg", title: "DAMN.", year: "2017" },
  { src: "/2.jpg", title: "good kid, m.A.A.d city", year: "2012" },
  { src: "/3.jpg", title: "GNX", year: "2024" },
  { src: "/4.jpg", title: "To Pimp a Butterfly", year: "2015" },
  { src: "/5.jpg", title: "Section.80", year: "2011" },
  { src: "/6.jpg", title: "Mr. Morale & The Big Steppers", year: "2022" },
];

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const albumCount = ALBUMS.length;
  const albumPhaseEnd = 0.75;
  const textCenterPoint = 0.2;
  
  const textY = useTransform(smoothProgress, [0, textCenterPoint], ["-45vh", "0vh"]);
  const textScale = useTransform(
    smoothProgress,
    [0, textCenterPoint, albumPhaseEnd, 1],
    [1, 8, 8, 2500]
  );

  // CHROMATIC ABERRATION: Intensifies during zoom
  const aberration = useTransform(smoothProgress, [0.85, 1], [0, 20]);
  const textShadow = useTransform(aberration, (val) => 
    `${val}px 0px 0px rgba(255,0,0,0.5), -${val}px 0px 0px rgba(0,255,255,0.5)`
  );

  const backgroundColor = useTransform(smoothProgress, [0.85, 0.98], ["#000000", "#ffffff"]);
  const textOpacity = useTransform(smoothProgress, [0.95, 1], [1, 0]);

  return (
    <SmoothScroll>
      <motion.main 
        ref={containerRef} 
        style={{ backgroundColor }}
        className="relative h-[800vh] overflow-x-hidden"
      >
        <ArchivalUI />
        
        <PerspectiveGrid smoothProgress={smoothProgress} />
        
        <SystemMonitor />
        
        <BokehOverlay smoothProgress={smoothProgress} />

        <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
          
          {/* Main Text Container */}
          <motion.div
            style={{ 
              y: textY, 
              scale: textScale, 
              opacity: textOpacity,
              textShadow: textShadow
            }}
            className={`${bebas.className} z-50 pointer-events-none flex flex-col items-center justify-center text-center`}
          >
            <h1 className="text-[12px] md:text-[14px] font-normal tracking-[0.4em] uppercase whitespace-nowrap leading-none text-white">
              KENDRICK LAMAR
            </h1>
          </motion.div>

          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {ALBUMS.map((album, index) => (
              <AlbumCard 
                key={index} 
                album={album} 
                index={index} 
                total={albumCount}
                smoothProgress={smoothProgress} 
                albumPhaseEnd={albumPhaseEnd}
              />
            ))}
          </div>

          {/* Minimal Scroll Sidebar */}
          <div className="absolute right-10 top-1/2 -translate-y-1/2 h-32 w-[1px] bg-white/10 overflow-hidden">
            <motion.div 
              style={{ scaleY: scrollYProgress, originY: 0 }}
              className="w-full h-full bg-white/40"
            />
          </div>
        </div>

        <div className="absolute bottom-0 w-full h-screen flex items-center justify-center pointer-events-none">
          <motion.span 
            style={{ opacity: useTransform(smoothProgress, [0.9, 1], [0, 0.4]) }}
            className={`${bebas.className} text-black text-2xl md:text-4xl tracking-[1.2em] uppercase`}
          >
            NOT LIKE US
          </motion.span>
        </div>
      </motion.main>
    </SmoothScroll>
  );
}
