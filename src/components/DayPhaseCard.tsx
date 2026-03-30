import React from "react";
import { MessageCircle, Sun } from "lucide-react";

export function DayPhaseCard({ round = 1 }: { round?: number }) {
  return (
    <div className="relative w-80 h-[24rem] rounded-xl border-4 border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] group transition-all duration-200 hover:-translate-y-2 hover:-translate-x-2 hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] flex flex-col cursor-pointer p-6">
      {/* Background Graphic */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9IiNjY2MiLz48L3N2Zz4=')] opacity-30 pointer-events-none"></div>

      <div className="relative flex flex-col h-full z-10">
        {/* Top Header */}
        <div className="flex justify-between items-start w-full">
          <div className="px-4 py-2 bg-yellow-400 border-2 border-black rounded-full flex items-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <Sun className="w-5 h-5 text-black" />
            <span className="text-sm font-black tracking-widest text-black uppercase">
              Day {round}
            </span>
          </div>
          <div className="p-2 bg-white border-2 border-black rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform group-hover:scale-110">
            <MessageCircle className="w-6 h-6 text-black" />
          </div>
        </div>

        {/* Center Graphic/Icon (Replacement for Image) */}
        <div className="flex-1 flex items-center justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-yellow-400 blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <Sun className="w-32 h-32 text-black transition-transform duration-700 group-hover:rotate-45 relative z-10" />
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col gap-4 bg-white border-2 border-black p-4 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-2xl font-black text-black tracking-tight uppercase leading-none">
            A new day has dawned
          </h2>

          <div className="flex items-center gap-3 border-t-2 border-black pt-3">
            <span className="w-3 h-3 rounded-full bg-red-500 border-2 border-black animate-pulse flex-shrink-0" />
            <p className="text-black font-bold tracking-widest uppercase text-sm">
              Discuss freely.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
