// components/SupportChatButton.jsx
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
      console.warn('Auth missing for support chat:', err)
      router.push('/auth/login')
    }
  }

  return (
    <button
      onClick={handleSupport}
      className="fixed bottom-6 right-6 bg-blue-500 text-white
                 w-14 h-14 rounded-full shadow-lg text-xl
                 hover:bg-blue-600 transition-all hover:scale-110 z-50"
      title="Support se baat karo"
    >
      💬
    </button>
  )
}