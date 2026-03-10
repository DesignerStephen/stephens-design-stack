"use client";

import { motion } from "framer-motion";

export default function ScheduleCard() {
  return (
    <motion.div
      className="w-[180px] overflow-hidden rounded-2xl text-white shadow-md"
      style={{ backgroundColor: "#5c1a1a" }}
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Date header */}
      <div className="px-4 pt-4 pb-3">
        <p className="text-[11px] font-semibold uppercase tracking-wide opacity-80">
          Thu
        </p>
        <p className="text-2xl font-bold leading-tight">4 Jan</p>
      </div>

      {/* Schedule items */}
      <div className="flex flex-col gap-2 px-4 pb-4">
        <div className="rounded-lg bg-white/15 px-3 py-2">
          <p className="text-xs font-medium leading-snug">
            Design meeting now
          </p>
        </div>
        <div className="rounded-lg bg-white/15 px-3 py-2">
          <p className="text-xs font-medium leading-snug">
            Vibe check in 4 hours
          </p>
        </div>
      </div>
    </motion.div>
  );
}
