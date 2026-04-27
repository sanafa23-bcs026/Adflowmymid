'use client'
import { useRouter } from 'next/navigation'

export default function BackButton() {
  const router = useRouter()
  return (
    <button 
      onClick={() => router.back()} 
      className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-white hover:bg-white/[0.06] rounded-xl transition text-sm"
    >
      ← Back
    </button>
  )
}