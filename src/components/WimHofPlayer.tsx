"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Pause, Play as PlayIcon, X } from "lucide-react";

interface PlayerSession {
  title: string;
  text: string;
  duration: string; // ex: "3 min"
}

function parseDurationToSeconds(duration: string): number {
  const match = duration.match(/(\d+)/);
  const minutes = match ? parseInt(match[1], 10) : 3;
  return minutes * 60;
}

export default function WimHofPlayer({ session }: { session: PlayerSession }) {
  const router = useRouter();
  const totalSeconds = parseDurationToSeconds(session.duration);
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  const [isRunning, setIsRunning] = useState(true);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (!isRunning || isFinished) return;
    if (secondsLeft <= 0) {
      setIsFinished(true);
      setIsRunning(false);
      return;
    }
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft, isRunning, isFinished]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const progress = ((totalSeconds - secondsLeft) / totalSeconds) * 100;

  const handleFinish = () => {
    // TODO (prochaine mission) : brancher ici la mise à jour du streak / fil rouge
    router.push("/fil_rouge");
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-[#1f2740] to-[#3d2a5c] text-white px-6">
      <button
        onClick={() => router.back()}
        className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        title="Quitter"
      >
        <X size={22} />
      </button>

      <p className="text-sm uppercase tracking-[0.35em] text-white/60 mb-3">Wim Hof</p>
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">{session.title}</h1>
      <p className="max-w-md text-center text-white/70 mb-10">{session.text}</p>

      <div className="relative w-56 h-56 flex items-center justify-center mb-10">
        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="6" />
          <circle
            cx="50" cy="50" r="45" fill="none" stroke="#8B47FF" strokeWidth="6"
            strokeDasharray={2 * Math.PI * 45}
            strokeDashoffset={2 * Math.PI * 45 * (1 - progress / 100)}
            strokeLinecap="round"
          />
        </svg>
        <span className="text-4xl font-black tabular-nums">
          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </span>
      </div>

      {!isFinished ? (
        <button
          onClick={() => setIsRunning((r) => !r)}
          className="flex items-center gap-2 bg-white text-[#201A2B] font-bold px-8 py-3 rounded-full shadow-lg hover:scale-105 transition-transform"
        >
          {isRunning ? <><Pause size={16} /> Pause</> : <><PlayIcon size={16} /> Reprendre</>}
        </button>
      ) : (
        <button
          onClick={handleFinish}
          className="flex items-center gap-2 bg-[#8B47FF] text-white font-bold px-8 py-3 rounded-full shadow-lg hover:scale-105 transition-transform"
        >
          Terminer la séance
        </button>
      )}
    </div>
  );
}