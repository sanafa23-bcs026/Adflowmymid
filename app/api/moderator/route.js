'use client'
import { useRouter } from 'next/navigation'

export default function BackButton() {
  const router = useRouter()
  return (
    <button onClick={() => router.back()} className="flex items-center gap-2 p-2">
      ← Back
    </button>
  )
}
export async function GET() {
  return Response.json({
    message: "Moderator review queue",
  });
}