'use client'
import { useRouter } from 'next/navigation'
import ChatWindow from '@/components/chat/ChatWindow'
import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'

export default function ChatPage({ params }) {
  const router = useRouter()
  const [userRole, setUserRole] = useState('customer')

  useEffect(() => {
    supabase.auth.getUser().then(({ data, error }) => {
      const user = data?.user
      if (error || !user) {
        router.push('/auth/login')
        return
      }
      const role = user.user_metadata?.role || 'customer'
      setUserRole(role)
    }).catch((err) => {
      console.error('Auth lookup failed:', err)
      router.push('/auth/login')
    })
  }, [router])

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header with Back Button */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          ← Back
        </button>
        <h1 className="font-semibold text-gray-800">Chat</h1>
      </div>

      {/* Chat Window */}
      <div className="flex-1 p-4">
        <ChatWindow
          conversationId={params.conversationId}
          currentUserRole={userRole}
        />
      </div>
    </div>
  )
}