import { FinalResultCard } from './FinalResult'

const ROLE_KO = { mafia: '마피아', journalist: '기자', citizen: '시민' }

function toTeam(role) {
  return role === 'mafia' ? 'mafia' : 'citizen'
}

export default function GameOver({ gameState }) {
  const winner = gameState.winner
  const allPlayers = gameState.all_players || []

  const players = allPlayers.map((p) => ({
    id: p.id || p.nickname,
    name: p.nickname,
    role: ROLE_KO[p.role] || p.role,
    team: toTeam(p.role),
    status: p.alive ? 'alive' : 'dead',
  }))

  return (
    <div className="min-h-screen bg-zinc-50 flex items-start justify-center p-4 pt-6">
      <FinalResultCard
        winner={winner}
        players={players}
        onReturnToLobby={() => (window.location.href = '/')}
      />
    </div>
  )
}
