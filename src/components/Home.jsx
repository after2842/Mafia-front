import React, { useState } from "react";
import { ArrowRight, Plus } from "lucide-react";

export function LandingCard({
  onCreateRoom = () => {},
  onJoinRoom = () => {},
  inviteRoom = null,
}) {
  const [name, setName] = useState("");
  const [showJoin, setShowJoin] = useState(!!inviteRoom);
  const [roomCode, setRoomCode] = useState(inviteRoom ?? "");

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto gap-6 animate-in fade-in zoom-in duration-500">
      {/* Main Landing Card */}
      <div className="relative w-full bg-white border-4 border-black p-8 md:p-10 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] rounded-2xl overflow-hidden">
        {/* Background Graphic Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9IiNjY2MiLz48L3N2Zz4=')] opacity-30 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col items-center text-center">
          {/* Icon */}
          {/* <div className="p-4 bg-red-500 border-4 border-black rounded-full shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mb-6 transform -rotate-6">
            <Skull className="w-12 h-12 text-black" />
          </div> */}

          {/* Title & Subtitle */}
          <h1
            className="text-6xl sm:text-7xl font-black text-black uppercase tracking-tighter mb-4"
            style={{ WebkitTextStroke: "1px black" }}
          >
            MAFIA
          </h1>
          <p className="text-sm font-bold uppercase tracking-widest text-black bg-amber-400 border-2 border-black px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-8 transform rotate-2">
            Know the Bible, save your life.
          </p>

          {/* Name Input */}
          <div className="w-full mb-8">
            <label className="block text-left font-black text-black uppercase text-xl mb-2">
              Name
            </label>
            <input
              type="text"
              placeholder="ENTER NAME..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-zinc-50 border-4 border-black p-4 text-xl font-bold uppercase placeholder-zinc-400 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:translate-x-1 focus:translate-y-1 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            {!inviteRoom && (
              <button
                onClick={() => onCreateRoom(name)}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-400 border-4 border-black p-4 text-lg font-black uppercase shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] active:translate-y-2 active:translate-x-2 active:shadow-none transition-all"
              >
                <Plus className="w-5 h-5" />Create Room
              </button>
            )}
            <button
              onClick={() => setShowJoin(!showJoin)}
              className={`flex-1 flex items-center justify-center gap-2 border-4 border-black p-4 text-lg font-black uppercase shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] active:translate-y-2 active:translate-x-2 active:shadow-none transition-all ${
                showJoin
                  ? "bg-zinc-200 translate-y-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  : "bg-green-400"
              }`}
            >
              Join Room
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Join Room Card (Conditionally Rendered) */}
      {showJoin && (
        <div className="w-full bg-zinc-100 border-4 border-black p-6 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] rounded-2xl animate-in slide-in-from-top-4 fade-in duration-300">
          <label className="block text-left font-black text-black uppercase text-xl mb-3">
            Room Code
          </label>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="4-DIGIT"
              maxLength={4}
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              className="flex-1 bg-white border-4 border-black p-3 text-2xl tracking-widest text-center font-black uppercase shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:translate-x-1 focus:translate-y-1 focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
            />
            <button
              onClick={() => onJoinRoom(roomCode, name)}
              className="bg-amber-400 border-4 border-black px-6 font-black uppercase text-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all"
            >
              Join
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
