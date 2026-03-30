import { useState } from 'react'
import { NightChat } from './NightChat'

export default function NightPhase({ gameState, myRole, playerId, ws, nightAnswers, chatMessages }) {
  const [pendingKillId, setPendingKillId] = useState(null)
  const [pendingInvestigateId, setPendingInvestigateId] = useState(null)
  const [boardOpen, setBoardOpen] = useState(myRole === 'mafia')

  const alivePlayers = gameState.alive_players?.filter(p => p.id !== playerId) || []
  const sharedTargetName = gameState.mafia_current_target

  const quiz = gameState.current_quiz
  const quizScore = gameState.my_quiz_score ?? 0
  const quizTaken = gameState.quiz_taken ?? false

  const handleKill = (targetId) => {
    setPendingKillId(targetId)
    ws.send({ type: 'mafia_kill', target_id: targetId })
  }

  const handleInvestigate = (p) => {
    setPendingInvestigateId(p.id)
    ws.send({ type: 'journalist_investigate', target_id: p.id })
  }

  return (
    <NightChat
      quiz={quiz}
      quizScore={quizScore}
      quizTaken={quizTaken}
      nightAnswers={nightAnswers}
      chatMessages={chatMessages}
      playerId={playerId}
      ws={ws}
      myRole={myRole}
      alivePlayers={alivePlayers}
      sharedTargetName={sharedTargetName}
      boardOpen={boardOpen}
      onBoardOpen={() => setBoardOpen(true)}
      onBoardClose={() => setBoardOpen(false)}
      onKill={handleKill}
      pendingKillId={pendingKillId}
      onInvestigate={handleInvestigate}
      pendingInvestigateId={pendingInvestigateId}
    />
  )
}
