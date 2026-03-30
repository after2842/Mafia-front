import React, { useState, useEffect } from "react";
import {
  Copy,
  Check,
  Users,
  ShieldAlert,
  Newspaper,
  Plus,
  Minus,
  Play,
  User,
} from "lucide-react";

export default function Lobby({ gameState, isHost, playerId, ws, roomId }) {
  const [copied, setCopied] = useState(false);
  const inviteLink = `${window.location.origin}/?room=${roomId}`;

  const [roles, setRoles] = useState({
    mafia: gameState?.role_config?.mafia ?? 1,
    citizen: gameState?.role_config?.citizen ?? 2,
    journalist: gameState?.role_config?.journalist ?? 1,
  });

  // Sync role config from server (for non-host players)
  useEffect(() => {
    if (gameState?.role_config) {
      setRoles({
        mafia: gameState.role_config.mafia ?? 1,
        citizen: gameState.role_config.citizen ?? 2,
        journalist: gameState.role_config.journalist ?? 1,
      });
    }
  }, [gameState?.role_config]);

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const updateRole = (role, delta) => {
    if (!isHost) return;
    const newRoles = { ...roles, [role]: Math.max(0, roles[role] + delta) };
    setRoles(newRoles);
    ws.send({ type: "update_role_config", role_config: newRoles });
  };

  const players = gameState?.players || [];
  const expectedTotal = roles.mafia + roles.citizen + roles.journalist;
  const emptySlots = Math.max(0, expectedTotal - players.length);
  const diff = expectedTotal - players.length;
  const canStart = diff === 0 && expectedTotal > 0;

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white border-2 border-black rounded-xl flex flex-col h-[90vh] min-h-[550px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
        {/* Header */}
        <div className="flex-none p-5 border-b-2 border-black bg-yellow-400 flex flex-col sm:flex-row items-center justify-between z-20 gap-4">
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 bg-black text-white text-xs font-black uppercase tracking-widest rounded-md border-2 border-black">
              Lobby
            </div>
            <h1 className="text-3xl font-black tracking-tighter uppercase drop-shadow-[2px_2px_0_rgba(0,0,0,1)] text-white">
              #{roomId}
            </h1>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="flex-1 sm:w-64 flex items-center bg-white border-2 border-black rounded-lg overflow-hidden h-10 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <input
                type="text"
                value={inviteLink}
                readOnly
                className="w-full px-3 py-2 text-sm font-bold text-zinc-500 outline-none truncate bg-transparent"
              />
              <button
                onClick={handleCopy}
                className="h-full px-4 border-l-2 border-black bg-zinc-100 hover:bg-zinc-200 transition-colors flex items-center justify-center shrink-0"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4 text-black" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col p-6 bg-zinc-50 overflow-y-auto">
          {/* Role Settings */}
          <div className="mb-8">
            <h2 className="text-xl font-black uppercase tracking-widest mb-4 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5" />
              Role Setup
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Mafia */}
              <div className="flex flex-col justify-between p-4 bg-red-100 border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-500 border-2 border-black rounded-lg flex items-center justify-center shrink-0">
                    <ShieldAlert className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-black uppercase tracking-wider text-red-900">
                    Mafia
                  </span>
                </div>
                <div className="flex items-center justify-between w-full mt-auto bg-white/50 p-1.5 rounded-lg border-2 border-black">
                  <button
                    onClick={() => updateRole("mafia", -1)}
                    disabled={!isHost}
                    className="w-8 h-8 flex items-center justify-center bg-white border-2 border-black rounded-md active:translate-y-[2px] active:shadow-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-black text-xl">
                    {roles.mafia}
                  </span>
                  <button
                    onClick={() => updateRole("mafia", 1)}
                    disabled={!isHost}
                    className="w-8 h-8 flex items-center justify-center bg-white border-2 border-black rounded-md active:translate-y-[2px] active:shadow-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Citizen */}
              <div className="flex flex-col justify-between p-4 bg-blue-100 border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500 border-2 border-black rounded-lg flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-black uppercase tracking-wider text-blue-900">
                    Citizen
                  </span>
                </div>
                <div className="flex items-center justify-between w-full mt-auto bg-white/50 p-1.5 rounded-lg border-2 border-black">
                  <button
                    onClick={() => updateRole("citizen", -1)}
                    disabled={!isHost}
                    className="w-8 h-8 flex items-center justify-center bg-white border-2 border-black rounded-md active:translate-y-[2px] active:shadow-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-black text-xl">
                    {roles.citizen}
                  </span>
                  <button
                    onClick={() => updateRole("citizen", 1)}
                    disabled={!isHost}
                    className="w-8 h-8 flex items-center justify-center bg-white border-2 border-black rounded-md active:translate-y-[2px] active:shadow-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Journalist */}
              <div className="flex flex-col justify-between p-4 bg-green-100 border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500 border-2 border-black rounded-lg flex items-center justify-center shrink-0">
                    <Newspaper className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-black uppercase tracking-wider text-green-900">
                    Journalist
                  </span>
                </div>
                <div className="flex items-center justify-between w-full mt-auto bg-white/50 p-1.5 rounded-lg border-2 border-black">
                  <button
                    onClick={() => updateRole("journalist", -1)}
                    disabled={!isHost}
                    className="w-8 h-8 flex items-center justify-center bg-white border-2 border-black rounded-md active:translate-y-[2px] active:shadow-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-black text-xl">
                    {roles.journalist}
                  </span>
                  <button
                    onClick={() => updateRole("journalist", 1)}
                    disabled={!isHost}
                    className="w-8 h-8 flex items-center justify-center bg-white border-2 border-black rounded-md active:translate-y-[2px] active:shadow-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Players */}
          <div className="mt-auto border-t-2 border-black pt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-black uppercase tracking-widest flex items-center gap-2">
                <Users className="w-5 h-5" />
                Players
              </h2>
              <div className="px-4 py-2 bg-white border-2 border-black rounded-xl shadow-[2px_2px_0_0_rgba(0,0,0,1)] flex items-center gap-2">
                <span className="text-2xl font-black leading-none">
                  {players.length} 명
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {players.map((player) => (
                <div
                  key={player.id}
                  className="flex items-center gap-2 px-3 py-2 bg-white border-2 border-black rounded-xl shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform"
                >
                  {/* <div className="w-8 h-8 rounded-full border-2 border-black bg-indigo-100 flex items-center justify-center overflow-hidden shrink-0">
                    <img
                      src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${player.nickname}`}
                      alt={player.nickname}
                      className="w-full h-full object-cover"
                    />
                  </div> */}
                  <span className="font-black uppercase text-sm tracking-wider">
                    {player.nickname}
                  </span>
                  {player.id === playerId && isHost && (
                    <span className="ml-1 px-1.5 py-0.5 text-[10px] bg-yellow-300 border-2 border-black rounded-md font-black uppercase tracking-widest shadow-[1px_1px_0_0_rgba(0,0,0,1)]">
                      Host
                    </span>
                  )}
                </div>
              ))}

              {Array.from({ length: emptySlots }).map((_, idx) => (
                <div
                  key={`empty-${idx}`}
                  className="flex items-center gap-2 px-3 py-2 border-2 border-dashed border-zinc-300 rounded-xl bg-zinc-50/50 opacity-60"
                >
                  <div className="w-8 h-8 rounded-full border-2 border-dashed border-zinc-300 bg-zinc-100 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-zinc-400" />
                  </div>
                  <span className="font-black uppercase text-sm tracking-wider text-zinc-400">
                    Waiting...
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer / Start Button */}
        <div className="flex-none p-5 border-t-2 border-black bg-white z-20">
          {isHost ? (
            <div className="flex flex-col gap-2">
              {!canStart && (
                <p className="text-center text-xs font-black uppercase tracking-widest text-zinc-500">
                  {diff > 0
                    ? `Need ${diff} more (${expectedTotal} total)`
                    : `${Math.abs(diff)} too many (${expectedTotal} total)`}
                </p>
              )}
              <button
                onClick={() => ws.send({ type: "start_game" })}
                disabled={!canStart}
                className="w-full py-4 bg-indigo-500 hover:bg-indigo-400 disabled:bg-zinc-200 disabled:text-zinc-400 disabled:border-zinc-300 disabled:shadow-none disabled:cursor-not-allowed text-white border-2 border-black rounded-xl font-black text-xl uppercase tracking-widest shadow-[4px_4px_0_0_rgba(0,0,0,1)] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-all flex items-center justify-center gap-3"
              >
                <Play className="w-6 h-6 fill-current" />
                Start Game
              </button>
            </div>
          ) : (
            <div className="w-full py-4 border-2 border-dashed border-zinc-300 rounded-xl text-center font-black text-sm uppercase tracking-widest text-zinc-400">
              Waiting for host to start...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
