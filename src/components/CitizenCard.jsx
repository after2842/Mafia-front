import React from "react";
import { User, Sun } from "lucide-react";

export function CitizenCard() {
  return (
    <div className="relative w-80 h-[26rem] rounded-xl border-4 border-black bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] group transition-all duration-200 hover:-translate-y-2 hover:-translate-x-2 hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] flex flex-col cursor-pointer p-6">
      {/* Background Graphic */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9IiNjY2MiLz48L3N2Zz4=')] opacity-30 pointer-events-none"></div>

      <div className="relative flex flex-col h-full z-10">
        {/* Top Header */}
        <div className="flex justify-between items-start w-full">
          <div className="px-4 py-2 bg-amber-400 border-2 border-black rounded-full flex items-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <Sun className="w-5 h-5 text-black" />
            <span className="text-sm font-black tracking-widest text-black uppercase">
              Day Role
            </span>
          </div>
          <div className="p-2 bg-white border-2 border-black rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform group-hover:scale-110">
            <User className="w-6 h-6 text-black" />
          </div>
        </div>

        {/* Center Graphic/Icon (Replacement for Image) */}
        <div className="flex-1 flex items-center justify-center py-4">
          <div className="relative">
            <User className="w-24 h-24 text-black transition-transform duration-500 group-hover:scale-110 relative z-10" />
            <div className="absolute top-1 left-1 w-24 h-24 bg-amber-400 border-2 border-black -z-10 rounded-lg group-hover:translate-x-2 group-hover:translate-y-2 transition-transform" />
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col gap-3 bg-white border-2 border-black p-4 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div>
            <h2 className="text-3xl font-black text-black tracking-tight uppercase leading-none">
              Citizen
            </h2>
            <p className="text-amber-500 font-bold tracking-widest uppercase text-xs flex items-center gap-2 mt-1">
              <span className="w-2 h-2 rounded-none bg-amber-500 border border-black animate-pulse" />
              Town Team
            </p>
          </div>

          <div className="border-t-2 border-black pt-2">
            <p className="text-black text-xs font-bold leading-snug uppercase tracking-wide">
              You have no special abilities at night. Hope you make it through safely.
              <br />
              <br />
              During the day, find the Mafia through discussion and voting to protect the town!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
