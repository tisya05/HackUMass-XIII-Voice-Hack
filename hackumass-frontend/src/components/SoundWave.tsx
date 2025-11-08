import { useState } from "react";

interface SoundWaveProps {
  isActive: boolean;
}

export default function SoundWave({ isActive }: SoundWaveProps) {
  const [bars] = useState(Array.from({ length: 40 }, (_, i) => i));

  return (
    <div className="w-full max-w-3xl h-32 flex items-end justify-center gap-[4px] bg-transparent">
      {bars.map((bar) => (
        <div
          key={bar}
          className={`w-[4px] rounded-full bg-blue-500 ${
            isActive ? "animate-wave" : "h-6"
          }`}
          style={{ animationDelay: `${bar * 0.05}s` }}
        />
      ))}

      <style>{`
        @keyframes wave {
          0%, 100% { height: 12px; }
          50% { height: 100px; }
        }

        .animate-wave {
          animation: wave 1s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
