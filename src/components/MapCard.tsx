"use client";

import { motion } from "framer-motion";

export default function MapCard() {
  return (
    <motion.div
      className="w-[180px] overflow-hidden rounded-2xl bg-white shadow-md"
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Map placeholder */}
      <div
        className="relative h-[100px] w-full"
        style={{ backgroundColor: "#e8e0d0" }}
      >
        <div className="absolute inset-0 opacity-30">
          {/* Simple grid lines to suggest a map */}
          <div className="absolute top-[30%] left-0 h-px w-full bg-foreground/20" />
          <div className="absolute top-[60%] left-0 h-px w-full bg-foreground/20" />
          <div className="absolute top-0 left-[40%] h-full w-px bg-foreground/20" />
          <div className="absolute top-0 left-[70%] h-full w-px bg-foreground/20" />
        </div>
        {/* Pin icon */}
        <div className="absolute bottom-3 left-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#3478F6] text-white">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z" />
          </svg>
        </div>
      </div>

      {/* Location info */}
      <div className="px-4 py-3">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-green-700">
          Where
        </p>
        <p className="text-sm font-semibold text-foreground">
          Berlin, Germany
        </p>
        <p className="text-xs text-foreground/50">Mitte (tba)</p>
      </div>
    </motion.div>
  );
}
