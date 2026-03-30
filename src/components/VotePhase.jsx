import { useState, useEffect } from 'react'
import { User } from 'lucide-react'
import { PlayerVotingCard } from './VotingCard'
import { DefenseVotingCard } from './FinalVerdictVote'

export default function VotePhase({ gameState, playerId, ws, phase }) {
  const [voted, setVoted] = useState(false)
  const alivePlayers = gameState.alive_players?.filter(p => p.id !== playerId) || []
  const voteTarget = gameState.vote_target
  const voteCounts = gameState.vote_counts || {}

  // Reset voted state on phase change
  useEffect(() => { setVoted(false) }, [phase])

  const castVote = (targetId) => {
    if (voted) return
    if (phase === 'vote') {
      ws.send({ type: 'vote', target_id: targetId })
    } else {
      ws.send({ type: 'final_vote', decision: targetId }) // 'kill' or 'save'
    }
    setVoted(true)
  }

  return (
    <div className="w-full">

      {/* ── Day preview (vote tab opened before vote phase) ── */}
      {phase === 'day' && (
        <div className="w-full max-w-lg mx-auto bg-white border-2 border-black rounded-xl p-5 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-2xl font-black text-black uppercase tracking-tight mb-1">Vote</h2>
          <p className="text-zinc-500 font-medium text-sm mb-5">Voting begins after daytime discussion ends</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {alivePlayers.map(p => (
              <div key={p.id} className="flex items-center p-3 rounded-xl border-2 border-dashed border-zinc-300 opacity-60">
                <div className="w-10 h-10 rounded-full border-2 border-zinc-300 bg-zinc-100 flex items-center justify-center mr-3 shrink-0">
                  <User className="w-5 h-5 text-zinc-400" />
                </div>
                <span className="font-bold text-zinc-400">{p.nickname}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Elimination vote ── */}
      {phase === 'vote' && (
        <>
          <PlayerVotingCard
            players={alivePlayers}
            voteCounts={voteCounts}
            onVote={castVote}
            isVoting={voted}
          />
          {voted && (
            <div className="mt-3 text-xs text-teal-600 text-center font-black uppercase tracking-widest">
              ✓ Vote cast — waiting for other players...
            </div>
          )}
        </>
      )}

      {/* ── Last defense waiting screen ── */}
      {phase === 'last_defense' && (
        <div className="w-full max-w-lg mx-auto bg-white border-2 border-black rounded-xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center">
          <p className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-3">Final Defense</p>
          <h2 className="text-3xl font-black text-black uppercase tracking-tighter mb-2">
            {voteTarget?.nickname}
          </h2>
          <p className="text-sm font-bold text-zinc-600 uppercase tracking-wide">
            Please listen to their defense.
          </p>
          <p className="mt-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">
            Voting begins after the defense ends
          </p>
        </div>
      )}

      {/* ── Final Yes/No vote ── */}
      {phase === 'final_vote' && (
        <div className="flex justify-center mt-4">
          <DefenseVotingCard
            name={voteTarget?.nickname || ''}
            onExecute={() => castVote('kill')}
            onPardon={() => castVote('save')}
            voted={voted}
          />
        </div>
      )}

    </div>
  )
}
