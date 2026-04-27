'use client'

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    supabase.auth.getSession()
      .then(({ data }) => {
        const u = data.session?.user || null;
        setUser(u);
        setRole(u?.user_metadata?.role || null);
      })
      .catch(() => {
        setUser(null);
        setRole(null);
      });

    const { data: { subscription } } =
      supabase.auth.onAuthStateChange((_e, s) => {
        const u = s?.user || null;
        setUser(u);
        setRole(u?.user_metadata?.role || null);
      });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#05060f]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 text-white">
        <a href="/" className="flex items-center gap-3 text-lg font-black tracking-tight text-white">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-fuchsia-500 text-sm shadow-xl shadow-purple-500/20">A</span>
          AdFlow Pro
        </a>

        <nav className="hidden gap-6 md:flex">
          <a href="/ads" className="text-sm text-slate-300 hover:text-white transition">Explore</a>
          <a href="/categories" className="text-sm text-slate-300 hover:text-white transition">Categories</a>
          <a href="/packages" className="text-sm text-slate-300 hover:text-white transition">Packages</a>
          <a href="/cart" className="text-sm text-slate-300 hover:text-white transition">Cart</a>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <a href="/dashboard" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-white/10">Dashboard</a>
              <button
                onClick={async () => {
                  await supabase.auth.signOut();
                  window.location.href = "/";
                }}
                className="rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:opacity-90"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <a href="/auth/login" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-white/10">Login</a>
              <a href="/auth/register" className="rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:opacity-90">Sign up</a>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
