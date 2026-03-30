import { useState, useEffect } from "react";
import { Header } from "./GameHeader";
import NightPhase from "./NightPhase";
import VotePhase from "./VotePhase";
import GameOver from "./GameOver";
import { MafiaCard } from "./MafiaCard";
import { CitizenCard } from "./CitizenCard";
import { JournalistCard } from "./JournalistCard";
import { DayPhaseCard } from "./DayPhaseCard";
import { EventCard } from "./EventCards";
import Chat from "./Chat";

function parseMorningReport(line) {
  if (line.includes("💀")) return "death";
  if (line.includes("🛡️")) return "saved";
  return "nothing";
}

const ROLE_EN = { mafia: "Mafia", journalist: "Journalist", citizen: "Citizen" };

const BADGE_CLASSES = {
  mafia:
    "inline-block px-3 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-500",
  journalist:
    "inline-block px-3 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700",
  citizen:
    "inline-block px-3 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-500",
};

function badgeClass(role) {
  return (
    BADGE_CLASSES[role] ??
    "inline-block px-3 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-500"
  );
}

function ResultCountdown({ message }) {
  const [secs, setSecs] = useState(5);
  useEffect(() => {
    if (secs <= 0) return;
    const t = setTimeout(() => setSecs((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secs]);

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-6">
      <div className="bg-white border-4 border-black rounded-2xl p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] max-w-sm w-full text-center">
        <p className="text-xl font-black uppercase tracking-tight text-black mb-6">
          {message}
        </p>
        <div className="text-7xl font-black text-black">{secs}</div>
        <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mt-4">
          Night is falling...
        </p>
      </div>
    </div>
  );
}

export default function Game({
  gameState,
  playerId,
  ws,
  chatMessages,
  kicked,
  revealedRoles,
  nickname,
  isHost,
  nightAnswers,
  showRoleIntro,
  dismissRoleIntro,
  voteResultMsg,
}) {
  const [roleVisible, setRoleVisible] = useState(false);
  const [timeSeconds, setTimeSeconds] = useState(0);
  const [activeTab, setActiveTab] = useState("day");

  useEffect(() => {
    if (gameState?.time_left != null) setTimeSeconds(gameState.time_left);
  }, [gameState?.time_left]);

  useEffect(() => {
    if (timeSeconds <= 0) return;
    const t = setTimeout(() => setTimeSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearTimeout(t);
  }, [timeSeconds]);

  useEffect(() => {
    if (gameState?.phase === "vote") setActiveTab("vote");
    if (gameState?.phase === "day") setActiveTab("day");
  }, [gameState?.phase]);

  if (!gameState)
    return (
      <div className="max-w-[520px] mx-auto px-4 pt-[60px] text-center">
        Loading...
      </div>
    );

  const myPlayer = gameState.players?.find((p) => p.id === playerId);
  const myRole = gameState.my_role || myPlayer?.role;
  const phase = gameState.phase;
  const showIntroOverlay = showRoleIntro && !!myRole;

  if (gameState.winner) {
    return (
      <GameOver
        gameState={gameState}
        myRole={myRole}
        revealedRoles={revealedRoles}
      />
    );
  }

  if (kicked) {
    return (
      <div className="max-w-[520px] mx-auto px-4 pt-[60px] text-center">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <h2 className="mb-2 text-lg font-bold">You have been eliminated</h2>
          <p className="text-gray-500 mb-4">
            Your role was:{" "}
            <span className={badgeClass(myRole)}>
              {ROLE_EN[myRole] || myRole}
            </span>
          </p>
          <div className="mt-4">
            <h3 className="mb-2 text-sm font-semibold">Revealed roles:</h3>
            {revealedRoles.map((r, i) => (
              <div key={i} className="py-1 text-[13px]">
                {r.nickname}:{" "}
                <span className={badgeClass(r.role)}>
                  {ROLE_EN[r.role] || r.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const isVotePhase =
    phase === "vote" || phase === "last_defense" || phase === "final_vote";

  return (
    <div className="min-h-screen">
      {showIntroOverlay && myRole && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-[2000] p-4">
          <div className="flex flex-col items-center gap-4">
            {myRole === "mafia" && <MafiaCard />}
            {myRole === "citizen" && <CitizenCard />}
            {myRole === "journalist" && <JournalistCard />}
            <button
              className="w-full max-w-[320px] inline-flex items-center justify-center px-4 py-3 rounded-lg text-sm font-semibold transition-all min-h-[48px] bg-black text-black hover:bg-[#3a56d4]"
              onClick={dismissRoleIntro}
            >
              OK
            </button>
          </div>
        </div>
      )}

      <Header
        nickname={nickname}
        role={roleVisible ? ROLE_EN[myRole] || myRole : "●●●"}
        timeLeft={timeSeconds}
        survivors={gameState.alive_players?.map((p) => p.nickname) || []}
        onRoleClick={() => setRoleVisible((v) => !v)}
      />

      {/* Main content based on phase */}
      {phase === "night" ? (
        <NightPhase
          gameState={gameState}
          myRole={myRole}
          playerId={playerId}
          ws={ws}
          nightAnswers={nightAnswers}
          chatMessages={chatMessages}
        />
      ) : (
        /* Day / Vote / Last Defense / Final Vote — tabbed */
        <div className="flex flex-col min-h-screen">
          {/* Tab bar */}
          <div className="flex border-b-2 border-black bg-white sticky top-0 z-10">
            <button
              onClick={() => setActiveTab("day")}
              className={`flex-1 py-3 font-black text-sm uppercase tracking-widest border-r-2 border-black transition-colors font-[inherit] ${
                activeTab === "day"
                  ? "bg-yellow-400 text-black"
                  : "bg-white text-zinc-500 hover:bg-zinc-50"
              }`}
            >
              Info
            </button>
            <button
              onClick={() => setActiveTab("chat")}
              className={`flex-1 py-3 font-black text-sm uppercase tracking-widest border-r-2 border-black transition-colors font-[inherit] ${
                activeTab === "chat"
                  ? "bg-yellow-400 text-black"
                  : "bg-white text-zinc-500 hover:bg-zinc-50"
              }`}
            >
              Chat
            </button>
            <button
              onClick={() => setActiveTab("vote")}
              className={`flex-1 py-3 font-black text-sm uppercase tracking-widest transition-colors font-[inherit] ${
                activeTab === "vote"
                  ? "bg-yellow-400 text-black"
                  : "bg-white text-zinc-500 hover:bg-zinc-50"
              }`}
            >
              Vote
              {isVotePhase && (
                <span className="ml-1.5 inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse align-middle" />
              )}
            </button>
          </div>

          {/* Tab content */}
          {activeTab === "day" ? (
            <div className="p-4 flex flex-col gap-3 items-center mt-4">
              <DayPhaseCard round={gameState.round || 1} />

              {gameState.morning_report?.map((line, i) => (
                <EventCard
                  key={i}
                  variant={parseMorningReport(line)}
                  text={line.replace(/^[💀🛡️]\s*/, "")}
                />
              ))}

              {myRole === "journalist" && gameState.journalist_result && (
                <EventCard
                  variant="investigate"
                  text={gameState.journalist_result}
                />
              )}

              {gameState.can_extend && (
                <button
                  className="mt-1 w-full inline-flex items-center justify-center px-5 py-3 rounded-lg text-sm font-semibold transition-all min-h-[48px] bg-transparent border border-gray-300 text-[#1a1a2e] hover:border-[#4361ee] hover:text-[#4361ee]"
                  onClick={() => ws.send({ type: "extend_timer" })}
                >
                  Extend discussion (+2 min)
                </button>
              )}
              {isHost && !gameState.can_extend && (
                <button
                  className="mt-1 w-full inline-flex items-center justify-center px-5 py-3 rounded-lg text-sm font-semibold transition-all min-h-[48px] bg-transparent border border-red-500 text-red-500 hover:bg-red-50"
                  onClick={() => ws.send({ type: "skip_day" })}
                >
                  Skip to vote &rarr;
                </button>
              )}
            </div>
          ) : activeTab === "chat" ? (
            <div className="p-4 flex flex-col" style={{ height: "calc(100vh - 120px)" }}>
              <Chat
                messages={chatMessages}
                ws={ws}
                playerId={playerId}
                context="day"
                disabled={false}
              />
            </div>
          ) : (
            <div className="p-4 flex flex-col items-center mt-4">
              <VotePhase
                gameState={gameState}
                playerId={playerId}
                ws={ws}
                phase={phase}
              />
            </div>
          )}

          {/* Result overlay */}
          {voteResultMsg && <ResultCountdown message={voteResultMsg} />}
        </div>
      )}
    </div>
  );
}
