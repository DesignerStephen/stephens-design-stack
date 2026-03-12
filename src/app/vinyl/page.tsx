"use client";

import VinylCard from "@/components/VinylCard";

export default function VinylPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-8">
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
    </main>
  );
}
