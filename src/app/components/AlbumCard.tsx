"use client";

import { motion, useTransform, MotionValue } from "framer-motion";
import Image from "next/image";
import { Bebas_Neue } from "next/font/google";

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
});

interface Album {
  src: string;
  title: string;
  year: string;
}

export default function AlbumCard({
  album,
  index,
  total,
  smoothProgress,
  albumPhaseEnd,
}: {
  album: Album;
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

  // Dynamic Metadata: Slides in when at peak
  const metaOpacity = useTransform(cardProgress, [0.4, 0.45, 0.55, 0.6], [0, 1, 1, 0]);
  const metaY = useTransform(cardProgress, [0.4, 0.5, 0.6], [10, 0, -10]);

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
          src={album.src}
          alt={album.title}
          fill
          className="object-cover"
          sizes="384px"
        />
        
        {/* Dynamic Metadata Label */}
        <motion.div 
          style={{ opacity: metaOpacity, y: metaY }}
          className="absolute inset-0 flex flex-col items-center justify-end pb-8 bg-gradient-to-t from-black/80 via-transparent to-transparent"
        >
          <p className={`${bebas.className} text-white text-2xl tracking-widest`}>{album.title}</p>
          <p className="text-white/40 font-mono text-[10px] tracking-[0.4em]">{album.year}</p>
        </motion.div>
      </div>
    </motion.div>
  );
}
