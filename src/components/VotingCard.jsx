import { useState } from "react";
import { User, CheckCircle2 } from "lucide-react";

export function PlayerVotingCard({
  players, // [{ id, nickname, voteCounts? }]
  voteCounts = {}, // { [playerId]: number }
  onVote,
  isVoting = false,
}) {
  const [selectedId, setSelectedId] = useState(null);

  return (
    <div className="w-full max-w-lg mx-auto bg-white border-2 border-black rounded-xl p-5 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <h2 className="text-2xl font-black text-black uppercase tracking-tight mb-1">
        Vote
      </h2>
      <p className="text-zinc-500 font-medium text-sm mb-5">
        Select a player to execute by vote
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-5">
        {players.map((player) => {
          const isSelected = selectedId === player.id;
          const count = voteCounts[player.id];

          return (
            <button
              key={player.id}
              disabled={isVoting}
              onClick={() => setSelectedId(player.id)}
              className={`relative flex items-center p-3 rounded-xl border-2 text-left transition-all duration-200 font-[inherit] ${
                isSelected
                  ? "border-black bg-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] -translate-y-1 -translate-x-1"
                  : "border-black bg-white hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {/* Avatar circle */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 shrink-0 border-2 ${
                  isSelected
                    ? "border-white bg-zinc-800"
                    : "border-black bg-white"
                }`}
              >
                <User
                  className={`w-5 h-5 ${
                    isSelected ? "text-white" : "text-black"
                  }`}
                />
              </div>

              {/* Name */}
              <div className="flex-1 min-w-0 pr-6">
                <span
                  className={`block font-bold truncate ${
                    isSelected ? "text-white" : "text-black"
                  }`}
                >
                  {player.nickname}
                </span>
                {count !== undefined && count > 0 && (
                  <span
                    className={`text-xs font-semibold ${
                      isSelected ? "text-zinc-300" : "text-zinc-500"
                    }`}
                  >
                    {count} votes
                  </span>
                )}
              </div>

              {/* Check icon when selected */}
              {isSelected && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Confirm button */}
      <button
        disabled={!selectedId || isVoting}
        onClick={() => selectedId && onVote(selectedId)}
        className={`w-full py-3.5 px-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all border-2 font-[inherit] ${
          !selectedId || isVoting
            ? "bg-zinc-100 text-zinc-400 border-zinc-200 cursor-not-allowed"
            : "bg-white text-black border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:translate-x-0 active:shadow-none"
        }`}
      >
        {isVoting ? "Voting..." : selectedId ? "Cast Vote" : "Select Player"}
      </button>
    </div>
  );
}
