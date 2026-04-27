'use client'

import { useRouter } from 'next/navigation'
import { startAdminChat } from '@/lib/chatService'
import { supabase } from '@/lib/supabase'

export default function SupportChatButton() {
  const router = useRouter()

  async function handleSupport() {
    try {
      const { data, error } = await supabase.auth.getUser()
      const user = data?.user
      if (error || !user) {
        router.push('/auth/login')
        return
      }

      const conversation = await startAdminChat(user.id)
      router.push(`/chat/${conversation.id}`)
    } catch (err) {
      console.warn('Support chat error:', err)
      router.push('/auth/login')
    }
  }

  return (
    <button
      onClick={handleSupport}
      className="fixed bottom-6 right-6 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-violet-600 text-white shadow-xl shadow-purple-900/30 transition hover:scale-105 hover:bg-purple-600"
      title="Support chat"
    >
      💬
    </button>
  )
}
