import { useState } from "react";
import { Skull, X } from "lucide-react";
import { PlayerTargetCard } from "./PlayerTargetCard";

/**
 * MafiaKillBoardModal
 *
 * Props (same interface as before — NightChat.tsx doesn't need to change):
 *   players        [{ id, nickname }]  — alive players to target
 *   selectedId     string | null       — last confirmed kill sent to server
 *   sharedTargetName string | null     — nickname of team's current target
 *   onSelect       (targetId) => void  — called when user confirms kill
 *   onClose        () => void          — called to close the modal
 */
export function MafiaKillBoardModal({
  players,
  selectedId,
  sharedTargetName,
  onSelect,
  onClose,
}) {
  // Local selection before confirming
  const [localId, setLocalId] = useState(selectedId ?? null);

  const localPlayer = players.find((p) => p.id === localId);

  const handleConfirm = () => {
    if (!localId) return;
    onSelect(localId);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[1000] bg-zinc-50/95 flex flex-col items-center overflow-y-auto py-10 px-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md flex flex-col gap-6"
      >
        {/* Header card */}
        <div className="bg-white border-2 border-black rounded-xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center relative">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-lg border-2 border-black bg-white hover:bg-black hover:text-white transition-colors cursor-pointer font-[inherit]"
          >
            <X size={15} />
          </button>

          <div className="flex items-center justify-center gap-3 mb-2">
            <Skull className="w-8 h-8" />
            <h1 className="text-3xl font-black tracking-tighter uppercase">
              Kill Board
            </h1>
          </div>
          <div className="h-1 w-16 bg-black mx-auto mb-3" />
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-600">
            Choose a player to eliminate tonight
          </p>

          {/* Shared team target badge */}
          {sharedTargetName && (
            <div className="mt-3 inline-flex items-center gap-2 border-2 border-black rounded-xl px-3 py-1.5 bg-zinc-100">
              <span className="text-xs font-black uppercase tracking-widest">
                Team Pick:
              </span>
              <span className="text-sm font-black">🎯 {sharedTargetName}</span>
            </div>
          )}
        </div>

        {/* Player grid */}
        <div className="bg-white border-2 border-black rounded-xl p-5 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex flex-wrap gap-3 justify-center">
            {players.map((p) => (
              <PlayerTargetCard
                key={p.id}
                username={p.nickname}
                isSelected={localId === p.id}
                isTeamTarget={sharedTargetName === p.nickname && localId !== p.id}
                onSelect={() => setLocalId(p.id)}
              />
            ))}
          </div>
        </div>

        {/* Confirm button — slides in when a player is selected */}
        <div
          className={`flex flex-col items-center gap-3 transition-all duration-300 ${
            localId
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4 pointer-events-none"
          }`}
        >
          <button
            onClick={handleConfirm}
            className="w-full py-4 px-6 bg-white border-2 border-black text-black font-black uppercase tracking-widest rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:bg-black hover:text-white transition-all flex items-center justify-center gap-3 text-base group active:translate-y-0 active:translate-x-0 active:shadow-none font-[inherit] cursor-pointer"
          >
            <Skull className="w-5 h-5 transition-transform group-hover:scale-125" />
            {localPlayer ? `Eliminate ${localPlayer.nickname}` : "Eliminate"}
          </button>
          <span className="text-black bg-white border-2 border-black px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            Last selection will be executed when the timer runs out
          </span>
        </div>
      </div>
    </div>
  );
}
