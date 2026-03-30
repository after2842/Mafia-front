import { useState } from 'react'
import NightPhase from './NightPhase'
import VotePhase from './VotePhase'
import GameOver from './GameOver'
import { MafiaCard } from './MafiaCard'
import { CitizenCard } from './CitizenCard'
import { JournalistCard } from './JournalistCard'
import { DayPhaseCard } from './DayPhaseCard'
import { EventCard } from './EventCards'

// Mock WebSocket — logs to console
const mockWs = { send: (data) => console.log('[mock ws]', data) }

const MOCK_PLAYERS = [
  { id: 'p1', nickname: '철수' },
  { id: 'p2', nickname: '영희' },
  { id: 'p3', nickname: '민준' },
  { id: 'p4', nickname: '지수' },
]

const BASE_GAME_STATE = {
  round: 2,
  alive_players: MOCK_PLAYERS,
  current_quiz: { question: '다윗이 골리앗을 쓰러뜨린 무기는?' },
  my_quiz_score: 3,
  quiz_taken: false,
  mafia_current_target: '영희',
  morning_report: [
    '💀 철수님이 마피아에 의해 제거되었습니다',
    '생존자들은 아침을 맞이했습니다',
  ],
  vote_target: { id: 'p2', nickname: '영희' },
  vote_counts: { p2: 2, p3: 1 },
  winner: null,
  all_players: [
    { id: 'p1', nickname: '철수', role: 'mafia', alive: false },
    { id: 'p2', nickname: '영희', role: 'citizen', alive: true },
    { id: 'p3', nickname: '민준', role: 'journalist', alive: true },
    { id: 'p4', nickname: '지수', role: 'citizen', alive: true },
  ],
}

const MOCK_NIGHT_ANSWERS = ['돌팔매', '새총', '물맷돌']

// ── Phone frame: contains fixed-position children via CSS transform trick ──
function PhoneFrame({ children }) {
  return (
    <div
      style={{
        position: 'relative',
        width: 390,
        height: 700,
        overflow: 'hidden',
        // CSS trick: transform creates new containing block for position:fixed children
        transform: 'translateZ(0)',
        borderRadius: 24,
        border: '2px solid #333',
        margin: '0 auto',
        background: '#000',
      }}
    >
      {children}
    </div>
  )
}

// ── Role Cards tab ──
function RoleCardsTab() {
  const [role, setRole] = useState('mafia')
  const [showOverlay, setShowOverlay] = useState(true)

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-2">
        {['mafia', 'citizen', 'journalist'].map(r => (
          <button
            key={r}
            onClick={() => { setRole(r); setShowOverlay(true) }}
            className={`px-3 py-1.5 rounded-full text-xs font-bold border cursor-pointer ${
              role === r ? 'bg-white text-black border-white' : 'bg-transparent text-gray-400 border-gray-600'
            }`}
          >
            {r === 'mafia' ? '마피아' : r === 'citizen' ? '시민' : '기자'}
          </button>
        ))}
      </div>

      <PhoneFrame>
        {showOverlay && (
          <div className="absolute inset-0 bg-black/75 flex items-center justify-center z-[2000] p-4">
            <div className="flex flex-col items-center gap-4">
              {role === 'mafia' && <MafiaCard />}
              {role === 'citizen' && <CitizenCard />}
              {role === 'journalist' && <JournalistCard />}
              <button
                className="w-full max-w-[320px] px-4 py-3 rounded-lg text-sm font-semibold bg-[#4361ee] text-white"
                onClick={() => setShowOverlay(false)}
              >
                확인 — 역할 숙지 완료
              </button>
            </div>
          </div>
        )}
        {!showOverlay && (
          <div className="flex items-center justify-center h-full text-gray-500 text-sm">
            오버레이 닫힘 —{' '}
            <button className="ml-1 underline text-white cursor-pointer" onClick={() => setShowOverlay(true)}>
              다시 열기
            </button>
          </div>
        )}
      </PhoneFrame>
    </div>
  )
}

