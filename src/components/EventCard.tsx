"use client";

import { motion } from "framer-motion";

export default function EventCard() {
  return (
    <motion.div
      className="w-[200px] rounded-2xl bg-white px-5 py-4 shadow-md"
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <p className="text-[10px] font-semibold uppercase tracking-wide text-rose-500">
        When
      </p>
      <p className="mt-1 text-lg font-bold leading-tight text-foreground">
        Thursday, November 24
      </p>
      <p className="mt-0.5 text-sm text-foreground/50">18:30-20:30</p>
    </motion.div>
  );
}
