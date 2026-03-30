import { Crosshair } from "lucide-react";

export function PlayerTargetCard({ username, isSelected, isTeamTarget, onSelect }) {
  return (
    <button
      onClick={onSelect}
      className={`relative w-[140px] h-[80px] rounded-xl border-2 border-black font-[inherit]
        flex flex-col items-center justify-center gap-1 cursor-pointer transition-all duration-200
        ${
          isSelected
            ? "bg-black text-white -translate-y-1 -translate-x-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.4)]"
            : isTeamTarget
            ? "bg-zinc-700 text-white border-zinc-500"
            : "bg-white text-black hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
        }`}
    >
      <span className="font-black text-sm uppercase tracking-tight px-2 text-center leading-tight">
        {username}
      </span>
      {isSelected && (
        <span className="flex items-center gap-1 text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
          <Crosshair size={10} /> My Pick
        </span>
      )}
      {isTeamTarget && !isSelected && (
        <span className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
          Team Pick
        </span>
      )}
    </button>
  );
}
