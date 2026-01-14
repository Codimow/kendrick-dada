"use client";

import { motion, useScroll, useTransform, useSpring, MotionValue } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { Bebas_Neue } from "next/font/google";
import SmoothScroll from "./components/SmoothScroll";

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
});

const ALBUMS = [
  "/1.jpg",
  "/2.jpg",
  "/3.jpg",
  "/4.jpg",
  "/5.jpg",
  "/6.jpg",
];

function AlbumCard({
  src,
  index,
  total,
  smoothProgress,
  albumPhaseEnd,
}: {
  src: string;
  index: number;
  total: number;
  smoothProgress: MotionValue<number>;
  albumPhaseEnd: number;
}) {
  const duration = 0.4; 
  const start = (index / total) * (albumPhaseEnd - duration * 0.5);
  const end = start + duration;

  const cardProgress = useTransform(smoothProgress, [start, end], [0, 1]);
  
  const x = useTransform(cardProgress, [0, 1], ["-80vw", "80vw"]);
  const y = useTransform(cardProgress, [0, 0.5, 1], ["100vh", "10vh", "100vh"]);
  const rotate = useTransform(cardProgress, [0, 1], [-70, 70]);
  const scale = useTransform(cardProgress, [0, 0.5, 1], [0.2, 1.3, 0.2]);
  const opacity = useTransform(cardProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);
  
  const filter = useTransform(
    cardProgress, 
    [0, 0.2, 0.5, 0.8, 1], 
    ["blur(20px)", "blur(0px)", "blur(0px)", "blur(0px)", "blur(20px)"]
  );

  return (
    <motion.div
      style={{
        x,
        y,
        rotate,
        scale,
        opacity,
        filter,
        position: "fixed",
        top: 0,
        left: "50%",
        marginLeft: "-12rem", 
        zIndex: 20 + index,
      }}
      className="w-96 h-96 pointer-events-none perspective-1000"
    >
      <div className="relative w-full h-full shadow-[0_40px_100px_rgba(0,0,0,0.9)] rounded-sm overflow-hidden border border-white/10 bg-zinc-900">
        <Image
          src={src}
          alt="Album Cover"
          fill
          className="object-cover"
          sizes="384px"
        />
      </div>
    </motion.div>
  );
}

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [time, setTime] = useState("");
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const albumCount = ALBUMS.length;
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const hasAlbums = albumCount > 0;
  const albumPhaseEnd = hasAlbums ? 0.75 : 0.0;
  const textCenterPoint = hasAlbums ? 0.2 : 0.4;
  
  const textY = useTransform(smoothProgress, [0, textCenterPoint], ["-45vh", "0vh"]);
  const textScale = useTransform(
    smoothProgress,
    hasAlbums ? [0, textCenterPoint, albumPhaseEnd, 1] : [0, textCenterPoint, 1],
    hasAlbums ? [1, 8, 8, 2500] : [1, 8, 2500]
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
        {/* ARCHIVAL UI OVERLAY */}
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
            <p>MOD: GNX_VERSION_01</p>
          </div>
        </div>

        <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
          
          <motion.div
            style={{ y: textY, scale: textScale, opacity: textOpacity }}
            className={`${bebas.className} z-50 pointer-events-none flex flex-col items-center justify-center`}
          >
            <h1 className="text-[12px] md:text-[14px] font-normal tracking-[0.4em] uppercase whitespace-nowrap leading-none text-white">
              KENDRICK LAMAR
            </h1>
          </motion.div>

          {hasAlbums && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {ALBUMS.map((src, index) => (
                <AlbumCard 
                  key={index} 
                  src={src} 
                  index={index} 
                  total={albumCount}
                  smoothProgress={smoothProgress} 
                  albumPhaseEnd={albumPhaseEnd}
                />
              ))}
            </div>
          )}

          {/* Minimal Scroll Progress Sidebar */}
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
