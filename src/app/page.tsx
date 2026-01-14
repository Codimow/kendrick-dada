"use client";

import { motion, useScroll, useTransform, useSpring, MotionValue } from "framer-motion";
import { useRef } from "react";
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
          alt="Album"
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
  
  const textY = useTransform(
    smoothProgress, 
    [0, textCenterPoint], 
    ["-45vh", "0vh"]
  );

  const textScale = useTransform(
    smoothProgress,
    hasAlbums 
      ? [0, textCenterPoint, albumPhaseEnd, 1] 
      : [0, textCenterPoint, 1],
    hasAlbums
      ? [1, 8, 8, 2500]
      : [1, 8, 2500]
  );

  const backgroundColor = useTransform(
    smoothProgress,
    [0.85, 0.98],
    ["#000000", "#ffffff"]
  );

  const textOpacity = useTransform(
    smoothProgress,
    [0.95, 1],
    [1, 0] 
  );

  return (
    <SmoothScroll>
      <motion.main 
        ref={containerRef} 
        style={{ backgroundColor }}
        className="relative h-[800vh] overflow-x-hidden"
      >
        <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
          
          <motion.div
            style={{
              y: textY,
              scale: textScale,
              opacity: textOpacity,
            }}
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

          <div className="absolute left-10 bottom-10 overflow-hidden h-32 w-[1px] bg-white/10">
            <motion.div 
              style={{ scaleY: scrollYProgress, originY: 1 }}
              className="w-full h-full bg-white/40"
            />
          </div>
        </div>

        <div className="absolute bottom-0 w-full h-screen flex items-center justify-center pointer-events-none">
          <motion.span 
            style={{ opacity: useTransform(smoothProgress, [0.9, 1], [0, 0.2]) }}
            className={`${bebas.className} text-black text-sm tracking-[1em] uppercase`}
          >
            NOT LIKE US
          </motion.span>
        </div>
      </motion.main>
    </SmoothScroll>
  );
}