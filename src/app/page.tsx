"use client";

import VinylCard from "@/components/VinylCard";
import ScheduleCard from "@/components/ScheduleCard";
import MapCard from "@/components/MapCard";
import FolderStack from "@/components/FolderStack";
import EventCard from "@/components/EventCard";
import Spline from "@splinetool/react-spline";
import { motion } from "framer-motion";
import Image from "next/image";

const fade = (delay: number) => ({
  initial: { opacity: 0, scale: 0.92 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5, delay, ease: "easeOut" as const },
});

const slideIn = (x: number, y: number, delay: number) => ({
  initial: { opacity: 0, x, y },
  animate: { opacity: 1, x: 0, y: 0 },
  transition: { duration: 0.6, delay, ease: "easeOut" as const },
});

const popIn = (delay: number) => ({
  initial: { opacity: 0, scale: 0 },
  animate: { opacity: 1, scale: 1 },
  transition: { type: "spring" as const, stiffness: 400, damping: 15, delay },
});

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden px-8">
      {/* Centered Spline object */}
      <motion.div
        className="absolute top-[20%] left-[25%] -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px]"
        {...slideIn(-60, -40, 0.18)}
      >
        <Spline scene="https://prod.spline.design/lw590hsPyqDRUdNY/scene.splinecode" />
      </motion.div>

      {/* Centered title */}
      <motion.h1
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap font-serif text-5xl tracking-tight"
        style={{ color: "var(--title-accent)" }}
        {...fade(0)}
      >
        Stephen&rsquo;s <em>Design</em> Stack
      </motion.h1>

      {/* ---- Top-left cluster ---- */}
      <motion.div
        className="absolute top-[6%] left-[3%] -rotate-6"
        {...slideIn(-60, -40, 0.15)}
      >
        <VinylCard
          songTitle="Nagashi"
          artist="Idealism"
          currentTime="2:14"
          totalTime="4:08"
          progress={0.54}
          artworkSrc="/idealism.png"
          audioSrc="/Idealism-nagashi.mp3"
        />
      </motion.div>

      {/* ---- Left side ---- */}
      <motion.div
        className="absolute top-[38%] left-[2%] -rotate-3"
        {...slideIn(-60, 0, 0.25)}
      >
        <MapCard />
      </motion.div>

      {/* ---- Status badge ---- */}
      <motion.div className="absolute top-[32%] left-[28%]" {...fade(0.5)}>
        <div className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 shadow-sm">
          <span className="h-2 w-2 rounded-full bg-green-500" />
          <span className="text-xs font-medium text-foreground">
            currently designing
          </span>
        </div>
      </motion.div>

      {/* ---- Matcha drink ---- */}
      <motion.div
        className="absolute top-[2%] right-[20%] rotate-3"
        {...slideIn(0, -40, 0.18)}
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9, rotate: 10, transition: { type: "tween", duration: 0.15 } }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <div className="w-[160px] h-[280px] overflow-hidden">
          <Image
            src="/iced-matcha.png"
            alt="Iced matcha"
            width={260}
            height={340}
            className="drop-shadow-sm object-cover h-full w-auto mx-auto"
          />
        </div>
      </motion.div>

      {/* ---- Top-right cluster ---- */}
      <motion.div
        className="absolute top-[3%] right-[5%] rotate-3"
        {...slideIn(60, -40, 0.2)}
      >
        <ScheduleCard />
      </motion.div>

      {/* ---- Right side ---- */}
      <motion.div
        className="absolute top-[35%] right-[4%] rotate-2"
        {...slideIn(60, 0, 0.3)}
      >
        <VinylCard
          songTitle="Let Down"
          artist="Radiohead"
          currentTime="3:41"
          totalTime="4:59"
          progress={221 / 299}
          artworkSrc="/radiohead-letdown.png"
          audioSrc="/Let Down (Remastered).mp3"
          startTimeSeconds={221.2}
          volume={0.22}
        />
      </motion.div>

      {/* ---- Bottom-left: Folder stack ---- */}
      <motion.div
        className="absolute bottom-[4%] left-[4%] rotate-2"
        {...slideIn(-60, 40, 0.35)}
      >
        <FolderStack />
      </motion.div>

      {/* ---- Bottom-right: Event card ---- */}
      <motion.div
        className="absolute bottom-[8%] right-[8%] rotate-2"
        {...slideIn(60, 40, 0.4)}
      >
        <EventCard />
      </motion.div>

      {/* ---- Decorative squares scattered around ---- */}
      {[
        "absolute top-[18%] right-[22%] rotate-12",
        "absolute top-[55%] right-[30%] -rotate-6",
        "absolute top-[28%] left-[50%] rotate-45",
        "absolute bottom-[20%] left-[35%] rotate-12",
        "absolute top-[12%] left-[42%] -rotate-12",
      ].map((cls, i) => (
        <motion.div
          key={i}
          className={`h-6 w-6 rounded-md ${cls}`}
          style={{ backgroundColor: "#c4d430" }}
          {...popIn(0.55 + i * 0.07)}
        />
      ))}
    </main>
  );
}
