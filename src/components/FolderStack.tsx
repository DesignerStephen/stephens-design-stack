"use client";

import { motion } from "framer-motion";

export default function FolderStack() {
  const folders = [
    { rotate: -8, x: -10, y: 10 },
    { rotate: -3, x: 0, y: 5 },
    { rotate: 4, x: 8, y: 0 },
  ];

  return (
    <motion.div
      className="relative h-[160px] w-[220px]"
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {folders.map((f, i) => (
        <div
          key={i}
          className="absolute bottom-0 left-0 h-[120px] w-[170px] rounded-xl shadow-sm"
          style={{
            backgroundColor: "#4a9e8e",
            transform: `rotate(${f.rotate}deg) translate(${f.x}px, ${f.y}px)`,
            zIndex: i,
          }}
        >
          {/* Folder tab */}
          <div
            className="absolute -top-3 left-3 h-5 w-14 rounded-t-lg"
            style={{ backgroundColor: "#4a9e8e" }}
          />
        </div>
      ))}
    </motion.div>
  );
}
