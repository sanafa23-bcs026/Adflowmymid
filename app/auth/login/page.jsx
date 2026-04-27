"use client";
import { useState } from "react";
import { supabase } from "../../../lib/supabase";

const ROLES = [
  { key: "buyer", label: "Buyer", icon: "🛒" },
  { key: "seller", label: "Seller", icon: "🏪" },
  { key: "moderator", label: "Mod", icon: "🛡️" },
  { key: "admin", label: "Admin", icon: "⚙️" },
];

export default function LoginPage() {
  const [role, setRole] = useState("buyer");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const email = e.target.email.value.trim();
    const password = e.target.password.value.trim();

    if (!email || !password) return setError("All fields required.");

    setLoading(true);

    const { error: err } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (err) {
      setError(err.message);
      setLoading(false);
      return;
    }

    window.location.href =
      role === "admin"
        ? "/admin"
        : role === "moderator"
        ? "/moderator"
        : "/dashboard";
  };

  const current = ROLES.find((r) => r.key === role);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#030306] via-[#0a0a1a] to-[#010102] flex items-center justify-center px-4 py-12 relative overflow-hidden">

      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] bg-purple-600/[0.08] rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-pink-500/[0.06] rounded-full blur-3xl" />

      <div className="w-full max-w-[380px] relative z-10">

        <a href="/" className="flex flex-col items-center gap-2 mb-8">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-600 flex items-center justify-center font-black text-white shadow-xl shadow-purple-900/40">
            A
          </div>
          <span className="text-gray-300 font-semibold text-sm tracking-wide">AdFlow Pro</span>
        </a>

        <div className="bg-white/[0.04] border border-white/[0.08] backdrop-blur-xl rounded-2xl p-6 shadow-2xl shadow-black/60">

          <h1 className="text-xl font-extrabold text-center mb-1">Welcome Back</h1>
          <p className="text-gray-500 text-xs text-center mb-5">Sign in to continue</p>

          <div className="mb-4">
            <p className="text-[10px] text-gray-600 uppercase tracking-widest mb-2">Sign in as</p>
            <div className="flex gap-1.5">
              {ROLES.map((r) => (
                <button
                  key={r.key}
                  type="button"
                  onClick={() => setRole(r.key)}
                  className={`flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl text-[11px] font-medium transition-all border ${
                    role === r.key
                      ? "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 border-transparent text-white shadow-lg shadow-purple-900/40"
                      : "border-white/[0.08] text-gray-500 hover:text-gray-300 hover:border-white/20 bg-white/[0.02]"
                  }`}
                >
                  <span className="text-sm">{r.icon}</span>
                  <span>{r.label}</span>
                </button>
              ))}
            </div>
            <p className="text-[10px] text-gray-600 mt-1.5 text-center">
              Logging in as: {current?.icon} {current?.label}
            </p>
          </div>

          {error && (
            <div className="bg-red-500/[0.08] border border-red-500/20 text-red-400 px-3 py-2 rounded-lg text-xs mb-3">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-3">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">✉</span>
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl pl-8 pr-4 py-2.5 text-sm text-white placeholder-gray-500"
              />
            </div>

            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">🔒</span>
              <input
                name="password"
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl pl-8 pr-12 py-2.5 text-sm text-white placeholder-gray-500"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-500"
              >
                {showPass ? "Hide" : "Show"}
              </button>
            </div>

            <button disabled={loading}
              className="w-full py-2.5 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-xl font-semibold text-sm">
              {loading ? "Signing in..." : `Sign In as ${current?.label}`}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}