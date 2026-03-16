"use client";

import { motion } from "framer-motion";
import { MapPin } from "@phosphor-icons/react";
import Image from "next/image";

export default function MapCard() {
  return (
    <motion.div
      className="relative w-[340px] h-[240px] overflow-hidden rounded-3xl"
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Dark satellite map background */}
      <div className="absolute inset-0">
        <Image
          src="/google-maps.png"
          alt="map of Australia with Sydney marked"
          fill
          className="object-cover"
        />
      </div>

      {/* Pulsating location dot */}
      <div className="absolute top-[calc(50%-44px)] left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div
          className="absolute top-1/2 left-1/2 h-10 w-10 rounded-full bg-[#4A8FF7]/30"
          style={{ animation: "pulse-out 2s ease-out infinite" }}
        />
        <div className="relative h-5 w-5 rounded-full border-[3px] border-white bg-[#4A8FF7] shadow-md" />
      </div>

      {/* Bottom info card */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-2xl bg-white px-5 py-4">
        <div>
          <p className="text-xs text-secondary">Current location</p>
          <p className="text-lg font-semibold text-primary">
            Sydney, Australia
          </p>
        </div>
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#4A8FF7]">
          <MapPin size={22} color="white" weight="fill" />
        </div>
      </div>
    </motion.div>
  );
}
