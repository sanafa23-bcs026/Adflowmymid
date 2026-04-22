"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";

const ROLES = ["Buyer (Default)", "Seller", "Moderator"];

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    const name = e.target.name.value.trim();
    const email = e.target.email.value.trim();
    const password = e.target.password.value.trim();
    const role = e.target.role.value;

    if (!name || !email || !password) return setError("All fields are required.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");

    setLoading(true);
    const { error: authError } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: name, role } },
    });

    if (authError) { setError(authError.message); setLoading(false); return; }
    setSuccess(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0d0d1a] flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 mb-3 text-xl font-black">A</div>
          <p className="text-gray-300 font-semibold">AdFlow Pro</p>
        </div>

        <div className="bg-[#13131f] border border-white/10 rounded-2xl p-7 shadow-2xl">
          {success ? (
            <div className="text-center py-8">
              <div className="text-5xl mb-4">🎉</div>
              <h2 className="font-black text-xl mb-2">Application Submitted!</h2>
              <p className="text-gray-400 text-sm mb-6">Check your email to confirm your account.</p>
              <button onClick={() => router.push("/auth/login")}
                className="bg-violet-600 hover:bg-violet-500 px-6 py-2.5 rounded-xl text-sm font-semibold transition">
                Go to Sign In →
              </button>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-black mb-1 text-center">Apply for Account</h1>
              <p className="text-gray-500 text-sm text-center mb-6">Join the marketplace. Subject to approval.</p>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-3 py-2.5 rounded-xl text-sm mb-4">{error}</div>
              )}

              <form onSubmit={handleRegister} className="space-y-3">
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider mb-1.5 block">Requested Role</label>
                  <select name="role"
                    className="w-full bg-[#0d0d1a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-violet-500 transition">
                    {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider mb-1.5 block">Full Name</label>
                  <input name="name" placeholder="John Doe"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-violet-500 transition" />
                </div>

                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider mb-1.5 block">Email</label>
                  <input name="email" type="email" placeholder="user@example.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-violet-500 transition" />
                </div>

                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider mb-1.5 block">Password</label>
                  <div className="relative">
                    <input name="password" type={showPass ? "text" : "password"} placeholder="••••••••"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-10 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-violet-500 transition" />
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white text-sm">
                      {showPass ? "🙈" : "👁"}
                    </button>
                  </div>
                </div>

                <button disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 disabled:opacity-50 rounded-xl font-bold text-sm transition mt-2">
                  {loading ? "Submitting..." : "Submit Application"}
                </button>
              </form>

              <p className="text-center text-gray-600 text-xs mt-4">
                Already have an account?{" "}
                <a href="/auth/login" className="text-violet-400 hover:underline">Sign In</a>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}