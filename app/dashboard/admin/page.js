"use client";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [ads, setAds] = useState([]);

  useEffect(() => {
    fetch("/api/ads")
      .then((res) => res.json())
      .then((data) => setAds(data || []));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#030306] via-[#0a0a1a] to-[#010102] p-8 text-white">

      {/* Header */}
      <h1 className="text-3xl font-extrabold mb-8 tracking-tight">
        Admin Dashboard <span className="text-purple-400">📊</span>
      </h1>

      {/* Cards */}
      <div className="grid md:grid-cols-3 gap-6">

        {/* Total Ads */}
        <div className="bg-white/[0.04] border border-white/[0.08] backdrop-blur-xl p-6 rounded-2xl text-center shadow-xl hover:shadow-purple-900/20 transition">
          <h2 className="text-sm text-gray-400 mb-2">Total Ads</h2>
          <p className="text-3xl font-extrabold bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
            {ads.length}
          </p>
        </div>

        {/* Featured Ads */}
        <div className="bg-white/[0.04] border border-white/[0.08] backdrop-blur-xl p-6 rounded-2xl text-center shadow-xl hover:shadow-pink-900/20 transition">
          <h2 className="text-sm text-gray-400 mb-2">Featured Ads</h2>
          <p className="text-3xl font-extrabold bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
            {ads.filter(a => a.is_featured).length}
          </p>
        </div>

        {/* Active Ads */}
        <div className="bg-white/[0.04] border border-white/[0.08] backdrop-blur-xl p-6 rounded-2xl text-center shadow-xl hover:shadow-indigo-900/20 transition">
          <h2 className="text-sm text-gray-400 mb-2">Active Ads</h2>
          <p className="text-3xl font-extrabold bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
            {ads.length}
          </p>
        </div>

      </div>

      {/* Extra Glow (optional premium feel) */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-purple-600/[0.07] blur-3xl rounded-full pointer-events-none" />
    </div>
  );
}