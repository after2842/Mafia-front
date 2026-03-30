import React from "react";
import { User, ShieldAlert, Clock } from "lucide-react";

interface HeaderProps {
  nickname: string;
  role: string;
  timeLeft: number;
  survivors: string[];
  onRoleClick?: () => void;
}

export function Header({ nickname, role, timeLeft, survivors, onRoleClick }: HeaderProps) {
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex-none p-4 border-b-2 border-black bg-white flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between z-20">
      {/* User Info & Timer */}
      <div className="flex items-center gap-4 whitespace-nowrap overflow-x-auto pb-2 sm:pb-0 hide-scrollbar shrink-0">
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 border-2 border-black rounded-lg shrink-0">
          <User className="w-4 h-4 text-black" />
          <span className="text-xs font-black uppercase tracking-widest text-black">
            {nickname}
          </span>
        </div>

        <button
          onClick={onRoleClick}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-100 border-2 border-black rounded-lg shrink-0 cursor-pointer font-[inherit] select-none"
        >
          <ShieldAlert className="w-4 h-4 text-red-600" />
          <span className="text-xs font-black uppercase tracking-widest text-red-700">
            {role}
          </span>
        </button>

        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 border-2 border-black rounded-lg shrink-0 transition-colors ${
            timeLeft < 30
              ? "bg-red-500 text-white animate-pulse"
              : "bg-black text-white"
          }`}
        >
          <Clock className="w-4 h-4" />
          <span className="text-xs font-black uppercase tracking-widest">
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      {/* Survivors Strip */}
      <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar sm:pl-4 sm:border-l-2 sm:border-black min-w-0">
        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 shrink-0">
          Survivors ({survivors.length}):
        </span>
        <div className="flex items-center gap-2 pr-2">
          {survivors.map((survivor, idx) => (
            <div
              key={idx}
              className="flex items-center gap-1 px-2 py-1 bg-white border-2 border-black rounded-md shrink-0"
            >
              <div className="w-2 h-2 rounded-full bg-green-500 border border-black"></div>
              <span className="text-[10px] font-black uppercase tracking-wider text-black">
                {survivor}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