// ── Night Phase tab ──
function NightPhaseTab() {
  const [role, setRole] = useState('citizen')

  const gameState = {
    ...BASE_GAME_STATE,
    phase: 'night',
    my_role: role,
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-2">
        {['citizen', 'journalist', 'mafia'].map(r => (
          <button
            key={r}
            onClick={() => setRole(r)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold border cursor-pointer ${
              role === r ? 'bg-white text-black border-white' : 'bg-transparent text-gray-400 border-gray-600'
            }`}
          >
            {r === 'mafia' ? '마피아' : r === 'citizen' ? '시민' : '기자'}
          </button>
        ))}
      </div>

      <PhoneFrame>
        <NightPhase
          key={role}
          gameState={gameState}
          myRole={role}
          playerId="p1"
          ws={mockWs}
          nightAnswers={MOCK_NIGHT_ANSWERS}
        />
      </PhoneFrame>
    </div>
  )
}

// ── Day Phase tab ──
function DayPhaseTab() {
  return (
    <div className="flex flex-col gap-3 max-w-[400px] mx-auto">
      <DayPhaseCard round={2} />
      <EventCard variant="death" text="철수님이 마피아에 의해 제거되었습니다" />
      <EventCard variant="saved" text="영희님이 구조되었습니다" />
      <EventCard variant="nothing" text="조용한 밤이었습니다" />
      <EventCard variant="investigate" text="수사 결과: 민준 → 마피아" />
    </div>
  )
}

// ── Vote Phase tab ──
function VotePhaseTab() {
  const [subPhase, setSubPhase] = useState('vote')

  const gameState = {
    ...BASE_GAME_STATE,
    phase: subPhase,
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 justify-center">
        {['vote', 'last_defense', 'final_vote'].map(p => (
          <button
            key={p}
            onClick={() => setSubPhase(p)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold border cursor-pointer ${
              subPhase === p ? 'bg-white text-black border-white' : 'bg-transparent text-gray-400 border-gray-600'
            }`}
          >
            {p === 'vote' ? '투표' : p === 'last_defense' ? '최후변론' : '최종투표'}
          </button>
        ))}
      </div>

      <div className="max-w-[400px] mx-auto w-full bg-white rounded-xl overflow-hidden">
        <VotePhase
          key={subPhase}
          gameState={gameState}
          playerId="p1"
          ws={mockWs}
          chatMessages={[]}
          phase={subPhase}
        />
      </div>
    </div>
  )
}

// ── Game Over tab ──
function GameOverTab() {
  const [winner, setWinner] = useState('citizen')

  const gameState = {
    ...BASE_GAME_STATE,
    winner,
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 justify-center">
        {['citizen', 'mafia'].map(w => (
          <button
            key={w}
            onClick={() => setWinner(w)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold border cursor-pointer ${
              winner === w ? 'bg-white text-black border-white' : 'bg-transparent text-gray-400 border-gray-600'
            }`}
          >
            {w === 'citizen' ? '시민 승리' : '마피아 승리'}
          </button>
        ))}
      </div>

      <GameOver gameState={gameState} myRole="citizen" revealedRoles={[]} />
    </div>
  )
}

// ── Main DevPreview ──
const TABS = [
  { id: 'roles',    label: '역할 카드' },
  { id: 'night',   label: '밤' },
  { id: 'day',     label: '낮' },
  { id: 'vote',    label: '투표' },
  { id: 'gameover',label: '게임 종료' },
]

export default function DevPreview() {
  const [activeTab, setActiveTab] = useState('roles')

  return (
    <div className="min-h-screen bg-[#111] text-white">
      {/* Dev banner */}
      <div className="bg-[#1a1a1a] border-b border-[#333] px-4 py-2 flex items-center gap-2">
        <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">DEV PREVIEW</span>
        <span className="text-xs text-gray-500">— localhost only</span>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 px-3 py-2 border-b border-[#222] overflow-x-auto">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
              activeTab === tab.id
                ? 'bg-[#4361ee] text-white'
                : 'bg-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-4">
        {activeTab === 'roles'    && <RoleCardsTab />}
        {activeTab === 'night'    && <NightPhaseTab />}
        {activeTab === 'day'      && <DayPhaseTab />}
        {activeTab === 'vote'     && <VotePhaseTab />}
        {activeTab === 'gameover' && <GameOverTab />}
      </div>
    </div>
  )
}
