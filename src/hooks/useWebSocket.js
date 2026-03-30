import { useRef, useState, useCallback, useEffect } from 'react'

export function useWebSocket() {
  const wsRef = useRef(null)
  const [connected, setConnected] = useState(false)
  const [lastMessage, setLastMessage] = useState(null)
  const listenersRef = useRef(new Map())
  const reconnectTimeoutRef = useRef(null)

  const addListener = useCallback((type, callback) => {
    if (!listenersRef.current.has(type)) {
      listenersRef.current.set(type, new Set())
    }
    listenersRef.current.get(type).add(callback)
    return () => listenersRef.current.get(type)?.delete(callback)
  }, [])

  const connect = useCallback((roomId, nickname) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const host = window.location.host
    const url = `${protocol}//${host}/ws/${roomId}?nickname=${encodeURIComponent(nickname)}`

    const ws = new WebSocket(url)
    wsRef.current = ws

    ws.onopen = () => {
      setConnected(true)
      listenersRef.current.get('connected')?.forEach(cb => cb())
    }

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        setLastMessage(data)
        listenersRef.current.get(data.type)?.forEach(cb => cb(data))
        listenersRef.current.get('*')?.forEach(cb => cb(data))
      } catch (e) {
        console.error('Failed to parse message:', e)
      }
    }

    ws.onclose = (event) => {
      setConnected(false)
      listenersRef.current.get('disconnected')?.forEach(cb => cb(event))
    }

    ws.onerror = (err) => {
      console.error('WebSocket error:', err)
    }
  }, [])

  const send = useCallback((data) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data))
    }
  }, [])

  const disconnect = useCallback(() => {
    clearTimeout(reconnectTimeoutRef.current)
    wsRef.current?.close()
    wsRef.current = null
    setConnected(false)
  }, [])

  useEffect(() => {
    return () => {
      clearTimeout(reconnectTimeoutRef.current)
      wsRef.current?.close()
    }
  }, [])

  return { connect, disconnect, send, connected, lastMessage, addListener }
}
