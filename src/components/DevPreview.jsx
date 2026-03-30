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
  { id: 'p1', nickname: 'James' },
  { id: 'p2', nickname: 'Sarah' },
  { id: 'p3', nickname: 'Mike' },
  { id: 'p4', nickname: 'Lily' },
]

const BASE_GAME_STATE = {
  round: 2,
  alive_players: MOCK_PLAYERS,
  current_quiz: { question: 'What weapon did David use to defeat Goliath?' },
  my_quiz_score: 3,
  quiz_taken: false,
  mafia_current_target: 'Sarah',
  morning_report: [
    '💀 James was eliminated by the Mafia',
    'The survivors have made it to morning',
  ],
  vote_target: { id: 'p2', nickname: 'Sarah' },
  vote_counts: { p2: 2, p3: 1 },
  winner: null,
  all_players: [
    { id: 'p1', nickname: 'James', role: 'mafia', alive: false },
    { id: 'p2', nickname: 'Sarah', role: 'citizen', alive: true },
    { id: 'p3', nickname: 'Mike', role: 'journalist', alive: true },
    { id: 'p4', nickname: 'Lily', role: 'citizen', alive: true },
  ],
}

const MOCK_NIGHT_ANSWERS = ['Sling', 'Slingshot', 'Stone']

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
            {r === 'mafia' ? 'Mafia' : r === 'citizen' ? 'Citizen' : 'Journalist'}
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
                Confirm — Role Understood
              </button>
            </div>
          </div>
        )}
        {!showOverlay && (
          <div className="flex items-center justify-center h-full text-gray-500 text-sm">
            Overlay closed —{' '}
            <button className="ml-1 underline text-white cursor-pointer" onClick={() => setShowOverlay(true)}>
              Reopen
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
            {r === 'mafia' ? 'Mafia' : r === 'citizen' ? 'Citizen' : 'Journalist'}
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
      <EventCard variant="death" text="James was eliminated by the Mafia" />
      <EventCard variant="saved" text="Sarah was rescued" />
      <EventCard variant="nothing" text="It was a quiet night" />
      <EventCard variant="investigate" text="Investigation result: Mike → Mafia" />
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
            {p === 'vote' ? 'Vote' : p === 'last_defense' ? 'Final Defense' : 'Final Vote'}
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
            {w === 'citizen' ? 'Citizen Win' : 'Mafia Win'}
          </button>
        ))}
      </div>

      <GameOver gameState={gameState} myRole="citizen" revealedRoles={[]} />
    </div>
  )
}

// ── Main DevPreview ──
const TABS = [
  { id: 'roles',    label: 'Role Cards' },
  { id: 'night',   label: 'Night' },
  { id: 'day',     label: 'Day' },
  { id: 'vote',    label: 'Vote' },
  { id: 'gameover',label: 'Game Over' },
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
