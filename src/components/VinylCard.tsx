"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useSpring,
} from "framer-motion";

/** Format seconds as m:ss */
function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/** Rolling digit: old number moves up and fades out, new number moves up from below and fades in (odometer/slot style) */
const rollTransition = {
  duration: 0.32,
  ease: [0.25, 0.46, 0.45, 0.94] as const,
};

function FlipDigit({
  digit,
  className = "",
}: {
  digit: string;
  className?: string;
}) {
  const isDigit = /^[0-9]$/.test(digit);

  if (!isDigit) {
    return <span className={className}>{digit}</span>;
  }

  return (
    <span
      className={`relative inline-block overflow-hidden align-middle ${className}`}
      style={{ height: "1em", width: "0.6em" }}
    >
      <AnimatePresence initial={false}>
        <motion.span
          key={digit}
          className="absolute left-0 right-0 flex items-center justify-center"
          style={{ top: 0, height: "1em" }}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={rollTransition}
        >
          {digit}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/** Renders a time string "m:ss" with flip-clock digits */
function FlipTime({
  value,
  className = "",
}: {
  value: string;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center ${className}`}>
      {value.split("").map((char, i) => (
        <FlipDigit key={i} digit={char} className={className} />
      ))}
    </span>
  );
}

interface VinylCardProps {
  songTitle?: string;
  artist?: string;
  currentTime?: string;
  totalTime?: string;
  progress?: number;
  artworkSrc?: string;
  audioSrc?: string;
  /** Start (and reset) playback at this time in seconds, e.g. 3:41 = 221 */
  startTimeSeconds?: number;
  /** Volume from 0 to 1 (default 0.5) */
  volume?: number;
}

export default function VinylCard({
  songTitle = "Lemon",
  artist = "Kenshi Yonezu",
  currentTime = "1:36",
  totalTime = "3:32",
  progress = 0.45,
  artworkSrc,
  audioSrc,
  startTimeSeconds = 25.8,
  volume = 0.4,
}: VinylCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [currentTimeSec, setCurrentTimeSec] = useState(startTimeSeconds);
  const [durationSec, setDurationSec] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  // 3D tilt — driven by mouse on hover, or gentle circular sway while playing
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const TILT_MAX = 4;
  const SWAY_AMOUNT = 0.25; // how far from center the sway goes (0–0.5)
  const SWAY_SPEED = 0.0015; // radians per ms (≈ one full circle every ~6.3s)
  const tiltX = useTransform(mouseY, (v) => (0.5 - v) * 2 * TILT_MAX);
  const tiltY = useTransform(mouseX, (v) => (v - 0.5) * 2 * TILT_MAX);
  const springTiltX = useSpring(tiltX, { stiffness: 300, damping: 30 });
  const springTiltY = useSpring(tiltY, { stiffness: 300, damping: 30 });

  useEffect(() => {
    if (!isPlaying || isHovered) return;
    let raf: number;
    const start = performance.now();
    const loop = (now: number) => {
      const angle = (now - start) * SWAY_SPEED;
      mouseX.set(0.5 + Math.cos(angle) * SWAY_AMOUNT);
      mouseY.set(0.5 + Math.sin(angle) * SWAY_AMOUNT);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [isPlaying, isHovered, mouseX, mouseY]);

  useEffect(() => {
    if (!audioSrc) return;
    const audio = new Audio(audioSrc);
    audio.loop = true;
    audio.volume = volume;
    audio.currentTime = startTimeSeconds;
    setCurrentTimeSec(startTimeSeconds);

    const onTimeUpdate = () => setCurrentTimeSec(audio.currentTime);
    const onLoadedMetadata = () => setDurationSec(audio.duration);
    const onDurationChange = () => setDurationSec(audio.duration);

    // Poll every 100ms so the flip clock catches each second boundary within ~100ms (timeupdate alone is ~250ms and irregular)
    const poll = () => {
      if (audioRef.current) setCurrentTimeSec(audioRef.current.currentTime);
    };
    const pollId = setInterval(poll, 100);

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("durationchange", onDurationChange);
    audioRef.current = audio;

    if (audio.duration && Number.isFinite(audio.duration))
      setDurationSec(audio.duration);

    return () => {
      clearInterval(pollId);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("durationchange", onDurationChange);
      audio.pause();
      audioRef.current = null;
    };
  }, [audioSrc, startTimeSeconds, volume]);

  const handleClick = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = startTimeSeconds;
      }
      setCurrentTimeSec(startTimeSeconds);
    } else {
      setIsPlaying(true);
      audioRef.current?.play();
    }
  };

  const NOTE_FLY_DURATION = 2; // seconds per note flight
  const noteConfig: { offset: [number, number]; delay: number }[] = [
    { offset: [3, -42], delay: 1.1 },
    { offset: [-12, -58], delay: 2.5 },
    { offset: [-3, -48], delay: 3.7 },
    { offset: [12, -62], delay: 6.3 },
    { offset: [-8, -38], delay: 8.5 },
    { offset: [8, -55], delay: 9.1 },
  ];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  return (
    <div style={{ perspective: 1000 }}>
      <motion.div
        ref={cardRef}
        className="relative flex w-fit cursor-pointer flex-col items-center gap-2 overflow-visible rounded-[16px] border border-[#dedede] bg-white p-4 font-sans"
        style={{ rotateX: springTiltX, rotateY: springTiltY }}
        initial={{ y: 0, boxShadow: "4px 4px 15px 0 rgb(101 63 16 / 0)" }}
        animate={
          isPlaying && isHovered
            ? {
                y: -20,
                boxShadow: "4px 4px 24px 0 rgb(101 63 16 / 0.28)",
              }
            : isPlaying
              ? {
                  y: -14,
                  boxShadow: "4px 4px 20px 0 rgb(101 63 16 / 0.22)",
                }
              : isHovered
                ? {
                    y: -6,
                    boxShadow: "4px 4px 15px 0 rgb(101 63 16 / 0.14)",
                  }
                : {
                    y: 0,
                    boxShadow: "4px 4px 15px 0 rgb(101 63 16 / 0)",
                  }
        }
        transition={{ type: "tween", duration: 0.15, ease: "easeOut" as const }}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Flying music notes — emit from vinyl center while playing */}
        <div
          className="pointer-events-none absolute left-[calc(50%-7px)] z-10 h-[176px] w-0 -translate-x-1/2"
          aria-hidden
        >
          {noteConfig.map(({ offset: [xEnd, yEnd], delay }, i) => (
            <motion.span
              key={i}
              className="absolute left-0 top-0 text-lg leading-none text-[#1e1e1e]"
              initial={{ opacity: 0, x: 0, y: 0 }}
              animate={
                isPlaying
                  ? {
                      opacity: [0, 0.7, 0],
                      scale: [1, 1, 1.2],
                      x: [0, xEnd],
                      y: [0, yEnd],
                      transition: {
                        repeat: Infinity,
                        duration: NOTE_FLY_DURATION,
                        delay,
                        ease: "easeOut",
                      },
                    }
                  : { opacity: 0, x: xEnd, y: yEnd }
              }
              transition={
                isPlaying ? { duration: 0.3 } : { duration: 1, ease: "easeOut" }
              }
            >
              {["♪", "♩", "♬", "♫"][i % 4]}
            </motion.span>
          ))}
        </div>

        {/* Vinyl Record — 160×160 per Figma */}
        <motion.div
          className="relative h-[185px] w-[185px] shrink-0"
          animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
          transition={
            isPlaying
              ? { repeat: Infinity, duration: 4, ease: "linear" }
              : { duration: 0.4, ease: "easeOut" as const }
          }
        >
          <Image
            src="/vintage-vinyl-record.png"
            alt="Vinyl record"
            fill
            className="object-cover"
          />
          {artworkSrc && (
            <div className="absolute left-1/2 top-1/2 h-[58px] w-[58px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full">
              <Image
                src={artworkSrc}
                alt="Album artwork"
                fill
                className="object-cover"
              />
            </div>
          )}
        </motion.div>

        {/* Waveform bars — 5 bars: 3, 5, 7, 5, 3px height, 2px width, #cdcdcd */}
        <div className="flex h-[10px] shrink-0 items-center gap-[2px] leading-none">
          {([3, 5, 7, 5, 3] as const).map((h, i) => {
            const staggerOrder = [0, 3, 1, 2, 4];
            const delay = staggerOrder[i] * 0.08;
            return (
              <motion.div
                key={i}
                className="w-[2px] shrink-0 rounded-[48px]"
                style={{ height: h }}
                animate={
                  isPlaying
                    ? {
                        height: [h, 10, 4, 8, h],
                        backgroundColor: "#757575",
                        transition: {
                          height: {
                            repeat: Infinity,
                            duration: 0.9,
                            delay,
                            ease: "easeInOut",
                          },
                          backgroundColor: { duration: 0.2 },
                        },
                      }
                    : { height: h, backgroundColor: "#cdcdcd" }
                }
                initial={{ backgroundColor: "#cdcdcd" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            );
          })}
        </div>

        {/* Song info + progress — gap-3 (12px) between text block and bar per Figma */}
        <div className="flex w-full shrink-0 flex-col items-center gap-3">
          <div className="flex w-full flex-col items-center gap-0.5 text-center">
            <p
              className="w-full text-[14px] font-medium leading-[20px] text-[#1e1e1e]"
              style={{ fontVariationSettings: "'opsz' 14" }}
            >
              {songTitle}
            </p>
            <p
              className="w-full text-[12px] font-normal leading-[16px] text-[#757575]"
              style={{ fontVariationSettings: "'opsz' 14" }}
            >
              {artist}
            </p>
          </div>

          {/* Progress bar — 9px height container, track + fill + thumb per Figma */}
          {(() => {
            const total =
              durationSec ??
              (() => {
                const [m, s] = totalTime.split(":").map(Number);
                return (m ?? 0) * 60 + (s ?? 0);
              })();
            const prog = total > 0 ? currentTimeSec / total : progress;
            return (
              <div className="relative h-[9px] w-[140px] shrink-0">
                <div className="absolute left-0 top-1/2 h-[2px] w-full -translate-y-1/2 rounded-full bg-[#CDCDCD]" />
                <div
                  className="absolute left-0 top-1/2 h-[2px] -translate-y-1/2 rounded-full bg-[#5A5A5A]"
                  style={{ width: `${prog * 100}%` }}
                />
                <div
                  className="absolute left-0 top-1/2 h-[6px] w-[6px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#5A5A5A]"
                  style={{ left: `${prog * 100}%` }}
                />
              </div>
            );
          })()}

          {/* Timestamps — flip-clock digits tick once per actual second */}
          <div className="flex items-center justify-center gap-[6px] whitespace-nowrap text-center text-[12px] font-normal leading-[16px] tabular-nums">
            <span className="text-[#1e1e1e]">
              <FlipTime
                value={formatTime(Math.floor(currentTimeSec))}
                className="text-[12px] font-normal text-[#1e1e1e]"
              />
            </span>
            <span className="text-[#1e1e1e]">/</span>
            <span className="text-[#757575]">
              <FlipTime
                value={formatTime(
                  durationSec ??
                    (() => {
                      const [m, s] = totalTime.split(":").map(Number);
                      return (m ?? 0) * 60 + (s ?? 0);
                    })(),
                )}
                className="text-[12px] font-normal text-[#757575]"
              />
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
