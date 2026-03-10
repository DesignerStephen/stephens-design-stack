"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface VinylCardProps {
  songTitle?: string;
  artist?: string;
  currentTime?: string;
  totalTime?: string;
  progress?: number;
  artworkSrc?: string;
}

export default function VinylCard({
  songTitle = "Lemon",
  artist = "Kenshi Yonezu",
  currentTime = "1:36",
  totalTime = "3:32",
  progress = 0.45,
  artworkSrc,
}: VinylCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="flex w-fit flex-col items-center rounded-2xl pb-4 pt-1 px-1 shadow-sm font-sans"
      style={{ backgroundColor: "var(--card-bg)" }}
      whileHover={{ rotate: 3 }}
      transition={{ type: "tween", duration: 0.15, ease: "easeOut" as const }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Vinyl Record */}
      <motion.div
        className="relative mb-4 h-[168px] w-[168px]"
        animate={isHovered ? { rotate: 360 } : { rotate: 0 }}
        transition={
          isHovered
            ? { repeat: Infinity, duration: 2, ease: "linear" }
            : { duration: 0.4, ease: "easeOut" as const }
        }
      >
        <Image
          src="/vintage-vinyl-record.png"
          alt="Vinyl record"
          fill
          className="object-contain"
        />
        {artworkSrc && (
          <div
            className="absolute h-[50px] w-[50px] overflow-hidden rounded-full"
            style={{
              top: "calc(50% + 1px)",
              left: "calc(50% - 1px)",
              transform: "translate(-50%, -50%)",
            }}
          >
            <Image
              src={artworkSrc}
              alt="Album artwork"
              fill
              className="object-cover"
            />
          </div>
        )}
      </motion.div>

      {/* Sound wave icon */}
      <div className="mb-1.5 flex items-center gap-[2px]">
        {[3, 5, 7, 5, 3].map((h, i) => (
          <div
            key={i}
            className="w-[2px] rounded-full bg-foreground/40"
            style={{ height: `${h}px` }}
          />
        ))}
      </div>

      {/* Song info */}
      <p className="text-sm font-medium leading-tight text-foreground">
        {songTitle}
      </p>
      <p className="mt-0.5 text-xs text-foreground/50">{artist}</p>

      {/* Progress bar */}
      <div className="mt-3 ">
        <div className="h-[2px] w-full overflow-hidden rounded-full bg-foreground/10">
          <div
            className="h-full rounded-full bg-foreground/50"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <div className="mt-1 flex justify-between text-[10px] text-foreground/40">
          <span>{currentTime}</span>
          <span className="font-medium text-foreground/60">{totalTime}</span>
        </div>
      </div>
    </motion.div>
  );
}
