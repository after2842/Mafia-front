import React from "react";
import { ThumbsUp, ThumbsDown, Gavel } from "lucide-react";

interface DefenseVotingCardProps {
  name: string;
  onExecute: () => void;
  onPardon: () => void;
  voted?: boolean;
}

export function DefenseVotingCard({
  name,
  onExecute,
  onPardon,
  voted = false,
}: DefenseVotingCardProps) {
  return (
    <div className="relative w-80 rounded-xl border-4 border-black bg-zinc-50 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]">
      {/* Background Graphic */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9IiNjY2MiLz48L3N2Zz4=')] opacity-30 pointer-events-none rounded-xl"></div>

      <div className="relative flex flex-col z-10 gap-6">
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-3">
          <div className="p-3 bg-red-400 border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <Gavel className="w-8 h-8 text-black" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-black tracking-tighter uppercase leading-none">
              최후 변론
            </h2>
            <p className="text-red-500 font-bold tracking-widest uppercase text-xs mt-2">
              {name}님은 유죄입니까?
            </p>
          </div>
        </div>

        {/* Instruction */}
        <div className="bg-white border-2 border-black p-4 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-black text-sm font-bold leading-snug uppercase tracking-wide text-center">
            변론을 직접 들으신 후 처형 또는 석방에 투표해 주세요.
          </p>
        </div>

        {/* Voting Buttons */}
        <div className="flex gap-4">
          <button
            onClick={onExecute}
            disabled={voted}
            className="flex-1 flex flex-col items-center justify-center gap-2 p-4 bg-red-400 border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-all group disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            <ThumbsDown className="w-8 h-8 text-black group-hover:scale-110 transition-transform" />
            <span className="font-black text-xl uppercase tracking-widest">
              처형
            </span>
          </button>

          <button
            onClick={onPardon}
            disabled={voted}
            className="flex-1 flex flex-col items-center justify-center gap-2 p-4 bg-green-400 border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-all group disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            <ThumbsUp className="w-8 h-8 text-black group-hover:scale-110 transition-transform" />
            <span className="font-black text-xl uppercase tracking-widest">
              석방
            </span>
          </button>
        </div>

        {/* Voted confirmation */}
        {voted && (
          <p className="text-center text-xs font-black uppercase tracking-widest text-zinc-500">
            ✓ 투표 완료 — 다른 플레이어를 기다리는 중...
          </p>
        )}
      </div>
    </div>
  );
}
