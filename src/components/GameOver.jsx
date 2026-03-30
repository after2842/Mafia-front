import { FinalResultCard } from './FinalResult'

const ROLE_LABEL = { mafia: 'Mafia', journalist: 'Journalist', citizen: 'Citizen' }

function toTeam(role) {
  return role === 'mafia' ? 'mafia' : 'citizen'
}

export default function GameOver({ gameState }) {
  const winner = gameState.winner
  const allPlayers = gameState.all_players || []

  const players = allPlayers.map((p) => ({
    id: p.id || p.nickname,
    name: p.nickname,
    role: ROLE_LABEL[p.role] || p.role,
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
