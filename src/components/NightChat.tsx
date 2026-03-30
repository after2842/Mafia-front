import React, { useState, useRef, useEffect } from "react";
import { ChevronUp, Trophy, Crosshair } from "lucide-react";
import { MafiaKillBoardModal } from "./MafiaKillBoard";
import Chat from "./Chat";

interface QuizQuestion {
  question: string;
}

interface Player {
  id: string;
  nickname: string;
}

interface ChatMessage {
  sender: string;
  sender_id?: string;
  text: string;
  timestamp?: number;
  isSystem?: boolean;
}

interface NightChatProps {
  quiz: QuizQuestion | null;
  quizScore: number;
  quizTaken: boolean;
  nightAnswers: string[];
  ws: { send: (data: object) => void };
  chatMessages?: ChatMessage[];
  playerId?: string;
  // role-specific
  myRole?: string;
  alivePlayers?: Player[];
  sharedTargetName?: string;
  boardOpen?: boolean;
  onBoardOpen?: () => void;
  onBoardClose?: () => void;
  onKill?: (targetId: string) => void;
  pendingKillId?: string | null;
  onInvestigate?: (player: Player) => void;
  pendingInvestigateId?: string | null;
}

export function NightChat({
  quiz,
  quizScore,
  quizTaken,
  nightAnswers,
  ws,
  chatMessages = [],
  playerId,
  myRole,
  alivePlayers = [],
  sharedTargetName,
  boardOpen,
  onBoardOpen,
  onBoardClose,
  onKill,
  pendingKillId,
  onInvestigate,
  pendingInvestigateId,
}: NightChatProps) {
  const [inputValue, setInputValue] = useState("");
  const [activeTab, setActiveTab] = useState<"chat" | "quiz">("chat");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [nightAnswers.length]);

  const handleQuizSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    ws.send({ type: "quiz_answer", answer: inputValue.trim() });
    setInputValue("");
  };

  return (
    <div className="fixed inset-0 z-40 bg-white flex flex-col">
      {/* Mafia kill board modal — overlaid on top */}
      {myRole === "mafia" && boardOpen && onKill && onBoardClose && (
        <MafiaKillBoardModal
          players={alivePlayers}
          selectedId={pendingKillId ?? null}
          sharedTargetName={sharedTargetName}
          onSelect={onKill}
          onClose={onBoardClose}
        />
      )}

      <div className="w-full flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex-none p-4 border-b-2 border-black bg-white flex items-center justify-between">
          <h2 className="text-2xl font-black uppercase tracking-tighter text-black leading-none">
            Night
          </h2>
          <div className="flex items-center gap-2">
            {/* Mafia: reopen kill board */}
            {myRole === "mafia" && !boardOpen && onBoardOpen && (
              <button
                onClick={onBoardOpen}
                className="flex items-center gap-1.5 border-2 border-black px-3 py-1.5 rounded-lg bg-black text-white text-xs font-black uppercase tracking-widest cursor-pointer hover:bg-zinc-800 transition-colors font-[inherit]"
              >
                <Crosshair className="w-3.5 h-3.5" />
                Kill Board
                {sharedTargetName && <span>🎯</span>}
              </button>
            )}
            {/* Points badge */}
            <div className="flex items-center gap-2 border-2 border-black px-3 py-1.5 rounded-lg bg-yellow-400">
              <Trophy className="w-4 h-4 text-black" />
              <span className="text-sm font-black text-black uppercase tracking-widest">
                {quizScore} PTS
              </span>
            </div>
          </div>
        </div>

        {/* Journalist investigate section */}
        {myRole === "journalist" && (
          <div className="flex-none border-b-2 border-black bg-zinc-50 p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase tracking-widest text-black">
                🔍 Investigation
              </span>
              {pendingInvestigateId && (
                <span className="text-xs font-black bg-black text-white px-2 py-0.5 rounded uppercase tracking-widest">
                  Investigating
                </span>
              )}
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {alivePlayers.map((p) => {
                const isSelected = pendingInvestigateId === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => onInvestigate?.(p)}
                    className={`rounded-lg min-h-[40px] flex items-center justify-center text-xs font-black uppercase tracking-wide border-2 border-black cursor-pointer transition-all font-[inherit] ${
                      isSelected
                        ? "bg-black text-white -translate-y-0.5 -translate-x-0.5 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.3)]"
                        : "bg-white text-black hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                    }`}
                  >
                    {p.nickname}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab bar: Chat / Quiz */}
        <div className="flex border-b-2 border-black bg-white">
          <button
            onClick={() => setActiveTab("chat")}
            className={`flex-1 py-2.5 font-black text-sm uppercase tracking-widest border-r-2 border-black transition-colors font-[inherit] ${
              activeTab === "chat"
                ? "bg-yellow-400 text-black"
                : "bg-white text-zinc-500 hover:bg-zinc-50"
            }`}
          >
            Chat
          </button>
          <button
            onClick={() => setActiveTab("quiz")}
            className={`flex-1 py-2.5 font-black text-sm uppercase tracking-widest transition-colors font-[inherit] ${
              activeTab === "quiz"
                ? "bg-yellow-400 text-black"
                : "bg-white text-zinc-500 hover:bg-zinc-50"
            }`}
          >
            Quiz
            {quiz && !quizTaken && (
              <span className="ml-1.5 inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse align-middle" />
            )}
          </button>
        </div>

        {activeTab === "chat" ? (
          /* Chat tab */
          <div className="flex-1 overflow-hidden p-4 flex flex-col">
            <Chat
              messages={chatMessages}
              ws={ws}
              playerId={playerId}
              context="night"
              disabled={false}
            />
          </div>
        ) : (
          /* Quiz tab */
          <>
            {/* Quiz banner */}
            {quiz && !quizTaken ? (
              <div className="flex-none border-b-2 border-black bg-zinc-100 p-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-white uppercase tracking-widest bg-black px-2 py-1 rounded flex-shrink-0">
                    Q
                  </span>
                  <span className="text-sm text-black font-bold uppercase tracking-wide flex-1">
                    {quiz.question}
                  </span>
                </div>
              </div>
            ) : quizTaken ? (
              <div className="flex-none border-b-2 border-black bg-blue-100 p-3 flex items-center gap-2 justify-center">
                <span className="text-sm font-black text-black uppercase tracking-widest">
                  ✓ Answered
                </span>
              </div>
            ) : null}

            {/* Answer feed — anonymous */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-zinc-50">
              {nightAnswers.length === 0 && (
                <div className="flex justify-center mt-4">
                  <span className="text-xs font-black uppercase tracking-widest text-zinc-400">
                    No answers yet
                  </span>
                </div>
              )}
              {nightAnswers.map((text, i) => (
                <div key={i} className="flex flex-col items-start">
                  <div className="px-5 py-3 text-sm font-bold leading-snug border-2 border-black max-w-[85%] bg-white text-black rounded-2xl rounded-tl-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    {text}
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Quiz input */}
            <div className="flex-none p-4 bg-white border-t-2 border-black">
              <form onSubmit={handleQuizSubmit} className="flex gap-3">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type answer..."
                  className="flex-1 bg-zinc-50 border-2 border-black rounded-xl px-4 py-3 text-sm font-bold text-black placeholder:text-zinc-400 focus:outline-none focus:bg-white transition-colors"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="w-8 h-8 rounded-xl hover:bg-zinc-800 disabled:bg-zinc-200 disabled:border-zinc-300 text-white disabled:text-zinc-400 flex items-center justify-center transition-all flex-shrink-0 cursor-pointer disabled:cursor-not-allowed font-[inherit]"
                >
                  <ChevronUp className="w-6 h-6 ml-0.5 text-black border border-2 rounded-lg" />
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
