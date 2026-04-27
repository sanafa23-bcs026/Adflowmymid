"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CreateAdRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/ads/new");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0b14] text-white px-4">
      <div className="text-center max-w-sm">
        <h1 className="text-2xl font-black mb-3">Redirecting to Post Ad</h1>
        <p className="text-gray-400">Please wait while we take you to the ad submission page.</p>
      </div>
    </div>
  );
}
