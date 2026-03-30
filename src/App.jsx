import { useState, useCallback, useEffect, useRef } from "react";
import { Routes, Route, useNavigate, useSearchParams } from "react-router-dom";
import { useWebSocket } from "./hooks/useWebSocket";
import { LandingCard } from "./components/Home";
import Lobby from "./components/Lobby";
import Game from "./components/Game";
import DevPreview from "./components/DevPreview";

const ANIMALS = [
  "Fox",
  "Owl",
  "Bear",
  "Wolf",
  "Deer",
  "Hawk",
  "Lynx",
  "Hare",
  "Seal",
  "Crow",
  "Dove",
  "Swan",
  "Orca",
  "Puma",
  "Lion",
  "Ibis",
  "Wren",
  "Newt",
  "Frog",
  "Moth",
  "Crab",
  "Mole",
  "Lamb",
  "Wasp",
];

function getRandomAnimal() {
  return (
    ANIMALS[Math.floor(Math.random() * ANIMALS.length)] +
    Math.floor(Math.random() * 100)
  );
}

export default function App() {
  const ws = useWebSocket();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [gameState, setGameState] = useState(null);
  const [playerId, setPlayerId] = useState(null);
  const [nickname, setNickname] = useState(() => getRandomAnimal());
  const [roomId, setRoomId] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [isHost, setIsHost] = useState(false);
  const [, setError] = useState(null);
  const [kicked, setKicked] = useState(false);
  const [revealedRoles, setRevealedRoles] = useState([]);
  const [showRoleIntro, setShowRoleIntro] = useState(false);
  const [roleIntroDismissed, setRoleIntroDismissed] = useState(false);
  const [nightAnswers, setNightAnswers] = useState([]);
  const [voteResultMsg, setVoteResultMsg] = useState(null);

  const gameStateRef = useRef(null);
  useEffect(() => { gameStateRef.current = gameState; }, [gameState]);

  useEffect(() => {
    const unsubs = [
      ws.addListener("room_joined", (data) => {
        setPlayerId(data.player_id);
        setRoomId(data.room_id);
        setIsHost(data.is_host);
        setGameState(data.game_state);
        setError(null);
        setKicked(false);
        setRevealedRoles([]);
        setChatMessages([]);
        setRoleIntroDismissed(false);
        navigate(`/lobby?room=${data.room_id}`);
      }),
      ws.addListener("room_state", (data) => {
        setGameState(data.game_state);
      }),
      ws.addListener("game_started", (data) => {
        setGameState(data.game_state);
        setChatMessages([]);
        setShowRoleIntro(true);
        setRoleIntroDismissed(false);
        navigate(`/game?room=${data.game_state.room_id}`);
      }),
      ws.addListener("game_state_update", (data) => {
        setGameState(data.game_state);
      }),
      ws.addListener("chat_message", (data) => {
        setChatMessages((prev) => [...prev, data.message]);
      }),
      ws.addListener("phase_change", (data) => {
        setGameState(data.game_state);
        setChatMessages([]);
        setNightAnswers([]);
        if (["night", "day"].includes(data.game_state.phase)) setVoteResultMsg(null);
      }),
      ws.addListener("night_answer", (data) => {
        setNightAnswers((prev) => [...prev, data.text]);
      }),
      ws.addListener("announcement", (data) => {
        const phase = gameStateRef.current?.phase;
        const isResult =
          (phase === "vote" && data.text.includes("tied")) ||
          (phase === "final_vote" &&
            (data.text.includes("executed") || data.text.includes("spared")));
        if (isResult) setVoteResultMsg(data.text);
        setChatMessages((prev) => [
          ...prev,
          {
            sender: "SYSTEM",
            text: data.text,
            timestamp: Date.now(),
            isSystem: true,
          },
        ]);
      }),
      ws.addListener("role_assigned", (data) => {
        setChatMessages((prev) => [
          ...prev,
          {
            sender: "SYSTEM",
            text: `Your role is ${data.role}.`,
            timestamp: Date.now(),
            isSystem: true,
          },
        ]);
      }),
      ws.addListener("player_eliminated", (data) => {
        setRevealedRoles((prev) => [
          ...prev,
          { nickname: data.nickname, role: data.role },
        ]);
        if (data.player_id === playerId) {
          setKicked(true);
        }
      }),
      ws.addListener("game_over", (data) => {
        setGameState(data.game_state);
      }),
      ws.addListener("error", (data) => {
        setError(data.message);
      }),
    ];
    return () => unsubs.forEach((fn) => fn());
  }, [ws, navigate, playerId]);

  const createRoom = useCallback(() => {
    ws.send({ type: "create_room", nickname });
  }, [ws, nickname]);

  const joinRoom = useCallback(
    (id) => {
      ws.send({ type: "join_room", room_id: id, nickname });
    },
    [ws, nickname]
  );

  const connectAndCreate = useCallback(
    (name) => {
      const n = name || nickname;
      if (name) setNickname(name);
      const tempId = "pending_" + Date.now();
      ws.connect(tempId, n);
      const unsub = ws.addListener("connected", () => {
        ws.send({ type: "create_room", nickname: n });
        unsub();
      });
    },
    [ws, nickname]
  );

  const connectAndJoin = useCallback(
    (id, name) => {
      const n = name || nickname;
      if (name) setNickname(name);
      ws.connect(id, n);
      const unsub = ws.addListener("connected", () => {
        ws.send({ type: "join_room", room_id: id, nickname: n });
        unsub();
      });
    },
    [ws, nickname]
  );

  // Ensure role card shows at the start of the first day even after refresh/reconnect
  useEffect(() => {
    if (
      gameState?.phase === "day" &&
      (gameState?.round || 1) === 1 &&
      !roleIntroDismissed
    ) {
      setShowRoleIntro(true);
    }
  }, [gameState?.phase, gameState?.round, roleIntroDismissed]);

  return (
    <div
      className={gameState?.phase === "night" ? "night-mode" : ""}
      style={{ minHeight: "100vh" }}
    >
      <Routes>
        <Route
          path="/"
          element={
            <div className="mt-24">
              <LandingCard
                onCreateRoom={connectAndCreate}
                onJoinRoom={connectAndJoin}
                inviteRoom={searchParams.get("room")}
              />
            </div>
          }
        />
        <Route
          path="/lobby"
          element={
            <Lobby
              gameState={gameState}
              isHost={isHost}
              playerId={playerId}
              ws={ws}
              roomId={roomId}
            />
          }
        />
        <Route
          path="/game"
          element={
            <Game
              gameState={gameState}
              playerId={playerId}
              ws={ws}
              chatMessages={chatMessages}
              kicked={kicked}
              revealedRoles={revealedRoles}
              nickname={nickname}
              isHost={isHost}
              nightAnswers={nightAnswers}
              showRoleIntro={showRoleIntro}
              voteResultMsg={voteResultMsg}
              dismissRoleIntro={() => {
                setShowRoleIntro(false);
                setRoleIntroDismissed(true);
              }}
            />
          }
        />
        <Route path="/dev" element={<DevPreview />} />
      </Routes>
    </div>
  );
}
