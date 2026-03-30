import { useState, useRef, useEffect } from 'react'

export default function Chat({ messages, ws, playerId, context, disabled }) {
  const [text, setText] = useState('')
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  const send = () => {
    if (!text.trim() || disabled) return
    ws.send({ type: 'chat', text: text.trim(), context })
    setText('')
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto py-2 min-h-[200px] max-h-[400px]">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 text-[13px] p-5">
            No messages yet
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className="py-1 text-[13px] animate-[fadeIn_0.2s_ease]">
            {msg.isSystem ? (
              <span className="text-amber-400 italic">{msg.text}</span>
            ) : (
              <>
                <span className={`font-semibold ${msg.sender_id === playerId ? 'text-[#4361ee]' : ''}`}>
                  {msg.sender}
                </span>
                <span className="text-gray-500">: </span>
                <span>{msg.text}</span>
              </>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {!disabled && (
        <div className="flex gap-2 pt-2">
          <input
            className="flex-1 w-full px-4 py-3 border border-gray-300 rounded-lg text-base outline-none focus:border-[#4361ee] transition-colors"
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="Type a message..."
          />
          <button
            className="inline-flex items-center justify-center px-5 py-3 rounded-lg text-sm font-semibold transition-all min-h-[48px] bg-[#4361ee] text-white hover:bg-[#3a56d4] disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={send}
            disabled={!text.trim()}
          >
            Send
          </button>
        </div>
      )}
    </div>
  )
}
