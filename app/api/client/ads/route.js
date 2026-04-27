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
export async function POST(request) {
  try {
    const formData = await request.formData();

    const title = formData.get("title") || "";
    const description = formData.get("description") || "";

    return Response.json({
      success: true,
      title,
      description,
    });

  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}