import React, { useState } from "react";
import { Skull, ShieldCheck, Trophy, Ghost, User } from "lucide-react";

export type PlayerResult = {
  id: string;
  name: string;
  role: string;
  team: "mafia" | "citizen" | "neutral";
  status: "alive" | "dead";
};

export type FinalResultCardProps = {
  winner?: "mafia" | "citizen";
  players?: PlayerResult[];
  onReturnToLobby?: () => void;
};

const MOCK_PLAYERS: PlayerResult[] = [
  {
    id: "1",
    name: "Alice",
    role: "Godfather",
    team: "mafia",
    status: "alive",
  },
  {
    id: "2",
    name: "Bob",
    role: "Citizen",
    team: "citizen",
    status: "dead",
  },
  {
    id: "3",
    name: "Charlie",
    role: "Detective",
    team: "citizen",
    status: "dead",
  },
  {
    id: "4",
    name: "Dave",
    role: "Mafioso",
    team: "mafia",
    status: "dead",
  },
  {
    id: "5",
    name: "Eve",
    role: "Doctor",
    team: "citizen",
    status: "alive",
  },
  {
    id: "6",
    name: "Frank",
    role: "Citizen",
    team: "citizen",
    status: "dead",
  },
  {
    id: "7",
    name: "Grace",
    role: "Journalist",
    team: "citizen",
    status: "alive",
  },
  {
    id: "8",
    name: "Heidi",
    role: "Framer",
    team: "mafia",
    status: "alive",
  },
];

export function FinalResultCard({
  winner = "mafia",
  players = MOCK_PLAYERS,
  onReturnToLobby,
}: FinalResultCardProps) {
  // Toggle for testing both states easily (if desired, though usually driven by props)
  const [currentWinner, setCurrentWinner] = useState<"mafia" | "citizen">(
    winner
  );

  const isMafia = currentWinner === "mafia";

  return (
    <div className="w-full max-w-5xl mx-auto rounded-2xl border-4 border-black bg-zinc-50 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col transition-colors duration-500 min-h-[85vh]">
      {/* Background Graphic Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9IiNjY2MiLz48L3N2Zz4=')] opacity-[0.15] pointer-events-none z-0"></div>

      {/* Header Banner */}
      <div
        className={`relative z-10 border-b-4 border-black p-8 md:p-12 text-center flex flex-col items-center justify-center gap-6 transition-colors duration-500 ${
          isMafia ? "bg-red-500" : "bg-green-400"
        }`}
      >
        <div className="p-4 bg-white border-4 border-black rounded-full shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-bounce">
          {isMafia ? (
            <Skull className="w-16 h-16 md:w-20 md:h-20 text-black" />
          ) : (
            <ShieldCheck className="w-16 h-16 md:w-20 md:h-20 text-black" />
          )}
        </div>

        <div>
          <h1
            className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]"
            style={{ WebkitTextStroke: "2px black" }}
          >
            {isMafia ? "Mafia Wins" : "Citizens Win"}
          </h1>
        </div>

        {/* Temporary toggle for testing both scenarios */}
        <button
          onClick={() => setCurrentWinner(isMafia ? "citizen" : "mafia")}
          className="absolute top-4 right-4 text-xs font-bold uppercase bg-white border-2 border-black px-3 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all cursor-pointer"
        >
          Toggle Result (Test)
        </button>
      </div>

      {/* Players List Section */}
      <div className="relative z-10 p-6 md:p-10 flex-1 flex flex-col bg-white">
        <div className="flex items-center gap-3 mb-8">
          <Trophy className="w-8 h-8 text-amber-500" />
          <h2 className="text-3xl font-black text-black uppercase tracking-tight">
            Game Summary
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {players.map((player) => (
            <div
              key={player.id}
              className={`relative flex items-center p-4 rounded-xl border-4 border-black transition-transform hover:-translate-y-1 group ${
                player.status === "dead"
                  ? "bg-zinc-200 opacity-80 grayscale shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  : "bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
              }`}
            >
              {/* Avatar Box */}
              <div
                className={`w-12 h-12 flex-shrink-0 flex items-center justify-center border-2 border-black rounded-lg ${
                  player.team === "mafia"
                    ? "bg-red-400"
                    : player.team === "citizen"
                    ? "bg-blue-400"
                    : "bg-purple-400"
                }`}
              >
                {player.status === "dead" ? (
                  <Ghost className="w-6 h-6 text-black" />
                ) : (
                  <User className="w-6 h-6 text-black" />
                )}
              </div>

              {/* Info */}
              <div className="ml-4 flex-1 min-w-0">
                <h3 className="text-xl font-black text-black uppercase truncate leading-none mb-1">
                  {player.name}
                </h3>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-bold uppercase px-2 py-0.5 border-2 border-black rounded-full ${
                      player.team === "mafia"
                        ? "bg-red-200 text-red-900"
                        : "bg-blue-200 text-blue-900"
                    }`}
                  >
                    {player.role}
                  </span>
                  {player.status === "dead" && (
                    <span className="text-[10px] font-bold uppercase text-red-600 bg-red-100 px-1.5 border border-red-300 rounded">
                      Dead
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer / Back to Lobby Button Area */}
      <div className="relative z-10 p-8 border-t-4 border-black bg-zinc-100 flex justify-center">
        <button onClick={onReturnToLobby} className="px-8 py-4 bg-amber-400 border-4 border-black text-black font-black uppercase text-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-2 active:translate-y-2 active:shadow-none transition-all">
          Return to Lobby
        </button>
      </div>
    </div>
  );
}
