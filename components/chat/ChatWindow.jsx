'use client'
import { useState, useEffect, useRef } from 'react'
import { getMessages, sendMessage, subscribeToMessages } from '@/lib/chatService'
import { supabase } from '@/lib/supabase'

export default function ChatWindow({ conversationId, currentUserRole }) {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState(null)
  const bottomRef = useRef(null)

  useEffect(() => {
    supabase.auth.getUser()
      .then(({ data, error }) => {
        if (error || !data?.user) {
          setUserId(null)
          return
        }
        setUserId(data.user.id)
      })
      .catch(() => setUserId(null))
  }, [])

  useEffect(() => {
    if (!conversationId) return
    loadMessages()

    const channel = subscribeToMessages(conversationId, (payload) => {
      setMessages(prev => [...prev, payload.new])
      scrollToBottom()
    })

    return () => supabase.removeChannel(channel)
  }, [conversationId])

  async function loadMessages() {
    try {
      const data = await getMessages(conversationId)
      setMessages(data)
      setLoading(false)
      scrollToBottom()
    } catch (err) {
      console.error(err)
      setLoading(false)
    }
  }

  function scrollToBottom() {
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
  }

  async function handleSend(e) {
    e.preventDefault()
    if (!newMessage.trim() || !userId) return

    try {
      await sendMessage(conversationId, userId, currentUserRole, newMessage.trim())
      setNewMessage('')
    } catch (err) {
      console.error('Message send error:', err)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>
  )

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <p className="text-center text-gray-400 text-sm mt-8">
            Abhi koi message nahi. Pehla message bhejo! 👋
          </p>
        )}
        {messages.map((msg) => {
          const isMe = msg.sender_id === userId
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm
                ${isMe
                  ? 'bg-blue-500 text-white rounded-br-sm'
                  : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                }`}>
                {!isMe && (
                  <p className="text-xs font-semibold mb-1 capitalize text-blue-600">
                    {msg.sender_role}
                  </p>
                )}
                <p>{msg.content}</p>
                <p className={`text-xs mt-1 ${isMe ? 'text-blue-100' : 'text-gray-400'}`}>
                  {new Date(msg.created_at).toLocaleTimeString('ur-PK', {
                    hour: '2-digit', minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="border-t border-gray-100 p-3 flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Message likhein..."
          className="flex-1 px-4 py-2 bg-gray-50 rounded-full text-sm border border-gray-200
                     focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50"
        />
        <button
          type="submit"
          disabled={!newMessage.trim()}
          className="px-4 py-2 bg-blue-500 text-white rounded-full text-sm font-medium
                     hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed
                     transition-colors"
        >
          Send ➤
        </button>
      </form>
    </div>
  )
}